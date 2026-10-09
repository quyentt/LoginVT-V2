/* =========================================================================
   ums.khtsn.kqKhai(Q) — biểu mẫu "Khai trực tiếp hồ sơ" (Thêm) / Sửa hồ sơ, trong hộp Kết quả đăng ký
   Bản gốc: #kqdk_khai (initKhai_DanhMuc, resetKhai_HoSo, saveKhai_HoSo, openSuaHoSo, saveSuaHoSo_Full,
            _loadPersonExtras_ForEdit, _bindHoSoDetail_ForEdit, _loadHoSoDM_ForEdit, _saveHoSoDM_Rows,
            _kiemTraHoaDon, openChonNVDauVao / confirmChonNVDauVao …)
   ---------------------------------------------------------------------------
   8 bước như gốc: Cá nhân · CCCD & Hộ khẩu · Xét tuyển · Trúng tuyển · Gia đình · Xuất hóa đơn · Nguồn khai thác ·
   Danh mục hồ sơ. Cách xem: Theo bước / Gộp nhóm (1+2+5+7 thành "Hồ sơ cá nhân") / Một trang — nhớ theo máy.
   Mục "Nhập mục này" (đóng sẵn: Thông tin xét tuyển, Tổ hợp môn & điểm, Thông tin thanh toán) — nhớ theo máy,
   hồ sơ có dữ liệu trong mục đóng thì tự mở tạm.
   Lời gọi (chép nguyên):
     Thêm: SV_Core_TS_HoSo_MH / PKG_CORE_TS_HOSO.Them_HoSo_TS (param _Id; d* rỗng → null) → tra Core_Person_Id + HOSO_ID
           (LayDS_HoSo_TS theo CCCD / họ tên, thử lại tối đa 3 nhịp) → ghi bảng phụ (ums.khtsn.phu) + danh mục hồ sơ.
     Sửa: PKG_CORE_TS_HOSO.Sua_HoSo_TS — ô TRỐNG thì bỏ khỏi payload (chống ghi đè rỗng), d* ép số; strExtra_Data ≤ 990 byte.
     Nạp khi Sửa: LayTT_HoSo_TS, LayTTPerson_Profile, GetPersonContactByPerson_Id, Get_Person_Address,
           GetPersonIdentifierByPerson_Id, LayDS_Bank_TS, Get_Person_Family, LayDS_PersonInvoiceInfo, LayDS_TS_HoSo_DoiTacTS.
     Trúng tuyển: Pr_Ts_Kh_Dau_Ra_Get_Ds (nguyện vọng — dIs_Active 1), TS_CORE_KEHOACH_MH / LayDS_PhuongThucTuyenSinh,
           LayDS_LopQuanLy_TheoDauRa, pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao.
     Danh mục hồ sơ: TS_HoSo_MH / pkg_tuyensinh_hoso.LayDSTS_HoSo / Them_ / Sua_ / Xoa_TS_HoSo (khung = quy định của ĐỢT
           — LayDSTS_QuyDinhHoSo); chỉ gửi dòng mới có nhập hoặc dòng đã có mà đổi.
     Đổi nguyện vọng đầu vào: PKG_CORE_TS_HOSO.XacNhanChonChuongTrinhHoc (strPerson_Id, strDaoTao_ChuongTrinh_Id, strINTAKE_Id).
   Luật cha → con: Đợt → Nguyện vọng → Lớp dự kiến; Tỉnh → Quận/Huyện → Xã (tỉnh 2 cấp: Xã mở theo Tỉnh như gốc _apply2Cap).
   Khác gốc: ô ngày dùng lịch dd/mm/yyyy (gốc ô type=date); ngày cấp CCCD vẫn GỬI dạng yyyy-mm-dd như gốc gửi;
   thông báo sau khi lưu gộp một lần (toast); bỏ nút "Khổ vừa / rộng" (hộp đã giới hạn bề ngang).
   ---------------------------------------------------------------------------
   Theo gốc 1–2/10 (47ab8a26, bc5f0bf8, bc5d5f67):
     · Thêm: chặn trùng Số CCCD với hồ sơ đã có trong danh sách đang nạp (so theo chữ số) trước khi gọi Them_HoSo_TS.
     · Thêm / Sửa: nút Lưu khoá + chữ "Đang lưu…" / "Đang cập nhật…" tới khi xong (gốc: spinner chống bấm hai lần).
     · Them_HoSo_TS và Sua_HoSo_TS gửi thêm strTS_DoiTacTuyenSinh_Id, strTS_DoiTacTuyenSinh_id (gốc gửi cả hai cách viết),
       strTS_DoiTacTuyenSinh_Khac (= ghi chú nguồn khai thác). Sửa: ô trống vẫn bỏ khỏi payload như mọi ô khác.
     · Sửa: chờ bản đồ nguyện vọng đầu ra (Pr_Ts_Kh_Dau_Ra_Get_Ds) rồi mới suy đợt của hồ sơ.
     · Nạp nguồn khai thác khi Sửa: tra lùi dần (P.timDoiTac), dò thêm tên cột id / tên đối tác, không có dòng thì chọn theo
       tên đã biết ở cột "Nguồn khai thác" của danh sách; LayTT_HoSo_TS có cột đối tác thì điền khi ô còn trống.
     · Lưu nguồn khai thác xong cập nhật ngay tên ở cột danh sách. Tra hồ sơ vừa tạo: lần hai bỏ lọc đợt.
     · KHÔNG theo: gốc 2/10 khai lại _hsDotHienTai / _nvDauRaHienTai lần hai ở cuối đối tượng (bản sau đè bản trước, mất bước
       suy đợt từ nguyện vọng / lấy nguyện vọng từ danh sách) — bản này giữ dotHienTai / nvHienTai có đủ hai bước đó.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, T = ums.khtsn, P = T.phu;
    var e = T.e;
    var HS = 'PKG_CORE_TS_HOSO.';
    var A_HS = {
        LayDS: { action: 'TS_HoSo_MH/DSA4BRIVEh4JLhIu', func: 'pkg_tuyensinh_hoso.LayDSTS_HoSo' },
        Them: { action: 'TS_HoSo_MH/FSkkLB4VEh4JLhIu', func: 'pkg_tuyensinh_hoso.Them_TS_HoSo' },
        Sua: { action: 'TS_HoSo_MH/EjQgHhUSHgkuEi4P', func: 'pkg_tuyensinh_hoso.Sua_TS_HoSo' },
        Xoa: { action: 'TS_HoSo_MH/GS4gHhUSHgkuEi4P', func: 'pkg_tuyensinh_hoso.Xoa_TS_HoSo' }
    };
    var PANEL = [
        ['canhan', 'Cá nhân', 'fa-id-badge'], ['cccd', 'CCCD & Hộ khẩu', 'fa-address-card'], ['xettuyen', 'Xét tuyển', 'fa-file-pen'],
        ['trungtuyen', 'Trúng tuyển', 'fa-award'], ['giadinh', 'Gia đình', 'fa-people-roof'], ['hoadon', 'Xuất hóa đơn', 'fa-file-invoice-dollar'],
        ['nguonkt', 'Nguồn khai thác', 'fa-share-nodes'], ['hoso', 'Danh mục hồ sơ', 'fa-folder-open']
    ];
    var LS_SEC = 'kqdk_section_mo', LS_VIEW = 'kqdk_viewmode';

    /* ---------- dựng ô ---------- */
    function fld(k, label, ctl, o) { o = o || {}; return '<div' + (o.full ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(label, ctl, { required: o.req, hint: o.hint }) + '</div>'; }
    function inp(k, label, o) { o = o || {}; return fld(k, label, '<input class="ums-input" data-kq="' + k + '" autocomplete="off"' + (o.type ? ' type="' + o.type + '"' : '') +
        (o.so ? ' inputmode="decimal"' : '') + (o.ro ? ' readonly' : '') + (o.max ? ' maxlength="' + o.max + '"' : '') + ' placeholder="' + ui.esc(o.ph || '') + '">', o); }
    function sel(k, label, o) { o = o || {}; return fld(k, label, '<select class="ums-select" data-kq="' + k + '" data-ph="' + ui.esc(o.ph || '-- Chọn --') + '"><option value=""></option></select>', o); }
    function ngay(k, label, o) { return fld(k, label, '<div class="ums-inputwrap"><input class="ums-input" data-kq="' + k + '" data-date autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>', o); }
    function sec(key, title, icon, body, an) {
        return '<div class="khtsn-sec" data-sec="' + key + '"' + (an ? ' data-an="1"' : '') + '>' +
            '<div class="ums-legend khtsn-sec__head"><span><i class="fa-light ' + icon + '"></i> ' + ui.esc(title) + '</span>' +
            (an ? '<label class="khtsn-sec__mo"><input type="checkbox" data-secmo="' + key + '"> Nhập mục này</label>' : '') + '</div>' +
            '<div class="ums-grid ums-grid--2 khtsn-sec__body">' + body + '</div></div>';
    }

    T.kqKhai = function (Q) {
        var host = Q.v.khai;
        var S = { sua: false, hosoId: '', pid: '', d: null, intake: '', inv: { dt: [] }, dtc: {}, dtTinh: [], dtTruong: [], dtLoaiHS: [], qd: null, qdDot: '', hsRows: [] };
        var vm = 'buoc';
        try { vm = localStorage.getItem(LS_VIEW) || 'buoc'; } catch (x) { /* chặn lưu trữ */ }

        var panels = {
            canhan: sec('ttcn', 'Thông tin cá nhân', 'fa-circle-user',
                    inp('txtKQ_HoTen', 'Họ và tên', { req: true, ph: 'Ví dụ: Nguyễn Văn A' }) +
                    ngay('txtKQ_NgaySinh', 'Ngày tháng năm sinh', { req: true }) +
                    sel('ddlKQ_GioiTinh', 'Giới tính', { req: true, ph: '-- Chọn giới tính --' }) + sel('ddlKQ_QuocTich', 'Quốc tịch', { ph: '-- Chọn quốc tịch --' }) +
                    sel('ddlKQ_DanToc', 'Dân tộc', { ph: '-- Chọn dân tộc --' }) + sel('ddlKQ_TonGiao', 'Tôn giáo', { ph: '-- Chọn tôn giáo --' }) +
                    inp('txtKQ_DienThoai', 'Điện thoại', { ph: '09xx xxx xxx' }) + inp('txtKQ_Email', 'Email', { ph: 'ten@email.com', type: 'email' })) +
                sec('ns', 'Nơi sinh', 'fa-location-dot',
                    sel('ddlKQ_NS_Tinh', 'Tỉnh / Thành phố', { ph: '-- Chọn tỉnh / thành phố --' }) + sel('ddlKQ_NS_Huyen', 'Quận / Huyện', { ph: 'Vui lòng chọn Tỉnh trước' }) +
                    sel('ddlKQ_NS_Xa', 'Xã / Phường', { ph: 'Vui lòng chọn Quận/Huyện trước' }) + inp('txtKQ_NoiSinh', 'Chi tiết (số nhà / thôn / xóm)', { ph: 'Số nhà, tên đường, thôn/xóm...' })),
            cccd: sec('dd', 'Số CCCD / Định danh', 'fa-address-card',
                    inp('txtKQ_SoCCCD', 'Số Căn cước công dân', { req: true, ph: '12 chữ số', max: 12 }) + ngay('txtKQ_NgayCapCCCD', 'Ngày / tháng / năm cấp') +
                    inp('txtKQ_NoiCapCCCD', 'Nơi cấp', { ph: 'Ví dụ: Cục Cảnh sát QLHC về TTXH', full: true })) +
                sec('hk', 'Hộ khẩu thường trú', 'fa-house-chimney',
                    sel('ddlKQ_HK_Tinh', 'Tỉnh / Thành phố', { ph: '-- Chọn tỉnh / thành phố --' }) + sel('ddlKQ_HK_Huyen', 'Quận / Huyện', { ph: 'Vui lòng chọn Tỉnh trước' }) +
                    sel('ddlKQ_HK_Xa', 'Xã / Phường', { ph: 'Vui lòng chọn Quận/Huyện trước' }) + inp('txtKQ_HK_SoNha', 'Số nhà / thôn / xóm', { ph: 'Số nhà, tên đường, thôn/xóm' })),
            xettuyen: sec('xt_thongtin', 'Thông tin xét tuyển', 'fa-clipboard-list-check',
                    sel('ddlKQ_PhuongThuc', 'Phương thức tuyển sinh', { ph: '-- Chọn phương thức tuyển sinh --' }) + sel('ddlKQ_DoiTuongTS', 'Đối tượng tuyển sinh', { ph: '-- Chọn đối tượng --' }) +
                    sel('ddlKQ_DoiTuongUT', 'Đối tượng ưu tiên', { ph: '-- Chọn đối tượng ưu tiên --' }) + sel('ddlKQ_KhuVucUT', 'Khu vực ưu tiên', { ph: '-- Chọn khu vực ưu tiên --' }), true) +
                sec('xt_truonglop12', 'Trường lớp 12', 'fa-school',
                    inp('txtKQ_MaTinh12', 'Mã tỉnh lớp 12', { ph: 'Mã tỉnh' }) + sel('ddlKQ_Truong12', 'Trường lớp 12', { ph: '-- Chọn trường THPT --' }) +
                    inp('txtKQ_Truong12_Khac', 'Trường THPT khác', { ph: 'Trường không có trong danh sách — gõ tên tại đây' }) +
                    '<input type="hidden" data-kq="txtKQ_TruongMaTen">' +
                    sel('ddlKQ_HocLuc', 'Học lực', { ph: '-- Chọn học lực --' }) + sel('ddlKQ_HanhKiem', 'Hạnh kiểm', { ph: '-- Chọn hạnh kiểm --' })) +
                sec('xt_tohopdiem', 'Tổ hợp môn & điểm xét tuyển', 'fa-calculator',
                    inp('txtKQ_ToHopMa', 'Mã tổ hợp', { ph: 'VD: A00' }) + inp('txtKQ_ToHopTen', 'Tên tổ hợp', { ph: 'VD: Toán, Lý, Hóa' }) +
                    inp('txtKQ_Diem1', 'Điểm môn 1', { so: true, ph: '0.00' }) + inp('txtKQ_Diem2', 'Điểm môn 2', { so: true, ph: '0.00' }) +
                    inp('txtKQ_Diem3', 'Điểm môn 3', { so: true, ph: '0.00' }) + inp('txtKQ_DiemUT', 'Điểm ưu tiên', { so: true, ph: '0.00' }) +
                    inp('txtKQ_TongDiemMon', 'Tổng điểm môn (tự động)', { ro: true }) + inp('txtKQ_TongDiemXT', 'Tổng điểm xét tuyển (môn + UT)', { ro: true }), true),
            trungtuyen: sec('kqtt', 'Kết quả trúng tuyển', 'fa-award',
                    inp('txtKQ_MaHoSo', 'Mã hồ sơ', { ph: 'Mã hồ sơ nội bộ' }) + inp('txtKQ_SBD', 'Số báo danh', { ph: 'SBD' }) +
                    inp('txtKQ_QDMa', 'Số quyết định trúng tuyển', { ph: 'Số QĐ' }) + '<div></div>' +
                    sel('ddlKQ_DotTuyenSinh', 'Đợt tuyển sinh', { req: true, full: true, ph: '-- Chọn đợt tuyển sinh --', hint: 'Chọn đợt tuyển sinh trước — Nguyện vọng đầu ra & Phương thức tuyển sinh sẽ nạp theo đợt này.' }) +
                    sel('ddlKQ_NguyenVongDauRa', 'Nguyện vọng đầu ra', { req: true, full: true, ph: '-- Chọn nguyện vọng đầu ra --', hint: 'Danh sách lấy từ Kế hoạch đầu ra của kế hoạch tuyển sinh (và đợt). Hệ / Khóa / Chương trình / Ngành tự lấy theo đầu ra được chọn.' }) +
                    sel('ddlKQ_LopDuKien', 'Lớp dự kiến đầu ra', { full: true, ph: '-- Chọn nguyện vọng đầu ra trước --', hint: 'Danh sách lớp quản lý nạp theo Nguyện vọng đầu ra đã chọn.' }) +
                    sel('ddlKQ_CoSoDaoTao', 'Cơ sở đào tạo', { full: true, ph: '-- Chọn cơ sở đào tạo --' }) +
                    inp('txtKQ_IntakeCode', 'Mã đợt nhập học (intake)', { ph: 'Intake code' }) + inp('txtKQ_IntakeTypeCode', 'Loại đợt nhập học', { ph: 'Intake type code' })),
            giadinh: '<div class="khtsn-2cot">' +
                sec('bo', 'Thông tin về Bố', 'fa-person', inp('txtKQ_Bo_HoTen', 'Họ và tên', { ph: 'Họ và tên bố' }) + inp('txtKQ_Bo_SDT', 'Số điện thoại liên hệ', { ph: '09xx xxx xxx' })) +
                sec('me', 'Thông tin về Mẹ', 'fa-person-dress', inp('txtKQ_Me_HoTen', 'Họ và tên', { ph: 'Họ và tên mẹ' }) + inp('txtKQ_Me_SDT', 'Số điện thoại liên hệ', { ph: '09xx xxx xxx' })) +
                '</div>',
            hoadon: '<div class="khtsn-canhbao" data-kq="hdcb" hidden><b><i class="fa-light fa-triangle-exclamation"></i> Nhắc kiểm tra lại — vẫn lưu được bình thường</b><ul data-kq="hdcbds"></ul></div>' +
                sec('hd', 'Người mua / xuất hóa đơn', 'fa-file-invoice-dollar',
                    sel('ddlKQ_HD_DoiTuong', 'Đối tượng xuất hóa đơn', { ph: '-- Chọn đối tượng --' }) +
                    inp('txtKQ_HD_NguoiMua', 'Họ tên người mua hàng', { ph: 'Tự điền theo Họ và tên — sửa lại được', hint: 'Lấy theo Họ và tên ở tab Cá nhân. Người mua là người khác (bố/mẹ) thì gõ đè lên.' }) +
                    inp('txtKQ_HD_TenDonVi', 'Tên đơn vị / Công ty (nếu xuất cho tổ chức)', { full: true, ph: 'Tên đơn vị nhận hóa đơn',
                        hint: 'Hóa đơn chỉ lưu được một tên: chọn cá nhân thì lấy theo ô Họ tên người mua hàng, chọn tổ chức thì lấy theo ô này.' }) +
                    inp('txtKQ_HD_MST', 'Mã số thuế (MST)', { ph: '10 hoặc 13 chữ số' }) + inp('txtKQ_HD_MaQHNS', 'Mã quan hệ ngân sách', { ph: 'Mã QHNS (nếu là đơn vị NSNN)' }) +
                    inp('txtKQ_HD_SDT', 'Số điện thoại nhận', { ph: '09xx xxx xxx' }) + '<div></div>' +
                    inp('txtKQ_HD_DiaChi', 'Địa chỉ trên hóa đơn', { full: true, ph: 'Tự điền theo Nơi sinh / Hộ khẩu — sửa lại được' }) +
                    inp('txtKQ_HD_Email', 'Email nhận hóa đơn điện tử', { full: true, ph: 'email nhận HĐĐT', type: 'email' })) +
                sec('hd_thanh_toan', 'Thông tin thanh toán', 'fa-money-check-dollar',
                    sel('ddlKQ_HD_HinhThucTT', 'Loại tài khoản ngân hàng', { ph: '-- Chọn loại tài khoản --' }) + inp('txtKQ_HD_NganHang', 'Ngân hàng', { ph: 'Tên ngân hàng' }) +
                    inp('txtKQ_HD_SoTK', 'Số tài khoản', { ph: 'Số tài khoản ngân hàng' }) + inp('txtKQ_HD_ChuTK', 'Chủ tài khoản', { ph: 'Tên chủ tài khoản' }) +
                    inp('txtKQ_HD_GhiChu', 'Ghi chú', { full: true, ph: 'Ghi chú thêm cho hóa đơn (nếu có)' }), true),
            nguonkt: sec('nkt', 'Thông tin nguồn khai thác', 'fa-share-nodes',
                    sel('ddlKQ_NguonKhaiThac', 'Nguồn khai thác', { full: true, ph: '-- Chọn nguồn khai thác --', hint: 'Đối tác / nguồn giới thiệu thí sinh; được ghi nhận sau khi hồ sơ lưu xong.' }) +
                    inp('txtKQ_NguonKhaiThac_GhiChu', 'Ghi chú nguồn khai thác', { full: true, ph: 'Ghi chú thêm về nguồn khai thác (nếu có)' })),
            hoso: '<div class="khtsn-note ums-u-fz13" data-kq="hsmoi" hidden><i class="fa-light fa-circle-info"></i> <b>Hồ sơ khai mới — khai luôn được.</b> Điền <b>Số lượng đã nộp</b> ' +
                    'cho những giấy tờ thí sinh mang tới rồi bấm <b>“Lưu hồ sơ”</b>: hệ thống lưu hồ sơ và ghim danh mục giấy tờ trong cùng một lần.</div>' +
                '<div class="ums-legend">Danh mục hồ sơ giấy tờ <span class="ums-u-faint ums-u-fz13" data-kq="hstong">(0)</span> <span class="khtsn-badge" data-kq="hsdot" hidden></span></div>' +
                '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2">Bảng lấy theo <b>danh mục hồ sơ đã khai cho đợt tuyển sinh</b> (Các đợt tuyển sinh → cột "Khai danh mục hồ sơ"). ' +
                    'Chỉ cần điền <b>Số lượng đã nộp</b> ở những dòng thí sinh đã nộp — bấm <b>Lưu hồ sơ / Cập nhật hồ sơ</b> là lưu luôn cùng hồ sơ. Dòng để trống sẽ không lưu.</div>' +
                '<div data-kq="hsbang"></div>' +
                '<div class="ums-row ums-u-mt-2">' + ui.btn('reload', { text: 'Nhập lại', mod: 'ghost', icon: 'fa-rotate-left', attr: { 'data-kq': 'hsreset' } }) + '</div>'
        };

        host.innerHTML = ums.pat.panel({
            title: 'Khai trực tiếp hồ sơ', icon: 'fa-pen-to-square', cls: 'khtsn-khai',
            tools: ui.btn('close', { attr: { 'data-kq': 'dong' } }) +
                ui.btn('confirm', { text: 'Đổi nguyện vọng đầu vào', mod: 'out-warn', icon: 'fa-arrows-rotate', attr: { 'data-kq': 'doinv', hidden: 'hidden' } }) +
                ui.btn('save', { text: 'Lưu hồ sơ', attr: { 'data-kq': 'luu' } }),
            body:
                '<div class="khtsn-note ums-u-fz13" data-kq="bansua" hidden><i class="fa-light fa-pen-to-square"></i> <b>Đang sửa hồ sơ.</b> Các ô bạn thay đổi sẽ được lưu qua Sua_HoSo_TS.</div>' +
                '<div class="khtsn-note khtsn-note--bad ums-u-fz13" data-kq="canhbaoluu" hidden><i class="fa-light fa-triangle-exclamation"></i> <b>Hồ sơ vừa tạo chưa lưu đủ thông tin bổ sung</b> ' +
                    '(địa chỉ, hóa đơn, gia đình, ngân hàng, nguồn khai thác). Mở hồ sơ đó trong danh sách rồi bấm "Cập nhật hồ sơ" một lần là xong.</div>' +
                '<div class="ums-row ums-row--between"><div data-kq="tabs"></div><span data-kq="vm">' +
                    ui.chips([{ key: 'buoc', label: 'Theo bước' }, { key: 'gom', label: 'Gộp nhóm' }, { key: 'motrang', label: 'Một trang' }], vm) + '</span></div>' +
                PANEL.map(function (p) { return '<div class="khtsn-pn" data-pn="' + p[0] + '">' + panels[p[0]] + '</div>'; }).join(''),
            foot: '<span class="ums-u-fz13 ums-u-muted"><i class="ums-field__req">*</i> Trường bắt buộc nhập</span>' +
                '<span class="ums-row">' + ui.btn('reload', { text: 'Quay lại', mod: 'ghost', icon: 'fa-angle-left', attr: { 'data-kq': 'truoc' } }) +
                ui.btn('reload', { text: 'Tiếp theo', mod: 'out-primary', icon: 'fa-angle-right', attr: { 'data-kq': 'sau' } }) +
                ui.btn('reload', { text: 'Nhập lại', mod: 'ghost', icon: 'fa-rotate-left', attr: { 'data-kq': 'reset' } }) + '</span>'
        });
        var q = function (k) { return host.querySelector('[data-kq="' + k + '"]'); };
        var g = function (k) { var x = q(k); return x ? String(x.value || '').trim() : ''; };
        var dat = function (k, v) { var x = q(k); if (!x) return; x.value = v === undefined || v === null ? '' : v; if (x.tagName === 'SELECT' && window.jQuery) jQuery(x).trigger('change.select2'); if (x._flatpickr) x._flatpickr.setDate(x.value || null, false, 'd/m/Y'); };
        var datNeuTrong = function (k, v) { if (v !== undefined && v !== null && v !== '' && !g(k)) dat(k, v); };
        ui.enhance(host);

        /* ---------- cách xem + các bước ---------- */
        var nhom, buoc = 0;
        function dungNhom() {
            if (vm === 'gom') nhom = [{ t: 'Hồ sơ cá nhân', i: 'fa-id-badge', p: ['canhan', 'cccd', 'giadinh', 'nguonkt'] }, { t: 'Xét tuyển', i: 'fa-file-pen', p: ['xettuyen'] },
                { t: 'Trúng tuyển', i: 'fa-award', p: ['trungtuyen'] }, { t: 'Xuất hóa đơn', i: 'fa-file-invoice-dollar', p: ['hoadon'] }, { t: 'Danh mục hồ sơ', i: 'fa-folder-open', p: ['hoso'] }];
            else nhom = PANEL.map(function (p) { return { t: p[1], i: p[2], p: [p[0]] }; });
            q('tabs').innerHTML = vm === 'motrang' ? '' : ui.tabs(nhom.map(function (n, i) { return { key: String(i), text: (i + 1) + '. ' + n.t, icon: n.i }; }), '0', 'data-kqtab');
            diToi(0);
        }
        function diToi(i) {
            buoc = Math.max(0, Math.min(i, (nhom || []).length - 1));
            Array.prototype.forEach.call(host.querySelectorAll('[data-pn]'), function (pn) {
                pn.hidden = vm !== 'motrang' && nhom[buoc].p.indexOf(pn.getAttribute('data-pn')) < 0;
            });
            if (vm !== 'motrang') ui.tabsActive(q('tabs'), String(buoc), 'data-kqtab');
            veCanhBaoHD();
        }
        function toiPanel(pn, k) {
            if (vm !== 'motrang') for (var i = 0; i < nhom.length; i++) if (nhom[i].p.indexOf(pn) >= 0) { diToi(i); break; }
            var x = q(k);
            if (x) {
                var s = x.closest('.khtsn-sec[data-an]');
                if (s) datMoMuc(s, true);
                setTimeout(function () { if (x.tagName === 'SELECT' && window.jQuery && x.classList.contains('select2-hidden-accessible')) jQuery(x).select2('open'); else x.focus(); }, 60);
            }
        }
        dungNhom();

        /* ---------- mục "Nhập mục này" ---------- */
        function docMo() { try { return JSON.parse(localStorage.getItem(LS_SEC) || '{}') || {}; } catch (x) { return {}; } }
        function datMoMuc(s, mo) {
            s.querySelector('.khtsn-sec__body').hidden = !mo;
            s.classList.toggle('is-dong', !mo);
            var c = s.querySelector('[data-secmo]'); if (c) c.checked = !!mo;
        }
        var daMo = docMo();
        Array.prototype.forEach.call(host.querySelectorAll('.khtsn-sec[data-an]'), function (s) { datMoMuc(s, !!daMo[s.getAttribute('data-sec')]); });
        function moMucCoDuLieu() {
            Array.prototype.forEach.call(host.querySelectorAll('.khtsn-sec.is-dong'), function (s) {
                var co = Array.prototype.some.call(s.querySelectorAll('input, select'), function (x) {
                    var v = String(x.value || '').trim(); return x.type !== 'checkbox' && v !== '' && v !== '0' && v !== '0.0' && v !== '0.00';
                });
                if (co) datMoMuc(s, true);
            });
        }

        /* ---------- danh mục + ô chọn ---------- */
        var DMS = [['ddlKQ_GioiTinh', T.DM.GIOITINH], ['ddlKQ_DanToc', T.DM.DANTOC], ['ddlKQ_TonGiao', T.DM.TONGIAO], ['ddlKQ_QuocTich', T.DM.QUOCTICH],
            ['ddlKQ_DoiTuongTS', T.DM.DOITUONG_TS], ['ddlKQ_DoiTuongUT', T.DM.DOITUONG_UT], ['ddlKQ_KhuVucUT', T.DM.KHUVUC_UT],
            ['ddlKQ_Truong12', T.DM.TRUONG12], ['ddlKQ_HocLuc', T.DM.HOCLUC], ['ddlKQ_HanhKiem', T.DM.HANHKIEM],
            ['ddlKQ_HD_DoiTuong', T.DM.DOITUONG_HD], ['ddlKQ_HD_HinhThucTT', T.DM.LOAI_TK]];
        var san = Promise.all(DMS.map(function (x) { return T.dmMot(x[1]).then(function (r) { ums.pat.fill(q(x[0]), r); return r; }); })
            .concat([
                T.dsCoSoDaoTao().then(function (r) { ums.pat.fill(q('ddlKQ_CoSoDaoTao'), r, { name: T.nhanCSDT }); }),
                P.dmDoiTac().then(function (r) { ums.pat.fill(q('ddlKQ_NguonKhaiThac'), r, { name: P.nhanDoiTac }); }),
                ums.pat.dmTinhThanh().then(function (r) { S.dtTinh = r || []; var tinh = S.dtTinh.filter(function (x) { return !x.QUANHECHA_ID; });
                    ums.pat.fill(q('ddlKQ_NS_Tinh'), tinh); ums.pat.fill(q('ddlKQ_HK_Tinh'), tinh); }, function () { S.dtTinh = []; }),
                T.dmMot(T.DM.LOAIHOSO).then(function (r) { S.dtLoaiHS = r; }),
                P.dmAddr(), P.dmIden(), P.dmFam()
            ])).then(function (x) { S.dtTruong = x[7] || []; S.inv.dt = x[10] || []; });

        /* Tỉnh → Quận/Huyện → Xã (genDropTinhThanh + _apply2Cap) */
        function conCua(id) { return S.dtTinh.filter(function (x) { return x.QUANHECHA_ID === id; }); }
        function dayDC(pre, tinhId, huyenId, xaId) {
            var t = q('ddlKQ_' + pre + '_Tinh'), h = q('ddlKQ_' + pre + '_Huyen'), x = q('ddlKQ_' + pre + '_Xa');
            if (tinhId !== undefined) { t.value = tinhId || ''; jQuery(t).trigger('change.select2'); }
            var con = t.value ? conCua(t.value) : [];
            var hai = con.length && !con.some(function (c) { return conCua(c.ID).length; });
            h.setAttribute('data-2cap', hai ? '1' : '');
            ums.pat.fill(h, con); h.disabled = !t.value;
            if (huyenId !== undefined) { h.value = huyenId && con.some(function (c) { return c.ID === huyenId; }) ? huyenId : ''; jQuery(h).trigger('change.select2'); }
            var dsXa = hai ? con : (h.value ? conCua(h.value) : []);
            ums.pat.fill(x, dsXa); x.disabled = !(hai || h.value);
            if (xaId !== undefined) { x.value = xaId && dsXa.some(function (c) { return c.ID === xaId; }) ? xaId : ''; jQuery(x).trigger('change.select2'); }
        }
        ['NS', 'HK'].forEach(function (pre) {
            var t = q('ddlKQ_' + pre + '_Tinh'), h = q('ddlKQ_' + pre + '_Huyen'), x = q('ddlKQ_' + pre + '_Xa');
            dayDC(pre);
            jQuery(t).on('select2:select select2:clear', function () { t.setAttribute('data-cham', '1'); dayDC(pre, undefined, '', ''); dienDiaChiHD(pre); });
            jQuery(h).on('select2:select select2:clear', function () {
                h.setAttribute('data-cham', '1');
                if (h.getAttribute('data-2cap') !== '1') dayDC(pre, undefined, undefined, '');
                dienDiaChiHD(pre);
            });
            jQuery(x).on('select2:select select2:clear', function () { x.setAttribute('data-cham', '1'); dienDiaChiHD(pre); });
            jQuery([t, h, x]).on('select2:opening', function (ev) { if (this.disabled) ev.preventDefault(); });
        });

        /* Đợt → Nguyện vọng → Lớp dự kiến; đợt đổi → phương thức + danh mục hồ sơ nạp lại */
        function napDot(giu) {
            return T.dsDot(Q.khId).then(function (rows) {
                var v = giu !== undefined ? giu : (T.S.dotKQ || (rows.length === 1 ? T.id(rows[0]) : ''));
                T.fill(q('ddlKQ_DotTuyenSinh'), rows, { name: T.nhanDot, giu: v });
                if (g('ddlKQ_DotTuyenSinh')) T.S.dotKQ = g('ddlKQ_DotTuyenSinh');
                Q.veBadge();
                return rows;
            });
        }
        function napNV(giu) {
            var sel2 = q('ddlKQ_NguyenVongDauRa');
            if (!Q.khId || !g('ddlKQ_DotTuyenSinh') && !T.S.dotKQ) { ums.pat.fill(sel2, []); sel2.disabled = !g('ddlKQ_DotTuyenSinh'); return Promise.resolve([]); }
            return ums.api.call({ action: T.TS + 'ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP', func: T.PTS + 'Pr_Ts_Kh_Dau_Ra_Get_Ds', silent: true,
                strTuKhoa: '', strTs_Kh_TuyenSinh_Id: Q.khId, strTs_Kh_TuyenSinh_Dot_Id: g('ddlKQ_DotTuyenSinh') || T.S.dotKQ || '',
                strTs_Kh_Dot_PhuongThuc_Id: '', strOutput_Status_Code: '', dIs_Public: '', dIs_Active: 1 }).then(function (r) {
                var rows = T.rows(r);
                T.fill(sel2, rows, { giu: giu, name: function (d, i) {
                    var ten = T.pick(d, ['TEN_HIENTHI', 'TenHienThi', 'TEN', 'Ten']), ma = T.pick(d, ['MA_HIENTHI', 'MA_CT', 'MaCT', 'MA', 'Ma']);
                    if (ten) return ten + (ma && ma !== ten ? ' (' + ma + ')' : '');
                    var extra = [d.DAOTAO_HEDAOTAO_TEN, d.DAOTAO_KHOADAOTAO_TEN].filter(function (x) { return x; });
                    return (T.pick(d, ['DAOTAO_NGANH_TS_TEN', 'DAOTAO_NGANH_DT_TEN', 'DAOTAO_TOCHUCCHUONGTRINH_TEN']) || '[Đầu ra]') + (extra.length ? ' — ' + extra.join(' · ') : '');
                } });
                sel2.disabled = false;
                return rows;
            }, function () { return []; });
        }
        function napPT(giu) {
            if (!Q.khId) return Promise.resolve();
            return ums.api.call({ action: 'TS_CORE_KEHOACH_MH/DSA4BRIeESk0Li8mFSk0IhU0OCQvEigvKQPP', func: T.PTS + 'LayDS_PhuongThucTuyenSinh', silent: true,
                strKeHoach_Id: Q.khId, strDot_Id: g('ddlKQ_DotTuyenSinh') || T.S.dotKQ || '', strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '',
                strChucNangHeThong_Id: '', strHanhDong_Code: 'XEM' }).then(function (r) {
                T.fill(q('ddlKQ_PhuongThuc'), T.rows(r), { giu: giu, name: function (d) {
                    var ten = T.pick(d, ['TEN', 'Ten', 'PHUONGTHUC_TEN', 'PHUONG_THUC_TEN']), ma = T.pick(d, ['MA', 'Ma', 'PHUONGTHUC_MA', 'PHUONG_THUC_MA']);
                    return (ten || ma || '[Phương thức]') + (ten && ma && ma !== ten ? ' (' + ma + ')' : '');
                } });
            }, function () {});
        }
        function napLop(giu) {
            var s3 = q('ddlKQ_LopDuKien'), nv = g('ddlKQ_NguyenVongDauRa');
            if (!nv) { ums.pat.fill(s3, []); s3.disabled = true; return Promise.resolve(); }
            return ums.api.call({ action: 'TS_CORE_KEHOACH_MH/DSA4BRIeDS4xEDQgLw04HhUpJC4FIDQTIAPP', func: T.PTS + 'LayDS_LopQuanLy_TheoDauRa', silent: true,
                strTuKhoa: '', strDauRa_Id: nv, strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'XEM' }).then(function (r) {
                T.fill(s3, T.rows(r), { giu: giu, name: function (d) {
                    var ten = T.pick(d, ['TEN', 'Ten', 'LOPQUANLY_TEN', 'LOP_QUANLY_TEN', 'TEN_LOP']), ma = T.pick(d, ['MA', 'Ma', 'LOPQUANLY_MA', 'LOP_QUANLY_MA', 'MA_LOP']);
                    return (ten || ma || '[Lớp]') + (ten && ma && ma !== ten ? ' (' + ma + ')' : '');
                } });
                s3.disabled = false;
            }, function () {});
        }
        jQuery(q('ddlKQ_DotTuyenSinh')).on('select2:select select2:clear', function () {
            T.S.dotKQ = g('ddlKQ_DotTuyenSinh');
            napNV(); napPT(); napLop();
            S.qd = null; napHoSoDM(S.hosoId);
            Q.veBadge();
        });
        jQuery(q('ddlKQ_NguyenVongDauRa')).on('select2:select select2:clear', function () { napLop(); });
        ums.pat.chain([q('ddlKQ_DotTuyenSinh'), q('ddlKQ_NguyenVongDauRa'), q('ddlKQ_LopDuKien')], { phatLai: false });

        /* Trường lớp 12: ô chọn + ô gõ tay cùng ghi vào một giá trị (txtKQ_TruongMaTen) */
        function truongTuId(id) {
            var r = S.dtTruong.filter(function (x) { return x.ID === id; })[0];
            if (!r) return '';
            var ma = String(r.MA || '').trim(), ten = String(r.TEN || '').trim();
            return ma && ten ? ma + ' | ' + ten : (ten || ma);
        }
        jQuery(q('ddlKQ_Truong12')).on('select2:select select2:clear', function () {
            var v = g('ddlKQ_Truong12');
            dat('txtKQ_TruongMaTen', v ? truongTuId(v) : g('txtKQ_Truong12_Khac'));
            if (v) dat('txtKQ_Truong12_Khac', '');
        });
        function datTruong(text) {
            if (!text) return;
            var c = function (s) { return String(s || '').trim().toLowerCase(); }, t = c(text);
            var hit = S.dtTruong.filter(function (x) { return c(truongTuId(x.ID)) === t || c(x.TEN) === t || c(x.MA) === t; })[0];
            if (hit) { dat('ddlKQ_Truong12', hit.ID); dat('txtKQ_Truong12_Khac', ''); } else { dat('ddlKQ_Truong12', ''); dat('txtKQ_Truong12_Khac', text); }
            dat('txtKQ_TruongMaTen', text);
        }

        /* Hoá đơn: tự điền tên người mua / địa chỉ; nhắc khai thiếu (chỉ nhắc, không chặn) */
        function dienTenHD() { var x = q('txtKQ_HD_NguoiMua'); if (!x.getAttribute('data-cham')) x.value = g('txtKQ_HoTen'); }
        function dienDiaChiHD(pre) {
            var x = q('txtKQ_HD_DiaChi');
            if (x.getAttribute('data-cham')) return;
            var b = thuDiaChi().filter(function (y) { return y.kind === pre; })[0];
            if (b && b.full) x.value = b.full;
            veCanhBaoHD();
        }
        function loaiHD() { return P.loaiHD(ungVienHD().join(' ') + ' ' + tenChon('ddlKQ_HD_DoiTuong'), S.inv.dt); }
        function tenChon(k) { var x = q(k); return x && x.value ? (x.options[x.selectedIndex] || {}).text || '' : ''; }
        function ungVienHD() {
            var v = g('ddlKQ_HD_DoiTuong');
            if (!v) return [];
            var r = S.inv.dt.filter(function (x) { return String(T.id(x)).trim() === v || String(x.MA || '').trim() === v; })[0];
            var ma = r ? (String(r.MA || '').trim() || String(r.TEN || '').trim()) : tenChon('ddlKQ_HD_DoiTuong');
            return [v, ma].filter(function (x, i, a) { return x && a.indexOf(x) === i; });
        }
        function kiemTraHD() {
            var dt = g('ddlKQ_HD_DoiTuong'), nm = g('txtKQ_HD_NguoiMua'), dv = g('txtKQ_HD_TenDonVi'), mst = g('txtKQ_HD_MST'), dc = g('txtKQ_HD_DiaChi'),
                em = g('txtKQ_HD_Email'), sdt = g('txtKQ_HD_SDT'), qh = g('txtKQ_HD_MaQHNS'), ds = [];
            if (!(dt || nm || dv || mst || dc || em || sdt || qh)) return ['Chưa khai thông tin xuất hóa đơn — bỏ qua nếu hồ sơ này không cần xuất hóa đơn.'];
            var tam = function (v) { return v && (v.length < 2 || !/[0-9A-Za-zÀ-ỹ]/.test(v)); };
            if (tam(nm)) ds.push('Ô "Họ tên người mua hàng" đang là "' + nm + '" — trông như gõ tạm cho qua, nên sửa lại thành tên thật.');
            if (tam(dv)) ds.push('Ô "Tên đơn vị / Công ty" đang là "' + dv + '" — trông như gõ tạm cho qua, nên xóa đi hoặc điền tên đơn vị thật.');
            var l = loaiHD();
            if (!dt) ds.push('Đã khai thông tin hóa đơn nhưng chưa chọn "Đối tượng xuất hóa đơn".');
            else if (l === 'CN') {
                if (!nm && !dv) ds.push('Xuất hóa đơn cho cá nhân nhưng chưa điền "Họ tên người mua hàng".');
                else if (nm && dv && !tam(dv) && nm.toLowerCase() !== dv.toLowerCase()) ds.push('Hai ô "Họ tên người mua hàng" và "Tên đơn vị / Công ty" đang ghi hai tên khác nhau; hóa đơn chỉ lưu được một tên và sẽ lấy theo "Họ tên người mua hàng".');
            } else if (l === 'TC') {
                if (!dv) ds.push('Xuất hóa đơn cho tổ chức nhưng chưa điền "Tên đơn vị / Công ty".');
                if (!mst && !qh) ds.push('Xuất hóa đơn cho tổ chức nhưng chưa có "Mã số thuế" lẫn "Mã quan hệ ngân sách".');
            }
            var m = mst.replace(/[\s-]/g, '');
            if (mst && !/^\d{10}$|^\d{13}$/.test(m)) ds.push('"Mã số thuế" phải là 10 hoặc 13 chữ số (đang có ' + m.length + ' ký tự).');
            if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) ds.push('"Email nhận hóa đơn điện tử" chưa đúng định dạng.');
            if (sdt && !/^0\d{8,10}$/.test(sdt.replace(/[\s.\-()]/g, ''))) ds.push('"Số điện thoại nhận" chưa đúng định dạng (bắt đầu bằng 0, 9–11 chữ số).');
            if (!dc) ds.push('Chưa có "Địa chỉ trên hóa đơn".');
            return ds;
        }
        function veCanhBaoHD() {
            var ds = kiemTraHD();
            q('hdcb').hidden = !ds.length;
            q('hdcbds').innerHTML = ds.map(function (m) { return '<li>' + ui.esc(m) + '</li>'; }).join('');
        }

        /* ---------- sự kiện chung ---------- */
        host.addEventListener('input', function (ev) {
            var k = ev.target.getAttribute && ev.target.getAttribute('data-kq');
            if (!k) return;
            if (/^txtKQ_Diem/.test(k)) tinhTong();
            if (k === 'txtKQ_HoTen') dienTenHD();
            if (k === 'txtKQ_HD_NguoiMua' || k === 'txtKQ_HD_DiaChi' || k === 'txtKQ_NoiSinh' || k === 'txtKQ_HK_SoNha') ev.target.setAttribute('data-cham', '1');
            if (k === 'txtKQ_NoiSinh') dienDiaChiHD('NS');
            if (k === 'txtKQ_HK_SoNha') dienDiaChiHD('HK');
            if (k === 'txtKQ_Truong12_Khac') {
                var tay = g('txtKQ_Truong12_Khac');
                if (tay) { dat('txtKQ_TruongMaTen', tay); if (g('ddlKQ_Truong12')) dat('ddlKQ_Truong12', ''); }
                else dat('txtKQ_TruongMaTen', g('ddlKQ_Truong12') ? truongTuId(g('ddlKQ_Truong12')) : '');
            }
            if (/^txtKQ_HD_/.test(k)) veCanhBaoHD();
            if (ev.target.getAttribute('data-hs')) hsTinhTrang();
        });
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.getAttribute && t.getAttribute('data-secmo')) {
                var s = t.closest('.khtsn-sec'); datMoMuc(s, t.checked);
                var m = docMo(); m[s.getAttribute('data-sec')] = t.checked;
                try { localStorage.setItem(LS_SEC, JSON.stringify(m)); } catch (x) { /* chặn lưu trữ */ }
            }
            if (t.getAttribute && t.getAttribute('data-kq') === 'ddlKQ_HD_DoiTuong') veCanhBaoHD();
        });
        host.addEventListener('click', function (ev) {
            var tab = ev.target.closest('[data-kqtab]');
            if (tab) { diToi(Number(tab.getAttribute('data-kqtab'))); return; }
            var chip = ev.target.closest('[data-chip]');
            if (chip && q('vm').contains(chip)) {
                vm = chip.getAttribute('data-chip');
                try { localStorage.setItem(LS_VIEW, vm); } catch (x) { /* chặn lưu trữ */ }
                q('vm').innerHTML = ui.chips([{ key: 'buoc', label: 'Theo bước' }, { key: 'gom', label: 'Gộp nhóm' }, { key: 'motrang', label: 'Một trang' }], vm);
                dungNhom(); return;
            }
            var b = ev.target.closest('button[data-kq]');
            if (!b) return;
            var k = b.getAttribute('data-kq');
            if (k === 'dong') T.kqDong(false);
            else if (k === 'truoc') diToi(buoc - 1);
            else if (k === 'sau') diToi(buoc + 1);
            else if (k === 'reset') { if (S.sua) moSua(S.d); else moiMoi(); }
            else if (k === 'luu') luu();
            else if (k === 'doinv') doiNV();
            else if (k === 'hsreset') veHoSoDM();
            else if (k === 'hsxoa') xoaHoSoDM(b.getAttribute('data-id'));
            else if (k === 'hsdot') toiPanel('trungtuyen', 'ddlKQ_DotTuyenSinh');
        });
        function tinhTong() {
            var n = function (k) { var v = parseFloat(g(k)); return isNaN(v) ? 0 : v; };
            var mon = n('txtKQ_Diem1') + n('txtKQ_Diem2') + n('txtKQ_Diem3'), xt = mon + n('txtKQ_DiemUT');
            dat('txtKQ_TongDiemMon', mon ? mon.toFixed(2) : ''); dat('txtKQ_TongDiemXT', xt ? xt.toFixed(2) : '');
        }

        /* ---------- Danh mục hồ sơ (tab 8) ---------- */
        function dotHienTai() {
            var v = g('ddlKQ_DotTuyenSinh') || T.S.dotKQ;
            if (v) return v;
            var nv = g('ddlKQ_NguyenVongDauRa') || (S.d ? T.pick(S.d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id']) : '');
            var dr = nv ? (Q.dr || {})[nv] : null;
            return dr && dr.dotId ? dr.dotId : '';
        }
        function nvHienTai() { return g('ddlKQ_NguyenVongDauRa') || (S.d ? T.pick(S.d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id']) : ''); }
        function layQuyDinh() {
            var dot = dotHienTai();
            if (S.qd && S.qdDot === dot) return Promise.resolve(S.qd);
            if (!dot) { S.qd = []; S.qdDot = dot; return Promise.resolve([]); }
            return Promise.all([T.dmMot(T.DM.TINHCHATHOSO), ums.api.call({ action: T.A_QDHS.LayDS, func: 'pkg_tuyensinh_kehoach.LayDSTS_QuyDinhHoSo', silent: true,
                strTuKhoa: '', strTS_KeHoachTuyenSinh_Id: dot, strLoaiHoSo_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 500 }).then(T.rows, function () { return []; })])
                .then(function (x) { S.dtTC = x[0]; S.qd = x[1]; S.qdDot = dot; return S.qd; });
        }
        function napHoSoDM(hosoId) {
            q('hsmoi').hidden = !!hosoId;
            return layQuyDinh().then(function () {
                if (!hosoId) { S.hsRows = []; veHoSoDM(); return; }
                var goiDS = function (theoHS) {
                    return ums.api.call({ action: A_HS.LayDS.action, func: A_HS.LayDS.func, strChucNang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 500,
                        strTS_HoSoDuTuyen_Id: theoHS ? hosoId : '', strLoaiHoSo_Id: '', strTS_KeHoachTuyenSinh_Id: dotHienTai(), strNguoiTao_Id: '', strTuKhoa: '', silent: true }).then(T.rows);
                };
                // [1] lọc theo hồ sơ; proc hỏng (ORA-24338 từng gặp) thì [2] lùi về lọc theo đợt — như gốc
                return goiDS(true).catch(function () { return goiDS(false).catch(function () { return []; }); }).then(function (rows) { S.hsRows = rows; veHoSoDM(); });
            });
        }
        function veHoSoDM() {
            var qd = S.qd || [], dot = dotHienTai();
            var b = q('hsdot');
            var d = (T.S.dtDot || []).filter(function (x) { return String(T.id(x)) === String(dot); })[0];
            b.textContent = d ? 'Theo đợt: ' + T.tenMa(d.TEN || d.Ten || '', d.MA || d.Ma || '') : ''; b.hidden = !d;
            var theoLoai = {};
            (S.hsRows || []).forEach(function (r) { var k = String(T.pick(r, ['LOAIHOSO_ID', 'LoaiHoSo_Id']) || ''); if (k) theoLoai[k] = r; });
            var dong = qd.map(function (x) {
                var loai = String(T.pickLoose(x, ['LOAIHOSO_ID', 'LOAI_HOSO_ID']) || ''), r = theoLoai[loai] || null;
                var num = function (v) { var n = parseInt(v, 10); return isNaN(n) ? 0 : n; };
                return { loai: loai, id: r ? String(T.pick(r, ['ID', 'Id', 'TS_HOSO_ID']) || '') : '',
                    can: num(T.pickLoose(x, ['SOLUONG', 'SO_LUONG'])) || 1, da: r ? num(T.pick(r, ['SOLUONG', 'SoLuong', 'SL_DANOP'])) : '',
                    mota: r ? T.pick(r, ['MOTA', 'MoTa', 'GHICHU']) : '',
                    ten: T.pickLoose(x, ['LOAIHOSO_TEN', 'LOAI_HOSO_TEN']) || T.tenTheoId(S.dtLoaiHS, loai),
                    tc: T.pickLoose(x, ['TINHCHATHOSO_TEN', 'TINHCHAT_HOSO_TEN']) || T.tenTheoId(S.dtTC, T.pickLoose(x, ['TINHCHATHOSO_ID', 'TINHCHAT_HOSO_ID'])) };
            }).filter(function (x) { return x.loai; });
            q('hstong').textContent = '(' + (S.hsRows || []).length + '/' + dong.length + ')';
            ui.table({
                el: q('hsbang'), rows: dong,
                empty: dot ? 'Đợt tuyển sinh này chưa khai danh mục hồ sơ cần nộp. Vào Các đợt tuyển sinh → cột "Khai danh mục hồ sơ" để khai trước.'
                    : 'Chưa chọn đợt tuyển sinh nên chưa biết lấy danh mục của hệ nào — chọn Đợt ở bước Trúng tuyển.',
                rowCls: function (x) { return x.id ? 'khtsn-hs--dalu' : ''; },
                columns: [
                    { title: 'Loại hồ sơ', render: function (x) { return ui.esc(x.ten || '-'); } },
                    { title: 'Tính chất', cls: 'is-center', prop: 'tc' },
                    { title: 'Cần nộp', cls: 'is-right', width: '90px', prop: 'can', sum: function (rs) { return '<b data-kq="hscan">' + rs.reduce(function (a, x) { return a + x.can; }, 0) + '</b>'; } },
                    { title: 'Đã nộp', cls: 'is-center', width: '110px', sum: function () { return '<b data-kq="hsda">0</b>'; }, render: function (x) {
                        return '<input class="ums-input khtsn-so" type="number" min="0" step="1" data-hs="sl" data-loai="' + ui.esc(x.loai) + '" data-id="' + ui.esc(x.id) +
                            '" data-can="' + x.can + '" data-goc-sl="' + ui.esc(x.da) + '" data-goc-mota="' + ui.esc(x.mota) + '" value="' + ui.esc(x.da) + '" placeholder="—">'; } },
                    { title: 'Tình trạng', cls: 'is-center', width: '100px', render: function (x) { return '<span data-hstt="' + ui.esc(x.loai) + '"></span>'; } },
                    { title: 'Mô tả', render: function (x) { return '<input class="ums-input" data-hs="mota" data-loai="' + ui.esc(x.loai) + '" value="' + ui.esc(x.mota) + '" placeholder="Ghi chú (nếu có)">'; } },
                    { title: 'Xóa', cls: 'is-actions', width: '60px', render: function (x) {
                        return x.id ? '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-kq="hsxoa" data-id="' + ui.esc(x.id) + '" title="Xóa dòng đã lưu"><i class="fa-light fa-trash-can"></i></button>' : ''; } }
                ]
            });
            hsTinhTrang();
        }
        function hsTinhTrang() {
            var tong = 0;
            Array.prototype.forEach.call(host.querySelectorAll('input[data-hs="sl"]'), function (x) {
                var tt = host.querySelector('[data-hstt="' + x.getAttribute('data-loai') + '"]'), v = String(x.value || '').trim();
                if (v === '') { tt.innerHTML = '—'; return; }
                var da = parseInt(v, 10) || 0, can = parseInt(x.getAttribute('data-can'), 10) || 0;
                tong += da;
                tt.innerHTML = can > 0 && da >= can ? ui.badge('Đủ', 'ok') : ui.badge('Thiếu', 'bad');
            });
            var t = q('hsda'); if (t) t.textContent = tong;
        }
        function thuLuoi() {
            var viec = [];
            Array.prototype.forEach.call(host.querySelectorAll('input[data-hs="sl"]'), function (x) {
                var loai = x.getAttribute('data-loai'), id = x.getAttribute('data-id') || '';
                var mo = host.querySelector('input[data-hs="mota"][data-loai="' + loai + '"]');
                var sl = String(x.value || '').trim(), mota = String(mo ? mo.value : '').trim();
                if (!id) { if (sl === '' && mota === '') return; }
                else if (sl === String(x.getAttribute('data-goc-sl')) && mota === String(x.getAttribute('data-goc-mota'))) return;
                var n = parseInt(sl, 10);
                viec.push({ id: id, loai: loai, can: parseInt(x.getAttribute('data-can'), 10) || 0, sl: isNaN(n) ? 0 : n, mota: mota });
            });
            return viec;
        }
        function luuLuoi(hosoId, dotId, viec) {
            if (!hosoId || !viec.length) return Promise.resolve({ ok: 0, fail: 0, total: viec.length, thieuId: !hosoId });
            return ui.batch(viec.map(function (v) {
                var a = v.id ? A_HS.Sua : A_HS.Them;
                var o = { action: a.action, func: a.func, strChucNang_Id: '', strNguoiThucHien_Id: '', strTS_HoSoDuTuyen_Id: hosoId,
                    strTS_KeHoachTuyenSinh_Id: dotId || '', strLoaiHoSo_Id: v.loai, dSoLuongCanNop: v.can, dSoLuong: v.sl, strMoTa: v.mota, silent: true };
                if (v.id) o.strId = v.id;
                return o;
            }), { concurrency: 5 }).then(function (r) { return { ok: r.ok, fail: r.fail, total: viec.length }; });
        }
        function xoaHoSoDM(id) {
            ui.confirm('Bạn có chắc chắn xóa dòng danh mục hồ sơ này không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: A_HS.Xoa.action, func: A_HS.Xoa.func, strChucNang_Id: '', strNguoiThucHien_Id: '', strIds: id }).then(function () {
                    ui.toast('Xóa danh mục hồ sơ thành công!', 'ok'); napHoSoDM(S.hosoId);
                });
            }).catch(function (err) { ums.api.handle(err, A_HS.Xoa.func); });
        }

        /* ---------- đặt lại / mở ---------- */
        function xoaTrang() {
            S.sua = false; S.hosoId = ''; S.pid = ''; S.d = null; S.intake = ''; S.dtc = {};
            Array.prototype.forEach.call(host.querySelectorAll('input[data-kq], select[data-kq]'), function (x) {
                if (x.type === 'checkbox') return;
                x.removeAttribute('data-cham');
                if (x.tagName === 'SELECT') { if (/_(Huyen|Xa)$/.test(x.getAttribute('data-kq'))) return; x.value = ''; jQuery(x).trigger('change.select2'); }
                else { x.value = ''; if (x._flatpickr) x._flatpickr.clear(); }
            });
            dayDC('NS', '', '', ''); dayDC('HK', '', '', '');
            ums.pat.fill(q('ddlKQ_LopDuKien'), []); q('ddlKQ_LopDuKien').disabled = true;
            q('bansua').hidden = true; q('canhbaoluu').hidden = true; q('doinv').hidden = true;
            q('luu').querySelector('span').textContent = 'Lưu hồ sơ';
            host.querySelector('.ums-panel__title').lastChild.textContent = ' Khai trực tiếp hồ sơ';
            diToi(0);
        }
        function moiMoi() {
            xoaTrang();
            san.then(function () {
                return napDot().then(function () { return Promise.all([napNV(), napPT()]); });
            }).then(function () { S.qd = null; return napHoSoDM(''); }).then(veCanhBaoHD);
        }
        function moSua(d) {
            xoaTrang();
            S.sua = true; S.d = d; S.hosoId = T.hid(d); S.pid = T.pid(d);
            S.intake = T.pick(d, ['CORE_PERSON_INTAKE_ID', 'COREPERSON_INTAKE_ID', 'CorePerson_Intake_Id', 'INTAKE_ID']);
            q('bansua').hidden = false; q('doinv').hidden = false;
            q('luu').querySelector('span').textContent = 'Cập nhật hồ sơ';
            host.querySelector('.ums-panel__title').lastChild.textContent = ' Sửa hồ sơ — ' + (T.pick(d, ['COREPERSON_HOTEN']) || '');
            var dot = T.pick(d, ['HOSO_KH_TS_DOT_ID', 'HoSo_KH_TS_Dot_Id', 'KH_TS_DOT_ID', 'TS_KH_TUYENSINH_DOT_ID', 'DOT_ID']) || T.pickFuzzy(d, /DOT.*_ID$/i);
            /* Danh sách không có cột đợt → suy từ nguyện vọng đầu ra. Gốc 2/10: CHỜ nạp xong bản đồ nguyện vọng (_ensureKQDK_DauRaMap)
               rồi mới suy — mở hồ sơ sớm (trước khi danh sách nạp xong bản đồ) từng ra đợt rỗng → Nguyện vọng / Phương thức trống. */
            var coDot = (dot || (Q.dr && Object.keys(Q.dr).length)) ? Promise.resolve() :
                T.dauRaMap(Q.khId).then(function (m) { if (m && Object.keys(m).length) Q.dr = m; }).catch(function () {});
            var suyDot = function () {
                if (!dot) { var dr = (Q.dr || {})[T.pick(d, ['NGUYENVONG_DAURA_ID', 'NguyenVong_DauRa_Id'])]; if (dr && dr.dotId) dot = dr.dotId; }
                if (dot) T.S.dotKQ = dot;
            };
            suyDot();
            dat('txtKQ_HoTen', T.pick(d, ['COREPERSON_HOTEN'])); dienTenHD();
            dat('txtKQ_NgaySinh', T.ngayUI(T.pick(d, ['COREPERSON_NGAYSINH', 'CorePerson_NgaySinh'])));
            dat('txtKQ_DienThoai', T.pick(d, ['PERSONCONTACT_DIENTHOAI'])); dat('txtKQ_Email', T.pick(d, ['PERSONCONTACT_EMAIL']));
            dat('txtKQ_SoCCCD', T.pick(d, ['PERSONIDEN_SOCCCD'])); dat('txtKQ_MaHoSo', T.pick(d, ['HOSO_MAHOSO'])); dat('txtKQ_SBD', T.pick(d, ['HOSO_SOBAODANH']));
            dat('txtKQ_ToHopMa', T.pick(d, ['XETTUYEN_TOHOPMON_CODE'])); dat('txtKQ_TongDiemXT', T.pick(d, ['XETTUYEN_DIEMTONGXT']));
            var pid = S.pid;
            Promise.all([san, coDot]).then(function () {
                suyDot();
                T.datChon(q('ddlKQ_GioiTinh'), T.pick(d, ['COREPERSON_GIOITINH_ID', 'GIOITINH_ID']), T.pick(d, ['COREPERSON_GIOITINH_TEN', 'GIOITINH_TEN', 'CorePerson_GioiTinh_Ten']));
                T.datChon(q('ddlKQ_CoSoDaoTao'), T.pick(d, ['DAOTAO_COSODAOTAO_ID', 'COSODAOTAO_ID', 'HOSO_DAOTAO_COSODAOTAO_ID']), T.pick(d, ['DAOTAO_COSODAOTAO_TEN', 'COSODAOTAO_TEN']));
                var pf = T.kqCache.profile[pid];
                if (pf) { T.datChon(q('ddlKQ_DanToc'), pf.ETHNICITY_ID); T.datChon(q('ddlKQ_TonGiao'), pf.RELIGION_ID); }
                var nv = T.pick(d, ['NGUYENVONG_DAURA_ID']);
                var viec = [
                    napDot(dot || undefined).then(function () { return Promise.all([napNV(nv), napPT()]); }).then(function () { return napLop(); }),
                    P.layProfile(pid).then(function (p) { if (!p) return; T.datChon(q('ddlKQ_QuocTich'), T.pickLoose(p, ['NATIONALITY_ID', 'QUOCTICH_ID']));
                        if (p.ETHNICITY_ID) T.datChon(q('ddlKQ_DanToc'), p.ETHNICITY_ID); if (p.RELIGION_ID) T.datChon(q('ddlKQ_TonGiao'), p.RELIGION_ID); }),
                    P.lienHe(pid).then(function (lh) { if (lh.email) dat('txtKQ_Email', lh.email); if (lh.sdt) dat('txtKQ_DienThoai', lh.sdt); }),
                    Promise.all([P.dmAddr(), P.dsDiaChi(pid)]).then(function (x) {
                        var rows = x[1]; if (!rows.length) return;
                        var ns = P.timDiaChi(rows, 'NS', x[0]), hk = P.timDiaChi(rows, 'HK', x[0]);
                        if (!ns && !hk && rows.length === 1) hk = rows[0];
                        [['NS', ns, 'txtKQ_NoiSinh'], ['HK', hk, 'txtKQ_HK_SoNha']].forEach(function (a) {
                            var r = a[1]; if (!r) return;
                            if (r.ADDRESS_LINE1) dat(a[2], r.ADDRESS_LINE1);
                            var xa = r.WARD_ID, huyen = T.pickLoose(r, ['DISTRICT_ID', 'QUANHUYEN_ID', 'HUYEN_ID']) || (xa ? ((S.dtTinh.filter(function (t) { return t.ID === xa; })[0] || {}).QUANHECHA_ID || '') : '');
                            var tinh = r.PROVINCE_ID || (huyen ? ((S.dtTinh.filter(function (t) { return t.ID === huyen; })[0] || {}).QUANHECHA_ID || '') : '');
                            dayDC(a[0], tinh, huyen === tinh ? xa : huyen, xa);
                        });
                    }),
                    P.dsDinhDanh(pid).then(function (rows) { var c = P.timCCCD(rows); if (!c) return;
                        if (c.IDENTIFIER_NO) dat('txtKQ_SoCCCD', c.IDENTIFIER_NO); if (c.ISSUE_DATE) dat('txtKQ_NgayCapCCCD', T.ngayUI(c.ISSUE_DATE)); if (c.ISSUE_PLACE) dat('txtKQ_NoiCapCCCD', c.ISSUE_PLACE); }),
                    P.layTTHoSo(S.hosoId).then(ganChiTiet),
                    P.dsBank(pid).then(function (rows) { var b = P.bankChinh(rows); if (b) ganBank(b); }),
                    Promise.all([P.dmFam(), P.dsGiaDinh(pid)]).then(function (x) {
                        [['BO', 'Bo'], ['ME', 'Me']].forEach(function (a) {
                            var r = P.timGiaDinh(x[1], a[0], x[0]); if (!r) return;
                            datNeuTrong('txtKQ_' + a[1] + '_HoTen', T.pickLoose(r, ['FULL_NAME', 'HOTEN']));
                            datNeuTrong('txtKQ_' + a[1] + '_SDT', T.pickLoose(r, ['PHONE_NUMBER', 'SODIENTHOAI', 'SDT']));
                        });
                    }),
                    P.dsHoaDon(pid).then(function (a) { var inv = a[0]; if (!inv) return;
                        if (P.loaiHD(inv.BUYER_TYPE_LOAI, S.inv.dt) === 'CN') { dat('txtKQ_HD_NguoiMua', inv.BUYER_NAME_TENNM); if (inv.BUYER_NAME_TENNM) q('txtKQ_HD_NguoiMua').setAttribute('data-cham', '1'); }
                        else dat('txtKQ_HD_TenDonVi', inv.BUYER_NAME_TENNM);
                        if (inv.BUYER_ADDR_DIACHI) { dat('txtKQ_HD_DiaChi', inv.BUYER_ADDR_DIACHI); q('txtKQ_HD_DiaChi').setAttribute('data-cham', '1'); }
                        dat('txtKQ_HD_MST', inv.BUYER_TAX_MST); dat('txtKQ_HD_MaQHNS', inv.BUYER_BUDGET_MAQHNS); dat('txtKQ_HD_Email', inv.BUYER_EMAIL); dat('txtKQ_HD_SDT', inv.BUYER_PHONE_SDT);
                        if (inv.BUYER_TYPE_LOAI) {
                            var ma = String(inv.BUYER_TYPE_LOAI).trim(), r = S.inv.dt.filter(function (x) { return String(x.MA || x.Ma || '').trim() === ma; })[0];
                            T.datChon(q('ddlKQ_HD_DoiTuong'), r ? T.id(r) : ma, r ? r.TEN : ma);
                        }
                    }),
                    /* Nguồn khai thác (gốc 1–2/10): tra lùi dần (P.timDoiTac); không có dòng thì lấy tên đã biết ở cột
                       "Nguồn khai thác" của danh sách để chọn theo chữ. */
                    Promise.all([P.timDoiTac(Q.khId, dotHienTai(), pid), P.dmDoiTac()]).then(function (x) {
                        var tenNgoai = T.kqCache.nguon[pid] || '';
                        var rows = P.locTheoNV(x[0], nvHienTai());
                        var r = P.dtcMoiNhat(rows);
                        if (!r) { if (tenNgoai) T.datChon(q('ddlKQ_NguonKhaiThac'), '', tenNgoai); return; }
                        S.dtc = { pid: pid, rowIds: rows.map(P.dtcRowId).filter(Boolean), rowId: P.dtcRowId(r), partnerId: P.idDoiTacCua(r),
                            ghiChu: r.GHICHU || r.GhiChu || '', nguonId: T.pickLoose(r, ['TS_HOSO_NGUON_ID', 'HOSO_NGUON_ID']) || '' };
                        if (S.dtc.ghiChu) dat('txtKQ_NguonKhaiThac_GhiChu', S.dtc.ghiChu);
                        var ten = P.tenDoiTacCua(r, x[1]) || tenNgoai;
                        if (S.dtc.partnerId || ten) T.datChon(q('ddlKQ_NguonKhaiThac'), S.dtc.partnerId, ten);
                    })
                ];
                return Promise.all(viec.map(function (p) { return p.catch(function () {}); }));
            }).then(function () { S.qd = null; return napHoSoDM(S.hosoId); }).then(function () { moMucCoDuLieu(); veCanhBaoHD(); Q.veBadge(); });
        }
        function ganChiTiet(d) {
            if (!d) return;
            var L = function (n) { return T.pickLoose(d, n); };
            var V = function (n, re) { var v = L(n); return v !== '' ? v : (re ? T.pickPair(d, re).id : ''); };
            var TN = function (re) { return T.pickPair(d, re).ten; };
            var dd = function (k, id, ten) { if (id || ten) T.datChon(q(k), id, ten); };
            dd('ddlKQ_PhuongThuc', V(['HOSO_KH_DOT_PT_ID', 'KH_DOT_PT_ID', 'DOT_PT_ID'], /DOT_PT|PHUONGTHUC/), TN(/DOT_PT|PHUONGTHUC/));
            dd('ddlKQ_DoiTuongTS', V(['HOSO_DOITUONG_TS_ID', 'DOITUONG_TS_ID'], /DOITUONG_?TS/), TN(/DOITUONG_?TS/));
            dd('ddlKQ_DoiTuongUT', V(['HOSO_DOITUONG_UT_IDS', 'DOITUONG_UT_IDS', 'DOITUONG_UT_ID'], /DOITUONG_?UT/), TN(/DOITUONG_?UT/));
            dd('ddlKQ_KhuVucUT', V(['HOSO_KHUVUC_UT_ID', 'KHUVUC_UT_ID'], /KHUVUC/), TN(/KHUVUC/));
            dd('ddlKQ_HocLuc', V(['PERSONEDU_HOCLUC', 'EDU_HOCLUC', 'HOCLUC'], /HOCLUC/), TN(/HOCLUC/));
            dd('ddlKQ_HanhKiem', V(['PERSONEDU_HANHKIEM', 'EDU_HANHKIEM', 'HANHKIEM'], /HANHKIEM/), TN(/HANHKIEM/));
            datNeuTrong('txtKQ_MaTinh12', V(['PERSONEDU_TINH_ID', 'EDU_TINH_ID', 'PERSONEDU_TINH_MA'], /EDU.*TINH|TINH.*12/));
            var tr = V(['PERSONEDU_TRUONGMATEN', 'EDU_TRUONGMATEN', 'TRUONGMATEN', 'TRUONG_MA_TEN'], /TRUONG/) || TN(/TRUONG/);
            if (tr) datTruong(tr);
            datNeuTrong('txtKQ_ToHopMa', V(['XETTUYEN_TOHOPMON_CODE', 'TOHOPMON_CODE', 'TOHOPMON_MA', 'TOHOP_MA'], /TOHOP.*(CODE|MA)$/));
            datNeuTrong('txtKQ_ToHopTen', V(['XETTUYEN_TOHOPMON_TEN', 'TOHOPMON_TEN', 'TOHOP_TEN']) || TN(/TOHOP/));
            datNeuTrong('txtKQ_DiemUT', V(['XETTUYEN_DIEMUUTIEN', 'DIEMUUTIEN', 'DIEM_UU_TIEN'], /DIEM.*UUTIEN|DIEMUT$/));
            datNeuTrong('txtKQ_TongDiemMon', V(['XETTUYEN_DIEMTONGMON', 'DIEMTONGMON', 'TONGDIEMMON'], /DIEM.*TONGMON|TONGDIEM.*MON/));
            datNeuTrong('txtKQ_TongDiemXT', V(['XETTUYEN_DIEMTONGXT', 'DIEMTONGXT', 'TONGDIEMXT'], /DIEM.*TONGXT|TONGDIEM.*XT/));
            var diem = [L(['XETTUYEN_DIEM1', 'DIEM1', 'DIEM_MON1']), L(['XETTUYEN_DIEM2', 'DIEM2', 'DIEM_MON2']), L(['XETTUYEN_DIEM3', 'DIEM3', 'DIEM_MON3'])];
            if (!diem[0] && !diem[1] && !diem[2]) {
                String(V(['XT_MON_DATA', 'XTMON_DATA', 'MON_DATA'], /MON_?DATA/) || '').split('|').forEach(function (it) {
                    var p = it.split('~'), stt = parseInt(p[3], 10); if (stt >= 1 && stt <= 3) diem[stt - 1] = p[1];
                });
            }
            diem.forEach(function (v, i) { datNeuTrong('txtKQ_Diem' + (i + 1), v); });
            [['Bo', /BO_/], ['Me', /ME_/]].forEach(function (a) {
                var p = a[0].toUpperCase();
                datNeuTrong('txtKQ_' + a[0] + '_HoTen', V(['PERSONFAM_' + p + '_HOTEN', p + '_HOTEN'], new RegExp(p + '_HOTEN|' + p + '_TEN')));
                datNeuTrong('txtKQ_' + a[0] + '_SDT', V(['PERSONFAM_' + p + '_SDT', p + '_SDT'], new RegExp(p + '_SDT|' + p + '_DIENTHOAI')));
            });
            datNeuTrong('txtKQ_QDMa', V(['KETQUA_QUYETDINH_ID', 'QUYETDINH_MA', 'QUYETDINH_ID'], /QUYETDINH/));
            datNeuTrong('txtKQ_IntakeCode', V(['INTAKE_INTAKECODE', 'INTAKECODE', 'INTAKE_CODE'], /INTAKE.*CODE$/));
            datNeuTrong('txtKQ_IntakeTypeCode', V(['INTAKE_INTAKETYPECODE', 'INTAKETYPECODE', 'INTAKE_TYPE_CODE'], /INTAKE.*TYPE.*CODE$/));
            dd('ddlKQ_CoSoDaoTao', V(['DAOTAO_COSODAOTAO_ID', 'COSODAOTAO_ID'], /COSODAOTAO/), TN(/COSODAOTAO/));
            // Nguồn khai thác nếu LayTT_HoSo_TS có trả (gốc 2/10) — chỉ điền khi ô còn trống, bản ghi nhận riêng vẫn ưu tiên
            if (!g('ddlKQ_NguonKhaiThac')) dd('ddlKQ_NguonKhaiThac', V(['TS_DOITACTUYENSINH_ID', 'TS_DOITAC_TUYENSINH_ID', 'TS_DOITAC_ID', 'DOITAC_ID', 'DOI_TAC_ID'], /DOITAC/), TN(/DOITAC/));
        }
        function ganBank(b) {
            var any = function (n, re) { var v = T.pickLoose(b, n); if (v !== '') return v; var p = T.pickPair(b, re); return p.id || p.ten; };
            var l = T.pickPair(b, /HINHTHUCTT|ACCOUNT_TYPE|LOAI_?TK|BANK_TYPE/);
            if (l.id || l.ten) T.datChon(q('ddlKQ_HD_HinhThucTT'), l.id, l.ten);
            datNeuTrong('txtKQ_HD_NganHang', any(['PERSONBANK_TENNGANHANG', 'BANK_TENNGANHANG', 'TENNGANHANG'], /NGANHANG|BANK_NAME|BANK_TEN/));
            datNeuTrong('txtKQ_HD_SoTK', any(['PERSONBANK_SOTAIKHOAN', 'BANK_SOTAIKHOAN', 'SOTAIKHOAN'], /SOTAIKHOAN|ACCOUNT_NO|ACCOUNT_NUMBER|SO_?TK/));
            datNeuTrong('txtKQ_HD_ChuTK', any(['PERSONBANK_CHUTAIKHOAN', 'BANK_CHUTAIKHOAN', 'CHUTAIKHOAN'], /CHUTAIKHOAN|ACCOUNT_HOLDER|ACCOUNT_NAME|CHU_?TK/));
            datNeuTrong('txtKQ_HD_GhiChu', any(['PERSONBANK_GHICHU', 'BANK_GHICHU', 'GHICHU', 'NOTE'], /GHICHU|^NOTE$|DESCRIPTION/));
        }

        /* ---------- chụp form ---------- */
        function thuDiaChi() {
            return [['NS', 'txtKQ_NoiSinh'], ['HK', 'txtKQ_HK_SoNha']].map(function (a) {
                var pre = a[0], ch = function (k) { return !!q(k).getAttribute('data-cham'); };
                var b = { kind: pre, tinh: g('ddlKQ_' + pre + '_Tinh'), huyen: g('ddlKQ_' + pre + '_Huyen'), xa: g('ddlKQ_' + pre + '_Xa'), line: g(a[1]),
                    daCham: ch('ddlKQ_' + pre + '_Tinh') || ch('ddlKQ_' + pre + '_Huyen') || ch('ddlKQ_' + pre + '_Xa'), chamLine: ch(a[1]) };
                b.full = [b.line, b.xa && tenChon('ddlKQ_' + pre + '_Xa'), b.huyen && tenChon('ddlKQ_' + pre + '_Huyen'), b.tinh && tenChon('ddlKQ_' + pre + '_Tinh')]
                    .filter(function (x) { return x; }).join(', ');
                return b;
            }).filter(function (b) { return b.tinh || b.xa || b.line || b.daCham || b.chamLine; });
        }
        function chup() {
            var bank = { loai: g('ddlKQ_HD_HinhThucTT'), nganHang: g('txtKQ_HD_NganHang'), soTK: g('txtKQ_HD_SoTK'), chuTK: g('txtKQ_HD_ChuTK'), ghiChu: g('txtKQ_HD_GhiChu') };
            var fam = [['BO', 'Bo'], ['ME', 'Me']].map(function (a) {
                var f = { kind: a[0], hoTen: g('txtKQ_' + a[1] + '_HoTen'), namSinh: '', noiO: '', sdt: g('txtKQ_' + a[1] + '_SDT') };
                return f.hoTen || f.sdt ? f : null;
            }).filter(Boolean);
            var uv = ungVienHD();
            return {
                addr: thuDiaChi(),
                invoice: { tenDonVi: g('txtKQ_HD_TenDonVi'), nguoiMua: g('txtKQ_HD_NguoiMua'), diaChi: g('txtKQ_HD_DiaChi'), mst: g('txtKQ_HD_MST'),
                    maQHNS: g('txtKQ_HD_MaQHNS'), email: g('txtKQ_HD_Email'), sdt: g('txtKQ_HD_SDT'), doiTuong: uv[0] || '', ungVien: uv },
                bank: (bank.loai || bank.nganHang || bank.soTK || bank.chuTK || bank.ghiChu) ? bank : null,
                profile: (g('ddlKQ_DanToc') || g('ddlKQ_TonGiao')) ? { danToc: g('ddlKQ_DanToc'), tonGiao: g('ddlKQ_TonGiao') } : null,
                family: fam,
                iden: g('txtKQ_SoCCCD') ? { so: g('txtKQ_SoCCCD'), ngayCap: T.ngayISO(g('txtKQ_NgayCapCCCD')), noiCap: g('txtKQ_NoiCapCCCD') } : null,
                nguon: { doiTacId: g('ddlKQ_NguonKhaiThac'), tenDoiTac: g('ddlKQ_NguonKhaiThac') ? tenChon('ddlKQ_NguonKhaiThac') : '', ghiChu: g('txtKQ_NguonKhaiThac_GhiChu'), nv: nvHienTai() },
                cccd: g('txtKQ_SoCCCD'), hoTen: g('txtKQ_HoTen'), danhMuc: thuLuoi(), dot: dotHienTai(), canhBaoHD: kiemTraHD()
            };
        }
        function monData() {
            var ten = g('txtKQ_ToHopTen').split(/[,;]/), a = [];
            for (var i = 0; i < 3; i++) {
                var d = g('txtKQ_Diem' + (i + 1));
                if (!d && !ten[i]) continue;
                var t = (ten[i] || ('Mon ' + (i + 1))).trim();
                a.push(t.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '') + '~' + d + '~1~' + (i + 1) + '~' + t);
            }
            return a.join('|');
        }
        function soHoa(o) { Object.keys(o).forEach(function (k) { if (k.charAt(0) !== 'd') return; var v = o[k]; if (v === '' || v == null) o[k] = null; else { var n = Number(v); o[k] = isNaN(n) ? null : n; } }); return o; }
        /* Lưu các bảng phụ (_saveKhai_PhuThuoc) → danh sách câu nhắc lỗi */
        function luuPhu(pid, snap) {
            var loi = [];
            return Promise.all([
                P.ghiHoaDon(pid, snap.invoice, S.inv.dt).then(function (m) { if (m) loi.push(m); }),
                P.ghiBank(pid, snap.bank), P.ghiProfile(pid, snap.profile), P.ghiGiaDinh(pid, snap.family),
                P.ghiDinhDanh(pid, snap.iden), P.ghiDiaChi(pid, snap.addr),
                P.ghiDoiTac({ pid: pid, khId: Q.khId, dotId: snap.dot, nv: snap.nguon.nv, doiTacId: snap.nguon.doiTacId, ghiChu: snap.nguon.ghiChu,
                    cu: S.dtc.pid === pid ? S.dtc : {} }).then(function (m) {
                    if (m) { loi.push(m); return; }
                    // Cột "Nguồn khai thác" của danh sách hiện ngay tên vừa lưu (gốc 1–2/10 cập nhật _nguonMap)
                    if (!snap.nguon.doiTacId) { T.kqCache.nguon[pid] = ''; return; }
                    return P.dmDoiTac().then(function (dm) {
                        T.kqCache.nguon[pid] = P.tenDoiTacCua({ TS_DOITACTUYENSINH_ID: snap.nguon.doiTacId }, dm) || snap.nguon.tenDoiTac;
                    });
                })
            ].map(function (p) { return p.catch(function () {}); })).then(function () { return loi; });
        }
        function thongBao(tieuDe, snap, loi, kqDM, tone) {
            var ds = [];
            var cbDC = P.canhBaoDiaChi(snap.addr, null);
            if (cbDC) ds.push(cbDC);
            (loi || []).forEach(function (m) { ds.push(m); });
            if (kqDM && kqDM.total && !kqDM.thieuId) ds.push('Danh mục hồ sơ: đã lưu ' + kqDM.ok + '/' + kqDM.total + ' dòng' + (kqDM.fail ? ' (lỗi: ' + kqDM.fail + ')' : ''));
            if (kqDM && kqDM.total && kqDM.thieuId) ds.push('Chưa lưu được danh mục hồ sơ (không tra được mã hồ sơ vừa tạo) — mở lại hồ sơ, nhập lại tab Danh mục hồ sơ rồi bấm "Cập nhật hồ sơ".');
            if (snap.canhBaoHD.length && snap.canhBaoHD[0].indexOf('Chưa khai thông tin xuất hóa đơn') !== 0) ds.push('Nhắc — tab Xuất hóa đơn: ' + snap.canhBaoHD.join(' '));
            ui.toast(tieuDe + (ds.length ? ' — ' + ds.join(' · ') : ''), tone || (loi && loi.length || (kqDM && kqDM.thieuId) ? 'warn' : 'ok'));
        }

        /* ---------- Lưu ---------- */
        function luu() { if (S.dangLuu) return; if (S.sua && S.hosoId) luuSua(); else luuMoi(); }
        /* Khoá nút Lưu + chữ "Đang lưu…" tới khi xong (gốc 1/10 — chống bấm hai lần khi mạng chậm). Trả hàm mở khoá. */
        function dangLuu(chu) {
            var btn = q('luu'), sp = btn.querySelector('span');
            S.dangLuu = true; btn.disabled = true; if (sp) sp.textContent = chu;
            return function () { S.dangLuu = false; btn.disabled = false; if (sp && sp.textContent === chu) sp.textContent = S.sua ? 'Cập nhật hồ sơ' : 'Lưu hồ sơ'; };
        }
        function luuMoi() {
            if (!Q.khId) { ui.toast('Chưa xác định kế hoạch tuyển sinh (mở lại từ danh sách)', 'warn'); return; }
            var warn = function (m, pn, k) { ui.toast(m, 'warn'); toiPanel(pn, k); };
            if (!g('txtKQ_HoTen')) return warn('Vui lòng nhập Họ và tên', 'canhan', 'txtKQ_HoTen');
            var ns = T.ngayUI(g('txtKQ_NgaySinh'));
            if (!ns) return warn('Vui lòng nhập Ngày tháng năm sinh', 'canhan', 'txtKQ_NgaySinh');
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(ns)) return warn('Ngày sinh chưa hợp lệ — chọn lại ngày trên lịch', 'canhan', 'txtKQ_NgaySinh');
            if (!g('ddlKQ_GioiTinh')) return warn('Vui lòng chọn Giới tính', 'canhan', 'ddlKQ_GioiTinh');
            if (!g('txtKQ_SoCCCD')) return warn('Vui lòng nhập Số CCCD', 'cccd', 'txtKQ_SoCCCD');
            if (!/^\d{9,12}$/.test(g('txtKQ_SoCCCD'))) return warn('Số CCCD phải là 9–12 chữ số', 'cccd', 'txtKQ_SoCCCD');
            /* Trùng CCCD với hồ sơ ĐÃ CÓ trong danh sách đang nạp (gốc 1/10 — chống tạo hai lần khi mạng chậm / bấm nhầm) */
            var cc = g('txtKQ_SoCCCD').replace(/\D/g, '');
            var trung = (Q.rows || []).filter(function (r) { return String(T.pickLoose(r, ['PERSONIDEN_SOCCCD', 'PersonIden_SoCCCD', 'SOCCCD', 'SO_CCCD', 'CCCD']) || '').replace(/\D/g, '') === cc; })[0];
            if (trung) return warn('Số CCCD ' + cc + ' đã có trong danh sách hồ sơ (thí sinh: ' + (T.pickLoose(trung, ['COREPERSON_HOTEN', 'HOTEN']) || 'thí sinh khác') +
                '). Vui lòng kiểm tra lại!', 'cccd', 'txtKQ_SoCCCD');
            T.S.dotKQ = g('ddlKQ_DotTuyenSinh') || T.S.dotKQ || '';
            if (!T.S.dotKQ) return warn('Vui lòng chọn Đợt tuyển sinh', 'trungtuyen', 'ddlKQ_DotTuyenSinh');
            if (!g('ddlKQ_NguyenVongDauRa')) return warn('Vui lòng chọn Nguyện vọng đầu ra (ngành đầu vào)', 'trungtuyen', 'ddlKQ_NguyenVongDauRa');
            tinhTong();
            var m = ns.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/), th = g('txtKQ_ToHopMa');
            var o = soHoa({
                action: 'SV_Core_TS_HoSo_MH/FSkkLB4JLhIuHhUS', func: HS + 'Them_HoSo_TS',
                strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'THEM',
                strCorePerson_HoTen: g('txtKQ_HoTen'), strCorePerson_Ho: '', strCorePerson_Dem: '', strCorePerson_Ten: '', strCorePerson_NgaySinh: ns,
                dCorePerson_NgayS: m ? parseInt(m[1], 10) : '', dCorePerson_ThangS: m ? parseInt(m[2], 10) : '', dCorePerson_NamS: m ? parseInt(m[3], 10) : '',
                strCorePerson_GioiTinh_Id: g('ddlKQ_GioiTinh'), strMaSo: '', strDaoTao_LopQuanLy_Id_DK: g('ddlKQ_LopDuKien'),
                strPersonProfile_DanToc_Id: g('ddlKQ_DanToc'), strPersonProfile_TonGiao_Id: g('ddlKQ_TonGiao'), strPersonProfile_QuocTich_Id: g('ddlKQ_QuocTich'),
                strPersonContact_DienThoai: g('txtKQ_DienThoai'), strPersonContact_Email: g('txtKQ_Email'),
                strPersonIden_SoCCCD: g('txtKQ_SoCCCD'), strPersonIden_NgayCap: T.ngayISO(g('txtKQ_NgayCapCCCD')), strPersonIden_NoiCap: g('txtKQ_NoiCapCCCD'),
                strPersonAddr_NS_Tinh_Id: g('ddlKQ_NS_Tinh'), strPersonAddr_NS_Xa_Id: g('ddlKQ_NS_Xa'), strPersonAddr_NoiSinh: g('txtKQ_NoiSinh'),
                strPersonAddr_HK_Tinh_Id: g('ddlKQ_HK_Tinh'), strPersonAddr_HK_Xa_Id: g('ddlKQ_HK_Xa'), strPersonAddr_HK_SoNha: g('txtKQ_HK_SoNha'),
                strPersonEdu_Tinh_Id: g('txtKQ_MaTinh12'), strPersonEdu_TruongMaTen: g('txtKQ_TruongMaTen'), strPersonEdu_HocLuc: g('ddlKQ_HocLuc'), strPersonEdu_HanhKiem: g('ddlKQ_HanhKiem'),
                strPersonFam_Bo_HoTen: g('txtKQ_Bo_HoTen'), dPersonFam_Bo_NamSinh: '', strPersonFam_Bo_NoiO: '', strPersonFam_Bo_SDT: g('txtKQ_Bo_SDT'),
                strPersonFam_Me_HoTen: g('txtKQ_Me_HoTen'), dPersonFam_Me_NamSinh: '', strPersonFam_Me_NoiO: '', strPersonFam_Me_SDT: g('txtKQ_Me_SDT'),
                strHoSo_KH_TS_Id: Q.khId, strHoSo_KH_TS_Dot_Id: T.S.dotKQ, strHoSo_KH_Dot_PT_Id: g('ddlKQ_PhuongThuc'), strHoSo_DoiTuong_TS_Id: g('ddlKQ_DoiTuongTS'),
                strHoSo_DoiTuong_UT_Ids: g('ddlKQ_DoiTuongUT'), strHoSo_KhuVuc_UT_Id: g('ddlKQ_KhuVucUT'), strHoSo_MaHoSo: g('txtKQ_MaHoSo'), strHoSo_SoBaoDanh: g('txtKQ_SBD'),
                strHoSo_Import_Batch_Id: '', dHoSo_Import_Row_No: '', strDaoTao_CoSoDaoTao_Id: g('ddlKQ_CoSoDaoTao'), strSoTienNopTruoc: '',
                strNguyenVong_DauRa_Id: g('ddlKQ_NguyenVongDauRa'),
                strXetTuyen_TohopMon_Id: th, strXetTuyen_TohopMon_Code: th, strXetTuyen_TohopMon_Ten: g('txtKQ_ToHopTen'),
                dXetTuyen_DiemUuTien: g('txtKQ_DiemUT'), dXetTuyen_DiemTongMon: g('txtKQ_TongDiemMon'), dXetTuyen_DiemTongXT: g('txtKQ_TongDiemXT'), strXT_Mon_Data: monData(),
                strKetQua_QuyetDinh_Id: g('txtKQ_QDMa'), strIntake_IntakeCode: g('txtKQ_IntakeCode'), strIntake_IntakeTypeCode: g('txtKQ_IntakeTypeCode'),
                strPersonInvoice_TypeLoai: g('ddlKQ_HD_DoiTuong'), strPersonInvoice_NguoiMua: g('txtKQ_HD_NguoiMua'), strPersonInvoice_TenDonVi: g('txtKQ_HD_TenDonVi'),
                strPersonInvoice_MST: g('txtKQ_HD_MST'), strPersonInvoice_MaQHNS: g('txtKQ_HD_MaQHNS'), strPersonInvoice_SDT: g('txtKQ_HD_SDT'),
                strPersonInvoice_DiaChi: g('txtKQ_HD_DiaChi'), strPersonInvoice_Email: g('txtKQ_HD_Email'),
                strPersonBank_HinhThucTT: g('ddlKQ_HD_HinhThucTT'), strPersonBank_TenNganHang: g('txtKQ_HD_NganHang'), strPersonBank_SoTaiKhoan: g('txtKQ_HD_SoTK'),
                strPersonBank_ChuTaiKhoan: g('txtKQ_HD_ChuTK'), strPersonBank_GhiChu: g('txtKQ_HD_GhiChu'),
                // Nguồn khai thác gửi kèm hồ sơ (gốc 2/10; gốc gửi CẢ hai cách viết _Id / _id — chép nguyên)
                strTS_DoiTacTuyenSinh_Id: g('ddlKQ_NguonKhaiThac'), strTS_DoiTacTuyenSinh_id: g('ddlKQ_NguonKhaiThac'), strTS_DoiTacTuyenSinh_Khac: g('txtKQ_NguonKhaiThac_GhiChu'),
                strExtra_Person_Data: JSON.stringify({ NS_Huyen_Id: g('ddlKQ_NS_Huyen'), HK_Huyen_Id: g('ddlKQ_HK_Huyen') }), strExtra_HoSo_Data: '', strExtra_Intake_Data: ''
            });
            var snap = chup();
            var tha = dangLuu('Đang lưu…');
            ums.api.call(o).then(function (r) {
                var pidMoi = layPid(r.raw);
                var tra = pidMoi && !snap.danhMuc.length ? Promise.resolve({ pid: pidMoi, hs: '' }) : timMoi(snap.cccd, snap.hoTen).then(function (x) { return { pid: x.pid || pidMoi, hs: x.hs }; });
                return tra.then(function (x) {
                    if (!x.pid) {
                        moiMoi(); q('canhbaoluu').hidden = false;
                        ui.toast('Đã lưu hồ sơ chính, NHƯNG chưa gắn được các thông tin bổ sung (địa chỉ, hóa đơn, gia đình, ngân hàng, nguồn khai thác). ' +
                            'Mở hồ sơ vừa tạo trong danh sách và bấm "Cập nhật hồ sơ" một lần để lưu nốt.', 'warn');
                        T.kqNapLai(); return;
                    }
                    return Promise.all([luuPhu(x.pid, snap), luuLuoi(x.hs, snap.dot, snap.danhMuc)]).then(function (k) {
                        thongBao('Đã lưu hồ sơ thành công', snap, k[0], k[1]);
                        moiMoi(); T.kqNapLai();
                    });
                });
            }).catch(function (err) { ums.api.handle(err, 'Them_HoSo_TS'); }).then(tha);
        }
        function layPid(raw) {
            var t = function (v) { var s = v == null ? '' : String(v).trim(); return s.length === 32 ? s : ''; };
            var d = raw && raw.Data;
            if (Array.isArray(d)) d = d[0];
            if (d && typeof d === 'object') {
                var k = ['COREPERSON_ID', 'CorePerson_Id', 'CORE_PERSON_ID', 'Core_Person_Id', 'CorePerson_Id_Out', 'PERSON_ID', 'Person_Id'];
                for (var i = 0; i < k.length; i++) if (t(d[k[i]])) return t(d[k[i]]);
                return t(raw.Id);
            }
            return t(d) || t(raw && raw.Id);
        }
        /** Tra Core_Person_Id + HOSO_ID của hồ sơ vừa thêm (_findNewPersonId: theo CCCD → quét cả danh sách → thử lại 3 nhịp) */
        function timMoi(cccd, hoTen) {
            var so = function (s) { return String(s || '').replace(/\D/g, ''); }, c = function (s) { return String(s || '').trim().toLowerCase(); };
            var tim = function (kw, dot) {
                return ums.api.call(P.dsHoSoTS({ tuKhoa: kw, kh: Q.khId, dot: dot })).then(T.rows, function () { return []; }).then(function (rows) {
                    var hit = cccd ? rows.filter(function (r) { return so(T.pickLoose(r, ['PERSONIDEN_SOCCCD', 'SOCCCD', 'CCCD'])) === so(cccd); })[0] : null;
                    if (!hit && hoTen) hit = rows.filter(function (r) { return c(T.pickLoose(r, ['COREPERSON_HOTEN', 'HOTEN'])) === c(hoTen); })[0];
                    return hit ? { pid: T.pickLoose(hit, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']), hs: T.pickLoose(hit, ['HOSO_ID', 'ID', 'TS_HOSO_ID']) } : null;
                });
            };
            var nhip = 0;
            return (function vong() {
                // Lần hai quét cả danh sách KHÔNG lọc đợt (gốc 2/10 — proc không tìm theo CCCD, hoặc đợt chưa nạp kịp)
                return tim(cccd || hoTen || '', T.S.dotKQ || '').then(function (x) { return x || tim('', ''); }).then(function (x) {
                    if (x || ++nhip > 3) return x || { pid: '', hs: '' };
                    return new Promise(function (ok) { setTimeout(ok, 900 * nhip); }).then(vong);
                });
            })();
        }
        function luuSua() {
            if (!g('txtKQ_HoTen')) { ui.toast('Vui lòng nhập Họ và tên', 'warn'); toiPanel('canhan', 'txtKQ_HoTen'); return; }
            var snap = chup(), pid = S.pid;
            var extra = {};
            [['NgayCapCCCD', T.ngayISO(g('txtKQ_NgayCapCCCD'))], ['NoiCapCCCD', g('txtKQ_NoiCapCCCD')], ['NS_Huyen_Id', g('ddlKQ_NS_Huyen')], ['HK_Huyen_Id', g('ddlKQ_HK_Huyen')]]
                .forEach(function (a) { if (a[1]) extra[a[0]] = a[1]; });
            var th = g('txtKQ_ToHopMa');
            var o = {
                action: 'SV_Core_TS_HoSo_MH/EjQgHgkuEi4eFRIP', func: HS + 'Sua_HoSo_TS',
                strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: 'SUA',
                strHoSo_Id: S.hosoId, strCorePerson_HoTen: g('txtKQ_HoTen'), strCorePerson_NgaySinh: T.ngayUI(g('txtKQ_NgaySinh')),
                strCorePerson_GioiTinh_Id: g('ddlKQ_GioiTinh'), strPersonContact_DienThoai: g('txtKQ_DienThoai'), strPersonContact_Email: g('txtKQ_Email'),
                strPersonIden_SoCCCD: g('txtKQ_SoCCCD'), strHoSo_MaHoSo: g('txtKQ_MaHoSo'), strHoSo_SoBaoDanh: g('txtKQ_SBD'),
                strPersonProfile_DanToc_Id: g('ddlKQ_DanToc'), strPersonProfile_TonGiao_Id: g('ddlKQ_TonGiao'), strPersonProfile_QuocTich_Id: g('ddlKQ_QuocTich'),
                strPersonIden_NgayCap: T.ngayISO(g('txtKQ_NgayCapCCCD')), strPersonIden_NoiCap: g('txtKQ_NoiCapCCCD'),
                strHoSo_KH_Dot_PT_Id: g('ddlKQ_PhuongThuc'), strHoSo_DoiTuong_TS_Id: g('ddlKQ_DoiTuongTS'), strHoSo_DoiTuong_UT_Ids: g('ddlKQ_DoiTuongUT'),
                strHoSo_KhuVuc_UT_Id: g('ddlKQ_KhuVucUT'), strPersonEdu_Tinh_Id: g('txtKQ_MaTinh12'), strPersonEdu_TruongMaTen: g('txtKQ_TruongMaTen'),
                strPersonEdu_HocLuc: g('ddlKQ_HocLuc'), strPersonEdu_HanhKiem: g('ddlKQ_HanhKiem'),
                strXetTuyen_TohopMon_Id: th, strXetTuyen_TohopMon_Code: th, strXetTuyen_TohopMon_Ten: g('txtKQ_ToHopTen'),
                dXetTuyen_DiemUuTien: g('txtKQ_DiemUT'), dXetTuyen_DiemTongMon: g('txtKQ_TongDiemMon'), dXetTuyen_DiemTongXT: g('txtKQ_TongDiemXT'), strXT_Mon_Data: monData(),
                strPersonFam_Bo_HoTen: g('txtKQ_Bo_HoTen'), dPersonFam_Bo_NamSinh: '', strPersonFam_Bo_NoiO: '', strPersonFam_Bo_SDT: g('txtKQ_Bo_SDT'),
                strPersonFam_Me_HoTen: g('txtKQ_Me_HoTen'), dPersonFam_Me_NamSinh: '', strPersonFam_Me_NoiO: '', strPersonFam_Me_SDT: g('txtKQ_Me_SDT'),
                strPersonBank_HinhThucTT: g('ddlKQ_HD_HinhThucTT'), strPersonBank_TenNganHang: g('txtKQ_HD_NganHang'), strPersonBank_SoTaiKhoan: g('txtKQ_HD_SoTK'),
                strPersonBank_ChuTaiKhoan: g('txtKQ_HD_ChuTK'), strPersonBank_GhiChu: g('txtKQ_HD_GhiChu'),
                strKetQua_QuyetDinh_Id: g('txtKQ_QDMa'), strIntake_IntakeCode: g('txtKQ_IntakeCode'), strIntake_IntakeTypeCode: g('txtKQ_IntakeTypeCode'),
                strDaoTao_CoSoDaoTao_Id: g('ddlKQ_CoSoDaoTao'), strNguyenVong_DauRa_Id: g('ddlKQ_NguyenVongDauRa'),
                strTS_DoiTacTuyenSinh_Id: g('ddlKQ_NguonKhaiThac'), strTS_DoiTacTuyenSinh_id: g('ddlKQ_NguonKhaiThac'), strTS_DoiTacTuyenSinh_Khac: g('txtKQ_NguonKhaiThac_GhiChu'),
                strExtra_Data: vuaExtra(extra)
            };
            var giu = ['action', 'func', 'strNguoiThucHien_Id', 'strVaiTroDangNhap_Id', 'strChucNangHeThong_Id', 'strHanhDong_Code', 'strHoSo_Id', 'strCorePerson_HoTen', 'strExtra_Data'];
            Object.keys(o).forEach(function (k) {
                if (giu.indexOf(k) >= 0) return;
                if (o[k] === '' || o[k] == null) { delete o[k]; return; }
                if (k.charAt(0) === 'd') { var n = Number(o[k]); if (isNaN(n)) delete o[k]; else o[k] = n; }
            });
            var tha = dangLuu('Đang cập nhật…');
            ums.api.call(o).then(function () {
                return Promise.all([luuPhu(pid, snap), luuLuoi(S.hosoId, snap.dot, snap.danhMuc)]).then(function (k) {
                    thongBao('Cập nhật hồ sơ thành công', snap, k[0], k[1]);
                    T.kqDong(true);
                });
            }).catch(function (err) { ums.api.handle(err, 'Sua_HoSo_TS'); }).then(tha);
        }
        /* strExtra_Data ≤ 990 byte (cột VARCHAR2(1000) — vượt là hỏng cả lần lưu) */
        function vuaExtra(obj) {
            var len = function (s) { return encodeURIComponent(s + '').replace(/%[0-9A-F]{2}/gi, 'x').length; };
            var json = JSON.stringify(obj);
            Object.keys(obj).sort(function (a, b) { return len(obj[b]) - len(obj[a]); }).forEach(function (k) {
                if (len(json) > 990) { delete obj[k]; json = JSON.stringify(obj); }
            });
            return json;
        }

        /* ---------- Đổi nguyện vọng đầu vào (XacNhanChonChuongTrinhHoc) ---------- */
        function doiNV() {
            if (!S.sua || !S.hosoId) { ui.toast('Chỉ đổi nguyện vọng khi đang mở hồ sơ ở chế độ Sửa.', 'warn'); return; }
            var d = S.d, pid = T.pick(d, ['COREPERSON_ID', 'HOSO_COREPERSON_ID', 'CorePerson_Id', 'CorePersonId']);
            var hoTen = T.pick(d, ['COREPERSON_HOTEN', 'CorePerson_HoTen']), ma = T.pick(d, ['HOSO_MAHOSO', 'HoSo_MaHoSo']);
            var dlg = ui.dialog({ title: 'Đổi nguyện vọng đầu vào' + (hoTen ? ' — ' + hoTen + (ma ? ' — ' + ma : '') : ''), icon: 'fa-arrows-rotate', size: 'xl',
                body: '<div class="khtsn-note ums-u-fz13"><i class="fa-light fa-circle-info"></i> Chọn 1 nguyện vọng đầu vào để xác nhận chương trình học cho thí sinh ' +
                    '(PKG_CORE_TS_HOSO.XacNhanChonChuongTrinhHoc: Person_Id, DaoTao_ChuongTrinh_Id, INTAKE_Id).</div><div data-nv="bang" class="ums-u-mt-2"></div>' });
            var bang = dlg.body.querySelector('[data-nv="bang"]');
            bang.innerHTML = ui.empty('Đang tải danh sách nguyện vọng...', 'fa-spinner fa-spin');
            var rows = [];
            ums.api.call({ action: T.TS + 'ETMeFTIeCikeBSA0HhMgHgYkNR4FMgPP', func: T.PTS + 'Pr_Ts_Kh_Dau_Ra_Get_Ds', strTuKhoa: '', strTs_Kh_TuyenSinh_Id: Q.khId,
                strTs_Kh_TuyenSinh_Dot_Id: T.S.dotKQ || '', strTs_Kh_Dot_PhuongThuc_Id: '', strOutput_Status_Code: '', dIs_Public: '', dIs_Active: 1 }).then(function (r) {
                rows = T.rows(r);
                return Promise.all([T.ensureCTMa(rows), T.ensureNganhMa()]);
            }).then(function () {
                ui.table({ el: bang, rows: rows, empty: 'Không có nguyện vọng đầu vào nào để chọn.', columns: [
                    { title: 'Mã', cls: 'is-nowrap', render: function (x) { return ui.esc(T.pick(x, ['MA_HIENTHI', 'MA']) || T.ctMa[x.DAOTAO_TOCHUCCHUONGTRINH_ID] || ''); } },
                    { title: 'Tên nguyện vọng', render: function (x) { return T.rong(T.pick(x, ['TEN_HIENTHI', 'TEN']) || x.DAOTAO_TOCHUCCHUONGTRINH_TEN || ''); } },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }, { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Chương trình', render: function (x) { return T.rong(T.tenMa(x.DAOTAO_TOCHUCCHUONGTRINH_TEN || '', T.ctMa[x.DAOTAO_TOCHUCCHUONGTRINH_ID] || '')); } },
                    { title: 'Ngành TS', render: function (x) { var t = x.DAOTAO_NGANH_TS_TEN || x.DAOTAO_NGANH_DT_TEN || ''; return ui.esc(T.tenMa(t, T.maNganh(x.DAOTAO_NGANH_TS_ID || x.DAOTAO_NGANH_DT_ID, t))); } },
                    { title: 'Thao tác', cls: 'is-center', render: function (x, i) { return ui.btn('confirm', { text: 'Chọn', cls: 'ums-btn--sm', attr: { 'data-nv': 'chon', 'data-i': i } }); } }
                ] });
            }).catch(function () { bang.innerHTML = ui.fail('Lỗi tải danh sách nguyện vọng.'); });
            bang.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-nv="chon"]');
                if (!b) return;
                var x = rows[Number(b.getAttribute('data-i'))], ct = x ? (x.DAOTAO_TOCHUCCHUONGTRINH_ID || '') : '';
                var thieu = [];
                if (!pid) thieu.push('Person_Id (COREPERSON_ID của hồ sơ)');
                if (!ct) thieu.push('DaoTao_ChuongTrinh_Id (DAOTAO_TOCHUCCHUONGTRINH_ID của nguyện vọng đầu ra)');
                if (!S.intake) thieu.push('INTAKE_Id (CORE_PERSON_INTAKE_ID của hồ sơ)');
                if (thieu.length) { ui.toast('Dữ liệu không hợp lệ. Thiếu: ' + thieu.join(', '), 'warn'); return; }
                var ten = T.pick(x, ['TEN_HIENTHI', 'TEN']) || x.DAOTAO_TOCHUCCHUONGTRINH_TEN || '';
                ui.confirm('Xác nhận đổi nguyện vọng đầu vào cho thí sinh ' + hoTen + ' sang ' + ten + '?', { ok: 'Xác nhận', title: 'Đổi nguyện vọng đầu vào' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: 'SV_Core_TS_HoSo_MH/GSAiDykgLwIpLi8CKTQuLyYVMygvKQkuIgPP', func: HS + 'XacNhanChonChuongTrinhHoc',
                        strPerson_Id: pid, strDaoTao_ChuongTrinh_Id: ct, strINTAKE_Id: S.intake, strNguoiThucHien_Id: '' }).then(function () {
                        ui.toast('Đã đổi nguyện vọng đầu vào thành công.', 'ok'); dlg.close(); T.kqNapLai();
                    });
                }).catch(function (err) { ums.api.handle(err, 'XacNhanChonChuongTrinhHoc'); });
            });
        }

        return { moiMoi: moiMoi, moSua: moSua, dotHienTai: dotHienTai };
    };
})();
