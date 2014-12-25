//= require templates/index/view
//= require ./collection_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.View = Marionette.ItemView.extend({
    className: 'index-view',
    template: 'index/view',
    initialize: function () {
      _.extend(this, this.options);
    },
    __add__: function (e) {
      var contentDescriptor = this.contentDescriptor(e);
      contentDescriptor.view.render();
      contentDescriptor.view.resize(this.size());
      e.contentDescriptor = contentDescriptor;
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(contentDescriptor, penultimatePosition);
      this.onPhotoportMove();
    },
    __remove__: function (e) {
      e.contentDescriptor.view.destroy();
      delete e.contentDescriptor;
      this.photoport.remove(e.contentDescriptor);
      this.onPhotoportMove();
    },
    onRender: function () {
      this.photoport = new Photoport({
        container: this.el,
        direction: 'vertical'
      });

      this.photoport.keyboardNavigation({enabled: true});

      this.photoport.el().addEventListener('photoport-navigate', this.onPhotoportMove.bind(this));

      this.collection.each(function (c) {
        this.__add__(c);
      }, this);

      this.listenTo(this.collection, 'add'   , this.__add__);
      this.listenTo(this.collection, 'remove', this.__remove__);

      this.$el.append(this.photoport.container);
    },
    onPhotoportMove: function (e) {
      this.trigger('selection-change', this.photoport.current().collection);
    },
    onResize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);
      this.photoport.resize(dimensions);
      this.collection.each(function (collection) {
        collection.contentDescriptor.view.resize(dimensions);
      });
    },
    show: function (id) {
      var ids = this.photoport.sequence.map(function (contentDescriptor) {
        return (contentDescriptor.collection.get('id') || 'new').toString();
      });

      var idx = ids.indexOf(id);

      if (idx >= 0) {
        this.photoport.seek(idx);
      }
    }
  });
});
