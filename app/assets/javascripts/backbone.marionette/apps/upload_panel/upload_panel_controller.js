PhotoportCMS.module('UploadPanel', function (UploadPanel, PhotoportCMS, Backbone, Marionette, $, _) {

  UploadPanel.Controller = {
    uploadPhotos: function (collection, files) {

      function onS3UploadDone(data, statusText, jqXHR) {
        var fileKey = jqXHR.photoportCmsMetadata.fileKey;
        console.warn("CALLING HOST WITH FILE KEY: ", fileKey);

        PhotoportCMS.host.photos.create(collection, fileKey).success(function (photo) {
          console.warn("SERVER RESPONSE:", photo);
          collection.photos.add(photo);
        }).fail(function () {
          console.warn("FAILED CALL TO SERVER", arguments);
        });
      }

      function onS3UploadFail () {
        console.error('failed uploading photos to s3', arguments);
      }

      var promises = PhotoportCMS.s3.uploadPhotos(PHOTOPORT_CMS.uploadPanelConfig, files);

      promises.forEach(function (promise) {
        promise.done(onS3UploadDone).fail(onS3UploadFail);
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