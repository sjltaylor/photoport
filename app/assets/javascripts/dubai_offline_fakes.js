console.warn("Dubai offline fakes are active, see require statements in landing.js");

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {

  PhotoportContainer.Controller.makeView = function (opts) {
    var collection = opts.collection;

    var photoportContainer = new PhotoportContainer.View({
      uploadPanel: opts.uploadPanel
    });

    if (collection.photos.length === 0) {
      for(var i = 0; i < 5; i++) {
        collection.photos.add({});
      }
    }
    collection.photos.each(function (photo) {
      var el = $('<div>');
      el.text(photo.get('id'));
      el.css({
        backgroundColor: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
        fontSize: '240px',
        textAlign: 'center',
        color: '#303030',
        textShadow: "0 0 20px rgba(255,255,255, 0.8)"
      });

      photoportContainer.add({
        el: el[0]
      });
    });

    collection.photos.on('add', function (photo) {
      addPhoto(photoportContainer, photo);
    });

    return photoportContainer;
  };
});