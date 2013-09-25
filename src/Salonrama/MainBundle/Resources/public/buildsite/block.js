/* JavaScript, By Olivier (olivier.tassinari@gmail.com)
-----------------------*/

var GBlock = {

List: {},
InteList: {},
UseAct: '',
OverAct: '',
EventOutOver: {},

load: function(Page)
{
	var ListAct = this.List[Page];

	this.EventOutOver = {};
	this.UseAct = '';
	this.OverAct = '';
	this.InteList = {};
	GWys.reset();

	for(var i = 0, l = ListAct.length; i < l ; i++)
	{
		this.loadBlock(ListAct[i]);
	}

	this.loadInte();
},

loadBlock: function(Block)
{
	if(Block.T == 'Wys')
	{
		GWys.addBlock(Block, 'Initi');
	}
	else if(Block.T == 'Html')
	{
		addBlockHtml(Block, 'Initi');
	}
	else if(Block.T == 'Image')
	{
		addBlockImage(Block, 'Initi');
	}
	else if(Block.T.substring(0, 4) == 'Inte')
	{
		this.addBlockInte(Block);
	}
	else if(Block.T == 'BlockColone')
	{
		var ThemeBlockList = document.getElementById('ThemeBlockList');

		this.loadBlock(Block.V[0]);
		this.loadBlock(Block.V[1]);

		if(ThemeBlockList.lastChild.previousSibling)
		{
			if(ThemeBlockList.lastChild.previousSibling && this.getBlockType(ThemeBlockList.lastChild.previousSibling) == Block.V[0].T && this.getBlockType(ThemeBlockList.lastChild) == Block.V[1].T)
			{
				this.addBlockColone();
			}
		}
	}
	else
	{
		GModule.addBlock(Block, 'Initi');
	}
},

addBlockInte: function(Block)
{
	var Id = Ot.getRandId('Module');
	this.add('<div id="'+Id+'"></div>', '', Block, 'Initi');

	this.InteList[Id] = Block;
},

loadInte: function()
{
	if(Ot.getArrayLength(this.InteList) > 0)
	{
		var T = [];
		for(var i in this.InteList)
		{
			T.push(this.InteList[i].T);
		}
		T = Ot.removeDoublonArray(T);

		$.ajax({
			type: "POST",
			url: pathBuildsite+"theme/get_inte",
			data: { 'theme': GTheme.Act, 'inte': JSON.stringify(T) },
			dataType: "json",
			success: function(response){
				for(var i in GBlock.InteList)
				{
					var InteAct = GBlock.InteList[i];
					var Html = response.text[InteAct.T];
					var InteObj = document.getElementById(i);
					var DataNbr = 0;
					var WysNbr = 0;
					var WysList = [];

					Html = Html.replace(/(><div class="InteImage"><\/div><)/g, function()
					{
						var Id = Ot.getRandId('Module');
						var ImageInfo = GImage.getInfo(InteAct.V.Image);

						var BlockHeadOption = GBlock.getBlockHeadOption(GBlock.getBlockObj(InteObj));
						BlockHeadOption.innerHTML = '<button type="button" class="button-small button-small-blue" onclick="CadImage.open(\''+Id+'\')"><i class="icon-pencil"></i>Changer d\'image</button>';

						return '><div id="'+Id+'" class="InteImage"><img src="'+ImageInfo.src+'" onclick="CadImage.open(\''+Id+'\')" title="Changer d\'image" width="100%" alt="photo"/></div><';
					});

					Html = Html.replace(/(>Wys<)/g, function()
					{
						WysNbr++;

						var Id = Ot.getRandId('Module');
						var Html = isset(InteAct.V.Wys[WysNbr-1]);

						GWys.List[Id] = { Etat: 'stage0', DefHtml: Html };
						WysList.push(Id);

						return '><iframe id="'+Id+'" src="/wys.html" class="BlockWHFull" frameborder="0"></iframe><';
					});

					Html = Html.replace(/(>Data<)/g, function()
					{
						DataNbr++;

						return '><span class="GData" title="Modifier ce texte" onclick="GData.open(this)">'+isset(InteAct.V.Data[DataNbr-1])+'</span><';
					});

					InteObj.innerHTML = Html;

					for(var j = 0; j < WysList.length; j++)
					{
						(function(z){
							var Id = WysList[z];
							Ot.addEvent(document.getElementById(Id), 'load', function(){ GWys.load(Id, 'Inte'); });
						})(j);
					}

					GData.initi(InteObj);
				}
			},
			error: function(rs, e) {
			},
		});
	}
},

add: function(Con, Option, Block, Mode)
{
	var ThemeBlockList = document.getElementById('ThemeBlockList');
	var BlockListWidthMax = GTheme.BlockListWidth;
	var Left = (Block.P && Block.P[2]) ? Math.round(BlockListWidthMax * (Block.P[2]/100)) : 0;
	var Width = (Block.P && Block.P[1]) ? Math.round(BlockListWidthMax * (Block.P[1]/100)) : BlockListWidthMax;
	Width = this.getWidthOpt(Width, Left);

	if(ThemeBlockList.firstChild && ThemeBlockList.firstChild.className == 'BlockVide'){
		ThemeBlockList.innerHTML = '';
	}

	var BlockObj = document.createElement('div');
	BlockObj.id = Ot.getRandId('Block');
	BlockObj.className = 'Block BlockEdit';
	BlockObj.innerHTML = '<div class="BlockHead">'+
							'<div class="BlockHeadMove" title="Déplacer cet élément"><div class="CadClose" title="Supprimer cet élément"></div></div>'+
							'<div class="BlockHeadOption">'+Option+'</div>'+
						 '</div>'+
						 '<div class="BlockCon">'+Con+'</div>'+
						 '<div class="BlockProtect"></div>'+
						 '<div class="BlockResize" title="Redimensionner cet élément"></div>'+
						 '<div class="BlockType'+Block.T+'"></div>';

	var BlockHeadMove = BlockObj.firstChild.firstChild;
	var BlockCon = this.getBlockCon(BlockObj);
	var BlockResize = this.getBlockResize(BlockObj);

	BlockHeadMove.onmousedown = function(e){ e = e || window.event; GBlockDrag.start(e, BlockObj); };
	BlockHeadMove.firstChild.onclick = function(){ GBlock.remove(BlockObj); };
	BlockResize.onmousedown = function(e){ e = e || window.event; GBlockResize.start(e, BlockObj); };

	BlockObj.style.width = Width+'px';
	BlockObj.style.left = Left+'px';
	BlockCon.style.height = '20px';

	if(Mode == 'addByUser' && ThemeBlockList.firstChild)
	{
		var CreatorCon = document.getElementById('CreatorCon');
		if(CreatorCon.scrollTop > 0){
			CreatorCon.scrollTop = 0;
		}

		ThemeBlockList.insertBefore(BlockObj, ThemeBlockList.firstChild);
	}
	else{
		ThemeBlockList.appendChild(BlockObj);
	}

	var Height = (Block.P && Block.P[0]) ? Block.P[0] : BlockCon.lastChild.offsetHeight;
	Height = this.getHeightOpt(Height);

	if(Mode == 'addByUser'){
		new Fx(BlockCon, { From: 20, To: Height, Mode: 'height' });
	}
	else{
		BlockCon.style.height = Height+'px';
	}

	Ot.addEvent(BlockObj, 'mouseenter', function(){ GBlock.onOutOver(BlockObj, 'over'); });
	Ot.addEvent(BlockObj, 'mouseleave', function(){ GBlock.onOutOver(BlockObj, 'out'); });

	return BlockObj;
},

addBlockColone: function()
{
	var ThemeBlockList = document.getElementById('ThemeBlockList');

	var BlockColone = document.createElement('div');
	BlockColone.className = 'BlockColone';
	BlockColone.appendChild(ThemeBlockList.lastChild);
	BlockColone.appendChild(ThemeBlockList.lastChild);
	ThemeBlockList.appendChild(BlockColone);


	/* Ajustement */

	BlockColone.style.height = GBlock.getColoneHeightOpt(BlockColone) + 'px';

	var BlockObj1Left = BlockColone.firstChild.offsetLeft;
	var BlockObj2Left = BlockColone.lastChild.offsetLeft;

	if(BlockObj1Left < BlockObj2Left){
		var BlockObj = BlockColone.firstChild;
		var BlockObjWidthMax = BlockObj2Left - BlockObj1Left - 4;
	}
	else{
		var BlockObj = BlockColone.lastChild;
		var BlockObjWidthMax = BlockObj1Left - BlockObj2Left - 4;
	}

	if(BlockObj.offsetWidth > BlockObjWidthMax){
		BlockObj.style.width = BlockObjWidthMax+'px';
	}
},

onOutOver: function(BlockObj, Mode)
{
	if(this.OverAct != '' && this.OverAct != BlockObj && this.UseAct == '')
	{
		this.setStyleOutOver(this.OverAct, 'out');
		this.setEventOutOver(this.OverAct, 'out');
	}

	if(Mode == 'out'){
		this.OverAct = '';
	}
	else if(Mode == 'over'){
		this.OverAct = BlockObj;
	}

	if(this.UseAct == '')
	{
		this.setStyleOutOver(BlockObj, Mode);
		this.setEventOutOver(BlockObj, Mode);
	}
},

startUseBlock: function(BlockObj)
{
	GBlock.UseAct = BlockObj;
},

stopUseBlock: function()
{
	if(this.UseAct != '')
	{
		if(this.OverAct == '')
		{
			this.setStyleOutOver(this.UseAct, 'out');
			this.setEventOutOver(this.UseAct, 'out');
		}
		else
		{
			if(this.OverAct != this.UseAct)
			{
				this.setStyleOutOver(this.UseAct, 'out');
				this.setEventOutOver(this.UseAct, 'out');
				this.setStyleOutOver(this.OverAct, 'over');
				this.setEventOutOver(this.OverAct, 'over');
			}
		}

		this.UseAct = '';
	}
},

setStyleOutOver: function(BlockObj, Mode)
{
	var BlockHead = BlockObj.firstChild;
	var BlockCon = this.getBlockCon(BlockObj);
	var BlockResize = this.getBlockResize(BlockObj);

	if(Mode == 'out')
	{
		BlockCon.style.borderColor = 'transparent';
		BlockHead.style.display = 'none';
		BlockResize.style.display = 'none';
	}
	else if(Mode == 'over')
	{
		BlockCon.style.borderColor = '#5D93DB';
		BlockHead.style.display = 'block';
		BlockResize.style.display = 'block';

		this.setBlockOptionHeight(BlockObj);
	}
},

addEventOutOver: function(BlockObj, Mode, CallBack)
{
	if(!this.EventOutOver[BlockObj.id])
	{
		this.EventOutOver[BlockObj.id] = [];
	}

	this.EventOutOver[BlockObj.id].push({ Mode: Mode, CallBack: CallBack });
},

setEventOutOver: function(BlockObj, Mode)
{
	if(this.EventOutOver[BlockObj.id])
	{
		var EventList = this.EventOutOver[BlockObj.id];

		for(var i = 0; i < EventList.length; i++)
		{
			if(EventList[i].Mode == Mode)
			{
				EventList[i].CallBack();
			}
		}
	}
},

getBlockObjOver: function(MousePosition)
{
	var BlockObjList = Ot.getElementsByClassName('Block', 'div', document.getElementById('ThemeBlockList'));
	var BlockObjOver = false;

	for(var i = 0; i < BlockObjList.length; i++)
	{
		var BlockObjAct = BlockObjList[i];
		var ObjPosition = Ot.getObjPosition(BlockObjAct);
		var Height = BlockObjAct.offsetHeight;

		if(BlockObjAct.firstChild.style.display == 'block'){  // Head
			ObjPosition.y -= BlockObjAct.firstChild.offsetHeight;
			Height += BlockObjAct.firstChild.offsetHeight;
		}

		if(Ot.isBetween(ObjPosition.y, MousePosition.y, ObjPosition.y+Height))
		{
			if(Ot.isBetween(ObjPosition.x, MousePosition.x, ObjPosition.x+BlockObjAct.offsetWidth))
			{
				BlockObjOver = BlockObjAct;
				break;
			}
		}
	}

	return BlockObjOver;
},

setBlockOptionHeight: function(BlockObj)
{
	var BlockHead = BlockObj.firstChild;
	var OptionHeight = BlockHead.lastChild.offsetHeight;

	if(OptionHeight > 26){
		BlockHead.style.top = (-18 - OptionHeight)+'px';
	}
	else{
		BlockHead.style.top = '-18px';
	}
},

getBlockHeadOption: function(BlockObj)
{
	return BlockObj.firstChild.lastChild;
},

getBlockCon: function(BlockObj)
{
	return BlockObj.firstChild.nextSibling;
},

getBlockProtect: function(BlockObj)
{
	return BlockObj.firstChild.nextSibling.nextSibling;
},

getBlockResize: function(BlockObj)
{
	return BlockObj.lastChild.previousSibling;
},

getBlockObj: function(Obj)
{
	var element = Obj;
	var BlockObj = false;

	while(element)
	{
		if(Ot.hasClass(element, 'Block')){
			BlockObj = element;
			element = false;
		}
		else{
			element = element.parentNode;
		}
	}

	return BlockObj;
},

getBlockType: function(BlockObj)
{
	var Type = BlockObj.lastChild.className;

	return Type.substring(9, Type.length);
},

getHeightOpt: function(Height)
{
	return (Height < 40) ? 40 : Height;
},

getWidthOpt: function(Width, Left)
{
	var BlockListWidthMax = GTheme.BlockListWidth;

	Width = (Width < 100) ? 100 : Width;
	Width = (Width > BlockListWidthMax - Left) ? BlockListWidthMax - Left : Width;

	return Width;
},

getColoneHeightOpt: function(BlockColone)
{
	var Height = 0;

	var BlockObjList = BlockColone.childNodes;
	for(var i = 0; i < BlockObjList.length; i++)
	{
		Height = Math.max(Height, BlockObjList[i].offsetHeight);
	}

	return Height;
},

getBlockOtherOfColone: function(BlockObj)
{
	if(BlockObj.nextSibling){
		return BlockObj.nextSibling;
	}
	else{
		return BlockObj.previousSibling;
	}
},

isAChildOfColone: function(BlockObj)
{
	if(BlockObj.parentNode.className == 'BlockColone'){
		return BlockObj.parentNode;
	}
	else{
		return false;
	}
},

resizeBlockCon: function(BlockCon)
{
	var Height = BlockCon.firstChild.offsetHeight;
	Height = this.getHeightOpt(Height);

	BlockCon.style.height = Height+'px';
},

remove: function(BlockObj)
{
	this.setStyleOutOver(BlockObj, 'out');

	var IframeList = BlockObj.getElementsByTagName('iframe');
	for(var i = 0; i < IframeList.length; i++)
	{
		if(GWys.isWys(IframeList[i]))
		{
			GWys.remove(IframeList[i]);
		}
	}

	new Fx(BlockObj, { From: 1, To: 0.2, Mode: 'opacity', CallBack: function()
	{
		var ThemeBlockList = document.getElementById('ThemeBlockList');
		var BlockColone = GBlock.isAChildOfColone(BlockObj);

		BlockObj.parentNode.removeChild(BlockObj);

		if(BlockColone != false)
		{
			GWys.saveWysOfBlock(BlockColone.firstChild);
			BlockColone.firstChild.style.position = 'relative';
			ThemeBlockList.replaceChild(BlockColone.firstChild, BlockColone);
		}

		if(ThemeBlockList.childNodes.length == 0){
			ThemeBlockList.innerHTML = '<div class="BlockVide">Cette page est vide.</div>';
		}
	}});
},

setProtect: function(Display, Cursor)
{
	var ThemeBlockList = Ot.getElementsByClassName('Block', 'div', document.getElementById('ThemeBlockList'));

	for(var i = 0; i < ThemeBlockList.length; i++)
	{
		var ProtectAct = this.getBlockProtect(ThemeBlockList[i]);

		ProtectAct.style.height = ThemeBlockList[i].offsetHeight+'px';
		ProtectAct.style.display = Display;

		if(Cursor){
			ProtectAct.style.cursor = Cursor;
		}
	}
},

getBlockLeft: function(BlockObj)
{
	var Left = Ot.getObjPosition(BlockObj).x - Ot.getObjPosition(document.getElementById('ThemeBlockList')).x;

	if(CClient[0] == 'IExploreur'){
		Left += 1;
	}

	return Left;
},

getSave: function()
{
	var ThemeBlockList = document.getElementById('ThemeBlockList');
	var BlockList = [];

	var BlockObjList = ThemeBlockList.childNodes;
	for(var i = 0; i < BlockObjList.length; i++)
	{
		if(Ot.hasClass(BlockObjList[i], 'Block') || BlockObjList[i].className == 'BlockColone')
		{
			this.getSaveBlock(BlockList, BlockObjList[i]);
		}
	}

	return BlockList;
},

getSaveBlock: function(BlockList, BlockObj)
{
	var BlockCon = this.getBlockCon(BlockObj);
	var ModuleObj = BlockCon.firstChild;
	var Type = this.getBlockType(BlockObj);
	var V = '';

	if(Type == 'Wys')
	{
		V = GWys.getSave(ModuleObj);
	}
	else if(Type == 'Html')
	{
		V = CadHtml.getSave(ModuleObj);
	}
	else if(Type == 'Image')
	{
		V = CadImage.getSave(ModuleObj);
	}
	else if(Type.substring(0, 4) == 'Inte')
	{
		V = this.getSaveInte(ModuleObj);
	}
	else if(BlockObj.className == 'BlockColone')
	{
		Type = 'BlockColone';
		V = [];

		this.getSaveBlock(V, BlockObj.firstChild);
		this.getSaveBlock(V, BlockObj.lastChild);

		BlockList.push({'T': Type, 'V': V});
	}
	else if(Type.substring(0, 6) == 'Module')
	{
		V = GModule.getSave(ModuleObj, Type);		
	}

	if(Type != 'BlockColone')
	{
		var ThemeBlockList = document.getElementById('ThemeBlockList');
		var BlockListWidthMax = GTheme.BlockListWidth;

		var Left = Math.round((this.getBlockLeft(BlockObj) / BlockListWidthMax) * 100);		
		var Width = Math.round((BlockObj.offsetWidth / BlockListWidthMax) * 100);
		var Height = BlockCon.offsetHeight - 5; //Border + padding
		var P = [Height, Width, Left];

		BlockList.push({'T': Type, 'V': V, 'P': P});
	}
},

getSaveInte: function(ModuleObj)
{
	var V = {};
	var DataList = [];
	var WysList = [];
	var Image = '';

	var IframeList = ModuleObj.getElementsByTagName('iframe');
	for(var i = 0; i < IframeList.length; i++)
	{
		WysList.push(GWys.getSave(IframeList[i]));
	}

	var DataObjList = Ot.getElementsByClassName('GData', 'span', ModuleObj);
	for(var j = 0; j < DataObjList.length; j++)
	{
		if(DataObjList[j].onclick)
		{
			DataList.push(DataObjList[j].innerHTML);
		}
	}

	var ImageListList = Ot.getElementsByClassName('InteImage', 'div', ModuleObj);
	for(var y = 0; y < ImageListList.length; y++)
	{
		Image = CadImage.getSave(ImageListList[y]);
	}


	if(WysList.length != 0){
		V.Wys = WysList;
	}
	if(DataList.length != 0){
		V.Data = DataList;
	}
	if(Image != ''){
		V.Image = Image;
	}

	return V;
}

};

