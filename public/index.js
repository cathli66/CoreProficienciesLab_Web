var express = require('express');
var app = express();
var request = require('request');
var mysql = require('mysql');
var hbs = require('hbs');

var pool = mysql.createPool({
  connectionLimit : 10,
  user            : 'site_2420',
  password        : 'HXztXghgQWCXW6vPguXOW6CSdLVlpPk041KRLTYCdGYidCUMHA',
//   host            : 'mysql1.csl.tjhsst.edu',
  host            : 'director-mysql',
  port            : 3306,
  database        : 'site_2420'
});

app.set('trust proxy', 1);
app.set('port', process.env.PORT || 8000);
app.set('view engine', 'hbs');
app.use(express.static('static'));

app.get('/', function(req, res) {
    // console.log('user landed at page');
    pool.query('SELECT * FROM polldata', function(error, results, fields) {
        if (error) throw error;
        var m = results[0].votes;
        var f = results[1].votes;
        var o = results[2].votes;
        var info = {
            males : m,
            females : f,
            other : o
        };
        res.render('votepage', info);
    });
});

app.get('/pollres', function(req, res) {
    var g_id = req.query.gender;
    pool.query('SELECT * FROM polldata WHERE id=?', g_id, function(e, r, f){
        if (e) throw e;
        pool.query('UPDATE polldata SET votes=? WHERE id=?', [r[0].votes+1, g_id], function(error, results, fields) {
            if (error) throw error;
            res.redirect('/');
        });
    });
    
});


app.get('/volley', function(req, res) {
    var g_id = req.query.gender;
    pool.query('SELECT * FROM polldata WHERE id=?', g_id, function(e, r, f){
        if (e) throw e;
        pool.query('UPDATE polldata SET votes=? WHERE id=?', [r[0].votes+1, g_id], function(error, results, fields) {
            if (error) throw error;
            pool.query('SELECT * FROM polldata', function(err, rslt, flds){
                if (err) throw err;
                res.json(rslt)
            });
        });
    });
});

var listener = app.listen(app.get('port'), function() {
    console.log( 'Express server started on port: ' + listener.address().port);
});
