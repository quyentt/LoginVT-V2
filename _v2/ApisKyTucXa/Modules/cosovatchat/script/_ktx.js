/* =========================================================================
   ApisKyTucXa / cosovatchat — phần DÙNG CHUNG của sáu màn cơ sở vật chất
   (congtodien, congtonuoc, toanha, phong, thietbi, quanlythietbi). Đặt ở ums.ktx.
   ---------------------------------------------------------------------------
   Các bản gốc chép nhau ba lời gọi và hai ô chọn Toà nhà → Phòng; ở đây một bản:

   ums.ktx.toaNha()                → Promise<[{ ID, TEN, MA, … }]>
       KTX_ToaNha/LayDanhSach GET — tham số chép nguyên văn bản gốc (toanha.js:227),
       pageSize 100000; nhớ kết quả trong một lần mở màn (ums.ktx.quen() để xoá).
   ums.ktx.phong(o)                → Promise<{ rows, total }>
       KTX_Phong/LayDanhSach GET — o: { strTuKhoa, strKTX_ToaNha_Id, strPhanLoaiDoiTuong_Id,
       strTangThu_Id, strLoaiPhong_Id, strTinhChat_Id, strTinhTrang_Id, pageIndex, pageSize }
       (thiếu khoá nào thì gửi "" / 1 / 1000000 như bản gốc).
   ums.ktx.congTo(loai)            → Promise<rows>   loai 'dien' | 'nuoc'
       KTX_CongToDien/LayDanhSach | KTX_CongToNuoc/LayDanhSach GET (strTuKhoa, strHangSanXuat_Id, pageIndex 1, pageSize 100000)
   ums.ktx.tenPhong(r)             → "Toà nhà - Tên phòng" (cách bản gốc ghép trong ô chọn phòng)
   ums.ktx.noiToaNhaPhong(selToa, selPhong, o)   — MỘT bản cho cả phân hệ (12/10 gộp từ hoso / hopdong)
       Đổ toà nhà vào selToa, đổi toà nhà thì nạp phòng của toà đó vào selPhong rồi
       ums.pat.chain([selToa, selPhong]) (chưa chọn toà → khoá ô phòng, luật 2026-09-21).
       Gọi lần hai trên cùng ô → trả lại bộ đã nối, không nối đôi. Mọi cờ đều tuỳ chọn:
       o.tenPhong   chữ mục phòng: hàm (r) hoặc tên cột — mặc định ums.ktx.tenPhong ("Toà - Tên phòng")
       o.head       chữ đầu ô phòng — mặc định pat.fill đọc data-ph của ô (o.headToa: ô toà, như vậy)
       o.napSan     true → chưa chọn toà thì nạp sẵn MỌI phòng (bản gốc hoso); mặc định false (ô phòng trống)
       o.onToaNha(toaId)   gọi sau khi NGƯỜI DÙNG đổi toà và phòng đã nạp xong (hopdong: tải lại danh sách)
       o.onPhong(rows)     gọi sau mỗi lần nạp phòng (kể cả nap / dat bằng mã)
       o.onChange()        gọi khi người dùng đổi toà (sau nạp) hoặc đổi phòng
       Trả { nap(toaId) → Promise<rows>, dat(toaId, phongId) → Promise (đặt giá trị bằng mã, không bắn onChange),
             sanSang: Promise (toà đã đổ), sync() (đồng bộ khoá / mở của pat.chain) }
       Dùng ở: cosovatchat (quanlythietbi), kehoach, hoso (taomoihoso, dangkynguoio, _hoso khoiXepPhong), hopdong (lọc + biểu mẫu).
   ums.ktx.tinhTrangThietBi(r)     → nhãn tình trạng thiết bị: mã KTX.TTTB.01 → xanh, khác → đỏ
       (quanlythietbi.js:233 / thietbi.js:701)
   ums.ktx.rows(r) / ums.ktx.e(v)  tiện ích đọc kết quả ums.api.call / rỗng → ''
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var K = ums.ktx = {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function rows(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }
    K.e = e;
    K.rows = rows;

    var PHONG_MAC_DINH = {
        strTuKhoa: '', strKTX_ToaNha_Id: '', strPhanLoaiDoiTuong_Id: '', strTangThu_Id: '',
        strLoaiPhong_Id: '', strTinhChat_Id: '', strTinhTrang_Id: '', strNguoiThucHien_Id: '',
        pageIndex: 1, pageSize: 1000000
    };

    /* ---------- Toà nhà ---------------------------------------------------- */
    var pToa = null;
    K.toaNha = function () {
        if (!pToa) {
            pToa = ums.api.call({
                action: 'KTX_ToaNha/LayDanhSach', method: 'GET',
                strTuKhoa: '', strLoaiToaNha_Id: '', strViTriCauThang_Id: '', strPhanLoaiDoiTuong_Id: '',
                strTangThu_Id: '', strLoaiPhong_Id: '', strTinhChat_Id: '', strTinhTrang_Id: '',
                strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
            }).then(rows, function (err) {
                pToa = null;
                ums.api.handle(err, 'danh sách toà nhà');
                return [];
            });
        }
        return pToa;
    };
    K.quen = function () { pToa = null; };

    /* ---------- Phòng ------------------------------------------------------ */
    K.phong = function (o) {
        var p = { action: 'KTX_Phong/LayDanhSach', method: 'GET' };
        Object.keys(PHONG_MAC_DINH).forEach(function (k) { p[k] = (o && o[k] !== undefined) ? o[k] : PHONG_MAC_DINH[k]; });
        return ums.api.call(p).then(function (r) {
            return { rows: rows(r), total: Number(r.pager) || rows(r).length };
        });
    };

    /* ---------- Công tơ ---------------------------------------------------- */
    K.congTo = function (loai) {
        return ums.api.call({
            action: (loai === 'nuoc' ? 'KTX_CongToNuoc' : 'KTX_CongToDien') + '/LayDanhSach', method: 'GET',
            strTuKhoa: '', strHangSanXuat_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000
        }).then(rows);
    };

    K.tenPhong = function (r) {
        return (e(r.KTX_TOANHA_TEN) ? e(r.KTX_TOANHA_TEN) + ' - ' : '') + e(r.TEN);
    };

    /* ---------- Ô chọn Toà nhà → Phòng ------------------------------------ */
    K.noiToaNhaPhong = function (selToa, selPhong, o) {
        o = o || {};
        if (!selToa || !selPhong) {
            var khong = Promise.resolve([]);
            return { nap: function () { return khong; }, dat: function () { return khong; }, sanSang: khong, sync: function () {} };
        }
        if (selToa._ktxNoi) return selToa._ktxNoi;           // đã nối rồi (hai màn cùng gọi trên một ô)
        var api = selToa._ktxNoi = {};
        var ten = o.tenPhong || K.tenPhong;
        function doPhong(rs) {
            var f = { name: ten };
            if (o.head !== undefined) f.head = o.head;
            ums.pat.fill(selPhong, rs, f);
            if (o.onPhong) o.onPhong(rs);
            return rs;
        }
        api.nap = function (toaId) {
            if (!toaId && !o.napSan) return Promise.resolve(doPhong([]));
            return K.phong({ strKTX_ToaNha_Id: toaId || '' }).then(function (kq) { return doPhong(kq.rows); })
                .catch(function (err) { ums.api.handle(err, 'danh sách phòng'); return doPhong([]); });
        };
        api.sanSang = K.toaNha().then(function (rs) {
            var f = { name: 'TEN' };
            if (o.headToa !== undefined) f.head = o.headToa;
            ums.pat.fill(selToa, rs, f);
        });
        if (window.jQuery) {
            jQuery(selToa).on('change', function () {
                var id = selToa.value || '';
                api.nap(id).then(function () {
                    if (o.onToaNha) o.onToaNha(id);
                    if (o.onChange) o.onChange();
                });
            });
            jQuery(selPhong).on('change', function () { if (o.onChange) o.onChange(); });
        }
        var ch = ums.pat.chain([selToa, selPhong], { phatLai: false });
        api.sync = ch.sync;
        /* Đặt giá trị bằng mã (mở biểu mẫu sửa): chỉ báo select2 vẽ lại, KHÔNG bắn change → không gọi onChange / onToaNha */
        function datGT(el, v) {
            el.value = e(v);
            if (window.jQuery) jQuery(el).trigger('change.select2');
        }
        api.dat = function (toaId, phongId) {
            return api.sanSang.then(function () {
                datGT(selToa, toaId);
                return api.nap(e(toaId)).then(function () { datGT(selPhong, phongId); ch.sync(); });
            });
        };
        if (o.napSan) api.nap('');
        return api;
    };

    /* ---------- Nhãn tình trạng thiết bị ---------------------------------- */
    K.tinhTrangThietBi = function (r) {
        var t = e(r.TINHTRANGSUDUNG_TEN);
        return r.TINHTRANGSUDUNG_MA === 'KTX.TTTB.01' ? ui.badge(t, 'ok') : ui.badge(t || '—', 'bad');
    };
})();
