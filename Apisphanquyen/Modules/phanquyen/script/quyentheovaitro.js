/*----------------------------------------------
--Màn hình : Quyền theo vai trò — Kênh 2 (dulieu_vaitro_phamvi)
--Hàm gọi  : PKG_CORE_QUANTRI_04.dulieu_vaitro_PV_LayDS / _LayTT / _Them / _Sua / _Xoa
--            + danh mục cho các ô chọn (qua pqcommon.js): vai trò, chức năng (+ ứng dụng), loại đối tượng
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, ...) — nạp trước file này.
--Ghi chú  : - Khóa bản ghi là strid (do BE sinh khi Thêm → Thêm KHÔNG gửi strid; Sửa/Xóa/LayTT gửi strid).
--           - Hàm KHÔNG có tham số "kiểu": Động/Tĩnh suy ra từ trường nào có giá trị —
--               ĐỘNG = có strnguon_truyvan_dongbo (câu truy vấn đồng bộ, đối tượng tự suy ra từ vai trò)
--               TĨNH = có strdoituong_id (gán cứng đúng 1 đối tượng)
--             Ô "Kiểu gán" trên form chỉ để chọn nhóm trường; khi lưu chỉ gửi trường của nhóm đang chọn, trường kia gửi ''.
--           - LayDS chỉ nhận strtukhoa (không phân trang) → ô lọc "Hiệu lực" lọc phía trình duyệt.
--           - Tên cột response (ID, VAITRO_MA, CHUCNANG_ID, LOAIDOITUONG_MA, DOITUONG_ID, NGUON_TRUYVAN_DONGBO,
--             LOAI_HIEULUC) suy ra từ tên tham số — nếu BE trả tên khác, console sẽ cảnh báo.
--           - Việc ẩn/hiện nhóm trường theo "Kiểu gán" do script nhỏ trong quyentheovaitro.html (K2) lo.
----------------------------------------------*/
function QuyenTheoVaiTro() { };
QuyenTheoVaiTro.prototype = {
    dtAll: [],          // kết quả LayDS theo từ khóa (chưa lọc ô "Hiệu lực")
    mapVaiTro: {},      // mã vai trò → tên
    mapChucNang: {},    // ID chức năng → {TEN, MA, UD, LABEL}
    mapLoai: {},        // mã loại đối tượng → tên
    strId_Sua: '',      // '' = đang Thêm mới; có giá trị = đang Sửa bản ghi có strid này
    strTuKhoa: '',      // từ khóa của lần LayDS gần nhất
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/JTQtKCQ0HjcgKDUzLh4RFx4NIDgFEgPP', func: 'PKG_CORE_QUANTRI_04.dulieu_vaitro_PV_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/JTQtKCQ0HjcgKDUzLh4RFx4NIDgVFQPP', func: 'PKG_CORE_QUANTRI_04.dulieu_vaitro_PV_LayTT' },
        THEM: { action: 'CMS_QuanTri04_MH/JTQtKCQ0HjcgKDUzLh4RFx4VKSQs', func: 'PKG_CORE_QUANTRI_04.dulieu_vaitro_PV_Them' },
        SUA: { action: 'CMS_QuanTri04_MH/JTQtKCQ0HjcgKDUzLh4RFx4SNCAP', func: 'PKG_CORE_QUANTRI_04.dulieu_vaitro_PV_Sua' },
        XOA: { action: 'CMS_QuanTri04_MH/JTQtKCQ0HjcgKDUzLh4RFx4ZLiAP', func: 'PKG_CORE_QUANTRI_04.dulieu_vaitro_PV_Xoa' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter)
        PQ.attachExport({
            table: 'tblVaiTroK2', title: 'DANH SÁCH QUYỀN THEO VAI TRÒ (KÊNH 2)', fileName: 'QuyenTheoVaiTro',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; },
            filters: [[{ label: 'Hiệu lực', id: 'dropSearch_VT_HieuLuc' }]]
        });
        // Nạp song song 3 danh mục (đổ ô chọn + tra tên hiển thị trong bảng), xong mới tải danh sách.
        // Danh mục nào lỗi thì bảng hiện mã thay cho tên, màn hình vẫn dùng được.
        PQ.whenAll([PQ.loadVaiTro, PQ.loadChucNang, PQ.loadLoaiDoiTuong], function (kq) {
            var dtVt = kq[0], dtCn = kq[1], dtLoai = kq[2];
            me.mapVaiTro = PQ.mapOf(dtVt, 'MA', 'TEN');
            me.mapLoai = PQ.mapOf(dtLoai, 'MA', 'TEN');
            me.mapChucNang = {};
            $.each(dtCn, function (i, r) { me.mapChucNang[r.ID] = r; });

            PQ.loadCombo_MaTen(["dropVT_VaiTro"], dtVt, "-- Chọn vai trò --");
            PQ.loadCombo(["dropVT_ChucNang"],
                $.map(dtCn, function (r) { return { ID: r.ID, TEN: r.LABEL }; }),
                "-- Chọn chức năng --");
            PQ.loadCombo_MaTen(["dropVT_LoaiDoiTuong"], dtLoai, "-- Chọn loại đối tượng --");
            me.getList_VaiTro();
        });

        $("#btnSearch_VaiTro").click(function () {
            me.getList_VaiTro();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_VaiTro").on("keyup", function (e) {
            if (e.which === 13) me.getList_VaiTro();
        });
        // Ô lọc này lọc ngay trên danh sách đã tải, không gọi lại BE
        $("#dropSearch_VT_HieuLuc").on("change", function () {
            me.render_VaiTro();
        });
        $("#btnAdd_VaiTro").click(function () {
            me.popup_Them();
        });
        $("#btnSave_VaiTro").click(function () {
            me.save_VaiTro();
        });
        // Chọn loại đối tượng → hiện bảng danh sách đối tượng để chọn (kiểu Tĩnh)
        me.pickDT = PQ.pickerDoiTuong({ drop: 'dropVT_LoaiDoiTuong', txt: 'txtVT_DoiTuong' });
        $("#tblVaiTroK2").delegate(".btnEdit", "click", function () {
            me.popup_Sua($(this).attr("data-id"));
        });
        $("#tblVaiTroK2").delegate(".btnDelete", "click", function () {
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
    // 'DONG' | 'TINH' | '' — suy ra từ trường nào có giá trị (hàm BE không có cột kiểu)
    _kieu: function (row) {
        if ($.trim(PQ.g(row, 'NGUON_TRUYVAN_DONGBO')) !== '') return 'DONG';
        if ($.trim(PQ.g(row, 'DOITUONG_ID')) !== '') return 'TINH';
        return '';
    },
    _hieuLuc: function (row) {
        return String(PQ.g(row, 'LOAI_HIEULUC')).toUpperCase();
    },
    _tenLoai: function (strMa) {
        return (PQ.has(this.mapLoai, strMa) && this.mapLoai[strMa]) ? this.mapLoai[strMa] : strMa;
    },
    _nhanVaiTro: function (strMa) {
        return (PQ.has(this.mapVaiTro, strMa) && this.mapVaiTro[strMa]) ? this.mapVaiTro[strMa] + " (" + strMa + ")" : strMa;
    },
    _tenChucNang: function (strId) {
        return PQ.has(this.mapChucNang, strId) ? this.mapChucNang[strId].TEN : strId;
    },
    _vaiTroHtml: function (strMa) {
        var me = this;
        return (PQ.has(me.mapVaiTro, strMa) && me.mapVaiTro[strMa])
            ? PQ.esc(me.mapVaiTro[strMa]) + ' <span class="pq-mono pq-sub">(' + PQ.esc(strMa) + ')</span>'
            : '<span class="pq-mono">' + PQ.esc(strMa) + '</span>';
    },
    _chucNangHtml: function (strId) {
        return PQ.chucNangHtml(this.mapChucNang, strId);
    },
    _phamViHtml: function (row) {
        var me = this;
        var strLoai = PQ.g(row, 'LOAIDOITUONG_MA');
        var s = '<span>' + PQ.esc(me._tenLoai(strLoai)) + '</span>';
        var kieu = me._kieu(row);
        if (kieu === 'TINH') s += ' <span class="pq-sub">/</span> <span class="pq-mono">' + PQ.esc(PQ.g(row, 'DOITUONG_ID')) + '</span>';
        else if (kieu === 'DONG') s += ' <span class="pq-sub">/ (suy ra từ vai trò)</span>';
        return s;
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS)
    -------------------------------------------*/
    getList_VaiTro: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_VaiTro'));
        PQ.call(me.API.LAYDS, { 'strtukhoa': strTuKhoa }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'ID') === '' && window.console) {
                console.warn('[quyentheovaitro] Response LayDS không có cột ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            if (!strTuKhoa) me.iTong = me.dtAll.length;
            me.render_VaiTro();
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    // Lọc theo ô "Hiệu lực" (phía trình duyệt) rồi vẽ bảng + nhãn đếm
    render_VaiTro: function () {
        var me = this;
        var strHl = edu.util.getValById('dropSearch_VT_HieuLuc');
        var dt = me.dtAll;
        if (strHl !== '') {
            dt = $.grep(me.dtAll, function (r) { return me._hieuLuc(r) === strHl; });
        }
        var bLoc = !!me.strTuKhoa || strHl !== '';
        $("#lblCount_VaiTro").text((bLoc && me.iTong !== undefined)
            ? dt.length + ' / ' + me.iTong + ' bản ghi'
            : dt.length + ' bản ghi');
        me.genTable_VaiTro(dt);
    },
    genTable_VaiTro: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblVaiTroK2",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Sửa | 2 Vai trò | 3 Chức năng | 4 Phạm vi | 5 Kiểu | 6 Hiệu lực | 7 Xóa
            colPos: {
                center: [0, 1, 5, 6, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnEdit" data-id="' + PQ.esc(PQ.g(aData, 'ID')) + '" title="Sửa"><i class="fa fa-edit color-active"></i></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._vaiTroHtml(PQ.g(aData, 'VAITRO_MA'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._chucNangHtml(PQ.g(aData, 'CHUCNANG_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._phamViHtml(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var k = me._kieu(aData);
                        if (k === 'DONG') return '<span class="pq-pill pq-pill-allow">Động</span>';
                        if (k === 'TINH') return '<span class="pq-pill pq-pill-warn">Tĩnh</span>';
                        return '<span class="pq-sub">—</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var h = me._hieuLuc(aData);
                        if (h === 'ALLOW') return '<span class="pq-pill pq-pill-allow">ALLOW</span>';
                        if (h === 'DENY') return '<span class="pq-pill pq-pill-deny">DENY</span>';
                        return '<span class="pq-pill pq-pill-grey">' + PQ.esc(h) + '</span>';
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
        PQ.setDrop("dropVT_VaiTro", "");
        PQ.setDrop("dropVT_ChucNang", "");
        PQ.setDrop("dropVT_LoaiDoiTuong", "");
        PQ.setDrop("dropVT_Kieu", "");           // kích hoạt ẩn cả 2 nhóm trường (script K2 trong html)
        edu.util.viewValById("txtVT_NguonTruyVan", "");
        edu.util.viewValById("txtVT_DoiTuong", "");
        me.pickDT.dong();
        PQ.setDrop("dropVT_HieuLuc", "");
        $("#titleVaiTro").text("");
    },
    popup_Them: function () {
        var me = this;
        me.resetForm();
        $("#titleAction_VaiTro").text("Thêm");
        $("#myModalVaiTro").modal("show");
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
                if (window.console) console.warn('[quyentheovaitro] LayTT không trả dữ liệu cho strid "' + strId + '" — dùng dòng trong danh sách.', data);
                me.openForm_Sua(rowCache);
            }
        }, function (er) {
            if (window.console) console.warn('[quyentheovaitro] LayTT lỗi — dùng dòng trong danh sách.', er);
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
        var strVt = PQ.g(row, 'VAITRO_MA');
        var strCn = PQ.g(row, 'CHUCNANG_ID');
        me.strId_Sua = strId;
        PQ.setDrop("dropVT_VaiTro", strVt);
        PQ.setDrop("dropVT_ChucNang", strCn);
        PQ.setDrop("dropVT_LoaiDoiTuong", PQ.g(row, 'LOAIDOITUONG_MA'));
        PQ.setDrop("dropVT_Kieu", me._kieu(row));  // đổi kiểu → script K2 trong html hiện đúng nhóm trường
        edu.util.viewValById("txtVT_NguonTruyVan", PQ.g(row, 'NGUON_TRUYVAN_DONGBO'));
        edu.util.viewValById("txtVT_DoiTuong", PQ.g(row, 'DOITUONG_ID'));
        PQ.setDrop("dropVT_HieuLuc", me._hieuLuc(row));
        $("#titleAction_VaiTro").text("Sửa");
        $("#titleVaiTro").text(me._nhanVaiTro(strVt) + " × " + me._tenChucNang(strCn));
        me.pickDT.dongBo();   // loại + mã đã điền bằng code: thu gọn bảng, chỉ hiện "Đã chọn: ..."
        $("#myModalVaiTro").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them / Sua)
    -------------------------------------------*/
    save_VaiTro: function () {
        var me = this;
        var bSua = !!me.strId_Sua;
        var strVt = edu.util.getValById("dropVT_VaiTro");
        var strCn = edu.util.getValById("dropVT_ChucNang");
        var strLoai = edu.util.getValById("dropVT_LoaiDoiTuong");
        var strKieu = edu.util.getValById("dropVT_Kieu");
        var strSql = $.trim(edu.util.getValById("txtVT_NguonTruyVan"));
        var strDoiTuong = $.trim(edu.util.getValById("txtVT_DoiTuong"));
        var strHl = edu.util.getValById("dropVT_HieuLuc");

        var strThieu = [];
        if (!strVt) strThieu.push("Vai trò");
        if (!strCn) strThieu.push("Chức năng");
        if (!strLoai) strThieu.push("Loại đối tượng");
        if (!strKieu) strThieu.push("Kiểu gán");
        if (strKieu === 'DONG' && !strSql) strThieu.push("Nguồn truy vấn đồng bộ");
        if (strKieu === 'TINH' && !strDoiTuong) strThieu.push("Mã đối tượng");
        if (!strHl) strThieu.push("Hiệu lực");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng nhập/chọn: " + strThieu.join(", ") + "." });
            return;
        }

        var params = {
            'strvaitro_ma': strVt,
            'strchucnang_id': strCn,
            'strloaidoituong_ma': strLoai,
            // Chỉ gửi trường của nhóm đang chọn; trường còn lại để rỗng (BE dựa vào đây để phân Động/Tĩnh)
            'strdoituong_id': strKieu === 'TINH' ? strDoiTuong : '',
            'strnguon_truyvan_dongbo': strKieu === 'DONG' ? strSql : '',
            'strloai_hieuluc': strHl
        };
        if (bSua) params.strid = me.strId_Sua;   // Thêm: BE tự sinh strid nên không gửi

        PQ.call(bSua ? me.API.SUA : me.API.THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = khóa/ID vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalVaiTro", bSua ? "Cập nhật thành công!" : "Thêm mới thành công!");
                me.getList_VaiTro();
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
        var strMoTa = row
            ? "vai trò <b>" + PQ.esc(me._nhanVaiTro(PQ.g(row, 'VAITRO_MA'))) + "</b> trên chức năng <b>" + PQ.esc(me._tenChucNang(PQ.g(row, 'CHUCNANG_ID'))) + "</b>"
            : "<b>" + PQ.esc(strId) + "</b>";
        edu.system.confirm("Bạn có chắc chắn muốn xóa quyền của " + strMoTa + " không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_VaiTro(strId);
        });
    },
    delete_VaiTro: function (strId) {
        var me = this;
        PQ.call(me.API.XOA, { 'strid': strId }, function (data) {
            if (PQ.ghiOk(data, [strId])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_VaiTro();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
