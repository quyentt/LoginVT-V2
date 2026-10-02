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
function HocPhan() { };
HocPhan.prototype = {
    strHocPhan_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtCot: [],
    dtHocPhan: '',//danh sach hoc phan

    init: function () {
        var me = this;

        me["strThead"] = $("#tblHocPhan thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //me.getList_HocPhan();
        me.getList_CoCauToChuc();
        me.getList_MonHoc();
        me.getList_LoaiDiem();
        me.getList_CotDuLieu();
        me.getList_ThoiGianDaoTao();
        //me.getList_HocPhan_PhanBo();

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
            if (edu.util.checkValue(me.strHocPhan_Id)) {
                me.update_HocPhan();
            }
            else {
                me.save_HocPhan();
            }
        });

        $("#tblHocPhan").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strHocPhan_Id = strId;
                me.getDetail_HocPhan(strId, constant.setting.ACTION.EDIT);
                me.getList_HocPhan_PhanBo();
                edu.util.setOne_BgRow(strId, "tblHocPhan");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }

            //var strId = this.id;
            //me.toggle_form();
            //me.strHocPhan_Id = strId;
            //me.getDetail_HocPhan(strId);
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
        edu.system.getList_MauImport("zonebtnHPC");


        $("#tblHocPhan").delegate(".chkSelectAll", "click", function (e) {
            e.stopImmediatePropagation();
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            console.log(strClass);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblHocPhan").delegate("#chkSelectAllTable", "click", function (e) {
            var checked_status = $(this).is(':checked');
            $("#tblHocPhan tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });

        $("#tblHocPhan").delegate(".btnCTHocPhan", "click", function (e) {
            var strId = this.id;
            me["strSuaCT_Id"] = strId;
            $("#myModal_SuaCT").modal("show");
            $("#txtSuaCT").val($(this).html());
        });
        $("#btnSave_SuaCT").click(function () {
            me.save_SuaCT();
        });
        $("#btnSaveHocPhan").click(function () {
            $("#tblHocPhan_Add tbody tr").each(function () {
                var strHocPhan_Id = this.id;
                var check = $("#txtCT" + strHocPhan_Id).val();
                if (check && $("#tblHocPhan_Add #checkX" + strHocPhan_Id).is(":checked")){
                    me.save_AddCT(strHocPhan_Id, check);
                }
            });
        });
        $("#btnDienTuDong").click(function () {
            $("#tblHocPhan_Add tbody .form-control").each(function () {
                var strHocPhan_Id = this.id;
                var check = $(this).val();
                $(this).val($("#txtSearch_DienTuDong").val())
            });
        });

        $("#btnAdd_HocPhan").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_input_HocPhan");
        });
        $("#btnDelete_HocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "chk_");
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
        $("#wrapperadmiss").append('<style>.deleteRowButton { display: none; }</style>');
        //const topScrollbar = document.querySelector('.scrollbar-top');
        //const scrollContent = document.querySelector('.scroll-content');

        //topScrollbar.addEventListener('scroll', () => {
        //    scrollContent.scrollLeft = topScrollbar.scrollLeft;
        //});

        //scrollContent.addEventListener('scroll', () => {
        //    topScrollbar.scrollLeft = scrollContent.scrollLeft;
        //});
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HocPhan");
        this.getList_HangDuLieu();
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_HocPhan");
        $("#tblHocPhan_PhanBo tbody").html("");
        for (var i = 0; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            main_doc.HocPhan.genHTML_PhanBo(id, "");
        }
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strHocPhan_Id = "";
        //edu.util.viewValById("dropBoMon", edu.util.getValById('dropSearch_BoMon'));
        edu.util.viewValById("dropMonHoc", "");
        edu.util.viewValById("dropThuocTinhHocPhan", "");
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
        var me = main_doc.HocPhan;


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
        var me = main_doc.HocPhan;
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
        var me = main_doc.HocPhan;
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
    
    getList_LoaiDiem: function () {
        var me = this;
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4BRIVKSAvKREpIC8VCgkR',
            'func': 'pkg_diem_thongtin.LayDSThanhPhanTKHP',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_LoaiDiem(data);
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
    genCombo_LoaiDiem: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_LoaiDiem"],
            title: "Chọn loại điểm"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_CotDuLieu: function () {
        var me = this;
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4BRIqGB4CLi8mFSk0IgUoJCweESkgLBcoCREP',
            'func': 'pkg_diem_thongtin.LayDSkY_CongThucDiem_PhamViHP',
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
        html += '<th>Học trình</th>';
        html += '<th>Đơn vị</th>';

        for (var i = 0; i < data.length; i++) {
            html += '<th class="td-center">' + data[i].THOIGIAN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + data[i].ID + '"></th>';
        }
        html += '<th class="td-center">Tất cả <input type="checkbox" id="chkSelectAllTable"></th>';
        html += '</tr>';
        $("#tblHocPhan thead").html(html);

    },
    getList_HangDuLieu: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin2_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
            'func': 'PKG_KEHOACH_THONGTIN2.LayDSKS_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropSearch_MonHoc'),
            'strThuocBoMon_Id': edu.util.getValById('dropSearch_BoMon'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropSearch_ThuocTinhHocPhan'),
            'dMonChuaKhaiCongThuc': $('#dLocMonChuaKhaiCongThuc').is(":checked") ? 1 : 0,
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
            strTable_Id: "tblHocPhan_Add",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhan.getList_HangDuLieu()",
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
                        return '<input type="text" id="txtCT' + aData.ID + '" class="form-control">';
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
        var strTable_Id = "tblHocPhan";
        var arrDoiTuong = me.dtCot;
        me.dtDoiTuong_View = arrDoiTuong;
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhan.getList_HangDuLieu()",
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
                        return '<span type="text" id="txtCT_' + aData.ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID +'" class="form-control btn btnCTHocPhan"></span> <input type="checkbox" id="chk_' + aData.ID + '_' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + '"  class="checkPhanQuyenDiemLQL check' + main_doc.HocPhan.dtDoiTuong_View[iThuTu].ID + ' check' + aData.ID + '" />';
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
            'action': 'D_ThongTin_MH/DSA4FRUFKCQsHgIVBR4ABR4RKSAsFygP',
            'func': 'pkg_diem_thongtin.LayTTDiem_CTD_AD_PhamVi',
            'iM': edu.system.iM,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strDaoTao_ThoiGianDaoTao_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data.Data.forEach(aData => {
                        $("#txtCT_" + strPhamViApDung_Id + "_" + strDaoTao_ThoiGianDaoTao_Id).html(edu.util.returnEmpty(aData.DIEM_CONGTHUCDIEM_XAU));
                        $("#txtCT_" + strPhamViApDung_Id + "_" + strDaoTao_ThoiGianDaoTao_Id).attr("name", edu.util.returnEmpty(aData.DIEM_THANHPHANDIEM_ID))
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
            'action': 'D_ThongTin_MH/FSkkLB4FKCQsHgIuLyYVKTQiBSgkLB4ABQPP',
            'func': 'pkg_diem_thongtin.Them_Diem_CongThucDiem_AD',
            'iM': edu.system.iM,
            'strMa': edu.util.getValById('txtSuaCT'),
            'strTen': edu.util.getValById('txtSuaCT'),
            'strXauCongThuc': edu.util.getValById('txtSuaCT'),
            'strDiem_ThanhPhanDiem_Id': $("#" + me.strSuaCT_Id).attr("name"),
            'dThuTu': 1,
            'dSoThanhPhanToiThieu': 0,
            'dTongHopKhiDuDiem': 0,
            'strDaoTao_ThoiGianDaoTao_Id': arrId[2],
            'strNgayApDung': edu.util.getValById('txtAAAA'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': arrId[1],
            'strDiem_CongThucDiem_Id': edu.util.getValById('dropAAAA'),
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

                me.getList_HangDuLieu();
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
    save_AddCT: function (strPhamViApDung_Id, strCT) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_ThongTin_MH/FSkkLB4FKCQsHgIuLyYVKTQiBSgkLB4ABQPP',
            'func': 'pkg_diem_thongtin.Them_Diem_CongThucDiem_AD',
            'iM': edu.system.iM,
            'strMa': strCT,
            'strTen': strCT,
            'strXauCongThuc': strCT,
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'dThuTu': 1,
            'dSoThanhPhanToiThieu': 0,
            'dTongHopKhiDuDiem': 0,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNgayApDung': edu.util.getValById('txtAAAA'),
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDiem_CongThucDiem_Id': edu.util.getValById('dropAAAA'),
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

                me.getList_HangDuLieu();
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
            'action': 'D_ThongTin_MH/GS4gHgUoJCweAi4vJhUpNCIFKCQsHgAF',
            'func': 'pkg_diem_thongtin.Xoa_Diem_CongThucDiem_AD',
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