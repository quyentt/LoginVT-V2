/* Dữ liệu mẫu dùng chung cho module hoso (Ký túc xá) — chỉ dùng ở chế độ dựng thử. Nạp trước _hoso.js. */
(function () {
    var fx = {};
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: '' }; }
    var DM = {
        'KTX.TTHD': [dm('TTHD1', '1', 'Đang hiệu lực'), dm('TTHD2', '2', 'Hết hạn'), dm('TTHD3', '3', 'Đã chấm dứt')],
        'KTX.LOP': [dm('LOP1', 'K67-KTPM1', 'K67-KTPM1'), dm('LOP2', 'K67-QTKD2', 'K67-QTKD2'), dm('LOP3', 'K68-HTTT1', 'K68-HTTT1')],
        'KTX.KHOADAOTAO': [dm('KH67', 'K67', 'Khóa 67'), dm('KH68', 'K68', 'Khóa 68')],
        'NS.DATO': [dm('DT1', 'KINH', 'Kinh'), dm('DT2', 'TAY', 'Tày'), dm('DT3', 'MUONG', 'Mường')],
        'NS.TOGI': [dm('TG1', 'KHONG', 'Không'), dm('TG2', 'PHAT', 'Phật giáo'), dm('TG3', 'TCG', 'Thiên chúa giáo')],
        'NS.QUOCTICH': [dm('QT1', 'VN', 'Việt Nam'), dm('QT2', 'LA', 'Lào'), dm('QT3', 'KH', 'Campuchia')],
        'KTX_PHANLOAIDOITUONG': [dm('PL1', 'SV', 'Sinh viên'), dm('PL2', 'LHS', 'Lưu học sinh'), dm('PL3', 'KHAC', 'Đối tượng khác')],
        'NS.GITI': [dm('GT1', 'NAM', 'Nam'), dm('GT2', 'NU', 'Nữ')],
        'KTX.TRINHDO': [dm('TD1', 'DH', 'Đại học'), dm('TD2', 'CH', 'Cao học')],
        'KTX.DIDT': [dm('DD1', 'CQ', 'Chính quy'), dm('DD2', 'LT', 'Liên thông')],
        'CHUN.NGAN': [dm('NG1', 'KTPM', 'Kỹ thuật phần mềm'), dm('NG2', 'QTKD', 'Quản trị kinh doanh'), dm('NG3', 'HTTT', 'Hệ thống thông tin')],
        'KTX.KYLUAT.LOAIVYPHAM': [dm('VP1', 'GG', 'Gây mất trật tự'), dm('VP2', 'DN', 'Sử dụng điện nước sai quy định'), dm('VP3', 'VS', 'Vi phạm vệ sinh')],
        'KTX.KYLUAT.HINHTHUCXULY': [dm('HT1', 'NN', 'Nhắc nhở'), dm('HT2', 'KT', 'Khiển trách'), dm('HT3', 'CC', 'Cảnh cáo')],
        'KTX.DVT0': [dm('DV1', 'THANG', 'Tháng'), dm('DV2', 'KY', 'Kỳ'), dm('DV3', 'NAM', 'Năm')]
    };
    Object.keys(DM).forEach(function (k) { fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#' + k] = DM[k]; });

    /* Tòa nhà / phòng: kho CHUNG của cosovatchat/script/_ktx.demo.js (đã nạp trước vì thẻ _ktx.js đứng trước _hoso.js);
       KTX_ToaNha / KTX_Phong LayDanhSach do kho đó trả — không khai riêng ở đây nữa (12/10) */
    var KT = ums.demo.ktx || { TOA: [], PHONG: [] }, TOANHA = KT.TOA, PHONG = KT.PHONG;

    /* Người ở */
    function no(id, ma, hd, t, gt, ns, lop, dt, tn, p, kl, dang, dxp, hd_) {
        return { ID: id, MASO: ma, HODEM: hd, TEN: t, GIOITINH_ID: gt, GIOITINH_TEN: gt === 'GT1' ? 'Nam' : 'Nữ',
            NGAYSINH: ns[0], THANGSINH: ns[1], NAMSINH: ns[2], LOPQUANLY: lop, LOPQUANLY_ID: lop === 'K67-KTPM1' ? 'LOP1' : 'LOP2', KHOAHOC: 'K67', KHOADAOTAO_ID: 'KH67',
            DANTOC_ID: dt, DANTOC_TEN: dt === 'DT1' ? 'Kinh' : 'Tày', TONGIAO_ID: 'TG1', QUOCTICH_ID: 'QT1', PHANLOAIDOITUONG_ID: 'PL1',
            KTX_TOANHA_TEN: tn, KTX_PHONG_TEN: p, KTX_PHONG_ID: p ? PHONG.filter(function (x) { return x.TEN === p; })[0].ID : '',
            BIKYLUAT: kl, TINHTRANGKYLUAT: kl === 'KHONGBI' ? 'Chưa bị kỷ luật' : 'Đã bị kỷ luật', TINHTRANGHOPDONG: hd_ ? 'Đang hiệu lực' : '',
            DANGO: dang, KTX_DANHSACHDAXEPPHONG_ID: dxp, KTX_HOPDONG_ID: hd_,
            EMAIL_CANHAN: ma.toLowerCase() + '@sv.edu.vn', SDT_CANHAN: '0912 345 678', SDT_GIADINH: '0987 654 321', CANCUOC_SO: '0010' + ma.slice(3),
            DIACHILIENHE: 'Số 1 Đại Cồ Việt, Hà Nội', GHICHU: '', SOHOCHIEU: '', THOIHANVISA: '', TRINHDODAOTAO_ID: 'TD1', DIENDAOTAO_ID: 'DD1', NGANHDAOTAO_ID: 'NG1',
            ANH: '', SOTAIKHOANCANHAN1: '', QUEQUAN: 'Hà Nội', HOKHAUTHUONGTRU: 'Hà Nội', THOIGIANDEN: '', THOIGIANDI: '',
            GIADINHCHINHSACH_TEN: '', THANHPHANXUATTHAN_TEN: '', NGU_NGAYNHAP: '', NGU_NGAYXUAT: '' };
    }
    var NO = [
        no('NO1', 'BIT220263', 'Nguyễn Văn', 'An', 'GT1', ['12', '3', '2004'], 'K67-KTPM1', 'DT1', 'Nhà A1', '101', 'KHONGBI', 1, 'XP1', 'HD1'),
        no('NO2', 'BIT220271', 'Trần Thị', 'Bình', 'GT2', ['5', '7', '2004'], 'K67-KTPM1', 'DT1', 'Nhà A1', '102', 'CO', 1, 'XP2', 'HD2'),
        no('NO3', 'BBA220561', 'Lê Minh', 'Châu', 'GT1', ['21', '11', '2004'], 'K67-QTKD2', 'DT2', 'Nhà A1', '201', 'KHONGBI', 1, 'XP3', 'HD3'),
        no('NO4', 'BIT230210', 'Phạm Thu', 'Dung', 'GT2', ['2', '1', '2005'], 'K67-QTKD2', 'DT1', '', '', 'KHONGBI', 0, '', '')
    ];
    ums.demo.crudStore('KTX_DoiTuongOKyTucXa', NO, {
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var r = rows.filter(function (x) {
                if (q && (x.MASO + ' ' + x.HODEM + ' ' + x.TEN).toLowerCase().indexOf(q) < 0) return false;
                if (String(o.dDoiTuongConDangOKTX) === '1' && !x.DANGO) return false;
                if (o.strKTX_ToaNha_Id && TOANHA.filter(function (t) { return t.ID === o.strKTX_ToaNha_Id; })[0].TEN !== x.KTX_TOANHA_TEN) return false;
                if (o.strKTX_Phong_Id && x.KTX_PHONG_ID !== o.strKTX_Phong_Id) return false;
                if (o.strGioiTinh_Id && x.GIOITINH_ID !== o.strGioiTinh_Id) return false;
                if (String(o.dBiKyLuat) === '1' && x.BIKYLUAT === 'KHONGBI') return false;
                if (String(o.dBiKyLuat) === '0' && x.BIKYLUAT !== 'KHONGBI') return false;
                return true;
            });
            var i = Number(o.pageIndex) || 1, s = Number(o.pageSize) || 10;
            return { rows: r.slice((i - 1) * s, i * s), pager: r.length };
        },
        map: function (o) {
            var m = {};
            Object.keys(o).forEach(function (k) { if (/^str/.test(k) && k !== 'strId') m[k.replace(/^str/, '').replace(/_Id$/, '_ID').toUpperCase()] = o[k]; });
            m.MASO = o.strMaSo; m.HODEM = o.strHoDem; m.TEN = o.strTen; m.EMAIL_CANHAN = o.strEmail_CaNhan; m.SDT_CANHAN = o.strSDT_CaNhan;
            m.SDT_GIADINH = o.strSDT_GiaDinh; m.CANCUOC_SO = o.strCanCuoc_So; m.ANH = o.strAnhCaNhan; m.SOTAIKHOANCANHAN1 = o.strSoTaiKhoanCaNhan;
            m.GIOITINH_TEN = o.strGioiTinh_Id === 'GT2' ? 'Nữ' : (o.strGioiTinh_Id ? 'Nam' : ''); m.BIKYLUAT = 'KHONGBI'; m.DANGO = 0;
            m.KTX_TOANHA_TEN = ''; m.KTX_PHONG_TEN = ''; m.KTX_DANHSACHDAXEPPHONG_ID = ''; m.KTX_HOPDONG_ID = '';
            return m;
        }
    });

    /* Xếp phòng / chuyển / gia hạn / chấm dứt / kỷ luật */
    var seq = 10;
    fx['KTX_DaXepPhong/ThemMoi'] = function (o) {
        var id = 'XP' + (seq++), p = PHONG.filter(function (x) { return x.ID === o.strKTX_Phong_Id; })[0];
        NO.forEach(function (r) { if (r.ID === o.strKTX_DoiTuongOKyTucXa_Id) { r.DANGO = 1; r.KTX_DANHSACHDAXEPPHONG_ID = id; r.KTX_PHONG_ID = o.strKTX_Phong_Id; r.KTX_PHONG_TEN = p ? p.TEN : ''; r.KTX_TOANHA_TEN = p ? p.KTX_TOANHA_TEN : ''; r.NGAYVAO = o.strNgayVao; r.NGAYRA = o.strNgayRa; } });
        return { rows: [], raw: { Id: id } };
    };
    fx['KTX_DaXepPhong/LayChiTiet'] = function (o) {
        return NO.filter(function (r) { return r.KTX_DANHSACHDAXEPPHONG_ID === o.strId; }).map(function (r) {
            var p = PHONG.filter(function (x) { return x.ID === r.KTX_PHONG_ID; })[0] || {};
            return { ID: o.strId, KTX_DOITUONGOKYTUCXA_ID: r.ID, KTX_DOITUONGOKYTUCXA_HODEM: r.HODEM, KTX_DOITUONGOKYTUCXA_TEN: r.TEN, KTX_DOITUONGOKYTUCXA_MASO: r.MASO,
                KTX_PHONG_ID: r.KTX_PHONG_ID, KTX_PHONG_MA: p.MA || '', KTX_PHONG_TEN: p.TEN || '', KTX_TOANHA_ID: p.KTX_TOANHA_ID || '', KTX_TOANHA_MA: p.KTX_TOANHA_ID || '',
                KTX_TOANHA_TEN: p.KTX_TOANHA_TEN || '', NGAYVAO: r.NGAYVAO || '01/09/2026', NGAYRA: r.NGAYRA || '', ANH: '' };
        });
    };
    fx['KTX_DaXepPhong/ChuyenPhongOKTX'] = { rows: [], message: '' };
    fx['KTX_GiaHanHopDong/GiaHanHopDong'] = { rows: [], message: '' };
    fx['KTX_HopDong/ChamDutHopDong'] = { rows: [], message: '' };
    fx['KTX_DoiTuongOKyTucXa_ViPham/ThemMoi'] = { rows: [], message: '' };
    fx['KTX_DoiTuongOKyTucXa_ViPham/LayDanhSach'] = function (o) {
        return o.strKTX_DoiTuongOKyTucXa_Id === 'NO2' ? [
            { ID: 'VPH1', LOAIVIPHAM_TEN: 'Gây mất trật tự', HINHTHUCXULY_TEN: 'Nhắc nhở', NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Quản Trị', NGAYTAO_DD_MM_YYYY: '10/09/2026' }
        ] : [];
    };
    fx['KTX_QuaTrinhOKTX/LayDanhSach'] = function (o) {
        var r = NO.filter(function (x) { return x.ID === o.strKTX_DoiTuongOKyTucXa_Id; })[0];
        return r && r.KTX_PHONG_TEN ? [{ KTX_TOANHA_TEN: r.KTX_TOANHA_TEN, KTX_PHONG_TEN: r.KTX_PHONG_TEN, NGAYVAO: '01/09/2026', NGAYRA: '', NGUOITHUCHIEN_TENDAYDU: 'Nguyễn Quản Trị' }] : [];
    };
    fx['KTX_TinhHinhCongNoKTX/LayDanhSach'] = function () {
        return { rows: {
            rsNo: [{ TAICHINH_CACKHOANTHU_TEN: 'Tiền phòng', SOTIEN: 1200000, DAOTAO_THOIGIANDAOTAO: 'Tháng 9/2026' }],
            rsDu: [],
            rsDaNop: [{ TAICHINH_CACKHOANTHU_TEN: 'Tiền phòng', SOTIEN: 2400000, DAOTAO_THOIGIANDAOTAO: 'Tháng 7/2026', NOIDUNG: 'Nộp tiền phòng' }],
            rsPhaiNop: [{ TAICHINH_CACKHOANTHU_TEN: 'Tiền phòng', SOTIEN: 3600000, DAOTAO_THOIGIANDAOTAO: 'Tháng 7/2026', NOIDUNG: '' }],
            rsMien: [], rsRut: []
        } };
    };

    /* Đối tượng đào tạo (thêm hồ sơ từ đào tạo) */
    var DTDT = [
        { ID: 'NH01', MASV: 'BIT220101', HODEM: 'Vũ Ngọc', TEN: 'Hà', NGAYSINH: '12/03/2004', KHOAHOC_TEN: 'K67', LOPQUANLY_TEN: 'K67-KTPM1', TINHTRANG: 'Đang học', ANH: '' },
        { ID: 'NH02', MASV: 'BIT220102', HODEM: 'Hoàng Minh', TEN: 'Đức', NGAYSINH: '05/07/2004', KHOAHOC_TEN: 'K67', LOPQUANLY_TEN: 'K67-KTPM1', TINHTRANG: 'Đang học', ANH: '' },
        { ID: 'NH03', MASV: 'BBA220590', HODEM: 'Đặng Thu', TEN: 'Hương', NGAYSINH: '21/11/2004', KHOAHOC_TEN: 'K67', LOPQUANLY_TEN: 'K67-QTKD2', TINHTRANG: 'Đang học', ANH: '' }
    ];
    fx['KTX_DoiTuongDaoTao/LayDanhSach'] = function (o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        return DTDT.filter(function (x) { return !q || (x.MASV + ' ' + x.HODEM + ' ' + x.TEN).toLowerCase().indexOf(q) >= 0; });
    };
    fx['KTX_DoiTuongDaoTao/ThemMoi'] = function (o) {
        var s = DTDT.filter(function (x) { return x.ID === o.strNguoiHoc_Id; })[0];
        if (s) NO.push(no('NO' + (seq++), s.MASV, s.HODEM, s.TEN, 'GT1', s.NGAYSINH.split('/'), s.LOPQUANLY_TEN, 'DT1', '', '', 'KHONGBI', 0, '', ''));
        return { rows: [], raw: { Id: 'NO' + seq } };
    };

    /* Năm nhập học, khoản thu (nhóm KTX / MienGiamKTX), hợp đồng, tính tiền */
    fx['KHCT_NamNhapHoc/LayDanhSach'] = [{ NAMNHAPHOC: '2022' }, { NAMNHAPHOC: '2023' }, { NAMNHAPHOC: '2024' }];
    var KT = [
        { ID: 'KT1', MA: 'KTX.TIENPHONG', TEN: 'Tiền phòng KTX', NHOMCACKHOANTHU_MA: 'KTX', NHOMCACKHOANTHU_ID: 'KTX' },
        { ID: 'KT2', MA: 'KTX.DIEN', TEN: 'Tiền điện', NHOMCACKHOANTHU_MA: 'KTX', NHOMCACKHOANTHU_ID: 'KTX' },
        { ID: 'KT3', MA: 'KTX.NUOC', TEN: 'Tiền nước', NHOMCACKHOANTHU_MA: 'KTX', NHOMCACKHOANTHU_ID: 'KTX' },
        { ID: 'KT4', MA: 'KTXMG.TIENPHONG', TEN: 'Miễn giảm tiền phòng', NHOMCACKHOANTHU_MA: 'MienGiamKTX', NHOMCACKHOANTHU_ID: 'MGKTX' },
        { ID: 'KT5', MA: 'KTXMG.DIEN', TEN: 'Miễn giảm tiền điện', NHOMCACKHOANTHU_MA: 'MienGiamKTX', NHOMCACKHOANTHU_ID: 'MGKTX' }
    ];
    fx['TC_KhoanThu/LayDanhSach'] = function (o) { return KT.filter(function (x) { return !o.strNhomCacKhoanThu_Id || x.NHOMCACKHOANTHU_ID === o.strNhomCacKhoanThu_Id; }); };
    fx['KTX_HopDong/ThemMoi'] = function (o) { return { rows: [], raw: { Id: 'HD' + (seq++) } }; };
    fx['KTX_TinhTienPhongTheoNguoi/TinhTienPhongTheoNguoi'] = function (o) { return [{ SOTIEN: 400000 * (Number(o.dSoThang) || 0) }]; };

    /* Không tính miễn / không tính phí */
    function ktStore(ctrl, mien) {
        var rows = [
            { ID: ctrl + '1', KTX_DOITUONGOKYTUCXA_MASO: 'BIT220263', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Văn', KTX_DOITUONGOKYTUCXA_TEN: 'An',
              DAOTAO_THOIGIANDAOTAO_NAM: '2026', DAOTAO_THOIGIANDAOTAO_THANG: '9', TAICHINH_CACKHOANTHU_TEN: 'Tiền phòng KTX', SOTIEN: mien ? 300000 : '', LYDO: mien ? 'Diện chính sách' : '' }
        ];
        var n = 2;
        fx[ctrl + '/LayDanhSach'] = function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var r = rows.filter(function (x) {
                if (q && (x.KTX_DOITUONGOKYTUCXA_MASO + ' ' + x.KTX_DOITUONGOKYTUCXA_HODEM + ' ' + x.KTX_DOITUONGOKYTUCXA_TEN).toLowerCase().indexOf(q) < 0) return false;
                if (Number(o.dNam) && String(x.DAOTAO_THOIGIANDAOTAO_NAM) !== String(o.dNam)) return false;
                if (Number(o.dThang) && String(x.DAOTAO_THOIGIANDAOTAO_THANG) !== String(o.dThang)) return false;
                return true;
            });
            return { rows: r, pager: r.length };
        };
        fx[ctrl + '/ThemMoi'] = function (o) {
            var r = NO.filter(function (x) { return x.ID === o.strKTX_DoiTuongOKTX_Id; })[0] || {}, k = KT.filter(function (x) { return x.ID === o.strTaiChinh_CacKhoanThu_Id; })[0] || {};
            rows.push({ ID: ctrl + (n++), KTX_DOITUONGOKYTUCXA_MASO: r.MASO || '', KTX_DOITUONGOKYTUCXA_HODEM: r.HODEM || '', KTX_DOITUONGOKYTUCXA_TEN: r.TEN || '',
                DAOTAO_THOIGIANDAOTAO_NAM: o.dNam, DAOTAO_THOIGIANDAOTAO_THANG: o.dThang, TAICHINH_CACKHOANTHU_TEN: k.TEN || '', SOTIEN: o.dSoTien || '', LYDO: o.strLyDo || '' });
            return { rows: [], raw: { Id: ctrl + n } };
        };
        fx[ctrl + '/Xoa'] = function (o) {
            var ids = String(o.strIds || '').split(',');
            for (var i = rows.length - 1; i >= 0; i--) if (ids.indexOf(rows[i].ID) >= 0) rows.splice(i, 1);
            return [];
        };
    }
    ktStore('KTX_KhongTinh_Mien', true);
    ktStore('KTX_DSKhongTinh', false);

    ums.demo.add(fx);
})();
