var FaqHitsId = {};

function FaqHits(id)
{
	if(!FaqHitsId[id])
	{
		FaqHitsId[id] = 'send';
		Ot.SendAjax('POST', 'faq-hits.php', { id: id }, function(){});
	}

	//pageTracker._trackEvent('Aide', document.title+' ('+id+')', document.title);
}



var FaqLayout = {

OpenAct: '',

Initi: function(Obj)
{
	var QuestionList = Ot.getElementsByClassName('Question', 'div', Obj);

	for(var i = 0; i < QuestionList.length; i++)
	{
		var QuestionAct = QuestionList[i];

		if(i === 0)
		{
			var H = QuestionAct.lastChild.offsetHeight;
			H = (H === 0) ? 18 : H; 

			QuestionAct.lastChild.style.height = H+'px';
			this.OpenAct = QuestionAct;
		}
		else{
			QuestionAct.lastChild.style.height = '0px';
		}

		QuestionAct.onclick = function()
		{
			if(this != FaqLayout.OpenAct)
			{
				FaqHits(this.id);

				FaqLayout.Close(FaqLayout.OpenAct);
				FaqLayout.OpenAct = this;
				FaqLayout.Open(this);
			}
		};

		QuestionAct.firstChild.title = 'Voir la réponse';
	}
},

Open: function(Obj)
{
	var Reponse = Obj.lastChild;

	Reponse.style.height = '';
	var H = Reponse.offsetHeight;
	H = (H === 0) ? 18 : H; 
	Reponse.style.height = '0px';

	new Fx(Reponse, { From: 0, To: H, Mode: 'height' });
},

Close: function(Obj)
{
	var H = Obj.lastChild.offsetHeight;

	new Fx(Obj.lastChild, { From: H, To: 0, Mode: 'height' });
}

};