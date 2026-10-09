/* =========================================================================
   Kế hoạch công nhận điểm
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/html/kehoach.html
            + script/kehoach.js (lớp KeHoachXuLy, vỏ indexi — khung "kế hoạch" chép từ phân hệ khác)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, các vùng thay chỗ nhau (zone-bus + toggle_overide):
       #zonebatdau    thanh lọc + "Danh sách kế hoạch"                 → vùng "ds"  (tệp này)
       #zoneEdit      thêm / sửa kế hoạch + phạm vi áp dụng            → "form" (_qld_form.js)
       #zoneDSNhanSu  phân nhân sự (nút "Phân công")                    → "pc"   (_qld_phancong.js)
       #zoneQuanSo    kết quả công nhận (nút "Chi tiết")               → "kq"   (_qld_ketqua.js)
       #zoneNoiDung   xem danh sách nộp hồ sơ, 2 tab (nút "Xem")       → "hs"   (_qld_hoso.js)
       #zoneQuyetDinh thông tin quyết định (nút "Xem")                  → "qd"   (_qld_quyetdinh.js)
   Tiện ích chung: _qld_chung.js (ums.qldKh) trên ums.khxl (nạp chéo XLHV kehoachxuly/_khxl_chung.js).

   Lời gọi của tệp này (chép nguyên):
       SV_CongNhanDiem_MH/DSA4BRIFKCQsHgokCS4gIikCLi8mDykgLwUoJCwP
           pkg_congthongtin_congnhandiem.LayDSDiem_KeHoachCongNhanDiem   strTuKhoa · dHieuLuc (ô Hiệu lực 1/0)
           — gốc không gửi pageIndex/pageSize (máy chủ trả hết) → chia trang ở máy khách như loadToTable_data.
       SV_CongNhanDiem/Xoa_Diem_KeHoachCongNhanDiem   strId = ID (mỗi kế hoạch đã chọn một lời gọi)
       Báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_KeHoach"):
           dHieuLuc = ô Hiệu lực, mỗi kế hoạch đã đánh dấu một cặp strDiem_KeHoachCongNhan_Id.
   Cột: TENKEHOACH · TUNGAY · DENNGAY · HANINDON · HIEULUC (có → "Có hiệu lực") · "Phân công" · "Chi tiết"
        · "Xem" (nộp hồ sơ) · "Xem" (quyết định) · sửa · ô đánh dấu. (Cột "Mã" bị chú thích ở gốc — không hiện.)

   Cố ý bỏ (mã chết của gốc): ô "Học kỳ" của thanh lọc (bị chú thích trong html; getList_ThoiGianDaoTao vẫn
   chạy chỉ để đổ ô Học kỳ của hộp quyết định — nay nạp khi mở hộp đó); getList_DMHocPhan + bảng #tblHocPhan /
   hộp #myModalHocPhan (không nút nào mở); các hộp chọn sinh viên / nhân sự riêng của màn — xem đầu từng tệp _qld_*.
   Khác gốc:
       · Xoá kế hoạch: ums.ui.xoaChon + ums.ui.batch, xong nạp lại MỘT lần (gốc bắn N lời gọi rồi setTimeout N×50ms).
       · Đóng một vùng con thì nạp lại danh sách (như toggle_form của gốc).
       · Thêm mới: lưu xong Ở LẠI biểu mẫu (như gốc) nhưng nhớ ID mới để lần lưu sau là Sửa (xem _qld_form.js).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, Q = ums.qldKh, K = Q.K;
    var root = document.getElementById('qld-kehoach');
    if (!root) return;

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch công nhận điểm', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-f="hl" data-required data-ph="Hiệu lực">' +
                    '<option value="1">Hiệu lực</option><option value="0">Hết hiệu lực</option></select></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
            pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't',
                tools: ui.xoaChon('input[data-kh]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
        '</div>' +
        '<div data-z="form" hidden></div>' +
        '<div data-z="pc" hidden></div>' +
        '<div data-z="kq" hidden></div>' +
        '<div data-z="hs" hidden></div>' +
        '<div data-z="qd" hidden></div>';

    function q(sel) { return root.querySelector(sel); }
    var zDs = q('[data-z="ds"]'), fHL = q('[data-f="hl"]'), fQ = q('[data-f="q"]');
    var vung = {};
    ['form', 'pc', 'kq', 'hs', 'qd'].forEach(function (k) { vung[k] = q('[data-z="' + k + '"]'); });
    var dangMo = null;
    ui.enhance(zDs);
    K.ganChon(zDs);

    function mo(k) { dangMo = vung[k]; ui.swap(zDs, dangMo); }
    function dong() { if (dangMo) ui.swap(dangMo, zDs); dangMo = null; load(); }

    var form = Q.taoForm(vung.form, { onClose: dong, onSaved: function () { load(); } });
    var pc = Q.taoPhanCong(vung.pc, { onClose: dong });
    var kq = Q.taoKetQua(vung.kq, { onClose: dong });
    var hs = Q.taoHoSo(vung.hs, { onClose: dong });
    var qd = Q.taoQuyetDinh(vung.qd, { onClose: dong });

    /* ---------- Danh sách kế hoạch ----------------------------------------- */
    var rows = [];
    var bang = Q.bang(q('[data-z="t"]'), {
        empty: 'Chưa có kế hoạch',
        columns: [
            { title: 'Tên', prop: 'TENKEHOACH', cls: 'qldkh-ten' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Hạn in đơn', prop: 'HANINDON', cls: 'is-center is-nowrap' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return Q.hieuLuc(r.HIEULUC); } },
            { title: 'Phân nhân sự', cls: 'is-center is-nowrap', render: function (r) { return Q.nut('view', 'Phân công', 'pc', r.ID, 'fa-user-tie'); } },
            { title: 'Kết quả đăng ký', cls: 'is-center is-nowrap', render: function (r) { return Q.nut('view', 'Chi tiết', 'kq', r.ID); } },
            { title: 'Nộp hồ sơ', cls: 'is-center is-nowrap', render: function (r) { return Q.nut('view', 'Xem', 'hs', r.ID); } },
            { title: 'Quyết định', cls: 'is-center is-nowrap', render: function (r) { return Q.nut('view', 'Xem', 'qd', r.ID); } },
            { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-c="qldkh:edit" data-id="' + esc(r.ID) + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
            } },
            K.cotChon('kh')
        ]
    });

    function load() {
        var host = q('[data-z="t"]');
        K.dang(host);
        ums.api.call({
            action: Q.CN + 'DSA4BRIFKCQsHgokCS4gIikCLi8mDykgLwUoJCwP', func: 'pkg_congthongtin_congnhandiem.LayDSDiem_KeHoachCongNhanDiem',
            strTuKhoa: (fQ.value || '').trim(), strNguoiThucHien_Id: '', dHieuLuc: fHL.value
        }).then(function (r) {
            rows = K.ds(r);
            q('[data-z="n"]').textContent = '(' + rows.length + ')';
            bang.ve(rows);
        }).catch(function (err) { K.loi(host, err, 'danh sách kế hoạch'); });
    }

    function xoa() {
        var ids = K.daChon(q('[data-z="t"]'), 'kh');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        K.xoa(ids.map(function (id) {
            return { action: 'SV_CongNhanDiem/Xoa_Diem_KeHoachCongNhanDiem', strId: id, strNguoiThucHien_Id: '' };
        }), function () { load(); });
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    zDs.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !zDs.contains(b) || b.disabled) return;
        var id = b.getAttribute('data-id'), r = id ? K.tim(rows, id) : null;
        switch (b.getAttribute('data-a')) {
            case 'search': load(); break;
            case 'them': form.moThem(); mo('form'); break;
            case 'xoa': xoa(); break;
            case 'sua': if (r) { form.moSua(r); mo('form'); } else ui.toast('Vui lòng chọn đối tượng!', 'warn'); break;
            case 'pc': if (r) { pc.mo(r); mo('pc'); } break;
            case 'kq': if (r) { kq.mo(r); mo('kq'); } break;
            case 'hs': if (r) { hs.mo(r); mo('hs'); } break;
            case 'qd': if (r) { qd.mo(r); mo('qd'); } break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(); } });

    ums.report.mount(q('[data-z="bc"]'), {
        collect: function (add) {
            add('dHieuLuc', fHL.value);
            K.daChon(q('[data-z="t"]'), 'kh').forEach(function (id) { add('strDiem_KeHoachCongNhan_Id', id); });
        }
    });

    load();
})();
