import { DB } from './DB';
import { getAccount, updateAccount, getAccountAsync, updateAccountAsync } from './AccountsDS'

export type Transfer = {
  fromAccountName: string,
  fromAccountNumber: string,
  toAccountName: string,
  toAccountNumber: string,
  amount: number,
  date: Date,
  note: string
}

var transfersDS: Array<Transfer> = [
  {fromAccountName: 'Osobní účet', fromAccountNumber: '123465798', toAccountName: 'Peněženka', toAccountNumber: null, amount: 2000, date: new Date(2017, 0, 10, 0, 0, 0, 0), note: ''}
]

function saveTransfer(transfer: Transfer) {
  transfersDS.push(transfer);

  let account = getAccount(transfer.fromAccountName, transfer.fromAccountNumber);
  updateAccount(account,
    {
      name: account.name,
      number: account.number,
      bankName: account.bankName,
      type: account.type,
      balance: account.balance - transfer.amount,
      currency: account.currency
    });

  account = getAccount(transfer.toAccountName, transfer.toAccountNumber);
  updateAccount(account,
    {
      name: account.name,
      number: account.number,
      bankName: account.bankName,
      type: account.type,
      balance: account.balance + transfer.amount,
      currency: account.currency
    });
}

function saveTransferAsync(transfer: Transfer) {
  DB.transfers.add(transfer);

  getAccountAsync(transfer.fromAccountName, transfer.fromAccountNumber,
    account =>
    {
      updateAccountAsync(account,
        {balance: account.balance - transfer.amount},
          result => {
            getAccountAsync(transfer.toAccountName, transfer.toAccountNumber,
              account =>
              {
                updateAccountAsync(account,
                {balance: account.balance + transfer.amount})
              })
        }
      )
    });
}

function deleteTransfer(transfer: Transfer) {
  let index = transfersDS.indexOf(transfer);
  transfersDS.splice(index, 1);

  let account = getAccount(transfer.fromAccountName, transfer.fromAccountNumber);
  updateAccount(account,
    {
      name: account.name,
      number: account.number,
      bankName: account.bankName,
      type: account.type,
      balance: account.balance + transaction.amount,
      currency: account.currency
    });

  account = getAccount(transfer.toAccountName, transfer.toAccountNumber);
  updateAccount(account,
    {
      name: account.name,
      number: account.number,
      bankName: account.bankName,
      type: account.type,
      balance: account.balance - transaction.amount,
      currency: account.currency
    });
}

function deleteTransferAsync(transfer: Transfer) {
  DB.transfers.remove(transfer);

  getAccountAsync(transfer.fromAccountName, transfer.fromAccountNumber,
    account =>
    {
      updateAccountAsync(account,
        {balance: account.balance + transfer.amount},
        result => {
          getAccountAsync(transfer.toAccountName, transfer.toAccountNumber,
            account =>
            {
              updateAccountAsync(account,
              {balance: account.balance - transfer.amount})
            }
          )
        }
      )
    });
}

export { saveTransfer, deleteTransfer, saveTransferAsync, deleteTransferAsync }
