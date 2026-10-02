# -*- coding: utf-8 -*-
"""Kiểm BỘ BIỂU TƯỢNG CHUẨN của bản mới (_v2).

Luật (người dùng chốt 2026-09-23): CHỮ trên nút giữ đúng bản gốc, nhưng cùng
một hành động thì phải cùng một biểu tượng trên toàn ứng dụng.

    Xem / Chi tiết (chỉ đọc)            fa-eye
    Chạy truy vấn (Xem · Tìm kiếm ·
      Danh sách · Tra cứu …)            fa-magnifying-glass
    Sửa / Khai / Nhập                   fa-pen-to-square
    Xoá                                 fa-trash-can
    Thêm mới                            fa-plus
    Lưu                                 fa-floppy-disk
    Lịch sử                             fa-clock-rotate-left
    Xác nhận / Duyệt                    fa-circle-check
    Tải lại                             fa-rotate-right
    Đóng                                fa-xmark
    In                                  fa-print
    Xuất Excel                          fa-file-excel
    Xuất báo cáo                        fa-file-chart-column
    Import                              fa-cloud-arrow-up
    Tệp đính kèm                        fa-paperclip

Bảng này nằm trong mã ở ums.ui (BTN / ICONBTN / ums.ui.ICON) — màn hình nên gọi
ums.ui.btn('view' | 'edit' | 'history' | …) thay vì tự chọn biểu tượng.

    python _harness/kiem-icon-chuan.py          # kiểm cả _v2
    python _harness/kiem-icon-chuan.py ApisCongSinhVien
"""
import re, io, os, sys, glob

GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_v2')
os.chdir(GOC)

EYE, LUP, LS = 'fa-eye', 'fa-magnifying-glass', 'fa-clock-rotate-left'
SUA, XOA, THEM, LUU = 'fa-pen-to-square', 'fa-trash-can', 'fa-plus', 'fa-floppy-disk'

KHO = re.compile(r'^(Lịch sử|Xem lịch sử)')
XEM = re.compile(r'^(Chi tiết|Xem chi tiết|Xem thông tin|Xem lịch |Xem trước)')
TRUYVAN = re.compile(r'^(Xem|Tìm kiếm|Danh sách|Tra cứu|Xem học phần|Xem kết quả|Xem định hướng|Xem phiếu|Xem lịch)$')
SUA_RE = re.compile(r'^(Sửa|Chỉnh sửa|Cập nhật thông tin)$')
XOA_RE = re.compile(r'^(Xoá|Xóa)$')


def chuan(tx):
    """Trả về biểu tượng bắt buộc, hoặc một tập hợp khi chữ có hai nghĩa."""
    tx = (tx or '').strip()
    if tx == 'Xem': return (LUP, EYE)      # thanh lọc = chạy truy vấn · ô bảng = mở chi tiết
    if KHO.match(tx): return LS
    if TRUYVAN.match(tx): return LUP
    if XEM.match(tx): return EYE
    if SUA_RE.match(tx): return SUA
    if XOA_RE.match(tx): return XOA
    return None


def khoi(s, i):
    d = 0
    for j in range(i, len(s)):
        if s[j] == '{': d += 1
        elif s[j] == '}':
            d -= 1
            if d == 0: return j
    return -1


loc = sys.argv[1] if len(sys.argv) > 1 else ''
tep = sorted(glob.glob('Apis*/Modules/*/script*/*.js') + glob.glob('assets/js/*.js'))
if loc: tep = [f for f in tep if loc.lower() in f.lower()]

loi = []
for f in tep:
    s = io.open(f, encoding='utf-8', errors='ignore').read()
    dong = lambda i: s.count('\n', 0, i) + 1

    # ums.ui.btn('kind', { text, icon })
    vt = 0
    while True:
        m = re.search(r"ui\.btn\('[a-z]+',\s*\{", s[vt:])
        if not m: break
        d0 = vt + m.end() - 1
        d1 = khoi(s, d0)
        if d1 < 0: break
        o = s[d0:d1 + 1]
        t = re.search(r"text:\s*'([^']*)'", o)
        if t:
            can = chuan(t.group(1))
            ic = re.search(r"icon:\s*'([^']*)'", o)
            if isinstance(can, tuple):
                if ic and not any(c in ic.group(1) for c in can): loi.append((f, dong(d0), t.group(1), ic.group(1), ' hoặc '.join(can)))
                vt = d1 + 1; continue
            if can and ic and can not in ic.group(1):
                loi.append((f, dong(d0), t.group(1), ic.group(1), can))
            elif can in (EYE, LS) and not ic:
                loi.append((f, dong(d0), t.group(1), '(chưa có)', can))
        vt = d1 + 1

    # nút biểu tượng trong bảng
    for m in re.finditer(r'ums-iconbtn[^>]*title="([^"]*)"[^>]*>\s*<i class="[^"]*?(fa-(?!light|solid|regular)[a-z0-9-]+)', s):
        can = chuan(m.group(1))
        if isinstance(can, tuple): can = can[1] if m.group(2) in can else can[1]
        if can and can != m.group(2):
            loi.append((f, dong(m.start()), m.group(1), m.group(2), can))

    # nút viết tay có chữ
    for m in re.finditer(r'<button[^>]*class="ums-btn[^"]*"[^>]*>(?:<i class="[^"]*?(fa-(?!light|solid|regular)[a-z0-9-]+)[^"]*"></i>)?\s*(?:<span>)?([^<]{2,28})', s):
        can = chuan(m.group(2))
        if isinstance(can, tuple):
            if (m.group(1) or '') in can: continue
            can = ' hoặc '.join(can)
        if can and (m.group(1) or '') != can:
            loi.append((f, dong(m.start()), m.group(2).strip(), m.group(1) or '(chưa có)', can))

for f, d, tx, ic, can in loi:
    print('%s:%d  %-22s  %-24s → %s' % (f.replace('\\', '/'), d, tx, ic, can))
print('---')
print('%d chỗ lệch chuẩn / %d tệp' % (len(loi), len(tep)))
sys.exit(1 if loi else 0)
