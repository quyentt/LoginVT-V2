/* =========================================================================
   ApisNCKH — sản phẩm BÀI BÁO / KỶ YẾU / SÁCH (quản lý sản phẩm + xác nhận kê khai): ums.nckhBB.*
   ---------------------------------------------------------------------------
   DÙNG LẠI khung Cổng cán bộ ums.nckh (ApisCongCanBo/Modules/sanphamkhoahoc/script/_sanpham.js — KHÔNG sửa
   tệp đó; chỗ khác làm bằng lớp bọc ở đây). Bản gốc NCKH là bản QUẢN TRỊ (kê khai thay mọi cán bộ), CŨ hơn
   bản CCB ~30%:
     · cột trái có bộ lọc Đơn vị thành viên → Thành viên đăng ký (NS_HoSoV2/LayDanhSach theo đơn vị), Năm đánh giá
       (gửi strNhanSu_TDKT_KeHoach_Id, KHÔNG chọn sẵn), Lĩnh vực, Phân loại, Đề tài (TOÀN BỘ đề tài: strThanhVien_Id rỗng);
     · iTrangThai / iThuTu (bản CCB: dTrangThai / dThuTu); không có ô Danh mục tạp chí, ô "Thành viên khác", kế hoạch
       đánh giá khi lưu; NCKH_ThanhVien/Xoa không gửi strNguoiThucHien_Id;
     · Thêm mới KHÔNG tự thêm người đăng nhập (trừ Thông tin sách); chép từ hộp "Tìm …" thì CÓ (getDetail_HS gốc);
     · nút "Nhập tiếp" / "Viết lại" (btnReWrite = rewrite(): xoá trắng biểu mẫu về thêm mới).
   ---------------------------------------------------------------------------
   BB.SP[kieu]         cấu hình từng sản phẩm (tapchiquocte, tapchiquocgia, kyyeuhoinghi, thongtinsach):
                       ctl, tên cột, trường biểu mẫu, tham số lưu, tham số danh sách bản quản lý (dsQL) / bản xác nhận
                       (dsXN), tham số báo cáo (bc), cột bảng xác nhận (cotXN), hộp tìm (tim)
   BB.man(root, kieu)  màn QUẢN LÝ hai cột (bản sao có chỉnh của ums.nckh.man: thêm ô lọc cột trái, nút xoá trắng)
   BB.thanhVien(o)     bọc ums.nckh.thanhVien — mặc định không tự thêm mình; chép từ "Tìm" thì thêm (như gốc)
   BB.deTai(o)         bọc ums.nckh.deTai — nguồn đề tài bản quản trị (mọi đề tài)
   BB.ganDonVi(dv, tv, o)  cặp lọc Đơn vị → Thành viên (khoá con khi chưa chọn cha — pat.chain)
   Màn XÁC NHẬN KÊ KHAI (một cột): xacnhankekhai/script/_bb_xacnhan.js (BB.xnMan).
   Màn XEM bài báo cũ (baibaoquocte / baibaotrongnuoc): BB.xemMan dưới cuối tệp.
   ---------------------------------------------------------------------------
   Khác bản gốc (lỗi rõ → làm theo ý định; chi tiết ở báo cáo chuyển đổi):
     · tapchiquocte sửa: gốc đổ cột CONAMTRONGDANHMUCISI_SCOPUS vào ô "Số tác giả trong trường" và không đổ ô ISI →
       mỗi ô đổ đúng cột của nó.
     · tapchiquocte: nút tìm trong hộp "Tìm bài báo" gọi hàm KHÔNG tồn tại (getList_TCQG_Full) → tìm được.
     · Hệ số IF dấu phẩy thập phân đổi sang dấu chấm (như bản CCB mới hơn, cùng API).
     · thongtinsach: ô lọc "Vai trò" gốc nạp mà không gửi (strVaiTro_Id luôn rỗng) → gửi; nút "Lưu và Nhập tiếp" gốc
       chỉ xoá trắng (không lưu) → lưu rồi xoá trắng (đúng chữ trên nút).
     · Thêm mới xong về danh sách (gốc hỏi "tiếp tục thêm mới?" nhưng KHÔNG giữ id → bấm Lưu lần nữa là thêm TRÙNG).
     · Ô lọc Thành viên đăng ký khoá tới khi chọn Đơn vị (luật cha → con; gốc nạp sẵn toàn bộ cán bộ).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nckh;
    var BB = ums.nckhBB = ums.nckhBB || {};
    var e = N.e, arr = N.arr;
    function uid() { return N.uid(); }
    function esc(s) { return ui.esc(s); }
    BB.e = e; BB.arr = arr; BB.uid = uid;

    /* =====================================================================
       Nguồn dùng chung
       ===================================================================== */
    var nguonDT = {};
    /** Đề tài bản QUẢN TRỊ (getList_DeTai gốc: strThanhVien_Id rỗng; bản xác nhận thêm strDaoTao_CoCauToChuc_Id rỗng) */
    BB.nguonDeTai = function (xn) {
        var k = xn ? 'xn' : 'ql';
        if (nguonDT[k]) return nguonDT[k];
        var c = { action: 'NCKH_DeTai/LayDanhSach', method: 'GET', iTinhTrang: -1, iTrangThai: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: '',
            strTuKhoaText: '', dTuKhoaNumber: -1, strNCKH_DeCuong_Id: '', strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: '', strNguonKinhPhi_Id: '',
            strThietKeNghienCuu_Id: '', strNCKH_ThanhVien_Id: '', strDonVi_Id_CuaThanhVien_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '',
            strTinhTrang_Id: '', strPhanLoaiDeTai_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '', pageIndex: 1, pageSize: 10000000 };
        if (xn) c.strDaoTao_CoCauToChuc_Id = '';
        return (nguonDT[k] = { call: c, name: 'TENDETAITIENGVIET' });
    };
    /** Ô lọc "năm đánh giá" (getList_NamDanhGia gốc) — first: bản xác nhận chọn sẵn mục đầu, bản quản lý không */
    BB.locNam = function (first) {
        return { key: 'nam', type: 'select', label: 'Tất cả kế hoạch đánh giá', first: !!first,
            source: { call: { action: 'NCKH_TinhDiem_KeHoach/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 }, name: 'MOTA' } };
    };
    /** Thành viên đăng ký theo đơn vị (getList_HS gốc) */
    BB.thanhVienDK = function (dv, pageSize) {
        return ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: pageSize || 1000000,
            strDaoTao_CoCauToChuc_Id: dv, strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0, silent: true })
            .then(function (r) { return arr(r.data); });
    };
    /**
     * Cặp ô lọc Đơn vị thành viên → Thành viên đăng ký. o = { pageSize, onDoi() — gọi SAU khi ô con đã xoá trắng }.
     * pat.chain gắn TRƯỚC trình xử lý nạp để khi nạp lại danh sách thì ô con đã trống.
     */
    BB.ganDonVi = function (dv, tv, o) {
        o = o || {};
        if (!dv || !tv) return;
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(dv, d, { head: dv.getAttribute('data-ph') }); })
            .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
        pat.chain([dv, tv], { phatLai: false });
        if (!window.jQuery) return;
        jQuery(dv).on('select2:select select2:clear', function () {
            var v = dv.value;
            pat.fill(tv, [], { head: tv.getAttribute('data-ph') });
            if (o.onDoi) o.onDoi();
            if (!v) return;
            BB.thanhVienDK(v, o.pageSize).then(function (d) {
                if (dv.value !== v) return;
                pat.fill(tv, d, { head: tv.getAttribute('data-ph'), name: function (r) { return e(r.HOTEN) + (e(r.MASO) ? ' - ' + e(r.MASO) : ''); } });
            }).catch(function (err) { ums.api.handle(err, 'thành viên đăng ký'); });
        });
    };

    /* =====================================================================
       Khối bọc
       ===================================================================== */
    BB.thanhVien = function (o) {
        o = Object.assign({ tuThem: false }, o);
        var goc = o.tuThem;
        var K = N.thanhVien(o);                      // N.thanhVien đọc o.tuThem lúc gọi moi() → đổi tạm được
        K.chep = function () { o.tuThem = true; var p = K.moi(); o.tuThem = goc; return p; };
        return K;
    };
    BB.deTai = function (o) {
        var K = N.deTai(o), gan = K.gan;
        K.gan = function (host, c) {
            var cu = N.nguonDeTai;                    // N.deTai.gan gọi N.nguonDeTai ĐỒNG BỘ → thay tạm
            N.nguonDeTai = function () { return BB.nguonDeTai(o.xn); };
            try { return gan.call(K, host, c); } finally { N.nguonDeTai = cu; }
        };
        return K;
    };

    /* =====================================================================
       Cấu hình từng sản phẩm
       ===================================================================== */
    var NOTE_ISSN = 'Chú ý: File đính kèm là pdf chứa các hình ảnh (trang bìa, trang đầu, trang cuối, mục lục, số ISSN)';
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 4 }, o || {}); }
    function minhChung(note) {
        return [{ type: 'legend', label: 'Nội dung minh chứng' },
            f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { span: true, cols: 12 }),
            { key: '_tep', type: 'files', api: 'NCKH_Files', label: 'File đính kèm' },
            { type: 'note', label: note || NOTE_ISSN }];
    }
    function thoiGian() {
        return [f('strTapCuaTapChi', 'TAPCUATAPCHI', 'Tập'), f('strSoTapChi', 'SOTAPCHI', 'Số'), f('strTrangTapChi', 'TRANGTAPCHI', 'Trang'),
            f('strNamHoanThanh', 'NAMHOANTHANH', 'Năm hoàn thành'), f('strNamCongBo', 'NAMCONGBO', 'Năm công bố'), f('strThangCongBo', 'THANGCONGBO', 'Tháng công bố')];
    }
    function heSo(v) { v = e(v); return v.indexOf(',') !== -1 && v.indexOf('.') === -1 ? v.replace(/,/g, '.') : v; }
    /** Cột "Trích dẫn pubmed" của bảng xác nhận: liên kết, "+" / "_" thành khoảng trắng (như gốc) */
    function lienKet(v) { v = e(v); return v ? '<a href="' + esc(v) + '" target="_blank" rel="noopener">' + esc(v.replace(/\+/g, ' ').replace(/_/g, ' ')) + '</a>' : ''; }
    BB.lienKet = lienKet;
    /** Một dòng khung chi tiết chỉ xem (.ums-kv — chỉ TÊN in đậm, luật 13) */
    BB.kv = function (nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div>'; };
    var LOC_DV = { key: 'dv', type: 'select', label: 'Tất cả đơn vị thành viên' };
    var LOC_TV = { key: 'tv', type: 'select', label: 'Tất cả thành viên đăng ký' };
    function locLV() { return { key: 'lv', type: 'select', label: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }; }
    function locDT(xn) { return { key: 'dt', type: 'select', label: 'Chọn đề tài', source: BB.nguonDeTai(xn) }; }
    function locTT() { return { key: 'tt', type: 'select', label: 'Tất cả tình trạng xác nhận', source: { dm: 'NCKH.XNKK' } }; }
    BB.locTT = locTT;
    function v(x, k) { return x[k] === undefined ? '' : x[k]; }

    BB.SP = {};

    /* ---------- Tạp chí quốc tế (NCKH_TapChiQuocTe) ----------------------- */
    BB.SP.tapchiquocte = {
        ctl: 'NCKH_TapChiQuocTe', tieuDe: 'Tạp chí quốc tế', formTitle: 'bài báo quốc tế', icon: 'fa-newspaper', ten: 'TENBAIBAO',
        viet: 'Nhập tiếp', vaiTro: 'NCKH.VTQT',
        fields: [
            { type: 'legend', label: 'Thông tin bài báo' },
            f('strTenBaiBao', 'TENBAIBAO', 'Tên bài báo', { required: true, cols: 12 }),
            f('strTenTapChi', 'TENTAPCHI', 'Tên tạp chí', { required: true, cols: 8 }), f('strChiSo_ISSN', 'CHISO_ISSN', 'Mã ISSN', { required: true }),
            f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', cols: 8, placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
            f('strLoaiBao_Id', 'LOAIBAO_ID', 'Loại bài báo', { type: 'select', placeholder: 'Chọn loại bài báo', source: { dm: 'NCKH.LBAO' } }),
            f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm', { required: true }), f('dHeSoIF_n', 'HESOIF_N', 'Hệ số IF'), f('strDOI', 'DOI', 'Số doi'),
            f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả'), f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường'),
            f('dTrongDanhMucISI_Scopus', 'CONAMTRONGDANHMUCISI_SCOPUS', 'Có nằm trong danh mục ISI/Scopus', { type: 'select', xn: false,
                source: { items: [{ ID: '-1', TEN: 'Không xét' }, { ID: '0', TEN: 'Không' }, { ID: '1', TEN: 'Có' }] } })
        ].concat(thoiGian(), [f('strTenBaiBaoTrichDan_Pubmed', 'TENBAIBAOTRICHDAN_PUBMED', 'Trích dẫn', { type: 'textarea', span: true, cols: 12 })], minhChung()),
        deTaiKey: 'strNCKH_QuanLyDeTai_Id',
        luu: function (o, x) {
            return { dTyLeThamGia: '', strTenTacGia: '', strThuocLinhVucNao_Id: o.strThuocLinhVucNao_Id, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id,
                strNamCongBo: o.strNamCongBo, strTenTapChi: o.strTenTapChi, strChiSo_ISSN: o.strChiSo_ISSN, strThangCongBo: o.strThangCongBo,
                dSoTacGiaTrongTruong_n: o.dSoTacGiaTrongTruong_n, dTrongDanhMucISI_Scopus: o.dTrongDanhMucISI_Scopus, strLoaiBao_Id: o.strLoaiBao_Id,
                strDOI: o.strDOI, dHeSoIF_n: heSo(o.dHeSoIF_n), dSoTacGia_n: o.dSoTacGia_n, strNamHoanThanh: o.strNamHoanThanh, strTenBaiBao: o.strTenBaiBao,
                strThongTinMinhChung: o.strThongTinMinhChung, strNCKH_DeTai_ThanhVien_Id: '', strLaThanhVienCuaTruong: '', strVaitro_Id: '',
                iTrangThai: 1, iThuTu: 1, strCanBoNhap_Id: uid(), strTenBaiBaoTrichDan_Pubmed: o.strTenBaiBaoTrichDan_Pubmed, strTapCuaTapChi: o.strTapCuaTapChi,
                strSoTapChi: o.strSoTapChi, strTrangTapChi: o.strTrangTapChi, strMaSanPham: o.strMaSanPham };
        },
        locQL: function () { return [LOC_DV, LOC_TV, BB.locNam(false), locLV(), { key: 'pl', type: 'select', label: 'Chọn phân loại', source: { dm: 'NCKH.LBAO' } }, locDT()]; },
        locXN: function () { return [LOC_DV, LOC_TV, locTT(), locLV(), { key: 'pl', type: 'select', label: 'Chọn phân loại', source: { dm: 'NCKH.LBAO' } }, locDT(true), BB.locNam(true)]; },
        dsQL: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strThuocLinhVucNao_Id: v(q, 'lv'),
                strNCKH_QuanLyDeTai_Id: v(q, 'dt'), strPhanLoaiTapChi_Id: v(q, 'pl'), strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'),
                strNCKH_SP_DMTapChiQT_Id: '', strVaitro_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: v(q, 'nam') };
        },
        dsXN: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strDaoTao_CoCauToChuc_Id: v(q, 'dv'), strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'),
                strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'), strPhanLoaiTapChi_Id: v(q, 'pl'), strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '',
                strDonViCuaThanhVien_Id: v(q, 'dv'), strNCKH_SP_DMTapChiQT_Id: '', strVaitro_Id: '', strTinhTrangXacNhan_Id: v(q, 'tt'), strNhanSu_TDKT_KeHoach_Id: v(q, 'nam') };
        },
        bc: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'),
                strPhanLoaiTapChi_Id: v(q, 'pl'), strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strVaitro_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strLoaiHocVi_Id: '',
                strLoaiChucDanh_Id: '', strNCKH_SP_DMTapChiQT_Id: '', strLoaiBao_Id: '', strTinhTrangXacNhan_Id: v(q, 'tt'), strNhanSu_TDKT_KeHoach_Id: v(q, 'nam'),
                strDaoTao_CoCauToChuc_Id: v(q, 'dv') };
        },
        cotXN: [{ title: 'Tên tạp chí', prop: 'TENTAPCHI' }, { title: 'Tổng số tác giả', prop: 'SOTACGIA_N', cls: 'is-center' },
            { title: 'Năm công bố', prop: 'NAMCONGBO', cls: 'is-center' }, { title: 'Tháng công bố', prop: 'THANGCONGBO', cls: 'is-center' },
            { title: 'Hệ số IF', prop: 'HESOIF_N', cls: 'is-center' },
            { title: 'Trích dẫn pubmed', width: '110px', render: function (r) { return lienKet(r.TENBAIBAOTRICHDAN_PUBMED); } }],
        tim: { nut: 'Tìm bài báo', truong: 'strTenBaiBao', title: 'Tìm kiếm bài báo', chonText: 'Chọn bài báo',
            cot: [{ title: 'Tên bài báo', prop: 'TENBAIBAO' }, { title: 'Tên tạp chí', prop: 'TENTAPCHI' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' }],
            ds: function (m) {
                return { strTuKhoa: m.q, iTrangThai: 1, strCanBoNhap_Id: '', strNCKH_DeTai_ThanhVien_Id: '', strThuocLinhVucNao_Id: m.linhVuc, strNCKH_QuanLyDeTai_Id: '',
                    strPhanLoaiTapChi_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strDonViCuaThanhVien_Id: m.donVi, strNCKH_SP_DMTapChiQT_Id: '',
                    strVaitro_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '' };
            } },
        baoCaoText: ['Bài báo quốc tế', 'Bài báo quốc tế - Đầy đủ']
    };

    /* ---------- Tạp chí trong nước (NCKH_TapChiQuocGia) ------------------ */
    BB.SP.tapchiquocgia = {
        ctl: 'NCKH_TapChiQuocGia', tieuDe: 'Tạp chí trong nước', formTitle: 'bài báo trong nước', icon: 'fa-newspaper', ten: 'TENBAIBAO',
        viet: 'Nhập tiếp', vaiTro: 'NCKH.VTQG',
        fields: [
            { type: 'legend', label: 'Thông tin bài báo' },
            f('strTenBaiBao', 'TENBAIBAO', 'Tên bài báo', { required: true, cols: 12 }),
            f('strTenTapChi', 'TENTAPCHI', 'Tên tạp chí', { required: true, cols: 12 }),
            f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', cols: 8, placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
            f('strLoaiBao_Id', 'LOAIBAO_ID', 'Loại bài báo', { type: 'select', placeholder: 'Chọn loại bài báo', source: { dm: 'NCKH.LBAO' } }),
            f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm', { required: true }), f('strChiSo_ISSN', 'CHISO_ISSN', 'Mã ISSN', { required: true }),
            f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả'), f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường', { cols: 12 })
        ].concat(thoiGian(), [f('strTenBaiBaoTrichDan_Pubmed', 'TENBAIBAOTRICHDAN_PUBMED', 'Trích dẫn', { type: 'textarea', span: true, cols: 12 })], minhChung()),
        deTaiKey: 'strNCKH_QUANLYDETAI_ID',
        luu: function (o, x) {
            return { strTyLeThamGia: '', strTenBaiBao: o.strTenBaiBao, strThuocLinhVucNao_Id: o.strThuocLinhVucNao_Id, strNCKH_QUANLYDETAI_ID: x.strNCKH_QUANLYDETAI_ID,
                strNCKH_DeTai_ThanhVien_Id: '', strLaThanhVienCuaTruong: '', strVaitro_Id: '', strNamCongBo: o.strNamCongBo, strTenTapChi: o.strTenTapChi,
                strChiSo_ISSN: o.strChiSo_ISSN, strThangCongBo: o.strThangCongBo, dSoTacGiaTrongTruong_n: o.dSoTacGiaTrongTruong_n, dSoTacGia_n: o.dSoTacGia_n,
                strNamHoanThanh: o.strNamHoanThanh, strPhanLoaiTapChi_Id: '', strThongTinMinhChung: o.strThongTinMinhChung, iTrangThai: 1, strCanBoNhap_Id: uid(),
                iThuTu: 1, strTenBaiBaoTrichDan_Pubmed: o.strTenBaiBaoTrichDan_Pubmed, strTapCuaTapChi: o.strTapCuaTapChi, strSoTapChi: o.strSoTapChi,
                strTrangTapChi: o.strTrangTapChi, strMaSanPham: o.strMaSanPham, strLoaiBao_Id: o.strLoaiBao_Id, dHeSoIF_n: '' };
        },
        locQL: function () { return [LOC_DV, LOC_TV, BB.locNam(false), locLV(), { key: 'pl', type: 'select', label: 'Chọn loại bài báo', source: { dm: 'NCKH.LBAO' } }, locDT()]; },
        locXN: function () { return [LOC_DV, LOC_TV, locTT(), locLV(), { key: 'pl', type: 'select', label: 'Chọn loại bài báo', source: { dm: 'NCKH.LBAO' } }, locDT(true), BB.locNam(true)]; },
        dsQL: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'),
                strPhanLoaiTapChi_Id: v(q, 'pl'), strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strVaitro_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strLoaiHocVi_Id: '',
                strLoaiChucDanh_Id: '', strNCKH_SP_DMTapChiQG_Id: '', strLoaiBao_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: v(q, 'nam') };
        },
        dsXN: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'),
                strPhanLoaiTapChi_Id: v(q, 'pl'), strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strVaitro_Id: '', strDaoTao_CoCauToChuc_Id: v(q, 'dv'),
                strDonViCuaThanhVien_Id: v(q, 'dv'), strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strNCKH_SP_DMTapChiQG_Id: '', strLoaiBao_Id: '',
                strTinhTrangXacNhan_Id: v(q, 'tt'), strNhanSu_TDKT_KeHoach_Id: v(q, 'nam') };
        },
        bc: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'),
                strPhanLoaiTapChi_Id: v(q, 'pl'), strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strVaitro_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strLoaiHocVi_Id: '',
                strLoaiChucDanh_Id: '', strNCKH_SP_DMTapChiQG_Id: '', strLoaiBao_Id: '', strTinhTrangXacNhan_Id: v(q, 'tt'), strNhanSu_TDKT_KeHoach_Id: v(q, 'nam'),
                strDaoTao_CoCauToChuc_Id: v(q, 'dv') };
        },
        cotXN: [{ title: 'Tên tạp chí', prop: 'TENTAPCHI' }, { title: 'Tổng số tác giả', prop: 'SOTACGIA_N', cls: 'is-center' },
            { title: 'Năm công bố', prop: 'NAMCONGBO', cls: 'is-center' }, { title: 'Tháng công bố', prop: 'THANGCONGBO', cls: 'is-center' },
            { title: 'Trích dẫn pubmed', width: '110px', render: function (r) { return lienKet(r.TENBAIBAOTRICHDAN_PUBMED); } }],
        tim: { nut: 'Tìm bài báo', truong: 'strTenBaiBao', title: 'Tìm kiếm bài báo', chonText: 'Chọn bài báo',
            cot: [{ title: 'Tên bài báo', prop: 'TENBAIBAO' }, { title: 'Tên tạp chí', prop: 'TENTAPCHI' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' }],
            ds: function (m) {
                return { strTuKhoa: m.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: m.linhVuc, strNCKH_QuanLyDeTai_Id: '', strPhanLoaiTapChi_Id: '',
                    strNCKH_DeTai_ThanhVien_Id: '', strVaitro_Id: '', strDonViCuaThanhVien_Id: m.donVi, strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                    strNCKH_SP_DMTapChiQG_Id: '', strLoaiBao_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '' };
            } }
    };

    /* ---------- Kỷ yếu hội nghị (NCKH_KyYeu) ------------------------------ */
    BB.SP.kyyeuhoinghi = {
        ctl: 'NCKH_KyYeu', tieuDe: 'Kỷ yếu/hội nghị', formTitle: 'kỷ yếu/hội nghị', icon: 'fa-book-open', ten: 'TENBAIBAO',
        viet: 'Viết lại', vaiTro: 'NCKH.VTQG',
        fields: [
            { type: 'legend', label: 'Thông tin bài báo' },
            f('strTenBaiBao', 'TENBAIBAO', 'Tên bài báo', { required: true, cols: 12 }),
            f('strTenTapChi', 'TENTAPCHI', 'Tên kỷ yếu', { required: true, cols: 8 }), f('strChiSo_ISBN', 'CHISO_ISBN', 'Số ISBN', { required: true }),
            f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', cols: 8, placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
            f('strPhanLoaiTapChi_Id', 'PHANLOAITAPCHI_ID', 'Loại kỷ yếu', { type: 'select', placeholder: 'Chọn loại kỷ yếu', source: { dm: 'NCKH.LKY' } }),
            f('strMaSanPham', 'MASANPHAM', 'Mã sản phẩm'), f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả'),
            f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường')
        ].concat(thoiGian(), [f('strTenBaiBaoTrichDan_Pubmed', 'TENBAIBAOTRICHDAN_PUBMED', 'Trích dẫn', { type: 'textarea', span: true, cols: 12 })], minhChung()),
        deTaiKey: 'strNCKH_QUANLYDETAI_ID',
        luu: function (o, x) {
            return { strTyLeThamGia: '', strTenBaiBao: o.strTenBaiBao, strThuocLinhVucNao_Id: o.strThuocLinhVucNao_Id, strNCKH_QUANLYDETAI_ID: x.strNCKH_QUANLYDETAI_ID,
                strVaitro_Id: '', strNCKH_DeTai_ThanhVien_Id: '', strLaThanhVienCuaTruong: '', strNamCongBo: o.strNamCongBo, strThangCongBo: o.strThangCongBo,
                strTenTapChi: o.strTenTapChi, strChiSo_ISBN: o.strChiSo_ISBN, dSoTacGiaTrongTruong_n: o.dSoTacGiaTrongTruong_n, strPhanLoaiTapChi_Id: o.strPhanLoaiTapChi_Id,
                dSoTacGia_n: o.dSoTacGia_n, strNamHoanThanh: o.strNamHoanThanh, strThongTinMinhChung: o.strThongTinMinhChung, iThuTu: 1, strCanBoNhap_Id: uid(),
                strTenBaiBaoTrichDan_Pubmed: o.strTenBaiBaoTrichDan_Pubmed, strTapCuaTapChi: o.strTapCuaTapChi, strSoTapChi: o.strSoTapChi,
                strTrangTapChi: o.strTrangTapChi, strMaSanPham: o.strMaSanPham, iTrangThai: 1 };
        },
        locQL: function () { return []; },                 // gốc: chỉ ô từ khoá, danh sách mọi kỷ yếu
        locXN: function () { return [LOC_DV, LOC_TV, locTT()]; },
        tvPageSize: 100000,
        dsQL: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: '', strNCKH_QuanLyDeTai_Id: '', strLoaiKyYeu_Id: '',
                strNCKH_DeTai_ThanhVien_Id: '', strVaitro_Id: '', strDonViCuaThanhVien_Id: '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strTinhTrangXacNhan_Id: '' };
        },
        dsXN: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: '', strNCKH_QuanLyDeTai_Id: '', strLoaiKyYeu_Id: '',
                strDaoTao_CoCauToChuc_Id: v(q, 'dv'), strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strVaitro_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'),
                strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strTinhTrangXacNhan_Id: v(q, 'tt') };
        },
        bc: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: '', strNCKH_QuanLyDeTai_Id: '', strLoaiKyYeu_Id: '',
                strNCKH_DeTai_ThanhVien_Id: v(q, 'tv'), strVaitro_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                strTinhTrangXacNhan_Id: v(q, 'tt'), strDaoTao_CoCauToChuc_Id: v(q, 'dv') };
        },
        cotXN: [{ title: 'Số ISBN', prop: 'CHISO_ISBN' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' }, { title: 'Năm công bố', prop: 'NAMCONGBO', cls: 'is-center' }],
        taiFile: false                                     // gốc kyyeuhoinghi xác nhận không có nút "Tải file"
    };

    /* ---------- Thông tin sách (NCKH_Sach) -------------------------------- */
    BB.SP.thongtinsach = {
        ctl: 'NCKH_Sach', tieuDe: 'Thông tin sách', dsTieuDe: 'Danh sách sản phẩm', formTitle: 'thông tin sách', icon: 'fa-books', ten: 'TENSACH',
        saveAgain: 'Lưu và Nhập tiếp', vaiTro: 'NCKH.VTVS', tyLe: true, tuThem: true,
        fields: [
            { type: 'legend', label: 'Thông tin sách' },
            f('strTenSach', 'TENSACH', 'Tên sách', { required: true, cols: 12 }),
            f('strNhaXuatBan', 'NHAXUATBAN', 'Nhà xuất bản', { required: true, cols: 8 }), f('strChiSo_ISBN', 'CHISO_ISBN', 'Số ISBN'),
            f('strNamXuatBan', 'NAMXUATBAN', 'Năm xuất bản', { required: true }), f('strThangXuatBan', 'THANGXUATBAN', 'Tháng xuất bản', { required: true }),
            f('strLanXuatBan_Id', 'LANXUATBAN_ID', 'Lần xuất bản', { type: 'select', required: true, placeholder: 'Chọn lần xuất bản', source: { dm: 'NCKH.TTS.LANXUATBAN' } }),
            f('strThuocLinhVucNao_Id', 'THUOCLINHVUCNAO_ID', 'Lĩnh vực', { type: 'select', cols: 8, placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
            f('strPhanLoaiSach_Id', 'PHANLOAISACH_ID', 'Loại sách', { type: 'select', required: true, placeholder: 'Chọn loại sách', source: { dm: 'NCKH.PHLS' } }),
            f('dSoTinChi', 'SOTINCHI', 'Số tín chỉ'), f('dSoTacGia_n', 'SOTACGIA_N', 'Số tác giả', { required: true }),
            f('dSoTrangThamGiaViet_n', 'SOTRANGTHAMGIAVIET_N', 'Số trang viết'), f('dSoTrangSach_n', 'SOTRANGSACH_N', 'Tổng số trang', { cols: 12 }),
            f('strTenSachTrichDan', 'TENSACHTRICHDAN', 'Trích dẫn', { type: 'textarea', span: true, cols: 12 })
        ].concat(minhChung('Chú ý: File đính kèm là pdf chứa các hình ảnh (trang bìa, trang đầu, trang cuối, mục lục, số ISBN). Có thể ghép file tại: https://smallpdf.com/vi')),
        deTaiKey: 'strNCKH_QuanLyDeTai_Id',
        luu: function (o, x) {
            return { strTyLeThamGia: '', strTenSach: o.strTenSach, strThuocLinhVucNao_Id: o.strThuocLinhVucNao_Id, strNCKH_DeTai_ThanhVien_Id: '', strVaiTro_Id: '',
                strNhaXuatBan: o.strNhaXuatBan, strNCKH_QuanLyDeTai_Id: x.strNCKH_QuanLyDeTai_Id, strNamXuatBan: o.strNamXuatBan, dSoTacGia_n: o.dSoTacGia_n,
                dSoDongChuBien_n: '', dSoTrangSach_n: o.dSoTrangSach_n, dSoTrangThamGiaViet_n: o.dSoTrangThamGiaViet_n, strPhanLoaiSach_Id: o.strPhanLoaiSach_Id,
                strNamHoanThanh: '', strFileMinhChung: '', strThongTinMinhChung: o.strThongTinMinhChung, strMaSanPham: '', strThangXuatBan: o.strThangXuatBan,
                strChiSo_ISBN: o.strChiSo_ISBN, dSoTinChi: o.dSoTinChi, strTap: '', strLanXuatBan_Id: o.strLanXuatBan_Id, iTrangThai: 1, iThuTu: '',
                strCanBoNhap_Id: uid(), strTenSachTrichDan: o.strTenSachTrichDan };
        },
        locQL: function () {
            return [LOC_DV, LOC_TV, BB.locNam(false), { key: 'vt', type: 'select', label: 'Chọn vai trò', source: { dm: 'NCKH.VTVS' } }, locLV(),
                { key: 'pl', type: 'select', label: 'Chọn loại sách', source: { dm: 'NCKH.PHLS' } }, locDT()];
        },
        locXN: function () {
            return [LOC_DV, LOC_TV, locTT(), { key: 'vt', type: 'select', label: 'Chọn vai trò', source: { dm: 'NCKH.VTVS' } }, locLV(),
                { key: 'pl', type: 'select', label: 'Chọn loại sách', source: { dm: 'NCKH.PHLS' } }, locDT(true), BB.locNam(true)];
        },
        dsQL: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'),
                strPhanLoaiSach_Id: v(q, 'pl'), strnckh_detai_thanhvien_id: v(q, 'tv'), strVaiTro_Id: v(q, 'vt'), strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                strLanXuatBan_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: v(q, 'nam') };
        },
        dsXN: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strDaoTao_CoCauToChuc_Id: v(q, 'dv'), strThuocLinhVucNao_Id: v(q, 'lv'),
                strNCKH_QuanLyDeTai_Id: v(q, 'dt'), strPhanLoaiSach_Id: v(q, 'pl'), strnckh_detai_thanhvien_id: v(q, 'tv'), strVaiTro_Id: v(q, 'vt'),
                strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strLanXuatBan_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strTinhTrangXacNhan_Id: v(q, 'tt'),
                strNhanSu_TDKT_KeHoach_Id: v(q, 'nam') };
        },
        bc: function (q) {
            return { strTuKhoa: v(q, 'q'), iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: v(q, 'lv'), strNCKH_QuanLyDeTai_Id: v(q, 'dt'),
                strPhanLoaiSach_Id: v(q, 'pl'), strnckh_detai_thanhvien_id: v(q, 'tv'), strVaiTro_Id: v(q, 'vt'), strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '',
                strLanXuatBan_Id: '', strDonViCuaThanhVien_Id: v(q, 'dv'), strTinhTrangXacNhan_Id: v(q, 'tt'), strNhanSu_TDKT_KeHoach_Id: v(q, 'nam'),
                strDaoTao_CoCauToChuc_Id: v(q, 'dv') };
        },
        cotXN: [{ title: 'Năm xuất bản', prop: 'NAMXUATBAN', cls: 'is-center' }, { title: 'Tháng xuất bản', prop: 'THANGXUATBAN', cls: 'is-center' },
            { title: 'Loại sách', prop: 'PHANLOAISACH' }, { title: 'Số tín chỉ', prop: 'SOTINCHI', cls: 'is-center' },
            { title: 'Số tác giả', prop: 'SOTACGIA_N', cls: 'is-center' }, { title: 'Vai trò người khai', prop: 'VAITRO_TEN' },
            { title: 'Trích dẫn pubmed', width: '110px', render: function (r) { return lienKet(r.TENSACHTRICHDAN); } }],
        tim: { nut: 'Tìm sách', truong: 'strTenSach', title: 'Tìm kiếm sách', chonText: 'Chọn sách',
            cot: [{ title: 'Tên sách', prop: 'TENSACH' }, { title: 'Loại sách', prop: 'PHANLOAISACH' }, { title: 'Lĩnh vực', prop: 'THUOCLINHVUCNAO' }],
            ds: function (m) {
                return { strTuKhoa: m.q, iTrangThai: 1, strCanBoNhap_Id: '', strThuocLinhVucNao_Id: m.linhVuc, strNCKH_QuanLyDeTai_Id: '', strPhanLoaiSach_Id: '',
                    strnckh_detai_thanhvien_id: '', strVaiTro_Id: '', strLoaiHocVi_Id: '', strLoaiChucDanh_Id: '', strLanXuatBan_Id: '',
                    strDonViCuaThanhVien_Id: m.donVi, strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '' };
            } }
    };

    /** Khối dưới biểu mẫu (thành viên trong / ngoài trường, đề tài) của một sản phẩm */
    BB.khoi = function (D) {
        return [BB.thanhVien({ vaiTro: D.vaiTro, ngoai: true, tyLe: !!D.tyLe, tuThem: !!D.tuThem }), BB.deTai({ key: D.deTaiKey })];
    };

    /* =====================================================================
       Màn QUẢN LÝ hai cột — bản sao có chỉnh của ums.nckh.man
       ===================================================================== */
    BB.man = function (root, kieu) {
        var D = BB.SP[kieu];
        var khoi = BB.khoi(D), chon = null, crud;
        function giaTriKhoi() {
            var x = { nam: '' };                             // bản quản lý KHÔNG gửi kế hoạch khi lưu thành viên (gốc không có)
            khoi.forEach(function (k) { if (k.gt) Object.assign(x, k.gt()); });
            return x;
        }
        crud = ums.crud({
            root: root, title: D.tieuDe, formTitle: D.formTitle, icon: D.icon,
            master: { title: D.dsTieuDe || D.tieuDe, icon: D.icon,
                item: function (r) { return '<div class="nk-ten">' + esc(e(r[D.ten])) + '</div>'; },
                empty: 'Hôm nay bạn có sản phẩm mới không? Bấm Thêm mới ở đầu trang.' },
            filters: [{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }].concat(D.locQL()),
            autoload: false,
            list: { paged: true, call: function (q) { return Object.assign({ action: D.ctl + '/LayDanhSach', method: 'GET' }, D.dsQL(q)); } },
            fields: D.fields, formCols: 12, saveAgain: D.saveAgain,
            save: function (o, row) {
                var p = D.luu(o, giaTriKhoi());
                p.action = D.ctl + (row ? '/CapNhat' : '/ThemMoi');
                p.strId = row ? row.ID : '';
                return p;
            },
            remove: function (ids) { return ids.map(function (id) { return { action: D.ctl + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); },
            onForm: function (row, c, extra) {
                if (!extra) return;
                extra.innerHTML = khoi.map(function (k) { return '<div data-nk-khoi>' + k.html + '</div>'; }).join('');
                var hosts = extra.querySelectorAll('[data-nk-khoi]');
                khoi.forEach(function (k, i) { if (k.gan) k.gan(hosts[i], c); });
                var nguon = chon; chon = null;
                if (row) khoi.forEach(function (k) { if (k.nap) k.nap(row); });
                else if (nguon) {
                    c.fillForm(nguon);
                    khoi.forEach(function (k) { if (k.chep) k.chep(nguon); });
                    Object.keys(c.files || {}).forEach(function (fk) { var fl = c.files[fk]; Promise.resolve(fl.load(nguon.ID)).then(function () { fl.chep(); }); });
                    ui.toast('Đã chép thông tin "' + e(nguon[D.ten]) + '" — bấm Lưu để thêm thành sản phẩm mới', 'info', { timeout: 7000 });
                } else khoi.forEach(function (k) { if (k.moi) k.moi(); });
                if (D.tim) themNutTim(c);
                if (D.viet) themNutViet(c);
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var x = giaTriKhoi();
                khoi.reduce(function (p, k) { return p.then(function () { return k.luu ? k.luu(id, isEdit, x) : null; }); }, Promise.resolve());
            }
        });
        /* Nút xoá trắng (btnReWrite gốc) — đặt trước nút Lưu */
        function themNutViet(c) {
            var tools = c.z('form') && c.z('form').querySelector('.ums-panel__tools');
            if (!tools || tools.querySelector('[data-bb-viet]')) return;
            var luu = tools.querySelector('[data-c="' + c.uid + ':save"]');
            var h = ui.btn('reload', { text: D.viet, attr: { 'data-bb-viet': '1' } });
            if (luu) luu.insertAdjacentHTML('beforebegin', h); else tools.insertAdjacentHTML('beforeend', h);
            tools.querySelector('[data-bb-viet]').addEventListener('click', function () { chon = null; c.clearForm(); });
        }
        function themNutTim(c) {
            var el = root.querySelector('[data-scope="form"][data-k="' + D.tim.truong + '"]');
            var wrap = el && el.closest('.ums-field');
            if (!wrap || wrap.querySelector('[data-nk-tim]')) return;
            wrap.insertAdjacentHTML('beforeend', '<div class="nk-tim">' + ui.btn('search', { text: D.tim.nut, mod: 'out-primary', attr: { 'data-nk-tim': '1' } }) + '</div>');
            wrap.querySelector('[data-nk-tim]').addEventListener('click', function () {
                N.tim({ title: D.tim.title, chonText: D.tim.chonText, cot: D.tim.cot,
                    ds: function (fm, page, size) { return Object.assign({ action: D.ctl + '/LayDanhSach' }, D.tim.ds(fm), { pageIndex: page, pageSize: size }); },
                    onChon: function (r) { chon = r; c.showForm(null); } });
            });
        }
        function loc(k) { return root.querySelector('[data-scope="filter"][data-k="' + k + '"]'); }
        BB.ganDonVi(loc('dv'), loc('tv'), { pageSize: D.tvPageSize, onDoi: function () { crud.load(1); } });
        crud.sourcesReady.then(function () { crud.load(1); });
        return crud;
    };

    /* =====================================================================
       Màn XEM bài báo (bản 2018: baibaoquocte / baibaotrongnuoc) — hai cột, CHỈ XEM:
       danh sách trái (lọc Đơn vị, Nhân sự, Phân loại, Lĩnh vực) + khung "Chi tiết sản phẩm (mã)" bên phải.
       cfg = { tieuDe, dsTieuDe, ctl, dmPhanLoai, tvAction, tvKhoa, versionAPI, sua: { ... } }
       Gốc: ô "Tất cả thời gian" không nạp dữ liệu, không gửi đi → bỏ. trongnuoc: nạp ô nhân sự / đơn vị / phân loại /
       lĩnh vực vào id KHÔNG tồn tại (ô trống) và đổ lĩnh vực vào nhãn sai id → làm theo ý định.
       ===================================================================== */
    BB.xemMan = function (root, cfg) {
        var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, tong = 0, rows = [], dangChon = null;
        var m = pat.master({ el: root, title: cfg.tieuDe,
            side: { title: cfg.dsTieuDe, icon: 'fa-list-ul', search: 'Nhập từ khóa tìm kiếm',
                filter: '<div class="ums-field"><select class="ums-select" data-bb="dv" data-ph="Tất cả khoa/viện/phòng ban"><option value="">Tất cả khoa/viện/phòng ban</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-bb="ns" data-ph="Tất cả nhân sự"><option value="">Tất cả nhân sự</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-bb="pl" data-ph="Tất cả phân loại"><option value="">Tất cả phân loại</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-bb="lv" data-ph="Tất cả lĩnh vực"><option value="">Tất cả lĩnh vực</option></select></div>' },
            main: { title: 'Chi tiết sản phẩm', icon: 'fa-file-lines' } });
        function q(k) { return root.querySelector('[data-bb="' + k + '"]'); }
        ui.enhance(root);
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(q('dv'), d); }).catch(function () {});
        ums.ref.nhanSu({}).then(function (d) { pat.fill(q('ns'), d, { name: 'HOTEN' }); }).catch(function () {});
        ums.api.dm(cfg.dmPhanLoai).then(function (d) { pat.fill(q('pl'), d); }).catch(function () {});
        ums.api.dm('NCKH.LVNC').then(function (d) { pat.fill(q('lv'), d); }).catch(function () {});
        var mainHead = m.main.querySelector('.ums-panel__title');
        m.mainBody.innerHTML = ui.empty('Chọn một bài báo ở danh sách bên trái để xem chi tiết', 'fa-hand-pointer');

        function tai(p) {
            if (p) page = p;
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var c = { action: cfg.ctl + '/LayDanhSach', method: 'GET' };
            if (cfg.versionAPI) c.versionAPI = cfg.versionAPI;
            Object.assign(c, { strVaitro_Id: '', strQuanLyDeTai_Id: '', strThuocLinhVucNao_Id: q('lv').value, strPhanLoaiTapChi_Id: q('pl').value,
                strTuKhoa: m.search.value.trim(), iTrangThai: 1, strCanBoNhap_Id: '', strThanhVienDangKy_Id: q('ns').value, strLoaiHocVi_Id: '',
                strLoaiChucDanh_Id: '', strDonViCuaThanhVien_Id: q('dv').value });
            c[cfg.khoaDM] = '';
            if (cfg.coTDKT) c.strNhanSu_TDKT_KeHoach_Id = '';
            c.pageIndex = page; c.pageSize = size;
            return ums.api.call(c).then(function (r) {
                rows = arr(r.data); tong = Number(r.pager) || rows.length;
                if (m.sideCount) m.sideCount.textContent = '(' + tong + ')';
                ve();
            }).catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, cfg.tieuDe); });
        }
        function ve() {
            m.sideBody.innerHTML = rows.length ? rows.map(function (r, i) {
                return '<button type="button" class="ums-master__item' + (dangChon === r.ID ? ' is-active' : '') + '" data-i="' + i + '"><div class="nk-ten">' + esc(e(r.TENBAIBAO)) + '</div></button>';
            }).join('') : ui.empty('Không có dữ liệu');
            m.setPage({ index: page, size: size, total: tong, shown: rows.length, onChange: function (p) { tai(p); }, onSize: function (n) { size = n; tai(1); } });
        }
        m.sideBody.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-i]');
            if (!b) return;
            var r = rows[Number(b.getAttribute('data-i'))];
            if (!r) return;
            dangChon = r.ID; ve(); xem(r);
        });
        function kv(nhan, gt) { return '<div class="ums-kv"><span>' + esc(nhan) + '</span><b>' + esc(e(gt)) + '</b></div>'; }
        function xem(r) {
            mainHead.innerHTML = '<i class="fa-light fa-file-lines"></i> Chi tiết sản phẩm (' + esc(e(r.MASANPHAM)) + ')';
            m.mainBody.innerHTML =
                '<div class="ums-u-faint ums-u-fz13">Xác nhận: ' + esc(e(r.CANBONHAP_TENDAYDU)) + '</div>' +
                '<div class="ums-legend ums-legend--cach">Thông tin bài báo</div>' +
                kv('Tên bài báo', cfg.hoa ? e(r.TENBAIBAO).toUpperCase() : r.TENBAIBAO) + kv('Tên tạp chí', r.TENTAPCHIDADANG) + kv('Phân loại', r.PHANLOAITAPCHI) +
                kv('Lĩnh vực/Ngành', r.THUOCLINHVUCNAO) + kv('Năm công bố', r.NAMCONGBO) + kv('Hệ số IF', cfg.coHeSo ? r.HESOIF_N : '') +
                (cfg.coDOI ? kv('Số DOI', '') : '') +
                kv(cfg.nhanTap || 'Tập tạp chí', r.TAPCUATAPCHI) + kv('Thuộc số', r.SOTAPCHI) + kv('Số trang', r.TRANGTAPCHI) +
                kv(cfg.nhanTrichDan || 'Trích dẫn pubmed (Pubmed ID (PMID) hoặc PMCID)', r.TENBAIBAOTRICHDAN_PUBMED) +
                '<div class="ums-legend ums-legend--cach">Nội dung minh chứng</div>' + kv('Link liên kết', r.THONGTINMINHCHUNG) +
                '<div class="ums-kv"><span>File đính kèm</span><b data-bb="tep"></b></div>';
            ums.files.mount(q('tep'), { api: 'NCKH_Files', readonly: true }).load(r.ID);
            if (!q('tv')) m.main.insertAdjacentHTML('beforeend', pat.panel({ title: 'Thành viên tham gia', icon: 'fa-users', flush: true, cls: 'ums-u-mt-4',
                body: '<div data-bb="tv"></div>' }));
            var tv = q('tv');
            tv.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var c = { action: cfg.tvAction, method: 'GET' }; c[cfg.tvKhoa] = r.ID;
            ums.api.call(c).then(function (res) {
                ui.table({ el: tv, rows: arr(res.data), stt: true, empty: 'Chưa có thành viên', columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (x) { return pat.anhNguoi(x.ANH); } },
                    { title: 'Họ tên', render: function (x) {
                        var cd = (e(x.LOAICHUCDANH_MA) ? e(x.LOAICHUCDANH_MA) + '.' : '') + (e(x.LOAIHOCVI_MA) ? e(x.LOAIHOCVI_MA) + '.' : '');
                        return ui.cell((cd ? cd + ' ' : '') + e(x.HOTEN), e(x.MACANBO));
                    } },
                    { title: 'Vai trò', prop: 'VAITRO_TEN' }] });
            }).catch(function (err) { tv.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thành viên'); });
        }
        pat.cotTrai(m, { tai: tai });
        tai(1);
        return { tai: tai };
    };
})();
