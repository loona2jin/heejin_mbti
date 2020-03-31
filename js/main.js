var resultType = '';
var resultPercent = [];
var mbtiData;

var submitDate;
var jsonp;
var query;
$(document).ready(function(){
    
    var startTest = function() {
        mbtiData = new MbtiData();
        var leftArr = new Array();
        var rightArr = new Array();
        
        var leftTypes = ['M', 'R', 'T', 'H'];
        var rightTypes = ['J','P','U','S'];
        
        var roundCnt = 1;
        var leftCnt = 0;
        var rightCnt = 0;
        
        var score = 0;
        
        $('#main').hide();
                
        var sendData = function() {
            $('#test').hide();
            $('#main').hide();
            submitDate = new Date();
            var allData = $.param({"entry.2102064359": resultType, "entry.1004947693": submitDate}, true);
            $.ajax({
                 url:"https://docs.google.com/forms/u/0/d/e/1FAIpQLSdypGdY0cmjmqwkqZNzWznEzSQkkpOSQY8bt5mcR1nOjvqihQ/formResponse",
                 data: allData,
                 type:"POST"
            }).always(function(jqXHR, textStatus) {
                setTimeout(function() {
                    query('SELECT C WHERE C = "' + submitDate + '"', '설문지 응답 시트1', 'callback_update');    
                }, 500);                
            });
        };
        
        var selectPic = function(e) {
            if(rightTypes.indexOf($(this).data('info').type) != -1)
                score++;
            else
                --score;
            
            // 애니메이션
            leftPic[0].animate([
                      {transform: 'none', opacity: '1', offset: 0},
                      {transform: 'translate3d(0, 50px, 0)', opacity: '1', offset: 0.2},
                      {transform: 'translate3d(0, 20px, 0)', opacity: '1', offset: 0.4},
                      {transform: 'translate3d(0, 20px, 0)', opacity: '1', offset: 0.45},
                      {transform: 'translate3d(0, -2000px, 0)', opacity: '0', offset: 1}], {
              direction: 'alternate',
              duration: 900
            });
            
            rightPic[0].animate([
                      {transform: 'none', opacity: '1', offset: 0},
                      {transform: 'translate3d(0, 50px, 0)', opacity: '1', offset: 0.2},
                      {transform: 'translate3d(0, -20px, 0)', opacity: '1', offset: 0.4},
                      {transform: 'translate3d(0, -20px, 0)', opacity: '1', offset: 0.45},
                      {transform: 'translate3d(0, 2000px, 0)', opacity: '0', offset: 1}], {
              direction: 'alternate',
              duration: 900
            });
            
            setTimeout(function(){
                if(leftCnt < leftArr.length - 1) {
                    //leftPic.css('background-image','none').hide();
                    //rightPic.css('background-image','none').hide();
                    leftSpin.show();
                    rightSpin.show();
		
                    createRound(leftArr[++leftCnt], rightArr[++rightCnt]);
                } else {
                    //console.log(score);
                    if(score < 0)
                        resultType += leftTypes[roundCnt - 1];
                    else
                        resultType += rightTypes[roundCnt - 1];

                    var typeCnt = mbtiData.getTypeCnt(leftTypes[roundCnt - 1]);
                    resultPercent.push((((Math.abs(score) + typeCnt) / 2) / typeCnt * 100).toFixed());
                    
                    rightPic.off('click');
                    leftPic.off('click');

                    sendData();
                }
            }, 900);
            
        };
        
        var testBody = $('<div>')
            .attr('id', 'test')
            .appendTo('body');
        
        var leftDom = $('<div>')
            .addClass('select')
            .addClass('select1')
            .appendTo(testBody);
        
        var leftPic = $('<div>')
            .addClass('pic')
            .on('click', selectPic)
            .appendTo(leftDom);
        
        var leftType = $('<div>')
            .addClass('type')
            .appendTo(leftDom);
        
        var rightDom = $('<div>')
            .addClass('select')
            .addClass('select2')
            .appendTo(testBody);
        
        var rightPic = $('<div>')
            .addClass('pic')
            .on('click', selectPic)
            .appendTo(rightDom);
        
        var rightType = $('<div>')
            .addClass('type')
            .appendTo(rightDom);
        
	var leftSpin = $('<div class="spinner-block"><div class="spinner spinner-1"></div></div>').appendTo(leftPic);
        var rightSpin = $('<div class="spinner-block"><div class="spinner spinner-1"></div></div>').appendTo(rightPic);
	    
        var vsDom = $('<img>')
            .attr('src', 'https://k.kakaocdn.net/dn/xlftt/btqC2sTA5IA/WMVXp01Pv8931zCJHeKbJk/img.png')
            .appendTo(testBody);
        
//        var roundDom = $('<img>')
//            .addClass('round')
//            .appendTo(testBody);
        
        var reArray = function(arr){
            var i = 0;
            var newArray = [];
            while(arr.length > 0) {
                var x = parseInt(Math.random()*arr.length);
                newArray[i] = arr[x];
                i++;
                arr.splice(x,1);
            }
            return newArray;
        };
        
        var createRound = function(leftData, rightData) {
            if(roundCnt != leftData.group) {
                if(score < 0)
                    resultType += leftTypes[roundCnt - 1];
                else
                    resultType += rightTypes[roundCnt - 1];
                //console.log(score, resultType);
                
                var typeCnt = mbtiData.getTypeCnt(leftTypes[roundCnt - 1]);
                resultPercent.push((((Math.abs(score) + typeCnt) / 2) / typeCnt * 100).toFixed());
                
                score = 0;
                roundCnt++;             
            }
            
            //roundDom.attr('src', mbtiData.getRound(roundCnt));
            
            $('<img/>').attr('src', leftData.data).on('load', function(e) {
               $(this).remove(); 
               leftPic                
                .data('info', leftData)
                .css('background-image', 'url("' + leftData.data + '")');
		leftSpin.hide();
		       //.fadeIn(500);
            });
            
            $('<img/>').attr('src', leftData.data).on('load', function(e) {
               $(this).remove(); 
               rightPic
                .data('info', rightData)
                .css('background-image', 'url("' + rightData.data + '")');
		rightSpin.hide();
		//.fadeIn(500);
            });
                        
            leftType.css('background-image', 'url("' + mbtiData.getTypeImg(leftData.type) + '")');
            rightType.css('background-image', 'url("' + mbtiData.getTypeImg(rightData.type) + '")');
            
            progressTest.css('width', leftCnt / leftArr.length * 100 + '%');
            /*vsDom[0].animate([
              {opacity: '1', offset: 0}, 
              {opacity: '0', offset: 0.25}, 
              {opacity: '1', offset: 0.5}, 
              {opacity: '0', offset: 0.75}, 
              {opacity: '1', offset: 1}], {
              direction: 'alternate',
              duration: 900
            });*/
        };

        for(var i = 1; i <= 4; i++) {
            leftArr =leftArr.concat(reArray(mbtiData.getTypeByGroup(i).set1));
            rightArr = rightArr.concat(reArray(mbtiData.getTypeByGroup(i).set2));
        }
                
        var progressState = $('<div>')
            .addClass('test-state')
            .appendTo('body');
        
        var progressTest = $('<div>')
            .addClass('test-progress')
            .css('width', leftCnt / leftArr.length * 100 + '%')
            .appendTo(progressState);
        
        createRound(leftArr[leftCnt], rightArr[rightCnt]);
    };
    
    var mainBody = $('<div>')
        .addClass('mainBody')
    
    var mainText = $('<div>')
        .addClass('mainText')
        .appendTo(mainBody);
    
    $('<h1>')
        .text('검사가 너무 정확해 "살짝 소름이 돋을 정도예요"라고 희진팬 유형 검사를 마친 한 참여자는 말했습니다.')
        .appendTo(mainText);
     $('<h3>')
        .text('쉽고 간단하면서도 정확한 희진팬 유형 검사를 통해 당신이 누구이며, 왜 그러한 특정 행동 성향을 보이는지 확인하십시오.')
        .appendTo(mainText);
    
    var mainTip = $('<div>')
        .addClass('mainTip')
        .appendTo(mainBody);
    
    $('<div>')
        .addClass('tip')
        .append('<img src="https://static.neris-assets.com/images/test-header-1.svg">')
        .append('<div>총 검사 시간은 10분 19초 내외입니다.</div>')
        
        .appendTo(mainTip);
    
    $('<div>')
        .addClass('tip')
        .append('<img src="https://static.neris-assets.com/images/test-header-2.svg">')
        .append('<div>혹 질문이 마음에 들지 않더라도 정직하게 답변하십시오.</div>')
        .appendTo(mainTip);
        
    var buttonWrapper = $('<div>')
        .addClass('button-wrapper')
        .appendTo(mainBody);    
    $('<a>')
        .text('검사 실시')
        .on('click', startTest)
        .addClass('start-button')
        .appendTo(buttonWrapper);
        
    $('<div>')
        .addClass('footer')
        
        .appendTo(mainBody);

    mainBody.appendTo($('#main'));
    
    
    jsonp = function (url) {
	    var script = window.document.createElement('script');
	    script.async = true;
	    script.src = url;
	    script.onerror = function () {
	        alert('Can not access JSONP file.');
	    };
	    var done = false;
	    script.onload = script.onreadystatechange = function () {
	        if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
	            done = true;
	            script.onload = script.onreadystatechange = null;
	            if (script.parentNode) {
	                return script.parentNode.removeChild(script);
	            }
	        }
	    };

	    window.document.getElementsByTagName('head')[0].appendChild(script);
	};

	query = function (sql, sheetName, callback) {
        var myKey = '1sz1JtDdCFdSARaIxLfbNUw6l8Duk0Dzlp8kGP2wFEtU';
	    var url = 'https://docs.google.com/spreadsheets/d/'+myKey+'/gviz/tq?',
	        params = {
	            tq: encodeURIComponent(sql),
	            sheet: encodeURIComponent(sheetName),
	            tqx: 'responseHandler:' + callback
	        },

	        qs = [];
	    for (var key in params) {
	        qs.push(key + '=' + params[key]);
	    }

	    url += qs.join('&');
	    return jsonp(url); // Call JSONP helper function
	};
});

