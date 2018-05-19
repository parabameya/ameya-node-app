const express = require('express');
const file = require('fs');
var bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json()); // for parsing application/json

app.get('/test', (req, res) => {
	readFile('data.json', (file) => {
		res.send(file);	
	});
});

app.get('/library', (req, res) => {
	readFile('library.json', (file) => {
		res.set('Access-Control-Allow-Origin', '*')
		res.status(200).send(file);	
	});
});

app.get('/library/:id', (req, res) => {
	readFile('library.json', (file) => {
		console.log(req.params.id);
		const fileJson = JSON.parse(file);
		fileJson.lib.forEach((lib) => {
			if (lib.id == req.params.id) {
				res.status(200).send(lib);	
			}
		});
		res.sendStatus(404);
	});
});

app.post('/test', function (req, res) {
	try {
		writeToFile(req.body, function(status) {
			res.send(status);
		});
	} catch (e) {
		res.sendStatus(404);
	}
});

const writeToFile = (body, callback) => {
	try {
		const bodyInString = JSON.stringify(body);
		file.writeFile('data.json', bodyInString, (err) => {
		  if (err) {
		  	callback(false);
		  };
		  callback(true);
		});
	} catch (e) {
		callback(false);
	}
};

const readFile = (fileName, callback) => {
	file.readFile(fileName,'utf8',(err,contents) => {
		callback(contents);
	}); 
};

function errorHandler (err, req, res, next) {
  res.sendStatus(500);
}

app.use(errorHandler);
app.listen(3001, () => console.log('This new app listening on port 3001!'));

// npm i express --save
//    http://collabedit.com/8w6dd

