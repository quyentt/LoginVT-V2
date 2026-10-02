/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function ThongTin() { };
ThongTin.prototype = {
    strThongTin_Id: '',
    dtThongTin: [],
    strHead: '',
    dtNgayHoc: [],
    strLopHocPhan_Id: '',
    dtSinhVien: [],

    init: function () {
        var me = this;
        me.strHead = $("#tblSinhVien thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //$("#txtSearch_NgayHoc").val(edu.util.dateToday()); 
        me.getList_ThongTin();
        me.getList_ThoiGianDaoTao();
         

        $("#btnSearch").click(function () {
            me.getList_ThongTin();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThongTin();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
            me.getList_GiangVien();
            me.getList_HocPhan();
        });
        $('#dropSearch_GiangVien').on('select2:select', function (e) {
            me.getList_HocPhan();
        });


        $("#tblThongTin").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.toggle_edit();
                me.strLopHocPhan_Id = strId;
                me.getList_NgayHoc();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#tblThongTin").delegate(".onlink", "click", function () {
            var strId = this.id;
            var strLink = $(this).attr("title");
            window.open(strLink);
        });
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoTro_Chung/LayDSThoiGian',
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
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                selectOne: true
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn học kỳ, đợt"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_ThoiGian").trigger({ type: 'select2:select' });
    },
    getList_GiangVien: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoTro_Chung/LayDSGiangVien',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
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
                    me.genCombo_GiangVien(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_GiangVien: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "HOTEN",
            },
            renderPlace: ["dropSearch_GiangVien"],
            title: "Chọn học giảng viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_HoTro_Chung/LayDSHocPhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strGiangVien_Id': edu.util.getValById('dropSearch_GiangVien'),
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
                    me.genCombo_HocPhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: (nRow, aData) => { return aData.TEN + " - " + aData.MA}
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThongTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Lich_GV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strGiangVien_Id': edu.util.getValById('dropSearch_GiangVien'),
            'strCongCuHoc_Id': edu.util.getValById('dropAAAA'),
            'strNgayVao': edu.util.getValById('txtAAAA'),
            'strNgayHoc': edu.util.getValById('txtSearch_NgayHoc'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay'),
            'strHoTroHoc_LopHoc_Lich_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiGhiNhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNgay': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtThongTin = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThongTin: function (data, iPager) {
        $("#lblThongTin_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThongTin",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThongTin.getList_ThongTin()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1,9,11, 10, 12, 13],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return "Thứ " + edu.util.returnEmpty(aData.THU) + ", ngày " + edu.util.returnEmpty(aData.NGAY) + ", " + edu.util.returnEmpty(aData.GIO) + "h:" + edu.util.returnEmpty(aData.PHUT);
                    }
                },
                {
                    "mDataProp": "GIANGVIEN_MA"
                },
                {
                    "mDataProp": "GIANGVIEN_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mData": "THONGTINVAOHETHONGHOC",
                    "mRender": function (nRow, aData) {
                        if (aData.THONGTINVAOHETHONGHOC_KETHUA && aData.THONGTINVAOHETHONGHOC_KETHUA.indexOf('http') != -1) return '<a title="' + aData.THONGTINVAOHETHONGHOC_KETHUA + '" class="onlink">' + edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC_KETHUA) + '</a> ';
                        return edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC_KETHUA)
                    }
                },
                {
                    "mDataProp": "TRANGTHAIGHINHAN_TEN"
                },
                {
                    "mDataProp": "SODUNGGIO"
                },
                {
                    "mDataProp": "SOVAOTRUOCGIO"
                },
                {
                    "mDataProp": "SOVAOMUONGIO"
                },
                {
                    "mDataProp": "SOVANGMAT"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.DANGKY_LOPHOCPHAN_ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_NgayHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayDSNgayHocTheoLop',
            'type': 'GET',
            'strDangKy_LopHocPhan_Id': me.strLopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNgayHoc = dtReRult;
                    me.getList_SinhVien();
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
    getList_SinhVien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayDSSVTheoLop',
            'type': 'GET',
            'strDangKy_LopHocPhan_Id': me.strLopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
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

    genTable_SinhVien: function (data, iPager) {
        var me = this;
        var strTable_Id = "tblSinhVien";
        $("#tblSinhVien thead").html(me.strHead);
        for (var j = 0; j < me.dtNgayHoc.length; j++) {
            var aData = me.dtNgayHoc[j];
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center">Thứ ' + edu.util.returnEmpty(aData.THU) + ", ngày " + edu.util.returnEmpty(aData.NGAY) + ", " + edu.util.returnEmpty(aData.GIO) + "h:" + edu.util.returnEmpty(aData.PHUT) + '</th>');
        }
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                }
            ]
        };
        for (var j = 0; j < me.dtNgayHoc.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<div id="lblSinhVien_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.ThongTin.dtNgayHoc[iThuTu].ID + '"></div>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        for (var j = 0; j < me.dtNgayHoc.length; j++) {
            me.getList_KetQua(me.dtNgayHoc[j].ID);
        }
    },

    getList_KetQua: function (strHoTroHoc_LopHoc_Lich_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayKQVaoHocCuaNguoiHoc',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strHoTroHoc_LopHoc_Lich_Id': strHoTroHoc_LopHoc_Lich_Id,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        if (json.NGAYVAO) $("#lblSinhVien_" + json.QLSV_NGUOIHOC_ID + "_" + strHoTroHoc_LopHoc_Lich_Id).html("Ngày " + edu.util.returnEmpty(json.NGAYVAO) + " " + edu.util.returnEmpty(json.GIOVAO) + ":" + edu.util.returnEmpty(json.PHUTVAO) + ":" + edu.util.returnEmpty(json.GIAYVAO));
                    }
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
}