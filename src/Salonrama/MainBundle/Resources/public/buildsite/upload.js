var Upload = {

List: {},

initi: function(Obj, Arg)
{
	var FlashVersion = Flash.getVersion();
	var FlashVersionMin = new Flash.Version([9, 0, 0]);

	if(FlashVersion.isSuperieur(FlashVersionMin)) //Flash Activer et compatible
	{
		this.List[Obj.id] = new SWFUpload(Obj, Arg);
	}
	else //Version Basic
	{
		this.List[Obj.id] = new PHPUpload(Obj, Arg);
	}
},

getExtension: function(Nom)
{
	return Nom.substring(Nom.lastIndexOf('.')+1, Nom.length).toLowerCase();
},

getTaille: function(Volume, Ue, Ve)
{
	function Arrondir(Nombre, Chiffaprvir) 
	{ 
		var Chiffalv = Math.pow(10, Chiffaprvir);
		return Math.round(Nombre * Chiffalv )/ Chiffalv;
	}

	if(Ve == 'Octet'){
		var Taille = Volume;
	}
	else if(Ve == 'Bytes'){
		var Taille = Volume / 1.024;
	}

	var UniteListe = ['Oc','Ko', 'Mo', 'Go'];
	var Unite = Ue;

	var boucle = Taille;
	while(boucle > 1000)
	{
		Taille /= 1000;
		Unite += 1;

		boucle /= 1000;
	}

	if(Taille < 10){
		Taille = Arrondir(Taille, 2) + UniteListe[Unite];
	}
	else if(Taille < 100){
		Taille = Arrondir(Taille, 1) + UniteListe[Unite];
	}
	else if(Taille < 1000){
		Taille = Arrondir(Taille, 0) + UniteListe[Unite];
	}

	return Taille;
},

UploadVitesseInfo: [0,0,0],

UploadVitesse: function(BytesAcc)
{
	var date = new Date();
	var Time = Date.UTC(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds())/1000; // mili-seconde

	var Vitesse;
	var d = BytesAcc - this.UploadVitesseInfo[0];
	var t = Time - this.UploadVitesseInfo[1];

	if(this.UploadVitesseInfo[0] != 0)
	{
		if(t == 0){
			Vitesse = d / 1;
		}
		else{
			Vitesse = d / t;
		}
	}
	else{
		Vitesse = 0;
	}

	Vitesse = Math.round((Vitesse / 1.024) / 1000);

	this.UploadVitesseInfo[0] = BytesAcc;
	this.UploadVitesseInfo[1] = Time;
	this.UploadVitesseInfo[2] = Vitesse;

	return Vitesse + 'ko/s';
},

UploadTempsRestant: function(BytesAcc, BytesTotal, FichierId)
{
	var BytesRest = BytesTotal - BytesAcc; //byte
	var OctetRest = (BytesRest / 1.024) / 1000; //ko
	var Minutes = 0;
	var Secondes = 0;

	if(this.UploadVitesseInfo[2] != 0)
	{
		var TempsRest = Math.round(OctetRest / this.UploadVitesseInfo[2]);

		if(TempsRest > 60)
		{
			var boucle = TempsRest;
			while(boucle > 60)
			{
				Minutes += 1;
				Secondes = boucle - 60;

				boucle = Secondes;
			}
		}
		else{
			Secondes = TempsRest;
		}
	}

	if(Minutes < 10){
		Minutes = '0' + Minutes;
	}
	if(Secondes < 10){
		Secondes = '0' + Secondes;
	}

	return  Minutes+':'+Secondes + ' restant(s)';
},

setEtatAct: function(Class)
{
	if(document.getElementById(Class.Obj.id))
	{
		var FileListNbr = Class.FileList.length;
		var BoutSuprFileAll = Class.BoutSuprFileAll;
		var BoutUploadStart = Class.BoutUploadStart;

		if(Class.MaxFile == 1)
		{
			if(Class.FileAct === '')
			{
				if(FileListNbr == 0){
					BoutUploadStart.style.display = 'none';
					var Text = 'En attente';
				}
				else{
					BoutUploadStart.style.display = 'inline';
					var Text = 'Pret';
				}
			}
			else
			{
				var Text = 'Upload en cours';
			}
			BoutSuprFileAll.style.visibility = 'hidden';
		}
		else
		{
			if(Class.FileAct === '')
			{
				if(FileListNbr == 0){
					BoutUploadStart.style.display = 'none';
					BoutSuprFileAll.style.visibility = 'hidden';
				}
				else{
					BoutUploadStart.style.display = 'inline';
					BoutSuprFileAll.style.visibility = 'visible';
				}

				if(FileListNbr > 1){
					var Text = FileListNbr + ' images dans la fil d\'attente :';
				}
				else{
					var Text = FileListNbr + ' image dans la fil d\'attente :';
				}
			}
			else
			{
				var Text = 'Upload en cours : '+FileListNbr+' images restantes';
			}
		}

		Class.UploadEtat.innerHTML = Text;
	}
},

setFileListScroll: function(Class, Mode)
{
	var UploadFileList = Class.UploadFileList;

	if(Mode == 'add')
	{
		var UploadFile = UploadFileList.firstChild.lastChild;

		if(UploadFile)
		{
			Ot.setScrollOpt(UploadFileList, UploadFile);
		}
	}
	else if(Mode == 'uploadStart')
	{
		if(Class.FileAct !== '')
		{
			if(document.getElementById(Class.FileList[Class.FileAct])){
				var UploadFile = document.getElementById(Class.FileList[Class.FileAct]);
			}
			else{
				var UploadFile = document.getElementById('UploadFile'+Class.FileList[Class.FileAct]);
			}

			Ot.setScrollOpt(UploadFileList, UploadFile);
		}
	}
},

setFileError: function(UploadFile, Text)
{
	UploadFile.className = 'UploadFile CadRouge';
	UploadFile.lastChild.innerHTML = Text;
	UploadFile.removeChild(UploadFile.firstChild);

	if(document.getElementById(UploadFile.id+'_P')){
		document.getElementById(UploadFile.id+'_P').style.display = 'none';
	}

	window.setTimeout(function(){ Upload.removeFile(UploadFile); }, 5000);
},

removeFile: function(UploadFile)
{
	if(document.getElementById(UploadFile.id))
	{
		new Fx(UploadFile, { From: 1, To: 0, Mode: 'opacity', CallBack: function()
		{
			UploadFile.parentNode.removeChild(UploadFile);
		}});
	}
}

};


