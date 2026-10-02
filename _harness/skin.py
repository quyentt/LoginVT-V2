# -*- coding: utf-8 -*-
"""
Lột da màn hình CŨ (vẫn chạy trong vỏ indexi.aspx) bằng bộ class `ums-` của _v2 — CHỈ markup + CSS, không thêm JS.

Mọi thứ nằm ở  App_Themes/Cms/Custom_V1/ums/  (thư mục MỚI, kho gốc không có → pull không bao giờ đè):
    ums-skin.css         bản gộp — màn đã lột da nạp bằng một thẻ <link> đầu tệp html (tự sinh, ĐỪNG sửa tay)
    cau-noi.css          tầng cầu nối viết tay: vẽ lại markup do JS gốc sinh (btn-default, td-center, phân trang…)
    html/<đường dẫn>     bản LỘT DA của từng màn — NGUỒN để sửa
    goc/<đường dẫn>      bản gốc của kho tại lúc lột da — MỐC để biết kho gốc có đổi màn đó không

Tệp html gốc (vd ApisQuanLyThiTracNghiem/Modules/quanlybode/html/quanlybode.html) được CHÉP ĐÈ bằng bản lột da.
Pull kho gốc có thể đè lại → sau mỗi lần pull chạy:  python _harness/skin.py kiem   rồi   python _harness/skin.py ap

Lệnh:
    css                  gộp lại ums-skin.css (sửa CSS _v2 hoặc cau-noi.css xong thì chạy)
    them <đường dẫn>     bắt đầu lột da một màn: chép bản gốc vào goc/ và html/ (rồi sửa html/)
    kiem                 tình trạng từng màn + kiểm móc JS (id, name, class mà JS dùng) không bị mất
    ap                   chép html/ đè lên tệp gốc cho màn "chưa áp"; màn "kho gốc đã đổi" thì dừng, in diff
    nhan <đường dẫn>     đã chuyển thay đổi của kho gốc vào html/ → lấy bản gốc hiện tại làm mốc mới
    dong-goi             dựng lại _v1_deploy/ (xoá trắng) — cây thư mục như gốc web, người dùng chép đè thẳng lên gốc ứng dụng
                         (cùng cấp indexi.aspx): html các màn "đang áp" + App_Themes/Cms/Custom_V1/ums/ums-skin.css
"""
import difflib, os, re, shutil, sys
from html.parser import HTMLParser

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIN = os.path.join(GOC, 'App_Themes', 'Cms', 'Custom_V1', 'ums')
V2CSS = os.path.join(GOC, '_v2', 'assets', 'css')
SCOPE = '.ums-skin'

# Thứ tự như main.css của _v2 (bỏ reset / shell / nav — vỏ indexi tự lo khung trang)
NGUON_CSS = [
    'settings/tokens.css', 'elements/base.css', 'objects/grid.css',
    'components/panel.css', 'components/button.css', 'components/field.css', 'components/table.css',
    'components/pager.css', 'components/tabs.css', 'components/chip.css',
    'vendor/select2.css', 'utilities/utilities.css',
]

# Class mà Corei / thư viện dùng làm móc dù không xuất hiện dạng ".x" trong JS của màn
MOC_CHUNG = {'select-opt', 'select-opt-img', 'chosen-select', 'zone-bus', 'tab-pane', 'tab-content', 'active',
             'lang', 'btn', 'form-control', 'btnClose'}
# Móc chỉ có nghĩa trên phần tử có id (Corei showAllId, Ctrl+Y) — phần tử trang trí không id được bỏ class
DEM_THEO_ID = {'btn', 'form-control'}
# Dòng chú thích đầu mọi bản lột da — nhận ra tệp gốc đang mang bản lột da (cũ hay mới)
DAU_LOT_DA = 'ums-skin'

sys.stdout.reconfigure(encoding='utf-8')


# ---------------------------------------------------------------- CSS ----
def bo_chu_thich(s):
    return re.sub(r'/\*.*?\*/', '', s, flags=re.S)


def tach_phay(sel):
    """Tách danh sách selector theo dấu phẩy ở tầng ngoài (không tách trong :is(...), :not(...))."""
    out, d, cur = [], 0, ''
    for ch in sel:
        if ch in '([': d += 1
        elif ch in ')]': d -= 1
        if ch == ',' and d == 0:
            out.append(cur); cur = ''
        else:
            cur += ch
    out.append(cur)
    return [x.strip() for x in out if x.strip()]


def gan_pham_vi(sel):
    m = re.match(r'^(:root|html|body)\b(.*)$', sel)
    if m:
        return SCOPE + m.group(2)
    return SCOPE + ' ' + sel


