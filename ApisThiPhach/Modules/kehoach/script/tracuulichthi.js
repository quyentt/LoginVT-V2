/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TraCuuLichThi() { };
TraCuuLichThi.prototype = {
    strTraCuuLichThi_Id: '',
    dtTraCuuLichThi: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        //me.getList_TraCuuLichThi();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAICHUONGTRINH", "dropSearch_MoHinhHoc,dropMoHinhHoc");
        
        $("#btnSearch").click(function () {
            me.getList_TraCuuLichThi();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TraCuuLichThi();
            }
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ThongTin/LayDSThoiGianLichThi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_ThoiGianDaoTao(dtReRult, data.Pager);
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
    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TraCuuLichThi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ThongTin/LayDSLichThi_Phach',
            'type': 'GET',
            'strQLSV_NguoiHoc': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTraCuuLichThi = dtReRult;
                    me.genTable_TraCuuLichThi(dtReRult, data.Pager);
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
    genTable_TraCuuLichThi: function (data, iPager) {
        $("#lblTraCuuLichThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTraCuuLichThi",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TraCuuLichThi.getList_TraCuuLichThi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MAHOCPHAN"
                },
                {
                    "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "NGAYHOC"
                },
                {
                    "mData": "GIOBATDAU, PHUTBATDAU --> GIOKETTHUC, PHUTKETTHUC",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIOBATDAU) + "h" + edu.util.returnEmpty(aData.PHUTBATDAU) + " --> " + edu.util.returnEmpty(aData.GIOKETTHUC) + "h" + edu.util.returnEmpty(aData.PHUTKETTHUC);
                    }
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "PHONGHOC_TEN"
                },
                {
                    "mDataProp": "CATHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mDataProp": "SOPHACH"
                },
                {
                    "mDataProp": "DIEM" 
                },
                {
                    "mDataProp": "NGAYNHAPDIEM"
                },
                {
                    "mDataProp": "TUIBAI_TEN"
                },
                {
                    "mDataProp": "LOPTINCHI_TEN"
                },
                {
                    "mData": "QLSV_NGUOIHOC_HODEM - QLSV_NGUOIHOC_TEN - QLSV_NGUOIHOC_MASO",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}