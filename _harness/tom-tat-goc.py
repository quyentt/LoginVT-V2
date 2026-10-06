# -*- coding: utf-8 -*-
"""Tóm tắt MỘT màn gốc (html + js) để chuyển sang _v2 mà không phải đọc nguyên văn hàng nghìn dòng.

    python _harness\tom-tat-goc.py ApisTinTuc/Modules/kehoach/html/tintuc.html            # tự tìm script/<tên>.js
    python _harness\tom-tat-goc.py <html> <js>                                            # chỉ rõ js
    python _harness\tom-tat-goc.py <html> --ham getList_TinTuc,save_TinTuc                # in NGUYÊN VĂN vài hàm

In ra (≈ 2–4 KB thay vì 40–130 KB):
  1. Thẻ script / css nạp thêm, CDN, thư viện toàn cục (XLSX, CKEDITOR, Chart…).
  2. Các vùng của html: phần tử có id="zone…" / modal / table / form — kèm tiêu đề gần nhất; cột <th> của mỗi bảng.
  3. Danh sách hàm của object prototype (tên: dòng bắt đầu – số dòng) — để chọn hàm cần đọc kỹ.
  4. Mọi lời gọi API: action, func, type, và DANH SÁCH THAM SỐ gửi lên (tên khoá của object chứa action) — chép nguyên văn khi chuyển.
  5. Các hàm edu.system.* / edu.extend.* / edu.util.* được dùng (để tra bảng đổi nhanh CHUYEN-DOI mục 5).
  6. ID phần tử mà JS tham chiếu nhưng HTML KHÔNG CÓ (mã chết hoặc gọi nhầm ô — đưa vào "Cố ý bỏ" / "Khác gốc"),
     và id có trong HTML nhưng JS không đụng tới (ô trang trí / chưa nối).
  7. MẪU ĐÃ CÓ TRONG _v2 (để KHÔNG phải dò tay màn cũ): (a) màn gốc khác có script trùng / gần trùng mà đã chuyển
     → nạp chéo tệp đó; (b) từng action / danh mục / hàm edu.* của màn này đã được chuyển ở tệp _v2 nào, dòng nào → mở
     đúng chỗ mà chép; hàm edu.* có bản thay ở tầng chung thì ghi thẳng tên hàm ums.*.
"""
import io, os, re, sys

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def doc(p):
    return io.open(os.path.join(GOC, p), encoding='utf-8', errors='ignore').read() if os.path.exists(os.path.join(GOC, p)) else ''


