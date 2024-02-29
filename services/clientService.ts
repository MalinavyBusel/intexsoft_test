const { UUID } = require('mongodb');
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  type: String,
  accounts: [{type: UUID, ref: 'Account'}],
  //transactions: [{type: UUID, ref: 'Transaction'}]
});

const Client = mongoose.model('Client', clientSchema);

const createClient = async ({name, type}) => {
    const c = await Client.create({name, type, accounts: []})
    return c
}
const addAccount = async ({name, uuid}) => {
    const u = await Client.updateOne({name}, { $push: { accounts: uuid } })
}
const delClient = async ({name}) => {
    const d = await Client.deleteOne({name})
}
const getClient = async ({name}) => {
    const c = await Client.findOne({name}).populate({
        path: 'accounts',
        model: 'Account',
        select: 'bank currency amount',
        foreignField: 'uuid',
      })
    return c
}
const listClients = async () => { 
    const clients = await Client.find()
    return clients
 }


export {
    createClient,
    delClient,
    getClient,
    listClients, 
    addAccount
}