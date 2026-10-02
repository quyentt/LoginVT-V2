/* =========================================================================
   Phân quyền nhập theo DST — danh sách thi (Thi phách) — cấu hình cho khung ums.tpPq.man (_tp_pq.js, _tp_pq_nhap.js)
   Bản gốc: ApisThiPhach/Modules/kehoach/html/phanquyennhapdiemdst.html + script/phanquyennhapdiemdst.js
   ---------------------------------------------------------------------------
   Lệch so với bản Túi (lời gọi chép nguyên):
       Danh sách: TP_Chung/LayDSThiTheoDotThi (strTuKhoa, strThi_DotThi_Id, strDaoTao_HocPhan_Id, dLocKhongHoanThanhNhapDiem = ô
         "hoàn thành nhập điểm" 0/1) → MADANHSACHTHI, DAOTAO_HOCPHAN_TEN, NGAYTHI, THI_CATHI_TEN, TKB_PHONGTHI_TEN, SOSVTHEODST,
         THONGTINLOPHOCPHAN — gốc KHÔNG nạp khi mở màn, đổi ô lọc cũng không nạp (các dòng getList_TuiBai bị chú thích)
         → chỉ nạp khi bấm Tìm kiếm / Enter.
       Chi tiết: TP_Chung/LayDSNguoiHocTheoDST (strDanhSachThi_Id) · POST TP_XuLy/CapNhat_DiemPhachTheoDST (strChucNang_Id,
         strUngDung_Id, strThi_DanhSachSinhVien_Id, strDiem)
       Xác nhận từng bản ghi: XACNHAN_HOANTHANH_DIEMTHI_NGUOIHOC, id = ID danh sách thi + QLSV_NGUOIHOC_ID; bảng chép cột Mã số, Họ đệm, Tên
       Phân quyền: CMS_PhanQuyenDuLieu/Them_Thi_GiaoVien_NhapDiem (strDST_Tui_Id = ID danh sách thi) ·
         CMS_PhanQuyenDuLieu/LayDSQuyenThi_GV_NhapDiem (strDST_Tui_Id) · Xoa_Thi_GiaoVien_NhapDiem (strId)
   Khác gốc (làm theo ý định):
     · Vùng Phân quyền: bảng trái của gốc LUÔN TRỐNG (lời gọi nạp bị chú thích, tiêu đề còn ghi "Tên túi / Đợt phách"), Lưu đọc ô
       đánh dấu của danh sách NGOÀI (đang bị ẩn) → nay bảng trái hiện đúng các danh sách thi đã đánh dấu, đánh dấu sẵn, bỏ dấu
       được trước khi Lưu. Dữ liệu gửi đi không đổi nếu người dùng không bỏ dấu dòng nào.
   Bỏ: nút "Xác nhận" đầu trang (html gốc đã chú thích bỏ — trình xử lý .btnXacNhan thành mã chết); #dropSearch_DSThi (không có trong html).
   ========================================================================= */
(function () {
    'use strict';
    var P = ums.tpPq, e = P.e;
    function o(ten) { return function (x, i) { return P.lk(x[ten], i); }; }
    P.man(document.getElementById('tp-phanquyennhapdiemdst'), {
        tieuDe: 'Phân quyền nhập theo DST',
        loc: P.locThi({ hoanThanh: true }), tuTai: false, nutO: 'trang',
        ds: {
            goi: function (L) {
                return P.goiGet('TP_Chung/LayDSThiTheoDotThi', { strTuKhoa: (L.f('q').value || '').trim(), strThi_DotThi_Id: L.v('dot'),
                    strDaoTao_HocPhan_Id: L.v('mon'), dLocKhongHoanThanhNhapDiem: L.v('htnd') });
            },
            rong: 'Không có danh sách thi',
            cot: function () {
                return [P.cotChon('cd'), { title: 'Mã danh sách thi', cls: 'is-nowrap', render: o('MADANHSACHTHI') }, { title: 'Học phần', render: o('DAOTAO_HOCPHAN_TEN') },
                    { title: 'Ngày thi', cls: 'is-center is-nowrap', render: o('NGAYTHI') }, { title: 'Ca thi', cls: 'is-center', render: o('THI_CATHI_TEN') },
                    { title: 'Phòng thi', cls: 'is-center', render: o('TKB_PHONGTHI_TEN') }, { title: 'Số SV', cls: 'is-center', render: o('SOSVTHEODST') },
                    { title: 'Lớp học phần', render: o('THONGTINLOPHOCPHAN') }, P.cotQuyen()];
            }
        },
        baoCao: { import: true, collect: function (add, ctx) {
            add('strThi_DotThi_Id', ctx.L.v('dot')); add('strDaoTao_HocPhan_Id', ctx.L.v('mon')); add('strDanhSachThi_Id', ctx.moDong ? ctx.moDong.ID : '');
            ctx.daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
        } },
        chiTiet: P.nhapDiem({
            tieuDe: function (d) { return 'Thông tin danh sách thi ' + [d.MADANHSACHTHI, d.NGAYTHI, d.THI_CATHI_TEN, d.TKB_PHONGTHI_TEN].map(e).join(' - '); },
            ds: function (id) { return P.goiGet('TP_Chung/LayDSNguoiHocTheoDST', { strDanhSachThi_Id: id }); },
            cot: [{ title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Điểm thành phần', prop: 'DIEM_THANHPHANDIEM_TEN' },
                { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' }, { diem: true }, { title: 'Lớp đăng ký học', prop: 'DIEM_DANHSACHHOC_TEN' },
                { title: 'Người cập nhật', prop: 'NGUOISUA_TAIKHOAN' }, { title: 'Ngày cập nhật', prop: 'NGAYSUA_DD_MM_YYYY', cls: 'is-center is-nowrap' }],
            luu: function (x, diem) {
                return P.goiPost('TP_XuLy/CapNhat_DiemPhachTheoDST', { strChucNang_Id: P.cn(), strUngDung_Id: P.vt(), strThi_DanhSachSinhVien_Id: x.ID, strDiem: diem });
            },
            xnTung: { text: 'Xác nhận từng bản ghi', chuDe: 'từng bản ghi', loai: 'XACNHAN_HOANTHANH_DIEMTHI_NGUOIHOC',
                cot: [{ title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' }] },
            rong: 'Danh sách thi chưa có người học'
        }),
        quyen: {
            danhTu: 'danh sách thi',
            doiTuong: { goi: null, cot: [{ title: 'Mã danh sách thi', prop: 'MADANHSACHTHI', cls: 'is-nowrap' }, { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' }] },
            them: function (dl, nd, hd) {
                return P.goiPost('CMS_PhanQuyenDuLieu/Them_Thi_GiaoVien_NhapDiem', { strDST_Tui_Id: dl, strNguoiDung_Id: nd, strHanhDong_Id: hd, strGhiChu: '' });
            },
            ds: function (id) { return P.goiGet('CMS_PhanQuyenDuLieu/LayDSQuyenThi_GV_NhapDiem', { strDST_Tui_Id: id }); },
            cotDs: [{ title: 'DST - Túi', prop: 'DST_TUI_TEN' }, P.cotNguoiDung(), { title: 'Hành động', prop: 'HANHDONG_TEN' }],
            xoa: function (id) { return P.goiPost('CMS_PhanQuyenDuLieu/Xoa_Thi_GiaoVien_NhapDiem', { strId: id }); }
        }
    });
})();
