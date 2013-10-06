var Smartload = function(dom, ontrigger, callback){
	var self = this;

	this.dom = dom;
	this.ontrigger = ontrigger;
	this.callback = callback;

	$(window).bind('popstate', function(event){
		if(self.cache[window.location.href])
		{
			self.dom.html(self.cache[window.location.href]);
			self.initLink();
			self.callback();
		}
		else
		{
			self.load(window.location.href);
		}
	});

	this.cache[window.location.href] = dom.html();

	this.initLink();
};

Smartload.prototype = {

cache: {},

initLink: function()
{
	var self = this;

	$('a.smartload').click(function(event)
	{
		if(history.pushState)
		{
			event.preventDefault();
			self.ontrigger(this);
			self.load(this.href);
		}
	});

	$('form.smartload').off('submit').submit(function(event)
	{
		if(history.pushState)
		{
			event.preventDefault();
			self.ontrigger(this);
			self.load(this.action+'?'+$(this).serialize());
		}
	});
},

load: function(url)
{
	var self = this;

	$.ajax({
		type: "GET",
		url: url,
		data: {},
		dataType: "text",
		success: function(response){
    		history.pushState({ path: this.path }, '', url);
			self.cache[window.location.href] = response;
			self.dom.html(response);
			self.initLink();
			self.callback();
		},
		error: function(rs, e) {
			console.log(rs.responseText);
		}
	});
}

};