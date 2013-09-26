var FrameBig = function(option)
{
	this.frameBigBackground = $('<div class="frame-big-background"></div>');
	this.frameBigBackground.hide();

	this.option = $.extend({
		removeOnClose: false
	}, option);

	this.frameBigOuter = $('<div class="frame-big-outer"><div class="frame-big"></div></div>');
	this.frameBigOuter.hide();

	this.frameBig = this.frameBigOuter.find('.frame-big');

	$('body').append(this.frameBigBackground);
	$('body').append(this.frameBigOuter);
};

FrameBig.prototype = {

open: function(width, head, body, foot)
{
	var self = this;

	if(head && head != '')
	{
		this.frameBig.append($('<div class="frame-big-head">'+head+'<span class="frame-big-close" title="Fermer"><i class="icon-remove"></i></span></div>'));
	}

	if(body )
	{
		this.frameBig.append($('<div class="frame-big-body">'+body+'</div>'));
	}

	if(foot)
	{
		this.frameBig.append($('<div class="frame-big-foot">'+foot+'<div class="clear"></div></div>'));
	}

	this.frameBig.find('.frame-big-close').click(function(){ self.close(); });
	this.frameBig.css('width', width);
	this.frameBigBackground.fadeIn(400);
	this.frameBigOuter.fadeIn(400);
	this.frameBigOuter.css('top', ($(window).height() - this.frameBig.height()) / 2 + $(window).scrollTop() - 30);

	$(document).on('keyup', $.proxy(this.onKeyup, this));
},

onKeyup: function(event)
{
	var KEYCODE_ESC = 27;
	var keycode = event.keyCode;
	var key = String.fromCharCode(keycode).toLowerCase();

	if(keycode === KEYCODE_ESC || key.match(/x|o|c/))
	{
		this.close();
	}
},

close: function()
{
	var self = this;

	$(document).off('keyup');
	this.frameBigBackground.fadeOut(400);
	this.frameBigOuter.fadeOut(400, function(){
		if(self.option.removeOnClose)
		{
			self.remove();
		}
	});
},

remove: function()
{
	this.frameBigBackground.remove();
	this.frameBigOuter.remove();
}

};



var FrameConfirm = function(message, option)
{
	var self = this;

	this.option = $.extend({
		yes: function(){},
		no: function(){}
	}, option);

	this.frameBig = new FrameBig({ removeOnClose: true });

	this.frameBig.open(400, 'Attention', message, '<button type="button" class="button-small button-small-green"><i class="icon-ok"></i>Ok</button>'+
												'<button type="button" class="button-small button-small-red"></i>Annuler</button>');

	var foot = this.frameBig.frameBig.find('.frame-big-foot');
	foot.find('.button-small-green').click(function(){ self.yes(); });
	foot.find('.button-small-green').focus();
	foot.find('.button-small-red').click(function(){ self.no(); });
};

FrameConfirm.prototype = {

yes: function()
{
	this.close();
	this.option.yes();
},

no: function()
{
	this.close();
	this.option.no();
},

close: function()
{
	this.frameBig.close();
}

};