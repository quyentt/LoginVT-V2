/* =========================================================================
   Bộ lọc Năm → Kế hoạch năm → Kế hoạch chi tiết — dùng chung cho
   hoatdong/phangiangvien và hoatdong/dukienhocphan (bản gốc chép y hệt nhau).
   ums.hd.keHoach({ nam, khn, khct, doi(tang) }) → { sync() }
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, mã hoá):
       KHCT_HoatDong_Chung_MH · PKG_KEHOACH_HOATDONG_CHUNG.LayDSNam                 (NAM, tự chọn khi một mục)
       KHCT_HoatDong_KeHoach_MH · PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_TongHop  strNam = ID năm (như gốc)
       KHCT_HoatDong_KeHoach_MH · …LayDSKH_Nam_ChiTietTheo                          strKH_Nam_TongHop_Id
   Tự chọn khi chỉ có một mục ở cả ba tầng (selectOne của gốc) và bắn tiếp tầng dưới.
   Khoá / xoá trắng tầng dưới: ums.pat.chain. doi(tang) báo cho màn ('khn' | 'khct')
   sau khi tầng đó nạp xong — để màn nạp Học phần / danh sách.
   ========================================================================= */
(function () {
    'use strict';
    var pat = ums.pat;
    var hd = ums.hd = ums.hd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function call(a, f, o) { return ums.api.call(Object.assign({ action: a, func: f, strNguoiThucHien_Id: uid() }, o)).then(function (r) { return arr(r.data); }); }
    function chon1(el, d) { if (d.length === 1) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); return true; } return false; }

    hd.keHoach = function (o) {
        var chuoi = pat.chain([o.nam, o.khn, o.khct], { phatLai: false });
        function doi(t) { if (o.doi) return o.doi(t); }
        function napKHN() {
            if (!o.nam.value) { pat.fill(o.khn, []); chuoi.sync(); return napKHCT(); }
            return call('KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweFS4vJgkuMQPP', 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_TongHop', { strNam: o.nam.value }).then(function (d) {
                pat.fill(o.khn, d, { name: 'TEN', head: 'Chọn kế hoạch' }); chon1(o.khn, d); chuoi.sync();
                return napKHCT();
            }).catch(function (err) { ums.api.handle(err, 'kế hoạch năm'); });
        }
        function napKHCT() {
            if (!o.khn.value) { pat.fill(o.khct, []); chuoi.sync(); return Promise.resolve(doi('khn')); }
            return call('KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNRUpJC4P', 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ChiTietTheo', { strKH_Nam_TongHop_Id: o.khn.value }).then(function (d) {
                pat.fill(o.khct, d, { name: 'TEN', head: 'Chọn kế hoạch chi tiết' }); chon1(o.khct, d); chuoi.sync();
                return doi('khn');
            }).catch(function (err) { ums.api.handle(err, 'kế hoạch chi tiết'); });
        }
        call('KHCT_HoatDong_Chung_MH/DSA4BRIPICwP', 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSNam', {}).then(function (d) {
            pat.fill(o.nam, d, { name: 'NAM', head: 'Chọn Năm' }); chuoi.sync();
            if (chon1(o.nam, d)) napKHN();
        }).catch(function (err) { ums.api.handle(err, 'năm'); });
        if (window.jQuery) {
            jQuery(o.nam).on('select2:select select2:clear', napKHN);
            jQuery(o.khn).on('select2:select select2:clear', napKHCT);
            jQuery(o.khct).on('select2:select select2:clear', function () { doi('khct'); });
        }
        return chuoi;
    };
})();
