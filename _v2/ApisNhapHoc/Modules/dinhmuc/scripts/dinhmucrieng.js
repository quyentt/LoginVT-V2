/* =========================================================================
   Định mức riêng
   Bản gốc: ApisNhapHoc/Modules/dinhmuc/html/dinhmucrieng.html + scripts/dinhmucrieng.js
   Khung chung: dinhmuc/scripts/_chung.js (ums.nhDm) — lời gọi, khác gốc chung ghi ở đó.
   ---------------------------------------------------------------------------
   Riêng màn này:
     · Bảng thêm cột Đối tượng (DOITUONGDAOTAO_TEN), Chương trình đào tạo
       (DAOTAO_TOCHUCCHUONGTRINH_TEN) và hai cột "Số tiền": Chung (SOTIEN_CHUNG) | Riêng (SOTIEN).
     · Biểu mẫu thêm Đối tượng (danh mục QLSV.DOITUONG) và Chương trình; lưu thêm
       strDoiTuongDaoTao_Id, strDAOTAO_TOCHUCCT_Id; iThuTu gửi nguyên chữ (gốc không convertStrToNum),
       không có dThuTu / dTuDongCanDoiSangPhaiNop.
     · Chương trình nạp theo KHÓA của kế hoạch đang chọn trong biểu mẫu:
       edu.system.getList_ChuongTrinhDaoTao → ums.ref.chuongTrinh({ strKhoaDaoTao_Id =
       DAOTAO_KHOADAOTAO_ID của kế hoạch, pageIndex 1, pageSize 10000 }), chữ "TENCHUONGTRINH - MACHUONGTRINH".
       Kế hoạch → Chương trình theo luật cha → con (khoá / xoá trắng).

   Lỗi gốc đã sửa:
     · Mở màn và đổi ô "Khoản thu" gốc lấy GIÁ TRỊ Ô KHOẢN THU làm id kế hoạch khi tìm
       (getValById("dropKhoanThu_Search_DMR") — chép nhầm) → danh sách lọc sai; nay dùng ô kế hoạch
       như định mức chung.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('dinhmucrieng');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, pat = ums.pat, D = ums.nhDm, N = ums.nhKH, e = N.e;
    var chuoi = null;

    function ctTen(r) { return e(r.TENCHUONGTRINH) + (r.MACHUONGTRINH ? ' - ' + e(r.MACHUONGTRINH) : ''); }

    /** Nạp chương trình theo kế hoạch (viewKeHoach gốc) */
    function napCT(F, khId) {
        return F.KH.form._p.then(function (dsKH) {
            var kh = dsKH.filter(function (x) { return String(x.ID) === String(khId); })[0];
            if (!kh) return [];
            return ums.ref.chuongTrinh({ strKhoaDaoTao_Id: kh.DAOTAO_KHOADAOTAO_ID, strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
        });
    }

    D.man(root, {
        rieng: true,
        title: 'Định mức riêng',
        formTitle: 'định mức riêng',
        icon: 'fa-sliders',
        cot: [
            { title: 'Đối tượng', prop: 'DOITUONGDAOTAO_TEN' },
            { title: 'Chương trình đào tạo', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' }
        ],
        cotTien: [
            { title: 'Chung', group: ['Số tiền'], cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN_CHUNG || 0); } },
            { title: 'Riêng', group: ['Số tiền'], cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.SOTIEN || 0); } }
        ],
        fields: [
            { type: 'gap' },
            { key: 'strDoiTuongDaoTao_Id', col: 'DOITUONGDAOTAO_ID', label: 'Đối tượng', type: 'select',
              placeholder: 'Chọn đối tượng đào tạo', source: { dm: 'QLSV.DOITUONG' } },
            { key: 'strDAOTAO_TOCHUCCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select',
              placeholder: 'Chọn chương trình đào tạo' }
        ],
        luu: function (v) {
            return {
                iThuTu: v.iThuTu,
                strMoTa: v.strMoTa,
                dThuocTinhTuyChon: v.dThuocTinhTuyChon,
                strDoiTuongDaoTao_Id: v.strDoiTuongDaoTao_Id,
                strDAOTAO_TOCHUCCT_Id: v.strDAOTAO_TOCHUCCT_Id
            };
        },
        sauGan: function (crud, F) {
            var khEl = N.o(crud, 'strTAICHINH_KeHoach_Id'), ctEl = N.o(crud, 'strDAOTAO_TOCHUCCT_Id');
            jQuery(khEl).on('select2:select select2:clear', function () {
                var kh = khEl.value;
                pat.fill(ctEl, [], { head: 'Chọn chương trình đào tạo' });
                if (!kh) return;
                napCT(F, kh).then(function (rs) { pat.fill(ctEl, rs, { name: ctTen, head: 'Chọn chương trình đào tạo' }); })
                    .catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
            });
            chuoi = pat.chain([khEl, ctEl], { phatLai: false });
        },
        onForm: function (row, c, F) {
            var khEl = N.o(c, 'strTAICHINH_KeHoach_Id'), ctEl = N.o(c, 'strDAOTAO_TOCHUCCT_Id');
            pat.fill(ctEl, [], { head: 'Chọn chương trình đào tạo' });
            chuoi.sync();
            var kh = khEl.value;
            if (!kh) return;
            napCT(F, kh).then(function (rs) {
                pat.fill(ctEl, rs, { name: ctTen, head: 'Chọn chương trình đào tạo' });
                if (row) N.dat(ctEl, row.DAOTAO_TOCHUCCHUONGTRINH_ID, row.DAOTAO_TOCHUCCHUONGTRINH_TEN);
                chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, 'chương trình đào tạo'); });
        }
    });
})();
