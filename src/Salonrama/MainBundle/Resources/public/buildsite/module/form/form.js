/* JavaScript, By Olivier (olivier.tassinari@gmail.com)
-----------------------*/

GModule.ClassList['Form'] = {

Module: function()
{
},

submit: function()
{
	alert('Désolé, pendant la modification du site le formulaire est désactivé.');
},

getSave: function(ModuleObj)
{
	var Module = GModule.List[ModuleObj.id];

	var V = {};

	V.email = Module.BlockHeadOption.getElementsByTagName('input')[0].value;
	V.ChampList = Module.V.ChampList;

	return V;
}

};

Ot.Extend(GModule.ClassList['Form'].Module, {

initi: function()
{
	var Class = GModule.ClassList['Form'];
	var self = this;

	this.ModuleObj.innerHTML = '<div class="ModuleForm">'+
		'<div class="ModuleFormChampList"></div>'+
		'<div class="FormValid">'+
			'<div style="height:30px;"></div>'+
			'<button type="button" class="button-small button-small-green" onclick="GModule.ClassList[\'Form\'].submit()">'+
				'<i class="icon-envelope"></i>Envoyer mon message'+
			'</button>'+
		'</div>'+
		'<p class="etoile">* champ à remplir obligatoirement</p>'+
	'</div>';

	this.ModuleFormChampList = this.ModuleObj.firstChild.firstChild;

	var InputId = this.ModuleObj.id+'Input';

	this.BlockHeadOption.innerHTML = '<div class="FormChamp" style="margin:2px 0 5px;">'+
		'<label class="FormLabel" for="'+InputId+'" style="width:140px; padding-left:10px;">Votre adresse email :</label>'+
		'<input type="text" id="'+InputId+'" class="FormInputText" size="40" style="width:50%;"/><span></span>'+
	'</div>';

	var Input = document.getElementById(InputId);
	Input.onfocus = function(){	GBlock.startUseBlock(self.BlockObj); };
	Input.onblur = function(){ GBlock.stopUseBlock(); };
	Input.value = this.V.email;

	this.set();
},

set: function()
{
	this.ModuleFormChampList.innerHTML = '';
	var isObligatoire = false;

	for(var i = 0; i < this.V.ChampList.length; i++)
	{
		var ChampAct = this.V.ChampList[i];
		var Id = Ot.getRandId('ModuleFormChamp');

		var Html = '<label class="FormLabel" for="'+Id+'"></label>';

		if(ChampAct[0] == 'text' || ChampAct[0] == 'email'){
			Html += '<input class="FormInputText" type="text" size="35" id="'+Id+'"/>';
		}
		else if(ChampAct[0] == 'textarea'){
			Html += '<textarea class="FormTexta" rows="8" cols="80" id="'+Id+'"></textarea>';
		}

		var Champ = document.createElement('div');
		Champ.className = 'FormChamp';
		Champ.innerHTML = Html;

		if(ChampAct[2] == 1){
			Champ.firstChild.innerHTML += ChampAct[1]+'<span class="etoile">*</span>:';
			isObligatoire = true;
		}
		else{
			Champ.firstChild.innerHTML += ChampAct[1]+' :';
		}

		this.ModuleFormChampList.appendChild(Champ);
	}

	if(isObligatoire){
		this.ModuleObj.firstChild.lastChild.style.display = 'block';
	}
}

});

if(typeof GModule != 'undefined')
{
	GModule.ScriptCharger('Form', 'form/form.js');
}
