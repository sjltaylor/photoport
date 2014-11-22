//= require templates/index/item_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.ItemView = Marionette.ItemView.extend({
    template: 'index/item_view',
    className: 'item-view',
    tagName: 'div',
    ui: {
      container: '.photoport-container'
    },
    initialize: function () {
      _.extend(this, this.options);

      this.collection = this.model;

      // this.once('show', function () {
      //   this.photoport.seek(0);
      // }, this);

      //this.listenTo(this.identity, 'change:status', this.__update__);
    },
    contentDescriptor: function (photo) {
      return {
        backgroundImage: photo.get('download'),
        photo: photo
      };
    },
    activate: function () {
      this.photoport.keyboardNavigation({enabled: true});
    },
    deactivate: function () {
      this.photoport.keyboardNavigation({enabled: false});
    },
    __add__: function (e) {
      var contentDescriptor = this.contentDescriptor(e);
      e.contentDescriptor = contentDescriptor;
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(contentDescriptor, penultimatePosition);
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
