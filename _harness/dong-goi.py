# -*- coding: utf-8 -*-
"""
Đóng gói _v2 thành _v2_deploy — CHỈ những tệp máy chủ (host) cần.

    python _harness\dong-goi.py

Chạy lại bất cứ lúc nào: xoá trắng _v2_deploy rồi dựng lại từ _v2.
Trước khi chép, tự chạy gop-css.py để hai tệp CSS gộp là bản mới nhất.

Bỏ đi (chỉ dùng khi xem trên máy bằng index.html):
  - index.html, components.html, *.md (BO-CUC, CHUYEN-DOI, TRIEN-KHAI)
  - dữ liệu dựng thử: assets/js/demo-data.js, mọi *.demo.js, screens/ (trừ cai-dat.html)
    → trên host app.js chạy chế độ 'api' (có AXYZCLRVN), không bao giờ đọc tới các tệp này
  - CSS nguồn dạng @import (host nạp main.bundle.css / login-page.bundle.css)
  - vendor không dùng: bootstrap, css của fontawesome/select2/flatpickr (đã gộp vào bundle),
    fa-brands-400.woff2 (bundle không khai brands), README
Trong index.aspx: gỡ thẻ nạp demo-data.js. Trong site.config.js: dataSource "auto" → "api".

Cuối cùng tự kiểm: mọi src/href tương đối trong .aspx + html màn hình, và mọi chuỗi
'assets/…' trong JS, đều trỏ tới tệp CÓ trong gói.

GÓI BỔ SUNG (người dùng 2026-09-27: "thêm thư mục _v2_bo_xung_deploy để copy cho nhẹ"):
    Mỗi lần đóng gói, so _v2_deploy với MỐC LẦN UP TRƯỚC (_harness/.moc-da-up.json: đường dẫn → sha1) và chép
    riêng tệp MỚI / ĐỔI vào _v2_bo_xung_deploy/ (cùng cây thư mục — chép đè vào _v2 trên host). Tệp đã bỏ khỏi gói
    ghi ở _v2_bo_xung_deploy/_XOA-TREN-HOST.txt (để lại trên host cũng không sao, chỉ thừa).
    python _harness\dong-goi.py --da-up        người dùng báo "đã up" → lấy gói hiện tại làm mốc mới
    python _harness\dong-goi.py --moc-tu-host  dựng mốc bằng cách tải từng tệp từ host (URL trong tk.md) và băm —
                                               dùng khi mất mốc / không chắc host đang ở bản nào. Tệp máy chủ không
                                               trả nguyên văn (.aspx, .config) coi như đã khớp → nếu có sửa thì tự chép tay.
"""
import os, re, shutil, subprocess, sys, json, hashlib

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V2 = os.path.join(GOC, '_v2')
DICH = os.path.join(GOC, '_v2_deploy')
BO_XUNG = os.path.join(GOC, '_v2_bo_xung_deploy')
MOC = os.path.join(GOC, '_harness', '.moc-da-up.json')

GIU_VENDOR = [
    'jquery/jquery-3.7.1.min.js',
    'select2/select2.min.js', 'select2/i18n-vi.js',
    'flatpickr/flatpickr.min.js', 'flatpickr/l10n/vn.js',
    'chart/chart.umd.js', 'chart/chartjs-plugin-datalabels.min.js',
    'n2vi/n2vi.min.js',
    'crypto/crypto-js.js',          # AE / AD — bản sao của assets/js/crypto-js.js gốc (index.aspx nạp)
    'xlsx/xlsx.bundle.js',        # SheetJS (xlsx-js-style 1.2.0) — Tuyển sinh kehoachtuyensinhnew đọc Excel
    'fontawesome/webfonts/fa-light-300.woff2',
    'fontawesome/webfonts/fa-regular-400.woff2',
    'fontawesome/webfonts/fa-solid-900.woff2',
]


def chep(tuong_doi):
    nguon = os.path.join(V2, tuong_doi)
    dich = os.path.join(DICH, tuong_doi)
    os.makedirs(os.path.dirname(dich), exist_ok=True)
    shutil.copy2(nguon, dich)


