/* =========================================================================
   klgd — Tách lớp / Duyệt dữ liệu tách: ums.klgd.tachLop(root, ql, duyet)
     taclop (ql false) · qlklgd_taclop (ql) · duyetdulieutach (duyet) · qlklgd_duyetdulieutach (ql, duyet)
   Thanh lọc (K.boLoc) · thanh thao tác · HAI CỘT như gốc (col-4 lớp học phần · col-8 các lớp đã tách của lớp đang chọn, ô nhập
   Sỹ số khi lớp tách theo SV, ô nhập 7 loại tiết khi tách theo tiết, dòng tổng) · hộp "Thực hiện phân giảng" (PC từng lớp tách)
   · hộp "Danh sách phân công" (Toàn bộ phân giảng — chỉ màn tách).
   ---------------------------------------------------------------------------
   Bản cũ TKGG_KLGD (học kỳ "<năm>_<kỳ>", khoá lớp PHANCONGID, khoá dòng tách ID):
     Lớp HP  GetDanhSachLopHPPhucVuTach | GetDanhSachLopHPDuyetTach (+ strDaDuyet) { strHocKy, strBoMonId, strDotHoc, strHeDaoTaoId,
             strCoSoDaoTaoId, strAyId, strKieuHoc, strMonHocId, strNguoiDung_Id }
     Lớp tách GetDanhSachLopThucTap { strPhanCongId + các tham số lọc trên }
     Tách    ThucHienTachTaoLop (GET) { strNamHoc, strHocKy, strDotHoc, strHeDaoTaoId, strCoSoDaoTaoId, strPhanCongId, strThoiKhoaBieuId:
             IDTHOIKHOABIEU, strTachTheoSinhVien_Tiet SV|TIET, strDuLieuTach, strBomonId, strNguoiDung_Id }
     Cập nhật CapNhatPhanCongThucTapNC (mỗi lớp tách) { strNamHoc, strHocKy, strDotHoc, strKhoiLuongThoiKhoaBieuId, strSoSV, strSoTietQuyDoi:
             TONGTIETDECUONG, strLyThuyet, strBaiTap, strThaoLuan, strThiNghiem, strThucHanh, strBTL, strSoNgay: SONGAY, strGiangVienID: STAFFID,
             strTKMH, strTenLop, strTACHTHEOSINHVIEN_TIET, strNguoiDung_Id }
     Xoá     XoaKhoiLuong (POST) { strNamHoc, strHocKy, strDotHoc, strKhoiLuongThoiKhoaBieuId: id nối phẩy, strNguoiDung_Id }
     PC      CapNhatPhanCongBMKhac { strStaffId, strNamHoc, strHocKy, strDotHoc, strKhoiLuongThoiKhoaBieuId, strNguoiDung_Id }
             (bộ môn GetToanBoBoMon, giảng viên GetListStaff)
     Duyệt   ThucHienDuyet { strPhanCongId: id nối phẩy, strDaDuyet 1|0, strNguoiDung_Id }
   Bản QL TKGG_QLKLGD (học kỳ = giá trị ô, khoá lớp IDLOPMONHOC, khoá dòng tách KHOILUONGTHOIKHOABIEUID):
     Lớp HP  GetDanhSachLopHPPhucVuTach { strBoMonId, strHocKy, strDotHocId, strHeDaoTaoId, strCoSoDaoTaoId, strKhoaHocId, strLoaiLopId,
             strMonHocId, strChucNang_Id, strNguoiThucHienId } | GetDanhSachLopHPDuyetTach (strKieuHoc thay strLoaiLopId, + strDaDuyet)
     Lớp tách GetDanhSachLopThucTap { strLopHocPhanId, strNguoiThucHienId }
     Tách    ThucHienTachTaoLop { strNamHoc, strTachTheoSinhVien_Tiet, strDuLieuTach, strBomonId, strLopHocPhanId, strNguoiThucHienId }
     Cập nhật như bản cũ + strLopHocPhanId: LOPHOCPHANID, strNguoiThucHienId
     Xoá     XoaKhoiLuong (POST, MỖI dòng) { strNamHoc, strHocKy "<năm>_<kỳ>" (ghép như gốc), strDotHoc, strKhoiLuongThoiKhoaBieuId, strLopHocPhanId }
     PC      CapNhatPhanCongBMKhac { strStaffId, strNamHoc, strHocKy, strLopHocPhanId, strKhoiLuongThoiKhoaBieuId, strNguoiThucHienId }
             (bộ môn GetNhomMonHoc, giảng viên GetDanhSachCanBoNienHoc)
     Duyệt   ThucHienDuyet { strLopHocPhanId, strDaDuyet, strNguoiThucHienId }
   Luật tách (chép nguyên, MÂU THUẪN — ghi can-quyet.js): tách theo SV chỉ cho loại lớp cũ KIEUHOC ∈ {5,6,4} / QL MAHINHTHUCHOC ∈
     {DA,TN,TT,TH}; tách theo tiết cấm đúng các loại đó. Bản QL miễn luật cho hệ "NCS".
   Khác bản gốc (ghi ở can-quyet.js):
     · qlklgd_duyetdulieutach: Xoá gốc CHƯA TỪNG CHẠY (biến chưa khai báo) → làm theo bản tách lớp QL.
     · duyetdulieutach: nhãn tổng tối đa gốc lấy dòng ĐẦU bảng trái (không phải lớp đang chọn) → lấy đúng lớp.
     · Cập nhật: ô không hiện (vd tiết khi tách theo SV) gốc gửi rỗng → nay gửi lại giá trị hiện có của dòng. Báo đúng kết quả,
       nạp lại cả hai bảng (gốc chờ cứng 2 giây, không nạp bảng phải). Xoá QL gốc báo ngược thành công / lỗi → nay đúng.
     · "Toàn bộ phân giảng" bản cũ: tiêu đề cột gốc lệch dữ liệu → đặt đúng; bản QL gốc lấy bộ môn/giảng viên từ hộp PC → gửi rỗng.
     · PC bắt chọn giảng viên (gốc gửi được rỗng). Nút "Không duyệt" có chữ hỏi / màu riêng (gốc giống hệt nút Duyệt).
     · Tiêu đề bảng: "Lớp học phần" / "Danh sách lớp tách" (gốc "Danh sách đã / chưa phân công" — sai nghĩa).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;
    var TIET = [['LT', 'TIETLYTHUYET_DC', 'Lý thuyết', 'strLyThuyet'], ['BT', 'TIETBAITAP_DC', 'Bài tập', 'strBaiTap'], ['TL', 'TIETTHAOLUAN_DC', 'Thảo luận', 'strThaoLuan'],
        ['TN', 'TIETTHINGHIEM_DC', 'Thí nghiệm', 'strThiNghiem'], ['TH', 'TIETTHUCHANH_DC', 'Thực hành', 'strThucHanh'], ['BTL', 'BTL', 'BTL', 'strBTL'], ['TKMH', 'TKMH', 'TKMH', 'strTKMH']];

    K.tachLop = function (root, ql, duyet) {
        var ctl = K.ctl(ql), KLOP = ql ? 'IDLOPMONHOC' : 'PHANCONGID', KTACH = ql ? 'KHOILUONGTHOIKHOABIEUID' : 'ID';
        var keys = ['nam', 'hk', 'dot', 'he', 'khoa', 'csdt', 'bm', 'gv', ql ? 'loaiLop' : 'kieuLopT', 'monHoc'].concat(duyet ? ['ttDuyet'] : []);
        var L = K.boLoc(root, keys, ql, function (k) {
            if (!duyet) taiTrai();
            else if (!ql && (k === 'kieuLopT' || k === 'monHoc')) taiTrai();
        });
        var thaoTac = duyet
            ? ui.btn('save', { text: 'Duyệt', icon: 'fa-thumbs-up', attr: { 'data-a': 'duyet' } }) + ' ' +
              ui.btn('del', { text: 'Không duyệt', mod: 'out-danger', icon: 'fa-thumbs-down', attr: { 'data-a': 'khongduyet' } })
            : '<input class="ums-input" data-t="sl" placeholder="Tách ra.. lớp" autocomplete="off" style="max-width:140px"> ' +
              ui.btn('save', { text: 'Tách lớp theo số SV', mod: 'out-primary', icon: 'fa-users-between-lines', attr: { 'data-a': 'tachsv' } }) + ' ' +
              ui.btn('save', { text: 'Tách lớp theo số tiết', mod: 'out-primary', icon: 'fa-table-columns', attr: { 'data-a': 'tachtiet' } });
        root.innerHTML = pat.page(duyet ? 'Duyệt dữ liệu tách' : 'Tách lớp', duyet ? '' : ui.btn('save', { text: 'Toàn bộ phân giảng', mod: 'out-primary', icon: 'fa-chalkboard-user', attr: { 'data-a': 'toanbo' } })) +
            L.html({ searchText: 'Danh sách' }) +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-row ums-row--wrap">' + thaoTac + ' <span class="kl-gian"></span>' +
                ui.btn('save', { text: 'Cập nhật', attr: { 'data-a': 'capnhat' } }) + ' ' + ui.xoaChon('input[data-ph]', { attr: { 'data-a': 'xoa' } }) + '</div>' }) +
            '<div class="kl-2cot kl-2cot--48">' +
            pat.panel({ title: 'Lớp học phần', icon: 'fa-chalkboard', flush: true, count: 'demT', zone: 'trai' }) +
            pat.panel({ title: 'Danh sách lớp tách', icon: 'fa-code-branch', flush: true, count: 'demP', zone: 'phai' }) + '</div>';
        L.gan();
        var v = L.v;
        var trai = [], phai = [], lopChon = null;
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function dangTai(el) { el.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>'; }
        function nguoi(o) { if (ql) o.strNguoiThucHienId = K.uid(); else o.strNguoiDung_Id = K.uid(); return o; }
        function loc(o) {
            var p = { strHocKy: L.hocKy(), strBoMonId: v('bm'), strHeDaoTaoId: v('he'), strCoSoDaoTaoId: v('csdt'), strMonHocId: v('monHoc') };
            if (ql) { p.strDotHocId = v('dot'); p.strKhoaHocId = v('khoa'); }
            else { p.strDotHoc = v('dot'); p.strAyId = v('khoa'); p.strKieuHoc = v('kieuLopT'); }
            return nguoi(Object.assign(p, o));
        }
        function hkGhep() { return v('nam') ? v('nam') + '_' + v('hk') : ''; }
        function nhanTach(t) { return t === 'TIET' ? ' <span class="kl-do">(Tách tiết)</span>' : t === 'SV' ? ' <span class="kl-do">(Tách SV)</span>' : ''; }

        /* ---------- Bảng trái: lớp học phần ---------- */
        function veTrai() {
            var cot = [{ title: 'Lớp học phần', render: function (r) {
                    if (ql && !duyet) return '<span class="kl-do">' + esc(e(r.TENKHOA) + '_' + e(r.MAHOCPHAN) + '_') + '</span>' + esc(e(r.TENLOP)) +
                        (Number(r.LALOPTACH) > 1 ? ' <span class="kl-do">Đã tách</span>' : Number(r.LALOPTACH) === 1 ? ' <span class="kl-do">Đã PC</span>' : '');
                    return esc(e(r.TENLOP)) + (ql ? '' : nhanTach(e(r.TACHTHEOSINHVIEN_TIET))) + (ql && duyet ? nhanTach(e(r.TACHTHEOSINHVIEN_TIET)) : '');
                } },
                { title: 'Số TC', cls: 'is-center', render: function (r) { return esc(e(ql ? r.HOCTRINH : r.DVHT)); } },
                { title: 'Sỹ số', prop: 'SOSINHVIEN', cls: 'is-center' }];
            if (!(ql && duyet)) cot.push({ title: 'Số tiết', cls: 'is-center', render: function (r) { return esc(e(ql ? r.TONGTIETCTDT : r.TONGTIETLOPMONTINCHI)); } });
            cot.push({ title: 'Kiểu lớp', render: function (r) { return esc(e(ql ? r.TENHINHTHUCHOC : r.LOAILOPHOCPHAN)); } });
            if (duyet) cot.push({ title: 'Đã duyệt', cls: 'is-center is-nowrap', render: function (r) { return Number(r.DUYETTACH) === 1 ? '<span class="kl-do">Đã duyệt</span>' : ''; } });
            cot.push({ title: 'Chi tiết', cls: 'is-center is-nowrap', render: function (r, i) {
                return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary' + (lopChon && e(lopChon[KLOP]) === e(r[KLOP]) ? ' is-active' : '') +
                    '" data-ds="' + i + '"><i class="fa-light fa-eye"></i><span>DS tách</span></button>';
            } });
            if (duyet) cot.push({ head: '<input type="checkbox" data-all="tr">', cls: 'is-center', width: '44px', render: function (r, i) { return '<input type="checkbox" data-tr="' + i + '">'; } });
            ui.table({ el: z('trai'), rows: trai, columns: cot, empty: 'Không có lớp học phần' });
            z('demT').textContent = '(' + trai.length + ')';
        }
        function taiTrai() {
            if (!v('nam')) { trai = []; z('trai').innerHTML = ui.empty('Chọn năm học', 'fa-filter'); z('demT').textContent = ''; return Promise.resolve(); }
            dangTai(z('trai'));
            var p = duyet ? loc({ strDaDuyet: v('ttDuyet') }) : loc({});
            if (ql) { if (duyet) p.strKieuHoc = v('loaiLop'); else { p.strLoaiLopId = v('loaiLop'); p.strChucNang_Id = K.chucNang(); } }
            return K.g(ctl + (duyet ? 'GetDanhSachLopHPDuyetTach' : 'GetDanhSachLopHPPhucVuTach'), p).then(function (r) {
                trai = K.arr(r.data);
                if (lopChon) lopChon = trai.filter(function (x) { return e(x[KLOP]) === e(lopChon[KLOP]); })[0] || null;
                veTrai();
                if (!lopChon) { phai = []; vePhai(); }
            }).catch(function (err) { z('trai').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp học phần'); });
        }

        /* ---------- Bảng phải: các lớp đã tách ---------- */
        function toiDa(k) { if (!lopChon) return ''; var t = TIET.filter(function (x) { return x[0] === k; })[0]; return e(ql ? lopChon[t[1]] : lopChon[k]); }
        function oNhap(k, i, val) { return '<input class="ums-input ums-input--sm kl-so" data-n="' + k + '" data-i="' + i + '" inputmode="decimal" value="' + esc(e(val)) + '" autocomplete="off">'; }
        var congSV = !duyet || ql;          // duyetdulieutach bản cũ: dòng tổng KHÔNG cộng Sỹ số (như gốc)
        function vePhai() {
            var host = z('phai');
            if (!lopChon) { host.innerHTML = ui.empty('Bấm "DS tách" ở một lớp học phần', 'fa-hand-pointer'); z('demP').textContent = ''; return; }
            var cot = [{ title: 'Lớp học phần', prop: 'TENLOP' },
                { title: 'Số TC', cls: 'is-center', render: function (r) { return esc(e(ql ? r.HOCTRINH : r.DVHT)); } },
                { head: 'Sỹ số <span class="kl-do">(' + esc(e(lopChon.SOSINHVIEN)) + ')</span>', cls: 'is-center', render: function (r, i) {
                    return e(r.TACHTHEOSINHVIEN_TIET) === 'SV' ? oNhap('SV', i, r.SOSV) : esc(e(ql ? r.SOSINHVIEN : r.SOSV));
                } }];
            TIET.forEach(function (t) {
                cot.push({ head: esc(t[2]) + ' <span class="kl-do">(' + esc(toiDa(t[0])) + ')</span>', cls: 'is-center', render: function (r, i) {
                    return e(r.TACHTHEOSINHVIEN_TIET) === 'TIET' ? oNhap(t[0], i, r[t[1]]) : esc(e(r[t[1]]));
                } });
            });
            cot.push({ title: 'Giảng viên', render: function (r) { return esc(e(ql ? r.HOTENMASO : r.HOTEN)); } },
                { title: 'Chi tiết', cls: 'is-center', render: function (r, i) { return '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-pc="' + i + '"><span>PC</span></button>'; } },
                { head: '<input type="checkbox" data-all="ph">', cls: 'is-center', width: '44px', render: function (r, i) { return '<input type="checkbox" data-ph="' + i + '">'; } });
            ui.table({ el: host, rows: phai, columns: cot, empty: 'Lớp chưa được tách' });
            z('demP').textContent = '(' + phai.length + ')';
            tong();
        }
        /** Dòng tổng: Sỹ số (trừ duyetdulieutach bản cũ) + LT…BTL (gốc không cộng TKMH), cộng cả giá trị đang gõ trong ô */
        function giaTri(i, k, t) {
            var el = z('phai').querySelector('[data-n="' + k + '"][data-i="' + i + '"]');
            var s = el ? el.value : e(k === 'SV' ? phai[i].SOSV : phai[i][t]);
            var n = Number(String(s).replace(/,/g, ''));
            return isNaN(n) ? 0 : n;
        }
        function tong() {
            var tb = z('phai').querySelector('table');
            if (!tb || !phai.length) return;
            var cu = tb.querySelector('tfoot');
            if (cu) cu.remove();
            var o = ['<td class="is-center"><b>Tổng</b></td>', '<td></td>', '<td></td>'];
            o.push('<td class="is-center"><b>' + (congSV ? phai.reduce(function (a, r, i) { return a + giaTri(i, 'SV'); }, 0) : '') + '</b></td>');
            TIET.forEach(function (t) {
                o.push('<td class="is-center"><b>' + (t[0] === 'TKMH' ? '' : phai.reduce(function (a, r, i) { return a + giaTri(i, t[0], t[1]); }, 0)) + '</b></td>');
            });
            o.push('<td></td><td></td><td></td>');
            tb.insertAdjacentHTML('beforeend', '<tfoot><tr class="ums-table__sum">' + o.join('') + '</tr></tfoot>');
        }
        function taiPhai() {
            if (!lopChon) { phai = []; vePhai(); return Promise.resolve(); }
            dangTai(z('phai'));
            var p = ql ? { strLopHocPhanId: e(lopChon[KLOP]), strNguoiThucHienId: K.uid() } : loc({ strPhanCongId: e(lopChon[KLOP]) });
            return K.g(ctl + 'GetDanhSachLopThucTap', p).then(function (r) { phai = K.arr(r.data); vePhai(); })
                .catch(function (err) { z('phai').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lớp tách'); });
        }
        function taiCaHai() { return taiTrai().then(taiPhai); }

        /* ---------- Tách ---------- */
        function tach(kieu) {
            var sl = root.querySelector('[data-t="sl"]').value.trim();
            if (!lopChon) { ui.toast('Bạn chưa chọn lớp học phần cần tách !', 'warn'); return; }
            if (!sl) { ui.toast('Bạn chưa nhập dữ liệu tách !', 'warn'); return; }
            var heTen = L.F('he').selectedIndex > 0 ? L.F('he').options[L.F('he').selectedIndex].text : '';
            if (!(ql && heTen === 'NCS')) {
                var dsSV = ql ? ['DA', 'TN', 'TT', 'TH'] : ['5', '6', '4'];
                var loai = e(ql ? lopChon.MAHINHTHUCHOC : lopChon.KIEUHOC);
                if (kieu === 'SV' && dsSV.indexOf(loai) < 0) { ui.toast('Chỉ được tách số sinh viên đối với các loại lớp: Thực tập, Đồ án, Thí nghiệm, Thực hành', 'warn'); return; }
                if (kieu === 'TIET' && dsSV.indexOf(loai) >= 0) { ui.toast('Chỉ được tách số tiết đối với các loại lớp: Lý thuyết, Bài tập, thảo luận, thí nghiệm, thực hành', 'warn'); return; }
            }
            ui.confirm('Bạn có chắc chắn tách phân công giảng dạy? (' + (kieu === 'SV' ? 'theo số SV' : 'theo số tiết') + ', ' + sl + ' lớp)', { ok: 'Tách' }).then(function (yes) {
                if (!yes) return;
                var p = ql ? { strNamHoc: v('nam'), strTachTheoSinhVien_Tiet: kieu, strDuLieuTach: sl, strBomonId: v('bm'), strLopHocPhanId: e(lopChon[KLOP]), strNguoiThucHienId: K.uid() }
                    : { strNamHoc: v('nam'), strHocKy: hkGhep(), strDotHoc: v('dot'), strHeDaoTaoId: v('he'), strCoSoDaoTaoId: v('csdt'), strPhanCongId: e(lopChon[KLOP]),
                        strThoiKhoaBieuId: e(lopChon.IDTHOIKHOABIEU), strTachTheoSinhVien_Tiet: kieu, strDuLieuTach: sl, strBomonId: v('bm'), strNguoiDung_Id: K.uid() };
                K.g(ctl + 'ThucHienTachTaoLop', p).then(function () { ui.toast('Thực hiện thành công', 'ok'); taiCaHai(); })
                    .catch(function (err) { ums.api.handle(err, 'tách lớp'); });
            });
        }

        /* ---------- Cập nhật số SV / số tiết các lớp tách ---------- */
        function capNhat() {
            if (!lopChon) { ui.toast('Bạn chưa chọn lớp học phần', 'warn'); return; }
            if (!phai.length) { ui.toast('Lớp chưa được tách', 'warn'); return; }
            var mode = e(phai[0].TACHTHEOSINHVIEN_TIET);
            if (!mode) { ui.toast('Không được phép cập nhật', 'warn'); return; }
            if (mode === 'SV') {
                var tSV = phai.reduce(function (a, r, i) { return a + giaTri(i, 'SV'); }, 0);
                if (tSV > Number(lopChon.SOSINHVIEN || 0)) { ui.toast('Không được phép cập nhật do số sinh viên > ' + e(lopChon.SOSINHVIEN), 'warn'); return; }
            } else {
                var vuot = TIET.some(function (t) { return phai.reduce(function (a, r, i) { return a + giaTri(i, t[0], t[1]); }, 0) > Number(toiDa(t[0]) || 0); });
                if (vuot) { ui.toast('Số tiết cập nhật lớn hơn số tiết', 'warn'); return; }
            }
            ui.confirm('Bạn có chắc chắn cập nhật?', { ok: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                function o(i, k, col) { var el = z('phai').querySelector('[data-n="' + k + '"][data-i="' + i + '"]'); return el ? el.value.trim() : e(phai[i][col]); }
                ui.batch(phai.map(function (r, i) {
                    var p = { action: ctl + 'CapNhatPhanCongThucTapNC', method: 'GET', strNamHoc: v('nam'), strHocKy: L.hocKy(), strDotHoc: v('dot'),
                        strKhoiLuongThoiKhoaBieuId: e(r[KTACH]), strSoSV: o(i, 'SV', 'SOSV'), strSoTietQuyDoi: e(r.TONGTIETDECUONG), strSoNgay: e(r.SONGAY),
                        strGiangVienID: e(r.STAFFID), strTenLop: e(r.TENLOP), strTACHTHEOSINHVIEN_TIET: mode };
                    TIET.forEach(function (t) { p[t[3]] = o(i, t[0], t[1]); });
                    if (ql) p.strLopHocPhanId = e(r.LOPHOCPHANID);
                    return nguoi(p);
                }), { title: 'Đang cập nhật', okText: 'Cập nhật thành công', show: true }).then(taiCaHai);
            });
        }
        function daChon(tag, rows) {
            var host = tag === 'ph' ? z('phai') : z('trai');
            return Array.prototype.slice.call(host.querySelectorAll('[data-' + tag + ']:checked')).map(function (x) { return rows[Number(x.getAttribute('data-' + tag))]; });
        }
        function xoa() {
            var c = daChon('ph', phai);
            if (!c.length) { ui.toast('Vui lòng chọn lớp cần xóa phân công?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa phân công giảng dạy? (' + c.length + ' lớp tách)', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                var calls = ql ? c.map(function (r) {
                    return { action: ctl + 'XoaKhoiLuong', method: 'POST', strNamHoc: v('nam'), strHocKy: hkGhep(), strDotHoc: v('dot'),
                        strKhoiLuongThoiKhoaBieuId: e(r[KTACH]), strLopHocPhanId: e(lopChon[KLOP]) };
                }) : [{ action: ctl + 'XoaKhoiLuong', method: 'POST', strNamHoc: v('nam'), strHocKy: hkGhep(), strDotHoc: v('dot'),
                    strKhoiLuongThoiKhoaBieuId: c.map(function (r) { return e(r[KTACH]); }).join(','), strNguoiDung_Id: K.uid() }];
                ui.batch(calls, { title: 'Đang xoá', okText: 'Thực hiện thành công', show: true }).then(taiPhai);
            });
        }
        function duyetLop(dd) {
            var c = daChon('tr', trai);
            if (!c.length) { ui.toast(dd === '1' ? 'Vui lòng chọn lớp cần duyệt?' : 'Vui lòng chọn lớp cần bỏ duyệt?', 'warn'); return; }
            ui.confirm(dd === '1' ? 'Bạn có chắc chắn duyệt? (' + c.length + ' lớp)' : 'Bạn có chắc chắn KHÔNG duyệt? (' + c.length + ' lớp)', dd === '1' ? { ok: 'Duyệt' } : { tone: 'bad', ok: 'Không duyệt' }).then(function (yes) {
                if (!yes) return;
                var p = { strDaDuyet: dd };
                p[ql ? 'strLopHocPhanId' : 'strPhanCongId'] = c.map(function (r) { return e(r[KLOP]); }).join(',');
                K.g(ctl + 'ThucHienDuyet', nguoi(p)).then(function () { ui.toast('Thực hiện thành công', 'ok'); taiTrai(); })
                    .catch(function (err) { ums.api.handle(err, 'duyệt'); });
            });
        }

        /* ---------- Hộp "Thực hiện phân giảng" (một lớp tách) ---------- */
        function phanCong(r) {
            var dlg = ui.dialog({ title: 'Thực hiện phân giảng — ' + e(r.TENLOP), icon: 'fa-user-plus', size: 'lg', body:
                '<div class="ums-grid ums-grid--2">' +
                ui.field('Đơn vị', '<select class="ums-select" data-b="bm" data-ph="Chọn bộ môn"><option value="">Chọn bộ môn</option></select>') +
                ui.field('Giảng viên', '<select class="ums-select" data-b="gv" data-ph="Chọn giảng viên"><option value="">Chọn giảng viên</option></select>') + '</div>',
                buttons: [{ text: 'Phân công', kind: 'save', onClick: function () { luu(); return false; } }] });
            var B = dlg.body;
            function f(k) { return B.querySelector('[data-b="' + k + '"]'); }
            ui.enhance(B);
            K.g(ctl + (ql ? 'GetNhomMonHoc' : 'GetToanBoBoMon'), { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNamHoc: v('nam'), silent: true })
                .then(function (x) { pat.fill(f('bm'), K.arr(x.data), { id: 'ID', name: 'NAME', head: 'Chọn bộ môn' }); }).catch(function (err) { ums.api.handle(err, 'bộ môn'); });
            pat.chain([f('bm'), f('gv')], { phatLai: false });
            jQuery(f('bm')).on('select2:select', function () {
                (ql ? K.g(ctl + 'GetDanhSachCanBoNienHoc', { strNhomMonHocId: f('bm').value, strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid(), silent: true })
                    : K.g(ctl + 'GetListStaff', { strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNhomMonHocId: f('bm').value, silent: true }))
                    .then(function (x) { pat.fill(f('gv'), K.arr(x.data), ql ? { id: 'STAFFID', name: 'HOTENMASO', head: 'Chọn giảng viên' } : { id: 'NHANVIENID', name: 'HOTEN', head: 'Chọn giảng viên' }); })
                    .catch(function (err) { ums.api.handle(err, 'giảng viên'); });
            });
            function luu() {
                if (!f('gv').value) { ui.toast('Bạn chưa chọn giảng viên', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn phân công giảng dạy?', { ok: 'Phân công' }).then(function (yes) {
                    if (!yes) return;
                    var p = ql ? { strStaffId: f('gv').value, strNamHoc: v('nam'), strHocKy: v('hk'), strLopHocPhanId: e(lopChon[KLOP]), strKhoiLuongThoiKhoaBieuId: e(r[KTACH]), strNguoiThucHienId: K.uid() }
                        : { strStaffId: f('gv').value, strNamHoc: v('nam'), strHocKy: hkGhep(), strDotHoc: v('dot'), strKhoiLuongThoiKhoaBieuId: e(r[KTACH]), strNguoiDung_Id: K.uid() };
                    K.g(ctl + 'CapNhatPhanCongBMKhac', p).then(function () { ui.toast('Thực hiện thành công', 'ok'); dlg.close(); taiPhai(); })
                        .catch(function (err) { ums.api.handle(err, 'phân giảng'); });
                });
            }
        }

        /* ---------- Hộp "Danh sách phân công" (Toàn bộ phân giảng — màn tách) ---------- */
        function toanBo() {
            if (!v('nam')) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
            if (!v('bm')) { ui.toast('Bạn chưa chọn bộ môn', 'warn'); return; }
            var dlg = ui.dialog({ title: 'Danh sách phân công', icon: 'fa-chalkboard-user', size: 'xl', body: '<div data-t="bang"></div>' });
            var host = dlg.body.querySelector('[data-t="bang"]');
            dangTai(host);
            var p = ql ? loc({ strBoMonKhacId: '', strStaffId: '' }) : loc({ strStaffId: v('gv') });
            delete p.strMonHocId; delete p.strKieuHoc;
            K.g(ctl + 'GetDanhSachCacMonHocDaPCCuaBM', p).then(function (r) {
                ui.table({ el: host, rows: K.arr(r.data), empty: 'Không có dữ liệu', columns: [
                    { title: 'Hệ', render: function (x) { return esc(e(ql ? x.TENHEDAOTAO : x.MAHEDAOTAO)); } },
                    { title: 'Lớp học phần', render: function (x) {
                        return ql ? '<span class="kl-do">' + esc(e(x.TENKHOA) + '_' + e(x.MAHOCPHAN) + '_') + '</span>' + esc(e(x.TENLOP)) + (Number(x.LALOPTACH) > 1 ? '<span class="kl-do">_Lớp tách</span>' : '')
                            : esc(e(x.TENLOP));
                    } },
                    { title: 'Số TC', cls: 'is-center', render: function (x) { return esc(e(ql ? x.HOCTRINH : x.DVHT)); } },
                    { title: ql ? 'Học kỳ, đợt' : 'Học kỳ', render: function (x) { return esc(ql ? e(x.HOCKYDOTHOCFULL) : e(x.HOCKY) + (e(x.DOTHOC) ? ' — đợt ' + e(x.DOTHOC) : '')); } },
                    { title: 'Sỹ số', prop: 'SOSINHVIEN', cls: 'is-center' },
                    { title: 'Kiểu lớp', render: function (x) { return esc(e(ql ? x.TENHINHTHUCHOC : x.LOAILOPHOCPHAN)); } },
                    { title: 'Giảng viên', render: function (x) {
                        var t = e(ql ? x.HOTENMASO : x.HOTEN);
                        return t ? esc(t) : (!ql && Number(x.DATACH) > 0 ? '<span class="kl-do">Đã tách</span>' : '');
                    } }
                ].concat(ql ? [] : [{ title: 'Mã Giảng viên', prop: 'MACONGCHUC', cls: 'is-nowrap' }]).concat([
                    { title: 'Bộ môn', render: function (x) { return esc(e(ql ? x.TENBOMONPHANGIANG : x.BOMON)); } }]) });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'toàn bộ phân công'); });
        }

        root.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-all]');
            if (a && root.contains(a)) { var t = a.getAttribute('data-all'); root.querySelectorAll('[data-' + t + ']').forEach(function (x) { if (x !== a) x.checked = a.checked; }); return; }
            var d = ev.target.closest('[data-ds]');
            if (d) { lopChon = trai[Number(d.getAttribute('data-ds'))]; veTrai(); taiPhai(); return; }
            var p = ev.target.closest('[data-pc]');
            if (p) { phanCong(phai[Number(p.getAttribute('data-pc'))]); return; }
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            var k = b.getAttribute('data-a');
            if (k === 'search') taiTrai();
            else if (k === 'tachsv') tach('SV');
            else if (k === 'tachtiet') tach('TIET');
            else if (k === 'capnhat') capNhat();
            else if (k === 'xoa') xoa();
            else if (k === 'duyet') duyetLop('1');
            else if (k === 'khongduyet') duyetLop('0');
            else if (k === 'toanbo') toanBo();
        });
        root.addEventListener('input', function (ev) { if (ev.target.hasAttribute('data-n')) tong(); });
        taiTrai();
    };
})();
