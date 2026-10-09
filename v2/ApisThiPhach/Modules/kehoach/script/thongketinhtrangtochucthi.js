/* =========================================================================
   Thi phách — Thống kê tình trạng tổ chức thi (CHỈ XEM)
   Bản gốc: ApisThiPhach/Modules/kehoach/html/thongketinhtrangtochucthi.html + script/thongketinhtrangtochucthi.js
   Bố cục gốc: MỘT cột — khung lọc có nhãn (Học kỳ · Hệ đào tạo · Loại lọc / Từ khóa · Thực hiện lọc) + bảng
   "Danh sách học phần" tiêu đề hai tầng (nhóm TỔNG HỢP 5 cột).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       DKH_Chung/LayThoiGianDangKyHoc  GET, kiểu cũ        ô Học kỳ (ID, DAOTAO_THOIGIANDAOTAO) — CHỌN NHIỀU
       ums.ref.heDaoTao (edu.system.getList_HeDaoTao — bản KHÔNG lọc quyền, đúng như gốc; pageSize 1000000)
                                                           ô Hệ đào tạo (TENHEDAOTAO) — CHỌN NHIỀU
       D_ThongKe_MH/FSkuLyYKJB4JLiIRKSAvHhUoLykVMyAvJgUSFQPP  func PKG_DIEM_THONGKE.ThongKe_HocPhan_TinhTrangDST  POST
           strDaoTao_ThoiGianDaoTao_Id  "id,id"  (bắt buộc — "Vui lòng chọn học kỳ!")
           strDaoTao_HeDaoTao_Id        "id,id"
           strNguoiThuVai_Id            = người đăng nhập (gốc: edu.system.nguoiThuVai_Id || userId — biến đầu không tồn tại
                                          ở Core / Corei nên LUÔN là userId; tên tham số "ThuVai" chép nguyên)
           strHanhDong                  0 Tất cả · 1 Có DS học – Chưa có DS thi · 2 Có DS thi – Sót sinh viên
           strNguoiThucHien_Id, strVaiTroDangNhap_Id, strChucNang_Id: tầng chung tự điền
       Cột: MA_HOCPHAN, TEN_HOCPHAN, CHUONGTRINH_MO, SO_TINCHI, KHOA_QUANLY, TONG_DA_DANGKY, TONG_DA_RUT, TONG_TRONG_DST,
            TONG_CHUA_DU_DIEUKIEN, TONG_CHUA_TEN_KHONG_RUT
   Cha → con: KHÔNG có. Gốc đổi Học kỳ thì gọi lại getList_HeDaoTao nhưng tham số không phụ thuộc học kỳ (danh sách y
       nguyên) → không nạp lại, không khoá ô Hệ.
   Lỗi / chỗ dở của bản gốc — làm theo ý định:
     · Ô "Từ khóa" (gợi ý "Nhập mã / tên học phần để lọc...") KHÔNG được gửi đi đâu và không lọc gì; Enter chỉ chạy lại
       thống kê. Bản mới: lọc TẠI CHỖ theo mã / tên học phần trên kết quả đã tải (gõ là lọc), Enter vẫn chạy lại thống kê.
   Cố ý bỏ:
     · Cột ô đánh dấu + ô "chọn tất cả": không thao tác nào của màn đọc các ô này.
     · Vùng zonebtnBaoCao_TKTC: html có vùng nhưng js không gọi getList_MauImport → gốc không bao giờ hiện nút báo cáo.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tp-thongketinhtrang');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function boDau(s) {
        s = String(s === null || s === undefined ? '' : s).toLowerCase();
        return (s.normalize ? s.normalize('NFD').replace(/[̀-ͯ]/g, '') : s).replace(/đ/g, 'd');
    }

    var LOAI = [['0', 'Tất cả'], ['1', 'Có DS học – Chưa có DS thi'], ['2', 'Có DS thi – Sót sinh viên']];
    root.innerHTML = pat.page('Thống kê tình trạng tổ chức thi', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter tptk-loc">' +
            ui.field('Học kỳ', '<select class="ums-select" data-f="tg" data-ph="Chọn học kỳ" multiple></select>', { required: true }) +
            ui.field('Hệ đào tạo', '<select class="ums-select" data-f="he" data-ph="Chọn hệ đào tạo" multiple></select>') +
            '<div class="ums-field tptk-loc__rong"><label class="ums-field__label">Loại lọc</label><div class="ums-radios">' +
            LOAI.map(function (l, i) {
                return '<label class="ums-check"><input type="radio" name="tptkLoaiLoc" value="' + l[0] + '"' + (i ? '' : ' checked') + '> ' + ui.esc(l[1]) + '</label>';
            }).join('') + '</div></div>' +
            '<div class="ums-field tptk-loc__rong"><label class="ums-field__label">Từ khóa</label>' +
            '<div class="ums-field__control"><input class="ums-input" data-f="q" placeholder="Nhập mã / tên học phần để lọc..." autocomplete="off"></div></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Thực hiện lọc', mod: 'warn', attr: { 'data-a': 'loc' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: 'Danh sách học phần', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            body: ui.empty('Chọn học kỳ rồi bấm Thực hiện lọc', 'fa-filter') });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    function so(k) { return { render: function (x) { return ui.esc(ui.so(x[k])); } }; }
    function cot(title, k, nhom) {
        var c = so(k); c.title = title; c.cls = 'is-center'; if (nhom) c.group = ['TỔNG HỢP']; return c;
    }
    var COT = [
        { title: 'Mã học phần', prop: 'MA_HOCPHAN', cls: 'is-nowrap' },
        { title: 'Tên học phần', prop: 'TEN_HOCPHAN' },
        { title: 'Chương trình mở học phần', prop: 'CHUONGTRINH_MO' },
        cot('Số tín chỉ', 'SO_TINCHI'),
        { title: 'Khoa quản lý học phần', prop: 'KHOA_QUANLY' },
        cot('Tổng số đã đăng ký học', 'TONG_DA_DANGKY', true),
        cot('Tổng số đã rút', 'TONG_DA_RUT', true),
        cot('Tổng số đã tổ chức thi', 'TONG_TRONG_DST', true),
        cot('Tổng số chưa đủ điều kiện thi', 'TONG_CHUA_DU_DIEUKIEN', true),
        cot('Tổng số chưa có tên trong DST', 'TONG_CHUA_TEN_KHONG_RUT', true)
    ];

    ums.api.call({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO' }); })
        .catch(function (err) { ums.api.handle(err, 'học kỳ'); });
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); })
        .catch(function (err) { ums.api.handle(err, 'hệ đào tạo'); });

    var ds = null, lan = 0;
    function ve() {
        if (!ds) return;
        var q = boDau(f('q').value.trim());
        var hien = !q ? ds : ds.filter(function (x) { return boDau(x.MA_HOCPHAN).indexOf(q) >= 0 || boDau(x.TEN_HOCPHAN).indexOf(q) >= 0; });
        z('n').textContent = '(' + (q ? ui.so(hien.length) + ' / ' : '') + ui.so(ds.length) + ')';
        ui.table({ el: z('bang'), rows: hien, columns: COT, empty: q ? 'Không có học phần khớp từ khóa' : 'Không có dữ liệu' });
    }
    function thongKe() {
        var tg = pat.val(f('tg'));
        if (!tg) { ui.toast('Vui lòng chọn học kỳ!', 'warn'); return; }
        var r = root.querySelector('input[name="tptkLoaiLoc"]:checked');
        var toi = ++lan;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'D_ThongKe_MH/FSkuLyYKJB4JLiIRKSAvHhUoLykVMyAvJgUSFQPP',
            func: 'PKG_DIEM_THONGKE.ThongKe_HocPhan_TinhTrangDST',
            strDaoTao_ThoiGianDaoTao_Id: tg,
            strDaoTao_HeDaoTao_Id: pat.val(f('he')),
            strNguoiThuVai_Id: uid(),
            strHanhDong: (r && r.value) || '0'
        }).then(function (kq) {
            if (toi !== lan) return;
            ds = arr(kq.data);
            ve();
        }).catch(function (err) {
            if (toi !== lan) return;
            ds = null;
            z('n').textContent = '';
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'thống kê tình trạng tổ chức thi');
        });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="loc"]')) thongKe();
    });
    var cho = null;
    f('q').addEventListener('input', function () { clearTimeout(cho); cho = setTimeout(ve, 300); });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(cho); thongKe(); } });
})();
