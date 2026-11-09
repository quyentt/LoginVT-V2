/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/04/2019
--Input: 
--Output:
--API URL: NoiDungChuongTrinh/HocPhan
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HocPhan() { };
HocPhan.prototype = {
    strHocPhan_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtHocPhan: '',//danh sach hoc phan

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HocPhan();
        me.getList_MonHoc();
        me.getList_CoCauToChuc();
        //me.getList_HocPhan_PhanBo();

        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_HocPhan();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strHocPhan_Id)) {
                me.update_HocPhan();
            }
            else {
                me.save_HocPhan();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strHocPhan_Id)) {
                me.update_HocPhan();
            }
            else {
                me.save_HocPhan();
            }
            me.rewrite();
        });

        $("#tblHocPhan").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHocPhan_Id = strId;
                me.getDetail_HocPhan(strId, constant.setting.ACTION.EDIT);
                me.getList_HocPhan_PhanBo();
                edu.util.setOne_BgRow(strId, "tblHocPhan");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }

            //var strId = this.id;
            //me.toggle_form();
            //me.strHocPhan_Id = strId;
            //me.getDetail_HocPhan(strId);
            //return false;
        });
        $("#tblHocPhan").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HocPhan(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSearch").click(function () {
            me.getList_HocPhan();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhan();
            }
        });
        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropSearch_MonHoc").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropSearch_ThuocTinhHocPhan").on("select2:select", function () {
            me.getList_HocPhan();
        });

        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_MonHoc();
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HocPhan(arrChecked_Id.toString());
            });
        });
        $("#tblHocPhan").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblHocPhan", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAIPHANBO", "dropHocPhan_PhanBo");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.BOMON", "dropBoMon");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.TTHP", "dropThuocTinhHocPhan, dropSearch_ThuocTinhHocPhan");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAIPHANBO", "", "", me.cbGetList_HocPhan_PhanBo);
        edu.system.loadToCombo_DanhMucDuLieu("DAOTAO.LOAIHOCPHAN", "dropLoaiHocPhan");

        /*------------------------------------------
        --Discription: Zone học phần - bài học
        --Discription:
        -------------------------------------------*/
        $("#btnAdd_HocPhan_PhanBo").click(function () {
            me.save_HocPhan_PhanBo();
        });
        $("#tblInput_HocPhan_PhanBo").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HocPhan_PhanBo(id);
            });
        });
        $("#tblHocPhan_PhanBo").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHocPhan_PhanBo tr[id='" + strRowId + "']").remove();
        });
        $("#btnThemDong_PhanBo").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_PhanBo(id, "");
        });
        $("#zone_input_HocPhan").delegate(".deletePhanBo", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HocPhan_PhanBo(strId);
            });
        });

        edu.system.getList_MauImport("zonebtnHP");

        // Nút "Xuất Excel" (chuẩn chung edu.exporter): thiếu exporter thì bỏ qua, các chức năng khác của trang vẫn chạy
        me._attachExport();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HocPhan");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_HocPhan");
        $("#tblHocPhan_PhanBo tbody").html("");
        for (var i = 0; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.HocPhan.genHTML_PhanBo(id, "");
        }
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strHocPhan_Id = "";
        //edu.util.viewValById("dropBoMon", edu.util.getValById('dropSearch_BoMon'));
        edu.util.viewValById("dropMonHoc", "");
        edu.util.viewValById("dropThuocTinhHocPhan", "");
        edu.util.viewValById("dropLoaiHocPhan", "");
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtTenTA", "");
        edu.util.viewValById("txtHocTrinhTinhPhi", "");
        edu.util.viewValById("txtHocTrinh", "");
        edu.util.viewValById("txtKyHieu", "");
        edu.util.viewValById("dropLaMonTinhDiem", 1);
    },

    save_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eCS4iESkgLwPP',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strLoaiHocPhan_Id': edu.util.getValById('dropLoaiHocPhan'),
            'strId': '',
            'strTen': edu.util.getValById("txtTen"),
            'strMa': edu.util.getValById("txtMa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropMonHoc"),
            'dHocTrinh': edu.util.getValById("txtHocTrinh") ? edu.util.getValById("txtHocTrinh"): -1,
            'strThuocBoMon_Id': edu.util.getValById("dropBoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropThuocTinhHocPhan"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dLaMonTinhDiem': edu.util.getValById("dropLaMonTinhDiem") ? edu.util.getValById("dropLaMonTinhDiem") : -1,
            'strTenTA': edu.util.getValById('txtTenTA'),
            'dHocTrinhTinhPhi': edu.util.getValById('txtHocTrinhTinhPhi') ? edu.util.getValById("txtHocTrinhTinhPhi") : -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHocPhan_Id = data.Id;
                    if (me.strHocPhan_Id == "") {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                    }
                    $("#tblHocPhan_PhanBo tbody tr").each(function () {
                        var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                        me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                    });

                    me.getList_HocPhan();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            //success: function (data) {
                //if (data.Success) {
                //    var strHocPhan_Id = data.Id;
                //    if (me.strHocPhan_Id == "") {
                //        edu.system.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?');
                //        $("#btnYes").click(function (e) {
                //            me.rewrite();
                //            $('#myModalAlert').modal('hide');                            
                //        });
                //        $("#tblHocPhan_PhanBo tbody tr").each(function () {
                //            var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                //            me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                //        });
                //        me.getList_HocPhan();
                //    }                    
                //}
                //else {
                //    edu.system.alert(obj_save.action + ": " + data.Message);
                //}
            //},
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    update_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4JLiIRKSAv',
            'func': 'pkg_kehoach_thongtin.Sua_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strLoaiHocPhan_Id': edu.util.getValById('dropLoaiHocPhan'),
            'strId': me.strHocPhan_Id,
            'strTen': edu.util.getValById("txtTen"),
            'strMa': edu.util.getValById("txtMa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropMonHoc"),
            'dHocTrinh': edu.util.getValById("txtHocTrinh") ? edu.util.getValById("txtHocTrinh") : -1,
            'strThuocBoMon_Id': edu.util.getValById("dropBoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropThuocTinhHocPhan"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dLaMonTinhDiem': edu.util.getValById("dropLaMonTinhDiem") ? edu.util.getValById("dropLaMonTinhDiem") : -1,
            'strTenTA': edu.util.getValById('txtTenTA'),
            'dHocTrinhTinhPhi': edu.util.getValById('txtHocTrinhTinhPhi') ? edu.util.getValById("txtHocTrinhTinhPhi") : -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    strHocPhan_Id = me.strHocPhan_Id;
                    me.getList_HocPhan();
                    $("#tblHocPhan_PhanBo tbody tr").each(function () {
                        var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                        me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                    });
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Tham số gọi danh sách học phần theo các ô tìm kiếm đang chọn trên màn hình.
    -- Dùng chung cho nạp từng trang (getList_HocPhan) và xuất Excel toàn bộ (_fetchAll_HocPhan): 2 nơi luôn cùng điều kiện.
    -------------------------------------------*/
    req_HocPhan: function (iPageIndex, iPageSize) {
        return {
            'action': 'KHCT_HocPhan/LayDanhSach',
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropSearch_MonHoc"),
            'strThuocBoMon_Id': edu.util.getValById("dropSearch_BoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropSearch_ThuocTinhHocPhan"),
            'strNguoiThucHien_Id': "",
            'pageIndex': iPageIndex,
            'pageSize': iPageSize
        };
    },
    getList_HocPhan: function () {
        var me = main_doc.HocPhan;

        //--Edit
        var obj_list = me.req_HocPhan(edu.system.pageIndex_default, edu.system.pageSize_default);


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Nút "Xuất Excel" chuẩn chung (Corei/exportexcel.js: edu.exporter.attachTable + fetchAll).
    -- Xuất TOÀN BỘ học phần theo điều kiện đang chọn trên màn hình (không chỉ trang đang xem), kèm TÊN HỌC PHẦN TIẾNG ANH
    -- (bảng trên màn hình không có cột này) để kiểm tra chính tả / học phần chưa có tên tiếng Anh.
    -- Hộp thoại hỏi trước khi xuất báo số học phần chưa có tên tiếng Anh và có ô "lọc thêm khi xuất" để chỉ xuất đúng các học phần đó.
    -------------------------------------------*/
    _TT_CO_TA: "Đã có tên tiếng Anh",
    _TT_CHUA_TA: "Chưa có tên tiếng Anh",
    _TT_LOI_TA: "Không nạp được",
    _exporterOk: function () {
        var arrV = String((window.edu && edu.exporter && edu.exporter.version) || "0").split(".");
        return parseInt(arrV[0], 10) > 1 || (parseInt(arrV[0], 10) == 1 && parseInt(arrV[1], 10) >= 8);
    },
    _attachExport: function () {
        var me = this;
        if (!window.edu || !edu.exporter || typeof edu.exporter.attachTable !== "function" || !me._exporterOk()) {
            console.log("[hocphan] Chưa gắn nút Xuất Excel: cần Corei/exportexcel.js từ phiên bản 1.8.0 (và indexi.aspx trỏ đúng phiên bản).");
            return;
        }
        edu.exporter.attachTable({
            table: "tblHocPhan",
            after: "#btnDelete",
            fileName: "DanhSachHocPhan",
            title: "DANH SÁCH HỌC PHẦN",
            filters: [[
                { label: "Bộ môn", id: "dropSearch_BoMon" },
                { label: "Môn học", id: "dropSearch_MonHoc" },
                { label: "Thuộc tính học phần", id: "dropSearch_ThuocTinhHocPhan" }
            ]],
            subTitles: function () {
                var strTuKhoa = $.trim(edu.util.getValById("txtSearch_TuKhoa"));
                return strTuKhoa ? ["Từ khóa: " + strTuKhoa] : [];
            },
            fetchAll: function () { return me._fetchAll_HocPhan(); },
            columns: me._exportColumns(),
            notice: function (rows) { return me._exportNotice(rows); },
            // "Lọc thêm khi xuất": không tích gì = tất cả. Điều kiện trên màn hình đã được máy chủ lọc sẵn nên không đặt mặc định.
            extraFilters: function () {
                return [
                    { label: "Tên tiếng Anh", get: function (r) { return me._trangThaiTenTA(r); } },
                    { label: "Bộ môn", field: "THUOCBOMON_TEN" }
                ];
            }
        });
    },
    // Cột file Excel: tên tiếng Việt và tiếng Anh đứng cạnh nhau để đối chiếu; cột "Sử dụng trong CTĐT" rất dài nên để cuối cùng
    _exportColumns: function () {
        return [
            { header: "Mã học phần", field: "MA" },
            { header: "Tên học phần", field: "TEN", width: 42 },
            { header: "Tên học phần tiếng Anh", width: 42, render: function (r) { return r.__tenTaLoi ? "(không nạp được)" : r.TENTA; } },
            { header: "Bộ môn", field: "THUOCBOMON_TEN" },
            { header: "Môn học", field: "DAOTAO_MONHOC_TEN" },
            { header: "Thuộc tính học phần", field: "THUOCTINHHOCPHAN_TEN" },
            { header: "Số tín chỉ", field: "HOCTRINH", type: "number", align: "center" },
            { header: "Sử dụng trong CTĐT", field: "HOCPHANSUDUNGTRONGCTDT", html: true, width: 70 }
        ];
    },
    _trangThaiTenTA: function (r) {
        var me = this;
        if (r.__tenTaLoi) return me._TT_LOI_TA;
        return String(r.TENTA === null || r.TENTA === undefined ? "" : r.TENTA).replace(/\s+/g, "") === "" ? me._TT_CHUA_TA : me._TT_CO_TA;
    },
    // Khung lưu ý (màu cam, không chặn xuất) trong hộp thoại hỏi trước khi xuất
    _exportNotice: function (rows) {
        var me = this, iThieu = 0, iLoi = 0, arr = [];
        rows.forEach(function (r) {
            var s = me._trangThaiTenTA(r);
            if (s === me._TT_CHUA_TA) iThieu++;
            else if (s === me._TT_LOI_TA) iLoi++;
        });
        if (iThieu > 0) arr.push("Có " + iThieu + "/" + rows.length + " học phần chưa có tên tiếng Anh. Chọn \"" + me._TT_CHUA_TA + "\" ở ô lọc \"Tên tiếng Anh\" bên dưới để chỉ xuất các học phần này.");
        if (iLoi > 0) arr.push("Không nạp được tên tiếng Anh của " + iLoi + " học phần (file ghi \"(không nạp được)\") — thử xuất lại.");
        return arr.join("\n");
    },
    // Nạp lại TOÀN BỘ học phần bằng đúng API + điều kiện đang chọn (Promise<mảng>); bảng trên màn hình chỉ giữ 1 trang
    _fetchAll_HocPhan: function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            var objReq = me.req_HocPhan(1, 1000000);
            edu.system.makeRequest({
                success: function (data) {
                    if (!data.Success) { reject(new Error(data.Message)); return; }
                    resolve(data.Data || []);
                },
                error: function (er) { reject(new Error(JSON.stringify(er))); },
                type: "GET",
                action: objReq.action,
                contentType: true,
                data: objReq,
                fakedb: [
                ]
            }, false, false, false, null);
        }).then(function (rows) { return me._bosungTenTA(rows); });
    },
    // API danh sách có thể KHÔNG trả TENTA (tên tiếng Anh chỉ thấy ở API chi tiết dùng cho form Sửa). Khi đó nạp thêm từng học phần
    // bằng hàm chi tiết chuẩn của module (KHCT_HocPhan/LayChiTiet), 8 yêu cầu cùng lúc, có thẻ báo tiến độ. Học phần nào nạp lỗi thì
    // đánh dấu (__tenTaLoi) để file ghi rõ "(không nạp được)" — KHÔNG để trống, vì trống nghĩa là "chưa có tên tiếng Anh" (sẽ gây hiểu nhầm).
    _bosungTenTA: function (rows) {
        var me = this;
        if (!rows.length || rows.some(function (r) { return r.TENTA !== undefined; })) return Promise.resolve(rows);
        var iTong = rows.length, iXong = 0, iDong = 0, iNext = 0, MAX = 8;
        var ack = (edu.process && typeof edu.process.ack === "function") ? edu.process.ack("Xuất Excel", "Đang nạp tên tiếng Anh của " + iTong + " học phần…") : null;
        console.log("[hocphan] API danh sách không trả TENTA → nạp từng học phần bằng KHCT_HocPhan/LayChiTiet (" + iTong + " yêu cầu).");
        return new Promise(function (resolve) {
            function chayTiep() {
                while (iDong < MAX && iNext < iTong) {
                    (function (row) {
                        iDong++;
                        me._getTenTA(row.ID).then(function (strTA) { row.TENTA = strTA; }, function () { row.TENTA = ""; row.__tenTaLoi = 1; })
                            .then(function () {
                                iDong--; iXong++;
                                if (ack && (iXong % 10 === 0 || iXong === iTong)) ack.update("Đang nạp tên tiếng Anh… " + iXong + "/" + iTong, iXong * 100 / iTong);
                                if (iXong >= iTong) { if (ack) ack.close(); resolve(rows); }
                                else chayTiep();
                            });
                    })(rows[iNext++]);
                }
            }
            chayTiep();
        });
    },
    // Tên tiếng Anh của 1 học phần (Promise<string>): hàm chi tiết chuẩn KHCT_HocPhan/LayChiTiet, cùng hàm form Sửa đang dùng
    _getTenTA: function (strId) {
        var objReq = { action: 'KHCT_HocPhan/LayChiTiet', type: 'GET', data: { 'strId': strId } };
        function layTA(data) {
            var d = data && data.Data;
            if (!data || !data.Success || !d || !d[0]) throw new Error((data && data.Message) || "Không có dữ liệu chi tiết");
            return d[0].TENTA === null || d[0].TENTA === undefined ? "" : d[0].TENTA;
        }
        // callApi (edu.process): đã bắt lỗi mạng và tự ẩn lớp phủ "Đang tải" mà mỗi makeRequest bật lên
        if (edu.process && typeof edu.process.callApi === "function") {
            return edu.process.callApi(objReq).then(function (r) { return layTA(r.data); });
        }
        return new Promise(function (resolve, reject) {
            edu.system.makeRequest({
                success: function (data) { try { resolve(layTA(data)); } catch (ex) { reject(ex); } },
                error: function (er) { reject(new Error(JSON.stringify(er))); },
                type: objReq.type, action: objReq.action, contentType: true, data: objReq.data, fakedb: []
            }, false, false, false, null);
        });
    },
    getDetail_HocPhan: function (strId) {
        var me = main_doc.HocPhan;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_HocPhan/LayChiTiet',

            'strId': strId
        };


        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HocPhan(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HocPhan: function (Ids) {
        var me = main_doc.HocPhan;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan/Xoa',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocPhan();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HocPhan: function (data, iPager) {
        var me = main_doc.HocPhan;
        $("#lblHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhan.getList_HocPhan()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 6, 7, 8],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên học phần: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Số tín chỉ: ' + edu.util.returnEmpty(aData.HOCTRINH) + "</span><br />";
                //        html += '<span>' + 'Thuộc tính học phần: ' + edu.util.returnEmpty(aData.THUOCTINHHOCPHAN_TEN) + "</span><br />";
                //        html += '<span>' + 'Thuộc bộ môn: ' + edu.util.returnEmpty(aData.THUOCBOMON_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                },
                {
                    "mDataProp": "HOCPHANSUDUNGTRONGCTDT"
                },
                {
                    "mDataProp": "DAOTAO_MONHOC_TEN"
                },
                {
                    "mDataProp": "THUOCTINHHOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_HocPhan: function (data) {
        var me = main_doc.HocPhan;
        //call popup --Edit
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("dropMonHoc", data.DAOTAO_MONHOC_ID);
        edu.util.viewValById("txtHocTrinh", data.HOCTRINH);
        edu.util.viewValById("dropBoMon", data.THUOCBOMON_ID);
        edu.util.viewValById("dropThuocTinhHocPhan", data.MA);
        edu.util.viewValById("txtKyHieu", data.KYHIEU);
        edu.util.viewValById("dropLaMonTinhDiem", data.LAMONTINHDIEM);
        edu.util.viewValById("dropThuocTinhHocPhan", data.THUOCTINHHOCPHAN_ID);
        edu.util.viewValById("txtTenTA", data.TENTA);
        edu.util.viewValById("txtHocTrinhTinhPhi", data.HOCTRINHTINHPHI);
        edu.util.viewValById("dropLoaiHocPhan", data.LOAIHOCPHAN_ID);
        me.getList_HocPhan_PhanBo();
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Mon hoc
    --Author: duyentt
	-------------------------------------------*/
    getList_MonHoc: function () {
        var me = main_doc.HocPhan;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_MonHoc(dtResult);
                }
                else {
                    edu.system.alert("KHCT_MonHoc/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_MonHoc/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_MonHoc/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strThuocBoMon_Id': edu.util.getValById("dropSearch_BoMon"),
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_MonHoc: function (data) {
        var me = main_doc.HocPhan;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropMonHoc", "dropSearch_MonHoc"],
            title: "Chọn môn học"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> CCTC
    --Author: duyentt
	-------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.HocPhan;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropBoMon", "dropSearch_BoMon"],
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HocPhan_baiHoc
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan_PhanBo: function (strPhanBo_Id, strHocPhan_Id) {
        var me = this;
        //--Edit
        var strId = strPhanBo_Id;
        var strLoaiPhanBo_Id = edu.util.getValById('dropHocPhan_PhanBo' + strPhanBo_Id);
        var dSoTiet = edu.util.getValById('txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id);
        if (!edu.util.checkValue(strPhanBo_Id)) {
            return;
        }
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'KHCT_HocPhan_PhanBo/ThemMoi',


            'strId': strId,
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strLoaiPhanBo_Id': strLoaiPhanBo_Id,
            'dSoTiet': dSoTiet,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'KHCT_HocPhan_PhanBo/CapNhat';
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Success) {
                        if (strId == "") {
                            strId = data.Id;
                        }
                    }
                    else {
                        edu.system.alert(obj_save + ": " + data.Message);
                    }
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_PhanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_PhanBo/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strLoaiPhanBo_Id': '',
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhan_PhanBo(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_HocPhan_PhanBo: function (data) {
        var me = this;
        $("#tblHocPhan_PhanBo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strPhanBo_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strPhanBo_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strPhanBo_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHocPhan_PhanBo' + strPhanBo_Id + '" class="select-opt"><option value=""> --- Chọn loại phân bổ--</option ></select ></td>';
            row += '<td><input type="text" id="txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id + '" value="' + edu.util.returnEmpty(data[i].SOTIET) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deletePhanBo" id="' + strPhanBo_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHocPhan_PhanBo tbody").append(row);
            me.genComBo_PhanBo("dropHocPhan_PhanBo" + strPhanBo_Id, data[i].LOAIPHANBO_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_PhanBo(id, "");
        }
        edu.system.pickerdate("input-datepicker_GiaHan");
    },
    genHTML_PhanBo: function (strPhanBo_Id) {
        var me = this;
        var iViTri = document.getElementById("tblHocPhan_PhanBo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strPhanBo_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strPhanBo_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHocPhan_PhanBo' + strPhanBo_Id + '" class="select-opt"><option value=""> --- Chọn loại phân bổ--</option ></select ></td>';
        row += '<td><input type="text" id="txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id + '"  class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strPhanBo_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblHocPhan_PhanBo tbody").append(row);
        me.genComBo_PhanBo("dropHocPhan_PhanBo" + strPhanBo_Id, "");
    },
    cbGetList_HocPhan_PhanBo: function (data) {
        main_doc.HocPhan.dtPhanBo = data;
    },
    genComBo_PhanBo: function (strPhanBo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtPhanBo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strPhanBo_Id],
            type: "",
            title: "Chọn loại phân bổ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strPhanBo_Id).select2();
    },
    delete_HocPhan_PhanBo: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan_PhanBo/Xoa',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocPhan_PhanBo();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //genTable_HocPhan_PhanBo: function (data) {
    //    var me = this;
    //    $("#tblInput_HocPhan_PhanBo tbody").html("");
    //    var row = "";
    //    for (var i = 0; i < data.length; i++) {
    //        row += '<tr>';
    //        row += '<td>';
    //        row += 'Loại phân bổ<span class="title-colon">:</span>';
    //        row += '</td>';
    //        row += '<td>';
    //        row += data[i].LOAIPHANBO_TEN;
    //        row += '</td>';
    //        row += '<td>';
    //        row += 'Số tiết<span class="title-colon">:</span>';
    //        row += '</td>';
    //        row += '<td>';
    //        row += data[i].SOTIET;
    //        row += '</td>';
    //        row += '<td class="td-fixed td-center">';
    //        row += '<a id="' + data[i].ID + '" class="btnDeletePoiter poiter pull-right">';
    //        row += '<i class="fa fa-trash"></i>';
    //        row += '</a>';
    //        row += '</td>';
    //        row += '</tr>';
    //    }
    //    $("#tblInput_HocPhan_PhanBo tbody").append(row);
    //},
}