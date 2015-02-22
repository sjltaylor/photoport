Collections.Controller = {
  show: function (id) {
    Collections.landing.done(function (app) {
      var collection = app.library.collections().get(id);
      if (collection) {
        collection.__view__ = collection.__view__ || Collections.Show.Controller.makeView({
          collection: collection,
          uploadPanelConfig: app.library.get('uploadPanelConfig')
        });
        app.page.show(collection.__view__);
      }
    });
  },
  index: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.indexView);
    });
  },
  identify: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.identifyView);
    });
  }
};
