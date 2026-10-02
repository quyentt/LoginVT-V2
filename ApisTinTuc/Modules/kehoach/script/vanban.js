/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function BanTin() { };
BanTin.prototype = {
    dtBanTin: [],
    strBanTin_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_BanTin();
        edu.system.loadToCombo_DanhMucDuLieu("TINTUC.VANBAN.LOAI", "dropSearch_Loai");

        $("#btnSearch").click(function (e) {
            me.getList_BanTin();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_BanTin();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_BanTin").click(function (e) {
            me.save_BanTin();
        });
        $("[id$=chkSelectAll_BanTin]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblBanTin" });
        });
        $("#btnXoaBanTin").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBanTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tin cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_BanTin(arrChecked_Id[i]);
                }
            });            
            

        });
        $("#tblBanTin").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strBanTin_Id = strId;
            edu.util.setOne_BgRow(strId, "tblBanTin");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtBanTin, "ID")[0];
                me.viewEdit_BanTin(data);
                edu.system.viewFiles("txtFileDinhKem", strId, "TT_Files");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        edu.system.uploadFiles(["txtFileDinhKem"]);
         
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strBanTin_Id = "";
        edu.util.viewValById("txtTenVanBan", "");
        edu.util.viewValById("txtSoKyHieu", "");
        edu.util.viewValById("txtThuTu", "");
        edu.util.viewValById("txtNgayBanHanh", "");
        edu.system.viewFiles("txtFileDinhKem", "");
        edu.system.viewFiles("dropHieuLuc", "1");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_BanTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TT_VanBan/LayDSTinTuc_VanBan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiVanBan_Id': edu.util.getValById('dropSearch_Loai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtBanTin = dtReRult;
                    me.genTable_BanTin(dtReRult, data.Pager);
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
    save_BanTin: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TT_VanBan/Them_TinTuc_VanBan',
            'type': 'POST',
            'strId': me.strBanTin_Id,
            'strLoaiVanVan_Id': edu.util.getValById('dropAAAA'),
            'strTenVanBan': edu.util.getValById('txtTenVanBan'),
            'strSoHieu': edu.util.getValById('txtSoKyHieu'),
            'strNgayBanHanh': edu.util.getValById('txtNgayBanHanh'),
            'iThuTu': edu.util.getValById('txtThuTu'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TT_VanBan/Sua_TinTuc_VanBan';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBanTin_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strBanTin_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strBanTin_Id = obj_save.strId
                    }
                    edu.system.saveFiles("txtFileDinhKem", strBanTin_Id, "TT_Files");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_BanTin();
            },
            error: function (er) {
                edu.system.alert(obj_save.strId + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_BanTin: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TT_VanBan/Xoa_TinTuc_VanBan',
            

            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_BanTin();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_BanTin: function (data, iPager) {
        var me = this;
        $("#lblBanTin_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblBanTin",
            
            aaData: data,
            colPos: {
                center: [0,4, 5, 6, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "TENVANBAN",
                },
                {
                    "mDataProp": "SOHIEU"
                },
                {
                    "mDataProp": "NGAYBANHANH"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="txtFileDinhKem' + aData.ID +'"></span>';
                    }
                },
                {
                    //"mDataProp": "HIEULUC",
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC == 0 ? "Hết hiệu lực": "";
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
        data.forEach(e => {
            edu.system.viewFiles("txtFileDinhKem" + e.ID, e.ID, "TT_Files");
        })
    },
    viewEdit_BanTin: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtTenVanBan", data.TENVANBAN);
        edu.util.viewValById("txtSoKyHieu", data.SOHIEU);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtNgayBanHanh", data.NGAYBANHANH);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        
    },
}