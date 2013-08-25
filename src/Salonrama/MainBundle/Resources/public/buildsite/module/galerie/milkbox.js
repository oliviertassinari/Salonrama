/*
MilkBox - required: mootools.js v1.2 core + more: Assets
v1.3
	- feature: hide milkbox links hover default firefox tooltips
	- feature: hide select and textarea tags while playing
	
	
by Luca Reghellin (http://www.reghellin.com) May 2008, MIT-style license.
Inspiration from Slimbox by Christophe Beyls (http://www.digitalia.be) 
and from THE VERY FIRST MAN ON THE MOON: Lokesh Dhakar (http://www.lokeshdhakar.com/projects/lightbox2/)
AND OF COURSE, SPECIAL THANKS TO THE MOOTOOLS DEVELOPERS
*/

var MilkBox = new Class({

Implements:Options,

options:{//set all the options here
	overlayOpacity:0.7,
	topPosition:80,
	initialWidth:250,
	initialHeight:250,
	resizeDuration:500,
	resizeTransition:'sine:in:out',/*function (ex. Transitions.Sine.easeIn) or string (ex. 'quint:out')*/
	hoverBackgroundPosition:'0 -23px',
	autoPlay:false,
	autoPlayDelay:7,
	removeTitle:true
},

initialize: function(options)
{
	this.setOptions(options);
	this.galleries = [];
	this.currentImage = null;
	this.currentIndex = null;
	this.currentGallery = null;

	this.specialDescription = null;//for showThisImage
	this.activated = false;//used in showThisImage 

	this.mode = null;//'singleImage','imageGallery','showThisImage'
	this.closed = true;
	this.busy = true;//to control keyboard and autoplay events
	this.intObj = null;
	this.formtags = null;
	this.loadedImages = [];//to check the preloaded images		

	this.initMilkBox();
},//end init

initMilkBox:function()
{
	this.prepareHTML();
	this.prepareEffects();
	this.prepareEvents();

	this.activated = true;
	this.formtags = $$('select','textarea');
},

openMilkBox:function(gallery,index)
{
	if(this.formtags.length != 0){ this.formtags.setStyle('display','none'); }

	this.overlay.setStyles({ 'top': -$(window).getScroll().y, 'height':$(window).getScrollSize().y+$(window).getScroll().y, display:'block' });

	this.center.addClass('mbLoading');
	this.center.setStyle('top',$(window).getScroll().y+this.options.topPosition);

	this.currentGallery = gallery;
	this.currentIndex = index;
	this.overlay.tween('opacity',this.options.overlayOpacity);//onComplete: center.tween opacity

	if(gallery.length == 1){
		this.mode = 'singleImage';
		this.loadImages(gallery[index].href);
	} else {
		this.mode = 'imageGallery';

		var images = gallery.map(function(item){ return item.href; });

		$$(this.prev, this.next, this.count).setStyles({'display':'block'});
		var border = this.center.getStyle('border-right-width').toInt();//border-right is just ok for design purposes..
		var navWidth = this.prev.getSize().x+this.next.getSize().x+this.close.getSize().x+border;
		this.navigation.setStyle('width',navWidth);
		this.description.setStyle('margin-right',navWidth);

		var next = (index != images.length-1) ? images[index+1] : images[0];
		var prev = (index != 0) ? images[index-1] : images[images.length-1];
		var preloads = (prev == next) ? [prev] : [prev,next]; //if gallery.length == 2, then prev == next

		this.loadImages(images[index],preloads);
	}

	this.closed = false;
},

//call with js
showThisImage:function(image,description)
{
	//if init was not done because of the absence of galleries, do it now.
	if(!this.activated){ this.initMilkBox(); }

	this.mode = 'showThisImage';
	this.specialDescription = description;

	this.overlay.setStyles({ 'top': -$(window).getScroll().y,'height':$(window).getScrollSize().y+$(window).getScroll().y, display:'block' });

	this.center.addClass('mbLoading');
	this.center.setStyle('top',$(window).getScroll().y+this.options.topPosition);

	this.overlay.tween('opacity',this.options.overlayOpacity);//onComplete: center.tween opacity
	this.loadImages(image);

	this.closed = false;
},

//see loadImages()
showImage:function(image)
{
	if(this.closed){ return; } //if you close the MilkBox and an onload event is still running

	var imageBoxSize = this.image.getSize();

	this.image.setStyles({'opacity':0, 'width':'', 'height':''});

	var imageSize = new Hash(image.getProperties('width','height')).map(function(item, index){
		return item.toInt();
	});

	var centerSize = new Hash(this.center.getStyles('width','height')).map(function(item, index){
		return item.toInt();
	});

	var targetSize = {};

	if(imageSize.width != centerSize.width){ 
		targetSize.width = imageSize.width;
		targetSize.marginLeft = -(imageSize.width/2).round();
	}

	var gap = (imageBoxSize.y > 0) ? centerSize.height - imageBoxSize.y : 0; 

	var targetHeight = imageSize.height + gap;

	targetSize.height = targetHeight;

	//so nav doesn't move when you click next/prev
	this.image.setStyles({'width':imageSize.width, 'height':imageSize.height});

	this.center.removeClass('mbLoading');
	this.center.morph(targetSize);//onComplete: show all items
},

loadImages:function(currentImage,preloads)
{
	var loadImage = new Asset.image(currentImage, { onload:function(img){
		this.currentImage = img;
		if(!this.loadedImages.contains(currentImage)){ this.loadedImages.push(currentImage); } //see next/prev events
		$$(this.description,this.navigation).setStyle('visibility','hidden');
		this.navigation.setStyle('height','');//reset the height setted in center.morph.onComplete
		$$(this.next,this.prev,this.close).setStyle('backgroundPosition','0 0');
		this.showImage(this.currentImage);
	}.bindWithEvent(this)});

	if(preloads && !this.loadedImages.contains(preloads))
	{
		var preloadImages = new Asset.images(preloads, { onComplete:function(img){
			preloads.each(function(item){
				if(!(this.loadedImages.contains(item))){ this.loadedImages.push(item); }
			}.bind(this));
		}.bindWithEvent(this)});
	}
},

//all the main events
prepareEvents:function()
{
	//next, prev, see next_prev_aux()
	this.next.addEvent('click',this.next_prev_aux.bindWithEvent(this,'next'));
	this.prev.addEvent('click',this.next_prev_aux.bindWithEvent(this,'prev'));

	//keyboard next/prev/close
	$(window.document).addEvent('keydown',function(e){
		if(this.busy == false && this.mode != null)
		{
			if(e.key == 'esc'){ this.closeMilkBox(); }
			else if(this.mode == 'imageGallery')
			{
				if(e.key == 'right' || e.key == 'space'){ this.next_prev_aux(e,'next'); }
				else if(e.key == 'left' || e.key == 'enter'){ this.next_prev_aux(e,'prev'); }
			}
			
		}
	}.bindWithEvent(this));

	//css hover doesn't work in ie6, so I must do it via js...
	$$(this.next,this.prev,this.close).addEvents({
			'mouseover':function(e){ 
				var button=($(e.target).match('a')) ? $(e.target) : $(e.target).getParent('a');
				button.setStyle('backgroundPosition',this.options.hoverBackgroundPosition); 
			}.bindWithEvent(this),
			'mouseout':function(){ this.setStyle('backgroundPosition','0 0'); }
	});

	//overlay
	this.overlay.get('tween').addEvent('onComplete',function()
	{
		if(this.overlay.getStyle('opacity') == this.options.overlayOpacity){ 
			this.center.tween('opacity',1);
		}
		else if(this.overlay.getStyle('opacity') == 0)
		{
			this.overlay.setStyles({'display':'none','height':'','top':''});
		}
	}.bindWithEvent(this));

	//center
	this.center.get('morph').addEvent('onComplete',function(){

		 this.image.grab(this.currentImage);
		 this.image.tween('opacity',1);

		 var d = (!this.specialDescription && this.currentIndex && this.currentGallery[this.currentIndex].getElementsByTagName('img')[0].title) ? this.currentGallery[this.currentIndex].getElementsByTagName('img')[0].title : this.specialDescription;
		 if($chk(d)){ this.description.innerHTML = d; }

		 if(this.mode == 'imageGallery'){ 
			this.count.appendText((this.currentIndex+1)+' sur '+this.currentGallery.length); 
		 }

		 var currentCenterHeight = this.center.getStyle('height').toInt();

		 this.navigation.setStyle('height',this.bottom.getStyle('height').toInt());//to have the right-border height == total bottom height
		 var bottomSize = this.bottom.getSize().y;

		 //after the 1st time, currentCenterHeight is always > this.image.getSize().y
		 var targetOffset = (currentCenterHeight > this.image.getSize().y) ? (this.bottom.getSize().y+this.image.getSize().y)-currentCenterHeight : bottomSize;

		 this.bottom.setStyle('display','none');//to avoid rendering problems during setFinalHeight

		 this.center.retrieve('setFinalHeight').start(currentCenterHeight,currentCenterHeight+targetOffset);
		/**/
	}.bindWithEvent(this));

	this.center.retrieve('setFinalHeight').addEvent('onComplete',function(){

		this.bottom.setStyles({'visibility':'visible','display':'block'});
		$$(this.description,this.navigation).setStyle('visibility','visible');
		//reset overlay height based on position and height
		var scrollSize = $(window).getScrollSize().y;
		var scrollTop = $(window).getScroll().y;

		this.overlay.setStyle('height',scrollSize+scrollTop);
		this.busy = false;

	}.bindWithEvent(this));

	//reset overlay height and position onResize
	window.addEvent('resize',function(){
		if(this.overlay.getStyle('opacity') == 0){ return; } //resize only if visible
		var scrollSize = $(window).getScrollSize().y;
		var scrollTop = $(window).getScroll().y;
		this.overlay.setStyles({ 'height':scrollSize+scrollTop,'top':-scrollTop });
	}.bindWithEvent(this));

	//close
	$$(this.overlay,this.image,this.close).addEvent('click',function(){ this.closeMilkBox(); }.bindWithEvent(this));
},

next_prev_aux:function(e,direction)
{
	if(e)
	{
		e.preventDefault();
		if(this.intObj){ $clear(this.intObj); this.intObj = null; }
	} //if there's no event obj, than this is called by autoPlay()

	else{ if(this.busy){ return; } }//stop autoplay()

	this.busy = true; //for keyboard and autoplay

	var backupIndex = this.currentIndex;

	if(direction == 'next'){
		var i= (this.currentIndex != this.currentGallery.length-1) ? this.currentIndex += 1 : this.currentIndex = 0;
		var _i= (this.currentIndex != this.currentGallery.length-1) ? this.currentIndex + 1 : 0;
	}
	else{
		var i= (this.currentIndex != 0) ? this.currentIndex -= 1 : this.currentIndex = this.currentGallery.length-1;
		var _i= (this.currentIndex != 0) ? this.currentIndex - 1 : this.currentGallery.length-1;
	}

	this.image.empty();
	this.description.empty();
	this.count.empty();

	if(!this.loadedImages.contains(this.currentGallery[i].href))
	{
		this.center.addClass('mbLoading');
	}
	this.loadImages(this.currentGallery[i].href,[this.currentGallery[_i].href]);
},

autoPlay:function(obj) //obj: gallery, index, delay (in seconds)
{
	var g = (obj && obj.gallery && ($type(obj.gallery) == 'array')) ? obj.gallery : MilkBox.galleries[0];
	var i = (obj && obj.index && ($type(obj.index) == 'number')) ? obj.index : 0;
	var d = (obj && obj.delay && ($type(obj.delay) == 'number')) ? obj.delay*1000 : this.options.autoPlayDelay*1000;
	if(d < this.options.resizeDuration*2){ d = this.options.resizeDuration*2; }

	MilkBox.openMilkBox(g,i);
	if(this.mode != 'imageGallery'){ return; }
	this.intObj = this.next_prev_aux.periodical(d,this,[null,'next']);

},

closeMilkBox:function()
{
	this.cancelAllEffects();
	if(this.intObj){ $clear(this.intObj); }

	this.currentImage = null;
	this.currentIndex = null;
	this.currentGallery = null;

	$$(this.prev, this.next, this.count).setStyle('display','none');
	var border = this.center.getStyle('border-right-width').toInt();
	var navWidth = this.close.getSize().x+border;
	this.navigation.setStyles({'width':navWidth,'height':'','visibility':'hidden'});
	this.description.setStyle('margin-right',navWidth);
	this.description.empty();
	this.bottom.setStyles({'visibility':'hidden','display':''});

	this.image.setStyles({'opacity':0, 'width':'', 'height':''});
	this.image.empty();

	this.count.empty();

	this.center.setStyles({'opacity':0,'width':this.options.initialWidth,'height':this.options.initialHeight,'marginLeft':-(this.options.initialWidth/2)});
	this.overlay.tween('opacity',0);//see onComplete in prepareEvents() 

	if(this.formtags.length != 0){
		this.formtags.setStyle('display','inline');
	}

	this.mode = null;
	this.closed = true;
},

cancelAllEffects:function()
{
	this.overlay.get('tween').cancel();
	this.center.get('morph').cancel();
	this.center.get('tween').cancel();
	this.center.retrieve('setFinalHeight').cancel();
	this.image.get('tween').cancel();
},

prepareEffects:function()
{
	this.overlay.set('tween',{ duration:'short',link:'cancel' });
	this.center.set('tween',{ duration:'short',link:'chain' });
	this.center.set('morph',{ duration:this.options.resizeDuration,link:'chain',transition:this.options.resizeTransition });
	this.center.store('setFinalHeight',new Fx2.Tween(this.center,{property:'height',duration:'short'}));
	this.image.set('tween',{ link:'chain' });
},

prepareGalleries:function(List)
{
	this.galleries = [[]];
	List = List.getElementsByTagName('a');
	var self = this;

	for(var i = 0; i < List.length; i++)
	{
		var a = List[i];

		if(a.className == 'MMilkBox')
		{
			this.galleries[0].push(a);

			a.onclick = function(Event)
			{
				var e = Event || event;
				var Target = e.target || e.srcElement;
				var button= Target.parentNode;

				var gallery = self.galleries[0];

				if(self.options.autoPlay){
					self.autoPlay({ gallery:gallery, index:gallery.indexOf(button) });
				}
				else{
					self.openMilkBox(gallery, gallery.indexOf(button));
				}
				
				return false;
			};
		}
	}
},

prepareHTML:function()
{
	this.overlay = new Element('div', { 'id':'mbOverlay','styles':{ 'opacity':'0','visibility':'visible','display':'none' }}).inject($(document.body));
	
	this.center = new Element('div', {'id':'mbCenter', 'styles':{'width':this.options.initialWidth,'height':this.options.initialHeight,'marginLeft':-(this.options.initialWidth/2),'opacity':0}}).inject($(document.body));
	this.image = new Element('div', {'id':'mbImage'}).inject(this.center);
	
	this.bottom = new Element('div',{'id':'mbBottom'}).inject(this.center).setStyle('visibility','hidden');
	this.navigation = new Element('div',{'id':'mbNavigation'}).setStyle('visibility','hidden');
	this.description = new Element('div',{'id':'mbDescription'}).setStyle('visibility','hidden');

	this.bottom.adopt(this.navigation, this.description, new Element('div',{'class':'clear'}));

	this.close = new Element('a',{'id':'mbCloseLink', 'title': 'Fermer'});
	this.next = new Element('a',{'id':'mbNextLink', 'title': 'Image suivante'});
	this.prev = new Element('a',{'id':'mbPrevLink', 'title': 'Image précédente'});
	this.count = new Element('span',{'id':'mbCount'});

	$$(this.next, this.prev, this.count).setStyle('display','none');

	this.navigation.adopt(this.close, this.next, this.prev,new Element('div',{'class':'clear'}), this.count);
}

});

if(typeof GModule != 'undefined')
{
	GModule.ScriptCharger('Galerie', 'creator/module/galerie/milkbox.js');
}
