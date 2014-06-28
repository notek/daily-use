/******** 一个简陋的弹出控件 **********/

(function(win,doc) {
	var Tips = function() {
		var Add = function() {
			return new Add.init;
		}
		var Inside = {
			css:function(obj,attr) {  //获取运动所用的css属性
				var val = obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr];
				if(arguments.length === 2) {
					return attr === 'opacity' ? Math.round(parseFloat(val) * 100) : val;							 			
				}
			},
			buffer:function(obj,targets,callback,times) {   //基础运动支持
				var _this = this;
				if(obj.timer) clearInterval(obj.timer);
				(!times || times > 30) && (times = 30);
				times < 5 && (times = 5);
				if(typeof targets !== 'object') {
					alert('argument error');
					return;	
				}
				obj.timer = setInterval(function() {
					var speed = 0, pro = 0, stops = true;
					for(var attr in targets) {
						pro = parseInt(_this.css(obj,attr));
						if(String(targets[attr]).indexOf('%') != -1) {
							targets[attr] = '' + parseInt(parseInt(targets[attr]) / 100 * pro);
						}else {
							targets[attr] = targets[attr];
						}
						speed = (targets[attr] - pro) / 10;
						speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
						(pro != targets[attr]) && (stops = false);
						attr == 'opacity' ? (obj.style.opacity = (pro + speed) / 100, obj.style.filter = 'alpha(opacity:' + (pro + speed) + ')') : obj.style[attr] = pro + speed + 'px';	
					}
					stops && (clearInterval(obj.timer), obj.timer = null, callback && callback.call(obj));	
				},times);
			},
			flex:function(obj,attr,target,callback,times) {   //基础弹跳运动支持
				var speed = 0, pro = 0, _this = this;
				clearInterval(obj.timer);
				(!times || times > 30) && (times = 30); 
				times < 5 && (times = 5);
				obj.timer = setInterval(function() {
					pro = parseInt(_this.css(obj,attr));
					speed += (target - pro) / 5;
					speed *= 0.8;
					Math.abs(speed) < 1 && Math.abs(target - pro) < 1 ? (clearInterval(obj.timer), obj.timer = null, obj.style[attr] = target + 'px', callback && callback()) : obj.style[attr] = pro + speed + 'px';	
				},times);
			}
		}
		// 隐藏
		var hide = function(type,m,o) {   //隐藏方式,根据type的值来确定
			switch(type) {
				case 'conversionO':              //变化元素的透明度和top值
					animat('opacity','top');
					break;
				case 'conversionW':              //变化元素的宽度值
					animat('width');
					break;
				case 'conversionH':              //变化元素的高度值
					animat('height');
					break;
				case 'cross':                    //变化元素的宽度值和高度值
					animat('width','height');
					break;	
				default:
					m && m.parentNode.removeChild(m);      //如果没有指定隐藏类型,则使用默认的无过度效果
					o.parentNode.parentNode.removeChild(o.parentNode);
					break;
			}
			function animat(one,two) {     //统一调用函数,根据参数决定变化的属性
				//创建两个空对象用来存储可能变化的属性值
				var attr = {},    //弹出层
					battr = {};   //遮罩层
				if(arguments.length == 1) {  //如果传入一个参数,则弹出元素对应的空对象保存其参数名和值
					attr[one] = 0;
				}else {                      //否则保存两个参数名和值
					attr[one] = 0;
					attr[two] = 0;
				}
				battr[one] = 0;              //遮罩层将要变化的属性名对象
				m && Inside.buffer(m,battr,function() {  //如果遮罩层默认没有启用则不执行后续的动作
					m.parentNode.removeChild(m);
				},10);
				Inside.buffer(o,attr,function() {        //弹出元素最终的隐藏方式和值,根据对象attr的属性名和值
					o.parentNode.parentNode.removeChild(o.parentNode);   //完成隐藏删除元素
				},10);
				if(type === 'cross') {                   //如果type为cross,则遮罩层也启用attr对象的属性名和值
					m && Inside.buffer(m,attr,function() {
						m.parentNode.removeChild(m);     //完成隐藏删除元素
					},10);
				}
			}
		}
		// 拖拽
		var drag = function(obj,isdrag) {  
			if(isdrag) {          //如果指定了允许拖拽属性
				obj.onmousedown = function (e) {//鼠标按下事件
					e = e || window.event;      //获取事件对象
					obj.style.opacity = 0.6;    
					obj.style.filter = 'alpha(opacity:60)';
					var x = e.clientX - document.body.scrollLeft - obj.offsetLeft; //x=鼠标相对于网页的x坐标-网页被卷去的宽-待移动对象的左外边距
					var y = e.clientY - document.body.scrollTop - obj.offsetTop; //y=鼠标相对于网页的y左边-网页被卷去的高-待移动对象的左上边距
					document.onmousemove = function (e) {//鼠标移动
					    e = e || window.event;
					    obj.style.margin = 0;
						obj.style.left = e.clientX + document.body.scrollLeft - x + 'px';
						obj.style.top = e.clientY + document.body.scrollTop - y + 'px';
						return false;
					}
					document.onmouseup = function () {//鼠标放开
						document.onmousemove = null;
						document.onmouseup = null;
						obj.style.opacity = 1;
						obj.style.filter = 'alpha(opacity:100)';
					}
				}
			}
		}
		// 阻止冒泡
		var stopCancel = function(obj) {
			obj.onmousedown = function(e) {
				e = e || window.event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			}
		}

		Add.init = Add.prototype = {
			constructor:Add,
			sysLayer:function(para) {   //常用弹出层
				//如果是ie6,则立即提示并退出函数
				if(win.navigator.userAgent.toLowerCase().indexOf('msie 6.0') != -1 && doc.all) {
					alert('does not support ie6');
					return;
				}
				if(typeof para != 'object') {    //检测参数类型必须是对象{xxx:xxx,xxx:xxx,.....}
					alert('parameter error');
					return;
				}
				if(!!!para.type) {   //弹出框类型
					alert('please enter type!');
					return;
				}
				if(!para.mode) {     //弹出框出现形式
					alert('please enter mode!');
					return;
				}
				//如果是警告框/提示框/输入框,则必须定义mess属性
				if(para.type === 'WARAING' && !para.mess || para.type === 'CONFRIM' && !para.mess || para.type === 'PROMPT' && !para.mess) {  //如果弹出框为警告框/确认框同时没有mess属性
					alert('please enter message');
					return;
				}
				//除了信息提示框MESSAGE以外,所有弹出框的输出信息长度不能超过10
				if(para.type !== 'MESSAGE' && para.mess.length > 10) {    //弹出框输出信息长度
					alert('message length can not exceed 10');
					return;
				}
				//如果是信息提示框MESSAGE,则必须提供msg属性
				if(para.type === 'MESSAGE' && !para.msg) {   //信息框信息
					alert('type is "MESSAGE" please enter msg');
					return;
				}
				//如果展示形式为透明度变化,则必须提供val属性并且只能是数值型
				if(para.mode === 'opacity' && (!para.val || typeof parseInt(para.val) !== 'number')) {  //如果弹出框形式为透明度变化
					alert('please enter a numeric value and is');
					return;
				}
				//如果展示形式为透明度变化,则必须提供的val属性>0 <100
				if(para.mode === 'opacity' && (parseInt(para.val) > 100 || parseInt(para.val) < 0)) {
					alert('val can only be a number between 0-100');
					return;
				}
				//默认不允许拖拽
				if(!para.isdrag) {
					para.isdrag = false;
				}
				//默认不允许弹出框随滚动条滚动
				if(!para.isscroll) {
					para.isscroll = false;
				}

				var body = doc.body;    //获得body元素
				var box = doc.createElement('div');    //创建弹出框容器
				box.id = 'addbox';                     //赋值弹出框id
				body.appendChild(box);                 //在body元素最后 插入弹出框容器
				if(para.ismask) {                      //如果指定了ismask属性且为true,则创建mask(遮罩)层
					var mask = doc.createElement('div');
					mask.id = 'mask';
					body.appendChild(mask);
				}else {                                //如果没有指定ismask属性,则默认不创建mask(遮罩)层
					var mask = null;
				}	

				//弹出框展示方式
				function show(paras) {
					//获取统一top值
					var top = parseInt(((document.documentElement.clientHeight || document.body.clientHeight) - paras.obj.offsetHeight) / 2);
					//如果指定了isscroll属性,则应用相应的样式
					paras.isscroll && (paras.obj.style.position = 'fixed');
					switch(paras.mode) {    //检测展示方式
						case 'buffer':   //改变元素top值和高度值   
							paras.obj.style.top = 0;
							if(paras.mask) {
								paras.mask.style.height = 0;
							}
							paras.mask && Inside.buffer(paras.mask,{height:body.offsetHeight},'',5);
							Inside.buffer(paras.obj,{top:top},'',10);
							break;
						case 'opacity':   //改变元素透明度值
							paras.obj.style.opacity = 0;
							paras.obj.style.top = top + 'px';
							paras.obj.style.filter = 'alpha(opacity:0)';
							if(paras.mask) {
								paras.mask.style.opacity = 0;
								paras.mask.style.filter = 'alpha(opacity:0)';
							}
							paras.mask && Inside.buffer(paras.mask,{opacity:para.val},'',5);
							Inside.buffer(paras.obj,{opacity:'100'},'',10);
							break;
						case 'flex':    //改变元素top值和高度值,并且以弹跳运动形式
							paras.obj.style.top = 0;
							if(paras.mask) {
								paras.mask.style.height = 0;
							}
							paras.mask && Inside.buffer(paras.mask,{height:body.offsetHeight},'',5);
							Inside.flex(paras.obj,'top',top,'',10);
							break;	
						case 'default':   //默认无效果       
							paras.obj.style.top = top + 'px';
							break;
						default:          //不是上述的几种方式就提示错误信息并退出函数
							alert('mode error');
							break;
					}
				}

				switch(para.type) {
					case 'WARAING':    //警告框
						var war = doc.createElement('div');
						war.className = 'waraing';
						var icon = doc.createElement('span');
						icon.className = 'icon';
						war.appendChild(icon);
						var msg = doc.createElement('p');
						msg.className = 'msg';
						msg.innerHTML = para.mess;
						war.appendChild(msg);
						var btn = document.createElement('span');
						btn.className = 'btn';
						btn.innerHTML = '确定';
						war.appendChild(btn);
						box.appendChild(war);
						show({mode:para.mode,mask:mask,obj:war,isscroll:para.isscroll});
						drag(war,para.isdrag);
						stopCancel(btn);
						btn.onclick = function() {
							hide(para.hidetype,mask,war);
						}
						break;
					case 'CONFRIM':    //确认框
						var con = doc.createElement('div');
						con.className = 'confrim';
						var tit = doc.createElement('span');
						tit.className = 'tit';
						con.appendChild(tit);
						var cmsg = doc.createElement('p');
						cmsg.className = 'cmsg';
						cmsg.innerHTML = para.mess;
						con.appendChild(cmsg);
						var btnbox = doc.createElement('div');
						btnbox.className = 'btnbox';
						var ok = doc.createElement('span');
						ok.className = 'ok';
						ok.innerHTML = '确认';
						var no = doc.createElement('span');
						no.className = 'no';
						no.innerHTML = '取消';
						btnbox.appendChild(ok);
						btnbox.appendChild(no);
						con.appendChild(btnbox);
						box.appendChild(con);
						show({mode:para.mode,mask:mask,obj:con,isscroll:para.isscroll});
						drag(con,para.isdrag);
						stopCancel(ok);
						stopCancel(no);
						ok.onclick = function() {
							hide(para.hidetype,mask,con);
							para.callback && para.callback();
						}
						no.onclick = function() {
							hide(para.hidetype,mask,con);
						}
						break;
					case 'PROMPT':     //输入框
						var pro = doc.createElement('div');
						pro.className = 'prompt';
						var tip = doc.createElement('p');
						tip.className = 'tip';
						tip.innerHTML = para.mess || '请输入：';
						pro.appendChild(tip);
						var span = doc.createElement('span');
						var txt = doc.createElement('textarea');
						txt.className = 'txt';
						span.appendChild(txt)
						pro.appendChild(span);
						var btnok =  doc.createElement('span');
						btnok.className = 'btnok';
						btnok.innerHTML = '确定';
						var btnno =  doc.createElement('span');
						btnno.className = 'btnno';
						btnno.innerHTML = '取消';
						pro.appendChild(btnok);
						pro.appendChild(btnno);
						box.appendChild(pro);
						show({mode:para.mode,mask:mask,obj:pro,isscroll:para.isscroll});
						drag(pro,para.isdrag);
						stopCancel(txt);
						stopCancel(btnok);
						stopCancel(btnno);
						btnok.onclick = function() {
							var inn = txt.value;
							hide(para.hidetype,mask,pro);
							para.callback && para.callback(inn);
						}
						btnno.onclick = function() {
							hide(para.hidetype,mask,pro);
						}
						break;
					case 'MESSAGE':
						var b = doc.createElement('div');
						b.className = 'b';
						var topbg = doc.createElement('div');
						topbg.className = 'topbg';
						b.appendChild(topbg);
						var mcon = doc.createElement('div');
						mcon.className = 'mcon';
						var icon = doc.createElement('span');
						icon.className = 'micon';
						mcon.appendChild(icon);
						var pcon = doc.createElement('p');
						pcon.className = 'pcon';
						pcon.innerHTML = para.msg;
						mcon.appendChild(pcon);
						var clear = doc.createElement('p');
						clear.className = 'clear';
						mcon.appendChild(clear);
						var btn = doc.createElement('span');
						btn.className = 'mbtn';
						btn.innerHTML = '确定';
						mcon.appendChild(btn);
						b.appendChild(mcon);
						var botbg = doc.createElement('div');
						botbg.className = 'botbg';
						b.appendChild(botbg);
						box.appendChild(b);
						show({mode:para.mode,mask:mask,obj:b,isscroll:para.isscroll});
						drag(b,para.isdrag);
						stopCancel(btn);
						btn.onclick = function() {
							b.style.height = b.offsetHeight + 'px';
							hide(para.hidetype,mask,b);
						}
						break;
					default:
						alert('type error');
						break;	
				}
			},
			cuntomLayer:function(para) {    //自定义弹出层
				if(!para.ename) {
					alert('parameters insufficiency');
					return;
				}
				var body = doc.body;
			}
		}
		return Add.init;
	}();

	win.Add = Tips;
})(window,document);


/******************简单操作解说********************/
/*
*	页面调用popLayer方法传入参数
*	参数名称：type mode hidetype val mess protip isdrag ismask isscroll callback
*	type:规定弹出框是哪种类型  -->WARAING  -->CONFRIM  -->PROMPT   *必填
*	mode:规定弹出框以哪种形式展示  -->buffer  -->opacity  -->default -->flex	*必填
*	hidetype:规定弹出框以哪种形式消失  ->conversionO ->conversionW ->->conversionH ->cross  ->default  默认为default（无效果）   
*	val:规定如果mode的形式为conversionO，那么val是必填参数，为0-100的数值型 *必填
*	mess:规定弹出框想向用户输出什么信息  *必填
*	callback:规定如果弹出框为CONFRIM/PROMPT的话，那么callback就是用户点击确认之后的回调函数
*	isdrag:规定弹出框允不允许拖拽 true或false  默认false
*	ismask:规定显示/不显示遮罩层   true或false   默认false
*	isscroll:规定弹出框是否跟随滚动条滚动  true或false  默认false
*/