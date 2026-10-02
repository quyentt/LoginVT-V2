/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
/*
1. getList_KhoanThu -> genTable_KhoanThu
2. alertLuu_KhoanThu -> save_TaoSo_HoaDon -> alertLuuThanhCong_KhoanThu -> getList_HoaDon_ChuaIn
3. save_TaoLo_HoaDon -> getList_LoHoaDon -> genTable_LoHoaDon
4. getTemplatePhieu -> getList_HoaDonTheoLo -> fixThreading -> genMauHoaDon_DT -> getData_HoaDon_DT -> genData_HoaDon_DT -> printf_LoHoaDon -> save_TinhTrangHoaDon
*/
function BaoCao() { };
BaoCao.prototype = {
    dtMau: '',
    strLoHoaDon_Id: '',
    dtMauIn: [],
    iSLHoaDon: 0,
    idemHoaDon: 0,
    iPhaiNop: 0,
    dtChungTu: '',
    dtDoiTuong_View: [],
    strHead: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.strHead = $("#tblBangDuLieuKetNoi thead").html();
        edu.system.pageSize_default = 10;
        edu.extend.addNotify();
        //me.getList_MauImport();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropSearch_HinhThucThu", "", me.cbGenCombo_HinhThucThu);
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.BC.TINHTRANGBCLUU", "", "", me.loadBtnXacNhan);
        
        $("#MainContent").delegate("#zonetabkhoanthu", "click", function (e) {
            e.preventDefault();
            //me.activeTabFun();
        });
        me.getList_NguoiThu();
        me.getList_TrangThaiSV();

        me.getList_CoSoDaoTao();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_DMLKT();
        me.getList_BangDuLieu();
        me.getList_BangDuLieuDuocTao();
        me.getList_NamBaoCao();
        $("#btnSearch").click(function (e) {
            me.getList_TongHop();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                
                me.activeTabFun();
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.PHANLOAICHUNGTU", "dropSearch_PhanLoai", "", function (data) {
            setTimeout(function () {

                if (data.length != 1) $("#dropSearch_PhanLoai").val("").trigger("change");
            }, 300);
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropSearch_NganhHoc");
        console.log(11111);
        $('#dropSearch_CoSoDaoTao_IHD').on('select2:select', function (e) {

            me.resetCombobox(this);
        });
        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {
            //console.log($('#dropSearch_HeDaoTao_IHD').length)
            me.getList_KhoaDaoTao();

            me.getList_LopQuanLy();
            //me.resetCombobox(this);
        });
        $('#dropHKHeDaoTao').on('select2:select', function (e) {

            me.getList_KhoaDaoTao2();
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_HocKy_IHD').on('select2:select', function (e) {
            
            var strValue = $('#dropSearch_HocKy_IHD').val();
            if (!(strValue.length > 1 || strValue[0] != "")) {
                $("#dropSearch_KyThucHien_IHD").parent().hide();
            } else {
                $("#dropSearch_KyThucHien_IHD").parent().show();
            }
            me.getList_KeHoachDangKy();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_CanBoXuatBC').on('select2:select', function (e) {

            me.getList_BaoCaoDaLuu();
        });


        $('#dropSearch_BangDuLieuDuocTao').on('select2:select', function (e) {
            me.getList_CotDuLieu()
            me.getList_DuLieu_ChiTiet();
        });
        
        $("#MainContent").delegate(".ckbDSTrangThaiSV_LHD_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_LHD").each(function () {
                this.checked = checked_status;
            });
        });
        $("#MainContent").delegate(".ckbLKT_RT_All", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbLKT_IHD").each(function () {
                this.checked = checked_status;
            });
        });

        $("#tblBangDuLieuKetNoi").delegate("#chkSelectAll_BangDuLieu", "click", function (e) {

            edu.util.checkedAll_BgRow(this, { table_id: "tblBangDuLieuKetNoi" });
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_TC", function (addKeyValue) {

            var strPhamViApDung = "";

            var strValue = $('#dropSearch_HocKy_IHD').val();
            if (strValue.length > 1 || strValue[0] != "") {
                strPhamViApDung = edu.util.getValById("dropSearch_KyThucHien_IHD");
            }
            //
            var strNguoiDangNhap_Id = edu.system.userId;
            var strMaTruong = "KCNTTTN";
            var strNguoiThucHien_Id = edu.util.getValCombo("dropSearch_NguoiThu_IHD");
            var strDAOTAO_HeDaoTao_Id = edu.util.getValCombo("dropSearch_HeDaoTao_IHD");
            var strKhoaDaoTao_Id = edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD");
            var strDaoTao_ToChucCT_Id = edu.util.getValCombo("dropSearch_ChuongTrinh_IHD");
            var strLopHoc_Id = edu.util.getValCombo("dropSearch_Lop_IHD");
            var strDAOTAO_ThoiGianDaoTao = edu.util.getValCombo("dropSearch_HocKy_IHD");
            var strKhoaQuanLy_Id = edu.util.getValCombo("dropSearch_KhoaQuanLy_IHD");
            var strNamNhapHoc = edu.util.getValCombo("dropSearch_NamNhapHoc_IHD");
            var strTuNgay = edu.util.getValById("txtSearch_TuNgay_IHD");
            var strDenNgay = edu.util.getValById("txtSearch_DenNgay_IHD");
            var strTuSo = edu.util.getValById("txtSearch_TuSo_IHD");
            var strDenSo = edu.util.getValById("txtSearch_DenSo_IHD");
            var strTuKhoa = edu.util.getValById("txtSearch_DT");            
            var strTAICHINH_CacKhoanThu_Ids = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD');
            var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
            console.log(strTAICHINH_CacKhoanThu_Ids);
            if (strTAICHINH_CacKhoanThu_Ids.length == 0) {
                edu.system.alert('Vui lòng chọn khoản thu!', 'w');
                return false;
            }
            if (strTrangThaiNguoiHoc_Id === '') {
                edu.system.alert('Vui lòng chọn trạng thái!', 'w');
                return false;
            }
            //
            addKeyValue("strMaTruong", strMaTruong);
            addKeyValue("strDaoTao_CoSoDaoTao_Id", edu.util.getValCombo("dropSearch_CoSoDaoTao_IHD"));
            addKeyValue("strNguoiDangNhap_Id", strNguoiDangNhap_Id);
            addKeyValue("strNguoiThucHien_Id", strNguoiThucHien_Id);
            addKeyValue("strNguoiDung_Id", strNguoiThucHien_Id);
            addKeyValue("strHeDaoTao_Id", strDAOTAO_HeDaoTao_Id);
            addKeyValue("strKhoaDaoTao_Id", strKhoaDaoTao_Id);
            addKeyValue("strChuongTrinh_Id", strDaoTao_ToChucCT_Id);
            addKeyValue("strLopQuanLy_Id", strLopHoc_Id);
            addKeyValue("strThoiGianDaoTao_Id", strDAOTAO_ThoiGianDaoTao);
            addKeyValue("strPhamViApDung", strPhamViApDung);
            addKeyValue("strTuNgay", strTuNgay);
            addKeyValue("strDenNgay", strDenNgay);
            addKeyValue("strTuKhoa", strTuKhoa);
            addKeyValue("strKhoaQuanLy_Id", strKhoaQuanLy_Id);
            addKeyValue("strNamNhapHoc", strNamNhapHoc);
            addKeyValue("strTuSo", strTuSo);
            addKeyValue("strDenSo", strDenSo);
            addKeyValue("strHinhThucThu_Id", edu.util.getValCombo("dropSearch_HinhThucThu"));
            addKeyValue("strDoiTuong", edu.util.getValCombo("dropSearch_DoiTuongSV"));
            addKeyValue("strPhanLoaiChungTu_Id", edu.util.getValCombo("dropSearch_PhanLoai"));
            addKeyValue("strPhanLoaiCSDT", edu.util.getValCombo("dropSearch_PhanLoaiCSDT"));
            addKeyValue("strTaiChinh_Nam_BaoCao_Id", edu.util.getValCombo("dropSearch_NamBaoCao"));
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValById("dropKeHoachDangKy_TP"));
            for (var i = 0; i < strTAICHINH_CacKhoanThu_Ids.length; i++) {
                addKeyValue("strTAICHINH_CacKhoanThu_Ids", strTAICHINH_CacKhoanThu_Ids[i]);
            }
            addKeyValue("strTrangThaiNguoiHoc_Id", strTrangThaiNguoiHoc_Id);
            addKeyValue("strNganhHoc_Id", edu.util.getValCombo("dropSearch_NganhHoc"));
            //strDaoTao_CoSoDaoTao_Id đã addKeyValue ở trên (cạnh strMaTruong) — không lặp lại,
            //vì addKeyValue chỉ push vào arrTuKhoa/arrDuLieu nên gọi 2 lần = 2 dòng thông số trùng.
        });


        $("#btnTaoDuLieu").click(function (e) {
            me.save_BangDuLieu();
        });
        $("#btnSearchDuLieu").click(function () {
            me.getList_CotDuLieu()
            me.getList_DuLieu_ChiTiet();
        });
        $("#btnDeleteBangDuLieu").click(function () {
            
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_BangDuLieu();
            });
        });
        $("#btnDuyetSangKeToan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBangDuLieuKetNoi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu" + arrChecked_Id.length + " liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_CustomAPI(arrChecked_Id[i]);
                }
            });
        });


        $("#btnAddNamBaoCao").click(function (e) {
            $("#myModalNamTaiChinh").modal("show");
            me.getList_NamTaiChinh();
        });
        $("#btnSaveNamBaoCao").click(function (e) {
            me.save_NamBaoCao();
        });
        $("#btnXoaNamBaoCao").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_NamBaoCao();
            });
        });

        $("#btnThemNamTaiChinh").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_NamTaiChinh(id, "");
        });
        $("#tblNamTaiChinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblNamTaiChinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblNamTaiChinh").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_NamTaiChinh(strId);
            });
        });
        $("#btnSave_NamTaiChinh").click(function (e) {
            $("#tblNamTaiChinh tbody tr").each(function () {
                var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                me.save_NamTaiChinh(strHeKhoa_Id);
            });
        });


        $("#btnTaoChungTu").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBangDuLieuKetNoi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.confirm('Nhập số chứng từ: <input id="txtChungTu_SoChungTu" class="form-control" />');
            $("#btnYes").click(function (e) {
                var strSoChungTu = $("#txtChungTu_SoChungTu").val();
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_TaoChungTu(arrChecked_Id[i], strSoChungTu);
                }
            });
        });

        $("#btnXoaDuLieuChungTu").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBangDuLieuKetNoi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.getList_DuLieuXoaChungTu(arrChecked_Id[i]);
            }
        });
        $("#btnTongHopChungTu").click(function (e) {
            me.xacnhan_FastAPI('', "confirmData")
        });
        $("#btnViewBaoCao").click(function () {
            $("#myModalKetQua").modal("show");
            me.getList_CanBoXuatBaoCao();
            //me.getList_BaoCaoDaLuu();
        });

        $(".btnXacNhan_BaoCaoDaLuu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCaoDaLuu", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCaoDaLuu", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanSanPham(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $(".btnDelete_BaoCaoDaLuu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCaoDaLuu", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_BaoCaoDaLuu(arrChecked_Id[i]);
                }
            });
        });

        $("#btnKhaiMaKhachHang").click(function () {
            $("#myModalMaKhachHang").modal("show");
            me.getList_MaKhachHang();
        });
        $("#btnAdd_MaKhachHang").click(function () {
            $("#myModalHeKhoaMaKhachHang").modal("show");

        });
        $("#btnSave_HeKhoaMaKhachHang").click(function (e) {
            if (edu.util.getValById("dropHKKhoaDaoTao")) {
                me.getList_ChuongTrinhDaoTao2();
                $("#myModalHeKhoaMaKhachHang").modal("hide");
            } else {
                edu.system.alert("Vui lòng chọn hệ - khóa?");
                return;
            }
        });

        $("#btnSave_MaKhachHang").click(function () {
            var arrThem = [];
            $("#tblMaKhachHang .kyhieu").each(function () {
                var strValue = $(this).attr("name");
                var x = $(this).val();
                if (x != strValue) arrThem.push(this.id.replace(/txtKyHieu/g, ''));
            })
            if (arrThem.length == 0) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
            arrThem.forEach(e => me.save_MaKhachHang(e));
        });
        $("#btnDelete_MaKhachHang").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMaKhachHang", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => me.delete_MaKhachHang(e));
        });

        $("#btnXemLichBaoCao").click(function () {
            $("#myModalLichBaoCao").modal("show");
            me.getList_LichBaoCao();
        });
        $("#tblLichBaoCao").delegate(".btnThongSo", "click", function (e) {
            var strId = this.id;
            $("#myModalThongSoBaoCao").modal("show")
            me.getList_ThongSoBaoCao(strId);
        });
        $("#btnDelete_LichTuDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLichBaoCao", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                //edu.system.alert('<div id="zoneprocessXXXX"></div>');
                //edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LichBaoCao(arrChecked_Id[i]);
                }
            });
        });
        $("#btnDelete_KetQuaPhaiNop").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKetQuaPhaiNop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KetQuaPhaiNop(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    --ULR: Modules
    -------------------------------------------*/
    showHide_Box: function (cl, id) {
        //cl - list of class to hide()
        //id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: Cơ sở đào tạo.
    --Note: edu.system.getList_CoSoDaoTao gọi proc business
            `pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao` — đúng proc module TS
            (kehoachtuyensinhnew.js: loadCoSoDaoTao_ToSelect) dùng. KHÔNG dùng
            danh mục KHCT.COSODAOTAO vì trả rỗng ở CMC.
    -------------------------------------------*/
    getList_CoSoDaoTao: function () {
        var me = this;
        var objList = {
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000
        }
        edu.system.getList_CoSoDaoTao(objList, "", "", me.cbGenCombo_CoSoDaoTao);
    },
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_KhoaDaoTao2: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropHKHeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao2);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_ChuongTrinhDaoTao2: function () {
        var me = this;
        var objList = {
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropHKHeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropHKKhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", data => {
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", data.length);
            for (var i = 0; i < data.length; i++) {
                me.save_MaKhachHang2(data[i].ID);
            }
        });
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NguoiThu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiDungDaThuTien/LayDanhSach',
            'versionAPI': 'v1.0',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NguoiThu(json);
                } else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
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
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id' : '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
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
    getList_KhoaQuanLy: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoaQuanLy/LayDanhSach',
            'versionAPI': 'v1.0',
            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaQuanLy(json);
                } else {
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message);
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.extend.notifyBeginLoading("Lỗi: " + JSON.stringify(er));
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_CoSoDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "",
                //Hiển thị "TEN (MA)" theo chuẩn dropdown danh mục
                mRender: function (j, aData) {
                    var strTen = edu.util.returnEmpty(aData.TEN);
                    var strMa = edu.util.returnEmpty(aData.MA);
                    if (strMa && strMa != strTen) return strTen + " (" + strMa + ")";
                    return strTen ? strTen : strMa;
                }
            },
            renderPlace: ["dropSearch_CoSoDaoTao_IHD"],
            type: "",
            title: "Tất cả cơ sở đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_CoSoDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_HeDaoTao_IHD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHKHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        //if (data.length != 1) $("#dropSearch_HeDaoTao_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao_IHD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao2: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHKKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_IHD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_IHD").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
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
            renderPlace: ["dropSearch_Lop_IHD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_IHD").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    cbGenCombo_NguoiThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAIKHOAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NguoiThu_IHD"],
            type: "",
            title: "Tất cả người thu",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-6 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-6 checkbox-inline user-check-print">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_HinhThucThu: function (data) {
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
            renderPlace: ["dropSearch_HinhThucThu"],
            type: "",
            title: "Tất cả hình thức thu",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HinhThucThu").val("").trigger("change");
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MauImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import_PhanQuyen/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            row += '<li><a class="btnBaoCao_LHD" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
        }
        $("#zonebtnBaoCao_LHD").html(row);
        //var obj = {
        //    data: data,
        //    renderInfor: {
        //        id: "MA",
        //        parentId: "",
        //        name: "TEN",
        //        code: "",
        //        avatar: "",
        //        Render: function (nRow, aData) {
        //            return "<option id='" + aData.ID + "' value='" + aData.MAUIMPORT_MA + "' name='" + aData.MAUIMPORT_DUONGDANFILEMAU + "' title='" + aData.CHISODONGDOCDULIEUTUFILE + "'>" + aData.MAUIMPORT_TENFILEMAU + "</option>";
        //        }
        //    },
        //    renderPlace: ["dropMauImport"],
        //    type: "",
        //    title: "Chọn mẫu import",
        //}
        //edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DMLKT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': '',
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': "",
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genList_DMLKT(data);
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
    getList_TongHop: function (strTuKhoa) {
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD');
        var strTaiChinh_KhoanKhac_Ids = "";
        if (strLoaiKhoanThu.length > 120) {
            strTaiChinh_KhoanKhac_Ids = strLoaiKhoanThu.slice(121, strLoaiKhoanThu.length);
            strLoaiKhoanThu = strLoaiKhoanThu.slice(0, 121);
        }
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var me = this;
        var strPhamViApDung = "";

        var strValue = $('#dropSearch_HocKy_IHD').val();
        if (strValue.length > 1 || strValue[0] != "") {
            strPhamViApDung = edu.util.getValById("dropSearch_KyThucHien_IHD");
        }
        me.getList_TongHopPhaiNop();
        if($("#tab_tongthu").is(":hidden")) return;
        var obj_list = {
            'action': 'TC_BaoCao/LayDSThuTien',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu.toString(),
            'strTaiChinh_KhoanKhac_Ids': strTaiChinh_KhoanKhac_Ids.toString(),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu'),
            'strPhamViThongKe': strPhamViApDung,
            'strDoiTuong': edu.util.getValCombo("dropSearch_DoiTuongSV"),
            'strPhanLoaiChungTu_Id': edu.util.getValCombo("dropSearch_PhanLoai"),
            'strPhanLoaiCSDT': edu.util.getValCombo("dropSearch_PhanLoaiCSDT"),
            'strNganhHoc_Id': edu.util.getValCombo("dropSearch_NganhHoc"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValCombo("dropSearch_CoSoDaoTao_IHD"),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_TongHop(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_TongHopPhaiNop: function (strTuKhoa) {
        if ($("#tab_phainop").is(":hidden")) return;
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strPhamViApDung = "";
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD');
        var strTaiChinh_KhoanKhac_Ids = "";
        if (strLoaiKhoanThu.length > 120) {
            strTaiChinh_KhoanKhac_Ids = strLoaiKhoanThu.slice(121, strLoaiKhoanThu.length);
            strLoaiKhoanThu = strLoaiKhoanThu.slice(0, 121);
        }
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        var strValue = $('#dropSearch_HocKy_IHD').val();
        if (strValue.length > 1 || strValue[0] != "") {
            strPhamViApDung = edu.util.getValById("dropSearch_KyThucHien_IHD");
        }
        var me = this;
        var obj_list = {
            'action': 'TC_BaoCao/LayDSNopTien',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu.toString(),
            'strTaiChinh_KhoanKhac_Ids': strTaiChinh_KhoanKhac_Ids.toString(),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu'),
            'strPhamViThongKe': strPhamViApDung,
            'strDoiTuong': edu.util.getValCombo("dropSearch_DoiTuongSV"),
            'strPhanLoaiChungTu_Id': edu.util.getValCombo("dropSearch_PhanLoai"),
            'strPhanLoaiCSDT': edu.util.getValCombo("dropSearch_PhanLoaiCSDT"),
            'strNganhHoc_Id': edu.util.getValCombo("dropSearch_NganhHoc"),
            'strDangKy_KeHoach_Id': edu.util.getValById('dropKeHoachDangKy_TP'),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValCombo("dropSearch_CoSoDaoTao_IHD"),
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genTable_TongHopPhaiNop(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.extend.notifyBeginLoading("Lỗi: " + data.Message, "w");
                    edu.system.alert(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.extend.notifyBeginLoading("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    delete_KetQuaPhaiNop: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThongTin_MH/GS4gHhUgKAIpKC8pHhEpICgPLjEeFSA1AiAP',
            'func': 'PKG_TAICHINH_THONGTIN.Xoa_TaiChinh_PhaiNop_TatCa',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TongHopPhaiNop();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genList_DMLKT: function (dataKhoanThu) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-4 checkbox-inline user-check-print">';
        row += '<input type="checkbox" checked="checked" style="float: left; margin-right: 5px" class="ckbLKT_RT_All"/>';
        row += '<span><b>Tất cả</b></span>';
        row += '</div>';
        for (var i = 0; i < dataKhoanThu.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-4 checkbox-inline user-check-print;">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" checked="checked" id="' + dataKhoanThu[i].ID + '" class="ckbLKT_IHD" title="' + dataKhoanThu[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + dataKhoanThu[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#zoneLoaiKhoanPhi").replaceWith(row);
        //me.getList_TongHop();
    },
    genTable_TongHop: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblKetQua";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            "aoColumns": [
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mDataProp": "MADONHANG"
                },
                {
                    "mDataProp": "CHUNGTU"
                }
                , {
                    "mDataProp": "LOAICHUNGTU"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mDataProp": "MASONGUOIHOC"
                }
                , {
                    "mDataProp": "HOTENNGUOIHOC"
                }
                , {
                    "mDataProp": "NGAYSINH"
                }
                , {
                    "mDataProp": "TRANGTHAINGUOIHOC_N1_TEN"
                }
                , {
                    "mDataProp": "LOP"
                }
                , {
                    "mDataProp": "NGANH"
                }
                , {
                    "mDataProp": "KHOADAOTAO"
                }
                , {
                    "mDataProp": "KHOAQUANLY"
                }
                , {
                    "mDataProp": "HEDAOTAO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        $("#lblTongTien").html(edu.util.formatCurrency(data[0].TONGTIEN));
        var strSoTien = to_vietnamese(data[0].TONGTIEN) + ".";
        strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
        $("#lblTongTienBangChu").html(strSoTien);
    },
    genTable_TongHopPhaiNop: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblKetQuaPhaiNop";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            "aoColumns": [{
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    //"mDataProp": "CHUNGTU",
                    "mRender": function (nRow, aData) {
                        return aData.KHONGHACHTOAN == 1 ? "Không hạch toán" : "";
                    }
                }
                , {
                    "mDataProp": "LOAICHUNGTU"
                }
                , {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                }
                , {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                }
                , {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mDataProp": "MASONGUOIHOC"
                }
                , {
                    "mDataProp": "HOTENNGUOIHOC"
                }
                , {
                    "mDataProp": "NGAYSINH"
                }
                , {
                    "mDataProp": "TRANGTHAINGUOIHOC_N1_TEN"
                }
                , {
                    "mDataProp": "LOP"
                }
                , {
                    "mDataProp": "NGANH"
                }
                , {
                    "mDataProp": "KHOADAOTAO"
                }
                , {
                    "mDataProp": "KHOAQUANLY"
                }
                , {
                    "mDataProp": "HEDAOTAO"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //let dTongTien = 0;
        //data.forEach(e => {
        //})
        $("#lblTongTien2").html(edu.util.formatCurrency(data[0].TONGTIEN));
        var strSoTien = to_vietnamese(data[0].TONGTIEN) + ".";
        strSoTien = strSoTien[1].toUpperCase() + strSoTien.substring(2);
        $("#lblTongTienBangChu2").html(strSoTien);
    },
    
    getList_BangDuLieu: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'TC_KeToan/LayDSAPI_DoiTac',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtDoiTac"] = json;
                    me.cbGenCombo_BangDuLieu(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert(data.Message);
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
    cbGenCombo_BangDuLieu: function (data) {
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
            renderPlace: ["dropSearch_BangKetNoiKeToan"],
            type: "",
            title: "Chọn bảng dữ liệu",
        }
        edu.system.loadToCombo_data(obj);
    },


    getList_CanBoXuatBaoCao: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSNguoiThucHienBC',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_CanBoXuatBaoCao(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert(data.Message);
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
    cbGenCombo_CanBoXuatBaoCao: function (data) {
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
            renderPlace: ["dropSearch_CanBoXuatBC"],
            type: "",
            title: "Chọn nguời thực hiện báo cáo",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_BangDuLieuDuocTao: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'TC_KeToan/LayDSTenBangDuLieu',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_BangDuLieuDuocTao(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert(data.Message);
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
    cbGenCombo_BangDuLieuDuocTao: function (data) {
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
            renderPlace: ["dropSearch_BangDuLieuDuocTao"],
            type: "",
            title: "Chọn bảng dữ liệu",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    save_BangDuLieu: function () {
        var me = this;
        var obj_notify = {};
        strTuKhoa = edu.util.getValById('txtSearch_DT').trim();
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD');
        var strTaiChinh_KhoanKhac_Ids = "";
        if (strLoaiKhoanThu.length > 120) {
            strTaiChinh_KhoanKhac_Ids = strLoaiKhoanThu.slice(121, strLoaiKhoanThu.length);
            strLoaiKhoanThu = strLoaiKhoanThu.slice(0, 121);
        }
        var strTrangThaiNguoiHoc_Id = edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_LHD').toString();
        if (strLoaiKhoanThu == '') {
            edu.extend.notifyBeginLoading('Vui lòng chọn khoản thu. Để có thể lấy danh sách khoản thu!', 'w');
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan/TaoDuLieuKeToanChoTungAPI',
            'type': 'POST',
            'strTAICHINH_CacKhoanThu_Ids': strLoaiKhoanThu.toString(),
            'strTaiChinh_KhoanKhac_Ids': strTaiChinh_KhoanKhac_Ids.toString(),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strThoiGianDaoTao_Id': edu.util.getValCombo('dropSearch_HocKy_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTuKhoa': strTuKhoa,
            'strNguoiDung_Id': edu.util.getValCombo('dropSearch_NguoiThu_IHD'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTrangThaiNguoiHoc_Id': strTrangThaiNguoiHoc_Id,
            'strNguoiDangNhap_Id': edu.system.userId,
            'strNamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc_IHD'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropSearch_KhoaQuanLy_IHD'),
            'strHinhThucThu_Id': edu.util.getValById('dropSearch_HinhThucThu'),
            'strPhamViThongKe': "",
            'strDoiTuong': edu.util.getValCombo("dropSearch_DoiTuongSV"),
            'strPhanLoaiChungTu_Id': edu.util.getValCombo("dropSearch_PhanLoai"),
            'strPhanLoaiCSDT': edu.util.getValCombo("dropSearch_PhanLoaiCSDT"),
            
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValCombo('dropSearch_CoSoDaoTao_IHD'),
            'strOrderBy': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById('txtSearch_DatTenBangDuLieu'),
            'strTaiChinh_Nam_BaoCao_Id': edu.util.getValById('dropSearch_NamBaoCao'),
            'strNganhHoc_Id': edu.util.getValCombo("dropSearch_NganhHoc"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_KeHoach_Id': edu.util.getValById('dropKeHoachDangKy_TP'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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
                    me.getList_BangDuLieuDuocTao();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
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

    delete_BangDuLieu: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KeToan/XoaBangDuLieuAPI',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById('dropSearch_BangDuLieuDuocTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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
                
                me.getList_BangDuLieuDuocTao();
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

            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_TangThem();
                //});
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_CotDuLieu: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'TC_KeToan/LayCauTrucHienThiDuLieuAPI',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById('dropSearch_BangDuLieuDuocTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtCot"] = json;
                    me.getList_HangDuLieu(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert(data.Message);
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
    getList_HangDuLieu: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'TC_KeToan/LayDSDuLieuAPI',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById('dropSearch_BangDuLieuDuocTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtHang"] = json;
                    me.genTable_BangDuLieu(json, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert(data.Message);
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
    genTable_BangDuLieu: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var strTable_Id = "tblBangDuLieuKetNoi";
        $("#tblBangDuLieuKetNoi thead").html(me.strHead);
        var arrDoiTuong = me.dtCot;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center">' + edu.util.returnEmpty(arrDoiTuong[j].THANHPHAN_TEN) + '</th>');
        }
        $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center"><input type="checkbox" id="chkSelectAll_BangDuLieu"></th>');
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_KetQua_ChiTiet()",
            //    iDataRow: iPager,
            //},
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "API_DOITUONGDULIEU_MA"
                },
                {
                    "mDataProp": "API_DOITUONGDULIEU_TEN"
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<div id="lbl_' + aData.ID + '_' + main_doc.BaoCao.dtDoiTuong_View[iThuTu].THANHPHAN_ID + '"></div>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                }
            );
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '" />';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        //if (data.rsNhanSu.length > 0) {
        //    edu.system.genHTML_Progress("divprogessdata", data.rsNhanSu.length * data.rsLoaiSanPham.length);
        //}
        me.getList_KetQua_BangDuLieu();
    },

    getList_KetQua_BangDuLieu: function (objHang, strCot_Id) {
        var me = this;
        //$("#divcheck_" + objHang.ID + "_" + strCot_Id).parent().addClass('border-left').addClass('td-center');
        //--Edit
        var obj_list = {
            'action': 'TC_KeToan/LayGiaTriDuLieuAPI',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strThanhPhan_Id': edu.util.getValById('dropAAAA'),
            'strTenBangDuLieu': edu.util.getValById('dropSearch_BangDuLieuDuocTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me["dtKetQuaDuLieu"] = dtResult;
                    dtResult.forEach(aData => {
                        var strKetQua = aData.THANHPHAN_GIATRI;
                        if (aData.KIEUDULIEU == "NUMBER") {
                            strKetQua = edu.util.formatCurrency(strKetQua);
                            $("#lbl_" + aData.API_DOITUONGDULIEU_ID + "_" + aData.THANHPHAN_ID).css("text-align", "right")
                        }
                        $("#lbl_" + aData.API_DOITUONGDULIEU_ID + "_" + aData.THANHPHAN_ID).html(strKetQua)
                    });
                    var arrSum = [];
                    me.dtCot.forEach((e, index) => {
                        if (e.KIEUDULIEU == "NUMBER") arrSum.push(4 + index);
                    })
                    edu.system.insertSumAfterTable("tblBangDuLieuKetNoi", arrSum);
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
            complete: function () {
                
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_CustomAPI: function (strId) {
        var me = this;
        var aDataDoiTac = me.dtDoiTac.find(e => e.ID == edu.util.getValById('dropSearch_BangKetNoiKeToan'));
        var dtDuLieu = me.dtCauTrucAPI;
        var dtDataAPI = me.dtKetQuaDuLieu.filter(e => e.API_DOITUONGDULIEU_ID == strId);
        var aDataHang = me.dtHang.find(e => e.ID == strId);
        var Nonce = edu.util.uuid();
        var strtokenJWT = window.btoa(aDataDoiTac.TAIKHOAN + ':' + aDataDoiTac.MATKHAU + ': ' + Nonce).trim();
        //--Edit
        var jsonAPI = getDeQuy(null, {});
        console.log(jsonAPI);
        var obj_save = {
            'action': 'CM_UngDung/CustomAPI',
            'type': 'POST',
            'strHost': aDataDoiTac.DIACHI_API,
            'strApi': aDataDoiTac.LINK_API,
            'strLoaiXacThuc': aDataDoiTac.LOAIXACTHUC_API,
            'strMaXacThuc': strtokenJWT,
            'strData': JSON.stringify(jsonAPI),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    //var objJson = {};
                    //var x = getDeQuy(data.Data, null, objJson);
                    //console.log(x);
                    edu.system.alert(aDataHang.API_DOITUONGDULIEU_TEN + " - " + aDataHang.API_DOITUONGDULIEU_MA + ": " + data.Data);
                }
                else {
                    edu.system.alert(aDataHang.API_DOITUONGDULIEU_TEN + " - " + aDataHang.API_DOITUONGDULIEU_MA + ":" + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function getDeQuy(strCha_Id, objJson) {
            var dtXet = dtDuLieu.filter(e => e.CHA_ID == strCha_Id);
            dtXet.forEach(e => {
                setValueJson(objJson, e);
            })
            return objJson;
        }
        function getValue(objCauTruc) {
            var strKetQua = "";
            if (objCauTruc.VALUE_API) {
                var temp = dtDataAPI.find(e => e.THANHPHAN_MA.toUpperCase() == objCauTruc.VALUE_API.toUpperCase());
                if (temp) strKetQua = temp.THANHPHAN_GIATRI;
            } else {
                strKetQua = objCauTruc.DATADEFAULT_API;
            }
            switch (objCauTruc.DATATYPE_API) {
                case "number": return strKetQua ? parseFloat(strKetQua): null
                case "object": return getDeQuy(objCauTruc.ID, {})
                case "array": return [getDeQuy(objCauTruc.ID, {})]
                default: return strKetQua;
            }

        }
        function setValueJson(objJson, objData) {
            objJson[objData.KEY_API] = getValue(objData);
        }
    },

    detele_FastAPI: function (strId) {
        var me = this;
        var aDataDoiTac = me.dtDoiTac.find(e => e.ID == edu.util.getValById('dropSearch_BangKetNoiKeToan'));
        var dtDuLieu = me.dtCauTrucAPI;
        var dtDataAPI = me.dtKetQuaDuLieu.filter(e => e.API_DOITUONGDULIEU_ID == strId);
        var aDataHang = me.dtHang.find(e => e.ID == strId);
        var Nonce = edu.util.uuid();
        var strtokenJWT = window.btoa(aDataDoiTac.TAIKHOAN + ':' + aDataDoiTac.MATKHAU + ': ' + Nonce).trim();
        //--Edit
        var jsonAPI = getDeQuy(null, {});
        console.log(jsonAPI);
        var obj_save = {
            'action': 'CM_UngDung/CustomAPI',
            'type': 'POST',
            'strHost': aDataDoiTac.DIACHI_API,
            'strApi': aDataDoiTac.LINK_API,
            'strLoaiXacThuc': aDataDoiTac.LOAIXACTHUC_API,
            'strMaXacThuc': strtokenJWT,
            'strData': JSON.stringify(jsonAPI),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    //var objJson = {};
                    //var x = getDeQuy(data.Data, null, objJson);
                    //console.log(x);
                    edu.system.alert(aDataHang.API_DOITUONGDULIEU_TEN + " - " + aDataHang.API_DOITUONGDULIEU_MA + ": " + data.Data);
                }
                else {
                    edu.system.alert(aDataHang.API_DOITUONGDULIEU_TEN + " - " + aDataHang.API_DOITUONGDULIEU_MA + ":" + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function getDeQuy(strCha_Id, objJson) {
            var dtXet = dtDuLieu.filter(e => e.CHA_ID == strCha_Id);
            dtXet.forEach(e => {
                setValueJson(objJson, e);
            })
            return objJson;
        }
        function getValue(objCauTruc) {
            var strKetQua = "";
            if (objCauTruc.VALUE_API) {
                var temp = dtDataAPI.find(e => e.THANHPHAN_MA.toUpperCase() == objCauTruc.VALUE_API.toUpperCase());
                if (temp) strKetQua = temp.THANHPHAN_GIATRI;
            } else {
                strKetQua = objCauTruc.DATADEFAULT_API;
            }
            switch (objCauTruc.DATATYPE_API) {
                case "number": return strKetQua ? parseFloat(strKetQua) : null
                case "object": return getDeQuy(objCauTruc.ID, {})
                case "array": return [getDeQuy(objCauTruc.ID, {})]
                default: return strKetQua;
            }

        }
        function setValueJson(objJson, objData) {
            objJson[objData.KEY_API] = getValue(objData);
        }
    },

    xacnhan_FastAPI: function (strId, strRe) {
        var me = this;
        var aDataDoiTac = me.dtDoiTac.find(e => e.ID == edu.util.getValById('dropSearch_BangKetNoiKeToan'));
        var dtDuLieu = me.dtCauTrucAPI;
        //var dtDataAPI = me.dtKetQuaDuLieu.filter(e => e.API_DOITUONGDULIEU_ID == strId);
        //var aDataHang = me.dtHang.find(e => e.ID == strId);
        var Nonce = edu.util.uuid();
        var strtokenJWT = window.btoa(aDataDoiTac.TAIKHOAN + ':' + aDataDoiTac.MATKHAU + ': ' + Nonce).trim();
        //--Edit
        var jsonAPI = {
            "form": dtDuLieu.find(e => e.KEY_API == "form").DATADEFAULT_API,
            "data": strId
        };
        console.log(dtDuLieu);
        console.log(jsonAPI);
        var obj_save = {
            'action': 'CM_UngDung/CustomAPI',
            'type': 'POST',
            'strHost': aDataDoiTac.DIACHI_API,
            'strApi': aDataDoiTac.LINK_API.replace("SyncData", strRe),
            'strLoaiXacThuc': aDataDoiTac.LOAIXACTHUC_API,
            'strMaXacThuc': strtokenJWT,
            'strData': JSON.stringify(jsonAPI),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    //var objJson = {};
                    //var x = getDeQuy(data.Data, null, objJson);
                    //console.log(x);
                    edu.system.alert(data.Data + edu.util.returnEmpty(data.Message));
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function getDeQuy(strCha_Id, objJson) {
            var dtXet = dtDuLieu.filter(e => e.CHA_ID == strCha_Id);
            dtXet.forEach(e => {
                setValueJson(objJson, e);
            })
            return objJson;
        }
        function getValue(objCauTruc) {
            var strKetQua = "";
            if (objCauTruc.VALUE_API) {
                var temp = dtDataAPI.find(e => e.THANHPHAN_MA.toUpperCase() == objCauTruc.VALUE_API.toUpperCase());
                if (temp) strKetQua = temp.THANHPHAN_GIATRI;
            } else {
                strKetQua = objCauTruc.DATADEFAULT_API;
            }
            switch (objCauTruc.DATATYPE_API) {
                case "number": return strKetQua ? parseFloat(strKetQua) : null
                case "object": return getDeQuy(objCauTruc.ID, {})
                case "array": return [getDeQuy(objCauTruc.ID, {})]
                default: return strKetQua;
            }

        }
        function setValueJson(objJson, objData) {
            objJson[objData.KEY_API] = getValue(objData);
        }
    },

    getList_DuLieu_ChiTiet: function () {
        var me = this;
        //var dtDuLieu = [];
        //--Edit
        var obj_list = {
            'action': 'TC_KeToan/LayDSAPI_DoiTac_ChiTiet',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById(''),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtDuLieu = dtReRult;
                    me["dtCauTrucAPI"] = dtReRult;
                    //var x = getDeQuy(null, {});
                    //console.log(x);
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

        function getDeQuy(strCha_Id, objJson) {
            var dtXet = dtDuLieu.filter(e => e.CHA_ID == strCha_Id);
            dtXet.forEach(e => {
                setValueJson(objJson, e);
            })
            return objJson;
        }
        function getValue(objCauTruc, objData) {
            var strKetQua = (objCauTruc.VALUE_API) ? objData.VALUE_API : objCauTruc.DATADEFAULT_API;
            switch (objCauTruc.DATATYPE_API) {
                case "number": return parseFloat(strKetQua)
                case "object": return getDeQuy(objCauTruc.ID, {})
                case "array": return [getDeQuy(objCauTruc.ID, {})]
                default: return strKetQua;
            }

        }
        function setValueJson(objJson, objData) {
            objJson[objData.KEY_API] = getValue(objData, null);
        }
    },
    
    save_NamTaiChinh: function (strRowId, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;
        var strId = strRowId;
        var strDaoTao_HeDaoTao_Id = edu.util.getValById('dropNamTaiChinh' + strRowId);
        if (!edu.util.checkValue(strDaoTao_HeDaoTao_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2/Them_TaiChinh_Nam_Thang_BC',
            'type': 'POST',
            'strTaiChinh_Nam_BaoCao_Id': edu.util.getValById('dropNamTaiChinh' + strRowId),
            'strNam': edu.util.getValById('txtNam' + strRowId),
            'strThang': edu.util.getValById('txtThang' + strRowId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'DKH_DangKyThi_MonThi_Chung/Sua_DangKy_Thi_HP_KH_PhamVi';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NamTaiChinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSTaiChinh_Nam_Thang_BC',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_NamTaiChinh_Data(dtResult);
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
    delete_NamTaiChinh: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TC_ThuChi2/Xoa_TaiChinh_Nam_Thang_BC',

            'strId': strIds,
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
                    me.getList_NamTaiChinh();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_HeDaoTao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_HeDaoTao/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_NamTaiChinh_Data: function (data) {
        var me = this;
        $("#tblNamTaiChinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHeKhoa_Id = data[i].ID;
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strHeKhoa_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropNamTaiChinh' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
            row += '<td><input type="text" id="txtNam' + strHeKhoa_Id + '" value="' + edu.util.returnEmpty(aData.NAM) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtThang' + strHeKhoa_Id + '" value="' + edu.util.returnEmpty(aData.THANG) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblNamTaiChinh tbody").append(row);
            me.genCombo_NamBaoCao("dropNamTaiChinh" + strHeKhoa_Id, data[i].TAICHINH_NAM_BAOCAO_ID);
        }
    },
    genHTML_NamTaiChinh: function (strHeKhoa_Id) {
        var me = this;
        var iViTri = document.getElementById("tblNamTaiChinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strHeKhoa_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropNamTaiChinh' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
        row += '<td><input type="text" id="txtNam' + strHeKhoa_Id + '" value="' + edu.util.returnEmpty(aData.NAM) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtThang' + strHeKhoa_Id + '" value="' + edu.util.returnEmpty(aData.THANG) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHeKhoa_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblNamTaiChinh tbody").append(row);
        me.genCombo_NamBaoCao("dropNamTaiChinh" + strHeKhoa_Id, "");
    },

    genCombo_NamBaoCao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtNamBaoCao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAICHINH_NAM_BAOCAO_TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn năm tài chính"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    
    save_NamBaoCao: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2/Them_TaiChinh_Nam_BaoCao',
            'type': 'POST',
            'strNam': edu.util.getValById('txtNamBaoCao'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'dHieuLuc': 0,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
                me.getList_NamBaoCao();
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NamBaoCao: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSTaiChinh_Nam_BaoCao',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me["dtNamBaoCao"] = dtResult;
                    me.genHTML_NamBaoCao_Data(dtResult);
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
    delete_NamBaoCao: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_save = {
            'action': 'TC_ThuChi2/Xoa_TaiChinh_Nam_BaoCao',
            'type': 'POST',
            'strId': edu.util.getValById('dropSearch_NamBaoCao'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.getList_NamBaoCao();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_HeDaoTao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_HeDaoTao/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_NamBaoCao_Data: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TAICHINH_NAM_BAOCAO_TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamBaoCao"],
            type: "",
            title: "Chọn năm tài chính",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    save_TaoChungTu: function (strAPI_DoiTuongDuLieu_Id, strGiaTriDuLieu) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan/CapNhatDuLieuNhomAPI',
            'type': 'GET',
            'strGiaTriDuLieu': strGiaTriDuLieu,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTuongDuLieu_Id': strAPI_DoiTuongDuLieu_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById('dropSearch_BangDuLieuDuocTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (strId == "") {
                    //    strId = data.Id;
                    //}
                    edu.system.alert("Thực hiện thành công!")
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
                //me.getList_NamBaoCao();
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: obj_save.type,

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_DuLieuXoaChungTu: function (strAPI_DoiTuongDuLieu_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KeToan/LayGiaTriDuLieuNhomAPI',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strAPI_DoiTuongDuLieu_Id': strAPI_DoiTuongDuLieu_Id,
            'strAPI_DoiTac_Id': edu.util.getValById('dropSearch_BangKetNoiKeToan'),
            'strTenBangDuLieu': edu.util.getValById('dropSearch_BangDuLieuDuocTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    dtResult.forEach(e => me.xacnhan_FastAPI([e.THANHPHAN_GIATRI], "deleteData"));
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    delete_TangThem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_ThuChi2/An_BC_BaoCaoDaThucHien',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_BaoCaoDaLuu();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_BaoCaoDaLuu: function () {
        var me = this;
        var strLoaiKhoanThu = edu.extend.getCheckedCheckBoxByClassName('ckbLKT_IHD');
        //--Edit
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSBC_BaoCaoDaThucHien',
            'type': 'GET',
            'strDauVao_HeDaoTao': edu.util.getValById('dropSearch_HeDaoTao_IHD'),
            'strDaoVao_KhoaDaoTao': edu.util.getValById('dropSearch_KhoaDaoTao_IHD'),
            'strDauVao_NganhHoc': edu.util.getValById('dropSearch_NganhHoc'),
            'strDauVao_ChuongTrinh': edu.util.getValById('dropSearch_ChuongTrinh_IHD'),
            'strDauVao_KhoaQuanLy': edu.util.getValById('dropSearch_KhoaQuanLy_IHD'),
            'strDauVao_LopQuanLy': edu.util.getValById('dropSearch_Lop_IHD'),
            'strDaoVao_HocKy': edu.util.getValById('dropSearch_HocKy_IHD'),
            'strDauVao_NguoiThu': edu.util.getValById('dropSearch_NguoiThu_IHD'),
            'strDauVao_NamNhapHoc': edu.util.getValById('dropSearch_NamNhapHoc_IHD'),
            'strDauVao_TuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDauVao_DenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strDauVao_TuKhoa': edu.util.getValById('txtSearch_DT'),
            'strDauVao_KhoanThu': strLoaiKhoanThu.toString(),
            'strNguoiThucHien_Id': edu.util.getValById('dropSearch_CanBoXuatBC'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_BaoCaoDaLuu(dtReRult, data.Pager);
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
    genTable_BaoCaoDaLuu: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBaoCaoDaLuu",
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: 1,
                bFilter: true,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_BC_XACNHANBCLUU_TEN"
                },
                {
                    "mDataProp": "DAUVAO_TENBAOCAO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        var strDuongDan = aData.DAURA_DUONGDANBAOCAO;
                        if (!strDuongDan) return "";
                        if (strDuongDan.indexOf("http") == -1) strDuongDan = edu.system.strhost + strDuongDan;
                        return '<a href="' + strDuongDan + '" target="_blank">' + aData.DAURA_DUONGDANBAOCAO + '</a>';
                    }
                },
                {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "DAUVAO_NGANHHOC_TEN"
                },
                {
                    "mDataProp": "DAUVAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOVAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAUVAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAUVAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAUVAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOVAO_HOCKY_TEN"
                },
                {
                    "mDataProp": "DAUVAO_NGUOITHU_TEN"
                },
                {
                    "mDataProp": "DAUVAO_NAMNHAPHOC_TEN"
                },
                {
                    "mDataProp": "DAUVAO_HINHTHUCTHU_TEN"
                },
                {
                    //"mDataProp": "DauVao_TuNgay_Ten --> DauVao_DenNgay_Ten "
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAUVAO_TUNGAY_TEN) + " --> " + edu.util.returnEmpty(aData.DAUVAO_TUNGAY_TEN)
                    }
                },
                {
                    "mDataProp": "DAUVAO_KHOANTHU_TEN"
                },
                {
                    "mDataProp": "DAUVAO_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi2/Them_TaiChinh_BC_XacNhanBCLuu',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_SinhVien();
            //    });
            //},
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
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
    loadBtnXacNhan: function (data) {
        //main_doc.KhoaPhanBien.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'TC_ThuChi2/LayDSTaiChinh_BC_XacNhanBCLuu',
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
                    "mDataProp": "TINHTRANG_TEN"
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


    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_MaKhachHang: function (strId) {
        var me = this;
        var aData = me.dtMaKhachHang.find(e => e.ID == strId);
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan/Them_TC_BC_KyHieu_KhoaNganh',

            //'strId': me.strTangThem_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strKyHieu': edu.util.getValById('txtKyHieu' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_TangThem/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_MaKhachHang();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_MaKhachHang2: function (strId) {
        var me = this;
        //var aData = me.dtMaKhachHang.find(e => e.ID == strId);
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan/Them_TC_BC_KyHieu_KhoaNganh',

            //'strId': me.strTangThem_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropHKKhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': strId,
            'strKyHieu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_TangThem/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
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
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_MaKhachHang();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_MaKhachHang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_KeToan/LayDSTC_BC_KyHieu_KhoaNganh',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtMaKhachHang"] = dtReRult;
                    me.genTable_MaKhachHang(dtReRult, data.Pager);
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
    delete_MaKhachHang: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_KeToan/Xoa_TC_BC_KyHieu_KhoaNganh',
            'type': 'POST',
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_MaKhachHang();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_MaKhachHang: function (data, iPager) {
        $("#lblTangThem_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblMaKhachHang",
            aaData: data,
            colPos: {
                center: [0, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MAKHOAHOC"
                },
                {
                    "mDataProp": "TENKHOAHOC"
                },
                {
                    "mDataProp": "MACHUONGTRINH"
                },
                {
                    "mDataProp": "TENCHUONGTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtKyHieu' + aData.ID + '" value="' + edu.util.returnEmpty(aData.KYHIEU) + '" name="' + edu.util.returnEmpty(aData.KYHIEU) + '" class="form-control kyhieu" />';
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


    getList_KeHoachDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy_IHD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    dtResult = data.Data;
                    me.cbGenCombo_KeHoachDangKy(dtResult);
                }
                else {
                    edu.system.alert("" + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                //edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
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

    cbGenCombo_KeHoachDangKy: function (data) {
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
            renderPlace: ["dropKeHoachDangKy_TP"],
            type: "",
            title: "Chọn kế hoạch đăng ký",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_LichBaoCao: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2_MH/DSA4BRIDIC4CIC4P',
            'func': 'PKG_TAICHINH_THUCHI2.LayDSBaoCao',
            'iM': edu.system.iM,
            'dDaDatTuDong': 1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLichBaoCao"] = dtReRult;
                    me.genTable_LichBaoCao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert( JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LichBaoCao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichBaoCao",
            aaData: data,
            colPos: {
                center: [0, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mDataProp": "LOAIBAOCAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnThongSo" id="' + aData.BAOCAO_ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "TUDONG"
                    //"mRender": function (nRow, aData) {
                    //    let strBaoCao_Id = aData.BAOCAO_ID;
                    //    var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                    //    //if (edu.util.checkValue(strDuongDan) && strDuongDan != "undefined") {
                    //    //    url_report = strDuongDan + "?id=" + strBaoCao_Id;
                    //    //}
                    //    //if (strDuongDan && strDuongDan.indexOf("http") == -1) url_report = edu.system.strhost + url_report;
                    //    return '<a class="btn btn-default" href="' + url_report +'" target="_blank" id="' + aData.BAOCAO_ID + '" title="Sửa">Chạy</a>';
                    //}
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblKetQua' + aData.BAOCAO_ID +'"></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.BAOCAO_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.getList_KetQuaBaoCao(e.BAOCAO_ID));
        /*III. Callback*/
    },

    getList_KetQuaBaoCao: function (strBaoCao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2_MH/DSA4CiQ1EDQgAyAuAiAu',
            'func': 'PKG_TAICHINH_THUCHI2.LayKetQuaBaoCao',
            'iM': edu.system.iM,
            'strBaoCao_Id': strBaoCao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    let htmlKQ = '';
                    dtReRult.forEach(e => {
                        htmlKQ += '<a class="btn btn-default" href="' + e.DUONGDANKETQUA + '" target="_blank" title="Sửa">' + e.DUONGDANKETQUA.substring(e.DUONGDANKETQUA.lastIndexOf('/') + 1) + " " + e.NGAYTAO_DD_MM_YYYY_HHMMSS +  '</a> <br/>'
                    })
                    $("#lblKetQua" + strBaoCao_Id).html(htmlKQ)
                }
                else {
                    edu.system.alert(data.Message, "s");
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

    delete_LichBaoCao: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TC_ThuChi2_MH/GS4gHgMgLgIgLh4VFR4VNAUuLyYeDSgiKQPP',
            'func': 'PKG_TAICHINH_THUCHI2.Xoa_BaoCao_TT_TuDong_Lich',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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
                me.getList_LichBaoCao();
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

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_MaKhachHang();
            //    });
            //},
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_ThongSoBaoCao: function (strBaoCao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2_MH/DSA4FSkuLyYSLgMgLgIgLgPP',
            'func': 'PKG_TAICHINH_THUCHI2.LayThongSoBaoCao',
            'iM': edu.system.iM,
            'strBaoCao_Id': strBaoCao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThongSoBaoCao"] = dtReRult;
                    me.genTable_ThongSoBaoCao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genTable_ThongSoBaoCao: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblThongSoBaoCao",
            aaData: data,
            colPos: {
                center: [0, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "DULIEU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
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
}