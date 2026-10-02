/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 22/07/2018
--API URL: TC_MucDonViPhi
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function MucDonViPhi() { };
MucDonViPhi.prototype = {
    valid_MDVP: [],
    html_MDVP: {},
    input_MDVP: {},
    strChuongTrinh_Id:'',
    dtKhoaDaoTao: [],
    dtChuongTrinhDaoTao: [],
    arrChuongTrinh_Id: [],
    arrKhoaHoc_Id: [],
    dtLoaiKhoan: [],
    dtKieuHoc: [],
    dtMucDonViPhi: [],
    obj_popover:'',

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
		--Discription: [0] Action common
		-------------------------------------------*/
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-mdvp", "zone_list_mdvp");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            edu.util.toggle_overide("zone-mdvp", "zone_input_mdvp");
        });
        $("#txtKeyword_MDVP").focus();
        $("#txtKeyword_MDVP").keypress(function (e) {
            e.stopImmediatePropagation();
            if (e.which == 13) {
                e.preventDefault();
                me.getList_ChuongTrinhDaoTao();
            }
        });
        $("#txtKeyword_ChuongTrinh").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tbldata_ChuongTrinh_MDVP tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        /*------------------------------------------
		--Discription: [1] Action search MucDonViPhi
		-------------------------------------------*/
        $('#dropHeDaoTao').on('select2:select', function () {
            var strHeDaoTao_Id = edu.util.getValById("dropHeDaoTao");
            me.getList_KhoaDaoTao(strHeDaoTao_Id);
        });
        $('#dropKhoaDaoTao').on('select2:select', function () {
            var strKhoa_Id = edu.util.getValById("dropKhoaDaoTao");

            if (edu.util.checkValue(strKhoa_Id)) {
                //1. get list
                me.getList_ChuongTrinhDaoTao(strKhoa_Id);
                //2. hide box-search
                //edu.util.toggle("box-sub-search");
                //3. map path 
                var strHe       = edu.util.getTextById_Combo("dropHeDaoTao");
                var strNganh    = edu.util.getTextById_Combo("dropKhoaDaoTao");
                if (!edu.util.checkValue(edu.util.getValById("dropHeDaoTao"))) {
                    strHe = "..";
                }
                var strHe_Khoa  = strHe + "/ " + strNganh;
                var html        = '<span title="' + strHe_Khoa + '">' + edu.util.capitalFirst(strHe_Khoa) + '</span>'
                edu.util.viewHTMLById("lblHe_Khoa", html);
            }
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        /*------------------------------------------
		--Discription: [2] Action main  MucDonViPhi
		-------------------------------------------*/
        $("#btnSave_MDVP").click(function () {
            //check HocKy, SoTien, KhoanThu, TinhChat, arrChuongTrinh_Id,....
            var valid = edu.util.validInputForm(me.valid_TKKBP);
            if (valid == true) {
                if (edu.util.checkValue(me.arrChuongTrinh_Id)) {
                    me.save_MucDonViPhi();
                }
                else {
                    $("#tbldata_ChuongTrinh_Selected tbody").html('<tr><td class="td-center color-danger" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
                }
            }

        });
        $("#tbldata_MDVP").delegate(".btnEdit_MDVP", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/edit_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.openBoxEdit_MucDonViPhi(selected_id);
            }
        });
        //$("#tbldata_MDVP").delegate(".btnUpdate_MDVP", "blur", function () {
        //    var selected_id = this.id;
        //    var strIds = edu.util.cutPrefixId(/txt/g, selected_id);
        //    if (edu.util.checkValue(strIds)) {
        //        var obj = me.closeBoxEdit_MucDonViPhi(strIds);
        //        var value = edu.util.convertStrToNum(obj.value);
        //        var arrId = obj.arrId;
        //        //save
        //        me.update_MucDonViPhi(arrId, value, strIds);
        //    }
        //});
        $("#tbldata_MDVP").delegate(".btnUpdate_MDVP", "keypress", function (e) {
            if (e.which == 13) {
                var selected_id = this.id;
                var strIds = edu.util.cutPrefixId(/txt/g, selected_id);
                if (edu.util.checkValue(strIds)) {
                    var obj = me.closeBoxEdit_MucDonViPhi(strIds);
                    var value = edu.util.convertStrToNum(obj.value);
                    var arrId = obj.arrId;
                    //save
                    me.update_MucDonViPhi(arrId, value, strIds);
                }
            }
        });
        $("#tbldata_MDVP").delegate(".btnDel_MDVP", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/delete_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
                $("#btnYes").click(function (e) {
                    me.delete_MucDonViPhi(selected_id);
                });
                return false;
            }

        });
        $("#tbldata_MDVP").delegate('.btnDetail_MDVP', 'mouseenter', function () {
            var selected_id = this.id;
            me.obj_popover = this;
            var strMucDonViPhi_Id = edu.util.cutPrefixId(/detail_/g, selected_id);

            if (edu.util.checkValue(strMucDonViPhi_Id)) {
                me.getDetail_MucDonViPhi(strMucDonViPhi_Id);
            }
        });
        $('#tbldata_MDVP').on('mouseenter', '.action-mdvp', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).removeClass("hide");
        }).on('mouseleave', '.action-mdvp', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).addClass("hide");
        });
        $("#btnRewrite_MDVP").click(function () {
            me.rewrite();
        });
        $("#btnRefresh_MDVP").click(function () {
            me.getList_MucDonViPhi(me.strChuongTrinh_Id);
            
        });
        /*------------------------------------------
		--Discription: [3] action ChuongTrinh
		-------------------------------------------*/
        $("#btnCallModal_ChuongTrinh_MDVP").click(function () {
            me.popup_ChuongTrinh();
        });
        $("#tbldata_ChuongTrinh_MDVP").delegate(".btnSelect_ChuongTrinh", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/chuongtrinh_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_ChuongTrinh(selected_id);
            }
        });
        $("#tbldata_ChuongTrinh_Selected").delegate(".btnRemove_chuongtrinh", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/selected_chuongtrinh_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.remove_ChuongTrinh(selected_id);
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle_overide("zone-mdvp", "zone_list_mdvp");

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        me.getList_ChuongTrinhDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();

        me.valid_TKKBP = [
            { "MA": "dropHocKy_MDVP", "THONGTIN1": "1" },
            { "MA": "txtSoTien_MDVP", "THONGTIN1": "1" },
            { "MA": "dropKieuHoc_MDVP", "THONGTIN1": "1" },
            { "MA": "dropKhoanThu_MDVP", "THONGTIN1": "1" },
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
    },
    rewrite: function () {
        //reset id
        var me = this;
        var arrId = ["dropHocKy_MDVP", "txtSoTien_MDVP", "dropKhoanThu_MDVP", "dropKieuHoc_MDVP"];
        edu.util.resetValByArrId(arrId);
        //reset table
        me.arrChuongTrinh_Id = [];
        $("#tbldata_ChuongTrinh_MDVP td .btnClose").each(function () {
            $(this).trigger("click");
        });
        $("#tbldata_ChuongTrinh_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
    },
    popup_ChuongTrinh: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalChuongTrinh_MDVP").modal("show");
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB MucDonViPhi
	--ULR:  
	-------------------------------------------*/
    save_MucDonViPhi: function () {
        me = this;

        var strHocKy_Ids = $("#dropHocKy_MDVP").val();
        var dSoTien = edu.util.convertStrToNum($("#txtSoTien_MDVP").val());
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropKhoanThu_MDVP");
        var strKieHoc_Ids = edu.util.getValCombo("dropKieuHoc_MDVP");
        var strChuongTrinh_Ids = me.arrChuongTrinh_Id;

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Ids.toString(),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dTongSoTien': dSoTien,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'strGhiChu': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.util.toggle_overide("zone-mdvp", "zone_list_mdvp");
                    edu.system.alert("Thêm mới thành công!");
                    me.getList_MucDonViPhi(me.strChuongTrinh_Id);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    update_MucDonViPhi: function (arrId, dSoTien, $strIds) {

        var me = this;
        var obj_notify = {};
        //format arId ===> [HocKy, ChuongTrinh, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/CapNhat',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': arrId[1],
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': arrId[0],
            'dTongSoTien': dSoTien,
            'strDiem_KieuHoc_Id': arrId[3],
            'strTaiChinh_CacKhoanThu_Id': arrId[2],
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu': "",
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    me.affectUpdate_MucDonViPhi($strIds, dSoTien);
                    //notify alert)timer
                    var obj = {
                        title: "Thông báo",
                        content: "Cập nhật thành công!",
                        time: 1500,
                    }
                    edu.system.alertTimer(obj);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    delete_MucDonViPhi: function (strId) {
        var me = this;
        var obj_notify = {};
        //format arId ===> [HocKy, ChuongTrinh, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_DonViPhi_SoTien/Xoa',
            'versionAPI': 'v1.0',

            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    //remark and update new value on HTML
                    var obj = {
                        content: "Xóa thành công!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    me.getList_MucDonViPhi(me.strChuongTrinh_Id);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_MucDonViPhi: function (strChuongTrinh_Id) {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strDaoTao_ToChucChuongTrinh_Id = strChuongTrinh_Id;
        var strDaoTao_ThoiGianDaoTao_Id = "";
        var strCanBoCapNhat_Id = "";
        var strDiem_KieuHoc_Id = "";
        var strTaiChinh_CacKhoanThu_Id = "";
        var strDangKy_DotDangKyHoc_Id = "";

        var obj_list = {
            'action': 'TC_DonViPhi_SoTien/LayDanhSach',
            'versionAPI': 'v1.0',
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strPhamViApDung_Id': strDaoTao_ToChucChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNguoiThucHien_Id': strCanBoCapNhat_Id,
            'strDiem_KieuHoc_Id': strDiem_KieuHoc_Id,
            'strTaiChinh_CacKhoanThu_Id': strTaiChinh_CacKhoanThu_Id,
            'strDangKy_DotDangKyHoc_Id': strDangKy_DotDangKyHoc_Id
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
                    me.dtMucDonViPhi = dtResult;
                    me.genTable_MucDonViPhi();
                }
                else {
                    edu.system.alert("QLTC_DonViPhi_SoTien.LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("QLTC_DonViPhi_SoTien.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [1] GEN HTML MucDonViPhi
	--ULR:  
	-------------------------------------------*/
    genTable_MucDonViPhi: function () {
        var me = this;
        //1. variable
        var $table_thead = "#tbldata_MDVP thead";
        var $table_tbody = "#tbldata_MDVP tbody";
        $($table_thead).html("");
        $($table_tbody).html("");
        //2. thead
        var thead = me.genThead_MucDonViPhi(me.dtLoaiKhoan, me.dtKieuHoc, me.dtMucDonViPhi);
        $($table_thead).append(thead);
        //3. tbody
        tbody = me.genTbody_MucDonViPhi(me.dtChuongTrinhDaoTao, me.dtMucDonViPhi, me.dtLoaiKhoan, me.dtKieuHoc);
        $($table_tbody).append(tbody);
    },
    genThead_MucDonViPhi: function (dtLoaiKhoan, dtKieuHoc, dtMucDonViPhi) {
        var me = this;
        var arrLoaiKhoan = [];
        //thead
        var thead = '';
        thead += '<tr>';
        thead += '<th class="td-center td-fixed" rowspan="2">Stt</th>';
        //thead += '<th class="td-left" rowspan="2">Chương trình</th>';
        thead += '<th class="td-center" rowspan="2">Học kỳ</th>';
        arrLoaiKhoan = me.getUnique_LoaiKhoan(dtLoaiKhoan, dtMucDonViPhi);
        for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {
            thead += '<th class="td-center" colspan="' + dtKieuHoc.length + '">' + dtLoaiKhoan[lk].TEN + '</th>';
        }
        thead += '</tr>';
        thead += '<tr>';
        for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {
            for (var kh = 0; kh < dtKieuHoc.length; kh++) {
                thead += '<th class="td-center">' + dtKieuHoc[kh].TEN + '</th>';
            }
        }
        thead += '</tr>';

        return thead;
    },
    genTbody_MucDonViPhi: function (dtChuongTrinhDaoTao, dtMucDonViPhi, dtLoaiKhoan, dtKieuHoc) {
        var me = this;
        //tbody
        var tbody = '';
        var arrHocKy = [];
        var arrMucDonViPhi = [];
        var arrChuongTrinh = [];
        var arrLoaiKhoan = [];
        var objHocKy = {};
        var rowspan = 0;
        var check = false;
        var arrCheckExist = [];
        //1. loop ChuongTrinh and Data to get unique HOCKY_ID
        unique_HocKy();

        //2. 
        // processing
        function unique_HocKy() {
            for (var ct = 0; ct < dtChuongTrinhDaoTao.length; ct++) {
                //1. hocky
                for (var dt = 0; dt < dtMucDonViPhi.length; dt++) {
                    if (dtChuongTrinhDaoTao[ct].ID == dtMucDonViPhi[dt].PHAMVIAPDUNG_ID) {
                        //objHocKy
                        objHocKy = {};
                        objHocKy.ID     = dtMucDonViPhi[dt].DAOTAO_THOIGIANDAOTAO_ID;
                        objHocKy.TEN    = dtMucDonViPhi[dt].DAOTAO_THOIGIANDAOTAO_HOCKY;
                        //
                        if (!edu.util.objEqualVal(arrHocKy, "ID", objHocKy.ID)) {//if not exit
                            arrHocKy.push(objHocKy);
                        }
                        //
                        arrMucDonViPhi.push(dtMucDonViPhi[dt]);
                        arrChuongTrinh = dtChuongTrinhDaoTao[ct];
                    }
                }
                //2. loaikhoan
                arrLoaiKhoan    = me.getUnique_LoaiKhoan(dtLoaiKhoan, dtMucDonViPhi);
                //3. call process
                genTbody(arrHocKy, arrChuongTrinh, arrMucDonViPhi, arrLoaiKhoan);
                //4. reset
                arrMucDonViPhi = [];
                arrHocKy = [];
                arrChuongTrinh = [];
                arrLoaiKhoan = [];
            }
        }
        function genTbody(arrHocKy, arrChuongTrinh, arrMucDonViPhi, arrLoaiKhoan) {
            var stt = 0;
            var strChuongTrinh_Ten = "";
            var strChuongTrinh_Ma = "";
            var strHocKy_Ten = "";
            var arrId = "";
            var dSoTien = 0;
            var check = false;
            for (var hk = 0; hk < arrHocKy.length; hk++) {//1.loop HocKy
                stt = (hk + 1);
                strChuongTrinh_Ten  = edu.util.returnEmpty(arrChuongTrinh.TENCHUONGTRINH);
                strChuongTrinh_Ma   = edu.util.returnEmpty(arrChuongTrinh.MACHUONGTRINH);
                strHocKy_Ten        = edu.util.returnEmpty(arrHocKy[hk].TEN);

                //{start: generating row}
                tbody += '<tr>';
                //collage the same ChuongTrinh_Ten and ChuongTrinh_Ma
                tbody += '<td class="td-center td-fixed">' + stt + '</td>';
                tbody += '<td class="td-center">' + strHocKy_Ten + '</td>';
                //gen data SoTien for each HocKy_Id
                for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {//2.loop LoaiKhoan
                    for (var kh = 0; kh < dtKieuHoc.length; kh++) {//3.loop KieuHoc
                        check = false;
                        arrId = arrHocKy[hk].ID + "_" + arrChuongTrinh.ID + "_" + arrLoaiKhoan[lk].ID + "_" + dtKieuHoc[kh].ID;
                        var arrKieuHoc = [];
                        for (var dt = arrMucDonViPhi.length -1; dt >= 0; dt--) {//4.loop MucDonViPhi
                            if (arrHocKy[hk].ID == arrMucDonViPhi[dt].DAOTAO_THOIGIANDAOTAO_ID
                                && arrMucDonViPhi[dt].TAICHINH_CACKHOANTHU_ID == arrLoaiKhoan[lk].ID
                                && arrMucDonViPhi[dt].KIEUHOC_ID == dtKieuHoc[kh].ID) {
                                if (arrKieuHoc.indexOf(dtKieuHoc[kh].ID) != -1) continue;
                                arrKieuHoc.push(dtKieuHoc[kh].ID);
                                //has value
                                dSoTien = edu.util.formatCurrency(edu.util.returnZero(arrMucDonViPhi[dt].TONGSOTIEN));
                                //gen tr
                                tbody += genRow(arrId, dSoTien, arrMucDonViPhi[dt].ID);
                                check = true;
                            }
                        }
                        if (!check) {//no value
                            tbody += genRow(arrId, "", "");
                        }
                    }
                }
                tbody += '</tr>';
                //(end: row}
            }

        }
        function genRow(arrId, dSoTien, strMucDonViPhi_Id) {
            var tbody = '';
            tbody += '<td class="td-center action-mdvp" id="remark' + arrId + '">';
            tbody += '<span id="zoneDisplay' + arrId + '">';
            tbody += '<span id="value' + arrId + '">' + dSoTien + "</span> <br />";
            tbody += '<span class="hide" id="action' + arrId + '">';
            tbody += '<a id="edit_' + arrId + '" class="btnEdit_MDVP" title="Chỉnh sửa"><i class="fa fa-pencil"></i></a> | ';
            tbody += '<a id="delete_' + strMucDonViPhi_Id + '" class="btnDel_MDVP" title="Xóa"><i class="fa fa-times-circle"></i></a> | ';
            tbody += '<a id="detail_' + strMucDonViPhi_Id + '" class="btnDetail_MDVP" title="Chi tiết"><i class="fa fa-info-circle"></i></a>';
            tbody += '</span>';
            tbody += '</span>';
            tbody += '<span id="zoneEdit' + arrId + '"  style="display: none">';
            tbody += '<input type="text" id="txt' + arrId + '" class="form-control btnUpdate_MDVP" data-ax5formatter="money"/>';
            tbody += '</span>';
            tbody += '</td>';
            return tbody;

        }
        
        return tbody;
    },
    getUnique_LoaiKhoan: function (dtLoaiKhoan, dtMucDonViPhi) {
        var me = this;;
        var arrLoaiKhoan = [];
        var objLoaiKhoan = {};
        for (var lk = 0; lk < dtLoaiKhoan.length; lk++) {
            for (var dv = 0; dv < dtMucDonViPhi.length; dv++) {
                if (dtMucDonViPhi[dv].TAICHINH_CACKHOANTHU_ID == dtLoaiKhoan[lk].ID) {
                    //objLoaiKhoan
                    objLoaiKhoan = {};
                    objLoaiKhoan.ID = dtLoaiKhoan[lk].ID;
                    objLoaiKhoan.TEN = dtLoaiKhoan[lk].TEN;
                    //
                    if (!edu.util.objEqualVal(arrLoaiKhoan, "ID", objLoaiKhoan.ID)) {//if not exit
                        arrLoaiKhoan.push(objLoaiKhoan);
                    }
                }
            }

        }
        return arrLoaiKhoan
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML - MucDonViPhi
	--ULR:  
	-------------------------------------------*/
    openBoxEdit_MucDonViPhi: function (arrId) {
        //var arrId = edu.util.convertStrToArr(selected_id, "#");
        var $placeEdit = "#zoneEdit" + arrId;
        var $placeDisplay = "#zoneDisplay" + arrId;
        var $value = "#value" + arrId;
        var $input = "#txt" + arrId;
        var value = $($value).html();

        $($placeEdit).show(120);
        $($placeDisplay).hide(120);
        $($input).val(value);
        $($input).focus();

    },
    closeBoxEdit_MucDonViPhi: function (arrId) {
        var $placeEdit = "#zoneEdit" + arrId;
        var $placeDisplay = "#zoneDisplay" + arrId;
        var $input = "#txt" + arrId;
        $($placeEdit).hide(120);
        $($placeDisplay).show(120);
        //save
        var arrId = edu.util.convertStrToArr(arrId, "_");
        var value = $($input).val();
        var obj = {
            arrId: arrId,
            value: value
        }
        return obj;
    },
    //
    affectUpdate_MucDonViPhi: function (strIds, value) {
        var me = this;
        //1. add or update remark
        me.removeAffect_MucDonViPhi(strIds);
        var $place = "#remark" + strIds;
        $($place).addClass("bg-default");
        //2. update html new value
        var $newValue = "#value" + strIds;
        $($newValue).html(edu.util.formatCurrency(value));
    },
    affectDelete_MucDonViPhi: function (arrId) {
        //2. update html new value
        var $empty = "#value" + arrId;
        $($empty).html("");
    },
    removeAffect_MucDonViPhi: function (arrId) {
        var $place = "#removeRemark" + arrId;
        $($place).removeClass("bg-default");
    },
    //get detail MucDonViPhi
    getDetail_MucDonViPhi: function(strMucDonViPhi_Id){
        var me = this;
        var data = me.dtMucDonViPhi;
        edu.util.objGetDataInData(strMucDonViPhi_Id, me.dtMucDonViPhi, "ID", me.cbgenPopover_MucDonViPhi);
    },
    cbgenPopover_MucDonViPhi: function (data) {
        me = main_doc.MucDonViPhi;

        var strguoiTao = data[0].NGUOICUOI_TENDAYDU;
        var strNgayTao = data[0].NGAYCUOI_DD_MM_YYYY;

        var objdata = {
            obj: me.obj_popover,
            title: "Chi tiết",
            content: function () {
                var html_popover = '';
                html_popover += '<table class="table table-condensed table-hover">';
                html_popover += '<tbody>';
                html_popover += '<tr>';
                html_popover += '<td class="td-left opacity-7">Người tạo</td>';
                html_popover += '<td class="td-left">: ' + strguoiTao + '</td>';
                html_popover += '</tr>';
                html_popover += '<tr>';
                html_popover += '<td class="td-left opacity-7">Ngày tạo</td>';
                html_popover += '<td class="td-left">: ' + strNgayTao + '</td>';
                html_popover += '</tr>';
                html_popover += '</tbody>';
                html_popover += '</table>';
                return html_popover;
            },
            event: 'hover',
            place: 'bottom',
        };
        edu.system.loadToPopover_data(objdata);
    },
    /*------------------------------------------
    --Discription: [2] ACESS DB ThoiGianDaoTao/loaikhoan/kieuhoc
    --ULR:  
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = main_doc.MucDonViPhi;

        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_LoaiKhoan: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
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
                    me.dtLoaiKhoan = dtResult;
                    me.cbGenCombo_KhoanThu(dtResult);
                }
                else {
                    edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("TC_ThietLapThamSo_DanhMucLoaiKhoanThu.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KieuHoc: function () {
        var me = main_doc.MucDonViPhi;
        var obj = {
            strMaBangDanhMuc: "KHDT.DIEM.KIEUHOC",
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenCombo_KieuHoc);
    },
    /*------------------------------------------
    --Discription: [2] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.MucDonViPhi;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHocKy_MDVP"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KieuHoc: function (data) {
        var me = main_doc.MucDonViPhi;
        me.dtKieuHoc = data;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKieuHoc_MDVP"],
            type: "",
            title: "Chọn kiểu học",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoanThu: function (data) {
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
            renderPlace: ["dropKhoanThu_MDVP"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB HeDaoTao/KhoaDaoTao/ChuongTrinh
    --ULR:  
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.MucDonViPhi;
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
        var me = main_doc.MucDonViPhi;

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
    /*------------------------------------------
    --Discription: [3] GEN HTML HeDaoTao/KhoaDaoTao/ChuongTrinh
    --ULR:  
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = main_doc.MucDonViPhi;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.MucDonViPhi;
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4] ACCESS DB LoaiKhoan/KieuHoc/ChuongTrinh
	--ULR:  
	-------------------------------------------*/
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id) {
        var me = main_doc.MucDonViPhi;
        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: $("#dropKhoaDaoTao").val(),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: $("#txtKeyword_MDVP").val(),
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_ChuongTrinhDaoTao(obj_ChuongTrinhDT, "", "", me.cbGenTreeJs_ChuongTrinhDaoTao);
    },
    /*------------------------------------------
    --Discription: [4] ACTION HTML ChuongTrinh
    --ULR:  
    -------------------------------------------*/
    select_ChuongTrinh: function (id) {
        var me = this;
        var html = '';
        var obj_notify = {};
        //[1] add to arr
        if (edu.util.arrCheckExist(me.arrChuongTrinh_Id, id)) {
            obj_notify = {
                renderPlace: "chuongtrinh_id" + id,
                type: "w",
                title: "Dữ liệu đã tồn tại!",
                autoClose: true,
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "chuongtrinh_id" + id,
                type: "i",
                title: "Chọn thành công!",
                autoClose: false,
            }
            edu.system.notifyLocal(obj_notify);
            me.arrChuongTrinh_Id.push(id);
        }
        //[2] add html to table
        var $chuongtrinh_ten = "chuongtrinh_ten" + id;
        var $chuongtrinh_ma = "chuongtrinh_ma" + id;

        var strchuongtrinh_Ten = edu.util.getTextById($chuongtrinh_ten);
        var strchuongtrinh_Ma = edu.util.getTextById($chuongtrinh_ma);

        html += '<tr id="zone_chuongtrinh' + id + '">';
        html += '<td class="td-fixed td-center">-</td>';
        html += '<td class="td-left">' + strchuongtrinh_Ten + '</td>';
        html += '<td class="td-center">' + strchuongtrinh_Ma + '</td>';
        html += '<td class="td-fixed td-center"><a id="selected_chuongtrinh_id' + id + '" class="btn btnRemove_chuongtrinh" href="#">Hủy</a></td>';
        html += '</tr>';

        //[3] fill into table 
        var renderPlace = "#tbldata_ChuongTrinh_Selected tbody";
        $(renderPlace).append(html);
    },
    remove_ChuongTrinh: function (id) {
        var me = this;
        console.log("id: " + id);
        //[1] remove from arr
        edu.util.arrExcludeVal(me.arrChuongTrinh_Id, id);
        //[2] remove html from table
        var removePlace = "#zone_chuongtrinh" + id;
        $(removePlace).remove();
    },
    /*------------------------------------------
	--Discription: [4] GEN HTML ChuongTrinh
	--ULR:  
	-------------------------------------------*/
    cbGenTreeJs_ChuongTrinhDaoTao: function (data, iPager) {
        var me = main_doc.MucDonViPhi;
        //if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//attch only one time
            me.dtChuongTrinhDaoTao = data;
        //    if (!edu.util.checkValue(edu.util.getValById("dropKhoaDaoTao"))) {// the first time load
        //        return false;
        //    }
        //}
        me.cbGenCombo_ChuongTrinhDaoTao(data);
        me.genTable_ChuongTrinh(data, iPager);
        //1. Gen
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: ""
            },
            renderPlaces: ["zone_treejs_chuongtrinh"]
        };
        edu.system.loadToTreejs_data(obj);
        var strChuongTrinh_Text = "";
        //2. Action
        $('#zone_treejs_chuongtrinh').on("select_node.jstree", function (e, data) {
            //1. get val
            me.strChuongTrinh_Id = data.node.id;
            strChuongTrinh_Text = data.node.li_attr.title;
            //2. call db
            me.getList_MucDonViPhi(me.strChuongTrinh_Id);
            //3. bind
            edu.util.viewHTMLById("lblChuongTrinh", strChuongTrinh_Text);
            //4.
            edu.util.toggle_overide("zone-mdvp", "zone_list_mdvp");

            //------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //-------------------------------------------------------------------------------------------------
        });
    },
    genTable_ChuongTrinh: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_ChuongTrinh_MDVP",
            aaData: data,
            arrClassName: [],
            bHiddenHeader: true,
            "sort": true,
            colPos: {
                left: [1],
                fix: [0],
                center: [2]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTen = aData.TENCHUONGTRINH;
                        var html = '<span id="chuongtrinh_ten' + aData.ID + '">' + strTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMa = aData.MACHUONGTRINH;
                        var html = '<span id="chuongtrinh_ma' + aData.ID + '">' + strMa + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a id="chuongtrinh_id' + aData.ID + '" class="btn btnSelect_ChuongTrinh"><i class="fa fa-check"> Chọn</i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        $('#zoneTable_ChuongTrinh').slimScroll({
            position: 'right',
            height: "400px",
            railVisible: true,
            alwaysVisible: false
        });
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.MucDonViPhi;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
}