/* Dữ liệu mẫu cho vanban — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'SV_ThongTin/LayDSTinTuc_VanBan': [
        { ID: 'VB1', TENVANBAN: 'Quy chế chi tiêu nội bộ 2026', SOHIEU: '15/QĐ-ĐHHN', NGAYBANHANH: '05/01/2026' },
        { ID: 'VB2', TENVANBAN: 'Mẫu đơn xin nghỉ phép', SOHIEU: 'BM-TCCB-03', NGAYBANHANH: '12/03/2025' }
    ],
    'TT_Files/LayDanhSach': function (o) { return o.strDuLieu_Id === 'VB1' ? [{ ID: 'F1', FILEMINHCHUNG: 'Upload/vanban/quyche.pdf', TENHIENTHI: 'quyche.pdf' }] : []; }
});
