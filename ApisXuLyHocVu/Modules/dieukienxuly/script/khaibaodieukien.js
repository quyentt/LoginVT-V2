/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KhaiBaoDieuKien() { };
KhaiBaoDieuKien.prototype = {
    dtKhaiBaoDieuKien: [],
    strKhaiBaoDieuKien_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KhaiBaoDieuKien();
        me.getList_TuKhoa();

        edu.system.loadToCombo_DanhMucDuLieu("XLHV.LOAIXULY", "dropSearch_LoaiXuLy,dropKhaiBaoDieuKien_LoaiXuLy");
        edu.system.loadToCombo_DanhMucDuLieu("XLHV.MUCXULY", "dropKhaiBaoDieuKien_MucXuLy");

        $("#btnSearch").click(function (e) {
            me.getList_KhaiBaoDieuKien();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KhaiBaoDieuKien();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KhaiBaoDieuKien").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KhaiBaoDieuKien();
            }
        });
        $("[id$=chkSelectAll_KhaiBaoDieuKien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhaiBaoDieuKien" });
        });
        $("#btnXoaKhaiBaoDieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhaiBaoDieuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhaiBaoDieuKien(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_KhaiBaoDieuKien();
                }, arrChecked_Id.length * 50);
            });
        });
        $("#tblKhaiBaoDieuKien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKhaiBaoDieuKien");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKhaiBaoDieuKien, "ID")[0];
                me.viewEdit_KhaiBaoDieuKien(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKhaiBaoDieuKien_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKhaiBaoDieuKien_Id = "";

        edu.util.viewValById("dropKhaiBaoDieuKien_LoaiXuLy", "");
        edu.util.viewValById("dropKhaiBaoDieuKien_MucXuLy", "");
        edu.util.viewValById("txtKhaiBaoDieuKien_ThuTu", "");
        edu.util.viewValById("txtKhaiBaoDieuKien_MoTa", "");
        edu.util.viewValById("txtKhaiBaoDieuKien_XauDieuKien", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KhaiBaoDieuKien();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KhaiBaoDieuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_DieuKienXuLy/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXuLy_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            'strMucXuLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhaiBaoDieuKien = dtReRult;
                    me.genTable_KhaiBaoDieuKien(dtReRult, data.Pager);
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
    save_KhaiBaoDieuKien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_DieuKienXuLy/ThemMoi',
            
            'strId': me.strKhaiBaoDieuKien_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtKhaiBaoDieuKien_XauDieuKien'),
            'strMucXuLy_Id': edu.util.getValById('dropKhaiBaoDieuKien_MucXuLy'),
            'strLoaiXuLy_Id': edu.util.getValById('dropKhaiBaoDieuKien_LoaiXuLy'),
            'strMoTa': edu.util.getValById('txtKhaiBaoDieuKien_MoTa'),
            'iThuTu': edu.util.getValById('txtKhaiBaoDieuKien_ThuTu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'XLHV_DieuKienXuLy/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKhaiBaoDieuKien_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKhaiBaoDieuKien_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKhaiBaoDieuKien_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        console.log($(this).attr("name"));
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strKhaiBaoDieuKien_Id);
                        }
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_KhaiBaoDieuKien();
            },
            error: function (er) {
                edu.system.alert("XLHV_DieuKienXuLy/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KhaiBaoDieuKien: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'XLHV_DieuKienXuLy/Xoa',
            

            'strIds': strId,
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
                    me.getList_KhaiBaoDieuKien();
                }
                else {
                    obj = {
                        content: "XLHV_DieuKienXuLy/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "XLHV_DieuKienXuLy/Xoa (er): " + JSON.stringify(er),
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
    genTable_KhaiBaoDieuKien: function (data, iPager) {
        var me = this;
        $("#lblKhaiBaoDieuKien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhaiBaoDieuKien",

            bPaginate: {
                strFuntionName: "main_doc.KhaiBaoDieuKien.getList_KhaiBaoDieuKien()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "MUCXULY_TEN"
                },
                {
                    "mDataProp": "MOTA",
                },
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_KhaiBaoDieuKien: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropKhaiBaoDieuKien_LoaiXuLy", data.LOAIXULY_ID);
        edu.util.viewValById("dropKhaiBaoDieuKien_MucXuLy", data.MUCXULY_ID);
        edu.util.viewValById("txtKhaiBaoDieuKien_ThuTu", data.THUTU);
        edu.util.viewValById("txtKhaiBaoDieuKien_MoTa", data.MOTA);
        edu.util.viewValById("txtKhaiBaoDieuKien_XauDieuKien", data.XAUDIEUKIEN);
        me.strKhaiBaoDieuKien_Id = data.ID;
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_TuKhoa: function () {
        var me = main_doc.KhaiBaoDieuKien;

        //--Edit
        var obj_list = {
            'action': 'XLHV_ThongTinChung/LayDSTuKhoa',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_TuKhoa(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TuKhoa: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTuKhoa",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "MOTA",
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
}