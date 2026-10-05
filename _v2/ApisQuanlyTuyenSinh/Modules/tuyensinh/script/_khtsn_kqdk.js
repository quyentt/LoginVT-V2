/* =========================================================================
   ums.khtsn.moKQDK({ kh, dot, mode, moHoSo, host }) — màn con "Kết quả đăng ký" (mở NGAY TRONG TRANG bằng ums.pat.formTrang,
   thay chỗ o.host; không truyền = cả màn T.S.root — BO-CUC luật 1, từ 30/9; trước đó là hộp thoại lớn)
   Bản gốc: modal #ket-qua-dk với ba màn: danh sách hồ sơ (#kqdk_list), Import trúng tuyển
   (#kqdk_import — _khtsn_import.js), Khai trực tiếp hồ sơ (#kqdk_khai — _khtsn_khai.js).
   ---------------------------------------------------------------------------
   Danh sách (tệp này):
     PKG_CORE_TS_HOSO.LayDS_HoSo_TS_FULL (ưu tiên) → hỏng / rỗng thì LayDS_HoSo_TS (gốc: _fullViewHong)
     Làm giàu cột (mỗi lượt chỉ cho các dòng ĐANG HIỆN, 6 luồng, có nhớ tạm — như gốc):
       Pr_Ts_Kh_Dau_Ra_Get_Ds (nguyện vọng → ngành / đợt), danh mục TUYENSINH.NGANHNGHE (mã ngành),
       LayDSPerson_Profile (dân tộc / tôn giáo — một lời gọi cho cả trang), GetPersonContactByPerson_Id (SĐT / email),
       LayDSNguoiHoc_All + LayDSKS_DaoTao_LopQuanLy (mã lớp QL), LayDS_TS_HoSo_DoiTacTS (nguồn khai thác, thử cả lô trước),
       chế độ Đầy đủ: LayTT_HoSo_TS + Get_Person_Family + LayDS_PersonInvoiceInfo + Get_Person_Address mỗi người
       (quá 60 người / trang thì không tự nạp — hiện nút "Nạp chi tiết").
     Xoá hồ sơ: Xoa_HoSo_TS (strHoSo_Id). Phân lớp tự động: PKG_CORE_NhapHoc_ThuTien.PhanLop_TuDong
       (strCore_Person_Id, strNguonSuKien_Code 'TS_KQDK_AUTO_CLASS'), thử lần lượt ba action như gốc.
     Mẫu báo cáo / import (getList_MauImport "zonebtnBaoCao_KHTS") → ums.report.mount.
   Bố cục như gốc: thanh công cụ (tìm nhanh, Tìm, Tải lại, Xuất kết quả, Phân lớp tự động, Gọn / Đầy đủ, Tổng,
   báo cáo) + dải điều kiện lọc + bảng (Gọn 8 cột / Đầy đủ 50 cột, tiêu đề hai tầng) + phân trang tại máy.
   Bộ lọc kiểu Excel trên tiêu đề cột (phễu): giá trị đang có + số dòng, tìm trong danh sách, Tăng / Giảm dần.
   Khác gốc về cách dựng: bảng qua ums.ui.table (ô chọn trong cột, nút Sửa / Xoá); bỏ thanh cuộn ngang giả
   phía trên bảng (bảng tầng chung kéo chuột để vuốt ngang); xuất Excel bằng ums.ui.xuatXls (.xls).
   ---------------------------------------------------------------------------
   Pull 29/9 (gốc v1.0.13.1, git diff 017d9453 5018e138):
     · Thêm 17 giá trị CUỐI mảng dòng ([52..68]): nhóm "Hồ sơ & kế hoạch" 14 cột (kế hoạch, đợt, mã hồ sơ, SBD,
       nguyện vọng đầu ra, hệ, chương trình, ngành TS, trạng thái hồ sơ, kết quả xét tuyển, ngày nộp, ngày có kết
       quả, ngày tiếp nhận, đã tạo HS học tập) + "Hóa đơn (bổ sung)" 3 cột (người mua, email, SĐT nhận HĐ) — hiện ở
       chế độ Đầy đủ và trong tệp xuất. Không lời gọi mới: đọc thêm cột TEN_HIENTHI / MA_HIENTHI của
       Pr_Ts_Kh_Dau_Ra_Get_Ds; HOSO_STATUS, HOSO_KETQUA, HOSO_NGAYNOP, HOSO_NGAYKETQUA, INTAKE_NGAYTIEPNHAN,
       INTAKE_ISSTUDYCREATED của hồ sơ; BUYER_NAME_TENNM, BUYER_EMAIL, BUYER_PHONE_SDT của LayDS_PersonInvoiceInfo.
     · "Xuất kết quả" xuất ĐÚNG danh sách đang thấy (sau tìm nhanh + lọc cột + sắp xếp); trước đó luôn xuất tất cả.
     · Phễu lọc: đang gõ tìm thì Đồng ý chỉ tính các dòng ĐANG HIỆN (trước: dòng ẩn vẫn tick → coi như "chọn hết"
       → bảng không đổi); "chọn hết = bỏ lọc" không áp khi đang tìm; ô "(Chọn tất cả)" đổi nhãn + số theo kết quả tìm.
     · Thanh công cụ + dải điều kiện lọc GHIM khi cuộn (.khtsn-kq__dinh, _khtsn.css).
     · Gốc dời popup lọc vào trong modal (Bootstrap cướp focus ô tìm) — bản này gắn popup TRONG thân màn con (position: fixed).
   Theo gốc 1–2/10 (47ab8a26, bc5d5f67):
     · Chưa bấm sắp xếp cột thì hồ sơ MỚI NHẤT lên đầu (mốc: ngày tạo → ngày ban hành KQ → ngày nộp → ngày cập nhật → ngày tiếp
       nhận → cột ngày bất kỳ kiểu NGAY_TAO / CREATED). So ngày nhận thêm dạng ISO yyyy-mm-dd[Thh:mm:ss] (không dùng Date.parse
       như gốc — Date.parse("12") ra ngày, làm sai sắp xếp cột số).
     · Cột "Nguồn khai thác": hồ sơ có sẵn cột đối tác thì đọc thẳng; còn lại hỏi TỪNG người (P.timDoiTac — thử lùi dần),
       bỏ bước "thử cả lô" (personId rỗng) như gốc; chặn hỏi trùng khi đang tải.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, K = ums.khts, T = ums.khtsn, P = T.phu;
    var e = T.e;
    var Q = null;          // màn con đang mở (Q.dlg = khung ums.pat.formTrang)

    /* ---------- nhớ tạm theo phiên (như các biến me._* của gốc) ---------- */
    var C = { lienHe: {}, nguon: {}, nguonDangTai: {}, ct: {}, profile: {}, daura: {}, fullHong: false, ttMap: null };
    T.kqCache = C;

    T.kqDaTick = function () {
        var kq = { person: [], hoso: [] };
        if (!Q || !Q.body) return kq;
        Array.prototype.forEach.call(Q.body.querySelectorAll('input[data-kq="sel"]:checked'), function (x) {
            var d = Q.view[Number(x.getAttribute('data-i'))];
            if (!d) return;
            var p = T.pid(d), h = T.hid(d);
            if (p && kq.person.indexOf(p) < 0) kq.person.push(p);
            if (h && kq.hoso.indexOf(h) < 0) kq.hoso.push(h);
        });
        return kq;
    };

    /* ---------- Nguyện vọng đầu ra của kế hoạch → { khId, dotId, dotTen, nganh…} ---------- */
    T.dauRaMap = function (khId) {
        if (C.daura[khId]) return C.daura[khId];
        C.daura[khId] = ums.api.call({ action: T.TS + 'ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP', func: T.PTS + 'Pr_Ts_Kh_Dau_Ra_Get_Ds', silent: true,
            strTuKhoa: '', strTs_Kh_TuyenSinh_Id: khId || '', strTs_Kh_TuyenSinh_Dot_Id: '', strTs_Kh_Dot_PhuongThuc_Id: '',
            strOutput_Status_Code: '', dIs_Public: '', dIs_Active: 1 }).then(function (r) {
            var m = {};
            T.rows(r).forEach(function (x) {
                var id = x.ID || x.Id || x.TS_KH_DAU_RA_ID;
                if (!id) return;
                m[id] = { khId: x.TS_KEHOACH_TUYENSINH_ID || '', khTen: x.TS_KEHOACH_TUYENSINH_TEN || '', dotId: x.TS_KEHOACH_TUYENSINH_DOT_ID || '',
                    dotTen: x.TS_KEHOACH_TUYENSINH_DOT_TEN || '', nganhId: x.DAOTAO_NGANH_TS_ID || x.DAOTAO_NGANH_DT_ID || '',
                    ten: x.TEN_HIENTHI || x.TEN || '', ma: x.MA_HIENTHI || x.MA || '',
                    nganhTen: x.DAOTAO_NGANH_TS_TEN || x.DAOTAO_NGANH_DT_TEN || '', ctTen: x.DAOTAO_TOCHUCCHUONGTRINH_TEN || '',
                    ctId: x.DAOTAO_TOCHUCCHUONGTRINH_ID || '', heTen: x.DAOTAO_HEDAOTAO_TEN || '', khoaTen: x.DAOTAO_KHOADAOTAO_TEN || '' };
            });
            return m;
        }, function () { delete C.daura[khId]; return {}; });
        return C.daura[khId];
    };

    /* ---------- Cột bảng ----------------------------------------------------- */
    var DM_TEN = [T.DM.GIOITINH, T.DM.DANTOC, T.DM.TONGIAO, T.DM.QUOCTICH, T.DM.DOITUONG_TS, T.DM.DOITUONG_UT, T.DM.KHUVUC_UT];
    function tenDiaDanh(id) { return id && C.ttMap ? (C.ttMap[id] || '') : ''; }

    /* Mã trạng thái hồ sơ → chữ đọc được (_TC_TRANGTHAI / _tcTenTrangThai của gốc); mã lạ giữ nguyên, không đoán */
    var TT_HOSO = { TRUNGTUYEN: 'Trúng tuyển', KHONGTRUNGTUYEN: 'Không trúng tuyển', CHOXETTUYEN: 'Chờ xét tuyển', DA_TIEPNHAN: 'Đã tiếp nhận',
        CHUA_TIEPNHAN: 'Chưa tiếp nhận', DA_NOPHOSO: 'Đã nộp hồ sơ', MOI: 'Mới tạo', HUY: 'Đã hủy' };
    function tenTrangThai(ma) { return TT_HOSO[String(ma || '').trim().toUpperCase()] || ma || ''; }

    /** Một hồ sơ → 69 phần tử theo cột bảng (_kqRowToArray; [0] STT, [1] ô chọn, [2..51] dữ liệu, [52..68] bổ sung pull 29/9 —
        PHẢI nằm CUỐI: cột Gọn và khoá bộ lọc 'i<chỉ số>' tham chiếu theo chỉ số). */
    function mang(d, dr) {
        var pick = T.pick, pid = T.pid(d);
        var ct = C.ct[pid] || {}, hs = ct.hs || {}, hd = ct.hd || {};
        var bu = function (v, k) { return v || (hs[k] == null ? '' : hs[k]); };
        var fam = function (r, n) { return r ? (T.pickLoose(r, n) || '') : ''; };
        var tinh = function (r) { return r ? tenDiaDanh(r.PROVINCE_ID) : ''; };
        var xa = function (r) { return r ? (tenDiaDanh(r.WARD_ID) || tenDiaDanh(r.DISTRICT_ID) || '') : ''; };
        var soNha = function (r) { return r ? (r.ADDRESS_LINE1 || '') : ''; };
        var ns = pick(d, ['COREPERSON_NGAYSINH', 'CorePerson_NgaySinh', 'NGAY_SINH', 'NGAYSINH']);
        var pf = C.profile[pid];
        var lh = C.lienHe[pid] || {};
        var nv = dr[pick(d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id'])];
        return [
            0, '',
            pick(d, ['COREPERSON_HOTEN', 'CorePerson_HoTen', 'HOTEN', 'FULL_NAME']),
            T.ngayUI(ns) || ns,
            pick(d, ['COREPERSON_GIOITINH_TEN', 'GIOITINH_TEN', 'CorePerson_GioiTinh_Ten']) || T.tenDM(T.DM.GIOITINH, pick(d, ['COREPERSON_GIOITINH_ID', 'GIOITINH_ID'])),
            pick(d, ['PERSONPROFILE_DANTOC_TEN', 'DANTOC_TEN', 'PersonProfile_DanToc_Ten']) || (pf ? T.tenDM(T.DM.DANTOC, pf.ETHNICITY_ID) : '') || T.tenDM(T.DM.DANTOC, hs.PERSONPROFILE_DANTOC_ID),
            pick(d, ['PERSONPROFILE_TONGIAO_TEN', 'TONGIAO_TEN', 'PersonProfile_TonGiao_Ten']) || (pf ? T.tenDM(T.DM.TONGIAO, pf.RELIGION_ID) : '') || T.tenDM(T.DM.TONGIAO, hs.PERSONPROFILE_TONGIAO_ID),
            pick(d, ['PERSONPROFILE_QUOCTICH_TEN', 'QUOCTICH_TEN', 'PersonProfile_QuocTich_Ten']) || T.tenDM(T.DM.QUOCTICH, hs.PERSONPROFILE_QUOCTICH_ID),
            pick(d, ['PERSONCONTACT_DIENTHOAI', 'PersonContact_DienThoai', 'DIENTHOAI', 'SODIENTHOAI', 'SO_DIEN_THOAI', 'SDT', 'PHONE', 'PHONE_NUMBER', 'MOBILE'])
                || T.pickFuzzy(d, /^(?!.*(BO_|ME_|FAM|PARENT|INVOICE|BUYER|EMERGENCY)).*(DIENTHOAI|DIEN_THOAI|SDT|PHONE|MOBILE).*$/i) || lh.sdt || '',
            pick(d, ['PERSONCONTACT_EMAIL', 'PersonContact_Email', 'EMAIL', 'CONTACT_EMAIL', 'EMAIL_LIENHE', 'MAIL'])
                || T.pickFuzzy(d, /^(?!.*(BO_|ME_|FAM|PARENT|INVOICE|BUYER)).*(EMAIL|MAIL).*$/i) || lh.email || '',
            pick(d, ['PERSONADDR_NOISINH', 'PersonAddr_NoiSinh', 'NOISINH']) || [soNha(ct.ns), xa(ct.ns), tinh(ct.ns)].filter(function (x) { return x; }).join(', '),
            pick(d, ['PERSONIDEN_SOCCCD', 'PersonIden_SoCCCD', 'SOCCCD', 'SO_CCCD', 'CCCD', 'CCCD_SO', 'SoCCCD', 'strPersonIden_SoCCCD', 'SOCMND', 'SO_CMND', 'CMND'])
                || T.pickFuzzy(d, /^(?!.*NGAY)(?!.*NOI).*(CCCD|CMND).*$/i),
            bu(pick(d, ['PERSONIDEN_NGAYCAP', 'PersonIden_NgayCap', 'NGAYCAPCCCD', 'NGAY_CAP', 'NGAYCAP', 'NgayCap', 'NgayCapCCCD']) || T.pickFuzzy(d, /(NGAY_?CAP|NGAYCAP)/i), 'PERSONIDEN_NGAYCAP'),
            bu(pick(d, ['PERSONIDEN_NOICAP', 'PersonIden_NoiCap', 'NOICAPCCCD', 'NOI_CAP', 'NOICAP', 'NoiCap', 'NoiCapCCCD']) || T.pickFuzzy(d, /(NOI_?CAP|NOICAP)/i), 'PERSONIDEN_NOICAP'),
            pick(d, ['PERSONADDR_HK_TINH_TEN', 'HK_TINH_TEN']) || tinh(ct.hk),
            pick(d, ['PERSONADDR_HK_XA_TEN', 'HK_XA_TEN']) || xa(ct.hk),
            pick(d, ['PERSONADDR_HK_SONHA', 'HK_SONHA']) || soNha(ct.hk),
            pick(d, ['HOSO_KH_DOT_PT_TEN', 'PHUONGTHUC_TEN', 'HoSo_KH_Dot_PT_Ten']),
            pick(d, ['HOSO_DOITUONG_TS_TEN', 'DOITUONG_TS_TEN']) || T.tenDM(T.DM.DOITUONG_TS, hs.HOSO_DOITUONG_TS_ID),
            pick(d, ['HOSO_DOITUONG_UT_TEN', 'DOITUONG_UT_TEN']) || T.tenDMNhieu(T.DM.DOITUONG_UT, hs.HOSO_DOITUONG_UT_IDS),
            pick(d, ['HOSO_KHUVUC_UT_TEN', 'KHUVUC_UT_TEN']) || T.tenDM(T.DM.KHUVUC_UT, hs.HOSO_KHUVUC_UT_ID),
            pick(d, ['PERSONEDU_TINH_ID', 'MATINH12']), pick(d, ['PERSONEDU_MATRUONG', 'MATRUONG12']),
            pick(d, ['PERSONEDU_TRUONGMATEN', 'TENTRUONG12']), pick(d, ['PERSONEDU_HOCLUC', 'HOCLUC12', 'HOC_LUC']),
            pick(d, ['PERSONEDU_HANHKIEM', 'HANHKIEM12', 'HANH_KIEM']),
            bu(pick(d, ['XETTUYEN_TOHOPMON_CODE', 'XetTuyen_TohopMon_Code', 'TOHOP_MA']), 'XETTUYEN_TOHOPMON_CODE'),
            pick(d, ['XETTUYEN_DIEM_MON1', 'DIEM_MON1']), pick(d, ['XETTUYEN_DIEM_MON2', 'DIEM_MON2']), pick(d, ['XETTUYEN_DIEM_MON3', 'DIEM_MON3']),
            bu(pick(d, ['XETTUYEN_DIEMUUTIEN', 'DIEM_UT', 'XetTuyen_DiemUuTien']), 'XETTUYEN_DIEMUUTIEN'),
            bu(pick(d, ['XETTUYEN_DIEMTONGXT', 'XetTuyen_DiemTongXT', 'TONG_DIEM_XT']), 'XETTUYEN_DIEMTONGXT'),
            pick(d, ['PERSONFAM_BO_HOTEN', 'BO_HOTEN']) || fam(ct.bo, ['FULL_NAME', 'HOTEN']),
            pick(d, ['PERSONFAM_BO_NAMSINH', 'BO_NAMSINH']) || fam(ct.bo, ['BIRTH_YEAR', 'NAMSINH']),
            pick(d, ['PERSONFAM_BO_NOIO', 'BO_NOIO']) || fam(ct.bo, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']),
            pick(d, ['PERSONFAM_BO_SDT', 'BO_SDT']) || fam(ct.bo, ['PHONE_NUMBER', 'SODIENTHOAI', 'SDT']),
            pick(d, ['PERSONFAM_ME_HOTEN', 'ME_HOTEN']) || fam(ct.me, ['FULL_NAME', 'HOTEN']),
            pick(d, ['PERSONFAM_ME_NAMSINH', 'ME_NAMSINH']) || fam(ct.me, ['BIRTH_YEAR', 'NAMSINH']),
            pick(d, ['PERSONFAM_ME_NOIO', 'ME_NOIO']) || fam(ct.me, ['ADDRESS_TEXT', 'DIACHI', 'NOIO']),
            pick(d, ['PERSONFAM_ME_SDT', 'ME_SDT']) || fam(ct.me, ['PHONE_NUMBER', 'SODIENTHOAI', 'SDT']),
            pick(d, ['KETQUA_QUYETDINH_MA', 'SO_QD_TT', 'SoQuyetDinh']),
            pick(d, ['KETQUA_NGAYBANHANH', 'NGAY_QD_TT', 'HOSO_NGAYKETQUA']),
            pick(d, ['INTAKE_KHOA_TEN', 'KHOA_DT', 'KhoaDT']),
            pick(d, ['INTAKE_NGANH_MA', 'MA_NGANH', 'MaNganh']) || (nv ? (T.maNganh(nv.nganhId, nv.nganhTen) || nv.nganhTen || '') : ''),
            P.lopCua(d),
            pick(d, ['COREPERSON_MASO', 'MA_SV', 'MASV', 'MASO']),
            pick(d, ['PERSONINVOICE_TYPELOAI_TEN', 'HD_DOITUONG_TEN']) || (hd.BUYER_TYPE_LOAI || ''),
            pick(d, ['PERSONINVOICE_TENDONVI', 'HD_TEN_DONVI']) || (hd.BUYER_NAME || hd.BUYER_NAME_TENNM || ''),
            pick(d, ['PERSONINVOICE_MAQHNS', 'HD_MA_QHNS']) || (hd.BUYER_BUDGET_MAQHNS || ''),
            pick(d, ['PERSONINVOICE_DIACHI', 'HD_DIACHI']) || (hd.BUYER_ADDR_DIACHI || ''),
            pick(d, ['PERSONINVOICE_MST', 'HD_MST', 'MST']) || (hd.BUYER_TAX_MST || ''),
            C.nguon[pid] || P.tenDoiTacCua(d, null, true) || '',
            /* [52..65] Hồ sơ & kế hoạch — kế hoạch / đợt / hệ / ngành suy từ nguyện vọng đầu ra (hồ sơ không có các khoá đó) */
            (nv && nv.khTen) || (Q && Q.kh ? T.tenKH(Q.kh) : '') || '',
            (nv && nv.dotTen) || '',
            pick(d, ['HOSO_MAHOSO', 'HoSo_MaHoSo', 'MA_HOSO']),
            pick(d, ['HOSO_SOBAODANH', 'HoSo_SoBaoDanh', 'SOBAODANH']),
            nv && nv.ten ? (nv.ma ? nv.ten + ' (' + nv.ma + ')' : nv.ten) : '',
            (nv && nv.heTen) || '', (nv && nv.ctTen) || '', (nv && nv.nganhTen) || '',
            tenTrangThai(pick(d, ['HOSO_STATUS'])), tenTrangThai(pick(d, ['HOSO_KETQUA'])),
            pick(d, ['HOSO_NGAYNOP']), pick(d, ['HOSO_NGAYKETQUA']),
            bu(pick(d, ['INTAKE_NGAYTIEPNHAN']), 'INTAKE_NGAYTIEPNHAN'),
            String(pick(d, ['INTAKE_ISSTUDYCREATED'])) === '1' ? 'Có' : '',
            /* [66..68] Hóa đơn (bổ sung) — chỉ có dữ liệu ở chế độ Đầy đủ, như 5 cột hóa đơn trên */
            T.pickLoose(hd, ['BUYER_NAME_TENNM', 'BUYER_NAME']) || '',
            T.pickLoose(hd, ['BUYER_EMAIL']) || '',
            T.pickLoose(hd, ['BUYER_PHONE_SDT', 'BUYER_PHONE']) || ''
        ];
    }

    /* Cột chế độ ĐẦY ĐỦ: [chỉ số, tên, nhóm] — tiêu đề hai tầng như thead gốc */
    var FULL = [[2, 'Họ và tên'], [3, 'Ngày sinh'], [4, 'Giới tính'], [5, 'Dân tộc'], [6, 'Tôn giáo'], [7, 'Quốc tịch'], [8, 'Điện thoại'],
        [9, 'Email'], [10, 'Nơi sinh'],
        [11, 'Số CCCD', 'Số CCCD / Hộ chiếu'], [12, 'Ngày cấp', 'Số CCCD / Hộ chiếu'], [13, 'Nơi cấp', 'Số CCCD / Hộ chiếu'],
        [14, 'Tỉnh/TP', 'Hộ khẩu thường trú'], [15, 'Xã/Phường', 'Hộ khẩu thường trú'], [16, 'Số nhà/Thôn/Xóm', 'Hộ khẩu thường trú']]
        .concat(['Phương thức', 'Đối tượng TS', 'Đối tượng UT', 'Khu vực UT', 'Mã tỉnh L12', 'Mã trường L12', 'Tên trường L12', 'Học lực L12',
            'Hạnh kiểm L12', 'Tổ hợp môn', 'Điểm 1', 'Điểm 2', 'Điểm 3', 'Điểm UT', 'Tổng điểm XT'].map(function (t, i) { return [17 + i, t, 'Thông tin xét tuyển']; }))
        .concat(['Họ tên', 'Năm sinh', 'Nơi ở', 'SĐT'].map(function (t, i) { return [32 + i, t, 'Thông tin về Bố']; }))
        .concat(['Họ tên', 'Năm sinh', 'Nơi ở', 'SĐT'].map(function (t, i) { return [36 + i, t, 'Thông tin về Mẹ']; }))
        .concat(['Số QĐ TT', 'Ngày ban hành', 'Khóa ĐT', 'Mã ngành', 'Mã lớp QL', 'Mã SV'].map(function (t, i) { return [40 + i, t, 'Thông tin trúng tuyển']; }))
        .concat(['Đối tượng HĐ', 'Tên đơn vị', 'Mã QHNS', 'Địa chỉ cơ quan', 'MST'].map(function (t, i) { return [46 + i, t, 'Thông tin xuất hóa đơn']; }))
        .concat([[51, 'Đối tác / nguồn', 'Nguồn khai thác']])
        /* Pull 29/9: hai nhóm thêm ở CUỐI, khớp 17 giá trị [52..68] của mang() */
        .concat(['Kế hoạch tuyển sinh', 'Đợt tuyển sinh', 'Mã hồ sơ', 'Số báo danh', 'Nguyện vọng đầu ra', 'Hệ đào tạo', 'Chương trình đào tạo',
            'Ngành tuyển sinh', 'Trạng thái hồ sơ', 'Kết quả xét tuyển', 'Ngày nộp hồ sơ', 'Ngày có kết quả', 'Ngày tiếp nhận', 'Đã tạo HS học tập']
            .map(function (t, i) { return [52 + i, t, 'Hồ sơ & kế hoạch']; }))
        .concat(['Người mua HĐ', 'Email nhận HĐ', 'SĐT nhận HĐ'].map(function (t, i) { return [66 + i, t, 'Hóa đơn (bổ sung)']; }));
    /* Cột chế độ GỌN (_KQ_COT_GON): khoá lọc 'i<chỉ số>' dùng chung hai chế độ; "Ngành" tự tính tên ngành */
    var GON = [
        { key: 'i2', i: 2, ten: 'Họ và tên' }, { key: 'i3', i: 3, ten: 'Ngày sinh' }, { key: 'i4', i: 4, ten: 'Giới tính' },
        { key: 'i11', i: 11, ten: 'Số CCCD' }, { key: 'i8', i: 8, ten: 'Điện thoại' },
        { key: 'nganh', ten: 'Ngành', get: function (d, dr) {
            var t = T.pick(d, ['INTAKE_NGANH_TEN', 'NGANH_TEN', 'TEN_NGANH', 'MaNganh_Ten']);
            if (t) return t;
            var x = dr[T.pick(d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id'])];
            return (x && x.nganhTen) || '';
        } },
        { key: 'i44', i: 44, ten: 'Mã lớp QL' }, { key: 'i51', i: 51, ten: 'Nguồn khai thác' }, { key: 'i41', i: 41, ten: 'Ngày BH QĐ' }
    ];
    function timCot(key) {
        var c = GON.filter(function (x) { return x.key === key; })[0];
        if (c) return c;
        var f = FULL.filter(function (x) { return 'i' + x[0] === key; })[0];
        return f ? { key: key, i: f[0], ten: f[1] } : null;
    }
    function giaTri(d, cot, arr) {
        var v = cot.get ? cot.get(d, Q.dr) : (arr || mang(d, Q.dr))[cot.i];
        return (v == null ? '' : String(v)).trim();
    }
    /* "14/09/2026 15:03:22" / "1/8/2007" / "2026-10-01T09:34:24" → số để so sánh; không phải ngày → null (gốc 1/10 nhận thêm ISO) */
    function soNgay(s) {
        if (!s) return null;
        if (s instanceof Date) return s.getTime();
        var str = String(s).trim();
        var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)).getTime();
        m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
        if (m) return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0)).getTime();
        return null;
    }
    /* Mốc thời gian đại diện của một hồ sơ (_kqGetRowTime, gốc 1/10): ngày tạo → ngày ban hành KQ → ngày nộp → ngày cập nhật
       → ngày tiếp nhận → cột ngày bất kỳ có tên kiểu NGAY_TAO / NGAY_NOP / CREATED. Không có → 0. */
    function mocHoSo(d) {
        var p = function (k) { return T.pick(d, k); };
        var cac = [p(['HOSO_NGAYTAO', 'NGAY_TAO', 'NGAYTAO', 'NgayTao', 'NgayTao_dd_mm_yyyy_hhmmss']), p(['KETQUA_NGAYBANHANH', 'NGAY_QD_TT', 'HOSO_NGAYKETQUA']),
            p(['HOSO_NGAYNOP', 'NGAY_NOP', 'NGAYNOP', 'NGAY_DK', 'NGAYDK']), p(['HOSO_NGAYCAPNHAT', 'NGAY_CAPNHAT', 'NGAYCAPNHAT']), p(['INTAKE_NGAYTIEPNHAN']),
            T.pickFuzzy(d, /(NGAY_?TAO|NGAY_?NOP|NGAY_?DK|NGAY_?BANHANH|NGAY_?QD|CREATED)/i)];
        for (var i = 0; i < cac.length; i++) { var t = cac[i] ? soNgay(cac[i]) : null; if (t !== null && !isNaN(t) && t > 0) return t; }
        return 0;
    }

    /* =======================================================================
       Mở hộp
       ======================================================================= */
    T.moKQDK = function (o) {
        var kh = o.kh || T.khHienTai();
        T.S.khId = T.id(kh) || T.S.khId;
        T.S.dotKQ = o.dot || '';
        /* Màn con NGAY TRONG TRANG (BO-CUC luật 1; trước 30/9 là hộp thoại lớn): o.host = thân màn con "Các đợt tuyển sinh" khi mở
           từ đó (tầng hai), không truyền thì thay chỗ cả màn (T.S.root). Q.dlg giữ tên cũ = khung formTrang ({ el, body, close() }). */
        var dlg = T.moTrang({
            host: o.host,
            title: 'Kết quả đăng ký', icon: 'fa-file-lines', cols: 1,
            body: '<div class="khtsn-badge" data-kq="badge"></div>' +
                '<div data-kqv="list" hidden></div><div data-kqv="import" hidden></div><div data-kqv="khai" hidden></div>',
            onClose: function () {
                document.removeEventListener('mousedown', ngoaiLoc, true);
                document.removeEventListener('keydown', phimLoc, true);
                if (Q && Q.dlg === dlg) Q = null;
            }
        });
        /* Popup lọc: bấm ra ngoài / Esc thì đóng. Gắn ở document (không còn thẻ dialog bao quanh); khung rời trang thì tự gỡ. */
        function conSong() {
            if (dlg.el.isConnected) return true;
            document.removeEventListener('mousedown', ngoaiLoc, true);
            document.removeEventListener('keydown', phimLoc, true);
            return false;
        }
        function ngoaiLoc(ev) {
            if (!conSong() || !Q || Q.dlg !== dlg || !Q.pop) return;
            if (!ev.target.closest('.khtsn-fpop') && !ev.target.closest('[data-loc]')) dongLoc();
        }
        function phimLoc(ev) {
            if (!conSong() || !Q || Q.dlg !== dlg || !Q.pop || ev.key !== 'Escape') return;
            ev.stopPropagation(); ev.preventDefault(); dongLoc();
        }
        document.addEventListener('mousedown', ngoaiLoc, true);
        document.addEventListener('keydown', phimLoc, true);
        /* Thanh công cụ danh sách ghim NGAY DƯỚI đầu khung đang dính (đầu khung cao bao nhiêu thì lùi xuống bấy nhiêu — _khtsn.css) */
        var dau = dlg.el.querySelector('.ums-panel__head');
        if (dau) dlg.el.style.setProperty('--khtsn-dau', dau.offsetHeight + 'px');
        Q = {
            dlg: dlg, body: dlg.body, kh: kh, khId: T.S.khId, rows: [], view: [], dr: {}, page: 1, size: 50,
            mode: 'gon', filters: {}, sort: null, vaoTuList: false, moHoSo: o.moHoSo || ''
        };
        try { Q.mode = localStorage.getItem('kqdk_tbmode') === 'full' ? 'full' : 'gon'; } catch (x) { /* chặn lưu trữ */ }
        var v = function (k) { return dlg.body.querySelector('[data-kqv="' + k + '"]'); };
        Q.v = { list: v('list'), import: v('import'), khai: v('khai') };
        Q.hien = function (k) {
            Object.keys(Q.v).forEach(function (x) { Q.v[x].hidden = x !== k; });
            Q.veBadge();
        };
        Q.veBadge = function () {
            var b = dlg.body.querySelector('[data-kq="badge"]');
            var khTen = T.tenMa(T.tenKH(Q.kh), Q.kh.MA || Q.kh.Ma || '');
            var dotId = Q.khai && Q.khai.dotHienTai ? Q.khai.dotHienTai() : T.S.dotKQ;
            var dot = (T.S.dtDot || []).filter(function (d) { return String(T.id(d)) === String(dotId); })[0];
            var dotTen = dot ? T.tenMa(dot.TEN || dot.Ten || '', dot.MA || dot.Ma || '') : '';
            b.innerHTML = khTen ? '<i class="fa-light fa-layer-group"></i> ' + ui.esc(khTen) + ' <span class="khtsn-badge__sep">›</span> ' +
                (dotTen ? '<b>' + ui.esc(dotTen) + '</b>' : '<span class="khtsn-badge__chua">' + (dotId ? 'đợt đang chọn' : 'chưa chọn đợt') + '</span>') : '';
            b.hidden = !khTen;
        };
        T.dsDot(Q.khId).then(function () { Q.veBadge(); });
        DM_TEN.forEach(function (ma) { T.napMapDM(ma).then(function () { if (!Q.v.list.hidden) veTrang(); }); });

        dungDanhSach();
        if (o.mode === 'import') { T.kqImport(Q); Q.hien('import'); }
        else if (o.mode === 'khai') { Q.khai = T.kqKhai(Q); Q.khai.moiMoi(); Q.hien('khai'); }
        else { Q.hien('list'); napDS(); }
        return Q;
    };

    /* ---------- Khai / Sửa từ danh sách ------------------------------------ */
    T.kqMoSua = function (id) {
        if (!Q) return;
        var d = Q.rows.filter(function (r) { return T.hid(r) === id; })[0];
        if (!d) { ui.toast('Không tìm thấy hồ sơ trong danh sách — vui lòng Tải lại', 'warn'); return; }
        if (!Q.khai) Q.khai = T.kqKhai(Q);
        Q.vaoTuList = true;
        Q.khai.moSua(d);
        Q.hien('khai');
    };
    /** Nút Đóng của màn khai: vào từ danh sách → lùi về danh sách; không thì đóng cả màn con (btnKQDK_Close) */
    T.kqDong = function (taiLai) {
        if (!Q) return;
        if (Q.vaoTuList) { Q.vaoTuList = false; Q.hien('list'); if (taiLai) napDS(); return; }
        Q.dlg.close();
    };
    T.kqNapLai = function () { if (Q) napDS(); };

    /* =======================================================================
       Màn danh sách
       ======================================================================= */
    function dungDanhSach() {
        var host = Q.v.list;
        host.innerHTML =
            '<div class="khtsn-kq__dinh">' +      // pull 29/9: thanh công cụ + dải lọc ghim lại khi cuộn
            '<div class="ums-row khtsn-kq__bar">' +
                '<div class="ums-searchbar khtsn-kq__tim"><span class="ums-searchbar__icon"><i class="fa-light fa-magnifying-glass"></i></span>' +
                    '<input class="ums-searchbar__input" data-kq="q" type="text" autocomplete="off" placeholder="Tìm nhanh (họ tên, SĐT, CCCD, mã HS, SBD)..."></div>' +
                ui.btn('search', { text: 'Tìm', attr: { 'data-kq': 'tim' } }) +
                ui.btn('excel', { text: 'Xuất kết quả', attr: { 'data-kq': 'xuat' } }) +
                ui.btn('confirm', { text: 'Phân lớp tự động', mod: 'out-warn', icon: 'fa-people-arrows', attr: { 'data-kq': 'phanlop', title: 'Phân lớp tự động cho các hồ sơ đã tick' } }) +
                '<span data-kq="che">' + ui.chips([{ key: 'gon', label: 'Gọn' }, { key: 'full', label: 'Đầy đủ' }], Q.mode) + '</span>' +
                '<span class="ums-u-fz13 khtsn-kq__tt" data-kq="tt" hidden></span>' +
                '<span class="khtsn-kq__tong">Tổng: ' + '<span class="ums-badge ums-badge--info" data-kq="tong">0</span></span>' +
                '<span data-kq="bc" class="ums-row"></span>' +
                ui.btn('reload', { attr: { 'data-kq': 'nap' } }) +
            '</div>' +
            '<div class="khtsn-kq__chip" data-kq="chip" hidden></div>' +
            '</div>' +
            ums.pat.panel({ title: 'Danh sách hồ sơ đã đăng ký', icon: 'fa-list', flush: true, zone: 'kqbang' });
        ums.report.mount(host.querySelector('[data-kq="bc"]'), { collect: function (add) { T.themThamSoBaoCao(add); } });

        host.addEventListener('click', function (ev) {
            var loc = ev.target.closest('[data-loc]');
            if (loc) { ev.stopPropagation(); if (Q.pop && Q.pop.key === loc.getAttribute('data-loc')) dongLoc(); else moLoc(loc.getAttribute('data-loc'), loc); return; }
            var chip = ev.target.closest('[data-chip]');
            if (chip && host.querySelector('[data-kq="che"]').contains(chip)) { doiChe(chip.getAttribute('data-chip')); return; }
            var x = ev.target.closest('[data-chipx]');
            if (x) { var k = x.getAttribute('data-chipx'); if (k === '__sort') Q.sort = null; else delete Q.filters[k]; apDung(); return; }
            var b = ev.target.closest('[data-kq]');
            var k2 = b && b.getAttribute('data-kq');
            if (k2 === 'tim') apDung();
            else if (k2 === 'nap') { host.querySelector('[data-kq="q"]').value = ''; Q.filters = {}; Q.sort = null; napDS(); }
            else if (k2 === 'xuat') xuat();
            else if (k2 === 'phanlop') phanLop();
            else if (k2 === 'xoahet') { Q.filters = {}; Q.sort = null; host.querySelector('[data-kq="q"]').value = ''; apDung(); }
            else if (k2 === 'napct') { napChiTiet(trangHienTai(), true); }
            else if (k2 === 'sua') T.kqMoSua(b.getAttribute('data-id'));
            else if (k2 === 'xoa') xoaHoSo(b.getAttribute('data-id'));
            else if (!b || ['sel', 'all'].indexOf(k2) < 0) {
                // Bấm vào dòng → mở hồ sơ (bỏ qua nút / ô chọn / khi đang bôi đen chữ)
                var tr = ev.target.closest('tbody tr[data-id]');
                if (!tr || ev.target.closest('a,button,input,label,select')) return;
                var sel = window.getSelection && window.getSelection();
                if (sel && String(sel).length) return;
                T.kqMoSua(tr.getAttribute('data-id'));
            }
        });
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute && t.getAttribute('data-kq') === 'all') {
                Array.prototype.forEach.call(host.querySelectorAll('input[data-kq="sel"]'), function (x) { x.checked = t.checked; });
            }
        });
        host.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' && ev.target.getAttribute && ev.target.getAttribute('data-kq') === 'q') { ev.preventDefault(); apDung(); }
        });
        // Popup lọc: bấm ra ngoài / Esc thì đóng — gắn ở document trong T.moKQDK (ngoaiLoc / phimLoc), gỡ khi đóng màn con
    }
    function el(k) { return Q.v.list.querySelector('[data-kq="' + k + '"]'); }

    function doiChe(m) {
        Q.mode = m === 'full' ? 'full' : 'gon';
        try { localStorage.setItem('kqdk_tbmode', Q.mode); } catch (x) { /* chặn lưu trữ */ }
        el('che').innerHTML = ui.chips([{ key: 'gon', label: 'Gọn' }, { key: 'full', label: 'Đầy đủ' }], Q.mode);
        veTrang();
    }

    /* ---------- Nạp danh sách (loadKQDK_List) ------------------------------ */
    function napDS(gon) {
        if (!Q) return;
        if (!Q.khId) { Q.rows = []; apDung(); return; }
        var q = Q;
        var banGon = !!gon || C.fullHong;
        ums.pat.panel && (Q.body.querySelector('[data-z="kqbang"]').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'));
        ums.api.call(P.dsHoSoTS({ kh: Q.khId, dot: T.S.dotKQ, full: !banGon, lopDK: true })).then(function (r) {
            if (q !== Q) return;
            var rows = T.rows(r);
            if (!banGon && !rows.length) { napDS(true); return; }
            Q.rows = rows;
            var profIds = [];
            rows.forEach(function (d) { var p = T.pid(d); if (p && !C.profile[p] && profIds.indexOf(p) < 0) profIds.push(p); });
            var lo = [];
            for (var i = 0; i < profIds.length; i += 300) lo.push(profIds.slice(i, i + 300));
            return Promise.all([
                T.dauRaMap(Q.khId).then(function (m) { Q.dr = m; }),
                T.ensureNganhMa(),
                Promise.all(lo.map(function (b) { return P.dsProfile(b).then(function (a) { a.forEach(function (p) { if (p.PERSON_ID || p.Person_Id) C.profile[p.PERSON_ID || p.Person_Id] = p; }); }); }))
            ]).then(function () {
                if (q !== Q) return;
                apDung();
                if (Q.moHoSo) { var id = Q.moHoSo; Q.moHoSo = ''; setTimeout(function () { T.kqMoSua(id); }, 60); }
            });
        }).catch(function (err) {
            if (q !== Q) return;
            if (!banGon) { C.fullHong = true; napDS(true); return; }
            Q.rows = []; apDung();
            ums.api.handle(err, 'LayDS_HoSo_TS');
        });
    }

    /* ---------- Lọc + sắp xếp (_kqApplyAllFilters) ------------------------ */
    function khopTim(d, kw) {
        var p = T.pick;
        return [p(d, ['COREPERSON_HOTEN', 'CorePerson_HoTen', 'HOTEN']), p(d, ['PERSONCONTACT_DIENTHOAI', 'PersonContact_DienThoai', 'DIENTHOAI']),
            p(d, ['PERSONCONTACT_EMAIL', 'EMAIL']), p(d, ['PERSONIDEN_SOCCCD', 'PersonIden_SoCCCD', 'SOCCCD']),
            p(d, ['HOSO_MAHOSO', 'HoSo_MaHoSo', 'MA_HOSO']), p(d, ['HOSO_SOBAODANH', 'HoSo_SoBaoDanh', 'SBD']),
            p(d, ['COREPERSON_MASO', 'MA_SV', 'MASO'])].join('|').toLowerCase().indexOf(kw) !== -1;
    }
    function locDuLieu(boQua) {
        var rows = Q.rows.slice();
        var kw = (el('q').value || '').toLowerCase().trim();
        if (kw) rows = rows.filter(function (d) { return khopTim(d, kw); });
        var cac = Object.keys(Q.filters).filter(function (k) { return k !== boQua; }).map(function (k) { return { cot: timCot(k), chon: Q.filters[k] }; })
            .filter(function (x) { return x.cot && x.chon && x.chon.length; });
        if (cac.length) {
            rows = rows.filter(function (d) {
                var arr = mang(d, Q.dr);
                return cac.every(function (x) { return x.chon.indexOf(giaTri(d, x.cot, arr)) >= 0; });
            });
        }
        return rows;
    }
    function apDung() {
        if (!Q) return;
        var rows = locDuLieu();
        if (Q.sort && Q.sort.key) {
            var cot = timCot(Q.sort.key), huong = Q.sort.dir === 'desc' ? -1 : 1;
            if (cot) rows.sort(function (a, b) {
                var va = giaTri(a, cot), vb = giaTri(b, cot);
                if (!va && !vb) return 0; if (!va) return 1; if (!vb) return -1;
                var da = soNgay(va), db = soNgay(vb);
                if (da !== null && db !== null) return (da - db) * huong;
                if (/^[\d\s.,-]+$/.test(va) && /^[\d\s.,-]+$/.test(vb)) {
                    var na = parseFloat(va.replace(/[^\d.-]/g, '')), nb = parseFloat(vb.replace(/[^\d.-]/g, ''));
                    if (!isNaN(na) && !isNaN(nb)) return (na - nb) * huong;
                }
                return va.localeCompare(vb, 'vi') * huong;
            });
        } else {
            /* Mặc định (chưa bấm sắp xếp cột): hồ sơ MỚI NHẤT lên đầu bảng (gốc 1/10) — vừa nhập xong không bị đẩy sang trang sau. */
            rows = rows.map(function (d, i) { return { d: d, t: mocHoSo(d), i: i }; })
                .sort(function (a, b) { return (b.t - a.t) || (a.i - b.i); }).map(function (x) { return x.d; });
        }
        Q.view = rows;
        Q.page = 1;
        veChip();
        veTrang();
    }
    function veChip() {
        var h = '';
        Object.keys(Q.filters).forEach(function (k) {
            var cot = timCot(k), chon = Q.filters[k] || [];
            if (!cot || !chon.length) return;
            var mo = chon.length <= 2 ? chon.map(function (v) { return v || '(trống)'; }).join(', ') : chon.length + ' giá trị';
            h += '<span class="khtsn-chip"><b>' + ui.esc(cot.ten) + ':</b> ' + ui.esc(mo) +
                '<i class="fa-light fa-xmark khtsn-chip__x" data-chipx="' + ui.esc(k) + '" title="Bỏ lọc cột này"></i></span>';
        });
        if (Q.sort && Q.sort.key && timCot(Q.sort.key)) {
            h += '<span class="khtsn-chip khtsn-chip--sort"><i class="fa-light fa-arrow-' + (Q.sort.dir === 'asc' ? 'down-a-z' : 'up-z-a') + '"></i> ' +
                ui.esc(timCot(Q.sort.key).ten) + '<i class="fa-light fa-xmark khtsn-chip__x" data-chipx="__sort" title="Bỏ sắp xếp"></i></span>';
        }
        var c = el('chip');
        c.innerHTML = h ? h + ui.btn('del', { text: 'Xóa hết lọc', mod: 'out-danger', cls: 'ums-btn--sm', attr: { 'data-kq': 'xoahet', 'data-khong-chon': '1' } }) : '';
        c.hidden = !h;
    }
    function trangHienTai() {
        var from = (Q.page - 1) * Q.size;
        return Q.view.slice(from, from + Q.size);
    }

    /* ---------- Vẽ một trang (_kqRenderPage) ------------------------------- */
    function thLoc(key, ten) {
        var dang = !!(Q.filters[key] && Q.filters[key].length);
        var sort = Q.sort && Q.sort.key === key ? Q.sort.dir : '';
        return '<span class="khtsn-th">' + ui.esc(ten) +
            (sort ? '<i class="fa-light fa-arrow-' + (sort === 'asc' ? 'down-a-z' : 'up-z-a') + ' khtsn-th__sort"></i>' : '') +
            '<i class="fa-light fa-filter khtsn-th__loc' + (dang ? ' is-on' : '') + '" data-loc="' + key + '" title="Lọc / sắp xếp"></i></span>';
    }
    function veTrang() {
        if (!Q) return;
        var host = Q.body.querySelector('[data-z="kqbang"]');
        if (!host) return;
        el('tong').textContent = Q.view.length;
        var shown = trangHienTai(), from = (Q.page - 1) * Q.size;
        var arrs = shown.map(function (d) { return mang(d, Q.dr); });
        var cols = [
            { head: '<input type="checkbox" data-kq="all" title="Chọn tất cả">', cls: 'is-center khtsn-kq__c2', width: '44px',
              render: function (d, i) { return '<input type="checkbox" data-kq="sel" data-i="' + (from + i) + '">'; } },
            { title: 'Thao tác', cls: 'is-actions khtsn-kq__c3', width: '88px', render: function (d) {
                var id = ui.esc(T.hid(d));
                return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-kq="sua" data-id="' + id + '" title="Sửa hồ sơ"><i class="fa-light fa-pen-to-square"></i></button>' +
                    '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-kq="xoa" data-id="' + id + '" title="Xóa hồ sơ"><i class="fa-light fa-trash-can"></i></button>'; } }
        ];
        if (Q.mode === 'gon') {
            GON.forEach(function (c) {
                cols.push({ head: thLoc(c.key, c.ten), cls: c.i === 2 || c.key === 'nganh' || c.i === 51 ? 'khtsn-kq__rong' : 'is-center is-nowrap',
                    render: function (d, i) { return ui.esc(c.get ? c.get(d, Q.dr) : arrs[i][c.i]); } });
            });
        } else {
            FULL.forEach(function (f) {
                var c = { head: thLoc('i' + f[0], f[1]), cls: 'is-nowrap', render: function (d, i) { return ui.esc(arrs[i][f[0]]); } };
                if (f[2]) c.group = [f[2]];
                cols.push(c);
            });
        }
        ui.table({
            el: host, rows: shown, columns: cols, tableCls: 'ums-table--lined khtsn-kq__bang' + (Q.mode === 'gon' ? ' khtsn-kq__bang--gon' : ''),
            empty: 'Không có dữ liệu',
            rowCls: function () { return 'khtsn-kq__dong'; },
            page: { index: Q.page, size: Q.size, total: Q.view.length, sizes: [25, 50, 100, 200, 'all'],
                onChange: function (p) { var n = Math.max(1, Math.ceil(Q.view.length / Q.size)); if (p >= 1 && p <= n) { Q.page = p; veTrang(); } },
                onSize: function (v) { Q.size = v; Q.page = 1; veTrang(); } }
        });
        // tr mang data-id = HOSO_ID (ui.table chỉ gắn khi có cột ID)
        Array.prototype.forEach.call(host.querySelectorAll('tbody tr'), function (tr, i) { if (shown[i]) tr.setAttribute('data-id', T.hid(shown[i])); });
        lamGiau(shown);
    }
    /* Làm giàu các dòng vừa vẽ, xong vẽ lại MỘT lần (lượt sau mọi id đã nằm trong nhớ tạm → dừng) */
    function lamGiau(shown) {
        var q = Q;
        var ve = function (co) { if (co && q === Q && !Q.v.list.hidden) veTrang(); };
        napLienHe(shown).then(ve);
        P.ensureLop(shown).then(ve);
        napNguon(shown).then(ve);
        if (Q.mode === 'full') napChiTiet(shown, false).then(ve);
    }
    function napLienHe(rows) {
        var ids = [];
        rows.forEach(function (d) { var p = T.pid(d); if (p && !(p in C.lienHe) && ids.indexOf(p) < 0) ids.push(p); });
        if (!ids.length) return Promise.resolve(false);
        ids.forEach(function (p) { C.lienHe[p] = C.lienHe[p] || { sdt: '', email: '' }; });
        return T.hangDoi(ids.map(function (p) { return function () { return P.lienHe(p).then(function (lh) { C.lienHe[p] = lh; }); }; }), 6)
            .then(function () { return true; });
    }
    /* Nguồn khai thác cho cột "Nguồn khai thác" (_ensureNguonForRows — theo gốc 2/10):
       hồ sơ có sẵn cột đối tác thì đọc thẳng; còn lại hỏi TỪNG người (P.timDoiTac — thử lùi dần), 6 luồng.
       Gốc 2/10 bỏ bước "thử cả lô trước" (personId rỗng) → bỏ theo. C.nguonDangTai chặn hỏi trùng khi vẽ lại lúc đang tải. */
    function napNguon(rows) {
        var can = [];
        C.nguonDangTai = C.nguonDangTai || {};
        return P.dmDoiTac().then(function (dm) {
            var coMoi = false;
            rows.forEach(function (d) {
                var p = T.pid(d);
                if (!p) return;
                var ten = P.tenDoiTacCua(d, dm, true);
                if (ten) { if (C.nguon[p] !== ten) { C.nguon[p] = ten; coMoi = true; } return; }
                if (!(p in C.nguon) && !C.nguonDangTai[p] && can.indexOf(p) < 0) can.push(p);
            });
            if (!can.length) return coMoi;
            var khId = Q.khId, dotId = T.S.dotKQ;
            can.forEach(function (p) { C.nguonDangTai[p] = 1; });
            return T.hangDoi(can.map(function (p) {
                return function () {
                    return P.timDoiTac(khId, dotId, p).then(function (a) {
                        delete C.nguonDangTai[p];
                        if (a.length) { a.forEach(function (r) { C.nguon[T.pickLoose(r, ['CORE_PERSON_ID', 'COREPERSON_ID', 'PERSON_ID']) || p] = P.tenDoiTacCua(r, dm) || ''; }); coMoi = true; }
                        else if (!(p in C.nguon)) C.nguon[p] = '';
                    });
                };
            }), 6).then(function () { return coMoi; });
        });
    }
    /* Chế độ Đầy đủ: 4 lời gọi / người (_ensureChiTietForRows) */
    function napChiTiet(rows, ep) {
        var viec = [];
        rows.forEach(function (d) {
            var p = T.pid(d);
            if (!p || (p in C.ct) || viec.some(function (x) { return x.p === p; })) return;
            viec.push({ p: p, h: T.hid(d) });
        });
        var tt = el('tt');
        if (!viec.length) { tt.hidden = true; return Promise.resolve(false); }
        if (viec.length > 60 && !ep) {
            tt.hidden = false;
            tt.innerHTML = ui.btn('reload', { text: 'Nạp chi tiết ' + viec.length + ' dòng', mod: 'out-warn', cls: 'ums-btn--sm', icon: 'fa-cloud-arrow-down', attr: { 'data-kq': 'napct' } });
            return Promise.resolve(false);
        }
        var xong = 0;
        tt.hidden = false;
        var ve = function () { tt.innerHTML = '<i class="fa-light fa-spinner fa-spin"></i> Đang nạp chi tiết ' + xong + '/' + viec.length; };
        ve();
        var hang = [];
        var chuanBi = Promise.all([P.dmFam(), P.dmAddr(), C.ttMap ? null : ums.pat.dmTinhThanh().then(function (a) {
            C.ttMap = {}; (a || []).forEach(function (x) { C.ttMap[x.ID] = x.TEN || ''; });
        }, function () { C.ttMap = {}; })]);
        viec.forEach(function (v) {
            C.ct[v.p] = {};
            var con = 4, mot = function () { if (--con === 0) { xong++; ve(); } };
            hang.push(function () { return (v.h ? P.layTTHoSo(v.h).then(function (r) { if (r) C.ct[v.p].hs = r; }) : Promise.resolve()).then(mot); });
            hang.push(function () { return chuanBi.then(function (x) { return P.dsGiaDinh(v.p).then(function (rs) {
                if (rs.length) { C.ct[v.p].bo = P.timGiaDinh(rs, 'BO', x[0]); C.ct[v.p].me = P.timGiaDinh(rs, 'ME', x[0]); } }); }).then(mot); });
            hang.push(function () { return P.dsHoaDon(v.p).then(function (a) { if (a.length) C.ct[v.p].hd = a[0]; }).then(mot); });
            hang.push(function () { return chuanBi.then(function (x) { return P.dsDiaChi(v.p).then(function (rs) {
                if (rs.length) { C.ct[v.p].hk = P.timDiaChi(rs, 'HK', x[1]); C.ct[v.p].ns = P.timDiaChi(rs, 'NS', x[1]); } }); }).then(mot); });
        });
        return T.hangDoi(hang, 6).then(function () { tt.hidden = true; tt.innerHTML = ''; if (ep) veTrang(); return !ep; });
    }

    /* ---------- Popup lọc kiểu Excel (_kqMoFilter) ------------------------ */
    function dongLoc() { if (Q && Q.pop) { Q.pop.el.remove(); Q.pop = null; } }
    function moLoc(key, anchor) {
        var cot = timCot(key);
        if (!cot) return;
        dongLoc();
        var dem = {};
        locDuLieu(key).forEach(function (d) { var v = giaTri(d, cot); dem[v] = (dem[v] || 0) + 1; });
        var ds = Object.keys(dem).sort(function (a, b) {
            if (!a) return 1; if (!b) return -1;
            var da = soNgay(a), db = soNgay(b);
            return da !== null && db !== null ? da - db : a.localeCompare(b, 'vi');
        });
        var dang = Q.filters[key] || null;
        var pop = document.createElement('div');
        pop.className = 'khtsn-fpop';
        pop.innerHTML =
            '<div class="khtsn-fpop__head">' + ui.esc(cot.ten) + '</div>' +
            '<div class="khtsn-fpop__sort">' +
                '<button type="button" data-fp="asc"><i class="fa-light fa-arrow-down-a-z"></i> Tăng dần</button>' +
                '<button type="button" data-fp="desc"><i class="fa-light fa-arrow-up-z-a"></i> Giảm dần</button></div>' +
            '<div class="khtsn-fpop__tim"><input class="ums-input" data-fp="tim" placeholder="Tìm trong danh sách..." autocomplete="off"></div>' +
            '<label class="khtsn-fpop__item khtsn-fpop__all"><input type="checkbox" data-fp="all" checked><span data-fp="allten"><b>(Chọn tất cả)</b></span><em data-fp="alldem">' + ds.length + '</em></label>' +
            '<div class="khtsn-fpop__list">' + (ds.map(function (v, i) {
                return '<label class="khtsn-fpop__item" data-v="' + ui.esc(v.toLowerCase()) + '"><input type="checkbox" data-fp="cb" data-i="' + i + '"' +
                    (!dang || dang.indexOf(v) >= 0 ? ' checked' : '') + '><span>' + (v ? ui.esc(v) : '<i class="ums-u-faint">(trống)</i>') + '</span><em>' + dem[v] + '</em></label>';
            }).join('') || '<div class="ums-u-faint khtsn-fpop__trong">Không có dữ liệu</div>') + '</div>' +
            '<div class="khtsn-fpop__foot"><button type="button" class="ums-btn ums-btn--sm ums-btn--out-danger" data-fp="bo" data-khong-chon="1">Bỏ lọc cột này</button>' +
                '<span><button type="button" class="ums-btn ums-btn--sm ums-btn--ghost" data-fp="huy">Hủy</button>' +
                '<button type="button" class="ums-btn ums-btn--sm ums-btn--primary" data-fp="ok">Đồng ý</button></span></div>';
        Q.body.appendChild(pop);
        Q.pop = { el: pop, key: key };
        var r = anchor.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
        var top = r.bottom + 6;
        if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
        pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 12)) + 'px';
        pop.style.top = top + 'px';
        var hien = function () { return Array.prototype.filter.call(pop.querySelectorAll('input[data-fp="cb"]'), function (x) { return !x.closest('label').hidden; }); };
        var dongBo = function () {
            var h2 = hien(), n = h2.filter(function (x) { return x.checked; }).length, all = pop.querySelector('[data-fp="all"]');
            all.checked = h2.length > 0 && n === h2.length; all.indeterminate = n > 0 && n < h2.length;
        };
        dongBo();
        pop.addEventListener('input', function (ev) {
            if (ev.target.getAttribute('data-fp') !== 'tim') return;
            var kw = ev.target.value.toLowerCase().trim();
            var soHien = 0;
            Array.prototype.forEach.call(pop.querySelectorAll('.khtsn-fpop__list label'), function (l) {
                l.hidden = !!kw && l.getAttribute('data-v').indexOf(kw) < 0;
                if (!l.hidden) soHien++;
            });
            // Nhãn + số đếm của "(Chọn tất cả)" theo phạm vi đang thấy (pull 29/9)
            pop.querySelector('[data-fp="allten"]').innerHTML = '<b>' + (kw ? '(Chọn tất cả kết quả tìm)' : '(Chọn tất cả)') + '</b>';
            pop.querySelector('[data-fp="alldem"]').textContent = soHien;
            dongBo();
        });
        pop.addEventListener('change', function (ev) {
            var k = ev.target.getAttribute('data-fp');
            if (k === 'all') hien().forEach(function (x) { x.checked = ev.target.checked; });
            dongBo();
        });
        pop.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-fp]');
            if (!b) return;
            var k = b.getAttribute('data-fp');
            if (k === 'asc' || k === 'desc') { Q.sort = { key: key, dir: k }; dongLoc(); apDung(); }
            else if (k === 'bo') { delete Q.filters[key]; dongLoc(); apDung(); }
            else if (k === 'huy') dongLoc();
            else if (k === 'ok') {
                /* Pull 29/9: dòng không khớp ô tìm chỉ bị ẨN chứ vẫn còn tick → đang gõ tìm thì chỉ tính dòng ĐANG HIỆN
                   (như Excel); và chọn hết kết quả tìm vẫn là một bộ lọc thật, không coi là "bỏ lọc". */
                var tatCa = Array.prototype.slice.call(pop.querySelectorAll('input[data-fp="cb"]')), dangHien = hien();
                var dangTim = dangHien.length !== tatCa.length;
                var coChu = !!(pop.querySelector('[data-fp="tim"]').value || '').trim();
                var chon = (coChu ? dangHien : tatCa).filter(function (x) { return x.checked; })
                    .map(function (x) { return ds[Number(x.getAttribute('data-i'))]; });
                if (!chon.length) { ui.toast('Phải chọn ít nhất 1 giá trị, nếu không bảng sẽ trống trơn.', 'warn'); return; }
                if (!dangTim && chon.length === ds.length) delete Q.filters[key]; else Q.filters[key] = chon;
                dongLoc(); apDung();
            }
        });
        setTimeout(function () { var t = pop.querySelector('[data-fp="tim"]'); if (t) t.focus(); }, 0);
    }

    /* ---------- Xuất kết quả (exportKQDK_Excel — đủ cột) ----------
       Pull 29/9: xuất ĐÚNG danh sách đang thấy (Q.view = sau tìm nhanh + lọc cột + sắp xếp); không lọc gì thì bằng cả
       danh sách. Như gốc: lọc ra 0 dòng thì lùi về toàn bộ danh sách. */
    function xuat() {
        var src = Q.view && Q.view.length ? Q.view : Q.rows;
        if (!src.length) { ui.toast('Không có dữ liệu để xuất', 'warn'); return; }
        var head = ['STT'].concat(FULL.map(function (f) {
            var t = f[1];
            if (f[2] === 'Hộ khẩu thường trú') t = 'HK ' + t;
            else if (f[2] === 'Thông tin về Bố') t = 'Bố - ' + t;
            else if (f[2] === 'Thông tin về Mẹ') t = 'Mẹ - ' + t;
            else if (f[0] === 17) t = 'Phương thức XT';
            else if (f[0] === 41) t = 'Ngày ban hành QĐ';
            else if (f[0] === 46) t = 'Đối tượng HĐ';
            else if (f[0] === 47) t = 'Tên đơn vị HĐ';
            else if (f[0] === 49) t = 'Địa chỉ cơ quan HĐ';
            else if (f[0] === 51) t = 'Nguồn khai thác';
            else if (f[0] === 65) t = 'Đã tạo hồ sơ học tập';
            return t;
        }));
        var aoa = [head];
        src.forEach(function (d, i) { var a = mang(d, Q.dr); aoa.push([i + 1].concat(a.slice(2))); });
        T.xuatAoa('DS_HoSo_TS_' + T.dauGio().slice(0, 13) + '.xls', aoa);
    }

    /* ---------- Xoá hồ sơ (deleteHoSo_TS) ---------------------------------- */
    function xoaHoSo(id) {
        if (!id) return;
        ui.confirm('Bạn có chắc chắn xóa hồ sơ này không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá hồ sơ' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'SV_Core_TS_HoSo_MH/GS4gHgkuEi4eFRIP', func: 'PKG_CORE_TS_HOSO.Xoa_HoSo_TS',
                strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'XOA', strHoSo_Id: id
            }).then(function () { ui.toast('Xóa hồ sơ thành công', 'ok'); napDS(); });
        }).catch(function (err) { ums.api.handle(err, 'Xoa_HoSo_TS'); });
    }

    /* ---------- Phân lớp tự động cho các dòng đã tick --------------------- */
    var API_PL = ['SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYeLi0lcgPP', 'SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYeLi0lcwPP',
        'SV_CORE_NhapHoc_ThuTien_MH/ESkgLw0uMR4VNAUuLyYeLi0l'];
    function phanLopMot(pid) {
        var loi = [], i = 0;
        return new Promise(function (ok) {
            (function thu() {
                if (i >= API_PL.length) { ok({ ok: false, message: loi.join(' | ') || 'Không gọi được API phân lớp' }); return; }
                var a = API_PL[i++];
                ums.api.call({ action: a, func: 'PKG_CORE_NhapHoc_ThuTien.PhanLop_TuDong', strCore_Person_Id: pid,
                    strNguonSuKien_Code: 'TS_KQDK_AUTO_CLASS', strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', silent: true
                }).then(function () { ok({ ok: true }); }, function (err) { loi.push((a.split('/')[1] || a) + ': ' + err.message); thu(); });
            })();
        });
    }
    function phanLop() {
        var chon = Array.prototype.map.call(Q.v.list.querySelectorAll('input[data-kq="sel"]:checked'), function (x) { return Q.view[Number(x.getAttribute('data-i'))]; })
            .filter(Boolean);
        if (!chon.length) { ui.toast('Vui lòng tick ít nhất 1 hồ sơ để phân lớp tự động', 'warn'); return; }
        var hop = chon.filter(function (d) { return !!T.pid(d); });
        var boQua = chon.length - hop.length;
        if (!hop.length) { ui.toast('Không lấy được CorePerson_Id từ các dòng đã tick', 'warn'); return; }
        ui.confirm('Thực hiện phân lớp tự động cho ' + hop.length + ' hồ sơ đã chọn?', { ok: 'Thực hiện', title: 'Phân lớp tự động' }).then(function (yes) {
            if (!yes) return;
            var ok = 0, loi = [];
            return hop.reduce(function (p, d) {
                return p.then(function () { return phanLopMot(T.pid(d)).then(function (r) { if (r.ok) ok++; else loi.push((T.pick(d, ['COREPERSON_HOTEN']) || T.hid(d)) + ': ' + r.message); }); });
            }, Promise.resolve()).then(function () {
                ui.toast('Phân lớp tự động xong. Thành công: ' + ok + '/' + hop.length + ', Lỗi: ' + loi.length +
                    (boQua ? ', Bỏ qua (thiếu CorePerson_Id): ' + boQua : '') + (loi.length ? '. Chi tiết: ' + loi.slice(0, 5).join(' | ') : ''), loi.length ? 'warn' : 'ok');
                napDS();
            });
        });
    }
})();
