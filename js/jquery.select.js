;(function($){
	//定义Select对象
	var Select = function(ele,opt){
		this.$element = ele,
		this.defaults = {
			'seleListCls': 'seleList',
			'hideCls': 'hide',
			'currentItemCls': 'current',
			'seleShowContCls': 'content'
		},
		this.options = $.extend({},this.defaults,opt);
	}
	//定义Select的方法
	Select.prototype = {
		init:function(){
			var _ = this,
				$seleList = _.$element.parent().find('.'+_.options.seleListCls);
				$seleItem = $seleList.children(),
				//$seleShowCont = _.$element.children('.'+ _.options.seleShowContCls);
			_.$element.click(function(){
				$seleList.removeClass(_.options.hideCls);
			});
			$seleItem.hover(
				function(){
					$(this).addClass(_.options.currentItemCls);
				},
				function(){
					$(this).removeClass(_.options.currentItemCls);
				}
			);
			$seleItem.click(function(){
				$seleList.addClass(_.options.hideCls);
				_.$element.children('.'+ _.options.seleShowContCls).text($(this).text());
			});
		}
	}
	//在插件中使用Select对象
	$.fn.select = function(options){
		sele = new Select(this,options);
		return sele.init();
	}
})(jQuery);