PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {

  Identify.Controller = {
    makeView: function (opts) {
      var view = new Identify.View(opts);
      var user = opts.user;

      view.on('save', function (credentials) {
        PhotoportCMS.host.users.identify(user, credentials)
          .done(function () {
            debugger
          }).fail(function () {
            debugger
          });
      });

      return view;
    }
  };
});