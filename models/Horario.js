const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

moment.locale('pt-BR');

// Criando Schema
const horariosSchema = new Schema({
  horario: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
    //default: moment().format('LLLL')
  },
  dataMoment: {
    type: String,
    default: moment().format('dddd, M	[de] MMMM [de] YYYY')
  }

});

mongoose.model('horarios', horariosSchema);
