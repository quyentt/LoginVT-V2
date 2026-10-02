/* =========================================================================
   hinhthucthi — Hình thức thi (và thời gian thi) của từng học phần theo kỳ
   Bản gốc: ApisQuanLyDiem/Modules/congthucdiem/html/hinhthucthi.html + script/hinhthucthi.js
            (html gốc nạp "HinhThucThi.js" viết hoa — tệp thật là hinhthucthi.js)
   ---------------------------------------------------------------------------
   Bố cục như gốc (một cột): thanh lọc → "Danh sách học phần" (bảng học phần × kỳ, mỗi ô là
   "Hình thức - Thời gian thi" + ô đánh dấu) · "Khai hình thức thi mới" thay chỗ danh sách
   (chọn kỳ, hình thức, thời gian thi, Điền tự động, Import; bảng nhập theo học phần).
   Khung dùng chung: _congthuc.js (ums.qldCT.man).
   Lời gọi (chép nguyên):
     Học phần:  KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP · pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan
     Cột kỳ:    D_ThongTin_MH/DSA4BRIqGB4JKC8pFSk0IhUpKB4RKSAsFygJEQPP · pkg_diem_thongtin.LayDSkY_HinhThucThi_PhamViHP (strTuKhoa = txtAAAA → '')
     Một ô:     D_ThongTin_MH/DSA4FRUFKCQsHgkVFQkIHgAFHhEpICwXKAPP · pkg_diem_thongtin.LayTTDiem_HTTHI_AD_PhamVi
                → HINHTHUCTHI_TEN, THOIGIANTHI, THI_HINHTHUCTHI_ID, ID
     Hình thức: D_Chung_MH/DSA4BRIVKSgeCSgvKRUpNCIVKSgP · pkg_diem_chung.LayDSThi_HinhThucThi (ID, TEN)
     Lưu (thêm và sửa ô): D_ThongTin_MH/FSkkLB4FKCQsHgkoLykVKTQiFSkoHgAF · pkg_diem_thongtin.Them_Diem_HinhThucThi_AD
                strDaoTao_ThoiGianDaoTao_Id, strPhamViApDung_Id (= ID học phần), strThi_HinhThucThi_Id, strThoiGianThi
     Xoá:       D_ThongTin_MH/GS4gHgUoJCweCSgvKRUpNCIVKSgeAAUP · pkg_diem_thongtin.Xoa_Diem_HinhThucThi_AD (strIds)
     Import:    IMPORTWITHPROC_HTTHP "Hình thức thi" (nút cố định trong khung Thêm mới)
   Lỗi gốc đã sửa:
     · Ô "Chọn thuộc tính học phần": html đặt id dropSearch_ThuocTinhHinhThucThi nhưng mã nạp danh mục KHCT.TTHP
       vào / đọc giá trị từ dropSearch_ThuocTinhHocPhan (không tồn tại) → ô luôn trống, không bao giờ lọc được.
       Nay nạp KHCT.TTHP và gửi strThuocTinhHocPhan_Id như ý định (cùng tên tham số với bản gốc).
     · Lưu khung Thêm mới: gốc không nạp lại bảng sau khi lưu → nay nạp lại (thấy ngay ô vừa khai).
   Bỏ (mã chết của gốc): getDetail/update/save_HinhThucThi, genHTML_PhanBo, rewrite (ô không tồn tại), #btnRefresh,
   .btnAdd, #btnSave, .btnEdit.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.qldCT;
    var root = document.getElementById('qld-hinhthucthi');
    var e = C.e, esc = ui.esc;
    var HT = [];            // danh sách hình thức thi (dtHinhThuc)
    var sanHT = ums.api.call({ action: 'D_Chung_MH/DSA4BRIVKSgeCSgvKRUpNCIVKSgP', func: 'pkg_diem_chung.LayDSThi_HinhThucThi',
        strNguoiThucHien_Id: C.uid() }).then(function (r) { HT = C.arr(r.data); }).catch(C.loi('hình thức thi'));

    function luuCall(tg, hp, ht, tgt) {
        return { action: 'D_ThongTin_MH/FSkkLB4FKCQsHgkoLykVKTQiFSkoHgAF', func: 'pkg_diem_thongtin.Them_Diem_HinhThucThi_AD',
            iM: C.iM(), strDaoTao_ThoiGianDaoTao_Id: tg, strPhamViApDung_Id: hp, strThi_HinhThucThi_Id: ht,
            strThoiGianThi: tgt, strNguoiThucHien_Id: C.uid() };
    }
    function opts(chon) {
        return '<option value="">Chọn hình thức</option>' + HT.map(function (h) {
            return '<option value="' + esc(e(h.ID)) + '"' + (chon && chon === h.ID ? ' selected' : '') + '>' + esc(e(h.TEN)) + '</option>';
        }).join('');
    }

    C.man(root, {
        tieuDe: 'Hình thức thi',
        nutThem: 'Khai hình thức thi mới',
        formTieuDe: 'Thêm mới - Hình thức thi',
        hocTrinh: 'Số tín chỉ',
        hang: { action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan' },
        cot: { action: 'D_ThongTin_MH/DSA4BRIqGB4JKC8pFSk0IhUpKB4RKSAsFygJEQPP', func: 'pkg_diem_thongtin.LayDSkY_HinhThucThi_PhamViHP' },
        o: { action: 'D_ThongTin_MH/DSA4FRUFKCQsHgkVFQkIHgAFHhEpICwXKAPP', func: 'pkg_diem_thongtin.LayTTDiem_HTTHI_AD_PhamVi',
            hien: function (r) { return e(r.HINHTHUCTHI_TEN) + (e(r.THOIGIANTHI) !== '' ? ' - ' + e(r.THOIGIANTHI) : ''); } },
        xoa: { action: 'D_ThongTin_MH/GS4gHgUoJCweCSgvKRUpNCIVKSgeAAUP', func: 'pkg_diem_thongtin.Xoa_Diem_HinhThucThi_AD' },
        import: { ten: 'Hình thức thi', ma: 'IMPORTWITHPROC_HTTHP' },
        form: {
            html: function () {
                return '<div class="ums-field"><select class="ums-select" data-g="ht" data-ph="Chọn hình thức"><option value=""></option></select></div>' +
                    '<div class="ums-field"><input class="ums-input" data-g="tgt" placeholder="Thời gian thi" autocomplete="off"></div>';
            },
            init: function (g) {
                sanHT.then(function () { pat.fill(g('ht'), HT, { head: 'Chọn hình thức' }); });
            },
            cot: [
                { title: 'Hình thức thi', width: '220px', render: function (row) {
                    return '<select class="ums-select ums-input--sm" data-ht="' + esc(row.ID) + '">' + opts('') + '</select>'; } },
                { title: 'Thời gian thi', width: '160px', render: function (row) {
                    return '<input class="ums-input ums-input--sm" data-tgt="' + esc(row.ID) + '" autocomplete="off">'; } }
            ],
            /* btnDienTuDong: MỌI dòng nhận hình thức + thời gian thi đang chọn ở trên (như gốc) */
            dien: function (g, bang) {
                var ht = pat.val(g('ht')), tgt = g('tgt').value;
                Array.prototype.forEach.call(bang.querySelectorAll('select[data-ht]'), function (s) { s.value = ht; });
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-tgt]'), function (i) { i.value = tgt; });
            },
            /* btnSaveHinhThucThi: dòng đã đánh dấu VÀ đã chọn hình thức */
            luu: function (tr, row, tg) {
                var ht = tr.querySelector('select[data-ht]').value;
                if (!ht) return null;
                return luuCall(tg, row.ID, ht, tr.querySelector('input[data-tgt]').value);
            }
        },
        /* .btnCTHinhThucThi → #myModal_SuaCT → save_SuaCT — biểu mẫu trong trang, thay chỗ cả màn (BO-CUC luật 1) */
        sua: function (rec, hp, tg, xong, host) {
            sanHT.then(function () {
                var d = pat.formTrang({
                    host: host, title: 'Sửa hình thức thi', icon: 'fa-pen-to-square',
                    body: ui.field('Hình thức thi', '<select class="ums-select" data-d="ht" data-ph="Chọn hình thức">' + opts(rec ? e(rec.THI_HINHTHUCTHI_ID) : '') + '</select>') +
                        ui.field('Thời gian thi', '<input class="ums-input" data-d="tgt" autocomplete="off" value="' + esc(rec ? e(rec.THOIGIANTHI) : '') + '">'),
                    buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dlg) {
                        var ht = pat.val(dlg.body.querySelector('[data-d="ht"]'));
                        ums.api.call(luuCall(tg, hp, ht, dlg.body.querySelector('[data-d="tgt"]').value))
                            .then(function () { dlg.close(); ui.toast('Thực hiện thành công', 'ok'); xong(); })
                            .catch(C.loi('lưu hình thức thi'));
                        return false;
                    } }]
                });
            });
        }
    });
})();
