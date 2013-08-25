var Trier = {

initi: function(Table)
{
	var tHead = Table.getElementsByTagName('thead')[0];
	var tHeadRowList = tHead.rows[0].cells;
	var tBody = Table.tBodies[0];

	if(tBody.rows.length > 1)
	{
	    for(var i = 0; i < tHeadRowList.length; i++)
		{
			if(!Ot.hasClass(tHeadRowList[i], 'TrierOff'))
			{
				tHeadRowList[i].innerHTML = '<a href="#" onclick="return false;" title="Trier">'+tHeadRowList[i].innerHTML+'</a>';

				if(Ot.hasClass(tHeadRowList[i], 'TrierOui'))
				{
					Trier.addTrierIcone(tHeadRowList[i], 'TrierIconeReverse');
				}
				else if(Ot.hasClass(tHeadRowList[i], 'TrierOuiReverse'))
				{
					Trier.addTrierIcone(tHeadRowList[i], 'TrierIcone');
				}

				(function(z){
					Ot.addEvent(tHeadRowList[z], 'click', function()
					{
						var tHeadRowAct = tHeadRowList[z];
						
						var TrierIconeReverse = document.getElementById('TrierIconeReverse');
						if(TrierIconeReverse){
							TrierIconeReverse.parentNode.removeChild(TrierIconeReverse);
						}
						var TrierIcone = document.getElementById('TrierIcone');
						if(TrierIcone){
							TrierIcone.parentNode.removeChild(TrierIcone);
						}

						if(Ot.hasClass(tHeadRowAct, 'TrierOui'))
						{
							Ot.removeClass(tHeadRowAct, 'TrierOui');
							Ot.addClass(tHeadRowAct, 'TrierOuiReverse');

							Trier.reverse(tBody);
							Trier.addTrierIcone(tHeadRowAct, 'TrierIcone');
						}
						else if(Ot.hasClass(tHeadRowAct, 'TrierOuiReverse'))
						{
							Ot.removeClass(tHeadRowAct, 'TrierOuiReverse');
							Ot.addClass(tHeadRowAct, 'TrierOui');

							Trier.reverse(tBody);
							Trier.addTrierIcone(tHeadRowAct, 'TrierIconeReverse');
						}
						else
						{
							Trier.Sort(tHeadRowAct, tHeadRowList, tBody, Table, z);
						}
					});
				})(i);
			}
	    }
	}
},

addTrierIcone: function(tHeadRow, Id)
{
	var TrierIcone = document.createElement('span');
	TrierIcone.id = Id;
	tHeadRow.appendChild(TrierIcone);
},

Sort: function(tHeadRow, tHeadRowList, tBody, Table, z)
{
	Ot.forEach(tHeadRowList, function(cell)
	{
		Ot.removeClass(cell, 'TrierOui');
		Ot.removeClass(cell, 'TrierOuiReverse');
	});

	Ot.addClass(tHeadRow, 'TrierOui');

	Trier.addTrierIcone(tHeadRow, 'TrierIconeReverse');

	var row_array = [];
	var tBodyRowList = tBody.rows;
	for(var i = 0; i < tBodyRowList.length; i++)
	{
		row_array.push([Trier.getInnerText(tBodyRowList[i].cells[z]), tBodyRowList[i]]);
	}

	row_array.sort(Trier.guessType(Table, z));

	var x = 0;

	for(var j = 0; j < row_array.length; j++)
	{
		var tBodyRowAct = row_array[j][1];

		if(x === 0){
			tBodyRowAct.className = 'TabCol0';
			x = 1;
		}
		else{
			tBodyRowAct.className = 'TabCol1';
			x = 0;
		}

		tBody.appendChild(tBodyRowAct);
	}
},

reverse: function(tBody)
{
	var newrows = [];

	for(var i = 0; i < tBody.rows.length; i++)
	{
		newrows.push(tBody.rows[i]);
	}

	for(var j = newrows.length-1; j >= 0; j--)
	{
		tBody.appendChild(newrows[j]);
	}
},

DateRegExp: /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/,

guessType: function(table, column)
{
	var sortfn = Trier.sort_alpha;

	for(var i = 0; i < table.tBodies[0].rows.length; i++)
	{
		var text = Trier.getInnerText(table.tBodies[0].rows[i].cells[column]);

		if(text != '')
		{
			if(text.match(/^-?[£$¤]?[\d,.]+%?$/)){
				return Trier.sort_numeric;
			}

			var possdate = text.match(Trier.DateRegExp);
			if(possdate)
			{
				// looks like a date
				first = parseInt(possdate[1], 10);
				second = parseInt(possdate[2], 10);
				if(first > 12){
					return Trier.sort_ddmm;
				}
				else if(second > 12){
					return Trier.sort_mmdd;
				}
				else{
					sortfn = Trier.sort_ddmm;
				}
			}
		}
	}
	return sortfn;
},

getInnerText: function(node)
{
	if(typeof node.textContent != 'undefined'){
		return node.textContent.replace(/^\s+|\s+$/g, '');
	}
	else if(typeof node.innerText != 'undefined'){
		return node.innerText.replace(/^\s+|\s+$/g, '');
	}
	else if(typeof node.text != 'undefined'){
		return node.text.replace(/^\s+|\s+$/g, '');
	}
	else
	{
		switch(node.nodeType)
		{
			case 4:
				return node.nodeValue.replace(/^\s+|\s+$/g, '');
			break;
			case 1:
			case 11:
				var innerText = '';
				for(var i = 0; i < node.childNodes.length; i++)
				{
					innerText += Trier.getInnerText(node.childNodes[i]);
				}
				return innerText.replace(/^\s+|\s+$/g, '');
			break;
			default:
				return '';
		}
	}
},

sort_numeric: function(a, b)
{
	aa = parseFloat(a[0].replace(/[^0-9.-]/g,''));
	if(isNaN(aa)){ aa = 0; }

	bb = parseFloat(b[0].replace(/[^0-9.-]/g,'')); 
	if(isNaN(bb)){ bb = 0; }

	return aa-bb;
},

sort_alpha: function(a, b)
{
	if(a[0] == b[0]){ return 0; }
	if(a[0] < b[0]){ return -1; }

	return 1;
},

sort_ddmm: function(a, b)
{
	mtch = a[0].match(Trier.DateRegExp);
	y = mtch[3]; m = mtch[2]; d = mtch[1];

	if(m.length == 1){ m = '0'+m; }
	if(d.length == 1){ d = '0'+d; }

	dt1 = y+m+d;
	mtch = b[0].match(Trier.DateRegExp);
	y = mtch[3]; m = mtch[2]; d = mtch[1];

	if(m.length == 1){ m = '0'+m; }
	if(d.length == 1){ d = '0'+d; }
	dt2 = y+m+d;

	if(dt1 == dt2){ return 0; }
	if(dt1 < dt2){ return -1; }

	return 1;
},

sort_mmdd: function(a, b)
{
	mtch = a[0].match(Trier.DateRegExp);
	y = mtch[3]; d = mtch[2]; m = mtch[1];

	if(m.length == 1){ m = '0'+m; }
	if(d.length == 1){ d = '0'+d; }

	dt1 = y+m+d;
	mtch = b[0].match(Trier.DateRegExp);
	y = mtch[3]; d = mtch[2]; m = mtch[1];

	if(m.length == 1){ m = '0'+m; }
	if(d.length == 1){ d = '0'+d; }

	dt2 = y+m+d;

	if(dt1 == dt2){ return 0; }
	if(dt1 < dt2){ return -1; }

	return 1;
}

};