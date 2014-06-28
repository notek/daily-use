//模式各种方式滚动条
/*
**	参数args是一个json对象，定义了以下属性
**	box:容器元素的类型，如：div，p....
**	boxname:容器名称,可以是class或者id元素
**	isroll:是否允许鼠标轮滚，默认允许(true)
**	size:滚动条的宽度，默认10px
**	color:滚动条的颜色，默认为#999999
**	isanim:是否以动画形式滚动，默认不允许(false)
**	bw:如果容器有边框属性，则bw表示边框宽度，没有则忽略，默认0
 */
$$.plug('scrollbar',function(args) {
	//检查页面上是否有参数带的容器元素
	if(!$$.selector(args.box,args.boxname).length) {
		if(!document.getElementById(args.boxname)) {
			alert('element does not exist');
			return;
		}
	}
	//设置默认属性
	var isroll = args.isroll == false ? false : true,
		isanim = args.isanim ? true : false,
		bw = args.bw * 2 || 0;
	//获取容器元素和内容元素
	var con = $$.selector('div','con')[0],
		box = $$.selector(args.box,args.boxname)[0] || document.getElementById(args.boxname);
	//创建滚动条元素
	//外层元素
	var scrollbox = document.createElement('div');
	scrollbox.className = 'scrollbar';
	scrollbox.style.width = args.size || '10px';
	scrollbox.style.height = box.offsetHeight - bw + 'px';
	//内层元素
	var bar = document.createElement('div');
	bar.className = 'bar';
	bar.style.background = args.color || '#999';
	bar.style.height =  box.offsetHeight / con.offsetHeight * box.offsetHeight  + 'px';
	
	scrollbox.appendChild(bar);
	box.appendChild(scrollbox);
	//判断滚动条位置以及设置内容位置
	var Y, scale;
	function setPos() {
		bar.offsetTop < 0 && (bar.style.top = 0);
		if(bar.offsetTop > box.offsetHeight - bar.offsetHeight - bw) {
			bar.style.top = box.offsetHeight - bar.offsetHeight - bw + 'px';
		}
		scale = bar.offsetTop / (box.offsetHeight - bar.offsetHeight - bw);
		if(isanim) {
			$$.buffer(con,{top:parseInt(-(scale * (con.offsetHeight - box.offsetHeight + bw)),10)},'',20);
		}else {
			con.style.top = -(scale * (con.offsetHeight - box.offsetHeight + bw)) + 'px';
		}	
	}
	//鼠标轮滚
	function mouseWheel(e) {
		e = e || window.event;
		var fx = e.wheelDelta > 0 ? e.wheelDelta > 0 : e.detail < 0;
		if(fx) {
			bar.style.top = bar.offsetTop - 10 + 'px';	
			setPos();
		}else {
			bar.style.top = bar.offsetTop + 10 + 'px';	
			setPos();
		}
		e.preventDefault ? e.preventDefault() : e.returnValue = false;	
	}
	//是否轮滚和轮滚事件绑定
	if(isroll) {
		$$.addEvent('mousewheel',mouseWheel,box);
		$$.addEvent('DOMMouseScroll',mouseWheel,box);
	}
	//鼠标拖动
	bar.onmousedown = function(e) {
		e = e || window.event;	
		Y = e.clientY - this.offsetTop;
		document.onmousemove = function(e) {
			e = e || window.event;
			bar.style.top = e.clientY - Y + 'px';
			setPos();	
		}
		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;	
		}
		return false;
	}
});