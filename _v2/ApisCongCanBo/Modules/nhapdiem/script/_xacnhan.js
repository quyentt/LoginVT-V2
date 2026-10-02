/* =========================================================================
   nhapdiem — hai hộp xác nhận dùng chung cho các màn nhập điểm
   (nhapdiem, nhapdiemdst, nhapdiemchamkiemtra, nhapdiemphuckhao, tuibai):

   ums.nd.xacNhan({ loai, tieuDe, chuDe, id, ids, onDone })
       "Xác nhận" / "Công bố" — bản gốc loadBtnXacNhan + getList_XacNhanSanPham + getList_XacNhan
       + save_XacNhanSanPham (chép y hệt ở cả năm màn). Lời gọi (kiểu cũ):
         D_HanhDongXacNhan/LayDanhSach (GET: strLoaiXacNhan_Id, strDiem_DanhSachHoc_Id = id) → ô Trạng thái (tự chọn khi 1 mục)
         D_XacNhan/LayDSDiem_XacNhan (GET: strTuKhoa '', strDuLieuXacNhan = id, strLoaiXacNhan_Id, strNguoiXacNhan_Id '',
             strHanhDong_Id '', pageIndex 1, pageSize 100000) → bảng lịch sử TEN / NGUOIXACNHAN_TENDAYDU / NGAYTAO_DD_MM_YYYY
         D_XacNhan/Them_Diem_XacNhan (POST, mỗi id trong ids một lời gọi): strDiem_DanhSachHoc_Id = strDuLieuXacNhan = id,
             strHanhDong_Id, strLoaiXacNhan_Id, strThongTinXacNhan '' (bản gốc đọc ô ghi chú KHÔNG có trong html), strNguoiXacNhan_Id
       Khác gốc: tiêu đề hộp ghép đúng chữ ("Xác nhận — Hoàn thành nhập điểm", gốc dính liền chữ); bắt chọn Trạng thái;
       lưu xong nạp lại lịch sử (onDone do màn nạp lại dữ liệu).

   ums.nd.trangThai(id, loai) → Promise<chuỗi>  — nhãn tình trạng một dòng (data[0].TEN của LayDSDiem_XacNhan)
   Mảnh rời (cho hộp tự dựng, vd "Xác nhận từng phách" của tuibai):
       ums.nd.hanhDong(loai, id) → Promise<dòng>   ums.nd.lichSu(id, loai) → Promise<dòng>
       ums.nd.luuXacNhan(ids, hanhDong, loai) → Promise (ui.batch)
   o.idHanhDong: id gửi cho D_HanhDongXacNhan (mặc định = o.id; tuibai theo túi / theo phách gửi '' như gốc).

   ums.nd.viPham({ kieu: 'Truoc' | 'Sau', ds, khoa(x, dauDiem), dauDiem: () => Promise<rows>, onDone })
       "Vi phạm điều kiện thi" — TP_Chung/LayTrangThai{Truoc|Sau}Thi (GET strNguoiDung_Id) → ô Trạng thái;
       TP_XacNhan{Truoc|Sau}Thi/ThemMoi (POST, mỗi dòng một lời gọi): strSanPham_Id = khoa(x, đầu điểm)
       (ghép chuỗi không dấu cách — như gốc), strNguoiXacnhan_Id (chữ n THƯỜNG như gốc), strNoiDung '', strTinhTrang_Id.
       Bản Truoc (màn nhapdiem) thêm ô "Loại điểm" (dauDiem). Bảng lịch sử của bản gốc KHÔNG nơi nào nạp → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var nd = ums.nd = ums.nd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function lichSu(id, loai) {
        return ums.api.call({ action: 'D_XacNhan/LayDSDiem_XacNhan', method: 'GET', strTuKhoa: '', strDuLieuXacNhan: id, strLoaiXacNhan_Id: loai,
            strNguoiXacNhan_Id: '', strHanhDong_Id: '', pageIndex: 1, pageSize: 100000, strNguoiThucHien_Id: uid() }).then(function (r) { return arr(r.data); });
    }
    function chonMot(el, d) {
        if (d.length === 1) { el.value = d[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); }
    }

    nd.lichSu = lichSu;
    nd.hanhDong = function (loai, id) {
        return ums.api.call({ action: 'D_HanhDongXacNhan/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strLoaiXacNhan_Id: loai, strNguoiThucHien_Id: uid(), strDiem_DanhSachHoc_Id: id })
            .then(function (r) { return arr(r.data); });
    };
    nd.luuXacNhan = function (ids, tt, loai, noiDung) {
        return ui.batch(ids.map(function (id) {
            return { action: 'D_XacNhan/Them_Diem_XacNhan', method: 'POST', strChucNang_Id: cn(), strNguoiThucHien_Id: uid(), strDiem_DanhSachHoc_Id: id,
                strHanhDong_Id: tt, strLoaiXacNhan_Id: loai, strThongTinXacNhan: noiDung || '', strNguoiXacNhan_Id: uid(), strDuLieuXacNhan: id };
        }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true });
    };
    nd.trangThai = function (id, loai) { return lichSu(id, loai).then(function (d) { return d[0] ? d[0].TEN || '' : ''; }, function () { return ''; }); };

    nd.chonMot = chonMot;
    nd.xacNhan = function (o) {
        var ids = o.ids || [o.id];
        var dlg = ui.dialog({ title: o.tieuDe + (o.chuDe ? ' — ' + o.chuDe : ''), icon: 'fa-check-to-slot', size: 'lg',
            body: (ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + ids.length + ' mục đã chọn.</p>' : '') +
                ui.field('Trạng thái ' + o.tieuDe.toLowerCase(), '<select class="ums-select" data-x="tt" data-ph="Chọn xác nhận"><option value=""></option></select>', { required: true }) +
                '<div class="ums-legend ums-legend--cach">Lịch sử ' + ui.esc(o.tieuDe.toLowerCase()) + '</div><div data-x="ls"></div>',
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                var tt = q('tt').value;
                if (!tt) { ui.toast('Chọn trạng thái xác nhận', 'warn'); return false; }
                nd.luuXacNhan(ids, tt, o.loai).then(function (kq) { if (o.onDone) o.onDone(kq); });
            } }] });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        nd.hanhDong(o.loai, o.idHanhDong !== undefined ? o.idHanhDong : o.id)
            .then(function (d) { pat.fill(q('tt'), d, { head: 'Chọn xác nhận' }); chonMot(q('tt'), d); })
            .catch(function (err) { ums.api.handle(err, 'trạng thái xác nhận'); });
        q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        lichSu(o.id, o.loai).then(function (d) {
            ui.table({ el: q('ls'), rows: d, empty: 'Chưa có lịch sử', columns: [{ title: 'Trạng thái', prop: 'TEN' },
                { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU', width: '200px' }, { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center', width: '120px' }] });
        }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        return dlg;
    };

    /* (+ 2026-09-25, Quản lý điểm) Hộp "Xác nhận" KIỂU NÚT — bản gốc ApisQuanLyDiem (loadBtnXacNhan +
       getList_BtnXacNhanSanPham, #zoneBtnXacNhan): mỗi hành động (D_HanhDongXacNhan/LayDanhSach — KHÔNG gửi
       strDiem_DanhSachHoc_Id) là một nút lớn (biểu tượng THONGTIN1, kiểu THONGTIN2); bấm nút là lưu ngay, kèm ô
       "Nội dung" (strThongTinXacNhan). Màn cổng cán bộ vẫn dùng nd.xacNhan (ô chọn trạng thái) — không đổi.
         o = { tieuDe, chuDe, icon, loai, ids | luu(hanhDongId, noiDung) → Promise | false (false = giữ hộp),
               lichSu: id (bảng lịch sử D_XacNhan/LayDSDiem_XacNhan; undefined = không vẽ khối, '' = khối trống chờ dlg.lichSu(id)),
               lichSuRong: chữ khi khối lịch sử trống, noiDung: false (ẩn ô Nội dung), truoc: HTML trên khối nút,
               onBody(dlg), onDone, size,
               idHanhDong: (+ 2026-09-27, Tuyển sinh) có thì gửi strDiem_DanhSachHoc_Id cho D_HanhDongXacNhan (mặc định không gửi) }
               → dlg (dlg.lichSu(id) nạp lại bảng lịch sử) */
    nd.xacNhanNut = function (o) {
        var tieuDe = o.tieuDe || 'Xác nhận', tLower = tieuDe.toLowerCase();
        var dlg = ui.dialog({ title: tieuDe + (o.chuDe ? ' — ' + o.chuDe : ''), icon: o.icon || 'fa-circle-check', size: o.size || 'lg',
            body: (o.ids && o.ids.length > 1 ? '<p class="ums-u-fz13 ums-u-muted">Áp dụng cho ' + o.ids.length + ' mục đã chọn.</p>' : '') +
                (o.noiDung === false ? '' : ui.field('Nội dung ' + tLower, '<input class="ums-input" data-x="nd" autocomplete="off">')) + (o.truoc || '') +
                '<div class="ums-legend ums-legend--cach">Chọn ' + ui.esc(tLower) + '</div><div class="nd-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                (o.lichSu !== undefined ? '<div class="ums-legend ums-legend--cach">Lịch sử ' + ui.esc(tLower) + '</div><div data-x="ls"></div>' : '') });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        var goiHD = { action: 'D_HanhDongXacNhan/LayDanhSach', method: 'GET', strChucNang_Id: cn(), strLoaiXacNhan_Id: o.loai, strNguoiThucHien_Id: uid() };
        if (o.idHanhDong !== undefined) goiHD.strDiem_DanhSachHoc_Id = o.idHanhDong;   // (+ 2026-09-27) gốc Tuyển sinh gửi id bảng điểm
        ums.api.call(goiHD)
            .then(function (r) {
                var d = arr(r.data);
                q('nut').innerHTML = d.length ? d.map(function (h) {
                    var ic = ums.iconFA4 ? ums.iconFA4(h.THONGTIN1 || 'fa-solid fa-circle-check') : 'fa-solid fa-circle-check';
                    return '<button type="button" class="nd-xn__nut" data-hd="' + ui.esc(h.ID) + '"><i class="' + ui.esc(ic) + '"' +
                        (h.THONGTIN2 ? ' style="' + ui.esc(h.THONGTIN2) + '"' : '') + '></i><span>' + ui.esc(h.TEN == null ? '' : h.TEN) + '</span></button>';
                }).join('') : ui.empty('Chưa khai báo hành động ' + tLower);
            }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'hành động xác nhận'); });
        dlg.lichSu = function (id) {
            if (!q('ls')) return;
            q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            lichSu(id, o.loai).then(function (d) {
                ui.table({ el: q('ls'), rows: d, empty: 'Chưa có lịch sử', columns: [{ title: tieuDe, prop: 'TEN' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU', width: '200px' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center', width: '120px' }] });
            }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        };
        if (o.lichSu) dlg.lichSu(o.lichSu);
        else if (q('ls')) q('ls').innerHTML = ui.empty(o.lichSuRong || 'Chưa có lịch sử');
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var hd = b.getAttribute('data-hd'), noiDung = q('nd') ? (q('nd').value || '').trim() : '';
            var p = o.luu ? o.luu(hd, noiDung, dlg) : nd.luuXacNhan(o.ids || [], hd, o.loai, noiDung);
            if (p === false) return;
            dlg.close();
            Promise.resolve(p).then(function (kq) { if (o.onDone) o.onDone(kq); });
        });
        if (o.onBody) o.onBody(dlg);
        return dlg;
    };

    nd.viPham = function (o) {
        var ds = o.ds || [];
        if (!ds.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return null; }
        var dlg = ui.dialog({ title: 'Vi phạm điều kiện thi', icon: 'fa-pen-field', size: 'md',
            body: '<p class="ums-u-fz13 ums-u-muted">Đã chọn ' + ds.length + ' người học.</p>' +
                (o.dauDiem ? ui.field('Loại điểm', '<select class="ums-select" data-x="dd" data-ph="Chọn đầu điểm"><option value=""></option></select>', { required: true }) : '') +
                ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-ph="Chọn xác nhận"><option value=""></option></select>', { required: true }),
            buttons: [{ text: 'Đồng ý', kind: 'save', onClick: function () {
                var dd = q('dd') ? q('dd').value : '', tt = q('tt').value;
                if ((q('dd') && !dd) || !tt) { ui.toast(!tt ? 'Chọn trạng thái' : 'Chọn loại điểm', 'warn'); return false; }
                ui.batch(ds.map(function (x) {
                    var goi = { action: 'TP_XacNhan' + o.kieu + 'Thi/ThemMoi', method: 'POST', strSanPham_Id: o.khoa(x, dd), strNguoiXacnhan_Id: uid(),
                        strNoiDung: '', strTinhTrang_Id: tt, strNguoiThucHien_Id: uid() };
                    if (o.kieu === 'Sau') goi.strId = '';
                    return goi;
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(function (kq) { if (o.onDone) o.onDone(kq); });
            } }] });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        if (o.dauDiem) o.dauDiem().then(function (d) { pat.fill(q('dd'), d, { head: 'Chọn đầu điểm' }); chonMot(q('dd'), d); }).catch(function (err) { ums.api.handle(err, 'đầu điểm'); });
        ums.api.call({ action: 'TP_Chung/LayTrangThai' + o.kieu + 'Thi', method: 'GET', strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid() })
            .then(function (r) { var d = arr(r.data); pat.fill(q('tt'), d, { head: 'Chọn xác nhận' }); chonMot(q('tt'), d); })
            .catch(function (err) { ums.api.handle(err, 'trạng thái'); });
        return dlg;
    };
})();
