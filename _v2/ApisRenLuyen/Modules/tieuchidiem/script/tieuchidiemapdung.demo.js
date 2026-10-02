/* Dữ liệu mẫu cho Tiêu chí điểm áp dụng — chỉ dùng ở chế độ dựng thử. */
(function () {
    function tc(id, cha, thuTu, ma, ten, diem, nhap) {
        return {
            ID: id, DRL_TIEUCHIDANHGIA_CHA_ID: cha, THUTU: thuTu, MA: ma, TEN: ten, MUCDIEMQUYDINH: diem,
            DRL_TIEUCHIDANHGIA_ID: 'CH-' + id, DOITUONGAPDUNG_ID: 'DT-SV', THANGDIEM_ID: 'TD100', NHOMTIEUCHI_ID: 'NTC1',
            NHAPTRUCTIEP: nhap, PHAMVIAPDUNG_ID: 'K67', DAOTAO_THOIGIANDAOTAO_NAM_ID: 'NH2025', DAOTAO_THOIGIANDAOTAO_KY_ID: 'HK1-2526'
        };
    }
    ums.demo.add({
        'RL_TieuChiDanhGia_AD/LayDanhSach': [
            tc('A1', null, 1, 'TC1', 'Ý thức tham gia học tập', 20, 0),
            tc('A11', 'A1', 1, 'TC1.1', 'Đi học đầy đủ, đúng giờ', 6, 1),
            tc('A12', 'A1', 2, 'TC1.2', 'Tham gia nghiên cứu khoa học', 4, 1),
            tc('A13', 'A1', 3, 'TC1.3', 'Kết quả học tập trong kỳ', 10, 1),
            tc('A2', null, 2, 'TC2', 'Ý thức chấp hành nội quy', 25, 0),
            tc('A21', 'A2', 1, 'TC2.1', 'Chấp hành quy chế thi, kiểm tra', 15, 1),
            tc('A22', 'A2', 2, 'TC2.2', 'Tham gia sinh hoạt lớp', 10, 1),
            tc('A3', null, 3, 'TC3', 'Hoạt động chính trị, văn hoá, thể thao', 20, 1)
        ],
        'RL_TieuChiDanhGia_AD/LayDSTieuChiDanhGiaChuaDung': [
            { ID: 'CH-A4', THUTU: 4, MA: 'TC4', TEN: 'Ý thức công dân trong quan hệ cộng đồng', MUCDIEMQUYDINH: 25,
              DOITUONGAPDUNG_ID: 'DT-SV', THANGDIEM_ID: 'TD100', NHOMTIEUCHI_ID: 'NTC2', NHAPTRUCTIEP: 1, DRL_TIEUCHIDANHGIA_CHA_ID: null },
            { ID: 'CH-A5', THUTU: 5, MA: 'TC5', TEN: 'Tham gia công tác cán bộ lớp, đoàn thể', MUCDIEMQUYDINH: 10,
              DOITUONGAPDUNG_ID: 'DT-SV', THANGDIEM_ID: 'TD100', NHOMTIEUCHI_ID: 'NTC2', NHAPTRUCTIEP: 0, DRL_TIEUCHIDANHGIA_CHA_ID: null }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DRL.THANGDIEM': [
            { ID: 'TD100', MA: '100', TEN: 'Thang điểm 100' }, { ID: 'TD10', MA: '10', TEN: 'Thang điểm 10' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DRL.DMTC': [
            { ID: 'NTC1', MA: 'HT', TEN: 'Học tập và nội quy' }, { ID: 'NTC2', MA: 'CD', TEN: 'Công dân và cộng đồng' }
        ]
    });
})();
