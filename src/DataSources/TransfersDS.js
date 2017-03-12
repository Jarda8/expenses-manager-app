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

function saveTransferAsync(transfer: Transfer) {
  DB.transfers.add(transfer, () => {
    console.log('transfer saved');
    getAccountAsync(transfer.fromAccountId,
      account =>
      {
        console.log('account to update:');
        console.log(account);
        updateAccountAsync(account,
          {balance: account.balance - transfer.fromAmount},
            result => {
              console.log('account updated');
              getAccountAsync(transfer.toAccountId,
                account2 =>
                {
                  console.log('second account to update:');
                  console.log(account2);
                  updateAccountAsync(account2,
                  {balance: account2.balance + transfer.toAmount})
                })
          }
        )
      });
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
}

export { saveTransferAsync, deleteTransferAsync, getPendingTransfersAsync, updateTransferAsync }
