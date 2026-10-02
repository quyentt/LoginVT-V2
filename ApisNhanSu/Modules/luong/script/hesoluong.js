/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function HeSoLuong() { };
HeSoLuong.prototype = {
    strNhanSu_QuyDinhLuong_Id: '',
    dtHeSoLuong: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#zoneEdit").delegate('.btnAdd', 'click', function (e) {
            var strId = this.id;
            me.popup_NBHS();
        });
        $("#myModal_NgachBacHeSoLuong").delegate('#btnSave_NBHS', 'click', function (e) {
            var strId = this.id;
            me.save_NBHS();
        });
        $("#tblQuyDinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            $("#zoneEdit").slideDown();
            me.strNhanSu_QuyDinhLuong_Id = strId;
            edu.util.setOne_BgRow(strId, "tblQuyDinh");
            me.getList_BangHeSoLuong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_MucLuongCoBan();
            }
        });
        $("#btnSearch").click(function () {
            me.getList_ThoiGianDaoTao();
        });
        $("#btnSave_QuyDinhHeSoLuong").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số lương không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblQuyDinhHeSoLuong";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
                var arrSave = [];
                for (var i = 0; i < arrElement.length; i++) {
                    var temp = $(arrElement[i]).attr("title");
                    if (temp == undefined) temp = "";
                    if (arrElement[i].value != temp) {
                        arrSave.push(arrElement[i]);
                    }
                }
                if (arrSave.length == 0) {
                    $("#myModalAlert #alert_content").html("Chưa có hế số mới nào cần lưu");
                    return;
                }
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_BangHeSoLuong(arrSave[i]);
                }
            });
        });
        $("#zoneEdit").delegate(".btnDelete", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_BangHeSoLuong(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_MucLuongCoBan();
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NGACH", "", "", me.genCombo_Ngach);
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.NHOMNGACH", "dropNBHS_Nhom");
        edu.system.loadToCombo_DanhMucDuLieu("LUONG.LOAIHESOLUONG", "dropNBHS_Loai");
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_MucLuongCoBan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
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
                    me.genTable_MucLuongCoBan(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_BangQuyDinhLuong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_BangQuyDinhLuong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_MucLuongCoBan: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblQuyDinh_Tong", data.length);

        var jsonForm = {
            strTable_Id: "tblQuyDinh",
            aaData: data,
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += "<span>" + edu.util.returnEmpty(aData.MUCLUONGCOBAN) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    save_BangHeSoLuong: function (point) {
        var me = this;
        var strId = $(point).attr("name");
        var dtLuong = edu.util.objGetDataInData(strId, me.dtHeSoLuong, "ID")[0];
        var dHeSoLuong = $(point).val();
        var obj_save = {
            'action': 'L_BangHeSoLuong/ThemMoi',
            

            'strId': '',
            'strNhanSu_QuyDinhLuong_Id': me.strNhanSu_QuyDinhLuong_Id,
            'strNgach_Id': dtLuong.NGACH_ID,
            'dBac': dtLuong.BAC,
            'strNhom_Id': dtLuong.NHOM_ID,
            'strLoai_Id': dtLuong.LOAI,
            'dHeSoLuong': dHeSoLuong,
            'strGhiChu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId.length == 32) {
            obj_save.action = 'L_BangHeSoLuong/CapNhat';
            obj_save.strId = strId;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endLuuHeSo: function () {
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
    },
    getList_BangHeSoLuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_BangHeSoLuong/LayDanhSach',
            
            
            'strTuKhoa': "",
            'strNgach_Id': "",
            'strNhom_Id': "",
            'strLoai_Id': "",
            'strNhanSu_QuyDinhLuong_Id': me.strNhanSu_QuyDinhLuong_Id,
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 10000,
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
                    me.dtHeSoLuong = dtResult;
                    me.getList_Ngach();
                }
                else {
                    edu.system.alert("L_BangHeSoLuong/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("L_BangHeSoLuong/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_BangHeSoLuong: function (strNgach_Id) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_BangHeSoLuong/Xoa_NhanSu_BangHeSoLuong_Ngach',
            
            'strNhanSu_QuyDinhLuong_Id': me.strNhanSu_QuyDinhLuong_Id,
            'strNgach_Id': strNgach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_BangHeSoLuong();
                }
                else {
                    edu.system.alert("SV_HoSo/Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("SV_HoSo/Xoa (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_BangHeSoLuong: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblQuyDinhHeSoLuong",
            aaData: data,
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += "<span>" + edu.util.returnEmpty(aData.MUCLUONGCOBAN) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Ngach
    --Author: duyentt
	-------------------------------------------*/
    getList_Ngach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'L_Ngach/LayDanhSach',
            

            'strNhanSu_QuyDinhLuong_Id': me.strNhanSu_QuyDinhLuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genTable_Ngach(dtResult, iPager);
                }
                else {
                    edu.system.alert("L_BangQuyDinhLuong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("L_BangQuyDinhLuong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Ngach: function (data, iPager) {
        var me = this;

        var ibac = 0;
        for (var i = 0; i < me.dtHeSoLuong.length; i++) {
            if (me.dtHeSoLuong[i].BAC > ibac) ibac = me.dtHeSoLuong[i].BAC;
        }

        var jsonForm = {
            strTable_Id: "tblQuyDinhHeSoLuong",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAI_TEN"
                }
                , {
                    "mDataProp": "NHOM_TEN"
                }
                , {
                    "mDataProp": "NGACH_MA"
                }
                , {
                    "mDataProp": "NGACH_TEN"
                }
                , {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center"> Loại</th >';
        rowth += '<th class="td-center">Nhóm</th>';
        rowth += '<th class="td-center">Mã ngạch</th>';
        rowth += '<th class="td-center">Tên ngạch</th>';
        rowth += '<th class="td-center">Ghi chú</th>';
        for (var i = 0; i < ibac; i++) {
            rowth += '<th class="td-center">Bậc ' + (i + 1) + '</th>';
        }
        rowth += '<th class="td-fixed td-center">Xóa</th>';
        $("#tblQuyDinhHeSoLuong thead tr").html(rowth);
        for (var i = 0; i < ibac; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var html = ''; edu.system.icolumn++;
                    html += '<div id="div' + aData.NGACH_ID + '_' + edu.system.icolumn + '" style="width: 100%"></div>';
                    return html;
                }
            });
        }
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<span><a class="btn btn-default btnDelete" id="' + aData.NGACH_ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
            }
        });
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < me.dtHeSoLuong.length; i++) {
            var point = $("#div" + me.dtHeSoLuong[i].NGACH_ID + "_" + me.dtHeSoLuong[i].BAC).html('<input id="input' + me.dtHeSoLuong[i].NGACH_ID + "_" + me.dtHeSoLuong[i].NGACH_ID + '" value="' + me.dtHeSoLuong[i].HESOLUONG + '" title="' + me.dtHeSoLuong[i].HESOLUONG + '" name="' + me.dtHeSoLuong[i].ID + '" style="width: 100%"/>');
        }
        me.move_ThroughInTable("tblQuyDinhHeSoLuong");
        /*III. Callback*/
    },
    move_ThroughInTable: function (strTable_Id, strDoiTuongDiChuyyen) { // di chuyển giữa các inpnut trong bảng
        if (strDoiTuongDiChuyyen === "" || strDoiTuongDiChuyyen === undefined || strDoiTuongDiChuyyen === null) strDoiTuongDiChuyyen = "input, select, textarea";
        //Lấy toàn bộ địa chỉ các phần từ cần di chuyển (input, select,textarea)  lưu vào bảng nhớ
        var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find(strDoiTuongDiChuyyen);
        //Lấy chiều dài bảng tương ứng với chiều dài dòng đầu tiên
        var iChieuDaiBang = $("#" + strTable_Id).find("tbody").find("tr:eq(0)").find(strDoiTuongDiChuyyen).length;
        //Khi table có click sẽ chỉ xác nhận với các key di chuyển đã quy định
        $("#" + strTable_Id + " tbody tr td " + strDoiTuongDiChuyyen).keydown(function (e) {
            //Tìm địa chỉ hiện tại của đối tượng trước khi di chuyển bằng cách kiểm tra địa chỉ có nó xem có trùng với thằng nào trong bảng nhớ trên
            var iVitri = IndexOf(arrElement, this);
            //Vị trí = -1 với trường hợp không tìm thấy địa chỉ hiện tại
            if (iVitri == -1) return;
            switch (parseInt(e.which, 10)) {
                case 39: //Sang phải bằng cách lây vị trí của nó cộng với 1
                    $(arrElement[iVitri + 1]).focus();
                    break;
                case 38: //Lên trên bằng cách lấy địa chỉ của nó bằng cách lấy dòng hiện tại(x) - 1(key: di chuyển lên trên) nhân chiều dài bảng và cộng với vị trí cột (y): "(x-1)*ly + y"
                    var idongthu = Math.floor(iVitri / iChieuDaiBang);
                    var icotthu = iVitri % iChieuDaiBang;
                    $(arrElement[((idongthu - 1) * iChieuDaiBang) + icotthu]).focus();
                    break;
                case 37: //Sang trái bằng cách lây vị trí của nó trừ đi 1
                    $(arrElement[iVitri - 1]).focus();
                    break;
                case 13:// nút enter
                case 40: //Xuống dưới bằng cách lấy địa chỉ của nó bằng cách lấy dòng hiện tại(x)  1(key: di chuyển xuống dưới) nhân chiều dài bảng và cộng với vị trí cột (y): "(x+1)*ly + y"
                    var idongthu = Math.floor(iVitri / iChieuDaiBang);
                    var icotthu = iVitri % iChieuDaiBang;
                    $(arrElement[((idongthu + 1) * iChieuDaiBang) + icotthu]).focus();
                    break;
            }
        });

        function IndexOf(arrX, eY) {
            for (var i = 0; i < arrX.length; i++) {
                if (eY == arrX[i]) return i;
            }
            return -1;
        }
    },
    /*------------------------------------------
    --Discription: [Tab_2] KhoiTao_NgachBac_BangHeSoLuong
    -------------------------------------------*/
    save_NBHS: function () {
        var me = this;

        var obj_save = {
            'action': 'L_BangHeSoLuong/KhoiTao_NgachBac_BangHeSoLuong',
            

            'strId': '',
            'strNhanSu_QuyDinhLuong_Id': me.strNhanSu_QuyDinhLuong_Id,
            'strNgach_Id': edu.util.getValById("dropNBHS_Ngach"),
            'dSoBacToiDa': edu.util.getValById("txtNBHS_SoBac"),
            'strNhom_Id': edu.util.getValById("dropNBHS_Nhom"),
            'strLoai_Id': edu.util.getValById("dropNBHS_Loai"),
            'dHeSoLuong': "",
            'strGhiChu': "",
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_BangHeSoLuong();
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
                
                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",

            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    popup_NBHS: function () {
        //show
        $("#myModal_NgachBacHeSoLuong").modal("show");
        edu.util.resetValById("dropNBHS_Loai");
        edu.util.resetValById("dropNBHS_Nhom");
        edu.util.resetValById("dropNBHS_Ngach");
        edu.util.resetValById("txtNBHS_SoBac");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Ngach
    --Author: vanhiep
	-------------------------------------------*/
    genCombo_Ngach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (nrow, aData) {
                    return aData.MA + " - " + aData.TEN;
                }
            },
            renderPlace: ["dropNBHS_Ngach"],
            title: "Chọn ngạch"
        };
        edu.system.loadToCombo_data(obj);
    }
}