/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 13/07/2018
--API URL: NH_DinhMuc_Rieng
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DinhMucRieng() { };
DinhMucRieng.prototype = {
    dtKeHoachNhanSu:[],
    valid_DMR: [],
    html_DMR: {},
    input_DMR: {},
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
        /*------------------------------------------
		--Discription: [0] Action Common
		--Author:
		-------------------------------------------*/
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus-mdr", "zone_list_DMR");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-mdr", "zone_input_DMR");
        });
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhapHoc
		--Author:
		-------------------------------------------*/
        $("#btnCallModal_KeHoach_DMR").click(function () {
            me.popup_KeHoach();
        });
        $("#tbldata_KeKhoach_DMR").delegate(".btnSelect_KeHoach_DMR", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/rdKeHoach_DMR/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.viewKeHoach(selected_id);
            }
        });
        /*------------------------------------------
		--Discription: [2] Action DinhMucRieng
		--Author:
		-------------------------------------------*/
        $("#tbldata_DMR").delegate(".btnEditRole_DMR", "click", function () {
            var selected_id = this.id;
            if (edu.util.checkValue(selected_id)) {
                me.rewrite();
                me.input_DMR.strId = selected_id;
                return new Promise(function (resolve, reject) {
                    me.getDetail_DMR(selected_id, resolve, reject);

                }).then(function (data) {
                    me.viewForm_DMR(data);
                });
            }
            else {
                edu.system.alert("Không lấy đươc dữ liệu!", "w");
            }
        });
        $("#tbldata_DMR").delegate(".chkSelectOne_DMR", "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_DMR);
        });
        $("[id$=chkSelectAll_DMR]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_DMR);
        });
        $("#btnDelete_DMR").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_DMR);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $(document).delegate("#btnYes", "click", function (e) {
                me.delete_DMR(selected_id);
            });
            return false;
        });
        $("#btnRefresh_DMR").click(function () {
            me.getList_DMR();
        });
        $("#btnRewrite_DMR").click(function () {
            me.rewrite();
        });
        $("#btnSave_DMR").click(function () {
            var valid = true; // edu.util.checkInputForm_Valid(me.valid_DMR);
            if (valid == true) {
                if (edu.util.checkValue(me.strKeHoachNhapHoc_Id)) {
                    me.save_DMR();
                }
                else {
                    edu.system.alert("Vui lòng chọn kế hoạch nhập học!");
                }
            }
        });
        //timkiem
        $('#dropKeHoachNhapHoc_DMR').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_DMR();
        });
        $('#dropKhoanThu_Search_DMR').on('select2:select', function () {
            var strId = edu.util.getValById("dropKhoanThu_Search_DMR");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_DMR();
        });
        $("#txtKeyword_Search_DMR").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strId = edu.util.getValById("dropKeHoachNhapHoc_DMR");
                //neu chon ke hoach thi lay DMC theo ke hoach
                if (edu.util.checkValue(strId)) {
                    me.strKeHoach_TimKiem_Id = strId;
                }
                    //neu khong chon ke hoach thi lay DMC theo user
                else {
                    me.strKeHoach_TimKiem_Id = edu.system.userId;
                }
                me.getList_DMR();
            }
        });
        $("#btnSearch_DMR").click(function () {
            var strId = edu.util.getValById("dropKeHoachNhapHoc_DMR");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
            //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_DMR();
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:  
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-mdr", "zone_list_DMR");
        //obj, resolve, reject, callback
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        me.getList_KeHoachNhapHoc_NhanSu(obj, "", "", me.cbGenTable_KeHoachNhapHoc);
        /*------------------------------------------
		--Discription: config DinhMucRieng
		-------------------------------------------*/
        me.html_DMR = {
            table_id: "tbldata_DMR",
            prefix_id: "chkSelect_DMR",
            regexp: /chkSelect_DMR/g,
            chkOne: "chkSelectOne_DMR",
            btn_edit: "btnEditRole_DMR",
            btn_save_id: "btnSave",
            btn_save_tl: "Lưu",
        };
        me.input_DMR = {
            strTAICHINH_KeHoach_Id: "",
            strTAICHINH_KeHoach_Ten: "txtKeHoach_DMR",
            strTAICHINH_CacKhoanThu_Id: "dropKhoanThu_DMR",
            strApDungMienGiam_Id: "dropApDungMienGiam_DMR",
            dSoTien: "txtSoTien_DMR",
            iThuTu: "txtThuTu_DMR",
            strMoTa: "txtMoTa_DMR",
            iThuocTinhTuyChon: "dropThuocTinhTuyChon_DMR",
            strDoiTuongDaoTao_Id: "dropDoiTuong_DMR",
            strDAOTAO_ToChucCCCT_Id: "dropChuongTrinh_DMR",
            strNguoiThucHien_Id: "",
            strId: "",

            strTAICHINH_CacKhoanThu_Id_Search: "",
            strTAICHINH_KeHoach_Id_Search: "",
            strApDungMienGiam_Id_Search: "",
            strDAOTAO_ToChucCCCT_Id_Search: "",
            strDoiTuongDaoTao_Id_Search: "",
            strNguoiThucHien_Id_Search: "",
            strTuKhoa_Search: "",
            pageIndex_Search: "",
            pageSize_Search: "",
        };
        me.valid_DMR = [
			{ "MA": me.input_DMR.strTAICHINH_KeHoach_Ten, "THONGTIN1": "1" },
			{ "MA": me.input_DMR.strTAICHINH_CacKhoanThu_Id, "THONGTIN1": "1" },
			{ "MA": me.input_DMR.dSoTien, "THONGTIN1": "1" },
			{ "MA": me.input_DMR.iThuTu, "THONGTIN1": "1#3" },
			//1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        me.getList_LoaiKhoan("", "");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.DOITUONG", "dropDoiTuong_DMR", "Chọn đối tượng đào tạo");
        var strId = edu.util.getValById("dropKhoanThu_Search_DMR");
        //neu chon ke hoach thi lay DMC theo ke hoach
        if (edu.util.checkValue(strId)) {
            me.strKeHoach_TimKiem_Id = strId;
        }
            //neu khong chon ke hoach thi lay DMC theo user
        else {
            me.strKeHoach_TimKiem_Id = edu.system.userId;
        }
        me.getList_DMR();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_DMR.strId = "";
        me.strKeHoachNhapHoc_Id = "";
        //
        var arrId = ["txtMoTa_DMR", "dropApDungMienGiam_DMR", "txtSoTien_DMR", "txtThuTu_DMR", "dropThuocTinhTuyChon_DMR", "dropDoiTuong_DMR", "dropChuongTrinh_DMR"];
        edu.util.resetValByArrId(arrId);
        var strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_DMR");
        if (strKeHoach_Id) me.viewKeHoach(strKeHoach_Id);
        edu.util.viewValById("dropKhoanThu_DMR", edu.util.getValById("dropKhoanThu_Search_DMR"));
    },
    popup_KeHoach: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalKeHoach_DMR").modal("show");
    },
    /*------------------------------------------
	--Discription: [1]  ACESS DB ==> KeHoachNhanSu
    --Author:  
	-------------------------------------------*/
    getDetail_KeHoachNhanSu: function (strId, data, resolve, reject) {
        var me = this;
        var count = 0;
        var checkdata = false;
        for (var i = 0; i < data.length; i++) {
            count++;
            if (strId == data[i].ID) {
                checkdata = true;
                resolve(data[i]);
            }
        }
        if (count == data.length) {
            if (checkdata == false) {
                resolve([]);
            }
        }
    },
    /*------------------------------------------
	--Discription: [2]  ACESS DB ==> DinhMucRieng
    --Author:  
	-------------------------------------------*/
    save_DMR: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_DinhMuc_Rieng/ThemMoi',
            'versionAPI': 'v1.0',
            'strId': me.input_DMR.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTAICHINH_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strTAICHINH_CacKhoanThu_Id': edu.util.getValById(me.input_DMR.strTAICHINH_CacKhoanThu_Id),
            'strApDungMienGiam_Id': edu.util.getValById(me.input_DMR.strApDungMienGiam_Id),
            'dSoTien': edu.util.convertStrToNum(edu.util.getValById(me.input_DMR.dSoTien)),
            'iThuTu': edu.util.getValById(me.input_DMR.iThuTu),
            'strMoTa': edu.util.getValById(me.input_DMR.strMoTa),
            'dThuocTinhTuyChon': edu.util.getValById(me.input_DMR.iThuocTinhTuyChon),
            'strDoiTuongDaoTao_Id': edu.util.getValById(me.input_DMR.strDoiTuongDaoTao_Id),
            'strDAOTAO_TOCHUCCT_Id': edu.util.getValById(me.input_DMR.strDAOTAO_ToChucCCCT_Id),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_DinhMuc_Rieng/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.input_DMR.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DMR();
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
    getList_DMR: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_DinhMuc_Rieng/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strTAICHINH_CacKhoanThu_Id': edu.util.getValById("dropKhoanThu_Search_DMR"),
            'strTAICHINH_KeHoach_Id': me.strKeHoach_TimKiem_Id,
            'strApDungMienGiam_Id': "",
            'strDAOTAO_ToChucCCCT_Id': "",
            'strDoiTuongDaoTao_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_DMR"),
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_DMR = data.Data;
                    me.genTable_DMR(data.Data, data.Pager);
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
    getDetail_DMR: function (strId, resolve, reject) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'NH_DinhMuc_Rieng/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_DMR.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.dt_DMR = data.Data;
                        resolve(data.Data[0]);
                    }
                    else {
                        resolve([]);
                    }
                }
                else {
                    edu.system.alert("NH_DinhMuc_Rieng.LayChiTiet: " + data.Message, "w");
                    reject();
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert("NH_DinhMuc_Rieng.LayChiTiet (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
                reject();
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
    delete_DMR: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NH_DinhMuc_Rieng/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_DMR);
                    me.getList_DMR();
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
	--Discription: [3] ACESS DB ==> KhoanThu
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
        //1. select KeHoachNhapHoc
        me.strKeHoachNhapHoc_Id = id;
        //$
        var $kehoach_ten = "tenkehoach" + id;
        var $kehoach_khoa = "khoa" + id;
        var $kehoach_thoigian = "thoigian" + id;
        //value
        var kehoach_val = edu.util.getTextById($kehoach_ten) + " (" + edu.util.getTextById($kehoach_thoigian) + ") " + edu.util.getTextById($kehoach_khoa)
        //fill into 
        edu.util.viewValById("txtKeHoach_DMR", kehoach_val);
        //notify
        var obj = {
            renderPlace: "rdKeHoach_DMR" + id,
            type: "s",
            title: "Chọn thành công!",
            autoClose: true,
        }
        edu.system.notifyLocal(obj);
        //2. getList ChuongTrinhDaoTao theo KeHoachNhapHoc ==>me.strKeHoachNhapHoc_Id        
    },
    cbGenTable_KeHoachNhapHoc: function (data, iPager) {
        var me = main_doc.DinhMucRieng;//global variable
        me.dtKeHoachNhanSu = data;
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
            strTable_Id: "tbldata_KeKhoach_DMR",
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
                    return '<a href="#" id="rdKeHoach_DMR' + aData.ID + '" name="kehoachnhanhoc" class="btnSelect_KeHoach_DMR">Chọn</a>';
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
            renderPlace: ["dropKeHoachNhapHoc_DMR"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    viewKeHoach: function (selected_id) {
        var me = this;
        me.select_KeHoachNhapHoc(selected_id);
        //get ChuongTrinhDaoTao theo KhoaDaoTao
        return new Promise(function (resolve, reject) {
            me.getDetail_KeHoachNhanSu(selected_id, me.dtKeHoachNhanSu, resolve, reject);
        }).then(function (data) {
            var objParam_CT = {
                strKhoaDaoTao_Id: data.DAOTAO_KHOADAOTAO_ID,
                strN_CN_LOP_Id: "",
                strKhoaQuanLy_Id: "",
                strToChucCT_Cha_Id: "",
                strNguoiThucHien_Id: "",
                strTuKhoa: "",
                pageIndex: 1,
                pageSize: 10000
            };
            edu.system.getList_ChuongTrinhDaoTao(objParam_CT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
        });

    },
    /*------------------------------------------
	--Discription: [2] Gen HTML ==> DinhMucRieng
	--Author:  
	-------------------------------------------*/
    genTable_DMR: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_DMR.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DinhMucRieng.getList_DMR()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [1, 2, 3, 4, 5],
                center:[0, 8, 9],
                fix: [0, 8, 9],
                right:[6, 7],
            },
            aoColumns: [
            {
                "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
            }
            , {
                "mDataProp": "DOITUONGDAOTAO_TEN"
            }
            , {
                "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
            }
            , {
                "mRender": function (nRow, aData) {
                    var strMa = aData.APDUNGMIENGIAM_ID;
                    var strApDungMienGiam = "";
                    console.log("strMa: " + strMa);
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
                    var dSoTien = edu.util.returnZero(aData.SOTIEN_CHUNG);
                    return '<span class="td-right">' + edu.util.formatCurrency(dSoTien) + '</span>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    var dSoTien = edu.util.returnZero(aData.SOTIEN);
                    return '<span class="td-right">' + edu.util.formatCurrency(dSoTien) + '</span>';
                }
            }
            , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="' + me.html_DMR.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_DMR.prefix_id + aData.ID + '" class="' + me.html_DMR.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_DMR: function (data) {
        var me = this;
        //call popup --Edit
        me.showHide_Box("zone-bus-mdr", "zone_input_DMR");
        //view data --Edit
        //1. get strKeHoachNhapHoc_Id
        me.strKeHoachNhapHoc_Id = data.TAICHINH_KEHOACHNHAPHOC_ID;
        //2. get ChuongTrinhDaoTao
        return new Promise(function (resolve, reject) {
            me.getDetail_KeHoachNhanSu(me.strKeHoachNhapHoc_Id, me.dtKeHoachNhanSu, resolve, reject);

        }).then(function (dtKeHoachNhanSu) {
            return new Promise(function (resolve, reject) {
                var objParam_CT = {
                    strKhoaDaoTao_Id: dtKeHoachNhanSu.DAOTAO_KHOADAOTAO_ID,
                    strN_CN_LOP_Id: "",
                    strKhoaQuanLy_Id: "",
                    strToChucCT_Cha_Id: "",
                    strNguoiThucHien_Id: "",
                    strTuKhoa: "",
                    pageIndex: 1,
                    pageSize: 10000
                };
                edu.system.getList_ChuongTrinhDaoTao(objParam_CT, resolve, reject, "");
            }).then(function (dtChuongTrinh) {
                me.cbGenCombo_ChuongTrinhDaoTao(dtChuongTrinh);
                //3. bind
                edu.util.viewValById(me.input_DMR.strTAICHINH_KeHoach_Ten, data.TAICHINH_KEHOACHNHAPHOC_TEN);
                edu.util.viewValById(me.input_DMR.strTAICHINH_CacKhoanThu_Id, data.TAICHINH_CACKHOANTHU_ID);
                edu.util.viewValById(me.input_DMR.strApDungMienGiam_Id, data.APDUNGMIENGIAM_ID);
                edu.util.viewValById(me.input_DMR.dSoTien, edu.util.formatCurrency(data.SOTIEN));
                edu.util.viewValById(me.input_DMR.iThuTu, data.THUTU);
                edu.util.viewValById(me.input_DMR.iThuocTinhTuyChon, data.THUOCTINHTUYCHON);
                edu.util.viewValById(me.input_DMR.strDoiTuongDaoTao_Id, data.DOITUONGDAOTAO_ID);
                edu.util.viewValById(me.input_DMR.strDAOTAO_ToChucCCCT_Id, data.DAOTAO_TOCHUCCHUONGTRINH_ID);
                edu.util.viewValById(me.input_DMR.strMoTa, data.MOTA);
            });
        });
    },
    /*------------------------------------------
	--Discription: [3] Gen HTML ==> KhoanThu
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
            renderPlace: ["dropKhoanThu_DMR", "dropKhoanThu_Search_DMR"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4] Gen HTML ==> ChuongTrinhDaoTao 
	--Author:  
	-------------------------------------------*/
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return aData.TENCHUONGTRINH + " - " + edu.util.returnEmpty(aData.MACHUONGTRINH)
                }
            },
            renderPlace: ["dropChuongTrinh_DMR"],
            type: "",
            title: "Chọn chương trình đào tạo",
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