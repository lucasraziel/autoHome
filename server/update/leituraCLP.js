const atualizadorCLP = require('../modbus/atualizaCLP.js')
const databaseController = require('../database/databaseController.js')
var configVariables = require('dotenv-safe').config()
var dadosLampadas = require('../data/lampData.json')

var dataAddress = parseInt( configVariables.parsed.INITIAL_ADDRESS)
var readingLength = parseInt( configVariables.parsed.LENGTH_READING)

inicializa()

var retorno = function() {
    inicializa()
}

function inicializa (){

    atualizadorCLP.readDiscreteInputs(dataAddress,readingLength,function fim (error, data) {
        if (error){
            console.log(error)
        }else{
            console.log('resultado')
            console.log(data)

            var dadosComodos = getLampData(data,dataAddress,readingLength)
            console.log(dadosComodos)

            databaseController.updateStatus(dadosComodos)


            //salvar em banco de dados

            setTimeout(retorno,5000)
        }
    })

}

function getLampData(data,address, length){
    var lampadas = []

    var dadosDispositivos = dadosLampadas
    console.log(`address: ${address}`)
    console.log(`length: ${length}`)
    for(index=address;index<address+length;index++){
        console.log(index)
        console.log(address+length)
        // console.log('debug getLamp 1')
        // console.log(`lampadas[${index}] = ${data.data[index-address]}`)
        lampadas[index] = data.data[index-address]
    }

    dadosLampadas.forEach(comodos => {
        comodos.lampadas.forEach(lampada =>{
            console.log('debug getLamp 2')
            console.log(`lampadas[${lampada.endereco}] = ${lampadas[lampada.endereco]}`)
            lampada.status = lampadas[lampada.endereco]
        })
    })

    

    return dadosLampadas

    
    
}



module.exports = retorno