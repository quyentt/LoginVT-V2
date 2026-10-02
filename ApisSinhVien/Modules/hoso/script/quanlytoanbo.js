/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuanLyToanBo() { };
QuanLyToanBo.prototype = {
    dtQuanLyToanBo: [],
    strQuanLyToanBo_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    dt_HS: [],
    strId: '',
    strSinhVien_Id: '',
    strChuongTrinh_Id: '',
    dtQuanHe: [],
    bcheck: true,
    strLop_Id: '',
    strLopSV_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.pageSize_default = 10;
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "", "", me.genList_TrangThaiSV);
        //edu.extend.setTinhThanh(["txtSV_NoiSinh", "txtSV_QueQuan", "txtSV_HoKhauThuongTru"], 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        edu.system.uploadAvatar(['uploadPicture_SV'], "");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.GITI", "dropSV_GioiTinh");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropSV_DanToc");
        //edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropSV_QuocTich");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropSV_TonGiao");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.TPXT", "dropSV_HoanCanhXuatThan");
        //edu.system.loadToCombo_DanhMucDuLieu("SV.DOITUONGUUTIEN", "dropSV_DoiTuongUuTien");
        //edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropSV_DanToc");
        //edu.system.loadToCombo_DanhMucDuLieu("NS.QHGD", "", "", me.cbGetList_QuanHe, "", "HESO1");
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.TRANGTHAI", "drop_TrangThaiSV");
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.TNH", "drop_TKNH_ThuocNganHang");
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        me.getList_ThoiGianDaoTao();
        me.getList_QuanLyToanBo();
        $("#btnSearch").click(function (e) {
            me.getList_QuanLyToanBo();
        });
        $("#txtSearch_QLTB").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuanLyToanBo();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("[id$=chkSelectAll_QuanLyToanBo]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanLyToanBo" });
        });
        $("#btnDeleteQuanLyToanBo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyToanBo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessQuanLyToanBo"></div>');
                edu.system.genHTML_Progress("zoneprocessQuanLyToanBo", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var objD = edu.util.objGetOneDataInData(arrChecked_Id[i], me.dtQuanLyToanBo, "ID");
                    if (objD.length != 0)
                        me.delete_HSSV(objD.QLSV_NGUOIHOC_ID);
                    else edu.system.alert("Không tìm được sinh viên");
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        $('#dropSearch_HeDaoTao_QLTB').on('select2:select', function (e) {
            
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaDaoTao_QLTB').on('select2:select', function (e) {
            
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_ChuongTrinh_QLTB').on('select2:select', function (e) {
            
            me.getList_LopQuanLy();
            me.resetCombobox(this);
        });
        $('#dropSearch_Lop_QLTB').on('select2:select', function (e) {
            
            var x = $(this).val();
            me.resetCombobox(this);
        });
        $('#dropSearch_NguoiThu_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_KhoaQuanLy_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });
        $('#dropSearch_NamNhapHoc_QLTB').on('select2:select', function (e) {
            
            me.resetCombobox(this);
        });

        $("#zonebatdau").delegate(".ckbDSTrangThaiSV_QLTB_ALL", "click", function (e) {
            
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_QLTB").each(function () {
                this.checked = checked_status;
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_QLTB", function (addKeyValue) {
            var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblQuanLyToanBo", "checkX");
            var obj_save = {
                'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
                'strNguoiHoc_ThanhPhan_01': "",
                'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
                'strNguoiHoc_ThanhPhan_02': "",
                'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
                'strNguoiHoc_ThanhPhan_03': "",
                'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
                'strNguoiHoc_ThanhPhan_04': "",
                'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
                'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
                'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
                'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
                'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
                'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
                'strNguoiDangNhap_Id': edu.system.userId,
                'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
            };

            for (var x in obj_save) {
                addKeyValue(x, obj_save[x]);
            }
        });
        $("#txtSearch_QLTB").click(function () {
            me.getList_QuanLyToanBo();
        });
        $("#btnHSSV_Save").click(function () {
            me.save_HS();
        });
        $("#delete_HSSV").click(function () {
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HSSV(me.strSinhVien_Id);
            });
        });
        $("#tblQuanLyToanBo").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            var strSV_ID = $(this).attr("name");
            me.strLopSV_Id = strSV_ID;
            me.strSinhVien_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strSinhVien_Id, "tblQuanLyToanBo");
            // >>> Handler mới 2026-08-21: mở modal #zoneEdit qua DeXuatHoSo.openEditByPerson
            var personId = me.strSinhVien_Id;
            var aData = (me.dtQuanLyToanBo || []).find(function (x) { return x.QLSV_NGUOIHOC_ID == personId; }) || {};
            var ns = ((aData.QLSV_NGUOIHOC_NGAYSINH || '') + '').split(' ')[0].split('/');
            // API quanlytoanbo chỉ trả enrollment fields — fetch thêm SV_HoSo/LayDanhSach để có
            // GENDER_ID, DANTOC_MA, TONGIAO_MA, QUOCTICH_MA... (2026-08-21)
            var maSo = aData.QLSV_NGUOIHOC_MASO || '';
            if (maSo && window.main_doc && main_doc.DeXuatHoSo && main_doc.DeXuatHoSo.openEditByPerson) {
                edu.system.makeRequest({
                    success: function (respData) {
                        var full = {};
                        if (respData.Success && respData.Data && respData.Data.length) {
                            // Tìm record khớp MASO chính xác (LayDanhSach có thể match nhiều)
                            full = respData.Data.find(function (x) { return x.MASO === maSo || x.ID === personId; }) || respData.Data[0];
                        }
                        main_doc.DeXuatHoSo.openEditByPerson({
                            id: personId,
                            hoDem: full.HODEM || aData.QLSV_NGUOIHOC_HODEM || '',
                            ten: full.TEN || aData.QLSV_NGUOIHOC_TEN || '',
                            ngaySinh_Ngay: full.NGAYSINH_NGAY || ns[0] || '',
                            ngaySinh_Thang: full.NGAYSINH_THANG || ns[1] || '',
                            ngaySinh_Nam: full.BIRTH_YEAR || full.NGAYSINH_NAM || ns[2] || '',
                            anh: full.ANH || full.ANHCANHAN || '',
                            gioiTinh: full.GENDER_ID || '',
                            gioiTinhMa: full.GIOITINH_MA || '',
                            danTocMa: full.DANTOC_MA || '',
                            tonGiaoMa: full.TONGIAO_MA || '',
                            quocTichMa: full.QUOCTICH_MA || '',
                            aData: $.extend({}, aData, full)
                        });
                    },
                    error: function () {
                        // Fallback: dùng data cache local nếu API lỗi
                        main_doc.DeXuatHoSo.openEditByPerson({
                            id: personId,
                            hoDem: aData.QLSV_NGUOIHOC_HODEM || '',
                            ten: aData.QLSV_NGUOIHOC_TEN || '',
                            ngaySinh_Ngay: ns[0] || '',
                            ngaySinh_Thang: ns[1] || '',
                            ngaySinh_Nam: ns[2] || '',
                            aData: aData
                        });
                    },
                    type: 'GET',
                    action: 'SV_HoSo/LayDanhSach',
                    contentType: true,
                    data: {
                        action: 'SV_HoSo/LayDanhSach',
                        versionAPI: 'v1.0',
                        strTuKhoa: maSo,
                        strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '',
                        strNguoiThucHien_Id: '',
                        pageIndex: 1, pageSize: 10
                    },
                    fakedb: []
                }, false, false, false, null);
                return;
            }
            if (window.main_doc && main_doc.DeXuatHoSo && main_doc.DeXuatHoSo.openEditByPerson) {
                main_doc.DeXuatHoSo.openEditByPerson({
                    id: personId,
                    hoDem: aData.QLSV_NGUOIHOC_HODEM || aData.HODEM,
                    ten: aData.QLSV_NGUOIHOC_TEN || aData.TEN,
                    ngaySinh_Ngay: ns[0] || aData.NGAYSINH_NGAY || '',
                    ngaySinh_Thang: ns[1] || aData.NGAYSINH_THANG || '',
                    ngaySinh_Nam: ns[2] || aData.BIRTH_YEAR || aData.NGAYSINH_NAM || '',
                    anh: aData.QLSV_NGUOIHOC_ANH || aData.ANH || '',
                    gioiTinh: aData.GENDER_ID || aData.QLSV_NGUOIHOC_GIOITINH_ID || aData.GIOITINH_ID || '',
                    gioiTinhMa: aData.GIOITINH_MA || '',
                    danTocMa: aData.DANTOC_MA || '',
                    tonGiaoMa: aData.TONGIAO_MA || '',
                    quocTichMa: aData.QUOCTICH_MA || '',
                    aData: aData
                });
                return;
            }
            // Nếu DeXuatHoSo chưa load — thử load lại rồi retry, không rơi vào flow cũ
            console.warn('[QLTB v2] DeXuatHoSo missing — dynamic load dexuathoso.js + retry');
            $.getScript('Modules/hoso/script/dexuathoso.js?v=1.0.0.3', function () {
                $.getScript('Modules/hoso/script/zoneEditModal_inject.js?v=1.0.0.1', function () {
                    if (typeof DeXuatHoSo === 'function') {
                        if (!main_doc.DeXuatHoSo) {
                            main_doc.DeXuatHoSo = new DeXuatHoSo();
                            main_doc.DeXuatHoSo.init();
                        }
                        main_doc.DeXuatHoSo.openEditByPerson({
                            id: personId,
                            hoDem: aData.QLSV_NGUOIHOC_HODEM,
                            ten: aData.QLSV_NGUOIHOC_TEN,
                            ngaySinh_Ngay: ns[0] || '',
                            ngaySinh_Thang: ns[1] || '',
                            ngaySinh_Nam: ns[2] || '',
                            anh: aData.QLSV_NGUOIHOC_ANH || aData.ANH || '',
                            gioiTinh: aData.QLSV_NGUOIHOC_GIOITINH_ID || aData.GIOITINH_ID || '',
                            danToc: aData.QLSV_NGUOIHOC_DANTOC_ID || aData.DANTOC_ID || '',
                            tonGiao: aData.QLSV_NGUOIHOC_TONGIAO_ID || aData.TONGIAO_ID || '',
                            quocTich: aData.QLSV_NGUOIHOC_QUOCTICH_ID || aData.QUOCTICH_ID || '',
                            aData: aData
                        });
                    } else {
                        edu.system.alert('Không tải được module DeXuatHoSo. Kiểm tra Network tab.', 'w');
                    }
                });
            });
        });
        $("#tblQuanLyToanBo").delegate('.btnDetailQuyetDinh', 'click', function (e) {
            $('#myModalQuyetDinh').modal('show');
            var obj = edu.util.objGetOneDataInData(this.id, me.dtQuanLyToanBo, "QLSV_NGUOIHOC_ID");
            $(".SinhVienDaChon").html(obj.QLSV_NGUOIHOC_HODEM + " " + obj.QLSV_NGUOIHOC_TEN + " - " + obj.QLSV_NGUOIHOC_MASO); 
            me.getList_QuaTrinhQuyetDinh(this);
        });
        $("#tblQuanLyToanBo").delegate('.btnDetailChuyenLop', 'click', function (e) {
            $('#myModalQuaTrinh').modal('show');
            var obj = edu.util.objGetOneDataInData(this.id, me.dtQuanLyToanBo, "QLSV_NGUOIHOC_ID");
            $(".SinhVienDaChon").html(obj.QLSV_NGUOIHOC_HODEM + " " + obj.QLSV_NGUOIHOC_TEN + " - " + obj.QLSV_NGUOIHOC_MASO); 
            me.getList_QuaTrinhChuyenLop(this);
        });

        $(".btnSave_TuNhapHoSo").click(function () {
            var bcheckBatBuoc = false;
            if (edu.util.getValById("uploadPicture_SV") != $("#uploadPicture_SV").attr("name"))
            me.save_Anh();
            var dtBatBuoc = me.dtTuNhapHoSo.filter(e => e.BATBUOC == 1);
            var arrBatBuoc = [];
            var arrThem = [];
            dtBatBuoc.forEach(e => {
                if ($("#m" + e.ID).val() == "") {
                    bcheckBatBuoc = true;
                    arrBatBuoc.push(e);
                    //edu.system.alert("Hãy nhập: <span style='color: red'>" + e.TEN + "</span>");
                }
            });
            if (bcheckBatBuoc) {
                $("#tblThongBaoRangBuoc").remove();
                edu.system.alert('<table id="tblThongBaoRangBuoc"><tbody></tbody></table>');
                arrBatBuoc.forEach(e => {
                    $("#tblThongBaoRangBuoc tbody").append("<tr><td>Trường thông tin bắt buộc: </td><td style='text-align: left'><span style='color: red'>" + e.TEN + "</span></td></tr>");
                })

                return;
            }
            me.dtTuNhapHoSo.forEach(e => {
                let tpoint = $("#m" + e.ID);
                if (edu.util.returnEmpty(tpoint.val()) != tpoint.attr("name")) {
                    arrThem.push(e);
                }
            })
            if (arrThem.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
                for (var i = 0; i < arrThem.length; i++) {
                    me.save_TuNhapHoSo(arrThem[i]);
                }
            } else {
                me.getDetail_HSSV();
            }
            
        });

        $("#tblQuanLyToanBo").delegate('.btnLuuY', 'click', function (e) {
            var strId = this.id;
            me.strQuanLyToanBo_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneLuuY");
            me.getList_LuuY();
        });

        // Tài chính — mở modal chi tiết 8 khoản (2026-08-27)
        $("#tblQuanLyToanBo").delegate('.btnDetail_TaiChinh', 'click', function (e) {
            var strPersonId = this.id;
            var obj = edu.util.objGetOneDataInData(strPersonId, me.dtQuanLyToanBo, "QLSV_NGUOIHOC_ID");
            me.strHSSV_Id = strPersonId;
            $(".lblTaiChinh_SinhVien").html(edu.util.returnEmpty(obj.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(obj.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(obj.QLSV_NGUOIHOC_MASO));
            $('#myModalXemThongTinAll').modal('show');
            me.getList_KhoanPhaiNop();
            me.getList_KhoanDaNop();
            me.getList_KhoanDuocMien();
            me.getList_KhoanDaRut();
            me.getList_NoChungCacKhoan();
            me.getList_NoRiengTungKhoan();
            me.getList_DuChungCacKhoan();
            me.getList_DuRiengCacKhoan();
        });

        $("#tblLuuY").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtLuuY.find(e => e.ID == strId);
            edu.util.viewValById("txtNoiDung", data.NOIDUNG);
            edu.util.viewHTMLById("txtNoiDung", data.NOIDUNG);
            me["strLuuY_Id"] = data.ID;
            $('#myModalLuuY').modal('show');

        });
        $("#btnAdd_LuuY").click(function () {
            var data = {};
            edu.util.viewValById("txtNoiDung", data.NOIDUNG);
            edu.util.viewHTMLById("txtNoiDung", data.NOIDUNG);
            me["strLuuY_Id"] = data.ID;
            $('#myModalLuuY').modal('show');
        });
        $("#btnSave_LuuY").click(function () {
            me.save_LuuY();
        });
        $("#btnDelete_LuuY").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLuuY", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LuuY(arrChecked_Id[i]);
                }
            });
        });
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strQuanLyToanBo_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_QuanLyToanBo();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QLTB"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QLTB"),
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
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_QLTB"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_QLTB"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_QLTB"),
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
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
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
            renderPlace: ["dropSearch_HeDaoTao_QLTB"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_QLTB").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_QLTB"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_QLTB").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_QLTB"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_QLTB").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_QLTB"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_QLTB").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.QuanLyToanBo;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_QLTB"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao_QLTB").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao_QLTB"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.QuanLyToanBo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_QLTB_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_QLTB" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_QLTB").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc_QLTB"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QLTB").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy_QLTB"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_QLTB").val("").trigger("change");
    },
    getList_QuanLyToanBo: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
            //'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
            'strNamNhapHoc': edu.system.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.system.getValById('dropAAAA'),

            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'strNgayBatDau': edu.system.getValById('txtSearch_TuNgay_QLTB'),
            'strNgayKetThuc': edu.system.getValById('txtSearch_DenNgay_QLTB'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //var obj_list = {
        //    'action': 'SV_HoSoNhieuNganh/LayDanhSach',

        //    'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
        //    //'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
        //    'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
        //    'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
        //    'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
        //    'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
        //    'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
        //    'strNguoiDangNhap_Id': edu.system.userId,
        //    'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
        //    'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
        //    'pageIndex': edu.system.pageIndex_default,
        //    'pageSize': edu.system.pageSize_default,
        //};
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuanLyToanBo = dtReRult;
                    me.genTable_QuanLyToanBo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_QuanLyToanBo: function (data, iPager) {
        var me = this;
        $("#lblQuanLyToanBo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanLyToanBo",
            bPaginate: {
                strFuntionName: "main_doc.QuanLyToanBo.getList_QuanLyToanBo()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 6, 13, 14],
            },
            aoColumns: [
                {
                    "mData": "QLSV_NGUOIHOC_MASO",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa">' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</a></span>';
                    }
                },
                {
                    "mData": "QLSV_NGUOIHOC_HODEM",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa">' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + '</a></span>';
                    }
                },
                {
                    "mData": "QLSV_NGUOIHOC_TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa">' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail_TaiChinh" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Xem chi tiết tài chính"><i class="fa fa-eye color-active"></i> Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }, 
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                }, 
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "TTLL_KHICANBAOTINCHOAI_ODAU"
                },
                {
                    "mDataProp": "QLSV_QUYETDINH_SOQD"
                },
                {
                    "mDataProp": "QLSV_QUYETDINH_LYDO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetailChuyenLop" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Xem quá trình"><i class="fa fa-eye color-active"></i>Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetailQuyetDinh" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Xem quyết định"><i class="fa fa-eye color-active"></i>Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnLuuY" id="' + aData.ID + '" title="Xem quyết định"><i class="fa fa-eye color-active"></i>Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" name="' + aData.ID + '"  id="' + aData.QLSV_NGUOIHOC_ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    TaoHangDoi: function () {
        var me = this;
        var arrNguoiHoc_ThanhPhan_Ids = edu.util.getArrCheckedIds("tblQuanLyToanBo", "checkX");
        var obj_save = {
            'action': 'SV_HangDoi/TaoHangDoi_TimNguoiHoc_TuDong',

            'strTuKhoa': edu.util.getValById('txtSearch_QLTB'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiHoc_ThanhPhan_Ids_01': arrNguoiHoc_ThanhPhan_Ids.slice(0, 120).toString(),
            'strNguoiHoc_ThanhPhan_01': strNguoiHoc_ThanhPhan_01,
            'strNguoiHoc_ThanhPhan_Ids_02': arrNguoiHoc_ThanhPhan_Ids.slice(120, 240).toString(),
            'strNguoiHoc_ThanhPhan_02': strNguoiHoc_ThanhPhan_02,
            'strNguoiHoc_ThanhPhan_Ids_03': arrNguoiHoc_ThanhPhan_Ids.slice(240, 360).toString(),
            'strNguoiHoc_ThanhPhan_03': strNguoiHoc_ThanhPhan_03,
            'strNguoiHoc_ThanhPhan_Ids_04': arrNguoiHoc_ThanhPhan_Ids.slice(360, 480).toString(),
            'strNguoiHoc_ThanhPhan_04': strNguoiHoc_ThanhPhan_04,
            'strNamNhapHoc': edu.util.getValCombo('dropSearch_NamNhapHoc_QLTB'),
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_QLTB'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_QLTB'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_QLTB'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_QLTB'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_QLTB'),
            'strNguoiDangNhap_Id': edu.system.userId,
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_QLTB').toString(),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, !",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "QLTC_HangDoi.TaoHangDoi_TinhHocPhi_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "QLTC_HangDoi.TaoHangDoi_TinhHocPhi_TuDong (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
    },
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
            error: function (er) { },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HSSV: function () {
        var me = main_doc.QuanLyToanBo
        //var obj_list = {
        //    'action': 'SV_HoSo/LayDanhSach',
        //    'versionAPI': 'v1.0',

        //    'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
        //    'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
        //    'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
        //    'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
        //    'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
        //    'strNguoiThucHien_Id': "",
        //    'pageIndex': edu.system.pageIndex_default,
        //    'pageSize': edu.system.pageSize_default
        //};
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIuDykoJDQPJiAvKQPP',
            'func': 'pkg_hosohocvien.LayDanhSachHoSoNhieuNganh',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
            'strNamNhapHoc': edu.system.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.system.getValById('dropAAAA'),
            
            'strTrangThaiNguoiHoc_Id': edu.system.getValById('dropAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'strNgayBatDau': edu.system.getValById('txtSearch_TuNgay_QLTB'),
            'strNgayKetThuc': edu.system.getValById('txtSearch_DenNgay_QLTB'),
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
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HSSV: function (strId, strDaotao_Sinhvien_Lop_Id) {
        var me = main_doc.QuanLyToanBo;
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP',
            'func': 'pkg_hosohocvien.LayThongTinChiTietHoSo',
            'strDaotao_Sinhvien_Lop_Id': me.strLopSV_Id,
            'iM': edu.system.iM,
            'strId': me.strSinhVien_Id,
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
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessQuanLyToanBo", function () {
                    me.getList_QuanLyToanBo();
                });
            },
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
        var me = main_doc.QuanLyToanBo;
        edu.util.viewHTMLById("lblDSSV_NhanSu_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDSSV_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyToanBo.getList_HSSV()",
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
        var me = this;
        //Thong tin co ban
        edu.util.viewValById("uploadPicture_SV", data.ANHCANHANTUUP);
        $("#uploadPicture_SV").attr("name", edu.util.returnEmpty(data.ANHCANHANTUUP))
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANHCANHANTUUP), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_SV").attr("src", strAnh);
        edu.util.viewValById("txtSV_HoTen", data.HODEM + " " + data.TEN);
        edu.util.viewValById("txtSV_CCCD", data.CMTND_SO);
        edu.util.viewValById("txtSV_NgaySinh", data.QLSV_NGUOIHOC_NGAYSINH);
        edu.util.viewValById("txtSV_MaSinhVien", data.MASO);
        edu.util.viewValById("txtSV_LopQuanLy", data.LOP);
        edu.util.viewValById("txtSV_NganhHoc", data.NGANH + " - " + data.MANGANH);
        me.strChuongTrinh_Id = data.DAOTAO_TOCHUCCHUONGTRINH_ID;


        //edu.util.viewValById("txtSV_GioiTinh", data.GIOITINH_TEN);
        //edu.util.viewValById("txtSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_TEN);
        //edu.util.viewValById("txtSV_DanToc", data.DANTOC_TEN);
        //edu.util.viewValById("txtSV_TonGiao", data.TONGIAO_TEN);
        //edu.util.viewValById("txtSV_QuocTich", data.QUOCTICH_TEN);
        //edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_TEN);
        //edu.util.viewValById("dropSV_GioiTinh", data.GIOITINH_ID);
        //edu.util.viewValById("dropSV_DoiTuongUuTien", data.LAHOCVIEN_DOITUONG_ID);
        //edu.util.viewValById("dropSV_DanToc", data.DANTOC_ID);
        //edu.util.viewValById("dropSV_TonGiao", data.TONGIAO_ID);
        //edu.util.viewValById("dropSV_QuocTich", data.QUOCTICH_ID);
        //edu.util.viewValById("dropSV_HoanCanhXuatThan", data.THANHPHANGIADINH_ID);

        //edu.util.viewValById("txt_NgayVaoTruong", data.NGAYVAOTRUONG);
        //edu.util.viewValById("txtNgayRaTruong", data.NGAYRATRUONG);
        //edu.util.viewValById("txt_MaSoSV", data.MASO);
        //edu.util.viewValById("drop_TrangThaiSV", data.QLSV_NGUOIHOC_TRANGTHAI_ID);
        //edu.util.viewValById("txtSV_HeDaoTao", data.HEDAOTAO);
        //edu.util.viewValById("txtSV_KhoaDaoTao", data.KHOADAOTAO);
        //edu.util.viewValById("txtSV_KhoaQuanLy", data.KHOAQUANLY);
        //edu.util.viewValById("txtSV_NganhHoc", data.NGANH);
        //edu.util.viewValById("txtSV_Lop", data.LOP);
        //edu.util.viewValById("txtSV_TruongTHPT", data.DAOTAO_COCAUTOCHUC_ID);//////
        //edu.util.viewValById("txtSV_TaiKhoanNganHang", data.NGANHANG_SOTAIKHOAN);
        //edu.util.viewValById("drop_TKNH_ThuocNganHang", data.NGANHANG_THUOCNGANHANG_ID);
        //edu.util.viewValById("txtSV_ChiNhanhNganHang", data.NGANHANG_THONGTINCHINHANH);
        //edu.extend.viewTinhThanhById("txtSV_NoiSinh", data.NOISINH_TINHTHANH_ID, data.NOISINH_QUANHUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_PHUONGXAKHOIXOM);
        //edu.extend.viewTinhThanhById("txtSV_QueQuan", data.QUEQUAN_TINHTHANH_ID, data.QUEQUAN_QUANHUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_PHUONGXAKHOIXOM);
        //edu.extend.viewTinhThanhById("txtSV_HoKhauThuongTru", data.HOKHAU_TINHTHANH_ID, data.HOKHAU_QUANHUYEN_ID, data.HOKHAU_XA_ID, data.HOKHAU_PHUONGXAKHOIXOM);
        //edu.util.viewValById("txtSV_NoiOHienNay", data.NOIOHIENNAY);
        //edu.util.viewValById("txtSV_DiaChiBaoTin", data.TTLL_KHICANBAOTINCHOAI_ODAU);
        //edu.util.viewValById("txtSV_Email", data.TTLL_EMAILCANHAN);
        //edu.util.viewValById("txtSV_DienThoaiCaNhan", data.TTLL_DIENTHOAICANHAN);
        //edu.util.viewValById("txtSV_LinkFB", data.DANG_NGAYVAO);
        //edu.util.viewValById("txtSV_SCC_So", data.CMTND_SO);
        //edu.util.viewValById("txtSV_SCC_NgayCap", data.CMTND_NGAYCAP);
        //edu.util.viewValById("txtSV_SCC_NoiCap", data.CMTND_NOICAP);
        //edu.util.viewValById("txtSV_NgayVaoDoan", data.DANGDOAN_NGAYVAODOAN);
        //edu.util.viewValById("txtSV_NgayVaoDang", data.DANGDOAN_NGAYVAODANG);
        //edu.util.viewValById("txtSV_NgayVaoDangChinhThuc", data.DANGDOAN_NGAYCHINHTHUCVAODANG);
        //edu.util.viewValById("txtCoQuanCongTac", data.COQUANCONGTAC);
        //edu.util.viewValById("txtMaSoThue", data.MASOTHUECANHAN);
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
        main_doc.QuanLyToanBo.dtQuanHe = data;
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
    getList_QuaTrinhQuyetDinh: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var obj_list = {
            'action': 'SV_QuyetDinh_NguoiHoc/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': point.id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuaTrinhQuyetDinh(dtReRult);
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
    genTable_QuaTrinhQuyetDinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                },
                {
                    "mDataProp": "NGUYENNHAN_LYDO"
                },
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                },
                {
                    "mDataProp": "DSKETQUANHIEUKY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_QuaTrinhChuyenLop: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var obj_list = {
            'action': 'SV_HoatDong_ThayDoi/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': point.id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuaTrinhChuyenLop(dtReRult);
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
    genTable_QuaTrinhChuyenLop: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuaTrinh",
            aaData: data,
            colPos: {
                center: [0,2, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_LOPCU_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPMOI_TEN"
                },
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_TabThongTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/DSA4BRIVICMVKS4vJhUoLw8mNC4oCS4i',
            'func': 'pkg_hosohocvien_quyen.LayDSTabThongTinNguoiHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTabThongTin"] = dtReRult;
                    me.genTable_TabThongTin(dtReRult, data.Pager);
                    me.getList_ThongTin();
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
    genTable_TabThongTin: function (data, iPager) {
        var me = this;
        let html = '';
        data.forEach(aData => {
            html += '<div class="row">';
            html += '<p class="group-title-name"><span class="badge bg-blue">' + edu.util.returnEmpty(aData.TAB_THONGTIN_TEN) + '</span></p>';
            html += '</div>';
            html += '<div class="row">';
            html += '<div class="col-sm-12 scroll-table-x">';
            html += '<table id="tbl' + aData.ID +'" class="table table-hover table-bordered">';
            html += '<thead>';
            html += '<tr>';
            html += '<th class="td-fixed td-center">Stt</th>';
            html += '<th class="td-center"  style="width: 400px">Thuộc nhóm</th>';
            html += '<th class="td-center"  style="width: 400px">Tên thông tin</th>';
            html += '<th class="td-center">Dữ liệu cần nhập</th>';
            html += '</tr>';
            html += '</thead>';
            html += '<tbody></tbody>';
            html += '</table>';
            html += '</div>';
            html += '</div>';
        })
        $("#zoneTab").html(html);
    },

    getList_ThongTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/DSA4BRIJLhIuAikuESkkMQIDDykgMQPP',
            'func': 'pkg_hosohocvien_quyen.LayDSHoSoChoPhepCBNhap',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThongTin"] = dtReRult;
                    me["dtTuNhapHoSo"] = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
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
    genTable_ThongTin: function (data, iPager) {
        var me = this;
        me.dtTabThongTin.forEach(aTab => {
            let html = '';
            let dtThongTin = data.filter(e => e.TAB_THONGTIN_ID == aTab.ID);
            dtThongTin.forEach((aData, nRow) => {
                html += '<tr>';
                html += '<td class="td-fixed td-center">' + (nRow + 1)+'</td>';
                html += '<td class="">' + edu.util.returnEmpty(aData.THUOCNHOM) + '</td>';
                html += '<td class="">' + edu.util.returnEmpty(aData.TEN);
                html += aData.BATBUOC == 1 ? '<span style="color: red"> *</span>' : '';
                html +='</td>';
                html += '<td class="">' + geninput(aData) + '</td>';
                html += '</tr>';
            })
            $("#tbl" + aTab.ID + " tbody").html(html);
            if (dtThongTin.length) edu.system.actionRowSpan("tbl" + aTab.ID, [1]);
        });

        var arrFile = [];
        data.forEach(aData => {
            if (aData.KIEUDULIEU) {
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "LIST": {
                        if (aData.MABANGDANHMUC) {
                            edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "m" + aData.ID);
                            $("#m" + aData.ID).select2();
                        }
                    }; break;
                    case "FILE": edu.system.uploadFiles(["m" + aData.ID]); break;
                    case "TINH": {
                        var objHuyen = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "HUYEN"));
                        var objXa = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "XA"));

                        var strTinh_Id = "m" + aData.ID;
                        var strHuyen_Id = objHuyen ? "m" + objHuyen.ID : "";
                        var strXa_Id = objXa ? "m" + objXa.ID : "";
                        $("#" + strTinh_Id).select2();
                        if (strHuyen_Id) $("#" + strHuyen_Id).select2();
                        if (strXa_Id) $("#" + strXa_Id).select2();

                        var strTinh = me.getGiaTri(aData);
                        var strHuyen = objHuyen ? me.getGiaTri(objHuyen) : "";
                        var strXa = strXa_Id ? me.getGiaTri(objXa) : "";

                        edu.extend.genDropTinhThanh(strTinh_Id, strHuyen_Id, strXa_Id, strTinh, strHuyen, strXa);
                    }; break;
                }
            }
            arrFile.push("txtFileDinhKem" + aData.ID);
        });

        //edu.system.uploadFiles(arrFile);
        setTimeout(function () {
            data.forEach(aData => {
                if (aData.KIEUDULIEU) {

                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "LIST": {
                            $("#m" + aData.ID).val(me.getGiaTri(aData)).trigger("change");
                        }; break;
                        case "FILE": edu.system.viewFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files"); break;
                    }
                }
                //edu.system.viewFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
            });
        }, 1000);
        edu.system.pickerdate();
        edu.system.pickerNumber();

        function geninput(aData) {
            if (aData.KIEUDULIEU) {
                var strLoai = 'input';
                var strDuocSua = (aData.DUOCSUA === 0 ? 'readonly="readonly"' : '');
                var strDoDai = (aData.DORONG) ? 'height: ' + aData.DORONG + 'px' : '';
                if (aData.DORONG) strLoai = "textarea";
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "TEXT": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' name="' + me.getGiaTri(aData) + '"/>';
                    case "NUMBER": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control input-number" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' name="' + me.getGiaTri(aData) + '"/>';
                    case "DATE": return '<input id="m' + aData.ID + '"  class="form-control input-datepicker" value="' + me.getGiaTri(aData) + '" ' + strDuocSua + ' name="' + me.getGiaTri(aData) + '" />';
                    case "TINH":
                    case "HUYEN":
                    case "XA":
                    case "LIST":
                        return '<select id="m' + aData.ID + '" class="form-select select-opt" name="' + me.getGiaTri(aData) + '"></select>';
                    case "FILE": return '<div id="m' + aData.ID + '" name="' + me.getGiaTri(aData) + '"></div>';
                    //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
                }
            }
        }
    },
    getGiaTri: function (aData) {
        var me = this;
        return edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI);
        //return edu.util.returnEmpty(aData.THONGTINXACMINH);
    },
    
    save_TuNhapHoSo: function (aData) {
        var me = this;
        var obj_notify = {};
        var strTruongThongTin_GiaTri = aData.TRUONGTHONGTIN_GIATRI;
        var strThongTinXacMinh = aData.THONGTINXACMINH;
        if (me.bcheck) strTruongThongTin_GiaTri = $("#m" + aData.ID).val();
        else strThongTinXacMinh = $("#m" + aData.ID).val();
        if (aData.KIEUDULIEU.toUpperCase() == "FILE") {
            edu.system.saveFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files");
        }

        //--Edit
        var obj_save = {
            'action': 'SV_HoSoHocVien_Quyen_MH/FSkkLB4QDRIXHgokCS4gIikeBTQNKCQ0',
            'func': 'pkg_hosohocvien_quyen.Them_QLSV_KeHoach_DuLieu',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTruongThongTin_Id': aData.ID,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'strThongTinXacMinh': strThongTinXacMinh,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");

                    //edu.system.saveFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThongTin();
                    me.getDetail_HSSV();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Anh: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/EjQgHhANEhceDyY0LigJLiIecAPP',
            'func': 'pkg_hosohocvien.Sua_QLSV_NguoiHoc_1',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strAnh': edu.util.getValById('uploadPicture_SV'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    
    getList_LuuY: function (strDanhSach_Id) {
        var me = this;
        let aData = me.dtQuanLyToanBo.find(e => e.ID == me.strQuanLyToanBo_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_HSSV_ThongTin_MH/DSA4BRIQDRIXHhUpLi8mFSgvHgIgMQ8pIDUP',
            'func': 'PKG_HOSOSINHVIEN_THONGTIN.LayDSQLSV_ThongTin_CapNhat',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLuuY"] = dtReRult;
                    me.genTable_LuuY(dtReRult, data.Pager);
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
    genTable_LuuY: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLuuY",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "NOIDUNG",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA);
                    }
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAY_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGAYCUOI_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOICUOI_TAIKHOAN"
                },
                
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" name="' + aData.ID + '"  id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_LuuY: function () {
        var me = this;
        var obj_notify = {};
        let aData = me.dtQuanLyToanBo.find(e => e.ID == me.strQuanLyToanBo_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_HSSV_ThongTin_MH/FSkkLB4QDRIXHhUpLi8mFSgvHgIgMQ8pIDUP',
            'func': 'PKG_HOSOSINHVIEN_THONGTIN.Them_QLSV_ThongTin_CapNhat',
            'iM': edu.system.iM,
            'strId': me.strLuuY_Id,
            'strNoiDung': edu.system.getValById('txtNoiDung'),
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_HSSV_ThongTin_MH/EjQgHhANEhceFSkuLyYVKC8eAiAxDykgNQPP';
            obj_save.func = 'PKG_HOSOSINHVIEN_THONGTIN.Sua_QLSV_ThongTin_CapNhat'
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
                    me.getList_LuuY();
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_LuuY: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HSSV_ThongTin_MH/GS4gHhANEhceFSkuLyYVKC8eAiAxDykgNQPP',
            'func': 'PKG_HOSOSINHVIEN_THONGTIN.Xoa_QLSV_ThongTin_CapNhat',
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
                    me.getList_LuuY();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*==============================================================
    == Chi tiết tài chính (2026-08-27) — port từ inbangdiem.js
    ==   8 API `TC_ThongTinChung/LayDSKhoan*` (chung backend, versionAPI v1.0)
    ==   render vào modal #myModalXemThongTinAll
    ==============================================================*/
    getList_KhoanPhaiNop: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanPhaiNop',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanPhaiNop_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDuocMien: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanMien',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanDuocMien_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaNop: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaNop',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanDaNop_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_KhoanDaRut: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDaRut',
            'versionAPI': 'v1.0',
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanDaRut_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_NoRiengTungKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanNoRieng',
            'versionAPI': 'v1.0',
            'pageIndex': 1, 'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanPhaiNopRieng_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_NoChungCacKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanNoChung',
            'versionAPI': 'v1.0',
            'pageIndex': 1, 'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanPhaiNopChung_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_DuRiengCacKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDuRieng',
            'versionAPI': 'v1.0',
            'pageIndex': 1, 'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanThuaRieng_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },
    getList_DuChungCacKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_ThongTinChung/LayDSKhoanDuChung',
            'versionAPI': 'v1.0',
            'pageIndex': 1, 'pageSize': 1000000000,
            'strQLSV_NguoiHoc_Id': me.strHSSV_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) { if (data.Success) me.genChiTietKhoanThuaChung_XemThongTinAll(data.Data); },
            error: function () { },
            type: "GET", versionAPI: "v1.0", contentType: true,
            action: obj_list.action, data: obj_list, fakedb: []
        }, false, false, false, null);
    },

    genChiTietKhoanPhaiNop_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanPhaiNop_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-right">Số tiền</th><th class="td-center">Ngày tạo</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [2, 3], right: [4] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } },
                { "mDataProp": "NGAYTAO_DD_MM_YYYY" }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [4]);
            $('#' + $table + ' tfoot td:eq(4)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDaNop_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanDaNop_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-right">Số tiền</th><th class="td-center">Số chứng từ</th><th class="td-center">Ngày tạo</th><th class="td-center">Người tạo</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [2, 3], right: [4] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } },
                { "mDataProp": "CHUNGTU_SO" },
                { "mDataProp": "NGAYTAO_DD_MM_YYYY" },
                { "mDataProp": "NGUOITAO_TENDAYDU" }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [4]);
            $('#' + $table + ' tfoot td:eq(4)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDuocMien_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanDuocMien_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-left">Nội dung</th><th class="td-right">Số tiền được miễn</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [3, 4], right: [5] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "NOIDUNG", "mRender": function (nRow, aData) { return '<span title="' + edu.util.returnEmpty(aData.NOIDUNG) + '">' + (edu.extend && edu.extend.removeNoiDungDai ? edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) : edu.util.returnEmpty(aData.NOIDUNG)) + '</span>'; } },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanDaRut_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanDaRut_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-left">Nội dung</th><th class="td-right">Số tiền</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [3, 4], right: [5] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "NOIDUNG", "mRender": function (nRow, aData) { return '<span title="' + edu.util.returnEmpty(aData.NOIDUNG) + '">' + (edu.extend && edu.extend.removeNoiDungDai ? edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) : edu.util.returnEmpty(aData.NOIDUNG)) + '</span>'; } },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanPhaiNopChung_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanPhaiNopChung_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-left">Nội dung</th><th class="td-right">Số tiền</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [3, 4], right: [5] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "NOIDUNG", "mRender": function (nRow, aData) { return '<span title="' + edu.util.returnEmpty(aData.NOIDUNG) + '">' + (edu.extend && edu.extend.removeNoiDungDai ? edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) : edu.util.returnEmpty(aData.NOIDUNG)) + '</span>'; } },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanPhaiNopRieng_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanPhaiNopRieng_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-left">Nội dung</th><th class="td-right">Số tiền</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [3, 4], right: [5] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "NOIDUNG", "mRender": function (nRow, aData) { return '<span title="' + edu.util.returnEmpty(aData.NOIDUNG) + '">' + (edu.extend && edu.extend.removeNoiDungDai ? edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) : edu.util.returnEmpty(aData.NOIDUNG)) + '</span>'; } },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanThuaChung_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanThuaChung_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-left">Nội dung</th><th class="td-right">Số tiền</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [1, 2] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "NOIDUNG", "mRender": function (nRow, aData) { return '<span title="' + edu.util.returnEmpty(aData.NOIDUNG) + '">' + (edu.extend && edu.extend.removeNoiDungDai ? edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) : edu.util.returnEmpty(aData.NOIDUNG)) + '</span>'; } },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
    genChiTietKhoanThuaRieng_XemThongTinAll: function (data) {
        var $table = "tblChiTietKhoanThuaRieng_XemThongTinAll";
        $("#" + $table + " thead").html('<tr><th class="td-center td-fixed">Stt</th><th class="td-center">Học kỳ</th><th class="td-center">Đợt</th><th class="td-left">Loại khoản</th><th class="td-left">Nội dung</th><th class="td-right">Số tiền</th></tr>');
        $("#" + $table + " tbody").html('');
        $("#" + $table + " tfoot").html('');
        edu.system.loadToTable_data({
            strTable_Id: $table, aaData: data,
            colPos: { left: [3, 4] },
            aoColumns: [
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO" },
                { "mDataProp": "DAOTAO_THOIGIANDAOTAO_DOT" },
                { "mDataProp": "TAICHINH_CACKHOANTHU_TEN" },
                { "mData": "NOIDUNG", "mRender": function (nRow, aData) { return '<span title="' + edu.util.returnEmpty(aData.NOIDUNG) + '">' + (edu.extend && edu.extend.removeNoiDungDai ? edu.extend.removeNoiDungDai(aData.NOIDUNG, aData.SOTIEN) : edu.util.returnEmpty(aData.NOIDUNG)) + '</span>'; } },
                { "mData": "SOTIEN", "mRender": function (nRow, aData) { return edu.util.formatCurrency(aData.SOTIEN); } }
            ]
        });
        if (data != null && data.length > 0) {
            edu.system.insertSumAfterTable($table, [5]);
            $('#' + $table + ' tfoot td:eq(5)').attr('style', 'text-align: right');
        }
    },
};

