/* Dữ liệu mẫu cho thongke/nhapdiemkhoahoc (Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var T = 'TP_ToChucThi/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    fx[T + 'LayDSThoiGianDangKyHoc'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2026_2027_2' }];
    fx[T + 'LayDSKhoaQLTheoKeHoach'] = function (o) { return o.strDangKy_KeHoachDangKy_Id || o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'KQL1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế' }] : []; };
    fx[T + 'LayDSHocPhanTheoKeHoach'] = function (o) { return o.strDangKy_KeHoachDangKy_Id || o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }, { ID: 'HP2', MA: 'EC2010', TEN: 'Kinh tế vi mô' }] : []; };
    fx['TP_Chung/LayDotThi'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'DT1', TEN: 'Đợt thi chính HK1' }] : []; };
    fx[D + 'DIEM.TRANGTHAILOC'] = [{ ID: 'L0', MA: '0', TEN: 'Tất cả' }, { ID: 'L1', MA: '1', TEN: 'Không hoàn thành nhập điểm' }];
    fx[T + 'LayDSLoaiDiemTheoKeHoach'] = [{ ID: 'CC', TEN: 'Chuyên cần' }, { ID: 'GK', TEN: 'Giữa kỳ' }];
    fx[T + 'LayDSLoaiDiemTheoKhoaHoc'] = [{ ID: 'CC', TEN: 'Chuyên cần' }, { ID: 'GK', TEN: 'Giữa kỳ' }, { ID: 'CK', TEN: 'Cuối kỳ' }];
    fx['pkg_thi_tochucthi.LayDSLopHocPhanTatCa'] = [
        { ID: 'L1', MALOP: 'IT3100.01', TENLOP: 'Lập trình hướng đối tượng', DAOTAO_HOCPHAN_SOTIN: 3, SOSV: 60, DSGIANGVIEN: 'Nguyễn Văn Hùng',
          DONVIPHUTRACHHOCPHAN_TEN: 'Khoa CNTT', CONGTHUC: 'CC*0.1+GK*0.3+CK*0.6', HANNOPDIEM: '15/01/2027', DOTTHI_TEN: 'Đợt thi chính HK1', TYLEHOANTHANHTKHP: '80%' },
        { ID: 'L2', MALOP: 'EC2010.02', TENLOP: 'Kinh tế vi mô', DAOTAO_HOCPHAN_SOTIN: 2, SOSV: 45, DSGIANGVIEN: 'Trần Thị Mai',
          DONVIPHUTRACHHOCPHAN_TEN: 'Khoa Kinh tế', CONGTHUC: 'CC*0.2+CK*0.8', HANNOPDIEM: '20/01/2027', DOTTHI_TEN: 'Đợt thi chính HK1', TYLEHOANTHANHTKHP: '45%' }];
    fx['pkg_thi_tochucthi.LayDSHocPhanTheoKeHoach2'] = [
        { ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', HOCTRINH: 3, SOSV: 180, DONVIPHUTRACHHOCPHAN_TEN: 'Khoa CNTT', CONGTHUC: 'CC*0.1+GK*0.3+CK*0.6', TYLEHOANTHANHTKHP: '65%' },
        { ID: 'HP2', MA: 'EC2010', TEN: 'Kinh tế vi mô', HOCTRINH: 2, SOSV: 90, DONVIPHUTRACHHOCPHAN_TEN: 'Khoa Kinh tế', CONGTHUC: 'CC*0.2+CK*0.8', TYLEHOANTHANHTKHP: '40%' }];
    function tienDo(o) { return [{ SOSV: o.strDiem_ThanhPhanDiem_Id === 'GK' ? 'x' : 42, TYLE: o.strDiem_ThanhPhanDiem_Id === 'GK' ? 'x' : '70.0' }]; }
    fx[T + 'LayTTTienDoNhapDiemTheoLopHP'] = tienDo;
    fx[T + 'LayTTTienDoNhapDiemTheoHP'] = tienDo;
    ums.demo.add(fx);
})();
