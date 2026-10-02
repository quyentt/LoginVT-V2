/* Dữ liệu mẫu cho khaosat/phieu — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'KS_ThongTin/', fx = {}, seq = 10;
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLKS.LPKS'] = [{ ID: 'LP1', MA: 'SV', TEN: 'Phiếu lấy ý kiến sinh viên' }, { ID: 'LP2', MA: 'CB', TEN: 'Phiếu khảo sát cán bộ' }];
    var P = [
        { ID: 'PH1', TENPHIEU: 'Phiếu lấy ý kiến người học về giảng viên', MAPHIEU: 'PYK01', LOAIPHIEU_ID: 'LP1', LOAIPHIEU_TEN: 'Phiếu lấy ý kiến sinh viên', MOTA: 'Khảo sát cuối mỗi học phần' },
        { ID: 'PH2', TENPHIEU: 'Khảo sát mức độ hài lòng của cán bộ', MAPHIEU: 'KSCB01', LOAIPHIEU_ID: 'LP2', LOAIPHIEU_TEN: 'Phiếu khảo sát cán bộ', MOTA: '' }
    ];
    var N = [{ ID: 'N1', P: 'PH1', TEN: 'Nội dung giảng dạy', THUTU: 1, MOTA: '' }, { ID: 'N2', P: 'PH1', TEN: 'Phương pháp giảng dạy', THUTU: 2, MOTA: '' }];
    var CH = [
        { ID: 'CH1', P: 'PH1', KS_NHOMCAUHOI_ID: 'N1', TENCAUHOI: 'Giảng viên giới thiệu đề cương học phần đầy đủ', KS_LOAICAUHOI_ID: 3, CAUHOIBATBUOCTRALOI: 1, CACHHIENTHICAUHOI: 0, THUTU: 1 },
        { ID: 'CH2', P: 'PH1', KS_NHOMCAUHOI_ID: 'N1', TENCAUHOI: 'Tài liệu học tập được cung cấp', KS_LOAICAUHOI_ID: 4, CAUHOIBATBUOCTRALOI: 0, CACHHIENTHICAUHOI: 1, THUTU: 2 },
        { ID: 'CH3', P: 'PH1', KS_NHOMCAUHOI_ID: 'N2', TENCAUHOI: 'Góp ý khác cho giảng viên', KS_LOAICAUHOI_ID: 2, CAUHOIBATBUOCTRALOI: 0, CACHHIENTHICAUHOI: 1, THUTU: 1 },
        { ID: 'CH4', P: 'PH1', KS_NHOMCAUHOI_ID: '', TENCAUHOI: 'Bạn có giới thiệu học phần này cho bạn khác?', KS_LOAICAUHOI_ID: 3, CAUHOIBATBUOCTRALOI: 1, CACHHIENTHICAUHOI: 0, THUTU: 9 }
    ];
    function muc(id, cau, ten, ma, tt, ts) { return { ID: id, KS_CAUHOI_ID: cau, TENDAPAN: ten, MADAPAN: ma, THUTU: tt, TRONGSODIEM: ts }; }
    var DA = [
        muc('D1', 'CH1', 'Hoàn toàn đồng ý', 'A', 1, 5), muc('D2', 'CH1', 'Đồng ý', 'B', 2, 4), muc('D3', 'CH1', 'Không đồng ý', 'C', 3, 2),
        muc('D4', 'CH2', 'Giáo trình', 'GT', 1, 1), muc('D5', 'CH2', 'Bài giảng điện tử', 'BG', 2, 1),
        muc('D6', 'CH4', 'Có', 'Y', 1, 1), muc('D7', 'CH4', 'Không', 'N', 2, 0)
    ];
    function kho(ten, rows, key, map) {
        function luu(o) {
            var r = o.strId ? rows.filter(function (x) { return x.ID === o.strId; })[0] : null;
            if (!r) { r = { ID: ten + (seq++) }; rows.push(r); }
            var m = map(o); Object.keys(m).forEach(function (k) { r[k] = m[k]; });
            return { rows: [], raw: { Id: r.ID } };
        }
        fx[C + 'Them_' + key] = luu; fx[C + 'Sua_' + key] = luu;
        fx[C + 'Xoa_' + key] = function (o) { for (var i = rows.length - 1; i >= 0; i--) if (rows[i].ID === o.strId) rows.splice(i, 1); return []; };
    }
    fx[C + 'LayDSPhieu_Mau_NguoiDung'] = function () { return P.slice(); };
    kho('PH', P, 'KS_PhieuKhaoSat_Mau', function (o) { return { TENPHIEU: o.strTenPhieu, MAPHIEU: o.strMaPhieu, LOAIPHIEU_ID: o.strLoaiPhieu_Id, MOTA: o.strMoTa }; });
    fx[C + 'LayDSKS_NhomKhaoSat'] = function (o) { return N.filter(function (n) { return n.P === o.strKS_PhieuKhaoSat_Mau_Id; }); };
    kho('N', N, 'KS_NhomKhaoSat', function (o) { return { P: o.strKS_PhieuKhaoSat_Mau_Id, TEN: o.strTen, THUTU: o.dThuTu, MOTA: o.strMoTa }; });
    fx[C + 'LayDSKS_CauHoi'] = function (o) { return CH.filter(function (c) { return c.P === o.strKS_PhieuKhaoSat_Mau_Id; }); };
    kho('CH', CH, 'KS_CauHoi', function (o) {
        return { P: o.strKS_PhieuKhaoSat_Mau_Id, KS_NHOMCAUHOI_ID: o.strKS_NhomCauHoi_Id, TENCAUHOI: o.strTenCauHoi, KS_LOAICAUHOI_ID: o.strKS_LoaiCauHoi_Id,
            CAUHOIBATBUOCTRALOI: o.dCauHoiBatBuocTraLoi, CACHHIENTHICAUHOI: o.dCachHienThiCauHoi, THUTU: o.dThuTu };
    });
    fx[C + 'LayDSKS_CauHoi_DapAn'] = function (o) { return DA.filter(function (d) { return d.KS_CAUHOI_ID === o.strKS_CauHoi_Id; }); };
    kho('D', DA, 'KS_CauHoi_DapAn', function (o) { return { KS_CAUHOI_ID: o.strKS_CauHoi_Id, TENDAPAN: o.strTenDapAn, MADAPAN: o.strMaDapAn, THUTU: o.dThuTu, TRONGSODIEM: o.dTrongSo }; });
    ums.demo.add(fx);
})();
