//= require templates/identify

Collections.module('Identify', function (Identify, Collections, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'identify',
    className: 'identify-view',
    events: {
      'submit form': 'onIdentify'
    },
    ui: {
      form: 'form',
      emailField: 'form input[name="email"]',
      passwordField: 'form input[name="password"]',
      errorFlash: '.error-flash'
    },
    initialize: function () {
      this.template = this.options.template || this.template;
    },
    onCancel: function () {
      this.trigger('cancel');
    },
    onShow: function () {
      this.ui.emailField.focus();
    },
    onIdentify: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.trigger('identify', {
        email_address: this.ui.emailField.val(),
        password: this.ui.passwordField.val()
      });
    },
    showError: function (error, message) {
      this.ui.errorFlash.show().text(message);
    }
  });
});
