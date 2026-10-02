/*----------------------------------------------
--Author: httung
--Phone: 
--Date of created: 14/09/2017
--Input: 
--Output:
--API URL: TaiChinh/TC_ThietLapThamSo_DanhMucLoaiKhoanThu
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function ApDungCongThuc() { };
ApDungCongThuc.prototype = {
    dtCot: [],
    dtApDungCongThuc: [],
    strApDungCongThuc_Id: '',
    dtChuongTrinhDaoTao: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();

        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao("");
        me.getList_ChuongTrinhDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_CauTruc_TuKhoa();
        /*------------------------------------------
        --Discription: Initial page KhoanThu
        -------------------------------------------*/

        edu.system.loadToCombo_DanhMucDuLieu("KTX.KHOADAOTAO", "", "", me.getList_ChuongTrinhDaoTao);
        $("#btnSearchTuKhoa").click(function () {
            if (document.getElementById("zoneTuKhoaContent").style.display == "none") {
                document.getElementById("zoneMainContent").classList.add("col-lg-8");
                document.getElementById("zoneTuKhoaContent").style.display = "";
            } else {
                document.getElementById("zoneMainContent").classList.remove("col-lg-8");
                document.getElementById("zoneTuKhoaContent").style.display = "none";
            }
        });
        $("#btnSearch").click(function () {
            me.getList_ThoiGian_ApDungCongThuc();
        });
        $('#dropHeDaoTao_ADCT').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_ADCT");
            if (strHeHaoTao_Id) {
                me.getList_KhoaDaoTao(strHeHaoTao_Id);
            }
            else {
                me.cbGenCombo_KhoaDaoTao(me.dtKhoaDaoTao);
                me.cbGenCombo_ChuongTrinhDaoTao(me.dtChuongTrinhDaoTao);
            }
        });
        $('#dropKhoaDaoTao_ADCT').on('select2:select', function () {
            me.getList_ThoiGian_ApDungCongThuc();
        });
        /*------------------------------------------
        --Discription: Combobox KhoanThu
        -------------------------------------------*/
        $("#btnUpdate").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu toàn bộ hệ số không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblApDungCongThuc";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
                var arrSave = [];
                for (var i = 0; i < arrElement.length; i++) {
                    var temp = $(arrElement[i]).attr("title");
                    if (temp == undefined) temp = "";
                    if (arrElement[i].value != temp) {
                        arrSave.push(arrElement[i]);
                    }
                }
                if (arrSave.length == 0) {
                    $("#myModalAlert #alert_content").html("Chưa có hế số mới nào cần lưu");
                    return;
                }
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_ApDungCongThuc(arrSave[i]);
                }
            });
        });
        $("#btnCapNhatAll").click(function () {
            var strTable_Id = "tblApDungCongThuc";
            var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
            var arrSave = [];
            for (var i = 0; i < arrElement.length; i++) {
                var temp = $(arrElement[i]).attr("title");
                if (temp == undefined) temp = "";
                if (arrElement[i].value != temp) {
                    arrSave.push(arrElement[i]);
                }
            }
            if (arrSave.length == 0) {
                $("#myModalAlert #alert_content").html("Chưa có hế số mới nào cần lưu");
                return;
            }
            $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
            edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
            for (var i = 0; i < arrSave.length; i++) {
                me.save_ApDungCongThuc(arrSave[i]);
            }
        });
        $("#btnSave").click(function () {
            me.save_ApDungCongThuc_One();
        });
        $("#btnDelete").click(function () {
            me.delete_ApDungCongThuc(me.strApDungCongThuc_Id);
        });
        $("#btnAddNew").click(function () {
            //var strKhoaDaoTao_Id = edu.util.getValById("dropKhoaDaoTao_ADCT");
            //if (strKhoaDaoTao_Id == "") {
            //    edu.system.alert("Hãy chọn Khóa đào tạo trước!", "w");
            //    return;
            //}
            me.resetPopup();
            me.popup();
        });
        $("#tblApDungCongThuc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strApDungCongThuc_Id = strId;
            var data = edu.util.objGetDataInData(strId, me.dtApDungCongThuc, "ID");
            me.viewForm_ApDungCongThuc(data[0]);
        });
        edu.system.loadToCombo_DanhMucDuLieu("KTX.NVAP", "dropNghiepVu_ADCT,dropNew_NghiepVu", "Chọn nghiệp vụ áp dụng");
    },
    /*------------------------------------------
    --Discription: Hàm chung KhoanThu
    -------------------------------------------*/
    popup: function () {
        $("#btnNotifyModal").remove();
        $("#myModal").modal("show");
    },
    resetPopup: function () {
        var me = this;
        edu.util.viewValById("dropNew_ChuongTrinh", "");
        edu.util.viewValById("dropNew_LoaiKhoan", "");
        edu.util.viewValById("dropNew_ThoiGian", "");
        edu.util.viewValById("dropNew_NghiepVu", "");
        edu.util.viewValById("txtNew_NgayApDung", "");
        edu.util.viewValById("txtNew_XauCongThuc", "");
        me.strApDungCongThuc_Id = "";
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    save_ApDungCongThuc_One: function () {
        me = this;

        //reset
        var me = this;
        var obj_save = {
            'action': 'KTX_CongThucTinhPhi/ThemMoi',
            

            'strId': me.strApDungCongThuc_Id,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNew_NghiepVu'),
            'strDonViTinh_Id': edu.util.getValById('dropNew_DonViTinh'),
            'strPhamViApDung_Id': edu.util.getValById('dropNew_ChuongTrinh'),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': edu.util.getValById('txtNew_NgayApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropNew_ThoiGian'),
            'strXauCongThuc': edu.util.getValById('txtNew_XauCongThuc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropNew_LoaiKhoan'),
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu': "",
        };
        if (me.strApDungCongThuc_Id != "" && me.strApDungCongThuc_Id != undefined) {
            obj_save.action = "KTX_CongThucTinhPhi/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (me.strApDungCongThuc_Id == "") {
                        objNotify = {
                            content: "Thêm mới thành công",
                            type: "s"
                        }
                        edu.system.alertOnModal(objNotify);
                    } else {
                        objNotify = {
                            content: "Cập nhật thành công",
                            type: "w"
                        }
                        edu.system.alertOnModal(objNotify);
                    }

                    me.getList_ThoiGian_ApDungCongThuc();
                }
                else {
                    objNotify = {
                        content: "KTX_CongThucTinhPhi.ThemMoi: " + data.Message,
                        type: "w"
                    }
                    edu.system.alertOnModal();
                }
            },
            error: function (er) {
                edu.system.alert("KTX_CongThucTinhPhi.ThemMoi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    save_ApDungCongThuc: function (point) {
        me = this;

        var strHocKy_Ids = point.id.substring(38);
        var dHeSo = $(point).val();
        var strHocPhan_Ids = point.id.substring(5, 37);
        var strId = $(point).attr("name");

        //reset
        var me = this;
        var obj_save = {
            'action': 'KTX_CongThucTinhPhi/ThemMoi',
            

            'strId': strId,
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_ADCT'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_ADCT'),
            'strPhamViApDung_Id': strHocPhan_Ids,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'strXauCongThuc': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_ADCT'),
            'dKeThua': edu.util.getValById('dropNew_KeThua_All'),
            'strGhiChu': "",
        };
        if (strId != "" && strId != undefined) {
            obj_save.action = "KTX_CongThucTinhPhi/CapNhat";
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.getList_ApDungCongThuc();
                }
                else {
                    edu.system.alert("KTX_CongThucTinhPhi.ThemMoi: " + data.Message);
                }
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            error: function (er) {
                edu.system.alert("KTX_CongThucTinhPhi.ThemMoi (er): " + JSON.stringify(er));
                edu.system.start_Progress("alertprogessbar", me.endLuuHeSo);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    endLuuHeSo: function () {
        var me = main_doc.ApDungCongThuc;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.getList_ThoiGian_ApDungCongThuc();
    },
    delete_ApDungCongThuc: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'KTX_CongThucTinhPhi/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    var obj = {
                        content: "Xóa thành công!",
                        code: "",
                    }
                    edu.system.alertOnModal(obj);
                    me.getList_ThoiGian_ApDungCongThuc();
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("Lỗi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThoiGian_ApDungCongThuc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KTX_CongThucTinhPhi/LayDSThoiGian_CongThucTinhPhi',

            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_ADCT'),
            'strHeDaoTao_Id': edu.util.getValById('dropHeDaoTao_ADCT'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_ADCT'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh_ADCT'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu_ADCT'),
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_ADCT'),
            'strNguoiThucHien_Id': "",
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtCot = data.Data;
                    me.genTable_ChuongTrinhDaoTao();
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ApDungCongThuc: function () {
        var me = this;

        var obj_list = {
            'action': 'KTX_CongThucTinhPhi/LayDanhSach',
            

            'strTuKhoa': "",
            'strPhamViApDung_Id': "",
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strNghiepVuApDung_Id': edu.util.getValById('dropNghiepVu_ADCT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao_ADCT'),
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.dtApDungCongThuc = dtResult;
                    me.genTable_ApDungCongThuc(dtResult);
                }
                else {
                    edu.system.alert("KTX_CongThucTinhPhi.LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("KTX_CongThucTinhPhi.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: Generating html on interface KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    genTable_ApDungCongThuc: function (data) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var point = $("#input" + data[i].PHAMVIAPDUNG_ID + "_" + data[i].DAOTAO_THOIGIANDAOTAO_ID);
            point.val(data[i].XAUCONGTHUC);
            point.attr("title", data[i].XAUCONGTHUC);
            var html = '';
            html += '<span id="' + data[i].ID + '" title="Sửa" class="btnEdit input-group-addon poiter">';
            html += '<i class="fa fa-edit"></i>';
            html += '</span>';
            point.parent().append(html);
            point.parent().attr("class", "input-group");
            point.attr("name", data[i].ID);
        }
    },
    viewForm_ApDungCongThuc: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropNew_ChuongTrinh", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNew_LoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropNew_ThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropNew_DonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropNew_NghiepVu", data.NGHIEPVUAPDUNG_ID);
        edu.util.viewValById("txtNew_NgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtNew_XauCongThuc", data.XAUCONGTHUC);
    },
    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.ApDungCongThuc;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = main_doc.ApDungCongThuc;
        var obj_KhoaDT = {
            strHeDaoTao_Id: strHeDaoTao_Id,
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//call only one time
            edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
        }
        else {
            edu.util.objGetDataInData(strHeDaoTao_Id, me.dtKhoaDaoTao, "DAOTAO_HEDAOTAO_ID", me.cbGenCombo_KhoaDaoTao);
        }
    },
    getList_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.ApDungCongThuc;
        me.dtChuongTrinhDaoTao = data;
        me.genTable_ChuongTrinhDaoTao();
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao_ADCT"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.ApDungCongThuc;
        if (!edu.util.checkValue(me.dtKhoaDaoTao)) {//attch only one time
            me.dtKhoaDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoaDaoTao_ADCT"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    genTable_ChuongTrinhDaoTao: function () {
        var me = main_doc.ApDungCongThuc;
        var jsonForm = {
            strTable_Id: "tblApDungCongThuc",
            aaData: me.dtChuongTrinhDaoTao,
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }
            ]
        };

        var rowth = "";
        rowth += '<th class="td-fixed td-center">Stt</th>';
        rowth += '<th class="td-center">Khóa học</th >';
        for (var i = 0; i < me.dtCot.length; i++) {
            rowth += '<th class="td-center">' + me.dtCot[i].THOIGIAN + '</th>';
        }
        $("#tblApDungCongThuc thead tr").html(rowth);
        edu.system.arrId = [];
        for (var i = 0; i < me.dtCot.length; i++) {
            edu.system.arrId.push(me.dtCot[i].ID);
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var html = '';
                    html += '<div>';
                    html += '<input type="text"  id="input' + aData.ID + '_' + edu.system.arrId[edu.system.icolumn++] + '" class="form-control" />';
                    html += '</div>';
                    return html;
                }
            });
        }
        edu.system.loadToTable_data(jsonForm);
        //for (var i = 0; i < me.dtHeSoLuong.length; i++) {
        //    var point = $("#div" + me.dtHeSoLuong[i].NGACH_ID + "_" + me.dtHeSoLuong[i].BAC).html('<input id="input' + me.dtHeSoLuong[i].NGACH_ID + "_" + me.dtHeSoLuong[i].NGACH_ID + '" value="' + me.dtHeSoLuong[i].HESOLUONG + '" title="' + me.dtHeSoLuong[i].HESOLUONG + '" name="' + me.dtHeSoLuong[i].ID + '" style="width: 100%"/>');
        //}
        //me.move_ThroughInTable("tblQuyDinhHeSoLuong");
        me.getList_ApDungCongThuc();
        me.cbGenCombo_ChuongTrinhDaoTao();
    },
    cbGenCombo_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            data: me.dtChuongTrinhDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropNew_ChuongTrinh", "dropKhoaDaoTao_ADCT"],
            type: "",
            title: "Chọn khóa học",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);
    },
    getList_LoaiKhoan: function () {
        var me = this;
        var strTuKhoa = "1";
        var strNhomCacKhoanThu_Id = "";
        var pageIndex = 1;
        var pageSize = 100;
        var strNguoiTao_Id = "";
        var strCanBoQuanLy_Id = "";

        var obj_list = {
            'action': 'TC_ThietLapThamSo_DanhMucLoaiKhoanThu/LayDanhSach',
            
            'strTuKhoa': strTuKhoa,
            'strNhomCacKhoanThu_Id': strNhomCacKhoanThu_Id,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strNguoiTao_Id': strNguoiTao_Id,
            'strCanBoQuanLy_Id': strCanBoQuanLy_Id
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.genComBo_KhoanThu(dtResult);
                    me.dtKhoanThu = dtResult;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KieuHoc: function (resolve, reject) {
        var me = this;
        var strMaBangDanhMuc = "KHDT.DIEM.KIEUHOC";

        var obj_list = {
            'action': 'CM_HeThong/getList_DanhMucDuLieu',
            
            'strMaBangDanhMuc': strMaBangDanhMuc
        }

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.genComBo_KieuHoc(data.Data);
                    me.dtKieuHoc = data.Data;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] ACESS DB HocPhan
    --ULR:  
    -------------------------------------------*/
    //getList_HocPhan: function (strChuongTrinh_Id) {
    //    var me = this;
    //    var obj = {
    //        strChuongTrinh_Id: strChuongTrinh_Id,
    //        strNguoiThucHien_Id: "",
    //        strTuKhoa: $("#txtKeyword_ADCT").val(),
    //        pageIndex: 1,
    //        pageSize: 200,
    //    };
    //    edu.system.getList_HocPhan(obj, "", "", me.cbGenTreejs_HocPhan);
    //},
    //getList_HocPhan_OnModal: function (strChuongTrinh_Id) {
    //    var me = this;
    //    var obj = {
    //        strChuongTrinh_Id: strChuongTrinh_Id,
    //        strNguoiThucHien_Id: "",
    //        strTuKhoa: "",
    //        pageIndex: 1,
    //        pageSize: 200,
    //    };
    //    edu.system.getList_HocPhan(obj, "", "", me.cbGenTable_HocPhan);
    //},
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    genComBo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                mRender: function (row, aData) {
                    return aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN;
                }
            },
            renderPlace: ["dropNew_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropNew_ThoiGian", "dropThoiGianDaoTao_ADCT"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KieuHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKieuHoc_ADCT", "dropNew_KieuHoc"],
            type: "",
            title: "Chọn kiểu học",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KhoanThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoanThu_ADCT", "dropNew_LoaiKhoan"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_CauTruc_TuKhoa: function () {
        var me = this;
        var obj_list = {
            'action': 'KTX_TuKhoa/LayDanhSach',
            
            'strTuKhoa': "",
            'strNguoiTao_Id': '',
            'pageSize': 100000,
            'pageIndex': 2,
        }
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    else {
                        dtResult = [];
                    }
                    me.genTable_CauTruc_TuKhoa(dtResult);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CauTruc_TuKhoa: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTuKhoaThanhPhan",
            aaData: data,
            colPos: {
                center: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "MOTA"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
};