/* =========================================================================
   Cán bộ nhập hồ sơ sinh viên — phân quyền NGƯỜI DÙNG được nhập trường thông tin
   hồ sơ sinh viên, theo lớp
   Bản gốc: ApisCMS/Modules/phanquyen/html/canbonhaphososinhvien.html + script/canbonhaphososinhvien.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp · Năm nhập học · Khoa QL ·
   Trường thông tin · Chức năng phân quyền / Quyền cần thiết lập · từ khoá · Tìm kiếm / khối
   "Chọn trạng thái sinh viên") → khung "Danh sách" có hai nút "Phân quyền mở rộng",
   "Phân quyền" và bảng CÂY LỚP × NGƯỜI DÙNG (ums.pq.luoi, ums.pq.daoTao — script/_pq.js);
   hộp "Phân quyền" (#myModalPhanQuyen): Hành động (chọn nhiều) + bảng trường thông tin.
   Bản gốc chép từ sinhvientunhap (git diff: thêm cột người dùng, ô trường thông tin, hộp mở rộng).

   Lời gọi (chép nguyên):
       nạp ô    như sinhvientunhap (ums.pq.daoTao) · LayDSChucNangCanPhanQuyen · LayDSHanhDongTheo
                (strPhanQuyen_ChucNang_Id) — cùng đổ vào ô "Hành động" của hộp mở rộng
                SV_HoSoHocVien_Quyen_MH … pkg_hosohocvien_quyen.LayDSTruongThongTinTheoPhamVi POST
                    strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id (chuỗi "a,b") → ô Trường thông tin
                    VÀ bảng của hộp mở rộng (NHOM, TEN). Nạp lúc mở màn và khi đổi Hệ / Khoá như gốc.
       cột      CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang GET → "FULLNAME - NAME"
       cây      CMS_PhanQuyenDuLieu/LayDSCauTrucQuyenCBNhapHoSoSV GET (tham số như sinhvientunhap)
       từng lá  CMS_PhanQuyenDuLieu/LayDSQuyenNhanSuNhapHoSoSV GET strChucNang_Id, strPhanQuyen_ChucNang_Id,
                strDaoTaoLopQuanLy_Id (= ID LÁ), strTruongThongTin_Id, strHanhDong_Id
       Phân quyền       Them_PhanQuyen_DuLieu (strToHopBoDuLieuQuyen = ID LÁ + ID TRƯỜNG THÔNG TIN,
                        strNguoiDung_Id = ID CỘT) · Xoa_PhanQuyen_DuLieu1 (strIds = QUYEN_ID)
       Phân quyền mở rộng  mỗi Hành động × mỗi trường thông tin đánh dấu × mỗi ô đổi:
                        Them_PhanQuyen_DuLieu (strHanhDong_Id = hành động của hộp,
                        strToHopBoDuLieuQuyen = ID LÁ + ID trường) ·
                        CMS_PhanQuyenDuLieu_MH … pkg_chung_phanquyendulieu.Xoa_PhanQuyen_DuLieu
                        (strLoaiQuyen_Id, strHanhDong_Id, strToHopBoDuLieuQuyen, strNguoiDung_Id) — xoá theo tổ hợp
   Giữ như bản gốc (nghi ngờ): không chọn Trường thông tin thì strToHopBoDuLieuQuyen chỉ còn ID lá.
   Cố ý bỏ: resetCombobox (gỡ mục "Tất cả" khi chọn thêm mục — bản mới ô chọn nhiều không có mục
   đó); các nhánh dropSearch_NguoiThu_IHD (ô không tồn tại).
   Khác gốc (lỗi rõ):
     · Bộ lọc của lời gọi từng lá và lúc Phân quyền lấy theo lúc bấm Tìm kiếm; chưa chọn chức
       năng (và quyền, với nút Phân quyền) thì chặn.
     · Hộp mở rộng: chưa chọn hành động hoặc trường thông tin thì nhắc (gốc: arrHanhDong null →
       TypeError, hộp đã đóng mà không làm gì).
   Cha → con: Hệ → Khoá → CT → Lớp (khoá), Chức năng phân quyền → Quyền cần thiết lập (khoá).
   Trường thông tin nạp theo Hệ + Khoá (nhiều cha, lọc tuỳ chọn) — không khoá.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, pq = ums.pq;
    var root = document.getElementById('pq-canbonhaphososinhvien');
    if (!root) return;

    var PQ = 'CMS_PhanQuyenDuLieu/';
    var dsTT = [], dsHD = [];

    root.innerHTML = pat.page('Cán bộ nhập hồ sơ sinh viên', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            pq.hang(pq.daoTaoHtml() + pq.sel('tt', 'Chọn trường thông tin') + pq.sel('cn', 'Chọn chức năng phân quyền'), true) +
            pq.hang(pq.sel('quyen', 'Chọn quyền cần thiết lập') + pq.inp('q', 'Nhập từ khóa tìm kiếm') + pq.nutTim()) +
            pq.trangThaiHtml() }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-rectangle-history-circle-user', flush: true, zone: 'bang',
            tools: ui.btn('save', { text: 'Phân quyền mở rộng', mod: 'out-primary', icon: 'fa-user-gear', attr: { 'data-a': 'morong' } }) +
                ui.btn('save', { text: 'Phân quyền', attr: { 'data-a': 'phanquyen' } }) });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    var dang = null;

    function napTruongThongTin() {
        ums.api.call({ action: 'SV_HoSoHocVien_Quyen_MH/DSA4BRIVMzQuLyYVKS4vJhUoLxUpJC4RKSAsFygP',
            func: 'pkg_hosohocvien_quyen.LayDSTruongThongTinTheoPhamVi', silent: true,
            strDaoTao_HeDaoTao_Id: dt.v('he'), strDaoTao_KhoaDaoTao_Id: dt.v('khoa'), strNguoiThucHien_Id: pq.uid() })
            .then(function (r) { dsTT = pq.arr(r.data); pat.fill(f('tt'), dsTT, { head: 'Chọn trường thông tin' }); })
            .catch(function (err) { ums.api.handle(err, 'trường thông tin'); });
    }
    var dt = pq.daoTao(root, { onDoi: function (k) { if (k === 'he' || k === 'khoa') napTruongThongTin(); } });
    napTruongThongTin();

    var L = pq.luoi(root.querySelector('[data-z="bang"]'), {
        tieuDe: 'Thông tin lớp được thiết lập quyền',
        tenCot: pq.tenNguoi,
        dong: function (id) {
            return { action: PQ + 'LayDSQuyenNhanSuNhapHoSoSV', strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn,
                strNguoiThucHien_Id: pq.uid(), strDaoTaoLopQuanLy_Id: id, strTruongThongTin_Id: dang.tt, strHanhDong_Id: dang.quyen };
        }
    });
    L.xoaTrang('Chọn chức năng phân quyền, quyền cần thiết lập rồi bấm Tìm kiếm');

    pq.chucNang(f('cn'), { action: PQ + 'LayDSChucNangCanPhanQuyen', strChucNang_Id: pq.cn(), strUngDung_Id: pq.vt(), strNguoiThucHien_Id: pq.uid() });
    jQuery(f('cn')).on('select2:select', function () {
        pq.hanhDong(f('quyen'), v('cn') ? { action: PQ + 'LayDSHanhDongTheo', strUngDung_Id: pq.vt(),
            strPhanQuyen_ChucNang_Id: v('cn'), strNguoiThucHien_Id: pq.uid() } : null).then(function (rows) { dsHD = rows; });
    });
    pat.chain([f('cn'), f('quyen')]);

    function tim() {
        dang = { cn: v('cn'), quyen: v('quyen'), tenQuyen: pq.chu(f('quyen')), tt: v('tt'), q: (f('q').value || '').trim(), loc: dt.thamSo() };
        L.xoaTrang('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: PQ + 'LayDSNguoiDungTheoChucNang', method: 'GET', strChucNang_Id: pq.cn(),
            strPhanQuyen_ChucNang_Id: dang.cn, strNguoiThucHien_Id: pq.uid() }).then(function (rc) {
            var l = dang.loc;
            return ums.api.call({ action: PQ + 'LayDSCauTrucQuyenCBNhapHoSoSV', method: 'GET', strTuKhoa: dang.q,
                strChucNang_Id: pq.cn(), strPhanQuyen_ChucNang_Id: dang.cn, strKhoaQuanLy_Id: l.strKhoaQuanLy_Id,
                strHeDaoTao_Id: l.strHeDaoTao_Id, strKhoaDaoTao_Id: l.strKhoaDaoTao_Id, strChuongTrinh_Id: l.strChuongTrinh_Id,
                strLopQuanLy_Id: l.strLopQuanLy_Id, strNamNhapHoc: l.strNamNhapHoc, strTrangThaiNguoiHoc_Id: l.strTrangThaiNguoiHoc_Id,
                strNguoiThucHien_Id: pq.uid() })
                .then(function (r) { return L.ve(rc.data, r.data, dang.tenQuyen); });
        }).catch(function (err) { L.loi(err.message); ums.api.handle(err, 'cấu trúc phân quyền'); });
    }

    function them(x, hd, tt) {
        return { action: PQ + 'Them_PhanQuyen_DuLieu', strId: '', dHieuLuc: 1, strLoaiQuyen_Id: dang.cn,
            strNgayBatDau: '', strNgayKetThuc: '', strHanhDong_Id: hd, strUngDung_Id: pq.vt(),
            strToHopBoDuLieuQuyen: x.dong + tt, strNguoiDung_Id: x.cot, strMoTa: '',
            strNguoiThucHien_Id: pq.uid(), strChucNang_Id: pq.cn() };
    }

    function phanQuyen() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        if (!dang.cn || !dang.quyen) return ui.toast('Chọn chức năng phân quyền và quyền cần thiết lập rồi Tìm kiếm lại', 'warn');
        pq.phanQuyen(L, {
            them: function (x) { return them(x, dang.quyen, dang.tt); },
            xoa: function (x) { return { action: PQ + 'Xoa_PhanQuyen_DuLieu1', strIds: x.quyen, strNguoiThucHien_Id: pq.uid() }; },
            sauLuu: tim
        });
    }

    /* Hộp "Phân quyền" mở rộng (#myModalPhanQuyen) */
    function moRong() {
        if (!dang) return ui.toast('Bấm Tìm kiếm để nạp danh sách trước', 'warn');
        if (!dang.cn) return ui.toast('Chọn chức năng phân quyền rồi Tìm kiếm lại', 'warn');
        if (!pq.kiem(L)) return;
        var dlg = ui.dialog({
            title: 'Phân quyền', icon: 'fa-user-gear', size: 'lg',
            body: '<div class="pq-hoi">' + ui.field('Hành động',
                '<select class="ums-select" data-f="hdmr" multiple data-ph="Chọn quyền cần thiết lập"></select>', { inline: true }) + '</div>' +
                '<div data-z="ttmr"></div>',
            buttons: [{ text: 'Phân quyền', kind: 'save', onClick: function (d) { luuMoRong(d); return false; } }]
        });
        var sel = dlg.body.querySelector('[data-f="hdmr"]');
        pat.fill(sel, dsHD, { name: 'HANHDONG_TEN' });
        ui.table({ el: dlg.body.querySelector('[data-z="ttmr"]'), rows: dsTT, empty: 'Không có trường thông tin',
            tableCls: 'ums-table--lined ums-gtable',
            columns: [
                { title: 'Nhóm', prop: 'NHOM' },
                { title: 'Tên', prop: 'TEN' },
                { head: '<input type="checkbox" data-ttall title="Chọn tất cả">', cls: 'is-center', width: '56px',
                    render: function (r) { return '<input type="checkbox" data-tt="' + ui.esc(r.ID) + '">'; } }
            ] });
        pq.gopDoc(dlg.body.querySelector('table'), 1);   // gộp cột Nhóm (actionRowSpan cột 1)
        dlg.body.addEventListener('change', function (ev) {
            if (ev.target.matches && ev.target.matches('[data-ttall]')) {
                Array.prototype.forEach.call(dlg.body.querySelectorAll('input[data-tt]'), function (c) { c.checked = ev.target.checked; });
            }
        });
        ui.enhance(dlg.body);
    }

    function luuMoRong(dlg) {
        var d = pq.kiem(L);
        if (!d) return;
        var hd = jQuery(dlg.body.querySelector('[data-f="hdmr"]')).val() || [];
        var tt = Array.prototype.filter.call(dlg.body.querySelectorAll('input[data-tt]'), function (c) { return c.checked; })
            .map(function (c) { return c.getAttribute('data-tt'); });
        if (!hd.length) return ui.toast('Chọn ít nhất một hành động', 'warn');
        if (!tt.length) return ui.toast('Chọn ít nhất một trường thông tin', 'warn');
        var nThem = hd.length * tt.length * d.them.length, nXoa = hd.length * tt.length * d.xoa.length;
        ui.confirm('Bạn có chắc chắn thêm ' + nThem + ' và hủy quyền ' + nXoa + '?', { title: 'Phân quyền', ok: 'Đồng ý' }).then(function (yes) {
            if (!yes) return;
            dlg.close();
            var calls = [];
            hd.forEach(function (h) {
                tt.forEach(function (t) {
                    d.them.forEach(function (x) { calls.push(them(x, h, t)); });
                    d.xoa.forEach(function (x) {
                        calls.push({ action: 'CMS_PhanQuyenDuLieu_MH/GS4gHhEpIC8QNDgkLx4FNA0oJDQP', func: 'pkg_chung_phanquyendulieu.Xoa_PhanQuyen_DuLieu',
                            strLoaiQuyen_Id: dang.cn, strHanhDong_Id: h, strToHopBoDuLieuQuyen: x.dong + t, strNguoiDung_Id: x.cot,
                            strNguoiThucHien_Id: pq.uid() });
                    });
                });
            });
            pq.chay(calls, tim);
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'phanquyen') phanQuyen();
        else if (a === 'morong') moRong();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
