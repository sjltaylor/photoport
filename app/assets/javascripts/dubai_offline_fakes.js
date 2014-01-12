console.warn("Dubai offline fakes are in effect. See require statements in landing.js");

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {

  PhotoportContainer.Controller.map = function(photo) {
    photo.set('download', undefined);
    var el = $('<div>');
    el.text(photo.get('id'));
    el.css({
      backgroundColor: '#'+(Math.random()*0xFFFFFF<<0).toString(16),
      fontSize: '240px',
      textAlign: 'center',
      color: '#303030',
      textShadow: "0 0 20px rgba(255,255,255, 0.8)"
    });

    var contentDescriptor = {
      el: el[0],
      photo: photo
    };

    photo.contentDescriptor = contentDescriptor;
    return contentDescriptor;
  };
});