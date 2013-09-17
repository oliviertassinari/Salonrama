/* JavaScript, By Olivier (olivier.tassinari@gmail.com)
-----------------------*/

GModule.ClassList['Galerie'] = {

Module: function()
{
},

ModuleAct: {},
ImageList: [],
Type: '',
ImageListSave: '',
TypeList: {
	'MilkBox': ['MilkBox', 'Afficher les images sous forme de grille', 'grille'],
	'MooFlow': ['Cover flow', 'Afficher les images sous forme de liste', 'liste']
},

open: function(Module)
{
	GCadre.open('CadGalerie');

	this.ModuleAct = Module;
	this.ImageList = Module.ImageList;
	this.Type = Module.Type;
	this.ImageListSave = JSON.encode(this.ImageList);

	this.setPage('Index');
},

setPage: function(Page)
{
	this.setTitre(Page);
	this.setFoot(Page);

	if(Page == 'Index')
	{
		var Html = '';
		for(var i in this.TypeList)
		{
			Html += '<div class="'+this.TypeList[i][2]+'">'+
						'<input type="radio" name="CadGalerieTypeList" id="CadGalerieType'+i+'" onclick="GModule.ClassList[\'Galerie\'].setType(\''+i+'\')"/>'+
						'<label for="CadGalerieType'+i+'">'+
							this.TypeList[i][0]+'<br/>'+
							'<span class="TextLittle">'+this.TypeList[i][1]+'</span>'+
						'</label>'+
					'</div>';
		}

		document.getElementById('CadGalerieCon').innerHTML = ''+
		'<div id="CadGalerieLeft">'+
			'<span style="margin-left:10px;">Liste des images de la galerie :<span class="TextLittle"></span></span>'+
			'<div id="CadGalerieImageList">'+
				'<div class="DragList"></div>'+
			'</div>'+
		'</div>'+
		'<div id="CadGalerieRight">'+
			'<span style="margin-left:10px;">Mode d\'affichage :</span><br/>'+
			'<div class="CadColor CadBlue2">'+
				'<div class="Ratio">'+Html+'</div>'+
			'</div>'+
			'<button type="button" class="button-small button-small-green" onclick="GModule.ClassList[\'Galerie\'].setPage(\'Ajouter\')"><i class="icon-ok"></i>Ajouter des images</button>'+
		'</div>';

		document.getElementById('CadGalerieType'+this.Type).checked = true;

		this.setImageList();

		Ot.setOpacity(document.getElementById('CadGalerieImageList'), 1);
	}
	else if(Page == 'Ajouter')
	{
		var self = this;

		document.getElementById('CadGalerieCon').innerHTML = ''+
		'<div id="CadGalerieUpload"></div>'+
		'<div id="CadGalerieAddImage">'+
			'<span style="margin-left:15px;">ou choissisez les parmit votre liste :</span>'+
			'<div id="CadGalerieAddImageList">'+
				'<div></div>'+
			'</div>'+
		'</div>'+
		'<button type="button" class="button-small button-small-green" id="CadGalerieUploadStart" style="display:none;"><i class="icon-ok"></i>Ajouter les images</button>'+
		'<div class="CadGalerieAjouter">'+
			'<strong style="margin-left:5px;">Images ajoutées à la galerie :</strong><div id="CadGalerieAjouter"></div>'+
		'</div>';

		Ot.setOpacity(document.getElementById('CadGalerieAddImageList'), 1);

		var Html = '';
		for(var i in GImage.List)
		{
			var ImageInfo = GImage.getInfo(i);
			var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 70, 70);

			Html += '<div class="CadImage">'+
						'<img src="'+ImageInfo.src+'" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/><br/>'+
						'<a href="#" title="Ajouter cette image à la galerie" onclick="GModule.ClassList[\'Galerie\'].addImage(\''+i+'\'); GModule.ClassList[\'Galerie\'].setFoot(\'Ajouter\'); return false;">Ajouter</a>'+
					'</div>';
		}

		document.getElementById('CadGalerieAddImageList').innerHTML = '<div>'+Html+'<div class="Clear"></div></div>';

		Upload.initi(document.getElementById('CadGalerieUpload'),
		{
			SWFUrl: 'creator/upload.swf',
			uploadUrl: 'image',
			DataPost: 'LocHomeSite='+LocHomeSite,
			MaxFile: 0,
			ExtensionImage: ['jpg', 'jpeg', 'jpe', 'gif', 'png'],
			BoutUploadStart: document.getElementById('CadGalerieUploadStart'),
			onUploadSuccess: function(Return)
			{
				GImage.add(Return[0], Return[1], Return[2]);

				self.addImage(Return[0]);
			},
			onUploadFinish: function()
			{
				self.setFoot('Ajouter');
			}
		});
	}
},

