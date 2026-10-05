# -*- coding: utf-8 -*-
"""Sinh _v2/API.md — hợp đồng mọi hàm tầng chung (ums.*) từ CHÚ THÍCH ĐẦU HÀM trong mã.

    python _harness\sinh-api.py            # ghi _v2/API.md
    python _harness\sinh-api.py --kiem     # chỉ in hàm KHÔNG có chú thích (nợ tài liệu)

Vì sao: chuyển một màn phải mở ui.js / crud.js / patterns.js / ref.js / report.js… dò chữ ký từng hàm (phiên 5/10: hơn
mười lượt grep cho một màn). Tệp này gom lại một chỗ, sinh từ mã nên không lệch; sửa tầng chung xong chạy lại.

Cách lấy: với mỗi dòng `<bí danh>.<tên> = function (...)` thụt 4 khoảng trắng (hàm công khai của một namespace), lấy
khối chú thích đứng NGAY TRƯỚC (/* … */ hoặc các dòng // liên tiếp, cho phép cách một dòng trống) + dòng chữ ký.
Bí danh → ums.* đọc từ các dòng `var R = ums.report = …`, `var pat = ums.pat …`. Khối chú thích đầu tệp cũng đưa vào
(chứa hợp đồng của ums.crud, ums.files, ums.upload…). Chỉ lấy đoạn chú thích ≤ 60 dòng để tệp không phình.
"""
import io, os, re, sys

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(GOC, '_v2', 'assets', 'js')
RA = os.path.join(GOC, '_v2', 'API.md')
TEP = ['api.js', 'ui.js', 'crud.js', 'patterns.js', 'ref.js', 'report.js', 'editor.js', 'lamtruoc.js', 'app.js', 'session.js',
       'can-quyet.js', 'diemhoc.js', 'lich.js', 'phieu.js', 'thuvai.js', 'scroll.js', 'icon-fa4.js']
MAX_CT = 60

RE_DEF = re.compile(r'^ {4}([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*=\s*function\s*\(([^)]*)\)')
RE_ALIAS = re.compile(r'(?:var\s+)?([A-Za-z_]\w*)\s*=\s*(ums(?:\.[A-Za-z_]\w*)+)\s*=')
RE_ALIAS2 = re.compile(r'var\s+([A-Za-z_]\w*)\s*=\s*(ums(?:\.[A-Za-z_]\w*)+)\s*(?:\|\||;|$)')


def chu_thich_truoc(lines, i):
    """Khối chú thích ngay trước dòng i (bỏ qua ≤ 1 dòng trống). Trả về list dòng đã bỏ ký hiệu."""
    j = i - 1
    trong = 0
    while j >= 0 and lines[j].strip() == '':
        j -= 1; trong += 1
        if trong > 1: return []
    if j < 0: return []
    s = lines[j].rstrip()
    out = []
    if s.endswith('*/'):
        # lùi tới dòng mở /*
        k = j
        while k >= 0 and '/*' not in lines[k]:
            k -= 1
        if k < 0 or j - k > MAX_CT: return []
        for t in lines[k:j + 1]:
            t = t.strip()
            t = re.sub(r'^/\*+', '', t); t = re.sub(r'\*+/$', '', t); t = re.sub(r'^\*\s?', '', t)
            out.append(t)
    elif s.lstrip().startswith('//'):
        k = j
        while k >= 0 and lines[k].lstrip().startswith('//') and j - k < MAX_CT:
            k -= 1
        for t in lines[k + 1:j + 1]:
            out.append(t.strip()[2:].strip())
    # bỏ dòng kẻ ===== / ----- và dòng trống đầu/cuối
    out = [t for t in out if not re.match(r'^[=\-]{5,}$', t.strip())]
    while out and not out[0].strip(): out.pop(0)
    while out and not out[-1].strip(): out.pop()
    return out


