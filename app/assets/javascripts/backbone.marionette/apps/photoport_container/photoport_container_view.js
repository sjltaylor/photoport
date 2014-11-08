//= require photoport/photoport

Collections.module('PhotoportContainer', function (PhotoportContainer, Collections, Backbone, Marionette, $, _) {
  PhotoportContainer.View = Marionette.ItemView.extend({
    className: 'photoport-container',
    events: {
      'photoport-content-hold': 'onPhotoportContentHold',
      'click .js-save': 'onSave'
    },
    ui: {
      savePrompt: ".save-prompt"
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

      //this.listenTo(this.identity, 'change:status', this.__update__);
    },
    onRender: function () {
      this.uploadPanel.render();
      this.$el.append(this.photoport.container);
      //this.update = this.__update__;
    },
    onShow: function () {
      this.photoport.start();
      this.update();
    },
    onSave: function () {
      this.trigger('save');
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
    update: function () {
      // noop
    },
    // __update__: function () {
    //   if (this.collection.photos.length && !this.identity.isIdentified()) {
    //     this.ui.savePrompt.show();
    //   } else {
    //     this.ui.savePrompt.hide();
    //   }
    // },
    resume: function () {
      this.photoport.resume();
    },
    //onResize: function (dimensions) {
    resize: function (dimensions) {
      this.photoport.resize(dimensions)
    }
  });
});