var GBlockResize = {

data: {},

start: function(event, BlockObj)
{
	Ot.cancelEvent(event);

	this.data.BlockObj = BlockObj;
	this.data.BlockCon = GBlock.getBlockCon(BlockObj);
	this.data.BlockProtect = GBlock.getBlockProtect(BlockObj);	
	this.data.left = GBlock.getBlockLeft(BlockObj);
	this.data.BlockColone = GBlock.isAChildOfColone(BlockObj);

	GBlock.setProtect('block', 'se-resize');
	GBlock.startUseBlock(BlockObj);

	Ot.addEvent(document, 'mousemove', GBlockResize.move);
	Ot.addEvent(document, 'mouseup', GBlockResize.stop);
},

move: function(event)
{
	Ot.cancelEvent(event);

	var data = GBlockResize.data;
	var BlockObj = data.BlockObj;
	var ObjPosition = Ot.getObjPosition(BlockObj);
	var MousePosition = Ot.getMousePosition(event);
	var BlockListWidthMax = GTheme.BlockListWidth;

	var Height = MousePosition.y - ObjPosition.y + 3;
	Height = GBlock.getHeightOpt(Height);

	data.BlockCon.style.height = Height+'px';
	data.BlockProtect.style.height = Height+'px';


	var Width = MousePosition.x - ObjPosition.x + 6;
	Width = GBlock.getWidthOpt(Width, data.left);

	if(data.BlockColone != false)
	{
		data.BlockColone.style.height = GBlock.getColoneHeightOpt(data.BlockColone)+'px';

		var BlockOther = GBlock.getBlockOtherOfColone(BlockObj);
		var BlockOtherLeft = BlockOther.offsetLeft;
		var BlockObjLeft = BlockObj.offsetLeft;

		if(BlockObjLeft < BlockOtherLeft){ //  a gauche
			var WidthMax = BlockOtherLeft - BlockObjLeft - 4;
		}
		else{ // a droite
			var WidthMax = BlockListWidthMax - BlockObjLeft;
		}

		Width = (Width > WidthMax) ? WidthMax : Width;
	}

	BlockObj.style.width = Width+'px';

	GBlock.setBlockOptionHeight(BlockObj);
},

stop: function()
{
	Ot.stopEvent(document, 'mousemove', GBlockResize.move);
	Ot.stopEvent(document, 'mouseup', GBlockResize.stop);

	GWys.resizeInte(GBlockResize.data.BlockCon);

	GBlock.stopUseBlock();

	GBlockResize.data = {};
	GBlock.setProtect('none');
}

};



