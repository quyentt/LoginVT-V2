function CapNhatHoSo() { }
CapNhatHoSo.prototype = {
    do_table: '',
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],
    strNhanSu_Id: '',
    dtNhanSu: [],
    dtCCTC_Childs: [],
    dtCCTC_Parents: [],
    arrValid_HS: [],

    init: function () {
        var me = this;
        edu.system.page_load();
        me.page_load();
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_CapNhat_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS("", edu.util.getValById("txtSearch_CapNhat_TuKhoa"), edu.util.getValById("dropSearch_CapNhat_CCTC"), edu.util.getValById("dropSearch_CapNhat_BoMon"));
            }
        });     
        $("#btnSearchCapNhat_NhanSu").click(function () {
            me.getList_HS();
        });
        $("#tblCapNhat_NhanSu").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            me.reset_HS();
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblCapNhat_NhanSu");
            me.getDetail_HS(me.strNhanSu_Id);
            $("#zoneEdit").slideDown();
        });
        $("#btnHS_Save").click(function () {
            me.save_HS();
        });
        $("#dropSearch_CapNhat_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_BoMon").on("select2:select", function () {
            me.getList_HS();
        });
        $("#dropSearch_CapNhat_TinhTrangLamViec").on("select2:select", function () {
            me.getList_HS();
        });
        $("#btnHS_In").click(function () {
            edu.system.report("2C_2008", "", function (addKeyValue) {
                addKeyValue("strOutputType", "DOCX");
                addKeyValue("strNhanSu_Id", main_doc.CapNhatHoSo.strNhanSu_Id);
            });
        });
    },
    page_load: function () {
        var me = main_doc.CapNhatHoSo;
        me.getList_HS();
        edu.extend.setTinhThanh(["txtNS_NoiOHienNay", "txtNS_NoiSinh", "txtNS_QueQuan", "txtNS_HoKhauThuongTru"], 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        edu.system.uploadAvatar(['uploadPicture_HS'], "");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.LOTN", "dropNS_XepLoaiTotnhgiep");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.CDNN, "dropNS_ChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropNS_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "dropNS_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNS_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropNS_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTHN, "dropNS_TinhTrangHonNhan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TBH0, "dropNS_HangThuongBinh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GDCS, "dropNS_GiaDinhChinhSach");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TPXT, "dropNS_ThanhPhanXuatThan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUHA, "dropNS_QuanHam");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTNS, "dropNS_TinhTrangNhanSu, dropSearch_CapNhat_TinhTrangLamViec");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "dropNS_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LGV0, "dropNS_LoaiGiangVien");
        me.getList_CoCauToChuc();
    },
    toggle_ChuongTrinh: function () {
        edu.util.toggle_overide("zone-content", "zone_TimKiem");
    },
    open_Collapse: function (strkey) {
        $("#" + strkey).trigger("click");
        if ($('#' + strkey + ' a[data-parent="#' + strkey + '"]').hasClass("collapsed"))
            $('#' + strkey + ' a[data-parent="#' + strkey + '"]').trigger("click");
        console.log(1);
    },
    switch_CallModal: function (modal) {
        var me = this;
        $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới');
        switch (modal) {
            case "key_tieusubanthan":
                me.resetPopup_TSBT();
                me.popup_TSBT();
                break;
            case "key_quanhegiadinh":
                me.resetPopup_QHGD();
                me.popup_QHGD();
                break;
            case "key_dang":
                me.resetPopup_Dang();
                me.popup_Dang();
                break;
            case "key_doan":
                me.resetPopup_Doan();
                me.popup_Doan();
                break;
            case "key_congdoan":
                me.resetPopup_CongDoan();
                me.popup_CongDoan();
                break;
            case "key_trinhdochinhtri":
                me.resetPopup_TDCT();
                me.popup_TDCT();
                break;
            case "key_trinhdotinhoc":
                me.resetPopup_TDTH();
                me.popup_TDTH();
                break;
            case "key_trinhdongoaingu":
                me.resetPopup_TDNN();
                me.popup_TDNN();
                break;
            case "key_hocham":
                me.resetPopup_HocHam();
                me.popup_HocHam();
                break;
            case "key_danhhieu":
                me.resetPopup_DanhHieu();
                me.popup_DanhHieu();
                break;
        }
    },
    switch_GetData: function (key) {
        var me = this;
        console.log(2);
        switch (key) {
            case "key_tieusubanthan":
                me.getList_TSBT();
                break;
            case "key_quanhegiadinh":
                me.getList_QHTT();
                break;
            case "key_dang":
                me.getList_Dang();
                break;
            case "key_doan":
                me.getList_Doan();
                break;
            case "key_congdoan":
                me.getList_CongDoan();
                break;
            case "key_trinhdochinhtri":
                me.getList_TDCT();
                break;
            case "key_trinhdotinhoc":
                me.getList_TDTH();
                break;
            case "key_trinhdongoaingu":
                me.getList_TDNN();
                break;
            case "key_hocham":
                me.getList_HocHam();
                break;
            case "key_danhhieu":
                me.getList_DanhHieu();
                break;
        }
    },
    getList_HS: function () {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_BoMon");
        var strTinhTrangNhanSu_Id = edu.util.getValById("dropSearch_CapNhat_TinhTrangLamViec");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_CapNhat_CCTC");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_CapNhat_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strTinhTrangNhanSu_Id: strTinhTrangNhanSu_Id,
            strNguoiThucHien_Id: "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);
    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.CapNhatHoSo;
        me.dtNhanSu = data;
        $("#zoneEdit").slideUp();
        $("#lblHSLL_NhanSu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCapNhat_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CapNhatHoSo.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            arrClassName: ["btnDetail"],
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + "Mã cán bộ: " + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + "Ngày sinh: " + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
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
    },
    reset_HS: function () {
        var me = this;
        me.tab_item_actived = [];
        $("#tbl_TieuSuBanThan tbody").html("");
        $("#tbl_QuanHeGiaDinh tbody").html("");
        $("#tbl_Dang tbody").html("");
        $("#tbl_Doan tbody").html("");
        $("#tbl_CongDoan tbody").html("");
        $("#tbl_TrinhDoChinhTri tbody").html("");
        $("#tbl_TrinhDoTinHoc tbody").html("");
        $("#tbl_TrinhDoNgoaiNgu tbody").html("");        
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.CapNhatHoSo;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropNS_CoCauToChuc"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    save_HS: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoV2/CapNhat',            

            'strId': me.strNhanSu_Id,
            'strMaSo': edu.util.getValById('txtNS_MaSo'),
            'strHoDem': edu.util.getValById('txtNS_HoDem'),
            'strTen': edu.util.getValById('txtNS_Ten'),
            'strTenGoiKhac': edu.util.getValById('txtNS_BiDanh'),
            'strNgaySinh': edu.util.getValById('txtNS_NgaySinh'),
            'strThangSinh': edu.util.getValById('txtNS_ThangSinh'),
            'strNamSinh': edu.util.getValById('txtNS_NamSinh'),
            'strGioiTinh_Id': edu.util.getValById('dropNS_GioiTinh'),
            'strNoiSinh_DiaChi': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("name")),
            'strNoiSinh_Xa_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("xaId")),
            'strNoiSinh_Huyen_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("huyenId")),
            'strNoiSinh_Tinh_Id': edu.util.returnEmpty($("#txtNS_NoiSinh").attr("tinhId")),
            'strQueQuan_DiaChi': edu.util.returnEmpty($("#txtNS_QueQuan").attr("name")),
            'strQueQuan_Xa_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("xaId")),
            'strQueQuan_Huyen_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("huyenId")),
            'strQueQuan_Tinh_Id': edu.util.returnEmpty($("#txtNS_QueQuan").attr("tinhId")),
            'strHKTT_DiaChi': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("name")),
            'strHKTT_Xa_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("xaId")),
            'strHKTT_Huyen_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("huyenId")),
            'strHKTT_Tinh_Id': edu.util.returnEmpty($("#txtNS_HoKhauThuongTru").attr("tinhId")),
            'strNOHN_DiaChi': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("name")),
            'strNOHN_Xa_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("xaId")),
            'strNOHN_Huyen_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("huyenId")),
            'strNOHN_Tinh_Id': edu.util.returnEmpty($("#txtNS_NoiOHienNay").attr("tinhId")),
            'strQuocTich_Id': edu.util.getValById('dropNS_QuocTich'),
            'strDanToc_Id': edu.util.getValById('dropNS_DanToc'),
            'strTonGiao_Id': edu.util.getValById('dropNS_TonGiao'),
            'strTDPT_TotNghiepLop': edu.util.getValById('txtNS_TDPhoThong'),
            'strTDPT_He': edu.util.getValById('txtNS_He'),
            'strSoTruongCongTac': edu.util.getValById('txtNS_SoTruongCongTac'),
            'strThuongBinhHang_Id': edu.util.getValById('dropNS_HangThuongBinh'),
            'strGiaDinhChinhSach_Id': edu.util.getValById('dropNS_GiaDinhChinhSach'),
            'strThanhPhanXuatThan_Id': edu.util.getValById('dropNS_ThanhPhanXuatThan'),
            'strDang_NgayVao': edu.util.getValById('txtNS_Dang_NgayVao'),
            'strDang_NgayChinhThuc': edu.util.getValById('txtNS_Dang_NgayChinhThuc'),
            'strDang_NoiKetNap': edu.util.getValById('txtNS_Dang_NoiKetNap'),
            'strDoan_NgayVao': edu.util.getValById('txtNS_Doan_NgayVao'),
            'strDoan_NoiKetNap': edu.util.getValById('txtNS_Doan_NoiKetNap'),
            'strCongDoan_NgayVao': edu.util.getValById('txtNS_CongDoan_NgayVao'),
            'strNgu_NgayNhap': edu.util.getValById('txtNS_Ngu_NgayNhap'),
            'strNgu_NgayXuat': edu.util.getValById('txtNS_Ngu_NgayXuat'),
            'strNgu_QuanHam_Id': edu.util.getValById('dropNS_QuanHam'),
            'strCanCuoc_So': edu.util.getValById('txtNS_SCC_So'),
            'strCanCuoc_NgayCap': edu.util.getValById('txtNS_SCC_NgayCap'),
            'strCanCuoc_NoiCap': edu.util.getValById('txtNS_SCC_NoiCap'),
            'strNhanXet': "#",
            'strEmail': edu.util.getValById('txtNS_Email'),
            'strAnh': edu.system.getImage('uploadPicture_HS', edu.system.userId),
            'strSDT_CaNhan': edu.util.getValById('txtNS_DienThoaiCaNhan'),
            'strSDT_CoQuan': edu.util.getValById('txtNS_DienThoaiCoQuan'),
            'strSDT_GiaDinh': edu.util.getValById('txtNS_DienThoaiGiaDinh'),
            'strNgayTGCachMang': edu.util.getValById('txtNS_NgayThamGiaCachMang'),
            'strNgayTGToChucChinhTriXH': edu.util.getValById('txtNS_NgayTGTCCTXH'),
            'strLoaiHopDongLaoDong_Id': "",
            'strLoaiDoiTuong_Id': edu.util.getValById('dropNS_LoaiDoiTuong'),
            'strLoaiGiangVien_Id': edu.util.getValById('dropNS_LoaiGiangVien'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropNS_CoCauToChuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoBaoHiem': edu.util.getValById('txtNS_SoBaoHiem'),
            'strTinhTrangHonNhan_Id': edu.util.getValById('dropNS_TinhTrangHonNhan'),
            'strTinhTrangNhanSu_Id': edu.util.getValById('dropNS_TinhTrangNhanSu'),
            'strTDPT_XepLoaiTotNghiep_Id': edu.util.getValById('dropNS_XepLoaiTotnhgiep'),
            'strCongViecChinhDuocGiao': edu.util.getValById('txtNS_CongViecChinhDuocGiao'),
            'strLinhVucNghienCuu': edu.util.getValById('txtNS_LinhVucNghienCuu'),
            'strLoaiChucDanhNgheNghiep_Id': edu.util.getValById('dropNS_ChucDanh'),
            'strLaCanBoNgoaiTruong': "0",
            'strMaSoThue': edu.util.getValById('txtNS_MaSoThue'),

            'strThoiGian_VaoTruong': edu.util.getValById('txtNgay_VaoTruong'),
            'strThoiGian_VaoNganhGiaoDuc': edu.util.getValById('txtNgay_VaoNganhGD'),
            'strThoiGian_VaoBienChe': edu.util.getValById('txtNgay_VaoBienChe'),
            'strThoiGian_TinhBHXH': edu.util.getValById('txtNgay_TinhBHXH'),
            'strLinhVucNghienCuu': edu.util.getValById('txtNS_HuongNghienCuuChinh'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!", 'i');
                    me.getDetail_HS();
                    me.save_AnhHoSo();
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
    getDetail_HS: function () {
        var me = main_doc.CapNhatHoSo;
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',
            
            'strId': me.strNhanSu_Id
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
    viewForm_HS: function (data) {
        var me = main_doc.CapNhatHoSo;
        edu.util.viewValById("txtNS_HoDem", data.HODEM);
        edu.util.viewValById("txtNS_Ten", data.TEN);
        edu.util.viewValById("txtNS_BiDanh", data.TENGOIKHAC);
        edu.util.viewValById("txtNS_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNS_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNS_NamSinh", data.NAMSINH);
        edu.util.viewValById("dropNS_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("dropNS_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropNS_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropNS_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("dropNS_GiaDinhChinhSach", data.GIADINHCHINHSACH_ID);
        edu.util.viewValById("dropNS_ThanhPhanXuatThan", data.THANHPHANXUATTHAN_ID);
        edu.util.viewValById("dropNS_TinhTrangHonNhan", data.TINHTRANGHONNHAN_ID);
        edu.util.viewValById("uploadPicture_HS", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        edu.util.viewValById("txtNS_MaSo", data.MASO);
        edu.util.viewValById("dropNS_TinhTrangNhanSu", data.TINHTRANGNHANSU_ID);
        edu.util.viewValById("dropNS_LoaiDoiTuong", data.LOAIDOITUONG_ID);
        edu.util.viewValById("dropNS_LoaiGiangVien", data.LOAIGIANGVIEN_ID);
        edu.util.viewValById("dropNS_CoCauToChuc", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txtNS_CongViecChinhDuocGiao", data.CONGVIECCHINHDUOCGIAO);
        edu.util.viewValById("txtNS_LinhVucNghienCuu", data.LINHVUCNGHIENCUU);
        edu.util.viewValById("txtNS_SCC_So", data.CANCUOC_SO);
        edu.util.viewValById("txtNS_SCC_NgayCap", data.CANCUOC_NGAYCAP);
        edu.util.viewValById("txtNS_SCC_NoiCap", data.CANCUOC_NOICAP);
        edu.util.viewValById("txtNS_SoBaoHiem", data.SOBAOHIEM);
        edu.util.viewValById("txtNS_Email", data.EMAIL);
        edu.util.viewValById("txtNS_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("txtNS_DienThoaiCoQuan", data.SDT_COQUAN);
        edu.util.viewValById("txtNS_DienThoaiGiaDinh", data.SDT_GIADINH);
        edu.extend.viewTinhThanhById("txtNS_NoiSinh", data.NOISINH_TINH_ID, data.NOISINH_HUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_QueQuan", data.QUEQUAN_TINH_ID, data.QUEQUAN_HUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_HoKhauThuongTru", data.HKTT_TINH_ID, data.HKTT_HUYEN_ID, data.HKTT_XA_ID, data.HKTT_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_NoiOHienNay", data.NOHN_TINH_ID, data.NOHN_HUYEN_ID, data.NOHN_XA_ID, data.NOHN_DIACHI);
        edu.util.viewValById("txtNS_Dang_NgayVao", data.DANG_NGAYVAO);
        edu.util.viewValById("txtNS_Dang_NgayChinhThuc", data.DANG_NGAYCHINHTHUC);
        edu.util.viewValById("txtNS_Dang_NoiKetNap", data.DANG_NOIKETNAP);
        edu.util.viewValById("txtNS_Doan_NgayVao", data.DOAN_NGAYVAO);
        edu.util.viewValById("txtNS_Doan_NoiKetNap", data.DOAN_NOIKETNAP);
        edu.util.viewValById("txtNS_CongDoan_NgayVao", data.CONGDOAN_NGAYVAO);
        edu.util.viewValById("txtNS_Ngu_NgayNhap", data.NGU_NGAYNHAP);
        edu.util.viewValById("txtNS_Ngu_NgayXuat", data.NGU_NGAYXUAT);
        edu.util.viewValById("dropNS_QuanHam", data.NGU_QUANHAM_ID);
        edu.util.viewValById("dropNS_HangThuongBinh", data.THUONGBINHHANG_ID);
        edu.util.viewValById("txtNS_NgayThamGiaCachMang", data.NGAYTGCACHMANG);
        edu.util.viewValById("txtNS_NgayTGTCCTXH", data.NGAYTGTOCHUCCHINHTRIXH);
        edu.util.viewValById("txtNS_TDPhoThong", data.TDPT_TOTNGHIEPLOP);
        edu.util.viewValById("txtNS_He", data.TDPT_HE);
        edu.util.viewValById("txtNS_SoTruongCongTac", data.SOTRUONGCONGTAC);
        edu.util.viewValById("dropNS_XepLoaiTotnhgiep", data.TDPT_XEPLOAITOTNGHIEP_ID);
        edu.util.viewValById("txtNS_MaSoThue", data.MASOTHUE);
        edu.util.viewValById("dropNS_ChucDanh", data.LOAICHUCDANHNGHENGHIEP_ID);
        edu.util.viewValById("txtNS_HocViCaoNhat", data.HOCVI_TEN);
        edu.util.viewValById("txtNS_TrinhDoChuyenMonCaoNhat", data.TRINHDOCHUYENMONCN_TEN);
        edu.util.viewValById("txtNgay_VaoTruong", data.THOIGIAN_VAOTRUONG);
        edu.util.viewValById("txtNgay_VaoNganhGD", data.THOIGIAN_VAONGANHGIAODUC);
        edu.util.viewValById("txtNgay_VaoBienChe", data.THOIGIAN_VAOBIENCHE);
        edu.util.viewValById("txtNgay_TinhBHXH", data.THOIGIAN_TINHBHXH);
        edu.util.viewValById("txtNS_HuongNghienCuuChinh", data.LINHVUCNGHIENCUU);
        edu.util.viewValById("txtHinhThucTuyenDung", data.HINHTHUCTUYENDUNG_TEN);
        edu.util.viewValById("txtLoaiHopDong", data.LOAIHOPDONG_TEN);
        edu.util.viewValById("txtNS_CongViecChinhDuocGiao", data.CONGVIECPHAILAM);        
    },
    
    save_AnhHoSo: function () {
        var me = main_doc.CapNhatHoSo;
        var obj_save = {
            'action': 'NS_HoSoV2/KeThua',            

            'strNhanSu_HoSo_v2_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strNhanSu_Id == edu.system.userId) $("img[class='user-image']").attr("src", edu.system.rootPathUpload + "//" + edu.util.getValById('uploadPicture_HS'));
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
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
    processData_CoCauToChuc: function (data) {
        var me = main_doc.CapNhatHoSo;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }
        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genComBo_CCTC(data);
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_CCTC"],
            type: "",
            title: "Chọn Khoa/Viện/Phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_CapNhat_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
}