/* =========================================================================
   Đi muộn về sớm — quy định số phút đi muộn / về sớm, số lần mỗi tháng
   Bản gốc: ApisNhanSu/Modules/chamcongphep/html/dimuonvesom.html + script/dimuonvesom.js
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 | col-lg-9): trái "Lịch âm - dương", phải danh
   sách + biểu mẫu thay chỗ nhau (ums.crud nhúng, "Thêm" / "Tải lại" ở đầu khung).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_QuyDinhDiMuonVeSom/LayDanhSach  GET  strTuKhoa '', strNguoiThucHien_Id '', pageIndex, pageSize
                                          gốc gửi trang mặc định (1, 10) mà KHÔNG vẽ thanh phân trang →
                                          quá 10 quy định là mất dòng. Bản mới phân trang máy chủ (Pager).
       NS_QuyDinhDiMuonVeSom/ThemMoi | CapNhat  strId, strNgayApDung, dSoPhutDiMuon, dSoPhutVeSom, dSoLan
       NS_QuyDinhDiMuonVeSom/Xoa          strIds
   Sửa: đổ từ dòng trong danh sách (gốc objGetDataInData, không LayChiTiet).

   Bỏ (không có tác dụng ở gốc):
     · Nút "Viết lại" trong biểu mẫu: trùng id #btnRefreshDMVS với "Tải lại" nên
       jQuery chỉ gắn nút đầu — nút này chưa từng chạy. Thêm mới luôn mở biểu mẫu trống.
     · loadToCombo NS.LTNS vào #dropDMVS_LoaiDoiTuong, dateYearToCombo vào
       #dropDMVS_NamApDung — hai ô không có trên màn.
   Khác gốc: lưu xong quay về danh sách (gốc ở lại biểu mẫu với id cũ → bấm Lưu
   lần hai lại THÊM một dòng nữa).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, C = 'NS_QuyDinhDiMuonVeSom';
    var root = document.getElementById('dimuonvesom');

    S.khung(root, {
        title: 'Đi muộn về sớm',
        trai: [{ title: 'Lịch âm - dương', icon: 'fa-calendar', ve: function (h) { h.classList.add('nscham-pad'); S.amLich(h); } }],
        crud: {
            title: 'Quy định đi muộn về sớm',
            formTitle: 'quy định đi muộn về sớm',
            icon: 'fa-file-lines',
            addText: 'Thêm',
            list: {
                paged: true,
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: '' };
                }
            },
            columns: [
                { title: 'Đi muộn', prop: 'SOPHUTDIMUON', cls: 'is-center', group: ['Thời gian (phút)'] },
                { title: 'Về sớm', prop: 'SOPHUTVESOM', cls: 'is-center', group: ['Thời gian (phút)'] },
                { title: 'Số lần/tháng', prop: 'SOLAN', cls: 'is-center' },
                { title: 'Ngày áp dụng', prop: 'NGAYAPDUNG', cls: 'is-center is-nowrap' },
                { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TENDAYDU' }
            ],
            fields: [
                { type: 'legend', label: 'Thông tin quy định' },
                { key: 'dSoPhutDiMuon', col: 'SOPHUTDIMUON', label: 'Số phút đi muộn' },
                { key: 'dSoPhutVeSom', col: 'SOPHUTVESOM', label: 'Số phút về sớm' },
                { key: 'dSoLan', col: 'SOLAN', label: 'Số lần/tháng' },
                { key: 'strNgayApDung', col: 'NGAYAPDUNG', label: 'Ngày áp dụng', type: 'date' }
            ],
            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNgayApDung: v.strNgayApDung,
                    dSoPhutDiMuon: v.dSoPhutDiMuon,
                    dSoPhutVeSom: v.dSoPhutVeSom,
                    dSoLan: v.dSoLan,
                    strNguoiThucHien_Id: S.uid()
                };
            },
            remove: function (ids) {
                return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
            }
        }
    });
})();
