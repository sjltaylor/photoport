//= require application
//= require photoport_cms
//= require backbone.marionette/apps/upload_panel/upload_panel_view

describe("PhotportCMS.UploadPanel.View", function () {
  describe("#triggerFilesSelected", function () {
    var view;
    beforeEach(function () {
      view = new PhotoportCMS.UploadPanel.View();
    });
    it("triggers the files:selected event if there are some files", function () {
      spyOn(view, 'trigger');
      var files = [{},true,'three'];
      view.triggerFilesSelected(files);
      expect(view.trigger).toHaveBeenCalledWith('files:selected', files);
    });
    it("does not trigger the files:selected event if there are zero files", function () {
      spyOn(view, 'trigger');
      var files = [];
      view.triggerFilesSelected(files);
      expect(view.trigger).not.toHaveBeenCalled();
    });
  });
});