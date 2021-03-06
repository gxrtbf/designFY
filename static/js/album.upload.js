/**
 * Created by zxm on 2017/3/10.
 */
$.fn.extend({
    "initUpload":function(opt) {
        if (typeof opt != "object") {
            alert('参数错误!');
            return;
        }
        var uploadId = $(this).attr("id");
        if(uploadId==null||uploadId==""){
            alert("要设定一个id!");
        }
        $.each(uploadTools.getInitOption(uploadId), function (key, value) {
            if (opt[key] == null) {
                opt[key] = value;
            }
        });
        uploadTools.initWithLayout(opt);//初始化布局
        uploadTools.initWithDrag(opt);//初始化拖拽
        uploadTools.initWithSelectFile(opt);//初始化选择文件按钮
        uploadTools.initWithUpload(opt);//初始化上传
        uploadTools.initWithCleanFile(opt);
        uploadFileList.initFileList(opt);
        getFileName();
        getAddHtml();
        initCropper($('#photo'),$('#input'));
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
/**
 * 上传基本工具和操作
 */
var uploadTools = {
    /**
     * 基本配置参数
     * @param uploadId
     * @returns {{uploadId: *, url: string, autoCommit: string, canDrag: boolean, fileType: string, size: string, ismultiple: boolean, showSummerProgress: boolean}}
     */
    "getInitOption":function(uploadId){
        //url test测试需要更改
        var initOption={
            "uploadId":uploadId,
            "uploadUrl":"../albums/",//必须，上传地址
            "progressUrl":"#",//可选，获取进去信息的url
            "autoCommit":false,//是否自动上传
            "canDrag":true,//是否可以拖动
            "fileType":"*",//文件类型
            "size":"-1",//文件大小限制,单位kB
            "ismultiple":true,//是否选择多文件
            "showSummerProgress":true,//显示总进度条
            "filelSavePath":"",//文件上传地址，后台设置的根目录
            "beforeUpload":function(){//在上传前面执行的回调函数
            },
            "onUpload":function(){//在上传之后
                //alert("hellos");
            }

        };
        return initOption;
    },
    /**
     * 初始化文件上传
     * @param opt
     */
    "initWithUpload":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+" .uploadBts .uploadFileBt").on("click",function(){
            uploadEvent.uploadFileEvent(opt);
        });
        $("#"+uploadId+" .uploadBts .uploadFileBt i").css("color","#0099FF");
    },
    /**
     * 初始化清除文件
     * @param opt
     */
    "initWithCleanFile":function(opt){

        var uploadId = opt.uploadId;
        $("#"+uploadId+" .uploadBts .cleanFileBt").on("click",function(){
            uploadEvent.cleanFileEvent(opt);
        });
        $("#"+uploadId+" .uploadBts .cleanFileBt i").css("color","#0099FF");

    },
    /**
     * 初始化选择文件按钮
     * @param opt
     */
    "initWithSelectFile":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+" .uploadBts .selectFileBt").on("click",function(){
            uploadEvent.selectFileEvent(opt);
        });
    },
    /**
     * 返回显示文件类型的模板
     * @param isImg 是否式图片：true/false
     * @param fileType 文件类型
     * @param fileName 文件名字
     * @param isImgUrl 如果事文件时的文件地址默认为null
     */
    "getShowFileType":function(isImg,fileType,fileName,isImgUrl,fileCodeId){
        var showTypeStr="<div class='fileType'>"+fileType+"</div> <i class='iconfont icon-wenjian'></i>";//默认显示类型
        if(isImg){
            if(isImgUrl!=null&&isImgUrl!="null"&&isImgUrl!=""){//图片显示类型
                showTypeStr = "<img src='"+isImgUrl+"'/>";
            }
        }
        var modelStr="";
        modelStr+="<div class='fileItem'  fileCodeId='"+fileCodeId+"'>";
        modelStr+="<div class='imgShow'>";
        modelStr+=showTypeStr;
        modelStr+=" </div>";
        modelStr+=" <div class='progressItem'>";
        modelStr+="<div class='progress_inner'></div>";
        modelStr+="</div>";
        modelStr+="<div class='status'>";
        modelStr+="<i class='glyphicon glyphicon-trash'></i>";
        modelStr+="</div>";
        modelStr+=" </div>";
        return modelStr;
    },
    /**
     * 初始化布局
     * @param opt 参数对象
     */
    "initWithLayout":function(opt){
        var uploadId = opt.uploadId;
        //选择文件和上传按钮模板
        var btsStr = "";
        btsStr += "<div class='uploadBts row'>";
        btsStr += "<div class='selectFileBt col-xs-4'>选择文件</div>";
        btsStr += "<div class='uploadFileBt col-xs-4'>";
        btsStr += "<span class='glyphicon glyphicon-open'></span>";
        btsStr += "</div>";
        btsStr += "<div class='cleanFileBt col-xs-4'>";
        btsStr += "<span class='glyphicon glyphicon-trash'></span>";
        btsStr += "</div>";
        btsStr += "</div>";
        btsStr += "<div class='row' id='warn' style='display:none;''>";
        btsStr += "<div class='alert alert-warning alert-dismissible' role='alert'>";
        btsStr += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        btsStr += "<strong>创建失败!</strong> 可能存在同名相册！";
        btsStr += "</div>";
        btsStr += "</div>";
        btsStr += "<div class='row' id='info' style='display:none;''>";
        btsStr += "<div class='alert alert-warning alert-dismissible' role='alert'>";
        btsStr += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        btsStr += "<strong>相册创建成功！</strong>";
        btsStr += "</div>";
        btsStr += "</div>";
        btsStr += "<div class='row'>";
        btsStr += "<div class='selectFileNameBt col-xs-8' id='selectFileName'></div>";
        btsStr += "<div class='col-xs-4'>";
        btsStr += "<div id='createFileName'>创建相册</div>";
        btsStr += "</div>";
        $("#"+uploadId).append(btsStr);
        //添加文件显示框
        var boxStr = "<div class='box'></div>";
        $("#"+uploadId).append(boxStr);
    },
    /**
     * 初始化拖拽事件
     * @param opt 参数对象
     */
    "initWithDrag":function(opt){
        var canDrag = opt.canDrag;
        var uploadId = opt.uploadId;
        if(canDrag){
            $(document).on({
                dragleave:function(e){//拖离 
                    e.preventDefault();
                },
                drop:function(e){//拖后放 
                    e.preventDefault();
                },
                dragenter:function(e){//拖进 
                    e.preventDefault();
                },
                dragover:function(e){//拖来拖去 
                    e.preventDefault();
                }
            });
            var box = $("#"+uploadId+" .box").get(0);
            if(box!=null){
                //验证图片格式，大小，是否存在
                box.addEventListener("drop",function(e) {
                    uploadEvent.dragListingEvent(e,opt);
                });
            }
        }
    },
    /**
     * 删除文件
     * @param opt
     */
    "initWithDeleteFile":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+" .fileItem .status i").on("click",function(){
            uploadEvent.deleteFileEvent(opt,this);
        })
    },
    /**
     * 获取文件名后缀
     * @param fileName 文件名全名
     * */
    "getSuffixNameByFileName":function(fileName){
        var str = fileName;
        var pos = str.lastIndexOf(".")+1;
        var lastname = str.substring(pos,str.length);
        return lastname;
    },
    /**
     * 判断某个值是否在这个数组内
     * */
    "isInArray":function(strFound,arrays){
        var ishave = false;
        for(var i=0;i<arrays.length;i++){
            if(strFound==arrays[i]){
                ishave = true;
                break;
            }
        }
        return ishave;
    },
    /**
     * 文件是否已经存在
     * */
    "fileIsExit":function(file,opt){
        var fileList = uploadFileList.getFileList(opt);
        var ishave = false;
        for(var i=0;i<fileList.length;i++){
            //文件名相同，文件大小相同
            if(fileList[i]!=null&&fileList[i].name ==file.name&&fileList[i].size==file.size){
                ishave = true;
            }
        }
        return ishave;
    },
    /**
     * 添加文件到列表
     * */
    "addFileList":function(fileList,opt){
        var uploadId = opt.uploadId;
        var boxJsObj =  $("#"+uploadId+" .box").get(0);
        var fileListArray = uploadFileList.getFileList(opt);
        var fileNumber = uploadTools.getFileNumber(opt);
        if(fileNumber + fileList.length>opt.maxFileNumber){
            alert("最多只能上传"+opt.maxFileNumber+"个文件");
            return;
        }
        var imgtest=/image\/(\w)*/;//图片文件测试
        var fileTypeArray = opt.fileType;//文件类型集合
        var fileSizeLimit = opt.size;//文件大小限制
        for(var i=0;i<fileList.length;i++){
            //判断文件是否存在
            if(uploadTools.fileIsExit(fileList[i],opt)){
                alert("文件（"+fileList[i].name+"）已经存在！");
                continue;
            }
            var fileTypeStr =  uploadTools.getSuffixNameByFileName(fileList[i].name);
            //文件大小显示判断
            if(fileSizeLimit!=-1&&fileList[i].size>(fileSizeLimit*1000)){
                alert("文件（"+fileList[i].name+"）超出了大小限制！请控制在"+fileSizeLimit+"KB内");
                continue;
            }
            //文件类型判断
            if(fileTypeArray=="*"||uploadTools.isInArray(fileTypeStr,fileTypeArray)){
                var fileTypeUpcaseStr = fileTypeStr.toUpperCase();
                if(imgtest.test(fileList[i].type)){
                    //var imgUrlStr = window.webkitURL.createObjectURL(fileList[i]);//获取文件路径
                    var imgUrlStr ="";//获取文件路径
                    if (window.createObjectURL != undefined) { // basic
                        imgUrlStr = window.createObjectURL(fileList[i]);
                    } else if (window.URL != undefined) { // mozilla(firefox)
                        imgUrlStr = window.URL.createObjectURL(fileList[i]);
                    } else if (window.webkitURL != undefined) { // webkit or chrome
                        imgUrlStr = window.webkitURL.createObjectURL(fileList[i]);
                    }
                    var fileModel = uploadTools.getShowFileType(true,fileTypeUpcaseStr,fileList[i].name,imgUrlStr,fileListArray.length);
                    $(boxJsObj).append(fileModel);
                }else{
                    var fileModel = uploadTools.getShowFileType(true,fileTypeUpcaseStr,fileList[i].name,null,fileListArray.length);
                    $(boxJsObj).append(fileModel);
                }
                uploadTools.initWithDeleteFile(opt);
                fileListArray[fileListArray.length] = fileList[i];
            }else{
                alert("不支持该格式文件上传:"+fileList[i].name);
            }
        }
        uploadFileList.setFileList(fileListArray,opt);

    },
    /**
     * 清除选择文件的input
     * */
    "cleanFilInputWithSelectFile":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+"_file").remove();
    },
    /**
     * 根据制定信息显示
     */
    "showUploadProgress":function(uploadId, i){
        $("#"+uploadId+" .box .fileItem[fileCodeId='"+i+"'] .status>i").removeClass("glyphicon glyphicon-trash");
        $("#"+uploadId+" .box .fileItem[fileCodeId='"+i+"'] .status>i").addClass("glyphicon glyphicon-ok");
        $("#"+uploadId+" .box .fileItem[fileCodeId='"+i+"'] .status>i").css("color","#00B38C");
        $("#"+uploadId+" .box .fileItem[fileCodeId='"+i+"'] .progressItem>div").css("width","100%");
    },
    /**
     * 上传文件失败集体显示
     * @param opt
     */
    "uploadError":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+" .box .fileItem .progress>div").addClass("error");
        $("#"+uploadId+" .box .fileItem .progress>div").css("width","100%");
        $("#"+uploadId+" .box .fileItem .status>i").addClass("glyphicon glyphicon-remove");
        var progressBar = $("#"+uploadId+" .subberProgress .progressItem>div");
        progressBar.css("width","0%");
        progressBar.html("0%");
    },
    /**
     * 上传文件
     */
    "uploadFile":function(opt){
        var uploadUrl = opt.uploadUrl;
        var fileList = uploadFileList.getFileList(opt);
        var fileNumber = uploadTools.getFileNumber(opt);
        if(fileNumber<=0){
            alert("没有文件，不支持上传");
            return;
        }
        // uploadTools.disableFileUpload(opt);//禁用文件上传
        // uploadTools.disableCleanFile(opt);//禁用清除文件

        var uploadId = opt.uploadId;
        var timespan =$("#timespan").val();

        for(var i=0;i<fileList.length;i++){
            var formData = new FormData();
            formData.append('image', fileList[i], fileList[i].name);
            formData.append('title', timespan);
            $.ajax({
                type: "post",
                url: "../albumitemlist/create/",
                data: formData,
                processData : false,
                contentType : false,
                async: false,
                success:function(data){
                    uploadTools.getFileUploadPregressMsg(uploadId, i);
                },
                error:function(e){
                    console.log(i);
                }
            });
        };
    },
    /**
     *  获取文件上传进度信息
     */
    "getFileUploadPregressMsg":function(uploadId, i){
        uploadTools.showUploadProgress(uploadId, i);
    },
    /**
     * 禁用文件上传
     */
    "disableFileUpload":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+" .uploadBts .uploadFileBt").off();
        $("#"+uploadId+" .uploadBts .uploadFileBt i").css("color","#DDDDDD");

    },
    /**
     * 禁用文件清除
     */
    "disableCleanFile":function(opt){
        var uploadId = opt.uploadId;
        $("#"+uploadId+" .uploadBts .cleanFileBt").off();
        $("#"+uploadId+" .uploadBts .cleanFileBt i").css("color","#DDDDDD");
    },
    /**
     * 获取文件个数
     * @param opt
     */
    "getFileNumber":function(opt){
        var number = 0;
        var fileList = uploadFileList.getFileList(opt);
        for(var i=0;i<fileList.length;i++){
            if(fileList[i]!=null){
                number++;
            }
        }
        return number;
    }
}
/**
 * 上传事件操作
 * */
