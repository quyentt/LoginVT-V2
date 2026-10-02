/* =========================================================================
   Quản trị quyền dữ liệu Cán bộ (M1) — quyền dữ liệu theo NHÂN SỰ × VAI TRÒ × CHỨC NĂNG (Core_U_R_F_Data_Scope).
   Bản gốc: ApisCMS/Modules/phanquyen/html/quantriquyendulieum1.html + script/quantriquyendulieum1.js
   Bố cục gốc MỘT cột: thanh lọc (Đơn vị chủ quản · Vai trò · Chức năng chọn nhiều) + lưới nhân sự × chiều dữ
   liệu, phân trang ở máy khách 20 dòng. Khung chung: script/_qtqdl.js.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, iM: 'Azz'):
     Đơn vị    PKG_CORE_HOSONHANSU_03.LayDSDonViTheoCore_Employment { strNguoiThucHien_Id } — cột ID|DONVI_ID|
               COCAUTOCHUC_ID|ORG_UNIT_ID, tên NAME|TEN|DONVI_TEN|COCAUTOCHUC_TEN|ORG_UNIT_NAME (+ " (CODE)"), xếp theo tên.
     Vai trò   CMS_VaiTro/LayDanhSach (GET) { strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 }
               — cây theo CHUNG_VAITRO_CHA_ID (cha không có trong danh sách thì là gốc), xếp TENVAITRO.
     Chức năng PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro { strUngDung_Id: edu.system.appId (= vai trò ĐANG ĐĂNG NHẬP),
               strVaiTro_Id: <vai trò chọn>, strNguoiThucHien_Id } — cây theo CHUCNANGCHA_ID, xếp THUTU rồi TENCHUCNANG.
     Nhân sự   có lọc vai trò / chức năng: PKG_CORE_QUANTRI_02.Pr_Core_Person_Get_By_R_F_Emp — MỖI tổ hợp vai trò × chức năng
               một lời gọi { strVaiTro_Id, strChucNang_Id: <chức năng | ''>, strDonVi_Id, strNguoiThucHien_Id,
               strVaiTroDangNhap_Id: '', strChucNangHeThong_Id, strHanhDong_Code: 'XEM' }, gộp bỏ trùng theo
               ID|PERSON_ID|CORE_PERSON_ID|NHANSU_ID|USER_ID;
               không lọc: PKG_CORE_HOSONHANSU_03.LayDSNhanSuTheoCore_Employment { strOrg_Unit_Id, strNguoiThucHien_Id }.
               Cột: ID|NHANSU_ID|PERSON_ID, FULL_NAME|HOTEN|TEN, CURRENT_EMPLOYEE_CODE|MASO|MA, DAOTAO_COCAUTOCHUC_TEN|ORG_NAME.
               Nạp xong nhân sự mới nạp lại chiều dữ liệu (như gốc).
     Đọc quyền PKG_CORE_QUANTRI_02.LayDSCore_D_V_URF_Data_Scope { strCore_Person_Id, strCore_Role_Id, strChucNang_Id: <chức năng
               ĐẦU TIÊN đang chọn | ''>, strCore_Data_Dimension_Id, strNguoiThucHien_Id, strVaiTroDangNhap_Id: '',
               strChucNangHeThong_Id, strHanhDong_Code: 'XEM' } — có cột giá trị là coi như đã gán (không cần khoá).
     Thêm      PKG_CORE_QUANTRI_02.Pr_Core_U_R_F_Data_Scope_In { strUser_Id, strRole_Id, strFunction_Id, strDimension_Id,
               strDimension_Value_Id, strResource_Id: '', strScope_Mode, strScope_Kind, dIs_Allowed: 1, dPriority_No: 100,
               strEffective_From: '', strEffective_To: '', dIs_Active: 1, dIs_Current: 1, strSource_Type: 'MANUAL',
               strSource_Ref_Id: '', strNote: '', strNguoiThucHien_Id, strVaiTroDangNhap_Id: '', strChucNangHeThong_Id,
               strHanhDong_Code: 'THEM' }
     Xoá       PKG_CORE_QUANTRI_02.Pr_Co_U_R_F_Da_Sc_De_By_URFDV { strUser_Id, strRole_Id, strFunction_Id, strDimension_Id,
               strDimension_Value_Id, strNguoiThucHien_Id, strVaiTroDangNhap_Id: '', strChucNangHeThong_Id, strHanhDong_Code: 'XOA' }
               — nút "Xóa quyền đã chọn" ở hộp XEM KẾT QUẢ (hộp Thêm quyền của màn này không có nút xoá, như gốc).
     Vai trò / chức năng gửi đi = vai trò đang chọn và chức năng ĐẦU TIÊN đang chọn, chụp lúc mở hộp (như gốc).
   ---------------------------------------------------------------------------
   Giữ nguyên hành vi gốc (ghi ở can-quyet.js — kiểm trên host):
     · Tham số chức năng rỗng ('') bị makeRequest (và ums.api) thay bằng CHỨC NĂNG ĐANG MỞ (màn này) — Pr_Core_Person_…,
       LayDSCore_D_V_URF_… gửi strChucNang_Id = id màn quản trị khi chưa chọn chức năng.
     · strVaiTroDangNhap_Id: '' (gốc đọc edu.system.strVaiTro_Id — không tồn tại) → được điền vai trò đang đăng nhập.
   Khác gốc: Vai trò → Chức năng khoá theo luật cha → con; bỏ Đơn vị thì xoá trắng Vai trò + Chức năng (gốc xoá Vai trò
   nhưng giữ Chức năng cũ vẫn lọc). Chọn Vai trò khi chưa có Đơn vị: báo "Vui lòng chọn Đơn vị trước" như gốc.
   Bỏ: ô "Quyền" và "Vai trò (LIST)" (display:none ở gốc — giá trị luôn rỗng) cùng lời gọi LayDSCore_Permission chỉ để đổ ô
   ẩn đó; getList_NhanSuTheoVaiTro / getList_NhanSuByIds (LayDSCore_User_Role_Scope) không nơi nào gọi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, Q = ums.qtqdl, e = Q.e, esc = ui.esc, $ = window.jQuery;
    var root = document.getElementById('qtqdl-quantriquyendulieum1');
    if (!root) return;

    var luot = 0;
    function nsId(r) { return r.ID || r.NHANSU_ID || r.PERSON_ID || ''; }
    function nsTen(r) { return r.FULL_NAME || r.HOTEN || r.TEN || 'N/A'; }

    var m = Q.man(root, {
        tieuDe: 'Quản trị quyền dữ liệu Cán bộ',
        loc: [{ key: 'dv', type: 'select', label: 'Chọn Đơn vị theo Đơn vị chủ quản' },
              { key: 'vt', type: 'select', label: 'Chọn Vai trò' },
              { key: 'cn', type: 'select', multiple: true, label: 'Chọn chức năng' }],
        bang: 'Nhân sự', donVi: 'người', doiTuong: 'nhân sự', doiTuongHoa: 'Nhân sự', icon: 'fa-user',
        stt: true, phanTrang: 20, rong: 'Không tìm thấy nhân sự — Đơn vị này chưa có nhân sự hoặc dữ liệu chưa được cập nhật',
        id: nsId, ten: nsTen,
        dau: function (r) {
            var ma = r.CURRENT_EMPLOYEE_CODE || r.MASO || r.MA || '', dv = r.DAOTAO_COCAUTOCHUC_TEN || r.ORG_NAME || '';
            return '<div class="qtqdl-ns"><i class="fa-light fa-user"></i><div>' +
                '<div class="qtqdl-ns__ten">' + esc(nsTen(r)) + '</div>' +
                (ma ? '<div class="qtqdl-ns__sub">Mã: ' + esc(ma) + '</div>' : '') +
                (dv ? '<div class="qtqdl-ns__sub">' + esc(dv) + '</div>' : '') + '</div></div>';
        },
        boiCanh: function () { return { role: F('vt').value || '', func: ($(F('cn')).val() || [])[0] || '' }; },
        quyen: {
            tai: function (r, c, ctx) {
                return { action: 'CMS_QuanTri02_MH/DSA4BRICLjMkHgUeFx4UEwceBSA1IB4SIi4xJAPP',
                    func: 'PKG_CORE_QUANTRI_02.LayDSCore_D_V_URF_Data_Scope', iM: 'Azz',
                    strCore_Person_Id: nsId(r), strCore_Role_Id: ctx.role, strChucNang_Id: ctx.func,
                    strCore_Data_Dimension_Id: c.id, strNguoiThucHien_Id: Q.uid(),
                    strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: Q.cn(), strHanhDong_Code: 'XEM' };
            },
            // API không trả khoá quyền → có cột giá trị là coi như đã gán (gốc: "|| true")
            map: function (it) {
                return [Q.valueIdCuaQuyen(it), it.ID || it.SCOPE_ID || it.CORE_USER_DATA_SCOPE_ID || it.SCOPEID || it.COREUSERDATASCOPEID || true];
            },
            trungMoRong: true,
            them: function (r, c, ctx, v, mode, kind) {
                return { action: 'CMS_QuanTri02_MH/ETMeAi4zJB4UHhMeBx4FIDUgHhIiLjEkHggv',
                    func: 'PKG_CORE_QUANTRI_02.Pr_Core_U_R_F_Data_Scope_In', iM: 'Azz',
                    strUser_Id: nsId(r), strRole_Id: ctx.role, strFunction_Id: ctx.func, strDimension_Id: c.id,
                    strDimension_Value_Id: v, strResource_Id: '', strScope_Mode: mode, strScope_Kind: kind,
                    dIs_Allowed: 1, dPriority_No: 100, strEffective_From: '', strEffective_To: '',
                    dIs_Active: 1, dIs_Current: 1, strSource_Type: 'MANUAL', strSource_Ref_Id: '', strNote: '',
                    strNguoiThucHien_Id: Q.uid(), strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: Q.cn(), strHanhDong_Code: 'THEM' };
            },
            xoaKQ: function (x, r, c, ctx) {
                return { action: 'CMS_QuanTri02_MH/ETMeAi4eFB4THgceBSAeEiIeBSQeAzgeFBMHBRcP',
                    func: 'PKG_CORE_QUANTRI_02.Pr_Co_U_R_F_Da_Sc_De_By_URFDV', iM: 'Azz',
                    strUser_Id: nsId(r) || '', strRole_Id: ctx.role || '', strFunction_Id: ctx.func || '',
                    strDimension_Id: c.id || '', strDimension_Value_Id: x.valueId || '',
                    strNguoiThucHien_Id: Q.uid(), strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: Q.cn(), strHanhDong_Code: 'XOA' };
            }
        }
    });
    function F(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var NHAC = 'Vui lòng chọn Đơn vị để bắt đầu';
    m.nhac(NHAC, 'fa-building');

    /* ---------- Nguồn ô chọn ---------- */
    ums.api.call({ action: 'NS_HoSoNhanSu3_MH/DSA4BRIFLi8XKBUpJC4CLjMkHgQsMS0uOCwkLzUP',
        func: 'PKG_CORE_HOSONHANSU_03.LayDSDonViTheoCore_Employment', iM: 'Azz', strNguoiThucHien_Id: Q.uid(), method: 'GET', silent: true })
        .then(function (r) {
            function ten(d) { return d.NAME || d.TEN || d.DONVI_TEN || d.COCAUTOCHUC_TEN || d.ORG_UNIT_NAME || ''; }
            var ds = Q.arr(r.data).slice().sort(function (a, b) { return ten(a).localeCompare(ten(b), 'vi'); });
            pat.fill(F('dv'), ds.map(function (d) {
                return { ID: d.ID || d.DONVI_ID || d.COCAUTOCHUC_ID || d.ORG_UNIT_ID, TEN: ten(d) + (d.CODE ? ' (' + d.CODE + ')' : '') };
            }));
        }).catch(function (err) { ums.api.handle(err, 'tải danh sách đơn vị'); });

    ums.api.call({ action: 'CMS_VaiTro/LayDanhSach', method: 'GET', strLoaiVaiTro_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1, silent: true })
        .then(function (r) {
            var cay = Q.cay(Q.arr(r.data), { cha: 'CHUNG_VAITRO_CHA_ID', ten: 'TENVAITRO', goc: 'mo' });
            pat.fill(F('vt'), cay.map(function (x) { return { ID: x.row.ID, TEN: Q.nhanCay(x.sau, e(x.row.TENVAITRO), '    ', '└─ ') }; }));
        }).catch(function (err) { ums.api.handle(err, 'tải danh sách vai trò'); });

    function napChucNang(vt) {
        if (!vt) { pat.fill(F('cn'), []); return; }
        ums.api.call({ action: 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJhUpJC4UBRcgKBUzLgPP',
            func: 'PKG_CORE_QUANTRI_01.LayDSChucNangTheoUDVaiTro', iM: 'Azz',
            strUngDung_Id: Q.appId(), strVaiTro_Id: vt, strNguoiThucHien_Id: Q.uid(), silent: true })
            .then(function (r) {
                if (F('vt').value !== vt) return;
                var cay = Q.cay(Q.arr(r.data), { cha: 'CHUCNANGCHA_ID', ten: 'TENCHUCNANG', thuTu: true, goc: 'mo' });
                pat.fill(F('cn'), cay.map(function (x) { return { ID: x.row.ID, TEN: Q.nhanCay(x.sau, e(x.row.TENCHUCNANG), '    ', '└─ ') }; }));
            }, function () { pat.fill(F('cn'), []); });
    }

    /* ---------- Nhân sự theo bộ lọc, rồi chiều dữ liệu ---------- */
    function taiNhanSu() {
        var so = ++luot, dv = F('dv').value;
        if (!dv) { ui.toast('Vui lòng chọn Đơn vị trước', 'warn'); m.nhac(NHAC, 'fa-building'); return; }
        var vt = F('vt').value, cns = $(F('cn')).val() || [];
        m.dang('Đang tải danh sách nhân sự...');
        var p;
        if (vt || cns.length) {
            var roleIds = vt ? [vt] : [''], funcIds = cns.length ? cns.slice() : [''], goi = [];
            roleIds.forEach(function (ro) {
                funcIds.forEach(function (fu) {
                    goi.push(ums.api.call({ action: 'CMS_QuanTri02_MH/ETMeAi4zJB4RJDMyLi8eBiQ1HgM4HhMeBx4ELDEP',
                        func: 'PKG_CORE_QUANTRI_02.Pr_Core_Person_Get_By_R_F_Emp', iM: 'Azz',
                        strVaiTro_Id: ro || '', strChucNang_Id: fu || '', strDonVi_Id: dv || '',
                        strNguoiThucHien_Id: Q.uid(), strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: Q.cn(),
                        strHanhDong_Code: 'XEM', silent: true })
                        .then(function (r) { return Q.arr(r.data); }, function () { return []; }));
                });
            });
            p = Promise.all(goi).then(function (ks) {
                var gop = {}, ds = [];
                ks.forEach(function (a) {
                    a.forEach(function (u) {
                        var id = u.ID || u.PERSON_ID || u.CORE_PERSON_ID || u.NHANSU_ID || u.USER_ID;
                        if (id && !gop[id]) { gop[id] = true; ds.push(u); }
                    });
                });
                return ds;
            });
        } else {
            p = ums.api.call({ action: 'NS_HoSoNhanSu3_MH/DSA4BRIPKSAvEjQVKSQuAi4zJB4ELDEtLjgsJC81',
                func: 'PKG_CORE_HOSONHANSU_03.LayDSNhanSuTheoCore_Employment', iM: 'Azz',
                strOrg_Unit_Id: dv, strNguoiThucHien_Id: Q.uid() })
                .then(function (r) { return Q.arr(r.data); });
        }
        p.then(function (ds) {
            if (so !== luot) return null;
            return Q.napChieu().then(function (list) {
                if (so !== luot) return;
                m.chieu(list); m.ve(ds);
            });
        }).catch(function (err) {
            if (so !== luot) return;
            m.loi(err.message); ums.api.handle(err, 'tải danh sách nhân sự');
        });
    }

    /* ---------- Sự kiện ---------- */
    F('dv').addEventListener('change', function () {
        if (this.value) { taiNhanSu(); return; }
        ++luot;
        $(F('vt')).val('').trigger('change.select2').trigger('ums:refresh');
        pat.fill(F('cn'), []);
        $(F('cn')).val([]).trigger('change.select2').trigger('ums:refresh');
        m.nhac(NHAC, 'fa-building');
    });
    F('vt').addEventListener('change', function () {
        $(F('cn')).val([]).trigger('change.select2').trigger('ums:refresh');
        napChucNang(this.value);
        taiNhanSu();
    });
    F('cn').addEventListener('change', function () { taiNhanSu(); });
    // Vai trò → Chức năng: chưa chọn vai trò thì khoá chức năng (luật cha → con); đã tự nghe 'change'
    pat.chain([F('vt'), F('cn')], { phatLai: false });
})();
