var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Bike = require('../models/bike');

// Routes
/**
 * @swagger
 * /:
 *  get:
 *    description: Use to render the index page
 */
router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

/**
 * @swagger
 * /:
 *  post:
 *    description: Use to create a new user
 *    parameters:
 *      - name: email
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: username
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: password
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: passwordConf
 *        in: query
 *        description: Name of our customer
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      201:
 *         description: Created
 */
router.post('/', function (req, res, next) {
	console.log(req.body);
	var personInfo = req.body;
	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, function (err, data) {
				if (!data) {
					var c;
					User.findOne({}, function (err, data) {

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						var newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf,
							admin: false
						});

						newPerson.save(function (err, Person) {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

/**
 * @swagger
 * /login:
 *    get:
 *      description: Use to render the login page
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
	User.findOne({ email: req.body.email }, function (err, data) {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

/**
 * @swagger
 * /inserisci:
 *    get:
 *      description: Use to render the inserisci page
 */
router.get('/inserisci', function (req, res, next) {
	return res.render('inserisci.ejs');
});

/**
 * @swagger
 * /inserisci:
 *    post:
 *      description: create a new bike
 *    parameters:
 *      - name: modello
 *        in: query
 *        description: model of the bike
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: marca
 *        in: query
 *        description: brand of the bike
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *      - name: prezzo
 *        in: query
 *        description: price of the bike
 *        required: false
 *        schema:
 *          type: integer
 *          format: integer
 *      - name: descrizione
 *        in: query
 *        description: description of the bike
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 */
router.post('/inserisci', function (req, res, next) {
	console.log("INSERISCI");
	let nuovabici = new Bike({
		Modello: req.body.modello,
		Marca: req.body.marca,
		Prezzo: req.body.prezzo,
		Descrizione: req.body.descrizione,
		Stato: true
	});
	nuovabici.save();
	res.redirect('/catalogo');
});


/**
 * @swagger
 * /profile:
 *    get:
 *      description: get user information
 */
router.get('/profile', function (req, res, next) {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, function (err, data) {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', { "name": data.username, "email": data.email, "admin": data.admin });
		}
	});
});


/**
 * @swagger
 * /logout:
 *    get:
 *      description: exit from user session and redirect to homepage
 */
router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
		req.session.destroy(function (err) {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/login');
			}
		});
	}
});
/**
 * @swagger
 * /elimina/{email}:
 *  delete:
 *    description: Use to delete one user
 *    parameters:
 *      - name: email
 *        in: path
 *        description: Name of our customer
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
		'200':
		  description: OK
 */
router.delete('/elimina/:email', function (req, res, next) {
	User.deleteOne({ email: req.params.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
		}
		return res.redirect('/');
	});

});

/**
 * @swagger
 * /catalogo:
 *  get:
 *    description: get all the disponible bikes
 */
router.get('/catalogo', function (req, res, next) {
	console.log("visualizza catalogo");

	Bike.find({}, function (err, bicis) {
		console.log(bicis);
		res.render('catalogo', {
			bicisList: bicis
		})
	})
});

/**
 * @swagger
 * /forgetpass:
 *  get:
 *    description: Use to render the forgetpass page
 */
router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

/**
 * @swagger
 * /forgetpass:
 *  get:
 *    description: Use to render the elimina page
 */
router.get('/elimina', function (req, res, next) {
	res.render("elimina.ejs");
});

/**
 * @swagger
 * /forgetpass:
 *  post:
 *    description: use to change user password
 *    responses:
 *      201:
 *         description: Password changed
 */
router.post('/forgetpass', function (req, res, next) {
	User.findOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save(function (err, Person) {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password does not matched! Both Password should be same." });
			}
		}
	});

});


router.post('/elimina', function (req, res, next) {
	User.deleteOne({ email: req.body.email }, function (err, data) {
		console.log(data);
		if (!data) {
			res.send({ "Success": "This Email Is not regestered!" });
		} else {
		}
		return res.redirect('/');
	});
});

/**
 * @swagger
 * /prenota:
 *  post:
 *    description: use to rent a bike
 *    responses:
 *      201:
 *         description: Rented
 */
router.post('/prenota', async function (req, res, next) {
	if ((req.body.id != "") && (Bike.findOne({ _id: req.body.id }))) {
		await Bike.updateOne({ _id: req.body.id }, { Stato: false });
	}
	return res.redirect('/catalogo');
});

/**
 * @swagger
 * /libera:
 *  post:
 *    description: use to use to free all the bikes
 *    responses:
 *      201:
 *         description: all bikes are free
 */
router.post('/libera', async function (req, res, next) {
	await Bike.updateMany({ Stato: false }, { $set: { Stato: true } });
	return res.redirect('/catalogo');
});



module.exports = router;
