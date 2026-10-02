/* =========================================================================
   Tổ chức thi tuyển sinh
   Bản gốc: ApisQuanlyTuyenSinh/Modules/hoso/html/tochucthinhapdiem.html + script/tochucthi.js
            (tên .js gốc khác tên html — bản mới đặt tochucthinhapdiem.js theo tên html)
   ---------------------------------------------------------------------------
   Bố cục bản gốc MỘT CỘT, ba vùng thay chỗ nhau (zone-bus):
     1. Tìm kiếm (Năm · Kế hoạch · Đợt [chọn nhiều] · Hình thức [chọn nhiều] · Hệ · Khóa · Loại danh sách thi · từ khoá ·
        Tìm kiếm) → "Danh sách kế hoạch tuyển sinh (n)" + Lập danh sách tự động · Lập danh sách tự chọn · Tạo số báo danh
        → bảng Danh sách thi · Môn thi · Số lượng · Chi tiết · ô đánh dấu.
     2. "Thêm mới - Danh sách thi tự động" / "… tự chọn": khối thông tin đang lọc (Kế hoạch, Hình thức, Đợt, Loại danh sách)
        + ô Môn thi tuyển (tự động: chọn nhiều) · (tự chọn: Mã / Tên danh sách) · Thời gian · Quy tắc sinh số · (tự động:
        Số thí sinh/danh sách) → bảng "Danh sách thí sinh chưa lập danh sách" (tự chọn: có ô đánh dấu) → nút Tạo.
     3. "Chỉnh sửa - Danh sách thi": thí sinh đã có trong danh sách (Xóa) + thí sinh chưa lập danh sách (Thêm).

   Lời gọi (chép nguyên, GET/POST như gốc) — Năm / Kế hoạch / Hệ / Khóa / Đợt / Hình thức: _chung.js (ums.tsHoSo)
     TS_ThongTin_Chung/LayLoaiDanhSachThi      GET  strNguoiThucHien_Id → ID, TEN
     TS_TuyenSinhChung/LayDSMonThiTuyen        GET  strNguoiThucHien_Id, strTS_KeHoachTuyenSinh_Id, strDotTuyenSinh_Id,
                                                    strDoiTuongDuTuyen_Id → ID, TEN
     pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao (ums.ref.thoiGianDaoTao, 1/100000) → DAOTAO_THOIGIANDAOTAO
     D_Hoc/LayDanhSach                         GET  strTuKhoa, strChucNang_Id, strDaoTao_LopQuanLy_Id = ô HÌNH THỨC (như gốc),
                                                    strDaoTao_ThoiGianDaoTao_Id '', strDaoTao_HocPhan_Id '', strTrangThai_Id '',
                                                    strDangKy_KeHoachDangKy_Id = ô KẾ HOẠCH (như gốc), strLoaiDanhSach_Id,
                                                    strNguoiDung_Id '', strNguoiThucHien_Id, strNguoiTao_Id '', trang máy chủ
                                                    → ID, TEN, DAOTAO_HOCPHAN_TEN, SOLUONG, DAOTAO_THOIGIANDAOTAO
     TS_ThongTin_Chung/LayDSTS_ThiSinh_Dot_DoiTuong GET strTuKhoa '', strDiem_DanhSachHoc_Id, strDaoTao_HocPhan_Ids,
                                                    strDoiTuongDuTuyen_Id, strDotTuyenSinh_Id, strTS_KeHoachTuyenSinh_Id,
                                                    strTS_HoSoDuTuyen_Id '', strNguoiTao_Id '', trang máy chủ
                                                    → ID, TS_HOSODUTUYEN_ID, MAHOSO, TS_HOSODUTUYEN_HODEM/_TEN/_CMT_SO,
                                                      QLSV_NGUOIHOC_NGAYSINH, DOITUONGDUTUYEN_TEN, DOTTUYENSINH_TEN, DSNGUYENVONGTHEOKEHOACH
     TS_ThongTin_Chung/LayDSThiTuDong          POST strTuKhoa '', strChucNang_Id, strDaoTao_HocPhan_Ids, strDoiTuongDuTuyen_Id,
                                                    strDotTuyenSinh_Id, strTS_KeHoachTuyenSinh_Id, strLoaiDanhSach_Id,
                                                    strDaoTao_ThoiGianDaoTao_Id, strQuyTacSinhSoBaoDanh_Id, dSoThiSinh_DanhSach
     TS_ThongTin_Chung/LayDSThiThuCong         POST strTuKhoa '', strChucNang_Id, strMaDanhSach, strTenDanhSach,
                                                    strDaoTao_HocPhan_Ids + strDaoTao_HocPhan_Id (cùng ô môn), strDoiTuongDuTuyen_Id,
                                                    strDotTuyenSinh_Id, strTS_KeHoachTuyenSinh_Id, strLoaiDanhSach_Id,
                                                    strDaoTao_ThoiGianDaoTao_Id, strTS_ThiSinh_Dot_DT_Ids (ID nối dấu phẩy),
                                                    strQuyTacSinhSoBaoDanh_Id
     D_Hoc/LayDSNguoiHocTheoDanhSach           GET  strNguoiThucHien_Id, strDiem_DanhSachHoc_Id, strTieuChiSapXep ''
                                                    → ID, SOBAODANH, MASONGUOIHOC, HODEMNGUOIHOC, TENNGUOIHOC, NGAYSINH, CMTND_SO,
                                                      DOITUONGDUTUYEN_TEN, DOTTUYENSINH_TEN, NGUYENVONG
     D_NguoiHoc/ThemMoi                        POST strChucNang_Id, strDaoTao_LopQuanLy_Id '', strDaoTao_ChuongTrinh_Id '',
                                                    strDiem_DanhSachHoc_Id, strNguonDuLieu_Id = ID dòng, strQLSV_NguoiHoc_Id =
                                                    TS_HOSODUTUYEN_ID — mỗi thí sinh một lời gọi
     D_NguoiHoc/Xoa                            POST strDiem_DanhSach_NguoiHoc_Id — mỗi dòng một lời gọi
     TS_ThongTin_Chung/LapSoBaoDanhChoDanhSach POST strDiem_DanhSachHoc_Id, strQuyTacSinhSoBaoDanh_Id '' — mỗi danh sách một lời gọi

   Lỗi gốc đã sửa (làm theo ý định):
     · Ô từ khoá có Enter / nút Tìm kiếm nhưng D_Hoc/LayDanhSach gửi strTuKhoa từ ô không tồn tại (txtAAAA) → gửi ô từ khoá.
     · Tạo tự động / tự chọn xong gốc báo "Cập nhật thành công!" (so strId không tồn tại) → báo tạo thành công.
   Khác gốc / tự chốt:
     · Ô "Quy tắc sinh số" (hai vùng tạo) gốc KHÔNG có nguồn nạp — luôn gửi rỗng → giữ ô, khoá (disabled), gửi ''.
     · Tạo danh sách tự động: bắt buộc chọn môn thi tuyển, số thí sinh/danh sách phải là số nguyên dương (gốc không kiểm).
     · Tạo số báo danh / thêm / xoá thí sinh: gửi hàng loạt có tiến độ (gốc bật một thông báo cho TỪNG lời gọi); tạo số báo
       danh xong nạp lại danh sách.
     · Nút "Xóa" thí sinh đã thêm → ui.xoaChon; "chọn tất cả" chỉ tác động bảng của nó.
     · Mở vùng tạo: nạp lại môn thi theo kế hoạch / đợt / hình thức đang lọc (gốc chỉ nạp ở "tự chọn").
   Cặp cha → con: Kế hoạch → Hệ → Khóa, Kế hoạch → Đợt, Kế hoạch → Hình thức (pat.chain). Năm, Loại danh sách thi độc lập.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tsHoSo, e = T.e, esc = ui.esc;
    var root = document.getElementById('ts-tochucthinhapdiem');
    if (!root) return;
    var TC = 'TS_ThongTin_Chung/';

    function sel(k, ph, multi, dis) {
        return '<select class="ums-select" data-t="' + k + '" data-ph="' + esc(ph) + '"' + (multi ? ' multiple' : '') + (dis ? ' disabled' : '') + '>' +
            (multi ? '' : '<option value="">' + esc(ph) + '</option>') + '</select>';
    }
    function inp(k, ph) { return '<input class="ums-input" data-t="' + k + '" placeholder="' + esc(ph) + '" autocomplete="off">'; }
    function kv() {
        return '<div><div class="ums-kv"><span>Kế hoạch tuyển sinh</span><b data-k="kh"></b></div>' +
            '<div class="ums-kv"><span>Hình thức</span><b data-k="ht"></b></div>' +
            '<div class="ums-kv"><span>Đợt</span><b data-k="dot"></b></div>' +
            '<div class="ums-kv"><span>Loại danh sách</span><b data-k="loai"></b></div></div>';
    }
    var QT = 'Bản gốc chưa có nguồn cho quy tắc sinh số — luôn gửi rỗng';

    root.innerHTML =
        '<div data-v="ds">' +
            pat.page('Tổ chức thi tuyển sinh') +
            pat.filterBar(T.locFields({ multi: true, them: [{ key: 'loai', label: 'Chọn loại danh sách thi', type: 'select' }] })) +
            pat.panel({ title: 'Danh sách kế hoạch tuyển sinh', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'ds',
                tools: ui.btn('add', { text: 'Lập danh sách tự động', attr: { 'data-a': 'tudong' } }) +
                    ui.btn('add', { text: 'Lập danh sách tự chọn', mod: 'out-success', attr: { 'data-a': 'tuchon' } }) +
                    ui.btn('confirm', { text: 'Tạo số báo danh', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'sbd' } }) }) +
        '</div>' +
        /* ---- 2a. Tạo tự động ---- */
        '<div data-v="tudong" hidden>' +
            pat.panel({ title: 'Thêm mới - Danh sách thi tự động', icon: 'fa-plus',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('save', { text: 'Tạo danh sách tự động', icon: 'fa-check', attr: { 'data-a': 'luutudong' } }),
                body: '<div class="ums-grid ums-grid--2">' + kv() + '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:1 / -1">' + ui.field('Môn thi tuyển', sel('monTD', 'Chọn môn thi', true), { required: true }) + '</div>' +
                    ui.field('Thời gian', sel('tgTD', 'Chọn học kỳ')) +
                    ui.field('Quy tắc sinh số', sel('qtTD', 'Chọn quy tắc sinh số', false, true), { hint: QT }) +
                    ui.field('Số thí sinh/danh sách', inp('soTS', 'Số thí sinh')) +
                    '</div></div>' }) +
            pat.panel({ title: 'Danh sách thí sinh chưa lập danh sách', icon: 'fa-users', count: 'nTD', flush: true, zone: 'tsTD' }) +
        '</div>' +
        /* ---- 2b. Tạo tự chọn ---- */
        '<div data-v="tuchon" hidden>' +
            pat.panel({ title: 'Thêm mới - Danh sách thi tự chọn', icon: 'fa-plus',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('save', { text: 'Tạo danh sách tự chọn', icon: 'fa-check', attr: { 'data-a': 'luutuchon' } }),
                body: '<div class="ums-grid ums-grid--2">' + kv() + '<div class="ums-grid ums-grid--2">' +
                    ui.field('Mã danh sách', inp('ma', 'Mã danh sách')) +
                    ui.field('Tên danh sách', inp('ten', 'Tên danh sách')) +
                    '<div style="grid-column:1 / -1">' + ui.field('Môn thi tuyển', sel('monTC', 'Chọn môn thi'), { required: true }) + '</div>' +
                    ui.field('Thời gian', sel('tgTC', 'Chọn học kỳ')) +
                    ui.field('Quy tắc sinh số', sel('qtTC', 'Chọn quy tắc sinh số', false, true), { hint: QT }) +
                    '</div></div>' }) +
            pat.panel({ title: 'Danh sách thí sinh chưa lập danh sách', icon: 'fa-users', count: 'nTC', flush: true, zone: 'tsTC' }) +
        '</div>' +
        /* ---- 3. Chỉnh sửa danh sách thi ---- */
        '<div data-v="ct" hidden>' +
            pat.panel({ title: 'Chỉnh sửa - Danh sách thi', icon: 'fa-pen-to-square', count: 'tenDS', flush: true, zone: 'daThem',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.xoaChon('input[data-dt]', { goc: '.ums-panel', attr: { 'data-a': 'xoats' } }) }) +
            pat.panel({ title: 'Danh sách thí sinh chưa lập danh sách', icon: 'fa-users', count: 'nCT', flush: true, zone: 'chuaThem',
                tools: ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'themts' } }) }) +
        '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    function t(k) { return root.querySelector('[data-t="' + k + '"]'); }
    function tv(k) {
        var el = t(k);
        if (el.multiple) return (window.jQuery ? jQuery(el).val() || [] : []).join(',');
        return String(el.value || '').trim();
    }
    ['ds', 'tsTC', 'daThem', 'chuaThem'].forEach(function (k) { T.ganChon(z(k), k === 'daThem' ? 'data-dt' : 'data-ck'); });

    var st = { vung: 'ds', trang: 1, co: 10, ds: [], dsThi: null, p: { tsTD: 1, tsTC: 1, chuaThem: 1 }, c: { tsTD: 10, tsTC: 10, chuaThem: 10 } };
    z('ds').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    z('tsTD').innerHTML = z('tsTC').innerHTML = ui.empty('Chọn môn thi tuyển để xem thí sinh chưa lập danh sách', 'fa-hand-pointer');

    var L = T.noiLoc(root, {
        onKH: napMon, onDot: napMon, onHT: napMon,
        onTim: function () { taiDS(1); }
    });

    /* ---------- Nguồn ô chọn ---------- */
    T.rows({ action: TC + 'LayLoaiDanhSachThi', method: 'GET', strNguoiThucHien_Id: T.uid() })
        .then(function (r) { pat.fill(L.f('loai'), r, { name: 'TEN' }); }, T.loi('loại danh sách thi'));
    ums.ref.thoiGianDaoTao({ pageIndex: 1, pageSize: 100000 }).then(function (r) {
        pat.fill(t('tgTD'), r, { name: 'DAOTAO_THOIGIANDAOTAO' });
        pat.fill(t('tgTC'), r, { name: 'DAOTAO_THOIGIANDAOTAO' });
    }, T.loi('thời gian đào tạo'));
    function napMon() {
        return T.rows({ action: 'TS_TuyenSinhChung/LayDSMonThiTuyen', method: 'GET', strNguoiThucHien_Id: T.uid(),
            strTS_KeHoachTuyenSinh_Id: L.v('kh'), strDotTuyenSinh_Id: L.v('dot'), strDoiTuongDuTuyen_Id: L.v('ht') }).then(function (r) {
            pat.fill(t('monTD'), r, { name: 'TEN' });
            pat.fill(t('monTC'), r, { name: 'TEN' });
        }, T.loi('môn thi tuyển'));
    }

    /* ---------- Chuyển vùng ---------- */
    function mo(k) {
        if (k === st.vung) return;
        ui.swap(vung(st.vung), vung(k));
        st.vung = k;
    }

    /* ---------- Danh sách thi ---------- */
    function taiDS(trang) {
        if (trang) st.trang = trang;
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'D_Hoc/LayDanhSach', method: 'GET', silent: true, strTuKhoa: L.v('q'), strChucNang_Id: T.cn(),
            strDaoTao_LopQuanLy_Id: L.v('ht'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_HocPhan_Id: '', strTrangThai_Id: '',
            strDangKy_KeHoachDangKy_Id: L.v('kh'), strLoaiDanhSach_Id: L.v('loai'), strNguoiDung_Id: '', strNguoiThucHien_Id: T.uid(),
            strNguoiTao_Id: '', pageIndex: st.trang, pageSize: st.co }).then(function (r) {
            st.ds = Array.isArray(r.data) ? r.data : [];
            var tong = Number(r.pager) || st.ds.length;
            z('n').textContent = '(' + tong + ')';
            ui.table({ el: z('ds'), rows: st.ds, empty: 'Không có danh sách thi', columns: [
                { title: 'Danh sách thi', prop: 'TEN' },
                { title: 'Môn thi', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                { title: 'Chi tiết', cls: 'is-center', render: function (x) { return ui.btn('view', { cls: 'ums-btn--sm', attr: { 'data-ct': e(x.ID) } }); } },
                T.cotChon('data-ck')
            ], page: { index: st.trang, size: st.co, total: tong, onChange: taiDS, onSize: function (s) { st.co = s; taiDS(1); } } });
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi'); });
    }

    /* ---------- Thí sinh chưa lập danh sách (ba bảng dùng chung một lời gọi) ---------- */
    var COT_TS = [
        { title: 'Mã số', prop: 'MAHOSO', cls: 'is-nowrap' },
        { title: 'Họ đệm', prop: 'TS_HOSODUTUYEN_HODEM' },
        { title: 'Tên', prop: 'TS_HOSODUTUYEN_TEN', cls: 'is-nowrap' },
        { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
        { title: 'CMT/CCCD', prop: 'TS_HOSODUTUYEN_CMT_SO', cls: 'is-nowrap' },
        { title: 'Phương thức', prop: 'DOITUONGDUTUYEN_TEN' },
        { title: 'Đợt', prop: 'DOTTUYENSINH_TEN' },
        { title: 'Nguyện vọng', prop: 'DSNGUYENVONGTHEOKEHOACH' }
    ];
    /** k = 'tsTD' (xem, môn tự động) · 'tsTC' (chọn, môn tự chọn) · 'chuaThem' (danh sách đang sửa) */
    function taiChua(k, trang) {
        if (trang) st.p[k] = trang;
        var host = z(k), dem = { tsTD: 'nTD', tsTC: 'nTC', chuaThem: 'nCT' }[k];
        var mon = k === 'tsTD' ? tv('monTD') : k === 'tsTC' ? tv('monTC') : '';
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: TC + 'LayDSTS_ThiSinh_Dot_DoiTuong', method: 'GET', silent: true, strTuKhoa: '',
            strDiem_DanhSachHoc_Id: k === 'chuaThem' ? e(st.dsThi && st.dsThi.ID) : '', strDaoTao_HocPhan_Ids: mon,
            strDoiTuongDuTuyen_Id: L.v('ht'), strDotTuyenSinh_Id: L.v('dot'), strTS_KeHoachTuyenSinh_Id: L.v('kh'),
            strTS_HoSoDuTuyen_Id: '', strNguoiTao_Id: '', pageIndex: st.p[k], pageSize: st.c[k] }).then(function (r) {
            var rows = Array.isArray(r.data) ? r.data : [];
            var tong = Number(r.pager) || rows.length;
            root.querySelector('[data-z="' + dem + '"]').textContent = '(' + tong + ')';
            var cols = COT_TS.slice();
            if (k === 'tsTC') cols.push(T.cotChon('data-ck'));
            if (k === 'chuaThem') cols.push(T.cotChon('data-ck', 'TS_HOSODUTUYEN_ID', 'ID'));
            ui.table({ el: host, rows: rows, columns: cols, empty: 'Không có thí sinh chưa lập danh sách',
                page: { index: st.p[k], size: st.c[k], total: tong, onChange: function (p) { taiChua(k, p); },
                    onSize: function (s) { st.c[k] = s; taiChua(k, 1); } } });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thí sinh chưa lập danh sách'); });
    }
    if (window.jQuery) {
        jQuery(t('monTD')).on('select2:select select2:unselect select2:clear', function () {
            if (tv('monTD')) taiChua('tsTD', 1);
            else z('tsTD').innerHTML = ui.empty('Chọn môn thi tuyển để xem thí sinh chưa lập danh sách', 'fa-hand-pointer');
        });
        jQuery(t('monTC')).on('select2:select select2:clear', function () {
            if (tv('monTC')) taiChua('tsTC', 1);
            else z('tsTC').innerHTML = ui.empty('Chọn môn thi tuyển để xem thí sinh chưa lập danh sách', 'fa-hand-pointer');
        });
    }

    /* ---------- Mở vùng tạo: khối thông tin theo ô lọc đang chọn ---------- */
    function moTao(k) {
        Array.prototype.forEach.call(vung(k).querySelectorAll('[data-k]'), function (b) {
            b.textContent = L.chu(b.getAttribute('data-k'));
        });
        napMon();
        mo(k);
    }

    function luuTuDong() {
        if (!tv('monTD')) { ui.toast('Vui lòng chọn môn thi tuyển', 'warn'); return; }
        var so = t('soTS').value.trim();
        if (so && !/^\d+$/.test(so)) { ui.toast('Số thí sinh/danh sách phải là số nguyên dương', 'warn'); t('soTS').focus(); return; }
        ums.api.call({ action: TC + 'LayDSThiTuDong', strTuKhoa: '', strChucNang_Id: T.cn(), strDaoTao_HocPhan_Ids: tv('monTD'),
            strDoiTuongDuTuyen_Id: L.v('ht'), strDotTuyenSinh_Id: L.v('dot'), strTS_KeHoachTuyenSinh_Id: L.v('kh'),
            strLoaiDanhSach_Id: L.v('loai'), strDaoTao_ThoiGianDaoTao_Id: tv('tgTD'), strQuyTacSinhSoBaoDanh_Id: tv('qtTD'),
            dSoThiSinh_DanhSach: so, strNguoiThucHien_Id: T.uid() }).then(function () {
            ui.toast('Tạo danh sách thi tự động thành công!', 'ok');
            mo('ds'); taiDS(1);
        }).catch(function (err) { ums.api.handle(err, 'tạo danh sách tự động'); taiDS(); });
    }
    function luuTuChon() {
        var ids = T.chon(z('tsTC'), 'data-ck').map(function (x) { return x.id; });
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
        ums.api.call({ action: TC + 'LayDSThiThuCong', strTuKhoa: '', strChucNang_Id: T.cn(), strMaDanhSach: tv('ma'),
            strTenDanhSach: tv('ten'), strDaoTao_HocPhan_Ids: tv('monTC'), strDoiTuongDuTuyen_Id: L.v('ht'),
            strDotTuyenSinh_Id: L.v('dot'), strTS_KeHoachTuyenSinh_Id: L.v('kh'), strLoaiDanhSach_Id: L.v('loai'),
            strDaoTao_ThoiGianDaoTao_Id: tv('tgTC'), strDaoTao_HocPhan_Id: tv('monTC'), strTS_ThiSinh_Dot_DT_Ids: ids.join(','),
            strQuyTacSinhSoBaoDanh_Id: tv('qtTC'), strNguoiThucHien_Id: T.uid() }).then(function () {
            ui.toast('Tạo danh sách thi tự chọn thành công!', 'ok');
            mo('ds'); taiDS(1);
        }).catch(function (err) { ums.api.handle(err, 'tạo danh sách tự chọn'); taiDS(); });
    }

    /* ---------- Chi tiết một danh sách thi ---------- */
    function chiTiet(id) {
        var ds = st.ds.filter(function (x) { return e(x.ID) === id; })[0];
        if (!ds) return;
        st.dsThi = ds;
        root.querySelector('[data-z="tenDS"]').textContent = '— ' + e(ds.TEN) + ' - ' + e(ds.DAOTAO_HOCPHAN_TEN) + ' - ' + e(ds.DAOTAO_THOIGIANDAOTAO);
        mo('ct');
        taiDaThem();
        taiChua('chuaThem', 1);
    }
    function taiDaThem() {
        var host = z('daThem');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        T.rows({ action: 'D_Hoc/LayDSNguoiHocTheoDanhSach', method: 'GET', strNguoiThucHien_Id: T.uid(),
            strDiem_DanhSachHoc_Id: e(st.dsThi.ID), strTieuChiSapXep: '' }).then(function (rows) {
            ui.table({ el: host, rows: rows, empty: 'Danh sách chưa có thí sinh', columns: [
                { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-nowrap' },
                { title: 'Mã số', prop: 'MASONGUOIHOC', cls: 'is-nowrap' },
                { title: 'Họ đệm', prop: 'HODEMNGUOIHOC' },
                { title: 'Tên', prop: 'TENNGUOIHOC', cls: 'is-nowrap' },
                { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' },
                { title: 'CMT/CCCD', prop: 'CMTND_SO', cls: 'is-nowrap' },
                { title: 'Phương thức', prop: 'DOITUONGDUTUYEN_TEN' },
                { title: 'Đợt', prop: 'DOTTUYENSINH_TEN' },
                { title: 'Nguyện vọng', prop: 'NGUYENVONG' },
                T.cotChon('data-dt')
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thí sinh trong danh sách'); });
    }
    function sauGhi() { taiDaThem(); taiChua('chuaThem'); }
    function themTS() {
        var chon = T.chon(z('chuaThem'), 'data-ck');
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
        ui.confirm('Thêm ' + chon.length + ' thí sinh vào danh sách thi?', { title: 'Thêm thí sinh', ok: 'Thêm' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (x) {
                return { action: 'D_NguoiHoc/ThemMoi', strChucNang_Id: T.cn(), strDaoTao_LopQuanLy_Id: '', strDaoTao_ChuongTrinh_Id: '',
                    strDiem_DanhSachHoc_Id: e(st.dsThi.ID), strNguonDuLieu_Id: x.name, strQLSV_NguoiHoc_Id: x.id, strNguoiThucHien_Id: T.uid() };
            }), { title: 'Đang thêm thí sinh', okText: 'Thêm mới thành công!', show: true }).then(sauGhi);
        });
    }
    function xoaTS() {
        var chon = T.chon(z('daThem'), 'data-dt');
        if (!chon.length) return;
        ui.confirm('Bạn có chắc chắn xóa ' + chon.length + ' thí sinh khỏi danh sách thi không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá thí sinh' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (x) {
                return { action: 'D_NguoiHoc/Xoa', strDiem_DanhSach_NguoiHoc_Id: x.id, strNguoiThucHien_Id: T.uid() };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!', show: true }).then(sauGhi);
        });
    }

    /* ---------- Tạo số báo danh ---------- */
    function taoSBD() {
        var chon = T.chon(z('ds'), 'data-ck');
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
        ui.batch(chon.map(function (x) {
            return { action: TC + 'LapSoBaoDanhChoDanhSach', strNguoiThucHien_Id: T.uid(), strDiem_DanhSachHoc_Id: x.id, strQuyTacSinhSoBaoDanh_Id: '' };
        }), { title: 'Đang tạo số báo danh', okText: 'Tạo số báo danh thành công!', show: true }).then(function () { taiDS(); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ct]');
        if (b) { chiTiet(b.getAttribute('data-ct')); return; }
        if (!(b = ev.target.closest('[data-a]')) || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'tudong') moTao('tudong');
        else if (a === 'tuchon') moTao('tuchon');
        else if (a === 'dong') mo('ds');
        else if (a === 'luutudong') luuTuDong();
        else if (a === 'luutuchon') luuTuChon();
        else if (a === 'sbd') taoSBD();
        else if (a === 'themts') themTS();
        else if (a === 'xoats') xoaTS();
    });
})();
