/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 12/07/2018
--API URL: NH_KeHoachNhanSu
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KeHoachNhanSu() { };
KeHoachNhanSu.prototype = {
    valid_KHNS: [],
    html_KHNS: {},
    input_KHNS: {},
    objParam_KH: {},
    strKeHoachNhapHoc_Id: '',
    strNhanSu_Id: [],

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
		--Discription: [0] Common
		--Author:
		-------------------------------------------*/
        $(".btnClose").click(function () {
            me.showHide_Box("zone-bus-khns", "zone_list_khns");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            me.showHide_Box("zone-bus-khns", "zone_input_khns");
        });
        /*------------------------------------------
		--Discription: [1] Action KeHoachNhanSu
		--Author:
		-------------------------------------------*/
        $("#tbldata_KHNS").delegate("." + me.html_KHNS.btn_edit, "click", function () {
            var selected_id = this.id;
            me.rewrite();
            if (edu.util.checkValue(selected_id)) {
                me.input_KHNS.strId = selected_id;
                me.getDetail_KHNS(selected_id);
            }
        });
        $("#tbldata_KHNS").delegate("." + me.html_KHNS.chkOne, "click", function () {
            edu.util.checkedOne_BgRow(this, me.html_KHNS);
        });
        $("#tbldata_KHNS").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.input_KHNS.strId = strId;
                me.viewForm_KHNS(me.dt_KHNS.find(e => e.ID === strId));
                me.showHide_Box("zone-bus-khns", "zone_input_khns");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("[id$=chkSelectAll_KHNS]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.html_KHNS);
        });
        $("#btnDelete_KHNS").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.html_KHNS);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu xóa!");
            }
            $("#myModalAlert").delegate("#btnYes", "click", function (e) {
                me.delete_KHNS(selected_id);
            });
            return false;
        });
        $("#btnRefresh_KHNS").click(function () {
            me.getList_KHNS();
        });
        $("#btnRewrite_KHNS").click(function () {
            me.rewrite();
        });
        $("#btnSave_KHNS").click(function () {
            var valid = true;
            var count = 0;
            if (!me.input_KHNS.strId) {
                ////Chec NhanSu
                //if (edu.util.checkValue(me.strNhanSu_Id)) {
                //    count++;
                //}
                //else {
                //    $("#tbldata_NhanSu_Selected tbody").html('<tr><td class="td-center color-danger" colspan="4">Vui lòng chọn Nhân sự!</td></tr>');
                //}
                ////check KeHoach
                //if (edu.util.checkValue(me.strKeHoachNhapHoc_Id)) {
                //    count++;
                //}
                //else {
                //    edu.system.alert("Vui lòng chọn kế hoạch nhập học!");
                //}
                ////call save
                //if (count == 2) {
                //}
                var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoach", "checkX");
                var idem = arrChecked_Id.length * me.strNhanSu_Id.length;
                if (idem > 0) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", idem);
                    arrChecked_Id.forEach(e => me.strNhanSu_Id.forEach(ele => me.save_KHNS(e, ele)));
                } else {
                    edu.system.alert("Vui lòng chọn đối tượng?");
                }

            } else {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", 1);
                me.save_KHNS()
            }
        });
        $("#btnSearch_KHNS").click(function () {
            me.getList_KHNS();
        });
        $('#dropKeHoachNhapHoc_KHNS').on('select2:select', function () {
            me.getList_KHNS();
        });
        $("#txtKeyword_Search_KHNS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_KHNS();
            }
        });
        /*------------------------------------------
		--Discription: [2] Action KeHoachNhapHoc
        --Author:
		-------------------------------------------*/
        $("#btnCallModal_KeHoach_KHNS").click(function () {
            me.popup_KeHoach();
        });
        $("#tbldata_KeKhoach_KHNS").delegate(".slKeHoach_KHNS", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/rdKeHoach_KHNS/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_KeHoachNhapHoc(selected_id);
            }
        });
        /*------------------------------------------
		--Discription: [3] Action NguoiDung
        --Author:
		-------------------------------------------*/
        $("#btnCallModal_NguoiDung_KHNS").click(function () {
            me.popup_NhanSu();
            edu.system.beginLoading();
            $("#txtSearch_NhanSu_KHNS").val('');
            var objNguoiDung = {
                strNguoiThucHien_Id: "",
                strTuKhoa: "",
                pageIndex: edu.system.pageIndex_default,
                pageSize: edu.system.pageSize_default
            }
            //edu.system.getList_NguoiDung(objNguoiDung, "", "", me.cbGenTable_NguoiDung);
        });
        $("#tbldata_NhanSu_KHNS").delegate(".select_nhansu", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/nhansu_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_NhanSu(selected_id);
            }
        });
        $("#tbldata_NhanSu_Selected").delegate(".remove_nhansu", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/selected_nhansu_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.remove_NhanSu(selected_id);
            }
        });
        $("#btnSearch_NhanSu_KHNS").click(function () {
            edu.system.beginLoading();
            var objNguoiDung = {
                strNguoiThucHien_Id: "",
                strTuKhoa: edu.util.getValById("txtSearch_NhanSu_KHNS"),
                pageIndex: edu.system.pageIndex_default,
                pageSize: edu.system.pageSize_default
            }
            edu.system.getList_NguoiDung(objNguoiDung, "", "", me.cbGenTable_NguoiDung);
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:
    -------------------------------------------*/
    page_load: function(){
        var me = this;
        me.showHide_Box("zone-bus-khns", "zone_list_khns");
        me.objParam_KH = {
            strKhoaDaoTao_Id: "",
            strMHNhapHoc_Id: "",
            strMHApDungPhieuThu_Id: "",
            strHeThongThu_Id: "",
            strMHApDungPhieuRut_Id: "",
            strHeThongRut_Id: "",
            strTuKhoa: ""
        };
        edu.extend.getList_KeHoachNhapHoc(me.objParam_KH, me.cbGenTable_KeHoachNhapHoc);
        /*------------------------------------------
		--Discription: config KeHoachNhanSu
		-------------------------------------------*/
        me.html_KHNS = {
            table_id: "tbldata_KHNS",
            prefix_id: "chkSelect_KHNS",
            regexp: /chkSelect_KHNS/g,
            chkOne: "chkSelectOne_KHNS",
            btn_edit: "btnEditRole_KHNS",
        };
        me.input_KHNS = {
            strTAICHINH_KeHoach_Id: "txtKeHoach_KHNS",
            strNguoiDung_Id: "",
            strNguoiThucHien_Id: "",
            strId: "",

            strNguoiDung_Id_Search: "",
            strTAICHINH_KeHoach_Id_Search: "",
            strNguoiThucHien_Id_Search: "",
            strTuKhoa_Search: "",
            pageIndex_Search: "",
            pageSize_Search: "",
        };
        me.valid_KHNS = [
			{ "MA": me.input_KHNS.strTAICHINH_KeHoach_Id, "THONGTIN1": "1" },
			//1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
        me.getList_KHNS();
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.input_KHNS.strId = "";
        me.strKeHoachNhapHoc_Id = "";
        me.strNhanSu_Id = [];
        $("#tbldata_NhanSu_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
        //
        var listData = $("#tblKeHoach");
        listData.find('input:checkbox').each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        });
        var strKeHoach_Id = edu.util.getValById("dropKeHoachNhapHoc_KHNS");
        if (strKeHoach_Id) {
            var x = $("#tblKeHoach #checkX" + strKeHoach_Id);
            x.attr('checked', true);
            x.prop('checked', true);
        }
    },
    popup_KeHoach: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalKeHoach_KHNS").modal("show");
    },
    popup_NhanSu: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalNhanSu_KHNS").modal("show");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB ==> KeHoachNhanSu
    --Author:
	-------------------------------------------*/
    save_KHNS: function (strKeHoachNhapHoc_Id, strNhanSu_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NH_KeHoachNhanSu/ThemMoi',
            'versionAPI': 'v1.0',
            'strId': me.input_KHNS.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTAICHINH_KeHoach_Id': strKeHoachNhapHoc_Id,
            'dLuonHienThDuChuaDenHan': $('#dLuonHienThDuChuaDenHan').is(":checked") ? 1 : 0,
            'dLuonHienThiDuHetHan': $('#dLuonHienThiDuHetHan').is(":checked") ? 1 : 0,
            'strNguoiDung_Id': strNhanSu_Id,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'NH_KeHoachNhanSu/CapNhat';
            var obj = me.dt_KHNS.find(e => e.ID === obj_save.strId);
            obj_save.strTAICHINH_KeHoach_Id = obj.TAICHINH_KEHOACHNHAPHOC_ID;
            obj_save.strNguoiDung_Id = obj.NGUOIDUNG_ID;
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.input_KHNS.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    //me.getList_KHNS();
                }
                else {
                    edu.system.alert("NH_KeHoachNhanSu.ThemMoi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("NH_KeHoachNhanSu.ThemMoi (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KHNS();
                });
            },
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KHNS: function () {
        var me = this;
        var obj_list = {
            'action': 'NH_KeHoachNhanSu/LayDanhSach',
            'versionAPI': 'v1.0',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'strNguoiDung_Id': "",
            'strTAICHINH_KeHoach_Id': edu.util.getValById("dropKeHoachNhapHoc_KHNS"),
            'strNguoiThucHien_Id': "",
            'strTuKhoa': edu.util.getValById("txtKeyword_Search_KHNS"),
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_KHNS = data.Data;
                    me.genTable_KHNS(data.Data, data.Pager);
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
    getDetail_KHNS: function (strId) {
        var me = this;
        var obj_detail = {
            'action': 'NH_KeHoachNhanSu/LayChiTiet',
            'versionAPI': 'v1.0',
            'strId': me.input_KHNS.strId
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_KHNS = data.Data;
                        me.viewForm_KHNS(data.Data[0]);
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
    delete_KHNS: function (Ids) {
        var me = this;
        var obj_delete = {
            'action': 'NH_KeHoachNhanSu/Xoa',
            'versionAPI': 'v1.0',
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        }
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm(me.html_KHNS);
                    me.getList_KHNS();
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
	--Discription: [1] GEN HTML ==> KeHoachNhanSu
	--Author:
	-------------------------------------------*/
    genTable_KHNS: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.html_KHNS.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachNhanSu.getList_KHNS()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                center:[0, 4, 5],
            },
            aoColumns: [
            {
                "mDataProp": "TAICHINH_KEHOACHNHAPHOC_TEN"
            }
            , {
                "mDataProp": "NGUOIDUNG_TENDAYDU"
            }
            , {
                "mDataProp": "NGUOIDUNG_TAIKHOAN"
            },
            {
                "mRender": function (nRow, aData) {
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                }
            }
            , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.html_KHNS.prefix_id + aData.ID + '" class="' + me.html_KHNS.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_KHNS: function (data) {
        var me = this;
        $("#lblNguoiDung").html(edu.util.returnEmpty(data.NGUOIDUNG_TENDAYDU) + " (" + edu.util.returnEmpty(data.NGUOIDUNG_TAIKHOAN) + ")");
        $("#lblKeHoach").html(edu.util.returnEmpty(data.TAICHINH_KEHOACHNHAPHOC_TEN));

        var x = $("#dLuonHienThDuChuaDenHan");
        var bcheck = false;
        if (data.LUONHIENTHDUCHUADENHAN) bcheck = true;
        x.attr('checked', bcheck);
        x.prop('checked', bcheck);

        var bcheck = false;
        if (data.LUONHIENTHIDUHETHAN) bcheck = true;
        var x = $("#dLuonHienThiDuHetHan");
        x.attr('checked', bcheck);
        x.prop('checked', bcheck);
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> KeHoachNhapHoc
	--ULR:  
	-------------------------------------------*/
    select_KeHoachNhapHoc: function (id) {
        var me = this;
        me.strKeHoachNhapHoc_Id = id;
        var $kehoach_ten = "tenkehoach" + id;
        var $kehoach_khoa = "khoa" + id;
        var $kehoach_thoigian = "thoigian" + id;
        var kehoach_val = edu.util.getTextById($kehoach_ten) + " (" + edu.util.getTextById($kehoach_thoigian) + ") " + edu.util.getTextById($kehoach_khoa)
        //fill into 
        edu.util.viewValById("txtKeHoach_KHNS", kehoach_val);
        //notify
        var obj = {
            renderPlace : "rdKeHoach_KHNS" + id,
            type        : "s",
            title       : "Chọn thành công!",
            autoClose   : true,
        }
        edu.system.notifyLocal(obj);
    },
    cbGenTable_KeHoachNhapHoc: function (data, iPager) {
        var me = main_doc.KeHoachNhanSu;//global variable
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
            strTable_Id: "tblKeHoach",
            aaData: data,
            colPos: {
                center:[0, 2, 3, 4]
            },
            aoColumns: [
                {
                    "mDataProp": "TENKEHOACH"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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
            renderPlace: ["dropKeHoachNhapHoc_KHNS"],
            type: "",
            title: "Chọn kế hoạch nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [3] GEN/ACTION HTML NguoiDung
	--ULR:  
	-------------------------------------------*/
    cbGenTable_NguoiDung: function (data, iPager) {
        var me = main_doc.KeHoachNhanSu;//global variable
        me.objNguoiDung = {
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default
        }
        var jsonForm = {
            strTable_Id: "tbldata_NhanSu_KHNS",
            aaData: data,
            bPaginate: {
                strFuntionName: "edu.system.getList_NguoiDung(main_doc.KeHoachNhanSu.objNguoiDung, '', '', main_doc.KeHoachNhanSu.cbGenTable_NguoiDung)",
                iDataRow: iPager,
            },
            arrClassName: [""],
            "sort": true,
            colPos: {
                left: [1, 2],
                center: [0, 3],
                fix: [0, 3]
            },
            aoColumns: [
            {
                "mRender": function (nRow, aData) {
                    var strHoTen = aData.TENDAYDU;
                    return '<span id="nhansu_ten' + aData.ID + '">' + strHoTen + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    var strTaiKhoan = aData.TAIKHOAN;
                    return '<span id="nhansu_tk' + aData.ID + '">' + strTaiKhoan + '</span>';
                }
            }, {
                "mRender": function (nRow, aData) {
                    return '<a href="#" id="nhansu_id' + aData.ID + '" class="select_nhansu">Chọn</a>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.endLoading();
    },
    select_NhanSu: function (id) {
        var me = this;
        var html = '';
        var obj_notify = {};
        //[1] add to arr
        if (edu.util.arrCheckExist(me.strNhanSu_Id, id)) {
            obj_notify = {
                renderPlace : "nhansu_id" + id,
                type        : "w",
                title       : "Dữ liệu đã tồn tại!",
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace : "nhansu_id" + id,
                type        : "i",
                title       : "Chọn thành công!",
            }
            edu.system.notifyLocal(obj_notify);
            me.strNhanSu_Id.push(id);
        }
        //[2] add html to table
        var $nhansu_ten     = "nhansu_ten" + id;
        var $nhansu_tk = "nhansu_tk" + id;
        var strNhanSu_Ten   = edu.util.getTextById($nhansu_ten);
        var strNhanSu_TK = edu.util.getTextById($nhansu_tk);
        
        html += '<tr id="zone_nhansu' + id + '">';
        html += '<td class="td-fixed td-center">-</td>';
        html += '<td class="td-left">' + strNhanSu_Ten + '</td>';
        html += '<td class="td-center">' + strNhanSu_TK + '</td>';
        html += '<td class="td-fixed td-center"><a id="selected_nhansu_id' + id + '" class="btn remove_nhansu" href="#">Hủy</a></td>';
        html += '</tr>';

        //[3] fill into table 
        var renderPlace = "#tbldata_NhanSu_Selected tbody";
        $(renderPlace).append(html);
    },
    remove_NhanSu: function (id) {
        var me = this;
        //[1] remove from arr
        edu.util.arrExcludeVal(me.strNhanSu_Id, id);
        console.log("me.strNhanSu_Id: " + me.strNhanSu_Id);
        //[2] remove html from table
        var removePlace = "#zone_nhansu" + id;
        $(removePlace).remove();
    },    
}