def khoi(s, i):
    """s[i] == '{' → trả vị trí ngay sau '}' tương ứng."""
    d = 0
    while i < len(s):
        if s[i] == '{': d += 1
        elif s[i] == '}':
            d -= 1
            if d == 0: return i + 1
        elif s[i] in '"\'':
            q = s[i]; i += 1
            while s[i] != q: i += 2 if s[i] == '\\' else 1
        i += 1
    raise ValueError('thiếu }')


def pham_vi_css(s):
    out, i = [], 0
    while i < len(s):
        if s[i].isspace():
            i += 1; continue
        j = s.find('{', i)
        k = s.find(';', i)
        if s[i] == '@' and (j < 0 or (0 <= k < j)):          # @import …;  @charset …;
            i = k + 1; continue
        if j < 0: break
        dau = s[i:j].strip()
        e = khoi(s, j)
        than = s[j + 1:e - 1]
        if dau.startswith('@'):
            ten = dau.split()[0]
            if ten in ('@media', '@supports', '@container', '@layer'):
                out.append(dau + ' {\n' + pham_vi_css(than) + '}\n')
            else:                                             # @keyframes, @font-face: giữ nguyên
                out.append(dau + ' {' + than + '}\n')
        else:
            out.append(',\n'.join(gan_pham_vi(x) for x in tach_phay(dau)) + ' {' + than + '}\n')
        i = e
    return ''.join(out)


