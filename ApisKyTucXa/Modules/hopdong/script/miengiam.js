/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function MienGiam() { }
MienGiam.prototype = {
    arrValid_MienGiam: [],
    dtMienGiam: [],
    strMienGiam_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action Common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        /*------------------------------------------
        --Discription: [1] Action Phong
        --Order: 
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSave_MienGiam").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_MienGiam);
            if (valid) {
                if (edu.util.checkValue(me.strMienGiam_Id)) {
                    me.update_MienGiam();
                }
                else {
                    me.save_MienGiam();
                }
            }

        });
        $("#tblMienGiam").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.strPhong_Id = strId;
                //
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblMienGiam").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_Phong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    /*----------------------------------------------
    --Discription: [0] Common
    --API:  
    ----------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_list();
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        me.arrValid_MienGiam = [
            { "MA": "", "THONGTIN1": "EM" },
            { "MA": "", "THONGTIN1": "EM" },
            { "MA": "", "THONGTIN1": "EM" },
            { "MA": "", "THONGTIN1": "EM#IN" },
            { "MA": "", "THONGTIN1": "EM" },
            { "MA": "", "THONGTIN1": "EM" }
        ];
        //load
        me.getList_MienGiam();
    },
    rewrite: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewValById("txtChucNang_Ten", "");
        edu.util.viewValById("txtChucNang_Ma", "");
        edu.util.viewValById("txtChucNang_Icon", "");
        edu.util.viewValById("txtChucNang_ThuTuHienThi", "");
        edu.util.viewValById("txtChucNang_DuongDanThuMuc", "");
        edu.util.viewValById("dropChucNang_TrangThai", "");
        edu.util.viewValById("txtChucNang_DuongDanHienThi", "");
        //edu.util.viewValById("dropChucNang_Cha", "");
        //edu.util.viewValById("dropChucNang_UngDung", "");
        edu.util.viewValById("dropChucNang_PhamViTruyCap", "");
        edu.util.viewValById("txtChucNang_MoTa", "");
    },
    reset: function () {
        var me = this;
        me.strChucNang_Id = "";
        edu.util.viewHTMLById("lblChucNang_Ten", "");
        edu.util.viewHTMLById("lblChucNang_Ma", "");
        edu.util.viewHTMLById("lblChucNang_Icon", "");
        edu.util.viewHTMLById("lblChucNang_ThuTuHienThi", "");
        edu.util.viewHTMLById("lblChucNang_DuongDanHienThi", "");
        edu.util.viewHTMLById("lblChucNang_Cha", "");
        edu.util.viewHTMLById("lblChucNang_DuongDanThuMuc", "");
        edu.util.viewHTMLById("lblChucNang_UngDung", "");
        edu.util.viewHTMLById("lblChucNang_PhamViTruyCap", "");
        edu.util.viewHTMLById("lblChucNang_MoTa", "");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus-MienGiam", "zone_detail_MienGiam");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-MienGiam", "zone_input_MienGiam");
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-MienGiam", "zone_list_MienGiam");
    },
    /*----------------------------------------------
    --Discription: [2] AccessDB MienGiam
    --API:  
    ----------------------------------------------*/
    getList_MienGiam: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_HopDong_MienGiam/LayDanhSach',
            

            'strTuKhoa': "",
            'strDonViTinh_Id': "",
            'strTaiChinh_CacKhoanThu_Id': "",
            'strKTX_DoiTuongOKyTucXa_Id': '',
            'strKTX_HopDong_Id':"",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000

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
                    me.genTable_MienGiam(dtResult, iPager);
                }
                else {
                    edu.system.alert("KTX_HopDong_MienGiam/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_HopDong_MienGiam/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_MienGiam: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_HopDong_MienGiam/ThemMoi',
            

            'strId'                     : "",
            'strKTX_HopDong_Id'         : edu.util.getValById(""),
            'dPhanTramMienGiam'         : edu.util.getValById(""),
            'strNgayBatDauApDung'       : edu.util.getValById(""),
            'strNgayKetThucApDung'      : edu.util.getValById(""),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById(""),
            'strDonViTinh_Id'           : edu.util.getValById(""),
            'strKTX_DoiTuongOKyTucXa_Id': edu.util.getValById(""),
            'strNguoiThucHien_Id'       : edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_Phong();
                }
                else {
                    edu.system.alert("KTX_HopDong_MienGiam/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KTX_HopDong_MienGiam/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_MienGiam: function (strId, action) {
        var me = this;
        switch (action) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtChucNang, "ID", me.viewEdit_ChucNang);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtChucNang, "ID", me.viewForm_ChucNang);
                break;
        }

    },
    delete_MienGiam: function (strId) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_delete = {
            'action': 'KTX_HopDong_MienGiam/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#notify_cn").html("Xóa thành công!");
                    me.getList_Phong();
                }
                else {
                    $("#notify_cn").html("KTX_HopDong_MienGiam.Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                
                $("#notify_cn").html("KTX_HopDong_MienGiam.Xoa: " + JSON.stringify(er));
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
    --Discription: [2] GenHTML MienGiam
    --API:  
    ----------------------------------------------*/
    genTable_MienGiam: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("", iPager);

        var jsonForm = {
            strTable_Id: "tblMienGiam",
            aaData: data,
            arrClassName: ["tr-pointer"],
            bHiddenHeader: true,
            //bHiddenOrder: true,
            colPos: {
                left: [1]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_HODEM) + " - " + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_TEN) + "</span>";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
};