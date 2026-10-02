/* =========================================================================
   Hợp đồng dự kiến — kê khai hợp đồng cho người CHƯA có hồ sơ cán bộ (Bên B tự nhập)
   Bản gốc: ApisNhanSu/Modules/hopdong/html/hopdongdukien.html + script/hopdongdukien.js
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-4 | col-lg-8): trái "Danh sách hợp đồng" (từ khoá, mỗi
   mục Họ tên / CMND-CCCD / Số hợp đồng), phải "Thông tin chung" đổi chỗ với biểu mẫu
   "Hợp đồng" — ums.crud({ master }).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_ThongTinHopDong/LayDanhSach  GET  strTuKhoa, strNhanSu_HoSoCanBo_Id '', strNguoiThucHien_Id '',
                                       pageIndex, pageSize (phân trang máy chủ như gốc)
       NS_ThongTinHopDong/LayChiTiet   GET  strId
       NS_ThongTinHopDong/ThemMoi | CapNhat  45 tham số như hopdongcanbo (hopdong/script/_hopdong.js);
            màn này điền Bên B: strBenB_Ten (Họ tên), strBenB_NgaySinh, strBenB_SoCMTND, strBenB_DiaChi;
            strNhanSu_HoSoCanBo_Id '', strDieu1_HinhThucTuyen_Id ''
       NS_ThongTinHopDong/Xoa          strIds
   Danh mục: NS.LOAIHOPDONG. Đơn vị tuyển dụng: mọi cơ cấu tổ chức (getList_CoCauToChuc).

   Khác gốc (ghi lại):
     · Bắt buộc Họ tên, Số CMND/CCCD, Số hợp đồng, Ngày sinh, Ngày bắt đầu hiệu lực, Loại hợp đồng,
       Đơn vị tuyển dụng (arrValid_HopDongDuKien) cho CẢ nút Lưu — gốc chỉ kiểm khi bấm
       "Lưu và Nhập tiếp", nút Lưu gửi luôn không kiểm.
     · Xoá: nút thùng rác trên từng mục của gốc → nút "Xoá" trong biểu mẫu (bố cục hai cột của
       ums.crud); lưu xong quay về "Thông tin chung" (gốc hỏi "tiếp tục thêm không?").
     · Bỏ nạp ô dropSearch_CapNhat_CCTC / _BoMon (chép từ hopdongcanbo, không có trên màn).
   Giữ như gốc: danh sách lấy MỌI hợp đồng (strNhanSu_HoSoCanBo_Id rỗng) — kể cả hợp đồng của
   cán bộ đã có hồ sơ (kê ở màn Hợp đồng cán bộ).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, esc = S.esc, e = S.e, C = 'NS_ThongTinHopDong';

    ums.crud({
        root: document.getElementById('hopdongdukien'),
        title: 'Hợp đồng dự kiến',
        formTitle: 'hợp đồng',
        icon: 'fa-list',
        saveAgain: 'Lưu và Nhập tiếp',
        master: {
            title: 'Danh sách hợp đồng', icon: 'fa-list', width: '360px',
            item: function (r) {
                return '<span class="ums-master__item__main">Họ Tên: ' + esc(e(r.BENB_TEN)) +
                    '<span class="ums-master__item__sub">CMND/CCCD: ' + esc(e(r.BENB_SOCMTND)) + '</span>' +
                    '<span class="ums-master__item__sub">Số hợp đồng: ' + esc(e(r.SOHOPDONG)) + '</span></span>';
            }
        },
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strNhanSu_HoSoCanBo_Id: '', strNguoiThucHien_Id: '' };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Thông tin nhân sự' },
            { key: 'strBenB_Ten', col: 'BENB_TEN', label: 'Họ tên', required: true },
            { key: 'strBenB_NgaySinh', col: 'BENB_NGAYSINH', label: 'Ngày sinh', type: 'date', required: true },
            { key: 'strBenB_SoCMTND', col: 'BENB_SOCMTND', label: 'Số CMND/CCCD', required: true },
            { key: 'strBenB_DiaChi', col: 'BENB_DIACHI', label: 'Địa chỉ' },
            { type: 'legend', label: 'Thông tin hợp đồng' },
            { key: 'strSoHopDong', col: 'SOHOPDONG', label: 'Số hợp đồng', required: true },
            { key: 'strNgayKyHopDong', col: 'NGAYKYHOPDONG', label: 'Ngày ký', type: 'date' },
            { key: 'strDieu1_LoaiHopDong_Id', col: 'DIEU1_LOAIHOPDONG_ID', label: 'Loại hợp đồng', type: 'select', required: true,
              source: { dm: 'NS.LOAIHOPDONG' }, placeholder: '--Chọn loại hợp đồng--' },
            { key: 'strNgayHieuLucHopDong', col: 'NGAYHIEULUCHOPDONG', label: 'Ngày bắt đầu hiệu lực', type: 'date', required: true },
            { key: 'strNgayHetHieuLucHopDong', col: 'NGAYHETHIEULUCHOPDONG', label: 'Ngày hết hiệu lực', type: 'date' },
            { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Đơn vị tuyển dụng', type: 'select', required: true,
              source: S.nguonCCTC(), placeholder: '--Chọn đơn vị tuyển dụng--' },
            { key: 'strDieu1_DiaDiemLamViec', col: 'DIEU1_DIADIEMLAMVIEC', label: 'Địa điểm làm việc' },
            { key: 'strDieu1_CongViecPhaiLam', col: 'DIEU1_CONGVIECPHAILAM', label: 'Công việc đảm nhận', type: 'textarea', span: true }
        ],
        save: function (v, row) { return S.hopDongCall(v, row, { strNhanSu_HoSoCanBo_Id: '', strDieu1_HinhThucTuyen_Id: '' }); },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: S.uid() }; });
        }
    });
})();
