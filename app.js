var express = require('express'),
bodyParser = require('body-parser'),
path  = require('path'),
expressValidator = require('express-validator'),
mongojs = require('mongojs'),
db = mongojs('customerapp', ['users']),
app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//set static
///app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
		res.locals.errors = null;
		next();
})

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.get('/',function(req,res){
	db.users.find(function (err, docs) {
		console.log(docs)
    		res.render('index',{
				//title:'login',
				users: docs
		}); 
})
	res.render("index");
})



app.post('/users/add',function(req,res){
	req.checkBody('firstname', 'firstname is required').notEmpty();
	req.checkBody('lastname', 'lastname is required').notEmpty();
	req.checkBody('email', 'email is required').notEmpty();

	 var errors = req.validationErrors();

	if(errors){
		console.log("errors")
		res.render('index',{
				//title:'login',
				errors: errors
		});
	}

	else{
	var newuser ={
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,

	}
}
})

app.listen(3000, function(){
	console.log("server started")
})