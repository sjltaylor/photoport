//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'open': '.js-open',
      'name': '.js-name',
      'removeConfirm': '.js-remove-confirm',
      'remove': '.js-remove',
      'photoportContainer': '.photoport-container'
    },
    events: {
      'click @ui.open': 'handleOpenCollection',
      'input @ui.name': 'handleNameInput',
      'click @ui.remove': 'handleRemoveClick'
    },
    handleOpenCollection: function (e) {
      e.preventDefault();
      this.trigger('open-collection', this.model);
    },
    handleNameInput: function () {
      this.model.set({ name: this.ui.name.val().trim() });
    },
    handleRemoveClick: function () {
      if (!!this.ui.removeConfirm.is(':checked')) {
        this.trigger('remove-collection', this.model);
      }
    },
    onRender: function () {
      this.photoport = new Photoport({
        container: this.ui.photoportContainer[0],
      });

      this.populatePhotoport();

      this.ui.name.val(this.model.get('name'));
      this.ui.open.attr({ href: this.model.get('show') });
    },
    populatePhotoport: function () {
      this.model.photos.each(function (photo) {
        var contentDescriptor = {
          backgroundImage: photo.get('download'),
          photo: photo
        }
        this.photoport.append(contentDescriptor);
      }.bind(this));
    },
    onShow: function () {
      this.photoport.resize({
        width: this.ui.photoportContainer.width(),
        height: this.ui.photoportContainer.height()
      });
    },
    onBeforeDestroy: function () {
      this.photoport.destroy();
    }
  });
});
