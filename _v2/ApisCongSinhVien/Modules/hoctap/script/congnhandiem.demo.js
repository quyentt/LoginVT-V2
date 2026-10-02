/* Dữ liệu mẫu cho hoctap/congnhandiem (Kế hoạch học tập) — chỉ dùng ở chế độ dựng thử.
   Màn nạp chung tệp dangkyhoc/script/_congnhandiem.js nên _congnhandiem.demo.js cũng được
   nạp trước: kế hoạch / chương trình / cơ sở công nhận / SV_Files lấy từ đó. Ở đây khai
   những khoá RIÊNG của màn và đè LayDSChuongTrinhHoc (màn này đọc cột khác).
   Giữ đúng tên cột máy chủ trả; đường GHI đổi luôn dữ liệu trong bộ nhớ. Người học: SV0001. */
(function () {
    'use strict';
    var P = 'pkg_congthongtin_congnhandiem.', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }

    /* ---------- Danh sách học phần của chương trình (LayDSChuongTrinhHoc) ---------- */
    var HP = [
        { ID: 'HPC1', DAOTAO_HOCPHAN_ID: 'HP1', DAOTAO_HOCPHAN_MA: 'EN1010', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1',
          HOCTRINHAPDUNGHOCTAP: 3, KETQUA: '', KETQUAMOI: '', DADANGKYCONGNHAN: 0, TINHTRANG_TEN: '' },
        { ID: 'HPC2', DAOTAO_HOCPHAN_ID: 'HP2', DAOTAO_HOCPHAN_MA: 'EN1020', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 2',
          HOCTRINHAPDUNGHOCTAP: 3, KETQUA: '', KETQUAMOI: '8.0', DADANGKYCONGNHAN: 1, TINHTRANG_TEN: 'Chờ duyệt' },
        { ID: 'HPC3', DAOTAO_HOCPHAN_ID: 'HP3', DAOTAO_HOCPHAN_MA: 'IT1010', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương',
          HOCTRINHAPDUNGHOCTAP: 2, KETQUA: '7.5', KETQUAMOI: '', DADANGKYCONGNHAN: 0, TINHTRANG_TEN: '' },
        { ID: 'HPC4', DAOTAO_HOCPHAN_ID: 'HP4', DAOTAO_HOCPHAN_MA: 'PE1010', DAOTAO_HOCPHAN_TEN: 'Giáo dục thể chất 1',
          HOCTRINHAPDUNGHOCTAP: 1, KETQUA: '', KETQUAMOI: '', DADANGKYCONGNHAN: 1, TINHTRANG_TEN: 'Hết hiệu lực' },
        { ID: 'HPC5', DAOTAO_HOCPHAN_ID: 'HP5', DAOTAO_HOCPHAN_MA: 'MA1010', DAOTAO_HOCPHAN_TEN: 'Giải tích 1',
          HOCTRINHAPDUNGHOCTAP: 4, KETQUA: '6.0', KETQUAMOI: '', DADANGKYCONGNHAN: 0, TINHTRANG_TEN: '' }
    ];
    function timHP(id) { return HP.filter(function (x) { return x.DAOTAO_HOCPHAN_ID === id; })[0]; }
    fx[P + 'LayDSChuongTrinhHoc'] = function (o) { return o.strDaoTao_ChuongTrinh_Id ? HP : []; };

    /* ---------- Học phần đã đánh dấu → bảng khai hàng loạt ---------- */
    fx[P + 'LayDSDangKyCongNhan'] = function (o) {
        var ids = String(o.strDaoTao_HocPhan_Id || '').split(',').filter(Boolean);
        return ids.map(function (id) {
            var h = timHP(id) || {};
            return { ID: id, MA: h.DAOTAO_HOCPHAN_MA || id, TEN: h.DAOTAO_HOCPHAN_TEN || '' };
        });
    };

    /* ---------- Danh mục ---------- */
    fx[D + 'DIEM.CONGNHAN.LOAI'] = [
        dm('LCN1', 'CC', 'Công nhận theo chứng chỉ', 'Loại công nhận'),
        dm('LCN2', 'BD', 'Công nhận theo bảng điểm', 'Loại công nhận'),
        dm('LCN3', 'MG', 'Miễn học - miễn thi', 'Loại công nhận')
    ];
    fx[P + 'LayDSLoaiCC_BangDiem'] = [
        { ID: 'LCC1', TEN: 'Chứng chỉ ngoại ngữ' },
        { ID: 'LCC2', TEN: 'Chứng chỉ tin học' },
        { ID: 'LCC3', TEN: 'Bảng điểm trường ngoài' }
    ];
    fx[P + 'LayDSLoaiCC_BDTheoPhanLoai'] = function (o) {
        if (o.strLoaiCC_BD_Id === 'LCC2') return [{ ID: 'PL3', TEN: 'Ứng dụng CNTT cơ bản' }];
        if (o.strLoaiCC_BD_Id === 'LCC3') return [{ ID: 'PL4', TEN: 'Công nhận theo bảng điểm' }];
        return [{ ID: 'PL1', TEN: 'VSTEP bậc 3' }, { ID: 'PL2', TEN: 'IELTS 5.5 trở lên' }];
    };
    fx[P + 'LayDSCoSoDaoTaoTheoLoai'] = function (o) {
        if (!o.strLoaiCongNhan_Id) return [];
        return o.strLoaiCongNhan_Id === 'LCN2' || o.strLoaiCongNhan_Id === 'PL4'
            ? [{ ID: 'CS2', TEN: 'Trường Đại học Bách khoa Hà Nội' }, { ID: 'CS4', TEN: 'Học viện Nông nghiệp Việt Nam' }]
            : [{ ID: 'CS1', TEN: 'Trường Đại học Ngoại ngữ - ĐHQG Hà Nội' }, { ID: 'CS3', TEN: 'IIG Việt Nam' }];
    };

    /* ---------- Thông tin công nhận của MỘT học phần ---------- */
    var CAP = {                 // học phần → bản ghi Diem_NguoiHoc_HocPhan_Cap
        HP2: { ID: 'CAP2', LOAICC_BANGDIEM_ID: 'LCC1', LOAICONGNHAN_ID: 'PL2', DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS3',
               DIEM: '8.0', NGAYCAP: '10/06/2026', NGAYHETHAN: '10/06/2028', GHICHU: 'Chứng chỉ IELTS 6.0',
               HEDAOTAO: 'Chính quy', SOTINCHI: 3, THONGTINHOCPHAN_CHUNGCHI: 'IELTS 6.0' }
    };
    var seq = 1;
    fx[P + 'LayTTDiem_NguoiHoc_HocPhan_Cap'] = function (o) {
        var c = CAP[o.strDaoTao_HocPhan_Id];
        return c ? [c] : [];
    };
    fx[P + 'Them_Diem_NguoiHoc_HocPhan_Cap'] = function (o) {
        var hp = timHP(o.strDaoTao_HocPhan_Id);
        var id = o.strId || ('CAP' + (100 + seq++));
        CAP[o.strDaoTao_HocPhan_Id] = {
            ID: id, LOAICC_BANGDIEM_ID: '', LOAICONGNHAN_ID: o.strLoaiCongNhan_Id,
            DIEM_COSODAOTAOCONGNHANDIEM_ID: o.strDiem_CoSoCongNhan_Id, DIEM: o.strDiem,
            NGAYCAP: o.strNgayCap, NGAYHETHAN: o.strNgayHetHan, GHICHU: o.strGhiChu,
            HEDAOTAO: o.strHeDaoTao, SOTINCHI: o.dSoTinChi, THONGTINHOCPHAN_CHUNGCHI: o.strThongTinHocPhan_ChungChi
        };
        if (hp) { hp.DADANGKYCONGNHAN = 1; hp.TINHTRANG_TEN = 'Chờ duyệt'; hp.KETQUAMOI = o.strDiem || hp.KETQUAMOI; }
        return { rows: [], raw: { Id: id } };
    };
    fx[P + 'Xoa_Diem_NguoiHoc_HocPhan_Cap'] = function (o) {
        Object.keys(CAP).forEach(function (k) {
            if (CAP[k].ID === o.strIds) {
                delete CAP[k];
                var hp = timHP(k);
                if (hp) { hp.DADANGKYCONGNHAN = 0; hp.TINHTRANG_TEN = ''; hp.KETQUAMOI = ''; }
            }
        });
        return [];
    };

    ums.demo.add(fx);
})();
