//these are all standard procedures to set up mysql, node, handlebars, port settings, etc
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]); //you could set it to a constant port without manually sepcifiying it during every run
app.set('mysql', mysql);

//default home page, this page only provides redirection and has no data interaction, so don't bind it with any JS script via use method
app.get('/',function(req,res){
res.render('Index');
});
//page redriections for spoters and shelters(to be completed)
//app.get('/Spoter',function(req,res){
//res.render('Spoter');
//});
//page redirections and JS script binding
app.use('/',require('./Index.js')); //only using a single handlebar for DB debugging
app.use('/report',require('./report.js'));
app.use('/Registration',require('./Registration.js'));
app.use('/Login', require('./Login.js'));


//404 and 500 handlebars
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//DB connection prompt
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
