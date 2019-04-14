var express = require('express');
    
const atualizadorCLP = require('./modbus/atualizaCLP.js')
const leituraCLP = require('./update/leituraCLP.js')

var app = express();



    
// Definir a route principal
app.get('/', function(req, res) {
  res.send('Welcome to API');
});

// Lista de Utilizadores

// Definir um endpoint da API
app.get('/api/get_lampadas', function(req, res, next) {
  //ler do banco de dados MongoDb
  res.json(leituraCLP.dadosLampada);
})

app.get('/api/update_lampada\*',async function(req,res,next){
    var endereco = req.params.endereco
    // var estado = req.params.estado
    // console.log(estado)
    console.log(endereco)
    await atualizadorCLP.writeSingleCoil(1280,false)
    res.send(req.params)
    
})

// Aplicação disponível em http://127.0.0.1:9000/
app.listen(9000);


