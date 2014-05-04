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

      view.on('identify', function (credentials) {
        PhotoportCMS.host.users.identify(identity, credentials)
          .done(function (result) {
            identity.set(result.identity);
          }).fail(function (response) {
            if (response.status === 422 && (typeof response.responseJSON === 'object')) {
              var payload = response.responseJSON
              view.showError(payload.error, payload.message);
            } else {
              console.error(response);
            }
          });
      });

      return view;
    }
  };
});
