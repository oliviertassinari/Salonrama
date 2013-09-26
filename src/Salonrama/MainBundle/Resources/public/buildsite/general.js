/* JavaScript, By Olivier (olivier.tassinari@gmail.com)
-----------------------*/

var CClient;

function Initi()
{
	bsCadreLoad.show();

	CClient = Ot.CClient();

	onResize();
	Ot.addEvent(window, 'resize', onResize);

	CadImage.PreVis = new PreVis('<div style="padding-top:13px;"><button type="button" class="button-small button-small-green" id="CadImagePreVis" onclick="CadImage.addBdd(\'PreVis\')"></button></div>');
	CadImage.PreVis.Ele.Cadre.className += ' CadImagePreVis';

	GWys.initi();
	GPage.initi();
	GTheme.set(GTheme.Act, function()
	{
		GPage.set(GPage.Act);
		bsCadreLoad.hide();
	});

	onScroll();
}

function onResize()
{
	var Height = Ot.getBrowserSize().y - 134 - 81;

	document.getElementById('CreatorCon').style.height = Height+'px';
	document.getElementById('Theme').style.minHeight = Height+'px';
}

var ScrollAct;

function onScroll()
{
	var CreatorCon = document.getElementById('CreatorCon');

	ScrollAct = CreatorCon.scrollTop;

	window.setInterval(function()
	{
		if(CreatorCon.scrollTop != ScrollAct)
		{
			ScrollAct = CreatorCon.scrollTop;

			if(CadLienClick.isOpen){
				CadLienClick.close();
			}
			if(CadWin.List['CadContextMenu'] && CadWin.List['CadContextMenu'] == 1){
				CadWin.close('CadContextMenu');
			}
		}
	}, 500);
}


var GTheme = {

List: [],
Act: '',
BlockListWidth: '',

set: function(Theme, CallBack)
{
	if(!document.getElementById('ThemeLink'))
	{
		var Style = Ot.addStyle(document);
		Style.href = '/bundles/salonramamain/theme/'+Theme+'/theme.css';
		Style.id = 'ThemeLink';
	}
	else
	{
		document.getElementById('ThemeLink').href = '/bundles/salonramamain/theme/'+Theme+'/theme.css';
	}

	$.ajax({
		type: "POST",
		url: pathBuildsite+"theme/get_structure",
		data: { theme: Theme },
		dataType: "json",
		success: function(response){
			GTheme.Act = Theme;
			GTheme.BlockListWidth = response.text[0];

			document.getElementById('BarreOutilInfo').getElementsByTagName('span')[0].innerHTML = Theme;
			document.getElementById('Theme').innerHTML = GData.setVar(response.text[1]);
			document.getElementById('ThemeBlockList').innerHTML = '<div class="BlockVide">Cette page est vide.</div>';

			GData.initi(document.getElementById('Theme'));

			if(Ot.isFonc(CallBack)){
				CallBack(true);
			}
		},
		error: function(rs, e) {
			document.getElementById('Theme').innerHTML = '<div class="BlockVide">Erreur : '+e+'</div>';

			if(Ot.isFonc(CallBack)){
				CallBack(false);
			}
		},
	});
},

change: function(Theme, CallBack)
{
	if(GPage.Busy == false && Theme != this.Act)
	{
		bsCadreLoad.show();

		GPage.Busy = true;
		this.Act = Theme;

		var BlockList = GBlock.getSave();
		var CallBack1 = function()
		{
			GTheme.set(GTheme.Act, function()
			{
				GPage.set(GPage.Act);

				bsCadreLoad.hide();

				if(Ot.isFonc(CallBack)){
					CallBack(false);
				}
			});
		};

		if(JSON.encode(BlockList) != JSON.encode(GBlock.List[GPage.Act])){
			GBlock.List[GPage.Act] = BlockList;
			GPage.saveVar(['imageList', 'dataList', 'blockList', 'theme'], [JSON.encode(GImage.List), JSON.encode(GData.List), JSON.encode(GBlock.List), Theme], CallBack1);
		}
		else{
			GBlock.List[GPage.Act] = BlockList;
			GPage.saveVar(['imageList', 'dataList', 'theme'], [JSON.encode(GImage.List), JSON.encode(GData.List), Theme], CallBack1);
		}
	}
}

};

