import { DB } from './DB';
import { getAccountAsync, updateAccountAsync } from './AccountsDS'

export type Transfer = {
  _id: number,
  // fromAccountName: string,
  // fromAccountNumber: string,
  // toAccountName: string,
  // toAccountNumber: string,
  fromAccountId: number,
  toAccountId: number,
  fromAmount: number,
  toAmount: number,
  date: Date,
  note: string,
  state: string,
  fromCurrency: string,
  toCurrency: string
}

async function saveTransferAsync(transfer: Transfer) {
  return new Promise((resolve,reject) => {
    DB.transfers.add(transfer, (result) => {
      getAccountAsync(transfer.fromAccountId,
        account =>
        {
          updateAccountAsync(account,
            {balance: account.balance - transfer.fromAmount},
              result => {
                getAccountAsync(transfer.toAccountId,
                  account2 =>
                  {
                    updateAccountAsync(account2,
                    {balance: account2.balance + transfer.toAmount})
                  })
            }
          )
        });
        resolve();
    });
  });
}

async function updateTransferAsync(oldTransfer: Transfer, dataToUpdate: Object) {
  return new Promise((resolve,reject) => {

    DB.transfers.update(oldTransfer, dataToUpdate, () => {
      if (dataToUpdate.fromAmount && dataToUpdate.fromAmount !== oldTransfer.fromAmount) {
        getAccountAsync(oldTransfer.fromAccountId,
          fromAccount =>
          {
            updateAccountAsync(fromAccount,
            {balance: fromAccount.balance + (oldTransfer.fromAmount - dataToUpdate.fromAmount)}, () => {
              if (dataToUpdate.toAmount && dataToUpdate.toAmount !== oldTransfer.toAmount) {
                getAccountAsync(oldTransfer.toAccountId,
                  toAccount =>
                  {
                    updateAccountAsync(toAccount,
                    {balance: toAccount.balance - (oldTransfer.toAmount - dataToUpdate.toAmount)})
                  });
              }
            })
          });
      } else if (dataToUpdate.toAmount && dataToUpdate.toAmount !== oldTransfer.toAmount) {
        getAccountAsync(oldTransfer.toAccountId,
          toAccount =>
          {
            updateAccountAsync(toAccount,
            {balance: toAccount.balance - (oldTransfer.toAmount - dataToUpdate.toAmount)})
          });
      }
    });
  });
}

async function getPendingTransfersAsync() {
  return new Promise((resolve,reject) => {
    DB.transfers.get({state: 'pending'}, result => {
      resolve(result);
    });
  });
}

async function getTransfersAsync() {
  return new Promise((resolve,reject) => {
    DB.transfers.get_all(result => {
      let resultArray: Array<Transfer> = [];
      Object.keys(result.rows).map(key => resultArray.push(result.rows[key]));
      for (transfer of resultArray) {
        transfer.date = new Date(transfer.date);
      }
      resolve(resultArray);
    });
  });
  // DB.transfers.erase_db();
}

function deleteTransferAsync(transfer: Transfer) {
  DB.transfers.remove_id(transfer._id, () => {
    getAccountAsync(transfer.fromAccountId,
      account =>
      {
        updateAccountAsync(account,
          {balance: account.balance + transfer.fromAmount},
          result => {
            getAccountAsync(transfer.toAccountId,
              account =>
              {
                updateAccountAsync(account,
                {balance: account.balance - transfer.toAmount})
              }
            )
          }
        )
      });
  });
}

export { saveTransferAsync, deleteTransferAsync, getPendingTransfersAsync, updateTransferAsync, getTransfersAsync }
