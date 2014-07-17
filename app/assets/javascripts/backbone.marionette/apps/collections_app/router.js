Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    '': 'collections',
    'sign_in': 'sign_in',
    'collections/:id': 'show'
  }
});
