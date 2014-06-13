//= require templates/index_view

Collections.module('Show', function (Show, Collections, Backbone, Marionette, $, _) {
  Show.IndexView = Marionette.Layout.extend({
    className: 'index-view',
    template: 'index_view',
    regions: {
      primaryNavigationRegion: {
        selector: '#primary_navigation',
        regionPage: Collections.PageRegion
      },
      identityStatusRegion: {
        selector: '#identity_status',
        regionPage: Collections.PageRegion
      },
      listContainerRegion: {
        selector: '#list_container',
        regionPage: Collections.PageRegion
      }
    },
    initialize: function (opts) {
      this.identityStatusView = opts.identityStatusView;
    },
    onRender: function () {
      this.identityStatusRegion.show(this.identityStatusView)
    }
  });
});
