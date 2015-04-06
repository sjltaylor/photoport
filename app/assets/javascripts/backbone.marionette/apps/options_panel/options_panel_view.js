//= require templates/panels/options

Collections.module('OptionsPanel', function (OptionsPanel, Collections, Backbone, Marionette, $, _) {
  OptionsPanel.View = Marionette.ItemView.extend({
    className: 'photoport-cms-panels-options',
    template: 'panels/options',
    events: {
      'click': 'onClick',
      'click .js-remove': 'onRemoveCurrent'
    },
    onRemoveCurrent: function () {
      this.trigger('remove-current');
      this.destroy();
    },
    onClick: function (e) {
      if ($(e.target).is('.options-panel')) {
        this.destroy();
      }
    }
  });
});
