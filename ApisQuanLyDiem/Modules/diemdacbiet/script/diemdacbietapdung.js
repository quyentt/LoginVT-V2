/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function DiemDacBietApDung() { };
DiemDacBietApDung.prototype = {
    strChuongTrinh_Id: '',
    dtChuongTrinh: [],
    strCommon_Id: '',
    dtThoiGianDaoTao: [],
    dtDiemDacBiet: [],
    dtLoaiDiem: [],
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
            me.getList_DiemDacBietApDung_ChuongTrinh();
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
        $("#btnKeThua_DiemDacBietApDungChungCTTrongKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            edu.system.confirm("Bạn có chắc chắn kế thừa");
            $("#btnYes").click(function (e) {
                me.save_KeThuaDiemDacBietAD_ChuongTrinh(id, "");
            });
            
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_DiemDacBietApDungChungCT").click(function () {
            $("#tblDiemDacBietApDungChungChoChuongTrinh tbody tr").each(function () {
                var strDiemDacBiet_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_DiemDacBietChungApDung_ChuongTrinh(strDiemDacBiet_AD_Id, me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_DiemDacBietApDungChungCT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DiemDacBietApDungCT(id, "");
        });
        $("#tblDiemDacBietApDungChungChoChuongTrinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDiemDacBietApDungChungChoChuongTrinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblDiemDacBietApDungChungChoChuongTrinh").delegate(".deleteDiemDacBiet_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DiemDacBietApDung_ChuongTrinh(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_DiemDacBietApDung_HocPhan").click(function () {
            $("#tblDiemDacBietApDung_HocPhan tbody tr").each(function () {
                var strDiemDacBiet_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_DiemDacBiet_HocPhan(strDiemDacBiet_AD_Id, me.strHocPhan_Id + me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_DiemDacBietApDung_HocPhan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DiemDacBiet_HocPhan_New(id, "");
        });
        $("#tblDiemDacBietApDung_HocPhan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDiemDacBietApDung_HocPhan tr[id='" + strRowId + "']").remove();
        });
        $("#tblDiemDacBietApDung_HocPhan").delegate(".deleteDiemDacBiet_HP", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DiemDacBiet_HocPhan(strId);
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
        me.getList_DiemDacBiet();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDIEMDACBIET", "dropChuongTrinh_LoaiDiem, dropHP_LoaiDiem");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDIEMDACBIET", "", "", me.getList_LoaiDiem);
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
                strFuntionName: "main_doc.DiemDacBietApDung.getList_ChuongTrinh()",
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
    --Discription: [2] AccessDB DiemDacBietChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_DiemDacBietChungApDung_ChuongTrinh: function (strDiemDacBietApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strDiemDacBietApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strDiemDacBietApDung_Id);
        var dGiaTriXuLy = edu.util.getValById('txtGiaTriXuLy_CT' + strDiemDacBietApDung_Id);
        var strLoaiDiem_Id = edu.util.getValById('dropChuongTrinh_LoaiDiem' + strDiemDacBietApDung_Id);
        var strDiem_DiemDacBiet_Id = edu.util.getValById('dropChuongTrinh_DiemDacBiet' + strDiemDacBietApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_CT' + strDiemDacBietApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        //if (!edu.util.checkValue(strDiem_DiemDacBiet_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_DiemDacBiet_ApDung/ThemMoi',
            

            'strId': strId,
            'strMa': '',
            'strTen': '',
            'strPhanCapApDung_Id': '',
            'strDiem_DiemDacBiet_Id': strDiem_DiemDacBiet_Id,
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'dGiaTriXuLy': dGiaTriXuLy,
            'strLoaiDiem_Id': strLoaiDiem_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'iThuTu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_DiemDacBiet_ApDung/CapNhat';
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
    getList_DiemDacBietApDung_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_DiemDacBiet_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strLoaiDiem_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strChuongTrinh_Id,
            'strDiem_DiemDacBiet_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_DiemDacBietApDung_ChuongTrinh(data.Data);
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
    getDeTail_DiemDacBietApDung_ChuongTrinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_DiemDacBiet_ApDung/LayChiTiet',
            
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_DiemDacBietApDung_ChuongTrinh(data.Data[0]);
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
    delete_DiemDacBietApDung_ChuongTrinh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_DiemDacBiet_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_DiemDacBietApDung_ChuongTrinh();
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

    genHTML_DiemDacBietApDung_ChuongTrinh: function (data) {
        var me = this;
        $("#tblDiemDacBietApDungChungChoChuongTrinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strDiemDacBiet_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strDiemDacBiet_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strDiemDacBiet_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_DiemDacBiet' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn điểm đặc biệt--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_CT' + strDiemDacBiet_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtGiaTriXuLy_CT' + strDiemDacBiet_AD_Id + '" value="' + edu.util.returnEmpty(data[i].GIATRIXULY) + '"  class="form-control"/></td>';
            row += '<td><select id="dropChuongTrinh_LoaiDiem' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn loại điểm--</option ></select ></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteDiemDacBiet_ChuongTrinh" id="' + strDiemDacBiet_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strDiemDacBiet_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblDiemDacBietApDungChungChoChuongTrinh tbody").append(row);
            me.genCombo_DiemDacBiet("dropChuongTrinh_DiemDacBiet" + strDiemDacBiet_AD_Id, data[i].DIEM_DIEMDACBIET_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strDiemDacBiet_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            me.genCombo_LoaiDiem("dropChuongTrinh_LoaiDiem" + strDiemDacBiet_AD_Id, data[i].LOAIDIEM_ID);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_DiemDacBietApDungCT(id, "");
        //}
    },
    genHTML_DiemDacBietApDungCT: function (strDiemDacBiet_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblDiemDacBietApDungChungChoChuongTrinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strDiemDacBiet_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strDiemDacBiet_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_DiemDacBiet' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn điểm đặc biệt--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_CT' + strDiemDacBiet_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><input type="text" id="txtGiaTriXuLy_CT' + strDiemDacBiet_AD_Id + '"  class="form-control"/></td>';
        row += '<td><select id="dropChuongTrinh_LoaiDiem' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn loại điểm--</option ></select ></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strDiemDacBiet_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblDiemDacBietApDungChungChoChuongTrinh tbody").append(row);
        me.genCombo_DiemDacBiet("dropChuongTrinh_DiemDacBiet" + strDiemDacBiet_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strDiemDacBiet_AD_Id, "");
        me.genCombo_LoaiDiem("dropChuongTrinh_LoaiDiem" + strDiemDacBiet_AD_Id, "");
        edu.system.pickerdate();
    },

    save_KeThuaDiemDacBietAD_ChuongTrinh: function (strChuongTrinh_Id) {
        var me = this;
        var strId = strChuongTrinh_Id;
      
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_DiemDacBiet_ApDung/KeThua',
            

            
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_DiemDacBiet_ApDung/KeThua';
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
    --Discription: [2] AccessDB DiemDacBietChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_DiemDacBiet_HocPhan: function (strDiemDacBietApDung_Id, strHocPhan_Id) {
        var me = this;
        var strId = strDiemDacBietApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropHP_ThoiGianDaoTao' + strDiemDacBietApDung_Id);
        var dGiaTriXuLy = edu.util.getValById('txtGiaTriXuLy_HP' + strDiemDacBietApDung_Id);
        var strLoaiDiem_Id = edu.util.getValById('dropHP_LoaiDiem' + strDiemDacBietApDung_Id);
        var strDiem_DiemDacBiet_Id = edu.util.getValById('dropHP_DiemDacBiet' + strDiemDacBietApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_HP' + strDiemDacBietApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        if (!edu.util.checkValue(strDiem_DiemDacBiet_Id)) {
            //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
            return;
        }
        //Kiểm tra dữ liệu để thêm mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_DiemDacBiet_ApDung/ThemMoi',
            

            'strId': strId,
            'strMa': '',
            'strTen': '',
            'strPhanCapApDung_Id': '',
            'strDiem_DiemDacBiet_Id': strDiem_DiemDacBiet_Id,
            'strPhamViApDung_Id': strHocPhan_Id,
            'dGiaTriXuLy': dGiaTriXuLy,
            'strLoaiDiem_Id': strLoaiDiem_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'iThuTu': '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_DiemDacBiet_ApDung/CapNhat';
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
    getList_DiemDacBiet_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_DiemDacBiet_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strLoaiDiem_Id': "",
            'strPhanCapApDung_Id': "",
            'strPhamViApDung_Id': me.strHocPhan_Id + me.strChuongTrinh_Id,
            'strDiem_DiemDacBiet_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_DiemDacBiet_HocPhan(data.Data);
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
    delete_DiemDacBiet_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_DiemDacBiet_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_DiemDacBiet_HocPhan();
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

    genHTML_DiemDacBiet_HocPhan: function (data) {
        var me = this;
        $("#tblDiemDacBietApDung_HocPhan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strDiemDacBiet_AP_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strDiemDacBiet_AP_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strDiemDacBiet_AP_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHP_DiemDacBiet' + strDiemDacBiet_AP_Id + '" class="select-opt"><option value=""> --- Chọn điểm đặc biệt--</option ></select ></td>';
            row += '<td><select id="dropHP_ThoiGianDaoTao' + strDiemDacBiet_AP_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_HP' + strDiemDacBiet_AP_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtGiaTriXuLy_HP' + strDiemDacBiet_AP_Id + '" value="' + edu.util.returnEmpty(data[i].GIATRIXULY) + '"  class="form-control"/></td>';
            row += '<td><select id="dropHP_LoaiDiem' + strDiemDacBiet_AP_Id + '" class="select-opt"><option value=""> --- Chọn loại điểm--</option ></select ></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteDiemDacBiet_HP" id="' + strDiemDacBiet_AP_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strDiemDacBiet_AP_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblDiemDacBietApDung_HocPhan tbody").append(row);
            me.genCombo_DiemDacBiet("dropHP_DiemDacBiet" + strDiemDacBiet_AP_Id, data[i].DIEM_DIEMDACBIET_ID);
            me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strDiemDacBiet_AP_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            me.genCombo_LoaiDiem("dropHP_LoaiDiem" + strDiemDacBiet_AP_Id, data[i].LOAIDIEM_ID);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_DiemDacBiet_HocPhan_New(id, "");
        //}
    },
    genHTML_DiemDacBiet_HocPhan_New: function (strDiemDacBiet_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblDiemDacBietApDung_HocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strDiemDacBiet_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strDiemDacBiet_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHP_DiemDacBiet' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn điểm đặc biệt--</option ></select ></td>';
        row += '<td><select id="dropHP_ThoiGianDaoTao' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_HP' + strDiemDacBiet_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><input type="text" id="txtGiaTriXuLy_HP' + strDiemDacBiet_AD_Id + '"  class="form-control"/></td>';
        row += '<td><select id="dropHP_LoaiDiem' + strDiemDacBiet_AD_Id + '" class="select-opt"><option value=""> --- Chọn loại điểm--</option ></select ></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strDiemDacBiet_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblDiemDacBietApDung_HocPhan tbody").append(row);
        me.genCombo_DiemDacBiet("dropHP_DiemDacBiet" + strDiemDacBiet_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strDiemDacBiet_AD_Id, "");
        me.genCombo_LoaiDiem("dropHP_LoaiDiem" + strDiemDacBiet_AD_Id, "");
        edu.system.pickerdate();
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
    getList_DiemDacBiet: function () {
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
                    me.dtDiemDacBiet = dtResult;
                }
                else {
                    edu.system.alert("D_DiemDacBiet/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("D_DiemDacBiet/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'D_DiemDacBiet/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strLoaiDiem_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DiemDacBiet: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtDiemDacBiet,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn điểm đặc biệt"
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
            me.getList_DiemDacBiet_HocPhan();
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
    getList_LoaiDiem: function (data) {
        main_doc.DiemDacBietApDung.dtLoaiDiem = data;
    },
    genCombo_LoaiDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn loại điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    viewEdit_ThamSoAD_ChuongTrinh: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblThamSoApDungChuongTrinh", data.TENCHUONGTRINH);
    },
}