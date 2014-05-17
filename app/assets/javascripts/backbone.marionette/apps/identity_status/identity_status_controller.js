Collections.module('IdentityStatus', function (IdentityStatus, Collections, Backbone, Marionette, $, _) {

  IdentityStatus.Controller = {
    makeView: function (opts) {
      return new IdentityStatus.View(opts);
    }
  };
});
