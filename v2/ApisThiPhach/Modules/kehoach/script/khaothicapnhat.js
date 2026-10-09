/* =========================================================================
   khaothicapnhat — Cập nhật tình trạng vi phạm quy chế thi
   Bản gốc: ApisThiPhach/Modules/kehoach/html/khaothicapnhat.html + script/khaothicapnhat.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): thanh lọc (Thời gian · Loại điểm · Đợt thi CHỌN NHIỀU · Học phần · Ca thi ·
   Ngày thi · Danh sách thi · từ khoá · Tìm kiếm) → khung "Danh sách" với bốn nút: Xem không đủ dk thi ·
   Xem vi phạm Quy chế · Công bố lịch · Xác nhận tình trạng. Ba hộp thoại như gốc (#modal_XacNhan, #modal_CongBo,
   #modal_ViPham).

   Lời gọi (kiểu cũ, GET trừ khi ghi — chép nguyên):
     TP_ToChucThi/LayDSThoiGian → ô Thời gian (THOIGIAN)
     TP_ToChucThi/LayDSThanhPhanDiemSauThi (strDaoTao_ThoiGianDaoTao_Id) → ô Loại điểm (TEN)
     TP_ToChucThi/LayDSDotThi (strDaoTao_ThoiGianDaoTao_Id, strDiem_ThanhPhanDiem_Id) → ô Đợt thi: "TENDOTTHI - NGAYBD - NGAYKT"
     TP_ToChucThi/LayDSHocPhan (strDotThi_Id, strHinhThucThi_Id '', strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id,
         strTHI_DotThi_Id) → ô Học phần: "DAOTAO_HOCPHAN_TEN (DAOTAO_HOCPHAN_MA)"
     TP_ToChucThi/LayDSCaThi (strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, strTHI_DotThi_Id, strDiem_ThanhPhanDiem_Id) → CATHI_TEN
     TP_ToChucThi/LayDSThi (strThi_CaThi_Id, strNgayThi '', + bốn khoá trên) → ô Danh sách thi:
         "MADANHSACHTHI - NGAYTHI - THI_CATHI_TEN - TKB_PHONGHOC_TEN"; gõ ô Ngày thi là lọc TẠI CHỖ danh sách này theo nhãn
     Danh sách: TP_ToChucThi/LayDSThiChiTietTheoDieuKien (strTuKhoa, strThi_CaThi_Id, strNgayThi, strDaoTao_ThoiGianDaoTao_Id,
         strDaoTao_HocPhan_Id, strTHI_DotThi_Id, strDiem_ThanhPhanDiem_Id, strThi_DanhSachThi_Id)
     Nút tình trạng: TP_Chung/LayTrangThaiSauThi (strNguoiDung_Id) · nút công bố: TP_Chung/LayTrangThaiCongBoLich (strNguoiDung_Id)
     Xác nhận: POST TP_XacNhanSauThi/ThemMoi mỗi dòng đánh dấu một lời gọi — strId '', strSanPham_Id = ID dòng GHÉP LIỀN
         IDDANHSACHTHI (không dấu cách, như gốc), strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id (chữ n thường như gốc)
     Lịch sử: TP_XacNhanSauThi/LayDanhSach (strTuKhoa '', strsanpham_Id = khoá ghép trên, strTinhTrang_Id '', strNguoiThucHien_Id '',
         pageIndex 1, pageSize 100000) — chỉ khi đánh dấu ĐÚNG MỘT dòng (như gốc)
     Công bố lịch: POST TP_CongBoLichThi/Them_CongBoLichThi_DotThi mỗi ĐỢT THI đang chọn ở ô lọc một lời gọi — strId '',
         strSanPham_Id = ID đợt thi, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id
     Xem không đủ đk thi: TP_BaoCao/LayDSViPhamQuyCheTruocThi · Xem vi phạm quy chế: TP_BaoCao/LayDSViPhamQuyCheSauThi —
         strThi_DanhSachThi_Id = các ID DÒNG đang đánh dấu nối phẩy (tên tham số là "danh sách thi" nhưng gốc gửi ID dòng — giữ),
         strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, strThi_DotThi_Id, strDiem_ThanhPhanDiem_Id
     Báo cáo: ums.report.mount (strDaoTao_ThoiGianDaoTao_Id, strDiem_ThanhPhanDiem_Id, strThi_DanhSachThi_Id, strDaoTao_HocPhan_Id,
         strTHI_DotThi_Id); html gốc có vùng _Import viết tay → import: false + nút Import riêng:
         ums.report.importChung('Import Vi phạm quy chế thi', 'IMPORTWITHPROC_VPQCT') (nút .btnImportWithProce của gốc).
     Ô Đợt thi chọn nhiều gửi chuỗi "id,id" (edu.util.getValById nối phẩy) ở MỌI lời gọi.

   Không chép (lỗi rõ của bản gốc):
     · Bảng chính 13 tiêu đề / 14 cột dữ liệu: thiếu tiêu đề "Hình thức thi" nên từ cột đó trở đi lệch một cột
       (Trạng thái nằm dưới "Số báo danh", ô đánh dấu rơi ra ngoài) → thêm cột "Hình thức thi".
     · Nút "Xác nhận tình trạng" khi đánh dấu đúng một dòng: gốc đọc arrChecked_Id[i] với i chưa khai báo → ReferenceError,
       lịch sử không bao giờ nạp → nạp đúng theo dòng đó.
     · Hộp "Công bố lịch" có bảng "Lịch sử" nhưng KHÔNG nơi nào nạp (getList_CongBo không được gọi, và nó là bản chép của
       lịch sử xác nhận sau thi) → không vẽ khối lịch sử.
     · Mở màn nạp ô Loại điểm với Thời gian rỗng → theo luật cha → con: khoá tới khi chọn Thời gian.
     · Số dòng ở đầu khung "Danh sách" gốc không bao giờ điền → điền số dòng đang hiện.
   Khác gốc (tự chốt, ghi báo cáo):
     · Công bố lịch hỏi lại trước khi ghi (việc công bố cho người học, ghi theo từng đợt thi).
     · Đổi / xoá ô cha thì ô con bị xoá trắng và nạp lại; xoá Đợt thi thì Học phần / Ca thi / Danh sách thi khoá lại.
     · Hộp vi phạm: cột "Hình thức" đổ cột TRANGTHAI đúng như gốc (giữ — chưa rõ máy chủ trả gì ở cột này).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tpKt;
    var root = document.getElementById('tp-khaothicapnhat');
    if (!root) return;
    var e = T.e, arr = T.arr, esc = ui.esc, uid = T.uid, TC = 'TP_ToChucThi/';

    root.innerHTML =
        pat.page('Cập nhật tình trạng vi phạm quy chế thi', '<span data-z="bc"></span>' +
            ui.btn('importer', { attr: { 'data-a': 'import', title: 'Import Vi phạm quy chế thi' } })) +
        pat.filterBar([
            { key: 'tg', type: 'select', label: 'Chọn học kỳ' },
            { key: 'ld', type: 'select', label: 'Chọn loại điểm' },
            { key: 'dot', type: 'select', label: 'Chọn đợt thi', multiple: true },
            { key: 'hp', type: 'select', label: 'Chọn học phần' },
            { key: 'ca', type: 'select', label: 'Chọn ca thi' },
            { key: 'ngay', type: 'text', label: 'Nhập ngày thi' },
            { key: 'ds', type: 'select', label: 'Chọn danh sách thi' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('view', { text: 'Xem không đủ dk thi', mod: 'primary', attr: { 'data-a': 'dieukien' } }) +
                ui.btn('view', { text: 'Xem vi phạm Quy chế', mod: 'out-success', attr: { 'data-a': 'vipham' } }) +
                ui.btn('confirm', { text: 'Công bố lịch', icon: 'fa-calendar-clock', mod: 'danger', attr: { 'data-a': 'congbo' } }) +
                ui.btn('confirm', { text: 'Xác nhận tình trạng', mod: 'warn', attr: { 'data-a': 'xacnhan' } }) });
    ui.enhance(root);
    T.ganChon(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) {
        var el = f(k); if (!el) return '';
        if (el.multiple) return (window.jQuery ? jQuery(el).val() || [] : []).filter(function (x) { return x && x !== 'SELECTALL'; }).join(',');
        return String(el.value || '').trim();
    }

    /* ---------- Bộ lọc nối tầng ---------------------------------------------- */
    var dsThi = [];
    function nhanDS(x) {
        return [x.MADANHSACHTHI, x.NGAYTHI, x.THI_CATHI_TEN, x.TKB_PHONGHOC_TEN]
            .map(function (s) { return s === null || s === undefined ? '' : String(s).trim(); })
            .filter(function (s) { return s.length > 0; }).join(' - ');
    }
    function veDS() {
        var g = v('ngay').toLowerCase();
        pat.fill(f('ds'), dsThi.filter(function (x) { return nhanDS(x).toLowerCase().indexOf(g) !== -1; }), { name: nhanDS, head: 'Chọn danh sách thi' });
    }
    function bon() { return { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strTHI_DotThi_Id: v('dot'), strDiem_ThanhPhanDiem_Id: v('ld') }; }
    var NAP = {
        ld: { cha: 'tg', goi: function () { return T.get(TC + 'LayDSThanhPhanDiemSauThi', { strDaoTao_ThoiGianDaoTao_Id: v('tg') }); },
            ve: function (d) { pat.fill(f('ld'), d, { head: 'Chọn loại điểm' }); }, ten: 'loại điểm' },
        dot: { cha: 'tg', goi: function () { return T.get(TC + 'LayDSDotThi', { strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDiem_ThanhPhanDiem_Id: v('ld') }); },
            ve: function (d) { pat.fill(f('dot'), d, { name: function (x) { return e(x.TENDOTTHI) + ' - ' + e(x.NGAYBD) + ' - ' + e(x.NGAYKT); } }); }, ten: 'đợt thi' },
        hp: { cha: 'dot', goi: function () { return T.get(TC + 'LayDSHocPhan', { strDotThi_Id: v('dot'), strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: v('ld'),
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strTHI_DotThi_Id: v('dot') }); },
            ve: function (d) { pat.fill(f('hp'), d, { name: function (x) { return e(x.DAOTAO_HOCPHAN_TEN) + ' (' + e(x.DAOTAO_HOCPHAN_MA) + ')'; }, head: 'Chọn học phần' }); }, ten: 'học phần' },
        ca: { cha: 'dot', goi: function () { return T.get(TC + 'LayDSCaThi', bon()); },
            ve: function (d) { pat.fill(f('ca'), d, { name: 'CATHI_TEN', head: 'Chọn ca thi' }); }, ten: 'ca thi' },
        ds: { cha: 'dot', goi: function () { return T.get(TC + 'LayDSThi', Object.assign({ strThi_CaThi_Id: v('ca'), strNgayThi: '' }, bon())); },
            ve: function (d) { dsThi = d; veDS(); }, ten: 'danh sách thi' }
    };
    var DUOI = { tg: ['ld', 'dot', 'hp', 'ca', 'ds'], ld: ['dot', 'hp', 'ca', 'ds'], dot: ['hp', 'ca', 'ds'], hp: ['ca', 'ds'], ca: ['ds'] };
    var chuoi = [pat.chain([f('tg'), f('ld')], { phatLai: false }), pat.chain([f('tg'), f('dot'), f('hp')], { phatLai: false }),
        pat.chain([f('dot'), f('ca')], { phatLai: false }), pat.chain([f('dot'), f('ds')], { phatLai: false })];
    function dongBo() { chuoi.forEach(function (c) { c.sync(); }); }
    function xoaO(k) {
        var el = f(k);
        if (el.multiple) { if (window.jQuery) jQuery(el).val([]); } else el.value = '';
    }
    function nap(k) {
        var n = NAP[k];
        if (!v(n.cha)) { n.ve([]); dongBo(); return Promise.resolve(); }
        return n.goi().then(function (r) { n.ve(arr(r.data)); dongBo(); }).catch(function (err) { ums.api.handle(err, n.ten); });
    }
    var luot = 0;
    function doi(k) {
        var l = ++luot, p = Promise.resolve();
        DUOI[k].forEach(xoaO);
        if (k !== 'tg' && k !== 'ld') f('ngay').value = '';
        DUOI[k].forEach(function (d) { p = p.then(function () { return l === luot ? nap(d) : null; }); });
        return p;
    }
    T.get(TC + 'LayDSThoiGian').then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn học kỳ' }); dongBo(); })
        .catch(function (err) { ums.api.handle(err, 'thời gian'); });
    if (window.jQuery) {
        Object.keys(DUOI).forEach(function (k) {
            jQuery(f(k)).on('select2:select select2:unselect select2:clear', function () { doi(k); });
        });
        jQuery(f('ds')).on('select2:select', function () { tai(); });
    }
    f('ngay').addEventListener('input', veDS);

    /* ---------- Danh sách ---------------------------------------------------- */
    var ds = [];
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return T.get(TC + 'LayDSThiChiTietTheoDieuKien', { strTuKhoa: v('q'), strThi_CaThi_Id: v('ca'), strNgayThi: v('ngay'),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strTHI_DotThi_Id: v('dot'), strDiem_ThanhPhanDiem_Id: v('ld'),
            strThi_DanhSachThi_Id: v('ds') }).then(function (r) {
            ds = arr(r.data);
            z('n').textContent = '(' + ui.so(ds.length) + ')';
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                { title: 'Danh sách thi', prop: 'THI_DANHSACHTHI_TEN' },
                { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' (' + e(x.DAOTAO_HOCPHAN_MA) + ')'); } },
                { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN' },
                { title: 'Trạng thái', prop: 'TRANGTHAI' }, { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
                T.cotChon()] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi'); });
    }
    function daChon() { return T.daChon(z('bang'), ds); }
    function khoa(x) { return String(e(x.ID)) + String(e(x.IDDANHSACHTHI)); }

    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strDiem_ThanhPhanDiem_Id', v('ld')); add('strThi_DanhSachThi_Id', v('ds'));
        add('strDaoTao_HocPhan_Id', v('hp')); add('strTHI_DotThi_Id', v('dot'));
    } });

    /* ---------- Ba hộp thoại -------------------------------------------------- */
    function xacNhan() {
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        T.xacNhan({ tieuDe: 'Xác nhận', icon: 'fa-file-circle-check', soChon: chon.length,
            chuDe: chon.length === 1 ? e(chon[0].QLSV_NGUOIHOC_MASO) + ' ' + e(chon[0].QLSV_NGUOIHOC_HODEM) + ' ' + e(chon[0].QLSV_NGUOIHOC_TEN) : '',
            nut: function () { return T.get('TP_Chung/LayTrangThaiSauThi', { strNguoiDung_Id: uid() }).then(function (r) { return arr(r.data); }); },
            lichSu: chon.length === 1 ? function () {
                return T.get('TP_XacNhanSauThi/LayDanhSach', { strTuKhoa: '', strsanpham_Id: khoa(chon[0]), strTinhTrang_Id: '', strNguoiThucHien_Id: '',
                    pageIndex: 1, pageSize: 100000 }).then(function (r) { return arr(r.data); });
            } : null,
            luu: function (tt, noiDung) {
                return chon.map(function (x) {
                    return { action: 'TP_XacNhanSauThi/ThemMoi', method: 'POST', strId: '', strSanPham_Id: khoa(x), strNoiDung: noiDung, strTinhTrang_Id: tt, strNguoiXacnhan_Id: uid() };
                });
            },
            onDone: tai });
    }
    function congBo() {
        var dot = v('dot') ? v('dot').split(',') : [];
        if (!dot.length) { ui.toast('Vui lòng chọn đợt thi!', 'warn'); return; }
        T.xacNhan({ tieuDe: 'Công bố lịch', icon: 'fa-calendar-clock', soChon: dot.length, khongLichSu: true,
            hoi: 'Công bố lịch cho ' + dot.length + ' đợt thi đang chọn với tình trạng "{ten}"?',
            nut: function () { return T.get('TP_Chung/LayTrangThaiCongBoLich', { strNguoiDung_Id: uid() }).then(function (r) { return arr(r.data); }); },
            luu: function (tt, noiDung) {
                return dot.map(function (id) {
                    return { action: 'TP_CongBoLichThi/Them_CongBoLichThi_DotThi', method: 'POST', strId: '', strSanPham_Id: id, strNoiDung: noiDung, strTinhTrang_Id: tt, strNguoiXacnhan_Id: uid() };
                });
            },
            onDone: tai });
    }
    function viPham(truoc) {
        var dlg = ui.dialog({ title: truoc ? 'Danh sách cấm thi' : 'Danh sách sinh viên vi phạm quy chế', icon: 'fa-address-book', size: 'xl', body: '<div data-x="b"></div>' });
        var h = dlg.body.querySelector('[data-x="b"]');
        h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        T.get('TP_BaoCao/' + (truoc ? 'LayDSViPhamQuyCheTruocThi' : 'LayDSViPhamQuyCheSauThi'), {
            strThi_DanhSachThi_Id: daChon().map(function (x) { return x.ID; }).join(','), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'),
            strThi_DotThi_Id: v('dot'), strDiem_ThanhPhanDiem_Id: v('ld') }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Không có dữ liệu', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'SBD', prop: 'SOBAODANH', cls: 'is-center' },
                { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' (' + e(x.DAOTAO_HOCPHAN_MA) + ')'); } },
                { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' }, { title: 'Hình thức', prop: 'TRANGTHAI' }, { title: 'Lý do', prop: 'LYDO' }] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách vi phạm'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]'); if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'congbo') congBo();
        else if (a === 'dieukien') viPham(true);
        else if (a === 'vipham') viPham(false);
        else if (a === 'import') ums.report.importChung('Import Vi phạm quy chế thi', 'IMPORTWITHPROC_VPQCT', { onDone: tai });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
