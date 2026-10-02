/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function ThanhPhanDiemApDung() { };
ThanhPhanDiemApDung.prototype = {
    strChuongTrinh_Id: '',
    dtChuongTrinh: [],
    strCommon_Id: '',
    dtThoiGianDaoTao: [],
    dtThanhPhanDiem: [],
    dtQuyTacLamTron: [],
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
            me.getList_ThanhPhanDiemApDung_ChuongTrinh();
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

        $("#btnKeThua_ThanhPhanDiemApDungChungCTTrongKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.save_KeThuaThanhPhanDiemAD_ChuongTrinh(id, "");
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThanhPhanDiemApDungChungCT").click(function () {
            $("#tblThanhPhanDiemApDungChungChoChuongTrinh tbody tr").each(function () {
                var strThanhPhanDiem_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThanhPhanDiemApDung_ChuongTrinh(strThanhPhanDiem_AD_Id, me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_ThanhPhanDiemApDungChungCT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhPhanDiemApDungCT(id, "");
        });
        $("#tblThanhPhanDiemApDungChungChoChuongTrinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThanhPhanDiemApDungChungChoChuongTrinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblThanhPhanDiemApDungChungChoChuongTrinh").delegate(".deleteThanhPhanDiem_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThanhPhanDiemApDung_ChuongTrinh(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThanhPhanDiemApDung_HocPhan").click(function () {
            $("#tblThanhPhanDiemApDung_HocPhan tbody tr").each(function () {
                var strThanhPhanDiem_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThanhPhanDiem_HocPhan(strThanhPhanDiem_AD_Id, me.strHocPhan_Id + me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_ThanhPhanDiemApDung_HocPhan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhPhanDiem_HocPhan_New(id, "");
        });
        $("#tblThanhPhanDiemApDung_HocPhan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThanhPhanDiemApDung_HocPhan tr[id='" + strRowId + "']").remove();
        });
        $("#tblThanhPhanDiemApDung_HocPhan").delegate(".deleteThanhPhanDiem_HocPhan", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThanhPhanDiem_HocPhan(strId);
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
        me.getList_ThanhPhanDiem();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACLAMTRON", "", "", me.getList_QuyTacLamTron);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> tham so hoc tap chung
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyTacLamTron: function (data) {
        main_doc.ThanhPhanDiemApDung.dtQuyTacLamTron = data;
    },
    genCombo_QuyTacLamTron: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyTacLamTron,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy tắc làm tròn"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
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
                strFuntionName: "main_doc.ThanhPhanDiemApDung.getList_ChuongTrinh()",
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
                        html += '<span>' + 'Khóa đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN) + "</span><br />";
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
    save_ThanhPhanDiemApDung_ChuongTrinh: function (strThanhPhanDiemApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strThanhPhanDiemApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strThanhPhanDiemApDung_Id);
        var strDiem_ThanhPhanDiem_Id = edu.util.getValById('dropChuongTrinh_ThanhPhanDiem' + strThanhPhanDiemApDung_Id);
        var dSoLeSauDauPhay = edu.util.getValById('txtSoLe_CT' + strThanhPhanDiemApDung_Id);
        var dCoLamTron = edu.util.getValById('dropChuongTrinh_LamTron' + strThanhPhanDiemApDung_Id);
        var strQuyTacLamTron_Id = edu.util.getValById('dropChuongTrinh_QuyTacLamTron' + strThanhPhanDiemApDung_Id);
        var strGiaTriMacDinhChuaCoDiem = edu.util.getValById('txtGiaTriMacDinh_CT' + strThanhPhanDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_CT' + strThanhPhanDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        //if (!edu.util.checkValue(strDiem_ThanhPhanDiem_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThanhPhanDiem_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strMa': '',
            'strTen': '',
            'dCoChoPhepThiLai': '',
            'strThangDiem_Id': '',
            'strKyHieu': '',
            'dLaDiemTongKet': '',
            'dLaThanhPhanDiemCuoi': '',
            'dSoLeSauDauPhay': dSoLeSauDauPhay,
            'strGiaTriMacDinhChuaCoDiem': strGiaTriMacDinhChuaCoDiem,
            'dCoLamTron': dCoLamTron,
            'strQuyTacLamTron_Id': strQuyTacLamTron_Id,
            'strDiem_ThanhPhanDiem_Id': strDiem_ThanhPhanDiem_Id,
            'iThuTu': '',
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThanhPhanDiem_ApDung/CapNhat';
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
    getList_ThanhPhanDiemApDung_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThanhPhanDiem_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strThangDiem_Id': "",
            'strQuyTacLamTron_Id': "",
            'strDiem_ThanhPhanDiem_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThanhPhanDiemApDung_ChuongTrinh(data.Data);
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
    getDeTail_ThanhPhanDiemApDung_ChuongTrinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThanhPhanDiem_ApDung/LayChiTiet',
            
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThanhPhanDiemApDung_ChuongTrinh(data.Data[0]);
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
    delete_ThanhPhanDiemApDung_ChuongTrinh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThanhPhanDiem_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThanhPhanDiemApDung_ChuongTrinh();
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

    genHTML_ThanhPhanDiemApDung_ChuongTrinh: function (data) {
        var me = this;
        $("#tblThanhPhanDiemApDungChungChoChuongTrinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThanhPhanDiem_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThanhPhanDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThanhPhanDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_ThanhPhanDiem' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thành phần điểm --<option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_CT' + strThanhPhanDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtSoLe_CT' + strThanhPhanDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLESAUDAUPHAY) + '"  class="form-control"/></td>';
            row += '<td><select id="dropChuongTrinh_LamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
            row += '<td><select id="dropChuongTrinh_QuyTacLamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc làm tròn --<option ></select ></td>';
            row += '<td><input type="text" id="txtGiaTriMacDinh_CT' + strThanhPhanDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].GIATRIMACDINHKHICHUACODIEM) + '" class="form-control"/></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThanhPhanDiem_ChuongTrinh" id="' + strThanhPhanDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThanhPhanDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThanhPhanDiemApDungChungChoChuongTrinh tbody").append(row);
            me.genCombo_ThanhPhanDiem("dropChuongTrinh_ThanhPhanDiem" + strThanhPhanDiem_AD_Id, data[i].DIEM_THANHPHANDIEM_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThanhPhanDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            me.genCombo_QuyTacLamTron("dropChuongTrinh_QuyTacLamTron" + strThanhPhanDiem_AD_Id, data[i].QUYTACLAMTRON_ID);
            edu.util.viewValById("dropChuongTrinh_LamTron" + strThanhPhanDiem_AD_Id, data[i].COLAMTRON);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThanhPhanDiemApDungCT(id, "");
        //}
    },
    genHTML_ThanhPhanDiemApDungCT: function (strThanhPhanDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThanhPhanDiemApDungChungChoChuongTrinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThanhPhanDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThanhPhanDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_ThanhPhanDiem' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thành phần điểm --<option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_CT' + strThanhPhanDiem_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><input type="text" id="txtSoLe_CT' + strThanhPhanDiem_AD_Id + '"  class="form-control"/></td>';
        row += '<td><select id="dropChuongTrinh_LamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
        row += '<td><select id="dropChuongTrinh_QuyTacLamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc làm tròn --<option ></select ></td>';
        row += '<td><input type="text" id="txtGiaTriMacDinh_CT' + strThanhPhanDiem_AD_Id + '" class="form-control"/></td>';
        row += '<td></td>';
        row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThanhPhanDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThanhPhanDiemApDungChungChoChuongTrinh tbody").append(row);
        me.genCombo_ThanhPhanDiem("dropChuongTrinh_ThanhPhanDiem" + strThanhPhanDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThanhPhanDiem_AD_Id, "");
        me.genCombo_QuyTacLamTron("dropChuongTrinh_QuyTacLamTron" + strThanhPhanDiem_AD_Id, "");
        edu.system.pickerdate();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhPhanDiem_HocPhan: function (strThanhPhanDiemApDung_Id, strHocPhan_Id) {
        var me = this;
        var strId = strThanhPhanDiemApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropHP_ThoiGianDaoTao' + strThanhPhanDiemApDung_Id);
        var strDiem_ThanhPhanDiem_Id = edu.util.getValById('dropHP_ThanhPhanDiem' + strThanhPhanDiemApDung_Id);
        var dSoLeSauDauPhay = edu.util.getValById('txtSoLe_HP' + strThanhPhanDiemApDung_Id);
        var dCoLamTron = edu.util.getValById('dropHP_LamTron' + strThanhPhanDiemApDung_Id);
        var strQuyTacLamTron_Id = edu.util.getValById('dropHP_QuyTacLamTron' + strThanhPhanDiemApDung_Id);
        var strGiaTriMacDinhChuaCoDiem = edu.util.getValById('txtGiaTriMacDinh_HP' + strThanhPhanDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_HP' + strThanhPhanDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        if (!edu.util.checkValue(strDiem_ThanhPhanDiem_Id)) {
            //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThanhPhanDiem_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strMa': '',
            'strTen': '',
            'dCoChoPhepThiLai': '',
            'strThangDiem_Id': '',
            'strKyHieu': '',
            'dLaDiemTongKet': '',
            'dLaThanhPhanDiemCuoi': '',
            'dSoLeSauDauPhay': dSoLeSauDauPhay,
            'dCoLamTron': dCoLamTron,
            'strGiaTriMacDinhChuaCoDiem': strGiaTriMacDinhChuaCoDiem,
            'strQuyTacLamTron_Id': strQuyTacLamTron_Id,
            'strDiem_ThanhPhanDiem_Id': strDiem_ThanhPhanDiem_Id,
            'iThuTu': '',
            'strPhamViApDung_Id': strHocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThanhPhanDiem_ApDung/CapNhat';
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
                    edu.system.notifyLocal(obj_notify);
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
    getList_ThanhPhanDiem_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThanhPhanDiem_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strThangDiem_Id': "",
            'strQuyTacLamTron_Id': "",
            'strDiem_ThanhPhanDiem_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strHocPhan_Id + me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThanhPhanDiem_HocPhan(data.Data);
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
    delete_ThanhPhanDiem_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThanhPhanDiem_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThanhPhanDiem_HocPhan();
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

    genHTML_ThanhPhanDiem_HocPhan: function (data) {
        var me = this;
        $("#tblThanhPhanDiemApDung_HocPhan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThanhPhanDiem_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThanhPhanDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThanhPhanDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHP_ThanhPhanDiem' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thành phần điểm --<option ></select ></td>';
            row += '<td><select id="dropHP_ThoiGianDaoTao' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_HP' + strThanhPhanDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtSoLe_HP' + strThanhPhanDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLESAUDAUPHAY) + '"  class="form-control"/></td>';
            row += '<td><select id="dropHP_LamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
            row += '<td><select id="dropHP_QuyTacLamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc làm tròn --<option ></select ></td>';
            row += '<td><input type="text" id="txtGiaTriMacDinh_HP' + strThanhPhanDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].GIATRIMACDINHKHICHUACODIEM) + '" class="form-control"/></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThanhPhanDiem_HocPhan" id="' + strThanhPhanDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThanhPhanDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThanhPhanDiemApDung_HocPhan tbody").append(row);
            me.genCombo_ThanhPhanDiem("dropHP_ThanhPhanDiem" + strThanhPhanDiem_AD_Id, data[i].DIEM_THANHPHANDIEM_ID);
            me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strThanhPhanDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            me.genCombo_QuyTacLamTron("dropHP_QuyTacLamTron" + strThanhPhanDiem_AD_Id, data[i].QUYTACLAMTRON_ID);
            edu.util.viewValById("dropHP_LamTron" + strThanhPhanDiem_AD_Id, data[i].COLAMTRON);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThanhPhanDiem_HocPhan_New(id, "");
        //}
    },
    genHTML_ThanhPhanDiem_HocPhan_New: function (strThanhPhanDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThanhPhanDiemApDung_HocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThanhPhanDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThanhPhanDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHP_ThanhPhanDiem' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thành phần điểm --<option ></select ></td>';
        row += '<td><select id="dropHP_ThoiGianDaoTao' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_HP' + strThanhPhanDiem_AD_Id +  '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
        row += '<td><input type="text" id="txtSoLe_HP' + strThanhPhanDiem_AD_Id + '"  class="form-control"/></td>';
        row += '<td><select id="dropHP_LamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value="0"> Không </option > <option value="1"> Có </option > </select ></td>';
        row += '<td><select id="dropHP_QuyTacLamTron' + strThanhPhanDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc làm tròn --<option ></select ></td>';
        row += '<td><input type="text" id="txtGiaTriMacDinh_HP' + strThanhPhanDiem_AD_Id + '" class="form-control"/></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThanhPhanDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThanhPhanDiemApDung_HocPhan tbody").append(row);
        me.genCombo_ThanhPhanDiem("dropHP_ThanhPhanDiem" + strThanhPhanDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strThanhPhanDiem_AD_Id, "");
        me.genCombo_QuyTacLamTron("dropHP_QuyTacLamTron" + strThanhPhanDiem_AD_Id, "");
        edu.system.pickerdate();
       
    },

    save_KeThuaThanhPhanDiemAD_ChuongTrinh: function (strChuongTrinh_Id) {
        var me = this;
        var strId = strChuongTrinh_Id;
        
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThanhPhanDiem_ApDung/KeThua',
            

            
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_ThanhPhanDiem_ApDung/KeThua';
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
	--Discription: [4]  ACESS DB ==> tham so hoc tap chung
    --Author: duyentt
	-------------------------------------------*/
    getList_ThanhPhanDiem: function () {
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
                    me.dtThanhPhanDiem = dtResult;
                }
                else {
                    edu.system.alert("D_ThanhPhanDiem/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("D_ThanhPhanDiem/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'D_ThanhPhanDiem/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strThangDiem_Id': "",
                'strQuyTacLamTron_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThanhPhanDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThanhPhanDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn thành phần điểm"
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
            me.getList_ThanhPhanDiem_HocPhan();
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
    viewEdit_ThamSoAD_ChuongTrinh: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblThamSoApDungChuongTrinh", data.TENCHUONGTRINH);
    },
}