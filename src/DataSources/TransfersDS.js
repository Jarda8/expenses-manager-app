import { DB } from './DB';
import { getAccountAsync, updateAccountAsync } from './AccountsDS'

export type Transfer = {
  _id: number,
  fromAccountName: string,
  fromAccountNumber: string,
  toAccountName: string,
  toAccountNumber: string,
  amount: number,
  date: Date,
  note: string
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

export { saveTransferAsync, deleteTransferAsync }
