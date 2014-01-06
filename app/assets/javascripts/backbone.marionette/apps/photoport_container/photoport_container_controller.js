PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {

  function addPhoto(container, photo) {
    container.add({
      backgroundImage: photo.get('download')
    });
  }

  PhotoportContainer.Controller = {
    makeView: function (opts) {
      var collection = opts.collection;

      var photoportContainer = new PhotoportContainer.View({
        uploadPanel: opts.uploadPanel
      });

      collection.photos.each(function (photo) {
        addPhoto(photoportContainer, photo);
      });

      collection.photos.on('add', function (photo) {
        addPhoto(photoportContainer, photo);
      });

      return photoportContainer;
    }
  };
});