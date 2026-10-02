/* Dữ liệu mẫu cho màn "Tự nhập hồ sơ" — chỉ dùng ở chế độ dựng thử.
   Lưu (Them_QLSV_KeHoach_DuLieu) đổi luôn dữ liệu trong bộ nhớ để màn hiện
   đúng giá trị vừa nhập sau khi nạp lại. */
(function () {
    'use strict';
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';

    /* [ID, TAB, Nhóm, Tên, Kiểu, bắt buộc, giá trị đang có, thêm] */
    var TRUONG = [
        ['F01', 'TAB1', 'Thông tin cá nhân', 'Họ và tên khai sinh', 'TEXT', 1, 'Lăng Văn Huy', { TENANH: 'fa fa-user' }],
        ['F02', 'TAB1', 'Thông tin cá nhân', 'Ngày sinh', 'DATE', 1, '18/07/2004', { TENANH: 'fa fa-calendar' }],
        ['F03', 'TAB1', 'Thông tin cá nhân', 'Giới tính', 'LIST', 0, 'NAM', { MABANGDANHMUC: 'CHUN.GITI' }],
        ['F04', 'TAB1', 'Giấy tờ tuỳ thân', 'Số căn cước công dân', 'TEXT', 1, '001204012345', { DODAI: 12, TENANH: 'fa fa-id-card' }],
        ['F05', 'TAB1', 'Giấy tờ tuỳ thân', 'Mã sinh viên', 'TEXT', 0, '25001029', { DUOCSUA: 0 }],
        ['F06', 'TAB1', 'Liên hệ', 'Điện thoại cá nhân', 'NUMBER', 0, '0912345678', { TENANH: 'fa fa-phone' }],
        ['F07', 'TAB1', 'Liên hệ', 'Nguyện vọng, đề nghị khác', 'TEXT', 0, '', { DORONG: 70 }],
        /* Tên nhóm lệch khoảng trắng / chữ hoa → vẫn gộp vào khối "Liên hệ"; nhóm rỗng → "THÔNG TIN CHUNG" */
        ['F08', 'TAB1', ' liên  hệ ', 'Email cá nhân', 'TEXT', 0, 'huy.lv@gmail.com', {}],
        ['F09', 'TAB1', '', 'Tôn giáo', 'TEXT', 0, 'Không', {}],
        /* LIST nối tầng: F30 (THONGTIN5 = F31) — đổi Khu vực thì Nơi học THPT lọc theo QUANHECHA_ID */
        ['F30', 'TAB1', 'Quá trình học THPT', 'Khu vực tuyển sinh', 'LIST', 0, 'KV1', { MABANGDANHMUC: 'DM.KVTS', THONGTIN5: 'F31' }],
        ['F31', 'TAB1', 'Quá trình học THPT', 'Nơi học THPT', 'LIST', 0, 'KV1-HN', { MABANGDANHMUC: 'DM.KVTS' }],

        ['F10', 'TAB2', 'Hộ khẩu thường trú', 'Tỉnh/Thành phố', 'TINH', 1, 'T01', { NHOM: 'HKTT', THONGTIN3: 'F14' }],
        ['F11', 'TAB2', 'Hộ khẩu thường trú', 'Quận/Huyện', 'HUYEN', 0, 'H005', { NHOM: 'HKTT' }],
        ['F12', 'TAB2', 'Hộ khẩu thường trú', 'Phường/Xã', 'XA', 0, '', { NHOM: 'HKTT' }],
        ['F13', 'TAB2', 'Hộ khẩu thường trú', 'Số nhà, đường phố', 'TEXT', 0, 'Số 1 Nguyễn Phong Sắc', {}],
        /* TINH nối tầng: F10 (THONGTIN3 = F14) — đổi tỉnh thì Công an cấp CCCD lọc theo tỉnh */
        ['F14', 'TAB2', 'Hộ khẩu thường trú', 'Công an nơi đăng ký', 'LIST', 0, 'CA-HN', { MABANGDANHMUC: 'DM.CATINH' }],

        ['F20', 'TAB3', 'Hồ sơ minh chứng', 'Bản sao căn cước công dân', 'FILE', 0, '', {}],
        ['F21', 'TAB3', 'Hồ sơ minh chứng', 'Học bạ THPT', 'FILE', 0, '', {}]
    ];
    var XN = { F01: 'Đã xác nhận', F04: 'Đã xác nhận', F10: 'Chờ xác nhận' };

    var kho = TRUONG.map(function (t) {
        var r = {
            ID: t[0], TAB_THONGTIN_ID: t[1], THUOCNHOM: t[2], TEN: t[3], KIEUDULIEU: t[4],
            BATBUOC: t[5], DUOCSUA: 1, DORONG: null, DODAI: null, MABANGDANHMUC: '', NHOM: '',
            TENANH: '', TRUONGTHONGTIN_GIATRI: t[6], THONGTINXACMINH: t[6],
            KETQUAXACNHAN_TEN: XN[t[0]] || ''
        };
        Object.keys(t[7]).forEach(function (k) { r[k] = t[7][k]; });
        return r;
    });

    ums.demo.add({
        'pkg_hososinhvien_kehoach.LayDSKeHoachNhapHoSo': [
            { ID: 'KH01', MOTA: 'Kế hoạch nhập hồ sơ sinh viên khoá 2025', XACNHANTHONGTIN: '1' },
            { ID: 'KH02', MOTA: 'Bổ sung hồ sơ xét học bổng đợt 1', XACNHANTHONGTIN: '1' }
        ],
        'pkg_hososinhvien_kehoach.LayDSTabThongTinNguoiHoc': [
            { ID: 'TAB1', TAB_THONGTIN_TEN: 'Thông tin chung', TAB_THONGTIN_TENANH: 'fa fa-user' },
            { ID: 'TAB2', TAB_THONGTIN_TEN: 'Địa chỉ liên hệ', TAB_THONGTIN_TENANH: 'fa fa-map-marker' },
            { ID: 'TAB3', TAB_THONGTIN_TEN: 'Hồ sơ minh chứng', TAB_THONGTIN_TENANH: 'fa fa-paperclip' },
            /* Tab không có trường nào → không hiện (kéo gốc 30/9) */
            { ID: 'TAB4', TAB_THONGTIN_TEN: 'Thông tin gia đình', TAB_THONGTIN_TENANH: 'fa fa-users' }
        ],
        'pkg_hososinhvien_kehoach.LayDSHoSoChoPhepSVNhap': function () { return kho.slice(); },
        'pkg_hososinhvien_kehoach.Them_QLSV_KeHoach_DuLieu': function (o) {
            var r = kho.filter(function (x) { return x.ID === o.strTruongThongTin_Id; })[0];
            if (r) {
                r.TRUONGTHONGTIN_GIATRI = o.strTruongThongTin_GiaTri;
                r.THONGTINXACMINH = o.strThongTinXacMinh;
            }
            return { rows: [], message: o.strTruongThongTin_Id };
        },

        /* Danh mục của trường kiểu LIST + kiểu TINH/HUYEN/XA */
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CHUN.GITI': [
            { ID: 'NAM', MA: 'NAM', TEN: 'Nam' }, { ID: 'NU', MA: 'NU', TEN: 'Nữ' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DM.KVTS': [
            { ID: 'KV1', MA: 'KV1', TEN: 'Khu vực 1', QUANHECHA_ID: null },
            { ID: 'KV2', MA: 'KV2', TEN: 'Khu vực 2', QUANHECHA_ID: null },
            { ID: 'KV1-HN', MA: 'KV1-HN', TEN: 'Hà Giang (KV1)', QUANHECHA_ID: 'KV1' },
            { ID: 'KV1-LC', MA: 'KV1-LC', TEN: 'Lào Cai (KV1)', QUANHECHA_ID: 'KV1' },
            { ID: 'KV2-ND', MA: 'KV2-ND', TEN: 'Nam Định (KV2)', QUANHECHA_ID: 'KV2' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DM.CATINH': [
            { ID: 'CA-HN', MA: 'CA-HN', TEN: 'Công an TP Hà Nội', QUANHECHA_ID: 'T01' },
            { ID: 'CA-ND', MA: 'CA-ND', TEN: 'Công an tỉnh Nam Định', QUANHECHA_ID: 'T36' }
        ]
    });
    var fx = {};
    fx[D + 'CHUN.DMTT'] = [
        { ID: 'T01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null },
        { ID: 'T36', TEN: 'Tỉnh Nam Định', QUANHECHA_ID: null },
        { ID: 'H005', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T01' },
        { ID: 'H006', TEN: 'Quận Đống Đa', QUANHECHA_ID: 'T01' },
        { ID: 'H356', TEN: 'Huyện Hải Hậu', QUANHECHA_ID: 'T36' },
        { ID: 'X167', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H005' },
        { ID: 'X168', TEN: 'Phường Nghĩa Tân', QUANHECHA_ID: 'H005' },
        { ID: 'X900', TEN: 'Xã Hải Hà', QUANHECHA_ID: 'H356' }
    ];
    ums.demo.add(fx);
})();
