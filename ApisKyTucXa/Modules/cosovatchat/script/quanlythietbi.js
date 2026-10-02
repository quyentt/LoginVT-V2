/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function QuanLyThietBi() { };
QuanLyThietBi.prototype = {
    dtQLTB: [],
    dtPhong: [],
    strQLTB_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        $(".btnSearch_QLTB").click(function (){
            me.getList_QLTB();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        
        $("#btnSave_QLTB").click(function () {
            var arrValid = [                
                { "MA": "dropThietBi_Loai", "THONGTIN1": "EM" },
            ];

            var valid = edu.util.validInputForm(arrValid);
            if (valid) {
                var arrCheck = edu.extend.getCheckedCheckBoxByClassName("ckbDSPhong_ThietBi");
                for (var i = 0; i < arrCheck.length; i++) {
                    me.save_QLTB(arrCheck[i]);
                }

                setTimeout(function () {
                    me.getList_QLTB();
                }, arrCheck.length * 50);
            }
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#tbl_QLTB").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strQLTB_Id = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtQLTB, "ID");
            if (dt.length > 0) {
                me.viewEdit_QLTB(dt[0]);
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
        });
        $("[id$=chkSelectAll_QLTB]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tbl_QLTB" });
        });
        $("#btnDelete_QLTB").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tbl_QLTB", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
               $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QLTB(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_QLTB();
            }, arrChecked_Id.length*50);
        });   

        $("#main-content-wrapper").delegate(".ckbDSPhong_ThietBi_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSPhong_ThietBi").each(function () {
                this.checked = checked_status;
            });
        });

        /*------------------------------------------
        --Action: Chuyển phòng
        -------------------------------------------*/
        $("#btnChuyenPhong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tbl_QLTB", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            me.popupChuyenPhong();
        });
        $("#btnSave_ChuyenPhong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tbl_QLTB", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần chuyển?");
                return;
            }
            var strPhongChuyenDen = edu.util.getValById("dropHS_PhongChuyenDen");
            if (!edu.util.checkValue(strPhongChuyenDen)) {
                obj = {
                    title: "",
                    content: '<i class="cl-warning">Vui lòng chọn phòng cần chuyển?!</i>',
                    code: ""
                };
                edu.system.alertOnModal(obj);
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_ChuyenPhong(arrChecked_Id[i]);
            }
            setTimeout(function () {
                me.getList_QLTB();
            }, arrChecked_Id.length * 100);
        });

        $("#dropSearch_ToaNha").on("select2:select", function () {
            me.getList_Phong();
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_QLTB();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.LTB0, "dropThietBi_Loai");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.KTX.TTTB, "dropThietBi_TinhTrang");
        me.getList_ToaNha();
        me.getList_Phong();
    },
   
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
        me.genCheck_Phong();
    },
    rewrite: function () {
        var me = this;
        me.strQLTB_Id = "";
        edu.util.viewValById("txtThietBi_Ten", "");
        edu.util.viewValById("txtThietBi_Ma", "");
        edu.util.viewValById("dropThietBi_Phong", "");
        edu.util.viewValById("txtThietBi_SoLuong", "");
        edu.util.viewValById("dropThietBi_Loai", "");
        edu.util.viewValById("dropThietBi_TinhTrang", "");
        edu.util.viewValById("txtThietBi_MoTa", "");
        $("#DSPhong_ThietBi").html("");
    },
    popupChuyenPhong: function () {
        $("#btnNotifyModal").remove();
        $("#myModalChuyenPhong").modal("show");
    },
    /*------------------------------------------
    --Discription: Access DB QLTB
    --ULR: Modules
    -------------------------------------------*/
    getList_QLTB: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_TrangThietBi/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_Phong_Id': edu.util.getValById("dropSearch_Phong"),
            'strLoaiTrangThietBi_Id': "",
            'strTinhTrangSuDung_Id': '',
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtQLTB = data.Data;
                    me.genList_QLTB(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_QLTB: function (data, iPager) {
        var me = this;
        $("#lbl_QLTB_Tong").html(edu.util.returnZero(iPager));
        var jsonForm = {
            strTable_Id: "tbl_QLTB",
            aaData: data,

            bPaginate: {
                strFuntionName: "main_doc.QuanLyThietBi.getList_QLTB()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 1,2,3, 4, 5, 6, 7, 8] 
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_PHONG_MA"
                },

                {
                    "mDataProp": "MA"
                }
                , {
                    "mDataProp": "TEN"
                }
                , {
                    "mDataProp": "SOLUONG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strTinhTrang = aData.TINHTRANGSUDUNG_MA;
                        var html = '';
                        if (strTinhTrang == "KTX.TTTB.01") {
                            html = '<span class="label label-success">' + aData.TINHTRANGSUDUNG_TEN + '</span>';
                        }
                        else {
                            html = '<span class="label label-danger">' + edu.util.returnEmpty(aData.TINHTRANGSUDUNG_TEN) + '</span>';
                        }
                        return html;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblLichSu' + aData.ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            me.getList_ChuyenTrangThietBi(data[i].ID);
        }
        /*III. Callback*/
    },
    viewEdit_QLTB: function (data) {
        var me = this;       
        //call popup --Edit
        me.rewrite();
        me.toggle_edit();
        //view data --Edit 

        me.strQLTB_Id = data.ID;
        edu.util.viewValById("txtThietBi_Ten", data.TEN);
        edu.util.viewValById("txtThietBi_Ma", data.MA);
        edu.util.viewValById("dropThietBi_Phong", data.KTX_PHONG_ID);
        edu.util.viewValById("txtThietBi_SoLuong", data.SOLUONG);
        edu.util.viewValById("dropThietBi_Loai", data.LOAITRANGTHIETBI_ID);
        edu.util.viewValById("dropThietBi_TinhTrang", data.TINHTRANGSUDUNG_ID);
        edu.util.viewValById("txtThietBi_MoTa", data.MOTA);
        var point = $("#DSPhong_ThietBi #" + data.KTX_PHONG_ID);
        point.attr('checked', true);
        point.prop('checked', true);
    },
    save_QLTB: function (strPhong_Id) {
        var me = this;
        var obj_save = {
            'action': 'KTX_TrangThietBi/ThemMoi',
            

            'strId': "",
            'strTen': edu.util.getValById("txtThietBi_Ten"),
            'strMa': edu.util.getValById("txtThietBi_Ma"),
            'strKTX_Phong_Id': strPhong_Id,
            'strLoaiTrangThietBi_Id': edu.util.getValById("dropThietBi_Loai"),
            'strTinhTrangSuDung_Id': edu.util.getValById("dropThietBi_TinhTrang"),
            'strMoTa': edu.util.getValById("txtThietBi_MoTa"),
            'dSoLuong': edu.util.getValById("txtThietBi_SoLuong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strQLTB_Id != "") {
            obj_save.action = 'KTX_TrangThietBi/CapNhat';
            obj_save.strId = me.strQLTB_Id;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strQLTB_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QLTB: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_TrangThietBi/Xoa',
            

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(obj_delete + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] AccessDB ToaNha/Phong
    --API:  
    ----------------------------------------------*/
    save_ChuyenPhong: function (strKTX_TrangThietBi_Id) {
        var me = main_doc.KhoiTao;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'KTX_TrangThietBi/ChuyenTrangThietBi',

            'strKTX_Phong_Id': edu.util.getValById("dropHS_PhongChuyenDen"),
            'strKTX_TrangThietBi_Id': strKTX_TrangThietBi_Id,
            'strMoTa': edu.util.getValById("strHoSo_MoTa"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success && data.Message == "") {
                    obj = {
                        title: "",
                        content: '<i class="cl-active">Chuyển phòng thành công!</i>',
                        code: "",
                    };
                    edu.system.alertOnModal(obj);
                }
                else {
                    obj = {
                        type: "w",
                        content: '<i class="cl-danger">' + data.Message + '</i>',
                    };
                    edu.system.alertOnModal(obj);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er.Message,
                }
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
    getList_ChuyenTrangThietBi: function (strKTX_TrangThietBi_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_TrangThietBi/LayDSChuyenTrangThietBi',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKTX_Phong_Id': edu.util.getValById('dropAAAA'),
            'strKTX_TrangThietBi_Id': strKTX_TrangThietBi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    var strPhong = "";
                    for (var i = 0; i < json.length; i++) {
                        strPhong += ", " + json[i].KTX_PHONG_TEN;
                    }
                    if (strPhong != "") strPhong = strPhong.substring(2);
                    $("#lblLichSu" + strKTX_TrangThietBi_Id).html(strPhong);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] AccessDB ToaNha/Phong
    --API:  
    ----------------------------------------------*/
    getList_ToaNha: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_ToaNha/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': "",
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.dtToaNha = dtResult;
                    me.genCombo_ToaNha(dtResult);
                }
                else {
                    edu.system.alert("KTX_ToaNha/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_ToaNha/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_Phong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',
            

            'strTuKhoa': "",
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_ToaNha"),
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000

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
                    me.dtPhong = dtResult;
                    me.genCheck_Phong(dtResult);
                    me.genCombo_Phong(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_Phong/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_Phong/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genCombo_ToaNha: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: ["dropSearch_ToaNha"],
            title: "Chọn tòa nhà"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_Phong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                mRender: function (row, aData) {
                    return aData.KTX_TOANHA_TEN + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropSearch_Phong", "dropHS_PhongChuyenDen"],
            title: "Chọn phòng"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCheck_Phong: function () {
        var me = this;
        var data = me.dtPhong;
        var row = '';
        row += '<div class="col-lg-2">';
        row += '<input type="checkbox" style="float: left; margin-right: 5px" class="ckbDSPhong_ThietBi_ALL"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-2">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSPhong_ThietBi" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].KTX_TOANHA_TEN + "-" + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSPhong_ThietBi").html(row);
        //me.getList_KhoanThu();
    },
}