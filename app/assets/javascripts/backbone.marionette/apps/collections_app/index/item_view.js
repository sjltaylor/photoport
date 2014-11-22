//= require templates/index/item_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.ItemView = Marionette.ItemView.extend({
    template: 'index/item_view',
    tagName: 'li',
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
    __add__: function (photo) {
      var content = photo.contentDescriptor();
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(content, penultimatePosition);
    },
    __remove__: function (photo) {
      var content = photo.contentDescriptor();
      this.photoport.remove(content);
    },
    onRender: function () {
      this.photoport = new Photoport({
        container: this.ui.container[0],
        direction: 'horizontal'
      });

      this.photoport.keyboardNavigation({enabled: true});

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
