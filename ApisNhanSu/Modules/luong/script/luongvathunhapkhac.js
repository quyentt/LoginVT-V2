/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
----------------------------------------------*/
function LuongThuNhap() { };
LuongThuNhap.prototype = {
    dt_NO: [],
    strNguoiO_Id: '',
    arrNhanSu_Id: [],
    strNhanSu_Id: '',
    dtNhanSu: [],
    strLuongThuNhap_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $("#dropSearch_DonViThanhVien_LuongThuNhap").on("select2:select", function () {
            me.getList_HS();
            me.getList_LuongThuNhap();
        });
        $("#dropSearch_ThanhVien_LuongThuNhap").on("select2:select", function () {
            //me.getList_HS();
            me.getList_LuongThuNhap();
        });
        $("#txtSearch_LuongThuNhap_TuNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LuongThuNhap();
            }
        });
        $("#txtSearch_LuongThuNhap_DenNgay").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_LuongThuNhap();
            }
        });
        $("#txtSearch_LuongThuNhap_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
                me.getList_LuongThuNhap();
            }
        });
        $(".btnSearch").click(function () {
            me.getList_LuongThuNhap();
        });
        


        edu.system.getList_MauImport("zonebtnBaoCao_LDN", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_LuongThuNhap_TuKhoa"),
                'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_LuongThuNhap"),
                'strNgayPhatSinh_TuNgay': edu.util.getValById("txtSearch_LuongThuNhap_TuNgay"),
                'strNgayPhatSinh_DenNgay': edu.util.getValById("txtSearch_LuongThuNhap_DenNgay"),
                'strSearch_NhanSu_HoSoCanBo_Id': edu.util.getValById("dropSearch_ThanhVien_LuongThuNhap"),
                'strNam': edu.util.getValById('txtSearch_Nam'),
                'dLaCanBoNgoaiTruong': edu.util.getValById('dropSearch_LaCanBo_LuongThuNhap'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLuongThuNhap", "checkHS");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                addKeyValue("strNhanSu_HoSoCanBo_Id", arrChecked_Id[i]);
            }
        });
    },
    page_load: function () {
        var me = this;
        me.arrValid_NO = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            //{ "MA": "txtNO_Ho", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Ten", "THONGTIN1": "EM" },
            //{ "MA": "txtNO_Email", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_CoCauToChuc", "THONGTIN1": "EM" },
            { "MA": "txtNO_MaSo", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_TinhTrangNhanSu", "THONGTIN1": "EM" },
            //{ "MA": "dropNO_LoaiDoiTuong", "THONGTIN1": "EM" }
        ];
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#txtSearch_Nam").val(edu.util.thisYear());
        me.getList_LuongThuNhap();
        me.getList_CoCauToChuc();
    },
    rewrite: function () {
        var me = this;
        edu.util.viewValById("dropLoaiKhoan", "");
        edu.util.viewValById("txtSoTien", "");
        edu.util.viewValById("txtThueThuNhap", "");
        edu.util.viewValById("txtChungTu", "");
        edu.util.viewValById("txtNgay", "");
        edu.util.viewValById("txtThang", "");
        edu.util.viewValById("txtNam", "");
        edu.util.viewValById("txtNoiDung", "");
    },
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    getList_LuongThuNhap: function () {
        var me = main_doc.LuongThuNhap;
        //--Edit
        var obj_list = {

            'action': 'L_KetQuaLuong/LayDanhSach',
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonViThanhVien_LuongThuNhap'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien_LuongThuNhap'),
            'dThang': edu.util.checkValue(edu.util.getValById('txtSearch_Thang')) ? edu.util.getValById('txtSearch_Thang'): -1,
            'dNam': edu.util.checkValue(edu.util.getValById('txtSearch_Nam')) ? edu.util.getValById('txtSearch_Nam') : -1,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    me.dtNhanSu = data.Data;
                    me.genTable_LuongThuNhap(data.Data, data.Pager);

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
    /*------------------------------------------
    --Discription: Generating html on interface NCS
    --ULR: Modules
    -------------------------------------------*/
    genTable_LuongThuNhap: function (data, iPager) {
        $("#lblHSLL_LuongThuNhap_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLuongThuNhap",
            aaData: data,
            colPos: {
                center: [0,1,2, 4, 6, 10, 11],
                right: [8,9]
            },
            aoColumns: [
                {
                    "mDataProp": "NAM"
                },
                {
                    "mDataProp": "THANG"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mData": "NGUOICUOI_TENDAYDU",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASOTHUE"
                },
                {
                    "mDataProp": "CHUNGTU"
                },
                {
                    "mData": "LOAIKHOAN_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mData": "THUETNCN",

                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.THUETNCN);
                    }
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "NGAYPHATSINH"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable(jsonForm.strTable_Id, [8,9]);
        /*III. Callback*/
    },
    editForm_NhanSu_LuongThuNhap: function (data) {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit_NhanSu_LuongThuNhap");
        //view data --Edit
        edu.util.viewValById("dropNS_LoaiKhoan", data.LOAIKHOAN_ID);
        edu.util.viewValById("txtNS_SoTien", data.SOTIEN);
        edu.util.viewValById("txtNS_ThueThuNhap", data.THUETNCN);
        edu.util.viewValById("txtNS_ChungTu", data.CHUNGTU);
        edu.util.viewValById("txtNS_Ngay", data.NGAYPHATSINH);
        edu.util.viewValById("txtNS_NoiDung", data.MOTA);
        me.strNhanSu_Id = data.NHANSU_HOSOCANBO_ID;
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien_LuongThuNhap"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien_LuongThuNhap"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVien_LuongThuNhap"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
}