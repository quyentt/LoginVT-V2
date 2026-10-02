/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function QuanLyHoSo() { };
QuanLyHoSo.prototype = {
    strQuanLyHoSo_Id: '',
    dtQuanLyHoSo: [],
    strHead: '',
    dtTruongThongTin: [],
    dtMon: [],
    strPath: '',

    init: function () {

        var me = this;
        me.strHead = $("#tblQuanLyHoSo thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_QuanLyHoSo();
        me.getList_KeHoachTuyenSinh();
        me.getList_Nam();
        //me.getList_DotDoiTuong();
        me.getList_TruongThongTin();
        //me.getList_HeDaoTao();
        //me.getList_KhoaDaoTao();
        //me.getList_Nam();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form_input();
        });
        $("#btnThemNguyenVong").click(function () {
            me.getUrl_NguyenVong();
        });

        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_HeDaoTao();
            me.getList_KhoaDaoTao();
            me.getList_QuanLyHoSo();
            me.getList_DotDoiTuong();
            me.getList_TruongThongTin();
        });
        $("#dropSearch_Dot").on("select2:select", function () {
            me.getList_TruongThongTin();
        });
        $(".btnSearch").click(function () {
            me.getList_QuanLyHoSo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_QuanLyHoSo();

            }
        });
        $("#tblQuanLyHoSo").delegate('.btnChiTietDuTuyen', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_Mon(this.id);
        });
        if (typeof (configTS) == "function") {
            me.strPath = configTS().path;
        } else {
            me.strPath = edu.system.strhost;
        }

        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanLyHoSo" });
        });
        $("#btnXoaQuanLyHoSo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyHoSo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuanLyHoSo(arrChecked_Id[i]);
                }
            });
        });
        $("#tblQuanLyHoSo").delegate('.btnLichSu', 'click', function (e) {
            $('#myModalLichSu').modal('show');
            me.getList_LichSu(this);
        });
        $(".btnDownloadAllFile").click(function () {
            var arrFile = [];
            var arrFileName = [];
            me.dtQuanLyHoSo.forEach(e => {
                $('#tblQuanLyHoSo tr[id=' + e.ID + '] .upload-file').each(function () {
                    var url = $(this).attr("name");
                    arrFile.push(url);
                    arrFileName.push($(this).attr("title"));
                });
                $('#tblQuanLyHoSo tr[id=' + e.ID + '] .upload-img').each(function () {
                    var url = $(this).attr("name");
                    arrFile.push(url);
                    arrFileName.push($(this).attr("title"));
                });
            });
        
            me.save_GopFile(arrFile, arrFileName);
        });
        edu.system.getList_MauImport("zonebtnBaoCao_QLHoSo", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuanLyHoSo", "checkX");
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
                'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
                'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
                'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
                'strNam': edu.util.getValById('dropSearch_Nam'),
                'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            arrChecked_Id.forEach(e => addKeyValue("strTS_HoSoDuTuyen_Id", e));
        });
    },

    getList_QuanLyHoSo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThongTin_Chung/LayDSTS_HoSoDuTuyen',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strNam': edu.util.getValById('dropSearch_Nam'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
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
                    me.dtQuanLyHoSo = dtResult;
                    me.genTable_QuanLyHoSo(dtResult, iPager);
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
    genTable_QuanLyHoSo: function (data, iPager) {
        var me = this;
        $("#lblQuanLyHoSo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanLyHoSo",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyHoSo.getList_QuanLyHoSo()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"

                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "NGANHNGHE_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "NGUOITAO_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnLichSu" id="' + aData.ID + '" title="">Lịch sử</a></span>';
                    }
                },
                {
                    "mDataProp": "DSNGUYENVONGTHEOKEHOACH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietDuTuyen" id="' + aData.ID + '" title="">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "TONGTIENPHAINOP"
                },
                {
                    "mDataProp": "TONGTIENDANOP"
                }
                //,
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                //    }
                //},
            ]
        };
        me.dtTruongThongTin.forEach(e => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    return '<span id="tt_' + aData.ID + '_' + main_doc.QuanLyHoSo.dtTruongThongTin[edu.system.icolumn++].ID + '"></span>';
                }
            });
        });
        jsonForm.aoColumns.push({
                "mDataProp": "TONGTIENDANOP1"
            }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" href="' + me.strPath + '/pages/tuyensinh.aspx?userId=' + edu.system.userId + '&strSinhVien_Id=' + aData.ID + '" id="' + aData.ID + '"  target="_blank" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
            }, {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            });
        edu.system.loadToTable_data(jsonForm);
        me.dtTruongThongTin.forEach(e => data.forEach(ele => me.getData_HoSo(e.ID, ele.ID, e.KIEUDULIEU)));

        /*III. Callback*/
    },
    getData_HoSo: function (strTruongThongTin_Id, strTS_HoSoTuyenSinh_Id, strKieuDuLieu) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_TaiKhoan/LayKQTS_KeHoach_DuLieu',
            'type': 'GET',
            'strTruongThongTin_Id': strTruongThongTin_Id,
            'strTS_HoSoTuyenSinh_Id': strTS_HoSoTuyenSinh_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    dtResult.forEach(e => {
                        if (strKieuDuLieu == "FILE") {
                            edu.system.viewFiles("tt_" + strTS_HoSoTuyenSinh_Id + '_' + strTruongThongTin_Id, strTS_HoSoTuyenSinh_Id + strTruongThongTin_Id, "SV_Files");
                        }else
                        $("#tt_" + strTS_HoSoTuyenSinh_Id + '_' + strTruongThongTin_Id).html(edu.util.returnEmpty(e.TRUONGTHONGTIN_GIATRI_TEN_CUOI));
                    })
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_QuanLyHoSo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_TaiKhoan/XoaDuLieuTuyenSinh',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanLyHoSo();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_HeDaoTao/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    //me.dtHeDaoTao= dtResult;
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
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
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
        var obj_list = {
            'action': 'TS_KhoaDaoTao/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
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
                    //me.dtKhoaDaoTao = dtResult;
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
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_Nam: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.cbGenCombo_Nam(dtResult, iPager);
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
    cbGenCombo_Nam: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAM",
                parentId: "",
                name: "NAM",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Nam"],
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachTuyenSinh: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSTS_KeHoach_NguoiDung',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.system.userId,
            'strNam': edu.util.getValById('dropSearch_Nam'),
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtKeHoachTuyenSinh = dtResult;
                    me.genCombo_KeHoachTuyenSinh(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoachTuyenSinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch tuyển sinh"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DotDoiTuong: function (data, iPager) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DoiTuong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genCombo_DotDoiTuong(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DotDoiTuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DOTTUYENSINH_ID",
                parentId: "",
                name: "DOTTUYENSINH_TEN",
            },
            renderPlace: ["dropSearch_Dot"],
            title: "Chọn đợt đối tượng"
        };
        edu.system.loadToCombo_data(obj);
        var obj = {
            data: data,
            renderInfor: {
                id: "DOITUONGDUTUYEN_ID",
                parentId: "",
                name: "DOITUONGDUTUYEN_TEN",
            },
            renderPlace: ["dropSearch_HinhThuc"],
            title: "Chọn hình thức"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_TruongThongTin: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_TaiKhoan/LayDSThongTinTheoKeHoach',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtTruongThongTin = dtResult;
                    me.genHtml_TruongThongTin(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_TruongThongTin: function (data) {
        var me = this;
        $("#tblQuanLyHoSo thead").html(me.strHead);
        var html = "";
        data.forEach(e => {
            html += '<th class="td-center">' + e.TEN + '</th>';
        });
        $("#zoneHoSo").append(html);
        document.getElementById("lblHoSo").colSpan = data.length;
    },

    getList_Mon: function (strTS_HoSoDuTuyen_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThiSinh_KetQua/LayDSMonThiTheoThiSinh',
            'type': 'GET',
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtMon= dtResult;
                    me.genHtml_Mon(dtResult);
                    me.getList_NguyenVong(strTS_HoSoDuTuyen_Id);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_Mon: function (data) {
        var me = this;
        var html = "";
        data.forEach(e => {
            html += '<th class="td-center">' + e.TS_MONTHI_TEN + '</th>';
        });
        $("#zoneNguyenVong").html(html);
        document.getElementById("lblMon").colSpan = data.length;
    },

    getList_NguyenVong: function (strTS_HoSoDuTuyen_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_ThiSinh_NguyenVong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNganhNghe_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropSearch_Dot'),
            'strTS_KeHoachTuyenSinh_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTS_HoSoDuTuyen_Id': strTS_HoSoDuTuyen_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.dtNguyenVong = dtResult;
                    me.genTable_NguyenVong(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_NguyenVong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguyenVong",
            aaData: data,
            colPos: {
                center: [0],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "NGANHNGHE_TEN"
                },
                {
                    "mDataProp": "TS_TOHOP_TEN"
                }
            ]
        };
        me.dtMon.forEach(e => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var strMonThi = aData.DSMONTHITHEOTOHOPNGANH_ID;
                    var arrMonThi = [strMonThi];
                    var x = main_doc.QuanLyHoSo.dtMon[edu.system.icolumn++];
                    var strMonThi_Id = x.ID;
                    
                    if (strMonThi.indexOf(",") != -1) arrMonThi = strMonThi.split(',');
                    if (arrMonThi.indexOf(strMonThi_Id) !== -1) {
                        if (x.DIEM) return x.DIEM;
                        return "x";
                    }
                    return '';
                }
            });
        });
        jsonForm.aoColumns.push({
            "mDataProp": "TS_XACNHANDUYETTT_TEN"
        });
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    
    getUrl_NguyenVong: function () {
        var me = this;
        var obj_save = {
            'action': 'CMS_Token/CreateTicket', 

            "strUser_Id": edu.system.userId,
            "strTicket_Id": edu.util.uuid(),
            "strApp_Id": ""
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var url = me.strPath + '/congtuyensinh/pages/tuyensinh.aspx?ticket=' + obj_save.strTicket_Id + '&langid=';
                    var win = window.open(url, '_blank');
                    if (win == undefined) {
                        edu.system.alert("Hãy cho phép mở tab mới trên trình duyệt của bạn!", "w");
                    } else {
                        win.focus();
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
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


    getList_LichSu: function (point) {
        var me = this;
        var strId = point.id;
        var obj_list = {
            'action': 'TS_DuLieu/LayDSLichSuCapNhatHoSo',
            'type': 'GET',
            'strTS_HoSoDuTuyen_Id': strId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichSu(dtReRult, 0, strId);
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

    genTable_LichSu: function (data, iPager, strTS_HoSoTuyenSinh_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "TRUONGTHONGTIN_TEN"
                },
                {
                    "mData": "DULIEU_TRUOCKHISUA",
                    "mRender": function (nRow, aData) {
                        return '<span id="DULIEU_TRUOCKHISUA_' + aData.TRUONGTHONGTIN_ID + '">' + edu.util.returnEmpty(aData.DULIEU_TRUOCKHISUA) + '</span>';
                    }
                },
                {
                    "mData": "DULIEU_SAUKHISUA",
                    "mRender": function (nRow, aData) {
                        return '<span id="DULIEU_SAUKHISUA_' + aData.TRUONGTHONGTIN_ID + '">' + edu.util.returnEmpty(aData.DULIEU_SAUKHISUA) + '</span>';
                    }
                },
                {
                    "mDataProp": "NGAYTHUCHIEN"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            if (e.KIEUDULIEU === "FILE") {
                ViewFileXXX("DULIEU_TRUOCKHISUA_" + e.TRUONGTHONGTIN_ID, e.DULIEU_TRUOCKHISUA);
                ViewFileXXX("DULIEU_SAUKHISUA_" + e.TRUONGTHONGTIN_ID, e.DULIEU_SAUKHISUA);
            }
        })
        function ViewFileXXX(strZone, strData) {
            var arrJson = [];
            var arrFile = { strData };
            if (strData.indexOf(",")) arrFile = strData.split(',');
            arrFile.forEach(e => arrJson.push({ "FILEMINHCHUNG": e }));
            viewFile(strZone, arrJson);
        }
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_GopFile: function (arrUrl, arrFileName) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'CMS_Files/GopFile',

            'arrTuKhoa': arrUrl,
            'arrDuLieu': arrFileName,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data) {
                        window.open(edu.system.rootPathUpload + "/" + data.Data);
                    }
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
};