/* =========================================================================
   hocphan — Công thức điểm theo học phần (xâu công thức của từng học phần theo kỳ)
   Bản gốc: ApisQuanLyDiem/Modules/congthucdiem/html/hocphan.html + script/hocphan.js
   ---------------------------------------------------------------------------
   Bố cục như gốc (một cột): thanh lọc (+ "Lọc môn chưa khai công thức") → "Danh sách học phần"
   (bảng học phần × kỳ, mỗi ô là xâu công thức + ô đánh dấu) · "Khai công thức mới" thay chỗ danh
   sách (chọn kỳ, loại điểm, xâu CT, Điền tự động, Import; bảng nhập theo học phần).
   Khung dùng chung: _congthuc.js (ums.qldCT.man).
   Lời gọi (chép nguyên):
     Học phần:  KHCT_ThongTin2_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP · PKG_KEHOACH_THONGTIN2.LayDSKS_DaoTao_HocPhan
                (+ dMonChuaKhaiCongThuc 1/0)
     Cột kỳ:    D_ThongTin_MH/DSA4BRIqGB4CLi8mFSk0IgUoJCweESkgLBcoCREP · pkg_diem_thongtin.LayDSkY_CongThucDiem_PhamViHP
     Một ô:     D_ThongTin_MH/DSA4FRUFKCQsHgIVBR4ABR4RKSAsFygP · pkg_diem_thongtin.LayTTDiem_CTD_AD_PhamVi
                → DIEM_CONGTHUCDIEM_XAU, DIEM_THANHPHANDIEM_ID, ID
     Loại điểm: D_ThongTin_MH/DSA4BRIVKSAvKREpIC8VCgkR · pkg_diem_thongtin.LayDSThanhPhanTKHP (ID, TEN)
     Lưu (thêm và sửa ô): D_ThongTin_MH/FSkkLB4FKCQsHgIuLyYVKTQiBSgkLB4ABQPP · pkg_diem_thongtin.Them_Diem_CongThucDiem_AD
                strMa = strTen = strXauCongThuc = xâu CT, strDiem_ThanhPhanDiem_Id, dThuTu 1, dSoThanhPhanToiThieu 0,
                dTongHopKhiDuDiem 0, strDaoTao_ThoiGianDaoTao_Id, strNgayApDung '' (txtAAAA), strPhanCapApDung_Id '' (dropAAAA),
                strPhamViApDung_Id (= ID học phần), strDiem_CongThucDiem_Id '' (dropAAAA)
                · khung Thêm mới: loại điểm = ô "Chọn loại điểm" · hộp sửa ô: loại điểm = DIEM_THANHPHANDIEM_ID của ô
     Xoá:       D_ThongTin_MH/GS4gHgUoJCweAi4vJhUpNCIFKCQsHgAF · pkg_diem_thongtin.Xoa_Diem_CongThucDiem_AD (strIds)
     Import:    IMPORTWITHPROC_CTDHP "Công thức" (nút cố định trong khung Thêm mới)
   Khác gốc:
     · Hộp sửa: gốc đổ xâu bằng .html() của ô (chữ đã mã hoá HTML: "&lt;" …) → nay đổ đúng giá trị DIEM_CONGTHUCDIEM_XAU.
     · Ô TRỐNG: gốc vẫn mở hộp sửa và gửi strDiem_ThanhPhanDiem_Id rỗng (ghi chú, giữ như gốc) — nghi máy chủ từ chối.
     · Mỗi ô chỉ hiện MỘT công thức (bản ghi cuối cùng máy chủ trả) như gốc, dù học phần × kỳ có thể có nhiều loại điểm.
     · Lưu hàng loạt: gốc nạp lại bảng sau TỪNG lời gọi → nay nạp lại một lần khi xong.
   Bỏ (mã chết của gốc): getDetail/update/save_HocPhan, genHTML_PhanBo, rewrite, #btnRefresh, .btnAdd, #btnSave, .btnEdit,
   khối cuộn ngang thứ hai (đã chú thích ở gốc — bảng mới tự cuộn ngang).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.qldCT;
    var root = document.getElementById('qld-hocphan');
    var e = C.e, esc = ui.esc;

    function luuCall(tg, hp, ct, tp) {
        return { action: 'D_ThongTin_MH/FSkkLB4FKCQsHgIuLyYVKTQiBSgkLB4ABQPP', func: 'pkg_diem_thongtin.Them_Diem_CongThucDiem_AD',
            iM: C.iM(), strMa: ct, strTen: ct, strXauCongThuc: ct, strDiem_ThanhPhanDiem_Id: tp,
            dThuTu: 1, dSoThanhPhanToiThieu: 0, dTongHopKhiDuDiem: 0,
            strDaoTao_ThoiGianDaoTao_Id: tg, strNgayApDung: '', strPhanCapApDung_Id: '',
            strPhamViApDung_Id: hp, strDiem_CongThucDiem_Id: '', strNguoiThucHien_Id: C.uid() };
    }

    C.man(root, {
        tieuDe: 'Công thức theo học phần',
        nutThem: 'Khai công thức mới',
        formTieuDe: 'Thêm mới - Công thức',
        hocTrinh: 'Học trình',
        locChuaKhai: true,
        hang: { action: 'KHCT_ThongTin2_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP', func: 'PKG_KEHOACH_THONGTIN2.LayDSKS_DaoTao_HocPhan' },
        cot: { action: 'D_ThongTin_MH/DSA4BRIqGB4CLi8mFSk0IgUoJCweESkgLBcoCREP', func: 'pkg_diem_thongtin.LayDSkY_CongThucDiem_PhamViHP' },
        o: { action: 'D_ThongTin_MH/DSA4FRUFKCQsHgIVBR4ABR4RKSAsFygP', func: 'pkg_diem_thongtin.LayTTDiem_CTD_AD_PhamVi',
            hien: function (r) { return e(r.DIEM_CONGTHUCDIEM_XAU); } },
        xoa: { action: 'D_ThongTin_MH/GS4gHgUoJCweAi4vJhUpNCIFKCQsHgAF', func: 'pkg_diem_thongtin.Xoa_Diem_CongThucDiem_AD' },
        import: { ten: 'Công thức', ma: 'IMPORTWITHPROC_CTDHP' },
        form: {
            html: function () {
                return '<div class="ums-field"><select class="ums-select" data-g="ld" data-ph="Chọn loại điểm"><option value=""></option></select></div>' +
                    '<div class="ums-field"><input class="ums-input" data-g="ct" placeholder="Xâu CT" autocomplete="off"></div>';
            },
            init: function (g) {
                ums.api.call({ action: 'D_ThongTin_MH/DSA4BRIVKSAvKREpIC8VCgkR', func: 'pkg_diem_thongtin.LayDSThanhPhanTKHP', strNguoiThucHien_Id: C.uid() })
                    .then(function (r) { pat.fill(g('ld'), C.arr(r.data), { head: 'Chọn loại điểm' }); }).catch(C.loi('loại điểm'));
            },
            cot: [
                { title: 'Công thức áp dụng', render: function (row) {
                    return '<input class="ums-input ums-input--sm qldct-xau" data-ct="' + esc(row.ID) + '" autocomplete="off">'; } }
            ],
            /* btnDienTuDong: MỌI dòng nhận xâu CT ở trên (như gốc) */
            dien: function (g, bang) {
                var ct = g('ct').value;
                Array.prototype.forEach.call(bang.querySelectorAll('input[data-ct]'), function (i) { i.value = ct; });
            },
            /* btnSaveHocPhan: dòng đã đánh dấu VÀ có xâu CT */
            luu: function (tr, row, tg, g) {
                var ct = tr.querySelector('input[data-ct]').value;
                if (!ct) return null;
                return luuCall(tg, row.ID, ct, pat.val(g('ld')));
            }
        },
        /* .btnCTHocPhan → #myModal_SuaCT → save_SuaCT — biểu mẫu trong trang, thay chỗ cả màn (BO-CUC luật 1) */
        sua: function (rec, hp, tg, xong, host) {
            pat.formTrang({
                host: host, title: 'Sửa công thức', icon: 'fa-pen-to-square', cols: 1,
                body: ui.field('Xâu công thức', '<textarea class="ums-textarea qldct-sua" data-d="ct" rows="4">' + esc(rec ? e(rec.DIEM_CONGTHUCDIEM_XAU) : '') + '</textarea>'),
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (dlg) {
                    ums.api.call(luuCall(tg, hp, dlg.body.querySelector('[data-d="ct"]').value, rec ? e(rec.DIEM_THANHPHANDIEM_ID) : ''))
                        .then(function () { dlg.close(); ui.toast('Thực hiện thành công', 'ok'); xong(); })
                        .catch(function (err) { ums.api.handle(err, 'lưu công thức'); xong(); });
                    return false;
                } }]
            });
        }
    });
})();