def lenh_css():
    phan = ['/* TỰ SINH bằng  python _harness/skin.py css  — ĐỪNG sửa tay.\n'
            '   Nguồn: _v2/assets/css (gói trong ' + SCOPE + ') + cau-noi.css. */\n']
    for f in NGUON_CSS:
        with open(os.path.join(V2CSS, f), encoding='utf-8') as fh:
            phan.append('\n/* ---- ' + f + ' ---- */\n' + pham_vi_css(bo_chu_thich(fh.read())))
    with open(os.path.join(SKIN, 'cau-noi.css'), encoding='utf-8') as fh:
        phan.append('\n/* ---- cau-noi.css ---- */\n' + fh.read())
    ra = os.path.join(SKIN, 'ums-skin.css')
    with open(ra, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(''.join(phan))
    print('Đã gộp', os.path.relpath(ra, GOC), '(%d KB)' % (os.path.getsize(ra) // 1024))
    # số phiên bản trên thẻ <link> của mọi màn lột da = giờ gộp → host không dùng CSS cũ trong bộ nhớ đệm
    v = str(int(os.path.getmtime(ra)))
    for rel in ds_man():
        f = os.path.join(SKIN, 'html', rel)
        t = doc(f)
        t2 = re.sub(r'(ums-skin\.css\?v=)\w+', r'\g<1>' + v, t)
        if t2 != t:
            with open(f, 'w', encoding='utf-8', newline='') as fh: fh.write(t2)
            print('   ?v=' + v, rel, '— nhớ chạy `skin.py ap`')


# ---------------------------------------------------------------- HTML ---
def doc(p):
    with open(p, encoding='utf-8-sig') as fh:
        return fh.read()


def ds_man():
    goc_html = os.path.join(SKIN, 'html')
    for r, _, fs in os.walk(goc_html):
        for f in fs:
            if f.endswith('.html'):
                yield os.path.relpath(os.path.join(r, f), goc_html).replace('\\', '/')


def js_cua_man(rel, html):
    """JS của Corei + các tệp <script src> màn nạp (đường dẫn 'modules/…' tính từ phân hệ)."""
    tep = [os.path.join(GOC, 'Corei', f) for f in os.listdir(os.path.join(GOC, 'Corei')) if f.endswith('.js')]
    phan_he = rel.split('/')[0]
    for src in re.findall(r'<script[^>]+src="([^"?]+)', html):
        p = os.path.join(GOC, phan_he, 'Modules', src[8:]) if src.lower().startswith('modules/') else os.path.join(GOC, src)
        if os.path.exists(p): tep.append(p)
        else: print('   (không thấy tệp JS màn nạp: ' + src + ')')
    return '\n'.join(doc(t) for t in tep)


def moc(html, js):
    ids = set(re.findall(r'\bid="([^"]+)"', html))
    names = set(re.findall(r'\bname="([^"]+)"', html))
    lop = set()
    for v in re.findall(r'\bclass="([^"]*)"', html): lop.update(v.split())
    lop_moc = {c for c in lop if c in MOC_CHUNG or re.search(r'[\'"\s,(>+~]\.' + re.escape(c) + r'(?![\w-])', js)
               or re.search(r'getElementsByClassName\(\s*[\'"]' + re.escape(c) + r'[\'"]', js)}
    return ids, names, lop_moc


class _Khung(HTMLParser):
    """Thẻ ở tầng 0 và 1 (bỏ script / link / style): (tầng, thẻ, class, có id)."""
    RONG = {'br', 'hr', 'img', 'input', 'link', 'meta', 'col', 'source', 'wbr'}

    def __init__(self):
        super().__init__(); self.sau = 0; self.ra = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if self.sau <= 1 and tag not in ('script', 'link', 'style'):
            self.ra.append((self.sau, tag, set((a.get('class') or '').split()), bool(a.get('id'))))
        if tag not in self.RONG: self.sau += 1

    def handle_endtag(self, tag):
        if tag not in self.RONG: self.sau -= 1


def khung_ngoai(html):
    k = _Khung(); k.feed(html); return k.ra


def kiem_khung(goc, moi):
    """Khung ngoài của vỏ (#main-content-wrapper > section.content > div.col-lg-12 …) phải giữ nguyên: mọi thẻ KHÔNG id ở
    tầng 0–1 của bản gốc phải có ở bản mới, cùng tầng, cùng thẻ, đủ class cũ (được thêm class)."""
    moi_k = khung_ngoai(moi)
    loi = []
    for d, t, c, co_id in khung_ngoai(goc):
        if co_id: continue
        if not any(d2 == d and t2 == t and c <= c2 for d2, t2, c2, _ in moi_k):
            loi.append('mất khung ngoài tầng %d: <%s class="%s">' % (d, t, ' '.join(sorted(c))))
    return loi


def kiem_moc(rel):
    goc = doc(os.path.join(SKIN, 'goc', rel))
    moi = doc(os.path.join(SKIN, 'html', rel))
    ids, names, lop = moc(goc, js_cua_man(rel, goc))
    ids2, names2, _ = moc(moi, '')
    lop2 = set()
    for v in re.findall(r'\bclass="([^"]*)"', moi): lop2.update(v.split())
    loi = kiem_khung(goc, moi)
    if ids - ids2: loi.append('thiếu id: ' + ', '.join(sorted(ids - ids2)))
    if names - names2: loi.append('thiếu name: ' + ', '.join(sorted(names - names2)))
    if lop - lop2: loi.append('thiếu class móc JS: ' + ', '.join(sorted(lop - lop2)))
    # Mỗi phần tử CÓ id mang class móc ở bản gốc phải còn mang class đó (Corei showAllId đọc id theo .btn /
    # .form-control / .select-opt; màn gắn sự kiện theo class). Phần tử không id: đếm số lần.
    def the(html, c):
        co_id, khong = set(), 0
        for t in re.findall(r'<[a-zA-Z][^>]*>', html):
            m = re.search(r'\bclass="([^"]*)"', t)
            if m and c in m.group(1).split():
                i = re.search(r'\bid="([^"]+)"', t)
                if i: co_id.add(i.group(1))
                else: khong += 1
        return co_id, khong
    for c in sorted(lop & lop2):
        (ia, na), (ib, nb) = the(goc, c), the(moi, c)
        if ia - ib: loi.append('class móc "%s" mất trên id: %s' % (c, ', '.join(sorted(ia - ib))))
        if nb < na and c not in DEM_THEO_ID:
            loi.append('class móc "%s" (phần tử không id): gốc %d chỗ, bản mới %d' % (c, na, nb))
    return loi, len(ids), sorted(lop)


def tinh_trang(rel):
    that = os.path.join(GOC, rel)
    t = doc(that) if os.path.exists(that) else None
    g = doc(os.path.join(SKIN, 'goc', rel))
    m = doc(os.path.join(SKIN, 'html', rel))
    if t is None: return 'mất tệp gốc', t, g
    if t == m: return 'đang áp', t, g
    if t == g: return 'chưa áp', t, g
    if DAU_LOT_DA in t: return 'bản lột da cũ', t, g      # đã áp một bản trước, html/ vừa sửa tiếp
    return 'kho gốc đã đổi', t, g


def lenh_kiem():
    co_loi = False
    for rel in sorted(ds_man()):
        tt, t, g = tinh_trang(rel)
        loi, n_id, lop = kiem_moc(rel)
        print(('OK ' if not loi and tt == 'đang áp' else '!! ') + rel)
        print('   tình trạng:', tt, '| id giữ:', n_id, '| class móc:', ' '.join(lop))
        for x in loi: print('   ' + x)
        if tt == 'kho gốc đã đổi':
            print('   Kho gốc đổi màn này so với mốc — chuyển thay đổi sau vào html/ rồi `skin.py nhan ' + rel + '`:')
            for d in difflib.unified_diff(g.splitlines(), t.splitlines(), 'mốc', 'gốc hiện tại', lineterm='', n=1):
                print('     ' + d)
        co_loi = co_loi or bool(loi) or tt != 'đang áp'
    sys.exit(1 if co_loi else 0)


def lenh_ap():
    for rel in sorted(ds_man()):
        tt, _, _ = tinh_trang(rel)
        loi, _, _ = kiem_moc(rel)
        if loi:
            print('BỎ  ' + rel + ' — bản lột da thiếu móc JS:', '; '.join(loi)); continue
        if tt in ('chưa áp', 'đang áp', 'bản lột da cũ'):
            shutil.copyfile(os.path.join(SKIN, 'html', rel), os.path.join(GOC, rel))
            print('ÁP  ' + rel)
        else:
            print('DỪNG ' + rel + ' — ' + tt + ' (chạy `skin.py kiem` xem diff)')


def lenh_them(rel):
    rel = rel.replace('\\', '/').lstrip('./')
    for d in ('goc', 'html'):
        p = os.path.join(SKIN, d, rel)
        if os.path.exists(p): sys.exit('Đã có ' + p)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        shutil.copyfile(os.path.join(GOC, rel), p)
    print('Đã chép bản gốc vào goc/ và html/ — sửa', os.path.join('App_Themes/Cms/Custom_V1/ums/html', rel))


def duong_that(rel):
    """Đường dẫn đúng cách viết hoa / thường trên đĩa (kho có 'modules' viết thường) — IIS không phân biệt, nhưng giữ cho khớp."""
    cur = GOC
    for phan in rel.split('/'):
        ten = next((x for x in os.listdir(cur) if x.lower() == phan.lower()), phan)
        cur = os.path.join(cur, ten)
    return os.path.relpath(cur, GOC)


def css_cua_man(rel):
    """Tệp .css trong phân hệ mà bản lột da nạp bằng <link href="modules/…"> (vd modules/quanlythi/css/quanlythi.css)
    — để `dong-goi` gói theo màn (CSS tách khỏi html). Trả đường dẫn tương đối GOC, hoặc [] nếu không có."""
    out = []
    moi = doc(os.path.join(SKIN, 'html', rel))
    phan_he = rel.split('/')[0]
    for href in re.findall(r'<link[^>]+href="([^"]+\.css)', moi):
        if href.lower().startswith('modules/'):
            p = os.path.join(GOC, phan_he, href)
            if os.path.exists(p):
                out.append(duong_that(os.path.join(phan_he, href)).replace('\\', '/'))
            else:
                print('   (không thấy tệp CSS màn nạp: ' + href + ')')
    return out


def lenh_dong_goi():
    ra = os.path.join(GOC, '_v1_deploy')
    if os.path.isdir(ra): shutil.rmtree(ra)
    ds, bo = [], []
    for rel in sorted(ds_man()):
        tt, _, _ = tinh_trang(rel)
        loi, _, _ = kiem_moc(rel)
        if tt != 'đang áp' or loi:
            bo.append(rel + ' — ' + (tt if tt != 'đang áp' else '; '.join(loi))); continue
        ds.append(duong_that(rel))
        ds.extend(css_cua_man(rel))
    ds.append(os.path.join('App_Themes', 'Cms', 'Custom_V1', 'ums', 'ums-skin.css'))
    for r in ds:
        os.makedirs(os.path.join(ra, os.path.dirname(r)), exist_ok=True)
        shutil.copyfile(os.path.join(GOC, r), os.path.join(ra, r))
    with open(os.path.join(ra, '_DANH-SACH-TEP.txt'), 'w', encoding='utf-8') as fh:
        fh.write('Chép đè cả thư mục này lên GỐC ứng dụng (cùng cấp indexi.aspx).\n\n'
                 + '\n'.join(x.replace(os.sep, '/') for x in ds) + '\n')
    for r in ds: print('GÓI ' + r.replace(os.sep, '/'))
    for b in bo: print('BỎ  ' + b)
    print('→', os.path.relpath(ra, GOC), '(%d tệp)' % len(ds))


def lenh_nhan(rel):
    shutil.copyfile(os.path.join(GOC, rel), os.path.join(SKIN, 'goc', rel))
    print('Mốc mới cho', rel, '— giờ chạy `skin.py ap`')


if __name__ == '__main__':
    a = sys.argv[1:] or ['kiem']
    {'css': lambda: lenh_css(), 'kiem': lambda: lenh_kiem(), 'ap': lambda: lenh_ap(),
     'them': lambda: lenh_them(a[1]), 'nhan': lambda: lenh_nhan(a[1]), 'dong-goi': lambda: lenh_dong_goi()}[a[0]]()
