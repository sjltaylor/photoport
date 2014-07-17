Collections.module('List', function (List, Collections, Backbone, Marionette, $, _) {

  List.Controller = {
    makeView: function (opts) {
      return new List.View({
        collection: opts.library
      });
    }
  };
});
