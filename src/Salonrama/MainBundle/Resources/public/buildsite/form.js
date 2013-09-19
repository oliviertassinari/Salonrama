var GForm = function(LocFileHome, CallBack)
{
	this.LocFileHome = LocFileHome;
	this.ChampList = {};
	this.CallBack = CallBack;
};

Ot.Extend(GForm, {

addChamp: function(Type, Obj, Param)
{
	var self = this;

	this.ChampList[Obj.id] = { Obj: Obj, Type: Type, Param: Param };
	var Champ = this.ChampList[Obj.id];

	if(Type == 'Input')
	{
		Param.ChampErr = (Param.ChampErr) ? Param.ChampErr : Obj.nextSibling;
		Param.LenMin = (Param.LenMin) ? Param.LenMin : 1;
		Param.LenMax = (Param.LenMax) ? Param.LenMax : 40;
		Param.Facul = (Param.Facul) ? Param.Facul : false;

		if(Param.RegExp)
		{
			if(Param.RegExp == 'email'){
				Param.RegExp = { Code : /^[a-zA-Z0-9!#$%&'*+-\/=?^_`.{|}~]{0,64}@[a-z0-9._-]{2,255}\.[a-z]{2,4}$/, errorDescription: 'email invalide' };
				Param.LenMax = 320;
			}
			else if(Param.RegExp == 'Tel'){
				Param.RegExp = { Code : /^[0-9+() _.-:]{6,30}$/, errorDescription: 'Numero invalide' };
				Param.LenMin = 6;
				Param.LenMax = 20;
			}
			else if(Param.RegExp == 'Captcha'){
				Param.RegExp = { Code : /^[a-z]*$/, errorDescription: 'Il doit y avoir que des lettres minuscules' };
				Param.LenMin = 6;
				Param.LenMax = 6;
			}
			else if(Param.RegExp == 'NumClient'){
				Param.RegExp = { Code : /^[0-9]*$/, errorDescription: 'Il doit y avoir que des chiffres' };
				Param.LenMin = 6;
				Param.LenMax = 6;
			}
			else if(Param.RegExp == 'UrlImg'){
				Param.RegExp = { Code : /^(http:\/\/)?([\w\-\.]+)\:?([0-9]*)\/(.*)$/, errorDescription: 'Adresse invalide' };
				Param.LenMax = '';
			}
			else if(Param.RegExp == 'SousDom'){
				Param.RegExp = { Code : /^[a-z0-9]{1}[a-z0-9-]*[a-z0-9]{1}$/, errorDescription: 'Caractères invalides [0-9] [a-z] et [-]' };
				Param.LenMin = 3;
				Param.LenMax = 63;
			}
			else{ Param.RegExp = {}; }
		}
		else{ Param.RegExp = {}; }

		Obj.onblur = function()
		{
			self.VerifInput(Champ, 'Blur');
		};
		Obj.onfocus = function()
		{
			self.VerifInput(Champ, 'Focus');
		};
		Obj.onkeyup = function(e)
		{
			e = e || window.event;
			if(e.keyCode != Ot.Key.Enter)
			{
				self.VerifInput(Champ, 'Key');
			}
		};
		Obj.onkeydown = function(e)
		{
			e = e || window.event;

			if(e.keyCode == Ot.Key.Enter){
				self.Valide();
				return false;
			}
			else{
				return true;
			}
		};

		Param.ChampErr = GFormF.addChampErr(Obj, Param.ChampErr);
	}
	else if(Type == 'Select')
	{
		Param.ChampErr = (Param.ChampErr) ? Param.ChampErr : Obj.nextSibling;
		Param.SelectList = [];

		if(Obj.nodeName.toLowerCase() == 'select')
		{
			Obj.getElementsByTagName('option')[0].setAttribute('disabled','disabled');
			Obj.onchange = function(){ self.VerifSelect(Champ); };
			Param.SelectList.push(Obj);
		}
		else
		{
			SelectList = Obj.getElementsByTagName('select');
			
			for(var i = 0; i < SelectList.length; i++)
			{
				SelectList[i].getElementsByTagName('option')[0].setAttribute('disabled', 'disabled');
				SelectList[i].onchange = function(){ self.VerifSelect(Champ); };
				Param.SelectList.push(SelectList[i]);
			}
		}

		Param.ChampErr = GFormF.addChampErr(Obj, Param.ChampErr);
	}
	else if(Type == 'Radio')
	{
		Param.ChampErr = (Param.ChampErr) ? Param.ChampErr : Obj.nextSibling;

		var RadioList = Obj.getElementsByTagName('input');
		for(var i = 0; i < RadioList.length; i++)
		{
			RadioList[i].onclick = function(){ self.VerifRadio(Champ); };
		}

		Param.ChampErr = GFormF.addChampErr(Obj, Param.ChampErr);
	}
	else if(Type == 'Texta')
	{
		Param.ChampErr = (Param.ChampErr) ? Param.ChampErr : Obj.previousSibling;

		Obj.onfocus = function(){ self.VerifTexta(Champ, 'Focus'); };
		Obj.onkeyup = function(){ self.VerifTexta(Champ, 'Key'); };
		Obj.onblur = function(){ self.VerifTexta(Champ, 'Blur'); };

		Param.ChampErr = GFormF.addChampErr(Obj, Param.ChampErr);
	}
	else if(Type == 'Passe')
	{
		Obj.onkeydown = function(e)
		{
			e = e || window.event;
			if(e.keyCode == Ot.Key.Enter){ self.Valide(); }
		};
		Obj.onkeyup = function(e){
			e = e || window.event;
			if(e.keyCode != Ot.Key.Enter)
			{
				self.VerifPasse(Champ, 1, 'Key');
			}
		};
		Obj.onblur = function(){ self.VerifPasse(Champ, 1, 'Blur'); };
		Obj.onfocus = function(){ self.VerifPasse(Champ, 1, 'Focus'); };

		GFormF.addChampErr(Obj, Obj.nextSibling);

		if(Param.Compar)
		{
			Param.Compar.onkeydown = function(e)
			{
				e = e || window.event;
				if(e.keyCode == Ot.Key.Enter){ self.Valide(); }
			};
			Param.Compar.onkeyup = function(e){
				e = e || window.event;
				if(e.keyCode != Ot.Key.Enter)
				{
					self.VerifPasse(Champ, 2, 'Key');
				}
			};
			Param.Compar.onblur = function(){ self.VerifPasse(Champ, 2, 'Blur'); };
			Param.Compar.onfocus = function(){ self.VerifPasse(Champ, 2, 'Focus'); };

			GFormF.addChampErr(Param.Compar, Param.Compar.nextSibling);
		}
	}
	else if(Type == 'Spin')
	{
		Param.ChampErr = (Param.ChampErr) ? Param.ChampErr : Obj.parentNode.nextSibling;
		
		var keyCodeOk = [Ot.Key.BackSpace, // blackspace, supre, left, rigth , debut, fin
						 Ot.Key.Delete,
						 Ot.Key.Left,
						 Ot.Key.Right,
						 Ot.Key.Debut,
						 Ot.Key.Fin];

		var Img = document.createElement('img');
		Img.className = 'FormSpinInputImg';
		Img.src = this.LocFileHome+'image/icone/blanc.gif';
		if(CClient[0] == 'IExploreur' && CClient[1] < '7.0'){ Img.style.marginTop = '1px'; }

		var maxLength = Param.LenMax+'';
		maxLength = maxLength.length;

		Obj.style.width = (10+8*maxLength)+'px';
		Ot.addClass(Obj, 'FormSpinInputText');
		Ot.addClass(Obj.parentNode, 'FormSpinInput');
		Obj.maxLength = maxLength;
		Ot.insertAfter(Img, Obj);

		Param.ChampErr = GFormF.addChampErr(Obj.parentNode, Param.ChampErr);

		function MouseWheel(e)
		{
			e = e || window.event;
			var Delta = Ot.getDeltaWheel(e);

			if(Delta > 0){ //1
				Add(Obj);
			}
			else{ // -1
				Supr(Obj);
			}

			Ot.cancelEvent(e);
		}
		function getHB(event)
		{
			var ObjPosition = Ot.getObjPosition(Img);
			var MousePosition = Ot.getMousePosition(event);
			var Y = MousePosition.y - ObjPosition.y;

			if(Y < 10){
				return 'H';
			}
			else{
				return 'B';
			}
		}
		
		function Add()
		{
			if(Obj.value == ''){
				Obj.value = 0;
			}
			else if(Obj.value < Param.LenMax){
				Obj.value = parseInt(Obj.value, 10)+1;
			}

			Calibre();
		}
		function Supr()
		{
			if(Obj.value == ''){
				Obj.value = 0;
			}
			else if(Obj.value > Param.LenMin){
				Obj.value = parseInt(Obj.value, 10)-1;
			}

			Calibre();
		}
		function Calibre()
		{
			Obj.value = (Obj.value > Param.LenMax) ? Param.LenMax : Obj.value;
			Obj.value = (Obj < Param.LenMin) ? Param.LenMin : Obj.value;
		}
		function mousedown(HB)
		{
			if(HB == 'H'){
				Ot.addClass(Img, 'FormSpinInputImgClickH');
				Add();
			}
			else{
				Ot.addClass(Img, 'FormSpinInputImgClickB');
				Supr();
			}

			self.VerifSpin(Champ, 'Key');
		}

		Ot.addEvent(Obj, 'mousewheel', MouseWheel);

		Obj.onblur = function()
		{
			Obj.parentNode.className = 'FormSpinInput';

			self.VerifSpin(Champ, 'Blur');
		};
		Obj.onfocus = function()
		{
			Obj.parentNode.className = 'FormSpinInputFocus';

			self.VerifSpin(Champ, 'Focus');
		};
		Obj.onkeydown = function(e)
		{
			e = e || window.event;
			var keyCode = e.keyCode;

			if(keyCode == Ot.Key.Up){
				Add();
			}
			else if(keyCode == Ot.Key.Down){
				Supr();
			}
			else if(keyCode == Ot.Key.Enter){
				self.Valide();
			}
			else if( Ot.Key.isNumber(keyCode) || e.ctrlKey || e.shiftKey || e.altKey || Ot.isInArray(keyCode, keyCodeOk)){ // blackspace, supre, left, rigth 
			}
			else{
				Ot.stopEvent(e);
				Ot.cancelEvent(e);
			}
		};
		Obj.onkeyup = function(e)
		{
			e = e || window.event;
			if(e.keyCode != 13) // ENTRER
			{
				self.VerifSpin(Champ, 'Key');
			}
		};

		Img.onmouseout = function()
		{
			Ot.removeClass(Img, 'FormSpinInputImgOverH');
			Ot.removeClass(Img, 'FormSpinInputImgOverB');
			Ot.removeClass(Img, 'FormSpinInputImgClickH');
			Ot.removeClass(Img, 'FormSpinInputImgClickB');
		};

		Img.onmousedown = function(e)
		{
			e = e || window.event;
			var HB = getHB(e);

			Obj.focus();

			Ot.Cumulator(e, this, function(){ mousedown(HB); });

			return false;
		};

		Img.onmouseup = function()
		{
			Ot.removeClass(Img, 'FormSpinInputImgClickH');
			Ot.removeClass(Img, 'FormSpinInputImgClickB');

			Obj.focus();
		};

		Img.onmousemove = function(e)
		{
			e = e || window.event;
			var HB = getHB(e);

			if(HB == 'H'){
				Ot.addClass(Img, 'FormSpinInputImgOverH');
				Ot.removeClass(Img, 'FormSpinInputImgOverB');
			}
			else{
				Ot.addClass(Img, 'FormSpinInputImgOverB');
				Ot.removeClass(Img, 'FormSpinInputImgOverH');
			}
		};
	}
},

getInputEtat: function(Champ)
{
	var Param = Champ.Param;
	var Value = Champ.Obj.value;

	if(Param.LenMax && !isNaN(Param.LenMax) && Value.length > Param.LenMax){
		var Etat = { error: 1, description: 'Champ trop long ('+Param.LenMax+' max)' };
	}
	else if(Param.LenMin && !isNaN(Param.LenMin) && Value.length < Param.LenMin)
	{
		if(Value.length == 0){
			var Etat = { error: 1, description: 'Champ vide' };
		}
		else{
			var Etat = { error: 1, description: 'Champ trop court ('+Param.LenMin+' min)' };
		}
	}
	else if(Param.RegExp && Param.RegExp.Code && Param.RegExp.Code.test(Value) == false)
	{
		var Etat = { error: 1, description: Param.RegExp.errorDescription };
	}
	else{
		var Etat = { error: 0, description: 'Ok' };
	}

	return Etat;
},

setInputEtat: function(Obj, Etat, Mode, isFacul)
{
	var R = 0;
	var Champ = this.ChampList[Obj.id];

	if(Etat.error == 0)
	{
		if(Mode == 'Key' || Mode == 'Blur'){
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, true, 'Ok');
		}
	}
	else if(Etat.error == 1)
	{
		if(Mode == 'Focus' || Mode == 'Key')
		{
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, '', '');
			R = 1;
		}
		else if(Mode == 'Blur')
		{
			if(isFacul && Etat.description == 'Champ vide')
			{
				GFormF.setChampErr(Obj, Champ.Param.ChampErr, '', '');
			}
			else
			{
				GFormF.setChampErr(Obj, Champ.Param.ChampErr, false, Etat.description);
				R = 1;
			}
		}
	}

	return R;
},

VerifInput: function(Champ, Mode)
{
	var Obj = Champ.Obj;
	var Etat = this.getInputEtat(Champ);

	if(Mode == 'Blur')
	{
		Obj.value = GFormF.Trim(Obj.value);
	}

	return this.setInputEtat(Obj, Etat, Mode, Champ.Param.Facul);
},

VerifSelect: function(Champ)
{
	var R = 0;
	var Obj = Champ.Obj;
	var SelectList = Champ.Param.SelectList;

	var E = 0;
	for(var i = 0; i < SelectList.length; i++)
	{
		if(GFormF.getSelect(SelectList[i]) != 'empty'){
			SelectList[i].style.border = '1px solid #C0C0C0';
		}
		else{
			SelectList[i].style.border = '1px solid #e8002a';
			E += 1;
		}
	}

	if(E == 0){
		GFormF.setChampErr(Obj, Champ.Param.ChampErr, true, 'Ok');
	}
	else if(E == 1)
	{
		GFormF.setChampErr(Obj, Champ.Param.ChampErr, false, 'Champ invalide');
		R = 1;
	}
	else{
		GFormF.setChampErr(Obj, Champ.Param.ChampErr, false, 'Champ incomplet');
		R = 1;
	}

	if(SelectList.length > 1)
	{
		Obj.style.border = '';
	}

	return R;
},

VerifRadio: function(Champ, Mode)
{
	var R = 1;
	var Obj = Champ.Obj;

	if(Mode == 'Blur')
	{
		var Radio = Obj.getElementsByTagName('input');
		for(var i = 0; i < Radio.length; i++)
		{
			if(Radio[i].checked)
			{
				R = 0;
			}
		}

		if(R == 1){
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, false, 'Selectionner un element');
		}
		else{
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, true, 'Ok');
		}
	}
	else
	{
		GFormF.setChampErr(Obj, Champ.Param.ChampErr, true, 'Ok');
	}

	Obj.style.border = '';

	return R;
},

