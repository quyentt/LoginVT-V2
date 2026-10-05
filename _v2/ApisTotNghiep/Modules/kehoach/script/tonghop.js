/* =========================================================================
   Tổng hợp kết quả xét tốt nghiệp
   Bản gốc: ApisTotNghiep/Modules/kehoach/html/tonghop.html + script/tonghop.js (vỏ indexi)
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp — CHỌN NHIỀU / Khoa quản lý (chọn nhiều)
   · Phân loại · từ khoá · Tìm kiếm / Xuất báo cáo) → khung "Danh sách kế hoạch (n)" với bảng người học.
   Bản Học bổng tương ứng: _v2/ApisHocBong/Modules/kehoach/script/tonghop.js (cùng khung ums.hbTh).

   Lời gọi (chép nguyên):
       TN_XacNhan/LayDSTinhTrangQuyDinhCuoi GET (strPhanLoai_Id) — tình trạng quy định; gọi TRƯỚC mỗi lần tìm (như gốc),
            xong mới lấy danh sách. Gốc chỉ dùng kết quả để thêm TIÊU ĐỀ cột (xem "Khác gốc").
       TN_KetQua_CongNhan/LayDanhSach GET, phân trang máy chủ: strTuKhoa · strPhanLoai_Id · strDaoTao_HeDaoTao_Id
            · strDaoTao_KhoaDaoTao_Id · strDaoTao_ChuongTrinh_Id · strDaoTao_KhoaQuanLy_Id · strDaoTao_LopQuanLy_Id
            (ô nhiều → "a,b") · strNguoiDung_Id '' · strNguoiTao_Id '' (gốc đọc dropAAAA).
            Cột: QLSV_NGUOIHOC_MASO · Họ đệm + Tên · QLSV_NGUOIHOC_NGAYSINH · DAOTAO_LOPQUANLY_TEN · DAOTAO_CHUONGTRINH_TEN
            · DAOTAO_KHOADAOTAO_TEN · KHOAQUANLY_TEN · DAOTAO_HEDAOTAO_TEN · XEPLOAI_TEN · XEPLOAI_THAYDOI · KETQUAXACNHAN_TEN.
       Phân loại: danh mục TN.PHANLOAI (loadToCombo_DanhMucDuLieu) — chọn là tìm lại (như gốc).
       Hệ → Khoá → CT → Lớp: ums.hbTh.dt (Học bổng _th.js — cùng edu.system.getList_* KHÔNG lọc quyền, cùng thứ tự nạp
            lại như gốc: Hệ → Khoá (+ Lớp), Khoá → CT (+ Lớp), CT → Lớp); Khoa QL: ums.ref.khoaQuanLy.
       Xuất báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TH", không có vùng _Import) — cặp addKeyValue chép
            nguyên (gốc chép từ màn NCKH: mọi ô đọc KHÔNG có trên màn → rỗng; iTrangThai = 1).

   Khác gốc:
     · Cột kết quả: gốc thêm vào TIÊU ĐỀ mỗi tình trạng quy định một cột, nhưng thân bảng chỉ có MỘT cột KETQUAXACNHAN_TEN
       (vòng tạo cột động + getList_KetQua đã bị chú thích) → có hơn một tình trạng là tiêu đề lệch thân. Bản mới vẽ MỘT cột
       KETQUAXACNHAN_TEN, tiêu đề là tên các tình trạng quy định nối " / " (không có tình trạng nào → "Kết quả xác nhận").
     · Hệ → Khoá → CT → Lớp theo luật cha → con (khoá tầng dưới tới khi chọn; xoá tầng trên thì xoá tầng dưới).
   Cố ý bỏ (mã chết): getList_KetQua (TN_KetQua/LayKetQuaXacNhanCuoi — không ai gọi), getList_NamNhapHoc / getList_PhanLoai
     (LayDSPhanLoaiXetTheoND2) / getList_ThoiGianDaoTao / genList_TrangThaiSV (không ai gọi hoặc ô không tồn tại), cột
     Đào tạo · Tài chính · Công tác HSSV · KTX · Hoàn thành (đã chú thích trong html gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.hbTh, esc = ui.esc;
    var root = document.getElementById('tn-tonghop');
    if (!root) return;

    function sel(k, ph, nhieu) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"' +
            (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
    }
    root.innerHTML = pat.page('Tổng hợp', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('he', 'Tất cả hệ đào tạo', true) + sel('khoa', 'Tất cả khóa đào tạo', true) +
                sel('ct', 'Tất cả chương trình đào tạo', true) + sel('lop', 'Tất cả lớp', true) +
            '</div><div class="ums-filter ums-u-mt-3">' +
                sel('kql', 'Tất cả khoa quản lý', true) + sel('pl', 'Chọn phân loại') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-file-certificate', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var dt = K.dt({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop') });
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
    ums.api.dm('TN.PHANLOAI').then(function (d) { pat.fill(f('pl'), d, { name: 'TEN', head: 'Chọn phân loại' }); })
        .catch(function (err) { ums.api.handle(err, 'phân loại'); });

    ums.report.mount(z('bc'), { import: false, collect: function (add) {
        var p = {
            strTuKhoa: '', iTrangThai: 1, strCanBoNhap_Id: '', strNCKH_QuanLyDeTai_Id: '', strDaoTao_CoCauToChuc_Id: '',
            strnckh_detai_thanhvien_id: '', strVaiTro_Id: '', strDonViCuaThanhVien_Id: '', strLoaiHocVi_Id: '',
            strLoaiChucDanh_Id: '', strCapKhenThuong_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: ''
        };
        Object.keys(p).forEach(function (k) { add(k, p[k]); });
    } });

    var tinhTrang = [], trang = { index: 1, size: 10 }, luot = 0;

    function tai(p) {
        if (p) trang.index = p;
        var sh = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'TN_KetQua_CongNhan/LayDanhSach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(),
            strPhanLoai_Id: pat.val(f('pl')),
            strDaoTao_HeDaoTao_Id: dt.gtri('he'),
            strDaoTao_KhoaDaoTao_Id: dt.gtri('khoa'),
            strDaoTao_ChuongTrinh_Id: dt.gtri('ct'),
            strDaoTao_KhoaQuanLy_Id: pat.val(f('kql')),
            strDaoTao_LopQuanLy_Id: dt.gtri('lop'),
            strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: trang.index, pageSize: trang.size
        }).then(function (r) {
            if (sh !== luot) return;
            ve(K.arr(r.data), Number(r.pager) || 0);
        }).catch(function (err) {
            if (sh !== luot) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'TN_KetQua_CongNhan/LayDanhSach');
        });
    }

    function ve(rs, tong) {
        var tenKQ = tinhTrang.map(function (t) { return K.e(t.TEN); }).filter(function (t) { return t; }).join(' / ') || 'Kết quả xác nhận';
        ui.table({ el: z('bang'), rows: rs, stt: true, empty: 'Không có dữ liệu',
            columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(K.hoTen(r)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
                { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
                { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
                { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' },
                { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
                { title: 'Xếp loại điều chỉnh', prop: 'XEPLOAI_THAYDOI' },
                { title: tenKQ, prop: 'KETQUAXACNHAN_TEN', cls: 'is-center' }
            ],
            page: { index: trang.index, size: trang.size, total: tong || rs.length,
                onChange: function (p) { tai(p); },
                onSize: function (s) { trang.size = s === 'all' ? ui.PAGE_ALL : Number(s); tai(1); } } });
        z('n').textContent = '(' + (tong || rs.length) + ')';
    }

    /* getList_TinhTrangQuyDinh gốc: lấy tình trạng quy định theo phân loại, xong mới lấy danh sách */
    function tim() {
        var sh = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'TN_XacNhan/LayDSTinhTrangQuyDinhCuoi', method: 'GET', strPhanLoai_Id: pat.val(f('pl')) })
            .then(function (r) {
                if (sh !== luot) return;
                tinhTrang = K.arr(r.data);
                tai(1);
            })
            .catch(function (err) {
                if (sh !== luot) return;
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'TN_XacNhan/LayDSTinhTrangQuyDinhCuoi');
            });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"]');
        if (b && root.contains(b)) tim();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
    jQuery(f('pl')).on('select2:select', tim);

    tim();          // gốc: init gọi getList_TinhTrangQuyDinh → nạp danh sách ngay khi mở màn
})();