var uploadEvent = {
    /**
     * 拖动时操作事件
     */
    "dragListingEvent":function(e,opt){

        e.preventDefault();//取消默认浏览器拖拽效果 
        var fileList = e.dataTransfer.files;//获取文件对象
        uploadTools.addFileList(fileList,opt);
        if(opt.autoCommit){
            uploadEvent.uploadFileEvent(opt);
        }

    },
    /**
     * 删除文件对应的事件
     * */
    "deleteFileEvent":function(opt,obj){
        var fileItem = $(obj).parent().parent();
        var fileCodeId = fileItem.attr("fileCodeId");
        var fileListArray = uploadFileList.getFileList(opt);
        delete fileListArray[fileCodeId];
        uploadFileList.setFileList(fileListArray,opt);
        fileItem.remove();

    },
    /**
     * 选择文件按钮事件
     * @param opt
     */
    "selectFileEvent":function(opt){
        var uploadId = opt.uploadId;
        var ismultiple = opt.ismultiple;
        var inputObj = document.createElement('input');
        console.log(inputObj);
        inputObj.setAttribute('id',uploadId+'_file');
        inputObj.setAttribute('type','file');
        inputObj.setAttribute("style",'visibility:hidden');
        if(ismultiple){//是否选择多文件
            inputObj.setAttribute("multiple","multiple");
        }
        //inputObj.setAttribute("onchange","uploadEvent.selectFileChangeEvent(this.files,"+opt+")");
        $(inputObj).on("change",function(){
            uploadEvent.selectFileChangeEvent(this.files,opt);
        });
        document.body.appendChild(inputObj);
        inputObj.click();
    },
    /**
     * 选择文件后对文件的回调事件
     * @param opt
     */
    "selectFileChangeEvent":function(files,opt){
        uploadTools.addFileList(files,opt);
        uploadTools.cleanFilInputWithSelectFile(opt);

    },
    /**
     * 上传文件的事件
     * */
    "uploadFileEvent":function(opt){
        opt.beforeUpload(opt);
        uploadTools.uploadFile(opt);
    },
    /**
     * 清除文件事件
     */
    "cleanFileEvent":function(opt){
        var uploadId = opt.uploadId;
        if(opt.showSummerProgress){
            $("#"+uploadId+" .subberProgress").css("display","none");
            $("#"+uploadId+" .subberProgress .progress>div").css("width","0%");
            $("#"+uploadId+" .subberProgress .progress>div").html("0%");
        }
        uploadTools.cleanFilInputWithSelectFile(opt);
        uploadFileList.setFileList([],opt);
        $("#"+uploadId+" .box").html("");
        uploadTools.initWithUpload(opt);//初始化上传
    }
}

