
/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL: TaiChinh/CMS_UngDung
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function UngDung() { }
UngDung.prototype = {
    objHTML_UD: {},
    objInput_UD: {},
    arrValid_UD: [],
    dt_UD: null,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.buttonLoading();

        // Fix Select2 dropdown bay ra ngoài / bị che khi trong modal #myModal.
        // Root cause: MutationObserver global (indexi.aspx) move .select2-container--open sang body.
        // Fix: khi modal shown, re-init Select2 với dropdownParent = modal → dropdown attach TRONG modal.
        // Namespace .ungdungSelect2 để .off() tránh double-bind khi module reload.
        $(document).off('shown.bs.modal.ungdungSelect2').on('shown.bs.modal.ungdungSelect2', '#myModal', function () {
            var $modal = $(this);
            $modal.find('select').each(function () {
                var $sel = $(this);
                var curVal = $sel.val();
                if ($sel.hasClass('select2-hidden-accessible')) {
                    try { $sel.select2('destroy'); } catch (e) { }
                }
                var opts = {
                    dropdownParent: $modal,
                    width: '100%'
                };
                // Select 2 option (Trạng thái, đa ngôn ngữ) → ẩn ô search cho gọn
                var selId = $sel.attr('id') || '';
                if (selId === 'dropTrangThaiEdit' || selId === 'dropSuDungDaNgonNgu') {
                    opts.minimumResultsForSearch = Infinity;
                }
                $sel.select2(opts);
                if (curVal !== null && curVal !== undefined) {
                    $sel.val(curVal).trigger('change.select2');
                }
            });
        });
        // Backup reposition: nếu observer vẫn kéo container sang body, đè lại position
        $(document).off('select2:open.ungdungReposition').on('select2:open.ungdungReposition', '#myModal select', function () {
            var native = this;
            [10, 60, 200].forEach(function (delay) {
                setTimeout(function () {
                    var $container = $('.select2-container--open').last();
                    if (!$container.length) return;
                    if (!$container.closest('#myModal').length) {
                        var rect = native.getBoundingClientRect();
                        $container.css({
                            position: 'absolute',
                            top: (rect.bottom + window.scrollY) + 'px',
                            left: (rect.left + window.scrollX) + 'px',
                            width: rect.width + 'px',
                            'z-index': 100050
                        });
                    }
                }, delay);
            });
        });
        /*------------------------------------------
        --Discription: Initial page UngDung
        -------------------------------------------*/
        me.objHTML_UD = {
            table_id: "tbldata_UD",
            prefix_id: "chkSelectAll_UD",
            regexp: /chkSelectAll_UD/g,
            chkOne: "chkSelectOne_UD",
            btn_edit: "btnEdit",
            btn_save_id: "btnSave_UD",
            btn_save_tl: "Lưu"
        };
        me.objInput_UD = {
            strId: '',
            strMaUngDung: "txtMaUngDung",
            strTenUngDung: "txtTenUngDung",
            strMoTa: "txtMoTa",
            iThuTu: "txtThuTuHienThi",
            iParamTrangThai: "dropTrangThaiEdit",
            iSuDungDaNgonNgu: "dropSuDungDaNgonNgu",
            strNoiDung: "",
            strTenAnh: "txtIcon",
            strTenFileDinhKem: "",
            strDuongDanSSO: "txtDuongDanSSO",
            status_Search: "",
            strTuKhoa_Search: "txtKeyWord_UD"
        };
        //1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        me.arrValid_UD = [
            { "MA": me.objInput_UD.strTenUngDung, "THONGTIN1": "1" },
            { "MA": me.objInput_UD.strMaUngDung, "THONGTIN1": "1" },
            { "MA": me.objInput_UD.iThuTu, "THONGTIN1": "1" },
            { "MA": me.objInput_UD.strDuongDanSSO, "THONGTIN1": "1" }
        ];
        me.getList_UD();
        /*------------------------------------------
        --Discription: Action_main UngDung
        --Order: thêm/xóa/sửa/tìm kiếm/tải lại/khác
        -------------------------------------------*/
        $("#btnAddNew_UD").click(function () {
            me.resetPopup();
            me.popup();
        });
        $("#btnSave_UD").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_UD);
            if (valid === true) {
                var selected_id = edu.system.updateModal(this, me.objHTML_UD);
                me.save_UD();
            }
        });
        $("#btnDelete_UD").click(function (e) {
            e.preventDefault();
            var selected_id = edu.util.getCheckedIds(me.objHTML_UD);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_UD(selected_id);
            });
            return false;
        });
        $("#tbldata_UD").delegate(".btnEdit", "click", function () {
            var selected_id = edu.system.updateModal(this, me.objHTML_UD);
            if (selected_id !== "") {
                me.objInput_UD.strId = selected_id;
                me.getDetail_UD(selected_id);
            }
        });
        $("#btnSearch_UD").click(function () {
            me.getList_UD();
        });
        $("#btnRefresh_UD").click(function () {
            me.getList_UD();
        });
        $("#txtKeyWord_UD").keypress(function (e) {
            if (e.which === 13) {
                me.getList_UD();
            }
        });
        /*------------------------------------------
        --Discription: Action_extra UngDung
        -------------------------------------------*/
        $("[id$= " + me.objHTML_UD.prefix_id + "]").on("click", function () {
            edu.util.checkedAll_BgRow(this, me.objHTML_UD);
        });
        $(document).delegate("." + me.objHTML_UD.chkOne, "click", function () {
            edu.util.checkedOne_BgRow(this, me.objHTML_UD);
        });
        /*------------------------------------------
        --Discription: Load Select UngDung
        -------------------------------------------*/
    },
    /*------------------------------------------
    --Discription: Hàm chung UngDung
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = this;
        edu.util.resetValById(me.objInput_UD.strMaUngDung);
        edu.util.resetValById(me.objInput_UD.strTenUngDung);
        edu.util.resetValById(me.objInput_UD.strMoTa);
        edu.util.resetValById(me.objInput_UD.iThuTu);
        edu.util.resetValById(me.objInput_UD.iParamTrangThai);
        edu.util.resetValById(me.objInput_UD.iSuDungDaNgonNgu);
        edu.util.resetValById(me.objInput_UD.strNoiDung);
        edu.util.resetValById(me.objInput_UD.strTenAnh);
        edu.util.resetValById(me.objInput_UD.strTenFileDinhKem);
        edu.util.resetValById(me.objInput_UD.strDuongDanSSO);
        edu.util.resetValById("txtDuongDanBaoCao");
        me.objInput_UD.strId = "";
        edu.system.createModal(me.objHTML_UD);
    },
    /*------------------------------------------
    --Discription: ACESS DB ==> UngDung
    --Author: nnthuong
    -------------------------------------------*/
    save_UD: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung/ThemMoiUngDung',
            'versionAPI'        : 'v1.0',
            'strId'             : me.objInput_UD.strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strMaUngDung'             : edu.util.getValById(me.objInput_UD.strMaUngDung),
            'strTenUngDung'            : edu.util.getValById(me.objInput_UD.strTenUngDung),
            'strMoTa'           : edu.util.getValById(me.objInput_UD.strMoTa),
            'dThuTu'            : edu.util.getValById(me.objInput_UD.iThuTu),
            'dTrangThai'        : edu.util.getValById(me.objInput_UD.iParamTrangThai),
            'dSuDungDaNgonNgu'  : edu.util.getValById(me.objInput_UD.iSuDungDaNgonNgu),
            'strNoiDung'        : edu.util.getValById(me.objInput_UD.strNoiDung),
            'strTenAnh'           : edu.util.getValById(me.objInput_UD.strTenAnh),
            'strTenFileDinhKem': edu.util.getValById("txtDuongDanBaoCao"),
            'strDuongDanSSO': edu.util.getValById(me.objInput_UD.strDuongDanSSO),
            'strDuongDanTruyCapBaoCao': edu.util.getValById('txtDuongDanBaoCao'),
        };
        if (obj_save.strId) obj_save.action = 'CMS_QuanLyNguoiDung/SuaUngDung'
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.objInput_UD.strId === "" || me.objInput_UD.strId === null || me.objInput_UD.strId === undefined) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!"
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!"
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_UD();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: data.Message
                    };
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                
                obj_notify = {
                    type: "w",
                    content: JSON.stringify(er)
                };
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
    getList_UD: function () {
        var me = this;

        //--Edit
        var obj_list = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachUngDung',
			'iM' : edu.system.iM,
            'strTuKhoa': edu.util.getValById(me.objInput_UD.strTuKhoa_Search),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'dTrangThai': 1
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_UD = data.Data;
                    me.genTable_UD(data.Data, data.Pager);
                }
                else {
                    edu.system.alert("CMS_UngDung/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_UngDung/LayDanhSach: " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_UD: function () {
        var me = this;
        //view data --Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4FSkuLyYVKC8ULyYFNC8m',
			'func': 'pkg_chung_quanlynguoidung.LayThongTinUngDung',
			'iM' : edu.system.iM,
            
            'strId': me.objInput_UD.strId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    if (json.length > 0) {
                        me.dt_UD = data.Data;
                        me.viewForm_UD(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert("CMS_UngDung/LayChiTiet: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_UngDung/LayChiTiet: " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_UD: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_QuanLyNguoiDung/XoaUngDung',
            

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_UD();
                }
                else {
                    edu.system.alert("CMS_UngDung/Xoa: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_UngDung/Xoa: " + JSON.stringify(er), "w");
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
    --Discription: GEN HTML ==> UngDung
    --Author: nnthuong
    -------------------------------------------*/
    genTable_UD: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: me.objHTML_UD.table_id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.UngDung.getList_UD()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                center: [0, 1, 5, 8, 9],
                fix: [0, 1, 8, 9]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strIcon = edu.util.returnEmpty(aData.TENANH);
                        var link = edu.util.returnEmpty(aData.DUONGDANTRUYCAPSSO);
                        return '<a href="' + link + '" title="' + link + '"><i class="' + edu.util.returnEmpty(aData.TENANH) + ' color-active"></i></a>';
                    }
                }
                , {
                    "mDataProp": "MAUNGDUNG"
                }
                , {
                    "mDataProp": "TENUNGDUNG"
                }
                , {
                    "mRender": function (nRow, aData) {
                        var link = edu.util.returnEmpty(aData.DUONGDANTRUYCAPSSO);
                        if (!edu.util.checkValue(link)) {
                            link = "#";
                        }
                        return '<a href="' + link + '">' + link + '</a>';
                    }
                }
                , {
                    "mDataProp": "THUTU"
                }
                , {
                    "mRender": function (nRow, aData) {
                        //iNgonNgu: 0- khong su dung da ngon ngu
                        //iNgonNgu: 1- su dung da ngon ngu
                        var iNgonNgu = edu.util.returnEmpty(aData.COSUDUNGDANGONNGU);
                        var html = "";
                        switch (iNgonNgu) {
                            case 0:
                                html = '<span class="">Không</span>';
                                break;
                            case 1:
                                html = '<span class="">Có</span>';
                                break;
                            default:
                                html = '<span class="">Không</span>';
                                break;
                        }
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        //TrangThai: 1- dang hoat dong 
                        //TrangThai: 2- dung hoat dong
                        var iTrangThai = edu.util.returnEmpty(aData.TRANGTHAI);
                        var html = "";
                        switch (iTrangThai) {
                            case 1:
                                html = '<span class="color-active">Đang hoạt động</span>';
                                break;
                            case 2:
                                html = '<span class="color-danger">Dừng hoạt động</span>';
                                break;
                            default:
                                html = '<span class="color-warning">Đang hoạt động</span>';
                                break;
                        }

                        return html;
                    }
                }
                , {
                    "mData": "Sua",
                    "mRender": function (nRow, aData) {
                        return '<a title="Sửa" class="btn btn-default btn-circle color-active ' + me.objHTML_UD.btn_edit + '" id="' + aData.ID + '" href="#"><i class="fa fa-edit"></i></a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="' + me.objHTML_UD.prefix_id + aData.ID + '" class="' + me.objHTML_UD.chkOne + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //Ẩn cột sử dụng đối với bảng không sử dụng colspan và rowspan
        //var iCotAn = 3; 
        //var x = $("#tbldata_UD")[0].rows;
        //for (var i = 0; i < x.length; i++) {
        //    x[i].cells[iCotAn].style.display = "none";
        //}
        ///*III. Callback*/
    },
    viewForm_UD: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById(me.objInput_UD.strMaUngDung, data.MAUNGDUNG);
        edu.util.viewValById(me.objInput_UD.strTenUngDung, data.TENUNGDUNG);
        edu.util.viewValById(me.objInput_UD.strMoTa, data.MOTA);
        edu.util.viewValById(me.objInput_UD.iThuTu, data.THUTU);
        edu.util.viewValById(me.objInput_UD.iParamTrangThai, data.TRANGTHAI);
        edu.util.viewValById(me.objInput_UD.iSuDungDaNgonNgu, data.COSUDUNGDANGONNGU);
        edu.util.viewValById(me.objInput_UD.strTenAnh, data.TENANH);
        edu.util.viewValById("txtDuongDanBaoCao", data.TENFILEDINHKEM);
        edu.util.viewValById(me.objInput_UD.strDuongDanSSO, data.DUONGDANTRUYCAPSSO);
    }
};
