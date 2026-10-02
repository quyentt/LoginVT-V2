/*----------------------------------------------
--Author: nnthuong
--Phone: 0169 260 2793
--Date of created: 09/11/2017
----------------------------------------------*/
function VaiTroNguoiDung() { };
VaiTroNguoiDung.prototype = {
    strVaiTro_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_VaiTro();
        me.getList_NguoiDung();
        $("[id$=chkSelectAll_VaiTro]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNguoiDung" });
        });
        $("#tblNguoiDung").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblNguoiDung", regexp: /checkX/g, });
        });

        $("#dropSearch_DoiTuong").on("select2:select", function () {
            me.getList_NguoiDung();
        });
        $("#btnSearch").click(function () {
            me.getList_NguoiDung();
        });
        $("#txtSearch_TuKhoa_ND").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDung();
            }
        });
        $("#btnThem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn kế thừa không");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_NguoiDungVaiTro(arrChecked_Id[i]);
                }
            });
        });
        $("#btnDelete_NguoiDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDungDaThem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NguoiDungVaiTro(arrChecked_Id[i]);
                }
            });
        });
    },
    /*----------------------------------------------
    --Discription: [1] Access DB VaiTro
    --API: 
    ----------------------------------------------*/
    getList_VaiTro: function () {
        var me = this;
        //--Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro',
			'iM' : edu.system.iM,
			'type': 'POST',
            'strLoaiVaiTro_Id': "",
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
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
                    me.genTreeJs_Vaitro(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_VaiTro/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_VaiTro/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTreeJs_Vaitro: function (dtResult, iPager) {
        var me = this;
        console.log(1222222222);
        edu.util.viewHTMLById("lblDanhMucTenBang_Tong", iPager);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUNG_VAITRO_CHA_ID",
                name: "TENVAITRO",
                code: ""
            },
            renderPlaces: ["treesjs_vaitro_vtnd"],
            style: "fa fa-user color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#treesjs_vaitro_vtnd').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strVaiTro_Id = strNameNode;
            console.log(1222222222);
            me.getList_NguoiDungDaThem();
        });
    },

    /*----------------------------------------------
    --Discription: [1] Access DB/GenHTML - NguoiDung
    --API:
    ----------------------------------------------*/
    getList_NguoiDung: function () {
        var me = this;
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_TuKhoa_ND"),
            iPageIndex: edu.system.pageIndex_default,
            iPageSize: edu.system.pageSize_default,
            iTrangThai: 1,
            strDonVi_Id: "",
            strVaiTro_Id: "",
            strPhanLoaiDoiTuong: $("#dropSearch_DoiTuong").val(),
            strCapXuLy_Id: "",
            strTinhThanh_Id: ""
        };
        edu.extend.getList_NguoiDung(obj, "", "", me.genTable_NguoiDung);
    },
    genTable_NguoiDung: function (data, iPager) {
        edu.util.viewHTMLById("lblNguoiDung_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.VaiTroNguoiDung.getList_NguoiDung()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer", "btnEdit"],
            colPos: {
                left: [1],
                fix: [0],
                center: [0, 3]
            },
            aoColumns: [
                {
                    "mDataProp": "TAIKHOAN"
                },
                {
                    "mDataProp": "TENDAYDU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    getList_NguoiDungDaThem: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRIPJjQuKAU0LyYXICgVMy4P',
            'func': 'PKG_CORE_QUANTRI_01.LayDSNguoiDungVaiTro',
            'iM': edu.system.iM,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strHanhDong_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuyenCN"] = dtReRult;
                    me.genTable_NguoiDungDaThem(dtReRult, data.Pager);
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
    genTable_NguoiDungDaThem: function (data, iPager) {
        edu.util.viewHTMLById("lblNguoiDung_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDungDaThem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.VaiTroNguoiDung.getList_NguoiDungDaThem()",
                iDataRow: iPager,
                iFilter: true,
            },
            arrClassName: ["tr-pointer", "btnEdit"],
            colPos: {
                left: [1],
                fix: [0],
                center:[0, 3]
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"
                },
                {
                    "mDataProp": "FULLNAME"
                },
                {
                    "mDataProp": "EMAIL"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    save_NguoiDungVaiTro: function (strNguoiDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/FSkkLB4CLjMkHg8pIC8SNB4XICgVMy4P',
            'func': 'PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro',
            'iM': edu.system.iM,
            'strCore_NhanSu_Id': strNguoiDung_Id,
            'strVaiTro_Id': me.strVaiTro_Id,
            'strPhanLoaiNguonTao_Id': edu.system.getValById('dropAAAA'),
            'dLaVaiTroChinh': edu.system.getValById('txtAAAA'),
            'strNguonDuLieu_Id': edu.system.getValById('dropAAAA'),
            'strNgayHieuLuc': edu.system.getValById('txtAAAA'),
            'strNgayHetHieuLuc': edu.system.getValById('txtAAAA'),
            'strCoChePhatSinh_Id': edu.system.getValById('dropAAAA'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NguoiDungDaThem();
                });
            },
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    delete_NguoiDungVaiTro: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeDykgLxI0HhcgKBUzLgPP',
            'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro',
            'iM': edu.system.iM,
            'strId': Ids,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NguoiDungDaThem();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
};