VerifPasse: function(Champ, Type, Mode)
{
	var R = 0;
	var Obj = (Type == 1) ? Champ.Obj : Champ.Param.Compar;
	var RegExp = /^[0-9a-zA-Z]*$/;

	if(Obj.value.length > 25){
		var Etat = { error: 1, description: 'Champ trop long (25 max)' };
	}
	else if(Obj.value.length < 4)
	{
		if(Obj.value.length == 0){
			var Etat = { error: 1, description: 'Champ vide' };
		}
		else{
			var Etat = { error: 1, description: 'Champ trop court (4 min)' };
		}
	}
	else if(Type == 2 && Obj.value != Champ.Obj.value){
		var Etat = { error: 1, description: 'Ne concorde pas' };
	}
	else if(RegExp.test(Obj.value) == false){
		var Etat = { error: 1, description: 'Il de doit y avoir que des lettres et des chiffres' };
	}
	else{
		var Etat = { error: 0, description: 'Ok' };
	}


	if(Mode == 'Blur'){
		Obj.value = GFormF.Trim(Obj.value);
	}


	if(Etat.error == 0)
	{
		if(Mode == 'Key' || Mode == 'Blur'){
			GFormF.setChampErr(Obj, Obj.nextSibling, true, 'Ok');
		}
	}
	else if(Etat.error == 1)
	{
		if(Mode == 'Focus' || Mode == 'Key')
		{
			GFormF.setChampErr(Obj, Obj.nextSibling, '', '');
			R = 1;
		}
		else if(Mode == 'Blur')
		{
			GFormF.setChampErr(Obj, Obj.nextSibling, false, Etat.description);
			R = 1;
		}
	}

	if(Type == 1)
	{
		this.setPasseLevel(Obj.value);

		if(Champ.Param.Compar.value != '')
		{
			R += this.VerifPasse(Champ, 2, Mode);
		}
	}

	return R;
},

