const { bankModel } = require('../models/bankModel')


const create = async ({name, i, e}) => {
    const b = await bankModel.create({name, individual_comission: i, entity_comission: e})
    return b
}
const del = async ({name}) => {
    const b = await bankModel.deleteOne({name})
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
    const b = await bankModel.updateOne({name}, {$set: upd}).exec()
    return b
}
const get = async ({name}) => {
    const b = await bankModel.findOne({name})
    return b
}
const list = async () => {
    const b = await bankModel.find()
    return b
}


export {
    create,
    del,
    update,
    get,
    list
}
