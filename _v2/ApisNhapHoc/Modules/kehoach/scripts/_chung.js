/* =========================================================================
   Nhập học — tiện ích KẾ HOẠCH NHẬP HỌC dùng chung (ums.nhKH)
   Dùng ở: kehoach/nhaphoc, kehoach/nhansu, dinhmuc/dinhmucchung,
   dinhmuc/dinhmucrieng, quytacsinhma/quytacsinhma.
   Màn ở module khác nạp chéo: <script src="../../kehoach/scripts/_chung.js">.
   ---------------------------------------------------------------------------
   Hai nguồn danh sách kế hoạch mà các tệp gốc dùng (chép nguyên):
     · dsKeHoach() — edu.extend.getList_KeHoachNhapHoc (Corei/systemextend.js:7174)
       và getList_KHNH của nhaphoc.js:
         SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i
         PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc   POST
         strDAOTAO_KhoaDaoTao_Id, strMoHinhNhapHoc_Id, strMoHinhApDungPhieuThu_Id,
         strTAICHINH_HeThongPhieu_Id, strMoHinhApDungPhieuRut_Id,
         strTAICHINH_HeThongRut_Id, strNguoiThucHien_Id — đều "" ; strTuKhoa,
         pageIndex, pageSize (danh sách chọn: 1 / 1000000)
     · theoNguoiDung() — getList_KeHoachNhapHoc_NhanSu chép trong dinhmucchung.js,
       dinhmucrieng.js, quytacsinhma.js (kế hoạch người dùng đang đăng nhập được giao):
         SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP
         PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc   POST   strNguoiThucHien_Id = userId
   Cột: ID, TENKEHOACH, NGAYBATDAU, NGAYKETTHUC, DAOTAO_KHOADAOTAO_TEN, DAOTAO_KHOADAOTAO_ID.

   Ô "Kế hoạch nhập học" trong biểu mẫu: gốc là ô chữ CHỈ ĐỌC + nút "Tìm kiếm" mở
   hộp liệt kê chính danh sách kế hoạch đã nạp (ô tìm trong hộp không có xử lý).
   Bản mới là ô chọn có ô gõ tìm (select2) trên cùng danh sách, chữ hiện y như
   ô chữ gốc: "<tên> (<bắt đầu> - <kết thúc>) <khóa>" — xem ten().
   ========================================================================= */
(function () {
    'use strict';

    if (window.ums.nhKH) return;
    var ums = window.ums;

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    /** Lời gọi danh sách kế hoạch (getList_KHNH / edu.extend.getList_KeHoachNhapHoc) */
    function callDs(tuKhoa) {
        return {
            action: 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i',
            func: 'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc',
            strDAOTAO_KhoaDaoTao_Id: '',
            strMoHinhNhapHoc_Id: '',
            strMoHinhApDungPhieuThu_Id: '',
            strTAICHINH_HeThongPhieu_Id: '',
            strMoHinhApDungPhieuRut_Id: '',
            strTAICHINH_HeThongRut_Id: '',
            strNguoiThucHien_Id: '',
            strTuKhoa: e(tuKhoa)
        };
    }

    /** Nguồn ô chọn: mọi kế hoạch nhập học (pageSize 1000000 như systemextend) */
    function dsKeHoach(name) {
        var c = callDs('');
        c.pageIndex = 1;
        c.pageSize = 1000000;
        return { call: c, id: 'ID', name: name || 'TENKEHOACH' };
    }

    /** Nguồn ô chọn: kế hoạch của người dùng đang đăng nhập */
    function theoNguoiDung(name) {
        return {
            call: {
                action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
                func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
                strNguoiThucHien_Id: uid()
            },
            id: 'ID', name: name || 'TENKEHOACH'
        };
    }

    /** Hai nguồn (ô lọc / ô biểu mẫu) khác chữ hiển thị nhưng CHUNG một lời gọi — gốc nạp một lần */
    function capNguon(tao) {
        var loc = tao('TENKEHOACH');
        var form = tao(ten);
        form._p = ums.crud.loadSource(loc);
        return { loc: loc, form: form };
    }

    /** Chữ của kế hoạch như ô txtKeHoach_* gốc: tên (thời gian) khóa */
    function ten(r) {
        return e(r.TENKEHOACH) + ' (' + e(r.NGAYBATDAU) + ' - ' + e(r.NGAYKETTHUC) + ') ' + e(r.DAOTAO_KHOADAOTAO_TEN);
    }

    /** strTAICHINH_KeHoach_Id khi tìm: chọn kế hoạch thì theo kế hoạch, không thì theo người dùng (gốc) */
    function timKiem(v) { return v || uid(); }

    /** Ô biểu mẫu của một crud theo khoá */
    function o(crud, key) {
        return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + key + '"]');
    }

    /** Đặt giá trị ô chọn; mục không có trong danh sách (kế hoạch của người khác) thì thêm vào với tên máy chủ trả */
    function dat(el, id, tenHien) {
        if (!el) return;
        id = e(id);
        if (id && !Array.prototype.some.call(el.options, function (x) { return x.value === id; })) {
            var op = document.createElement('option');
            op.value = id;
            op.textContent = tenHien || id;
            el.appendChild(op);
        }
        el.value = id;
        if (window.jQuery) jQuery(el).trigger('change.select2');
    }

    /** Dòng dữ liệu của một kết quả ums.api.call */
    function ds(r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; }

    ums.nhKH = {
        callDs: callDs,
        dsKeHoach: dsKeHoach,
        theoNguoiDung: theoNguoiDung,
        capNguon: capNguon,
        ten: ten,
        timKiem: timKiem,
        o: o,
        dat: dat,
        ds: ds,
        e: e,
        uid: uid
    };
})();
