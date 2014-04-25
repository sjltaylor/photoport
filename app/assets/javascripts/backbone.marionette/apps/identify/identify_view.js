//= require templates/identify
//= require templates/sign_in

PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'identify',
    className: 'identify-view',
    events: {
      'click .js-cancel': 'onCancel',
      'submit form': 'onIdentify'
    },
    ui: {
      emailField: 'form input[name="email"]',
      passwordField: 'form input[name="password"]'
    },
    initialize: function () {
      this.template = this.options.template || this.template;
    },
    onCancel: function () {
      this.dismiss();
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
    dismiss: function () {
      this.trigger('close-identify');
    },
    showError: function (errorMessage) {
      alert(errorMessage);
    }
  });
});
