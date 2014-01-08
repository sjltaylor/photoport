console.warn("Dubai offline fakes are active, see require statements in landing.js");

PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller.__populateContainer__ = Editor.Controller.populateContainer;
  Editor.Controller.populateContainer = function(photoportContainerView, collection) {
    if (collection.photos.length === 0) {
      for(var i = 0; i < 5; i++) {
        collection.photos.add({});
      }
    }
    return this.__populateContainer__(photoportContainerView, collection);
  };

  Editor.Controller.__addPhotoToContainer__ = Editor.Controller.addPhotoToContainer;
  Editor.Controller.addPhotoToContainer = function(photoportContainerView, photo) {
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

    photoportContainerView.add({
      el: el[0],
      editPanel: PhotoportCMS.EditPanel.Controller.makeView().render()
    });
  };
});