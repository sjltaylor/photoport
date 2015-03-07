//= require templates/index/layout

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.Layout = Marionette.LayoutView.extend({
    className: 'index',
    template: 'index/layout',
    regions: {
      list: '.collections-list-container',
      edit: '.collections-edit-container'
    },
    initialize: function (opts) {
      this.opts = opts;
    },
    onRender: function () {
      this.list.show(this.opts.listView);
      this.edit.show(this.opts.editPlaceholder);
    },
    onResize: function (size) {
      this.edit.$el.width(size.width - this.list.$el.width());
    }
  });
});
