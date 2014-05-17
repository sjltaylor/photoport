//= require templates/edit_panel/view

Collections.module('EditPanel', function (EditPanel, Collections, Backbone, Marionette, $, _) {
  EditPanel.View = Marionette.ItemView.extend({
    className: 'photoport-cms-edit-panel-container',
    template: 'edit_panel/view',
    events: {
      'click button.close': 'close',
      'click .js-remove': 'onRemoveCurrent'
    },
    onRemoveCurrent: function () {
      this.trigger('remove-current');
      this.close();
    }
  });
});