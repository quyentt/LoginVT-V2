/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    iLoaiDieuKien: true,
    strDieuKien: '',
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    dtKetQuaXuLy: [],
    dtKetQuaXuLy2: [],

    init: function () {
        var me = this;
        me._attachExport();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();

        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
        });
        $("[id$=chkSelectAll_KeHoachXuLy]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKeHoachXuLy" });
        });
        $("[id$=chkSelectAll_KetQuaXuLy]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKetQuaXuLy" });
        });
        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });
        // Xóa kế hoạch xử lý: chạy từng kế hoạch qua form tiến trình chung (Corei/processrun.js)
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrSelected = me._selected("tblKeHoachXuLy", me.dtKeHoachXuLy);
            if (arrSelected.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            me._run({
                title: "Xóa kế hoạch xử lý học vụ", unit: "kế hoạch", fileName: "KetQuaXoaKeHoachXuLy",
                notes: ["Thao tác xóa dữ liệu các kế hoạch xử lý trong danh sách."],
                items: arrSelected,
                columns: [{ header: "Mã", render: function (r) { return r.MA; } }, { header: "Tên kế hoạch", render: function (r) { return r.TEN; } }],
                request: function (it) { return me.req_KeHoachXuLy_Xoa(it.ID); },
                refresh: function () { me.getList_KeHoachXuLy(); }
            });
        });
        $(".btnDeleteDTSV_SinhVien").click(function () {
            var arrSelected = me._selected("tblInput_DTSV_SinhVien", me._rowsKQ());
            if (arrSelected.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            me._run({
                title: "Xóa sinh viên khỏi danh sách không xử lý", unit: "sinh viên", fileName: "KetQuaXoaSinhVienKhongXuLy",
                notes: ["Thao tác xóa dữ liệu các sinh viên trong danh sách."],
                items: arrSelected, columns: me._colsSV(),
                request: function (it) { return me.req_SinhVien_Xoa(it.ID); },
                refresh: function () { me.getList_SinhVien(); }
            });
        });
        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoachXuLy").delegate('.btnDieuKien', 'click', function (e) {
            var strId = this.id;
            me.toggle_dieukien()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strKeHoachXuLy_Id = strId;
            me.getList_DieuKien();
            me.getList_DieuKienApDung();
        });
        $("#tblKeHoachXuLy").delegate('.btnKetQua', 'click', function (e) {
            var strId = this.id;
            me.toggle_ketquaxuly()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strKeHoachXuLy_Id = strId;
            me.getList_KetQuaXuLy();
        });

        $("#tblKeHoachXuLy").delegate('.btnDSXet', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSXet");
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strKeHoachXuLy_Id = strId;
            //me.getList_DSXet();
        });
        $("#tblKeHoachXuLy").delegate('.btnDSNhanSu', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSNhanSu");
            me.strKeHoachXuLy_Id = strId;
            me.getList_PhanCong();
        });
        $("#tblKetQuaXuLy, #tblDSXet, #tblInput_DTSV_SinhVien").delegate('.btnView_HocTap', 'click', function (e) {
            $('#modalHTSinhVien').modal('show');
            me["strSinhVien_Id"] = this.id;
            window._embeddedSinhVien_Id = this.id;
            edu.system.loadPage($("#zoneHTSinhVien"), '/modules/hoctap/html/diemhoc.html', null, null, 'ApisCongSinhVien');
        });
        $("#btnXoaKetQuaXuLy").click(function () {
            var arrSelected = me._selected("tblKetQuaXuLy", me._rowsKQ());
            if (arrSelected.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            me._run({
                title: "Xóa kết quả xử lý học vụ", unit: "sinh viên", fileName: "KetQuaXoaKetQuaXuLy",
                notes: ["Thao tác xóa dữ liệu kết quả xử lý của các sinh viên trong danh sách."],
                items: arrSelected, columns: me._colsSV(),
                request: function (it) { return me.req_KetQuaXuLy_Xoa(it.ID); },
                refresh: function () { me.getList_KetQuaXuLy(); }
            });
        });
        // Xét xử lý học vụ cho các sinh viên đã tick ở 3 bảng: kết quả xử lý / danh sách (nhập tay) / danh sách xét
        $("#btnXetKetQuaXuLy").click(function (e) { me._xet("tblKetQuaXuLy"); });
        $("#btnXetKetQuaXuLyEdit").click(function (e) { me._xet("tblInput_DTSV_SinhVien"); });
        $("#btnKeThuaTuKeHoach").click(function (e) {
            edu.system.confirm("Bạn có chắc chắn kế thừa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.kethua_DieuKien();
            });
        });

        $("#tblBangKieuKien").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strDieuKien = strId;
            $("#myModalDieuKien").modal("show");
            var objDieuKien = me.dtDieuKien.find(e => e.ID == strId);
            $("#lblLoaiXuLy").html(edu.util.returnEmpty(objDieuKien.LOAIXULY_TEN));
            $("#lblMucXuKy").html(edu.util.returnEmpty(objDieuKien.MUCXULY_TEN));
            edu.util.viewValById("txtXauDieuKien", objDieuKien.XAUDIEUKIEN);
            me.iLoaiDieuKien = true;
        });
        $("#tblBangKieuKienApDung").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strDieuKien = strId;
            $("#myModalDieuKien").modal("show");
            var objDieuKien = me.dtDieuKienApDung.find(e => e.ID == strId);
            $("#lblLoaiXuLy").html(edu.util.returnEmpty(objDieuKien.LOAIXULY_TEN));
            $("#lblMucXuKy").html(edu.util.returnEmpty(objDieuKien.MUCXULY_TEN));
            edu.util.viewValById("txtXauDieuKien", objDieuKien.XAUDIEUKIEN);
            me.iLoaiDieuKien = false;
        });
        $("#btnSave_DieuKien").click(function () {
            me.iLoaiDieuKien ? me.save_DieuKien() : me.save_DieuKienApDung();
        });
        $("#btnDelete_DieuKien").click(function () {
            me.iLoaiDieuKien ? me.delete_DieuKien(me.strDieuKien) : me.delete_DieuKienApDung(me.strDieuKien);
            $("#myModalDieuKien").modal("hide");
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/


        // Thêm sinh viên / phạm vi (hệ, khóa, khoa x khóa, chương trình, lớp) vào "danh sách không xử lý": mỗi mục 1 bản ghi của form tiến trình
        if (edu.process) {
            edu.process.bindPhamVi({
                pickerButton: ".btnSearchDTSV_SinhVien", what: "vào danh sách không xử lý", fileName: "KetQuaThemSinhVienKhongXuLy",
                request: function (strId, bPhamVi) { return me.req_SinhVien(strId, bPhamVi); },
                refresh: function () { me.getList_SinhVien(); }
            });
        }
        else $(".btnSearchDTSV_SinhVien").click(function () { me._run({}); });//báo thiếu Corei/processrun.js

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        edu.system.getList_MauImport("zonebtnBaoCao_KHXY", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_ThoiGianDaoTao"));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strXLHV_KeHoachXuLy_Id", e))
        });
        edu.system.loadToCombo_DanhMucDuLieu("XLHV.LOAIXULY", "dropKeHoachXuLy_LoaiXuLy");
        $("#txtSearchKetQuaXuLy").on("keyup", function () {
            var value = edu.system.change_alias($(this).val().toLowerCase());
            $("#tblKetQuaXuLy tbody tr").filter(function () {
                $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#txtSearchKetQuaXuLyEdit").on("keyup", function () {
            var value = edu.system.change_alias($(this).val().toLowerCase());
            console.log(value);
            $("#tblInput_DTSV_SinhVien tbody tr").filter(function () {
                $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
            }).css("color", "red");
        });


        $("#btnAdd_KeThuaTheoNhom").click(function () {
            $("#myModalKeThuaNhom").modal("show");
            me.getList_KeThuaNhom();
        });

        $("#btnSave_KeThuaTheoNhom").click(function () {
            var arrSelected = me._selected("tblKeThuaTheoNhom", me.dtKeThuaNhom);
            if (arrSelected.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me._run({
                hideModal: "#myModalKeThuaNhom",
                title: "Kế thừa điều kiện xử lý theo nhóm", unit: "nhóm", fileName: "KetQuaKeThuaNhom",
                subTitles: ["Kế hoạch đích: " + me._tenKeHoach()],
                items: arrSelected,
                columns: [{ header: "Tên", render: function (r) { return r.TEN; } }, { header: "Mô tả", render: function (r) { return r.MOTA; } }],
                request: function (it) { return me.req_KeThuaNhom(it.ID); },
                refresh: function () { me.getList_DieuKien(); me.getList_DieuKienApDung(); }
            });
        });


        $("#btnXetDSXet").click(function (e) { me._xet("tblDSXet"); });
        $("#btnSearchDSXet").click(function () {
            me.getList_DSXet();
        });

        $("#btnAdd_PhanCong").click(function () {
            edu.extend.genModal_NguoiDung(arrChecked_Id => {
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng?");
                    return;
                }
                var map = {};
                (edu.extend.dtNguoiDung || []).forEach(r => map[r.ID] = r);
                me._run({
                    hideModal: "#modal_nhansu",
                    title: "Phân công nhân sự xử lý", unit: "nhân sự", fileName: "KetQuaPhanCong",
                    subTitles: ["Kế hoạch xử lý: " + me._tenKeHoach()],
                    items: arrChecked_Id.map(id => ({ ID: id, row: map[id] || {} })),
                    columns: [
                        { header: "Tài khoản", render: function (it) { return it.row.TAIKHOAN || it.ID; } },
                        { header: "Họ tên", render: function (it) { return it.row.TENDAYDU; } }
                    ],
                    request: function (it) { return me.req_PhanCong(it.ID); },
                    refresh: function () { me.getList_PhanCong(); }
                });
            });
            edu.extend.getList_NguoiDungP();
        });
        $("#btnDelete_PhanCong").click(function () {
            var arrSelected = me._selected("tblPhanCong", me.dtPhanCong);
            if (arrSelected.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            me._run({
                title: "Xóa phân công nhân sự xử lý", unit: "nhân sự", fileName: "KetQuaXoaPhanCong",
                subTitles: ["Kế hoạch xử lý: " + me._tenKeHoach()],
                notes: ["Thao tác xóa dữ liệu phân công của các nhân sự trong danh sách."],
                items: arrSelected,
                columns: [{ header: "Tài khoản", render: function (r) { return r.NGUOIDUNG_TAIKHOAN; } }, { header: "Họ tên", render: function (r) { return r.NGUOIDUNG_TENDAYDU; } }],
                request: function (it) { return me.req_PhanCong_Xoa(it.ID); },
                refresh: function () { me.getList_PhanCong(); }
            });
        });
    },

    /*------------------------------------------
    --Discription: Chạy hàng loạt qua form tiến trình chung (Corei/processrun.js, edu.process): mỗi thao tác chỉ khai báo
    -- danh sách bản ghi + hàm dựng yêu cầu cho 1 bản ghi (req_*); form lo giờ bắt đầu/kết thúc, kết quả, lỗi, tổng hợp, xuất Excel.
    -------------------------------------------*/
    _run: function (cfg) {
        if (!edu.process) {
            edu.system.alert("Chưa cập nhật form tiến trình (thiếu Corei/processrun.js hoặc indexi.aspx).", "w");
            return;
        }
        if (cfg.filters === undefined) cfg.filters = [[{ label: "Thời gian đào tạo", id: "dropSearch_ThoiGianDaoTao" }]];
        edu.process.run(cfg);
    },
    // Các dòng đang tick ở bảng strTableId, lấy đủ dữ liệu từ arrData (tra theo ID)
    _selected: function (strTableId, arrData) {
        if (edu.process) return edu.process.selectedRows(strTableId, arrData);
        var map = {};
        (arrData || []).forEach(function (r) { map[r.ID] = r; });
        return edu.util.getArrCheckedIds(strTableId, "checkX").map(function (id) { return map[id]; }).filter(function (r) { return !!r; });
    },
    // Tra bản ghi theo ID: dtKetQuaXuLy ưu tiên, không thấy mới tìm ở dtKetQuaXuLy2 (giống cách tra của hàm cũ; bản ghi sau ghi đè bản ghi trước)
    _rowsKQ: function () {
        return [].concat(this.dtKetQuaXuLy2 || [], this.dtKetQuaXuLy || []);
    },
    _tenKeHoach: function () {
        var r = (this.dtKeHoachXuLy || []).find(e => e.ID === this.strKeHoachXuLy_Id);
        return r ? edu.util.returnEmpty(r.TEN) : "";
    },
    _colsSV: function () {
        var v = edu.util.returnEmpty;
        return [
            { header: "Mã số", render: function (r) { return r.QLSV_NGUOIHOC_MASO; } },
            { header: "Họ tên", render: function (r) { return v(r.QLSV_NGUOIHOC_HODEM) + " " + v(r.QLSV_NGUOIHOC_TEN); } },
            { header: "Lớp quản lý", render: function (r) { return r.DAOTAO_LOPQUANLY_TEN; } },
            { header: "Chương trình", render: function (r) { return r.DAOTAO_CHUONGTRINH_TEN; } }
        ];
    },
    // Xét xử lý học vụ cho các sinh viên đã tick ở bảng strTableId
    _xet: function (strTableId) {
        var me = this;
        var arrSelected = me._selected(strTableId, me._rowsKQ());
        if (arrSelected.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng?");
            return;
        }
        me._run({
            title: "Xét xử lý học vụ", unit: "sinh viên", fileName: "KetQuaXetXuLyHocVu",
            subTitles: ["Kế hoạch xử lý: " + me._tenKeHoach()],
            items: arrSelected, columns: me._colsSV(),
            request: function (it) { return me.req_XuLyHocVu(it); },
            refresh: function () { me.getList_KetQuaXuLy(); me.getList_DSXet(); }
        });
    },

    /*------------------------------------------
    --Discription: Nút "Xuất Excel" chuẩn chung (Corei/exportexcel.js, edu.exporter.attachTable) gắn cạnh các danh sách kết quả:
    -- xuất đúng danh sách đang xem, có tiêu đề, điều kiện lọc, dòng tổng và ngày xuất như mọi chức năng.
    -------------------------------------------*/
    _attachExport: function () {
        var me = this;
        if (!window.edu || !edu.exporter || typeof edu.exporter.attachTable !== "function") return;
        var f = [[{ label: "Thời gian đào tạo", id: "dropSearch_ThoiGianDaoTao" }]];
        var sub = function () { return ["Kế hoạch xử lý: " + me._tenKeHoach()]; };
        edu.exporter.attachTable({ table: "tblKetQuaXuLy", before: "#btnXetKetQuaXuLy", fileName: "KetQuaXuLyHocVu", title: "KẾT QUẢ XỬ LÝ HỌC VỤ", subTitles: sub, filters: f });
        edu.exporter.attachTable({ table: "tblDSXet", before: "#btnXetDSXet", fileName: "DanhSachXetXuLyHocVu", title: "DANH SÁCH XÉT XỬ LÝ HỌC VỤ", subTitles: sub, filters: f });
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtKeHoachXuLy_Ma", "");
        edu.util.viewValById("txtKeHoachXuLy_Ten", "");
        edu.util.viewValById("dropKeHoachXuLy_KetQua", "");
        edu.util.viewValById("dropKeHoachXuLy_ThoiGianDaoTao", "");
        edu.util.viewValById("txtKeHoachXuLy_TuNgay", "");
        edu.util.viewValById("txtKeHoachXuLy_DenNgay", "");
        edu.util.viewValById("dropKeHoachXuLy_LoaiXuLy", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_dieukien: function () {
        edu.util.toggle_overide("zone-bus", "zonedieukien");
    },
    toggle_ketquaxuly: function () {
        edu.util.toggle_overide("zone-bus", "zoneketqua");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_KeHoachXuLy/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
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
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_ThongTin_MH/FSkkLB4ZDQkXHgokCS4gIikZNA04',
            'func': 'pkg_xulyhocvu_thongtin.Them_XLHV_KeHoachXuLy',
            'iM': edu.system.iM,
            'strId': me.strKeHoachXuLy_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById('txtKeHoachXuLy_Ten'),
            'strMa': edu.util.getValById('txtKeHoachXuLy_Ma'),
            'strTuNgay': edu.util.getValById('txtKeHoachXuLy_TuNgay'),
            'strDenNgay': edu.util.getValById('txtKeHoachXuLy_DenNgay'),
            'strLoaiXuLy_Id': edu.util.getValById('dropKeHoachXuLy_LoaiXuLy'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropKeHoachXuLy_ThoiGianDaoTao'),
            'dKetQuaChinhThuc': edu.util.getValById('dropKeHoachXuLy_KetQua') ? edu.util.getValById('dropKeHoachXuLy_KetQua') : -1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'XLHV_ThongTin_MH/EjQgHhkNCRceCiQJLiAiKRk0DTgP';
            obj_save.func = 'pkg_xulyhocvu_thongtin.Sua_XLHV_KeHoachXuLy'
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    setTimeout(function () {
                        me.strKeHoachXuLy_Id = strKeHoachXuLy_Id;
                        $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
                        $(".btnOpenDelete").show();
                        $(".zoneOpenNew").hide();
                    }, 2000);
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    console.log($(this).attr("name"));
                    //    if ($(this).attr("name") == "new"){
                    //        me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                    //    }
                    //});

                    //for (var i = 0; i < me.arrKhoa.length; i++) {
                    //    me.save_SinhVien(me.arrKhoa[i], strKeHoachXuLy_Id, true);
                    //}
                    //for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                    //    me.save_SinhVien(me.arrChuongTrinh[i], strKeHoachXuLy_Id, true);
                    //}
                    //for (var i = 0; i < me.arrLop.length; i++) {
                    //    me.save_SinhVien(me.arrLop[i], strKeHoachXuLy_Id, true);
                    //}
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    req_KeHoachXuLy_Xoa: function (strId) {
        var obj_save = {
            'action': 'XLHV_KeHoachXuLy/Xoa',
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,10, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_KY"
                },
                {
                    "mDataProp": "LOAIXULY_TEN"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        if (aData.KETQUACHINHTHUC == 1) return "Có";
                        return "Không";
                    }
                },
                //{
                //    "mData": "SOLUONG",
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnDSNhanSu" id="' + aData.ID + '" title="Sửa">Phân công</a></span>';
                //    }
                //},
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSXet" id="' + aData.ID + '" title="Sửa">' + edu.util.returnEmpty(aData.SOLUONG) +'</a></span>';
                        return edu.util.returnEmpty(aData.SOLUONG);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDieuKien" id="' + aData.ID + '" title="Sửa">Thiết lập</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Sửa">Kết quả</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtKeHoachXuLy_Ma", data.MA);
        edu.util.viewValById("txtKeHoachXuLy_Ten", data.TEN);
        edu.util.viewValById("dropKeHoachXuLy_KetQua", data.KETQUACHINHTHUC);
        edu.util.viewValById("dropKeHoachXuLy_ThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtKeHoachXuLy_TuNgay", data.TUNGAY);
        edu.util.viewValById("txtKeHoachXuLy_DenNgay", data.DENNGAY);
        edu.util.viewValById("dropKeHoachXuLy_LoaiXuLy", data.LOAIXULY_ID);
        me.strKeHoachXuLy_Id = data.ID;
        me.getList_SinhVien();
        me.getList_PhanCong();
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = main_doc.KeHoachXuLy;

        //--Edit
        var obj_list = {
            'action': 'XLHV_DanhSachKhongXuLy/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLHV_KeHoachXuLy_Id': me.strKeHoachXuLy_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKetQuaXuLy = dtResult;
                    me.genTable_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    req_SinhVien: function (strNhanSu_Id, bKhongPhaiSinhVien) {
        var me = this;
        // bKhongPhaiSinhVien: phạm vi theo hệ/khóa/chương trình/lớp (chỉ có ID, trạng thái lấy theo các ô tick trạng thái)
        var aData = bKhongPhaiSinhVien ? {
            'QLSV_NGUOIHOC_ID': strNhanSu_Id,
            'QLSV_TRANGTHAINGUOIHOC_ID': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString()
        } : (edu.extend.dtSinhVien || []).find(eSV => eSV.ID == strNhanSu_Id);
        if (!aData) throw new Error("Không tìm thấy dữ liệu của sinh viên.");
        var obj_save = {
            'action': 'XLHV_ThongTin/Them_XLHV_DSKhongXuLy_PhamVi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLHV_KeHoachXuLy_Id': me.strKeHoachXuLy_Id,
            'strPhamViApDung_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    req_SinhVien_Xoa: function (strIds) {
        var obj_save = {
            'action': 'XLHV_DanhSachKhongXuLy/Xoa',
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        // for (var i = 0; i < data.length; i++) {
        //     var html = "";
        //     html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
        //     html += "<td class='td-center'>" + (i + 1) + "</td>";
        //     html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
        //     html += "<td class='td-left'><div class='btn btn-default min-w-auto btnView_HocTap' id='" + data[i].QLSV_NGUOIHOC_ID + "'><u>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_MASO) + "</u></div></td>";
        //     html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_HODEM + " " + data[i].QLSV_NGUOIHOC_TEN + "</span></td>";
        //     html += "<td class='td-left'><span>" + data[i].DAOTAO_LOPQUANLY_TEN + "</span></td>";
        //     html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_CHUONGTRINH_TEN) + "</span></td>";
        //     html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_KHOADAOTAO_TEN) + "</span></td>";
        //     html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
        //     html += "</tr>";
        //     //4. fill into tblNhanSu
        //     $("#tblInput_DTSV_SinhVien tbody").append(html);
        //     //5. create data danhmucvaitro
        //     me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
        //     me.arrSinhVien.push(data[i]);
        // }
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVien('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                center: [0,1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        
                        return "<div class='btn btn-default min-w-auto btnView_HocTap' id='" + aData.QLSV_NGUOIHOC_ID + "'><u>" + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + "</u></div>";
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        
                        return '<span>' + aData.QLSV_NGUOIHOC_HODEM + ' ' + aData.QLSV_NGUOIHOC_TEN + '</span>';
                    }
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        console.log(edu.extend.dtSinhVien);
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + aData.ID + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.ANH) + "'></td>";
        html += "<td class='td-left'><div class='btn btn-default min-w-auto btnView_HocTap' id='" + aData.QLSV_NGUOIHOC_ID + "'><u>" + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + "</u></div></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + aData.ID + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVien: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Lop_SV" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien").html("");
        $("#modal_sinhvien").append(html);
        $("#modal_sinhvien").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienMD("SEARCH");
            }
        });
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        edu.extend.getList_HeDaoTao();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMD("SEARCH");
        });
        $('#dropSearchModal_He_SV').on('select2:select', function (e) {
            
            edu.extend.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            
            edu.extend.getList_ChuongTrinhDaoTao();
            edu.extend.getList_LopQuanLy();
        });
        $('#dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            
            edu.extend.getList_LopQuanLy();
        });

        $('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
            
            me.getList_SinhVienMD();
        });
    },
    getList_SinhVienMD: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'SV_HoSoNhieuNganh/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearchModal_TuKhoa_SV'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearchModal_Lop_SV'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    cbGetListModal_SinhVien: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVienMD('SEARCH')",
                iDataRow: iPager,
                bLeft: false,
                bChange: false
            },
            colPos: {
                center: [0,1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachXuLy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropKeHoachXuLy_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.KeHoachXuLy.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_DieuKienXuLy_AD/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': me.strKeHoachXuLy_Id,
            'strLoaiXuLy_Id': edu.util.getValById('dropAAAA'),
            'strMucXuLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDieuKien"]= dtReRult;
                    me.genTable_DieuKien(dtReRult);
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
    genTable_DieuKien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBangKieuKien",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIXULY_TEN"
                },
                {
                    "mDataProp": "MUCXULY_TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_KY"
                },
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_DieuKienXuLy_AD/LayDSXLHV_DieuKienXuLy_Phu_AD',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': me.strKeHoachXuLy_Id,
            'strLoaiXuLy_Id': edu.util.getValById('dropAAAA'),
            'strMucXuLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDieuKienApDung"] = dtReRult;
                    me.genTable_DieuKienApDung(dtReRult);
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
    genTable_DieuKienApDung: function (data, iPager) {
        console.log("genTable_DieuKienApDung")
        var me = this;
        var jsonForm = {
            strTable_Id: "tblBangKieuKienApDung",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIXULY_TEN"
                },
                {
                    "mDataProp": "MUCXULY_TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO_KY"
                },
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    kethua_DieuKien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_ThongTin/KeThuaDieuKienChuanApDung',
            'type': 'POST',
            'strXLHV_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                me.getList_DieuKien();
                me.getList_DieuKienApDung();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

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
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    save_DieuKien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_DieuKienXuLy_AD/Sua_XLHV_DieuKienXuLy_DK_AD',
            'type': 'POST',
            'strId': me.strDieuKien,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtXauDieuKien'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    me.getList_DieuKien();
                }
                else {
                    edu.system.alert(data.Message);
                }

                //me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKien: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'XLHV_DieuKienXuLy_AD/Xoa',
            
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DieuKien();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    save_DieuKienApDung: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_DieuKienXuLy_AD/Sua_XLHV_DieuKienXL_Phu_DK_AD',
            'type': 'POST',
            'strId': me.strDieuKien,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtXauDieuKien'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    me.getList_DieuKienApDung();
                }
                else {
                    edu.system.alert(data.Message);
                }

                //me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienApDung: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'XLHV_DieuKienXuLy_AD/Xoa_XLHV_DieuKienXuLy_Phu_AD',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_DieuKienApDung();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/

    req_XuLyHocVu: function (aData) {
        var obj_save = {
            'action': 'XLHV_TinhToan/XuLyHocVuNguoiHoc',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': aData.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strXLHV_KeHoachXuLy_Id': aData.XLHV_KEHOACHXULY_ID,
            'strLoaiXuLy_Id': aData.LOAIXULY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    req_KetQuaXuLy_Xoa: function (strId) {
        var obj_save = {
            'action': 'XLHV_KetQuaXuLy/Xoa',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    getList_KetQuaXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'XLHV_KetQuaXuLy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strLopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguoiDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strXLHV_KeHoachXuLy_Id': me.strKeHoachXuLy_Id,
            'strLoaiXuLy_Id': edu.util.getValById('dropAAAA'),
            'strMucXuLy_Id': edu.util.getValById('dropAAAA'),
            'strTinhTrangXacNhan_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKetQuaXuLy"] = dtReRult.rsThongTinNguoiHoc;
                    me.genTable_KetQuaXuLy(dtReRult.rsThongTinNguoiHoc);
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
    genTable_KetQuaXuLy: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaXuLy",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '"><u>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</u></div>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "MUCXULY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },


    getList_KeThuaNhom: function (strDanhSach_Id) {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_ThongTin_MH/DSA4BRIZDQkXHhEpICwXKB4AMQU0LyYP',
            'func': 'pkg_xulyhocvu_thongtin.LayDSXLHV_PhamVi_ApDung',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXuLy_Id': me.strKeHoachXuLy_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKeThuaNhom"] = dtReRult;
                    me.genTable_KeThuaNhom(dtReRult);
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
    genTable_KeThuaNhom: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKeThuaTheoNhom",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MOTA",
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    req_KeThuaNhom: function (strPhamViNguon_Id) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_ThongTin_MH/CiQVKTQgHgUoJDQKKCQvGTQNOB4AJQPP',
            'func': 'pkg_xulyhocvu_thongtin.KeThua_DieuKienXuLy_Ad',
            'iM': edu.system.iM,
            'strPhamViNguon_Id': strPhamViNguon_Id,
            'strPhamViDich_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },


    getList_DSXet: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_ThongTin_MH/DSA4BRIZDQkXHgUgLykSICIpCikuLyYZNA04',
            'func': 'pkg_xulyhocvu_thongtin.LayDSXLHV_DanhSachKhongXuLy',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearchDSXet'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLHV_KeHoachXuLy_Id': me.strKeHoachXuLy_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKetQuaXuLy2"] = dtReRult;
                    me.genTable_DSXet(dtReRult);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
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
    genTable_DSXet: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDSXet",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '"><u>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</u></div>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                //{
                //    "mDataProp": "MUCXULY_TEN"
                //},
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_PhanCong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_ThongTin_MH/DSA4BRIZDQkXHgokCS4gIikeDykgLxI0',
            'func': 'pkg_xulyhocvu_thongtin.LayDSXLHV_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strXLHV_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhanCong"] = dtReRult;
                    me.genTable_PhanCong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
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
    req_PhanCong: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_ThongTin_MH/FSkkLB4ZDQkXHgokCS4gIikeDykgLxI0',
            'func': 'pkg_xulyhocvu_thongtin.Them_XLHV_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLHV_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiDung_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    req_PhanCong_Xoa: function (strGiangVien_Id) {
        var obj_save = {
            'action': 'XLHV_ThongTin_MH/GS4gHhkNCRceCiQJLiAiKR4PKSAvEjQP',
            'func': 'pkg_xulyhocvu_thongtin.Xoa_XLHV_KeHoach_NhanSu',
            'iM': edu.system.iM,
            'strIds': strGiangVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },

    genTable_PhanCong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_PhanCong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TENDAYDU"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}