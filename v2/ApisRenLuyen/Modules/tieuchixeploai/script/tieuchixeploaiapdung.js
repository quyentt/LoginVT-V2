/* =========================================================================
   Tiêu chuẩn xếp loại áp dụng
   Bản gốc: ApisRenLuyen/Modules/tieuchixeploai/html/tieuchixeploaiapdung.html
            + script/tieuchixeploaiapdung.js
   Khung chung "áp dụng": ../../khaibaoheso/script/_apdung.js (ums.rlApDung).
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func — chép nguyên):
     RL_TieuChuanXepLoai_AD/LayDanhSach       GET  danh sách, phân trang máy chủ
     RL_TieuChuanXepLoai_AD/LayDSTieuChuanXepLoaiChuaDung  GET  ô "Danh mục tiêu chuẩn chung"
     RL_TieuChuanXepLoai_AD/ThemMoi | CapNhat lưu (CapNhat khi có strId)
     RL_TieuChuanXepLoai_AD/Xoa               xoá — MỖI dòng một lời gọi (strIds = một id) như gốc
     RL_TieuChuanXepLoai_AD/KeThua            nút "Kế thừa"
     RL_TieuChuanXepLoai_AD/Xoa_DRL_TieuChuanXepLoai_AD_PV   nút "Xóa toàn bộ"
     RL_TieuChiDanhGia/LayDanhSach            GET  ô "Tiêu chí" (lọc + biểu mẫu), nạp một lần
   Danh mục: DRL.DOITUONGAPDUNG, QLSV.HINHTHUCKYLUAT, DRL.XEPLOAI.
   Ô đọc dropAAAA của gốc (strXepLoai_Id, strNguoiTao_Id của danh sách) gửi rỗng.

   Giữ như gốc:
     · Sửa: khoá Đối tượng, Năm học, Thời gian, Hệ, Khoá, Xếp loại (hiddenElement readonlyselect2).
     · Ô lọc "Tiêu chí" KHÔNG gửi vào danh sách — chỉ đặt sẵn ô Tiêu chí khi Thêm mới.
     · Không có xoá từng dòng / xoá trong biểu mẫu (nút Xoá trong hộp của gốc để ẩn):
       chỉ xoá các dòng đánh dấu.
   Khác gốc (lỗi gốc đã sửa):
     · Nút "Tìm kiếm" / Enter ở ô từ khoá gọi hàm KHÔNG tồn tại (getList_TieuChiXepLoai)
       → gốc không tìm được; nay tìm đúng danh sách.
     · Thêm mới đặt sẵn Đối tượng theo ô lọc (gốc đọc nhầm id "dropSeacrch_DoiTuong" → luôn trống).
     · Sửa: tiêu chuẩn chung của dòng (PHANCAPAPDUNG_ID) không có trong danh sách "chưa
       dùng" → thêm mục đó vào ô để CapNhat không gửi rỗng strPhanCapApDung_Id.
     · Chọn tiêu chuẩn chung: đổ các ô của nó như gốc, nhưng CHỈ đè bốn ô phạm vi khi
       dòng danh mục có giá trị (gốc đè cả khi rỗng → xoá mất khoá / thời gian đang chọn).
     · "Danh mục tiêu chuẩn chung" nạp lại mỗi lần mở biểu mẫu theo phạm vi đang lọc
       (gốc nạp một lần lúc mở màn, ô lọc còn trống).
     · "Kế thừa" / "Xóa toàn bộ" gửi đối tượng của Ô LỌC (gốc đọc ô trong hộp thoại).
     · Xoá nhiều dòng: đợi xoá xong mới nạp lại (gốc nạp lại sau số-dòng × 50 ms).
     · Đổi ô lọc là tải lại ngay. Lưu xong đóng biểu mẫu.
   ========================================================================= */
