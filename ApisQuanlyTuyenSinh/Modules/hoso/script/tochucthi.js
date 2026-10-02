/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function ToChucThi() { };
ToChucThi.prototype = {
    dtDSThi: [],
    strDSThi_Id: '',

    init: function () {

        var me = this;
        me.getList_KeHoachTuyenSinh();
        me.getList_Nam();
        me.getList_LoaiDanhSachThi();
        me.getList_ThoiGianDaoTao();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            me.getList_DotDoiTuong();
            me.getList_HinhThuc();
            me.getList_MonThi();
        });
        $("#dropSearch_Dot").on("select2:select", function () {
            me.getList_MonThi();
        }); $("#dropSearch_HinhThuc").on("select2:select", function () {
            me.getList_MonThi();
        });
        $("#dropMonThiTuChon").on("select2:select", function () {
            me.getList_SinhVienChuaLap();
        });
        $("#dropMonThiTuDong").on("select2:select", function () {
            me.getList_SinhVienChuaLapView();
        });
        $("#btnAddDanhSachTuDong").click(function () {
            var temp = $("#dropSearch_KeHoach").val() ? $("#dropSearch_KeHoach option:selected").text() : "";
            $(".lblKeHoach").html(temp);
            temp = $("#dropSearch_HinhThuc").val() ? $("#dropSearch_HinhThuc option:selected").text() : "";
            $(".lblHinhThuc").html(temp);
            temp = $("#dropSearch_Dot").val() ? $("#dropSearch_Dot option:selected").text() : "";
            $(".lblDot").html(temp);
            temp = $("#dropSearch_LoaiDanhSachThi").val() ? $("#dropSearch_LoaiDanhSachThi option:selected").text() : "";
            $(".lblLoaiDanhSach").html(temp);

            me.toggle_form_taotudong();
        });
        $("#btnAddDanhSachTuChon").click(function () {
            var temp = $("#dropSearch_KeHoach").val() ? $("#dropSearch_KeHoach option:selected").text() : "";
            $(".lblKeHoach").html(temp);
            temp = $("#dropSearch_HinhThuc").val() ? $("#dropSearch_HinhThuc option:selected").text() : "";
            $(".lblHinhThuc").html(temp);
            temp = $("#dropSearch_Dot").val() ? $("#dropSearch_Dot option:selected").text() : "";
            $(".lblDot").html(temp);
            temp = $("#dropSearch_LoaiDanhSachThi").val() ? $("#dropSearch_LoaiDanhSachThi option:selected").text() : "";
            $(".lblLoaiDanhSach").html(temp);

            me.toggle_form_taotuchon();
            me.getList_MonThi();
        });
        $("#tblToChucThi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form_danhsachthi();
                me.strDSThi_Id = strId;
                var aData = me.dtDSThi.find(e => e.ID === me.strDSThi_Id);
                me.getList_SinhVienDaThem();
                me.getList_SinhVienChuaThem();
                $("#lblDanhSachThi").html(aData.TEN + " - " + aData.DAOTAO_HOCPHAN_TEN + " - " + aData.DAOTAO_THOIGIANDAOTAO);
                edu.util.setOne_BgRow(strId, "tblToChucThi");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DSThi();
            }
        });
        $(".btnSearch").click(function () {
            me.getList_DSThi();
        });
        $("#btnSaveTaoTuDong").click(function (e) {
            me.save_TaoTuDong();
        });
        $("#btnSaveTaoTuChon").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThiSinhChuaLap", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            me.save_TaoTuChon(arrChecked_Id.toString());
        });

        $("#chkSelectAllThiSinhChuaLap").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThiSinhChuaLap" });
        });
        $("#chkSelectAllThiSinhDaThem").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThiSinhDaThem" });
        });
        $("#chkSelectAllThiSinhChuaThem").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThiSinhChuaThem" });
        });

        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblToChucThi" });
        });
        $("#btnDeleteDSThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThiSinhDaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NguoiThi(arrChecked_Id[i]);
                }
            });
        });
        $("#btnAddThiSinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThiSinhChuaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_NguoiThi(arrChecked_Id[i]);
                }
            });
        });

        $("#btnTaoSoBaoDanh").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblToChucThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                return;
            }
            arrChecked_Id.forEach(e => me.save_LapSoBaoDanh(e));
        });
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ToChucThi");
    },
    toggle_form_taotudong: function () {
        edu.util.toggle_overide("zone-bus", "zone_taotudong");
    },
    toggle_form_taotuchon: function () {
        edu.util.toggle_overide("zone-bus", "zone_taotuchon");
    },
    toggle_form_danhsachthi: function () {
        edu.util.toggle_overide("zone-bus", "zone_danhsachthi");
    },


    save_TaoTuDong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_ThongTin_Chung/LayDSThiTuDong',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HocPhan_Ids': edu.util.getValById('dropMonThiTuDong'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSachThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianTuDong'),
            'strQuyTacSinhSoBaoDanh_Id': edu.util.getValById('dropQuyTacTuDong'),
            'dSoThiSinh_DanhSach': edu.util.getValById('txtSoThiSinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
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
                    me.toggle_notify();
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DSThi();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_TaoTuChon: function (strTS_ThiSinh_Dot_DT_Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_ThongTin_Chung/LayDSThiThuCong',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMaDanhSach': edu.util.getValById('txtMaDanhSach'),
            'strTenDanhSach': edu.util.getValById('txtTenDanhSach'),
            'strDaoTao_HocPhan_Ids': edu.util.getValById('dropMonThiTuChon'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSachThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianTuChon'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropMonThiTuChon'),
            'strTS_ThiSinh_Dot_DT_Ids': strTS_ThiSinh_Dot_DT_Ids,
            'strQuyTacSinhSoBaoDanh_Id': edu.util.getValById('dropQuyTacTuChon'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
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
                    //var arrChecked_Id = edu.util.getArrCheckedIds("tblThiSinhChuaThem", "checkX");
                    //me.strDSThi_Id = strKeHoachXuLy_Id;
                    ////if (arrChecked_Id.length == 0) {
                    ////    edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
                    ////    return;
                    ////}
                    //edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
                    //$("#btnYes").click(function (e) {
                    //    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    //    edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                    //    for (var i = 0; i < arrChecked_Id.length; i++) {
                    //        me.save_NguoiThi(arrChecked_Id[i]);
                    //    }
                    //});
                    me.toggle_notify();
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DSThi();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_SinhVienChuaLap: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThongTin_Chung/LayDSTS_ThiSinh_Dot_DoiTuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDiem_DanhSachHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Ids': edu.util.getValById('dropMonThiTuChon'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVienChuaLap(dtResult, iPager);
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
    genTable_SinhVienChuaLap: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThiSinhChuaLap",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ToChucThi.getList_SinhVienChuaLap()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 9],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MAHOSO"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_HODEM"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_CMT_SO"
                },
                {
                    "mDataProp": "DOITUONGDUTUYEN_TEN"
                },
                {
                    "mDataProp": "DOTTUYENSINH_TEN"
                },
                {
                    "mDataProp": "DSNGUYENVONGTHEOKEHOACH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                        //return '<input type="checkbox" id="checkX' + aData.TS_HOSODUTUYEN_ID + '" name="' + aData.ID + '" />';
                    }
                }
            ]
        };

        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },

    getList_SinhVienChuaLapView: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThongTin_Chung/LayDSTS_ThiSinh_Dot_DoiTuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDiem_DanhSachHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Ids': edu.util.getValById('dropMonThiTuDong'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVienChuaLapView(dtResult, iPager);
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
    genTable_SinhVienChuaLapView: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThiSinhChuaLapView",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ToChucThi.getList_SinhVienChuaLapView()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 9],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MAHOSO"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_HODEM"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_CMT_SO"
                },
                {
                    "mDataProp": "DOITUONGDUTUYEN_TEN"
                },
                {
                    "mDataProp": "DOTTUYENSINH_TEN"
                },
                {
                    "mDataProp": "DSNGUYENVONGTHEOKEHOACH"
                }
            ]
        };

        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    getList_DSThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_Hoc/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strTrangThai_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSachThi'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtDSThi = dtResult;
                    me.genTable_DSThi(dtResult, iPager);
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
    genTable_DSThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblToChucThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ToChucThi.getList_DSThi()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4, 5],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    /*------------------------------------------
  --Discription: [4]  ACESS DB ==> he dao tao
  --Author: duyentt
  -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_HeDaoTao/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    //me.dtHeDaoTao= dtResult;
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_KhoaDaoTao/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    //me.dtKhoaDaoTao = dtResult;
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_Nam: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGenCombo_Nam(dtResult, iPager);
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
    cbGenCombo_Nam: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAM",
                parentId: "",
                name: "NAM",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Nam"],
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachTuyenSinh: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.system.userId,
            'strNam': edu.util.getValById('dropSearch_Nam'),
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtKeHoachTuyenSinh = dtResult;
                    me.genCombo_KeHoachTuyenSinh(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoachTuyenSinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DotDoiTuong: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DoiTuong/LayDSTS_Dot',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genCombo_DotDoiTuong(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DotDoiTuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DOTTUYENSINH_ID",
                parentId: "",
                name: "DOTTUYENSINH_TEN",
            },
            renderPlace: ["dropSearch_Dot"],
            title: "Chọn đợt đối tượng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HinhThuc: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DoiTuong/LayDSTS_DoiTuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genCombo_HinhThuc(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HinhThuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DOITUONGDUTUYEN_ID",
                parentId: "",
                name: "DOITUONGDUTUYEN_TEN",
            },
            renderPlace: ["dropSearch_HinhThuc"],
            title: "Chọn hình thức"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_LoaiDanhSachThi: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThongTin_Chung/LayLoaiDanhSachThi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genCombo_LoaiDanhSachThi(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LoaiDanhSachThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_LoaiDanhSachThi"],
            title: "Chọn loại danh sách thi"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_MonThi: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_TuyenSinhChung/LayDSMonThiTuyen',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genCombo_MonThi(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_MonThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropMonThiTuDong", "dropMonThiTuChon"],
            title: "Chọn môn thi"
        };
        edu.system.loadToCombo_data(obj);
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.ToChucThi;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianTuDong", "dropThoiGianTuChon"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_SinhVienDaThem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_Hoc/LayDSNguoiHocTheoDanhSach',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': me.strDSThi_Id,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVienDaThem(dtResult, iPager);
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
    genTable_SinhVienDaThem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThiSinhDaThem",
            aaData: data,
            colPos: {
                center: [0],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mDataProp": "MASONGUOIHOC"
                },
                {
                    "mDataProp": "HODEMNGUOIHOC"
                },
                {
                    "mDataProp": "TENNGUOIHOC"
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "CMTND_SO"
                },
                {
                    "mDataProp": "DOITUONGDUTUYEN_TEN"
                },
                {
                    "mDataProp": "DOTTUYENSINH_TEN"
                },
                {
                    "mDataProp": "NGUYENVONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };

        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },

    getList_SinhVienChuaThem: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThongTin_Chung/LayDSTS_ThiSinh_Dot_DoiTuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDiem_DanhSachHoc_Id': me.strDSThi_Id,
            'strDaoTao_HocPhan_Ids': '',
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVienChuaThem(dtResult, iPager);
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
    genTable_SinhVienChuaThem: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThiSinhChuaThem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ToChucThi.getList_SinhVienChuaThem()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MAHOSO"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_HODEM"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "TS_HOSODUTUYEN_CMT_SO"
                },
                {
                    "mDataProp": "DOITUONGDUTUYEN_TEN"
                },
                {
                    "mDataProp": "DOTTUYENSINH_TEN"
                },
                {
                    "mDataProp": "DSNGUYENVONGTHEOKEHOACH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.TS_HOSODUTUYEN_ID + '" name="' + aData.ID + '" />';
                    }
                }
            ]
        };

        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    
    save_NguoiThi: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_NguoiHoc/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strDiem_DanhSachHoc_Id': me.strDSThi_Id,
            'strNguonDuLieu_Id': $("#checkX" + strQLSV_NguoiHoc_Id).attr("name"),
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
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
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVienChuaThem();
                    me.getList_SinhVienDaThem();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_NguoiThi: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_NguoiHoc/Xoa',
            'type': 'POST',
            'strDiem_DanhSach_NguoiHoc_Id': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVienChuaThem();
                    me.getList_SinhVienDaThem();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_LapSoBaoDanh: function (strDiem_DanhSachHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_ThongTin_Chung/LapSoBaoDanhChoDanhSach',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strDiem_DanhSachHoc_Id,
            'strQuyTacSinhSoBaoDanh_Id': edu.util.getValById('dropAAAA'),
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
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
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_SinhVienChuaThem();
                //    me.getList_SinhVienDaThem();
                //});
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
};