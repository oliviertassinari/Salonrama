var Screenshot = {

Busy: true,
isIniti: false,

ImgList: [],
ImgAct: '',
Timer: '',

Initi: function(Obj)
{
	var self = this;

	this.ScreenshotFleche = Ot.getElementsByClassName('ScreenshotFleche', 'div', Obj);
	this.ScreenshotImgList = Ot.getElementsByClassName('ScreenshotImgList', 'div', Obj)[0];
	this.ScreenshotPoint = Ot.getElementsByClassName('ScreenshotPoint', 'div', Obj)[0];

	this.ScreenshotFleche[0].firstChild.onclick = function(){ return self.setImgPrev(); };
	this.ScreenshotFleche[1].firstChild.onclick = function(){ return self.setImgNext(); };

	var ImgActAList = this.ScreenshotImgList.getElementsByTagName('div')[0].getElementsByTagName('a');
	this.ImgList[0] = { text: ImgActAList[1].innerHTML, img: ImgActAList[0].firstChild.src, isCharged: true, url: ImgActAList[1].href };
	this.ImgAct = 0;

	Ot.SendAjax('POST', 'site/screenshot.php', { Mode: 'getImgList' }, function(xhr)
	{
		var R = eval('('+xhr.responseText+')');

		if(typeof R == 'object')
		{
			var ImgList = R;

			for(var i = 0; i < ImgList.length; i++)
			{
				var alreadyExist = false;

				for(var j = 0; j < self.ImgList.length; j++)
				{
					if(ImgList[i].text == self.ImgList[j].text){
						alreadyExist = true;
					}
				}

				if(!alreadyExist)
				{
					var div = document.createElement('div');
					div.className = 'ScreenshotImgItem';

					var a1 = document.createElement('a');
					a1.href = ImgList[i].url;
					a1.target = '_blank';
					a1.title = 'Voir ce site';

					var a2 = document.createElement('a');
					a2.href = ImgList[i].url;
					a2.target = '_blank';
					a2.title = 'Voir ce site';
					a2.innerHTML = ImgList[i].text;

					var img = document.createElement('img');
					img.width = '160';
					img.height = '120';

					a1.appendChild(img);

					div.appendChild(a1);
					div.appendChild(a2);

					ImgList[i].isCharged = false;

					self.ScreenshotImgList.appendChild(div);
					self.ImgList.push(ImgList[i]);
				}
			}

			self.ScreenshotImgList.style.width = ((i+1)*170)+'px';
			self.InitiPoint();
			self.selectPoint(0);
		}
		else{
			alert(R);
		}


		self.Timer = window.setInterval(function(){ self.setImgNext(); }, 5000);

		Ot.addEvent(Obj, 'mouseenter', function()
		{
			window.clearInterval(self.Timer);
		});
		Ot.addEvent(Obj, 'mouseleave', function()
		{
			window.clearInterval(self.Timer);
			self.Timer = window.setInterval(function(){ self.setImgNext(); }, 5000);
		});

		self.isIniti = true;
		self.Busy = false;
	});
},

InitiPoint: function()
{
	var self = this;
	this.ScreenshotPoint.innerHTML = '<div class="Clear"></div>';

	for(var i = 0; i < this.ImgList.length; i++)
	{
		var a = document.createElement('a');
		a.href = '';
		a.title = 'selectionner';

		(function(z){
			a.onclick = function(){ self.setImg(z); return false; };
		})(i);

		this.ScreenshotPoint.insertBefore(a, this.ScreenshotPoint.lastChild);
	}

	this.ScreenshotPoint.style.width = (i*16)+'px';
},

selectPoint: function(nbr)
{
	var AList = this.ScreenshotPoint.getElementsByTagName('a');

	for(var i = 0; i < AList.length; i++)
	{
		if(i == nbr){
			AList[i].className = 'select';
		}
		else if(AList[i].className == 'select'){
			AList[i].className = '';
		}
	}
},

setImgNext: function()
{
	this.setImg(this.ImgAct+1);

	if(this.isIniti)
	{
		return false;
	}
},

setImgPrev: function()
{
	this.setImg(this.ImgAct-1);

	if(this.isIniti)
	{
		return false;
	}
},

setImg: function(nbr)
{
	if(this.Busy === false && this.ImgList.length > 1)
	{
		var self = this;
		nbr = (0 > nbr) ? this.ImgList.length-1 : nbr;
		nbr = (this.ImgList.length-1 < nbr) ? 0 : nbr;
		var LeftAct = this.ScreenshotImgList.offsetLeft;
		var LeftNew = nbr * -170;

		this.ImgAct = nbr;
		this.Busy = true;

		if(!this.ImgList[nbr].isCharged)
		{
			this.ImgList[nbr].isCharged = true;
			this.ScreenshotImgList.getElementsByTagName('div')[nbr].getElementsByTagName('a')[0].firstChild.src = this.ImgList[nbr].img;
		}

		new Fx(this.ScreenshotImgList, { From: LeftAct, To: LeftNew, Mode: 'left', duree: 700, CallBack: function(){ self.Busy = false; } });

		this.selectPoint(nbr);
	}
}

};