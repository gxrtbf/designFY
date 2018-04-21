$(function(){
	var num = 0
	var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var canvas_temp = document.getElementById('canvas-temp');
    var context = canvas.getContext('2d');
    var temp = canvas_temp.getContext('2d')

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    tracking.track('#video', tracker, { camera: true });
    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        event.data.forEach(function(rect) {
        	num = num + 1
            context.strokeStyle = '#F5A433';
            context.lineWidth = 2;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            if(num==1){
                temp.drawImage(video, 0, 0, canvas.width, canvas.height)
            	dealImg(rect.x-50, rect.y-50, 200, 200)
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
        formData.append('face', blob, 'test.jpg');
        $.ajax({
            type: 'POST',
            url: "../note/compareface/",
            data: formData,
            processData : false,
            contentType : false,
            success: function(dataset){
            },
            error: function(){
            }
        })
    })
}