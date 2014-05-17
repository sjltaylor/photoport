//= require templates/identity_status

Collections.module('IdentityStatus', function (IdentityStatus, Collections, Backbone, Marionette, $, _) {
  IdentityStatus.View = Marionette.ItemView.extend({
    template: 'identity_status',
    className: 'identity-status-view',
    events: {
      'click .sign-in .action': 'signIn'
    },
    ui: {
      signIn: '.sign-in',
      signOut: '.sign-out',
      signOutLink: '.sign-out a',
      currentIdentityEmail: '.sign-out .email'
    },
    initialize: function () {
      this.identity = this.options.identity;
      this.listenTo(this.identity, 'change:status', this.update);
    },
    onRender: function () {
      this.update();
      this.ui.signOutLink.attr('href', this.options.identity.get('sign_out'))
    },
    update: function () {
      if (this.identity.isIdentified()) {
        this.ui.signIn.hide();
        this.ui.signOut.show();
        this.ui.currentIdentityEmail.html(this.identity.get('email_address'));
      } else {
        this.ui.signOut.hide();
        this.ui.signIn.show();
      }
    },
    signIn: function () {
      this.trigger('sign-in');
    }
  });
});
