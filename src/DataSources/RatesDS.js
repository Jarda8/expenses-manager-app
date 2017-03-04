/* @flow */
import { DB } from './DB';

export type Rate = {
  country: string,
  currency: string,
  amount: number,
  code: string,
  rate: number
}

function getRatesLastFetch(callback: (result: Date) => void) {
  DB.ratesLastFetch.get_all(result => {
    let lastFetch = null;
    if (Object.keys(result.rows).length > 0) {
      lastFetch = new Date(result.rows[Object.keys(result.rows)[0]].date);
    }
    callback(lastFetch);
  });
}

async function getRatesLastFetchAsync() {
  return new Promise((resolve,reject) => {
    DB.ratesLastFetch.get_all(result => {
      let lastFetch = null;
      if (Object.keys(result.rows).length > 0) {
        lastFetch = new Date(result.rows[Object.keys(result.rows)[0]].date);
      }
      resolve(lastFetch);
    });
  });
}

function updateRatesLastFetch(oldLastFetch: Date, newLastFetch: Date) {
  DB.ratesLastFetch.update({date: oldLastFetch}, {date: newLastFetch});
}

async function updateRatesLastFetchAsync(oldLastFetch: Date, newLastFetch: Date) {
  return new Promise((resolve,reject) => {
    DB.ratesLastFetch.update({date: oldLastFetch}, {date: newLastFetch}, () => resolve());
  });
}

function saveRatesLastFetch(lastFetch: Date) {
  DB.ratesLastFetch.add({date: lastFetch});
}

async function saveRatesLastFetchAsync(lastFetch: Date) {
  return new Promise((resolve,reject) => {
    DB.ratesLastFetch.add({date: lastFetch}, resolve);
  });
}

function getRates(callback: (result: Array<Rate>) => void) {
  DB.rates.get_all(result => {
    let resultArray: Array<Account> = [];
    Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
    callback(resultArray);
  });
}

async function getRatesAsync() {
  return new Promise((resolve,reject) => {
    DB.rates.get_all(result => {
      let resultArray: Array<Rate> = [];
      Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
      resolve(resultArray);
    });
  });
}

function updateRates(newRates: Array<Rate>) {
  for (rate of newRates) {
    DB.rates.update({code: rate.code}, rate);
  }
}

async function updateRatesAsync(newRates: Array<Rate>) {
  for (rate of newRates) {
    let updatePromise = new Promise((resolve,reject) => {
      DB.rates.update({code: rate.code}, rate, resolve);
    });
    await updatePromise;
  }
  updateRatesLastFetchAsync(new Date());
}

function saveRates(rates: Array<Rate>) {
  for (rate of rates) {
    DB.rates.add(rate);
  }
}

async function saveRatesAsync(rates: Array<Rate>) {
  for (rate of rates) {
    let savePromise = new Promise((resolve,reject) => {
      DB.rates.add(rate, resolve);
    });
    await savePromise;
  }
  saveRatesLastFetchAsync(new Date());
}

export { getRatesLastFetchAsync,  updateRatesLastFetchAsync, saveRatesLastFetchAsync, getRatesAsync, updateRatesAsync, saveRatesAsync }
