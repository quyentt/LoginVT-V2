/* =========================================================================
   Quản trị quyền dữ liệu Cán bộ — quyền dữ liệu gán THẲNG cho từng nhân sự (Core_User_Data_Scope).
   Bản gốc: ApisCMS/Modules/phanquyen/html/quantriquyendulieu.html + script/quantriquyendulieu.js
   (KHÔNG phải ApisCMS/Modules/phanquyen/quantriquyendulieu.html — bản cũ lạc chỗ ngoài thư mục html/).
   Bố cục gốc MỘT cột: thanh lọc (Tìm kiếm nhân sự · Khoa/Đơn vị) + lưới nhân sự × chiều dữ liệu, phân trang
   ở máy khách 20 dòng (10/20/50/100). Khung chung: script/_qtqdl.js.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     Đơn vị   NS_CoCauToChuc/LayDanhSach (GET) { dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }
              — cây theo PARENT, xếp THUTU rồi TEN; mục có PARENT không nằm trong danh sách bị bỏ (như gốc).
     Nhân sự  edu.system.getList_NhanSu → ums.ref.nhanSu { strTuKhoa: '', pageIndex: 1, pageSize: 100000,
              strCoCauToChuc_Id: <đơn vị>, dLaCanBoNgoaiTruong: 0 } (pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2)
              — HOTEN rỗng thì ghép HODEM + TEN; lọc từ khoá trên HOTEN / MASO ở máy khách.
     Đọc quyền  PKG_CORE_QUANTRI_02.LayDSCore_D_Value_U_Data_Scope { strChucNang_Id, strCore_Person_Id: <ID nhân sự>,
              strCore_Data_Dimension_Id, strNguoiThucHien_Id } — cột giá trị DIMENSION_VALUE_ID|…, khoá
              ID|SCOPE_ID|CORE_USER_DATA_SCOPE_ID|SCOPEID|COREUSERDATASCOPEID.
     Thêm     PKG_CORE_QUANTRI_02.Them_Core_User_Data_Scope { strChucNang_Id, strUserId: <ID nhân sự>, strDimensionId,
              strDimensionValueId, strScopeMode, strScopeKind, strFunctionId: '', dPriorityNo: 100, strEffectiveFrom: '',
              strEffectiveTo: '', strSourceType: 'MANUAL', strSourceRefId: '', strAssignedBy: <người dùng>, strNote: '',
              strNguoiThucHien_Id } — mỗi giá trị một lời gọi.
     Xoá      PKG_CORE_QUANTRI_02.Xoa_Core_User_Data_Scope { strId: <khoá quyền>, strChucNang_Id, strNguoiThucHien_Id }
              — nút "Xóa" nằm trong hộp THÊM QUYỀN (hộp Xem kết quả của màn này chỉ xem, như gốc).
   ---------------------------------------------------------------------------
   Giữ nguyên hành vi gốc (ghi ở can-quyet.js):
     · Hộp Thêm quyền đánh dấu SẴN các giá trị đã có quyền; nút "Xóa" xoá mọi ô ĐÃ CÓ QUYỀN đang được đánh dấu
       ở trang đang xem — bấm Xóa mà không bỏ đánh dấu là xoá hết quyền của trang. Nút nay hiện số dòng sẽ xoá.
     · Mở màn chưa chọn đơn vị thì chưa hiện ai ("Vui lòng chọn Khoa/Đơn vị…").
   Bỏ: nhánh dự phòng "dựng danh sách khoa từ nhân sự" khi NS_CoCauToChuc lỗi (lúc đó danh sách nhân sự luôn rỗng
   nên gốc cũng chỉ ra ô "Tất cả"); nút Tìm kiếm ẩn; getList_NhanSu (LayDSNhanSuTheoCore_Employment) không nơi nào gọi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, Q = ums.qtqdl, e = Q.e, esc = ui.esc;
    var root = document.getElementById('qtqdl-quantriquyendulieu');
    if (!root) return;

    var dsNhanSu = [], khoaId = '', luot = 0;
    function nsId(r) { return r.ID || r.NHANSU_ID; }

    var m = Q.man(root, {
        tieuDe: 'Quản trị quyền dữ liệu Cán bộ',
        loc: [{ key: 'q', type: 'text', label: 'Nhập tên, mã nhân sự... (tự động tìm kiếm)' },
              { key: 'khoa', type: 'select', label: 'Chọn Khoa/Đơn vị' }],
        bang: 'Nhân sự', donVi: 'người', doiTuong: 'nhân sự', doiTuongHoa: 'Nhân sự', icon: 'fa-user',
        stt: true, phanTrang: 20, rong: 'Không tìm thấy nhân sự',
        id: nsId,
        ten: function (r) { return r.HOTEN || 'N/A'; },
        dau: function (r) {
            return '<div class="qtqdl-ns"><i class="fa-light fa-user"></i><div>' +
                '<div class="qtqdl-ns__ten">' + esc(r.HOTEN || 'N/A') + '</div>' +
                '<div class="qtqdl-ns__sub">Mã: ' + esc(r.MASO || 'N/A') + '</div>' +
                (r.DAOTAO_COCAUTOCHUC_TEN ? '<div class="qtqdl-ns__sub">' + esc(r.DAOTAO_COCAUTOCHUC_TEN) + '</div>' : '') +
                '</div></div>';
        },
        quyen: {
            tai: function (r, c) {
                return { action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUeFyAtNCQeFB4FIDUgHhIiLjEk',
                    func: 'PKG_CORE_QUANTRI_02.LayDSCore_D_Value_U_Data_Scope', iM: 'Azz',
                    strChucNang_Id: Q.cn(), strCore_Person_Id: nsId(r), strCore_Data_Dimension_Id: c.id, strNguoiThucHien_Id: Q.uid() };
            },
            map: function (it) {
                return [Q.valueIdCuaQuyen(it), it.ID || it.SCOPE_ID || it.CORE_USER_DATA_SCOPE_ID || it.SCOPEID || it.COREUSERDATASCOPEID];
            },
            them: function (r, c, ctx, v, mode, kind) {
                return { action: 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhQyJDMeBSA1IB4SIi4xJAPP',
                    func: 'PKG_CORE_QUANTRI_02.Them_Core_User_Data_Scope', iM: 'Azz',
                    strChucNang_Id: Q.cn(), strUserId: nsId(r), strDimensionId: c.id, strDimensionValueId: v,
                    strScopeMode: mode, strScopeKind: kind, strFunctionId: '', dPriorityNo: 100,
                    strEffectiveFrom: '', strEffectiveTo: '', strSourceType: 'MANUAL', strSourceRefId: '',
                    strAssignedBy: Q.uid(), strNote: '', strNguoiThucHien_Id: Q.uid() };
            },
            xoaThem: function (scopeId) {
                return { action: 'CMS_QuanTri02_MH/GS4gHgIuMyQeFDIkMx4FIDUgHhIiLjEk',
                    func: 'PKG_CORE_QUANTRI_02.Xoa_Core_User_Data_Scope', iM: 'Azz',
                    strId: scopeId, strChucNang_Id: Q.cn(), strNguoiThucHien_Id: Q.uid() };
            }
        }
    });
    var F = function (k) { return root.querySelector('[data-f="' + k + '"]'); };
    var NHAC = 'Vui lòng chọn Khoa/Đơn vị để xem danh sách nhân sự.';
    m.nhac(NHAC, 'fa-building');

    /* Lọc theo từ khoá (gốc: genTable_DuLieu lọc HOTEN / MASO) */
    function veLai() {
        if (!khoaId) { m.nhac(NHAC, 'fa-building'); return; }
        var k = F('q').value.toLowerCase().trim();
        m.ve(!k ? dsNhanSu : dsNhanSu.filter(function (ns) {
            return (ns.HOTEN || '').toLowerCase().indexOf(k) !== -1 || (ns.MASO || '').toLowerCase().indexOf(k) !== -1;
        }));
    }

    /* Đơn vị — cây cha-con theo PARENT */
    ums.api.call({ action: 'NS_CoCauToChuc/LayDanhSach', method: 'GET', dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '', silent: true })
        .then(function (r) {
            var cay = Q.cay(Q.arr(r.data), { cha: 'PARENT', ten: 'TEN', thuTu: true, goc: 'root' });
            pat.fill(F('khoa'), cay.map(function (x) { return { ID: x.row.ID, TEN: Q.nhanCay(x.sau, e(x.row.TEN), '   ', '└ ') }; }));
        }).catch(function (err) { ums.api.handle(err, 'tải danh sách đơn vị'); });

    Q.napChieu().then(function (list) { m.chieu(list); })
        .catch(function (err) { m.loi('Không tải được danh sách chiều dữ liệu: ' + err.message); ums.api.handle(err, 'tải chiều dữ liệu'); });

    F('khoa').addEventListener('change', function () {
        khoaId = this.value;
        var so = ++luot;
        if (!khoaId) { dsNhanSu = []; m.nhac(NHAC, 'fa-building'); return; }
        m.dang('Đang tải danh sách nhân sự...');
        ums.ref.nhanSu({ strTuKhoa: '', pageIndex: 1, pageSize: 100000, strCoCauToChuc_Id: khoaId, dLaCanBoNgoaiTruong: 0 })
            .then(function (ds) {
                if (so !== luot) return;
                ds.forEach(function (x) { if (!x.HOTEN) x.HOTEN = (e(x.HODEM) + ' ' + e(x.TEN)).trim(); });
                dsNhanSu = ds;
                veLai();
            }).catch(function (err) {
                if (so !== luot) return;
                m.loi('Không tải được danh sách nhân sự: ' + err.message); ums.api.handle(err, 'tải danh sách nhân sự');
            });
    });

    /* Tự tìm khi gõ (500ms) và khi nhấn Enter — như gốc */
    var hen = 0;
    F('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(veLai, 500); });
    F('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(hen); veLai(); } });
})();
