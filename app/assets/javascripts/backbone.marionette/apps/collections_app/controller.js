Collections.Controller = {
  show: function (id) {
    Collections.landing.done(function (app) {
      var collection = app.library.collections().get(id);
      if (!collection.view) {
        collection.view = app.Show.Controller.makePhotoportView({
          collection: collection,
          identity: app.identity,
          uploadPanelConfig: app.library.get('uploadPanelConfig')
        });
      }
      app.page.show(collection.view);
    });
  },
  collections: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.indexView);
    });
  },
  signIn: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.signInView);
    });
  }
};
