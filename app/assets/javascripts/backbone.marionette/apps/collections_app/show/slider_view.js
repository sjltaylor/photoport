//= require backbone.marionette/page_region

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  var EmptyView = Backbone.Marionette.ItemView.extend({
    url: function () {
      return Collections.indexView.url();
    }
  });

  Show.SliderView = Backbone.Marionette.LayoutView.extend({
    template: "slider_view",
    className: 'slider-view',
    regionClass: Collections.PageRegion,
    regions: {
      index: '#index_region',
      photoport: '#photoport_region'
    },
    ui: {
      viewport: '.slider-view-viewport'
    },
    initialize: function (opts) {
      this.indexView = opts.indexView;
      $(window).on('resize', this.resize.bind(this));
      this.emptyView = new EmptyView();
    },
    slideToIndex: function() {
      this.slideTo('index', this.indexView);
    },
    slideToPhotoport: function (photoport) {
      this.slideTo('photoport', photoport);
    },
    onRender: function () {
      this.index.show(this.indexView);
      this.photoport.show(this.emptyView);
      this.resize();
      this.ui.viewport.scroll(this.onScroll.bind(this));
    },
    onScroll: function (event) {
      if (!this.__sliding__) {
        var indexHeight = this.index.$el.outerHeight();
        var yPos = this.ui.viewport.scrollTop();
        var region;

        if (yPos >= (indexHeight / 2.0)) {
          region = this.photoport;
        } else {
          region = this.index;
        }

        Collections.router.navigate(region.currentView.url(), {
          trigger: false
        });
      }
    },
    resize: function () {
      var width =  window.innerWidth,
          height = window.innerHeight;

      this.ui.viewport.css({
        width: width + 'px',
        height: height + 'px',
        position: 'absolute',
        left: '0px',
        top: '0px'
      });

      var indexHeight = height - 40;

      this.index.$el.css({
        width: width + 'px',
        height: indexHeight + 'px'
      });

      this.indexView.updateGeometry(width, indexHeight);

      this.photoport.$el.css({
        width: width + 'px',
        height: (height - 15) + 'px'
      });
    },
    slideTo: function (regionName, view) {
      var region = this[regionName];

      region.show(view);

      this.resize();

      this.__sliding__ = true;
      this.ui.viewport.animate({
        scrollTop: region.$el.offset().top
      }, 500, 'easeInOutQuint', function () {
        this.__sliding__ = false;
      }.bind(this));
    }
  });
});
