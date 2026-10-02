/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KhongTinhMien() { };
KhongTinhMien.prototype = {
    dtKhongTinhMien: [],
    strKhongTinhMien_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_KhongTinhMien();
        me.getList_ThanhVien();
        me.getList_KhoanThu();
        
        $("#btnSearch").click(function (e) {
            me.getList_KhongTinhMien();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KhongTinhMien();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.toggle_edit();
        });
        $("#btnSave_KhongTinhMien").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiO", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_KhongTinhMien(arrChecked_Id[i]);
                }
            });
        });
        $("[id$=chkSelectAll_KhongTinhMien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhongTinhMien" });
        });
        $("#btnXoaKhongTinhMien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhongTinhMien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KhongTinhMien(arrChecked_Id[i]);
                }
            });
        });

        $("[id$=chkSelectAll_NguoiO]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNguoiO" });
        });
        $("#btnSearchNO").click(function (e) {
            me.getList_ThanhVien();
        });
        $("#txtSearchNO").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ThanhVien();
            }
        });
        edu.system.getList_MauImport("zonebtnDTKTM");
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
    getList_KhongTinhMien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_KhongTinh_Mien/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch') ,
            'dNam': edu.util.getValById('txtSearch_Nam') ? edu.util.getValById('txtSearch_Nam') : 0,
            'dThang': edu.util.getValById('txtSearch_Thang') ? edu.util.getValById('txtSearch_Thang') : 0,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropSearch_LoaiTinhPhi'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKhongTinhMien = dtReRult;
                    me.genTable_KhongTinhMien(dtReRult, data.Pager);
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
    save_KhongTinhMien: function (strKTX_DoiTuongOKTX_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KTX_KhongTinh_Mien/ThemMoi',
            'type': 'POST',
            'strKTX_DoiTuongOKTX_Id': strKTX_DoiTuongOKTX_Id,
            'dNam': edu.util.getValById('txtNam') ? edu.util.getValById('txtNam'): 0,
            'dThang': edu.util.getValById('txtThang') ? edu.util.getValById('txtThang') : 0,
            'dSoTien': edu.util.getValById('txtSoTien') ? edu.util.getValById('txtSoTien') : 0,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiTinhPhi'),
            'strLyDo': edu.util.getValById('txtLyDo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_list.strId) {
            obj_list.action = 'KTX_KhongTinh_Mien/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKhongTinhMien_Id = "";
                    
                    if (obj_list.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKhongTinhMien_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKhongTinhMien_Id = obj_list.strId;
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhongTinhMien();
                });
            },
            action: obj_list.action,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KhongTinhMien: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KTX_KhongTinh_Mien/Xoa',
            

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
                    //me.getList_KhongTinhMien();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KhongTinhMien();
                });
            },
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
    genTable_KhongTinhMien: function (data, iPager) {
        var me = this;
        $("#lblKhongTinhMien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhongTinhMien",

            bPaginate: {
                strFuntionName: "main_doc.KhongTinhMien.getList_KhongTinhMien()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,3, 4, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_DOITUONGOKYTUCXA_MASO"
                },
                {
                    "mData": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_HODEM) + " " + edu.util.returnEmpty(aData.KTX_DOITUONGOKYTUCXA_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_NAM"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_THANG"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "LYDO"
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
    viewEdit_KhongTinhMien: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        edu.util.viewValById("txtLyDo", data.NGAYKETTHUC);
        edu.util.viewValById("txtSoTien", data.NGAYKETTHUC);
        me.strKhongTinhMien_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_ThanhVien();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_DoiTuongOKyTucXa/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearchNO"),
            'strTinhTrangHopDong_Id': edu.util.getValById("dropSearch_KhoiTao_TinhTrangHopDong"),
            'dBiKyLuat': -1,
            'strNgayVao_TuNgay': edu.util.getValById("txtSearch_KhoiTao_NgayVao_TuNgay"),
            'strNgayVao_DenNgay': edu.util.getValById("txtSearch_NgayVao_DenNgay"),
            'strNgayRa_TuNgay': edu.util.getValById("txtSearch_NgayRa_TuNgay"),
            'strNgayRa_DenNgay': edu.util.getValById("txtSearch_NgayRa_DenNgay"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearchHoSo_ToaNha"),
            'strLopQuanLy_Id': '',
            'strKTX_Phong_Id': edu.util.getValById("dropSearchHoSo_Phong"),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_KhoiTao_LoaiDoiTuong"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_KhoaDT"),
            'dDoiTuongConDangOKTX': 1,
            'strGioiTinh_Id': edu.util.getValById("dropSearch_KhoiTao_GioiTinh"),
            'strTrinhDoDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_TDDT"),
            'strDienDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_DienDT"),
            'strNganhDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_NganhDT"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strNgayKiemTra': edu.util.getValById("txtNgayKiemTra"),
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult, data.Pager);
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
    genTable_ThanhVien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguoiO",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhongTinhMien.getList_ThanhVien()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        return strHoTen;
                    }
                }
                , {
                    //"mDataProp": "KTX_PHONG_TEN",
                    "mRender": function (nRow, aData) {
                        var strHoTen = edu.util.returnEmpty(aData.KTX_TOANHA_TEN) + " - " + edu.util.returnEmpty(aData.KTX_PHONG_TEN);
                        return strHoTen;
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

    getList_KhoanThu: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'strNhomCacKhoanThu_Id': "KTX",
            'strNguoiThucHien_Id': "",
            'strcanboquanly_id': "",
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    me.genCombo_KhoanThu(data.Data);
                }
                else {
                    edu.system.alert("TC_KhoanThu/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("TC_KhoanThu/LayDanhSach (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoanThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlace: ["dropLoaiTinhPhi"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },
}