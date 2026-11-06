/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 23/08/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function TinhHocPhi() { };
TinhHocPhi.prototype = {
    arrHangDoi_Id: [],
    countQueue: 0,
    iThread_Queue: 10,
    objHangDoi: {},

    init: function () {
        var me = this;
        me._attachExport();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ThoiGianDaoTao();
        //me.getList_LopQuanLy();
        //me.getList_LoaiKhoan();
        me.getList_TrangThaiSV();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.NVAP", "dropNghiepVu_TP", "Chọn nghiệp vụ áp dụng");

        $('#dropKhoaDaoTao_TP').on('select2:select', function () {
            var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_TP");
            var strChuongTrinhDaoTao_Id = edu.util.getValById("dropChuongTrinhDaoTao_TP");
            me.getList_LopQuanLy(strKhoaDaoTao_Id, strChuongTrinhDaoTao_Id);
        });
        $('#dropHeDaoTao_TP').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_TP");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_LopQuanLy("", "");
        });
        $('#dropLopQuanLy_TP').on('select2:select select2:unselect', function () {
            if ($('#qt_sinhvien').hasClass('in')) {
                me.getList_SinhVien();
            }
        });
        $('#qt_sinhvien').on('show.bs.collapse', function () {
            me.getList_SinhVien();
        });
        $('#dropThoiGianDaoTao_TP').on('select2:select', function () {
            me.getList_KeHoachDangKy();
        });
        $('#dropNghiepVu_TP').on('select2:select', function () {
            me.getList_LoaiKhoan();
        });
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        //var obj_Queue = {
        //    strLoaiNhiemVu: "TINHPHITUDONG"
        //}
        //edu.system.getList_HangDoi(obj_Queue, "", "", me.genHTML_HangDoi);
        me.objHangDoi = {
            strLoaiNhiemVu: "TINHPHITUDONG",
            strName: "TinhHocPhi",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        // Tính học phí: đưa 1 yêu cầu vào hàng đợi qua form tiến trình chung (Bước 1 hiện phạm vi áp dụng thay cho hộp xác nhận)
        $("#btnTinhHocPhi").click(function (e) {
            e.stopImmediatePropagation();
            var nChon = edu.util.getArrCheckedIds("tblSinhVien", "checkX").length, notes = [];
            if (!edu.util.checkValue(edu.util.getValCombo("dropThoiGianDaoTao_TP"))) notes.push("Chưa chọn thời gian đào tạo.");
            if (!edu.util.checkValue(edu.util.getValById("dropKhoanThu_TP"))) notes.push("Chưa chọn khoản thu.");
            me._runJob({
                title: "Tính học phí", what: "Tính học phí" + (nChon > 0 ? " cho " + nChon + " sinh viên đã chọn" : " theo phạm vi đang chọn"),
                fileName: "KetQuaTinhHocPhi", notes: notes, subTitles: me._trangThaiLines(),
                okMessage: "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!",
                request: function () { return me.req_TinhHocPhi(); },
                onSuccess: function () { edu.system.createHangDoi(me.objHangDoi); }
            });
        });
        //$("#tblTaskBar_TinhHocPhi").delegate('.btnStart', 'click', function () {
        //    var strId = this.id;
        //    var strHangDoi_Id = strId.replace(/start_hangdoi/g, "");
        //    if (edu.util.checkValue(strHangDoi_Id)) {
        //        me.arrHangDoi_Id.push(strHangDoi_Id);
        //        me.proSeqMain_HangDoi(strHangDoi_Id);
        //        //me.enableButton_Stop(strHangDoi_Id);
        //    }
        //});
        //$("#tblTaskBar_TinhHocPhi").delegate('.btnCancle', 'click', function () {
        //    var strId = this.id;
        //    strHangDoi_Id = strId.replace(/cancle_hangdoi/g, "");
        //    if (edu.util.checkValue(strHangDoi_Id)) {
        //        //huy
        //        console.log("Huy");
        //    }
        //    //me.enableButton_Start(strHangDoi_Id);
        //});
        /*------------------------------------------
        --Author: nnthuong
        --Discription: main action  
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_TinChi();
        });
        $("#btnRefreshNienChe").click(function () {
            me.getList_NienChe();
        });
        $("#btnDeleteKetQua").click(function () {
            var nChon = edu.util.getArrCheckedIds("tblSinhVien", "checkX").length;
            me._runJob({
                title: "Xóa kết quả đã tính phí", what: "Xóa kết quả đã tính phí" + (nChon > 0 ? " của " + nChon + " sinh viên đã chọn" : " theo phạm vi đang chọn"),
                fileName: "KetQuaXoaKetQuaDaTinhPhi", notes: ["Thao tác xóa dữ liệu kết quả đã tính phí trong phạm vi đang chọn."],
                request: function () { return me.req_KetQuaDaTinhPhi_Xoa(); },
                refresh: function () { me.getList_TinChi(); me.getList_NienChe(); }
            });
        });
        //$("#tblTaskBar_TinhHocPhi").delegate("#btnXemDanhSach", "click", function () {
        //    me.getList_NienChe();
        //    me.getList_TinChi();
        //});
        $("#btnXemDanhSach").click(function () {
            me.getList_NienChe();
            me.getList_TinChi();
            if ($('#qt_sinhvien').hasClass('in')) {
                me.getList_SinhVien();
            }
        });
        $("#tblTinChi").delegate(".btnChiTiet", "click", function () {
            var selected_id = this.id;
            edu.util.toggle_overide("zone-bus", "zone_input");
            me.getDetail_TinChi(selected_id);
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_main");
        });//Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_THP", function (addKeyValue) {
            addKeyValue("strHeDaoTao", edu.util.getValById("dropHeDaoTao_TP"));
            addKeyValue("strKhoaDaoTao", edu.util.getValById("dropKhoaDaoTao_TP"));
            addKeyValue("strLopQuanLy", edu.util.getValById("dropLopQuanLy_TP"));
            addKeyValue("strThoiGianDaoTao", edu.util.getValById("dropThoiGianDaoTao_TP"));
            addKeyValue("strKhoanThu", edu.util.getValById("dropKhoanThu_TP"));
            addKeyValue("strNghiepVu", edu.util.getValById("dropNghiepVu_TP"));
            addKeyValue("strDangKy_KeHoachDangKy_Id", edu.util.getValById("dropKeHoachDangKy_TP"));
        });
        $(document).delegate(".ckbDSTrangThaiSV_THP_ALL", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            $(".ckbDSTrangThaiSV_THP").each(function () {
                this.checked = checked_status;
            });
        });

        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblSinhVien" });
        });

        $("#btnAdd_KhongTinhPhi").click(function () {
            if (!edu.util.getValById("dropNghiepVu_TP")) {
                edu.system.alert("Bạn hãy chọn nghiệp vụ");
                return;
            }
            if (!edu.util.getValById("dropThoiGianDaoTao_TP")) {
                edu.system.alert("Bạn hãy chọn thời gian");
                return;
            }
            if (!edu.util.getValById("dropKhoanThu_TP")) {
                edu.system.alert("Bạn hãy chọn khoản thu");
                return;
            }
            // mỗi sinh viên chọn 1 bản ghi của form tiến trình, miễn 100% học phí
            if (!edu.process) { me._runJob({}); return; }
            edu.process.pickSinhVien({
                what: "vào danh sách không tính phí", fileName: "KetQuaThemKhongTinhPhi", filters: me._filtersKhongTinhPhi(),
                request: function (strId, bPhamVi, row) {
                    if (!row || !row.QLSV_NGUOIHOC_ID) throw new Error("Không tìm thấy dữ liệu của sinh viên.");
                    return me.req_KhongTinhPhi(row.QLSV_NGUOIHOC_ID, row.DAOTAO_TOCHUCCHUONGTRINH_ID, 100);
                },
                refresh: function () { me.getList_KhongTinhPhi(); }
            });
        });
        $("#btnRefresh_KhongTinhPhi").click(function () {
            me.getList_KhongTinhPhi();
        });
        $("#btnSave_KhongTinhPhi").click(function () {
            // các dòng đã đổi % so với giá trị đang lưu (thuộc tính name của ô nhập)
            var arrThem = [], x = $("#tblKhongTinhPhi .phantram"), map = {}, i;
            (me.dtKhongTinhPhi || []).forEach(function (r) { map[r.ID] = r; });
            for (i = 0; i < x.length; i++) {
                if ($(x[i]).attr("name") != $(x[i]).val()) {
                    var strId = x[i].id.replace(/txtPhanTram_/g, "");
                    arrThem.push({ ID: strId, row: map[strId] || {}, cu: $(x[i]).attr("name"), moi: $(x[i]).val() });
                }
            }
            if (arrThem.length == 0) {
                edu.system.alert("Không có thay đổi lưu");
                return;
            }
            var v = edu.util.returnEmpty;
            me._runJob2({
                title: "Lưu phần trăm không tính phí", unit: "sinh viên", fileName: "KetQuaLuuKhongTinhPhi", items: arrThem,
                columns: [
                    { header: "Mã số", render: function (it) { return it.row.QLSV_NGUOIHOC_MASO; } },
                    { header: "Họ tên", render: function (it) { return v(it.row.QLSV_NGUOIHOC_HODEM) + " " + v(it.row.QLSV_NGUOIHOC_TEN); } },
                    { header: "Phần trăm cũ", render: function (it) { return it.cu; } },
                    { header: "Phần trăm mới", render: function (it) { return it.moi; } }
                ],
                request: function (it) { return me.req_KhongTinhPhi_Sua(it.ID, it.moi); },
                refresh: function () { me.getList_KhongTinhPhi(); }
            }, me._filtersKhongTinhPhi());
        });
        $("#btnDelete_KhongTinhPhi").click(function () {
            var arrSelected = edu.process ? edu.process.selectedRows("tblKhongTinhPhi", me.dtKhongTinhPhi) : [];
            if (edu.process && arrSelected.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            var v = edu.util.returnEmpty;
            me._runJob2({
                title: "Xóa sinh viên khỏi danh sách không tính phí", unit: "sinh viên", fileName: "KetQuaXoaKhongTinhPhi",
                notes: ["Thao tác xóa dữ liệu các sinh viên trong danh sách."], items: arrSelected,
                columns: [
                    { header: "Mã số", render: function (r) { return r.QLSV_NGUOIHOC_MASO; } },
                    { header: "Họ tên", render: function (r) { return v(r.QLSV_NGUOIHOC_HODEM) + " " + v(r.QLSV_NGUOIHOC_TEN); } },
                    { header: "Chương trình", render: function (r) { return r.DAOTAO_CHUONGTRINH_TEN; } },
                    { header: "Phần trăm", render: function (r) { return r.PHANTRAM; } }
                ],
                request: function (it) { return me.req_KhongTinhPhi_Xoa(it.ID); },
                refresh: function () { me.getList_KhongTinhPhi(); }
            }, me._filtersKhongTinhPhi());
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    loadProgressBar: function (obj) {

        //1. nap du lieu
        var objProBar = {
            title: 'Tổng dữ liệu',
            items: obj.items,
            renderPlace: obj.renderPlace,
        }
        edu.system.getProgressBar(objProBar);
        //2. update progressbar
        var objProBar = {
            items: obj.items,
            completed: obj.completed,
            renderPlace: obj.renderPlace,
        };
        edu.system.updateProgressBar(objProBar);
        //3. remove effect
        var $percent = "#percent_" + obj.renderPlace;
        edu.system.removeEffectProgressBar($percent);
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    // Yêu cầu tính học phí đưa vào hàng đợi (1 yêu cầu cho cả phạm vi đang chọn; sinh viên đã tick ở tblSinhVien nếu có)
    req_TinhHocPhi: function () {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
        var obj_save = {
            'action': 'TC_HangDoi/PTaoHangDoi_TinhPhi_TuDong',
            'versionAPI': 'v1.0',

            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_TP'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropThoiGianDaoTao_TP'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TP'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_TP'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropLopQuanLy_TP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strQLSV_NguoiHoc_Id': arrChecked_Id.toString(),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_THP').toString(),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropKeHoachDangKy_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, versionAPI: obj_save.versionAPI, type: "POST", data: obj_save };
    },
    /*------------------------------------------
    --Discription: Chạy qua form tiến trình chung (Corei/processrun.js, edu.process): trang chỉ khai báo danh sách bản ghi
    -- + hàm dựng yêu cầu (req_*); form lo giờ bắt đầu/kết thúc, kết quả, lỗi, tổng hợp, xuất Excel.
    -------------------------------------------*/
    _noProcess: function () {
        edu.system.alert("Chưa cập nhật form tiến trình (thiếu Corei/processrun.js hoặc indexi.aspx).", "w");
    },
    // lệnh 1 lần cho cả phạm vi đang chọn (edu.process.runJob)
    _runJob: function (cfg) {
        if (!edu.process) { this._noProcess(); return; }
        if (cfg.filters === undefined) cfg.filters = this._filters();
        edu.process.runJob(cfg);
    },
    // chạy từng bản ghi (edu.process.run); filters: danh sách ô lọc hiện ở "Điều kiện áp dụng"
    _runJob2: function (cfg, filters) {
        if (!edu.process) { this._noProcess(); return; }
        cfg.filters = filters;
        edu.process.run(cfg);
    },
    // Điều kiện đang chọn trên màn hình -> dòng "Điều kiện áp dụng" của form và file Excel xuất ra
    _filters: function () {
        return [[
            { label: "Hệ đào tạo", id: "dropHeDaoTao_TP" }, { label: "Khóa đào tạo", id: "dropKhoaDaoTao_TP" }, { label: "Lớp quản lý", id: "dropLopQuanLy_TP" },
            { label: "Thời gian đào tạo", id: "dropThoiGianDaoTao_TP" }, { label: "Nghiệp vụ áp dụng", id: "dropNghiepVu_TP" },
            { label: "Khoản thu", id: "dropKhoanThu_TP" }, { label: "Kế hoạch đăng ký", id: "dropKeHoachDangKy_TP" }
        ]];
    },
    _filtersKhongTinhPhi: function () {
        return [[{ label: "Nghiệp vụ áp dụng", id: "dropNghiepVu_TP" }, { label: "Thời gian đào tạo", id: "dropThoiGianDaoTao_TP" }, { label: "Khoản thu", id: "dropKhoanThu_TP" }]];
    },
    // Dòng "Trạng thái sinh viên: ..." từ các ô tích trạng thái trên màn hình (tích hết thì ghi "tất cả")
    _trangThaiLines: function () {
        var all = $(".ckbDSTrangThaiSV_THP"), on = all.filter(":checked"), a = [];
        if (all.length == 0 || on.length == 0) return [];
        if (on.length == all.length) return ["Trạng thái sinh viên: tất cả"];
        on.each(function () { a.push($(this).attr("title")); });
        return ["Trạng thái sinh viên: " + a.join(", ")];
    },
    /*------------------------------------------
    --Discription: Nút "Xuất Excel" chuẩn chung (Corei/exportexcel.js, edu.exporter.attachTable) gắn cạnh các danh sách kết quả:
    -- xuất đúng danh sách đang xem, có tiêu đề, điều kiện lọc, dòng tổng và ngày xuất như mọi chức năng.
    -------------------------------------------*/
    _attachExport: function () {
        var me = this;
        if (!window.edu || !edu.exporter || typeof edu.exporter.attachTable !== "function") return;
        var f = me._filters(), sub = function () { return me._trangThaiLines(); };
        edu.exporter.attachTable({ table: "tblTinChi", after: "#btnRefresh", fileName: "KetQuaTinhHocPhiTinChi", title: "KẾT QUẢ TÍNH HỌC PHÍ - HỌC CHẾ TÍN CHỈ", subTitles: sub, filters: f });
        edu.exporter.attachTable({ table: "tblNienChe", after: "#btnRefreshNienChe", fileName: "KetQuaTinhHocPhiNienChe", title: "KẾT QUẢ TÍNH HỌC PHÍ - HỌC CHẾ NIÊN CHẾ", subTitles: sub, filters: f });
        edu.exporter.attachTable({ table: "tblKhongTinhPhi", before: "#btnDelete_KhongTinhPhi", fileName: "DanhSachKhongTinhPhi", title: "DANH SÁCH SINH VIÊN KHÔNG TÍNH PHÍ", filters: me._filtersKhongTinhPhi() });
    },
    endHangDoi: function () {
        var me = main_doc.TinhHocPhi;
        me.getList_TinChi();
        me.getList_NienChe();
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 24/08/2018 console.log("[ index ----------------------> " + index + " ]");
    --Discription: processing HangDoi sequence (1 HangDoi <==> n Task ==> process each task util finish all task)
    ----------------------------------------------*/
    proSeqMain_HangDoi: function (strHangDoi_Id) {
        var me = main_doc.TinhHocPhi;

        return new Promise(function (resolve, reject) {
            var obj_Task = {
                strHangDoi_Id: strHangDoi_Id,
                strTuKhoa: '',
                pageIndex: 1,
                pageSize: me.iThread_Queue,
            }
            edu.system.getList_XuLyNhiemVu(obj_Task, resolve, reject, "");

        }).then(function (objData) {
            if (objData.length > 0) {
                me.proSeqLoop_HangDoi(objData, me.proSeqItem_HangDoi, strHangDoi_Id).then(function () {
                    // all done here
                }, function (reason) {
                    // rejection happened
                    alert("Rejection in proSeqMain_HangDoi(): " + reason);
                });
            }
            else {
                return false;
            }
        });
    },
    proSeqLoop_HangDoi: function (obj, fun, strHangDoi_Id) {
        var index = 0;
        return new Promise(function (resolve, reject) {
            function next() {
                if (index < obj.length) {
                    fun(obj[index++], strHangDoi_Id).then(next, reject);
                } else {
                    resolve();
                }
            }
            next();
        });
    },
    proSeqItem_HangDoi: function (obj, strHangDoi_Id) {
        var me = main_doc.TinhHocPhi;
        me.countQueue++;
        var renderPlace_Progress = "probar_TinhHocPhi" + strHangDoi_Id
        return new Promise(function (resolve, reject) {
            var obj_Task = {
                strHangDoi_Id: strHangDoi_Id,
                strNhiemVu_Id: obj.ID//(n id)
            }
            edu.system.save_XuLyNhiemVu(obj_Task, resolve, reject, "");

        }).then(function (obj) {
            return new Promise(function (resolve, reject) {
                var obj_Task = {
                    strHangDoi_Id: strHangDoi_Id,
                }
                edu.system.getDetail_HangDoi(obj_Task, resolve, reject, "");

            }).then(function (obj) {
                //1. get info
                var iTongDuLieu = obj.iTongDuLieuCanThucHien;
                var iTongDuLieu_HoanThanh = obj.iTongDuLieuDaHoanThanh;
                //2. update progressbar
                var objProBar = {
                    items: iTongDuLieu,
                    completed: iTongDuLieu_HoanThanh,
                    renderPlace: renderPlace_Progress,
                };
                edu.system.updateProgressBar(objProBar);
                //3.loop
                if (me.countQueue == me.iThread_Queue) {
                    me.proSeqMain_HangDoi(strHangDoi_Id);
                    me.countQueue = 0;
                }
                //4. 
                if (iTongDuLieu == iTongDuLieu_HoanThanh) {
                    //4.1 --> update table
                    var obj_Queue = {
                        strLoaiNhiemVu: "TINHPHITUDONG"
                    }
                    edu.system.getList_HangDoi(obj_Queue, "", "", me.genHTML_HangDoi);
                    //4.2 --> show notify and hide action
                    $("#" + renderPlace_Progress).html("<span class='color-active italic'>Tiến trình thực hiện thành công!</span>");
                    $("#action_TinhHocPhi").hide();
                    me.getList_TinChi();
                    me.getList_NienChe();
                }
            });

        });
        //
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 24/08/2018
    --Discription: genHTML HangDoi
    ----------------------------------------------*/
    genHTML_HangDoi: function (data, iPager) {
        var me = main_doc.TinhHocPhi;

        me.genHistory_HangDoi(data, iPager);
        var obj = {};
        var html = "";
        var place = "#tblTaskBar_TinhHocPhi tbody";
        var strHangDoi_Id = "";
        var iTongDuLieu = 0;
        var iTongDuLieu_HoanThanh = 0;
        var count_HangDoi = 0;
        $(place).html("");

        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                strHangDoi_Id = data[i].ID;
                iTongDuLieu = edu.util.returnZero(data[i].TONGDULIEUCANTHUCHIEN);
                iTongDuLieu_HoanThanh = edu.util.returnZero(data[i].TONGDULIEUDAHOANTHANH);

                if (iTongDuLieu != iTongDuLieu_HoanThanh) {
                    //1. gen form contain taskbar
                    html = "";
                    html += '<tr>';
                    html += '<td class="">- Thanh tiến trình ' + (i + 1) + '</td>';
                    html += '<td class="td-right">';
                    html += '<div id="probar_TinhHocPhi' + strHangDoi_Id + '">';
                    html += '</div>';
                    html += '<div id="action_TinhHocPhi" class="pull-right">';
                    html += '<a class="btn btn-primary btnStart" id="start_hangdoi' + strHangDoi_Id + '"><i class="fa fa-play"></i> Bắt đầu</a>'
                    html += '</div>';
                    html += '</td>';
                    html += '</tr>';
                    $(place).append(html);
                    //2. gen taskbar
                    obj = {};
                    obj.items = iTongDuLieu;
                    obj.completed = iTongDuLieu_HoanThanh;
                    obj.renderPlace = "probar_TinhHocPhi" + strHangDoi_Id;
                    me.loadProgressBar(obj);
                }
                else {
                    count_HangDoi++;
                }
            }
            //.check exitance HangDoi
            if (count_HangDoi == data.length) {
                $(place).append("<tr><td colspan='2' class='color-warning italic'>Không có tiến trình nào cần xử lý!</td></tr>");
            }
        }

    },
    genHistory_HangDoi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHistory_TinhHocPhi",
            aaData: data,
            sort: true,
            colPos: {
                left: [1, 2],
                center: [0, 3, 4],
                fix: [0]
            },
            aoColumns: [
            {
                "mDataProp": "NGUOITHUCHIEN_TENDAYDU"
            }
            , {
                "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
            }
            , {
                "mDataProp": "TONGDULIEUCANTHUCHIEN"
            }
            , {
                "mDataProp": "TONGDULIEUDAHOANTHANH"
            }
            , {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var strDAOTAO_Nam_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.loadToCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LoaiKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_TinhTien/LayDSKhoanPhiTheoNghiepVu',
            'type': 'GET',
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.dtLoaiKhoan = dtResult;
                    me.cbGenCombo_KhoanThu(dtResult);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LopQuanLy: function (strKhoaDaoTao_Id, strToChucCT_Id) {
        var me = this;
        var obj_LopQL = {
            strCoSoDaoTao_Id: "",
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: strToChucCT_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_LopQuanLy(obj_LopQL, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_KeHoachDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDSKeHoachTheoThoiGian',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    dtResult = data.Data;
                    me.cbGenCombo_KeHoachDangKy(dtResult);
                }
                else {
                    edu.system.alert("" + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                //edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao_TP"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao_TP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao_TP"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoanThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoanThu_TP"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_LopQuanLy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy_TP"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KeHoachDangKy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachDangKy_TP"],
            type: "",
            title: "Chọn kế hoạch đăng ký",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    getList_TinChi: function () {
        var me = this;

        var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
        //--Edit
        var obj_list = {
            'action': 'TC_KetQuaDaTinhPhi/LayDanhSach',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropThoiGianDaoTao_TP'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropKeHoachDangKy_TP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_TP'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValCombo('dropLopQuanLy_TP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': arrChecked_Id.toString(),
            
        }
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_TinChi(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {  },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_TinChi: function (strQLSV_NguoiHoc_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_KetQuaDaTinhPhi_NC/LayDanhSach',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropThoiGianDaoTao_TP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),

            'strChuongTrinh_Id': "",
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genDeTail_TinChi(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TinChi: function (data, iPager) {
        var me = this;
        $("#tblTinChi_Tong").html(iPager);
        var strTable_Id = "tblTinChi";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2, 5, 6, 7],
                center: [3, 4, 8, 9, 10, 11, 12, 13, 14, 15],
                fix: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btnChiTiet" id="' + aData.QLSV_NGUOIHOC_ID + '" href="#">' + aData.QLSV_NGUOIHOC_MASO + '</a>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TINHTRANG"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_LOP"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_CHUONGTRINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_KHOAHOC"
                },
                {
                    "mDataProp": "SOHOCPHAN"
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "SOTIEN_HOCDI"
                },
                {
                    "mDataProp": "SOTIEN_HOCLAI"
                },
                {
                    "mDataProp": "SOTIEN_HOCNANGDIEM"
                },
                {
                    "mDataProp": "PHANTRAMMIEN"
                },
                {
                    "mDataProp": "SOTIENMIEN"
                },
                {
                    "mDataProp": "SOTIENPHAINOP"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTable_Id, [8, 9, 10, 11, 12, 14, 15]);
        /*III. Callback*/
    },
    genDeTail_TinChi: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblChiTiet";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2],
                center: [3, 4, 5, 6, 7, 8],
                fix: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TINCHI"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "PHANTRAMMIEN"
                },
                {
                    "mData": "SOTIENMIEN",
                    "mRender": function (nRow, aData) {
                        return parseInt(aData.SOTIEN) - parseInt(aData.SOTIENMIEN);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTable_Id, [4, 5, 7, 8]);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    getList_NienChe: function () {
        var me = this;

        var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
        //--Edit
        var obj_list = {
            'action': 'TC_KetQuaDaTinhPhi_NC/LayDanhSach',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropThoiGianDaoTao_TP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_TP'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropLopQuanLy_TP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': arrChecked_Id.toString(),

        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_NienChe(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_NienChe: function (data, iPager) {
        var me = this;
        $("#tblNienChe_Tong").html(iPager);
        var strTable_Id = "tblNienChe";
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                left: [1, 2, 5, 6, 7],
                center: [3, 4, 8, 9, 10, 11],
                fix: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TINHTRANG"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_LOP"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_CHUONGTRINH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_KHOAHOC"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "PHANTRAMMIEN"
                },
                {
                    "mDataProp": "SOTIENMIEN"
                },
                {
                    "mDataProp": "SOTIENMIENCODINH"
                },
                {
                    "mDataProp": "SOTIENPHAINOP"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(strTable_Id, [8, 10, 11]);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_TrangThaiSV: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'QLSV.TRANGTHAI',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_TrangThaiSV(data.Data);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" class="ckbDSTrangThaiSV_THP_ALL" checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + data[i].ID + '" class="ckbDSTrangThaiSV_THP" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_THP").html(row);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    req_KetQuaDaTinhPhi_Xoa: function () {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var arrChecked_Id = edu.util.getArrCheckedIds("tblSinhVien", "checkX");
        var obj_save = {
            'action': 'TC_KetQuaDaTinhPhi/Xoa',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValCombo('dropThoiGianDaoTao_TP'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropKeHoachDangKy_TP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TP'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_TP'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropLopQuanLy_TP'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_TP'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': arrChecked_Id.toString(),
        };
        return { action: obj_save.action, versionAPI: obj_save.versionAPI, type: "POST", data: obj_save };
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TC_NguoiHoc_HoSo/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': 1,
            'pageSize': 100000,
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_PT'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_TP'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TP'),
            'strLopHoc_Id': edu.util.getValById('dropLopQuanLy_TP'),
            'strTuKhoa': edu.util.getValById('txtTuKhoa_Search').trim(),
            'strTrangThaiNguoiHoc_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV_THP').toString(),
            'strQLSV_NguoiHoc_Id': "",
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_SinhVien(dtReRult, data.Pager);
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
    genTable_SinhVien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblSinhVien",
            aaData: data,
            colPos: {
                center: [0, 3]
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.checkEmpty(aData.HODEM) + " " + edu.util.checkEmpty(aData.TEN);
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    req_KhongTinhPhi: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id, dPhanTram) {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi2_MH/FSkkLB4VAh4PJikoJDEXNB4CKS41HhEpKAPP',
            'func': 'PKG_TAICHINH_THUCHI2.Them_TC_NghiepVu_Chot_Phi',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGianDaoTao_TP'),
            'strNghiepVuApDung_Id': edu.system.getValById('dropNghiepVu_TP'),
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.system.getValById('dropKhoanThu_TP'),
            'dPhanTram': dPhanTram,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },

    req_KhongTinhPhi_Sua: function (strId, dPhanTram) {
        var me = this;
        var obj_save = {
			'action': 'TC_ThuChi2_MH/EjQgHhUCHg8mKSgkMRc0HgIpLjUeESko',
			'func': 'PKG_TAICHINH_THUCHI2.Sua_TC_NghiepVu_Chot_Phi',
			'iM' : edu.system.iM,
            'strId': strId,
            'dPhanTram': dPhanTram,
			'strNguoiThucHien_Id' : edu.system.userId,
		};
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    getList_KhongTinhPhi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_ThuChi2_MH/DSA4BRIVAh4PJikoJDEXNB4CKS41HhEpKAPP',
            'func': 'PKG_TAICHINH_THUCHI2.LayDSTC_NghiepVu_Chot_Phi',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGianDaoTao_TP'),
            'strNghiepVuApDung_Id': edu.system.getValById('dropNghiepVu_TP'),
            'strTaiChinh_CacKhoanThu_Id': edu.system.getValById('dropKhoanThu_TP'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': edu.system.getValById('txtAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKhongTinhPhi"] = dtReRult;
                    me.genTable_KhongTinhPhi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    req_KhongTinhPhi_Xoa: function (Ids) {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi2_MH/GS4gHhUCHg8mKSgkMRc0HgIpLjUeESko',
            'func': 'PKG_TAICHINH_THUCHI2.Xoa_TC_NghiepVu_Chot_Phi',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KhongTinhPhi: function (data, iPager) {
        $("#lblKhongTinhPhi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhongTinhPhi",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KhongTinhPhi.getList_KhongTinhPhi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mDataProp": "NGHIEPVUAPDUNG_TEN"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtPhanTram_' + aData.ID + '" class="form-control phantram" value="' + edu.util.returnEmpty(aData.PHANTRAM) + '"  name="' + edu.util.returnEmpty(aData.PHANTRAM) + '"/>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}