var SWFUpload = function(Obj, Arg)
{
	for(var i in Arg){ //Initalisation Var
		this[i] = Arg[i];
	}
	this.Obj = Obj;

	var self = this;
	var FlashId = Ot.getRandId('Flash');

	if(this.MaxFile == 1){
		var TypeTxt = 'une image';
		var TypeSelect = 'One';
	}
	else{
		var TypeTxt = 'vos images';
		var TypeSelect = 'Many';
	}

	Ot.addClass(Obj, 'Upload');
	Obj.innerHTML = 'Sélectionnez '+TypeTxt+' sur votre ordinateur (.'+this.ExtensionImage.join(' .')+'), 10Mo max'+
	'<div class="UploadFormList"></div>'+
	'<span></span>'+
	'<div class="UploadFileList"><div style="position:absolute;"></div></div>'+
	'<button type="button" class="ButtonSmallRed"><img src="image/icone/erreur.png"/>Vider la file d\'attente</button>';


	var FlashObj = new Flash.Obj(this.SWFUrl, FlashId, '219', '31', '8', '#fff', 'high');
	FlashObj.addParam('wmode', 'visible');
	FlashObj.useExpressInstall('creator/ExpressInstall.swf');
	FlashObj.addVariable('uploadURL', Ot.getCompletUrl(this.uploadUrl));
	FlashObj.addVariable('TypeSelect', TypeSelect);
	FlashObj.addVariable('UploadId', Obj.id);
	FlashObj.addVariable('DataPost', this.DataPost);
	FlashObj.addVariable('PostName', 'addUploadFile');
	FlashObj.add(Obj.getElementsByTagName('div')[0]);


	this.FlashObj = FlashObj;
	this.FileList = [];
	this.FileAct = '';
	this.UploadEtat = Obj.getElementsByTagName('span')[0];
	this.UploadFileList = Obj.getElementsByTagName('div')[1];
	this.BoutSuprFileAll = Obj.lastChild;

	Ot.setOpacity(this.UploadFileList, 1);

	this.BoutSuprFileAll.onclick = function(){ self.SuprFileAll(); };
	this.BoutUploadStart.onclick = function(){ self.UploadStart(); };

	Upload.setEtatAct(this);
};

