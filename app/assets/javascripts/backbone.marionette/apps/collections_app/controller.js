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
      app.indexView.new();
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
