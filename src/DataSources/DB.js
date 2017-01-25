import RNDBModel from 'react-native-db-models';

export var DB = {
    "accounts": new RNDBModel.create_db('accounts'),
    "transactions": new RNDBModel.create_db('transactions'),
    "transfers": new RNDBModel.create_db('transfers'),
    "budgets": new RNDBModel.create_db('budgets')
};