/*==============================================================================
== SELF-CONTAINED FALLBACK (2026-08-21)
== Nếu server chưa deploy dexuathoso.js mới + zoneEditModal_inject.js:
==   1) Inject modal #zoneEdit HTML+CSS trực tiếp
==   2) Patch DeXuatHoSo.prototype.openEditByPerson + _loadXHD_Section
==============================================================================*/

// ---- 1) Inject modal #zoneEdit + CSS (idempotent) ----
(function () {
    if (document.getElementById('zoneEdit')) return;
    var css = ''
        /* Compact centered modal (2026-08-28) — smaller than full-viewport, van co margin quanh de thay backdrop
           :not(.ze-inline) — inline mode van dung .ze-inline rule (position:static, display:block) khong bi de */
        + '#zoneEdit.fake-modal:not(.ze-inline){position:fixed !important;top:3vh !important;left:50% !important;right:auto !important;bottom:auto !important;transform:translateX(-50%) !important;width:88vw !important;max-width:1280px !important;height:auto !important;max-height:94vh !important;overflow:hidden !important;z-index:2147483000 !important;background:#ffffff !important;border-radius:10px !important;box-shadow:0 25px 70px rgba(15,23,42,.45) !important;padding:0 !important;flex-direction:column !important;}'
        + 'body.zoneEdit-open #zoneEdit.fake-modal:not(.ze-inline){display:flex !important;}'
        + 'body.zoneEdit-open::before{content:"";position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:2147482900;pointer-events:auto;}'
        + 'body.zoneEdit-open{overflow:hidden;}'
        /* CHI boost select2 dropdown DANG MO (--open) + popup dropdown (.select2-dropdown, append vao <body>)
           KHONG boost .select2-container tinh (container dong o trang nen) — neu boost tinh se de "xuyen"
           qua modal vi container tinh cua trang nen van nam trong luong DOM binh thuong (2026-08-28 fix) */
        + 'body.zoneEdit-open .select2-container--open,body.zoneEdit-open .select2-dropdown{z-index:2147483100 !important;}'
        /* Modal thông báo/confirm của hệ thống (BS3, z-index mặc định ~1050) bị #zoneEdit (2147483000)
           che mất → user bấm Lưu không thấy báo gì. Đẩy lên trên #zoneEdit khi modal này đang mở. */
        + 'body.zoneEdit-open #myModalAlert,body.zoneEdit-open #myModalConfirm{z-index:2147483200 !important;}'
        + 'body.zoneEdit-open #myModalAlert ~ .modal-backdrop,body.zoneEdit-open .modal-backdrop.in{z-index:2147483150 !important;}'
        /* Dam bao modal luon interactive */
        + '#zoneEdit.fake-modal *{pointer-events:auto;}'
        /* Flex layout: header + tabbar (top, co dinh) — pane active (giua, scroll) — footer (duoi, sticky) */
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;min-height:0 !important;height:100% !important;box-shadow:none !important;border-radius:0 !important;overflow:hidden !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .box-header{flex:0 0 auto !important;border-radius:10px 10px 0 0 !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .zoneEdit-tabbar{flex:0 0 auto !important;position:static !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .zoneEdit-pane{min-height:0;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .zoneEdit-pane.active{flex:1 1 auto !important;min-height:0 !important;overflow-y:auto !important;overflow-x:hidden !important;}'
        /* Footer container-fluid cuoi cung (chua Dong/Luu) — sticky duoi, luon visible */
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish > .container-fluid:last-child{flex:0 0 auto !important;background:#ffffff !important;border-top:1px solid #e2e8f0 !important;box-shadow:0 -2px 12px rgba(15,23,42,.06) !important;padding:12px 24px !important;margin:0 !important;z-index:5 !important;border-radius:0 0 10px 10px !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish > .container-fluid:last-child > hr{display:none !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish > .container-fluid:last-child .d-flex.align-items-center.mt-4{padding:0 !important;margin:0 !important;}'
        + '#zoneEdit .box-shadow.register-wish{box-shadow:none !important;border-radius:12px !important;padding:0 !important;}'
        + '#zoneEdit .box-header{background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);color:#fff !important;border-radius:12px 12px 0 0;margin:0 !important;padding:14px 24px !important;min-height:56px;display:flex !important;align-items:center;justify-content:center !important;position:relative;}'
        + '#zoneEdit .box-header .nav-content-left{text-align:center;margin:0 auto;}'
        + '#zoneEdit .box-header .nav-content-left p.link{margin:0;padding:0;}'
        + '#zoneEdit .box-header .nav-content-left a,#zoneEdit .box-header .zeIcon,#zoneEdit .box-header .zeIcon i{color:#fff !important;font-size:16px;font-weight:600;text-decoration:none;}'
        + '#zoneEdit #zeHeaderBadge{display:inline-flex;flex-wrap:wrap;gap:6px 10px;margin-top:6px;justify-content:center;}'
        + '#zoneEdit #zeHeaderBadge:empty{display:none;}'
        + '#zoneEdit #zeHeaderBadge .ze-chip{display:inline-flex;align-items:center;padding:3px 10px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);border-radius:20px;color:#fff !important;font-size:12.5px;font-weight:500;line-height:1.4;white-space:nowrap;max-width:340px;overflow:hidden;text-overflow:ellipsis;}'
        + '#zoneEdit #zeHeaderBadge .ze-chip b{margin-right:4px;font-weight:600;opacity:.85;}'
        + '#zoneEdit .box-header .nav-content-right{position:absolute;right:12px;top:50%;transform:translateY(-50%);margin:0 !important;}'
        + 'body #zoneEdit .box-header .nav-content-right a.btnClose,body #zoneEdit .box-header a.btnClose{background:rgba(255,255,255,.18) !important;background-color:rgba(255,255,255,.18) !important;background-image:none !important;color:#fff !important;border:none !important;border-radius:50% !important;width:34px !important;height:34px !important;min-width:34px !important;line-height:34px !important;padding:0 !important;margin:0 !important;display:inline-flex !important;align-items:center;justify-content:center;font-size:15px !important;cursor:pointer;transition:background .15s;text-align:center !important;box-shadow:none !important;}'
        + 'body #zoneEdit .box-header a.btnClose:hover{background:rgba(255,255,255,.32) !important;background-color:rgba(255,255,255,.32) !important;}'
        + 'body #zoneEdit .box-header a.btnClose i{color:#fff !important;font-size:15px !important;}'
        + '#zoneEdit .box-header .btnClose::after,#zoneEdit .box-header .btnClose::before{content:none !important;}'
        + '#zoneEdit .box-header .btnClose > *:not(i){display:none !important;}'
        + '#zoneEdit .form-top{padding:20px 24px 8px 24px !important;margin-bottom:0 !important;border-top:none !important;}'
        + '#zoneEdit .form-item{margin-bottom:12px !important;align-items:center;}'
        + '#zoneEdit .form-item .form-label{width:170px !important;font-weight:500;color:#334155;font-size:14px;margin-bottom:0;}'
        + '#zoneEdit .form-item .input-group{flex:1;}'
        + '#zoneEdit .form-control,#zoneEdit .select-opt + .select2-container .select2-selection{border:1px solid #cbd5e1 !important;border-radius:6px !important;padding:8px 12px !important;font-size:14px !important;min-height:38px !important;color:#0f172a !important;}'
        + '#zoneEdit .form-control:focus{border-color:#2563eb !important;box-shadow:0 0 0 3px rgba(37,99,235,.15) !important;outline:none;}'
        + '#zoneEdit #txtHoVaTen[readonly]{background:#f1f5f9 !important;color:#475569 !important;}'
        + '#zoneEdit .sv-info-profile{display:flex;justify-content:center;align-items:flex-start;padding-top:4px;}'
        + '#zoneEdit .avata-img{position:relative;width:220px;height:220px;border-radius:12px;overflow:hidden;background:#f1f5f9;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;}'
        + '#zoneEdit .avata-img img{width:100%;height:100%;object-fit:cover;border-radius:12px;}'
        + '#zoneEdit .avata-img .upload-avata{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;color:#fff !important;box-shadow:0 4px 12px rgba(37,99,235,.4);text-decoration:none;}'
        + '#zoneEdit .avata-img .upload-avata i{color:#fff !important;}'
        + '#zoneEdit .container-fluid{padding:8px 24px !important;}'
        + '#zoneEdit .text-success{color:#059669 !important;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;}'
        + '#zoneEdit #tblDinhDanh,#zoneEdit #tblLienHe{border:1px solid #e2e8f0 !important;border-radius:6px;overflow:hidden;}'
        + '#zoneEdit #tblDinhDanh thead th,#zoneEdit #tblLienHe thead th{background:#f8fafc !important;color:#334155 !important;font-size:12.5px;font-weight:600;text-transform:uppercase;padding:10px 8px !important;border-bottom:1px solid #e2e8f0 !important;vertical-align:middle;}'
        + '#zoneEdit #tblDinhDanh tbody td,#zoneEdit #tblLienHe tbody td{padding:10px 8px !important;vertical-align:middle;border-bottom:1px solid #f1f5f9 !important;}'
        + '#zoneEdit #tblDinhDanh tbody td input,#zoneEdit #tblLienHe tbody td input{border:1px solid #cbd5e1 !important;border-radius:4px !important;padding:6px 10px !important;font-size:13.5px !important;width:100%;}'
        + '#zoneEdit #tblDinhDanh tbody td input:focus,#zoneEdit #tblLienHe tbody td input:focus{border-color:#2563eb !important;box-shadow:0 0 0 2px rgba(37,99,235,.1) !important;}'
        + '#zoneEdit hr{margin:8px 0 !important;border-color:#e2e8f0;}'
        + '#zoneEdit .d-flex.align-items-center.mt-4{padding:12px 8px 4px 8px;}'
        + '#zoneEdit .btn.btnClose:not(.box-header .btnClose){background:#fff !important;color:#475569 !important;border:1px solid #cbd5e1 !important;padding:8px 20px !important;border-radius:6px !important;font-weight:500;cursor:pointer;}'
        + '#zoneEdit .btn.btnClose:not(.box-header .btnClose):hover{background:#f1f5f9 !important;}'
        + '#zoneEdit #btnSave_DeXuatHoSo{background:#2563eb !important;color:#fff !important;border:1px solid #2563eb !important;padding:8px 28px !important;border-radius:6px !important;font-weight:600;cursor:pointer;box-shadow:0 2px 6px rgba(37,99,235,.25);}'
        + '#zoneEdit #btnSave_DeXuatHoSo:hover{background:#1d4ed8 !important;border-color:#1d4ed8 !important;}'
        + '#zoneEdit .aps-gap-10{display:flex;gap:10px;}'
        + '#zoneEdit .zoneEdit-tabbar{display:flex;gap:4px;padding:0 24px;background:#fff;border-bottom:2px solid #e2e8f0;margin-top:0;position:sticky;top:0;z-index:5;}'
        + '#zoneEdit .zoneEdit-tab{padding:12px 20px;font-size:14px;font-weight:600;color:#64748b;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .15s;white-space:nowrap;display:flex;align-items:center;gap:8px;}'
        + '#zoneEdit .zoneEdit-tab i{font-size:15px;}'
        + '#zoneEdit .zoneEdit-tab:hover{color:#2563eb;background:#f8fafc;}'
        + '#zoneEdit .zoneEdit-tab.active{color:#2563eb;border-bottom-color:#2563eb;background:#eff6ff;}'
        + '#zoneEdit .zoneEdit-pane{display:none;animation:zoneEditFadeIn .2s;}'
        + '#zoneEdit .zoneEdit-pane.active{display:block;}'
        + '@keyframes zoneEditFadeIn{from{opacity:0;}to{opacity:1;}}'
        + '#zoneEdit .ze-form{--aps-sv-primary:#2563eb;--aps-sv-primary-soft:#eaf1ff;--aps-sv-border:#e2e8f0;--aps-sv-label:#475569;--aps-sv-text:#0f172a;--aps-sv-radius:5px;padding:24px 28px !important;}'
        + '#zoneEdit .ze-form .aps-sv-section + .aps-sv-section{margin-top:24px;}'
        + '#zoneEdit .ze-form .aps-sv-section-title{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:700;color:var(--aps-sv-primary);text-transform:uppercase;letter-spacing:.3px;margin:6px 0 18px;}'
        + '#zoneEdit .ze-form .aps-sv-section-title::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--aps-sv-border),transparent);}'
        + '#zoneEdit .ze-form .aps-sv-section-title i{color:var(--aps-sv-primary);}'
        + '#zoneEdit .ze-form .aps-sv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 26px;}'
        + '@media (max-width:900px){#zoneEdit #zoneXHD .aps-sv-grid{grid-template-columns:1fr;}}'
        + '#zoneEdit .ze-form .aps-sv-field.aps-sv-col-full{grid-column:1 / -1;}'
        + '#zoneEdit .ze-form .aps-sv-label{display:block;font-size:13px;font-weight:600;color:var(--aps-sv-label);margin-bottom:7px;}'
        + '#zoneEdit .ze-form .aps-sv-input{width:100%;height:38px;padding:0 14px;font-size:14px;color:var(--aps-sv-text) !important;background:#fff;border:1px solid var(--aps-sv-border) !important;border-radius:var(--aps-sv-radius) !important;transition:border-color .15s,box-shadow .15s;outline:none;box-sizing:border-box;}'
        + '#zoneEdit .ze-form .aps-sv-input::placeholder{color:#94a3b8;}'
        + '#zoneEdit .ze-form .aps-sv-input:focus{border-color:var(--aps-sv-primary) !important;box-shadow:0 0 0 3px rgba(37,99,235,.14) !important;}'
        + '#zoneEdit .ze-form .aps-sv-select{position:relative;}'
        + '#zoneEdit .ze-form .aps-sv-select select.aps-sv-input{appearance:none;-webkit-appearance:none;padding-right:38px;cursor:pointer;}'
        + '#zoneEdit .ze-form .aps-sv-select > i{position:absolute;right:15px;top:50%;transform:translateY(-50%);pointer-events:none;color:#94a3b8;font-size:13px;}'
        + '#zoneEdit .ze-form .aps-sv-input-icon{position:relative;}'
        + '#zoneEdit .ze-form .aps-sv-input-icon > i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:14px;}'
        + '#zoneEdit .ze-form .aps-sv-input-icon .aps-sv-input{padding-left:40px;}'
        + '#zoneEdit .ze-form .aps-sv-input.ze-readonly,#zoneEdit .ze-form .aps-sv-input[readonly]{background:#f1f5f9 !important;color:#475569 !important;}'
        + '#zoneEdit .ze-canhan-layout{display:grid;grid-template-columns:1fr 220px;gap:24px;align-items:start;}'
        + '@media (max-width:900px){#zoneEdit .ze-canhan-layout{grid-template-columns:1fr;}}'
        + '#zoneEdit .ze-canhan-avatar{align-self:start;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img{margin:0;width:200px;height:200px;overflow:hidden;position:relative;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img fieldset{border:none !important;padding:0 !important;margin:0 !important;width:100%;height:100%;background:transparent;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img fieldset > div{width:100%;height:100%;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img input[type="image"],#zoneEdit .ze-canhan-avatar .avata-img img{width:100% !important;height:100% !important;object-fit:cover;display:block;border-radius:8px;}'
        + '#zoneEdit .ze-canhan-avatar .upload-avata{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;color:#fff !important;box-shadow:0 4px 12px rgba(37,99,235,.4);text-decoration:none;z-index:2;}'
        + '#zoneEdit .ze-canhan-avatar .upload-avata i{color:#fff !important;}'
        ;
    var html = '<div class="fake-modal zone-bus" id="zoneEdit" style="display:none;padding-top:15px">'
        + '<div class="box-shadow register-wish pt-0 position-relative modal-aps-add">'
        + '<div class="d-flex justify-content-between pt-3 px-20 box-header">'
        + '<div class="nav-content-left"><p class="link"><a><span class="zeIcon"><i class="fa-regular fa-file-circle-question fw-bold"></i></span> Chỉnh sửa - Hồ sơ đề xuất</a></p><div id="zeHeaderBadge"></div></div>'
        + '<div class="nav-content-right mt"><a class="d-block text-right fs-16 mt-5 color-fff btnClose"><i class="fal fa-times"></i></a></div>'
        + '</div>'
        + '<div class="zoneEdit-tabbar">'
        + '<div class="zoneEdit-tab active" data-zetab="tabInfo"><i class="fal fa-user"></i> Thông tin cơ bản</div>'
        + '<div class="zoneEdit-tab" data-zetab="tabDinhDanh"><i class="fal fa-id-card"></i> Định danh &amp; Liên hệ</div>'
        + '<div class="zoneEdit-tab" data-zetab="tabXHD"><i class="fal fa-file-invoice-dollar"></i> Xuất hoá đơn</div>'
        + '</div>'
        + '<div class="zoneEdit-pane active" id="tabInfo">'
        + '<div id="zoneCaNhan" class="ze-form">'
        + '<div class="aps-sv-section">'
        + '<div class="aps-sv-section-title"><i class="fa-light fa-user"></i> Thông tin cá nhân</div>'
        + '<div class="ze-canhan-layout">'
        + '<div class="aps-sv-grid ze-canhan-grid">'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Họ</label><input class="aps-sv-input" id="txtHo"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tên đệm</label><input class="aps-sv-input" id="txtTenDem"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tên</label><input class="aps-sv-input" id="txtTen"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tên đầy đủ</label><input class="aps-sv-input ze-readonly" id="txtHoVaTen" readonly="readonly"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Mức độ ngày sinh</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropMucDoNgaySinh"></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Giới tính</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropGioiTinh"></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Ngày sinh</label><input class="aps-sv-input" id="txtNgaySinh" placeholder="dd"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tháng sinh</label><input class="aps-sv-input" id="txtThangSinh" placeholder="mm"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Năm sinh</label><input class="aps-sv-input" id="txtNamSinh" placeholder="yyyy"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Quốc tịch</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropQuocTich"><option value="">-- Chọn quốc tịch --</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Dân tộc</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropDanToc"><option value="">-- Chọn dân tộc --</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tôn giáo</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropTonGiao"><option value="">-- Chọn tôn giáo --</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Email</label><div class="aps-sv-input-icon"><i class="fa-light fa-envelope"></i><input class="aps-sv-input" id="txtEmailCaNhan" type="email" placeholder="email@..."></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Điện thoại</label><div class="aps-sv-input-icon"><i class="fa-light fa-phone"></i><input class="aps-sv-input" id="txtDienThoai" placeholder="09xx xxx xxx"></div></div>'
        + '</div>'
        + '<div class="ze-canhan-avatar"><div class="avata-img"><img src="assets/images/avata-form.jpg" id="uploadPicture_SV"><a href="#" class="upload-avata"><i class="fal fa-camera color-dask-blue"></i></a></div></div>'
        + '</div>'
        + '</div>'
        + '<div class="aps-sv-section">'
        + '<div class="aps-sv-section-title"><i class="fa-light fa-location-dot"></i> Nơi sinh</div>'
        + '<div class="aps-sv-grid">'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tỉnh / Thành phố</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropNS_Tinh"><option value="">Chọn tỉnh thành</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Quận / Huyện</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropNS_Huyen"><option value="">Vui lòng chọn Tỉnh trước</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Xã / Phường</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropNS_Xa"><option value="">Vui lòng chọn Quận/Huyện trước</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Chi tiết (số nhà / thôn / xóm)</label><input class="aps-sv-input" id="txtNS_ChiTiet" placeholder="Số nhà, tên đường, thôn/xóm..."></div>'
        + '</div>'
        + '</div>'
        + '<div class="aps-sv-section">'
        + '<div class="aps-sv-section-title"><i class="fa-light fa-id-card"></i> Số CCCD / Định danh</div>'
        + '<div class="aps-sv-grid">'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Số CCCD <span style="color:#dc2626">*</span></label><div class="aps-sv-input-icon"><i class="fa-light fa-hashtag"></i><input class="aps-sv-input" id="txtCCCD_So" placeholder="12 chữ số"></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Ngày cấp</label><input class="aps-sv-input" id="txtCCCD_NgayCap" type="date"></div>'
        + '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Nơi cấp</label><input class="aps-sv-input" id="txtCCCD_NoiCap" placeholder="Ví dụ: Cục Cảnh sát QLHC..."></div>'
        + '</div>'
        + '</div>'
        + '<div class="aps-sv-section">'
        + '<div class="aps-sv-section-title"><i class="fa-light fa-house"></i> Hộ khẩu thường trú</div>'
        + '<div class="aps-sv-grid">'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Tỉnh / Thành phố</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropHK_Tinh"><option value="">Chọn tỉnh thành</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Quận / Huyện</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropHK_Huyen"><option value="">Vui lòng chọn Tỉnh trước</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Xã / Phường</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropHK_Xa"><option value="">Vui lòng chọn Quận/Huyện trước</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Số nhà / thôn / xóm</label><input class="aps-sv-input" id="txtHK_SoNha"></div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="zoneEdit-pane" id="tabDinhDanh">'
        + '<div class="container-fluid px-20 mt-15"><div class="row">'
        + '<div class="col-12 col-lg-6 mt-6 pl0"><div class="d-flex align-items-center w-100 justify-content-between"><span class="fw-bold text-success pull-left">Thông tin định danh</span></div><div class="mt-10 aps-table-select"><table class="table transcrip-table tabs-scores tblDapAn_Mau mt-10 table-bordered table-noborder" id="tblDinhDanh"><thead><tr><th class="text-center w-50px" scope="col">STT</th><th scope="col">Loại định danh </th><th scope="col">Số định danh </th><th scope="col">Ngày cấp</th><th scope="col">Nơi cấp</th><th class="text-center" scope="col">Là thông tin chính</th></tr></thead><tbody></tbody></table></div></div>'
        + '<div class="col-12 col-lg-6 mt-6"><div class="d-flex align-items-center w-100 justify-content-between"><span class="fw-bold text-success pull-left">Thông tin liên hệ</span></div><div class="mt-8 aps-table-select"><table class="table transcrip-table tabs-scores table-bordered table-noborder tblDapAn" id="tblLienHe"><thead><tr><th class="text-center w-50px" scope="col">STT</th><th scope="col">Loại liên hệ</th><th scope="col">Thông tin</th><th class="text-center" scope="col">Là thông tin chính</th></tr></thead><tbody></tbody></table></div></div>'
        + '</div></div>'
        + '</div>'
        + '<div class="zoneEdit-pane" id="tabXHD">'
        + '<div id="zoneXHD" class="ze-form">'
        + '<div class="aps-sv-section">'
        + '<div class="aps-sv-section-title"><i class="fa-light fa-file-invoice-dollar"></i> Người mua / Xuất hoá đơn</div>'
        + '<div class="aps-sv-grid">'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Đối tượng xuất hoá đơn</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="ddlKQ_HD_DoiTuong"><option value="">-- Chọn đối tượng --</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Họ tên người mua hàng</label><input class="aps-sv-input" id="txtKQ_HD_NguoiMua" placeholder="Người nộp tiền / người mua"></div>'
        + '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Tên đơn vị / Công ty</label><input class="aps-sv-input" id="txtKQ_HD_TenDonVi" placeholder="Tên đơn vị nhận hoá đơn (nếu xuất cho tổ chức)"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Mã số thuế (MST)</label><div class="aps-sv-input-icon"><i class="fa-light fa-hashtag"></i><input class="aps-sv-input" id="txtKQ_HD_MST" placeholder="10 hoặc 13 chữ số"></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Mã quan hệ ngân sách</label><div class="aps-sv-input-icon"><i class="fa-light fa-landmark"></i><input class="aps-sv-input" id="txtKQ_HD_MaQHNS" placeholder="Mã QHNS (nếu là đơn vị NSNN)"></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Số điện thoại nhận</label><div class="aps-sv-input-icon"><i class="fa-light fa-phone"></i><input class="aps-sv-input" id="txtKQ_HD_SDT" placeholder="09xx xxx xxx"></div></div>'
        + '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Địa chỉ trên hoá đơn</label><input class="aps-sv-input" id="txtKQ_HD_DiaChi" placeholder="Địa chỉ ghi trên hoá đơn"></div>'
        + '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Email nhận hoá đơn điện tử</label><div class="aps-sv-input-icon"><i class="fa-light fa-envelope"></i><input type="email" class="aps-sv-input" id="txtKQ_HD_Email" placeholder="email nhận HĐĐT"></div></div>'
        + '</div>'
        + '</div>'
        + '<div class="aps-sv-section">'
        + '<div class="aps-sv-section-title"><i class="fa-light fa-money-check-dollar"></i> Thông tin thanh toán</div>'
        + '<div class="aps-sv-grid">'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Loại tài khoản ngân hàng</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="ddlKQ_HD_HinhThucTT"><option value="">-- Chọn loại tài khoản --</option></select></div></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Ngân hàng</label><input class="aps-sv-input" id="txtKQ_HD_NganHang" placeholder="Tên ngân hàng"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Số tài khoản</label><input class="aps-sv-input" id="txtKQ_HD_SoTK" placeholder="Số tài khoản ngân hàng"></div>'
        + '<div class="aps-sv-field"><label class="aps-sv-label">Chủ tài khoản</label><input class="aps-sv-input" id="txtKQ_HD_ChuTK" placeholder="Tên chủ tài khoản"></div>'
        + '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Ghi chú</label><input class="aps-sv-input" id="txtKQ_HD_GhiChu" placeholder="Ghi chú thêm cho hoá đơn (nếu có)"></div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="container-fluid px-20"><hr /><div class="d-flex align-items-center mt-4 flex-wrap mb-4"><div class="ms-auto aps-gap-10"><div class="btn btn-outline-secondary btnClose"><i class="fal fa-times"></i> Đóng</div><div class="btn btn-primary" id="btnSave_DeXuatHoSo"><i class="fal fa-save"></i> Lưu</div></div></div></div>'
        + '</div>'
        + '</div>';
    var styleEl = document.createElement('style');
    styleEl.setAttribute('data-zone-edit-inject', '1');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    if (!window._zoneEditTabHandlerBound) {
        window._zoneEditTabHandlerBound = true;
        document.addEventListener('click', function (e) {
            var tab = e.target.closest && e.target.closest('#zoneEdit .zoneEdit-tab');
            if (!tab) return;
            var target = tab.getAttribute('data-zetab');
            var host = document.getElementById('zoneEdit');
            host.querySelectorAll('.zoneEdit-tab').forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            host.querySelectorAll('.zoneEdit-pane').forEach(function (p) { p.classList.remove('active'); });
            var pane = document.getElementById(target);
            if (pane) pane.classList.add('active');
        });
        document.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('#zoneEdit .btnClose');
            if (!btn) return;
            document.body.classList.remove('zoneEdit-open');
        });
    }
    console.warn('[QLTB v2] modal #zoneEdit injected inline (server file zoneEditModal_inject.js missing)');
})();

// ---- 2) Patch DeXuatHoSo.prototype nếu server còn dexuathoso.js cũ ----
// Save PersonInvoice (tab XHĐ) — fallback (2026-08-25)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype.save_PersonInvoice) {
    DeXuatHoSo.prototype.save_PersonInvoice = function () {
        var me = this;
        var val = function (id) { return (($('#' + id).val() || '') + '').trim(); };
        var tenDonVi = val('txtKQ_HD_TenDonVi');
        var mst = val('txtKQ_HD_MST');
        var diaChi = val('txtKQ_HD_DiaChi');
        var email = val('txtKQ_HD_Email');
        var sdt = val('txtKQ_HD_SDT');
        var maQHNS = val('txtKQ_HD_MaQHNS');
        var doiTuong = $('#ddlKQ_HD_DoiTuong').val() || '';
        var hasData = tenDonVi || mst || diaChi || email || sdt || maQHNS || doiTuong;
        var invoiceId = me._currentInvoiceId || '';
        if (!hasData && !invoiceId) return;
        var isUpdate = !!(invoiceId && invoiceId.length === 32);
        var obj_save = {
            action: isUpdate ? 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLwgvNy4oIiQILycu' : 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8ILzcuKCIkCC8nLgPP',
            func: isUpdate ? 'PKG_CORE_NGUOIHOC_01.Sua_PersonInvoiceInfo' : 'PKG_CORE_NGUOIHOC_01.Them_PersonInvoiceInfo',
            iM: edu.system.iM,
            strBuyer_Type_Loai: doiTuong, strBuyer_Ref_Type: '', strBuyer_Ref_Id: '',
            strBuyer_Name: tenDonVi, strBuyer_Addr: diaChi, strBuyer_Tax_Mst: mst,
            strBuyer_Budget_Qhns: maQHNS, strBuyer_Email: email, strBuyer_Phone: sdt,
            strNguoiThucHien_Id: edu.system.userId,
            strVaiTroDangNhap_Id: edu.system.vaiTroDangNhap_Id || '',
            strChucNangHeThong_Id: edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
            strHanhDong_Code: ''
        };
        if (isUpdate) obj_save.strId = invoiceId;
        else {
            var pid = me.strDeXuatHoSo_Id || me._lockedPersonId || '';
            if (!pid) { console.warn('[QLTB PersonInvoice] không có strPerson_Id → skip Them'); return; }
            obj_save.strPerson_Id = pid;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { if (!isUpdate && data.Id) me._currentInvoiceId = data.Id; }
                else console.warn('[QLTB PersonInvoice] fail:', data.Message);
            },
            error: function (er) { console.warn('[QLTB PersonInvoice] err:', er); },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    };
}

// Save Person_Profile (Dân tộc / Tôn giáo) — fallback (2026-09-09)
// 2 field này thuộc bảng PERSON_PROFILE, không nằm trong CorePerson, nên save_DeXuatHoSo
// bản cũ không lưu chúng: chọn xong bấm Lưu là mất. Xem PKG_CORE_NGUOIHOC_01.Them_/Sua_Person_Profile.
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._loadPersonProfile) {
    DeXuatHoSo.prototype._loadPersonProfile = function (personId) {
        var dx = this;
        dx._currentProfileId = '';
        dx._currentProfile = null;
        if (!personId) return;
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success && data.Data && data.Data.length) {
                    var p = data.Data[0];
                    dx._currentProfile = p;
                    dx._currentProfileId = p.PERSON_PROFILE_ID || p.PROFILE_ID || p.ID || '';
                }
            },
            error: function (er) { console.warn('[QLTB PersonProfile] load err:', er); },
            type: 'POST', contentType: true,
            action: 'SV_NGUOIHOC_01_MH/DSA4FRURJDMyLi8eETMuJygtJAPP',
            data: {
                'action': 'SV_NGUOIHOC_01_MH/DSA4FRURJDMyLi8eETMuJygtJAPP',
                'func': 'PKG_CORE_NGUOIHOC_01.LayTTPerson_Profile',
                'iM': edu.system.iM, 'strId': '', 'strPerson_Id': personId,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    };
    console.warn('[QLTB v2] DeXuatHoSo.prototype._loadPersonProfile patched');
}
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype.save_PersonProfile) {
    DeXuatHoSo.prototype.save_PersonProfile = function () {
        var me = this;
        var _now = Date.now();
        if (me._lastProfileSaveAt && (_now - me._lastProfileSaveAt) < 1500) return;
        me._lastProfileSaveAt = _now;
        var ethnicity = ($('#dropDanToc').val() || '') + '';
        var religion = ($('#dropTonGiao').val() || '') + '';
        var profileId = me._currentProfileId || '';
        var old = me._currentProfile || {};
        if (!ethnicity && !religion && !profileId) return;
        var personId = me.strDeXuatHoSo_Id || me._lockedPersonId || '';
        if (!personId) { console.warn('[QLTB PersonProfile] thiếu strPerson_Id → skip'); return; }
        var isUpdate = !!(profileId && profileId.length === 32);
        var keep = function (v) { return (v === null || v === undefined) ? '' : v; };
        var obj_save = {
            'iM': edu.system.iM,
            'strReligion_Id': religion,
            'strEthnicity_Id': ethnicity,
            'strFamilyBackground_Id': keep(old.FAMILY_BACKGROUND_ID),
            'strMaritalStatus_Id': keep(old.MARITAL_STATUS_ID),
            'strPolicyObject_Id': keep(old.POLICY_OBJECT_ID),
            'strBloodType_Code': keep(old.BLOOD_TYPE_CODE),
            'strUnionJoinDate': keep(old.UNION_JOIN_DATE),
            'strPartyJoinDate': keep(old.PARTY_JOIN_DATE),
            'strPartyOfficialDate': keep(old.PARTY_OFFICIAL_DATE),
            'dIsActive': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
            'strHanhDong_Code': ''
        };
        if (isUpdate) {
            obj_save.action = 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLx4RMy4nKC0k';
            obj_save.func = 'PKG_CORE_NGUOIHOC_01.Sua_Person_Profile';
            obj_save.strId = profileId;
        } else {
            obj_save.action = 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8eETMuJygtJAPP';
            obj_save.func = 'PKG_CORE_NGUOIHOC_01.Them_Person_Profile';
            obj_save.strPerson_Id = personId;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) { if (!isUpdate && data.Id) me._currentProfileId = data.Id; }
                else edu.system.alert('Lưu Dân tộc/Tôn giáo lỗi: ' + ((data && data.Message) || ''), 'w');
            },
            error: function (er) { edu.system.alert('Lưu Dân tộc/Tôn giáo lỗi (er): ' + JSON.stringify(er), 'w'); },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    };
    console.warn('[QLTB v2] DeXuatHoSo.prototype.save_PersonProfile patched');
}

