$(function(){
    var title = document.getElementById("title").innerHTML;
    var windowWidth = $(window).width();
    $.ajax({
        type: 'POST',
        url: "../../albumitemlist/search/",
        async: false,
        data: {
            'title': title
        },
        success: function(dataset){
            ht = ''
            for(i=0;i<dataset.length;i++)
            {
                ht += '<img class="imageitem" src="'
                ht += dataset[i].image
                ht += '" height="'
                ht += windowWidth/2 - 20
                ht += '" width="'
                ht += windowWidth/2 - 20
                ht += '" value="'
                ht += dataset[i].id
                ht += '" id="iimage'
                ht += dataset[i].id
                ht += '"/>'
            }
            document.getElementById("imagelist").innerHTML = ht;
        }
    });
    var albumId = '';
    $.ajax({
        type: 'POST',
        url: "../../albumfile/search/",
        async: false,
        data: {
            'title': title,
            'cover': 'needCover',
        },
        success: function(dataset){
            console.log(dataset)
            albumId = dataset[0].id
            document.getElementById("albumsFileName").value = dataset[0].title;
            document.getElementById("photo").src = dataset[0].cover;
        }
    });
    var imgsObj = $('.amplifyImg img');//需要放大的图像
    if(imgsObj){  
        $.each(imgsObj,function(){  
            $(this).click(function(){  
                var currImg = $(this);
                var imageId = currImg.attr("value")
                var icon = '<div class="icon" ><span id="dimage" value="' + imageId + '">删除</span></div>'
                coverLayer(1);  
                var tempContainer = $('<div class=tempContainer></div>');//图片容器  
                with(tempContainer){
                    //width方法等同于$(this)  
                    appendTo("body");  
                    var windowWidth=$(window).width();  
                    var windowHeight=$(window).height();  
                    //获取图片原始宽度、高度  
                    var orignImg = new Image();  
                    orignImg.src = currImg.attr("src") ;  
                    var currImgWidth = orignImg.width;  
                    var currImgHeight = orignImg.height;  
                    if(currImgWidth<windowWidth){//为了让图片不失真，当图片宽度较小的时候，保留原图  
                        if(currImgHeight<windowHeight){  
                            var topHeight=(windowHeight-currImgHeight)/2;  
                            if(topHeight>35){/*此处为了使图片高度上居中显示在整个手机屏幕中：因为在android,ios的微信中会有一个title导航，35为title导航的高度*/  
                                topHeight=topHeight-35;  
                                css('top',topHeight);  
                            }else{  
                                css('top',0);  
                            }  
                            html('<img class="item" border=0 src=' + currImg.attr('src') + '>' + icon);  
                        }else{  
                            css('top',0);  
                            html('<img class="item" border=0 src=' + currImg.attr('src') + ' height='+windowHeight+'>' + icon);  
                        }  
                    }
                    else{  
                        var currImgChangeHeight = (currImgHeight*windowWidth)/currImgWidth;  
                        if(currImgChangeHeight<windowHeight){  
                            var topHeight = (windowHeight-currImgChangeHeight)/2;  
                            if(topHeight>35){  
                                topHeight=topHeight-35;  
                                css('top',topHeight);  
                            }else{  
                                css('top',0);  
                            }  
                            html('<img class="item" border=0 src=' + currImg.attr('src') + ' width='+windowWidth+';>' + icon);  
                        }else{  
                            css('top',0);  
                            html('<img class="item" border=0 src=' + currImg.attr('src') + ' width='+windowWidth+'; height='+windowHeight+'>' + icon);  
                        }  
                    }  
                };
                $('#dimage').click(function(){  
                    var imageId = $(this).attr("value");
                    $(".item").attr('onclick', '').unbind('click');
                    makesure(imageId)
                }); 
                $('.item').click(function(){  
                    tempContainer.remove();  
                    coverLayer(0);  
                });  
            });  
        });  
    }  
    else{  
        console.log('error');  
    };

    $('body').on("click",'.heart',function()
    {   
        $(this).css("background-position","")
        var D = $(this).attr("rel");
               
        if(D === 'like'){      
            $(this).addClass("heartAnimation").attr("rel","unlike");
        }
        else{
            $(this).removeClass("heartAnimation").attr("rel","like");
            $(this).css("background-position","left");
        }
    });

    var initCropper = function (img, input){
        var $image = img;
        var options = {
            aspectRatio: 16/9, // 纵横比
            viewMode: 2,
            preview: '.img-preview' // 预览图的class名
        };
        $image.cropper(options);
        var $inputImage = input;
        var uploadedImageURL;
        if (URL) {
            // 给input添加监听
            $inputImage.change(function () {
                var files = this.files;
                var file;
                if (!$image.data('cropper')) {
                    return;
                }
                if (files && files.length) {
                    file = files[0];
                    // 判断是否是图像文件
                    if (/^image\/\w+$/.test(file.type)) {
                         // 如果URL已存在就先释放
                        if (uploadedImageURL) {
                             URL.revokeObjectURL(uploadedImageURL);
                        }
                        uploadedImageURL = URL.createObjectURL(file);
                        // 销毁cropper后更改src属性再重新创建cropper
                        $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                        $inputImage.val('');
                    } else {
                        window.alert('请选择一个图像文件！');
                    }
                }
            });
        } 
        else {
            $inputImage.prop('disabled', true).addClass('disabled');
        }
    }
    initCropper($('#photo'),$('#input'));
});

