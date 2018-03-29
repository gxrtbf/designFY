$(function(){
    var expreesion = {
        '0': '不笑',
        '1': '微笑',
        '2': '大笑'
    };
    var glasses = {
        '1': '有',
        '0': '没有'
    };
    var canvas = document.getElementById('canvas');
    var video = document.getElementById('video');
    var tack = document.getElementById('tack');
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    getUserMedia.call(navigator, {
        video: true 
    }, function(localMediaStream) {
        video.src = window.URL.createObjectURL(localMediaStream);
        video.onloadedmetadata = function(e) {   
            // console.log("Label: " + localMediaStream.label);   
            // console.log("AudioTracks" , localMediaStream.getAudioTracks());   
            console.log("VideoTracks" , localMediaStream.getVideoTracks());   
        };   
    }, function(e) {
        console.log('Reeeejected!', e);   
    });
    tack.addEventListener('click', function(){
        canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);
        canvas.toBlob(function(blob){
            var formData = new FormData();
            formData.append('outlook', blob, 'temp.jpg');
            $.ajax({
                type: 'POST',
                url: "../outlook/findface/",
                data: formData,
                processData: false,
                contentType: false,
                success: function(dataset){
                    dataset = dataset['info'][0]
                    ht = '<ul class="list-group">'
                    ht += '<li class="list-group-item list-group-item-success">年龄: ' + dataset.age + '</li>'
                    ht += '<li class="list-group-item list-group-item-success">性别: ' + dataset.gender + '</li>'
                    ht += '<li class="list-group-item list-group-item-success">肤色: ' + dataset.race + '</li>'
                    ht += '<li class="list-group-item list-group-item-info">颜值分数: ' + dataset.beauty.toFixed(2)
                    ht += '</li>'
                    ht += '<li class="list-group-item list-group-item-info">眼镜: ' + glasses[dataset.glasses]
                    ht += '</li>'
                    ht += '<li class="list-group-item list-group-item-warning">表情: ' + expreesion[dataset.expression]
                    ht += '</li>'
                    ht += '<li class="list-group-item list-group-item-warning"> 脸型:  <div id="piechart" style="width: 100%;height: 300px;"></div> </li>'
                    ht += '</ul>'
                    document.getElementById("yanzhi").innerHTML = ht;
                    var delaypieChart = echarts.init(document.getElementById('piechart'));
                    var option = {
                            tooltip : {
                                trigger: 'item',
                                formatter: "{b} : {c} ({d}%)"
                            },
                            legend: {
                                x : 'center',
                                y : 'bottom',
                                data : ['square','triangle','oval','heart','round']
                            },
                            calculable : true,
                            series : [
                                {
                                    name:'面积模式',
                                    type:'pie',
                                    radius : '70%',
                                    center : ['50%', '50%'],
                                    data:[
                                        {value: dataset['faceshape'][0]['probability']*100,name: dataset['faceshape'][0]['type']},
                                        {value: dataset['faceshape'][1]['probability']*100,name: dataset['faceshape'][1]['type']},
                                        {value: dataset['faceshape'][2]['probability']*100,name: dataset['faceshape'][2]['type']},
                                        {value: dataset['faceshape'][3]['probability']*100,name: dataset['faceshape'][3]['type']},
                                        {value: dataset['faceshape'][4]['probability']*100,name: dataset['faceshape'][4]['type']}
                                    ]
                                }
                            ]
                        };
                    delaypieChart.setOption(option);
                },
                error: function(){
                    alert('你不是个人！')
                }
            });
        });
    });
});