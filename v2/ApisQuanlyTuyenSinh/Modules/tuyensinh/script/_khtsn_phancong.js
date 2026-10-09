/* =========================================================================
   ums.khtsn.moPhanCong(kh) — màn con "Phân công nhân sự" của một kế hoạch tuyển sinh (mở trong trang, thay chỗ gốc màn T.S.root)
   Bản gốc: modal #phan-cong-nhan-su + #them-moi-nhansu (Thêm: chọn nhiều nhân sự + thông tin gán chung)
            + #xem-sua-phancong (Xem - sửa một dòng)
   Khung chung: ums.khts.phanCong (bản A = Nhập học, bản B = tệp này).
   ---------------------------------------------------------------------------
   Lời gọi (TS_Core_KeHoach_MH / PKG_CORE_TS_KEHOACH — chép nguyên):
     Pr_Ts_Kh_Ns_PhanCong_Get_Ds     strTs_Kh_TuyenSinh_Id, strTs_Kh_TuyenSinh_Dot_Id '', strPerson_Id '',
                                     strRole_Code '', strAction_Code '', dIs_Active ''
     Pr_Ts_Kh_Ns_PhanCong_Get_By_Id  strId (trước khi Xem-sửa — cờ detail của khung chung)
     Pr_Ts_Kh_Ns_PhanCong_Ins        MỖI nhân sự đã tick MỘT lời gọi, cùng "thông tin gán chung"
     Pr_Ts_Kh_Ns_PhanCong_Upd / _Del
     Danh mục TS.KEHOACH.NHANSU.VAITRO (giá trị = MA)
     Hộp chọn nhân sự: ums.pat.pickNhanSu (pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2, mặc định cán bộ trong trường).
   Cố ý bỏ: nút "Thêm từng đơn vị" trong hộp chọn nhân sự (gốc thêm cả đơn vị bằng LayDSNhanSu_HoSo_v2
     theo strDaoTao_CoCauToChuc_Id) — hộp chung ums.pat.pickNhanSu chưa có (đang khoá) → nợ tầng chung.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, K = ums.khts, T = ums.khtsn;

    function nhanSu(d) { return (d.FULL_NAME || '') + (d.current_employee_code ? ' - ' + d.current_employee_code : ''); }
    function lay(d, a, b) { var v = d[a]; return v === undefined || v === null || v === '' ? (d[b] === undefined || d[b] === null ? '' : d[b]) : v; }

    T.moPhanCong = function (kh) {
        var khId = T.id(kh);
        T.dmMot(T.DM.VAITRO_PC).then(function (dsVaiTro) {
            K.phanCong(kh, {
                host: T.S.root,
                title: 'Phân công nhân sự', icon: 'fa-screen-users',
                tieuDe: function () { return T.tenKH(kh) || 'Phân công nhân sự'; },
                addText: 'Thêm mới',
                formTitle: 'phân công nhân sự',
                list: function () {
                    return T.goi(T.TS + 'ETMeFTIeCikeDzIeESkgLwIuLyYeBiQ1HgUy', T.PTS + 'Pr_Ts_Kh_Ns_PhanCong_Get_Ds', {
                        strTs_Kh_TuyenSinh_Id: khId, strTs_Kh_TuyenSinh_Dot_Id: '', strPerson_Id: '',
                        strRole_Code: '', strAction_Code: '', dIs_Active: ''
                    });
                },
                detail: function (row) {
                    return T.goi(T.TS + 'ETMeFTIeCikeDzIeESkgLwIuLyYeBiQ1HgM4Hggl', T.PTS + 'Pr_Ts_Kh_Ns_PhanCong_Get_By_Id', { strId: row.ID });
                },
                columns: [
                    { title: 'Nhân sự', render: function (d) { return T.rong(nhanSu(d)); } },
                    { title: 'Kế hoạch', render: function (d) { return T.rong(d.ts_kehoach_tuyensinh_ten || ''); } },
                    { title: 'Đợt', prop: 'ts_kehoach_tuyensinh_dot_ten' },
                    { title: 'Phương thức', prop: 'TS_PHUONGTHUC_TUYENSINH_Ten' },
                    { title: 'Vai trò tham gia', cls: 'is-center', prop: 'role_code_Name' },
                    { title: 'Quyền tham gia', cls: 'is-center', prop: 'action_code_Name' },
                    { title: 'Phạm vi phân công', cls: 'is-center', prop: 'scope_level_code_Name' },
                    { title: 'Ngày bắt đầu', cls: 'is-center is-nowrap', prop: 'ngay_batdau' },
                    { title: 'Ngày kết thúc', cls: 'is-center is-nowrap', prop: 'ngay_ketthuc' },
                    { title: 'Cho phép/Hạn chế', cls: 'is-center', render: function (d) { return K.co(d.is_allowed, 'bad'); } },
                    { title: 'Hiệu lực', cls: 'is-center', render: function (d) { return K.co(d.is_active, 'bad'); } },
                    { title: 'Người tạo', cls: 'is-nowrap', prop: 'NGUOITAO_TaiKhoan' },
                    { title: 'Ngày tạo', cls: 'is-center is-nowrap', prop: 'NgayTao_dd_mm_yyyy_hhmmss' }
                ],
                chiSua: ['_ns'],
                fields: [
                    { key: '_ns', label: 'Thông tin nhân sự', type: 'static', caDong: true, get: nhanSu },
                    { key: 'strRole_Code', label: 'Vai trò', type: 'select', placeholder: 'Chọn vai trò',
                      source: { items: dsVaiTro, id: 'MA', name: 'TEN' }, get: function (d) { return lay(d, 'role_code', 'ROLE_CODE'); } },
                    { key: 'strNgay_BatDau', label: 'Ngày bắt đầu', type: 'date', get: function (d) { return lay(d, 'ngay_batdau', 'NGAY_BATDAU'); } },
                    { key: 'strNgay_KetThuc', label: 'Ngày kết thúc', type: 'date', get: function (d) { return lay(d, 'ngay_ketthuc', 'NGAY_KETTHUC'); } },
                    { type: 'checks', span: true, items: [
                        { key: 'dIs_Allowed', label: 'Cho phép / Chặn', on: 1, off: 0, value: 1, get: function (d) { return lay(d, 'is_allowed', 'IS_ALLOWED') == 1 ? 1 : 0; } }, // eslint-disable-line eqeqeq
                        { key: 'dIs_Active', label: 'Còn hiệu lực', on: 1, off: 0, value: 1, get: function (d) { return lay(d, 'is_active', 'IS_ACTIVE') == 1 ? 1 : 0; } } // eslint-disable-line eqeqeq
                    ] },
                    { key: 'strGhiChu', label: 'Ghi chú', type: 'textarea', span: true, placeholder: 'Ghi chú áp dụng cho mọi nhân sự đã chọn...',
                      get: function (d) { return lay(d, 'GHICHU', 'ghichu'); } }
                ],
                them: function (ns, v) {
                    return T.goi(T.TS + 'ETMeFTIeCikeDzIeESkgLwIuLyYeCC8y', T.PTS + 'Pr_Ts_Kh_Ns_PhanCong_Ins', {
                        strPerson_Id: ns.ID, strTs_Kh_TuyenSinh_Id: khId, strTs_Kh_TuyenSinh_Dot_Id: '', strTs_Kh_Dot_PhuongThuc_Id: '',
                        strRole_Code: v.strRole_Code, strAction_Code: '', strScope_Level_Code: '',
                        strNgay_BatDau: v.strNgay_BatDau, strNgay_KetThuc: v.strNgay_KetThuc,
                        dIs_Allowed: v.dIs_Allowed, dIs_Active: v.dIs_Active, strGhiChu: v.strGhiChu
                    }, 'THEM');
                },
                sua: function (v, rec) {
                    return T.goi(T.TS + 'ETMeFTIeCikeDzIeESkgLwIuLyYeFDEl', T.PTS + 'Pr_Ts_Kh_Ns_PhanCong_Upd', {
                        strId: rec.ID, strPerson_Id: rec.person_id || rec.PERSON_ID || rec.ID_PERSON || '',
                        strTs_Kh_TuyenSinh_Id: khId, strTs_Kh_TuyenSinh_Dot_Id: '', strTs_Kh_Dot_PhuongThuc_Id: '',
                        strRole_Code: v.strRole_Code, strAction_Code: '', strScope_Level_Code: '',
                        strNgay_BatDau: v.strNgay_BatDau, strNgay_KetThuc: v.strNgay_KetThuc,
                        dIs_Allowed: v.dIs_Allowed, dIs_Active: v.dIs_Active, strGhiChu: v.strGhiChu
                    }, 'SUA');
                },
                xoa: function (rec) {
                    return T.goi(T.TS + 'ETMeFTIeCikeDzIeESkgLwIuLyYeBSQt', T.PTS + 'Pr_Ts_Kh_Ns_PhanCong_Del', { strId: rec.ID }, 'XOA');
                },
                xoaHoi: 'Bạn có chắc chắn xóa phân công này không?',
                chon: { title: 'Chọn nhân sự', okText: 'Xác nhận đã chọn', loaiCanBo: '0' }
            });
        });
    };
})();
