/* =========================================================================
   Danh sách người học theo lớp (giảng viên)
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/nguoihoc.html + script/nguoihoc.js
   Khung chung: _nguoihoc.js (ums.lg.nguoiHoc). Lời gọi riêng (kiểu cũ, GET):
       NS_ThongTinCanBo/LayDSThoiGianTheoLichCaNhan     ô Thời gian (strNhanSu_HoSoCanBo_Id = người đăng nhập)
       NS_ThongTinCanBo/LayDSHocPhanTheoLichCaNhan      ô Học phần — KHÔNG lọc theo thời gian (như gốc)
       NS_ThongTinCanBo/LayDSLopHocPhanTheoLichCaNhan   danh sách lớp
   Hộp "Tổng hợp điểm danh": ums.lg.xemCacBuoi — có Đồng bộ theo TKB, Chỉnh sửa
   điểm danh, ô chọn cả cột (như gốc). Buổi lấy theo người đăng nhập.
   Nối tầng: Thời gian → Học phần (ums.pat.chain). Học phần của gốc không phụ
   thuộc thời gian; khoá theo luật chung — chọn thời gian mới chọn học phần.
   Kéo gốc lần 13 (7/11): mẫu báo cáo gửi thêm strDangKy_LopHocPhan_Id cho MỖI lớp đã chọn
   (cùng giá trị strDaoTao_LopHocPhan_Id) — bật cfg.dangKyLop của khung chung, như nguoihoctheokhoa.
   ========================================================================= */
(function () {
    'use strict';

    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(m, o) { return ums.api.call(Object.assign({ action: 'NS_ThongTinCanBo/' + m, method: 'GET', strNhanSu_HoSoCanBo_Id: uid() }, o || {})).then(function (r) { return arr(r.data); }); }
    ums.lg.nguoiHoc(document.getElementById('lg-nguoihoc'), {
        tieuDe: 'Danh sách người học theo lớp',
        dangKyLop: true,   // kéo gốc lần 13 (7/11): mẫu báo cáo gửi thêm strDangKy_LopHocPhan_Id cùng giá trị mỗi lớp (gốc 4/11)
        dsThoiGian: function () { return get('LayDSThoiGianTheoLichCaNhan', { strDaoTao_ThoiGianDaoTao_Id: '' }); },
        dsHocPhan: function () { return get('LayDSHocPhanTheoLichCaNhan'); },
        dsLop: function (v) { return get('LayDSLopHocPhanTheoLichCaNhan', { strDaoTao_HocPhan_Id: v('hp'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }); },
        cot: function () {
            return [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' }, { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                { title: 'Tổng hợp điểm danh', cls: 'is-center', render: function (x, i) {
                    return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-cc="' + i + '"><span>Tổng hợp điểm danh</span></button>'; } }
            ];
        },
        hopBuoi: function () { return { chonCot: true }; }
    });
})();
