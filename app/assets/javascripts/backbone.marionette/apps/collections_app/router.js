Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    '': 'collections',
    'sign_in': 'signIn',
    'collections/new': 'new',
    'collections/:id': 'show'
  }
});

Collections.on('collection-index-navigate', function (collection) {
  Backbone.history.navigate(collection.get('show'), { trigger: false });
});
