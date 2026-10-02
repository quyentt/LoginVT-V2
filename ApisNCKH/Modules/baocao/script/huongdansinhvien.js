/*----------------------------------------------
--Author: vanhiep
--Phone: 
--Date of created: 24/12/2018
----------------------------------------------*/
function HuongDanSinhVien() { }
HuongDanSinhVien.prototype = {
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
        $("#zoneReport_HDSV").delegate(".btnPrint", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/print_HDSV/g, strId);
            edu.util.objGetDataInData(strId, me.dtReportTemp, "ID", me.report_HDSV);
        });
        /*------------------------------------------
        --Discription: [1] Action HuongDanSinhVien
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HDSV_NhanSu,.btnRefresh").click(function () {
            me.getList_HDSV();
        });
        $("#txtSearch_HDSV_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HDSV();
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        $("#txtSearch_HDSV_TuKhoa").focus();
        /*------------------------------------------
        --Discription: [1] Load TapChiTrongNuoc
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_HDSV();
            setTimeout(function () {
                edu.system.loadToCombo_DanhMucDuLieu("NCKH.VTHDGD", "dropSearch_VaiTro_HDGD");
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
    --Discription: [1] AcessDB HuongDanSinhVien
    -------------------------------------------*/
    getList_HDSV: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_SP_HuongDan_GiangDay/LayDanhSach',
            

            'strThanhVien_Id': "",
            'strTuKhoa': edu.util.getValById("txtSearch_HDSV_TuKhoa"),
            'strPhanLoai_Id': edu.util.getValById("dropSearch_VaiTro_HDGD"),
            'strNguoiThucHien_Id': edu.system.userId,
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
                        me.dtDeTai = dtResult;
                    }
                    me.genTable_HDSV(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    --Discription: [1] GenHTML HuongDanSinhVien
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HDSV: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblHDGD_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHDSV",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HuongDanSinhVien.getList_HDSV()",
                iDataRow: iPager,
                bChange: false,
                bLeft: false
            },
            colPos: {
                center: [0, 3]
            },
            arrClassName: ["btnView"],
            aoColumns: [
                {
                    "mDataProp": "TENDETAI_GIANGDAY"
                }
                , {
                    "mDataProp": "PHANLOAI_TEN"
                }
                , {
                    "mDataProp": "NAMNGHIEMTHU"
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
        var me = main_doc.HuongDanSinhVien;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_HDSV' + strId + '" class="poiter btnPrint" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_HDSV").html(html_link);
    },
};