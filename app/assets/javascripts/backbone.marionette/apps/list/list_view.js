//= require templates/list_view
//= require ./list_item_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.View = Marionette.CompositeView.extend({
    template: 'list_view',
    className: 'list-view',
    childViewContainer: 'ul',
    childView: ListItemView,
    onResize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);
    }
  });
});
