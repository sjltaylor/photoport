PhotoportCMS.module('PhotoportContainer', function (PhotoportContainer, PhotoportCMS, Backbone, Marionette, $, _) {

  PhotoportContainer.Controller = {
    populate: function(view, collection) {
      collection.photos.each(function (photo) {
        view.add(this.contentDescriptorFor(photo));
      }.bind(this));
    },
    contentDescriptorFor: function (photo) {
      if (photo.contentDescriptor === undefined) {
        var contentDescriptor = {
          backgroundImage: photo.get('download'),
          photo: photo
        };

        photo.contentDescriptor = contentDescriptor;
      }

      return photo.contentDescriptor;
    },
    makeView: function (opts) {
      var collection = opts.collection;

      var view =  new PhotoportContainer.View({
        uploadPanel: opts.uploadPanel
      });

      this.populate(view, collection);

      collection.photos.on('add', function (photo) {
        view.add(this.contentDescriptorFor(photo));
      }, this);

      collection.photos.on('remove', function (photo) {
        view.remove(this.contentDescriptorFor(photo));
      }, this);

      view.on('edit', function (content) {
        var editPanel = PhotoportCMS.EditPanel.Controller.makeView({
          collection: collection,
          photo: content.photo
        }).render();
        view.showPanel(editPanel);
      });

      return view;
    }
  };
});