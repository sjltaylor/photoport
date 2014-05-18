//= require application
//= require ./collections
//= require_tree ./servers
//= require_tree ./backbone.marionette

Collections.addRegions({
  mainRegion: "#main"
});

Collections.addInitializer(function () {
  Collections.router = new Collections.Router({
    controller: Collections.Controller
  });
});

Collections.on('initialize:after', function(){
  if (Backbone.history) {
    Backbone.history.start({ pushState: true });
    $(document).on('click', 'a:not([data-bypass])', function (evt) {

      var href = $(this).attr('href');
      var protocol = this.protocol + '//';

      if (href.slice(protocol.length) !== protocol) {
        evt.preventDefault();
        Collections.router.navigate(href, true);
      }
    });
  }
});

jQuery(document).ready(function () {
  Collections.start();
});