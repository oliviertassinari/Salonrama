var CadreBig = function()
{
	this.cadreBigBackground = $('<div class="cadre-big-background"></div>');
	this.cadreBigBackground.hide();

	this.cadreBigOuter = $('<div class="cadre-big-outer"><div class="cadre-big"></div></div>');
	this.cadreBigOuter.hide();

	this.cadreBig = this.cadreBigOuter.find('.cadre-big');

	$('body').append(this.cadreBigBackground);
	$('body').append(this.cadreBigOuter);
}

CadreBig.prototype = {

open: function(width, head, body, foot)
{
	if(head && head != '')
	{
		this.cadreBig.append($('<div class="cadre-big-head">'+head+'</div>'));
	}

	if(body )
	{
		this.cadreBig.append($('<div class="cadre-big-body">'+body+'</div>'));
	}

	if(foot)
	{
		this.cadreBig.append($('<div class="cadre-big-foot">'+foot+'<div class="clear"></div></div>'));
	}

	this.cadreBig.css('width', width);
	this.cadreBigBackground.fadeIn(400);
	this.cadreBigOuter.fadeIn(400);
	this.cadreBigOuter.css('top', ($(window).height() - this.cadreBig.height()) / 2 + $(window).scrollTop());

},

close: function()
{

},

remove: function()
{
	this.cadreBigBackground.remove();
	this.cadreBig.remove();
}

};

var CadreConfirm = {

open: function(message, callback)
{
	var cadreBig = new CadreBig();
	cadreBig.open(400, 'Attention', message, '<button type="button" class="button-small button-small-green"><i class="icon-ok"></i>Ok</button>'+
		'<button type="submit" class="button-small button-small-red"></i>Annuler</button>');
}

};