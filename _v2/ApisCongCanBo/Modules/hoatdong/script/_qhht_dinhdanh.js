/* =========================================================================
   hoatdong/DaQHHT — hai tab "Khởi tạo định danh mới" và "Phân ngành lớp chính"
   ums.qhht.dinhDanh(host) · ums.qhht.phanNganh(host) → { tai() }
   ---------------------------------------------------------------------------
   Bố cục bản gốc: hai cột 5/7 — trái: danh sách học viên chưa có cấu trúc
   (LayDSNguoiHocChuaCoCauTruc — KHÔNG theo bộ lọc, như gốc); phải: biểu mẫu.
   Lời gọi (chép nguyên, mã hoá):
       SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHocChuaCoCauTruc
       Khởi tạo định danh: InsertCorePerson (thêm mới) · hồ sơ - chính sách (_qhht_chung.js)
       Phân ngành: KHCT_BIND_DIMENSION Hệ → Khoá → CT → Lớp (qhht.dim) ·
                   PKG_CORE_NGUOIHOC_01.Them_StudyTrack_Full
   Khác bản gốc (lỗi rõ):
     · "Lưu thông tin cơ bản" LUÔN gọi InsertCorePerson kể cả khi đang xem một
       người đã có → tạo trùng người. Ở đây: đã có person id → UpdateCorePerson.
   Giữ như bản gốc (chờ nghiệp vụ):
     · "Lưu định danh" chưa có API (gốc chỉ console.log) → nút khoá.
     · 7 tab quá trình ở cột phải là khung "chờ tích hợp API" — chỉ tab
       "Thông tin hồ sơ - chính sách" chạy.
     · Ô "Mã số" ở phân ngành hiện trong hộp hỏi lại nhưng KHÔNG gửi đi.
     · Lưu hồ sơ - chính sách ở tab này không hỏi lại; xoá hỏi bằng hộp đơn giản.
   Nối tầng phân ngành: Hệ → Khoá → Chương trình → Lớp (ums.pat.chain).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var qhht = ums.qhht = ums.qhht || {};
    function esc(s) { return ui.esc(s); }
    var e = qhht.e, lay = qhht.lay, arr = qhht.arr;

    function khung(host, o) {
        host.innerHTML = '<div class="qhht-hai qhht-hai--57">' +
            pat.panel({ title: o.tieuDeDS, icon: 'fa-users-viewfinder', count: 'n', flush: true, zone: 'ds', tools: o.nutDS || '' }) +
            '<div>' + pat.panel({ title: o.tieuDeBM, icon: o.icon, count: 'ten', zone: 'bm' }) + '<div data-z="them"></div></div></div>';
        ui.enhance(host);
        return function (k) { return host.querySelector('[data-z="' + k + '"]'); };
    }
    function taiDS(z, nut, onDs) {
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(Object.assign({ action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgIpNCACLgIgNBUzNCIP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHocChuaCoCauTruc' }, qhht.chung()))
            .then(function (r) {
                var ds = arr(r.data);
                z('n').textContent = '(' + ds.length + ')';
                ui.table({ el: z('ds'), rows: ds, empty: 'Không có học viên', columns: [
                    { title: 'CCCD', render: function (x) { return esc(lay(x, ['IDENTIFIER_NO', 'DINHDANH_CHINH_SO'])); } },
                    { title: 'Họ và tên', render: function (x) { return esc(lay(x, ['HO_TEN', 'FULL_NAME'])); } },
                    { title: 'Ghi chú', render: function (x) { return esc(lay(x, ['GhiChu', 'GHICHU', 'NOTE'])); } },
                    { title: 'Chọn', cls: 'is-center', width: '70px', render: function (x, i) { return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-' + nut + '="' + i + '"><i class="fa-light fa-magnifying-glass"></i><span>Xem</span></button>'; } }
                ] });
                onDs(ds);
            }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học viên'); });
    }

    /* =====================================================================
       Khởi tạo định danh mới
       ===================================================================== */
    qhht.dinhDanh = function (host) {
        var z = khung(host, { tieuDeDS: 'Danh sách học viên chưa có định danh', tieuDeBM: 'Khởi tạo định danh', icon: 'fa-id-card-clip',
            nutDS: ui.btn('add', { cls: 'ums-btn--sm', attr: { 'data-dd': 'them' } }) });
        var ds = [];
        function dat() { z('ten').textContent = ''; z('bm').innerHTML = ui.empty('Chọn một học viên ở bảng bên trái…', 'fa-hand-pointer'); z('them').innerHTML = ''; }
        dat();
        function tai() { return taiDS(z, 'ddxem', function (d) { ds = d; }); }
        function mo(r, moi) {
            z('ten').textContent = moi ? '— Thêm mới hồ sơ' : '— Xem / Sửa hồ sơ - ' + lay(r, ['HO_TEN', 'FULL_NAME']);
            z('bm').innerHTML = qhht.dauHoSo(r) + '<div class="ums-legend ums-legend--cach">Thông tin cơ bản</div><div data-k="cb"></div>' +
                '<div class="ums-legend ums-legend--cach">Thông tin định danh <span class="ums-badge ums-badge--warn">Bước 2 — chờ tích hợp API</span></div>' +
                '<div class="ums-grid ums-grid--3">' +
                    ui.field('Số CCCD / Định danh', '<input class="ums-input" value="' + esc(e(r.IDENTIFIER_NO)) + '" autocomplete="off">') +
                    ui.field('Ngày cấp', '<input class="ums-input" data-date value="' + esc(e(r.ISSUE_DATE)) + '" autocomplete="off">') +
                    ui.field('Nơi cấp', '<input class="ums-input" value="' + esc(e(r.ISSUE_PLACE)) + '" autocomplete="off">') +
                    ui.field('Hiệu lực từ', '<input class="ums-input" data-date value="' + esc(e(r.IDENTIFIER_EFFECTIVE_FROM)) + '" autocomplete="off">') +
                    ui.field('Hiệu lực đến', '<input class="ums-input" data-date value="' + esc(e(r.IDENTIFIER_EFFECTIVE_TO)) + '" autocomplete="off">') +
                    '<div class="ums-field"><label class="ums-field__label">&nbsp;</label><div class="ums-field__control"><label class="ums-check"><input type="checkbox"' +
                        (r.IDENTIFIER_IS_PRIMARY == 1 ? ' checked' : '') + '><span>Là định danh chính</span></label></div></div>' +
                '</div>' + ui.field('Ghi chú', '<textarea class="ums-input" rows="2">' + esc(e(r.GHICHU)) + '</textarea>') +
                '<div class="ums-row ums-row--end">' + ui.btn('save', { text: 'Lưu định danh', attr: { disabled: '', title: 'Bản gốc chưa nối API lưu định danh' } }) + '</div>';
            z('them').innerHTML = '<div class="ums-u-mt-4">' + pat.panel({ title: 'Khai thông tin các quá trình', icon: 'fa-list-timeline', zone: 'qt' }) + '</div>';
            ui.enhance(z('bm'));
            qhht.dm().then(function (dm) {
                var person = qhht.personId(r);
                qhht.coBan(z('bm').querySelector('[data-k="cb"]'), r, { dm: dm, them: !person, huy: function () { dat(); },
                    sauLuu: function () { tai(); if (!person) dat(); } });
                var TAB = [['diachi', 'Địa chỉ'], ['giadinh', 'Gia đình'], ['tknh', 'Tài khoản ngân hàng'], ['hocvan', 'Học vấn'], ['chungchi', 'Chứng chỉ'],
                    ['tailieu', 'Tài liệu'], ['hocham', 'Học hàm'], ['hscs', 'Thông tin hồ sơ - chính sách']];
                var qt = host.querySelector('[data-z="qt"]');
                qt.innerHTML = ui.tabs(TAB.map(function (t) { return { key: t[0], text: t[1] }; }), 'hscs', 'data-ddtab') +
                    TAB.map(function (t) { return '<div class="ums-u-mt-3" data-ddpane="' + t[0] + '"' + (t[0] === 'hscs' ? '' : ' hidden') + '>' +
                        (t[0] === 'hscs' ? '' : ui.empty(t[1] + ' — chờ tích hợp API', 'fa-plug')) + '</div>'; }).join('');
                var ph = qt.querySelector('[data-ddpane="hscs"]');
                qhht.hscs(ph, r, { dm: dm, xacNhan: false });
                if (person) qhht.napHSCS(r, lay(r, ['PERSON_PROFILE_ID', 'PROFILE_ID'])).then(function () { qhht.hscs(ph, r, { dm: dm, xacNhan: false }); });
                qt.onclick = function (ev) {
                    var t = ev.target.closest('[data-ddtab]');
                    if (!t) return;
                    ui.tabsActive(qt, t.getAttribute('data-ddtab'), 'data-ddtab');
                    TAB.forEach(function (x) { qt.querySelector('[data-ddpane="' + x[0] + '"]').hidden = x[0] !== t.getAttribute('data-ddtab'); });
                };
            });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ddxem]');
            if (b) { mo(Object.assign({}, ds[Number(b.getAttribute('data-ddxem'))]), false); return; }
            if (ev.target.closest('[data-dd="them"]')) mo({}, true);
        });
        return { tai: tai };
    };

    /* =====================================================================
       Phân ngành lớp chính
       ===================================================================== */
    qhht.phanNganh = function (host) {
        var z = khung(host, { tieuDeDS: 'Danh sách học viên cần phân ngành lớp chính', tieuDeBM: 'Phân ngành lớp chính', icon: 'fa-diagram-project' });
        var ds = [];
        function dat() { z('ten').textContent = ''; z('bm').innerHTML = ui.empty('Chọn một học viên ở bảng bên trái để khai tuyến học chính và xếp lớp', 'fa-hand-pointer'); }
        dat();
        function tai() { return taiDS(z, 'pnxem', function (d) { ds = d; }); }
        function mo(r) {
            z('ten').textContent = '— ' + lay(r, ['HO_TEN', 'FULL_NAME']);
            qhht.dm().then(function (dm) {
                function sel(k, ph, dsx) { return '<select class="ums-select" data-pn="' + k + '" data-ph="' + esc(ph) + '">' + (dsx ? qhht.opt(dsx, '', '') : '<option value=""></option>') + '</select>'; }
                z('bm').innerHTML = qhht.dauHoSo(r) +
                    '<div class="ums-legend ums-legend--cach">Khai tuyến học chính</div><div class="ums-grid ums-grid--3">' +
                        ui.field('Hình thức học', sel('htdt', 'Chọn hình thức học', dm.hinhThucHoc)) + ui.field('Diện học', sel('dien', 'Chọn diện học', dm.dienHoc)) +
                        ui.field('Loại nguồn', sel('nguon', 'Chọn loại nguồn', dm.loaiNguon)) +
                        '<div class="ums-field"><label class="ums-field__label">&nbsp;</label><div class="ums-field__control"><label class="ums-check"><input type="checkbox" data-pn="chinh" checked><span>Tuyến học chính</span></label></div></div>' +
                        ui.field('Ngày bắt đầu', '<input class="ums-input" data-pn="bd" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                        ui.field('Ngày kết thúc', '<input class="ums-input" data-pn="kt" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                    '</div>' + ui.field('Ghi chú', '<textarea class="ums-input" rows="2" data-pn="gc"></textarea>') +
                    '<div class="ums-legend ums-legend--cach">Xếp vào chương trình học</div><div class="ums-grid ums-grid--3">' +
                        ui.field('Hệ đào tạo', sel('he', 'Chọn hệ đào tạo')) + ui.field('Khóa đào tạo', sel('khoa', 'Chọn khóa đào tạo')) +
                        ui.field('Chương trình', sel('ct', 'Chọn chương trình'), { required: true }) +
                        ui.field('Trạng thái học', sel('tthai', 'Chọn trạng thái học', dm.trangThai)) + ui.field('Loại tiếp nhận', sel('tnhan', 'Chọn loại tiếp nhận', dm.loaiTiepNhan)) +
                        ui.field('Mã số', '<input class="ums-input" data-pn="maso" autocomplete="off">') +
                    '</div>' +
                    '<div class="ums-legend ums-legend--cach">Xếp vào lớp</div><div class="ums-grid ums-grid--3">' + ui.field('Lớp học', sel('lop', 'Chọn lớp'), { required: true }) + '</div>' +
                    '<div class="ums-row ums-row--end ums-u-mt-3">' + ui.btn('save', { text: 'Thực hiện', icon: 'fa-circle-check', attr: { 'data-pna': 'luu' } }) + '</div>';
                ui.enhance(z('bm'));
                function q(k) { return z('bm').querySelector('[data-pn="' + k + '"]'); }
                var chuoi = pat.chain([q('he'), q('khoa'), q('ct'), q('lop')], { phatLai: false });
                function nap(k, ts) { return qhht.dim(k, ts).then(function (d) { pat.fill(q(k), d); chuoi.sync(); }).catch(function (err) { ums.api.handle(err, 'danh mục đào tạo'); }); }
                nap('he', {});
                if (window.jQuery) {
                    jQuery(q('he')).on('select2:select select2:clear', function () { if (q('he').value) nap('khoa', { strDaoTao_HeDaoTao_Id: q('he').value }); else pat.fill(q('khoa'), []); });
                    jQuery(q('khoa')).on('select2:select select2:clear', function () {
                        if (q('khoa').value) nap('ct', { strDaoTao_HeDaoTao_Id: q('he').value, strDaoTao_KhoaDaoTao_Id: q('khoa').value, strDaoTao_KhoaQuanLy_Id: '' }); else pat.fill(q('ct'), []);
                    });
                    jQuery(q('ct')).on('select2:select select2:clear', function () {
                        if (q('ct').value) nap('lop', { strDaoTao_HeDaoTao_Id: q('he').value, strDaoTao_KhoaDaoTao_Id: q('khoa').value, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_ChuongTrinh_Id: q('ct').value });
                        else pat.fill(q('lop'), []);
                    });
                }
                z('bm').onclick = function (ev) {
                    if (!ev.target.closest('[data-pna="luu"]')) return;
                    if (!q('ct').value) { ui.toast('Vui lòng chọn Chương trình', 'warn'); return; }
                    if (!q('lop').value) { ui.toast('Vui lòng chọn Lớp', 'warn'); return; }
                    var t = qhht.tenCua;
                    pat.xacNhanChiTiet({ title: 'Xác nhận phân ngành lớp chính', icon: 'fa-diagram-project', okText: 'Thực hiện phân ngành',
                        subject: { name: lay(r, ['HO_TEN', 'FULL_NAME']), extra: [{ label: 'CCCD', value: lay(r, ['IDENTIFIER_NO', 'DINHDANH_CHINH_SO']) }, { label: 'Mã người học', value: e(r.MA_NGUOI_HOC) }] },
                        sections: [
                            { title: 'Khai tuyến học chính', tone: 'blue', rows: [['Hình thức học', t(q('htdt'))], ['Diện học', t(q('dien'))], ['Loại nguồn', t(q('nguon'))],
                                ['Tuyến học chính', q('chinh').checked ? '✓ Chính' : 'Phụ'], ['Ngày bắt đầu', q('bd').value], ['Ngày kết thúc', q('kt').value], ['Ghi chú', q('gc').value]] },
                            { title: 'Xếp vào chương trình học', tone: 'green', rows: [['Hệ đào tạo', t(q('he'))], ['Khóa đào tạo', t(q('khoa'))], ['Chương trình', t(q('ct'))],
                                ['Trạng thái học', t(q('tthai'))], ['Loại tiếp nhận', t(q('tnhan'))], ['Mã số', q('maso').value]] },
                            { title: 'Xếp vào lớp', tone: 'orange', rows: [['Lớp học', t(q('lop'))]] }
                        ] }).then(function (ok) {
                        if (!ok) return;
                        ums.api.call(Object.assign({ action: 'SV_NGUOIHOC_01_MH/FSkkLB4SNTQlOBUzICIq', func: 'PKG_CORE_NGUOIHOC_01.Them_StudyTrack_Full',
                            strCorePerson_Id: qhht.personId(r), strCorePersonIntake_Id: '', strDaoTaoToChucCT_Id: q('ct').value, strDaoTaoLopQuanLy_Id: q('lop').value,
                            strChangeType_Id: q('tnhan').value, strStudyStatus_Id: q('tthai').value, strStudyKind_Id: q('htdt').value, strStudyRelationType_Id: q('dien').value,
                            dIsPrimary: q('chinh').checked ? 1 : 0, strNgayBatDau: q('bd').value.trim(), strNgayKetThuc: q('kt').value.trim(), strSourceType_Id: q('nguon').value,
                            strSourceRef_Id: '', strDecision_Id: '', strGhiChu: q('gc').value.trim() }, qhht.chung()))
                            .then(function () { ui.toast('Phân ngành lớp chính thành công', 'ok'); tai(); dat(); })
                            .catch(function (err) { ums.api.handle(err, 'phân ngành lớp chính'); });
                    });
                };
            });
        }
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-pnxem]');
            if (b) mo(Object.assign({}, ds[Number(b.getAttribute('data-pnxem'))]));
        });
        return { tai: tai };
    };
})();
