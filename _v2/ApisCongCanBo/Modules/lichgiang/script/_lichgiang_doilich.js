/* =========================================================================
   Lịch giảng — yêu cầu đổi lịch (ums.lg.doiLich)
   Bản gốc: lichgiang.js — #modalDoiLich, #modalXemLich, #modalPheDuyet, #tblDoiLich
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên) — controller KHCT_LichGiang_DoiLich:
       LayDSLichGiang_Doi_ThongTinCaNhan (GET)    danh sách của giảng viên (lichgiang)
       LayDSLichGiang_Doi_PhamVi (GET)            danh sách theo phạm vi (lichgiangadmin)
       LayTTLichGiang_Doi (GET)                   xem một yêu cầu
       KhoiTaoThongTinYeuCauDoiLich (GET)         bấm "Yêu cầu đổi lịch" trên một buổi
                                                  → { rsThongTinChung, rsGiangVien, rsDanhMucPhong, rsDanhMucGiangVien }
       KiemTraLichCanDoi (GET) / GuiYeuCauDoiLich (POST)   cùng bộ tham số
       Them_TKB_XacNhanDoiLich (POST)             phê duyệt (quản trị) — trạng thái: danh mục TKB.LICHGIANG.XACNHANDOILICH
       Xoa_LichGiang_Doi_ThongTin (POST)          xoá (giảng viên)
   Giữ như bản gốc: Thứ / giờ / phút "đổi sang" luôn gửi rỗng (màn chỉ đổi ngày, tiết, phòng, giảng viên).
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Kiểm tra lịch không hợp lệ: bản gốc gọi edu.system.returnEmpty (không tồn tại)
       → lỗi JS, không hiện lý do. Ở đây hiện THONGTINLOI.
     · Gửi / xoá xong đóng hộp và nạp lại danh sách (bản gốc để hộp mở).
     · Hộp Phê duyệt: bản gốc đóng hộp trước khi hỏi lại (nút mang data-bs-dismiss).
   Pull 29/9 — khoiTao(buổi, sauKhiGui, o) nhận thêm o (màn Lịch giảng đường đổi lịch vào ô trống);
   không truyền o thì chạy y như trước:
       o.chuanBi(data, buổi) → { ngay, tbd, tkt, phong, dsPhong, tenPhong(p), goiY, canhBao: [chữ], kiem(v) → chữ lỗi | '' }
                               giá trị điền sẵn cho các ô "Đổi sang", danh mục phòng đã lọc, dòng cảnh báo,
                               hàm chặn trước khi Kiểm tra / Gửi (v = { ngay, tbd, tkt, phong })
       o.batBuoc: true         bắt nhập đủ ngày, tiết bắt đầu, tiết kết thúc (bản gốc mới của màn đó)
                               — kéo gốc 1/10: và bắt chọn phòng học mới
       o.thongBao              câu báo khi gửi xong · o.onDong()  gọi khi khung đóng hoặc không mở được
       o.host                  gốc màn → biểu mẫu mở TRONG TRANG thay chỗ lịch (ums.pat.formTrang, BO-CUC luật 1);
                               không truyền thì bật hộp thoại như trước (giữ tương thích)
   Kéo gốc 30/9–1/10 — o.chuanBi có thể trả thêm (không trả thì như trước):
       cb.locPhong(v) → Promise<{ ds?: [phòng], goiY: chữ }>   v = { ngay, tbd, tkt }
                               gọi lúc mở và mỗi khi đổi ngày / tiết (chờ 400 ms cho gõ xong, kết quả lượt cũ bị bỏ):
                               có ds thì ô "Đổi sang" phòng chỉ còn các phòng đó (giữ phòng đang chọn nếu còn), goiY
                               ghi dưới ô phòng — màn Lịch giảng đường hỏi máy chủ phòng TRỐNG ở ngày / tiết mới
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    var C = 'KHCT_LichGiang_DoiLich/';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function oChu(label, v, attr) { return ui.field(label, '<input class="ums-input" ' + (attr || 'disabled') + ' value="' + esc(e(v)) + '" autocomplete="off">'); }
    function gocCua(r) {
        return { strNguoiThucHien_Id: uid(), strIdLichHoc: e(r.IDLICHHOC), strIdHocPhan: e(r.IDHOCPHAN), strIdPhongHoc: e(r.IDPHONGHOC), strIdLopHocPhan: e(r.IDLOPHOCPHAN),
            strNgayHoc: e(r.NGAYHOC), strThu: e(r.THUHOC), strTietBatDau: e(r.TIETBATDAU), strTietKetThuc: e(r.TIETKETTHUC), strGioBatDau: e(r.GIOBATDAU),
            strPhutBatDau: e(r.PHUTBATDAU), strGioKetThuc: e(r.GIOKETTHUC), strPhutKetThuc: e(r.PHUTKETTHUC) };
    }

    var host = null, laAdmin = false, ds = [];
    function danhSach(h, admin) {
        host = h; laAdmin = admin;
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var call = admin
            ? { action: C + 'LayDSLichGiang_Doi_PhamVi', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }
            : { action: C + 'LayDSLichGiang_Doi_ThongTinCaNhan', method: 'GET', strNguoiThucHien_Id: uid() };
        ums.api.call(call).then(function (r) {
            ds = arr(r.data);
            host.innerHTML = ds.length ? '<div class="lg-dl">' + ds.map(function (x, i) {
                return '<button type="button" class="lg-dl__muc" data-dl="' + i + '"><b>Lớp: ' + esc(e(x.LOPHOCPHAN_TEN)) + '</b><span>Trạng thái: ' + esc(e(x.KETQUAXULY)) + '</span></button>';
            }).join('') + '</div>' : ui.empty('Chưa có yêu cầu đổi lịch', 'fa-calendar-pen');
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đổi lịch'); });
    }
    document.addEventListener('click', function (ev) {
        var b = host && ev.target.closest('[data-dl]');
        if (!b || !host.contains(b)) return;
        xem(ds[Number(b.getAttribute('data-dl'))]);
    });
    function reload() { if (host) danhSach(host, laAdmin); }

    /* ---------- Xem một yêu cầu --------------------------------------- */
    /* o.nut = [{ text, kind, mod, disabled, onClick(item, dlg) }] — nút riêng của màn gọi
       (lichgiangdaotao / lichgiangkhoa); không truyền thì nút Phê duyệt / Xóa như lichgiang. */
    function xem(item, o) {
        o = o || {};
        ums.api.call({ action: C + 'LayTTLichGiang_Doi', method: 'GET', strNguoiThucHien_Id: uid(), strId: item.ID }).then(function (r) {
            var d = arr(r.data);
            if (!d.length) { ui.toast('Không có dữ liệu yêu cầu', 'warn'); return; }
            var x = d[0];
            var dlg = ui.dialog({
                title: 'Yêu cầu đổi lịch', icon: 'fa-calendar-pen', size: 'lg',
                body: '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:1 / -1">' + ui.field('Nội dung', '<textarea class="ums-input" rows="3" disabled>' + esc(e(x.NOIDUNG)) + '</textarea>') + '</div>' +
                    '<div style="grid-column:1 / -1">' + oChu('Tên lớp học phần', x.LOPHOCPHAN_TEN) + '</div>' +
                    oChu('Ngày học', x.NGAYHOC) + oChu('Đổi sang', x.NGAYHOC_THAYDOI) +
                    oChu('Tiết bắt đầu', x.TIETBATDAU) + oChu('Đổi sang', x.TIETBATDAU_THAYDOI) +
                    oChu('Tiết kết thúc', x.TIETKETTHUC) + oChu('Đổi sang', x.TIETKETTHUC_THAYDOI) +
                    oChu('Phòng học', x.PHONGHOC_TEN) + oChu('Đổi sang', x.PHONGHOC_THAYDOI_TEN) +
                    '</div><div class="ums-legend ums-legend--cach">Giảng viên</div>' +
                    '<div class="ums-grid ums-grid--2">' + d.map(function (g) { return oChu('Giảng viên', g.GIANGVIEN_HOVATEN) + oChu('Đổi sang', g.GIANGVIEN_THAYDOI_HOVATEN); }).join('') + '</div>',
                buttons: o.nut ? o.nut.map(function (b) {
                    return { text: b.text, kind: b.kind, mod: b.mod, onClick: function () { if (b.onClick && !b.disabled) b.onClick(item, dlg); return false; } };
                }) : [laAdmin
                    ? { text: 'Phê duyệt', kind: 'save', onClick: function () { pheDuyet(item, dlg); return false; } }
                    : { text: 'Xóa', kind: 'del', onClick: function () { xoa(item, dlg); return false; } }]
            });
            (o.nut || []).forEach(function (b, i) {
                var el = dlg.el.querySelector('[data-dlg="' + i + '"]');
                if (b.disabled && el) { el.disabled = true; el.title = b.title || 'Chưa có chức năng'; }
            });
        }).catch(function (err) { ums.api.handle(err, 'xem yêu cầu đổi lịch'); });
    }
    function pheDuyet(item, dlgXem) {
        var dlg = ui.dialog({ title: 'Phê duyệt', icon: 'fa-stamp', size: 'sm',
            body: ui.field('Trạng thái', '<select class="ums-select" data-pd="tt" data-ph="Chọn trạng thái"><option value=""></option></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () {
                var tt = dlg.body.querySelector('[data-pd="tt"]').value;
                if (!tt) { ui.toast('Chọn trạng thái phê duyệt', 'warn'); return false; }
                ui.confirm('Bạn có chắc chắn phê duyệt không?', { title: 'Phê duyệt' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: C + 'Them_TKB_XacNhanDoiLich', method: 'POST', strSanPham_Id: item.ID, strNguoiXacnhan_Id: uid(), strNoiDung: '', strTinhTrang_Id: tt })
                        .then(function () { ui.toast('Phê duyệt thành công', 'ok'); dlg.close(); dlgXem.close(); reload(); });
                }).catch(function (err) { ums.api.handle(err, 'phê duyệt'); });
                return false;
            } }] });
        ui.enhance(dlg.body);
        ums.api.dm('TKB.LICHGIANG.XACNHANDOILICH').then(function (d) { pat.fill(dlg.body.querySelector('[data-pd="tt"]'), d, { name: 'TEN' }); }).catch(function () {});
    }
    function xoa(item, dlgXem) {
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá yêu cầu đổi lịch' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: C + 'Xoa_LichGiang_Doi_ThongTin', method: 'POST', strIds: item.ID, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); dlgXem.close(); reload(); });
        }).catch(function (err) { ums.api.handle(err, 'xoá yêu cầu'); });
    }

    /* ---------- Tạo yêu cầu từ một buổi ------------------------------- */
    function khoiTao(r, sauKhiGui, o) {
        o = o || {};
        var goc = gocCua(r);
        ums.api.call(Object.assign({ action: C + 'KhoiTaoThongTinYeuCauDoiLich', method: 'GET' }, goc)).then(function (x) {
            var d = x.data || {}, tt = arr(d.rsThongTinChung)[0] || {}, dsGV = arr(d.rsGiangVien), phong = arr(d.rsDanhMucPhong), dmGV = arr(d.rsDanhMucGiangVien);
            function tenGV(g) { return e(g.HODEM) + ' ' + e(g.TEN) + ' - ' + e(g.MASO); }
            var cb = o.chuanBi ? (o.chuanBi(d, r) || {}) : null;
            if (cb) {
                tt = Object.assign({}, tt, { NGAYHOC_THAYDOI: e(cb.ngay), TIETBATDAU_THAYDOI: e(cb.tbd), TIETKETTHUC_THAYDOI: e(cb.tkt), IDPHONGHOC_THAYDOI: e(cb.phong) });
                if (cb.dsPhong) phong = cb.dsPhong;
            }
            var dlg = (o.host ? pat.formTrang : ui.dialog)({
                host: o.host, cols: 1, title: 'Yêu cầu đổi lịch', icon: 'fa-calendar-pen', size: 'lg', onClose: o.onDong,
                body: (cb && cb.canhBao && cb.canhBao.length ? '<div class="lg-canhbao"><i class="fa-light fa-triangle-exclamation"></i><div>' + cb.canhBao.map(esc).join('<br>') + '</div></div>' : '') +
                    '<div class="ums-grid ums-grid--2">' +
                    '<div style="grid-column:1 / -1">' + ui.field('Nội dung', '<textarea class="ums-input" rows="3" data-dlf="nd">' + esc(e(tt.NOIDUNG)) + '</textarea>') + '</div>' +
                    '<div style="grid-column:1 / -1">' + oChu('Tên lớp học phần', tt.LOPHOCPHAN_TEN) + '</div>' +
                    oChu('Ngày học', tt.NGAYHOC) + ui.field('Đổi sang', '<div class="ums-inputwrap"><input class="ums-input" data-dlf="ngay" data-date placeholder="dd/mm/yyyy" value="' + esc(e(tt.NGAYHOC_THAYDOI)) + '"><i class="fa-light fa-calendar"></i></div>') +
                    oChu('Tiết bắt đầu', tt.TIETBATDAU) + oChu('Đổi sang', tt.TIETBATDAU_THAYDOI, 'data-dlf="tbd"') +
                    oChu('Tiết kết thúc', tt.TIETKETTHUC) + oChu('Đổi sang', tt.TIETKETTHUC_THAYDOI, 'data-dlf="tkt"') +
                    oChu('Phòng học', tt.PHONGHOC_TEN) + ui.field('Đổi sang', '<select class="ums-select" data-dlf="phong" data-ph="Chọn phòng học"><option value=""></option></select>', cb && cb.goiY ? { hint: cb.goiY } : undefined) +
                    '</div><div class="ums-legend ums-legend--cach">Giảng viên</div>' +
                    '<div class="ums-grid ums-grid--2">' + dsGV.map(function (g, i) {
                        return oChu('Giảng viên', tenGV(g)) + ui.field('Đổi sang', '<select class="ums-select" data-gv="' + i + '" data-ph="Chọn giảng viên"><option value=""></option></select>');
                    }).join('') + '</div>',
                buttons: [
                    { text: 'Kiểm tra lịch trùng', kind: 'search', mod: 'out-primary', onClick: function () { gui(true); return false; } },
                    { text: 'Gửi yêu cầu', kind: 'save', onClick: function () { gui(false); return false; } }
                ]
            });
            var B = dlg.body;
            function q(k) { return B.querySelector('[data-dlf="' + k + '"]'); }
            pat.fill(q('phong'), phong, { name: cb && cb.tenPhong ? cb.tenPhong : 'TENPHONGHOC' }); q('phong').value = e(tt.IDPHONGHOC_THAYDOI);
            dsGV.forEach(function (g, i) { var s = B.querySelector('[data-gv="' + i + '"]'); pat.fill(s, dmGV, { name: tenGV }); s.value = g.ID; });
            ui.enhance(B);
            /* biểu mẫu trong trang đã gắn select2 lúc dựng → báo select2 vẽ lại giá trị vừa đặt */
            if (window.jQuery) jQuery(B).find('select').trigger('change.select2');
            /* Kéo gốc 30/9: đổi ngày / tiết → hỏi lại danh sách phòng (capNhatPhongTrong_DoiLich của gốc) */
            if (cb && cb.locPhong) {
                var hen = null, luot = 0;
                var fieldPhong = q('phong').closest('.ums-field__control'), hint = fieldPhong.querySelector('.ums-field__hint');
                if (!hint) { hint = document.createElement('div'); hint.className = 'ums-field__hint'; fieldPhong.appendChild(hint); }
                var locPhong = function () {
                    var sh = ++luot;
                    hint.textContent = 'Đang tìm phòng trống...';
                    Promise.resolve(cb.locPhong({ ngay: q('ngay').value.trim(), tbd: q('tbd').value.trim(), tkt: q('tkt').value.trim() })).then(function (kq) {
                        if (sh !== luot || !B.isConnected) return;         // đã đổi ngày / tiết khác, hoặc khung đã đóng
                        kq = kq || {};
                        var chon = q('phong').value, con = true;
                        if (kq.ds) {
                            pat.fill(q('phong'), kq.ds, { name: cb.tenPhong ? cb.tenPhong : 'TENPHONGHOC' });
                            con = kq.ds.some(function (p) { return String(p.ID) === String(chon); });
                            q('phong').value = con ? chon : '';
                            if (window.jQuery) jQuery(q('phong')).trigger('change.select2');
                        }
                        hint.textContent = (kq.goiY || '') + (chon && !con ? ' (phòng vừa chọn đã có lịch, chọn phòng khác)' : '');
                    });
                };
                var henLoc = function () { clearTimeout(hen); hen = setTimeout(locPhong, 400); };
                ['ngay', 'tbd', 'tkt'].forEach(function (k) { q(k).addEventListener('change', henLoc); q(k).addEventListener('input', henLoc); });
                locPhong();
            }
            function gui(kiemTra) {
                if (o.batBuoc && (!q('ngay').value.trim() || !q('tbd').value.trim() || !q('tkt').value.trim())) {
                    ui.toast('Nhập đủ ngày học, tiết bắt đầu và tiết kết thúc mới.', 'warn'); return;
                }
                if (o.batBuoc && !q('phong').value) {
                    ui.toast('Chọn phòng học mới' + (cb && cb.locPhong ? ' (danh sách chỉ gồm phòng còn trống ở ngày/tiết đã chọn).' : '.'), 'warn'); return;
                }
                var loi = cb && cb.kiem ? cb.kiem({ ngay: q('ngay').value.trim(), tbd: q('tbd').value.trim(), tkt: q('tkt').value.trim(), phong: q('phong').value }) : '';
                if (loi) { ui.toast(loi, 'warn'); return; }
                var p = Object.assign({}, goc, {
                    strIdHinhThucXep: e(r.IDHINHTHUCXEP), strNoiDung: q('nd').value.trim(), strIdPhongHoc_ThayDoi: q('phong').value,
                    strNgayHoc_ThayDoi: q('ngay').value.trim(), strTietBatDau_ThayDoi: q('tbd').value.trim(), strTietKetThuc_ThayDoi: q('tkt').value.trim(),
                    strThu_ThayDoi: '', strGioBatDau_ThayDoi: '', strPhutBatDau_ThayDoi: '', strGioKetThuc_ThayDoi: '', strPhutKetThuc_ThayDoi: '',
                    strGiangVien_Ids: dsGV.map(function (g) { return g.ID; }).join(','),
                    strGiangVien_ThayDoi_Ids: dsGV.map(function (g, i) { return B.querySelector('[data-gv="' + i + '"]').value; }).join(',')
                });
                if (kiemTra) {
                    ums.api.call(Object.assign({ action: C + 'KiemTraLichCanDoi', method: 'GET' }, p)).then(function (x2) {
                        var k = arr(x2.data)[0];
                        if (!k) ui.toast('Không trả về dữ liệu', 'warn');
                        else if (k.HOPLE && Number(k.HOPLE) !== 0) ui.toast('Dữ liệu kiểm tra hợp lệ', 'ok');
                        else ui.toast(e(k.THONGTINLOI) || 'Lịch cần đổi không hợp lệ', 'bad');
                    }).catch(function (err) { ums.api.handle(err, 'kiểm tra lịch trùng'); });
                    return;
                }
                ums.api.call(Object.assign({ action: C + 'GuiYeuCauDoiLich', method: 'POST' }, p))
                    .then(function () { ui.toast(o.thongBao || 'Gửi yêu cầu thành công', 'ok'); dlg.close(); reload(); if (sauKhiGui) sauKhiGui(); })
                    .catch(function (err) { ums.api.handle(err, 'gửi yêu cầu đổi lịch'); });
            }
        }).catch(function (err) { ums.api.handle(err, 'khởi tạo yêu cầu đổi lịch'); if (o.onDong) o.onDong(); });
    }

    lg.doiLich = { danhSach: danhSach, khoiTao: khoiTao, reload: reload, xem: xem };
})();
