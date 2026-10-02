/* =========================================================================
   Đề xuất tuyển dụng
   Bản gốc: ApisNhanSu/Modules/nhansu/html/dexuattuyendung.html + script/dexuattuyendung.js (vỏ index)
   (script/dexuatuyendung.js — thiếu chữ "t" — là bản chép cũ, KHÔNG html nào nạp → không chuyển.)
   ---------------------------------------------------------------------------
   Bố cục gốc: MỘT cột — thanh lọc Năm · Kế hoạch · Các đợt trong kế hoạch + bảng đề xuất; modal Thêm/Sửa
   đề xuất; modal "Danh sách ứng viên đề xuất" (Thêm/Sửa/Xoá hồ sơ) chồng modal Thêm/Sửa hồ sơ.
   Ở đây: biểu mẫu thay chỗ danh sách (ums.crud); danh sách ứng viên là VÙNG THAY CHỖ (ums.nsTd.tang).
   Lời gọi (NS_TD_ThongTin_MH, mã hoá, chép nguyên):
       LayDSNS_TD_KeHoach_DeXuat  strTuKhoa '' · strNS_TD_KeHoach_Id (ô Kế hoạch) · strNS_TD_KeHoach_Dot_Id (ô Đợt)
       Them_/Sua_NS_TD_KeHoach_DeXuat  strId · strNS_TD_KeHoach_Dot_Id (ô ĐỢT của thanh lọc) · strDonViDeXuat_Id
            · strNguoiDeXuat_Id = userId · strViTriCongViecDeXuat_Id · dSoLuongDeXuat (trống thì không gửi) · strMoTa
       Xoa_NS_TD_KeHoach_DeXuat  strId
       LayDSNS_TD_KeHoach_DeXuat_HS  strNS_TD_KeHoach_Id '' · strNS_TD_KeHoach_Dot_Id '' · strNS_TD_KeHoach_HD_Id ''
            · strNS_TD_KeHoach_DeXuat_Id
       Them_/Sua_NS_TD_KeHoach_DeXuat_HS  strId · strNS_TD_KeHoach_DeXuat_Id · strHoDem · strTen · strMaHoSo ''
            · strCCCD · strCCCD_NgayCap · strCCCD_NoiCap · strGioiTinh_Id · strNgaySinh_Ngay/_Thang/_Nam (tách
            dd/mm/yyyy) · strDanhGia_Id '' · strDanToc_Id · strNhanSu_HoSoCanBo_V2_Id ''
       Bộ lọc: LayDSNam_NS_TD → LayDSNS_TD_KeHoach (strNam) → LayDSNS_TD_KeHoach_Dot (tên NS_TD_KEHOACH_TEN)
       Danh mục: NS.TD.VITRICONGVIEC, NS.GITI, NS.DATO; đơn vị NS_CoCauToChuc/LayDanhSach GET.
   Nối tầng Năm → Kế hoạch → Đợt (ums.pat.chain). selectOne của gốc: danh sách chỉ một mục thì chọn sẵn.
   Khác gốc:
     · Xoá HỒ SƠ ỨNG VIÊN: gốc gọi Xoa_NS_TD_KeHoach_DeXuat (xoá nhầm cả ĐỀ XUẤT theo id hồ sơ)
       → Xoa_NS_TD_KeHoach_DeXuat_HS (mã hoá theo đúng quy tắc tên, chưa từng gọi ở gốc — kiểm trên host).
     · "Thêm" hồ sơ của gốc xoá nhầm ô của màn khác (txtDTD_*) nên biểu mẫu còn dữ liệu cũ → biểu mẫu trắng.
     · Lưu đề xuất khi CHƯA chọn đợt ở thanh lọc: gốc vẫn gửi strNS_TD_KeHoach_Dot_Id rỗng (kể cả khi SỬA —
       đợt của đề xuất bị ghi thành rỗng) → nay báo chọn đợt trước.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.nsTd;
    var root = document.getElementById('ns-dexuattuyendung');
    if (!root) return;
    var AC = T.AC, P = T.P;

    root.innerHTML = '<div data-z="dx"></div>';
    var zDx = root.querySelector('[data-z="dx"]');
    var tang = T.tang(zDx);

    var dx = ums.crud({
        root: zDx, title: 'Đề xuất tuyển dụng', listTitle: 'Đề xuất tuyển dụng', formTitle: 'đề xuất', icon: 'fa-file-circle-plus', formCols: 1, rowDelete: false, formDelete: false,   // gốc: chỉ ô đánh dấu + Xóa
        filters: [
            { key: 'nam', type: 'select', label: 'Chọn Năm', source: T.srcNam() },
            { key: 'kh', type: 'select', label: 'Chọn kế hoạch' },
            { key: 'dot', type: 'select', label: 'Chọn đợt' }
        ],
        list: { call: function (f) { return T.deXuat(f.kh, f.dot); } },
        columns: [
            { title: 'Vị trí công việc', prop: 'VITRICONGVIECDEXUAT_TEN' },
            { title: 'Số lượng đề xuất', prop: 'SOLUONGDEXUAT', cls: 'is-center' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Người nhập đề xuất', prop: 'NGUOIDEXUAT_TAIKHOAN', cls: 'is-center' },
            { title: 'Đơn vị đề xuất', prop: 'DONVIDEXUAT_TEN', cls: 'is-center' },
            { title: 'Danh sách ứng viên đề xuất', cls: 'is-center is-nowrap', render: function (r) { return T.nut('hs', r.ID); } }
        ],
        fields: [
            { key: 'strDonViDeXuat_Id', col: 'DONVIDEXUAT_ID', label: 'Đơn vị', type: 'select', placeholder: 'Chọn đơn vị', source: T.srcDonVi() },
            { key: 'strViTriCongViecDeXuat_Id', col: 'VITRICONGVIECDEXUAT_ID', label: 'Vị trí công việc', type: 'select', source: { dm: 'NS.TD.VITRICONGVIEC' } },
            { key: 'dSoLuongDeXuat', col: 'SOLUONGDEXUAT', label: 'Số lượng đề xuất', type: 'number' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        save: function (v, row, c) {
            var dot = c.filterValues().dot;
            if (!dot) { ui.toast('Vui lòng chọn "Các đợt trong kế hoạch" ở thanh lọc trước khi lưu đề xuất', 'warn'); return null; }
            var o = {
                action: AC + (row ? 'EjQgHg8SHhUFHgokCS4gIikeBSQZNCA1' : 'FSkkLB4PEh4VBR4KJAkuICIpHgUkGTQgNQPP'),
                func: P + (row ? 'Sua_NS_TD_KeHoach_DeXuat' : 'Them_NS_TD_KeHoach_DeXuat'),
                strId: row ? row.ID : '', strNS_TD_KeHoach_Dot_Id: dot, strDonViDeXuat_Id: v.strDonViDeXuat_Id,
                strNguoiDeXuat_Id: ums.session.userId, strViTriCongViecDeXuat_Id: v.strViTriCongViecDeXuat_Id, strMoTa: v.strMoTa
            };
            if (v.dSoLuongDeXuat) o.dSoLuongDeXuat = v.dSoLuongDeXuat;   // gốc: trống → undefined (không gửi)
            return o;
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: AC + 'GS4gHg8SHhUFHgokCS4gIikeBSQZNCA1', func: P + 'Xoa_NS_TD_KeHoach_DeXuat', strId: id }; });
        }
    });

    /* ---------- Bộ lọc Năm → Kế hoạch → Đợt ---------------------------------- */
    function fl(k) { return zDx.querySelector('[data-cf="' + dx.uid + '"][data-scope="filter"][data-k="' + k + '"]'); }
    var fNam = fl('nam'), fKh = fl('kh'), fDot = fl('dot');
    function mot(el, ds) {
        // selectOne của loadToCombo_data: chỉ một mục thì chọn sẵn
        if (ds.length === 1) { el.value = ds[0].ID; jQuery(el).trigger('change.select2').trigger('ums:refresh'); return true; }
        return false;
    }
    function napDot() {
        if (!fKh.value) { pat.fill(fDot, []); return; }
        T.dot(fKh.value).then(function (ds) {
            pat.fill(fDot, ds, { name: 'NS_TD_KEHOACH_TEN' });
            if (mot(fDot, ds)) dx.load(1);
        }).catch(function (err) { ums.api.handle(err, 'đợt tuyển dụng'); });
    }
    function napKh() {
        if (!fNam.value) { pat.fill(fKh, []); pat.fill(fDot, []); return; }
        T.keHoach(fNam.value).then(function (ds) {
            pat.fill(fKh, ds);
            if (mot(fKh, ds)) napDot();
        }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }
    if (window.jQuery) {
        jQuery(fNam).on('select2:select select2:clear', napKh);
        jQuery(fKh).on('select2:select select2:clear', napDot);
        pat.chain([fNam, fKh, fDot], { phatLai: false });
    }

    /* ---------- Danh sách ứng viên đề xuất ------------------------------------ */
    zDx.addEventListener('click', function (e) {
        var b = e.target.closest('[data-x="hs"]');
        if (!b || !zDx.contains(b)) return;
        var r = (dx.rows || []).filter(function (x) { return x.ID === b.getAttribute('data-id'); })[0];
        if (r) moHoSo(r);
    });

    function tach(s) { return s && s.indexOf('/') !== -1 ? s.split('/') : []; }

    function moHoSo(d) {
        var el = tang.push();
        ums.crud({
            root: el, embedded: true, back: tang.pop, formCols: 1, icon: 'fa-id-card', rowDelete: false, formDelete: false,
            title: 'Danh sách ứng viên đề xuất — ' + (d.VITRICONGVIECDEXUAT_TEN || '') + (d.DONVIDEXUAT_TEN ? ' · ' + d.DONVIDEXUAT_TEN : ''),
            formTitle: 'hồ sơ đề xuất',
            list: { call: function () { return T.hoSo('', '', d.ID); } },
            columns: T.cotHoSo(),
            fields: [
                { key: '_maHoSo', col: 'MAHOSO', label: 'Mã hồ sơ', type: 'static' },
                { key: 'strHoDem', col: 'HODEM', label: 'Họ đệm' },
                { key: 'strTen', col: 'TEN', label: 'Tên' },
                { key: '_ngaySinh', col: 'NGAYSINH', label: 'Ngày sinh', type: 'date' },
                { key: 'strGioiTinh_Id', col: 'GIOITINH_ID', label: 'Giới tính', type: 'select', source: { dm: 'NS.GITI' } },
                { key: 'strDanToc_Id', col: 'DANTOC_ID', label: 'Dân tộc', type: 'select', source: { dm: 'NS.DATO' } },
                { key: 'strCCCD', col: 'CCCD', label: 'CCCD' },
                { key: 'strCCCD_NgayCap', col: 'CCCD_NGAYCAP', label: 'CCCD ngày cấp', type: 'date' },
                { key: 'strCCCD_NoiCap', col: 'CCCD_NOICAP', label: 'CCCD nơi cấp' }
            ],
            save: function (v, row) {
                var ns = tach(v._ngaySinh);
                return {
                    action: AC + (row ? 'EjQgHg8SHhUFHgokCS4gIikeBSQZNCA1HgkS' : 'FSkkLB4PEh4VBR4KJAkuICIpHgUkGTQgNR4JEgPP'),
                    func: P + (row ? 'Sua_NS_TD_KeHoach_DeXuat_HS' : 'Them_NS_TD_KeHoach_DeXuat_HS'),
                    strId: row ? row.ID : '', strNS_TD_KeHoach_DeXuat_Id: d.ID,
                    strHoDem: v.strHoDem, strTen: v.strTen, strMaHoSo: '',
                    strCCCD: v.strCCCD, strCCCD_NgayCap: v.strCCCD_NgayCap, strCCCD_NoiCap: v.strCCCD_NoiCap,
                    strGioiTinh_Id: v.strGioiTinh_Id,
                    strNgaySinh_Ngay: ns[0], strNgaySinh_Thang: ns[1], strNgaySinh_Nam: ns[2],
                    strDanhGia_Id: '', strDanToc_Id: v.strDanToc_Id, strNhanSu_HoSoCanBo_V2_Id: ''
                };
            },
            remove: function (ids) {
                // Gốc gọi Xoa_NS_TD_KeHoach_DeXuat (xoá nhầm đề xuất) — nay xoá đúng HỒ SƠ
                return ids.map(function (id) { return { action: AC + 'GS4gHg8SHhUFHgokCS4gIikeBSQZNCA1HgkS', func: P + 'Xoa_NS_TD_KeHoach_DeXuat_HS', strId: id }; });
            }
        });
    }
})();
