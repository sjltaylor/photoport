//= require templates/identify
//= require templates/sign_in

Collections.module('Identify', function (Identify, Collections, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'sign_in',
    className: 'identify-view',
    events: {
      'click .js-back': 'onBack',
      'click .js-cancel': 'onCancel',
      'submit form': 'onIdentify',
      'click .js-save': 'onSave'
    },
    ui: {
      prompts: '.prompt',
      form: 'form',
      emailField: 'form input[name="email"]',
      passwordField: 'form input[name="password"]',
      errorFlash: '.error-flash'
    },
    initialize: function () {
      this.template = this.options.template || this.template;
    },
    onBack: function () {
      history.back();
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
      this.ui.prompts.hide();
      this.ui.errorFlash.show().text(message);
    },
    onSave: function () {
      e.preventDefault();
      e.stopPropagation();
      this.trigger('save');
    }
  });
});
