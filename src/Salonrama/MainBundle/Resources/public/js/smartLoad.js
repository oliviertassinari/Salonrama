var SmartLoad = function(dom){
	var self = this;

	this.dom = dom;

	$(window).bind('popstate', function(event){
		if(self.cache[window.location.href])
		{
			self.dom.html(self.cache[window.location.href]);
			self.init();
		}
		else
		{
			self.load(window.location.href);
		}
	});

	this.cache[window.location.href] = dom.html();
};

SmartLoad.prototype = {

cache: {},

click: function(a, event)
{
	event.preventDefault();
	this.load(a.href);
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
			self.dom.html(response);
			self.cache[window.location.href] = response;
		},
		error: function(rs, e) {
			console.log(rs.responseText);
		}
	});
}

};