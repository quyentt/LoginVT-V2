/* =========================================================================
   Danh sách trúng tuyển
   Bản gốc: ApisNhapHoc/Modules/trungtuyen/html/danhsach.html + scripts/danhsach.js
   (scripts/themmoi.js cùng thư mục KHÔNG được html nào nạp — trang thử "#loop / #exclude",
   không chuyển.)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     Danh sách   edu.extend.getList_NguoiHoc_TTTS — bản Corei (vỏ indexi, TENANH "fa …"):
                 SV_CORE_NhapHoc_ThuTien_MH / PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS
                 (dDaNhapHoc -1, strTaiChinh_KeHoach_Id, strTuKhoa, pageIndex/pageSize — phân trang máy chủ)
     Kế hoạch    edu.extend.getList_KeHoachNhapHoc — bản Corei:
                 SV_CORE_NhapHoc_ThuTien_MH / PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc (cột TENKEHOACH)
                 (bản Core cũ gọi TS_NH_ThongTin_MH / pkg_nhaphoc_thongtin — API cũ, import.js gốc đã ghi rõ
                 phải dùng gói PKG_CORE_NhapHoc_ThuTien mới)
     Thêm / sửa  NH_NguoiHoc_ThongTinTuyenSinh/ThemMoi (strId rỗng) · /CapNhat (có strId) — POST, versionAPI v1.0
     Xoá         NH_NguoiHoc_ThongTinTuyenSinh/Xoa — strIds = "id1,id2," (đuôi phẩy như getCheckedIds gốc)
   Tên tham số / cột chép nguyên; các ô "…_Id" (giới tính, đối tượng, khu vực, tỉnh, huyện, tổ hợp,
   ngành, dân tộc, tôn giáo, TP xuất thân) là Ô CHỮ và gửi CHỮ — đúng như gốc.

   Bố cục như gốc (một cột): thanh lọc (kế hoạch + từ khoá + Tìm kiếm) → danh sách (Tải lại · Xoá · Thêm mới).
     · Thêm mới: biểu mẫu bốn nhóm #1 cơ bản / #3 tuyển sinh / #2 vùng miền / #4 phổ thông thay chỗ danh sách
       (gốc: khung nổi) — BO-CUC luật 1.
     · Chi tiết: hộp thoại chỉ xem (gốc: khung nổi).
     · Sửa: khung "Cập nhật thông tin" của gốc — trái: danh sách TRƯỜNG có thể sửa (tìm nhanh, "Chọn");
       phải: các trường đã chọn để sửa (bỏ bằng ×). Cập nhật gửi đủ mọi tham số: trường đang sửa lấy ô
       nhập, trường khác lấy giá trị hiện có (process_Update_NguoiHoc_TTTS). Danh sách trường đã chọn giữ
       qua các lần sửa như gốc.
   Lỗi gốc đã sửa (làm theo ý định):
     · Thêm mới: "Tổng điểm" gửi ô Tổng điểm xét (txtDiemXetDuyet_TT cho cả dDiemTS_TongDiemXetDuyet lẫn
       dDiemTS_TongDiem; ô txtTongDiem_TT không được đọc) → nay dDiemTS_TongDiem đọc ô Tổng điểm.
     · Thêm mới: Dân tộc / Tôn giáo / TP xuất thân có ô nhưng không gửi → nay gửi.
     · Chi tiết: thiếu "Hạnh kiểm 12" (không đổ) → đổ HANHKIEM 12; "Mã ngành" gốc luôn rỗng (không đọc cột
       nào) → bỏ dòng này.
     · Sang trang: gốc bỏ từ khoá đang lọc → nay giữ đúng điều kiện lọc.
   Tự chốt:
     · Kế hoạch để trống khi tìm → gửi ID người dùng làm strTaiChinh_KeHoach_Id ("lấy theo user" — đúng nhánh
       nút Tìm kiếm / Enter / đổi ô của gốc); LẦN NẠP ĐẦU khi mở màn gửi rỗng như gốc.
     · Cập nhật xong đóng khung sửa, về danh sách và nạp lại theo bộ lọc đang chọn (gốc: ở lại khung,
       nạp lại danh sách với bộ lọc rỗng).
     · Ô để trống trong khung sửa = giữ giá trị cũ (như gốc — không xoá trắng được một trường qua màn này).
   Cố ý bỏ: slimScroll, hiệu ứng slideUp/Down, ô "Mã lớp dự kiến" ở Thêm (gốc không có ô, gửi rỗng — giữ rỗng).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui;
    var root = document.getElementById('danhsachtrungtuyen');
    if (!root) return;

    function e(v) { return v === undefined || v === null ? '' : v; }
    function so(v) { var n = Number(v); return isNaN(n) || v === '' || v === null || v === undefined ? 0 : n; }
    function ngaySinh(d) { return e(d.NGAYSINH_NGAY) + '/' + e(d.NGAYSINH_THANG) + '/' + e(d.NGAYSINH_NAM); }
    function hoTen(d) { return (e(d.HODEM) + ' ' + e(d.TEN)).trim(); }

    root.innerHTML = '<div data-ds="crud"></div><div data-ds="sua" hidden></div>';
    var vCrud = root.querySelector('[data-ds="crud"]');
    var vSua = root.querySelector('[data-ds="sua"]');
    var lanDau = true;

    /* ---------- Nguồn Kế hoạch nhập học ------------------------------------- */
    var KEHOACH = {
        call: {
            action: 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIPKSAxCS4iHgokCS4gIikPKSAxCS4i',
            func: 'PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc',
            strDAOTAO_KhoaDaoTao_Id: '', strMoHinhNhapHoc_Id: '', strMoHinhApDungPhieuThu_Id: '',
            strTAICHINH_HeThongPhieu_Id: '', strMoHinhApDungPhieuRut_Id: '', strTAICHINH_HeThongRut_Id: '',
            strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000
        },
        id: 'ID', name: 'TENKEHOACH'
    };

    function o(key, label, extra) {
        var f = { key: key, label: label, placeholder: label };
        Object.keys(extra || {}).forEach(function (k) { f[k] = extra[k]; });
        return f;
    }

    var crud = ums.crud({
        root: vCrud,
        title: 'Danh sách trúng tuyển',
        listTitle: 'Danh sách',
        formTitle: 'người học trúng tuyển',
        icon: 'fa-address-card',
        empty: 'Không có dữ liệu',

        filters: [
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch nhập học', source: KEHOACH },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                var kh = f.kh || (lanDau ? '' : (ums.session && ums.session.userId) || '');
                var tk = lanDau ? '' : f.q;
                lanDau = false;
                return {
                    action: 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP',
                    func: 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS',
                    versionAPI: 'v1.0',
                    dDaNhapHoc: -1,
                    strTaiChinh_KeHoach_Id: kh,
                    strNguoiThucHien_Id: '',
                    strTuKhoa: tk
                };
            }
        },

        columns: [
            { title: 'Họ tên', cls: 'is-nowrap', render: function (d) { return ui.cell(hoTen(d), e(d.SOBAODANH)); } },
            { title: 'Giới tính', prop: 'QLSV_GIOITINH_TEN' },
            { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (d) { return ui.esc(ngaySinh(d)); } },
            { title: 'Môn 1', prop: 'DIEMTS_MON1', cls: 'is-center' },
            { title: 'Môn 2', prop: 'DIEMTS_MON2', cls: 'is-center' },
            { title: 'Môn 3', prop: 'DIEMTS_MON3', cls: 'is-center' },
            { title: 'Tổng điểm', prop: 'DIEMTS_TONGDIEM', cls: 'is-center' },
            { title: 'Điểm thưởng', prop: 'DIEMTS_DIEMTHUONG', cls: 'is-center' },
            { title: 'Tổ hợp', prop: 'TOHOPTHI_TEN', cls: 'is-center' },
            { title: 'Đối tượng dự thi', render: function (d) { return '<div class="nhtt-rong--vua">' + ui.esc(e(d.DOITUONGDUTHI_TEN)) + '</div>'; } },
            { title: 'Miễn giảm (%)', prop: 'PHANTRAMMIENGIAM', cls: 'is-center' }
        ],

        rowActions: [
            { icon: 'fa-eye', title: 'Chi tiết', onClick: function (row) { xemChiTiet(row); } },
            { icon: 'fa-pen-to-square', title: 'Sửa', onClick: function (row) { moSua(row); } }
        ],
        canEdit: false,
        rowDelete: false,

        remove: function (ids) {
            return { action: 'NH_NguoiHoc_ThongTinTuyenSinh/Xoa', versionAPI: 'v1.0', strIds: ids.join(',') + ',', strNguoiThucHien_Id: '' };
        },
        removeConfirm: function () { return 'Bạn có muốn xóa dữ liệu không?'; },

        fields: [
            o('strMaSo', 'Mã sinh viên'),
            { type: 'gap' },
            { type: 'legend', label: '#1 - Thông tin cơ bản' },
            o('strHoDem', 'Họ đệm'), o('strTen', 'Tên'),
            o('strNgaySinh', 'Ngày sinh', { type: 'date' }), o('strGioiTinh_Id', 'Giới tính'),
            o('strCMTND_So', 'Số CMND', { placeholder: 'Số chứng minh nhân dân' }), o('strSoDienThoaiCaNhan', 'Điện thoại', { placeholder: 'Số điện thoại cá nhân' }),
            o('strHoKhau_PhuongXaKhoiXom', 'Hộ khẩu', { caDong: true }),
            o('strHoKhau_TinhThanh_Id', 'Tỉnh/Thành'), o('strHoKhau_QuanHuyen_Id', 'Quận/Huyện'),
            { type: 'legend', label: '#3 - Thông tin tuyển sinh' },
            o('strToHocThi_Id', 'Tổ hợp', { placeholder: 'Tổ hợp thi' }), o('strSoBaoDanh', 'Số báo danh'),
            o('strNganhHoc_Id', 'Mã ngành'), o('strNganhHoc_Ten', 'Ngành học', { placeholder: 'Tên ngành' }),
            o('strTenTS_Mon1', 'Môn 1', { placeholder: 'Tên môn 1' }), o('dDiemTS_Mon1', 'Điểm 1', { type: 'number', placeholder: 'Điểm môn 1' }),
            o('strTenTS_Mon2', 'Môn 2', { placeholder: 'Tên môn 2' }), o('dDiemTS_Mon2', 'Điểm 2', { type: 'number', placeholder: 'Điểm môn 2' }),
            o('strTenTS_Mon3', 'Môn 3', { placeholder: 'Tên môn 3' }), o('dDiemTS_Mon3', 'Điểm 3', { type: 'number', placeholder: 'Điểm môn 3' }),
            o('dDiemTS_TongDiemXetDuyet', 'Tổng điểm xét', { type: 'number', placeholder: 'Tổng điểm xét duyệt' }), o('dDiemTS_TongDiem', 'Tổng điểm', { type: 'number' }),
            { type: 'legend', label: '#2 Thông tin vùng miền' },
            o('strDanToc_Id', 'Dân tộc'), o('strTonGiao_Id', 'Tôn giáo'),
            o('strDoiTuongDuThi_Id', 'Đối tượng'), o('strKhuVuc_Id', 'Khu vực'),
            o('strThanhPhanXuatThan_Id', 'TP xuất thân', { placeholder: 'Thành phần xuất thân' }), o('dPhanTramMienGiam', '% Miễn giảm', { type: 'number', placeholder: 'Phần trăm miễn giảm' }),
            o('strGhichu', 'Ghi chú'),
            { type: 'legend', label: '#4 - Kết quả phổ thông' },
            o('strNamTotNghiep', 'Năm tốt nghiệp'), { type: 'gap' },
            o('strKQCC_10_XepLoai', 'Xếp loại lớp 10'), o('strKQCC_11_XepLoai', 'Xếp loại lớp 11'),
            o('strKQCC_12_XepLoai', 'Xếp loại lớp 12'), o('strKQCC_10_HocLuc', 'Học lực lớp 10'),
            o('strKQCC_11_HocLuc', 'Học lực lớp 11'), o('strKQCC_12_HocLuc', 'Học lực lớp 12'),
            o('strKQCC_10_HanhKiem', 'Hạnh kiểm lớp 10'), o('strKQCC_11_HanhKiem', 'Hạnh kiểm lớp 11'),
            o('strKQCC_12_HanhKiem', 'Hạnh kiểm lớp 12')
        ],

        /* process_Save_NguoiHoc_TTTS → update_NguoiHoc_TTTS (ThemMoi vì strId rỗng) */
        save: function (v) {
            var f = crud.filterValues();
            var p = { action: 'NH_NguoiHoc_ThongTinTuyenSinh/ThemMoi', versionAPI: 'v1.0', strId: '', strTAICHINH_KeHoach_Id: f.kh, strMaLopDuKien: '' };
            Object.keys(v).forEach(function (k) { p[k] = v[k]; });
            p.strNguoiThucHien_Id = '';
            return p;
        },

        onForm: function (row, c) {
            var tools = c.z('form').querySelector('.ums-panel__tools');
            if (tools.querySelector('[data-ds="vietlai"]')) return;
            var luu = tools.querySelector('[data-c="' + c.uid + ':save"]');
            var tmp = document.createElement('div');
            tmp.innerHTML = ui.btn('reload', { text: 'Viết lại', mod: 'out-success', icon: 'fa-pen-to-square', attr: { 'data-ds': 'vietlai' } });
            tools.insertBefore(tmp.firstChild, luu);
            tools.querySelector('[data-ds="vietlai"]').addEventListener('click', function () { c.fillForm(null); });
        }
    });

    /* =======================================================================
       Chi tiết (zone_input_chitiet_trungtuyen) — hộp chỉ xem
       ======================================================================= */
    function kv(nhan, gt, dam) {
        return '<div class="ums-kv' + (dam ? ' ums-kv--dam' : '') + '"><span>' + ui.esc(nhan) + '</span><b>' + ui.esc(gt) + '</b></div>';
    }
    function khoi(tieuDe, dong) { return '<div><div class="ums-legend">' + ui.esc(tieuDe) + '</div>' + dong.join('') + '</div>'; }
    function xemChiTiet(d) {
        var queQuan = e(d.HOKHAU_PHUONGXAKHOIXOM) + ' - ' + e(d.HOKHAU_QUANHUYEN_TEN) + ' - ' + e(d.HOKHAU_TINHTHANH_TEN);
        ui.dialog({
            title: 'Chi tiết', icon: 'fa-circle-info', size: 'xl',
            body: '<div class="ums-grid ums-grid--2 ums-cols">' +
                khoi('#1 - Thông tin cơ bản', [
                    kv('Họ tên', hoTen(d).toUpperCase(), true), kv('Mã sinh viên', e(d.MASO)), kv('Số báo danh', e(d.SOBAODANH)),
                    kv('Ngày sinh', ngaySinh(d)), kv('Giới tính', e(d.QLSV_GIOITINH_TEN)),
                    kv('Số CMND', e(d.CMTND_SO)), kv('Điện thoại', e(d.SODIENTHOAICANHAN)), kv('Hộ khẩu', queQuan)
                ]) +
                khoi('#3 - Thông tin tuyển sinh', [
                    kv('Ngành học', e(d.NGANHHOC_TEN).toUpperCase()), kv('Tổ hợp', e(d.TOHOPTHI_TEN)),
                    kv(e(d.TENTS_MON1) || 'Môn 1', so(d.DIEMTS_MON1).toFixed(2)),
                    kv(e(d.TENTS_MON2) || 'Môn 2', so(d.DIEMTS_MON2).toFixed(2)),
                    kv(e(d.TENTS_MON3) || 'Môn 3', so(d.DIEMTS_MON3).toFixed(2)),
                    kv('Tổng điểm', so(d.DIEMTS_TONGDIEM).toFixed(2)), kv('Điểm xét duyệt', so(d.DIEMTS_TONGDIEMXETTUYEN).toFixed(2))
                ]) +
                khoi('#2 Thông tin vùng miền', [
                    kv('Dân tộc', e(d.DANTOC_TEN)), kv('Tôn giáo', e(d.TONGIAO_TEN)),
                    kv('Đối tượng', e(d.DOITUONGDUTHI_TEN)), kv('Khu vực', e(d.KHUVUC_TEN)),
                    kv('TP xuất thân', e(d.THANHPHANXUATTHAN_TEN)), kv('% miễn giảm', e(d.PHANTRAMMIENGIAM)), kv('Ghi chú', e(d.GHICHU))
                ]) +
                khoi('#4 - Kết quả phổ thông', [
                    kv('Năm tốt nghiệp', e(d.NAMTOTNGHIEP)),
                    kv('Xếp loại 10', e(d.KQCC_10_XEPLOAI)), kv('Xếp loại 11', e(d.KQCC_11_XEPLOAI)), kv('Xếp loại 12', e(d.KQCC_12_XEPLOAI)),
                    kv('Học lực 10', e(d.KQCC_10_HOCLUC)), kv('Học lực 11', e(d.KQCC_11_HOCLUC)), kv('Học lực 12', e(d.KQCC_12_HOCLUC)),
                    kv('Hạnh kiểm 10', e(d.KQCC_10_HANHKIEM)), kv('Hạnh kiểm 11', e(d.KQCC_11_HANHKIEM)), kv('Hạnh kiểm 12', e(d.KQCC_12_HANHKIEM))
                ]) +
                '</div>'
        });
    }

    /* =======================================================================
       Cập nhật thông tin (zone_input_edit_trungtuyen) — chọn trường cần sửa
       structureData_NguoiHoc_TTTS: ID, MA (id ô gốc), TEN; `p` = tham số gửi,
       `v(d)` = giá trị hiện có (loadValIntoInput_NguoiHoc = giá trị dự phòng của process_Update)
       ======================================================================= */
    var TRUONG = [
        ['001', 'txtPhanTramMienGiam', 'Phần trăm miễn giảm', 'dPhanTramMienGiam', function (d) { return String(so(d.PHANTRAMMIENGIAM)); }],
        ['002', 'txtSoBaoDanh', 'Số báo danh', 'strSoBaoDanh', function (d) { return e(d.SOBAODANH); }],
        ['003', 'txtMaLopDuKien', 'Mã lớp dự kiến', 'strMaLopDuKien', function (d) { return e(d.MALOPDUKIEN); }],
        ['004', 'txtMaSinhVien', 'Mã sinh viên', 'strMaSo', function (d) { return e(d.MASO); }],
        ['005', 'txtHoDem', 'Họ đệm', 'strHoDem', function (d) { return e(d.HODEM); }],
        ['006', 'txtTen', 'Tên', 'strTen', function (d) { return e(d.TEN); }],
        ['007', 'txtSoCMND', 'Số CMND', 'strCMTND_So', function (d) { return e(d.CMTND_SO); }],
        ['008', 'txtNgaySinh', 'Ngày sinh', 'strNgaySinh', ngaySinh],
        ['009', 'txtGioiTinh', 'Giới tính', 'strGioiTinh_Id', function (d) { return e(d.QLSV_GIOITINH_TEN); }],
        ['010', 'txtDoiTuongDuThi', 'Đối tượng ưu tiên', 'strDoiTuongDuThi_Id', function (d) { return e(d.DOITUONGDUTHI_TEN); }],
        ['011', 'txtKhuVuc', 'Khu vực', 'strKhuVuc_Id', function (d) { return e(d.KHUVUC_TEN); }],
        ['012', 'txtHoKhau_Tinh', 'Tỉnh/Thành', 'strHoKhau_TinhThanh_Id', function (d) { return e(d.HOKHAU_TINHTHANH_TEN); }],
        ['013', 'txtHoKhau_Huyen', 'Quận/Huyện', 'strHoKhau_QuanHuyen_Id', function (d) { return e(d.HOKHAU_QUANHUYEN_TEN); }],
        ['014', 'txtHoKhau_PhuongXaKhoiXom', 'Phường/xã, khối, xóm', 'strHoKhau_PhuongXaKhoiXom', function (d) { return e(d.HOKHAU_PHUONGXAKHOIXOM); }],
        ['015', 'txtNamTotNghiep', 'Năm tốt nghiệp', 'strNamTotNghiep', function (d) { return e(d.NAMTOTNGHIEP); }],
        ['016', 'txtTongDiemXetDuyet', 'Tổng điểm xét duyệt', 'dDiemTS_TongDiemXetDuyet', function (d) { return e(d.DIEMTS_TONGDIEMXETTUYEN); }],
        ['017', 'txtTongDiem', 'Tổng điểm', 'dDiemTS_TongDiem', function (d) { return e(d.DIEMTS_TONGDIEM); }],
        ['018', 'txtTenMon1', 'Tên môn 1', 'strTenTS_Mon1', function (d) { return e(d.TENTS_MON1); }],
        ['019', 'txtTenMon2', 'Tên môn 2', 'strTenTS_Mon2', function (d) { return e(d.TENTS_MON2); }],
        ['020', 'txtTenMon3', 'Tên môn 3', 'strTenTS_Mon3', function (d) { return e(d.TENTS_MON3); }],
        ['021', 'txtDiemMon1', 'Điểm môn 1', 'dDiemTS_Mon1', function (d) { return e(d.DIEMTS_MON1); }],
        ['022', 'txtDiemMon2', 'Điểm môn 2', 'dDiemTS_Mon2', function (d) { return e(d.DIEMTS_MON2); }],
        ['023', 'txtDiemMon3', 'Điểm môn 3', 'dDiemTS_Mon3', function (d) { return e(d.DIEMTS_MON3); }],
        ['024', 'txtMaNganh', 'Mã ngành', 'strNganhHoc_Id', function (d) { return e(d.NGANHHOC_TEN); }],
        ['025', 'txtTenNganh', 'Tên ngành', 'strNganhHoc_Ten', function (d) { return e(d.NGANHHOC_TEN); }],
        ['026', 'txtDienThoai', 'Số điện thoại', 'strSoDienThoaiCaNhan', function (d) { return e(d.SODIENTHOAICANHAN); }],
        ['027', 'txtHocLuc10', 'Học lực 10', 'strKQCC_10_HocLuc', function (d) { return e(d.KQCC_10_HOCLUC); }],
        ['028', 'txtHocLuc11', 'Học lực 11', 'strKQCC_11_HocLuc', function (d) { return e(d.KQCC_11_HOCLUC); }],
        ['029', 'txtHocLuc12', 'Học lực 12', 'strKQCC_12_HocLuc', function (d) { return e(d.KQCC_12_HOCLUC); }],
        ['030', 'txtXepLoai10', 'Xếp loại 10', 'strKQCC_10_XepLoai', function (d) { return e(d.KQCC_10_XEPLOAI); }],
        ['031', 'txtXepLoai11', 'Xếp loại 11', 'strKQCC_11_XepLoai', function (d) { return e(d.KQCC_11_XEPLOAI); }],
        ['032', 'txtXepLoai12', 'Xếp loại 12', 'strKQCC_12_XepLoai', function (d) { return e(d.KQCC_12_XEPLOAI); }],
        ['033', 'txtHanhKiem10', 'Hạnh kiểm 10', 'strKQCC_10_HanhKiem', function (d) { return e(d.KQCC_10_HANHKIEM); }],
        ['034', 'txtHanhKiem11', 'Hạnh kiểm 11', 'strKQCC_11_HanhKiem', function (d) { return e(d.KQCC_11_HANHKIEM); }],
        ['035', 'txtHanhKiem12', 'Hạnh kiểm 12', 'strKQCC_12_HanhKiem', function (d) { return e(d.KQCC_12_HANHKIEM); }],
        ['036', 'txtToHopThi', 'Tổ hợp thi', 'strToHocThi_Id', function (d) { return e(d.TOHOPTHI_TEN); }],
        ['037', 'txtGhiChu', 'Ghi chú', 'strGhichu', function (d) { return e(d.GHICHU); }],
        ['038', 'txtDanToc', 'Dân tộc', 'strDanToc_Id', function (d) { return e(d.DANTOC_TEN); }],
        ['039', 'txtTonGiao', 'Tôn giáo', 'strTonGiao_Id', function (d) { return e(d.TONGIAO_TEN); }],
        ['040', 'txtThanhPhanXuatThan', 'Thành phần xuất thân', 'strThanhPhanXuatThan_Id', function (d) { return e(d.THANHPHANXUATTHAN_TEN); }]
    ].map(function (x) { return { ID: x[0], MA: x[1], TEN: x[2], p: x[3], v: x[4] }; });
    function truong(id) { return TRUONG.filter(function (t) { return t.ID === id; })[0]; }

    var daChon = [];      // objChinhSuaTT_Select — giữ qua các lần sửa như gốc
    var dangSua = null;   // dtNguoiHoc_Edit

    vSua.innerHTML =
        '<div class="ums-page__head">' +
            '<h1 class="ums-page__title ums-u-mb-0">Cập nhật thông tin: <span data-ds="ten"></span></h1>' +
            '<div class="ums-page__actions">' +
                ui.btn('close', { attr: { 'data-ds': 'dong' } }) +
                ui.btn('reload', { text: 'Viết lại', mod: 'out-success', icon: 'fa-pen-to-square', attr: { 'data-ds': 'vietlaisua' } }) +
                ui.btn('save', { text: 'Cập nhật', attr: { 'data-ds': 'capnhat' } }) +
            '</div></div>' +
        '<div class="ums-grid ums-grid--2 ums-cols">' +
            ums.pat.panel({ title: 'Tìm kiếm thông tin chỉnh sửa', icon: 'fa-list-check', flush: true,
                tools: '<input class="ums-input ums-input--sm" data-ds="tim" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off">',
                body: '<div data-ds="dstruong"></div>' }) +
            ums.pat.panel({ title: 'Nội dung chỉnh sửa', icon: 'fa-pen-to-square', body: '<div data-ds="noidung"></div>' }) +
        '</div>';

    function veTruong() {
        var q = (vSua.querySelector('[data-ds="tim"]').value || '').trim().toLowerCase();
        ui.table({
            el: vSua.querySelector('[data-ds="dstruong"]'),
            rows: TRUONG.filter(function (t) { return !q || t.TEN.toLowerCase().indexOf(q) >= 0; }),
            empty: 'Không có thông tin phù hợp',
            columns: [
                { title: 'Tên thông tin', prop: 'TEN' },
                /* Ô đánh dấu (người dùng 2026-09-27: "cái check đổi thành checkbox") — đánh dấu = thêm trường vào khung sửa,
                   bỏ dấu = gỡ; trạng thái khớp với nút xoá ở khung phải */
                { title: 'Chọn', cls: 'is-center is-actions', width: '70px', render: function (t) {
                    return '<input type="checkbox" data-chon="' + t.ID + '" title="Chọn để sửa"' + (daChon.indexOf(t.ID) >= 0 ? ' checked' : '') + '>';
                } }
            ]
        });
    }
    function veNoiDung() {
        /* giữ chữ đang gõ khi thêm / bớt trường */
        var go = {};
        Array.prototype.forEach.call(vSua.querySelectorAll('[data-sua]'), function (x) { go[x.getAttribute('data-sua')] = x.value; });
        var h = daChon.map(function (id) {
            var t = truong(id);
            return '<div class="ums-row" style="align-items:flex-end;margin-bottom:var(--ums-sp-2)">' +
                '<div class="ums-u-flex1">' + ui.field(t.TEN, '<input class="ums-input" data-sua="' + t.ID + '" placeholder="Nhập ' + ui.esc(t.TEN.toLowerCase()) + '" autocomplete="off" value="' + ui.esc(id in go ? go[id] : (dangSua ? t.v(dangSua) : '')) + '">') + '</div>' +
                '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-bo="' + t.ID + '" title="Bỏ trường này"><i class="fa-light fa-trash-can"></i></button>' +
                '</div>';
        }).join('');
        vSua.querySelector('[data-ds="noidung"]').innerHTML = h || ui.empty('Chọn thông tin cần sửa ở danh sách bên trái', 'fa-hand-pointer');
    }

    function moSua(d) {
        dangSua = d;
        vSua.querySelector('[data-ds="ten"]').textContent = hoTen(d);
        vSua.querySelector('[data-ds="tim"]').value = '';
        veTruong();
        veNoiDung();
        ui.swap(vCrud, vSua, { top: true });
    }
    function dongSua() { dangSua = null; ui.swap(vSua, vCrud, { top: true }); }

    vSua.addEventListener('input', function (ev) { if (ev.target.matches('[data-ds="tim"]')) veTruong(); });
    vSua.addEventListener('change', function (ev) {
        var c = ev.target.closest('input[data-chon]');
        if (!c) return;
        var id = c.getAttribute('data-chon');
        daChon = daChon.filter(function (x) { return x !== id; });
        if (c.checked) daChon.push(id);
        veNoiDung();
    });
    vSua.addEventListener('click', function (ev) {
        var b = ev.target.closest('button');
        if (!b || !vSua.contains(b)) return;
        if (b.hasAttribute('data-bo')) {
            var bo = b.getAttribute('data-bo');
            daChon = daChon.filter(function (x) { return x !== bo; });
            veNoiDung();
            var ck = vSua.querySelector('input[data-chon="' + bo + '"]');
            if (ck) ck.checked = false;
        } else if (b.getAttribute('data-ds') === 'dong') dongSua();
        else if (b.getAttribute('data-ds') === 'vietlaisua') {
            Array.prototype.forEach.call(vSua.querySelectorAll('[data-sua]'), function (x) { x.value = ''; });
        } else if (b.getAttribute('data-ds') === 'capnhat') capNhat(b);
    });

    /* process_Update_NguoiHoc_TTTS + update_NguoiHoc_TTTS (strId có → CapNhat) */
    function capNhat(btn) {
        var d = dangSua;
        if (!d) return;
        var p = {
            action: 'NH_NguoiHoc_ThongTinTuyenSinh/CapNhat', versionAPI: 'v1.0',
            strId: d.ID, strTAICHINH_KeHoach_Id: e(d.TAICHINH_KEHOACHNHAPHOC_ID)
        };
        TRUONG.forEach(function (t) {
            var o = vSua.querySelector('[data-sua="' + t.ID + '"]');
            var val = o ? (o.value || '').trim() : '';
            p[t.p] = val !== '' ? val : t.v(d);
        });
        p.strNguoiThucHien_Id = '';
        btn.disabled = true;
        ums.api.call(p).then(function () {
            ui.toast('Cập nhật thành công!', 'ok');
            dongSua();
            crud.load();
        }).catch(function (err) { ums.api.handle(err, 'NH_NguoiHoc_ThongTinTuyenSinh.CapNhat'); })
          .then(function () { btn.disabled = false; });
    }
})();
