/* Dữ liệu mẫu dùng chung cho hai màn dangky / tracuu — chỉ ở chế độ dựng thử.
   Giữ một "kho" trong bộ nhớ (ums.dkyDemo) để đăng ký / hủy / đổi lịch đổi được
   dữ liệu ngay trên màn hình. Người học dựng thử: SV0001 (Lăng Văn Huy). */
(function () {
    'use strict';
    var K = window.ums.dkyDemo = {};

    K.ct = [
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Đại học Chính quy Khóa 16 - 4.5 năm - Kỹ thuật cơ điện tử',
          QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_ANH: '', TAIKHOAN: '' },
        { DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Đại học Chính quy Khóa 16 - Ngành 2 - Công nghệ thông tin',
          QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_ANH: '', TAIKHOAN: '' }
    ];

    K.kh = [
        { ID: 'KH1', MAKEHOACH: 'DK2026A', TENKEHOACH: 'Đăng ký học kỳ 1 năm học 2026 - 2027',
          NGAYBATDAU: '01/09/2026', GIODANGKYTRONGNGAYDAU: '08', PHUTDANGKYTRONGNGAYDAU: '00',
          NGAYKETTHUC: '10/09/2026', GIOKETTHUCTRONGNGAYCUOI: '17', PHUTKETTHUCTRONGNGAYCUOI: '00',
          THONGTINTHOIGIANRUTHP: '11/09/2026 08:00 - 20/09/2026 17:00',
          SOTINCHIDADANGKY: 6, SOTINCHITOIDACHUONGTRINH: 24, SOTINCHITOITHIEUCHUONGTRINH: 12, SOGIAYCHO: 0 },
        { ID: 'KH2', MAKEHOACH: 'DK2026A-BS', TENKEHOACH: 'Đăng ký bổ sung học kỳ 1 năm học 2026 - 2027',
          NGAYBATDAU: '15/09/2026', GIODANGKYTRONGNGAYDAU: '08', PHUTDANGKYTRONGNGAYDAU: '30',
          NGAYKETTHUC: '18/09/2026', GIOKETTHUCTRONGNGAYCUOI: '16', PHUTKETTHUCTRONGNGAYCUOI: '30',
          THONGTINTHOIGIANRUTHP: '', SOTINCHIDADANGKY: 0, SOTINCHITOIDACHUONGTRINH: 24, SOTINCHITOITHIEUCHUONGTRINH: 12, SOGIAYCHO: 0 }
    ];

    /* Học phần đang tổ chức — DADANGKY > 0 là đã đăng ký (hiện dấu tích) */
    K.hp = [
        { DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'MEM703002', DAOTAO_HOCPHAN_TEN: 'Chi tiết máy', DADANGKY: 0 },
        { DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'IT3100', DAOTAO_HOCPHAN_TEN: 'Lập trình hướng đối tượng', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_MA: 'MAT1093', DAOTAO_HOCPHAN_TEN: 'Giải tích 2', DADANGKY: 0 },
        { DAOTAO_HOCPHAN_ID: 'HP4', DAOTAO_HOCPHAN_MA: 'PHY1001', DAOTAO_HOCPHAN_TEN: 'Vật lý đại cương 1', DADANGKY: 0 },
        { DAOTAO_HOCPHAN_ID: 'HP5', DAOTAO_HOCPHAN_MA: 'ENG1002', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 2', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP6', DAOTAO_HOCPHAN_MA: 'MEM701001', DAOTAO_HOCPHAN_TEN: 'Nguyên lý máy', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP7', DAOTAO_HOCPHAN_MA: 'EE2010', DAOTAO_HOCPHAN_TEN: 'Kỹ thuật điện tử', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP8', DAOTAO_HOCPHAN_MA: 'MEM705004', DAOTAO_HOCPHAN_TEN: 'Kỹ thuật gia công cơ khí', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP9', DAOTAO_HOCPHAN_MA: 'POL1001', DAOTAO_HOCPHAN_TEN: 'Chủ nghĩa xã hội khoa học', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP10', DAOTAO_HOCPHAN_MA: 'STA1002', DAOTAO_HOCPHAN_TEN: 'Thống kê đại cương', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP11', DAOTAO_HOCPHAN_MA: 'MEM706002', DAOTAO_HOCPHAN_TEN: 'Đồ án chi tiết máy', DADANGKY: 1 },
        { DAOTAO_HOCPHAN_ID: 'HP12', DAOTAO_HOCPHAN_MA: 'IT4200', DAOTAO_HOCPHAN_TEN: 'Vi điều khiển và ứng dụng', DADANGKY: 0 }
    ];

    function lop(id, hp, ten, thu, tong, da, phi, o) {
        var r = {
            ID: id, DAOTAO_HOCPHAN_ID: hp, TENLOP: ten, THUHOC: thu, THUHOC_TIETHOC: thu + '(1-3)',
            SOLUONGDUKIENHOC: tong, SOTHUCTEDANGKYHOC: da, PHISAUKHITRUMIEN: phi,
            SOLOPTHUOCCUNGNHOM: 1, MANHOMLOP: null, LOPHOCPHANCHINH: 1, THUOCTINHLOP_ID: null, THUOCTINHLOP_TEN: 'Lý thuyết',
            NGAYBATDAU: '05/10/2026', NGAYKETTHUC: '28/12/2026', GIANGVIEN: 'TS. Nguyễn Văn Bình',
            DAOTAO_CHUONGTRINH_ID: 'CT1', DANGKY_KEHOACHDANGKY_ID: 'KH1', DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1',
            KIEUHOC_ID: 'KIEU1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', QLSV_NGUOIHOC_ID: 'SV0001', SOTINCHIDADANGKY: 6
        };
        Object.keys(o || {}).forEach(function (k) { r[k] = o[k]; });
        return r;
    }
    K.lop = function (id) { return K.lhp.filter(function (x) { return x.ID === id; })[0]; };

    /* Lớp học phần: HP1 có nhóm (lý thuyết + thảo luận + thực hành), còn lại lớp đơn */
    K.lhp = [
        lop('L11', 'HP1', 'MEM703002 - Chi tiết máy - N01', '2', 60, 41, 1650000, { SOLOPTHUOCCUNGNHOM: 3, MANHOMLOP: 'MEM703002-N01' }),
        lop('L12', 'HP1', 'MEM703002 - Chi tiết máy - N02', '4', 60, 58, 1650000, { SOLOPTHUOCCUNGNHOM: 3, MANHOMLOP: 'MEM703002-N02' }),
        lop('L13', 'HP1', 'MEM703002 - Chi tiết máy - N01 - TL1', '3', 30, 18, 0, { SOLOPTHUOCCUNGNHOM: 3, MANHOMLOP: 'MEM703002-N01', LOPHOCPHANCHINH: 0, THUOCTINHLOP_ID: 'TT2', THUOCTINHLOP_TEN: 'Thảo luận' }),
        lop('L14', 'HP1', 'MEM703002 - Chi tiết máy - N01 - TL2', '5', 30, 30, 0, { SOLOPTHUOCCUNGNHOM: 3, MANHOMLOP: 'MEM703002-N01', LOPHOCPHANCHINH: 0, THUOCTINHLOP_ID: 'TT2', THUOCTINHLOP_TEN: 'Thảo luận' }),
        lop('L15', 'HP1', 'MEM703002 - Chi tiết máy - N01 - TH1', '6', 25, 12, 0, { SOLOPTHUOCCUNGNHOM: 3, MANHOMLOP: 'MEM703002-N01', LOPHOCPHANCHINH: 0, THUOCTINHLOP_ID: 'TT3', THUOCTINHLOP_TEN: 'Thực hành' }),
        lop('L16', 'HP1', 'MEM703002 - Chi tiết máy - N03', '5', 60, 33, 1650000, { GIANGVIEN: 'ThS. Trần Thị Hoa' }),
        lop('L17', 'HP1', 'MEM703002 - Chi tiết máy - N04', '7', 60, 12, 1650000, { GIANGVIEN: 'ThS. Lê Quang Dũng' }),
        lop('L21', 'HP2', 'IT3100 - Lập trình hướng đối tượng - N01', '3', 80, 76, 2400000, {}),
        lop('L22', 'HP2', 'IT3100 - Lập trình hướng đối tượng - N02', '5', 80, 44, 2400000, {}),
        lop('L23', 'HP2', 'IT3100 - Lập trình hướng đối tượng - N03', '6', 80, 61, 2400000, { GIANGVIEN: 'ThS. Lê Quang Dũng' }),
        lop('L24', 'HP2', 'IT3100 - Lập trình hướng đối tượng - N04', '7', 80, 29, 2400000, { GIANGVIEN: 'ThS. Trần Thị Hoa' }),
        lop('L31', 'HP3', 'MAT1093 - Giải tích 2 - N01', '2', 100, 92, 1200000, {}),
        lop('L32', 'HP3', 'MAT1093 - Giải tích 2 - N02', '6', 100, 35, 1200000, {}),
        lop('L41', 'HP4', 'PHY1001 - Vật lý đại cương 1 - N01', '4', 90, 51, 1800000, {}),
        lop('L51', 'HP5', 'ENG1002 - Tiếng Anh 2 - N01', '7', 35, 30, 2100000, {}),
        lop('L61', 'HP6', 'MEM701001 - Nguyên lý máy - N01', '2', 70, 64, 1650000, {}),
        lop('L62', 'HP6', 'MEM701001 - Nguyên lý máy - N01 - TH1', '5', 30, 27, 0,
            { LOPHOCPHANCHINH: 0, THUOCTINHLOP_ID: 'TT3', THUOCTINHLOP_TEN: 'Thực hành' }),
        lop('L71', 'HP7', 'EE2010 - Kỹ thuật điện tử - N02', '3', 75, 70, 1950000, { GIANGVIEN: 'ThS. Trần Thị Hoa' }),
        lop('L81', 'HP8', 'MEM705004 - Kỹ thuật gia công cơ khí - N01', '4', 30, 30, 2250000, { THUOCTINHLOP_TEN: 'Thực hành', GIANGVIEN: 'ThS. Lê Quang Dũng' }),
        lop('L82', 'HP8', 'MEM705004 - Kỹ thuật gia công cơ khí - N01 - TH2', '6', 30, 21, 0,
            { LOPHOCPHANCHINH: 0, THUOCTINHLOP_ID: 'TT3', THUOCTINHLOP_TEN: 'Thực hành' }),
        lop('L91', 'HP9', 'POL1001 - Chủ nghĩa xã hội khoa học - N04', '2', 120, 118, 900000, { GIANGVIEN: 'TS. Phạm Thu Hà' }),
        lop('L92', 'HP9', 'POL1001 - Chủ nghĩa xã hội khoa học - N04 - TL1', '4', 60, 58, 0,
            { LOPHOCPHANCHINH: 0, THUOCTINHLOP_ID: 'TT2', THUOCTINHLOP_TEN: 'Thảo luận' }),
        lop('LA1', 'HP10', 'STA1002 - Thống kê đại cương - N01', '5', 90, 83, 1200000, { GIANGVIEN: 'ThS. Đỗ Minh Khôi' }),
        lop('LB1', 'HP11', 'MEM706002 - Đồ án chi tiết máy - N01', '6', 25, 25, 1500000, { THUOCTINHLOP_TEN: 'Đồ án', GIANGVIEN: 'TS. Nguyễn Văn Bình' }),
        lop('LC1', 'HP12', 'IT4200 - Vi điều khiển và ứng dụng - N01', '3', 60, 39, 2400000, { GIANGVIEN: 'ThS. Trần Thị Hoa' })
    ];

    K.thuocTinh = [
        { THUOCTINHLOP_ID: 'TT2', THUOCTINHLOP_TEN: 'Thảo luận', MANHOMLOP: 'MEM703002-N01', LOPHOCPHANCHINH: 0 },
        { THUOCTINHLOP_ID: 'TT3', THUOCTINHLOP_TEN: 'Thực hành', MANHOMLOP: 'MEM703002-N01', LOPHOCPHANCHINH: 0 },
        { THUOCTINHLOP_ID: 'TT2', THUOCTINHLOP_TEN: 'Thảo luận', MANHOMLOP: 'MEM703002-N02', LOPHOCPHANCHINH: 0 }
    ];

    /** Một dòng kết quả đăng ký dựng từ một lớp học phần */
    K.dongKQ = function (l) {
        return {
            ID: 'KQ' + l.ID, DANGKY_LOPHOCPHAN_ID: l.ID, DANGKY_LOPHOCPHAN_TEN: l.TENLOP,
            DAOTAO_HOCPHAN_ID: l.DAOTAO_HOCPHAN_ID,
            DAOTAO_HOCPHAN_TEN: (K.hp.filter(function (h) { return h.DAOTAO_HOCPHAN_ID === l.DAOTAO_HOCPHAN_ID; })[0] || {}).DAOTAO_HOCPHAN_TEN,
            DAOTAO_HOCPHAN_MA: (K.hp.filter(function (h) { return h.DAOTAO_HOCPHAN_ID === l.DAOTAO_HOCPHAN_ID; })[0] || {}).DAOTAO_HOCPHAN_MA,
            THUOCTINHLOP_ID: l.THUOCTINHLOP_ID, THUOCTINHLOP_TEN: l.THUOCTINHLOP_TEN, MANHOMLOP: l.MANHOMLOP, LOPHOCPHANCHINH: l.LOPHOCPHANCHINH,
            SOLUONGDUKIENHOC: l.SOLUONGDUKIENHOC, SOTHUCTEDANGKYHOC: l.SOTHUCTEDANGKYHOC,
            NGAYBATDAU: l.NGAYBATDAU, NGAYKETTHUC: l.NGAYKETTHUC, THUHOC: l.THUHOC, THUHOC_TIETHOC: l.THUHOC_TIETHOC,
            PHISAUKHITRUMIEN: l.PHISAUKHITRUMIEN, SOTINCHIDADANGKY: 6,
            DAOTAO_TOCHUCCHUONGTRINH_ID: l.DAOTAO_TOCHUCCHUONGTRINH_ID, DANGKY_KEHOACHDANGKY_ID: l.DANGKY_KEHOACHDANGKY_ID,
            QLSV_NGUOIHOC_ID: 'SV0001', KIEUHOC_ID: l.KIEUHOC_ID, KIEUHOC_TEN: 'Học lần đầu', DAOTAO_THOIGIANDAOTAO_ID: l.DAOTAO_THOIGIANDAOTAO_ID
        };
    };

    /* Đã đăng ký sẵn — nhiều môn để nhìn được cách xếp khối (masonry) và 10 màu lặp lại */
    K.kq = ['L21', 'L51', 'L61', 'L62', 'L71', 'L81', 'L82', 'L91', 'L92', 'LA1', 'LB1']
        .map(function (id) { return K.dongKQ(K.lop(id)); });

    /** Đọc ngược { strVal } của các lời GHI (XOR "chaolong") */
    K.doc = function (o) {
        try { return JSON.parse(window.ums.dky.unXor(o.strVal, 'chaolong')); } catch (x) { return {}; }
    };
    K.datDaDangKy = function () {
        K.hp.forEach(function (h) {
            h.DADANGKY = K.kq.filter(function (q) { return q.DAOTAO_HOCPHAN_ID === h.DAOTAO_HOCPHAN_ID; }).length ? 1 : 0;
        });
    };

    ums.demo.add({
        /* Lịch tuần theo lớp học phần — hai màn gọi hai dịch vụ khác nhau, cùng dữ liệu */
        'PKG_DANGKYHOC_CHUNG7.LayLichTuanTheoLopHocPhan': lich,
        'pkg_dangkyhoc_chung.LayLichTuanTheoLopHocPhan': lich,
        'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemDanh': [
            { NGAYGHINHAN: '06/10/2026', TIETBATDAU: 1, TIETKETTHUC: 3, KIEUCHUYENCAN_TEN: 'Có mặt', SOLUONG: 3, TINHTRANGDUYETDKTHI_TEN: 'Đủ điều kiện dự thi' },
            { NGAYGHINHAN: '13/10/2026', TIETBATDAU: 1, TIETKETTHUC: 3, KIEUCHUYENCAN_TEN: 'Vắng có phép', SOLUONG: 3, TINHTRANGDUYETDKTHI_TEN: 'Đủ điều kiện dự thi' },
            { NGAYGHINHAN: '20/10/2026', TIETBATDAU: 1, TIETKETTHUC: 3, KIEUCHUYENCAN_TEN: 'Có mặt', SOLUONG: 3, TINHTRANGDUYETDKTHI_TEN: 'Đủ điều kiện dự thi' }
        ],
        'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemQuaTrinh': [
            { DIEM_THANHPHANDIEM_TEN: 'Điểm chuyên cần', DIEM: 9 },
            { DIEM_THANHPHANDIEM_TEN: 'Điểm giữa kỳ', DIEM: 7.5 },
            { DIEM_THANHPHANDIEM_TEN: 'Điểm bài tập lớn', DIEM: 8 }
        ]
    });

    function lich(o) {
        var l = K.lop(o.strDangKy_LopHocPhan_Id) || {};
        return [1, 2, 3].map(function (i) {
            return {
                BUOIHOC: 'Buổi ' + i, NGAYBATDAU: l.NGAYBATDAU || '05/10/2026', NGAYKETTHUC: l.NGAYKETTHUC || '28/12/2026',
                THUHOC: l.THUHOC || '2', SOTIET: 3, TIETBATDAU: i === 3 ? 7 : 1, TIETKETTHUC: i === 3 ? 9 : 3,
                GIOBATDAU: i === 3 ? '13' : '07', PHUTBATDAU: '00', GIOKETTHUC: i === 3 ? '15' : '09', PHUTKETTHUC: '30',
                PHONGHOC_TEN: 'A2-30' + i, GIANGVIEN: l.GIANGVIEN || 'TS. Nguyễn Văn Bình', THUOCTINH_TEN: l.THUOCTINHLOP_TEN || 'Lý thuyết'
            };
        });
    }
})();