Ot.Extend(SWFUpload,{

BoutUploadStart: null,
onUploadSuccess: function(){},
onUploadStart: function(){},
onUploadFinish: function(){},
MaxFile: 0, //0 = Illimité
SWFUrl: '',
uploadUrl: '',
DataPost: '',

FileList: [],
FileAct: '',

AddFile: function(name, size, isErreur, textErreur)
{
	var Nom = Ot.getTextLenMax(name, 40);
	size = Upload.getTaille(size, 0, 'Bytes'); //EN OCTE

	var Id = Ot.getRandId('UploadFile');
	var UploadFile = document.createElement('div');
	UploadFile.className = 'UploadFile';
	UploadFile.id = Id;
	UploadFile.innerHTML = '<div class="CadClose" title="Enlever cette image"></div>'+
	'<div class="UploadFileIcone"></div>'+
	'<div class="UploadFileInfo"><strong class="UploadFileNom">'+Nom+'</strong><span class="UploadFileTaille"> ~ '+size+'</span></div>'+
	'<div class="UploadFileProgresse" id="'+Id+'_P"><div class="UploadFileProgresseBarre"></div><div class="UploadFileProgresseTxt">0%</div></div>'+
	'<div class="UploadFileEtat">Prêt</div>';

	var self = this;
	UploadFile.firstChild.onclick = function(){ self.SuprFile(Id); };
	Ot.setOpacity(UploadFile, 0);

	this.UploadFileList.firstChild.appendChild(UploadFile);

	new Fx(UploadFile, { From: 0, To: 1, Mode: 'opacity' });

	if(this.MaxFile != 0 && this.FileList.length == this.MaxFile)
	{
		Upload.setFileError(UploadFile, this.MaxFile+' image max.');
	}
	else if(isErreur == false)
	{
		this.FileList.push(Id);
		Upload.setEtatAct(this);
		Upload.setFileListScroll(this, 'add');
	}
	else
	{
		Upload.setFileError(UploadFile, textErreur);
	}
},

SuprFile: function(Id)
{
	var KeyId = Ot.getKeyArrayValue(this.FileList, Id);
	var UploadFile = document.getElementById(Id);

	this.FlashObj.Obj.SuprFile(KeyId);
	this.FileList = Ot.ArrayRemove(this.FileList, KeyId);

	if(this.FileAct !== '') //Upload en cours
	{
		Upload.setFileError(UploadFile, 'Annuler');
	}
	else
	{
		UploadFile.removeChild(UploadFile.firstChild);
		Upload.removeFile(UploadFile);
	}

	Upload.setEtatAct(this);
},

SuprFileAll: function()
{
	while(this.FileList.length > 0)
	{
		this.SuprFile(this.FileList[0]);
	}

	this.FileList = [];
	this.FlashObj.Obj.SuprFileAll();
},

UploadStart: function()
{
	this.BoutSuprFileAll.style.visibility = 'hidden';
	this.BoutUploadStart.style.display = 'none';

	this.onUploadStart();
	this.FlashObj.Obj.UploadStart();
},

UploadNext: function(Pos)
{
	if(this.FileList[Pos]) //Image suivant
	{
		this.FileAct = Pos;

		var UploadFile = document.getElementById(this.FileList[Pos]);
		UploadFile.lastChild.innerHTML = '<img src="image/icone/load.gif"/>En cours...<div></div>';
		UploadFile.className = 'UploadFile CadOrange';

		Upload.setEtatAct(this);
		Upload.setFileListScroll(this, 'uploadStart');
	}
	else //Fin du l'upload
	{
		this.FileList = [];
		this.FileAct = '';

		Upload.setEtatAct(this);
		this.onUploadFinish();
	}
},

UploadProgresse: function(BytesAcc, BytesTotal)
{
	var UploadFile = document.getElementById(this.FileList[this.FileAct]);
	var Pourcent = Math.ceil((BytesAcc / BytesTotal) * 100);
	var Progresse = document.getElementById(this.FileList[this.FileAct]+'_P');

	Progresse.firstChild.style.left = Math.round(-150 + (150 * (Pourcent / 100)))+'px';
	Progresse.lastChild.innerHTML = Pourcent+'%';

	if(BytesAcc == BytesTotal){
		UploadFile.lastChild.lastChild.innerHTML = 'traitement en cours...';
	}
	else{
		UploadFile.lastChild.lastChild.innerHTML = Upload.getTaille(BytesAcc, 0, 'Bytes')+ '/' +Upload.getTaille(BytesTotal, 0, 'Bytes')+' à '+ Upload.UploadVitesse(BytesAcc) + ' '+Upload.UploadTempsRestant(BytesAcc, BytesTotal);
	}
},

UploadComplet: function(isSucced, Rtext)
{
	var Id = this.FileList[this.FileAct];
	var UploadFile = document.getElementById(Id);

	this.FileList = Ot.ArrayRemove(this.FileList, this.FileAct);

	if(isSucced)
	{
		var self = this;

		Ot.decodeAjaxReturn(Rtext, function(description)
		{
			UploadFile.className = 'UploadFile CadVert';
			UploadFile.lastChild.innerHTML = 'Ajoutée';
			UploadFile.removeChild(UploadFile.firstChild);
			document.getElementById(Id+'_P').style.display = 'none';
			window.setTimeout(function(){ Upload.removeFile(UploadFile); }, 3000);

			self.onUploadSuccess(description);
		},
		function(description)
		{
			Upload.setFileError(UploadFile, description);
		});
	}
	else
	{
		Upload.setFileError(UploadFile, Rtext);
	}
}

});

