const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: String,
  comission: Number,
});

const Bank = mongoose.model('Bank', bankSchema);
module.exports.bankModel = Bank;
