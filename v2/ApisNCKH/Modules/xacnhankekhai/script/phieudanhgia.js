/* =========================================================================
   Tiêu chí thi đua khen thưởng dành cho giảng viên — khung chung: _pdg_chung.js (ums.nckhPdg.man)
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/script/phieudanhgia.js + html/phieudanhgia.html
   Controller NS_TDKT_GiangVien. Nút tình trạng: danh mục NCKH.XNKK (loadToCombo_DanhMucDuLieu, callback loadBtnXacNhan).
   Cột bảng chép nguyên genTable_HS; "Tổng giờ giảng" = SOGIODH + SOGIOSDH, "Tổng giờ NCKH" =
   GIOCHUAN_DETAI + GIOCHUAN_TAPCHIQUOCGIA + GIOCHUAN_TAPCHIQUOCTE + DIEMVIETSACH + DIEMHOINGHIHOITHAO
   (làm tròn 2 số, 0 thì trống — như gốc).
   Dòng phiếu chép nguyên html gốc (15 dòng, đơn vị "Giờ chuẩn" / "Điểm" / nút Kê khai).
   ========================================================================= */
(function () {
    'use strict';
    var N = ums.nckhPdg, c = N.c, so = N.so, tron = N.tron;
    var K = '/modules/sanphamkhoahoc/html/';
    N.man({
        root: document.getElementById('nckh-pdg'),
        tieuDe: 'Tiêu chí thi đua khen thưởng dành cho giảng viên',
        ctrl: 'NS_TDKT_GiangVien',
        doiTuong: 'giảng viên',
        nhanDonVi: 'Tất cả đơn vị',
        nguonXacNhan: function () { return ums.api.dm('NCKH.XNKK'); },
        cot: [
            c('Giờ giảng chuẩn', 'SOGIOCHUAN'), c('Giờ miễn giảm', 'SOGIOMIENGIAM'), c('Định mức giảng dạy', 'SOGIODINHMUCGIANGDAYNCKH'),
            c('NCKH chuẩn', 'SOGIONCKHCHUAN'), c('Số giờ NCKH miễn', 'SOGIONCKHMIEN'), c('Giảng dạy đại học', 'SOGIODH'),
            c('Giảng dạy sau đại học', 'SOGIOSDH'),
            { title: 'Tổng giờ giảng', cls: 'is-center', render: function (r) { return tron(so(r.SOGIODH) + so(r.SOGIOSDH)); } },
            c('Viết sách (4)', 'DIEMVIETSACH'), c('Điểm hội nghị hội thảo (5)', 'DIEMHOINGHIHOITHAO'),
            c('Giờ thi đua (1)', 'GIOCHUAN_DETAI', 'Đề tài'), c('Điểm', 'DIEMDETAI', 'Đề tài'),
            c('Giờ thi đua (2)', 'GIOCHUAN_TAPCHIQUOCGIA', 'TCQG'), c('Điểm', 'DIEMBAIBAOTRONGNUOC', 'TCQG'),
            c('Giờ thi đua (3)', 'GIOCHUAN_TAPCHIQUOCTE', 'TCQT'), c('Điểm', 'DIEMBAIBAOQUOCTE', 'TCQT'),
            { title: 'Tổng giờ NCKH = (1) + (2) + (3) + (4) + (5)', cls: 'is-center', render: function (r) {
                return tron(so(r.GIOCHUAN_DETAI) + so(r.GIOCHUAN_TAPCHIQUOCGIA) + so(r.GIOCHUAN_TAPCHIQUOCTE) + so(r.DIEMVIETSACH) + so(r.DIEMHOINGHIHOITHAO)); } },
            c('Giải thưởng', 'DIEMTHANHTICHDOTXUAT'), c('VBSC', 'DIEMVANBANGSANGCHE'),
            c('Số phút', 'SOGIOCOITHI', 'Coi thi'), c('Giờ thi đua', 'SOGIOCHUANCOITHI', 'Coi thi'), c('Điểm', 'DIEMCOITHI', 'Coi thi'),
            c('Điểm công đoàn', 'DIEMCONGDOAN'), c('Điểm họp', 'DIEMHOP'), c('Tổng điểm', 'TONGDIEM'), c('Xếp loại', 'XEPLOAI')
        ],
        rows: [
            { ten: 'Số giờ giảng chuẩn', gio: 'SOGIOCHUAN', donVi: 'Giờ chuẩn', yk: 'YK_SOGIOCHUAN' },
            { ten: 'Số giờ miễn giảm', gio: 'SOGIOMIENGIAM', donVi: 'Giờ chuẩn', yk: 'YK_SOGIOMIENGIAM' },
            { ten: 'Số giờ định mức giảng dạy', gio: 'SOGIODINHMUCGIANGDAYNCKH', donVi: 'Giờ chuẩn', yk: 'YK_SOGIODINHMUCGIANGDAYNCKH' },
            { ten: 'Số giờ NCKH chuẩn', gio: 'SOGIONCKHCHUAN', donVi: 'Giờ chuẩn' },
            { ten: 'Số giờ giảng dạy đại học', gio: 'SOGIODH', donVi: 'Giờ chuẩn', yk: 'YK_SOGIOGIANGDAYDAIHOC' },
            { ten: 'Số giờ giảng dạy sau đại học', gio: 'SOGIOSDH', donVi: 'Giờ chuẩn', yk: 'YK_SOGIOGIANGDAYSAUDAIHOC' },
            { ten: 'Viết sách', gio: 'DIEMVIETSACH', donVi: { keKhai: K + 'thongtinsach.html' }, yk: 'YK_DIEMVIETSACH' },
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
