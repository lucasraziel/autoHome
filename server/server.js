var express = require('express');
    
const atualizadorCLP = require('./modbus/atualizaCLP.js')
const leituraCLP = require('./update/leituraCLP.js')
const databaseController = require('./database/databaseController.js')

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Definir um endpoint da API
app.get('/api/get_lampadas', function(req, res, next) {
  databaseController.getLampadas(function (result){
      res.json(result)
  })
  
})

app.get('/api/update_lampada',async function(req,res,next){
    var endereco = parseInt(req.query.endereco)
    var estado = parseInt(req.query.estado)
    // var estado = req.params.estado
    await atualizadorCLP.writeSingleCoil(endereco,estado, function(state){
      console.log(state)
      res.send(state.toString())
    })

    // if (!res.headersSent){
    //   res.send(!estado)
    // }
    
    
})

app.get('/', (req,res)=>{
  console.log(__dirname)
  res.sendFile('/webPages/index.html',{root:__dirname})
})

// Aplicação disponível em http://127.0.0.1:9000/
app.listen(9000);


