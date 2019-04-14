const atualizadorCLP = require('../modbus/atualizaCLP.js')
var dadosLampada

inicializa()

var retorno = function() {
    inicializa()
}

function inicializa (){

    atualizadorCLP.readDiscreteInputs(0x0500,32,function fim (error, data) {
        if (error){
            console.log(error)
        }else{
            console.log('resultado')
            console.log(data)
            //salvar em banco de dados

            setTimeout(retorno,5000)
        }
    })

}



module.exports = {
    retorno,
    dadosLampada
}