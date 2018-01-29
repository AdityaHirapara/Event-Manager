const con = require('../config');

exports.head = function(req,res){
	if(req.session && req.session.user && req.session.user.committee=='head'){
		let tName = req.session.user.event + '_committee';
		let que = `SELECT commitee_name AS name FROM ${tName}`;

		con.query(que,(err,results,fields) => {
			if(err){
				throw(err);
			}
			let committee = results;
			res.render('head',{
				eventName : req.session.user.event,
				committee : committee
			});
		});
	}
	else{
		req.session.reset();
		res.redirect('/');
	}
};

exports.signup = function(req,res){
	if(req.query.q1 && req.query.q2){
		let event = req.query.q1;
		let committee = req.query.q2;
		res.render('signup',{
			event : event,
			committee : committee
		});
	}
	else{
		res.redirect('/create');
	}
}

exports.yourWork = function(req,res){
	const committee = req.params.name;
	let tName2 = req.session.user.event + '_' + committee + '_work';
	let que = `SELECT * FROM ${tName2} WHERE assignee='${req.session.user.name}'`;
	con.query(que,(err,results,fields)=>{
		if(err)
		throw err;
		res.render('yourWork',{
			committeeName:committee,
			committee:req.session.user.committee,
			works: results
		});
	});
}

exports.allWork = function(req,res){
	let path = req.originalUrl.split('/');
	const committee = path[2];
	let tName2 = req.session.user.event + '_' + committee + '_work';
	let que = `SELECT * FROM ${tName2} WHERE complete=0`;
	con.query(que,(err,results,fields)=>{
		if(err)
		throw err;
		res.render('allWork',{
			committeeName:committee,
			committee:req.session.user.committee,
			works: results
		});
	});
}

exports.closedWork = function(req,res){
	let path = req.originalUrl.split('/');
	const committee = path[2];
	let tName2 = req.session.user.event + '_' + committee + '_work';
	let que = `SELECT * FROM ${tName2} WHERE complete=1`;
	con.query(que,(err,results,fields)=>{
		if(err)
		throw err;
		res.render('closedWork',{
			committeeName:committee,
			committee:req.session.user.committee,
			works: results
		});
	});
}