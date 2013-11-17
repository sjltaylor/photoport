//= require photoport/photoport

describe('photoport', function () {
  var container, photoport, els;

  beforeEach(function () {
    container = document.createElement('div');
    photoport = new Photoport({container:container});
  });

  function addSomeElementsToPhotoport() {
    els = [];
    [0,1,2,3,4].forEach(function (i) {
      var el = $('<div>').attr({id: 'e' + i})[0];
      els[i] = el;
      photoport.insert(el, i);
    });
  }

  describe('constructor', function () {

    it('inserts a photoport root div into the container', function () {
      expect(container.childNodes.length).toEqual(1);
      expect(container.querySelector('div.photoport')).not.toBeNull();
    });

    it('renders a content element', function () {
      expect(container.querySelector('.photoport .content')).not.toBeNull();
    });

    xit('renders handles', function () {
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-left')).not.toBeNull();
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-right')).not.toBeNull();
    });

    it('initialize an initial empty sequence', function () {
      expect(photoport.sequence).toEqual([]);
    });

    it('sets the position to -1', function () {
      expect(photoport.position).toEqual(-1);
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
  describe('fit()', function () {
    var el;

    beforeEach(function () {
      el = $('<div>').attr({id: 'el'})[0];
    });

    it('sets the dimensions of the element to those of the photoport viewing viewport', function () {
      var contentContainerFake = {
        getBoundingClientRect: jasmine.createSpy('getBoundingClientRect')
      };

      photoport.dom.content = contentContainerFake;

      contentContainerFake.getBoundingClientRect.andReturn({
        width: 400,
        height: 200
      });

      photoport.fit(el);

      expect(contentContainerFake.getBoundingClientRect).toHaveBeenCalled();

      expect(el.style.width).toBe('400px');
      expect(el.style.height).toBe('200px');
    });
  });
  describe('start()', function () {
    beforeEach(function () {
      addSomeElementsToPhotoport();
    });

    describe('when the photoport has not been started', function () {
      var rtn;

      beforeEach(function () {
        rtn = {};
        spyOn(photoport, 'next').andReturn(rtn);
      });


      it('returns the result of next()', function () {
        expect(photoport.start()).toBe(rtn);
        expect(photoport.next).toHaveBeenCalled();
      });
    });
    describe('when the photoport has been started', function () {
      it('does not call next()', function () {
        photoport.start();
        spyOn(photoport, 'next');
        photoport.start();
        expect(photoport.next).not.toHaveBeenCalled();
      });
      it('returns the photoport', function () {
        expect(photoport.start()).toBe(photoport);
      });
      it('calls fit with the current element', function () {
        spyOn(photoport, 'fit');
        photoport.start();
        expect(photoport.fit).toHaveBeenCalledWith(photoport.current);
      });
    });
  });
  describe('next()', function () {
    describe('when photoport has content', function () {
      beforeEach(function () {
        addSomeElementsToPhotoport();
        photoport.start();
      });

      it('calls fit with the next element', function () {
        spyOn(photoport, 'fit');
        photoport.next();
        expect(photoport.fit).toHaveBeenCalledWith(els[1]);
      });
      it('increments the position', function () {
        expect(photoport.position).toBe(0);
        photoport.next();
        expect(photoport.position).toBe(1);
      });
      it('returns the photoport', function () {
        expect(photoport.next()).toBe(photoport);
      });
      it('is circular', function () {
        photoport.next();
        expect(photoport.position).toBe(1);
        for (var i = 0; i < photoport.sequence.length; i++) {
          photoport.next();
        }
        expect(photoport.position).toBe(1);
      });
      it('sets the current content to the next element', function () {
        expect(photoport.dom.content.children[0]).toBe(els[0]);
      });
    });
    describe('when no content has been added', function () {
      it('throws an exception', function () {
        expect(function () {
          photoport.start();
          photoport.next();
        }).toThrow();
      });
    });
  });
  describe('insert(el, position)', function () {
    beforeEach(function () {
      addSomeElementsToPhotoport();
      photoport.start();
    });

    it('defaults the position to the end of the sequence', function () {
      var elN = $('<div>').attr({id: 'e1'})[0];
      photoport.insert(elN);
      expect(photoport.sequence[photoport.sequence.length-1]).toBe(elN);
    });
    it('inserts the HTMLElement into the seqeuence at the requested position', function () {
      var el = $('<div>').attr({id: 'el_inserted'})[0];
      photoport.insert(el, 3);
      expect(photoport.sequence[3]).toBe(el);
    });
    it('returns the photoport', function () {
      expect(photoport.insert(els[0])).toBe(photoport);
    });
    describe('when passed an image url', function () {
      it('creates an div in which to display the image', function () {
        photoport.prepend('http://localhost');
        var el = photoport.sequence[0];
        expect(el instanceof HTMLDivElement).toBeTruthy();
        expect(el.style.backgroundImage).toEqual('url(http://localhost/)');
        expect(el.classList.contains('photo')).toBeTruthy();
      });
    })
    describe('when the element is inserted before the current position', function () {
      it('incremements the position', function () {
        photoport.next();
        expect(photoport.position).toBe(1);
        photoport.insert(els[0], 0);
        expect(photoport.position).toBe(2);
      });
    });
    describe('when the element is inserted at the current position', function () {
      it('incremements the position', function () {
        expect(photoport.position).toBe(0);
        photoport.insert(els[0], 0);
        expect(photoport.position).toBe(1);
      });
    });
  });
});