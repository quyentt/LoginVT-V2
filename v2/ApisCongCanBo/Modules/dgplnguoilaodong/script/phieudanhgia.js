/* =========================================================================
   Phiếu đánh giá (giảng viên) — khung chung: _chung.js (ums.dgpl.phieu)
   Bản gốc: ApisCongCanBo/Modules/dgplnguoilaodong/script/phieudanhgia.js
   Controller NS_TDKT_GiangVien. Tham số CapNhat chép nguyên thứ tự bản gốc.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Ý kiến dòng "giảng dạy đại học / sau đại học": bản gốc đọc/ghi ô
       txtYK_GioDinhMucDH / txtYK_GioSauDH KHÔNG có trên màn (ô thật là
       txtYK_GioGiangDayDH / …SauDH) → ý kiến gõ vào không bao giờ được lưu.
       Ở đây nối đúng ô với strYK_SoGioGiangDayDaiHoc / strYK_SoGioGiangDaySauDaiHoc.
     · strYK_SoGioHuongDanDaiHoc / …SauDaiHoc: không có dòng trên màn → gửi rỗng như gốc.
     · "Tổng giờ NCKH": bản gốc tính từ biến aData không tồn tại (ReferenceError,
       dừng luôn phần đổ dữ liệu phía sau) → tính GIOCHUAN_DETAI + TAPCHIQUOCTE + TAPCHIQUOCGIA.
     · Số thứ tự bản gốc nhảy 1…10, 13, 11, 12, 13… → đánh lại liền mạch.
     · Ý kiến "Số giờ NCKH chuẩn", "Tổng giờ NCKH": bản gốc có ô nhưng không lưu — giữ ô, không gửi.
   ========================================================================= */
(function () {
    'use strict';
    function so(v) { var n = Number(v); return isNaN(n) ? 0 : n; }
    var K = '/modules/sanphamkhoahoc/html/';
    ums.dgpl.phieu({
        root: document.getElementById('dg-phieu'),
        ctrl: 'NS_TDKT_GiangVien',
        rows: [
            { ten: 'Số giờ giảng chuẩn', gio: 'SOGIOCHUAN', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioChuan', c: 'YK_SOGIOCHUAN' } },
            { ten: 'Số giờ miễn giảm', gio: 'SOGIOMIENGIAM', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioMienGiam', c: 'YK_SOGIOMIENGIAM' } },
            { ten: 'Số giờ định mức giảng dạy', gio: 'SOGIODINHMUCGIANGDAYNCKH', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioDinhMucGDNCKH', c: 'YK_SOGIODINHMUCGIANGDAYNCKH' } },
            { ten: 'Số giờ NCKH chuẩn', gio: 'SOGIONCKHCHUAN', donVi: 'Giờ chuẩn', yk: 'khong-gui' },
            { ten: 'Số giờ giảng dạy đại học', gio: 'SOGIODH', diem: 'SOGIODH', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioGiangDayDaiHoc', c: 'YK_SOGIOGIANGDAYDAIHOC' } },
            { ten: 'Số giờ giảng dạy sau đại học', gio: 'SOGIOSDH', diem: 'SOGIOSDH', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioGiangDaySauDaiHoc', c: 'YK_SOGIOGIANGDAYSAUDAIHOC' } },
            { ten: 'Viết sách', gio: 'DIEMVIETSACH', diem: 'DIEMVIETSACH', donVi: { keKhai: K + 'thongtinsach.html' }, yk: { p: 'strYK_DiemVietSach', c: 'YK_DIEMVIETSACH' } },
            { ten: 'Đề tài', gio: 'DIEMDETAI', donVi: { keKhai: K + 'detai.html' }, yk: { p: 'strYK_DiemDeTai', c: 'YK_DIEMDETAI' } },
            { ten: 'Tạp chí quốc gia', gio: 'DIEMBAIBAOTRONGNUOC', donVi: { keKhai: K + 'tapchiquocgia.html' }, yk: { p: 'strYK_DiemBaiBaoTrongNuoc', c: 'YK_DIEMBAIBAOTRONGNUOC' } },
            { ten: 'Tạp chí quốc tế', gio: 'DIEMBAIBAOQUOCTE', donVi: { keKhai: K + 'tapchiquocte.html' }, yk: { p: 'strYK_DiemBaiBaoQuocTe', c: 'YK_DIEMBAIBAOQUOCTE' } },
            { ten: 'Tổng giờ NCKH (Đề tài + tạp chí)', donVi: 'Giờ', yk: 'khong-gui',
              gio: function (d) { return d.ID ? so(d.GIOCHUAN_DETAI) + so(d.GIOCHUAN_TAPCHIQUOCTE) + so(d.GIOCHUAN_TAPCHIQUOCGIA) : ''; } },
            { ten: 'Giải thưởng', gio: 'DIEMTHANHTICHDOTXUAT', donVi: { keKhai: K + 'giaithuong.html' }, yk: { p: 'strYK_DiemThanhTichDotXuat', c: 'YK_DIEMTHANHTICHDOTXUAT' } },
            { ten: 'Văn bằng sáng chế', gio: 'DIEMVANBANGSANGCHE', donVi: { keKhai: K + 'vanbangsangche.html' }, yk: { p: 'strYK_DiemVanBangSangChe', c: 'YK_DIEMVANBANGSANGCHE' } },
            { ten: 'Coi thi', gio: 'SOGIOCOITHI', diem: 'DIEMCOITHI', donVi: 'Giờ chuẩn', yk: { p: 'strYK_SoGioCoiThi', c: 'YK_SOGIOCOITHI' } },
            { ten: 'Điểm công đoàn', diem: 'DIEMCONGDOAN', donVi: 'Giờ chuẩn', yk: { p: 'strYK_DiemCongDoan', c: 'YK_DIEMCONGDOAN' } },
            { ten: 'Điểm họp', diem: 'DIEMHOP', donVi: 'Giờ chuẩn', yk: { p: 'strYK_DiemHop', c: 'YK_DIEMHOP' } }
        ],
        order: ['strYK_SoGioChuan', 'strYK_SoGioMienGiam', 'strYK_SoGioDinhMucGDNCKH', 'strYK_SoGioGiangDayDaiHoc', 'strYK_SoGioHuongDanDaiHoc',
            'strYK_SoGioGiangDaySauDaiHoc', 'strYK_SoGioHuongDanSauDaiHoc', 'strYK_DiemVietSach', 'strYK_DiemDeTai', 'strYK_DiemBaiBaoTrongNuoc',
            'strYK_DiemBaiBaoQuocTe', 'strYK_DiemVanBangSangChe', 'strYK_SoGioCoiThi', 'strYK_DiemCongDoan', 'strYK_DiemHop', 'strYK_DiemThanhTichDotXuat'],
        extraSave: { strYK_SoGioHuongDanDaiHoc: '', strYK_SoGioHuongDanSauDaiHoc: '' }
    });
})();
