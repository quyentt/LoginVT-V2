# -*- coding: utf-8 -*-
"""Quét mọi tên icon 'fa-…' trong _v2 (js/html/css, trừ vendor) và báo tên KHÔNG có trong Font Awesome 7 của _v2.
Chạy:  python _harness/kiem-icon.py        (in: tệp:dòng  tên)
"""
import re, os, sys
sys.stdout.reconfigure(encoding="utf-8")
GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V2 = os.path.join(GOC, '_v2')
FA7 = open(os.path.join(V2, 'assets/vendor/fontawesome/css/fontawesome.min.css'), encoding='utf-8', errors='ignore').read()
ten = set(re.findall(r'\.fa-([a-z0-9-]+)(?=[,{:\s.])', FA7))
BO = {'light', 'solid', 'regular', 'brands', 'thin', 'duotone', 'sharp', 'classic', 'fw', 'lg', 'xs', 'sm', 'xl', '2x', '3x', '4x', '5x', 'spin', 'pulse',
      'fade', 'beat', 'bounce', 'shake', 'flip', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'border', 'pull-left', 'pull-right',
      'stack', 'stack-1x', 'stack-2x', 'inverse', 'li', 'ul', 'width-auto', 'semibold', 'chisel', 'etch', 'jelly', 'notdog', 'slab', 'whiteboard', 'thumbprint'}
thieu = {}
for goc, _, tep in os.walk(V2):
    if 'vendor' in goc.replace('\\', '/').split('/'): continue
    for t in tep:
        if not t.endswith(('.js', '.html', '.css', '.aspx')) or t == 'icon-fa4.js': continue
        p = os.path.join(goc, t)
        for i, dong in enumerate(open(p, encoding='utf-8', errors='ignore'), 1):
            for n in re.findall(r"(?<![\w-])fa-([a-z0-9][a-z0-9-]*[a-z0-9])(?![\w-])", dong):
                if n in BO or n in ten or n.startswith(('light', 'solid', 'regular')): continue
                thieu.setdefault(n, []).append(os.path.relpath(p, GOC) + ':' + str(i))
for n in sorted(thieu):
    print('%-28s %d chỗ  %s' % (n, len(thieu[n]), ', '.join(thieu[n][:3])))
print('TỔNG tên không có trong FA7:', len(thieu))
