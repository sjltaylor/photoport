//= require templates/edit_panel/view

PhotoportCMS.module('EditPanel', function (EditPanel, PhotoportCMS, Backbone, Marionette, $, _) {
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