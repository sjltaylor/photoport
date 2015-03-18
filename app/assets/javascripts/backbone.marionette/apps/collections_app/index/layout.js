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
      var targetSize = size.width * 0.20;
      var listWidth = Math.min(Math.max(targetSize, 380), 600)
      var editWidth = size.width - listWidth;

      this.list.resize({ width: listWidth, height: size.height });
      this.edit.resize({ width: editWidth, height: size.height });
    }
  });
});
