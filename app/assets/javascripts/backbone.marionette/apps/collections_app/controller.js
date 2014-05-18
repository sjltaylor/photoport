Collections.Controller = {
  editor: function () {
    this.app().done(function (landing) {
      Collections.Show.Controller.run(landing);
    });
  },
  collections: function () {
    this.app().done(function (landing) {
      Collections.Index.Controller.run(landing);
    });
  },
  app: function () {
    var deferred = new $.Deferred();

    Collections.host.landing().done(function (landing) {
      var layout     = new Collections.AppLayout();
      var identity   = new Collections.Identity(landing.identity);

      var identifyView = Collections.Identify.Controller.makeView({
        identity: identity
      });

      var signInView = Collections.Identify.Controller.makeView({
        identity: identity,
        template: 'sign_in'
      });

      var identityStatusView = Collections.IdentityStatus.Controller.makeView({
        identity: identity
      });

      identityStatusView.render();
      $(document.body).append(identityStatusView.$el);
      identityStatusView.on('sign-in', function () {
        layout.contentRegion.show(signInView);
      });

      Collections.mainRegion.show(layout);

      deferred.resolve({
        landing: landing,
        layout: layout,
        identity: identity,
        identifyView: identifyView,
        signInView: signInView
      });
    }).error(console.error);

    return deferred;
  }
};