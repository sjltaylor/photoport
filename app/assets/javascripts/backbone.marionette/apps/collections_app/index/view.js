//= require templates/index/view
//= require templates/index/collection_view
//= require templates/index/new_collection_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.CollectionView = Marionette.ItemView.extend({
    className: 'index-collection-view',
    template: 'index/collection_view',
    tagName: 'li',
    ui: {
      'showCollection': '.js-show-collection'
    },
    events: {
      'click': 'handleShowCollection'
    },
    handleShowCollection: function (e) {
      e.preventDefault();
      this.trigger('open-collection', this.model);
    },
    onRender: function () {
      this.ui.showCollection.attr({ href: this.model.get('show') });
      this.ui.showCollection.text(this.model.get('name'));
    }
  });

  Index.NewCollectionView = Marionette.ItemView.extend({
    className: 'index-new-collection-view',
    template: 'index/new_collection_view',
    tagName: 'li',
    events: {
      'click .js-new-collection'  : 'handleNewCollectionClick'
    },
    handleNewCollectionClick: function () {
      this.trigger('new-collection');
    }
  });

  Index.View = Marionette.CompositeView.extend({
    className: 'index-view',
    template: 'index/view',
    childViewContainer: '.collections-list-container ul',
    ui: {
      listContainer: '.collections-list-container',
      editContainer: '.collections-edit-container'
    },
    initialize: function () {
      _.extend(this, this.options);
    },
    getChildView: function(collection) {
      if  (collection.isNew()) return Index.NewCollectionView;
      return Index.CollectionView;
    },
    onResize: function (size) {
      this.ui.editContainer.width(size.width - this.ui.listContainer.width());
    }
  });
});
