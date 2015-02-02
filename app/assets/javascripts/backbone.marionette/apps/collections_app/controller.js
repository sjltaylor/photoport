Collections.Controller = {
  show: function (id) {
    Collections.landing.done(function (app) {
      app.page.show(app.indexView);
      app.indexView.show(id);
    });
  },
  'new': function () {
    Collections.landing.done(function (app) {
      app.page.show(app.indexView);
      app.indexView.show('new');
    });
  },
  collections: function () {
    Collections.landing.done(function (app) {
      app.page.show(app.indexView);
    });
  },
  identify: function () {
    Collections.landing.done(function (app) {
      app.page.show(Collections.identifyView);
    });
  }
};
