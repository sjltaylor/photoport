PhotoportCMS.module('EditPanel', function (EditPanel, PhotoportCMS, Backbone, Marionette, $, _) {

  EditPanel.Controller = {
    makeView: function (opts) {
      return new EditPanel.View(opts);
    }
  };
});