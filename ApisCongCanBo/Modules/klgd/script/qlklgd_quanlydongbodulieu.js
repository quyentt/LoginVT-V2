function qlklgd_quanlydongbodulieu() { };
qlklgd_quanlydongbodulieu.prototype = { 
    strErr: '',  

    init: function () {
        var me = this;
        me.page_load();
        $("#btnTimKiem").click(function () {
            me.getList_tblThongTin(); 
        });
        $("[id$=chkAll]").on("click", function () {

            me.checkedCol_BgRow("tblThongTin");

        });

        $("#btnGuiLai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThongTin", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thực hiện?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                var arrChecked_Id = edu.util.getArrCheckedIds("tblThongTin", "checkX");
                var strGiaTri = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strGiaTri += arrChecked_Id[i] + ";";
                }
                strGiaTri = strGiaTri.substr(0, strGiaTri.length - 1);
                me.GuiLaiKafka(strGiaTri); 

            });


        });
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        
        

    },
    
    getList_tblThongTin: function () {
        var me = this;
        //--Edit
        console.log(edu.util.getValById('txtSearch'));
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinLogKafka',
            'versionAPI': 'v1.0',  
            'strTrangThai': edu.util.getValById('drpTrangThai'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strSearch': edu.util.getValById('txtSearch'),
            'strNguoiThucHienId': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_tblThongTin(data.Data, data.Pager);
                    
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblThongTin: function (data, iPager) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblThongTin",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.qlklgd_quanlydongbodulieu.getList_tblThongTin()",
                iDataRow: iPager,
            },
            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [

                {
                    "mDataProp": "TRANGTHAI"
                },
                {
                    "mDataProp": "GIATRI"
                },
                {
                    "mDataProp": "SUKIEN"
                },
                {
                    "mDataProp": "KETQUAGUI"
                },
                {
                    "mDataProp": "NGAYHETHONG"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<input type="checkbox" id="checkX' + aData.GIATRI + '"/>';                        
                        return strReturn;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    checkedCol_BgRow: function (strTable_Id) {//Check toàn bộ input theo cột dựa theo input trên thead
        var me = this;
        //alert(1);
        //Truyền vào id bảng hàm sẽ tạo sự kiện khi check input trên tiêu để bảng (th:input) sẽ lấy thự tự cột và check all toàn bộ input trong cột đó trong bảng
        $("#" + strTable_Id + " th").delegate("input", "click", function () {
            console.log(111);
            var checked_status = $(this).is(':checked');
            var child = this.parentNode;
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            $("#" + strTable_Id + " tbody tr").each(function () {
                var arrcheck = $(this).find("td:eq(" + index + ")").find('input:checkbox');
                arrcheck.each(function () {
                    if ($(this).is(":hidden")) return;
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                });
            });
        });
    },

    GuiLaiKafka: function (strLopHocPhanIds) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TKGG_QLKLGD/GuiLaiKafka',
            'versionAPI': 'v1.0',
            'strKhoiLuongThoiKhoaBieuId': strLopHocPhanIds, 
            'strNguoiThucHienId': edu.system.userId, 

        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_tblThongTin(); 
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

}

