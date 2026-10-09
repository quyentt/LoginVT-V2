/* =========================================================================
   sanphamkhoahoc — cấu hình các màn BÀI BÁO / KỶ YẾU / SÁCH: ums.nckh.baiBao[kieu](root)
   tapchiquocte (NCKH_TapChiQuocTe), tapchiquocgia (NCKH_TapChiQuocGia), kyyeuhoinghi (NCKH_KyYeu),
   thongtinsach (NCKH_Sach). Khung chung: ums.nckh.man (_sanpham.js).
   Tên tham số / cột chép NGUYÊN từng .js gốc — kể cả chỗ gốc viết lệch (strNCKH_QUANLYDETAI_ID viết
   hoa ở tapchiquocgia / kyyeuhoinghi, strnckh_detai_thanhvien_id viết thường ở thongtinsach).
   Khác bản gốc (ghi ở can-quyet.js):
     · Ô bắt buộc (*): gốc tắt kiểm tra (`if (true)`) — bản mới kiểm theo đúng dấu (*) trên nhãn.
     · tapchiquocte / tapchiquocgia: "Tên tạp chí" gốc bị ẨN khi chưa chọn danh mục (switchLoaiKhac) nên
       không nhập được → chỉ ẩn khi đã chọn một tạp chí trong danh mục (tự điền), hiện khi chưa chọn / ZLOAIKHAC.
     · thongtinsach: sửa sách gốc KHÔNG đổ ô "Thành viên khác" (lưu đè rỗng) → đổ đúng.
     · kyyeuhoinghi: cột Lĩnh vực của hộp tìm gốc đọc THUOCLINHVUCNAO (có thể sai tên) — giữ, kiểm trên host.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, N = ums.nckh, e = N.e;
    var BB = N.baiBao = {};
    function uid() { return N.uid(); }
    var NOTE_ISSN = 'Chú ý: File đính kèm là pdf chứa các hình ảnh (trang bìa, trang đầu, trang cuối, mục lục, số ISSN)';
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 4 }, o || {}); }
    function minhChung(noteText) {
        return [{ type: 'legend', label: 'Nội dung minh chứng' },
            f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { type: 'textarea', span: true }),
            { key: '_tep', type: 'files', api: 'NCKH_Files', label: 'File đính kèm' },
            { type: 'note', label: noteText || NOTE_ISSN }];
    }
    function dmTapChi(ctl) {
        return { call: { action: ctl + '/LayDanhSach', method: 'GET', strTuKhoa: '', strTenTapChiDang_Id: '', strLoaiTapChi_Id: '', strCoQuanXuatBan_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 }, name: 'TENTAPCHIDANG' };
    }
    /** Chọn danh mục tạp chí → tự điền (viewEdit/select2:select gốc); ô Tên tạp chí ẩn khi đã chọn tạp chí có sẵn */
    function ganDanhMuc(c, k, dien) {
        var sel = c.root.querySelector('[data-scope="form"][data-k="' + k.dm + '"]');
        if (!sel || !window.jQuery) return;
        function o(key) { return c.root.querySelector('[data-scope="form"][data-k="' + key + '"]'); }
        function hien() {
            var ds = (c.cfg.fields.filter(function (x) { return x.key === k.dm; })[0].source._ds) || [];
            var r = ds.filter(function (x) { return e(x.ID) === sel.value; })[0];
            var khac = !r || e(r.MATAPCHIDANG) === 'ZLOAIKHAC';
            if (o(k.ten)) o(k.ten).closest('.ums-field').parentNode.hidden = !khac;
            if (o(k.issn)) o(k.issn).readOnly = !khac;
            if (k.heSo && o(k.heSo) && k.heSoKhoa) o(k.heSo).readOnly = !khac;
            return { r: r, khac: khac };
        }
        jQuery(sel).off('.nkdm').on('select2:select.nkdm select2:clear.nkdm', function () {
            var x = hien();
            if (x.r && !x.khac) dien(x.r, o);
            else [k.ten, k.issn, k.ma].concat(k.heSo ? [k.heSo] : []).forEach(function (key) { if (o(key)) o(key).value = ''; });
        });
        var src = c.cfg.fields.filter(function (x) { return x.key === k.dm; })[0].source;
        ums.crud.loadSource(src).then(function (d) { src._ds = d; hien(); });
    }

    /* ---------- Tạp chí quốc tế ---------------------------------------- */
    BB.tapchiquocte = function (root) {
        var CT = 'NCKH_TapChiQuocTe';
        return N.man(root, {
            tieuDe: 'Tạp chí quốc tế', dsTieuDe: 'Tạp chí quốc tế', icon: 'fa-newspaper', formTitle: 'bài báo quốc tế', ctl: CT,
            ten: function (r) { return e(r.TENBAIBAO); },
            ds: function (q) {
                return { strTuKhoa: q.q, dTrangThai: 1, strCanBoNhap_Id: '', strNCKH_DeTai_ThanhVien_Id: uid(), strThuocLinhVucNao_Id: '', strNCKH_QuanLyDeTai_Id: '',
                    strPhanLoaiTapChi_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strDonViCuaThanhVien_Id: '', strNCKH_SP_DMTapChiQT_Id: '', strVaitro_Id: '',
                    strTinhTrangXacNhan_Id: '', strNCKH_TinhDiem_KeHoach_Id: q.nam, strNhanSu_TDKT_KeHoach_Id: q.nam };
            },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin bài báo' },
                f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm', { cols: 6 }),
                f('strTenBaiBao', 'TENBAIBAO', 'Tên bài báo', { required: true, cols: 12 }),
                f('strNCKH_SP_DMTapChiQT_Id', 'NCKH_SP_DANHMUCTAPCHIQT_ID', 'Danh mục tạp chí', { type: 'select', cols: 6, placeholder: 'Chọn tạp chí từ danh mục', source: dmTapChi('NCKH_DMTapChiQuocTe') }),
                f('strTenTapChi', 'TENTAPCHI', 'Tên tạp chí', { required: true, cols: 4 }),
                f('strChiSo_ISSN', 'CHISO_ISSN', 'Mã ISSN', { cols: 2 }),
                f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', cols: 6, placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC', name: 'THONGTIN1' } }),
                f('strLoaiBao_Id', 'LOAIBAO_ID', 'Loại bài báo', { type: 'select', cols: 6, source: { dm: 'NCKH.LBAO' } }),
                f('dHeSoIF_n', 'HESOIF_N', 'Hệ số IF'), f('strDOI', 'DOI', 'Số doi', { cols: 8 }),
                f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả', { required: true, type: 'number' }),
                f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường', { type: 'number' }),
                f('dTrongDanhMucISI_Scopus', 'CONAMTRONGDANHMUCISI_SCOPUS', 'Có nằm trong danh mục ISI/Scopus', { type: 'select',
                    source: { items: [{ ID: '-1', TEN: 'Không xét' }, { ID: '0', TEN: 'Không' }, { ID: '1', TEN: 'Có' }] } }),
                f('strTapCuaTapChi', 'TAPCUATAPCHI', 'Tập'), f('strSoTapChi', 'SOTAPCHI', 'Số'), f('strTrangTapChi', 'TRANGTAPCHI', 'Trang'),
                f('strNamHoanThanh', 'NAMHOANTHANH', 'Năm hoàn thành'), f('strNamCongBo', 'NAMCONGBO', 'Năm công bố', { required: true }),
                f('strThangCongBo', 'THANGCONGBO', 'Tháng công bố', { required: true }),
                f('strTenBaiBaoTrichDan_Pubmed', 'TENBAIBAOTRICHDAN_PUBMED', 'Trích dẫn (Pubmed, PMCID, PMID ...)', { type: 'textarea', span: true })
            ].concat(minhChung()),
            khoi: [N.thanhVien({ vaiTro: 'NCKH.VTQT', ngoai: true }), N.khac({ key: 'strDanhSachCacThanhVienNgoai', col: 'DANHSACHCACTHANHVIENNGOAI' }),
                N.deTai({ key: 'strNCKH_QuanLyDeTai_Id', khoaTT: 'dTrangThai' })],
            luu: function (v, row, x) {
                var heSo = v.dHeSoIF_n;
                if (heSo.indexOf(',') !== -1 && heSo.indexOf('.') === -1) heSo = heSo.replace(/,/g, '.');
                return { dTyLeThamGia: '', strTenTacGia: '', strChucNang_Id: N.chucNang(), strNCKH_SP_DMTapChiQT_Id: v.strNCKH_SP_DMTapChiQT_Id,
                    strThuocLinhVucNao_Id: v.strThuocLinhVucNao_Id, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNamCongBo: v.strNamCongBo,
                    strTenTapChi: v.strTenTapChi, strChiSo_ISSN: v.strChiSo_ISSN, strThangCongBo: v.strThangCongBo, dSoTacGiaTrongTruong_n: v.dSoTacGiaTrongTruong_n,
                    dTrongDanhMucISI_Scopus: v.dTrongDanhMucISI_Scopus, strLoaiBao_Id: v.strLoaiBao_Id, strDOI: v.strDOI, dHeSoIF_n: heSo, dSoTacGia_n: v.dSoTacGia_n,
                    strNamHoanThanh: v.strNamHoanThanh, strTenBaiBao: v.strTenBaiBao, strThongTinMinhChung: v.strThongTinMinhChung, strNCKH_DeTai_ThanhVien_Id: '',
                    strLaThanhVienCuaTruong: '', strVaitro_Id: '', dTrangThai: 1, dThuTu: 1, strCanBoNhap_Id: uid(), strNCKH_TinhDiem_KeHoach_Id: x.nam,
                    strTenBaiBaoTrichDan_Pubmed: v.strTenBaiBaoTrichDan_Pubmed, strTapCuaTapChi: v.strTapCuaTapChi, strSoTapChi: v.strSoTapChi,
                    strTrangTapChi: v.strTrangTapChi, strDanhSachCacThanhVienNgoai: x.strDanhSachCacThanhVienNgoai, strMaSanPham: v.strMaSanPham };
            },
            tim: { nut: 'Tìm bài báo', truong: 'strTenBaiBao', title: 'Tìm kiếm bài báo', chonText: 'Chọn bài báo',
                cot: [{ title: 'Tên bài báo', prop: 'TENBAIBAO' }, { title: 'Tên tạp chí', prop: 'TENTAPCHI' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' },
                    { title: 'Thành viên', prop: 'DSTHANHVIEN_VAITRO' }],
                ds: function (m, nam) {
                    return { strTuKhoa: m.q, dTrangThai: 1, strCanBoNhap_Id: '', strNCKH_DeTai_ThanhVien_Id: '', strThuocLinhVucNao_Id: m.linhVuc, strNCKH_QuanLyDeTai_Id: '',
                        strPhanLoaiTapChi_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strDonViCuaThanhVien_Id: m.donVi, strNCKH_TinhDiem_KeHoach_Id: nam,
                        strNCKH_SP_DMTapChiQT_Id: '', strVaitro_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '' };
                } },
            onForm: function (row, c) {
                ganDanhMuc(c, { dm: 'strNCKH_SP_DMTapChiQT_Id', ten: 'strTenTapChi', issn: 'strChiSo_ISSN', ma: 'strMaSanPham', heSo: 'dHeSoIF_n' }, function (r, o) {
                    o('strTenTapChi').value = e(r.TENTAPCHIDANG); o('strChiSo_ISSN').value = e(r.CHISO_ISSN);
                    o('strMaSanPham').value = e(r.MATAPCHIDANG); o('dHeSoIF_n').value = e(r.DIEM);
                });
            }
        });
    };

    /* ---------- Tạp chí trong nước -------------------------------------- */
    BB.tapchiquocgia = function (root) {
        var CT = 'NCKH_TapChiQuocGia';
        return N.man(root, {
            tieuDe: 'Tạp chí trong nước', dsTieuDe: 'Tạp chí trong nước', icon: 'fa-newspaper', formTitle: 'bài báo trong nước', ctl: CT,
            ten: function (r) { return e(r.TENBAIBAO); },
            ds: function (q) {
                return { strTuKhoa: q.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: '', strNCKH_QuanLyDeTai_Id: '', strPhanLoaiTapChi_Id: '',
                    strNCKH_DeTai_ThanhVien_Id: uid(), strVaitro_Id: '', strDonViCuaThanhVien_Id: '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                    strNCKH_SP_DMTapChiQG_Id: '', strLoaiBao_Id: '', strTinhTrangXacNhan_Id: '', strNCKH_TinhDiem_KeHoach_Id: q.nam, strNhanSu_TDKT_KeHoach_Id: q.nam };
            },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin bài báo' },
                f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm', { cols: 8 }),
                f('strTenBaiBao', 'TENBAIBAO', 'Tên bài báo', { required: true, cols: 12 }),
                f('strNCKH_SP_DMTapChiQG_Id', 'NCKH_SP_DANHMUCTAPCHIQG_ID', 'Danh mục tạp chí', { type: 'select', cols: 8, placeholder: 'Chọn danh mục tạp chí', source: dmTapChi('NCKH_DMTapChiQuocGia') }),
                f('strTenTapChi', 'TENTAPCHI', 'Tên tạp chí', { cols: 8 }), f('strChiSo_ISSN', 'CHISO_ISSN', 'Mã ISSN'),
                f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', source: { dm: 'NCKH.LVNC' } }),
                f('strLoaiBao_Id', 'LOAIBAO_ID', 'Loại bài báo', { type: 'select', source: { dm: 'NCKH.LBAO' } }),
                f('dDiem_ISSN', 'DIEM_ISSN', 'Hệ số'),
                f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả', { required: true, type: 'number', cols: 6 }),
                f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường', { type: 'number', cols: 6 }),
                f('strTapCuaTapChi', 'TAPCUATAPCHI', 'Tập'), f('strSoTapChi', 'SOTAPCHI', 'Số'), f('strTrangTapChi', 'TRANGTAPCHI', 'Trang'),
                f('strNamHoanThanh', 'NAMHOANTHANH', 'Năm hoàn thành'), f('strNamCongBo', 'NAMCONGBO', 'Năm công bố', { required: true }),
                f('strThangCongBo', 'THANGCONGBO', 'Tháng công bố', { required: true }),
                f('strTenBaiBaoTrichDan_Pubmed', 'TENBAIBAOTRICHDAN_PUBMED', 'Trích dẫn (Pubmed, PMCID, PMID ...)', { type: 'textarea', span: true })
            ].concat(minhChung()),
            khoi: [N.thanhVien({ vaiTro: 'NCKH.VTQG', ngoai: true }), N.khac({ key: 'strDanhSachCacThanhVienNgoai', col: 'DANHSACHCACTHANHVIENNGOAI' }),
                N.deTai({ key: 'strNCKH_QUANLYDETAI_ID', khoaTT: 'iTrangThai' })],
            luu: function (v, row, x) {
                return { strTyLeThamGia: '', strNCKH_SP_DMTapChiQG_Id: v.strNCKH_SP_DMTapChiQG_Id, strTenBaiBao: v.strTenBaiBao, strThuocLinhVucNao_Id: v.strThuocLinhVucNao_Id,
                    strNCKH_QUANLYDETAI_ID: x.strNCKH_QUANLYDETAI_ID, strNCKH_DeTai_ThanhVien_Id: '', strLaThanhVienCuaTruong: '', strVaitro_Id: '',
                    strNamCongBo: v.strNamCongBo, strTenTapChi: v.strTenTapChi, strChiSo_ISSN: v.strChiSo_ISSN, dDiem_ISSN: v.dDiem_ISSN, strThangCongBo: v.strThangCongBo,
                    dSoTacGiaTrongTruong_n: v.dSoTacGiaTrongTruong_n, dSoTacGia_n: v.dSoTacGia_n, strNamHoanThanh: v.strNamHoanThanh, strPhanLoaiTapChi_Id: '',
                    strThongTinMinhChung: v.strThongTinMinhChung, iTrangThai: 1, strCanBoNhap_Id: uid(), iThuTu: 1, strTenBaiBaoTrichDan_Pubmed: v.strTenBaiBaoTrichDan_Pubmed,
                    strNCKH_TinhDiem_KeHoach_Id: x.nam, strNhanSu_TDKT_KeHoach_Id: x.nam, strTapCuaTapChi: v.strTapCuaTapChi, strSoTapChi: v.strSoTapChi,
                    strTrangTapChi: v.strTrangTapChi, strMaSanPham: v.strMaSanPham, strLoaiBao_Id: v.strLoaiBao_Id,
                    strDanhSachCacThanhVienNgoai: x.strDanhSachCacThanhVienNgoai, strChucNang_Id: N.chucNang(), dHeSoIF_n: '' };
            },
            tim: { nut: 'Tìm bài báo', truong: 'strTenBaiBao', title: 'Tìm kiếm bài báo', chonText: 'Chọn bài báo',
                cot: [{ title: 'Tên bài báo', prop: 'TENBAIBAO' }, { title: 'Tên tạp chí', prop: 'TENTAPCHI' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' },
                    { title: 'Thành viên', prop: 'DSTHANHVIEN_VAITRO' }],
                ds: function (m, nam) {
                    return { strTuKhoa: m.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: m.linhVuc, strNCKH_QuanLyDeTai_Id: '', strPhanLoaiTapChi_Id: '',
                        strNCKH_DeTai_ThanhVien_Id: '', strVaitro_Id: '', strDonViCuaThanhVien_Id: m.donVi, strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                        strNCKH_SP_DMTapChiQG_Id: '', strLoaiBao_Id: '', strTinhTrangXacNhan_Id: '', strNCKH_TinhDiem_KeHoach_Id: nam, strNhanSu_TDKT_KeHoach_Id: '' };
                } },
            onForm: function (row, c) {
                ganDanhMuc(c, { dm: 'strNCKH_SP_DMTapChiQG_Id', ten: 'strTenTapChi', issn: 'strChiSo_ISSN', ma: 'strMaSanPham', heSo: 'dDiem_ISSN', heSoKhoa: true }, function (r, o) {
                    o('strTenTapChi').value = e(r.TENTAPCHIDANG); o('strChiSo_ISSN').value = e(r.CHISO_ISSN);
                    o('dDiem_ISSN').value = e(r.DIEM); o('strMaSanPham').value = e(r.MATAPCHIDANG);
                });
            }
        });
    };

    /* ---------- Kỷ yếu hội nghị ----------------------------------------- */
    BB.kyyeuhoinghi = function (root) {
        var CT = 'NCKH_KyYeu';
        function ds(q, nam, m) {
            return { strTuKhoa: m ? m.q : q.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: m ? m.linhVuc : '', strNCKH_QuanLyDeTai_Id: '', strLoaiKyYeu_Id: '',
                strTinhTrangXacNhan_Id: '', strNCKH_DeTai_ThanhVien_Id: m ? '' : uid(), strVaitro_Id: '', strDonViCuaThanhVien_Id: m ? m.donVi : '', strLoaiHocVi_Id: '',
                strLoaiChucDanh_Id: '', strNCKH_TinhDiem_KeHoach_Id: m ? undefined : nam, strNhanSu_TDKT_KeHoach_Id: m ? '' : nam };
        }
        return N.man(root, {
            tieuDe: 'Kỷ yếu hội nghị', dsTieuDe: 'Kỷ yếu/hội nghị', icon: 'fa-book-open', formTitle: 'kỷ yếu hội nghị', ctl: CT,
            ten: function (r) { return e(r.TENBAIBAO); },
            ds: function (q) { return ds(q, q.nam); },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin bài báo' },
                f('strTenBaiBao', 'TENBAIBAO', 'Tên bài báo', { required: true, cols: 12 }),
                f('strTenTapChi', 'TENTAPCHI', 'Tên kỷ yếu', { required: true, cols: 8 }), f('strChiSo_ISBN', 'CHISO_ISBN', 'Số ISBN'),
                f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', cols: 6, source: { dm: 'NCKH.LVNC' } }),
                f('strPhanLoaiTapChi_Id', 'PHANLOAITAPCHI_ID', 'Loại kỷ yếu', { type: 'select', cols: 6, source: { dm: 'NCKH.LKY' } }),
                f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm', { required: true }),
                f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả', { required: true, type: 'number' }),
                f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường', { type: 'number' }),
                f('strTapCuaTapChi', 'TAPCUATAPCHI', 'Tập'), f('strSoTapChi', 'SOTAPCHI', 'Số'), f('strTrangTapChi', 'TRANGTAPCHI', 'Trang'),
                f('strNamHoanThanh', 'NAMHOANTHANH', 'Năm hoàn thành'), f('strNamCongBo', 'NAMCONGBO', 'Năm công bố', { required: true }),
                f('strThangCongBo', 'THANGCONGBO', 'Tháng công bố', { required: true }),
                f('strTenBaiBaoTrichDan_Pubmed', 'TENBAIBAOTRICHDAN_PUBMED', 'Trích dẫn', { type: 'textarea', span: true })
            ].concat(minhChung()),
            khoi: [N.thanhVien({ vaiTro: 'NCKH.VTQG', ngoai: true }), N.deTai({ key: 'strNCKH_QUANLYDETAI_ID', khoaTT: 'dTrangThai' })],
            luu: function (v, row, x) {
                return { strTyLeThamGia: '', strTenBaiBao: v.strTenBaiBao, strThuocLinhVucNao_Id: v.strThuocLinhVucNao_Id, strNCKH_QUANLYDETAI_ID: x.strNCKH_QUANLYDETAI_ID,
                    strVaitro_Id: '', strNCKH_DeTai_ThanhVien_Id: '', strLaThanhVienCuaTruong: '', strNamCongBo: v.strNamCongBo, strThangCongBo: v.strThangCongBo,
                    strTenTapChi: v.strTenTapChi, strChiSo_ISBN: v.strChiSo_ISBN, dSoTacGiaTrongTruong_n: v.dSoTacGiaTrongTruong_n, strPhanLoaiTapChi_Id: v.strPhanLoaiTapChi_Id,
                    dSoTacGia_n: v.dSoTacGia_n, strNamHoanThanh: v.strNamHoanThanh, strThongTinMinhChung: v.strThongTinMinhChung, iThuTu: 1, strCanBoNhap_Id: uid(),
                    strTenBaiBaoTrichDan_Pubmed: v.strTenBaiBaoTrichDan_Pubmed, strTapCuaTapChi: v.strTapCuaTapChi, strSoTapChi: v.strSoTapChi,
                    strNCKH_TinhDiem_KeHoach_Id: x.nam, strTrangTapChi: v.strTrangTapChi, strMaSanPham: v.strMaSanPham, iTrangThai: 1 };
            },
            tim: { nut: 'Tìm bài báo', truong: 'strTenBaiBao', title: 'Tìm kiếm bài báo', chonText: 'Chọn bài báo',
                cot: [{ title: 'Tên bài báo', prop: 'TENBAIBAO' }, { title: 'Tên kỷ yếu', prop: 'TENTAPCHI' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' }],
                ds: function (m, nam) { return ds(null, nam, m); } }
        });
    };

    /* ---------- Thông tin sách ------------------------------------------- */
    BB.thongtinsach = function (root) {
        var CT = 'NCKH_Sach';
        return N.man(root, {
            tieuDe: 'Thông tin sách', dsTieuDe: 'Danh sách sản phẩm', icon: 'fa-books', formTitle: 'thông tin sách', ctl: CT,
            ten: function (r) { return e(r.TENSACH); },
            ds: function (q) {
                return { strTuKhoa: q.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: '', strNCKH_QuanLyDeTai_Id: '', strPhanLoaiSach_Id: '',
                    strnckh_detai_thanhvien_id: uid(), strVaiTro_Id: '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strTinhTrangXacNhan_Id: '', strDonViCuaThanhVien_Id: '',
                    strLanXuatBan_Id: '', strNCKH_TinhDiem_KeHoach_Id: q.nam, strNhanSu_TDKT_KeHoach_Id: q.nam };
            },
            formCols: 12,
            fields: [
                { type: 'legend', label: 'Thông tin sách' },
                f('strTenSach', 'TENSACH', 'Tên sách', { required: true, cols: 12 }),
                f('strNamXuatBan', 'NAMXUATBAN', 'Năm xuất bản', { required: true }), f('strThangXuatBan', 'THANGXUATBAN', 'Tháng xuất bản', { required: true }),
                f('strLanXuatBan_Id', 'LANXUATBAN_ID', 'Lần xuất bản', { type: 'select', required: true, source: { dm: 'NCKH.TTS.LANXUATBAN' } }),
                f('dSoTacGia_n', 'SOTACGIA_N', 'Số tác giả', { required: true, type: 'number' }),
                f('dSoTrangThamGiaViet_n', 'SOTRANGTHAMGIAVIET_N', 'Số trang viết', { type: 'number' }),
                f('dSoTrangSach_n', 'SOTRANGSACH_N', 'Tổng số trang', { type: 'number' }),
                f('strNhaXuatBan', 'NHAXUATBAN', 'Nhà xuất bản', { required: true }), f('strChiSo_ISBN', 'CHISO_ISBN', 'Số ISBN'),
                f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường', { type: 'number' }),
                f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', source: { dm: 'NCKH.LVNC' } }),
                f('strPhanLoaiSach_Id', 'PHANLOAISACH_ID', 'Loại sách', { type: 'select', required: true, source: { dm: 'NCKH.PHLS' } }),
                f('dSoTinChi', 'SOTINCHI', 'Số tín chỉ', { type: 'number' }),
                f('strTenSachTrichDan', 'TENSACHTRICHDAN', 'Trích dẫn', { type: 'textarea', span: true })
            ].concat(minhChung('Chú ý: File đính kèm là pdf chứa các hình ảnh (trang bìa, trang đầu, trang cuối, mục lục, số ISBN). Có thể ghép file tại: https://smallpdf.com/vi')),
            khoi: [N.thanhVien({ vaiTro: 'NCKH.VTVS', ngoai: true, tyLe: true }), N.khac({ key: 'strDanhSachCacThanhVienNgoai', col: 'DANHSACHCACTHANHVIENNGOAI' }),
                N.deTai({ key: 'strNCKH_QuanLyDeTai_Id', khoaTT: 'iTrangThai' })],
            luu: function (v, row, x) {
                return { strTyLeThamGia: '', strTenSach: v.strTenSach, strThuocLinhVucNao_Id: v.strThuocLinhVucNao_Id, strNCKH_DeTai_ThanhVien_Id: '', strVaiTro_Id: '',
                    strNhaXuatBan: v.strNhaXuatBan, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNamXuatBan: v.strNamXuatBan, dSoTacGia_n: v.dSoTacGia_n,
                    dSoDongChuBien_n: '', dSoTrangSach_n: v.dSoTrangSach_n, dSoTrangThamGiaViet_n: v.dSoTrangThamGiaViet_n, strPhanLoaiSach_Id: v.strPhanLoaiSach_Id,
                    strNamHoanThanh: '', strFileMinhChung: '', strThongTinMinhChung: v.strThongTinMinhChung, strMaSanPham: '', strThangXuatBan: v.strThangXuatBan,
                    strChiSo_ISBN: v.strChiSo_ISBN, dSoTinChi: v.dSoTinChi, strTap: '', strLanXuatBan_Id: v.strLanXuatBan_Id, strNhanSu_TDKT_KeHoach_Id: x.nam,
                    strNCKH_TinhDiem_KeHoach_Id: x.nam, iTrangThai: 1, iThuTu: '', strCanBoNhap_Id: uid(), strDanhSachCacThanhVienNgoai: x.strDanhSachCacThanhVienNgoai,
                    dSoTacGiaTrongTruong_n: v.dSoTacGiaTrongTruong_n, strTenSachTrichDan: v.strTenSachTrichDan };
            },
            tim: { nut: 'Tìm sách', truong: 'strTenSach', title: 'Tìm kiếm sách', chonText: 'Chọn sách',
                cot: [{ title: 'Tên sách', prop: 'TENSACH' }, { title: 'Loại sách', prop: 'PHANLOAISACH' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' },
                    { title: 'Thành viên', prop: 'DSTHANHVIEN_VAITRO' }],
                ds: function (m, nam) {
                    return { strTuKhoa: m.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: m.linhVuc, strNCKH_TinhDiem_KeHoach_Id: nam, strNCKH_QuanLyDeTai_Id: '',
                        strPhanLoaiSach_Id: '', strnckh_detai_thanhvien_id: '', strVaiTro_Id: '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strDonViCuaThanhVien_Id: '',
                        strLanXuatBan_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '' };
                } }
        });
    };
})();
