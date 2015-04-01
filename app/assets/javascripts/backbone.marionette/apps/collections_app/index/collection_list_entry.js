//= require templates/index/collection_list_entry

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.CollectionListEntry = Marionette.ItemView.extend({
    className: 'index-collection-list-entry',
    template: 'index/collection_list_entry',
    tagName: 'li',
    ui: {
      'editCollection': '.js-edit-collection',
      'name': '.js-name'
    },
    events: {
      'click': 'handleEditCollection'
    },
    handleEditCollection: function (e) {
      e.preventDefault();
      this.trigger('edit-collection', this.model);
    },
    onRender: function () {
      this.ui.name.text(this.model.get('name'));
    }
  });
});
