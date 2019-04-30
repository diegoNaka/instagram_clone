var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;

var db = new mongodb.Db(
	'instagram',
	new mongodb.Server('localhost', 27017, {}),
	{}
);

app.listen(port);
console.log('Servidor http está escutando na porta '+port);

app.get('/', function(res, res){
	res.send({msg: 'olá'});
});


//POST cria o documento
app.post('/api', function(req, res){
		var dados = req.body;
		db.open(function(erro, mongoClient){
			mongoClient.collection('postagens', function(erro, collection){
				collection.insert(dados, function(erro, records){
					if(erro){
						res.json(erro);
					} else {
						res.json(records)
					}
					mongoClient.close();
				});
			});
		});
		
});

//GET lê
app.get('/api', function(req, res){
	db.open(function(erro, mongoClient){
		mongoClient.collection('postagens', function(erro, collection){
			collection.find().toArray(function(erro, results){
				if(erro) {
					res.json(erro);
				} else {
					res.json(results);
				}
				mongoClient.close();
			}); 
		});
	});
});
		