$(function(){
	var num = 0;
    var dalist = [];
	var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var canvas_temp = document.getElementById('canvas-temp');
    var context = canvas.getContext('2d');
    var temp = canvas_temp.getContext('2d');

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
            num += 1;
            if(num%3 == 1){
                temp.drawImage(video, 0, 0, canvas.width, canvas.height);
                dealImg(rect.x-50, rect.y-50, 200, 200);
                dalist = getImgBlob(dalist);
                if(dalist.length > 2){
                    submitImg(dalist);
                    dalist = [];
                }
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
}

function getImgBlob(dalist){
    var canvas_submit = document.getElementById('canvas-submit');
    canvas_submit.toBlob(function(blob){
        dalist.push(blob)
    })
    return dalist
}

function submitImg(bloblist){
    var formData = new FormData();
    for(i=0;i<bloblist.length;i++){
        formData.append('file[]', bloblist[i]);
    }
    $.ajax({
        type: 'POST',
        url: "../note/compareface/",
        data: formData,
        async: false,
        contentType: false,
        processData: false,
        success: function(dataset){
            console.log(dataset.info)
            if(dataset.info <= 60){
                window.location.href = "../index/";
            }
        },
        error: function(){
            alert('请求错误！')
        }
    })
}