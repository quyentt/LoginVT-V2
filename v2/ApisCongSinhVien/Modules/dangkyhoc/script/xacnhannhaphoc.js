/* =========================================================================
   Xác nhận nhập học — Lịch sử xác nhận của bạn (Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/xacnhannhaphoc.html + script/xacnhannhaphoc.js
   ---------------------------------------------------------------------------
   Người học = ums.session.userId (vai trò thủ vai: vỏ đã chọn người học trước).
   Lời gọi (chép nguyên action / func / tham số):
       PKG_CORE_NhapHoc_ThuTien.LayDS_KeHoach_TheoNguoiHoc  → ô Kế hoạch nhập học (TEN_KEHOACH, chọn sẵn mục đầu)
       PKG_CORE_NhapHoc_ThuTien.LayDS_CSDT_TheoNguoiHoc_KH  → ô Cơ sở đào tạo theo kế hoạch (TEN, chọn sẵn mục đầu)
       PKG_CORE_NhapHoc_ThuTien.Sua_CoSoNhapHoc             "Xác nhận" (hỏi lại trước)
       PKG_CORE_NhapHoc_ThuTien.LayDS_LichSu_XacNhanCoSo    bảng "Lịch sử xác nhận của bạn"
           (strNh_KeHoach_NhapHoc_Id, strCore_Person_Id) — chưa chọn kế hoạch thì không gọi, vẽ bảng rỗng
   Bố cục giữ nguyên: MỘT cột — hai hàng "nhãn | ô chọn | nút", rồi bảng lịch sử.
   Giữ như gốc:
     · Mở màn chỉ nạp Kế hoạch (chọn sẵn mục đầu); Cơ sở + lịch sử nạp khi bấm
       "Xem thông tin" hoặc chọn kế hoạch.
     · Lịch sử xác nhận nạp cùng lúc với ô Cơ sở (bấm "Xem thông tin", chọn kế hoạch,
       xác nhận xong). Cột đọc ThoiGianThucHien / NguoiThucHien / CoSoDaoTao như gốc;
       dòng đầu (bản ghi hiệu lực) tô sáng.
   Khác bản gốc: luật chung cha → con — chưa chọn Kế hoạch thì khoá ô Cơ sở; xoá
   Kế hoạch thì xoá Cơ sở và bảng lịch sử.
   Kéo gốc 30/9: lịch sử xác nhận nay có lời gọi thật (trước gốc để TODO, bảng luôn rỗng) —
     SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIeDSgiKRI0HhkgIg8pIC8CLhIu · LayDS_LichSu_XacNhanCoSo.
     Khác gốc: tên cột gốc viết kiểu ThoiGianThucHien (gốc còn in console.table để dò tên cột — chưa chắc
     máy chủ trả đúng tên đó; cột Oracle thường viết HOA) → đọc thêm bản viết HOA THOIGIANTHUCHIEN /
     NGUOITHUCHIEN / COSODAOTAO; kiểm tên cột thật trên host. Bỏ các dòng console.* của gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var A = 'SV_CORE_NhapHoc_ThuTien_MH/', P = 'PKG_CORE_NhapHoc_ThuTien.';
    var root = document.getElementById('dkh-xacnhannhaphoc');
    var svId = (ums.session && ums.session.userId) || '';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    function hang(nhan, key, ph, nut) {
        return '<div class="ums-filter">' +
            ui.field(nhan, '<select class="ums-select" data-f="' + key + '" data-ph="' + ph + '"><option value="">' + ph + '</option></select>',
                { inline: true, labelWidth: '220px' }) +
            '<div class="ums-field ums-field--fit">' + nut + '</div></div>';
    }
    root.innerHTML =
        pat.page('Xác nhận nhập học', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-stack">' +
            hang('Kế hoạch nhập học', 'kh', 'Chọn kế hoạch nhập học',
                ui.btn('search', { text: 'Xem thông tin', attr: { 'data-a': 'xem' }, icon: 'fa-eye' })) +
            hang('Chọn cơ sở đào tạo học tập', 'cs', 'Chọn cơ sở đào tạo học tập',
                ui.btn('search', { text: 'Xác nhận', icon: 'fa-circle-check', attr: { 'data-a': 'xacnhan' } })) +
            '</div>' }) +
        pat.panel({ title: 'Lịch sử xác nhận của bạn', icon: 'fa-clock-rotate-left', flush: true, zone: 'ls' });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var fKh = f('kh'), fCs = f('cs');

    function chonDau(el, rows, id) {       // selectFirst của loadToCombo_data
        if (rows.length) { el.value = rows[0][id || 'ID']; if (window.jQuery) jQuery(el).trigger('change.select2'); }
    }

    /* Lịch sử (render_LichSuXacNhan): đọc tên cột như gốc, lùi về bản viết HOA */
    function cot(a, b) { return function (r) { var x = r[a] !== undefined && r[a] !== null ? r[a] : r[b]; return ui.esc(x === undefined || x === null ? '' : x); }; }
    function veLichSu(rows) {
        ui.table({ el: z('ls'), rows: rows || [], empty: 'Không có dữ liệu',
            rowCls: function (r, i) { return i === 0 ? 'is-selected' : ''; },
            columns: [
                { title: 'Thời gian thực hiện', render: cot('ThoiGianThucHien', 'THOIGIANTHUCHIEN') },
                { title: 'Người thực hiện', render: cot('NguoiThucHien', 'NGUOITHUCHIEN') },
                { title: 'Cơ sở đào tạo đã xác nhận', render: cot('CoSoDaoTao', 'COSODAOTAO') }
            ] });
    }

    function taiKeHoach() {
        return ums.api.call({ action: A + 'DSA4BRIeCiQJLiAiKR4VKSQuDyY0LigJLiIP', func: P + 'LayDS_KeHoach_TheoNguoiHoc',
            strCore_Person_Id: svId, strNguoiThucHien_Id: uid() })
            .then(function (r) { var d = arr(r.data); pat.fill(fKh, d, { name: 'TEN_KEHOACH' }); chonDau(fKh, d); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); });
    }
    function taiCoSo() {
        return ums.api.call({ action: A + 'DSA4BRIeAhIFFR4VKSQuDyY0LigJLiIeCgkP', func: P + 'LayDS_CSDT_TheoNguoiHoc_KH',
            strCore_Person_Id: svId, strNh_KeHoach_NhapHoc_Id: fKh.value, strNguoiThucHien_Id: uid() })
            .then(function (r) { var d = arr(r.data); pat.fill(fCs, d, { name: 'TEN' }); chonDau(fCs, d); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, 'cơ sở đào tạo'); });
    }
    function taiLichSu() {
        if (!fKh.value) { veLichSu([]); return Promise.resolve(); }
        return ums.api.call({ action: A + 'DSA4BRIeDSgiKRI0HhkgIg8pIC8CLhIu', func: P + 'LayDS_LichSu_XacNhanCoSo',
            strNh_KeHoach_NhapHoc_Id: fKh.value, strCore_Person_Id: svId, strNguoiThucHien_Id: uid() })
            .then(function (r) { veLichSu(arr(r.data)); })
            .catch(function (err) { veLichSu([]); ums.api.handle(err, 'lịch sử xác nhận'); });
    }
    function xem() { taiCoSo(); taiLichSu(); }

    if (window.jQuery) {
        jQuery(fKh).on('select2:select', xem);
        jQuery(fKh).on('select2:clear', function () { pat.fill(fCs, []); veLichSu([]); });
    }
    var chuoi = pat.chain([fKh, fCs], { phatLai: false });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'xem') {
            if (!fKh.value) { ui.toast('Vui lòng chọn kế hoạch nhập học?', 'warn'); return; }
            xem();
        } else if (a === 'xacnhan') {
            var kh = fKh.value, cs = fCs.value;
            if (!kh) { ui.toast('Vui lòng chọn kế hoạch nhập học?', 'warn'); return; }
            if (!cs) { ui.toast('Vui lòng chọn cơ sở đào tạo học tập?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xác nhận nhập học không?', { title: 'Xác nhận nhập học', ok: 'Xác nhận' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: A + 'EjQgHgIuEi4PKSAxCS4i', func: P + 'Sua_CoSoNhapHoc',
                    strNh_KeHoach_NhapHoc_Id: kh, strCore_Person_Id: svId, strDaoTao_CoSoDaoTao_Id: cs, strNguoiThucHien_Id: uid() })
                    .then(function () { ui.toast('Xác nhận nhập học thành công!', 'ok'); xem(); });
            }).catch(function (err) { ums.api.handle(err, 'xác nhận nhập học'); });
        }
    });

    veLichSu([]);
    taiKeHoach();
})();
