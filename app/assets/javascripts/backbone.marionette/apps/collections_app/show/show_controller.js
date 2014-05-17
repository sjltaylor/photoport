Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {

  Show.Controller = {
    run: function () {
      Collections.host.landing().done(function (landing) {

        window.PHOTOPORT_CMS = {
          uploadPanelConfig: landing.upload_panel_config
        };

        var layout = new Collections.AppLayout();
        var collection = new Collections.Collection(landing.collection);
        var identity = new Collections.Identity(landing.identity);

        var uploadPanel =  Collections.UploadPanel.Controller.makeView({
          collection: collection
        });

        var photoportContainerView = Collections.PhotoportContainer.Controller.makeView({
          collection: collection,
          identity: identity,
          uploadPanel: uploadPanel
        });

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

        photoportContainerView.on('save', function () {
          layout.contentRegion.show(identifyView);
        });

        identifyView.on('close-identify', function () {
          layout.contentRegion.show(photoportContainerView);
        });

        signInView.on('close-identify', function () {
          layout.contentRegion.show(photoportContainerView);
        });

        Collections.mainRegion.show(layout);
        layout.contentRegion.show(photoportContainerView);
      }).error(console.error);
    }
  };
});
