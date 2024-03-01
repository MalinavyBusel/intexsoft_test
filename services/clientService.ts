const { UUID } = require('mongodb');
const mongoose = require('mongoose');
const { inspect } = require('util');

const clientSchema = new mongoose.Schema({
  name: String,
  type: String,
  accounts: [{type: UUID, ref: 'Account'}],
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
        select: 'bank currency amount -_id',
        foreignField: 'uuid',
      })
    return c
}
const listClients = async () => { 
    const clients = await Client.find().populate({
        path: 'accounts',
        model: 'Account',
        select: 'amount currency -_id -uuid',
        foreignField: 'uuid',
      })
    return inspect(clients, { depth : null })
 }


export {
    createClient,
    delClient,
    getClient,
    listClients, 
    addAccount
}