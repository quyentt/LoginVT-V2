/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function SoTinKeHoach() { };
SoTinKeHoach.prototype = {
    strSoTinKeHoach_Id: '',
    dtSoTinKeHoach: [],

    init: function () {
        var me = this;
        me._attachExport();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        //me.getList_SoTinKeHoach();
        me.getList_QuyHocBong();
        me.getList_ThoiGian();
        //me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("HB.QUYTAC.TINHSOTINCHITOITHIEU", "dropQuyTacKhoiTao");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        
        $("#btnXoaSoTinKeHoach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblSoTinKeHoach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SoTinKeHoach(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_SoTinKeHoach();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SoTinKeHoach();
            }
        });

        $("#btnSave_SoTinKeHoach").click(function () {
            // các dòng đã sửa số tín so với giá trị đang lưu (thuộc tính name của ô nhập)
            var arrThem = [], map = {};
            (me.dtSoTinKeHoach || []).forEach(function (r) { map[r.ID] = r; });
            $(".inputxau").each(function () {
                var point = this;
                if ($(point).val() != $(point).attr("name")) {
                    var strId = point.id.split('_')[1];
                    arrThem.push({ ID: strId, row: map[strId] || {}, cu: $(point).attr("name"), moi: $(point).val() });
                }
            });
            if (!arrThem.length) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            me._run({
                title: "Lưu số tín tối thiểu của kế hoạch", unit: "dòng", fileName: "KetQuaLuuSoTinKeHoach", items: arrThem,
                columns: [
                    { header: "Phạm vi áp dụng", render: function (it) { return it.row.PHAMVIAPDUNG_TEN || it.ID; } },
                    { header: "Phân cấp", render: function (it) { return it.row.PHANCAPPHAMVI_TEN; } },
                    { header: "Thời gian", render: function (it) { return it.row.THOIGIAN; } },
                    { header: "Số tín cũ", render: function (it) { return it.cu; } },
                    { header: "Số tín mới", render: function (it) { return it.moi; } }
                ],
                request: function (it) { return me.req_SoTinKeHoach_Sua(it.ID); },
                refresh: function () { me.getList_SoTinKeHoach(); }
            });
        });
        // Khởi tạo: 1 lệnh cho cả quỹ / thời gian / quy tắc đang chọn (form tiến trình chung, Bước 1 hiện điều kiện áp dụng)
        $("#btnKhoiTao").click(function () {
            if (!edu.process) { me._run({}); return; }
            var notes = [];
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_QuyHocBong"))) notes.push("Chưa chọn quỹ học bổng.");
            if (!edu.util.checkValue(edu.util.getValById("dropQuyTacKhoiTao"))) notes.push("Chưa chọn quy tắc khởi tạo.");
            edu.process.runJob({
                title: "Khởi tạo số tín tối thiểu", what: "Khởi tạo dữ liệu số tín tối thiểu theo điều kiện đang chọn", fileName: "KetQuaKhoiTaoSoTin", notes: notes,
                filters: [[{ label: "Quỹ học bổng", id: "dropSearch_QuyHocBong" }, { label: "Thời gian", id: "dropSearch_ThoiGian" }, { label: "Quy tắc khởi tạo", id: "dropQuyTacKhoiTao" }]],
                request: function () { return me.req_KhoiTao(); },
                refresh: function () { me.getList_SoTinKeHoach(); }
            });
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyHocBong: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_HB_ThongTin_MH/DSA4BRIJAx4QNDgJLiIDLi8m',
            'func': 'pkg_hocbong_thongtin.LayDSHB_QuyHocBong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_QuyHocBong(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_QuyHocBong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_QuyHocBong"],
            title: "Chọn quỹ học bổng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_HB_Chung_MH/DSA4BRIVKS4oBiggLxUpJC4KJAkuICIp',
            'func': 'pkg_hocbong_chung.LayDSThoiGianTheoKeHoach',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_ThoiGian(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    req_SoTinKeHoach_Sua: function (strId) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_HB_ThongTin_MH/EjQgHgkDHhA0OAUoLykeEi4VKC8FIC8mCjgP',
            'func': 'pkg_hocbong_thongtin.Sua_HB_QuyDinh_SoTinDangKy',
            'iM': edu.system.iM,
            'strId': strId,
            'dSoQuyDinh': edu.system.getValById('txtSoTin_' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    // Yêu cầu khởi tạo dữ liệu số tín tối thiểu theo quỹ / thời gian / quy tắc đang chọn
    req_KhoiTao: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_HB_TinhToan_MH/CikuKBUgLgU0DSgkNBUoLykSLhUoLwIpKAPP',
            'func': 'pkg_hocbong_tinhtoan.KhoiTaoDuLieuTinhSoTinChi',
            'iM': edu.system.iM,
            'strHB_QuyHocBong_Id': edu.system.getValById('dropSearch_QuyHocBong'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strQuyTacTinhSoTin_Id': edu.system.getValById('dropQuyTacKhoiTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        return { action: obj_save.action, type: "POST", data: obj_save };
    },
    /*------------------------------------------
    --Discription: Chạy qua form tiến trình chung (Corei/processrun.js, edu.process): trang chỉ khai báo danh sách bản ghi
    -- + hàm dựng yêu cầu (req_*); form lo giờ bắt đầu/kết thúc, kết quả, lỗi, tổng hợp, xuất Excel.
    -------------------------------------------*/
    _run: function (cfg) {
        if (!edu.process) {
            edu.system.alert("Chưa cập nhật form tiến trình (thiếu Corei/processrun.js hoặc indexi.aspx).", "w");
            return;
        }
        if (cfg.filters === undefined) cfg.filters = [[{ label: "Quỹ học bổng", id: "dropSearch_QuyHocBong" }, { label: "Thời gian", id: "dropSearch_ThoiGian" }]];
        edu.process.run(cfg);
    },
    /*------------------------------------------
    --Discription: Nút "Xuất Excel" chuẩn chung (Corei/exportexcel.js, edu.exporter.attachTable) gắn cạnh các danh sách kết quả:
    -- xuất đúng danh sách đang xem, có tiêu đề, điều kiện lọc, dòng tổng và ngày xuất như mọi chức năng.
    -------------------------------------------*/
    _attachExport: function () {
        var me = this;
        if (!window.edu || !edu.exporter || typeof edu.exporter.attachTable !== "function") return;
        edu.exporter.attachTable({
            table: "tblSoTinKeHoach", before: "#btnSave_SoTinKeHoach", fileName: "SoTinToiThieuKeHoach", title: "SỐ TÍN TỐI THIỂU CỦA KẾ HOẠCH",
            filters: [[{ label: "Quỹ học bổng", id: "dropSearch_QuyHocBong" }, { label: "Thời gian", id: "dropSearch_ThoiGian" }]]
        });
    },
    getList_SoTinKeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_HB_ThongTin_MH/DSA4BRIJAx4QNDgFKC8pHhIuFSgvAiko',
            'func': 'pkg_hocbong_thongtin.LayDSHB_QuyDinh_SoTinChi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
            'strHB_QuyHocBong_Id': edu.system.getValById('dropSearch_QuyHocBong'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSoTinKeHoach = dtReRult;
                    me.genTable_SoTinKeHoach(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SoTinKeHoach: function (data, iPager) {
        $("#lblSoTinKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblSoTinKeHoach",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.SoTinKeHoach.getList_SoTinKeHoach()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "PHANCAPPHAMVI_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoTin_' + aData.ID + '" class="form-control inputxau" value="' + edu.util.returnEmpty(aData.SOQUYDINH) + '" name="' + edu.util.returnEmpty(aData.SOQUYDINH) + '"/>';
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