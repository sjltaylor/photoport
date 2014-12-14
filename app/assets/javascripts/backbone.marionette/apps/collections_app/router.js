Collections.Router = Marionette.AppRouter.extend({
  appRoutes: {
    '': 'collections',
    'sign_in': 'signIn',
    'collections/:id': 'show',
    'collections/new': 'new'
  }
});

Collections.on('collection-index-navigate', function (collection) {
  Backbone.history.navigate(collection.get('show'), { trigger: false });
});