def main():
    argv = sys.argv[1:]
    ham_in = ''
    for a in argv:
        if a.startswith('--ham='): ham_in = a[6:]
    if '--ham' in argv:
        i = argv.index('--ham'); ham_in = argv[i + 1] if i + 1 < len(argv) else ''
        argv = argv[:i] + argv[i + 2:]          # giá trị sau --ham không phải đường dẫn
    args = [a for a in argv if not a.startswith('--')]
    if not args:
        print(__doc__); return
    html_p = args[0].replace('\\', '/')
    js_p = args[1].replace('\\', '/') if len(args) > 1 else re.sub(r'/html/([^/]+)\.html$', r'/script/\1.js', html_p)
    html, js = doc(html_p), doc(js_p)
    hl, jl = html.split('\n'), js.split('\n')
    print('# %s (%d dòng)  +  %s (%d dòng)' % (html_p, len(hl), js_p, len(jl)))

    # 1. nạp thêm
    print('\n## 1. Nạp thêm / thư viện')
    for m in re.finditer(r'<(script|link)[^>]*(?:src|href)="([^"]+)"', html):
        print('  %-6s %s' % (m.group(1), m.group(2)))
    libs = sorted(set(re.findall(r'\b(XLSX|CKEDITOR|MathJax|Chart|moment|Swal|toastr|io|firebase|html2canvas|jsPDF)\b\.', js)))
    if libs: print('  thư viện toàn cục trong JS: ' + ', '.join(libs))
    if '<style' in html: print('  html có khối <style> riêng (%d dòng)' % (html.count('\n', 0, html.find('</style>')) if '</style>' in html else 0))

    # 2. vùng html
    print('\n## 2. Vùng trong HTML (id="zone*", modal, table, form)')
    tieude = ''
    for i, s in enumerate(hl):
        t = re.search(r'<h[1-5][^>]*>(.*?)</h[1-5]>|class="[^"]*box-title[^"]*"[^>]*>(.*?)<', s)
        if t:
            tieude = re.sub(r'<[^>]+>', '', (t.group(1) or t.group(2) or '')).strip()[:60]
        m = re.search(r'<(div|section|table|form|select|textarea)[^>]*\bid="([^"]+)"[^>]*>', s)
        if not m: continue
        tag, idn = m.group(1), m.group(2)
        cls = re.search(r'class="([^"]*)"', s)
        cls = cls.group(1) if cls else ''
        dang = 'zone' if idn.lower().startswith('zone') or 'zone-bus' in cls else ('modal' if 'modal' in cls and tag == 'div' else tag)
        if dang not in ('zone', 'modal', 'table', 'form', 'textarea'): continue
        line = '  %4d %-7s #%-32s' % (i + 1, dang, idn)
        if dang == 'table':
            # cột th tới </thead>
            k, ths = i, []
            while k < len(hl) and '</thead>' not in hl[k] and k - i < 60:
                ths += [re.sub(r'<[^>]+>', '', x).strip() for x in re.findall(r'<th[^>]*>(.*?)</th>', hl[k])]
                k += 1
            line += ' cột: ' + ' | '.join(x for x in ths if x)
        elif tieude: line += ' (%s)' % tieude
        if 'display: none' in s or 'display:none' in s: line += ' [ẩn]'
        print(line)

    # 3. hàm
    print('\n## 3. Hàm trong JS')
    hams = [(m.group(1), i) for i, s in enumerate(jl) for m in [re.match(r'^ {4}([A-Za-z_]\w*)\s*:\s*function', s)] if m]
    for k, (ten, i) in enumerate(hams):
        end = hams[k + 1][1] if k + 1 < len(hams) else len(jl)
        print('  %-40s %5d  (%d dòng)' % (ten, i + 1, end - i))
    if not hams: print('  (không thấy dạng `tên: function` — xem tay)')

    # 4. API
    print('\n## 4. Lời gọi API (tham số = khoá trong object chứa action)')
    for m in re.finditer(r"'action'\s*:\s*'([^']+)'|action\s*:\s*'([^']+)'", js):
        act = m.group(1) or m.group(2)
        if act.startswith('obj') or '.' in act and '/' not in act: continue
        # object chứa: lùi tới '{' gần nhất, tiến tới '}' cân bằng
        a = js.rfind('{', 0, m.start())
        depth, b = 0, a
        while b < len(js):
            if js[b] == '{': depth += 1
            elif js[b] == '}':
                depth -= 1
                if depth == 0: break
            b += 1
        o = js[a:b + 1]
        keys = re.findall(r"^\s*'?([A-Za-z_]\w*)'?\s*:", o, re.M)
        func = re.search(r"'func'\s*:\s*'([^']+)'", o)
        typ = re.search(r"'type'\s*:\s*'([^']+)'", o)
        ham = ''
        for ten, i in hams:
            if i <= js.count('\n', 0, m.start()): ham = ten
        print('  %-55s %-4s %s' % (act, (typ.group(1) if typ else ''), 'func ' + func.group(1) if func else ''))
        print('      trong %s — %s' % (ham, ', '.join(k for k in keys if k not in ('action', 'type', 'func', 'iM', 'versionAPI'))))

    # 5. edu.*
    print('\n## 5. Hàm hệ cũ được dùng')
    cnt = {}
    for m in re.finditer(r'\bedu\.(system|extend|util|constant)\.([A-Za-z_]\w*)', js):
        k = m.group(1) + '.' + m.group(2); cnt[k] = cnt.get(k, 0) + 1
    print('  ' + ', '.join('%s×%d' % (k, v) for k, v in sorted(cnt.items(), key=lambda x: -x[1])))

    # 6. id lệch
    ids_html = set(re.findall(r'\bid="([^"]+)"', html))
    ids_js = set()
    for m in re.finditer(r"""(?:\$\(\s*["']#|getValById\(\s*["']|viewValById\(\s*["']|getValCombo\(\s*["']|getElementById\(\s*["']|viewFiles\(\s*["']|renderPlace:\s*\[?\s*["'])([A-Za-z_][\w-]*)""", js):
        ids_js.add(m.group(1))
    for m in re.finditer(r"""["']([A-Za-z_][\w-]*(?:,[A-Za-z_][\w-]*)+)["']""", js):   # "a,b" của loadToCombo
        for x in m.group(1).split(','): ids_js.add(x)
    thieu = sorted(i for i in ids_js if i not in ids_html and not re.match(r'^(txt|drop)A{3,}', i) is None or (i not in ids_html))
    thieu = sorted(i for i in ids_js if i not in ids_html)
    print('\n## 6. ID JS dùng mà HTML KHÔNG có (mã chết / gọi nhầm ô — %d):' % len(thieu))
    print('  ' + ', '.join(thieu))
    thua = sorted(i for i in ids_html if i not in ids_js and not re.match(r'^(zone|modal|tbl|lbl)', i))
    print('## 6b. ID HTML có mà JS không đụng (%d):' % len(thua))
    print('  ' + ', '.join(thua))

    # 7. mẫu đã có trong _v2
    mau_v2(js_p, js)

    # 8. in nguyên văn hàm
    if ham_in:
        print('\n## 8. Nguyên văn hàm')
        for ten in ham_in.split(','):
            for k, (t, i) in enumerate(hams):
                if t == ten.strip():
                    end = hams[k + 1][1] if k + 1 < len(hams) else len(jl)
                    print('\n--- %s (%d–%d) ---' % (t, i + 1, end))
                    print('\n'.join(x for x in jl[i:end] if x.strip() and not x.strip().startswith('//')))


