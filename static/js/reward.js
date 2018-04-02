$(document).ready(function(){
	//可抽奖次数
	var clickNum = 1;
	// 活动代码
	var acId = 1;
	$.ajax({
        type: 'GET',
        url: "../activity/search/",
        async: false,
        success: function(dataset){
        	acId = dataset[0].id
        }
    });
	$.ajax({
        type: 'POST',
        url: "../rewardNum/search/",
        data: {
        	'acId': acId,
        },
        async: false,
        success: function(dataset){
        	clickNum = dataset[0].rewardCount
        }
    });
	//旋转角度
	var angles;
	//旋转次数
	var rotNum = 0;
	//中奖公告
	var notice = null;
	//中奖物品
	var object = null;
	//转盘初始化
	var color = ["#00B350","#FF9C1E","#4AA9AA","#fff","#fff","#FF9900"];
	var info = ["谢谢参与","  1000","   10","  500","  100"," 4999","    1","   20"];
	var info1 = ['','      元','     元','  淘金币','     元','  淘金币','     元','  淘金币']
	var info = [];
	var info1 = [];
	var objinfo = [];
	var objprob = [];
	var objSumNum = 0;
	$.ajax({
        type: 'POST',
        url: "../rewardObject/search/",
        data: {
        	'acId': acId,
        },
        async: false,
        success: function(dataset){
        	for(i=0;i<dataset.length;i++)
        	{
        		info.push(addtext(dataset[i].reward, 5));
        		info1.push(addtext(dataset[i].unit, 6));
        		objinfo.push(dataset[i].reward);
        		objSumNum += dataset[i].probably;
        		objprob.push(objSumNum);
        	}
        }
    });
	canvasRun();
	addRecord();
	$('#tupBtn').bind('click',function(){
		if (clickNum >= 1) {
			//可抽奖次数减一
			clickNum = clickNum-1;
			//转盘旋转
			runCup();
			//转盘旋转过程“开始抽奖”按钮无法点击
			$('#tupBtn').attr("disabled", true);
			//旋转次数加一
			rotNum = rotNum + 1;
			//“开始抽奖”按钮无法点击恢复点击
			setTimeout(function(){
				alert(notice);
				$('#tupBtn').removeAttr("disabled", true);
			},6000);
			$.ajax({
		        type: 'POST',
		        url: "../rewardRecord/update/",
		        data: {
		        	'acId': acId,
		        	'object': object,
		        },
		        async: false,
		        success: function(dataset){
		        	setTimeout(function(){
		        		addRecord()
					},6000);
		        }
		    });
		}
		else{
			alert("亲，抽奖次数已用光！");
		}
	});

	//转盘旋转
	function runCup(){
		probability();
		var degValue = 'rotate('+angles+'deg'+')';
		$('#myCanvas').css('-o-transform',degValue);           //Opera
		$('#myCanvas').css('-ms-transform',degValue);          //IE浏览器
		$('#myCanvas').css('-moz-transform',degValue);         //Firefox
		$('#myCanvas').css('-webkit-transform',degValue);      //Chrome和Safari
		$('#myCanvas').css('transform',degValue);
	}

	//各奖项对应的旋转角度及中奖公告内容
	function probability(){
		//获取随机数
		var num = parseInt(Math.random()*(objSumNum - 0 + 0) + 0);
		// num = 82
		//概率
		if ( num < objprob[0] ) {
			angles = 2160 * rotNum + 1800;
			notice = info[0] + info1[0];
			object = objinfo[0];
		}
		//概率
		else if ( num < objprob[1] ) {
			angles = 2160 * rotNum + 2115;
			notice = info[1] + info1[1];
			object = objinfo[1];
		}
		//概率
		else if ( num < objprob[2] ) {
			angles = 2160 * rotNum + 2070;
			notice = info[2] + info1[2];
			object = objinfo[2];
		}
		//概率
		else if ( num < objprob[3] ) {
			angles = 2160 * rotNum + 2025;
			notice = info[3] + info1[3];
			object = objinfo[3];
		}
		//概率
		else if ( num < objprob[4] ) {
			angles = 2160 * rotNum + 1980;
			notice = info[4] + info1[4];
			object = objinfo[4];
		}
		//概率
		else if ( num < objprob[5] ) {
			angles = 2160 * rotNum + 1935;
			notice = info[5] + info1[5];
			object = objinfo[5];
		}
		//概率
		else if ( num < objprob[6] ) {
			angles = 2160 * rotNum + 1890;
			notice = info[6] + info1[6];
			object = objinfo[6];
		}
		//概率
		else if ( num < objprob[7] ) {
			angles = 2160 * rotNum + 1845;
			notice = info[7] + info1[7];
			object = objinfo[7];
		}
	}

	//绘制转盘
	function canvasRun(){
		var canvas=document.getElementById('myCanvas');
		var canvas01=document.getElementById('myCanvas01');
		var canvas03=document.getElementById('myCanvas03');
		var canvas02=document.getElementById('myCanvas02');
		var ctx=canvas.getContext('2d');
		var ctx1=canvas01.getContext('2d');
		var ctx3=canvas03.getContext('2d');
		var ctx2=canvas02.getContext('2d');
		createCircle();
		createCirText();
		initPoint();
	
		//外圆
		function createCircle(){
	        var startAngle = 0;//扇形的开始弧度
	        var endAngle = 0;//扇形的终止弧度
	        //画一个8等份扇形组成的圆形
	        for (var i = 0; i< 8; i++){
	            startAngle = Math.PI*(i/4-1/8);
	            endAngle = startAngle+Math.PI*(1/4);
	            ctx.save();
	            ctx.beginPath(); 
	            ctx.arc(150,150,100, startAngle, endAngle, false);
	            ctx.lineWidth = 120;
	            if (i%2 == 0) {
	            	ctx.strokeStyle =  color[0];
	            }else{
	            	ctx.strokeStyle =  color[1];
	            }
	            ctx.stroke();
	            ctx.restore();
	        }
	    }

	    //各奖项
	    function createCirText(){	 
		    ctx.textAlign='start';
		    ctx.textBaseline='middle';
		    ctx.fillStyle = color[3];
		    var step = 2*Math.PI/8;
		    for ( var i = 0; i < 8; i++) {
		    	ctx.save();
		    	ctx.beginPath();
		        ctx.translate(150,150);
		        ctx.rotate(i*step);
		        ctx.font = " 20px Microsoft YaHei";
		        ctx.fillStyle = color[3];
		        ctx.fillText(info[i],-30,-115,60);
		        ctx.font = " 14px Microsoft YaHei";
		        ctx.fillText(info1[i],-30,-95,60);
		        ctx.closePath();
		        ctx.restore();
		    }
		}

		function initPoint(){ 
	        //箭头指针
	        ctx1.beginPath();
	        ctx1.moveTo(100,24);
	        ctx1.lineTo(90,62);
	        ctx1.lineTo(110,62);
	        ctx1.lineTo(100,24);
	        ctx1.fillStyle = color[5];
	        ctx1.fill();
	        ctx1.closePath();
	        //中间小圆
	        ctx3.beginPath();
	        ctx3.arc(100,100,40,0,Math.PI*2,false);
	        ctx3.fillStyle = color[5];
	        ctx3.fill();
	        ctx3.closePath();
	        //小圆文字
	        ctx3.font = "Bold 20px Microsoft YaHei"; 
		    ctx3.textAlign='start';
		    ctx3.textBaseline='middle';
		    ctx3.fillStyle = color[4];
	        ctx3.beginPath();
	        ctx3.fillText('开始',80,90,40);
	        ctx3.fillText('抽奖',80,110,40);
	        ctx3.fill();
	        ctx3.closePath();
	        //中间圆圈
	        ctx2.beginPath();
	        ctx2.arc(75,75,70,0,Math.PI*2,false);
	        ctx2.globalAlpha = 0.5;
	        ctx2.fillStyle = color[2];
	        ctx2.fill();
	        ctx2.lineWidth = 3; 
			ctx2.strokeStyle = '#6DD3CE';
			ctx2.stroke(); 
	        ctx2.closePath();
		}
	}
});


