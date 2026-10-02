/* Dữ liệu mẫu cho thongke/nhapdiemlichthi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {}, T = 'TP_Chung/', D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    fx[T + 'LayThoiGian'] = [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }];
    fx[T + 'LayLoaiDiem'] = function (o) { return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi kết thúc' }] : []; };
    fx[T + 'LayHinhThucThi'] = function (o) { return o.strDiem_ThanhPhanDiem_Id ? [{ ID: 'HT1', TEN: 'Thi viết' }] : []; };
    fx[T + 'LayDotThi'] = function (o) { return o.strHinhThucThi_Id ? [{ ID: 'DT1', TEN: 'Đợt 1' }] : []; };
    fx[T + 'LayHocPhan'] = function (o) { return o.strDotThi_Id ? [{ ID: 'HP1', TEN: 'Lập trình HĐT' }] : []; };
    fx[D + 'DIEM.TRANGTHAILOC'] = [{ ID: 'L0', MA: '0', TEN: 'Tất cả' }, { ID: 'L1', MA: '1', TEN: 'Không hoàn thành nhập điểm' }];
    fx[T + 'LayDSLoaiDiemMonThiTheoDotThi'] = [{ ID: 'TP1', TEN: 'Giữa kỳ' }, { ID: 'TP2', TEN: 'Cuối kỳ' }];
    fx[T + 'LayDSThiTheoDotThi'] = [{ ID: 'DS1', NGAYTHI: '20/12/2026', THI_CATHI_TEN: 'Ca 1', GIOBATDAU: 7, PHUTBATDAU: 30, GIOKETTHUC: 9, PHUTKETTHUC: 0, DAOTAO_HOCPHAN_MA: 'IT3100',
        DAOTAO_HOCPHAN_TEN: 'Lập trình HĐT', DAOTAO_HOCPHAN_SOTIN: 3, HINHTHUCTHI_TEN: 'Thi viết', SOSV: 120, DOTTHI_TEN: 'Đợt 1', DSCONGTHUCDIEM: '30% GK + 70% CK',
        DONVIPHUTRACHHOCPHAN_TEN: 'Khoa CNTT', TYLEHOANTHANHTKHP: '75%', IDCATHI: 'C1', IDDOTTHI: 'DT1', IDMONTHI: 'HP1', CONGTHUC: 'CT1' }];
    fx[T + 'LayTTTienDoNhapDiemTheoDST'] = function (o) { return [{ SOSV: 'x', TYLE: 'x' }, { SOSV: o.strDiem_ThanhPhanDiem_Id === 'TP1' ? 120 : 90, TYLE: o.strDiem_ThanhPhanDiem_Id === 'TP1' ? '100%' : '75%' }]; };
    fx[T + 'LayDSLopHocPhanTheoDST'] = [{ DAOTAO_LOPHOCPHAN_MA: 'IT3100.01', DAOTAO_LOPHOCPHAN_TEN: 'Lập trình HĐT 01', TINHTRANGXACNHANNHAPDIEM: 'Đã xác nhận' }];
    ums.demo.add(fx);
})();
