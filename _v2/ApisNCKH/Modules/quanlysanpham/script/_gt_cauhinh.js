/* =========================================================================
   NCKH — cấu hình Giải thưởng / Văn bằng sáng chế / Hội nghị hội thảo cho khung ums.nckhGT (_gt_sanpham.js)
     ums.nckhGT.quanTriMan[kieu](root)  — ApisNCKH/Modules/quanlysanpham/script/<kieu>.js (hai cột, kê khai thay cán bộ)
     ums.nckhGT.xacNhanMan[kieu](root)  — ApisNCKH/Modules/xacnhankekhai/script/<kieu>.js (một cột, xác nhận kê khai)
   Tham số chép NGUYÊN từng .js gốc NCKH (khác bản Cổng cán bộ ở nhiều chỗ — xem từng hàm).
   Khác bản gốc / tự chốt:
     · Đơn vị thành viên → Thành viên: chưa chọn đơn vị thì KHOÁ ô thành viên (luật cha → con; gốc nạp sẵn toàn trường).
     · Quản trị: Xoá sản phẩm bằng nút Xoá trong biểu mẫu (gốc: thùng rác trên từng dòng cột trái) — như bản Cổng cán bộ.
     · Quản trị: bắt buộc nhập ĐÚNG các ô gốc kiểm (arrValid_*); nhãn gốc còn ghi (*) ở vài ô không kiểm — không bắt.
     · Quản trị Giải thưởng: gốc sau ThemMoi gọi me.getList_VBSC() không tồn tại (TypeError) → nạp lại danh sách.
     · Quản trị Văn bằng: html gốc KHÔNG có bảng thành viên (mã JS thêm người đăng nhập vào bảng không tồn tại) → không có
       khối thành viên, như gốc. Ô "Số quyết định" / "Ngày ký quyết định" gốc hiện mà không gửi → gửi theo bản Cổng cán bộ
       cùng controller (strSoQuyetDinh, strNgayQuyetDinh…); "File đính kèm" trong nhóm Thông tin gốc chưa gắn uploadFiles →
       làm theo bản CCB: tệp QĐ gắn <id>_QD (N.tepRieng).
     · Quản trị Hội nghị: nút "Tìm hội nghị" gốc không có xử lý → giữ nút, khoá (disabled).
     · Xác nhận: biểu mẫu gốc không có nút Lưu → khung CHI TIẾT CHỈ XEM (.ums-kv) + nút "Xác nhận sản phẩm".
     · Xác nhận: ô "Tất cả tình trạng" gốc KHÔNG nạp gì (luôn trống) → nạp các tình trạng của LayDMXacNhanTheoNguoiDung.
     · Xác nhận Văn bằng: cột "Nội dung xác nhận" gốc đổ nhầm KETQUAXACNHAN_TEN → KETQUAXACNHAN_NOIDUNG như hai màn kia.
     · Xác nhận Giải thưởng: tên sản phẩm trong hộp xác nhận gốc lấy HINHTHUC → lấy NOIDUNGGIAITHUONG (tên ở cột trái).
     · Xác nhận: đổi trạng thái xong gốc đợi 500ms rồi nạp lại → nạp lại khi máy chủ trả lời.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nckh, G = ums.nckhGT, e = N.e;
    function uid() { return N.uid(); }
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 6 }, o || {}); }
    function tep() { return [{ key: '_tep', type: 'files', api: 'NCKH_Files', label: 'File đính kèm' }]; }
    var QM = G.quanTriMan = {}, XM = G.xacNhanMan = {};

    /* =====================================================================
       GIẢI THƯỞNG — NCKH_GiaiThuong
       ===================================================================== */
    var GT = {
        tieuDe: 'Giải thưởng', dsTieuDe: 'Danh sách giải thưởng', icon: 'fa-trophy', formTitle: 'giải thưởng', ctl: 'NCKH_GiaiThuong',
        ten: function (r) { return e(r.NOIDUNGGIAITHUONG); }
    };
    function dsGT(q, xn) {
        var o = { strTuKhoa: q.q, iTrangThai: 1, strCanBoNhap_Id: '', strNCKH_QuanLyDeTai_Id: q.detai };
        if (xn) o.strDaoTao_CoCauToChuc_Id = q.dv;
        Object.assign(o, { strnckh_detai_thanhvien_id: q.tv, strVaiTro_Id: '', strDonViCuaThanhVien_Id: q.dv, strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
            strCapKhenThuong_Id: '', strTinhTrangXacNhan_Id: xn ? q.tt : '', strNhanSu_TDKT_KeHoach_Id: q.nam });
        return o;
    }
    QM.giaithuong = function (root) {
        return G.quanTri(root, Object.assign({}, GT, {
            paged: false, loiChao: 'Hôm nay bạn có giải thưởng mới không? Bấm Thêm mới ở đầu trang.',
            ds: function (q) { return Object.assign(dsGT(q), { pageIndex: 1, pageSize: 100000 }); },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin' },
                f('strNoiDungGiaiThuong', 'NOIDUNGGIAITHUONG', 'Nội dung giải thưởng', { required: true, cols: 12 }),
                f('strCapKhenThuong_Id', 'CAPKHENTHUONG_ID', 'Cấp khen thưởng', { type: 'select', source: { dm: 'NCKH.LKT' }, placeholder: 'Chọn cấp khen thưởng' }),
                f('strSoQuyetDinh', 'SOQUYETDINH', 'Số quyết định', { required: true }),
                f('strHinhThuc', 'HINHTHUC', 'Hình thức khen thưởng'),
                f('dSoNguoiThamGia_n', 'SONGUOITHAMGIAVAOCONGTRINH_N', 'Số người'),
                f('strNamTangThuong', 'NAMTANGTHUONG', 'Năm'),
                f('strThangTangThuong', 'THANGTANGTHUONG', 'Tháng tặng thưởng'),
                { type: 'legend', label: 'Nội dung minh chứng' },
                f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung minh chứng', { cols: 12 })
            ].concat(tep()),
            khoi: [G.thanhVien({ them: function (x) { return { strNCKH_TinhDiem_KeHoach_Id: x.nam }; } }),
                G.deTai({ key: 'strNCKH_QuanLyDeTai_Id', src: G.nguonDeTai() })],
            luu: function (v, row, x) {
                return { strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNCKH_DeTai_ThanhVien_Id: uid(), strChucNang_Id: N.chucNang(),
                    strNCKH_TinhDiem_KeHoach_Id: x.nam, strVaiTro_Id: '', strHinhThuc: v.strHinhThuc, strNoiDungGiaiThuong: v.strNoiDungGiaiThuong,
                    strNamTangThuong: v.strNamTangThuong, strThangTangThuong: v.strThangTangThuong, dSoGioQuyDoiDuocTinh_n: '', strFileMinhChung: '',
                    strThongTinMinhChung: v.strThongTinMinhChung, strMaSanPham: '', dSoNguoiThamGia_n: v.dSoNguoiThamGia_n, strCapKhenThuong_Id: v.strCapKhenThuong_Id,
                    strSoQuyetDinh: v.strSoQuyetDinh, strLoaiDoiTuong_Id: '', dTrangThai: 1, dThuTu: 0, strCanBoNhap_Id: uid(), strNguoiThucHien_Id: uid() };
            }
        }));
    };
    XM.giaithuong = function (root) {
        return G.xacNhan(root, Object.assign({}, GT, {
            cotTen: 'Nội dung',
            cot: [{ title: 'Hình thức khen', prop: 'HINHTHUC' }, { title: 'Cấp khen', prop: 'CAPKHENTHUONG_TEN' },
                { title: 'Năm khen thưởng', prop: 'NAMTANGTHUONG', cls: 'is-center' }, { title: 'Số người', prop: 'SONGUOITHAMGIAVAOCONGTRINH_N', cls: 'is-center' }],
            ds: function (q) { return dsGT(q, true); },
            bc: { ma: 'GiaiThuong', thu: function (q) { return dsGT(q, true); } },
            xem: [{ legend: 'Thông tin' },
                { label: 'Nội dung giải thưởng', col: 'NOIDUNGGIAITHUONG', dai: true },
                { label: 'Hình thức khen thưởng', col: 'HINHTHUC' }, { label: 'Cấp khen thưởng', col: 'CAPKHENTHUONG_ID', dm: 'NCKH.LKT' },
                { label: 'Số quyết định', col: 'SOQUYETDINH' }, { label: 'Năm', col: 'NAMTANGTHUONG' },
                { label: 'Số người', col: 'SONGUOITHAMGIAVAOCONGTRINH_N' }]
        }));
    };

    /* =====================================================================
       VĂN BẰNG SÁNG CHẾ — NCKH_VanBangSangChe
       ===================================================================== */
    var VB = {
        tieuDe: 'Văn bằng sáng chế', dsTieuDe: 'Văn bằng sáng chế', icon: 'fa-file-certificate', formTitle: 'văn bằng sáng chế', ctl: 'NCKH_VanBangSangChe',
        ten: function (r) { return e(r.TENVANBANG); }
    };
    QM.vanbangsangche = function (root) {
        return G.quanTri(root, Object.assign({}, VB, {
            ds: function (q) {
                return { strTuKhoa: q.q, iTrangThai: 1, strNCKH_QuanLyDeTai_Id: q.detai, strNCKH_DETAI_THANHVIEN_Id: q.tv, strCanboNhap_Id: '', strVaitro_Id: '',
                    strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: q.nam };
            },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin' },
                f('strTenVanBang', 'TENVANBANG', 'Tên VBSC/Sáng kiến kinh nghiệm', { required: true, cols: 12 }),
                f('strMaSanPham', 'MASANPHAM', 'Mã văn bằng', { required: true }),
                f('strNamCapVanBang', 'NAMCAPVANBANG', 'Thời gian cấp', { required: true }),
                f('strSoQuyetDinh', 'NHANSU_TTQUYETDINH_SOQD', 'Số quyết định'),
                f('strNgayQuyetDinh', 'NHANSU_TTQUYETDINH_NGAYQD', 'Ngày ký quyết định', { type: 'date' }),
                f('strNoiDungVanBang', 'NOIDUNGVANBANG', 'Nội dung', { type: 'textarea', cols: 12 }),
                { type: 'legend', label: 'Nội dung minh chứng' },
                f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { type: 'textarea', cols: 12 })
            ].concat(tep()),
            khoi: [N.tepRieng({ tieuDe: 'File đính kèm QĐ', hauTo: '_QD' }), G.deTai({ key: 'strNCKH_QuanLyDeTai_Id', src: G.nguonDeTai() })],
            luu: function (v, row, x) {
                return { strThongTinMinhChung: v.strThongTinMinhChung, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id,
                    strNCKH_DETAI_THANHVIEN_Id: row ? '' : uid(),          // CapNhat gốc gửi rỗng, ThemMoi gửi người đăng nhập
                    strVaiTro_Id: '', strTenVanBang: v.strTenVanBang, strNoiDungVanBang: v.strNoiDungVanBang, strNamCapVanBang: v.strNamCapVanBang,
                    strThangCapVanBang: '', strCANBONHAP_Id: uid(), strMaSanPham: v.strMaSanPham, iTrangThai: 1, iThuTu: 1,
                    // (+) ô gốc hiện mà không gửi — gửi theo bản Cổng cán bộ cùng controller
                    strNhanSu_ThongTinQD_Id: '', strSoQuyetDinh: v.strSoQuyetDinh, strNgayQuyetDinh: v.strNgayQuyetDinh, strNguoiKyQuyetDinh: '',
                    strNgayHieuLuc: '', strThongTinQuyetDinh: '', strLoaiQuyetDinh_Id: '', strNgayHetHieuLuc: '' };
            }
        }));
    };
    function dsVBxn(q) {
        return { strTuKhoa: q.q, iTrangThai: 1, strDaoTao_CoCauToChuc_Id: q.dv, strNCKH_QuanLyDeTai_Id: q.detai, strNCKH_DETAI_THANHVIEN_Id: q.tv,
            strDonViCuaThanhVien_Id: q.dv, strCanboNhap_Id: '', strVaitro_Id: '', strTinhTrangXacNhan_Id: q.tt, strNhanSu_TDKT_KeHoach_Id: q.nam };
    }
    XM.vanbangsangche = function (root) {
        return G.xacNhan(root, Object.assign({}, VB, {
            dsTieuDe: 'Danh sách văn bằng sáng chế', cotTen: 'Tên văn bằng',
            cot: [{ title: 'Năm cấp văn bằng', prop: 'NAMCAPVANBANG', cls: 'is-center' }, { title: 'Tháng cấp văn bằng', prop: 'THANGCAPVANBANG', cls: 'is-center' },
                { title: 'Nội dung văn bằng', prop: 'NOIDUNGVANBANG' }],
            ds: dsVBxn,
            bc: { ma: 'VanBangSangChe', thu: function (q) {
                return { strTuKhoa: q.q, iTrangThai: 1, strNCKH_QuanLyDeTai_Id: q.detai, strNCKH_DETAI_THANHVIEN_Id: q.tv, strDonViCuaThanhVien_Id: q.dv,
                    strDaoTao_CoCauToChuc_Id: q.dv, strCanboNhap_Id: '', strVaitro_Id: '', strTinhTrangXacNhan_Id: q.tt, strNhanSu_TDKT_KeHoach_Id: q.nam };
            } },
            tvPageSize: 10000000,
            xem: [{ legend: 'Thông tin' },
                { label: 'Tên văn bằng', col: 'TENVANBANG', dai: true },
                { label: 'Mã văn bằng', col: 'MASANPHAM' }, { label: 'Năm cấp', col: 'NAMCAPVANBANG' },
                { label: 'Tháng cấp', col: 'THANGCAPVANBANG' }, { label: 'Nội dung', col: 'NOIDUNGVANBANG', dai: true }]
        }));
    };

    /* =====================================================================
       HỘI NGHỊ HỘI THẢO — NCKH_HoiNghiHoiThao
       ===================================================================== */
    var HN = {
        tieuDe: 'Hội nghị hội thảo', dsTieuDe: 'Danh sách hội nghị/hội thảo', icon: 'fa-presentation-screen', formTitle: 'hội nghị hội thảo', ctl: 'NCKH_HoiNghiHoiThao',
        ten: function (r) { return e(r.TENHOINGHIHOITHAO); }
    };
    function locHN() {
        return [G.locDm('pv', 'NCKH.PVHT', 'Tất cả phạm vi'), G.locDm('lv', 'NCKH.LVNC', 'Tất cả lĩnh vực'), G.locDm('dvtc', 'NCKH.DTHT', 'Chọn đơn vị tổ chức')];
    }
    function dsHN(q, xn) {
        var o = { strTuKhoa: q.q };
        if (xn) { o.dTrangThai = 1; o.strCanBoNhap_Id = ''; o.strDaoTao_CoCauToChuc_Id = q.dv; } else { o.iTrangThai = 1; o.strCanBoNhap_Id = ''; }
        return Object.assign(o, { strThuocLinhVucNao_Id: q.lv, strNCKH_QuanLyDeTai_Id: q.detai, strPhamViHoiNghiHoiThao_Id: q.pv, strNCKH_DeTai_ThanhVien_Id: q.tv,
            strVaitro_Id: '', strDonViCuaThanhVien_Id: q.dv, strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strDonViToChuc_Id: q.dvtc,
            strTinhTrangXacNhan_Id: xn ? q.tt : '', strNhanSu_TDKT_KeHoach_Id: q.nam });
    }
    QM.hoinghihoithao = function (root) {
        return G.quanTri(root, Object.assign({}, HN, {
            locThem: locHN(),
            ds: function (q) { return dsHN(q); },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin hội nghị hội thảo' },
                f('strTenHoiNghiHoiThao', 'TENHOINGHIHOITHAO', 'Tên hội nghị', { required: true, cols: 12 }),
                f('strDonViToChuc_Id', 'DONVITOCHUC_ID', 'Đơn vị tổ chức', { type: 'select', source: { dm: 'NCKH.DTHT' }, placeholder: 'Chọn đơn vị tổ chức' }),
                f('strDiaDiem', 'DIADIEM', 'Địa điểm tổ chức'),
                f('strThoiGianToChuc', 'THOIGIANTOCHUC', 'Thời gian tổ chức', { type: 'date' }),
                f('strPhamViHoiNghiHoiThao_Id', 'PHAMVIHOINGHIHOITHAO_ID', 'Phạm vi/Cấp', { type: 'select', placeholder: 'Tất cả phạm vi', source: { dm: 'NCKH.PVHT' } }),
                f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực/Ngành', { type: 'select', placeholder: 'Tất cả lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
                f('strTenBaoCao', 'TENBAOCAO', 'Chủ đề hội nghị hội thảo', { required: true, cols: 12 }),
                f('strMucTieu', 'MUCTIEU', 'Mục tiêu', { cols: 12 }),
                f('strNoiDung', 'NOIDUNG', 'Nội dung', { cols: 12 }),
                f('strNamHoanThanh', 'NAMHOANTHANH', 'Năm tổ chức'), f('strNamBaoCao', 'NAMBAOCAO', 'Tháng tổ chức'),
                f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm'), f('strChiSo_ISBN', 'CHISO_ISBN', 'Chỉ số ISBN'),
                { type: 'legend', label: 'Số đại biểu tham dự' },
                f('dSoDaiBieuQuocTe', 'SODAIBIEUQUOCTE', 'Quốc tế'), f('dSoDaiBieuTrongNuoc', 'SODAIBIEUTRONGNUOC', 'Trong nước'),
                f('dSoLuongBaoCao', 'SOLUONGBAOCAO', 'Số lượng báo cáo'), f('dSoLuongNguoiBaoCao', 'SOLUONGNGUOIBAOCAO', 'Số người báo cáo'),
                f('strThanhPhanThamGia', 'THANHPHANTHAMGIA', 'Thành phần tham gia', { cols: 12 }),
                { type: 'legend', label: 'Nội dung minh chứng' },
                f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { cols: 12 })
            ].concat(tep()),
            khoi: [N.kinhPhi({ khoaThem: 'strIds' }), G.thanhVien({ vaiTro: 'NCKH.VTHT' }), G.deTai({ key: 'strNCKH_QuanLyDeTai_Id', src: G.nguonDeTai() })],
            onForm: function (row, c) {
                // Nút "Tìm hội nghị" (btnSearchHNHT_BaiBao) gốc KHÔNG có xử lý → giữ nút, khoá
                var o = c.root.querySelector('[data-scope="form"][data-k="strTenHoiNghiHoiThao"]'), w = o && o.closest('.ums-field');
                if (w && !w.querySelector('.nk-tim')) w.insertAdjacentHTML('beforeend', '<div class="nk-tim">' +
                    ums.ui.btn('search', { text: 'Tìm hội nghị', mod: 'out-primary', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý' } }) + '</div>');
            },
            luu: function (v, row, x) {
                return { strGhiChu: '', strDiaDiem: v.strDiaDiem, strThoiGianToChuc: v.strThoiGianToChuc, dTyLeThamGia: 0,
                    dSoDaiBieuTrongNuoc: v.dSoDaiBieuTrongNuoc, dSoDaiBieuQuocTe: v.dSoDaiBieuQuocTe, strDonViToChuc_Id: v.strDonViToChuc_Id,
                    strTenHoiNghiHoiThao: v.strTenHoiNghiHoiThao, strTenBaoCao: v.strTenBaoCao, dSoTacGia_n: v.dSoLuongNguoiBaoCao, strNamBaoCao: v.strNamBaoCao,
                    strThuocLinhVucNao_Id: v.strThuocLinhVucNao_Id, strPhamViHoiNghiHoiThao_Id: v.strPhamViHoiNghiHoiThao_Id, strNCKH_DeTai_ThanhVien_Id: '',
                    strVaitro_Id: '', strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNamHoanThanh: v.strNamHoanThanh, strFileMinhChung: '',
                    strThongTinMinhChung: v.strThongTinMinhChung, strMaSanPham: v.strMaSanPham, strChiSo_ISBN: v.strChiSo_ISBN, strMucTieu: v.strMucTieu,
                    strNoiDung: v.strNoiDung, dSoLuongBaoCao: v.dSoLuongBaoCao, dSoLuongNguoiBaoCao: v.dSoLuongNguoiBaoCao, strThanhPhanThamGia: v.strThanhPhanThamGia,
                    iTrangThai: 1, iThuTu: 1, strCanBoNhap_Id: uid() };
            }
        }));
    };
    XM.hoinghihoithao = function (root) {
        return G.xacNhan(root, Object.assign({}, HN, {
            cotTen: 'Tên hội nghị', locThem: locHN(),
            cot: [{ title: 'Năm tổ chức', prop: 'NAMHOANTHANH', cls: 'is-center' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO_TEN' },
                { title: 'Phạm vi', prop: 'PHAMVIHOINGHIHOITHAO_TEN' }, { title: 'Số người báo cáo', prop: 'SOLUONGNGUOIBAOCAO', cls: 'is-center' }],
            ds: function (q) { return dsHN(q, true); },
            // Gốc: báo cáo gửi iTrangThai 1 và strNhanSu_TDKT_KeHoach_Id RỖNG (khác danh sách) — giữ
            bc: { ma: 'HoiThaoHoiNghi', thu: function (q) {
                return { strTuKhoa: q.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: q.lv, strNCKH_QuanLyDeTai_Id: q.detai, strPhamViHoiNghiHoiThao_Id: q.pv,
                    strNCKH_DeTai_ThanhVien_Id: q.tv, strVaitro_Id: '', strDonViCuaThanhVien_Id: q.dv, strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strDonViToChuc_Id: q.dvtc,
                    strTinhTrangXacNhan_Id: q.tt, strDaoTao_CoCauToChuc_Id: q.dv, strNhanSu_TDKT_KeHoach_Id: '' };
            } },
            kinhPhi: true, vaiTro: 'NCKH.VTHT',
            xem: [{ legend: 'Thông tin hội nghị hội thảo' },
                { label: 'Tên hội nghị', col: 'TENHOINGHIHOITHAO', dai: true },
                { label: 'Chủ đề hội nghị hội thảo', col: 'TENBAOCAO', dai: true },
                { label: 'Mục tiêu', col: 'MUCTIEU', dai: true }, { label: 'Nội dung', col: 'NOIDUNG', dai: true },
                { label: 'Năm tổ chức', col: 'NAMHOANTHANH' }, { label: 'Tháng tổ chức', col: 'NAMBAOCAO' },
                { label: 'Phạm vi/Cấp', col: 'PHAMVIHOINGHIHOITHAO_ID', dm: 'NCKH.PVHT' }, { label: 'Mã sản phẩm', col: 'MASANPHAM' },
                { label: 'Lĩnh vực/Ngành', col: 'THUOCLINHVUCNAO_ID', dm: 'NCKH.LVNC' }, { label: 'Đơn vị tổ chức', col: 'DONVITOCHUC_ID', dm: 'NCKH.DTHT' },
                { legend: 'Số đại biểu tham dự' },
                { label: 'Quốc tế', col: 'SODAIBIEUQUOCTE' }, { label: 'Trong nước', col: 'SODAIBIEUTRONGNUOC' },
                { label: 'Số lượng báo cáo', col: 'SOLUONGBAOCAO' }, { label: 'Số người báo cáo', col: 'SOLUONGNGUOIBAOCAO' },
                { label: 'Thành phần tham gia', col: 'THANHPHANTHAMGIA', dai: true }]
        }));
    };
})();
