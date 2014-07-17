//= require templates/index_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.IndexView = Marionette.LayoutView.extend({
    className: 'index-view',
    template: 'index_view',
    regions: {
      primaryNavigationRegion: {
        selector: '#primary_navigation',
        regionClass: Collections.PageRegion
      },
      identityStatusRegion: {
        selector: '#identity_status',
        regionClass: Collections.PageRegion
      },
      listContainerRegion: {
        selector: '#list_container',
        regionClass: Collections.PageRegion
      }
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
    }
  });
});
