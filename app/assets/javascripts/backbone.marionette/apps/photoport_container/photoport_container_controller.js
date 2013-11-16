PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {

  PhotoportContainer.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var photoportContainer = new PhotoportContainer.View({
        uploadPanel: opts.uploadPanel
      });

      collection.photos.each(function (photo) {
        photoportContainer.addPhoto(photo);
      });

      collection.photos.on('add', function (photo) {
        photoportContainer.addPhoto(photo);
      });

      return photoportContainer;
    }
  };
});