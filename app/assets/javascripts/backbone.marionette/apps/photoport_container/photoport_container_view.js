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
      this.photoport.prepend({ el: uploadPanel.el });

      this.$el = this.$el.children();
      this.setElement(this.$el);
    },
    onShow: function () {
      this.photoport.start();
    },
    add: function (content) {
      this.photoport.append(content);
      this.photoport.seek('last');
    }
  });
});