// Monkey-patch save_DeXuatHoSo → chain save_PersonInvoice + save_PersonProfile (2026-08-25 / 2026-09-09)
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.save_DeXuatHoSo && !DeXuatHoSo.prototype._invoiceChainHooked) {
    DeXuatHoSo.prototype._invoiceChainHooked = true;
    var _origSaveDX_QLTB = DeXuatHoSo.prototype.save_DeXuatHoSo;
    DeXuatHoSo.prototype.save_DeXuatHoSo = function () {
        var me = this;
        _origSaveDX_QLTB.call(me);
        setTimeout(function () {
            if (typeof me.save_PersonInvoice === 'function') me.save_PersonInvoice();
            // save_PersonProfile có guard 1.5s nên gọi trùng với bản trong dexuathoso.js là vô hại
            if (typeof me.save_PersonProfile === 'function') me.save_PersonProfile();
        }, 300);
    };
}

// Bridge helper: #txtEmailCaNhan/#txtDienThoai → shadow #txtLienHe<typeId> (2026-08-25)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._bridgeLienHeToShadow) {
    DeXuatHoSo.prototype._bridgeOneLienHe = function (typeId, uiFieldId) {
        if (!typeId) return;
        if (!$('#txtLienHe' + typeId).length) $('body').append('<input type="hidden" id="txtLienHe' + typeId + '" />');
        if (!$('#checkX' + typeId).length) $('body').append('<input type="checkbox" id="checkX' + typeId + '" style="display:none" checked />');
        var val = (($('#' + uiFieldId).val() || '') + '').trim();
        $('#txtLienHe' + typeId).val(val);
        var existing = (this.dtLienHe || []).find(function (x) { return x.CONTACT_TYPE_CODE_ID === typeId || x.CONTACT_TYPE_CODE === typeId; });
        if (existing && existing.ID) $('#txtLienHe' + typeId).attr('name', existing.ID);
    };
    DeXuatHoSo.prototype._bridgeLienHeToShadow = function () {
        var me = this;
        var arr = me.dtLoaiLienHe || [];
        var strip = function (s) { return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase(); };
        arr.forEach(function (type) {
            var text = strip(type.MA) + '|' + strip(type.TEN);
            var isEmail = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(text);
            var isPhone = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(text);
            if (!isEmail && !isPhone) {
                var existing = (me.dtLienHe || []).find(function (x) { return (x.CONTACT_TYPE_CODE_ID === type.ID) || (x.CONTACT_TYPE_CODE === type.ID); });
                var v = existing && (existing.CONTACT_VALUE || existing.VALUE) || '';
                if (v.indexOf('@') > -1) isEmail = true;
                else if (/^[\d\s\+\-\(\)\.]+$/.test(v) && v.replace(/\D/g, '').length >= 6) isPhone = true;
            }
            var uiFieldId = isEmail ? 'txtEmailCaNhan' : (isPhone ? 'txtDienThoai' : null);
            if (!uiFieldId) return;
            me._bridgeOneLienHe(type.ID, uiFieldId);
        });
    };
}