def chep_thu_muc(tuong_doi, bo=lambda p: False):
    for thu_muc, _, tep in os.walk(os.path.join(V2, tuong_doi)):
        for t in tep:
            p = os.path.relpath(os.path.join(thu_muc, t), V2).replace('\\', '/')
            if not bo(p):
                chep(p)


def main():
    subprocess.check_call([sys.executable, os.path.join(GOC, '_harness', 'gop-css.py')])
    if os.path.isdir(DICH):
        shutil.rmtree(DICH)
    os.makedirs(DICH)

    # Vỏ
    for t in ['login.aspx', 'Logout.aspx', 'web.config',
              'help-sso.aspx', 'help-jwks.aspx']:   # SSO sang Cổng Help (yeu-cau-sso-cho-doi-app.md)
        chep(t)
    # Hai trang SSO còn có BẢN SAO ở thư mục gốc ứng dụng (địa chỉ khai bên Help: <ứng dụng>/help-sso.aspx — không phụ
    # thuộc v1 / v2, trường chỉ chạy v1 cũng dùng được). Nguồn sửa là bản trong _v2; chép lại mỗi lần đóng gói để không lệch.
    for t in ['help-sso.aspx', 'help-jwks.aspx']:
        nguon, dich = os.path.join(V2, t), os.path.join(GOC, t)
        if not os.path.exists(dich) or open(nguon, 'rb').read() != open(dich, 'rb').read():
            shutil.copyfile(nguon, dich)
            print('Đã chép lại bản gốc ứng dụng: ' + t + ' (nhớ chép tệp này lên THƯ MỤC GỐC trên host)')
    with open(os.path.join(V2, 'index.aspx'), encoding='utf-8-sig') as f:
        vo = f.read()
    vo2 = re.sub(r'[ \t]*<script src="assets/js/demo-data\.js[^\n]*\n', '', vo)
    assert vo2 != vo, 'không thấy dòng nạp demo-data.js trong index.aspx'
    with open(os.path.join(DICH, 'index.aspx'), 'w', encoding='utf-8-sig') as f:
        f.write(vo2)

    # Tài nguyên chung
    chep_thu_muc('assets/config')
    # Gói không có dữ liệu mẫu → luôn gọi API thật. Để 'auto' mà thiếu phiên thì app rơi
    # về chế độ dựng thử RỖNG (ums.demo không tồn tại); 'api' để session.js báo rõ thiếu gì.
    cf = os.path.join(DICH, 'assets/config/site.config.js')
    with open(cf, encoding='utf-8') as f:
        s = f.read()
    s2 = s.replace('dataSource: "auto"', 'dataSource: "api"', 1)
    assert s2 != s, 'không thấy dataSource: "auto" trong site.config.js'
    with open(cf, 'w', encoding='utf-8') as f:
        f.write(s2)
    chep_thu_muc('assets/js', bo=lambda p: p.endswith('/demo-data.js'))
    chep('assets/css/main.bundle.css')
    chep('assets/css/login-page.bundle.css')
    chep_thu_muc('assets/fonts')
    chep_thu_muc('assets/img')
    for t in GIU_VENDOR:
        chep('assets/vendor/' + t)
    chep('screens/cai-dat.html')          # màn "Cài đặt giao diện" (nút bánh răng) chạy cả khi có API

    # Màn hình đã chuyển
    for ph in sorted(os.listdir(V2)):
        if ph.startswith('Apis') and os.path.isdir(os.path.join(V2, ph)):
            chep_thu_muc(ph, bo=lambda p: p.endswith('.demo.js') or p.endswith('.md'))

    kiem()