var PHPUpload = function(Obj, Arg)
{
	for(var i in Arg){ //Initaalisation Var
		this[i] = Arg[i];
	}
	this.Obj = Obj;

	var self = this;

	if(this.MaxFile == 1){
		var T = 'une image';
	}
	else{
		var T = 'vos images une à une';
	}

	var UploadIframeId = Ot.getRandId('UploadIframe');
	
	Ot.addClass(Obj, 'Upload');
	Obj.innerHTML = '<iframe src="about:blank" name="'+UploadIframeId+'" id="'+UploadIframeId+'"></iframe>'+
	'Sélectionnez '+T+' sur votre ordinateur (.'+this.ExtensionImage.join(' .')+'), 10Mo max'+
	'<div class="UploadFormList"></div>'+
	'<span></span>'+
	'<div class="UploadFileList"><div style="position:absolute;"></div></div>'+
	'<button type="button" class="ButtonSmallRed"><img src="image/icone/erreur.png"/>Vider la file d\'attente</button>';


	Ot.addEvent(Obj.getElementsByTagName('iframe')[0], 'load', function(){ self.UpCallBack(); });

	this.UploadIframeId = UploadIframeId;
	this.FileList = [];
	this.FileAct = '';
	this.UploadFormList = Obj.getElementsByTagName('div')[0];
	this.UploadEtat = Obj.getElementsByTagName('span')[0];
	this.UploadFileList = Obj.getElementsByTagName('div')[1];
	this.BoutSuprFileAll = Obj.lastChild;

	Ot.setOpacity(this.UploadFileList, 1);

	this.BoutSuprFileAll.onclick = function(){ self.SuprFileAll(); };
	this.BoutUploadStart.onclick = function(){ self.UploadStart(); };

	Upload.setEtatAct(this);
	this.AddForm();
};

