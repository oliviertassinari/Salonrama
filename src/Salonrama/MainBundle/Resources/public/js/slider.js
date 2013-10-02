var Slider = function(sliderId, timeToWait)
{
	var self = this;

	var slider = $('#'+sliderId);

	this.width = slider.width();
	this.timeToWait = timeToWait;
	this.slider = slider;
	this.sliderList = slider.children('.slider-list');
	this.sliderDotLi = slider.find('.slider-dot li');

	this.sliderList.css('width', this.width*this.sliderDotLi.length);

	this.sliderList.children('.slide').each(function(){
		$(this).css('width', self.width);
	});

	var sliderPaddleLeft = slider.find('.slider-paddle-left');
	var sliderPaddleRight = slider.find('.slider-paddle-right');

	this.sliderDotLi.children('a').each(function(index){
		$(this).click(function(event){
			event.preventDefault();
			self.setSlide(index);
		});
	});

	this.setTimer();

	slider.mouseenter(function(){ window.clearInterval(self.Timer); });
	slider.mouseleave(function(){ 
		sliderPaddleLeft.removeClass('show');
		sliderPaddleRight.removeClass('show');
		window.clearInterval(self.Timer);
		self.setTimer();
	});

	slider.mousemove(function(event){ 
		var position = self.getPosition(event);

		if(position == 'left')
		{
			sliderPaddleLeft.addClass('show');
		}
		else if(position == 'right')
		{
			sliderPaddleRight.addClass('show');
		}
		else
		{
			sliderPaddleLeft.removeClass('show');
			sliderPaddleRight.removeClass('show');
		}
	});

	slider.click(function(event){
		var position = self.getPosition(event);

		if(position == 'left')
		{
			self.setPrevious();
		}
		else if(position == 'right')
		{
			self.setNext();
		}	
	});

	$(document).on('keyup', $.proxy(this.onKeyup, this));
};

Slider.prototype = {

slideCurrent: 0,

getPosition: function(event)
{
	var offset = this.slider.offset();

	if(offset.left < event.pageX && event.pageX < offset.left + 200)
	{
		return 'left';
	}
	else if(offset.left + this.slider.width() - 200 < event.pageX && event.pageX < offset.left + this.slider.width())
	{
		return 'right';
	}
	else{
		return '';
	}
},

setTimer: function(){
	var self = this;

	this.Timer = window.setInterval(function(){ self.setNext(); }, this.timeToWait);
},

setNext: function()
{
	var index = this.slideCurrent + 1;
	index = (0 > index) ? this.sliderDotLi.length - 1 : index;
	index = (this.sliderDotLi.length - 1 < index) ? 0 : index;

	this.setSlide(index);
},

setPrevious: function()
{
	var index = this.slideCurrent - 1;
	index = (0 > index) ? this.sliderDotLi.length - 1 : index;
	index = (this.sliderDotLi.length - 1 < index) ? 0 : index;

	this.setSlide(index);
},

setSlide: function(index)
{
	this.slideCurrent = index;

	for(var i = 0; i < this.sliderDotLi.length; i++)
	{
		if(i == index){
			this.sliderDotLi[i].firstChild.className = 'select';
		}
		else{
			this.sliderDotLi[i].firstChild.className = '';
		}
	}

	this.sliderList.css('left', -index*this.width);
},

onKeyup: function(event)
{
	var KEYCODE_LEFTARROW = 37;
    var KEYCODE_RIGHTARROW = 39;
    var keycode = event.keyCode;

    if(keycode == KEYCODE_LEFTARROW)
    {
    	this.setPrevious();
    }
    else if(keycode == KEYCODE_RIGHTARROW)
    {
    	this.setNext();
    }
}

};