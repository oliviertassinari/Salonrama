var History = {

CallBackOb: function(){},
HashAct: '',

StartObserve: function(CallBack)
{
	this.CallBackOb = CallBack;
	this.HashAct = this.getHash();

	window.setInterval(function()
	{
		var Hash = History.getHash();

		if(Hash != History.HashAct)
		{
			History.HashAct = Hash;
			History.CallBackOb(Hash);
		}
	}, 500);
},

setHash: function(Hash)
{
	this.HashAct = Hash;
	window.location.hash = '#'+Hash;
},

getHash: function()
{
	var href = document.location.href, i = href.indexOf('#');
	return i >= 0 ? href.substr(i + 1) : '';
}

};