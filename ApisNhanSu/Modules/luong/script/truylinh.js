/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function TruyLinh() { };
TruyLinh.prototype = {
    dt_NO: [],
    strNguoiO_Id: '',
    arrNhanSu_Id: [],
    strNhanSu_Id: '',
    dtNhanSu: [],
    strTruyLinh_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnSearchKhoiTao_NhanSu").click(function () {
            me.getList_TruyLinh();
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });

        $(".btnAdd").click(function () {
            me.toggle_hosoedit();
        });
        $("#SaveTruyLinh").click(function () {
            var x = $("#tblInput_GiangVien tbody tr");

            edu.system.genHTML_Progress("progess_TruyLinh", x.length);
            for (var i = 0; i < x.length; i++) {
                var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
                me.save_TruyLinh(strNhanSu_Id);
            }
        });

        $("#Save_NS_TruyLinh").click(function () {
            //var x = $("#tblInput_GiangVien tbody tr");

            //var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
            me.Update_NS_TruyLinh();
            //edu.system.genHTML_Progress("progess_DuocNhan", x.length);
            //for (var i = 0; i < x.length; i++) {
            //    var strNhanSu_Id = x[i].id.replace(/rm_row/g, '');
            //    me.save_NS_DuocNhanKhac(strNhanSu_Id);
            //}
        });
        $("#dropSearch_DonViThanhVien_TruyLinh").on("select2:select", function () {
            me.getList_HS();
            me.getList_TruyLinh();
        });
        $("#dropSearch_ThanhVien_TruyLinh").on("select2:select", function () {
            me.getList_HS();
            me.getList_TruyLinh();
        });
        $("#txtSearch_TruyLinh_TuNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TruyLinh();
            }
        });
        $("#txtSearch_TruyLinh_DenNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TruyLinh();
            }
        });
        $("#txtSearch_TruyLinh_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
                me.getList_TruyLinh();
            }
        });
        $(".btnSearch").click(function () {
            me.getList_TruyLinh();
        });
        $(".btnSearch_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
            me.show_TongTien("tblInput_GiangVien");
        });
        $("#tblInput_GiangVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
        });
        $("[id$=chkSelectAll_TruyLinh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTruyLinh" });
        });
        $("#btnXoaTruyLinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTruyLinh", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TruyLinh(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_TruyLinh();
            }, 1000);
        });
        $("#zoneEdit").delegate("#txtSoTien", "keyup", function (e) {
            var x = $("#txtSoTien").val().replace(/,/g, "");
            $("#txtSoTien").val(edu.util.formatCurrency(x));
        });
        $("#tblInput_GiangVien").delegate(".inputsotien", "keyup", function (e) {
            var point = $(this);
            point.val(edu.util.formatCurrency(point.val().replace(/,/g, "")));
            me.show_TongTien("tblInput_GiangVien");
        });
        $("#tblTruyLinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            $(".myModalLabel").html('<i class="fa fa-pencil"></i> Chỉnh sửa');
            edu.util.setOne_BgRow(strId, "tblTruyLinh");
            if (edu.util.checkValue(strId)) {
                me.strCommon_Id = strId;
                me.getDetail_NS_TruyLinh(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
            var data = edu.util.objGetDataInData(strId, me.dtNhanSu, "ID")[0];
            me.viewForm_NhanSu(data);
        });
    },
    page_load: function () {
        var me = this;
        me.arrValid_NO = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            //{ "MA": "txtNO_Ho", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Ten", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Email", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_CoCauToChuc", "THONGTIN1": "EM" },
            { "MA": "txtNO_MaSo", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_TinhTrangNhanSu", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_LoaiDoiTuong", "THONGTIN1": "EM" }
        ];
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_TruyLinh();
        me.getList_CoCauToChuc();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIKHOAN", "dropLoaiKhoan, dropNS_LoaiKhoan");
    },
    toggle_batdau: function () {
        var me = main_doc.TruyLinh;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        me.getList_TruyLinh();
    },
    toggle_hosoedit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewrite: function () {
        var me = this;
        edu.util.viewValById("dropLoaiKhoan", "");
        edu.util.viewValById("txtSoTien", "");
        edu.util.viewValById("txtChungTu", "");
        edu.util.viewValById("txtNgay", "");
        edu.util.viewValById("txtThang", "");
        edu.util.viewValById("txtNam", "");
        edu.util.viewValById("txtNoiDung", "");
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    getList_TruyLinh: function () {
        var me = main_doc.TruyLinh;
        //--Edit
        var obj_list = {
            'action': 'L_TruyLinh/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TruyLinh_TuKhoa"),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_TruyLinh"),
            'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_TruyLinh_TuNgay"),
            'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_TruyLinh_DenNgay"),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien_TruyLinh"),
            'strNguoiTao_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.dtNhanSu = data.Data;
                    me.genTable_TruyLinh(data.Data, data.Pager);
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
    save_TruyLinh: function (strNhanSu_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'L_TruyLinh/ThemMoi',
            

            'strId': '',
            'dNam': edu.util.getValById("txtNam"),
            'dThang': edu.util.getValById("txtThang"),
            'strSoTien': edu.util.getValById("txtSoTien_" + strNhanSu_Id).replace(/,/g, ""),
            'strChungTu': edu.util.getValById("txtChungTu"),
            'strNgayPhatSinh': edu.util.getValById("txtNgay"),
            'strMoTa': edu.util.getValById('txtNoiDung'),

            'strLoaiKhoan_Id': edu.util.getValById("dropLoaiKhoan"),
            'strNhanSu_HoSoCanBo_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        //edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TruyLinh();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
                edu.system.start_Progress("progess_DuocNhan", me.toggle_batdau);
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
                edu.system.start_Progress("progess_TruyLinh", me.toggle_batdau);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    Update_NS_TruyLinh: function () {
        var me = this;
        var obj_notify = {};

        var obj_save = {
            'action': 'L_TruyLinh/CapNhat',
            

            'strId': me.strIds,
            'dNam': "",
            'dThang': "",
            'strSoTien': edu.util.getValById("txtNS_SoTien").replace(/,/g, ""),
            'strChungTu': edu.util.getValById("txtNS_ChungTu"),
            'strNgayPhatSinh': edu.util.getValById("txtNS_Ngay"),
            'strMoTa': edu.util.getValById('txtNS_NoiDung'),

            'strLoaiKhoan_Id': edu.util.getValById("dropNS_LoaiKhoan"),
            'strNhanSu_HoSoCanBo_Id': me.strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(me.strCommon_Id)) {
                        edu.system.alert("Thêm mới thành công!");
                        //edu.extend.ThietLapQuaTrinhCuoiCung(data.Id, "NHANSU_QT_KHAMSK");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_TruyLinh();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                
                edu.system.start_Progress("progess_TruyLinh", me.toggle_batdau);
            },
            error: function (er) {
                
                edu.system.alert(obj_save.action + " (er): " + er);
                edu.system.start_Progress("progess_TruyLinh", me.toggle_batdau);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_NS_TruyLinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'L_TruyLinh/LayChiTiet',
            
            'strId': strId
        };

        
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
                    if (edu.util.checkValue(data.Data)) {
                        me.editForm_NhanSu_TruyLinh(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TruyLinh: function (strIds) {
        var me = main_doc.TruyLinh;
        //--Edit
        var obj_delete = {
            'action': 'L_TruyLinh/Xoa',
            
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
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    me.getList_TruyLinh();
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
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_TruyLinh: function (data, iPager) {
        $("#lblHSLL_TruyLinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTruyLinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TruyLinh.getList_TruyLinh()",
                iDataRow: iPager
            },
            sort: true,
            colPos: {
                center: [0, 2, 4, 7, 8, 9, 10],
                //right: [5]
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
                        return aData.NHANSU_HOSOCANBO_HODEM + " " + aData.NHANSU_HOSOCANBO_TEN;
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "CHUNGTU"
                },
                {
                    "mData": "LOAIKHOAN_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "LOAIKHOAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    editForm_NhanSu_TruyLinh: function (data) {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit_NhanSu_TruyLinh");
        //view data --Edit
        edu.util.viewValById("dropNS_LoaiKhoan", data.LOAIKHOAN_ID);
        edu.util.viewValById("txtNS_SoTien", data.SOTIEN);
        edu.util.viewValById("txtNS_ChungTu", data.CHUNGTU);
        edu.util.viewValById("txtNS_Ngay", data.NGAYPHATSINH);
        edu.util.viewValById("txtNS_NoiDung", data.MOTA);
        me.strNhanSu_Id = data.NHANSU_HOSOCANBO_ID;
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
            renderPlace: ["dropSearch_DonViThanhVien_TruyLinh"],
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_TruyLinh"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
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
            renderPlace: ["dropSearch_ThanhVien_TruyLinh"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    viewForm_NhanSu: function (data) {
        var me = this;
        console.log(data.NHANSU_HOSOCANBO_HODEM + " " + data.NHANSU_HOSOCANBO_TEN)
        edu.util.viewHTMLById("lblCanBo", data.NHANSU_HOSOCANBO_HODEM + " " + data.NHANSU_HOSOCANBO_TEN);
        edu.util.viewHTMLById("lblMaCanBo", data.NHANSU_HOSOCANBO_MASO);
        //$("#lblCanBo").html(data.NHANSU_HOSOCANBO_HODEM + " " + data.NHANSU_HOSOCANBO_TEN);
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
        html += "<td><input class='form-control inputsotien' id='txtSoTien_" + strNhanSu_Id + "' value='" + edu.util.getValById("txtSoTien") + "'/></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_GiangVien tbody").append(html);
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInput_GiangVien tbody").html("");
            $("#tblInput_GiangVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
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
}