//= require templates/list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  ListItemView = Marionette.ItemView.extend({
    template: 'list_item_view',
    tagName: 'li',
    ui: {
      name: '.js-collection-name'
    },
    modelEvents: {
      "change": "update"
    },
    onRender: function () {
      this.update();
    },
    update: function () {
      this.ui.name.text(this.model.get('name'));
      this.trigger('update');
    }
  });
});
