$$.plug('Code',function(par) {
	//如果参数错误
	if(!$$.isArray(par)) {
		alert('参数错误');
		return;
	}
	//开始生成
	var listb = S.selector('ul','list')[0], len = par.length,
		frg = document.createDocumentFragment(), msb = S.selector('div','msb')[0];
	for(var i=0; i<len; i++) {
		var li = document.createElement('li');
		li.innerHTML = par[i].name.replace(/\(.*\)/g,'');
		frg.appendChild(li);
	}
	$$.buffer(msb,{opacity:'100'});
	listb.appendChild(frg);
	frg = null;

	return {
		//公共成员
		publicEle:function() {
			var e = [];
			e['list'] = S.selector('ul','list')[0];
			e['es'] = e['list'].getElementsByTagName('li');
			e['len'] = e['es'].length;
			e['box'] = S.selector('div','#box')[0];
			e['show'] = S.selector('div','show-code')[0];
			return e;
		},
		//公共条件
		publicCond:function() {
			return {
				//判断ie7 8 9的行为
				name:function(num,ele) {
					if(/msie\s+[7|8|9]\.0/g.test($$.browser().version.ie)) {
						for(var i=0; i<num; i++) {
							if(!/curr/g.test(ele[i].className)) {
								$$.buffer(ele[i],{textIndent:'10'},'',10);
							}
						}
					}
				},
				//取消事件冒泡
				cancel:function(e) {
					e = e || window.event;
					//取消事件冒泡
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				}
			};
		},
		//鼠标滑过文字滚动
		nameScroll:function() {
			if(/msie\s+[7|8|9]\.0/g.test($$.browser().version.ie)) {  
				var res = this.publicEle();
				for(var i=0; i<res['len']; i++) {
					$$.hover(res['es'][i],function() {
						$$.buffer(this,{textIndent:'25'},'',10);
					},function() {
						var that = this;
						//创建计时器防止ie10鼠标事件触发两次
						setTimeout(function() {
							if(!/curr/g.test(that.className)) {
								$$.buffer(that,{textIndent:'10'},'',10);
							}
						})
					});
				}
			}else {  
				var head = document.getElementsByTagName('head')[0],
					link = document.createElement('link');
				link.rel = 'stylesheet', link.href = 'modern.css';
				head.appendChild(link);
			}
			return this;
		},
		//点击展开方法详情
		showInfo:function() {
			var res = this.publicEle(), then = this;
			for(var i=0; i<res['len']; i++) {
				res['es'][i].onclick = function(e) {
					var that = this,
						show = res['show'];	
					for(var i=0; i<res['len']; i++) {
						 res['es'][i].className = res['es'][i].className.replace(/curr/g,'');
					}
					this.className = this.className + ' curr';
					//ie7 8 9
					then.publicCond().name(res['len'],res['es']);
					//写入数据
					var info = S.selector('div','info')[0];
					var	usage = S.getParentByClass(info,'usage')[0];
					var iname = S.getParentByClass(info,'name')[0],
						parsbox = S.getParentByClass(info,'ls')[0],
						note = S.getParentByClass(usage,'note')[0],
						code = usage.getElementsByTagName('code')[0],
						met = S.getParentByClass(info,'j')[0],
						pn = S.getParentByClass(info,'pn')[0], inner = this.innerHTML;	
					for(var i=0; i<len; i++) {
						if(par[i].name.substring(0,inner.length) === inner) {
							met.innerHTML = par[i].met,
							iname.innerHTML = par[i].name,
							note.innerHTML = par[i].note,
							code.innerHTML = par[i].example;
							//判断是否有参数及参数个数
							parsbox.innerHTML = '';
							if(par[i].pars) {
								pn.innerHTML = '参数：';
								var plen = par[i].pars.length;
								for(var n=0; n<plen; n++) {
									var boxs = document.createElement('span'),
										b = document.createElement('b'),
										em = document.createElement('em');
									b.innerHTML = par[i].pars[n].use,
									em.innerHTML = par[i].pars[n].name + '：';
									boxs.appendChild(em), boxs.appendChild(b);
									parsbox.appendChild(boxs);							
								}
							}else {
								pn.innerHTML = '参数：无。';
							}
						}
					}
					//格式化代码
					then.codeFormat();
					//确定详细信息位置
					var box = res['box'],
						arrow = S.getParentByClass(show,'arrow')[0];
					if(show.style.display === 'block') {
						if((this.offsetLeft+this.offsetWidth+show.offsetWidth-20) >= box.offsetWidth) {
							$$.buffer(show,{top:this.offsetTop},function() {
								$$.buffer(arrow,{marginLeft:'407'},'',10);
								$$.buffer(show,{left:that.offsetLeft-show.offsetWidth},'',10);
							},10);
						}else {
							$$.buffer(show,{top:this.offsetTop},function() {
								$$.buffer(arrow,{marginLeft:'-15'},'',10);
								$$.buffer(show,{left:that.offsetLeft+that.offsetWidth-20},'',10);
							},10);
						}
					}else {
						show.style.display = 'block';
						if((this.offsetLeft+this.offsetWidth+show.offsetWidth-20) >= box.offsetWidth) {
							arrow.style.marginLeft = '407px';
							show.style.top  = this.offsetTop + 'px';
							show.style.left  = this.offsetLeft - show.offsetWidth + 'px';
						}else {
							arrow.style.marginLeft = '-15px';
							show.style.top  = this.offsetTop + 'px';
							show.style.left  = this.offsetLeft + this.offsetWidth - 20 + 'px';
						}
						setTimeout(function() {
							$$.buffer(show,{opacity:'100'},'',10);
						},500)
					}
					//取消事件冒泡
					then.publicCond().cancel(e);
				};
			}
			return this;
		},
		//关闭详细信息
		closeInfo:function() {
			var res = this.publicEle(), that = this;
			res['box'].onclick = function() {
				if(res['show'].style.display === 'block') {
					for(var i=0; i<res['len']; i++) {
						 res['es'][i].className = res['es'][i].className.replace(/curr/g,'');
					}
					//ie7 8 9
					that.publicCond().name(res['len'],res['es']);
					$$.buffer(res['show'],{opacity:'0'},function() {
						res['show'].style.display = 'none';
					},10);
				}
			};
			return this;
		},
		//示例代码格式化
		codeFormat:function() {
			var res = this.publicEle(),
				show = res['show'], that = this,
				example = S.getParentByClass(show,'example')[0];
			show.onclick = function(e) {
				that.publicCond().cancel(e);
			};
			//如果有注释
			if(S.getParentByClass(example,'note').length) {
				var note = S.getParentByClass(example,'note')[0];
				note.innerHTML = note.innerHTML.replace(/(#)/g,'//');
			}
			//代码着色
			var code = example.getElementsByTagName('code')[0], str = code.innerHTML;
			str = str.replace(/((['|"])[^'"]*\2)/g,'<em class=chars>$1</em>');
			str = str.replace(/(var|function|return|if|else|alert)/g,'<em class=keyword>$1</em>');
			str = str.replace(/(\(|\)|,|\.|\{|\}|;)/g,'<em class=sym>$1</em>').replace(/\*\=\*/g,'<em class=sym>=</em>');
			code.innerHTML = str;
			document.getElementById('show').innerHTML = '|' + str.toString() + '|';
			return this;
		},
		//过滤边距
		filterMargin:function() {
			var res = this.publicEle();
			for(var i=0; i<res['len']; i++) {
				if((i+1) % 3 === 0) {
					res['es'][i].className = 'nomlr';
				}
			}
			return this;
		},
		//如果是ie6
		ifIe6:function() {
			if($$.browser().version.ie === 'msie 6.0') {
				document.body.innerHTML = '';
				alert('您使用的是ie6，请尽快升级您的浏览器！');
				return;
			}
			return this;
		}



	};
});

$$.$(function() {
	$$.Code([
		{'name':'selector(eleName,getN,getValue)','note':'#获取class名为me的div元素和拥有属性def的p元素','met':'获取class、id、自定义属性元素','example':'var ms *=* S.selector("div","me");<br>var defs *=* S.selector("p","def");','pars':[
			{'name':'eleName','use':'元素名。'},
			{'name':'getN','use':'需要匹配的class名称或者属性名称。'},
			{'name':'getValue','use':'需要匹配的属性值。'}
		]},
		{'name':'browser()','note':'#检测ie浏览器','met':'浏览器检测与具体版本号','example':'if($$.browser().name.ie) {<br>&emsp;&emsp;alert("ok");<br>}'},
		{'name':'getParentByClass(par,classN)','note':'#获取div1下的class名为child1的元素','met':'获取给定元素下的class元素','example':'var c = S.getParentByClass(div1,"child1");','pars':[
			{'name':'par','use':'父级元素(在此元素下获取指定的class元素)。'},
			{'name':'classN','use':'将要获取的class元素的class名。'}
		]},
		{'name':'toggle(obj)','note':'#点击box元素，第一次弹出1，第二次弹出2...','met':'鼠标单击切换','example':'$$.toggle(box,function() {<br>&emsp;&emsp;alert(1);<br>},function() {<br>&emsp;&emsp;alert(2);<br>});','pars':[
			{'name':'obj','use':'作用的对象。'}
		]},
		{'name':'css(obj,attr,value)','note':'#获取div1的width属性值','met':'设置或获取css属性值','example':'var wid *=* $$.css(div1,"width");','pars':[
			{'name':'obj','use':'元素对象。'},
			{'name':'attr','use':'css属性名称'},
			{'name':'value','use':'指定的属性值。'}
		]},
		{'name':'buffer(obj,targets,callback,times)','note':'#让div1从左到右依次移动500像素之后弹出1','met':'常用运动方式','example':'$$.buffer(div1,{marginLeft:\'500\'},function() {<br>&emsp;&emsp;alert(1);<br>},10);','pars':[
			{'name':'obj','use':'要应用运动的元素对象。'},
			{'name':'targets','use':'运动的目标值。'},
			{'name':'callback','use':'运动完成之后的回调函数。'},
			{'name':'times','use':'运动速度。'}
		]},
		{'name':'flex(obj,attr,target,callback,times)','note':'#让div1从左到右依次移动500像素之后弹出1','met':'弹性运动','example':'$$.flex(div1,\'marginLeft\',\'500\'},function() {<br>&emsp;&emsp;alert(1);<br>},10);','pars':[
			{'name':'obj','use':'要应用运动的元素对象。'},
			{'name':'attr','use':'运动的属性。'},
			{'name':'target','use':'运动的目标值。'},
			{'name':'callback','use':'运动完成之后的回调函数。'},
			{'name':'times','use':'运动速度。'}
		]},
		{'name':'anim(obj,set)','note':'#让p1从左到右按照ease-in的规律移动500像素后弹出1','met':'特效运动方式,算法借鉴自tween','example':'$$.anim(p1,{<br>&emsp;&emsp;"tar":500,<br>&emsp;&emsp;"mode":"ei",<br>&emsp;&emsp;"attr":"marginLeft",<br>&emsp;&emsp;"movetype":"elastic",<br>&emsp;&emsp;"process":function() {<br>&emsp;&emsp;&emsp;&emsp;alert(1);<br>&emsp;&emsp;}<br>})','pars':[
			{'name':'obj','use':'要应用运动的元素对象。'},
			{'name':'targets','use':'运动的目标值。'},
			{'name':'callback','use':'运动完成之后的回调函数。'},
			{'name':'times','use':'运动速度。'}
		]},
		{'name':'hover(obj,fnOver,fnOut)','note':'#设置s1的鼠标移入移出事件','met':'鼠标移入移出','example':'$$.hover(s1,function() {<br>&emsp;&emsp;alert("mouseover");<br>},function() {<br>&emsp;&emsp;alert("mouseout");<br>});','pars':[
			{'name':'obj','use':'元素对象。'},
			{'name':'fnOver','use':'鼠标移入执行的方法。'},
			{'name':'fnOut','use':'鼠标移出执行的方法。'}
		]},
		{'name':'ada(eleList,index)','note':'#获取一组li元素中的第二个','met':'获取指定下标的元素,参数须是一组元素集合','example':'var lis_2 *=* $$.ada(lis,2);','pars':[
			{'name':'eleList','use':'元素集合。'},
			{'name':'index','use':'指定的下标。'}
		]},
		{'name':'findImm(par,child)','note':'#获取div1下的span元素','met':'获取给定元素下的直接指定子元素,可以说元素名也就可以是class名','example':'var spans *=* $$.findImm(div1,"span");','pars':[
			{'name':'par','use':'元对象素。'},
			{'name':'child','use':'将要被获取的子元素的class名货元素名。'}
		]},
		{'name':'trim(str)','note':'#过滤 abc 前后的空白','met':'过滤字符串前后的空白','example':'var str *=* $$.trim(" abc ");'},
		{'name':'isParent(obj,par)','note':'#检测s1元素的父元素是不是div','met':'检测一个元素的的父元素是否是给定的元素(可检测父元素的class或标签名)','example':'if($$.isParent(s1,"div")) {<br>&emsp;&emsp;alert("ok");<br>}','pars':[
			{'name':'obj','use':'目标元素。'},
			{'name':'par','use':'父元素的class名货元素名。'}
		]},
		{'name':'isClass(obj,classN)','note':'#检测s1元素的class是否包含s1','met':'检测一个元素是否包含有给定的class','example':'if($$.isClass(s1,"s1")) {<br>&emsp;&emsp;alert("ok");<br>}','pars':[
			{'name':'obj','use':'目标元素。'},
			{'name':'classN','use':'class名。'}
		]},
		{'name':'attr(obj,attr,value)','note':'#设置div1的my属性为me','met':'设置或获取元素属性值','example':'$$.attr(div1,"my","me");','pars':[
			{'name':'obj','use':'元素对象。'},
			{'name':'attr','use':'作用的属性。'},
			{'name':'value','use':'指定设置的属性值。'}
		]},
		{'name':'isAttr(obj,attr)','note':'#检测s1元素是否有data属性','met':'检测一个元素是否包含有给定的属性(如果属性是class，则class和className等价)','example':'if($$.isAttr(s1,"s1") === 0) {<br>&emsp;&emsp;alert("包含，但值为空");<br>} else if($.isAttr(s1,"s1") === -1) {<br>&emsp;&emsp;alert("包含");<br>} else {<br>&emsp;&emsp;alert("只是指定的属性");<br>}','pars':[
			{'name':'obj','use':'目标元素。'},
			{'name':'attr','use':'属性名。'}
		]},
		{'name':'isContent(obj,inner)','note':'#检测s1元素的内容里面有没(abcabc)','met':'检测一个元素的内容是否包含有给定的内容','example':'if($$.isContent(s1,"(abcabc)")) {<br>&emsp;&emsp;alert("ok");<br>}','pars':[
			{'name':'obj','use':'目标元素。'},
			{'name':'inner','use':'指定检测的内容。'}
		]},
		{'name':'isEmptyObj(obj)','note':'#检测perple对象是否为空','met':'检测是否是对象','example':'if($$.isEmptyObj(perple)) {<br>&emsp;&emsp;alert("ok");<br>}','pars':[
			{'name':'obj','use':'需要检测的对象。'}
		]},
		{'name':'isArray(v)','note':'#检测arr是否是数组','met':'检测一个对象是不是数组','example':'if($$.isArray(arr)) {<br>&emsp;&emsp;alert("ok");<br>}','pars':[
			{'name':'v','use':'需要检测的对象。'}
		]},
		{'name':'arrReplaceToHash(arr,sub)','note':'#讲[1,2,3]转换成指定下标的哈希表','met':'普通数组转换指定下标的哈希表(关联数组)','example':'var hash = $$.arrReplaceToHash([1,2,3],["a","b","c"]);','pars':[
			{'name':'arr','use':'原始数组。'},
			{'name':'sub','use':'转换成哈希表的下标。'}
		]},
		{'name':'request(type,url,callback,val)','note':'#以get方式请求www.a.com的数据并且带一个参数a的值为b并且请求成功后打印出请求的数据','met':'AJAX方法','example':'$$.request("get","www.a.com",function(data) {<br>&emsp;&emsp;alert(data);<br>},{a:b})','pars':[
			{'name':'type','use':'指定请求的方式。'},
			{'name':'url','use':'请求的路径。'},
			{'name':'callback','use':'请求成功之后的回调函数。'},
			{'name':'val','use':'请求时传递的参数。'}
		]},
		{'name':'plug(name,method)','note':'#增加一个名为my的方法，执行弹出1的操作','met':'增加外部方法','example':'$$.plug("my",function() {<br>&emsp;&emsp;alert(1);<br>})','pars':[
			{'name':'name','use':'增加的方法的名称。'},
			{'name':'method','use':'增加的方法的行为(函数)。'}
		]}
	]).nameScroll().showInfo().closeInfo().filterMargin().ifIe6();
});
