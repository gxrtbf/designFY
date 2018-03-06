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
    }
});
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
        modelStr+="<i class='iconfont icon-shanchu'></i>";
        modelStr+="</div>";
        // modelStr+=" <div class='fileName'>";
        // modelStr+=fileName;
        // modelStr+="</div>";
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
        btsStr += "<span class='iconfont icon-shangchuan'></span>";
        btsStr += "</div>";
        btsStr += "<div class='cleanFileBt col-xs-4'>";
        btsStr += "<span class='iconfont icon-qingchu'></span>";
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
        $("#"+uploadId+" .box .fileItem[fileCodeId='"+i+"'] .status>i").addClass("iconfont icon-gou");
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
        $("#"+uploadId+" .box .fileItem .status>i").addClass("iconfont icon-cha");
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

        uploadTools.disableFileUpload(opt);//禁用文件上传
        uploadTools.disableCleanFile(opt);//禁用清除文件

        var uploadId = opt.uploadId;
        var timespan =$("#timespan").val();

        for(var i=0;i<fileList.length;i++){
            var formData = new FormData();
            formData.append('image', fileList[i], fileList[i].name);
            formData.append('title', timespan);

            $.ajax({
                type: "post",
                url: "../albums/",
                data: formData,
                processData : false,
                contentType : false,
                async: false,
                success:function(data){
                    uploadTools.getFileUploadPregressMsg(uploadId, i);
                },
                error:function(e){
                    console.log(i)
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
    var userId = document.getElementById("userId").innerHTML;
    $.ajax({
        type: 'GET',
        url: "../albumFilesList/" + userId + "/?format=json",
        success: function(dataset){
            shtml = '<select name="timespan" id="timespan" style="width:100%;height: 40px;">';
            for(i=0;i<dataset.length;i++)
            {
                shtml += '<option id="opt" value="' + dataset[i].id + '">' + dataset[i].title + '</option>';
            }
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
    temp += '</div><div class="modal-footer">';
    temp += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
    temp += '<button type="submit" class="btn btn-primary" onclick="createFileName()" data-dismiss="modal">Save changes</button>';
    temp += '</div></div></div></div>';
    document.getElementById("createFileName").innerHTML = temp;
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function createFileName(){
    var userId = document.getElementById("userId").innerHTML;
    var albumsFileName = document.getElementById("albumsFileName").value;
    var temp = 0;
    $.ajax({
        type: 'GET',
        url: "../albumFilesList/" + userId + "/?format=json",
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
                $.ajax({
                    type: 'POST',
                    url: "../albumsfile/",
                    data: {
                        'owner': userId,
                        'title': albumsFileName
                    },
                    success: function(dataset){
                        $("#info").show();
                        getFileName();
                    },
                    error: function(){
                        $("#warn").show();
                    }
                });
            }
        }
    });
}