var uploadFileList={
    "initFileList":function(opt){
        opt.fileList = new Array();
    },
    "getFileList":function(opt){
        return opt.fileList;
    },
    "setFileList":function(fileList,opt){
        opt.fileList = fileList;
    }
}

function getFileName(){
    $.ajax({
        type: 'POST',
        url: "../albumfile/search/",
        data: {},
        success: function(dataset){
            shtml = '<select name="timespan" id="timespan" style="width:100%;height: 40px;">';
            for(i=0;i<dataset.length;i++)
            {
                shtml += '<option id="opt" value="' + dataset[i].title + '">' + dataset[i].title + '</option>';
            }
            shtml += '</select>'
            document.getElementById("selectFileName").innerHTML = shtml;
        },
        error: function(dataset){
            shtml = '<select name="timespan" id="timespan" style="width:100%;height: 40px;">';
            shtml += '</select>'
            document.getElementById("selectFileName").innerHTML = shtml;
        }
    });
}

function getAddHtml(){
    temp = '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">创建相册</button>';
    temp += '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
    temp += '<div class="modal-dialog" role="document">';
    temp += '<div class="modal-content">';
    temp += '<div class="modal-header">';
    temp += '<h4 class="modal-title" id="myModalLabel" style="text-align: center;">创建相册</h4>';
    temp += '</div><div class="modal-body">';
    temp += '<span class="heading">输入相册名称</span>';
    temp += '<div class="form-group">';
    temp += '<input type="input" class="form-control" id="albumsFileName" name="albumsFileName" placeholder="相册名称">';
    temp += '</div>';
    temp += '<div class="form-group">';
    temp += '<span class="heading">相册封面</span>';
    temp += '<img src="" id="photo">';
    temp += '</div>';
    temp += '<label for="input" class="btn btn-primary" id="">';
    temp += '<span>选择图片</span>';
    temp += '<input type="file" id="input" class="sr-only">';
    temp += '</label>';
    temp += '<div>';
    temp += '<p>预览(100*100)：</p>';
    temp += '<div class="img-preview"></div>';
    temp += '</div>';
    temp += '<div class="modal-footer">';
    temp += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    temp += '<button type="submit" class="btn btn-primary" onclick="createFileName()">Save changes</button>';
    temp += '</div></div></div></div>';
    document.getElementById("createFileName").innerHTML = temp;
};
function createFileName(){
    var albumsFileName = document.getElementById("albumsFileName").value;
    var temp = 0;
    $.ajax({
        type: 'POST',
        url: "../albumfile/search/",
        data: {},
        success: function(dataset){
            for(i=0;i<dataset.length;i++)
            {
                if(albumsFileName == dataset[i].title){
                    temp = 1
                    break
                }
            }
            if(temp == 1){
                $("#warn").show();
            }else{
                var $image = $('#photo');
                $image.cropper('getCroppedCanvas',{
                    width:300,
                    height:300
                }).toBlob(function(blob){
                    var formData = new FormData();
                    formData.append('cover', blob, albumsFileName + '_cover.jpg');
                    formData.append('title', albumsFileName);
                    $.ajax({
                        type: 'POST',
                        url: "../albumfile/create/",
                        data: formData,
                        processData : false,
                        contentType : false,
                        success: function(dataset){
                            $("#info").show();
                            getFileName();
                        },
                        error: function(){
                            $("#warn").show();
                        }
                    });
                });
            };
        }
    });
    $('#myModal').modal('hide');
}