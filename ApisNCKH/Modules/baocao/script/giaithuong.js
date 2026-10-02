/*----------------------------------------------
--Author: vanhiep
--Phone: 
--Date of created: 24/12/2018
----------------------------------------------*/
function GiaiThuong() { }
GiaiThuong.prototype = {
    dtReportTemp: [],
    dtTapChiDG: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $("#zoneReport_GT").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_GT/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_GT);
        });
        /*------------------------------------------
        --Discription: [1] Action GiaiThuong
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_GT,.btnRefresh").click(function () {
            me.getList_GT();
        });
        $("#txtSearch_GT_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GT();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        $("#txtSearch_GT_TuKhoa").focus();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_GT();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DMHV, "dropSearch_LoaiHocVi_GT");
                setTimeout(function () {
                    edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.LOCD, "dropSearch_LoaiChucDanh_GT");
                }, 50);
            }, 50);
        }, 50);
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        var arrId = [""];
        edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GiaiThuong
    -------------------------------------------*/
    getList_GT: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_GiaiThuong/LayDanhSach',
            

            'strVaiTro_Id': "",
            'strCanBoNhap_Id': "",
            'strNCKH_QuanLyDeTai_Id': "",
            'strnckh_detai_thanhvien_id': "",
            'iTrangThai': 1,
            'strTuKhoa': edu.util.getValById("txtSearch_GT_TuKhoa"),
            'strLoaiHocVi_Id': edu.util.getValById("dropSearch_LoaiHocVi_GT"),
            'strLoaiChucDanh_Id': edu.util.getValById("dropSearch_LoaiChucDanh_GT"),
            'strLoaiDoiTuong_Id': "",
            'strDonViCuaThanhVien_Id': "",
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
                        me.dtGiaiTuong = dtResult;
                    }
                    me.genTable_GT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_GiaiThuong/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_GiaiThuong/LayDanhSach (er): " + JSON.stringify(er), "w");
                
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
    --Discription: [1] GenHTML GiaiThuong
    --ULR:  Modules
    -------------------------------------------*/
    genTable_GT: function (data, iPager) {
        var me = this;
        //edu.util.viewHTMLById("lblHDGD_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblGT",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiaiThuong.getList_GT()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false
            },
            colPos: {
                center: [0, 4]
            },
            arrClassName: ["btnView"],
            aoColumns: [
                {
                    "mDataProp": "CANBONHAP_TENDAYDU"
                }
                ,{
                    "mDataProp": "HINHTHUC"
                }
                , {
                    "mDataProp": "NOIDUNGGIAITHUONG"
                }
                , {
                    "mDataProp": "NAMTANGTHUONG"
                }
                , {
                    "mDataProp": "SONGUOITHAMGIAVAOCONGTRINH_N"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink: function (data) {
        var me = main_doc.GiaiThuong;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_GT' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_GT").html(html_link);
    },
};