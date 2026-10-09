/* =========================================================================
   Phiếu đánh giá cán bộ — khung chung: _chung.js (ums.dgpl.phieu)
   Bản gốc: ApisCongCanBo/Modules/dgplnguoilaodong/script/phieudanhgiacanbo.js
   Controller NS_TDKT_CanBo. Tham số CapNhat chép nguyên thứ tự bản gốc.
   Giữ như bản gốc: strYK_DiemVietSach đọc ô không có trên màn → gửi rỗng;
   ô "Điểm" của Đề tài / tạp chí / giải thưởng / VBSC bản gốc không đổ gì.
   Điểm "Kế hoạch" của 7 tiêu chí chuyên môn chép cứng từ html gốc.
   ========================================================================= */
(function () {
    'use strict';
    var K = '/modules/sanphamkhoahoc/html/';
    function tc(i, ten, kh) { return { ten: ten, keHoach: kh, p: 'dDiemChuyenMon_TC' + i, c: 'DIEMCHUYENMON_TC' + i }; }
    ums.dgpl.phieu({
        root: document.getElementById('dg-phieucb'),
        ctrl: 'NS_TDKT_CanBo',
        tieuChi: [
            tc(1, 'Thực hiện tốt các công việc theo bản mô tả công việc, đúng thời hạn cho cấp đơn vị hoặc cấp Viện tùy theo công việc.', 50),
            tc(2, 'Đi làm đúng giờ, đầy đủ số ngày làm việc theo quy định', 10),
            tc(3, 'Thực hiện tốt ý kiến chỉ đạo của cấp trên (lãnh đạo đơn vị, lãnh đạo Viện, Trường)', 10),
            tc(4, 'Hàng năm, cán bộ có bản mô tả công việc cụ thể được lãnh đạo đơn vị phê duyệt', 5),
            tc(5, 'Thực hiện tốt nội quy cơ quan đơn vị', 5),
            tc(6, 'Báo cáo đầy đủ các công việc thực hiện trong báo cáo định kỳ', 5),
            tc(7, 'Báo cáo đầy đủ các công việc thực hiện trong báo cáo tổng kết cuối năm của cá nhân', 5)
        ],
        rows: [
            { ten: 'Đề tài', gio: 'DIEMDETAI', donVi: { keKhai: K + 'detai.html' }, yk: { p: 'strYK_DiemDeTai', c: 'YK_DIEMDETAI' } },
            { ten: 'Tạp chí quốc gia', gio: 'DIEMBAIBAOTRONGNUOC', donVi: { keKhai: K + 'tapchiquocgia.html' }, yk: { p: 'strYK_DiemBaiBaoTrongNuoc', c: 'YK_DIEMBAIBAOTRONGNUOC' } },
            { ten: 'Tạp chí quốc tế', gio: 'DIEMBAIBAOQUOCTE', donVi: { keKhai: K + 'tapchiquocte.html' }, yk: { p: 'strYK_DiemBaiBaoQuocTe', c: 'YK_DIEMBAIBAOQUOCTE' } },
            { ten: 'Giải thưởng', gio: 'DIEMTHANHTICHDOTXUAT', donVi: { keKhai: K + 'giaithuong.html' }, yk: { p: 'strYK_DiemThanhTichDotXuat', c: 'YK_DIEMTHANHTICHDOTXUAT' } },
            { ten: 'Văn bằng sáng chế', gio: 'DIEMVANBANGSANGCHE', donVi: { keKhai: K + 'vanbangsangche.html' }, yk: { p: 'strYK_DiemVanBangSangChe', c: 'YK_DIEMVANBANGSANGCHE' } },
            { ten: 'Coi thi', gio: 'SOGIOCOITHI', diem: 'DIEMCOITHI', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioCoiThi', c: 'YK_SOGIOCOITHI' } },
            { ten: 'Điểm công đoàn', diem: 'DIEMCONGDOAN', donVi: 'Giờ chuẩn', yk: { p: 'strYK_DiemCongDoan', c: 'YK_DIEMCONGDOAN' } },
            { ten: 'Điểm họp', diem: 'DIEMHOP', donVi: 'Giờ chuẩn', yk: { p: 'strYK_DiemHop', c: 'YK_DIEMHOP' } }
        ],
        order: ['strYK_DiemVietSach', 'strYK_DiemDeTai', 'strYK_DiemBaiBaoTrongNuoc', 'strYK_DiemBaiBaoQuocTe', 'strYK_DiemVanBangSangChe',
            'strYK_SoGioCoiThi', 'strYK_DiemCongDoan', 'strYK_DiemHop', 'strYK_DiemThanhTichDotXuat'],
        extraSave: { strYK_DiemVietSach: '' }
    });
})();
