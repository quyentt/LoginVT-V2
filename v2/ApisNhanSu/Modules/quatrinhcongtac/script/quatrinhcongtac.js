/* =========================================================================
   Quá trình công tác — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/quatrinhcongtac/script/quatrinhcongtac.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man) + nút báo cáo
   (getList_MauImport "zonebtnTCCB" → ums.report.mount) + "Import ▾ / 1. Import
   thuyên chuyển cán bộ" (.btnImportWithProce IMPORTWITHPROC_TCCB →
   ums.report.importChung). Phải hai tab:
     1) Quá trình công tác trước tuyển dụng — NS_QT_TieuSuBanThan_TruocTD,
        TRÙNG bản Cổng cán bộ → ums.ccbHS.quatrinhcongtac(P) (cờ P.ns: nhãn
        Ngày bắt đầu / Ngày kết thúc, không có ô tệp). Thêm xong: NHANSU_QT_TSTT.
     2) Quá trình công tác trong trường (điều chuyển) — NS_QT_ThuyenChuyenCanBo:
          LayDanhSach GET strNhanSu_HoSoCanBo_Id · LayChiTiet GET strId ·
          ThemMoi | CapNhat · Xoa (strIds) · tệp NS_Files · xong gọi
          ThietLapQuaTrinhCuoiCung "NHANSU_QT_TCCB" (cả thêm lẫn sửa, như gốc).
        Cột "Điều chuyển gần nhất": LAQUATRINHHIENTAI = CUOICUNG thì bật; dòng
        khác bấm (hỏi lại) → ThietLapQuaTrinhCuoiCung "NHANSU_QT_TCCB" (gốc chỉ
        gửi MÃ BẢNG, không gửi id dòng — giữ).

   Giữ như bản gốc (điều chuyển):
     · Thêm mới gửi strNgayHieuLuc = strNgayChuyen = ô "Ngày áp dụng"; Sửa gửi
       strNgayHieuLuc = ô "Ngày hiệu lực", strNgayChuyen = ô "Ngày chuyển".
     · Đơn vị cũ / mới: chọn cả "Trong trường" lẫn "Ngoài trường" thì chỉ gửi
       Trong trường (Ngoài trường gửi rỗng).
     · Chặn "Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!".
     · Nhãn Loại QĐ / Số QĐ / Ngày áp dụng có (*) nhưng bản gốc đã tắt kiểm tra
       (validInputForm chú thích bỏ, `if (true)`) → không bắt buộc.
   Bỏ: ba bộ kiểm tra ngày của tab 1 (đọc txtTSBT_TuNgay / _DenNgay không có trên
   màn → không bao giờ chạy); các danh mục nạp cho ô không có trên màn (NS.TDTH,
   NS.TDNN, NS.DMHV, QLCB.CNDT, NS.DMNN, NS.TDCT, QLCB.HTDT…); setCheckChange.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, Q = ums.nsQT;
    function esc(s) { return ui.esc(s); }
    var C = 'NS_QT_ThuyenChuyenCanBo';
    var CCTC = { call: {
        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
    }, name: 'TEN' };
    var DMCV = { dm: 'NS.DMCV' };

    function thuyenChuyen(P) {
        return {
            title: 'Quá trình công tác trong trường', formTitle: 'quá trình công tác trong trường', icon: 'fa-right-left',
            formCols: 2, saveAgain: 'Lưu và nhập tiếp',
            list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: P.hs() }; } },
            detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },
            columns: [
                { title: 'Ngày chuyển', prop: 'NGAYCHUYEN', cls: 'is-center is-nowrap' },
                { title: 'Trong trường', prop: 'DONVICU_TENDONVI', group: ['Đơn vị cũ'] },
                { title: 'Ngoài trường', prop: 'DONVICU_NGOAITRUONG', group: ['Đơn vị cũ'] },
                { title: 'Trong trường', prop: 'DONVIMOI_TENDONVI', group: ['Đơn vị mới'] },
                { title: 'Ngoài trường', prop: 'DONVIMOI_NGOAITRUONG', group: ['Đơn vị mới'] },
                { title: 'Số quyết định', prop: 'SOQUYETDINH', cls: 'is-center' },
                { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-center is-nowrap' },
                { title: 'Điều chuyển gần nhất', cls: 'is-center', width: '120px', render: function (r) {
                    if (r.LAQUATRINHHIENTAI === 'CUOICUNG') {
                        return '<span style="color:var(--ums-blue)" title="Đây là trạng thái cuối của quá trình"><i class="fa-solid fa-toggle-on" style="font-size:22px"></i></span>';
                    }
                    return '<button type="button" class="ums-iconbtn" data-cuoi="NHANSU_QT_TCCB" title="Thiết lập trạng thái cuối cùng">' +
                        '<i class="fa-light fa-toggle-off" style="font-size:22px"></i></button>';
                } }
            ],
            fields: [
                { key: '_ttc', type: 'legend', label: 'Thông tin chung' },
                { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' },
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: { dm: 'NS.QUDI' } },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', label: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', label: 'Ngày quyết định', type: 'date' },
                { key: 'strNgayApDung', col: 'NHANSU_TTQUYETDINH_NGAYAD', label: 'Ngày áp dụng', type: 'date' },
                { key: 'strNgayHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày hiệu lực', type: 'date' },
                { key: 'strNgayHetHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHHL', label: 'Ngày hết hiệu lực', type: 'date' },
                { key: 'strNgayChuyen', col: 'NGAYCHUYEN', label: 'Ngày chuyển', type: 'date' },
                { key: '_tep', type: 'files', label: 'File đính kèm', api: 'NS_Files' },
                { key: '_cu', type: 'legend', label: 'Đơn vị cũ' },
                { key: 'strDonViCu_Id', col: 'DONVICU_ID', label: 'Trong trường', type: 'select', source: CCTC, placeholder: 'Chọn đơn vị' },
                { key: 'strDonViCu_NgoaiTruong', col: 'DONVICU_NGOAITRUONG', label: 'Ngoài trường' },
                { key: 'strChucVuCu_Id', col: 'CHUCVUCU_ID', label: 'Chức vụ cũ', type: 'select', source: DMCV },
                { key: '_moi', type: 'legend', label: 'Đơn vị mới' },
                { key: 'strDonViMoi_Id', col: 'DONVIMOI_ID', label: 'Trong trường', type: 'select', source: CCTC, placeholder: 'Chọn đơn vị' },
                { key: 'strDonViMoi_NgoaiTruong', col: 'DONVIMOI_NGOAITRUONG', label: 'Ngoài trường' },
                { key: 'strChucVuMoi_Id', col: 'CHUCVUMOI_ID', label: 'Chức vụ mới', type: 'select', source: DMCV }
            ],
            save: function (v, row) {
                if (Q.soNgay(v.strNgayHieuLuc) > Q.soNgay(v.strNgayHetHieuLuc)) {
                    ui.toast('Ngày hiệu lực không được lớn hơn ngày hết hiệu lực!', 'warn');
                    return null;
                }
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strNgayApDung: v.strNgayApDung,
                    strNguoiKyQuyetDinh: '',
                    strNgayHieuLuc: row ? v.strNgayHieuLuc : v.strNgayApDung,
                    strThongTinQuyetDinh: '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                    iTrangThai: 1,
                    strNoiDung: '',
                    strNhanSu_HoSoCanBo_Id: P.hs(),
                    strNgayChuyen: row ? v.strNgayChuyen : v.strNgayApDung,
                    strDonViCu_Id: v.strDonViCu_Id,
                    strDonViMoi_Id: v.strDonViMoi_Id,
                    strDonViCu_NgoaiTruong: v.strDonViCu_Id && v.strDonViCu_NgoaiTruong ? '' : v.strDonViCu_NgoaiTruong,
                    strDonViMoi_NgoaiTruong: v.strDonViMoi_Id && v.strDonViMoi_NgoaiTruong ? '' : v.strDonViMoi_NgoaiTruong,
                    strChucVuCu_Id: v.strChucVuCu_Id,
                    strChucVuMoi_Id: v.strChucVuMoi_Id,
                    strThongTinDinhKem: '',
                    iThuTu: 0,
                    strNguoiThucHien_Id: P.nth()
                };
            },
            onSaved: function () { ums.ref.quaTrinhCuoiCung('NHANSU_QT_TCCB'); },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: P.nth() }; }); }
        };
    }

    var man = Q.man({
        el: document.getElementById('ns_quatrinhcongtac'),
        title: 'Quá trình công tác',
        sideTools: '<span data-z="baocao"></span>' +
            ui.btn('importer', { text: 'Import', attr: { 'data-a': 'import', title: '1. Import thuyên chuyển cán bộ' } }),
        mo: function (host, cb, P) {
            var tsbt = ums.ccbHS.quatrinhcongtac(P);
            var sec = Q.sections(host, {
                tabs: [
                    { key: 'tstd', text: '1) Quá trình công tác trước tuyển dụng', sections: [tsbt] },
                    { key: 'tctt', text: '2) Quá trình công tác trong trường', sections: [thuyenChuyen(P)] }
                ]
            });
            host.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-cuoi]');
                if (!b) return;
                ui.confirm('Bạn có chắc chắn muốn chuyển trạng thái cuối cùng không?', { title: 'Điều chuyển gần nhất' }).then(function (yes) {
                    if (!yes) return;
                    ums.ref.quaTrinhCuoiCung(b.getAttribute('data-cuoi')).then(function () {
                        var c = sec.crud('tctt', 0);
                        if (c) c.load();
                    });
                });
            });
        }
    });

    var side = man.m.side;
    ums.report.mount(side.querySelector('[data-z="baocao"]'), { import: false, collect: function () {} });
    side.addEventListener('click', function (ev) {
        if (!ev.target.closest('[data-a="import"]')) return;
        ums.report.importChung('TCCB', 'IMPORTWITHPROC_TCCB', { onDone: function () {
            var cb = man.canBo();
            if (cb) { var it = side.querySelector('.ums-dsns__item.is-active'); if (it) it.click(); }
        } });
    });
})();
