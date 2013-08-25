var Slider = function(obj, width, timeWait)
{
	var self = this;

	this.width = width;
	this.timeWait = timeWait;
	this.sliderList = Ot.getElementsByClassName('SliderList', 'div', obj)[0];
	this.sliderPaddlLeft = Ot.getElementsByClassName('SliderPaddleLeft', 'div', obj)[0];
	this.sliderPaddlRight = Ot.getElementsByClassName('SliderPaddleRight', 'div', obj)[0];
	this.sliderDotList = Ot.getElementsByClassName('SliderDot', 'div', obj)[0].getElementsByTagName('li');

	this.sliderList.style.width = this.width*this.sliderDotList.length + 'px';

	Ot.addEvent(this.sliderPaddlLeft, 'click', function(){ self.setPrevious(); return false; });
	Ot.addEvent(this.sliderPaddlRight, 'click', function(){ self.setNext(); return false; });

	for(var i = 0; i < this.sliderDotList.length; i++)
	{
		var a = this.sliderDotList[i].firstChild;

		(function(z){
			Ot.addEvent(a, 'click', function(){ self.setSlide(z); return false; });
		})(i);
	}

	this.Timer = window.setInterval(function(){ self.setNext(); }, this.timeWait);
	Ot.addEvent(obj, 'mouseenter', function(){ window.clearInterval(self.Timer); });
	Ot.addEvent(obj, 'mouseleave', function(){
		window.clearInterval(self.Timer);
		self.Timer = window.setInterval(function(){ self.setNext(); }, self.timeWait);
	});
};

Ot.Extend(Slider,{

slideCurrent: 0,

setNext: function()
{
	var index = this.slideCurrent + 1;
	index = (0 > index) ? this.sliderDotList.length - 1 : index;
	index = (this.sliderDotList.length - 1 < index) ? 0 : index;

	this.setSlide(index);
},

setPrevious: function()
{
	var index = this.slideCurrent - 1;
	index = (0 > index) ? this.sliderDotList.length - 1 : index;
	index = (this.sliderDotList.length - 1 < index) ? 0 : index;

	this.setSlide(index);
},

setSlide: function(index)
{
	this.slideCurrent = index;

	for(var i = 0; i < this.sliderDotList.length; i++)
	{
		if(i == index){
			this.sliderDotList[i].firstChild.className = 'select';
		}
		else{
			this.sliderDotList[i].firstChild.className = '';
		}
	}

	this.sliderList.style.left = -index*this.width+'px';
}

});