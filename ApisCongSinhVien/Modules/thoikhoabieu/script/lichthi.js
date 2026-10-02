/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 29/06/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function LichThi() { };
LichThi.prototype = {
    dtLichThi: [],
    strLichThi_Id: '',
    dtHocPhan_LichThi: [],
    dtPhanBo: [],
    strSinhVien_Id: '',

    init: function () {
        var me = this;
        me.strSinhVien_Id = edu.system.userId;
        me.getList_HocKy();
        $('#dropSearch_HocKy').on('select2:select', function () {
            me.getList_HocPhan();
        });
        $('#dropSearch_HocPhan').on('select2:select', function () {
            me.getList_HocPhan_LichThi();
        });
        $("#btnXemLich").click(function () {
            me.getList_HocPhan_LichThi();
        })
        $("#btnXemLichSu").click(function () {
            me.getList_HocPhan_LichThi('SV_ThongTin_MH/DSA4BRINKCIpFSkoHgokCS4gIikVKSgeDSgiKRI0');
        })
    },

    getList_HocKy: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIVKS4oBiggLw0oIikVKSgP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSThoiGianLichThi',
            'iM': edu.system.iM,
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
                    me.genComBo_HocKy(dtResult, iPager);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_HocKy: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_HocKy"],
            type: "",
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIJLiIRKSAvDSgiKRUpKAPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSHocPhanLichThi',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strTHI_DotThi_Id': edu.util.getValById('dropAAAA'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropAAAA'),
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
                    me.genComBo_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_HOCPHAN_TEN",
                code: "DAOTAO_HOCPHAN_MA",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan_LichThi: function (strHam) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': strHam ? strHam : 'SV_ThongTin_MH/DSA4BRINKCIpFSkoHgokCS4gIikVKSgP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSLichThi_KeHoachThi',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;

                    me.genTable_LichThiCaNhan(data.Data.rsLichThiCaNhan, iPager);
                    me.genTable_LichThiChung(data.Data.rsKeHoachThiChung, iPager);
                    //me.getList_ThoiGianDaoTao();
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LichThiCaNhan: function (data, iPager) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblLichThiCaNhan",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [{
                "mDataProp": "MAHOCPHAN"
            },
            {
                "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "NGAYHOC"
                },
            {
                "mRender": function (nRow, objLich) {

                    return me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC);
                }
            },
            {
                "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "PHONGHOC_TEN"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mRender": function (nRow, aData) {

                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    genTable_LichThiChung: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblLichThiChung",
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [{
                "mDataProp": "MAHOCPHAN"
            },
                {
                    "mDataProp": "TENHOCPHAN"
                }, {
                    "mDataProp": "NGAYHOC"
                },
                {
                    "mRender": function (nRow, objLich) {

                        return me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC);
                    }
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "PHONGHOC_TEN"
                },
                {
                    "mDataProp": "SOBAODANH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    returnTwo: function (iDay) {
        iDay = "" + iDay;
        if (iDay.length == 1) return "0" + iDay;
        else return iDay;
    },
    
}