var GData = {

List: {},
Obj: '',

setVar: function(Txt)
{
	var R = Txt;

	var Reg = />Data(\w*)</g;
	var FoundList = R.match(Reg);

	if(FoundList)
	{
		for(var i = 0; i < FoundList.length; i++)
		{
			var Type = FoundList[i].replace(Reg, '$1');

			if(this.List[Type] || this.List[Type] == '')
			{
				var Reg2 = new RegExp('>Data'+Type+'<');

				R = R.replace(Reg2, '><span class="GData" title="Modifier ce texte" onclick="GData.saveList(this, \''+Type+'\')">'+this.List[Type]+'</span><');
			}
		}
	}

	return R;
},

saveList: function(Obj, Type)
{
	this.open(Obj, function(Obj, Txt)
	{
		GData.List[Type] = Txt;
	});
},

initi: function(Obj)
{
	var SpanList = Obj.getElementsByTagName('span');

	for(var i = 0; i < SpanList.length; i++)
	{
		var SpanAct = SpanList[i];

		if(SpanAct.onclick && SpanAct.onclick.toString().indexOf('GData') != -1)
		{
			if(SpanAct.innerHTML == ''){
				SpanAct.innerHTML = 'Text';
			}
		}
	}
},

open: function(Obj, CallBack)
{
	if(this.Obj == '')
	{
		this.Obj = Obj;
		this.CallBack = CallBack;
		this.Max = Obj.parentNode.offsetWidth*0.9;
		var Text = Obj.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

		var Width = Ot.getWidthFont(Text.replace(/ /g,'&nbsp;'), '', '', '', 'span', Obj) + 40;
		Width = (Width > this.Max) ? this.Max : Width;

		Obj.innerHTML = '<input type="text" size="20"></input>';

		this.Input = Obj.firstChild;

		this.Input.style.marginTop = '-3px';
		this.Input.style.width = Width + 'px';
		this.Input.style.fontFamily = Ot.getValueOfObjPropr(Obj, 'font-family');
		this.Input.style.fontWeight = Ot.getValueOfObjPropr(Obj, 'font-weight');
		this.Input.style.letterSpacing = Ot.getValueOfObjPropr(Obj, 'letter-spacing');
		this.Input.value = Text;
		this.Input.focus();
		this.Input.select();

		Ot.addEvent(document, 'mousedown', GData.out);

		this.Input.onkeyup = function(e){
			e = e || window.event;
			GData.key(e);
		};
	}
},

key: function(event)
{
	var keyCode = event.keyCode;

	if(keyCode == Ot.Key.Enter){ //Entrée
		this.close();
	}
	else if(keyCode != Ot.Key.Left && keyCode != Ot.Key.Up && keyCode != Ot.Key.Right && keyCode != Ot.Key.Down)
	{
		var Input = this.Input;
		var Width = Ot.getWidthFont(Input.value.replace(/ /g,'&nbsp;'), '', '', '', 'span', Input.parentNode) + 40;

		if(Width > this.Max){
			Input.style.width = this.Max+'px';
		}
		else{
			var From = parseInt(Input.style.width.replace(/px/, ''), 10);
			new Fx(Input, { From: From, To: Width, Mode: 'width', duree: 400, CallBack: function()
			{
				var CursorPosition = Ot.getCursorPosition(Input);
				Input.value = Input.value;
				Ot.setCursorPosition(Input, CursorPosition);
			}});
		}
	}
},

out: function(event)
{
	if(Ot.getTarget(event) != GData.Input)
	{
		GData.close();
	}
},

close: function()
{
	if(this.Obj != '')
	{
		Ot.stopEvent(document, 'mousedown', GData.out);

		Ot.stopFx(this.Input);

		var Text = this.Input.value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');

		var RegExp = /^\s*$/;
		if(Text == '' || RegExp.test(Text.replace(/&nbsp;/g,' ')) == true){  // Si vide
			Text = 'Text';
		}

		this.Obj.innerHTML = Text;

		if(Ot.isFonc(this.CallBack)){
			this.CallBack(this.Obj, Text);
		}

		this.Obj = '';
	}
}

};

