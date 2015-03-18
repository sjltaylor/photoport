//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'open': '.js-open',
      'publicAccessUrl': '.js-public-access-url',
      'edit': '.js-edit',
      'name': '.js-name',
      'close': '.js-close',
      'removeConfirm': '.js-remove-confirm',
      'remove': '.js-remove',
      'photoportContainer': '.photoport-container',
      'publicAccess': '.js-public-access'
    },
    events: {
      'click @ui.edit': 'handleEditCollection',
      'input @ui.name': 'handleInput',
      'click @ui.remove': 'handleRemoveClick',
      'change @ui.publicAccess': 'handleInput',
      'click @ui.close': 'handleClose'
    },
    modelEvents: {
      change: 'update'
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
    handleClose: function () {
      this.trigger('user-close');
    },
    onRender: function () {
      this.update();
    },
    update: function () {
      this.ui.name.val(this.model.get('name'));
      this.ui.edit.attr({ href: this.model.get('edit') });

      this.ui.open.attr({ href: this.model.get('href') });
      this.ui.open.text(this.ui.open.prop('href'));

      if (this.model.get('allow_public_access')) {
        this.ui.publicAccess.attr({checked: 'checked'});
        this.ui.publicAccessUrl.show();
      } else {
        this.ui.publicAccessUrl.hide();
      }
    }
  });
});
