/*----------------------------------------------
--Màn hình : Ghi đè đường lan truyền (chucnang_duong_lantruyen)
--Hàm gọi  : PKG_CORE_QUANTRI_04.chucnang_duong_LT_LayDS / _LayTT / _Them / _Sua / _Xoa
--            + danh mục cho các ô chọn (qua pqcommon.js): chức năng + ứng dụng, quan hệ phân cấp, loại đối tượng
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, ...) — nạp trước file này.
--Ghi chú  : - Khóa bản ghi gồm 2 cột (strchucnang_id + strdm_quanhe_phancap_id) nên khi Sửa khóa cả 2 ô chọn.
--           - LayDS chỉ nhận strtukhoa (không phân trang) → ô lọc "Áp dụng chặn" lọc phía trình duyệt.
--           - Tên cột response (CHUCNANG_ID, DM_QUANHE_PHANCAP_ID, AP_DUNG_CHAN) suy ra từ tên tham số — nếu BE
--             trả tên khác, console sẽ cảnh báo. Tên chức năng/quan hệ tự tra từ danh mục (response chỉ có ID).
----------------------------------------------*/
function GhiDeDuongLanTruyen() { };
GhiDeDuongLanTruyen.prototype = {
    dtAll: [],          // kết quả LayDS theo từ khóa (chưa lọc ô "Áp dụng chặn")
    mapChucNang: {},    // ID chức năng → {TEN, MA, UD, LABEL}
    mapQuanHe: {},      // ID quan hệ → {ID, LOAI_CON_MA, LOAI_CHA_MA}
    mapLoai: {},        // mã loại đối tượng → tên
    strCn_Sua: '',      // khóa đang Sửa; cả 2 rỗng = đang Thêm mới
    strQh_Sua: '',
    strTuKhoa: '',      // từ khóa của lần LayDS gần nhất
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/Iik0Ii8gLyYeJTQuLyYeDRUeDSA4BRIP', func: 'PKG_CORE_QUANTRI_04.chucnang_duong_LT_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/Iik0Ii8gLyYeJTQuLyYeDRUeDSA4FRUP', func: 'PKG_CORE_QUANTRI_04.chucnang_duong_LT_LayTT' },
        THEM: { action: 'CMS_QuanTri04_MH/Iik0Ii8gLyYeJTQuLyYeDRUeFSkkLAPP', func: 'PKG_CORE_QUANTRI_04.chucnang_duong_LT_Them' },
        SUA: { action: 'CMS_QuanTri04_MH/Iik0Ii8gLyYeJTQuLyYeDRUeEjQg', func: 'PKG_CORE_QUANTRI_04.chucnang_duong_LT_Sua' },
        XOA: { action: 'CMS_QuanTri04_MH/Iik0Ii8gLyYeJTQuLyYeDRUeGS4g', func: 'PKG_CORE_QUANTRI_04.chucnang_duong_LT_Xoa' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter)
        PQ.attachExport({
            table: 'tblGhiDe', title: 'DANH SÁCH GHI ĐÈ ĐƯỜNG LAN TRUYỀN', fileName: 'GhiDeDuongLanTruyen',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; },
            filters: [[{ label: 'Áp dụng chặn', id: 'dropSearch_GD_ApDungChan' }]]
        });
        // Nạp song song 3 danh mục (đổ ô chọn + tra tên hiển thị trong bảng), xong mới tải danh sách.
        // Danh mục nào lỗi thì bảng hiện ID thay cho tên, màn hình vẫn dùng được.
        PQ.whenAll([PQ.loadChucNang, PQ.loadQuanHe, PQ.loadLoaiDoiTuong], function (kq) {
            var dtCn = kq[0], dtQh = kq[1], dtLoai = kq[2];
            me.mapLoai = PQ.mapOf(dtLoai, 'MA', 'TEN');
            me.mapChucNang = {};
            $.each(dtCn, function (i, r) { me.mapChucNang[r.ID] = r; });
            me.mapQuanHe = {};
            $.each(dtQh, function (i, r) { me.mapQuanHe[r.ID] = r; });

            PQ.loadCombo(["dropGD_ChucNang"],
                $.map(dtCn, function (r) { return { ID: r.ID, TEN: r.LABEL }; }),
                "-- Chọn chức năng --");
            PQ.loadCombo(["dropGD_QuanHe"],
                $.map(dtQh, function (r) { return { ID: r.ID, TEN: PQ.nhanQuanHe(r, me.mapLoai) }; }),
                "-- Chọn quan hệ phân cấp --");
            me.getList_GhiDe();
        });

        $("#btnSearch_GhiDe").click(function () {
            me.getList_GhiDe();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_GhiDe").on("keyup", function (e) {
            if (e.which === 13) me.getList_GhiDe();
        });
        // Ô lọc này lọc ngay trên danh sách đã tải, không gọi lại BE
        $("#dropSearch_GD_ApDungChan").on("change", function () {
            me.render_GhiDe();
        });
        $("#btnAdd_GhiDe").click(function () {
            me.popup_Them();
        });
        $("#btnSave_GhiDe").click(function () {
            me.save_GhiDe();
        });
        $("#tblGhiDe").delegate(".btnEdit", "click", function () {
            me.popup_Sua($(this).attr("data-cn"), $(this).attr("data-qh"));
        });
        $("#tblGhiDe").delegate(".btnDelete", "click", function () {
            me.confirm_Xoa($(this).attr("data-cn"), $(this).attr("data-qh"));
        });
    },

    /*------------------------------------------
    --Tiện ích riêng của màn hình
    -------------------------------------------*/
    _findRow: function (strCn, strQh) {
        var me = this;
        for (var i = 0; i < me.dtAll.length; i++) {
            if (PQ.g(me.dtAll[i], 'CHUCNANG_ID') == strCn && PQ.g(me.dtAll[i], 'DM_QUANHE_PHANCAP_ID') == strQh) return me.dtAll[i];
        }
        return null;
    },
    _tenLoai: function (strMa) {
        return (PQ.has(this.mapLoai, strMa) && this.mapLoai[strMa]) ? this.mapLoai[strMa] : strMa;
    },
    // Nhãn chức năng thuần chữ; không có trong danh mục thì trả ID
    _nhanChucNang: function (strCn) {
        return PQ.has(this.mapChucNang, strCn) ? this.mapChucNang[strCn].LABEL : strCn;
    },
    _nhanQuanHe: function (strQh) {
        return PQ.has(this.mapQuanHe, strQh) ? PQ.nhanQuanHe(this.mapQuanHe[strQh], this.mapLoai) : strQh;
    },
    _chucNangHtml: function (strCn) {
        return PQ.chucNangHtml(this.mapChucNang, strCn);
    },
    _quanHeHtml: function (strQh) {
        var me = this;
        var s = '<span class="pq-mono">' + PQ.esc(strQh) + '</span>';
        if (PQ.has(me.mapQuanHe, strQh)) {
            var q = me.mapQuanHe[strQh];
            if (q.LOAI_CON_MA || q.LOAI_CHA_MA) {
                s += ' <span class="pq-sub">(' + PQ.esc(me._tenLoai(q.LOAI_CON_MA)) + ' <i class="fa fa-long-arrow-right"></i> ' + PQ.esc(me._tenLoai(q.LOAI_CHA_MA)) + ')</span>';
            }
        }
        return s;
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS)
    -------------------------------------------*/
    getList_GhiDe: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_GhiDe'));
        PQ.call(me.API.LAYDS, { 'strtukhoa': strTuKhoa }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'CHUCNANG_ID') === '' && window.console) {
                console.warn('[ghideduonglantruyen] Response LayDS không có cột CHUCNANG_ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            if (!strTuKhoa) me.iTong = me.dtAll.length;
            me.render_GhiDe();
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    // Lọc theo ô "Áp dụng chặn" (phía trình duyệt) rồi vẽ bảng + nhãn đếm
    render_GhiDe: function () {
        var me = this;
        var strChan = edu.util.getValById('dropSearch_GD_ApDungChan');
        var dt = me.dtAll;
        if (strChan !== '') {
            dt = $.grep(me.dtAll, function (r) {
                return (PQ.isTrue(PQ.g(r, 'AP_DUNG_CHAN')) ? '1' : '0') === strChan;
            });
        }
        var bLoc = !!me.strTuKhoa || strChan !== '';
        $("#lblCount_GhiDe").text((bLoc && me.iTong !== undefined)
            ? dt.length + ' / ' + me.iTong + ' bản ghi'
            : dt.length + ' bản ghi');
        me.genTable_GhiDe(dt);
    },
    genTable_GhiDe: function (data) {
        var me = this;
        var strKhoa = function (aData) {
            return ' data-cn="' + PQ.esc(PQ.g(aData, 'CHUCNANG_ID')) + '" data-qh="' + PQ.esc(PQ.g(aData, 'DM_QUANHE_PHANCAP_ID')) + '"';
        };
        var jsonForm = {
            strTable_Id: "tblGhiDe",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Sửa | 2 Chức năng | 3 Quan hệ bị ghi đè | 4 Áp dụng chặn | 5 Xóa
            colPos: {
                center: [0, 1, 4, 5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnEdit"' + strKhoa(aData) + ' title="Sửa"><i class="fa fa-edit color-active"></i></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._chucNangHtml(PQ.g(aData, 'CHUCNANG_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._quanHeHtml(PQ.g(aData, 'DM_QUANHE_PHANCAP_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return PQ.isTrue(PQ.g(aData, 'AP_DUNG_CHAN'))
                            ? '<span class="pq-pill pq-pill-deny">CHẶN</span>'
                            : '<span class="pq-pill pq-pill-allow">CHO PHÉP</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDelete"' + strKhoa(aData) + ' title="Xóa"><i class="fa fa-trash color-active"></i></a>';
                    }
                }
            ]
        };
        PQ.veBang(jsonForm);
    },

    /*------------------------------------------
    --[2] Popup Thêm / Sửa
    -------------------------------------------*/
    resetForm: function () {
        var me = this;
        me.strCn_Sua = '';
        me.strQh_Sua = '';
        $("#btnNotifyModal").remove();
        PQ.setDrop("dropGD_ChucNang", "");
        PQ.setDrop("dropGD_QuanHe", "");
        PQ.setDrop("dropGD_ApDungChan", "");
        $("#dropGD_ChucNang, #dropGD_QuanHe").prop("disabled", false);
        $("#titleGhiDe").text("");
    },
    popup_Them: function () {
        var me = this;
        me.resetForm();
        $("#titleAction_GhiDe").text("Thêm");
        $("#myModalGhiDe").modal("show");
    },
    // Lấy chi tiết bằng LayTT (khóa gồm 2 cột); lỗi hoặc rỗng thì dùng dòng đã có trong danh sách
    popup_Sua: function (strCn, strQh) {
        var me = this;
        if (!edu.util.checkValue(strCn) || !edu.util.checkValue(strQh)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var rowCache = me._findRow(strCn, strQh);
        PQ.call(me.API.LAYTT, { 'strchucnang_id': strCn, 'strdm_quanhe_phancap_id': strQh }, function (data) {
            var d = data.Data;
            if ($.isArray(d)) d = d[0];
            if (data.Success && d && PQ.g(d, 'CHUCNANG_ID') !== '') {
                me.openForm_Sua(d);
            } else {
                if (window.console) console.warn('[ghideduonglantruyen] LayTT không trả dữ liệu — dùng dòng trong danh sách.', data);
                me.openForm_Sua(rowCache);
            }
        }, function (er) {
            if (window.console) console.warn('[ghideduonglantruyen] LayTT lỗi — dùng dòng trong danh sách.', er);
            me.openForm_Sua(rowCache);
        });
    },
    openForm_Sua: function (row) {
        var me = this;
        if (!row) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        me.resetForm();
        var strCn = PQ.g(row, 'CHUCNANG_ID');
        var strQh = PQ.g(row, 'DM_QUANHE_PHANCAP_ID');
        me.strCn_Sua = strCn;
        me.strQh_Sua = strQh;
        PQ.setDrop("dropGD_ChucNang", strCn);
        PQ.setDrop("dropGD_QuanHe", strQh);
        PQ.setDrop("dropGD_ApDungChan", PQ.isTrue(PQ.g(row, 'AP_DUNG_CHAN')) ? "1" : "0");
        $("#dropGD_ChucNang, #dropGD_QuanHe").prop("disabled", true);
        $("#titleAction_GhiDe").text("Sửa");
        $("#titleGhiDe").text(me._nhanChucNang(strCn) + " × " + strQh);
        $("#myModalGhiDe").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them / Sua)
    -------------------------------------------*/
    save_GhiDe: function () {
        var me = this;
        var bSua = !!(me.strCn_Sua && me.strQh_Sua);
        var strCn = bSua ? me.strCn_Sua : edu.util.getValById("dropGD_ChucNang");
        var strQh = bSua ? me.strQh_Sua : edu.util.getValById("dropGD_QuanHe");
        var strChan = edu.util.getValById("dropGD_ApDungChan");

        var strThieu = [];
        if (!strCn) strThieu.push("Chức năng");
        if (!strQh) strThieu.push("Quan hệ phân cấp");
        if (strChan === '' || strChan === null) strThieu.push("Áp dụng chặn");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng chọn: " + strThieu.join(", ") + "." });
            return;
        }

        var params = {
            'strchucnang_id': strCn,
            'strdm_quanhe_phancap_id': strQh,
            // Cột số của Oracle: luôn gửi 0/1, không gửi rỗng
            'dap_dung_chan': parseInt(strChan, 10) === 1 ? 1 : 0
        };
        PQ.call(bSua ? me.API.SUA : me.API.THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = khóa vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalGhiDe", bSua ? "Cập nhật thành công!" : "Thêm mới thành công!");
                me.getList_GhiDe();
            } else {
                edu.system.alertOnModal({ type: "w", content: data.Message });
            }
        }, function (er) {
            edu.system.alertOnModal({ type: "w", content: PQ.msgLoi(er) });
        });
    },

    /*------------------------------------------
    --[4] Xóa
    -------------------------------------------*/
    confirm_Xoa: function (strCn, strQh) {
        var me = this;
        if (!edu.util.checkValue(strCn) || !edu.util.checkValue(strQh)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        edu.system.confirm("Bạn có chắc chắn muốn xóa ghi đè của chức năng <b>" + PQ.esc(me._nhanChucNang(strCn))
            + "</b> trên quan hệ <b>" + PQ.esc(me._nhanQuanHe(strQh)) + "</b> không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_GhiDe(strCn, strQh);
        });
    },
    delete_GhiDe: function (strCn, strQh) {
        var me = this;
        PQ.call(me.API.XOA, { 'strchucnang_id': strCn, 'strdm_quanhe_phancap_id': strQh }, function (data) {
            if (PQ.ghiOk(data, [strCn, strQh])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_GhiDe();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
