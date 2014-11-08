//= require templates/index/view
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
        keyboardNavigation: true
      });

      this.collection.photos.each(function (photo) {
        this.__add__(photo);
      }, this);

      this.listenTo(this.collection.photos, 'add'   , this.__add__);
      this.listenTo(this.collection.photos, 'remove', this.__remove__);

      this.$el.append(this.photoport.container);
    },
    onResize: function (dimensions) {
      this.photoport.resize(dimensions);
    }
  });

  Index.View = Marionette.CompositeView.extend({
    className: 'index-view',
    template: 'index/view',
    childViewContainer: 'ul',
    childView: Index.ItemView,
    resize: function (dimensions) {
      //this.$el.width(dimensions.width);

      this.children.each(function (childView) {
        childView.resize(dimensions);
      });

      Marionette.triggerMethod.call(this, 'resize', dimensions);
    }
  });
});
