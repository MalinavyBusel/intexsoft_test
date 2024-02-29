const { UUID } = require('mongodb');
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: UUID,
//   type
//   accounts
//   transactions
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports.TransactionModel = Transaction;