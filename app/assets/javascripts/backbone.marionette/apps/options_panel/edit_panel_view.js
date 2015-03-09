//= require templates/panels/options

Collections.module('OptionsPanel', function (OptionsPanel, Collections, Backbone, Marionette, $, _) {
  OptionsPanel.View = Marionette.ItemView.extend({
    className: 'photoport-cms-panels-options',
    template: 'panels/options',
    events: {
      'click button.close': 'destroy',
      'click .js-remove': 'onRemoveCurrent'
    },
    onRemoveCurrent: function () {
      this.trigger('remove-current');
      this.destroy();
    }
  });
});
