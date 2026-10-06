# -*- coding: utf-8 -*-
"""Sinh trang theo dõi tiến độ chuyển đổi: _harness/tien-do.html

    python _harness/tien-do.py

Đọc thẳng cây thư mục, không cần sửa tay khi chuyển thêm màn:
  · màn gốc  = <Apis…>/Modules/<module>/html/<tệp>.html
  · đã chuyển = có _v2/<cùng đường dẫn>
  · BO_QUA   = màn cố ý không chuyển (trang thử, trang trống, đã gộp) — ghi lý do
  · HOAN     = màn có trong kho nhưng host KHÔNG DÙNG (không có chức năng / không trên menu) → hoãn, chuyển khi host dùng — ghi lý do
  · PHU      = thư mục phụ / bản cũ song song, tách riêng khỏi tổng
  · đã kiểm host = có trong sổ _harness/kiem-host/da-kiem.json (ghi bằng node _harness/kiem-host/ghi-da-kiem.js)
  · lỗi mã      = trường loiCode trong sổ (node _harness/kiem-host/loi-code.js them | da-sua | xong) — kiểm lại đạt thì tự mất khỏi trang
Mở: http://localhost:8787/_harness/tien-do.html (hoặc mở thẳng tệp, trang không gọi mạng).
"""
import datetime
import glob
import html
import json
import os

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(GOC)

TEN = {
    'ApisTaiChinh': 'Tài chính', 'ApisCongCanBo': 'Cổng cán bộ', 'ApisCongSinhVien': 'Cổng sinh viên',
    'ApisChuyenCan': 'Chuyên cần', 'ApisCMS': 'Quản trị hệ thống', 'ApisDangKyHoc': 'Đăng ký học',
    'ApisHocLaiThiLai': 'Học lại thi lại', 'ApisRenLuyen': 'Điểm rèn luyện', 'ApisXuLyHocVu': 'Xử lý học vụ',
    'ApisHocBong': 'Xét học bổng', 'ApisDanhHieu': 'Danh hiệu', 'ApisKeHoachChuongTrinh': 'Kế hoạch chương trình',
    'ApisKyTucXa': 'Ký túc xá', 'ApisLuanVanLuanAn': 'Luận văn, luận án', 'ApisNCKH': 'Nghiên cứu khoa học',
    'ApisNhanSu': 'Nhân sự', 'ApisNhapHoc': 'Nhập học', 'ApisQuanLyDiem': 'Quản lý điểm',
    'ApisQuanLyThiTracNghiem': 'Quản lý thi trắc nghiệm', 'ApisQuanlyTuyenSinh': 'Quản lý tuyển sinh',
    'ApisSinhVien': 'Sinh viên', 'ApisTKGG': 'Thống kê giờ giảng', 'ApisThiPhach': 'Thi phách',
    'ApisTinTuc': 'Tin tức', 'ApisTotNghiep': 'Tốt nghiệp', 'ApisCongSinhVien-1': 'Cổng sinh viên (bản cũ -1)',
}

# Thứ tự đã chuyển (CLAUDE.md mục 11) — phân hệ mới chuyển thì thêm vào cuối
THU_TU = ['ApisTaiChinh', 'ApisCongCanBo', 'ApisCongSinhVien', 'ApisChuyenCan', 'ApisCMS', 'ApisDangKyHoc',
          'ApisHocLaiThiLai', 'ApisRenLuyen', 'ApisXuLyHocVu', 'ApisHocBong', 'ApisTotNghiep', 'ApisQuanLyThiTracNghiem', 'ApisThiTracNghiem', 'ApisQuanLyDiem', 'ApisNhanSu', 'ApisSinhVien',
          'ApisKeHoachChuongTrinh', 'ApisNhapHoc', 'ApisQuanlyTuyenSinh', 'ApisNCKH', 'ApisThiPhach', 'ApisTinTuc', 'ApisTKGG']

