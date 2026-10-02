/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function NhapTheoLop() { };
NhapTheoLop.prototype = {
    dtTrangThai: [],
    dtNhapChuyenCan: [],
    dtLopHoc: [],
    arrHead_Id: [],
    strDanhSachHoc_Id: '',
    iMaxLength: 0,
    arrTrangThai_Id: [],
    arrTrangThai_Ten: [],
    strHead: '',
    dtXacNhan: [],
    strLoaiXacNhan: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.strHead = $("#tblNhapChuyenCan thead").html();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "dropSearch_KieuChuyenCan_IHD");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDANHSACH", "dropSearch_LoaiDanhSach");
        $(".btnClose").click(function (e) {
            edu.util.toggle_overide("zone-bus", "zone_notify_detai");
        });

        me.getList_Hoc();
        me.getList_ThoiGian();
        me.getList_HocPhan();
        $('#dropSearch_LoaiDanhSach').on('select2:select', function () {
            me.getList_ThoiGian();
            me.getList_HocPhan();
            me.getList_LopQuanLy();
            me.getList_Hoc();
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.getList_Hoc();
        });
        $('#dropSearch_LopQuanLy').on('select2:select', function () {
            me.getList_HocPhan();
            me.getList_Hoc();
        });
        $('#dropSearch_HocPhan').on('select2:select', function () {
            me.getList_Hoc();
        });
        $('#dropSearch_KieuChuyenCan_IHD').on('select2:select', function () {
            me.getList_NhapChuyenCan();
            me.getList_Hoc();
        });
        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        //me.getList_NamNhapHoc();
        //me.getList_KhoaQuanLy();
        //me.getList_NhapChuyenCan();

        $("#btnSearch").click(function (e) {
            me.getList_Hoc();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_Hoc();
            }
        });
        $("#tblLopHoc").delegate('.btnChonDanhSach', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zone_nhapchuyencan");
            me.strDanhSachHoc_Id = this.id;
            me.getList_NhapChuyenCan(this.id);
            var aDataDS = me.dtLopHoc.find(e => me.strDanhSachHoc_Id == e.ID);
            $("#lblForm_KhoiTao_NO").html('<i class="fa fa-plus-square"></i> Danh sách: ' + aDataDS.TEN);
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_NTL", function (addKeyValue) {
            addKeyValue("strTinhDenNgay", edu.util.getValById("txtSearch_TuNgay_IHD"));
            addKeyValue("strDanhSachHoc_Id", main_doc.NhapTheoLop.strDanhSachHoc_Id);
        });
        $("#btnSaveChuyenCan").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblNhapChuyenCan .checkChuyenCan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    } else {
                        var inputcheck = $("#"+x[i].id.replace("chkSelect", "input_"));
                        if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_NhapChuyenCan(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_NhapChuyenCan(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });
        $("#btnKhoiTao").click(function () {
            me.khoiTao_NhapChuyenCan();
        });

        $("#tblNhapChuyenCan").delegate(".chkSelectAll", "click", function (e) {
           
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".checkNgay" + strClass).each(function () {
                this.checked = checked_status;
            });
        });

        $("#btnCongBo").click(function () {
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMDANH";
            //var strLopHocPhan_Id = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id).IDLOPHOCPHAN;

            me.getList_XacNhanSanPham(me.strDanhSachHoc_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
            me.getList_XacNhan(me.strDanhSachHoc_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
        });

        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            //var strLopHocPhan_Id = me.dtLichHoc.find(e => e.IDLICHHOC === me.strLichHoc_Id).IDLOPHOCPHAN;
            me.save_XacNhanSanPham(me.strDanhSachHoc_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            me.save_XacNhanSanPham(me.strDanhSachHoc_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_Hoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_XuLyDiem/LayDSDiem_DanhSachHoc',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),//,'B7EEDF237D98403294EF4C8A6628F9C0',
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),//'930C20DE21494475943AA79803CBA2EA',
            'strTrangThai_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strNguoiDung_Id': edu.system.userId,//'6E83EC35FE5D46138562A0D3E39A1047',
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtLopHoc = dtReRult;
                    me.genTable_Hoc(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_Hoc: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblLopHoc_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblLopHoc",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NhapTheoLop.getList_Hoc()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 8]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIDANHSACH_TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btnChonDanhSach" id="' + aData.ID + '">Chọn</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length == 1) {
            //me.toggle_detail(data[0].ID);
            $("#tblLopHoc .btnChonDanhSach[id='" + data[0].ID + "']").trigger("click");
        }
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_XuLyDiem/LayDSThoiGian',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_ThoiGian(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_LopQuanLy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_XuLyDiem/LayDSLopQuanLy',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_LopQuanLy(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_XuLyDiem/LayDSHocPhan',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_HocPhan(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_NhapChuyenCan: function (strDanhSach_Id) {
        var me = main_doc.NhapTheoLop;
        if (strDanhSach_Id == undefined) strDanhSach_Id = me.strDanhSachHoc_Id;
        if (!edu.util.getValById('dropSearch_KieuChuyenCan_IHD')) return;
        //--Edit
        var obj_save = {
			'action': 'XLHV_CC_ThongTin_MH/DSA4BRIQDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP',
			'func': 'PKG_CHUYENCAN_THONGTIN.LayDSQLSV_NguoiHoc_ChuyenCan',
			'iM' : edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_DT'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_LopQuanLy"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strDiem_DanhSachHoc_Id': strDanhSach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 500000,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNhapChuyenCan = dtReRult;
                    me.genTable_NhapChuyenCan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert( data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getData_NhapChuyenCan: function (jsonSV, strNgay_ID, strNgay) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CC_NguoiHoc_ChuyenCan/LayKetQuaChuyenCanTheoNgay',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgay_Gio_Phut_Giay_Id': strNgay_ID,
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strQLSV_NguoiHoc_Id': jsonSV.ID,
            'strDaoTao_LopQuanLy_Id': jsonSV.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': jsonSV.DAOTAO_CHUONGTRINH_ID,
            'strDiem_DanhSachHoc_Id': me.strDanhSachHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + jsonSV.ID + "_" + strNgay_ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].ID);
                            var inputCheck = $("#input_" + jsonSV.ID + "_" + strNgay_ID);
                            inputCheck.val(dtReRult[i].SOLUONG);
                            inputCheck.attr("name", dtReRult[i].SOLUONG);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NhapChuyenCan: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtNhapChuyenCan.rs, "ID");
        var objNgay = me.dtNhapChuyenCan.rsNgay.find(e => e.ID == arrId[1]);
        var strNgay = $(point).attr("title");
        //--Edit
        var obj_save = {
            'action': 'XLHV_CC_ThongTin_MH/FSkkLB4QDRIXHg8mNC4oCS4iHgIpNDgkLwIgLwPP', 
            'func': 'PKG_CHUYENCAN_THONGTIN.Them_QLSV_NguoiHoc_ChuyenCan',
            'iM': edu.system.iM, 
            'strId': $(point).attr("name"),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strSV_Id,
            'strDaoTao_LopQuanLy_Id': objSV.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_CHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strDiem_DanhSach_Id': me.strDanhSachHoc_Id,
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strNgayGhiNhan': strNgay,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objNgay.GIO,
            'dPhut': objNgay.PHUT,
            'dGiay': objNgay.GIAY,
        };
        if (obj_save.strId) {
            obj_save.action = 'XLHV_CC_ThongTin_MH/EjQgHhANEhceDyY0LigJLiIeAik0OCQvAiAv';
            obj_save.func = 'PKG_CHUYENCAN_THONGTIN.Sua_QLSV_NguoiHoc_ChuyenCan';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapChuyenCan: function (point) {
        var me = this;
        //--Edit
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtNhapChuyenCan.rs, "ID");
        var objNgay = me.dtNhapChuyenCan.rsNgay.find(e => e.ID == arrId[1]);
        var strNgay = $(point).attr("title");
        var obj_delete = {
            'action': 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strSV_Id,
            'strDaoTao_LopQuanLy_Id': objSV.LOP_ID,
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_CHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_NGUOIHOC_TRANGTHAI_ID,
            'strDiem_DanhSachHoc_Id': me.strDanhSachHoc_Id, 
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strNgay_Gio_Phut_Giay_Id': arrId[1],
            'strNgayGhiNhan': strNgay,
            'dGio': objNgay.GIO,
            'dPhut': objNgay.PHUT,
            'dGiay': objNgay.GIAY,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa quyền thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: "SV_QuyetDinh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    khoiTao_NhapChuyenCan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CC_ThoiGian_ChuyenCan/ThemMoi',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKhoaQuanLy_Id': edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"),
            'strHeDaoTao_Id': edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            'strKhoaDaoTao_Id': edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            'strChuongTrinh_Id': edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            'strLopQuanLy_Id': edu.util.getValCombo("dropSearch_LopQuanLy"),
            'strNamNhapHoc': edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString(),
            'strNgay': edu.util.getValById('txtSearch_TuNgay_KhoiTao'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strKieuChuyenCan_Id': edu.util.getValById('dropSearch_KieuChuyenCan_IHD'),
            'strDiem_DanhSachHoc_Id': me.strDanhSachHoc_Id,
            'strNgayGhiNhan': edu.util.getValById('txtSearch_TuNgay_KhoiTao'),
            'strGio': edu.util.getValById('txtAAAA'),
            'strPhut': edu.util.getValById('txtAAAA'),
            'strGiay': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),

            'dGio': 0,
            'dPhut': 0,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Khởi tạo thành công");
                    me.getList_NhapChuyenCan();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
;
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_NhapChuyenCan: function (data, iPager) {
        var me = main_doc.NhapTheoLop;
        $("#tblNhapChuyenCan thead").html(me.strHead);
        $("#tblNhapChuyenCan tfoot").html("");
        var row = '';
        for (var i = 0; i < data.rsNgay.length; i++) {
            row += '<th class="td-center" style="width: 100px">' + data.rsNgay[i].NGAYGHINHAN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data.rsNgay[i].ID + '"></th>';
        }
        row += '<th class="td-center td-fixed">Tổng</th>';
        $("#tblNhapChuyenCan thead tr:eq(0)").append(row);

        var jsonForm = {
            strTable_Id: "tblNhapChuyenCan",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapTheoLop.getList_NhapChuyenCan()",
            //    iDataRow: iPager,
            //},
            aaData: data.rs,
            colPos: {
                center: [0, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOADAOTAO_TEN",
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                },
                {
                    "mDataProp": "LOP"
                },
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                }
            ]
        };
        for (var i = 0; i < data.rsNgay.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.ID + ' checkNgay' + main_doc.NhapTheoLop.dtNhapChuyenCan.rsNgay[iThuTu].ID + '" id="chkSelect' + aData.ID + '_' + main_doc.NhapTheoLop.dtNhapChuyenCan.rsNgay[iThuTu].ID + '" title="' + main_doc.NhapTheoLop.dtNhapChuyenCan.rsNgay[iThuTu].NGAYGHINHAN + '" />'
                        + '<input style="width: 60%; float: right" id="input_' + aData.ID + '_' + main_doc.NhapTheoLop.dtNhapChuyenCan.rsNgay[iThuTu].ID + '" />';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<span id="lblSumSV' + aData.ID +'"></span>';
            }
        });
        jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        edu.system.loadToTable_data(jsonForm);
        edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        for (var i = 0; i < data.rs.length; i++) {
            for (var j = 0; j < data.rsNgay.length; j++) {
                me.getData_NhapChuyenCan(data.rs[i], data.rsNgay[j].ID, data.rsNgay[j].NGAYGHINHAN);
            }
            $("#tblNhapChuyenCan tbody tr[id=" + data.rs[i].ID + "]").attr("title", data.rs[i].HOTEN);
        }
    },
    endGetData: function () {
        var me = main_doc.NhapTheoLop;
        console.log("đã vào");
        var iSumTong = 0;
        var iBuoiTong = 0;
        for (var i = 0; i < me.dtNhapChuyenCan.rs.length; i++) {
            if (me.dtNhapChuyenCan.rs[i] != undefined) {
                var iSumSV = 0;
                var iBuoi = 0;
                var strSinhVien_Id = me.dtNhapChuyenCan.rs[i].ID;
                var x = $(".checkSV" + strSinhVien_Id);
                for (var j = 0; j < x.length; j++) {
                    if ($(x[j]).is(':checked')) {
                        iSumSV++;
                        var temp = $("#" + x[j].id.replace(/chkSelect/g, 'input_')).val();
                        if (temp) {
                            iBuoi += parseInt(temp);
                            iBuoiTong += parseInt(temp);
                        }
                    }
                }
                $("#lblSumSV" + strSinhVien_Id).html(iSumSV + "(" + iBuoi + ")"); iSumTong += iSumSV;
            }
        }
        var html = '<tr> <td colspan="9" style="text-align: center">Tổng</td>'
        for (var i = 0; i < me.dtNhapChuyenCan.rsNgay.length; i++) {
            var iSumNgay = 0;
            var iBuoi = 0;
            var strNgay_Id = me.dtNhapChuyenCan.rsNgay[i].ID;
            var x = $(".checkNgay" + strNgay_Id);
            for (var j = 0; j < x.length; j++) {
                if ($(x[j]).is(':checked')) {
                    iSumNgay++;
                    var temp = $("#" + x[j].id.replace(/chkSelect/g, 'input_')).val();
                    if (temp) {
                        iBuoi += parseInt(temp);
                    }
                }
            }
            html += '<td style="text-align: center">' + iSumNgay + '(' + iBuoi + ')</td>';
        }
        html += '<td style="text-align: center">' + iSumTong + '(' + iBuoiTong + ')</td></tr>';
        $("#tblNhapChuyenCan tfoot").html(html);
        edu.system.move_ThroughInTable("tblNhapChuyenCan");
    },
    endSetData: function () {
        var me = main_doc.NhapTheoLop;
        edu.system.alert("Thực hiện thành công", 'w');
        setTimeout(function () {
            me.getList_NhapChuyenCan();
        }, 1000);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> 
    --Author: vanhiep
	-------------------------------------------*/
    report: function (strLoaiBaoCao) {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        //

        addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
        addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD"));
        addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao_IHD"));
        addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"));
        addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"));
        addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_LopQuanLy"));
        addKeyValue("strNamNhapHoc", edu.util.getValCombo("dropSearch_NamNhapHoc_IHD"));
        addKeyValue("strTrangThaiNguoiHoc_Id", me.arrTrangThai_Id.toString());
        addKeyValue("strTrangThaiNguoiHoc_Ten", me.arrTrangThai_Ten.toString());
        addKeyValue("strTinhDenNgay", edu.util.getValById("txtSearch_TuNgay_IHD"));

        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiThucHien_Id", edu.system.userId);


        var obj_save = {
            'arrTuKhoa': arrTuKhoa,
            'arrDuLieu': arrDuLieu,
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_XacNhan/Them_Diem_XacNhan',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,

            'strNguoiXacNhan_Id': edu.system.userId,
            'strDuLieuXacNhan': strSanPham_Id,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
		var obj_save = {
			'action': 'D_Chung_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P',
			'func': 'PKG_DIEM_CHUNG.LayDSHanhDongXacNhan',
			'iM' : edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.loadBtnXacNhan(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert( JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_XacNhan/LayDSDiem_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    loadBtnXacNhan: function (data) {
        main_doc.NhapTheoLop.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa-solid fa-circle-check";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-2x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
}