/* Dữ liệu mẫu chung của các màn khai báo Quản lý điểm (ums.qldKB) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};

    fx[DM + 'DIEM.THANGDIEM'] = [dm('TD10', 'THANG10', 'Thang điểm 10'), dm('TD4', 'THANG4', 'Thang điểm 4'), dm('TDC', 'CHU', 'Thang điểm chữ')];
    fx[DM + 'DIEM.QUYTACLAMTRON'] = [dm('LT1', 'LEN', 'Làm tròn lên'), dm('LT2', 'XUONG', 'Làm tròn xuống'), dm('LT3', 'GANNHAT', 'Làm tròn gần nhất (0,5)')];
    fx[DM + 'DIEM.LOAIDIEMTRUNGBINH'] = [dm('TB1', 'TBHK', 'Điểm trung bình học kỳ'), dm('TB2', 'TBTL', 'Điểm trung bình tích lũy'), dm('TB3', 'TBNH', 'Điểm trung bình năm học')];
    fx[DM + 'DIEM.QUYCHEDIEM'] = [dm('QC1', 'QC2021', 'Quy chế đào tạo 2021'), dm('QC2', 'QC2014', 'Quy chế đào tạo 2014')];
    fx[DM + 'DIEM.QUYTACLAYDIEMCAONHAT'] = [dm('CN1', 'CAONHAT', 'Lấy điểm cao nhất các lần học'), dm('CN2', 'CUOICUNG', 'Lấy điểm lần học cuối cùng')];
    fx[DM + 'DIEM.QUYTACLAYDULIEU'] = [dm('DL1', 'CTDT', 'Theo chương trình đào tạo'), dm('DL2', 'TATCA', 'Tất cả học phần đã học')];
    fx[DM + 'DIEM.QUYTACXACDINHDIEM'] = [dm('XD1', 'HE10', 'Xác định theo điểm hệ 10'), dm('XD2', 'HE4', 'Xác định theo điểm hệ 4')];
    fx[DM + 'DIEM.QUYTACDIEUKIENVEDIEM'] = [dm('DK1', 'DAT', 'Chỉ tính học phần đạt'), dm('DK2', 'TATCA', 'Tính cả học phần chưa đạt')];
    fx[DM + 'DIEM.QUYTACLAYDIEMLAN1'] = [dm('L11', 'THI1', 'Lấy điểm thi lần 1'), dm('L12', 'HOC1', 'Lấy điểm học lần 1')];
    fx[DM + 'DIEM.LOAIDIEMDACBIET'] = [dm('DB1', 'MIENTHI', 'Miễn thi'), dm('DB2', 'VANGTHI', 'Vắng thi'), dm('DB3', 'CAMTHI', 'Cấm thi')];
    fx[DM + 'DIEM.DANHGIA'] = [dm('DG1', 'DAT', 'Đạt'), dm('DG2', 'KHONGDAT', 'Không đạt'), dm('DG3', 'CHUADANHGIA', 'Chưa đánh giá')];
    fx[DM + 'DIEM.DIEMCHU'] = [dm('A', 'A', 'A'), dm('B', 'B', 'B'), dm('C', 'C', 'C'), dm('D', 'D', 'D'), dm('F', 'F', 'F')];
    fx[DM + 'DIEM.MOHINHCONGTHUC'] = [dm('MH1', 'TRONGSO', 'Trung bình có trọng số'), dm('MH2', 'CAONHAT', 'Lấy thành phần cao nhất')];

    fx['KHCT_ThoiGianDaoTao/LayDanhSach'] = [
        { ID: 'TG261', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' },
        { ID: 'TG252', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' },
        { ID: 'TG251', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }
    ];
    /* Thành phần điểm: nguồn ô chọn của congthucdiem + danh sách của khaibaothanhphandiem */
    var TP = ums.demo.qldTP = [
            { ID: 'TP1', MA: 'CC', TEN: 'Điểm chuyên cần', KYHIEU: 'CC', THANGDIEM_ID: 'TD10', THANGDIEM_TEN: 'Thang điểm 10', SOLESAUDAUPHAY: 1,
                GIATRIMACDINHKHICHUACODIEM: 0, QUYTACLAMTRON_ID: 'LT3', QUYTACLAMTRON_TEN: 'Làm tròn gần nhất (0,5)', CHOPHEPLAPDANHSACHTHI: 0,
                LADIEMTONGKET: 0, LATHANHPHANDIEMCUOI: 0, COCHOPHEPTHILAI: 0, COLAMTRON: 1 },
            { ID: 'TP2', MA: 'GK', TEN: 'Điểm giữa kỳ', KYHIEU: 'GK', THANGDIEM_ID: 'TD10', THANGDIEM_TEN: 'Thang điểm 10', SOLESAUDAUPHAY: 1,
                GIATRIMACDINHKHICHUACODIEM: 0, QUYTACLAMTRON_ID: 'LT3', QUYTACLAMTRON_TEN: 'Làm tròn gần nhất (0,5)', CHOPHEPLAPDANHSACHTHI: 0,
                LADIEMTONGKET: 0, LATHANHPHANDIEMCUOI: 0, COCHOPHEPTHILAI: 0, COLAMTRON: 1 },
            { ID: 'TP3', MA: 'CK', TEN: 'Điểm thi cuối kỳ', KYHIEU: 'CK', THANGDIEM_ID: 'TD10', THANGDIEM_TEN: 'Thang điểm 10', SOLESAUDAUPHAY: 1,
                GIATRIMACDINHKHICHUACODIEM: 0, QUYTACLAMTRON_ID: 'LT3', QUYTACLAMTRON_TEN: 'Làm tròn gần nhất (0,5)', CHOPHEPLAPDANHSACHTHI: 1,
                LADIEMTONGKET: 0, LATHANHPHANDIEMCUOI: 1, COCHOPHEPTHILAI: 1, COLAMTRON: 1 },
            { ID: 'TP4', MA: 'TK', TEN: 'Điểm tổng kết học phần', KYHIEU: 'TKHP', THANGDIEM_ID: 'TD10', THANGDIEM_TEN: 'Thang điểm 10', SOLESAUDAUPHAY: 1,
                GIATRIMACDINHKHICHUACODIEM: '', QUYTACLAMTRON_ID: 'LT3', QUYTACLAMTRON_TEN: 'Làm tròn gần nhất (0,5)', CHOPHEPLAPDANHSACHTHI: 0,
                LADIEMTONGKET: 1, LATHANHPHANDIEMCUOI: 0, COCHOPHEPTHILAI: 0, COLAMTRON: 1 },
            { ID: 'TP5', MA: 'TK4', TEN: 'Điểm tổng kết thang 4', KYHIEU: 'TK4', THANGDIEM_ID: 'TD4', THANGDIEM_TEN: 'Thang điểm 4', SOLESAUDAUPHAY: 2,
                GIATRIMACDINHKHICHUACODIEM: '', QUYTACLAMTRON_ID: 'LT1', QUYTACLAMTRON_TEN: 'Làm tròn lên', CHOPHEPLAPDANHSACHTHI: 0,
                LADIEMTONGKET: 1, LATHANHPHANDIEMCUOI: 0, COCHOPHEPTHILAI: 0, COLAMTRON: 0 }
    ];
    fx['D_ThanhPhanDiem/LayDanhSach'] = function (o) {
        return TP.filter(function (r) {
            return (!o.strThangDiem_Id || r.THANGDIEM_ID === o.strThangDiem_Id) &&
                (!o.strQuyTacLamTron_Id || r.QUYTACLAMTRON_ID === o.strQuyTacLamTron_Id) &&
                (!o.strTuKhoa || (r.MA + ' ' + r.TEN).toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0);
        });
    };

    /* Tiện ích cho tệp mẫu từng màn: danh sách lọc theo tham số + chi tiết theo strId */
    ums.demo.qldKB = function (ctl, ds, loc) {
        var o = {};
        o[ctl + '/LayDanhSach'] = function (p) {
            return ds.filter(function (r) {
                var ok = true;
                Object.keys(loc || {}).forEach(function (k) { if (p[k] && r[loc[k]] !== p[k]) ok = false; });
                if (ok && p.strTuKhoa) ok = JSON.stringify(r).toLowerCase().indexOf(String(p.strTuKhoa).toLowerCase()) >= 0;
                return ok;
            });
        };
        o[ctl + '/LayChiTiet'] = function (p) { return ds.filter(function (r) { return r.ID === p.strId; }); };
        ums.demo.add(o);
    };

    ums.demo.add(fx);
})();
