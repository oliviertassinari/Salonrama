var Carousel = {

PageList: {},
PageSave: {},
PageAct: '',
Busy: false,

Initi: function()
{
	var pageGET = Ot.getGETFromUrl(document.location.href, 'page');
	var Hash = History.getHash();
	var pageHash = Ot.getGETFromUrl(Hash, 'page');

	this.PageAct = pageGET;

	if(Hash != '' && pageHash != '')
	{
		if(pageGET != pageHash)
		{
			this.loadPage(pageHash);
		}
		else
		{
			if(Ot.isFonc(this.onPageLoad)){
				this.onPageLoad();
			}
		}
	}
	else
	{
		if(Ot.isFonc(this.onPageLoad)){
			this.onPageLoad();
		}
	}

	History.setHash('?page='+this.PageAct);
	History.StartObserve(function(Hash)
	{
		var pageHash = Ot.getGETFromUrl(Hash, 'page');

		if(Carousel.PageList[pageHash]){
			Carousel.loadPage(pageHash);
		}
		else{
			Carousel.loadPage('generale');
		}
	});

	var OngletList = document.getElementById('CarouselOngletList').getElementsByTagName('a');

	for(var i = 0; i < OngletList.length; i++)
	{
		(function(z){
			OngletList[z].onclick = function()
			{
				var pageGET = Ot.getGETFromUrl(OngletList[z].href, 'page');

				if(pageGET != '')
				{
					Carousel.loadPage(pageGET);
					return false;
				}
				else{
					return true;
				}
			};
		})(i);
	}
},

loadPage: function(Page)
{
	if(Page != this.PageAct && this.Busy === false)
	{
		this.Busy = true;

		var CarouselCon = document.getElementById('CarouselCon');
		var OngletList = document.getElementById('CarouselOngletList').getElementsByTagName('a');

		for(var i = 0; i < OngletList.length; i++)
		{
			var OngletAct = OngletList[i];
			var pageGET = Ot.getGETFromUrl(OngletAct.href, 'page');

			this.removeImg(OngletAct);

			if(pageGET == Page)
			{
				OngletAct.firstChild.innerHTML += '<img src="image/icone/load2.gif"/>';
				OngletAct.style.cursor = 'progress';
			}
		}

		document.body.style.cursor = 'progress';

		Ot.stopFx(CarouselCon);
		new Fx(CarouselCon, { From: 1, To: 0, Mode: 'opacity', CallBack: function()
		{
			Carousel.getPageHTML(Page, function(HTML)
			{
				Carousel.PageAct = Page;
				Carousel.setTitle(Carousel.PageList[Page]);
				CarouselCon.innerHTML = HTML;

				History.setHash('?page='+Page);

				for(var i = 0; i < OngletList.length; i++)
				{
					var OngletAct = OngletList[i];
					var pageGET = Ot.getGETFromUrl(OngletAct.href, 'page');

					Carousel.removeImg(OngletAct);
					OngletAct.style.cursor = '';

					if(pageGET == Page){
						OngletAct.parentNode.className = 'select';
					}
					else{
						OngletAct.parentNode.className = '';
					}
				}

				document.body.style.cursor = '';

				if(Ot.isFonc(Carousel.onPageLoad)){
					Carousel.onPageLoad();
				}

				Ot.stopFx(CarouselCon);
				new Fx(CarouselCon, { From: 0, To: 1, Mode: 'opacity', CallBack: function(){ Carousel.Busy = false; } });
			});
		} });
	}
},

getPageHTML: function(Page, CallBack)
{
	if(this.PageSave[Page])
	{
		CallBack(this.PageSave[Page]);
	}
	else
	{
		this.loadPageHTML(Page, function(HTML)
		{
			Carousel.PageSave[Page] = HTML;
			CallBack(HTML);
		});
	}
},

setTitle: function(Nom)
{
	document.title = Nom;
},

onPageLoad: function(){},

loadPageHTML: function(){},

removeImg: function(Onglet)
{
	if(Onglet.firstChild.lastChild.nodeName.toLowerCase() == 'img')
	{
		Onglet.firstChild.removeChild(Onglet.firstChild.lastChild);
	}
}

};