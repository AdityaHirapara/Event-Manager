const con = require('../config');
const bodyParser = require('body-parser');
const mailer = require('nodemailer');

exports.add = function(req,res){
	const committee = req.body.committee;
	const tName = req.session.user.event + '_committee';
	const tName2 = req.session.user.event + '_' + committee + '_work';
	console.log("add"+req.session.user + " " +tName2);
	let que = `INSERT INTO ${tName} (committee_name,work) VALUES('${committee}','${tName2}')`;
	con.query(que,(qerr,qres) => {
		if(qerr){
			throw(qerr);
		}
	});

	que = `CREATE TABLE ${tName2}(heading varchar(100) NOT NULL UNIQUE,description varchar(200),assignee varchar(30),difficulty varchar(10) NOT NULL,created DATE,complete boolean NOT NULL DEFAULT 0,proposed INT(2) NOT NULL DEFAULT 0)`;
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
	const tName2 = req.session.user.event + '_' + committee + '_work';
    // console.log("the value id"+tName2);
	let que = `INSERT INTO ${tName2}(heading,description,assignee,difficulty,created) VALUES('${work}',"${description}",'${assignee_name}','${difficulty}',CURDATE())`;
	con.query(que,(qerr,qres)=>{
		if(qerr)
		console.log(qerr);

	}); 
    res.redirect('/committee/'+committee);
}

exports.propose = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const event = req.body.event;
	if(req.body.propose){
		let que = `UPDATE ${event}_${committee}_work SET proposed = 1 WHERE heading = '${work}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee);
		});
	}
	else if(req.body.cant){
		let que = `UPDATE ${event}_${committee}_work SET proposed = -1 WHERE heading = '${work}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee);
		});
	}
}

exports.close = function(req,res){
	const committee = req.body.committee;
	const work = req.body.work;
	const event = req.body.event;
	if(req.body.close){
		let que = `SELECT assignee,difficulty FROM ${event}_${committee}_work WHERE heading = '${work}'`;
		let que1 = '';
		con.query(que,(err,results,fields)=>{
			if(err)
				console.log(err);
			if(results[0].difficulty.toLowerCase() == 'easy')
				que1 = `UPDATE ${event} SET points = points+1 WHERE name = '${results[0].assignee}'`;
			else if(results[0].difficulty.toLowerCase() == 'medium')
				que1 = `UPDATE ${event} SET points = points+2 WHERE name = '${results[0].assignee}'`;
			else if(results[0].difficulty.toLowerCase() == 'hard')
				que1 = `UPDATE ${event} SET points = points+3 WHERE name = '${results[0].assignee}'`;
			con.query(que1,(qerr,qres)=>{
				if(qerr)
					console.log(qerr);
			});
		});
		que = `UPDATE ${event}_${committee}_work SET complete = 1 WHERE heading = '${work}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee);
		});
	}
	else if(req.body.change){
		const assignee = req.body.assignee;
		que = `UPDATE ${event}_${committee}_work SET assignee = '${assignee}' WHERE heading = '${work}'`;
		con.query(que,(qerr,qres)=>{
			if(qerr)
				console.log(qerr);
			res.redirect('/committee/'+committee);
		});
	}
}