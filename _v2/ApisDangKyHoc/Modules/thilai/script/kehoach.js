/* =========================================================================
   Kế hoạch thi lại
   Bản gốc: ApisDangKyHoc/Modules/thilai/html/kehoach.html + script/kehoach.js
   (vỏ indexi — đối chiếu edu.* với Corei/)
   ---------------------------------------------------------------------------
   Một cột như bản gốc: thanh lọc (Mô hình, từ khoá, Tìm kiếm, báo cáo) + bảng
   kế hoạch 21 cột. Biểu mẫu kế hoạch thay chỗ danh sách (ums.crud); các khối
   con của biểu mẫu ở _tl_form.js. Nút "Chi tiết" trên từng dòng:
       Phí · Phân nhân sự · Danh sách nhập điểm      → vùng thay chỗ (_tl_vung.js)
       Kết quả đăng ký                               → vùng thay chỗ (_tl_ketqua.js)
       Cán bộ đăng ký                                → vùng thay chỗ (_tl_canbo.js)
       Chưa đăng ký                                  → hộp thoại chỉ xem (_tl_hop.js)
       Lớp học phần / Lớp quản lý sử dụng            → màn con thay chỗ màn (_tl_hop.js, pat.formTrang;
                                                       gốc là hộp thoại lồng hộp thoại — BO-CUC luật 1)
   (gốc: #zone… dùng toggle_overide, #modal… dùng hộp thoại)
   Hai cột "Phạm vi đăng ký" và "Thời gian đăng ký" của gốc là nút SỬA thứ hai,
   thứ ba (cùng mở biểu mẫu) — giữ nguyên; cột "Sửa" cuối là cột Thao tác của crud.

   Lời gọi (chép nguyên văn):
     DKH_DangKyThi_MonThi_Chung/LayDSKeHoach                  GET  strTuKhoa, strMoHinh_Id
     DKH_DangKyThi_MonThi_Chung/Them_DangKy_Thi_HP_KeHoach    thêm   (strId "")
     DKH_DangKyThi_MonThi_Chung/Sua_DangKy_Thi_HP_KeHoach     sửa    (strId = ID)
         strPhanLoai_Id, strTenKeHoach, strMoTa, strTuNgay, strDenNgay, strHanNopPhi,
         strTrinhDo, strThoiGianThiDuKien, strDiaDiemDuKien, dHieuLuc, strMoHinhDangKy_Id
     DKH_DangKyThi_MonThi_Chung/Xoa_DangKy_Thi_HP_KeHoach     strId — mỗi dòng một lời gọi
     danh mục DANGKY.THI.HOCPHAN.MOHINH (lọc + biểu mẫu), DANGKY.THI.HOCPHAN.LOAI
     Báo cáo: getList_MauImport("zonebtnBaoCao_KH") → ums.report.mount; collect gửi
         strTuKhoa / strDaoTao_ThoiGianDaoTao_Id / strHB_QuyHocBong_Id RỖNG (gốc đọc ba ô
         không tồn tại: txtSearch_TuKhoa, dropSearch_ThoiGianDaoTao, dropSearch_QuyHocBong)
         + strHocBong_Id cho mỗi kế hoạch đang đánh dấu (như gốc).
   Cột trả về: TENKEHOACH, PHANLOAI_TEN/_ID, MOHINHDANGKY_TEN/_ID, TUNGAY, DENNGAY,
   NGAYHANNOPPHI, TRINHDO, THOIGIANTHIDUKIEN, DIADIEMDUKIEN, HIEULUC, MOTA.

   Cố ý bỏ (mã chết của bản gốc):
     · Vùng "Ngành mở đăng ký" (#zoneNganh, *_Nganh, save_Nganh…): không nút nào
       trên bảng mang lớp .btnDSNganh → không bao giờ mở được.
     · "Thêm thành viên" của vùng đã đăng ký (.btnSearchDTSV_SinhVien, save_SinhVien):
       nút bị chú thích trong html; save_SinhVien còn đọc biến aDataNganh không tồn tại.
     · save_Lop / save_ChuongTrinh / save_Khoa (HB_XepLoaiDanhHieu/*), getList_PhanLoai,
       getList_NganhXet, getList_HeDaoTao / KhoaDaoTao (chỉ phục vụ #tbl_HeKhoa đã ẩn).
     · Khối "Phạm vi đăng ký" #tbl_HeKhoa (display:none vĩnh viễn) — xem _tl_form.js.
   Khác gốc:
     · Lưu xong về danh sách (quy ước ums.crud). Gốc ở lại biểu mẫu nhưng KHÔNG nhận
       id kế hoạch mới → bấm Lưu lần nữa là thêm TRÙNG, thêm đợt thi / học phần ngay
       sau đó thì bị chặn / gửi id rỗng. Muốn thêm đợt thi, học phần: mở Sửa.
     · Kiểm tra hợp lệ của gốc trỏ vào ô không tồn tại (txtKeHoachXuLy_So) → không kiểm
       gì; ở đây cũng không bắt buộc ô nào (giữ hành vi).
     · "Viết lại" (rewrite) của gốc không xoá ô Mô tả / Hiệu lực khi Thêm mới — crud xoá trắng.
     · Hiệu lực: gốc hiện "Hiệu lực" khi HIEULUC truthy (chuỗi "0" cũng thành Hiệu lực);
       ở đây so theo số.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, T = ums.tlKh;
    var e = T.e, AC = T.AC;
    var root = document.getElementById('thilai-kehoach');
    if (!root) return;

    root.innerHTML = '<div data-v="main"></div><div data-v="zone" hidden></div>';
    var elMain = root.querySelector('[data-v="main"]');
    var elZone = root.querySelector('[data-v="zone"]');
    var MOHINH = { dm: 'DANGKY.THI.HOCPHAN.MOHINH' };
    var LOAI = { dm: 'DANGKY.THI.HOCPHAN.LOAI' };
    var extra = null;

    function nut(k, r) {
        return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-khx': k, 'data-id': r.ID } });
    }
    function sua(r) {
        return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-khx="sua" data-id="' + ui.esc(r.ID) + '" title="Sửa">' +
            '<i class="fa-light fa-pen-to-square"></i></button>';
    }
    function cot(title, k) {
        return { title: title, cls: 'is-center is-nowrap', render: function (r) { return k === 'sua' ? sua(r) : nut(k, r); } };
    }

    var main = ums.crud({
        root: elMain,
        title: 'Kế hoạch thi lại',
        listTitle: 'Danh sách kế hoạch',
        formTitle: 'kế hoạch',
        icon: 'fa-file-contract',

        filters: [
            { key: 'mh', type: 'select', source: MOHINH },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            call: function (f) {
                return { action: AC + 'LayDSKeHoach', method: 'GET', strTuKhoa: f.q, strNguoiThucHien_Id: '', strMoHinh_Id: f.mh };
            }
        },

        columns: [
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
            { title: 'Mô hình đăng ký', prop: 'MOHINHDANGKY_TEN' },
            { title: 'Thời gian đăng ký', cls: 'is-center is-nowrap', render: function (r) { return r.TUNGAY || r.DENNGAY ? ui.esc(e(r.TUNGAY) + ' → ' + e(r.DENNGAY)) : ''; } },
            { title: 'Hạn nộp phí', prop: 'NGAYHANNOPPHI', cls: 'is-center is-nowrap' },
            { title: 'Trình độ', prop: 'TRINHDO', cls: 'is-center' },
            { title: 'Thời gian dự kiến', prop: 'THOIGIANTHIDUKIEN', cls: 'is-center' },
            { title: 'Địa điểm dự kiến', prop: 'DIADIEMDUKIEN', cls: 'is-center' },
            { title: 'Hiệu lực', cls: 'is-center is-nowrap', render: function (r) {
                return Number(r.HIEULUC) ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute');
            } },
            cot('Phạm vi đăng ký', 'sua'),
            cot('Phí', 'phi'),
            cot('Phân nhân sự', 'ns'),
            cot('Thời gian đăng ký', 'sua'),
            cot('Kết quả đăng ký', 'kq'),
            cot('Chưa đăng ký', 'cdk'),
            cot('Cán bộ đăng ký', 'cb'),
            cot('Lớp học phần sử dụng', 'lhp'),
            cot('Lớp quản lý sử dụng', 'lql'),
            cot('Danh sách nhập điểm', 'dsd')
        ],

        fields: [
            { type: 'legend', label: 'Thông tin kế hoạch' },
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch' },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] }, placeholder: 'Chọn hiệu lực' },
            { key: 'strMoHinhDangKy_Id', col: 'MOHINHDANGKY_ID', label: 'Mô hình', type: 'select', source: MOHINH },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', source: LOAI },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
            { key: 'strHanNopPhi', col: 'NGAYHANNOPPHI', label: 'Hạn nộp phí', type: 'date' },
            { key: 'strTrinhDo', col: 'TRINHDO', label: 'Trình độ' },
            { key: 'strThoiGianThiDuKien', col: 'THOIGIANTHIDUKIEN', label: 'Thời gian dự kiến' },
            { key: 'strDiaDiemDuKien', col: 'DIADIEMDUKIEN', label: 'Địa điểm dự kiến' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],

        save: function (v, row) {
            v.strId = row ? row.ID : '';
            v.strNguoiThucHien_Id = '';
            v.action = AC + (row ? 'Sua_' : 'Them_') + 'DangKy_Thi_HP_KeHoach';
            return v;
        },
        onForm: function (row, crud, el) { extra = T.formExtra(el, row); },
        onSaved: function (crud, result, isEdit) {
            var id = isEdit ? (crud.editing && crud.editing.ID) : (result.raw && result.raw.Id);
            if (extra) extra.save(id || '');
        },

        rowDelete: false,
        formDelete: false,
        removeConfirm: function () { return 'Bạn có chắc chắn xóa dữ liệu không?'; },
        remove: function (ids) {
            return ids.map(function (id) { return { action: AC + 'Xoa_DangKy_Thi_HP_KeHoach', strId: id, strNguoiThucHien_Id: '' }; });
        }
    });

    /* Báo cáo theo mẫu phân quyền — đặt đầu trang, trước "Thêm mới" */
    var act = main.z('actions');
    if (act) {
        var slot = document.createElement('span');
        slot.setAttribute('data-z', 'report');
        act.insertBefore(slot, act.firstChild);
        ums.report.mount(slot, {
            collect: function (add) {
                add('strTuKhoa', '');
                add('strDaoTao_ThoiGianDaoTao_Id', '');
                add('strHB_QuyHocBong_Id', '');
                main.pickedRows().forEach(function (r) { add('strHocBong_Id', r.ID); });
            }
        });
    }

    /* ---------- Vùng chi tiết thay chỗ danh sách (toggle_overide của gốc) -------- */
    function dong() {
        ui.swap(elZone, elMain);
        main.load();                 // toggle_form của gốc nạp lại danh sách
    }
    function mo(fn, row) {
        elZone.innerHTML = '';
        var host = document.createElement('div');          // mỗi lần mở một phần tử mới → sự kiện cũ đi theo phần tử cũ
        elZone.appendChild(host);
        fn(host, row, { dong: dong });
        ui.swap(elMain, elZone);
    }

    elMain.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-khx]');
        if (!b || !elMain.contains(b)) return;
        var row = T.tim(main.rows, b.getAttribute('data-id'));
        if (!row) return;
        switch (b.getAttribute('data-khx')) {
            case 'sua': main.showForm(row); break;
            case 'phi': mo(T.vungPhi, row); break;
            case 'ns': mo(T.vungNhanSu, row); break;
            case 'kq': mo(T.vungKetQua, row); break;
            case 'cb': mo(T.vungCanBo, row); break;
            case 'dsd': mo(T.vungDSD, row); break;
            case 'cdk': T.hopChuaDangKy(row); break;
            case 'lhp': T.hopLopHocPhan(row, root); break;
            case 'lql': T.hopLopQuanLy(row, root); break;
        }
    });
})();
