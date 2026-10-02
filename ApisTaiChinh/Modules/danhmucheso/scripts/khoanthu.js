/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 14/09/2017
--Input: 
--Output:
--API URL: TaiChinh/QLTC_KhoanThu
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KhoanThu() { };
KhoanThu.prototype = {
    objHTML_DMLKT: {},
    objInput_DMLKT: {},
    arrValid_DMLKT: [],
    dt_DMLKT: null,
    strKeHoachHD_Id: '',
    dtKeHoachHD: [],
    strKhoanThu_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        edu.system.buttonLoading();
        /*------------------------------------------
        --Discription: Initial page KhoanThu
        -------------------------------------------*/
        me.objHTML_DMLKT = {
            table_id: "tbldata_DMLKT",
            prefix_id: "chkSelectAll_DMLKT",
            regexp: /chkSelectAll_DMLKT/g,
            chkOne: "chkSelectOne_DMLKT",
            btn_edit: "btnEditRole_DMLKT",
            btn_save_id: "btnSave",
            btn_save_tl: "Lưu",
        };
        me.objInput_DMLKT = {
            strId: '',
            strTen: "txtTenKhoanThu",
            strMa: "txtMaKhoanThu",
            iThutuUuTienGachNo: 'txtThuTuGachNo',
            iThuTu: "txtThuTuHienThi",
            strNhomCacKhoanThu_Id: "dropNhomKhoanThuEdit",
            strMoTa: "txtMoTa",

            strNhomCacKhoanThu_Id_Search: "",
            strNguoiTao_Id_Search: "dropNguoiTao",
            strCanBoQuanLy_Id_Search: "dropCanBo",
            strTuKhoa_Search: "txtTuKhoa_Search"
        };
        me.arrValid_DMLKT = [
            { "MA": me.objInput_DMLKT.strTen, "THONGTIN1": "1", },
            { "MA": me.objInput_DMLKT.strMa, "THONGTIN1": "1", },
            //{ "MA": me.objInput_DMLKT.strNhomCacKhoanThu_Id, "THONGTIN1": "1", }
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        me.getList_DMLKT();
        /*------------------------------------------
        --Discription: Action_main KhoanThu
        --Order: thêm/xóa/sửa/tìm kiếm/tải lại/khác
        -------------------------------------------*/
        $("#btnSave").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_DMLKT);
            if (valid == true) {
                var selected_id = edu.system.updateModal(this, me.objHTML_DMLKT);
                me.save_DMLKT();
            }
        });
        $("#btnDelete").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.objHTML_DMLKT);
            edu.system.confirm('Bạn có chắc chắn muốn xóa không!', 'w');
            $("#btnYes").click(function (e) {
                me.delete_DMLKT(selected_id);
            });
            return false;
        });
        $(document).delegate("." + me.objHTML_DMLKT.btn_edit, "click", function () {
            var selected_id = edu.system.updateModal(this, me.objHTML_DMLKT);
            if (selected_id != "") {
                me.objInput_DMLKT.strId = selected_id;
                me.getDetail_DMLKT(selected_id);
            }
        });
        $("#btnSearch").click(function () {
            me.getList_DMLKT();
        });
        $("#btnRefresh").click(function () {
            me.getList_DMLKT();
        });
        $("#txtTuKhoa_Search").keypress(function (e) {
            if (e.which == 13) {
                me.getList_DMLKT();
            }
        });
        /*------------------------------------------
        --Discription: Action_extra KhoanThu
        -------------------------------------------*/
        $("#btnAddnew").click(function () {
            me.resetPopup();
            me.popup();
        });
        $("[id$= " + me.objHTML_DMLKT.prefix_id + "]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_DMLKT);
        });
        $(document).delegate("." + me.objHTML_DMLKT.chkOne, "click", function () {
            edu.util.checkedOne_BgRow(this, me.objHTML_DMLKT);
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.LOKT", "dropNhomCacKhoanThu,dropNhomKhoanThuEdit", "Chọn nhóm khoản thu");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.DVT", "dropDonViTinh");

        $("#tbldata_DMLKT").delegate(".btnKeHoachHD", "click", function () {
            var strId = this.id;
            me.strKhoanThu_Id = strId;
            $("#myModalKeHoachHD").modal("show");
            me.getList_KeHoachHD();
        });
        $("#tblKeHoachHD").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtKeHoachHD.find(e => e.ID == strId);
            edu.util.viewValById("txtNam", data.NAM);
            edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
            edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
            me.strKeHoachHD_Id = data.ID;
            $("#myModalHoaDon").modal("show");

        });
        $("#btnAdd_KeHoachHD").click(function () {
            var data = {};
            edu.util.viewValById("txtNam", data.NAM);
            edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
            edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
            me.strKeHoachHD_Id = data.ID;
            $("#myModalHoaDon").modal("show");
        });
        $("#btnSave_HoaDon").click(function () {
            me.save_KeHoachHD();
        });
        $("#btnDelete_KeHoachHD").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachHD", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachHD(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung KhoanThu
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = this;
        edu.util.resetValById(me.objInput_DMLKT.strTen);
        edu.util.resetValById(me.objInput_DMLKT.strMa);
        edu.util.resetValById(me.objInput_DMLKT.iThuTu);
        edu.util.resetValById(me.objInput_DMLKT.strNhomCacKhoanThu_Id);
        edu.util.resetValById(me.objInput_DMLKT.strMoTa);
        edu.util.resetValById(me.objInput_DMLKT.strNguoiTao_Id);
        edu.util.resetValById("txtMaThanhToanDinhDanh");
        edu.util.resetValById("txtVATHD");
        edu.util.resetValById('dropDonViTinh');
        $("#myModal input[type=checkbox]").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        me.objInput_DMLKT.strId = "";
        edu.system.createModal(me.objHTML_DMLKT);
    },
    /*------------------------------------------
    --Discription: Danh mục KhoanThu
    -------------------------------------------*/
    save_DMLKT: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi_MH/FSkkLB4VICgCKSgvKR4CICIKKS4gLxUpNAPP',
            'func': 'pkg_taichinh_thuchi.Them_TaiChinh_CacKhoanThu',
            'iM': edu.system.iM,
            'strId': me.objInput_DMLKT.strId,
            'strTen': edu.util.getValById(me.objInput_DMLKT.strTen),
            'strMa': edu.util.getValById(me.objInput_DMLKT.strMa),
            'iThuTu': edu.util.getValById(me.objInput_DMLKT.iThuTu),
            'dThutuUuTienGachNo': edu.util.getValById(me.objInput_DMLKT.iThutuUuTienGachNo),
            'strNhomCacKhoanThu_Id': edu.util.getValById(me.objInput_DMLKT.strNhomCacKhoanThu_Id),
            'strMoTa': edu.util.getValById(me.objInput_DMLKT.strMoTa),
            'strNguoiThucHien_Id': edu.system.userId,
            'dTinhPhiTuDong': edu.util.getValById('dropTinhPhiTuDong'),
            'dKhoanThuRieng': edu.util.getValById('dropKhoanRieng'),

            'dTinhPhiTuDong': $("#chkTinhPhiTuDong").is(':checked') ? 1: undefined,
            'dKhoanThuRieng': $("#chkKhoanRieng").is(':checked') ? 1 : undefined,
            'dKhoanNopTruoc': $("#chkThanhToanOCong").is(':checked') ? 1 : undefined,
            'dXuatHoaDonTuDong': $("#chkXuatHoaDonTuDong").is(':checked') ? 1 : undefined,
            'dKhongXuatHoaDon': $("#chkKhongXuatHoaDon").is(':checked') ? 1 : undefined,
            'dKiemTraNoKhiXetHB': $("#chkKiemTraNoKhiXetHocBong").is(':checked') ? 1 : undefined,
            'dKiemTraNoKhiXetHV': $("#chkKiemTraNoKhiXetHocVu").is(':checked') ? 1 : undefined,
            'strMaThanhToanDinhDanh': edu.system.getValById('txtMaThanhToanDinhDanh'),
            'dVAT': edu.system.getValById('txtVATHD'),
            'dKiemTraNoKhiXetTN': $("#chkKiemTraNoKhiXetTotNghiep").is(':checked') ? 1 : undefined,
            'dKiemTraNoKhiDangKyHoc': $("#chkKiemTraNoKhiDangKyHoc").is(':checked') ? 1 : undefined,
            'dTinhPhiTuDongLopRieng': $("#chkTinhPhiTuDongLopRieng").is(':checked') ? 1 : undefined,
            'strDonViTinh_Id': edu.system.getValById('dropDonViTinh'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TC_ThuChi_MH/EjQgHhUgKAIpKC8pHgIgIgopLiAvFSk0'
            obj_save.func = 'pkg_taichinh_thuchi.Sua_TaiChinh_CacKhoanThu'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.objInput_DMLKT.strId == "" || me.objInput_DMLKT.strId == null || me.objInput_DMLKT.strId == undefined) {
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
                    me.getList_DMLKT();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) { },
            type: "POST",
            action: obj_save.action,
            versionAPI: "v1.0",
            contentType: true,
            data: (obj_save),
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DMLKT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',

            'strTuKhoa': edu.util.getValById(me.objInput_DMLKT.strTuKhoa_Search),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': edu.util.getValById(me.objInput_DMLKT.strNhomCacKhoanThu_Id_Search),
            'strNguoiThucHien_Id': edu.util.getValById(me.objInput_DMLKT.strNguoiTao_Id_Search),
            'strcanboquanly_id': edu.util.getValById(me.objInput_DMLKT.strCanBoQuanLy_Id_Search),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_DMLKT = data.Data;
                    me.genTable_DMLKT(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DMLKT: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'TC_KhoanThu/LayChiTiet',
            'strId': me.objInput_DMLKT.strId
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_DMLKT = data.Data;
                        me.viewForm_DMLKT(data.Data[0]);
                    }
                    else {
                        console.log("Lỗi ");
                    }
                }
                else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }
            },
            error: function (er) { },
            versionAPI: "v1.0",
            contentType: true,
            type: "GET",
            action: obj_detail.action,
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMLKT: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KhoanThu/Xoa',
            'strIds': Ids,
            'strNguoiTao_Id': edu.system.userId,
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                    me.getList_DMLKT();
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            versionAPI: "v1.0",
            contentType: true,
            type: "POST",
            action: obj_delete.action,
            data: (obj_delete),
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_DMLKT: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.objHTML_DMLKT.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhoanThu.getList_DMLKT()",
                iDataRow: iPager,
            },
            colPos: {
                left: [1, 2, 3, 4],
                center: [0, 5, 6, 7, 8, 9, 10],
                fix: [9, 10],
            },
            sort: true,
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "NHOMCACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "VAT"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mDataProp": "THUTUUUTIENGACHNO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKeHoachHD" id="' + aData.ID + '" title="Sửa">Xem</span>';
                    }
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "TAIKHOAN_TENDAYDU"
                }
                , {
                    "mData": "Sua",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="' + me.objHTML_DMLKT.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="' + me.objHTML_DMLKT.prefix_id + aData.ID + '" class="' + me.objHTML_DMLKT.chkOne + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_DMLKT: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById(me.objInput_DMLKT.strTen, data.TEN);
        edu.util.viewValById(me.objInput_DMLKT.strMa, data.MA);
        edu.util.viewValById(me.objInput_DMLKT.iThuTu, data.THUTU);
        edu.util.viewValById(me.objInput_DMLKT.strNhomCacKhoanThu_Id, data.NHOMCACKHOANTHU_ID);
        edu.util.viewValById(me.objInput_DMLKT.strMoTa, data.MOTA);
        edu.util.viewValById(me.objInput_DMLKT.iThutuUuTienGachNo, data.THUTUUUTIENGACHNO);
        edu.util.viewValById("txtMaThanhToanDinhDanh", data.MATHANHTOANDINHDANH);
        edu.util.viewValById("txtVATHD", data.VAT);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        $("#chkKhoanRieng").prop("checked", data.KHOANTHURIENG);
        $("#chkTinhPhiTuDong").prop("checked", data.TINHPHITUDONG);
        $("#chkThanhToanOCong").prop("checked", data.KHOANNOPTRUOC);
        $("#chkXuatHoaDonTuDong").prop("checked", data.XUATHOADONTUDONG);
        $("#chkKhongXuatHoaDon").prop("checked", data.KHONGXUATHOADON);
        $("#chkKiemTraNoKhiXetHocBong").prop("checked", data.KIEMTRANOKHIXETHOCBONG);
        $("#chkKiemTraNoKhiXetHocVu").prop("checked", data.KIEMTRANOKHIXETHOCVU);
        $("#chkKiemTraNoKhiXetTotNghiep").prop("checked", data.KIEMTRANOKHIXETTOTNGHIEP);
        $("#chkKiemTraNoKhiDangKyHoc").prop("checked", data.KIEMTRANOKHIDANGKYHOC);
        $("#chkTinhPhiTuDongLopRieng").prop("checked", data.TINHPHITUDONGLOPRIENG);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    save_KeHoachHD: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoach_MH/FSkkLB4VAh4KKS4gLxUpNB4QBRk0IDUJBQPP',
            'func': 'pkg_taichinh_kehoach.Them_TC_KhoanThu_QDXuatHD',
            'iM': edu.system.iM,
            'strId': me.strKeHoachHD_Id,
            'strTaiChinh_CacKhoanThu_Id': me.strKhoanThu_Id,
            'dNam': edu.system.getValById('txtNam'),
            'strNgayBatDau': edu.system.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.system.getValById('txtNgayKetThuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TC_KeToan_MH/EjQgHhUCHgopLiAvFSk0HhAFGTQgNQkF';
            obj_save.func = 'pkg_taichinh_ketoan.Sua_TC_KhoanThu_QDXuatHD'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_KeHoachHD();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoachHD: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoach_MH/DSA4BRIVAh4KKS4gLxUpNB4QBRk0IDUJBQPP',
            'func': 'pkg_taichinh_kehoach.LayDSTC_KhoanThu_QDXuatHD',
            'iM': edu.system.iM,
            'strTaiChinh_CacKhoanThu_Id': me.strKhoanThu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachHD = dtReRult;
                    me.genTable_KeHoachHD(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_KeHoachHD: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoach_MH/GS4gHhUCHgopLiAvFSk0HhAFGTQgNQkF',
            'func': 'pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KeHoachHD();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KeHoachHD: function (data, iPager) {
        $("#lblKeHoachHD_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachHD",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachHD.getList_KeHoachHD()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
            
                {
                    "mDataProp": "NAM"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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
        /*III. Callback*/
    },
};