/* =========================================================================
   klgd — Tuỳ chỉnh khối lượng (tuychinhkhoiluong / qlklgd_tuychinhkhoiluong): ums.klgd.tuyChinh(root, ql)
   Một cột: thanh lọc (K.boLoc) + lưới NHẬP 22–23 cột, "Cập nhật" gửi từng dòng ĐÃ SỬA. Đổi ô lọc thì XOÁ bảng, bấm
   "Danh sách" mới nạp (như gốc).
   ---------------------------------------------------------------------------
   Bản cũ TKGG_KLGD: lọc Năm · Học kỳ (tĩnh) · Đợt · Loại tiết (tĩnh → strHTQT) · Kiểu lớp (tĩnh → strKieuLop) · Hệ · Bộ môn · Giảng viên
     Danh sách GetKhoiLuongTKBTuyChinh { strNhomMonHocId, StaffId, NamHoc, strHocKy "<năm>_<kỳ>", strDotHoc, strHeDaoTaoId, strKieuLop,
       strHTQT, strNguoiDung_Id } — khoá dòng ID. Hình thức giảng GetHinhThucGiang (ID/NAME).
     Cập nhật UpdateKhoiLuongTKBNienChe { strID, StaffID, NamHoc, HocKy, strTenMon, strTenLop, strSoSinhVien, strTongSoTiet: SOTIET,
       strThoiKhoaBieu: LICHHOC, strHeDaoTao: IDHEDAOTAO, strSoTietTheoKeHoach: SOTIET, strDVHT, strSoNgay, strHinhThucGiangDay,
       strTIETLYTHUYET_DC … strTIETTHUCHANH_DC, strBTL, strTKMH, strSoTien, strTrongTruong, strLoai: LOAITIET, strSoTietHDMotSinhVien,
       strHeSoTinChi, strChucNang_Id, strUserId }
     Xoá XoaKhoiLuong (POST) { strNamHoc, strHocKy, strDotHoc, strKhoiLuongThoiKhoaBieuId: id nối phẩy, strNguoiDung_Id } · báo cáo.
   Bản QL TKGG_QLKLGD: lọc Năm · Học kỳ · Đợt · CSĐT · Kiểu lớp (ListDS_HinhThucHoc) · Hệ · Bộ môn · Học phần · Giảng viên
     Danh sách GetDanhSachPhanCong { strBoMonId, strStaffId, strHocKy, strDotHocId, strHeDaoTaoId, strCoSoDaoTaoId, strKhoaHocId '',
       strLoaiLopId, strHocPhanId, strNguoiThucHienId } — khoá KHOILUONGTHOIKHOABIEUID (bỏ cột Bộ môn).
     Cập nhật như trên với strID = KHOILUONGTHOIKHOABIEUID, HocKy = HOCKYFULL, strTenMon = TENHOCPHAN, strTongSoTiet / strThoiKhoaBieu /
       strSoTietTheoKeHoach = '', strHeDaoTao = DAOTAO_HEDAOTAO_ID, strDVHT = HOCTRINH, strIDHINHTHUCHOC (thay strLoai),
       strNguoiThucHienId (thay strUserId).
     Xoá / "Cập nhập phân bổ tiết theo CTĐT": MỖI dòng một lời gọi POST XoaKhoiLuong / CapNhatPhanBoTiet { strNamHoc, strHocKy,
       strDotHoc, strKhoiLuongThoiKhoaBieuId, strLopHocPhanId: IDLOPHOCPHAN } — cả hai lấy dòng đánh dấu ở cột cuối.
   Khác bản gốc (ghi ở can-quyet.js):
     · ql: ô Hình thức giảng gốc chọn sẵn theo cột ID KHÔNG có → ô nào cũng trống, bấm Cập nhật là XOÁ hình thức giảng của mọi
       dòng → nay chọn sẵn đúng dòng.
     · Sửa riêng "Hệ số TC" gốc không lưu (thiếu trong phép so) → nay lưu. TRONGTRUONG rỗng gốc bị coi là "đã sửa" mỗi lần → nay so đúng.
     · Chờ nạp xong danh mục hình thức giảng rồi mới vẽ bảng (gốc vẽ trước → ô trống → gửi rỗng).
     · Cập nhật / Xoá tuần tự, báo đúng dòng lỗi (gốc gọi đồng bộ, báo "thành công" trước khi xong, thông điệp thành công bị coi là lỗi).
     · ql: cột cuối đổi tên "Chọn" (gốc "Xóa" nhưng dùng cho cả nút Cập nhập phân bổ tiết). KIEUHOC gốc đọc mà không gửi — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;
    var TIET = [['TIETLYTHUYET_DC', 'Lý thuyết'], ['TIETBAITAP_DC', 'Bài tập'], ['TIETTHAOLUAN_DC', 'Thảo luận'], ['TIETTHINGHIEM_DC', 'Thí nghiệm'],
        ['TIETTHUCHANH_DC', 'Thực hành'], ['BTL', 'BTL'], ['TKMH', 'TKMH'], ['SONGAY', 'Số ngày']];

    /* nhap = true: qlklgd_nhapkhoiluong (xem _nhapkl.js) — cùng lưới bản QL, bỏ cột Hệ số TC, nguồn GetKhoiLuongNhap,
       lưu UpdateKhoiLuong_Nhap, xoá XoaKhoiLuong_Nhap, thêm "Thêm mới" (biểu mẫu Thêm lớp, trong trang) và "Import khối lượng". */
    K.tuyChinh = function (root, ql, nhap) {
        if (nhap) ql = true;
        var ctl = K.ctl(ql), KHOA = ql ? 'KHOILUONGTHOIKHOABIEUID' : 'ID';
        var keys = nhap ? ['nam', 'hk', 'dot', 'csdt', 'loaiLop', 'he', 'bm', 'gv']
            : ql ? ['nam', 'hk', 'dot', 'csdt', 'loaiLop', 'he', 'bm', 'hocPhan', 'gv'] : ['nam', 'hk', 'dot', 'loaiTiet', 'kieuLop', 'he', 'bm', 'gv'];
        var L = K.boLoc(root, keys, ql, function () { rows = []; ve.coDuLieu = false; ve(); });
        var nutDau = nhap ? ui.btn('add', { attr: { 'data-a': 'them' } }) + ui.btn('save', { text: 'Import khối lượng', mod: 'out-primary', icon: 'fa-file-excel', attr: { 'data-a': 'import' } })
            : ql ? ui.btn('save', { text: 'Cập nhập phân bổ tiết theo CTĐT', mod: 'out-primary', icon: 'fa-arrows-rotate', attr: { 'data-a': 'phanbo' } }) : '<span data-z="bc"></span>';
        root.innerHTML = pat.page(nhap ? 'Nhập khối lượng' : 'Tuỳ chỉnh khối lượng', nutDau +
            ui.xoaChon('input[data-ck]', { attr: { 'data-a': 'xoa' } }) + ui.btn('save', { text: 'Cập nhật', attr: { 'data-a': 'capnhat' } })) +
            L.html({ searchText: 'Danh sách' }) +
            pat.panel({ title: 'Tổng hợp khối lượng', icon: 'fa-table-cells', flush: true, count: 'dem', zone: 'bang' });
        L.gan();
        var v = L.v, bang = root.querySelector('[data-z="bang"]');
        var rows = [], htg = null;
        var htgP = K.g(ctl + 'GetHinhThucGiang', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), silent: true })
            .then(function (r) { htg = K.arr(r.data); }).catch(function (err) { htg = []; ums.api.handle(err, 'hình thức giảng'); });

        function o(k, i, val) { return '<input class="ums-input ums-input--sm kl-so" data-o="' + k + '" data-i="' + i + '" value="' + esc(e(val)) + '" autocomplete="off">'; }
        function ve() {
            if (!rows.length && !ve.coDuLieu) { bang.innerHTML = ui.empty('Chọn điều kiện rồi bấm Danh sách', 'fa-filter'); root.querySelector('[data-z="dem"]').textContent = ''; return; }
            var cot = [{ title: ql ? 'Cơ sở đào tạo' : 'Loại', render: function (r) { return esc(e(ql ? r.TENCOSODAOTAO : r.LOAI)); } }];
            if (!ql) cot.push({ title: 'Bộ môn', prop: 'BOMON' });
            cot.push({ title: 'Tên học phần', render: function (r) {
                    if (nhap) return esc(e(r.TENHOCPHAN) + '_' + e(r.HOCTRINH));
                    return esc(e(ql ? r.TENHOCPHAN : r.TENMON)) + '_<span class="kl-do">' + esc(e(r.MAHOCPHAN) + '_' + e(ql ? r.HOCTRINH : r.DVHT)) + '</span>';
                } },
                { title: 'Tên lớp HP/Lớp quản lý', render: function (r) {
                    var t = e(r.TACHTHEOSINHVIEN_TIET);
                    return esc(e(r.TENLOP)) + (t === 'SV' ? ' <span class="kl-do">(Tách theo SV)</span>' : t === 'TIET' ? ' <span class="kl-do">(Tách theo tiết)</span>' : '');
                } },
                { title: 'Kiểu lớp', render: function (r) { return esc(e(ql ? r.TENHINHTHUCHOC : r.LOAILOPHOCPHAN)); } },
                { title: 'Sỹ số', render: function (r, i) { return o('SOSV', i, r.SOSV); } },
                { title: 'Hệ đào tạo', render: function (r) { return esc(e(ql ? r.TENHEDAOTAO : r.HEDAOTAO)); } },
                { title: 'Học kỳ', render: function (r) { return esc(e(ql ? r.HOCKYDOTHOCFULL : r.HOCKY)); } },
                { title: 'Hệ số TC', render: function (r, i) { return o('HESOTINCHI', i, r.HESOTINCHI); } });
            if (nhap) cot.pop();
            TIET.forEach(function (t) { cot.push({ title: t[1], render: function (r, i) { return o(t[0], i, r[t[0]]); } }); });
            cot.push({ title: 'Hình thức giảng', width: '160px', render: function (r, i) {
                    return '<select class="ums-select ums-input--sm" data-o="HTG" data-i="' + i + '"><option value="">Chọn hình thức giảng</option>' +
                        (htg || []).map(function (x) { return '<option value="' + esc(e(x.ID)) + '"' + (e(x.ID) === e(r.HINHTHUCGIANGDAYID) ? ' selected' : '') + '>' + esc(e(x.NAME)) + '</option>'; }).join('') + '</select>';
                } },
                { title: 'Giảng viên', render: function (r) { return esc(e(ql ? r.HOTENMASO : r.HOTEN)); } },
                { title: 'Trong trường', cls: 'is-center', render: function (r, i) { return '<input type="checkbox" data-o="TT" data-i="' + i + '"' + (e(r.TRONGTRUONG) === '1' ? ' checked' : '') + '>'; } },
                { title: 'Số tiết hoặc số SV', render: function (r, i) { return o('SOTIETHUONGDANMOTSV', i, r.SOTIETHUONGDANMOTSV); } },
                { head: '<input type="checkbox" data-a="all" title="Chọn tất cả"> ' + (ql && !nhap ? 'Chọn' : 'Xóa'), cls: 'is-center', width: '64px',
                    render: function (r, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
            ui.table({ el: bang, rows: rows, columns: cot, empty: 'Không có khối lượng' });
            root.querySelector('[data-z="dem"]').textContent = '(' + rows.length + ')';
        }
        function tai() {
            if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            bang.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            var dotTen = L.F('dot').selectedIndex > 0 ? L.F('dot').options[L.F('dot').selectedIndex].text : '';
            var p = nhap ? { action: ctl + 'GetKhoiLuongNhap', strBoMonId: v('bm'), strStaffId: v('gv'), strHocKy: v('hk'), strDotHocId: v('dot'), strDotHoc: dotTen,
                    strHeDaoTaoId: v('he'), strCoSoDaoTaoId: v('csdt'), strKhoaHocId: '', strNguoiThucHienId: K.uid() }
                : ql ? { action: ctl + 'GetDanhSachPhanCong', strBoMonId: v('bm'), strStaffId: v('gv'), strHocKy: v('hk'), strDotHocId: v('dot'),
                    strHeDaoTaoId: v('he'), strCoSoDaoTaoId: v('csdt'), strKhoaHocId: '', strLoaiLopId: v('loaiLop'), strHocPhanId: v('hocPhan'), strNguoiThucHienId: K.uid() }
                : { action: ctl + 'GetKhoiLuongTKBTuyChinh', strNhomMonHocId: v('bm'), StaffId: v('gv'), NamHoc: v('nam'), strHocKy: L.hocKy(), strDotHoc: v('dot'),
                    strHeDaoTaoId: v('he'), strKieuLop: v('kieuLop'), strHTQT: v('loaiTiet'), strNguoiDung_Id: K.uid() };
            p.method = 'GET';
            Promise.all([ums.api.call(p), htgP]).then(function (x) { rows = K.arr(x[0].data); ve.coDuLieu = true; ve(); })
                .catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khối lượng'); });
        }
        function gt(k, i) {
            var el = bang.querySelector('[data-o="' + k + '"][data-i="' + i + '"]');
            if (!el) return null;
            return el.type === 'checkbox' ? (el.checked ? '1' : '0') : el.value.trim();
        }
        function capNhat() {
            if (!rows.length) { ui.toast('Chưa có dữ liệu — bấm Danh sách trước', 'warn'); return; }
            var doi = [];
            rows.forEach(function (r, i) {
                var x = { SOSV: gt('SOSV', i), HESOTINCHI: gt('HESOTINCHI', i), SOTIETHUONGDANMOTSV: gt('SOTIETHUONGDANMOTSV', i), HTG: gt('HTG', i), TT: gt('TT', i) };
                TIET.forEach(function (t) { x[t[0]] = gt(t[0], i); });
                var khac = ['SOSV', 'HESOTINCHI', 'SOTIETHUONGDANMOTSV'].concat(TIET.map(function (t) { return t[0]; }))
                    .some(function (k) { return x[k] !== null && x[k] !== e(r[k]); }) ||
                    (x.HTG !== null && x.HTG !== e(r.HINHTHUCGIANGDAYID)) || x.TT !== (e(r.TRONGTRUONG) === '1' ? '1' : '0');
                if (khac) doi.push({ r: r, x: x });
            });
            if (!doi.length) { ui.toast('Không có dòng nào thay đổi', 'info'); return; }
            ui.confirm('Bạn có chắc chắn cập nhật ? (' + doi.length + ' dòng)', { ok: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (d) {
                    var r = d.r, x = d.x;
                    var p = { action: ctl + (nhap ? 'UpdateKhoiLuong_Nhap' : 'UpdateKhoiLuongTKBNienChe'), method: 'GET', strID: e(r[KHOA]), StaffID: e(r.STAFFID), NamHoc: e(r.NAMHOC),
                        HocKy: e(ql ? r.HOCKYFULL : r.HOCKY), strTenMon: e(ql ? r.TENHOCPHAN : r.TENMON), strTenLop: e(r.TENLOP), strSoSinhVien: x.SOSV,
                        strTongSoTiet: ql ? '' : e(r.SOTIET), strThoiKhoaBieu: ql ? '' : e(r.LICHHOC), strHeDaoTao: e(ql ? r.DAOTAO_HEDAOTAO_ID : r.IDHEDAOTAO),
                        strSoTietTheoKeHoach: ql ? '' : e(r.SOTIET), strDVHT: e(ql ? r.HOCTRINH : r.DVHT), strSoNgay: x.SONGAY, strHinhThucGiangDay: x.HTG,
                        strBTL: x.BTL, strTKMH: x.TKMH, strSoTien: e(r.SOTIEN), strTrongTruong: x.TT, strSoTietHDMotSinhVien: x.SOTIETHUONGDANMOTSV,
                        strHeSoTinChi: nhap ? e(r.HESOTINCHI) : x.HESOTINCHI, strChucNang_Id: K.chucNang() };
                    if (nhap) p.strDotHoc = '';
                    ['TIETLYTHUYET_DC', 'TIETBAITAP_DC', 'TIETTHAOLUAN_DC', 'TIETTHINGHIEM_DC', 'TIETTHUCHANH_DC'].forEach(function (k) { p['str' + k] = x[k]; });
                    if (ql) { p.strIDHINHTHUCHOC = e(r.IDHINHTHUCHOC); p.strNguoiThucHienId = K.uid(); }
                    else { p.strLoai = e(r.LOAITIET); p.strUserId = K.uid(); }
                    return p;
                }), { title: 'Đang cập nhật', okText: 'Cập nhật thành công', show: true }).then(tai);
            });
        }
        function chon() { return Array.prototype.slice.call(bang.querySelectorAll('[data-ck]:checked')).map(function (x) { return rows[Number(x.getAttribute('data-ck'))]; }); }
        function theoDong(action, hoi, xong) {
            var c = chon();
            if (!c.length) { ui.toast(action === 'CapNhatPhanBoTiet' ? 'Vui lòng chọn đối tượng cần cập nhật?' : 'Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm(hoi + ' (' + c.length + ' dòng)', action === 'XoaKhoiLuong' ? { tone: 'bad', ok: 'Xoá' } : { ok: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                var calls = nhap ? c.map(function (r) {
                    return { action: ctl + 'XoaKhoiLuong_Nhap', method: 'GET', strNamHoc: v('nam'), strHocKy: v('hk'), strDotHoc: v('dot'),
                        strKhoiLuongThoiKhoaBieuId: e(r[KHOA]), strLopHocPhanId: e(r.IDLOPHOCPHAN), strNguoiThucHienId: K.uid() };
                }) : ql ? c.map(function (r) {
                    return { action: ctl + action, method: 'POST', strNamHoc: v('nam'), strHocKy: v('hk'), strDotHoc: v('dot'),
                        strKhoiLuongThoiKhoaBieuId: e(r[KHOA]), strLopHocPhanId: e(r.IDLOPHOCPHAN) };
                }) : [{ action: ctl + action, method: 'POST', strNamHoc: v('nam'), strHocKy: L.hocKy(), strDotHoc: v('dot'),
                    strKhoiLuongThoiKhoaBieuId: c.map(function (r) { return e(r[KHOA]); }).join(','), strNguoiDung_Id: K.uid() }];
                ui.batch(calls, { title: 'Đang thực hiện', okText: xong, show: true }).then(tai);
            });
        }

        if (!ql) ums.report.mount(root.querySelector('[data-z="bc"]'), { collect: function (add) { add('strNamHoc', v('nam')); add('strChucNang_Id', K.chucNang()); } });
        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var k = b.getAttribute('data-a');
            if (k === 'search') tai();
            else if (k === 'capnhat') capNhat();
            else if (k === 'xoa') theoDong('XoaKhoiLuong', 'Bạn có chắc chắn xóa?', 'Thực hiện thành công');
            else if (k === 'them' && nhap) K.themLop(v, tai, root);
            else if (k === 'import' && nhap) {
                if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
                K.hopImport({ mau: 'TEMPLATE_IMPORTKHOILUONG_NHAP', params: function () { return { strNamHoc: v('nam'), strNguoiThucHien_Id: K.uid() }; },
                    nut: [{ text: 'Import dữ liệu file Excel', action: ctl + 'Import_KhoiLuongNhap' }], onDone: function () { if (rows.length) tai(); } });
            }
            else if (k === 'phanbo') theoDong('CapNhatPhanBoTiet', 'Bạn có chắc chắn cập nhật?', 'Cập nhật thành công');
            else if (k === 'all') bang.querySelectorAll('[data-ck]').forEach(function (x) { x.checked = b.checked; });
        });
        ve();
    };
})();
