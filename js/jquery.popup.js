;(function($){
	/******定义Popup构造函数******/
	var Popup = function(ele,opt){
		this.$element = ele,
		//设置默认参数
		this.defaults = {
			'popUpActCls': 'popUpAct',           // 弹出菜单后标题的状态class
			'popUpMenuCls': 'popUpMenu',         // 弹出菜单的class
			'itemActCls': 'itemAct',             // 鼠标移到列表中每一项的状态class
			'hideCls': 'hide'
		},
		//覆盖默认参数
		this.options = $.extend({},this.defaults,opt);
		//定义全局变量
		var $popMenu = $('.'+this.options.popUpMenuCls);
		//定义私有方法
		this.show = function(){
			this.$element.addClass(this.options.popUpActCls);
			this.$element.parent().find('.'+this.options.popUpMenuCls).removeClass(this.options.hideCls);
		}
		this.hide = function(){
			this.$element.removeClass(this.options.popUpActCls);
			this.$element.parent().find('.'+this.options.popUpMenuCls).addClass(this.options.hideCls);
		}
	}
	/******Popupde的方法*****/
	Popup.prototype = {
		init:function(){
			var _ = this,
				$popMenu = $('.'+_.options.popUpMenuCls)
			;
			_.$element.hover(
				function(){
					_.show();
				},
				function(){
					_.hide();
				}
			);
			_.$element.parent().find('.'+this.options.popUpMenuCls).hover(
				function(){
					_.show();
				},
				function(){
					_.hide();
				}
			);
			_.$element.parent().find('.'+this.options.popUpMenuCls).children().hover(
				function(){
					$(this).addClass(_.options.itemActCls);
				},
				function(){
					$(this).removeClass(_.options.itemActCls);
				}
			);
		}
	}
	/*****在插件中使用Popup对象******/
	$.fn.popup = function(options){
		pop = new Popup(this,options);
		return pop.init();
	}
})(jQuery);