# -*- coding: utf-8 -*-
"""Sinh _v2/CLASS.md — bảng kê MỌI lớp `.ums-*` đang có trong CSS nguồn, kèm tệp + chú thích gần nhất.

    python _harness\sinh-class.py

Vì sao: viết màn hay đoán tên lớp (phiên 5/10: `ums-note`, `ums-h4` không tồn tại → vỡ bố cục, phải grep lại). Có bảng
này thì tra một lần. Chỉ quét CSS NGUỒN (`_v2/assets/css/**/*.css`, bỏ *.bundle.css và vendor/). Sửa CSS xong chạy lại
(gop-css.py không tự gọi — chạy tay cùng lúc).
"""
import io, os, re, glob

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(GOC, '_v2', 'assets', 'css')
RA = os.path.join(GOC, '_v2', 'CLASS.md')
RE_CLS = re.compile(r'\.(ums-[A-Za-z0-9_-]+)')
RE_CMT = re.compile(r'/\*(.*?)\*/', re.S)


def main():
    teps = sorted(glob.glob(os.path.join(CSS, '**', '*.css'), recursive=True))
    teps = [t for t in teps if not t.endswith('.bundle.css') and os.sep + 'vendor' + os.sep not in t]
    lop = {}   # tên → {'tep': set, 'ct': chú thích đầu tiên gặp}
    for t in teps:
        s = io.open(t, encoding='utf-8', errors='ignore').read()
        rel = os.path.relpath(t, CSS).replace('\\', '/')
        # đi theo thứ tự: nhớ chú thích gần nhất, gán cho lớp xuất hiện sau nó
        pos, ct = 0, ''
        for m in re.finditer(r'/\*(.*?)\*/|\.(ums-[A-Za-z0-9_-]+)', s, re.S):
            if m.group(1) is not None:
                c = ' '.join(x.strip() for x in m.group(1).strip().split('\n') if x.strip() and not re.match(r'^[=\-]{5,}$', x.strip()))
                ct = c[:140]
            else:
                n = m.group(2)
                d = lop.setdefault(n, {'tep': set(), 'ct': ct})
                d['tep'].add(rel)
                if not d['ct'] and ct: d['ct'] = ct
    # gom theo gốc (ums-btn, ums-btn--sm, ums-btn__x → nhóm ums-btn)
    nhom = {}
    for n in lop:
        g = re.split(r'--|__', n)[0]
        nhom.setdefault(g, []).append(n)
    out = ['# Lớp CSS `_v2` — SINH TỰ ĐỘNG (`python _harness\\sinh-class.py`)', '',
           'Chỉ những lớp có ở đây mới tồn tại. Tiền tố: `ums-u-*` tiện ích (lề, cỡ chữ, màu nhạt), `ums-grid--N` lưới N cột, `is-*` trạng thái (xem CSS).',
           'Màn KHÔNG tự đặt tên lớp mới trong JS; cần lớp mới → thêm vào CSS nguồn + chạy lại tệp này + `gop-css.py`.', '',
           '| Nhóm | Các lớp | Tệp | Chú thích gần nhất trong CSS |', '|---|---|---|---|']
    for g in sorted(nhom):
        ds = sorted(nhom[g])
        teps_g = sorted(set(x for n in ds for x in lop[n]['tep']))
        ct = next((lop[n]['ct'] for n in ds if lop[n]['ct']), '')
        out.append('| `%s` | %s | %s | %s |' % (g, ' '.join('`' + n + '`' for n in ds), ', '.join(teps_g), ct.replace('|', '\\|')))
    io.open(RA, 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')
    print('Đã ghi %s — %d lớp / %d nhóm / %d tệp CSS, %d KB' % (RA, len(lop), len(nhom), len(teps), os.path.getsize(RA) // 1024))


if __name__ == '__main__':
    main()