def kiem():
    """Mọi đường dẫn tương đối trong gói phải trỏ tới tệp có thật."""
    thieu = []
    ngoai = re.compile(r'^(https?:|//|data:|#|mailto:|javascript:|<%)')
    for thu_muc, _, tep in os.walk(DICH):
        for t in tep:
            p = os.path.join(thu_muc, t)
            if not t.endswith(('.aspx', '.html')):
                continue
            with open(p, encoding='utf-8-sig', errors='replace') as f:
                s = f.read()
            for u in re.findall(r'(?:src|href)="([^"]+)"', s):
                u = u.split('?')[0]
                if not u or ngoai.match(u) or u.startswith('../') and t.endswith('.aspx'):
                    continue            # ../Config.js, ../assets/js/crypto-js.js… nằm ở ứng dụng cha
                if '<%' in u or "'" in u or '+' in u:
                    continue
                if not os.path.exists(os.path.normpath(os.path.join(thu_muc, u))):
                    thieu.append('%s → %s' % (os.path.relpath(p, DICH), u))
    for thu_muc, _, tep in os.walk(os.path.join(DICH, 'assets', 'js')):
        for t in tep:
            with open(os.path.join(thu_muc, t), encoding='utf-8', errors='replace') as f:
                s = f.read()
            for u in set(re.findall(r"['\"](assets/[A-Za-z0-9_./-]+\.[a-z0-9]+)['\"]", s)):
                if not os.path.exists(os.path.join(DICH, u)):
                    thieu.append('assets/js/%s → %s' % (t, u))
    so, nang = 0, 0
    for thu_muc, _, tep in os.walk(DICH):
        for t in tep:
            so += 1
            nang += os.path.getsize(os.path.join(thu_muc, t))
    print('Gói: %d tệp, %.1f MB → %s' % (so, nang / 1048576, DICH))
    if thieu:
        print('THIẾU %d đường dẫn:' % len(thieu))
        for x in thieu:
            print('  ' + x)
        sys.exit(1)
    print('Kiểm đường dẫn: đủ.')


def bam_goi():
    """{đường dẫn tương đối (dấu /): sha1} của mọi tệp trong _v2_deploy"""
    out = {}
    for thu_muc, _, tep in os.walk(DICH):
        for t in tep:
            p = os.path.join(thu_muc, t)
            with open(p, 'rb') as f:
                out[os.path.relpath(p, DICH).replace(os.sep, '/')] = hashlib.sha1(f.read()).hexdigest()
    return out


def ghi_moc(moc):
    with open(MOC, 'w', encoding='utf-8') as f:
        json.dump(moc, f, ensure_ascii=False, indent=0, sort_keys=True)


GHI_CHU = '_KHONG-CON-GI-DE-UP.txt'


def don_bo_xung(ghi_chu=None):
    """Dọn NỘI DUNG thư mục gói bổ sung nhưng GIỮ thư mục (người dùng 2026-09-30: đừng xoá thư mục của tôi).
    ghi_chu: chữ ghi vào tệp _KHONG-CON-GI-DE-UP.txt khi gói trống — để mở thư mục ra là biết vì sao trống."""
    da_co = []
    if os.path.isdir(BO_XUNG):
        for goc, _, teps in os.walk(BO_XUNG):
            for t in teps:
                if t != GHI_CHU:
                    da_co.append(os.path.relpath(os.path.join(goc, t), BO_XUNG).replace(os.sep, '/'))
        for ten in os.listdir(BO_XUNG):
            d = os.path.join(BO_XUNG, ten)
            shutil.rmtree(d) if os.path.isdir(d) else os.remove(d)
    os.makedirs(BO_XUNG, exist_ok=True)
    if ghi_chu is not None:
        import datetime
        with open(os.path.join(BO_XUNG, GHI_CHU), 'w', encoding='utf-8') as f:
            f.write(ghi_chu % {'luc': datetime.datetime.now().strftime('%d/%m/%Y %H:%M'),
                               'ds': ''.join('  ' + x + '\n' for x in sorted(da_co)) or '  (không có)\n'})
    return da_co