Ot.Extend(PHPUpload, {

BoutUploadStart: null,
onUploadSuccess: function(){},
onUploadStart: function(){},
onUploadFinish: function(){},
MaxFile: 0, //0 = Illimité
uploadUrl: '',

FileList: [],
FileAct: '',

isIframeLoad: false,

UpCallBack: function()
{
	if(this.isIframeLoad == true || CClient[0] == 'Chrome'){
		this.UploadComplet();
	}
	else{
		this.isIframeLoad = true;
	}
},

AddFile: function(Obj)
{
	var Nom = Obj.value;

	if(Nom != '')
	{
		Nom = Nom.substring(Nom.lastIndexOf('\\')+1, Nom.length);
		var Extension = Upload.getExtension(Nom);
		Nom = Ot.getTextLenMax(Nom, 40);

		var FormId = Obj.parentNode.id;
		var self = this;
		var Id = FormId.substring(10, FormId.length);

		var UploadFile = document.createElement('div');
		UploadFile.className = 'UploadFile';
		UploadFile.id = 'UploadFile' + Id;
		UploadFile.innerHTML = '<div class="CadClose" title="Enlever cette image"></div>'+
		'<div class="UploadFileIcone"></div>'+
		'<div class="UploadFileInfo"><strong class="UploadFileNom">'+Nom+'</strong></div>'+
		'<div class="UploadFileEtat">Prêt</div>';

		UploadFile.firstChild.onclick = function(){ self.SuprFile(Id); };
		Ot.setOpacity(UploadFile, 0);

		this.UploadFileList.firstChild.appendChild(UploadFile);
		new Fx(UploadFile, { From: 0, To: 1, Mode: 'opacity' });

		if(this.MaxFile != 0 && this.FileList.length == this.MaxFile)
		{
			Obj.value = '';
			Upload.setFileError(UploadFile, this.MaxFile+' image max.');
		}
		else if(Ot.isInArray(Extension, this.ExtensionImage))
		{
			this.FileList.push(Id);

			Upload.setEtatAct(this);
			Upload.setFileListScroll(this, 'add');
			this.AddForm();
		}
		else
		{
			Obj.value = '';
			Upload.setFileError(UploadFile, 'Extension invalide (.'+Extension+')');
		}
	}
},

AddForm: function()
{	
	var Form = document.createElement('form');
	Form.setAttribute('action', this.uploadUrl);
	Form.setAttribute('target', this.UploadIframeId);
	Form.setAttribute('method', 'post');
	Form.id = Ot.getRandId('UploadForm');

	if(CClient[0] == 'IExploreur'){
		encType = Form.getAttributeNode('enctype');
		encType.value = 'multipart/form-data';
	}
	else{
		Form.setAttribute('enctype', 'multipart/form-data');
	}

	Form.innerHTML = '<input type="file" name="addUploadFile">';

	var self = this;

	Form.getElementsByTagName('input')[0].onchange = function(){ self.AddFile(this); };

	var UploadFormList = this.UploadFormList;

	if(UploadFormList.lastChild && UploadFormList.lastChild){
		UploadFormList.lastChild.style.display = 'none';
	}

	UploadFormList.appendChild(Form);
},

removeForm: function(id)
{
	alert(id);
	
	this.UploadFormList.removeChild(document.getElementById('UploadForm'+id));
},

SuprFile: function(Id)
{
	var KeyId = Ot.getKeyArrayValue(this.FileList, Id);
	var UploadFile = document.getElementById('UploadFile'+Id);

	if(this.FileAct !== '') //Upload en cours
	{
		Upload.setFileError(UploadFile, 'Annuler');

		if(this.FileAct == KeyId) //Actuel
		{
			document.getElementById(this.UploadIframeId).src = 'about:blank';

			this.FileList = Ot.ArrayRemove(this.FileList, KeyId);

			this.removeForm(Id);

			this.UploadNext(0);
		}
		else
		{		
			this.FileList = Ot.ArrayRemove(this.FileList, KeyId);

			this.removeForm(Id);
		}
	}
	else
	{
		UploadFile.removeChild(UploadFile.firstChild);

		this.FileList = Ot.ArrayRemove(this.FileList, KeyId);

		this.removeForm(Id);
		Upload.removeFile(UploadFile);
	}

	Upload.setEtatAct(this);
},

SuprFileAll: function()
{
	while(this.FileList.length > 0)
	{
		this.SuprFile(this.FileList[0]);
	}

	this.FileList = [];
},

UploadStart: function()
{
	this.BoutSuprFileAll.style.visibility = 'hidden';
	this.BoutUploadStart.style.display = 'none';

	this.onUploadStart();

	this.UploadNext(0);
},

UploadNext: function(Pos)
{
	if(this.FileList[Pos]) //Image suivant
	{
		this.FileAct = Pos;
		var Id = this.FileList[Pos];

		var UploadFile = document.getElementById('UploadFile'+Id);

		UploadFile.lastChild.innerHTML = '<img src="image/icone/load.gif"/> En cours...';
		UploadFile.className = 'UploadFile CadOrange';

		Upload.setEtatAct(this);
		Upload.setFileListScroll(this, 'uploadStart');

		document.getElementById('UploadForm'+Id).submit();
	}
	else //Fin du l'upload
	{
		document.getElementById(this.UploadIframeId).src = 'about:blank';

		this.FileList = [];
		this.FileAct = '';

		Upload.setEtatAct(this);
		this.onUploadFinish();
	}
},

UploadComplet: function()
{
	var Rtext = document.getElementById(this.UploadIframeId).contentWindow.document.body.innerHTML;

	if(Rtext != '')
	{
		var self = this;
		var Id = this.FileList[this.FileAct];
		var UploadFile = document.getElementById('UploadFile'+Id);
		this.removeForm(Id);
		this.FileList = Ot.ArrayRemove(this.FileList, this.FileAct);

		Ot.decodeAjaxReturn(Rtext, function(description)
		{
			UploadFile.className = 'UploadFile CadVert';
			UploadFile.lastChild.innerHTML = 'Ajoutée';
			UploadFile.removeChild(UploadFile.firstChild);

			window.setTimeout(function(){ Upload.removeFile(UploadFile); }, 3000);

			self.onUploadSuccess(description);
		},
		function(description)
		{
			Upload.setFileError(UploadFile, description);
		});

		this.UploadNext(0);
	}
}

});