/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function CapNhatHoSo() { };
CapNhatHoSo.prototype = {
    strCommon_Id: '',
    tab_actived: [],
    tab_item_actived: [],

    init: function () {
        var me = this;
        edu.system.page_load();
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Action HoSo
        -------------------------------------------*/
        $("#btnHS_Save").click(function () {
            me.save_HS();
        });
        /*------------------------------------------
        --Discription: [tab_6] Tui ho so
        -------------------------------------------*/
        $("#btnHS_In").click(function () {
            edu.system.report("2C_2008", "", function (addKeyValue) {
                addKeyValue("strOutputType", "DOCX");
                addKeyValue("strNhanSu_Id", edu.system.userId);
            });
        });
    },
    page_load: function () {
        var me = main_doc.CapNhatHoSo;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.extend.setTinhThanh(["txtNS_NoiOHienNay", "txtNS_NoiSinh", "txtNS_QueQuan", "txtNS_HoKhauThuongTru"], 'VD: TP Hà Nội, Quận Cầu Giấy, Dịch Vọng, Số 1 Nguyễn Phong Sắc');
        //end_load: getDetail_HS
        edu.system.loadToCombo_DanhMucDuLieu("NS.TTHN", "dropNS_HonNhan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.CDNN, "dropNS_ChucDanh");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDTH", "dropTDTH");
        edu.system.loadToCombo_DanhMucDuLieu("NS.DMNN", "dropNgonNgu");
        edu.system.loadToCombo_DanhMucDuLieu("NS.TDNN", "dropTDNN");
        edu.system.loadToCombo_DanhMucDuLieu("QLCB.LOTN", "dropNS_XepLoaiTotnhgiep");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LGV0, "txtNS_LoaiGiangVien");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LTNS, "txtNS_LoaiDoiTuong");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropNS_DanToc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TOGI, "dropNS_TonGiao");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropNS_GioiTinh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.CHUN.CHLU, "dropNS_QuocTich");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TTHN, "dropNS_TinhTrangHonNhan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TBH0, "dropNS_HangThuongBinh");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GDCS, "dropNS_GiaDinhChinhSach");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.TPXT, "dropNS_ThanhPhanXuatThan");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUHA, "dropNS_QuanHam");
        edu.system.uploadAvatar(['uploadPicture_HS'], "");
        me.getList_CoCauToChuc();
        setTimeout(function () {
            me.getDetail_HS();
        }, 2500);
    },
    getList_CoCauToChuc: function () {
        var me = this;
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
    /*------------------------------------------
    --Discription: [Tab_1] ThongTinLyLich
    -------------------------------------------*/
    save_HS: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoV2/CapNhat',
            

            'strId': edu.system.userId,
            'strMaSo': "#",// the character "#" --> it mean, we dont want to update this field
            'strHoDem': "#",
            'strTen': "#",
            'strTenGoiKhac': edu.util.getValById('txtNS_BiDanh'),
            'strNgaySinh': "#",
            'strThangSinh': "#",
            'strNamSinh': "#",
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
            'strLoaiDoiTuong_Id': '#',
            'strLoaiGiangVien_Id': '#',
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropNS_CoCauToChuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strSoBaoHiem': edu.util.getValById('txtNS_SoBaoHiem'),
            'strTinhTrangHonNhan_Id': edu.util.getValById('dropNS_TinhTrangHonNhan'),
            'strTinhTrangNhanSu_Id': "#",
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
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!", 'i');
                    me.getDetail_HS();
                    me.save_AnhHoSo();
                    //me.copyFile(edu.util.getValById('uploadPicture_HS'), edu.system.userId)
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
        //view data --Edit
        var obj_detail = {
            'action': 'NS_HoSoV2/LayChiTiet',
            
            'strId': edu.system.userId
        }

        
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
        //Thong tin co ban
        edu.util.viewValById("txtNS_HoDem", data.HODEM);
        edu.util.viewValById("txtNS_Ten", data.TEN);
        edu.util.viewValById("txtNS_BiDanh", data.TENGOIKHAC);
        edu.util.viewValById("txtNS_NgaySinh", data.NGAYSINH);
        edu.util.viewValById("txtNS_ThangSinh", data.THANGSINH);
        edu.util.viewValById("txtNS_NamSinh", data.NAMSINH);
        edu.util.viewValById("txtNS_GioiTinh", data.GIOITINH_TEN);
        edu.util.viewValById("dropNS_QuocTich", data.QUOCTICH_ID);
        edu.util.viewValById("dropNS_DanToc", data.DANTOC_ID);
        edu.util.viewValById("dropNS_GioiTinh", data.GIOITINH_ID);
        edu.util.viewValById("dropNS_TonGiao", data.TONGIAO_ID);
        edu.util.viewValById("dropNS_GiaDinhChinhSach", data.GIADINHCHINHSACH_ID);
        edu.util.viewValById("dropNS_ThanhPhanXuatThan", data.THANHPHANXUATTHAN_ID);
        edu.util.viewValById("dropNS_TinhTrangHonNhan", data.TINHTRANGHONNHAN_ID);
        edu.util.viewValById("uploadPicture_HS", data.ANH);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.ANH), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        //Thong tin can bo
        edu.util.viewValById("txtNS_MaSo", data.MASO);
        edu.util.viewValById("txtNS_TinhTrangNhanSu", data.TINHTRANGNHANSU_TEN);
        edu.util.viewValById("txtNS_LoaiDoiTuong", data.LOAIDOITUONG_TEN);
        edu.util.viewValById("txtNS_LoaiGiangVien", data.LOAIGIANGVIEN_TEN);
        edu.util.viewValById("dropNS_CoCauToChuc", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("txtNS_CongViecChinhDuocGiao", data.CONGVIECCHINHDUOCGIAO);
        edu.util.viewValById("txtNS_LinhVucNghienCuu", data.LINHVUCNGHIENCUU);////
        //CMND (The can cuoc), Bao hiem
        edu.util.viewValById("txtNS_SCC_So", data.CANCUOC_SO);
        edu.util.viewValById("txtNS_SCC_NgayCap", data.CANCUOC_NGAYCAP);
        edu.util.viewValById("txtNS_SCC_NoiCap", data.CANCUOC_NOICAP);
        edu.util.viewValById("txtNS_SoBaoHiem", data.SOBAOHIEM);
        //Thong tin lien lac
        edu.util.viewValById("txtNS_Email", data.EMAIL);
        edu.util.viewValById("txtNS_DienThoaiCaNhan", data.SDT_CANHAN);
        edu.util.viewValById("txtNS_DienThoaiCoQuan", data.SDT_COQUAN);
        edu.util.viewValById("txtNS_DienThoaiGiaDinh", data.SDT_GIADINH);
        //Dia chi
        edu.extend.viewTinhThanhById("txtNS_NoiSinh", data.NOISINH_TINH_ID, data.NOISINH_HUYEN_ID, data.NOISINH_XA_ID, data.NOISINH_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_QueQuan", data.QUEQUAN_TINH_ID, data.QUEQUAN_HUYEN_ID, data.QUEQUAN_XA_ID, data.QUEQUAN_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_HoKhauThuongTru", data.HKTT_TINH_ID, data.HKTT_HUYEN_ID, data.HKTT_XA_ID, data.HKTT_DIACHI);
        edu.extend.viewTinhThanhById("txtNS_NoiOHienNay", data.NOHN_TINH_ID, data.NOHN_HUYEN_ID, data.NOHN_XA_ID, data.NOHN_DIACHI);
        //Dang
        edu.util.viewValById("txtNS_Dang_NgayVao", data.DANG_NGAYVAO);
        edu.util.viewValById("txtNS_Dang_NgayChinhThuc", data.DANG_NGAYCHINHTHUC);
        edu.util.viewValById("txtNS_Dang_NoiKetNap", data.DANG_NOIKETNAP);
        //Doan
        edu.util.viewValById("txtNS_Doan_NgayVao", data.DOAN_NGAYVAO);
        edu.util.viewValById("txtNS_Doan_NoiKetNap", data.DOAN_NOIKETNAP);
        //CongDoan
        edu.util.viewValById("txtNS_CongDoan_NgayVao", data.CONGDOAN_NGAYVAO);
        //QuanNgu
        edu.util.viewValById("txtNS_Ngu_NgayNhap", data.NGU_NGAYNHAP);
        edu.util.viewValById("txtNS_Ngu_NgayXuat", data.NGU_NGAYXUAT);
        edu.util.viewValById("dropNS_QuanHam", data.NGU_QUANHAM_ID);
        edu.util.viewValById("dropNS_HangThuongBinh", data.THUONGBINHHANG_ID);
        //Khac
        edu.util.viewValById("txtNS_NgayThamGiaCachMang", data.NGAYTGCACHMANG);
        edu.util.viewValById("txtNS_NgayTGTCCTXH", data.NGAYTGTOCHUCCHINHTRIXH);
        edu.util.viewValById("txtNS_TDPhoThong", data.TDPT_TOTNGHIEPLOP);
        edu.util.viewValById("txtNS_He", data.TDPT_HE);
        edu.util.viewValById("txtNS_SoTruongCongTac", data.SOTRUONGCONGTAC);
        edu.util.viewValById("dropNS_XepLoaiTotnhgiep", data.TDPT_XEPLOAITOTNGHIEP_ID);
        edu.util.viewValById("txtNS_MaSoThue", data.MASOTHUE);
        edu.util.viewValById("dropNS_ChucDanh", data.LOAICHUCDANHNGHENGHIEP_ID);////
        edu.util.viewValById("txtNS_HocViCaoNhat", data.HOCVI_TEN);
        edu.util.viewValById("txtNS_TrinhDoChuyenMonCaoNhat", data.TRINHDOCHUYENMONCN_TEN);
        //Cac moc thoi gian
        edu.util.viewValById("txtNgay_VaoTruong", data.THOIGIAN_VAOTRUONG);
        edu.util.viewValById("txtNgay_VaoNganhGD", data.THOIGIAN_VAONGANHGIAODUC);
        edu.util.viewValById("txtNgay_VaoBienChe", data.THOIGIAN_VAOBIENCHE);
        edu.util.viewValById("txtNgay_TinhBHXH", data.THOIGIAN_TINHBHXH);
        edu.util.viewValById("txtNS_HuongNghienCuuChinh", data.LINHVUCNGHIENCUU);//
        edu.util.viewValById("txtHinhThucTuyenDung", data.HINHTHUCTUYENDUNG_TEN);//
        edu.util.viewValById("txtLoaiHopDong", data.LOAIHOPDONG_TEN);//
        edu.util.viewValById("txtNS_CongViecChinhDuocGiao", data.CONGVIECPHAILAM);//
    },
    save_AnhHoSo: function () {
        var me = main_doc.CapNhatHoSo;
        var obj_save = {
            'action': 'NS_HoSoV2/KeThua',            

            'strNhanSu_HoSo_v2_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("img[class='user-image']").attr("src", edu.system.rootPathUpload + "//" + edu.util.getValById('uploadPicture_HS'));
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
}