/* =========================================================================
   Nhập học — module Phân lớp: phần dùng chung của ba màn
       phanlop · chuyenlopnhaphoc · hosotuyensinh
   ---------------------------------------------------------------------------
   ums.nhPhanLop = {
       e(v)                       chuỗi rỗng khi null/undefined (edu.util.returnEmpty)
       rows(call) → Promise<mảng> gọi API, lấy mảng dòng (không hiện vòng quay)
       keHoachNhapHoc()           PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (phanlop, chuyenlopnhaphoc —
                                  hai bản gốc cùng gọi y hệt, strNguoiThucHien_Id = người đăng nhập) → TENKEHOACH
       lopQuanLy(o)               edu.system.getList_LopQuanLy bản Corei (Corei/systemroot.js:4080) — có thêm
                                  strDaoTao_KhoaQuanLy_Id mà ums.ref.lopQuanLy chưa có
       cotChon(k) / ganChon(host, k) / chon(host, k)
                                  cột ô đánh dấu CUỐI bảng + ô "chọn tất cả" trên tiêu đề (chkSelectAll /
                                  checkedAll_BgRow của gốc) · đọc id các dòng đã đánh dấu
       drop(text, icon, items) / batDrop(nút) / dongDrop(el)
                                  nút thả xuống tự dựng (Import ▾ viết cứng trong html gốc) — cùng khung
                                  .ums-drop với ums.report
       guiEmailDanhMuc(aData, email, maDM)
                                  edu.system.reportDanhMuc (Corei/systemroot.js:6992) — gửi thư theo danh mục
                                  (vd NH.GNH = giấy nhập học) qua báo cáo DANHMUC_DON
   }
   Nợ tầng chung (ghi báo cáo): cột ô đánh dấu + "chọn tất cả" cho ums.ui.table (bản tự viết thứ n);
   reportDanhMuc chưa có ở ums.report; nút thả xuống tự dựng (bản thứ tư).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, esc = ui.esc;
    var P = {};

    P.e = function (v) { return v === undefined || v === null ? '' : String(v); };

    P.rows = function (call) {
        call.silent = true;
        return ums.api.call(call).then(function (r) {
            var d = r.data;
            return Array.isArray(d) ? d : (d && d.rs) || [];
        });
    };

    /* Kế hoạch nhập học được phân quyền cho người đăng nhập (hàm mới BE cấp — ghi chú ở gốc phanlop.js:975) */
    P.keHoachNhapHoc = function () {
        return P.rows({
            action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            strNguoiThucHien_Id: ums.session.userId
        });
    };

    /* edu.system.getList_LopQuanLy (Corei) — tham số chép nguyên, rỗng = tất cả */
    P.lopQuanLy = function (o) {
        o = o || {};
        return P.rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
            func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
            strDaoTao_CoSoDaoTao_Id: P.e(o.strCoSoDaoTao_Id),
            strDaoTao_HeDaoTao_Id: P.e(o.strDaoTao_HeDaoTao_Id),
            strDaoTao_KhoaDaoTao_Id: P.e(o.strKhoaDaoTao_Id),
            strDaoTao_KhoaQuanLy_Id: P.e(o.strDaoTao_KhoaQuanLy_Id),
            strDaoTao_Nganh_Id: P.e(o.strNganh_Id),
            strDaoTao_LoaiLop_Id: P.e(o.strLoaiLop_Id),
            strDaoTao_ToChucCT_Id: P.e(o.strToChucCT_Id),
            strNguoiThucHien_Id: P.e(o.strNguoiThucHien_Id),
            strTuKhoa: P.e(o.strTuKhoa),
            pageIndex: o.pageIndex || 1,
            pageSize: o.pageSize || 1000000
        });
    };

    /* ---------- Cột ô đánh dấu (cuối bảng, như gốc) ---------- */
    P.cotChon = function (k) {
        return {
            head: '<input type="checkbox" data-nhall="' + k + '" title="Chọn tất cả">', cls: 'is-center', width: '50px',
            render: function (r) { return '<input type="checkbox" data-nhck="' + k + '" value="' + esc(P.e(r.ID)) + '">'; }
        };
    };
    P.ganChon = function (host, k) {
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.matches('[data-nhall="' + k + '"]')) {
                Array.prototype.forEach.call(host.querySelectorAll('[data-nhck="' + k + '"]'), function (x) {
                    x.checked = t.checked;
                    var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked);
                });
            } else if (t.matches('[data-nhck="' + k + '"]')) {
                var tr = t.closest('tr'); if (tr) tr.classList.toggle('is-selected', t.checked);
                var all = host.querySelector('[data-nhall="' + k + '"]');
                if (all) {
                    var bx = host.querySelectorAll('[data-nhck="' + k + '"]');
                    all.checked = bx.length > 0 && Array.prototype.every.call(bx, function (x) { return x.checked; });
                }
            }
        });
    };
    P.chon = function (host, k) {
        return Array.prototype.filter.call(host.querySelectorAll('[data-nhck="' + k + '"]'), function (x) { return x.checked; })
            .map(function (x) { return x.value; });
    };

    /* ---------- Nút thả xuống tự dựng ---------- */
    P.drop = function (text, icon, items) {
        return '<div class="ums-drop"><button type="button" class="ums-btn ums-btn--out-info ums-drop__toggle" aria-haspopup="menu" aria-expanded="false">' +
            '<i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span><i class="fa-light fa-angle-down ums-drop__caret"></i></button>' +
            '<div class="ums-drop__menu" role="menu" hidden>' + items.map(function (x, i) {
                return '<button type="button" class="ums-drop__item" role="menuitem" data-nhdrop="' + i + '"><span class="ums-drop__text">' +
                    esc(x.chu) + '</span></button>';
            }).join('') + '</div></div>';
    };
    P.batDrop = function (tog) {
        var d = tog.closest('.ums-drop'), m = d.querySelector('.ums-drop__menu');
        var on = !d.classList.contains('is-open');
        d.classList.toggle('is-open', on);
        m.hidden = !on;
        tog.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    P.dongDrop = function (el) {
        var d = el.closest('.ums-drop');
        if (!d) return;
        d.classList.remove('is-open');
        d.querySelector('.ums-drop__menu').hidden = true;
    };

    /* ---------- edu.system.reportDanhMuc ----------
       Bản gốc eval() chuỗi lấy từ danh mục (THONGTIN3/4/5, TEN) khi chuỗi có "aData.". Ở đây KHÔNG eval:
       hiểu đúng dạng biểu thức nối chuỗi thường gặp — các vế nối bằng "+", mỗi vế là 'chữ' / "chữ" /
       aData.COT — vế lạ thì giữ nguyên chữ (ghi console để quản trị sửa danh mục). */
    function giaTri(expr, aData) {
        if (expr === undefined || expr === null) return '';
        var s = String(expr);
        if (s.indexOf('aData.') < 0) return s;
        var ve = s.split('+').map(function (x) { return x.trim(); });
        var ok = true;
        var kq = ve.map(function (v) {
            var m;
            if ((m = /^aData\.([A-Za-z0-9_]+)$/.exec(v))) return P.e(aData[m[1]]);
            if ((m = /^'([^']*)'$/.exec(v)) || (m = /^"([^"]*)"$/.exec(v))) return m[1];
            ok = false; return v;
        }).join('');
        if (!ok) console.warn('[nhPhanLop] biểu thức danh mục chưa hiểu được (gốc eval):', s);
        return kq;
    }
    P.guiEmailDanhMuc = function (aData, email, maDM) {
        return ums.api.dm(maDM, 'HESO1').then(function (ds) {
            if (!ds || !ds.length) return null;
            var a = ds[0];
            return ums.report.run('DANHMUC_DON', {
                collect: function (add) {
                    add('strMaDanhMuc', maDM);
                    add('strFileName', giaTri(a.THONGTIN5, aData));
                    add('strEmail', email);
                    add('strTieuDe', giaTri(a.THONGTIN3, aData));
                    add('strNoiDung', giaTri(a.THONGTIN4, aData));
                    ds.forEach(function (x) {
                        add(x.MA, x.TEN && String(x.TEN).indexOf('aData.') !== -1 ? giaTri(x.TEN, aData) : P.e(aData[x.TEN]));
                    });
                }
            });
        }).catch(function (err) { ums.api.handle(err, 'gửi thư ' + maDM); });
    };

    ums.nhPhanLop = P;
})();