// Bridge helper: #txtCCCD_So → shadow #txtSoDinhDinh<cccdTypeId> (2026-08-25)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._bridgeCccdToShadow) {
    DeXuatHoSo.prototype._findCccdTypeId = function () {
        var arr = this.dtLoaiDinhDanh || [];
        var found = arr.find(function (e) {
            var ma = ((e.MA || '') + '').toUpperCase();
            var ten = ((e.TEN || '') + '').toUpperCase();
            return ma === 'CCCD' || ten.indexOf('CCCD') > -1 || ten.indexOf('CĂN CƯỚC') > -1 || ten.indexOf('CAN CUOC') > -1;
        });
        return found ? found.ID : null;
    };
    DeXuatHoSo.prototype._bridgeCccdToShadow = function () {
        var cid = this._findCccdTypeId();
        if (!cid) { console.warn('[QLTB Bridge CCCD] không tìm thấy CCCD type'); return; }
        if (!$('#txtSoDinhDinh' + cid).length) $('body').append('<input type="hidden" id="txtSoDinhDinh' + cid + '" />');
        if (!$('#txtNgayCap' + cid).length) $('body').append('<input type="hidden" id="txtNgayCap' + cid + '" />');
        if (!$('#txtNoiCap' + cid).length) $('body').append('<input type="hidden" id="txtNoiCap' + cid + '" />');
        if (!$('#checkX' + cid).length) $('body').append('<input type="checkbox" id="checkX' + cid + '" style="display:none" checked />');
        $('#txtSoDinhDinh' + cid).val(($('#txtCCCD_So').val() || '').trim());
        $('#txtNgayCap' + cid).val($('#txtCCCD_NgayCap').val() || '');
        $('#txtNoiCap' + cid).val(($('#txtCCCD_NoiCap').val() || '').trim());
        var existing = (this.dtDinhDanh || []).find(function (x) { return x.IDENTIFIER_TYPE_CODE === cid; });
        if (existing && existing.ID) $('#txtSoDinhDinh' + cid).attr('name', existing.ID);
    };
}

