const atualizadorCLP = require('./atualizaCLP.js')
const dadosLampada = []
atualizadorCLP.readDiscreteInput(0x0500,32,function(data){
    dadosLampada = data
})
// atualizadorCLP.writeSingleCoil(0x0501,false)