var Slider = function(sliderId, timeToWait)
{
	var self = this;

	var slider = $('#'+sliderId);

	this.width = slider.width();
	this.timeToWait = timeToWait;
	this.sliderList = slider.children('.slider-list');
	this.sliderDotLi = slider.find('.slider-dot li');
	this.sliderDotLiA = this.sliderDotLi.children('a');

	this.sliderList.css('width', this.width*this.sliderDotLi.length);

	this.sliderList.children('.slide').each(function(){
		$(this).css('width', self.width);
	});

	slider.find('.slider-paddle-left').click(function(){ self.setPrevious(); });
	slider.find('.slider-paddle-right').click(function(){ self.setNext(); });

	this.sliderDotLiA.each(function(index){
		$(this).click(function(event){
			event.preventDefault();
			self.setSlide(index);
		});
	});

	this.setTimer();

	slider.mouseenter(function(){ window.clearInterval(self.Timer); });
	slider.mouseleave(function(){ 
		window.clearInterval(self.Timer);
		self.setTimer();
	});
};

Slider.prototype = {

slideCurrent: 0,

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
}

};