var GPage = {

List: [],
Act: '',
Busy: true,

initi: function()
{
	var Hash = History.getHash();
	var pageHash = Ot.getGETFromUrl(Hash, 'page');

	if(Hash != '' && pageHash != '')
	{
		var index = GPage.getIndexListId(pageHash);

		if(index != -1)
		{
			GPage.Act = pageHash;
		}
	}

	History.setHash('?page='+GPage.Act);
	History.StartObserve(function(Hash)
	{
		var pageHash = Ot.getGETFromUrl(Hash, 'page');

		if(Hash != '' && pageHash != '')
		{
			var index = GPage.getIndexListId(pageHash);

			if(index != -1)
			{
				GPage.set(pageHash);
			}
		}
	});
},

getIndexListId: function(id)
{
	var index = -1;

	for(var i = 0; i < this.List.length; i++)
	{
		if(this.List[i].id == id)
		{
			index = i;
			break;
		}
	}

	return index;
},

set: function(Page)
{
	this.Busy = true;
	this.Act = Page;
	this.setMenu();

	document.getElementById('ThemeBlockList').innerHTML = '<div class="BlockVide">Cette page est vide.</div>';

	History.setHash('?page='+Page);

	GBlock.load(Page);

	this.Busy = false;
},

change: function(Page)
{
	if(Page == 'reload' || (Page != this.Act && this.getIndexListId(this.Act) != -1) && this.Busy == false)
	{
		bsCadreLoad.show();

		this.Busy = true;
		if(Page == 'reload'){
			Page = this.Act;
		}

		var BlockList = GBlock.getSave();
		var CallBack = function()
		{
			GPage.set(Page);
			bsCadreLoad.hide();
		};

		if(JSON.encode(BlockList) != JSON.encode(GBlock.List[this.Act])){
			GBlock.List[this.Act] = BlockList;
			this.saveVar(['imageList', 'dataList', 'blockList'], [JSON.encode(GImage.List), JSON.encode(GData.List), JSON.encode(GBlock.List)], CallBack);
		}
		else{
			GBlock.List[this.Act] = BlockList;
			this.saveVar(['imageList', 'dataList'], [JSON.encode(GImage.List), JSON.encode(GData.List)], CallBack);
		}
	}
},

setMenu: function()
{
	var Menu = '<ul>';
	for(var i = 0; i < this.List.length; i++)
	{
		if(this.List[i].id == this.Act){
			var More = ' class="ThemeMenuAct"';
		}
		else{
			var More = '';
		}

		Menu += '<li><a'+More+' href="#?page='+this.List[i].id+'" onclick="GPage.change(\''+this.List[i].id+'\'); return false;">'+this.List[i].name+'</a></li>';
	}
	Menu += '</ul>';

	document.getElementById('BarreOutilInfo').getElementsByTagName('span')[1].innerHTML = this.List[this.getIndexListId(this.Act)].name;
	document.getElementById('ThemeMenu').innerHTML = Menu;
},

saveVar: function(NomList, VarList, CallBack)
{
	var oParam = {};

	for(var i = 0; i < NomList.length; i++)
	{
		oParam['Nom'+i] = NomList[i];
		oParam['Var'+i] = VarList[i];
	}

	$.ajax({
		type: "POST",
		url: pathBuildsite+"save",
		data: oParam,
		dataType: "json",
		success: function(response){
			if(Ot.isFonc(CallBack)){
				CallBack();
			}
		},
		error: function(rs, e) {
			alert('Erreur : '+e);

			if(Ot.isFonc(CallBack)){
				CallBack();
			}
		},
	});
}

};


