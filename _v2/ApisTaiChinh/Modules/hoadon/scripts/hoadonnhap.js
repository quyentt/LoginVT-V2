/* =========================================================================
   Hoá đơn nháp
   Bản gốc: ApisTaiChinh/Modules/hoadon/scripts/hoadonnhap.js (HoaDonNhap)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     TC_HoaDonNhap/LayDanhSach   GET  strTuKhoa '' (bản gốc đọc #txtAAAA — ô không tồn tại),
                                      strQLSV_NguoiHoc_Id '', dDaXuatChinhThuc 0, pageIndex, pageSize 24
     Xem bản nháp: nhúng  objApi["HDDT"] bỏ mọi chữ "api" + "\" + DUONGDANFILEHOADON
                   (bản gốc không ghép host — giữ nguyên)
     Xuất hoá đơn (PHANLOAI = 'CHUATHU'):
       TC_HoaDonNhap_ChuaThu/LayDanhSach GET strTaiChinh_HoaDonNhap_Id
       → TC_DaNop/ThemMoi  POST (thu tiền; Message trả về = danh sách id đã nộp)
       → HDDT_HoaDon/ThemMoi POST cùng payload, strTaiChinh_CacKhoanThu_Ids = Message
       → thành công: TC_HoaDonNhap/CapNhat POST strId, dDaXuatChinhThuc 1
                     + lấy hoá đơn vừa sinh (TC_HoaDon/LayTTHoaDonThu_Rut: mở tệp HĐĐT nếu có)
     Huỷ bản nháp: TC_HoaDonNhap/Xoa POST strIds

   PAYLOAD TC_DaNop/ThemMoi — lấy NGUYÊN từ các dòng máy chủ trả, KHÔNG tính lại:
     strTaiChinh_CacKhoanThu_Ids = TAICHINH_CACKHOANTHU_ID, strTaiChinh_SoTien_s = SOTIEN,
     strDonGia_s = DONGIA, strSoLuong_s = SOLUONG, strDonViTinh_Ids = DONVITINH_ID,
     strDonViTinhTen_s = DONVITINH_TEN, strLoaiTienTe_Ids = LOAITIENTE_ID (nối ","),
     strTaiChinh_NoiDung_s = NOIDUNG (nối "#"); còn lại lấy từ dòng đầu.

   GIỮ NGUYÊN DÙ NGHI LÀ LỖI (ghi để kiểm lại với nghiệp vụ):
     · `if (strPhuongThuc_MA.indexOf("DOITUONGKHAC"))` — indexOf trả -1 (truthy) khi KHÔNG có
       chữ đó. Hệ quả: MOTA không chứa "DOITUONGKHAC" cũng bị cắt tới "$" (không có "$" →
       strPhuongThuc_MA = "") và strLoaiDoiTuong = "DOITUONGKHAC", bTenNguoiThu = true.
       Chỉ khi MOTA BẮT ĐẦU bằng "DOITUONGKHAC" mới giữ nguyên. Giữ đúng hành vi này.
   CỐ Ý BỎ (bản gốc lỗi)
     · Xuất hoá đơn nháp PHANLOAI khác 'CHUATHU' (đã thu): bản gốc gọi saveHDDT() KHÔNG truyền
       tham số, bên trong `obj_save.action = …` trên undefined → TypeError, chưa bao giờ phát
       hành được. Không chép — nút báo rõ là chưa hỗ trợ.
     · Ô tìm kiếm: bản gốc gửi strTuKhoa từ #txtAAAA (không tồn tại) nên từ khoá bị bỏ qua →
       thay bằng nút Tải lại, không giả vờ lọc.
     · Phân trang bản gốc gọi main_doc.HeThongHoaDon.getList_HDN() (sai tên đối tượng) → hỏng;
       ở đây phân trang chạy đúng (chỉ đọc).
     · Popover, in (không có nút In trong HTML gốc), liên hoá đơn.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, H = ums.hoadon;
    var root = document.getElementById('hoadonnhap');
    var st = { page: 1, size: 24, total: 0, data: [], soId: '' };

    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Hoá đơn nháp</h1><div class="ums-page__actions"></div></div>' +
        '<div data-x="list"><div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-receipt"></i> Danh sách hoá đơn nháp <span class="ums-u-faint ums-u-fz13" data-x="count"></span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) +
              '<button type="button" class="ums-iconbtn" data-a="reload" title="Tải lại"><i class="fa-light fa-rotate-right"></i></button></div></div>' +
            '<div data-x="cards"></div></div></div>' +
        '<div data-x="xem" hidden><div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-file-pen"></i> <span data-x="xemTitle">Bản nháp</span></div>' +
            '<div class="ums-panel__tools">' +
              '<button type="button" class="ums-btn ums-btn--danger" data-a="huy"><i class="fa-light fa-trash-can"></i><span>Hủy bản nháp</span></button>' +
              '<button type="button" class="ums-btn ums-btn--primary" data-a="xuat"><i class="fa-light fa-file-invoice"></i><span>Xuất hóa đơn</span></button>' +
                          '</div></div><div class="ums-panel__body"><div data-x="phieu"></div></div></div></div>';

    function x(n) { return root.querySelector('[data-x="' + n + '"]'); }

    /* ---------- Danh sách ------------------------------------------------ */
    function load(page) {
        if (page) st.page = page;
        x('cards').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_HoaDonNhap/LayDanhSach', method: 'GET',
            strTuKhoa: '', strQLSV_NguoiHoc_Id: '', dDaXuatChinhThuc: 0, strNguoiThucHien_Id: '',
            pageIndex: st.page, pageSize: st.size
        }).then(function (r) {
            st.data = H.rows(r);
            st.total = Number(r.pager) || 0;
            draw();
        }).catch(function (e) {
            x('cards').innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'nạp hoá đơn nháp');
        });
    }

    function draw() {
        var d = st.total ? st.data : [];
        x('count').textContent = st.total ? '(' + st.total + ')' : '';
        ums.pat.cards({
            el: x('cards'), items: d, empty: 'Không tìm thấy dữ liệu', tone: function () { return 'info'; },
            render: function (r) {
                return '<span class="ums-card__no">' + esc(((r.QLSV_NGUOIHOC_HODEM || '') + ' ' + (r.QLSV_NGUOIHOC_TEN || '')).trim()) + '</span>' +
                    ums.pat.cardRow('Tổng tiền', ui.money(r.SOTIEN)) +
                    ums.pat.cardRow('Người tạo', r.NGUOITA_TENDAYDU) +       // tên cột "NGUOITA_" đúng như bản gốc
                    ums.pat.cardRow('Ngày tạo', r.NGAYTAO_DD_MM_YYYY) +
                    (r.PHANLOAI ? ums.pat.cardRow('Phân loại', r.PHANLOAI === 'CHUATHU' ? 'Chưa thu' : r.PHANLOAI) : '');
            },
            page: {
                index: st.page, size: st.size, total: st.total, onChange: load,
                onSize: function (v) { st.size = v; load(1); }
            },
            onPick: function (r) { xem(r.ID); }
        });
    }

    /* ---------- Xem bản nháp -------------------------------------------- */
    function nhapUrl(r) {
        return String((ums.session.api && ums.session.api.HDDT) || '').replace(/api/g, '') + '\\' + r.DUONGDANFILEHOADON;
    }

    function xem(id) {
        var r = st.data.find(function (z) { return String(z.ID) === String(id); });
        if (!r) return;
        st.soId = id;
        x('xemTitle').textContent = 'Bản nháp — ' + ((r.QLSV_NGUOIHOC_HODEM || '') + ' ' + (r.QLSV_NGUOIHOC_TEN || '')).trim();
        x('phieu').innerHTML = '<iframe class="hd-iframe" src="' + esc(nhapUrl(r)) + '"></iframe>';
        ui.swap(x('list'), x('xem'));
    }

    function dong() {
        x('phieu').innerHTML = '';
        if (!x('xem').hidden) ui.swap(x('xem'), x('list'));
    }

    /* ---------- Xuất hoá đơn -------------------------------------------- */
    function xuat() {
        var json = st.data.find(function (z) { return String(z.ID) === String(st.soId); });
        if (!json) return;
        if (json.PHANLOAI !== 'CHUATHU') {
            return ui.toast('Bản nháp loại "đã thu" chưa xuất được: chương trình gốc lỗi ở bước này (saveHDDT gọi thiếu tham số). Cần sửa nghiệp vụ trước.', 'warn', { timeout: 9000 });
        }
        ums.api.call({
            action: 'TC_HoaDonNhap_ChuaThu/LayDanhSach', method: 'GET',
            strTaiChinh_HoaDonNhap_Id: st.soId, strNguoiThucHien_Id: ''
        }).then(function (r) {
            var rows = H.rows(r);
            if (!rows.length) { ui.toast('Bản nháp không có khoản nào', 'warn'); return; }
            return guiThuTien(payload(rows, json.MOTA));
        }).catch(function (e) { ums.api.handle(e, 'xuất hoá đơn nháp'); });
    }

    function join(rows, k, sep) { return rows.map(function (d) { return d[k]; }).join(sep || ','); }

    /** saveHDDT(data, strPhuongThuc_MA) của bản gốc — dựng obj_save */
    function payload(data, phuongThuc) {
        var ma = phuongThuc === null || phuongThuc === undefined ? '' : String(phuongThuc);
        var loaiDoiTuong = '';
        if (ma.indexOf('DOITUONGKHAC')) {          // GIỮ NGUYÊN: -1 cũng là "đúng" — xem đầu tệp
            ma = ma.substring(0, ma.indexOf('$'));
            loaiDoiTuong = 'DOITUONGKHAC';
        }
        var noiDung = data.map(function (d) { return '#' + d.NOIDUNG; }).join('');
        if (noiDung !== '') noiDung = noiDung.substring(1);
        var d0 = data[0];
        var o = {
            action: 'TC_DaNop/ThemMoi',
            versionAPI: 'v1.0',
            strNguoiThucHien_Id: '',
            strTaiChinh_CacKhoanThu_Ids: join(data, 'TAICHINH_CACKHOANTHU_ID'),
            strTaiChinh_SoTien_s: join(data, 'SOTIEN'),
            strTaiChinh_NoiDung_s: noiDung,
            strDonGia_s: join(data, 'DONGIA'),
            strSoLuong_s: join(data, 'SOLUONG'),
            strDonViTinh_Ids: join(data, 'DONVITINH_ID'),
            strDonViTinhTen_s: join(data, 'DONVITINH_TEN'),
            strLoaiTienTe_Ids: join(data, 'LOAITIENTE_ID'),
            strCanDoiKhoanPhaiNop: '',
            strLoaiTienTe: d0.LOAITIENTE_MA,
            strQLSV_NguoiHoc_Id: d0.QLSV_NGUOIHOC_ID,
            strDaoTao_ThoiGianDaoTao_Id: d0.DAOTAO_THOIGIANDAOTAO_ID,
            strDaoTao_ToChucCT_Id: '',
            strHinhThucThu_Id: d0.HINHTHUCTHU_ID,
            strHinhThucThu_MA: d0.HINHTHUCTHU_MA,
            strHinhThucThu_TEN: d0.HINHTHUCTHU_TEN,
            strXuatHoaDonTrucTiep: '',
            strNguonDuLieu_Id: '',
            dKhongSinhChungTu: 0,
            strPhieuThuTheoPhoiSan_Id: '',
            strPhuongThuc_MA: ma,
            strLoaiDoiTuong: loaiDoiTuong,
            strNhap_HoTenNguoiMuaHang: d0.NHAP_HOTENNGUOIMUAHANG,
            bTenNguoiThu: true
        };
        if (loaiDoiTuong !== 'DOITUONGKHAC') o.bTenNguoiThu = false;
        return o;
    }

    function guiThuTien(o) {
        return ums.api.call(o).then(function (r) {
            o.strTaiChinh_CacKhoanThu_Ids = r.message;        // id các khoản vừa nộp
            var h = {};
            Object.keys(o).forEach(function (k) { h[k] = o[k]; });
            h.action = 'HDDT_HoaDon/ThemMoi';
            return ums.api.call(h).then(function (d) {
                capNhatNhap();
                var id = d.raw && d.raw.Id;
                if (id) H.xem(document.createElement('div'), id, 'HOADON').catch(function () {});   // mở tệp HĐĐT như getData_Phieu
                dong();
            }, function (e) {
                ums.api.handle(e, 'phát hành hoá đơn điện tử');
                dong();
            });
        });
    }

    function capNhatNhap() {
        return ums.api.call({
            action: 'TC_HoaDonNhap/CapNhat', versionAPI: 'v1.0',
            strId: st.soId, strQLSV_NguoiHoc_Id: '', strMoTa: '', dDaXuatChinhThuc: 1, strNguoiThucHien_Id: ''
        }).then(function () {
            ui.toast('Xuất hóa đơn thành công', 'ok');
            load();
        }).catch(function (e) { ums.api.handle(e, 'TC_HoaDonNhap/CapNhat'); });
    }

    /* ---------- Huỷ bản nháp -------------------------------------------- */
    function huy() {
        ui.confirm('Bạn có chắc chắn muốn hủy bản nháp không!', { tone: 'bad', ok: 'Hủy bản nháp' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_HoaDonNhap/Xoa', versionAPI: 'v1.0', strIds: st.soId, strNguoiThucHien_Id: '' })
                .then(function () { load(); dong(); ui.toast('Xóa nháp thành công', 'ok'); })
                .catch(function (e) { ums.api.handle(e, 'huỷ bản nháp'); });
        });
    }

    root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]');
        if (!a) return;
        switch (a.getAttribute('data-a')) {
            case 'reload': load(1); break;
            case 'dong': dong(); break;
            case 'xuat': xuat(); break;
            case 'huy': huy(); break;
        }
    });

    root._hd = { st: st, payload: payload };
    load(1);
})();