var dep = 0;
var callback_update = function(data) {
    if(!data.table.rows.length) {
        dep = 1;
    }
    
    query('SELECT B, count(B) group by B', '설문지 응답 시트1', 'callback_result');
};

var callback_result = function (data) {
	data = parse(data); // Call data parser helper function  

    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    var totalcnt = 0;
    var curcnt = 0;
    for(var i = 0; i < data.length; i++){
    	if(data[i][col[0]] == resultType)
    		curcnt = data[i][col[1]];
    	totalcnt += data[i][col[1]];
    }

    Result(resultType, resultPercent, curcnt + dep, totalcnt + dep);
};
	
var parse = function (data) {
    var column_length = data.table.cols.length;
    if (!column_length || !data.table.rows.length) {
        return false;
    }

    var columns = [],
        result = [],
        row_length,
        value;

    for (var column_idx in data.table.cols) {
        columns.push(data.table.cols[column_idx].label);

    }

    for (var rows_idx in data.table.rows) {
        row_length = data.table.rows[rows_idx]['c'].length;
        if (column_length != row_length) {
            return false;
        }

        for (var row_idx in data.table.rows[rows_idx]['c']) {
            if (!result[rows_idx]) {
                result[rows_idx] = {};
            }

			if(data.table.rows[rows_idx]['c'][row_idx]){
	            value = !!data.table.rows[rows_idx]['c'][row_idx].v ? data.table.rows[rows_idx]['c'][row_idx].v : null;
	            if (data.table.rows[rows_idx]['c'][row_idx].f !== undefined && data.table.rows[rows_idx]['c'][row_idx].v !== undefined) {
	                value = data.table.rows[rows_idx]['c'][row_idx].f;
	            }
          	} 
            result[rows_idx][columns[row_idx]] = value;
        }
    }
    return result;
};
