//= require photoport/photoport

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    initialize: function () {
      this.uploadPanel = this.options.uploadPanel;
      this.photoport = new Photoport({
        container: this.el
      });
    },
    onRender: function () {
      this.uploadPanel.render();
    },
    onShow: function () {
      this.photoport.start();
    },
    add: function (content) {
      this.photoport.append(content);
      this.photoport.seek('last');
    },
    showUploadPanel: function () {
      this.photoport.interlude({
        el: this.uploadPanel.el
      });
    },
    resume: function () {
      this.photoport.resume();
    }
  });
});