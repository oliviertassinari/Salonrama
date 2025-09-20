var GWys = {

List: {},
Act: {},
SelectAct: null,
ShowAct: { isIniti: false, Etat: 'Over', isSelect: false, Type: '' },
PoliceAct: 'times new roman',
SizeAct: 2,
CouleurAct: '#000010',

isOut: true,

initi: function()
{
	var BoutList = Ot.getElementsByClassName('BOBout', 'div', document.getElementById('BOBout'));
	for(var i = 0; i < BoutList.length; i++)
	{
		BoutList[i].onmouseover = function(){ Ot.addClass(this, 'hover'); };
		BoutList[i].onmouseout = function(){ Ot.removeClass(this, 'hover'); Ot.removeClass(this, 'click'); };
		BoutList[i].onmousedown = function(){ Ot.addClass(this, 'click'); };
		BoutList[i].onmouseup = function(){ Ot.removeClass(this, 'click'); };
	}

	var SelectList = document.getElementById('BOSelect').getElementsByTagName('td');
	for(var i = 0; i < SelectList.length; i++)
	{
		(function(){
			var z = i;

			SelectList[z].onmouseover = function()
			{
				Ot.addClass(this, 'hover');

				if(z == 1 || z == 3){
					Ot.addClass(SelectList[z-1], 'hover');
				}
			};
			SelectList[z].onmouseout = function()
			{
				Ot.removeClass(this, 'hover');

				if(z == 1 || z == 3){
					Ot.removeClass(SelectList[z-1], 'hover');
				}
			};
		})();
	}

	var TailleList = document.getElementById('CadTaille').getElementsByTagName('div');
	for(var i = 0; i < TailleList.length; i += 2)
	{
		(function(z){
			var Var = TailleList[z].firstChild.innerHTML;
			TailleList[z].onclick = function(){ GWys.exec('fontsize', Var); };
			TailleList[z].onmouseover = function(){ GWys.show(Var, 'Taille'); };
		})(i);
	}

	var PoliceList = document.getElementById('CadPolice').getElementsByTagName('div');
	for(var i = 0; i < PoliceList.length; i += 3)
	{
		(function(z){
			var Var = PoliceList[z].lastChild.innerHTML;
			PoliceList[z].onclick = function(){ GWys.exec('fontname', Var); };
			PoliceList[z].onmouseover = function(){ GWys.show(Var, 'Police'); };
		})(i);
	}

	/* Couleur */
	var CouleurInfo = document.getElementById('BOCouleurInfo');
	var CouleurOpen = document.getElementById('BOCouleurOpen');

	CouleurInfo.onmouseover = function(){ Ot.addClass(this, 'hover'); Ot.addClass(CouleurOpen, 'hoverlittle'); };
	CouleurInfo.onmouseout = function(){ Ot.removeClass(this, 'hover'); Ot.removeClass(CouleurOpen, 'hoverlittle'); Ot.removeClass(this, 'click'); };
	CouleurInfo.onmousedown = function(){ Ot.addClass(this, 'click'); };
	CouleurInfo.onmouseup = function(){ Ot.removeClass(this, 'click'); };

	CouleurOpen.onmouseover = function(){ Ot.addClass(this, 'hover'); Ot.addClass(CouleurInfo, 'hoverlittle'); };
	CouleurOpen.onmouseout = function(){ Ot.removeClass(this, 'hover'); Ot.removeClass(CouleurInfo, 'hoverlittle'); Ot.removeClass(this, 'click'); };
	CouleurOpen.onmousedown = function(){ Ot.addClass(this, 'click'); };
	CouleurOpen.onmouseup = function(){ Ot.removeClass(this, 'click'); };


	var CouleurList = document.getElementById('CadCouleur').getElementsByTagName('a');
	for(var i = 0; i < CouleurList.length; i++)
	{
		CouleurList[i].href = '#';
		CouleurList[i].onclick = function()
		{
			var Couleur = Color.CssToHex(this.style.background);
			GWys.exec('forecolor', Couleur);
			CadCouleur.setRecent(Couleur);
			return false;
		};
		CouleurList[i].onmouseover = function()
		{
			var Couleur = Color.CssToHex(this.style.background);
			Ot.addClass(this, 'hover');
			GWys.show(Couleur, 'Couleur');
		};
		CouleurList[i].onmouseout = function(){ Ot.removeClass(this, 'hover'); };
	}

	Ot.setOpacity(document.getElementById('BarreOutilProtect'), 0.09);
	document.getElementById('BarreOutilProtect').style.display = 'block';

	Ot.addEvent(document, 'mousedown', GWys.outWys);

	this.resetBout();
},

reset: function()
{
	this.List = {};
	this.Act = {};
	this.SelectAct = null;
},

addBlockNew: function()
{
	var Block = { T: 'Wys', V: 'Texte ici...', P: [50, 100, 0] };

	this.addBlock(Block, 'addByUser');
},

addBlock: function(Block, Mode)
{
	var Id = Ot.getRandId('Module');
	var Con = '<iframe id="'+Id+'" src="/wys.html" class="BlockWHFull" frameborder="0"></iframe>';

	var Html = this.getHtmlEdit(Block.V);

	this.List[Id] = { Etat: 'stage0', DefHtml: Html };

	GBlock.add(Con, '', Block, Mode);

	Ot.addEvent(document.getElementById(Id), 'load', function(){ GWys.load(Id, Mode); });
},

load: function(Id, Mode)
{
	if(this.List[Id] && this.List[Id].Etat == 'stage1')
	{
		var Wys = this.List[Id];

		this.List[Id].Win.document.body.innerHTML = Wys.DefHtml;

		Wys.Win.document.body.style.backgroundColor = Ot.getValueOfObjPropr(Wys.Iframe.parentNode, 'background-color');
		Wys.Win.document.body.style.color = Wys.CouleurDef;
		Wys.Win.document.body.style.fontFamily = Wys.PoliceDef;
		Wys.Win.document.body.style.fontSize = Wys.SizeDef;
		this.setLienRule(Wys);

		if(Mode == 'Inte'){
			this.resize(Wys);
		}
		else if(Mode == 'addByUser')
		{
			if(!Wys.isAlreadyLoad)
			{
				this.selectWys(false, Wys);
				this.exec('selectall');
			}
		}

		this.List[Id].isAlreadyLoad = true;
		this.List[Id].Etat = 'stage2';
	}
	else
	{
		var Iframe = document.getElementById(Id);
		var Wys = {};

		Wys.Iframe = Iframe;
		Wys.Id = Id;
		Wys.Histo = [this.List[Id].DefHtml];
		Wys.HistoPos = 0;

		if(CClient[0] == 'IExploreur'){
			Wys.Win = window.frames[Id];
			Wys.Doc = Wys.Win.document;
			Wys.Foc = Wys.Win;
		}
		else{
			Wys.Win = Iframe.contentWindow;
			Wys.Doc = Iframe.contentDocument;
			Wys.Foc = Wys.Win;

			if(CClient[0] == 'Opera' && CClient[1] <= '9.26'){
				Wys.Foc = Iframe;
			}
		}

		if(Mode == 'Inte'){
			Wys.Type = 'Inte';
		}
		else{
			Wys.Type = 'Block';
		}

		var CouleurDef = Color.CssToHex(Ot.getValueOfObjPropr(Iframe.parentNode, 'color'));
		var SizeDef = Ot.getValueOfObjPropr(Iframe.parentNode, 'font-size');
		var PoliceDef = Ot.getValueOfObjPropr(Iframe.parentNode, 'font-family').replace(/"/g, '').toLowerCase();
		if(PoliceDef.indexOf(',') != -1){
			PoliceDef = PoliceDef.substring(0, PoliceDef.indexOf(',')); //Clear
		}

		Wys.CouleurDef = CouleurDef;
		Wys.SizeDef = SizeDef;
		Wys.PoliceDef = PoliceDef;

		this.List[Id] = Ot.CombineHash(this.List[Id], Wys);

		Wys.Doc.designMode = 'On';

		if(navigator.appName == 'Netscape'){
			Wys.Doc.execCommand('styleWithCSS', false, false);
		}

		//Event
		Ot.addEvent(Wys.Win.document, 'mousedown', function(event)
		{
			GWys.selectWys(event, Wys);

			var Clique = event.which || event.button;
			if(Clique == 2 || Clique == 3){ //Clique droit
				GWys.saveRange();
			}
		});
		Ot.addEvent(Wys.Win.document, 'mouseup', function(event)
		{
			GWys.actBout(event);
			GWys.resize(Wys);
		});
		Ot.addEvent(Wys.Win.document, 'contextmenu', CadContextMenu.open);

		Ot.addEvent(Wys.Win.document, 'keyup', function(event)
		{
			if(GWys.Act.Win)
			{
				if(event.ctrlKey)
				{
					if(event.keyCode == 90) // Z
					{
						GWys.PreSuiv('Precedant');
					}
					else if(event.keyCode == 89) // Y
					{
						GWys.PreSuiv('Suivant');
					}
					else if(event.keyCode == 88 || event.keyCode == 67 || event.keyCode == 86) // X C V
					{
						GWys.PreSuiv('Save');
					}
				}
				else
				{
					GWys.actBout();
					GWys.resize(Wys);

					if(event.keyCode == Ot.Key.Enter){
						GWys.PreSuiv('Save');
					}
				}
			}
		});

		Ot.addEvent(Wys.Win.document, 'keydown', function(event)
		{
			if(GWys.Act.Win && event.keyCode == Ot.Key.Tab)
			{
				Ot.cancelEvent(event);
				GWys.insertHtml('&nbsp;&nbsp;&nbsp;&nbsp;');
				GWys.PreSuiv('Save');
			}
		});

		if(CClient[0] == 'IExploreur' || CClient[0] == 'Opera' || CClient[0] == 'Safari')
		{
			Ot.addEvent(Wys.Win.document, 'keydown', GWys.BugEnter);
		}

		this.List[Id].Etat = 'stage1';

		if(CClient[0] != 'IExploreur'){
			this.load(Id, Mode);
		}
	}
},

BugEnter: function()
{
	GWys.Act.Doc.execCommand('formatblock', false, '<div>');
	Ot.stopEvent(GWys.Act.Win.document, 'keydown', GWys.BugEnter);
},

selectWys: function(event, Wys)
{
	if(GWys.Act.Foc && GWys.Act.Id != Wys.Id){ //Nouveau Wys
		GWys.removeRange();
	}

	GWys.Act = GWys.List[Wys.Id];
	GWys.PreSuiv('Act');
	GWys.isOut = false;

	document.getElementById('BarreOutilProtect').style.display = 'none';

	CadWin.closeAll(event);
	GCadre.closeAll();
	GData.close();
},

outWys: function(event)
{
	if(GWys.Act.Foc && GWys.isOut == false)
	{
		var Target = Ot.getTarget(event);

		if(Ot.isAChildOf(document.getElementById('CreatorCon'), Target))
		{
			document.getElementById('BarreOutilProtect').style.display = 'block';

			GWys.resetBout();
			GWys.removeRange();
			GWys.Act = {};
			GWys.isOut = true;
		}
		else if(Ot.isAChildOf(document.getElementById('BarreOutil'), Target))
		{
			GWys.saveRange();
			window.setTimeout(function(){ GWys.setRange(); });
		}
	}
},

actBout: function(event)
{
	this.resetBout();

	var Select = this.getSelect();
	var SelectParent = Select.parent;

	var BOCouper = document.getElementById('BOCouper');
	var BOCopier = document.getElementById('BOCopier');

	if(Select.text == ''){
		Ot.addClass(BOCouper, 'disable');
		BOCouper.firstChild.style.backgroundPosition = '-16px 0';
		Ot.addClass(BOCopier, 'disable');
		BOCopier.firstChild.style.backgroundPosition = '-16px -16px';
	}
	else{
		Ot.removeClass(BOCouper, 'disable');
		BOCouper.firstChild.style.backgroundPosition = '0 0';
		Ot.removeClass(BOCopier, 'disable');
		BOCopier.firstChild.style.backgroundPosition = '0 -16px';
	}

	while(SelectParent.nodeType == 3){
		SelectParent = SelectParent.parentNode;
	}

	while(SelectParent.nodeName.toLowerCase() != 'body')
	{
		var NodeType = SelectParent.nodeName.toLowerCase();

		if(NodeType == 'font')
		{
			if(SelectParent.getAttribute('face') && PoliceOn != true){
				this.PoliceAct = SelectParent.getAttribute('face');
				var PoliceOn = true;
			}
			if(SelectParent.getAttribute('size') && TailleOn != true){
				this.SizeAct = SelectParent.getAttribute('size');
				var TailleOn = true;
			}
			if(SelectParent.getAttribute('color') && ColorOn != true){
				this.CouleurAct = SelectParent.getAttribute('color');
				var ColorOn = true;
			}
		}
		else if(NodeType == 'div' || NodeType == 'p')
		{
			if(AligneOn != true)
			{
				if(SelectParent.getAttribute('align') == 'left'){
					Ot.addClass(document.getElementById('JustifyLeft'), 'select');
					var AligneOn = true;
				}
				else if(SelectParent.getAttribute('align') == 'center'){
					Ot.addClass(document.getElementById('JustifyCenter'), 'select');
					var AligneOn = true;
				}
				else if(SelectParent.getAttribute('align') == 'right'){
					Ot.addClass(document.getElementById('JustifyRight'), 'select');
					var AligneOn = true;
				}
				else if(SelectParent.getAttribute('align') == 'justify'){
					Ot.addClass(document.getElementById('JustifyFull'), 'select');
					var AligneOn = true;
				}
			}
		}
		else if(NodeType == 'strong' || NodeType == 'b'){
			Ot.addClass(document.getElementById('BOGras'), 'select');
		}
		else if(NodeType == 'em' || NodeType == 'i'){
			Ot.addClass(document.getElementById('BOItalique'), 'select');
		}
		else if(NodeType == 'ins' || NodeType == 'u'){
			Ot.addClass(document.getElementById('BOSouligner'), 'select');
		}
		else if(NodeType == 'sub'){
			Ot.addClass(document.getElementById('BOSubScript'), 'select');
		}
		else if(NodeType == 'sup'){
			Ot.addClass(document.getElementById('BOSuperScript'), 'select');
		}
		else if(NodeType == 'ul'){
			Ot.addClass(document.getElementById('BOList'), 'select');
		}
		else if(NodeType == 'a')
		{
			Ot.addClass(document.getElementById('BOLien'), 'select');
			Ot.removeClass(document.getElementById('BOLienRemove'), 'disable');
			document.getElementById('BOLienRemove').firstChild.style.backgroundPosition = '0 -208px';
			CadLienClick.open(SelectParent, event);
		}

		SelectParent = SelectParent.parentNode;
	}

	if(PoliceOn != true){
		this.PoliceAct = this.Act.PoliceDef;
	}
	if(TailleOn != true){
		this.SizeAct = 2;
	}
	if(ColorOn != true){
		this.CouleurAct = this.Act.CouleurDef;
	}
	if(AligneOn != true){
		Ot.addClass(document.getElementById('JustifyLeft'), 'select');
	}

	this.PoliceAct = this.PoliceAct.toLowerCase();

	document.getElementById('BOSelect').getElementsByTagName('td')[0].firstChild.innerHTML = this.PoliceAct;
	document.getElementById('BOSelect').getElementsByTagName('td')[2].firstChild.innerHTML = this.SizeAct;
	document.getElementById('BOCouleurAct').style.background = this.CouleurAct;
},

resetBout: function()
{
	var BoutList = Ot.getElementsByClassName('BOBout', 'div', document.getElementById('BOBout'));
	for(var i = 0; i < BoutList.length; i++)
	{
		BoutList[i].className = 'BOBout';
	}

	var BOCouper = document.getElementById('BOCouper');
	Ot.addClass(BOCouper, 'disable');
	BOCouper.firstChild.style.backgroundPosition = '-16px 0';

	var BOCopier = document.getElementById('BOCopier');
	Ot.addClass(BOCopier, 'disable');
	BOCopier.firstChild.style.backgroundPosition = '-16px -16px';

	var BOLienRemove = document.getElementById('BOLienRemove');
	Ot.addClass(BOLienRemove, 'disable');
	BOLienRemove.firstChild.style.backgroundPosition = '-16px -208px';

	this.PreSuiv('reset');

	document.getElementById('BOSelect').getElementsByTagName('td')[0].firstChild.innerHTML = '';
	document.getElementById('BOSelect').getElementsByTagName('td')[2].firstChild.innerHTML = '';
},

getSelect: function()
{
	if(typeof window.getSelection != 'undefined')
	{
		var Selection = this.Act.Win.getSelection();
		var Range = Selection.getRangeAt(0);
		var Parent = Range.commonAncestorContainer;
	}
	else if(typeof document.selection != 'undefined')
	{
		var Range = this.Act.Win.document.selection.createRange();
		var Selection = Range.text;
		var Parent = Range.parentElement();
	}

	return { text: Selection, range: Range, parent: Parent };
},

saveRange: function()
{
	this.Act.Foc.focus();

	if(typeof window.getSelection != 'undefined'){
		this.SelectAct = this.Act.Win.getSelection().getRangeAt(0).cloneRange();
	}
	else if(typeof document.selection != 'undefined'){
		this.SelectAct = this.Act.Win.document.selection.createRange().getBookmark();
	}
	else{
		this.SelectAct = null;
	}
},

setRange: function(Wys)
{
	if(!Wys){
		Wys = this.Act;
	}

	if(this.SelectAct != null)
	{
		Wys.Foc.focus();

		if(typeof window.getSelection != 'undefined')
		{
			var selection = Wys.Win.getSelection();
			selection.removeAllRanges();
			selection.addRange(this.SelectAct);
		}
		else if(typeof document.selection != 'undefined')
		{
			var range = Wys.Win.document.body.createTextRange();
			range.moveToBookmark(this.SelectAct);
			range.select();
		}
	}
},

removeRange: function(Wys)
{
	if(!Wys){
		Wys = this.Act;
	}

	Wys.Foc.focus();

	if(!Wys.Win)
	{
		alert(Wys);
	}

	if(typeof window.getSelection != 'undefined')
	{
		var selection = Wys.Win.getSelection();

		if(selection){
			selection.removeAllRanges();
		}
	}
	else if(typeof document.selection != 'undefined')
	{
		Wys.Win.document.selection.empty();
	}
},

exec: function(Type, Attribue)
{
	this.setRange();

	if(Type == 'cut' || Type == 'copy' || Type == 'paste')
	{
		try{
			this.Act.Doc.execCommand(Type, false, null);
			this.PreSuiv('Save');
		}
		catch(e)
		{
			switch(Type)
			{
				case 'cut': var Lettre = 'X'; break;
				case 'copy': var Lettre = 'C'; break;
				case 'paste': var Lettre = 'V'; break;
			}

			var Touche = (CClient[2] == 'Mac') ? 'Cmd' : 'Ctrl';

			alert('Désoler, cette fonction n\'est pas supporté par votre navigateur.\nUtilisez plutôt '+Touche+' + '+Lettre+'.');
		}
	}
	else if(Type == 'unlink')
	{
		var Select = this.getSelect();
		var SelectParent = Select.parent;

		if(Select.text == '')
		{
			while(SelectParent.nodeName.toLowerCase() != 'a'){
				SelectParent = SelectParent.parentNode;
			}

			if(SelectParent.nodeName.toLowerCase() == 'a')
			{
				CadLien.removeLien(SelectParent);
			}
			else{
				this.Act.Doc.execCommand(Type, false, Attribue);
			}
		}
		else{
			this.Act.Doc.execCommand(Type, false, Attribue);
		}

		this.PreSuiv('Save');
	}
	else
	{
		this.Act.Doc.execCommand(Type, false, Attribue);
		this.PreSuiv('Save');
	}

	this.resize(this.Act);
	this.actBout();
	this.saveRange();

	CadWin.closeAll(false);
},

PreSuiv: function(Action)
{
	if(Action == 'Save')
	{
		var Html = this.Act.Win.document.body.innerHTML;

		if(Html != this.Act.Histo[this.Act.HistoPos])
		{
			this.Act.HistoPos = this.Act.Histo.length;
			this.Act.Histo[this.Act.HistoPos] = Html;
		}
	}
	else if(Action == 'Precedant')
	{
		if(this.Act.Histo[this.Act.HistoPos - 1] != null)
		{
			this.Act.HistoPos -= 1;
			this.Act.Win.document.body.innerHTML = this.Act.Histo[this.Act.HistoPos];
			this.resize(this.Act);
		}
	}
	else if(Action == 'Suivant')
	{
		if(this.Act.Histo[this.Act.HistoPos + 1] != null)
		{
			this.Act.HistoPos += 1;
			this.Act.Win.document.body.innerHTML = this.Act.Histo[this.Act.HistoPos];
			this.resize(this.Act);
		}
	}

	var BOSuivant = document.getElementById('BOSuivant');
	var BOPrecedent = document.getElementById('BOPrecedent');
	var isPre = false;
	var isSuiv = false;

	if(this.Act.Histo && this.Act.Histo[this.Act.HistoPos + 1]){
		Ot.removeClass(BOSuivant, 'disable');
		BOSuivant.firstChild.style.backgroundPosition = '0 -160px';
		isSuiv = true;
	}
	else{
		Ot.addClass(BOSuivant, 'disable');
		BOSuivant.firstChild.style.backgroundPosition = '-16px -160px';
	}

	if(this.Act.Histo && this.Act.Histo[this.Act.HistoPos - 1]){
		Ot.removeClass(BOPrecedent, 'disable');
		BOPrecedent.firstChild.style.backgroundPosition = '0 -144px';
		isPre = true;
	}
	else{
		Ot.addClass(BOPrecedent, 'disable');
		BOPrecedent.firstChild.style.backgroundPosition = '-16px -144px';
	}

	return { isPre: isPre , isSuiv: isSuiv };
},

resize: function(Wys)
{
	var Iframe = Wys.Iframe;

	var HeightAct = Iframe.offsetHeight;

	if(Wys.Win.innerWidth && Wys.Win.scrollMaxX){
		var PageWidth = Wys.Win.innerWidth + Wys.Win.scrollMaxX;
	}
	else{
		var PageWidth = Wys.Win.document.body.scrollWidth;
	}

	if(CClient[0] == 'Safari' || CClient[0] == 'Chrome'){
		var PageHeight = Wys.Win.document.body.offsetHeight;
	}
	else{
		var PageHeight = Wys.Win.document.body.scrollHeight;
	}

	if(PageWidth > Iframe.offsetWidth){
		PageHeight += 18;
	}

	if(Wys.Type == 'Block')
	{
		var ScrollMore = PageHeight - HeightAct + 5;

		if(ScrollMore > 0){
			var NewHeight = PageHeight + 45;
		}
		else if(ScrollMore < -60){
			var NewHeight = PageHeight + 5;
		}
		NewHeight = (NewHeight < 50) ? 50 : NewHeight;
		Iframe = Iframe.parentNode;
	}
	else if(Wys.Type == 'Inte')
	{
		var NewHeight = PageHeight;
		NewHeight = (NewHeight < 20) ? 20 : NewHeight;
	}

	if(NewHeight && NewHeight != HeightAct)
	{
		new Fx(Iframe, { From: HeightAct, To: NewHeight, Mode: 'height', CallBack: function()
		{
			var BlockColone = GBlock.isAChildOfColone(GBlock.getBlockObj(Iframe));
			if(Wys.Type == 'Block' && BlockColone != false)
			{
				BlockColone.style.height = GBlock.getColoneHeightOpt(BlockColone) + 'px';
			}
		}});
	}
},

resizeInte: function(BlockCon)
{
	var IframeList = BlockCon.getElementsByTagName('iframe');
	if(IframeList.length != 0)
	{
		for(var i = 0; i < IframeList.length; i++)
		{
			var IframeAct = IframeList[i];

			if(this.isWys(IframeAct) && this.List[IframeAct.id].Type == 'Inte')
			{
				this.resize(this.List[IframeAct.id]);
			}
		}
	}
},

show: function(Var, Mode)
{
	if(this.ShowAct.isIniti == false)
	{
		if(this.getSelect().text != '')
		{
			this.ShowAct.isSelect = true;
			Ot.addEvent(document, 'mousemove', GWys.showMove);
		}
		else{
			this.ShowAct.isSelect = false;
		}

		this.ShowAct.Etat = 'Over';
		this.ShowAct.Type = Mode;
		this.ShowAct.isIniti = true;

		if(Mode == 'Police' || Mode == 'Taille'){
			CadPoliceTaille.resetVarAct(Mode);
		}
	}

	if(this.ShowAct.isSelect == true && this.ShowAct.Etat != 'End')
	{
		this.setRange();

		if(Mode == 'Police'){
			this.Act.Doc.execCommand('fontname', false, Var);
		}
		else if(Mode == 'Taille'){
			this.Act.Doc.execCommand('fontsize', false, Var);
		}
		else{
			this.Act.Doc.execCommand('forecolor', false, Var);
		}

		this.saveRange();
		this.removeRange();
		this.ShowAct.Etat = 'Over';
	}
},

showMove: function(event)
{
	if(GWys.ShowAct.Etat == 'Over')
	{
		var OverWin = false;

		var Target = Ot.getTarget(event);
		var Obj = Target;
		while(Obj)
		{
			if(Obj.id == 'CadPolice' || Obj.id == 'CadTaille' || Obj.id == 'CadCouleur')
			{
				OverWin = true;
				Obj = false;
			}
			else{
				Obj = Obj.parentNode;
			}
		}

		if(OverWin == false) //Out
		{
			GWys.ShowAct.Etat = 'Out';
			GWys.setRange();

			if(GWys.ShowAct.Type == 'Police'){
				GWys.Act.Doc.execCommand('fontname', false, GWys.PoliceAct);
			}
			else if(GWys.ShowAct.Type == 'Taille'){
				GWys.Act.Doc.execCommand('fontsize', false, GWys.SizeAct);
			}
			else if(GWys.ShowAct.Type == 'Couleur'){
				GWys.Act.Doc.execCommand('forecolor', false, GWys.CouleurAct);
			}

			GWys.saveRange();
		}
	}
},

insertHtml: function(Html)
{
	GWys.setRange();

	var Select = this.getSelect();
	var Range = Select.range;

	if(Range.insertNode)
	{
		var Node = this.Act.Win.document.createElement('div');
		Node.innerHTML = Html;
		Node = Node.firstChild;

		Range.deleteContents();
		Range.insertNode(Node);

		Range.setStartAfter(Node);
        Range.setEndAfter(Node);

		Select.text.removeAllRanges();
		Select.text.addRange(Range);
	}
	else
	{
		Range.pasteHTML(Html);
		Range.collapse(false);
		Range.select();
	}
},

cleanInject: function(Html)
{
	Html = Html.replace(/<script(.*)>(.*)<\/script>/gi, ''); // SCRIPT
	Html = Html.replace(/<iframe(.*)(\/>|<\/iframe>)/gi, ''); // IFRAME
	Html = Html.replace(/<frame(.*)(\/>|<\/frame>)/gi, ''); // FRAME
	Html = Html.replace(/on([a-zA-Z]*)="(.*)"/gi, ''); // JS
	Html = Html.replace(/on([a-zA-Z]*)='(.*)'/gi, ''); // JS

	return Html;
},

isWys: function(Iframe)
{
	if(this.List[Iframe.id]){
		return true;
	}
	else{
		return false;
	}
},

remove: function(Obj)
{
	if(Obj.id){
		delete this.List[Obj.id];
	}
	else{
		delete this.List[Id];
	}
},

saveWysOfBlock: function(BlockObj)
{
	var IframeList = BlockObj.getElementsByTagName('iframe');
	for(var i = 0; i < IframeList.length; i++)
	{
		var IframeAct = IframeList[i];

		if(this.isWys(IframeAct) && CClient[0] != 'IExploreur')
		{
			var Id = IframeAct.id;
			this.List[Id].DefHtml = this.List[Id].Win.document.body.innerHTML;
			this.List[Id].Etat = 'stage0';
		}
	}
},

setLienRule: function(Wys)
{
	var Href = document.getElementById('ThemeLink').href;
	var Sheet = Css.getSheetByHref(document, Href);
	var Rule = Css.getRule(Sheet, '#ThemeCon a');
	var setRulePropr = Css.getSetRulePropr(Rule);

	var LienList = Wys.Win.document.body.getElementsByTagName('a');

	for(var i = 0; i < LienList.length; i++)
	{
		setRulePropr(LienList[i]);
	}
},

getHtmlEdit: function(Html)
{
	if(CClient[0] == 'Firefox')
	{
		Html = Html.replace(/<strong(\s+|>)/g, '<b$1');
		Html = Html.replace(/<\/strong(\s+|>)/g, '</b$1');
		Html = Html.replace(/<em(\s+|>)/g, '<i$1');
		Html = Html.replace(/<\/em(\s+|>)/g, '</i$1');
		Html = Html.replace(/<ins(\s+|>)/g, '<u$1');
		Html = Html.replace(/<\/ins(\s+|>)/g, '</u$1');
	}

	return Html;
},

getSave: function(Iframe)
{
	var Id = Iframe.id;

	if(this.List[Id].Etat == 'stage2'){
		var Html = this.List[Id].Win.document.body.innerHTML;
	}
	else{
		var Html = this.List[Id].DefHtml;
	}

	Html = Html.replace(/<[^>]*>/g, function(m){ return m.toLowerCase();}); //Replace le nom des elements par des minuscules
	Html = Html.replace(/<[^>]*>/g, function(m){  // Replace le nom des atribue par des minuscules
		m = m.replace(/ [^=]+=/g, function(m2){ return m2.toLowerCase(); });
		return m;
	});
	Html = Html.replace(/<br>/g, '<br/>');
	Html = Html.replace(/[\t\r\n]/g, '');
	Html = Html.replace(/<[^>]*>/g, function(m)  //Mettre entre guillemets des attributs qui ne le sont pas
	{
		m = m.replace(/( [^=]+=)([^"][^ >]*)/g, "$1\"$2\"");
		return m;
	});

	Html = Html.replace(/ style="[^"]*"/g, '');

	Html = this.cleanInject(Html);

	return Html;
}

};