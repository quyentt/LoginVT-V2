/* =========================================================================
   Xếp loại hạ bậc
   Bản gốc: ApisHocBong/Modules/thietlap/html/xeploaihabac.html + script/xeploaihabac.js
   Khung chung: script/_dk.js (ums.hbDk). Màn này thêm hai lưới dòng trong biểu
   mẫu — "Xếp loại hạ bậc" và "Xếp loại giới hạn" (ums.pat.rows), lưu SAU điều
   kiện, gắn vào id điều kiện máy chủ trả.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên; controller TN_* dù nằm ở Học bổng):
     TN_XepLoai_DieuKien/LayDanhSach      GET: strTuKhoa, strPhanLoai_Id, strXepLoai_Id = '',
                                          strNguoiTao_Id = '' (gốc #dropAAAA)
     TN_XepLoai_DieuKien/ThemMoi|CapNhat  POST: strId, strXauDieuKien, strPhanLoai_Id, iThuTu = '', strMoTa
     TN_XepLoai_DieuKien/Xoa              POST strIds
     TN_XepLoai_DieuKien_Ad/LayDanhSach   GET: strTuKhoa, strPhanLoai_Id, strPhamViApDung_Id = '',
                                          strPhanCapApDung_Id, strDaoTao_ThoiGianDaoTao_Id = '', strNguoiTao_Id = ''
     TN_XepLoai_DieuKien_Ad/ThemMoi|CapNhat  + strPhamViApDung_Id, strDaoTao_ThoiGianDaoTao_Id = ''
     TN_XepLoai_DieuKien_Ad/Xoa           POST strIds
     TN_XepLoai_DieuKien_HaBac/…  và  TN_XepLoai_DieuKien_GH/…   (hai lưới, cùng tham số):
         LayDanhSach GET: strTuKhoa, strPhanLoai_Id, strXepLoai_Id = '', strTn_XepLoai_DieuKien_Id,
                          strNguoiTao_Id = '', pageIndex 1, pageSize 10000
         ThemMoi (strId rỗng) | CapNhat POST: strId, strXauDieuKien, strPhanLoai_Id (ô Phân loại
                          của biểu mẫu), strXepLoai_Id, iThuTu = '', strMoTa = '',
                          strTN_XepLoai_DieuKien_Id (id điều kiện chung HOẶC riêng — như gốc)
         Xoa POST strIds
     TN_PhanCapApDung/LayDanhSach         GET strPhanLoai_Id (ô lọc tab 2)
     TN_ThongTin/LayDSTN_KeHoach          GET — ô Kế hoạch (tham số lọc lúc init = rỗng)
     TN_XetDuyet_TuKhoa/LayDanhSach | CapNhat   bảng "Danh sách từ khóa"
   Danh mục: TN.PHANLOAI, VANBANG.XEPLOAI (cột xếp loại của hai lưới), KHCT.LOAILOP.

   Lỗi gốc đã sửa (phần chung: đầu tệp _dk.js):
     · Hai lưới KHÔNG BAO GIỜ hiện dòng đã lưu: mở Sửa không nạp, còn
       getList_HaBac / getList_GioiHan đọc biến toàn cục strPhanCapApDung không
       tồn tại → ReferenceError. Nay nạp khi mở Sửa.
     · Lưu dòng lưới đọc #dropXepLoaiHaBac<id> — không có (ô tên dropXepLoai<id>)
       → xếp loại LUÔN gửi rỗng. Nay gửi ô đang chọn.
     · Gốc lưu MỌI dòng mỗi lần Lưu (kể cả dòng trống mới thêm); nay bỏ dòng mới
       để trống và dòng cũ không đổi.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('hb-xeploaihabac');
    if (!root) return;
    var pat = ums.pat;
    var luoi = {};          // lưới của biểu mẫu đang mở: { hb, gh }

    function e(v) { return v === undefined || v === null ? '' : String(v); }

    function taoLuoi(host, ctl, title, cot, ctx) {
        return pat.rows(host, {
            title: title, icon: 'fa-layer-group',
            columns: [
                { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', title: 'Xâu điều kiện' },
                { key: 'strXepLoai_Id', col: 'XEPLOAI_ID', title: cot, type: 'select', width: '220px',
                  source: { dm: 'VANBANG.XEPLOAI' }, placeholder: 'Chọn xếp loại' }
            ],
            list: function (pid) {
                return {
                    action: ctl + '/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strTn_XepLoai_DieuKien_Id: pid,
                    strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000
                };
            },
            filled: function (v, rec) {
                if (!rec) return !!(v.strXauDieuKien || v.strXepLoai_Id);
                return v.strXauDieuKien !== e(rec.XAUDIEUKIEN) || v.strXepLoai_Id !== e(rec.XEPLOAI_ID);
            },
            save: function (v, rec, pid) {
                return {
                    action: ctl + (rec ? '/CapNhat' : '/ThemMoi'),
                    strId: rec ? rec.ID : '',
                    strXauDieuKien: v.strXauDieuKien,
                    strPhanLoai_Id: ctx.pl,
                    strXepLoai_Id: v.strXepLoai_Id,
                    iThuTu: '', strMoTa: '',
                    strTN_XepLoai_DieuKien_Id: pid
                };
            },
            remove: function (rec) { return { action: ctl + '/Xoa', strIds: rec.ID }; }
        });
    }

    var luuDK = function (v) { return { strXauDieuKien: v.strXauDieuKien, iThuTu: '', strMoTa: v.strMoTa }; };

    ums.hbDk.man(root, {
        tieuDe: 'Xếp loại hạ bậc',
        phanLoai: { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', nhan: 'Phân loại', loc: 'Chọn phân loại', nguon: { dm: 'TN.PHANLOAI' } },
        cotChung: [
            { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-nowrap' },
            { title: 'Mô tả', prop: 'MOTA' }
        ],
        phai: [
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', label: 'Xâu điều kiện', type: 'textarea' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        chung: { ctl: 'TN_XepLoai_DieuKien', ds: { strXepLoai_Id: '', strNguoiTao_Id: '' }, luu: luuDK },
        rieng: { ctl: 'TN_XepLoai_DieuKien_Ad', ds: { strNguoiTao_Id: '' }, luu: luuDK },
        phanCap: 'TN_PhanCapApDung/LayDanhSach',
        keHoach: {
            call: {
                action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET',
                strTuKhoa: '', strPhanLoai_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000
            }
        },
        tuKhoa: 'TN_XetDuyet_TuKhoa',

        onForm: function (kieu, row, crud, host) {
            host.innerHTML = '<div data-hb="hb"></div><div class="ums-u-mt-4" data-hb="gh"></div>';
            var ctx = luoi = { pl: '' };          // mỗi lần mở biểu mẫu một bộ lưới riêng
            ctx.hb = taoLuoi(host.querySelector('[data-hb="hb"]'), 'TN_XepLoai_DieuKien_HaBac', 'Xếp loại hạ bậc', 'Xếp loại hạ bậc', ctx);
            ctx.gh = taoLuoi(host.querySelector('[data-hb="gh"]'), 'TN_XepLoai_DieuKien_GH', 'Xếp loại giới hạn', 'Xếp loại giới hạn', ctx);
            luoi.hb.load(row ? row.ID : '');
            luoi.gh.load(row ? row.ID : '');
        },
        /* Lưu điều kiện xong mới lưu hai lưới (save_GioiHan rồi save_HaBac như gốc) */
        onSaved: function (kieu, crud, id) {
            if (!id || !luoi.hb) return;
            var x = crud.root.querySelector('[data-scope="form"][data-k="strPhanLoai_Id"]');
            luoi.pl = x ? x.value : '';
            // Đọc giá trị hai lưới NGAY (trước khi biểu mẫu đóng); gửi song song như gốc
            luoi.gh.save(id);
            luoi.hb.save(id);
        }
    });
})();
