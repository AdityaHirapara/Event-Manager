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
appRouter.get('/login',(req,res)=>{
	res.render('login');
});

appRouter.get('/logout',Authentication.logout);

appRouter.get('/main',Render.head);
appRouter.get('/log',(req,res) => {
	if(req.session && req.session.user){
		console.log(req.session.user);
	    res.render('head',{
			eventName : req.session.user.event
		});
	}
	else{
		req.session.reset();
		res.redirect('/main');
	}
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

appRouter.use('/committee',committeeRouter);
committeeRouter.use(express.static(__dirname + '/public'));
committeeRouter.get('/:name',Render.yourWork);

committeeRouter.use('/:name',workRouter);
workRouter.use(express.static(__dirname + '/public'));
workRouter.get('/allWork',Render.allWork);
workRouter.get('/closedWork',Render.closedWork);

module.exports = appRouter;