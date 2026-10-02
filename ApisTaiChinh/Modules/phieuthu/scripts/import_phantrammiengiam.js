/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 20/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function Import_PhanTramMien() { };
Import_PhanTramMien.prototype = {
    objParam_KH: '',
    dtImport: null,
    dtPhaiNop: [],
    strPath: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.getList_DaImport();
        me.getList_KhoanThu();
        me.getList_MaThongTin();
        me.getList_ThoiGianDaoTao();
        me.getList_MauImport();
        me.getList_KieuHoc();
        /*------------------------------------------
        --Discription: Load Select 
        -------------------------------------------*/
        //edu.system.rootPath = "http://localhost:49806/";
        $("#btnImport_PTM").click(function (e) {
            var urlfile = $("#uploadFile_PTM").val();
            if (urlfile == "" || urlfile == null || urlfile == undefined) {
                edu.system.alert("Vui lòng chọn file trước khi thực hiện import dữ liệu!");
                return false;
            }
            var strSheet = $("#dropDataSheet").val();
            if (strSheet == "" || strSheet == null || strSheet == undefined) {
                edu.system.alert("Vui lòng chọn sheet trước khi thực hiện import dữ liệu!");
                return false;
            }
            var strMau = $("#dropMauImport").val();
            if (strMau == "" || strMau == null || strMau == undefined) {
                edu.system.alert("Vui lòng chọn mẫu import trước khi thực hiện import dữ liệu!");
                return false;
            }
            var rowHienThi = "";
            rowHienThi += "Học kỳ import: <span style='color: red'>" + getNameInSelect("dropThoiGianDaoDao_PTM") + "</span>";
            rowHienThi += "<br/>Import cho khoản phí: <span style='color: red'>" + getNameInSelect("dropLoaiKhoanThu_PTM") + "</span>";
            rowHienThi += "<br/><span style='color: red'>" + getNameInSelect("dropChuyenKeToan_PTM") + "</span>" + " thực hiện hạch toán";
            rowHienThi += "<br/>Loại kiểm tra: <span style='color: red'>" + getNameInSelect("dropKiemTra_PTM") + "</span>";
            rowHienThi += "<br/>Kiểu học: <span style='color: red'>" + edu.util.getValById("dropKieuHoc_PTM") + "</span>";
            rowHienThi += "<br/>Ngày giao dịch: <span style='color: red'>" + edu.util.getValById("txtSearch_CongNo_PTM") + "</span>";
            rowHienThi += "<br/>Mã đợt import: <span style='color: red'>" + edu.util.getValById("txtSearch_MaDotImport_PTM") + "</span>";
            rowHienThi += "<br/>Chú ý: Học kỳ và khoản thu bắt buộc phải chọn ?";
            rowHienThi += "<br/>Bạn có chắc chắn muốn import không ?";
            edu.system.confirm(rowHienThi);
            $("#btnYes").click(function (e) {
                me.import_PhaiNop();
            });
        });
        //$("#dropDataSheet").on("select2:select", function () {
        //    var x = edu.util.getValById("dropDataSheet");
        //    me.dtPhaiNop = me.dtImport[x];
        //    me.genTable_Import(me.dtPhaiNop, "tblImport");
        //    edu.system.switchTab("tab_2");
        //});

        $(".btnSearchDaImport").click(function () {
            me.getList_DaImport();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DaImport();
            }
        });
        $("[id$=chkSelectAll_Import]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDaImport" });
        });
        $("#btnChuyenKeToan").click(function () {
            edu.util.ActionInCheckedIds("tblDaImport", "checkImport", me.save_ChuyenKeToan, "chuyển kế toán");
            //if (arrTable_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn dữ liệu cần chuyển kế toán?");
            //    return;
            //}
            //edu.system.confirm("Bạn có chắc chắn muốn chuyển kế toán <span style='color: red'>" + arrTable_Id.length + "</span> dữ liệu không ?");
            //$("#btnYes").click(function (e) {
            //    for (var i = 0; i < arrTable_Id.length - 1; i++) {
            //        me.save_ChuyenKeToan(arrTable_Id[i], false);
            //    }
            //    me.save_ChuyenKeToan(arrTable_Id[arrTable_Id.length - 1], true);
            //});
        });
        $("#btnRefresh").click(function () {
            me.getList_DaImport();
        })
        $("#btnDelete").click(function () {
            edu.util.ActionInCheckedIds("tblDaImport", "checkImport", me.delete_DaImport, "xóa");
            //if (arrTable_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn dữ liệu cần xóa?");
            //    return;
            //}
            //edu.system.confirm("Bạn có chắc chắn muốn xóa <span style='color: red'>" + arrTable_Id.length + "</span> dữ liệu không ?");
            //$("#btnYes").click(function (e) {
            //    for (var i = 0; i < arrTable_Id.length - 1; i++) {
            //        me.delete_DaImport(arrTable_Id[i], false);
            //    }
            //    me.delete_DaImport(arrTable_Id[arrTable_Id.length - 1], true);
            //});
        });
        /*------------------------------------------
        --Discription: Loadfile
        -------------------------------------------*/
        edu.system.uploadImport(["uploadFile_PTM"]);
        $("#btnDocFile").click(function () {
            var urlfile = $("#uploadFile_PTM").val();
            if (urlfile == "" || urlfile == null || urlfile == undefined) {
                edu.system.alert("Vui lòng chọn file trước khi thực hiện import dữ liệu!");
                return false;
            }
            main_doc.Import_PhanTramMien.getList_DataImport();
        });
        $("#btnHienThiDuLieu").click(function () {
            var strSheet = $("#dropDataSheet").val();
            if (strSheet == "" || strSheet == null || strSheet == undefined) {
                edu.system.alert("Vui lòng chọn sheet trước khi thực hiện import dữ liệu!");
                return false;
            }
            me.dtPhaiNop = me.dtImport[strSheet];
            me.genTable_Import_View(me.dtPhaiNop, "tblImport");
            edu.system.switchTab("tab_2");
        });
        function getNameInSelect(strDropId) {
            var x = edu.util.getValById(strDropId);
            if (edu.util.checkValue(x)) {
                return $("#" + strDropId + " option:selected").text();
            }
            return "";
        }

        $("#btnExport_ThanhCong").click(function (e) {
            me.report_Data("ImportThanhCong", "tblImport_ThanhCong", [0, 1, 2, 3, 4]);
        });
        $("#btnExport_Loi").click(function (e) {
            me.report_Data("ImportThatBai", "tblImport_ThatBai");
        });
        $("#btnTaiFileMau").click(function (e) {
            var url_report = $("#dropMauImport option:selected").attr("name");
            location.href = url_report;
        });
        $("#tblDaImport").delegate('input', 'click', function (e) {
            var x = $(this);
            var point = this;
            this.classList.add("btn-lg");
            x.attr("data-loading-text", "<i class='fa fa-spinner fa-spin '></i>");
            x.button('loading');
            setTimeout(function () { x.button('reset'); point.classList.remove("btn-lg") }, 500);
        });
        /*------------------------------------------
        --Discription: Loadfile
        -------------------------------------------*/
        $("#btnSearchDaImport_DaHachToan").click(function () {
            me.getList_DaHachToan();
        });
        $("#txtSearch_TuKhoa_DaHachToan").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DaHachToan();
            }
        });
        $("[id$=chkSelectAll_DaHachToan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDaImport_DaHachToan" });
        });
        $("#btnSave_DaHachToan").click(function () {
            edu.util.ActionInCheckedIds("tblDaImport_DaHachToan", "checkImport", me.save_ChuyenKeToan, "chuyển kế toán");
        });
        $("#btnRefresh_DaHachToan").click(function () {
            me.getList_DaImport();
        });
        $("#btnDelete_DaHachToan").click(function () {
            edu.util.ActionInCheckedIds("tblDaImport_DaHachToan", "checkImport", me.delete_DaImport, "xóa");
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/

    getList_DaImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_Import_PhanTramMienGiam/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': "",
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropSearch_LoaiKhoan"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_HocKy"),
            'strDaoTao_CoSoDaoTao_id': edu.util.getValById("dropSearch_CoSoDaoTao"),
            'strQLSV_NguoiHoc_Id': "",
            'dDaChuyenKeToan': 0,
            'strThongTinImport': edu.util.getValById("dropSearch_MaDotImport"),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropSearch_KieuHoc"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_DaImport(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DaHachToan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TC_Import_PhanTramMienGiam/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': "",
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropSearch_LoaiKhoan"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_HocKy"),
            'strDaoTao_CoSoDaoTao_id': edu.util.getValById("dropSearch_CoSoDaoTao"),
            'strQLSV_NguoiHoc_Id': "",
            'dDaChuyenKeToan': 0,
            'strThongTinImport': edu.util.getValById("dropSearch_MaDotImport"),
            'strDiem_KieuHoc_Id': edu.util.getValById("dropSearch_KieuHoc"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_DaHachToan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DataImport: function () {
        var me = main_doc.Import_PhanTramMien;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import/getDataFormFileImport',
            'versionAPI': 'v1.0',

            'strPath': edu.util.getValById("uploadFile_PTM")
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var arrSheet = [data.Id];
                    if (edu.util.checkValue(data.Id)) {
                        if (data.Id.includes("$")) {
                            arrSheet = data.Id.split("$");
                        }
                    }
                    else { return; }
                    me.dtImport = data.Data;
                    var html = "";
                    for (var i = 0; i < arrSheet.length; i++) {
                        html += "<option value='Table" + (i + 1) + "'>" + arrSheet[i] + "</option>";
                    }
                    $("#dropDataSheet").html(html);
                    $("#dropDataSheet").select2();
                    //me.dtPhaiNop = data.Data["Table1"];
                    //me.genTable_Import(data.Data["Table1"], "tblImport");//Table1 tương ứng với vị trí đầu mảng
                    //edu.system.switchTab("tab_2");
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    import_PhaiNop: function () {
        var me = this;
        var iChiSoImport = $("#dropMauImport option:selected").attr("title");
        if (iChiSoImport == undefined) iChiSoImport = "0";
        var obj_save = {
            'action': 'TC_Import_PhanTramMienGiam/Import',
            'versionAPI': 'v1.0',
            'strPath': edu.util.getValById("uploadFile_PTM"),
            'strSheetName': $("#dropDataSheet option:selected").text(),
            'dChuyenKeToan': edu.util.getValById("dropChuyenKeToan_PTM"),
            'dNganh1_2': "1",
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById("dropLoaiKhoanThu_PTM"),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropThoiGianDaoDao_PTM"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById("dropCoSoDaoTao_PTM"),
            'strThongTinImport': edu.util.getValById("txtSearch_MaDotImport_PTM"),
            'strNgayGiaoDich': edu.util.getValById("txtSearch_CongNo_PTM"),
            'dCheDoKiemTraDuLieu': edu.util.getValById("dropKiemTra_PTM"),
            'strNguoiThucHien_Id': edu.system.userId,
            'strKieuHoc_Id': edu.util.getValById("dropKieuHoc_PTM"),
            'strMaImport': edu.util.getValById("dropMauImport"),//"MAUIMPORT_KHOANDANOP_DHLUAT_01",//edu.util.getValById("dropMauImport"),
            'iChiSoImport': iChiSoImport,
        }
        
        if (obj_save.strDaoTao_ThoiGianDaoTao_Id == "" || obj_save.strTaiChinh_CacKhoanThu_Id == "" || obj_save.strNguoiThucHien_Id == "" || obj_save.strMaImport == "") {
            edu.system.alert("Bạn cần chọn thời gian, khoản thu và mẫu import!");
            return;
        }

        $("#zoneFileDinhKemuploadFile_PTM ul").html('');
        $("#dropDataSheet").html('<option value="">-- Bạn cần chọn sheet dữ liệu để import--</option>');
        $("#dropDataSheet").select2();
        $("#uploadFile_PTM").val();
        me.genTable_Import([], "tblImport");

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading();
                if (data.Success) {
                    if (data.Data.Table2.length > 0) {
                        edu.system.switchTab("tab_4");
                        $("#tblImport_ThatBai_Tong").html(data.Data.Table2.length);
                    }
                    else {
                        edu.system.switchTab("tab_3");
                    }
                    me.genTable_Import(data.Data.Table1, "tblImport_ThanhCong");
                    me.genTable_Import_View(data.Data.Table2, "tblImport_ThatBai");
                    obj_notify = {
                        type: "s",
                        content: "Thực hiện import hoàn tất. Hãy kiểm tra thông tin",
                    }
                    edu.system.afterComfirm(obj_notify);
                    me.getList_DaImport();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                obj_notify = {
                    type: "w",
                    content: "er_ " + JSON.stringify(er),
                }
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_DaImport: function (Ids, bcheck) {
        var me = main_doc.Import_PhanTramMien;
        //--Edit
        var obj_delete = {
            'action': 'TC_Import_PhanTramMienGiam/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (bcheck == true) {
                    //    setTimeout(function () {
                    //        me.getList_DaImport();
                    //    }, 500);
                    //    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                    //}
                }
                else {
                    var strPreAlert = $("#checkImport" + Ids).attr("title");
                    edu.system.alert(strPreAlert + data.Message);
                }
                if (bcheck == true) {
                    edu.system.endLoading();
                    setTimeout(function () {
                        me.getList_DaImport();
                        me.getList_DaHachToan();
                    }, 500);
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.afterComfirm(er);
                if (bcheck == true) {
                    edu.system.endLoading();
                    setTimeout(function () {
                        me.getList_DaImport();
                        me.getList_DaHachToan();
                    }, 500);
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_Import_View: function (data, strTable) {
        var row = "";
        row += '<tr>';
        for (var x in data[0]) {
            row += '<td>' + edu.util.returnEmpty(x) + '</td>';
        }
        row += '</tr>';
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
            }
            row += '</tr>';
        }
        $("#" + strTable +" tbody").html(row);
    },
    genTable_Import: function (data, strTable) {
        edu.util.viewHTMLById(strTable + "_Tong", data.length);
        var jsonForm = {
            strTable_Id: strTable,
            aaData: data,
            colPos: {
                center: [0, 1, 2, 3, 4, 5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                }
                , 
                {
                    "mData": "FULLNAME",

                    "mRender": function (row, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (row, aData) {
                        return edu.util.formatCurrency(aData.PHANTRAMMIEN);
                    }
                },
                {
                    "mDataProp": "QLSV_DOITUONG_TEN"
                }
                , {
                    "mDataProp": "NOIDUNG"
                }
            ]
        };
        if (strTable == "tblImport_ThatBai") jsonForm.aoColumns.push({
            "mDataProp": "NOIDUNGLOI"
        })
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
    },
    genTable_DaImport: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("tblDaImport_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDaImport",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Import_PhanTramMien.getList_DaImport()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                }
                , 
                {
                    "mData": "FULLNAME",
                    "mRender": function (row, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (row, aData) {
                        return edu.util.formatCurrency(aData.PHANTRAMMIENGIAM);
                    }
                },
                {
                    "mDataProp": "QLSV_DOITUONG_TEN"
                }
                , {
                    "mDataProp": "NOIDUNG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkImport' + aData.ID + '" title="' + aData.MASO + ': ' + aData.PHANTRAMMIENGIAM +'">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //me.report_Data("DataInData", "tblDaImport", [0, 1, 2, 3, 4]);
    },
    genTable_DaHachToan: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("tblImport_DaHachToan_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDaImport_DaHachToan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.Import_PhanTramMien.getList_DaHachToan()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0, 1, 2, 3, 4, 5, 6, 7]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                }
                ,
                {
                    "mData": "FULLNAME",
                    "mRender": function (row, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                }
                , {
                    "mData": "SOTIEN",
                    "mRender": function (row, aData) {
                        return '<input id="txtSoTien_DaHachToan' + aData.ID + '" class="form-control" value="' + aData.PHANTRAMMIENGIAM + '" />';
                    }
                }
                , {
                    "mData": "NOIDUNG",
                    "mRender": function (row, aData) {
                        return '<input id="txtNoiDung_DaHachToan' + aData.ID + '" class="form-control" value="' + aData.NOIDUNG + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkImport' + aData.ID + '" title="' + aData.MASO + ': ' + aData.PHANTRAMMIENGIAM + '">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //me.report_Data("DataInData", "tblDaImport", [0, 1, 2, 3, 4]);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
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
            renderPlace: ["dropSearch_HocKy", "dropThoiGianDaoDao_PTM"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KhoanThu: function () {
        var me = main_doc.Import_PhanTramMien;

        //--Edit
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': "",
            'strNhomCacKhoanThu_Id': "",
            'strNguoiTao_Id': "",
            'strcanboquanly_id': "",
            'pageIndex': 1,
            'strNguoiThucHien_Id': '',
            'pageSize': 10000
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_KhoanThu(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
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
            renderPlace: ["dropSearch_LoaiKhoan", "dropLoaiKhoanThu_PTM"],
            type: "",
            title: "Chọn loại khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_KieuHoc: function (resolve, reject) {
        var me = this;
        var strMaBangDanhMuc = "KHDT.DIEM.KIEUHOC";

        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': strMaBangDanhMuc
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
                    me.genComBo_KieuHoc(data.Data);
                    me.dtKieuHoc = data.Data;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    genComBo_KieuHoc: function (data) {
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
            renderPlace: ["dropKieuHoc_PTM", "dropSearch_KieuHoc"],
            type: "",
            title: "Chọn kiểu học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ChuyenPhong
    -------------------------------------------*/
    save_ChuyenKeToan: function (strNguonDuLieu_Id, bcheck) {
        var me = main_doc.Import_PhanTramMien;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_Import_PhanTramMienGiam/ChuyenDuLieu_DoiTuong_MG_Imp',
            'versionAPI': 'v1.0',
            'strNguonDuLieu_Id': strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (bcheck == true) {
                    //    setTimeout(function () {
                    //        me.getList_DaImport();
                    //    }, 500);
                    //    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                    //}
                    //edu.system.alert(strPreAlert + "Chuyển thành công");
                }
                else {
                    
                    var strPreAlert = $("#checkImport" + strNguonDuLieu_Id).attr("title");
                    edu.system.alert(strPreAlert + data.Message);
                }
                if (bcheck == true) {
                    setTimeout(function () {
                        me.getList_DaImport();
                    }, 500);
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            error: function (er) {
                edu.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er.Message,
                }
                edu.system.alertOnModal(obj_notify);
                if (bcheck == true) {
                    edu.system.endLoading();
                    setTimeout(function () {
                        me.getList_DaImport();
                    }, 500);
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_HoachToan: function (strNguonDuLieu_Id, bcheck) {
        var me = main_doc.Import_PhanTramMien;
        var obj_notify = {};
        var strSoTien = $("#txtSoTien_DaHachToan" + strNguonDuLieu_Id).val();
        var strNoiDung = $("#txtNoiDung_DaHachToan" + strNguonDuLieu_Id).val();
        //--Edit
        var obj_save = {
            'action': 'TC_Import_PhanTramMienGiam/Sua_MG_Import_DaChuyenKT',
            'versionAPI': 'v1.0',
            'strId': strNguonDuLieu_Id,
            'strPhanTramMien': strSoTien,
            'strNoiDung': strNoiDung,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //if (bcheck == true) {
                    //    setTimeout(function () {
                    //        me.getList_DaImport();
                    //    }, 500);
                    //    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                    //}
                    //edu.system.alert(strPreAlert + "Chuyển thành công");
                }
                else {

                    var strPreAlert = $("#checkImport" + strNguonDuLieu_Id).attr("title");
                    edu.system.alert(strPreAlert + data.Message);
                }
                if (bcheck == true) {
                    setTimeout(function () {
                        me.getList_DaHachToan();
                    }, 500);
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            error: function (er) {
                edu.system.endLoading();
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er.Message,
                }
                edu.system.alertOnModal(obj_notify);
                if (bcheck == true) {
                    edu.system.endLoading();
                    setTimeout(function () {
                        me.getList_DaHachToan();
                    }, 500);
                    $('#myModalAlert #alert_content').append('<p>Thực hiện thành công. Hãy kiểm tra lại</p>');
                }
                edu.system.start_Progress("myModalAlert #alert_content");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MaThongTin: function () {
        var me = main_doc.Import_PhanTramMien;

        //--Edit
        var obj_list = {
            'action': 'TC_Import_PhanTramMienGiam/LayDSThongTinImport_DT_MG',
            'versionAPI': 'v1.0',

            'dChuaChuyenKeToan': 0
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MaThongTin(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MaThongTin: function (data) {
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
            renderPlace: ["dropSearch_MaDotImport"],
            type: "",
            title: "Chọn mã đợt import",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MauImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import_PhanQuyen/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.cbGenCombo_MauImport(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MauImport: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                Render: function (nRow, aData) {
                    return "<option id='" + aData.ID + "' value='" + aData.MAUIMPORT_MA + "' name='" + aData.MAUIMPORT_DUONGDANFILEMAU + "' title='" + aData.CHISODONGDOCDULIEUTUFILE + "'>" + aData.MAUIMPORT_TENFILEMAU + "</option>";
                }
            },
            renderPlace: ["dropMauImport"],
            type: "",
            title: "Chọn mẫu import",
        }
        edu.system.loadToCombo_data(obj);
    },
}