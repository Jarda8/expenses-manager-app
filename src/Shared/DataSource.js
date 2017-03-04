/* @flow */
var periods = new Map();
periods.set('year', 'year');
periods.set('month', 'month');
periods.set('week', 'week');
periods.set('custom', 'custom');

export type Bank = {
  name: string,
  code: string
}

var banks: Array<Bank> = [
  {name: 'Česká spořitelna', code: "0800"}
]

var currencies = ['CZK', 'EUR'];

export { periods, banks, currencies }
