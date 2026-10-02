/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function Upcode() { };
Upcode.prototype = {
    
    init: function () {
        var me = this;
        me.uploadImport(["txtFile_Upcode"], me.import_UpCode);
    },

    import_UpCode: function (a, strPath) {
        var me = this;
        var arrKetQua = strPath.split("$");
        //--Edit
        var obj_list = {
            'action': 'CMS_UpCode/UpCode',


            'strPath': arrKetQua[0],
            'strFileName': arrKetQua[1]
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.viewFiles("txtFile_Table", "");
                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert("CMS_SVQT/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    uploadImport: function (arrZoneId, callback) {
        //in html: <div id="uploadFile_PN"></div>
        //in html: <div id="zoneHienThiFIle"></div>
        //in js: edu.system.uploadImage(["uploadFile_PN"], "");
        //edu.system.uploadImage(["uploadFile_PN:zoneHienThiFIle"], "");
        //Nếu có dấu : tức là sẽ có tùy chọn zone hiển thị riêng không sử dụng mặc định nữa
        //callback sẽ gồm 2 tham số: strId == arrZoneId[i], danh sách tên file trả về. Mỗi khi thêm hoặc xóa file đều gọi callback
        //Danh sách tên file trả về mặc định lưu ở textarea id="" + arrZoneId[i]
        //in html: <div id="uploadPicture_PN"></div>
        //in js: edu.system.singleFileUp(["uploadPicture_PN"], "");
        var me = edu.system;
        var strModule_Name = "";
        var strFolderExtend = "";
        var strLinkUpload = "";
        var strOutFolderPath = "Upload/File/";
        if (!edu.util.checkValue(strFolderExtend)) {
            strFolderExtend = "";
        }
        if (!edu.util.checkValue(arrZoneId)) {
            me.alert("Chưa truyền vào arrZoneId", "w");
            return false;
        }
        //Kiểm tra id file có tồn tại không
        for (var i = 0; i < arrZoneId.length; i++) {
            var temp = arrZoneId[i];
            //Nếu file chứa dấu : kiểm tra xem có tồn tại id đó không
            if (temp.indexOf(":") != -1) {
                if (document.getElementById(temp.substring(0, temp.indexOf(":"))) == undefined) {
                    me.alert("Không tồn tại id: " + temp, "w");
                    continue;
                }
            }
            else {
                if (document.getElementById(temp) == undefined) {
                    me.alert("Không tồn tại id: " + temp, "w");
                    continue;
                }
            }
        }
        var arrMulFileUp = [];// Mảng 2 chiều [["newFileName1", "FileName2"],["newFileName1", "FileName2"]]
        var loadFileSuccess = 0; //Lưu tình trạng tải file: 0 có thể gửi, 1 đang tải file đính kèm lên server, 2 đã hoàn thành tải file lên server
        //Thêm thư viện
        //var row = "";
        //row += '<link href="' + strLinkUpload + 'Core/jquery-ui.structure.min.css" rel="stylesheet" />';
        //row += '<link href="' + strLinkUpload + 'Core/jquery-ui.theme.min.css" rel="stylesheet" />';
        //$(me.ctPlacehoder).append(row);
        uploadFile(arrZoneId);

        function uploadFile(arrFile) {
            for (var i = 0; i < arrFile.length; i++) {
                var elementId = arrFile[i];
                var strZoneFileDinhKem = "";
                //Nếu file chứa dấu : tức là có zone upload riêng
                if (elementId.indexOf(":") != -1) {
                    strZoneFileDinhKem = elementId.substring(elementId.indexOf(":") + 1);
                    elementId = elementId.substring(0, elementId.indexOf(":"));
                }
                else {
                    strZoneFileDinhKem = "zoneFileDinhKem" + elementId;
                }
                var row = "";
                row += '<input id="divupload' + elementId + '" type="image" src="' + me.rootPathUpload + '/Core/images/file_add.png" value="Upload" />';
                row += '<input id="uploader' + elementId + '" type="file" style="display: none">';
                row += '<textarea id="' + elementId + '" style="display: none"></textarea>';
                row += '<div class="clear"></div>';
                row += '<div id="zoneFileDinhKem' + elementId + '"></div>';
                row += '<div class="clear"></div>';
                row += ' <div id="progress-bar' + elementId + '" style="position: relative; display: none">';
                row += '<span id="progressbar-label' + elementId + '" style="position: absolute; left: 0%; top: 20%;">Please Wait...</span>';
                row += '</div>';
                $("#" + elementId).replaceWith("<div id='zoneFileUp" + elementId + "'>" + row + "</div>");
                //Sự kiện khi nhấn 
                $("#divupload" + elementId).click(function (e) {
                    e.preventDefault();
                    me.viewFiles(elementId, "");
                    $("#uploader" + elementId).trigger("click");
                });

                document.getElementById("uploader" + elementId).addEventListener("change", function () {
                    upLoadFiles(elementId, strZoneFileDinhKem);
                });

                //Sự kiến xóa file khi click vào nút xóa tại mỗi ô file upload
                $(document).delegate(".btnDeleteFileUp" + elementId, "click", function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var point = this;
                    //console.log(elementId);
                    //var strId = $(this).attr("name");
                    //var strNewFileName = $(this).attr("title");
                    $(point.parentNode.parentNode).replaceWith('');
                    //Khac ban chinh
                    //$.ajax({
                    //    url: strLinkUpload + 'Handler/del_file_v2.ashx?strFileDel=' + strNewFileName,
                    //    method: 'post',
                    //    success: function (data) {
                    //        $(point.parentNode.parentNode).replaceWith('');
                    //        outThongTinDinhKem(strId);
                    //    }
                    //});
                    //Thay đổi hiển thị nút upload
                    $("#divupload" + elementId).attr("src", me.rootPathUpload + "/Core/images/file_add.png");
                    $("#" + elementId).val("");
                });
            }
        }

        function upLoadFiles(elementId, strZoneUp) {
            //Cập nhật trạng thái đang up file
            loadFileSuccess = 1;
            var uploadedFiles = $('#uploader' + elementId)[0].files;
            //Chứa danh sách tên file cho lần upload hiện tại trên giao diện
            var arrFileName = [];
            //Lấy lại danh sách file bao gồm file lưu dưới db và tên file hiển thị
            arrMulFileUp = getDSFile(elementId);
            //Chỉnh sửa lại arrMulFileUp
            //Số file select trên giao diện
            if (uploadedFiles.length > 0) {
                var formData = new FormData();
                //Kiểm tra sự trùng lặp file khi upload
                for (var i = 0; i < uploadedFiles.length; i++) {
                    var icheck = true;
                    for (var j = 0; j < arrMulFileUp.length; j++) {
                        //Kiểm tra dự vào file name
                        if (uploadedFiles[i].name == arrMulFileUp[j][1]) icheck = false;
                    }
                    if (icheck) {
                        //Kiểm tra đuôi file
                        var strFileName = uploadedFiles[i].name;
                        var vitri = strFileName.lastIndexOf(".");
                        var strExtensionFile = strFileName.substring(vitri + 1);
                        var strCheck = checkFileImport(strExtensionFile);
                        if (strCheck == "") {
                            me.alert("File <b>" + strFileName + "</b> không hợp lệ!", 'w');
                            return;
                        }
                        formData.append(strFileName, uploadedFiles[i]);
                        arrFileName.push(strFileName);
                    }
                }
            }
            else {
                me.alert("Bạn chưa chọn file nào!", 'w');
                return;
            }
            //Kiểm tra nếu không có new file thoát ra
            if (arrFileName.length <= 0) {
                me.alert("Không có file nào mới!", 'w');
                return;
            }

            var progressbarLabel = $('#progressbar-label' + elementId);
            var progressbarDiv = $('#progress-bar' + elementId);
            console.log(me.rootPathUpload + "/Handler/deploycode.ashx");
            $.ajax
                ({
                    url: me.rootPathUpload + "/Handler/deploycode.ashx",
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (response) {
                        //

                        //Cập nhật trạng thái load thành công
                        loadFileSuccess = 2;
                        //Thông báo lỗi khi response trả về có chứa "Loi System"
                        if (response.indexOf('Loi System') != -1) {
                            me.alert(response, 'w');
                            return;
                        }
                        progressbarLabel.text('Tải lên server thành công!', 'w');
                        if (arrFileName.length > 1) {
                            var arrfile = response.split(",");
                            if (arrfile.length != arrFileName.length) {
                                me.alert("File đính kèm không hợp lệ. Vui lòng thử lại", "w");
                                return;
                            }
                            for (var i = 0; i < arrfile.length; i++) {
                                arrMulFileUp.push([arrfile[i], arrFileName[i]]);
                            }
                        }
                        else {
                            if (arrFileName.length > 0) arrMulFileUp = [[response, arrFileName[0]]];
                        }
                        //Hiển thị lại danh sách
                        viewFileDinhKem(elementId, strZoneUp);
                        progressbarDiv.fadeOut(2000);
                    },
                    error: function (err) {
                        console.log(11111);
                        loadFileSuccess = 2;
                        me.alert(err.statusText);
                    }
                });
            progressbarLabel.text('Vui lòng chờ đợi...');
            progressbarDiv.progressbar({
                value: false
            }).fadeIn(1000);
        }

        function viewFileDinhKem(elementId, strZoneUp) {
            $("#" + strZoneUp).html("");
            var row = '';
            for (var i = 0; i < arrMulFileUp.length; i++) {
                //Hiện thị hình ảnh đuôi mở rộng
                var strFileName = arrMulFileUp[i][1];
                var strFileNameInStorage = arrMulFileUp[i][0];
                vitri = strFileNameInStorage.lastIndexOf(".");
                var strExtensionFile = strFileNameInStorage.substr(vitri + 1, strFileNameInStorage.length);

                var strColor = "black";
                var strFileStyle = "fa fa-file";
                switch (strExtensionFile.trim()) {
                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        strFileStyle = "fa fa-file-image-o";
                        strColor = "pink";
                        break;
                    case "doc":
                    case "docx":
                        strFileStyle = "fa fa-file-word-o";
                        strColor = "blue";
                        break;
                    case "xls":
                    case "xlsx":
                        strFileStyle = "fa fa-file-excel-o";
                        strColor = "green";
                        break;
                    case "pdf":
                        strFileStyle = "fa fa-file-pdf-o";
                        strColor = "red";
                        break;
                    case "rar":
                        strFileStyle = "fa fa-file-archive-o";
                        strColor = "purple";
                        break;
                }
                var content = '';
                if (strExtensionFile == "jpg" || strExtensionFile == "png" || strExtensionFile == "png" || strExtensionFile == "png") {
                    var pictureUp = strLinkUpload + strFileNameInStorage;
                    content = '<img class="user-image" style="height: 111px; witdh: 80px; overflow: hidden" src="' + pictureUp + '"/>';
                }
                else {
                    content += '<i style="color: ' + strColor + '" class="' + strFileStyle + '" title="' + strFileName + '"></i>';
                }

                row += '<li>';
                row += '<span class="mailbox-attachment-icon">';
                row += content;
                row += '<a style="left: 0px; top: 0px; z-index: 99999999999;" class="btn btn-default btn-xs pull-right btnDeleteFileUp' + elementId + '" name="' + elementId + '" title="' + strFileNameInStorage + '" filename="' + strFileName + '" href="#">';
                row += '<i class="fa fa-times-circle"></i>';
                row += '</a>';
                row += '</span>';
                row += '<div class="mailbox-attachment-info">';
                row += '<div class="mailbox-attachment-name" href="#" title="' + strFileName + '" style="text-overflow: ellipsis; overflow: hidden;height: 20px; display: inline - block;white-space: nowrap;">';
                row += strFileName;
                row += '</div>';
                row += '</div>';
                row += '</li>';
                //Cập nhật danh sách file upload
            }
            $("#" + strZoneUp).append('<ul class="mailbox-attachments">' + row + '</ul>');
            outThongTinDinhKem(elementId);
        }

        function outThongTinDinhKem(elementId) {
            var row = "";
            var x = document.getElementsByClassName("btnDeleteFileUp" + elementId);
            for (var i = 0; i < x.length; i++) row += x[i].title + ",";
            row = row.substring(0, row.length - 1);
            row = row.replace(/\\/g, '\\\\');//Khac ban chinh
            $("#" + elementId).val(row);
            if (jQuery.type(callback) == 'function') {
                callback(elementId, row, loadFileSuccess);
            }
        }

        function getDSFile(elementId) {
            var arrTemp = [];
            var x = document.getElementsByClassName("btnDeleteFileUp" + elementId);
            for (var i = 0; i < x.length; i++) {
                var point = x[i];
                arrTemp.push([$(point).attr("title"), $(point).attr("filename")]);
            }
            return arrTemp;
        }

        function checkFileImport(extention) {
            extention = extention.toLowerCase();
            //Kiểm tra những file được phép đi xuống
            //Dưới file server cũng check lại như vậy
            var check = "";
            var strTypeOfFile = "";
            check += ".zip";//".csv.doc.docx.djvu.odp.ods.odt.pps.ppsx.ppt.pptx.pdf.ps.eps.rtf.txt.wks.wps.xls.xlsx.xps.svg";// định dạng text
            if (check.indexOf('.' + extention) != -1) strTypeOfFile = "text";
            //else {
            //    check = ".7z.zip.rar.jar.tar.tar.gz.cab";// định dạng file nén
            //    if (check.includes('.' + extention)) strTypeOfFile = "file";
            //    else {
            //        check = ".bmp.exr.gif.ico.jp2.jpeg.pbm.pcx.pgm.png.ppm.psd.tiff.tga.jpg";// định dạng ảnh
            //        if (check.includes('.' + extention)) strTypeOfFile = "picture";
            //        //else {
            //        //    check = ".3gp.avi.flv.m4v.mkv.mov.mp4.mpeg.ogv.wmv.webm";// định dạng video
            //        //    if (check.includes('.' + extention)) strTypeOfFile = "video";
            //        //    else {
            //        //        check = ".aac.ac3.aiff.amr.ape.au.flac.m4a.mka.mp3.mpc.ogg.ra.wav.wma";// định dạng audio
            //        //        if (check.includes('.' + extention)) strTypeOfFile = "audio";
            //        //        else {
            //        //            check = ".chm.epub.fb2.lit.lrf.mobi.pdb.rb.tcr";// định dạng sách
            //        //            if (check.includes('.' + extention)) strTypeOfFile = "book";
            //        //        }
            //        //    }
            //        //}
            //    }
            //}
            return strTypeOfFile;
        }
    },
};