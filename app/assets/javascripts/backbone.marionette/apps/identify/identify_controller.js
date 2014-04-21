PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {

  Identify.Controller = {
    makeView: function (opts) {
      var view = new Identify.View(opts);
      var identity = opts.identity;

      identity.on('change:status', function () {
        if (identity.isIdentified()) {
          view.dismiss();
        }
      });

      view.on('save', function (credentials) {
        PhotoportCMS.host.users.identify(identity, credentials)
          .done(function (result) {
            if (result.error) console.error(arguments);
            identity.set(result.identity);
          }).fail(function () {
            view.showError(arguments);
          });
      });

      return view;
    }
  };
});
