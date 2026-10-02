/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function ThamSoTinhDiemApDung() { };
ThamSoTinhDiemApDung.prototype = {
    strKhoaHoc_Id: '',
    dtKhoaHoc: [],
    strCommon_Id: '',
    dtThoiGianDaoTao: [],
    dtThamSoTinhDiem: [],
    dtQuyChe: [],
    dtQuyTacLayDiemCaoNhat: [],
    dtQuyTacLayDiemLan: [],
    dtQuyTacLayDuLieu: [],
    dtQuyTacXacDinh: [],
    dtQuyTacVeDieuKienDiem: [],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#tblKhoaDaoTao").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            //edu.util.viewHTMLById('zone_action', '<a id="btnHS_Save" class="btn btn-primary"><i class="fa fa-pencil"></i><span class="lang" key=""> Cập nhật</span></a>');
            ////
            $("#zoneEdit").slideDown();
            me.strKhoaHoc_Id = strId;
            edu.util.setOne_BgRow(strId, "tblKhoaDaoTao");
            me.getList_ThamSoTinhDiemApDung_KhoaHoc();
            me.getList_ChuongTrinh_KhoaDaoTao();
            var data = edu.util.objGetDataInData(strId, me.dtKhoaHoc, "ID");
            me.viewEdit_ThamSoAD_KhoaHoc(data[0]);
        });
        $("#btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhoaDaoTao();
            }
        });
        $("#btnSearch").click(function () {
            me.getList_KhoaDaoTao();
        });
        

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
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

        $("#btnKeThua_ThamSoTinhDiemApDungChungCTTrongKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.save_KeThuaThamSoTinhDiemAD_ChuongTrinh(id, "");
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThamSoTinhDiemApDungChungKhoaHoc").click(function () {
            $("#tblThamSoTinhDiemApDungChungChoKhoaHoc tbody tr").each(function () {
                var strThamSoTinhDiem_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSoTinhDiemApDung_KhoaHoc(strThamSoTinhDiem_AD_Id, me.strKhoaHoc_Id);
            });
        });
        $("#btnAdd_ThamSoTinhDiemApDungChungKhoaHoc").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSoTinhDiemApDungKH(id, "");
        });
        $("#tblThamSoTinhDiemApDungChungChoKhoaHoc").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoTinhDiemApDungChungChoKhoaHoc tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoTinhDiemApDungChungChoKhoaHoc").delegate(".deleteThamSoTinhDiem_KhoaHoc", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSoTinhDiemApDung_KhoaHoc(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThamSoTinhDiemApDung_ChuongTrinh").click(function () {
            $("#tblThamSoTinhDiemApDung_ChuongTrinh tbody tr").each(function () {
                var strThamSoTinhDiem_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSoTinhDiem_ChuongTrinh(strThamSoTinhDiem_AD_Id, me.strChuongTrinh_Id + me.strKhoaHoc_Id);
            });
        });
        $("#btnAdd_ThamSoTinhDiemApDung_ChuongTrinh").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSoTinhDiem_ChuongTrinh_New(id, "");
        });
        $("#tblThamSoTinhDiemApDung_ChuongTrinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoTinhDiemApDung_ChuongTrinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoTinhDiemApDung_ChuongTrinh").delegate(".deleteThamSoTinhDiem_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSoTinhDiem_ChuongTrinh(strId);
            });
        });
        $("#txtSearch_ChuongTrinh_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_chuongtrinhkhoahoc li").filter(function () {
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
        me.getList_ChuongTrinh_KhoaDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_ThamSoTinhDiem();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYCHEDIEM", "", "", me.getList_QuyChe);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACLAYDIEMCAONHAT", "", "", me.getList_QuyTacLayDiemCaoNhat);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACLAYDIEMLAN1", "", "", me.getList_QuyTacLayDiemLan1);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACLAYDULIEU", "", "", me.getList_QuyTacLayDuLieu);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACXACDINHDIEM", "", "", me.getList_QuyTacXacDinhDiem);
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.QUYTACDIEUKIENVEDIEM", "", "", me.getList_QuyTacVeDieuKienDiem);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh_KhoaDaoTao: function () {
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
                    me.genCombo_ChuongTrinh_KhoaHoc(dtResult, iPager);
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
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': me.strKhoaHoc_Id,
                'strDaoTao_HeDaoTao_Id': "",
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh_KhoaHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: ""
            },
            renderPlaces: ["zone_chuongtrinhkhoahoc"],
            style: "fa fa-cube color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //for (var i = 0; i < dtResult.length; i++) {
        //    $($("#zone_hocphanchuongtrinh #" + dtResult[i].ID + " a")[0]).append(" <span style='color: blue'>(Tổng số HP: " + dtResult[i].TONGSOHP + "; \t Tổng số TC: " + dtResult[i].TONGSOTC + "; \t Số HP bắt buộc: " + dtResult[i].SOHOCPHANQUYDINH + "; \t Số TC bắt buộc: " + dtResult[i].SOTINCHIQUYDINH + ")</span>");
        //}
        //2. Action
        $('#zone_chuongtrinhkhoahoc').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            me.strChuongTrinh_Id = strNameNode;
            me.getList_ThamSoTinhDiem_ChuongTrinh();
            $("#tab_ngoai2").show();
        });
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoTinhDiem_KhoaHoc
    --ULR:  Modules
    -------------------------------------------*/
    save_ThamSoTinhDiemApDung_KhoaHoc: function (strThamSoTinhDiemApDung_Id, strKhoaHoc_Id) {
        var me = this;
        var strId = strThamSoTinhDiemApDung_Id;
        console.log(strId);
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropKhoaHoc_ThoiGianDaoTao' + strThamSoTinhDiemApDung_Id);
        var strQuyCheApDung_Id = edu.util.getValById('dropKhoaHoc_QuyCheApDung' + strThamSoTinhDiemApDung_Id);
        var strQuyTacLayDiemCaoNhat_Id = edu.util.getValById('dropKhoaHoc_QuyTacLayDiemCaoNhat' + strThamSoTinhDiemApDung_Id);
        var strQuyTacLayDuLieuCT_Id = edu.util.getValById('dropKhoaHoc_QuyTacLayDuLieuChuongTrinh' + strThamSoTinhDiemApDung_Id);
        var strQuyTacXacDinhDiem_Id = edu.util.getValById('dropKhoaHoc_QuyTacXacDinhDiem' + strThamSoTinhDiemApDung_Id);
        var strQuyTacVeDieuKienDiem_Id = edu.util.getValById('dropKhoaHoc_QuyTacVeDieuKienDiem' + strThamSoTinhDiemApDung_Id);
        var strQuyTacLayDiemLan1_Id = edu.util.getValById('dropKhoaHoc_QuyTacLayDiemLan1' + strThamSoTinhDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_KhoaHoc' + strThamSoTinhDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        //if (!edu.util.checkValue(strQuyCheApDung_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    console.log(strQuyTacLayDuLieuCT_Id);
        //    console.log(strDaoTao_ThoiGianDaoTao_Id);
        //    console.log(strNgayApDung);
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoTongHop_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strDiem_ThamSoTongHop_id': '',
            'strPhamViApDung_Id': strKhoaHoc_Id,
            'strQuyCheApDung_Id': strQuyCheApDung_Id,
            'strQuyTacLayDiemCaoNhat_Id': strQuyTacLayDiemCaoNhat_Id,
            'strQuyTacLayDuLieuCT_Id': strQuyTacLayDuLieuCT_Id,
            'strQuyTacXacDinhDiem_Id': strQuyTacXacDinhDiem_Id,
            'strQuyTacVeDieuKienDiem_Id': strQuyTacVeDieuKienDiem_Id,
            'strQuyTacLayDiemLan1_Id': strQuyTacLayDiemLan1_Id,
            'strMoTa': '',
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThamSoTongHop_ApDung/CapNhat';
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
                    edu.system.alert(obj_save.action + ":"+data.Message);
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
    getList_ThamSoTinhDiemApDung_KhoaHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoTongHop_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThamSoTongHop_Id': "",
            'strQuyCheApDung_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhamViApDung_Id': me.strKhoaHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThamSoTinhDiemApDung_KhoaHoc(data.Data);
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
    getDeTail_ThamSoTinhDiemApDung_KhoaHoc: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThamSoTongHop_ApDung/LayChiTiet',
            
            'strId': strId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThamSoTinhDiemApDung_KhoaHoc(data.Data[0]);
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
    delete_ThamSoTinhDiemApDung_KhoaHoc: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoTongHop_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSoTinhDiemApDung_KhoaHoc();
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

    genHTML_ThamSoTinhDiemApDung_KhoaHoc: function (data) {
        var me = this;
        $("#tblThamSoTinhDiemApDungChungChoKhoaHoc tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThamSoTinhDiem_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThamSoTinhDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThamSoTinhDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropKhoaHoc_QuyCheApDung' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy chế áp dụng--</option ></select ></td>';
            row += '<td><select id="dropKhoaHoc_ThoiGianDaoTao' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_KhoaHoc' + strThamSoTinhDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><select id="dropKhoaHoc_QuyTacLayDiemCaoNhat' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy điểm cao nhất--</option ></select ></td>';
            row += '<td><select id="dropKhoaHoc_QuyTacLayDiemLan1' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy điểm lần--</option ></select ></td>';
            row += '<td><select id="dropKhoaHoc_QuyTacLayDuLieuChuongTrinh' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy dữ liệu--</option ></select ></td>';
            row += '<td><select id="dropKhoaHoc_QuyTacXacDinhDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc xác định điểm--</option ></select ></td>';
            row += '<td><select id="dropKhoaHoc_QuyTacVeDieuKienDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc về điều kiện điểm--</option ></select ></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThamSoTinhDiem_KhoaHoc" id="' + strThamSoTinhDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoTinhDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoTinhDiemApDungChungChoKhoaHoc tbody").append(row);
            me.genCombo_QuyChe("dropKhoaHoc_QuyCheApDung" + strThamSoTinhDiem_AD_Id, data[i].QUYCHEAPDUNG_ID);
            me.genCombo_ThoiGianDaoTao("dropKhoaHoc_ThoiGianDaoTao" + strThamSoTinhDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            me.genCombo_QuyTacLayDiemCaoNhat("dropKhoaHoc_QuyTacLayDiemCaoNhat" + strThamSoTinhDiem_AD_Id, data[i].QUYTACLAYDIEMCAONHAT_ID);
            me.genCombo_QuyTacLayDiemLan("dropKhoaHoc_QuyTacLayDiemLan1" + strThamSoTinhDiem_AD_Id, data[i].QUYTACLAYDIEMLAN1_ID);
            me.genCombo_QuyTacLayDuLieu("dropKhoaHoc_QuyTacLayDuLieuChuongTrinh" + strThamSoTinhDiem_AD_Id, data[i].QUYTACLAYDULIEUCT_ID);
            me.genCombo_QuyTacXacDinhDiem("dropKhoaHoc_QuyTacXacDinhDiem" + strThamSoTinhDiem_AD_Id, data[i].QUYTACXACDINHDIEM_ID);
            me.genCombo_QuyTacVeDieuKienDiem("dropKhoaHoc_QuyTacVeDieuKienDiem" + strThamSoTinhDiem_AD_Id, data[i].QUYTACVEDIEUKIENDIEM_ID);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThamSoTinhDiemApDungKH(id, "");
        //}
    },
    genHTML_ThamSoTinhDiemApDungKH: function (strThamSoTinhDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThamSoTinhDiemApDungChungChoKhoaHoc").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThamSoTinhDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThamSoTinhDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKhoaHoc_QuyCheApDung' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy chế--</option ></select ></td>';
        row += '<td><select id="dropKhoaHoc_ThoiGianDaoTao' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_KhoaHoc' + strThamSoTinhDiem_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><select id="dropKhoaHoc_QuyTacLayDiemCaoNhat' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy điểm cao nhất--</option ></select ></td>';
        row += '<td><select id="dropKhoaHoc_QuyTacLayDiemLan1' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tác lấy điểm lần 1--</option ></select ></td>';
        row += '<td><select id="dropKhoaHoc_QuyTacLayDuLieuChuongTrinh' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy dữu liệu--</option ></select ></td>';
        row += '<td><select id="dropKhoaHoc_QuyTacXacDinhDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc xác định điểm--</option ></select ></td>';
        row += '<td><select id="dropKhoaHoc_QuyTacVeDieuKienDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc về điều kiện điểm--</option ></select ></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoTinhDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoTinhDiemApDungChungChoKhoaHoc tbody").append(row);
        me.genCombo_QuyChe("dropKhoaHoc_QuyCheApDung" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropKhoaHoc_ThoiGianDaoTao" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacLayDiemCaoNhat("dropKhoaHoc_QuyTacLayDiemCaoNhat" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacLayDiemLan("dropKhoaHoc_QuyTacLayDiemLan1" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacLayDuLieu("dropKhoaHoc_QuyTacLayDuLieuChuongTrinh" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacXacDinhDiem("dropKhoaHoc_QuyTacXacDinhDiem" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacVeDieuKienDiem("dropKhoaHoc_QuyTacVeDieuKienDiem" + strThamSoTinhDiem_AD_Id, "");
        edu.system.pickerdate();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThamSoTinhDiem_ChuongTrinh: function (strThamSoTinhDiemApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strThamSoTinhDiemApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strThamSoTinhDiemApDung_Id);
        var strQuyCheApDung_Id = edu.util.getValById('dropChuongTrinh_QuyCheApDung' + strThamSoTinhDiemApDung_Id);
        var strQuyTacLayDiemCaoNhat_Id = edu.util.getValById('dropChuongTrinh_QuyTacLayDiemCaoNhat' + strThamSoTinhDiemApDung_Id);
        var strQuyTacLayDuLieuCT_Id = edu.util.getValById('dropChuongTrinh_QuyTacLayDuLieuChuongTrinh' + strThamSoTinhDiemApDung_Id);
        var strQuyTacXacDinhDiem_Id = edu.util.getValById('dropChuongTrinh_QuyTacXacDinhDiem' + strThamSoTinhDiemApDung_Id);
        var strQuyTacVeDieuKienDiem_Id = edu.util.getValById('dropChuongTrinh_QuyTacVeDieuKienDiem' + strThamSoTinhDiemApDung_Id);
        var strQuyTacLayDiemLan1_Id = edu.util.getValById('dropChuongTrinh_QuyTaclayDiemLan1' + strThamSoTinhDiemApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_ChuongTrinh' + strThamSoTinhDiemApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        if (!edu.util.checkValue(strQuyCheApDung_Id)) {
            //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoTongHop_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strDiem_ThamSoTongHop_id': '',
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strQuyCheApDung_Id': strQuyCheApDung_Id,
            'strQuyTacLayDiemCaoNhat_Id': strQuyTacLayDiemCaoNhat_Id,
            'strQuyTacLayDuLieuCT_Id': strQuyTacLayDuLieuCT_Id,
            'strQuyTacXacDinhDiem_Id': strQuyTacXacDinhDiem_Id,
            'strQuyTacVeDieuKienDiem_Id': strQuyTacVeDieuKienDiem_Id,
            'strQuyTacLayDiemLan1_Id': strQuyTacLayDiemLan1_Id,
            'strMoTa': '',
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThamSoTongHop_ApDung/CapNhat';
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
    getList_ThamSoTinhDiem_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoTongHop_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThamSoTongHop_Id': "",
            'strQuyCheApDung_Id': "",
            'strDaoTao_ThoiGianDaoTao_Id': "",
            'strPhamViApDung_Id': me.strChuongTrinh_Id + me.strKhoaHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 10000000
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genHTML_ThamSoTinhDiem_ChuongTrinh(data.Data);
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
    delete_ThamSoTinhDiem_ChuongTrinh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoTongHop_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSoTinhDiem_ChuongTrinh();
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

    genHTML_ThamSoTinhDiem_ChuongTrinh: function (data) {
        var me = this;
        $("#tblThamSoTinhDiemApDung_ChuongTrinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThamSoTinhDiem_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThamSoTinhDiem_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThamSoTinhDiem_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_QuyCheApDung' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy chế áp dụng--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_ChuongTrinh' + strThamSoTinhDiem_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><select id="dropChuongTrinh_QuyTacLayDiemCaoNhat' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy điểm cao nhất--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_QuyTaclayDiemLan1' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy điểm lần--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_QuyTacLayDuLieuChuongTrinh' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy dữ liệu--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_QuyTacXacDinhDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc xác định điểm--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_QuyTacVeDieuKienDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc về điều kiện điểm--</option ></select ></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThamSoTinhDiem_ChuongTrinh" id="' + strThamSoTinhDiem_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoTinhDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoTinhDiemApDung_ChuongTrinh tbody").append(row);
            me.genCombo_QuyChe("dropChuongTrinh_QuyCheApDung" + strThamSoTinhDiem_AD_Id, data[i].QUYCHEAPDUNG_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThamSoTinhDiem_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            me.genCombo_QuyTacLayDiemCaoNhat("dropChuongTrinh_QuyTacLayDiemCaoNhat" + strThamSoTinhDiem_AD_Id, data[i].QUYTACLAYDIEMCAONHAT_ID);
            me.genCombo_QuyTacLayDiemLan("dropChuongTrinh_QuyTaclayDiemLan1" + strThamSoTinhDiem_AD_Id, data[i].QUYTACLAYDIEMLAN1_ID);
            me.genCombo_QuyTacLayDuLieu("dropChuongTrinh_QuyTacLayDuLieuChuongTrinh" + strThamSoTinhDiem_AD_Id, data[i].QUYTACLAYDULIEUCT_ID);
            me.genCombo_QuyTacXacDinhDiem("dropChuongTrinh_QuyTacXacDinhDiem" + strThamSoTinhDiem_AD_Id, data[i].QUYTACXACDINHDIEM_ID);
            me.genCombo_QuyTacVeDieuKienDiem("dropChuongTrinh_QuyTacVeDieuKienDiem" + strThamSoTinhDiem_AD_Id, data[i].QUYTACVEDIEUKIENDIEM_ID);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThamSoTinhDiem_ChuongTrinh_New(id, "");
        //}
    },
    genHTML_ThamSoTinhDiem_ChuongTrinh_New: function (strThamSoTinhDiem_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThamSoTinhDiemApDung_ChuongTrinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThamSoTinhDiem_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThamSoTinhDiem_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_QuyCheApDung' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy chế--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_ChuongTrinh' + strThamSoTinhDiem_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><select id="dropChuongTrinh_QuyTacLayDiemCaoNhat' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy điểm cao nhất--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_QuyTaclayDiemLan1' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tác lấy điểm lần 1--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_QuyTacLayDuLieuChuongTrinh' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc lấy dữu liệu--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_QuyTacXacDinhDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc xác định điểm--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_QuyTacVeDieuKienDiem' + strThamSoTinhDiem_AD_Id + '" class="select-opt"><option value=""> --- Chọn quy tắc về điều kiện điểm--</option ></select ></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSoTinhDiem_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoTinhDiemApDung_ChuongTrinh tbody").append(row);
        me.genCombo_QuyChe("dropChuongTrinh_QuyCheApDung" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacLayDiemCaoNhat("dropChuongTrinh_QuyTacLayDiemCaoNhat" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacLayDiemLan("dropChuongTrinh_QuyTaclayDiemLan1" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacLayDuLieu("dropChuongTrinh_QuyTacLayDuLieuChuongTrinh" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacXacDinhDiem("dropChuongTrinh_QuyTacXacDinhDiem" + strThamSoTinhDiem_AD_Id, "");
        me.genCombo_QuyTacVeDieuKienDiem("dropChuongTrinh_QuyTacVeDieuKienDiem" + strThamSoTinhDiem_AD_Id, "");
        edu.system.pickerdate();
    },

    save_KeThuaThamSoTinhDiemAD_ChuongTrinh: function (strKhoaHoc_Id) {
        var me = this;
        var strId = strKhoaHoc_Id;

        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoTongHop_ApDung/KeThua',
            

            
            'strDaoTao_KhoaDaoTao_Id': me.strKhoaHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_ThamSoTongHop_ApDung/KeThua';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Kế thừa cho tất cả chương trình trong hệ đào tạo thành công")
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
    getList_ThamSoTinhDiem: function () {
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
                    me.dtThamSoTinhDiem = dtResult;
                }
                else {
                    edu.system.alert("D_ThamSoTongHop/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("D_ThamSoTongHop/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'D_ThamSoTongHop/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strDaoTao_ThoiGianDaoTao_Id': "",
                'strQuyCheApDung_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThamSoTinhDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThamSoTinhDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DIEM_THAMSOTONGHOP_TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn tham số tính điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
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
                    me.dtKhoaHoc = dtResult;
                    me.genTable_KhoaDaoTao(dtResult, iPager);
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
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
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
    genTable_KhoaDaoTao: function (data, iPager) {
        var me = this;
        $("#zoneEdit").slideUp();
        edu.util.viewHTMLById("lblKhoaDaoTao_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblKhoaDaoTao",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThamSoTinhDiemApDung.getList_KhoaDaoTao()",
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
                        html += '<span>' + 'Khóa đào tạo: ' + edu.util.returnEmpty(aData.TENKHOA) + "</span><br />";
                        html += '<span>' + 'Hệ đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_HEDAOTAO_TEN) + "</span><br />";
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> quy che
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyChe: function (data) {
        main_doc.ThamSoTinhDiemApDung.dtQuyChe = data;
    },
    genCombo_QuyChe: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyChe,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy chế"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> quy tac lay diem cao nhat
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyTacLayDiemCaoNhat: function (data) {
        main_doc.ThamSoTinhDiemApDung.dtQuyTacLayDiemCaoNhat = data;
    },
    genCombo_QuyTacLayDiemCaoNhat: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyTacLayDiemCaoNhat,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy tắc lấy điểm cao nhất"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> quy tac lay diem lan
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyTacLayDiemLan1: function (data) {
        main_doc.ThamSoTinhDiemApDung.dtQuyTacLayDiemLan = data;
    },
    genCombo_QuyTacLayDiemLan: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyTacLayDiemLan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy tắc lấy điểm lần"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> quy tac lay du lieu
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyTacLayDuLieu: function (data) {
        main_doc.ThamSoTinhDiemApDung.dtQuyTacLayDuLieu = data;
    },
    genCombo_QuyTacLayDuLieu: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyTacLayDuLieu,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy tắc lấy dữ liệu"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> quy tac xac dinh diem
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyTacXacDinhDiem: function (data) {
        main_doc.ThamSoTinhDiemApDung.dtQuyTacXacDinh = data;
    },
    genCombo_QuyTacXacDinhDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyTacXacDinh,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy tắc xác định điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> quy tac ve dieu kien diem
    --Author: duyentt
	-------------------------------------------*/
    getList_QuyTacVeDieuKienDiem: function (data) {
        main_doc.ThamSoTinhDiemApDung.dtQuyTacVeDieuKienDiem = data;
    },
    genCombo_QuyTacVeDieuKienDiem: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtQuyTacVeDieuKienDiem,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn quy tắc về điều kiện điểm"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    viewEdit_ThamSoAD_KhoaHoc: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblThamSoApDungKhoa", data.TENKHOA);
    },
}