/* @flow */
import type { Rate } from './DataSources/RatesDS';
import { getRatesLastFetchAsync,  updateRatesLastFetchAsync, saveRatesLastFetchAsync, getRatesAsync, updateRatesAsync, saveRatesAsync } from './DataSources/RatesDS';

export default class CurrencyConverter {

  static async convertCurrency(currencyCode: string, amount: number) {
    if (currencyCode === 'CZK') {
      return amount;
    }
    let rate = await this.getRate(currencyCode);
    let convertedAmount = amount / rate.amount * rate.rate;
    return convertedAmount;
  }

  static async getRate(currencyCode: string) {
    let rates = await this.getCurrentRates();
    let rate = rates.find((rate) => rate.code === currencyCode);
    return rate;
  }

  static async getCurrentRates() {
    let ratesText;
    let rates;
    let lastFetch = await getRatesLastFetchAsync();
    if (lastFetch) {
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      if (lastFetch < today) {
        ratesText = await this.fetchRates();
        rates = this.parseRates(ratesText);
        updateRatesAsync(rates);
      } else {
        rates = await getRatesAsync();
      }
    } else {
      ratesText = await this.fetchRates();
      rates = this.parseRates(ratesText);
      saveRatesAsync(rates);
    }
    return rates;
  }

  static async fetchRates() {
    try {
      let response = await fetch('https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt', {
        method: 'GET',
        headers: {
          'Accept': 'text/plain'
        }
      });
      let responseText = await response.text();
      return responseText;
    } catch(error) {
      console.log('fetchRates error:');
      console.log(error);
    }
  }

  static parseRates(rates: string): Array<Rate> {
    let lines = rates.split(/\r?\n/);
    let ratesLines = lines.slice(2, lines.length - 1);
    let result = ratesLines.map((line) => {
      let columns = line.split('|');
      return {
        country: columns[0],
        currency: columns[1],
        amount: parseInt(columns[2]),
        code: columns[3],
        rate: parseFloat(columns[4].replace(',', '.'))
      }
    });
    return result;
  }
}
