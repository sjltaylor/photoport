//= require templates/identify

PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'identify',
    className: 'identify-view',
    events: {
      'click .js-cancel': 'onCancelSave'
    },
    ui: {
      emailField: 'form input[name="email"]'
    },
    onCancelSave: function () {
      this.trigger('cancel-save');
    },
    onShow: function () {
      this.ui.emailField.focus();
    }
  });
});
