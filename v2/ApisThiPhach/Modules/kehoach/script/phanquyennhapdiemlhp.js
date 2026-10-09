/* =========================================================================
   Phân quyền nhập theo Lớp học phần (Thi phách) — cấu hình cho khung ums.tpPq.man (_tp_pq.js, _tp_pq_lhp.js)
   Bản gốc: ApisThiPhach/Modules/kehoach/html/phanquyennhapdiemlhp.html + script/phanquyenlophocphan.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
       Danh sách: GET DKH_BaoCao/LayDSLopHocPhanPhanTrang (strTuKhoa rỗng — gốc đọc ô txtAAAA không có, strDaoTao_ThoiGianDaoTao_Id,
         strDaoTao_HocPhan_Id, pageIndex, pageSize (mặc định 10 như gốc), strDangKy_KeHoachDangKy_Id, dChiLayCacLopChuaPhanCong 1/0,
         strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id, strDaoTao_HeDaoTao_Id, strDaoTao_KhoaQuanLy_Id, dSoDaDangTuSo,
         dSoDaDangDenSo (trống = -1)) → MALOP, TENLOP, THOIGIANCHITIET, SOSVDADANGKY, SOLUONGDUKIENHOC, HOCPHITINHRIENG
       "Chi tiết" (Đã phân công): ums.lhp.hopPhamVi của Đăng ký học — DKH_PhanCong_LopHP/LayDanhSach
       Số SV đã đăng ký: ums.tpPq.hopSinhVien — DKH_PhanCong_LopHP/LayDSDangKyHoc
       Tạo danh sách nhập điểm: D_PhanQuyen_MH/FSAuBTQNKCQ0DykgMQUoJCwP · pkg_diem_phanquyen.TaoDuLieuNhapDiem (strDaoTao_LopHocPhan_Id)
       Hủy danh sách nhập điểm: D_PhanQuyen_MH/CTQ4FSAuBTQNKCQ0DykgMQUoJCwP · PKG_DIEM_PHANQUYEN.HuyTaoDuLieuNhapDiem (strDaoTao_LopHocPhan_Id)
       Phân quyền: POST CMS_PhanQuyenDuLieu/Them_DuLieu_LopHocPhan (strDangKy_LopHocPhan_Id, strNguoiDung_Id, strHanhDong_Id, strGhiChu rỗng)
         · GET CMS_PhanQuyenDuLieu/LayDSQuyenDuLieu_LopHocPhan (strDangKy_LopHocPhan_Id) → DANGKY_LOPHOCPHAN_MA, DANGKY_LOPHOCPHAN_TEN,
           NGUOIDUNG_TAIKHOAN, NGUOIDUNG_TENDAYDU, HANHDONG_TEN · POST CMS_PhanQuyenDuLieu/Xoa_DuLieu_LopHocPhan (strId)
       Báo cáo (gốc KHÔNG có vùng Import): Thời gian, Khoá, CT, Học phần, Hệ, Khoa QL + mỗi lớp đánh dấu strDangKy_LopHocPhan_Id
         + mỗi trạng thái SV đánh dấu strTrangThaiNguoiHoc_Id
   Khác gốc:
     · Tạo / Hủy danh sách nhập điểm: gốc bắn thẳng mỗi lớp một lời gọi, KHÔNG hỏi lại → hỏi lại (Hủy: cảnh báo đỏ), ums.ui.batch,
       xong nạp lại danh sách.
     · Vùng Phân quyền: bảng trái của gốc luôn trống (như bản DST) → hiện các lớp học phần đã đánh dấu.
     · Ô "Số đã đăng ký" gõ chữ: gốc gửi NaN → coi như trống (-1).
   Bỏ (mã chết — nút không có trong html / không lối vào): vùng "Dồn lớp" #zoneEdit (.btnDonLop không được vẽ), #btnThietLapLopRieng,
     #btnDeleteLopHocPhan, save_SinhVien, delete_LopHocPhan, save_ThietLapLopRieng, getList_SanPhamPhanQuyen.
   Giữ nút, khoá: "Thêm" ở Danh sách phân quyền (.btnSearchHocPhan — gốc không có xử lý).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, P = ums.tpPq;
    function goiLop(ds, ma, fn) {
        return ds.map(function (x) { return { action: 'D_PhanQuyen_MH/' + ma, func: fn, strDaoTao_LopHocPhan_Id: x.ID, strNguoiThucHien_Id: P.uid() }; });
    }
    P.man(document.getElementById('tp-phanquyennhapdiemlhp'), {
        tieuDe: 'Phân quyền nhập theo Lớp học phần',
        loc: P.locLhp(), tuTai: false, doiTai: ['tg', 'hp'], nutO: 'khung',
        ds: {
            phanTrang: true, rong: 'Không có lớp học phần',
            goi: function (L) {
                return P.goiGet('DKH_BaoCao/LayDSLopHocPhanPhanTrang', { strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: L.v('tg'), strDaoTao_HocPhan_Id: L.v('hp'),
                    strDangKy_KeHoachDangKy_Id: L.v('kh'), dChiLayCacLopChuaPhanCong: L.co('cpc'), strDaoTao_KhoaDaoTao_Id: L.v('khoa'),
                    strDaoTao_ChuongTrinh_Id: L.v('ct'), strDaoTao_HeDaoTao_Id: L.v('he'), strDaoTao_KhoaQuanLy_Id: L.v('kql'),
                    dSoDaDangTuSo: L.so('tu'), dSoDaDangDenSo: L.so('den') });
            },
            cot: function () {
                return [P.cotChon('cd'), { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                    { title: 'Thông tin lịch', prop: 'THOIGIANCHITIET', cls: 'is-center' },
                    { title: 'Đã phân công', cls: 'is-center', render: function (x, i) {
                        return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-h': 'pv', 'data-i': i } }); } },
                    { title: 'Số sv đã đăng ký', cls: 'is-center', render: function (x, i) {
                        return x.SOSVDADANGKY ? '<a href="javascript:void(0)" class="nd-lk" data-h="sv" data-i="' + i + '" title="Số sinh viên đã đăng ký">' + ui.esc(x.SOSVDADANGKY) + '</a>' : ''; } },
                    { title: 'Số sv dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
                    { title: 'Lớp riêng', cls: 'is-center', render: function (x) { return x.HOCPHITINHRIENG ? 'Lớp riêng' : ''; } }, P.cotQuyen()];
            },
            hanh: { pv: function (x) { ums.lhp.hopPhamVi(x.ID); }, sv: function (x) { P.hopSinhVien(x.ID); } }
        },
        nutThem: [
            { a: 'tao', html: ui.btn('add', { text: 'Tạo danh sách nhập điểm', attr: { 'data-a': 'tao' } }), chay: function (ds, ctx) {
                ui.confirm('Tạo danh sách nhập điểm cho ' + ds.length + ' lớp học phần đã chọn?', { title: 'Tạo danh sách nhập điểm', ok: 'Tạo danh sách' }).then(function (yes) {
                    if (yes) ui.batch(goiLop(ds, 'FSAuBTQNKCQ0DykgMQUoJCwP', 'pkg_diem_phanquyen.TaoDuLieuNhapDiem'),
                        { title: 'Đang tạo danh sách nhập điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(ctx.tai);
                });
            } },
            { a: 'huy', html: ui.xoaChon('input[data-cd]', { text: 'Hủy danh sách nhập điểm', goc: '.ums-panel', attr: { 'data-a': 'huy', title: 'Hủy danh sách nhập điểm' } }),
                chay: function (ds, ctx) {
                    ui.confirm('Hủy danh sách nhập điểm của ' + ds.length + ' lớp học phần đã chọn? Thao tác này không hoàn lại được.',
                        { tone: 'bad', title: 'Hủy danh sách nhập điểm', ok: 'Hủy danh sách' }).then(function (yes) {
                        if (yes) ui.batch(goiLop(ds, 'CTQ4FSAuBTQNKCQ0DykgMQUoJCwP', 'PKG_DIEM_PHANQUYEN.HuyTaoDuLieuNhapDiem'),
                            { title: 'Đang hủy danh sách nhập điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(ctx.tai);
                    });
                } }
        ],
        baoCao: { import: false, collect: function (add, ctx) {
            var L = ctx.L;
            add('strDaoTao_ThoiGianDaoTao_Id', L.v('tg')); add('strDaoTao_KhoaDaoTao_Id', L.v('khoa')); add('strDaoTao_ChuongTrinh_Id', L.v('ct'));
            add('strDaoTao_HocPhan_Id', L.v('hp')); add('strDaoTao_HeDaoTao_Id', L.v('he')); add('strDaoTao_KhoaQuanLy_Id', L.v('kql'));
            ctx.daChon().forEach(function (x) { add('strDangKy_LopHocPhan_Id', x.ID); });
            L.tt.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
        } },
        quyen: {
            danhTu: 'lớp học phần', nutThemKhoa: true,
            doiTuong: { goi: null, cot: [{ title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' }] },
            them: function (dl, nd, hd) {
                return P.goiPost('CMS_PhanQuyenDuLieu/Them_DuLieu_LopHocPhan', { strDangKy_LopHocPhan_Id: dl, strNguoiDung_Id: nd, strHanhDong_Id: hd, strGhiChu: '' });
            },
            ds: function (id) { return P.goiGet('CMS_PhanQuyenDuLieu/LayDSQuyenDuLieu_LopHocPhan', { strDangKy_LopHocPhan_Id: id }); },
            cotDs: [{ title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                P.cotNguoiDung(), { title: 'Hành động', prop: 'HANHDONG_TEN' }],
            xoa: function (id) { return P.goiPost('CMS_PhanQuyenDuLieu/Xoa_DuLieu_LopHocPhan', { strId: id }); }
        }
    });
})();