addImage: function(Nom)
{
	this.ImageList.push(Nom);

	var ImageInfo = GImage.getInfo(Nom);
	var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 40, 40);
	document.getElementById('CadGalerieAjouter').parentNode.style.display = 'block';
	document.getElementById('CadGalerieAjouter').innerHTML += '<div class="CadImage"><img src="'+ImageInfo.src+'" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/></div>';
},

setTitre: function(Page)
{
	var Titre = '';

	if(Page == 'Index')
	{
		Titre = 'Pour arranger l\'ordre de vos images <strong>déplacer</strong> les où vous voulez.<br/>'+
				'Cliquer sur "<strong>Appliquer les modifications</strong>" une fois terminé.';
	}
	else if(Page == 'Ajouter')
	{
		Titre = '<strong>Ajouter</strong> des images à la galerie.';
	}

	document.getElementById('CadGalerieTitre').innerHTML = Titre;
},

setFoot: function(Page)
{
	var Foot = '';

	if(Page == 'Index')
	{
		if(JSON.encode(this.ImageList) == this.ImageListSave && this.Type == this.ModuleAct.Type)
		{
			Foot = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadGalerie\')">Fermer</button>';
		}
		else
		{
			Foot = '<button type="button" class="button-small button-small-red" onclick="GCadre.close(\'CadGalerie\')">Annuler</button>'+
				   '<button type="button" class="button-small button-small-green" onclick="GModule.ClassList[\'Galerie\'].apply()"><i class="icon-ok"></i>Appliquer les modifications</button>';
		}
	}
	else if(Page == 'Ajouter')
	{
		Foot = '<button type="button" class="button-small button-small-blue" onclick="GModule.ClassList[\'Galerie\'].setPage(\'Index\')" style="float:left;"><i class="icon-angle-left"></i>Retour</button>';

		if(JSON.encode(this.ImageList) != this.ImageListSave || this.Type != this.ModuleAct.Type)
		{
			Foot +=  '<button type="button" class="button-small button-small-green" onclick="GModule.ClassList[\'Galerie\'].apply()"><i class="icon-ok"></i>Appliquer les modifications</button>';
		}
	}

	document.getElementById('CadGalerieFoot').innerHTML = Foot+'<div class="Clear"></div>';
},

setImageList: function()
{
	var CadGalerieImageList = document.getElementById('CadGalerieImageList');
	var self = this;

	if(this.ImageList.length > 1){
		var Info = ' ('+this.ImageList.length+' images)';
	}
	else{
		var Info = ' ('+this.ImageList.length+' image)';
	}
	CadGalerieImageList.previousSibling.lastChild.innerHTML =  Info;


	if(this.ImageList.length == 0)
	{
		CadGalerieImageList.firstChild.innerHTML = '<div style="text-align:left;margin:15px;"><strong>Il n\'y a pas d\'image.</strong><br>Utilisez le bouton "Ajouter des images" à droite pour en ajouter.</div>';
	}
	else
	{
		CadGalerieImageList.firstChild.innerHTML = '';

		for(var i = 0; i < this.ImageList.length; i++)
		{
			var ImageInfo = GImage.getInfo(this.ImageList[i]);
			var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 70, 70);

			var CadImageObj = document.createElement('div');
			CadImageObj.className = 'CadImage';
			CadImageObj.title = 'Déplacer cette image';
			CadImageObj.onmousedown = function(e){
				e = e || window.event;
				self.Drag.start(e, this);
			};
			CadImageObj.innerHTML = '<img src="'+ImageInfo.src+'" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/>'+
			'<div class="BoutEdit" title="Modifier cette image"></div>'+
			'<div class="CadClose" onclick="GModule.ClassList[\'Galerie\'].removeImage(this.parentNode)" title="Supprimer cette image"></div>';

			(function(CadImageObj, Src){
				CadImageObj.firstChild.nextSibling.onclick = function()
				{
					GCadre.List['CadGalerie'].dontClose = true;
					CadImage.Picnik.open(Src, function()
					{
						GCadre.List['CadGalerie'].dontClose = false;
						self.setImageList();
					});
				};
			})(CadImageObj, ImageInfo.src);

			CadGalerieImageList.firstChild.appendChild(CadImageObj);
		}

		var div = document.createElement('div');
		div.className = 'Clear';
		CadGalerieImageList.firstChild.appendChild(div);
	}
},

setType: function(Type)
{
	this.Type = Type;
	this.setFoot('Index');
},

