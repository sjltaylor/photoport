PhotoportCMS.module('UploadPanel', function (UploadPanel, PhotoportCMS, Backbone, Marionette, $, _) {

  UploadPanel.Controller = {
    uploadPhotos: function (collection, files) {

      function onDone(data, statusText, jqXHR){
        console.warn("DONE!", arguments);
        var fileKey = jqXHR.photoportCmsMetadata.fileKey;

        PhotoportCMS.server.addPhoto(collection, fileKey).success(function (data) {
          console.warn("CALLED SERVER WITH KEY: ", fileKey, arguments);
          console.warn("SERVER RESPONSE:", data);
        }).fail(function () {
          console.warn("FAILED CALL TO SERVER", arguments);
        });
      }

      function onFail(data, statusText, jqXHR) {
        console.warn("FAILED!", arguments);
      }

      var deferreds = PhotoportCMS.s3.uploadPhotos(PHOTOPORT_CMS.uploadPanelConfig, files);

      jQuery.when.apply(null, deferreds).done(function (data, statusText, jqXHR) {
        var fileKey = jqXHR.photoportCmsMetadata.fileKey;
        console.warn("CALLING HOST WITH FILE KEY: ", fileKey);
        PhotoportCMS.host.addPhoto(collection, fileKey).success(function (photo) {
          console.warn("SERVER RESPONSE:", photo);
          collection.photos.add(photo);
        }).fail(function () {
          console.warn("FAILED CALL TO SERVER", arguments);
        });
      }).fail(function () {
        console.error('failed uploading photo to s3', arguments);
      });
    },
    makeView: function (opts) {
      var controller = this;

      var uploadPanel = new UploadPanel.View();
      uploadPanel.on("files:selected", function (files) {
        controller.uploadPhotos(opts.collection, files);
      });
      return uploadPanel;
    }
  };
});