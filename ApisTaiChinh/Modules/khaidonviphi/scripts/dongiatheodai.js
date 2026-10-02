/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DonGiaTheoDai() { };
DonGiaTheoDai.prototype = {
    dtDonGiaTheoDai: [],
    strDonGiaTheoDai_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_LoaiPhamVi();
        me.getList_LoaiKhoan();

        $("#btnSearch").click(function (e) {
            me.getList_DonGiaTheoDai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DonGiaTheoDai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_DonGiaTheoDai").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_DonGiaTheoDai();
            }
        });
        $("[id$=chkSelectAll_DonGiaTheoDai]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDonGiaTheoDai" });
        });
        $("#btnXoaDonGiaTheoDai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDonGiaTheoDai", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DonGiaTheoDai(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_DonGiaTheoDai();
                }, arrChecked_Id.length * 50);
            });
        });
        $("[id$=chkSelectAll_InputHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInputHocPhan" });
        });
        $("[id$=chkSelectAll_HocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });


        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });

        $(".btnSave_HocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            arrChecked_Id.forEach(e => {
                if ($("#tblInputHocPhan tr[id=" + e + "]").length == 0) {
                    $("#tblInputHocPhan tbody").append('<tr id="' + e + '" class="addHocPhan">' + $("#tblHocPhan tr[id=" + e + "]").html() + '</tr>');
                }
            });
        });

        $("#tblDonGiaTheoDai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblDonGiaTheoDai");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDonGiaTheoDai, "ID")[0];
                me.viewEdit_DonGiaTheoDai(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_HocPhan").click(function (e) {
            me.getList_DonGiaTheoDai();
        });
        
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDonGiaTheoDai_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("dropHieuLuc", 1);
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_DonGiaTheoDai();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DonGiaTheoDai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSPhamViDVP_SiSo_SoTien',
            'type': 'GET',
            'strKieuHoc_Id': edu.util.getValById('dropSearch_KieuHoc'),
            'strPhanCapApDung_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDonGiaTheoDai = dtReRult;
                    me.genTable_DonGiaTheoDai(dtReRult, data.Pager);
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
    save_DonGiaTheoDai: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi2/Them_DonViTinh_SiSo_SoTien',
            'type': 'POST',
            'strId': me.strDonGiaTheoDai_Id,
            'strTuKhoa': edu.util.getValById('txtTuKhoa'),
            'strKieuHoc_Id': edu.util.getValById('dropKieuHoc'),
            'strPhamViApDung_Id': edu.util.getValById('dropPhamVi'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'dSiSoBatDau': edu.util.getValById('txtSoLuongBatDau'),
            'dSiSoKetThuc': edu.util.getValById('txtSoLuongKetThuc'),
            'dTongSoTien': edu.util.getValById('txtMucPhi'),
            'dTongSoTienCanDuoi': edu.util.getValById('txtMucPhiCanDuoi'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TC_ThuChi2/Sua_DonViTinh_SiSo_SoTien2';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDonGiaTheoDai_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strDonGiaTheoDai_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDonGiaTheoDai_Id = obj_save.strId
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_DonGiaTheoDai();
            },
            error: function (er) {
                edu.system.alert("XLHV_DonGiaTheoDai/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DonGiaTheoDai: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach/Xoa',
            

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
                    me.getList_DonGiaTheoDai();
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

    save_Lop: function (strTN_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViLop',

            'strId':"",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DonGiaTheoDai();
            },
            error: function (er) {
                edu.system.alert("XLHV_DonGiaTheoDai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strTN_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViCT',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DonGiaTheoDai();
            },
            error: function (er) {
                edu.system.alert("XLHV_DonGiaTheoDai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strTN_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViKhoa',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DonGiaTheoDai();
            },
            error: function (er) {
                edu.system.alert("XLHV_DonGiaTheoDai/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DonGiaTheoDai: function (data, iPager) {
        var me = this;
        $("#lblDonGiaTheoDai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDonGiaTheoDai",

            bPaginate: {
                strFuntionName: "main_doc.DonGiaTheoDai.getList_DonGiaTheoDai()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default" id="DSPhanCong' + aData.ID + '" title="Chi tiết"></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
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
        for (var i = 0; i < data.length; i++) {
            me.getList_PhanCong(data[i].ID);
        }
    },
    viewEdit_DonGiaTheoDai: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        edu.util.viewValById("dropHieuLuc", data.MOCHONGUOIHOCDANGKY);
        me.strDonGiaTheoDai_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_ThanhVien();
        me.getList_HocPhan();
    },

    getList_LoaiPhamVi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_Chung/LayDSPhanCapApDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_LoaiPhamVi(dtReRult);
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
    genComBo_LoaiPhamVi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_PhanLoai", "dropPhanLoai"],
            type: "",
            title: "Chọn loại phạm vi",
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_ThoiGian: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSThoiGian',
            'type': 'GET',
            'strPhanCapApDung_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_ThoiGian(dtReRult);
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
    genComBo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KieuHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSKieuHocDVP_SiSo_SoTien',
            'type': 'GET',
            'strPhanCapApDung_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_KieuHoc(dtReRult);
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
    genComBo_KieuHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KieuHoc", "dropKieuHoc"],
            type: "",
            title: "Chọn kiểu học",
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_LoaiKhoan: function () {
        var me = this;

        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.genComBo_KhoanThu(dtResult);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_KhoanThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoanThu"],
            type: "",
            title: "Chọn khoản thu",
        };
        edu.system.loadToCombo_data(obj);
    },
}