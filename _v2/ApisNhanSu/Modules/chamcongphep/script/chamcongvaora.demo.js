/* Dữ liệu mẫu cho chamcongvaora — chỉ dùng ở chế độ dựng thử.
   Cột DIADIEMCCVaoRa chép nguyên theo bản gốc (xem chú thích đầu chamcongvaora.js). */
ums.demo.add({
    'NS_VaoRaCaNhan/LayDanhSach': function (o) {
        if (!o.strNhanSu_HoSoCanBo_Id) return [];
        return { rows: [
            { ID: 'VR1', DIADIEMCCVaoRa: '01/09/2026 07:28' },
            { ID: 'VR2', DIADIEMCCVaoRa: '01/09/2026 17:05' },
            { ID: 'VR3', DIADIEMCCVaoRa: '02/09/2026 07:31' }
        ], pager: 3 };
    }
});
