/* Dữ liệu mẫu cho danhsach (Danh sách trúng tuyển) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var KH = [
        { ID: 'KHNH_A', MA: 'NH2026', TENKEHOACH: 'Kế hoạch nhập học đại học chính quy 2026' },
        { ID: 'KHNH_B', MA: 'NHLT2026', TENKEHOACH: 'Kế hoạch nhập học liên thông 2026' }
    ];
    function sv(id, kh, hd, ten, gt, ng, th, nam, sbd, tohop, m1, m2, m3, d1, d2, d3, nganh, dt, mg) {
        var tong = Math.round((d1 + d2 + d3) * 100) / 100;
        return {
            ID: id, TAICHINH_KEHOACHNHAPHOC_ID: kh, HODEM: hd, TEN: ten, QLSV_GIOITINH_TEN: gt,
            NGAYSINH_NGAY: ng, NGAYSINH_THANG: th, NGAYSINH_NAM: nam, SOBAODANH: sbd, MASO: '',
            TOHOPTHI_TEN: tohop, TENTS_MON1: m1, TENTS_MON2: m2, TENTS_MON3: m3,
            DIEMTS_MON1: d1, DIEMTS_MON2: d2, DIEMTS_MON3: d3, DIEMTS_TONGDIEM: tong, DIEMTS_DIEMTHUONG: 0.25,
            DIEMTS_TONGDIEMXETTUYEN: tong + 0.25, NGANHHOC_TEN: nganh, DOITUONGDUTHI_TEN: dt, KHUVUC_TEN: 'KV2',
            PHANTRAMMIENGIAM: mg, CMTND_SO: '0012040' + id.slice(-5), SODIENTHOAICANHAN: '09' + id.slice(-8),
            HOKHAU_PHUONGXAKHOIXOM: 'Xã Tân Lập', HOKHAU_QUANHUYEN_TEN: 'Huyện Đan Phượng', HOKHAU_TINHTHANH_TEN: 'Hà Nội',
            DANTOC_TEN: 'Kinh', TONGIAO_TEN: 'Không', THANHPHANXUATTHAN_TEN: 'Nông dân', NAMTOTNGHIEP: '2026',
            KQCC_10_XEPLOAI: 'Giỏi', KQCC_11_XEPLOAI: 'Giỏi', KQCC_12_XEPLOAI: 'Khá',
            KQCC_10_HOCLUC: 'Giỏi', KQCC_11_HOCLUC: 'Khá', KQCC_12_HOCLUC: 'Giỏi',
            KQCC_10_HANHKIEM: 'Tốt', KQCC_11_HANHKIEM: 'Tốt', KQCC_12_HANHKIEM: 'Tốt', GHICHU: ''
        };
    }
    var DS = [
        sv('TT00000001', 'KHNH_A', 'Nguyễn Văn', 'An', 'Nam', '12', '03', '2008', '01012345', 'A00', 'Toán', 'Vật lí', 'Hóa học', 8.4, 7.75, 8, 'Công nghệ thông tin', '', 0),
        sv('TT00000002', 'KHNH_A', 'Trần Thị', 'Bình', 'Nữ', '05', '07', '2008', '01012346', 'D01', 'Toán', 'Ngữ văn', 'Tiếng Anh', 7.6, 8.25, 9, 'Ngôn ngữ Anh', '', 0),
        sv('TT00000003', 'KHNH_A', 'Lê Minh', 'Châu', 'Nam', '21', '11', '2008', '26001122', 'A01', 'Toán', 'Vật lí', 'Tiếng Anh', 8, 7.5, 8.2, 'Kỹ thuật phần mềm', '01', 50),
        sv('TT00000004', 'KHNH_B', 'Phạm Thu', 'Dung', 'Nữ', '02', '01', '2008', '18004567', 'C00', 'Ngữ văn', 'Lịch sử', 'Địa lí', 8.5, 9, 8.75, 'Quản trị kinh doanh', '06', 100),
        sv('TT00000005', 'KHNH_A', 'Hoàng Đức', 'Em', 'Nam', '30', '09', '2008', '01019876', 'A00', 'Toán', 'Vật lí', 'Hóa học', 6.8, 7, 7.25, 'Kế toán', '', 0)
    ];
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc': KH,
        'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rows = DS.filter(function (r) {
                var kh = o.strTaiChinh_KeHoach_Id;
                return (!kh || kh.indexOf('KHNH_') !== 0 || r.TAICHINH_KEHOACHNHAPHOC_ID === kh) &&
                    (!q || (r.HODEM + ' ' + r.TEN + ' ' + r.SOBAODANH).toLowerCase().indexOf(q) >= 0);
            });
            var sz = Number(o.pageSize) || 10, i = (Number(o.pageIndex) || 1) - 1;
            return { rows: rows.slice(i * sz, i * sz + sz), pager: rows.length };
        },
        'NH_NguoiHoc_ThongTinTuyenSinh/ThemMoi': function (o) {
            DS.push(sv('TT' + Date.now(), o.strTAICHINH_KeHoach_Id, o.strHoDem, o.strTen, o.strGioiTinh_Id, '', '', '', o.strSoBaoDanh,
                o.strToHocThi_Id, o.strTenTS_Mon1, o.strTenTS_Mon2, o.strTenTS_Mon3, Number(o.dDiemTS_Mon1) || 0, Number(o.dDiemTS_Mon2) || 0,
                Number(o.dDiemTS_Mon3) || 0, o.strNganhHoc_Ten, o.strDoiTuongDuThi_Id, Number(o.dPhanTramMienGiam) || 0));
            return [];
        },
        'NH_NguoiHoc_ThongTinTuyenSinh/CapNhat': function (o) {
            DS.forEach(function (r) {
                if (r.ID !== o.strId) return;
                r.HODEM = o.strHoDem; r.TEN = o.strTen; r.SOBAODANH = o.strSoBaoDanh; r.MASO = o.strMaSo;
                r.PHANTRAMMIENGIAM = Number(o.dPhanTramMienGiam) || 0; r.GHICHU = o.strGhichu;
            });
            return [];
        },
        'NH_NguoiHoc_ThongTinTuyenSinh/Xoa': function (o) {
            var ids = String(o.strIds || '').split(',');
            DS = DS.filter(function (r) { return ids.indexOf(r.ID) < 0; });
            return [];
        }
    });
})();
