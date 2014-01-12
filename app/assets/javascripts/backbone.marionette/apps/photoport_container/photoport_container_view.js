//= require photoport/photoport

PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    events: {
      'photoport-content-hold': 'onPhotoportContentHold'
    },
    initialize: function () {
      this.uploadPanel = this.options.uploadPanel;
      this.photoport = new Photoport({
        container: this.el
      });
    },
    onRender: function () {
      this.uploadPanel.render();
      this.photoport.append(this.uploadPanel.photoportContentDescriptor);
    },
    onShow: function () {
      this.photoport.start();
    },
    add: function (content) {
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(content, penultimatePosition);
      this.photoport.seek(penultimatePosition);
    },
    remove: function (content) {
      this.photoport.remove(content);
    },
    onPhotoportContentHold: function (e) {
      if (e.originalEvent.detail.content != this.uploadPanel.photoportContentDescriptor) {
        this.trigger('edit', e.originalEvent.detail.content);
      }
    },
    showPanel: function (panel) {
      this.photoport.interlude({
        el: panel.el
      });
      panel.once('close', function () {
        this.resume();
      }, this);
    },
    resume: function () {
      this.photoport.resume();
    }
  });
});