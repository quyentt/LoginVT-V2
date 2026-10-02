# -*- coding: utf-8 -*-
"""Tóm tắt một màn hình GỐC để chuyển sang _v2 — đọc cả .html và .js.

    python _harness/tom-tat-man.py ApisCongCanBo/Modules/quatrinhchucvu/html/quatrinhchucvu.html

In ra: các tab / tiêu đề khung, nút (id + chữ), bảng (id + tiêu đề cột),
biểu mẫu (nhãn → id ô, theo dòng), lời gọi API (action/func/type + tham số),
cột lấy từ mDataProp, cách đổ giá trị khi sửa (viewValById), danh mục nạp
vào ô chọn (loadToCombo_DanhMucDuLieu), saveFiles/uploadFiles.
Chỉ đọc, không sửa gì.
"""
import io, os, re, sys, html as H

def clean(x):
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', x))).strip()

def main(path):
    root = os.path.dirname(os.path.dirname(path))
    name = os.path.splitext(os.path.basename(path))[0]
    t = io.open(path, encoding='utf-8', errors='replace').read()
    js = ''
    for d in ('script', 'scripts'):
        p = os.path.join(root, d, name + '.js')
        if os.path.exists(p):
            js = io.open(p, encoding='utf-8', errors='replace').read(); print('JS:', p, len(js.splitlines()), 'dòng'); break
    print('HTML:', path, len(t.splitlines()), 'dòng')

    print('\n== TAB / TIÊU ĐỀ KHUNG')
    for m in re.finditer(r'data-toggle="tab"[^>]*>(.*?)</a>|class="box-title"[^>]*>(.*?)</h3>', t, re.S):
        x = clean(m.group(1) or m.group(2))
        if x: print('  ', x)

    print('\n== NÚT (id | lớp | chữ)')
    for m in re.finditer(r'<(a|button)\b([^>]*)>(.*?)</\1>', t, re.S):
        a = m.group(2)
        if 'btn' not in a: continue
        i = re.search(r'id="([^"]*)"', a); c = re.search(r'class="([^"]*)"', a)
        print('   %-28s | %-34s | %s' % (i.group(1) if i else '', (c.group(1) if c else '')[:34], clean(m.group(3))[:40]))

    print('\n== BẢNG')
    for m in re.finditer(r'<table[^>]*id="([^"]+)"[^>]*>(.*?)</table>', t, re.S):
        ths = [clean(x) for x in re.findall(r'<th[^>]*>(.*?)</th>', m.group(2), re.S)]
        print('   #%s: %s' % (m.group(1), ' | '.join(ths)))

    print('\n== BIỂU MẪU (nhãn → ô)')
    for m in re.finditer(r'title-name">(.*?)</div>|<(?:input|select|textarea)[^>]*id="([^"]+)"[^>]*>|class="row aps-form-item', t, re.S):
        if m.group(1): print('     nhãn:', clean(m.group(1)))
        elif m.group(2):
            tag = re.search(r'<(input|select|textarea)', m.group(0)).group(1)
            ty = re.search(r'type="([^"]+)"', m.group(0)); cl = re.search(r'class="([^"]+)"', m.group(0))
            print('       ô :', m.group(2), '(' + tag + (' ' + ty.group(1) if ty else '') + (' .' + cl.group(1) if cl else '') + ')')
        else: print('   -- dòng')

    if not js: return
    print('\n== LỜI GỌI API')
    for m in re.finditer(r"'action'\s*:\s*'([^']+)'(.*?)\}", js, re.S):
        body = m.group(2)
        fn = re.search(r"'func'\s*:\s*'([^']+)'", body)
        keys = re.findall(r"'(\w+)'\s*:\s*([^,\n]+)", body)
        ks = ', '.join('%s=%s' % (k, v.strip()[:40]) for k, v in keys if k not in ('func', 'iM'))
        print('   %s%s\n        %s' % (m.group(1), ('  [' + fn.group(1) + ']') if fn else '', ks[:600]))
    print('\n== type: GET')
    for m in re.finditer(r'action:\s*(\w+)\.action[^}]*?|type:\s*"(GET|POST)"', js):
        pass
    print('   GET quanh action:', len(re.findall(r'type:\s*"GET"', js)), '| POST:', len(re.findall(r'type:\s*"POST"', js)))

    print('\n== CỘT (mDataProp)')
    print('   ', ', '.join(re.findall(r'"mDataProp"\s*:\s*"([^"]+)"', js)))
    print('\n== ĐỔ KHI SỬA (viewValById / viewFiles)')
    for m in re.finditer(r'viewValById\("(\w+)",\s*([^)]+)\)|viewFiles\(([^)]*)\)', js):
        print('   ', (m.group(1) + ' ← ' + m.group(2)) if m.group(1) else 'viewFiles(' + m.group(3) + ')')
    print('\n== DANH MỤC (loadToCombo_DanhMucDuLieu)')
    for m in re.finditer(r'loadToCombo_DanhMucDuLieu\(([^;]+)\);', js):
        print('   ', m.group(1))
    print('\n== TỆP / KHÁC')
    for pat in [r'saveFiles\([^)]*\)', r'uploadFiles\([^)]*\)', r'ThietLapQuaTrinhCuoiCung\([^)]*\)', r'getList_\w+\(', r'validInputForm', r'"THONGTIN1":\s*"[^"]*"']:
        hits = sorted(set(re.findall(pat, js)))
        if hits: print('   ', ' ; '.join(hits)[:400])
    for m in re.finditer(r'\{\s*"MA"\s*:\s*"(\w+)"\s*,\s*"THONGTIN1"\s*:\s*"([^"]*)"', js):
        print('    bắt buộc:', m.group(1), m.group(2), '' if m.group(1) in t else '(KHÔNG có trên màn)')

if __name__ == '__main__':
    for p in sys.argv[1:]:
        print('#' * 78); main(p)
