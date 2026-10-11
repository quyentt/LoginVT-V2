/* =========================================================================
   Kế hoạch đăng ký (chi tiết) — Ký túc xá / Kế hoạch
   Bản gốc: ApisKyTucXa/Modules/kehoach/html/kehoachdangky.html + script/kehoachdangky.js (994 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, tham số chép nguyên văn):
       KTX_KeHoachDangKy/LayDanhSach        GET   strTuKhoa, strLoaiKeHoach_Id "" (gốc đọc #dropAAAA không có), strNguoiThucHien_Id, pageIndex, pageSize 10
       KTX_KeHoachDangKy/ThemMoi | CapNhat  POST  strId, strTenKeHoach, strTuNgay, strDenNgay, strLoaiKeHoach_Id, dSoNgayHieuLucGiuCho, strNgayVao, strNgayRa, dHieuLuc
       KTX_KeHoachDangKy/Xoa                POST  strIds
       KTX_DoiTuongOKyTucXa/LayDanhSach     GET   "Sinh viên chưa thêm": strPhanLoaiDoiTuong_Id, strKhoaDaoTao_Id, dBiKyLuat -1, dDoiTuongConDangOKTX -1,
                                                  strLopQuanLy_Id "", 14 ô khác đọc id không có → "", pageIndex, pageSize 10
       KTX_PhanCongDTDangKy/LayDanhSach     GET   "Sinh viên đã thêm": strTuKhoa "", strKTX_KeHoachDangKy_Id, strKTX_DoiTuongOKyTucXa_Id "", pageIndex, pageSize 10
       KTX_PhanCongDTDangKy/ThemMoi         POST  strKTX_KeHoachDangKy_Id, strKTX_DoiTuongOKyTucXa_Id — mỗi sinh viên đánh dấu một lời gọi
       KTX_PhanCongDTDangKy/Xoa             POST  strIds — mỗi dòng đánh dấu một lời gọi
       KTX_Phong/LayDanhSach                GET   "Phòng chưa thêm": strTuKhoa "", strKTX_ToaNha_Id (ô lọc), còn lại "", pageIndex, pageSize 10 (ums.ktx.phong)
       KTX_PhanCongPhongDangKy/LayDanhSach  GET   "Phòng đã thêm": strTuKhoa "", strKTX_KeHoachDangKy_Id, strKTX_ToaNha_Id "", strKTX_Phong_Id "", pageIndex, pageSize 10
       KTX_PhanCongPhongDangKy/ThemMoi      POST  strKTX_KeHoachDangKy_Id, strKTX_ToaNha_Id (KTX_TOANHA_ID của phòng), strKTX_Phong_Id, strNgayVao, strNgayRa — mỗi phòng một lời gọi
       KTX_PhanCongPhongDangKy/Xoa          POST  strIds
       KTX_ToaNha/LayDanhSach               GET   ô lọc toà nhà (ums.ktx.toaNha)
       Danh mục: KTX.LOAIKEHOACH (loại kế hoạch), KTX_PHANLOAIDOITUONG (loại đối tượng), KTX.KHOADAOTAO (khoá đào tạo)
   Cột trả về: ID, TENKEHOACH, TUNGAY, DENNGAY, NGAYVAO, NGAYRA, LOAIKEHOACH_ID/_TEN, HIEULUC (1/0), SONGAYHIEULUCGIUCHO, SOPHONGPHANCONG, SODOITUONG.
   Bố cục bản gốc: MỘT cột — ô từ khoá + bảng kế hoạch 11 cột (Tên | Từ ngày | Đến ngày | Ngày vào | Ngày ra | Loại | Hiệu lực |
   Phòng được đăng ký = số + mắt | Sinh viên được phép = số + mắt | Xem = bút); thêm / sửa → biểu mẫu thay chỗ (Tên, Loại, Hiệu lực,
   Ngày bắt đầu, Ngày kết thúc, Số ngày giữ chỗ, Ngày vào, Ngày ra; Xoá ở chân khi sửa). Hai KHUNG CON thay chỗ danh sách:
   "Danh sách sinh viên - <tên KH>": bảng đã thêm (Mã số | Họ tên | ô đánh dấu) + Xóa; lọc Loại đối tượng + Khóa; bảng chưa thêm
   (Mã số | Họ tên | Lớp | Khóa | Phân loại | ô đánh dấu) + Thêm. "Danh sách phòng - <tên KH>": bảng đã thêm (Mã | Tên | Tòa nhà |
   Ngày vào | Ngày ra | ô) + Xóa; lọc Tòa nhà; bảng chưa thêm (Mã | Tên | Tòa nhà | ô) + Ngày vào / Ngày ra + Thêm.
   Ở đây: ums.crud một cột; hai khung con = ums.pat.formTrang (tầng hai thay chỗ danh sách), bốn bảng ums.ui.table phân trang máy chủ
   10 dòng như gốc, lưu / xoá hàng loạt qua ums.ui.batch (gốc: genHTML_Progress + N lời gọi).

   Giữ như bản gốc: "chưa thêm" là MỌI người ở / mọi phòng (gốc không trừ dòng đã thêm); Thêm N dòng = N lời gọi; gốc không bắt ô nào.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · "Phòng đã thêm": gốc gửi strKTX_KeHoachDangKy_Id = #dropAAAA (không có) → hiện phân công của MỌI kế hoạch; ở đây gửi kế hoạch đang mở.
     · Bắt buộc Tên kế hoạch (như màn Kế hoạch đăng ký đã chuyển — lưu tên rỗng sinh dòng trống).
     · Thêm phòng / sinh viên báo "Thêm sinh viên thành công!" cả hai — ở đây câu báo gộp của ui.batch.
     · Hiệu lực hiện nhãn (gốc in số 1 / 0); Ngày vào ≤ Ngày ra ở khung phòng do ui.khoangNgay (tầng chung).
     · Xoá / lưu: gốc gắn thêm #btnYes mỗi lần bấm → ui.confirm.
   Cố ý bỏ: 19 id không có trong HTML (txtAAAA, dropAAAA, 14 ô lọc hồ sơ chép từ màn Hồ sơ người ở, btnSearch_KHDK, btnYes); #dropSearch_ThoiGian
     (chú thích); vùng import #zonebtnKeHoachDangKy_Import (chú thích, không gọi getList_MauImport); nút Tìm kiếm cạnh ô lọc (gõ tự tìm);
     cutPrefixId(/delete_ctd/) (id không có tiền tố đó).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, K = ums.ktx, KH = ums.ktxKH, e = KH.e;
    var root = document.getElementById('ktx-kehoachdangky');
    if (!root) return;

    var P = 'KTX_KeHoachDangKy/', SIZE = 10;
    function loi(viec) { return function (err) { ums.api.handle(err, viec); }; }
    function mat(r, loai) {
        return '<span class="ums-u-nowrap">' + esc(e(loai === 'phong' ? r.SOPHONGPHANCONG : r.SODOITUONG) || '0') + ' ' +
            '<button type="button" class="ums-iconbtn" data-kh="' + loai + '" data-id="' + esc(r.ID) + '" title="Chi tiết"><i class="fa-light fa-eye"></i></button></span>';
    }

    var crud = ums.crud({
        root: root, title: 'Kế hoạch đăng ký', listTitle: 'Danh sách kế hoạch đăng ký', icon: 'fa-calendar-check',
        formTitle: 'kế hoạch đăng ký', multi: false, empty: 'Chưa có kế hoạch đăng ký nào',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: { paged: true, call: function (f) {
            return { action: P + 'LayDanhSach', method: 'GET', strTuKhoa: f.q || '', strLoaiKeHoach_Id: '', strNguoiThucHien_Id: '' };
        } },
        columns: [
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Ngày vào', prop: 'NGAYVAO', cls: 'is-center is-nowrap' },
            { title: 'Ngày ra', prop: 'NGAYRA', cls: 'is-center is-nowrap' },
            { title: 'Loại kế hoạch', prop: 'LOAIKEHOACH_TEN' },
            { title: 'Hiệu lực', cls: 'is-center', render: KH.hieuLuc },
            { title: 'Danh sách phòng được đăng ký', cls: 'is-center', render: function (r) { return mat(r, 'phong'); } },
            { title: 'Danh sách sinh viên được phép', cls: 'is-center', render: function (r) { return mat(r, 'sv'); } }
        ],
        fields: [
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', required: true, placeholder: 'Nhập tên kế hoạch' },
            { key: 'strLoaiKeHoach_Id', col: 'LOAIKEHOACH_ID', label: 'Loại kế hoạch', type: 'select', source: { dm: 'KTX.LOAIKEHOACH' }, placeholder: 'Chọn loại kế hoạch' },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', value: '1',
              source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] }, placeholder: 'Hiệu lực' },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Ngày kết thúc', type: 'date' },
            { key: 'dSoNgayHieuLucGiuCho', col: 'SONGAYHIEULUCGIUCHO', label: 'Số ngày giữ chỗ', type: 'number' },
            { key: 'strNgayVao', col: 'NGAYVAO', label: 'Ngày vào', type: 'date' },
            { key: 'strNgayRa', col: 'NGAYRA', label: 'Ngày ra', type: 'date' }
        ],
        save: function (v, row) {
            return { action: P + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strTenKeHoach: v.strTenKeHoach, strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strLoaiKeHoach_Id: v.strLoaiKeHoach_Id,
                dSoNgayHieuLucGiuCho: v.dSoNgayHieuLucGiuCho, strNgayVao: v.strNgayVao, strNgayRa: v.strNgayRa, dHieuLuc: v.dHieuLuc };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: P + 'Xoa', method: 'POST', strIds: id }; }); }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-kh]');
        if (!b || !root.contains(b) || b.closest('.ums-formtrang')) return;
        var id = b.getAttribute('data-id');
        var r = crud.rows.filter(function (x) { return x.ID === id; })[0];
        if (!r) return;
        if (b.getAttribute('data-kh') === 'sv') moSinhVien(r); else moPhong(r);
    });

    /* ---------- Dùng chung cho hai khung con: bảng phân trang + đánh dấu + lưu / xoá hàng loạt ---------- */
    function bang(host, pg, cols, ck, rows, empty) {
        cols = cols.concat([{ head: '<input type="checkbox" data-all="' + ck + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-ck="' + ck + '" data-id="' + esc(r.ID) + '">'; } }]);
        ui.table({ el: host, columns: cols, rows: rows, empty: empty, page: pg });
    }
    function trang(onChange) {
        var pg = { index: 1, size: SIZE, total: 0 };
        pg.onChange = function (p) { if (p < 1 || p > Math.max(1, Math.ceil(pg.total / pg.size))) return; onChange(p); };
        pg.onSize = function (s) { pg.size = s; onChange(1); };
        return pg;
    }
    function daChon(body, ck) {
        return Array.prototype.map.call(body.querySelectorAll('input[data-ck="' + ck + '"]:checked'), function (c) { return c.getAttribute('data-id'); });
    }
    function chonTatCa(body) {
        body.addEventListener('change', function (ev) {
            var a = ev.target.closest('[data-all]'); if (!a) return;
            Array.prototype.forEach.call(body.querySelectorAll('input[data-ck="' + a.getAttribute('data-all') + '"]'), function (c) { c.checked = a.checked; });
        });
    }
    function chayHangLoat(calls, title, xong) {
        ui.batch(calls, { title: title }).then(function () { xong(); crud.load(); });
    }
    function khungCon(o) {
        /* o: { kh, title, icon, tenDa, tenChua, loc (HTML ô lọc), duoi (HTML trước nút Thêm), taiDa(pg) → Promise rows, taiChua(pg), them(ids, body), xoa(ids) } */
        /* Mỗi khối một khung: bảng SÁT MÉP (thân --flush, BO-CUC luật 15), nút của khối ở ĐẦU khung (Xoá đã chọn / Thêm) như ums.crud;
           phần không phải bảng (bộ lọc, ô Ngày vào / Ngày ra) bọc .ums-panel__dem để lấy lại đệm (người dùng 2026-10-12: "lại lỗi bảng, nút"). */
        var ft = pat.formTrang({ host: root, title: o.title + ' - ' + e(o.kh.TENKEHOACH), icon: o.icon, cols: 1,
            body: pat.panel({ title: o.tenDa, icon: 'fa-list-check', flush: true, zone: 'da',
                      tools: ui.xoaChon('input[data-ck="da"]', { trong: '[data-z="da"]', attr: { 'data-kd': 'xoa' } }) }) +
                  pat.panel({ title: o.tenChua, icon: 'fa-list', cls: 'ums-panel--cach', flush: true,
                      tools: ui.btn('add', { text: 'Thêm', attr: { 'data-kd': 'them' } }),
                      body: '<div class="ums-panel__dem"><div class="ums-filter">' + o.loc + '</div></div>' +
                            '<div data-z="chua"></div>' +
                            (o.duoi ? '<div class="ums-panel__dem"><div class="ums-filter">' + o.duoi + '</div></div>' : '') }) });
        var b = ft.body, pgDa, pgChua;
        function q(k) { return b.querySelector('[data-kd="' + k + '"], [data-z="' + k + '"]'); }
        chonTatCa(b);
        pgDa = trang(taiDa); pgChua = trang(taiChua);
        function taiDa(p) {
            pgDa.index = p || 1;
            o.taiDa(pgDa).then(function (kq) {
                pgDa.total = kq.total;
                bang(q('da'), pgDa, o.cotDa, 'da', kq.rows, 'Chưa thêm dòng nào');
            }, loi(o.tenDa.toLowerCase()));
        }
        function taiChua(p) {
            pgChua.index = p || 1;
            o.taiChua(pgChua, b).then(function (kq) {
                pgChua.total = kq.total;
                bang(q('chua'), pgChua, o.cotChua, 'chua', kq.rows, 'Không có dữ liệu');
            }, loi(o.tenChua.toLowerCase()));
        }
        b.addEventListener('click', function (ev) {
            var x = ev.target.closest('[data-kd="them"], [data-kd="xoa"]'); if (!x) return;
            if (x.getAttribute('data-kd') === 'them') {
                var ids = daChon(b, 'chua');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn lưu dữ liệu không?').then(function (yes) {
                    if (yes) chayHangLoat(o.them(ids, b), 'Đang thêm ' + ids.length + ' dòng', function () { taiDa(1); });
                });
            } else {
                var xs = daChon(b, 'da');
                if (!xs.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?').then(function (yes) {
                    if (yes) chayHangLoat(o.xoa(xs), 'Đang xoá ' + xs.length + ' dòng', function () { taiDa(1); });
                });
            }
        });
        if (window.jQuery) jQuery(b).on('change', '.ums-filter select', function () { taiChua(1); });
        taiDa(1); taiChua(1);
        return { ft: ft, body: b, q: q, taiChua: taiChua };
    }
    function hoTen(hd, t) { return (e(hd) + ' ' + e(t)).trim(); }

    /* ---------- Khung "Danh sách sinh viên" (KTX_PhanCongDTDangKy) ---------- */
    function moSinhVien(kh) {
        var PD = 'KTX_PhanCongDTDangKy/';
        var k = khungCon({
            kh: kh, title: 'Danh sách sinh viên', icon: 'fa-users', tenDa: 'Danh sách sinh viên đã thêm', tenChua: 'Danh sách sinh viên chưa thêm',
            loc: '<div class="ums-field"><select class="ums-select" data-kd="loai" data-ph="--Chọn loại đối tượng--"><option value="">--Chọn loại đối tượng--</option></select></div>' +
                 '<div class="ums-field"><select class="ums-select" data-kd="khoa" data-ph="--Chọn khóa đào tạo--"><option value="">--Chọn khóa đào tạo--</option></select></div>',
            cotDa: [
                { title: 'Mã số', prop: 'KTX_DOITUONGOKYTUCXA_MASO', cls: 'is-nowrap', width: '200px' },
                { title: 'Họ tên', render: function (r) { return esc(hoTen(r.KTX_DOITUONGOKYTUCXA_HODEM, r.KTX_DOITUONGOKYTUCXA_TEN)); } }
            ],
            cotChua: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap', width: '200px' },
                { title: 'Họ tên', render: function (r) { return esc(hoTen(r.HODEM, r.TEN)); } },
                { title: 'Lớp', prop: 'LOPQUANLY', cls: 'is-center' },
                { title: 'Khóa', prop: 'KHOAHOC', cls: 'is-center' },
                { title: 'Phân loại', prop: 'PHANLOAIDOITUONG_TEN', cls: 'is-center' }
            ],
            taiDa: function (pg) {
                return ums.api.call({ action: PD + 'LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_KeHoachDangKy_Id: kh.ID, strKTX_DoiTuongOKyTucXa_Id: '',
                    strNguoiThucHien_Id: '', pageIndex: pg.index, pageSize: pg.size }).then(function (r) { return { rows: KH.rows(r), total: Number(r.pager) || KH.rows(r).length }; });
            },
            taiChua: function (pg, b) {
                return ums.api.call({ action: 'KTX_DoiTuongOKyTucXa/LayDanhSach', method: 'GET', strTuKhoa: '', strTinhTrangHopDong_Id: '', dBiKyLuat: -1,
                    strNgayVao_TuNgay: '', strNgayVao_DenNgay: '', strNgayRa_TuNgay: '', strNgayRa_DenNgay: '', strKTX_ToaNha_Id: '', strLopQuanLy_Id: '', strKTX_Phong_Id: '',
                    strPhanLoaiDoiTuong_Id: pat.val(b.querySelector('[data-kd="loai"]')), strKhoaDaoTao_Id: pat.val(b.querySelector('[data-kd="khoa"]')),
                    dDoiTuongConDangOKTX: -1, strGioiTinh_Id: '', strTrinhDoDaoTao_Id: '', strDienDaoTao_Id: '', strNganhDaoTao_Id: '', strNguoiThucHien_Id: '',
                    pageIndex: pg.index, pageSize: pg.size, strNgayKiemTra: '', strNamNhapHoc: '' }).then(function (r) { return { rows: KH.rows(r), total: Number(r.pager) || KH.rows(r).length }; });
            },
            them: function (ids) { return ids.map(function (id) { return { action: PD + 'ThemMoi', method: 'POST', strKTX_KeHoachDangKy_Id: kh.ID, strKTX_DoiTuongOKyTucXa_Id: id }; }); },
            xoa: function (ids) { return ids.map(function (id) { return { action: PD + 'Xoa', method: 'POST', strIds: id }; }); }
        });
        ums.api.dm('KTX_PHANLOAIDOITUONG').then(function (rs) { pat.fill(k.q('loai'), rs, { head: '--Chọn loại đối tượng--' }); }, loi('loại đối tượng'));
        ums.api.dm('KTX.KHOADAOTAO').then(function (rs) { pat.fill(k.q('khoa'), rs, { head: '--Chọn khóa đào tạo--' }); }, loi('khóa đào tạo'));
    }

    /* ---------- Khung "Danh sách phòng" (KTX_PhanCongPhongDangKy) ---------- */
    function moPhong(kh) {
        var PP = 'KTX_PhanCongPhongDangKy/', phongChua = [];
        var k = khungCon({
            kh: kh, title: 'Danh sách phòng', icon: 'fa-door-open', tenDa: 'Danh sách phòng đã thêm', tenChua: 'Danh sách phòng chưa thêm',
            loc: '<div class="ums-field"><select class="ums-select" data-kd="toa" data-ph="Chọn tòa nhà"><option value="">Chọn tòa nhà</option></select></div>',
            duoi: '<div class="ums-field"><input class="ums-input" data-kd="ngayvao" data-date data-range="phong:tu" placeholder="Ngày vào" autocomplete="off"></div>' +
                  '<div class="ums-field"><input class="ums-input" data-kd="ngayra" data-date data-range="phong:den" placeholder="Ngày ra" autocomplete="off"></div>',
            cotDa: [
                { title: 'Mã phòng', prop: 'KTX_PHONG_MA', cls: 'is-nowrap' },
                { title: 'Tên Phòng', prop: 'KTX_PHONG_TEN' },
                { title: 'Tòa nhà', prop: 'KTX_TOANHA_TEN' },
                { title: 'Ngày vào', prop: 'NGAYVAO', cls: 'is-center is-nowrap' },
                { title: 'Ngày ra', prop: 'NGAYRA', cls: 'is-center is-nowrap' }
            ],
            cotChua: [
                { title: 'Mã phòng', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên Phòng', prop: 'TEN' },
                { title: 'Tòa nhà', prop: 'KTX_TOANHA_TEN' }
            ],
            taiDa: function (pg) {
                return ums.api.call({ action: PP + 'LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_KeHoachDangKy_Id: kh.ID, strKTX_ToaNha_Id: '', strKTX_Phong_Id: '',
                    strNguoiThucHien_Id: '', pageIndex: pg.index, pageSize: pg.size }).then(function (r) { return { rows: KH.rows(r), total: Number(r.pager) || KH.rows(r).length }; });
            },
            taiChua: function (pg, b) {
                return K.phong({ strKTX_ToaNha_Id: pat.val(b.querySelector('[data-kd="toa"]')), pageIndex: pg.index, pageSize: pg.size })
                    .then(function (kq) { phongChua = kq.rows; return kq; });
            },
            them: function (ids, b) {
                var vao = pat.val(b.querySelector('[data-kd="ngayvao"]')), ra = pat.val(b.querySelector('[data-kd="ngayra"]'));
                return ids.map(function (id) {
                    var p = phongChua.filter(function (x) { return x.ID === id; })[0] || {};
                    return { action: PP + 'ThemMoi', method: 'POST', strKTX_KeHoachDangKy_Id: kh.ID, strKTX_ToaNha_Id: e(p.KTX_TOANHA_ID), strKTX_Phong_Id: id, strNgayVao: vao, strNgayRa: ra };
                });
            },
            xoa: function (ids) { return ids.map(function (id) { return { action: PP + 'Xoa', method: 'POST', strIds: id }; }); }
        });
        K.toaNha().then(function (rs) { pat.fill(k.q('toa'), rs, { name: 'TEN', head: 'Chọn tòa nhà' }); });
    }
})();
