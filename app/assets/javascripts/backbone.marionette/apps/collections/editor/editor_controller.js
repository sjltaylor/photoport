PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller = {
    populateContainer: function(photoportContainerView, collection) {
      collection.photos.each(function (photo) {
        this.addPhotoToContainer(photoportContainerView, photo);
      }.bind(this));
    },
    addPhotoToContainer: function (photoportContainerView, photo) {
      photo.contentDescriptor = {
        backgroundImage: photo.get('download')
      };

      photo.contentDescriptor.editPanel = PhotoportCMS.EditPanel.Controller.makeView().render();

      photoportContainerView.add(photo.contentDescriptor);
    },
    show: function () {
      var layout = new Editor.Layout();
      PhotoportCMS.mainRegion.show(layout);

      var collection = new PhotoportCMS.Collection(PHOTOPORT_CMS.collection);

      var uploadPanel =  new PhotoportCMS.UploadPanel.Controller.makeView({
        collection: collection
      });

      var photoportContainer = new PhotoportCMS.PhotoportContainer.Controller.makeView({
        uploadPanel: uploadPanel
      });

      this.populateContainer(photoportContainer, collection);

      collection.photos.on('add', function (photo) {
        this.addPhotoToContainer(photoportContainer, photo);
      }, this);

      layout.contentRegion.show(photoportContainer);
    }
  };
});