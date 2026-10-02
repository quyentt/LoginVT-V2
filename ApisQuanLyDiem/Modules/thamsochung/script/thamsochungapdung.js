/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Note: 
--Note: 
----------------------------------------------*/
function ThamSoChungApDung() { };
ThamSoChungApDung.prototype = {
    dtChuongTrinh: [],
    strChuongTrinh_Id: '', 
    strCommon_Id: '',
    dtThoiGianDaoTao: [],
    dtThamSoHocTap: [],
    strHocPhan_Id: '',
    
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [tab_1] Hoc ham
        -------------------------------------------*/
        $("#tblChuongTrinh").delegate('.btnDetail', 'click', function (e) {
            var strId = this.id;
            
            $("#zoneEdit").slideDown();
            me.strChuongTrinh_Id = strId;
            edu.util.setOne_BgRow(strId, "tblChuongTrinh");
            me.getList_ThamSoChungApDung_ChuongTrinh();
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

        $("#dropSearch_LoaiXetNangLuong").keypress(function (e) {
            if (e.which == 13) {
                me.getList_KeHoachXetNangLuong();
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

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThamSoApDungChungCT").click(function () {
            $("#tblThamSoApDungChungChoChuongTrinh tbody tr").each(function () {
                var strThamSo_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSoChungApDung_ChuongTrinh(strThamSo_AD_Id, me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_ThamSoApDungChungCT").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSoChungApDungCT(id, "");
        });
        $("#tblThamSoApDungChungChoChuongTrinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoApDungChungChoChuongTrinh tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoApDungChungChoChuongTrinh").delegate(".deleteThamSo_ChuongTrinh", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSoChungApDung_ChuongTrinh(strId);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnSave_ThamSoApDung_HocPhan").click(function () {
            $("#tblThamSoApDung_HocPhan tbody tr").each(function () {
                var strThamSo_AD_Id = this.id.replace(/rm_row/g, '');
                me.save_ThamSo_HocPhan(strThamSo_AD_Id, me.strHocPhan_Id + me.strChuongTrinh_Id);
            });
        });
        $("#btnAdd_ThamSoApDung_HocPhan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThamSo_HocPhan_New(id, "");
        });
        $("#btnKeThua_ThamSoApDungChungCTTrongKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.save_KeThuaThamSoChungAD_ChuongTrinh(id, "");
        });
        $("#tblThamSoApDung_HocPhan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThamSoApDung_HocPhan tr[id='" + strRowId + "']").remove();
        });
        $("#tblThamSoApDung_HocPhan").delegate(".deleteThamSo_HP", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThamSo_HocPhan(strId);
            });
        });
        $("#txtSearch_HocPhan_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_hocphanchuongtrinh li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
        });
        $("#dropSearch_KhoaHoc").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.reset_ThamSoAD_ChuongTrinh();
        });

    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_ChuongTrinh();
        me.getList_ThoiGianDaoTao();
        me.getList_ThamSoChung();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
    },

    toggle_ChuongTrinh: function () {
        edu.util.toggle_overide("zone-content", "zone_TimKiem");
    },
    reset_ThamSoAD_ChuongTrinh: function () {
        var me = this;
        me.strCommon_Id = "";
        edu.util.viewValById("dropChuongTrinh_ThamSoChung", "");
        edu.util.viewValById("dropChuongTrinh_ThoiGianDaoTao", "");
        edu.util.viewValById("txtNgayApDung_CT", "");
        edu.util.viewValById("txtSoLanHocToiDa_CT", "");
        edu.util.viewValById("txtSoLanThiToiDa_CT", "");
    },
    rewrite_ThamSoAD_ChuongTrinh: function () {
        //reset id
        var me = main_doc.ThamSoChungApDung;
        //
        me.strChuongTrinh_Id = "";
        var arrId = ["dropChuongTrinh_ThamSoChung", "dropChuongTrinh_ThoiGianDaoTao", "txtNgayApDung_CT", "txtSoLanHocToiDa_CT", "txtSoLanThiToiDa_CT"];
        edu.util.resetValByArrId(arrId);
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
                strFuntionName: "main_doc.ThamSoChungApDung.getList_ChuongTrinh()",
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
                        html += '<span class="ten-chuongtrinh"><span class="color-name">' + 'Chương trình: ' + "</span>"+ edu.util.returnEmpty(aData.TENCHUONGTRINH) + "</span><br />";
                        html += '<span class="ten-khoa"><span class="color-name">' + 'Khóa: '+ "</span>" + edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN) + "</span><br />";
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
    save_ThamSoChungApDung_ChuongTrinh: function (strThamSoChungApDung_Id, strChuongTrinh_Id) {
        var me = this;
        var strId = strThamSoChungApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropChuongTrinh_ThoiGianDaoTao' + strThamSoChungApDung_Id);
        var strDiem_ThamSoHocTapChung_Id = edu.util.getValById('dropChuongTrinh_ThamSoChung' + strThamSoChungApDung_Id);
        var dSoLanHocToiDa = edu.util.getValById('txtSoLanHocToiDa_CT' + strThamSoChungApDung_Id);
        var dSoLanThiLaiToiDa = edu.util.getValById('txtSoLanThiToiDa_CT' + strThamSoChungApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_CT' + strThamSoChungApDung_Id);
        //var strTinhTrang_Id = edu.util.getValById('dropDeTai_TinhTrang' + strChuongTrinh_Id);
        //if (!edu.util.checkValue(strDiem_ThamSoHocTapChung_Id) || !edu.util.checkValue(strDaoTao_ThoiGianDaoTao_Id) || !edu.util.checkValue(strNgayApDung)) {
        //    //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
        //    return;
        //}
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoHocTapChung_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strDiem_ThamSoHocTapChung_Id': strDiem_ThamSoHocTapChung_Id,
            'strPhamViApDung_Id': strChuongTrinh_Id,
            'dSoLanHocToiDa': dSoLanHocToiDa,
            'dSoLanThiLaiToiDa': dSoLanThiLaiToiDa,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThamSoHocTapChung_ApDung/CapNhat';
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
    getList_ThamSoChungApDung_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoHocTapChung_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThamSoHocTapChung_Id': "",
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
                    me.genHTML_ThamSoChungApDung_ChuongTrinh(data.Data);
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
    getDeTail_ThamSoChungApDung_ChuongTrinh: function (strId) {
        var me = this;
        //view data --Edit
        var obj_detail = {
            'action': 'D_ThamSoHocTapChung_ApDung/LayChiTiet',
            
            'strId': strId
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_ThamSoChungApDung_ChuongTrinh(data.Data[0]);
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
    delete_ThamSoChungApDung_ChuongTrinh: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoHocTapChung_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSoChungApDung_ChuongTrinh();
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
    
    genHTML_ThamSoChungApDung_ChuongTrinh: function (data) {
        var me = this;
        //edu.util.viewHTMLById("lblThamSoApDungChuongTrinh", data[0].TENCHUONGTRINH);
        $("#tblThamSoApDungChungChoChuongTrinh tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThamSo_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThamSo_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThamSo_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropChuongTrinh_ThamSoChung' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn tham số học tập--</option ></select ></td>';
            row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_CT' + strThamSo_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtSoLanHocToiDa_CT' + strThamSo_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLANHOCTOIDA) + '"  class="form-control"/></td>';
            row += '<td><input type="text" id="txtSoLanThiToiDa_CT' + strThamSo_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLANTHILAITOIDA) + '" class="form-control"/></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThamSo_ChuongTrinh" id="' + strThamSo_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSo_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoApDungChungChoChuongTrinh tbody").append(row);
            me.genCombo_ThamSoChung("dropChuongTrinh_ThamSoChung" + strThamSo_AD_Id, data[i].DIEM_THAMSOHOCTAPCHUNG_ID);
            me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThamSo_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
        }
        edu.system.pickerdate();
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThamSoChungApDungCT(id, "");
        //}
    },
    genHTML_ThamSoChungApDungCT: function (strThamSo_AD_Id) {
        var me = this;
        //edu.util.viewHTMLById("lblThamSoApDungChuongTrinh", data.TENCHUONGTRINH);
        var iViTri = document.getElementById("tblThamSoApDungChungChoChuongTrinh").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThamSo_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThamSo_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropChuongTrinh_ThamSoChung' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn tham số học tập--</option ></select ></td>';
        row += '<td><select id="dropChuongTrinh_ThoiGianDaoTao' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_CT' + strThamSo_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><input type="text" id="txtSoLanHocToiDa_CT' + strThamSo_AD_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtSoLanThiToiDa_CT' + strThamSo_AD_Id + '" class="form-control"/></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSo_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoApDungChungChoChuongTrinh tbody").append(row);
        me.genCombo_ThamSoChung("dropChuongTrinh_ThamSoChung" + strThamSo_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropChuongTrinh_ThoiGianDaoTao" + strThamSo_AD_Id, "");
        edu.system.pickerdate();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB ThamSoChung_ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    save_ThamSo_HocPhan: function (strThamSoChungApDung_Id, strHocPhan_Id) {
        var me = this;
        var strId = strThamSoChungApDung_Id;
        var strDaoTao_ThoiGianDaoTao_Id = edu.util.getValById('dropHP_ThoiGianDaoTao' + strThamSoChungApDung_Id);
        var strDiem_ThamSoHocTapChung_Id = edu.util.getValById('dropHP_ThamSoChung' + strThamSoChungApDung_Id);
        var dSoLanHocToiDa = edu.util.getValById('txtSoLanHocToiDa_HP' + strThamSoChungApDung_Id);
        var dSoLanThiLaiToiDa = edu.util.getValById('txtSoLanThiToiDa_HP' + strThamSoChungApDung_Id);
        var strNgayApDung = edu.util.getValById('txtNgayApDung_HP' + strThamSoChungApDung_Id);
        if (!edu.util.checkValue(strDiem_ThamSoHocTapChung_Id)) {
            //edu.system.alert("Có dòng thiếu thông tin. Hãy kiểm tra và thực hiện 'Lưu'")
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoHocTapChung_ApDung/ThemMoi',
            

            'strId': strId,
            'strPhanCapApDung_Id': '',
            'strDiem_ThamSoHocTapChung_Id': strDiem_ThamSoHocTapChung_Id,
            'strPhamViApDung_Id': strHocPhan_Id,
            'dSoLanHocToiDa': dSoLanHocToiDa,
            'dSoLanThiLaiToiDa': dSoLanThiLaiToiDa,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNgayApDung': strNgayApDung,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(strId)) {
        //    obj_save.action = 'D_ThamSoHocTapChung_ApDung/CapNhat';
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
    getList_ThamSo_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_ThamSoHocTapChung_ApDung/LayDanhSach',
            

            'strTuKhoa': '',
            'strDiem_ThamSoHocTapChung_Id': "",
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
                    me.genHTML_ThamSo_HocPhan(data.Data);
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
    delete_ThamSo_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'D_ThamSoHocTapChung_ApDung/Xoa',
            
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công!");
                    me.getList_ThamSo_HocPhan();
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

    genHTML_ThamSo_HocPhan: function (data) {
        var me = this;
        $("#tblThamSoApDung_HocPhan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strThamSo_AD_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strThamSo_AD_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strThamSo_AD_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHP_ThamSoChung' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn tham số học tập--</option ></select ></td>';
            row += '<td><select id="dropHP_ThoiGianDaoTao' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn thời gian học tập--</option ></select ></td>';
            row += '<td><input type="text" id="txtNgayApDung_HP' + strThamSo_AD_Id + '" value="' + edu.util.returnEmpty(data[i].NGAYAPDUNG) + '" placeholder="dd/mm/yyyy" style="width: 100px" class="form-control input-datepicker"/></td>';
            row += '<td><input type="text" id="txtSoLanHocToiDa_HP' + strThamSo_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLANHOCTOIDA) + '"  class="form-control"/></td>';
            row += '<td><input type="text" id="txtSoLanThiToiDa_HP' + strThamSo_AD_Id + '" value="' + edu.util.returnEmpty(data[i].SOLANTHILAITOIDA) + '" class="form-control"/></td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGAYTAO_DD_MM_YYYY) + '</td>';
            //row += '<td>' + edu.util.returnEmpty(data[i].NGUOITAO_TENDAYDU) + '</td>';
            if (data[i].LADULIEUKHOITAO == '0')
            row += '<td style="text-align: center"><a title="Xóa" class="deleteThamSo_HP" id="' + strThamSo_AD_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            else
                row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSo_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
            row += '</tr>';
            $("#tblThamSoApDung_HocPhan tbody").append(row);
            me.genCombo_ThamSoChung("dropHP_ThamSoChung" + strThamSo_AD_Id, data[i].DIEM_THAMSOHOCTAPCHUNG_ID);
            me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strThamSo_AD_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
        }
        //for (var i = data.length; i < 1; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_ThamSo_HocPhan_New(id, "");
        //}

        edu.system.pickerdate();
    },
    genHTML_ThamSo_HocPhan_New: function (strThamSo_AD_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThamSoApDung_HocPhan").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strThamSo_AD_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strThamSo_AD_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHP_ThamSoChung' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn tham số học tập--</option ></select ></td>';
        row += '<td><select id="dropHP_ThoiGianDaoTao' + strThamSo_AD_Id + '" class="select-opt"><option value=""> --- Chọn học kỳ áp dụng--</option ></select ></td>';
        row += '<td><input type="text" id="txtNgayApDung_HP' + strThamSo_AD_Id + '" class="form-control input-datepicker" placeholder="dd/mm/yyyy" style="width: 100px"/></td>';
        row += '<td><input type="text" id="txtSoLanHocToiDa_HP' + strThamSo_AD_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txtSoLanThiToiDa_HP' + strThamSo_AD_Id + '" class="form-control"/></td>';
        //row += '<td></td>';
        //row += '<td></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strThamSo_AD_Id + '" href="javascript:void(0)">Xóa</a></td>';
        row += '</tr>';
        $("#tblThamSoApDung_HocPhan tbody").append(row);
        me.genCombo_ThamSoChung("dropHP_ThamSoChung" + strThamSo_AD_Id, "");
        me.genCombo_ThoiGianDaoTao("dropHP_ThoiGianDaoTao" + strThamSo_AD_Id, "");
        edu.system.pickerdate();
    },

    save_KeThuaThamSoChungAD_ChuongTrinh: function (strChuongTrinh_Id) {
        var me = this;
        var strId = strChuongTrinh_Id;
       
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'D_ThamSoHocTapChung_ApDung/KeThua',
            

            
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'D_ThamSoHocTapChung_ApDung/KeThua';
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
    getList_ThamSoChung: function () {
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
                    me.dtThamSoHocTap = dtResult;
                }
                else {
                    console.log(8);
                    edu.system.alert("D_ThamSoHocTapChung/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("D_ThamSoHocTapChung/LayDanhSach (ex): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'D_ThamSoHocTapChung/LayDanhSach',
            
            contentType: true,
            data: {
                'strTuKhoa': "",
                'strDaoTao_ThoiGianDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThamSoChung: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThamSoHocTap,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DIEM_THAMSOHOCTAPCHUNG_TEN",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn tham số"
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
            me.getList_ThamSo_HocPhan();
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