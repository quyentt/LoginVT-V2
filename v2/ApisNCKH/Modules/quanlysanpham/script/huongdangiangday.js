/* =========================================================================
   Hướng dẫn giảng dạy (bản quản trị cũ, gộp hai phân loại) — ApisNCKH
   Bản gốc: ApisNCKH/Modules/quanlysanpham/html/huongdangiangday.html + script/huongdangiangday.js (2018).
   Không có bản Cổng cán bộ tương ứng: đây là bản GỐC CHUNG mà sau này tách thành giangdaysaudaihoc /
   huongdansaudaihoc (cùng controller NCKH_SP_HuongDan_GiangDay, phân loại chọn tay trong biểu mẫu).
   Khung: ums.nckhHD.man (_hd_chung.js) + khối ums.nckh.nguoi (Cổng cán bộ).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     NCKH_SP_HuongDan_GiangDay/LayDanhSach GET  strTuKhoa, strThanhVien_Id '', strPhanLoai_Id (ô "vai trò"),
                                                strNguoiThucHien_Id = người đăng nhập, phân trang máy chủ
     NCKH_SP_HuongDan_GiangDay/ThemMoi|CapNhat  strId, strTenDeTai_GiangDay, strNamNghiemThu, strPhanLoai_Id, iTrangThai 1, iThuTu 0
     NCKH_SP_HuongDan_GiangDay/Xoa              strIds
     NCKH_SP_HDGD_GiangVien_HD/LayDanhSach | ThemMoi (strGiangVien_Ids, strVaiTro_Ids — vai trò NCKH.VTQT) | Xoa_GiangVien (strGiangVien_Ids = GIANGVIEN_ID)
     NCKH_SP_HDGD_GiangVien_GD/LayDanhSach | ThemMoi (strNoiDung, strThoiGian — KHÔNG tráo như giangdaysaudaihoc) | Xoa_GiangVien
     NCKH_SP_HDGD_SinhVien/LayDanhSach | ThemMoi (strSinhVien_Ids) | Xoa_SinhVien (strSinhVien_Ids = ID dòng)
   Phân loại NCKH.VTHDGD quyết định khối giảng viên nào hiện (switchLoaiVTGV): mã "HD" → giảng viên hướng dẫn,
   "GD" → giảng viên giảng dạy, mã khác → cả hai.
   ---------------------------------------------------------------------------
   Khác bản gốc (tự chốt):
     · Bấm một mục ở cột trái → khung "Chi tiết hướng dẫn giảng dạy" (chỉ xem) như gốc. Gốc KHÔNG có lối vào Sửa / Xoá
       (hàm có sẵn nhưng danh sách không vẽ nút btnEdit / btnDelete) → thêm nút Sửa, Xoá trên đầu khung chi tiết.
     · Mã phân loại: gốc so đúng "HD" / "GD", danh mục thật (màn giangdaysaudaihoc / huongdansaudaihoc) mang mã
       GIANGDAY / HUONGDAN → gốc luôn báo "Loại vai trò giảng viên không chính xác!". Nay nhận cả hai kiểu mã.
     · Lưu: chỉ gửi người MỚI, mỗi người một lời gọi (gốc gửi lại mọi sinh viên đã có → trùng); khối giảng viên đang ẩn
       (không thuộc phân loại) không gửi.
     · Tên đề tài bắt buộc (gốc không kiểm, lưu được bản ghi trống). Ô "Năm nghiệm thu" gốc gắn lịch chọn ngày (input-datepicker)
       → năm "2026" bị lịch đổi thành 20/06/2026 khi mở sửa; nay là ô chữ như hai màn sau đại học.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('nckh-qlsp-huongdangiangday');
    if (!root) return;
    var N = ums.nckh, H = ums.nckhHD, ui = ums.ui, e = N.e, esc = ui.esc;
    function uid() { return N.uid(); }

    var dmPL = [];
    var plP = ums.api.dm('NCKH.VTHDGD').then(function (d) { dmPL = d; return d; }).catch(function (err) { ums.api.handle(err, 'phân loại'); return []; });
    /** 'HD' | 'GD' | '' (cả hai) theo mã danh mục của phân loại */
    function kieu(plId) {
        var x = dmPL.filter(function (r) { return e(r.ID) === e(plId); })[0], ma = x ? String(x.MA || '').toUpperCase() : '';
        if (ma === 'HD' || ma === 'HUONGDAN') return 'HD';
        if (ma === 'GD' || ma === 'GIANGDAY') return 'GD';
        return '';
    }

    var gvHD = N.nguoi({ tieuDe: 'Giảng viên hướng dẫn', nguon: 'nhansu', vaiTro: 'NCKH.VTQT',
        list: function (id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
        map: function (x) { return { id: e(x.GIANGVIEN_ID), ten: H.hoTen(x), vaiTroTen: e(x.VAITRO_TEN) }; },
        save: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strGiangVien_Ids: r.id, strVaiTro_Ids: e(r.vaiTro), strNguoiThucHien_Id: uid() }; },
        xoa: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_HD/Xoa_GiangVien', strGiangVien_Ids: r.id, strNCKH_SP_HD_GD_Id: id, strNguoiThucHien_Id: uid() }; } });
    var gvGD = N.nguoi({ tieuDe: 'Giảng viên giảng dạy', nguon: 'nhansu',
        them: [{ key: 'noiDung', title: 'Nội dung' }, { key: 'thoiGian', title: 'Thời gian' }],
        list: function (id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach', strNCKH_SP_HD_GD_Id: id }; },
        map: function (x) { return { id: e(x.GIANGVIEN_ID), ten: H.hoTen(x), noiDung: e(x.NOIDUNGGIANGDAY), thoiGian: e(x.THOIGIAN) }; },
        save: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/ThemMoi', strId: '', strNCKH_SP_HD_GD_Id: id, strGiangVien_Ids: r.id,
            strNoiDung: e(r.noiDung), strThoiGian: e(r.thoiGian), strNguoiThucHien_Id: uid() }; },
        xoa: function (r, id) { return { action: 'NCKH_SP_HDGD_GiangVien_GD/Xoa_GiangVien', strGiangVien_Ids: r.id, strNCKH_SP_HD_GD_Id: id, strNguoiThucHien_Id: uid() }; } });
    var sv = H.hocVien({ tieuDe: 'Thành viên tham gia', locTruong: false });
    var hostKhoi = [];

    function datKieu(plId) {
        var k = kieu(plId);
        if (hostKhoi[0]) hostKhoi[0].hidden = k === 'GD';
        if (hostKhoi[1]) hostKhoi[1].hidden = k === 'HD';
    }

    var crud = H.man(root, {
        tieuDe: 'Hướng dẫn giảng dạy', dsTieuDe: 'Danh sách', icon: 'fa-chalkboard-user', formTitle: 'hướng dẫn giảng dạy', ctl: 'NCKH_SP_HuongDan_GiangDay',
        loiChao: 'Hôm nay bạn có kế hoạch mới không? Bấm Thêm mới ở đầu trang.',
        loc: [{ key: 'pl', type: 'select', label: 'Tất cả vai trò', source: { dm: 'NCKH.VTHDGD' } }],
        ten: function (r) { return e(r.TENDETAI_GIANGDAY); },
        ds: function (x) { return { strTuKhoa: x.q, strThanhVien_Id: '', strPhanLoai_Id: x.pl, strNguoiThucHien_Id: uid() }; },
        fields: [
            { type: 'legend', label: 'Khởi tạo hướng dẫn giảng dạy' },
            { key: 'strTenDeTai_GiangDay', col: 'TENDETAI_GIANGDAY', label: 'Tên đề tài', required: true, cols: 12 },
            { key: 'strNamNghiemThu', col: 'NAMNGHIEMTHU', label: 'Năm nghiệm thu', cols: 6 },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', required: true, cols: 6, source: { dm: 'NCKH.VTHDGD' } }
        ],
        khoi: [gvHD, gvGD, sv],
        choNap: plP,
        luuKhoi: function (k) { var i = [gvHD, gvGD, sv].indexOf(k); return !(hostKhoi[i] && hostKhoi[i].hidden); },
        luu: function (v) {
            return { strTenDeTai_GiangDay: v.strTenDeTai_GiangDay, strNamNghiemThu: v.strNamNghiemThu, strPhanLoai_Id: v.strPhanLoai_Id,
                iTrangThai: 1, iThuTu: 0, strNguoiThucHien_Id: uid() };
        },
        onForm: function (row, c, extra, hosts) {
            hostKhoi = Array.prototype.slice.call(hosts);
            var sel = root.querySelector('[data-scope="form"][data-k="strPhanLoai_Id"]');
            if (!sel) return;
            // Thêm mới: gốc chọn sẵn mục phân loại đầu tiên (genCombo_PhanLoai)
            if (!row && !sel.value && dmPL.length) { sel.value = dmPL[0].ID; if (window.jQuery) jQuery(sel).trigger('change.select2'); }
            datKieu(sel.value);
            if (!sel._hdgd && window.jQuery) { sel._hdgd = 1; jQuery(sel).on('change', function () { datKieu(sel.value); }); }
        }
    });

    /* ---------- Khung "Chi tiết hướng dẫn giảng dạy" (chỉ xem) — thay chỗ khung giới thiệu ---------- */
    var ct = null, dang = null;
    function khung() {
        if (ct) return ct;
        var notify = crud.z('notify');
        notify.insertAdjacentHTML('afterend', '<div data-hdgd="ct" hidden></div>');
        ct = notify.parentNode.querySelector('[data-hdgd="ct"]');
        ct.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-hdgd-a]');
            if (!a) return;
            var act = a.getAttribute('data-hdgd-a');
            if (act === 'dong') dongCT();
            else if (act === 'sua') { var r = dang; ct.hidden = true; crud.showForm(r); }
            else if (act === 'xoa') xoa(dang);
        });
        return ct;
    }
    function dongCT() {
        if (!ct || ct.hidden) return;
        dang = null;
        crud.editing = null;
        ui.swap(ct, crud.z('notify'), { top: false });
        crud.draw();
    }
    function bang(el, rows, cot) { ui.table({ el: el, rows: rows, columns: cot, empty: 'Không có dữ liệu' }); }
    function moCT(r) {
        var el = khung();
        var fm = crud.z('form');
        if (fm && !fm.hidden) crud.showList();
        dang = r;
        crud.editing = r;
        crud.draw();
        var k = kieu(r.PHANLOAI_ID);
        el.innerHTML = ums.pat.panel({ title: 'Chi tiết hướng dẫn giảng dạy', icon: 'fa-file-lines',
            tools: ui.btn('close', { attr: { 'data-hdgd-a': 'dong' } }) + ui.btn('edit', { attr: { 'data-hdgd-a': 'sua' } }) +
                ui.btn('del', { attr: { 'data-hdgd-a': 'xoa' } }),
            body: '<div class="ums-legend">Thông tin</div><div>' +
                '<div class="ums-kv"><span>Tên đề tài</span><b>' + esc(e(r.TENDETAI_GIANGDAY)) + '</b></div>' +
                '<div class="ums-kv"><span>Năm nghiệm thu</span><b>' + esc(e(r.NAMNGHIEMTHU)) + '</b></div>' +
                '<div class="ums-kv"><span>Phân loại</span><b>' + esc(e(r.PHANLOAI_TEN)) + '</b></div>' +
                '<div class="ums-kv"><span>Kê khai</span><b>' + esc(e(r.NGUOITHUCHIEN_TENDAYDU)) + '</b></div></div>' +
                (k === 'GD' ? '' : '<div class="ums-legend">Giảng viên hướng dẫn</div><div class="hdgd-bang" data-hdgd="hd"></div>') +
                (k === 'HD' ? '' : '<div class="ums-legend">Giảng viên giảng dạy</div><div class="hdgd-bang" data-hdgd="gd"></div>') +
                '<div class="ums-legend">Sinh viên tham gia</div><div class="hdgd-bang" data-hdgd="sv"></div>' });
        ui.swap(crud.z('notify'), el, { top: false });
        el.hidden = false;
        function nap(z, action, cot) {
            var h = el.querySelector('[data-hdgd="' + z + '"]');
            if (!h) return;
            h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: action, method: 'GET', strNCKH_SP_HD_GD_Id: r.ID })
                .then(function (x) { if (dang === r) bang(h, N.arr(x.data), cot); })
                .catch(function (err) { h.innerHTML = ui.fail(err.message); });
        }
        var ten = { title: 'Họ tên', render: function (x) { return esc(H.hoTen(x)); } };
        nap('hd', 'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach', [ten, { title: 'Vai trò', prop: 'VAITRO_TEN' }]);
        nap('gd', 'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach', [ten, { title: 'Nội dung', prop: 'NOIDUNGGIANGDAY' }, { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-nowrap' }]);
        nap('sv', 'NCKH_SP_HDGD_SinhVien/LayDanhSach', [ten]);
    }
    function xoa(r) {
        if (!r) return;
        ui.confirm('Xoá "' + e(r.TENDETAI_GIANGDAY) + '"? Thao tác này không hoàn tác được.', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'NCKH_SP_HuongDan_GiangDay/Xoa', strIds: r.ID, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); dongCT(); crud.load(); })
                .catch(function (err) { ums.api.handle(err, 'xoá'); });
        });
    }

    /* Bấm mục cột trái → chi tiết (bắt ở pha capture, trước trình xử lý "Sửa" của ums.crud).
       Bấm Thêm mới khi đang xem chi tiết → ẩn chi tiết rồi để crud mở biểu mẫu. */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-c]');
        if (!b) return;
        var act = b.getAttribute('data-c').split(':')[1];
        if (act === 'edit' && b.classList.contains('ums-master__item')) {
            ev.stopPropagation();
            var r = crud.rows[Number(b.getAttribute('data-i'))];
            if (r) moCT(r);
        } else if (act === 'add' && ct && !ct.hidden) {
            ct.hidden = true; dang = null;
            crud.z('notify').hidden = false;
        }
    }, true);
})();
