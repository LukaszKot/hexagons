var http = require("http")
var express = require("express")
var app = express()
const PORT = 3000;
app.use(express.static('static'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));


var levels = []

app.get('/levels', (req, res) => {
    var body = [];
    for (var i = 0; i < levels.length; i++) {
        body[i] = i
    }
    res.send(body)
})

app.get('/levels/:id', (req, res) => {
    if (levels[req.params.id] != null)
        res.send(levels[req.params.id])
    else
        res.sendStatus(404)
})

app.put('/levels/:id', (req, res) => {
    if (levels[req.params.id] != null) {
        levels[req.params.id] = req.body
        res.sendStatus(200)
    }
    else
        res.sendStatus(404)
})

app.post('/levels', (req, res) => {
    levels.push(req.body)
    res.sendStatus(200)
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
