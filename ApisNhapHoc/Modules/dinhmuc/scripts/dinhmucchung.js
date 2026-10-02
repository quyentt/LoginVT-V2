/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 13/07/2018
--API URL: NH_DinhMuc_Chung
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DinhMucChung() { };
DinhMucChung.prototype = {
    valid_DMC: [],
    html_DMC: {},
    input_DMC: {},
    strKeHoachNhapHoc_Id: '',
    strKeHoach_TimKiem_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus-mdc", "zone_list_DMC");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-mdc", "zone_input_DMC");
        });        
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnCallModal_KeHoach_DMC").click(function () {
            me.popup_KeHoach();
        });
        $("#tbldata_KeKhoach_DMC").delegate(".slKeHoach_DMC", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/rdKeHoach_DMC/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_KeHoachNhapHoc(selected_id);
            }
        });
        /*------------------------------------------
		--Discription: [2] Action DinhMucChung
		--Author:
		-------------------------------------------*/
        $("#tbldata_DMC").delegate(".btnEditRole_DMC", "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.input_DMC.strId = selected_id;
                me.getDetail_DMC(selected_id);
            }
        });
        $("#tbldata_DMC").delegate(".chkSelectOne_DMC", "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_DMC);
        });
        $("#tbldata_DMC").delegate(".btnPopover_KhoanRieng", "click", function () {
            var selected_id = this.id;
            var obj = this;
            var arrParam = edu.util.convertStrToArr(selected_id, ",");
            if (edu.util.checkValue(arrParam)) {
                var strKeHoachNhanSu_Id = arrParam[0];
                var strLoaiKhoan_Id = arrParam[1];
                me.getList_DMR(strKeHoachNhanSu_Id, strLoaiKhoan_Id, obj);
            }
        });
        $("[id$=chkSelectAll_DMC]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_DMC);
        });
        $("#btnDelete_DMC").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_DMC);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $(document).delegate("#btnYes", "click", function (e) {
                me.delete_DMC(selected_id);
            });
            return false;
        });
        $("#btnRefresh_DMC").click(function () {
            me.getList_DMC();
        });
        $("#btnRewrite_DMC").click(function () {
            me.rewrite();
        });
        $("#btnSave_DMC").click(function () {
            var valid = true;// edu.util.checkInputForm_Valid(me.valid_DMC);
            if (valid == true) {
                if (edu.util.checkValue(me.strKeHoachNhapHoc_Id)) {
                    me.save_DMC();
                }
                else {
                    edu.system.alert("Vui lòng chọn kế hoạch nhập học!");
                }
            }
        });
        //timkiem
        $('#dropKeHoachNhapHoc_DMC').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_DMC();
        });
        $('#dropKhoanThu_Search_DMC').on('select2:select', function () {
            var strId = edu.util.getValById("dropKeHoachNhapHoc_DMC");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_DMC();
        });
        $("#btnSearch_DMC").click(function () {
            var strId = edu.util.getValById("dropKeHoachNhapHoc_DMC");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_DMC();
        });
        $("#txtKeyword_Search_DMC").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strId = edu.util.getValById("dropKeHoachNhapHoc_DMC");
                //neu chon ke hoach thi lay DMC theo ke hoach
                if (edu.util.checkValue(strId)) {
                    me.strKeHoach_TimKiem_Id = strId;
                }
                    //neu khong chon ke hoach thi lay DMC theo user
                else {
                    me.strKeHoach_TimKiem_Id = edu.system.userId;
                }
                me.getList_DMC();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-mdc", "zone_list_DMC");
        //obj, resolve, reject, callback
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        me.getList_KeHoachNhapHoc_NhanSu(obj, "", "", me.cbGenTable_KeHoachNhapHoc);
        /*------------------------------------------
		--Discription: config DinhMucChung
		-------------------------------------------*/
        me.html_DMC = {
            table_id: "tbldata_DMC",
            prefix_id: "chkSelect_DMC",
            regexp: /chkSelect_DMC/g,
            chkOne: "chkSelectOne_DMC",
            btn_edit: "btnEditRole_DMC",
        };
        me.input_DMC = {
            strTAICHINH_KeHoach: "txtKeHoach_DMC",
            strTAICHINH_KeHoach_Id: "",
            strTAICHINH_CacKhoanThu_Id: "dropKhoanThu_DMC",
            strApDungMienGiam_Id: "dropApDungMienGiam_DMC",
            dSoTien: "txtSoTien_DMC",
            iThuTu: "txtThuTu_DMC",
            strMoTa: "txtMoTa_DMC",
            iThuocTinhTuyChon: "dropThuocTinhTuyChon_DMC",
            strNguoiThucHien_Id: "",
            strId: "",

            strNguoiDung_Id_Search: "",
            strTAICHINH_KeHoach_Id_Search: "",
            strApDungMienGiam_Id_Search: "",
            strNguoiThucHien_Id_Search: "",
            strTuKhoa_Search: "",
            pageIndex_Search: "",
            pageSize_Search: "",
        };
        me.valid_DMC = [
			{ "MA": me.input_DMC.strTAICHINH_KeHoach, "THONGTIN1": "1" },
			{ "MA": me.input_DMC.strTAICHINH_CacKhoanThu_Id, "THONGTIN1": "1" },
			{ "MA": me.input_DMC.dSoTien, "THONGTIN1": "1" },
			{ "MA": me.input_DMC.iThuTu, "THONGTIN1": "1#3" },
        ];        
        me.getList_LoaiKhoan("", "");
        var strId = edu.util.getValById("dropKeHoachNhapHoc_DMC");
        //neu chon ke hoach thi lay DMC theo ke hoach
        if (edu.util.checkValue(strId)) {
            me.strKeHoach_TimKiem_Id = strId;
        }
            //neu khong chon ke hoach thi lay DMC theo user
        else {
            me.strKeHoach_TimKiem_Id = edu.system.userId;
        }
        me.getList_DMC();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_DMC.strId = "";
        me.strKeHoachNhapHoc_Id = '';
        var arrId = ["txtKeHoach_DMC", "dropKhoanThu_DMC", "dropApDungMienGiam_DMC", "txtSoTien_DMC", "txtThuTu_DMC", "dropCanDoi_DMC", "dropThuocTinhTuyChon_DMC", "txtMoTa_DMC"];
        edu.util.resetValByArrId(arrId);
        var strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_DMC");
        if (strKeHoach_Id) me.select_KeHoachNhapHoc(strKeHoach_Id);
        edu.util.viewValById("dropKhoanThu_DMC", edu.util.getValById("dropKhoanThu_Search_DMC"));
    },
    popup_KeHoach: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalKeHoach_DMC").modal("show");
    },
    /*------------------------------------------
	--Discription: [1]  ACESS DB ==> KeHoachNhanSu
    --Author:  
	-------------------------------------------*/
    /*------------------------------------------
	--Discription: [2]  ACESS DB ==> DinhMucChung
    --Author:  
	-------------------------------------------*/
    save_DMC: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_DinhMuc_Chung/ThemMoi',
            'versionAPI': 'v1.0',
            'strId': me.input_DMC.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTAICHINH_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strTAICHINH_CacKhoanThu_Id': edu.util.getValById(me.input_DMC.strTAICHINH_CacKhoanThu_Id),
            'strApDungMienGiam_Id': edu.util.getValById(me.input_DMC.strApDungMienGiam_Id),
            'strMoTa': edu.util.getValById(me.input_DMC.strMoTa),
            'dSoTien': edu.util.convertStrToNum(edu.util.getValById(me.input_DMC.dSoTien)),
            'iThuTu': edu.util.convertStrToNum(edu.util.getValById(me.input_DMC.iThuTu)),
            'dThuTu': edu.util.convertStrToNum(edu.util.getValById(me.input_DMC.iThuTu)),
            'dThuocTinhTuyChon': edu.util.getValById(me.input_DMC.iThuocTinhTuyChon),
            'dTuDongCanDoiSangPhaiNop': edu.util.getValById("dropCanDoi_DMC"),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_DinhMuc_Chung/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.input_DMC.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DMC();
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
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DMC: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_DinhMuc_Chung/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Id': edu.util.getValById("dropKhoanThu_Search_DMC"),
            'strTAICHINH_KeHoach_Id': me.strKeHoach_TimKiem_Id,
            'strApDungMienGiam_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_DMC"),
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_DMC = data.Data;
                    me.genTable_DMC(data.Data, data.Pager);
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
    getDetail_DMC: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NH_DinhMuc_Chung/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_DMC.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_DMC = data.Data;
                        me.viewForm_DMC(data.Data[0]);
                    }
                    else {
                        console.log("Lỗi ");
                    }
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
            action: obj_detail.action,
            versionAPI: obj_detail.versionAPI,
            contentType: true,
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMC: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_DinhMuc_Chung/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_DMC);
                    me.getList_DMC();
                }
                else {
                    var obj = {
                        content: data.Message,
                        code: "w"
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: JSON.stringify(er),
                    code: "w"
                }
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [3]  ACESS DB ==> DinhMucRieng
    --Author:  
	-------------------------------------------*/
    getList_DMR: function (strKeHoachNhanSu_Id, strLoaiKhoan_Id, obj) {
        var me = this;
        var obj_list = {
            'action': 'NH_DinhMuc_Rieng/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Id': strLoaiKhoan_Id,
            'strTAICHINH_KeHoach_Id': strKeHoachNhanSu_Id,
            'strApDungMienGiam_Id': "",
            'strDAOTAO_ToChucCCCT_Id': "",
            'strDoiTuongDaoTao_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.popover_DinhMucRieng_DMC(data.Data, obj);
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
    /*------------------------------------------
	--Discription: [4] ACESS DB ==> KhoanThu
    --Author:  
	-------------------------------------------*/
    getList_LoaiKhoan: function (resolve, reject) {
        var me = this;
        var strTuKhoa = "";
        var strNhomCacKhoanThu_Id = "";
        var pageIndex = 1;
        var pageSize = 100;
        var strNguoiTao_Id = "";
        var strCanBoQuanLy_Id = "";
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': strTuKhoa,
            'strNhomCacKhoanThu_Id': strNhomCacKhoanThu_Id,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strNguoiTao_Id': strNguoiTao_Id,
            'strCanBoQuanLy_Id': strCanBoQuanLy_Id
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        me.genCombo_LoaiKhoan(data.Data);
                    }
                    else {
                        me.genCombo_LoaiKhoan([]);
                    }
                }
                else {
                    edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach: " + data.Message, "w");
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
    /*------------------------------------------
	--Discription: [1] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    select_KeHoachNhapHoc: function (id) {
        var me = this;
        me.strKeHoachNhapHoc_Id = id;
        var $kehoach_ten = "tenkehoach" + id;
        var $kehoach_khoa = "khoa" + id;
        var $kehoach_thoigian = "thoigian" + id;

        var valKeHoach = edu.util.getTextById($kehoach_ten) + " (" + edu.util.getTextById($kehoach_thoigian) + ") " + edu.util.getTextById($kehoach_khoa)
        //fill into 
        edu.util.viewValById("txtKeHoach_DMC", valKeHoach);
        //notify
        var obj = {
            renderPlace: "rdKeHoach_DMC" + id,
            type: "s",
            title: "Chọn thành công!",
            autoClose: true,
        }
        edu.system.notifyLocal(obj);
    },
    cbGenTable_KeHoachNhapHoc: function (data, iPager) {
        var me = main_doc.DinhMucChung;//global variable
        me.cbGenCombo_KeHoachNhapHoc(data);
        me.objParam_KH = {
            strKhoaDaoTao_Id: "",
            strMHNhapHoc_Id: "",
            strMHApDungPhieuThu_Id: "",
            strHeThongThu_Id: "",
            strMHApDungPhieuRut_Id: "",
            strHeThongRut_Id: "",
            strTuKhoa: ""
        };
        var jsonForm = {
            strTable_Id: "tbldata_KeKhoach_DMC",
            aaData: data,
            arrClassName: [""],
            "sort": true,
            colPos: {
                left: [1],
                center: [0, 2, 3, 4],
                fix: [0, 4]
            },
            aoColumns: [
            {
                "mRender": function (nRow, aData) {
                    var strTenKeHoach = aData.TENKEHOACH;
                    return '<span id="tenkehoach' + aData.ID + '">' + strTenKeHoach + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    var strNgayBatDau = aData.NGAYBATDAU;
                    var strNgayKetThuc = aData.NGAYKETTHUC;
                    var strThoiGian = strNgayBatDau + " - " + strNgayKetThuc;
                    return '<span id="thoigian' + aData.ID + '" class="color-active">' + strThoiGian + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    var strKhoaDaoTao = edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN);
                    return '<span id="khoa' + aData.ID + '">' + strKhoaDaoTao + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    return '<a href="#" id="rdKeHoach_DMC' + aData.ID + '" name="kehoachnhanhoc" class="slKeHoach_DMC">Chọn</a>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    cbGenCombo_KeHoachNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKeHoachNhapHoc_DMC"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] Gen HTML ==> DinhMucChung
	--Author:  
	-------------------------------------------*/
    genTable_DMC: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_DMC.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhMucChung.getList_DMC()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [2],
                right: [4],
                center:[5, 6, 7],
                fix: [0]
            },
            aoColumns: [
            {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }
            , {
                "mRender": function (nRow, aData) {
                    var strMa = aData.APDUNGMIENGIAM_ID;
                    var strApDungMienGiam = "";
                    switch (strMa) {
                        case "0":
                            strApDungMienGiam = "Không áp dụng miễn giảm";
                            break;
                        case "1":
                            strApDungMienGiam = "Chỉ áp dụng miễn 100%";
                            break;
                        case "2":
                            strApDungMienGiam = "Áp dụng miễm giảm tất cả";
                            break;
                        default:
                    }
                    return '<span>' + strApDungMienGiam + '</span>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    var strMa = aData.THUOCTINHTUYCHON;
                    var strThuocTinh = "";
                    switch (strMa) {
                        case 0:
                            strThuocTinh = "Không bắt buộc";
                            break;
                        case 1:
                            strThuocTinh = "Bắt buộc";
                            break;
                        default:
                    }
                    return '<span>' + strThuocTinh + '</span>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    var dSoTien = edu.util.returnZero(aData.SOTIEN);
                    return '<span>' + edu.util.formatCurrency(dSoTien) + '</span>';
                }
            }
            , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a class="btnPopover_KhoanRieng" id="' + aData.TAICHINH_KEHOACHNHAPHOC_ID + ',' + aData.TAICHINH_CACKHOANTHU_ID + '" href="#">Chi tiết</a>';
                }
            }
            , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="' + me.html_DMC.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_DMC.prefix_id + aData.ID + '" class="' + me.html_DMC.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_DMC: function (data) {
        var me = this;
        //call popup --Edit
        me.showHide_Box("zone-bus-mdc", "zone_input_DMC");
        //view data --Edit
        me.strKeHoachNhapHoc_Id = data.TAICHINH_KEHOACHNHAPHOC_ID;
        edu.util.viewValById(me.input_DMC.strTAICHINH_KeHoach, data.TAICHINH_KEHOACHNHAPHOC_TEN);
        edu.util.viewValById(me.input_DMC.strTAICHINH_CacKhoanThu_Id, data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById(me.input_DMC.strApDungMienGiam_Id, data.APDUNGMIENGIAM_ID);
        edu.util.viewValById(me.input_DMC.dSoTien, data.SOTIEN);
        edu.util.viewValById(me.input_DMC.iThuTu, data.THUTU);
        edu.util.viewValById(me.input_DMC.iThuocTinhTuyChon, data.THUOCTINHTUYCHON);
        edu.util.viewValById(me.input_DMC.strMoTa, data.MOTA);
        edu.util.viewValById("dropCanDoi_DMC", data.TUDONGCANDOISANGPHAINOP);
    },
    /*------------------------------------------
	--Discription: [3] Gen HTML ==> DinhMucRieng
	--Author:  
	-------------------------------------------*/
    popover_DinhMucRieng_DMC: function (data, obj) {
        //1.processing
        var strSoPhieu_Thu = "";
        var strNguoiThu = "";
        var strNgayThu = "";
        //2. load to popover
        var objdata = {
            obj: obj,
            title: "<a><span class='bold'><i class='fa fa-info-circle'></i> Danh sách khoản riêng</span></a>",
            content: function () {
                var html_popover = '';
                html_popover += '<table class="table table-condensed table-hover" style="width:500px">';
                html_popover += '<thead>';
                html_popover += '<tr>';
                html_popover += '<th class="td-left">Chương trình</th>';
                html_popover += '<th class="td-left">Loại khoản</th>';
                html_popover += '<th class="td-right">Số tiền</th>';
                html_popover += '</tr>';
                html_popover += '</thead>';
                html_popover += '<tbody>';
                for (var i = 0; i < data.length; i++) {
                    strChuongTrinh = edu.util.returnEmpty(data[i].DAOTAO_TOCHUCCHUONGTRINH_TEN);
                    strDoiTuong = edu.util.returnEmpty(data[i].DOITUONGDAOTAO_TEN);
                    dSoTien = edu.util.formatCurrency(edu.util.returnZero(data[i].SOTIEN));

                    html_popover += '<tr>';
                    html_popover += '<td class="td-left">' + strChuongTrinh + '</td>';
                    html_popover += '<td class="td-left">' + strDoiTuong + '</td>';
                    html_popover += '<td class="td-right">' + dSoTien + '</td>';
                    html_popover += '</tr>';
                }
                html_popover += '</tbody>';
                html_popover += '</table>';
                return html_popover;
            },
            event: 'hover',
            place: 'left',
        };
        edu.system.loadToPopover_data(objdata);
    },
    /*------------------------------------------
	--Discription: [4] Gen HTML ==> KhoanThu
	--Author:  
	-------------------------------------------*/
    genCombo_LoaiKhoan: function (data) {
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
            renderPlace: ["dropKhoanThu_DMC", "dropKhoanThu_Search_DMC"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    // Copy từ ruttiennew.js — dùng PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc (hàm mới BE mới cấp).
    // Trước đó gọi qua edu.extend.getList_KeHoachNhapHoc_NhanSu, nhưng Core/systemextend.js bản cũ
    // vẫn trỏ về pkg_nhaphoc_thongtin (API cũ) — trang này ép dùng bản mới không phụ thuộc load thứ tự.
    getList_KeHoachNhapHoc_NhanSu: function (obj, resolve, reject, callback) {
        var obj_save = {
            'action': 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
            'func': 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': obj.strNguoiDung_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = edu.util.checkValue(data.Data) ? data.Data : [];
                    if (typeof resolve === "function") resolve(arr);
                    if (typeof callback === "function") callback(arr, data.Pager);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
        }, false, false, false, null);
    },
}