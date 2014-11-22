//= require templates/index/view
//= require ./item_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.View = Marionette.ItemView.extend({
    className: 'index-view',
    template: 'index/view',
    childView: Index.ItemView,
    initialize: function () {
      _.extend(this, this.options);
    },
    contentDescriptor: function (collection) {
      var view = new Index.ItemView({
        model: collection
      });

      view.render();

      return  {
        el: view.el,
        view: view,
        collection: collection
      };
    },
    __add__: function (e) {
      var contentDescriptor = this.contentDescriptor(e);
      e.contentDescriptor = contentDescriptor;
      this.photoport.append(contentDescriptor);
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

      this.photoport.keyboardNavigation({enabled: true});

      this.photoport.el().addEventListener('photoport-navigate', function (e) {
        this.collection.each(function (c) {
          c.contentDescriptor.view.deactivate();
        });
        this.photoport.current.view.activate();
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
    }
  });
});
