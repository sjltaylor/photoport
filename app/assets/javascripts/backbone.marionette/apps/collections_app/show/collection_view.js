//= require photoport/photoport
//= require templates/collection_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.CollectionView = Marionette.ItemView.extend({
    template: 'collection_view',
    className: 'collection-view',
    tagName: 'div',
    events: {
      'photoport-hold': 'onPhotoportHold'
    },
    initialize: function () {
      _.extend(this, this.options);
      this.collection = this.model;
    },
    contentDescriptor: function (photo) {
      return {
        backgroundImage: photo.get('download'),
        photo: photo
      };
    },
    __add__: function (e) {
      var contentDescriptor = this.contentDescriptor(e);
      e.contentDescriptor = contentDescriptor;
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(contentDescriptor, penultimatePosition);
      this.photoport.seek(penultimatePosition);
    },
    __remove__: function (e) {
      this.photoport.remove(e.contentDescriptor);
      delete e.contentDescriptor;
    },
    onRender: function () {
      this.photoport = new Photoport({
        container: this.el,
        direction: 'horizontal'
      });

      this.photoport.keyboardNavigation({enabled: true});

      this.uploadPanel.render();

      this.photoport.append(this.uploadPanel.contentDescriptor());

      this.collection.photos.each(function (photo) {
        this.__add__(photo);
      }, this);

      this.listenTo(this.collection.photos, 'add'   , this.__add__);
      this.listenTo(this.collection.photos, 'remove', this.__remove__);

      this.$el.append(this.photoport.container);
    },
    onPhotoportHold: function (e) {
      if (e.originalEvent.detail.content != this.uploadPanel.photoportContentDescriptor) {
        this.trigger('edit-photo', e.originalEvent.detail.content);
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
    onResize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);
      this.photoport.resize(dimensions);
    },
    onBeforeDestroy: function () {
      this.photoport.destroy();
    }
  });
});
