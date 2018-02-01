const con = require('./config');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

exports.create = function (req,res) {
	const event = req.body.event;
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.pass;
	const mobile = Number(req.body.mobile);
	var event1= event+"_committee";
	var user={
		event:req.body.event,
		name:req.body.name,
		email:req.body.email,
		committee : 'head'
	};
	var que = `CREATE TABLE ${event}(id int NOT NULL AUTO_INCREMENT,name varchar(30) NOT NULL,email varchar(50) NOT NULL,password varchar(200) NOT NULL,mobile float(15,0),committee  varchar(20) NOT NULL,points INT(3) NOT NULL DEFAULT 0,PRIMARY KEY(id))`;
	con.query(que,function(qerr,qres){
		if(qerr){
			console.log(qerr);
		}
	});
	que = `CREATE TABLE ${event1}(committee_name varchar(20) NOT NULL ,work varchar(100) NOT NULL)`;
	con.query(que,function(qerr,qres){
		if(qerr){
			console.log(qerr);
		}
	});
	que = `INSERT INTO events values('${event}')`;
	con.query(que,function(qerr,qres){
		if(qerr){
			console.log(qerr);
		}
	});
	const SALT_FACTOR = 5;
	bcrypt.genSalt(SALT_FACTOR,function(serr,salt){
		if(serr){
			console.log(serr);
		}
		bcrypt.hash(password,salt,function(herr,hash){
			if(herr){
				console.log(herr);
			}
			que = `INSERT INTO ${event} (name,email,password,mobile,committee) VALUES('${name}','${email}','${hash}',${mobile},'head')`;
			con.query(que,function(qerr,qres){
				if(qerr){
					console.log(qerr);
				}
				req.session.user = user;
				res.redirect('/main');
			});
		});
	});     
	console.log("success!!");
}
exports.signup = function(req,res){
	const event = req.body.event;
	const name= req.body.name;
	const email = req.body.email;
	const password = req.body.pass;
	const mobile = Number(req.body.mobile); 
	const committee = req.body.committee;
	var user={
		event:req.body.event,
		name:req.body.name,
		email:req.body.email,
		committee : committee
	};
	const SALT_FACTOR = 5;
	bcrypt.genSalt(SALT_FACTOR,function(serr,salt){
		if(serr){
		    console.log(serr);
		}
		bcrypt.hash(password,salt,function(herr,hash){
			if(herr){
	    		console.log(herr);
			}
			que = `INSERT INTO ${event} (name,email,password,mobile,committee) VALUES('${name}','${email}','${hash}',${mobile},'${committee}')`;
			con.query(que,function(qerr,qres){
				if(qerr){
					console.log(qerr);
				}
				req.session.user = user;
				if(committee=='head'){
					res.redirect('/main');
				}
				else{
					res.redirect('/committee/'+committee);
				}
			});
		});
	});
	console.log(event);
} 
exports.login = function(req,res){
	var event = req.body.event; 
	var email = req.body.email;
	var password = req.body.pass;
	var user={
		event:req.body.event,
		email:req.body.email
	};

	
	var que=`SELECT * FROM  ${event}  WHERE email = ?`;
	con.query(que,[email], function (error, results, fields) {
	if (error) {
	    console.log(error);
	}
	else{
		if(results.length >0){
			  bcrypt.compare(password, results[0].password, function(err, doesMatch){
				if (doesMatch){
					user.committee = results[0].committee;
					user.name = results[0].name;
					req.session.user = user;
					if(results[0].committee=='head'){
						res.redirect('/main');
					}
					else{
						res.redirect('/committee/'+results[0].committee);
					}
				}
				else{
					res.send({
						"code":204,
						"success":"Email and password does not match"
					});
				}
			});
		}
		else{
			res.send({
			  "code":204,
			  "success":"Email does not exits"
			});
		}
	}
	console.log("Success");
	});
}

exports.logout = function(req,res){
	req.session.destroy();
	console.log(req.session);
	res.redirect('/log');
	console.log('Logged out');
}

exports.eventVal = function(req,res){
	let que = "select name from events";
	let input = req.query.e.toLowerCase();
	con.query(que,function(err,results,fields){
		if(err){
			console.log(err);
		}
		let check = results.map((obj) => {
			return obj.name.toLowerCase();
		});
		if(input.indexOf(' ')>=0){
			res.send('Space is not allowed...')
		}
		else if(check.indexOf(input)>=0){
			res.send('Name already exists...');
		}
		else{
			res.send();
		}
	});
}

exports.userVal = function(req,res){
	let que = `select name from ${req.query.e}`;
	let input = req.query.u.toLowerCase();
	con.query(que,function(err,results,fields){
		if(err){
			console.log(err);
		}
		let check = results.map((obj) => {
			return obj.name.toLowerCase();
		});
		if(check.indexOf(input)>=0){
			res.send('Name already taken...');
		}
		else{
			res.send();
		}
	});
}

exports.committeeVal = function(req,res){
	let que = `select committee_name as name from ${req.query.e}_committee`;
	let input = req.query.u.toLowerCase();
	con.query(que,function(err,results,fields){
		if(err){
			console.log(err);
		}
		let check = results.map((obj) => {
			return obj.name.toLowerCase();
		});
		if(input.indexOf(' ')>=0){
			res.send('Space is not allowed...')
		}
		else if(check.indexOf(input)>=0){
			res.send('Committee already exists...');
		}
		else{
			res.send();
		}
	});
}