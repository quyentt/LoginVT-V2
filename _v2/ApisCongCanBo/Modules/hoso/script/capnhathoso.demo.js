/* Dữ liệu mẫu cho capnhathoso — chỉ dùng ở chế độ dựng thử. Cơ cấu tổ chức có sẵn. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    function dm(pairs) { return pairs.map(function (p) { return { ID: p[0], MA: p[0], TEN: p[1] }; }); }
    fx[D + 'NS.GITI'] = dm([['NAM', 'Nam'], ['NU', 'Nữ']]);
    fx[D + 'NS.TTHN'] = dm([['DKH', 'Đã kết hôn'], ['DT', 'Độc thân']]);
    fx[D + 'CHUN.CHLU'] = dm([['VN', 'Việt Nam'], ['JP', 'Nhật Bản']]);
    fx[D + 'NS.DATO'] = dm([['KINH', 'Kinh'], ['TAY', 'Tày']]);
    fx[D + 'NS.TOGI'] = dm([['KHONG', 'Không'], ['PG', 'Phật giáo']]);
    fx[D + 'NS.TPXT'] = dm([['CC', 'Công chức'], ['ND', 'Nông dân']]);
    fx[D + 'NS.GDCS'] = dm([['KHONG', 'Không']]);
    fx[D + 'NS.CDNN'] = dm([['GVC', 'Giảng viên chính'], ['GV', 'Giảng viên']]);
    fx[D + 'NS.QUHA'] = dm([['TU', 'Thiếu uý']]);
    fx[D + 'NS.TBH0'] = dm([['H1', 'Hạng 1/4']]);
    fx[D + 'QLCB.LOTN'] = dm([['G', 'Giỏi'], ['K', 'Khá']]);
    fx[D + 'CHUN.DMTT'] = [
        { ID: 'T01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null }, { ID: 'T36', TEN: 'Tỉnh Nam Định', QUANHECHA_ID: null },
        { ID: 'H005', TEN: 'Quận Cầu Giấy', QUANHECHA_ID: 'T01' }, { ID: 'H356', TEN: 'Huyện Hải Hậu', QUANHECHA_ID: 'T36' },
        { ID: 'X167', TEN: 'Phường Dịch Vọng', QUANHECHA_ID: 'H005' }, { ID: 'X900', TEN: 'Xã Hải Hà', QUANHECHA_ID: 'H356' }
    ];
    var HS = {
        ID: 'U1', HODEM: 'Nguyễn Văn', TEN: 'An', TENGOIKHAC: '', NGAYSINH: '12', THANGSINH: '03', NAMSINH: '1986',
        GIOITINH_ID: 'NAM', TINHTRANGHONNHAN_ID: 'DKH', QUOCTICH_ID: 'VN', DANTOC_ID: 'KINH', TONGIAO_ID: 'KHONG',
        THANHPHANXUATTHAN_ID: 'CC', GIADINHCHINHSACH_ID: 'KHONG', MASO: 'CB0123', TINHTRANGNHANSU_TEN: 'Đang làm việc',
        LOAIDOITUONG_TEN: 'Viên chức', LOAIGIANGVIEN_TEN: 'Cơ hữu', DAOTAO_COCAUTOCHUC_ID: 'CC1', MASOTHUE: '8012345678',
        LOAICHUCDANHNGHENGHIEP_ID: 'GVC', TRINHDOCHUYENMONCN_TEN: 'Tiến sĩ', THOIGIAN_VAOTRUONG: '01/09/2012',
        EMAIL: 'an.nv@truong.edu.vn', SDT_CANHAN: '0912345678', CANCUOC_SO: '001086000123', CANCUOC_NGAYCAP: '10/04/2021',
        CANCUOC_NOICAP: 'Cục CS QLHC về TTXH', SOBAOHIEM: '0112345678',
        NOISINH_TINH_ID: 'T36', NOISINH_HUYEN_ID: 'H356', NOISINH_XA_ID: 'X900', NOISINH_DIACHI: '',
        QUEQUAN_TINH_ID: 'T36', QUEQUAN_HUYEN_ID: 'H356', QUEQUAN_XA_ID: '', QUEQUAN_DIACHI: '',
        HKTT_TINH_ID: 'T01', HKTT_HUYEN_ID: 'H005', HKTT_XA_ID: 'X167', HKTT_DIACHI: 'Số 1 Nguyễn Phong Sắc',
        NOHN_TINH_ID: 'T01', NOHN_HUYEN_ID: 'H005', NOHN_XA_ID: 'X167', NOHN_DIACHI: 'Số 1 Nguyễn Phong Sắc',
        DANG_NGAYVAO: '03/02/2010', HOCVI_TEN: 'Tiến sĩ', LINHVUCNGHIENCUU: 'Khai phá dữ liệu giáo dục',
        HINHTHUCTUYENDUNG_TEN: 'Xét tuyển', LOAIHOPDONG_TEN: 'Không xác định thời hạn', CONGVIECPHAILAM: 'Giảng dạy, nghiên cứu', ANH: ''
    };
    fx['NS_HoSoV2/LayChiTiet'] = function () { return [HS]; };
    fx['NS_HoSoV2/CapNhat'] = function (o) { HS.TENGOIKHAC = o.strTenGoiKhac; HS.EMAIL = o.strEmail; HS.HKTT_DIACHI = o.strHKTT_DiaChi; return []; };
    fx['NS_HoSoV2/KeThua'] = [];
    ums.demo.add(fx);
    try { localStorage.removeItem('strTinhThanh7'); } catch (e) { /* bỏ qua */ }
})();
