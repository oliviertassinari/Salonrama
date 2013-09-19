$.popupInfo = [];

$.popupOpen = function(url, width, height)
{
	if(!$.popupInfo[url] || $.popupInfo[url].closed)
	{
		var screenLeft = window.screenX || window.screenLeft;
		var screenTop = window.screenY || window.screenTop;

		if(width == 'full')
		{
			var availWidth = screen.availWidth;

			width = availWidth*0.8;
			height = screen.availHeight;

			var left = availWidth*0.1;
			var top = 0;
		}
		else{
			var left = screenLeft+15;
			var top = screenTop+15;
		}

		var popup = window.open(url, '', 'toolbar=0, location=0, directories=0, status=0, scrollbars=1, resizable=1, copyhistory=0, menubar=0, width='+width+', height='+height+', left='+left+', top='+top);

		if(popup){
			$.popupInfo[url] = popup;
		}
		else{
			alert('Votre navigateur a bloqué la pop-up.\nVeuillez désactiver votre bloqueur de pop-ups pour l\'ouvrir.');
		}
	}
	else
	{
		$.popupInfo[url].close();
		delete $.popupInfo[url];
		$.popupOpen(url, width, height);
	}
};