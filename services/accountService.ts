const mongoose = require('mongoose');
import {v4 as uuidv4} from 'uuid'

const accountSchema = new mongoose.Schema({
  uuid: mongoose.Schema.Types.UUID,
  currency: String,
  bank: {type: String, ref: 'Bank'},
  client: {type: String, ref: ''},
  // transactions: [{}]
  amount: Number,
});
const Account = mongoose.model('Account', accountSchema);

const createAcc = async ({bank, client, currency, amount}) => {
    const uuid = uuidv4()
    const b = await Account.create({uuid: uuid, bank, client, currency, amount})
    return b
    // push this uuid to client model account list
}
const delAcc = {}
const updateAcc = {}
const getAcc = {}
const listAcc = {}


export {
    createAcc,
    delAcc,
    updateAcc,
    getAcc,
    listAcc
}
