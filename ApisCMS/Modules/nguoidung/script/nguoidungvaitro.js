/*----------------------------------------------
--Author: nnthuong
--Phone:
--Date of created: 19/10/2018
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function NguoiDungVaiTro() { }
NguoiDungVaiTro.prototype = {
    dtVaiTro: [],
    dtNguoiDungVaiTro: [],
    dtNguoiDungChucNang: [],
    strVaiTro_Id: '',
    strNguoiDung_Id: '',
    strNguoiDungVaiTro_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial Page
        -------------------------------------------*/
        me.getList_NguoiDung();

        me.toggle_list();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order:
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        /*------------------------------------------
        --Discription: [1] Action NguoiDungVaiTro
        --Order:
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            me.rewrite();
            if (edu.util.checkValue(me.strNguoiDung_Id)) {
                me.toggle_input();
            }
            else {
                edu.system.alert("Vui lòng chọn người dùng cần phân quyền!");
            }
        });
        $(".btnDelete").click(function () {
            if (edu.util.checkValue(me.strNguoiDung_Id)) {
                me.toggle_delete();
            }
            else {
                edu.system.alert("Vui lòng chọn người dùng cần xóa quyền!");
            }
        });
        $("#tableAdd_NDVT").delegate(".btnSave_VaiTro", "click", function () {
            var strVaiTro_Id = this.id;
            strVaiTro_Id = edu.util.cutPrefixId(/save_vaitro/g, strVaiTro_Id);

            if (edu.util.checkValue(strVaiTro_Id)) {
                me.save_NguoiDungVaiTro(strVaiTro_Id);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tableDelete_NDVT").delegate(".btnDelete_VaiTro", "click", function () {
            var strVaiTro_Id = this.id;
            strVaiTro_Id = edu.util.cutPrefixId(/delete_vaitro/g, strVaiTro_Id);
            if (edu.util.checkValue(strVaiTro_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_NguoiDungVaiTro(strVaiTro_Id);
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action NguoiDung
        -------------------------------------------*/
        $("#txtSearch_TuKhoa_NDVT").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDung();
            }
        });

        $(".btnExtend_Search").click(function (e) {
            me.getList_NguoiDung();
        });
        $("#tblNguoiDung_NDVT").delegate(".btnView_NguoiDung", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.strNguoiDung_Id = strId;
                me.getDetail_NguoiDung(strId);
                edu.util.setOne_BgRow(strId, "tblNguoiDung_NDVT");
                //1
                me.getList_NguoiDungVaiTro();
                //2. reset chucnang table
                me.genTable_VaiTroChucNang([]);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNguoiDung_NDVT").delegate(".btnPopover_NguoiDung_NDVT", "mouseenter", function () {
            var strId = this.id;
            var obj = this;
            edu.extend.popover_NguoiDung(strId, edu.extend.dtNguoiDung, obj);
        });
        $('.rdLoaiNguoiDung_VaiTro').on('change', function (e) {
            e.stopImmediatePropagation();
            me.findChucNang();
        });
    },
    /*----------------------------------------------
    --Discription: function common
    ----------------------------------------------*/
    rewrite: function () {
        var me = this;
        edu.util.resetValById("txtVaiTro_Ten");
        edu.util.resetValById("txtVaiTro_Ma");
        edu.util.resetValById("txtVaiTro_ThuTuHienThi");
        edu.util.resetValById("txtVaiTro_MoTa");
        edu.util.resetValById("dropVaiTro_Loai");
        me.strVaiTro_Id = "";
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-ndvt", "zone_bus_list");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-ndvt", "zone_bus_input");
    },
    toggle_delete: function () {
        edu.util.toggle_overide("zone-bus-ndvt", "zone_bus_delete");
    },
    /*----------------------------------------------
    --Discription: [1] Access DB/GenHTML - NguoiDung
    --API:
    ----------------------------------------------*/
    getList_NguoiDung: function () {
        var me = this;
        
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_TuKhoa_NDVT"),
            iPageIndex: edu.system.pageIndex_default,
            iPageSize: edu.system.pageSize_default,
            iTrangThai: 1,
            strDonVi_Id: "",
            strVaiTro_Id: "",
            strPhanLoaiDoiTuong: "",
            strCapXuLy_Id: "",
            strTinhThanh_Id: ""
        };
        edu.extend.getList_NguoiDung(obj, "", "", me.genTable_NguoiDung);
    },
    getDetail_NguoiDung: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, edu.extend.dtNguoiDung, "ID", me.viewForm_NguoiDung);
    },
    viewForm_NguoiDung: function (data) {
        var me = this;
        //view data
        edu.util.viewHTMLById("lblNguoiDung_NDVT", data[0].TENDAYDU);
    },
    genTable_NguoiDung: function (data, iPager) {
        var me = main_doc.NguoiDungVaiTro;
        edu.util.viewHTMLById("tblNguoiDung_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDung_NDVT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NguoiDungVaiTro.getList_NguoiDung()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiDung_NDVT", "btnView_NguoiDung"],
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(aData.HINHDAIDIEN);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDAYDU) + "</span><br />";
                        html += '<span class="italic">' + edu.util.returnEmpty(aData.EMAIL) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
        me.getList_VaiTro();
    },
    /*----------------------------------------------
    --Discription: [2] Access DB/GenHTML - NguoiDungVaiTro
    --API:
    ----------------------------------------------*/
    save_NguoiDungVaiTro: function (strVaiTro_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_NguoiDungVaiTro/ThemMoi',
            

            'strId': "",
            'strVaiTro_Id': strVaiTro_Id,
            'strNguoiDung_Id': me.strNguoiDung_Id
        };
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/FSkkLB4CLjMkHg8pIC8SNB4XICgVMy4P',
            'func': 'PKG_CORE_QUANTRI_02.Them_Core_NhanSu_VaiTro',
            'iM': edu.system.iM,
            'strCore_NhanSu_Id': me.strNguoiDung_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'strPhanLoaiNguonTao_Id': edu.system.getValById('dropAAAA'),
            'dLaVaiTroChinh': edu.system.getValById('txtAAAA'),
            'strNguonDuLieu_Id': edu.system.getValById('dropAAAA'),
            'strNgayHieuLuc': edu.system.getValById('txtAAAA'),
            'strNgayHetHieuLuc': edu.system.getValById('txtAAAA'),
            'strCoChePhatSinh_Id': edu.system.getValById('dropAAAA'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj_notify = {
                        renderPlace: "save_vaitro" + strVaiTro_Id,
                        type: "i",
                        title: "Thêm thành công!"
                    };
                    edu.system.notifyLocal(obj_notify);
                    me.getList_NguoiDungVaiTro();
                }
                else {
                    edu.system.alert("CMS_VaiTro/ThemMoi: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_VaiTro/ThemMoi (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NguoiDungVaiTro: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_NguoiDungVaiTro/LayVaiTroTheoNguoiDung',
            

            'strNguoiDung_Id': me.strNguoiDung_Id
        };
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRIXICgVMy4PJjQuKAU0LyYP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung',
            'iM': edu.system.iM,
            'strChucNang_Id': '',
            'strNguoiThucHien_Id': me.strNguoiDung_Id
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
                    me.dtNguoiDungVaiTro = dtResult;
                    me.genTreeJs_NguoiDungVaiTro(dtResult);
                    me.genTable_NguoiDungVaiTro(dtResult);
                    me.genTable_VaiTro(me.dtVaiTro, 0);
                    me.checkExist_NguoiDungVaiTro();

                    me.findChucNang();
                    //
                    //me.getList_NguoiDungChucNang();
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
    delete_NguoiDungVaiTro: function (strVaiTro_Id) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_list = {
            'action': 'CMS_NguoiDungVaiTro/Xoa',
            

            'strNguoiDung_Id': me.strNguoiDung_Id,
            'strVaiTro_Id': strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/GS4gHgIuMyQeDykgLxI0HhcgKBUzLgPP',
            'func': 'PKG_CORE_QUANTRI_02.Xoa_Core_NhanSu_VaiTro',
            'iM': edu.system.iM,
            'strId': strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NguoiDungVaiTro();
                }
                else {
                    obj = {
                        content: "CMS_NguoiDungVaiTro/Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                obj = {
                    content: "CMS_NguoiDungVaiTro/Xoa: " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTreeJs_NguoiDungVaiTro: function (dtResult) {
        var me = this;
        edu.util.viewHTMLById("lblVaiTroNguoiDung_Tong_NDVT", dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENVAITRO",
                code: ""
            },
            renderPlaces: ["zone_nguoidungvaitro"],
            style: "fa fa-user color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_nguoidungvaitro').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strVaiTro_Id = strNameNode;
            me.getList_VaiTroChucNang(strNameNode);
            //----------------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name,
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //---------------------------------------------------------------------------------------------------------
        });
    },
    genTable_NguoiDungVaiTro: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tableDelete_NDVT",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0],
                center: [0, 2]
            },
            aoColumns: [
                {
                    "mDataProp": "TENVAITRO"
                }
                , {
                    "mData": "Delete",
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btn-circle color-active btnDelete_VaiTro" id="delete_vaitro' + aData.ID + '" title="Delete" ><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback */
    },
    checkExist_NguoiDungVaiTro: function () {
        //check dtNguoiDungVaiTro exist in dtVaiTro
        var me = this;
        for (var i = 0; i < me.dtVaiTro.length; i++) {
            if (edu.util.objEqualVal(me.dtNguoiDungVaiTro, "ID", me.dtVaiTro[i].ID)) {
                //1. remove action
                var render = "save_vaitro" + me.dtVaiTro[i].ID;
                $("#" + render).removeClass("btnSave_VaiTro");
                //2. notify
                var obj_notify = {
                    renderPlace: render
                };
                edu.system.notifyLocal(obj_notify);
            }
        }
    },
    findChucNang: function () {
        var strKey = $('input[name="rdLoaiNguoiDung_VaiTro"]:checked').val();
        $("#tableAdd_NDVT tr").filter(function () {
            $(this).toggle($(this).html().indexOf(strKey) > -1);
        }).css("color", "red");
    },
    /*----------------------------------------------
    --Discription: [2] Access DB - NguoiDungVaiTro
    --API:
    ----------------------------------------------*/
    getList_VaiTroChucNang: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJg8mNC4oBTQvJgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung',
            'iM': edu.system.iM,
            'strChucNang_Id': '',
            'strVaiTro_Id': me.strVaiTro_Id,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data.rs;
                    iPager = data.Pager;
                    //me.process_NguoiDung_VaiTro_ChucNang(dtResult);
                    me.genTable_VaiTroChucNang(dtResult, iPager);
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
            
            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [2] Access DB - NguoiDungChucNang
    --API:
    ----------------------------------------------*/
    getList_NguoiDungChucNang: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_Quyen/LayDSChucNangTaoCay',
            'type': 'GET',
            'strNguoiDung_Id': me.strNguoiDung_Id,
            'strUngDung_Id': edu.system.appId,
            'strNgonNgu_Id': edu.util.getValById('dropAAAA'),
        };
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJg8mNC4oBTQvJgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung',
            'iM': edu.system.iM,
            'strChucNang_Id': '',
            'strVaiTro_Id': me.strVaiTro_Id,
            'strNguoiThucHien_Id': me.strNguoiDung_Id,
        };
        
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data.rs;
                    iPager = data.Pager;
                    me.dtNguoiDungChucNang = dtResult;
                }
                else {
                    edu.system.alert("CMS_TaiKhoan/LayDanhSachNguoiDungChucNang: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_TaiKhoan/LayDanhSachNguoiDungChucNang (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [2] GenHTML - NguoiDung_VaiTro_ChucNang
    --API:
    ----------------------------------------------*/
    process_NguoiDung_VaiTro_ChucNang: function (dtVaiTroChucNang) {
        //xu ly tinh huong cho bai toan nhu sau
        //1 user duoc phan 1 VaiTro (VaiTro tap hop cac ChucNang)
        //Mot trong so ChucNang thuoc VaiTro do khong duoc phan cho user, nhung van mong muon phan cho user VaiTro do
        //Vay phai show cho user biet trong so ChucNnang thuoc VaiTro. ChucNang nao khong duoc phan cho user
        //Su dung thuoc tinh TRANGTHAI de phan biet [1 - duoc phan, 0 - khong duoc phan]
        var me = this;
        var check = false;
        var data = [];
        for (var i = 0; i < dtVaiTroChucNang.length; i++) {
            check = false;
            for (var j = 0; j < me.dtNguoiDungChucNang.length; j++) {
                if (dtVaiTroChucNang[i].MACHUCNANG === me.dtNguoiDungChucNang[j].MACHUCNANG) {
                    check = true;
                }
            }
            if (!check) {
                dtVaiTroChucNang[i].TRANGTHAI = 0;
            }
            data.push(dtVaiTroChucNang[i]);
        }
        me.genTable_VaiTroChucNang(data);
    },
    genTable_VaiTroChucNang: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblChucNang_Tong_NDVT", data.length);
        var iTinhTrang;
        var jsonForm = {
            strTable_Id: "tblVaiTroChucNang_NDVT",
            aaData: data,
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MACHUCNANG"
                }
                , {
                    "mDataProp": "TENCHUCNANG"
                }
                , {
                    "mDataProp": "CHUNG_UNGDUNG"
                }
                , {
                    "mData": "TRANGTHAI",
                    "mRender": function (nRow, aData) {
                        iTinhTrang = aData.TRANGTHAI;
                        if (iTinhTrang === 0) {
                            iTinhTrang = '<span class="color-warning">Not Active</span>';
                        }
                        else {
                            iTinhTrang = '<span class="color-active">Active</span>';
                        }
                        return iTinhTrang;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    /*----------------------------------------------
    --Discription: [3] Access DB/GenHTML - VaiTro
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
            'dTrangThai': 1,
            'strChung_VaiTro_Cha_Id': edu.util.getValById('dropAAAA'),
            
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
                    me.dtVaiTro = dtResult;
                    me.genTable_VaiTro(dtResult, iPager);
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
    genTable_VaiTro: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblVaiTro_Tong_NDVT", iPager);
        var jsonForm = {
            strTable_Id: "tableAdd_NDVT",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0],
                center: [0, 2]
            },
            aoColumns: [
                {
                    "mDataProp": "TENVAITRO"
                }
                , {
                    "mData": "Add",
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btn-circle color-active btnSave_VaiTro" id="save_vaitro' + aData.ID + '" title="Add" ><i class="fa fa-plus"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback */
    }
};