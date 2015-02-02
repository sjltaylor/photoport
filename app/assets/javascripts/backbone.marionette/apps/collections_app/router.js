Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    'who_are_you': 'identify',
    'collections/new': 'new',
    'collections/:id': 'show'
  }
});
