/* =========================================================================
   Người học xác nhận thanh toán — SV theo kế hoạch, xem và xác nhận các thông tin do trường yêu cầu
   Bản gốc: ApisSinhVien/Modules/dicvusinhvien/html/nguoihocxacnhanthanhtoan.html + script/…js
   Trên host: menu Cổng SV thủ vai "Kiểm tra thông tin cá nhân" trỏ đúng tệp này
   (/modules/dicvusinhvien/html/nguoihocxacnhanthanhtoan.html, MAUNGDUNG ApisSinhVien). Màn đọc người học
   bằng ums.session.userId (= edu.system.userId của gốc; khi thủ vai là ID người học — vỏ lo).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (MỘT cột): thanh lọc "Chọn kế hoạch xác nhận" + "Xem" → khung "Thông tin kế hoạch"
   → khung "Thông tin xác nhận" (nút Xác nhận, bảng tiêu đề ba tầng, cột ô chọn) → hộp "Thực hiện xác nhận".

   Lời gọi (chép nguyên action / func / tên tham số — SV_XacNhan_HoSo_MH · PKG_CORE_XACNHAN_HOSO):
     LayDS_Core_Person_KH_XN_By   (strNguoiThuVai_Id — tên gốc thiếu chữ "c", gửi tường minh = ID cán bộ đang
                                   thủ vai ums.state.thuVaiId; strHanhDong_Code '') → ô kế hoạch (ID/TEN, TUNGAY, DENNGAY, MOTA)
     LayDS_Core_Person_KH_TT_XN   (strCORE_PERSON_KH_XN_Id, strCORE_PERSON_Id = người học) → bảng
     LayDS_LoaiXacNhan            (strCORE_PERSON_Id) → ô Loại xác nhận (một mục thì chọn sẵn)
     LayDS_HanhDong               (strCORE_PERSON_Id, strLoaiXacNhan_Id) → ô Xác nhận (một mục thì chọn sẵn)
     Them_Core_Person_HoSo_XN     mỗi dòng đã chọn một lời gọi: strDuLieuXacNhan_Id = ID dòng,
                                   strDuLieuXacNhan = userId + kế hoạch + BANGDULIEUNGUON + TRUONGDULIEUNGUON + DIEUKIENLOC
     strVaiTroDangNhap_Id / strChucNangHeThong_Id (edu.system.* ở gốc) — api.js tự điền.
   Khác gốc:
     · Loại xác nhận → Xác nhận là cặp CHA → CON (luật chung): chưa chọn loại thì khoá ô hành động.
       Gốc nạp hành động cả khi loại còn trống (strLoaiXacNhan_Id rỗng) — ở đây chỉ nạp khi đã chọn loại.
     · Lưu hàng loạt qua ums.ui.batch (tuần tự), xong nạp lại bảng ngay (gốc chờ 1 giây).
     · Đổi kế hoạch thì ẩn hai khung cũ tới khi bấm "Xem" lại (gốc để nguyên dữ liệu kế hoạch trước).
     · Bốn cột "Xác nhận / Ghi chú" đọc tên cột VIẾT HOA trước (CORE_PS_HS_XN_HANHDONG_NH_TEN…, như bản
       Cổng SV mới — Oracle trả tên cột viết hoa), không có mới đọc tên viết thường của gốc Sinh viên.

   DÙNG CHUNG với Cổng sinh viên (kéo gốc 30/9): ApisCongSinhVien/Modules/dicvusinhvien/html/
   nguoihocxacnhanthanhtoan.html nạp CHÍNH tệp này với <div id="sv-nhxntt" data-kieu="csv">. Hai bản gốc
   (ApisSinhVien ↔ ApisCongSinhVien) chỉ khác ở các điểm sau — cờ "csv" bật đúng những điểm đó, không cờ
   thì giữ nguyên hành vi Sinh viên:
     · Tiêu đề "Kiểm tra thông tin cá nhân" (breadcrumb gốc Cổng SV); ô Ghi chú có chữ gợi ý "Nhập ghi chú...".
     · LayDS_Core_Person_KH_XN_By gửi strNguoiThuVai_Id = '' (gốc Cổng SV viết cứng rỗng).
     · Them_Core_Person_HoSo_XN theo "spec" ghi trong gốc Cổng SV:
         strDuLieuXacNhan_Id = CORE_PERSON_ID + CORE_PERSON_KEHOACH_XACNHAN_ID + BANGDULIEUNGUON
                               + TRUONGDULIEUNGUON + (DIEUKIENLOC, rỗng thì '#')
         strDuLieuXacNhan    = GIATRIDULIEUNGUON (giá trị đang xác nhận)
       (bản Sinh viên: strDuLieuXacNhan_Id = ID dòng, strDuLieuXacNhan = userId + kế hoạch + nguồn…).
     · attachDropdownParent (select2 trong modal Bootstrap) — ui.dialog tự lo, không cần.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('sv-nhxntt');
    if (!root) return;
    /* data-kieu="csv": bản Cổng sinh viên (xem chú thích đầu tệp) */
    var CSV = root.getAttribute('data-kieu') === 'csv';
    var A = 'SV_XacNhan_HoSo_MH/', P = 'PKG_CORE_XACNHAN_HOSO.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    /** Đọc cột: tên VIẾT HOA trước (Oracle), không có thì tên viết thường của gốc Sinh viên */
    function cot(x, ten) { var h = x[ten.toUpperCase()]; return h !== undefined && h !== null ? h : x[ten]; }

    var dtKeHoach = [], dtXN = [];

    root.innerHTML =
        pat.page(CSV ? 'Kiểm tra thông tin cá nhân' : 'Xác nhận thông tin', '') +
        pat.filterBar([{ key: 'kh', type: 'select', label: 'Chọn kế hoạch xác nhận' }], { searchText: 'Xem' }) +
        '<div data-z="tt" hidden>' + pat.panel({ title: 'Thông tin kế hoạch', icon: 'fa-circle-info', cls: 'ums-u-mb-4', body:
            '<div class="ums-grid ums-grid--3">' +
                '<div class="ums-kv"><span>Tên kế hoạch</span><b data-v="TEN"></b></div>' +
                '<div class="ums-kv"><span>Từ ngày</span><b data-v="TUNGAY"></b></div>' +
                '<div class="ums-kv"><span>Đến ngày</span><b data-v="DENNGAY"></b></div></div>' +
            '<div class="ums-kv ums-u-mt-3"><span>Mô tả</span><b data-v="MOTA"></b></div>' }) + '</div>' +
        '<div data-z="xn" hidden>' + pat.panel({ title: 'Thông tin xác nhận', icon: 'fa-list-check', count: 'n', flush: true, zone: 'bang',
            tools: ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }) }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var elKH = root.querySelector('[data-f="kh"]');

    /* [1] Kế hoạch xác nhận của người học */
    ums.api.call({
        action: A + 'DSA4BRIeAi4zJB4RJDMyLi8eCgkeGQ8eAzgP', func: P + 'LayDS_Core_Person_KH_XN_By',
        strNguoiThuVai_Id: CSV ? '' : ((ums.state && ums.state.thuVaiId) || ''),
        strNguoiThucHien_Id: uid(), strHanhDong_Code: ''
    }).then(function (r) {
        dtKeHoach = arr(r.data);
        pat.fill(elKH, dtKeHoach, { name: 'TEN', head: 'Chọn kế hoạch xác nhận' });
    }).catch(function (err) { ums.api.handle(err, 'kế hoạch xác nhận'); });

    if (window.jQuery) jQuery(elKH).on('select2:select select2:clear', function () { z('tt').hidden = true; z('xn').hidden = true; });

    /* [2] Xem kế hoạch + [3] thông tin xác nhận */
    function xem() {
        var id = elKH.value;
        if (!id) { ui.toast('Vui lòng chọn kế hoạch xác nhận', 'warn'); return; }
        var kh = dtKeHoach.filter(function (x) { return String(x.ID) === String(id); })[0];
        z('tt').hidden = !kh;
        if (kh) Array.prototype.forEach.call(z('tt').querySelectorAll('[data-v]'), function (b) { b.textContent = e(kh[b.getAttribute('data-v')]); });
        taiXN(id);
    }
    function taiXN(id) {
        z('xn').hidden = false;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: A + 'DSA4BRIeAi4zJB4RJDMyLi8eCgkeFRUeGQ8P', func: P + 'LayDS_Core_Person_KH_TT_XN',
            strCORE_PERSON_KH_XN_Id: id, strCORE_PERSON_Id: uid(), strNguoiThucHien_Id: uid()
        }).then(function (r) {
            dtXN = arr(r.data);
            veXN();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thông tin xác nhận'); });
    }
    var G_CN = ['Thông tin xác nhận', 'Cá nhân xác nhận'], G_NT = ['Thông tin xác nhận', 'Nhà trường phản hồi'];
    function veXN() {
        root.querySelector('[data-z="n"]').textContent = '(' + dtXN.length + ')';
        ui.table({
            el: z('bang'), rows: dtXN, empty: 'Không có thông tin cần xác nhận',
            columns: [
                { title: 'Loại thông tin', prop: 'TENHIENTHI' },
                { title: 'Dữ liệu', prop: 'GIATRIDULIEUNGUON' },
                { title: 'Xác nhận', render: function (x) { return ui.esc(e(cot(x, 'CORE_PS_HS_XN_HanhDong_NH_Ten'))); }, group: G_CN },
                { title: 'Ghi chú theo xác nhận', render: function (x) { return ui.esc(e(cot(x, 'CORE_PS_HS_XN_HanhDong_NH_MoTa'))); }, group: G_CN },
                { title: 'Xác nhận', render: function (x) { return ui.esc(e(cot(x, 'CORE_PS_HS_XN_HanhDong_ND_Ten'))); }, group: G_NT },
                { title: 'Ghi chú theo xác nhận', render: function (x) { return ui.esc(e(cot(x, 'CORE_PS_HS_XN_HanhDong_ND_MoTa'))); }, group: G_NT },
                { head: 'Chọn<br><input type="checkbox" data-xn-all title="Chọn tất cả">', cls: 'is-center', width: '64px',
                  render: function (x, i) { return '<input type="checkbox" data-xn="' + i + '">'; } }
            ]
        });
    }
    function daChon() {
        return Array.prototype.map.call(z('bang').querySelectorAll('input[data-xn]:checked'), function (c) {
            return dtXN[Number(c.getAttribute('data-xn'))];
        }).filter(Boolean);
    }

    /* [4] Hộp "Thực hiện xác nhận" */
    function moXacNhan() {
        var chon = daChon();
        if (!chon.length) { ui.toast('Vui lòng chọn ít nhất 1 dòng để xác nhận', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Thực hiện xác nhận', icon: 'fa-circle-check', size: 'md',
            body: '<div class="ums-stack">' +
                ui.field('Loại xác nhận', '<select class="ums-select" data-k="loai" data-ph="Chọn loại xác nhận"><option value="">Chọn loại xác nhận</option></select>', { required: true }) +
                ui.field('Xác nhận', '<select class="ums-select" data-k="hd" data-ph="Chọn hành động xác nhận"><option value="">Chọn hành động xác nhận</option></select>', { required: true }) +
                ui.field('Ghi chú', '<textarea class="ums-input" data-k="gc" rows="4"' + (CSV ? ' placeholder="Nhập ghi chú..."' : '') + '></textarea>') + '</div>',
            buttons: [{ text: 'Xác nhận', kind: 'confirm', onClick: function (h) { return luu(h, chon); } }]
        });
        ui.enhance(dlg.body);
        var elLoai = dlg.body.querySelector('[data-k="loai"]'), elHD = dlg.body.querySelector('[data-k="hd"]');
        var chain = pat.chain([elLoai, elHD], { phatLai: false });
        function napHD() {
            if (!elLoai.value) { pat.fill(elHD, [], { head: 'Chọn hành động xác nhận' }); chain.sync(); return; }
            ums.api.call({
                action: A + 'DSA4BRIeCSAvKQUuLyYP', func: P + 'LayDS_HanhDong',
                strCORE_PERSON_Id: uid(), strLoaiXacNhan_Id: elLoai.value, strNguoiThucHien_Id: uid(), strHanhDong_Code: ''
            }).then(function (r) {
                var ds = arr(r.data);
                pat.fill(elHD, ds, { name: 'TEN', head: 'Chọn hành động xác nhận' });
                if (ds.length === 1) { elHD.value = ds[0].ID; if (window.jQuery) jQuery(elHD).trigger('change.select2'); }
                chain.sync();
            }).catch(function (err) { ums.api.handle(err, 'hành động xác nhận'); });
        }
        if (window.jQuery) jQuery(elLoai).on('select2:select select2:clear', napHD);
        ums.api.call({
            action: A + 'DSA4BRIeDS4gKBkgIg8pIC8P', func: P + 'LayDS_LoaiXacNhan',
            strCORE_PERSON_Id: uid(), strNguoiThucHien_Id: uid(), strHanhDong_Code: ''
        }).then(function (r) {
            var ds = arr(r.data);
            pat.fill(elLoai, ds, { name: 'TEN', head: 'Chọn loại xác nhận' });
            if (ds.length === 1) { elLoai.value = ds[0].ID; if (window.jQuery) jQuery(elLoai).trigger('change.select2'); }
            chain.sync();
            napHD();
        }).catch(function (err) { ums.api.handle(err, 'loại xác nhận'); });
    }

    /* [7] Lưu — mỗi dòng một lời gọi Them_Core_Person_HoSo_XN */
    function luu(h, chon) {
        var loai = h.body.querySelector('[data-k="loai"]').value, hd = h.body.querySelector('[data-k="hd"]').value;
        var gc = h.body.querySelector('[data-k="gc"]').value;
        if (!loai) { ui.toast('Vui lòng chọn loại xác nhận', 'warn'); return false; }
        if (!hd) { ui.toast('Vui lòng chọn hành động xác nhận', 'warn'); return false; }
        var kh = elKH.value;
        var calls = chon.map(function (row) {
            var idDL = row.ID,
                dl = e(uid()) + e(kh) + e(row.BANGDULIEUNGUON) + e(row.TRUONGDULIEUNGUON) + e(row.DIEUKIENLOC);
            if (CSV) {
                /* Gốc Cổng SV: DuLieuXacNhan_Id = CORE_PERSON_Id + CORE_PERSON_KEHOACH_XACNHAN_Id
                   + BANGDULIEUNGUON + TRUONGDULIEUNGUON + DIEUKIENLOC (rỗng → '#');
                   DuLieuXacNhan = giá trị hiển thị từ nguồn */
                idDL = e(row.CORE_PERSON_ID) + e(row.CORE_PERSON_KEHOACH_XACNHAN_ID) + e(row.BANGDULIEUNGUON) +
                    e(row.TRUONGDULIEUNGUON) + (e(row.DIEUKIENLOC) || '#');
                dl = e(row.GIATRIDULIEUNGUON);
            }
            return {
                action: A + 'FSkkLB4CLjMkHhEkMzIuLx4JLhIuHhkP', func: P + 'Them_Core_Person_HoSo_XN',
                strDuLieuXacNhan_Id: idDL, strLoaiXacNhan_Id: loai,
                strDuLieuXacNhan: dl,
                strHanhDong_NguoiHoc_Id: hd, strHanhDong_NguoiDuyet_Id: '',
                strThongTin_NguoiHocNhap: gc, strThongTin_NguoiDuyetNhap: '',
                strNguoiThucHien_Id: uid(), strHanhDong_Code: ''
            };
        });
        ui.batch(calls, { title: 'Đang xác nhận', okText: 'Đã xác nhận', show: true }).then(function () { taiXN(kh); });
    }

    root.addEventListener('change', function (ev) {
        if (ev.target.hasAttribute('data-xn-all')) {
            Array.prototype.forEach.call(z('bang').querySelectorAll('input[data-xn]'), function (c) { c.checked = ev.target.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') xem();
        else if (b.getAttribute('data-a') === 'xacnhan') moXacNhan();
    });
})();
