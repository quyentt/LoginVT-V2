/* Dữ liệu mẫu cho Tin tức → Văn bản — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TINTUC.VANBAN.LOAI': [
        { ID: 'LVB1', MA: 'QD', TEN: 'Quyết định' }, { ID: 'LVB2', MA: 'QC', TEN: 'Quy chế' }, { ID: 'LVB3', MA: 'BM', TEN: 'Biểu mẫu' }
    ],
    'TT_VanBan/LayDSTinTuc_VanBan': function (o) {
        var rows = [
            { ID: 'VB1', TENVANBAN: 'Quy chế đào tạo trình độ đại học', SOHIEU: '15/QĐ-ĐH', NGAYBANHANH: '05/01/2026', THUTU: 1, HIEULUC: 1, LOAIVANBAN_ID: 'LVB2' },
            { ID: 'VB2', TENVANBAN: 'Mẫu đơn xin bảo lưu kết quả học tập', SOHIEU: 'BM-ĐT-03', NGAYBANHANH: '12/03/2025', THUTU: 2, HIEULUC: 1, LOAIVANBAN_ID: 'LVB3' },
            { ID: 'VB3', TENVANBAN: 'Quyết định ban hành khung học phí 2024', SOHIEU: '88/QĐ-ĐH', NGAYBANHANH: '20/08/2024', THUTU: 3, HIEULUC: 0, LOAIVANBAN_ID: 'LVB1' }
        ];
        var q = (o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) {
            return (!o.strLoaiVanBan_Id || r.LOAIVANBAN_ID === o.strLoaiVanBan_Id) && (!q || r.TENVANBAN.toLowerCase().indexOf(q) >= 0);
        });
    },
    'TT_Files/LayDanhSach': function (o) {
        return o.strDuLieu_Id === 'VB1' ? [{ ID: 'F1', FILEMINHCHUNG: 'Upload/vanban/quyche-daotao.pdf', TENHIENTHI: 'quyche-daotao.pdf' }] : [];
    },
    'TT_VanBan/Them_TinTuc_VanBan': function () { return { rows: [], raw: { Id: 'VB' + Date.now() } }; },
    'TT_VanBan/Sua_TinTuc_VanBan': [],
    'TT_VanBan/Xoa_TinTuc_VanBan': []
});
