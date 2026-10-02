/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 14/08/2018
--API URL: NH_QuyTacSinhMa
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function QuyTacSinhMa() { };
QuyTacSinhMa.prototype = {
    valid_QTSM: [],
    html_QTSM: {},
    input_QTSM: {},
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
            me.showHide_Box("zone-bus-qtsm", "zone_list_QTSM");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-qtsm", "zone_input_QTSM");
        });
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnCallModal_KeHoach_QTSM").click(function () {
            me.popup_KeHoach();
        });
        $("#tbldata_KeKhoach_QTSM").delegate(".slKeHoach_QTSM", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/rdKeHoach_QTSM/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_KeHoachNhapHoc(selected_id);
            }
        });
        /*------------------------------------------
		--Discription: [2] Action DinhMucChung
		--Author:
		-------------------------------------------*/
        $("#tbldata_QTSM").delegate(".btnEditRole_QTSM", "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.input_QTSM.strId = selected_id;
                me.getDetail_QTSM(selected_id);
            }
        });
        $("#tbldata_QTSM").delegate(".chkSelectOne_QTSM", "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_QTSM);
        });
        $("[id$=chkSelectAll_QTSM]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_QTSM);
        });
        $("#btnDelete_QTSM").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_QTSM);            
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $(document).delegate("#btnYes", "click", function (e) {
                me.delete_QTSM(selected_id);
            });
            return false;
        });
        $("#btnRefresh_QTSM").click(function () {
            me.getList_QTSM();
        });
        $("#btnRewrite_QTSM").click(function () {
            me.rewrite();
        });
        $("#btnSave_QTSM").click(function () {
            var valid = true;// edu.util.checkInputForm_Valid(me.valid_QTSM);
            if (valid == true) {
                me.save_QTSM();
            }
        });
        //timkiem
        $('#dropKeHoachNhapHoc_QTSM').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_QTSM();
        });
        $("#txtKeyword_Search_QTSM").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strId = edu.util.getValById("dropKeHoachNhapHoc_QTSM");
                //neu chon ke hoach thi lay DMC theo ke hoach
                if (edu.util.checkValue(strId)) {
                    me.strKeHoach_TimKiem_Id = strId;
                }
                    //neu khong chon ke hoach thi lay DMC theo user
                else {
                    me.strKeHoach_TimKiem_Id = edu.system.userId;
                }
                me.getList_QTSM();
            }
        });
        $("#btnSearch_QTSM").click(function () {
            var strId = edu.util.getValById("dropKeHoachNhapHoc_QTSM");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_QTSM();
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-qtsm", "zone_list_QTSM");
        //obj, resolve, reject, callback
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        me.getList_KeHoachNhapHoc_NhanSu(obj, "", "", me.cbGenTable_KeHoachNhapHoc);
        /*------------------------------------------
		--Discription: config DinhMucChung
		-------------------------------------------*/
        me.html_QTSM = {
            table_id: "tbldata_QTSM",
            prefix_id: "chkSelect_QTSM",
            regexp: /chkSelect_QTSM/g,
            chkOne: "chkSelectOne_QTSM",
            btn_edit: "btnEditRole_QTSM",
        };
        me.input_QTSM = {
            strTen: "txtTen_QTSM",
            strThanhPhanCauTrucMa_Id: "dropThanhPhanCauTrucMa_QTSM",
            iThuTu: "txtThuTu_QTSM",
            strNhapHoc_KeHoachNhapHoc_Id: "",
            strNhapHoc_KeHoachNhapHoc_Ten: "txtKeHoachNhapHoc_QTSM",
            strGiaTriMacDinh: "txtGiaTriMacDinh_QTSM",
            strMucApDung_Id: "dropMucApDung_QTSM",
            iDoDai: "txtDoDai_QTSM",
            strId: "",
        };
        me.valid_QTSM = [
			{ "MA": me.input_QTSM.strTen, "THONGTIN1": "1" },
			{ "MA": me.input_QTSM.strThanhPhanCauTrucMa_Id, "THONGTIN1": "1" },
			{ "MA": me.input_QTSM.iThuTu, "THONGTIN1": "1#3" },
            { "MA": me.input_QTSM.strNhapHoc_KeHoachNhapHoc_Ten, "THONGTIN1": "1" },
			{ "MA": me.input_QTSM.iDoDai, "THONGTIN1": "1#3" },
			//1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.CAUTRUCMA", "dropThanhPhanCauTrucMa_QTSM", "Chọn thành phần cấu trúc mã");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.MUCAPDUNG", "dropMucApDung_QTSM", "Chọn mức áp dụng");
        me.getList_QTSM();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_QTSM.strId = "";
        me.strKeHoachNhapHoc_Id = '';
        //
        var arrId = ["txtTen_QTSM", "dropThanhPhanCauTrucMa_QTSM", "txtThuTu_QTSM", "txtKeHoachNhapHoc_QTSM", "txtGiaTriMacDinh_QTSM", "dropMucApDung_QTSM", "txtDoDai_QTSM"];
        edu.util.resetValByArrId(arrId);
    },
    popup_KeHoach: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalKeHoach_QTSM").modal("show");
    },
    /*------------------------------------------
	--Discription: [2]  ACESS DB ==> DinhMucChung
    --Author:  
	-------------------------------------------*/
    save_QTSM: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NH_QuyTacSinhMa/ThemMoi',
            'versionAPI': 'v1.0',

            'strTen': edu.util.getValById(me.input_QTSM.strTen),
            'strThanhPhanCauTrucMa_Id': edu.util.getValById(me.input_QTSM.strThanhPhanCauTrucMa_Id),
            'dThuTu': edu.util.getValById(me.input_QTSM.iThuTu),
            'strKeHoachNhapHoc_Id': me.strKeHoachNhapHoc_Id,
            'strGiaTriMacDinh': edu.util.getValById(me.input_QTSM.strGiaTriMacDinh),
            'strMucApDung_Id': edu.util.getValById(me.input_QTSM.strMucApDung_Id),
            'dDoDai': edu.util.getValById(me.input_QTSM.iDoDai),
            'strId': edu.util.getValById(me.input_QTSM.strId),
            'strNguoiThucHien_Id': edu.system.userId,           
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_QuyTacSinhMa/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.input_QTSM.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QTSM();
                }
                else {
                    edu.system.alert("NH_QuyTacSinhMa.ThemMoi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_QuyTacSinhMa.ThemMoi (er): " + JSON.stringify(er), "w");
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
    getList_QTSM: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_QuyTacSinhMa/LayDanhSach',
            'versionAPI': 'v1.0',

            'strKeHoachNhapHoc_Id': me.strKeHoach_TimKiem_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_QTSM"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_QTSM(data.Data, data.Pager);
                }
                else {
                    edu.system.alert("NH_QuyTacSinhMa.LayDanhSach: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_QuyTacSinhMa.LayDanhSach (er): " + JSON.stringify(er), "w");
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
    getDetail_QTSM: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NH_QuyTacSinhMa/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_QTSM.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.viewForm_QTSM(data.Data[0]);
                    }
                    else {
                        me.viewForm_QTSM([]);
                    }
                }
                else {
                    edu.system.alert("NH_QuyTacSinhMa.LayChiTiet: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_QuyTacSinhMa.LayChiTiet (er): " + JSON.stringify(er), "w");
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
    delete_QTSM: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_QuyTacSinhMa/Xoa',
            'versionAPI': 'v1.0',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_QTSM);
                    me.getList_QTSM();
                }
                else {
                    var obj = {
                        content: "NH_QuyTacSinhMa.Xoa" + data.Message,
                        code: "w"
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "NH_QuyTacSinhMa.Xoa (er)" + JSON.stringify(er),
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
	--Discription: [1] ACTION HTML ==> KeHoachNhapHoc
	--Author:  
	-------------------------------------------*/
    select_KeHoachNhapHoc: function (id) {
        var me = this;
        me.strKeHoachNhapHoc_Id = id;
        //$
        var $kehoach_ten = "tenkehoach" + id;
        var $kehoach_khoa = "khoa" + id;
        var $kehoach_thoigian = "thoigian" + id;
        //value
        var valKeHoach = edu.util.getTextById($kehoach_ten) + " (" + edu.util.getTextById($kehoach_thoigian) + ") " + edu.util.getTextById($kehoach_khoa)
        //fill into 
        edu.util.viewValById("txtKeHoachNhapHoc_QTSM", valKeHoach);
        //notify
        var obj = {
            renderPlace: "rdKeHoach_QTSM" + id,
            type: "s",
            title: "Chọn thành công!",
            autoClose: true,
        }
        edu.system.notifyLocal(obj);
    },
    cbGenTable_KeHoachNhapHoc: function (data, iPager) {
        var me = main_doc.QuyTacSinhMa;//global variable
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
            strTable_Id: "tbldata_KeKhoach_QTSM",
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
                    return '<a href="#" id="rdKeHoach_QTSM' + aData.ID + '" name="kehoachnhanhoc" class="slKeHoach_QTSM">Chọn</a>';
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
            renderPlace: ["dropKeHoachNhapHoc_QTSM"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] Gen HTML ==> QuyTacSinhMa
	--Author:  
	-------------------------------------------*/
    genTable_QTSM: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_QTSM.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhMucChung.getList_QTSM()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [2, 3, 6],
                right: [],
                center: [0, 1, 5, 7],
                fix: [0, 7]
            },
            aoColumns: [
            {
                "mDataProp": "THUTU"
            }
            , {
                "mDataProp": "TEN"
            }
            , {
                "mDataProp": "THANHPHANCAUTRUCMA_TEN"
            }
            , {
                "mDataProp": "GIATRIMACDINH"
            }
             , {
                 "mDataProp": "DODAI"
            }
            , {
                "mDataProp": "MUCAPDUNG_TEN"
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_QTSM.prefix_id + aData.ID + '" class="' + me.html_QTSM.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_QTSM: function (data) {
        var me = this;
        //call popup --Edit
        me.showHide_Box("zone-bus-qtsm", "zone_input_QTSM");
        //view data --Edit
        me.strKeHoachNhapHoc_Id = data.TAICHINH_KEHOACHNHAPHOC_ID;
        edu.util.viewValById(me.input_QTSM.strTAICHINH_KeHoach, data.TAICHINH_KEHOACHNHAPHOC_TEN);
        edu.util.viewValById(me.input_QTSM.strTAICHINH_CacKhoanThu_Id, data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById(me.input_QTSM.strApDungMienGiam_Id, data.APDUNGMIENGIAM_ID);
        edu.util.viewValById(me.input_QTSM.dSoTien, data.SOTIEN);
        edu.util.viewValById(me.input_QTSM.iThuTu, data.THUTU);
        edu.util.viewValById(me.input_QTSM.iThuocTinhTuyChon, data.THUOCTINHTUYCHON);
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