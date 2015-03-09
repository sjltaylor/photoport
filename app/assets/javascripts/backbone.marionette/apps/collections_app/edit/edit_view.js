//= require templates/edit/collection

Collections.module('Edit', function (Edit, Collections, Backbone, Marionette, $, _) {

  Edit.View = Marionette.ItemView.extend({
    className: 'edit-collection',
    template: 'edit/collection',
    ui: {
      'openCollection': '.js-open-collection',
      'title': 'h1'
    },
    events: {
      'click': 'handleOpenCollection'
    },
    handleOpenCollection: function (e) {
      e.preventDefault();
      this.trigger('open-collection', this.model);
    },
    onRender: function () {
      this.ui.title.text(this.model.get('name'));
      this.ui.openCollection.attr({ href: this.model.get('show') });
    }
  });
});
