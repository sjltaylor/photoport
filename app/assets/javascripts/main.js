//= require application
//= require ./collections
//= require_tree ./servers
//= require_tree ./backbone.marionette

Collections.addRegions({
  page: {
    selector: "body",
    regionType: Collections.PageRegion
  }
});

Collections.addInitializer(function () {
  this.router = new this.Router({
    controller: this.Controller
  });
  this.identity = new Collections.Identity();
  this.identity.on('change:status', function () {
    if (this.identity.isIdentified()) {
      Collections.router.navigate('/', true)
    }
  }.bind(this));

  // views
  this.identifyView = Collections.Identify.Controller.makeView({
    identity: this.identity,
    template: 'identify'
  });
  this.signInView = Collections.Identify.Controller.makeView({
    identity: this.identity
  });
  this.identityStatusView = Collections.IdentityStatus.Controller.makeView({
    identity: this.identity
  });
  this.indexView = new Collections.Show.Controller.makeIndexView({
    identityStatusView: this.identityStatusView
  });
  this.sliderView = new Collections.Show.Controller.makeSliderView({
    indexView: this.indexView
  });

  this.landingDeferred = new $.Deferred();

  this.host.landing().done(function (landing) {
    this.identity.set(landing.identity);
    window.PHOTOPORT_CMS = {
      uploadPanelConfig: landing['upload_panel_config']
    };
    this.landingDeferred.resolve(landing);
  }.bind(this)).error(console.error);
}.bind(Collections));

Collections.on('initialize:after', function(){
  if (Backbone.history) {
    Backbone.history.start({ pushState: true });
    $(document).on('click', 'a[data-push-state]', function (evt) {

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
