/* =========================================================================
   Kế hoạch đăng ký
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/kehoachdangky.html
            + script/kehoachdangky.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc — MỘT cột, ba vùng thay chỗ nhau (zone-content):
       #zonebatdau    thanh lọc + bảng kế hoạch            → vùng "ds"
       #zoneEdit      biểu mẫu kế hoạch (rất dài)            → vùng "form"   (_khdk_form.js)
       #zonePhanQuyen phân quyền cán bộ của một kế hoạch    → vùng "pq"     (_khdk_phanquyen.js)
   Hộp thoại: DS đăng ký / không đăng ký, 3 hộp phân công, chuyển dữ liệu (_khdk_hop.js),
   chọn lớp học phần (_khdk_xuly.js). Lưới "Thiết đặt thêm xử lý lớp HP" (_khdk_xuly.js) mở
   NGAY TRONG TRANG, thay chỗ cả màn (pat.formTrang — BO-CUC luật 1, 2026-09-30).

   Lời gọi của tệp này (chép nguyên):
       DKH_KeHoachDangKy/LayDanhSach   GET  strTuKhoa · strNguoiThucHien_Id · pageIndex · pageSize (phân trang máy chủ)
       NS_DKH_CHUNG2_MH/…  pkg_dangkyhoc_chung2.Them_DangKy_KeHoachDangKy   thêm (strId '')
       NS_DKH_CHUNG2_MH/…  pkg_dangkyhoc_chung2.Sua_DangKy_KeHoachDangKy    sửa (strId = ID)
       DKH_KeHoachDangKy/Xoa           POST strIds = ID (nút Xóa trong biểu mẫu)
       pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao (edu.system.getList_ThoiGianDaoTao — ô lọc Thời gian)
   Bảng: MAKEHOACH, TENKEHOACH, NGAYBATDAU, GIODANGKYTRONGNGAYDAU, PHUTDANGKYTRONGNGAYDAU,
         NGAYKETTHUC, GIOKETTHUCTRONGNGAYCUOI, PHUTKETTHUCTRONGNGAYCUOI, TRANGTHAI_TEN,
         MOHINHDANGKY_TEN, SOLUONGDUKIEN, SOLUONGDADANGKY, SOLUONGKHONGDANGKY, TYLE.
   Sửa: đổ từ CHÍNH dòng của danh sách (gốc: dtKeHoachDangKy.find) — không gọi chi tiết.

   strNguoiThucHien_Id: gốc gửi "" ở LayDanhSach; ums.api.call tự điền userId khi ô
   rỗng (như mọi màn đã chuyển) — procedure danh sách không lọc theo người thực hiện
   nên không đổi kết quả; ghi lại để biết.

   Cố ý bỏ (mã chết của gốc):
       · Ô lọc "Chế độ đăng ký" (#dropSearch_CheDoDangKy), nút #btnSearch_KHDK, xoá trên
         dòng (.btnDelete): không có trên màn. getList_KeHoachDangKy() không nhận tham số
         nên nút Tìm kiếm chỉ gửi từ khoá.
       · Thanh thao tác di động (#mobileActionBar_KHDK, bottom sheet), khối nút ẩn
         .aps-all-button (display:none !important), mã sửa select2 trong modal, CSS dàn
         lại cho ≤767px — vỏ mới đã tự co giãn / tự lo select2 trong hộp thoại.
       · me.arrValid_KeHoachDangKy ({ MA: 'dropKhenThuong' }) — không dùng.

   Khác gốc:
       · Ô lọc Thời gian: gốc đổ danh sách vào #dropSearch_ThoiGianDaoTao (KHÔNG có trên
         màn) nên ô #dropSearch_ThoiGian luôn trống và không bao giờ được gửi đi. Ở đây ô
         có danh sách; chọn thì tải MỌI kế hoạch (pageSize = ums.ui.PAGE_ALL) rồi lọc ở
         máy khách theo DAOTAO_THOIGIANDAOTAO_NAM_ID / _KY_ID / _DOT_ID của dòng
         (LayDanhSach không có tham số thời gian — không đổi chữ ký procedure).
       · Lưu thành công thì đóng biểu mẫu, về danh sách (gốc ở lại biểu mẫu mà không
         nhớ ID vừa thêm → bấm Lưu lần hai là THÊM TRÙNG, bấm Phân công thì gửi ID rỗng).
       · Bốn nút Phân công / Chuyển dữ liệu khoá khi đang THÊM MỚI (gốc gửi
         strDangKy_KeHoachDangKy_Id rỗng) — lưu kế hoạch rồi mở lại để dùng.
       · Xóa / Đóng / Lưu ở đầu khung biểu mẫu (dính khi cuộn); bốn nút phân công /
         chuyển dữ liệu giữ ở chân khung như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, K = ums.khdk;
    var esc = ui.esc;
    var root = document.getElementById('kehoachdangky');
    if (!root) return;

    function e(v) { return v === undefined || v === null ? '' : v; }
    function q(sel) { return root.querySelector(sel); }
    function nut(icon, title, a, id, extra) {
        return '<button type="button" class="ums-iconbtn ums-iconbtn--' + (extra || 'view') + '" data-a="' + a + '" data-id="' + esc(id) + '"' +
            (a === 'xem' ? ' data-c="khdk:edit"' : '') + ' title="' + esc(title) + '"><i class="fa-light ' + icon + '"></i></button>';
    }

    /* ---------- Khung ------------------------------------------------------- */
    /* Đầu khung (dính khi cuộn): Xóa · Đóng · Lưu. Bốn nút nghiệp vụ dài giữ ở CHÂN
       khung như gốc (box-footer) — dồn cả bảy nút lên đầu thì tràn ngang. */
    var CN_TOOLS =
        ui.btn('close', { attr: { 'data-a': 'dong' } }) +
        ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
        ui.btn('save', { attr: { 'data-a': 'luu' } });
    var CN_FOOT =
        ui.btn('search', { text: 'Phân công theo nhóm kiểm soát(mức chương trình)', mod: 'out-primary', icon: 'fa-poll-people', attr: { 'data-a': 'pc-ct', 'data-can-id': '1' } }) +
        ui.btn('search', { text: 'Phân công theo nhóm kiểm soát(mức khóa học)', mod: 'out-danger', icon: 'fa-user-chart', attr: { 'data-a': 'pc-kh', 'data-can-id': '1' } }) +
        ui.btn('search', { text: 'Phân công theo nhóm kiểm soát', mod: 'out-success', icon: 'fa-users-rectangle', attr: { 'data-a': 'pc-nks', 'data-can-id': '1' } }) +
        ui.btn('search', { text: 'Chuyển dữ liệu từ TKB sang ĐKH', mod: 'out-primary', icon: 'fa-database', attr: { 'data-a': 'chuyen', 'data-can-id': '1' } });

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Kế hoạch đăng ký', ui.btn('add', { attr: { 'data-a': 'them' } })) +
            pat.filterBar([
                { key: 'tg', type: 'select', label: 'Tất cả học kỳ' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách kế hoạch đăng ký', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 't', cls: 'khdk-ds' }) +
        '</div>' +
        '<div data-z="form" hidden>' +
            pat.panel({ title: 'Kế hoạch đăng ký', icon: 'fa-plus', tools: CN_TOOLS, body: '<div data-z="fb"></div>', foot: CN_FOOT }) +
        '</div>' +
        '<div data-z="pq" hidden></div>';

    var zDs = q('[data-z="ds"]'), zForm = q('[data-z="form"]'), zPq = q('[data-z="pq"]');
    var fTg = q('[data-f="tg"]'), fQ = q('[data-f="q"]');
    ui.enhance(root);

    var form = K.taoForm(q('[data-z="fb"]'));
    var pq = K.phanQuyen(zPq, { onClose: function () { ui.swap(zPq, zDs); } });

    /* ---------- Danh sách --------------------------------------------------- */
    var page = 1, size = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, total = 0;
    var rows = [], tatCa = [], dangSua = null;

    function thoiGianKhop(r, tg) {
        return [r.DAOTAO_THOIGIANDAOTAO_NAM_ID, r.DAOTAO_THOIGIANDAOTAO_KY_ID, r.DAOTAO_THOIGIANDAOTAO_DOT_ID]
            .some(function (x) { return x && String(x) === String(tg); });
    }

    function load(p) {
        if (p) page = p;
        var tg = fTg.value;
        var host = q('[data-z="t"]');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'DKH_KeHoachDangKy/LayDanhSach', method: 'GET',
            strTuKhoa: (fQ.value || '').trim(),
            strNguoiThucHien_Id: '',
            pageIndex: tg ? 1 : page,
            pageSize: tg ? ui.PAGE_ALL : size
        }).then(function (r) {
            var d = Array.isArray(r.data) ? r.data : [];
            if (tg) {
                tatCa = d.filter(function (x) { return thoiGianKhop(x, tg); });
                total = tatCa.length;
                rows = tatCa.slice((page - 1) * size, page * size);
            } else {
                tatCa = d;
                rows = d;
                total = Number(r.pager) || d.length;
            }
            ve();
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách kế hoạch đăng ký'); });
    }

    function soVaNut(v, a, id) {
        return '<span class="ums-row ums-row--end ums-u-nowrap">' + esc(e(v)) + nut('fa-eye', 'Chi tiết', a, id) + '</span>';
    }

    function ve() {
        var n = q('[data-z="n"]');
        if (n) n.textContent = '(' + total + ')';
        var G1 = ['Thời gian bắt đầu'], G2 = ['Thời gian kết thúc'], G3 = ['Tình trạng đăng ký'];
        ui.table({
            el: q('[data-z="t"]'), rows: rows, empty: 'Không có kế hoạch đăng ký',
            page: {
                index: page, size: size, total: total,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(total / size)) { if (fTg.value) { page = p; rows = tatCa.slice((p - 1) * size, p * size); ve(); } else load(p); } },
                onSize: function (v) { size = v; if (fTg.value) { page = 1; rows = tatCa.slice(0, size); ve(); } else load(1); }
            },
            columns: [
                { title: 'Xem', cls: 'is-center', render: function (r) { return nut('fa-pen-to-square', 'Xem / sửa kế hoạch', 'xem', r.ID, 'edit'); } },
                { title: 'Mã kế hoạch', prop: 'MAKEHOACH', cls: 'is-center is-nowrap' },
                { title: 'Tên kế hoạch', prop: 'TENKEHOACH', width: '280px' },
                { title: 'Thiết đặt thêm xử lý lớp HP', cls: 'is-center', width: '110px', render: function (r) { return nut('fa-gear', 'Thiết đặt thêm xử lý lớp HP', 'xuly', r.ID); } },
                { title: 'Ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap', group: G1 },
                { title: 'Giờ', prop: 'GIODANGKYTRONGNGAYDAU', cls: 'is-center', group: G1 },
                { title: 'Phút', prop: 'PHUTDANGKYTRONGNGAYDAU', cls: 'is-center', group: G1 },
                { title: 'Ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap', group: G2 },
                { title: 'Giờ', prop: 'GIOKETTHUCTRONGNGAYCUOI', cls: 'is-center', group: G2 },
                { title: 'Phút', prop: 'PHUTKETTHUCTRONGNGAYCUOI', cls: 'is-center', group: G2 },
                { title: 'Chế độ đăng ký', prop: 'TRANGTHAI_TEN', cls: 'is-center', width: '160px' },
                { title: 'Mô hình đăng ký', prop: 'MOHINHDANGKY_TEN', cls: 'is-center', width: '140px' },
                { title: 'Tổng số SV', prop: 'SOLUONGDUKIEN', cls: 'is-right', group: G3 },
                { title: 'Số SV đã đăng ký', cls: 'is-right', group: G3, render: function (r) { return soVaNut(r.SOLUONGDADANGKY, 'dk', r.ID); } },
                { title: 'Số SV ko đăng ký', cls: 'is-right', group: G3, render: function (r) { return soVaNut(r.SOLUONGKHONGDANGKY, 'kdk', r.ID); } },
                { title: 'Tỷ lệ', prop: 'TYLE', cls: 'is-center', group: G3 },
                { title: 'Phân quyền cán bộ', cls: 'is-center', render: function (r) { return nut('fa-user-gear', 'Phân quyền cán bộ', 'pq', r.ID); } }
            ]
        });
    }

    function timDong(id) {
        for (var i = 0; i < tatCa.length; i++) if (String(tatCa[i].ID) === String(id)) return tatCa[i];
        return null;
    }

    /* ---------- Biểu mẫu ---------------------------------------------------- */
    function tieuDe(sua) {
        var t = zForm.querySelector('.ums-panel__title');
        t.innerHTML = '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Chỉnh sửa' : 'Thêm mới') + ' - Kế hoạch đăng ký';
        zForm.querySelector('[data-a="xoa"]').hidden = !sua;
        Array.prototype.forEach.call(zForm.querySelectorAll('[data-can-id]'), function (b) {
            b.disabled = !sua;
            b.title = sua ? '' : 'Lưu kế hoạch trước, rồi mở lại để phân công / chuyển dữ liệu';
        });
    }
    function moThem() {
        dangSua = null;
        form.reset();
        tieuDe(false);
        ui.swap(zDs, zForm);
    }
    function moSua(row) {
        dangSua = row;
        tieuDe(true);
        form.fill(row);
        ui.swap(zDs, zForm);
    }
    function dong() { dangSua = null; ui.swap(zForm, zDs); }

    function luu() {
        var v = form.values();
        var c = dangSua
            ? { action: 'NS_DKH_CHUNG2_MH/EjQgHgUgLyYKOB4KJAkuICIpBSAvJgo4', func: 'pkg_dangkyhoc_chung2.Sua_DangKy_KeHoachDangKy', strId: dangSua.ID }
            : { action: 'NS_DKH_CHUNG2_MH/FSkkLB4FIC8mCjgeCiQJLiAiKQUgLyYKOAPP', func: 'pkg_dangkyhoc_chung2.Them_DangKy_KeHoachDangKy', strId: '' };
        Object.keys(v).forEach(function (k) { c[k] = v[k]; });
        ums.api.call(c).then(function (r) {
            ui.toast(r.raw && r.raw.Id ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
            dong();
            load();
        }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch đăng ký'); });
    }

    function xoa() {
        if (!dangSua) return;
        var id = dangSua.ID;
        ui.confirm('Bạn có chắc chắn muốn xóa?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'DKH_KeHoachDangKy/Xoa', method: 'POST', strIds: id, strNguoiThucHien_Id: '' }).then(function (r) {
                /* Gốc: có Message thì hiện Message rồi dừng (không nạp lại, ở nguyên biểu mẫu) */
                if (r.message) { ui.toast(r.message, 'warn'); return; }
                ui.toast('Xóa dữ liệu thành công!', 'ok');
                dong();
                load();
            }).catch(function (err) { ums.api.handle(err, 'xoá kế hoạch đăng ký'); });
        });
    }

    /* ---------- Sự kiện ----------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b) || b.disabled) return;
        if (zPq.contains(b)) return;                          // vùng phân quyền tự xử lý
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        var khId = dangSua ? dangSua.ID : '';
        switch (a) {
            case 'search': load(1); break;
            case 'them': moThem(); break;
            case 'xem': { var r = timDong(id); if (r) moSua(r); else ui.toast('Vui lòng chọn đối tượng!', 'warn'); } break;
            case 'xuly': K.xuLyLHP(id, root); break;
            case 'dk': K.dsDangKy(id); break;
            case 'kdk': K.dsKhongDangKy(id); break;
            case 'pq': { var rr = timDong(id); if (rr) { pq.mo(rr); ui.swap(zDs, zPq); } } break;
            case 'dong': dong(); break;
            case 'luu': luu(); break;
            case 'xoa': xoa(); break;
            case 'pc-ct': K.phanCong('ct', khId); break;
            case 'pc-kh': K.phanCong('kh', khId); break;
            case 'pc-nks': K.phanCong('nks', khId); break;
            case 'chuyen': K.chuyenDuLieu(khId); break;
        }
    });
    fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); load(1); } });

    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (ds) { pat.fill(fTg, ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Tất cả học kỳ' }); })
        .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });

    load(1);
})();
