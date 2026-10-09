/* =========================================================================
   Tốt nghiệp — phần dùng chung của hai màn Văn bằng: "Quản lý thông tin" (vanbang/quanlythongtin)
   và "Thực hiện in" (vanbang/thuchienin). Hai màn gốc chép nhau khối bộ lọc Hệ → Khoá → CT → Lớp,
   Phân loại → Kế hoạch (getList_KeHoachXuLy) và hai ô mẫu phôi (getList_MauPhoiIn / MauPhoiInBanSao).
   Nạp từ html của từng màn, SAU ApisHocBong/Modules/kehoach/script/_th.js (ums.hbTh — bộ nối tầng
   Hệ → Khoá → CT → Lớp đã viết cho bản Học bổng, tham số chép nguyên edu.system.getList_* của Corei).

   ums.tnvb.e(v) · uid() · cn() · arr(d) · hoTen(r)     tiện ích nhỏ (lấy lại của ums.hbTh)
   ums.tnvb.boLoc(f, o) → { gtri(k) }
       f = { he, khoa, ct, lop, pl, kh } — các <select> của thanh lọc (thiếu ô nào thì bỏ qua ô đó)
       Hệ → Khoá → CT → Lớp: ums.hbTh.dt (khoá tầng dưới tới khi chọn tầng trên — luật cha → con).
       Phân loại → Kế hoạch: TN_ThongTin/LayDSTN_KeHoach (GET) theo phân loại vừa chọn; Kế hoạch KHOÁ tới khi
           chọn Phân loại, xoá Phân loại thì xoá Kế hoạch (ums.pat.chain). Gốc: strTuKhoa = ô từ khoá đang gõ,
           strDaoTao_ThoiGianDaoTao_Id = ô thời gian (không có trên cả hai màn → '').
       o.tuKhoa() → từ khoá đang gõ (chép nguyên: gốc gửi ô txtSearch vào lời gọi kế hoạch)
   ums.tnvb.mauPhoi(elChinh, elSao, o) → Promise
       TN_PhoiIn/LayDS_MauPhoiIn_BanChinh · LayDS_MauPhoiIn_BanSao (GET, strId '' — ô txtAAAA không có) → ID / MAPHOI
       o.nhanChinh / o.nhanSao: chữ đầu ô (gốc "Chọn mẫu phôi"; Thực hiện in: bản sao là "Chọn mẫu bản sao")
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat, H = ums.hbTh;
    var T = ums.tnvb = ums.tnvb || {};

    T.e = H.e; T.uid = H.uid; T.cn = H.cn; T.arr = H.arr; T.hoTen = H.hoTen;
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }

    T.boLoc = function (f, o) {
        o = o || {};
        var dt = H.dt({ he: f.he, khoa: f.khoa, ct: f.ct, lop: f.lop });
        function napKeHoach() {
            if (!f.kh) return Promise.resolve();
            if (!f.pl || !f.pl.value) { pat.fill(f.kh, [], { head: 'Chọn kế hoạch' }); return Promise.resolve(); }
            return ums.api.call({ action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET', silent: true,
                strTuKhoa: o.tuKhoa ? o.tuKhoa() : '', strPhanLoai_Id: f.pl.value, strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f.kh, T.arr(r.data), { head: 'Chọn kế hoạch' }); })
                .catch(loi('TN_ThongTin/LayDSTN_KeHoach'));
        }
        if (f.pl && f.kh) {
            pat.chain([f.pl, f.kh], { phatLai: false });
            jQuery(f.pl).on('select2:select select2:clear', napKeHoach);
        }
        return {
            gtri: function (k) {
                if (k === 'he' || k === 'khoa' || k === 'ct' || k === 'lop') return dt.gtri(k);
                return f[k] ? pat.val(f[k]) : '';
            },
            napKeHoach: napKeHoach
        };
    };

    T.mauPhoi = function (elChinh, elSao, o) {
        o = o || {};
        function mot(el, ten, nhan) {
            if (!el) return Promise.resolve([]);
            return ums.api.call({ action: 'TN_PhoiIn/' + ten, method: 'GET', silent: true, strId: '' })
                .then(function (r) { var d = T.arr(r.data); pat.fill(el, d, { name: 'MAPHOI', head: nhan }); return d; })
                .catch(function (err) { loi('TN_PhoiIn/' + ten)(err); return []; });
        }
        return Promise.all([
            mot(elChinh, 'LayDS_MauPhoiIn_BanChinh', o.nhanChinh || 'Chọn mẫu phôi'),
            mot(elSao, 'LayDS_MauPhoiIn_BanSao', o.nhanSao || 'Chọn mẫu phôi')
        ]);
    };
})();
