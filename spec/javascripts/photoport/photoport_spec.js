//= require photoport/photoport

describe('photoport', function () {
  var container, photoport, els;

  beforeEach(function () {
    container = document.createElement('div');
    photoport = new Photoport({container:container});
  });

  function createElement(idSuffix) {
    idSuffix = idSuffix === undefined ? ('_' + new Date().valueOf()) : idSuffix;
    return $('<div>').attr({id: 'el' + idSuffix})[0];
  }

  function addSomeElementsToPhotoport() {
    els = [];
    [0,1,2,3,4].forEach(function (i) {
      var el = createElement(i);
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

    it('renders handles', function () {
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-left')).not.toBeNull();
      expect(container.querySelector('.photoport .photoport-handle.photoport-handle-right')).not.toBeNull();
    });

    it('initialize an initial empty sequence', function () {
      expect(photoport.sequence).toEqual([]);
    });

    it('initializes the position to null', function () {
      expect(photoport.position).toBe(null);
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
      el = createElement();
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

    it('adds the photoport-element class to the element', function () {
      var el = createElement();
      expect(el.classList.contains('photoport-element')).toBe(false);
      photoport.fit(el);
      expect(el.classList.contains('photoport-element')).toBe(true);
    });

    it('doesnt add the photoport-element class to the element if it already has the class', function () {
      var el = createElement();
      el.className = 'photoport-element';
      expect(el.className).toBe('photoport-element');
      photoport.fit(el);
      expect(el.className).toBe('photoport-element');
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
        spyOn(photoport, 'seek').andReturn(rtn);
      });

      it('returns the result of seek(0)', function () {
        expect(photoport.start()).toBe(rtn);
        expect(photoport.seek).toHaveBeenCalledWith(0);
      });
    });
  });
  describe('next()', function () {
    var rtn;
    beforeEach(function () {
      addSomeElementsToPhotoport();
      photoport.start();
      rtn = {};
      spyOn(photoport, 'seek').andReturn(rtn);
    })
    it('calls seek() with the current position + 1', function () {
      photoport.next();
      expect(photoport.seek).toHaveBeenCalledWith(1);
    });
    it('returns the result from seek', function () {
      expect(photoport.next()).toBe(rtn);
    });
    describe('when at the end', function () {
      it('returns to the start', function () {
        photoport.seek('last');
        photoport.next();
        expect(photoport.position).toBe(0);
      });
    });
  });
  describe('previous()', function () {
    var rtn = {};
    beforeEach(function () {
      addSomeElementsToPhotoport();
      photoport.start();
    })
    it('calls seek() with the previous position', function () {
      photoport.seek(3);
      spyOn(photoport, 'seek').andReturn(rtn);
      photoport.previous();
      expect(photoport.seek).toHaveBeenCalledWith(2);
    });
    it('returns the result from seek', function () {
      spyOn(photoport, 'seek').andReturn(rtn);
      expect(photoport.previous()).toBe(rtn);
    });
    describe('when at the first position', function () {
      it('loops to the end', function () {
        photoport.seek('first');
        photoport.previous();
        expect(photoport.position).toBe(photoport.sequence.length - 1);
      });
    });
  });
  describe('seek(position)', function () {
    describe('when photoport has content', function () {
      beforeEach(function () {
        addSomeElementsToPhotoport();
        photoport.start();
      });

      it('calls fit with the element to be displayed', function () {
        spyOn(photoport, 'fit');
        photoport.seek(3);
        expect(photoport.fit).toHaveBeenCalledWith(els[3]);
      });
      it('sets the position', function () {
        expect(photoport.position).toBe(0);
        photoport.seek(2);
        expect(photoport.position).toBe(2);
      });
      it('returns the photoport', function () {
        expect(photoport.seek(2)).toBe(photoport);
      });
      it('sets the current content to the element in the sequence at the specified position', function () {
        photoport.seek(2);
        expect(photoport.dom.content.children[0]).toBe(els[2]);
      });
      describe('when called with the same position as the current position', function () {
        it('returns itself', function () {
          photoport.seek(2);
          expect(photoport.seek(2)).toBe(photoport);
        })
      })
      describe('bounds handling', function () {
        it('is seeks up to the length of the sequence', function () {
          expect(photoport.position).toBe(0);
          photoport.seek(photoport.sequence.length);
          expect(photoport.position).toBe(photoport.sequence.length - 1);
          photoport.seek(photoport.sequence.length + 5);
          expect(photoport.position).toBe(photoport.sequence.length - 1);
        });
        describe('negative seek positions', function () {
          it('offset from the length', function () {
            photoport.seek(0);
            photoport.seek(-2);
            expect(photoport.position).toBe(3);
          });
          it('offset to a minimum of zero', function () {
            photoport.seek(2);
            photoport.seek(-photoport.sequence.length * 10);
            expect(photoport.position).toBe(0);
          });
        });
      });
      describe('named positions', function () {
        describe('last', function () {
          it('calls seek with the index of the last element', function () {
            photoport.seek('last');
            expect(photoport.position).toBe(photoport.sequence.length - 1);
          });
        });
        describe('first', function () {
          it('calls seek with the index of the first element', function () {
            photoport.seek('first');
            expect(photoport.position).toBe(0);
          });
        });
      })
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
      var elN = createElement();
      photoport.insert(elN);
      expect(photoport.sequence[photoport.sequence.length-1]).toBe(elN);
    });
    it('inserts the HTMLElement into the seqeuence at the requested position', function () {
      var el = createElement('_inserted');
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
        var urlRegex = /url\("?http:\/\/localhost\/?"?\)/
        expect(el.style.backgroundImage).toMatch(urlRegex);
        expect(el.classList.contains('photo')).toBeTruthy();
      });
    });
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
    describe('when a negative position is passed', function () {
      it('inserts the element at length - pos', function () {
        var el = createElement();
        var c = photoport.sequence.length;
        var i = -3;
        var expectedPosition = c + i;
        expect(expectedPosition).toBeGreaterThan(0);
        photoport.insert(el, i);
        expect(photoport.sequence[expectedPosition]).toBe(el);
      });
      describe('when the length - position is negative', function () {
        it('inserts the element at zero', function () {
          var el = createElement();
          var i = -10000000;
          photoport.insert(el, i);
          expect(photoport.sequence[0]).toBe(el);
        })
      })
    });
    describe('when a position greater than the length is passed', function () {
      it('inserts the element at the end of the seqence', function () {
        var el = createElement();
        var l = photoport.sequence.length;
        photoport.insert(el, l + 5);
        expect(photoport.sequence[l]).toBe(el);
      });
    });
    describe('position of the inserted dom node', function () {
      describe('when inserting after the current position', function () {
        it('is the same position among siblings as in sequence', function () {
          var newEl = createElement();
          photoport.seek(0);
          photoport.insert(newEl, 1);
          expect(photoport.dom.content.children[1]).to.be(newEl);
        });
      });
      describe('when inserting at the current position', function () {
        it('is the same position among siblings as in sequence', function () {
          var newEl = createElement();
          photoport.seek(2);
          photoport.insert(newEl, 2);
          expect(photoport.dom.content.children[2]).to.be(newEl);
        });
      });
      describe('when inserting before the current position', function () {
        it('is the same position among siblings as in sequence', function () {
          var newEl = createElement();
          photoport.seek(4);
          photoport.insert(newEl, 1);
          expect(photoport.dom.content.children[1]).to.be(newEl);
        });
      });
    });
  });
  describe('navigation', function () {
    describe('clicking', function () {
      describe('right', function () {
        it('calls next', function () {
          spyOn(photoport, 'next');
          photoport.dom.rightHandle.dispatchEvent(new Event('click'));
          expect(photoport.next).toHaveBeenCalled();
        });
      });
      describe('left', function () {
        it('calls previous', function () {
          spyOn(photoport, 'previous');
          photoport.dom.leftHandle.dispatchEvent(new Event('click'));
          expect(photoport.previous).toHaveBeenCalled();
        });
      });
    });
  });
});