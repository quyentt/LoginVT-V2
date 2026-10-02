/* Dữ liệu mẫu cho thongke/nhapdiemlichthi (Quản lý điểm) — phần "Thống kê kết quả"; phần danh sách dùng
   dữ liệu mẫu của bản Cổng cán bộ (vỏ tự nạp ApisCongCanBo/.../nhapdiemlichthi.demo.js). Chỉ dùng ở chế độ dựng thử. */
(function () {
    var hp = [
        { ID: 'HP1', DAOTAO_KHOAQUANLY_ID: 'K1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_MA: 'IT3100' },
        { ID: 'HP2', DAOTAO_KHOAQUANLY_ID: 'K1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Cơ sở dữ liệu', DAOTAO_HOCPHAN_MA: 'IT3090' },
        { ID: 'HP3', DAOTAO_KHOAQUANLY_ID: 'K2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_TEN: 'Kinh tế vi mô', DAOTAO_HOCPHAN_MA: 'EC2010' }
    ];
    function sinh(dm, cot, n) {
        var out = [];
        hp.forEach(function (h, i) {
            dm.forEach(function (c, j) {
                for (var k = 0; k < ((i + 2) * (j + 1) + n) % 7; k++) {
                    var x = { DAOTAO_HOCPHAN_ID: h.DAOTAO_HOCPHAN_ID, DAOTAO_KHOAQUANLY_ID: h.DAOTAO_KHOAQUANLY_ID };
                    x[cot] = c.ID; out.push(x);
                }
            });
        });
        return out;
    }
    var chu = [{ ID: 'A', TEN: 'A' }, { ID: 'B', TEN: 'B' }, { ID: 'C', TEN: 'C' }, { ID: 'D', TEN: 'D' }, { ID: 'F', TEN: 'F' }];
    var dg = [{ ID: 'DAT', TEN: 'Đạt' }, { ID: 'HL', TEN: 'Học lại' }, { ID: 'TL', TEN: 'Thi lại' }];
    var h10 = [{ ID: '10', TEN: '10' }, { ID: '9', TEN: '9' }, { ID: '8', TEN: '8' }, { ID: '7', TEN: '7' }, { ID: '6', TEN: '6' }, { ID: '5', TEN: '5' }];
    var h4 = [{ ID: '4', TEN: '4' }, { ID: '3.5', TEN: '3.5' }, { ID: '3', TEN: '3' }, { ID: '2', TEN: '2' }, { ID: '1', TEN: '1' }];
    ums.demo.add({
        'pkg_diem_thongke.ThongHocTapTheoDST': {
            rsThongTinHocPhan: hp,
            rsDanhMucDiemChu: chu, rsDuLieuDiemChu: sinh(chu, 'DIEMQUYDOI_ID', 1),
            rsDanhMucDanhGia: dg, rsDuLieuDanhGia: sinh(dg, 'DANHGIA_ID', 2),
            rsDanhMucDiemHe10: h10, rsDuLieuDiemHe10: sinh(h10, 'DIEM', 3),
            rsDanhMucDiemHe4: h4, rsDuLieuDiemHe4: sinh(h4, 'DIEMQUYDOI', 4)
        }
    });
})();
