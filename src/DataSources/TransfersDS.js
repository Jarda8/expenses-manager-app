import { DB } from './DB';
import { getAccountAsync, updateAccountAsync } from './AccountsDS'

export type Transfer = {
  _id: number,
  fromAccountName: string,
  fromAccountNumber: string,
  toAccountName: string,
  toAccountNumber: string,
  fromAmount: number,
  toAmount: number,
  date: Date,
  note: string,
  state: string,
  fromCurrency: string,
  toCurrency: string
}

function saveTransferAsync(transfer: Transfer) {
  DB.transfers.add(transfer);

  getAccountAsync(transfer.fromAccountName, transfer.fromAccountNumber,
    account =>
    {
      updateAccountAsync(account,
        {balance: account.balance - transfer.fromAmount},
          result => {
            getAccountAsync(transfer.toAccountName, transfer.toAccountNumber,
              account =>
              {
                updateAccountAsync(account,
                {balance: account.balance + transfer.toAmount})
              })
        }
      )
    });
}

async function updateTransferAsync(oldTransfer: Transfer, dataToUpdate: Object) {
  return new Promise((resolve,reject) => {
    DB.transfers.update(oldTransfer, dataToUpdate);
  });
}

async function getPendingTransfersAsync() {
  return new Promise((resolve,reject) => {
    DB.transfers.get({state: 'pending'}, result => {
      resolve(result);
    });
  });
}

function deleteTransferAsync(transfer: Transfer) {
  DB.transfers.remove(transfer);

  getAccountAsync(transfer.fromAccountName, transfer.fromAccountNumber,
    account =>
    {
      updateAccountAsync(account,
        {balance: account.balance + transfer.fromAmount},
        result => {
          getAccountAsync(transfer.toAccountName, transfer.toAccountNumber,
            account =>
            {
              updateAccountAsync(account,
              {balance: account.balance - transfer.toAmount})
            }
          )
        }
      )
    });
}

export { saveTransferAsync, deleteTransferAsync, getPendingTransfersAsync, updateTransferAsync }
