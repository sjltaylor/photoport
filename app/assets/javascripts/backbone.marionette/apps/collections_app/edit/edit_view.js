//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'open': '.js-open',
      'edit': '.js-edit',
      'name': '.js-name',
      'removeConfirm': '.js-remove-confirm',
      'remove': '.js-remove',
      'photoportContainer': '.photoport-container',
      'publicAccess': '.js-public-access'
    },
    events: {
      'click @ui.edit': 'handleEditCollection',
      'input @ui.name': 'handleInput',
      'click @ui.remove': 'handleRemoveClick',
      'change @ui.publicAccess': 'handleInput'
    },
    handleEditCollection: function (e) {
      e.preventDefault();
      this.trigger('edit-collection', this.model);
    },
    handleInput: function () {
      this.model.set({
        name: this.ui.name.val().trim(),
        allow_public_access: this.ui.publicAccess.is(':checked')
      });
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
      this.ui.open.attr({ href: this.model.get('href') });
      this.ui.edit.attr({ href: this.model.get('edit') });

      if (this.model.get('allow_public_access')) {
        this.ui.publicAccess.attr({checked: 'checked'})
      }
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
