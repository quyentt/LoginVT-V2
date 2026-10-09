/* =========================================================================
   Nhập điểm theo danh sách thi — khung chung của nhapdiemdst (đủ luồng nhập)
   và nhapdiemdstbc (chỉ danh sách + báo cáo) — ums.nd.dst(root, { nhap, tieuDe })
   Bản gốc: nhapdiem/script/nhapdiemdst.js — MỘT tệp cho cả hai html; html bản "bc" bỏ nút
   #btnCongBo nên các ô danh sách không còn là liên kết → không mở được danh sách thi nào.
   ---------------------------------------------------------------------------
   Bản nhập: bấm một danh sách thi → màn con "Thông tin danh sách thi" mở TRONG TRANG, thay chỗ danh sách (pat.formTrang —
   BO-CUC luật 1; bản gốc là modal). Hộp "Xử lý vi phạm", "Công bố" là việc phụ — vẫn là hộp thoại.
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       Bộ lọc: ums.nd.locThi — TP_Chung/LayThoiGian (tự chọn mục đầu) → LayLoaiDiem → LayHinhThucThi → LayDotThi
         → LayHocPhan (tên "TEN - MA")
       TP_Chung/LayDSThiTheoDotThi (strThi_DotThi_Id, strDaoTao_HocPhan_Id — gốc KHÔNG gửi Thời gian / Loại điểm /
         Hình thức, giữ như gốc)
       Bản nhập: TP_Chung/LayDSNguoiHocTheoDST (strDanhSachThi_Id) · POST TP_XuLy/CapNhat_DiemPhachTheoDST mỗi dòng đã sửa
         (strUngDung_Id = vai trò đăng nhập như gốc, strThi_DanhSachSinhVien_Id, strDiem)
       Xác nhận hoàn thành (các danh sách đánh dấu) / Công bố (danh sách đang mở): ums.nd.xacNhan
         XACNHAN_HOANTHANH_DIEMTHI / XACNHAN_CONGBODIEM_THI
       Xử lý vi phạm: ums.nd.viPham('Sau') — strSanPham_Id = QLSV_NGUOIHOC_ID + IDDANHSACHTHI (ghép như gốc)
       Báo cáo: ums.report.mount — strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDanhSachThi_Id (danh sách đang mở,
         rồi thêm một strDanhSachThi_Id cho MỖI dòng đánh dấu — như gốc)
       Tải bảng điểm / Nhập điểm qua file: ums.report.taiBangNhap(tblTuiThi) / nhapBangTuTep
       Pull 29/9: cột "Xuất Excel" từng danh sách thi (CHỈ bản nhập — html bản "bc" gốc không có cột này) → tệp
         DSThi_<mã danh sách>.xlsx, 12 cột như gốc; thư viện assets/vendor/xlsx thay CDN của gốc.
   Không chép (lỗi rõ của bản gốc):
     · Ô từ khoá không bao giờ được gửi → lọc NGAY trên danh sách đã tải (mã danh sách, lớp học phần, phòng).
     · Bản "bc": cột "Xác nhận hoàn thành" đổ nhầm TEN → hiện đúng tình trạng.
     · Xác nhận hoàn thành / Công bố xong không nạp lại danh sách (cột tình trạng cũ) → nạp lại.
     · Hộp xác nhận: tiêu đề luôn trống (class có dấu chấm); trạng thái + lịch sử chỉ của danh sách ĐẦU mà lưu cho mọi
       danh sách — giữ cách lưu, hộp ghi rõ số mục áp dụng. Bắt chọn trạng thái.
     · Phím ↑/↓ nhảy lệch khi có dòng khoá; lọc nối tầng chạy song song đọc giá trị cũ; mở màn gọi mọi ô hai lần.
     · Bản gốc hệ 10: "12.5" → 1.2 → chỉ đổi số nguyên (ums.nd.he10).
   Chờ nghiệp vụ:
     · Bản "bc" có chủ ý chỉ xem + in báo cáo, hay do lỡ bỏ nút? Đang giữ đúng như gốc: không mở được danh sách.
     · Dòng khoá (CAMTHI_DUYETDKTHI / CAMTHI_VIPHAMQUYCHE = 1) để trống ô điểm — giữ.
     · Lưu chỉ gửi strDiem dù tên hàm là CapNhat_DiemPhach… — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var nd = ums.nd = ums.nd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }

    nd.dst = function (root, o) {
        var nhap = o.nhap !== false;
        root.innerHTML = pat.page(o.tieuDe, '<span data-z="bc"></span>' + (nhap ? ui.btn('save', { text: 'Xác nhận hoàn thành', icon: 'fa-circle-check', attr: { 'data-a': 'hoanthanh' } }) : '')) +
            pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'ld', type: 'select', label: 'Chọn loại điểm' },
                { key: 'ht', type: 'select', label: 'Chọn hình thức thi' }, { key: 'dot', type: 'select', label: 'Chọn đợt thi' },
                { key: 'mon', type: 'select', label: 'Chọn môn thi' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]) +
            pat.panel({ title: 'Danh sách bảng điểm', icon: 'fa-file-lines', count: 'n', flush: true, zone: 'bang' });
        ui.enhance(root);
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return f(k) ? f(k).value.trim() : ''; }
        var ds = [], hien = [], moDS = null;
        nd.locThi({ f: f, chonDau: true, tenMon: function (x) { return e(x.TEN) + ' - ' + e(x.MA); },
            onDoi: function (k) { if (k === 'ld' || k === 'ht' || k === 'mon') tai(); } });
        z('bang').innerHTML = ui.empty('Chọn đợt thi, môn thi rồi bấm "Tìm kiếm"', 'fa-hand-pointer');

        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({ action: 'TP_Chung/LayDSThiTheoDotThi', method: 'GET', strThi_DotThi_Id: v('dot'), strDaoTao_HocPhan_Id: v('mon'), strNguoiThucHien_Id: uid() })
                .then(function (r) { ds = arr(r.data); ve(); }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi'); });
        }
        function ve() {
            var q = v('q').toLowerCase();
            hien = q ? ds.filter(function (x) { return [x.MADANHSACHTHI, x.THONGTINLOPHOCPHAN, x.TKB_PHONGTHI_TEN].join(' ').toLowerCase().indexOf(q) >= 0; }) : ds;
            z('n').textContent = '(' + hien.length + ')';
            function lk(txt, i) { return nhap ? '<a href="javascript:void(0)" class="nd-lk" data-mo="' + i + '">' + esc(txt) + '</a>' : esc(txt); }
            ui.table({ el: z('bang'), rows: hien, empty: 'Không có danh sách thi', columns: [
                { title: 'Mã danh sách', cls: 'is-nowrap', render: function (x, i) { return lk(e(x.MADANHSACHTHI), i); } },
                { title: 'Lớp học phần', render: function (x, i) {
                    var t = e(x.THONGTINLOPHOCPHAN);
                    if (!nhap || t.length <= 80) return lk(t, i);
                    return '<span class="nd-lhp"><span class="nd-lhp__ngan">' + lk(t.substring(0, 80) + '...', i) + '</span><span class="nd-lhp__du" hidden>' + lk(t, i) + '</span> ' +
                        '<a href="javascript:void(0)" class="nd-lhp__nut" data-them>Xem thêm</a></span>';
                } },
                { title: 'Ngày thi', cls: 'is-center is-nowrap', render: function (x, i) { return lk(e(x.NGAYTHI), i); } },
                { title: 'Ca thi', cls: 'is-center', render: function (x, i) { return lk(e(x.THI_CATHI_TEN), i); } },
                { title: 'Phòng thi', cls: 'is-center', render: function (x, i) { return lk(e(x.TKB_PHONGTHI_TEN), i); } },
                { title: 'Xác nhận hoàn thành', cls: 'is-center is-nowrap', render: function (x) { return String(x.XACNHANHOANTHANHDIEMTHI) === '1' ? ui.badge('Đã xác nhận', 'ok') : ''; } }]
                .concat(nhap ? [{ title: 'Xuất Excel', cls: 'is-center is-nowrap', width: '80px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn nd-xls" data-xls="' + i + '" title="Xuất Excel danh sách thi"><i class="fa-light fa-file-excel"></i></button>'; } }] : [])
                .concat([{ head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }]) });
        }

        /* ---------- Xuất Excel người học của MỘT danh sách thi (gốc exportExcel_DST, bản kéo về 29/09/2026) ----------
           Gọi riêng TP_Chung/LayDSNguoiHocTheoDST, không đụng danh sách đang mở. Thư viện: bản cục bộ
           assets/vendor/xlsx (gốc nạp từ CDN), chỉ nạp khi bấm lần đầu. */
        var pXLSX = null;
        function napXLSX() {
            if (window.XLSX && window.XLSX.utils) return Promise.resolve(window.XLSX);
            if (!pXLSX) pXLSX = new Promise(function (ok, loi) {
                var s = document.createElement('script');
                s.src = 'assets/vendor/xlsx/xlsx.bundle.js';
                s.onload = function () { ok(window.XLSX); };
                s.onerror = function () { pXLSX = null; loi(new Error('Không tải được thư viện Excel (assets/vendor/xlsx)')); };
                document.head.appendChild(s);
            });
            return pXLSX;
        }
        function xuatExcel(x, nut) {
            if (!x || nut.disabled) return;
            var cu = nut.innerHTML;
            nut.disabled = true; nut.innerHTML = '<i class="fa-light fa-spinner fa-spin"></i>';
            napXLSX().then(function (XLSX) {
                return ums.api.call({ action: 'TP_Chung/LayDSNguoiHocTheoDST', method: 'GET', strDanhSachThi_Id: x.ID, strNguoiThucHien_Id: uid() }).then(function (r) {
                    var nh = arr(r.data);
                    if (!nh.length) { ui.toast('Danh sách thi chưa có người học.', 'warn'); return; }
                    var dau = ['STT', 'Mã số', 'Họ đệm', 'Tên', 'Lớp quản lý', 'Điểm thành phần', 'Lần học', 'Lần thi', 'Số báo danh', 'Điểm', 'Lớp đăng ký học', 'Tình trạng'];
                    var aoa = [['DANH SÁCH THI: ' + e(x.MADANHSACHTHI)], ['Lớp học phần: ' + e(x.THONGTINLOPHOCPHAN)],
                        ['Ngày thi: ' + e(x.NGAYTHI) + '    Ca thi: ' + e(x.THI_CATHI_TEN) + '    Phòng thi: ' + e(x.TKB_PHONGTHI_TEN)], [], dau];
                    nh.forEach(function (y, i) {
                        aoa.push([i + 1, e(y.QLSV_NGUOIHOC_MASO), e(y.QLSV_NGUOIHOC_HODEM), e(y.QLSV_NGUOIHOC_TEN), e(y.DAOTAO_LOPQUANLY_TEN), e(y.DIEM_THANHPHANDIEM_TEN),
                            e(y.LANHOC), e(y.LANTHI), e(y.SOBAODANH), e(y.DIEMBANDAU), e(y.DIEM_DANHSACHHOC_TEN), e(y.TRANGTHAI)]);
                    });
                    var ws = XLSX.utils.aoa_to_sheet(aoa);
                    ws['!merges'] = [0, 1, 2].map(function (d) { return { s: { r: d, c: 0 }, e: { r: d, c: dau.length - 1 } }; });
                    ws['!cols'] = dau.map(function (t, c) {
                        var m = t.length;
                        for (var d = 5; d < aoa.length; d++) m = Math.max(m, String(aoa[d][c]).length);
                        return { wch: Math.min(m + 2, 50) };
                    });
                    var wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách thi');
                    // Mã danh sách thi có dấu "/" (AET3283_28/09/2026_1_…) → thay ký tự cấm trong tên tệp
                    XLSX.writeFile(wb, 'DSThi_' + (String(e(x.MADANHSACHTHI)).replace(/[\\\/:*?"<>|]/g, '-') || 'DanhSachThi') + '.xlsx');
                });
            }).catch(function (err) { ums.api.handle(err, 'xuất Excel danh sách thi'); })
              .then(function () { nut.disabled = false; nut.innerHTML = cu; });
        }
        function daChon() {
            return Array.prototype.filter.call(z('bang').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                .map(function (c) { return hien[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
        }
        ums.report.mount(z('bc'), { reportText: 'Báo cáo', collect: function (add) {
            add('strThi_DotThi_Id', v('dot')); add('strDaoTao_HocPhan_Id', v('mon')); add('strDanhSachThi_Id', moDS ? moDS.ID : '');
            daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
        } });

        /* ---------- Màn con nhập điểm một danh sách thi (bản nhập) — trong trang, thay chỗ danh sách ---------- */
        function moDanhSach(x) {
            moDS = x;
            var NH = [];
            var dlg = pat.formTrang({ host: root, title: 'Thông tin danh sách thi ' + [x.MADANHSACHTHI, x.NGAYTHI, x.THI_CATHI_TEN, x.TKB_PHONGTHI_TEN].map(e).join(' - '), icon: 'fa-users-between-lines', cols: 1,
                body: '<div class="nd-thanh nd-thanh--hop"><span></span><div class="nd-thanh__phai">' +
                        ui.btn('excel', { text: 'Tải bảng điểm', icon: 'fa-file-arrow-down', mod: 'out-primary', attr: { 'data-h': 'tai' } }) +
                        ui.btn('search', { text: 'Nhập điểm qua file', icon: 'fa-file-pen', mod: 'out-success', attr: { 'data-h': 'nhap' } }) +
                        ui.btn('save', { text: 'Công bố', icon: 'fa-folder-bookmark', mod: 'out-warn', attr: { 'data-h': 'congbo' } }) + '</div></div>' +
                    '<div data-h="bang"></div>',
                buttons: [{ text: 'Xử lý vi phạm', kind: 'save', mod: 'primary', onClick: function () { viPham(); return false; } },
                    { text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }],
                onClose: function () { moDS = null; } });
            var h = dlg.body.querySelector('[data-h="bang"]');
            nd.phim(h);
            function tai2() {
                h.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return ums.api.call({ action: 'TP_Chung/LayDSNguoiHocTheoDST', method: 'GET', strDanhSachThi_Id: x.ID, strNguoiThucHien_Id: uid() }).then(function (r) {
                    NH = arr(r.data);
                    ui.table({ el: h, rows: NH, empty: 'Danh sách thi chưa có người học', columns: [
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                        { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Điểm thành phần', prop: 'DIEM_THANHPHANDIEM_TEN' },
                        { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }, { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
                        { title: 'Điểm', cls: 'is-center', render: function (y, i) {
                            if (String(y.CAMTHI_DUYETDKTHI) === '1' || String(y.CAMTHI_VIPHAMQUYCHE) === '1') return '';
                            var g = esc(e(y.DIEMBANDAU));
                            return '<input class="ums-input ums-input--sm nd-o" id="txtDiem' + esc(y.ID) + '" data-r="' + i + '" data-c="0" data-he="' + esc(e(y.THANGDIEM)) + '" data-goc="' + g + '" value="' + g + '" autocomplete="off">';
                        } },
                        { title: 'Lớp đăng ký học', prop: 'DIEM_DANHSACHHOC_TEN' }, { title: 'Tình trạng', prop: 'TRANGTHAI' },
                        { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (y, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }] });
                    var t = h.querySelector('table');
                    if (t) { t.id = 'tblTuiThi'; t.setAttribute('colreport', '1'); t.classList.add('nd-luoi'); Array.prototype.forEach.call(t.tBodies[0].rows, function (tr, i) { if (NH[i]) tr.id = NH[i].ID; }); }
                }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'người học'); });
            }
            function luu() {
                var doi = nd.oDoi(h);
                if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
                ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Lưu điểm' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(doi.map(function (i) {
                        return { action: 'TP_XuLy/CapNhat_DiemPhachTheoDST', method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strNguoiThucHien_Id: uid(),
                            strThi_DanhSachSinhVien_Id: i.id.substring(7), strDiem: i.value.trim() };
                    }), { title: 'Đang lưu điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai2);
                });
            }
            function viPham() {
                var chon = Array.prototype.filter.call(h.querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                    .map(function (c) { return NH[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
                nd.viPham({ kieu: 'Sau', ds: chon, khoa: function (y) { return e(y.QLSV_NGUOIHOC_ID) + e(y.IDDANHSACHTHI); }, onDone: tai2 });
            }
            dlg.body.addEventListener('change', function (ev) {
                if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(h.querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            });
            dlg.body.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-h]'); if (!b) return;
                var a = b.getAttribute('data-h'), t = document.getElementById('tblTuiThi');
                if (a === 'tai') { if (t) ums.report.taiBangNhap(t); }
                else if (a === 'nhap') { if (t) ums.report.nhapBangTuTep({ onDone: function () { nd.danhDau(h); } }); }
                else if (a === 'congbo') nd.xacNhan({ loai: 'XACNHAN_CONGBODIEM_THI', tieuDe: 'Công bố', chuDe: 'Danh sách thi', id: x.ID, onDone: tai });
            });
            tai2();
        }

        root.addEventListener('change', function (ev) {
            if (!z('bang').contains(ev.target)) return;   // màn con nhập điểm cũng nằm trong root — ô "chọn tất cả" của nó tự lo
            if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('bang').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        root.addEventListener('click', function (ev) {
            var b;
            if ((b = ev.target.closest('[data-them]'))) {
                var w = b.closest('.nd-lhp'), mo = w.querySelector('.nd-lhp__du').hidden;
                w.querySelector('.nd-lhp__du').hidden = !mo; w.querySelector('.nd-lhp__ngan').hidden = mo; b.textContent = mo ? 'Thu gọn' : 'Xem thêm';
                return;
            }
            if ((b = ev.target.closest('[data-xls]'))) { xuatExcel(hien[Number(b.getAttribute('data-xls'))], b); return; }
            if ((b = ev.target.closest('[data-mo]'))) { moDanhSach(hien[Number(b.getAttribute('data-mo'))]); return; }
            if (!(b = ev.target.closest('[data-a]'))) return;
            var a = b.getAttribute('data-a');
            if (a === 'search') tai();
            else if (a === 'hoanthanh') {
                var chon = daChon();
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
                nd.xacNhan({ loai: 'XACNHAN_HOANTHANH_DIEMTHI', tieuDe: 'Xác nhận hoàn thành', chuDe: 'Điểm thi', id: chon[0].ID, ids: chon.map(function (x) { return x.ID; }), onDone: tai });
            }
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (ds.length) ve(); else tai(); } });
    };
})();
