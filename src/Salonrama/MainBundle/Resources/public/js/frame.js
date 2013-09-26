var FrameBig = function(removeOnClose)
{
	this.frameBigBackground = $('<div class="cadre-big-background"></div>');
	this.frameBigBackground.hide();
	this.removeOnClose = removeOnClose ? removeOnClose : false;

	this.frameBigOuter = $('<div class="cadre-big-outer"><div class="cadre-big"></div></div>');
	this.frameBigOuter.hide();

	this.frameBig = this.frameBigOuter.find('.cadre-big');

	$('body').append(this.frameBigBackground);
	$('body').append(this.frameBigOuter);
};

FrameBig.prototype = {

open: function(width, head, body, foot)
{
	var self = this;

	if(head && head != '')
	{
		this.frameBig.append($('<div class="cadre-big-head">'+head+'<span class="cadre-big-close" title="Fermer"><i class="icon-remove"></i></span></div>'));
	}

	if(body )
	{
		this.frameBig.append($('<div class="cadre-big-body">'+body+'</div>'));
	}

	if(foot)
	{
		this.frameBig.append($('<div class="cadre-big-foot">'+foot+'<div class="clear"></div></div>'));
	}

	this.frameBig.find('.cadre-big-close').click(function(){ self.close(); });
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
		if(self.removeOnClose)
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



var FrameConfirm = function(message, callback)
{
	var self = this;

	this.callback = callback;
	this.frameBig = new FrameBig(true);

	this.frameBig.open(400, 'Attention', message, '<button type="button" class="button-small button-small-green"><i class="icon-ok"></i>Ok</button>'+
												'<button type="button" class="button-small button-small-red"></i>Annuler</button>');

	var foot = this.frameBig.frameBig.find('.cadre-big-foot');
	foot.find('.button-small-green').click(function(){ self.valide(); });
	foot.find('.button-small-green').focus();
	foot.find('.button-small-red').click(function(){ self.close(); });
};

FrameConfirm.prototype = {

valide: function()
{
	this.close();
	this.callback();
},

close: function()
{
	this.frameBig.close();
}

};