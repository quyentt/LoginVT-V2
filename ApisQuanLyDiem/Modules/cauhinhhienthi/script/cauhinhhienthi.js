/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 
--Input:
--Output:
--Note:
----------------------------------------------*/
function CauHinhHienThi() { };
CauHinhHienThi.prototype = {
    dtRow: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_CauHinhHienThiCot();
        me.getlistByUser_ChucNang();
        //me.toggle_notify();
        /*------------------------------------------
        --Discription: Load Select
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_CauHinhHienThiCot();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CauHinhHienThiCot();
            }
        });
        $("#tblHienThi").delegate('.btnCanLe', 'click', function () {
            var point = this;
            var parent = point.parentNode;
            $(point.parentNode).find(".btn-primary").each(function () {
                this.classList.remove("btn-primary");
            });
            this.classList.add("btn-primary");
        });
        $("#tblHienThi").delegate('.btnChuDam', 'click', function () {
            var classPoint = this.classList;
            if (classPoint.contains("btn-primary")) {
                classPoint.remove("btn-primary");
                classPoint.add("btn-default");
            } else {
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
        });
        $("#tblHienThi").delegate('.btnHienThiNoiDung', 'click', function () {
            var x = $(this).find('i')[0].classList;
            if (x.contains("color-active")) {
                x.remove("color-active");
                x.remove("fa-toggle-on");
                x.add("fa-toggle-off");
                $(this).attr("name", "0");
            } else {
                x.add("color-active");
                x.add("fa-toggle-on");
                x.remove("fa-toggle-off");
                $(this).attr("name", "1");
            }
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnLuuEditHienThi").click(function () {
            var x = $("#tblHienThi tbody")[0].rows;
            for (var i = 0; i < x.length; i++) {
                me.save_CauHinhHienThiCot(x[i]);
            }
        });
        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_CauHinhHienThiCot(id, "");
        });
        $("#tblHienThi").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHienThi tr[id='" + strRowId + "']").remove();
        });
        $("#tblHienThi").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_CauHinhHienThiCot(strId);
            });
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CauHinhHienThiCot: function (point) {
        var me = this;
        console.log(point);
        var strRowId = point.id;
        var strCanLe =""
        var x = $(point.cells[7]).find("a");
        for (var i = 0; i < x.length; i++) {
            if (x[i].classList.contains("btn-primary")) {
                strCanLe = $(x[i]).attr("name");
                break;
            }
        }
        console.log(11111);
        var strChuDam = "";
        var y = $(point.cells[8]).find("a");
        for (var i = 0; i < y.length; i++) {
            if (y[i].classList.contains("btn-primary")) {
                strChuDam += $(y[i]).attr("name");
            }
        }
        var aData = edu.util.objGetDataInData(strRowId, me.dtRow, "ID")[0];
        if (aData == undefined) {
            edu.system.alert("Dữ liệu hệ thống chỉ có thể sửa", "w");
            return;
        }
        var obj_save = {
            'action': 'D_CauHinhCotHienThi/ThemMoi',

            'strId': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': aData.CHUCNANG_ID,
            'strNguoiDung_Id': aData.NGUOIDUNG_ID,
            'strHienThi': point.cells[10].getElementsByTagName('a')[0].name,
            'strTenCot': point.cells[3].getElementsByTagName('input')[0].value,
            'strThuTu': point.cells[1].getElementsByTagName('input')[0].value,
            'strMaCot': point.cells[2].getElementsByTagName('input')[0].value,
            'strDoRong': point.cells[4].getElementsByTagName('input')[0].value,
            'strKichThuocFontChu': point.cells[5].getElementsByTagName('input')[0].value,
            'strCanLe': strCanLe,
            'strChuDam': strChuDam,
            'strChiXem': point.cells[10].getElementsByTagName('a')[0].name,
            'strDanhChoHeThong': point.cells[11].getElementsByTagName('a')[0].name,
            'strMaMauHienThi': $("#colorselector" + strRowId).val(),
        };
        if (strRowId.length == 32) {
            obj_save.action = 'D_CauHinhCotHienThi/CapNhat';
            obj_save.strId = strRowId;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er));
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CauHinhHienThiCot: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CauHinhCotHienThi/LayDanhSach',
            'strTuKhoa': '',
            'strChucNang_Id': edu.util.getValById("dropSearchChucNang"),
            'strNguoiDung_Id': '',
            'strNguoiTao_Id': '',
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtRow = data.Data;
                    me.genTable_CauHinhHienThiCot(data.Data, data.Pager);
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
    delete_CauHinhHienThiCot: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'D_CauHinhCotHienThi/Xoa',
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': strId 
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CauHinhHienThiCot();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CauHinhHienThiCot: function (data, iPager) {
        var me = this;
        var strselect = $("#colorselector").html();
        $("#lblHienThi_Tong").html(data.length);
        var jsonForm = {
            strTable_Id: "tblHienThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CauHinhHienThi.getList_CauHinhHienThiCot()",
                iDataRow: iPager
            },
            bHiddenOrder: true,
            colPos: {
                center: [0, 6, 8, 9, 10, 11, 12]
            },
            aoColumns: [
                {
                    "mData": "THUTU",
                    "mRender": function (now, aData) {
                        return '<input id="txtThuTu' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.THUTU) + '" />';
                    }
                },
                {
                    "mData": "MACOT",
                    "mRender": function (now, aData) {
                        return '<input id="txtMaCot' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.MACOT) + '" />';
                    }
                },
                {
                    "mData": "TENCOT",
                    "mRender": function (now, aData) {
                        return '<input id="txtTenCot' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.TENCOT) + '" />';
                    }
                },
                {
                    "mData": "DORONG",
                    "mRender": function (now, aData) {
                        return '<input id="txtDoRong' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.DORONG) + '" />';
                    }
                },
                {
                    "mData": "KICHTHUOCFONTCHU",
                    "mRender": function (now, aData) {
                        return '<input id="txtKichThuoc' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.KICHTHUOCFONTCHU) + '" />';
                    }
                },
                {
                    "mRender": function (now, aData) {
                        return '<select id="colorselector' + aData.ID + '" class="colorselector">' + strselect + '</select>';
                    }
                },
                {
                    "mData": "CANLE",
                    "mRender": function (now, aData) {
                        var strHienThi = '<a class="btn btn-default btnCanLe" name="text-align: left" href="#"><i class="fa fa-align-left"></i></a>';
                        strHienThi += '<a class="btn btn-default btnCanLe" name="text-align: center" style="margin-left: 5px" href="#"><i class="fa fa-align-center"></i></a>'
                        strHienThi += '<a class="btn btn-default btnCanLe" name="text-align: right" style="margin-left: 5px" href="#"><i class="fa fa-align-right"></i></a>'
                        return strHienThi;
                    }
                },
                {
                    "mData": "CANLE",
                    "mRender": function (now, aData) {
                        var strHienThi = '<a class="btn btn-default btnChuDam" name="font-weight: bold;" href="#"><i class="fa fa-bold"></i></a>';
                        strHienThi += '<a class="btn btn-default btnChuDam" name="font-style:italic;" style="margin-left: 5px" href="#"><i class="fa fa-italic"></i></a>'
                        strHienThi += '<a class="btn btn-default btnChuDam" name="text-decoration: underline;" style="margin-left: 5px" href="#"><i class="fa fa-underline"></i></a>'
                        return strHienThi;
                    }
                },
                {
                    "mData": "CANLE",
                    "mRender": function (nRow, aData) {
                        if (aData.CHIXEM == "1") return '<a class="btn btnHienThiNoiDung" id="' + aData.ID + '" name="1"><i style="font-size: 16px" class="fa fa-toggle-on color-active"></i></a>'
                        return '<a class="btn btnHienThiNoiDung" id="' + aData.ID + '" name="0"><i style="font-size: 16px"  class="fa fa-toggle-off"></i></a>';
                    }
                },
                {
                    "mData": "CANLE",
                    "mRender": function (nRow, aData) {
                        if (aData.HIENTHI == "1") return '<a class="btn btnHienThiNoiDung" id="' + aData.ID + '" name="1"><i style="font-size: 16px" class="fa fa-toggle-on color-active"></i></a>'
                        return '<a class="btn btnHienThiNoiDung" id="' + aData.ID + '" name="0"><i style="font-size: 16px"  class="fa fa-toggle-off"></i></a>';
                    }
                }
                ,
                {
                    "mData": "CANLE",
                    "mRender": function (nRow, aData) {
                        if (aData.DANHCHOHETHONG == "1") return '<a class="btn btnHienThiNoiDung" id="' + aData.ID + '" name="1"><i style="font-size: 16px" class="fa fa-toggle-on color-active"></i></a>'
                        return '<a class="btn btnHienThiNoiDung" id="' + aData.ID + '" name="0"><i style="font-size: 16px"  class="fa fa-toggle-off"></i></a>';
                    }
                }
                ,
                {
                    "mData": "CANLE",
                    "mRender": function (nRow, aData) {
                        return '<a title="Xóa dòng" class="deleteKetQua" id="' + aData.ID + '" href="javascript:void(0)"><i class="fa fa-trash"></i></a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var table = document.getElementById("tblHienThi").getElementsByTagName('tbody')[0].rows;
        for (var i = 0; i < data.length; i++) {
            var strCanLe = data[i].CANLE;
            var x = $(table[i].cells[7]).find("a[name='" + strCanLe + "']")[0];
            if (x != undefined) {
                x.classList.remove("btn-default");
                x.classList.add("btn-primary");
            }
            var arrKieuChu = data[i].CHUDAM;
            if (arrKieuChu != null && arrKieuChu != undefined) {
                if (arrKieuChu.indexOf(";") != -1) {
                    arrKieuChu = arrKieuChu.split(";");
                }
                for (var j = 0; j < arrKieuChu.length; j++) {
                    if (arrKieuChu[j] == "") continue;
                    console.log(arrKieuChu[j]);
                    var x = $(table[i].cells[8]).find("a[name='" + arrKieuChu[j] + ";']")[0];
                    if (x != undefined) {
                        x.classList.remove("btn-default");
                        x.classList.add("btn-primary");
                    }
                }
            }
            $("#colorselector" + data[i].ID).val(data[i].MAMAUHIENTHI);
        }
        $('.colorselector').colorselector();
    },
    genHTML_CauHinhHienThiCot: function (strRow_Id) {
        var me = this;
        var strselect = $("#colorselector").html();
        var x = document.getElementById("tblHienThi").getElementsByTagName('tbody')[0].rows;
        var iViTri = x.length + 1;
        var arrStt = [];

        //Lấy STT
        if (x.length ==0 || x[0].cells.length > 1) {
            for (var i = 0; i < x.length; i++) {
                arrStt.push(x[i].cells[1].getElementsByTagName('input')[0].value);
            }
            while (arrStt.indexOf(iViTri) != -1) {
                iViTri++;
            }
        }
        else {
            $("#tblHienThi tbody").html("");
            iViTri = 1;
        }

        var row = '';
        row += '<tr id="' + strRow_Id + '">';
        row += '<td><input class="form-control" value="' + iViTri + '" /></td>';
        row += '<td><input class="form-control" /></td>';
        row += '<td><input class="form-control" /></td>';
        row += '<td><input class="form-control" /></td>';
        row += '<td><input class="form-control"/></td>';
        row += '<td style="text-align: center"><select id="colorselector' + strRow_Id + '" class="colorselector">' + strselect + '</select></td>';
        row += '<td><a class="btn btn-default btnCanLe" name="text-align: left" href="#"><i class="fa fa-align-left"></i></a><a class="btn btn-default btnCanLe" name="text-align: center" style="margin-left: 5px" href="#"><i class="fa fa-align-center"></i></a><a class="btn btn-default btnCanLe" name="text-align: right" style="margin-left: 5px" href="#"><i class="fa fa-align-right"></i></a></td>';
        row += '<td><a class="btn btn-default btnChuDam" name="font-weight: bold;" href="#"><i class="fa fa-bold"></i></a><a class="btn btn-default btnChuDam" name="font-style:italic;" style="margin-left: 5px" href="#"><i class="fa fa-italic"></i></a><a class="btn btn-default btnChuDam" name="text-decoration: underline;" style="margin-left: 5px" href="#"><i class="fa fa-underline"></i></a></td>';
        row += '<td style="text-align: center"><a class="btn btnHienThiNoiDung" name="1"><i style="font-size: 16px" class="fa fa-toggle-on color-active"></i></a>';
        row += '<td style="text-align: center"><a class="btn btnHienThiNoiDung" name="1"><i style="font-size: 16px" class="fa fa-toggle-on color-active"></i></a></td>';
        row += '<td style="text-align: center"><a class="btn btnHienThiNoiDung" name="0"><i style="font-size: 16px"  class="fa fa-toggle-off"></i></a></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strRow_Id + '" href="javascript:void(0)"><i class="fa fa-trash"></i></a></td>';
        row += '</tr>';
        $("#tblHienThi tbody").append(row);
        $("#colorselector" + strRow_Id).colorselector();
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getlistByUser_ChucNang: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genComBo_ChucNang(dtResult);
                }
                else {
                    me.alert("CM_ChucNang/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                me.alert("CM_ChucNang/LayDanhSach: " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CM_ChucNang/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strNguoiDung_Id': edu.system.userId,
                'strNgonNgu_Id': '',
                'strUngDung_Id': edu.system.appId
            },
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genComBo_ChucNang: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUCNANG",
                code: "MA"
            },
            renderPlace: ["dropSearchChucNang"],
            type: "",
            title: "Tất cả chức năng"
        };
        edu.system.loadToCombo_data(obj);
    },
}