window.onload = function() {
	var box = document.getElementById('box'),
		ims = S.selector('ul','imgs')[0], wid = 0, num = 1,
		now = S.selector('em','now')[0], 
		c = S.selector('span','close')[0], a = S.selector('em','all')[0],
		p = S.selector('span','prev')[0], n = S.selector('span','next')[0],
		lis = ims.getElementsByTagName('li'), len = lis.length, s = true;
	a.innerHTML = len;
	for(var i=0; i<len; i++) {
		wid += lis[i].offsetWidth;
	}
	ims.style.width = wid + 'px';
	function next() {
		if(s) {
			s = false;
			if(num >= len) num = 0;
			num += 1;
			now.innerHTML = num;
			$$.buffer(ims,{marginLeft:ims.offsetLeft + -lis[0].offsetWidth},function() {
				s = true;
				ims.style.marginLeft = '0';
				var newnode = lis[0].cloneNode(true);
				ims.removeChild(lis[0]);
				ims.appendChild(newnode);
			},10);
		}
	}
	function prev() {
		if(s) {
			s = false;
			if(num <= 1) num = len+1;
			num -= 1;
			now.innerHTML = num;
			var newnode = lis[len-1].cloneNode(true);
			ims.removeChild(lis[len-1]);
			ims.insertBefore(newnode,lis[0]);
			ims.style.marginLeft = -lis[len-1].offsetWidth + 'px';
			$$.buffer(ims,{marginLeft:ims.offsetLeft + lis[len-1].offsetWidth},function() {
				s = true;
			},10);
		}
	}
	//setInterval(next,5000);
	n.onclick = next;
	p.onclick = prev;
	function mouseWheel(e) {
		e = e || window.event;
		//向下滚动false，反之true
		var fx = e.wheelDelta > 0 ? e.wheelDelta > 0 : e.detail < 0;
		!fx ? next() : prev();
	}
	document.body.onmousewheel = function() {
		return false;
	};
	$$.addEvent('mousewheel',mouseWheel,box);
	$$.addEvent('DOMMouseScroll',mouseWheel,box);
}