/* JavaScript, By Olivier (olivier.tassinari@gmail.com)
-----------------------*/

GModule.ClassList['Tab'] = {

Module: function()
{
},

getTabHtml: function(V)
{
	var BlockListWidthMax = GTheme.BlockListWidth;
	var x = 0;
	var isFirst = true;
	var Col1Width = Math.round((V.Len[0]/100)*BlockListWidthMax);
	var Col2Width = Math.round((V.Len[1]/100)*BlockListWidthMax);
	var R = '<h2 class="ModuleTabTitre">'+V.Titre+'</h2>'+
			'<table class="ModuleTabTable">';

	for(var i = 0; i < V.Col1.length; i++)
	{
		if(isFirst == true)
		{
			isFirst = false;
			var Class = 'ModuleTabColHead ModuleTabCenter';
		}
		else
		{
			if(x == 0){
				var Class = 'ModuleTabCol0';
				x = 1;
			}
			else{
				var Class = 'ModuleTabCol1';
				x = 0;
			}
		}

		R += '<tr class="'+Class+'">'+
				'<td style="width:'+Col1Width+'px;">'+V.Col1[i]+'</td>'+
				'<td style="width:'+Col2Width+'px;" class="ModuleTabCenter">'+V.Col2[i]+'</td>'+
			'</tr>';
	}

	R += '</table>';

	return R;
},

ResizeTab: {},

ResizeStart: function(Module, Col)
{
	var Table = Module.Table;
	var ColWidthMin = Module.getTextWidth(Table.firstChild.childNodes[Col].value);
	var ObjPosition = Ot.getObjPosition(Table);
	var Col1Width = Module.getColWidth(0);

	GModule.ClassList['Tab'].ResizeTab = {
		Module: Module,
		Col: Col,
		ColWidthMin: ColWidthMin,
		TablePosition: ObjPosition,
		Col1Width: Col1Width
	};

	Module.Table.previousSibling.childNodes[Col].firstChild.style.background = '#808080';

	GBlock.setProtect('block', 'w-resize');
	GBlock.startUseBlock(Module.BlockObj);

	Ot.addEvent(document, 'mousemove', this.ResizeMove);
	Ot.addEvent(document, 'mouseup', this.ResizeEnd);
},

ResizeMove: function(event)
{
	var Class = GModule.ClassList['Tab'];
	var MouseLeft = Ot.getMousePosition(event).x;
	var TableLeft = Class.ResizeTab.TablePosition.x;
	var Module = Class.ResizeTab.Module;

	Ot.cancelEvent(event);

	if(CClient[0] == 'IExploreur'){
		var Dec = 10;
	}
	else{
		var Dec = 9;
	}

	if(Class.ResizeTab.Col == 0) // redimentionnage Col 0
	{
		var ColWidthNew = MouseLeft - TableLeft;
	}
	else if(Class.ResizeTab.Col == 1) // redimentionnage Col 1
	{
		var ColWidthNew = MouseLeft - TableLeft - Class.ResizeTab.Col1Width;
	}

	if(ColWidthNew > Class.ResizeTab.ColWidthMin + Dec){
		Module.setColWidth(Class.ResizeTab.Col, ColWidthNew - Dec);
	}
	else{
		Module.setColWidth(Class.ResizeTab.Col, Class.ResizeTab.ColWidthMin);
	}

	Module.actResize();
},

ResizeEnd: function()
{
	var Class = GModule.ClassList['Tab'];

	Ot.stopEvent(document, 'mousemove', Class.ResizeMove);
	Ot.stopEvent(document, 'mouseup', Class.ResizeEnd);

	Class.ResizeTab.Module.Table.previousSibling.childNodes[Class.ResizeTab.Col].firstChild.style.background = '';
	Class.ResizeTab = {};

	GBlock.stopUseBlock();
	GBlock.setProtect('none');
},

getSave: function(ModuleObj)
{
	var R = {};
	var Text = [];
	var LigneList = ModuleObj.firstChild.lastChild.childNodes;

	R.Titre = ModuleObj.getElementsByTagName('h2')[0].firstChild.innerHTML;

	for(var x = 0; x < LigneList.length; x++)
	{
		Text.push(LigneList[x].childNodes[0].value);
	}

	R.Col1 = Text;
	Text = [];

	for(var y = 0; y < LigneList.length; y++)
	{
		Text.push(LigneList[y].childNodes[1].value);
	}

	R.Col2 = Text;

	var Etat = ModuleObj.firstChild.style.display;

	ModuleObj.firstChild.style.display = 'block';

	var BlockListWidthMax = GTheme.BlockListWidth;
	var L0 = Math.round(((LigneList[0].childNodes[0].offsetWidth-9)/BlockListWidthMax)*100);
	var L1 = Math.round(((LigneList[0].childNodes[1].offsetWidth-9)/BlockListWidthMax)*100);

	if(Etat == 'none'){
		ModuleObj.firstChild.style.display = 'none';
	}

	R.Len = [L0, L1];

	return R;
}

};