HOAN = {
    'ApisTKGG/Modules/danhmuc/html/danhmucdulieu.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/dinhmuc/html/khungdinhmuc.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/dinhmuc/html/khungdinhmuc_nhansu.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/heso/html/gioquydoi.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/heso/html/tylemiengiam.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/heso/html/tylemiengiam_nhansu.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/hoatdong/html/coithi.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/hoatdong/html/dieuphoi.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/hoatdong/html/giangday.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/hoatdong/html/hoidong.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
    'ApisTKGG/Modules/hoatdong/html/huongdan.html': 'Host không có chức năng (6/10, người dùng: chỉ chuyển màn đang dùng)',
}
BO_QUA = {
    'ApisQuanlyTuyenSinh/Modules/nhapdiem/html/nhapdiemtest.html': 'Trang thử, không phải màn nghiệp vụ',
    'ApisCMS/Modules/danhmuc/html/test.html': 'Trang thử, không phải màn nghiệp vụ',
    'ApisCongSinhVien/Modules/tintuc/html/tintuctest.html': 'Trang thử (kéo gốc 30/9), không phải màn nghiệp vụ',
    'ApisCMS/Modules/danhmuc/html/test2.html': 'Trang thử, không phải màn nghiệp vụ',
    'ApisCMS/Modules/hethong/html/hello.html': 'Trang thử, không phải màn nghiệp vụ',
    'ApisCongCanBo/Modules/thongtinhuu/html/thongtinhuu.html': 'Bản gốc rỗng',
    'ApisCongCanBo/Modules/ztest/html/docjson.html': 'Trang thử (ztest)',
    'ApisCongSinhVien/Modules/tintuc/html/tintuc1.html': 'Gộp vào tintuc (dùng chung _tintuc.js)',
    'ApisDangKyHoc/Modules/phanconglophocphan/html/phanconglophocphan.html': 'Bản gốc html trống',
    'ApisQuanLyDiem/Modules/nhapdiem/html/nhapdiemtest.html': 'Trang thử (bản chép của nhapdiem, tên "test")',
    'ApisTaiChinh/Modules/danhmucheso/html/mucphisotien.html': 'Bản gốc rỗng, không có gì để chuyển',
}
PHU = {'ApisCongSinhVien-1': 'Bản cũ song song của ApisCongSinhVien (khác vài màn) — chưa rõ còn dùng; không tính vào tổng'}


SO_KIEM = os.path.join('_harness', 'kiem-host', 'da-kiem.json')
KIEM = json.load(open(SO_KIEM, encoding='utf-8')) if os.path.exists(SO_KIEM) else {}


def ngay(p):
    return datetime.datetime.fromtimestamp(os.path.getmtime(p)).strftime('%d/%m/%Y')


phanhe = []
for app in sorted(glob.glob('Apis*'), key=lambda a: (a in PHU, a not in THU_TU, THU_TU.index(a) if a in THU_TU else 0, TEN.get(a, a))):
    if not os.path.isdir(app):
        continue
    man = []
    for f in sorted(glob.glob(app + '/Modules/*/html/*.html')):
        f = f.replace(os.sep, '/')
        mod, tep = f.split('/')[2], os.path.splitext(os.path.basename(f))[0]
        v2 = '_v2/' + f
        if os.path.exists(v2):
            tt, ghi = 'xong', ngay(v2)
        elif f in BO_QUA:
            tt, ghi = 'bo', BO_QUA[f]
        elif f in HOAN:
            tt, ghi = 'hoan', HOAN[f]
        else:
            tt, ghi = 'chua', ''
        x = {'m': mod, 't': tep, 's': tt, 'g': ghi}
        k = KIEM.get(app, {}).get('man', {}).get((mod + '/' + tep).lower())
        if k:
            x['k'] = {'d': k.get('doc', ''), 'g': k.get('ghi', ''), 'c': k.get('ghiChu', ''), 't': k.get('thaoTac', ''),
                      'l': k.get('loi', []) + k.get('loiJS', []), 'n': k.get('ten', ''), 'lc': k.get('loiCode', [])}
        man.append(x)
    if not man:
        continue
    kh = KIEM.get(app, {})
    phanhe.append({'id': app, 'ten': TEN.get(app, app), 'man': man, 'phu': PHU.get(app, ''),
                   'kiem': {'ngay': '/'.join(reversed(kh['ngay'].split('-'))), 'tomTat': kh.get('tomTat', '')} if kh else None,
                   'thuTu': THU_TU.index(app) + 1 if app in THU_TU else 0})

tinh = [p for p in phanhe if not p['phu']]
tong = sum(len(p['man']) for p in tinh)
xong = sum(1 for p in tinh for m in p['man'] if m['s'] == 'xong')
bo = sum(1 for p in tinh for m in p['man'] if m['s'] == 'bo')
hoan = sum(1 for p in tinh for m in p['man'] if m['s'] == 'hoan')
luc = datetime.datetime.now().strftime('%H:%M %d/%m/%Y')

daKiem = sum(1 for p in tinh for m in p['man'] if m.get('k'))
DATA = json.dumps({'phanhe': phanhe, 'tong': tong, 'xong': xong, 'bo': bo, 'hoan': hoan, 'luc': luc, 'daKiem': daKiem}, ensure_ascii=False)

