# -*- coding: utf-8 -*-
"""Sinh bảng đổi tên icon Font Awesome 4 -> Font Awesome 7 cho _v2 (TENANH của bảng chức năng là tên FA4).
Cách làm: tên FA4 -> mã ký tự (codepoint) — ưu tiên phần ghi đè trong v4-shims.css của FA Pro 6.4.2 (có sẵn trong dự án gốc),
thiếu thì lấy từ font-awesome 4.7 — rồi tìm tên FA7 có CÙNG mã trong _v2/assets/vendor/fontawesome/css/fontawesome.min.css.
Chạy lại khi nâng Font Awesome:  python _harness/sinh-fa4.py   -> ghi _v2/assets/js/icon-fa4.js
"""
import re, os, json
GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FA4 = open(os.path.join(GOC, 'App_Themes/Plugins/font-awesome/css/font-awesome.min.css'), encoding='utf-8', errors='ignore').read()
SHIM = open(os.path.join(GOC, 'App_Themes/Cms/fonts/FontAwesome.Pro.6.4.2/css/v4-shims.css'), encoding='utf-8', errors='ignore').read()
FA7 = open(os.path.join(GOC, '_v2/assets/vendor/fontawesome/css/fontawesome.min.css'), encoding='utf-8', errors='ignore').read()
# Icon THƯƠNG HIỆU của FA7 nằm riêng ở brands.min.css (2026-09-26: bộ cũ chỉ tra fontawesome.min.css nên 16 bí danh thương
# hiệu FA4 — ge, ra, yc, wechat, gittip, youtube-play… — giữ nguyên tên, FA7 không có → glyph rỗng; bên Help bắt được "fa-ge").
FA7B = open(os.path.join(GOC, '_v2/assets/vendor/fontawesome/css/brands.min.css'), encoding='utf-8', errors='ignore').read()

def cp(s): return s.lower().lstrip('\\').lstrip('0') or '0'

# FA4: ".fa-a:before,.fa-b:before{content:"\f000"}"
fa4 = {}
for sel, c in re.findall(r'((?:\.fa-[a-z0-9-]+:before,?)+)\{content:"([^"]+)"\}', FA4):
    for n in re.findall(r'\.fa-([a-z0-9-]+):before', sel):
        fa4[n] = cp(c)
# shims: ".fa.fa-x:before{content:"\f3d1"}" + ".fa.fa-x{font-family:"Font Awesome 6 Brands"...}"
shim_cp, brand, regular = {}, set(), set()
for sel, body in re.findall(r'([^{}]+)\{([^}]*)\}', SHIM):
    names = re.findall(r'\.fa\.fa-([a-z0-9-]+)(:before)?', sel)
    m = re.search(r'content:"([^"]+)"', body)
    for n, bef in names:
        if bef and m: shim_cp[n] = cp(m.group(1))
        if not bef and 'Brands' in body: brand.add(n)
        if not bef and 'font-weight:400' in body: regular.add(n)
# FA7: ".fa-a,.fa-b{--fa:"\f000"}"  -> codepoint -> [names]
fa7_cp, fa7_names = {}, set()
for sel, c in re.findall(r'((?:\.fa-[a-z0-9-]+,?)+)\{--fa:"([^"]+)"', FA7):
    ns = re.findall(r'\.fa-([a-z0-9-]+)', sel)
    for n in ns: fa7_names.add(n)
    fa7_cp.setdefault(cp(c), []).extend(ns)

fa7b_cp, fa7b_names = {}, set()
for sel, c in re.findall(r'((?:\.fa-[a-z0-9-]+,?)+)\{--fa:"([^"]+)"', FA7B):
    ns = re.findall(r'\.fa-([a-z0-9-]+)', sel)
    for x in ns: fa7b_names.add(x)
    fa7b_cp.setdefault(cp(c), []).extend(ns)

doi, thuongHieu, thieu = {}, [], []
for n in sorted(set(fa4) | set(shim_cp)):
    c = shim_cp.get(n, fa4.get(n))
    if n in brand:
        thuongHieu.append(n)
        if n in fa7b_names: continue           # tên thương hiệu còn nguyên trong FA7
        ds = fa7b_cp.get(c) or fa7b_cp.get(fa4.get(n))
        if ds: doi[n] = ds[0]
        else: thieu.append(n)
        continue
    m7 = re.search(r'\.fa-' + re.escape(n) + r'(?=[,{])[^{]*\{--fa:"([^"]+)"', FA7)
    if m7 and (cp(m7.group(1)) == c or not m7.group(1).startswith(chr(92))):
        continue                      # cùng tên còn trong FA7 (cùng ký tự, hoặc FA7 ghi ký tự thường như "*") -> không đổi
    ds = fa7_cp.get(c)
    if ds: doi[n] = ds[0]
    elif n not in brand: thieu.append(n)

out = """/* =========================================================================
   ums.iconFA4(tên) — đổi tên icon Font Awesome 4 (TENANH của bảng chức năng, vd "fa fa-money") sang Font Awesome 7.
   TỰ SINH bởi _harness/sinh-fa4.py (đối chiếu mã ký tự FA4 / v4-shims FA 6.4.2 / FA7) — đừng sửa tay, chạy lại script.
   ums.iconFA4('fa fa-bar-chart')  -> 'fa-light fa-chart-bar'
   ums.iconFA4('fa fa-facebook')   -> 'fa-brands fa-facebook'
   Tên đã là cú pháp FA6/7 (fa-light …, fa-solid …) thì giữ nguyên.
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums || (global.ums = {});
    var DOI = %s;
    var THUONGHIEU = %s;
    ums.iconFA4 = function (t, kieu) {
        t = String(t || '').trim();
        if (!t) return '';
        /* _v2 không có phông duotone (chỉ light/regular/solid/brands) → đổi sang light */
        if (/^(fad|fa-duotone|fa-sharp-duotone)\\s/.test(t)) return t.replace(/^(fad|fa-duotone|fa-sharp-duotone)(\\s+fa-(solid|light|regular|thin))?\\s+/, 'fa-light ');
        var m =/^fa\\s+(?:fa-lg\\s+|fa-fw\\s+)*fa-([a-z0-9-]+)(.*)$/.exec(t);
        if (!m) return t;
        var ten = m[1], them = m[2] || '';
        if (THUONGHIEU.indexOf(ten) >= 0) return 'fa-brands fa-' + (DOI[ten] || ten) + them;
        return (kieu || 'fa-light') + ' fa-' + (DOI[ten] || ten) + them;
    };
})(window);
""" % (json.dumps(doi, ensure_ascii=False, sort_keys=True).replace('", "', '",\n        "'), json.dumps(sorted(thuongHieu)))
open(os.path.join(GOC, '_v2/assets/js/icon-fa4.js'), 'w', encoding='utf-8').write(out)
print('FA4:', len(fa4), 'doi ten:', len(doi), 'thuong hieu:', len(thuongHieu), 'khong co trong FA7:', len(thieu), thieu[:40])