Ot.Extend(GModule.ClassList['Tab'].Module, {

initi: function()
{
	var Class = GModule.ClassList['Tab'];
	var self = this;

	var TableId = Ot.getRandId('ModuleTabTable');

	this.ModuleObj.className = 'ModuleTab';
	this.ModuleObj.innerHTML = '<div>'+
			'<h2 class="ModuleTabTitre"><span class="GData" title="Modifier le titre"></span></h2>'+
			'<div></div>'+
			'<div id="'+TableId+'" class="ModuleTabTable">'+
				'<div>'+
					'<input type="text" size="40" class="ModuleTabColHead ModuleTabCenter"/><input type="text" size="10" class="ModuleTabColHead ModuleTabCenter"/>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div></div>';

	var Table = document.getElementById(TableId);

	this.Table = Table;

	this.BlockHeadOption.innerHTML = '<button type="button" class="ButtonSmallGreen"><img src="image/icone/add.png"/>Ajouter une ligne</button>';
	this.BlockHeadOption.firstChild.onclick = function()
	{
		self.addLigne('', ' €');
		GBlock.resizeBlockCon(self.ModuleObj.parentNode);
		Ot.setCursorPosition(self.Table.lastChild.firstChild, 'Start');
	};

	var Titre = this.ModuleObj.getElementsByTagName('h2')[0].firstChild;
	Titre.innerHTML = this.V.Titre;
	Titre.onclick = function(){
		GBlock.startUseBlock(self.BlockObj);
		GData.open(this, function(){ GBlock.stopUseBlock(); });
	};
	GData.initi(Titre);

	var HeadList = Table.firstChild.childNodes;
	HeadList[0].value = this.V.Col1[0];
	HeadList[0].onkeydown = function(e){ e = e || window.event; self.onKeyDown(e, this); };
	HeadList[0].ondblclick = function(){ self.changeColTitre(this); };
	HeadList[0].onfocus = function(){ GBlock.startUseBlock(self.BlockObj); };
	HeadList[0].onblur = function(){ GBlock.stopUseBlock(); };
	HeadList[1].value = this.V.Col2[0];
	HeadList[1].onkeydown = function(e){ e = e || window.event; self.onKeyDown(e, this); };
	HeadList[1].ondblclick = function(){ self.changeColTitre(this); };
	HeadList[1].onfocus = function(){ GBlock.startUseBlock(self.BlockObj); };
	HeadList[1].onblur = function(){ GBlock.stopUseBlock(); };

	this.addResize(0);
	this.addResize(1);

	for(var i = 1, l = this.V.Col1.length; i < l; i++)
	{
		this.addLigne(this.V.Col1[i], this.V.Col2[i]);
	}

	var BlockListWidthMax = GTheme.BlockListWidth;
	var Col1Width = Math.round(BlockListWidthMax * (this.V.Len[0]/100));
	var Col2Width = Math.round(BlockListWidthMax * (this.V.Len[1]/100));

	this.setColWidth(0, Col1Width);
	this.setColWidth(1, Col2Width);

	this.ModuleObj.lastChild.style.display = 'block';
	this.ModuleObj.lastChild.innerHTML = Class.getTabHtml(this.V);
	this.ModuleObj.firstChild.style.display = 'none';

	GBlock.addEventOutOver(this.BlockObj, 'over', function(){
		self.ModuleObj.firstChild.style.display = 'block';
		self.ModuleObj.lastChild.style.display = 'none';

		var HeadList = Table.firstChild.childNodes;
		Ot.removeClass(HeadList[0], 'select');
		Ot.removeClass(HeadList[1], 'select');

		self.actResize('Height');
		self.actResize();
	});
	GBlock.addEventOutOver(this.BlockObj, 'out', function(){
		self.ModuleObj.lastChild.innerHTML = Class.getTabHtml(Class.getSave(self.ModuleObj));
		self.ModuleObj.firstChild.style.display = 'none';
		self.ModuleObj.lastChild.style.display = 'block';
	});

	Ot.addEvent(Table, 'mousedown', function(e){ e = e || window.event; self.selectHead(e); });
},

getColWidth: function(Col)
{
	var LigneList = this.Table.childNodes;

	return LigneList[0].childNodes[Col].offsetWidth;
},

getColWidthMax: function(Col)
{
	var LigneList = this.Table.childNodes;
	var WidthMax = 0;

	for(var i = 0; i < LigneList.length; i++)
	{
		var Width = this.getTextWidth(LigneList[i].childNodes[Col].value);

		if(Width > WidthMax){
			WidthMax = Width;
		}
	}

	return WidthMax; 
},	

setColWidth: function(Col, Width)
{
	var LigneList = this.Table.childNodes;
	var WidthMax = this.Table.parentNode.offsetWidth;

	var ColAutre = (Col == 0) ? 1 : 0;
	var ColAutreWidth = this.getColWidth(ColAutre);

	if(Width > WidthMax - ColAutreWidth - 70)
	{
		Width = WidthMax - ColAutreWidth - 70;
	}

	for(var i = 0; i < LigneList.length; i++)
	{
		LigneList[i].childNodes[Col].style.width = Width+'px';
	}

	this.Table.style.width = (Width+ColAutreWidth+70)+'px';
},

getTextWidth: function(value)
{
	return Ot.getWidthFont(value, 'Arial', '14px', '', 'span', this.ModuleObj) + 10;
},

addLigne: function(Col1, Col2)
{
	var self = this;
	var Col1Width = this.getColWidth(0) - 9;
	var Col2Width = this.getColWidth(1) - 9;

	var div = document.createElement('div');
	div.className = 'Drag';
	div.innerHTML = '<input type="text" size="40" style="width:'+Col1Width+'px;"/><input class="ModuleTabCenter" type="text" size="10" style="width:'+Col2Width+'px;"/>'+
	'<img class="ModuleTabMove" src="image/icone/drag.png" title="Déplacer cette ligne"/>'+
	'<img class="ModuleTabRemove" src="image/icone/erreur.png" title="Supprimer cette ligne"/>';

	var Input1 = div.firstChild;
	var Input2 = div.firstChild.nextSibling;

	Input1.value = Col1 ? Col1 : '';
	Input1.onkeydown = function(e){ e = e || window.event; self.onKeyDown(e, this); };
	Input1.onfocus = function(){ GBlock.startUseBlock(self.BlockObj); };
	Input1.onblur = function(){ GBlock.stopUseBlock(); };
	Input2.value = Col2 ? Col2 : '';
	Input2.onkeydown = function(e){ e = e || window.event; self.onKeyDown(e, this); };
	Input2.onfocus = function(){ GBlock.startUseBlock(self.BlockObj); };
	Input2.onblur = function(){ GBlock.stopUseBlock(); };

	div.lastChild.onclick = function(e){ e = e || window.event; self.removeLigne(e, this); };
	div.lastChild.previousSibling.onmousedown = function(e){
		e = e || window.event;
		GDrag.start(this.parentNode, e, '', self.BlockObj);
	};

	this.Table.appendChild(div);
	this.setMarque('vert', 0, this.Table.childNodes.length-1);
	this.actResize('Height');
},

removeLigne: function(event, Obj)
{
	var LigneNum = this.getLigneNum(Obj);
	var self = this;

	var MousePosition = Ot.getMousePosition(event);

	var onMouseMove = function(event)
	{
		MousePosition = Ot.getMousePosition(event);
	};

	Ot.addEvent(document, 'mousemove', onMouseMove);

	this.setMarque('rouge', 0, LigneNum, function()
	{
		Ot.stopEvent(document, 'mousemove', onMouseMove);
	
		self.Table.removeChild(self.Table.childNodes[LigneNum]);
		self.actResize('Height');
		GBlock.resizeBlockCon(self.ModuleObj.parentNode);

		var BlockObjOver = GBlock.getBlockObjOver(MousePosition);

		if(BlockObjOver != self.BlockObj)
		{
			GBlock.onOutOver(self.BlockObj, 'out');

			if(BlockObjOver != false){
				GBlock.onOutOver(BlockObjOver, 'over');
			}
		}
	});
},

setMarque: function(Couleur, Avanc, LigneNum, CallBack)
{
	var LigneList = this.Table.childNodes;
	var self = this;

	if(Couleur == 'vert') {
		var Degrader = ['55b125', '5dab35', '66a347', '6f9a5a', '78926a', '7d8b77', '848484'];
	}
	else if(Couleur == 'rouge') {
		var Degrader = ['c12020', 'b63535', 'a64e4e', '9a6262', '966a6a', '8d7979', '848484'];
	}

	if(LigneList[LigneNum] && Avanc <= 6)
	{
		LigneList[LigneNum].childNodes[0].style.border = '1px solid #' +Degrader[Avanc];
		LigneList[LigneNum].childNodes[1].style.border = '1px solid #' +Degrader[Avanc];

		if(LigneList.length != LigneNum-1) 
		{
			LigneList[LigneNum-1].childNodes[0].style.borderBottom = '1px solid #' +Degrader[Avanc];
			LigneList[LigneNum-1].childNodes[1].style.borderBottom = '1px solid #' +Degrader[Avanc];
		}
		if(LigneList.length != LigneNum+1) 
		{
			LigneList[LigneNum+1].childNodes[0].style.borderTop = '1px solid #' +Degrader[Avanc];
			LigneList[LigneNum+1].childNodes[1].style.borderTop = '1px solid #' +Degrader[Avanc];
		}

		window.setTimeout(function(){ self.setMarque(Couleur, Avanc+1, LigneNum, CallBack); }, 70);
	}
	else if(Ot.isFonc(CallBack))
	{
		CallBack();
	}
},

changeColTitre: function(Input)
{
	CadPrompt.open('Titre de la colonne', 'Entrée ici le titre de la colonne', Input.value, function(Var)
	{
		if(Var == ''){
			Var = 'Titre';
		}

		Input.value = Var;
	});
},

getLigneNum: function(Obj)
{
	var LigneList = this.Table.childNodes;
	var LigneNum = 0;

	for(var i = 0; i < LigneList.length; i++)
	{
       	if(Obj.parentNode == LigneList[i])
		{	
			LigneNum = i;
			break;
		}
	}
	return LigneNum;
},

selectHead: function(event, Col)
{
	var Target = Ot.getTarget(event);
	var HeadList = this.Table.firstChild.childNodes;

	Ot.removeClass(HeadList[0], 'select');
	Ot.removeClass(HeadList[1], 'select');

	if(Col == 1 || (Target && Target.type == 'text' && Target.size == '40'))
	{
		Ot.addClass(HeadList[0], 'select');
	}
	else if(Col == 2 || (Target && Target.type == 'text' && Target.size == '10'))
	{
		Ot.addClass(HeadList[1], 'select');
	}
},

addResize: function(Col)
{
	var self = this;
	var Class = GModule.ClassList['Tab'];

	var Resize = document.createElement('div');
	Resize.className = 'ModuleTabResize';
	Resize.innerHTML = '<div></div>';
	Resize.title = 'Redimensionner cette colonne';
	Resize.style.cursor = 'w-resize';
	Resize.style.height = this.Table.offsetHeight+'px';

	var dblclick = 0;

	Resize.onmousedown = function(e)
	{
		e = e || window.event;
		Ot.cancelEvent(e);
		Class.ResizeStart(self, Col);

		dblclick += 1;
		window.setTimeout(function(){ dblclick = 0; }, 350);
		if(dblclick == 2)
		{
			dblclick = 0;
			onDblclick();
		}
	};

	var onDblclick = function()
	{
		var ColWidthMax = self.getColWidthMax(Col);
		self.setColWidth(Col, ColWidthMax);
		self.actResize();
	};

	Resize.ondblclick = onDblclick;
	Resize.firstChild.ondblclick = onDblclick;

	this.Table.previousSibling.appendChild(Resize);
},

actResize: function(Mode)
{
	var ResizeList = this.Table.previousSibling;

	if(Mode == 'Height')
	{
		var Height = this.Table.offsetHeight+1;

		ResizeList.firstChild.style.height = Height+'px';
		ResizeList.lastChild.style.height = Height+'px';
	}
	else
	{
		var HeadList = this.Table.firstChild.childNodes;

		var Col1 = HeadList[0].offsetWidth-3;
		var Col2 = HeadList[1].offsetWidth;

		ResizeList.firstChild.style.left = Col1+'px';
		ResizeList.lastChild.style.left = (Col1+Col2)+'px';
	}
},

onKeyDown: function(event, Input)
{
	var LigneList = this.Table.childNodes;
	var LigneNum = this.getLigneNum(Input);
	var CursorPosition = Ot.getCursorPosition(Input).start;
	var keyCode = event.keyCode;

	if(keyCode == Ot.Key.Tab) // tab
	{
		if(Input.size == '40') 
		{
			Ot.cancelEvent(event);
			Ot.setCursorPosition(LigneList[LigneNum].childNodes[1], 'Start');
			this.selectHead(false, 2);
		}
		if(Input.size == '10' && LigneNum+1 != LigneList.length)
		{
			Ot.cancelEvent(event);
			Ot.setCursorPosition(LigneList[LigneNum+1].childNodes[0], 'End');
			this.selectHead(false, 1);
		}
	}
	else if(keyCode == Ot.Key.Enter || keyCode == Ot.Key.Down)
	{					
		if(Input.size == '40' && LigneList.length != LigneNum+1)
		{
			Ot.setCursorPosition(LigneList[LigneNum+1].childNodes[0], 'End');
		}
		else if(Input.size == '10' && LigneList.length != LigneNum+1)
		{
			Ot.setCursorPosition(LigneList[LigneNum+1].childNodes[1], 'Start');
		}
	}
	else if(keyCode == Ot.Key.Up)
	{
		if(Input.size == '40' && LigneNum-1 >= 0)
		{
			Ot.setCursorPosition(LigneList[LigneNum-1].childNodes[0], 'End');
		}
		else if(Input.size == '10' && LigneNum-1 >= 0)
		{
			Ot.setCursorPosition(LigneList[LigneNum-1].childNodes[1], 'Start');
		}
	}
	else if(keyCode == Ot.Key.Right)
	{
		if(Input.size == '40' && CursorPosition == Input.value.length) // si champs null
		{
			Ot.cancelEvent(event);
			Ot.setCursorPosition(LigneList[LigneNum].childNodes[1], 'Start');
			this.selectHead(false, 2);
		}
		if(Input.size == '10' && CursorPosition == Input.value.length && LigneNum+1 != LigneList.length)
		{
			Ot.cancelEvent(event);
			Ot.setCursorPosition(LigneList[LigneNum+1].childNodes[0], 'End');
			this.selectHead(false, 1);
		}
	}
	else if(keyCode == Ot.Key.Left)
	{
		if(Input.size == '10' && CursorPosition == 0) // si champs null
		{
			Ot.cancelEvent(event);
			Ot.setCursorPosition(LigneList[LigneNum].childNodes[0], 'End');
			this.selectHead(false, 1);
		}
		if(Input.size == '40' && CursorPosition == 0 && LigneNum-1 != 0)
		{
			Ot.cancelEvent(event);
			Ot.setCursorPosition(LigneList[LigneNum-1].childNodes[1], 'Start');
			this.selectHead(false, 2);
		}
	}
	else if(keyCode != Ot.Key.Delete && keyCode != Ot.Key.BackSpace && Input.value != '')
	{
		if(Input.size == '40'){
			var Col = 0;
		}
		else if(Input.size == '10'){
			var Col = 1;
		}

		var ColWidth = this.getColWidth(Col);
		var TextWidth = this.getTextWidth(LigneList[LigneNum].childNodes[Col].value);

		if(TextWidth + 10 > ColWidth)
		{
			this.setColWidth(Col, TextWidth + 40);
			this.actResize();

			LigneList[LigneNum].childNodes[Col].value = LigneList[LigneNum].childNodes[Col].value; // Reinitialisation
		}
	}
}

});


if(typeof GModule != 'undefined')
{
	GModule.ScriptCharger('Tab', 'creator/module/tab/tab.js');
}