var GImage = {

List: {},
ListNew: {},
BddList: {},

add: function(Nom, width, height)
{
	this.List[Nom] = [width, height];
},

getNom: function(Src)
{
	var Nom = Src.substring(Src.lastIndexOf('/')+1, Src.length);

	if(Nom.lastIndexOf('?') != -1){
		Nom = Nom.substring(0, Nom.lastIndexOf('?'));
	}

	return Nom;
},

getInfo: function(Nom)
{
	if(this.BddList[Nom])
	{
		return { src: '/bundles/salonramamain/gallery/'+Nom, w: this.BddList[Nom][0], h: this.BddList[Nom][1], isFound: true };
	}
	else if(this.List[Nom])
	{
		if(this.ListNew[Nom]){
			var More = '?new='+this.ListNew[Nom];
		}
		else{
			var More = '';
		}

		return { src: LocHomeSite+'upload/'+Nom+More, w: this.List[Nom][0], h: this.List[Nom][1], isFound: true };
	}
	else{
		return { src: '/bundles/salonramamain/buildsite/image/image_nofound.png', w: '320', h: '240', isFound: false };
	}
},

getSizeOpt: function(ActW, ActH, OptW, OptH)
{
	var testH = Math.round((OptW / ActW) * ActH);
	var testW = Math.round((OptH / ActH) * ActW);

	if(testH > OptH){ 
		OptW = testW; 
	}
	else{
		OptH = testH; 
	}

	return { w: OptW, h: OptH };
},

remove: function(Nom, CallBack)
{
	delete this.List[Nom];

	$.ajax({
		type: 'POST',
		url: pathBuildsite+'image',
		data: { remove: Nom },
		dataType: 'json',
		success: function(response){
			if(Ot.isFonc(CallBack)){
				CallBack();
			}

			GPage.change('reload');
		},
		error: function(rs, e) {
			alert('Erreur : ' + e);
		},
	});
}

};


