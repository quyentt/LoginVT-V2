/* =========================================================================
   ums.nsCauHinh — khung chung của hai màn "Cấu hình hồ sơ" / "Cấu hình hợp đồng"
   Bản gốc: ApisNhanSu/Modules/hoso/script/cauhinhhoso.js + cauhinhhopdong.js — hai
   tệp chép nhau từng dòng, chỉ khác controller, tên tham số id cha và vài ô:
       cauhinhhoso     NS_MauHoSo          + NS_HoSoMoRong      (strNhanSu_MauHoSo_Id,    NHANSU.HOSO.TRUONGTHONGTIN)
       cauhinhhopdong  NS_DanhMucHoatDong  + NS_HoatDong_MoRong (strHoatDongNhanSu_Id,    NHANSU.TRUONGTHONGTIN)
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh tìm + bảng "Danh sách" (Thêm mới, Xóa đã chọn, Sửa, Chi tiết);
   bấm "Chi tiết" thì khung "Cấu hình thông tin" THAY CHỖ danh sách (zone-bus zoneEdit
   ↔ zonebatdau của gốc) — bảng trường thông tin sửa trong ô: Trường thông tin, Mô tả,
   Thứ tự, Độ rộng, Bắt buộc; "Thêm dòng mới", Xóa từng dòng, Lưu.
   Biểu mẫu chính: gốc là hộp thoại Bootstrap — ở đây biểu mẫu thay chỗ danh sách
   (BO-CUC luật 1). Sửa lấy dòng từ danh sách (gốc không có LayChiTiet).

       ums.nsCauHinh.man(root, {
           tieuDe, formTitle, ctl: 'NS_MauHoSo', ctlTT: 'NS_HoSoMoRong', xoaTT: 'NS_HoSoMoRong/Xoa',
           thamSoCha: 'strNhanSu_MauHoSo_Id', dmTT: 'NHANSU.HOSO.TRUONGTHONGTIN',
           columns: [...], fields: [...], them(v) → tham số riêng thêm vào lời gọi lưu
       })

   Khác gốc (lỗi rõ ràng, làm theo ý định):
     · Tìm kiếm: gốc đọc ô txtAAAA (không có) nên strTuKhoa luôn rỗng, và Enter nghe
       #txtSearch_TuKhoa (sai id) → ở đây gửi đúng ô từ khoá, Enter / nút Tìm kiếm đều chạy.
     · Lưu "Cấu hình thông tin" lần hai: gốc không nạp lại nên dòng vừa thêm vẫn mang id
       tạm → bấm Lưu lần nữa là THÊM TRÙNG. Ở đây lưu xong nạp lại bảng.
     · Xóa một trường đã lưu (hợp đồng): gốc vẽ lại bảng bằng data.Data của lời gọi xoá
       (rỗng) → mất hết dòng trên màn. Ở đây chỉ bỏ đúng dòng đã xoá.
   Giữ như gốc: strMoTa gửi rỗng (ô txtAAAA); lưu từng dòng không báo gì, dòng chưa chọn
   trường thông tin thì bỏ qua; "Bắt buộc", "Độ rộng", "Thứ tự" là ô chữ tự do.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return ums.state.chucNangId || ''; }
    function esc(s) { return ui.esc(s); }

    function man(root, o) {
        root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
        var zDs = root.querySelector('[data-z="ds"]'), zCt = root.querySelector('[data-z="ct"]');
        var cha = null, luoi = null;

        var crud = ums.crud({
            root: zDs,
            title: o.tieuDe,
            listTitle: 'Danh sách',
            formTitle: o.formTitle,
            icon: 'fa-sliders',
            filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
            list: {
                paged: true,
                call: function (f) {
                    return { action: o.ctl + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNguoiThucHien_Id: uid() };
                }
            },
            columns: o.columns,
            rowActions: [{ icon: ui.ICON.view, title: 'Chi tiết', onClick: function (row) { moChiTiet(row); } }],
            rowDelete: false,
            formDelete: false,
            fields: o.fields,
            save: function (v, row) {
                var x = {
                    action: o.ctl + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strChucNang_Id: cn(),
                    strTen: v.strTen || '',
                    strMa: v.strMa || '',
                    strMoTa: '',
                    dHieuLuc: v.dHieuLuc,
                    strNgayApDung: v.strNgayApDung,
                    strNguoiThucHien_Id: uid()
                };
                if (o.them) Object.assign(x, o.them(v));
                return x;
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: o.ctl + '/Xoa', strIds: id, strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }; });
            }
        });

        /* ---------- Cấu hình thông tin (bảng trường thông tin của một mẫu) ---- */
        function moChiTiet(row) {
            cha = row;
            zCt.innerHTML = '<div data-z="luoi"></div>';
            luoi = ums.pat.rows(zCt.querySelector('[data-z="luoi"]'), {
                title: 'Cấu hình thông tin' + (row.TEN || row.HOATDONGNHANSU_TEN ? ' — ' + (row.TEN || row.HOATDONGNHANSU_TEN) : ''),
                icon: 'fa-list-check', minRows: 1,
                tools: ui.btn('close', { attr: { 'data-ch': 'dong' } }) + ui.btn('save', { attr: { 'data-ch': 'luu' } }),
                columns: [
                    { key: 'strTruongThongTin_Id', col: 'TRUONGTHONGTIN_ID', title: 'Trường thông tin', type: 'select', s2: true,
                      source: { dm: o.dmTT }, placeholder: '--- Chọn thông tin--' },
                    { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' },
                    { key: 'iThuTu', col: 'THUTU', title: 'Thứ tự', width: '110px' },
                    { key: 'dDoRong', col: 'DORONG', title: 'Độ rộng', width: '110px' },
                    { key: 'dBatBuoc', col: 'BATBUOC', title: 'Bắt buộc', width: '110px' }
                ],
                list: function (id) {
                    var x = { action: o.ctlTT + '/LayDanhSach', method: 'GET', strTuKhoa: '', strTruongThongTin_Id: '',
                        strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 200000 };
                    x[o.thamSoCha] = id;
                    return x;
                },
                filled: function (v) { return !!v.strTruongThongTin_Id; },
                save: function (v, rec, id) {
                    var x = {
                        action: o.ctlTT + (rec ? '/CapNhat' : '/ThemMoi'),
                        strId: rec ? rec.ID : '',
                        strMoTa: v.strMoTa
                    };
                    x[o.thamSoCha] = id;
                    x.strTruongThongTin_Id = v.strTruongThongTin_Id;
                    x.iThuTu = v.iThuTu;
                    x.dDoRong = v.dDoRong;
                    x.dBatBuoc = v.dBatBuoc;
                    x.strChucNang_Id = cn();
                    x.strNguoiThucHien_Id = uid();
                    return x;
                },
                remove: function (rec) { return { action: o.xoaTT, strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
            });
            luoi.load(row.ID);
            ui.swap(zDs, zCt);
        }
        function dong() { cha = null; luoi = null; ui.swap(zCt, zDs); }

        zCt.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ch]');
            if (!b || !cha) return;
            if (b.getAttribute('data-ch') === 'dong') { dong(); return; }
            if (b.getAttribute('data-ch') === 'luu') {
                b.disabled = true;
                var id = cha.ID;
                luoi.save(id).then(function () {
                    ui.toast('Cập nhật thành công', 'ok');
                    return luoi.load(id);
                }).then(function () { b.disabled = false; }, function () { b.disabled = false; });
            }
        });

        return { crud: crud };
    }

    ums.nsCauHinh = { man: man };
})();
