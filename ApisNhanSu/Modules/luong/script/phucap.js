/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function PhuCap() { };
PhuCap.prototype = {
    strNhanSu_Id: '',
    dtLoaiPhuCap: [],
    strLoaiPhuCap: '',
    strCommon_Id: '',
    dtPhuCap: [],
    dtNhanSu: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        /*------------------------------------------
       --Discription: [2] Action HoSo NhanSu
       --Order: 
       -------------------------------------------*/
        $("#tblPhuCap").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            me.strNhanSu_Id = edu.util.cutPrefixId(/view_/g, strId);
            edu.util.setOne_BgRow(me.strNhanSu_Id, "tblPhuCap");
            $("#zoneEdit").slideDown();
            me.getList_PhuCap();
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
            //me.editForm_PhuCap(data);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_PhuCap_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        $("#btnSearchKhoiTao_NhanSu").click(function () {
            me.getList_HS();
        });
        /*------------------------------------------
        --Discription: [2] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_TChucChuongTrinh").on("select2:select", function () {
            me.getList_NoiDungChuongTrinh();

        });
        $("#dropSearch_PhuCap_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        /*------------------------------------------
        --Discription: [2] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#zoneEdit").delegate('.btnAdd', 'click', function (e) {
            me.strLoaiPhuCap = this.id;
            if (edu.util.checkValue(me.strLoaiPhuCap)) {
                me.popup_PhuCap();
                me.resetPopup_PhuCap();
            }
        });
        $("#myModal_PhuCap").delegate('#btnSave_PC', 'click', function (e) {
            me.save_PhuCap();
        });
        $("#zoneEdit").delegate('.btnEdit', 'click', function (e) {
            me.popup_PhuCap();
            me.resetPopup_PhuCap();
            me.getDetail_PhuCap(this.id);
        });
        $("#zoneEdit").delegate(".btnDelete", "click", function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_PhuCap(strId);
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
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIPHUCAP", "", "", me.loadLoaiPhuCap);
        edu.system.loadToCombo_DanhMucDuLieu("KPI.DVT", "dropPC_DVT");
        edu.system.uploadFiles(["txtThongTinDinhKem"]);
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.QUDI, "dropPC_LoaiQuyetDinh");
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HS: function () {
        var me = this;
        
        var strCoCauToChuc = edu.util.getValById("dropSearch_PhuCap_CCTC");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearch_PhuCap_BoMon");
        }
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_PhuCap_TuKhoa"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: strCoCauToChuc,
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: 0
        };
        edu.system.getList_NhanSu(obj, "", "", me.genTable_HS);

    },
    genTable_HS: function (data, iPager) {
        var me = main_doc.PhuCap;
        me.dtNhanSu = data;
        $("#lblPhuCap_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhuCap",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhuCap.getList_HS()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        strAnh = edu.system.getRootPathImg(aData.ANH);
                        html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        strHoTen = edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                        html += '<span id="lbl' + aData.ID + '">' + strHoTen + "</span><br />";
                        html += '<span>' + "Mã cán bộ: " + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span>' + "Ngày sinh: " + edu.util.returnEmpty(aData.NGAYSINH) + "/" + edu.util.returnEmpty(aData.THANGSINH) + "/" + edu.util.returnEmpty(aData.NAMSINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-edit color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },
    /*------------------------------------------
    --Discription: [1] AcessDB VanBangSanghe
    -------------------------------------------*/
    getList_PhuCap: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_QT_ThongTinPhuCap/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'strNhanSu_ThongTinQD_Id': "",
            'strLoaiPhuCap_Id': "",
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    for (var i = 0; i < me.dtLoaiPhuCap.length; i++) {
                        var dtPhuCap = edu.util.objGetDataInData(me.dtLoaiPhuCap[i].ID, data.Data, "LOAIPHUCAP_ID");
                        me.genTable_PhuCap(dtPhuCap, me.dtLoaiPhuCap[i].ID);
                    }
                    me.dtPhuCap = data.Data;
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_PhuCap: function () {
        var me = this;

        var obj_save = {
            'action': 'L_QT_ThongTinPhuCap/ThemMoi',
            

            'strId': "",
            'strNhanSu_ThongTinQD_Id': edu.util.getValById('txtQuyetDinh_ID'),
            'strSoQuyetDinh': edu.util.getValById('txtPC_SoQuyetDinh'),
            'strNgayQuyetDinh': edu.util.getValById('txtPC_NgayQuyetDinh'),
            'strNguoiKyQuyetDinh': "",
            'strThongTinQuyetDinh': "",
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropPC_LoaiQuyetDinh'),
            'strNgayHieuLuc': edu.util.getValById('txtPC_NgayHieuLuc'),
            'strNgayHetHieuLuc': edu.util.getValById('txtPC_NgayHetHan'),
            'iTrangThai': 1,
            'iThuTu': 0,
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'dHieuLuc': edu.util.getValById('dropPC_HieuLuc'),
            'dPhuCap': edu.util.getValById('txtPC_HeSo'),
            'strLoaiPhuCap_Id': me.strLoaiPhuCap,
            'strDonViTinh_Id': edu.util.getValById('dropPC_DVT'),
            'strNgayApDung': edu.util.getValById('txtPC_NgayApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(me.strCommon_Id)) {
            obj_save.action = 'L_QT_ThongTinPhuCap/CapNhat';
            obj_save.strId = me.strCommon_Id;
        }
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
                        edu.system.saveFiles("txtThongTinDinhKem", data.Id, "NS_Files");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        };
                        edu.system.alertOnModal(obj_notify);
                        edu.system.saveFiles("txtThongTinDinhKem", me.strCommon_Id, "NS_Files");
                    }
                    me.getList_PhuCap();
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
    delete_PhuCap: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_QT_ThongTinPhuCap/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_PhuCap();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
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
    getDetail_PhuCap: function (strId) {
        var me = this;
        var dtPhuCap = edu.util.objGetDataInData(strId, me.dtPhuCap, "ID")[0];
        me.editForm_PhuCap(dtPhuCap);
    },

    popup_PhuCap: function () {
        //show
        $("#myModal_PhuCap").modal("show");
        //event
        //$('#myModal_TSBT').on('shown.bs.modal', function () {
        //    $('#txtTSBT_TuNgay').val('').trigger('focus').val(value);
        //});
    },
    resetPopup_PhuCap: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("txtPC_HeSo", "");
        edu.util.viewValById("txtPC_SoQuyetDinh", "");
        edu.util.viewValById("txtPC_NgayQuyetDinh", "");
        edu.util.viewValById("txtPC_NgayApDung", "");
        edu.util.viewValById("txtPC_NgayHieuLuc", "");
        edu.util.viewValById("txtPC_NgayHetHan", "");
        edu.util.viewValById("dropPC_HieuLuc", 1);
        edu.util.viewValById("dropPC_LoaiQuyetDinh", "");
        edu.util.viewValById("dropPC_DVT", "");
        edu.util.viewValById("txtQuyetDinh_ID", "");
        edu.system.viewFiles("txtThongTinDinhKem", "");
    },
    genTable_PhuCap: function (data, strLoaiPhuCap_Id) {
        if (data.length == 0) $("#tbl" + strLoaiPhuCap_Id).hide();
        else $("#tbl" + strLoaiPhuCap_Id).show();
        var jsonForm = {
            strTable_Id: "tbl" + strLoaiPhuCap_Id,
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 1, 2, 3, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "PHUCAP"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYAD"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYHL"
                },
                {
                    "mDataProp": "NHANSU_TTQUYETDINH_NGAYHHL"
                },
                //{
                //    "mDataProp": "SOQUYETDINH"
                //},
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDelete" id="' + aData.ID + '" title="Xóa"><i class="fa fa-trash color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_PhuCap: function (data) {
        var me = main_doc.PhuCap;
        me.popup_PhuCap();
        //view data --Edit
        me.strCommon_Id = data.ID;
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
        me.strLoaiPhuCap = data.LOAIPHUCAP_ID;
        edu.util.viewValById("txtQuyetDinh_ID", data.NHANSU_THONGTINQUYETDINH_ID);
        edu.util.viewValById("txtPC_HeSo", data.PHUCAP);
        edu.util.viewValById("txtPC_SoQuyetDinh", data.NHANSU_TTQUYETDINH_SOQD);
        edu.util.viewValById("txtPC_NgayQuyetDinh", data.NHANSU_TTQUYETDINH_NGAYQD);
        edu.util.viewValById("txtPC_NgayApDung", data.NHANSU_TTQUYETDINH_NGAYAD);
        edu.util.viewValById("txtPC_NgayHetHan", data.NHANSU_TTQUYETDINH_NGAYHHL);
        edu.util.viewValById("txtPC_NgayHieuLuc", data.NHANSU_TTQUYETDINH_NGAYHL);/////
        edu.util.viewValById("dropPC_HieuLuc", data.HIEULUC);
        edu.util.viewValById("dropPC_LoaiQuyetDinh", data.LOAIQUYETDINH_ID);
        edu.util.viewValById("dropPC_DVT", data.DONVITINH_ID);
        edu.system.viewFiles("txtThongTinDinhKem", data.ID, "NS_Files");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.PhuCap;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }
        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_PhuCap_CCTC"],
            type: "",
            title: "Chọn Khoa/Viện/Phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_PhuCap_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB LoaiPhuCap
    -------------------------------------------*/
    loadLoaiPhuCap: function (data) {
        var me = main_doc.PhuCap;
        me.dtLoaiPhuCap = data;
        var row = "";
        for (var i = 0; i < data.length; i++) {
            if (i % 2 == 0 && i != 0) row += '<div class="clear"></div>';
            row += '<div class="col-lg-6">';
            row += '<div class="box box-solid">';
            row += '<div class="box-header with-border">';
            row += '<h3 class="box-title"><i class="fa fa-file-text-o"></i> ' + data[i].TEN + ' </h3>';
            row += '<div class="pull-right">';
            row += '<a id="' + data[i].ID + '" class="btn btn-default btnAdd">';
            row += '<i class="fa fa-plus cl-active"></i>';
            row += 'Thêm mới';
            row += '</a>';
            row += '</div>';
            row += '</div>';
            row += '<div class="box-body">';
            row += '<table id="tbl' + data[i].ID + '" class="table table-hover table-bordered">';
            row += '<thead>';
            row += '<tr>';
            row += '<th class="td-fixed td-center">Stt</th>';
            row += '<th class="td-center" style="width: 60px">Hệ số</th>';
            row += '<th class="td-center" style="width: 120px">Ngày áp dụng</th>';
            row += '<th class="td-center">Ngày có hiệu lực</th>';
            row += '<th class="td-center">Ngày hết hiệu lực</th>';
            //row += '<th class="td-center">Quyết định</th>';
            row += '<th class="td-fixed td-center">Sửa</th>';
            row += '<th class="td-center td-fixed">';
            row += '<input type="checkbox" id="chkSelectAll_' + data[i].ID + '">';
            row += '</th>';
            row += '</tr>';
            row += '</thead>';
            row += '<tbody></tbody>';
            row += '</table>';
            row += '</div>';
            row += '</div>';
            row += '</div>';
        }
        $("#zoneEdit").html(row);
    },
    viewForm_NhanSu: function (data) {
        var me = this;
        //call popup --Edit
        //me.toggle_input();
        //view data --Edit
        // me.popup_ChucVu();
        edu.util.viewHTMLById("lblCanBo", data.HOTEN);
        edu.util.viewHTMLById("lblMaCanBo", data.MASO);
    },
    
}