var BlockGhost = document.createElement('div');
BlockGhost.id = 'BlockGhost';

var GBlockDrag = {

data: {},

start: function(event, BlockObj)
{
	var Target = Ot.getTarget(event);

	if(Target.className != 'CadClose')
	{
		Ot.cancelEvent(event);

		var ThemeBlockList = document.getElementById('ThemeBlockList');

		var BlockObjList = [];
		var DivList = ThemeBlockList.getElementsByTagName('div');
		for(var i = 0; i < DivList.length; i++)
		{
			if((Ot.hasClass(DivList[i], 'Block') || DivList[i].className == 'BlockColone') && DivList[i] != BlockObj){
				BlockObjList.push(DivList[i]);
			}
		}

		GWys.saveWysOfBlock(BlockObj);

		var IframeList = BlockObj.getElementsByTagName('iframe');
		if(IframeList[0] && !GWys.isWys(IframeList[0]) && typeof GModule.List[IframeList[0].id] != 'undefined')
		{
			GModule.List[IframeList[0].id].V = GModule.ClassList['Map'].getSave(IframeList[0]);
		}

		var BlockListWidthMax = GTheme.BlockListWidth;
		var ObjPosition = Ot.getObjPosition(BlockObj);
		var MousePosition = Ot.getMousePosition(event);

		this.data.BlockObj = BlockObj;
		this.data.BlockObjList = BlockObjList;
		this.data.dX = MousePosition.x - ObjPosition.x - 3;
		this.data.dY = MousePosition.y - ObjPosition.y + 134 + 5 + 3;
		this.data.Colone = false;

		var BlockColone = GBlock.isAChildOfColone(BlockObj);
		if(BlockColone != false)
		{
			var BlockOther = GBlock.getBlockOtherOfColone(BlockObj);
			var BlockOtherLeft = BlockOther.offsetLeft;
			var BlockObjLeft = BlockObj.offsetLeft;

			if(BlockObjLeft < BlockOtherLeft) //  a gauche
			{
				var Left = 0;
				var Width = BlockOtherLeft - 8;
			}
			else //  a droite
			{
				var Left = BlockOther.offsetWidth + BlockOther.offsetLeft + 4;
				var Width = BlockListWidthMax - Left - 4;
			}

			BlockGhost.style.left = Left + 'px';
			BlockGhost.style.width = Width + 'px';
			BlockGhost.style.height = (BlockObj.offsetHeight - 4) + 'px';
			BlockColone.insertBefore(BlockGhost, BlockObj);

			ThemeBlockList.appendChild(BlockObj);
			
			this.data.Colone = BlockColone;
		}
		else
		{
			BlockGhost.style.left = '';
			BlockGhost.style.height = (BlockObj.offsetHeight - 4) + 'px';
			BlockGhost.style.width = (BlockListWidthMax - 4) + 'px';
			ThemeBlockList.insertBefore(BlockGhost, BlockObj);
		}

		Ot.addClass(BlockObj, 'BlockDrag');

		BlockObj.style.position = 'absolute';
		var Left = MousePosition.x - this.data.dX;
		var	Top = MousePosition.y - this.data.dY + document.getElementById('CreatorCon').scrollTop;
		Top = (Top < 0) ? 0 : Top;
		Ot.setLeftTop(BlockObj, Left, Top);		

		GBlock.setProtect('block', 'move');
		GBlock.startUseBlock(BlockObj);

		Ot.addEvent(document, 'mousemove', GBlockDrag.move);
		Ot.addEvent(document, 'mouseup', GBlockDrag.stop);
	}
},

move: function(event)
{
	Ot.cancelEvent(event);

	var data = GBlockDrag.data;
	var MousePosition = Ot.getMousePosition(event);

	var Left = MousePosition.x - data.dX;
	var	Top = MousePosition.y - data.dY + document.getElementById('CreatorCon').scrollTop;
	Top = (Top < 0) ? 0 : Top;
	Ot.setLeftTop(data.BlockObj, Left, Top);

	var ThemeBlockList = document.getElementById('ThemeBlockList');
	var BlockListWidthMax = GTheme.BlockListWidth;
	var BlockObj = data.BlockObj;
	var BlockObjLeftMid = Left + (BlockObj.offsetWidth) / 2;
	var BlockObjTopMid = Top + (BlockObj.offsetHeight) / 2;
	var ThemeBlockListLeft = Ot.getObjPosition(ThemeBlockList).x;

	if(data.Colone == false)
	{
		for(var i = 0; i < data.BlockObjList.length; i++)
		{
			var BlockAct = data.BlockObjList[i];
			var BlockActTopMid = BlockAct.offsetTop + (BlockAct.offsetHeight) / 2;

			if(Ot.isBetween(Top, BlockActTopMid, Top + BlockObj.offsetHeight))
			{
				var ThemeBlockListLeftExt = ThemeBlockListLeft + BlockListWidthMax;
				var BlockActLeft = Ot.getObjPosition(BlockAct).x;
				var BlockActLeftExt = BlockActLeft + BlockAct.offsetWidth;

				if(Ot.isBetween(ThemeBlockListLeft, BlockObjLeftMid, BlockActLeft)) //  a gauche
				{
					var BlockGhostLeft = 0;
					var BlockGhostWidth = BlockActLeft - ThemeBlockListLeft - 8;
				}
				else if(Ot.isBetween(BlockActLeftExt, BlockObjLeftMid, ThemeBlockListLeftExt)) //  a droite
				{
					var BlockGhostLeft = BlockActLeftExt - ThemeBlockListLeft + 4;
					var BlockGhostWidth = BlockListWidthMax - BlockGhostLeft - 4;
				}

				if(BlockGhostWidth && BlockGhostWidth > 100)
				{
					var BlockColone = document.createElement('div');
					BlockColone.className = 'BlockColone';

					ThemeBlockList.replaceChild(BlockColone, BlockAct);
					BlockColone.appendChild(BlockAct);
					BlockColone.appendChild(BlockGhost);
					BlockColone.style.height = GBlock.getColoneHeightOpt(BlockColone) + 'px';

					BlockAct.style.position = 'absolute';
					BlockGhost.style.left = BlockGhostLeft + 'px';
					BlockGhost.style.width = BlockGhostWidth + 'px';

					data.Colone = BlockColone;
				}
				else
				{
					GBlockDrag.replaceNode(BlockGhost, BlockAct);
				}

				break;
			}
		}
	}
	else
	{
		var BlockColone = data.Colone;
		var BlockColoneTop = BlockColone.offsetTop;
		var BlockColoneTopExt = BlockColoneTop + BlockColone.offsetHeight;

		if(!Ot.isBetween(BlockColoneTop, BlockObjTopMid, BlockColoneTopExt)) // OUT
		{
			BlockGhost.style.left = '0px';
			BlockGhost.style.width = (BlockListWidthMax - 4) + 'px';

			if(BlockColoneTop > BlockObjTopMid) //haut
			{
				ThemeBlockList.insertBefore(BlockGhost, BlockColone);
			}
			else //Bas
			{ 
				if(!BlockColone.nextSibling){
					ThemeBlockList.appendChild(BlockGhost);
				}
				else{
					ThemeBlockList.insertBefore(BlockGhost, BlockColone.nextSibling);
				}
			}

			BlockColone.firstChild.style.position = 'relative';
			ThemeBlockList.replaceChild(BlockColone.firstChild, BlockColone);

			GBlockDrag.data.Colone = false;
		}
		else //In
		{
			var BlockOther = GBlock.getBlockOtherOfColone(BlockGhost);
			var BlockOtherLeftMid = ThemeBlockListLeft + BlockOther.offsetLeft + (BlockOther.offsetWidth) / 2;

			if(BlockGhost.offsetLeft < BlockOther.offsetLeft) //  a gauche
			{
				if(BlockObjLeftMid - 5 > BlockOtherLeftMid)  // Passe a droite
				{
					BlockOther.style.left = '0px';
					BlockGhost.style.width = (BlockListWidthMax - BlockOther.offsetWidth - 8) + 'px';
					BlockGhost.style.left = (BlockOther.offsetWidth + 4) + 'px';
				}
			}
			else // a droite
			{
				if(BlockObjLeftMid + 5 < BlockOtherLeftMid) // Passe a gauche
				{
					BlockOther.style.left = (BlockGhost.offsetWidth + BlockOther.offsetLeft + 4) + 'px';
					BlockGhost.style.width = (BlockListWidthMax - BlockOther.offsetWidth - 8) + 'px';
					BlockGhost.style.left = '0px';
				}
			}
		}
	}
},

replaceNode: function(Obj, Ref)
{
	var ThemeBlockList = document.getElementById('ThemeBlockList');

	if(!Ref.nextSibling){ // haut
		ThemeBlockList.appendChild(Obj);
	}
	else if(Ref.nextSibling.id != Obj.id){
		ThemeBlockList.insertBefore(Obj, Ref.nextSibling); //bas
	}
	else{ //bas
		ThemeBlockList.insertBefore(Obj, Ref);
	}
},

stop: function(event)
{
	Ot.stopEvent(document, 'mousemove', GBlockDrag.move);
	Ot.stopEvent(document, 'mouseup', GBlockDrag.stop);

	GBlock.setProtect('none');

	var data = GBlockDrag.data;
	var BlockObj = data.BlockObj;
	var ThemeBlockList = document.getElementById('ThemeBlockList');
	var BlockListWidthMax = GTheme.BlockListWidth;

	if(data.Colone != false)
	{
		var BlockGhostWidth = BlockGhost.offsetWidth;
		var BlockGhostLeft = BlockGhost.offsetLeft;
		var Left = GBlock.getBlockLeft(BlockObj);

		BlockGhost.parentNode.replaceChild(BlockObj, BlockGhost);

		if(BlockGhostWidth < BlockObj.offsetWidth){
			BlockObj.style.width = BlockGhostWidth + 'px';
			GBlock.resizeBlockCon(GBlock.getBlockCon(BlockObj));
			data.Colone.style.height = GBlock.getColoneHeightOpt(data.Colone) + 'px';
		}

		var LeftMax = BlockGhostWidth + BlockGhostLeft - BlockObj.offsetWidth;
		var LeftMin = BlockGhostLeft;
		Left = (Left > LeftMax) ? LeftMax : Left;
		Left = (Left < LeftMin) ? LeftMin : Left;

		BlockObj.style.left = Left + 'px';
		BlockObj.style.position = 'absolute';
		BlockObj.style.top = '0px';
	}
	else
	{
		var Left = GBlock.getBlockLeft(BlockObj);
		var LeftMax = BlockListWidthMax - BlockObj.offsetWidth;
		Left = (Left > LeftMax) ? Left = LeftMax : Left;
		Left = (Left < 0) ? 0 : Left;

		BlockGhost.parentNode.replaceChild(BlockObj, BlockGhost);
		BlockObj.style.left = Left + 'px';
		BlockObj.style.position = 'relative';
		BlockObj.style.top = '0px';
	}

	Ot.removeClass(BlockObj, 'BlockDrag');

	var MousePosition = Ot.getMousePosition(event);
	var BlockObjOver = GBlock.getBlockObjOver(MousePosition);
	if(BlockObjOver == false){
		GBlock.OverAct = '';
	}
	GBlock.stopUseBlock();

	GBlockDrag.data = {};
}

};


function addBlockHtml(Block, Mode)
{
	var Id = Ot.getRandId('Module');
	var Option = '<button type="button" class="button-small button-small-blue" onclick="CadHtml.open(\''+Id+'\')"><i class="icon-angle-right"></i>Modifier le code HTML</button>';
	var Con = '<div id="'+Id+'">'+Block.V+'</div>';

	GBlock.add(Con, Option, Block, Mode);
}

function addBlockImage(Block, Mode)
{
	var Id = Ot.getRandId('Module');
	var ImageInfo = GImage.getInfo(Block.V);

	if(Mode == 'addByUser'){
		Block.P[0] = ImageInfo.h;
	}

	var Option = '<button type="button" class="button-small button-small-blue" onclick="CadImage.open(\''+Id+'\')"><i class="icon-pencil"></i>Changer d\'image</button>';
	var Con = '<div id="'+Id+'" class="ModuleImage"><img src="'+ImageInfo.src+'" onclick="CadImage.open(\''+Id+'\')" title="Changer d\'image" height="100%" alt="photo"/></div>';

	GBlock.add(Con, Option, Block, Mode);
}