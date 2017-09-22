/**
 * [����zepto���ƶ��˵������ڲ��]
 * @laike
 * @DateTime  2015-03-16T16:39:41+0800
 * @param     {[type]}                 $ [description]
 * @return    {[type]}                   [description]
 */
(function($){
    //����
    var queue = [];
    //Ĭ������
    var defaults = {
        id:'', //ָ������ID
        formId:null,//��id
        title:'��ʾ',//Ĭ�ϱ�������
        message:'',//��ʾ��Ϣ
        cancel:'ȡ��',//ȡ����ť����
        onCancel:function(){},//�����ȡ����ť�󴥷��Ļص�����
        ok:'ȷ��',//Ĭ�ϵ�ȷ�ϰ�ť���� ���Ըĳ��κ�����
        onOk:function(){},//�����ȷ�Ϻ󴥷��Ļص�����
        cancelOnly:false,//�Ƿ�ֻ��ʾȡ����ť
        okClass:'button',//Ĭ��ȷ�ϰ�ť����ʽ
        cancelClass:'button',//Ĭ��ȡ����ť����ʽ
        onShow:function(){},//��������ʾ��ʱ�򴥷��Ļص�����
        onHide:function(){},//���������ص�ʱ������Ļص�����
        closeOnOk:true,//�ǲ��ǵ����ȷ�����Զ��رյ�������
        hideTitle:false, //�Ƿ�Ĭ�����ر���
        popClass:'' //������ʽ
    };
    var Popup = (function(){

            var Popup = function(containerEl,opts){
                  this.container = containerEl;
                  if(!this.container){
                    this.container = document.body;
                  }
                  try{
                     if(typeof opts === 'string' || typeof opts === 'number'){
                        opts = {
                            message:opts,
                            cancelOnly:true,
                            cancel:'�ر�',
                            hideTitle:true
                        };
                     }
                     var _this = this;
                     //��չ����
                     var opts = $.extend({},defaults,opts);
                     if(!opts.title){
                        opts.hideTitle =true;
                     }
                     if(!opts.id){
                        opts.id = 'ycd-popup-'+Math.floor(Math.random()*10000);
                     }
                     for(var k in opts){
                        _this[k] = opts[k];
                     }
                     queue.push(this);
                     if(queue.length === 1){
                           this.show();
                     }
                  }catch(e){
                    console.log('���ô���'+e);
                  }
            };
            Popup.prototype = {
                show:function(){
                    var _this = this;
                    var markup = '<div id='+this.id+' class="car-popup hidden '+this.popClass+'">';
                    if(!_this.hideTitle){
                        markup += '<header>'+ this.title +'</header>';
                    }
                    markup += '<div class="content-body">'+this.message+'</div>'+
                              '<footer style="clear:both;">'+
                                   '<a href="javascript:void(0);" class="car-popup-cancel '+this.cancelClass+'">'+this.cancel+'</a>'+
                                   '<a href="javascript:void(0);" class="car-popup-ok '+this.okClass+'">'+this.ok+'</a>'+
                              '</footer>'+
                              '</div></div>';
                    $(this.container).append($(markup));
                    //����ⲿ��
                    if(this.formId){
                        var $content = $(this.container).find('.content-body');
                        var $form = $('#'+this.formId);
                        this.$formParent=$form.parent();
                        $form.appendTo($content);
                    }

                    var $wrap = $('#'+this.id);
                    $wrap.bind('close',function(){
                        _this.hide();
                    });

                    if(this.cancelOnly){
                        $wrap.find('.car-popup-ok').hide();
                        $wrap.find('.car-popup-cancel').addClass('center');
                    }
                    $wrap.find('A').each(function(){
                         var button = $(this);
                         button.bind('click',function(e){
                             if(button.hasClass('car-popup-ok')){
                                  _this.onOk.call(_this.onOk,_this);
                                  if(_this.closeOnOk){
                                    _this.hide();
                                  }
                             }else if(button.hasClass('car-popup-cancel')){
                                  _this.onCancel.call(_this.onCancel,_this);
                                  _this.hide();
                             }
                             e.preventDefault();
                         });
                    });

                    //���¶Դ��ڽ��ж�λ
                    _this.positionPopup();
                    //��ʾ����
                    Mask.show(0.3);
                    //�󶨵�ʱ�ƶ��˽��к�������ʱ�򴥷����¼� �Դ��ڽ������¶�λ
                    $wrap.bind('orientationchange',function(){
                        _this.positionPopup();
                    });
                    $wrap.find('header').show();
                    $wrap.find('footer').show();
                    setTimeout(function(){
                        $wrap.removeClass('hidden');
                        _this.onShow.call(_this.onShow,_this);
                    },50);

                },
                hide:function(){
                    //���ص�������
                    var _this = this;
                    $('#'+_this.id).addClass('hidden');
                    Mask.hide();
                    //�������ie ���� ��׿�������ô����ios ��Safari �����
                    if(!$.os.ie && $.os.android){
                       setTimeout(function(){
                           _this.remove();
                       },250)
                    }else{
                        _this.remove();
                    }
                },
                remove:function(){
                    var _this = this;
                    if(_this.onHide){
                        _this.onHide.call(_this.onHide,_this);
                    }
                    var $wrap = $('#'+_this.id);
                    if(_this.formId){
                        var $form = $('#'+_this.formId);
                        $form.appendTo(_this.$formParent);

                    }
                    $wrap.unbind('close');
                    $wrap.find('.car-popup-ok').unbind('click');
                    $wrap.find('car-popup-cancel').unbind('click');
                    $wrap.unbind('orientationchange').remove();
                    queue.splice(0,1);
                    if(queue.length >0){
                        queue[0].show();
                    }
                },
                positionPopup:function(){
                          /*
                          var _this = this;
                          var $wrap = $('#'+_this.id);
                          var w0= $(window).width() || 360,
                              h0 = $(window).height() || 500,
                              w1= $wrap[0].clientWidth || 300,
                              h1=$wrap[0].clientHeight || 100;
                              $wrap.css('top',((h0/2.5)+window.pageYOffset)-(h1/2)+'px')
                              .css('left',((w0/2)-(w1/2))+'px');*/

                }
            };
            return Popup;

    })();
    //�����൥��
    var Mask = {
        isShow:false,
        show:function(opacity){
           if(this.isShow) return;
           opacity = opacity ? ' style="opacity:'+opacity+';"' : '';
           $('body').prepend('<div id="car-pop-mask"'+opacity+'></div>');
           $('#car-pop-mask').bind('touchstart',function(e){
               e.preventDefault();
           }).bind('touchmove',function(e){
               e.preventDefault();
           });
           this.isShow = true;
        },
        hide:function(){
            this.isShow = false;
            $('#car-pop-mask').unbind('touchstart').unbind('touchmove').remove();
        }
    };
    //��jquery���һ����ӵ�fn
    $.fn.popup = function(opts){
            return new Popup(this[0],opts);
    };
})(Zepto);