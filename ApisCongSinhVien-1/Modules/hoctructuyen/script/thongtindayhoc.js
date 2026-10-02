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

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system 
        -------------------------------------------*/
        
        //me.getList_ThongTin();
        me.getList_NgayHienTai();
        var date = new Date();
        var nMonth = date.getMonth() + 1;
        var nYear = date.getFullYear();
        
        $("#nam").attr("title", nYear);
        $("#nam").html(nYear);
        
        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);
        me.genHtml_Month(0);

        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });
        
        $(".days").delegate(".poiter", "click", function () {
            $(".days .active").removeClass("active");
            this.classList.add("active");
            var strDay = $(this).attr("name") + "/" + $("#thang").attr("title") + "/" + $("#nam").attr("title");
            me.getList_NgayHienTai(strDay);
        });
        $("#tblThongTin").delegate(".onlink", "click", function () {
            var strId = this.id;
            var strLink = $(this).attr("title");
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                window.open(strLink);
            });
        });
        $(".month").delegate(".prev", "click", function () {
            me.genHtml_Month(-1);
        });
        $(".month").delegate(".next", "click", function () {
            me.genHtml_Month(1);
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_NgayHienTai: function (strNgay) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Chung/LayDSLopHoc_Lich_SV_Ngay',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': edu.system.userId,
            'strNgay': strNgay,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        var aData = dtReRult[0];
                        $("#lblNgayHienTai").html("Thứ " + edu.util.returnEmpty(aData.THU) +", ngày " + edu.util.returnEmpty(aData.NGAY));
                    }
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
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThongTin: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_LopHoc_Lich_SV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_NguoiHoc_Id': edu.system.userId,
            'strCongCuHoc_Id': edu.util.getValById('dropAAAA'),
            'strNgayVao': edu.util.getValById('txtAAAA'),
            'strHoTroHoc_LopHoc_Lich_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiGhiNhan_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_LopHocPhan_Id': edu.util.getValById('dropAAAA'),
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
                strFuntionName: "main_doc.ThongTin.getList_NgayHienTai()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 1,9,8], 
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "GIANGVIEN_MA"
                },
                {
                    "mDataProp": "GIANGVIEN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return "Thứ " + edu.util.returnEmpty(aData.THU) + ", ngày " + edu.util.returnEmpty(aData.NGAY) + ", " + edu.util.returnEmpty(aData.GIO) + "h:" + edu.util.returnEmpty(aData.PHUT);
                    }
                },
                {
                    "mData": "THONGTINVAOHETHONGHOC",
                    "mRender": function (nRow, aData) {
                        if (aData.THONGTINVAOHETHONGHOC && aData.THONGTINVAOHETHONGHOC.indexOf('http') != -1) return '<a title="' + aData.THONGTINVAOHETHONGHOC + '" class="onlink">' + edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC) + '</a> ';
                        return edu.util.returnEmpty(aData.THONGTINVAOHETHONGHOC)
                    }
                },
                {
                    "mDataProp": "THONGTINXACTHUCVAOHOC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXacNhan" id="' + aData.ID + '">Xác nhận</a></span>';
                    }
                },
                {
                    "mDataProp": "TRANGTHAIGHINHAN_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_XacNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'SV_LopHoc_Lich_SV/XacNhan_HoTro_LopHoc_Lich_SV',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genHtml_Month: function (cal) {
        var nMonth = parseInt($("#thang").attr("title"));
        var nYear = parseInt($("#nam").attr("title"));
        nMonth += cal;
        if (nMonth == 0) {
            nMonth = 12;
            nYear--;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        if (nMonth == 13) {
            nMonth = 1;
            nYear++;
            $("#nam").attr("title", nYear);
            $("#nam").html(nYear);
        }
        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);

        var iDayOfMonth = 31;
        switch (nMonth) {
            case 2: iDayOfMonth = 28; break;
            case 4: 
            case 6:
            case 9:
            case 11: iDayOfMonth = 30; break;
        }

        var strDay = edu.util.dateToday();
        var iDay = parseInt(strDay.substr(0, strDay.indexOf("/")));
        
        var iThu = new Date(nYear, nMonth - 1, 1, 0, 0, 0, 0);
        iThu = iThu.getDay();
        var html = "";
        for (var i = 0; i < iThu - 1; i++) {
            html += '<li></li>';
        }

        var bCheck = false;
        var date = new Date();
        if (date.getMonth() + 1 == nMonth && date.getFullYear() == nYear) bCheck = true;

        for (var i = 1; i <= iDayOfMonth; i++) {
            var strClass = "";
            if (bCheck && i == iDay) strClass = 'active';
            html += '<li><span  class="poiter ' + strClass + '" name="' + i + '">' + i + '</span></li>';
        }
        $(".days").html(html);
    }
}