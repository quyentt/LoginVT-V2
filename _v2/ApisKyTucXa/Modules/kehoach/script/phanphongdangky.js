/* =========================================================================
   Phân phòng đăng ký — Ký túc xá / Kế hoạch
   Bản gốc: ApisKyTucXa/Modules/kehoach/html/phanphongdangky.html + script/phanphongdangky.js (744 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, tham số chép nguyên văn):
       KTX_KeHoachDangKy/LayDanhSach           GET   ô chọn kế hoạch (ums.ktxKH.keHoach — gốc pageSize 10000)
       KTX_ToaNha/LayDanhSach                  GET   dãy ô đánh dấu "Phân theo tòa nhà" (ums.ktx.toaNha; gốc pageSize_default 10 — xem Khác gốc)
       KTX_Phong/LayDanhSach                   GET   ô chọn nhiều "Phân theo phòng" — mọi phòng, hiện MA (ums.ktx.phong pageSize 100000)
       KTX_PhanCongToaNhaDangKy/LayDanhSach    GET   strTuKhoa "", strKTX_KeHoachDangKy_Id, strNguoiThucHien_Id "", pageIndex 1, pageSize 10000 — cây cấp 1: toà nhà đã phân
       KTX_PhanCongPhongDangKy/LayDanhSach     GET   strTuKhoa "", strKTX_KeHoachDangKy_Id, strKTX_ToaNha_Id, strKTX_Phong_Id "", pageIndex 1, pageSize 1000000 — cây cấp 2: phòng của toà (mỗi toà một lời gọi như gốc)
       KTX_PhanCongPhongDangKy/ThemMoi         POST  strId "", strKTX_KeHoachDangKy_Id, strKTX_ToaNha_Id = MẢNG id toà đánh dấu, strKTX_Phong_Id = MẢNG id phòng chọn (một lời gọi như gốc)
       KTX_PhanCongPhongDangKy/Xoa             POST  strId
   Cột trả về: cấp 1 KTX_TOANHA_ID / _TEN / _MA; cấp 2 ID, KTX_PHONG_ID / _TEN / _MA, KTX_TOANHA_TEN, NGAYVAO, NGAYRA.
   Bố cục bản gốc: HAI cột — trái: ô chọn kế hoạch + ô từ khoá, "Danh sách tòa nhà" dạng cây (toà → phòng đã phân); phải: khung
   "Thông tin" có nút Thêm mới ↔ biểu mẫu "Kế hoạch phân phòng đăng ký" (Kế hoạch đăng ký, Phân theo tòa nhà = dãy ô đánh dấu,
   Phân theo phòng = ô chọn nhiều) + Lưu. Ở đây: ums.pat.master (cột trái kiểu cây) + ums.pat.formTrang cho biểu mẫu.

   Giữ như bản gốc: Thêm gửi MỘT lời gọi với hai mảng id; ô phòng là MỌI phòng (không lọc theo toà đánh dấu), hiện MA.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Cây cấp 2: gốc in lại TÊN TOÀ cho từng phòng (genTreeJs_PhanCongPhong đọc KTX_TOANHA_TEN) → ở đây in tên phòng (KTX_PHONG_TEN / _MA).
     · Dãy toà nhà: gốc gọi pageSize_default (10) → chỉ 10 toà đầu; ở đây lấy hết.
     · Xoá: gốc gắn .btnDelete cho #tblPPDK KHÔNG có trong HTML (không bấm được) → ở đây nút Xoá trên từng phòng của cây (Xoa strId = ID dòng phân công).
     · Ô kế hoạch của biểu mẫu đặt sẵn = kế hoạch đang chọn bên trái; bắt buộc chọn kế hoạch và ít nhất một toà nhà hoặc phòng (gốc gửi rỗng).
     · Ô từ khoá bên trái: gốc đọc ô "" (không gửi gì) → ở đây lọc cây theo tên toà / phòng ngay trên máy.
   Cố ý bỏ: khung "Chi tiết hội đồng xét chức danh" + update_PPDK (CapNhat gửi strChucDanhDeXuat_Id…) + modal_nhansu + addHTMLinto_tblNhanSu
     (chép từ màn hội đồng xét chức danh, mã chết); bấm nút cây gọi me.getList_Param (không có); btnExtend_Search bật .box-sub-search (không có);
     dòng "Bạn có 3 sản phẩm mới được xác nhận" (chữ mẫu).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, K = ums.ktx, KH = ums.ktxKH, e = KH.e;
    var root = document.getElementById('ktx-phanphongdangky');
    if (!root) return;

    var PP = 'KTX_PhanCongPhongDangKy/';
    var st = { kh: '', toa: [], phong: {}, ft: null };
    function loi(viec) { return function (err) { ums.api.handle(err, viec); }; }

    var m = pat.master({
        el: root, title: 'Phân phòng đăng ký',
        actions: ui.btn('add', { text: 'Thêm mới', attr: { 'data-a': 'them' } }),
        side: {
            title: 'Danh sách tòa nhà', icon: 'fa-building', search: 'Nhập từ khóa tìm kiếm', kieu: 'danhmuc',
            filter: '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="--Chọn kế hoạch đăng ký--"><option value="">--Chọn kế hoạch đăng ký--</option></select></div>'
        },
        main: { title: 'Thông tin', icon: 'fa-circle-info' }
    });
    var selKH = m.el.querySelector('[data-f="kh"]');
    KH.keHoach().then(function (rs) {
        pat.fill(selKH, rs, { name: KH.tenKH, head: '--Chọn kế hoạch đăng ký--' });
        if (!selKH.value && rs.length) { selKH.value = rs[0].ID; if (window.jQuery) jQuery(selKH).trigger('change.select2'); }
        st.kh = selKH.value || '';
        tai();
    });
    if (window.jQuery) jQuery(selKH).on('change', function () { st.kh = selKH.value || ''; tai(); });
    pat.cotTrai(m, { tai: tai, tuTaiLoc: false });
    if (m.search) m.search.addEventListener('input', veCay);
    m.mainBody.innerHTML = ui.empty('Kế hoạch phân phòng đăng ký: chọn kế hoạch ở cột trái để xem toà nhà / phòng đã phân, bấm Thêm mới để phân thêm.', 'fa-circle-info');

    /* ---------- Cột trái: cây toà nhà → phòng đã phân cho kế hoạch ---------- */
    function tai() {
        if (!st.kh) { st.toa = []; st.phong = {}; m.sideCount.textContent = ''; m.sideBody.innerHTML = ui.empty('Chọn kế hoạch đăng ký'); return Promise.resolve(); }
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'KTX_PhanCongToaNhaDangKy/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_KeHoachDangKy_Id: st.kh,
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 }).then(function (r) {
            st.toa = KH.rows(r); st.phong = {};
            m.sideCount.textContent = '(' + st.toa.length + ')';
            return Promise.all(st.toa.map(function (t) {
                return ums.api.call({ action: PP + 'LayDanhSach', method: 'GET', silent: true, strTuKhoa: '', strKTX_KeHoachDangKy_Id: st.kh,
                    strKTX_ToaNha_Id: t.KTX_TOANHA_ID, strKTX_Phong_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
                }).then(function (x) { st.phong[t.KTX_TOANHA_ID] = KH.rows(x); }, function () { st.phong[t.KTX_TOANHA_ID] = []; });
            }));
        }).then(veCay).catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách tòa nhà đã phân'); });
    }
    function veCay() {
        var q = (m.search ? m.search.value : '').trim().toLowerCase();
        function khop(s) { return !q || String(s || '').toLowerCase().indexOf(q) >= 0; }
        var h = st.toa.map(function (t) {
            var ps = (st.phong[t.KTX_TOANHA_ID] || []).filter(function (p) { return khop(t.KTX_TOANHA_TEN) || khop(p.KTX_PHONG_TEN) || khop(p.KTX_PHONG_MA); });
            if (q && !khop(t.KTX_TOANHA_TEN) && !ps.length) return '';
            return '<li><button type="button" class="ums-master__item" data-toa="' + esc(t.KTX_TOANHA_ID) + '" title="' + esc(e(t.KTX_TOANHA_MA)) + '">' +
                '<span class="ums-master__item__main">' + esc(e(t.KTX_TOANHA_TEN)) + '</span>' +
                '<span class="ums-master__item__sub">' + ps.length + ' phòng</span></button>' +
                (ps.length ? '<ul>' + ps.map(function (p) {
                    return '<li><div class="ums-master__item" data-pc="' + esc(p.ID) + '"><span class="ums-master__item__main">' + esc(e(p.KTX_PHONG_TEN) || e(p.KTX_PHONG_MA)) +
                        (e(p.NGAYVAO) ? '<span class="ums-master__item__sub">' + esc(e(p.NGAYVAO)) + (e(p.NGAYRA) ? ' – ' + esc(e(p.NGAYRA)) : '') + '</span>' : '') + '</span>' +
                        '<span class="ums-master__item__act">' + ui.iconBtn('del', p.ID) + '</span></div></li>';
                }).join('') + '</ul>' : '') + '</li>';
        }).join('');
        m.sideBody.innerHTML = h ? '<ul>' + h + '</ul>' : ui.empty(q ? 'Không có toà / phòng khớp từ khoá' : 'Kế hoạch chưa phân toà nhà / phòng nào');
    }
    m.sideBody.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-act="del"]');
        if (!b || !m.sideBody.contains(b)) return;
        var id = b.getAttribute('data-id');
        if (!id) return;
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: PP + 'Xoa', method: 'POST', strId: id }).then(function () { ui.toast('Xóa thành công!', 'ok'); tai(); }, loi('xoá phân phòng'));
        });
    });

    /* ---------- Biểu mẫu "Kế hoạch phân phòng đăng ký" (thay chỗ khung phải) ---------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="them"]');
        if (b && root.contains(b)) moThem();
    });
    function moThem() {
        if (st.ft && !st.ft.closed) return;
        var ft = st.ft = pat.formTrang({ host: m.mainBody, title: 'Kế hoạch phân phòng đăng ký', icon: 'fa-pen-to-square', cols: 1,
            body: ui.field('Kế hoạch đăng ký', '<select class="ums-select" data-k="kh" data-ph="--Chọn kế hoạch đăng ký--"><option value="">--Chọn kế hoạch đăng ký--</option></select>') +
                  '<div class="ums-field"><label class="ums-field__label">Phân theo tòa nhà</label><div data-k="toa"></div></div>' +
                  ui.field('Phân theo phòng', '<select class="ums-select" data-k="phong" multiple data-s2 data-ph="--Chọn phòng--"></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (api) { luu(api); return false; } }],
            onClose: function () { st.ft = null; }
        });
        var b = ft.body, sKH = b.querySelector('[data-k="kh"]'), sPhong = b.querySelector('[data-k="phong"]'), checks = null;
        KH.keHoach().then(function (rs) { pat.fill(sKH, rs, { name: KH.tenKH, head: '--Chọn kế hoạch đăng ký--' }); if (st.kh) { sKH.value = st.kh; if (window.jQuery) jQuery(sKH).trigger('change.select2'); } });
        checks = pat.checks(b.querySelector('[data-k="toa"]'), K.toaNha(), { all: 'Tất cả', cols: 4, name: 'TEN', empty: 'Chưa có tòa nhà nào' });
        K.phong({ pageSize: 100000 }).then(function (kq) { pat.fill(sPhong, kq.rows, { name: 'MA' }); ui.enhance(b); }).catch(loi('danh sách phòng'));
        function luu(api) {
            var kh = pat.val(sKH), toa = checks ? checks.ids() : [], phong = window.jQuery ? (jQuery(sPhong).val() || []) : [];
            if (!kh) { ui.toast('Vui lòng chọn kế hoạch đăng ký', 'warn'); return; }
            if (!toa.length && !phong.length) { ui.toast('Vui lòng đánh dấu tòa nhà hoặc chọn phòng cần phân', 'warn'); return; }
            ums.api.call({ action: PP + 'ThemMoi', method: 'POST', strId: '', strKTX_KeHoachDangKy_Id: kh, strKTX_ToaNha_Id: toa, strKTX_Phong_Id: phong }).then(function () {
                ui.toast('Thêm mới thành công!', 'ok');
                api.close();
                if (kh !== st.kh) { selKH.value = kh; st.kh = kh; if (window.jQuery) jQuery(selKH).trigger('change.select2'); }
                tai();
            }, loi('phân phòng đăng ký'));
        }
    }
})();
