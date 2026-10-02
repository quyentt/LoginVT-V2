/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: DangKyHoc/DKH_KeHoachDangKy
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KeHoachDangKy() { };
KeHoachDangKy.prototype = {
    strKeHoachDangKy_Id: '',
    dtKeHoachDangKy: '',
    dtSinhVien: [],
    dtPhong: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_KeHoachDangKy();
        me.getList_ToaNha();

        edu.system.loadToCombo_DanhMucDuLieu("KTX_PHANLOAIDOITUONG", "dropSearch_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.KHOADAOTAO", "dropSearch_KhoaDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("KTX.LOAIKEHOACH", "dropLoaiKeHoach");
        /*------------------------------------------
        --Discription: 
        -------------------------------------------*/
        $("#btnAddnew").click(function () {
            me.rewrite();
            me.toggle_detail("zoneEdit");
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-content", "zonebatdau");
        });
        $("#btnSave").click(function () {
            me.save_KeHoachDangKy();
        });
        $(".btnSearch_KHDK").click(function () {
            me.getList_KeHoachDangKy();
        });
        $("#btnSearch_KHDK").click(function () {
            me.getList_KeHoachDangKy();
        });
        $("#btnDelete_KeHoachDangKy").click(function () {
            var strId = me.strKeHoachDangKy_Id;
            strId = edu.util.cutPrefixId(/delete_ctd/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachDangKy(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKHDK").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            edu.util.toggle_overide("zonebatdau", "zoneEdit");
            edu.util.setOne_BgRow(strId, "tblKHDK");
            me.strKeHoachDangKy_Id = strId;
            if (edu.util.checkValue(strId)) {
                me.viewForm_KeHoachDangKy(me.dtKeHoachDangKy.find(e => e.ID === strId));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_LoaiDoiTuong").on("select2:select", function () {
            me.getList_SinhVien();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_SinhVien();
        });
        $("#dropSearch_ToaNha").on("select2:select", function () {
            me.getList_Phong();
        });

        $("#tblKHDK").delegate('.btnDetailPhong', 'click', function (e) {
            me.strKeHoachDangKy_Id = this.id;
            $(".lblTenDanhSach").html(me.dtKeHoachDangKy.find(e => e.ID === me.strKeHoachDangKy_Id).TENKEHOACH);
            edu.util.toggle_overide("zone-content", "zonePhong");
            me.getList_Phong();
            me.getList_PhongDaThem();
            edu.util.viewValById("txtNgayVaoPhong", "");
            edu.util.viewValById("txtNgayRaPhong", "");
        });
        $("#tblKHDK").delegate('.btnDetailSinhVien', 'click', function (e) {
            me.strKeHoachDangKy_Id = this.id;
            $(".lblTenDanhSach").html(me.dtKeHoachDangKy.find(e => e.ID === me.strKeHoachDangKy_Id).TENKEHOACH);
            edu.util.toggle_overide("zone-content", "zoneSinhVien");
            me.getList_SinhVien();
            me.getList_SinhVienDaThem();
        });
        
        $("[id$=chkSelectAll_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_SinhVien" });
        });
        $("[id$=chkSelectAll_SinhVien_View]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });
        $("#btnSave_SinhVien").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_SinhVien(arrChecked_Id[i]);
                }
            });
        });
        $("#btnXoaSinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });

        $("[id$=chkSelectAll_Phong]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_Phong" });
        });
        $("[id$=chkSelectAll_Phong_View]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhong" });
        });
        $("#btnSave_Phong").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_Phong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_Phong(arrChecked_Id[i]);
                }
            });
        });
        $("#btnXoaPhong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Phong(arrChecked_Id[i]);
                }
            });
        });
    },
    toggle_detail: function (strZone) {
        edu.util.toggle_overide("zone-content", strZone);
    },
    rewrite: function () {
        var me = this;
        me.strKeHoachDangKy_Id = "";
        edu.util.viewValById("txtTenKeHoach", "");
        edu.util.viewValById("dropLoaiKeHoach", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("txtSoNgayGiuCho", "");
        edu.util.viewValById("txtNgayVao", "");
        edu.util.viewValById("txtNgayRa", "");
    },
    
    save_KeHoachDangKy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KTX_KeHoachDangKy/ThemMoi',
            'type': 'POST',
            'strId': me.strKeHoachDangKy_Id,
            'strTenKeHoach': edu.util.getValById('txtTenKeHoach'),
            'strTuNgay': edu.util.getValById('txtNgayBatDau'),
            'strDenNgay': edu.util.getValById('txtNgayKetThuc'),
            'strLoaiKeHoach_Id': edu.util.getValById('dropLoaiKeHoach'),
            'dSoNgayHieuLucGiuCho': edu.util.getValById('txtSoNgayGiuCho'),
            'strNgayVao': edu.util.getValById('txtNgayVao'),
            'strNgayRa': edu.util.getValById('txtNgayRa'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (me.strKeHoachDangKy_Id != "") {
            obj_save.action = 'KTX_KeHoachDangKy/CapNhat';
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
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_KeHoachDangKy();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    getList_KeHoachDangKy: function () {
        var me = this;

        //--Edit

        var obj_list = {
            'action': 'KTX_KeHoachDangKy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strLoaiKeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.dtKeHoachDangKy = dtResult;
                    me.genTable_KeHoachDangKy(dtResult, iPager);
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
    delete_KeHoachDangKy: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KTX_KeHoachDangKy/Xoa',
            
            'strIds': Ids,
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
                me.getList_KeHoachDangKy();
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
    /*----------------------------------------------
    --Date of created: 2
    --Discription: genCombo NamHoc
    ----------------------------------------------*/
    genTable_KeHoachDangKy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKHDK",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachDangKy.getList_KeHoachDangKy()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 2, 3, 4, 5, 10],
            },
            aoColumns: [
            {
                "mDataProp": "TENKEHOACH"
            },
            {
                "mDataProp": "TUNGAY"
            },
            {
                "mDataProp": "DENNGAY"
            },
            {
                "mDataProp": "NGAYVAO"
            },
            {
                "mDataProp": "NGAYRA"
            },
            {
                "mDataProp": "LOAIKEHOACH_TEN"
            },
            {
                "mDataProp": "HIEULUC"
            },
            {
                "mData": "SOLUONGDADANGKY",
                "mRender": function (nRow, aData) {
                    return aData.SOPHONGPHANCONG + '<span><a class="btn btn-default btnDetailPhong" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye"></i></a></span>';
                }
            },
            {
                "mData": "SOLUONGDADANGKY",
                "mRender": function (nRow, aData) {
                    return aData.SODOITUONG + '<span><a class="btn btn-default btnDetailSinhVien" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye"></i></a></span>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-edit"></i></a></span>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
        /*III. Callback*/
    },
    viewForm_KeHoachDangKy: function (data) {
        var me = this;
        edu.util.viewValById("txtTenKeHoach", data.TENKEHOACH);
        edu.util.viewValById("dropLoaiKeHoach", data.LOAIKEHOACH_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtNgayBatDau", data.TUNGAY);
        edu.util.viewValById("txtNgayKetThuc", data.DENNGAY);
        edu.util.viewValById("txtSoNgayGiuCho", data.SONGAYHIEULUCGIUCHO);
        edu.util.viewValById("txtNgayVao", data.NGAYVAO);
        edu.util.viewValById("txtNgayRa", data.NGAYRA);
    },
    
    getList_SinhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'KTX_DoiTuongOKyTucXa/LayDanhSach',

            'strTuKhoa': edu.util.getValById("txtSearch_KhoiTao_TuKhoa"),
            'strTinhTrangHopDong_Id': edu.util.getValById("dropSearch_KhoiTao_TinhTrangHopDong"),
            'dBiKyLuat': -1,
            'strNgayVao_TuNgay': edu.util.getValById("txtSearch_KhoiTao_NgayVao_TuNgay"),
            'strNgayVao_DenNgay': edu.util.getValById("txtSearch_NgayVao_DenNgay"),
            'strNgayRa_TuNgay': edu.util.getValById("txtSearch_NgayRa_TuNgay"),
            'strNgayRa_DenNgay': edu.util.getValById("txtSearch_NgayRa_DenNgay"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearchHoSo_ToaNha"),
            'strLopQuanLy_Id': '',
            'strKTX_Phong_Id': edu.util.getValById("dropSearchHoSo_Phong"),
            'strPhanLoaiDoiTuong_Id': edu.util.getValById("dropSearch_LoaiDoiTuong"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'dDoiTuongConDangOKTX': -1,
            'strGioiTinh_Id': edu.util.getValById("dropSearch_KhoiTao_GioiTinh"),
            'strTrinhDoDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_TDDT"),
            'strDienDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_DienDT"),
            'strNganhDaoTao_Id': edu.util.getValById("dropSearch_KhoiTao_NganhDT"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strNgayKiemTra': edu.util.getValById("dropSearchHoSo_NgayKiemTra"),
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc'),
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
                    me.dtSinhVien = dtResult;
                    me.genTable_SinhVien(dtResult, iPager);
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
    save_SinhVien: function (strId) {
        var me = this;
        //var obj = me.dtSinhVien.find(e => e.ID === strId);
        var obj_save = {
            'action': 'KTX_PhanCongDTDangKy/ThemMoi',
            'type': 'POST',
            'strKTX_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strKTX_DoiTuongOKyTucXa_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVienDaThem();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'KTX_PhanCongDTDangKy/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVienDaThem();
                });
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblInput_SinhVien",
            bPaginate: {
                strFuntionName: "main_doc.KeHoachDangKy.getList_SinhVien()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mData": "TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "LOPQUANLY"
                },
                {
                    "mDataProp": "KHOAHOC"
                },
                {
                    "mDataProp": "PHANLOAIDOITUONG_TEN"
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

    getList_SinhVienDaThem: function () {
        var me = this;
        var obj_list = {
            'action': 'KTX_PhanCongDTDangKy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKTX_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strKTX_DoiTuongOKyTucXa_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.genTable_SinhVienDaThem(dtResult, iPager);
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
    genTable_SinhVienDaThem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachDangKy.getList_SinhVienDaThem()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3],
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

    getList_Phong: function () {
        var me = this;
        var obj_list = {
            'action': 'KTX_Phong/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_Phong_TuKhoa"),
            'strKTX_ToaNha_Id': edu.util.getValById("dropSearch_ToaNha"),
            'strPhanLoaiDoiTuong_Id': '',
            'strTangThu_Id': "",
            'strLoaiPhong_Id': '',
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default

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
                    me.genTable_Phong(dtResult, iPager);
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
    save_Phong: function (strId) {
        var me = this;
        var objPhong = me.dtPhong.find(e => e.ID === strId);
        //var objKeHoach = me.dtKeHoachDangKy.find(e => e.ID === me.strKeHoachDangKy_Id);
        var obj_save = {
            'action': 'KTX_PhanCongPhongDangKy/ThemMoi',
            'type': 'POST',
            'strKTX_KeHoachDangKy_Id': me.strKeHoachDangKy_Id,
            'strKTX_ToaNha_Id': objPhong.KTX_TOANHA_ID,
            'strKTX_Phong_Id': strId,
            'strNgayVao': edu.util.getValById("txtNgayVaoPhong"),
            'strNgayRa': edu.util.getValById("txtNgayRaPhong"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhongDaThem();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Phong: function (strIds) {
        var me = this;

        var obj_delete = {
            'action': 'KTX_PhanCongPhongDangKy/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhongDaThem();
                });
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_Phong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblInput_Phong",
            bPaginate: {
                strFuntionName: "main_doc.KeHoachDangKy.getList_Phong()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "KTX_TOANHA_TEN"
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

    getList_PhongDaThem: function () {
        var me = this;
        var obj_list = {
            'action': 'KTX_PhanCongPhongDangKy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKTX_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strKTX_ToaNha_Id': edu.util.getValById('dropAAAA'),
            'strKTX_Phong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.genTable_PhongDaThem(dtResult, iPager);
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
    genTable_PhongDaThem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachDangKy.getList_PhongDaThem()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "KTX_PHONG_MA"
                },
                {
                    "mDataProp": "KTX_PHONG_TEN"
                },
                {
                    "mDataProp": "KTX_TOANHA_TEN"
                },
                {
                    "mDataProp": "NGAYVAO"
                },
                {
                    "mDataProp": "NGAYRA"
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
            'strLoaiToaNha_Id': "",
            'strViTriCauThang_Id': "",
            'strPhanLoaiDoiTuong_Id': "",
            'strTangThu_Id': "",
            'strLoaiPhong_Id': "",
            'strTinhChat_Id': "",
            'strTinhTrang_Id': "",
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
};