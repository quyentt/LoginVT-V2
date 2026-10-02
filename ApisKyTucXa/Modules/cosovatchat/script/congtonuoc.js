/*----------------------------------------------
--Updated by: 
--Date of created: 
----------------------------------------------*/
function CongToNuoc() { };
CongToNuoc.prototype = {
    dtCongToNuoc: [],
    strCongToNuoc_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $("#btnAddNew_CongToNuoc").click(function () {
            me.rewrite();
            me.resetPopup();
            me.popup();
        });
        $(".btnClose").click(function () {
            me.toggle_list_congtonuoc();
        });
        /*------------------------------------------
        --Discription: [1] Action CongToNuoc
        --Order: 
        -------------------------------------------*/

        $("#btnSave_CongToNuoc").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_dapan);

            if (edu.util.checkValue(me.strCongToNuoc_Id)) {
                me.update_CongToNuoc();
            }
            else {
                me.save_CongToNuoc();
            }
        });

        $("#btnAddNew").click(function () {
            me.rewrite();
            me.strCongToNuoc_Id = "";
            me.toggle_input_congtonuoc();
        });
        $("#btnSave_CongToNuoc").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_dapan);
            if (valid) {
                if (edu.util.checkValue(me.strCongToNuoc_Id)) {
                    me.update_CongToNuoc();
                }
                else {
                    me.save_CongToNuoc();
                }
            }
        });
        $("#zoneBox_CongToNuoc").delegate(".btnEdit", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strCongToNuoc_Id = strId;
                edu.util.objGetDataInData(strId, me.dtCongToNuoc, "ID", me.viewEdit_CongToNuoc);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#zoneBox_CongToNuoc").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_CongToNuoc(strId);
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
        me.arrvalid_dapan = [
            { "ma": "txtcongtonuoc_ten", "Thongtin1": "Em" },
            { "ma": "txtcongtonuoc_ma", "Thongtin1": "Em" },
        ];
        //get date initial
        setTimeout(function () {
            me.getList_CongToNuoc();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.TS.HSX0, "dropCongToNuoc_HangSanXuat");
            }, 50);
        }, 50);
    },

    rewrite: function () {
        var me = this;
        me.strThietBi_Id = "";
        edu.util.viewValById("txtCongToNuoc_Ten", "");
        edu.util.viewValById("txtCongToNuoc_Ma", "");
        edu.util.viewValById("txtCongToNuoc_NamSanXuat", "");
        edu.util.viewValById("dropCongToNuoc_HangSanXuat", "");
        edu.util.viewValById("txtCongToNuoc_MoTa", "");
    },
    /*------------------------------------------
    --Discription: [1] Form input
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_CongToNuoc').modal('show');
    },
    resetPopup: function () {
        var me = this;
        me.strCongToNuoc_Id = "";
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html('<i class="fa fa-plus cl-active"></i> Thêm công tơ nước');

    },
    editPopup: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalLabel").html('<i class="fa fa-edit"></i> Chỉnh sửa công tơ');

    },


    toggle_input_CongToNuoc: function () {
        console.log(11111);
        edu.util.toggle_overide("zone-bus", "zone_input_congtonuoc");
    },
    toggle_list_CongToNuoc: function () {
        edu.util.toggle_overide("zone-bus", "zone_list_congtonuoc");
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CongToNuoc
    -------------------------------------------*/
    getList_CongToNuoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_CongToNuoc/LayDanhSach',
            

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
                    me.dtCongToNuoc = dtResult;
                    me.genBox_CongToNuoc(dtResult, iPager)
                    me.genCombo_CongToNuoc(dtResult);
                }
                else {
                    edu.system.alert("KTX_CongToNuoc/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToNuoc/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_CongToNuoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_CongToNuoc/ThemMoi',
            

            'strId': "",
            'strTen': edu.util.getValById("txtCongToNuoc_Ten"),
            'strMa': edu.util.getValById("txtCongToNuoc_Ma"),
            'strNamSanXuat': edu.util.getValById("txtCongToNuoc_NamSanXuat"),
            'strHangSanXuat_Id': edu.util.getValById("dropCongToNuoc_HangSanXuat"),
            'strMoTa': edu.util.getValById("txtCongToNuoc_MoTa"),
            'strNguoiThucHien_Id': edu.system.userId

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
                    me.getList_CongToNuoc();
                }
                else {
                    edu.system.alert("KTX_CongToNuoc/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToNuoc/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_CongToNuoc: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_CongToNuoc/CapNhat',
            

            'strId': me.strCongToNuoc_Id,
            'strTen': edu.util.getValById("txtCongToNuoc_Ten"),
            'strMa': edu.util.getValById("txtCongToNuoc_Ma"),
            'strNamSanXuat': edu.util.getValById("txtCongToNuoc_NamSanXuat"),
            'strHangSanXuat_Id': edu.util.getValById("dropCongToNuoc_HangSanXuat"),
            'strMoTa': edu.util.getValById("txtCongToNuoc_MoTa"),
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
                    me.getList_CongToNuoc();
                }
                else {
                    edu.system.alert("KTX_CongToNuoc/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_CongToNuoc/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CongToNuoc: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_CongToNuoc/Xoa',
            

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
                    me.getList_CongToNuoc();
                }
                else {
                    $("#notify_cn").html("KTX_CongToNuoc.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_CongToNuoc.Xoa: " + JSON.stringify(er));
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
    --Discription: [3] gerHTML CongToNuoc
    -------------------------------------------*/

    genBox_CongToNuoc: function (data, iPager) {
        var me = this;
        var html = '';
        var strCongToNuoc_Id = "";
        var strCongToNuoc_Ma = "";
        var iCongToNuoc_NamSanXuat = "";
        var iCongToNuoc_HangSanXuat = "";
        var iCongToNuoc_MoTa = "";

        $("#zoneBox_CongToNuoc").html(html);
        //
        for (var i = 0; i < data.length; i++) {
            strCongToNuoc_Id = data[i].ID;
            strCongToNuoc_Ma = data[i].MA;
            iCongToNuoc_NamSanXuat = data[i].NAMSANXUAT;
            iCongToNuoc_HangSanXuat = data[i].HANGSANXUAT;
            iCongToNuoc_MoTa = data[i].MOTA;

            html += '<div class="col-sm-2 col-xs-4 btnView" id="view_' + strCongToNuoc_Id + '">';
            html += '<div class="small-box">';
            html += '<div class="inner">';
            html += '<h4>' + strCongToNuoc_Ma + '</h4>';
            html += '<p>Sản xuất ' + iCongToNuoc_NamSanXuat + '</p>';
            html += '</div>';
            html += '<div class="icon">';
            html += '<i class="fa fa-safari cl-powderblue"></i>';
            html += '</div>';
            html += '<div class="small-box-footer">';
            html += '<a id="delete_' + strCongToNuoc_Id + '" class="btn btn-default poiter btnDelete pull-right"><i class="fa fa-trash"></i> Xóa</a>';
            html += '<a id="edit_' + strCongToNuoc_Id + '" class="btn btn-default poiter btnEdit "><i class="fa fa-pencil"></i> Chỉnh sửa</a>';
            html += '</div>';
            html += '</div>';
            html += '</div >';
        }
        //
        $("#zoneBox_CongToNuoc").html(html);
    },

    viewEdit_CongToNuoc: function (data) {
        var me = main_doc.CongToNuoc;
        //edu.util.viewValById("txtCongToNuoc_Ten", data[0].TEN); chưa trả về tên công tơ
        edu.util.viewValById("txtCongToNuoc_Ma", data[0].MA);
        edu.util.viewValById("txtCongToNuoc_NamSanXuat", data[0].NAMSANXUAT);
        edu.util.viewValById("dropCongToNuoc_HangSanXuat", data[0].HANGSANXUAT_ID);
        edu.util.viewValById("txtCongToNuoc_MoTa", data[0].MOTA);
        me.popup();
    },
    genTable_CongToNuoc: function (data, iPager, strCongToNuoc_Id) {
        var me = this;
        edu.util.viewHTMLById("", iPager);

        var jsonForm = {
            strTable_Id: "tblCongToNuoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CongToNuoc.getList_CongToNuoc('" + strCongToNuoc_Id + "')",
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
    genCombo_CongToNuoc: function (data) {
        //var jsonNS = $.parseJSON(localStorage.dataCongToNuoc_Combo);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropCongToNuoc_Ten"],
            type: "",
            title: "Chọn công tơ"
        };
        edu.system.loadToCombo_data(obj);
    }
};