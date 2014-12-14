//= require templates/index/view
//= require ./collection_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.View = Marionette.ItemView.extend({
    className: 'index-view',
    template: 'index/view',
    childView: Index.ItemView,
    initialize: function () {
      _.extend(this, this.options);
    },
    contentDescriptor: function (collection) {
      var view = this.collectionViewDelegate(collection);

      view.render();

      return  {
        el: view.el,
        view: view,
        collection: collection
      };
    },
    __add__: function (e) {
      var contentDescriptor = this.contentDescriptor(e);
      contentDescriptor.view.resize(this.size());
      e.contentDescriptor = contentDescriptor;
      var penultimatePosition = this.photoport.count() - 1;
      this.photoport.insert(contentDescriptor, penultimatePosition);
    },
    __remove__: function (e) {
      e.contentDescriptor.view.destroy();
      delete e.contentDescriptor;
      this.photoport.remove(e.contentDescriptor);
    },
    onRender: function () {
      this.photoport = new Photoport({
        container: this.el,
        direction: 'vertical'
      });

      this.newCollectionPanel.render();

      this.photoport.append(this.newCollectionPanel.contentDescriptor());

      this.photoport.keyboardNavigation({enabled: true});

      this.photoport.el().addEventListener('photoport-navigate', function (e) {
        this.collection.each(function (c) {
          c.contentDescriptor.view.deactivate();
        });
        this.photoport.current.view.activate();
        this.trigger('navigate', this.photoport.current.collection);
      }.bind(this));

      this.collection.each(function (c) {
        this.__add__(c);
      }, this);

      this.listenTo(this.collection, 'add'   , this.__add__);
      this.listenTo(this.collection, 'remove', this.__remove__);

      this.$el.append(this.photoport.container);
    },
    onResize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);
      this.photoport.resize(dimensions);
      this.collection.each(function (collection) {
        collection.contentDescriptor.view.resize(dimensions);
      });
    },
    'new': function () {
      this.photoport.seek(this.photoport.count() - 1);
    },
    show: function (id) {
      var ids = this.collection.map(function (c) {
        return c.get('id').toString();
      });

      var idx = ids.indexOf(id);

      if (idx >= 0) {
        this.photoport.seek(idx);
      }
    }
  });
});
