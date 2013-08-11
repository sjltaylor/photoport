//= require photoport/photoport

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    onRender: function () {
      var uploadPanel = this.options.uploadPanel;
      uploadPanel.render();

      this.photoport = new Photoport({
        container: this.el
      });

      this.photoport.add({
        el: uploadPanel.el
      });
    },
    onShow: function () {
      this.photoport.start();
    }
  });
});