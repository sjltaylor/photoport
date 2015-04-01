Collections.Controller = {
  index: function () {
    Collections.landing.done(function (app) {
      app.page.show(Collections.Index.Controller.makeView({
        library: app.library
      }));
    });
  },
  editPhotos: function (id) {
    Collections.landing.done(function (app) {
      var collection = app.library.collections().get(id);
      if (collection) {
        var view = Collections.Show.Controller.makeView({
          collection: collection,
          uploadPanelConfig: app.library.get('uploadPanelConfig')
        });
        app.page.show(view);
      }
    });
  },
  edit: function (id) {
    Collections.landing.done(function (app) {
      var collection = app.library.collections().get(id);
      if (collection) {
        var view = Collections.Edit.Controller.makeView({
          library: app.library,
          collection: collection
        });
        app.page.show(view);
      }
    });
  },
  identify: function () {
    Collections.landing.done(function (app) {
      app.page.show(Collections.Identify.Controller.makeView({
        identity: app.identity
      }));
    });
  }
};
