//= require ../../../support/env
//= require backbone.marionette/apps/photoport_container/photoport_container_view

describe('PhotoportContainer.View', function () {
  var photoportContainerView,
      stubUploadPanel;

  beforeEach(function () {
    stubUploadPanel = fakeContentDescriptor();
    photoportContainerView = new PhotoportCMS.PhotoportContainer.View({
      uploadPanel: stubUploadPanel
    });

    photoportContainerView.render();
  });

  function fakeContentDescriptor () {
    return {
      el: document.createElement('DIV'),
      render: function () {}
    };
  }

  describe('constructor', function () {
    it('assigns the uploadPanel option to itself', function () {
      expect(photoportContainerView.uploadPanel).toBe(stubUploadPanel);
    });
    describe('associated photoport', function () {
      it('is created with the view root el as the container', function () {
        expect(photoportContainerView.photoport.container).toBe(photoportContainerView.el);
      });
    });
  });
  describe('showUploadPanel()', function () {
    it('calls photoport.interlude() with the upload panel element', function () {
      spyOn(photoportContainerView.photoport, 'interlude');
      photoportContainerView.showUploadPanel();
      expect(photoportContainerView.photoport.interlude).toHaveBeenCalledWith({el: stubUploadPanel.el});
    });
  });
  describe('showEditPanel()', function () {
    it('calls photoport.interlude() with the edit panel element', function () {
      var editPanel = fakeContentDescriptor;
      spyOn(photoportContainerView.photoport, 'interlude');
      photoportContainerView.showEditPanel(editPanel);
      expect(photoportContainerView.photoport.interlude).toHaveBeenCalledWith({el: editPanel.el});
    });
  });
  describe('resume()', function () {
    it('calls resume() on the photoport', function () {
      spyOn(photoportContainerView.photoport, 'resume');
      photoportContainerView.resume();
      expect(photoportContainerView.photoport.resume).toHaveBeenCalled();
    });
  });
});