/* =========================================================================
   Danh sách người học theo khoa quản lý
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/nguoihoctheokhoa.html + script/nguoihoctheokhoa.js
   Khung chung: _nguoihoc.js (ums.lg.nguoiHoc). Lời gọi riêng (kiểu cũ, GET):
       NS_ThongTinCanBo/LayDSThoiGianTheoKhoaQL      ô Thời gian (tự chọn mục ĐẦU, như gốc selectFirst)
       NS_ThongTinCanBo/LayDSHocPhanTheoKhoaQL       ô Học phần (theo thời gian)
       NS_ThongTinCanBo/LayDSHeDaoTaoTheoKhoaQL      ô Hệ đào tạo (theo học phần, thời gian)
       NS_ThongTinCanBo/LayDSLopHocPhanTheoKhoaQL    danh sách lớp (+ strDaoTao_HeDaoTao_Id)
   Cột "Tổng hợp điểm danh": mỗi giảng viên trong DSGIANGVIENTHEOCAUTRUC
   ("<id>:<nhãn>;<id>:<nhãn>") một nút → hộp các buổi CHỈ XEM, buổi lấy theo
   giảng viên đó (strNhanSu_HoSoCanBo_Id = id giảng viên, như gốc).
   Hai cột "Xác nhận điểm danh" / "Xác nhận điểm": xem lịch sử xác nhận.
   Nối tầng: Thời gian → Học phần → Hệ đào tạo (ums.pat.chain).
   Không chép: page_load gọi biến `me` không tồn tại (lỗi JS); indexOf(";") luôn
   đúng; hộp các buổi vẽ ô sửa được mà không có nút lưu → ở đây ô khoá.
   Giữ như bản gốc: mẫu báo cáo KHÔNG gửi hệ đào tạo; giảng viên rỗng → gửi id rỗng.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(m, o) { return ums.api.call(Object.assign({ action: 'NS_ThongTinCanBo/' + m, method: 'GET', strNhanSu_HoSoCanBo_Id: uid() }, o || {})).then(function (r) { return arr(r.data); }); }
    function giangVien(s) {
        return String(s || '').split(';').map(function (x) { var k = x.indexOf(':'); return k < 0 ? null : { id: x.slice(0, k), ten: x.slice(k + 1) }; }).filter(Boolean);
    }
    function nutXem(i, loai) { return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-ls="' + i + '" data-loai="' + loai + '"><i class="fa-light fa-magnifying-glass"></i><span>Xem</span></button>'; }
    ums.lg.nguoiHoc(document.getElementById('lg-nguoihoctheokhoa'), {
        tieuDe: 'Danh sách người học theo khoa quản lý', coHe: true, chonDau: true,
        dsThoiGian: function () { return get('LayDSThoiGianTheoKhoaQL'); },
        dsHocPhan: function (v) { return get('LayDSHocPhanTheoKhoaQL', { strDaoTao_ThoiGianDaoTao_Id: v('tg') }); },
        dsHe: function (v) { return get('LayDSHeDaoTaoTheoKhoaQL', { strDaoTao_HocPhan_Id: v('hp'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }); },
        dsLop: function (v) { return get('LayDSLopHocPhanTheoKhoaQL', { strDaoTao_HocPhan_Id: v('hp'), strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he') }); },
        cot: function () {
            return [
                { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                { title: 'Số lượng', prop: 'SOLUONG', cls: 'is-center' },
                { title: 'Tổng hợp điểm danh', cls: 'is-center', render: function (x, i) {
                    var gv = giangVien(x.DSGIANGVIENTHEOCAUTRUC);
                    if (!gv.length) gv = [{ id: '', ten: 'Tổng hợp điểm danh' }];
                    return '<div class="lg-nh__gv">' + gv.map(function (g) {
                        return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-cc="' + i + '" data-gv="' + esc(g.id) + '"><span>' + esc(g.ten) + '</span></button>';
                    }).join('') + '</div>';
                } },
                { title: 'Xác nhận điểm danh', cls: 'is-center', render: function (x, i) { return nutXem(i, 'diemdanh'); } },
                { title: 'Xác nhận điểm', cls: 'is-center', render: function (x, i) { return nutXem(i, 'diem'); } }
            ];
        },
        hopBuoi: function (gv) { return { giangVien: gv || '', chiXem: true }; }
    });
})();
