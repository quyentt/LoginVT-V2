/* =========================================================================
   Lịch sử đăng ký học
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/lichsu.html + script/lichsu.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Năm · Kỳ · Đợt / từ khoá · Tìm kiếm)
   → khung "Danh sách lịch sử (n)" → khung "Danh sách kết quả (n)". Tìm kiếm (hoặc
   Enter ở ô từ khoá) nạp lại cả hai bảng. Chỉ xem, không ghi gì.

   Lời gọi (kiểu cũ, không mã hoá; GET; bản gốc để 'type' trong dữ liệu gửi đi):
       DKH_XuLy/LayKetQuaLichSuDangKyHoc   bảng lịch sử (phân trang máy chủ)
       DKH_XuLy/LayKetQuaDangKyHoc         bảng kết quả (phân trang máy chủ)
       tham số chung: strTuKhoa, strNam, strKy, strDot, strNguoiThucHien_Id, pageIndex, pageSize

   Khác bản gốc:
     · Hai bảng phân trang RIÊNG. Gốc dùng chung một biến trang toàn cục
       (edu.system.pageIndex_default) — lật trang bảng dưới rồi bấm Tìm kiếm thì
       bảng trên cũng nhảy sang trang đó.
     · Cột "Kỳ" giữ đúng cách ghép của gốc — bảng lịch sử: NAMHOC_HOCKY_DOTHOC;
       bảng kết quả: NAMHOC_HOCKY,DOTHOC (gốc ghép khác nhau ở hai bảng). NAMHOC
       rỗng thì để trống (gốc hiện chữ "undefined").
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.dkhLop, e = L.e;
    var root = document.getElementById('dkh-lichsu');
    if (!root) return;

    root.innerHTML = pat.page('Lịch sử', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-f="nam" placeholder="Năm" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="ky" placeholder="Kỳ" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="dot" placeholder="Đợt" autocomplete="off"></div>' +
            '</div><div class="ums-filter ums-u-mt-4">' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách lịch sử', icon: 'fa-building', count: 'nLS', flush: true, zone: 'ls', cls: 'ums-u-mb-4' }) +
        pat.panel({ title: 'Danh sách kết quả', icon: 'fa-building', count: 'nKQ', flush: true, zone: 'kq' });
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    function hoTen(r) { return ui.esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); }
    function cot(kyRender, coHanhDong) {
        var c = [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Kỳ', render: kyRender, cls: 'is-center is-nowrap' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Lớp học', prop: 'THONGTINLOPHOCPHAN' },
            { title: 'Thời gian đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người đăng ký', prop: 'NGUOITHUCHIEN_TAIKHOAN' }
        ];
        if (coHanhDong) c.push({ title: 'Hành động', prop: 'HANHDONG' }, { title: 'Kết quả', prop: 'ERR' });
        return c;
    }
    function kyLichSu(r) {
        var s = String(e(r.NAMHOC));
        if (r.HOCKY) s += '_' + r.HOCKY;
        if (r.DOTHOC) s += '_' + r.DOTHOC;
        return ui.esc(s);
    }
    function kyKetQua(r) {
        var s = String(e(r.NAMHOC));
        if (r.HOCKY) s += '_' + r.HOCKY;
        if (r.DOTHOC) s += ',' + r.DOTHOC;
        return ui.esc(s);
    }

    /* Mỗi bảng một trạng thái trang */
    function bang(k, action, columns) {
        var st = { trang: 1, co: 10, token: 0 };
        function tai(p) {
            if (p) st.trang = p;
            var my = ++st.token;
            z(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({
                action: action, method: 'GET', type: 'GET',
                strTuKhoa: f('q').value.trim(),
                strNam: f('nam').value.trim(),
                strKy: f('ky').value.trim(),
                strDot: f('dot').value.trim(),
                strNguoiThucHien_Id: '',
                pageIndex: st.trang,
                pageSize: st.co
            }).then(function (r) {
                if (my !== st.token) return;
                var rows = L.arr(r.data), tong = Number(r.pager) || rows.length;
                z(k === 'ls' ? 'nLS' : 'nKQ').textContent = '(' + tong + ')';
                ui.table({ el: z(k), rows: rows, columns: columns, empty: 'Không có dữ liệu',
                    page: { index: st.trang, size: st.co, total: tong,
                        onChange: function (p) { tai(p); },
                        onSize: function (s) { st.co = s; tai(1); } } });
            }).catch(function (err) {
                if (my !== st.token) return;
                z(k).innerHTML = ui.fail(err.message);
                ums.api.handle(err, action);
            });
        }
        return { tai: tai };
    }

    var ls = bang('ls', 'DKH_XuLy/LayKetQuaLichSuDangKyHoc', cot(kyLichSu, true));
    var kq = bang('kq', 'DKH_XuLy/LayKetQuaDangKyHoc', cot(kyKetQua, false));
    function tim() { ls.tai(1); kq.tai(1); }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"]');
        if (b) tim();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

    tim();
})();