var GDrag = {

data: {},

start: function(Obj, event, CallBack, BlockObj)
{
	Ot.cancelEvent(event);

	if(!this.data.Obj)
	{
		var DragGhost = document.createElement('div');
		DragGhost.style.height = Obj.offsetHeight+'px';
		DragGhost.id = 'DragGhost';
		DragGhost.className = 'DragGhost';

		var Parent = Obj.parentNode;
		var left = Ot.getNumberOfObjPropr(Obj, 'padding-left');
		var right = Ot.getNumberOfObjPropr(Obj, 'padding-right');
		var MousePosition = Ot.getMousePosition(event);

		Obj.style.width = (Obj.offsetWidth - left - right)+'px';
		Obj.style.position = 'absolute';
		Obj.style.zIndex = 3;
		Obj.style.cursor = 'move';
		Obj.style.backgroundColor = '#d0de9c';
		Ot.setOpacity(Obj, 0.7);
		Parent.insertBefore(DragGhost, Obj.nextSibling);

		var List = [];
		var DivList = Parent.childNodes;
		for(var i = 0; i < DivList.length; i++)
		{
			if(Ot.hasClass(DivList[i], 'Drag') && DivList[i].id != 'DragGhost' && DivList[i] != Obj) //ciblage des blocks deplacables
			{
				List.push(DivList[i]);
			}
		}

		this.data.Obj = Obj;
		this.data.dY = MousePosition.y - Obj.offsetTop + Parent.scrollTop;
		this.data.List = List;
		this.data.DragGhost = DragGhost;
		this.data.CallBack = CallBack;
		this.data.BlockObj = BlockObj;

		if(BlockObj){
			GBlock.startUseBlock(BlockObj);
		}

		GBlock.setProtect('block', 'move');

		Ot.addEvent(document, 'mousemove', GDrag.move);
		Ot.addEvent(document, 'mouseup', GDrag.stop);
	}
},

move: function(event)
{
	Ot.cancelEvent(event);

	var List = GDrag.data.List;
	var Obj = GDrag.data.Obj;
	var DragGhost = GDrag.data.DragGhost;
	var Parent = Obj.parentNode;
	var MousePosition = Ot.getMousePosition(event);
	var Top = MousePosition.y - GDrag.data.dY + Parent.scrollTop;
	Top = (Top < -10) ? -10 : Top; 

	Obj.style.top = Top + 'px';

	for(var i = 0; i < List.length; i++)
	{
		var DragAct = List[i];
		var DragActTopMid = DragAct.offsetTop + (DragAct.offsetHeight) / 2;

		if(Ot.isBetween(Obj.offsetTop, DragActTopMid, Obj.offsetTop + Obj.offsetHeight))
		{
			if(!DragAct.nextSibling){ // fin
				Parent.appendChild(DragGhost);
			}
			else if(DragAct.nextSibling.id == 'DragGhost'){
				Parent.insertBefore(DragGhost, DragAct);
			}
			else{
				Parent.insertBefore(DragGhost, DragAct.nextSibling);
			}
			break;
		}
	}
},

stop: function()
{
	Ot.stopEvent(document ,'mousemove', GDrag.move);
	Ot.stopEvent(document, 'mouseup', GDrag.stop);

	GBlock.setProtect('none');

	var Obj = GDrag.data.Obj;
	var DragGhost = GDrag.data.DragGhost;

	new Fx(Obj, { From: Obj.offsetTop, To: DragGhost.offsetTop, Mode: 'top', duree: 150, CallBack: function()
	{
		Obj.style.width = '';
		Obj.parentNode.replaceChild(Obj, DragGhost);
		Obj.style.position = '';
		Obj.style.top = '';
		Obj.style.cursor = '';
		Obj.style.backgroundColor = '';
		Ot.setOpacity(Obj, 1);
		Obj.style.zIndex = '';

		if(GDrag.data.BlockObj){
			GBlock.stopUseBlock();
		}

		if(Ot.isFonc(GDrag.data.CallBack)){
			GDrag.data.CallBack();
		}

		GDrag.data = {};
	}});
}

};


