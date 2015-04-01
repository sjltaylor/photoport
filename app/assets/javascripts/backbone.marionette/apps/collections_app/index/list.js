//= require templates/index/list
//= require ./collection_list_entry

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.List = Marionette.CompositeView.extend({
    className: 'index-list',
    template: 'index/list',
    childViewContainer: 'ul',
    childView: Index.CollectionListEntry,
    events: {
      'click .js-new-collection'  : 'handleNewCollectionClick'
    },
    handleNewCollectionClick: function () {
      this.trigger('new-collection');
    }
  });
});
