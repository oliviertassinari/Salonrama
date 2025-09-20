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

	this.ModuleObj.innerHTML = '<div class="ModuleFormChampList"></div>'+
		'<div class="form-actions">'+
			'<div class="form-global-state frame-small"></div>'+
			'<button type="submit" class="button-small button-small-green" onclick="GModule.ClassList[\'Form\'].submit()"><i class="icon-envelope"></i>Envoyer mon message</button>'+
		'</div>'+
		'<p class="etoile">* champ à remplir obligatoirement</p>';

	this.ModuleFormChampList = this.ModuleObj.firstChild;

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

		if(ChampAct[2] == 1){
			var label = ChampAct[1]+'<span class="form-required">*</span>';
			isObligatoire = true;
		}
		else{
			var label = ChampAct[1];
		}

		var Html = '<fieldset class="form-fieldset">'+
						'<label for="for="'+Id+'"">'+label+'</label>'+
						'<div class="form-controls">';

		if(ChampAct[0] == 'text' || ChampAct[0] == 'email'){
			Html += '<input type="text" id="'+Id+'"/>';
		}
		else if(ChampAct[0] == 'textarea'){
			Html += '<textarea id="'+Id+'"></textarea>';
		}

		Html += '</div></fieldset>';

		$(this.ModuleFormChampList).append(Html);
	}

	if(isObligatoire){
		this.ModuleObj.lastChild.style.display = 'block';
	}
}

});

if(typeof GModule != 'undefined')
{
	GModule.ScriptCharger('Form', 'form/form.js');
}
