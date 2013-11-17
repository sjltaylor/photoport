//= require photoport/photoport

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    initialize: function () {
      this.photoport = new Photoport({
        container: this.el
      });
    },
    onRender: function () {
      var uploadPanel = this.options.uploadPanel;
      uploadPanel.render();
      //this.photoport.append(uploadPanel.el);
    },
    onShow: function () {
      this.photoport.start();
    },
    addPhoto: function (photo) {
      this.photoport.append(photo.get('download'));
      this.photoport.next();
    }
  });
});