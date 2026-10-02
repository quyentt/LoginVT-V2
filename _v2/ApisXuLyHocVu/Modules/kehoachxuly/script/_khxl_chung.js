/* =========================================================================
   Kế hoạch xử lý học vụ — tiện ích dùng chung của màn (ums.khxl)
   Bản gốc: ApisXuLyHocVu/Modules/kehoachxuly/script/kehoachxuly.js
   ---------------------------------------------------------------------------
   K.cotChon(k) / K.ganChon(host) / K.daChon(host, k)
       cột ô đánh dấu (checkX + chkSelectAll của gốc). Mỗi bảng một thuộc tính riêng
       (data-kh, data-pc, data-svad, data-kq, data-xet, data-ktn) — KHÔNG dùng data-ck
       (trùng ô trạng thái của ums.pat.checks trong hộp chọn sinh viên).
       Ô "chọn tất cả" chỉ đánh dấu dòng ĐANG HIỆN (dòng bị ô tìm tại chỗ ẩn đi thì bỏ qua).
   K.locTaiCho(input, host)
       ô "Nhập từ khóa tìm kiếm" lọc dòng ngay trên bảng (gốc: keyup → toggle tr theo
       change_alias). Gốc còn tô ĐỎ mọi dòng (filter() trả về jQuery — luôn đúng) → bỏ.
   K.maSo(r)
       ô "Mã số" bấm được → hộp học tập của người học (btnView_HocTap của gốc).
   K.hocTap(id, ten)
       hộp #modalHTSinhVien: gốc nạp /modules/hoctap/html/diemhoc.html của Cổng SV với
       window._embeddedSinhVien_Id → ở đây ums.diemHoc.mount (bản viết lại dùng chung).
   K.xet(rows, ids, onDone)
       save_KetQuaXuLy của gốc — XLHV_TinhToan/XuLyHocVuNguoiHoc (POST) cho từng dòng
       đã chọn, tham số đọc từ CHÍNH dòng đó (gốc tra trong dtKetQuaXuLy rồi dtKetQuaXuLy2 —
       hai mảng dùng chung giữa ba bảng, có thể là dữ liệu của bảng khác; ở đây tra đúng
       bảng vừa bấm).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc;
    var K = ums.khxl = ums.khxl || {};

    K.TT = 'XLHV_ThongTin_MH/';
    K.P = 'pkg_xulyhocvu_thongtin.';

    function e(v) { return v === undefined || v === null ? '' : v; }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    K.e = e;
    K.qa = qa;

    /** Mảng dòng của một kết quả ums.api.call */
    K.ds = function (r) { var d = r && r.data; return Array.isArray(d) ? d : []; };
    K.tim = function (rows, id) {
        for (var i = 0; i < (rows || []).length; i++) if (String(rows[i].ID) === String(id)) return rows[i];
        return null;
    };
    K.dang = function (el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); };
    K.loi = function (el, err, noi) { el.innerHTML = ui.fail(err && err.message); ums.api.handle(err, noi); };
    K.hoTen = function (r) { return (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(); };

    /* ---------- Cột ô đánh dấu ---------------------------------------------- */
    K.cotChon = function (k) {
        return { head: '<input type="checkbox" data-all="' + k + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-' + k + '="' + esc(r.ID) + '">'; } };
    };
    K.ganChon = function (host) {
        host.addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-all');
            if (!k) return;
            var tb = t.closest('table');
            if (!tb) return;
            qa(tb, 'tbody input[data-' + k + ']').forEach(function (x) {
                var tr = x.closest('tr');
                if (tr && tr.hidden) return;
                x.checked = t.checked;
            });
        });
    };
    K.daChon = function (host, k) {
        return qa(host, 'tbody input[data-' + k + ']').filter(function (x) { return x.checked; })
            .map(function (x) { return x.getAttribute('data-' + k); });
    };

    /* ---------- Lọc tại chỗ -------------------------------------------------- */
    function boDau(x) {
        return String(x === null || x === undefined ? '' : x)
            .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }
    K.locTaiCho = function (input, host) {
        function loc() {
            var q = boDau(input.value).trim();
            qa(host, 'tbody tr').forEach(function (tr) {
                if (tr.querySelector('.ums-empty')) return;
                tr.hidden = !!q && boDau(tr.textContent).indexOf(q) < 0;
            });
        }
        input.addEventListener('input', loc);
        return loc;
    };

    /* ---------- Mã số → hộp học tập ----------------------------------------- */
    K.maSo = function (r) {
        return '<button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-a="hoctap" data-nh="' + esc(e(r.QLSV_NGUOIHOC_ID)) +
            '" data-ten="' + esc(K.hoTen(r) + (r.QLSV_NGUOIHOC_MASO ? ' — ' + r.QLSV_NGUOIHOC_MASO : '')) + '" title="Xem kết quả học tập">' +
            '<u>' + esc(e(r.QLSV_NGUOIHOC_MASO)) + '</u></button>';
    };
    K.hocTap = function (id, ten) {
        if (!id) { ui.toast('Dòng này không có mã người học', 'warn'); return; }
        var dh = null;
        var dlg = ui.dialog({
            title: ten || 'Kết quả học tập', icon: 'fa-user-graduate', size: 'xl', body: '<div data-z="dh"></div>',
            onClose: function () { if (dh && dh.destroy) dh.destroy(); }
        });
        /* ctdt: gốc nhúng CHÍNH trang diemhoc của Cổng SV nên theo bản mới của trang đó (kéo gốc 30/9): dòng
           "Tổng số tín chỉ chương trình" + bấm cả dòng bảng điểm. Gốc mới đọc id SV khi nhúng từ main_doc.LichGiang
           (bỏ window._embeddedSinhVien_Id mà màn này dùng → gốc nay rơi về id cán bộ); ở đây vẫn truyền id người học. */
        dh = ums.diemHoc.mount(dlg.body.querySelector('[data-z="dh"]'), { nguoiHocId: id, ctdt: true });
    };

    /* ---------- Xét xử lý học vụ -------------------------------------------- */
    K.xet = function (rows, ids, onDone) {
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var calls = [];
        ids.forEach(function (id) {
            var a = K.tim(rows, id);
            if (!a) return;
            calls.push({
                action: 'XLHV_TinhToan/XuLyHocVuNguoiHoc', method: 'POST',
                strChucNang_Id: '',
                strQLSV_NguoiHoc_Id: a.QLSV_NGUOIHOC_ID,
                strDaoTao_LopQuanLy_Id: a.DAOTAO_LOPQUANLY_ID,
                strDaoTao_ChuongTrinh_Id: a.DAOTAO_TOCHUCCHUONGTRINH_ID,
                strQLSV_TrangThaiNguoiHoc_Id: a.QLSV_TRANGTHAINGUOIHOC_ID,
                strDaoTao_ThoiGianDaoTao_Id: a.DAOTAO_THOIGIANDAOTAO_ID,
                strXLHV_KeHoachXuLy_Id: a.XLHV_KEHOACHXULY_ID,
                strLoaiXuLy_Id: a.LOAIXULY_ID,
                strNguoiThucHien_Id: ''
            });
        });
        return ui.batch(calls, { title: 'Đang xét xử lý học vụ', okText: 'Cập nhật thành công!', show: true })
            .then(function () { if (onDone) onDone(); });
    };

    /** Hỏi lại rồi chạy hàng loạt (edu.system.confirm + genHTML_Progress) */
    K.xoa = function (calls, xong, msg) {
        return ui.confirm(msg || 'Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(calls, { title: 'Đang xoá', okText: 'Xóa thành công!', show: true }).then(function () { if (xong) xong(); });
        });
    };
})();