getImageList: function()
{
	var CadGalerieImageList = document.getElementById('CadGalerieImageList').firstChild.childNodes;
	var ImageList = [];

	for(var i = 0; i < CadGalerieImageList.length-1; i++)
	{
		ImageList.push(GImage.getNom(CadGalerieImageList[i].firstChild.src));
	}

	return ImageList;
},

removeImage: function(CadImage)
{
	CadImage.parentNode.removeChild(CadImage);

	this.ImageList = this.getImageList();
	this.setImageList();
	this.setFoot('Index');
},

apply: function()
{
	this.ModuleAct.Type = this.Type;
	this.ModuleAct.ImageList = this.ImageList;
	this.ModuleAct.setBlock();

	GBlock.resizeBlockCon(this.ModuleAct.ModuleObj.parentNode);

	this.ModuleAct = {};
	this.ImageList = [];
	this.ImageListSave = '';
	this.Type = '';

	GCadre.close('CadGalerie');
},

Drag: {

data: {},

start: function(event, Obj)
{
	Ot.cancelEvent(event);

	var Target = Ot.getTarget(event);

	if(!Target.className || ( Target.className != 'CadClose' && Target.className != 'BoutEdit'))
	{
		var DragGhost = document.createElement('div');
		DragGhost.className = 'DragGhost';

		var Parent = Obj.parentNode;
		var MousePosition = Ot.getMousePosition(event);
		var Top = Obj.offsetTop;
		var Left = Obj.offsetLeft;

		Obj.style.position = 'absolute';
		Obj.style.zIndex = 3;
		Ot.setOpacity(Obj, 0.7);
		Parent.insertBefore(DragGhost, Obj.nextSibling);

		var List = [];
		var DivList = Parent.getElementsByTagName('div');
		for(var i = 0; i < DivList.length; i++)
		{
			if(DivList[i].className && DivList[i].className == 'CadImage' && DivList[i] != Obj) //ciblage des blocks deplacables
			{
				List.push(DivList[i]);
			}
		}

		this.data.Obj = Obj;
		this.data.dX = MousePosition.x - Left;
		this.data.dY = MousePosition.y - Top + Parent.parentNode.scrollTop;
		this.data.List = List;
		this.data.DragGhost = DragGhost;

		Ot.setLeftTop(Obj, MousePosition.x - this.data.dX, MousePosition.y - this.data.dY);

		Ot.addEvent(document ,'mousemove', this.move);
		Ot.addEvent(document, 'mouseup', this.stop);
	}
},

move: function(event)
{
	Ot.cancelEvent(event);

	var data = GModule.ClassList['Galerie'].Drag.data;

	var List = data.List;
	var Obj = data.Obj;
	var DragGhost = data.DragGhost;
	var Parent = Obj.parentNode;
	var MousePosition = Ot.getMousePosition(event);

	var Left = MousePosition.x - data.dX;
	var	Top = MousePosition.y - data.dY + Parent.parentNode.scrollTop;
	Left = (Left < 0) ? 0 : Left; 
	Top = (Top < 0) ? 0 : Top; 

	Ot.setLeftTop(Obj, Left, Top);

	for(var i = 0; i < List.length; i++)
	{
		var DragAct = List[i];
		var DragActLeftMid = DragAct.offsetLeft + (DragAct.offsetWidth)/2;
		var DragActTopMid = DragAct.offsetTop + (DragAct.offsetHeight)/2;

		if(Ot.isBetween(Obj.offsetTop, DragActTopMid, Obj.offsetTop + Obj.offsetHeight) && Ot.isBetween(Obj.offsetLeft, DragActLeftMid, Obj.offsetLeft + Obj.offsetWidth))
		{
			if(DragAct.nextSibling.className == 'DragGhost'){
				Parent.insertBefore(DragGhost, DragAct);
			}
			else{
				Parent.insertBefore(DragGhost, DragAct.nextSibling);
			}
			break;
		}
		else if(DragAct.nextSibling.className == 'Clear' && Parent.childNodes.length > 2) //Fin
		{
			if(Obj.offsetLeft > DragAct.offsetLeft && Ot.isBetween(Obj.offsetTop, DragActTopMid, Obj.offsetTop + Obj.offsetHeight))
			{
				Parent.insertBefore(DragGhost, DragAct.nextSibling);
				break;
			}
		}
	}
},

stop: function()
{
	var Class = GModule.ClassList['Galerie'];
	
	Ot.stopEvent(document ,'mousemove', Class.Drag.move);
	Ot.stopEvent(document, 'mouseup', Class.Drag.stop);

	var data = Class.Drag.data;
	var Obj = data.Obj;
	var DragGhost = data.DragGhost;

	DragGhost.parentNode.replaceChild(Obj, DragGhost);
	Obj.style.position = '';
	Obj.style.top = '';
	Obj.style.left = '';
	Obj.style.zIndex = '';
	Ot.setOpacity(Obj, 1);

	GModule.ClassList['Galerie'].Drag.data = {};

	Class.ImageList = Class.getImageList();
	Class.setFoot('Index');
}

},

