/* =========================================================================
   Quản trị quyền dữ liệu (M2) — quyền dữ liệu theo VAI TRÒ (Core_Role_Data_Scope).
   Bản gốc: ApisCMS/Modules/phanquyen/html/quantriquyendulieum2.html + script/quantriquyendulieum2.js
   Bố cục gốc MỘT cột: khối tiêu đề + dòng giới thiệu, lưới vai trò (cây cha-con) × chiều dữ liệu, không phân trang,
   dưới lưới "Tổng: N giá trị từ M chiều dữ liệu". Khung chung: script/_qtqdl.js.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, iM: 'Azz'):
     Vai trò   CMS_VaiTro/LayDanhSach (GET) { strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 }
               — cây theo CHUNG_VAITRO_CHA_ID từ gốc (cha rỗng), xếp THUTU rồi TENVAITRO; cột ID|VAITRO_ID, TENVAITRO|TEN.
               Nạp xong vai trò mới nạp chiều dữ liệu (như gốc).
     Đọc quyền PKG_CORE_QUANTRI_02.LayDSCore_D_Value_R_Data_Scope { strChucNang_Id, strRoleId, strDimensionId, strNguoiThucHien_Id }
               — khoá ID|SCOPE_ID|CORE_ROLE_DATA_SCOPE_ID|SCOPEID|COREROLEDATASCOPEID.
     Thêm      PKG_CORE_QUANTRI_02.Them_Core_Role_Data_Scope { strChucNang_Id, strRoleId, strDimensionId, strDimensionValueId,
               strScopeMode, strScopeKind, strFunctionId: '', dPriorityNo: 1, strEffectiveFrom: '', strEffectiveTo: '',
               strSourceType: 'MANUAL', strSourceRefId: '', strAssignedBy, strNote: '', strNguoiThucHien_Id }
     Xoá       PKG_CORE_QUANTRI_02.Xoa_Core_Role_Data_Scope { strId: <khoá quyền>, strChucNang_Id, strNguoiThucHien_Id }
               — nút "Xóa quyền đã chọn" ở hộp XEM KẾT QUẢ (hộp Thêm quyền không có nút xoá, như gốc).
   ---------------------------------------------------------------------------
   Giữ nguyên hành vi gốc (ghi ở can-quyet.js): vai trò có cha KHÔNG nằm trong danh sách (cha đã ngừng dùng…) không hiện
   trong lưới — gốc chỉ đi cây từ gốc; nếu cả cây rỗng thì hiện danh sách phẳng.
   Bỏ: thanh điều khiển (ô Chiều dữ liệu, ô từ khoá, nút Tìm kiếm, nút "Lưu phân quyền") — gốc ẩn cả thanh ngay khi nạp
   xong chiều (loadAllDimensionValues ẩn .search-bar-controls); nút "Lưu phân quyền" đọc các ô .chkPhanQuyen không còn
   tồn tại trong lưới nên luôn báo "Không có thay đổi để lưu". Dòng giới thiệu thứ ba "Chọn nhanh theo cột hoặc dòng" bỏ
   (lưới không còn ô đánh dấu). Lịch tháng ẩn, renderDimensionFilter / loadDimensionValues / checkPermission không nơi nào gọi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, Q = ums.qtqdl, e = Q.e, esc = ui.esc;
    var root = document.getElementById('qtqdl-quantriquyendulieum2');
    if (!root) return;

    function vtId(r) { return r.ID || r.VAITRO_ID; }

    var m = Q.man(root, {
        tieuDe: 'Quản trị quyền dữ liệu',
        moTa: '<div class="qtqdl-goiy">Phân quyền truy cập dữ liệu theo vai trò hệ thống<ul>' +
            '<li>Quản lý quyền truy cập theo <b data-z="sovt">0</b> vai trò hệ thống</li>' +
            '<li>Phân quyền theo hệ đào tạo, khóa, chương trình, lớp</li></ul></div>',
        bang: 'Vai trò', donVi: 'vai trò', demDau: false, doiTuong: 'vai trò', doiTuongHoa: 'Vai trò', icon: 'fa-user-shield',
        stt: false, phanTrang: 0, rong: 'Chưa có vai trò',
        id: vtId,
        ten: function (r) { return r.TENVAITRO || r.TEN || 'N/A'; },
        dau: function (r) {
            var d = r._sau || 0;
            return '<div class="qtqdl-cay ' + (d ? 'qtqdl-cay--con' : 'qtqdl-cay--goc') + '" style="--d:' + d + '">' +
                '<i class="fa-light ' + (d ? 'fa-user-shield' : 'fa-users') + '"></i><span>' + esc(r.TENVAITRO || 'N/A') + '</span></div>';
        },
        chan: function (S) {
            var n = S.chieu.reduce(function (a, c) { return a + c.data.length; }, 0);
            return '<b>Tổng: ' + n + ' giá trị</b> từ ' + S.chieu.length + ' chiều dữ liệu';
        },
        quyen: {
            tai: function (r, c) {
                return { action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUeFyAtNCQeEx4FIDUgHhIiLjEk',
                    func: 'PKG_CORE_QUANTRI_02.LayDSCore_D_Value_R_Data_Scope', iM: 'Azz',
                    strChucNang_Id: Q.cn(), strRoleId: vtId(r), strDimensionId: c.id, strNguoiThucHien_Id: Q.uid() };
            },
            map: function (it) {
                return [Q.valueIdCuaQuyen(it), it.ID || it.SCOPE_ID || it.CORE_ROLE_DATA_SCOPE_ID || it.SCOPEID || it.COREROLEDATASCOPEID];
            },
            them: function (r, c, ctx, v, mode, kind) {
                return { action: 'CMS_QuanTri02_MH/FSkkLB4CLjMkHhMuLSQeBSA1IB4SIi4xJAPP',
                    func: 'PKG_CORE_QUANTRI_02.Them_Core_Role_Data_Scope', iM: 'Azz',
                    strChucNang_Id: Q.cn(), strRoleId: vtId(r), strDimensionId: c.id, strDimensionValueId: v,
                    strScopeMode: mode, strScopeKind: kind, strFunctionId: '', dPriorityNo: 1,
                    strEffectiveFrom: '', strEffectiveTo: '', strSourceType: 'MANUAL', strSourceRefId: '',
                    strAssignedBy: Q.uid(), strNote: '', strNguoiThucHien_Id: Q.uid() };
            },
            xoaKQ: function (x) {
                return { action: 'CMS_QuanTri02_MH/GS4gHgIuMyQeEy4tJB4FIDUgHhIiLjEk',
                    func: 'PKG_CORE_QUANTRI_02.Xoa_Core_Role_Data_Scope', iM: 'Azz',
                    strId: x.scopeId, strChucNang_Id: Q.cn(), strNguoiThucHien_Id: Q.uid() };
            }
        }
    });
    m.dang('Đang tải dữ liệu...');

    ums.api.call({ action: 'CMS_VaiTro/LayDanhSach', method: 'GET', strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 })
        .then(function (r) {
            var raw = Q.arr(r.data);
            var cay = Q.cay(raw, { cha: 'CHUNG_VAITRO_CHA_ID', ten: 'TENVAITRO', thuTu: true, goc: 'root' });
            var ds = cay.length ? cay.map(function (x) { x.row._sau = x.sau; return x.row; })
                : raw.map(function (x) { x._sau = 0; return x; });            // gốc: cây rỗng thì dùng danh sách phẳng
            var so = root.querySelector('[data-z="sovt"]');
            if (so) so.textContent = ds.length;
            return Q.napChieu().then(function (list) { m.chieu(list); m.ve(ds); });
        })
        .catch(function (err) { m.loi(err.message); ums.api.handle(err, 'tải vai trò / chiều dữ liệu'); });
})();
