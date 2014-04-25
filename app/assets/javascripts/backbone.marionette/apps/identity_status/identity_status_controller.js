PhotoportCMS.module('IdentityStatus', function (IdentityStatus, PhotoportCMS, Backbone, Marionette, $, _) {

  IdentityStatus.Controller = {
    makeView: function (opts) {
      return new IdentityStatus.View(opts);
    }
  };
});
