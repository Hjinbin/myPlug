;(function($,window,document,undefined){
	/*****����Banner�Ĺ��캯��******/
	//���������嵽����������ϣ�������ɶ���ķ�����ʹ��ʱͨ�������ȡ
	var Banner = function(ele,opt){
		this.$element = ele,           //��ȡ����jQuery����console.log(this);
		//����Ĭ�ϲ���
		this.defaults = { 
			'auto': true,            //�Ƿ��Զ����ţ�Ĭ���Զ�����  
			'navActCls': 'act',        //��ǰ״̬��class
			'imgBoxCls': 'imgBox',    //ͼƬ�б��class
			'imgNav': 'nav',           //ͼƬ������class
			'pageBtn': 'pageBtn',      //prev��next��ť��class
			'prevPage': 'prev',        //prev��ť��class
			'nextPage': 'next',        //next��ť��class
			'hideCls': 'hide'          //���ص�class   
		},
		this.options = $.extend({}, this.defaults, opt);
		//////����ȫ�ֱ���
		var _ = this,
			imgWidth  = this.$element.width(),           //ͼƬ�Ŀ��
			$imgBox = this.$element.children('.'+this.options.imgBoxCls),  //ͼƬ�б�
			imgBoxWidth = $imgBox.width(),               //ͼƬ�б�Ŀ��
			$navBox = this.$element.children('.'+this.options.imgNav), // ����
			$pageBtn = this.$element.find('.'+this.options.pageBtn),   // prev��next��ť
			slideTarget = 0,					         //�ֲ�������Ŀ��ֵ
			timer = null;								 //��ʱ��
			navIndex = 0;								 //��ǰͼƬ�ĺ���
		///////���巽��
		//�Զ��ֲ�
		this.auto = function(){
			if(_.options.auto===false){
				return false;
			}
			clearInterval(timer);
			timer = setInterval(function(){
				_.next();
			},4000);
		}
		//ֹͣ�Զ��ֲ�
		this.stop = function(){
			clearInterval(timer);
		}
		//��һҳ
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
				//���Ƶ�һ��ͼƬ׷�ӵ�ͼƬ�б�ĩβ��ʵ���޷��ֲ�
				$imgBox.width(function(){
					return imgBoxWidth+imgWidth;
				});
				$imgBox.children(':first').clone().appendTo('.'+_.options.imgBoxCls);
				navIndex = 0;
			}
			$imgBox.animate({left:slideTarget}); //�����ƶ�ֵΪslideTarget�ľ���
			$navBox.children().removeClass(_.options.navActCls);
			$navBox.children(':eq('+navIndex+')').addClass(_.options.navActCls);
		}
		//��һҳ
		this.prev = function(){
			var $cloneImgBox,      // ���Ƶ�ͼƬ�б�
				boolClone;         // �Ƿ��п�¡��ͼƬ�б�
			if(slideTarget>0){
				$imgBox.css({left:imgWidth-imgBoxWidth});
				_.$element.children(':first').remove();
				slideTarget = imgWidth - imgBoxWidth;
				navIndex = $imgBox.children(':last').index();
				boolClone = false;
			}
			if(slideTarget===0){
				//����ͼƬ�б�ŵ�ԭ����ͼƬ�б�ǰ��
				$cloneImgBox = $imgBox.clone();
				boolClone = true;   
				$cloneImgBox.insertBefore('.'+_.options.imgBoxCls);
				$cloneImgBox.css({left:0-imgBoxWidth});
				navIndex = $imgBox.children(':last').index() + 1;
			}
			slideTarget += imgWidth;
			navIndex = -slideTarget/imgWidth;
			$imgBox.animate({left:slideTarget});
			//boolClone=trueʱ��ͼƬ�б������ƶ�ʱ��¡��ͼƬ�б�ͬʱ�����ƶ���ʵ���޷��ֲ�
			if(boolClone){
				$cloneImgBox.animate({left:imgWidth-imgBoxWidth});
			}
			$navBox.children().removeClass(_.options.navActCls);
			$navBox.children(':eq('+navIndex+')').addClass(_.options.navActCls);
		}
		//��λͼƬ
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

	/// ����Banner�ķ���
	Banner.prototype = {
		init:function(){
			var _ = this;
			//�Զ�����
			_.auto();
			//����ƶ���ͼƬ����ʾ�������Ұ�ť
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
			//���next��ťֹͣ�Զ�����Ȼ����ʾ��һҳ
			$('.'+_.options.nextPage).click(function(){
				_.next();
			});
			//���prev��ťֹͣ�Զ�����Ȼ����ʾ��һҳ
			$('.'+_.options.prevPage).click(function(){
				_.prev();
			});
			//���������λ�������ͼƬ
			$('.'+_.options.imgNav).children().click(function(){
				var index = $(this).index();
				_.position(index);
			});
		}
	}
	/******$.fn����Ӧרע�ڲ���ĵ���******/
	//�ڲ����ʹ��Banner����
	$.fn.banner = function(options){
		//����Banner��ʵ��
		ban = new Banner(this,options);
		//�����䷽��
		return ban.init();
	}
})(jQuery,window,document);
