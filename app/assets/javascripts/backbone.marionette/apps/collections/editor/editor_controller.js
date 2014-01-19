PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller = {
    show: function () {
      var layout = new Editor.Layout();
      var collection = new PhotoportCMS.Collection(PHOTOPORT_CMS.collection);

      var uploadPanel =  PhotoportCMS.UploadPanel.Controller.makeView({
        collection: collection
      });

      var photoportContainer = PhotoportCMS.PhotoportContainer.Controller.makeView({
        collection: collection,
        uploadPanel: uploadPanel
      });

      // listen to identify event
      // create and show an identify view with the current user
      // listen to an event on the user model
      // show the photoport view which should now not have the save prompt

      PhotoportCMS.mainRegion.show(layout);
      layout.contentRegion.show(photoportContainer);
    }
  };
});