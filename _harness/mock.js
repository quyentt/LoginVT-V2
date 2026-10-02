/*
 * Harness giả lập frontend LoginVT.
 *
 * Thay thế toàn bộ tầng server: không cần IIS, không cần Web.config,
 * không cần microservice, không cần Oracle.
 *
 * Cách hoạt động: ghi đè edu.system.makeRequest để trả dữ liệu từ
 * fixtures.js thay vì gọi mạng. Mọi thứ còn lại (Core/*.js, html module,
 * js module) chạy nguyên bản, không sửa một dòng nào.
 */
(function () {
    'use strict';

    var CFG = window.HARNESS_CONFIG || {};
    var MODULE = CFG.module || {
        appCode: 'ApisDangKyHoc',
        url: '/Modules/kehoachdangkymuabaohiem/html/kehoachmua.html'
    };
    var DELAY = CFG.delay === undefined ? 120 : CFG.delay;
    var FX = window.HARNESS_FIXTURES || {};

    /* ------------------------------------------------------------------
     * 1. Dựng phiên đăng nhập giả
     * ---------------------------------------------------------------- */
    window.edu = {};
    edu.system = new systemroot();
    edu.extend = new systemextend();
    edu.constant = new constant();
    edu.util = new util();

    edu.system.objApi = {};
    edu.system.rootPath = '';
    edu.system.rootPathUpload = '';
    edu.system.apiUrlTemp = '';
    edu.system.userId = 'DEV00000000000000000000000000001';
    edu.system.appId = 'APP00000000000000000000000000001';
    edu.system.strVaiTro_Id = 'VT000000000000000000000000000001';
    edu.system.strNguoiThucVai_Id = '';
    // Để rỗng có chủ đích: genPath_ChucNang() chỉ chạy khi khác rỗng,
    // mà hàm đó gọi API lấy breadcrumb -> không cần trong harness.
    edu.system.strChucNang_Id = '';
    edu.system.langId = 'VI';
    edu.system.tokenJWT = '';
    edu.system.ctPlacehoder = constant.setting.initsystem.content_placehoder;
    edu.system.pageIndex = constant.setting.initsystem.page_index;
    edu.system.pageSize = constant.setting.initsystem.page_size;

    // KHÔNG gọi edu.constant.init().
    //
    // init() gọi hàm khởi tạo phiên nằm ẩn trong file vendor
    // (App_Themes/Plugins/pagination/jquery.simplePagination.min.js), hàm này:
    //   - đọc $("#myTextBox").val() — blob cấu hình mã hoá do ASPX shell render,
    //   - giải mã bằng AD(...) trong crypto-js.js,
    //   - rồi gọi tiếp getlistByUser_ChucNang() để dựng menu và phân quyền.
    // Harness cố tình không có các thứ đó. Ngoài ra đây là một điểm lệch
    // Core/Corei có thật: Core/constant.js bọc try/catch nên không sao,
    // còn Corei/constant.js gọi thẳng nên ném lỗi làm trắng trang.
    //
    // constant.getting() chỉ cần constant.setting (tĩnh) và lang, nên gán thẳng là đủ.
    edu.constant.lang = 'VI';

    /* ------------------------------------------------------------------
     * 2. Bảng điều khiển hiển thị mọi lời gọi bị chặn
     * ---------------------------------------------------------------- */
    var log = (function () {
        var $panel, $list, count = 0, missing = 0;

        function ensure() {
            if ($panel) return;
            $panel = $(
                '<div id="harness-panel">' +
                '  <div class="hp-head">' +
                '    <b>HARNESS</b> &mdash; lời gọi API bị chặn' +
                '    <span class="hp-stat"></span>' +
                '    <a href="#" class="hp-toggle">thu gọn</a>' +
                '  </div>' +
                '  <div class="hp-body"><table class="hp-list"></table></div>' +
                '</div>'
            ).appendTo(document.body);
            $list = $panel.find('.hp-list');
            $panel.on('click', '.hp-toggle', function (e) {
                e.preventDefault();
                var $b = $panel.find('.hp-body');
                $b.toggle();
                $(this).text($b.is(':visible') ? 'thu gọn' : 'mở rộng');
            });
            $panel.on('click', '.hp-key', function () {
                console.log('[harness] payload:', $(this).data('payload'));
            });
        }

        return function (key, found, payload) {
            ensure();
            count++;
            if (!found) missing++;
            $panel.find('.hp-stat').text(
                '  ' + count + ' lời gọi' + (missing ? ' / ' + missing + ' THIẾU fixture' : '')
            );
            $('<tr>')
                .addClass(found ? 'hp-ok' : 'hp-miss')
                .append($('<td class="hp-badge">').text(found ? 'OK' : 'THIẾU'))
                .append(
                    $('<td class="hp-key">')
                        .text(key)
                        .attr('title', 'Bấm để in payload ra Console')
                        .data('payload', payload)
                )
                .prependTo($list);
        };
    })();

    /* ------------------------------------------------------------------
     * 3. Định tuyến fixture
     * ---------------------------------------------------------------- */
    function keyOf(op) {
        var d = op.data || {};
        if (d.strMaBangDanhMuc) return op.action + '#' + d.strMaBangDanhMuc;
        if (d.func) return d.func;
        return op.action;
    }

    function lookup(key) {
        var v = FX[key];
        if (typeof v === 'string' && v.indexOf('@first:') === 0) {
            var src = FX[v.substring(7)];
            return src && src.length ? [src[0]] : [];
        }
        return v;
    }

    function tenById(fixtureKey, id) {
        var arr = FX[fixtureKey] || [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].ID === id) return arr[i].TEN;
        }
        return '';
    }

    function guid32(prefix) {
        var s = (prefix || 'NEW');
        while (s.length < 32) s += Math.floor(Math.random() * 10);
        return s.substring(0, 32);
    }

    var DM_LOAI = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.LOAI';
    var DM_TINHTRANG = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.KEHOACH.MUAHANG.TINHTRANG';
    var KEY_KEHOACH = 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_LayDS';
    var KEY_DONGIA = 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_LayDS';
    var KEY_PHAMVI = 'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_PV_LayDS';

    function rowKeHoach(d, id) {
        return {
            ID: id,
            MA: d.strMa || '',
            TEN: d.strTen || '',
            MOTA: d.strMoTa || '',
            TUNGAY: d.strTuNgay || '',
            DENNGAY: d.strDenNgay || '',
            LOAIKEHOACH_ID: d.strLoaiKeHoach_Id || '',
            LOAIKEHOACH_TEN: tenById(DM_LOAI, d.strLoaiKeHoach_Id),
            TINHTRANG_ID: d.strTinhTrang_Id || '',
            TINHTRANG_TEN: tenById(DM_TINHTRANG, d.strTinhTrang_Id),
            DAOTAO_THOIGIANDAOTAO_ID: d.strDAOTAO_ThoiGianDaoTao_Id || '',
            CHOPHEPSUASOLUONG: d.dChoPhepSuaSoLuong || '0',
            CHOPHEPHUYTRUOCTHANHTOAN: d.dChoPhepHuyTruocThanhToan || '0',
            YEUCAUTHANHTOANNGAY: d.dYeuCauThanhToanNgay || '0',
            NGUOITAO_TAIKHOAN: 'dev.harness'
        };
    }

    function removeById(key, id) {
        var arr = FX[key];
        if (!arr) return;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].ID === id) { arr.splice(i, 1); return; }
        }
    }

    // Ghi vào fixture trong bộ nhớ để màn hình hành xử như thật
    // (thêm xong thấy dòng mới, xoá xong dòng biến mất).
    // Mất khi refresh trang — đúng bản chất harness.
    var WRITERS = {
        'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Them': function (d) {
            FX[KEY_KEHOACH].push(rowKeHoach(d, guid32('KHM')));
        },
        'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Sua': function (d) {
            var arr = FX[KEY_KEHOACH];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].ID === d.strId) { arr[i] = rowKeHoach(d, d.strId); return; }
            }
        },
        'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MuaHang_Xoa': function (d) {
            removeById(KEY_KEHOACH, d.strId);
        },
        'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Them': function (d) {
            FX[KEY_DONGIA].push({
                ID: guid32('DG'),
                KHOANTHU_ID: d.strLoaiKhoan_Id || d.strKhoanThu_Id || '',
                KHOANTHU_TEN: tenById('TC_KhoanThu/LayDanhSach', d.strLoaiKhoan_Id || d.strKhoanThu_Id),
                LOAIKHOAN_TEN: tenById('TC_KhoanThu/LayDanhSach', d.strLoaiKhoan_Id || d.strKhoanThu_Id),
                DONGIA: d.strDonGia || d.dDonGia || '0',
                PHANLOAI_TEN: '', DONVITINH_TEN: '',
                CHOPHEPKHONGMUA: d.dChoPhepKhongMua || '0',
                BATBUOC: d.dBatBuoc || '0',
                CHOPHEPNHAPSOLUONG: d.dChoPhepNhapSoLuong || '0',
                SOTOITHIEU: d.strSoToiThieu || '', SOTOIDA: d.strSoToiDa || ''
            });
        },
        'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_DG_Xoa': function (d) {
            removeById(KEY_DONGIA, d.strId);
        },
        'PKG_TAICHINH_DANGKYMUA.Pr_TC_KH_MH_PV_Xoa': function (d) {
            removeById(KEY_PHAMVI, d.strId);
        }
    };

    /* ------------------------------------------------------------------
     * 4. Ghi đè makeRequest
     * ---------------------------------------------------------------- */
    edu.system.makeRequest = function (op) {
        var key = keyOf(op);
        var d = (op.data || {});

        var writer = WRITERS[d.func];
        if (writer) {
            try { writer(d); } catch (ex) { console.error('[harness] writer lỗi:', ex); }
            log(key + '  (ghi)', true, d);
            finish({ Success: true, Message: '', Data: null, Pager: 0 });
            return;
        }

        var data = lookup(key);
        var found = data !== undefined;
        log(key, found, d);

        if (!found) {
            // Trả mảng rỗng thay vì lỗi: màn hình vẫn dựng được,
            // bảng điều khiển đã đánh dấu THIẾU để bổ sung fixture sau.
            finish({ Success: true, Message: '', Data: [], Pager: 0 });
            return;
        }
        finish({
            Success: true,
            Message: '',
            Data: data,
            Pager: (data && data.length) ? data.length : 0
        });

        function finish(res) {
            setTimeout(function () {
                try {
                    if (typeof op.success === 'function') op.success(res);
                } catch (ex) {
                    console.error('[harness] lỗi trong success của', key, ex);
                }
                if (typeof op.complete === 'function') op.complete({}, 'success');
            }, DELAY);
        }
    };

    /* ------------------------------------------------------------------
     * 5. Nạp màn hình
     * ---------------------------------------------------------------- */
    $(function () {
        console.log('[harness] nạp module:', MODULE.appCode + MODULE.url);
        // loadPage(self, url, params, callback, appCode)
        edu.system.loadPage($(edu.system.ctPlacehoder), MODULE.url, null, function () {
            if (!CFG.autorun) return;
            // Nhiều màn hình chỉ nạp danh sách khi bấm nút (vd kehoachmua chỉ
            // gọi getList khi bấm Tìm kiếm). autorun cho phép vào thẳng trạng
            // thái đó qua URL, khỏi phải click tay mỗi lần tải lại.
            setTimeout(function () {
                try {
                    console.log('[harness] autorun:', CFG.autorun);
                    (0, eval)(CFG.autorun);
                } catch (ex) {
                    console.error('[harness] autorun lỗi:', ex);
                }
            }, DELAY * 4);
        }, MODULE.appCode);
    });
})();
