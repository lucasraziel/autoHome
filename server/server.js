var express = require('express');
    
const atualizadorCLP = require('./atualizaCLP.js')

var app = express();
var dadosLampada
    
// Definir a route principal
app.get('/', function(req, res) {
  res.send('Welcome to API');
});

// Lista de Utilizadores
atualizadorCLP.readDiscreteInput(0x0500,32,function(data){
    dadosLampada = data
})

// Definir um endpoint da API
app.get('/api/get_lampadas', function(req, res, next) {
  res.json(dadosLampada);
})

app.get('/api/update_lampada?:endereco&:estado',async function(req,res,next){
    var endereco = req.params.endereco
    // var estado = req.params.estado
    // console.log(estado)
    console.log(endereco)
    await atualizadorCLP.writeSingleCoil(1280,false)
    res.send(req.params)
    
})

// Aplicação disponível em http://127.0.0.1:9000/
app.listen(9000);