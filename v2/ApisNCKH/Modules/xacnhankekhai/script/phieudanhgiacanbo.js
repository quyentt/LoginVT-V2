/* =========================================================================
   Tiêu chí thi đua khen thưởng dành cho cán bộ — khung chung: _pdg_chung.js (ums.nckhPdg.man)
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/script/phieudanhgiacanbo.js + html/phieudanhgiacanbo.html
   Controller NS_TDKT_CanBo. Nút tình trạng: NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung
   (GET strChucNang_Id = chức năng đang mở, strNguoiThucHien_Id = người đăng nhập).
   Cột bảng chép nguyên genTable_HS; "Điểm chuyên môn" = tổng DIEMCHUYENMON_TC1..7 (gốc cộng bằng "+",
   chuỗi thì nối chữ → nay cộng số); "Tổng giờ NCKH" = GIOCHUAN_DETAI + GIOCHUAN_TAPCHIQUOCGIA + GIOCHUAN_TAPCHIQUOCTE.
   Đổi Đơn vị là tải lại danh sách (gốc: select2:select → getList_HS). Phiếu: khối "Điểm chuyên môn" 7 tiêu
   chí ("Kế hoạch" chép cứng từ html gốc, "Thực tế" = DIEMCHUYENMON_TCi) + 8 dòng + ô Xếp loại cạnh Tổng điểm.
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nckhPdg, c = N.c, so = N.so, tron = N.tron;
    var K = '/modules/sanphamkhoahoc/html/';
    function tc(i, ten, kh) { return { ten: ten, keHoach: kh, c: 'DIEMCHUYENMON_TC' + i }; }
    N.man({
        root: document.getElementById('nckh-pdgcb'),
        tieuDe: 'Tiêu chí thi đua khen thưởng dành cho cán bộ',
        ctrl: 'NS_TDKT_CanBo',
        doiTuong: 'cán bộ',
        nhanDonVi: 'Tất cả đơn vị thành viên',
        taiKhiDoiDonVi: true,
        xepLoai: true,
        nguonXacNhan: function () {
            return ums.api.call({ action: 'NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung', method: 'GET',
                strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strNguoiThucHien_Id: (ums.session && ums.session.userId) || '' })
                .then(function (r) { return r.data; });
        },
        cot: [
            { title: 'Nhóm thi xét thi đua', prop: 'NHOM' }, { title: 'Nhóm NCKH', prop: 'NHOMNCKH' },
            { title: 'Điểm chuyên môn', cls: 'is-center', render: function (r) {
                var t = 0; for (var i = 1; i <= 7; i++) t += so(r['DIEMCHUYENMON_TC' + i]); return tron(t); } },
            c('Viết sách', 'DIEMVIETSACH'),
            c('Giờ thi đua (1)', 'GIOCHUAN_DETAI', 'Đề tài'), c('Điểm', 'DIEMDETAI', 'Đề tài'),
            c('Giờ thi đua (2)', 'GIOCHUAN_TAPCHIQUOCGIA', 'TCQG'), c('Điểm', 'DIEMBAIBAOTRONGNUOC', 'TCQG'),
            c('Giờ thi đua (3)', 'GIOCHUAN_TAPCHIQUOCTE', 'TCQT'), c('Điểm', 'DIEMBAIBAOQUOCTE', 'TCQT'),
            { title: 'Tổng giờ NCKH = (1) + (2) + (3)', cls: 'is-center', render: function (r) {
                return tron(so(r.GIOCHUAN_DETAI) + so(r.GIOCHUAN_TAPCHIQUOCGIA) + so(r.GIOCHUAN_TAPCHIQUOCTE)); } },
            c('Giải thưởng', 'DIEMTHANHTICHDOTXUAT'), c('VBSC', 'DIEMVANBANGSANGCHE'),
            c('Số phút', 'SOGIOCOITHI', 'Coi thi'), c('Giờ thi đua', 'SOGIOCHUANCOITHI', 'Coi thi'), c('Điểm', 'DIEMCOITHI', 'Coi thi'),
            c('Điểm công đoàn', 'DIEMCONGDOAN'), c('Điểm họp', 'DIEMHOP'), c('Tổng điểm', 'TONGDIEM'), c('Xếp loại', 'XEPLOAI')
        ],
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
            { ten: 'Đề tài', gio: 'DIEMDETAI', donVi: { keKhai: K + 'detai.html' }, yk: 'YK_DIEMDETAI' },
            { ten: 'Tạp chí quốc gia', gio: 'DIEMBAIBAOTRONGNUOC', donVi: { keKhai: K + 'tapchiquocgia.html' }, yk: 'YK_DIEMBAIBAOTRONGNUOC' },
            { ten: 'Tạp chí quốc tế', gio: 'DIEMBAIBAOQUOCTE', donVi: { keKhai: K + 'tapchiquocte.html' }, yk: 'YK_DIEMBAIBAOQUOCTE' },
            { ten: 'Giải thưởng', gio: 'DIEMTHANHTICHDOTXUAT', donVi: { keKhai: K + 'giaithuong.html' }, yk: 'YK_DIEMTHANHTICHDOTXUAT' },
            { ten: 'Văn bằng sáng chế', gio: 'DIEMVANBANGSANGCHE', donVi: { keKhai: K + 'vanbangsangche.html' }, yk: 'YK_DIEMVANBANGSANGCHE' },
            { ten: 'Coi thi', gio: 'SOGIOCOITHI', donVi: 'Giờ chuẩn', yk: 'YK_SOGIOCOITHI' },
            { ten: 'Điểm công đoàn', gio: 'DIEMCONGDOAN', donVi: 'Điểm', yk: 'YK_DIEMCONGDOAN' },
            { ten: 'Điểm họp', gio: 'DIEMHOP', donVi: 'Điểm', yk: 'YK_DIEMHOP' }
        ]
    });
})();
