GModule.ClassList['Map'] = {

Module: function()
{

},

getSave: function(ModuleObj)
{
	var GoogleMap = GModule.List[ModuleObj.id].GoogleMap;

	GoogleMap.saveV();

	return Ot.CloneObjet(GoogleMap.V);
}

};

Ot.Extend(GModule.ClassList['Map'].Module, {

initi: function()
{
	var Class = GModule.ClassList['Form'];
	var self = this;

	var ModuleObjId = this.ModuleObj.id;

	this.ModuleObj.parentNode.innerHTML = '<div class="BlockVide">Chargement du module en cours...</div>'+
	'<iframe id="'+ModuleObjId+'" src="/bundles/salonramamain/buildsite/module/map/map.php?id='+ModuleObjId+'" class="BlockWHFull" frameborder="0" style="display:none;"></iframe>';

	this.ModuleObj = document.getElementById(ModuleObjId);
},

load: function()
{
	var self = this;

	var BlockCon = this.ModuleObj.parentNode;

	if(BlockCon.firstChild.className == 'BlockVide'){
		BlockCon.removeChild(BlockCon.firstChild);
	}

	this.ModuleObj.style.display = 'block';

	this.Iframe = this.ModuleObj.contentWindow;
	this.GoogleMap = new this.Iframe.GoogleMap('Map', 'modifier');

	if(this.GoogleMap.Map != '')
	{
		var InputId = this.ModuleObj.id+'Input';

		this.BlockHeadOption.innerHTML = '<div class="FormChamp" style="margin:2px 0 5px;">'+
			'<label class="FormLabel" for="'+InputId+'" style="height:50px; width:130px; padding-left:10px;">Adresse du salon :</label>'+
			'<input type="text" id="'+InputId+'" class="FormInputText" size="40" style="width:50%;"/><span></span>'+
		'</div>'+
		'<button type="button" class="button-small button-small-blue"><i class="icon-search"></i>Localiser</button>';
		this.BlockHeadOption.getElementsByTagName('button')[0].onclick = function(){ self.setAdresse(Input.value); };

		var Input = document.getElementById(InputId);
		this.Input = Input;
		Input.onfocus = function(){
			self.VerifInput('Focus');
			GBlock.startUseBlock(self.BlockObj);
		};
		Input.onkeydown = function(e){ e = e || window.event; self.VerifInput('KeyDown', e); };
		Input.onkeyup = function(e){ e = e || window.event; self.VerifInput('KeyUp', e); };
		Input.onblur = function(){
			self.VerifInput('Blur');
			GBlock.stopUseBlock();
		};
		Input.value = this.V[0];

		this.GoogleMap.V = this.V;
		this.GoogleMap.setV('All');

		if(this.V[1] == 0 && this.V[2] == 0 && this.V[0] != '' && this.V[0] != 'Adresse')
		{
			this.setAdresse(this.V[0]);
		}
	}
	else
	{
		this.BlockHeadOption.innerHTML = '';
		BlockCon.innerHTML = '<div class="BlockVide">Desoler, le module Google Maps n\'est actuellement pas disponible.</div>';
	}

	window.setTimeout(function(){
		BlockCon.style.opacity = '';
		BlockCon.style.filter = '';
	}, 500);
},

setAdresse: function(Adresse)
{
	if(this.Input.value == '')
	{
		this.Input.focus();
		GFormF.setChampErr(this.Input, this.Input.nextSibling, false, 'Champ vide');
		GBlock.setBlockOptionHeight(this.BlockObj);
	}
	else
	{
		this.Input.blur();

		bsCadreLoad.show();
		var self = this;

		this.GoogleMap.getLatLon(Adresse, function(Etat)
		{
			if(Etat.error == 0)
			{
				self.GoogleMap.saveV();

				var Centre = Etat.description.geometry.location;

				self.GoogleMap.V[0] = Adresse;
				self.GoogleMap.V[1] = Centre.lat();
				self.GoogleMap.V[2] = Centre.lng();
				self.GoogleMap.V[3] = 15;
				self.GoogleMap.V[5] = Centre.lat();
				self.GoogleMap.V[6] = Centre.lng();
				self.GoogleMap.V[7] = Etat.description.formatted_address;

				self.GoogleMap.setV();
				GFormF.setChampErr(self.Input, self.Input.nextSibling, true, 'Ok');
			}
			else{
				GFormF.setChampErr(self.Input, self.Input.nextSibling, false, Etat.description);
			}

			GBlock.setBlockOptionHeight(self.BlockObj);

			bsCadreLoad.hide();
		});
	}
},

VerifInput: function(Mode, event)
{
	if(Mode == 'Blur')
	{
		if(this.Input.value == '')
		{
			GFormF.setChampErr(this.Input, this.Input.nextSibling, false, 'Champ vide');
			GBlock.setBlockOptionHeight(this.BlockObj);
		}
	}
	else
	{
		if(Mode != 'KeyDown' && (!event || event.keyCode != Ot.Key.Enter))
		{
			GFormF.setChampErr(this.Input, this.Input.nextSibling, '', '');
			GBlock.setBlockOptionHeight(this.BlockObj);
		}
		if(Mode == 'KeyDown' && event.keyCode == Ot.Key.Enter)
		{
			this.setAdresse(this.Input.value);
		}
	}
}

});


if(typeof GModule != 'undefined')
{
	GModule.ScriptCharger('Map', 'map/map.js');
}
