//= require templates/identify

Collections.module('Identify', function (Identify, Collections, Backbone, Marionette, $, _) {
  Identify.View = Marionette.ItemView.extend({
    template: 'identify',
    className: 'identify-view',
    ui: {
      form: 'form',
      email: 'form input[name="email"]',
      password: 'form input[name="password"]',
      errorFlash: '.error-flash'
    },
    events: {
      'submit form': 'onIdentify',
      "input @ui.email": "handleInput",
      "input @ui.password": "handleInput"
    },
    onShow: function () {
      this.ui.email.focus();
    },
    handleInput: function () {
      this.clearError();
    },
    onIdentify: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.trigger('identify', {
        email_address: this.ui.email.val(),
        password: this.ui.password.val()
      });
    },
    clearError: function () {
      this.ui.errorFlash.text(' ');
    },
    showError: function (error, message) {
      this.ui.errorFlash.text(message);
    }
  });
});
