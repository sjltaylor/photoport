//= require templates/edit_panel/view

PhotoportCMS.module('EditPanel', function (EditPanel, PhotoportCMS, Backbone, Marionette, $, _) {
  EditPanel.View = Marionette.ItemView.extend({
    className: 'photoport-cms-edit-panel-container',
    template: 'edit_panel/view'
  });
});