/* =========================================================================
   Khởi tạo hồ sơ — tạo / sửa nhanh hồ sơ cán bộ (thông tin tối thiểu)
   Bản gốc: ApisNhanSu/Modules/hoso/script/khoitao.js + html/khoitao.html
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 danh sách cán bộ + col-lg-9 biểu mẫu "Khởi tạo") —
   ums.crud({ master }). Cột trái: ô từ khoá + Khoa/Viện/Phòng ban → Bộ môn (gốc
   không có ô tình trạng), mục = ảnh + họ tên / mã cán bộ / ngày sinh.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       Danh sách  edu.system.getList_NhanSu → pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2
                  (strTuKhoa, strDaoTao_CoCauToChuc_Id = Bộ môn hoặc Khoa, dLaCanBoNgoaiTruong -1)
       NS_HoSoV2/LayChiTiet  GET strId            (bấm một cán bộ)
       NS_HoSoV2/ThemMoi     strId '', strAnh, strHoDem, strTen, … (thứ tự chép nguyên)
       NS_HoSoV2/CapNhat     strId + các ô trên màn; ô không có trên màn gửi "#" (= giữ nguyên cột)
       NS_HoSoV2/KeThua      sau khi Cập nhật (save_AnhHoSo)
       NS_HoSoV2/Xoa         strIds (nút Xóa khi đang sửa)
   Danh mục: NS.GITI, CHUN.CHLU, NS.LTNS, NS.TTNS, NS.LGV0, cơ cấu tổ chức (Đơn vị).
   Bắt buộc (arrValid_HS): Họ đệm, Tên, Mã cán bộ, Tình trạng, Loại đối tượng (Email bị chú thích bỏ).

   Khác gốc:
     · Biểu mẫu KHÔNG mở sẵn lúc vào màn (gốc hiện sẵn khung "Khởi tạo"): bấm "Thêm mới"
       ở đầu trang (BO-CUC luật 1). Nút "Viết lại" / "Tạo mới" của gốc thay bằng Đóng →
       Thêm mới; "Cập nhật" = Lưu khi đang sửa.
     · Ô Bộ môn khoá tới khi chọn Khoa/Viện/Phòng ban (luật cha → con).
   Giữ như gốc:
     · strLaCanBoNgoaiTruong đọc ô dropNS_LaCanBo KHÔNG có trên màn → gửi rỗng (cả thêm lẫn sửa).
     · strAnh gửi đường dẫn ảnh vừa tải (getValById('txtNS_Anh') — không getImage/copyfile).
     · strNhanXet: sửa gửi "" (không phải "#") như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nskhoitao');
    root.classList.add('nscb', 'nscb-form-anh');
    function uid() { return (ums.session && ums.session.userId) || ''; }

    var CCTC = { call: {
        action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
    }, name: 'TEN' };

    var crud = ums.crud({
        root: root,
        title: 'Khởi tạo hồ sơ',
        formTitle: 'hồ sơ cán bộ',
        icon: 'fa-user-plus',
        master: { title: 'Danh sách cán bộ', icon: 'fa-users', item: ums.nsCanBo.item,
                  empty: 'Chọn một cán bộ ở danh sách bên trái để sửa, hoặc bấm Thêm mới ở đầu trang để khởi tạo hồ sơ mới.' },
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'cctc', type: 'select', label: 'Chọn Khoa/Viện/Phòng ban' },
            { key: 'bomon', type: 'select', label: 'Bộ môn' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP', func: 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
                    strTuKhoa: f.q, strDaoTao_CoCauToChuc_Id: f.bomon || f.cctc, dLaCanBoNgoaiTruong: -1,
                    strTinhTrangNhanSu_Id: '', strChucVu_Id: '', strNguoiThucHien_Id: uid()
                };
            }
        },
        detail: function (row) { return { action: 'NS_HoSoV2/LayChiTiet', method: 'GET', strId: row.ID }; },
        formCols: 12,
        fields: [
            { key: 'strAnh', col: 'ANH', label: 'Ảnh', type: 'avatar', cols: 2 },
            { key: 'strHoDem', col: 'HODEM', label: 'Họ đệm', required: true, cols: 5 },
            { key: 'strTen', col: 'TEN', label: 'Tên', required: true, cols: 5 },
            { key: 'strTenGoiKhac', col: 'TENGOIKHAC', label: 'Bí danh', cols: 4 },
            { key: 'strNgaySinh', col: 'NGAYSINH', label: 'Ngày sinh', cols: 2 },
            { key: 'strThangSinh', col: 'THANGSINH', label: 'Tháng', cols: 2 },
            { key: 'strNamSinh', col: 'NAMSINH', label: 'Năm', cols: 2 },
            { key: 'strEmail', col: 'EMAIL', label: 'Email', cols: 5 },
            { key: 'strSDT_CaNhan', col: 'SDT_CANHAN', label: 'Điện thoại', cols: 5 },
            { key: 'strGioiTinh_Id', col: 'GIOITINH_ID', label: 'Giới tính', type: 'select', source: { dm: 'NS.GITI' }, cols: 5 },
            { key: 'strQuocTich_Id', col: 'QUOCTICH_ID', label: 'Quốc tịch', type: 'select', source: { dm: 'CHUN.CHLU' }, cols: 5 },
            { key: 'strDaoTao_CoCauToChuc_Id', col: 'DAOTAO_COCAUTOCHUC_ID', label: 'Đơn vị', type: 'select', source: CCTC,
              placeholder: 'Chọn cơ cấu tổ chức', cols: 10 },
            { key: 'strMaSo', col: 'MASO', label: 'Mã cán bộ', required: true, cols: 6 },
            { key: 'strTinhTrangNhanSu_Id', col: 'TINHTRANGNHANSU_ID', label: 'Tình trạng', type: 'select', source: { dm: 'NS.TTNS' }, required: true, cols: 6 },
            { key: 'strLoaiDoiTuong_Id', col: 'LOAIDOITUONG_ID', label: 'Loại đối tượng', type: 'select', source: { dm: 'NS.LTNS' }, required: true, cols: 6 },
            { key: 'strLoaiGiangVien_Id', col: 'LOAIGIANGVIEN_ID', label: 'Loại giảng viên', type: 'select', source: { dm: 'NS.LGV0' }, cols: 6 }
        ],
        save: function (v, row) {
            if (!row) {
                return {
                    action: 'NS_HoSoV2/ThemMoi',
                    strId: '',
                    strAnh: v.strAnh,
                    strHoDem: v.strHoDem, strTen: v.strTen, strTenGoiKhac: v.strTenGoiKhac,
                    strNgaySinh: v.strNgaySinh, strThangSinh: v.strThangSinh, strNamSinh: v.strNamSinh,
                    strEmail: v.strEmail, strSDT_CaNhan: v.strSDT_CaNhan,
                    strGioiTinh_Id: v.strGioiTinh_Id, strQuocTich_Id: v.strQuocTich_Id,
                    strDaoTao_CoCauToChuc_Id: v.strDaoTao_CoCauToChuc_Id, strMaSo: v.strMaSo,
                    strTinhTrangNhanSu_Id: v.strTinhTrangNhanSu_Id, strLoaiDoiTuong_Id: v.strLoaiDoiTuong_Id,
                    strLoaiGiangVien_Id: v.strLoaiGiangVien_Id,
                    strNguoiThucHien_Id: uid(),
                    strLaCanBoNgoaiTruong: ''
                };
            }
            var x = {
                action: 'NS_HoSoV2/CapNhat',
                strId: row.ID,
                strMaSo: v.strMaSo, strHoDem: v.strHoDem, strTen: v.strTen, strTenGoiKhac: v.strTenGoiKhac,
                strNgaySinh: v.strNgaySinh, strThangSinh: v.strThangSinh, strNamSinh: v.strNamSinh,
                strGioiTinh_Id: v.strGioiTinh_Id
            };
            ['NoiSinh', 'QueQuan', 'HKTT', 'NOHN'].forEach(function (d) {
                x['str' + d + '_DiaChi'] = '#'; x['str' + d + '_Xa_Id'] = '#'; x['str' + d + '_Huyen_Id'] = '#'; x['str' + d + '_Tinh_Id'] = '#';
            });
            x.strQuocTich_Id = v.strQuocTich_Id;
            ['strDanToc_Id', 'strTonGiao_Id', 'strTDPT_TotNghiepLop', 'strTDPT_He', 'strSoTruongCongTac', 'strThuongBinhHang_Id',
             'strGiaDinhChinhSach_Id', 'strThanhPhanXuatThan_Id', 'strDang_NgayVao', 'strDang_NgayChinhThuc', 'strDang_NoiKetNap',
             'strDoan_NgayVao', 'strDoan_NoiKetNap', 'strCongDoan_NgayVao', 'strNgu_NgayNhap', 'strNgu_NgayXuat', 'strNgu_QuanHam_Id',
             'strCanCuoc_So', 'strCanCuoc_NgayCap', 'strCanCuoc_NoiCap'].forEach(function (k) { x[k] = '#'; });
            x.strNhanXet = '';
            x.strEmail = v.strEmail;
            x.strAnh = v.strAnh;
            x.strSDT_CaNhan = v.strSDT_CaNhan;
            ['strSDT_CoQuan', 'strSDT_GiaDinh', 'strNgayTGCachMang', 'strNgayTGToChucChinhTriXH', 'strLoaiHopDongLaoDong_Id']
                .forEach(function (k) { x[k] = '#'; });
            x.strLoaiGiangVien_Id = v.strLoaiGiangVien_Id;
            x.strDaoTao_CoCauToChuc_Id = v.strDaoTao_CoCauToChuc_Id;
            x.strNguoiThucHien_Id = uid();
            x.strSoBaoHiem = '#';
            x.strTinhTrangHonNhan_Id = '#';
            x.strTinhTrangNhanSu_Id = v.strTinhTrangNhanSu_Id;
            x.strLoaiDoiTuong_Id = v.strLoaiDoiTuong_Id;
            x.strLaCanBoNgoaiTruong = '';
            return x;
        },
        onSaved: function (c, result, isEdit) {
            if (!isEdit) return;
            var id = c.editing && c.editing.ID;
            ums.api.call({ action: 'NS_HoSoV2/KeThua', strNhanSu_HoSo_v2_Id: id, strNguoiThucHien_Id: uid(), silent: true })
                .catch(function (err) { ums.api.handle(err, 'đồng bộ ảnh hồ sơ'); });
        },
        multi: false,
        rowDelete: false,
        remove: function (ids) { return ids.map(function (id) { return { action: 'NS_HoSoV2/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
    });

    /* Khoa/Viện/Phòng ban (cơ cấu không có cha) → Bộ môn (con của khoa đã chọn) */
    var F = {
        cctc: root.querySelector('[data-scope="filter"][data-k="cctc"]'),
        bomon: root.querySelector('[data-scope="filter"][data-k="bomon"]')
    };
    var con = [];
    ums.ref.coCauToChuc({}).then(function (rows) {
        var cha = [];
        rows.forEach(function (r) { (r.DAOTAO_COCAUTOCHUC_CHA_ID ? con : cha).push(r); });
        pat.fill(F.cctc, cha, { head: 'Chọn Khoa/Viện/Phòng ban' });
        pat.fill(F.bomon, [], { head: 'Bộ môn' });
    }).catch(function (err) { ums.api.handle(err, 'cơ cấu tổ chức'); });
    if (window.jQuery) {
        jQuery(F.cctc).on('select2:select select2:clear', function () {
            var id = F.cctc.value;
            pat.fill(F.bomon, id ? con.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_CHA_ID === id; }) : [], { head: 'Bộ môn' });
        });
        pat.chain([F.cctc, F.bomon], { phatLai: false });
    }
    void crud; void ui;
})();
