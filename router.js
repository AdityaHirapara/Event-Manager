const express = require('express');
const Authentication = require('./authentication');
const appRouter = express.Router();
const committeeRouter = express.Router();
const workRouter = express.Router();
const Committee = require('./controllers/committee');
const Render = require('./controllers/render');
appRouter.get('/',(req,res) => {
	res.render('index');
});

appRouter.get('/create',(req,res) => {
	res.render('create');
});
appRouter.get('/signup',Render.signup);
appRouter.get('/login',Render.login);

appRouter.get('/logout',Authentication.logout);

appRouter.get('/main',Render.head);
appRouter.get('/log',(req,res) => {
	
	res.redirect('/');
});
// appRouter.get('/:name',(req,res) => {
// 	console.log(req.params.name);
// 	res.render('head1');
// });

appRouter.post('/invite',Committee.invite);
appRouter.post('/new',Authentication.create);
appRouter.post('/signup',Authentication.signup);
appRouter.post('/login',Authentication.login);
appRouter.post('/addCommittee',Committee.add);
appRouter.post('/addWork',Committee.addwork);
appRouter.get('/eventName',Authentication.eventVal);
appRouter.get('/userName',Authentication.userVal);
appRouter.get('/search',Authentication.assignee);
appRouter.get('/committeeName',Authentication.committeeVal);
appRouter.get('/:leaderboard',Render.leaderboard);
appRouter.post('/propose',Committee.propose);
appRouter.post('/close',Committee.close);
appRouter.post('/delete',Committee.deleteWork);

appRouter.use('/committee',committeeRouter);
committeeRouter.use(express.static(__dirname + '/public'));
committeeRouter.get('/:name',(req,res) =>{
	if(req.session && req.session.user){
		if(req.session.user.committee == 'head'){
			res.redirect('/committee/' + req.params.name + '/allWork');
		}
		else{
			Render.yourWork(req,res);
		}
	}
	else{
		res.redirect('/');
	}
});

committeeRouter.use('/:name',workRouter);
workRouter.use(express.static(__dirname + '/public'));
workRouter.get('/allWork',Render.allWork);
workRouter.get('/closedWork',Render.closedWork);
workRouter.get('/proposedWork',Render.proposedWork);

module.exports = appRouter;