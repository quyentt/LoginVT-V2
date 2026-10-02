/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 30/08/2018
--API URL: TC_HeSoHocPhan
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HeSoHocPhan() { };
HeSoHocPhan.prototype = {
    valid_HSHP: [],
    html_HSHP: {},
    input_HSHP: {},
    strHocPhan_Id: '',
    arrHocPhan_Id: [],
    arrKhoaHoc_Id: [],
    dtKhoanThu: [],
    dtKieuHoc: [],
    dtHocPhan: [],
    dtHeSoHocPhan: [],
    dtKhoaDaoTao: [],
    dtChuongTrinhDaoTao: [],

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: [0] Initial system
		-------------------------------------------*/
        
        /*------------------------------------------
        --Discription: [0] Initial local 
        -------------------------------------------*/
        me.page_load();
        
        /*------------------------------------------
        --Discription: [0] Action common
        -------------------------------------------*/
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-hsph", "zone_list_hshp");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            edu.util.toggle_overide("zone-hsph", "zone_input_hshp");
        });
        $("#txtKeyword_HSHP").focus();
        $("#txtKeyword_HSHP").keypress(function (e) {
            e.stopImmediatePropagation();
            if (e.which == 13) {
                e.preventDefault();
                me.getList_HocPhan();
            }
        });
        /*------------------------------------------
		--Discription: [1] Action TimKiem HeSoHocPhan
		-------------------------------------------*/
        $('#dropHeDaoTao_HSHP').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_HSHP");
            me.getList_KhoaDaoTao(strHeHaoTao_Id);
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_HSHP').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_HSHP");
            me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
        });
        $('#dropChuongTrinhDaoTao_HSHP').on('select2:select', function () {
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSHP");
            if (strChuongTrinh_Id) {
                edu.system.beginLoading();
                //1. call db
                me.getList_HocPhan(strChuongTrinh_Id);
                //2.hide box-search
                //edu.util.toggle("box-sub-search");
                //3. gen path selected
                me.genPathSelect();
                //4. trigger ----> dropChuongTrinhDaoTao_Form_HSHP on modal
                $("#dropChuongTrinhDaoTao_Form_HSHP").val(strChuongTrinh_Id).trigger("change");
                //5. call HocPhan
                me.getList_HocPhan_OnModal(strChuongTrinh_Id);
                edu.system.endLoading();
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $("#btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnRefresh_HSHP").click(function () {
            if (edu.util.checkValue(me.strHocPhan_Id)) {
                me.getList_HeSoHocPhan();
            }
            else {
                edu.system.alert("Vui lòng chọn Học phần để thao tác!", "w");
            }
        });
        $('#dropChuongTrinhDaoTao_Form_HSHP').on('select2:select', function () {
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_Form_HSHP");
            if (edu.util.checkValue(strChuongTrinh_Id)) {
                me.getList_HocPhan_OnModal(strChuongTrinh_Id);
            }
        });
        /*------------------------------------------
		--Discription: [1] Action main  HeSoHocPhan
		-------------------------------------------*/
        $("#btnSave_HSHP").click(function () {
            //check HocKy, dHeSo, KhoanThu, TinhChat, arrHocPhan_Id,....
            var valid = edu.util.validInputForm(me.valid_TKKBP);
            if (valid == true) {
                if (edu.util.checkValue(me.arrHocPhan_Id)) {
                    me.save_HeSoHocPhan();
                }
                else {
                    $("#tbldata_HocPhan_Selected tbody").html('<tr><td class="td-center color-danger" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
                }
            }

        });
        $("#tbldata_HSHP").delegate(".btnEdit_HSHP", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/edit_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.openBoxEdit_HeSoHocPhan(selected_id);
            }
        });
        $("#tbldata_HSHP").delegate(".btnUpdate_HSHP", "keypress", function (e) {
            if (e.which == 13) {
                var selected_id = this.id;
                var strIds = edu.util.cutPrefixId(/txt/g, selected_id);

                if (edu.util.checkValue(strIds)) {
                    var obj = me.closeBoxEdit_HeSoHocPhan(strIds);
                    var value = edu.util.convertStrToNum(obj.value);
                    var arrId = obj.arrId;
                    //call update function
                    me.update_HeSoHocPhan(arrId, value, strIds);
                }
            }
        });
        $("#tbldata_HSHP").delegate(".btnDel_HSHP", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/delete_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
                $("#btnYes").click(function (e) {
                    me.delete_HeSoHocPhan(selected_id);
                });
                return false;
            }

        });
        $('#tbldata_HSHP').on('mouseenter', '.action-hshp', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).removeClass("hide");
        }).on('mouseleave', '.action-hshp', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).addClass("hide");
        });
        $("#btnRewrite_HSHP").click(function () {
            me.rewrite();
        });
        /*------------------------------------------
		--Discription: [2] action HocPhan
		-------------------------------------------*/
        $("#btnCallModal_HocPhan_HSHP").click(function () {
            me.popup_HocPhan();
        });
        $("#tbldata_HocPhan_HSHP").delegate(".btnSelect_HocPhan", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/hocphan_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.select_HocPhan(selected_id);
            }
        });
        $("#tbldata_HocPhan_Selected").delegate(".btnRemove_HocPhan", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/selected_hocphan_id/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.remove_HocPhan(selected_id);
            }
        });
        $("#txtKeyword_HocPhan").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tbldata_HocPhan_HSHP tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle_overide("zone-hsph", "zone_list_hshp");

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        me.getList_ChuongTrinhDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();

        me.valid_TKKBP = [
            { "MA": "dropHocKy_HSHP", "THONGTIN1": "1" },
            { "MA": "txtHeSo_HSHP", "THONGTIN1": "1" },
            { "MA": "dropKieuHoc_HSHP", "THONGTIN1": "1" },
            { "MA": "dropKhoanThu_HSHP", "THONGTIN1": "1" },
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character...
        ];
    },
    rewrite: function () {
        //reset id
        var me = this;
        var arrId = ["dropHocKy_HSHP", "txtHeSo_HSHP", "dropKhoanThu_HSHP", "dropKieuHoc_HSHP"];
        edu.util.resetValByArrId(arrId);
        //reset table
        me.arrHocPhan_Id = [];
        $("#tbldata_HocPhan_HSHP td .btnClose").each(function () {
            $(this).trigger("click");
        });
        $("#tbldata_HocPhan_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
    },
    popup_HocPhan: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalChuongTrinh_HSHP").modal("show");
    },
    genPathSelect: function () {
        var me = this;
        //1.get text
        var strHe       = edu.util.getTextById_Combo("dropHeDaoTao_HSHP");
        var strKhoa     = edu.util.getTextById_Combo("dropKhoaDaoTao_HSHP");
        var strNganh    = edu.util.getTextById_Combo("dropChuongTrinhDaoTao_HSHP");
        if (!edu.util.checkValue(edu.util.getValById("dropHeDaoTao_HSHP"))) {
            strHe = "..";
        }
        if (!edu.util.checkValue(edu.util.getValById("dropKhoaDaoTao_HSHP"))) {
            strKhoa = "..";
        }
        if (!edu.util.checkValue(edu.util.getValById("dropChuongTrinhDaoTao_HSHP"))) {
            strNganh = "..";
        }
        var strHe_Khoa_Nganh = strHe + "/" + strKhoa + "/" + strNganh;
        var html = '<span title="' + edu.util.capitalFirst(strHe_Khoa_Nganh) + '">' + edu.util.capitalFirst(strHe_Khoa_Nganh) + '</span>';
        //2.view
        edu.util.viewHTMLById("lblPathSelect_HeKhoaNganh", html);
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    save_HeSoHocPhan: function () {
        me = this;

        var strHocKy_Ids        = edu.util.getValById("dropHocKy_HSHP");
        var dHeSo               = edu.util.convertStrToNum($("#txtHeSo_HSHP").val());
        var strLoaiKhoan_Ids    = edu.util.getValCombo("dropKhoanThu_HSHP");
        var strKieHoc_Ids       = edu.util.getValCombo("dropKieuHoc_HSHP");
        var strHocPhan_Ids      = me.arrHocPhan_Id;
        var strChuongTrinh_Id   = edu.util.getValById("dropChuongTrinhDaoTao_Form_HSHP");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_HocPhan_HeSo/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id': strHocPhan_Ids.toString(),
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dHeSo': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu': "",
            'strId': ""
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công ");
                    edu.util.toggle_overide("zone-hsph", "zone_list_hshp");
                    me.getList_HeSoHocPhan();
                }
                else {
                    edu.system.alert("QLTC_HocPhan_HeSo.ThemMoi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_HocPhan_HeSo.ThemMoi (er): " + JSON.stringify(er));
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
    update_HeSoHocPhan: function (arrId, dHeSo, strIds) {

        var me = this;
        var obj_notify = {};
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_HocPhan_HeSo/CapNhat',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': edu.util.getValById("dropChuongTrinhDaoTao_HSHP"),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id'          : arrId[1],
            'strDaoTao_ThoiGianDaoTao_Id'   : arrId[0],
            'dHeSo'                         : dHeSo,
            'strNguoiThucHien_Id'            : edu.system.userId,
            'strDiem_KieuHoc_Id'            : arrId[3],
            'strTaiChinh_CacKhoanThu_Id': arrId[2],
            'dKeThua': edu.util.getValById('dropNew_KeThua'),
            'strGhiChu'                     : "",
        };
        //default
        edu.system.beginLoading();
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    me.affectUpdate_HeSoHocPhan(strIds, dHeSo);
                    //notify alert)timer
                    var obj = {
                        title: "Thông báo",
                        content: "Cập nhật thành công!",
                        time: 1500,
                    }
                    edu.system.alertTimer(obj);
                }
                else {
                    edu.system.alert("QLTC_HocPhan_HeSo.CapNhat: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_HocPhan_HeSo.CapNhat (er): " + JSON.stringify(er));
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
    delete_HeSoHocPhan: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_HocPhan_HeSo/Xoa',
            'versionAPI': 'v1.0',

            'strIds': strId,
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
                    me.getList_HeSoHocPhan();
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
    getList_HeSoHocPhan: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strPhamViApDung_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSHP");
        var strDaoTao_HocPhan_Id = me.strHocPhan_Id;
        var strDaoTao_ThoiGianDaoTao_Id = "";
        var strCanBoCapNhat_Id = "";
        var strDiem_KieuHoc_Id = "";
        var strTaiChinh_CacKhoanThu_Id = "";
        var strDangKy_DotDangKyHoc_Id = "";

        var obj_list = {
            'action': 'TC_HocPhan_HeSo/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id':strDaoTao_HocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNguoiThucHien_Id': strCanBoCapNhat_Id,
            'strDiem_KieuHoc_Id': strDiem_KieuHoc_Id,
            'strTaiChinh_CacKhoanThu_Id': strTaiChinh_CacKhoanThu_Id,
            'strDangKy_DotDangKyHoc_Id': strDangKy_DotDangKyHoc_Id
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
                    me.dtHeSoHocPhan = dtResult;
                    me.genTable_HeSoHocPhan();
                }
                else {
                    edu.system.alert("QLTC_HocPhan_HeSo.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_HocPhan_HeSo.LayDanhSach (er): " + JSON.stringify(er), "w");
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
	--Discription: [1] GEN HTML HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    genTable_HeSoHocPhan: function () {
        var me = this;
        //1. variable
        var $table_thead = "#tbldata_HSHP thead";
        var $table_tbody = "#tbldata_HSHP tbody";
        var thead = "";
        var tbody = "";
        $($table_thead).html("");
        $($table_tbody).html("");
        //2. thead
        thead = me.genThead_HeSoHocPhan(me.dtKhoanThu, me.dtKieuHoc, me.dtHeSoHocPhan);
        $($table_thead).append(thead);
        //3. tbody
        tbody = me.genTbody_HeSoHocPhan(me.dtHocPhan, me.dtHeSoHocPhan, me.dtKhoanThu, me.dtKieuHoc);
        //4. gen table
        $($table_tbody).append(tbody);
    },
    genThead_HeSoHocPhan: function (dtKhoanThu, dtKieuHoc, dtHeSoHocPhan) {
        var me = this;
        var arrLoaiKhoan = [];
        //thead
        var thead = '';
        thead += '<tr>';
        thead += '<th class="td-center td-fixed" rowspan="2">Stt</th>';
        //thead += '<th class="td-left" rowspan="2">Chương trình</th>';
        thead += '<th class="td-center" rowspan="2">Học kỳ</th>';
        arrLoaiKhoan = me.getUnique_LoaiKhoan(dtKhoanThu, dtHeSoHocPhan);
        
        for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {
            thead += '<th class="td-center" colspan="' + dtKieuHoc.length + '">' + dtKhoanThu[lk].TEN + '</th>';
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
    genTbody_HeSoHocPhan: function (dtHocPhan, dtHeSoHocPhan, dtKhoanThu, dtKieuHoc) {
        var me = this;
        //tbody
        var tbody = '';
        var arrHocKy = [];
        var arrHeSoHocPhan = [];
        var arrHocPhan = [];
        var arrLoaiKhoan = [];
        var objHocKy = {};
        var rowspan = 0;
        var check = false;
        var arrCheckExist = [];
        
        getUnique_Data();

        // processing
        function getUnique_Data() {
            for (var hp = 0; hp < dtHocPhan.length; hp++) {
                //I. processing 
                for (var dt = 0; dt < dtHeSoHocPhan.length; dt++) {
                    if (dtHocPhan[hp].DAOTAO_HOCPHAN_ID == dtHeSoHocPhan[dt].DAOTAO_HOCPHAN_ID) {
                        //1. get unique hocky
                        objHocKy = {};
                        objHocKy.ID = dtHeSoHocPhan[dt].DAOTAO_THOIGIANDAOTAO_ID;
                        objHocKy.TEN = dtHeSoHocPhan[dt].DAOTAO_THOIGIANDAOTAO_HOCKY;
                        
                        if (!edu.util.objEqualVal(arrHocKy, "ID", objHocKy.ID)) {//if not exit
                            arrHocKy.push(objHocKy);
                        }
                        //2. get unique hesohocphan
                        arrHeSoHocPhan.push(dtHeSoHocPhan[dt]);
                        //3. get unique hocphan
                        arrHocPhan = dtHocPhan[hp];
                    }
                }
                //4. get unique loaikhoan
                arrLoaiKhoan = me.getUnique_LoaiKhoan(dtKhoanThu, dtHeSoHocPhan);
                //II. call gen tbody
                genTbody(arrHocKy, arrHocPhan, arrHeSoHocPhan, arrLoaiKhoan);
                //II. reset
                arrHeSoHocPhan = [];
                arrHocKy = [];
                arrHocPhan = [];
                arrLoaiKhoan = [];
            }
        }
        function genTbody(arrHocKy, arrHocPhan, arrHeSoHocPhan, arrLoaiKhoan) {

            var stt = 0;
            var strHocKy_Ten = "";
            var arrId = "";
            var dHeSo = 0;
            var check = false;

            for (var hk = 0; hk < arrHocKy.length; hk++) {//1.loop HocKy
                stt = (hk + 1);
                strHocKy_Ten = edu.util.returnEmpty(arrHocKy[hk].TEN);

                //{start: generating row}
                tbody += '<tr>';
                //collage the same strHocPhan_Ten and strHocPhan_Ma
                tbody += '<td class="td-center td-fixed">' + stt + '</td>';
                tbody += '<td class="td-center">' + strHocKy_Ten + '</td>';
                //gen data dHeSo for each HocKy_Id
                for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {//2.loop LoaiKhoan
                    for (var kh = 0; kh < dtKieuHoc.length; kh++) {//3.loop KieuHoc
                        check = false;
                        arrId = arrHocKy[hk].ID + "_" + arrHocPhan.DAOTAO_HOCPHAN_ID + "_" + arrLoaiKhoan[lk].ID + "_" + dtKieuHoc[kh].ID;
                        var arrKieuHoc = [];
                        for (var dt = arrHeSoHocPhan.length -1; dt >=0; dt--) {//4.loop HeSoHocPhan
                            if (arrHocKy[hk].ID == arrHeSoHocPhan[dt].DAOTAO_THOIGIANDAOTAO_ID
                                && arrHeSoHocPhan[dt].TAICHINH_CACKHOANTHU_ID == arrLoaiKhoan[lk].ID
                                && arrHeSoHocPhan[dt].KIEUHOC_ID == dtKieuHoc[kh].ID) {
                                if (arrKieuHoc.indexOf(dtKieuHoc[kh].ID) != -1) continue;
                                arrKieuHoc.push(dtKieuHoc[kh].ID);
                                //has value
                                dHeSo = edu.util.formatCurrency(edu.util.returnZero(arrHeSoHocPhan[dt].HESO));
                                //gen tr
                                tbody += genRow(arrId, dHeSo, arrHeSoHocPhan[dt].ID);
                                check = true;
                            }
                        }
                        if (!check) {//no value
                            tbody += genRow(arrId, "");
                        }
                    }
                }
                tbody += '</tr>';
                //(end: row}
            }

        }
        function genRow(arrId, dHeSo, strHeSoHocPhan_Id) {
            var tbody = '';
            tbody += '<td class="td-center action-hshp" id="remark' + arrId + '">';
            tbody += '<span id="zoneDisplay' + arrId + '">';
            tbody += '<span id="value' + arrId + '">' + dHeSo + "</span> <br />";
            tbody += '<span class="hide" id="action' + arrId + '">';
            tbody += '<a id="edit_' + arrId + '" class="btn btn-default btn-circle btnEdit_HSHP" title="Chỉnh sửa"><i class="fa fa-pencil color-active"></i></a>';
            tbody += '<a id="delete_' + strHeSoHocPhan_Id + '" class="btn btn-default btn-circle btnDel_HSHP" title="Xóa"><i class="fa fa-times-circle color-active"></i></a>';
            tbody += '</span>';
            tbody += '</span>';
            tbody += '<span id="zoneEdit' + arrId + '"  style="display: none">';
            tbody += '<input type="text" id="txt' + arrId + '" class="form-control btnUpdate_HSHP" data-ax5formatter="money"/>';
            tbody += '</span>';
            tbody += '</td>';
            return tbody;

        }

        return tbody;
    },
    getUnique_LoaiKhoan: function (dtKhoanThu, dtHeSoHocPhan) {
        var me = this;;
        var arrLoaiKhoan = [];

        for (var lk = 0; lk < dtKhoanThu.length; lk++) {

            for (var dv = 0; dv < dtHeSoHocPhan.length; dv++) {

                if (dtHeSoHocPhan[dv].TAICHINH_CACKHOANTHU_ID == dtKhoanThu[lk].ID) {

                    if (!edu.util.objEqualVal(arrLoaiKhoan, "ID", dtKhoanThu[lk].ID)) {//if not exit
                        arrLoaiKhoan.push(dtKhoanThu[lk]);
                    }
                }
            }
        }
        return arrLoaiKhoan;
        
    },
    /*------------------------------------------
	--Discription: [1] ACTION HTML - HeSoHocPhan
	--ULR:  
	-------------------------------------------*/
    openBoxEdit_HeSoHocPhan: function (arrId) {
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
    closeBoxEdit_HeSoHocPhan: function (arrId) {
        var $placeEdit = "#zoneEdit" + arrId;
        var $placeDisplay = "#zoneDisplay" + arrId;
        var $input = "#txt" + arrId;
        $($placeEdit).hide(120);
        $($placeDisplay).show(120);
        //get value to save
        var arrId = edu.util.convertStrToArr(arrId, "_");
        var value = $($input).val();
        var obj = {
            arrId: arrId,
            value: value
        }
        return obj;
    },
    //affect --> for edit action and delete
    affectUpdate_HeSoHocPhan: function (strIds, value) {
        var me = this;
        //1. add or update remark
        me.removeAffect_HeSoHocPhan(strIds);
        var $place = "#remark" + strIds;
        $($place).addClass("bg-default");
        //2. update html new value
        var $newValue = "#value" + strIds;
        $($newValue).html(edu.util.formatCurrency(value));
    },
    affectDelete_HeSoHocPhan: function (arrId) {
        //2. update html new value
        var $empty = "#value" + arrId;
        $($empty).html("");
    },
    removeAffect_HeSoHocPhan: function (arrId) {
        var $place = "#removeRemark" + arrId;
        $($place).removeClass("bg-default");
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
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
        var me = this;
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
    getList_ChuongTrinhDaoTao: function (strKhoaDaoTao_Id, position) {
        var me = this;

        var obj_ChuongTrinhDT = {
            strKhoaDaoTao_Id: strKhoaDaoTao_Id,
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };

        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//call only one time
            edu.system.getList_ChuongTrinhDaoTao(obj_ChuongTrinhDT, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
        }
        else {
            edu.util.objGetDataInData(strKhoaDaoTao_Id, me.dtChuongTrinhDaoTao, "DAOTAO_KHOADAOTAO_ID", me.cbGenCombo_ChuongTrinhDaoTao);
        }
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
	-------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropHeDaoTao_HSHP"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.HeSoHocPhan;
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
            renderPlace: ["dropKhoaDaoTao_HSHP"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.HeSoHocPhan;
        if (!edu.util.checkValue(me.dtChuongTrinhDaoTao)) {//attch only one time
            me.dtChuongTrinhDaoTao = data;
        }

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao_HSHP", "dropChuongTrinhDaoTao_Form_HSHP"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var strDAOTAO_Nam_Id = "";
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;


        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao',
            'versionAPI': 'v1.0',

            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
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
                    me.loadToCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("CM_ThoiGianDaoTao.LayDanhSach_ThoiGianDaoTao (er): " + JSON.stringify(er), "w");
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
                    me.genComBo_KhoanThu(dtResult);
                    me.dtKhoanThu = dtResult;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    getList_KieuHoc: function (resolve, reject) {
        var me = this;
        var strMaBangDanhMuc = "KHDT.DIEM.KIEUHOC";

        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': strMaBangDanhMuc
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
                    me.genComBo_KieuHoc(data.Data);
                    me.dtKieuHoc = data.Data;
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    --Discription: [4] ACESS DB HocPhan
    --ULR:  
    -------------------------------------------*/
    getList_HocPhan: function (strChuongTrinh_Id) {
        var me = this;
        var obj = {
            strChuongTrinh_Id: strChuongTrinh_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: $("#txtKeyword_HSHP").val(),
            pageIndex: 1,
            pageSize: 200,
        };
        edu.system.getList_HocPhan(obj, "", "", me.cbGenTreejs_HocPhan);
    },
    getList_HocPhan_OnModal: function (strChuongTrinh_Id) {
        var me = this;
        var obj = {
            strChuongTrinh_Id: strChuongTrinh_Id,
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 200,
        };
        edu.system.getList_HocPhan(obj, "", "", me.cbGenTable_HocPhan);
    },
    /*------------------------------------------
    --Discription: [3] GEN HTML ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
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
            renderPlace: ["dropHocKy_HSHP"],
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
            renderPlace: ["dropKieuHoc_HSHP"],
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
            renderPlace: ["dropKhoanThu_HSHP"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4] GEN HTML HocPhan
    --ULR:  
    -------------------------------------------*/
    select_HocPhan: function (id) {
        var me = this;
        var html = '';
        var obj_notify = {};
        //[1] add to arr
        if (edu.util.arrCheckExist(me.arrHocPhan_Id, id)) {
            obj_notify = {
                renderPlace: "hocphan_id" + id,
                type: "w",
                title: "Dữ liệu đã tồn tại!",
                autoClose: true,
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "hocphan_id" + id,
                type: "i",
                title: "Chọn thành công!",
                autoClose: false,
            }
            edu.system.notifyLocal(obj_notify);
            me.arrHocPhan_Id.push(id);
        }
        //[2] add html to table
        var $hocphan_ten = "hocphan_ten" + id;
        var $hocphan_ma = "hocphan_ma" + id;

        var strHocPhan_Ten = edu.util.getTextById($hocphan_ten);
        var strHocPhan_Ma = edu.util.getTextById($hocphan_ma);

        html += '<tr id="zone_hocphan' + id + '">';
        html += '<td class="td-fixed td-center">-</td>';
        html += '<td class="td-left">' + strHocPhan_Ten + '</td>';
        html += '<td class="td-center">' + strHocPhan_Ma + '</td>';
        html += '<td class="td-fixed td-center"><a id="selected_hocphan_id' + id + '" class="btn btnRemove_HocPhan" href="#">Hủy</a></td>';
        html += '</tr>';

        //[3] fill into table 
        var renderPlace = "#tbldata_HocPhan_Selected tbody";
        $(renderPlace).append(html);
    },
    remove_HocPhan: function (id) {
        var me = this;
        //[1] remove from arr
        edu.util.arrExcludeVal(me.arrHocPhan_Id, id);
        //[2] remove html from table
        var removePlace = "#zone_hocphan" + id;
        $(removePlace).remove();
    },
    cbGenTreejs_HocPhan: function (data) {
        var me = main_doc.HeSoHocPhan;
        var strHocPhan_Text = "";

        me.strHocPhan_Id = "";
        me.dtHocPhan = data;
        //1. Gen
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_HOCPHAN_ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: ""
            },
            renderPlaces: ["zone_treejs_hocphan"]
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_treejs_hocphan').on("select_node.jstree", function (e, data) {
            me.strHocPhan_Id = data.node.id;
            strHocPhan_Text = data.node.li_attr.title;//title --> full info, text --> a part infor (30 characters).
            //2.1 call main action
            me.getList_HeSoHocPhan();
            //2.2 bind text
            edu.util.viewHTMLById("lblHocPhan", strHocPhan_Text);
            //2.3 if zone-input-hshp is open --> close
            edu.util.toggle_overide("zone-hsph", "zone_list_hshp");

            //----------------------------------------------------------------------------------------------
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
            //---------------------------------------------------------------------------------------------------------
        });
    },
    cbGenTable_HocPhan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tbldata_HocPhan_HSHP",
            aaData: data,
            "sort": true,
            colPos: {
                left: [1],
                fix: [0],
                center: [2]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strTen = aData.DAOTAO_HOCPHAN_TEN;
                        var html = '<span id="hocphan_ten' + aData.DAOTAO_HOCPHAN_ID + '">' + strTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strMa = aData.DAOTAO_HOCPHAN_MA;
                        var html = '<span id="hocphan_ma' + aData.DAOTAO_HOCPHAN_ID + '">' + strMa + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '<a id="hocphan_id' + aData.DAOTAO_HOCPHAN_ID + '" class="btn btnSelect_HocPhan"><i class="fa fa-check"> Chọn</i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        $('#zoneTable_HocPhan').slimScroll({
            position: 'right',
            height: "400px",
            railVisible: true,
            alwaysVisible: false
        });
    },
}