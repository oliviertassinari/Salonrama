var Form = function()
{

};

Form.prototype = {

list: {},

init: function(formId, submitId, globalStateId, onSubmit)
{
	var self = this;

	document.getElementById(formId).action = 'javascript:;';
	document.getElementById(submitId).onclick = function(){ self.valide(); };

	this.formId = formId;
	this.submitId = submitId;
	this.globalState = $('#'+globalStateId);
	this.onSubmit = onSubmit;
},

addInput: function(inputId, param)
{
	var self = this;
	var input = $('#'+inputId);
	var inputTagName = input.prop('tagName').toLowerCase();

	param.isNeeded = (typeof param.isNeeded != 'undefined') ? param.isNeeded : true;

	if(inputTagName == 'input' && input.prop('type').toLowerCase() == 'text')
	{
		param.minLength = (typeof param.minLength == 'number') ? param.minLength : 0;
		param.maxLength = (typeof param.maxLength == 'number') ? param.maxLength : 40;

		if(param.regexp == 'email')
		{
			param.regexp = { code : /^[a-zA-Z0-9!#$%&'*+-\/=?^_`.{|}~]{0,64}@[a-z0-9._-]{2,255}\.[a-z]{2,4}$/, text: 'email invalide' };
		}

		input.focus(function(){
			self.removeInputState(input);
		});

		this.list[inputId] = { input: input, type: 'inputText', param: param };
	}
	else if(inputTagName == 'textarea')
	{
		input.focus(function(){
			self.removeInputState(input);
		});

		this.list[inputId] = { input: input, type: 'textarea', param: param };
	}
	else if(inputTagName == 'select')
	{
		input.children('option:first-child').attr('disabled', 'disabled');

		input.change(function(){
			self.removeInputState(input);
		});

		this.list[inputId] = { input: input, type: 'select', param: param };
	}
},

setGlobalState: function(state, text)
{
	this.globalState.removeClass('cadre-small-red cadre-small-blue cadre-small-green');
	this.globalState.css('display', 'block');

	if(state == 1) //error
	{
		this.globalState.addClass('cadre-small-red');
		this.globalState.html('<i class="icon-warning-sign"></i>'+text);
	}
	else if(state == 2) //wait
	{
		this.globalState.addClass('cadre-small-blue');
		this.globalState.html('<i class="icon-spinner icon-spin"></i>'+text);
	}
	else if(state == 0) //ok
	{
		this.globalState.addClass('cadre-small-green');
		this.globalState.html('<i class=icon-ok></i>'+text);
	}
},

addInputState: function(input, state)
{
	this.removeInputState(input);

	var span = document.createElement('span');

	if(state.state == 0)
	{
		span.className = 'form-input-state-ok';
		span.innerHTML = '<i class="icon-ok"></i>'+state.text;
	}
	else
	{
		input.addClass('form-input-error');
		span.className = 'form-input-state-error';
		span.innerHTML = '<i class="icon-remove"></i>'+state.text;
	}

	input.parent().append($(span));
},

removeInputState: function(input)
{
	input.removeClass('form-input-error');

	if(input.next('span').length > 0)
	{
		input.next('span').remove();
	}	
},

valideInputText: function(item)
{
	item.input.val($.trim(item.input.val()));

	if(item.param.isNeeded || item.input.val().length > 0)
	{
		if(item.input.val().length > item.param.maxLength){
			var state = { state: 1, text: 'Champ trop long ('+item.param.maxLength+' max)' };
		}
		else if(item.input.val() < item.param.minLength)
		{
			if(item.input.val().length == 0){
				var state = { state: 1, text: 'Champ vide' };
			}
			else{
				var state = { state: 1, text: 'Champ trop court ('+item.param.minLength+' min)' };
			}
		}
		else if(item.param.isNeeded && item.input.val().length == 0)
		{
			var state = { state: 1, text: 'Champ vide' };
		}
		else if(item.param.regexp && item.param.regexp.code.test(item.input.val()) == false)
		{
			var state = { state: 1, text: item.param.regexp.text };
		}
		else{
			var state = { state: 0, text: 'Ok' };
		}

		this.addInputState(item.input, state);

		return state.state;
	}
	else
	{
		this.removeInputState(item.input);

		return 0;
	}
},

valideTextarea: function(item)
{
	if(item.param.isNeeded || item.input.val().length > 0)
	{
		if(item.param.isNeeded && item.input.val().length == 0)
		{
			var state = { state: 1, text: 'Champ vide' };
		}
		else{
			var state = { state: 0, text: 'Ok' };
		}

		this.addInputState(item.input, state);

		return state.state;
	}
	else
	{
		this.removeInputState(item.input);

		return 0;
	}
},

valideSelect: function(item)
{
	if(item.param.isNeeded)
	{
		if(item.input.val() == null)
		{
			var state = { state: 1, text: 'Selectionner un element' };
		}
		else
		{
			var state = { state: 0, text: 'Ok' };
		}

		this.addInputState(item.input, state);

		return state.state;
	}
	else
	{
		this.removeInputState(item.input);

		return 0;
	}
},

valide: function()
{
	var result = 0;
	var values = {};

	for(var inputId in this.list)
	{
		var item = this.list[inputId];

		if(item.type == 'inputText')
		{
			result += this.valideInputText(item);
			values[inputId] = item.input.val();
		}
		else if(item.type == 'textarea')
		{
			result += this.valideTextarea(item);
			values[inputId] = item.input.val();
		}
		else if(item.type == 'select')
		{
			result += this.valideSelect(item);
			values[inputId] = item.input.val();
		}
	}

	this.onSubmit(result, values);
},

empty: function()
{
	$('#'+this.formId).children().find('fieldset, p, button').remove();
}

};