(function () {
    'use strict';

    var A = ums.rlApDung;
    var root = document.getElementById('rl-tieuchixeploaiapdung');
    if (!root) return;

    var dsChung = [];
    var loc = null, pv = null;

    // Ô "Tiêu chí" — dùng chung cho ô lọc và ô biểu mẫu (crud nạp một lần)
    var TIEUCHI = {
        call: {
            action: 'RL_TieuChiDanhGia/LayDanhSach',
            method: 'GET',
            strTuKhoa: '',
            strChucNang_Id: '',
            strDRL_TieuChiDanhGia_Cha_id: '',
            strNguoiTao_Id: '',
            strNhomTieuChi_Id: '',
            strDoiTuongApDung_Id: '',
            pageIndex: 1,
            pageSize: 100000
        },
        id: 'ID', name: 'TEN'
    };

    var crud = ums.crud({
        root: root,
        title: 'Tiêu chí xếp loại áp dụng',
        formTitle: 'tiêu chuẩn xếp loại áp dụng',
        listTitle: 'Danh sách tiêu chí',
        icon: 'fa-ranking-star',
        filters: A.locDefs([
            { key: 'tc', type: 'select', label: 'Chọn tiêu chí', source: TIEUCHI },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ]),
        toolbar: A.toanBo({
            loc: function () { return loc; },
            keThua: 'RL_TieuChuanXepLoai_AD/KeThua',
            xoa: 'RL_TieuChuanXepLoai_AD/Xoa_DRL_TieuChuanXepLoai_AD_PV'
        }),
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'RL_TieuChuanXepLoai_AD/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: f.q,
                    strChucNang_Id: '',
                    strXepLoai_Id: '',
                    strDoiTuongApDung_Id: f.dt,
                    strPhamViApDung_Id: f.khoa,
                    strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(f.nam, f.tg),
                    strNguoiTao_Id: ''
                };
            }
        },
        columns: [
            { title: 'Mức thấp nhất', prop: 'DIEMCANDUOI', cls: 'is-center' },
            { title: 'Mức cao nhất', prop: 'DIEMCANTREN', cls: 'is-center' },
            { title: 'Hình thức kỷ luật cao nhất được phép', prop: 'MUCKYLUATCAONHAT_TEN' },
            { title: 'Xếp loại', prop: 'XEPLOAI_TEN' },
            { title: 'Quy đổi điểm', prop: 'DIEMQUYDOI', cls: 'is-center' }
        ],
        rowDelete: false,
        formDelete: false,
        fields: [
            { key: 'strPhanCapApDung_Id', label: 'Danh mục tiêu chuẩn chung', type: 'select', placeholder: 'Chọn danh mục tiêu chuẩn chung', span: true },
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONGAPDUNG_ID', label: 'Đối tượng', type: 'select', source: { dm: 'DRL.DOITUONGAPDUNG' }, readonlyEdit: true }
        ].concat(A.pvFields({ khoaKhiSua: true })).concat([
            { key: 'strDRL_TieuChiDanhGia_Id', col: 'DRL_TIEUCHIDANHGIA_ID', label: 'Tiêu chí', type: 'select', source: TIEUCHI, placeholder: 'Chọn tiêu chí', span: true },
            { key: 'dDiemCanDuoi', col: 'DIEMCANDUOI', label: 'Mức thấp nhất' },
            { key: 'dDiemCanTren', col: 'DIEMCANTREN', label: 'Mức cao nhất' },
            { key: 'strMucKyLuatCaoNhat_Id', col: 'MUCKYLUATCAONHAT_ID', label: 'Kỷ luật cao nhất', type: 'select', source: { dm: 'QLSV.HINHTHUCKYLUAT' } },
            { key: 'strXepLoai_Id', col: 'XEPLOAI_ID', label: 'Xếp loại', type: 'select', source: { dm: 'DRL.XEPLOAI' }, readonlyEdit: true },
            { key: 'dDiemQuyDoi', col: 'DIEMQUYDOI', label: 'Điểm quy đổi' },
            { key: 'strGhiChu', col: 'GHICHU', label: 'Ghi chú', type: 'textarea', span: true }
        ]),
        onForm: function (row) {
            if (!row) {
                A.dat(fe('strDoiTuongApDung_Id'), loc.v('dt'));
                A.dat(fe('strDRL_TieuChiDanhGia_Id'), loc.v('tc'));
            }
            pv.set(A.giaTriPV(row, loc));
            napChung(row);
        },
        save: function (v, row) {
            return {
                action: row ? 'RL_TieuChuanXepLoai_AD/CapNhat' : 'RL_TieuChuanXepLoai_AD/ThemMoi',
                strId: row ? row.ID : '',
                strChucNang_Id: '',
                strPhamViApDung_Id: v.strPhamViApDung_Id,
                strPhanCapApDung_Id: v.strPhanCapApDung_Id,
                strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(v._nam, v._tg),
                strMucKyLuatCaoNhat_Id: v.strMucKyLuatCaoNhat_Id,
                dDiemCanTren: v.dDiemCanTren,
                dDiemCanDuoi: v.dDiemCanDuoi,
                strXepLoai_Id: v.strXepLoai_Id,
                strDoiTuongApDung_Id: v.strDoiTuongApDung_Id,
                dDiemQuyDoi: v.dDiemQuyDoi,
                strDRL_TieuChiDanhGia_Id: v.strDRL_TieuChiDanhGia_Id,
                strGhiChu: v.strGhiChu,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: 'RL_TieuChuanXepLoai_AD/Xoa', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
            });
        }
    });

    var fe = A.crudEl(crud, 'form');
    loc = A.boLoc(A.crudEl(crud, 'filter'));
    pv = A.phamViForm(fe);

    /* ---------- "Danh mục tiêu chuẩn chung" (chưa dùng cho phạm vi) -------- */
    function napChung(row) {
        var el = fe('strPhanCapApDung_Id');
        ums.pat.fill(el, [], { head: 'Đang tải…' });
        return ums.api.call({
            action: 'RL_TieuChuanXepLoai_AD/LayDSTieuChuanXepLoaiChuaDung',
            method: 'GET',
            strDoiTuongApDung_Id: loc.v('dt'),
            strPhamViApDung_Id: loc.v('khoa'),
            strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(loc.v('nam'), loc.v('tg'))
        }).then(function (r) {
            dsChung = Array.isArray(r.data) ? r.data : [];
            ums.pat.fill(el, dsChung, { name: 'DRL_TIEUCHIDANHGIA_TEN', head: 'Chọn danh mục tiêu chuẩn chung' });
            if (row) A.themMuc(el, row.PHANCAPAPDUNG_ID, 'Tiêu chuẩn đang áp dụng');
            A.dat(el, row ? row.PHANCAPAPDUNG_ID : '');
        }).catch(function (err) {
            ums.pat.fill(el, [], { head: 'Chọn danh mục tiêu chuẩn chung' });
            ums.api.handle(err, 'danh mục tiêu chuẩn chung');
        });
    }

    // Chọn tiêu chuẩn chung → đổ các ô của nó (viewForm_TieuChiXepLoaiApDung của gốc)
    jQuery(fe('strPhanCapApDung_Id')).on('select2:select', function () {
        var id = this.value;
        var d = dsChung.filter(function (x) { return String(x.ID) === id; })[0];
        if (!d) return;
        function g(k) { return d[k] == null ? '' : d[k]; }
        fe('dDiemCanTren').value = g('DIEMCANTREN');
        fe('dDiemCanDuoi').value = g('DIEMCANDUOI');
        fe('dDiemQuyDoi').value = g('DIEMQUYDOI');
        fe('strGhiChu').value = g('GHICHU');
        A.dat(fe('strXepLoai_Id'), g('XEPLOAI_ID'));
        A.dat(fe('strDoiTuongApDung_Id'), g('DOITUONGAPDUNG_ID'));
        A.dat(fe('strDRL_TieuChiDanhGia_Id'), g('DRL_TIEUCHIDANHGIA_ID'));
        A.dat(fe('strMucKyLuatCaoNhat_Id'), g('MUCKYLUATCAONHAT_ID'));
        // Phạm vi: chỉ đè khi danh mục có giá trị
        if (g('PHAMVIAPDUNG_ID')) pv.set(A.giaTriPV(d, loc));
    });
})();
