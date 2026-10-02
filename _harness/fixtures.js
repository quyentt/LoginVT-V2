/*
 * Dữ liệu giả lập cho harness.
 *
 * Khoá tra cứu, theo thứ tự ưu tiên:
 *   1. op.data.func       -> tên procedure Oracle, vd 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_LayDS'
 *   2. op.action          -> vd 'TC_KhoanThu/LayDanhSach'
 *   3. action + '#' + mã  -> dùng cho danh mục dùng chung (phân biệt theo strMaBangDanhMuc)
 *
 * Tên cột lấy từ chính code module (genTable_*, fillForm_*) nên khớp với
 * cấu trúc mà procedure thật trả về.
 *
 * Giá trị dạng '@first:<khoá khác>' nghĩa là: lấy phần tử đầu của fixture đó.
 */
window.HARNESS_FIXTURES = {

    /* ---------- Danh mục dùng chung (CMS_DanhMucThuocTinh) ---------- */
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.LOAI': [
        { ID: 'LKH0000000000000000000000000001', MA: 'BH', TEN: 'Bảo hiểm y tế' },
        { ID: 'LKH0000000000000000000000000002', MA: 'DP', TEN: 'Đồng phục' },
        { ID: 'LKH0000000000000000000000000003', MA: 'GT', TEN: 'Giáo trình' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.TINHTRANG': [
        { ID: 'TT00000000000000000000000000001', MA: 'NHAP', TEN: 'Đang soạn' },
        { ID: 'TT00000000000000000000000000002', MA: 'MO', TEN: 'Đang mở đăng ký' },
        { ID: 'TT00000000000000000000000000003', MA: 'DONG', TEN: 'Đã đóng' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.PHANLOAIHANGHOA': [
        { ID: 'PL00000000000000000000000000001', MA: 'HH', TEN: 'Hàng hoá' },
        { ID: 'PL00000000000000000000000000002', MA: 'DV', TEN: 'Dịch vụ' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.DONVITINH': [
        { ID: 'DVT0000000000000000000000000001', MA: 'CAI', TEN: 'Cái' },
        { ID: 'DVT0000000000000000000000000002', MA: 'BO', TEN: 'Bộ' },
        { ID: 'DVT0000000000000000000000000003', MA: 'QUYEN', TEN: 'Quyển' }
    ],

    /* ---------- Thời gian đào tạo ---------- */
    'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
        { ID: 'TGD0000000000000000000000000001', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 - 2025/2026' },
        { ID: 'TGD0000000000000000000000000002', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 - 2025/2026' }
    ],

    /* ---------- Khoản thu (tài chính) ---------- */
    'TC_KhoanThu/LayDanhSach': [
        { ID: 'KT00000000000000000000000000001', MA: 'BHYT', TEN: 'Bảo hiểm y tế' },
        { ID: 'KT00000000000000000000000000002', MA: 'DPHUC', TEN: 'Đồng phục sinh viên' },
        { ID: 'KT00000000000000000000000000003', MA: 'GTRINH', TEN: 'Giáo trình học kỳ' }
    ],

    /* ---------- Kế hoạch mua ---------- */
    'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_LayDS': [
        {
            ID: 'KHM0000000000000000000000000001',
            MA: 'KH-BHYT-2526',
            TEN: 'Kế hoạch mua BHYT năm học 2025-2026',
            MOTA: 'Áp dụng cho toàn bộ sinh viên chính quy',
            TUNGAY: '01/09/2026',
            DENNGAY: '30/09/2026',
            LOAIKEHOACH_ID: 'LKH0000000000000000000000000001',
            LOAIKEHOACH_TEN: 'Bảo hiểm y tế',
            TINHTRANG_ID: 'TT00000000000000000000000000002',
            TINHTRANG_TEN: 'Đang mở đăng ký',
            DAOTAO_THOIGIANDAOTAO_ID: 'TGD0000000000000000000000000001',
            CHOPHEPSUASOLUONG: '0',
            CHOPHEPHUYTRUOCTHANHTOAN: '1',
            YEUCAUTHANHTOANNGAY: '0',
            NGUOITAO_TAIKHOAN: 'dev.harness'
        },
        {
            ID: 'KHM0000000000000000000000000002',
            MA: 'KH-DPHUC-K19',
            TEN: 'Kế hoạch mua đồng phục khoá 19',
            MOTA: 'Sinh viên khoá 19 các ngành',
            TUNGAY: '15/08/2026',
            DENNGAY: '15/09/2026',
            LOAIKEHOACH_ID: 'LKH0000000000000000000000000002',
            LOAIKEHOACH_TEN: 'Đồng phục',
            TINHTRANG_ID: 'TT00000000000000000000000000003',
            TINHTRANG_TEN: 'Đã đóng',
            DAOTAO_THOIGIANDAOTAO_ID: 'TGD0000000000000000000000000001',
            CHOPHEPSUASOLUONG: '1',
            CHOPHEPHUYTRUOCTHANHTOAN: '1',
            YEUCAUTHANHTOANNGAY: '1',
            NGUOITAO_TAIKHOAN: 'dev.harness'
        },
        {
            ID: 'KHM0000000000000000000000000003',
            MA: 'KH-GT-HK2',
            TEN: 'Kế hoạch mua giáo trình học kỳ 2',
            MOTA: '',
            TUNGAY: '02/01/2027',
            DENNGAY: '31/01/2027',
            LOAIKEHOACH_ID: 'LKH0000000000000000000000000003',
            LOAIKEHOACH_TEN: 'Giáo trình',
            TINHTRANG_ID: 'TT00000000000000000000000000001',
            TINHTRANG_TEN: 'Đang soạn',
            DAOTAO_THOIGIANDAOTAO_ID: 'TGD0000000000000000000000000002',
            CHOPHEPSUASOLUONG: '1',
            CHOPHEPHUYTRUOCTHANHTOAN: '0',
            YEUCAUTHANHTOANNGAY: '0',
            NGUOITAO_TAIKHOAN: 'dev.harness'
        }
    ],
    'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Get_By_Id': '@first:PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_LayDS',

    /* ---------- Loại khoản & đơn giá ---------- */
    'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_LayDS': [
        {
            ID: 'DG00000000000000000000000000001',
            KHOANTHU_ID: 'KT00000000000000000000000000001',
            KHOANTHU_TEN: 'Bảo hiểm y tế',
            LOAIKHOAN_TEN: 'Bảo hiểm y tế',
            DONGIA: '680000',
            PHANLOAI_TEN: 'Dịch vụ',
            DONVITINH_TEN: 'Cái',
            CHOPHEPKHONGMUA: '0',
            BATBUOC: '1',
            CHOPHEPNHAPSOLUONG: '0',
            SOTOITHIEU: '1',
            SOTOIDA: '1'
        },
        {
            ID: 'DG00000000000000000000000000002',
            KHOANTHU_ID: 'KT00000000000000000000000000002',
            KHOANTHU_TEN: 'Đồng phục sinh viên',
            LOAIKHOAN_TEN: 'Áo sơ mi đồng phục',
            DONGIA: '250000',
            PHANLOAI_TEN: 'Hàng hoá',
            DONVITINH_TEN: 'Cái',
            CHOPHEPKHONGMUA: '1',
            BATBUOC: '0',
            CHOPHEPNHAPSOLUONG: '1',
            SOTOITHIEU: '1',
            SOTOIDA: '5'
        }
    ],
    'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Get_By_Id': '@first:PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_LayDS',

    /* ---------- Phạm vi đối tượng ---------- */
    'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_PV_LayDS': [
        { ID: 'PV00000000000000000000000000001', LOAI_CODE: 'KHOAQUANLY', LOAI_TEN: 'Khoa quản lý', APDUNG_MA: 'CNTT', APDUNG_TEN: 'Khoa Công nghệ thông tin' },
        { ID: 'PV00000000000000000000000000002', LOAI_CODE: 'HEDAOTAO', LOAI_TEN: 'Hệ đào tạo', APDUNG_MA: 'CQ', APDUNG_TEN: 'Chính quy' },
        { ID: 'PV00000000000000000000000000003', LOAI_CODE: 'LOPQUANLY', LOAI_TEN: 'Lớp quản lý', APDUNG_MA: 'BIT2202', APDUNG_TEN: 'Lớp BIT2202' }
    ],

    /* ---------- Kết quả đăng ký mua ---------- */
    'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_KQ_LayDS': [
        { ID: 'KQ00000000000000000000000000001', HOCVIEN_MA: 'BIT220263', HOCVIEN_HODEM: 'Nguyễn Văn', HOCVIEN_TEN: 'An', LOPQUANLY_TEN: 'BIT2202', LOAIKHOAN_TEN: 'Bảo hiểm y tế', SOLUONG: '1', THANHTIEN: '680000', TINHTRANG_TEN: 'Đã đăng ký', NGAYDANGKY: '05/09/2026' },
        { ID: 'KQ00000000000000000000000000002', HOCVIEN_MA: 'BBA220561', HOCVIEN_HODEM: 'Trần Thị', HOCVIEN_TEN: 'Bình', LOPQUANLY_TEN: 'BBA2205', LOAIKHOAN_TEN: 'Áo sơ mi đồng phục', SOLUONG: '2', THANHTIEN: '500000', TINHTRANG_TEN: 'Đã đăng ký', NGAYDANGKY: '06/09/2026' },
        { ID: 'KQ00000000000000000000000000003', HOCVIEN_MA: 'BKL220180', HOCVIEN_HODEM: 'Lê Hoàng', HOCVIEN_TEN: 'Cường', LOPQUANLY_TEN: 'BKL2201', LOAIKHOAN_TEN: 'Bảo hiểm y tế', SOLUONG: '0', THANHTIEN: '0', TINHTRANG_TEN: 'Không mua', NGAYDANGKY: '06/09/2026' }
    ]
};
