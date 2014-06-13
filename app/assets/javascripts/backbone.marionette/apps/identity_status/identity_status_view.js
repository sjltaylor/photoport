//= require templates/identity_status

Collections.module('IdentityStatus', function (IdentityStatus, Collections, Backbone, Marionette, $, _) {
  IdentityStatus.View = Marionette.ItemView.extend({
    template: 'identity_status',
    className: 'identity-status-view',
    ui: {
      signIn: '.sign-in',
      signOut: '.sign-out',
      identityDescription: '.identity'
    },
    initialize: function () {
      this.identity = this.options.identity;
    },
    onRender: function () {
      this.listenTo(this.identity, 'change', this.update);
      this.update();
    },
    update: function () {
      var ui = this.ui;

      if (this.identity.isIdentified()) {
        ui.signIn.hide();
        ui.signOut.show();
        ui.identityDescription.html(this.identity.get('email_address'));
      } else {
        ui.identityDescription.html('anonymous');
        ui.signOut.hide();
        ui.signIn.show();
      }
    }
  });
});
