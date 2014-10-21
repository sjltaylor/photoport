//= require templates/list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  ListItemView = Marionette.ItemView.extend({
    template: 'list_item_view',
    tagName: 'li',
    ui: {
      name: '.js-collection-name'
    },
    modelEvents: {
      "change:name": "updateName"
    },
    onRender: function () {
      this.updateName();
    },
    updateName: function () {
      this.ui.name.text(this.model.get('name'));
      var r = this.el.getBoundingClientRect();
      this.model.set({
        width: r.width,
        height: r.height
      });
    }
  });
});
