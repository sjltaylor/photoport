PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {

  PhotoportContainer.Controller = {
    makeView: function (opts) {
      return new PhotoportContainer.View({uploadPanel: opts.uploadPanel});
    }
  };
});