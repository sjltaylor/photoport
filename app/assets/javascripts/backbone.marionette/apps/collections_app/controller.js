Collections.Controller = {
  show: function (id) {
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
  index: function () {
    Collections.landing.done(function (app) {
      app.page.show(Collections.Index.Controller.makeView({
        library: app.library
      }));
    });
  },
  identify: function () {
    Collections.landing.done(function (app) {
      app.page.show(Collections.Identify.Controller.makeView({
        identity: this.identity
      }));
    });
  }
};
