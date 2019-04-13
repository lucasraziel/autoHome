//Dependências externas

var ModbusSingleton = require('./ModbusSingleton.js')
const modBusClientData = require('./data/modBusClient.json')
const dadosLampadas = require('./data/lampData.json')

// Modbus 'state' constants
var MBS_STATE_INIT          = 'State init'
var MBS_STATE_IDLE          = 'State idle'
var MBS_STATE_NEXT          = 'State next'
var MBS_STATE_GOOD_READ     = 'State good (read)'
var MBS_STATE_FAIL_READ     = 'State fail (read)'
var MBS_STATE_GOOD_CONNECT  = 'State good (port)'
var MBS_STATE_FAIL_CONNECT  = 'State fail (port)'
var MBS_STATE_CLOSED        = 'State closed'


//variáveis globais
var mbsState    = MBS_STATE_INIT
var mbsBufData
var client
var mbsScan = 2000

var args = []

const lampData = []

//===========================================================================
function startModbus(){
    return  new ModbusSingleton().getInstance()
}


var connectClient = function(...args)
{
    client = startModbus()
    // set requests parameters
    client.setID(modBusClientData.id)
    client.setTimeout(modBusClientData.timeOut)
    // try to connect
    client.connectRTUBuffered (modBusClientData.comName,{
        baudRate: modBusClientData.baudRate,
        parity: modBusClientData.parity,
        dataBits: modBusClientData.dataBits,
        stopBits: modBusClientData.stopBits,
     })
        .then(function()
        {
            mbsState  = MBS_STATE_GOOD_CONNECT;
            mbsStatus = 'Connected, wait for reading...'
        })
        .catch(function(error)
        {
            mbsState  = MBS_STATE_FAIL_CONNECT;
            mbsStatus = error.message;
        })
}



var readModbusData = function (...args){
    const dataAddress = args[0][0]
    const length = args[0][1]
    var callBack = args[0][2]
    var finalizacao = args[0] [3]
    client.readDiscreteInputs (dataAddress, length)
        .then(function(data)
        {
            mbsState   = MBS_STATE_GOOD_READ;
            mbsStatus  = 'success';
            mbsBufData = data;
            finalizacao(data, dataAddress,length,callBack)
        })
        .catch(function(error)
        {
            mbsState  = MBS_STATE_FAIL_READ;
            mbsStatus = error.message;
        });
}



async function writeSingleCoil(address, value){
    client = startModbus()

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
        

        client.writeFC5(1, address, value, function(){
            client.close()
        })
            

    })
   
        
}

var closeClient = function(...args){
    if (client != null && client !== undefined){
        if (client.isOpen){
            client.close()
        }
    }
    mbsState = MBS_STATE_CLOSED
} 
var runModbus = function()
{
    var nextAction
    switch (mbsState)
    {
        case MBS_STATE_INIT:
            nextAction = connectClient
            break

        case MBS_STATE_NEXT:
            nextAction = readModbusData
            break

        case MBS_STATE_GOOD_CONNECT:
            nextAction = readModbusData
            break

        case MBS_STATE_FAIL_CONNECT:
            nextAction = connectClient
            break

        case MBS_STATE_GOOD_READ:
            nextAction = closeClient
            break

        case MBS_STATE_CLOSED:
            nextAction = closeClient
            return false
            break

        case MBS_STATE_FAIL_READ:
            if (client.isOpen)  { mbsState = MBS_STATE_NEXT  }
            else                { nextAction = connectClient }
            break

        default:
    }


    // execute "next action" function if defined
    if (nextAction != undefined)
    {
        nextAction(args);
    }

    // set for next run
    if (mbsState != MBS_STATE_CLOSED){
        setTimeout (runModbus, mbsScan)
    }else{
        return true
    }
}

function readDiscreteInput(address, length, callBack){
    mbsState    = MBS_STATE_INIT
    args[0] = address
    args[1] = length
    args[2] = callBack
    args[3] = getLampData
    runModbus()
   
    // return getLampData(mbsBufData, address, length)
}

var getLampData = function(data,address, length, callBack){
    var lampadas = []
    for(index=address;index<address+length;index++){
        lampadas[index] = data.data[index-address]
    }

    for (const comodos in dadosLampadas) {
        for(const lampada in comodos.lampadas){
            lampada.status = lampadas[lampada.endereco]
        }
    }

    callBack(dadosLampadas)

    
    
}

module.exports = {
    readDiscreteInput,
    writeSingleCoil
}
