/* =========================================================================
   Tuyển sinh — module Hồ sơ: phần dùng chung của ba màn
       quanlyhoso · quanlyhosomorong · tochucthinhapdiem
   ---------------------------------------------------------------------------
   Ba bản gốc (ApisQuanlyTuyenSinh/Modules/hoso/script/QuanLyHoSo.js, quanlyhosomorong.js, tochucthi.js) chép
   nhau NGUYÊN khối thanh lọc (Năm · Kế hoạch tuyển sinh · Đợt · Hình thức · Hệ · Khóa · từ khoá) cùng các lời
   gọi nạp ô chọn, và hai màn quản lý hồ sơ chép nhau thêm: xoá hồ sơ, "Thêm mới" (mở trang nhập hồ sơ bằng vé),
   nút sửa (liên kết trang tuyensinh.aspx), tệp của trường thông tin. Tệp này gom các phần đó.

   ums.tsHoSo = {
       e(v) · uid() · cn() · rows(call)            tiện ích (returnEmpty, userId, chức năng, mảng dòng)
       nam()                                     TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach   GET → NAM
       keHoach(nam)                              TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung      GET → TEN
       he(kh) · khoa(kh, he)                     TS_HeDaoTao/LayDanhSach · TS_KhoaDaoTao/LayDanhSach GET → TENHEDAOTAO · TENKHOA
       dotDoiTuong(kh)                           TS_Dot_DoiTuong/LayDanhSach  (QuanLyHoSo: một lời gọi đổ CẢ Đợt lẫn Hình thức)
       dot(kh) · doiTuong(kh)                    TS_Dot_DoiTuong/LayDSTS_Dot · LayDSTS_DoiTuong      (hai màn còn lại)
       locFields(o) / noiLoc(root, o)            thanh lọc + nối tầng (xem dưới)
       ganChon(host, attr) · chon(host, attr) · cotChon(attr, idCol, nameCol)
                                                 cột ô đánh dấu CUỐI / ĐẦU bảng + "chọn tất cả" (checkedAll_BgRow)
       hang(jobs, n)                             chạy các lời gọi "mỗi ô một lời gọi" n luồng (gốc bắn một lượt)
       tep(duLieuId) · tepHtml(ds)               SV_Files/LayDanhSach (edu.system.viewFiles … "SV_Files") — chỉ xem
       duongDan()                                configTS().path nếu có, không thì strhost (me.strPath của gốc)
       suaLink(id)                               nút sửa = liên kết <strPath>/pages/tuyensinh.aspx?userId=&strSinhVien_Id= (tab mới)
       themMoi(duoi)                             CMS_Token/CreateTicket → mở <strPath><duoi>?ticket=…&langid= (getUrl_NguyenVong)
       xoaHoSo(ids) → Promise                    TS_TaiKhoan/XoaDuLieuTuyenSinh  mỗi hồ sơ một lời gọi (strIds)
       gopFile(arrUrl, arrTen)                   CMS_Files/GopFile → mở tệp nén
   }

   Nối tầng (luật cha → con, KHÁC gốc):
       Kế hoạch → Hệ → Khóa · Kế hoạch → Đợt · Kế hoạch → Hình thức · (o.namKH) Năm → Kế hoạch.
       Gốc: chọn Kế hoạch nạp Hệ VÀ Khóa (Khóa theo Hệ CŨ đang chọn), chọn Hệ KHÔNG nạp lại Khóa → ở đây chọn Hệ
       thì nạp Khóa theo Hệ (làm theo ý định: TS_KhoaDaoTao/LayDanhSach có nhận strDaoTao_HeDaoTao_Id).
   Giá trị ô rỗng gửi '' (edu.util.getValById + $.param của gốc gửi "khoa=" chứ không bỏ khoá); ô chọn nhiều gửi
   các id nối dấu phẩy như getValById.
   Nợ tầng chung: cột ô đánh dấu + chọn tất cả cho ui.table (thêm một bản); hàng đợi N luồng (thêm một bản);
   ums.files chưa có kiểu "chỉ đọc lấy danh sách về" (tep / tepHtml tự viết lại khung .ums-files).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var T = {};

    T.e = function (v) { return v === undefined || v === null ? '' : String(v); };
    T.uid = function () { return (ums.session && ums.session.userId) || ''; };
    T.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    T.demo = function () { return !!(ums.state && ums.state.mode === 'demo'); };
    T.rows = function (call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    };
    T.loi = function (noi) { return function (err) { ums.api.handle(err, noi); return []; }; };

    /* ---------- Nguồn ô chọn (chép nguyên tham số) ---------- */
    T.nam = function () {
        return T.rows({ action: 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach', method: 'GET', strNguoiThucHien_Id: T.uid() });
    };
    T.keHoach = function (nam) {
        return T.rows({ action: 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung', method: 'GET', strTuKhoa: '',
            strNguoiDung_Id: T.uid(), strNam: T.e(nam), pageIndex: 1, pageSize: 100000 });
    };
    T.he = function (kh) {
        return T.rows({ action: 'TS_HeDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: T.cn(), strNguoiThucHien_Id: T.uid(),
            strTS_KeHoachTuyenSinh_Id: T.e(kh) });
    };
    T.khoa = function (kh, he) {
        return T.rows({ action: 'TS_KhoaDaoTao/LayDanhSach', method: 'GET', strChucNang_Id: T.cn(), strNguoiThucHien_Id: T.uid(),
            strDaoTao_HeDaoTao_Id: T.e(he), strTS_KeHoachTuyenSinh_Id: T.e(kh) });
    };
    function dotCall(ten, kh) {
        return { action: 'TS_Dot_DoiTuong/' + ten, method: 'GET', strTuKhoa: '', strDoiTuongDuTuyen_Id: '', strDotTuyenSinh_Id: '',
            strTS_KeHoachTuyenSinh_Id: T.e(kh), strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 };
    }
    T.dotDoiTuong = function (kh) { return T.rows(dotCall('LayDanhSach', kh)); };
    T.dot = function (kh) { return T.rows(dotCall('LayDSTS_Dot', kh)); };
    T.doiTuong = function (kh) { return T.rows(dotCall('LayDSTS_DoiTuong', kh)); };
    /** Bỏ dòng trùng id (một lời gọi TS_Dot_DoiTuong/LayDanhSach trả mỗi cặp Đợt × Đối tượng một dòng) */
    T.khongTrung = function (rows, id) {
        var da = {};
        return rows.filter(function (r) { var k = T.e(r[id]); if (!k || da[k]) return false; da[k] = 1; return true; });
    };

    /* ---------- Thanh lọc ----------
       T.locFields({ multi, them: [field…] }) → mảng trường cho pat.filterBar
       var L = T.noiLoc(root, { namKH, gop, onKH, onDot, onHT, onTim });
         namKH  Năm → Kế hoạch (chọn năm nạp lại kế hoạch — quanlyhosomorong); không thì Năm là ô lọc độc lập
         gop    Đợt + Hình thức lấy từ MỘT lời gọi TS_Dot_DoiTuong/LayDanhSach (QuanLyHoSo)
         L.v(k) giá trị gửi đi ('' khi trống, ô chọn nhiều nối dấu phẩy) · L.chu(k) chữ đang chọn · L.f(k) phần tử */
    T.locFields = function (o) {
        o = o || {};
        return [
            { key: 'nam', label: 'Chọn năm', type: 'select' },
            { key: 'kh', label: 'Chọn kế hoạch tuyển sinh', type: 'select' },
            { key: 'dot', label: 'Chọn đợt đối tượng', type: 'select', multiple: !!o.multi },
            { key: 'ht', label: 'Chọn hình thức', type: 'select', multiple: !!o.multi },
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
            { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' }
        ].concat(o.them || []).concat([{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }]);
    };

    T.noiLoc = function (root, o) {
        o = o || {};
        var jq = window.jQuery;
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) {
            var el = f(k);
            if (!el) return '';
            if (el.multiple) return (jq ? jq(el).val() || [] : []).filter(function (x) { return x && x !== 'SELECTALL'; }).join(',');
            return String(el.value || '').trim();
        }
        function chu(k) {
            var el = f(k);
            if (!el) return '';
            return Array.prototype.filter.call(el.options, function (x) { return x.selected && x.value; })
                .map(function (x) { return x.textContent; }).join(', ');
        }
        var L = { f: f, v: v, chu: chu };

        L.napKH = function () {
            if (o.namKH && !v('nam')) { pat.fill(f('kh'), []); return Promise.resolve([]); }
            return T.keHoach(v('nam')).then(function (r) { pat.fill(f('kh'), r, { name: 'TEN' }); return r; }, T.loi('kế hoạch tuyển sinh'));
        };
        function napHe() {
            if (!v('kh')) { pat.fill(f('he'), []); return Promise.resolve(); }
            return T.he(v('kh')).then(function (r) { pat.fill(f('he'), r, { name: 'TENHEDAOTAO' }); }, T.loi('hệ đào tạo'));
        }
        function napKhoa() {
            if (!v('he')) { pat.fill(f('khoa'), []); return Promise.resolve(); }
            return T.khoa(v('kh'), v('he')).then(function (r) { pat.fill(f('khoa'), r, { name: 'TENKHOA' }); }, T.loi('khóa đào tạo'));
        }
        function napDotHT() {
            var kh = v('kh');
            if (!kh) { pat.fill(f('dot'), []); pat.fill(f('ht'), []); return Promise.resolve(); }
            if (o.gop) {
                return T.dotDoiTuong(kh).then(function (r) {
                    pat.fill(f('dot'), T.khongTrung(r, 'DOTTUYENSINH_ID'), { id: 'DOTTUYENSINH_ID', name: 'DOTTUYENSINH_TEN' });
                    pat.fill(f('ht'), T.khongTrung(r, 'DOITUONGDUTUYEN_ID'), { id: 'DOITUONGDUTUYEN_ID', name: 'DOITUONGDUTUYEN_TEN' });
                }, T.loi('đợt / đối tượng'));
            }
            return Promise.all([
                T.doiTuong(kh).then(function (r) { pat.fill(f('ht'), r, { id: 'DOITUONGDUTUYEN_ID', name: 'DOITUONGDUTUYEN_TEN' }); }, T.loi('hình thức')),
                T.dot(kh).then(function (r) { pat.fill(f('dot'), r, { id: 'DOTTUYENSINH_ID', name: 'DOTTUYENSINH_TEN' }); }, T.loi('đợt tuyển sinh'))
            ]);
        }
        L.nap = { he: napHe, khoa: napKhoa, dotHT: napDotHT };

        T.nam().then(function (r) { pat.fill(f('nam'), r, { id: 'NAM', name: 'NAM' }); }, T.loi('năm'));
        if (!o.namKH) L.napKH();

        if (jq) {
            if (o.namKH) jq(f('nam')).on('select2:select select2:clear', function () { L.napKH(); });
            jq(f('kh')).on('select2:select select2:clear', function () {
                Promise.all([napHe().then(napKhoa), napDotHT()]).then(function () { if (o.onKH) o.onKH(); });
                if (o.onKHNgay) o.onKHNgay();
            });
            jq(f('he')).on('select2:select select2:clear', function () { napKhoa(); });
            jq(f('dot')).on('select2:select select2:unselect select2:clear', function () { if (o.onDot) o.onDot(); });
            jq(f('ht')).on('select2:select select2:unselect select2:clear', function () { if (o.onHT) o.onHT(); });
        }
        if (o.namKH) pat.chain([f('nam'), f('kh')], { phatLai: false });
        pat.chain([f('kh'), f('he'), f('khoa')], { phatLai: false });
        pat.chain([f('kh'), f('dot')], { phatLai: false });
        pat.chain([f('kh'), f('ht')], { phatLai: false });

        root.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-a="search"]') && root.contains(ev.target) && o.onTim) o.onTim();
        });
        var q = f('q');
        if (q) q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); if (o.onTim) o.onTim(); } });
        return L;
    };

    /* ---------- Cột ô đánh dấu + chọn tất cả ---------- */
    T.cotChon = function (attr, idCol, nameCol) {
        return {
            head: '<input type="checkbox" data-all="' + attr + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) {
                return '<input type="checkbox" ' + attr + '="' + esc(T.e(r[idCol || 'ID'])) + '"' +
                    (nameCol ? ' data-name="' + esc(T.e(r[nameCol])) + '"' : '') + '>';
            }
        };
    };
    T.ganChon = function (host, attr) {
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches || !t.matches('[data-all="' + attr + '"]')) return;
            var tb = t.closest('table') || host;
            Array.prototype.forEach.call(tb.querySelectorAll('tbody input[' + attr + ']'), function (x) {
                if (x.disabled) return;
                x.checked = t.checked;
                var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked);
            });
        });
    };
    /** [{ id, name }] các dòng đã đánh dấu */
    T.chon = function (host, attr) {
        return Array.prototype.filter.call(host.querySelectorAll('tbody input[' + attr + ']'), function (x) { return x.checked; })
            .map(function (x) { return { id: x.getAttribute(attr), name: x.getAttribute('data-name') || '' }; });
    };

    /* ---------- Hàng đợi n luồng ---------- */
    T.hang = function (jobs, n) {
        var i = 0;
        function next() {
            if (i >= jobs.length) return Promise.resolve();
            var j = jobs[i++];
            return Promise.resolve().then(j).catch(function () { /* lỗi một ô thì để trống ô đó */ }).then(next);
        }
        var ps = [];
        for (var k = 0; k < Math.min(n || 6, jobs.length); k++) ps.push(next());
        return Promise.all(ps);
    };

    /* ---------- Tệp của một trường thông tin (chỉ xem) ---------- */
    T.tep = function (duLieuId) {
        return T.rows({ action: 'SV_Files/LayDanhSach', method: 'GET', strDuLieu_Id: duLieuId }).then(function (r) {
            return r.filter(function (x) { return x.FILEMINHCHUNG; }).map(function (x) {
                return { path: x.FILEMINHCHUNG, name: T.e(x.TENHIENTHI) || String(x.FILEMINHCHUNG).split('/').pop() };
            });
        });
    };
    T.tepHtml = function (ds) {
        if (!ds || !ds.length) return '';
        return '<div class="ums-files"><div class="ums-files__list">' + ds.map(function (f) {
            return '<div class="ums-files__item"><i class="fa-light fa-file ums-files__ic"></i>' +
                (T.demo() ? '<span class="ums-files__name">' + esc(f.name) + '</span>'
                    : '<a class="ums-files__name" href="' + esc(ums.files.url(f.path)) + '" target="_blank" rel="noopener">' + esc(f.name) + '</a>') +
                '</div>';
        }).join('') + '</div></div>';
    };

    /* ---------- Trang nhập hồ sơ tuyển sinh (ngoài UMS) ---------- */
    T.duongDan = function () {
        if (typeof window.configTS === 'function') {
            try { return window.configTS().path || ''; } catch (err) { /* rơi về strhost */ }
        }
        return (ums.session && ums.session.host) || location.origin;
    };
    T.suaLink = function (id) {
        var url = T.duongDan() + '/pages/tuyensinh.aspx?userId=' + encodeURIComponent(T.uid()) + '&strSinhVien_Id=' + encodeURIComponent(T.e(id));
        return '<a class="ums-iconbtn ums-iconbtn--edit" href="' + esc(url) + '" target="_blank" rel="noopener" title="Sửa">' +
            '<i class="fa-light fa-pen-to-square"></i></a>';
    };
    /** getUrl_NguyenVong — xin vé đăng nhập rồi mở trang nhập hồ sơ ở tab mới.
        Khác gốc: mở tab trống NGAY lúc bấm (trình duyệt chặn cửa sổ mở sau lời gọi bất đồng bộ), có vé thì gán địa chỉ. */
    T.themMoi = function (duoi) {
        var ve = ums.util && ums.util.uuid ? ums.util.uuid() : String(Date.now());
        var url = T.duongDan() + duoi + '?ticket=' + ve + '&langid=';
        if (T.demo()) {
            ui.toast('Dựng thử — trên máy chủ thật sẽ mở trang nhập hồ sơ: ' + url, 'info', { title: 'Thêm mới', timeout: 8000 });
            return;
        }
        var win = window.open('', '_blank');
        ums.api.call({ action: 'CMS_Token/CreateTicket', strUser_Id: T.uid(), strTicket_Id: ve, strApp_Id: '' }).then(function () {
            if (!win) { ui.toast('Hãy cho phép mở tab mới trên trình duyệt của bạn!', 'warn'); return; }
            win.location.href = url;
            win.focus();
        }).catch(function (err) {
            if (win) win.close();
            ums.api.handle(err, 'tạo vé đăng nhập');
        });
    };

    /* ---------- Xoá hồ sơ (btnXoaQuanLyHoSo) ---------- */
    T.xoaHoSo = function (ids) {
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return Promise.resolve(false); }
        return ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' hồ sơ đã chọn không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá hồ sơ' }).then(function (yes) {
            if (!yes) return false;
            return ui.batch(ids.map(function (id) {
                return { action: 'TS_TaiKhoan/XoaDuLieuTuyenSinh', strIds: id, strChucNang_Id: T.cn(), strNguoiThucHien_Id: T.uid() };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!', show: true }).then(function () { return true; });
        });
    };

    /* ---------- Gộp tệp (btnDownloadAllFile) ---------- */
    T.gopFile = function (arrUrl, arrTen) {
        if (!arrUrl.length) { ui.toast('Không có tệp nào để tải', 'warn'); return; }
        ums.api.call({ action: 'CMS_Files/GopFile', arrTuKhoa: arrUrl, arrDuLieu: arrTen, strNguoiThucHien_Id: T.uid() }).then(function (r) {
            var d = r.data;
            if (!d || typeof d !== 'string') return;
            if (T.demo()) { ui.toast('Dựng thử — trên máy chủ thật sẽ tải: ' + d, 'info'); return; }
            window.open(ums.files.url(d));
        }).catch(function (err) { ums.api.handle(err, 'gộp tệp'); });
    };

    ums.tsHoSo = T;
})();
