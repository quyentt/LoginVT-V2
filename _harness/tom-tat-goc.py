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

    # 7. in nguyên văn hàm
    if ham_in:
        print('\n## 7. Nguyên văn hàm')
        for ten in ham_in.split(','):
            for k, (t, i) in enumerate(hams):
                if t == ten.strip():
                    end = hams[k + 1][1] if k + 1 < len(hams) else len(jl)
                    print('\n--- %s (%d–%d) ---' % (t, i + 1, end))
                    print('\n'.join(x for x in jl[i:end] if x.strip() and not x.strip().startswith('//')))


if __name__ == '__main__':
    main()
