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
    dtHocPhan: '',//danh sach hoc phan

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_HocPhan();
        me.getList_MonHoc();
        me.getList_CoCauToChuc();
        //me.getList_HocPhan_PhanBo();

        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_HocPhan();
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
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strHocPhan_Id)) {
                me.update_HocPhan();
            }
            else {
                me.save_HocPhan();
            }
            me.rewrite();
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
        $("#tblHocPhan").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_HocPhan(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSearch").click(function () {
            me.getList_HocPhan();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhan();
            }
        });
        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropSearch_MonHoc").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropSearch_ThuocTinhHocPhan").on("select2:select", function () {
            me.getList_HocPhan();
        });

        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_MonHoc();
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_HocPhan(arrChecked_Id.toString());
            });
        });
        $("#tblHocPhan").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblHocPhan", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAIPHANBO", "dropHocPhan_PhanBo");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.BOMON", "dropBoMon");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.TTHP", "dropThuocTinhHocPhan, dropSearch_ThuocTinhHocPhan");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAIPHANBO", "", "", me.cbGetList_HocPhan_PhanBo);
        edu.system.loadToCombo_DanhMucDuLieu("DAOTAO.LOAIHOCPHAN", "dropLoaiHocPhan");

        /*------------------------------------------
        --Discription: Zone học phần - bài học
        --Discription:
        -------------------------------------------*/
        $("#btnAdd_HocPhan_PhanBo").click(function () {
            me.save_HocPhan_PhanBo();
        });
        $("#tblInput_HocPhan_PhanBo").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HocPhan_PhanBo(id);
            });
        });
        $("#tblHocPhan_PhanBo").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHocPhan_PhanBo tr[id='" + strRowId + "']").remove();
        });
        $("#btnThemDong_PhanBo").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_PhanBo(id, "");
        });
        $("#zone_input_HocPhan").delegate(".deletePhanBo", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HocPhan_PhanBo(strId);
            });
        });

        edu.system.getList_MauImport("zonebtnHP");
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_HocPhan");
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
        edu.util.viewValById("dropLoaiHocPhan", "");
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtTenTA", "");
        edu.util.viewValById("txtHocTrinhTinhPhi", "");
        edu.util.viewValById("txtHocTrinh", "");
        edu.util.viewValById("txtKyHieu", "");
        edu.util.viewValById("dropLaMonTinhDiem", 1);
    },

    save_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eCS4iESkgLwPP',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strLoaiHocPhan_Id': edu.util.getValById('dropLoaiHocPhan'),
            'strId': '',
            'strTen': edu.util.getValById("txtTen"),
            'strMa': edu.util.getValById("txtMa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropMonHoc"),
            'dHocTrinh': edu.util.getValById("txtHocTrinh") ? edu.util.getValById("txtHocTrinh"): -1,
            'strThuocBoMon_Id': edu.util.getValById("dropBoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropThuocTinhHocPhan"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dLaMonTinhDiem': edu.util.getValById("dropLaMonTinhDiem") ? edu.util.getValById("dropLaMonTinhDiem") : -1,
            'strTenTA': edu.util.getValById('txtTenTA'),
            'dHocTrinhTinhPhi': edu.util.getValById('txtHocTrinhTinhPhi') ? edu.util.getValById("txtHocTrinhTinhPhi") : -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strHocPhan_Id = data.Id;
                    if (me.strHocPhan_Id == "") {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                    }
                    $("#tblHocPhan_PhanBo tbody tr").each(function () {
                        var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                        me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                    });

                    me.getList_HocPhan();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            //success: function (data) {
                //if (data.Success) {
                //    var strHocPhan_Id = data.Id;
                //    if (me.strHocPhan_Id == "") {
                //        edu.system.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?');
                //        $("#btnYes").click(function (e) {
                //            me.rewrite();
                //            $('#myModalAlert').modal('hide');                            
                //        });
                //        $("#tblHocPhan_PhanBo tbody tr").each(function () {
                //            var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                //            me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                //        });
                //        me.getList_HocPhan();
                //    }                    
                //}
                //else {
                //    edu.system.alert(obj_save.action + ": " + data.Message);
                //}
            //},
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    update_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4JLiIRKSAv',
            'func': 'pkg_kehoach_thongtin.Sua_DaoTao_HocPhan',
            'iM': edu.system.iM,
            'strLoaiHocPhan_Id': edu.util.getValById('dropLoaiHocPhan'),
            'strId': me.strHocPhan_Id,
            'strTen': edu.util.getValById("txtTen"),
            'strMa': edu.util.getValById("txtMa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropMonHoc"),
            'dHocTrinh': edu.util.getValById("txtHocTrinh") ? edu.util.getValById("txtHocTrinh") : -1,
            'strThuocBoMon_Id': edu.util.getValById("dropBoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropThuocTinhHocPhan"),
            'strKyHieu': edu.util.getValById("txtKyHieu"),
            'dLaMonTinhDiem': edu.util.getValById("dropLaMonTinhDiem") ? edu.util.getValById("dropLaMonTinhDiem") : -1,
            'strTenTA': edu.util.getValById('txtTenTA'),
            'dHocTrinhTinhPhi': edu.util.getValById('txtHocTrinhTinhPhi') ? edu.util.getValById("txtHocTrinhTinhPhi") : -1,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    strHocPhan_Id = me.strHocPhan_Id;
                    me.getList_HocPhan();
                    $("#tblHocPhan_PhanBo tbody tr").each(function () {
                        var strPhanBo_Id = this.id.replace(/rm_row/g, '');
                        me.save_HocPhan_PhanBo(strPhanBo_Id, strHocPhan_Id);
                    });
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan: function () {
        var me = main_doc.HocPhan;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropSearch_MonHoc"),
            'strThuocBoMon_Id': edu.util.getValById("dropSearch_BoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropSearch_ThuocTinhHocPhan"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    getDetail_HocPhan: function (strId) {
        var me = main_doc.HocPhan;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_HocPhan/LayChiTiet',

            'strId': strId
        };


        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_HocPhan(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HocPhan: function (Ids) {
        var me = main_doc.HocPhan;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan/Xoa',

            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocPhan();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HocPhan: function (data, iPager) {
        var me = main_doc.HocPhan;
        $("#lblHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HocPhan.getList_HocPhan()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 6, 7, 8],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên học phần: ' + edu.util.returnEmpty(aData.TEN) + "</span><br />";
                //        html += '<span>' + 'Số tín chỉ: ' + edu.util.returnEmpty(aData.HOCTRINH) + "</span><br />";
                //        html += '<span>' + 'Thuộc tính học phần: ' + edu.util.returnEmpty(aData.THUOCTINHHOCPHAN_TEN) + "</span><br />";
                //        html += '<span>' + 'Thuộc bộ môn: ' + edu.util.returnEmpty(aData.THUOCBOMON_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "THUOCBOMON_TEN"
                },
                {
                    "mDataProp": "HOCPHANSUDUNGTRONGCTDT"
                },
                {
                    "mDataProp": "DAOTAO_MONHOC_TEN"
                },
                {
                    "mDataProp": "THUOCTINHHOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_HocPhan: function (data) {
        var me = main_doc.HocPhan;
        //call popup --Edit
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("dropMonHoc", data.DAOTAO_MONHOC_ID);
        edu.util.viewValById("txtHocTrinh", data.HOCTRINH);
        edu.util.viewValById("dropBoMon", data.THUOCBOMON_ID);
        edu.util.viewValById("dropThuocTinhHocPhan", data.MA);
        edu.util.viewValById("txtKyHieu", data.KYHIEU);
        edu.util.viewValById("dropLaMonTinhDiem", data.LAMONTINHDIEM);
        edu.util.viewValById("dropThuocTinhHocPhan", data.THUOCTINHHOCPHAN_ID);
        edu.util.viewValById("txtTenTA", data.TENTA);
        edu.util.viewValById("txtHocTrinhTinhPhi", data.HOCTRINHTINHPHI);
        edu.util.viewValById("dropLoaiHocPhan", data.LOAIHOCPHAN_ID);
        me.getList_HocPhan_PhanBo();
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
    /*------------------------------------------
    --Discription: [3] AccessDB HocPhan_baiHoc
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan_PhanBo: function (strPhanBo_Id, strHocPhan_Id) {
        var me = this;
        //--Edit
        var strId = strPhanBo_Id;
        var strLoaiPhanBo_Id = edu.util.getValById('dropHocPhan_PhanBo' + strPhanBo_Id);
        var dSoTiet = edu.util.getValById('txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id);
        if (!edu.util.checkValue(strPhanBo_Id)) {
            return;
        }
        if (strId.length == 30) strId = "";
        var obj_notify;
        var obj_save = {
            'action': 'KHCT_HocPhan_PhanBo/ThemMoi',


            'strId': strId,
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strLoaiPhanBo_Id': strLoaiPhanBo_Id,
            'dSoTiet': dSoTiet,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'KHCT_HocPhan_PhanBo/CapNhat';
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Success) {
                        if (strId == "") {
                            strId = data.Id;
                        }
                    }
                    else {
                        edu.system.alert(obj_save + ": " + data.Message);
                    }
                }
            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan_PhanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan_PhanBo/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strLoaiPhanBo_Id': '',
            'strNguoiThucHien_Id': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhan_PhanBo(dtReRult);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_HocPhan_PhanBo: function (data) {
        var me = this;
        $("#tblHocPhan_PhanBo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strPhanBo_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strPhanBo_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strPhanBo_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHocPhan_PhanBo' + strPhanBo_Id + '" class="select-opt"><option value=""> --- Chọn loại phân bổ--</option ></select ></td>';
            row += '<td><input type="text" id="txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id + '" value="' + edu.util.returnEmpty(data[i].SOTIET) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deletePhanBo" id="' + strPhanBo_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHocPhan_PhanBo tbody").append(row);
            me.genComBo_PhanBo("dropHocPhan_PhanBo" + strPhanBo_Id, data[i].LOAIPHANBO_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_PhanBo(id, "");
        }
        edu.system.pickerdate("input-datepicker_GiaHan");
    },
    genHTML_PhanBo: function (strPhanBo_Id) {
        var me = this;
        var iViTri = document.getElementById("tblHocPhan_PhanBo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strPhanBo_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strPhanBo_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHocPhan_PhanBo' + strPhanBo_Id + '" class="select-opt"><option value=""> --- Chọn loại phân bổ--</option ></select ></td>';
        row += '<td><input type="text" id="txtHocPhan_PhanBo_SoTiet' + strPhanBo_Id + '"  class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strPhanBo_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblHocPhan_PhanBo tbody").append(row);
        me.genComBo_PhanBo("dropHocPhan_PhanBo" + strPhanBo_Id, "");
    },
    cbGetList_HocPhan_PhanBo: function (data) {
        main_doc.HocPhan.dtPhanBo = data;
    },
    genComBo_PhanBo: function (strPhanBo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtPhanBo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strPhanBo_Id],
            type: "",
            title: "Chọn loại phân bổ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strPhanBo_Id).select2();
    },
    delete_HocPhan_PhanBo: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HocPhan_PhanBo/Xoa',

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HocPhan_PhanBo();
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //genTable_HocPhan_PhanBo: function (data) {
    //    var me = this;
    //    $("#tblInput_HocPhan_PhanBo tbody").html("");
    //    var row = "";
    //    for (var i = 0; i < data.length; i++) {
    //        row += '<tr>';
    //        row += '<td>';
    //        row += 'Loại phân bổ<span class="title-colon">:</span>';
    //        row += '</td>';
    //        row += '<td>';
    //        row += data[i].LOAIPHANBO_TEN;
    //        row += '</td>';
    //        row += '<td>';
    //        row += 'Số tiết<span class="title-colon">:</span>';
    //        row += '</td>';
    //        row += '<td>';
    //        row += data[i].SOTIET;
    //        row += '</td>';
    //        row += '<td class="td-fixed td-center">';
    //        row += '<a id="' + data[i].ID + '" class="btnDeletePoiter poiter pull-right">';
    //        row += '<i class="fa fa-trash"></i>';
    //        row += '</a>';
    //        row += '</td>';
    //        row += '</tr>';
    //    }
    //    $("#tblInput_HocPhan_PhanBo tbody").append(row);
    //},
}