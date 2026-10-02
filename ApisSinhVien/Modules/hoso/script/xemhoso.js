function HoSoDanhSach() { }
HoSoDanhSach.prototype = {
    dt_HS: [],
    strId: '',
    strSinhVien_Id: '',
    dtQuanHe: [],
    init: function () {
        var me = this;
        me.page_load();
        $("#btnHSSV_Save").click(function () {
            me.save_HS();
        });
        $("#delete_HSSV").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HSSV(me.strSinhVien_Id);
            });
        });
        $("#txtSearchDSSV_TuKhoa").focus();
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearchDSSV_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HSSV();
            }
        });
        $("#btnSearchDSSV_NhanSu").click(function () {
            me.getList_HSSV();
        });
        $("#tblDSSV_NhanSu").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strSinhVien_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strSinhVien_Id, "tblDSSV_NhanSu");
            // Mở modal chỉnh sửa mới (2026-08-21)
            var personId = me.strSinhVien_Id;
            // 1 SV có thể học nhiều ngành → lookup theo MASO ở dòng click (2026-08-28)
            var $tr = $(this).closest('tr');
            var rowText = ($tr.text() || '').trim();
            var candidates = (me.dt_HS || []).filter(function (x) { return x.ID == personId; });
            var aData = candidates.find(function (x) { return x.MASO && rowText.indexOf(x.MASO) > -1; })
                || (me.dt_HS || []).find(function (x) { return x.MASO && rowText.indexOf(x.MASO) > -1; })
                || candidates[0]
                || (me.dt_HS || []).find(function (x) { return x.ID == personId; })
                || {};
            if (window.main_doc && main_doc.DeXuatHoSo && main_doc.DeXuatHoSo.openEditByPerson) {
                main_doc.DeXuatHoSo.openEditByPerson({
                    id: personId,
                    hoDem: aData.HODEM, ten: aData.TEN,
                    ngaySinh_Ngay: aData.NGAYSINH_NGAY,
                    ngaySinh_Thang: aData.NGAYSINH_THANG,
                    ngaySinh_Nam: aData.NGAYSINH_NAM || aData.BIRTH_YEAR || '',
                    anh: aData.ANH || aData.ANHCANHAN || '',
                    gioiTinh: aData.GENDER_ID || aData.GIOITINH_ID || '',
                    gioiTinhMa: aData.GIOITINH_MA || '',
                    danTocMa: aData.DANTOC_MA || '',
                    tonGiaoMa: aData.TONGIAO_MA || '',
                    quocTichMa: aData.QUOCTICH_MA || '',
                    aData: aData
                });
                return;
            }
            me.getDetail_HSSV(me.strSinhVien_Id);
            me.getList_ThanhVien(me.strSinhVien_Id);
            $("#zoneEditOld").slideDown();
        });
        $("#tblThanhVien").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThanhVien tr[id='" + strRowId + "']").remove();
        });
        $("#tblThanhVien").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThanhVien(strId);
            });
        });
        $("#btnThemDong_ThanhVien").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhVienNew(id, "");
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_HSSV();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.getList_HSSV();
        });
        $("#dropSearch_ChuongTrinhDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
            me.getList_HSSV();
        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_HSSV();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        edu.extend.setTinhThanh(["txtSV_NoiSinh", "txtSV_QueQuan", "txtSV_HoKhauThuongTru"], 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        edu.system.uploadAvatar(['uploadPicture_SV'], "");
        edu.system.loadToCombo_DanhMucDuLieu("NS.GITI", "dropSV_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropSV_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropSV_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropSV_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TPXT", "dropSV_HoanCanhXuatThan");
        edu.system.loadToCombo_DanhMucDuLieu("SV.DOITUONGUUTIEN", "dropSV_DoiTuongUuTien");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropSV_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu("NS.QHGD", "", "", me.cbGetList_QuanHe, "", "HESO1");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "drop_TrangThaiSV");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TNH", "drop_TKNH_ThuocNganHang");
        edu.system.hiddenElement('{"readonlyselect2": "#dropSV_GioiTinh,#dropSV_DanToc,#dropSV_TonGiao,#dropSV_QuocTich,#dropSV_HoanCanhXuatThan,#dropSV_DoiTuongUuTien,#drop_TrangThaiSV"}');
    },
    /*------------------------------------------
	--Discription: Hàm chung HoSo
	-------------------------------------------*/
    save_HS: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_HoSo/Capnhat',            

            'strId': me.strSinhVien_Id,
            'strHoDem': edu.util.getValById('txtSV_HoDem'),
            'strTen': edu.util.getValById('txtSV_Ten'),
            'strMaSo': edu.util.getValById('txt_MaSoSV'),
            'strNgaySinh_Nam': edu.util.getValById('txtSV_NamSinh'),
            'strNgaySinh_Thang': edu.util.getValById('txtSV_ThangSinh'),
            'strNgaySinh_Ngay': edu.util.getValById('txtSV_NgaySinh'),
            'strBiDanh': "",
            'strTenGoiKhac': "",
            'strSoHoChieu': "",
            'strGioiTinh_Id': edu.util.getValById('dropSV_GioiTinh'),
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("tinhid")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("huyenid")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("xaId")),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_NoiSinh").attr("name")),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("tinhid")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("huyenid")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtSV_QueQuan").attr("xaId")),
            'strQueQuan_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_QueQuan").attr("name")),
            'strDanToc_Id': edu.util.getValById('dropSV_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropSV_TonGiao'),
            'strCMTND_So': edu.util.getValById('txtSV_SCC_So'),
            'strCMTND_NgayCap': edu.util.getValById('txtSV_SCC_NgayCap'),
            'strCMTND_NoiCap': edu.util.getValById('txtSV_SCC_NoiCap'),
            'strNoiOHienNay': edu.util.getValById('txtSV_NoiOHienNay'),
            'strNgayVaoTruong': edu.util.getValById('txt_NgayVaoTruong'),
            'strDangDoan_NgayVaoDoan': edu.util.getValById('txtSV_NgayVaoDoan'),
            'strDangDoan_NgayVaoDang': edu.util.getValById('txtSV_NgayVaoDang'),
            'strDangDoan_NgayChinhThuc': edu.util.getValById('txtSV_NgayVaoDangChinhThuc'),
            'strNganHang_SoTaiKhoan': edu.util.getValById('txtSV_TaiKhoanNganHang'),
            'strNganHang_ThuocNganHang_Id': edu.util.getValById('drop_TKNH_ThuocNganHang'),
            'strNganHang_ThongTinChiNhanh': edu.util.getValById('txtSV_ChiNhanhNganHang'),
            'strHoKhau_TinhThanh_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("tinhid")),
            'strHoKhau_QuanHuyen_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("huyenid")),
            'strHoKhau_Xa_Id': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("xaId")),
            'strHoKhau_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSV_HoKhauThuongTru").attr("name")),
            'strQuocTich_Id': edu.util.getValById('dropSV_QuocTich'),
            'strThanhPhanGiaDinh_Id': edu.util.getValById('dropSV_HoanCanhXuatThan'),
            'strDoiTuongDaoTao_Id': edu.util.getValById('dropSV_DoiTuongUuTien'),
            'strTTLL_DienThoaiCaNhan': edu.util.getValById('txtSV_DienThoaiCaNhan'),
            'strTTLL_DienThoaiGiaDinh': "",
            'strTTLL_DienThoaiCoQuan': "",
            'strTTLL_EmailCaNhan': edu.util.getValById('txtSV_Email'),
            'strTTLL_KhiCanBaoTinChoAi': edu.util.getValById('txtSV_DiaChiBaoTin'),
            'strNgayRaTruong': edu.util.getValById('txtNgayRaTruong'),
            'strThongTinTruoc_NgheNghiep': "",
            'strThongTinTruoc_KhenThuong': "",
            'strThongTinTruoc_KyLuat': "",
            'strThongTinTruoc_GhiChu': "",
            'strAnh': edu.util.getValById('uploadPicture_SV'),
            'strCoQuanCongTac': edu.util.getValById('txtCoQuanCongTac'),
            'strMaSoThueCaNhan': edu.util.getValById('txtMaSoThue'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('drop_TrangThaiSV'),
            'strLopQuanLy_Id': "#",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Lưu thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!", 'i');
                    }
                    $("#tblThanhVien tbody tr").each(function () {
                        var strThanhVien_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThanhVien(strThanhVien_Id, me.strSinhVien_Id);
                    });
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }                
            },
            error: function (er) {  },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HSSV: function () {
        var me = main_doc.HoSoDanhSach
        var obj_list = {
            'action'            : 'SV_HoSo/LayDanhSach',
            'versionAPI'        : 'v1.0',

            'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
            'strNguoiThucHien_Id': "",
            'pageIndex'         : edu.system.pageIndex_default,
            'pageSize'          : edu.system.pageSize_default
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
                    me.dt_HS = dtResult;
                    me.genTable_HSSV(dtResult, iPager);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }                
            },
            error: function (er) {                
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HSSV: function () {
        var me = main_doc.HoSoDanhSach;
        var obj_detail = {
            'action': 'SV_HoSo/LayChiTiet',

            'strId': me.strSinhVien_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HS(data.Data[0]);
                    }
                    else {
                        me.viewForm_HS([]);
                    }
                } else {
                    edu.system.alert(obj_save.action + ": " + data.Message);                    
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));                
            },
            type: "GET",
            action: obj_detail.action,            
            contentType: true,            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    delete_HSSV: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_HoSo/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#zoneEdit").slideUp();
                    edu.system.alert("Xóa thành công!");
                    me.getList_HSSV();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
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
	--Discription: Generating html on interface HoSoSinhVien
	--ULR:  Modules
	-------------------------------------------*/
    genTable_HSSV: function (data, iPager) {
        var me = main_doc.HoSoDanhSach
        edu.util.viewHTMLById("lblDSSV_NhanSu_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDSSV_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoDanhSach.getList_HSSV()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            colPos: {
                left: [1],
                fix: [0]
            },
            arrClassName: ["btnEdit"],
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(aData.ANH), constant.setting.EnumImageType.ACCOUNT);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.NGAYSINH_NGAY) + "/" + edu.util.returnEmpty(aData.NGAYSINH_THANG) + "/" + edu.util.returnEmpty(aData.NGAYSINH_NAM) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_HS: function (data) {
        var me = main_doc.CapNhatHoSo;
        //Thong tin co ban
        edu.util.viewValById("uploadPicture_SV", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_SV").attr("src", strAnh);
        edu.util.viewValById("txtSV_HoDem", data.HODEM);
        edu.util.viewValById("txtSV_Ten", data.TEN);
        edu.util.viewValById("txtSV_NgaySinh", data.NGAYSINH_NGAY);
        edu.util.viewValById("txtSV_ThangSinh", data.NGAYSINH_THANG);
        edu.util.viewValById("txtSV_NamSinh", data.NGAYSINH_NAM);
        edu.util.viewValById("txtSV_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewValById("txtSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_TEN);
        edu.util.viewValById("dropSV_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("dropSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_ID);
        edu.util.viewValById("dropSV_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropSV_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("dropSV_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_ID);
        edu.util.viewValById("txtSV_DanToc", data.DANTOC_TEN);
        edu.util.viewValById("txtSV_TonGiao", data.TONGIAO_TEN);
        edu.util.viewValById("txtSV_QuocTich", data.QUOCTICH_TEN);
        edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_TEN);
        edu.util.viewValById("txt_NgayVaoTruong", data.NGAYVAOTRUONG);
        edu.util.viewValById("txtNgayRaTruong", data.NGAYRATRUONG);
        edu.util.viewValById("txt_MaSoSV", data.MASO);
        edu.util.viewValById("drop_TrangThaiSV", data.QLSV_NGUOIHOC_TRANGTHAI_ID);
        edu.util.viewValById("txtSV_HeDaoTao", data.HEDAOTAO);
        edu.util.viewValById("txtSV_KhoaDaoTao", data.KHOADAOTAO);
        edu.util.viewValById("txtSV_KhoaQuanLy", data.KHOAQUANLY);
        edu.util.viewValById("txtSV_NganhHoc", data.NGANH);
        edu.util.viewValById("txtSV_Lop", data.LOP);
        edu.util.viewValById("txtSV_TruongTHPT", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txtSV_TaiKhoanNganHang", data.NGANHANG_SOTAIKHOAN);
        edu.util.viewValById("drop_TKNH_ThuocNganHang", data.NGANHANG_THUOCNGANHANG_ID);
        edu.util.viewValById("txtSV_ChiNhanhNganHang", data.NGANHANG_THONGTINCHINHANH);
        edu.extend.viewTinhThanhById("txtSV_NoiSinh", data.NOISINH_TINHTHANH_ID, data.NOISINH_QUANHUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_PHUONGXAKHOIXOM);
        edu.extend.viewTinhThanhById("txtSV_QueQuan", data.QUEQUAN_TINHTHANH_ID, data.QUEQUAN_QUANHUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_PHUONGXAKHOIXOM);
        edu.extend.viewTinhThanhById("txtSV_HoKhauThuongTru", data.HOKHAU_TINHTHANH_ID, data.HOKHAU_QUANHUYEN_ID, data.HOKHAU_XA_ID, data.HOKHAU_PHUONGXAKHOIXOM);
        edu.util.viewValById("txtSV_NoiOHienNay", data.NOIOHIENNAY);
        edu.util.viewValById("txtSV_DiaChiBaoTin", data.TTLL_KHICANBAOTINCHOAI_ODAU);
        edu.util.viewValById("txtSV_Email", data.TTLL_EMAILCANHAN);
        edu.util.viewValById("txtSV_DienThoaiCaNhan", data.TTLL_DIENTHOAICANHAN);
        edu.util.viewValById("txtSV_LinkFB", data.DANG_NGAYVAO);
        edu.util.viewValById("txtSV_SCC_So", data.CMTND_SO);
        edu.util.viewValById("txtSV_SCC_NgayCap", data.CMTND_NGAYCAP);
        edu.util.viewValById("txtSV_SCC_NoiCap", data.CMTND_NOICAP);
        edu.util.viewValById("txtSV_NgayVaoDoan", data.DANGDOAN_NGAYVAODOAN);
        edu.util.viewValById("txtSV_NgayVaoDang", data.DANGDOAN_NGAYVAODANG);
        edu.util.viewValById("txtSV_NgayVaoDangChinhThuc", data.DANGDOAN_NGAYCHINHTHUCVAODANG);        
        edu.util.viewValById("txtCoQuanCongTac", data.COQUANCONGTAC);
        edu.util.viewValById("txtMaSoThue", data.MASOTHUECANHAN);
    },
    save_ThanhVien: function (strThanhVien_Id, strSinhVien_Id) {
        var me = this;
        var strId = strThanhVien_Id;
        var strTPGD_Ten = edu.util.getValById('txtHoTen' + strThanhVien_Id);
        var strQuanHe_Id = edu.util.getValById('dropQuanHe' + strThanhVien_Id);
        var strTPGD_NamSinh = edu.util.getValById('txtNamSinh' + strThanhVien_Id);
        var strTPGD_NgheNghiep = edu.util.getValById('txtNgheNghiep' + strThanhVien_Id);
        var strTPGD_DienThoaiCaNhan = edu.util.getValById('txtSoDienThoai' + strThanhVien_Id);
        var strTPGD_NoiOHienNay = edu.util.getValById('txtNoiOHienNay' + strThanhVien_Id);
        if (!edu.util.checkValue(strTPGD_Ten) || !edu.util.checkValue(strQuanHe_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'SV_ThanhPhanGiaDinh/ThemMoi',            

            'strId': strThanhVien_Id,
            'strQLSV_NguoiHoc_Id': strSinhVien_Id,
            'strQuanHe_Id': strQuanHe_Id,
            'strHoDem': "",
            'strTen': strTPGD_Ten,
            'strQuocTich_Id': "",
            'strDanToc_Id': "",
            'strTonGiao_Id': "",
            'strHoKhau_TinhThanh_Id': "",
            'strHoKhau_QuanHuyen_Id': "",
            'strHoKhau_Xa_Id': "",
            'strHoKhau_PhuongXaKhoiXom': strTPGD_NoiOHienNay,
            'strNgaySinh_Ngay': "",
            'strNgaySinh_Thang': "",
            'strNgaySinh_Nam': strTPGD_NamSinh,
            'strNgheNghiep': strTPGD_NgheNghiep,
            'strDienThoaiCaNhan': strTPGD_DienThoaiCaNhan,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'SV_ThanhPhanGiaDinh/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    edu.system.alert(obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_ThanhPhanGiaDinh/LayDanhSach',            

            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strQuanHe_Id': '',
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThanhVien(dtResult);
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
    delete_ThanhVien: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_ThanhPhanGiaDinh/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThanhVien();
                }
                else {
                    edu.system.alert(data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            action: obj_delete.action,            
            contentType: true,            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHTML_ThanhVien: function (data) {
        var me = this;
        $("#tblThanhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThanhVien_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThanhVien_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThanhVien_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropQuanHe' + strThanhVien_Id + '" class="select-opt"></select ></td>';
            row += '<td><input type="text" id="txtHoTen' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].TEN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNamSinh' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYSINH_NAM) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNgheNghiep' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].NGHENGHIEP) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtSoDienThoai' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].DIENTHOAICANHAN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtNoiOHienNay' + strThanhVien_Id + '" value="' + edu.util.returnEmpty(data[i].HOKHAU_PHUONGXAKHOIXOM) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteTienDo" id="' + strThanhVien_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblThanhVien tbody").append(row);
            me.genComBo_QuanHe("dropQuanHe" + strThanhVien_Id, data[i].QUANHE_ID);
        }
        for (var i = data.length; i < 6; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhVienNew(id, "");
        }
    },
    genHTML_ThanhVienNew: function (strThanhVien_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThanhVien").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThanhVien_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThanhVien_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropQuanHe' + strThanhVien_Id + '" class="select-opt"></select ></td>';
        row += '<td><input type="text" id="txtHoTen' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNamSinh' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNgheNghiep' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtSoDienThoai' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtNoiOHienNay' + strThanhVien_Id + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThanhVien_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblThanhVien tbody").append(row);
        me.genComBo_QuanHe("dropQuanHe" + strThanhVien_Id, "");
    },
    cbGetList_QuanHe: function (data) {
        console.log(data);
        main_doc.HoSoDanhSach.dtQuanHe = data;
    },
    genComBo_QuanHe: function (strDropId, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuanHe,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strDropId],
            type: "",
            title: "Chọn quan hệ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDropId).select2();
    },
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: edu.util.getValCombo("dropSearch_NamHoc"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValCombo("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValCombo("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_KhoaDaoTao", "");
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_ChuongTrinhDaoTao", "");
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
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
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_LopQuanLy", "");
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropSearch_PhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc"],
            type: "",
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
};