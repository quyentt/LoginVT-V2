/* =========================================================================
   Kế hoạch xử lý học vụ — vùng "Thiết lập điều kiện" (#zonedieukien của gốc)
   Bản gốc: ApisXuLyHocVu/Modules/kehoachxuly/script/kehoachxuly.js
       getList_DieuKien · getList_DieuKienApDung · kethua_DieuKien
       save_DieuKien · delete_DieuKien · save_DieuKienApDung · delete_DieuKienApDung
       getList_KeThuaNhom · save_KeThuaNhom  + hộp #myModalDieuKien, #myModalKeThuaNhom
   ---------------------------------------------------------------------------
   ums.khxl.taoDieuKien(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên — hai danh sách GET gửi kèm tham số type=GET như gốc):
     XLHV_DieuKienXuLy_AD/LayDanhSach                     bảng 1 (điều kiện xét chính)
     XLHV_DieuKienXuLy_AD/LayDSXLHV_DieuKienXuLy_Phu_AD   bảng 2 (điều kiện phụ)
         strTuKhoa '' · strDaoTao_ThoiGianDaoTao_Id '' · strPhamViApDung_Id = ID kế hoạch
         · strLoaiXuLy_Id '' · strMucXuLy_Id '' · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000
     XLHV_ThongTin/KeThuaDieuKienChuanApDung               POST strXLHV_KeHoach_Id
     XLHV_DieuKienXuLy_AD/Sua_XLHV_DieuKienXuLy_DK_AD      POST strId · strXauDieuKien   (bảng 1)
     XLHV_DieuKienXuLy_AD/Sua_XLHV_DieuKienXL_Phu_DK_AD    POST strId · strXauDieuKien   (bảng 2)
     XLHV_DieuKienXuLy_AD/Xoa                              strIds                        (bảng 1)
     XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_Phu_AD     strIds                        (bảng 2)
     XLHV_ThongTin_MH/… pkg_xulyhocvu_thongtin.LayDSXLHV_PhamVi_ApDung   strLoaiXuLy_Id = ID KẾ HOẠCH (tên
                                                          tham số gốc như vậy) — hộp "Kế thừa theo nhóm"
     XLHV_ThongTin_MH/… pkg_xulyhocvu_thongtin.KeThua_DieuKienXuLy_Ad    strPhamViNguon_Id (mỗi dòng chọn)
                                                          · strPhamViDich_Id = ID kế hoạch
   Cột: LOAIXULY_TEN · MUCXULY_TEN · DAOTAO_THOIGIANDAOTAO_KY · XAUDIEUKIEN · hộp kế thừa: TEN · MOTA.

   Khác gốc:
     · Nút "Lưu" ở chân vùng (#btnSave_KeHoachXuLy thứ hai — trùng id, jQuery chỉ gắn xử lý cho nút
       ĐẦU TIÊN trong trang nên nút này không làm gì) → giữ nút, đặt disabled.
     · Cột cuối hai bảng tiêu đề gốc ghi "Xóa" nhưng nút là "Sửa" (mở hộp xâu điều kiện) → tiêu đề "Sửa".
     · Hộp xâu điều kiện (#myModalDieuKien) → biểu mẫu NGAY TRONG TRANG, thay chỗ khung "Thiết lập điều kiện"
       (BO-CUC luật 1 — ums.pat.formTrang, host = zone). Tiêu đề gốc "Hệ số tăng thêm" (chép nhầm từ màn
       khác) → "Sửa xâu điều kiện". Nút Xóa gốc ẩn tới khi lưu một kế hoạch trong phiên (lớp .btnOpenDelete)
       — ở đây luôn hiện; gốc xoá không hỏi lại → nay hỏi lại. Lưu thành công thì đóng biểu mẫu (gốc để hộp mở).
     · Hộp kế thừa theo nhóm: tiêu đề gốc "Danh sách học phần" (chép nhầm — danh sách là phạm vi áp dụng)
       → "Kế thừa theo nhóm". Gốc đóng hộp rồi hỏi lại; ở đây hỏi lại, đồng ý mới đóng hộp và chạy.
     · "Kế thừa mặc định từ điều kiện chuẩn" khi kế hoạch chưa có sinh viên áp dụng (SOLUONG = 0): máy chủ trả "Du lieu khong
       hop le" → màn chặn trước và nói rõ phải thêm sinh viên (kiểm host 01/10).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var K = ums.khxl = ums.khxl || {};
    var e = K.e;

    K.taoDieuKien = function (zone, o) {
        o = o || {};
        var DK = 'XLHV_DieuKienXuLy_AD/';
        var khId = '', khSo = -1, ds1 = [], ds2 = [];

        zone.innerHTML =
            pat.panel({
                title: 'Thiết lập điều kiện', icon: 'fa-sliders', count: 'kh',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('search', { text: 'Kế thừa mặc định từ điều kiện chuẩn', mod: 'out-primary', icon: 'fa-paper-plane', attr: { 'data-a': 'kethua' } }) +
                    ui.btn('search', { text: 'Kế thừa theo nhóm', mod: 'out-primary', icon: 'fa-link-slash', attr: { 'data-a': 'kethua-nhom' } }) +
                    '<button type="button" class="ums-btn ums-btn--save" disabled title="Bản gốc không có xử lý cho nút này"><i class="fa-light fa-floppy-disk"></i><span>Lưu</span></button>',
                body: '<div class="ums-legend">1. Bảng điều kiện áp dụng xét chính cho các mức xử lý</div>' +
                    '<div data-z="t1"></div>' +
                    '<div class="ums-legend ums-legend--cach">2. Bảng điều kiện phụ áp dụng cho các mức trung gian làm kết quả cho việc xét chính thức(vd: Mức cảnh báo tại kỳ đang xét,…)</div>' +
                    '<div data-z="t2"></div>'
            });

        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }

        function cot(bang) {
            return [
                { title: 'Loại xử lý', prop: 'LOAIXULY_TEN' },
                { title: 'Mức xử lý', prop: 'MUCXULY_TEN' },
                { title: 'Thời gian áp dụng', prop: 'DAOTAO_THOIGIANDAOTAO_KY', cls: 'is-center' },
                { title: 'Điều kiện áp dụng', prop: 'XAUDIEUKIEN' },
                { title: 'Sửa', cls: 'is-center is-actions', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-a="sua" data-bang="' + bang + '" data-id="' + esc(r.ID) +
                        '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>';
                } }
            ];
        }
        function tai(bang) {
            var host = z('t' + bang);
            K.dang(host);
            return ums.api.call({
                action: DK + (bang === 1 ? 'LayDanhSach' : 'LayDSXLHV_DieuKienXuLy_Phu_AD'), method: 'GET', type: 'GET',
                strTuKhoa: '', strChucNang_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strPhamViApDung_Id: khId,
                strLoaiXuLy_Id: '', strMucXuLy_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                var rows = K.ds(r);
                if (bang === 1) ds1 = rows; else ds2 = rows;
                ui.table({ el: host, rows: rows, columns: cot(bang), empty: 'Chưa có điều kiện' });
            }).catch(function (err) { K.loi(host, err, bang === 1 ? 'điều kiện xét chính' : 'điều kiện phụ'); });
        }
        function taiCa() { tai(1); tai(2); }

        /* ---------- Kế thừa mặc định từ điều kiện chuẩn -------------------- */
        /* Kế hoạch chưa có sinh viên áp dụng thì máy chủ trả "Du lieu khong hop le" (kiểm host 01/10: cùng kế hoạch, thêm một
           sinh viên là kế thừa được) → màn chặn trước bằng cột SOLUONG của dòng kế hoạch và nói rõ phải làm gì. */
        var CAN_SV = 'Kế hoạch chưa có sinh viên áp dụng — bấm Sửa kế hoạch → "Thêm thành viên" trước, rồi mới kế thừa điều kiện chuẩn';
        function keThua() {
            if (khSo === 0) { ui.toast(CAN_SV, 'warn'); return; }
            ui.confirm('Bạn có chắc chắn kế thừa dữ liệu không?', { ok: 'Kế thừa', title: 'Kế thừa điều kiện' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'XLHV_ThongTin/KeThuaDieuKienChuanApDung', method: 'POST', type: 'POST',
                    strXLHV_KeHoach_Id: khId, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Thực hiện thành công!', 'ok'); })
                    .catch(function (err) {
                        if (/khong hop le/i.test(err && err.message || '')) { err.goc = err.message; err.message = CAN_SV; }
                        ums.api.handle(err, 'kế thừa điều kiện chuẩn');
                    })
                    .then(taiCa);                                   // gốc nạp lại cả khi lỗi
            });
        }

        /* ---------- Kế thừa theo nhóm -------------------------------------- */
        function keThuaNhom() {
            var rows = [];
            var dlg = ui.dialog({
                title: 'Kế thừa theo nhóm', icon: 'fa-link-slash', size: 'lg', body: '<div data-z="ktn"></div>',
                buttons: [{ text: 'Kế thừa theo nhóm', kind: 'save', icon: 'fa-floppy-disk', onClick: function () {
                    var ids = K.daChon(dlg.body, 'ktn');
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                    ui.confirm('Bạn có muốn kế thừa không?', { ok: 'Kế thừa', title: 'Kế thừa theo nhóm' }).then(function (yes) {
                        if (!yes) return;
                        dlg.close();
                        ui.batch(ids.map(function (id) {
                            return { action: K.TT + 'CiQVKTQgHgUoJDQKKCQvGTQNOB4AJQPP', func: K.P + 'KeThua_DieuKienXuLy_Ad',
                                strPhamViNguon_Id: id, strPhamViDich_Id: khId, strNguoiThucHien_Id: '' };
                        }), { title: 'Đang kế thừa', okText: 'Thực hiện thành công', show: true }).then(taiCa);
                    });
                    return false;
                } }]
            });
            var host = dlg.body.querySelector('[data-z="ktn"]');
            K.ganChon(host);
            K.dang(host);
            ums.api.call({ action: K.TT + 'DSA4BRIZDQkXHhEpICwXKB4AMQU0LyYP', func: K.P + 'LayDSXLHV_PhamVi_ApDung',
                strNguoiThucHien_Id: '', strLoaiXuLy_Id: khId })
                .then(function (r) {
                    rows = K.ds(r);
                    ui.table({ el: host, rows: rows, empty: 'Không có dữ liệu', columns: [
                        { title: 'Tên', prop: 'TEN' },
                        { title: 'Mô tả', prop: 'MOTA' },
                        K.cotChon('ktn')
                    ] });
                }).catch(function (err) { K.loi(host, err, 'danh sách kế thừa theo nhóm'); });
        }

        /* ---------- Sửa xâu điều kiện — biểu mẫu trong trang (tầng hai của khung điều kiện) ---------- */
        function suaDieuKien(bang, id) {
            var d = K.tim(bang === 1 ? ds1 : ds2, id);
            if (!d) return;
            var dlg = pat.formTrang({
                host: zone, title: 'Sửa xâu điều kiện',
                body: '<div class="ums-kv"><span>Loại xử lý</span><b>' + esc(e(d.LOAIXULY_TEN)) + '</b></div>' +
                    '<div class="ums-kv"><span>Mức xử lý</span><b>' + esc(e(d.MUCXULY_TEN)) + '</b></div>' +
                    '<div style="grid-column:1 / -1">' +
                    ui.field('Xâu điều kiện', '<textarea class="ums-textarea" data-k="xau" rows="16" spellcheck="false"></textarea>') + '</div>',
                buttons: [
                    { text: 'Xóa', kind: 'del', onClick: function () {
                        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                            if (!yes) return;
                            ums.api.call(bang === 1
                                ? { action: DK + 'Xoa', strIds: id, strNguoiThucHien_Id: '' }
                                : { action: DK + 'Xoa_XLHV_DieuKienXuLy_Phu_AD', strIds: id, strNguoiThucHien_Id: '' })
                                .then(function () { ui.toast('Xóa thành công!', 'ok'); dlg.close(); tai(bang); })
                                .catch(function (err) { ums.api.handle(err, 'xoá điều kiện'); });
                        });
                        return false;
                    } },
                    { text: 'Lưu', kind: 'save', onClick: function () {
                        ums.api.call({
                            action: DK + (bang === 1 ? 'Sua_XLHV_DieuKienXuLy_DK_AD' : 'Sua_XLHV_DieuKienXL_Phu_DK_AD'), method: 'POST', type: 'POST',
                            strId: id, strChucNang_Id: '', strXauDieuKien: dlg.body.querySelector('[data-k="xau"]').value, strNguoiThucHien_Id: ''
                        }).then(function () { ui.toast('Cập nhật thành công!', 'ok'); dlg.close(); tai(bang); })
                          .catch(function (err) { ums.api.handle(err, 'lưu điều kiện'); });
                        return false;
                    } }
                ]
            });
            dlg.body.querySelector('[data-k="xau"]').value = e(d.XAUDIEUKIEN);
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'kethua': keThua(); break;
                case 'kethua-nhom': keThuaNhom(); break;
                case 'sua': suaDieuKien(Number(b.getAttribute('data-bang')), b.getAttribute('data-id')); break;
            }
        });

        return {
            mo: function (kh) {
                if (zone._umsFormTrang) zone._umsFormTrang.close();     // biểu mẫu sửa của kế hoạch trước còn mở thì đóng
                khId = kh.ID;
                khSo = kh.SOLUONG === undefined || kh.SOLUONG === null || kh.SOLUONG === '' ? -1 : Number(kh.SOLUONG);   // -1 = không rõ → không chặn
                z('kh').textContent = e(kh.MA) ? '— ' + e(kh.MA) : '';
                taiCa();
            }
        };
    };
})();