// Populate header badge fallback (2026-08-28)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._populateHeaderBadge) {
    DeXuatHoSo.prototype._populateHeaderBadge = function (person) {
        var el = document.getElementById('zeHeaderBadge');
        if (!el) return;
        el.innerHTML = '';
        if (!person) return;
        var pick = function (obj, keys) {
            if (!obj) return '';
            var lookup = {};
            for (var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) lookup[k.toUpperCase()] = obj[k]; }
            for (var i = 0; i < keys.length; i++) {
                var v = lookup[keys[i].toUpperCase()];
                if (v !== null && v !== undefined && v !== '') return v;
            }
            return '';
        };
        var a = person.aData || {};
        var ma = person.ma || pick(a, ['MA', 'MASO', 'MA_NGUOI_HOC', 'MA_SV', 'STUDENT_CODE', 'CURRENT_EMPLOYEE_CODE', 'QLSV_NGUOIHOC_MA', 'MA_HS']);
        var hoTen = person.hoTen || pick(a, ['FULL_NAME', 'FULLNAME', 'HOTEN', 'HO_TEN', 'HOVATEN', 'HO_VA_TEN', 'QLSV_NGUOIHOC_HOTEN', 'QLSV_NGUOIHOC_FULLNAME']);
        if (!hoTen) {
            var _parts = [person.hoDem || pick(a, ['HODEM', 'HO_DEM', 'QLSV_NGUOIHOC_HODEM']), person.ten || pick(a, ['TEN', 'FIRST_NAME', 'QLSV_NGUOIHOC_TEN'])];
            hoTen = _parts.filter(function (x) { return x; }).join(' ').replace(/\s+/g, ' ').trim();
        }
        var lop = person.lop || pick(a, ['DAOTAO_LOPQUANLY_TEN', 'LOP_TEN', 'LOP', 'QLSV_NGUOIHOC_LOPQUANLY_TEN', 'DAOTAO_LOPQUANLY_MA', 'LOP_MA']);
        var nganh = person.nganh || pick(a, ['DAOTAO_NGANH_TEN', 'NGANH_TEN', 'NGANH', 'QLSV_NGUOIHOC_NGANH_TEN', 'DAOTAO_NGANHDAOTAO_TEN']);
        var khoa = person.khoa || pick(a, ['DAOTAO_KHOAQUANLY_TEN', 'KHOA_TEN', 'KHOA', 'QLSV_NGUOIHOC_KHOAQUANLY_TEN', 'DAOTAO_KHOADAOTAO_TEN', 'KHOAHOC']);
        var esc = function (s) { return (s + '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
        var chips = [];
        if (ma) chips.push('<span class="ze-chip"><b>Mã:</b>' + esc(ma) + '</span>');
        if (hoTen) chips.push('<span class="ze-chip"><b>Họ tên:</b>' + esc(hoTen) + '</span>');
        if (lop) chips.push('<span class="ze-chip"><b>Lớp:</b>' + esc(lop) + '</span>');
        if (nganh) chips.push('<span class="ze-chip"><b>Ngành:</b>' + esc(nganh) + '</span>');
        if (khoa) chips.push('<span class="ze-chip"><b>Khóa:</b>' + esc(khoa) + '</span>');
        el.innerHTML = chips.join('');
    };
}

