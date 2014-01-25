//= require photoport/photoport
//= require templates/photoport_container


PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    template: 'photoport_container',
    className: 'photoport-container',
    events: {
      'photoport-content-hold': 'onPhotoportContentHold',
      'click .js-save': 'onSave'
    },
    initialize: function () {
      this.uploadPanel = this.options.uploadPanel;
      this.photoport = new Photoport({
        container: document.createElement('DIV')
      });
      this.photoport.append(this.uploadPanel.photoportContentDescriptor);
    },
    onRender: function () {
      this.uploadPanel.render();
      this.$el.append(this.photoport.container);
    },
    onShow: function () {
      this.photoport.start();
    },
    onSave: function () {
      this.trigger('save');
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