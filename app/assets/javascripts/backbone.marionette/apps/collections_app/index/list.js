//= require templates/index/list
//= require templates/index/new_collection_list_entry
//= require ./collection_list_entry

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

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
      return Index.CollectionListEntry;
    },
  });
});
