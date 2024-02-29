const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: {type: String, unique: true, required: true},
  entity_comission: Number,  
  individual_comission: Number,
});

const Bank = mongoose.model('Bank', bankSchema);

const create = async ({name, i, e}) => {
    const b = await Bank.create({name, individual_comission: i, entity_comission: e})
    return b
}
const del = async ({name}) => {
    const b = await Bank.deleteOne({name})
    return b
}
const update = async ({name, rename, i, e}) => {
    const upd = {}
    if (rename != '' && rename != undefined) {
        upd['name'] = rename
    }
    if (!Number.isNaN(i)) {
        upd['individual_comission'] = i
    }
    if (!Number.isNaN(e)) {
        upd['entity_comission'] = e
    }
    const b = await Bank.updateOne({name}, {$set: upd}).exec()
    return b
}
const get = async ({name}) => {
    const b = await Bank.findOne({name})
    return b
}
const list = async () => {
    const b = await Bank.find()
    return b
}


export {
    create,
    del,
    update,
    get,
    list
}
