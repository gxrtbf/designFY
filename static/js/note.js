$(function(){
	var num = 0;
    var noface = false;
	var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var canvas_temp = document.getElementById('canvas-temp');
    var context = canvas.getContext('2d');
    var temp = canvas_temp.getContext('2d')

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    var trackTask = tracking.track('#video', tracker, { camera: true });
    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
            context.strokeStyle = '#F5A433';
            context.lineWidth = 2;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            num += 1
            if(num%20 == 1){
                temp.drawImage(video, 0, 0, canvas.width, canvas.height);
                dealImg(rect.x, rect.y, 100, 100);
            }
        });     
    });
})

function dealImg(x, y, width, height) {
    var canvas_temp = document.getElementById('canvas-temp');
    var targetctxImageData = canvas_temp.getContext('2d').getImageData(x, y, width, height);

    var canvas_submit = document.getElementById('canvas-submit');
    var ctx = canvas_submit.getContext('2d');

    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.putImageData(targetctxImageData, 0, 0);

    submitImg()
}

function submitImg(){
    var canvas_submit = document.getElementById('canvas-submit');
    canvas_submit.toBlob(function(blob){
        var formData = new FormData();
        formData.append('face', blob, 'test.png');
        $.ajax({
            type: 'POST',
            url: "../note/compareface/",
            data: formData,
            processData : false,
            contentType : false,
            async: false,
            success: function(dataset){
                console.log(dataset.info)
                if(dataset.info <= 35){
                    window.location.href = "../index/";
                }
            },
            error: function(){
                alert('请求错误！')
            }
        })
    })
}