/* =========================================================================
   Thi phách — Tra cứu lịch thi - phách (CHỈ XEM)
   Bản gốc: ApisThiPhach/Modules/kehoach/html/tracuulichthi.html + script/tracuulichthi.js
   Bố cục gốc: MỘT cột — thanh lọc (Học kỳ · Từ khoá · Tìm kiếm) + bảng "Danh sách" 15 cột.
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, GET, không func, không iM — chép nguyên):
       SV_ThongTin/LayDSThoiGianLichThi   ô Học kỳ (ID, THOIGIAN) — chỉ strNguoiThucHien_Id
       SV_ThongTin/LayDSLichThi_Phach     danh sách:
           strQLSV_NguoiHoc             = ô từ khoá (mã / tên người học)
           strDaoTao_ThoiGianDaoTao_Id  = ô Học kỳ
           strDaoTao_HocPhan_Id         = ''  (gốc đọc ô dropAAAA không tồn tại)
       Số ở tiêu đề khung = Pager máy chủ trả (gốc: lblTraCuuLichThi_Tong), không có thì đếm dòng.
   Giữ như gốc:
     · Mở màn KHÔNG tự tải (lời gọi getList_TraCuuLichThi() trong init bị chú thích bỏ); bấm Tìm kiếm / Enter mới tải.
     · Không bắt chọn Học kỳ, không phân trang (gốc chú thích bỏ bPaginate).
     · Tên cột lệch tiêu đề chép NGUYÊN: cột "Hình thức thi" đọc DANGKY_LOPHOCPHAN_TEN, "Lớp học phần" đọc LOPTINCHI_TEN,
       "Ngày thi" đọc NGAYHOC. Cột sinh viên ghép "Họ đệm - Tên - Mã số".
   Không chép:
     · loadToCombo_DanhMucDuLieu("KHCT.LOAICHUONGTRINH", "dropSearch_MoHinhHoc,dropMoHinhHoc") — hai ô không có trên màn.
     · Phút không đệm số 0 ("7h0 --> 9h30") → "07:00 -> 09:30" (cùng kiểu màn Lịch coi thi của Cổng cán bộ).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tp-tracuulichthi');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function hai(n) { n = e(n); return n === '' ? '' : (String(n).length < 2 ? '0' : '') + n; }

    root.innerHTML = pat.page('Tra cứu lịch thi - phách', '') +
        pat.filterBar([
            { key: 'tg', type: 'select', label: 'Chọn học kỳ' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
            body: ui.empty('Chọn học kỳ, nhập mã hoặc tên người học rồi bấm Tìm kiếm', 'fa-magnifying-glass') });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var COT = [
        { title: 'Mã học phần', prop: 'MAHOCPHAN', cls: 'is-nowrap' },
        { title: 'Tên học phần', prop: 'TENHOCPHAN' },
        { title: 'Ngày thi', prop: 'NGAYHOC', cls: 'is-center is-nowrap' },
        { title: 'Thời gian thi', cls: 'is-center is-nowrap', render: function (x) {
            if (e(x.GIOBATDAU) === '' && e(x.GIOKETTHUC) === '') return '';
            return ui.esc(hai(x.GIOBATDAU) + ':' + hai(x.PHUTBATDAU) + ' -> ' + hai(x.GIOKETTHUC) + ':' + hai(x.PHUTKETTHUC));
        } },
        { title: 'Hình thức thi', prop: 'DANGKY_LOPHOCPHAN_TEN' },
        { title: 'Phòng thi', prop: 'PHONGHOC_TEN', cls: 'is-center' },
        { title: 'Ca thi', prop: 'CATHI', cls: 'is-center' },
        { title: 'Đợt thi', prop: 'TENDOTTHI', cls: 'is-nowrap' },
        { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
        { title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' },
        { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
        { title: 'Ngày nhập điểm', prop: 'NGAYNHAPDIEM', cls: 'is-center is-nowrap' },
        { title: 'Túi bài', prop: 'TUIBAI_TEN', cls: 'is-nowrap' },
        { title: 'Lớp học phần', prop: 'LOPTINCHI_TEN', cls: 'is-nowrap' },
        { title: 'Thông tin sinh viên (Họ tên, mã số)', cls: 'is-nowrap', render: function (x) {
            return ui.esc(e(x.QLSV_NGUOIHOC_HODEM) + ' - ' + e(x.QLSV_NGUOIHOC_TEN) + ' - ' + e(x.QLSV_NGUOIHOC_MASO));
        } }
    ];

    ums.api.call({ action: 'SV_ThongTin/LayDSThoiGianLichThi', method: 'GET', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn học kỳ' }); })
        .catch(function (err) { ums.api.handle(err, 'học kỳ'); });

    var lan = 0;
    function tai() {
        var toi = ++lan;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'SV_ThongTin/LayDSLichThi_Phach', method: 'GET',
            strQLSV_NguoiHoc: f('q').value.trim(),
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value,
            strDaoTao_HocPhan_Id: ''
        }).then(function (r) {
            if (toi !== lan) return;
            var ds = arr(r.data);
            z('n').textContent = '(' + ui.so(r.pager || ds.length) + ')';
            ui.table({ el: z('bang'), rows: ds, columns: COT, empty: 'Không có lịch thi' });
        }).catch(function (err) {
            if (toi !== lan) return;
            z('n').textContent = '';
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'lịch thi');
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"]');
        if (b) tai();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
})();
