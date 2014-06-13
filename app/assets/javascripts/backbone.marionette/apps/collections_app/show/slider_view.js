//= require templates/slider_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.SliderView = Backbone.Marionette.Layout.extend({
    template: "slider_view",
    className: 'slider-view',
    regions: {
      index: {
        selector: "#index_region",
        regionType: Collections.PageRegion
      },
      photoport: {
        selector: "#photoport_region",
        regionType: Collections.PageRegion
      }
    },
    initialize: function (opts) {
      this.indexView = opts.indexView;
    },
    slideToIndex: function() {
      this.index.show(this.indexView);
    }
  });
});
