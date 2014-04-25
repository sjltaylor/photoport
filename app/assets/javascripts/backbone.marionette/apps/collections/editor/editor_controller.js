PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller = {
    run: function () {
      PhotoportCMS.host.landing().done(function (landing) {

        window.PHOTOPORT_CMS = {
          uploadPanelConfig: landing.upload_panel_config
        };

        var layout = new Editor.Layout();
        var collection = new PhotoportCMS.Collection(landing.collection);
        var identity = new PhotoportCMS.Identity(landing.identity);

        var uploadPanel =  PhotoportCMS.UploadPanel.Controller.makeView({
          collection: collection
        });

        var photoportContainerView = PhotoportCMS.PhotoportContainer.Controller.makeView({
          collection: collection,
          identity: identity,
          uploadPanel: uploadPanel
        });

        var identifyView = PhotoportCMS.Identify.Controller.makeView({
          identity: identity
        });

        var signInView = PhotoportCMS.Identify.Controller.makeView({
          identity: identity,
          template: 'sign_in'
        });

        var identityStatusView = PhotoportCMS.IdentityStatus.Controller.makeView({
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

        PhotoportCMS.mainRegion.show(layout);
        layout.contentRegion.show(photoportContainerView);
      }).error(console.error);
    }
  };
});