var GModule = {

List: {},
ClassList: {},
LoadList: {},

addBlockNew: function(Type)
{
	switch(Type)
	{
		case 'Galerie':
		GModule.addBlock({ T: 'ModuleGalerie', V: { Type: "MilkBox", ImageList: [] }, P: [100, 100, 0] }, 'addByUser');
		break;

		case 'Map':
		CadPrompt.open('Nouveau Plan', 'Entrée ici le titre du nouveau plan', '', function(Var)
		{
			GModule.addBlock({ T: 'ModuleMap', V : [Var, 0, 0, 4, "Plan", 47.219568, 1.582031, ""], P: [350, 100, 0] }, 'addByUser');
		});

		case 'Tab':
		CadPrompt.open('Nouveau Tableau', 'Entrée ici le titre du nouveau tableau', '', function(Var)
		{
			if(Var == ''){
				Var = 'Titre';
			}

			GModule.addBlock({ T: 'ModuleTab', V: { Titre: Var, Col1: ["Forfaits","","", ""], Col2: ["Tarifs"," €"," €"," €"], Len: [50, 10] }, P: [150, 100, 0] }, 'addByUser');
		});
		break;

		case 'Form':
		CadPrompt.open('Nouveau Formulaire', 'Entrée ici votre adresse email', '', function(Var)
		{
			GModule.addBlock({ T: 'ModuleForm', V: { "email": Var, "ChampList": [["text","Nom",1], ["email","Mon adresse email",1], ["text","Sujet",1], ["textarea","Message",1]] }, P: [400, 100, 0] }, 'addByUser');
		});
		break;
	}
},

addBlock: function(Block, Mode)
{
	var Id = Ot.getRandId('Module');
	var Con = '<div id="'+Id+'"><div class="BlockVide">Chargement du module en cours...</div></div>';
	var Type = Block.T.substring(6, Block.T.length) ;

	var BlockObj = GBlock.add(Con, '', Block, Mode);

	this.List[Id] = Ot.CloneObjet(Block);
	this.List[Id].BlockObj = BlockObj;
	this.List[Id].BlockHeadOption = GBlock.getBlockHeadOption(BlockObj);
	this.List[Id].ModuleObj = document.getElementById(Id);

	this.loadScript(Type, function()
	{
		var Module = new GModule.ClassList[Type].Module();

		GModule.List[Id] = Ot.CombineHash(Module, GModule.List[Id]);

		GModule.List[Id].initi();
	});
},

loadScript: function(Type, CallBack)
{
	if(!this.LoadList[Type]) //Si pas deja charger
	{
		this.LoadList[Type] = {};
		this.LoadList[Type].Etat = 'Chargement';
		this.LoadList[Type].CallBack = [CallBack];
		this.LoadList[Type].Script = {};

		if(Type == 'Map'){
			this.addFile(Type, 'Script', 'map/map.js');
			this.addFile(Type, 'Style', 'map/map.css');
		}
		else if(Type == 'Tab'){
			this.addFile(Type, 'Script', 'tab/tab.js');
			this.addFile(Type, 'Style', 'tab/tab.css');
		}
		else if(Type == 'Form'){
			this.addFile(Type, 'Script', 'form/form.js');
			this.addFile(Type, 'Style', 'form/form.css');
		}
		else if(Type == 'Galerie'){
			this.addFile(Type, 'Style', 'galerie/galerie.css');
			this.addFile(Type, 'Script', 'galerie/galerie.js');
		}
	}
	else{
		this.LoadList[Type].CallBack.push(CallBack);
		this.actLoadEtat(Type);
	}
},

addFile: function(Type, Mode, Url)
{
	var pathModule = '/bundles/salonramamain/buildsite/module/';

	if(Mode == 'Style')
	{
		var Style = Ot.addStyle(document);
		Style.href = pathModule+Url;
	}
	else if(Mode == 'Script')
	{
		var Script = Ot.addScript(document);
		Script.src = pathModule+Url;

		this.LoadList[Type].Script[Url] = 0; //En chargement
	}
},

ScriptCharger: function(Type, Url)
{
	this.LoadList[Type].Script[Url] = 1;
	this.actLoadEtat(Type);
},

actLoadEtat: function(Type)
{
	var EtatGeneral = 0;

	if(this.LoadList[Type].Etat == 'Chargement')
	{
		var Script = this.LoadList[Type].Script;
		
		for(var i in Script)
		{
			if(Script[i] == 0){
				EtatGeneral += 1;
			}
		}
	}

	if(EtatGeneral == 0) //Tout les scripts sont chargé
	{
		this.LoadList[Type].Etat = 'Charger';

		var CallBack = this.LoadList[Type].CallBack;

		for(var i = 0; i < CallBack.length ;i++)
		{
			if(Ot.isFonc(CallBack[i])){
				CallBack[i]();
			}
		}

		this.LoadList[Type].CallBack = [];
	}
},

getSave: function(ModuleObj, Type)
{
	Type = Type.substring(6, Type.length);

	try{
		return this.ClassList[Type].getSave(ModuleObj);
	}
	catch(e){
		return this.List[ModuleObj.id].V;
	}

}

};


var bsCadreLoad = {

isInit: false,
cadre: null,

init: function(){
	this.cadre = $(document.createElement('div'));
	this.cadre.html('<i class="icon-spinner icon-spin"></i>Chargement en cours...');
	this.cadre.addClass('frame-small frame-small-blue');
	this.cadre.attr('id', 'bsCadreLoad');

	$('body').append(this.cadre);

	this.isInit = true;
},

show: function()
{
	if(!this.isInit)
	{
		this.init();
	}

	this.cadre.stop();
	this.cadre.show();
},

hide: function()
{
	this.cadre.hide();
}

};

function isset(Var)
{
	if(typeof Var != 'undefined'){
		return Var;
	}
	else{
		return 'Text';
	}
}