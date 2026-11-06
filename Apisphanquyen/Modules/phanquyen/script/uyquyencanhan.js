/*----------------------------------------------
--Màn hình : Ủy quyền cá nhân — Kênh 3 (dulieu_nguoidung_phamvi)
--Hàm gọi  : PKG_CORE_QUANTRI_04.dulieu_ND_PV_LayDS / _LayTT / _Them / _Sua / _Xoa
--            + danh mục (qua pqcommon.js): chức năng (+ ứng dụng), loại đối tượng; tìm người dùng theo từ khóa
--Phụ thuộc: pqcommon.js (PQ.call, PQ.g, PQ.esc, PQ.dmy, PQ.pickerNguoiDung, PQ.nguoiDungHtml, ...) — nạp trước file này.
--Ghi chú  : - Khóa bản ghi là strid (BE tự sinh khi Thêm → Thêm KHÔNG gửi strid; Sửa/Xóa/LayTT gửi strid).
--           - LayDS nhận (strtukhoa, dchi_conhieuluc): dchi_conhieuluc = 1 chỉ lấy dòng còn hiệu lực, 0 = tất cả.
--             Ô "Trạng thái": "Đang hiệu lực" gọi lại BE với cờ = 1; "Hết hạn" lấy tất cả rồi lọc phía trình duyệt
--             (đến-ngày < hôm nay); ô "Hiệu lực" (ALLOW/DENY) cũng lọc phía trình duyệt.
--           - Người dùng có thể hàng nghìn → KHÔNG nạp danh sách: gõ từ khóa + Tìm (hàm chuẩn LayDanhSachNguoiDung, tối đa 50).
--           - Ngày gửi/hiển thị dạng dd/mm/yyyy (ô nhập của hệ thống); đọc được cả ISO và /Date(ms)/ từ BE.
--           - Tên cột response (ID, NGUOIDUNG_ID, CHUCNANG_ID, LOAIDOITUONG_MA, DOITUONG_ID, LOAI_HIEULUC, TUNGAY, DENNGAY)
--             suy ra từ tên tham số — nếu BE trả tên khác, console sẽ cảnh báo. Response có thể KHÔNG kèm tên người dùng
--             (chỉ ID) → khi đó bảng hiện ID và console báo cần bổ sung cột tên/tài khoản vào hàm LayDS.
----------------------------------------------*/
function UyQuyenCaNhan() { };
UyQuyenCaNhan.prototype = {
    pickerND: null,     // ô chọn người dùng trong modal (PQ.pickerNguoiDung)
    dtAll: [],          // kết quả LayDS theo (từ khóa, cờ còn hiệu lực), chưa lọc phía trình duyệt
    mapChucNang: {},    // ID chức năng → {TEN, MA, UD, LABEL}
    mapLoai: {},        // mã loại đối tượng → tên
    strId_Sua: '',      // '' = đang Thêm mới; có giá trị = đang Sửa bản ghi có strid này
    strTuKhoa: '',      // từ khóa của lần LayDS gần nhất
    strTrangThai: '',   // trạng thái của lần LayDS gần nhất ('', 'CONHAN', 'HETHAN')
    iTong: undefined,   // tổng số bản ghi khi không lọc (để hiện "x / tổng")
    // Cờ dchi_conhieuluc gửi cho trường hợp "lấy tất cả". Quy ước ban đầu: 0 = tất cả, 1 = chỉ còn hiệu lực.
    // TẠM 06/11/2026: sếp BE báo hàm trả 0 dòng với cờ 0 dù DB có 1 bản ghi (response Success=true, Data=[]) → bảo "truyền 1",
    // sếp đang sửa where. Khi sếp báo sửa xong: đổi lại về 0 (chỉ sửa đúng dòng này). Trong lúc truyền 1 mà BE hiểu
    // "chỉ còn hiệu lực" thì bản ghi đã hết hạn sẽ không hiện, và ô Trạng thái = "Hết hạn" sẽ rỗng.
    CO_HIEULUC_TAT_CA: 1,

    API: {
        LAYDS: { action: 'CMS_QuanTri04_MH/JTQtKCQ0Hg8FHhEXHg0gOAUS', func: 'PKG_CORE_QUANTRI_04.dulieu_ND_PV_LayDS' },
        LAYTT: { action: 'CMS_QuanTri04_MH/JTQtKCQ0Hg8FHhEXHg0gOBUV', func: 'PKG_CORE_QUANTRI_04.dulieu_ND_PV_LayTT' },
        THEM: { action: 'CMS_QuanTri04_MH/JTQtKCQ0Hg8FHhEXHhUpJCwP', func: 'PKG_CORE_QUANTRI_04.dulieu_ND_PV_Them' },
        SUA: { action: 'CMS_QuanTri04_MH/JTQtKCQ0Hg8FHhEXHhI0IAPP', func: 'PKG_CORE_QUANTRI_04.dulieu_ND_PV_Sua' },
        XOA: { action: 'CMS_QuanTri04_MH/JTQtKCQ0Hg8FHhEXHhkuIAPP', func: 'PKG_CORE_QUANTRI_04.dulieu_ND_PV_Xoa' }
    },

    init: function () {
        var me = this;
        // Xuất Excel bằng chuẩn chung (edu.exporter)
        PQ.attachExport({
            table: 'tblUyQuyenK3', title: 'DANH SÁCH ỦY QUYỀN CÁ NHÂN (KÊNH 3)', fileName: 'UyQuyenCaNhan',
            subTitles: function () { return me.strTuKhoa ? ['Từ khóa: ' + me.strTuKhoa] : []; },
            filters: [[{ label: 'Hiệu lực', id: 'dropSearch_UQ_HieuLuc' }, { label: 'Trạng thái', id: 'dropSearch_UQ_TrangThai' }]]
        });
        // Nạp song song 2 danh mục (đổ ô chọn + tra tên hiển thị trong bảng), xong mới tải danh sách.
        PQ.whenAll([PQ.loadChucNang, PQ.loadLoaiDoiTuong], function (kq) {
            var dtCn = kq[0], dtLoai = kq[1];
            me.mapLoai = PQ.mapOf(dtLoai, 'MA', 'TEN');
            me.mapChucNang = {};
            $.each(dtCn, function (i, r) { me.mapChucNang[r.ID] = r; });
            PQ.loadCombo(["dropUQ_ChucNang"],
                $.map(dtCn, function (r) { return { ID: r.ID, TEN: r.LABEL }; }),
                "-- Chọn chức năng --");
            PQ.loadCombo_MaTen(["dropUQ_LoaiDoiTuong"], dtLoai, "-- Chọn loại đối tượng --");
            me.getList_UyQuyen();
        });

        $("#btnSearch_UyQuyen").click(function () {
            me.getList_UyQuyen();
        });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $("#txtSearch_UyQuyen").on("keyup", function (e) {
            if (e.which === 13) me.getList_UyQuyen();
        });
        // "Trạng thái" đổi cờ gửi lên BE → tải lại; "Hiệu lực" chỉ lọc trên danh sách đã tải
        $("#dropSearch_UQ_TrangThai").on("change", function () {
            me.getList_UyQuyen();
        });
        $("#dropSearch_UQ_HieuLuc").on("change", function () {
            me.render_UyQuyen();
        });
        $("#btnAdd_UyQuyen").click(function () {
            me.popup_Them();
        });
        $("#btnSave_UyQuyen").click(function () {
            me.save_UyQuyen();
        });
        me.pickerND = PQ.pickerNguoiDung({
            txt: "txtUQ_TimNguoiDung", btn: "btnUQ_TimNguoiDung", drop: "dropUQ_NguoiDung", hint: "hintUQ_NguoiDung"
        });
        // Chọn loại đối tượng → hiện bảng danh sách đối tượng để chọn (không bắt người dùng nhớ ID)
        me.pickDT = PQ.pickerDoiTuong({ drop: 'dropUQ_LoaiDoiTuong', txt: 'txtUQ_DoiTuong' });
        $("#tblUyQuyenK3").delegate(".btnEdit", "click", function () {
            me.popup_Sua($(this).attr("data-id"));
        });
        $("#tblUyQuyenK3").delegate(".btnDelete", "click", function () {
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
    _hieuLuc: function (row) {
        return String(PQ.g(row, 'LOAI_HIEULUC')).toUpperCase();
    },
    _nguoiDungHtml: function (row) {
        return PQ.nguoiDungHtml(row, 'NGUOIDUNG_ID', 'uyquyencanhan');
    },
    _chucNangHtml: function (strId) {
        return PQ.chucNangHtml(this.mapChucNang, strId);
    },
    // đến-ngày đã qua so với hôm nay
    _hetHan: function (row) {
        return PQ.hetHan(PQ.g(row, 'DENNGAY'));
    },
    _khoangNgayHtml: function (row) {
        return PQ.khoangNgayHtml(PQ.g(row, 'TUNGAY'), PQ.g(row, 'DENNGAY'));
    },
    _tenLoai: function (strMa) {
        return (PQ.has(this.mapLoai, strMa) && this.mapLoai[strMa]) ? this.mapLoai[strMa] : strMa;
    },
    _tenChucNang: function (strId) {
        return PQ.has(this.mapChucNang, strId) ? this.mapChucNang[strId].TEN : strId;
    },
    // Nhãn người dùng thuần chữ từ 1 dòng (tên/tài khoản nếu response có, không thì ID)
    _nhanNguoiDung: function (row) {
        var o = PQ.nguoiDungCuaDong(row, 'NGUOIDUNG_ID');
        return PQ.nhanNguoiDung(o.TEN, o.TK, o.ID);
    },

    /*------------------------------------------
    --[1] Danh sách (LayDS)
    -------------------------------------------*/
    getList_UyQuyen: function () {
        var me = this;
        var strTuKhoa = $.trim(edu.util.getValById('txtSearch_UyQuyen'));
        var strTrangThai = edu.util.getValById('dropSearch_UQ_TrangThai');
        PQ.call(me.API.LAYDS, {
            'strtukhoa': strTuKhoa,
            // Cột số của Oracle: luôn gửi 0/1, không gửi rỗng ("tất cả" xem CO_HIEULUC_TAT_CA ở trên)
            'dchi_conhieuluc': strTrangThai === 'CONHAN' ? 1 : me.CO_HIEULUC_TAT_CA
        }, function (data) {
            if (!data.Success) {
                edu.system.alert(data.Message, "w");
                return;
            }
            me.dtAll = data.Data || [];
            me.strTuKhoa = strTuKhoa;
            me.strTrangThai = strTrangThai;
            if (me.dtAll.length > 0 && PQ.g(me.dtAll[0], 'ID') === '' && window.console) {
                console.warn('[uyquyencanhan] Response LayDS không có cột ID — các cột nhận được:', Object.keys(me.dtAll[0]));
            }
            if (!strTuKhoa && !strTrangThai) me.iTong = me.dtAll.length;
            me.render_UyQuyen();
        }, function (er) {
            edu.system.alert(PQ.msgLoi(er), "w");
        });
    },
    // Lọc theo ô "Hiệu lực" và (nếu chọn "Hết hạn") theo ngày — phía trình duyệt — rồi vẽ bảng + nhãn đếm
    render_UyQuyen: function () {
        var me = this;
        var strHl = edu.util.getValById('dropSearch_UQ_HieuLuc');
        var dt = me.dtAll;
        if (strHl !== '' || me.strTrangThai === 'HETHAN') {
            dt = $.grep(me.dtAll, function (r) {
                return (strHl === '' || me._hieuLuc(r) === strHl)
                    && (me.strTrangThai !== 'HETHAN' || me._hetHan(r));
            });
        }
        var bLoc = !!me.strTuKhoa || !!me.strTrangThai || strHl !== '';
        $("#lblCount_UyQuyen").text((bLoc && me.iTong !== undefined)
            ? dt.length + ' / ' + me.iTong + ' bản ghi'
            : dt.length + ' bản ghi');
        me.genTable_UyQuyen(dt);
    },
    genTable_UyQuyen: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblUyQuyenK3",
            aaData: data,
            // Cột 0 là STT do hệ thống tự thêm: 0 Stt | 1 Sửa | 2 Người dùng | 3 Chức năng | 4 Phạm vi | 5 Hiệu lực | 6 Khoảng ngày | 7 Xóa
            colPos: {
                center: [0, 1, 5, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btnEdit" data-id="' + PQ.esc(PQ.g(aData, 'ID')) + '" title="Sửa"><i class="fa fa-edit color-active"></i></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._nguoiDungHtml(aData);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me._chucNangHtml(PQ.g(aData, 'CHUCNANG_ID'));
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + PQ.esc(me._tenLoai(PQ.g(aData, 'LOAIDOITUONG_MA'))) + '</span> <span class="pq-sub">/</span> <span class="pq-mono">' + PQ.esc(PQ.g(aData, 'DOITUONG_ID')) + '</span>';
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
                        return me._khoangNgayHtml(aData);
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
        me.pickerND.reset();
        PQ.setDrop("dropUQ_ChucNang", "");
        PQ.setDrop("dropUQ_LoaiDoiTuong", "");
        edu.util.viewValById("txtUQ_DoiTuong", "");
        me.pickDT.dong();
        PQ.setDrop("dropUQ_HieuLuc", "");
        edu.util.viewValById("txtUQ_TuNgay", "");
        edu.util.viewValById("txtUQ_DenNgay", "");
        $("#titleUyQuyen").text("");
    },
    popup_Them: function () {
        var me = this;
        me.resetForm();
        $("#titleAction_UyQuyen").text("Thêm");
        $("#myModalUyQuyen").modal("show");
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
                me.openForm_Sua(d, rowCache);
            } else {
                if (window.console) console.warn('[uyquyencanhan] LayTT không trả dữ liệu cho strid "' + strId + '" — dùng dòng trong danh sách.', data);
                me.openForm_Sua(rowCache, rowCache);
            }
        }, function (er) {
            if (window.console) console.warn('[uyquyencanhan] LayTT lỗi — dùng dòng trong danh sách.', er);
            me.openForm_Sua(rowCache, rowCache);
        });
    },
    // row: dữ liệu chi tiết; rowCache: dòng trong danh sách (dự phòng lấy tên người dùng nếu chi tiết không có)
    openForm_Sua: function (row, rowCache) {
        var me = this;
        if (!row) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"), "w");
            return;
        }
        me.resetForm();
        var strId = PQ.g(row, 'ID');
        var strCn = PQ.g(row, 'CHUCNANG_ID');
        var strNd = PQ.g(row, 'NGUOIDUNG_ID');
        var strNhanNd = me._nhanNguoiDung(row);
        if (strNhanNd === strNd && rowCache) strNhanNd = me._nhanNguoiDung(rowCache);   // chi tiết thiếu tên → thử dòng danh sách
        me.strId_Sua = strId;
        me.pickerND.datNguoi(strNd, strNhanNd);
        PQ.setDrop("dropUQ_ChucNang", strCn);
        PQ.setDrop("dropUQ_LoaiDoiTuong", PQ.g(row, 'LOAIDOITUONG_MA'));
        edu.util.viewValById("txtUQ_DoiTuong", PQ.g(row, 'DOITUONG_ID'));
        PQ.setDrop("dropUQ_HieuLuc", me._hieuLuc(row));
        edu.util.viewValById("txtUQ_TuNgay", PQ.dmy(PQ.g(row, 'TUNGAY')));
        edu.util.viewValById("txtUQ_DenNgay", PQ.dmy(PQ.g(row, 'DENNGAY')));
        $("#titleAction_UyQuyen").text("Sửa");
        $("#titleUyQuyen").text(strNhanNd + " × " + me._tenChucNang(strCn));
        me.pickDT.dongBo();   // loại + mã đã điền bằng code: thu gọn bảng, chỉ hiện "Đã chọn: ..."
        $("#myModalUyQuyen").modal("show");
    },

    /*------------------------------------------
    --[3] Lưu (Them / Sua)
    -------------------------------------------*/
    save_UyQuyen: function () {
        var me = this;
        var bSua = !!me.strId_Sua;
        var strNd = me.pickerND.layId();
        var strCn = edu.util.getValById("dropUQ_ChucNang");
        var strLoai = edu.util.getValById("dropUQ_LoaiDoiTuong");
        var strDoiTuong = $.trim(edu.util.getValById("txtUQ_DoiTuong"));
        var strHl = edu.util.getValById("dropUQ_HieuLuc");
        var strTu = $.trim(edu.util.getValById("txtUQ_TuNgay"));
        var strDen = $.trim(edu.util.getValById("txtUQ_DenNgay"));

        var strThieu = [];
        if (!strNd) strThieu.push("Người dùng");
        if (!strCn) strThieu.push("Chức năng");
        if (!strLoai) strThieu.push("Loại đối tượng");
        if (!strDoiTuong) strThieu.push("Mã đối tượng");
        if (!strHl) strThieu.push("Hiệu lực");
        if (strThieu.length > 0) {
            edu.system.alertOnModal({ type: "w", content: "Vui lòng nhập/chọn: " + strThieu.join(", ") + "." });
            return;
        }
        if (strTu && !edu.util.dateValid(strTu)) {
            edu.system.alertOnModal({ type: "w", content: "Ngày bắt đầu hiệu lực không hợp lệ (định dạng dd/mm/yyyy)." });
            return;
        }
        if (strDen && !edu.util.dateValid(strDen)) {
            edu.system.alertOnModal({ type: "w", content: "Ngày kết thúc hiệu lực không hợp lệ (định dạng dd/mm/yyyy)." });
            return;
        }
        if (strTu && strDen && PQ.parseNgay(strTu).getTime() > PQ.parseNgay(strDen).getTime()) {
            edu.system.alertOnModal({ type: "w", content: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc." });
            return;
        }

        var params = {
            'strnguoidung_id': strNd,
            'strchucnang_id': strCn,
            'strloaidoituong_ma': strLoai,
            'strdoituong_id': strDoiTuong,
            'strloai_hieuluc': strHl,
            'strtungay': strTu,
            'strdenngay': strDen
        };
        if (bSua) params.strid = me.strId_Sua;   // Thêm: BE tự sinh strid nên không gửi

        PQ.call(bSua ? me.API.SUA : me.API.THEM, params, function (data) {
            if (PQ.ghiOk(data, params)) {   // BE có thể trả Success=false + Message = khóa/ID vừa ghi dù đã ghi thành công
                PQ.alertSauKhiDongModal("myModalUyQuyen", bSua ? "Cập nhật thành công!" : "Thêm mới thành công!");
                me.getList_UyQuyen();
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
            ? "người dùng <b>" + PQ.esc(me._nhanNguoiDung(row)) + "</b> trên chức năng <b>" + PQ.esc(me._tenChucNang(PQ.g(row, 'CHUCNANG_ID'))) + "</b>"
            : "<b>" + PQ.esc(strId) + "</b>";
        edu.system.confirm("Bạn có chắc chắn muốn xóa ủy quyền của " + strMoTa + " không?");
        $("#btnYes").off("click.pqxoa").on("click.pqxoa", function () {
            me.delete_UyQuyen(strId);
        });
    },
    delete_UyQuyen: function (strId) {
        var me = this;
        PQ.call(me.API.XOA, { 'strid': strId }, function (data) {
            if (PQ.ghiOk(data, [strId])) {
                edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                me.getList_UyQuyen();
            } else {
                edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
            }
        }, function (er) {
            edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
        });
    }
};
