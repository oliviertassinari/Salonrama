var Color = {

DecToHex: function(Dec)
{
	return(parseInt(Dec,16));
},

HexToDec: function(Hex)
{
	var result = parseInt(Hex, 10).toString(16);
	if(result.length == 1)
	{
		result = ('0' + result);
	}
	return result.toUpperCase();
},

CssToHex: function(Hex)
{
	Hex = Hex.toUpperCase();

	if(Hex.indexOf('RGB') != -1){
		var Reg = new RegExp("RGB\\(([0-9]+), *([0-9]+), *([0-9]+)\\)", 'ig');
		var R = Reg.exec(Hex);
		return this.RgbToHex({ r: R[1], g: R[2], b: R[3]});
	}
	else if(Hex.length == 4){
		var First = Hex.substring(1,4);
		return Hex+First;
	}
	else{
		return Hex;
	}
},

RgbToHex: function(Rgb) 
{
	return '#'+this.HexToDec(Rgb.r) + this.HexToDec(Rgb.g) + this.HexToDec(Rgb.b);
},

HexToRgb: function(Hex) 
{
	Hex = Hex.toUpperCase();
	Hex = Hex.replace(/#/g, '');
	Hex = Hex.replace(/[^A-F0-9]/g, '0');

	var r = '00', g = '00', b = '00';

	if(Hex.length == 6){
		r = Hex.substring(0,2);
		g = Hex.substring(2,4);
		b = Hex.substring(4,6);	
	}
	else
	{
		if(Hex.length > 4){
			r = Hex.substring(4, Hex.length);
			Hex = Hex.substring(0,4);
		}
		if(Hex.length > 2){
			g = Hex.substring(2,Hex.length);
			Hex = Hex.substring(0,2);
		}
		if(Hex.length > 0){
			b = Hex.substring(0,Hex.length);
		}					
	}

	return { r:this.DecToHex(r), g:this.DecToHex(g), b:this.DecToHex(b) };
},

RgbToHsv: function(Rgb) 
{
	var r = Rgb.r / 255;
	var g = Rgb.g / 255;
	var b = Rgb.b / 255;

	var hsv = {h:0, s:0, v:0};

	var min = 0;
	var max = 0;

	if(r >= g && r >= b){
		max = r;
		min = (g > b) ? b : g;
	} 
	else if(g >= b && g >= r){
		max = g;
		min = (r > b) ? b : r;
	}
	else{
		max = b;
		min = (g > r) ? r : g;
	}

	hsv.v = max;
	hsv.s = (max) ? ((max - min) / max) : 0;

	if(!hsv.s){
		hsv.h = 0;
	}
	else
	{
		var delta = max - min;
		if(r == max){
			hsv.h = (g - b) / delta;
		}
		else if (g == max){
			hsv.h = 2 + (b - r) / delta;
		}
		else{
			hsv.h = 4 + (r - g) / delta;
		}

		hsv.h = parseInt(hsv.h * 60, 10);
		if(hsv.h < 0){
			hsv.h += 360;
		}
	}

	hsv.s = parseInt(hsv.s * 100, 10);
	hsv.v = parseInt(hsv.v * 100, 10);

	return hsv;
},

HsvToRgb: function(Hsv) 
{
	var rgb = {r:0, g:0, b:0};

	var h = Hsv.h;
	var s = Hsv.s;
	var v = Hsv.v;

	if(s === 0)
	{
		if(v === 0){
			rgb.r = rgb.g = rgb.b = 0;
		}
		else{
			rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100, 10);
		}
	}
	else 
	{
		if(h == 360){
			h = 0;
		}

		h /= 60;

		// 100 scale
		s = s/100;
		v = v/100;

		var i = parseInt(h, 10);
		var f = h - i;
		var p = v * (1 - s);
		var q = v * (1 - (s * f));
		var t = v * (1 - (s * (1 - f)));
		switch(i)
		{
			case 0:
				rgb.r = v;
				rgb.g = t;
				rgb.b = p;
				break;
			case 1:
				rgb.r = q;
				rgb.g = v;
				rgb.b = p;
				break;
			case 2:
				rgb.r = p;
				rgb.g = v;
				rgb.b = t;
				break;
			case 3:
				rgb.r = p;
				rgb.g = q;
				rgb.b = v;
				break;
			case 4:
				rgb.r = t;
				rgb.g = p;
				rgb.b = v;
				break;
			case 5:
				rgb.r = v;
				rgb.g = p;
				rgb.b = q;
				break;
		}

		rgb.r = parseInt(rgb.r * 255, 10);
		rgb.g = parseInt(rgb.g * 255, 10);
		rgb.b = parseInt(rgb.b * 255, 10);
	}

	return rgb;
},

HexToHsv: function(Hex) 
{
	return this.RgbToHsv(this.HexToRgb(Hex));
},

HsvToHex: function(Hsv) 
{
	return this.RgbToHex(this.HsvToRgb(Hsv));
}

};