getSave: function(ModuleObj)
{
	var Module = GModule.List[ModuleObj.id];
	var V = {};

	V.Type = Module.Type;
	V.ImageList = [];

	for(var i = 0; i < Module.ImageList.length; i++)
	{
		var ImageInfo = GImage.getInfo(Module.ImageList[i]);

		V.ImageList.push(GImage.getNom(ImageInfo.src));
	}

	return V;
}

};

Ot.Extend(GModule.ClassList['Galerie'].Module, {

initi: function()
{
	var Class = GModule.ClassList['Galerie'];
	var self = this;

	GCadre.add('CadGalerie', 'Galerie photos', '850px',
		'',
		'',
		''
	);

	this.ModuleObj.innerHTML = '';

	this.Type = this.V.Type;
	this.ImageList = this.V.ImageList;
	this.PreVis = new PreVis('');
	this.MilkBox = new MilkBox();
	this.MooFlow = null;

	this.BlockHeadOption.innerHTML = '<button type="button" class="button-small button-small-blue"><i class="icon-angle-right"></i>Modifier la galerie</button>';
	this.BlockHeadOption.firstChild.onclick = function(){ Class.open(self); };

	var Width;
	GBlock.addEventOutOver(this.BlockObj, 'out', function()
	{
		if(self.Type == 'MooFlow')
		{
			if(Width && Width != self.BlockObj.offsetWidth)
			{
				self.setBlock();
			}
		}
		Width = self.BlockObj.offsetWidth;
	});

	if(this.ImageList.length == 0)
	{
		Class.open(this);
	}
	else
	{
		this.setBlock();
	}
},

setBlock: function()
{
	this.ModuleObj.innerHTML = '<div></div>';

	var ImageList = this.ImageList;
	var ImageListObj = this.ModuleObj.firstChild;

	if(this.Type == 'PreVis')
	{
		var Html = '';
		for(var i = 0, l = ImageList.length; i < l; i++)
		{
			var ImageInfo = GImage.getInfo(ImageList[i]);
			var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 150, 150);

			Html += '<div class="ModuleGalerieImage">'+
						'<a href="'+ImageInfo.src+'" class="MPreVis" title="Agrandir cette image"><img src="'+ImageInfo.src+'" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/><span class="Zoom"></span></a>'+
					'</div>';
		}
		ImageListObj.innerHTML = Html+'<div class="Clear"></div>';

		this.PreVis.Initi(ImageListObj);
	}
	else if(this.Type == 'MilkBox')
	{
		var Html = '';
		for(var i = 0, l = ImageList.length; i < l; i++)
		{
			var ImageInfo = GImage.getInfo(ImageList[i]);
			var ImageSizeOpt = GImage.getSizeOpt(ImageInfo.w, ImageInfo.h, 150, 150);

			Html += '<div class="ModuleGalerieImage">'+
						'<a href="'+ImageInfo.src+'" class="MMilkBox" title="Agrandir cette image"><img src="'+ImageInfo.src+'" title="" width="'+ImageSizeOpt.w+'" height="'+ImageSizeOpt.h+'"/><span class="Zoom"></span></a>'+
					'</div>';
		}
		ImageListObj.innerHTML = Html+'<div class="Clear"></div>';

		this.MilkBox.prepareGalleries(ImageListObj);
	}
	else if(this.Type == 'MooFlow')
	{
		var self = this;

		ImageListObj.innerHTML = '';

		this.MooFlow = new MooFlow($(ImageListObj), {
			useSlider: true,
			useCaption: true,
			useMouseWheel: true,
			useKeyInput: true,
			useViewer: true,
			onClickView: function(obj){ self.MilkBox.showThisImage(obj.href, ''); }
		});

		this.MooFlow.master = { 'images':[] };

		for(var i = 0, l = ImageList.length; i < l; i++)
		{
			var ImageInfo = GImage.getInfo(ImageList[i]);

			this.MooFlow.master.images.push({
				href: ImageInfo.src,
				src: ImageInfo.src
			});
		}

		this.MooFlow.clearMain();
	}
}

});

if(typeof GModule != 'undefined')
{
	GModule.ScriptCharger('Galerie', 'creator/module/galerie/galerie.js');
}
