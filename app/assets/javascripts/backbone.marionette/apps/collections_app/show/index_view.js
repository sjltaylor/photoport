//= require templates/index_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.IndexView = Marionette.LayoutView.extend({
    className: 'index-view',
    template: 'index_view',
    regionClass: Collections.PageRegion,
    regions: {
      primaryNavigationRegion: '#primary_navigation',
      identityStatusRegion: '#identity_status',
      listContainerRegion: '#list_container'
    },
    initialize: function (opts) {
      this.identityStatusView = opts.identityStatusView;
      this.listView = opts.listView;
    },
    onRender: function () {
      this.identityStatusRegion.show(this.identityStatusView);
      this.listContainerRegion.show(this.listView);
    },
    setUrl: function (url) {
      this.__url__ = url;
    },
    url: function () {
      return this.__url__;
    },
    updateGeometry: function (width, height) {
      var container = this.listContainerRegion.$el;
      var listWidth = 400;
      var offset = 30;

      container.css({
        width: listWidth + 'px',
        height: (height - (2*offset)) + 'px',
        top: offset + 'px',
        left: ((width / 2) - (400 / 2)) + 'px'
      })
    }
  });
});
