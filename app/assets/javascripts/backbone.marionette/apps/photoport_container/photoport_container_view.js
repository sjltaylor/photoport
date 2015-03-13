//= require photoport/photoport

Collections.module('PhotoportContainer', function (PhotoportContainer, Collections, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    events: {
      'photoport-content-hold': 'onPhotoportContentHold'
    },
    initialize: function () {
      _.extend(this, this.options);

      this.photoport = new Photoport({
        container: this.el,
        keyboardNavigation: true
      });
      this.photoport.append(this.uploadPanel.photoportContentDescriptor);

      this.collection.photos.each(function (photo) {
        this.__add__(photo);
      }, this);

      this.listenTo(this.collection.photos, 'add'   , this.__add__);
      this.listenTo(this.collection.photos, 'remove', this.__remove__);

      this.once('show', function () {
        this.photoport.seek(0);
      }, this);
    },
    onRender: function () {
      this.uploadPanel.render();
      this.$el.append(this.photoport.container);
    },
    onShow: function () {
      this.photoport.start();
    },
    __add__: function (photo) {
      var content = this.contentDescriptorDelegate(photo);
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(content, penultimatePosition);
      this.photoport.seek(penultimatePosition);
      this.update();
    },
    __remove__: function (photo) {
      var content = this.contentDescriptorDelegate(photo);
      this.photoport.remove(content);
      this.update();
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
      panel.once('destroy', function () {
        this.resume();
      }, this);
    },
    resume: function () {
      this.photoport.resume();
    },
    resize: function (dimensions) {
      this.photoport.resize(dimensions)
    }
  });
});
