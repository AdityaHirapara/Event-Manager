const con = require('../config');

exports.head = function(req,res){
	if(req.session && req.session.user){
		if(req.session.user.committee=='head'){
			let tName = req.session.user.event + '_committee';
			let que = `SELECT committee_name AS name FROM ${tName}`;

			con.query(que,(err,results,fields) => {
				if(err){
					throw(err);
				}
				let committee = results;
				res.render('head',{
					eventName: req.session.user.event,
					committee: committee
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
};

exports.signup = function(req,res){
	if(req.query.q1 && req.query.q2){
		let event = req.query.q1;
		let committee = req.query.q2;
		res.render('signup',{
			event: event,
			committee: committee
		});
	}
	else{
		res.redirect('/create');
	}
}

exports.login = function(req,res){
	res.render('login',{
		err: req.query.err
	});
}

exports.yourWork = function(req,res){
	const committee = req.params.name;
	if(req.session && req.session.user){
		if(committee == req.session.user.committee){
			let tName2 = req.session.user.event + '_work';
			let que = `SELECT * FROM ${tName2} WHERE assignee='${req.session.user.name}'`;
			con.query(que,(err,results,fields) => {
				if(err)
				throw err;
				res.render('yourWork',{
					event: req.session.user.event,
					committeeName: committee,
					committee: req.session.user.committee,
					works: results
				});
			});
		}
		else if(req.session.user.committee == 'head'){
			res.redirect('/committee/' + committee + '/allWork');
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.allWork = function(req,res){
	console.log(req.session.user);
	let path = req.originalUrl.split('/');
	const committee = path[2];
	if(req.session && req.session.user){
		if(committee == req.session.user.committee || req.session.user.committee == 'head'){
			let tName2 = req.session.user.event + '_work';
			let que = `SELECT * FROM ${tName2} WHERE committee = '${committee}' AND complete=0`;
			con.query(que,(err,results,fields) => {
				if(err)
				throw err;
				res.render('allWork',{
					event: req.session.user.event,
					committeeName: committee,
					committee: req.session.user.committee,
					works: results,
					currentUser: req.session.user.name.toLowerCase()  //-------Remember to CHANGE---------//
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.closedWork = function(req,res){
	let path = req.originalUrl.split('/');
	const committee = path[2];
	if(req.session && req.session.user && (committee == req.session.user.committee || req.session.user.committee == 'head')){
		let tName2 = req.session.user.event + '_work';
		let que = `SELECT * FROM ${tName2} WHERE committee = '${committee}' AND complete=1`;
		con.query(que,(err,results,fields) => {
			if(err)
			throw err;
			res.render('closedWork',{
				event: req.session.user.event,
				committeeName: committee,
				committee: req.session.user.committee,
				works: results
			});
		});
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}

exports.proposedWork = function(req,res){
	let path = req.originalUrl.split('/');
	const committee = path[2];
	if(req.session && req.session.user){ 
		if(req.session.user.committee == 'head'){
			let tName2 = req.session.user.event + '_work';
			let que = `SELECT * FROM ${tName2} WHERE (committee = '${committee}') AND (proposed=-1 OR proposed=1)`;
			con.query(que,(err,results,fields) => {
				if(err)
				throw err;
				res.render('propsedWork',{
					event: req.session.user.event,
					committeeName: committee,
					committee: req.session.user.committee,
					works: results,
					currentUser: req.session.user.name.toLowerCase()  //-------Remember to CHANGE---------//
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		res.redirect('/');
	}
}

exports.leaderboard = function(req,res){
	if(req.session && req.session.user){
		let rCommittee = req.params.leaderboard;
		let committee = req.session.user.committee;
		if(committee == 'head' || committee == rCommittee){
			let event = req.session.user.event;
			let que = `SELECT name,email,points FROM ${event} WHERE committee = '${rCommittee}' ORDER BY points DESC,name ASC`;
			con.query(que,(err,results,fields) => {
				if(err)
				throw err;
				res.render('leaderboard',{
					event: req.session.user.event,
					committeeName: rCommittee,
					committee: req.session.user.committee,
					board: results,
					currentUser: req.session.user.name  //-------Remember to CHANGE---------//
				});
			});
		}
		else{
			res.redirect('/committee/' + committee);
		}
	}
	else{
		req.session.destroy();
		res.redirect('/');
	}
}