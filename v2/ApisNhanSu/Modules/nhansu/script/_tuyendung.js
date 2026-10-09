/* =========================================================================
   Tuyển dụng (NS_TD_*) — tiện ích chung của ba màn:
       nhansu/kehoach (dùng cả cho kehoach/kehoach — hai html gốc nạp CHÍNH
       modules/nhansu/script/kehoach.js), nhansu/dexuattuyendung.
   ums.nsTd = {
       AC, CH, P, PC            tiền tố action / package (chép nguyên từ .js gốc)
       srcNam()                 nguồn ô Năm — pkg_ns_td_chung.LayDSNam_NS_TD (tên NAM)
       srcDonVi()               nguồn ô Đơn vị — NS_CoCauToChuc/LayDanhSach GET (cha '', dTrangThai -1)
       keHoach(nam) · dot(khId) → Promise<dòng>  (LayDSNS_TD_KeHoach · LayDSNS_TD_KeHoach_Dot)
       deXuat(khId, dotId)      lời gọi LayDSNS_TD_KeHoach_DeXuat
       hoSo(khId, dotId, dxId)  lời gọi LayDSNS_TD_KeHoach_DeXuat_HS
       cotHoSo()                cột bảng "Hồ sơ ứng viên"
       tang(vùngGốc)            chồng vùng thay chỗ nhau — { push() → vùng mới, pop() }
       nut(kieu, id, tat)       nút "Chi tiết" trong ô bảng (tat = lý do khoá)
       fo(crud, khoá)           ô biểu mẫu của ums.crud theo khoá tham số
   }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var T = ums.nsTd = ums.nsTd || {};

    T.AC = 'NS_TD_ThongTin_MH/';
    T.CH = 'NS_TD_Chung_MH/';
    T.P = 'pkg_ns_td_thongtin.';
    T.PC = 'pkg_ns_td_chung.';

    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    T.arr = arr;

    T.srcNam = function () {
        return { call: { action: T.CH + 'DSA4BRIPICweDxIeFQUP', func: T.PC + 'LayDSNam_NS_TD' }, id: 'ID', name: 'NAM' };
    };
    T.srcDonVi = function () {
        return { call: { action: 'NS_CoCauToChuc/LayDanhSach', method: 'GET', strCoCauToChucCha_Id: '', dTrangThai: -1 }, id: 'ID', name: 'TEN' };
    };

    T.keHoach = function (nam) {
        return ums.api.call({ action: T.AC + 'DSA4BRIPEh4VBR4KJAkuICIp', func: T.P + 'LayDSNS_TD_KeHoach', silent: true,
            strTuKhoa: '', strNam: nam || '' }).then(function (r) { return arr(r.data); });
    };
    T.dot = function (khId) {
        return ums.api.call({ action: T.AC + 'DSA4BRIPEh4VBR4KJAkuICIpHgUuNQPP', func: T.P + 'LayDSNS_TD_KeHoach_Dot', silent: true,
            strTuKhoa: '', strNS_TD_KeHoach_Id: khId || '' }).then(function (r) { return arr(r.data); });
    };
    T.deXuat = function (khId, dotId) {
        return { action: T.AC + 'DSA4BRIPEh4VBR4KJAkuICIpHgUkGTQgNQPP', func: T.P + 'LayDSNS_TD_KeHoach_DeXuat',
            strTuKhoa: '', strNS_TD_KeHoach_Id: khId || '', strNS_TD_KeHoach_Dot_Id: dotId || '' };
    };
    T.hoSo = function (khId, dotId, dxId) {
        return { action: T.AC + 'DSA4BRIPEh4VBR4KJAkuICIpHgUkGTQgNR4JEgPP', func: T.P + 'LayDSNS_TD_KeHoach_DeXuat_HS',
            strNS_TD_KeHoach_Id: khId || '', strNS_TD_KeHoach_Dot_Id: dotId || '', strNS_TD_KeHoach_HD_Id: '',
            strNS_TD_KeHoach_DeXuat_Id: dxId || '' };
    };
    T.cotHoSo = function () {
        return [
            { title: 'Mã hồ sơ', prop: 'MAHOSO', cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'HODEM' },
            { title: 'Tên', prop: 'TEN' },
            { title: 'Vị trí tuyển dụng', prop: 'VITRICONGVIECDEXUAT_TEN' },
            { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center' },
            { title: 'CCCD', prop: 'CCCD', cls: 'is-center' },
            { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
            { title: 'Dân tộc', prop: 'DANTOC_TEN', cls: 'is-center' }
        ];
    };

    /* Nút "Chi tiết" trong ô bảng. tat = lý do khoá (bản gốc có nút mà không có xử lý). */
    T.nut = function (kieu, id, tat) {
        var a = { 'data-x': kieu, 'data-id': id };
        if (tat) { a.disabled = 'disabled'; a.title = tat; }
        return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: a });
    };

    T.fo = function (crud, k) {
        return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="form"][data-k="' + k + '"]');
    };

    /* Chồng vùng thay chỗ nhau (modal chồng modal của bản gốc → vùng trong trang). */
    T.tang = function (base) {
        var stack = [base];
        return {
            push: function () {
                var el = document.createElement('div');
                el.hidden = true;
                base.parentNode.appendChild(el);
                ui.swap(stack[stack.length - 1], el);
                stack.push(el);
                return el;
            },
            pop: function () {
                if (stack.length < 2) return;
                var el = stack.pop();
                ui.swap(el, stack[stack.length - 1]);
                if (el.parentNode) el.parentNode.removeChild(el);
            }
        };
    };
})();
