Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    'who_are_you': 'identify',
    'collections/:id/edit': 'edit',
    'collections/:id/photos/edit': 'editPhotos',
    'collections': 'index'
  }
});
