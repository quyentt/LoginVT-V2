/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function FileBaoCao() { };
FileBaoCao.prototype = {
    dtFileBaoCao: [],
    strDuongDan: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //me.getList_FileBaoCao();
        $("#tblFileBaoCao").delegate(".btnDownLoad", "click", function () {
            location.href = this.title;
        });

        $("#btnSearch").click(function () {
            me.getList_FileBaoCao();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_FileBaoCao();
            }
        });
        $("#tblFileBaoCao").delegate(".btnUpLoad", "click", function () {
            var strDuongDan = this.title;
            var strTenHienThi = this.name;
            var row = "";
            row += '<div class="col-sm-12">';
            row += '<div class="col-sm-4">- Upload ' + strTenHienThi + ': </div><div class="col-sm-8"><div id="zoneImportChung"></div></div>';
            row += '</div><div class="clear"></div>';
            edu.system.alert(row);
            edu.system.uploadImport(["zoneImportChung"], function (a, strPath) {
                //--Edit
                var obj_list = {
                    'action': 'CMS_UpCode/UpFileBaoCao',
                    'strPath': strDuongDan.replace(/\\/g, "\\\\"),
                    'strPathReplace': strPath
                };
                //

                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            edu.system.alert("Thực hiện thành công");
                        }
                    },
                    error: function (er) {
                        edu.system.alert(JSON.stringify(er), "w");
                    },
                    type: 'GET',
                    action: obj_list.action,

                    contentType: true,

                    data: obj_list,
                    fakedb: [

                    ]
                }, false, false, false, null);
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("CMS.UDBC", "dropSearch_UngDung");
        $("#dropSearch_UngDung").on("select2:select", function () {
            me.getList_FileBaoCao();
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_FileBaoCao: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_HeSo_Ngach/ThemMoi',

            'strId': me.strFileBaoCao_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgach_Id': edu.util.getValById('dropNgach'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dHeSo': edu.util.getValById('txtHeSo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NS_HeSo_Ngach/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_FileBaoCao();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_FileBaoCao: function (strDanhSach_Id) {
        var me = this;
        var strUngDung = "";
        if (edu.util.getValById('dropSearch_UngDung') !== "") strUngDung = "/" + $("#dropSearch_UngDung option:selected").attr("name") + "/Upload";
        else {
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'SYS_Report/Report_GetAllFile',
            'strUngDung': strUngDung ,
            'strLoai': "*"
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_FileBaoCao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_FileBaoCao: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_HeSo_Ngach/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_FileBaoCao();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_FileBaoCao: function (data, iPager) {
        var me = this;
        $("#lblFileBaoCao_Tong").html(iPager);
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var strFileName = data[i].substring(data[i].lastIndexOf("\\") + 1);
            html += '<tr >';
            html += '<td style="text-align: center;">'+ (i+1) +'</td>';
            html += '<td>' + strFileName + '</td>';
            html += '<td style="text-align: center;"><a class="btnDownLoad" title="' + edu.system.strhost + "/" + data[i].replace(iPager, "") + '" ><i class="fa fa-cloud-download"></i></a></td>';
            html += '<td style="text-align: center;"><a class="btnUpLoad" name="' + strFileName +'" title="' + data[i] + '" ><i title="' + data[i] + '" class="fa fa-cloud-upload"></i></a></td>';
            html += '</tr>';
        }
        $("#tblFileBaoCao tbody").html(html);
        /*III. Callback*/
    },
    viewForm_FileBaoCao: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtFileBaoCao, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropNgach", data.NGACH_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtHeSo", data.HESO);
        me.strFileBaoCao_Id = data.ID;
    },

    import_Table: function (a, strPath) {
        var me = this;
        console.log( $("#" + a.split("_")[1]).attr("title"));
        console.log(strPath);
        var obj_list = {
            'action': 'CMS_UpCode/UpFileBaoCao',
            'strPath': $("#" + a.split("_")[1]).attr("title").replace(/\\/g, "\\\\"),
            'strPathReplace': strPath
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Update thành công");
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    }
}