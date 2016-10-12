;(function($){
	/*****定义Calendar对象的构造方法*****/
	var Calendar = function(ele,opt){
		this.$element = ele,
		this.defaults = {
			'beforeToday': false,        //只能选择今天以前的日期
			'afterToday': false          //只能选择今天以后的日期
		},
		this.options = $.extend({},this.defaults,opt);
		//定义全局变量
		var year = 0,         //自定义年份 
			month = 0,        //自定义月份
			today = 0,		  //今天
			nowDate,          //当前日期
			myDate,           //自定义日期
			firstDay,         //每个月第一天
			maxDay=[];           //一个月最大天数,数组
		/////////定义jq对象
		
		/*定义私有方法*/
		//判断year是否为闰年
		this.leapYear = function(){
			if((year%4==0) && (year%100!==0 || year%400==0)){
				maxDay = [31,29,31,30,31,30,31,31,30,31,30,31];
			}else{
				maxDay = [31,28,31,30,31,30,31,31,30,31,30,31];
			}
		}
		//加载html
		this.onloadHtml = function(x,y,h){
			this.$element.after('<div class="oCaleBox oClearfix"></div>');
			var $caleBox = this.$element.next();
			$caleBox.css({left:x ,top:y+h+4});
			$caleBox.prepend('<p><b class="oPrevYear">«</b><b class="oPrevMonth">‹</b><span class="oYearTit">2015</span><span>年</span><span class="oMonthTit">1</span><span>月</span><b class="oNextMonth">›</b><b class= "oNextYear">»</b></p>');
			$caleBox.append('<ul class="oWeek oClearfix"></ul>');
			$caleBox.append('<ul class="oDateList"></ul>');
			$caleBox.children('.oWeek').append("<li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li>");
			var $dateList = $caleBox.children('.oDateList');
			for(var i=0;i<42;i++){
				$dateList.append('<li>1</li>');
			}
		}
		//移除html
		this.removeHtml = function(){
			this.$element.next('div .oCaleBox').remove();
		}
		//获取1号的星期
		this.getfirstDate = function(){
			myDate = new Date(year,month,1);
			firstDay = myDate.getDay();
		}
		//获取当前时间
		this.getNowDate = function(){
			nowDate = new Date();
			year = nowDate.getFullYear();
			month = nowDate.getMonth();
			today = nowDate.getDate();
			this.getfirstDate();
		}
		//是否本月，是返回true
		this.isMonth = function(){
			if((year==nowDate.getFullYear())&&(month==nowDate.getMonth())){
				return true;
			}else{
				return false;
			}
		}
		//上个月
		this.prevMonth = function(){
			month--;
			if(month<0){
				month=11;
				return this.prevYear();
			}
			this.getfirstDate();
		}
		//下个月
		this.nextMonth = function(){
			month++;
			if(month>11){
				month=0;
				return this.nextYear();
			}
			this.getfirstDate();
		}
		//上一年
		this.prevYear = function(){
			year--;
			this.getfirstDate();
		}
		//下一年
		this.nextYear = function(){
			year++;
			this.getfirstDate();
		}
		///////数据加载到日历
		this.onloadDate = function(){
			this.leapYear();                  //判断year是否闰年，得出maxDay
			var $yearTitle = $('.oYearTit'),
				$monthTitle = $('.oMonthTit'),	
				$dateList = $('.oDateList'),
				$dateItem = $dateList.children(),
				isMonth = this.isMonth();	  //是否当前月份
				$yearTitle.text(year);			  
				$monthTitle.text(month+1);		  //修改标题日期
			$dateList.children().text('');                 //清空日历
			$dateList.children().removeClass("oToday");    //去掉当日的标识
			//加入数据
			firstDay--;	 
			for(var i=1;i<=maxDay[month];i++){
				firstDay++;
				$dateList.children(':eq('+firstDay+')').text(i);
				if(isMonth && i===today){
					if(this.options.hasCalendar===true){
						$dateList.children(':eq('+firstDay+')').addClass(this.options.todayCls);	
					}else{
						$dateList.children(':eq('+firstDay+')').addClass('oToday');	
					}
				}
			}
		}
		//格式化日期
		this.FormatText = function(ths){
			this.$element.val();
			month++;
			this.$element.val(year+'-'+month+'-'+$(ths).text());
		}
	}	
	/****定义Calendar的方法****/
	Calendar.prototype = {
		init:function(){
			var _ = this,
				isRemove = true;
			///点击输入框
			_.$element.focus(function(){
				if(isRemove === false){
					return false;
				}
				isRemove = false;
				var inputX = _.$element.position().left;
				var inputY = _.$element.position().top;
				var inputH = _.$element.height();

				_.onloadHtml(inputX,inputY,inputH);
			
				var $prevMonth = $('.oPrevMonth');
					$nextMonth = $('.oNextMonth'),
					$prevYear = $('.oPrevYear'),
					$nextYear = $('.oNextYear'),
					$dateList = $('.oDateList'),
					$dateItem = $dateList.children(),
					$caleBox = _.$element.next();

				//加载当前月份
				_.getNowDate();
				_.onloadDate();
				//点击上个月
				$prevMonth.click(function(){
					_.prevMonth();
					_.onloadDate();
				});
				//点击下个月
				$nextMonth.click(function(){
					_.nextMonth();
					_.onloadDate();
				});
				//点击上一年
				$prevYear.click(function(){
					_.prevYear();
					_.onloadDate();
				});
				//点击下一年
				$nextYear.click(function(){
					_.nextYear();
					_.onloadDate();
				});
				////如果没有数据鼠标滑过和选中没有反应
				//鼠标滑过
				$dateItem.hover(
					function(){
						if($(this).text()===''){
							return false;
						}else{
							$(this).addClass('hoverDay');
						}
					},
					function(){
						$(this).removeClass('hoverDay');
					}
				);
				//选中日期
				$dateItem.click(function(){
					if($(this).text()===''){
						return false;
					}
					_.FormatText(this);
					_.removeHtml();            //选中日期后移除日历的html代码
					isRemove = true;
				});
				//点击日历面板
				$caleBox.click(function(){
					_.$element.trigger('focus');
				});
				$caleBox.hover(
					function(){
						_.$element.off('blur');
					},
					function(){
						_.$element.blur(function(){
							_.removeHtml();
							isRemove = true;
						});
					}
				);
				_.$element.hover(
					function(){
						_.$element.off('blur');
					},
					function(){
						_.$element.blur(function(){
							_.removeHtml();
							isRemove = true;
						});
					}
				);
			});
		}
	}
	/****calendar插件****/
	$.fn.calendar = function(options){
		cale = new Calendar(this,options);
		return cale.init();
	}
})(jQuery);