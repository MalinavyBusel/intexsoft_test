const mongoose = require('mongoose');
import {v4 as uuidv4} from 'uuid'

const accountSchema = new mongoose.Schema({
  uuid: mongoose.Schema.Types.UUID,
  currency: String,
  bank: {type: String, ref: 'Bank'},
  client: {type: String, ref: ''},
  amount: Number,
});
const Account = mongoose.model('Account', accountSchema);

const transactionSchema = new mongoose.Schema({
  uuid: mongoose.Schema.Types.UUID,
  from: {type: mongoose.Schema.Types.UUID, ref: "Account"},
  to: {type: mongoose.Schema.Types.UUID, ref: "Account"},
  datetime: Date, 
  client: {type: String, ref: 'Client'}, // sender-client, dont think reciever is needed here as another field
  amount: Number,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

const createAcc = async ({bank, client, currency, amount}) => {
    const uuid = uuidv4()
    const b = await Account.create({uuid: uuid, bank, client, currency, amount})
    return b
    // push this uuid to client model account list
}
const delAcc = {}
const delAccsOfClient = async ({bank, client}) => {
  const d = await Account.deleteMany({bank, client})
}
const getAcc = async ({uuid}) => { 
  const a = await Account.findOne({uuid})
  return a
}
const updateAcc = () => { 
  throw new Error('not implemented')
}
const listAcc = () => { 
  throw new Error('not implemented')
}
const createBankTransaction = async ({client, amount, from, to}) => {
  const uuid = uuidv4()
  const datetime = new Date()
  const t = await Transaction.create({uuid: uuid, datetime, client, amount, from, to})
  return t
}
const makeBankTransaction = async ({client, amountFrom, amountTo, from, to}) => {
  // didn't use mongoose.startSession().startTransaction(), 
  // bcs needed additional time to configure mongo replset to use transactions
  await createBankTransaction({client, amount: amountFrom, from, to})  
            
  await Account.updateOne({uuid: from.uuid}, {$inc: {amount: -amountFrom}})
  await Account.updateOne({uuid: to.uuid}, {$inc: {amount: amountTo}})
  return 'ok'
}

const getTransactions = async ({start, end, name}) => {
  const obj = {}
  if (end == undefined || end == '') {
      obj['$lte'] = new Date()
  } else {
      obj['$lte'] = new Date(end)
  }
  if (start != undefined && start != '') {
    obj['$gte'] = new Date(start)
  }

  const t = await Transaction.find({client: name, datetime: obj})
  return t
}

export {
    createAcc,
    delAcc,
    updateAcc,
    getAcc,
    listAcc, 
    delAccsOfClient,
    makeBankTransaction,
    getTransactions
}
