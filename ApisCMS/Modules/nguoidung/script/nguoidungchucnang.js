/*----------------------------------------------
--Author: nnthuong  
--Phone: 
--Date of created: 19/10/2018
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function NguoiDungChucNang() { }
NguoiDungChucNang.prototype = {
    dtUngDung:[],
    dtChucNang: [],
    dtNguoiDungUngDung: [],
    dtNguoiDungChucNang: [],
    strChucNang_Id: '',
    strNguoiDung_Id: '',
    strNguoiDungChucNang_Id: '',

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
        --Discription: [1] Action NguoiDungChucNang
        --Order: 
        -------------------------------------------*/
        $(".btnAddnew").click(function () {
            me.rewrite();
            if (edu.util.checkValue(me.strNguoiDung_Id)) {
                me.toggle_input();
                if (edu.util.checkValue(edu.util.getValById("dropUngDung_NDCN"))) {
                    me.getList_ChucNang();
                }
            }
            else {
                edu.system.alert("Vui lòng chọn người dùng phân quyền chức năng!");
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
        
        /*------------------------------------------
        --Discription: [2] Action NguoiDung
        -------------------------------------------*/
        $("#txtSearch_TuKhoa_NDCN").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDung();
            }
        });
        $(".btnExtend_Search").click(function (e) {
            me.getList_NguoiDung();
        });
        $("#tblNguoiDung_NDCN").delegate(".btnView_NguoiDung", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_list();
                me.strNguoiDung_Id = strId;
                me.getDetail_NguoiDung(strId);
                me.getList_NguoiDungChucNang();
                edu.util.setOne_BgRow(strId, "tblNguoiDung_NDCN");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNguoiDung_NDCN").delegate(".btnPopover_NguoiDung_NDCN", "mouseenter", function () {
            var strId = this.id;
            var obj = this;
            edu.extend.popover_NguoiDung(strId, edu.extend.dtNguoiDung, obj);
        });
        /*------------------------------------------
        --Discription: [3] Action UngDung
        -------------------------------------------*/
        $("#dropUngDung_NDCN").on("select2:select", function () {
            me.getList_ChucNang();
        });
        $("#tblChucNang_NDCN").delegate(".btnAdd_ChucNang", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/add_chucnang/g, strId);
            if (edu.util.checkValue(strId)) {
                me.save_NguoiDungChucNang(strId);
            }
        });
        $("#treesjs_ungdungchucnang_ndcn").delegate(".btnAdd_ChucNang", "click", function (e) {
            var strChucNang_Id = this.id;
            e.preventDefault();
            strChucNang_Id = edu.util.cutPrefixId(/add_chucnang/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                me.save_NguoiDungChucNang(strChucNang_Id);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tableNDCN").delegate(".btnDelete_NguoiDungChucNang", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_nguoidungchucnang/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_NguoiDungChucNang(strId);
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#treesjs_ungdungchucnang_ndcn").delegate(".btnDelete_VaiTroChucNang", "click", function () {
            var strChucNang_Id = this.id;
            strChucNang_Id = edu.util.cutPrefixId(/delete_nguoidungchucnang/g, strChucNang_Id);
            if (edu.util.checkValue(strChucNang_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_NguoiDungChucNang(strChucNang_Id);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("[id$=chkSelectAll_ChucNang]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tableNDCN" });
        });
        $("#tableNDCN").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tableNDCN", regexp: /checkX/g});
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tableNDCN", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu không");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NguoiDungChucNang(arrChecked_Id[i]);
                }
            });
        });
        $('.rdLoaiNguoiDung_ChucNang').on('change', function (e) {
            e.stopImmediatePropagation();
            me.findChucNang();
        });
        $("[id$=chkSelectAll_NguoiDung_ChucNang]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChucNang_NDCN" });
        });

        $("#btnSave_NguoiDung_ChucNang").click(function () {
            var arrThem = [];
            var arrDelete = [];
            var x = $("#treesjs_ungdungchucnang_ndcn .jstree-anchor");
            for (var i = 0; i < x.length; i++) {
                if (x[i].name == 1) {
                    if (!x[i].classList.contains("jstree-clicked")) arrDelete.push(x[i].id.replace(/_anchor/g, ''));
                } else {
                    if (x[i].classList.contains("jstree-clicked")) arrThem.push(x[i].id.replace(/_anchor/g, ''));
                }
            }


            //var arrChecked_Id = edu.util.getArrCheckedIds("tblChucNang_NDCN", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng cần lưu?");
            //    return;
            //}
            edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và xóa " + arrDelete.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessDanhMucTuKhoa"></div>');
                edu.system.genHTML_Progress("zoneprocessDanhMucTuKhoa", arrThem.length + arrDelete.length);
                for (var i = 0; i < arrThem.length; i++) {
                    me.save_NguoiDungChucNang(arrThem[i]);
                }
                for (var i = 0; i < arrDelete.length; i++) {
                    me.delete_NguoiDungChucNang(arrDelete[i]);
                }
            });
        });

        $("#chkSelectAll").on("click", function () {
            var checked_status = $("#chkSelectAll").is(':checked');
            $("#treesjs_ungdungchucnang_ndcn .jstree-anchor").each(function () {
                if (checked_status) {
                    this.classList.add("jstree-clicked");
                } else {
                    this.classList.remove("jstree-clicked");
                }
            });
        });
        //Test
        //var strId = "4038E6FD0FFA4D339FA991E740348F01";
        //me.toggle_list();
        //me.strNguoiDung_Id = strId;
        //me.getList_NguoiDungChucNang();
        //edu.util.setOne_BgRow(strId, "tblNguoiDung_NDCN");
        //End test
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
        me.strChucNang_Id = "";
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-ndcn", "zone_list_ndcn");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-ndcn", "zone_input_ndcn");
    },
    /*----------------------------------------------
    --Discription: [1] Access DB/GenHTML - NguoiDung
    --API:  
    ----------------------------------------------*/
    getList_NguoiDung: function () {
        var me = this;
        
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_TuKhoa_NDCN"),
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
        edu.util.viewHTMLById("lblNguoiDung_NDCN", data[0].TENDAYDU);
    },
    genTable_NguoiDung: function (data, iPager) {
        var me = main_doc.NguoiDungChucNang;
        edu.util.viewHTMLById("tblNguoiDung_Tong", iPager); 
        var jsonForm = {
            strTable_Id: "tblNguoiDung_NDCN",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NguoiDungChucNang.getList_NguoiDung()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiDung_NDCN", "btnView_NguoiDung"],
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
        
        me.getList_UngDung();
    },
    /*----------------------------------------------
    --Discription: [2] Access DB/GenHTML - NguoiDungChucNang
    --API:  
    ----------------------------------------------*/
    save_NguoiDungChucNang: function (strChucNang_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_QuanLyNguoiDung/ThemNguoiDungChucNang',
            

            'strId'                 : "",
            'strChucNang_Id'        : strChucNang_Id,
            'strNguoiDung_Id'       : me.strNguoiDung_Id,
            'dHOATDONG_XEM'         : 1,
            'dHOATDONG_XOA'         : 1,
            'dHOATDONG_SUA'         : 1,
            'dHOATDONG_THEM'        : 1,
            'dHOATDONG_BAOCAO'      : 1,
            'dHOATDONG_KHAC'        : 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strUngDung_Id': ""
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm thành công!");
                    me.getList_ChucNang();
                }
                else {
                    edu.system.alert("CMS_NguoiDungChucNang/ThemMoi: " + data.Message);
                }
                
            },
            complete: function () {
                edu.system.start_Progress("zoneprocessDanhMucTuKhoa", function () {
                    me.getList_NguoiDungChucNang();
                    me.getList_ChucNang();
                });
            },
            error: function (er) {
                
                edu.system.alert("CMS_NguoiDungChucNang/ThemMoi (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NguoiDungChucNang: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_Quyen/LayDSChucNangTheoNguoiDung_Id',
            'type': 'GET',
            'strNguoiDung_Id': me.strNguoiDung_Id,
            'strUngDung_Id': "",
            'strNgonNgu_Id': edu.util.getValById('dropAAAA'),
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
                    me.dtNguoiDungChucNang = dtResult;
                    me.process_NguoiDungUngDung(dtResult);
                    me.genTable_NguoiDungChucNang(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_TaiKhoan/LayDanhSachNguoiDungChucNang: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_TaiKhoan/LayDanhSachNguoiDungChucNang (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            async: false,
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_NguoiDungChucNang: function (strNguoiDungChucNang_Id) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_list = {
            'action': 'CMS_QuanLyNguoiDung/XoaChucNangTheoNguoiDung',
            

            'strNguoiDung_Id': me.strNguoiDung_Id,
            'strUngDung_Id': strNguoiDungChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    //me.removeDeleted_NguoiDungChucNang(strNguoiDungChucNang_Id);
                    //me.getList_NguoiDungChucNang();
                }
                else {
                    obj = {
                        content: "CMS_NguoiDungChucNang/Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                obj = {
                    content: "CMS_NguoiDungChucNang/Xoa: " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: "POST",
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessDanhMucTuKhoa", function () {
                    me.getList_NguoiDungChucNang();
                    me.getList_ChucNang();
                });
            },
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTable_NguoiDungChucNang: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblTong_NDCN", data.length);
        var html = "";
        me.insertHeaderTable("tableNDCN", data, null);
        //var jsonForm = {
        //    strTable_Id: "tableNDCN",
        //    aaData: data,
        //    colPos: {
        //        left: [1, 2],
        //        fix: [0],
        //        center: [0, 2, 3]
        //    },
        //    aoColumns: [
        //        {
        //            "mDataProp": "TENCHUCNANG"
        //        }
        //        , {
        //            "mDataProp": "VAITROTHEOCHUCNANG"
        //        }
        //        , {
        //            "mData": "Delete",
        //            "mRender": function (nRow, aData) {

        //                return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
        //            }
        //        }
        //    ]
        //};
        //edu.system.loadToTable_data(jsonForm);
        /*III. Callback */
    },
    insertHeaderTable: function (strTable_Id, objTotal, strQuanHeCha) {
        var me = this;
        //Khởi tạo table
        $("#" + strTable_Id + " tbody").html('');
        var imaxlength = 0;
        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        //for (var k = 0; k < me.dtNguoiDungUngDung.length; k++) {
        //    var obj = edu.util.objGetDataInData(me.dtNguoiDungUngDung[k].ID, objTotal, "CHUNG_UNGDUNG_ID");
        //    if (obj.length > 0) {
        //        $("#" + strTable_Id + " tbody").append('<tr><td rowspan="' + (obj.length + 1) + '">' + me.dtNguoiDungUngDung[k].TENUNGDUNG + '</td></tr>');
        //    }
        //}
        for (var k = 0; k < me.dtNguoiDungUngDung.length; k++) {
            var obj = edu.util.objGetDataInData(me.dtNguoiDungUngDung[k].ID, objTotal, "CHUNG_UNGDUNG_ID");
            var iDemCha = 0;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].CHUCNANGCHA_ID == strQuanHeCha) {
                    var tempCheck = recuseHeader(obj, obj[i], 0);
                    if (tempCheck == 0) {
                        iDemCha += 1;
                    } else {
                        iDemCha += tempCheck;
                    }
                }
            }
            if (obj.length > 0) {
                $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - iDemCha]).prepend('<td rowspan="' + iDemCha + '" name="1">' + me.dtNguoiDungUngDung[k].TENUNGDUNG + '</td>');
            }
        }
        //Chỉnh sửa colspan cho phần tử đầu tiên
        me.iMaxLength = imaxlength;
        //document.getElementById("lblThongTinBang").colSpan = imaxlength + 1;
        //Add rowspan cho các thành phần không có phần từ con
        var x = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].rowSpan;
                if (z == 1 && $(x[i].cells[j]).attr("name") != 1) {
                    x[i].cells[j].colSpan = (imaxlength + 2 - x[i].cells[j].colSpan);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.ID);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].ID);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }
        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            var strTenChucNang = objHead.TENCHUCNANG;
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            if (colspan == 0) {
                arrHeaderId.push(objHead.ID);
                $("#" + strTable_Id + " tbody").append('<tr><td colspan="' + (iThuTu + 1) + '">' + strTenChucNang + '</td></tr>');
                if (iThuTu > imaxlength) imaxlength = iThuTu;
            }
            else {
                if (colspan == 1) {
                    $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td rowspan="' + colspan + '" name="1">' + strTenChucNang + '</td>');
                } else
                    $($("#" + strTable_Id + " tbody tr")[arrHeaderId.length - colspan]).prepend('<td rowspan="' + colspan + '" >' + strTenChucNang + '</td>');
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].CHUCNANGCHA_ID == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    checkExist_NguoiDungChucNang: function () {
        //check dtNguoiDungChucNang exist in dtChucNang
        var me = this;
        for (var i = 0; i < me.dtChucNang.length; i++) {
            console.log("me.dtChucNang[i].ID: " + me.dtChucNang[i].ID);
            if (edu.util.objEqualVal(me.dtNguoiDungChucNang, "ID", me.dtChucNang[i].ID)) {
                //1. remove action
                var render = "add_chucnang" + me.dtChucNang[i].ID;
                $("#" + render).parent().parent().remove();
                //2. notify
                var obj_notify = {
                    renderPlace: render
                };
                edu.system.notifyLocal(obj_notify);
            }
        }
    },
    findChucNang: function () {
        //var strKey = $('input[name="rdLoaiNguoiDung_ChucNang"]:checked').val();
        //$("#tblChucNang_NDCN tr").filter(function () {
        //    $(this).toggle($(this).html().indexOf(strKey) > -1);
        //}).css("color", "red");
    },

    removeDeleted_NguoiDungChucNang: function (strId) {
        //remove html of item deleted instead of calling from db to get new data
        var place = "#" + strId;
        $(place).remove();
    },
    /*----------------------------------------------
    --Discription: [3] Access DB/GenHTML - UngDung/ChucNang
    --API:  
    ----------------------------------------------*/
    getList_UngDung: function () {
        var me = this;

        //--Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
			'iM' : edu.system.iM,

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000,
            'dTrangThai': 1
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
                    me.dtUngDung = dtResult;
                    me.genCombo_UngDung(dtResult);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_UngDung/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_UngDung: function () {
        var me = this;
        var obj = {
            data: me.dtUngDung,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "MAUNGDUNG"
            },
            renderPlace: ["dropUngDung_NDCN"],
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ChucNang: function () {
        var me = this;

        //--Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachChucNang',
			'iM' : edu.system.iM,
            'versionAPI'    : 'v1.0',
            'strTuKhoa'     : "",
            'strChung_UngDung_Id' : edu.util.getValById("dropUngDung_NDCN"),
            'strCha_Id'     : "",
            'pageIndex'     : 1,
            'pageSize'      : 10000,
            'strPhamViTruyCap_Id': "",
            'dTrangThai'    : 1
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
                    me.dtChucNang = dtResult;
                    //me.genTable_ChucNang(dtResult, iPager);
                    me.checkExist_NguoiDungChucNang();
                    me.loadToTree_VaiTroUngDung(dtResult, iPager);
                    me.findChucNang();
                }
                else {
                    edu.system.alert("CMS_ChucNang/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_ChucNang/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChucNang: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblChucNang_Tong_NDCN", iPager);
        var jsonForm = {
            strTable_Id: "tblChucNang_NDCN",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0],
                center: [0, 2, 3]
            },
            aoColumns: [
                {
                    "mData": "TENCHUCNANG",
                    "mRender": function (nRow, aData) {
                        var strTenChucNang = aData.TENCHUCNANG;
                        while (edu.util.checkValue(aData.CHUCNANGCHA_ID)) {
                            aData = edu.util.objGetOneDataInData(aData.CHUCNANGCHA_ID, data, "ID");
                            strTenChucNang = aData.TENCHUCNANG + " -> " + strTenChucNang;
                        }
                        return strTenChucNang;
                    }
                }
                , {
                    "mData": "Delete",
                    "mRender": function (nRow, aData) {
                        return '<a class="btn btn-default btn-circle color-active btnAdd_ChucNang" id="add_chucnang' + aData.ID + '" title="Delete" ><i class="fa fa-plus"></i></a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback */
    },
    /*----------------------------------------------
    --Discription: [4] Access DB/GenHTML - NguoiDung_UngDung
    --API:  
    ----------------------------------------------*/
    process_NguoiDungUngDung: function (data) {
        var me = this;
        var dtNguoiDungUngDung = [];
        for (var ud = 0; ud < me.dtUngDung.length; ud++) {
            for (var cn = 0; cn < data.length; cn++) {
                if (me.dtUngDung[ud].ID === data[cn].CHUNG_UNGDUNG_ID) {
                    if (!edu.util.objEqualVal(dtNguoiDungUngDung, "ID", me.dtUngDung[ud].ID)) {
                        dtNguoiDungUngDung.push(me.dtUngDung[ud]);
                    }
                }
            }
        }
        me.dtNguoiDungUngDung = dtNguoiDungUngDung;
        me.genTreeJs_NguoiDungUngDung(dtNguoiDungUngDung);
    },
    genTreeJs_NguoiDungUngDung: function (dtResult) {
        var me = this;
        edu.util.viewHTMLById("lblVaiTroNguoiDung_Tong_NDCN", dtResult.length);
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: ""
            },
            renderPlaces: ["zone_nguoidungungdung"],
            style: "fa fa-hdd-o color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_nguoidungungdung').on("select_node.jstree", function (e, data) {
            var strUngDung_Id = data.node.id;
            me.process_UngDung_ChucNang(strUngDung_Id);
            $("#dropUngDung_NDCN").val(strUngDung_Id).trigger("change");
            me.getList_ChucNang();
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
    /*----------------------------------------------
    --Discription: [5] Access DB/GenHTML - UngDung_ChucNang
    --API:  
    ----------------------------------------------*/
    process_UngDung_ChucNang: function (strUngDung_Id) {
        var me = this;
        var data = edu.util.objGetDataInData(strUngDung_Id, me.dtNguoiDungChucNang, "CHUNG_UNGDUNG_ID");
        me.genTable_NguoiDungChucNang(data);
    },

    
    loadToTree_VaiTroUngDung: function (dtResult, iPager) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "CHUCNANGCHA_ID",
                name: "TENCHUCNANG",
                code: "",
                check: true
                //mRender: function (nRow, aData) {
                //    return '<span>' + aData.TENCHUCNANG +'</span> <span class="submit btn btn-primary pull-right btnSelectHocPhan" id="btnSelect_701380FF6CB4407A80E754DF7905A415"><i class="fa fa-forward"></i> <span class="lang" key="lb_luu">Chọn</span></span>';
                //}
            },
            renderPlaces: ["treesjs_ungdungchucnang_ndcn"],
            style: "fa fa-opera color-active",
            splitString: 10000
        };
        me.loadToTreejs_data(obj);
        for (var i = 0; i < dtResult.length; i++) {
            //if (edu.util.objGetOneDataInData(dtResult[i].ID, dtResult, "CHUCNANGCHA_ID").length == 0) {
            //    var dtCheck = edu.util.objGetOneDataInData(dtResult[i].ID, me.dtNguoiDungChucNang, "ID");
            //    if (dtCheck.length == 0) strThemMoi = '<i class="fa fa-plus color-active poiter btnAdd_ChucNang" id="add_chucnang' + dtResult[i].ID + '"></i>';
            //    else {
            //        strDelete = '<i class="fa fa-trash color-active poiter btnDelete_VaiTroChucNang" id="delete_nguoidungchucnang' + dtResult[i].ID + '" ></i>';
            //        if (dtCheck.TINHTRANGDONGBO == 0) strSync = '<i class="fa fa-recycle color-active poiter btnSync" id="sync_' + dtResult[i].ID + '"></i>';
            //    }
            //    $($("#treesjs_ungdungchucnang_ndcn #" + dtResult[i].ID)[0]).append('<span class="pull-right zoneChucNang"><span style="padding-right: 20px">' + strThemMoi + '</span><span style="padding-right: 20px;">' + strSync + '</span><span>' + strDelete + '</span></span>');

            //}
            var dtCheck = edu.util.objGetOneDataInData(dtResult[i].ID, me.dtNguoiDungChucNang, "ID");
            if (dtCheck.length != 0) {
                var xpoint = document.getElementById(dtResult[i].ID + "_anchor");
                if (xpoint != null && xpoint != undefined) {
                    document.getElementById(dtResult[i].ID + "_anchor").classList.add("jstree-clicked");
                    document.getElementById(dtResult[i].ID + "_anchor").name = 1;
                }
            }
            //$($("#treesjs_ungdungchucnang_ndcn #" + dtResult[i].ID)[0]).append('<span class="pull-right"><input type="checkbox" ' + strCheck +' id="checkX' + dtResult[i].ID + '" class="' + dtResult[i].CHUCNANGCHA_ID +'"></span>');
        }
    },
    loadToTreejs_data: function (obj) {
        var me = this;
        var data = obj.data;
        var render = obj.renderInfor;
        var render_places = obj.renderPlaces;
        var iStringSplit = obj.splitString;

        if (iStringSplit == undefined) iStringSplit = 30;
        if (render == undefined) render = {
            id: "ID",
            parentId: "CHUCNANGCHA_ID",
            name: "TENCHUCNANG",
            code: ""
        };

        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;

        var place = "";
        for (var p = 0; p < render_places.length; p++) {
            var node = "";
            node += '<ul>';
            if (edu.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
                $(place).jstree('destroy');
            }
            if (data.length > 0) {
                node += userRender(data, null);
            }
            else {
                node += '<li>Không tìm thấy dữ liệu!</li>';
            }
            node += '</ul>';
            $(place).append(node);
            configTreejs();
        }
        //processing functions
        function userRender(obj, parentId) {
            var row = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][parent_id] == parentId) {
                    if (render.Render == undefined) {
                        var strName = "";
                        if (render != undefined && render.mRender != undefined) {
                            strName = render.mRender(i, obj[i]);
                        } else {
                            strName = obj[i][name];
                        }
                        row += '<li class="btnEvent jstree-open" id="' + obj[i][id] + '" title="' + obj[i][name] + '">' + edu.util.splitString(strName, iStringSplit);
                    } else {
                        if (render.Render != undefined) {
                            row += render.Render(i, obj[i]);
                        }
                    }
                    row += '<ul>';
                    row += userRender(obj, obj[i][id]);
                    row += '</ul>';
                    row += '</li>';
                }
            }
            return row;
        }

        function configTreejs() {
            //1. check
            if (edu.util.checkValue(obj.check)) {
                var arr_checked = obj.arrChecked;
                //1. config to allow check in treejs
                $(place).jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"]
                });
                //2.the way to refresh treejs --> when update something new
                $(place).one("refresh.jstree", function (e, data) {
                    if (edu.util.checkValue(arr_checked)) {
                        for (var i = 0; i < arr_checked.length; i++) {
                            data.instance.select_node(arr_checked[i]);
                        }
                    }
                }).jstree(true).refresh();
            }
            //2. style user
            else {
                if (edu.util.checkValue(obj.style)) {//user style-user
                    $(place).jstree({
                        "types": {
                            "default": {
                                "icon": obj.style
                            }
                        },
                        "plugins": ["checkbox"],
                    });
                }
                else {
                    $(place).jstree();//default user
                }
                $(place).jstree(true).refresh();
                $(place).one("refresh.jstree").jstree(true).refresh();
            }
        }
    },
};