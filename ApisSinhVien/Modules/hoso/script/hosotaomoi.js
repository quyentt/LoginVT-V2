/*----------------------------------------------
--Author: Văn Hiệp 
--Phone: 
--Date of created: 17/10/2017
--Input: 
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HoSoTaoMoi() { };
HoSoTaoMoi.prototype = {
    dt_HS: '',
    strId: '',
    input_HS: '',
    zoneActive: '',
    strMaSV: '',
    dtChiTiet: [],
    strSinhVien_Id: '',
    init: function () {
        var me = main_doc.HoSoTaoMoi;
        $("#txtSearch_SVTT_TuKhoa").focus();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*Start xử lý hộp tìm kiếm chức năng*/
        me.arrId = ["txtSinhVien_DiaChiBaoTin", "txtSinhVien_MaSo", "txtSinhVien_Ho", "txtSinhVien_Ten", "txtSinhVien_BiDanh", "dropSinhVien_QuocTich", "txtSinhVien_NgaySinh", "txtSinhVien_ThangSinh", "txtSinhVien_NamSinh",
            "dropSinhVien_GioiTinh", "dropSinhVien_DanToc", "dropSinhVien_TonGiao", "txtSinhVien_Email", "txtSinhVien_DienThoai", "txtSinhVien_NoiSinh", "txtSinhVien_NoiOHienNay", "txtSinhVien_HoKhauThuongTru", "txtSinhVien_QueQuan"];
        me.getList_HSSV();
        me.addSV();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropSinhVien_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "dropSinhVien_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropSinhVien_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropSinhVien_QuocTich");
        edu.extend.setTinhThanh(["txtSinhVien_NoiSinh", "txtSinhVien_QueQuan", "txtSinhVien_HoKhauThuongTru"], 'TP Hà Nội, Quận Hai Bà Trưng, Số 1 Trần Đại Nghĩa');
        edu.system.uploadAvatar(['txtAnh'], "");
        // Ẩn handler theo yêu cầu 2026-08-21: bỏ nút Làm mới / Cập nhật / Xóa / Thêm hồ sơ khác
        //$(document).delegate("#btnHSLL_Rewrite", "click", function (e) {
        //    me.rewrite();
        //});
        $(document).delegate('.detail_HoSoSinhVien', 'click', function (e) {
            e.stopImmediatePropagation();
            me.strId = this.id;
            // Highlight row (không gọi activePerson để tránh getDetail_HS thừa — dùng data cache trong openEditModal)
            var row = this;
            $(".activeSelect").each(function () { this.classList.remove('activeSelect'); });
            setTimeout(function () { row.classList.add('activeSelect'); }, 50);
            me.openEditModal(this.id);
        });
        // Refresh danh sách trái khi đóng modal chỉnh sửa + gỡ backdrop (2026-08-21)
        $(document).on('click', '#zoneEdit .btnClose', function () {
            $('body').removeClass('zoneEdit-open');
            setTimeout(function () { me.getList_HSSV(); }, 300);
        });
        // Tab switch trong modal
        $(document).on('click', '#zoneEdit .zoneEdit-tab', function () {
            var target = $(this).data('zetab');
            $('#zoneEdit .zoneEdit-tab').removeClass('active');
            $(this).addClass('active');
            $('#zoneEdit .zoneEdit-pane').removeClass('active');
            $('#zoneEdit #' + target).addClass('active');
        });
        $(document).delegate('.detail_HoSoSinhVien', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            me.popover_HS(point.id, point);
        });
        $("#btnHSLL_Save").click(function () {
            me.CapNhat_HS();
        });
        $("#btnHSLL_Add").click(function () {
            me.strId = "";
            me.save_HS();
            me.editSV();
        });
        //$("#btnHSLL_Delete").click(function () {
        //    edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
        //    $("#btnYes").click(function (e) {
        //        me.delete_HS();
        //    });
        //});
        $("#btnHSLL_AddMode").click(function () {
            me.addSV();
        });
        //$("#btnHSLL_Import").click(function () {
        //    edu.system.showImportChung("Sinh viên", "ImportSinhVien");
        //});
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearchSinhVien_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HSSV();
            }
        });
        $("#btnSearch_HSSV").click(function () {
            me.getList_HSSV();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropKhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $("#dropChuongTrinhDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
        });
        //Bao cao
        edu.system.getList_MauImport("zonebtnHSSV");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KhoiTaoHoSo");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KhoiTaoHoSo");
    },
    rewrite: function () {
        //reset id
        var me = main_doc.HoSoTaoMoi;
        edu.util.resetValByArrId(me.arrId);
        $(".activeSelect").each(function () {
            this.classList.remove('activeSelect');
        });
        me.strId = "";
        edu.util.viewValById("txtAnh", "");
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(""), constant.setting.EnumImageType.ACCOUNT);
        $("#srctxtAnh").attr("src", strAnh);
        var objpoint = $("#txtSinhVien_NoiSinh");
        objpoint.attr('tinhId', "");
        objpoint.attr('huyenId', "");
        objpoint.attr('xaId', "");
        objpoint.attr('name', "");
        var objpoint = $("#txtSinhVien_QueQuan");
        objpoint.attr('tinhId', "");
        objpoint.attr('huyenId', "");
        objpoint.attr('xaId', "");
        objpoint.attr('name', "");
        var objpoint = $("#txtSinhVien_HoKhauThuongTru");
        objpoint.attr('tinhId', "");
        objpoint.attr('huyenId', "");
        objpoint.attr('xaId', "");
        objpoint.attr('name', "");
        $("#zoneDiaDiemS").replaceWith('');
    },
    /*------------------------------------------
    --Discription: Danh mục NCS
    -------------------------------------------*/
    /*------------------------------------------
    --Description: Wrapper — chuẩn hoá data cache dt_HS → gọi dx.openEditByPerson (2026-08-21)
    --Nếu module chưa load (cache lệch bản), fallback: populate inline + toggle_edit
    -------------------------------------------*/
    openEditModal: function (personId) {
        var me = main_doc.HoSoTaoMoi;
        var dx = main_doc.DeXuatHoSo;
        if (!personId) return;
        var d = (me.dt_HS || []).find(function (e) { return e.ID == personId; }) || {};
        var person = {
            id: personId,
            hoDem: d.HODEM,
            ten: d.TEN,
            ngaySinh_Ngay: d.NGAYSINH_NGAY,
            ngaySinh_Thang: d.NGAYSINH_THANG,
            ngaySinh_Nam: d.NGAYSINH_NAM || d.BIRTH_YEAR || '',
            anh: d.ANH || d.ANHCANHAN || '',
            gioiTinh: d.GENDER_ID || d.GIOITINH_ID || '',
            gioiTinhMa: d.GIOITINH_MA || '',
            danTocMa: d.DANTOC_MA || '',
            tonGiaoMa: d.TONGIAO_MA || '',
            quocTichMa: d.QUOCTICH_MA || '',
            aData: d
        };
        if (dx && typeof dx.openEditByPerson === 'function') {
            dx.openEditByPerson(person);
            return;
        }
        // Fallback: cache dexuathoso.js phiên bản cũ chưa có openEditByPerson → dùng logic inline
        if (!dx) {
            edu.system.alert("Chưa nạp được module chỉnh sửa hồ sơ.", "w");
            return;
        }
        var strHoDem = ((person.hoDem || '') + '').trim().replace(/\s+/g, ' ');
        var arr = strHoDem.split(' ');
        var strHo = arr.shift() || '';
        var strTenDem = arr.join(' ');
        dx.strDeXuatHoSo_Id = person.id;
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
        dx.toggle_edit();
        $('body').addClass('zoneEdit-open');
        $('#zoneEdit .zoneEdit-tab').removeClass('active');
        $('#zoneEdit .zoneEdit-tab[data-zetab="tabInfo"]').addClass('active');
        $('#zoneEdit .zoneEdit-pane').removeClass('active');
        $('#zoneEdit #tabInfo').addClass('active');
        if (typeof dx.getList_DinhDanh === 'function') dx.getList_DinhDanh();
        if (typeof dx.getList_LienHe === 'function') dx.getList_LienHe();
    },
    editSV: function () {
        //me.toggle_form();
        $(".aps-add-new").show();
        $("#btnHSLL_Delete").show();
        $("#btnHSLL_AddMode").show();
        $("#btnHSLL_Save").show();
        $("#btnHSLL_Rewrite").hide();
        $("#btnHSLL_Add").hide();
    },
    addSV: function () {
        $(".aps-add-new").hide();
        $("#btnHSLL_Delete").hide();
        $("#btnHSLL_AddMode").hide();
        $("#btnHSLL_Save").hide();
        $("#btnHSLL_Rewrite").show();
        $("#btnHSLL_Add").show();
        this.rewrite();
    },
    /*------------------------------------------
    --Discription: acess db NCS
    --ULR: Modules
    -------------------------------------------*/
    save_HS: function () {
        var me = main_doc.HoSoTaoMoi;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_HoSo/ThemMoi',
            
            'strHoDem': edu.util.getValById('txtSinhVien_Ho'),
            'strAnh': edu.util.getValById('txtAnh'),
            'strTen': edu.util.getValById('txtSinhVien_Ten'),
            'strMaSo': edu.util.getValById('txtSinhVien_MaSo'),
            'strNgaySinh_Nam': edu.util.getValById('txtSinhVien_NamSinh'),
            'strNgaySinh_Thang': edu.util.getValById('txtSinhVien_ThangSinh'),
            'strNgaySinh_Ngay': edu.util.getValById('txtSinhVien_NgaySinh'),
            'strBiDanh': edu.util.getValById('txtSinhVien_BiDanh'),
            'strTenGoiKhac': edu.util.getValById('txtSinhVien_BiDanh'),
            'strGioiTinh_Id': edu.util.getValById('dropSinhVien_GioiTinh'),
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("tinhid")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("huyenid")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("xaId")),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("name")),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("tinhid")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("huyenid")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("xaId")),
            'strQueQuan_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("name")),
            'strDanToc_Id': edu.util.getValById('dropSinhVien_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropSinhVien_TonGiao'),
            'strNoiOHienNay': edu.util.getValById('txtSinhVien_NoiOHienNay'),
            'strHoKhau_TinhThanh_Id': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("tinhid")),
            'strHoKhau_QuanHuyen_Id': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("huyenid")),
            'strHoKhau_Xa_Id': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("xaId")),
            'strHoKhau_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("name")),
            'strQuocTich_Id': edu.util.getValById('dropSinhVien_QuocTich'),
            'strDoiTuongDaoTao_Id': edu.util.getValById('dropDoiTuongDaoTao'),
            'strTtll_DienThoaiCaNhan': edu.util.getValById('txtSinhVien_DienThoai'),
            'strTtll_EmailCaNhan': edu.util.getValById('txtSinhVien_Email'),
            'strTtll_KhiCanBaoTinChoAi': edu.util.getValById('txtSinhVien_DiaChiBaoTin'),
            'strCoQuanCongTac': edu.util.getValById('txtCoQuanCongTac'),
            'strMaSoThueCaNhan': edu.util.getValById('txtMaSoThue'),
            'strLopQuanLy_Id': edu.util.getValById('dropLop'),
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
                    me.getList_HSSV();
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
    CapNhat_HS: function () {
        var me = main_doc.HoSoTaoMoi;
        var obj_save = {
            'action': 'SV_HoSo/CapNhat',
            
            'strId': me.strSinhVien_Id,
            'strHoDem': edu.util.getValById('txtSinhVien_Ho'),
            'strAnh': edu.util.getValById('txtAnh'),
            'strTen': edu.util.getValById('txtSinhVien_Ten'),
            'strMaSo': edu.util.getValById('txtSinhVien_MaSo'),
            'strNgaySinh_Nam': edu.util.getValById('txtSinhVien_NamSinh'),
            'strNgaySinh_Thang': edu.util.getValById('txtSinhVien_ThangSinh'),
            'strNgaySinh_Ngay': edu.util.getValById('txtSinhVien_NgaySinh'),
            'strBiDanh': edu.util.getValById('txtSinhVien_BiDanh'),
            'strTenGoiKhac': edu.util.getValById('txtSinhVien_BiDanh'),
            'strGioiTinh_Id': edu.util.getValById('dropSinhVien_GioiTinh'),
            'strNoiSinh_TinhThanh_Id': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("tinhid")),
            'strNoiSinh_QuanHuyen_Id': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("huyenid")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("xaId")),
            'strNoiSinh_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSinhVien_NoiSinh").attr("name")),
            'strQueQuan_TinhThanh_Id': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("tinhid")),
            'strQueQuan_QuanHuyen_Id': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("huyenid")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("xaId")),
            'strQueQuan_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSinhVien_QueQuan").attr("name")),
            'strDanToc_Id': edu.util.getValById('dropSinhVien_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropSinhVien_TonGiao'),
            'strNoiOHienNay': edu.util.getValById('txtSinhVien_NoiOHienNay'),
            'strHoKhau_TinhThanh_Id': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("tinhid")),
            'strHoKhau_QuanHuyen_Id': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("huyenid")),
            'strHoKhau_Xa_Id': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("xaId")),
            'strHoKhau_PhuongXaKhoiXom': edu.util.returnEmpty($("#txtSinhVien_HoKhauThuongTru").attr("name")),
            'strQuocTich_Id': edu.util.getValById('dropSinhVien_QuocTich'),
            'strDoiTuongDaoTao_Id': edu.util.getValById('dropDoiTuongDaoTao'),
            'strTtll_DienThoaiCaNhan': edu.util.getValById('txtSinhVien_DienThoai'),
            'strTtll_EmailCaNhan': edu.util.getValById('txtSinhVien_Email'),
            'strTtll_KhiCanBaoTinChoAi': edu.util.getValById('txtSinhVien_DiaChiBaoTin'),
            'strCoQuanCongTac': edu.util.getValById('txtCoQuanCongTac'),
            'strMaSoThueCaNhan': edu.util.getValById('txtMaSoThue'),
            'strLopQuanLy_Id': edu.util.getValById('dropLop'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!", 'i');
                    me.getDetail_HS(obj_save.strId);
                    me.getList_HSSV();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    getList_HSSV: function () {
        var me = main_doc.HoSoTaoMoi;
        var obj_list = {
            'action': 'SV_HoSoKhoiTao/LayDanhSach',
            
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strHeDaoTao_Id': edu.util.getValById("dropSearchSinhVien_He"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearchSinhVien_Khoa"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearchSinhVien_ChuongTrinh"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearchSinhVien_Lop"),
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtSearchSinhVien_TuKhoa"),
        }        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genTable_HSSV(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_HS: function (strId) {
        var me = main_doc.HoSoTaoMoi;
        var obj_detail = {
            'action': 'SV_HoSo/LayChiTiet',
            
            'strId': strId
        }
        if (strId.length != 32) return;        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    if (json.length > 0) {
                        me.dtChiTiet = json[0];
                        me.viewForm_HS(json[0]);
                    } else {
                        console.log("Lỗi ");
                    }
                } else {
                    console.log("Thông báo: có lỗi xảy ra!");
                }                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_detail.action,            
            contentType: true,            
            data: obj_detail,
            fakedb: []
        }, false, false, false, null);
    },
    delete_HS: function (strId) {
        var me = main_doc.HoSoTaoMoi;
        var obj_delete = {
            'action': 'SV_HoSo/Xoa',
            
            'strId': me.strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    if (me.strId == strId) {
                        $(".btnClose").trigger("click");
                    }
                    edu.system.afterComfirm(obj);
                    me.getList_HSSV();
                }
                else {
                    edu.system.alert("SV_HoSo/Xoa: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("SV_HoSo/Xoa (er): " + JSON.stringify(er), "w");                
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
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_HSSV: function (data, iPager) {
        var me = main_doc.HoSoTaoMoi;
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHoSoKhoiTao",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoSoTaoMoi.getList_HSSV()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["detail_HoSoSinhVien"],
            aoColumns: [{
                "mRender": function (nRow, aData) {
                    var strNhanSu_Avatar = edu.system.getRootPathImg(edu.util.returnEmpty(aData.ANH), constant.setting.EnumImageType.ACCOUNT);
                    var info = '<span id="sl_hoten' + aData.ID + '" class="sv-name">' + edu.util.checkEmpty(aData.HODEM) + " " + edu.util.checkEmpty(aData.TEN) + '</span>';
                    var meta = '';
                    if (edu.util.checkValue(aData.MASO))
                        meta += '<span id="sl_ma' + aData.ID + '">' + edu.util.checkEmpty(aData.MASO) + '</span>';
                    var ns = '';
                    if (edu.util.checkValue(aData.NGAYSINH_NGAY)) ns += edu.util.returnEmpty(aData.NGAYSINH_NGAY) + '/';
                    if (edu.util.checkValue(aData.NGAYSINH_THANG)) ns += edu.util.returnEmpty(aData.NGAYSINH_THANG) + '/';
                    if (edu.util.checkValue(aData.NGAYSINH_NAM)) ns += edu.util.returnEmpty(aData.NGAYSINH_NAM);
                    if (ns) meta += (meta ? ' - ' : '') + '<span>' + ns + '</span>';
                    var infoBlock = '<div class="sv-info">' + info + (meta ? '<br /><span class="sv-meta">' + meta + '</span>' : '') + '</div>';
                    var avatar = '<span class="sv-avatar"><img src="' + strNhanSu_Avatar + '" class="table-img" id="sl_hinhanh' + aData.ID + '" /></span>';
                    return '<a class="sv-row">' + avatar + infoBlock + '</a>';
                }
            }
                , {
                "mRender": function (nRow, aData) {
                    html = '';
                    html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-edit color-active"></i></a>';
                    return html;
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //if (data.length > 0) document.getElementById("light-paginationtblHSLL_NhanSu").style.width = "100%";
        /*III. Callback*/
    },
    viewForm_HS: function (data) {
        var me = main_doc.HoSoTaoMoi;
        edu.util.viewValById("txtSinhVien_Ho", data.HODEM);
        edu.util.viewValById("txtSinhVien_Ten", data.TEN);
        edu.util.viewValById("txtSinhVien_MaSo", data.MASO);
        edu.util.viewValById("txtSinhVien_BiDanh", data.BIDANH);
        edu.util.viewValById("dropSinhVien_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("txtSinhVien_NgaySinh", data.NGAYSINH_NGAY);
        edu.util.viewValById("txtSinhVien_ThangSinh", data.NGAYSINH_THANG);
        edu.util.viewValById("txtSinhVien_NamSinh", data.NGAYSINH_NAM);
        edu.util.viewValById("dropSinhVien_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("dropSinhVien_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropSinhVien_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("txtSinhVien_Email", data.TTLL_EMAILCANHAN);
        edu.util.viewValById("txtSinhVien_DienThoai", data.TTLL_DIENTHOAICANHAN);
        edu.util.viewValById("txtCoQuanCongTac", data.COQUANCONGTAC);
        edu.util.viewValById("txtMaSoThue", data.MASOTHUECANHAN);
        edu.util.viewValById("dropLop", data.Lop_Id);
        edu.util.viewValById("txtAnh", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srctxtAnh").attr("src", strAnh);
        edu.util.viewValById("txtSinhVien_NoiOHienNay", data.NOIOHIENNAY);
        edu.extend.viewTinhThanhById("txtSinhVien_NoiSinh", data.NOISINH_TINHTHANH_ID, data.NOISINH_QUANHUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_PHUONGXAKHOIXOM);
        edu.extend.viewTinhThanhById("txtSinhVien_QueQuan", data.QUEQUAN_TINHTHANH_ID, data.QUEQUAN_QUANHUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_PHUONGXAKHOIXOM);
        edu.extend.viewTinhThanhById("txtSinhVien_HoKhauThuongTru", data.HOKHAU_TINHTHANH_ID, data.HOKHAU_QUANHUYEN_ID, data.HOKHAU_XA_ID, data.HOKHAU_PHUONGXAKHOIXOM);
        edu.util.viewValById("txtSinhVien_DiaChiBaoTin", data.TTLL_KHICANBAOTINCHOAI_ODAU);
        me.strSinhVien_Id = data.ID;
        me.strMaSV = data.MASO;
    },
    activePerson: function (strSinhVien_id) {
        var me = main_doc.HoSoTaoMoi;
        if (edu.util.checkValue(strSinhVien_id)) {
            var point = $("#tblHoSoKhoiTao tbody tr[id='" + strSinhVien_id + "']")[0];
            if (point != null && point != undefined) {
                //Active sinh viên
                $(".activeSelect").each(function () {
                    this.classList.remove('activeSelect');
                })
                setTimeout(function () {
                    point.classList.add('activeSelect');
                }, 100);
            }
        }
        me.getDetail_HS(strSinhVien_id);
    },
    popover_HS: function (strHS_Id, point) {
        var me = main_doc.HoSoTaoMoi;
        var data = "";
        for (var i = 0; i < me.dt_HS.length; i++) {
            if (me.dt_HS[i].ID == strHS_Id) {
                data = me.dt_HS[i];
                console.log("OK");
                break;
            }
        }
        //Với trường hợp dt chỉ là 1 phần từ
        if (data == null || data == undefined) return;
        var row = "";
        row += '<div style="width: 550px">';
        row += '<div style="width: 200px; float: left">';
        row += '<img style="margin: 0 auto; display: block" src="' + edu.system.getRootPathImg(edu.util.returnEmpty(data.ANHCANHAN), constant.setting.EnumImageType.ACCOUNT) + '">';
        row += '</div>';
        row += '<div style="width: 330px; float: left; padding-left: 20px; margin-top: -7px">';
        row += '<p class="pcard"><i class="fa fa-credit-card-alt colorcard"></i> <span class="lang" key="">Mã</span>: ' + edu.util.checkEmpty(data.MASO) + '</p>';
        row += '<p class="pcard"><i class="fa fa-user colorcard"></i> <span class="lang" key="">Tên</span>: ' + edu.util.checkEmpty(data.HODEM) + " " + edu.util.checkEmpty(data.TEN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Ngày sinh</span>: ' + edu.util.checkEmpty(data.NGAYSINH_NGAY) + '/' + edu.util.checkEmpty(data.NGAYSINH_THANG) + '/' + edu.util.checkEmpty(data.NGAYSINH_NAM) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Khóa</span>: ' + edu.util.checkEmpty(data.Azzz) + '</p>';
        row += '<p class="pcard"><i class="fa fa-snowflake-o colorcard"></i> <span class="lang" key="">Ngành</span>: CNTT-TT</p>';
        row += '<p class="pcard"><i class="fa fa-envelope-o colorcard"></i> <span class="lang" key="">Email</span>: ' + edu.util.checkEmpty(data.TTLL_EMAILCANHAN) + '</p>';
        row += '<p class="pcard"><i class="fa fa-phone colorcard"></i> <span class="lang" key="">Số điện thoại</span>: ' + edu.util.checkEmpty(data.TTLL_DIENTHOAICANHAN) + '</p>';
        row += '</div>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'right',
        });
        $(point).popover('show');
    },
    getList_LopSinhVien: function () {
        var me = main_doc.HoSoTaoMoi;
        me.genList_LopSinhVien();
    },
    genList_LopSinhVien: function () {
        var me = main_doc.HoSoTaoMoi;
        var row = '';
        for (var i = 0; i < 10; i++) {
            row += '<div class="col-md-4 col-sm-6 col-xs-12 eleSelected" style="cursor: pointer">';
            row += '<div class="info-box">';
            row += '<span class="info-box-icon bg-aqua" style="background-color: #dd4b39 !important">';
            row += '<i class="fa fa-folder"></i>';
            row += '</span>';
            row += '<div class="info-box-content">';
            row += '<span class="info-box-text" style="font-weight: bold;">CN-CNTT 01 - K59</span>';
            row += '<span class="info-box-number">20/60</span>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneDSLopSinhVien").html(row);
    },
    getList_TrangThai: function () {
        var me = main_doc.HoSoTaoMoi;
        me.genList_TrangThai();
    },
    genList_TrangThai: function () {
        var me = main_doc.HoSoTaoMoi;
        var row = '';
        for (var i = 0; i < 10; i++) {
            row += '<div class="col-md-4 col-sm-6 col-xs-12 eleSelected" style="cursor: pointer">';
            row += '<div class="info-box">';
            row += '<span class="info-box-icon bg-aqua" style="background-color: #00acd6 !important">';
            row += '<span>571</span>';
            row += '</span>';
            row += '<div class="info-box-content">';
            row += '<span class="info-box-text" style="font-weight: bold;">Đang theo học</span>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneDSTrangThai").html(row);
    },
    ganLop: function () {
        var me = this;
        var confirm = "";
        var title = "";
        var content = 'bạn có muốn thêm lớp không?';
        title = "<i class='fa fa-question-circle fa-default'> Thông báo</i>";
        confirm += '<div id="myModalAlert" class="modal fade modal-confirm" role="dialog"><div class="modal-dialog">';
        confirm += '<div class="modal-content"><div class="modal-header">';
        confirm += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
        confirm += '<h4 class="modal-title" id="lblConfirmTitle">' + title + '</h4>';
        confirm += ' </div>';
        confirm += '<div class="modal-body">';
        confirm += '<p id="lblConfirmContent">' + content + '</p>';
        confirm += '</div>';
        confirm += '<div class="modal-footer">';
        confirm += '<button type="button" class="btn btn-primary" id="btnYes"><i class="fa fa-check-circle"></i> Áp dụng</button>';
        confirm += '<button type="button" class="btn btn-default" id="btnNo" data-dismiss="modal"><i class="fa fa-times-circle"></i> Để sau</button>';
        confirm += '</div>';
        confirm += '</div>';
        $(".wrapper>#alert").html(confirm);
        $('.wrapper>#alert>#myModalAlert').modal('show');
    },
    ganChuongTrinh: function () {
        var me = this;
    },
    ganTranngThai: function () {
        var me = this;
    },
    switchSinhVien: function (strZoneId, strSinhVien_id) {
        var me = main_doc.HoSoTaoMoi;
        //Khởi tạo lại với trường hợp ẩn do thành công hoặc chưa chọn sinh viên
        document.getElementById('zoneSinhVien').style.display = "";
        document.getElementById('btnLuu').style.display = "";
        document.getElementById('btnDongThongTin').innerHTML = ' <i class="fa fa-close"></i> <span class="lang" key="">Để sau</span>';
        //Ẩn hiện thị toàn bộ nội dung
        $(".zoneThongTin").each(function () {
            this.style.display = "none";
        });
        //Nếu không có id sinh viên hiện tại thì thông báo chưa chọn sinh viên còn không hiện thị nội dung cần thao tác
        if (strSinhVien_id == '') {
            document.getElementById('zoneChuaChonSinhVien').style.display = "";
            document.getElementById('zoneSinhVien').style.display = "none";
            document.getElementById('btnLuu').style.display = "none";
            document.getElementById('btnDongThongTin').innerHTML = ' <i class="fa fa-close"></i> <span class="lang" key="">Đóng</span>';
        }
        else {
            document.getElementById(strZoneId).style.display = "";
        }
        //Nếu hoàn thành thay đổi hiển thị
        if (strZoneId == 'zoneHoanThanh' || strZoneId == 'zoneChuaChonSinhVien') {
            document.getElementById('btnLuu').style.display = "none";
            document.getElementById('btnDongThongTin').innerHTML = ' <i class="fa fa-close"></i> <span class="lang" key="">Đóng</span>';
        }
        //Hiện thị hoặc ẩn thông tin gán lớp
        //Nếu đang hiển thị form thêm mới thì ẩn xong mới hiển thị form gán thông tin
        if (document.getElementById("zoneMainContent").style.display == "") {
            $("#zoneMainContent").hide(500);
            setTimeout(function () {
                $("#zoneGanThongTin").show(500);
            }, 500);
        } else {
            if (document.getElementById("zoneGanThongTin").style.display == "") {
                if (me.zoneActive == strZoneId && me.strId == strSinhVien_id) $("#zoneGanThongTin").hide(500);
            } else {
                $("#zoneGanThongTin").show(500);
            }
        }
        me.activePerson(strSinhVien_id);
        me.zoneActive = strZoneId;
    },
    //Sự kiện active chọn lớp, chương trình, trạng thái
    activeEleSelect: function () {
        var me = main_doc.HoSoTaoMoi;
        $(document).delegate("#zoneDSLopSinhVien .eleSelected", "click", function (e) {
            var id = this;
            me.removeEleSelect();
            setTimeout(function () {
                id.classList.add('activeOnSearch');
                id.getElementsByClassName('info-box')[0].classList.add('activeOnSearch');
                id.getElementsByClassName('info-box-content')[0].classList.add('activeOnSearch');
            });
            activeEleSelectLop(id);
        });
        $(document).delegate("#zoneChuongTrinh .eleSelected", "click", function (e) {
            var id = this;
            me.removeEleSelect();
            setTimeout(function () {
                id.classList.add('activeOnSearch');
                id.getElementsByClassName('info-box')[0].classList.add('activeOnSearch');
                id.getElementsByClassName('info-box-content')[0].classList.add('activeOnSearch');
            });
            activeEleSelectChuongTrinh(id);
        });
        $(document).delegate("#zoneLuuTrangThai .eleSelected", "click", function (e) {
            var id = this;
            me.removeEleSelect();
            setTimeout(function () {
                id.classList.add('activeOnSearch');
                id.getElementsByClassName('info-box')[0].classList.add('activeOnSearch');
                id.getElementsByClassName('info-box-content')[0].classList.add('activeOnSearch');
            });
            activeEleSelectTrangThai(id);
        });
        function activeEleSelectLop(pointId) {
            var strLopName = pointId.getElementsByClassName("info-box-text")[0].innerHTML;
            var row = "";
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += "<div style='font-size: 24px; font-weight: bold;'>Bạn đã chọn lớp: <span style='color: #dd4b39'>" + strLopName + "</span>. Hãy nhấn nút 'Lưu' để hoàn tất.</div>";
            $("#elementSelectLopSinhVien").html(row);
        }
        function activeEleSelectChuongTrinh(pointId) {
            var strLopName = pointId.getElementsByClassName("info-box-text")[0].innerHTML;
            var row = "";
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += "<div style='font-size: 24px; font-weight: bold;'>Bạn đã chọn chương trình: <span style='color: #f39c12'>" + strLopName + "</span>. Hãy nhấn nút 'Lưu' để hoàn tất.</div>";
            $("#elementSelectChuongTrinh").html(row);
        }
        function activeEleSelectTrangThai(pointId) {
            var strLopName = pointId.getElementsByClassName("info-box-text")[0].innerHTML;
            var row = "";
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += '<div class="row"></div>';
            row += "<div style='font-size: 24px; font-weight: bold;'>Bạn đã chọn trạng thái: <span style='color: #00c0ef'>" + strLopName + "</span>. Hãy nhấn nút 'Lưu' để hoàn tất.</div>";
            $("#elementSelectTrangThai").html(row);
        }
    },
    //Xóa bỏ trạng thái chọn đối với lớp, chương trình, trạng thái
    removeEleSelect: function () {
        var me = main_doc.HoSoTaoMoi;
        $(".activeOnSearch").each(function () {
            this.classList.remove('activeOnSearch');
        });
        $("#elementSelectLopSinhVien, #elementSelectChuongTrinh, #elementSelectTrangThai").html("");
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
            strHeDaoTao_Id: edu.util.getValById("dropHeDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
            strNganh_Id: edu.util.getValCombo("dropChuongTrinhDaoTao"),
            strLoaiLop_Id: "",
            strToChucCT_Id: "",
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
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
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
            renderPlace: ["dropHeDaoTao"],
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropChuongTrinhDaoTao"],
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
            renderPlace: ["dropLop"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
}