VerifSpin: function(Champ, Mode)
{
	var R = 0;
	var Obj = Champ.Obj;
	var Value = Obj.value;

	if(Value == ''){
		var Etat = { error: 1, description: 'Champ vide' };
	}
	else if(isNaN(Value)){
		var Etat = { error: 1, description: 'Uniquement des chiffres' };
	}
	else if(Champ.Param.LenMax < Value){
		var Etat = { error: 1, description: 'trop grand ('+Champ.Param.LenMax+' max)' };
	}
	else if(Champ.Param.LenMin > Value){
		var Etat = { error: 1, description: 'trop petit ('+Champ.Param.LenMin+' min)' };
	}
	else{
		var Etat = { error: 0, description: 'Ok' };
	}

	if(Etat.error == 0)
	{
		if(Mode == 'Key' || Mode == 'Blur'){
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, true, 'Ok');
		}
	}
	else if(Etat.error == 1)
	{
		if(Mode == 'Focus' || Mode == 'Key')
		{
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, '', '');
			R = 1;
		}
		else if(Mode == 'Blur')
		{
			if(Champ.Param.Facul && Etat.description == 'Champ vide')
			{
				GFormF.setChampErr(Obj, Champ.Param.ChampErr, '', '');
			}
			else
			{
				GFormF.setChampErr(Obj, Champ.Param.ChampErr, false, Etat.description);
				R = 1;
			}
		}
	}

	return R;
},

