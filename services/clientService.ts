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
const delClient = {}
const updateClient = {}
const getClient = {}
const listClients = {}


export {
    createClient,
    delClient,
    updateClient,
    getClient,
    listClients, 
    addAccount
}