Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    '': 'collections',
    'sign_in': 'signIn',
    'collections/:id': 'show'
  }
});
