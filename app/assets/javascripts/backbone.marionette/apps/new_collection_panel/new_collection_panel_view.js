//= require templates/new_collection_panel

Collections.module('NewCollectionPanel', function (NewCollectionPanel, Collections, Backbone, Marionette, $, _) {
  NewCollectionPanel.View = Marionette.ItemView.extend({
    template: "new_collection_panel",
    className: 'new-collection-panel',
    events: {
      'click .js-new-collection'  : 'handleNewCollectionClick'
    },
    handleNewCollectionClick: function () {
      this.trigger('new-collection');
    },
    activate: function () {},
    deactivate: function () {},
    contentDescriptor: function () {
      return {
        el: this.el,
        view: this,
        collection: this.model
      };
    }
  });
});
