//= require application
//= require ./collections
//= require_tree ./servers
//= require_tree ./backbone.marionette

Collections.addRegions({
  mainRegion: {
    selector: "body",
    regionType: Collections.PageRegion
  }
});

Collections.addInitializer(function () {
  this.router = new this.Router({
    controller: this.Controller
  });
  this.layout = new this.AppLayout();
  this.landingDeferred = this.host.landing();
  this.identity = new Collections.Identity();
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

  this.identityStatusView.render();

  this.mainRegion.show(this.layout);
  this.layout.identityStatus.show(this.identityStatusView);

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
