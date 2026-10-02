/* Dữ liệu mẫu dùng chung của nhóm A module Lương (đi cùng _luongA.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(id, ma, ten, bang) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_ID: bang || '' }; }

    fx[D + 'NHANSU.LOAIBANGLUONG'] = [dm('BL1', 'LT', 'Bảng lương tháng'), dm('BL2', 'TN', 'Thu nhập tăng thêm')];
    fx['L_BangQuyDinhLuong/LayDanhSach'] = [
        { ID: 'QD1', MUCLUONGCOBAN: '1800000', SOBACLUONGTOIDA: 12, LUONGTOITHIEUVUNG: '4680000', NGAYBATDAUAPDUNG: '01/07/2023', NGAYKETTHUCAPDUNG: '30/06/2024' },
        { ID: 'QD2', MUCLUONGCOBAN: '2340000', SOBACLUONGTOIDA: 12, LUONGTOITHIEUVUNG: '4960000', NGAYBATDAUAPDUNG: '01/07/2024', NGAYKETTHUCAPDUNG: '' }
    ];

    /* Ô thành viên theo đơn vị — NS_HoSoV2/LayDanhSach (kiểu cũ) */
    var NS = [
        { ID: 'NS1', MASO: 'CB001', HOTEN: 'Nguyễn Văn Hùng', HODEM: 'Nguyễn Văn', TEN: 'Hùng', DAOTAO_COCAUTOCHUC_ID: 'CC1' },
        { ID: 'NS2', MASO: 'CB015', HOTEN: 'Trần Thị Mai', HODEM: 'Trần Thị', TEN: 'Mai', DAOTAO_COCAUTOCHUC_ID: 'CC3' },
        { ID: 'NS3', MASO: 'CB102', HOTEN: 'Lê Quang Minh', HODEM: 'Lê Quang', TEN: 'Minh', DAOTAO_COCAUTOCHUC_ID: 'CC1' }
    ];
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        return NS.filter(function (r) { return !o.strDaoTao_CoCauToChuc_Id || r.DAOTAO_COCAUTOCHUC_ID === o.strDaoTao_CoCauToChuc_Id; });
    };

    /* Danh mục thành phần lương + đơn vị tính */
    fx[D + 'NHANSU.THANHPHANLUONG'] = [
        dm('TPL1', 'LUONG', 'Lương', 'DMTPL'), dm('TPL2', 'LCB', 'Lương cơ bản', 'DMTPL'), dm('TPL3', 'PCCV', 'Phụ cấp chức vụ', 'DMTPL'),
        dm('TPL4', 'KT', 'Khấu trừ', 'DMTPL'), dm('TPL5', 'BHXH', 'Bảo hiểm xã hội', 'DMTPL'), dm('TPL6', 'TL', 'Thực lĩnh', 'DMTPL')
    ];
    fx[D + 'NHANSU.LUONG.DONVITINH'] = [dm('DVT1', 'VND', 'Đồng'), dm('DVT2', 'HS', 'Hệ số')];
    fx['CMS_DanhMucDuLieu/ThemMoi'] = [];
    fx['CMS_DanhMucDuLieu/Xoa'] = [];

    /* Cấu trúc thành phần — ba controller cùng hình dạng */
    function tp(id, tpId, ten, cha, chaTen, thuTu, ct, kh, thue) {
        return { ID: id, THANHPHAN_ID: tpId, THANHPHAN_TEN: ten, THANHPHAN_CHA_ID: cha, THANHPHAN_CHA_TEN: chaTen, THUTU1: thuTu,
            XAUCONGTHUCTINH: ct, KYHIEU: kh, THUNHAPTINHTHUE: thue, SOCHUSOLAMTRON: -1, CHILAYPHANSONGUYEN: 0, DONVITINH_ID: 'DVT1', LATHANHPHANCUOI: 0 };
    }
    var CAY = [
        tp('CT1', 'TPL1', 'Lương', null, '', 1, '', 'L', 1),
        tp('CT2', 'TPL2', 'Lương cơ bản', 'TPL1', 'Lương', 2, '#HSL#*#LCS#', 'LCB', 1),
        tp('CT3', 'TPL3', 'Phụ cấp chức vụ', 'TPL1', 'Lương', 3, '#HSPC#*#LCS#', 'PCCV', 1),
        tp('CT4', 'TPL4', 'Khấu trừ', null, '', 4, '', 'KT', 0),
        tp('CT5', 'TPL5', 'Bảo hiểm xã hội', 'TPL4', 'Khấu trừ', 5, '(#LCB#+#PCCV#)*0.105', 'BHXH', 0),
        tp('CT6', 'TPL6', 'Thực lĩnh', null, '', 6, '#L#-#KT#', 'TL', 1)
    ];
    function kho(ctl, rows) {
        ums.demo.crudStore(ctl, rows.map(function (r) { var x = {}; Object.keys(r).forEach(function (k) { x[k] = r[k]; }); return x; }), {
            map: function (o) {
                var ten = (fx[D + 'NHANSU.THANHPHANLUONG'].filter(function (x) { return x.ID === o.strThanhPhan_Id; })[0] || {}).TEN;
                return { THANHPHAN_ID: o.strThanhPhan_Id, THANHPHAN_TEN: ten || o.strThanhPhan_Id, THANHPHAN_CHA_ID: o.strThanhPhan_Cha_Id || null,
                    THUTU1: o.iThuTu, XAUCONGTHUCTINH: o.strXauCongThucTinh, KYHIEU: o.strKyHieu, THUNHAPTINHTHUE: o.dThuNhapTinhThue };
            }
        });
    }
    kho('L_CauTrucBangLuong', CAY);
    kho('L_LuongNam_CauTruc', CAY);
    kho('L_XetLuong_CauTruc', CAY.slice(0, 3));
    var TK = [{ TUKHOA: '#HSL#', MOTA: 'Hệ số lương' }, { TUKHOA: '#LCS#', MOTA: 'Lương cơ sở' }, { TUKHOA: '#HSPC#', MOTA: 'Hệ số phụ cấp chức vụ' }];
    fx['L_CauTrucBangLuong_TuKhoa/LayDanhSach'] = TK;
    fx['L_LuongNam_TuKhoa/LayDanhSach'] = TK;
    fx['L_XetLuong_TuKhoa/LayDanhSach'] = [{ TUKHOA: '#THAMNIEN#', MOTA: 'Số năm giữ bậc' }, { TUKHOA: '#DANHGIA#', MOTA: 'Kết quả đánh giá năm' }];
    fx['L_LuongNam_TuKhoa_ThamSo/Xoa'] = [];

    /* Kế hoạch xét nâng lương (dùng ở kehoachxetnangluong, dieukienxetnangluong) */
    fx[D + 'LUONG.LOAIXETNANGLUONG'] = [dm('LX1', 'TX', 'Nâng lương thường xuyên'), dm('LX2', 'TTH', 'Nâng lương trước thời hạn')];

    /* Bảng lương đã tính — dữ liệu trả { rsNhanSu, rsDuLieuLuong } */
    function bang(o) {
        var ns = [
            { ID: 'R1', NHANSU_HOSOCANBO_ID: 'NS1', NHANSU_HOSOCANBO_MASO: 'CB001', NHANSU_HOSOCANBO_HO: 'Nguyễn Văn', NHANSU_HOSOCANBO_TEN: 'Hùng', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin' },
            { ID: 'R2', NHANSU_HOSOCANBO_ID: 'NS2', NHANSU_HOSOCANBO_MASO: 'CB015', NHANSU_HOSOCANBO_HO: 'Trần Thị', NHANSU_HOSOCANBO_TEN: 'Mai', DAOTAO_COCAUTOCHUC_TEN: 'Khoa Kinh tế' }
        ].filter(function (r) { return !o.strNhanSu_HoSoCanBo_Id || r.NHANSU_HOSOCANBO_ID === o.strNhanSu_HoSoCanBo_Id; });
        var gt = { NS1: [10530000, 1404000, 1253070, 10680930], NS2: [8190000, 0, 859950, 7330050] };
        var ds = [];
        ns.forEach(function (r) {
            ['TPL2', 'TPL3', 'TPL5', 'TPL6'].forEach(function (t, i) {
                ds.push({ NHANSU_HOSOCANBO_ID: r.NHANSU_HOSOCANBO_ID, THANHPHAN_ID: t, THANHPHAN_GIATRI: String(gt[r.NHANSU_HOSOCANBO_ID][i] * (o.strNam ? 12 : 1)) });
            });
        });
        return { rows: { rsNhanSu: ns, rsDuLieuLuong: ds } };
    }
    fx['L_DuLieuBangLuong/LayDanhSach'] = bang;
    fx['L_LuongNam_BangLuong/LayDanhSach'] = bang;
    fx['L_BangLuong/ThucHienTinhLuong'] = [];
    fx['L_LuongNam_TinhLuong/ThucHienTinhLuong'] = [];

    ums.demo.add(fx);
})();
