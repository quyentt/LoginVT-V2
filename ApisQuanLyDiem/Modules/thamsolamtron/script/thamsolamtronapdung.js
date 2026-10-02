/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function ThamSoLamTronApDung() { };
ThamSoLamTronApDung.prototype = {
    strChuongTrinh_Id: '',
    dtChuongTrinh: [],
    strCommon_Id: '',
    dtThoiGianDaoTao: [],
    dtLoaiDiemTrungBinh: [],
    strHocPhan_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#tblChuongTrinh").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            $("#zoneEdit").slideDown();
            me.strChuongTrinh_Id = strId;
            edu.util.setOne_BgRow(strId, "tblChuongTrinh");
            me.getList_ThamSoLamTronApDung_ChuongTrinh();
            me.getList_HocPhan_ChuongTrinh();
            var data = edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID");
            me.viewEdit_ThamSoAD_ChuongTrinh(data[0]);
        });
        $("#btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChuongTrinh();
            }
        });
        $("#btnSearch").click(function () {
            me.getList_ChuongTrinh();
        });
        $("#btn_tab1").click(function () {
            $("#tab_ngoai1").hide();
            $("#tab_ngoai2").hide();
            $("#tab-content").show();
        });
        $("#btn_tab2").click(function () {
            $("#tab_ngoai1").show();
            $("#tab-content").hide();
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
        });

        $("#dropSearch_KhoaHoc").on("select2:select", function () {
            me.getList_ChuongTrinh();
        });

        $("#btnKeThua_ThamSoLamTronApDungChungCTTrongKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.save_KeThuaThamSoLamTronAD_ChuongTrinh(id, "");
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThamSoLamTronApDungChungCT").click(function () {
            $("#tblThamSoLamTronApDungChungChoChuongTrinh tbody tr").each(function () {
                var strThamSoLamTron_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSoLamTronApDung_ChuongTrinh(strThamSoLamTron_AD_Id, me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_ThamSoLamTronApDungChungCT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSoLamTronApDungCT(id, "");
        });
        $("#tblThamSoLamTronApDungChungChoChuongTrinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoLamTronApDungChungChoChuongTrinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoLamTronApDungChungChoChuongTrinh").delegate(".deleteThamSoLamTron_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSolamTronApDung_ChuongTrinh(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThamSoLamTronApDung_HocPhan").click(function () {
            $("#tblThamSoLamTronApDung_HocPhan tbody tr").each(function () {
                var strThamSoLamTron_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSoLamTron_HocPhan(strThamSoLamTron_AD_Id, me.strHocPhan_Id + me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_ThamSoLamTronApDung_HocPhan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSoLamTron_HocPhan_New(id, "");
        });
        $("#tblThamSoLamTronApDung_HocPhan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoLamTronApDung_HocPhan tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoLamTronApDung_HocPhan").delegate(".deleteThamSoLamTron_HocPhan", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSoLamTron_HocPhan(strId);
            });
        });
        $("#txtSearch_HocPhan_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_hocphanchuongtrinh li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinh();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDIEMTRUNGBINH", "", "", me.getList_LoaiDiemTrungBinh);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtChuongTrinh = dtResult;
                    me.genTable_ChuongTrinh(dtResult, iPager);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaHoc"),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': edu.system.pageIndex_default,
                'pageSize': edu.system.pageSize_default,
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChuongTrinh: function (data, iPager) {
        var me = this;
        $("#zoneEdit").slideUp();
        edu.util.viewHTMLById("lblChuongTrinh_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblChuongTrinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThamSoLamTronApDung.getList_ChuongTrinh()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnDetail"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + 'Chương trình: ' + edu.util.returnEmpty(aData.TENCHUONGTRINH) + "</span><br />";
                        html += '<span>' + 'Khóa: ' + edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThamSoLamTronApDung_ChuongTrinh: function (strThamSolamTronApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strThamSolamTronApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strThamSolamTronApDung_Id);
        var strLoaiDiemTrungBinh_Id = edu.util.getValById('dropChuongTrinh_LoaiDiemTrungBinh' + strThamSolamTronApDung_Id);
        var dSoLeSauDauPhay = edu.util.getValById('txtSoLeSauDauPhay_CT' + strThamSolamTronApDung_Id);
        var dCoLamTron = edu.util.getValById('dropChuongTrinh_LamTron' + strThamSolamTronApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_CT' + strThamSolamTronApDung_Id);
        //if (!edu.util.checkValue(strLoaiDiemTrungBinh_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoLamTron_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strLoaiDiemTrungBinh_Id': strLoaiDiemTrungBinh_Id,
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'dSoLeSauDauPhay': dSoLeSauDauPhay,
            'dCoLamTron': dCoLamTron,
            'strMoTa': '',
            'strDiem_ThamSoLamTron_Id': '',
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThamSoLamTron_ApDung/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        edu.system.alert("Thêm mới thành công")
                    } else {
                        edu.system.alert("Cập nhật thành công")
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(obj_save + ": " + data.Message);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThamSoLamTronApDung_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoLamTron_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThamSoLamTron_Id': "",
            'strLoaiDiemTrungBinh_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhamViApDung_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThamSoLamTronApDung_ChuongTrinh(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    getDeTail_ThamSoLamTronApDung_ChuongTrinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThamSoLamTron_ApDung/LayChiTiet',
            
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThamSoLamTronApDung_ChuongTrinh(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_detail.action + " (er): " + er);
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThamSolamTronApDung_ChuongTrinh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoLamTron_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSoLamTronApDung_ChuongTrinh();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.endLoading(obj_delete.action + " (er): " + er);
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genHTML_ThamSoLamTronApDung_ChuongTrinh: function (data) {
        var me = this;
        $("#tblThamSoLamTronApDungChungChoChuongTrinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThamSoLamTron_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThamSoLamTron_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThamSoLamTron_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_LoaiDiemTrungBinh' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn loại điểm trung bình--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_CT' + strThamSoLamTron_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><select id="dropChuongTrinh_LamTron' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
            row += '<td><input type="text" id="txtSoLeSauDauPhay_CT' + strThamSoLamTron_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLESAUDAUPHAY) + '" class="form-control"/></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThamSoLamTron_ChuongTrinh" id="' + strThamSoLamTron_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoLamTron_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoLamTronApDungChungChoChuongTrinh tbody").append(row);
            me.genCombo_LoaiDiemTrungBinh("dropChuongTrinh_LoaiDiemTrungBinh" + strThamSoLamTron_AD_Id, data[i].LOAIDIEMTRUNGBINH_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThamSoLamTron_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            edu.util.viewValById("dropChuongTrinh_LamTron" + strThamSoLamTron_AD_Id, data[i].COLAMTRON);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThamSoLamTronApDungCT(id, "");
        //}
    },
    genHTML_ThamSoLamTronApDungCT: function (strThamSoLamTron_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThamSoLamTronApDungChungChoChuongTrinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThamSoLamTron_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThamSoLamTron_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_LoaiDiemTrungBinh' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn loại điểm trung bình--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_CT' + strThamSoLamTron_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><select id="dropChuongTrinh_LamTron' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
        row += '<td><input type="text" id="txtSoLeSauDauPhay_CT' + strThamSoLamTron_AD_Id + '" class="form-control"/></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoLamTron_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoLamTronApDungChungChoChuongTrinh tbody").append(row);
        me.genCombo_LoaiDiemTrungBinh("dropChuongTrinh_LoaiDiemTrungBinh" + strThamSoLamTron_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThamSoLamTron_AD_Id, "");
        edu.system.pickerdate();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThamSoLamTron_HocPhan: function (strThamLamTronApDung_Id, strHocPhan_Id) {
        var me = this;
        var strId = strThamLamTronApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropHP_ThoiGianDaoTao' + strThamLamTronApDung_Id);
        var strLoaiDiemTrungBinh_Id = edu.util.getValById('dropHP_LoaiDiemTrungBinh' + strThamLamTronApDung_Id);
        var dSoLeSauDauPhay = edu.util.getValById('txtSoLeSauDauPhay_HP' + strThamLamTronApDung_Id);
        var dCoLamTron = edu.util.getValById('dropHP_LamTron' + strThamLamTronApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_HP' + strThamLamTronApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        if (!edu.util.checkValue(strLoaiDiemTrungBinh_Id)) {
            //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoLamTron_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strLoaiDiemTrungBinh_Id': strLoaiDiemTrungBinh_Id,
            'strPhamViApDung_Id': strHocPhan_Id,
            'dSoLeSauDauPhay': dSoLeSauDauPhay,
            'dCoLamTron': dCoLamTron,
            'strDiem_ThamSoLamTron_Id': '',
            'strMoTa': '',
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_ThamSoLamTron_ApDung/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        edu.system.alert("Thêm mới thành công")
                    } else {
                        edu.system.alert("Cập nhật thành công")
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }
            },
            error: function (er) {
                obj_notify = {
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThamSoLamTron_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoLamTron_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThamSoLamTron_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strLoaiDiemTrungBinh_Id': "",
            'strPhamViApDung_Id': me.strHocPhan_Id + me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThamSoLamTron_HocPhan(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_ThamSoLamTron_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoLamTron_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSoLamTron_HocPhan();
                }
                else {
                    edu.system.alert(obj_delete.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.endLoading(obj_delete.action + " (er): " + er);
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genHTML_ThamSoLamTron_HocPhan: function (data) {
        var me = this;
        $("#tblThamSoLamTronApDung_HocPhan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThamSoLamTron_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThamSoLamTron_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThamSoLamTron_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHP_LoaiDiemTrungBinh' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn tham số học tập--</option ></select ></td>';
            row += '<td><select id="dropHP_ThoiGianDaoTao' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_HP' + strThamSoLamTron_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><select id="dropHP_LamTron' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
            row += '<td><input type="text" id="txtSoLeSauDauPhay_HP' + strThamSoLamTron_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLESAUDAUPHAY) + '" class="form-control"/></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThamSoLamTron_HocPhan" id="' + strThamSoLamTron_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoLamTron_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoLamTronApDung_HocPhan tbody").append(row);
            me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strThamSoLamTron_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            edu.util.viewValById("dropHP_LamTron" + strThamSoLamTron_AD_Id, data[i].COLAMTRON);
            me.genCombo_LoaiDiemTrungBinh("dropHP_LoaiDiemTrungBinh" + strThamSoLamTron_AD_Id, data[i].LOAIDIEMTRUNGBINH_ID);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThamSoLamTron_HocPhan_New(id, "");
        //}
    },
    genHTML_ThamSoLamTron_HocPhan_New: function (strThamSoLamTron_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThamSoLamTronApDung_HocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThamSoLamTron_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThamSoLamTron_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHP_LoaiDiemTrungBinh' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn tham số học tập--</option ></select ></td>';
        row += '<td><select id="dropHP_ThoiGianDaoTao' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_HP' + strThamSoLamTron_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><select id="dropHP_LamTron' + strThamSoLamTron_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
        row += '<td><input type="text" id="txtSoLeSauDauPhay_HP' + strThamSoLamTron_AD_Id + '" class="form-control"/></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoLamTron_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoLamTronApDung_HocPhan tbody").append(row);
        me.genCombo_LoaiDiemTrungBinh("dropHP_LoaiDiemTrungBinh" + strThamSoLamTron_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strThamSoLamTron_AD_Id, "");
        edu.system.pickerdate();
    },

    save_KeThuaThamSoLamTronAD_ChuongTrinh: function (strChuongTrinh_Id) {
        var me = this;
        var strId = strChuongTrinh_Id;

        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoLamTron_ApDung/KeThua',
            

            
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_ThamSoLamTron_ApDung/KeThua';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Kế thừa cho tất cả chương trình trong khóa thành công")
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.notifyLocal(obj_notify);
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strChuongTrinh_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtThoiGianDaoTao = dtResult;
                }
                else {
                    edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'KHCT_ThoiGianDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDAOTAO_NAM_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThoiGianDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> hoc phan theo chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan_ChuongTrinh: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhan_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HocPhan_ChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_HocPhan_ChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_HocPhan_ChuongTrinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_ThoiGian_KH_Id': "",
                'strDaoTao_ThoiGian_TT_Id': "",
                'strThuocTinhHocPhan_Id': "",
                'strPhanCongPhamViDamNhiem_Id': "",
                'strDaoTao_HocPhan_Id': "",
                'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: ""
            },
            renderPlaces: ["zone_hocphanchuongtrinh"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //for (var i = 0; i < dtResult.length; i++) {
        //    $($("#zone_hocphanchuongtrinh #" + dtResult[i].ID + " a")[0]).append(" <span style='color: blue'>(Tổng số HP: " + dtResult[i].TONGSOHP + "; \t Tổng số TC: " + dtResult[i].TONGSOTC + "; \t Số HP bắt buộc: " + dtResult[i].SOHOCPHANQUYDINH + "; \t Số TC bắt buộc: " + dtResult[i].SOTINCHIQUYDINH + ")</span>");
        //}
        //2. Action
        $('#zone_hocphanchuongtrinh').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strHocPhan_Id = strNameNode;
            me.getList_ThamSoLamTron_HocPhan();
            $("#tab_ngoai2").show();
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_KhoaHoc"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> diem chu
    --Author: duyentt
	-------------------------------------------*/
    getList_LoaiDiemTrungBinh: function (data) {
        main_doc.ThamSoLamTronApDung.dtLoaiDiemTrungBinh = data;
    },
    genCombo_LoaiDiemTrungBinh: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiDiemTrungBinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn loại điểm trung bình"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },

    viewEdit_ThamSoAD_ChuongTrinh: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblThamSoApDungChuongTrinh", data.TENCHUONGTRINH);
    },
}