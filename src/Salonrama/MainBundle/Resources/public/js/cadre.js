var CadreBig = function(removeOnClose)
{
	this.cadreBigBackground = $('<div class="cadre-big-background"></div>');
	this.cadreBigBackground.hide();
	this.removeOnClose = removeOnClose ? removeOnClose : false;

	this.cadreBigOuter = $('<div class="cadre-big-outer"><div class="cadre-big"></div></div>');
	this.cadreBigOuter.hide();

	this.cadreBig = this.cadreBigOuter.find('.cadre-big');

	$('body').append(this.cadreBigBackground);
	$('body').append(this.cadreBigOuter);
};

CadreBig.prototype = {

open: function(width, head, body, foot)
{
	var self = this;

	if(head && head != '')
	{
		this.cadreBig.append($('<div class="cadre-big-head">'+head+'<span class="cadre-big-close" title="Fermer"><i class="icon-remove"></i></span></div>'));
	}

	if(body )
	{
		this.cadreBig.append($('<div class="cadre-big-body">'+body+'</div>'));
	}

	if(foot)
	{
		this.cadreBig.append($('<div class="cadre-big-foot">'+foot+'<div class="clear"></div></div>'));
	}

	this.cadreBig.find('.cadre-big-close').click(function(){ self.close(); });
	this.cadreBig.css('width', width);
	this.cadreBigBackground.fadeIn(400);
	this.cadreBigOuter.fadeIn(400);
	this.cadreBigOuter.css('top', ($(window).height() - this.cadreBig.height()) / 2 + $(window).scrollTop() - 30);

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
	this.cadreBigBackground.fadeOut(400);
	this.cadreBigOuter.fadeOut(400, function(){
		if(self.removeOnClose)
		{
			self.remove();
		}
	});
},

remove: function()
{
	this.cadreBigBackground.remove();
	this.cadreBigOuter.remove();
}

};



var CadreConfirm = function(message, callback)
{
	var self = this;

	this.callback = callback;
	this.cadreBig = new CadreBig(true);

	this.cadreBig.open(400, 'Attention', message, '<button type="button" class="button-small button-small-green"><i class="icon-ok"></i>Ok</button>'+
												'<button type="submit" class="button-small button-small-red"></i>Annuler</button>');

	var foot = this.cadreBig.cadreBig.find('.cadre-big-foot');
	foot.find('.button-small-green').click(function(){ self.valide(); });
	foot.find('.button-small-red').click(function(){ self.close(); });
};

CadreConfirm.prototype = {

valide: function()
{
	this.close();
	this.callback();
},

close: function()
{
	this.cadreBig.close();
}

};