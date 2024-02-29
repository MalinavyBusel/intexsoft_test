const { bankModel } = require('../models/bankModel')


const create = async ({name, comission}) => {
    const b = await bankModel.create({name, comission: Number(comission)})
}
const del = async ({name}) => {
    const b = await bankModel.deleteOne({name})
}
const update = async ({name, rename, comission}) => {
    const b = await bankModel.updateOne({name}, {$set: {name: rename, comisssion: Number(comission)}}).exec()
}
const get = async ({name}) => {
    const b = await bankModel.findOne({name})
    return b
}


export {
    create,
    del,
    update,
    get
}
