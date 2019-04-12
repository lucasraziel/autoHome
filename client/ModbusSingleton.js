let modbusSerial = require('modbus-serial')

class ModbusSingleton {
    constructor() {
        if(!ModbusSingleton.instance){
            ModbusSingleton.instance = new modbusSerial()
        }
    }

    getInstance(){
        return ModbusSingleton.instance
    }
}

module.exports = ModbusSingleton