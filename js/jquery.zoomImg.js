;(function($){
	/****定义ZoomImg的构造函数****/
	var ZoomImg = function(ele,opt){
		this.$element = ele,
		//设置默认参数
		this.defaults = {
			'glassCls': 'readGlass',      //放大镜的class
			'hideCls': 'hide',            //隐藏的class
			'bigImgCls': 'bigerImg'		  //放大后的class		
			},
		this.options = $.extend({},this.defaults,opt);
		//定义全局变量
		var $glass = $('.'+this.options.glassCls),
			$glassWidth = $glass.width(),
			$glassHeight = $glass.height(),
			$bigImg = $('.'+this.options.bigImgCls);
			

		/////定义方法
		this.move = function(e){
			var p = this.$element.offset(),
				glassX = e.pageX-Math.ceil($glassWidth/2)-p.left,
			    glassY = e.pageY-Math.ceil($glassHeight/2)-p.top,
			    bigPosX = 0,
				bigPosY = 0;
			if(glassX<=0){glassX=0;}
			if(glassY<=0){glassY=0;}
			if(glassX+$glass.width()>=this.$element.width()){
				glassX=this.$element.width()-$glass.width();
			}
			if(glassY+$glass.height()>=this.$element.height()){
				glassY=this.$element.height()-$glass.height();
			}
			$glass.css({
				left:glassX,
				top:glassY
			});
			bigPosX = 0-Math.floor(glassX*($bigImg.width()/$glass.width()));
			bigPosY = 0-Math.floor(glassY*($bigImg.height()/$glass.height()));
			console.log(glassX+','+glassX+';'+bigPosX+','+bigPosY);
			$bigImg.css({
				backgroundPositionX:bigPosX,
				backgroundPositionY:bigPosY
			});
		}

	}
	//定义ZoomImg的方法
	ZoomImg.prototype = {
		init:function(){
			var _ = this,
		        $glass = $('.'+_.options.glassCls),
		        $bigImg = $('.'+_.options.bigImgCls);
			//鼠标移入图片，出现放大镜，移出则隐藏
			_.$element.hover(
				function(){
					$glass.removeClass(_.options.hideCls);
					$bigImg.removeClass(_.options.hideCls);
				},
				function(){
					$glass.addClass(_.options.hideCls);
					$bigImg.addClass(_.options.hideCls);
				}
			);
			//放大镜跟着鼠标在图片中移动，右边出现放大的图片
			_.$element.mousemove(function(event){
				_.move(event);
			});
		}
	}
	//在插件中使用ZoomImg对象
	$.fn.zoomImg = function(options){
		zom = new ZoomImg(this,options);
		return zom.init();
	}
})(jQuery);