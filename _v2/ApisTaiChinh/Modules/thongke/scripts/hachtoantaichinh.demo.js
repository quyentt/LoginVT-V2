/* Dữ liệu mẫu cho hachtoantaichinh — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';

    var CT = [
        { MASO: 'BIT230112', HOVATEN: 'Nguyễn Văn An', TAICHINH_CACKHOANTHU_TEN: 'Học phí', SOTIEN: 1250000 },
        { MASO: 'BBA230561', HOVATEN: 'Trần Thị Bích', TAICHINH_CACKHOANTHU_TEN: 'Học phí', SOTIEN: 980000 },
        { MASO: 'BIT240033', HOVATEN: 'Lê Hoàng Cường', TAICHINH_CACKHOANTHU_TEN: 'Bảo hiểm y tế', SOTIEN: 680000 }
    ];

    ums.demo.add({
        'TC_ThongKe/LayTongHopNoChung': [{ TEN: 'Học phí', TONGNO: 1250000000 }, { TEN: 'Bảo hiểm y tế', TONGNO: 86000000 }],
        'TC_ThongKe/LayTongHopDuChung': [{ TEN: 'Học phí', TONGDU: 312000000 }, { TEN: 'Bảo hiểm y tế', TONGDU: 4500000 }],
        'TC_ThongKe/LayTongHopNoRieng': [{ TEN: 'Học phí học lại', TONGNO: 145000000 }],
        'TC_ThongKe/LayTongHopDuRieng': [{ TEN: 'Lệ phí tốt nghiệp', TONGDU: 12400000 }],
        'TC_ThongKe/LayTongHopNoChungTheoKhoan': [{ TEN: 'Học phí', TONGNO: 1250000000 }, { TEN: 'Bảo hiểm y tế', TONGNO: 86000000 }],
        'TC_ThongKe/LayTongHopDuChungTheoKhoan': [{ TEN: 'Học phí', TONGDU: 312000000 }, { TEN: 'Bảo hiểm y tế', TONGDU: 4500000 }],
        'TC_ThongKe/LayTongHopNoRiengTheoKhoan': [{ TEN: 'Học phí học lại', TONGNO: 145000000 }],
        'TC_ThongKe/LayTongHopDuRiengTheoKhoan': [{ TEN: 'Lệ phí tốt nghiệp', TONGDU: 12400000 }],
        'TC_ThongKe/LayCTDuLieuDuNoChungRieng': { rows: CT, pager: 3 }
    });
})();
