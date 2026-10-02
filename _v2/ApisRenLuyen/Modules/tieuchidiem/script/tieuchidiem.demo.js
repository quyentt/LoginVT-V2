/* Dữ liệu mẫu cho tieuchidiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }

    var fx = {};
    fx[DM + 'DRL.DOITUONGAPDUNG'] = [dm('DT1', 'SVCQ', 'Sinh viên chính quy'), dm('DT2', 'SVLT', 'Sinh viên liên thông'),
        dm('DT3', 'HVCH', 'Học viên cao học')];
    fx[DM + 'DRL.THANGDIEM'] = [dm('TD1', 'T100', 'Thang điểm 100'), dm('TD2', 'T10', 'Thang điểm 10')];
    fx[DM + 'DRL.DMTC'] = [dm('NT1', 'CHINH', 'Tiêu chí chính'), dm('NT2', 'CONG', 'Điểm cộng'), dm('NT3', 'TRU', 'Điểm trừ')];
    ums.demo.add(fx);

    function tc(id, cha, tt, ma, ten, diem, nhom) {
        return { ID: id, DRL_TIEUCHIDANHGIA_CHA_ID: cha, THUTU: tt, MA: ma, TEN: ten, MUCDIEMQUYDINH: diem,
            DOITUONGAPDUNG_ID: 'DT1', THANGDIEM_ID: 'TD1', NHOMTIEUCHI_ID: nhom || 'NT1', NHAPTRUCTIEP: cha ? 1 : 0 };
    }
    var ROWS = [
        tc('TC1', null, 1, 'I', 'Ý thức học tập', 20),
        tc('TC11', 'TC1', 1, 'I.1', 'Đi học đầy đủ, đúng giờ', 8),
        tc('TC12', 'TC1', 2, 'I.2', 'Kết quả học tập', 8),
        tc('TC121', 'TC12', 1, 'I.2.a', 'Điểm TB từ 3,2', 8),
        tc('TC122', 'TC12', 2, 'I.2.b', 'Điểm TB từ 2,5 đến dưới 3,2', 5),
        tc('TC13', 'TC1', 3, 'I.3', 'Tham gia nghiên cứu khoa học', 4, 'NT2'),
        tc('TC2', null, 2, 'II', 'Chấp hành nội quy, quy chế', 25),
        tc('TC21', 'TC2', 1, 'II.1', 'Chấp hành quy chế thi', 15),
        tc('TC22', 'TC2', 2, 'II.2', 'Vi phạm nội quy ký túc xá', -10, 'NT3'),
        tc('TC3', null, 3, 'III', 'Hoạt động chính trị, xã hội, văn hoá, thể thao', 20),
        tc('TC4', null, 4, 'IV', 'Ý thức công dân trong quan hệ cộng đồng', 25),
        tc('TC5', null, 5, 'V', 'Tham gia công tác lớp, đoàn thể', 10)
    ];
    ums.demo.crudStore('RL_TieuChiDanhGia', ROWS, {
        map: function (o) {
            return { DRL_TIEUCHIDANHGIA_CHA_ID: o.strDRL_TieuChiDanhGia_Cha_Id || null, THUTU: o.iThuTu, MA: o.strMa, TEN: o.strTen,
                MUCDIEMQUYDINH: o.dMucDiemQuyDinh, DOITUONGAPDUNG_ID: o.strDoiTuongApDung_Id, THANGDIEM_ID: o.strThangDiem_Id,
                NHOMTIEUCHI_ID: o.strNhomTieuChi_Id, NHAPTRUCTIEP: o.dNhapTrucTiep };
        },
        list: function (rows, o) {
            return rows.filter(function (r) { return !o.strDoiTuongApDung_Id || r.DOITUONGAPDUNG_ID === o.strDoiTuongApDung_Id; });
        }
    });
})();
