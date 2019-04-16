var express = require('express');
    

var app = express();

app.use(express.static('webPages'));

// Definir um endpoint da API
app.get('/', function(req, res, next) {
    console.log(__dirname)
    res.sendFile('/webPages/index.html',{root:__dirname}) 
  
})

// Aplicação disponível em http://127.0.0.1:8081/
app.listen(8081);


