/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 30/08/2018
--API URL: QLTC_DoiTuong_HeSo
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HeSoDoiTuong() { };
HeSoDoiTuong.prototype = {
    valid_HSDT: [],
    html_HSDT: {},
    input_HSDT: {},
    strDoiTuong_Id: '',
    arrKhoaHoc_Id: [],
    arrHaveEdited: [],
    dtKhoanThu: [],
    dtKieuHoc: [],
    dtDoiTuong: [],
    dtHeSoDoiTuong: [],
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
            edu.util.toggle_overide("zone-hsdt", "zone_list_hsdt");
        });
        $(".btnAddNew").click(function () {
            me.rewrite();
            edu.util.toggle_overide("zone-hsdt", "zone_input_hsdt");
        });
        $("#txtKeyword_HSDT").focus();
        /*------------------------------------------
		--Discription: [1] Action TimKiem HeSoDoiTuong
		-------------------------------------------*/
        $('#dropHeDaoTao_HSDT').on('select2:select', function () {
            var strHeHaoTao_Id = edu.util.getValById("dropHeDaoTao_HSDT");
            if (strHeHaoTao_Id) {
                me.getList_KhoaDaoTao(strHeHaoTao_Id);
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
            me.getList_ChuongTrinhDaoTao("");
        });
        $('#dropKhoaDaoTao_HSDT').on('select2:select', function () {
            var strKhoaHoc_Id = edu.util.getValById("dropKhoaDaoTao_HSDT");
            if (strKhoaHoc_Id) {
                me.getList_ChuongTrinhDaoTao(strKhoaHoc_Id);
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $('#dropChuongTrinhDaoTao_HSDT').on('select2:select', function () {
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSDT");
            if (strChuongTrinh_Id) {
                //1. call db
                me.getList_HeSoDoiTuong();
                //2.hide box-search
                //edu.util.toggle("box-sub-search");
                //4. trigger ----> dropChuongTrinhDaoTaoOnModal_HSDT on modal
                $("#dropChuongTrinhDaoTaoOnModal_HSDT").val(strChuongTrinh_Id).trigger("change");
            }
            else {
                edu.system.alert("Chưa lấy được dữ liệu, vui lòng chọn lại!");
            }
        });
        $("#btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnRefresh_HSDT").click(function () {
            me.getList_HeSoDoiTuong();
        });
        $('#dropChuongTrinhDaoTaoOnModal_HSDT').on('select2:select', function () {
            var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTaoOnModal_HSDT");
            if (edu.util.checkValue(strChuongTrinh_Id)) {
                me.getList_HocPhan_OnModal(strChuongTrinh_Id);
            }
        });
        /*------------------------------------------
		--Discription: [1] Action main  HeSoDoiTuong
		-------------------------------------------*/
        $("#btnSave_HSDT").click(function () {
            //check HocKy, dHeSo, KhoanThu, TinhChat
            var valid = edu.util.validInputForm(me.valid_TKKBP);
            if (valid == true) {
                me.save_HeSoDoiTuong();
            }

        });
        $("#tbldata_HSDT").delegate(".btnEdit_HSDT", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/edit_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                me.openBoxEdit_HeSoDoiTuong(selected_id);
            }
        });
        $("#tbldata_HSDT").delegate(".btnUpdate_HSDT", "keypress", function (e) {
            if (e.which == 13) {
                var selected_id = this.id;
                var strIds = edu.util.cutPrefixId(/txt/g, selected_id);

                if (edu.util.checkValue(strIds)) {
                    var obj = me.closeBoxEdit_HeSoDoiTuong(strIds);
                    var value = edu.util.convertStrToNum(obj.value);
                    var arrId = obj.arrId;
                    //call update function
                    me.update_HeSoDoiTuong(arrId, value, strIds);
                }
            }
        });
        $("#tbldata_HSDT").delegate(".btnDel_HSDT", "click", function () {
            var selected_id = this.id;
            selected_id = edu.util.cutPrefixId(/delete_/g, selected_id);
            if (edu.util.checkValue(selected_id)) {
                edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu hệ thống?");
                $("#btnYes").click(function (e) {
                    me.delete_HeSoDoiTuong(selected_id);
                });
                return false;
            }

        });
        $('#tbldata_HSDT').on('mouseenter', '.action-hsdt', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).removeClass("hide");
        }).on('mouseleave', '.action-hsdt', function (event) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/remark/g, strId);
            strId = "#action" + strId;

            $(strId).addClass("hide");
        });
        $("#btnRewrite_HSDT").click(function () {
            me.rewrite();
        });
        /*------------------------------------------
		--Discription: [2] action HocPhan
		-------------------------------------------*/
        $("#btnCallModal_HocPhan_HSDT").click(function () {
            me.popup_HocPhan();
        });
        $("#tbldata_HocPhan_HSDT").delegate(".btnSelect_HocPhan", "click", function () {
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
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle_overide("zone-hsdt", "zone_list_hsdt");
        me.arrHaveEdited = [];
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao("");
        me.getList_ChuongTrinhDaoTao("");
        me.getList_ThoiGianDaoTao();
        me.getList_LoaiKhoan();
        me.getList_KieuHoc();
        me.getList_DoiTuong();
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.DOITUONG", "dropDoiTuong_HSDT", "Chọn đối tượng đào tạo");
        me.valid_TKKBP = [
            { "MA": "dropHocKy_HSDT", "THONGTIN1": "1" },
            { "MA": "dropDoiTuong_HSDT", "THONGTIN1": "1" },
            { "MA": "txtHeSo_HSDT", "THONGTIN1": "1#3" },
            { "MA": "dropKieuHoc_HSDT", "THONGTIN1": "1" },
            { "MA": "dropKhoanThu_HSDT", "THONGTIN1": "1" },
            //1-empty, 2-float, 3-int, 4-date, seperated by "#" character... 
        ];
    },
    rewrite: function () {
        //1.reset id
        var me = this;
        var arrId = ["dropHocKy_HSDT", "txtHeSo_HSDT", "dropKhoanThu_HSDT", "dropKieuHoc_HSDT"];
        edu.util.resetValByArrId(arrId);
        //2.reset table
        $("#tbldata_HocPhan_Selected tbody").html('<tr><td class="td-center" colspan="4">Vui lòng chọn dữ liệu!</td></tr>');
    },
    popup_HocPhan: function () {
        var me = this;
        $("#btnNotifyModal").remove();
        $("#myModalChuongTrinh_HSDT").modal("show");
    },
    genPathSelect: function () {
        var me = this;
        //1.get text
        var strHe = edu.util.getTextById_Combo("dropHeDaoTao_HSDT");
        var strKhoa = edu.util.getTextById_Combo("dropKhoaDaoTao_HSDT");
        var strNganh = edu.util.getTextById_Combo("dropChuongTrinhDaoTao_HSDT");
        if (!edu.util.checkValue(edu.util.getValById("dropHeDaoTao_HSDT"))) {
            strHe = "..";
        }
        if (!edu.util.checkValue(edu.util.getValById("dropKhoaDaoTao_HSDT"))) {
            strKhoa = "..";
        }
        if (!edu.util.checkValue(edu.util.getValById("dropChuongTrinhDaoTao_HSDT"))) {
            strNganh = "..";
        }
        var strHe_Khoa_Nganh = strHe + "/" + strKhoa + "/" + strNganh;
        var html = '<span title="' + edu.util.capitalFirst(strHe_Khoa_Nganh) + '">' + edu.util.capitalFirst(strHe_Khoa_Nganh) + '</span>';
        //2.view
        edu.util.viewHTMLById("lblPathSelect_HeKhoaNganh", html);
    },
    /*------------------------------------------
	--Discription: [1] ACCESS DB HeSoDoiTuong
	--ULR:  
	-------------------------------------------*/
    save_HeSoDoiTuong: function () {
        me = this;

        var strHocKy_Ids = edu.util.getValById("dropHocKy_HSDT");
        var dHeSo = edu.util.convertStrToNum($("#txtHeSo_HSDT").val());
        var strLoaiKhoan_Ids = edu.util.getValCombo("dropKhoanThu_HSDT");
        var strKieHoc_Ids = edu.util.getValCombo("dropKieuHoc_HSDT");
        var strDoiTuong_Id = edu.util.getValCombo("dropDoiTuong_HSDT");
        var strChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTaoOnModal_HSDT");

        //reset
        var me = this;
        var obj_save = {
            'action': 'TC_DoiTuong_HeSo/ThemMoi',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': strChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strDoiTuong_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strHocKy_Ids,
            'dHeSo': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': strKieHoc_Ids,
            'strTaiChinh_CacKhoanThu_Id': strLoaiKhoan_Ids,
            'strGhiChu':"",
            'strId': ""
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        title: "Thông báo",
                        content: "Thêm mới thành công!",
                        time: 1500,
                    }
                    edu.system.alert("Thêm mới thành công!");
                    edu.util.toggle_overide("zone-hsdt", "zone_list_hsdt");
                    me.getList_HeSoDoiTuong();
                }
                else {
                    edu.system.alert("QLTC_DoiTuong_HeSo.ThemMoi: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_DoiTuong_HeSo.ThemMoi (er): " + JSON.stringify(er));
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
    update_HeSoDoiTuong: function (arrId, dHeSo, strIds) {

        var me = this;
        var obj_notify = {};
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_DoiTuong_HeSo/CapNhat',
            'versionAPI': 'v1.0',

            'strPhamViApDung_Id': edu.util.getValById("dropChuongTrinhDaoTao_HSDT"),
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strDaoTao_HocPhan_Id': arrId[1],
            'strDaoTao_ThoiGianDaoTao_Id': arrId[0],
            'dHeSo': dHeSo,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_KieuHoc_Id': arrId[3],
            'strTaiChinh_CacKhoanThu_Id': arrId[2],
            'strGhiChu': "",
        };
        //default
        edu.system.beginLoading();

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //remark and update new value on HTML
                    me.affectUpdate_HeSoDoiTuong(strIds, dHeSo);
                    //notify alert)timer
                    var obj = {
                        title: "Thông báo",
                        content: "Cập nhật thành công!",
                        time: 1500,
                    }
                    edu.system.alertTimer(obj);
                }
                else {
                    edu.system.alert("QLTC_DoiTuong_HeSo.CapNhat: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_DoiTuong_HeSo.CapNhat (er): " + JSON.stringify(er));
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
    delete_HeSoDoiTuong: function (strId) {
        var me = this;
        //format arId ===> [HocKy, HocPhan, LoaiKhoan, KieuHoc]
        var obj_save = {
            'action': 'TC_DoiTuong_HeSo/Xoa',
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
                    me.getList_HeSoDoiTuong();
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
    getList_HeSoDoiTuong: function () {
        var me = this;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 10000;
        var strDaoTao_ToChucChuongTrinh_Id = edu.util.getValById("dropChuongTrinhDaoTao_HSDT");
        var strDoiTuong_Id = me.strDoiTuong_Id;
        var strDaoTao_ThoiGianDaoTao_Id = "";
        var strNguoiThucHien_Id = "";
        var strDiem_KieuHoc_Id = "";
        var strTaiChinh_CacKhoanThu_Id = "";

        var obj_list = {
            'action': 'TC_DoiTuong_HeSo/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize,

            'strPhamViApDung_Id': strDaoTao_ToChucChuongTrinh_Id,
            'strPhanCapApDung_Id': "",
            'strNgayApDung': "",
            'strQLSV_DoiTuong_Id': strDoiTuong_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strDiem_KieuHoc_Id': strDiem_KieuHoc_Id,
            'strTaiChinh_CacKhoanThu_Id': strTaiChinh_CacKhoanThu_Id,
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
                    me.dtHeSoDoiTuong = dtResult;
                    me.genTable_HeSoDoiTuong();
                }
                else {
                    edu.system.alert("QLTC_DoiTuong_HeSo.LayDanhSach: " + data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTC_DoiTuong_HeSo.LayDanhSach (er): " + JSON.stringify(er), "w");
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
	--Discription: [1] GEN HTML HeSoDoiTuong
	--ULR:  
	-------------------------------------------*/
    genTable_HeSoDoiTuong: function () {
        var me = this;
        //1. variable
        var $table_thead = "#tbldata_HSDT thead";
        var $table_tbody = "#tbldata_HSDT tbody";
        var thead = "";
        var tbody = "";
        $($table_thead).html("");
        $($table_tbody).html("");
        //2. thead
        thead = me.genThead_HeSoDoiTuong(me.dtKhoanThu, me.dtKieuHoc, me.dtHeSoDoiTuong);
        $($table_thead).append(thead);
        //3. tbody
        tbody = me.genTbody_HeSoDoiTuong(me.dtDoiTuong, me.dtHeSoDoiTuong, me.dtKhoanThu, me.dtKieuHoc);
        $($table_tbody).append(tbody);
    },
    genThead_HeSoDoiTuong: function (dtKhoanThu, dtKieuHoc, dtHeSoDoiTuong) {
        var me = this;
        var arrLoaiKhoan = [];
        //thead
        var thead = '';
        thead += '<tr>';
        thead += '<th class="td-center td-fixed" rowspan="2">Stt</th>';
        thead += '<th class="td-left" rowspan="2">Chương trình</th>';
        thead += '<th class="td-left" rowspan="2">Đối tượng</th>';
        thead += '<th class="td-center" rowspan="2">Học kỳ</th>';
        arrLoaiKhoan = me.getUnique_LoaiKhoan(dtKhoanThu, dtHeSoDoiTuong);

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
    genTbody_HeSoDoiTuong: function (dtDoiTuong, dtHeSoDoiTuong, dtKhoanThu, dtKieuHoc) {
        var me = this;
        //tbody
        var tbody = '';
        var arrHocKy = [];
        var arrHeSoDoiTuong = [];
        var arrDoiTuong = [];
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
            for (var hp = 0; hp < dtDoiTuong.length; hp++) {
                //1. hocky
                for (var dt = 0; dt < dtHeSoDoiTuong.length; dt++) {
                    if (dtDoiTuong[hp].ID == dtHeSoDoiTuong[dt].QLSV_DOITUONG_ID) {
                        //objHocKy
                        objHocKy = {};
                        objHocKy.ID = dtHeSoDoiTuong[dt].DAOTAO_THOIGIANDAOTAO_ID;
                        objHocKy.TEN = dtHeSoDoiTuong[dt].DAOTAO_THOIGIANDAOTAO_HOCKY;
                        //
                        if (!edu.util.objEqualVal(arrHocKy, "ID", objHocKy.ID)) {//if not exit
                            arrHocKy.push(objHocKy);
                        }
                        //
                        arrHeSoDoiTuong.push(dtHeSoDoiTuong[dt]);
                        arrDoiTuong = dtDoiTuong[hp];
                    }
                }
                //2. loaikhoan
                arrLoaiKhoan = me.getUnique_LoaiKhoan(dtKhoanThu, dtHeSoDoiTuong);
                //3. call process
                genTbody(arrHocKy, arrDoiTuong, arrHeSoDoiTuong, arrLoaiKhoan);
                //4. reset
                arrHeSoDoiTuong = [];
                arrHocKy = [];
                arrDoiTuong = [];
                arrLoaiKhoan = [];
            }
        }
        function genTbody(arrHocKy, arrDoiTuong, arrHeSoDoiTuong, arrLoaiKhoan) {

            var stt = 0;
            var strChuongTrinh_Ten = "";
            var strDoiTuong_Ten = "";
            var strHocKy_Ten = "";

            var arrId = "";
            var dHeSo = 0;
            var check = false;

            for (var hk = 0; hk < arrHocKy.length; hk++) {//1.loop HocKy
                stt = (hk + 1);
                strChuongTrinh_Ten = edu.util.returnEmpty(arrHeSoDoiTuong[hk].PHAMVIAPDUNG_TEN);
                strDoiTuong_Ten = edu.util.returnEmpty(arrHeSoDoiTuong[hk].QLSV_DOITUONG_TEN);
                strHocKy_Ten = edu.util.returnEmpty(arrHocKy[hk].TEN);

                //{start: generating row}
                tbody += '<tr>';
                //collage the same strHocPhan_Ten and strHocPhan_Ma
                tbody += '<td class="td-center td-fixed">' + stt + '</td>';
                tbody += '<td class="td-left">' + strChuongTrinh_Ten + '</td>';
                tbody += '<td class="td-left">' + strDoiTuong_Ten + '</td>';
                tbody += '<td class="td-center">' + strHocKy_Ten + '</td>';
                //gen data dHeSo for each HocKy_Id
                for (var lk = 0; lk < arrLoaiKhoan.length; lk++) {//2.loop LoaiKhoan
                    for (var kh = 0; kh < dtKieuHoc.length; kh++) {//3.loop KieuHoc
                        check = false;
                        arrId = arrHocKy[hk].ID + "_" + arrDoiTuong.QLSV_DOITUONG_ID + "_" + arrLoaiKhoan[lk].ID + "_" + dtKieuHoc[kh].ID;

                        var arrKieuHoc = [];
                        for (var dt = arrHeSoDoiTuong.length -1; dt >=0; dt--) {//4.loop HeSoDoiTuong
                            if (arrHocKy[hk].ID == arrHeSoDoiTuong[dt].DAOTAO_THOIGIANDAOTAO_ID
                                && arrHeSoDoiTuong[dt].TAICHINH_CACKHOANTHU_ID == arrLoaiKhoan[lk].ID
                                && arrHeSoDoiTuong[dt].KIEUHOC_ID == dtKieuHoc[kh].ID) {
                                if (arrKieuHoc.indexOf(dtKieuHoc[kh].ID) != -1) continue;
                                arrKieuHoc.push(dtKieuHoc[kh].ID);
                                //has value
                                dHeSo = edu.util.formatCurrency(edu.util.returnZero(arrHeSoDoiTuong[dt].HESO));
                                //gen tr
                                tbody += genRow(arrId, dHeSo, arrHeSoDoiTuong[dt].ID);
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
        function genRow(arrId, dHeSo, strHeSo_Id) {
            var tbody = '';
            tbody += '<td class="td-center action-hsdt" id="remark' + arrId + '">';
            tbody += '<span id="zoneDisplay' + arrId + '">';
            tbody += '<span id="value' + arrId + '">' + dHeSo + "</span> <br />";
            tbody += '<span class="hide" id="action' + arrId + '">';
            tbody += '<a id="edit_' + arrId + '" class="btn btn-default btn-circle btnEdit_HSDT" title="Chỉnh sửa"><i class="fa fa-pencil color-active"></i></a>';
            tbody += '<a id="delete_' + strHeSo_Id + '" class="btn btn-default btn-circle btnDel_HSDT" title="Xóa"><i class="fa fa-times-circle color-active"></i></a>';
            tbody += '</span>';
            tbody += '</span>';
            tbody += '<span id="zoneEdit' + arrId + '"  style="display: none">';
            tbody += '<input type="text" id="txt' + arrId + '" class="form-control btnUpdate_HSDT" data-ax5formatter="money"/>';
            tbody += '</span>';
            tbody += '</td>';
            return tbody;

        }

        return tbody;
    },
    getUnique_LoaiKhoan: function (dtKhoanThu, dtHeSoDoiTuong) {
        var me = this;;
        var arrLoaiKhoan = [];
        var objLoaiKhoan = {};

        for (var lk = 0; lk < dtKhoanThu.length; lk++) {
            for (var dv = 0; dv < dtHeSoDoiTuong.length; dv++) {
                if (dtHeSoDoiTuong[dv].TAICHINH_CACKHOANTHU_ID == dtKhoanThu[lk].ID) {
                    //objLoaiKhoan
                    objLoaiKhoan = {};
                    objLoaiKhoan.ID = dtKhoanThu[lk].ID;
                    objLoaiKhoan.TEN = dtKhoanThu[lk].TEN;
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
	--Discription: [1] ACTION HTML - HeSoDoiTuong
	--ULR:  
	-------------------------------------------*/
    openBoxEdit_HeSoDoiTuong: function (arrId) {
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
    closeBoxEdit_HeSoDoiTuong: function (arrId) {
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
    affectUpdate_HeSoDoiTuong: function (strIds, value) {
        var me = this;
        //1. add or update remark
        me.removeAffect_HeSoDoiTuong(strIds);
        var $place = "#remark" + strIds;
        $($place).addClass("bg-default");
        //2. update html new value
        var $newValue = "#value" + strIds;
        $($newValue).html(edu.util.formatCurrency(value));
    },
    affectDelete_HeSoDoiTuong: function (arrId) {
        //2. update html new value
        var $empty = "#value" + arrId;
        $($empty).html("");
    },
    removeAffect_HeSoDoiTuong: function (arrId) {
        var $place = "#removeRemark" + arrId;
        $($place).removeClass("bg-default");
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.HeSoDoiTuong;
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
        var me = main_doc.HeSoDoiTuong;
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
        var me = main_doc.HeSoDoiTuong;

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
            renderPlace: ["dropHeDaoTao_HSDT"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = main_doc.HeSoDoiTuong;
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
            renderPlace: ["dropKhoaDaoTao_HSDT"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = main_doc.HeSoDoiTuong;
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
            renderPlace: ["dropChuongTrinhDaoTao_HSDT", "dropChuongTrinhDaoTaoOnModal_HSDT"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] ACESS DB ThoiGianDaoTao
    --ULR:  
    -------------------------------------------*/
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
            renderPlace: ["dropHocKy_HSDT"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genComBo_KieuHoc: function (data) {
        var me = main_doc.HeSoDoiTuong;
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
            renderPlace: ["dropKieuHoc_HSDT"],
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
            renderPlace: ["dropKhoanThu_HSDT"],
            type: "",
            title: "Chọn khoản thu",
        }
        edu.system.loadToCombo_data(obj);
    },

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
        var obj = {
            strMaBangDanhMuc: "KHDT.DIEM.KIEUHOC"
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.genComBo_KieuHoc);
        /////////////////////////////
    },
    /*------------------------------------------
    --Discription: [4] ACESS DB DanhMUc_DoiTuong
    --ULR:  
    -------------------------------------------*/
    getList_DoiTuong: function (strChuongTrinh_Id) {
        var me = this;
        var obj = {
            strMaBangDanhMuc: "QLSV.DOITUONG"
        };
        edu.system.getList_DanhMucDulieu(obj, "", "", me.cbGenTreejs_DoiTuong);
    },
    /*------------------------------------------
    --Discription: [4] GEN HTML DoiTuong
    --ULR:  
    -------------------------------------------*/
    cbGenTreejs_DoiTuong: function (data) {
        var me = main_doc.HeSoDoiTuong;
        var strDoiTuong_Text = "";

        me.strDoiTuong_Id = "";
        me.dtDoiTuong = data;
        me.cbGenComBo_DoiTuong(data);
        //1. Gen
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_treejs_hsdt"]
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_treejs_hsdt').on("select_node.jstree", function (e, data) {
            me.strDoiTuong_Id = data.node.id;
            strDoiTuong_Text = data.node.li_attr.title;//title --> full info, text --> a part infor (30 characters).
            //2.1 call main action
            me.getList_HeSoDoiTuong();
            //2.2 bind text
            edu.util.viewHTMLById("lblDoiTuong", strDoiTuong_Text);
            //3.active on dropDoiTuong
            $("#dropDoiTuong_HSDT").val(me.strDoiTuong_Id).trigger("change");

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
        });
    },
    cbGenComBo_DoiTuong: function (data) {
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
            renderPlace: ["dropDoiTuong_HSDT"],
            type: "",
            title: "Chọn đối tượng",
        }
        edu.system.loadToCombo_data(obj);
    },
}