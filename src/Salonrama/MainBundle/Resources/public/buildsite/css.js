var Css = {

getSheetList: function(Document)
{
	return Document.sheet || Document.styleSheets;
},

getSheetByHref: function(Document, Href)
{
	var SheetList = this.getSheetList(Document);
	var Sheet = false;

	for(var i = SheetList.length - 1; i >= 0; i--) //Ordre decroissant
	{
		if(SheetList[i].href == Href)
		{
			Sheet = SheetList[i];
			break;
		}
	}

	return Sheet;
},

getRuleList: function(Sheet)
{
	if(Sheet){
		return Sheet.rules || Sheet.cssRules;
	}
	else{
		return false;
	}
},

addRule: function(Sheet, SelectorTxt, CssText)
{
	if(Sheet)
	{
		if(Sheet.addRule){
			Sheet.addRule(SelectorTxt, CssText, 0);
		}
		else if(Sheet.insertRule){
			Sheet.insertRule(SelectorTxt+' { '+CssText+' }', 0);
		}
	}
},

getRule: function(Sheet, SelectorTxt)
{
	var RuleList = this.getRuleList(Sheet);
	var Rule = false;

	for(var i = 0; i < RuleList.length; i++)
	{
		if(RuleList[i].selectorText.toLowerCase() == SelectorTxt.toLowerCase())
		{
			Rule = RuleList[i];
			break;
		}
	}

	return Rule;
},

getCssTxt: function(Rule)
{
	return Rule.style.cssText;
},

getRuleProprList: function(Rule)
{
	var CssTxt = this.getCssTxt(Rule);

	return CssTxt.split(/[:;]/);
},

getSetRulePropr: function(Rule)
{
	var ProprList = this.getRuleProprList(Rule);
	var Eval = '';
	var i = 0;

	while(ProprList[i+1])
	{
		var PropAct = ProprList[i];
		PropAct = PropAct.toLowerCase();
		PropAct = PropAct.replace(/\-(\w)/g, function (strMatch, p1){ return p1.toUpperCase(); });
		PropAct = PropAct.replace(/ /, '');

		var Value = ProprList[i+1];
		Value = Value.substring(1, Value.length);

		if(Value.indexOf('important') == -1)
		{
			Eval += 'Obj.style.'+PropAct+' = "'+Value+'";';
		}
		else
		{
			Value = GFormF.Trim(Value.replace('!important', '').replace('! important', ''));

			if(CClient[0] == 'IExploreur'){
				Eval += 'Obj.style.'+PropAct+' = "'+Value+'";';
			}
			else
			{
				Eval += 'Obj.style.setProperty("'+PropAct+'","'+Value+'","important");';
			}
		}

		i += 2;
	}

	return new Function('Obj', Eval);
}

};