//= require templates/index/list
//= require templates/index/collection_list_entry
//= require templates/index/new_collection_list_entry

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.ListCollectionEntry = Marionette.ItemView.extend({
    className: 'index-collection-list-entry',
    template: 'index/collection_list_entry',
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

  Index.NewCollectionListEntry = Marionette.ItemView.extend({
    className: 'index-new-collection-list-entry',
    template: 'index/new_collection_list_entry',
    tagName: 'li',
    events: {
      'click .js-new-collection'  : 'handleNewCollectionClick'
    },
    handleNewCollectionClick: function () {
      this.trigger('new-collection');
    }
  });

  Index.List = Marionette.CompositeView.extend({
    className: 'index-list',
    template: 'index/list',
    childViewContainer: 'ul',
    getChildView: function(collection) {
      if  (collection.isNew()) return Index.NewCollectionListEntry;
      return Index.ListCollectionEntry;
    },
  });
});
