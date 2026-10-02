/* =========================================================================
   Quá trình lương — phòng tổ chức cập nhật cho từng cán bộ
   Bản gốc: ApisNhanSu/Modules/luong/script/quatrinhluong.js
   (KHÁC bản Cổng cán bộ — bản đó chỉ xem của chính mình.)
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc: cột trái "Danh sách cán bộ" (ums.luongB.canBo —
   getList_NhanSu, dLaCanBoNgoaiTruong 0, Khoa/Viện → Bộ môn); cột phải "Họ tên
   - Mã cán bộ" + khung "Quá trình lương" (gốc: dải tab MỘT tab → bỏ dải tab)
   với biểu mẫu thay chỗ danh sách.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QT_Luong/LayDanhSach   GET  strNhanSu_HoSoCanBo_Id
       NS_QT_Luong/LayChiTiet    GET  strId (trước khi sửa)
       NS_QT_Luong/ThemMoi | CapNhat  POST — bộ khoá chép nguyên (các khoá quyết
           định gửi rỗng, iTrangThai 1, strLoai_Id / strNhanSu_BangHeSoLuong_Id rỗng)
       NS_QT_Luong/Xoa           POST strIds, strNguoiThucHien_Id
       sau khi THÊM: ThietLapQuaTrinhCuoiCung(…, "NS_QT_Luong") → ums.ref.quaTrinhCuoiCung
   Lưới "Thông tin quyết định" (NS_ThongTinQuyetDinh): LayDanhSach (strNguonDuLieu_Id
   = id quá trình lương, strThanhVien_Id ''), ThemMoi | CapNhat (chỉ dòng có Số
   QĐ; Ngày hiệu lực / hết hiệu lực gửi vào strNgayHieuLuc / strNgayHetHieuLuc),
   Xoa; tệp của từng dòng vào NS_Files. Luôn đủ 4 dòng như gốc.
   Danh mục: LUONG.NHOMNGACH, LUONG.NGACH, NS.CDNN, NS.QUDI.

   Lỗi gốc đã sửa theo ý định:
     · Khoá 'strLoaiChucDanhNgheNghiep_Id' khai HAI lần trong obj_save, lần sau
       rỗng thắng → ô "Chức danh nghề nghiệp" chưa bao giờ được lưu. Nay gửi giá trị ô.
     · Thêm mới: quyết định lưu với strNguonDuLieu_Id = me.strCommon_Id (RỖNG khi
       thêm) → quyết định mồ côi. Nay dùng id máy chủ trả (data.Id).
     · Chọn Khoa/Viện gốc gọi lại getList_CoCauToChuc (đổ lại TOÀN BỘ bộ môn) —
       nay Bộ môn lọc theo Khoa (như màn Phụ cấp cùng module).
   Giữ như bản gốc: "Mốc nâng bậc lương lần sau" (BACLUONG_TIEPTHEO) và "Ngày xét
   tăng lương dự kiến" (NGAYHUONGLUONG_TIEPTHEO) chỉ đổ khi sửa, KHÔNG gửi đi.
   Bỏ: getList_QuyDinhLuong / getList_BangHeSoLuong nạp vào ô đã bị chú thích
   (dropQuyDinhLuong, dropBangHeSoLuong không có trên màn); ô "Tình trạng làm
   việc" của cột trái gốc không nạp gì và không được đọc.
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui;
    var C = 'NS_QT_Luong', QD = 'NS_ThongTinQuyetDinh';
    var uid = L.uid;
    var nsId = '';
    var crud = null, luoi = null;

    function veLuoi(extra, row) {
        luoi = ums.pat.rows(extra, {
            title: 'Thông tin quyết định', icon: 'fa-file-signature', minRows: 4, minRowsNew: 4,
            columns: [
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', title: 'Loại quyết định', type: 'select',
                  source: { dm: 'NS.QUDI' }, placeholder: '--- Chọn loại quyết định--' },
                { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', title: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', title: 'Ngày ký quyết định', type: 'date', width: '140px' },
                { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', title: 'Ngày hiệu lực', type: 'date', width: '140px' },
                { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', title: 'Ngày hết hiệu lực', type: 'date', width: '140px' },
                { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NS_Files' }
            ],
            list: function (id) {
                return { action: QD + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNguonDuLieu_Id: id, iTrangThai: 1,
                    strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '', strLoaiQuyetDinh_Id: '', strThanhVien_Id: '', pageIndex: 1, pageSize: 10000000 };
            },
            filled: function (v) { return !!v.strSoQuyetDinh; },
            save: function (v, rec, id) {
                return {
                    action: QD + (rec ? '/CapNhat' : '/ThemMoi'),
                    strId: rec ? rec.ID : '',
                    strNguonDuLieu_Id: id,
                    strNhanSu_HoSoCanBo_Id: nsId,
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strNguoiKyQuyetDinh: '',
                    strNgayHieuLuc: v.strNgayHieuLuc,
                    strThongTinQuyetDinh: '',
                    strThongTinDinhKem: '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                    iTrangThai: 1,
                    iThuTu: '',
                    strNguoiThucHien_Id: uid()
                };
            },
            remove: function (rec) { return { action: QD + '/Xoa', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
        });
        luoi.load(row ? row.ID : '');
    }

    function taoCrud(host) {
        return ums.crud({
            root: host,
            embedded: true,
            autoload: false,
            title: 'Quá trình lương',
            listTitle: 'Quá trình lương',
            formTitle: 'quá trình lương',
            icon: 'fa-money-bill-trend-up',
            saveAgain: 'Lưu và nhập tiếp',
            multi: false,

            list: { call: function () { return { action: C + '/LayDanhSach', method: 'GET', strNhanSu_HoSoCanBo_Id: nsId }; } },
            detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

            columns: [
                { title: 'Ngạch', prop: 'NGACH_MA', cls: 'is-center' },
                { title: 'Bậc', prop: 'BAC', cls: 'is-center' },
                { title: 'Hệ số lương', prop: 'HESOLUONG', cls: 'is-center' },
                { title: 'Ngày hưởng', prop: 'NGAYHUONG', cls: 'is-center is-nowrap' },
                { title: 'Phần trăm hưởng', prop: 'PHANTRAMHUONG', cls: 'is-center' },
                { title: 'Lý do', prop: 'LYDO', cls: 'is-center' }
            ],

            fields: [
                { key: 'strNhomNgach_Id', col: 'NHOM_ID', label: 'Chọn nhóm ngạch', type: 'select', source: { dm: 'LUONG.NHOMNGACH' }, placeholder: '-- Chọn nhóm ngạch--' },
                { key: 'strNgach_Id', col: 'NGACH_ID', label: 'Chọn ngạch', type: 'select', source: { dm: 'LUONG.NGACH' }, placeholder: '-- Chọn ngạch--' },
                { key: 'strLoaiChucDanhNgheNghiep_Id', col: 'LOAICHUCDANHNGHENGHIEP_ID', label: 'Chức danh nghề nghiệp', type: 'select',
                  source: { dm: 'NS.CDNN' }, placeholder: '-- Chọn chức danh nghề nghiệp--' },
                { key: 'dBac', col: 'BACLUONG_HIENTAI', label: 'Bậc lương' },
                { key: 'dHeSoLuong', col: 'HESOLUONG', label: 'Hệ số lương trước ngày hưởng' },
                { key: 'strNgayHuong', col: 'NGAYHUONG', label: 'Ngày hưởng', type: 'date' },
                { key: 'dPhanTramHuong', col: 'PHANTRAMHUONG', label: 'Phần trăm hưởng' },
                { key: 'strLyDo', col: 'LYDO', label: 'Lý do được hưởng' },
                { key: '_mocNangBac', col: 'BACLUONG_TIEPTHEO', label: 'Mốc nâng bậc lương lần sau', type: 'date' },
                { key: '_ngayXetDuKien', col: 'NGAYHUONGLUONG_TIEPTHEO', label: 'Ngày xét tăng lương dự kiến' }
            ],
            onForm: function (row, c, extra) { veLuoi(extra, row); },

            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNhanSu_ThongTinQD_Id: '',
                    strSoQuyetDinh: '',
                    strNgayQuyetDinh: '',
                    strNguoiKyQuyetDinh: '',
                    strNgayHieuLuc: '',
                    strThongTinQuyetDinh: '',
                    strLoaiQuyetDinh_Id: '',
                    strNgayHetHieuLuc: '',
                    iTrangThai: 1,
                    iThuTu: '',
                    strNhanSu_BangQDLuong_Id: '',
                    strNhanSu_HoSoCanBo_Id: nsId,
                    strNgayHuong: v.strNgayHuong,
                    strLyDo: v.strLyDo,
                    strNhomNgach_Id: v.strNhomNgach_Id,
                    strNgach_Id: v.strNgach_Id,
                    strLoaiChucDanhNgheNghiep_Id: v.strLoaiChucDanhNgheNghiep_Id,
                    dBac: v.dBac,
                    strLoai_Id: '',
                    dHeSoLuong: v.dHeSoLuong,
                    strNhanSu_BangHeSoLuong_Id: '',
                    dPhanTramHuong: v.dPhanTramHuong,
                    strNguoiThucHien_Id: uid()
                };
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : (result.raw && result.raw.Id);
                if (!isEdit) ums.ref.quaTrinhCuoiCung('NS_QT_Luong');
                if (luoi) luoi.save(id || '');
            },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        });
    }

    L.canBo(document.getElementById('quatrinhluong'), {
        title: 'Quá trình lương',
        onPick: function (r, host) {
            nsId = r.ID;
            if (!crud) crud = taoCrud(host);
            else if (crud.z('form') && !crud.z('form').hidden) crud.showList();
            crud.load(1);
        }
    });
})();
