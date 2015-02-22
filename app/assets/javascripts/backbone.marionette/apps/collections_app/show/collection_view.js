//= require templates/index/collection_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.CollectionView = Marionette.ItemView.extend({
    template: 'index/collection_view',
    className: 'collection-view',
    tagName: 'div',
    modelEvents: {
      change: 'update'
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
    update: function () {
      this.photoport.keyboardNavigation({enabled: this.collection.isOpen()});
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

      this.uploadPanel.render();

      this.photoport.append(this.uploadPanel.contentDescriptor());

      this.collection.photos.each(function (photo) {
        this.__add__(photo);
      }, this);

      this.listenTo(this.collection.photos, 'add'   , this.__add__);
      this.listenTo(this.collection.photos, 'remove', this.__remove__);

      this.$el.append(this.photoport.container);
    },
    onResize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);
      this.photoport.resize(dimensions);
    }
  });
});