//使用禁用蒙层效果  
function coverLayer(tag){  
    with($('.over')){  
        if(tag==1){  
            css('height',$(document).height());  
            css('display','block');  
            css('opacity',1);  
            css("background-color","#191919");  
        }  
        else{  
            css('display','none');  
        }  
    }  
}

function cancelcoverLayer(){
    $('.tempContainer').remove();  
    coverLayer(0); 
}

function makesure(imageId)
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
    strHtml = "<ul class='dialog'>\n";
    strHtml += " <li class='dialog-header'>删除图片</li>\n";
    strHtml += " <li class='dialog-content'> 确认删除？ </li>\n";
    strHtml += " <li class='dialog-footer'><input class='dialog-footer-queren' type='button' value='确 定' onclick='doOk()'><input class='dialog-footer-queren' type='button' value='取 消' onclick='doCancel()'></li>\n";
    strHtml += "</ul>\n";
    alertFram.innerHTML = strHtml;
    document.body.appendChild(alertFram);
    document.body.appendChild(shield);
    this.doOk = function(){
        alertFram.style.display = "none";
        shield.style.display = "none";
        $.ajax({
            type: 'POST',
            url: "../../albumitemlist/delete/",
            async: false,
            data: {
                'id': imageId
            },
            success: function(dataset){
                alert(imageId, dataset.info);
            }
        });
    }
    this.doCancel = function(){
        alertFram.style.display = "none";
        shield.style.display = "none";
        $(".item").attr('onclick', 'cancelcoverLayer()').bind('click');
    }
    alertFram.focus();
    document.body.onselectstart = function(){return false;};
}

window.alert = function(imageId, info)
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
    strHtml = "<ul class='dialog'>\n";
    strHtml += " <li class='dialog-header'>删除图片</li>\n";
    strHtml += " <li class='dialog-content'>" + info + "</li>\n";
    strHtml += " <li class='dialog-footer'><input class='dialog-footer-queren' type='button' value='确 定' onclick='doOk()'></li>\n";
    strHtml += "</ul>\n";
    alertFram.innerHTML = strHtml;
    document.body.appendChild(alertFram);
    document.body.appendChild(shield);
    this.doOk = function(){
        alertFram.style.display = "none";
        shield.style.display = "none";
        cancelcoverLayer();
        $('#iimage' + imageId).remove();  
    }
    alertFram.focus();
    document.body.onselectstart = function(){return false;};
}

function updateFileName(){
    var albumsFileName = document.getElementById("albumsFileName").value;
    var $image = $('#photo');
    $image.cropper('getCroppedCanvas',{
        width:300,
        height:300
    }).toBlob(function(blob){
        var formData = new FormData();
        formData.append('cover', blob, albumsFileName + '_cover.jpg');
        formData.append('title', albumsFileName);
        formData.append('id', albumId);
        $.ajax({
            type: 'POST',
            url: "../albumfile/create/",
            data: formData,
            processData : false,
            contentType : false,
            success: function(dataset){
            },
            error: function(){
            }
        });
    });
    $('#exampleModal').modal('hide');
}

function deleteFileName(){
    $.ajax({
        type: 'POST',
        url: "../albumfile/delete/",
        data: {
            'id': albumId,
        },
        processData : false,
        contentType : false,
        success: function(dataset){
        },
        error: function(){
        }
    });
    $('#exampleModal').modal('hide');
}
