/* Dữ liệu mẫu cho dongphuc — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001 — Lăng Văn Huy (25001029), DCOT.16.2.
   Xác nhận tham gia / không tham gia / hủy đăng ký đều đổi dữ liệu trong bộ nhớ
   để bấm thử thấy kết quả đổi theo. */
(function () {
    'use strict';
    var F = 'PKG_TAICHINH_DANGKYMUA.';

    var dot = [
        { ID: 'DOT1', TEN: 'Đợt đăng ký đồng phục K16 - năm học 2024-2025', MOTA: 'mua' },
        { ID: 'DOT2', TEN: 'Đợt tham gia bảo hiểm y tế năm 2025', MOTA: 'tham gia' }
    ];

    /* Hàng hoá / dịch vụ theo đợt */
    var hang = {
        DOT1: [
            { ID: 'HH1', TEN_KHOANTHU: 'Áo đồng phục nam', DONGIA: 185000, TAICHINH_CACKHOANTHU_ID: 'KT1' },
            { ID: 'HH2', TEN_KHOANTHU: 'Áo đồng phục nữ', DONGIA: 185000, TAICHINH_CACKHOANTHU_ID: 'KT2' },
            { ID: 'HH3', TEN_KHOANTHU: 'Áo khoác đồng phục', DONGIA: 320000, TAICHINH_CACKHOANTHU_ID: 'KT3' },
            { ID: 'HH4', TEN_KHOANTHU: 'Thẻ sinh viên (cấp lại)', DONGIA: 50000, TAICHINH_CACKHOANTHU_ID: 'KT4' }
        ],
        DOT2: [
            { ID: 'HH5', TEN_KHOANTHU: 'Bảo hiểm y tế 12 tháng', DONGIA: 1350000, TAICHINH_CACKHOANTHU_ID: 'KT5' },
            { ID: 'HH6', TEN_KHOANTHU: 'Bảo hiểm thân thể 12 tháng', DONGIA: 120000, TAICHINH_CACKHOANTHU_ID: 'KT6' }
        ]
    };

    /* Kết quả đã đăng ký theo đợt */
    var kq = {
        DOT1: [
            { ID: 'KQ1', TEN_KHOANTHU: 'Áo đồng phục nam', DONGIA: 185000, SOLUONG: 2,
              SOTIENPHAINOP: 370000, TINHTRANGDANGKY_CODE: 'DANG_KY' },
            { ID: 'KQ2', TEN_KHOANTHU: 'Áo khoác đồng phục', DONGIA: 320000, SOLUONG: 0,
              SOTIENPHAINOP: 0, TINHTRANGDANGKY_CODE: 'KHONG_DANG_KY' }
        ],
        DOT2: [
            { ID: 'KQ3', TEN_KHOANTHU: 'Bảo hiểm y tế 12 tháng', DONGIA: 1350000, SOLUONG: 1,
              SOTIENPHAINOP: 1350000, TINHTRANGDANGKY_CODE: 'DANG_KY' }
        ]
    };

    var dem = 100;
    function ten(dotId, ktId) {
        var l = hang[dotId] || [];
        for (var i = 0; i < l.length; i++) if (l[i].TAICHINH_CACKHOANTHU_ID === ktId) return l[i];
        return null;
    }

    var fx = {};
    fx[F + 'Pr_TC_KH_MuaHang_DangKy'] = dot;
    fx[F + 'Pr_TC_KH_MH_DG_LayDSDangKy'] = function (o) { return hang[o.strTaiChinh_KH_MuaHang_Id] || []; };
    fx[F + 'Pr_TC_KH_MH_KQ_LayDSDangKy'] = function (o) { return kq[o.strTaiChinh_KH_MuaHang_Id] || []; };

    fx[F + 'Pr_TC_KH_MH_KQ_Them_Mua'] = function (o) {
        var d = o.strTaiChinh_KH_MuaHang_Id, h = ten(d, o.strTaiChinh_CacKhoanThu_Id);
        if (h) {
            kq[d] = (kq[d] || []).filter(function (x) { return x.TEN_KHOANTHU !== h.TEN_KHOANTHU; });
            kq[d].push({
                ID: 'KQ' + (++dem), TEN_KHOANTHU: h.TEN_KHOANTHU, DONGIA: h.DONGIA,
                SOLUONG: Number(o.dSoLuong) || 1,
                SOTIENPHAINOP: (Number(o.dSoLuong) || 1) * Number(h.DONGIA || 0),
                TINHTRANGDANGKY_CODE: 'DANG_KY'
            });
        }
        return { rows: [], message: '' };
    };

    fx[F + 'Pr_TC_KH_MH_KQ_Them_KhongMua'] = function (o) {
        var d = o.strTaiChinh_KH_MuaHang_Id, h = ten(d, o.strTaiChinh_CacKhoanThu_Id);
        if (h) {
            kq[d] = (kq[d] || []).filter(function (x) { return x.TEN_KHOANTHU !== h.TEN_KHOANTHU; });
            kq[d].push({
                ID: 'KQ' + (++dem), TEN_KHOANTHU: h.TEN_KHOANTHU, DONGIA: h.DONGIA, SOLUONG: 0,
                SOTIENPHAINOP: 0, TINHTRANGDANGKY_CODE: 'KHONG_DANG_KY',
                LYDOKHONGMUA: o.strLyDoKhongMua, MINHCHUNG: o.strMinhChung
            });
        }
        return { rows: [], message: '' };
    };

    fx[F + 'Pr_TC_KH_MH_KQ_Xoa'] = function (o) {
        Object.keys(kq).forEach(function (d) {
            kq[d] = kq[d].filter(function (x) { return String(x.ID) !== String(o.strId); });
        });
        return { rows: [], message: '' };
    };

    ums.demo.add(fx);
})();
