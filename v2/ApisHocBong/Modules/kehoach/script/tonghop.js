/* =========================================================================
   Tổng hợp kết quả xét học bổng
   Bản gốc: ApisHocBong/Modules/kehoach/html/tonghop.html + script/tonghop.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp — CHỌN NHIỀU / Khoa quản lý
   (chọn nhiều) · Quỹ học bổng · từ khoá · Tìm kiếm / Xuất báo cáo) → khung "Danh sách kế hoạch (n)"
   với bảng người học + MỖI tình trạng quy định một cột (thêm động vào tiêu đề).

   Lời gọi (chép nguyên):
       HB_XacNhanKetQua/LayDSTinhTrangQuyDinhCuoi GET (strHB_QuyHocBong_Id) — các cột tình trạng;
            gọi TRƯỚC mỗi lần Tìm kiếm (như gốc), xong mới lấy danh sách.
       HB_KetQua/LayDSHB_KetQua_CongNhan GET, phân trang máy chủ (pageSize mặc định 10):
            strTuKhoa, strHB_QuyHocBong_Id, strPhanLoai_Id (''), strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id,
            strDaoTao_ChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id, strDaoTao_LopQuanLy_Id (ô nhiều → "a,b"),
            strNguoiDung_Id (''), strNguoiTao_Id ('').
       HB_KetQua/LayKetQuaXacNhanCuoi GET — MỘT lời gọi cho MỖI ô (người học × tình trạng):
            strSanPham_Id = ID dòng, strPhanLoai_Id = ID tình trạng → KETQUAXACNHAN_TEN (dòng cuối thắng
            như gốc .html()); chạy 10 luồng, tìm lại / đổi trang giữa chừng thì bỏ lượt cũ; lỗi im lặng
            (gốc chỉ console.log).
       Danh mục: ums.hbTh (../script/_th.js) — Hệ / Khoá / CT / Lớp, quỹ học bổng; khoa quản lý ums.ref.khoaQuanLy.
       Xuất báo cáo: ums.report.mount (getList_MauImport "zonebtnBaoCao_TH") — cặp addKeyValue chép nguyên
            (gốc chép từ màn NCKH: mọi ô đọc KHÔNG có trên màn → rỗng; iTrangThai = 1).

   Khác gốc:
     · Ô từ khoá: gốc gửi strTuKhoa đọc ô 'txtAAAA' (không tồn tại) → từ khoá gõ vào không bao giờ
       được gửi. Bản mới gửi giá trị ô từ khoá (ghi can-quyet: kiểm procedure có lọc theo strTuKhoa).
     · Hệ → Khoá → CT → Lớp: gốc KHÔNG gắn trình xử lý nào (getList_ChuongTrinhDaoTao không ai gọi,
       getList_LopQuanLy bị chú thích) → ô CT và Lớp luôn trống, ô Khoá là mọi khoá. Bản mới nối tầng
       như các màn anh em (quanlythongtin, phanbohocbong) + luật cha → con (khoá tầng dưới tới khi chọn).
     · strPhanLoai_Id: gốc nạp danh mục TN.PHANLOAI vào ô dropSearch_PhanLoai KHÔNG có trên màn → gửi ''.
   Cố ý bỏ (mã chết): getList_NamNhapHoc / getList_PhanLoai / getList_ThoiGianDaoTao / genList_TrangThaiSV
     (không ai gọi hoặc ô không tồn tại), cột Đào tạo · Tài chính · Công tác HSSV · KTX · Hoàn thành
     (đã chú thích trong html gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.hbTh, esc = ui.esc;
    var root = document.getElementById('hb-tonghop');
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
                sel('kql', 'Tất cả khoa quản lý', true) + sel('quy', 'Chọn quỹ học bổng') +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách kế hoạch', icon: 'fa-clipboard-list-check', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var dt = K.dt({ he: f('he'), khoa: f('khoa'), ct: f('ct'), lop: f('lop') });
    ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
    K.quy(f('quy'));

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
        ums.api.call({ action: 'HB_KetQua/LayDSHB_KetQua_CongNhan', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(),
            strHB_QuyHocBong_Id: pat.val(f('quy')),
            strPhanLoai_Id: '',
            strDaoTao_HeDaoTao_Id: dt.gtri('he'),
            strDaoTao_KhoaDaoTao_Id: dt.gtri('khoa'),
            strDaoTao_ChuongTrinh_Id: dt.gtri('ct'),
            strDaoTao_KhoaQuanLy_Id: pat.val(f('kql')),
            strDaoTao_LopQuanLy_Id: dt.gtri('lop'),
            strNguoiDung_Id: '', strNguoiTao_Id: '',
            pageIndex: trang.index, pageSize: trang.size
        }).then(function (r) {
            if (sh !== luot) return;
            ve(sh, K.arr(r.data), Number(r.pager) || 0);
        }).catch(function (err) {
            if (sh !== luot) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'HB_KetQua/LayDSHB_KetQua_CongNhan');
        });
    }

    function ve(sh, rs, tong) {
        var cot = [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: function (r) { return esc(K.hoTen(r)); } },
            { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-nowrap' },
            { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
            { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
            { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
            { title: 'Xếp loại điều chỉnh', prop: 'XEPLOAI_THAYDOI' }
        ];
        tinhTrang.forEach(function (t, j) {
            cot.push({ title: K.e(t.TEN), cls: 'is-center', render: function (r, i) { return '<span data-kq="' + i + '|' + j + '"></span>'; } });
        });
        ui.table({ el: z('bang'), rows: rs, columns: cot, empty: 'Không có dữ liệu',
            page: { index: trang.index, size: trang.size, total: tong || rs.length,
                onChange: function (p) { tai(p); },
                onSize: function (s) { trang.size = s; tai(1); } } });
        z('n').textContent = '(' + (tong || rs.length) + ')';

        var bang = z('bang'), viec = [];
        rs.forEach(function (sv, i) {
            tinhTrang.forEach(function (t, j) {
                viec.push(function () {
                    return ums.api.call({ action: 'HB_KetQua/LayKetQuaXacNhanCuoi', method: 'GET', silent: true,
                        strSanPham_Id: sv.ID, strPhanLoai_Id: t.ID })
                        .then(function (r) {
                            if (sh !== luot) return;
                            var o = bang.querySelector('[data-kq="' + i + '|' + j + '"]');
                            K.arr(r.data).forEach(function (x) { if (o) o.innerHTML = ui.escBr(x.KETQUAXACNHAN_TEN); });
                        }, function () { /* gốc: console.log, không báo */ });
                });
            });
        });
        K.chay(viec, 10, function () { return sh === luot; });
    }

    /* getList_TinhTrangQuyDinh gốc: lấy cột tình trạng theo quỹ, xong mới lấy danh sách */
    function tim() {
        var sh = ++luot;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'HB_XacNhanKetQua/LayDSTinhTrangQuyDinhCuoi', method: 'GET',
            strHB_QuyHocBong_Id: pat.val(f('quy')) })
            .then(function (r) {
                if (sh !== luot) return;
                tinhTrang = K.arr(r.data);
                tai(1);
            })
            .catch(function (err) {
                if (sh !== luot) return;
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'HB_XacNhanKetQua/LayDSTinhTrangQuyDinhCuoi');
            });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a="search"]');
        if (b && root.contains(b)) tim();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });

    tim();          // gốc: init gọi getList_TinhTrangQuyDinh → nạp danh sách ngay khi mở màn
})();
