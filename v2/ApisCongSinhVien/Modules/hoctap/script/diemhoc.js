/* =========================================================================
   diemhoc — Điểm học tập (Cổng sinh viên, vai trò thủ vai: userId = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/hoctap/html/diemhoc.html + script/diemhoc.js
   (lớp DiemHoc, vỏ index / Core).
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — HAI cột: trái (col-md-3) ô Chương trình + thông tin người
   học + "Điểm mới" + "Tổng điểm"; phải (col-md-9) tám tab theo đúng thứ tự gốc:
   Bảng điểm · Học phần nợ · Khối kiến thức · Kết quả đăng ký học · Quyết định ·
   Văn bằng - chứng chỉ · Cảnh báo học vụ · Điểm rèn luyện.

   DÙNG LẠI TẦNG CHUNG: ba bảng nặng nhất vẽ bằng ums.diemHoc (assets/js/diemhoc.js —
   chính là bản viết lại của lớp DiemHoc này, làm khi chuyển Cổng cán bộ):
       ums.diemHoc.veBangDiem · veTichLuy · veRenLuyen
   cùng bộ lớp CSS .ums-dh* của nó (assets/css/components/diemhoc.css).
   KHÔNG gọi ums.diemHoc.mount vì hai chỗ nó không khớp bản gốc Cổng sinh viên
   (đã ghi trong báo cáo, sửa xong ở tầng chung thì màn này rút lại còn vài dòng):
     · mount đọc thông tin người học ở HODEM / TEN / NGAYSINH / GIOITINH, còn
       bản gốc (cả bản chép trong CCB/hoatdong/DaQHHT) đọc QLSV_NGUOIHOC_HODEM /
       _TEN / _NGAYSINH / _GIOITINH → với dữ liệu thật cột trái sẽ trống;
     · mount khoá nút "Điểm quá trình" (bản chép ở DaQHHT không có hộp đích),
       nhưng trang gốc CỦA MÀN NÀY có hộp #diem_qua_trinh + tblDiemQuaTrinh nên
       nút chạy được → ở đây giữ nút sống (LatKetQuaDiemQuaTrinh).

   Lời gọi (chép nguyên action / func / tham số / tên cột) — SV_ThongTin_MH ·
   pkg_congthongtin_hssv_thongtin.*:
       LayThongTinChuongTrinhHoc     ô Chương trình (chọn sẵn mục đầu như gốc)
       KetQuaHocTapCaNhan            thông tin, Điểm mới, Tổng điểm, Bảng điểm, Học phần nợ
       LayKetQuaTichLuyTheoKhoi      Khối kiến thức (rsTongHop + rsChiTiet)
       LayDSKetQuaXuLyHocVu          Cảnh báo học vụ
       LayKQRenLuyenCaNhan           Điểm rèn luyện (rsKy / rsNam / rsToanKhoa)
       LayDSThoiGianLichHoc          ô Thời gian của tab Kết quả đăng ký học
       LayKetQuaDangKyHocCaNhan      rsKetQuaDangKy + rsLichSuDangKy
       LayDSQDCaNhan · LayDSTN_KetQua_CongNhan_VB
       LayDSDiemThanhPhanTheoTKHP    hộp "Chi tiết thành phần" (nút Chi tiết ở Bảng điểm)
       LatKetQuaDiemQuaTrinh         hộp "Điểm quá trình: <lớp>" (nút trong Kết quả đăng ký học)

   Khác bản gốc (lỗi rõ của gốc, đã sửa — chi tiết ở báo cáo):
     · Điểm rèn luyện: gốc gọi MỘT LẦN lúc init, trước khi ô Chương trình có giá
       trị → luôn gửi strDaoTao_ChuongTrinh_Id rỗng và không bao giờ nạp lại.
       Ở đây nạp cùng nhóm với Bảng điểm / Khối kiến thức / Cảnh báo khi đổi
       chương trình (đúng ý định, giống ums.diemHoc.mount).
     · Bảng Điểm rèn luyện: cột "Mã số" của gốc mRender ra THOIGIAN_HIENTHI (cột
       không có trong dữ liệu) → veRenLuyen của tầng chung đổ QLSV_NGUOIHOC_MASO.
     · Sáu dòng tổng của từng học kỳ: gốc lấy nhầm bản ghi TÍCH LUỸ cho dòng
       "Điểm trung bình hệ 10" (dùng lại biến temp của dòng trên) → veBangDiem
       lấy đúng TRUNGBINHCHUNG / TRUNGBINHTICHLUY theo từng dòng.
     · Gốc đọc `edu.system.userId` cho Văn bằng - chứng chỉ nhưng
       `me.strNguoiHoc_Id` cho các lời gọi khác; ở vai trò thủ vai hai giá trị
       bằng nhau (ums.session.userId) nên giữ nguyên một biến.
   Kéo gốc 30/9 (git fed68f6e..HEAD, diemhoc.js +43/−14, html 22):
     · Bấm CẢ DÒNG bảng điểm mở "Chi tiết thành phần" (gốc tr.row-diem) — làm ở tầng chung
       ums.diemHoc.veBangDiem (gắn data-tp lên <tr>), trình xử lý [data-tp] dưới đây nhận luôn.
     · Tổng điểm có dòng "Tổng số tín chỉ chương trình" ← TONGSOTINCHICTDT; hai dòng tín chỉ đổi
       chữ "đã học" / "đã tích lũy" như html gốc → DH.veTongKet(…, { ctdt: true }).
     · Mỗi bảng rỗng có câu riêng như showEmptyState của gốc ("Hiện tại chưa có học phần nợ nào"…),
       vẽ bằng khung rỗng chuẩn của ums.ui.table (không chép biểu tượng riêng từng bảng).
     · Cột Học phần nợ gốc đổi sang căn giữa — bản mới vốn đã căn giữa. resolveNguoiHocId gốc đổi
       nguồn id khi nhúng (main_doc.LichGiang) — màn này không nhúng, không liên quan.
   Bỏ (mã chết của gốc): resolveNguoiHocId (dò #zoneHTSinhVien / main_doc — vỏ mới
     đã có ums.thuVai, id người học luôn là ums.session.userId); popover_DiemHoc /
     popover_DiemThanhPhan (đã bị chú thích ở gốc); khối $(document).ready tô nền
     xen kẽ theo rowspan của tblTongHopDiemHP (chạy khi bảng còn rỗng nên chưa bao
     giờ tô được gì); hai nút ẩn "Hoàn thành nhập điểm" / "Vi phạm điều kiện thi"
     (display:none !important, không có xử lý).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, DH = ums.diemHoc;
    var root = document.getElementById('csv-diemhoc');
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var sv = (ums.session && ums.session.userId) || '';

    var A = 'SV_ThongTin_MH/', F = 'pkg_congthongtin_hssv_thongtin.';
    var G = {
        ct: { action: A + 'DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP', func: F + 'LayThongTinChuongTrinhHoc' },
        kq: { action: A + 'CiQ1EDQgCS4iFSAxAiAPKSAv', func: F + 'KetQuaHocTapCaNhan' },
        tl: { action: A + 'DSA4CiQ1EDQgFSgiKQ00OBUpJC4KKS4o', func: F + 'LayKetQuaTichLuyTheoKhoi' },
        cb: { action: A + 'DSA4BRIKJDUQNCAZNA04CS4iFzQP', func: F + 'LayDSKetQuaXuLyHocVu' },
        rl: { action: A + 'DSA4ChATJC8NNDgkLwIgDykgLwPP', func: F + 'LayKQRenLuyenCaNhan' },
        tg: { action: A + 'DSA4BRIVKS4oBiggLw0oIikJLiIP', func: F + 'LayDSThoiGianLichHoc' },
        dk: { action: A + 'DSA4CiQ1EDQgBSAvJgo4CS4iAiAPKSAv', func: F + 'LayKetQuaDangKyHocCaNhan' },
        qd: { action: A + 'DSA4BRIQBQIgDykgLwPP', func: F + 'LayDSQDCaNhan' },
        vb: { action: A + 'DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8eFwMP', func: F + 'LayDSTN_KetQua_CongNhan_VB' },
        tp: { action: A + 'DSA4BRIFKCQsFSkgLykRKSAvFSkkLhUKCREP', func: F + 'LayDSDiemThanhPhanTheoTKHP' },
        qt: { action: A + 'DSA1CiQ1EDQgBSgkLBA0IBUzKC8p', func: F + 'LatKetQuaDiemQuaTrinh' }
    };
    function goi(k, o) { return ums.api.call(Object.assign({ silent: true }, G[k], o)); }

    /* Tám tab của bản gốc, chữ + biểu tượng lấy từ HTML gốc (đổi sang tên FA7) */
    var TAB = [
        { key: 'bangdiem', text: 'Bảng điểm', icon: 'fa-file-invoice' },
        { key: 'no', text: 'Học phần nợ', icon: 'fa-file-xmark' },
        { key: 'khoi', text: 'Khối kiến thức', icon: 'fa-layer-group' },
        { key: 'dangky', text: 'Kết quả đăng ký học', icon: 'fa-users-rectangle' },
        { key: 'qd', text: 'Quyết định', icon: 'fa-circle-info' },
        { key: 'vb', text: 'Văn bằng - chứng chỉ', icon: 'fa-box-archive' },
        { key: 'canhbao', text: 'Cảnh báo học vụ', icon: 'fa-triangle-exclamation' },
        { key: 'drl', text: 'Điểm rèn luyện', icon: 'fa-star' }
    ];
    /* Màu điểm của "Điểm mới" — đúng ngưỡng bản gốc (0 đỏ, ≥3 cam, ≥5 thường,
       ≥7 xanh lam, ≥8.5 xanh lá), tên lớp theo CSS chung .ums-dh__moi b */
    function mauDiem(d) {
        d = Number(d);
        if (d === 0) return 'is-0';
        if (d >= 8.5) return 'is-gioi';
        if (d >= 7) return 'is-kha';
        if (d >= 5) return '';
        if (d >= 3) return 'is-yeu';
        return '';
    }

    root.innerHTML = pat.page('Điểm học tập', '') +
        '<div class="ums-dh">' +
            '<aside class="ums-dh__trai">' +
                ui.field('Chương trình', '<select class="ums-select" data-f="ct" data-ph="Chọn chương trình"><option value="">Chọn chương trình</option></select>') +
                '<div class="ums-dh__tt" data-z="tt"></div>' +
                '<div class="ums-dh__nhom">Điểm mới</div><ul class="ums-dh__moi" data-z="moi"></ul>' +
                '<div class="ums-dh__nhom">Tổng điểm</div><div class="ums-dh__tk" data-z="tong"></div>' +
            '</aside>' +
            '<div class="ums-dh__phai">' + ui.tabs(TAB, 'bangdiem', 'data-dhtab') +
                TAB.map(function (t, i) { return '<div class="ums-dh__pane" data-pane="' + t.key + '"' + (i ? ' hidden' : '') + '></div>'; }).join('') +
            '</div>' +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function pane(k) { return root.querySelector('[data-pane="' + k + '"]'); }
    function dangTai(el) { if (el) el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function loi(el) { return function (err) { if (el) el.innerHTML = ui.fail(err.message); }; }
    var tbChung = [];               // rsDiemTrungBinhChung của lần nạp gần nhất

    /* ---------- Tab ------------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-dhtab]');
        if (t) {
            var k = t.getAttribute('data-dhtab');
            ui.tabsActive(root, k, 'data-dhtab');
            TAB.forEach(function (x) { pane(x.key).hidden = x.key !== k; });
            return;
        }
        var b = ev.target.closest('[data-tp]');
        if (b) { hopThanhPhan(b.getAttribute('data-tp')); return; }
        var q = ev.target.closest('[data-qt]');
        if (q) hopQuaTrinh(q.getAttribute('data-qt'), q.getAttribute('title'));
    });

    /* ---------- Chương trình → KQ học tập · tích luỹ · cảnh báo · rèn luyện - */
    function ct() { return f('ct').value; }
    function theoChuongTrinh() {
        if (!ct()) return;
        ketQuaHocTap(); tichLuy(); canhBao(); renLuyen();
    }
    goi('ct', { strQLSV_NguoiHoc_Id: sv }).then(function (r) {
        var d = arr(r.data);
        pat.fill(f('ct'), d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN', head: 'Chọn chương trình' });
        if (d.length) {
            f('ct').value = e(d[0].DAOTAO_TOCHUCCHUONGTRINH_ID);      // selectFirst của bản gốc
            if (window.jQuery) jQuery(f('ct')).trigger('change.select2');
            theoChuongTrinh();
        } else {
            ['bangdiem', 'no', 'khoi', 'canhbao', 'drl'].forEach(function (k) {
                pane(k).innerHTML = ui.empty('Người học chưa có chương trình học', 'fa-circle-info');
            });
        }
    }).catch(loi(pane('bangdiem')));
    if (window.jQuery) jQuery(f('ct')).on('select2:select', theoChuongTrinh);

    function ketQuaHocTap() {
        dangTai(pane('bangdiem')); dangTai(pane('no'));
        goi('kq', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
            var d = r.data || {};
            tbChung = arr(d.rsDiemTrungBinhChung);
            thongTinCaNhan(arr(d.rsThongTinNguoiHoc)[0] || {});
            diemMoi(arr(d.rsDiemMoiNhat));
            tongDiem();
            DH.veBangDiem(pane('bangdiem'), arr(d.rsDiemKetThucHocPhan), tbChung);
            hocPhanNo(arr(d.rsHocPhanChuaHoanThanh));
        }).catch(function (err) { loi(pane('bangdiem'))(err); loi(pane('no'))(err); });
    }
    function thongTinCaNhan(t) {
        z('tt').innerHTML = [
            ['Họ tên', e(t.QLSV_NGUOIHOC_HODEM) + ' ' + e(t.QLSV_NGUOIHOC_TEN)],
            ['Mã số', t.QLSV_NGUOIHOC_MASO],
            ['Ngày sinh', t.QLSV_NGUOIHOC_NGAYSINH],
            ['Giới tính', t.QLSV_NGUOIHOC_GIOITINH],
            ['Trạng thái', t.QLSV_TRANGTHAINGUOIHOC_TEN],
            ['Lớp', t.DAOTAO_LOPQUANLY_TEN]
        ].map(function (x) { return '<div><span>' + esc(x[0]) + ':</span> <b>' + esc(x[1]) + '</b></div>'; }).join('');
    }
    function diemMoi(rows) {
        z('moi').innerHTML = rows.map(function (x) {
            return '<li><span>' + esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)) + '</span>' +
                '<b class="' + mauDiem(x.DIEM) + '">' + esc(x.DIEM) + '</b></li>';
        }).join('') || '<li class="ums-u-muted">Chưa có điểm</li>';
    }
    /* Tổng điểm: bản ghi KHÔNG gắn thời gian đào tạo (toàn khoá), THUOCTINHLANTINH = 0 */
    function tongDiem() {
        var chung = tbChung.filter(function (x) {
            return (x.DAOTAO_THOIGIANDAOTAO_ID === null || x.DAOTAO_THOIGIANDAOTAO_ID === undefined || x.DAOTAO_THOIGIANDAOTAO_ID === '') &&
                Number(x.THUOCTINHLANTINH) === 0;
        });
        function lay(loai, thang, truong) {
            var x = chung.filter(function (y) {
                return y.LOAIDIEMTRUNGBINH_MA === loai && String(y.THANGDIEM_MA) === String(thang);
            })[0];
            return x ? e(x[truong]) : '';
        }
        /* Sáu dòng "nhãn : số" của bản gốc gộp thành lưới Chung / Tích lũy ×
           Tín chỉ · Hệ 10 · Hệ 4 (ums.diemHoc.veTongKet, người dùng yêu cầu 2026-09-23) */
        DH.veTongKet(z('tong'), lay, { ctdt: true });
    }
    function hocPhanNo(rows) {
        ui.table({ el: pane('no'), rows: rows, empty: 'Hiện tại chưa có học phần nợ nào', columns: [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Học trình', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' },
            { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' },
            { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' },
            { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
            { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' },
            { title: 'Lớp học phần', prop: 'DIEM_DANHSACHHOC_TEN', cls: 'is-center' }
        ] });
    }
    function tichLuy() {
        dangTai(pane('khoi'));
        goi('tl', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
            DH.veTichLuy(pane('khoi'), r.data || {});
        }).catch(loi(pane('khoi')));
    }
    function canhBao() {
        dangTai(pane('canhbao'));
        goi('cb', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
            ui.table({ el: pane('canhbao'), rows: arr(r.data), empty: 'Hiện tại chưa có cảnh báo học vụ nào', columns: [
                { title: 'Thời gian', prop: 'THOIGIAN_HIENTHI', cls: 'is-center' },
                { title: 'Mức xử lý', prop: 'MUCXULY_TEN' },
                { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Ghi chú', prop: 'GHICHU' }
            ] });
        }).catch(loi(pane('canhbao')));
    }
    function renLuyen() {
        dangTai(pane('drl'));
        goi('rl', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
            DH.veRenLuyen(pane('drl'), r.data || {});
        }).catch(loi(pane('drl')));
    }

    /* ---------- Kết quả đăng ký học --------------------------------------- */
    pane('dangky').innerHTML =
        '<div class="ums-dh__tg">' + ui.field('Thời gian', '<select class="ums-select" data-f="tg" data-ph="Chọn thời gian"><option value="">Chọn thời gian</option></select>') + '</div>' +
        '<div class="ums-legend">Kết quả đăng ký học</div><div data-z="dkkq"></div>' +
        '<div class="ums-legend ums-legend--cach">Lịch sử đăng ký học</div><div data-z="dkls"></div>';
    ui.enhance(pane('dangky'));

    function ketQuaDangKy() {
        dangTai(z('dkkq'));
        goi('dk', { strQLSV_NguoiHoc_Id: sv, strDaoTao_ThoiGianDaoTao_Id: f('tg').value }).then(function (r) {
            var d = r.data || {};
            ui.table({ el: z('dkkq'), rows: arr(d.rsKetQuaDangKy), empty: 'Hiện tại chưa có kết quả đăng ký học nào', columns: [
                { title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' },
                { title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                { title: 'Số tín', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center', sum: true },
                { title: 'Giảng viên', prop: 'THONGTINGIANGVIEN' },
                { title: 'Kiểu học', prop: 'KIEUHOC_TEN' },
                { title: 'Thời gian thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' },
                { title: 'Người thực hiện', prop: 'NGUOITAO_TAIKHOAN' },
                { title: 'Học kỳ, đợt', prop: 'THOIGIAN' },
                { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Điểm quá trình', cls: 'is-center is-actions', render: function (x) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-qt="' +
                        esc(x.DANGKY_LOPHOCPHAN_ID) + '" title="' + esc(x.DANGKY_LOPHOCPHAN_TEN) + '"><span>Điểm quá trình</span></button>';
                } }
            ] });
            ui.table({ el: z('dkls'), rows: arr(d.rsLichSuDangKy), empty: 'Hiện tại chưa có lịch sử đăng ký học nào', columns: [
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' },
                { title: 'Hành động', prop: 'HANHDONG' },
                { title: 'Kết quả', prop: 'KETQUA' },
                { title: 'Thời gian thực hiện', prop: 'THOIGIANTHUCHIEN', cls: 'is-nowrap' },
                { title: 'Mã học phần', prop: 'MAHOCPHAN' },
                { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' },
                { title: 'Mã chương trình', prop: 'DAOTAO_CHUONGTRINH_MA' },
                { title: 'Tên chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }
            ] });
        }).catch(loi(z('dkkq')));
    }
    goi('tg', { strQLSV_NguoiHoc_Id: sv }).then(function (r) {
        pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' });
        ketQuaDangKy();                                   // như gốc: nạp ngay với thời gian rỗng
    }).catch(function () { ketQuaDangKy(); });
    if (window.jQuery) jQuery(f('tg')).on('select2:select select2:clear', ketQuaDangKy);

    /* ---------- Quyết định · Văn bằng - chứng chỉ -------------------------- */
    dangTai(pane('qd')); dangTai(pane('vb'));
    goi('qd', { strNguoiDung_Id: sv }).then(function (r) {
        ui.table({ el: pane('qd'), rows: arr(r.data), empty: 'Hiện tại chưa có quyết định nào', columns: [
            { title: 'Số quyết định', prop: 'SOQUYETDINH' },
            { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-center' },
            { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUC', cls: 'is-center' },
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Loại quyết định', prop: 'LOAIQUYETDINH_TEN' }
        ] });
    }).catch(loi(pane('qd')));
    goi('vb', { strNguoiDung_Id: sv }).then(function (r) {
        ui.table({ el: pane('vb'), rows: arr(r.data), empty: 'Hiện tại chưa có văn bằng - chứng chỉ nào', columns: [
            { title: 'Loại chứng chỉ - văn bằng', prop: 'PHANLOAI_TEN' },
            { title: 'Chương trình học', prop: 'CHUONGTRINH_TEN' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' },
            { title: 'Số hiệu', prop: 'SOHIEUBANG', cls: 'is-center' },
            { title: 'Số vào sổ', prop: 'SOVAOSOCAPBANG', cls: 'is-center' }
        ] });
    }).catch(loi(pane('vb')));

    /* ---------- Hộp "Chi tiết thành phần" (nút Chi tiết ở Bảng điểm) ------- */
    function hopThanhPhan(id) {
        var dlg = ui.dialog({ title: 'Chi tiết thành phần', icon: 'fa-list-ol', size: 'lg',
            body: '<div data-z="tp">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-z="tp"]');
        goi('tp', { strDiem_NguoiHoc_TongKet_Id: id }).then(function (r) {
            /* Như view_DiemThanhPhan của gốc: cột = các DIEM_THANHPHANDIEM_TEN gặp
               được, dòng = từng cặp (LANHOC, LANTHI) */
            var d = arr(r.data), cot = [], lan = [], theo = {};
            d.forEach(function (x) {
                var c = e(x.DIEM_THANHPHANDIEM_TEN), k = e(x.LANHOC) + ':' + e(x.LANTHI);
                if (cot.indexOf(c) < 0) cot.push(c);
                if (!theo[k]) { theo[k] = { LANHOC: x.LANHOC, LANTHI: x.LANTHI, _d: {} }; lan.push(theo[k]); }
                theo[k]._d[c] = x.DIEM;
            });
            ui.table({ el: h, rows: lan, empty: 'Chưa có điểm thành phần', columns: [
                { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }
            ].concat(cot.map(function (c) {
                return { title: c, cls: 'is-center', render: function (x) { return esc(x._d[c]); } };
            })) });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
    }

    /* ---------- Hộp "Điểm quá trình: <lớp>" -------------------------------- */
    function hopQuaTrinh(lopId, tenLop) {
        var dlg = ui.dialog({ title: 'Điểm quá trình: ' + e(tenLop), icon: 'fa-list-check', size: 'md',
            body: '<div data-z="qt">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-z="qt"]');
        goi('qt', { strQLSV_NguoiHoc_Id: sv, strDaoTao_LopHocPhan_Id: lopId }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Chưa có điểm quá trình', columns: [
                { title: 'Loại điểm', prop: 'DIEM_THANHPHANDIEM_TEN' },
                { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' }
            ] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
    }
})();
