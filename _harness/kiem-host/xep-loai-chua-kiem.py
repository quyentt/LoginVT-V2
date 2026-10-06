# -*- coding: utf-8 -*-
"""Xếp loại màn ĐÃ CHUYỂN (_v2) nhưng KHÔNG CÓ trong sổ đã kiểm host của một phân hệ đã kiểm — người dùng 6/10:
"những màn không kiểm phải ghi rõ lý do". Cùng cách đã làm tay với Cổng cán bộ 6/10.

    PYTHONIOENCODING=utf-8 python _harness/kiem-host/xep-loai-chua-kiem.py            # chỉ in, không ghi
    PYTHONIOENCODING=utf-8 python _harness/kiem-host/xep-loai-chua-kiem.py --ghi      # ghi sổ da-kiem.json (mục tay)
    ... --app ApisTaiChinh                                                               # một phân hệ

Nguồn đối chiếu:
  · bản xuất mapping chức năng host  _harness/gui-help/mapping-chuc-nang_<ngày mới nhất>.json (node xuat-mapping.js)
  · kết quả đọc sâu các vai trò đã dùng cho phân hệ  %TEMP%/ums-kiem-host/ketqua-<6 ký tự>-sau.json
Kết luận cho từng màn chưa có trong sổ:
  · có trong ketqua của vai trò thử  → "trên menu, chưa ghi sổ" — KHÔNG ghi, chạy lại ghi-da-kiem.js
  · không trong ketqua, mapping KHÔNG có chức năng trỏ tới tệp → doc = khong-tren-menu, "host CHƯA KHAI chức năng"
  · không trong ketqua, mapping CÓ chức năng                → doc = khong-tren-menu, "CÓ chức năng nhưng chưa gán vai trò thử" (ghi functionId)
Mục đã có "tay": true không bị đụng.
"""
import glob
import json
import os
import re
import sys

GOC = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SO = os.path.join(GOC, '_harness', 'kiem-host', 'da-kiem.json')
TMP = os.path.join(os.environ.get('TEMP', '/tmp'), 'ums-kiem-host')
GHI = '--ghi' in sys.argv
APP = sys.argv[sys.argv.index('--app') + 1] if '--app' in sys.argv else None
NGAY = os.environ.get('NGAY', '6/10')

mf = sorted(glob.glob(os.path.join(GOC, '_harness', 'gui-help', 'mapping-chuc-nang_*.json')))
if not mf:
    sys.exit('Chưa có bản xuất mapping — chạy node _harness/kiem-host/xuat-mapping.js trước')
mapping = json.load(open(mf[-1], encoding='utf-8'))
ngayMap = re.search(r'_(\d{4})(\d{2})(\d{2})', mf[-1])
ngayMap = '%s/%s/%s' % (ngayMap.group(3), ngayMap.group(2), ngayMap.group(1)) if ngayMap else '?'
# tệp (thường) → danh sách chức năng
cn = {}
for x in mapping['functions']:
    f = (x.get('file') or '').lower().replace('\\', '/')
    if f:
        cn.setdefault(f, []).append(x)

so = json.load(open(SO, encoding='utf-8'))
tong = {'tren-menu': 0, 'chua-khai': 0, 'co-cn': 0}
for app, p in so.items():
    if APP and app != APP:
        continue
    # màn có trong ketqua các vai trò thử của phân hệ
    trenMenu = {}
    for r in p.get('vaiTro', []):
        kq = os.path.join(TMP, 'ketqua-%s-sau.json' % r[:6])
        if os.path.exists(kq):
            for x in json.load(open(kq, encoding='utf-8')):
                m = re.search(r'/modules/([^/]+)/html/([^/.]+)\.html', x.get('path') or '', re.I)
                if m:
                    trenMenu[(m.group(1) + '/' + m.group(2)).lower()] = x.get('ten', '')
    ds = []
    for f in sorted(glob.glob(os.path.join(GOC, '_v2', app, 'Modules', '*', 'html', '*.html'))):
        f = f.replace(os.sep, '/')
        mod, tep = f.split('/')[-3], os.path.basename(f)[:-5]
        k = (mod + '/' + tep).lower()
        if k in p['man']:
            continue
        tepGoc = ('%s/modules/%s/html/%s.html' % (app, mod, tep)).lower()
        if k in trenMenu:
            tong['tren-menu'] += 1
            ds.append((k, 'TRÊN MENU, chưa ghi sổ → chạy lại ghi-da-kiem.js', None))
            continue
        cns = cn.get(tepGoc, [])
        if cns:
            tong['co-cn'] += 1
            c = cns[0]
            ghiChu = ('%s: KHÔNG có trên menu vai trò thử nhưng CÓ chức năng trong CSDL host (id %s, mã %s, "%s"; mapping %s) → gán chức năng này vào vai trò thử trên host rồi kiểm bằng chay-vaitro.js.'
                      % (NGAY, c.get('functionId'), c.get('code'), c.get('name'), ngayMap))
        else:
            tong['chua-khai'] += 1
            ghiChu = ('%s: host CHƯA KHAI chức năng cho màn này (không có trong CSDL host — bản xuất mapping %s, %d chức năng) → chỉ kiểm được khi host khai chức năng.'
                      % (NGAY, ngayMap, len(mapping['functions'])))
        ds.append((k, ghiChu, {'ten': cns[0].get('name', '') if cns else '', 'doc': 'khong-tren-menu', 'ghi': 'khong-thu', 'ghiChu': ghiChu, 'tay': True}))
    if not ds:
        continue
    print('\n== %s (%d màn chưa có trong sổ)' % (app, len(ds)))
    for k, ly, muc in ds:
        print('  %-45s %s' % (k, ly[:110]))
        if GHI and muc:
            p['man'][k] = muc
if GHI:
    with open(SO, 'w', encoding='utf-8') as fh:
        json.dump(so, fh, ensure_ascii=False, indent=1)
        fh.write('\n')
    print('\nĐã ghi sổ', SO)
print('\nTổng:', tong, '(--ghi để ghi sổ)' if not GHI else '')
