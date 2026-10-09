/* =========================================================================
   ums.nsQT — khung HAI CỘT dùng chung của nhóm màn "quá trình" phân hệ Nhân sự
   (quatrinhcongtac/*, danhhieuhocham, khenthuongkyluat, nghithaisan,
   quanhegiadinh, quatrinhsuckhoe)
   ---------------------------------------------------------------------------
   Bản gốc mọi màn trong nhóm cùng một khuôn (chép tay 13 lần):
     · cột trái col-lg-3: ô từ khoá + nút Tìm kiếm, khối "điều kiện tìm kiếm"
       (Khoa/Viện/Phòng ban → Bộ môn, Tình trạng làm việc NS.TTNS), bảng
       "Danh sách cán bộ" (ảnh · họ tên / mã cán bộ / ngày sinh · nút xem),
       phân trang máy chủ — edu.system.getList_NhanSu (LayDSNhanSu_HoSo_v2,
       dLaCanBoNgoaiTruong 0; ô Bộ môn có giá trị thì gửi Bộ môn, không thì Khoa);
     · cột phải col-lg-9: ẩn tới khi bấm một cán bộ; đầu khung
       "<Họ tên> - Mã cán bộ: <mã>", rồi nội dung quá trình của CÁN BỘ ĐÓ.
   Nội dung bên phải chính là màn cùng tên của Cổng cán bộ, chỉ khác id người:
   Cổng cán bộ đọc edu.system.userId, Nhân sự đọc me.strNhanSu_Id (cán bộ đang
   chọn); strNguoiThucHien_Id vẫn là người đăng nhập. Vì vậy màn Nhân sự nạp
   CHÍNH tệp .js của Cổng cán bộ (ums.ccbHS.<tên>(P) trả cấu hình) và dựng lại
   mỗi lần chọn cán bộ.

       ums.nsQT.man({
           el, title,
           sideTools: HTML   nút đặt cạnh nút Tìm kiếm của cột trái (vd Báo cáo, Import),
           ghiChu: HTML      dòng ghi chú trên nội dung (quanhegiadinh),
           trong(host)       nội dung cột phải khi CHƯA chọn cán bộ (mặc định lời dẫn),
           mo(host, canBo, P) dựng nội dung cho cán bộ vừa chọn
       })  → { nap(trang), canBo() }
       P = { hs() → id cán bộ đang chọn, nth() → id người đăng nhập, ns: true, canBo }

       ums.nsQT.crud(host, cfg)      ums.crud nhúng (không đầu trang) vào host
       ums.nsQT.sections(host, cfg)  ums.pat.sections không tiêu đề trang
       ums.nsQT.soNgay('dd/mm/yyyy') → số để so sánh (edu.util.dateCompare)

   Khác bản gốc:
     · Luật cha → con (người dùng 2026-09-21): Bộ môn KHOÁ tới khi chọn Khoa,
       và chỉ liệt kê bộ môn của Khoa đó. Bản gốc nạp sẵn MỌI bộ môn khi chưa
       chọn Khoa (lọc tuỳ chọn) — bỏ chọn Khoa thì bỏ luôn Bộ môn.
     · Khối điều kiện tìm kiếm luôn hiện (bản gốc giấu sau nút "Kéo xuống").
     · Danh sách cán bộ vẽ thành các mục bấm được của cột trái (không phải bảng
       có nút xem riêng); rê chuột KHÔNG mở popover như vài màn gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    var Q = ums.nsQT = ums.nsQT || {};
    Q.uid = uid;

    /* Ảnh đại diện tròn của cán bộ (getRootPathImg gốc) — ảnh lỗi thì gỡ, còn biểu tượng người */
    Q.anh = function (path) { return pat.anhNguoi(path); };

    /* edu.util.dateCompare: 'dd/mm/yyyy' → yyyymmdd (rỗng → NaN, so sánh luôn sai như gốc) */
    Q.soNgay = function (s) {
        var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(e(s).trim());
        return m ? Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]) : NaN;
    };
    Q.homNay = function () {
        var d = new Date();
        return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    };

    Q.crud = function (host, cfg) {
        var c = {};
        Object.keys(cfg).forEach(function (k) { c[k] = cfg[k]; });
        c.root = host;
        c.embedded = true;
        return ums.crud(c);
    };
    Q.sections = function (host, cfg) {
        return pat.sections({ el: host, tabs: cfg.tabs });
    };

    /* Từ 2026-09-26: lớp bọc của khung chung ums.pat.masterNhanSu (patterns.js) —
       năm bản "Danh sách cán bộ" của phân hệ Nhân sự đã gộp về đó. */
    Q.man = function (o) {
        var api = pat.masterNhanSu({
            el: o.el, title: o.title,
            sideTools: o.sideTools,
            ghiChu: o.ghiChu,
            trong: o.trong,
            onChon: function (r, host) {
                o.mo(host, r, { hs: function () { return r.ID; }, nth: uid, ns: true, canBo: r });
            }
        });
        return { nap: api.tai, canBo: api.dangChon, m: api.m };
    };
})();
