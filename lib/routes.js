FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('home');
  }
});

FlowRouter.route('/createlobby', {
  name: 'createLobby',
  action() {
    BlazeLayout.render('createLobby');
  }
});

FlowRouter.route('/landing', {
  name: 'landing',
  action() {
    BlazeLayout.render('landing');
  }
});

FlowRouter.route('/joinLobby', {
  name: 'joinLobby',
  action() {
    BlazeLayout.render('joinLobby');
  }
});
