var Horaire = {

JourList: [],
Jour: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'],
JourAct: '',
MouseDown: '',

Initi: function()
{
	var self = this;

	this.JourList = jQuery.parseJSON(($('#salon-schedule').val()));

	var JourList = document.getElementById('HoraireJour').getElementsByTagName('td');
	for(var i = 0; i < JourList.length; i++)
	{
		JourList[i].title = this.Jour[i];
		JourList[i].innerHTML = this.Jour[i].substring(0, 3);
	}

	var CellList = document.getElementById('HoraireCell').getElementsByTagName('td');
	for(var y = 0; y < CellList.length; y++)
	{
		var CellAct = CellList[y];

		CellAct.innerHTML = '<span></span><span>Fermé</span>';

		(function(z){
			CellAct.onmousedown = function()
			{
				if(this.className == 'Rouge'){ //Close
					self.setJourOpen(z, true);
				}
				else{
					self.setJourClose(z, true);
				}
			};
		})(y);

		CellAct.onmouseover = function()
		{
			this.style.backgroundColor = (this.className == 'Rouge') ? '#f2a89e' : '#c0eec0';
		};
		CellAct.onmouseout = function()
		{
			this.style.backgroundColor = (this.className == 'Rouge') ? '#ed7669' : '#75d975';
		};

		if(typeof this.JourList[y] == 'object' && !this.JourList[y].length){ //BUG Object -> Array
			this.JourList[y] = [];
		}

		if(this.JourList[y] == '0')
		{
			CellAct.firstChild.style.display = 'none';
			CellAct.lastChild.style.display = 'block';

			(function(z){
				self.setJourClose(z, false);
			})(y);
		}
		else
		{
			CellAct.firstChild.style.display = 'block';
			CellAct.lastChild.style.display = 'none';

			this.setIJourTxt(y);
		}
	}

	var ChangeList = document.getElementById('HoraireChange').getElementsByTagName('td');
	for(var j = 0; j < CellList.length; j++)
	{
		ChangeList[j].innerHTML = '<div>Modifier</div>';
		ChangeList[j].firstChild.onmouseover = function(){ this.style.backgroundColor = '#cacaca'; };
		ChangeList[j].firstChild.onmouseout = function(){ this.style.backgroundColor = '#ececec'; };

		(function(z){
			ChangeList[j].onclick = function(){ self.open(this, z); };
		})(j);
	}
},

setJourOpen: function(JourAct, isOver)
{
	var CellAct = document.getElementById('HoraireCell').getElementsByTagName('td')[JourAct];

	CellAct.className = 'Vert';

	if(isOver){ CellAct.style.backgroundColor = '#c0eec0'; }
	else{ CellAct.style.backgroundColor = '#75d975'; }

	CellAct.firstChild.style.display = 'block';
	CellAct.lastChild.style.display = 'none';

	Horaire.JourList[JourAct] = [];
},

setJourClose: function(JourAct, isOver)
{
	var CellAct = document.getElementById('HoraireCell').getElementsByTagName('td')[JourAct];

	CellAct.className = 'Rouge';

	if(isOver){ CellAct.style.backgroundColor = '#f2a89e'; }
	else{ CellAct.style.backgroundColor = '#ed7669'; }

	CellAct.firstChild.innerHTML = '';

	CellAct.firstChild.style.display = 'none';
	CellAct.lastChild.style.display = 'block';

	Horaire.JourList[JourAct] = '0';
},

setIJourTxt: function(JourAct)
{
	var IJourAct = this.JourList[JourAct];
	var R = '';
	var M = 0;

	for(var i = 0; i < IJourAct.length; i++)
	{
		if(M === 0){
			M = 1;
			R += IJourAct[i];
		}
		else if(M === 1){
			M = 2;
			R += ' à '+IJourAct[i];
		}
		else{
			M = 1;
			R += '<br>'+IJourAct[i];
		}
	}

	document.getElementById('HoraireCell').getElementsByTagName('td')[JourAct].firstChild.innerHTML = R;
},

open: function(Obj, JourAct)
{
	var self = this;
	var ObjPosition = $(Obj).offset();
	var Cadre = document.getElementById('CadHoraire');
	var IJourAct = this.JourList[JourAct];
	var CreneauList = document.getElementById('CadHoraireCreneauList');
	var Creneau = document.getElementById('CadHoraireCreneau');
	var CheckBoxList = document.getElementById('CadHoraireCheckBox').getElementsByTagName('input');
	Horaire.JourAct = JourAct;

	$(Cadre).css({ 'left': ObjPosition.left - 130, 'top': ObjPosition.top - 12});

	Cadre.style.display = 'block';
	$(Cadre).css('opacity', 1);

	if(typeof IJourAct == 'string'){
		var isOpen = false;
		Creneau.style.display = 'none';
		CheckBoxList[1].checked = true;
	}
	else{
		var isOpen = true;
		Creneau.style.display = 'block';
		CheckBoxList[0].checked = true;
	}
	$(Creneau).css('opacity', 1);
	$(Creneau.parentNode).css('opacity', 1);

	var onClick = function()
	{
		if(CheckBoxList[0].checked) // Open
		{
			Ot.setOpacity(Creneau, 1);
			Creneau.style.display = 'block';
			Ot.setCursorPosition(CreneauList.getElementsByTagName('input')[0], 'Start');
		}
		else
		{
			Ot.stopFx(Creneau);
			Ot.setOpacity(Creneau, 1);
			new Fx(Creneau, { From: 1, To: 0, Mode: 'opacity', CallBack: function(){ Creneau.style.display = 'none'; } });
		}
	};

	CheckBoxList[0].onclick = onClick;
	CheckBoxList[1].onclick = onClick;

	document.getElementById('CadHoraireJour').innerHTML = this.Jour[JourAct];
	CreneauList.innerHTML = '';

	if(!isOpen || IJourAct.length === 0)
	{
		this.addCreneau('', '');
		this.addCreneau('', '');
	}
	else
	{
		for(var i = 0; i < IJourAct.length; i = i + 2)
		{
			this.addCreneau(IJourAct[i], IJourAct[i+1]);
		}
	}

	if(isOpen){
		Ot.setCursorPosition(CreneauList.getElementsByTagName('input')[0], 'Start');
	}

	this.MouseDown = function(e)
	{
		e = e || window.event;

		var Target = Ot.getTarget(e);

		if(Ot.isAChildOf(Cadre, Target) === false)
		{
			self.close();
		}
	};

	Ot.addEvent(document, 'mousedown', this.MouseDown);
},

addCreneau: function(Var1, Var2)
{
	var CreneauList = document.getElementById('CadHoraireCreneauList');
	var LiList = CreneauList.childNodes;

	if(LiList.length < 5)
	{
		var li = document.createElement('li');
		li.innerHTML = '<input type="text" class="FormInputText" onkeyup="Horaire.KeyPress(this, event)" maxlength="5"/> à <input type="text" class="FormInputText" onkeyup="Horaire.KeyPress(this, event)" maxlength="5"/><img src="image/icone/erreur.png" title="Supprimier ce créneau horaire" class="Pointer" onclick="Horaire.removeCreneau(this)"/>';
		li.getElementsByTagName('input')[0].value = Var1;
		li.getElementsByTagName('input')[1].value = Var2;

		CreneauList.appendChild(li);
	}
},

removeCreneau: function(Obj)
{
	var CreneauList = document.getElementById('CadHoraireCreneauList');
	var LiList = CreneauList.childNodes;

	if(LiList.length > 1){
		CreneauList.removeChild(Obj.parentNode);
	}
	else{
		var InputList = LiList[0].getElementsByTagName('input');
		InputList[0].value = '';
		InputList[1].value = '';
	}
},

valide: function()
{
	if(document.getElementById('CadHoraireCheckBox').getElementsByTagName('input')[0].checked) //Ouvert
	{
		var LiList = document.getElementById('CadHoraireCreneauList').childNodes;
		var R = 0; //Invalide
		var V = 0; //Vide
		var JourList = [];

		for(var i = 0; i < LiList.length ; i++)
		{
			var y = LiList[i].getElementsByTagName('input')[0].value;
			var x = LiList[i].getElementsByTagName('input')[1].value;

			if(x == '' && y == '')
			{
				V += 1;
			}
			else if(this.isHeure(x) && this.isHeure(y))
			{
				JourList.push(y);
				JourList.push(x);
			}
			else{
				R += 1;
			}
		}

		if(R === 0 && V < i)
		{
			this.setJourOpen(this.JourAct, false);
			this.JourList[this.JourAct] = JourList;
			this.setIJourTxt(this.JourAct);
			this.close();
		}
		else if(R !== 0){
			alert('Veuillez rentrer un format correct d\'horaire (exemple: 9h30)');
		}
		else{
			alert('Veuillez rentrer un horaire');
		}
	}
	else
	{
		this.setJourClose(this.JourAct, false);
		this.close();
	}
},

close: function(event)
{
	Ot.stopEvent(document, 'mousedown', this.MouseDown);

	Horaire.JourAct = '';

	var Cadre = document.getElementById('CadHoraire');

	new Fx(Cadre, { From: 1, To: 0, Mode: 'opacity', CallBack: function(){ Cadre.style.display = 'none'; } });
},

isHeure: function(Heure)
{
	var RegExp = /([0-9]{1,2})(H|h|:)((.*){0,2})/;

	if(RegExp.test(Heure) === true) //Forme Valide
	{
		var H = RegExp.exec(Heure)[1];
		var M = RegExp.exec(Heure)[3];

		if(H <= 24 && M <= 60 && (M.length === 0 || (M.length == 2 && !isNaN(M)))){
			return true;
		}
		else{
			return false;
		}
	}
	else{
		return false;
	}
},

KeyPress: function(Input, event)
{
	Input.value = Input.value.replace(/[^0-9(h|H|:)]/g, '').replace(/^(h|H|:)$/,'');
}

};