/* Dữ liệu mẫu cho tintuc/vanban (Cổng sinh viên) — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'pkg_tintuc.LayDSTinTuc_VanBan': [
        { ID: 'VB1', TENVANBAN: 'Quy chế đào tạo trình độ đại học theo hệ thống tín chỉ', SOHIEU: '412/QĐ-ĐHLN', NGAYBANHANH: '15/03/2026' },
        { ID: 'VB2', TENVANBAN: 'Quy định về đánh giá kết quả rèn luyện của người học', SOHIEU: '118/QĐ-ĐHLN', NGAYBANHANH: '02/02/2026' },
        { ID: 'VB3', TENVANBAN: 'Mẫu đơn xin nghỉ học tạm thời', SOHIEU: 'BM-CTSV-05', NGAYBANHANH: '10/09/2025' },
        { ID: 'VB4', TENVANBAN: 'Mẫu đơn đăng ký xét tốt nghiệp', SOHIEU: 'BM-QLDT-12', NGAYBANHANH: '20/08/2025' },
        { ID: 'VB5', TENVANBAN: 'Hướng dẫn nộp học phí trực tuyến trên cổng sinh viên', SOHIEU: '77/HD-KHTC', NGAYBANHANH: '05/08/2025' }
    ],
    'TT_Files/LayDanhSach': function (o) {
        var f = {
            VB1: 'VanBan/quy-che-dao-tao-tin-chi.pdf',
            VB3: 'VanBan/don-xin-nghi-hoc-tam-thoi.doc',
            VB5: 'VanBan/huong-dan-nop-hoc-phi.pdf'
        }[o.strDuLieu_Id];
        return f ? [{ ID: 'F' + o.strDuLieu_Id, FILEMINHCHUNG: f, TENHIENTHI: f.split('/').pop() }] : [];
    }
});
