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
