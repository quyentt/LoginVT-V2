# -*- coding: utf-8 -*-
"""
GỘP CSS THÀNH MỘT TỆP  —  chạy:  python _harness\\gop-css.py

Vì sao cần
----------
`main.css` và `login-page.css` chỉ gồm các dòng @import. Trình duyệt coi tệp
đó là "đã tải xong" rồi VẼ TRANG NGAY, trong khi 38 tệp con vẫn đang về. Trên
máy chủ thật (đường truyền chậm hơn localhost) người dùng thấy:
  · trang đăng nhập hiện chữ trần, không kiểu, mãi mới đẹp lại;
  · vào trong thì MẤT HẾT biểu tượng cho tới khi phông Font Awesome về.
Bấm F5 thì mọi thứ đã nằm trong bộ đệm nên "chuẩn" ngay — đúng hiện tượng đã
gặp.

Gộp sẵn thành MỘT tệp thì trình duyệt chỉ chờ một lần, và @font-face nằm ngay
trong đó nên phông bắt đầu tải từ giây đầu.

Tệp sinh ra (KHÔNG sửa tay, sẽ bị ghi đè):
    _v2/assets/css/main.bundle.css
    _v2/assets/css/login-page.bundle.css

Sửa CSS xong PHẢI chạy lại lệnh này, nếu không máy chủ vẫn dùng bản cũ.
`index.html` (chạy trên máy) vẫn nạp `main.css` gốc nên sửa là thấy ngay,
không cần gộp; chỉ hai vỏ .aspx dùng bản gộp.
"""
import io
import os
import re
import sys

GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_v2', 'assets', 'css')
GOC = os.path.normpath(GOC)

RE_IMPORT = re.compile(r'@import\s+["\']([^"\']+)["\']\s*;')
RE_URL = re.compile(r'url\(\s*(["\']?)([^"\')]+)\1\s*\)')


def doi_duong_dan(noi_dung, thu_muc_goc, thu_muc_dich):
    """Viết lại mọi url(...) cho đúng khi tệp bị chuyển sang thư mục khác."""
    def thay(m):
        dau, dd = m.group(1), m.group(2).strip()
        if dd.startswith(('data:', 'http:', 'https:', '//', '#', '/')):
            return m.group(0)
        that = os.path.normpath(os.path.join(thu_muc_goc, dd))
        moi = os.path.relpath(that, thu_muc_dich).replace('\\', '/')
        return 'url(%s%s%s)' % (dau, moi, dau)
    return RE_URL.sub(thay, noi_dung)


def gop(duong_dan, thu_muc_dich, da_gop):
    duong_dan = os.path.normpath(duong_dan)
    if duong_dan in da_gop:
        return u''
    da_gop.add(duong_dan)
    if not os.path.isfile(duong_dan):
        sys.stderr.write('THIEU: %s\n' % duong_dan)
        return u''
    s = io.open(duong_dan, encoding='utf-8').read()
    thu_muc = os.path.dirname(duong_dan)
    ra = []
    vi_tri = 0
    for m in RE_IMPORT.finditer(s):
        ra.append(doi_duong_dan(s[vi_tri:m.start()], thu_muc, thu_muc_dich))
        ra.append(u'\n/* ===== %s ===== */\n' % m.group(1))
        ra.append(gop(os.path.join(thu_muc, m.group(1)), thu_muc_dich, da_gop))
        vi_tri = m.end()
    ra.append(doi_duong_dan(s[vi_tri:], thu_muc, thu_muc_dich))
    return u''.join(ra)


def lam(ten_vao, ten_ra):
    vao = os.path.join(GOC, ten_vao)
    ra = os.path.join(GOC, ten_ra)
    noi_dung = (u'/* TỆP SINH TỰ ĐỘNG — đừng sửa tay.\n'
                u'   Nguồn: %s · Sinh bằng: python _harness\\gop-css.py */\n' % ten_vao) + \
               gop(vao, GOC, set())
    io.open(ra, 'w', encoding='utf-8').write(noi_dung)
    print('%-26s -> %-26s %6d KB' % (ten_vao, ten_ra, len(noi_dung.encode('utf-8')) // 1024))


if __name__ == '__main__':
    lam('main.css', 'main.bundle.css')
    lam('login-page.css', 'login-page.bundle.css')
