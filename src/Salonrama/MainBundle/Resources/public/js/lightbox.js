var Lightbox = (function() {
  function Lightbox(options) {
    var optionsDefault = {
      fadeDuration: 500,
      fitImagesInViewport: true,
      resizeDuration: 700,
      showImageNumberLabel: true,
      wrapAround: false,
      getDetailsNumber: function(curImageNum, albumSize) {
        return "Image " + curImageNum + " sur " + albumSize;
      },
      getDetailsCaption: function(title, imageNumber){
        return title;
      }
    };

    this.options = $.extend(optionsDefault, options);
    this.album = [];
    this.currentImageIndex = void 0;
    this.init();
  }

  Lightbox.prototype.init = function() {
    this.enable();
    return this.build();
  };

  Lightbox.prototype.enable = function() {
    var _this = this;
    return $('body').on('click', 'a[data-lightbox]', function(e) {
      _this.start($(e.currentTarget));
      return false;
    });
  };

  Lightbox.prototype.build = function() {
    var _this = this;
    $("<div id='lightboxOverlay' class='lightboxOverlay'></div><div id='lightbox' class='lightbox'><div class='lb-outerContainer'>"+
      "<div class='lb-container'><img class='lb-image' src='' />"+
      "<div class='lb-nav'><a class='lb-prev' href='' ><span title='Précédent'></span></a><a class='lb-next' href='' ><span title='Suivant'></span></a></div>"+
      "<div class='lb-loader'><i class='icon-spinner icon-spin'></i></div></div></div><div class='lb-dataContainer'><div class='lb-data'>"+
      "<div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div>"+
      "<a class='lb-close' title='Fermer'></a></div></div></div>").appendTo($('body'));
    this.$lightbox = $('#lightbox');
    this.$overlay = $('#lightboxOverlay');
    this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
    this.$container = this.$lightbox.find('.lb-container');
    this.containerTopPadding = parseInt(this.$container.css('padding-top'), 10);
    this.containerRightPadding = parseInt(this.$container.css('padding-right'), 10);
    this.containerBottomPadding = parseInt(this.$container.css('padding-bottom'), 10);
    this.containerLeftPadding = parseInt(this.$container.css('padding-left'), 10);
    this.$overlay.hide().on('click', function() {
      _this.end();
      return false;
    });
    this.$lightbox.hide().on('click', function(e) {
      if ($(e.target).attr('id') === 'lightbox') {
        _this.end();
      }
      return false;
    });
    this.$outerContainer.on('click', function(e) {
      if ($(e.target).attr('id') === 'lightbox') {
        _this.end();
      }
      return false;
    });
    this.$lightbox.find('.lb-prev').on('click', function() {
      if (_this.currentImageIndex === 0) {
        _this.changeImage(_this.album.length - 1);
      } else {
        _this.changeImage(_this.currentImageIndex - 1);
      }
      return false;
    });
    this.$lightbox.find('.lb-next').on('click', function() {
      if (_this.currentImageIndex === _this.album.length - 1) {
        _this.changeImage(0);
      } else {
        _this.changeImage(_this.currentImageIndex + 1);
      }
      return false;
    });
    return this.$lightbox.find('.lb-loader, .lb-close').on('click', function() {
      _this.end();
      return false;
    });
  };

  Lightbox.prototype.start = function($link) {
    var $window, a, dataLightboxValue, i, imageNumber, left, top, _i, _j, _len, _len1, _ref, _ref1;
    $(window).on("resize", this.sizeOverlay);
    $('select, object, embed').css({
      visibility: "hidden"
    });
    this.$overlay.width($(document).width()).height($(document).height()).fadeIn(this.options.fadeDuration);
    this.album = [];
    imageNumber = 0;
    dataLightboxValue = $link.attr('data-lightbox');

    _ref = $($link.prop("tagName") + '[data-lightbox="' + dataLightboxValue + '"]');
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      a = _ref[i];
      this.album.push({
        link: $(a).attr('href'),
        title: $(a).attr('title')
      });
      if ($(a).attr('href') === $link.attr('href')) {
        imageNumber = i;
      }
    }

    $window = $(window);
    top = $window.scrollTop() + 40;
    left = $window.scrollLeft();
    this.$lightbox.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);
    this.changeImage(imageNumber);
  };

  Lightbox.prototype.changeImage = function(imageNumber) {
    var $image, preloader,
      _this = this;
    this.disableKeyboardNav();
    $image = this.$lightbox.find('.lb-image');
    this.sizeOverlay();
    this.$overlay.fadeIn(this.options.fadeDuration);
    this.$lightbox.find('.lb-loader').fadeIn('slow');
    this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();
    preloader = new Image();
    preloader.onload = function() {
      var $preloader, imageHeight, imageWidth, maxImageHeight, maxImageWidth, windowHeight, windowWidth;
      $image.attr('src', _this.album[imageNumber].link);
      $preloader = $(preloader);
      $image.width(preloader.width);
      $image.height(preloader.height);
      if (_this.options.fitImagesInViewport) {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        maxImageWidth = windowWidth - _this.containerLeftPadding - _this.containerRightPadding - 20;
        maxImageHeight = windowHeight - _this.containerTopPadding - _this.containerBottomPadding - 110;
        if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
          if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
            imageWidth = maxImageWidth;
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          } else {
            imageHeight = maxImageHeight;
            imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          }
        }
      }
      return _this.sizeContainer($image.width(), $image.height());
    };
    preloader.src = this.album[imageNumber].link;
    this.currentImageIndex = imageNumber;
  };

  Lightbox.prototype.sizeOverlay = function() {
    return $('#lightboxOverlay').width($(document).width()).height($(document).height());
  };

  Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
    var newHeight, newWidth, oldHeight, oldWidth,
      _this = this;
    oldWidth = this.$outerContainer.outerWidth();
    oldHeight = this.$outerContainer.outerHeight();
    newWidth = imageWidth + this.containerLeftPadding + this.containerRightPadding;
    newHeight = imageHeight + this.containerTopPadding + this.containerBottomPadding;

    var callback = function(){
      _this.$lightbox.find('.lb-dataContainer').width(newWidth);
      _this.showImage();
    };

    if(oldWidth != newWidth || oldHeight != newHeight)
    {
      this.$outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, this.options.resizeDuration, 'swing', callback);
    }
    else
    {
      callback();
    }
  };

  Lightbox.prototype.showImage = function() {
    this.$lightbox.find('.lb-loader').stop();
    this.$lightbox.find('.lb-loader').hide();
    this.$lightbox.find('.lb-image').fadeIn('slow');
    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  Lightbox.prototype.updateNav = function() {
    this.$lightbox.find('.lb-nav').show();
    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        this.$lightbox.find('.lb-prev, .lb-next').show();
      } else {
        if (this.currentImageIndex > 0) {
          this.$lightbox.find('.lb-prev').show();
        }
        if (this.currentImageIndex < this.album.length - 1) {
          this.$lightbox.find('.lb-next').show();
        }
      }
    }
  };

  Lightbox.prototype.updateDetails = function() {
    var _this = this;

    this.$lightbox.find('.lb-caption').html(this.options.getDetailsCaption(this.album[this.currentImageIndex].title, this.currentImageIndex)).fadeIn('fast');

    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      this.$lightbox.find('.lb-number').text(this.options.getDetailsNumber(this.currentImageIndex + 1, this.album.length)).fadeIn('fast');
    } else {
      this.$lightbox.find('.lb-number').hide();
    }
    this.$lightbox.find('.lb-dataContainer').fadeIn(this.resizeDuration, function() {
      return _this.sizeOverlay();
    });
  };

  Lightbox.prototype.preloadNeighboringImages = function() {
    var preloadNext, preloadPrev;
    if (this.album.length > this.currentImageIndex + 1) {
      preloadNext = new Image();
      preloadNext.src = this.album[this.currentImageIndex + 1].link;
    }
    if (this.currentImageIndex > 0) {
      preloadPrev = new Image();
      preloadPrev.src = this.album[this.currentImageIndex - 1].link;
    }
  };

  Lightbox.prototype.enableKeyboardNav = function() {
    $(document).on('keyup', $.proxy(this.keyboardAction, this));
  };

  Lightbox.prototype.disableKeyboardNav = function() {
    $(document).off('keyup');
  };

  Lightbox.prototype.keyboardAction = function(event) {
    var KEYCODE_ESC, KEYCODE_LEFTARROW, KEYCODE_RIGHTARROW, key, keycode;
    KEYCODE_ESC = 27;
    KEYCODE_LEFTARROW = 37;
    KEYCODE_RIGHTARROW = 39;
    keycode = event.keyCode;
    key = String.fromCharCode(keycode).toLowerCase();
    if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
      this.end();
    } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this.changeImage(this.currentImageIndex - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this.changeImage(this.currentImageIndex + 1);
      }
    }
  };

  Lightbox.prototype.end = function() {
    this.disableKeyboardNav();
    $(window).off("resize", this.sizeOverlay);
    this.$lightbox.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);
    return $('select, object, embed').css({
      visibility: "visible"
    });
  };

  return Lightbox;

})();