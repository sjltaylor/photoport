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

      // collection.photos.each(function (photo) {
      //   addPhoto(photoportContainer, photo);
      // });

      if (collection.photos.length === 0) {
        for(var i = 0; i < 5; i++) {
          collection.photos.add({});
        }
      }
      collection.photos.each(function (photo) {
        var el = $('<div>');
        el.text(photo.get('id'));
        el.css('background-color', '#'+(Math.random()*0xFFFFFF<<0).toString(16));
        photoportContainer.add({
          el: el[0]
        });
      });

      collection.photos.on('add', function (photo) {
        addPhoto(photoportContainer, photo);
      });

      return photoportContainer;
    }
  };
});