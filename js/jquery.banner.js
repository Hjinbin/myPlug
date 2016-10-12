;(function($,window,document,undefined){
	/*****定义Banner的构造函数******/
	//将变量定义到对象的属性上，函数变成对象的方法，使用时通过对象获取
	var Banner = function(ele,opt){
		this.$element = ele,           //获取到的jQuery对象console.log(this);
		//设置默认参数
		this.defaults = { 
			'auto': true,            //是否自动播放，默认自动播放  
			'navActCls': 'act',        //当前状态的class
			'imgBoxCls': 'imgBox',    //图片列表的class
			'imgNav': 'nav',           //图片导航的class
			'pageBtn': 'pageBtn',      //prev、next按钮的class
			'prevPage': 'prev',        //prev按钮的class
			'nextPage': 'next',        //next按钮的class
			'hideCls': 'hide'          //隐藏的class   
		},
		this.options = $.extend({}, this.defaults, opt);
		//////定义全局变量
		var _ = this,
			imgWidth  = this.$element.width(),           //图片的宽度
			$imgBox = this.$element.children('.'+this.options.imgBoxCls),  //图片列表
			imgBoxWidth = $imgBox.width(),               //图片列表的宽度
			$navBox = this.$element.children('.'+this.options.imgNav), // 导航
			$pageBtn = this.$element.find('.'+this.options.pageBtn),   // prev、next按钮
			slideTarget = 0,					         //轮播动画的目标值
			timer = null;								 //计时器
			navIndex = 0;								 //当前图片的号数
		///////定义方法
		//自动轮播
		this.auto = function(){
			if(_.options.auto===false){
				return false;
			}
			clearInterval(timer);
			timer = setInterval(function(){
				_.next();
			},4000);
		}
		//停止自动轮播
		this.stop = function(){
			clearInterval(timer);
		}
		//下一页
		this.next = function(){
			slideTarget -= imgWidth;
			navIndex = -slideTarget/imgWidth;
			if(slideTarget<0-imgBoxWidth){
				$imgBox.children(':last').remove();
				$imgBox.width(imgBoxWidth);
				$imgBox.css({left:0});
				slideTarget = 0-imgWidth;
				navIndex = -slideTarget/imgWidth;
			}
			if(slideTarget===0-imgBoxWidth){
				//复制第一张图片追加到图片列表末尾，实现无缝轮播
				$imgBox.width(function(){
					return imgBoxWidth+imgWidth;
				});
				$imgBox.children(':first').clone().appendTo('.'+_.options.imgBoxCls);
				navIndex = 0;
			}
			$imgBox.animate({left:slideTarget}); //向左移动值为slideTarget的距离
			$navBox.children().removeClass(_.options.navActCls);
			$navBox.children(':eq('+navIndex+')').addClass(_.options.navActCls);
		}
		//上一页
		this.prev = function(){
			var $cloneImgBox,      // 复制的图片列表
				boolClone;         // 是否有克隆的图片列表
			if(slideTarget>0){
				$imgBox.css({left:imgWidth-imgBoxWidth});
				_.$element.children(':first').remove();
				slideTarget = imgWidth - imgBoxWidth;
				navIndex = $imgBox.children(':last').index();
				boolClone = false;
			}
			if(slideTarget===0){
				//复制图片列表放到原来的图片列表前面
				$cloneImgBox = $imgBox.clone();
				boolClone = true;   
				$cloneImgBox.insertBefore('.'+_.options.imgBoxCls);
				$cloneImgBox.css({left:0-imgBoxWidth});
				navIndex = $imgBox.children(':last').index() + 1;
			}
			slideTarget += imgWidth;
			navIndex = -slideTarget/imgWidth;
			$imgBox.animate({left:slideTarget});
			//boolClone=true时在图片列表向右移动时克隆的图片列表同时向右移动，实现无缝轮播
			if(boolClone){
				$cloneImgBox.animate({left:imgWidth-imgBoxWidth});
			}
			$navBox.children().removeClass(_.options.navActCls);
			$navBox.children(':eq('+navIndex+')').addClass(_.options.navActCls);
		}
		//定位图片
		this.position = function(index){
			navIndex = index;
			var actIndex = $('.'+_.options.imgNav+' '+'.'+_.options.navActCls).index();
			if(slideTarget-imgWidth<0-imgBoxWidth){
				$imgBox.children(':last').remove();
				$imgBox.width(imgBoxWidth);
				$imgBox.css({left:0});
				slideTarget = 0;
			}
			if(actIndex===$navBox.children(':last').index() && navIndex===0){
				_.next();
			}
			else{
				if(navIndex>actIndex){
					slideTarget -= imgWidth*(navIndex-actIndex);
				}else if(navIndex<actIndex){
					slideTarget += imgWidth*(actIndex-navIndex);
				} else{
					return false;
				}
				$('.'+_.options.imgNav).children().removeClass(_.options.navActCls);
				$('.'+_.options.imgNav).children(':eq('+navIndex+')').addClass(_.options.navActCls);
				$imgBox.animate({left:slideTarget});
			}
			
		}
	}

	/// 定义Banner的方法
	Banner.prototype = {
		init:function(){
			var _ = this;
			//自动播放
			_.auto();
			//鼠标移动到图片中显示向左向右按钮
			_.$element.hover(
				function(){
					$('.'+_.options.pageBtn).removeClass(_.options.hideCls);
					_.stop();
				},
				function(){
					$('.'+_.options.pageBtn).addClass(_.options.hideCls);
					_.auto();
				}
			);
			//点击next按钮停止自动播放然后显示下一页
			$('.'+_.options.nextPage).click(function(){
				_.next();
			});
			//点击prev按钮停止自动播放然后显示上一页
			$('.'+_.options.prevPage).click(function(){
				_.prev();
			});
			//点击导航定位到具体的图片
			$('.'+_.options.imgNav).children().click(function(){
				var index = $(this).index();
				_.position(index);
			});
		}
	}
	/******$.fn里面应专注于插件的调用******/
	//在插件中使用Banner对象
	$.fn.banner = function(options){
		//创建Banner的实体
		ban = new Banner(this,options);
		//调用其方法
		return ban.init();
	}
})(jQuery,window,document);
