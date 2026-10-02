function PhanCap() { }
PhanCap.prototype = {
    dtCCTC_Parents: [],
    dtCCTC_Childs: [],
    strPhanCap_Id: '',
    strLanhDaoDG_Id: '',
    arrNhanVien_Id: [],
    action: "",

    init: function () {
        var me = this;
        edu.system.page_load();
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_list();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $(".btnSearchPhanCap_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
            me.action = "DT_DDG";
        });
        $(".btnSearchPhanCap_DTDGNhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("LOAD");
            me.action = "DT_DG";
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_input();
        });
        $("#btnSavePhanCap").click(function () {
            me.save_PhanCap();
        });
        $("#txtSearch_PhanCap_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LanhDaoDG();
            }
        });
        $("#tblPhanCap_LanhDaoDG").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_list();
                me.strLanhDaoDG_Id = strId;
                me.getList_NhanVienDG(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblPhanCap_LanhDaoDG").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_PhanCap(strId);
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblPhanCap_NhanVienDG").delegate(".btnDelete", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_PhanCap(strId);
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#dropSearch_PhanCap_CCTC").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strLanhDaoDG_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            if (me.action === "DT_DG") {
                me.addLanhDao_tblDanhGia(strLanhDaoDG_Id);
            }
            else {
                me.addNhanVien_tblDanhGia(strLanhDaoDG_Id);
            }
        });
        $("#tblNhanVienDG").delegate('.btnRemove', 'click', function () {
            var id = this.id;
            var strLanhDaoDG_Id = edu.util.cutPrefixId(/rmnhansu/g, id);
            me.removeLanhDao_tblDanhGia(strLanhDaoDG_Id);
        });
    },
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_PhanCap_TuKhoa");
        me.toggle_list();
        edu.system.dateYearToCombo("1993", "dropPhanCap_NamApDung", "Chọn năm áp dụng")
        setTimeout(function () {
            me.getList_LanhDaoDG();
            setTimeout(function () {
                me.getList_CoCauToChuc();
                setTimeout(function () {
                    me.getList_KeHoach();
                }, 50);
            }, 50);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strPhanCap_Id = "";
        var arrId = ["txtPhanCap_NgayBatDau", "txtPhanCap_NgayKetThuc", "txtPhanCap_SoNgayNghi", "txtPhanCap_ThamNien", "dropPhanCap_NamApDung"];
        edu.util.resetValByArrId(arrId);
        $("#ckbPhanCap_All").prop('checked', false);
        $("#tblNhanVienDG tbody").html("");
        me.arrNhanVien_Id = [];
    },
    toggle_list: function () {
        edu.util.toggle_overide("zonePhanCap", "zone_list_PhanCap");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zonePhanCap", "zone_input_PhanCap");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zonePhanCap", "zone_notify_PhanCap");
    },
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
    },
    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_KeHoach/LayDanhSach',            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': '',
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
                    me.genCombo_KeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_KeHoach/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_KeHoach/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    processData_CoCauToChuc: function (data) {
        var me = main_doc.PhanCap;
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
            renderPlace: ["dropSearch_PhanCap_CCTC"],
            type: "",
            title: "Cơ cấu khoa/viện/phòng ban"
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
            renderPlace: ["dropSearch_PhanCap_BoMon"],
            type: "",
            title: "Bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
                code: "MA"
            },
            renderPlace: ["dropPhanCap_KeHoach","dropSearch_PhanCap_KeHoach"],
            type: "",
            title: "Kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_LanhDaoDG: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_PhanCap/LayDanhSachLanhDao',
            
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropSearch_PhanCap_KeHoach")
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_LanhDaoDG(dtResult);
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_PhanCap/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_PhanCap/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NhanVienDG: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_PhanCap/LayDanhSachNhanVien',
            
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropSearch_PhanCap_KeHoach"),
            'strNhansu_Hosocanbo_LD_Id': me.strLanhDaoDG_Id
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_NhanVienDG(dtResult);
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_PhanCap/LayDanhSach: " + data.Message, "w");
                }
                            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_PhanCap/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanCap: function () {
        var me = this;
        var strLanhDaoDG_Ids = "";
        for (var i = 0; i < me.arrNhanVien_Id.length; i++) {
            //convert to string seprate by #
            if (i < me.arrNhanVien_Id.length - 1) {
                strLanhDaoDG_Ids += me.arrNhanVien_Id[i] + "#";
            }
            else {
                strLanhDaoDG_Ids += me.arrNhanVien_Id[i];
            }
        }
        console.log("NhanSuId: " + strLanhDaoDG_Ids);
        console.log("strLanhDaoDG_Id: " + me.strLanhDaoDG_Id);
        var obj_save = {
            'action': 'NS_PLDG_NLD_PhanCap/ThemMoi',            

            'strId': "",
            'strNhanSu_DGPL_Nam_KH_Id': edu.util.getValById("dropPhanCap_KeHoach"),
            'strNhanSu_HoSoCanBo_Id': strLanhDaoDG_Ids,
            'strNhanSu_HoSoCanBo_LD_Id': me.strLanhDaoDG_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_LanhDaoDG();
                }
                else {
                    edu.system.alert("NS_PLDG_NLD_PhanCap/ThemMoi: " + data.Message);
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_NLD_PhanCap/ThemMoi (er): " + JSON.stringify(er), "w");                
            },
            type: 'POST',            
            contentType: true,            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhanCap: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_PLDG_NLD_PhanCap/Xoa',            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NhanVienDG();
                }
                else {
                    obj = {
                        content: "NS_PLDG_NLD_PhanCap/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }                
            },
            error: function (er) {
                var obj = {
                    content: "NS_PLDG_NLD_PhanCap/Xoa (er): " + JSON.stringify(er),
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
    genTable_LanhDaoDG: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblPhanCap_LanhDaoDG_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblPhanCap_LanhDaoDG",
            aaData: data,
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 1],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(data.ANH);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span id="lbl' + aData.ID + '">' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnDelete" id="view_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_NhanVienDG: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhanCap_NhanVienDG",
            aaData: data,
            bHiddenHeader: true,
            colPos: {
                center: [0, 3],
                left: [],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(data.ANH);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span id="lbl' + aData.ID + '">' + edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MASO) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btnDelete" id="delete_' + aData.ID + '" href="#" title="delete"><i class="fa fa-trash color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewDetail_PhanCap: function (data) {
        var me = main_doc.PhanCap;
        var dt = data[0];
        edu.util.viewHTMLById("lblQuyetDinh_NguoiNhap", dt.CANBONHAP_TENDAYDU);
        edu.util.viewHTMLById("lblQuyetDinh_Ten", dt.THONGTINQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_Loai", dt.LOAIQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_So", dt.SOQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_Ngay", dt.NGAYQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_NgayHieuLuc", dt.NGAYHIEULUC);
        edu.util.viewHTMLById("lblQuyetDinh_NgayKetThuc", dt.NGAYHETHIEULUC);
        edu.util.viewHTMLById("lblQuyetDinh_NguoiKy", dt.NGUOIKYQUYETDINH);
        edu.util.viewHTMLById("lblQuyetDinh_ChuKy", "");
        edu.system.viewFiles("lblQuyetDinh_File", dt.THONGTINDINHKEM);
    },
    addLanhDao_tblDanhGia: function (strLanhDaoDG_Id) {
        var me = this;
        me.strLanhDaoDG_Id = strLanhDaoDG_Id;
        //1. get id and get val
        var $hinhanh = "#sl_hinhanh" + strLanhDaoDG_Id;
        var $hoten = "#sl_hoten" + strLanhDaoDG_Id;
        var $ngaysinh = "#sl_ngaysinh" + strLanhDaoDG_Id;
        var $ma = "#sl_ma" + strLanhDaoDG_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valNgaySinh = $($ngaysinh).text();
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valNgaySinh + "</span></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblLanhDaoDG tbody").html(html);
    },
    addNhanVien_tblDanhGia: function (strLanhDaoDG_Id) {
        var me = this;
        //[1] add to arrNhanVien_Id
        if (edu.util.arrEqualVal(me.arrNhanVien_Id, strLanhDaoDG_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strLanhDaoDG_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strLanhDaoDG_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanVien_Id.push(strLanhDaoDG_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strLanhDaoDG_Id;
        var $hoten = "#sl_hoten" + strLanhDaoDG_Id;
        var $ngaysinh = "#sl_ngaysinh" + strLanhDaoDG_Id;
        var $ma = "#sl_ma" + strLanhDaoDG_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valNgaySinh = $($ngaysinh).text();
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strLanhDaoDG_Id + "'>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valNgaySinh + "</span></td>";
        html += "<td class='td-center'><a id='rmnhansu" + strLanhDaoDG_Id + "' class='btnRemove poiter'>Bỏ chọn</td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblNhanVienDG tbody").append(html);
    },
    removeLanhDao_tblDanhGia: function (strLanhDaoDG_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strLanhDaoDG_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanVien_Id, strLanhDaoDG_Id);
        if (me.arrNhanVien_Id.length === 0) {
            $("#tblNhanVienDG tbody").html("");
            $("#tblNhanVienDG tbody").html('<tr><td colspan="6" class="td-center">Không tìm thấy dữ liệu!</td></tr>');
        }
    }
};