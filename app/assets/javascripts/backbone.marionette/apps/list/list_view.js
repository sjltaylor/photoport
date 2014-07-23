//= require templates/list_view
//= require templates/list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  ListEntryView = Marionette.ItemView.extend({
    template: 'list_item_view',
    tagName: 'li',
    ui: {
      name: 'a'
    },
    onRender: function () {
      this.ui.name.text(this.model.get('name'));
      this.ui.name.attr('href', this.model.get('show'));
    }
  });

  List.View = Marionette.CompositeView.extend({
    template: 'list_view',
    className: 'list-view',
    childViewContainer: 'ul.inner',
    childView: ListEntryView,
    ui: {

    },
    initialize: function () {

    }
  });
});
