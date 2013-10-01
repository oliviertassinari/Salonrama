var ThemeSelect = {

selected: null,

set: function(item)
{
	this.selected.removeClass('select');
	this.selected = item;

	this.selected.addClass('select');
	this.selected.find('input').prop('checked', true);

	this.setScroll();
},

setFromLightbox: function(imageNumber, lightbox, submit)
{
	lightbox.end();
	this.set($($('#theme-select .theme-select-item')[imageNumber]));

	if(submit)
	{
		this.submit();
	}
},

setScroll: function(duration)
{
	var duration = (typeof duration == 'number') ? duration : 'fast';
	var scrollTop = $('#theme-select').scrollTop();

	var heightHiddenTop = $('#theme-select').offset().top + 10 - this.selected.offset().top;
	var heightHiddenBottom = this.selected.height() - $('#theme-select').height() - heightHiddenTop + 25;

	if(heightHiddenTop > 0)
	{
		$('#theme-select').animate({  
			scrollTop: $('#theme-select').scrollTop() - heightHiddenTop
		}, duration);
	}
	else if(heightHiddenBottom > 0)
	{
		$('#theme-select').animate({  
			scrollTop: $('#theme-select').scrollTop() + heightHiddenBottom
		}, duration);
	}
},

submit: function()
{
	$('#theme-post').submit();
}

};