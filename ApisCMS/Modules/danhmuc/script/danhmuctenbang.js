/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL: TaiChinh/CMS_DanhMucTenBang
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DanhMucTenBang() { };
DanhMucTenBang.prototype = {
    objHTML_DMTB: {},
    objInput_DMTB: {},
    arrValid_DMTB: [],
    dtDanhMucTenBang: [],
    dtUngDung: [],
    strDanhMucTenBang_Id: '',
    
    init: function () {
        var me = this;
        //function toDataURL(url, callback) {
        //    var xhr = new XMLHttpRequest();
        //    xhr.onload = function () {
        //        var reader = new FileReader();
        //        reader.onloadend = function () {
        //            callback(reader.result);
        //        }
        //        reader.readAsDataURL(xhr.response);
        //    };
        //    xhr.open('GET', url);
        //    xhr.responseType = 'blob';
        //    xhr.send();
        //}

        //toDataURL('https://dev.mangajam.com/wp-content/uploads/part421/how_draw_cc_code_geass_11.jpg', function (dataUrl) {
        //    console.log('RESULT:', dataUrl)
        //})
        //return;
        /*------------------------------------------
        --Discription: Initial page DanhMucTenBang
        -------------------------------------------*/
        me.objHTML_DMTB = {
            table_id: "tbldata_DMTB",
            prefix_id: "chkSelectAll_DMTB",
            regexp: /chkSelectAll_DMTB/g,
            chkOne: "chkSelectOne_DMTB",
            btn_edit: "btnEdit",
            btn_save_id: "btnSave_DMTB",
            btn_save_tl: "Lưu"
        };
        me.arrValid_DMTB = [
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "txtDMTB_Ma", "THONGTIN1": "EM" }
        ];
        me.getList_DMTB();
        /*------------------------------------------
        --Discription: Action_main DanhMucTenBang
        --Order: 
        -------------------------------------------*/
        $("#btnSave_DMTB").click(function () {
            edu.system.updateModal(this, me.objHTML_DMTB);
            me.save_DMTB();
        });
        $("#btnDelete_DMTB").click(function (e) {
            e.preventDefault();
            var arrChecked_Id = edu.util.getArrCheckedIds("tbldata_DMTB", "chkSelectAll_DMTB");
            var selected_id = edu.util.getCheckedIds(me.objHTML_DMTB);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
                $("#btnYes").click(function (e) {
                    arrChecked_Id.forEach(e => me.delete_DMTB(e))
                    //me.delete_DMTB(selected_id);
                });
                return false;
            }
            else {
                edu.system.alert("Vui lòng chọn dữ liệu trước khi xóa!");
            }
        });
        $("#btnRefresh_DMTB").click(function () {
            me.getList_DMTB();
        });
        $("#btnAddnew_DMTB").click(function () {
            me.resetPopup();
            me.popup();
        });

        $("#btnExport_DMTB").click(function () {
            me.report_Table();
        });
        $("[id$= " + me.objHTML_DMTB.prefix_id + "]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_DMTB);
        });

        $("#tbldata_DMTB").delegate("." + me.objHTML_DMTB.chkOne, "click", function () {
            edu.util.checkedOne_BgRow(this, me.objHTML_DMTB);
        });
        $("#tbldata_DMTB").delegate(".btnEdit", "click", function () {
            var selected_id = edu.system.updateModal(this, me.objHTML_DMTB);
            if (edu.util.checkValue(selected_id)) {
                me.resetPopup();
                me.strDanhMucTenBang_Id = selected_id;
                me.getDetail_DMTB(selected_id);
            }
        });
        /*------------------------------------------
        --Discription: Action_search DanhMucTenBang
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_DMTB();
        });
        $('#dropDMTB_UngDung_Search').off('change').on('change', function () {
            me.getList_DMTB();
        });
        //$('#dropDMTB_UngDung').off('change').on('change', function () {

        //    return false;
        //});
        $("#txtSearch_TuKhoa_DMTB,#txtSearch_TrangThai").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DMTB();
            }
        });
        me.getList_UngDung();
        
        /*------------------------------------------
        --Discription: Load Select DanhMucTenBang
        -------------------------------------------*/
        //edu.system.showBaoCao();
    },
    /*------------------------------------------
    --Discription: Hàm chung DanhMucTenBang
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = this;
        me.strDanhMucTenBang_Id = "";
        edu.util.resetValById("txtDMTB_Ma");
        edu.util.resetValById("txtDMTB_Ten");
        edu.util.resetValById("dropDMTB_UngDung");
        edu.util.resetValById("txtDMTB_MoTa");
        edu.util.resetValById("txtDMTB_ThuTuHienThi");
        edu.util.resetValById("");
        edu.util.resetValById("dropDMTB_PhanCap");
        edu.util.resetValById("dropDMTB_Cha");

        edu.system.createModal(me.objHTML_DMTB);
    },
    /*------------------------------------------
    --Discription: Danh mục DanhMucTenBang
    -------------------------------------------*/
    save_DMTB: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
			'action': 'CMS_DanhMuc_MH/FSkkLAMgLyYFIC8pDDQi',
			'func': 'pkg_chung_danhmuc.ThemBangDanhMuc',
			'iM' : edu.system.iM,

            'strId': me.strDanhMucTenBang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strMaDanhMuc': edu.util.getValById("txtDMTB_Ma"),
            'strTenDanhMuc': edu.util.getValById("txtDMTB_Ten"),
            'strNhomDanhMuc_Id': edu.util.getValById("dropDMTB_UngDung"),
            'strMoTa': edu.util.getValById("txtDMTB_MoTa"),
            'dThuTu': edu.util.returnZero(edu.util.getValById("txtDMTB_ThuTuHienThi")),
            'dTrangThai': 1,
            'strPhanCapDanhMuc_Id': edu.util.getValById("dropDMTB_PhanCap"),
            'strChung_TenDanhMuc_Cha_Id': edu.util.getValById("dropDMTB_Cha"),
            'strNgayThucHien': "",
        };
        if (obj_save.strId) obj_save.action = 'CMS_DanhMuc_MH/EjQgAyAvJgUgLykMNCIP';
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strDanhMucTenBang_Id)) {
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
                    me.getList_DMTB();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: "CMS_DanhMucTenBang.ThemMoi (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "s",
                    content: "CMS_DanhMucTenBang.ThemMoi (er): " + er,
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
    getList_DMTB: function () {
        var me = this;
        console.log(edu.util.getValById("txtSearch_TrangThai"));
        //--Edit
        var obj_list = {
            'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFIC8pDDQi',
            'func': 'pkg_chung_danhmuc.LayDanhSachDanhMuc',
            'iM': edu.system.iM,
            'strPhanCapDanhMuc_Id' : edu.util.getValById(""),
            'strChung_TenDanhMuc_Cha_Id'     : edu.util.getValById(""),
            'strNhomDanhMuc_Id' : edu.util.getValById("dropSearch_UngDung_DMTB"),
            'strTuKhoa'     : edu.util.getValById("txtSearch_TuKhoa_DMTB"),
            'pageIndex'     : edu.system.pageIndex_default,
            'pageSize'      : edu.system.pageSize_default,
            'dTrangThai': edu.util.getValById("txtSearch_TrangThai") ? edu.util.getValById("txtSearch_TrangThai") : 1,
            'strTieuChiSapXep': edu.util.getValById('txtAAAA'),
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
                    else {
                        dtResult = [];
                        iPager = 0;
                    }
                    me.dtDanhMucTenBang = dtResult;
                    me.genTable_DMTB(dtResult, iPager);
                    if (!edu.util.checkValue(me.dtUngDung)) {
                        me.getList_UngDung();
                    }
                    
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucTenBang.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DMTB: function () {
        var me = this;
        //view data --Edit
        var obj_detail = {
			'action': 'CMS_DanhMuc_MH/DSA4FSkuLyYVKC8FIC8pDDQiFSkkLggl',
			'func': 'pkg_chung_danhmuc.LayThongTinDanhMucTheoId',
			'iM' : edu.system.iM,
            'strId': me.strDanhMucTenBang_Id
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.dtDanhMucTenBang = data.Data;
                        me.viewForm_DMTB(data.Data[0]);
                    }
                    else {
                        me.viewForm_DMTB([]);
                    }
                }
                else {
                    edu.system.alert("CMS_DanhMucTenBang.LayChiTiet: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_DanhMucTenBang.LayChiTiet (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DMTB: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_DanhMuc_MH/GS4gBSAvKQw0IgPP',
            'func': 'pkg_chung_danhmuc.XoaDanhMuc',
            'iM': edu.system.iM,
            'strId': Ids,
            'dTrangThai': 1,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_DMTB();
                }
                else {
                    obj = {
                        title: "",
                        content: "CMS_DanhMucTenBang.Xoa: " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: "CMS_DanhMucTenBang.Xoa: " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> UngDung
    --Author: nnthuong
	-------------------------------------------*/
    getList_UngDung: function () {
        var me = main_doc.DanhMucTenBang;
        var obj = {
            iTrangThai: 1,
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.extend.getList_UngDung(obj, "", "", me.cbGenCombo_UngDung);
        
    },

    /*------------------------------------------
    --Discription: Generating html on interface DanhMucTenBang
    --ULR: Modules
    -------------------------------------------*/
    genTable_DMTB: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.objHTML_DMTB.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DanhMucTenBang.getList_DMTB()",
                iDataRow: iPager
            },
            "sort": true,
            colPos: {
                center: [0, 4, 5],
                fix: [0, 4, 5]
            },
            aoColumns: [{
                "mDataProp": "MADANHMUC"
            },
            {
                "mDataProp": "TENDANHMUC"
            },
            {
                "mDataProp": "TENNHOMDANHMUC"
            }
                , {
                "mData": "Sua",
                "mRender": function (nRow, aData) {
                    return '<a title="Sửa" class="btn btn-default btn-circle color-active ' + me.objHTML_DMTB.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                }
            }
                , {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="' + me.objHTML_DMTB.prefix_id + aData.ID + '" class="' + me.objHTML_DMTB.chkOne + '"/>';
                }
            }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_DMTB: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtDMTB_Ma", data.MADANHMUC);
        edu.util.viewValById("txtDMTB_Ten", data.TENDANHMUC);
        edu.util.viewValById("dropDMTB_UngDung", data.UNGDUNG_ID);
        edu.util.viewValById("txtDMTB_MoTa", data.MOTA);
        edu.util.viewValById("txtDMTB_ThuTuHienThi", data.THUTU);
        edu.util.viewValById("dropDMTB_PhanCap", data.PHANCAPDANHMUC_ID);
        edu.util.viewValById("dropDMTB_Cha", data.CHUNG_TENDANHMUC_CHA_ID);
    },
    /*------------------------------------------
	--Discription: [4] Gen HTML ==> UngDung
	--Author: nnthuong
	-------------------------------------------*/
    cbGenCombo_UngDung: function (data) {
        var me = main_doc.DanhMucTenBang;
        me.dtUngDung = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENUNGDUNG",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_UngDung_DMTB","dropDMTB_UngDung"],
            type: "",
            title: "Chọn ứng dụng"
        };
        edu.system.loadToCombo_data(obj);
    },

    report_Table: function () {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        //

        var strMaDanhMucs = $("#txtSearch_TuKhoa_DMTB").val();
        var arrChecked_Id = edu.util.getArrCheckedIds("tbldata_DMTB", "chkSelectAll_DMTB");
        if (arrChecked_Id.length != 0) {
            strMaDanhMucs = "";
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strMaDanhMucs += $("#tbldata_DMTB tr[id='" + arrChecked_Id[i] + "'] td:eq(1)").html() + ",";
            }
            strMaDanhMucs = strMaDanhMucs.substring(0, strMaDanhMucs.length - 1);
        }
        if (strMaDanhMucs != "") {
            var url_report = edu.system.rootPathReport + "/Modules/Common/ExportDataInDanhMuc.aspx?strMaDanhMucs=" + strMaDanhMucs;
            location.href = url_report;
        }
        return;
    },


    getList_DataImport: function () {
        var me = main_doc.DanhMucTenBang;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import/getDataFormFileImport',
            'versionAPI': 'v1.0',

            'strPath': edu.util.getValById("importToCheck")
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var arrSheet = [data.Id];
                    if (edu.util.checkValue(data.Id)) {
                        if (data.Id.includes("$")) {
                            arrSheet = data.Id.split("$");
                        }
                    }
                    else { return; }
                    me.dtImport = data.Data;
                    var html = "";
                    for (var i = 0; i < arrSheet.length; i++) {
                        html += "<option value='Table" + (i + 1) + "'>" + arrSheet[i] + "</option>";
                    }
                    $("#dropSearch_BangA").html(html);
                    me.genTable_Import_View(me.dtImport["Table1"], "tblBangA")
                    //me.dtPhaiNop = data.Data["Table1"];
                    //me.genTable_Import(data.Data["Table1"], "tblImport");//Table1 tương ứng với vị trí đầu mảng
                    //edu.system.switchTab("tab_2");
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_Import_View: function (data, strTable) {
        var me = this;
        var row = "";
        row += '<thead>';
        row += '<tr>';
        for (var x in data[0]) {
            row += '<th>' + edu.util.returnEmpty(x) + '</td>';
        }
        row += '</thead>';
        row += '<tbody>';
        row += '</tr>';
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
            }
            row += '</tr>';
        }
        row += '</tbody>';
        $("#" + strTable).html(row);
        me.showCot(strTable, "dropSearch_CotA")
    },
    showBaoCao: function () {
        var me = this;

        var option = "";
        $("#main-content-wrapper table:visible").each(function () {
            if (this.id != "") {
                option += '<option value="' + this.id + '">' + this.id + '</option>';
            }
        });
        var row = '';
        row += '<div class="row"><div class="col-sm-2" >- Thực hiện import: </div><div class="col-sm-2"><div id="importToCheck"></div></div></div>';

        row += '<div class="clear">Bảng import</div>';
        row += '<div class="area-search">';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_BangA" class="select-opt"></select></div>';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_CotA" class="select-opt"></select></div>';
        row += '<div class="col-sm-3 item-search"><input id="txtCotA" class="form-control" placeholder="Thứ tự Cột" /></div>';
        row += '</div>';
        row += '<div class="clear">Bảng cần check theo mã</div>';
        row += '<div class="area-search">';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_BangB" class="select-opt">' + option +'</select></div>';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_CotB" class="select-opt"></select></div>';
        row += '<div class="col-sm-3 item-search"><input id="txtCotB" class="form-control" placeholder="Thứ tự Cột" /></div>';
        row += '</div>';
        row += '<div class="clear"></div>';
        row += '<div class="zone-content">';
        row += '<div class="box-header with-border">';
        row += '<h3 class="box-title"><i class="fa fa-list-alt"></i> Danh sách</h3>';
        row += '<div class="pull-right"><a class="btn btn-primary" id="btnThucHienCheck" href="#"><i class="fa fa-plus"></i> Thêm mới</a></div>';
        row += '</div>';
        row += '<div class="clear"></div>';
        row += '<div class="row row-align">';
        row += '<table id="tblBangA" class="table table-hover table-bordered">';
        row += '<tbody></tbody>';
        row += '</table>';
        row += '</div>';
        row += '</div>';
        $("#modalBaoCao #modal_body").html(row);
        $("#modalBaoCao").modal("show");
        edu.system.uploadImport(["importToCheck"], me.getList_DataImport);
        $('#dropSearch_BangA').on('change', function () {
            me.genTable_Import_View(me.dtImport[$("#dropSearch_BangA").val()], "tblBangA")
        });
        me.showCot($("#dropSearch_BangB").val(), "dropSearch_CotB");
        $('#dropSearch_BangB').on('change', function () {
            me.showCot($("#dropSearch_BangB").val(), "dropSearch_CotB");
        });
        $("#btnThucHienCheck").click(function () {
            let iCotA = $("#dropSearch_CotA").val()
            let iCotB = $("#dropSearch_CotB").val()
            console.log(iCotB)
            let strBangB = $("#dropSearch_BangB").val()
            $("#tblBangA tbody tr").each(function () {
                let tempGT = $(this).find("td:eq(" + iCotA + ")").text();
                console.log(tempGT)
                $("#" + strBangB + " tbody tr").each(function () {
                    console.log($(this).find("td"))
                    let tempGH = $(this).find("td:eq(" + iCotB + ")").text();
                    console.log(tempGH)
                    if (tempGH && tempGH.indexOf(tempGT) != -1) {
                        console.log("OK" + tempGH)
                        let pGH = $(this).find("input[type=checkbox]");
                        $(pGH).attr('checked', true);
                        $(pGH).prop('checked', true);
                    }
                })
            })
            
        });
    },
    showCot: function (strTable_Id, strDrop_Id) {
        var temp = "";
        let iThu = 0;
        $("#" + strTable_Id + " thead tr:eq(0) th").each(function () {
            temp += '<option value="' + iThu + '">' + this.innerText + '</option>';
            iThu++;
        });
        $("#" + strDrop_Id).html(temp);
    }
};