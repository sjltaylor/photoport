//= require templates/identify

PhotoportCMS.module('Identify', function (Identify, PhotoportCMS, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'identify',
    className: 'identify-view',
    events: {
      'click .js-cancel': 'onCancelSave',
      'submit form': 'onSave'
    },
    ui: {
      emailField: 'form input[name="email"]',
      passwordField: 'form input[name="password"]'
    },
    onCancelSave: function () {
      this.dismiss();
    },
    onShow: function () {
      this.ui.emailField.focus();
    },
    onSave: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.trigger('save', {
        email_address: this.ui.emailField.val(),
        password: this.ui.passwordField.val()
      });
    },
    dismiss: function () {
      this.trigger('close-save');
    },
    showError: function (errorMessage) {
      alert(errorMessage);
    }
  });
});
