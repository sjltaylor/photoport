PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller = {
    run: function () {
      var layout = new Editor.Layout();
      var collection = new PhotoportCMS.Collection(PHOTOPORT_CMS.collection);

      var uploadPanel =  PhotoportCMS.UploadPanel.Controller.makeView({
        collection: collection
      });

      var photoportContainerView = PhotoportCMS.PhotoportContainer.Controller.makeView({
        collection: collection,
        uploadPanel: uploadPanel
      });

      var identifyView = PhotoportCMS.Identify.Controller.makeView();

      photoportContainerView.on('save', function () {
        layout.contentRegion.show(identifyView);
      });

      identifyView.on('cancel-save', function () {
        layout.contentRegion.show(photoportContainerView);
      });

      PhotoportCMS.mainRegion.show(layout);
      layout.contentRegion.show(photoportContainerView);
    }
  };
});