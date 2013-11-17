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
      var bounds = this.dom.content.getBoundingClientRect();

      el.style.width  = bounds.width  + 'px';
      el.style.height = bounds.height + 'px';

      if (!el.classList.contains('photoport-element')) {
        el.classList.add('photoport-element');
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
        position = Math.max(position + this.sequence.length, 0)
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

      return this;
    },
    start: function () {
      return this.seek(0);
    },
    previous: function () {
      return this.seek(circularDecr(this.position, this.sequence.length));
    },
    next: function () {
      return this.seek(circularIncr(this.position, this.sequence.length));
    },
    seek: function (position) {
      if (this.sequence.length === 0) {
        throw new Error('Nothing added to Photoport');
      }

      switch(position) {
        case 'last':
          position = this.sequence.length - 1;
          break;
        case 'first':
          position = 0;
          break;
      }

      if (position >= this.sequence.length) {
        position = this.sequence.length - 1;
      } else if (position < 0) {
        position = Math.max(0, this.sequence.length + position);
      }

      this.position = position;

      this.current = this.sequence[this.position];

      this.fit(this.current);

      var content = this.dom.content;

      while (content.hasChildNodes()) {
        content.removeChild(content.lastChild);
      }

      content.appendChild(this.current);
      return this;
    }
  };

  return Photoport;
})();
