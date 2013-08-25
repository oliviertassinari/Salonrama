var DADPreVis;

var PreVis = function(More)
{
	this.CClient = Ot.CClient();
	this.TdList = [];

	this.addElement(More);

	var ListTd = this.Ele.Cadre.getElementsByTagName('td');

	for(var i = 0; i < ListTd.length; i++)
	{
		if(ListTd[i].className == 'PreVisCoin'){
			this.TdList.push(ListTd[i]);
		}
	}
};

Ot.Extend(PreVis, {

DosRelatif: '',
DAD: {},
ImgAct: { Obj: '', WidthMin: '', HeightMin: '', WidthMax: '', HeigthMax: ''},
Timer: '',
ESuitch: false,
TdList: [],
List: [],
Modele: 'White',
Ele: {},
Busy: false,

Initi: function(Obj, Modele)
{
	var List = [];
	var ListA = Obj.getElementsByTagName('a');

	var self = this;

	for(var i = 0; i < ListA.length; i++)
	{
		if(ListA[i].className.indexOf('MPreVis') != -1)
		{
			(function(z){
				ListA[z].onclick = function(){ return self.openStart(ListA[z]); };
			})(i);

			List.push({ Min: ListA[i].firstChild.src, Max: ListA[i].href, Obj: ListA[i]});
		}
	}

	this.List = List;

	if(Modele)
	{
		this.AppliquerClass('backgroundImage', 'url('+this.DosRelatif+'image/previs/'+Modele+'.png)');
		var Cont = this.Ele.Cont;

		if(Modele == 'Black'){
			Cont.style.backgroundColor = '#000';
		}
		else if(Modele == 'Dark'){
			Cont.style.backgroundColor = '#101010';
		}
		else{
			Cont.style.backgroundColor = '#fff';
		}
		this.Modele = Modele;
	}
},

addElement: function(More)
{
	var Table = document.createElement('table');
	var tbody = document.createElement('tbody');
	Table.appendChild(tbody);

	var td1 = this.getTd();
	var td2 = this.getTd();
	var td3 = this.getTd();

	var td20 = this.getTd();
	var td21 = this.getTd();
	var td22 = this.getTd();

	var td10 = this.getTd();
	var td11 = this.getTd();
	var td12 = this.getTd();

	var tr1 = this.getTr();
	tr1.appendChild(td1);
	tr1.appendChild(td2);
	tr1.appendChild(td3);

	var tr2 = this.getTr();
	tr2.appendChild(td20);
	tr2.appendChild(td21);
	tr2.appendChild(td22);

	var tr3 = this.getTr();
	tr3.appendChild(td10);
	tr3.appendChild(td11);
	tr3.appendChild(td12);

	tbody.appendChild(tr1);
	tbody.appendChild(tr2);
	tbody.appendChild(tr3);

	var Html = '<span class="PreVisCredit"></span><img src="about:blank"/>';
	Html += '<div class="PreVisOutil">';
	Html += '<span class="PreVisIconeP" title="Precedant"></span><span class="PreVisIconeS" title="Suivant"></span>'+More;
	Html += '</div>';
	Html += '<div class="PreVisFloat">';
	Html += '<div class="PreVisMove" title="Deplacer"></div><div class="PreVisClose" title="Fermer"></div>';
	Html += '</div>';

	Table.className = 'PreVisCad';
	Table.cellSpacing = '0';
	td1.style.backgroundPosition = 'top left';
	td2.style.backgroundPosition = '0 -40px';
	td3.style.backgroundPosition = 'top right';
	td20.style.backgroundPosition = 'bottom left';
	td22.style.backgroundPosition = 'bottom right';
	td10.style.backgroundPosition = '0 -20px';
	td11.style.backgroundPosition = '0 -60px';
	td12.style.backgroundPosition = '-20px -20px';
	td21.className = 'PreVisCadCon';
	td21.innerHTML = Html;

	this.Ele = { Cadre: Table, Cont: td21, ImgA: td21.getElementsByTagName('img')[0] };

	var self = this;
	var Cl = td21.childNodes;
	var Cl2 = Cl[2].childNodes;
	var Cl3 = Cl[3].childNodes;
	Cl2[0].onclick = function(){ self.Changer('Precedent'); };
	Cl2[1].onclick = function(){ self.Changer('Suivant'); };

	Cl3[0].onmousedown = function(e){ e = e || window.event; self.DADStart(e); };
	Cl3[1].onclick = function(){ self.closeStart(); };

	document.body.appendChild(Table);
},

addLoad: function()
{
	var self = this;

	var div = document.createElement('div');
	div.onclick = function(){ self.openCancel(); };
	div.title = 'Annuler le chargement';
	div.className = 'PreVisLoad';
	div.innerHTML = 'Chargement...';

	document.body.appendChild(div);
	this.Load = div;
},

suprLoad: function()
{
	document.body.removeChild(this.Load);
	this.Load = '';
},

getTd: function()
{
	var td = document.createElement('td');
	td.className = 'PreVisCoin';
	return td;
	
},

getTr: function()
{
	return document.createElement('tr');
},

DADStart: function(event)
{
	var Key = event.which || event.button;

	if(Key != 2 && Key != 3)
	{
		if(event.preventDefault){ event.preventDefault(); }

		var ObjPosition = Ot.getObjPosition(this.Ele.Cadre);
		var MousePosition = Ot.getMousePosition(event);

		this.DAD = {
			dX: MousePosition.x - ObjPosition.x,
			dY: MousePosition.y - ObjPosition.y,
			sX: MousePosition.x,
			sY: MousePosition.y
		};
		DADPreVis = this;
		
		this.Ele.ImgA.style.cursor = 'move';

		Ot.addEvent(document ,'mousemove', this.DADMove);
		Ot.addEvent(document, 'mouseup', this.DADEnd);
	}
},

DADMove: function(event)
{
	if(!event.preventDefault){ event.returnValue = false; }

	var MousePosition = Ot.getMousePosition(event);

	Ot.setLeftTop(DADPreVis.Ele.Cadre, MousePosition.x - DADPreVis.DAD.dX, MousePosition.y - DADPreVis.DAD.dY);
},

DADEnd: function(event)
{
	var MousePosition = Ot.getMousePosition(event);
	
	DADPreVis.Ele.ImgA.style.cursor = 'pointer';
	Ot.stopEvent(document ,'mousemove', DADPreVis.DADMove);
	Ot.stopEvent(document, 'mouseup', DADPreVis.DADEnd);

	if((DADPreVis.DAD.sX + 2 >= MousePosition.x && MousePosition.x >= DADPreVis.DAD.sX - 2) && (DADPreVis.DAD.sY + 2 >= MousePosition.y && MousePosition.y >= DADPreVis.DAD.sY - 2))
	{
		DADPreVis.closeStart();
	}

	DADPreVis.DAD = {};
	DADPreVis = '';
},

openStart: function(Obj) //Obj = Lien
{
	if(this.ImgAct.Obj != '') //image en cours
	{
		//this.closeStart(); //ENTRER
		this.Suitch('Start', Obj);
	}
	else if(this.Busy == false)
	{
		this.Busy = true;

		var self = this;

		this.ImgAct.Obj = Obj;
		this.ImgAct.WidthMin = Obj.firstChild.width;
		this.ImgAct.HeightMin = Obj.firstChild.height;	

		var ObjPosition = Ot.getObjPosition(Obj);

		this.addLoad();
		this.Load.style.display = 'block';
		Ot.setLeftTop(this.Load, ObjPosition.x + (Obj.offsetWidth - this.Load.offsetWidth) / 2, ObjPosition.y + (Obj.offsetHeight - this.Load.offsetHeight) / 2);

		// Chargement End
		var ImgA = this.Ele.ImgA;
		ImgA.onload = function(){ self.openLoad(); };
		ImgA.width = Obj.firstChild.width;
		ImgA.src = this.List[this.getSPreVisList(Obj)-1].Max;
	}

	return false;
},

openCancel: function()
{
	this.suprLoad();
	this.Ele.ImgA.onload = null;
	this.Ele.ImgA.src = 'about:blank';

	this.ImgAct.Obj = '';
	this.Busy = false;
},

openLoad: function()
{
	var PageScroll = Ot.getPageScroll();
	var BrowserSize = Ot.getBrowserSize();
	var ObjPosition = Ot.getObjPosition(this.ImgAct.Obj.firstChild);

	var oImg = new Image();
	oImg.src = this.Ele.ImgA.src;
	var SizeMaxMin = this.getSizeMaxMin(oImg.width, oImg.height, BrowserSize.x-40, BrowserSize.y-100, 300, 300);
	this.ImgAct.WidthMax = SizeMaxMin.w;
	this.ImgAct.HeigthMax = SizeMaxMin.h;


	var ToTop = ObjPosition.y-(this.ImgAct.HeigthMax / 2)+(this.ImgAct.HeightMin / 2);
	var MaxTop = BrowserSize.y - this.ImgAct.HeigthMax + PageScroll.y - 120;
	ToTop = (ToTop > MaxTop) ? MaxTop : ToTop;
	ToTop = (ToTop < PageScroll.y + 20) ? PageScroll.y + 20: ToTop;

	var ToLeft = ObjPosition.x-(this.ImgAct.WidthMax / 2)+(this.ImgAct.WidthMin / 2);
	var MaxLeft = BrowserSize.x + PageScroll.x - this.ImgAct.WidthMax - 20;
	ToLeft = (ToLeft > MaxLeft) ? MaxLeft : ToLeft;
	ToLeft = (ToLeft < PageScroll.x + 20) ? PageScroll.x + 20: ToLeft;


	this.suprLoad();
	Ot.setLeftTop(this.Ele.Cadre, ObjPosition.x, ObjPosition.y);
	this.Ele.Cadre.style.display = 'block';
	this.ImgAct.Obj.style.visibility = 'hidden';

	var self = this;
	this.VEffect = {
		'fW': this.ImgAct.WidthMin,
		'fL': ObjPosition.x,
		'fT': ObjPosition.y,
		'tW': this.ImgAct.WidthMax,
		'tL': ToLeft,
		'tT': ToTop,
		'time': Ot.getTime(),
		'End': function(){ self.openFin(); }
	};
	this.Timer = window.setInterval(function(){ self.Effect(); }, 50);
},

Effect: function()
{
	var Cadre = this.Ele.Cadre;
	var ImgA = this.Ele.ImgA;
	var time = Ot.getTime();

	if(time < this.VEffect.time + 250)
	{
		var p = ((time - this.VEffect.time) / 250);

		var delta = -(Math.cos(Math.PI * p) - 1)/2;

		ImgA.width = this.Calcu(this.VEffect.fW, this.VEffect.tW, delta);
		Cadre.style.left = this.Calcu(this.VEffect.fL, this.VEffect.tL, delta)+'px';
		Cadre.style.top = this.Calcu(this.VEffect.fT, this.VEffect.tT, delta)+'px';
	}
	else //End
	{
		ImgA.width = this.Calcu(this.VEffect.fW, this.VEffect.tW, 1);
		Cadre.style.left = this.Calcu(this.VEffect.fL, this.VEffect.tL, 1)+'px';
		Cadre.style.top = this.Calcu(this.VEffect.fT, this.VEffect.tT, 1)+'px';

		window.clearInterval(this.Timer);

		var End = this.VEffect.End;
		this.VEffect = {};

		End();
	}
},

Calcu: function(From, To, Delta)
{
	return (To - From) * Delta + From;
},

openFin: function()
{
	if(this.CClient[0] == 'IExploreur'){
		this.AppliquerClass('display', 'block');
	}
	else{
		this.AppliquerClass('display', 'table-cell');
	}

	var Cadre = this.Ele.Cadre;
	var ImgA = this.Ele.ImgA;
	var Cl = this.Ele.Cont.childNodes;
	var Outil = Cl[2];
	var Credits = Cl[0];
	var PosAct = this.getSPreVisList(this.ImgAct.Obj);
	var PosMax = this.List.length;
	
	Ot.setLeftTop(Cadre, Cadre.offsetLeft - 20, Cadre.offsetTop - 20);

	Credits.innerHTML = 'Images ' +PosAct+ '/' + PosMax;

	//precedent , suivant
	var Span = Outil.getElementsByTagName('span');
	if(PosAct > 1){
		Span[0].style.display = 'inline';
	}
	else{
		Span[0].style.display = 'none';
	}
	
	if(PosAct < PosMax){
		Span[1].style.display = 'inline';
	}
	else{
		Span[1].style.display = 'none';
	}

	Credits.style.display = 'block';
	Outil.style.display = 'block';
	Cl[3].style.display = 'block';

	var self = this;

	ImgA.onmousedown = function(e){ e = e || window.event; self.DADStart(e); };
	ImgA.style.cursor = 'pointer';

	this.KeyPress = function(event)
	{
		switch(event.keyCode)
		{
			case Ot.Key.Space:
			case Ot.Key.PageDown:
			case Ot.Key.Right:
			case Ot.Key.Down:
			case Ot.Key.Enter:
				Ot.cancelEvent(event);
				self.Changer('Suivant');
				break;
			case Ot.Key.BackSpace:
			case Ot.Key.PageUp:
			case Ot.Key.Left:
			case Ot.Key.Up:
				Ot.cancelEvent(event);
				self.Changer('Precedent');
				break;
			case Ot.Key.Escape:
				Ot.cancelEvent(event);
				self.closeStart();
		}
	};

	this.onMouseUp = function(event)
	{
		var target = event.target || event.srcElement;

		if(!Ot.isAChildOf(self.Ele.Cadre, target)) //SI on est pas sur le Cadre
		{
			self.closeStart();
		}
	};

	Ot.addEvent(document, 'keydown', this.KeyPress);
	Ot.addEvent(document, 'mouseup', this.onMouseUp);
	
	this.Busy = false;
},

closeStart: function()
{
	if(this.ImgAct.Obj != '' && this.Busy == false)
	{
		this.Busy = true;

		Ot.stopEvent(document, 'keydown', this.KeyPress);
		Ot.stopEvent(document, 'mouseup', this.onMouseUp);

		var Cadre = this.Ele.Cadre;
		var ImgA = this.Ele.ImgA;
		var Cl = this.Ele.Cont.childNodes;

		Cl[0].style.display = 'none';
		Cl[2].style.display = 'none';
		Cl[3].style.display = 'none';

		this.AppliquerClass('display', 'none');

		Ot.setLeftTop(Cadre, Cadre.offsetLeft + 20, Cadre.offsetTop + 20);

		ImgA.onmousedown = '';

		var ObjPosition = Ot.getObjPosition(this.ImgAct.Obj.firstChild);

		var self = this;
		this.VEffect = {
			'fW': ImgA.width,
			'fL': Cadre.offsetLeft,
			'fT': Cadre.offsetTop,
			'tW': this.ImgAct.WidthMin,
			'tL': ObjPosition.x,
			'tT': ObjPosition.y,
			'time': Ot.getTime(),
			'End': function(){ self.closeFin(); }
		};
		this.Timer = window.setInterval(function(){ self.Effect(); }, 50);
	}
},

closeFin: function()
{
	this.ImgAct.Obj.style.visibility = 'visible';
	this.ImgAct.Obj.firstChild.style.cursor = 'pointer';

	// masquage du Cadre
	this.Ele.Cadre.style.display = 'none';
	this.Ele.ImgA.src = 'about:blank';

	this.ImgAct.Obj = '';

	this.Busy = false;

	if(this.ESuitch != false){
		this.Suitch('Clear');
	}
},

Suitch: function(Process, Obj)
{
	if(Process == 'Start'){
		this.ESuitch = Obj;
		this.closeStart();
	}
	else if(Process == 'Clear'){
		this.openStart(this.ESuitch);
		this.ESuitch = false;
	}
},

Changer: function(Mode)
{
	var PosAct = this.getSPreVisList(this.ImgAct.Obj);

	if(Mode == 'Precedent'){
		if(this.List[PosAct-2]){
			this.Suitch('Start', this.List[PosAct-2].Obj);
		}
		else{
			this.closeStart();
		}
	}
	else{
		if(this.List[PosAct]){
			this.Suitch('Start', this.List[PosAct].Obj);
		}
		else{
			this.closeStart();
		}
	}
},

AppliquerClass: function(Propr, Attribue)
{
	for(var i = 0; i < this.TdList.length; i++)
	{
		eval('this.TdList[i].style.' +Propr+ ' = Attribue');
	}
},

getSPreVisList: function(Obj)
{
	var R = 0;

	for(var i = 0; i < this.List.length ; i++)
	{
		R += 1;
		if(this.List[i].Obj == Obj){ break; }
	}

	return R;
},

getSizeMaxMin: function(ActW, ActH, MaxW, MaxH, MinW, MinH)
{
	if(ActW > MaxW || ActH > MaxH)
	{
		MaxW = (MaxW < MinW) ? MinW : MaxW;
		MaxH = (MaxH < MinH) ? MinH : MaxH;

		var testH = Math.round((MaxW / ActW) * ActH);
		var testW = Math.round((MaxH / ActH) * ActW);

		if(testH > MaxH){ 
			MaxW = testW; 
		}
		else{
			MaxH = testH; 
		}

		return { w: MaxW, h: MaxH };
	}
	else
	{
		return { w: ActW, h: ActH };
	}
}

});