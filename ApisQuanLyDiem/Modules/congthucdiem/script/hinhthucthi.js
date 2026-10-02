/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 19/04/2019
--Input: 
--Output:
--API URL: NoiDungChuongTrinh/HocPhan
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function HinhThucThi() { };
HinhThucThi.prototype = {
    strHinhThucThi_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtCot: [],
    dtHinhThucThi: '',//danh sach hoc phan
    dtHinhThuc: [],//danh sach hoc phan

    init: function () {
        var me = this;

        me["strThead"] = $("#tblHinhThucThi thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HinhThuc();
        //me.getList_HinhThucThi();
        me.getList_CoCauToChuc();
        me.getList_MonHoc();
        me.getList_CotDuLieu();
        me.getList_ThoiGianDaoTao();
        //me.getList_HinhThucThi_PhanBo();

        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_HangDuLieu();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strHinhThucThi_Id)) {
                me.update_HinhThucThi();
            }
            else {
                me.save_HinhThucThi();
            }
        });

        $("#tblHinhThucThi").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHinhThucThi_Id = strId;
                me.getDetail_HinhThucThi(strId, constant.setting.ACTION.EDIT);
                me.getList_HinhThucThi_PhanBo();
                edu.util.setOne_BgRow(strId, "tblHinhThucThi");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }

            //var strId = this.id;
            //me.toggle_form();
            //me.strHinhThucThi_Id = strId;
            //me.getDetail_HinhThucThi(strId);
            //return false;
        });

        $("#btnSearch").click(function () {
            me.getList_HangDuLieu();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HangDuLieu();
            }
        });
        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_HangDuLieu();
        });
        $("#dropSearch_MonHoc").on("select2:select", function () {
            me.getList_HangDuLieu();
        });
        $("#dropSearch_ThuocTinhHocPhan").on("select2:select", function () {
            me.getList_HangDuLieu();
        });

        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_MonHoc();
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.BOMON", "dropBoMon");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.TTHP", "dropThuocTinhHocPhan, dropSearch_ThuocTinhHocPhan");

        /*------------------------------------------
        --Discription: Zone học phần - bài học
        --Discription:
        -------------------------------------------*/
        edu.system.getList_MauImport("zonebtnHP");
        edu.system.getList_MauImport("zonebtnHTT");


        $("#tblHinhThucThi").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            console.log(strClass);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblHinhThucThi").delegate("#chkSelectAllTable", "click", function (e) {
            var checked_status = $(this).is(':checked');
            $("#tblHinhThucThi tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });

        $("#tblHinhThucThi").delegate(".btnCTHinhThucThi", "click", function (e) {
            var strId = this.id;
            me["strSuaCT_Id"] = strId;
            $("#myModal_SuaCT").modal("show");
            $("#dropHinhThuc").val($(this).attr("name")).trigger("change");
            $("#txtThoiGianThi").val($(this).attr("tgt"))
        });
        $("#btnSave_SuaCT").click(function () {
            me.save_SuaCT();
        });
        $("#btnSaveHinhThucThi").click(function () {
            $("#tblHinhThucThi_Add tbody tr").each(function () {
                var strHinhThucThi_Id = this.id;
                var check = $("#dropHinhThuc_" + strHinhThucThi_Id).val();
                let strThoiGian = $("#txtThoiGianThi_" + strHinhThucThi_Id).val();

                if (check && $("#tblHinhThucThi_Add #checkX" + strHinhThucThi_Id).is(":checked")){
                    me.save_AddCT(strHinhThucThi_Id, check, strThoiGian);
                }
            });
        });
        $("#btnDienTuDong").click(function () {
            $("#tblHinhThucThi_Add select").each(function () {
                $(this).val($("#dropSearch_HinhThuc").val()).trigger("change");
            });
            $("#tblHinhThucThi_Add input").each(function () {
                $(this).val($("#txtSearch_DienTuDong_TGT").val())
            });
        });

        $("#btnAdd_HinhThucThi").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_input_HinhThucThi");
        });
        $("#btnDelete_HinhThucThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHinhThucThi", "chk_");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SuaCT($("#chk_" + arrChecked_Id[i]).attr("name"));
                }
            });
        });
        $(".deleteRowButton").css({ display: 'none' })
        //$("#wrapperadmiss").append('<style>.deleteRowButton { display: none; }</style>');
        
        //$(document).delegate('.thutunguyenvong', 'focus', function () {$(this).prop('readonly', true);});
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HinhThucThi");
        this.getList_HangDuLieu();
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_HinhThucThi");
        $("#tblHinhThucThi_PhanBo tbody").html("");
        for (var i = 0; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.HinhThucThi.genHTML_PhanBo(id, "");
        }
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strHinhThucThi_Id = "";
        //edu.util.viewValById("dropBoMon", edu.util.getValById('dropSearch_BoMon'));
        edu.util.viewValById("dropMonHoc", "");
        edu.util.viewValById("dropThuocTinhHinhThucThi", "");
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtTenTA", "");
        edu.util.viewValById("txtHocTrinhTinhPhi", "");
        edu.util.viewValById("txtHocTrinh", "");
        edu.util.viewValById("txtKyHieu", "");
        edu.util.viewValById("dropLaMonTinhDiem", 1);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> Mon hoc
    --Author: duyentt
	-------------------------------------------*/
    getList_MonHoc: function () {
        var me = main_doc.HinhThucThi;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_MonHoc(dtResult);
                }
                else {
                    edu.system.alert("KHCT_MonHoc/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_MonHoc/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_MonHoc/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strThuocBoMon_Id': edu.util.getValById("dropSearch_BoMon"),
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_MonHoc: function (data) {
        var me = main_doc.HinhThucThi;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropMonHoc", "dropSearch_MonHoc"],
            title: "Chọn môn học"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> CCTC
    --Author: duyentt
	-------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.HinhThucThi;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropBoMon", "dropSearch_BoMon"],
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_ThoiGianDaoTao: function () {
        var me = this;

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenCombo_ThoiGianDaoTao(data.Data);
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropSearch_ThoiGian", "dropThoiGian"],
            type: "",
            title: "Chọn kỳ, đợt áp dụng",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_HinhThuc: function () {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIVKSgeCSgvKRUpNCIVKSgP',
            'func': 'pkg_diem_chung.LayDSThi_HinhThucThi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me["dtHinhThuc"] = data;
                    me.genCombo_HinhThuc(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            async: false,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HinhThuc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_HinhThuc","dropHinhThuc"],
            title: "Chọn hình thức"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_CotDuLieu: function () {
        var me = this;
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4BRIqGB4JKC8pFSk0IhUpKB4RKSAsFygJEQPP',
            'func': 'pkg_diem_thongtin.LayDSkY_HinhThucThi_PhamViHP',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me["dtCot"] = data.Data;
                    me.genData_CotDuLieu(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
                me.getList_HangDuLieu();
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genData_CotDuLieu: function (data) {
        var me = this;
        me.dtCot = data;
        var html = '<tr>';
        html += '<th>Stt</th>';
        html += '<th>Mã học phần</th>';
        html += '<th>Tên học phần</th>';
        html += '<th>Số tín chỉ</th>';
        html += '<th>Đơn vị</th>';

        for (var i = 0; i < data.length; i++) {
            html += '<th class="td-center">' + data[i].THOIGIAN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data[i].ID + '"></th>';
        }
        html += '<th class="td-center">Tất cả <input type="checkbox" id="chkSelectAllTable"></th>';
        html += '</tr>';
        $("#tblHinhThucThi thead").html(html);
    },
    getList_HangDuLieu: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropSearch_MonHoc'),
            'strThuocBoMon_Id': edu.util.getValById('dropSearch_BoMon'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropSearch_ThuocTinhHocPhan'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtHangDuLieu"] = data.Data;
                    me.genTable_HangDuLieu(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTable_HangDuLieu: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblHinhThucThi_Add",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HinhThucThi.getList_HangDuLieu()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<select id="dropHinhThuc_' + aData.ID + '" class="select-opt selectupdate"></select>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtThoiGianThi_' + aData.ID + '" class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var arrDrop = [];
        data.forEach(e => {
            arrDrop.push('dropHinhThuc_' + e.ID);

        });
        $(".selectupdate").select2();
        console.log(me.dtHinhThuc)
        var obj = {
            data: me.dtHinhThuc,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: arrDrop,
            title: "Chọn hình thức"
        };
        edu.system.loadToCombo_data(obj);

        var strTable_Id = "tblHinhThucThi";
        var arrDoiTuong = me.dtCot;
        me.dtDoiTuong_View = arrDoiTuong;
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HinhThucThi.getList_HangDuLieu()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        //return '<div id="lbl_' + aData.ID + '_' + main_doc.PhanQuyenDiemLQL.dtDoiTuong_View[iThuTu].THANHPHAN_ID + '"></div>';
                        return '<span type="text" id="txtCT_' + aData.ID + '_' + main_doc.HinhThucThi.dtDoiTuong_View[iThuTu].ID +'" class="form-control btn btnCTHinhThucThi"></span> <input type="checkbox" id="chk_' + aData.ID + '_' + main_doc.HinhThucThi.dtDoiTuong_View[iThuTu].ID + '"  class="checkPhanQuyenDiemLQL check' + main_doc.HinhThucThi.dtDoiTuong_View[iThuTu].ID + ' check' + aData.ID + '" />';
                    }
                }
            );
            jsonForm.colPos.center.push((jsonForm.aoColumns.length))
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    //return '<span>A</span>';
                    return '<input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + aData.ID + '"/>';
                }
            }
        );
        jsonForm.colPos.center.push((jsonForm.aoColumns.length))
        console.log(jsonForm.colPos.center)
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.dtCot.forEach(ele => me.getList_KetQua_BangDuLieu(e.ID, ele.ID)));

    },

    getList_KetQua_BangDuLieu: function (strPhamViApDung_Id, strDaoTao_ThoiGianDaoTao_Id) {
        var me = this;
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4FRUFKCQsHgkVFQkIHgAFHhEpICwXKAPP',
            'func': 'pkg_diem_thongtin.LayTTDiem_HTTHI_AD_PhamVi',
            'iM': edu.system.iM,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data.Data.forEach(aData => {
                        $("#txtCT_" + strPhamViApDung_Id + "_" + strDaoTao_ThoiGianDaoTao_Id).html(edu.util.returnEmpty(aData.HINHTHUCTHI_TEN) + " - " + edu.util.returnEmpty(aData.THOIGIANTHI));
                        $("#txtCT_" + strPhamViApDung_Id + "_" + strDaoTao_ThoiGianDaoTao_Id).attr("name", edu.util.returnEmpty(aData.THI_HINHTHUCTHI_ID))
                        $("#txtCT_" + strPhamViApDung_Id + "_" + strDaoTao_ThoiGianDaoTao_Id).attr("tgt", edu.util.returnEmpty(aData.THOIGIANTHI))
                        $("#chk_" + strPhamViApDung_Id + "_" + strDaoTao_ThoiGianDaoTao_Id).attr("name", edu.util.returnEmpty(aData.ID))
                    })
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_SuaCT: function () {
        var me = this;
        var arrId = me.strSuaCT_Id.split('_');
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin_MH/FSkkLB4FKCQsHgkoLykVKTQiFSkoHgAF',
            'func': 'pkg_diem_thongtin.Them_Diem_HinhThucThi_AD',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': arrId[2],
            'strPhamViApDung_Id': arrId[1],
            'strThi_HinhThucThi_Id': edu.util.getValById('dropHinhThuc'),
            'strThoiGianThi': edu.system.getValById('txtThoiGianThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'XLHV_ThongTin_MH/EjQgHhkNCRceCiQJLiAiKRk0DTgP';
        //    obj_save.func = 'pkg_xulyhocvu_thongtin.Sua_XLHV_KeHoachXuLy'
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    $("#myModal_SuaCT").modal("hide");
                    edu.system.alert("Thực hiện thành công");
                    me.getList_HangDuLieu();
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_AddCT: function (strPhamViApDung_Id, strThi_HinhThucThi_Id, strThoiGianThi) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin_MH/FSkkLB4FKCQsHgkoLykVKTQiFSkoHgAF',
            'func': 'pkg_diem_thongtin.Them_Diem_HinhThucThi_AD',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strThi_HinhThucThi_Id': strThi_HinhThucThi_Id,
            'strThoiGianThi': strThoiGianThi,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'XLHV_ThongTin_MH/EjQgHhkNCRceCiQJLiAiKRk0DTgP';
        //    obj_save.func = 'pkg_xulyhocvu_thongtin.Sua_XLHV_KeHoachXuLy'
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    $("#myModal_SuaCT").modal("hide");
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                //me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_SuaCT: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin_MH/GS4gHgUoJCweCSgvKRUpNCIVKSgeAAUP',
            'func': 'pkg_diem_thongtin.Xoa_Diem_HinhThucThi_AD',
            'iM': edu.system.iM,
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HangDuLieu();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}