//= require templates/list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  ListItemView = Marionette.ItemView.extend({
    template: 'list_item_view',
    tagName: 'li',
    ui: {
      name: '.js-collection-name'
    },
    events: {
      mousedown: 'onClick'
    },
    onClick: function (e) {
      e.preventDefault();
    },
    onRender: function () {
      this.ui.name.text(this.model.get('name'));
      //this.ui.name.attr('href', this.model.get('show'));
    }
  });
});
