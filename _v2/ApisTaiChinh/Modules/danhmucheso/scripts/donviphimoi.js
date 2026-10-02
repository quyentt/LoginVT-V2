/* =========================================================================
   Đơn vị phí (theo chương trình) — lưới Chương trình × Thời gian
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/donviphimoi.js
   Khung lưới, hộp thoại, Khai nhanh: ums.dmhsA.dvp (cuối _chung_a.js).
   ---------------------------------------------------------------------------
   Lời gọi riêng của màn (chép nguyên từ bản gốc):
       TC_ThuChi/LayDSThoiGian_DonViPhi_SoTien        GET  cột thời gian (ID, THOIGIAN) — có strDaoTao_CoCauToChuc_Id
       TC_DonViPhi_SoTien/LayDSTaiChinh_CT_DonViPhi   GET  dòng = chương trình (khoá ô PHAMVIAPDUNG_ID)
       KHCT_ThongTin/LayDSNganhTheoKhoa               GET  bảng mã ngành cho cột "Mã ngành" (loadMap_MaNganh),
                                                           và danh sách ngành của Khai nhanh
       KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen        GET  hệ (A.dvp.heQuyen)
       KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen   GET  khoá — nạp một lần, lọc tại chỗ theo hệ
       pkg_kehoach_thongtin.LayDSKhoaQuanLy                khoa quản lý (ums.ref.khoaQuanLy)
       pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT        chương trình cho hộp thoại (ums.ref.chuongTrinh)
       TC_ThuChi2/KeThua_TaiChinh_DonViPhi_ST         POST Kế thừa — CÓ iM mà KHÔNG có func: bản gốc vẫn
                                                           mã hoá payload, nên ở đây truyền iM tường minh
       Import IMPORTWITHPROC_DVPST                         ums.report.importChung
   Thứ tự như bản gốc: chọn khoá → nạp cột thời gian → dòng → (mã ngành) → giá trị ô.

   Nghi ngờ, giữ nguyên:
     · Kế thừa: chọn Hệ/Khoá nguồn thì nạp "Thời gian" nguồn bằng
       LayDSThoiGian_DonViPhi_SoTien với giá trị BỘ LỌC CHÍNH (không phải hệ/khoá
       vừa chọn trong hộp thoại) — bản gốc getList_ThoiGian_DVP.
     · getList_KhoaDaoTao gửi ô khoá của Khai nhanh vào strDaoTao_KhoaQuanLy_Id.
     · Khai nhanh: danh sách khoa quản lý, hệ lấy chung lời gọi với bộ lọc chính
       (lúc mở màn), nên hệ không lọc theo khoa quản lý của Khai nhanh.
   Cố ý bỏ: btnCapNhatAll (không có trong HTML), getList_ThoiGian_DVP gán đè
   dtCot (không ảnh hưởng vì lưới luôn nạp lại cột trước khi vẽ), các hàm
   chết getList_LoaiKhoan/genComBo_HocPhan cho ô không tồn tại. Hộp thoại Kế
   thừa bản gốc đặt Khoản thu/Kiểu học/Hệ theo dropKhoanThu_HPST… (ô không
   tồn tại → trống); ở đây hộp mới mỗi lần mở nên cũng trống.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, A = ums.dmhsA, D = A.dvp;
    var root = document.getElementById('donviphimoi');

    var maNganh = null, maNganhKey = null;   // loadMap_MaNganh — nhớ theo khoá|khoa quản lý
    var ctDialog = [];                        // dropNew_ChuongTrinh

    /** getList_ThoiGian_DonViPhi_SoTien / getList_ThoiGian_DVP */
    function cotCall(f) {
        return {
            action: 'TC_ThuChi/LayDSThoiGian_DonViPhi_SoTien', method: 'GET',
            strDiem_KieuHoc_Id: f.kieuhoc,
            strDaoTao_CoCauToChuc_Id: f.kql,
            strDaoTao_ThoiGianDaoTao_Id: f.thoigian,
            strHeDaoTao_Id: f.he,
            strKhoaDaoTao_Id: f.khoa,
            strDonViTinh_Id: '',
            strTaiChinh_CacKhoanThu_Id: f.khoanthu,
            strNghiepVuApDung_Id: '',
            strNguoiThucHien_Id: ''
        };
    }

    function nganhCall(khoa, kql) {
        return {
            action: 'KHCT_ThongTin/LayDSNganhTheoKhoa', method: 'GET', type: 'GET',
            strDaoTao_KhoaDaoTao_Id: khoa, strDaoTao_CoCauToChuc_Id: kql, strNguoiThucHien_Id: ''
        };
    }

    /** loadMap_MaNganh: lỗi thì vẫn vẽ lưới với bảng rỗng */
    function loadMa(f) {
        var key = f.khoa + '|' + f.kql;
        if (maNganh && maNganhKey === key) return Promise.resolve();
        return ums.api.call(nganhCall(f.khoa, f.kql)).then(function (r) {
            var map = {};
            (Array.isArray(r.data) ? r.data : []).forEach(function (x) {
                if (x.ID) map[String(x.ID).toUpperCase()] = x.MA == null ? '' : x.MA;
            });
            maNganh = map; maNganhKey = key;
        }, function () { maNganh = {}; maNganhKey = key; });
    }

    /** getMaNganh_ByRow */
    function maCuaDong(r) {
        var ma = r.DAOTAO_TOCHUCCHUONGTRINH_MA || r.NGANHDAOTAO_MA || r.MA || '';
        if (!ma && maNganh) ma = maNganh[String(r.PHAMVIAPDUNG_ID || r.ID || '').toUpperCase()] || '';
        if (!ma) {
            var m = String(r.DAOTAO_TOCHUCCHUONGTRINH_TEN == null ? '' : r.DAOTAO_TOCHUCCHUONGTRINH_TEN).match(/^(.*)\(([^()]*)\)\s*$/);
            if (m && m[2] && m[1].trim() !== m[2].trim()) ma = m[2].trim();
        }
        return ma;
    }

    D.screen(root, {
        title: 'Đơn vị phí',
        filters: ['kql', 'he', 'khoa', 'khoanthu', 'thoigian', 'kieuhoc'],
        rowKey: 'PHAMVIAPDUNG_ID',
        rowName: 'chương trình',
        emptyMsg: 'Chọn hệ và khóa đào tạo để hiện lưới đơn vị phí',
        cols: [
            { title: 'Khoa quản lý', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Mã ngành', cls: 'is-nowrap', render: function (r) { return ui.esc(maCuaDong(r)); } },
            { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' }
        ],
        tools: [{ act: 'kethua', text: 'Kế thừa', icon: 'fa-copy', onClick: keThua }],
        filterTools: [{ act: 'import', text: 'Import đơn vị phí', icon: 'fa-cloud-arrow-up', onClick: importDVP }],
        load: function (f) {
            var out = {};
            return A.rows(cotCall(f)).then(function (cot) {
                out.cot = cot;
                // getList_ChuongTrinhDaoTao
                return A.rows({
                    action: 'TC_DonViPhi_SoTien/LayDSTaiChinh_CT_DonViPhi', method: 'GET', versionAPI: 'v1.0',
                    strDiem_KieuHoc_Id: f.kieuhoc,
                    strDaoTao_ThoiGianDaoTao_Id: f.thoigian,
                    strHeDaoTao_Id: f.he,
                    strKhoaDaoTao_Id: f.khoa,
                    strDonViTinh_Id: '',
                    strTaiChinh_CacKhoanThu_Id: f.khoanthu,
                    strNghiepVuApDung_Id: '',
                    strTuKhoa: '',
                    strNguoiThucHien_Id: ''
                });
            }).then(function (rows) {
                out.rows = rows;
                return loadMa(f);
            }).then(function () { return out; });
        },
        addGuard: function (f) { return !f.he || !f.khoa ? 'Hãy chọn Hệ - Khóa - Chương trình trước!' : ''; },
        dialog: {
            prefill: true,
            fields: [{
                k: 'pv', label: 'Chương trình', head: 'Chọn chương trình đào tạo', name: 'TENCHUONGTRINH',
                rows: function () { return ctDialog; },
                value: function (row) { return row.PHAMVIAPDUNG_ID; }
            }]
        },
        khaiNhanh: {
            title: 'Khai nhanh mức đơn vị phí cho chương trình',
            kql: true, themNhanh: true,
            cols: [
                { title: 'Khoa quản lý', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                { title: 'Mã ngành', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên ngành', prop: 'TEN' }
            ],
            // getList_NganhTheoKhoa — ô khoá chọn nhiều → "a,b" như getValById
            nganhCall: function (v) { return nganhCall(v.khoa, v.kql); }
        },
        init: function (c) {
            // getList_HeDaoTao → dropHeDaoTao_DVP + dropHeDaoTao_DVP_Edit
            D.heQuyen('').then(function (r) {
                A.fill(c.el.he, r, { name: 'TENHEDAOTAO', head: D.LABEL.he });
                A.fill(c.kn.el.he, r, { name: 'TENHEDAOTAO', head: D.LABEL.he });
            }).catch(c.fail('hệ đào tạo'));
            // getList_KhoaDaoTao("") — ô Khai nhanh lúc mở còn trống
            D.khoaOnce(c, function () { return D.khoaQuyen('', ''); });
            // edu.system.getList_KhoaQuanLy → dropKhoaQuanLy_DVP_Edit + dropKhoaQuanLy_DVP
            ums.ref.khoaQuanLy().then(function (r) {
                A.fill(c.el.kql, r, { head: D.LABEL.kql });
                A.fill(c.kn.el.kql, r, { head: D.LABEL.kql });
            }).catch(c.fail('khoa quản lý'));
            // Chọn khoá: nạp lưới + chương trình cho hộp thoại (getList_ChuongTrinhDaoTao_ComBo)
            A.onPick(c.el.khoa, function () {
                c.load();
                ums.ref.chuongTrinh({
                    strKhoaDaoTao_Id: A.val(c.main, 'khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                    strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
                }).then(function (r) { ctDialog = r; }).catch(c.fail('chương trình đào tạo'));
            });
        }
    });

    /* ---------- Kế thừa (myModalKeThua) ---------------------------------- */
    function keThua(c) {
        var S = c.S;
        var body =
            '<div class="ums-legend">Thông tin nguồn kế thừa</div>' +
            A.row('Hệ đào tạo', A.sel('he', { ph: 'Chọn hệ đào tạo' })) +
            A.row('Khóa đào tạo', A.sel('khoa', { ph: 'Chọn khóa đào tạo' })) +
            A.row('Khoản thu', A.sel('khoanthu', { ph: 'Chọn khoản thu' })) +
            A.row('Thời gian', A.sel('thoigian', { ph: 'Chọn thời gian' })) +
            A.row('Kiểu học', A.sel('kieuhoc', { ph: 'Chọn kiểu học' })) +
            '<div class="ums-legend">Thông tin đích cần kế thừa</div>' +
            A.row('Thời gian', A.sel('dich', { ph: 'Chọn học kỳ' }));

        var dlg = A.dialog({
            title: 'Kế thừa', icon: 'fa-copy', size: 'md', body: body,
            buttons: [{ text: 'Kế thừa', kind: 'save', onClick: function (d) { saveKeThua(d.body); } }]
        });
        var b = dlg.body;
        A.fill(A.k(b, 'khoanthu'), S.khoanThu, { head: 'Chọn khoản thu' });
        A.fill(A.k(b, 'kieuhoc'), S.kieuHoc, { head: 'Chọn kiểu học' });
        A.fill(A.k(b, 'dich'), S.thoiGian, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });
        // edu.extend.genBoLoc_HeKhoa("_KT")
        A.boLoc({ he: A.k(b, 'he'), khoa: A.k(b, 'khoa') });
        // getList_ThoiGian_DVP → dropThoiGianDaoTao_KT (dùng bộ lọc CHÍNH, như bản gốc)
        function tg() {
            A.rows(cotCall(c.f())).then(function (r) {
                A.fill(A.k(b, 'thoigian'), r, { name: 'THOIGIAN', head: 'Chọn thời gian' });
            }).catch(c.fail('thời gian kế thừa'));
        }
        A.onPick(A.k(b, 'he'), tg);
        A.onPick(A.k(b, 'khoa'), tg);
    }

    function saveKeThua(b) {
        ums.api.call({
            action: 'TC_ThuChi2/KeThua_TaiChinh_DonViPhi_ST',
            type: 'POST',
            strDaoTao_HeDaoTao_N_Id: A.val(b, 'he'),
            strDaoTao_KhoaDaoTao_N_Id: A.val(b, 'khoa'),
            strDaoTao_ThoiGian_N_Id: A.val(b, 'thoigian'),
            strTaiChinh_CacKhoanThu_N_Id: A.val(b, 'khoanthu'),
            strTaiChinh_KieuHoc_N_Id: A.val(b, 'kieuhoc'),
            strDaoTao_ThoiGian_D_Id: A.val(b, 'dich'),
            strNguoiThucHien_Id: '',
            iM: ums.session.iM                 // bản gốc truyền iM dù không có func → payload được mã hoá
        }).then(function () { ui.toast('Thực hiện thành công', 'ok'); })
            .catch(function (e) { ums.api.handle(e, 'kế thừa đơn vị phí'); });
    }

    /* ---------- Import (btnImportWithProce IMPORTWITHPROC_DVPST) ---------- */
    function importDVP(c) {
        var f = c.f();
        // Cấu hình tham số mẫu import trỏ vào id ô của màn CŨ → ánh xạ sang giá trị hiện tại
        ums.report.importChung('đơn vị phí', 'IMPORTWITHPROC_DVPST', {
            values: {
                dropKhoaQuanLy_DVP: f.kql, dropHeDaoTao_DVP: f.he, dropKhoaDaoTao_DVP: f.khoa,
                dropKhoanThu_DVP: f.khoanthu, dropThoiGianDaoTao_DVP: f.thoigian, dropKieuHoc_DVP: f.kieuhoc
            }
        });
    }

})();
