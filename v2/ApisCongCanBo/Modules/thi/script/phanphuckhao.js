/* =========================================================================
   phanphuckhao — Phân phúc khảo: danh sách bài đăng ký phúc khảo, phân cán bộ chấm phúc khảo, duyệt đăng ký.
   Bản gốc: thi/script/phanphuckhao.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       TP_PhucKhao/LayThoiGianTheoDotThi (GET) → TP_PhucKhao/LayHocPhanPhucKhao (strDaoTao_ThoiGianDaoTao_Id) · Khoa ums.ref.khoaQuanLy
       danh mục THI.PHUCKHAO.TINHTRANG (ô Kết quả duyệt + ô trạng thái của hộp duyệt)
       Danh sách XLHV_TP_PhucKhao_MH · pkg_thi_phach_phuckhao.LayDSThiPhucKhao (strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id,
         strNgayHetHanDangKy, strNgayHetHanNopPhi, strTinhTrangNopPhi -1/1/0, strTinhTrang_Duyet_Id, dChuaCoTrangThaiDuyetNao 0)
         — Khoa lọc NGAY trên danh sách: tên khoa của SV hoặc của HP CHỨA tên khoa đã chọn (như gốc)
       Phân cán bộ: ums.thi.canBo — pkg_thi_phancong.LayDSNhanSuPhanCongChamThiPK / Them_Thi_GiaoVien_ChamThiPK (mỗi cán bộ × mỗi dòng,
         không bước Thứ tự / Số lượng — như gốc) / Xoa_Thi_GiaoVien_ChamThiPK
       Duyệt: POST TP_PhucKhao/Them_Thi_PhucKhao_XacNhan (strLoaiXacNhan_Id "DUYETDANGKYPHUCKHAO", strTinhTrang_Id, strNguoiXacNhan_Id,
         strThongTinXacNhan, strDuLieuXacNhan = ID dòng) · lịch sử TP_PhucKhao/LayDSThi_PhucKhao_XacNhan (dòng ĐẦU đã chọn, như gốc)
       Báo cáo ums.report.mount: strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id + một strPhucKhao_Id mỗi dòng đánh dấu
   Không chép (lỗi rõ của bản gốc):
     · Hai tiêu đề nhóm "Kết quả sau phúc khảo" / "Duyệt" đặt ngược cột → đặt đúng.
     · Bảng lịch sử 4 tiêu đề / 5 cột (thiếu "Nội dung") → đủ cột. Tiêu đề hộp duyệt trống → "Duyệt đăng ký phúc khảo".
     · Ô nội dung duyệt không có trong html (luôn gửi rỗng) → thêm ô Nội dung. Bắt chọn trạng thái trước khi Đồng ý.
     · Báo cáo gắn nhầm bộ khoá của phancoithi (đọc toàn ô không có) → dùng bộ khoá đúng của màn (vùng báo cáo gốc bị thiếu).
     · Mở màn tải danh sách chưa lọc thời gian; lưu phân công không nạp lại danh sách → nạp lại.
     · Tiêu đề trang ghi "Phân coi thi" → "Phân phúc khảo".
   Chờ nghiệp vụ: lọc Khoa theo CHUỖI tên (khớp cả "Khoa Kinh tế và …") — giữ; ô "Chưa có trạng thái nào duyệt" bị ẩn ở gốc → bỏ, gửi 0.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, thi = ums.thi;
    var root = document.getElementById('thi-phanphuckhao');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: 'TP_PhucKhao/' + a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    function diem(v) { var n = parseFloat(v); return v === '' || v === null || v === undefined || isNaN(n) ? e(v) : n.toFixed(1).replace('.', ','); }
    var LOAI = 'DUYETDANGKYPHUCKHAO';

    root.innerHTML = pat.page('Phân phúc khảo', '<span data-z="bc"></span>' + ui.btn('save', { text: 'Xác nhận', icon: 'fa-circle-check', mod: 'out-success', attr: { 'data-a': 'xacnhan' } }) +
            ui.btn('save', { text: 'Phân chấm và nhập điểm', icon: 'fa-chalkboard-user', mod: 'primary', attr: { 'data-a': 'phan' } })) +
        pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'hp', type: 'select', label: 'Chọn học phần' },
            { key: 'hhdk', type: 'date', label: 'Ngày hết hạn đăng ký' }, { key: 'hhnp', type: 'date', label: 'Ngày hết hạn nộp phí' }, { key: 'kqd', type: 'select', label: 'Chọn kết quả duyệt' },
            { key: 'khoa', type: 'select', label: 'Chọn khoa' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }], { searchText: 'Danh sách thi',
            extra: '<div class="ums-field"><select class="ums-select" data-f="phi" data-no-s2><option value="-1">--Theo phí--</option><option value="1">Đã nộp</option><option value="0">Chưa nộp</option></select></div>' }) +
        pat.panel({ title: 'Danh sách phúc khảo', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }

    var ch = pat.chain([f('tg'), f('hp')], { phatLai: false });
    function napHP() {
        if (!v('tg')) { pat.fill(f('hp'), []); ch.sync(); return Promise.resolve(); }
        return get('LayHocPhanPhucKhao', { strDaoTao_ThoiGianDaoTao_Id: v('tg') }).then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần' }); ch.sync(); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    get('LayThoiGianTheoDotThi').then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); ch.sync(); }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('khoa'), d, { head: 'Chọn khoa' }); }).catch(function () {});
    var DMTT = ums.api.dm('THI.PHUCKHAO.TINHTRANG');
    DMTT.then(function (d) { pat.fill(f('kqd'), d, { head: 'Chọn kết quả duyệt' }); }).catch(function () {});
    if (window.jQuery) {
        jQuery(f('tg')).on('select2:select select2:clear', function () { napHP().then(tai); });
        jQuery([f('hp'), f('khoa')]).on('select2:select select2:clear', tai);
    }
    z('bang').innerHTML = ui.empty('Chọn thời gian rồi bấm "Danh sách thi"', 'fa-hand-pointer');

    var ds = [];
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'XLHV_TP_PhucKhao_MH/DSA4BRIVKSgRKTQiCikgLgPP', func: 'pkg_thi_phach_phuckhao.LayDSThiPhucKhao', strNguoiThucHien_Id: uid(),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), strNgayHetHanDangKy: v('hhdk'), strNgayHetHanNopPhi: v('hhnp'),
            strTinhTrangNopPhi: v('phi') || '-1', strTinhTrang_Duyet_Id: v('kqd'), dChuaCoTrangThaiDuyetNao: 0 }).then(function (r) {
            ds = arr(r.data);
            var k = v('khoa') ? (f('khoa').selectedOptions[0] || {}).text || '' : '';
            if (k) ds = ds.filter(function (x) { return e(x.DAOTAO_KHOAQUANLYSV_TEN).indexOf(k) >= 0 || e(x.DAOTAO_KHOAQUANLYHP_TEN).indexOf(k) >= 0; });
            var q = v('q').toLowerCase();
            if (q) ds = ds.filter(function (x) { return (e(x.QLSV_NGUOIHOC_MASO) + ' ' + e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)).toLowerCase().indexOf(q) >= 0; });
            ve();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phúc khảo'); });
    }
    function ve() {
        z('n').textContent = '(' + ds.length + ')';
        var G1 = ['Kết quả thi ban đầu'], G2 = ['Đăng ký phúc khảo'];
        ui.table({ el: z('bang'), rows: ds, empty: 'Không có bài phúc khảo', columns: [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: G1, cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', group: G1 }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', group: G1 },
            { title: 'Email', prop: 'QLSV_NGUOIHOC_EMAIL', group: G1 }, { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLYSV_TEN', group: G1 }, { title: 'Túi', prop: 'TUI', group: G1, cls: 'is-center' },
            { title: 'Số phách', prop: 'SOPHACH', group: G1, cls: 'is-center' }, { title: 'SBD', prop: 'SOBAODANH', group: G1, cls: 'is-center' }, { title: 'Ca thi', prop: 'CATHI_TEN', group: G1, cls: 'is-center' },
            { title: 'Phòng thi', prop: 'PHONGTHI_TEN', group: G1, cls: 'is-center' },
            { title: 'Học phần thi', group: G1, render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
            { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN', group: G1 }, { title: 'Ngày thi', prop: 'NGAYTHI', group: G1, cls: 'is-center is-nowrap' },
            { title: 'Kết quả', group: G1, cls: 'is-center', render: function (x) { return esc(diem(x.DIEM)); } },
            { title: 'Phân công', prop: 'DSNHANSUCHAMTHIPK' },
            { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } },
            { title: 'Khoa quản lý HP', prop: 'DAOTAO_KHOAQUANLYHP_TEN' },
            { title: 'Ngày công bố điểm', prop: 'NGAYXACNHANHOANTHANHDIEMTHI', group: G2, cls: 'is-center' }, { title: 'Ngày đăng ký phúc khảo', prop: 'NGAYDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
            { title: 'Ngày hết hạn đăng ký', prop: 'NGAYHETHANDANGKYPHUCKHAO', group: G2, cls: 'is-center' }, { title: 'Ngày hết hạn nộp phí', prop: 'NGAYHETHANNOPPHIPHUCKHAO', group: G2, cls: 'is-center' },
            { title: 'Phí phúc khảo - Tình trạng', group: G2, render: function (x) { return esc(e(x.PHIPHUCKHAO) + ' - ' + e(x.TINHTRANGNOPPHI)); } },
            { title: 'Kết quả duyệt', prop: 'TINHTRANG_TEN', group: ['Duyệt'] },
            { title: 'Kết quả', group: ['Kết quả sau phúc khảo'], cls: 'is-center', render: function (x) { return esc(diem(x.KETQUAPHUCKHAO)); } }] });
    }
    function daChon() {
        return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return ds[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }
    ums.report.mount(z('bc'), { reportText: 'Báo cáo', import: false, collect: function (add) {
        add('strTuKhoa', v('q')); add('strDaoTao_ThoiGianDaoTao_Id', v('tg')); add('strDaoTao_HocPhan_Id', v('hp'));
        daChon().forEach(function (x) { add('strPhucKhao_Id', x.ID); });
    } });

    function duyet(chon) {
        var dlg = ui.dialog({ title: 'Duyệt đăng ký phúc khảo', icon: 'fa-circle-check', size: 'lg',
            body: '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + chon.length + ' bài đã chọn.</p>' +
                ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-ph="Chọn trạng thái"><option value=""></option></select>', { required: true }) +
                ui.field('Nội dung', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Lịch sử — ' + esc(e(chon[0].QLSV_NGUOIHOC_MASO) + ' ' + e(chon[0].DAOTAO_HOCPHAN_TEN)) + '</div><div data-x="ls"></div>',
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                if (!q('tt').value) { ui.toast('Chọn trạng thái', 'warn'); return false; }
                ui.batch(chon.map(function (x) {
                    return { action: 'TP_PhucKhao/Them_Thi_PhucKhao_XacNhan', method: 'POST', strLoaiXacNhan_Id: LOAI, strTinhTrang_Id: q('tt').value, strNguoiXacNhan_Id: uid(),
                        strThongTinXacNhan: q('nd').value.trim(), strDuLieuXacNhan: x.ID, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang duyệt', okText: 'Xác nhận thành công', show: true }).then(function () { lichSu(); tai(); });
                return false;
            } }] });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        DMTT.then(function (d) { pat.fill(q('tt'), d, { head: 'Chọn trạng thái' }); }).catch(function () {});
        function lichSu() {
            q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            get('LayDSThi_PhucKhao_XacNhan', { strTuKhoa: '', strDuLieuXacNhan: chon[0].ID, strLoaiXacNhan_Id: LOAI, strNguoiXacNhan_Id: '', strTinhTrang_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (r) { ui.table({ el: q('ls'), rows: arr(r.data), empty: 'Chưa có lịch sử', columns: [{ title: 'Trạng thái', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }] }); })
                .catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        }
        lichSu();
    }
    root.addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]'); if (!b) return;
        var a = b.getAttribute('data-a'), chon;
        if (a === 'search') { tai(); return; }
        chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        if (a === 'xacnhan') duyet(chon);
        else if (a === 'phan') thi.canBo({ host: root, title: 'Cán bộ chấm thi', ids: chon.map(function (x) { return x.ID; }), xemTruoc: false, onDone: tai,
            ds: ['DSA4BRIPKSAvEjQRKSAvAi4vJgIpICwVKSgRCgPP', 'LayDSNhanSuPhanCongChamThiPK', 'strDuLieuPhanCongChamThi_Id'],
            them: ['FSkkLB4VKSgeBiggLhcoJC8eAikgLBUpKBEK', 'Them_Thi_GiaoVien_ChamThiPK'], xoa: ['GS4gHhUpKB4GKCAuFygkLx4CKSAsFSkoEQoP', 'Xoa_Thi_GiaoVien_ChamThiPK'] });
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