setPasseLevel: function(Value)
{
	var Level = 0;
	var PasseLevel = document.getElementById('FormPasseLevel');
	var PasseLevelText = PasseLevel.getElementsByTagName('strong')[0];

	if(Value.length >= 4) //caractaire mini
	{
		Level += 1;

		if(Value.search('[A-Z]') != -1)
		{
			var MajAll = new RegExp('[A-Z]{'+Value.length+'}');
			if(MajAll.test(Value) == false)
			{
				Level += 1;
			}
		}

		if(Value.search('[0-9]') != -1)
		{
			var ChiffreAll = new RegExp('[0-9]{'+Value.length+'}');
			if(ChiffreAll.test(Value) == false)
			{
				Level += 1;
			}
		}

		if(Value.length >= 8 || Value.search('[\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]') != -1){
			Level += 1;
		}

		//Toujour le meme charactaure
		var all = '';
		for(var i = 1; i <= Value.length; i++){
			all += Value.substring(0, 1);
		}
		if(all == Value){ 
			Level = 1;
		}
	}

	if(Level == 0){
		PasseLevel.className = 'FormPasseLevel';
		PasseLevelText.innerHTML = 'Trop court';
	}
	else if(Level == 1){
		PasseLevel.className = 'FormPasseLevel Bas';
		PasseLevelText.innerHTML = 'Faible';
	}
	else if(Level == 2){
		PasseLevel.className = 'FormPasseLevel Moy';
		PasseLevelText.innerHTML = 'Moyen';
	}
	else if(Level >= 3){
		PasseLevel.className = 'FormPasseLevel Bon';
		PasseLevelText.innerHTML = 'Bon';
	}
},

