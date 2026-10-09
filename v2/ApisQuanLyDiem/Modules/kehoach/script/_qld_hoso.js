/* =========================================================================
   Kế hoạch công nhận điểm — vùng "Xem danh sách" nộp hồ sơ (#zoneNoiDung của gốc, nút "Xem" ở cột
   "Nộp hồ sơ"): hai tab 1) Công nhận từ bảng điểm · 2) Công nhận từ chứng chỉ
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/script/kehoach.js
       getList_BangDiem · genTable_BangDiem · getList_BangDiem_ChiTiet · genTable_BangDiem_ChiTiet
       getList_ChungChi · genTable_ChungChi · getList_ChungChi_ChiTiet · genTable_ChungChi_ChiTiet
       #btnXacNhan_BangDiem / _ChungChi → hộp #modal_XacNhan2 → save_XacNhan2
   ---------------------------------------------------------------------------
   ums.qldKh.taoHoSo(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên, đều GET):
     SV_CND_ThongTin/LayDSDiem_NH_CongNhan_So_Diem   strTuKhoa · strDiem_KeHoachCongNhan_Id · pageIndex · pageSize
     SV_CND_ThongTin/LayDSDiem_NH_CongNhan_So_CC     (như trên, tab chứng chỉ)
     SV_CND_ThongTin/LayDSChiTetCongNhanTheoDiem     strQLSV_NguoiHoc_Id · strDaoTao_ChuongTrinh_Id · strDiem_KeHoachCongNhan_Id
         → Data = { rs (học phần công nhận), rsFiles (minh chứng) }
     SV_CND_ThongTin/LayDSChiTetCongNhanTheoCC       (như trên) + strDiem_ThongTin_CC_CapDo_Id · strPhanLoaiCC_Id
     SV_CND_ThongTin/XacNhanNopHoSo  POST  strQLSV_NguoiHoc_Id · strDaoTao_ChuongTrinh_Id · strDiem_KeHoachCongNhan_Id
         · strDiem_ThongTin_CC_CapDo_Id · strPhanLoaiCC_Id · strMaCongNhan · dHoSo_DaNop (1 Đã nộp / 0 Chưa nộp)
         (mỗi dòng đã đánh dấu một lời gọi; cột của dòng không có thì gửi rỗng như $.param gốc)
   Cột danh sách: MACONGNHAN · QLSV_NGUOIHOC_MASO · QLSV_NGUOIHOC_HOTEN · DAOTAO_CHUONGTRINH_TEN
       · NGAYTAO_DD_MM_YYYY_HHMMSS · (tab 2: PHANLOAICC_TEN) · "Xem" · HOSO_DANOP (có → "Đã nộp").
   Hộp chi tiết: học phần DAOTAO_HOCPHAN_MA · _TEN · DIEMCONGNHAN · (tab 2: DIEM_THONGTIN_CC_CAPDO_TEN) · DIEM_COSODAOTAO_TEN
       · (tab 1: THONGTINHOCPHAN / tab 2: NGAYCAP); minh chứng (tab 1: TENCOSODAOTAO / tab 2: PHANLOAICC_TEN,
       DIEM_THONGTIN_CHUNGCHI_TEN, CAPDO_TEN) + liên kết DUONGDAN / TENHIENTHI.
   Khác gốc:
     · Mở vùng là nạp luôn cả hai tab (gốc chỉ đổi vùng, bảng còn dữ liệu của kế hoạch mở lần trước tới khi
       bấm Tìm kiếm).
     · save_XacNhan2 xong gốc còn nạp lại danh sách kế hoạch (không cần) — bỏ; vẫn nạp lại tab đang xác nhận.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.qldKh, K = Q.K, e = Q.e;
    var TT = 'SV_CND_ThongTin/';

    Q.taoHoSo = function (zone, o) {
        o = o || {};
        var kh = null, tab = 'bd';
        var st = {
            bd: { ds: 'LayDSDiem_NH_CongNhan_So_Diem', ct: 'LayDSChiTetCongNhanTheoDiem', rows: [], page: 1, size: 10, total: 0 },
            cc: { ds: 'LayDSDiem_NH_CongNhan_So_CC', ct: 'LayDSChiTetCongNhanTheoCC', rows: [], page: 1, size: 10, total: 0 }
        };

        function khung(k) {
            return '<div data-tab-z="' + k + '"' + (k === 'bd' ? '' : ' hidden') + '>' +
                '<div class="ums-row ums-row--between ums-u-mb-4">' +
                    '<div class="ums-filter qldkh-loc"><div class="ums-field"><input class="ums-input" data-f="q-' + k + '" placeholder="Mã hồ sơ, mã sinh viên" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim', 'data-k': k } }) + '</div></div>' +
                    ui.btn('confirm', { attr: { 'data-a': 'xn', 'data-k': k } }) +
                '</div><div data-z="t-' + k + '"></div></div>';
        }
        zone.innerHTML = pat.panel({
            title: 'Xem danh sách', icon: 'fa-folder-open',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body: ui.tabs([
                { key: 'bd', text: '1) Công nhận từ bảng điểm' },
                { key: 'cc', text: '2) Công nhận từ chứng chỉ' }
            ], 'bd', 'data-xtab') + '<div class="ums-u-mt-4">' + khung('bd') + khung('cc') + '</div>'
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        K.ganChon(zone);

        function tai(k, p) {
            var s = st[k];
            if (p) s.page = p;
            var host = z('t-' + k);
            K.dang(host);
            ums.api.call({
                action: TT + s.ds, method: 'GET', type: 'GET',
                strTuKhoa: (zone.querySelector('[data-f="q-' + k + '"]').value || '').trim(),
                strDiem_KeHoachCongNhan_Id: kh.ID, strNguoiThucHien_Id: '',
                pageIndex: s.page, pageSize: s.size
            }).then(function (r) {
                s.rows = K.ds(r);
                s.total = Number(r.pager) || s.rows.length;
                ve(k);
            }).catch(function (err) { K.loi(host, err, 'danh sách nộp hồ sơ'); });
        }
        function ve(k) {
            var s = st[k];
            var cot = [
                { title: 'Mã hồ sơ đăng ký', prop: 'MACONGNHAN', cls: 'is-nowrap' },
                { title: 'Mã sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' }
            ];
            if (k === 'cc') cot.push({ title: 'Loại chứng chỉ', prop: 'PHANLOAICC_TEN' });
            cot.push(
                { title: 'Học phần công nhận minh chứng', cls: 'is-center', render: function (r) { return Q.nut('view', 'Xem', 'ct', r.ID); } },
                { title: 'Đã nộp hồ sơ', cls: 'is-center', render: function (r) {
                    return r.HOSO_DANOP && String(r.HOSO_DANOP) !== '0' ? ui.badge('Đã nộp', 'ok') : '';
                } },
                K.cotChon('hs' + k)
            );
            ui.table({
                el: z('t-' + k), rows: s.rows, columns: cot, empty: 'Không có dữ liệu',
                page: {
                    index: s.page, size: s.size, total: s.total,
                    onChange: function (p) { if (p >= 1 && p <= Math.ceil(s.total / s.size)) tai(k, p); },
                    onSize: function (v) { s.size = v === 'all' ? ui.PAGE_ALL : Number(v); tai(k, 1); }
                }
            });
        }

        function chiTiet(k, r) {
            var tham = {
                action: TT + st[k].ct, method: 'GET', type: 'GET',
                strQLSV_NguoiHoc_Id: e(r.QLSV_NGUOIHOC_ID), strDaoTao_ChuongTrinh_Id: e(r.DAOTAO_CHUONGTRINH_ID),
                strDiem_KeHoachCongNhan_Id: kh.ID, strNguoiThucHien_Id: ''
            };
            if (k === 'cc') {
                tham.strDiem_ThongTin_CC_CapDo_Id = e(r.DIEM_THONGTIN_CC_CAPDO_ID);
                tham.strPhanLoaiCC_Id = e(r.PHANLOAICC_ID);
            }
            var dlg = ui.dialog({
                title: e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HOTEN), icon: 'fa-eye', size: 'xl',
                body: '<div class="ums-legend">Học phần công nhận</div><div data-x="hp"></div>' +
                    '<div class="ums-legend ums-legend--cach">Minh chứng</div><div data-x="mc"></div>'
            });
            var B = dlg.body;
            function x(q) { return B.querySelector('[data-x="' + q + '"]'); }
            K.dang(x('hp'));
            var lienKet = { title: 'Minh chứng', render: function (f) {
                return '<a href="' + esc(ums.files.url(e(f.DUONGDAN))) + '" target="_blank" rel="noopener">' + esc(e(f.TENHIENTHI)) + '</a>';
            } };
            ums.api.call(tham).then(function (res) {
                var d = res.data || {};
                var hp = [{ title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                    { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Điểm công nhận', prop: 'DIEMCONGNHAN', cls: 'is-center' }];
                if (k === 'cc') hp.push({ title: 'Cấp độ', prop: 'DIEM_THONGTIN_CC_CAPDO_TEN' });
                hp.push({ title: 'Cơ sở cấp', prop: 'DIEM_COSODAOTAO_TEN' });
                hp.push(k === 'cc' ? { title: 'Ngày cấp', prop: 'NGAYCAP', cls: 'is-center is-nowrap' }
                    : { title: 'Thông tin học phần dùng công nhận', prop: 'THONGTINHOCPHAN' });
                var mc = k === 'cc'
                    ? [{ title: 'Loại chứng chỉ', prop: 'PHANLOAICC_TEN' }, { title: 'Tên chứng chỉ', prop: 'DIEM_THONGTIN_CHUNGCHI_TEN' }, { title: 'Cấp độ', prop: 'CAPDO_TEN' }, lienKet]
                    : [{ title: 'Cơ sở cấp', prop: 'TENCOSODAOTAO' }, lienKet];
                ui.table({ el: x('hp'), rows: d.rs || [], columns: hp, stt: true, empty: 'Không có học phần công nhận' });
                ui.table({ el: x('mc'), rows: d.rsFiles || [], columns: mc, stt: true, empty: 'Không có minh chứng' });
            }).catch(function (err) { K.loi(x('hp'), err, 'chi tiết công nhận'); });
        }

        function xacNhan(k) {
            var ids = K.daChon(z('t-' + k), 'hs' + k);
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            var chon = ids.map(function (id) { return K.tim(st[k].rows, id); }).filter(Boolean);
            var dlg = ui.dialog({
                title: 'Xác nhận', icon: 'fa-circle-check', size: 'sm',
                body: ui.field('Hồ sơ', '<select class="ums-select" data-x="dn" data-required data-ph="Đã nộp"><option value="1">Đã nộp</option><option value="0">Chưa nộp</option></select>'),
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                    var v = dlg.body.querySelector('[data-x="dn"]').value;
                    ui.batch(chon.map(function (a) {
                        return { action: TT + 'XacNhanNopHoSo', type: 'POST', method: 'POST',
                            strQLSV_NguoiHoc_Id: e(a.QLSV_NGUOIHOC_ID), strDaoTao_ChuongTrinh_Id: e(a.DAOTAO_CHUONGTRINH_ID),
                            strDiem_KeHoachCongNhan_Id: kh.ID, strDiem_ThongTin_CC_CapDo_Id: e(a.DIEM_THONGTIN_CC_CAPDO_ID),
                            strPhanLoaiCC_Id: e(a.PHANLOAICC_ID), strMaCongNhan: e(a.MACONGNHAN), dHoSo_DaNop: v, strNguoiThucHien_Id: '' };
                    }), { title: 'Đang xác nhận nộp hồ sơ', okText: 'Thực hiện thành công', show: true }).then(function () { tai(k); });
                } }]
            });
            ui.enhance(dlg.body);
        }

        zone.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-xtab]');
            if (t && zone.contains(t)) {
                tab = t.getAttribute('data-xtab');
                ui.tabsActive(zone, tab, 'data-xtab');
                K.qa(zone, '[data-tab-z]').forEach(function (v) { v.hidden = v.getAttribute('data-tab-z') !== tab; });
                return;
            }
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            var k = b.getAttribute('data-k') || tab;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'tim': tai(k, 1); break;
                case 'xn': xacNhan(k); break;
                case 'ct':
                    var r = K.tim(st[tab].rows, b.getAttribute('data-id'));
                    if (r) chiTiet(tab, r);
                    break;
            }
        });
        zone.addEventListener('keydown', function (ev) {
            var f = ev.target.getAttribute && ev.target.getAttribute('data-f');
            if (ev.key === 'Enter' && f && f.indexOf('q-') === 0) { ev.preventDefault(); tai(f.substring(2), 1); }
        });

        return {
            mo: function (d) {
                kh = d; tab = 'bd';
                ui.tabsActive(zone, 'bd', 'data-xtab');
                K.qa(zone, '[data-tab-z]').forEach(function (v) { v.hidden = v.getAttribute('data-tab-z') !== 'bd'; });
                ['bd', 'cc'].forEach(function (k) { zone.querySelector('[data-f="q-' + k + '"]').value = ''; tai(k, 1); });
            }
        };
    };
})();
