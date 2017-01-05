var accountsDS: {name: string, type: string, balance: number} = [
  {name: 'Osobní účet', type: 'Bankovní účet', balance: 19500},
  {name: 'Peněženka', type: 'Hotovost', balance: 2154}
]

var transactionsDS = [
  {category: 'WAGES', amount: 22500, date: new Date('2016-11-04'), note: ''},
  {category: 'FOOD', amount: -160, date: new Date('2016-11-04'), note: ''},
  {category: 'TRANSPORT', amount: -120, date: new Date('2016-11-04'), note: 'vlak do Pardubic'},
  {category: 'FOOD', amount: -65, date: new Date('2016-11-05'), note: 'kebab'},
  {category: 'TRANSPORT', amount: -120, date: new Date('2016-11-05')},
  {category: 'CLOTHES', amount: -1150, date: new Date('2016-11-08'), note: ''},
  {category: 'FOOD', amount: -420, date: new Date('2016-11-09'), note: ''},
  {category: 'ENTERTAINMENT', amount: -380, date: new Date('2016-11-10'), note: ''},
  {category: 'FOOD', amount: -148, date: new Date('2016-11-10'), note: ''}
]

export { accountsDS, transactionsDS }