# Hàm hệ cũ → bản ở tầng chung _v2 (bảng đầy đủ: _v2/CHUYEN-DOI.md mục 5; _v2/API.md tra chữ ký).
THAY = {
    'getList_HeDaoTao': 'ums.ref.heDaoTao()', 'getList_KhoaDaoTao': 'ums.ref.khoaDaoTao()', 'getList_ChuongTrinh': 'ums.ref.chuongTrinh()',
    'getList_LopQuanLy': 'ums.ref.lopQuanLy()', 'getList_HocPhan': 'ums.ref.hocPhan()', 'getList_ThoiGianDaoTao': 'ums.ref.thoiGianDaoTao()',
    'getList_CoCauToChuc': 'ums.ref.coCauToChuc()', 'getList_KhoaQuanLy': 'ums.ref.khoaQuanLy()', 'getList_SinhVien': 'ums.ref.sinhVien()',
    'loadToCombo_DanhMucDuLieu': "ums.api.dm('MA.BANG') / field source dm", 'getList_MauImport': 'ums.report.mount(host, opts)',
    'genModal_NhanSu': 'ums.pat.pickNhanSu()', 'genModal_SinhVien': 'ums.pat.pickSinhVien()', 'setTinhThanh': 'ums.pat.diaChi()',
    'loadToTable_data': 'ums.ui.table / ums.crud columns', 'loadToCombo_data': 'ums.ui.options / field source', 'afterComfirm': 'ums.ui.confirm().then',
    'alert': 'ums.ui.toast', 'confirm': 'ums.ui.confirm', 'makeRequest': 'ums.api.call (Promise)', 'pageIndex_default': 'crud list.paged',
    'getRootPathImg': 'ums.api.anh / pat.anhNguoi', 'toggle_overide': 'crud tự lo (danh sách ↔ biểu mẫu)', 'setOne_BgRow': 'ums.ui.table chọn dòng',
}
KHONG_IN = {'action', 'type', 'func', 'iM', 'versionAPI'}


def chuan(t):
    """Chuẩn hoá script để so trùng: bỏ CRLF, khoảng trắng đầu/cuối, dòng trống, dòng chú thích, dòng page_load / version."""
    out = []
    for x in t.replace('\r', '').split('\n'):
        x = x.strip()
        if not x or x.startswith('//') or x.startswith('*') or x.startswith('/*'): continue
        if 'page_load()' in x or re.search(r'\?v=[\d.]+', x): continue
        out.append(x)
    return out


