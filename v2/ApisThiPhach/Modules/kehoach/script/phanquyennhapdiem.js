/* =========================================================================
   Phân quyền nhập theo Túi (Thi phách) — cấu hình cho khung ums.tpPq.man (_tp_pq.js, _tp_pq_nhap.js)
   Bản gốc: ApisThiPhach/Modules/kehoach/html/phanquyennhapdiem.html + script/phanquyennhapdiem.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       Bộ lọc: TP_Chung/LayThoiGian → LayLoaiDiem → LayHinhThucThi → LayDotThi → LayHocPhan
       Danh sách: TP_Chung/LayDotTaoPhach (strDotThi_Id, strDaoTao_HocPhan_Id) → TEN, QUYTACTAOTUI_TEN, QUYTACTAOPHACH_TEN, BUOCNHAY, SOBATDAU
       Chi tiết: TP_Chung/LayDSTuiTheoDotPhach (strThi_DotPhach_Id) · TP_XuLy/LayDSPhachTheoTui (strThi_TuiBai_Id)
         · POST TP_XuLy/CapNhat_DiemPhachTheoTuiBai (strChucNang_Id, strUngDung_Id, strThi_TuiBai_NguoiHoc_Id, strSoPhach, strDiem)
       Xác nhận: đợt phách XACNHAN_HOANTHANH_DIEMTUIBAI · theo túi XACNHAN_HOANTHANH_DIEM_TUIBAI ·
         từng phách XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC
       Phân quyền: đối tượng TP_Chung/LayDSTuiTheoDotPhach (strThi_DotPhach_Id = các đợt đánh dấu nối dấu phẩy) → TEN, THI_DOTPHACH_TEN
         · POST CMS_PhanQuyenDuLieu/Them_Thi_GiaoVien_NhapDiem (strDST_Tui_Id, strNguoiDung_Id, strHanhDong_Id, strGhiChu rỗng)
         · CMS_PhanQuyenDuLieu/LayDSQuyenDotPhach_GV_NhapDiem (strThi_DotPhach_Id) → DST_TUI_TEN, NGUOIDUNG_TAIKHOAN, NGUOIDUNG_TENDAYDU, HANHDONG_TEN
         · POST CMS_PhanQuyenDuLieu/Xoa_Thi_GiaoVien_NhapDiem (strId)
       Báo cáo + Import (gốc có cả hai vùng): strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDanhSachThi_Id (đợt mở gần nhất) + mỗi đợt đánh dấu
   Không chép: ô từ khoá gốc KHÔNG gửi đi → lọc tại chỗ theo tên đợt phách. Mã chết: .btnAdd, #btnSave_NhapDiem, #tblTuiBai,
     delete_NhapDiem (TP_DotPhach/Xoa — không nút nào gọi), #tblChuaGan / #tblDaGan.
   Giữ như gốc: mở màn nạp ngay danh sách (lọc trống), đổi ô lọc nào cũng nạp lại; hai mã xác nhận chỉ khác dấu gạch dưới.
   ========================================================================= */
(function () {
    'use strict';
    var P = ums.tpPq, e = P.e;
    P.man(document.getElementById('tp-phanquyennhapdiem'), {
        tieuDe: 'Phân quyền nhập theo Túi',
        loc: P.locThi({}), tuTai: true, nutO: 'trang',
        ds: {
            goi: function (L) { return P.goiGet('TP_Chung/LayDotTaoPhach', { strDotThi_Id: L.v('dot'), strDaoTao_HocPhan_Id: L.v('mon') }); },
            khop: function (x) { return e(x.TEN); }, rong: 'Không có đợt phách',
            cot: function () { return [{ title: 'Đợt phách', render: function (x, i) { return P.lk(x.TEN, i); } }, P.cotQuyen(), P.cotChon('cd')]; }
        },
        xacNhan: { loai: 'XACNHAN_HOANTHANH_DIEMTUIBAI', chuDe: 'đợt phách' },
        baoCao: { import: true, collect: function (add, ctx) {
            add('strThi_DotThi_Id', ctx.L.v('dot')); add('strDaoTao_HocPhan_Id', ctx.L.v('mon')); add('strDanhSachThi_Id', ctx.moDong ? ctx.moDong.ID : '');
            ctx.daChon().forEach(function (x) { add('strDanhSachThi_Id', x.ID); });
        } },
        chiTiet: P.nhapDiem({
            tieuDe: function (d) {
                return 'Đánh túi bài thi của đợt phách đang chọn ' + e(d.TEN) + ' - ' + [d.QUYTACTAOTUI_TEN, d.QUYTACTAOPHACH_TEN, d.BUOCNHAY, d.SOBATDAU].map(e).join(' - ');
            },
            tui: { goi: function (id) { return P.goiGet('TP_Chung/LayDSTuiTheoDotPhach', { strThi_DotPhach_Id: id }); } },
            ds: function (id) { return P.goiGet('TP_XuLy/LayDSPhachTheoTui', { strThi_TuiBai_Id: id }); },
            cot: [{ title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' }, { diem: true }, { title: 'Mức vi phạm', prop: 'THONGTINXULY' },
                { title: 'Người cập nhật', prop: 'NGUOISUA_TAIKHOAN' }, { title: 'Ngày cập nhật', prop: 'NGAYSUA_DD_MM_YYYY', cls: 'is-center is-nowrap' }],
            luu: function (x, diem) {
                return P.goiPost('TP_XuLy/CapNhat_DiemPhachTheoTuiBai', { strChucNang_Id: P.cn(), strUngDung_Id: P.vt(),
                    strThi_TuiBai_NguoiHoc_Id: x.ID, strSoPhach: x.SOPHACH, strDiem: diem });
            },
            xnNguon: { text: 'Xác nhận theo túi', chuDe: 'theo túi', loai: 'XACNHAN_HOANTHANH_DIEM_TUIBAI' },
            xnTung: { text: 'Xác nhận từng phách', chuDe: 'từng phách', loai: 'XACNHAN_HOANTHANH_DIEM_TUIBAI_NGUOIHOC',
                cot: [{ title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' }] },
            rong: 'Túi chưa có phách'
        }),
        quyen: {
            danhTu: 'túi bài',
            doiTuong: { goi: function (ids) { return P.goiGet('TP_Chung/LayDSTuiTheoDotPhach', { strThi_DotPhach_Id: ids.toString() }); },
                cot: [{ title: 'Tên túi', prop: 'TEN' }, { title: 'Đợt phách', prop: 'THI_DOTPHACH_TEN' }] },
            them: function (dl, nd, hd) {
                return P.goiPost('CMS_PhanQuyenDuLieu/Them_Thi_GiaoVien_NhapDiem', { strDST_Tui_Id: dl, strNguoiDung_Id: nd, strHanhDong_Id: hd, strGhiChu: '' });
            },
            ds: function (id) { return P.goiGet('CMS_PhanQuyenDuLieu/LayDSQuyenDotPhach_GV_NhapDiem', { strThi_DotPhach_Id: id }); },
            cotDs: [{ title: 'DST - Túi', prop: 'DST_TUI_TEN' }, P.cotNguoiDung(), { title: 'Hành động', prop: 'HANHDONG_TEN' }],
            xoa: function (id) { return P.goiPost('CMS_PhanQuyenDuLieu/Xoa_Thi_GiaoVien_NhapDiem', { strId: id }); }
        }
    });
})();