VerifTexta: function(Champ, Mode)
{
	var R = 0;
	var Obj = Champ.Obj;

	if(Obj.value != '')
	{
		GFormF.setChampErr(Obj, Champ.Param.ChampErr, true, 'Ok');
	}
	else if(Mode == 'Blur')
	{
		if(Obj.value == '')
		{
			GFormF.setChampErr(Obj, Champ.Param.ChampErr, false, 'Champ vide');
			R = 1;
		}
	}
	else{
		GFormF.setChampErr(Obj, Champ.Param.ChampErr, '', '');
	}

	return R;
},

VerifAll: function()
{
	var R = 0;

	for(var i in this.ChampList)
	{
		var Champ = this.ChampList[i];

		if(Champ.Type == 'Select')
		{
			R += this.VerifSelect(Champ);
		}
		else if(Champ.Type == 'Radio')
		{
			R += this.VerifRadio(Champ, 'Blur');
		}
		else if(Champ.Type == 'Texta')
		{
			R += this.VerifTexta(Champ, 'Blur');
		}
		else if(Champ.Type == 'Input')
		{
			R += this.VerifInput(Champ, 'Blur');
		}
		else if(Champ.Type == 'Passe')
		{
			R += this.VerifPasse(Champ, 1, 'Blur');
			R += this.VerifPasse(Champ, 2, 'Blur');
		}
		else if(Champ.Type == 'Spin')
		{
			R += this.VerifSpin(Champ, 'Blur');
		}
	}

	return R;
},