window.alert = function(str)
{
	var shield = document.createElement("DIV");
	shield.id = "shield";
	shield.style.position = "absolute";
	shield.style.left = "50%";
	shield.style.top = "50%";
	shield.style.width = "280px";
	shield.style.height = "150px";
	shield.style.marginLeft = "-140px";
	shield.style.marginTop = "-110px";
	shield.style.zIndex = "25";
	var alertFram = document.createElement("DIV");
	alertFram.id="alertFram";
	alertFram.style.position = "absolute";
	alertFram.style.width = "280px";
	alertFram.style.height = "150px";
	alertFram.style.left = "50%";
	alertFram.style.top = "50%";
	alertFram.style.marginLeft = "-140px";
	alertFram.style.marginTop = "-110px";
	alertFram.style.textAlign = "center";
	alertFram.style.lineHeight = "150px";
	alertFram.style.zIndex = "300";
	strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;width:100%\">\n";
	strHtml += " <li style=\"background:#00B350;text-align:left;padding-left:20px;font-size:14px;font-weight:bold;height:25px;line-height:25px;border:1px solid #F9CADE;color:white\">[中奖提醒]</li>\n";
	strHtml += " <li style=\"background:#8ECB78;text-align:center;font-size:20px;height:95px;line-height:95px;border-left:1px solid #F9CADE;border-right:1px solid #F9CADE;color:#FF9900\">"+str+"</li>\n";
	strHtml += " <li style=\"background:#00B350;text-align:center;font-weight:bold;height:30px;line-height:25px; border:1px solid #F9CADE;\"><input type=\"button\" value=\"确 定\" onclick=\"doOk()\" style=\"width:80px;height:20px;background:#8ECB78;color:white;border:1px solid white;font-size:14px;line-height:20px;outline:none;margin-top: 4px\"/></li>\n";
	strHtml += "</ul>\n";
	alertFram.innerHTML = strHtml;
	document.body.appendChild(alertFram);
	document.body.appendChild(shield);
	this.doOk = function(){
		alertFram.style.display = "none";
		shield.style.display = "none";
	}
	alertFram.focus();
	document.body.onselectstart = function(){return false;};

}

function addtext(xstr, num){
	temp = ''
	snum = num - xstr.length
	if(xstr.length < num){
		for(j=0;j<snum;j++){
			temp += ' '
		}
	}
	return temp + xstr
}

function addRecord(){
	$.ajax({
        type: 'POST',
        url: "../rewardRecord/search/",
        data: {
        	'acId': acId,
        },
        async: false,
        success: function(dataset){
        	htemp = '<ul class="list-group" style="background-color: #007850">'
        	for(i=0;i<dataset.length;i++){
        		htemp += '<li class="list-group-item rewardItem">'
        		htemp += dataset[i].getReward
        		htemp += '    '
        		htemp += dataset[i].createDate.substring(0,10)
        		htemp += '</li>'
        	}
        	htemp += '</ul>'
        	document.getElementById("reward-item").innerHTML = htemp;
        }
    });
}