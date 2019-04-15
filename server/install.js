var MongoClient = require('mongodb').MongoClient
var configVariables = require('dotenv-safe').config()
var dispositivosDados = require('./data/lampData.json')

var urlDatabase = configVariables.parsed.URL_DATABASE
var databaseName = configVariables.parsed.DATABASE_NAME
var collectionName = configVariables.parsed.COLLECTION_NAME

MongoClient.connect(urlDatabase, function(err, db) {
  if (err) throw err
  var dbo = db.db(databaseName)
  dbo.collection(collectionName).insertMany(dispositivosDados, function(err, res) {
    if (err) throw err
    console.log("Dados inseridos")
    db.close()
  })
})


