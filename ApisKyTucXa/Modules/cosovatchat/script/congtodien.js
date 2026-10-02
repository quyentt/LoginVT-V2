/*----------------------------------------------
--Updated by: 
--Date of created: 
----------------------------------------------*/
function CongToDien() { };
CongToDien.prototype = {
    dtCongToDien: [],
    strCongToDien_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $("#btnAddNew_CongToDien").click(function () {
            me.rewrite();
            me.resetPopup();
            me.popup();
        });
        $(".btnClose").click(function () {
            me.toggle_list_congtodien();
        });
        /*------------------------------------------
        --Discription: [1] Action CongToDien
        --Order: 
        -------------------------------------------*/

        $("#btnSave_CongToDien").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DapAn);

            if (edu.util.checkValue(me.strCongToDien_Id)) {
                me.update_CongToDien();
            }
            else {
                me.save_CongToDien();
            }
        });

        $("#btnAddNew").click(function () {
            me.rewrite();
            me.strCongToDien_Id = "";
            me.toggle_input_congtodien();
        });
        $("#btnSave_CongToDien").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DapAn);
            if (valid) {
                if (edu.util.checkValue(me.strCongToDien_Id)) {
                    me.update_CongToDien();
                }
                else {
                    me.save_CongToDien();
                }
            }
        });
        $("#zoneBox_CongToDien").delegate(".btnEdit", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strCongToDien_Id = strId;
                edu.util.objGetDataInData(strId, me.dtCongToDien, "ID", me.viewEdit_CongToDien);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneBox_CongToDien").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_CongToDien(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrvalid_DapAn = [
            { "ma": "txtcongtodien_ten", "thongtin1": "em" },
            { "ma": "txtcongtodien_ma", "thongtin1": "em" },
        ];
        //get date initial
        setTimeout(function () {
            me.getList_CongToDien();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.TS.HSX0, "dropCongToDien_HangSanXuat");
            }, 50);
        }, 50);
    },

    rewrite: function () {
        var me = this;
        me.strThietBi_Id = "";
        edu.util.viewValById("txtCongToDien_Ten", "");
        edu.util.viewValById("txtCongToDien_Ma", "");
        edu.util.viewValById("txtCongToDien_NamSanXuat", "");
        edu.util.viewValById("dropCongToDien_HangSanXuat", "");
        edu.util.viewValById("txtCongToDien_MoTa", "");
    },
    /*------------------------------------------
    --Discription: [1] Form input
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_CongToDien').modal('show');
    },
    resetPopup: function () {
        var me = this;
        me.strCongToDien_Id = "";
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html('Thêm công tơ điện');

    },
    editPopup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html('<i class="fa fa-edit"></i> Chỉnh sửa tòa nhà');

    },


    toggle_input_CongToDien: function () {
        console.log(11111);
        edu.util.toggle_overide("zone-bus", "zone_input_congtodien");
    },
    toggle_list_CongToDien: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_congtodien");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CongToDien
    -------------------------------------------*/
    getList_CongToDien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_CongToDien/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            'strHangSanXuat_Id': "",
            'pageIndex': 1, //edu.system.pageIndex_default,
            'pageSize': 100000, //edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtCongToDien = dtResult;
                    me.genBox_CongToDien(dtResult, iPager)
                    me.genCombo_CongToDien(dtResult);
                }
                else {
                    edu.system.alert("KTX_CongToDien/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToDien/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_CongToDien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_CongToDien/ThemMoi',
            

            'strId'                 : "",
            'strTen': edu.util.getValById("txtCongToDien_Ten"),
            'strMa': edu.util.getValById("txtCongToDien_Ma"),
            'strNamSanXuat': edu.util.getValById("txtCongToDien_NamSanXuat"),
            'strHangSanXuat_Id': edu.util.getValById("dropCongToDien_HangSanXuat"),
            'strMoTa': edu.util.getValById("txtCongToDien_MoTa"),
            'strNguoiThucHien_Id'   : edu.system.userId

        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_CongToDien();
                }
                else {
                    edu.system.alert("KTX_CongToDien/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToDien/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_CongToDien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_CongToDien/CapNhat',
            

            'strId': me.strCongToDien_Id,
            'strTen': edu.util.getValById("txtCongToDien_Ten"),
            'strMa': edu.util.getValById("txtCongToDien_Ma"),
            'strNamSanXuat': edu.util.getValById("txtCongToDien_NamSanXuat"),
            'strHangSanXuat_Id': edu.util.getValById("dropCongToDien_HangSanXuat"),
            'strMoTa': edu.util.getValById("txtCongToDien_MoTa"),
            'strNguoiThucHien_Id': edu.system.userId

        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Cập nhật thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_CongToDien();
                }
                else {
                    edu.system.alert("KTX_CongToDien/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToDien/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CongToDien: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_CongToDien/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa phòng thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CongToDien();
                }
                else {
                    $("#notify_cn").html("KTX_CongToDien.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_CongToDien.Xoa: " + JSON.stringify(er));
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
    --Discription: [3] gerHTML CongToDien
    -------------------------------------------*/

    genBox_CongToDien: function (data, iPager) {
        var me = this;
        var html = '';
        var strCongToDien_Id = "";
        var strCongToDien_Ma = "";
        var iCongToDien_NamSanXuat = "";
        var iCongToDien_HangSanXuat = "";
        var iCongToDien_MoTa = "";

        $("#zoneBox_CongToDien").html(html);
        //
        for (var i = 0; i < data.length; i++) {
            strCongToDien_Id = data[i].ID;
            strCongToDien_Ma = data[i].TEN;
            iCongToDien_NamSanXuat = data[i].NAMSANXUAT;
            iCongToDien_HangSanXuat = data[i].HANGSANXUAT;
            iCongToDien_MoTa = data[i].MOTA;

            html += '<div class="col-sm-2 col-xs-4 btnView" id="view_' + strCongToDien_Id + '">';
            html += '<div class="small-box">';
            html += '<div class="inner">';
            html += '<h4>' + strCongToDien_Ma + '</h4>';
            html += '<p>Sản xuất ' + iCongToDien_NamSanXuat + '</p>';
            html += '</div>';
            html += '<div class="icon">';
            html += '<i class="fa fa-simplybuilt cl-tan"></i>';
            html += '</div>';
            html += '<div class="small-box-footer">';
            html += '<a id="delete_' + strCongToDien_Id + '" class="btn btn-default poiter btnDelete pull-right"><i class="fa fa-trash"></i> Xóa</a>';
            html += '<a id="edit_' + strCongToDien_Id + '" class="btn btn-default poiter btnEdit "><i class="fa fa-pencil"></i> Chỉnh sửa</a>';
            html += '</div>';
            html += '</div>';
            html += '</div >';
        }
        //
        $("#zoneBox_CongToDien").html(html);
    },
    
    viewEdit_CongToDien: function (data) {
        var me = main_doc.CongToDien;
        //edu.util.viewValById("txtCongToDien_Ten", data[0].TEN); chưa trả về tên công tơ
        edu.util.viewValById("txtCongToDien_Ma", data[0].MA);
        edu.util.viewValById("txtCongToDien_NamSanXuat", data[0].NAMSANXUAT);
        edu.util.viewValById("dropCongToDien_HangSanXuat", data[0].HANGSANXUAT_ID);
        edu.util.viewValById("txtCongToDien_MoTa", data[0].MOTA);
        me.popup();
    },
    genTable_CongToDien: function (data, iPager, strCongToDien_Id) {
        var me = this;
        edu.util.viewHTMLById("", iPager);

        var jsonForm = {
            strTable_Id: "tblCongToDien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CongToDien.getList_CongToDien('" + strCongToDien_Id + "')",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            //bHiddenOrder: true,
            colPos: {
                left: [],
                right: [4, 5, 6, 7, 8],
                center: [0, 1, 2, 3],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                }
                , {
                    "mDataProp": "TEN"
                }
                , {
                    "mDataProp": "NAMSANXUAT"
                }
                , {
                    "mDataProp": "HANGSANXUAT"
                }
                , {
                    "mDataProp": "MOTA"
                }
                , {
                    "mData": "edit",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btn btn-default color-active btnEdit" id="edit_' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                    }
                }
                , {
                    "mData": "delete",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btn btn-default color-active btnDelete" id="delete_' + aData.ID + '" href="#"><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    genCombo_CongToDien: function (data) {
        //var jsonNS = $.parseJSON(localStorage.dataCongToDien_Combo);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropCongToDien_Ten"],
            type: "",
            title: "Chọn công tơ"
        };
        edu.system.loadToCombo_data(obj);
    }
};