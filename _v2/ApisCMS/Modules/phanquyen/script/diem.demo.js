/* Dữ liệu mẫu cho diem (Phân quyền điểm) — chỉ dùng ở chế độ dựng thử. Cây: học phần → lớp học phần (lá = danh sách điểm). */
(function () {
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: 'Loại danh sách' }; }
    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao': [
            { ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm học 2025-2026' },
            { ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm học 2025-2026' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.LOAIDANHSACH': [dm('LDS1', 'LHP', 'Lớp học phần'), dm('LDS2', 'LT', 'Lớp thi')],
        'D_ThongTin/LayDSDiem_ThanhPhanDiem': [
            { ID: 'TP1', MA: 'CC', DIEM_THAMSOHOCTAPCHUNG_TEN: 'Điểm chuyên cần' },
            { ID: 'TP2', MA: 'GK', DIEM_THAMSOHOCTAPCHUNG_TEN: 'Điểm giữa kỳ' },
            { ID: 'TP3', MA: 'CK', DIEM_THAMSOHOCTAPCHUNG_TEN: 'Điểm cuối kỳ' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSHocPhanCauTrucDiemTheoLQL': [
            { ID: 'HP1', MA: 'IT3011', TEN: 'Cấu trúc dữ liệu và giải thuật' },
            { ID: 'HP2', MA: 'IT3090', TEN: 'Cơ sở dữ liệu' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSCauTrucDiemTheoLQL': [
            { THANHPHAN_ID: 'HP1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'IT3011 - Cấu trúc dữ liệu và giải thuật' },
            { THANHPHAN_ID: 'DS11', THANHPHAN_CHA_ID: 'HP1', THANHPHAN_TEN: 'IT3011.01 - K67-KTPM1' },
            { THANHPHAN_ID: 'DS12', THANHPHAN_CHA_ID: 'HP1', THANHPHAN_TEN: 'IT3011.02 - K67-HTTT1' },
            { THANHPHAN_ID: 'HP2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'IT3090 - Cơ sở dữ liệu' },
            { THANHPHAN_ID: 'DS21', THANHPHAN_CHA_ID: 'HP2', THANHPHAN_TEN: 'IT3090.01 - K67-KTPM1' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSQuyenDiemTheoLQL': function (o) {
            return ums.demo.pqKho.dong(ums.demo.pqNguoiDung.map(function (x) { return x.ID; }), function (nd) {
                return ums.demo.pqKho.co(nd, o.strDiem_DanhSach_Id + (o.strDiem_ThanhPhanDiem_Id || ''), o.strHanhDong_Id);
            });
        },
        'CMS_PhanQuyenDuLieu/TaoTuDongDSLopHocPhanLanDau': [],
        'D_Cache/TaoCache_NhapDiemTheoDanhSach': [],
        'D_Cache/LayDanhSach': [{ NGUOIDUNG_ID: 'ND01' }, { NGUOIDUNG_ID: 'ND02' }]
    });
    ums.demo.pqKho.them('ND01', 'DS11TP1', 'HD01');
    ums.demo.pqKho.them('ND02', 'DS12TP1', 'HD01');
})();
