/*----------------------------------------------
--Màn hình : Nhật ký đồng bộ — CHỈ XEM (dongbo_phamvi_log)
--Hàm gọi  : PKG_CORE_QUANTRI_04.dongbo_phamvi_log_LayDS / _LayTT
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, PQ.dmyHms, PQ.parseNgayGio, ...) — nạp trước file này.
--Ghi chú  : - LayDS nhận (strtrangthai, strnguon_loai, strtungay, strdenngay) — KHÔNG có từ khóa, KHÔNG phân trang,
--             và KHÔNG có hàm thống kê. Nên: tải theo KHOẢNG NGÀY (mặc định 30 ngày, tối đa MAX_NGAY ngày), luôn gửi
--             strtrangthai = strnguon_loai = '' (lấy tất cả); các ô Tìm kiếm / Nguồn loại / Trạng thái lọc NGAY trên danh sách
--             đã tải; 4 thẻ số liệu và biểu đồ 14 ngày TÍNH TỪ CHÍNH DANH SÁCH đó (không bị ảnh hưởng bởi 3 ô lọc).
--             Bảng chỉ vẽ tối đa MAX_HIEN_THI lượt mới nhất.
--           - Chỉ xem: không Thêm/Sửa/Xóa. Nút Xem mở chi tiết bằng LayTT(strid): bảng tổng hợp + toàn bộ cột gốc.
--           - TÊN CỘT response CHƯA CHỐT: dùng bảng COT bên dưới (thử lần lượt các tên thường gặp); thiếu cột thời điểm /
--             trạng thái thì console cảnh báo kèm danh sách cột thật → sửa 1 chỗ ở COT.
--           - MÃ TRẠNG THÁI chưa chốt: phân nhóm bằng _loaiTT (OK / CẢNH BÁO / LỖI / khác) theo chữ trong mã; 2 ô lọc
--             Nguồn loại / Trạng thái lấy lựa chọn từ chính dữ liệu nên luôn đúng mã thật.
----------------------------------------------*/
function NhatKyDongBo() { };
NhatKyDongBo.prototype = {
    MAX_HIEN_THI: 1000,
    MAX_NGAY: 92,           // khoảng ngày tối đa mỗi lần tải
    SO_NGAY_MACDINH: 30,
    SO_NGAY_BIEUDO: 14,

    // Tên cột response (suy đoán) — thử lần lượt, lấy cái đầu tiên có giá trị
    COT: {
        ID: ['ID'],
        THOIGIAN: ['THOIGIAN', 'THOI_GIAN', 'THOIGIAN_BATDAU', 'BATDAU', 'NGAY_CHAY', 'NGAYCHAY', 'NGAYTAO', 'NGAY_TAO', 'TG_BATDAU'],
        NGUON_LOAI: ['NGUON_LOAI'],
        NGUON_ID: ['NGUON_ID'],
        THEM: ['SO_THEM', 'SL_THEM', 'SO_DONG_THEM', 'THEM'],
        XOA: ['SO_XOA', 'SL_XOA', 'SO_DONG_XOA', 'XOA'],
        TRANGTHAI: ['TRANGTHAI', 'TRANG_THAI'],
        CHITIET: ['CHITIET', 'CHI_TIET', 'THONGBAO', 'GHICHU', 'MOTA', 'NOIDUNG', 'LOI', 'MESSAGE']
    },

    dtAll: [],          // mọi lượt trong khoảng ngày, đã sắp mới → cũ
    vanBan: [],         // chuỗi chữ thường của từng dòng dtAll (để tìm từ khóa), cùng chỉ số với dtAll
    dtShow: [],         // đúng các dòng đang vẽ (nút Xem tra theo chỉ số trong mảng này)
    dtLoc: [],          // mọi lượt sau khi lọc (chưa cắt MAX_HIEN_THI) — dùng cho nút Xuất Excel
    objKhoang: null,    // {tu: Date, den: Date} của lần tải gần nhất
    bDaCanhBaoCot: false,

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/JS4vJiMuHjEpICw3KB4tLiYeDSA4BRIP', func: 'PKG_CORE_QUANTRI_04.dongbo_phamvi_log_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/JS4vJiMuHjEpICw3KB4tLiYeDSA4FRUP', func: 'PKG_CORE_QUANTRI_04.dongbo_phamvi_log_LayTT' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter): xuất ĐỦ các lượt sau khi lọc (bảng chỉ vẽ tối đa MAX_HIEN_THI lượt)
        PQ.attachExport({
            table: 'tblNhatKy', title: 'NHẬT KÝ ĐỒNG BỘ DỮ LIỆU QUYỀN', fileName: 'NhatKyDongBo',
            rows: function () { return me.dtLoc; },
            subTitles: function () {
                var a = [], kw = $.trim(edu.util.getValById('txtSearch_NhatKy'));
                if (me.objKhoang) a.push('Khoảng ngày: ' + PQ.dmyDate(me.objKhoang.tu) + ' - ' + PQ.dmyDate(me.objKhoang.den));
                if (kw) a.push('Từ khóa: ' + kw);
                return a;
            },
            filters: [[{ label: 'Nguồn loại', id: 'dropSearch_NK_NguonLoai' }, { label: 'Trạng thái', id: 'dropSearch_NK_TrangThai' }]]
        });
        var homNay = PQ.homNay();
        var tu = new Date(homNay.getFullYear(), homNay.getMonth(), homNay.getDate() - (me.SO_NGAY_MACDINH - 1));
        edu.util.viewValById("txtSearch_NK_TuNgay", PQ.dmyDate(tu));
        edu.util.viewValById("txtSearch_NK_DenNgay", PQ.dmyDate(homNay));

        // Nút Tìm kiếm và đổi khoảng ngày → tải lại từ BE
        $("#btnSearch_NhatKy").click(function () {
            me.getList_NhatKy();
        });
        $("#txtSearch_NK_TuNgay, #txtSearch_NK_DenNgay").on("change", function () {
            me.getList_NhatKy();
        });
        // Từ khóa / Nguồn loại / Trạng thái → chỉ lọc trên danh sách đã tải
        // (Enter bị chặn toàn cục ở sự kiện keypress nên bắt ở keyup)
        $("#txtSearch_NhatKy").on("keyup", function (e) {
            if (e.which === 13) me.render_NhatKy();
        });
        $("#dropSearch_NK_NguonLoai, #dropSearch_NK_TrangThai").on("change", function () {
            me.render_NhatKy();
        });
        $("#tblNhatKy").delegate(".btnXem", "click", function () {
            me.popup_Xem($(this).attr("data-i"));
        });
        me.getList_NhatKy();
    },

    /*------------------------------------------
    --Tiện ích riêng của màn hình
    -------------------------------------------*/
    _so: function (n) {
        return Number(n).toLocaleString('vi-VN');
    },
    // Đọc 1 cột theo bảng COT
    _c: function (row, strKey) {
        var arr = this.COT[strKey];
        for (var i = 0; i < arr.length; i++) {
            var v = PQ.g(row, arr[i]);
            if (v !== '') return v;
        }
        return '';
    },
    // Bỏ dấu + chỉ giữ chữ/số, in hoa — để nhận ra mã trạng thái dù viết "CẢNH BÁO", "CANH_BAO", "CanhBao"...
    _chuanHoa: function (s) {
        return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toUpperCase().replace(/[^A-Z0-9]/g, '');
    },
    // 'OK' | 'CANHBAO' | 'LOI' | 'KHAC'
    _loaiTT: function (strMa) {
        var n = this._chuanHoa(strMa);
        if (n === 'OK' || n === 'THANHCONG' || n === 'SUCCESS' || n === 'HOANTHANH' || n === 'DONE') return 'OK';
        if (n.indexOf('CANH') === 0 || n.indexOf('WARN') === 0) return 'CANHBAO';
        if (n.indexOf('LOI') === 0 || n.indexOf('ERR') === 0 || n.indexOf('FAIL') === 0 || n.indexOf('THATBAI') === 0) return 'LOI';
        return 'KHAC';
    },
    _nhanTT: function (strMa) {
        var l = this._loaiTT(strMa);
        return l === 'OK' ? 'OK' : (l === 'CANHBAO' ? 'Cảnh báo' : (l === 'LOI' ? 'Lỗi' : strMa));
    },
    _pillTT: function (strMa) {
        var l = this._loaiTT(strMa);
        if (l === 'OK') return '<span class="pq-pill pq-pill-allow">OK</span>';
        if (l === 'CANHBAO') return '<span class="pq-pill pq-pill-warn">CẢNH BÁO</span>';
        if (l === 'LOI') return '<span class="pq-pill pq-pill-deny">LỖI</span>';
        return '<span class="pq-pill pq-pill-grey">' + PQ.esc(strMa) + '</span>';
    },
    _kiemTraCot: function (row) {
        var me = this;
        if (me.bDaCanhBaoCot || !row) return;
        var thieu = [];
        $.each(['THOIGIAN', 'TRANGTHAI'], function (i, k) { if (me._c(row, k) === '') thieu.push(k); });
        if (thieu.length > 0 && window.console) {
            me.bDaCanhBaoCot = true;
            console.warn('[nhatkydongbo] Không nhận ra cột: ' + thieu.join(', ') + ' (thử: ' + $.map(thieu, function (k) { return me.COT[k].join('/'); }).join(' ; ') +
                '). Biểu đồ/thẻ số liệu sẽ sai. Các cột nhận được:', Object.keys(row), '→ sửa bảng COT trong nhatkydongbo.js.');
        }
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS) theo khoảng ngày
    -------------------------------------------*/
    getList_NhatKy: function () {
        var me = this;
        var strTu = $.trim(edu.util.getValById("txtSearch_NK_TuNgay"));
        var strDen = $.trim(edu.util.getValById("txtSearch_NK_DenNgay"));
        if (!strTu || !strDen) {
            edu.system.alert("Vui lòng nhập cả Từ ngày và Đến ngày (dd/mm/yyyy).", "w");
            return;
        }
        if (!edu.util.dateValid(strTu) || !edu.util.dateValid(strDen)) {
            edu.system.alert("Từ ngày / Đến ngày không hợp lệ (định dạng dd/mm/yyyy).", "w");
            return;
        }
        var dTu = PQ.parseNgay(strTu), dDen = PQ.parseNgay(strDen);
        if (dTu.getTime() > dDen.getTime()) {
            edu.system.alert("Từ ngày phải trước hoặc bằng Đến ngày.", "w");
            return;
        }
        var iNgay = Math.round((dDen.getTime() - dTu.getTime()) / 86400000) + 1;
        if (iNgay > me.MAX_NGAY) {
            edu.system.alert("Khoảng thời gian tối đa " + me.MAX_NGAY + " ngày (đang chọn " + iNgay + " ngày) — nhật ký rất lớn, hãy thu hẹp lại.", "w");
            return;
        }
        PQ.call(me.API.LAYDS, { 'strtrangthai': '', 'strnguon_loai': '', 'strtungay': strTu, 'strdenngay': strDen }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.objKhoang = { tu: dTu, den: dDen };
            var dt = data.Data || [];
            me._kiemTraCot(dt[0]);
            // sắp mới → cũ (dòng không đọc được thời điểm xuống cuối, giữ thứ tự gốc)
            var arr = $.map(dt, function (r, i) {
                var d = PQ.parseNgayGio(me._c(r, 'THOIGIAN'));
                return { r: r, t: d ? d.getTime() : null, i: i };
            });
            arr.sort(function (a, b) {
                if (a.t === b.t) return a.i - b.i;
                if (a.t === null) return 1;
                if (b.t === null) return -1;
                return b.t - a.t;
            });
            me.dtAll = $.map(arr, function (x) { return [x.r]; });
            me.vanBan = $.map(me.dtAll, function (r) {
                var a = [];
                $.each(r, function (k, v) { if (v !== null && v !== undefined && typeof v !== 'object') a.push(String(v)); });
                return a.join(' ').toLowerCase();
            });
            me.capNhatLoc();
            me.render_Kpi();
            me.render_BieuDo();
            me.render_NhatKy();
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    // Lựa chọn của 2 ô lọc lấy từ dữ liệu thật; giữ nguyên lựa chọn đang chọn nếu vẫn còn
    capNhatLoc: function () {
        var me = this;
        var strNguon = edu.util.getValById("dropSearch_NK_NguonLoai");
        var strTT = edu.util.getValById("dropSearch_NK_TrangThai");
        var setNguon = {}, setTT = {}, dsNguon = [], dsTT = [];
        $.each(me.dtAll, function (i, r) {
            var n = me._c(r, 'NGUON_LOAI'), t = me._c(r, 'TRANGTHAI');
            if (n !== '' && !setNguon[n]) { setNguon[n] = true; dsNguon.push(n); }
            if (t !== '' && !setTT[t]) { setTT[t] = true; dsTT.push(t); }
        });
        dsNguon.sort();
        dsTT.sort();
        PQ.loadCombo(["dropSearch_NK_NguonLoai"], $.map(dsNguon, function (n) { return { ID: n, TEN: n }; }), "Tất cả");
        PQ.loadCombo(["dropSearch_NK_TrangThai"], $.map(dsTT, function (t) { return { ID: t, TEN: me._nhanTT(t) }; }), "Tất cả");
        if (strNguon && setNguon[strNguon]) edu.util.viewValById("dropSearch_NK_NguonLoai", strNguon);
        if (strTT && setTT[strTT]) edu.util.viewValById("dropSearch_NK_TrangThai", strTT);
    },
    // Lọc phía trình duyệt (từ khóa / nguồn loại / trạng thái) rồi vẽ bảng + nhãn đếm
    render_NhatKy: function () {
        var me = this;
        var strKw = $.trim(edu.util.getValById("txtSearch_NhatKy")).toLowerCase();
        var strNguon = edu.util.getValById("dropSearch_NK_NguonLoai");
        var strTT = edu.util.getValById("dropSearch_NK_TrangThai");
        var dt = [];
        for (var i = 0; i < me.dtAll.length; i++) {
            var r = me.dtAll[i];
            if (strNguon && me._c(r, 'NGUON_LOAI') !== strNguon) continue;
            if (strTT && me._c(r, 'TRANGTHAI') !== strTT) continue;
            if (strKw && me.vanBan[i].indexOf(strKw) < 0) continue;
            dt.push(r);
        }
        var bLoc = !!strKw || !!strNguon || !!strTT;
        var strDem = bLoc
            ? me._so(dt.length) + ' / ' + me._so(me.dtAll.length) + ' lượt'
            : me._so(me.dtAll.length) + ' lượt';
        me.dtLoc = dt;
        if (dt.length > me.MAX_HIEN_THI) {
            strDem += ' — chỉ hiển thị ' + me._so(me.MAX_HIEN_THI) + ' lượt mới nhất, hãy thu hẹp khoảng ngày hoặc ô lọc';
            dt = dt.slice(0, me.MAX_HIEN_THI);
        }
        me.dtShow = dt;
        $("#lblCount_NhatKy").text(strDem);
        me.genTable_NhatKy(dt);
    },
    genTable_NhatKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNhatKy",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Thời điểm | 2 Nguồn | 3 + Thêm | 4 − Xóa | 5 Trạng thái | 6 Chi tiết | 7 Xem
            colPos: {
                center: [0, 3, 4, 5, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.dmyHms(me._c(aData, 'THOIGIAN'))) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(me._c(aData, 'NGUON_LOAI')) + ' / ' + PQ.esc(me._c(aData, 'NGUON_ID')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.esc(me._c(aData, 'THEM'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.esc(me._c(aData, 'XOA'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._pillTT(me._c(aData, 'TRANGTHAI'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var s = me._c(aData, 'CHITIET');
                        return s === '' ? '<span class="pq-sub">—</span>' : PQ.esc(s);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnXem" data-i="' + nRow + '" title="Xem chi tiết"><i class="fa fa-eye color-active"></i></a>';
                    }
                }
            ]
        };
        PQ.veBang(jsonForm);
    },

    /*------------------------------------------
    --[2] Thẻ số liệu + biểu đồ — tính từ dtAll (toàn bộ khoảng ngày, không theo 3 ô lọc)
    -------------------------------------------*/
    render_Kpi: function () {
        var me = this;
        var n = { OK: 0, CANHBAO: 0, LOI: 0, KHAC: 0 };
        $.each(me.dtAll, function (i, r) { n[me._loaiTT(me._c(r, 'TRANGTHAI'))]++; });
        var tong = me.dtAll.length;
        var iNgay = Math.round((me.objKhoang.den.getTime() - me.objKhoang.tu.getTime()) / 86400000) + 1;
        var pct = function (x) { return (x * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%'; };
        $("#lblNK_SoNgay").text(iNgay);
        $("#lblNK_Tong").text(me._so(tong));
        $("#lblNK_TongSub").text(tong === 0 ? '' :
            'trung bình ' + (tong / iNgay).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' lượt/ngày'
            + (n.KHAC > 0 ? ' · ' + me._so(n.KHAC) + ' lượt trạng thái khác' : ''));
        $("#lblNK_OK").text(me._so(n.OK));
        $("#lblNK_OKSub").text(tong === 0 ? '' : pct(n.OK / tong));
        $("#lblNK_CanhBao").text(me._so(n.CANHBAO));
        $("#lblNK_Loi").text(me._so(n.LOI));
    },
    // Cột chồng theo trạng thái cho SO_NGAY_BIEUDO ngày tính đến "Đến ngày"
    render_BieuDo: function () {
        var me = this;
        var den = me.objKhoang.den;
        var ngay = [], key = {};
        for (var i = me.SO_NGAY_BIEUDO - 1; i >= 0; i--) {
            var d = new Date(den.getFullYear(), den.getMonth(), den.getDate() - i);
            var k = PQ.dmyDate(d);
            key[k] = { nhan: k.substr(0, 5), tong: 0, OK: 0, CANHBAO: 0, LOI: 0, KHAC: 0 };
            ngay.push(key[k]);
        }
        $.each(me.dtAll, function (i, r) {
            var dt = PQ.parseNgayGio(me._c(r, 'THOIGIAN'));
            if (!dt) return;
            var o = key[PQ.dmyDate(dt)];
            if (!o) return;
            o.tong++;
            o[me._loaiTT(me._c(r, 'TRANGTHAI'))]++;
        });
        var iMax = 0;
        $.each(ngay, function (i, o) { if (o.tong > iMax) iMax = o.tong; });
        var h = '';
        $.each(ngay, function (i, o) {
            var strTip = o.nhan + ': ' + o.tong + ' lượt (OK ' + o.OK + ', cảnh báo ' + o.CANHBAO + ', lỗi ' + o.LOI + (o.KHAC ? ', khác ' + o.KHAC : '') + ')';
            var seg = '';
            if (o.tong > 0) {
                seg = '<div class="pq-bar-stack" style="height:' + Math.max(4, Math.round(o.tong / iMax * 100)) + '%">'
                    + (o.OK ? '<div class="pq-seg-ok" style="flex:' + o.OK + '"></div>' : '')
                    + (o.CANHBAO ? '<div class="pq-seg-warn" style="flex:' + o.CANHBAO + '"></div>' : '')
                    + (o.LOI ? '<div class="pq-seg-err" style="flex:' + o.LOI + '"></div>' : '')
                    + (o.KHAC ? '<div class="pq-seg-khac" style="flex:' + o.KHAC + '"></div>' : '')
                    + '</div>';
            }
            h += '<div class="pq-bar-col" title="' + PQ.esc(strTip) + '"><div class="pq-bar-val">' + (o.tong || '') + '</div>'
                + '<div class="pq-bar-area">' + seg + '</div><div class="pq-bar-day">' + PQ.esc(o.nhan) + '</div></div>';
        });
        $("#zoneBieuDo_NhatKy").html(h);
        $("#lblNK_ChartEmpty").css("display", iMax === 0 ? "" : "none");
        $("#lblNK_ChartTitle").text(den.getTime() === PQ.homNay().getTime()
            ? "Lượt chạy theo ngày — " + me.SO_NGAY_BIEUDO + " ngày gần nhất"
            : "Lượt chạy theo ngày — " + me.SO_NGAY_BIEUDO + " ngày tính đến " + PQ.dmyDate(den));
    },

    /*------------------------------------------
    --[3] Chi tiết (LayTT theo strid)
    -------------------------------------------*/
    popup_Xem: function (strIdx) {
        var me = this;
        var row = me.dtShow[parseInt(strIdx, 10)];
        if (!row) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var strId = me._c(row, 'ID');
        if (strId === '') {     // response không có cột ID → không tra được, hiện dữ liệu của dòng
            me.showChiTiet(row, row, true);
            return;
        }
        PQ.call(me.API.LAYTT, { 'strid': strId }, function (data) {
            var d = data.Data;
            if ($.isArray(d)) d = d[0];
            if (data.Success && d && !$.isEmptyObject(d)) {
                me.showChiTiet(d, row, false);
            } else {
                if (window.console) console.warn('[nhatkydongbo] LayTT không trả dữ liệu — dùng dòng trong danh sách.', data);
                me.showChiTiet(row, row, true);
            }
        }, function (er) {
            if (window.console) console.warn('[nhatkydongbo] LayTT lỗi — dùng dòng trong danh sách.', er);
            me.showChiTiet(row, row, true);
        });
    },
    showChiTiet: function (d, rowList, bFallback) {
        var me = this;
        // Cột nào chi tiết không có thì lấy từ dòng trong danh sách
        var lay = function (strKey) { var v = me._c(d, strKey); return v !== '' ? v : me._c(rowList, strKey); };
        var kv = function (strKey, strHtml) { return '<tr><td>' + PQ.esc(strKey) + '</td><td>' + strHtml + '</td></tr>'; };
        var strTg = PQ.dmyHms(lay('THOIGIAN'));
        var strNguon = lay('NGUON_LOAI') + ' / ' + lay('NGUON_ID');
        var strChiTiet = lay('CHITIET');

        var tong = '';
        tong += kv('Thời điểm', '<span class="pq-mono">' + PQ.esc(strTg) + '</span>');
        tong += kv('Nguồn', '<span class="pq-mono">' + PQ.esc(strNguon) + '</span>');
        tong += kv('+ Thêm', PQ.esc(lay('THEM')));
        tong += kv('− Xóa', PQ.esc(lay('XOA')));
        tong += kv('Trạng thái', me._pillTT(lay('TRANGTHAI')));
        tong += kv('Chi tiết', strChiTiet === '' ? '<span class="pq-sub">—</span>' : PQ.esc(strChiTiet));
        $("#tblNK_TongHop tbody").html(tong);

        var goc = '';
        $.each(d, function (k, v) {
            var s = (v === null || v === undefined) ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
            goc += '<tr><td>' + PQ.esc(k) + '</td><td>' + PQ.esc(s) + '</td></tr>';
        });
        $("#tblNK_Goc tbody").html(goc);

        $("#noteNK_Fallback").css("display", bFallback ? "" : "none");
        $("#titleNhatKy").text(strNguon + (strTg ? " · " + strTg : ""));
        $("#myModalNhatKy").modal("show");
    }
};
