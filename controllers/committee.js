const con = require('../config');
const bodyParser = require('body-parser');
const mailer = require('nodemailer');

exports.add = function(req,res){
	const committee = req.body.committee;
	const tName = req.session.user.event + '_committee';
	const tName2 = req.session.user.event + '_' + committee + '_work';
	console.log("add"+req.session.user + " " +tName2);
	let que = `INSERT INTO ${tName} (commitee_name,work) VALUES('${committee}','${tName2}')`;
	con.query(que,(qerr,qres) => {
		if(qerr){
			throw(qerr);
		}
	});

	que = `CREATE TABLE ${tName2}(heading varchar(100) NOT NULL,description varchar(200),assignee varchar(30),difficulty varchar(10) NOT NULL,created DATE,complete boolean NOT NULL DEFAULT 0)`;
	con.query(que,(qerr,qres) => {
		if(qerr){
			throw(qerr);
		}
	});
	//res.redirect('/committee/' + committee);
	res.redirect('/main');
}

exports.invite = function(req,res){
	var sender = mailer.createTransport({
		service : 'gmail',
		auth: {
			user: 'adityahirapara2016@gmail.com',
			pass: 'password'
		},
		tls: {
        	rejectUnauthorized: false
    	}
	});
	let url = `http://localhost:3000/signup?q1=${req.session.user.event}&q2=${req.body.committee}`;
	var mail = {
		from : 'adityahirapara2016@gmail.com',
		to : req.body.email,
		subject : `Invitation to ${req.session.user.event}`,
		text : `Your Invitation link : ${url}`
	};

	sender.sendMail(mail,(error,msg) => {
		if(error){
			console.log(error);
		}
		else {
			console.log('Success: ' + msg.response);
		}
	});
	res.redirect('/main');
}

exports.addwork = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const assignee_name = req.body.assignee;
	const description = req.body.description;
	const difficulty = req.body.difficulty;
	const date = req.body.date;
	const tName2 = req.session.user.event + '_' + committee + '_work';
    // console.log("the value id"+tName2);
	let que = `INSERT INTO ${tName2}(heading,description,assignee,difficulty,created) VALUES('${work}','${description}','${assignee_name}','${difficulty}','${date}')`;
	con.query(que,(qerr,qres)=>{
		if(qerr)
		throw qerr;

	}); 
    res.redirect('/committee/'+committee);
}