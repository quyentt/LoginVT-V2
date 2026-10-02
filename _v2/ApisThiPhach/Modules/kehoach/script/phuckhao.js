/* =========================================================================
   phuckhao — Khảo thí duyệt đăng ký phúc khảo
   Bản gốc: ApisThiPhach/Modules/kehoach/html/phuckhao.html + script/phuckhao.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (một cột): thanh lọc → khung "Danh sách" (nút "Xác nhận tình trạng"; dải "Lọc theo khoa QLHP"
   + "Thống kê theo khoa QLHP"; bảng tiêu đề hai tầng). Nút "Khai báo hạn phúc khảo theo đợt thi" đổi sang vùng
   khai báo thời hạn (thay chỗ danh sách, như #zoneEdit của gốc); thêm / sửa thời hạn là biểu mẫu TRONG TRANG thay chỗ
   vùng khai báo (gốc: hộp thoại — BO-CUC luật 1, ums.pat.formTrang).

   Lời gọi (chép nguyên):
     Hệ đào tạo: edu.extend.genBoLoc_HeKhoa("_PK") → ums.ref.cascadeQuyen (pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen —
         bản LỌC QUYỀN; html gốc chỉ có ô Hệ).
     TP_PhucKhao/LayThoiGianTheoDotThi GET → ô Thời gian (cột THOIGIAN)
     TP_PhucKhao/LayHocPhanPhucKhao GET (strDaoTao_ThoiGianDaoTao_Id) → ô Học phần (TEN)
     danh mục THI.PHUCKHAO.TINHTRANG → ô Kết quả duyệt + các NÚT của hộp xác nhận
     Danh sách: XLHV_TP_PhucKhao_MH/DSA4BRIVKSgRKTQiCikgLgPP · pkg_thi_phach_phuckhao.LayDSThiPhucKhao (POST, mã hoá):
         strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, strNgayHetHanDangKy, strNgayHetHanNopPhi,
         strTinhTrangNopPhi (-1 / 1 / 0), strTinhTrang_Duyet_Id, dChuaCoTrangThaiDuyetNao (1 / 0), strDaoTao_HeDaoTao_Id
         — bắt buộc chọn Hệ đào tạo ("Bạn cần chọn hệ đào tạo").
     Xác nhận: TP_PhucKhao/Them_Thi_PhucKhao_XacNhan POST, mỗi dòng đánh dấu một lời gọi: strLoaiXacNhan_Id
         "DUYETDANGKYPHUCKHAO", strTinhTrang_Id, strNguoiXacNhan_Id, strThongTinXacNhan (ô Nội dung), strDuLieuXacNhan = ID dòng
     Lịch sử: TP_PhucKhao/LayDSThi_PhucKhao_XacNhan GET (strTuKhoa '', strDuLieuXacNhan = dòng ĐẦU đã chọn — như gốc,
         strLoaiXacNhan_Id, strNguoiXacNhan_Id '', strTinhTrang_Id '', pageIndex 1, pageSize 100000)
     Báo cáo / Import: ums.report.mount — strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id, strDaoTao_HeDaoTao_Id
         + một strPhucKhao_Id cho mỗi dòng đánh dấu.
     Vùng thời hạn: TP_Chung/LayThoiGian GET (tự chọn mục đầu) · TP_Chung/LayDotThi GET (strHinhThucThi_Id '',
         strDiem_ThanhPhanDiem_Id '', strDaoTao_ThoiGianDaoTao_Id) → bảng "Phạm vi áp dụng" của hộp Thêm ·
         XLHV_TP_PhucKhao_MH/DSA4BRIVKSgeESk0IgopIC4eFQYeACUP · PKG_THI_PHACH_PHUCKHAO.LayDSThi_PhucKhao_TG_Ad
         (strDaoTao_ThoiGianDaoTao_Id, strPhamViApDung_Id '') · XLHV_TP_PhucKhao_MH/FSkkLB4VKSgeESk0IgopIC4eFQYeACUP ·
         PKG_THI_PHACH_PHUCKHAO.Them_Thi_PhucKhao_TG_Ad (strId — CHỈ gửi khi sửa, thêm mới gốc không gửi khoá này;
         strNgayBatDau, strNgayKetThuc, strNgayHetHanThuPhi, strPhamViApDung_Id).

   Không chép (lỗi rõ của bản gốc):
     · XOÁ thời hạn: gốc gọi NS_KLGD_TinhTien_MH · PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia — thủ tục xoá ĐƠN GIÁ
       khối lượng giảng dạy của Nhân sự (mã chép từ màn khác), không phải xoá thời hạn phúc khảo. Không gọi;
       giữ nút "Xóa" ở trạng thái khoá, bỏ cột ô đánh dấu (chỉ phục vụ nút xoá). Cần thủ tục xoá đúng.
     · Bảng thời hạn: tiêu đề "Tên đợt | Mã đợt" nhưng gốc đổ MA trước TEN (lệch cột) → đổ đúng theo tiêu đề.
     · Ô Thời gian của vùng thời hạn tự chọn mục đầu nhưng gốc không nạp gì tới khi người dùng chọn LẠI (bảng thời hạn
       và bảng phạm vi của hộp Thêm trống) → mở vùng là nạp theo mục đang chọn.
     · Biểu đồ thống kê vẽ vào #zoneBieuDo_KhoaQLHP — vùng không có trong html → bỏ, giữ bảng thống kê.
     · Nút Tìm kiếm gắn HAI trình xử lý (mỗi lần bấm gọi máy chủ hai lần) → một.
     · Mở màn nạp ô Học phần với Thời gian rỗng → theo luật cha → con: Học phần KHOÁ tới khi chọn Thời gian.
   Khác gốc (tự chốt, ghi báo cáo):
     · Ô "Nhập từ khóa tìm kiếm": gốc KHÔNG gửi đi đâu (Enter chỉ tải lại) → nay lọc TẠI CHỖ trên danh sách đã tải
       (mã số, họ tên, học phần). Không thêm tham số vào thủ tục.
     · Biểu mẫu sửa thời hạn: bảng "Phạm vi áp dụng" chỉ dùng khi THÊM (gốc vẫn hiện khi sửa nhưng không đọc) → khi sửa hiện
       tên đợt thi của dòng.
     · Xác nhận xong / lưu thời hạn xong: nạp lại (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tpKt;
    var root = document.getElementById('tp-phuckhao');
    if (!root) return;
    var e = T.e, arr = T.arr, esc = ui.esc, uid = T.uid;
    var LOAI = 'DUYETDANGKYPHUCKHAO', MH = 'XLHV_TP_PhucKhao_MH/';

    root.innerHTML =
        '<div data-z="ds">' +
        pat.page('Khảo thí duyệt đăng ký phúc khảo', '<span data-z="bc"></span>' +
            ui.btn('search', { text: 'Khai báo hạn phúc khảo theo đợt thi', icon: 'fa-paper-plane', mod: 'out-primary', attr: { 'data-a': 'thoihan' } })) +
        pat.filterBar([
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'tg', type: 'select', label: 'Chọn thời gian' },
            { key: 'hp', type: 'select', label: 'Chọn học phần' },
            { key: 'hhdk', type: 'date', label: 'Ngày hết hạn đăng ký' },
            { key: 'hhnp', type: 'date', label: 'Ngày hết hạn nộp phí' }
        ], { search: false, extra:
            '<div class="ums-field"><select class="ums-select" data-f="phi" data-required><option value="-1">--Theo phí--</option>' +
                '<option value="1">Đã nộp</option><option value="0">Chưa nộp</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="kqd" data-ph="Chọn kết quả duyệt"><option value="">Chọn kết quả duyệt</option></select></div>' +
            '<div class="ums-field tpkt-chk"><label class="ums-check"><input type="checkbox" data-f="chua"> <span>Chưa có trạng thái nào duyệt</span></label></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true,
            tools: ui.btn('confirm', { text: 'Xác nhận tình trạng', icon: 'fa-circle-check', mod: 'primary', attr: { 'data-a': 'xacnhan' } }),
            body: '<div class="tpkt-tren">' +
                    ui.field('Lọc theo khoa QLHP', '<select class="ums-select" data-f="kqlhp" data-ph="Tất cả"><option value="">Tất cả</option></select>') +
                    '<div class="tpkt-tren__tk"><span class="ums-u-muted ums-u-fz13" data-z="tk"></span> ' +
                    ui.btn('view', { text: 'Thống kê theo khoa QLHP', icon: 'fa-chart-simple', cls: 'ums-btn--sm', attr: { 'data-a': 'thongke' } }) + '</div></div>' +
                '<div class="tpkt-thongke" data-z="bangtk" hidden></div><div data-z="bang"></div>' }) +
        '</div>' +
        '<div data-z="th" hidden>' +
        pat.panel({ title: 'Khai báo thời hạn phúc khảo theo đợt thi', icon: 'fa-calendar-clock', flush: true,
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('add', { attr: { 'data-a': 'them' } }) +
                ui.btn('del', { text: 'Xóa', mod: 'ghost', attr: { 'data-a': 'xoa', disabled: 'disabled',
                    title: 'Bản gốc gọi nhầm thủ tục xoá đơn giá khối lượng giảng dạy — chờ thủ tục xoá thời hạn phúc khảo' } }),
            body: '<div class="tpkt-tren"><div class="ums-field"><select class="ums-select" data-f="tgpk" data-required data-ph="Chọn thời gian"><option value="">Chọn thời gian</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'timth' } }) + '</div></div><div data-z="bangth"></div>' }) +
        '</div>';
    ui.enhance(root);
    T.ganChon(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? String(f(k).value || '').trim() : ''; }

    /* ---------- Bộ lọc ------------------------------------------------------- */
    ums.ref.cascadeQuyen({ he: f('he') });
    var ch = pat.chain([f('tg'), f('hp')], { phatLai: false });
    function napHP() {
        if (!v('tg')) { pat.fill(f('hp'), [], { head: 'Chọn học phần' }); ch.sync(); return Promise.resolve(); }
        return T.get('TP_PhucKhao/LayHocPhanPhucKhao', { strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần' }); ch.sync(); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    T.get('TP_PhucKhao/LayThoiGianTheoDotThi').then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); ch.sync(); })
        .catch(function (err) { ums.api.handle(err, 'thời gian'); });
    var DMTT = ums.api.dm('THI.PHUCKHAO.TINHTRANG');
    DMTT.then(function (d) { pat.fill(f('kqd'), d, { head: 'Chọn kết quả duyệt' }); }).catch(function (err) { ums.api.handle(err, 'kết quả duyệt'); });

    /* ---------- Danh sách ---------------------------------------------------- */
    var full = [], ds = [], tong = 0, hienTK = false;
    z('bang').innerHTML = ui.empty('Chọn hệ đào tạo rồi bấm "Tìm kiếm"', 'fa-hand-pointer');

    function tenKhoa(x) { var t = String(e(x ? x.DAOTAO_KHOAQUANLYHP_TEN : '')).trim(); return t || '(Chưa xác định)'; }
    function daNop(t) {   // mRender "Phí phúc khảo - Tình trạng" của gốc
        if (typeof t === 'boolean') return t;
        if (typeof t === 'number') return t !== 0;
        if (typeof t === 'string') { var s = t.trim().toLowerCase(); return s !== '' && s !== '0' && s !== 'false' && s !== 'chua nop' && s !== 'chưa nộp'; }
        return !!t;
    }
    function tai() {
        if (!v('he')) { ui.toast('Bạn cần chọn hệ đào tạo', 'warn'); return Promise.resolve(); }
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: MH + 'DSA4BRIVKSgRKTQiCikgLgPP', func: 'pkg_thi_phach_phuckhao.LayDSThiPhucKhao', strNguoiThucHien_Id: uid(),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strNgayHetHanDangKy: v('hhdk'), strNgayHetHanNopPhi: v('hhnp'),
            strTinhTrangNopPhi: v('phi'), strTinhTrang_Duyet_Id: v('kqd'), dChuaCoTrangThaiDuyetNao: f('chua').checked ? 1 : 0,
            strDaoTao_HeDaoTao_Id: v('he') }).then(function (r) {
            full = arr(r.data);
            tong = (typeof r.pager === 'number' || (typeof r.pager === 'string' && r.pager.trim() !== '')) ? r.pager : full.length;
            napKhoa();
            loc();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phúc khảo'); });
    }
    function napKhoa() {
        var thay = {}, ten = [];
        full.forEach(function (x) { var t = tenKhoa(x); if (!thay[t]) { thay[t] = 1; ten.push(t); } });
        ten.sort(function (a, b) { return a.localeCompare(b); });
        pat.fill(f('kqlhp'), ten.map(function (t) { return { ID: t, TEN: t }; }), { head: 'Tất cả' });
    }
    function loc() {
        var k = v('kqlhp'), q = v('q').toLowerCase();
        ds = full.filter(function (x) {
            if (k && tenKhoa(x) !== k) return false;
            if (!q) return true;
            return (e(x.QLSV_NGUOIHOC_MASO) + ' ' + e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN) + ' ' +
                e(x.DAOTAO_HOCPHAN_TEN) + ' ' + e(x.DAOTAO_HOCPHAN_MA)).toLowerCase().indexOf(q) >= 0;
        });
        ve();
        thongKe();
    }
    function ve() {
        z('n').textContent = 'Tổng số bản ghi: ' + ui.so(tong);
        var G1 = ['Kết quả thi ban đầu'], G2 = ['Đăng ký phúc khảo'];
        ui.table({ el: z('bang'), rows: ds, stt: false, empty: 'Không có dữ liệu', columns: [
            { title: 'Stt', group: G1, cls: 'is-center', width: '56px', render: function (x, i) { return String(i + 1); } },
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: G1, cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', group: G1 },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', group: G1 }, { title: 'Email', prop: 'QLSV_NGUOIHOC_EMAIL', group: G1 },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLYSV_TEN', group: G1 }, { title: 'Túi', prop: 'TUI', group: G1, cls: 'is-center' },
            { title: 'Số phách', prop: 'SOPHACH', group: G1, cls: 'is-center' }, { title: 'SBD', prop: 'SOBAODANH', group: G1, cls: 'is-center' },
            { title: 'Ca thi', prop: 'CATHI_TEN', group: G1, cls: 'is-center' }, { title: 'Phòng thi', prop: 'PHONGTHI_TEN', group: G1, cls: 'is-center' },
            { title: 'Học phần thi', group: G1, render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
            { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN', group: G1 }, { title: 'Ngày thi', prop: 'NGAYTHI', group: G1, cls: 'is-center is-nowrap' },
            { title: 'Kết quả', group: G1, cls: 'is-center', render: function (x) { return esc(T.diem(x.DIEM)); } },
            T.cotChon(),
            { title: 'Khoa quản lý HP', prop: 'DAOTAO_KHOAQUANLYHP_TEN' },
            { title: 'Ngày công bố điểm', prop: 'NGAYXACNHANHOANTHANHDIEMTHI', group: G2, cls: 'is-center' },
            { title: 'Ngày đăng ký phúc khảo', prop: 'NGAYDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
            { title: 'Ngày hết hạn đăng ký', prop: 'NGAYHETHANDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
            { title: 'Ngày hết hạn nộp phí', prop: 'NGAYHETHANNOPPHIPHUCKHAO', group: G2, cls: 'is-center' },
            { title: 'Phí phúc khảo - Tình trạng', group: G2, cls: 'is-center',
                render: function (x) { return esc(e(x.PHIPHUCKHAO) + ' - ' + (daNop(x.TINHTRANGNOPPHI) ? 'Đã nộp' : 'Chưa nộp')); } },
            { title: 'Kết quả', group: ['Kết quả sau phúc khảo'], cls: 'is-center', render: function (x) { return esc(T.diem(x.KETQUAPHUCKHAO)); } },
            { title: 'Kết quả duyệt', prop: 'TINHTRANG_TEN', group: ['Duyệt'], cls: 'is-center' }] });
    }
    function thongKe() {
        z('tk').innerHTML = 'Đang chọn: <b>' + esc(v('kqlhp') || 'Tất cả') + '</b> — Hiển thị: <b>' + ui.so(ds.length) + '</b> / Tổng: <b>' + ui.so(full.length) + '</b>';
        z('bangtk').hidden = !hienTK;
        if (!hienTK) return;
        var dem = {};
        full.forEach(function (x) { var t = tenKhoa(x); dem[t] = (dem[t] || 0) + 1; });
        var dong = Object.keys(dem).sort(function (a, b) { return dem[b] - dem[a]; }).map(function (t) { return { TEN: t, SO: dem[t] }; });
        ui.table({ el: z('bangtk'), rows: dong, stt: false, empty: 'Chưa có dữ liệu', columns: [{ title: 'Khoa QLHP', prop: 'TEN' },
            { title: 'Số đơn', cls: 'is-center', width: '120px', render: function (x) { return ui.so(x.SO); } }] });
    }
    function daChon() { return T.daChon(z('bang'), ds); }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strDaoTao_HocPhan_Id', v('hp')); add('strDaoTao_HeDaoTao_Id', v('he'));
        daChon().forEach(function (x) { add('strPhucKhao_Id', x.ID); });
    } });

    function xacNhan() {
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        T.xacNhan({ tieuDe: 'Xác nhận', icon: 'fa-file-circle-check', soChon: chon.length,
            nut: function () { return DMTT; },
            lichSu: function () {
                return T.get('TP_PhucKhao/LayDSThi_PhucKhao_XacNhan', { strTuKhoa: '', strDuLieuXacNhan: chon[0].ID, strLoaiXacNhan_Id: LOAI,
                    strNguoiXacNhan_Id: '', strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) { return arr(r.data); });
            },
            lichSuTen: 'Lịch sử xác nhận' + (chon.length > 1 ? ' (dòng đầu đã chọn: ' + e(chon[0].QLSV_NGUOIHOC_MASO) + ')' : ''),
            luu: function (tt, noiDung) {
                return chon.map(function (x) {
                    return { action: 'TP_PhucKhao/Them_Thi_PhucKhao_XacNhan', method: 'POST', strLoaiXacNhan_Id: LOAI, strTinhTrang_Id: tt, strNguoiXacNhan_Id: uid(),
                        strThongTinXacNhan: noiDung, strDuLieuXacNhan: x.ID, strNguoiThucHien_Id: uid() };
                });
            },
            onDone: tai });
    }

    /* ---------- Vùng khai báo thời hạn phúc khảo ------------------------------ */
    var dsTH = [], dsDot = [], daMoTH = false;
    function taiTH() {
        z('bangth').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: MH + 'DSA4BRIVKSgeESk0IgopIC4eFQYeACUP', func: 'PKG_THI_PHACH_PHUCKHAO.LayDSThi_PhucKhao_TG_Ad',
            strDaoTao_ThoiGianDaoTao_Id: v('tgpk'), strPhamViApDung_Id: '', strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strNguoiThucHien_Id: uid() })
            .then(function (r) {
                dsTH = arr(r.data);
                ui.table({ el: z('bangth'), rows: dsTH, empty: 'Chưa khai báo thời hạn phúc khảo', columns: [
                    { title: 'Tên đợt', prop: 'TEN' }, { title: 'Mã đợt', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' }, { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                    { title: 'Ngày hết hạn nộp phí', prop: 'NGAYHETHANTHUPHI', cls: 'is-center is-nowrap' },
                    { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap' }, { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' },
                    { title: 'Sửa', cls: 'is-center is-actions', width: '70px', render: function (x, i) { return '<span data-sua="' + i + '">' + ui.iconBtn('edit', x.ID) + '</span>'; } }] });
            }).catch(function (err) { z('bangth').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thời hạn phúc khảo'); });
    }
    function taiDot() {
        dsDot = [];
        if (!v('tgpk')) return Promise.resolve();
        return T.get('TP_Chung/LayDotThi', { strHinhThucThi_Id: '', strDiem_ThanhPhanDiem_Id: '', strDaoTao_ThoiGianDaoTao_Id: v('tgpk') })
            .then(function (r) { dsDot = arr(r.data); }).catch(function (err) { ums.api.handle(err, 'đợt thi'); });
    }
    function moTH() {
        ui.swap(z('ds'), z('th'));
        if (daMoTH) return;
        daMoTH = true;
        T.get('TP_Chung/LayThoiGian').then(function (r) {
            var d = arr(r.data);
            pat.fill(f('tgpk'), d, { name: 'THOIGIAN', head: 'Chọn thời gian' });
            if (d.length) { f('tgpk').value = d[0].ID; if (window.jQuery) jQuery(f('tgpk')).trigger('change.select2'); }
            taiTH(); taiDot();
        }).catch(function (err) { daMoTH = false; ums.api.handle(err, 'thời gian'); });
    }
    /* Thêm / sửa thời hạn — biểu mẫu TRONG TRANG (BO-CUC luật 1): thay chỗ vùng khai báo thời hạn (z('th') đã là khung thay chỗ
       danh sách → tầng hai, nút Đóng của khung ngoài ẩn theo). Lưu: đợi lô chạy xong mới đóng, có lời gọi lỗi thì GIỮ biểu mẫu
       (trước đây hộp đóng trước khi lô chạy — lỗi là mất ngày đang nhập). */
    function hopTH(row) {
        var dlg = pat.formTrang({ host: z('th'), title: 'Thời hạn phúc khảo theo đợt thi', icon: row ? 'fa-pen-to-square' : 'fa-plus', cols: 1,
            body: '<div class="ums-grid ums-grid--2">' +
                    ui.field('Ngày bắt đầu', '<input class="ums-input" data-x="bd" data-date placeholder="dd/mm/yyyy" autocomplete="off" value="' + esc(row ? e(row.NGAYBATDAU) : '') + '">') +
                    ui.field('Ngày kết thúc', '<input class="ums-input" data-x="kt" data-date placeholder="dd/mm/yyyy" autocomplete="off" value="' + esc(row ? e(row.NGAYKETTHUC) : '') + '">') +
                    ui.field('Ngày hết hạn nộp phí', '<input class="ums-input" data-x="hh" data-date placeholder="dd/mm/yyyy" autocomplete="off" value="' + esc(row ? e(row.NGAYHETHANTHUPHI) : '') + '">') +
                    (row ? ui.field('Đợt thi', '<input class="ums-input" disabled value="' + esc(e(row.TEN)) + '">') : '') +
                '</div>' +
                (row ? '' : '<div class="ums-legend ums-legend--cach">Phạm vi áp dụng</div><div data-x="pv"></div>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var pv = row ? [row.PHAMVIAPDUNG_ID] : T.daChon(q('pv'), dsDot).map(function (d) { return d.ID; });
                if (!pv.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                var calls = pv.map(function (id) {
                    var o = { action: MH + 'FSkkLB4VKSgeESk0IgopIC4eFQYeACUP', func: 'PKG_THI_PHACH_PHUCKHAO.Them_Thi_PhucKhao_TG_Ad' };
                    if (row) o.strId = row.ID;   // thêm mới: gốc KHÔNG gửi khoá strId (undefined rơi khỏi JSON)
                    o.strNgayBatDau = q('bd').value.trim(); o.strNgayKetThuc = q('kt').value.trim(); o.strNgayHetHanThuPhi = q('hh').value.trim();
                    o.strPhamViApDung_Id = id; o.strChucNang_Id = (ums.state && ums.state.chucNangId) || ''; o.strNguoiThucHien_Id = uid();
                    return o;
                });
                ui.batch(calls, { title: 'Đang lưu', okText: row ? 'Cập nhật thành công!' : 'Thêm mới thành công!', show: true }).then(function (r) {
                    if (!r.fail) dlg.close();
                    taiTH();
                });
                return false;
            } }] });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        T.ganChon(dlg.body);
        if (!row) ui.table({ el: q('pv'), rows: dsDot, empty: 'Thời gian này chưa có đợt thi', columns: [{ title: 'Tên đợt thi', prop: 'TEN' }, T.cotChon()] });
    }

    /* ---------- Sự kiện ------------------------------------------------------ */
    if (window.jQuery) {
        jQuery(f('tg')).on('select2:select select2:clear', napHP);
        jQuery(f('kqlhp')).on('select2:select select2:clear', loc);
        jQuery(f('tgpk')).on('select2:select', function () { taiTH(); taiDot(); });
    }
    root.addEventListener('click', function (ev) {
        var s = ev.target.closest('[data-sua]');
        if (s && root.contains(s)) { var r = dsTH[Number(s.getAttribute('data-sua'))]; if (r) hopTH(r); return; }
        var b = ev.target.closest('[data-a]'); if (!b || !root.contains(b) || b.disabled) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai();
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'thongke') {
            hienTK = !hienTK;
            b.querySelector('span').textContent = hienTK ? 'Ẩn thống kê theo khoa QLHP' : 'Thống kê theo khoa QLHP';
            thongKe();
        }
        else if (a === 'thoihan') moTH();
        else if (a === 'dong') ui.swap(z('th'), z('ds'));
        else if (a === 'timth') taiTH();
        else if (a === 'them') {
            if (!v('tgpk')) { ui.toast('Chọn thời gian trước khi thêm thời hạn', 'warn'); return; }
            hopTH(null);
        }
    });
    f('q').addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        if (full.length) loc(); else tai();
    });
    f('q').addEventListener('input', function () { if (full.length) loc(); });
})();
