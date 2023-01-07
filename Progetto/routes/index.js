var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Bike = require('../models/bike'); //mioNuovo





// Routes
/**
 * @swagger
 * /:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

/**
 * @swagger
 * /:
 *  post:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

/**
 * @swagger
 * /login:
 *    get:
 *      description: check if username and password are correct
 */
router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

/**
 * @swagger
 * /login:
 *    post:
 *      description: check if username and password are correct
 */
router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});



///-----------ZUGRI-----------------------------------------------------------------------------------------------------


/**
 * @swagger
 * /inserisci:
 *    post:
 *      description: check if username and password are correct
 */
router.post('/inserisci', function (req, res, next) {
	console.log("INSERISCI");
	let nuovabici = new Bike({
		id: req.body.id,
        Modello: req.body.modello,
        Marca: req.body.marca,
        Prezzo: req.body.prezzo,
        Descrizione: req.body.descrizione
    });
    nuovabici.save();
	console.log(req.nuovabici);
    res.redirect('/catalogo');	
});

/*router.delete('/rimuovi', function(req, res,next) {
	User.findOne({email:req.body.email},).remove();
	
	return res.render('/');
   });*/
/**
 * @swagger
 * /inserisci:
 *    get:
 *      description: check if username and password are correct
 */
router.get('/inserisci', function (req, res, next) {
	return res.render('inserisci.ejs');
});
router.delete("/rimuovi", function(request, response) {
	var email = request.params.email;
   
	request.db.get('User').remove({'email': email}, function(error, document) {
	 if (error) response.send(error);
	 return response.send("deleted");
	});
   });

router.get('/elimina', function (req, res, next) {
	return res.render('elimina.ejs');
});

/**
 * @swagger
 * /profile:
 *    get:
 *      description: check if username and password are correct
 */
router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({unique_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('data.ejs', {"name":data.username,"email":data.email});
		}
	});
});

/**
 * @swagger
 * /catalogo1:
 *    get:
 *      description: check if username and password are correct
 */
router.get('/catalogo1', function (req, res, next) {
	console.log("catalogo1");
	Bike.find({},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			console.log("found");
			//return res.render('catalogo1.ejs', {dataList: data});
			//return res.render('catalogo1.ejs', {"modello":data.modello,"marca":data.marca});
			res.render('catalogo1.ejs', {data});
		}
	});
});


/**
 * @swagger
 * /logout:
 *    get:
 *      description: check if username and password are correct
 */
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

/**
 * @swagger
 * /catalogo:
 *  get:
 *    description: Use to request all bikes
 */
router.get('/catalogo', function (req, res, next) {
	console.log("visualizza catalogo");
	
	Bike.find({}, function(err, bicis){
		console.log(bicis);
        res.render('catalogo',{
			bicisList: bicis
        })
    })
});

/**
 * @swagger
 * /forgetpass:
 *  get:
 *    description: Use to request all bikes
 */
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

/**
 * @swagger
 * /forgetpass:
 *  post:
 *    description: Use to request all bikes
 */
router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

module.exports = router;