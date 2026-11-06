/*----------------------------------------------
--Màn hình : Quan hệ phân cấp (dm_quanhe_phancap)
--Hàm gọi  : PKG_CORE_QUANTRI_04.dm_quanhe_phancap_LayDS / _LayTT / _Them / _Sua / _Xoa
--            + dm_loaidoituong_LayDS (danh mục cho 2 ô chọn loại con / loại cha, qua PQ.loadLoaiDoiTuong)
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, ...) — nạp trước file này.
--Ghi chú  : - Khóa bản ghi là strid (mã quan hệ) nên khi Sửa không cho đổi mã.
--           - LayDS chỉ nhận strtukhoa (không phân trang) → ô lọc "Mặc định dùng phân quyền" lọc phía trình duyệt.
--           - Tên cột response (ID, LOAI_CON_MA, LOAI_CHA_MA, NGUON_TRUYVAN, CO_DE_QUY, MACDINH_DUNG_PHANQUYEN) suy ra
--             từ tên tham số — nếu BE trả tên khác, console sẽ cảnh báo.
----------------------------------------------*/
function QuanHePhanCap() { };
QuanHePhanCap.prototype = {
    dtAll: [],          // kết quả LayDS theo từ khóa (chưa lọc ô "Mặc định dùng phân quyền")
    mapLoai: {},        // mã loại đối tượng → tên
    strId_Sua: '',      // '' = đang Thêm mới; có giá trị = đang Sửa quan hệ có mã này
    strTuKhoa: '',      // từ khóa của lần LayDS gần nhất
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/JSweMDQgLykkHjEpIC8iIDEeDSA4BRIP', func: 'PKG_CORE_QUANTRI_04.dm_quanhe_phancap_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/JSweMDQgLykkHjEpIC8iIDEeDSA4FRUP', func: 'PKG_CORE_QUANTRI_04.dm_quanhe_phancap_LayTT' },
        THEM: { action: 'CMS_QuanTri04_MH/JSweMDQgLykkHjEpIC8iIDEeFSkkLAPP', func: 'PKG_CORE_QUANTRI_04.dm_quanhe_phancap_Them' },
        SUA: { action: 'CMS_QuanTri04_MH/JSweMDQgLykkHjEpIC8iIDEeEjQg', func: 'PKG_CORE_QUANTRI_04.dm_quanhe_phancap_Sua' },
        XOA: { action: 'CMS_QuanTri04_MH/JSweMDQgLykkHjEpIC8iIDEeGS4g', func: 'PKG_CORE_QUANTRI_04.dm_quanhe_phancap_Xoa' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter). Cột "Con → Cha": mũi tên là biểu tượng nên ghi lại thành chữ
        var chu = function (strMa) { return $('<div>').html(me._nhanLoaiHtml(strMa)).text(); };
        PQ.attachExport({
            table: 'tblQuanHePhanCap', title: 'DANH SÁCH QUAN HỆ PHÂN CẤP', fileName: 'QuanHePhanCap',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; },
            filters: [[{ label: 'Mặc định dùng phân quyền', id: 'dropSearch_QH_MacDinh' }]],
            colOptions: { 2: { render: function (row) { return chu(PQ.g(row, 'LOAI_CON_MA')) + ' → ' + chu(PQ.g(row, 'LOAI_CHA_MA')); } } }
        });
        // Nạp danh mục loại đối tượng trước (đổ 2 ô chọn + hiện "Tên (mã)" trong bảng), xong mới tải danh sách.
        // Nếu nạp lỗi thì bảng chỉ hiện mã, màn hình vẫn dùng được.
        PQ.loadLoaiDoiTuong(function (dt) {
            me.mapLoai = {};
            $.each(dt, function (i, r) { me.mapLoai[r.MA] = r.TEN; });
            PQ.loadCombo_MaTen(["dropQH_LoaiCon"], dt, "-- Chọn loại đối tượng con --");
            PQ.loadCombo_MaTen(["dropQH_LoaiCha"], dt, "-- Chọn loại đối tượng cha --");
            me.getList_QuanHe();
        });

        $("#btnSearch_QuanHe").click(function () {
            me.getList_QuanHe();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_QuanHe").on("keyup", function (e) {
            if (e.which === 13) me.getList_QuanHe();
        });
        // Ô lọc này lọc ngay trên danh sách đã tải, không gọi lại BE
        $("#dropSearch_QH_MacDinh").on("change", function () {
            me.render_QuanHe();
        });
        $("#btnAdd_QuanHe").click(function () {
            me.popup_Them();
        });
        $("#btnSave_QuanHe").click(function () {
            me.save_QuanHe();
        });
        $("#tblQuanHePhanCap").delegate(".btnEdit", "click", function () {
            me.popup_Sua($(this).attr("data-id"));
        });
        $("#tblQuanHePhanCap").delegate(".btnDelete", "click", function () {
            me.confirm_Xoa($(this).attr("data-id"));
        });
    },

    /*------------------------------------------
    --Tiện ích riêng của màn hình
    -------------------------------------------*/
    _findRow: function (strId) {
        var me = this;
        for (var i = 0; i < me.dtAll.length; i++) {
            if (PQ.g(me.dtAll[i], 'ID') == strId) return me.dtAll[i];
        }
        return null;
    },
    _tenLoai: function (strMa) {
        var t = Object.prototype.hasOwnProperty.call(this.mapLoai, strMa) ? this.mapLoai[strMa] : '';
        return t ? t : strMa;
    },
    // "Tên (mã)" cho ô bảng; không có tên thì chỉ hiện mã
    _nhanLoaiHtml: function (strMa) {
        if (!strMa) return '';
        var strTen = Object.prototype.hasOwnProperty.call(this.mapLoai, strMa) ? this.mapLoai[strMa] : '';
        return strTen
            ? PQ.esc(strTen) + ' <span class="pq-mono pq-sub">(' + PQ.esc(strMa) + ')</span>'
            : '<span class="pq-mono">' + PQ.esc(strMa) + '</span>';
    },
    _pillCo: function (v, strKieuCo) {
        return PQ.isTrue(v)
            ? '<span class="pq-pill pq-pill-' + strKieuCo + '">Có</span>'
            : '<span class="pq-pill pq-pill-grey">Không</span>';
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS)
    -------------------------------------------*/
    getList_QuanHe: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_QuanHe'));
        PQ.call(me.API.LAYDS, { 'strtukhoa': strTuKhoa }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'ID') === '' && window.console) {
                console.warn('[quanhephancap] Response LayDS không có cột ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            if (!strTuKhoa) me.iTong = me.dtAll.length;
            me.render_QuanHe();
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    // Lọc theo ô "Mặc định dùng phân quyền" (phía trình duyệt) rồi vẽ bảng + nhãn đếm
    render_QuanHe: function () {
        var me = this;
        var strMacDinh = edu.util.getValById('dropSearch_QH_MacDinh');
        var dt = me.dtAll;
        if (strMacDinh !== '') {
            dt = $.grep(me.dtAll, function (r) {
                return (PQ.isTrue(PQ.g(r, 'MACDINH_DUNG_PHANQUYEN')) ? '1' : '0') === strMacDinh;
            });
        }
        var bLoc = !!me.strTuKhoa || strMacDinh !== '';
        $("#lblCount_QuanHe").text((bLoc && me.iTong !== undefined)
            ? dt.length + ' / ' + me.iTong + ' bản ghi'
            : dt.length + ' bản ghi');
        me.genTable_QuanHe(dt);
    },
    genTable_QuanHe: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanHePhanCap",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Sửa | 2 Mã quan hệ | 3 Con → Cha | 4 Có đệ quy | 5 Mặc định dùng phân quyền | 6 Xóa
            colPos: {
                center: [0, 1, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnEdit" data-id="' + PQ.esc(PQ.g(aData, 'ID')) + '" title="Sửa"><i class="fa fa-edit color-active"></i></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span class="pq-mono">' + PQ.esc(PQ.g(aData, 'ID')) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._nhanLoaiHtml(PQ.g(aData, 'LOAI_CON_MA'))
                            + ' <i class="fa fa-long-arrow-right pq-sub"></i> '
                            + me._nhanLoaiHtml(PQ.g(aData, 'LOAI_CHA_MA'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._pillCo(PQ.g(aData, 'CO_DE_QUY'), 'warn');
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._pillCo(PQ.g(aData, 'MACDINH_DUNG_PHANQUYEN'), 'allow');
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnDelete" data-id="' + PQ.esc(PQ.g(aData, 'ID')) + '" title="Xóa"><i class="fa fa-trash color-active"></i></a>';
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
        me.strId_Sua = '';
        $("#btnNotifyModal").remove();
        edu.util.viewValById("txtQH_Ma", "");
        PQ.setDrop("dropQH_LoaiCon", "");
        PQ.setDrop("dropQH_LoaiCha", "");
        edu.util.viewValById("txtQH_NguonTruyVan", "");
        $("#chkQH_CoDeQuy").prop("checked", false);
        $("#chkQH_MacDinhDungPhanQuyen").prop("checked", false);
        $("#txtQH_Ma").prop("disabled", false);
        $("#titleQuanHe").text("");
    },
    popup_Them: function () {
        var me = this;
        me.resetForm();
        $("#titleAction_QuanHe").text("Thêm");
        $("#myModalQuanHe").modal("show");
    },
    // Lấy chi tiết bằng LayTT; lỗi hoặc rỗng thì dùng dòng đã có trong danh sách
    popup_Sua: function (strId) {
        var me = this;
        if (!edu.util.checkValue(strId)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var rowCache = me._findRow(strId);
        PQ.call(me.API.LAYTT, { 'strid': strId }, function (data) {
            var d = data.Data;
            if ($.isArray(d)) d = d[0];
            if (data.Success && d && PQ.g(d, 'ID') !== '') {
                me.openForm_Sua(d);
            } else {
                if (window.console) console.warn('[quanhephancap] LayTT không trả dữ liệu cho mã "' + strId + '" — dùng dòng trong danh sách.', data);
                me.openForm_Sua(rowCache);
            }
        }, function (er) {
            if (window.console) console.warn('[quanhephancap] LayTT lỗi — dùng dòng trong danh sách.', er);
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
        var strId = PQ.g(row, 'ID');
        var strCon = PQ.g(row, 'LOAI_CON_MA');
        var strCha = PQ.g(row, 'LOAI_CHA_MA');
        me.strId_Sua = strId;
        edu.util.viewValById("txtQH_Ma", strId);
        PQ.setDrop("dropQH_LoaiCon", strCon);
        PQ.setDrop("dropQH_LoaiCha", strCha);
        edu.util.viewValById("txtQH_NguonTruyVan", PQ.g(row, 'NGUON_TRUYVAN'));
        $("#chkQH_CoDeQuy").prop("checked", PQ.isTrue(PQ.g(row, 'CO_DE_QUY')));
        $("#chkQH_MacDinhDungPhanQuyen").prop("checked", PQ.isTrue(PQ.g(row, 'MACDINH_DUNG_PHANQUYEN')));
        $("#txtQH_Ma").prop("disabled", true);
        $("#titleAction_QuanHe").text("Sửa");
        $("#titleQuanHe").text(me._tenLoai(strCon) + " → " + me._tenLoai(strCha) + " (" + strId + ")");
        $("#myModalQuanHe").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them / Sua)
    -------------------------------------------*/
    save_QuanHe: function () {
        var me = this;
        var bSua = !!me.strId_Sua;
        var strId = bSua ? me.strId_Sua : $.trim(edu.util.getValById("txtQH_Ma"));
        var strCon = edu.util.getValById("dropQH_LoaiCon");
        var strCha = edu.util.getValById("dropQH_LoaiCha");

        var strThieu = [];
        if (!strId) strThieu.push("Mã quan hệ");
        if (!strCon) strThieu.push("Loại đối tượng con");
        if (!strCha) strThieu.push("Loại đối tượng cha");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng nhập: " + strThieu.join(", ") + "." });
            return;
        }

        var params = {
            'strid': strId,
            'strloai_con_ma': strCon,
            'strloai_cha_ma': strCha,
            'strnguon_truyvan': $.trim(edu.util.getValById("txtQH_NguonTruyVan")),
            // Cột số của Oracle: luôn gửi 0/1, không gửi rỗng
            'dco_de_quy': $("#chkQH_CoDeQuy").is(":checked") ? 1 : 0,
            'dmacdinh_dung_phanquyen': $("#chkQH_MacDinhDungPhanQuyen").is(":checked") ? 1 : 0
        };
        PQ.call(bSua ? me.API.SUA : me.API.THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = mã vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalQuanHe", bSua ? "Cập nhật thành công!" : "Thêm mới thành công!");
                me.getList_QuanHe();
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
    confirm_Xoa: function (strId) {
        var me = this;
        if (!edu.util.checkValue(strId)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        var row = me._findRow(strId);
        var strMoTa = row ? " (" + me._tenLoai(PQ.g(row, 'LOAI_CON_MA')) + " → " + me._tenLoai(PQ.g(row, 'LOAI_CHA_MA')) + ")" : "";
        edu.system.confirm("Bạn có chắc chắn muốn xóa quan hệ phân cấp <b>" + PQ.esc(strId) + "</b>" + PQ.esc(strMoTa) + " không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_QuanHe(strId);
        });
    },
    delete_QuanHe: function (strId) {
        var me = this;
        PQ.call(me.API.XOA, { 'strid': strId }, function (data) {
            if (PQ.ghiOk(data, [strId])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_QuanHe();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