Valide: function()
{
	var R = this.VerifAll();

	if(Ot.isFonc(this.CallBack))
	{
		this.CallBack(R);
	}
},

Succes: function(FormPost, FormEtat, Text)
{
	FormPost.style.height = FormPost.offsetHeight +'px';
	FormPost.innerHTML = '';

	FormPost.appendChild(FormEtat);
	Ot.setOpacity(FormEtat, 0);

	var self = this;
	new Fx(FormPost, { To: 50, Mode: 'height', duree: 400, CallBack: function()
	{
		self.setFormEtat(FormEtat, true, Text);

		FormEtat.parentNode.style.height = '';
		new Fx(FormEtat, { From: 0, To: 1, Mode: 'opacity' });
	}});
},

setFormEtat: function(FormEtat, Etat, Text)
{
	if(Etat === true){
		FormEtat.className = 'FormEtat CadColor CadVert';
		FormEtat.innerHTML = '<img src="'+this.LocFileHome+'image/icone/ok2.png" class="CadIconeTxt"/>'+Text;
	}
	else if(Etat === false){
		FormEtat.className = 'FormEtat CadColor CadRouge';
		FormEtat.innerHTML = '<img src="'+this.LocFileHome+'image/icone/alert.png" class="CadIconeTxt"/>'+Text;
	}
	else if(Etat == 'load'){
		FormEtat.className = 'FormEtat CadColor CadBlue';
		FormEtat.innerHTML = '<img src="'+this.LocFileHome+'image/icone/chargement.gif" class="CadIconeTxt"/>'+Text;
	}
	else if(Etat == ''){
		FormEtat.className = '';
		FormEtat.style.visibility = 'visible';
		FormEtat.innerHTML = '';
		Ot.stopFx(FormEtat);
		Ot.setOpacity(FormEtat, 0);
	}
}

});


