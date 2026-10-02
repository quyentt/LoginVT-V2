/* Dữ liệu mẫu dùng chung cho sáu màn phân quyền dạng lưới (script/_pq.js) — chỉ dùng ở chế độ dựng thử.
   ums.demo.pqKho: kho quyền trong bộ nhớ để Phân quyền xong nạp lại thấy ngay thay đổi.
   Khoá của một quyền = strNguoiDung_Id | strToHopBoDuLieuQuyen | strHanhDong_Id (đúng ba tham số
   Them_PhanQuyen_DuLieu ghi), giá trị = QUYEN_ID. */
(function () {
    var kho = {}, seq = 1;
    function k(nd, th, hd) { return (nd || '') + '|' + (th || '') + '|' + (hd || ''); }
    var K = ums.demo.pqKho = {
        them: function (nd, th, hd) { var key = k(nd, th, hd); if (!kho[key]) kho[key] = 'Q' + (seq++); return kho[key]; },
        co: function (nd, th, hd) { return kho[k(nd, th, hd)] || null; },
        xoaId: function (ids) {
            String(ids || '').split(',').forEach(function (id) {
                Object.keys(kho).forEach(function (x) { if (kho[x] === id) delete kho[x]; });
            });
        },
        xoa: function (nd, th, hd) { delete kho[k(nd, th, hd)]; },
        /* Dòng trả về của các lời gọi "quyền của một lá": mỗi cột một dòng { ID, QUYEN, QUYEN_ID } */
        dong: function (cot, fn) {
            return cot.map(function (id) { var q = fn(id); return { ID: id, QUYEN: q ? 1 : 0, QUYEN_ID: q }; });
        }
    };

    /* Người dùng theo chức năng (cột của 4 màn) — FULLNAME / NAME như máy chủ trả */
    var ND = [
        { ID: 'ND01', FULLNAME: 'Nguyễn Văn Hùng', NAME: 'hungnv', HINHDAIDIEN: '' },
        { ID: 'ND02', FULLNAME: 'Trần Thị Mai', NAME: 'maitt', HINHDAIDIEN: '' },
        { ID: 'ND03', FULLNAME: 'Lê Quang Minh', NAME: 'minhlq', HINHDAIDIEN: '' },
        { ID: 'ND04', FULLNAME: 'Phạm Thu Hà', NAME: 'hapt', HINHDAIDIEN: '' }
    ];
    ums.demo.pqNguoiDung = ND;
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }

    /* Quyền có sẵn */
    K.them('CB01', 'TT01', 'HD01'); K.them('CB01', 'TT02', 'HD01'); K.them('CB03', 'TT01', 'HD01');
    K.them('ND01', 'CB01TT01', 'HD01'); K.them('ND02', 'CB02TT01', 'HD01');
    K.them('ND01', 'L1' + 'TTS01', 'HD01'); K.them('ND03', 'L2' + 'TTS01', 'HD01');
    K.them('L1', 'TTS01', 'HD01'); K.them('L2', 'TTS02', 'HD01');

    ums.demo.add({
        'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [{ ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }],
        'KHCT_ThongTin/LayDSNamNhapHoc': [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }, { NAMNHAPHOC: '2025' }],
        'CMS_PhanQuyenDuLieu/LayDSChucNangCanPhanQuyen': [
            { ID: 'PQCN1', MA: 'NHAPHOSO', PHANQUYEN_CHUCNANG_TEN: 'Nhập hồ sơ' },
            { ID: 'PQCN2', MA: 'NHAPDIEM', PHANQUYEN_CHUCNANG_TEN: 'Nhập điểm theo danh sách' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSHanhDongTheo': [
            { ID: 'HD01', MA: 'XEM', HANHDONG_TEN: 'Xem' },
            { ID: 'HD02', MA: 'SUA', HANHDONG_TEN: 'Sửa' },
            { ID: 'HD03', MA: 'DUYET', HANHDONG_TEN: 'Duyệt' }
        ],
        'CMS_PhanQuyenDuLieu/LayDSNguoiDungTheoChucNang': function () { return ND.slice(); },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NHANSU.TRUONGTHONGTIN': [
            dm('TT01', 'HOTEN', 'Họ tên', 'Trường thông tin'), dm('TT02', 'NGAYSINH', 'Ngày sinh', 'Trường thông tin'),
            dm('TT03', 'CCCD', 'Số CCCD', 'Trường thông tin'), dm('TT04', 'DIACHI', 'Địa chỉ thường trú', 'Trường thông tin')
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLSV.TRUONGTHONGTIN': [
            dm('TTS01', 'HOTEN', 'Họ tên', 'Trường thông tin'), dm('TTS02', 'NGAYSINH', 'Ngày sinh', 'Trường thông tin'),
            dm('TTS03', 'DIENTHOAI', 'Số điện thoại', 'Trường thông tin'), dm('TTS04', 'QUEQUAN', 'Quê quán', 'Trường thông tin')
        ],
        'CMS_PhanQuyenDuLieu/Them_PhanQuyen_DuLieu': function (o) { K.them(o.strNguoiDung_Id, o.strToHopBoDuLieuQuyen, o.strHanhDong_Id); return []; },
        'CMS_PhanQuyenDuLieu/Xoa_PhanQuyen_DuLieu1': function (o) { K.xoaId(o.strIds); return []; },
        'CMS_PhanQuyenDuLieu/Xoa_PhanQuyen_DuLieu': function (o) { K.xoa(o.strNguoiDung_Id, o.strToHopBoDuLieuQuyen, o.strHanhDong_Id); return []; },
        'pkg_chung_phanquyendulieu.Xoa_PhanQuyen_DuLieu': function (o) { K.xoa(o.strNguoiDung_Id, o.strToHopBoDuLieuQuyen, o.strHanhDong_Id); return []; }
    });
})();
