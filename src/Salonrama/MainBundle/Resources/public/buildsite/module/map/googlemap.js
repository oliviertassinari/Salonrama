/* JavaScript, By Olivier (olivier.tassinari@gmail.com)
-----------------------*/

function Extend(Class, Method)
{
	var o = Class.prototype;

	for(var i in Method)
	{
		o[i] = Method[i];
	}
}

var GoogleMap = function(ObjId, Mode)
{
	if(Mode){
		this.Mode = Mode;
	}

	try
	{
		var Option = {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		    navigationControl: true,
		    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
		    mapTypeControl: true,
		    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
			disableDoubleClickZoom: false,
			draggable: true
		};

		this.Map = new google.maps.Map(document.getElementById(ObjId), Option);
	}
	catch(e){
	}
};

Extend(GoogleMap,{

Map: '',
V: ['', 0, 0, 4, 'plan', 47.219568, 1.582031, ''],
Mode: 'voir',
Marker: '',
InfoWindow: '',

setV: function(Mode)
{
	this.Map.setZoom(parseInt(this.V[3], 10));
	this.Map.setMapTypeId(this.getMapTypeId(this.V[4]));

	var Center = new google.maps.LatLng(parseFloat(this.V[5]), parseFloat(this.V[6]));

	if(Mode == 'All'){
		this.Map.setCenter(Center);
	}
	else{
		this.Map.panTo(Center);
	}

	if(parseFloat(this.V[1]) != 0 && parseFloat(this.V[2]) != 0)
	{
		var Marker = new google.maps.LatLng(parseFloat(this.V[1]), parseFloat(this.V[2]));

		this.addMarker(Marker);
	}
},

saveV: function()
{
	var Center = this.Map.getCenter();

	if(this.Marker != ''){
		var MarkerPosition = this.Marker.getPosition();
		this.V[1] = MarkerPosition.lat();
		this.V[2] = MarkerPosition.lng();
	}

	this.V[3] = this.Map.getZoom();
	this.V[4] = this.getMapTypeString(this.Map.getMapTypeId());
	this.V[5] = Center.lat();
	this.V[6] = Center.lng();
},

addMarker: function(LatLng)
{
	var self = this;

	if(this.Marker != ''){
		this.Marker.setMap(null);
	}
	if(this.InfoWindow != ''){
		this.InfoWindow.close();
	}

	var Marker = new google.maps.Marker({
		map: this.Map, 
		position: LatLng, 
		title: this.V[0]
	});

	this.Marker = Marker;

	if(this.Mode == 'modifier')
	{
		Marker.setDraggable(true);
	}

	var CadMap = this.getInfoWindowCon();
	this.InfoWindow = new google.maps.InfoWindow({ content: CadMap });
	this.InfoWindow.open(this.Map, Marker);

	google.maps.event.addListener(this.Map, 'click', function()
	{
		self.InfoWindow.close();
	});
	google.maps.event.addListener(Marker, 'dragstart', function()
	{
		self.InfoWindow.close();
	});
	google.maps.event.addListener(Marker, 'click', function()
	{
		var CadMap = self.getInfoWindowCon();
		self.InfoWindow.setContent(CadMap);
		self.InfoWindow.open(self.Map, Marker);
	});
	google.maps.event.addListener(this.InfoWindow, 'domready', function()
	{
		var CadMap = self.InfoWindow.getContent();

		if(document.getElementById('ModuleMapItineraire'))
		{
			window.setTimeout(function(){ document.getElementById('ModuleMapItineraire').focus(); });
		}
		else if(CadMap.getElementsByTagName('textarea')[0])
		{
			window.setTimeout(function(){ window.parent.Ot.setCursorPosition(CadMap.getElementsByTagName('textarea')[0], 'End'); });
		}
	});
},

getInfoWindowCon: function()
{
	var self = this;
	var CadMap = document.createElement('div');
	CadMap.className = 'ModuleMap';
	CadMap.innerHTML = '<div class="ModuleMapAdresse">Adresse : </div>'+
	'<div></div>'+
	'<div class="ModuleMapFoot">Itinéraire : <a href="#">Vers ce lieu</a> - <a href="#">À partir de ce lieu</a></div>';
	var a = CadMap.lastChild.getElementsByTagName('a');
	a[0].onclick = function(){ return self.toHere(); };
	a[1].onclick = function(){ return self.fromHere(); };

	var Con = CadMap.childNodes[1];

	if(this.Mode == 'modifier'){
		Con.innerHTML = '<textarea class="ModuleMapText"></textarea>';
		Con.firstChild.value = this.V[7].replace(/<br\/>/g, '\n');
		Con.firstChild.onkeyup = function(){ self.V[7] = this.value.replace(/\n/g, '<br/>'); };
	}
	else if(this.Mode == 'voir'){
		Con.innerHTML = this.V[7].replace(/\n/g, '<br>');
	}

	var Con = '<textarea class="ModuleMapText"></textarea>';

	return CadMap;
},

toHere: function() 
{
	var self = this;
	var CadMap = this.getInfoWindowCon();

	CadMap.lastChild.innerHTML = '<form action="http://maps.google.com/maps" method="get" target="_blank">'+
	'Itinéraire : <strong>Vers ce lieu</strong> - <a href="#">À partir de ce lieu</a><br/>'+
	'<label for="ModuleMapItineraire"><span style="color:#808080;">Lieu de départ</span></label>'+
	'<input type="text" size="20" maxlength="40" name="saddr" id="ModuleMapItineraire" class="FormInputText"/>'+
	'<input value="Voir" type="submit"/><input type="hidden" name="daddr" value="'+this.V[0]+'"/></form>';

	CadMap.lastChild.getElementsByTagName('a')[0].onclick = function(){ return self.fromHere(); };

	this.InfoWindow.setContent(CadMap);

	return false;
},

fromHere: function() 
{
	var self = this;
	var CadMap = this.getInfoWindowCon();

	CadMap.lastChild.innerHTML = '<form action="http://maps.google.com/maps" method="get" target="_blank">'+
	'Itinéraire : <a href="#">Vers ce lieu</a> - <strong>À partir de ce lieu</strong><br/>'+
	'<label for="ModuleMapItineraire"><span style="color:#808080;">Lieu d\'arriver</span></label>'+
	'<input type="text" size="20" maxlength="40" name="daddr" id="ModuleMapItineraire" class="FormInputText"/>'+
	'<input value="Voir" type="submit"/><input type="hidden" name="saddr" value="'+this.V[0]+'"/></form>';

	CadMap.lastChild.getElementsByTagName('a')[0].onclick = function(){ return self.toHere(); };

	this.InfoWindow.setContent(CadMap);

	return false;
},

getLatLon: function(Adresse, CallBack)
{
	try
	{
		new google.maps.Geocoder().geocode({ address: Adresse }, function(results, status)
		{
			if(status == google.maps.GeocoderStatus.OK)
			{
				CallBack({ error: 0, description: results[0] });
			}
			else if(status == google.maps.GeocoderStatus.ZERO_RESULTS)
			{		
				CallBack({ error: 1, description: 'adresse introuvable' });
			}
			else
			{
				CallBack({ error: 1, description: status });
			}
		});
	}
	catch(e)
	{
		CallBack({ error: 1, description: 'geolocalisation indisponible' });
	}
},

getMapTypeId: function(Type)
{
	if(Type == 'plan'){
		return google.maps.MapTypeId.ROADMAP;
	}
	else if(Type == 'satellite'){
		return google.maps.MapTypeId.SATELLITE;
	}
	else if(Type == 'mixte'){
		return google.maps.MapTypeId.HYBRID;
	}
	else if(Type == 'relief'){
		return google.maps.MapTypeId.TERRAIN;
	}
	else{
		return google.maps.MapTypeId.ROADMAP;
	}
},

getMapTypeString: function(Type)
{
	if(Type == google.maps.MapTypeId.ROADMAP){
		return 'plan';
	}
	else if(Type == google.maps.MapTypeId.SATELLITE){
		return 'satellite';
	}
	else if(Type == google.maps.MapTypeId.HYBRID){
		return 'mixte';
	}
	else if(Type == google.maps.MapTypeId.TERRAIN){
		return 'relief';
	}
	else{
		return 'plan';
	}
}

});