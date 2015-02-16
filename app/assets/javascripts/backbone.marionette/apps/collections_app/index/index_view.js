//= require templates/index/view
//= require templates/index/item_view
//= require ./collection_view

Collections.module('Index', function (Index, Collections, Backbone, Marionette, $, _) {

  Index.ItemView = Marionette.ItemView.extend({
    className: 'index-item-view',
    template: 'index/item_view',
    tagName: 'li',
    initialize: function () {

    }
  });

  Index.View = Marionette.CompositeView.extend({
    className: 'index-view',
    template: 'index/view',
    childView: Index.ItemView,
    childViewContainer: '.collections-container',
    initialize: function () {
      _.extend(this, this.options);
    }
  });
});
