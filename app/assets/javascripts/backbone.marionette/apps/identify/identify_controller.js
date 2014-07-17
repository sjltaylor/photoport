Collections.module('Identify', function (Identify, Collections, Backbone, Marionette, $, _) {

  Identify.Controller = {
    makeView: function (opts) {
      var view = new Identify.View(opts);
      var identity = opts.identity;

      view.on('identify', function (credentials) {
        Collections.host.users.identify(identity, credentials).done(function (result) {
          identity.set(result.identity);
          Collections.router.navigate('/', true);
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
