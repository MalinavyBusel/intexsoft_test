const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  name: String,
  entity_comission: Number,  
  individual_comission: Number,
});

const Bank = mongoose.model('Bank', bankSchema);
module.exports.bankModel = Bank;
