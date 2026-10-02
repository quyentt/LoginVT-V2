/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function CoSoApDung() { };
CoSoApDung.prototype = {
    dtCoSoApDung: [],
    strCoSoApDung_Id: '',
    arrNhanSu_Id: [],
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });

        $(".btnAdd").click(function () {
            me.toggle_hosoedit();
        });
        $("#btnSave_CoSoApDung").click(function () {
            var x = $("#tblInput_NhanSu tbody tr");

            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", x.length);
            for (var i = 0; i < x.length; i++) {
                var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
                me.save_CoSoApDung(strNhanSu_Id);
            }
        });

        $("#Save_NS_CoSoApDung").click(function () {
            me.update_CoSoApDung();
        });
        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
            me.getList_CoSoApDung();
            
        });
        $("#dropSearch_ThanhVien").on("select2:select", function () {
            //me.getList_HS();
            me.getList_CoSoApDung();
            
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CoSoApDung();
                
            }
        });
        $(".btnSearch").click(function () {
            me.getList_CoSoApDung();
            
        });
        $(".btnSearch_NhanSu").click(function () {
            me.genModal_NhanSu();
            me.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
            edu.system.move_ThroughInTable("tblInput_NhanSu");
        });
        $("#tblInput_NhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
        });
        $("[id$=chkSelectAll_CoSoApDung]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCoSoApDung" });
        });
        $("#btnXoaCoSoApDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoSoApDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CoSoApDung(arrChecked_Id[i]);
                }
            });
        });
        $("#tblCoSoApDung").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblCoSoApDung");
            if (edu.util.checkValue(strId)) {
                me.strCoSoApDung_Id = strId;
                me.editForm_NhanSu_CoSoApDung(me.dtCoSoApDung.find(e => e.ID === strId));
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        edu.system.getList_MauImport("zonebtnBaoCao_CSAP", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_CoSoApDung_TuKhoa"),
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
                'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_CoSoApDung_TuNgay"),
                'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_CoSoApDung_DenNgay"),
                'strSearch_NhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien"),
                'strNam': edu.util.getValById('txtSearch_Nam'),
                'dLaCanBoNgoaiTruong': edu.util.getValById('dropSearch_LaCanBo_CoSoApDung'),
                'strNamXuatChungTu': edu.util.getValById('txtSearch_NamXuatChungTu'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoSoApDung", "checkHS");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strNhanSu_HoSoCanBo_Id", arrChecked_Id[i]);
            }
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_CoSoApDung();
        
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LUONG.PHANLOAILUONGAPDUNG", "dropSearch_PhanLoai,dropPhanLoai,dropPhanLoai_Edit");
    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        me.getList_CoSoApDung();
    },
    toggle_hosoedit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewrite: function () {
        var me = this;
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    getList_CoSoApDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_NhanSu_LuongCoSo_ApDung/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strPhanLoaiApDung_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien'),
            'strNhansu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCoSoApDung = data.Data;
                    me.genTable_CoSoApDung(data.Data, data.Pager);
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
    save_CoSoApDung: function (strNhanSu_Id) {
        var me = this;
        var obj_save = {
            'action': 'L_NhanSu_LuongCoSo_ApDung/ThemMoi',
            'type': 'POST',
            'strId': edu.util.getValById('txtAAAA'),
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Id,
            'strPhanLoaiApDung_Id': edu.util.getValById('dropPhanLoai'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropAAAA'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung' + strNhanSu_Id),
            'dMucApDung': edu.util.getValById('txtMucApDung' + strNhanSu_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) obj_save.action = 'L_NhanSu_LuongCoSo_ApDung/CapNhat';
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CoSoApDung();
                });
            },
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_CoSoApDung: function () {
        var me = this;
        var objNS = me.dtCoSoApDung.find(e => e.ID === me.strCoSoApDung_Id);
        var obj_save = {
            'action': 'L_NhanSu_LuongCoSo_ApDung/ThemMoi',
            'type': 'POST',
            'strId': me.strCoSoApDung_Id,
            'strNhanSu_HoSoCanBo_Id': objNS.NHANSU_HOSOCANBO_ID,
            'strPhanLoaiApDung_Id': edu.util.getValById('dropPhanLoai_Edit'),
            'strDaoTao_CoCauToChuc_Id': objNS.DAOTAO_COCAUTOCHUC_ID,
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'dMucApDung': edu.util.getValById('txtMucApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) obj_save.action = 'L_NhanSu_LuongCoSo_ApDung/CapNhat';
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                me.getList_CoSoApDung();
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CoSoApDung: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_NhanSu_LuongCoSo_ApDung/Xoa',
            
            'strIds': strIds,
            'strChucNang_Id': edu.system.strChucNang_Id,
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
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_CoSoApDung();
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CoSoApDung();
                });
            },
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
    genTable_CoSoApDung: function (data, iPager) {
        var me = this;
        $("#lblHSLL_CoSoApDung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCoSoApDung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CoSoApDung.getList_CoSoApDung()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4, 7, 8]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "NGUOICUOI_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_NGAYSINH"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "PHANLOAIAPDUNG_TEN"
                },
                {
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mDataProp": "MUCAPDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    editForm_NhanSu_CoSoApDung: function (data) {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit_NhanSu_LuongCoSoApDung");
        //view data --Edit
        edu.util.viewHTMLById("lblCanBo", data.NHANSU_HOSOCANBO_HODEM + " " + data.NHANSU_HOSOCANBO_TEN);
        edu.util.viewHTMLById("lblMaCanBo", data.NHANSU_HOSOCANBO_MASO);
        edu.util.viewValById("dropPhanLoai_Edit", data.PHANLOAIAPDUNG_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtMucApDung", data.MUCAPDUNG);
        edu.util.viewValById("txtDonVi", data.DAOTAO_COCAUTOCHUC_TEN);
        edu.util.viewValById("txtMaSo", data.NHANSU_HOSOCANBO_MASO);
        edu.util.viewValById("txtHoTen", data.NHANSU_HOSOCANBO_HODEM + " " + data.NHANSU_HOSOCANBO_TEN);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: 
    --ULR: Modules
    -------------------------------------------*/
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td><input class='form-control input-datepicker' id='txtNgayApDung" + strNhanSu_Id + "' placeholder='dd/mm/yyyy' /></td>";
        html += "<td><input class='form-control' id='txtMucApDung" + strNhanSu_Id + "' /></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_NhanSu tbody").append(html);
        edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_NhanSu tbody").html("");
            $("#tblInput_NhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    show_TongTien: function (strTableId) {
        var dTong = 0;
        var x = $("#" + strTableId + " td .inputsotien");
        for (var i = 0; i < x.length; i++) {
            dTong += parseInt($(x[i]).val().replace(/,/g, ""));
        }
        $("#txtTongTien").html(edu.util.formatCurrency(dTong));
    },

    genModal_NhanSu: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm nhân sự</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_NS" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiCCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn loại cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CCTC_NS" class="select-opt" style="width:100% !important">';
        html += '<option value=""> -- Chọn cơ cấu tổ chức -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_CB_NS" class="select-opt" style="width:100% !important">';
        html += '<option value="0">Cán bộ trong trường</option>';
        html += '<option value="1">Cán bộ ngoài trường</option>';
        html += '<option value="-1">Tất cả nhân sự</option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalNhanSu"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';

        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonNhanSu" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_NhanSu" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Hình ảnh</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-center">CMND</th>';
        html += '<th class="td-center">Mã số thuế</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_ModalNhanSu"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_nhansu").html("");
        $("#modal_nhansu").append(html);
        $("#modal_nhansu").modal("show");
        //setTimeout(function () {
        //    $("#txtSearchModal_TuKhoa_NS").focus();
        //}, 50);
        //$("#txtSearchModal_TuKhoa_NS").focus();
        $("#txtSearchModal_TuKhoa_NS").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                me.getList_NhanSu("SEARCH");
            }
        });
        $("#btnSearch_ModalNhanSu").click(function () {
            me.getList_NhanSu("SEARCH");
        });
        edu.extend.getList_CoCauToChuc();
        $(".select-opt").select2();
        $("#dropSearchModal_LoaiCCTC_NS").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, edu.extend.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", edu.extend.genCombo_CCTC_Childs);
            }
            else {
                edu.extend.genCombo_CCTC_Childs(edu.extend.dtCCTC_Childs);
            }
        });
        $("#modal_nhansu").delegate("#chkSelectAll_ModalNhanSu", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_NhanSu" });
        });
        $("#modal_nhansu").delegate("#btnChonNhanSu", "click", function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_NhanSu", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_NhanSu #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
    },
    getList_NhanSu: function () {
        var me = this;
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearchModal_TuKhoa_NS"),
            pageIndex: edu.system.pageIndex_default,
            pageSize: edu.system.pageSize_default,
            strCoCauToChuc_Id: edu.util.getValById("dropSearchModal_CCTC_NS"),
            strTinhTrangNhanSu_Id: "",
            strNguoiThucHien_Id: "",
            dLaCanBoNgoaiTruong: edu.util.getValById("dropSearchModal_CB_NS")
        };
        edu.system.getList_NhanSu(obj, "", "", me.cbGetListModal_NhanSu);
    },
    cbGetListModal_NhanSu: function (data, iPager) {
        var me = this;
        me.dtNhanSuView = data;
        var jsonForm = {
            strTable_Id: "tblModal_NhanSu",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CoSoApDung.getList_NhanSu('SEARCH')",
                iDataRow: iPager,
            },
            colPos: {
                left: [2],
                fix: [0],
                right: [],
                center: [0, 1, 3, 4, 5, 6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(aData.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_ChucDanh = "";
                        var strNhanSu_Ma = edu.util.returnEmpty(aData.MASO);
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.HOTEN);
                        var strNhanSu_HocHam = edu.util.returnEmpty(aData.LOAICHUCDANH_MA);
                        var strNhanSu_HocVi = edu.util.returnEmpty(aData.LOAIHOCVI_MA);
                        //2. process data
                        if (!edu.util.checkValue(strNhanSu_HocHam)) {
                            strNhanSu_ChucDanh = "";
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_HocHam + ".";
                        }
                        if (!edu.util.checkValue(strNhanSu_HocVi)) {
                            //nothing
                        }
                        else {
                            strNhanSu_ChucDanh = strNhanSu_ChucDanh + strNhanSu_HocVi + ".";
                        }
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_ChucDanh + " " + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_ngaysinh' + aData.ID + '">' + edu.util.returnEmpty(aData.CANCUOC_SO) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span id="sl_gioitinh' + aData.ID + '">' + edu.util.returnEmpty(aData.MASOTHUE) + '</span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },
}