PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {

  Identify.Controller = {
    makeView: function (opts) {
      return new Identify.View(opts);
    }
  };
});