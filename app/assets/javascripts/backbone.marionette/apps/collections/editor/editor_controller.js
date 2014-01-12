PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller = {
    show: function () {
      var layout = new Editor.Layout();
      PhotoportCMS.mainRegion.show(layout);

      var collection = new PhotoportCMS.Collection(PHOTOPORT_CMS.collection);

      var uploadPanel =  PhotoportCMS.UploadPanel.Controller.makeView({
        collection: collection
      });

      var photoportContainer = PhotoportCMS.PhotoportContainer.Controller.makeView({
        collection: collection,
        uploadPanel: uploadPanel
      });

      layout.contentRegion.show(photoportContainer);
    }
  };
});