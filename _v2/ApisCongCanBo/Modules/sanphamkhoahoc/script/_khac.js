/* =========================================================================
   sanphamkhoahoc — cấu hình giaithuong, vanbangsangche, hoinghihoithao, detaisinhvien,
   giangdaysaudaihoc, huongdansaudaihoc: ums.nckh.khac[kieu](root). Khung chung ums.nckh.man (_sanpham.js).
   Tham số chép NGUYÊN từng .js gốc (xem đặc tả ở đầu từng hàm).
   Khác bản gốc (ghi ở can-quyet.js):
     · giaithuong, vanbangsangche: không có bảng thành viên; thêm mới xong tự thêm người đăng nhập làm thành viên
       (NCKH_ThanhVien/ThemMoi) như gốc. vanbangsangche: "File đính kèm QĐ" (gắn <id>_QD) đặt ngay dưới biểu mẫu.
     · hoinghihoithao: nhãn "Tháng tổ chức" gốc lưu vào strNamBaoCao (NĂM báo cáo) — giữ, hỏi nghiệp vụ.
       Chọn từ "Tìm hội nghị": gốc KHÔNG chép được kinh phí (lỗi id) → nay chép.
     · giangdaysaudaihoc / huongdansaudaihoc / detaisinhvien: giảng viên / học viên / sinh viên chỉ gửi dòng MỚI
       (gốc gửi lại mọi dòng → trùng / xoá trắng vai trò). giangdaysaudaihoc giữ đúng chỗ gốc TRÁO strNoiDung ↔ strThoiGian.
     · detaisinhvien: xoá giảng viên đã lưu gốc lỗi JS (biến không tồn tại) → chạy được; ô "Mô tả" ẩn bị gốc ghi đè
       bằng "Tên sinh viên" (strMoTa khai hai lần) → chỉ còn ô Tên sinh viên.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nckh, e = N.e;
    var K = N.khacMan = {};
    function uid() { return N.uid(); }
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 4 }, o || {}); }
    function tep(label, note) {
        var a = [{ key: '_tep', type: 'files', api: 'NCKH_Files', label: label || 'File đính kèm' }];
        if (note) a.push({ type: 'note', label: note });
        return a;
    }
    /** Thêm người đăng nhập làm thành viên sau khi THÊM MỚI (giaithuong, vanbangsangche) */
    function themToi(id, x) {
        return N.g('NCKH_ThanhVien/ThemMoi', { strSanPham_Id: id, strNCKH_TinhDiem_KeHoach_Id: x.nam, strThanhVien_Id: uid(), strVaiTro_Id: '', dTyLeThamGia: '',
            strChucNang_Id: N.chucNang(), strNguoiThucHien_Id: uid() }, true).catch(function (err) { ums.api.handle(err, 'thêm thành viên'); });
    }
    /** Phân loại của NCKH_SP_HuongDan_GiangDay: mục MA = ma của danh mục NCKH.VTHDGD */
    function phanLoai(ma) {
        return ums.api.dm('NCKH.VTHDGD').then(function (d) { var x = d.filter(function (r) { return r.MA === ma; })[0]; return x ? x.ID : ''; }).catch(function () { return ''; });
    }

    /* ---------- Giải thưởng — NCKH_GiaiThuong ---------------------------- */
    K.giaithuong = function (root) {
        return N.man(root, {
            tieuDe: 'Giải thưởng', dsTieuDe: 'Danh sách giải thưởng', icon: 'fa-trophy', formTitle: 'giải thưởng', ctl: 'NCKH_GiaiThuong', paged: false,
            loiChao: 'Hôm nay bạn có giải thưởng mới không? Bấm Thêm mới ở đầu trang.',
            ten: function (r) { return e(r.NOIDUNGGIAITHUONG); },
            ds: function (q) {
                return { strNCKH_TinhDiem_KeHoach_Id: q.nam, strTuKhoa: q.q, iTrangThai: 1, strCanBoNhap_Id: '', strNCKH_QuanLyDeTai_Id: '', strnckh_detai_thanhvien_id: uid(),
                    strVaiTro_Id: '', strDonViCuaThanhVien_Id: '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strCapKhenThuong_Id: '', strTinhTrangXacNhan_Id: '',
                    strNhanSu_TDKT_KeHoach_Id: q.nam, pageIndex: 1, pageSize: 100000 };
            },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin' },
                f('strNoiDungGiaiThuong', 'NOIDUNGGIAITHUONG', 'Nội dung giải thưởng', { required: true, cols: 12 }),
                f('strCapKhenThuong_Id', 'CAPKHENTHUONG_ID', 'Cấp khen thưởng', { type: 'select', required: true, cols: 6, source: { dm: 'NCKH.LKT' } }),
                f('strSoQuyetDinh', 'SOQUYETDINH', 'Số quyết định', { required: true, cols: 6 }),
                f('strHinhThuc', 'HINHTHUC', 'Hình thức khen thưởng', { required: true, cols: 6 }),
                f('dSoNguoiThamGia_n', 'SONGUOITHAMGIAVAOCONGTRINH_N', 'Số người', { required: true, type: 'number', cols: 6 }),
                f('strNamTangThuong', 'NAMTANGTHUONG', 'Năm', { required: true, cols: 6 }),
                f('strThangTangThuong', 'THANGTANGTHUONG', 'Tháng tặng thưởng', { required: true, cols: 6 }),
                { type: 'legend', label: 'Nội dung minh chứng' },
                f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung minh chứng', { span: true })
            ].concat(tep()),
            khoi: [N.deTai({ key: 'strNCKH_QuanLyDeTai_Id', khoaTT: 'iTrangThai' })],
            luu: function (v, row, x) {
                return { strNCKH_TinhDiem_KeHoach_Id: x.nam, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNCKH_DeTai_ThanhVien_Id: uid(), strChucNang_Id: N.chucNang(),
                    strVaiTro_Id: '', strHinhThuc: v.strHinhThuc, strNoiDungGiaiThuong: v.strNoiDungGiaiThuong, strNamTangThuong: v.strNamTangThuong,
                    strThangTangThuong: v.strThangTangThuong, dSoGioQuyDoiDuocTinh_n: '', strFileMinhChung: '', strThongTinMinhChung: v.strThongTinMinhChung, strMaSanPham: '',
                    dSoNguoiThamGia_n: v.dSoNguoiThamGia_n, strCapKhenThuong_Id: v.strCapKhenThuong_Id, strSoQuyetDinh: v.strSoQuyetDinh, strLoaiDoiTuong_Id: '',
                    dTrangThai: 1, dThuTu: 0, strCanBoNhap_Id: uid(), strNguoiThucHien_Id: uid() };
            },
            sauThem: themToi
        });
    };

    /* ---------- Văn bằng sáng chế — NCKH_VanBangSangChe ------------------- */
    K.vanbangsangche = function (root) {
        return N.man(root, {
            tieuDe: 'Văn bằng sáng chế', dsTieuDe: 'Văn bằng sáng chế', icon: 'fa-file-certificate', formTitle: 'văn bằng sáng chế', ctl: 'NCKH_VanBangSangChe',
            ten: function (r) { return e(r.TENVANBANG); },
            ds: function (q) {
                return { strTuKhoa: q.q, iTrangThai: 1, strNCKH_QuanLyDeTai_Id: '', strNCKH_DETAI_THANHVIEN_Id: uid(), strCanboNhap_Id: '', strVaitro_Id: '',
                    strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: q.nam, strNCKH_TinhDiem_KeHoach_Id: q.nam };
            },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin' },
                f('strTenVanBang', 'TENVANBANG', 'Tên VBSC/SKKN', { required: true, cols: 12 }),
                f('strMaSanPham', 'MASANPHAM', 'Mã văn bằng', { cols: 6 }),
                f('strNamCapVanBang', 'NAMCAPVANBANG', 'Thời gian cấp', { type: 'date', cols: 6 }),
                f('strDonViCap', 'DONVICAP', 'Đơn vị cấp', { cols: 6 }), f('strNoiCap', 'NOICAP', 'Nơi cấp', { cols: 6 }),
                f('strSoQuyetDinh', 'NHANSU_TTQUYETDINH_SOQD', 'Số quyết định', { cols: 6 }),
                f('strNgayQuyetDinh', 'NHANSU_TTQUYETDINH_NGAYQD', 'Ngày ký quyết định', { type: 'date', cols: 6 }),
                f('strNoiDungVanBang', 'NOIDUNGVANBANG', 'Nội dung', { type: 'textarea', span: true }),
                { type: 'legend', label: 'Nội dung minh chứng' },
                f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { type: 'textarea', span: true })
            ].concat(tep()),
            khoi: [N.tepRieng({ tieuDe: 'File đính kèm QĐ', hauTo: '_QD' }), N.deTai({ key: 'strNCKH_QuanLyDeTai_Id', khoaTT: 'iTrangThai' })],
            luu: function (v, row, x) {
                return { strNhanSu_ThongTinQD_Id: '', strSoQuyetDinh: v.strSoQuyetDinh, strNgayQuyetDinh: v.strNgayQuyetDinh, strNguoiKyQuyetDinh: '', strNgayHieuLuc: '',
                    strThongTinQuyetDinh: '', strLoaiQuyetDinh_Id: '', strNgayHetHieuLuc: '', iTrangThai: 1, iThuTu: 1, strDonViCap: v.strDonViCap, strNoiCap: v.strNoiCap,
                    strFileMinhChung: '', strThongTinMinhChung: v.strThongTinMinhChung, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNCKH_DeTai_ThanhVien_Id: uid(),
                    strVaiTro_Id: '', strTenVanBang: v.strTenVanBang, strNoiDungVanBang: v.strNoiDungVanBang, strNamCapVanBang: v.strNamCapVanBang,
                    strNCKH_TinhDiem_KeHoach_Id: x.nam, strThangCapVanBang: '', strCANBONHAP_Id: uid(), strMaSanPham: v.strMaSanPham };
            },
            sauThem: themToi
        });
    };

    /* ---------- Hội nghị hội thảo — NCKH_HoiNghiHoiThao -------------------- */
    K.hoinghihoithao = function (root) {
        function ds(q, nam, m) {
            var o = { strTuKhoa: m ? m.q : q.q, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: m ? m.linhVuc : '', strNCKH_QuanLyDeTai_Id: '', strPhamViHoiNghiHoiThao_Id: '',
                strNCKH_DeTai_ThanhVien_Id: m ? '' : uid(), strVaitro_Id: '', strDonViCuaThanhVien_Id: m ? m.donVi : '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                strTinhTrangXacNhan_Id: '', strDonViToChuc_Id: '', strNhanSu_TDKT_KeHoach_Id: m ? '' : nam };
            if (m) o.iTrangThai = 1; else { o.dTrangThai = 1; o.strNCKH_TinhDiem_KeHoach_Id = nam; }
            return o;
        }
        return N.man(root, {
            tieuDe: 'Hội nghị hội thảo', dsTieuDe: 'Danh sách hội nghị/hội thảo', icon: 'fa-presentation-screen', formTitle: 'hội nghị hội thảo', ctl: 'NCKH_HoiNghiHoiThao',
            ten: function (r) { return e(r.TENHOINGHIHOITHAO); },
            ds: function (q) { return ds(q, q.nam); },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin hội nghị hội thảo' },
                f('strTenHoiNghiHoiThao', 'TENHOINGHIHOITHAO', 'Tên hội nghị', { required: true, cols: 12 }),
                f('strDonViToChuc_Id', 'DONVITOCHUC_ID', 'Đơn vị tổ chức', { type: 'select', required: true, cols: 6, source: { dm: 'NCKH.DTHT' } }),
                f('strDonViToChuc_Khac', 'DONVITOCHUC_KHAC', 'Đơn vị tổ chức khác', { cols: 6 }),
                f('strDiaDiem', 'DIADIEM', 'Địa điểm tổ chức', { cols: 6 }),
                f('strThoiGianToChuc', 'THOIGIANTOCHUC', 'Thời gian tổ chức', { type: 'date', cols: 6 }),
                f('strPhamViHoiNghiHoiThao_Id', 'PHAMVIHOINGHIHOITHAO_ID', 'Phạm vi/Cấp', { type: 'select', cols: 6, placeholder: 'Tất cả phạm vi', source: { dm: 'NCKH.PVHT' } }),
                f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực/Ngành', { type: 'select', cols: 6, placeholder: 'Tất cả lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
                f('strTenBaoCao', 'TENBAOCAO', 'Chủ đề hội nghị hội thảo', { cols: 12 }),
                f('strMucTieu', 'MUCTIEU', 'Mục tiêu', { cols: 12 }),
                f('strNoiDung', 'NOIDUNG', 'Nội dung', { type: 'textarea', span: true }),
                f('strNamHoanThanh', 'NAMHOANTHANH', 'Năm tổ chức'), f('strNamBaoCao', 'NAMBAOCAO', 'Tháng tổ chức', { required: true }),
                f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm', { required: true }),
                { type: 'legend', label: 'Số đại biểu tham dự' },
                f('dSoDaiBieuQuocTe', 'SODAIBIEUQUOCTE', 'Quốc tế', { type: 'number' }),
                f('dSoDaiBieuTrongNuoc', 'SODAIBIEUTRONGNUOC', 'Trong nước', { type: 'number' }),
                f('dSoLuongBaoCao', 'SOLUONGBAOCAO', 'Số lượng báo cáo', { type: 'number' }),
                f('dSoLuongNguoiBaoCao', 'SOLUONGNGUOIBAOCAO', 'Số người báo cáo', { type: 'number', cols: 6 }),
                f('strThanhPhanThamGia', 'THANHPHANTHAMGIA', 'Thành phần tham gia', { cols: 6 }),
                { type: 'legend', label: 'Nội dung minh chứng' },
                f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { type: 'textarea', span: true })
            ].concat(tep()),
            khoi: [N.kinhPhi({ khoaThem: 'strIds' }), N.thanhVien({ vaiTro: 'NCKH.VTHT', tieuDeTrong: 'Thành viên tham gia' }),
                N.deTai({ key: 'strNCKH_QuanLyDeTai_Id', khoaTT: 'iTrangThai' })],
            luu: function (v, row, x) {
                var p = { strGhiChu: '', strDiaDiem: v.strDiaDiem, strNCKH_TinhDiem_KeHoach_Id: x.nam, strThoiGianToChuc: v.strThoiGianToChuc, dTyLeThamGia: 0,
                    dSoDaiBieuTrongNuoc: v.dSoDaiBieuTrongNuoc, dSoDaiBieuQuocTe: v.dSoDaiBieuQuocTe, strDonViToChuc_Id: v.strDonViToChuc_Id,
                    strTenHoiNghiHoiThao: v.strTenHoiNghiHoiThao, strTenBaoCao: v.strTenBaoCao, dSoTacGia_n: v.dSoLuongNguoiBaoCao, strNamBaoCao: v.strNamBaoCao,
                    strThuocLinhVucNao_Id: v.strThuocLinhVucNao_Id, strPhamViHoiNghiHoiThao_Id: v.strPhamViHoiNghiHoiThao_Id, strNCKH_DeTai_ThanhVien_Id: '', strVaitro_Id: '',
                    strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNamHoanThanh: v.strNamHoanThanh, strFileMinhChung: '', strThongTinMinhChung: v.strThongTinMinhChung,
                    strDonViToChuc_Khac: v.strDonViToChuc_Khac, strMaSanPham: v.strMaSanPham, strMucTieu: v.strMucTieu, strNoiDung: v.strNoiDung,
                    dSoLuongBaoCao: v.dSoLuongBaoCao, dSoLuongNguoiBaoCao: v.dSoLuongNguoiBaoCao, strThanhPhanThamGia: v.strThanhPhanThamGia, strChucNang_Id: N.chucNang(),
                    dTrangThai: 1, dThuTu: 1, strCanBoNhap_Id: uid() };
                if (row) p.strNhanSu_TDKT_KeHoach_Id = x.nam;       // chỉ CapNhat gửi khoá này (như gốc)
                return p;
            },
            tim: { nut: 'Tìm hội nghị', truong: 'strTenHoiNghiHoiThao', title: 'Tìm kiếm hội nghị hội thảo', chonText: 'Chọn hội nghị',
                cot: [{ title: 'Tên hội nghị', prop: 'TENHOINGHIHOITHAO' }, { title: 'Tên báo cáo', prop: 'TENBAOCAO' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO_TEN' }],
                ds: function (m, nam) { return ds(null, nam, m); } }
        });
    };

    /* ---------- Đề tài sinh viên — NCKH_SP_QuanLyDeTaiSinhVien -------------- */
    K.detaisinhvien = function (root) {
        return N.man(root, {
            tieuDe: 'Đề tài sinh viên', dsTieuDe: 'Đề tài sinh viên', icon: 'fa-user-graduate', formTitle: 'đề tài sinh viên', ctl: 'NCKH_SP_QuanLyDeTaiSinhVien', nam: false,
            loiChao: 'Hôm nay bạn có đề tài mới không? Bấm Thêm mới ở đầu trang.',
            ten: function (r) { return e(r.TENDETAI); },
            ds: function (q) { return { strTuKhoa: q.q, strXepLoai_Id: '', strNguoiThucHien_Id: '', strTinhTrangXacNhan_Id: '', strThanhVien_Id: uid() }; },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin đề tài' },
                f('strTenDeTai', 'TENDETAI', 'Tên đề tài', { required: true, cols: 12 }),
                f('strNamThucHien', 'NAMTHUCHIEN', 'Năm thực hiện', { cols: 6 }), f('strNamNghiemThu', 'NAMNGHIEMTHU', 'Năm nghiệm thu', { cols: 6 }),
                f('strQuyetDinhPheDuyet', 'QUYETDINHPHEDUYET', 'QĐ phê duyệt', { cols: 6 }), f('strQuyetDinhNghiemThu', 'QUYETDINHNGHIEMTHU', 'QĐ nghiệm thu', { cols: 6 }),
                f('strDiemNghiemThu', 'DIEMNGHIEMTHU', 'Điểm nghiệm thu', { cols: 6 }),
                f('strXepLoai_Id', 'XEPLOAI_ID', 'Xếp loại', { type: 'select', cols: 6, source: { dm: 'NCKH.XLDT' } }),
                f('strMoTa', 'MOTA', 'Tên sinh viên, nhóm sinh viên thực hiện', { cols: 12 }),
                { type: 'legend', label: 'Nội dung minh chứng' }
            ].concat(tep()),
            khoi: [N.kinhPhi({ khoaThem: 'strId' }),
                N.thanhVien({ tieuDeTrong: 'Giảng viên hướng dẫn', vaiTro: null }),
                N.nguoi({ tieuDe: 'Sinh viên thực hiện', nguon: 'sinhvien', vaiTro: 'NCKH.VTSV',
                    list: function (id) { return { action: 'NCKH_SP_QLDTSV_SinhVien/LayDanhSach', strNCKH_SP_SinhVien_DeTai_Id: id }; },
                    map: function (x) { return { id: e(x.SINHVIEN_ID), rowId: e(x.ID), ten: (e(x.HODEM) + ' ' + e(x.TEN)).trim() + ' - ' + e(x.MASO), vaiTroTen: e(x.VAITRO_TEN) }; },
                    save: function (r, id) { return { action: 'NCKH_SP_QLDTSV_SinhVien/ThemMoi', strId: '', strNCKH_SP_QuanLyDeTaiSV_Id: id, strDanhSachSV_Ids: r.id, strVaiTro_Ids: e(r.vaiTro), strNguoiThucHien_Id: uid() }; },
                    xoa: function (r) { return { action: 'NCKH_SP_QLDTSV_SinhVien/Xoa', strIds: r.rowId, strNguoiThucHien_Id: uid() }; } }),
                N.deTai({ key: 'strNCKH_QuanLyDeTai_Id', khoaTT: 'iTrangThai' })],
            luu: function (v, row, x) {
                return { strTenDeTai: v.strTenDeTai, strNamThucHien: v.strNamThucHien, strDiemNghiemThu: v.strDiemNghiemThu, strXepLoai_Id: v.strXepLoai_Id, strMoTa: v.strMoTa,
                    strNamNghiemThu: v.strNamNghiemThu, strQuyetDinhPheDuyet: v.strQuyetDinhPheDuyet, strQuyetDinhNghiemThu: v.strQuyetDinhNghiemThu,
                    strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, dSoTacGia_n: '', strNguoiThucHien_Id: uid() };
            }
        });
    };

    /* ---------- Giảng dạy / Hướng dẫn sau đại học — NCKH_SP_HuongDan_GiangDay ---------- */
    function sauDaiHoc(root, loai) {
        var gd = loai === 'GIANGDAY', pl = phanLoai(loai), plId = '';
        pl.then(function (v) { plId = v; });
        var hv = N.nguoi({ tieuDe: 'Học viên tham gia', nguon: 'sinhvien',
            list: function (id) { return { action: 'NCKH_SP_HDGD_SinhVien/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
            map: function (x) { return e(x.LATHANHVIENCUATRUONG) === '0' ? null : { id: e(x.ID), ten: (e(x.HODEM) + ' ' + e(x.TEN)).trim() + ' - ' + e(x.MASO) }; },
            save: function (r, id) { return { action: 'NCKH_SP_HDGD_SinhVien/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strSinhVien_Ids: r.id, strNguoiThucHien_Id: uid() }; },
            xoa: function (r, id) { return { action: 'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien', strSinhVien_Ids: r.id, strNCKH_SP_HD_GD_Id: id, strNguoiThucHien_Id: uid() }; } });
        var gv = gd
            ? N.nguoi({ tieuDe: 'Giảng viên', nguon: 'nhansu', tuThem: true,
                them: [{ key: 'thoiGian', title: 'Thời gian (số tháng giảng dạy)' }, { key: 'noiDung', title: 'Nội dung' }],
                list: function (id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
                // Gốc hiện NOIDUNGGIANGDAY dưới cột "Thời gian" và THOIGIAN dưới "Nội dung" (khớp chỗ tráo khi lưu)
                map: function (x) { return e(x.LATHANHVIENCUATRUONG) === '0' ? null : { id: e(x.GIANGVIEN_ID), rowId: e(x.ID), ten: (e(x.HODEM) + ' ' + e(x.TEN)).trim() + ' - ' + e(x.MASO),
                    thoiGian: e(x.NOIDUNGGIANGDAY), noiDung: e(x.THOIGIAN) }; },
                save: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strGiangVien_Ids: r.id,
                    strNoiDung: e(r.thoiGian), strThoiGian: e(r.noiDung), strNguoiThucHien_Id: uid() }; },
                xoa: function (r) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/Xoa', strIds: r.rowId }; } })
            : N.nguoi({ tieuDe: 'Giảng viên hướng dẫn', nguon: 'nhansu', tuThem: true, vaiTro: 'NCKH.VHSV',
                list: function (id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
                map: function (x) { return e(x.LATHANHVIENCUATRUONG) === '0' ? null : { id: e(x.GIANGVIEN_ID), rowId: e(x.ID), ten: (e(x.HODEM) + ' ' + e(x.TEN)).trim() + ' - ' + e(x.MASO),
                    vaiTroTen: e(x.VAITRO_TEN) }; },
                save: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strGiangVien_Ids: r.id, strVaiTro_Ids: e(r.vaiTro), strNguoiThucHien_Id: uid() }; },
                xoa: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/Xoa', strIds: r.rowId, strNCKH_SP_HD_GD_Id: id, strNguoiThucHien_Id: uid() }; } });
        var man = N.man(root, {
            tieuDe: gd ? 'Giảng dạy sau đại học' : 'Hướng dẫn sau đại học', dsTieuDe: 'Danh sách', icon: gd ? 'fa-chalkboard-user' : 'fa-user-tie',
            formTitle: gd ? 'giảng dạy sau đại học' : 'hướng dẫn sau đại học', ctl: 'NCKH_SP_HuongDan_GiangDay', nam: false, paged: false,
            loiChao: 'Hôm nay bạn có kế hoạch mới không? Bấm Thêm mới ở đầu trang.',
            ten: function (r) { return e(r.TENDETAI_GIANGDAY); },
            ds: function (q) { return { strTuKhoa: q.q, strPhanLoai_Id: plId, strThanhVien_Id: uid(), strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 }; },
            formCols: 12,
            fields: [
                { type: 'legend', label: gd ? 'Khởi tạo giảng dạy sau đại học' : 'Khởi tạo hướng dẫn sau đại học' },
                f('strTenDeTai_GiangDay', 'TENDETAI_GIANGDAY', gd ? 'Tên học phần' : 'Tên đề tài', { required: true, cols: 12 }),
                f('strMoTa', 'MOTA', gd ? 'Tên lớp dạy' : 'Tên học viên/Tên nghiên cứu sinh', { cols: 12 }),
                { type: 'legend', label: gd ? 'Thời gian giảng dạy' : 'Thời gian hướng dẫn' },
                f('strThoiGianBatDau', 'THOIGIANBATDAU', 'Từ tháng', { hint: 'mm/yyyy' }), f('strThoiGianKetThuc', 'THOIGIANKETTHUC', 'Đến tháng', { hint: 'mm/yyyy' }),
                f('strNamNghiemThu', 'NAMNGHIEMTHU', 'Năm nghiệm thu'),
                { type: 'legend', label: 'Nội dung minh chứng' }
            ].concat(tep(gd ? 'File đính kèm (Giấy báo giảng)' : 'File đính kèm (QĐ hướng dẫn, QĐ bảo vệ)')),
            khoi: [gv, hv],
            choNap: pl,
            luu: function (v) {
                return { strTenDeTai_GiangDay: v.strTenDeTai_GiangDay, strNamNghiemThu: v.strNamNghiemThu, strThoiGianBatDau: v.strThoiGianBatDau,
                    strThoiGianKetThuc: v.strThoiGianKetThuc, dSoTacGia_n: gd ? 1 : '', strMoTa: v.strMoTa, strPhanLoai_Id: plId, iTrangThai: 1, iThuTu: 0, strNguoiThucHien_Id: uid() };
            }
        });
        return man;
    }
    K.giangdaysaudaihoc = function (root) { return sauDaiHoc(root, 'GIANGDAY'); };
    K.huongdansaudaihoc = function (root) { return sauDaiHoc(root, 'HUONGDAN'); };
})();
