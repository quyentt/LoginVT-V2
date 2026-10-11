/* Dữ liệu mẫu của khung _lv_baove.js — chỉ dùng ở chế độ dựng thử.
   ums.lvBaoVeDemo({ tv, lich, suaDeTai, sanPham, coPhut, dmVaiTro }) → bảng dữ liệu mẫu (đưa vào ums.demo.add ở <tên>.demo.js). */
(function () {
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    function dm(id, ma, ten, t1, t2) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: t1 || '', THONGTIN2: t2 || '' }; }
    var NGUOI = { NS1: ['Nguyễn Văn', 'Hùng', 'Trường Đại học Công nghệ'], NS2: ['Trần Thị', 'Mai', 'Viện Khoa học máy tính'], NS3: ['Lê Quang', 'Minh', 'Trường Đại học Công nghệ'],
        LK1: ['Phạm Đức', 'Long', 'Khoa Công nghệ thông tin'] };
    var DETAI = [
        { ID: 'DC1', QLSV_NGUOIHOC_ID: 'NH1', QLSV_NGUOIHOC_MASO: 'CH30001', QLSV_NGUOIHOC_HOTEN: 'Nguyễn Minh Anh', DAOTAO_HEDAOTAO_TEN: 'Thạc sĩ',
            DAOTAO_LOPQUANLY_TEN: 'CH-CNTT-K30', DAOTAO_CHUONGTRINH_TEN: 'Khoa học máy tính', DAOTAO_KHOADAOTAO_TEN: 'K30', LVLA_KEHOACH_DECUONG_ID: 'KH1',
            TENTIENGVIET: 'Phát hiện gian lận thi trực tuyến bằng học sâu', TENTIENGANH: 'Deep learning for online exam fraud detection',
            SOQUYETDINH: '125/QĐ-ĐHCN', NGAYQUYETDINH: '15/03/2026', NGAYDANGKY: '02/03/2026', MOTA: 'Đề cương chính thức', DIEM: '8.5', VMACACHLAY: '' },
        { ID: 'DC2', QLSV_NGUOIHOC_ID: 'NH2', QLSV_NGUOIHOC_MASO: 'CH30002', QLSV_NGUOIHOC_HOTEN: 'Trần Thu Hà', DAOTAO_HEDAOTAO_TEN: 'Thạc sĩ',
            DAOTAO_LOPQUANLY_TEN: 'CH-CNTT-K30', DAOTAO_CHUONGTRINH_TEN: 'Khoa học máy tính', DAOTAO_KHOADAOTAO_TEN: 'K30', LVLA_KEHOACH_DECUONG_ID: 'KH1',
            TENTIENGVIET: 'Tối ưu lịch thi bằng giải thuật di truyền', TENTIENGANH: 'Exam timetabling with genetic algorithms',
            SOQUYETDINH: '126/QĐ-ĐHCN', NGAYQUYETDINH: '15/03/2026', NGAYDANGKY: '03/03/2026', MOTA: '', DIEM: '', VMACACHLAY: 'TUNGTHANHVIEN' }
    ];

    ums.lvBaoVeDemo = function (o) {
        var fx = {};
        fx['LVLA_KeHoach_DeCuong/LayDanhSach'] = [{ ID: 'KH1', TEN: 'Kế hoạch bảo vệ — đợt 1/2026' }, { ID: 'KH2', TEN: 'Kế hoạch bảo vệ — đợt 2/2026' }];
        fx['LVLA_DeCuong_ChinhThuc/LayDanhSach'] = function (p) {
            var k = String(p.strTuKhoa || '').toLowerCase();
            var r = DETAI.filter(function (d) { return !k || (d.TENTIENGVIET + d.QLSV_NGUOIHOC_HOTEN + d.QLSV_NGUOIHOC_MASO).toLowerCase().indexOf(k) >= 0; });
            return { rows: r, pager: r.length };
        };
        fx['LVLA_DeCuong_ChinhThuc_HuongDan/LayDanhSach'] = [
            { ID: 'HD1', NGUOIHUONGDAN_HOTEN: 'PGS.TS. Nguyễn Văn Hùng', NGUOIHUONGDAN_COQUANCONGTAC: 'Trường Đại học Công nghệ', VAITRO_TEN: 'Hướng dẫn chính' },
            { ID: 'HD2', NGUOIHUONGDAN_HOTEN: 'ThS. Trần Thị Mai', NGUOIHUONGDAN_COQUANCONGTAC: 'Viện Khoa học máy tính', VAITRO_TEN: 'Hướng dẫn phụ' }];
        fx[DM + (o.dmVaiTro || 'LVLA.VTHDONG')] = [dm('VT1', 'CT', 'Chủ tịch'), dm('VT2', 'TK', 'Thư ký'), dm('VT3', 'PB', 'Phản biện'), dm('VT4', 'UV', 'Ủy viên')];
        fx[DM + 'LVLA.DGHD'] = [dm('DG1', 'DAT', 'Đạt'), dm('DG2', 'KDAT', 'Không đạt')];
        fx[DM + 'XLHV.XNKK'] = [dm('XN1', 'DY', 'Đồng ý', 'fa fa-check', 'color: #28a745'), dm('XN2', 'KDY', 'Không đồng ý', 'fa fa-times', 'color: #dc3545'),
            dm('XN3', 'BS', 'Yêu cầu bổ sung', 'fa fa-pencil', 'color: #e0a800')];
        /* hội đồng + lịch: kho có trạng thái (thêm / sửa / xoá thấy ngay) */
        function ten(id) { var n = NGUOI[id] || ['Nhân', 'sự', '']; return n; }
        ums.demo.crudStore(o.tv, [
            { ID: 'TV1', DC_ID: 'DC1', THANHVIEN_ID: 'NS1', THANHVIEN_HODEM: 'Nguyễn Văn', THANHVIEN_TEN: 'Hùng', THANHVIEN_COQUANCONGTAC: 'Trường Đại học Công nghệ',
                DIEM: '8.5', DANHGIA_ID: 'DG1', NHANXET: 'Bảo vệ tốt', VAITRO_ID: 'VT1' },
            { ID: 'TV2', DC_ID: 'DC1', THANHVIEN_ID: 'NS2', THANHVIEN_HODEM: 'Trần Thị', THANHVIEN_TEN: 'Mai', THANHVIEN_COQUANCONGTAC: 'Viện Khoa học máy tính',
                DIEM: '8.0', DANHGIA_ID: 'DG1', NHANXET: '', VAITRO_ID: 'VT2' }
        ], {
            list: function (rows, p) { return rows.filter(function (r) { return r.DC_ID === p.strLVLA_DeCuong_ChinhThuc_Id; }); },
            map: function (p) { var n = ten(p.strThanhVien_Id); return { DC_ID: p.strLVLA_DeCuong_ChinhThuc_Id, THANHVIEN_ID: p.strThanhVien_Id, THANHVIEN_HODEM: n[0], THANHVIEN_TEN: n[1],
                THANHVIEN_COQUANCONGTAC: n[2], DIEM: p.dDiem, DANHGIA_ID: p.strDanhGia_Id, NHANXET: p.strNhanXet, VAITRO_ID: p.strVaiTro_Id }; }
        });
        var lich0 = { ID: 'L1', DC_ID: 'DC1', NGAY: '20/04/2026', GIO: '8', DIADIEM: 'Phòng 301 - Nhà A', TENDETAITIENGVIET_SAUBAOVE: 'Phát hiện gian lận thi trực tuyến', TENDETAITIENGANH_SAUBAOVE: 'Online exam fraud detection' };
        if (o.coPhut) lich0.PHUT = '30';
        ums.demo.crudStore(o.lich, [lich0], {
            list: function (rows, p) { return rows.filter(function (r) { return r.DC_ID === p.strLVLA_DeCuong_ChinhThuc_Id; }); },
            map: function (p) { return { DC_ID: p.strLVLA_DeCuong_ChinhThuc_Id, NGAY: p.strNgay, GIO: p.strGio, PHUT: p.strPhut, DIADIEM: p.strDiaDiem }; }
        });
        if (o.suaDeTai) fx[o.lich + '/' + o.suaDeTai] = function (p) { return { rows: [], raw: { Id: p.strId } }; };
        /* đánh giá chung */
        var xn = [];
        fx['LVLA_NhanXet_DanhGia/LayDanhSach'] = function (p) { return xn.filter(function (x) { return x.SP === p.strsanpham_Id; }).reverse(); };
        fx['LVLA_NhanXet_DanhGia/ThemMoi'] = function (p) {
            var t = fx[DM + 'XLHV.XNKK'].filter(function (d) { return d.ID === p.strTinhTrang_Id; })[0] || {};
            xn.push({ SP: p.strSanPham_Id, TINHTRANG_TEN: t.TEN, TINHTRANG_THONGTIN1: t.THONGTIN1, TINHTRANG_THONGTIN2: t.THONGTIN2, NOIDUNG: p.strNoiDung,
                NGUOIXACNHAN_TENDAYDU: 'Người dùng thử', NGAYTAO_DD_MM_YYYY: '12/10/2026' });
            return { rows: [], raw: { Id: 'XN' + xn.length } };
        };
        fx['LVLA_DeCuong_ChinhThuc/Sua_LVLA_DeCuong_CT_Diem'] = function (p) { return { rows: [], raw: { Id: p.strId } }; };
        fx['pkg_llkh_hoso.LayDanhSachLLKH'] = function (p) {
            var k = String(p.strTuKhoa || '').toLowerCase();
            var r = [{ ID: 'LK1', MASO: 'CB022', HOVATEN: 'Phạm Đức Long', MACHUCDANH: 'PGS', MAHOCVI: 'TS', NGAYSINH: 5, THANGSINH: 6, NAMSINH: 1978, TENGIOITINH: 'Nam', COQUANCONGTAC: 'Khoa Công nghệ thông tin' },
                { ID: 'NS3', MASO: 'CB102', HOVATEN: 'Lê Quang Minh', MACHUCDANH: '', MAHOCVI: 'TS', NGAYSINH: 21, THANGSINH: 1, NAMSINH: 1983, TENGIOITINH: 'Nam', COQUANCONGTAC: 'Trường Đại học Công nghệ' }]
                .filter(function (d) { return !k || (d.MASO + d.HOVATEN).toLowerCase().indexOf(k) >= 0; });
            return { rows: r, pager: r.length };
        };
        return fx;
    };
})();
