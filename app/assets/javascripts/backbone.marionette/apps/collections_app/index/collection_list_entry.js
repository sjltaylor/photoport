//= require templates/index/collection_list_entry

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.CollectionListEntry = Marionette.ItemView.extend({
    className: 'index-collection-list-entry',
    template: 'index/collection_list_entry',
    tagName: 'li',
    ui: {
      'editCollection': '.js-edit-collection',
      'name': '.js-name',
    },
    events: {
      'click': 'handleEditCollection',
      'input @ui.name': 'handleNameChange'
    },
    modelEvents: {
      'change:name': 'updateNameLabel',
      'change:editing': 'updateEditingState'
    },
    initialize: function () {
      this.handleNameChange = _.throttle(this.handleNameChange,
        500,
        {
          leading: false,
          trailing: true
        });
    },
    handleEditCollection: function (e) {
      e.preventDefault();
      this.trigger('edit-collection', this.model);
    },
    handleNameChange: function () {
      this.model.set({
        name: this.ui.name.val().trim()
      });
    },
    onRender: function () {
      this.updateNameLabel();
      this.updateEditingState();
      this.ui.name.val(this.model.get('name'));
    },
    updateNameLabel: function () {
      this.ui.editCollection.text(this.model.get('name'));
    },
    updateEditingState: function () {
      if (this.model.get('editing')) {
        this.ui.editCollection.hide();
        this.ui.name.show();
        this.ui.name.focus();
      } else {
        this.ui.name.blur();
        this.ui.name.hide();
        this.ui.editCollection.show();
      }
    }
  });
});
