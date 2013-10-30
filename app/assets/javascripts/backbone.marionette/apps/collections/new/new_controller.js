PhotoportCMS.module('CollectionsApp.New', function (New, PhotoportCMS, Backbone, Marionette, $, _) {

  New.Controller = {
    show: function () {
      var layout = new New.Layout();
      PhotoportCMS.mainRegion.show(layout);

      var collection = new PhotoportCMS.Collection(PHOTOPORT_CMS.collection);
      var uploadPanel = PhotoportCMS.UploadPanel.Controller.makeView({collection: collection});

      var photoportContainerView = new PhotoportCMS.PhotoportContainer.Controller.makeView({
        uploadPanel: uploadPanel
      });

      collection.photos.on('add', function () {
        console.warn('PHOTO ADDED', arguments);
      });

      layout.contentRegion.show(photoportContainerView);
    }
  };
});