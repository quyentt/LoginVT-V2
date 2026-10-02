/* =========================================================================
   Tiêu chí điểm áp dụng
   Bản gốc: ApisRenLuyen/Modules/tieuchidiem/html/tieuchidiemapdung.html
            + script/tieuchidiemapdung.js
   Khung chung "áp dụng": ../../khaibaoheso/script/_apdung.js (ums.rlApDung).
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func — chép nguyên):
     RL_TieuChiDanhGia_AD/LayDanhSach        GET  danh sách (pageIndex 1, pageSize 10000)
     RL_TieuChiDanhGia_AD/LayDSTieuChiDanhGiaChuaDung  GET  ô "Tiêu chí chung"
     RL_TieuChiDanhGia_AD/ThemMoi | CapNhat  lưu (CapNhat khi có strId)
     RL_TieuChiDanhGia_AD/KeThua             nút "Kế thừa"
     RL_TieuChiDanhGia_AD/Xoa_DRL_TieuChiDanhGia_AD_PV   nút "Xóa toàn bộ"
   Danh mục: DRL.DOITUONGAPDUNG, DRL.THANGDIEM, DRL.DMTC; năm học, thời gian,
   hệ, khoá qua ums.rlApDung. Ô đọc dropAAAA / txtAAAA của gốc gửi rỗng.

   Giữ như gốc:
     · Tên, Mã tiêu chí, Thang điểm, Nhóm tiêu chí luôn CHỈ ĐỌC (hiddenElement
       readonly lúc init) — lấy từ "Tiêu chí chung"; chọn tiêu chí chung thì đổ
       lại mọi ô của nó (kể cả tiêu chí cha).
     · Không có Xoá từng tiêu chí: nút Xoá trong hộp của gốc để ẩn và gọi hàm
       không tồn tại (delete_TieuChiDiem). Chỉ có "Xóa toàn bộ" của phạm vi.
     · Ô "Tiêu chí cha" = các tiêu chí đang áp dụng trong danh sách.
   Khác gốc:
     · Danh sách vẽ thành BẢNG CÂY (tên thụt lề theo cấp, cột Mã / Mức điểm /
       Thứ tự, nút Sửa) — gốc vẽ cây thành hàng tiêu đề nhiều tầng không có
       thân bảng, bấm chữ tiêu đề để sửa. Dòng mồ côi (cha không trong danh sách)
       gốc bỏ mất, nay hiện ở gốc cây.
     · "Tiêu chí chung" nạp lại mỗi lần mở biểu mẫu theo đối tượng / khoá / thời
       gian ĐANG LỌC (gốc chỉ nạp một lần lúc mở màn, ô lọc còn trống).
     · Sửa: tiêu chí chung của dòng không có trong danh sách "chưa dùng" → thêm
       mục đó vào ô để CapNhat không gửi rỗng strDRL_TieuChiDanhGia_Id (gốc gửi rỗng).
     · Sửa: bốn ô phạm vi lấy từ dòng (PHAMVIAPDUNG_ID, DAOTAO_THOIGIANDAOTAO_NAM_ID /
       _KY_ID như bản xếp loại) nếu có, không thì theo ô lọc (gốc giữ giá trị lần mở trước).
     · "Kế thừa" / "Xóa toàn bộ" gửi đối tượng của Ô LỌC (gốc đọc ô đối tượng
       trong hộp thoại — giá trị của lần mở hộp trước).
     · Đổi ô lọc là tải lại ngay (gốc chờ bấm Tìm kiếm). Lưu xong đóng biểu mẫu.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, A = ums.rlApDung;
    var root = document.getElementById('rl-tieuchidiemapdung');
    if (!root) return;

    var dsApDung = [];          // dòng đang hiện — nguồn ô "Tiêu chí cha"
    var dsChung = [];           // "Tiêu chí chung" chưa dùng
    var loc = null, pv = null;

    var NHAP = { items: [{ ID: '1', TEN: 'Nhập trực tiếp' }, { ID: '0', TEN: 'Không nhập trực tiếp' }] };

    var crud = ums.crud({
        root: root,
        title: 'Tiêu chí điểm áp dụng',
        formTitle: 'tiêu chí điểm áp dụng',
        listTitle: 'Danh sách tiêu chí',
        icon: 'fa-list-tree',
        filters: A.locDefs(),
        toolbar: A.toanBo({
            loc: function () { return loc; },
            keThua: 'RL_TieuChiDanhGia_AD/KeThua',
            xoa: 'RL_TieuChiDanhGia_AD/Xoa_DRL_TieuChiDanhGia_AD_PV'
        }),
        pageSize: ui.PAGE_ALL,
        list: {
            call: function (f) {
                return {
                    action: 'RL_TieuChiDanhGia_AD/LayDanhSach',
                    method: 'GET',
                    strTuKhoa: '',
                    strChucNang_Id: '',
                    strDRL_TieuChiDanhGia_Cha_id: '',
                    strNguoiTao_Id: '',
                    strNhomTieuChi_Id: '',
                    strDoiTuongApDung_Id: f.dt,
                    pageIndex: 1,
                    pageSize: 10000,
                    strPhamViApDung_Id: f.khoa,
                    strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(f.nam, f.tg)
                };
            },
            rows: function (d) {
                dsApDung = Array.isArray(d) ? d : (d && d.rs) || [];
                return A.cay(dsApDung);
            }
        },
        empty: 'Chưa có tiêu chí áp dụng cho phạm vi đang chọn',
        columns: [
            A.cotCay({ title: 'Tên tiêu chí' }),
            { title: 'Mã tiêu chí', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Mức điểm quy định', prop: 'MUCDIEMQUYDINH', cls: 'is-center', width: '150px' },
            { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center', width: '80px' }
        ],
        fields: [
            { key: 'strDRL_TieuChiDanhGia_Id', label: 'Tiêu chí chung', type: 'select', placeholder: 'Chọn danh mục tiêu chí', span: true },
            { key: 'strDRL_TieuChiDanhGia_Cha_Id', label: 'Tiêu chí cha', type: 'select', placeholder: 'Chọn tiêu chí cha', span: true }
        ].concat(A.pvFields()).concat([
            { key: 'iThuTu', col: 'THUTU', label: 'Thứ tự' },
            { key: 'strTen', col: 'TEN', label: 'Tên tiêu chí' },
            { key: 'strMa', col: 'MA', label: 'Mã tiêu chí' },
            { key: 'dMucDiemQuyDinh', col: 'MUCDIEMQUYDINH', label: 'Mức điểm quy định' },
            { key: 'strDoiTuongApDung_Id', col: 'DOITUONGAPDUNG_ID', label: 'Đối tượng áp dụng', type: 'select', source: { dm: 'DRL.DOITUONGAPDUNG' } },
            { key: 'strThangDiem_Id', col: 'THANGDIEM_ID', label: 'Thang điểm', type: 'select', source: { dm: 'DRL.THANGDIEM' } },
            { key: 'strNhomTieuChi_Id', col: 'NHOMTIEUCHI_ID', label: 'Nhóm tiêu chí', type: 'select', source: { dm: 'DRL.DMTC' } },
            { key: 'dNhapTrucTiep', col: 'NHAPTRUCTIEP', label: 'Nhập trực tiếp', type: 'select', source: NHAP, value: '1', required: true }
        ]),
        onForm: function (row) {
            A.dong([fe('strTen'), fe('strMa'), fe('strThangDiem_Id'), fe('strNhomTieuChi_Id')]);
            // Tiêu chí cha = các tiêu chí đang áp dụng (trừ chính nó). Giá trị = id tiêu chí CHUNG của dòng cha — xem chaGoc()
            ums.pat.fill(fe('strDRL_TieuChiDanhGia_Cha_Id'),
                dsApDung.filter(function (x) { return !row || x.ID !== row.ID; }).map(function (x) { return { ID: x.DRL_TIEUCHIDANHGIA_ID || x.ID, TEN: x.TEN }; }),
                { name: 'TEN', head: 'Chọn tiêu chí cha' });
            A.dat(fe('strDRL_TieuChiDanhGia_Cha_Id'), row ? chaGoc(row.DRL_TIEUCHIDANHGIA_CHA_ID) : '');
            if (!row) A.dat(fe('strDoiTuongApDung_Id'), loc.v('dt'));
            pv.set(A.giaTriPV(row, loc));
            napChung(row);
        },
        save: function (v, row) {
            return {
                action: row ? 'RL_TieuChiDanhGia_AD/CapNhat' : 'RL_TieuChiDanhGia_AD/ThemMoi',
                strId: row ? row.ID : '',
                strChucNang_Id: '',
                strDoiTuongApDung_Id: v.strDoiTuongApDung_Id,
                strMa: v.strMa,
                strTen: v.strTen,
                dMucDiemQuyDinh: v.dMucDiemQuyDinh,
                strNhomTieuChi_Id: v.strNhomTieuChi_Id,
                strDRL_TieuChiDanhGia_Cha_Id: v.strDRL_TieuChiDanhGia_Cha_Id,
                iThuTu: v.iThuTu,
                strThangDiem_Id: v.strThangDiem_Id,
                dNhapTrucTiep: v.dNhapTrucTiep,
                strNguoiThucHien_Id: '',
                strDRL_TieuChiDanhGia_Id: v.strDRL_TieuChiDanhGia_Id,
                strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(v._nam, v._tg),
                strPhamViApDung_Id: v.strPhamViApDung_Id,
                strPhanCapApDung_Id: ''
            };
        }
    });

    /* Kiểm host 2026-09-30: máy chủ lưu tiêu chí cha của dòng áp dụng bằng id tiêu chí CHUNG (Kế thừa ghi vậy; màn Nhập điểm tra
       tiêu chí con theo id chung). Ô "Tiêu chí cha" trước đây mang id DÒNG áp dụng (như gốc) → mở Sửa dòng kế thừa thì ô trống,
       Lưu là xoá mất quan hệ cha – con. Nay ô mang id chung; dòng cũ lưu id dòng áp dụng thì đổi sang id chung khi hiện. */
    function chaGoc(id) {
        if (!id) return '';
        var d = dsApDung.filter(function (x) { return x.ID === id; })[0];
        return d && d.DRL_TIEUCHIDANHGIA_ID ? d.DRL_TIEUCHIDANHGIA_ID : id;
    }

    var fe = A.crudEl(crud, 'form');
    loc = A.boLoc(A.crudEl(crud, 'filter'));
    pv = A.phamViForm(fe);

    /* ---------- "Tiêu chí chung" (danh mục chưa dùng cho phạm vi) --------- */
    function napChung(row) {
        var el = fe('strDRL_TieuChiDanhGia_Id');
        ums.pat.fill(el, [], { head: 'Đang tải…' });
        return ums.api.call({
            action: 'RL_TieuChiDanhGia_AD/LayDSTieuChiDanhGiaChuaDung',
            method: 'GET',
            strDoiTuongApDung_Id: loc.v('dt'),
            strPhamViApDung_Id: loc.v('khoa'),
            strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(loc.v('nam'), loc.v('tg'))
        }).then(function (r) {
            dsChung = Array.isArray(r.data) ? r.data : [];
            ums.pat.fill(el, dsChung, { name: 'TEN', head: 'Chọn danh mục tiêu chí' });
            if (row) A.themMuc(el, row.DRL_TIEUCHIDANHGIA_ID, row.TEN);
            A.dat(el, row ? row.DRL_TIEUCHIDANHGIA_ID : '');
        }).catch(function (err) {
            ums.pat.fill(el, [], { head: 'Chọn danh mục tiêu chí' });
            ums.api.handle(err, 'tiêu chí chung');
        });
    }

    // Chọn tiêu chí chung → đổ các ô của nó (viewForm_TieuChiDiemApDung của gốc)
    jQuery(fe('strDRL_TieuChiDanhGia_Id')).on('select2:select', function () {
        var id = this.value;
        var d = dsChung.filter(function (x) { return String(x.ID) === id; })[0];
        if (!d) return;
        fe('iThuTu').value = d.THUTU == null ? '' : d.THUTU;
        fe('strTen').value = d.TEN == null ? '' : d.TEN;
        fe('strMa').value = d.MA == null ? '' : d.MA;
        fe('dMucDiemQuyDinh').value = d.MUCDIEMQUYDINH == null ? '' : d.MUCDIEMQUYDINH;
        A.dat(fe('strDoiTuongApDung_Id'), d.DOITUONGAPDUNG_ID);
        A.dat(fe('strThangDiem_Id'), d.THANGDIEM_ID);
        A.dat(fe('strNhomTieuChi_Id'), d.NHOMTIEUCHI_ID);
        A.dat(fe('dNhapTrucTiep'), d.NHAPTRUCTIEP);
        A.dat(fe('strDRL_TieuChiDanhGia_Cha_Id'), d.DRL_TIEUCHIDANHGIA_CHA_ID);
    });
})();