var GFormF = {

newCaptcha: function()
{
	Ot.SendAjax('POST', 'php/Captcha.php', { getCode: 'on' }, function(xhr)
	{
		document.getElementById('CaptchaImg').src = 'php/Captcha.php?code='+xhr.responseText;
		document.getElementById('CaptchaInput').value = "";
		document.getElementById('CaptchaInput').focus();
	});
},

Trim: function(Var)
{
    while(Var.substring(0, 1) == ' '){
        Var = Var.substring(1, Var.length);
    }

    while(Var.substring(Var.length-1, Var.length) == ' '){
        Var = Var.substring(0, Var.length-1);
    }

    return Var;
},

getRadio: function(Obj)
{
	var R = false;
	var Radio = Obj.getElementsByTagName('input');
	for(var i = 0; i < Radio.length; i++)
	{
		if(Radio[i].checked){
			R = Radio[i].value;
			break;
		}
	}
	return R;
},

getSelect: function(Obj)
{
	return Obj.options[Obj.selectedIndex].value;
},

$V: function(Value)
{
	return document.getElementById(Value).value;
},

setChampErr: function(Champ, ChampErr, Etat, Text)
{
	if(Etat === true){
		ChampErr.className = 'FormChampErrVert';
		Champ.style.border = '';
	}
	else if(Etat === false){
		ChampErr.className = 'FormChampErrRouge';
		Champ.style.border = '1px solid #e8002a';
	}
	else if(Etat == ''){
		ChampErr.className = 'FormChampErr';
		Champ.style.border = '';
	}

	ChampErr.innerHTML = Text;
},

addChampErr: function(Obj, Pos)
{
	var ChampErr = document.createElement('span');
	ChampErr.className = 'FormChampErr';

	if(!Pos || !Pos.className || ( Pos.className != 'FormChampErr' && Pos.className != 'FormChampErrVert' && Pos.className != 'FormChampErrRouge'))
	{
		if(Pos && Pos == Obj.previousSibling)
		{
			Obj.parentNode.insertBefore(ChampErr, Pos.nextSibling);
		}
		else if(Pos){
			Obj.parentNode.insertBefore(ChampErr, Pos);
		}
		else{
			Obj.parentNode.appendChild(ChampErr);
		}
	}
	else{
		ChampErr = Pos;
	}

	return ChampErr;
},

InputObserve: function(Obj, Text)
{
	if(Obj.value == '')
	{
		Obj.value = Text;
		Obj.style.color = '#777';
	}

	Obj.onfocus = function()
	{
		if(Obj.value == Text)
		{
			Obj.value = '';
			Obj.style.color = '';
		}
	};

	Obj.onblur = function()
	{
		if(Obj.value == '')
		{
			Obj.value = Text;
			Obj.style.color = '#777';
		}
	};
}

};


function CheckBox(Obj, checked, onChange)
{
	var self = this;

	if(checked){
		this.checked = checked;
	}
	else{
		this.checked = false;
	}

	this.Obj = Obj;

	Obj.className = 'CheckBox';
	this.onclick();
	this.onclick();

	this.onChange = onChange;

	Obj.onmouseover = function(){ Ot.addClass(this, 'Hover'); };
	Obj.onmouseout = function(){ Ot.removeClass(this, 'Hover'); };
	Obj.onclick = function(){ self.onclick(); };

	var LabelList = Obj.parentNode.getElementsByTagName('label');
	if(LabelList[0])
	{
		LabelList[0].onclick = function(){ self.onclick(); };
	}
}

Ot.Extend(CheckBox, { 

onclick: function()
{
	this.checked = !this.checked;

	if(this.checked == true){
		Ot.addClass(this.Obj, 'Checked');
		this.Obj.title = 'décocher';
	}
	else{
		Ot.removeClass(this.Obj, 'Checked');
		this.Obj.title = 'cocher';
	}

	if(this.onChange && Ot.isFonc(this.onChange))
	{
		this.onChange(this.checked);
	}
}

});