/* Dữ liệu mẫu cho thongke/nhapdiemhocphan và nhapdiemlophocphan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var T = 'TP_ToChucThi/', fx = {};
    fx[T + 'LayDSDangKy_KeHoachDangKy'] = [{ ID: 'KH1', TENKEHOACH: 'Đăng ký học HK1 2026–2027' }];
    fx[T + 'LayDSKhoaQLTheoKeHoach'] = function (o) { return o.strDangKy_KeHoachDangKy_Id ? [{ ID: 'KQL1', DAOTAO_KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin' }] : []; };
    fx[T + 'LayDSHocPhanTheoKeHoach'] = function (o) { return o.strDangKy_KeHoachDangKy_Id ? [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng' }] : []; };
    fx['TP_Chung/LayDotThi'] = [{ ID: 'DT1', TEN: 'Đợt thi chính HK1' }];
    fx[T + 'LayDSLoaiDiemTheoKeHoach'] = [{ ID: 'CC', TEN: 'Chuyên cần' }, { ID: 'GK', TEN: 'Giữa kỳ' }];
    fx[T + 'LayDSLopHocPhanTatCa'] = [{ ID: 'L1', MALOP: 'IT3100.01', TENLOP: 'Lập trình hướng đối tượng', DAOTAO_HOCPHAN_SOTIN: 3, SOSV: 60, DSGIANGVIEN: 'Nguyễn Văn Hùng',
        DONVIPHUTRACHHOCPHAN_TEN: 'Khoa CNTT', CONGTHUC: 'CC*0.1+GK*0.3+CK*0.6', HANNOPDIEM: '15/01/2027', DOTTHI_TEN: 'Đợt thi chính HK1', TYLEHOANTHANHTKHP: '80%' }];
    fx[T + 'LayDSHocPhanTheoKeHoach2'] = [{ ID: 'HP1', MA: 'IT3100', TEN: 'Lập trình hướng đối tượng', HOCTRINH: 3, SOSV: 180, DONVIPHUTRACHHOCPHAN_TEN: 'Khoa CNTT', CONGTHUC: 'CC*0.1+GK*0.3+CK*0.6', TYLEHOANTHANHTKHP: '65%' }];
    function tienDo(o) { return [{ SOSV: o.strDiem_ThanhPhanDiem_Id === 'CC' ? 58 : 'x', TYLE: o.strDiem_ThanhPhanDiem_Id === 'CC' ? '96.7' : 'x' }]; }
    fx[T + 'LayTTTienDoNhapDiemTheoLopHP'] = tienDo;
    fx[T + 'LayTTTienDoNhapDiemTheoHP'] = tienDo;
    ums.demo.add(fx);
})();
