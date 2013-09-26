var Form = function(form, onSubmit, editMode)
{
	var self = this;

	this.form = form;
	this.globalState = form.find('.form-global-state');
	this.onSubmit = onSubmit;
	this.submit = form.find('button[type="submit"]');
	this.list = {};

	this.submit.click(function(event){
		event.preventDefault();
		self.valide();
	});

	if(typeof(editMode) != 'undefined')
	{
		this.editMode = editMode;
	}
	else
	{
		this.editMode = false;
	}
};

Form.prototype = {

addInput: function(inputId, option)
{
	var self = this;
	var input = $('#'+inputId);

	if(input.length == 0)
	{
		input = this.form.find("input:radio[name="+inputId+"]");
	}

	var inputTagName = input.prop('tagName').toLowerCase();

	option = $.extend({
		isNeeded: true,
		inputStateEnd: false
	}, option);

	if(inputTagName == 'input' && (input.prop('type').toLowerCase() == 'text' || input.prop('type').toLowerCase() == 'password'))
	{
		option.minLength = (typeof option.minLength == 'number') ? option.minLength : 0;
		option.maxLength = (typeof option.maxLength == 'number') ? option.maxLength : 40;

		if(option.regexp == 'email')
		{
			option.regexp = { code : /^[a-zA-Z0-9!#$%&'*+-\/=?^_`.{|}~]{0,64}@[a-z0-9._-]{2,255}\.[a-z]{2,4}$/, text: "L'email est invalide" };
			option.maxLength = 320;
		}
		else if(option.regexp == 'phone'){
			option.regexp = { code : /^[0-9+() _.-:]{6,30}$/, text: 'Numero invalide' };
			option.minLength = 6;
			option.maxLength = 20;
		}
		else if(option.regexp == 'subdomain'){
			option.regexp = { code : /^[a-z0-9]{1}[a-z0-9-]*[a-z0-9]{1}$/, text: 'Caractères invalides [0-9] [a-z] et [-]' };
			option.minLength = 3;
			option.maxLength = 63;
		}

		input.on('input', function(){
			self.onChange(input);
		});

		this.list[inputId] = { input: input, type: 'inputText', option: option };
	}
	else if(inputTagName == 'input' && input.prop('type').toLowerCase() == 'checkbox')
	{
		this.list[inputId] = { input: input, type: 'checkbox', option: option };

		input.change(function(){
			self.onChange(input);
		});
	}
	else if(inputTagName == 'input' && input.prop('type').toLowerCase() == 'hidden')
	{
		this.list[inputId] = { input: input, type: 'hidden', option: option };

		input.change(function(){
			self.onChange(input);
		});
	}
	else if(inputTagName == 'input' && input.prop('type').toLowerCase() == 'radio')
	{
		this.list[inputId] = { input: input, type: 'radio', option: option };
	}
	else if(inputTagName == 'textarea')
	{
		input.on('input', function(){
			self.onChange(input);
		});

		this.list[inputId] = { input: input, type: 'textarea', option: option };
	}
	else if(inputTagName == 'select')
	{
		input.children('option:first-child').attr('disabled', 'disabled');

		input.change(function(){
			self.onChange(input);
		});

		this.list[inputId] = { input: input, type: 'select', option: option };
	}
},

setInitValue: function()
{
	for(var inputId in this.list)
	{
		var item = this.list[inputId];

		if(item.type == 'inputText' || item.type == 'hidden')
		{
			item.initValue = item.input.val();
		}
		else if(item.type == 'checkbox')
		{
			item.initValue = item.input.prop('checked')
		}
	}

	this.submit.prop('disabled', true);
},

onChange: function(input)
{
	this.removeInputState(input);
	this.setGlobalState(null);

	if(this.editMode)
	{
		var disable = true;

		for(var inputId in this.list)
		{
			var item = this.list[inputId];

			if(item.type == 'inputText' || item.type == 'hidden')
			{
				var value = item.input.val();
			}
			else if(item.type == 'checkbox')
			{
				var value = item.input.prop('checked');
			}

			if(value != item.initValue)
			{
				disable = false;
				break;
			}
		}

		this.submit.prop('disabled', disable);
	}
},

setGlobalState: function(state, text)
{
	if(state == null) //hide
	{
		this.globalState.css('display', 'none');
	}
	else
	{
		this.globalState.removeClass('frame-small-red frame-small-blue frame-small-green');
		this.globalState.css('display', 'block');

		if(state == 1) //error
		{
			this.globalState.addClass('frame-small-red');
			this.globalState.html('<i class="icon-warning-sign"></i>'+text);
		}
		else if(state == 2) //wait
		{
			this.globalState.addClass('frame-small-blue');
			this.globalState.html('<i class="icon-spinner icon-spin"></i>'+text);
		}
		else if(state == 0) //ok
		{
			this.globalState.addClass('frame-small-green');
			this.globalState.html('<i class=icon-ok></i>'+text);
		}
	}
},

setInputState: function(input, state)
{
	this.removeInputState(input);
	this.addInputState(input, state);
},

addInputState: function(input, state)
{
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

	if(this.list[input.attr('id')].option.inputStateEnd)
	{
		$(span).insertAfter(input.parent().children().last());
	}
	else
	{
		input.after($(span));
	}
},

removeInputState: function(input)
{
	input.removeClass('form-input-error');
	input.parent().find('.form-input-state-ok, .form-input-state-error').remove();
},

valideInputText: function(item)
{
	item.input.val($.trim(item.input.val()));

	if(item.option.isNeeded || item.input.val().length > 0)
	{
		if(item.input.val().length > item.option.maxLength){
			var state = { state: 1, text: 'Champ trop long ('+item.option.maxLength+' max)' };
		}
		else if(item.input.val().length < item.option.minLength)
		{
			if(item.input.val().length == 0){
				var state = { state: 1, text: 'Champ vide' };
			}
			else{
				var state = { state: 1, text: 'Champ trop court ('+item.option.minLength+' min)' };
			}
		}
		else if(item.option.isNeeded && item.input.val().length == 0)
		{
			var state = { state: 1, text: 'Champ vide' };
		}
		else if(item.option.regexp && item.option.regexp.code.test(item.input.val()) == false)
		{
			var state = { state: 1, text: item.option.regexp.text };
		}
		else{
			var state = { state: 0, text: 'Ok' };
		}

		this.setInputState(item.input, state);

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
	if(item.option.isNeeded || item.input.val().length > 0)
	{
		if(item.option.isNeeded && item.input.val().length == 0)
		{
			var state = { state: 1, text: 'Champ vide' };
		}
		else{
			var state = { state: 0, text: 'Ok' };
		}

		this.setInputState(item.input, state);

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
	if(item.option.isNeeded)
	{
		if(item.input.val() == null)
		{
			var state = { state: 1, text: 'Selectionner un element' };
		}
		else
		{
			var state = { state: 0, text: 'Ok' };
		}

		this.setInputState(item.input, state);

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
		else if(item.type == 'checkbox')
		{
			values[inputId] = item.input.prop('checked');
		}
		else if(item.type == 'hidden')
		{
			values[inputId] = item.input.val();
		}
		else if(item.type == 'radio')
		{
			values[inputId] = this.form.find("input:radio[name="+inputId+"]:checked").val();
		}
	}

	this.onSubmit(result, values, this);
},

empty: function()
{
	this.form.children().find('fieldset, p, button').remove();
}

};