//  Dependências externas

var ModbusSingleton = require('./ModbusSingleton.js')
const modBusClientData = require('../data/modBusClient.json')
const dadosLampadas = require('../data/lampData.json')



//  variáveis globais




// ===========================================================================
function startModbus () {
  return new ModbusSingleton().getInstance()
}



async function writeSingleCoil(address, value, next){
    const client = startModbus()

    client.setID(modBusClientData.id)
    client.setTimeout(modBusClientData.timeOut)
    
    client.connectRTU(modBusClientData.comName,{
       baudRate: modBusClientData.baudRate,
       parity: modBusClientData.parity,
       dataBits: modBusClientData.dataBits,
       stopBits: modBusClientData.stopBits
    }, function write(){
        client.setID(modBusClientData.id)
        client.setTimeout(modBusClientData.timeOut)
        

        client.writeFC5(modBusClientData.id, address, value, function(error){
            if(client.isOpen){
                client.close()
            }
            if (error){
                next(!value)
            }else{
                next(value)
            }
            
        })
            

    })
   
        
}




function readDiscreteInputs(dataAddress, length, callBack){
    client = startModbus()

    client.setID(modBusClientData.id)
    client.setTimeout(modBusClientData.timeOut)
    
    client.connectRTUBuffered(modBusClientData.comName,{
        baudRate: modBusClientData.baudRate,
        parity: modBusClientData.parity,
        dataBits: modBusClientData.dataBits,
        stopBits: modBusClientData.stopBits,
     }).then(function (data){
         client.readDiscreteInputs (dataAddress, length)
         .then(function(data)
         {
             if (client.isOpen){
                 client.close()
             }
             mbsStatus  = 'success';
             callBack(null,data)
         })
         .catch(function(error)
         {
             console.log(error)
         })
     }).catch(function (error){
         console.log(error)
     })
    
}

module.exports = {
    readDiscreteInputs,
    writeSingleCoil
}
