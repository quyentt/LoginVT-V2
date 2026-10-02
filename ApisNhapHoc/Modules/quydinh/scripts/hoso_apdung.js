/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 13/07/2018
--API URL: NH_QuyDinhHoSo_ApDung
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function QuyDinhHoSo_ApDung() { };
QuyDinhHoSo_ApDung.prototype = {
    dtPhanCap: [],
    dtKeHoachNhapHoc: [],
    valid_QDHSAD: [],
    html_QDHSAD: {},
    input_QDHSAD: {},
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
            me.showHide_Box("zone-bus-qdhsap", "zone_list_QDHSAD");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-qdhsap", "zone_input_QDHSAD");
        });
        /*------------------------------------------
		--Discription: [1] Action QuyDinhHoSo_ApDung
		--Author:
		-------------------------------------------*/
        $("#tbldata_QDHSAD").delegate(".btnEditRole_QDHSAD", "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.input_QDHSAD.strId = selected_id;
                me.getDetail_QDHSAD(selected_id);
            }
        });
        $("#tbldata_QDHSAD").delegate(".chkSelectOne_QDHSAD", "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_QDHSAD);
        });
        $("[id$=chkSelectAll_QDHSAD]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_QDHSAD);
        });
        $("#btnDelete_QDHSAD").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_QDHSAD);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $(document).delegate("#btnYes", "click", function (e) {
                me.delete_QDHSAD(selected_id);
            });
            return false;
        });
        $("#btnRefresh_QDHSAD").click(function () {
            me.getList_QDHSAD();
        });
        $("#btnRewrite_QDHSAD").click(function () {
            me.rewrite();
        });
        $("#btnSave_QDHSAD").click(function () {
            var valid = true;// edu.util.checkInputForm_Valid(me.valid_QDHSAD);
            if (valid == true) {
                me.save_QDHSAD();
            }
        });
        //timkiem
        $('#dropKeHoachNhapHoc_QDHSAD').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_QDHSAD();
        });
        $("#txtKeyword_Search_QDHSAD").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strId = edu.util.getValById("dropKeHoachNhapHoc_QDHSAD");
                //neu chon ke hoach thi lay DMC theo ke hoach
                if (edu.util.checkValue(strId)) {
                    me.strKeHoach_TimKiem_Id = strId;
                }
                    //neu khong chon ke hoach thi lay DMC theo user
                else {
                    me.strKeHoach_TimKiem_Id = edu.system.userId;
                }
                me.getList_QDHSAD();
            }
        });
        $("#btnSearch_QDHSAD").click(function () {
            var strId = edu.util.getValById("dropKeHoachNhapHoc_QDHSAD");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
                //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_QDHSAD();
        });
        /*------------------------------------------
		--Discription: [2] Action select KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnCallModal_KeHoach_QDHSAD").click(function () {
            me.popup_KeHoach();
        });
        $("#tbldata_KeKhoach_QDHSAD").delegate(".slKeHoach_QDHSAD", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/rdKeHoach_QDHSAD/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_KeHoachNhapHoc(selected_id);
            }
        });
        /*------------------------------------------
		--Discription: [3] Action DanhMuc_PhanCap
        --Author:
		-------------------------------------------*/
        $('#dropPhanCap_QDHSADAD').on('select2:select', function () {
            var selectedValue = $(this).find('option:selected').val();
            if (!edu.util.checkValue(me.strKeHoachNhapHoc_Id)) {
                edu.system.alert("Vui lòng lựa chọn Kế hoạch trước khi Phân cấp!");
                return false;
            }
            var strPhanCap_Ma = "";
            var strKhoaDaoTao_Id = "";
            return new Promise(function (resolve, reject) {
                me.getDetail_PhanCap(selectedValue, me.dtPhanCap, resolve, reject);
            }).then(function (data) {
                strPhanCap_Ma = data.MA;
                return new Promise(function (resolve, reject) {
                    me.getDetail_PhanCap(me.strKeHoachNhapHoc_Id, me.dtKeHoachNhapHoc, resolve, reject);
                }).then(function (data) {
                    strKhoaDaoTao_Id = data.DAOTAO_KHOADAOTAO_ID;
                    switch (strPhanCap_Ma) {
                        case "CHUONGTRINH":
                            edu.system.beginLoading();
                            var obj_CT = {
                                strKhoaDaoTao_Id: strKhoaDaoTao_Id,
                                strN_CN_LOP_Id: "",
                                strKhoaQuanLy_Id: "",
                                strToChucCT_Cha_Id: "",
                                strNguoiThucHien_Id: "",
                                strTuKhoa: "",
                                pageIndex: 1,
                                pageSize: 100000,
                            }
                            edu.system.getList_ChuongTrinhDaoTao(obj_CT, "", "", me.genCombo_Control_CT);
                            break;
                        case "LOPQUANLY":
                            edu.system.beginLoading();
                            var obj_Lop = {
                                strCoSoDaoTao_Id: "",
                                strKhoaDaoTao_Id: strKhoaDaoTao_Id,
                                strNganh_Id: "",
                                strLoaiLop_Id: "",
                                strToChucCT_Id: "",
                                strNguoiThucHien_Id: "",
                                strTuKhoa: "",
                                pageIndex: 1,
                                pageSize: 100000,
                            }
                            edu.system.getList_LopQuanLy(obj_Lop, "", "", me.genCombo_Control_LopQL);
                            break;
                        default:
                            break
                    }
                });
            });
        });
    },
    /*------------------------------------------
    --Discription: [1] Hàm chung 
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-qdhsap", "zone_list_QDHSAD");
        //obj, resolve, reject, callback
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        me.getList_KeHoachNhapHoc_NhanSu(obj, "", "", me.cbGenTable_KeHoachNhapHoc);
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.HOSO", "dropLoaiHoSo_QDHSAD", "Chọn loại hồ sơ");
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.TINHCHAT", "dropTinhChatHoSo_QDHSAD", "Chọn tính chất hồ sơ");
        var obj = {
            strMaBangDanhMuc: "NHAPHOC.PHANCAP"
        }
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genCombo_PhanCap);
        /*------------------------------------------
		--Discription: config QuyDinhHoSoApDung
		-------------------------------------------*/
        me.html_QDHSAD = {
            table_id: "tbldata_QDHSAD",
            prefix_id: "chkSelect_QDHSAD",
            regexp: /chkSelect_QDHSAD/g,
            chkOne: "chkSelectOne_QDHSAD",
            btn_edit: "btnEditRole_QDHSAD",
            btn_save_id: "btnSave",
            btn_save_tl: "Lưu",
        };
        me.input_QDHSAD = {
            strLoaiHoSo_Id: "dropLoaiHoSo_QDHSAD",
            dSoLuong: "txtSoLuong_QDHSAD",
            strTinhChatHoSo_Id: "dropTinhChatHoSo_QDHSAD",
            strNHAPHOC_KeHoach_Id: "",
            strNHAPHOC_KeHoach_Ten: "txtKeHoach_QDHSAD",
            strPhamViApDung_Id: "dropPhamVi_QDHSADAD",
            strPhanCapApDung_Id: "",
            strNguoiThucHien_Id: "",
            strId: "",

            strLoaiHoSo_Id_Search: "",
            strTinhChatHoSo_Id_Search: "",
            strNHAPHOC_KeHoach_Id_Search: "",
            strPhamViApDung_Id_Search: "",
            strPhanCapApDung_Id_Search: "",
            strNguoiThucHien_Id_Search: "",
            strTuKhoa_Search: "",
            pageIndex_Search: "",
            pageSize_Search: "",
        };
        me.valid_QDHSAD = [
			{ "MA": me.input_QDHSAD.strLoaiHoSo_Id, "THONGTIN1": "1" },
			{ "MA": me.input_QDHSAD.dSoLuong, "THONGTIN1": "1" },
			{ "MA": me.input_QDHSAD.strNHAPHOC_KeHoach_Ten, "THONGTIN1": "1" },
			//1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        me.getList_QDHSAD();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strKeHoachNhapHoc_Id = '';
        me.input_QDHSAD.strId = "";
        var arrId = ["dropLoaiHoSo_QDHSAD", "txtSoLuong_QDHSAD", "dropTinhChatHoSo_QDHSAD", "txtKeHoach_QDHSAD"];
        edu.util.resetValByArrId(arrId);
    },
    popup_KeHoach: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalKeHoach_QDHSAD").modal("show");
    },
    /*------------------------------------------
	--Discription: Danh mục QuyDinhHoSoApDung
	-------------------------------------------*/
    save_QDHSAD: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NH_QuyDinhHoSo_ApDung/ThemMoi',
            'versionAPI': 'v1.0',
            'strId': me.input_QDHSAD.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiHoSo_Id': edu.util.getValById(me.input_QDHSAD.strLoaiHoSo_Id),
            'dSoLuong': edu.util.getValById(me.input_QDHSAD.dSoLuong),
            'strTinhChatHoSo_Id': edu.util.getValById(me.input_QDHSAD.strTinhChatHoSo_Id),
            'strNHAPHOC_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strPhamViApDung_Id': edu.util.getValById(me.input_QDHSAD.strPhamViApDung_Id),
            'strPhanCapApDung_Id': edu.util.getValById(me.input_QDHSAD.strPhanCapApDung_Id),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_QuyDinhHoSo_ApDung/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.input_QDHSAD.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QDHSAD();
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
    getList_QDHSAD: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_QuyDinhHoSo_ApDung/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strLoaiHoSo_Id': "",
            'strTinhChatHoSo_Id': "",
            'strNHAPHOC_KeHoach_Id': me.strKeHoach_TimKiem_Id,
            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_QDHSAD"),
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_QDHSAD = data.Data;
                    me.genTable_QDHSAD(data.Data, data.Pager);
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
    getDetail_QDHSAD: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NH_QuyDinhHoSo_ApDung/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_QDHSAD.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_QDHSAD = data.Data;
                        me.viewForm_QDHSAD(data.Data[0]);
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
    delete_QDHSAD: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_QuyDinhHoSo_ApDung/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_QDHSAD);
                    me.getList_QDHSAD();
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
	--Discription: Generating html on interface QuyDinhHoSoApDung
	--ULR:  Modules
	-------------------------------------------*/
    genTable_QDHSAD: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_QDHSAD.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDinhHoSoApDung.getList_QDHSAD()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [2],
                fix: [0]
            },
            aoColumns: [
            {
                "mDataProp": "THUTU"
            }
            , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="' + me.html_QDHSAD.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_QDHSAD.prefix_id + aData.ID + '" class="' + me.html_QDHSAD.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_QDHSAD: function (data) {
        var me = this;
        //call popup --Edit
        me.strKeHoachNhapHoc_Id = data.NHAPHOC_KEHOACHNHAPHOC_ID;
        me.showHide_Box("zone-bus-qdhsap", "zone_input_QDHSAD");
        //view data --Edit
        edu.util.viewValById(me.input_QDHSAD.strLoaiHoSo_Id, data.LOAIHOSO_ID);
        edu.util.viewValById(me.input_QDHSAD.dSoLuong, data.SOLUONG);
        edu.util.viewValById(me.input_QDHSAD.strTinhChatHoSo_Id, data.strTinhChatHoSo_Id);////////
        edu.util.viewValById(me.input_QDHSAD.strNHAPHOC_KeHoach_Ten, data.NHAPHOC_KEHOACHNHAPHOC_TEN);
        edu.util.viewValById(me.input_QDHSAD.strPhamViApDung_Id, data.strPhamViApDung_Id);//////
        edu.util.viewValById(me.input_QDHSAD.strPhanCapApDung_Id, data.strPhanCapApDung_Id);///////
    },
    /*------------------------------------------
	--Discription: [3] Tim Kiem KeHoachNhapHoc
	--ULR:  
	-------------------------------------------*/
    select_KeHoachNhapHoc: function (id) {
        var me = this;
        me.strKeHoachNhapHoc_Id = id;
        $("#dropPhanCap_QDHSADAD").val('');
        //$
        var $kehoach_ten = "tenkehoach" + id;
        var $kehoach_khoa = "khoa" + id;
        var $kehoach_thoigian = "thoigian" + id;
        //value
        var kehoach_val = edu.util.getTextById($kehoach_ten) + " (" + edu.util.getTextById($kehoach_thoigian) + ") " + edu.util.getTextById($kehoach_khoa)
        //fill into 
        edu.util.viewValById("txtKeHoach_QDHSAD", kehoach_val);
        //notify
        var obj = {
            renderPlace: "rdKeHoach_QDHSAD" + id,
            type: "s",
            title: "Chọn thành công!",
            autoClose: true,
        }
        edu.system.notifyLocal(obj);
    },
    cbGenTable_KeHoachNhapHoc: function (data, iPager) {
        var me = main_doc.QuyDinhHoSo_ApDung;//global variable
        me.dtKeHoachNhapHoc = data;
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
            strTable_Id: "tbldata_KeKhoach_QDHSAD",
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
                    return '<a href="#" id="rdKeHoach_QDHSAD' + aData.ID + '" name="kehoachnhanhoc" class="slKeHoach_QDHSAD">Chọn</a>';
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
            renderPlace: ["dropKeHoachNhapHoc_QDHSAD"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4] PhanCap
	--ULR:  
	-------------------------------------------*/
    getDetail_PhanCap: function (strId, data, resolve, reject) {
        var me = main_doc.QuyDinhHoSo_ApDung;//global variable
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
    genCombo_PhanCap: function (data) {
        var me = main_doc.QuyDinhHoSo_ApDung;//global variable
        me.dtPhanCap = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropPhanCap_QDHSADAD"],
            type: "",
            title: "Chọn phân cấp",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [5] PhamVi ==>LopQuanLy or ChuongTrinhDaoDao?
	--ULR:  
	-------------------------------------------*/
    genCombo_Control_LopQL: function (data, pager) {
        var me = main_doc.QuyDinhHoSo_ApDung;//global variable
        var name = "TEN";
        me.genCombo_PhamVi(data, name);
    },
    genCombo_Control_CT: function (data, pager) {
        var me = main_doc.QuyDinhHoSo_ApDung;//global variable
        var name = "TENCHUONGTRINH";
        me.genCombo_PhamVi(data, name);
    },
    genCombo_PhamVi: function (data, name) {
        var me = main_doc.QuyDinhHoSo_ApDung;//global variable

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: name,
                code: "",
                avatar: ""
            },
            renderPlace: ["dropPhamVi_QDHSADAD"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
        edu.system.endLoading();
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