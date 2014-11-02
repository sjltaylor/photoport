//= require templates/list_placeholder_view

Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.PlaceholderView = Marionette.ItemView.extend({
    template: 'list_placeholder_view',
    className: 'placeholder-tile list-entry'
  });
});