TRANG = r'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tiến độ chuyển đổi</title>
<style>
:root {
    --bg: #eef1fb; --surface: #fff; --surface-2: #f6f8fc; --line: #d8dee9; --ink: #131a27; --ink-2: #4a5568; --ink-3: #7b8597;
    --navy: #223771; --blue: #0d6efd; --blue-l: #e8f0ff; --ok: #12805c; --ok-bg: #e4f6ef; --warn: #9a6a00; --warn-bg: #fdf3dc;
    --mute-bg: #eef0f4; --r: 10px;
}
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --bg: #0f1522; --surface: #172033; --surface-2: #1c2740; --line: #2c3a57; --ink: #e6ebf5; --ink-2: #b4bfd3; --ink-3: #8390a8;
        --navy: #9fb6ff; --blue: #6ea8fe; --blue-l: #1d2c4d; --ok: #4fd1a1; --ok-bg: #133a2e; --warn: #f0c35a; --warn-bg: #3a2f12; --mute-bg: #232d42;
    }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.wrap { max-width: 1320px; margin: 0 auto; padding: 24px 16px 48px; }
h1 { margin: 0 0 4px; font-size: 22px; color: var(--navy); }
.sub { color: var(--ink-3); font-size: 13px; }
.sub code { background: var(--mute-bg); padding: 1px 6px; border-radius: 4px; }
.tong { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 20px 0; }
.the { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 14px 16px; }
.the b { display: block; font-size: 26px; line-height: 1.2; }
.the span { color: var(--ink-3); font-size: 12px; }
.the.xong b { color: var(--ok); } .the.chua b { color: var(--warn); }
.thanh { height: 8px; background: var(--mute-bg); border-radius: 99px; overflow: hidden; }
.thanh > i { display: block; height: 100%; background: var(--ok); border-radius: 99px; }
.cong { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0 16px; }
.cong input { flex: 1 1 260px; min-width: 0; padding: 9px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); color: var(--ink); font: inherit; }
.cong label { white-space: nowrap; display: inline-flex; gap: 6px; align-items: center; color: var(--ink-2); font-size: 13px; }
.hai { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
@media (max-width: 820px) { .hai { grid-template-columns: 1fr; } }
.cot { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; }
.cot > h2 { margin: 0; padding: 12px 16px; font-size: 15px; display: flex; gap: 8px; align-items: center; border-bottom: 1px solid var(--line); }
.cot.xong > h2 { background: var(--ok-bg); color: var(--ok); }
.cot.chua > h2 { background: var(--warn-bg); color: var(--warn); }
.cot > h2 small { margin-left: auto; font-weight: 600; }
details { border-bottom: 1px solid var(--line); }
details:last-child { border-bottom: 0; }
summary { cursor: pointer; padding: 10px 16px; display: flex; gap: 10px; align-items: center; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary::before { content: "›"; color: var(--ink-3); transition: transform .15s; display: inline-block; width: 10px; }
details[open] > summary::before { transform: rotate(90deg); }
summary .ten { font-weight: 600; }
summary .so { margin-left: auto; color: var(--ink-3); font-size: 12px; white-space: nowrap; }
summary .phu-nhan { font-size: 11px; color: var(--ink-3); border: 1px dashed var(--line); border-radius: 99px; padding: 0 7px; }
summary .tt { font-size: 11px; color: var(--ink-3); background: var(--mute-bg); border-radius: 99px; padding: 0 7px; }
summary .mini { width: 70px; flex: none; }
.mod { padding: 0 16px 10px 36px; }
.mod h3 { margin: 8px 0 4px; font-size: 12px; color: var(--ink-3); font-weight: 600; text-transform: none; }
.mod ul { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
.mod li { font-size: 12.5px; padding: 2px 9px; border-radius: 99px; background: var(--blue-l); color: var(--navy); overflow-wrap: anywhere; }
.cot.chua .mod li { background: var(--warn-bg); color: var(--warn); }
.mod li.bo { background: var(--mute-bg); color: var(--ink-2); text-decoration: line-through; }
.mod li.hoan { background: var(--mute-bg); color: var(--ink-2); font-style: italic; border-left: 3px dashed var(--ink-2); }
.mod li[title] { cursor: help; }
.phu { padding: 0 16px 10px 36px; color: var(--ink-3); font-size: 12px; }
.rong { padding: 16px; color: var(--ink-3); }
.the.kiem b { color: var(--blue); }
.kiem-khoi { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); overflow: hidden; margin-bottom: 16px; }
.kiem-khoi > h2 { margin: 0; padding: 12px 16px; font-size: 15px; background: var(--blue-l); color: var(--navy); border-bottom: 1px solid var(--line); display: flex; gap: 8px; align-items: center; }
.kiem-khoi > h2 small { margin-left: auto; font-weight: 600; }
.kiem-tt { padding: 0 16px 8px 36px; color: var(--ink-2); font-size: 12.5px; }
.kiem-dem { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 8px 36px; }
.nhan { font-size: 11.5px; border-radius: 99px; padding: 1px 8px; white-space: nowrap; background: var(--mute-bg); color: var(--ink-2); }
.nhan.tot { background: var(--ok-bg); color: var(--ok); } .nhan.xau { background: #fde3e3; color: #a12020; } .nhan.vua { background: var(--warn-bg); color: var(--warn); }
.bang-cuon { overflow-x: auto; padding: 0 16px 12px 36px; }
.kiem-bang { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.kiem-bang th, .kiem-bang td { text-align: left; padding: 5px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
.kiem-bang th { color: var(--ink-3); font-weight: 600; white-space: nowrap; }
.kiem-bang td.gc { color: var(--ink-2); overflow-wrap: anywhere; min-width: 220px; }
.mod li .dau { margin-left: 5px; font-size: 9px; padding: 0 4px; }
.loi-ma { margin: 0; padding: 10px 16px 12px; border-bottom: 1px solid var(--line); }
.loi-ma h3 { margin: 0 0 6px; font-size: 13px; color: var(--ink); }
.loi-ma ol { margin: 0; padding-left: 20px; font-size: 12.5px; color: var(--ink-2); }
.loi-ma li { margin: 3px 0; overflow-wrap: anywhere; }
.loi-ma .rong-lc { color: var(--ok); font-size: 12.5px; }
.kiem-bang td.lc { min-width: 240px; overflow-wrap: anywhere; }
.kiem-loc { display: flex; flex-wrap: wrap; gap: 12px; padding: 8px 16px; border-bottom: 1px solid var(--line); font-size: 13px; color: var(--ink-2); }
.ghichu { margin-top: 20px; color: var(--ink-3); font-size: 12.5px; }
</style>
</head>
<body>
<div class="wrap">
    <h1>Tiến độ chuyển đổi sang giao diện mới (_v2)</h1>
    <div class="sub">Sinh lúc <b id="luc"></b> · cập nhật: <code>python _harness/tien-do.py</code> rồi tải lại trang</div>

    <div class="tong" id="tong"></div>

    <div class="cong">
        <input id="tim" type="search" placeholder="Tìm phân hệ, module hoặc tên màn…" autocomplete="off">
        <label><input type="checkbox" id="moHet"> Mở hết</label>
    </div>

    <section class="kiem-khoi"><h2>Đã kiểm trên host <small id="nKiem"></small></h2>
        <div class="bang-cuon" style="padding:12px 16px" id="bangPH"></div>
        <div class="loi-ma" id="loiMa"></div>
        <div class="kiem-loc"><label><input type="checkbox" id="chiLoi"> Chỉ hiện màn có vấn đề (lỗi mã, lỗi máy chủ, máy chủ từ chối, còn sót)</label></div>
        <div id="dsKiem"></div></section>

    <div class="hai">
        <section class="cot xong"><h2>✓ Đã chuyển <small id="nXong"></small></h2><div id="dsXong"></div></section>
        <section class="cot chua"><h2>○ Chưa chuyển <small id="nChua"></small></h2><div id="dsChua"></div></section>
    </div>

    <div class="ghichu">
        Màn = một tệp <code>Modules/&lt;module&gt;/html/&lt;tệp&gt;.html</code> của bản gốc; "đã chuyển" = có cùng đường dẫn trong <code>_v2</code>.
        Số thứ tự cạnh tên phân hệ là thứ tự đã chuyển. Màn gạch ngang = cố ý không chuyển (rê chuột để xem lý do), đã tính là xong phần việc.
        Ngày cạnh phân hệ đã chuyển = lần sửa gần nhất của tệp màn trong _v2.<br>
        <b>Đã kiểm trên host</b> = màn đã chạy thật trên host bằng bộ thử <code>_harness/kiem-host</code>: <i>đọc sâu</i> (mở màn, chọn ô lọc, bấm tab / trang 2 / Xem / Sửa / Thêm rồi đóng)
        và <i>thử ghi</i> (thêm bản ghi mang dấu ZKT, sửa, xoá chính nó, đối chứng đã mất). Dấu ● cạnh tên màn ở cột "Đã chuyển": xanh = đã kiểm, không vấn đề; vàng = đã kiểm, thử ghi chưa trọn hoặc đã sửa mã đang chờ kiểm lại;
        đỏ = lỗi mã cần sửa / lỗi máy chủ / còn sót. Bảng đầu khối — cột <b>Tình trạng</b> của từng PHÂN HỆ: <i>Chưa kiểm</i> (chưa chạy trên host) → <i>Chưa CRUD</i> (mới đọc sâu, chưa thử thêm / sửa / xoá) → <i>CRUD dở</i> → <i>Đã hoàn thiện</i> (mọi màn có trên menu host đã đọc sâu và đã thử ghi hoặc đã xếp loại không thử có lý do, không còn lỗi code treo). Cột <b>Tình trạng</b> của từng màn: kết luận về MÃ giao diện mới của màn đó — "Đã kiểm sâu (không phát hiện lỗi từ code)" = đã đọc sâu và đã thử ghi (hoặc đã xếp loại không thử, có lý do), không còn lỗi mã nào treo; lỗi máy chủ / dữ liệu không tính vào đây. Cột <b>Lỗi mã</b>: lỗi của chính giao diện mới — kiểm lại trên host đạt thì mục tự mất khỏi cột. Màn đã chuyển mà không có dấu = chưa kiểm hoặc không có trên menu của host. Việc của quản trị CSDL / nghiệp vụ nằm ở khung "Ghi chú chuyển đổi" trên từng màn.
    </div>
</div>
<script>
var D = __DATA__;
function e(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
document.getElementById('luc').textContent = D.luc;
var chua = D.tong - D.xong - D.bo - D.hoan;
document.getElementById('tong').innerHTML =
    '<div class="the"><b>' + D.tong + '</b><span>màn của bản gốc</span></div>' +
    '<div class="the xong"><b>' + D.xong + '</b><span>đã chuyển (' + pct(D.xong, D.tong) + '%)</span></div>' +
    '<div class="the"><b>' + D.bo + '</b><span>cố ý không chuyển</span></div>' +
    '<div class="the"><b>' + D.hoan + '</b><span>hoãn — host chưa dùng</span></div>' +
    '<div class="the chua"><b>' + chua + '</b><span>chưa chuyển</span></div>' +
    '<div class="the kiem"><b>' + D.daKiem + '</b><span>đã kiểm trên host (' + pct(D.daKiem, D.xong) + '% màn đã chuyển)</span></div>' +
    '<div class="the" style="grid-column:1/-1"><div class="thanh"><i style="width:' + pct(D.xong + D.bo, D.tong) + '%"></i></div>' +
    '<span>' + pct(D.xong + D.bo, D.tong) + '% màn đã xử lý (chuyển + cố ý bỏ)</span></div>';

var DOC = { 'khong-tren-menu': ['Không có trên menu host — chưa kiểm được', 'mute'], 'ok': ['Mở tốt', 'tot'], 'loi-may-chu': ['Lỗi máy chủ', 'xau'], 'loi-js': ['Lỗi JS', 'xau'], 'loi-nap': ['Không nạp được', 'xau'], 'loi-v2-da-sua': ['Lỗi _v2 — đã sửa', 'vua'], 'chua-chuyen': ['Chưa chuyển', ''] };
var GHI = { 'sach': ['Sạch', 'tot'], 'tu-choi': ['Máy chủ LỖI khi ghi', 'xau'], 'hop-le': ['Máy chủ kiểm dữ liệu, từ chối đúng', ''], 'chan': ['Màn chặn trước khi lưu', 'vua'], 'khong-xoa': ['Không có đường xoá — không thử', ''],
    'khong-crud': ['Không có thao tác ghi', ''], 'khong-thu': ['Cố ý không thử', ''], 'con-sot': ['CÒN SÓT bản ghi thử', 'xau'], '': ['Chưa thử ghi', 'vua'] };
var LC = { 'can-sua': ['CẦN SỬA MÃ', 'xau'], 'cho-kiem': ['Đã sửa — chờ kiểm lại', 'vua'] };
function veLc(lc) {
    return (lc || []).map(function (l) {
        return nhan(LC[l.tt] || [l.tt, '']) + ' ' + e(l.moTa) + (l.sua ? '<br><i>Đã sửa (' + e(l.ngaySua.split('-').reverse().join('/')) + '):</i> ' + e(l.sua) : '') +
            ' <span style="color:var(--ink-3)">— ghi ' + e(l.ngay.split('-').reverse().join('/')) + '</span>';
    }).join('<br>');
}
function veLoiMa() {
    var ds = [];
    D.phanhe.forEach(function (p) { p.man.forEach(function (m) { if (m.k) m.k.lc.forEach(function (l) { ds.push({ p: p, m: m, l: l }); }); }); });
    ds.sort(function (a, b) { return (a.l.tt === 'cho-kiem' ? 0 : 1) - (b.l.tt === 'cho-kiem' ? 0 : 1); });
    document.getElementById('loiMa').innerHTML = '<h3>Lỗi mã đang treo — lần kiểm host kế tiếp làm các màn này TRƯỚC (' + ds.length + ')</h3>' +
        (ds.length ? '<ol>' + ds.map(function (x) {
            return '<li><b>' + e(x.p.ten) + ' → ' + e(x.m.k.n || x.m.t) + '</b> <span style="color:var(--ink-3)">(' + e(x.m.m + '/' + x.m.t) + ')</span><br>' + veLc([x.l]) + '</li>';
        }).join('') + '</ol>' : '<div class="rong-lc">Không còn lỗi mã nào treo — mọi màn đã sửa đều đã kiểm lại đạt trên host.</div>');
}
function mucDo(k) { if (k.lc.length) return k.lc.some(function (l) { return l.tt === 'can-sua'; }) ? 'xau' : 'vua'; var d = (DOC[k.d] || ['', ''])[1], g = (GHI[k.g] || ['', ''])[1]; return d === 'xau' || g === 'xau' ? 'xau' : (g === 'vua' || d === 'vua' ? 'vua' : 'tot'); }
/* Cột "Tình trạng" (người dùng 2026-09-30): kết luận MỘT dòng cho từng màn, nhìn từ phía MÃ giao diện mới.
   Lỗi máy chủ / dữ liệu không tính là lỗi từ code (đã có cột Ghi chú + sổ cần quyết). */
function tinhTrang(k) {
    if (k.lc.some(function (l) { return l.tt === 'can-sua'; })) return ['Có lỗi từ code — cần sửa', 'xau'];
    if (k.lc.length) return ['Đã sửa lỗi code — chờ kiểm lại trên host', 'vua'];
    if (k.d === 'loi-js' || k.d === 'loi-nap') return ['Có lỗi từ code khi mở màn', 'xau'];
    if (k.d === 'chua-chuyen') return ['Chưa chuyển', ''];
    if (!k.g) return ['Mới đọc sâu — chưa thử ghi', 'vua'];
    return ['Đã kiểm sâu (không phát hiện lỗi từ code)', 'tot'];
}
/* Cột "Tình trạng" của TỪNG PHÂN HỆ (người dùng 2026-09-30): Chưa kiểm → Chưa CRUD → (CRUD dở) → Đã hoàn thiện.
   "Đã hoàn thiện" = mọi màn có trên menu host đã đọc sâu VÀ đã thử ghi (hoặc đã xếp loại không thử, có lý do), không còn lỗi code treo. */
function ttPhanHe(p) {
    var tat = p.man.filter(function (m) { return m.k; });
    if (!p.kiem || !tat.length) return ['Chưa kiểm', ''];
    var lc = [];
    tat.forEach(function (m) { m.k.lc.forEach(function (l) { lc.push(l); }); });
    if (lc.some(function (l) { return l.tt === 'can-sua'; })) return ['Có lỗi code — cần sửa', 'xau'];
    if (lc.length) return ['Đã sửa lỗi code — chờ kiểm lại', 'vua'];
    var chua = tat.filter(function (m) { return !m.k.g; }).length;
    if (chua === tat.length) return ['Chưa CRUD (mới đọc sâu)', 'vua'];
    if (chua) return ['CRUD dở — còn ' + chua + ' màn', 'vua'];
    return ['Đã hoàn thiện', 'tot'];
}
function veBangPH() {
    var ds = D.phanhe.filter(function (p) { return !p.phu && p.man.some(function (m) { return m.s === 'xong'; }); });
    var thuTu = { 'tot': 0, 'xau': 1, 'vua': 2, '': 3 };
    ds = ds.map(function (p) { return { p: p, tt: ttPhanHe(p) }; }).sort(function (a, b) { return thuTu[a.tt[1]] - thuTu[b.tt[1]] || a.p.thuTu - b.p.thuTu; });
    document.getElementById('bangPH').innerHTML =
        '<table class="kiem-bang"><thead><tr><th>Phân hệ</th><th>Màn đã chuyển</th><th>Đã đọc sâu trên host</th><th>Đã CRUD / xếp loại</th><th>Tình trạng</th><th>Ngày kiểm</th></tr></thead><tbody>' +
        ds.map(function (x) {
            var p = x.p, tat = p.man.filter(function (m) { return m.k; });
            var daGhi = tat.filter(function (m) { return m.k.g; }).length;
            return '<tr><td><b>' + e(p.ten) + '</b> <span style="color:var(--ink-3)">' + e(p.id) + '</span></td><td>' + p.man.filter(function (m) { return m.s === 'xong'; }).length +
                '</td><td>' + (tat.length || '—') + '</td><td>' + (tat.length ? daGhi + '/' + tat.length : '—') + '</td><td>' + nhan(x.tt) + '</td><td>' + (p.kiem ? e(p.kiem.ngay) : '—') + '</td></tr>';
        }).join('') + '</tbody></table>';
}
function nhan(b, chu) { return '<span class="nhan ' + b[1] + '">' + e(chu || b[0]) + '</span>'; }
function veKiem() {
    var q = document.getElementById('tim').value.trim().toLowerCase(), chiLoi = document.getElementById('chiLoi').checked;
    var mo = document.getElementById('moHet').checked || !!q || chiLoi;
    var h = D.phanhe.filter(function (p) { return p.kiem; }).map(function (p) {
        var tat = p.man.filter(function (m) { return m.k; });
        var ds = tat.filter(function (m) {
            return (!chiLoi || mucDo(m.k) === 'xau' || m.k.lc.length) && (!q || (p.ten + ' ' + p.id + ' ' + m.m + ' ' + m.t + ' ' + m.k.n + ' ' + m.k.c).toLowerCase().indexOf(q) >= 0);
        });
        if (!ds.length) return '';
        var dem = {};
        tat.forEach(function (m) { dem[m.k.g] = (dem[m.k.g] || 0) + 1; });
        var loiDoc = tat.filter(function (m) { return (DOC[m.k.d] || ['', ''])[1] === 'xau'; }).length;
        var sach = tat.filter(function (m) { return tinhTrang(m.k)[1] === 'tot'; }).length;
        return '<details' + (mo ? ' open' : '') + '><summary><span class="ten">' + e(p.ten) + '</span> ' + nhan(ttPhanHe(p)) +
            '<span class="so">' + e(p.id) + ' · ' + tat.length + '/' + p.man.filter(function (m) { return m.s === 'xong'; }).length + ' màn đã chuyển · kiểm ' + e(p.kiem.ngay) + '</span></summary>' +
            (p.kiem.tomTat ? '<div class="kiem-tt">' + e(p.kiem.tomTat) + '</div>' : '') +
            '<div class="kiem-dem">' + nhan(['', sach === tat.length ? 'tot' : 'vua'], 'Đã kiểm sâu, không phát hiện lỗi từ code: ' + sach + '/' + tat.length + ' màn') +
            nhan(loiDoc ? DOC['loi-may-chu'] : DOC.ok, 'Đọc sâu: ' + (tat.length - loiDoc) + ' mở tốt' + (loiDoc ? ', ' + loiDoc + ' lỗi' : '')) +
            Object.keys(dem).sort().map(function (k) { return nhan(GHI[k] || [k, ''], 'Thử ghi — ' + (GHI[k] || [k])[0].toLowerCase() + ': ' + dem[k]); }).join('') + '</div>' +
            '<div class="bang-cuon"><table class="kiem-bang"><thead><tr><th>Module / màn</th><th>Tên trên menu</th><th>Tình trạng</th><th>Đọc sâu</th><th>Thử ghi</th><th>Lỗi mã (cần sửa / chờ kiểm lại)</th><th>Ghi chú (máy chủ, dữ liệu, lý do không thử)</th></tr></thead><tbody>' +
            ds.map(function (m) {
                return '<tr><td>' + e(m.m + '/' + m.t) + '</td><td>' + e(m.k.n) + '</td><td>' + nhan(tinhTrang(m.k)) + '</td><td>' + nhan(DOC[m.k.d] || [m.k.d, '']) + '</td><td>' +
                    nhan(GHI[m.k.g] || [m.k.g, ''], (GHI[m.k.g] || [m.k.g])[0] + (m.k.t ? ' (' + m.k.t + ')' : '')) + '</td><td class="lc">' + veLc(m.k.lc) + '</td><td class="gc">' + e(m.k.c) +
                    (m.k.l.length ? (m.k.c ? '<br>' : '') + m.k.l.map(e).join('<br>') : '') + '</td></tr>';
            }).join('') + '</tbody></table></div></details>';
    }).join('');
    document.getElementById('dsKiem').innerHTML = h || '<div class="rong">' + (D.daKiem ? 'Không có màn nào khớp.' : 'Chưa có phân hệ nào được ghi vào sổ đã kiểm host.') + '</div>';
    document.getElementById('nKiem').textContent = D.daKiem + ' màn · ' + D.phanhe.filter(function (p) { return p.kiem; }).length + ' phân hệ';
}
function nhom(man) {
    var g = {};
    man.forEach(function (m) { (g[m.m] = g[m.m] || []).push(m); });
    return g;
}
function khoi(p, loc, q) {
    var ds = p.man.filter(loc).filter(function (m) {
        return !q || (p.ten + ' ' + p.id + ' ' + m.m + ' ' + m.t).toLowerCase().indexOf(q) >= 0;
    });
    if (!ds.length) return '';
    var x = p.man.filter(function (m) { return m.s !== 'chua'; }).length, n = p.man.length;
    var ngayMoi = p.man.filter(function (m) { return m.s === 'xong'; }).map(function (m) { return m.g.split('/').reverse().join('-'); }).sort().pop();
    var g = nhom(ds);
    var mo = document.getElementById('moHet').checked || !!q;
    return '<details' + (mo ? ' open' : '') + '><summary>' +
        (p.thuTu ? '<span class="tt">#' + p.thuTu + '</span>' : '') +
        '<span class="ten">' + e(p.ten) + '</span>' + (p.phu ? '<span class="phu-nhan">không tính vào tổng</span>' : '') +
        '<span class="so">' + e(p.id) + ' · ' + ds.length + ' màn' + (ngayMoi && loc({ s: 'xong' }) ? ' · ' + ngayMoi.split('-').reverse().join('/') : '') + '</span>' +
        '<span class="mini thanh" title="' + x + '/' + n + '"><i style="width:' + pct(x, n) + '%"></i></span></summary>' +
        (p.phu ? '<div class="phu">' + e(p.phu) + '</div>' : '') +
        '<div class="mod">' + Object.keys(g).map(function (k) {
            return '<h3>' + e(k) + '</h3><ul>' + g[k].map(function (m) {
                var dau = m.k ? '<span class="dau nhan ' + mucDo(m.k) + '" title="Đã kiểm host — đọc: ' + e((DOC[m.k.d] || [m.k.d])[0]) + '; ghi: ' + e((GHI[m.k.g] || [m.k.g])[0]) + '">●</span>' : '';
                return '<li' + (m.s === 'bo' ? ' class="bo" title="' + e(m.g) + '"' : m.s === 'hoan' ? ' class="hoan" title="' + e(m.g) + '"' : '') + '>' + e(m.t) + dau + '</li>';
            }).join('') + '</ul>';
        }).join('') + '</div></details>';
}
function ve() {
    var q = document.getElementById('tim').value.trim().toLowerCase();
    var laXong = function (m) { return m.s !== 'chua'; }, laChua = function (m) { return m.s === 'chua'; };
    var a = D.phanhe.map(function (p) { return khoi(p, laXong, q); }).join('');
    var b = D.phanhe.map(function (p) { return khoi(p, laChua, q); }).join('');
    document.getElementById('dsXong').innerHTML = a || '<div class="rong">Không có màn nào khớp.</div>';
    document.getElementById('dsChua').innerHTML = b || '<div class="rong">Không có màn nào khớp.</div>';
    document.getElementById('nXong').textContent = (D.xong + D.bo) + ' màn';
    var phu = D.phanhe.filter(function (p) { return p.phu; }).reduce(function (s, p) { return s + p.man.length; }, 0);
    document.getElementById('nChua').textContent = chua + ' màn' + (phu ? ' (+' + phu + ' thư mục phụ)' : '');
}
function veHet() { ve(); veBangPH(); veKiem(); veLoiMa(); }
document.getElementById('tim').addEventListener('input', veHet);
document.getElementById('moHet').addEventListener('change', veHet);
document.getElementById('chiLoi').addEventListener('change', veKiem);
veHet();
</script>
</body>
</html>
'''

out = os.path.join(GOC, '_harness', 'tien-do.html')
with open(out, 'w', encoding='utf-8', newline='\n') as fh:
    fh.write(TRANG.replace('__DATA__', DATA.replace('</', '<\\/')))
print('Đã ghi', out, '—', xong, 'đã chuyển +', bo, 'cố ý bỏ +', hoan, 'hoãn /', tong, 'màn (không tính thư mục phụ)')
