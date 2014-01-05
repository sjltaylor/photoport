PhotoportCMS.module('CollectionsApp.Editor', function (Editor, PhotoportCMS, Backbone, Marionette, $, _) {

  Editor.Controller = {
    show: function () {
      var layout = new Editor.Layout();
      PhotoportCMS.mainRegion.show(layout);

      var collection = new PhotoportCMS.Collection(PHOTOPORT_CMS.collection);

      var photoportEditorView = new PhotoportCMS.PhotoportEditor.Controller.makeView({
        collection: collection
      });

      layout.contentRegion.show(photoportEditorView);
    }
  };
});