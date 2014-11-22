//= require templates/index/view
//= require ./item_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {
  Index.View = Marionette.CompositeView.extend({
    className: 'index-view',
    template: 'index/view',
    childViewContainer: 'ul',
    childView: Index.ItemView,
    initialize: function () {
      this.position = 0;
    },
    resize: function (dimensions) {
      this.$el.width(dimensions.width).height(dimensions.height);

      this.children.each(function (childView) {
        childView.resize(dimensions);
      });

      Marionette.triggerMethod.call(this, 'resize', dimensions);
    },
    onRender: function () {

    }
  });
});