def bo_xung():
    """Chép tệp mới / đổi so với mốc lần up trước sang _v2_bo_xung_deploy."""
    if not os.path.exists(MOC):
        don_bo_xung()
        print('Gói bổ sung: CHƯA CÓ MỐC — up cả _v2_deploy rồi chạy "--da-up" (hoặc "--moc-tu-host").')
        return
    with open(MOC, encoding='utf-8') as f:
        cu = json.load(f)
    moi = bam_goi()
    doi = sorted(k for k, v in moi.items() if cu.get(k) != v)
    xoa = sorted(k for k in cu if k not in moi)
    if not doi and not xoa:
        if not os.path.exists(os.path.join(BO_XUNG, GHI_CHU)):
            don_bo_xung('Không có tệp nào khác lần up trước (kiểm lúc %(luc)s).\n')
        print('Gói bổ sung: không có tệp nào khác lần up trước.')
        return
    don_bo_xung()
    for k in doi:
        dich = os.path.join(BO_XUNG, k)
        os.makedirs(os.path.dirname(dich), exist_ok=True)
        shutil.copy2(os.path.join(DICH, k), dich)
    if xoa:
        os.makedirs(BO_XUNG, exist_ok=True)
        with open(os.path.join(BO_XUNG, '_XOA-TREN-HOST.txt'), 'w', encoding='utf-8') as f:
            f.write('Tệp đã bỏ khỏi gói — có thể xoá trong _v2 trên host (để lại cũng không lỗi):\n' + '\n'.join(xoa) + '\n')
    nang = sum(os.path.getsize(os.path.join(DICH, k)) for k in doi)
    print('Gói bổ sung: %d tệp (%.1f MB)%s → %s' % (len(doi), nang / 1048576,
          (', %d tệp cần xoá — xem _XOA-TREN-HOST.txt' % len(xoa)) if xoa else '', BO_XUNG))
    for k in doi[:40]:
        print('  ' + k)
    if len(doi) > 40:
        print('  … còn %d tệp' % (len(doi) - 40))


def moc_tu_host():
    """Mốc = nội dung ĐANG CÓ trên host (tải từng tệp của _v2_deploy về và băm)."""
    import urllib.request, ssl
    from concurrent.futures import ThreadPoolExecutor
    tk = [os.path.join(GOC, '_harness', 'kiem-host', 'tk.md'), os.path.join(V2, 'tk.md')]
    tk = next((x for x in tk if os.path.exists(x)), None)
    if not tk:
        sys.exit('Thiếu tk.md (URL host)')
    with open(tk, encoding='utf-8') as f:
        m = re.search(r'\((https?:[^)]+)\)', f.readline())
    goc = re.sub(r'index\.aspx.*$', '', m.group(1))
    moi = bam_goi()
    ctx = ssl.create_default_context()

    def tai(k):
        if k.lower().endswith(('.aspx', '.config', '.ashx', '.cs')):
            return k, moi[k], 'khong-tai'      # máy chủ chạy / chặn, không trả nguyên văn
        try:
            with urllib.request.urlopen(goc + k.replace(' ', '%20'), timeout=60, context=ctx) as r:
                return k, hashlib.sha1(r.read()).hexdigest(), 'ok'
        except Exception as e:
            return k, None, str(e)[:80]
    moc, loi, bo = {}, [], []
    with ThreadPoolExecutor(8) as ex:
        for k, h, tt in ex.map(tai, sorted(moi)):
            if h:
                moc[k] = h
            else:
                loi.append('%s  (%s)' % (k, tt))
            if tt == 'khong-tai':
                bo.append(k)
    ghi_moc(moc)
    khac = sum(1 for k in moi if moc.get(k) != moi[k])
    print('Mốc từ host: %d tệp so được, %d tệp máy chủ không trả nguyên văn (coi như khớp: %s), %d tệp host chưa có / lỗi tải.'
          % (len(moc) - len(bo), len(bo), ', '.join(bo), len(loi)))
    for x in loi[:20]:
        print('  chưa có: ' + x)
    print('→ %d tệp khác host.' % khac)


if __name__ == '__main__':
    if '--da-up' in sys.argv:
        if not os.path.isdir(DICH):
            sys.exit('Chưa có _v2_deploy')
        ghi_moc(bam_goi())
        don_bo_xung('Không còn tệp nào cần up: host đã có bản mới nhất (đặt mốc "đã up" lúc %(luc)s).\n'
                    'Các tệp của gói vừa up:\n%(ds)s')
        print('Đã lấy _v2_deploy hiện tại làm mốc "đã up" (%s).' % MOC)
    elif '--moc-tu-host' in sys.argv:
        moc_tu_host()
        bo_xung()
    else:
        main()
        bo_xung()
