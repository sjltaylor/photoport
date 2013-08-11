PhotoportCMS.module('CollectionsApp.Create', function (Create, PhotoportCMS, Backbone, Marionette, $, _) {

  Create.Controller = {
    show: function () {
      var layout = new Create.Layout();
      PhotoportCMS.mainRegion.show(layout);

      var uploadPanel = PhotoportCMS.UploadPanel.Controller.makeView();

      var photoportContainerView = new PhotoportCMS.PhotoportContainer.View({
        uploadPanel: uploadPanel
      });

      layout.contentRegion.show(photoportContainerView);
    }
  };
});