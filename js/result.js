var Result = function(type, percent, cnt, totalCnt){
    $('#test').hide();
    $('#main').hide();
    
    var resultDom = $('<div>')
        .attr('id', 'result')
        .appendTo('body');
    
    var resultPan = $('<div>')
        .addClass('result-pan')
        .appendTo(resultDom);
    
    var totalPan = $('<div>')
        .addClass('pan')
        .appendTo(resultPan);
    
    var divPan = $('<div>')
        .addClass('pan')
        .appendTo(resultPan);
    
    var typeText = $('<div>')
        .addClass('type-text')
        .appendTo(totalPan);
    
    if(!mbtiData)
        mbtiData = new MbtiData();
    
    for(var i = 0; i < type.length; i ++) {
        $('<img>')
            .attr('src', mbtiData.getTypeImg(type[i]))
            .appendTo(typeText);        
    }
    
    $('<div>')
        .addClass('percent-text')
        .text('총 ' + totalCnt + '명의 참여자 중 ' + cnt + '명이  이 유형을 선택했습니다.')
        .appendTo(totalPan);
    
    var strMbti = '';
    for(var i = 0; i < percent.length; i++) {
        var part = $('<div>')
            .addClass('part part' + i)
            .appendTo(divPan);
        
        var leftpart = $('<div>')
            .addClass('left-part')
            .text(mbtiData.getPartSet()[i][0])
            .css('color', mbtiData.plusType[i] == type[i] ? '#bdbdbd' : '#fe2dd5')
            .appendTo(part);
        
        var rightpart = $('<div>')
            .addClass('right-part')
            .text(mbtiData.getPartSet()[i][1])
            .css('color', mbtiData.plusType[i] == type[i] ? '#fe2dd5' : '#bdbdbd')
            .appendTo(part);
        
        var progressbar = $('<div>')
            .addClass('progressbar')
            .appendTo(part);

        var progress = $('<div>')
            .addClass('progress')
            .text(percent[i] + '%')
            .css({
                'float': mbtiData.plusType[i] == type[i] ? 'right' : 'left',
                'text-align': mbtiData.plusType[i] == type[i] ? 'left' : 'right'
            })
            .appendTo(progressbar);
        
        progress.animate({
            'width': percent[i] + '%'
        }, 900);
        
        strMbti += mbtiData.plusType[i] == type[i] ? mbtiData.getPartSet()[i][1] : mbtiData.getPartSet()[i][0];
    }
    
    $('<img>')
        .attr('id', 'twitter-go')
        .attr('src', 'https://k.kakaocdn.net/dn/b8Qd3w/btqC3NKkDUm/xh592TgNdUtRM1DGRFQpOK/img.png')
        .on('click', function() {
            var str = encodeURI('https://twitter.com/intent/tweet?hashtags=희진팬_mbti,' + strMbti + '&url=https://loona2jin.github.io/heejin_mbti/');
            location.href = str;
        })
        .appendTo('body');
};
