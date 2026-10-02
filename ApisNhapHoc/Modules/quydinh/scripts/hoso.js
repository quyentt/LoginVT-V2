/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 13/07/2018
--API URL: NH_QuyDinhHoSo
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function QuyDinhHoSo() { };
QuyDinhHoSo.prototype = {
    valid_QDHS: [],
    html_QDHS: {},
    input_QDHS: {},
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
        me.getList_NguoiDung();
        /*------------------------------------------
		--Discription: [0] Action Common
		--Author: 
		-------------------------------------------*/
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus-hs", "zone_list_QDHS");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-hs", "zone_input_QDHS");
        });
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhanSu
		--Author: 
		-------------------------------------------*/
        $("#tbldata_QDHS").delegate(".btnEditRole_QDHS", "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.input_QDHS.strId = selected_id;
                me.getDetail_QDHS(selected_id);
            }
        });
        $("#tbldata_QDHS").delegate(".chkSelectOne_QDHS", "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_QDHS);
        });
        $("[id$=chkSelectAll_QDHS]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_QDHS);
        });
        $("#btnDelete_QDHS").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_QDHS);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $(document).delegate("#btnYes", "click", function (e) {
                me.delete_QDHS(selected_id);
            });
            return false;
        });
        $("#btnRefresh_QDHS").click(function () {
            me.getList_QDHS();
        });
        $("#btnRewrite_QDHS").click(function () {
            me.rewrite();
        });
        $("#btnSave_QDHS").click(function () {
            var valid = true;// edu.util.checkInputForm_Valid(me.valid_QDHS);
            if (valid == true) {
                me.save_QDHS();
            }
        });
        //timkiem
        $('#dropKeHoachNhapHoc_QDHS').on('select2:select', function () {
            var strId = $(this).find('option:selected').val();
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
            //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_QDHS();
            me.getList_NguoiDung();
        });
        $("#btnSearch_QDHS").click(function () {
            var strId = edu.util.getValById("dropKeHoachNhapHoc_QDHS");
            //neu chon ke hoach thi lay DMC theo ke hoach
            if (edu.util.checkValue(strId)) {
                me.strKeHoach_TimKiem_Id = strId;
            }
            //neu khong chon ke hoach thi lay DMC theo user
            else {
                me.strKeHoach_TimKiem_Id = edu.system.userId;
            }
            me.getList_QDHS();
        });
        $("#txtKeyword_Search_QDHS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var strId = edu.util.getValById("dropKeHoachNhapHoc_QDHS");
                //neu chon ke hoach thi lay DMC theo ke hoach
                if (edu.util.checkValue(strId)) {
                    me.strKeHoach_TimKiem_Id = strId;
                }
                    //neu khong chon ke hoach thi lay DMC theo user
                else {
                    me.strKeHoach_TimKiem_Id = edu.system.userId;
                }
                me.getList_QDHS();
            }
        });
        /*------------------------------------------
		--Discription: [2] Action KeHoachNhapHoc
        --Author: 
		-------------------------------------------*/
        $("#btnCallModal_KeHoach_QDHS").click(function () {
            me.popup_KeHoach();
        });
        $("#tbldata_KeKhoach_QDHS").delegate(".slKeHoach_QDHS", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/rdKeHoach_QDHS/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_KeHoachNhapHoc(selected_id);
            }
        });

        $("#btnPhanQuyen").click(function () {
            me.showHide_Box("zone-bus-hs", "zone_phanquan");
        });
        $("#btnSave_PhanQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDung", "checkX");
            var arrChecked_Id2 = edu.util.getArrCheckedIds("tblLoaiHoSo", "checkX");
            if (arrChecked_Id.length * arrChecked_Id2.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length * arrChecked_Id2.length);
            arrChecked_Id.forEach(e => {
                arrChecked_Id2.forEach(ele => {
                    me.save_NguoiDungHoSo(e, ele);
                });
            });
        });
        $("#tblLoaiHoSo").delegate(".btnDSLoaiHoSo", "click", function () {
            var selected_id = this.id;
            me["strLoaiHoSo_Id"] = selected_id;
            me.getList_NguoiDungHoSo();
            $("#myModalHoSoNguoiDung").modal('show');
        });
        $("#tbldata_QDHS").delegate(".btnDSLoaiHoSo", "click", function () {
            var selected_id = this.id;
            me["strLoaiHoSo_Id"] = selected_id;
            me.getList_NguoiDungHoSo();
            $("#myModalHoSoNguoiDung").modal('show');
        });

        $("#btnDelete_HoSoNguoiDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHoSoNguoiDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => {
                me.delete_NguoiDungHoSo(e);
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author: 
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-hs", "zone_list_QDHS");
        //obj, resolve, reject, callback
        var obj = {
            strNguoiDung_Id: edu.system.userId
        };
        me.getList_KeHoachNhapHoc_NhanSu(obj, "", "", me.cbGenTable_KeHoachNhapHoc);
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.HOSO", "dropLoaiHoSo_QDHS", "Chọn loại hồ sơ");
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.TINHCHAT", "dropTinhChatHoSo_QDHS", "Chọn tính chất hồ sơ");
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.NHOM", "dropNhomHoSo_QDHS");
        edu.system.loadToCombo_DanhMucDuLieu("NHAPHOC.KIEUDULIEU", "dropKieuDuLieu_QDHS");
        /*------------------------------------------
		--Discription: config QuyDinhHoSo
		-------------------------------------------*/
        me.html_QDHS = {
            table_id: "tbldata_QDHS",
            prefix_id: "chkSelect_QDHS",
            regexp: /chkSelect_QDHS/g,
            chkOne: "chkSelectOne_QDHS",
            btn_edit: "btnEditRole_QDHS",
            btn_save_id: "btnSave",
            btn_save_tl: "Lưu",
        };
        me.input_QDHS = {
            strLoaiHoSo_Id: "dropLoaiHoSo_QDHS",
            dSoLuong: "txtSoLuong_QDHS",
            strTinhChatHoSo_Id: "dropTinhChatHoSo_QDHS",
            strNHAPHOC_KeHoach_Id: "",
            strNHAPHOC_KeHoach_Ten: "txtKeHoach_QDHS",
            strThuTu: "txtThuTu_QDHS",
            strNguoiThucHien_Id: "",
            strId: "",

            strLoaiHoSo_Id_Search: "",
            strTinhChatHoSo_Id_Search: "",
            strNHAPHOC_KeHoach_Id_Search: "",
            strNguoiThucHien_Id_Search: "",
            strTuKhoa_Search: "",
            pageIndex_Search: "",
            pageSize_Search: "",
        };
        me.valid_QDHS = [
			{ "MA": me.input_QDHS.strLoaiHoSo_Id, "THONGTIN1": "1" },
			{ "MA": me.input_QDHS.dSoLuong, "THONGTIN1": "1" },
			{ "MA": me.input_QDHS.strTinhChatHoSo_Id, "THONGTIN1": "1" },
			{ "MA": me.input_QDHS.strNHAPHOC_KeHoach_Ten, "THONGTIN1": "1" },
			//1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        me.getList_QDHS();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_QDHS.strId = "";
        me.strKeHoachNhapHoc_Id = "";
        //
        var arrId = ["dropLoaiHoSo_QDHS", "txtSoLuong_QDHS", "dropTinhChatHoSo_QDHS", "txtKeHoach_QDHS", "txtThuTu_QDHS", "dropNhomHoSo_QDHS", "dropKieuDuLieu_QDHS", "txtMoTa_QDHS"];
        edu.util.resetValByArrId(arrId);
    },
    popup_KeHoach: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalKeHoach_QDHS").modal("show");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS HTML ==> QuyDinhHoSo
    --Author: 
	-------------------------------------------*/
    save_QDHS: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_QuyDinhHoSo/ThemMoi',
            'versionAPI': 'v1.0',
            'strId': me.input_QDHS.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiHoSo_Id': edu.util.getValById(me.input_QDHS.strLoaiHoSo_Id),
            'dSoLuong': edu.util.getValById(me.input_QDHS.dSoLuong),
            'strTinhChatHoSo_Id': edu.util.getValById(me.input_QDHS.strTinhChatHoSo_Id),
            'strNHAPHOC_KeHoach_Id': me.strKeHoachNhapHoc_Id,
            'strNhomHoSo_Id': edu.util.getValById('dropNhomHoSo_QDHS'),
            'strKieuDuLieu_Id': edu.util.getValById('dropKieuDuLieu_QDHS'),
            'iThuTu': edu.util.getValById('txtThuTu_QDHS'),
            'strMoTa': edu.util.getValById('txtMoTa_QDHS'),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_QuyDinhHoSo/CapNhat';
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.input_QDHS.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_QDHS();
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
    getList_QDHS: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_QuyDinhHoSo/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strLoaiHoSo_Id': "",
            'strTinhChatHoSo_Id': "",
            'strNHAPHOC_KeHoach_Id': me.strKeHoach_TimKiem_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_QDHS"),
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_QDHS = data.Data;
                    me.genTable_QDHS(data.Data, data.Pager);
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
    getDetail_QDHS: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NH_QuyDinhHoSo/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_QDHS.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_QDHS = data.Data;
                        me.viewForm_QDHS(data.Data[0]);
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
    delete_QDHS: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_QuyDinhHoSo/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_QDHS);
                    me.getList_QDHS();
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
	--Discription: [1] GEN HTML ==> QuyDinhHoSo
	--Author: 
	-------------------------------------------*/
    genTable_QDHS: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_QDHS.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuyDinhHoSo.getList_QDHS()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                left: [1, 2, 3],
                right: [],
                center: [0, 4, 5, 6],
                fix: [0, 5, 6]
            },
            bHiddenOrder: true,
            aoColumns: [{
                "mDataProp": "THUTU"
            }
                ,
            {
                "mDataProp": "NHAPHOC_KEHOACHNHAPHOC_TEN"
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnDSLoaiHoSo" id="' + aData.LOAIHOSO_ID + '" title="Chi tiết">' + aData.LOAIHOSO_TEN + '</a></span>';
                }
            }
            , {
                "mDataProp": "TINHCHATHOSO_TEN"
            }
            , {
                "mDataProp": "SOLUONG"
                }
                , {
                    "mDataProp": "NHOMHOSO_TEN"
                }
                , {
                    "mDataProp": "KIEUDULIEU_TEN"
                }
            , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="' + me.html_QDHS.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_QDHS.prefix_id + aData.ID + '" class="' + me.html_QDHS.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var jsonForm = {
            strTable_Id: "tblLoaiHoSo",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSLoaiHoSo" id="' + aData.LOAIHOSO_ID + '" title="Chi tiết">' + aData.LOAIHOSO_TEN +'</a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.LOAIHOSO_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_QDHS: function (data) {
        var me = this;
        //call popup --Edit
        me.showHide_Box("zone-bus-hs", "zone_input_QDHS");
        me.strKeHoachNhapHoc_Id = data.NHAPHOC_KEHOACHNHAPHOC_ID;
        //view data --Edit 
        edu.util.viewValById(me.input_QDHS.strLoaiHoSo_Id, data.LOAIHOSO_ID);
        edu.util.viewValById(me.input_QDHS.dSoLuong, data.SOLUONG);
        edu.util.viewValById(me.input_QDHS.strTinhChatHoSo_Id, data.TINHCHATHOSO_ID);
        edu.util.viewValById(me.input_QDHS.strNHAPHOC_KeHoach_Ten, data.NHAPHOC_KEHOACHNHAPHOC_TEN);
        edu.util.viewValById("txtThuTu_QDHS", data.THUTU);
        edu.util.viewValById("dropNhomHoSo_QDHS", data.NHOMHOSO_ID);
        edu.util.viewValById("dropKieuDuLieu_QDHS", data.KIEUDULIEU_ID);
        edu.util.viewValById("txtMoTa_QDHS", data.MOTA);
    },
    /*------------------------------------------
	--Discription: [2] GEN/ACTION HTML ==> KeHoachNhapHoc
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
        var kehoach_val = edu.util.getTextById($kehoach_ten) + " (" + edu.util.getTextById($kehoach_thoigian) + ") " + edu.util.getTextById($kehoach_khoa)
        //fill into 
        edu.util.viewValById("txtKeHoach_QDHS", kehoach_val);
        //notify
        var obj = {
            renderPlace: "rdKeHoach_QDHS" + id,
            type: "s",
            title: "Chọn thành công!",
            autoClose: true,
        }
        edu.system.notifyLocal(obj);
    },
    cbGenTable_KeHoachNhapHoc: function (data, iPager) {
        var me = main_doc.QuyDinhHoSo;//global variable
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
            strTable_Id: "tbldata_KeKhoach_QDHS",
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
                    return '<a href="#" id="rdKeHoach_QDHS' + aData.ID + '" name="kehoachnhanhoc" class="slKeHoach_QDHS">Chọn</a>';
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
            renderPlace: ["dropKeHoachNhapHoc_QDHS"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_NguoiDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NH_ThongTin/LayDSNhapHoc_KeHoachNhanSu',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_KeHoach_Id': edu.util.getValById('dropKeHoachNhapHoc_QDHS'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_NguoiDung(dtReRult, data.Pager);
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
    genTable_NguoiDung: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguoiDung",
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.NGUOIDUNG_ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_NguoiDungHoSo: function (strNguoiDung_Id, strLoaiHoSo_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_ThamSo/Them_NhapHoc_QuyDinhHoSo_Quyen',
            'type': 'POST',
            'strNhapHoc_KeHoach_Id': edu.util.getValById('dropKeHoachNhapHoc_QDHS'),
            'strNguoiDung_Id': strNguoiDung_Id,
            'strLoaiHoSo_Id': strLoaiHoSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    //me.getList_DieuKien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NguoiDungHoSo: function (strId, strThanhPhan_GiaTri) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NH_ThamSo/Xoa_NhapHoc_QuyDinhHoSo_Quyen',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NguoiDungHoSo();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NguoiDungHoSo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NH_ThamSo/LayDSNhapHoc_QuyDinhHoSo_Quyen',
            'type': 'GET',
            'strNhapHoc_KeHoach_Id': edu.util.getValById('dropKeHoachNhapHoc_QDHS'),
            'strLoaiHoSo_Id': me.strLoaiHoSo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_NguoiDungHoSo(dtReRult, data.Pager);
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
    genTable_NguoiDungHoSo: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHoSoNguoiDung",
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIHOSO_TEN"
                },
                {
                    //"mDataProp": "NGUOITAO_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return aData.NGUOIDUNG_TENDAYDU + " " + aData.NGUOIDUNG_TAIKHOAN;
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