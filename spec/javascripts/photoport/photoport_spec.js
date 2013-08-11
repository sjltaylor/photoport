//= require photoport/photoport

describe('photoport', function () {
  var container, photoport;

  beforeEach(function () {
    container = document.createElement('div');
    photoport = new Photoport({container:container});
  });

  describe('ctor', function () {

    it('inserts a photoport root div into the container', function () {
      expect(container.childNodes.length).toEqual(1);
      expect(container.querySelector('div.photoport')).not.toBeNull();
    });

    it('renders a content element', function () {
      expect(container.querySelector('.photoport .photoport-content')).not.toBeNull();
    });

    it('renders a shadow element', function () {
      expect(container.querySelector('.photoport .photoport-shadow')).not.toBeNull();
    });

    it('renders handles', function () {
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-left')).not.toBeNull();
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-right')).not.toBeNull();
    });

    it('initialize an initial empty sequence', function () {
      expect(photoport.sequence()).toEqual([]);
    });

    describe("options", function () {
      it("throws an error if the container is not an HTMLDivElement", function () {

        var options = {
          container: "#selector.not-allowed"
        };

        expect(function(){
          new Photoport(options);
        }).toThrow();
      });
    });
  });
  describe('add, sequence', function () {
    var s0;

    beforeEach(function () {
      s0 = {
        el: $('<div>').attr({id: 'e1'})[0],
        data: {}
      };
    });

    it('adds the HTMLElement to the seqeuence', function () {
      photoport.add(s0);
      expect(photoport.sequence()[0]).toBe(s0);
    });
    it('returns the photoport', function () {
      photoport.add(s0);
      expect(photoport.add(s0)).toBe(photoport);
    });
    it('sets the size of the element to be exactly that of the photoport content view-port', function () {
      var contentContainerFake = {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect')
      };

      photoport.dom.content = contentContainerFake;

      contentContainerFake.getBoundingClientRect.andReturn({
        width: 400,
        height: 200
      });

      photoport.add(s0);

      expect(contentContainerFake.getBoundingClientRect).toHaveBeenCalled();

      expect(s0.el.style.width).toBe('400px');
      expect(s0.el.style.height).toBe('200px');
    });
  });
});