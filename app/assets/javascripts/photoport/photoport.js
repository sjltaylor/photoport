Photoport = (function () {

  function checkOptions (options) {
    if (!(options.container instanceof HTMLDivElement)) {
      throw "container must be an instance of HTMLDivElement but was: " + options.container;
    }
  }

  function div (className) {
    var e = document.createElement('DIV');
    e.className = className || '';
    return e;
  }

  function build () {
    var dom = {
      root        : div('photoport'),
      port        : div('photoport-port'),
      content     : div('content'),
      leftHandle  : div('photoport-handle photoport-handle-left'),
      rightHandle : div('photoport-handle photoport-handle-right')
    };

    dom.root.appendChild(dom.leftHandle);
    dom.root.appendChild(dom.port);
    dom.root.appendChild(dom.rightHandle);
    dom.port.appendChild(dom.content);

    return dom;
  }

  function circularIncr(p, length) {
    return (p + 1) % length;
  }

  function circularDecr(p, length) {
    return ((p - length) % length) + length -1;
  }

  function Photoport (options) {
    checkOptions(options);
    this.container = options.container;
    this.dom = build();
    this.container.appendChild(this.dom.root);
    this.sequence = [];
    this.position = null;

    this.dom.rightHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.next();
    }.bind(this));

    this.dom.leftHandle.addEventListener('click', function (e) {
      e.preventDefault();
      this.previous();
    }.bind(this));
  }

  Photoport.prototype = {
    fit: function (el) {
      el = el || this.current;

      var bounds = this.portRect();

      el.style.width    = bounds.width  + 'px';
      el.style.height   = bounds.height + 'px';
      el.style.display  = 'inline-block';
      el.style.position = 'relative';
      el.style.top      = 0;
      el.style.left     = 0;

      if (!el.classList.contains('photoport-element')) {
        el.classList.add('photoport-element');
      }
    },
    portRect: function () {
      return this.dom.port.getBoundingClientRect();
    },
    __fitContent__: function () {
      var bounds = this.portRect();
      this.dom.content.style.width = (this.sequence.length * bounds.width) + 'px';
      for(var i = this.sequence.length - 1; i >= 0; i--) {
        this.fit(this.sequence[i]);
      }
    },
    append: function (imgUrlOrHTMLElement) {
      return this.insert(imgUrlOrHTMLElement);
    },
    prepend: function (imgUrlOrHTMLElement) {
      return this.insert(imgUrlOrHTMLElement, 0);
    },
    insert: function (imgUrlOrHTMLElement, position) {
      if (position === undefined || position === null) {
        position = this.sequence.length;
      }

      position = Math.min(position, this.sequence.length);

      if (position < 0) {
        position = Math.max(position + this.sequence.length, 0);
      }

      if (position <= this.position) {
        this.position++;
      }

      var el = imgUrlOrHTMLElement;

      if ((typeof el) === 'string') {
        el = div('photo');
        el.style.backgroundImage = "url(" + imgUrlOrHTMLElement + ")";
        el.style.backgroundRepeat = "no-repeat";
      }

      this.sequence.splice(position, 0, el);
      this.fit(el);

      var content = this.dom.content;

      for (var i = 0; i < content.children.length + 1; i++) {
        if (i === position) {
          content.insertBefore(el, content[i+1] || null);
          break;
        }
      }

      this.__fitContent__();

      return this;
    },
    start: function () {
      this.__fitContent__();
      return this.seek(0);
    },
    previous: function () {
      return this.seek(circularDecr(this.position, this.sequence.length));
    },
    next: function () {
      return this.seek(circularIncr(this.position, this.sequence.length));
    },
    seek: function (newPosition) {
      if (this.sequence.length === 0) {
        throw new Error('Nothing added to Photoport');
      }

      switch(newPosition) {
        case 'last':
          newPosition = this.sequence.length - 1;
          break;
        case 'first':
          newPosition = 0;
          break;
      }

      if (newPosition >= this.sequence.length) {
        newPosition = this.sequence.length - 1;
      } else if (newPosition < 0) {
        newPosition = Math.max(0, this.sequence.length + newPosition);
      }

      if (this.position === newPosition) return this;

      // if (newPosition > this.position) {
      //   this.__slideRightTo__(newPosition);
      // } else {
      //   this.__slideLeftTo__(newPosition);
      // }

      // collect all elements circularly up the the new position
      // fit them
      // append them to the .content node
      // animate it scrolling
      // when moved, remove all but the current node

      //return this;

      var portRect = this.portRect();
      //var currentLeft = this.position * portRect.width;
      var newLeft = -1 * newPosition * portRect.width;

      var self = this;

      $(this.dom.content).animate({
        left: newLeft + 'px'
      }, 'fast', function () {
        self.position = newPosition;
        self.current = self.sequence[self.position];
      });

      //this.fit(this.current);

      //var content = this.dom.content;

      // while (content.hasChildNodes()) {
      //   //content.removeChild(content.lastChild);
      // }

      // //content.appendChild(this.current);
      return this;
    }//,
    // __slideLeftTo__: function (newPosition) {
    //   var transitionSequence = [];
    //   for(var i = newPosition; i < this.position; i++) {
    //     transitionSequence.push(this.sequence[i]);
    //   }

    //   var width = this.portRect().width;
    //   var offset = transitionSequence.length * width;

    //   var content = this.dom.content;

    //   content.style.width = offset;
    //   content.style.position = 'relative';
    //   content.style.top = 0;
    //   content.style.left =  offset;

    //   while (content.hasChildNodes()) {
    //     content.removeChild(content.lastChild);
    //   }

    //   transitionSequence.forEach(function (transitionElement) {
    //     content.appendChild
    //   })

    //   content.style.left = 0;
    // },
    // __slideRightTo__: function () {
    //   var transitionSequence = [];
    //   for(var i = this.position + 1; i <= newPosition; i++) {
    //     transitionSequence.push(this.sequence[i]);
    //   }
    // }
  };

  return Photoport;
})();
