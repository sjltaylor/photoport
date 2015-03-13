Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    'who_are_you': 'identify',
    'collections/:id/edit': 'show',
    'collections': 'index'
  }
});
