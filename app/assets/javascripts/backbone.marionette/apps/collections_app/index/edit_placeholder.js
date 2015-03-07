//= require templates/index/edit_placeholder

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.EditPlaceholder = Marionette.ItemView.extend({
    className: 'edit-placeholder',
    template: 'index/edit_placeholder'
  });
});
