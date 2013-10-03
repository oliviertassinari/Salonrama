var Lightbox = (function()
{
	function Lightbox(options)
	{
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
			},
			parent: $('body')
		};

		this.options = $.extend(optionsDefault, options);
		this.album = [];
		this.currentImageIndex = void 0;

		var _this = this;
		this.options.parent.find('a[data-lightbox]').click(function(e) {
			_this.start($(e.currentTarget));
			return false;
		});

		this.build();
	}

	Lightbox.prototype.build = function()
	{
		var _this = this;
		$("<div id='lightbox-overlay' class='lightbox-overlay'></div><div id='lightbox' class='lightbox'><div class='lightbox-outerContainer'>"+
			"<div class='lightbox-container'>"+
			"<div class='lightbox-prev' title='Précédent'></div>"+
			"<div class='lightbox-next' title='Suivant'></div>"+
			"<div class='lightbox-loader'><i class='icon-spinner icon-spin'></i></div></div></div><div class='lightbox-dataContainer'><div class='lightbox-data'>"+
			"<div class='lightbox-details'><span class='lightbox-caption'></span><span class='lightbox-number'></span></div>"+
			"<a class='lightbox-close' title='Fermer'></a></div></div></div>").appendTo($('body'));
		this.$lightbox = $('#lightbox');
		this.$overlay = $('#lightbox-overlay');
		this.$outerContainer = this.$lightbox.find('.lightbox-outerContainer');
		this.$container = this.$lightbox.find('.lightbox-container');
		this.containerPadding = parseInt(this.$container.css('padding-top'), 10);
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
		this.$outerContainer.click(function(event){
			var over = _this.getOver(event);

			if(over == 'prev')
			{
				if (_this.currentImageIndex === 0) {
					_this.changeImage(_this.album.length - 1);
				} else {
					_this.changeImage(_this.currentImageIndex - 1);
				}
			}
			else if(over == 'next')
			{
				if (_this.currentImageIndex === _this.album.length - 1) {
					_this.changeImage(0);
				} else {
					_this.changeImage(_this.currentImageIndex + 1);
				}
			}
		});

		var lightboxNext = this.$lightbox.find('.lightbox-next');
		var lightboxPrev = this.$lightbox.find('.lightbox-prev');

		this.$outerContainer.mousemove(function(event){
			var over = _this.getOver(event);

			if(over == 'prev')
			{
				_this.$outerContainer.css('cursor', 'pointer');
				lightboxPrev.addClass('show');
			}
			else if(over == 'next')
			{
				_this.$outerContainer.css('cursor', 'pointer');
				lightboxNext.addClass('show');
			}
			else
			{
				_this.$outerContainer.css('cursor', 'default');
				lightboxPrev.removeClass('show');
				lightboxNext.removeClass('show');
			}
		});

		this.$outerContainer.mouseleave(function(){ 
			lightboxPrev.removeClass('show');
			lightboxNext.removeClass('show');
		});

		this.$lightbox.find('.lightbox-loader, .lightbox-close').on('click', function() {
			_this.end();
			return false;
		});
	};

	Lightbox.prototype.getOver = function(event)
	{
		var offset = this.$outerContainer.offset();

		if(offset.left < event.pageX && event.pageX < offset.left + 200)
		{
			return 'prev';
		}
		else if(offset.left + this.$outerContainer.width() - 200 < event.pageX && event.pageX < offset.left + this.$outerContainer.width())
		{
			return 'next';
		}
		else{
			return '';
		}
	};

	Lightbox.prototype.start = function($link)
	{
		var $window, a, dataLightboxValue, i, imageNumber, left, top, _i, _j, _len, _len1, _ref, _ref1;
		$('select, object, embed').css({
			visibility: "hidden"
		});
		this.$overlay.fadeIn(this.options.fadeDuration);
		this.album = [];
		imageNumber = 0;
		dataLightboxValue = $link.attr('data-lightbox');

		_ref = this.options.parent.find($link.prop("tagName") + '[data-lightbox="' + dataLightboxValue + '"]');
		for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i)
		{
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

		if(dataLightboxValue == 'iframe')
		{
			this.changeIframe(0);
		}
		else
		{
			this.changeImage(imageNumber);
		}
	};

	Lightbox.prototype.changeIframe = function(imageNumber)
	{
		var iframe = $('<iframe class="lightbox-image" src="" frameborder="0" allowfullscreen=""></iframe>');
		iframe.attr('src', this.album[imageNumber].link);
		iframe.width(640);
		iframe.height(440);
		iframe.hide();

		this.$lightbox.find('.lightbox-nav, .lightbox-prev, .lightbox-next, .lightbox-dataContainer, .lightbox-numbers, .lightbox-caption').hide();

		this.$container.append(iframe);
		this.sizeContainer(640, 440);

		this.currentImageIndex = 0;
	};

	Lightbox.prototype.changeImage = function(imageNumber)
	{
		var $image, preloader,
			_this = this;
		this.disableKeyboardNav();
		$image = $('<img class="lightbox-image" src=/>');
		this.$container.append($image);
		$image.hide();

		if(this.$lightbox.find('.lightbox-image').length > 1){
			this.$lightbox.find('.lightbox-image').last().prev().fadeOut(600, function(){ $(this).remove(); });
		}

		this.$overlay.fadeIn(this.options.fadeDuration);
		this.$lightbox.find('.lightbox-loader').fadeIn('slow');
		this.$lightbox.find('.lightbox-nav, .lightbox-prev, .lightbox-next, .lightbox-dataContainer, .lightbox-numbers, .lightbox-caption').hide();
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
				maxImageWidth = windowWidth - _this.containerPadding*2 - 20;
				maxImageHeight = windowHeight - _this.containerPadding*2 - 110;
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
		this.currentImageIndex = imageNumber;
		preloader.src = this.album[imageNumber].link;
	};

	Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight)
	{
		var newHeight, newWidth, oldHeight, oldWidth,
			_this = this;
		oldWidth = this.$outerContainer.outerWidth();
		oldHeight = this.$outerContainer.outerHeight();
		newWidth = imageWidth + this.containerPadding*2;
		newHeight = imageHeight + this.containerPadding*2;
		var callback = function(){
			_this.$lightbox.find('.lightbox-dataContainer').width(newWidth);
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

	Lightbox.prototype.showImage = function()
	{
		this.$lightbox.find('.lightbox-loader').stop();
		this.$lightbox.find('.lightbox-loader').hide();
		this.$lightbox.find('.lightbox-image').last().fadeIn(300);
		this.updateNav();
		this.updateDetails();
		this.preloadNeighboringImages();
		this.enableKeyboardNav();
	};

	Lightbox.prototype.updateNav = function()
	{
		this.$lightbox.find('.lightbox-nav').show();
		if (this.album.length > 1) {
			if (this.options.wrapAround) {
				this.$lightbox.find('.lightbox-prev, .lightbox-next').show();
			} else {
				if (this.currentImageIndex > 0) {
					this.$lightbox.find('.lightbox-prev').show();
				}
				if (this.currentImageIndex < this.album.length - 1) {
					this.$lightbox.find('.lightbox-next').show();
				}
			}
		}
	};

	Lightbox.prototype.updateDetails = function()
	{
		var _this = this;

		this.$lightbox.find('.lightbox-caption').html(this.options.getDetailsCaption(this.album[this.currentImageIndex].title, this.currentImageIndex)).fadeIn('fast');

		if (this.album.length > 1 && this.options.showImageNumberLabel) {
			this.$lightbox.find('.lightbox-number').text(this.options.getDetailsNumber(this.currentImageIndex + 1, this.album.length)).fadeIn('fast');
		} else {
			this.$lightbox.find('.lightbox-number').hide();
		}
		this.$lightbox.find('.lightbox-dataContainer').fadeIn(this.resizeDuration);
	};

	Lightbox.prototype.preloadNeighboringImages = function()
	{
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

	Lightbox.prototype.enableKeyboardNav = function()
	{
		$(document).on('keyup', $.proxy(this.keyboardAction, this));
	};

	Lightbox.prototype.disableKeyboardNav = function()
	{
		$(document).off('keyup');
	};

	Lightbox.prototype.keyboardAction = function(event)
	{
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

	Lightbox.prototype.end = function()
	{
		var self = this;

		this.disableKeyboardNav();
		this.$lightbox.fadeOut(this.options.fadeDuration, function(){ self.$lightbox.find('.lightbox-image').remove(); });
		this.$overlay.fadeOut(this.options.fadeDuration);
		$('select, object, embed').css({
			visibility: "visible"
		});
	};

	return Lightbox;
})();