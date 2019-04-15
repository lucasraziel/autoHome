var MongoClient = require('mongodb').MongoClient
var configVariables = require('dotenv-safe').config()

var urlDatabase = configVariables.parsed.URL_DATABASE
var databaseName = configVariables.parsed.DATABASE_NAME
var collectionName = configVariables.parsed.COLLECTION_NAME

function updateStatus(dadosDispositivos){
    var querySearch
    var newValues
    console.log('teste')
    console.log(dadosDispositivos)

    MongoClient.connect(urlDatabase, function(err, db) {
        if (err) throw err
        var dbo = db.db(databaseName)
        var collectionDatabase = dbo.collection(collectionName)
        
        for (let index=0;index<dadosDispositivos.length;index++ ) {
            console.log('teste comodos')
            console.log(dadosDispositivos[index])
            for (let indexJ=0;indexJ<dadosDispositivos[index].lampadas.length;indexJ++){
                var dispositivo = dadosDispositivos[index].lampadas[indexJ]
                console.log(dispositivo)
                querySearch = {
                    'lampadas': {
                      '$elemMatch': {
                        'endereco': dispositivo.endereco
                      }
                    }
                  }
                newValues = {
                    $set:{
                        'lampadas.$.status': dispositivo.status
                    }
                }


                collectionDatabase.find(querySearch).toArray(function(error,result){
                    if (error) throw error
                    // db.close()
                    console.log(result)
                    // callBack(result)
                })


                console.log(newValues)
                console.log(querySearch)
                collectionDatabase.updateOne
                    (querySearch, newValues,function(error, response){
                        if(error) throw error
                        console.log('1 object updated')
                    })
            }
        }
        db.close()
    })
    
    
}

function getLampadas(callBack){
    MongoClient.connect(urlDatabase, function(err, db) {
        if (err) throw err
        var dbo = db.db(databaseName)
        var collectionDatabase = dbo.collection(collectionName)
    
        collectionDatabase.find('{}').toArray(function(error,result){
            if (error) throw error
            db.close()
            callBack(result)
        })
        
    })
}

module.exports={
    getLampadas,
    updateStatus
}