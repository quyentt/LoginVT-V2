/* Dữ liệu mẫu cho khung ums.nckhGT (Giải thưởng / Văn bằng sáng chế / Hội nghị hội thảo — quản trị + xác nhận).
   Nạp SAU _sanpham.demo.js của Cổng cán bộ nên các khoá trùng ở đây thắng. Chỉ dùng ở chế độ dựng thử. */
(function () {
    var XN = [
        { ID: 'XN0', MA: 'XNKKCHUAKHAI', TEN: 'Chưa kê khai', THONGTIN1: 'fa fa-circle-o', THONGTIN2: 'color: #999' },
        { ID: 'XN1', MA: 'XNKKDAXACNHAN', TEN: 'Đã xác nhận', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color: #198754' },
        { ID: 'XN2', MA: 'XNKKYEUCAUBOSUNG', TEN: 'Yêu cầu bổ sung', THONGTIN1: 'fa fa-exclamation-circle', THONGTIN2: 'color: #d97706' },
        { ID: 'XN3', MA: 'XNKKKHONGXACNHAN', TEN: 'Không xác nhận', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color: #dc3545' }
    ];
    function kq(id, nd) {
        var x = XN.filter(function (y) { return y.ID === id; })[0];
        return { KETQUAXACNHAN_TEN: x.TEN, KETQUAXACNHAN_THONGTIN1: x.THONGTIN1, KETQUAXACNHAN_THONGTIN2: x.THONGTIN2, KETQUAXACNHAN_NOIDUNG: nd || '' };
    }
    function map(o) { var r = {}; Object.keys(o).forEach(function (k) { if (/^(str|d|i)[A-Z]/.test(k)) r[k.replace(/^(str|d|i)/, '').replace(/_n$/, '_N').toUpperCase()] = o[k]; }); return r; }

    var GT = [
        Object.assign({ ID: 'GT1', NOIDUNGGIAITHUONG: 'Giải Nhì Sinh viên nghiên cứu khoa học cấp Bộ', HINHTHUC: 'Bằng khen', CAPKHENTHUONG_ID: 'NCKHLKT0', CAPKHENTHUONG_TEN: 'Cấp Bộ',
            SOQUYETDINH: '12/QĐ-BGDĐT', NAMTANGTHUONG: '2026', THANGTANGTHUONG: '03', SONGUOITHAMGIAVAOCONGTRINH_N: 3, THONGTINMINHCHUNG: 'Bằng khen kèm quyết định',
            NCKH_QUANLYDETAI_ID: 'DT1', HOANTHANHNHAPDULIEU: 1 }, kq('XN1', 'Đủ minh chứng')),
        { ID: 'GT2', NOIDUNGGIAITHUONG: 'Giải Ba Hội thi sáng tạo kỹ thuật', HINHTHUC: 'Giấy khen', CAPKHENTHUONG_ID: 'NCKHLKT1', CAPKHENTHUONG_TEN: 'Cấp Trường',
            SOQUYETDINH: '88/QĐ-ĐHCN', NAMTANGTHUONG: '2025', THANGTANGTHUONG: '11', SONGUOITHAMGIAVAOCONGTRINH_N: 2, HOANTHANHNHAPDULIEU: 0, HOANTHANHNHAPDULIEU_LYDO: 'Thiếu tệp minh chứng' }
    ];
    var VB = [
        Object.assign({ ID: 'VB1', TENVANBANG: 'Thiết bị giám sát phòng thi thông minh', MASANPHAM: 'VN-2026-0012', NAMCAPVANBANG: '2026', THANGCAPVANBANG: '02',
            NOIDUNGVANBANG: 'Bằng độc quyền giải pháp hữu ích', THONGTINMINHCHUNG: 'Bản sao văn bằng', NHANSU_TTQUYETDINH_SOQD: '1520/QĐ-SHTT' }, kq('XN2', 'Bổ sung bản dịch')),
        { ID: 'VB2', TENVANBANG: 'Sáng kiến quy trình chấm thi tự động', MASANPHAM: 'SK-2025-03', NAMCAPVANBANG: '2025', THANGCAPVANBANG: '09', NOIDUNGVANBANG: 'Sáng kiến kinh nghiệm cấp Trường' }
    ];
    var HN = [
        Object.assign({ ID: 'HN1', TENHOINGHIHOITHAO: 'Hội thảo Chuyển đổi số trong giáo dục đại học', TENBAOCAO: 'Chuyển đổi số và đảm bảo chất lượng', MUCTIEU: 'Chia sẻ kinh nghiệm',
            NOIDUNG: 'Ứng dụng AI trong quản lý đào tạo', NAMHOANTHANH: '2026', NAMBAOCAO: '04', DONVITOCHUC_ID: 'NCKHDTHT0', PHAMVIHOINGHIHOITHAO_ID: 'NCKHPVHT1',
            PHAMVIHOINGHIHOITHAO_TEN: 'Quốc gia', THUOCLINHVUCNAO_ID: 'NCKHLVNC0', THUOCLINHVUCNAO_TEN: 'Khoa học máy tính', MASANPHAM: 'HT-2026-01', DIADIEM: 'Hội trường A',
            SODAIBIEUQUOCTE: 12, SODAIBIEUTRONGNUOC: 180, SOLUONGBAOCAO: 24, SOLUONGNGUOIBAOCAO: 30, THANHPHANTHAMGIA: 'Giảng viên, nghiên cứu sinh' }, kq('XN1', '')),
        { ID: 'HN2', TENHOINGHIHOITHAO: 'Hội nghị khoa học sinh viên 2025', NAMHOANTHANH: '2025', THUOCLINHVUCNAO_TEN: 'Kinh tế', PHAMVIHOINGHIHOITHAO_TEN: 'Quốc tế', SOLUONGNGUOIBAOCAO: 15 }
    ];
    ums.demo.crudStore('NCKH_GiaiThuong', GT, { map: map });
    ums.demo.crudStore('NCKH_VanBangSangChe', VB, { map: map });
    ums.demo.crudStore('NCKH_HoiNghiHoiThao', HN, { map: map });

    /* Thành viên (có ảnh) / tệp / kinh phí — giữ theo id sản phẩm */
    var TV = {
        GT1: [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', ANH: '' }, { ID: 'CB2', HOTEN: 'Trần Thị Mai', MACANBO: 'CB002', ANH: '' }],
        HN1: [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', ANH: '', VAITRO_ID: 'NCKHVTHT0', VAITRO_TEN: 'Tác giả chính' }]
    };
    var TEP = { GT1: [{ ID: 'F1', FILEMINHCHUNG: 'Upload/NCKH/bangkhen_gt1.pdf', TENHIENTHI: 'bangkhen_gt1.pdf' }],
        HN1: [{ ID: 'F2', FILEMINHCHUNG: 'Upload/NCKH/giaymoi_hn1.jpg', TENHIENTHI: 'giaymoi_hn1.jpg' }] };
    /* giữ cả dòng mẫu của Cổng cán bộ (DT1, TQ1) — khoá ở đây đè bản của _sanpham.demo.js */
    TV.DT1 = [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', VAITRO_ID: 'NCKHVTDT0', LATHANHVIENCUATRUONG: 0 }];
    TV.TQ1 = [{ ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MACANBO: 'CB001', VAITRO_ID: 'NCKHVTQT0', LATHANHVIENCUATRUONG: 0 },
        { ID: 'NG1', HOTEN: 'Kenji Sato', MACANBO: '', VAITRO_ID: 'NCKHVTQT1', LATHANHVIENCUATRUONG: 1 }];
    var KP = { DT1: [{ ID: 'KP1', NGUONKINHPHI_ID: 'NCKHNGKP0', SOTIEN: '150,000,000', DONVITINH_ID: 'CHUNDVTT0' }], HN1: [{ ID: 'KP9', NGUONKINHPHI_ID: 'NCKHNGKP0', NGUONKINHPHI_TEN: 'Ngân sách nhà nước', SOTIEN: '50000000', DONVITINH_ID: 'CHUNDVTT0', DONVITINH_TEN: 'VNĐ' }] };
    var LS = { GT1: [{ TINHTRANG_TEN: 'Đã xác nhận', NOIDUNG: 'Đủ minh chứng', NGUOIXACNHAN_TENDAYDU: 'Phòng Khoa học', NGAYTAO_DD_MM_YYYY: '15/03/2026' }] };
    var NS = [
        { ID: 'CB1', HOTEN: 'Nguyễn Văn Hùng', MASO: 'CB001', DV: 'CC1' }, { ID: 'CB2', HOTEN: 'Trần Thị Mai', MASO: 'CB002', DV: 'CC1' },
        { ID: 'CB3', HOTEN: 'Lê Quang Minh', MASO: 'CB003', DV: 'CC3' }
    ];
    function timSp(id) { return GT.concat(VB, HN).filter(function (r) { return r.ID === id; })[0]; }

    ums.demo.add({
        'NS_HoSoV2/LayDanhSach': function (o) { return NS.filter(function (r) { return !o.strDaoTao_CoCauToChuc_Id || r.DV === o.strDaoTao_CoCauToChuc_Id; }); },
        'NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung': XN,
        'NCKH_SP_XacNhanKeKhai/LayDanhSach': function (o) { return (LS[o.strSanPham_Id] || []).slice(); },
        'NCKH_SP_XacNhanKeKhai/ThemMoi': function (o) {
            var x = XN.filter(function (y) { return y.ID === o.strTinhTrang_Id; })[0] || {};
            (LS[o.strSanPham_Id] || (LS[o.strSanPham_Id] = [])).unshift({ TINHTRANG_TEN: x.TEN, NOIDUNG: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Người đang đăng nhập', NGAYTAO_DD_MM_YYYY: '27/09/2026' });
            var sp = timSp(o.strSanPham_Id);
            if (sp && x.ID) Object.assign(sp, kq(x.ID, o.strNoiDung));
            return { rows: [], raw: { Id: 'XNMOI' } };
        },
        'NCKH_ThanhVien/LayDanhSach': function (o) { return (TV[o.strSanPham_Id] || []).slice(); },
        'NCKH_ThanhVien/ThemMoi': function (o) {
            var l = TV[o.strSanPham_Id] || (TV[o.strSanPham_Id] = []);
            var cu = l.filter(function (x) { return x.ID === o.strThanhVien_Id; })[0];
            if (cu) cu.VAITRO_ID = o.strVaiTro_Id;
            else { var n = NS.filter(function (x) { return x.ID === o.strThanhVien_Id; })[0] || {}; l.push({ ID: o.strThanhVien_Id, HOTEN: n.HOTEN || o.strThanhVien_Id, MACANBO: n.MASO || '', VAITRO_ID: o.strVaiTro_Id }); }
            return [];
        },
        'NCKH_ThanhVien/Xoa': function (o) { TV[o.strSanPham_Id] = (TV[o.strSanPham_Id] || []).filter(function (x) { return x.ID !== o.strThanhVien_Id; }); return []; },
        'NCKH_Files/LayDanhSach': function (o) { return (TEP[o.strDuLieu_Id] || []).slice(); },
        'NCKH_Files/ThemMoi': function (o) {
            var l = TEP[o.strDuLieu_Id] || (TEP[o.strDuLieu_Id] = []);
            l.push({ ID: 'F' + Date.now() + l.length, FILEMINHCHUNG: o.strFileMinhChung, TENHIENTHI: o.strTenHienThi });
            return [];
        },
        'NCKH_Files/Xoa': function (o) { Object.keys(TEP).forEach(function (k) { TEP[k] = TEP[k].filter(function (f) { return f.ID !== o.strIds; }); }); return []; },
        'NCKH_Files/GopFile': { rows: 'Temp/nckh_minhchung.zip' },
        'NCKH_SP_NguonKinhPhi/LayDanhSach': function (o) { return (KP[o.strSanPham_Id] || []).slice(); },
        'NCKH_SP_NguonKinhPhi/ThemMoi': function (o) {
            (KP[o.strSanPham_Id] || (KP[o.strSanPham_Id] = [])).push({ ID: 'KP' + Date.now(), NGUONKINHPHI_ID: o.strNguonKinhPhi_Id, SOTIEN: o.dSoTien, DONVITINH_ID: o.strDonViTinh_Id });
            return { rows: [], raw: { Id: 'KPMOI' } };
        },
        'NCKH_SP_NguonKinhPhi/Xoa': function (o) { Object.keys(KP).forEach(function (k) { KP[k] = KP[k].filter(function (x) { return x.ID !== o.strIds; }); }); return []; }
    });
})();