def mau_v2(js_p, js):
    import glob, difflib
    print('\n## 7. Mẫu đã có trong _v2 (không phải dò tay màn cũ)')
    # (a) script gốc khác trùng / gần trùng mà ĐÃ có bản _v2
    goc = chuan(js); me = os.path.normpath(js_p)
    trung = []
    for f in glob.glob(os.path.join(GOC, 'Apis*', 'Modules', '*', 'script', '*.js')):
        rel = os.path.relpath(f, GOC).replace(os.sep, '/')
        if os.path.normpath(rel) == me or rel.startswith('ApisCongSinhVien-1/'): continue
        sz = os.path.getsize(f)
        if not (0.6 * len(js) < sz < 1.6 * len(js)): continue
        kia = chuan(doc(rel))
        if abs(len(kia) - len(goc)) > max(40, len(goc) // 4): continue
        sm = difflib.SequenceMatcher(None, goc, kia, autojunk=False)
        if sm.real_quick_ratio() < 0.85 or sm.quick_ratio() < 0.85: continue
        r = sm.ratio()
        if r < 0.85: continue
        v2 = re.sub(r'/script/([^/]+)\.js$', r'/html/\1.html', rel)
        co = os.path.exists(os.path.join(GOC, '_v2', v2))
        if co:   # bản _v2 là trang nạp chéo? → chỉ thẳng script thật đang dùng
            src = re.search(r'<script[^>]+src="([^"?]+)', doc('_v2/' + v2))
            if src:
                v2 = os.path.normpath(os.path.join(os.path.dirname(v2), src.group(1))).replace(os.sep, '/')
        trung.append((r, rel, co, v2))
    trung.sort(key=lambda x: (-x[2], -x[0]))
    if trung:
        print('  (a) script gốc trùng / gần trùng (giống ≥ 85%%) — %d tệp:' % len(trung))
        for r, rel, co, v2 in trung[:8]:
            print('      %3d%%  %-70s %s' % (round(r * 100), rel, ('ĐÃ CHUYỂN → nạp chéo script _v2/' + v2) if co else 'chưa chuyển'))
        if any(x[2] for x in trung) and trung[0][0] >= 0.97:
            print('      → Trùng ≥ 97% với màn đã chuyển: tạo html 8 dòng nạp chéo script của màn đó (mẫu: _v2/ApisTotNghiep/Modules/danhmuc/html/danhmucdulieu.html).')
    else:
        print('  (a) không có script gốc nào trùng ≥ 85% — màn riêng, dựng bằng ums.crud / ums.pat.')

    # (b) chỉ mục _v2: action / mã danh mục → tệp:dòng (bỏ *.demo.js)
    acts = []
    for m in re.finditer(r"'action'\s*:\s*'([^']+)'|action\s*:\s*'([^']+)'", js):
        a = m.group(1) or m.group(2)
        if a not in acts: acts.append(a)
    dms = []
    for m in re.finditer(r'loadToCombo_DanhMucDuLieu\(\s*"([^"]+)"', js):
        if m.group(1) not in dms: dms.append(m.group(1))
    can = acts + dms
    tim = {}
    if can:
        for f in glob.glob(os.path.join(GOC, '_v2', 'Apis*', 'Modules', '*', 'script', '*.js')):
            if f.endswith('.demo.js'): continue
            rel = os.path.relpath(f, GOC).replace(os.sep, '/')
            for i, line in enumerate(io.open(f, encoding='utf-8', errors='ignore')):
                for a in can:
                    if a in line:
                        tim.setdefault(a, []).append('%s:%d' % (rel[4:], i + 1))
    print('  (b) lời gọi / danh mục của màn này đã chuyển ở _v2 (tệp:dòng, tối đa 3; mở đúng chỗ mà chép):')
    for a in can:
        ds = tim.get(a, [])
        if ds:
            them = (' …+%d' % (len(ds) - 3)) if len(ds) > 3 else ''
            print('      %-52s %s%s' % (a, '  '.join(ds[:3]), them))
        else:
            print('      %-52s CHƯA có trong _v2 — màn này là nơi đầu tiên (tên tham số chép mục 4)' % a)
    # (c) hàm edu.* có bản thay sẵn ở tầng chung
    dung = sorted(set(re.findall(r'edu\.(?:system|util|extend|constant)\.(\w+)', js)))
    co = [(h, THAY[h]) for h in dung if h in THAY]
    if co:
        print('  (c) hàm hệ cũ → tầng chung _v2 (không viết lại):')
        for h, t in co: print('      %-28s → %s' % (h, t))


if __name__ == '__main__':
    main()