def dau_tep(lines):
    if not lines or not lines[0].lstrip().startswith('/*'): return []
    k = 0
    while k < len(lines) and '*/' not in lines[k]: k += 1
    if k >= len(lines) or k > 120: return []
    out = []
    for t in lines[:k + 1]:
        t = t.rstrip(); t = re.sub(r'^\s*/\*+', '', t); t = re.sub(r'\*+/\s*$', '', t)
        if re.match(r'^\s*[=\-]{5,}\s*$', t): continue
        out.append(t.rstrip())
    while out and not out[0].strip(): out.pop(0)
    while out and not out[-1].strip(): out.pop()
    return out


def xu_ly(ten):
    duong = os.path.join(JS, ten)
    if not os.path.exists(duong): return None
    lines = io.open(duong, encoding='utf-8', errors='ignore').read().split('\n')
    alias = {'ums': 'ums'}
    for s in lines:
        for m in RE_ALIAS.finditer(s): alias[m.group(1)] = m.group(2)
        m = RE_ALIAS2.search(s)
        if m and m.group(1) not in alias: alias[m.group(1)] = m.group(2)
    hams, thieu = [], []
    for i, s in enumerate(lines):
        m = RE_DEF.match(s)
        if not m: continue
        a, ten_ham, tham = m.group(1), m.group(2), m.group(3).strip()
        ns = alias.get(a)
        if not ns: continue
        ct = chu_thich_truoc(lines, i)
        hams.append((ns + '.' + ten_ham, tham, i + 1, ct))
        if not ct: thieu.append((ns + '.' + ten_ham, i + 1))
    return {'ten': ten, 'dau': dau_tep(lines), 'hams': hams, 'thieu': thieu}


def main():
    kiem = '--kiem' in sys.argv
    ket = [xu_ly(t) for t in TEP]
    ket = [k for k in ket if k]
    if kiem:
        for k in ket:
            for h, d in k['thieu']: print('%s:%d  %s  (không có chú thích)' % (k['ten'], d, h))
        return
    out = ['# API tầng chung `_v2` — SINH TỰ ĐỘNG từ chú thích trong mã', '',
           'Chạy lại: `python _harness\\sinh-api.py` (sau mỗi lần sửa `_v2/assets/js/*.js`). KHÔNG sửa tay tệp này — sửa chú thích đầu hàm trong mã.',
           'Chuyển màn: đọc tệp này (tìm theo tên hàm) thay vì mở mã tầng chung. Tuỳ chọn của `ums.crud` nằm ở khối đầu `crud.js`.',
           'Lớp CSS có sẵn: `_v2/CLASS.md`. Tóm tắt màn gốc: `python _harness\\tom-tat-goc.py <html> [js]`.', '',
           '## Mục lục', '']
    for k in ket:
        out.append('- **%s** (%d hàm): %s' % (k['ten'], len(k['hams']), ', '.join('`' + h[0] + '`' for h in k['hams'])))
    for k in ket:
        out += ['', '---', '', '## %s' % k['ten'], '']
        if k['dau']:
            out += ['<details><summary>Khối chú thích đầu tệp (hợp đồng chung)</summary>', '', '```text'] + k['dau'] + ['```', '', '</details>', '']
        for h, tham, dong, ct in k['hams']:
            out.append('### `%s(%s)`  <sub>%s:%d</sub>' % (h, tham, k['ten'], dong))
            out.append('')
            if ct: out += ['```text'] + ct + ['```']
            else: out.append('_(chưa có chú thích trong mã)_')
            out.append('')
    io.open(RA, 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')
    n = sum(len(k['hams']) for k in ket); t = sum(len(k['thieu']) for k in ket)
    print('Đã ghi %s — %d hàm / %d tệp, %d hàm chưa có chú thích (xem --kiem), %d KB' % (RA, n, len(ket), t, os.path.getsize(RA) // 1024))


if __name__ == '__main__':
    main()