if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype.openEditByPerson) {
    DeXuatHoSo.prototype.openEditByPerson = function (person) {
        var dx = this;
        if (!person || !person.id) return;
        dx.strDeXuatHoSo_Id = person.id;
        // Lưu backup + Safeguard Save button (Viện Y bị mất strId → gọi INSERT sai) (2026-08-24)
        dx._lockedPersonId = person.id;
        if (!dx._saveGuardBound) {
            dx._saveGuardBound = true;
            $(document).on('mousedown', '#btnSave_DeXuatHoSo', function () {
                if (dx._lockedPersonId) {
                    dx.strDeXuatHoSo_Id = dx._lockedPersonId;
                }
                if (typeof dx._bridgeCccdToShadow === 'function') dx._bridgeCccdToShadow();
                if (typeof dx._bridgeLienHeToShadow === 'function') dx._bridgeLienHeToShadow();
            });
            // Validate: Số CCCD bắt buộc nhập — capture-phase click (2026-08-25)
            var _btnSave = document.getElementById('btnSave_DeXuatHoSo');
            if (_btnSave && !_btnSave._cccdValidatorBound) {
                _btnSave._cccdValidatorBound = true;
                _btnSave.addEventListener('click', function (ev) {
                    var el = document.getElementById('txtCCCD_So');
                    if (el && !((el.value || '') + '').trim()) {
                        try { edu.system.alert('Vui lòng nhập Số CCCD.', 'w'); } catch (er) { alert('Vui lòng nhập Số CCCD.'); }
                        setTimeout(function () { try { el.focus(); } catch (er) { } }, 50);
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        ev.stopPropagation();
                        return false;
                    }
                }, true);
            }
        }
        var strHoDem = ((person.hoDem || '') + '').trim().replace(/\s+/g, ' ');
        var arr = strHoDem.split(' ');
        var strHo = arr.shift() || '';
        var strTenDem = arr.join(' ');
        edu.util.viewValById("txtHo", strHo);
        edu.util.viewValById("txtTenDem", strTenDem);
        edu.util.viewValById("txtTen", edu.util.returnEmpty(person.ten));
        $("#txtTen").trigger("input");
        edu.util.viewValById("txtNgaySinh", edu.util.returnEmpty(person.ngaySinh_Ngay));
        edu.util.viewValById("txtThangSinh", edu.util.returnEmpty(person.ngaySinh_Thang));
        edu.util.viewValById("txtNamSinh", edu.util.returnEmpty(person.ngaySinh_Nam));
        edu.util.viewValById("uploadPicture_SV", edu.util.returnEmpty(person.anh));
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(person.anh), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_SV").attr("src", strAnh);
        if (typeof dx._populateHeaderBadge === 'function') dx._populateHeaderBadge(person);
        dx.toggle_edit();
        $('body').addClass('zoneEdit-open');
        $('#zoneEdit .zoneEdit-tab').removeClass('active');
        $('#zoneEdit .zoneEdit-tab[data-zetab="tabInfo"]').addClass('active');
        $('#zoneEdit .zoneEdit-pane').removeClass('active');
        $('#zoneEdit #tabInfo').addClass('active');
        if (typeof dx.getList_DinhDanh === 'function') dx.getList_DinhDanh();
        if (typeof dx.getList_LienHe === 'function') dx.getList_LienHe();
        if (dx.dtMucDoNgaySinh && dx.dtMucDoNgaySinh.length) {
            var opt = dx.dtMucDoNgaySinh.find(function (e) { return e.MA == "EXACT"; });
            if (opt) $('#dropMucDoNgaySinh').val(opt.ID).trigger("change").trigger({ type: 'select2:select' });
        }
        // Populate dropdown — accept ID hoặc MA
        var _pickIdByMa = function (selectId, ma) {
            if (!ma) return '';
            var opt = document.querySelector('#' + selectId + ' option[name="' + ma + '"]');
            if (opt) return opt.value;
            return '';
        };
        var _setDrop = function () {
            var gt = person.gioiTinh || _pickIdByMa('dropGioiTinh', person.gioiTinhMa);
            var dt = person.danToc || _pickIdByMa('dropDanToc', person.danTocMa);
            var tg = person.tonGiao || _pickIdByMa('dropTonGiao', person.tonGiaoMa);
            var qt = person.quocTich || _pickIdByMa('dropQuocTich', person.quocTichMa);
            if (gt) { $('#dropGioiTinh').val(gt).trigger('change'); }
            if (dt) { $('#dropDanToc').val(dt).trigger('change'); }
            if (tg) { $('#dropTonGiao').val(tg).trigger('change'); }
            if (qt) { $('#dropQuocTich').val(qt).trigger('change'); }
        };
        _setDrop();
        setTimeout(_setDrop, 500);
        setTimeout(_setDrop, 1500);
        if (typeof dx._loadXHD_Section === 'function') dx._loadXHD_Section(person.id);
        if (typeof dx._loadTabInfoExtras === 'function') dx._loadTabInfoExtras(person.id);
        // Lấy PERSON_PROFILE_ID để lúc Lưu biết gọi Them_ hay Sua_Person_Profile (Dân tộc/Tôn giáo)
        if (typeof dx._loadPersonProfile === 'function') dx._loadPersonProfile(person.id);
    };
    console.warn('[QLTB v2] DeXuatHoSo.prototype.openEditByPerson patched (server file dexuathoso.js is old)');
}
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._loadTabInfoExtras) {
    DeXuatHoSo.prototype._loadTabInfoExtras = function (personId) {
        var dx = this;
        if (!dx._infoDMDLLoaded) {
            try {
                edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropQuocTich");
                edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropDanToc");
                edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropTonGiao");
            } catch (e) { console.warn('[TabInfo] loadDMDL error', e); }
            dx._infoDMDLLoaded = true;
        }
        if (!dx._cascadeInited && edu.extend && typeof edu.extend.genDropTinhThanh === 'function') {
            try {
                edu.extend.genDropTinhThanh('dropNS_Tinh', 'dropNS_Huyen', 'dropNS_Xa');
                edu.extend.genDropTinhThanh('dropHK_Tinh', 'dropHK_Huyen', 'dropHK_Xa');
            } catch (e) { console.warn('[TabInfo] genDropTinhThanh error', e); }
            dx._cascadeInited = true;
        }
        var arrClear = [
            "dropQuocTich", "dropDanToc", "dropTonGiao", "txtEmailCaNhan", "txtDienThoai",
            "dropNS_Tinh", "dropNS_Huyen", "dropNS_Xa", "txtNS_ChiTiet",
            "txtCCCD_So", "txtCCCD_NgayCap", "txtCCCD_NoiCap",
            "dropHK_Tinh", "dropHK_Huyen", "dropHK_Xa", "txtHK_SoNha"
        ];
        if (edu.util && edu.util.resetValByArrId) edu.util.resetValByArrId(arrClear);
        setTimeout(function () {
            var strip = function (s) { return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase(); };
            (dx.dtLienHe || []).forEach(function (item) {
                var val = item.CONTACT_VALUE || item.VALUE || '';
                var text = strip(item.CONTACT_TYPE_CODE_MA || item.MA) + '|' + strip(item.CONTACT_TYPE_CODE_NAME || item.CONTACT_TYPE_NAME);
                var isEmail = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(text);
                var isPhone = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(text);
                if (!isEmail && !isPhone) {
                    if (val.indexOf('@') > -1) isEmail = true;
                    else if (/^[\d\s\+\-\(\)\.]+$/.test(val) && val.replace(/\D/g, '').length >= 6) isPhone = true;
                }
                if (isEmail) edu.util.viewValById('txtEmailCaNhan', val);
                else if (isPhone) edu.util.viewValById('txtDienThoai', val);
            });
            (dx.dtDinhDanh || []).forEach(function (item) {
                var typeName = ((item.IDENTIFIER_TYPE_CODE_NAME || item.IDENTIFIER_TYPE_NAME || '') + '').toUpperCase();
                var typeMa = ((item.IDENTIFIER_TYPE_CODE_MA || item.MA || '') + '').toUpperCase();
                if (typeMa === 'CCCD' || typeName.indexOf('CCCD') > -1 || typeName.indexOf('CĂN CƯỚC') > -1) {
                    edu.util.viewValById('txtCCCD_So', item.IDENTIFIER_NO || '');
                    edu.util.viewValById('txtCCCD_NgayCap', item.ISSUE_DATE || '');
                    edu.util.viewValById('txtCCCD_NoiCap', item.ISSUE_PLACE || '');
                }
            });
        }, 800);
    };
    console.warn('[QLTB v2] DeXuatHoSo.prototype._loadTabInfoExtras patched');
}
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._loadXHD_Section) {
    DeXuatHoSo.prototype._loadXHD_Section = function (personId) {
        var dx = this;
        var arrClear = ["ddlKQ_HD_DoiTuong", "txtKQ_HD_NguoiMua", "txtKQ_HD_TenDonVi", "txtKQ_HD_MST",
            "txtKQ_HD_MaQHNS", "txtKQ_HD_SDT", "txtKQ_HD_DiaChi", "txtKQ_HD_Email",
            "ddlKQ_HD_HinhThucTT", "txtKQ_HD_NganHang", "txtKQ_HD_SoTK", "txtKQ_HD_ChuTK", "txtKQ_HD_GhiChu"];
        edu.util.resetValByArrId(arrClear);
        if (!dx._xhdDMDLLoaded) {
            edu.system.loadToCombo_DanhMucDuLieu("TS.DOITUONGHOADON", "ddlKQ_HD_DoiTuong");
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE", "ddlKQ_HD_HinhThucTT");
            dx._xhdDMDLLoaded = true;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) return;
                var list = (data.Data || []).filter(function (i) {
                    return i.PERSON_ID == personId && (i.IS_ACTIVE === undefined || i.IS_ACTIVE == 1);
                });
                if (!list.length) return;
                var b = list.find(function (i) { return i.IS_PRIMARY == 1; }) || list[0];
                dx._currentBankId = b.ID || '';
                // Bank ACCOUNT_TYPE_CODE là MA — tra ID qua option[name=MA] để select đúng
                var _setBank = function () {
                    var opt = document.querySelector('#ddlKQ_HD_HinhThucTT option[name="' + b.ACCOUNT_TYPE_CODE + '"]');
                    if (opt) { $('#ddlKQ_HD_HinhThucTT').val(opt.value).trigger('change'); }
                    edu.util.viewValById("txtKQ_HD_NganHang", b.BANK_NAME);
                    edu.util.viewValById("txtKQ_HD_SoTK", b.ACCOUNT_NUMBER);
                    edu.util.viewValById("txtKQ_HD_ChuTK", b.ACCOUNT_NAME);
                    edu.util.viewValById("txtKQ_HD_GhiChu", b.NOTE);
                };
                _setBank();
                setTimeout(_setBank, 500);
                setTimeout(_setBank, 1500);
                // Auto-fill XHD chỉ Email + SĐT (không fill Họ tên người mua — có thể là cơ quan)
                setTimeout(function () {
                    (dx.dtLienHe || []).forEach(function (item) {
                        var name = ((item.CONTACT_TYPE_CODE_NAME || item.CONTACT_TYPE_NAME || '') + '').toLowerCase();
                        var ma = ((item.CONTACT_TYPE_CODE_MA || item.MA || '') + '').toUpperCase();
                        var val = item.CONTACT_VALUE || item.VALUE || '';
                        if (!val) return;
                        if ((ma === 'EMAIL' || name.indexOf('mail') > -1) && !$('#txtKQ_HD_Email').val()) $('#txtKQ_HD_Email').val(val);
                        else if ((ma === 'PHONE' || ma === 'MOBILE' || name.indexOf('điện thoại') > -1 || name.indexOf('phone') > -1) && !$('#txtKQ_HD_SDT').val()) $('#txtKQ_HD_SDT').val(val);
                    });
                }, 1000);
            },
            error: function () { /* silent */ },
            type: 'POST',
            action: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP',
            contentType: true,
            data: {
                'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP',
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Bank_Account',
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'strPerson_Id': personId
            },
            fakedb: []
        }, false, false, false, null);

        // Load PersonInvoice — SONG SONG với Bank, fire kể cả khi Bank rỗng (2026-08-24)
        edu.system.makeRequest({
            success: function (respInv) {
                if (!respInv.Success || !respInv.Data || !respInv.Data.length) return;
                var inv = respInv.Data[0];
                dx._currentInvoiceId = inv.ID || '';
                var _setInv = function () {
                    if (inv.BUYER_TYPE_LOAI) { $('#ddlKQ_HD_DoiTuong').val(inv.BUYER_TYPE_LOAI).trigger('change'); }
                    if (inv.BUYER_NAME_TENNM) $('#txtKQ_HD_TenDonVi').val(inv.BUYER_NAME_TENNM);
                    if (inv.BUYER_ADDR_DIACHI) $('#txtKQ_HD_DiaChi').val(inv.BUYER_ADDR_DIACHI);
                    if (inv.BUYER_TAX_MST) $('#txtKQ_HD_MST').val(inv.BUYER_TAX_MST);
                    if (inv.BUYER_BUDGET_MAQHNS) $('#txtKQ_HD_MaQHNS').val(inv.BUYER_BUDGET_MAQHNS);
                    if (inv.BUYER_EMAIL) $('#txtKQ_HD_Email').val(inv.BUYER_EMAIL);
                    if (inv.BUYER_PHONE_SDT) $('#txtKQ_HD_SDT').val(inv.BUYER_PHONE_SDT);
                };
                _setInv();
                setTimeout(_setInv, 500);
                setTimeout(_setInv, 1500);
            },
            error: function (er) { console.warn('[QLTB] LayDS_PersonInvoiceInfo error:', er); },
            type: 'POST',
            action: 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
            contentType: true,
            data: {
                'action': 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    };
}