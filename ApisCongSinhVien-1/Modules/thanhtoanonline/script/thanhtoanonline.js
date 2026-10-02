function thanhtoanonline() { };

thanhtoanonline.prototype = {
    dtThanhToan: [],
    strMaSinhVien: '',
    MaDonHang_Gui_NganHang: '',
    strCreatedDate: '',
    strKhongChoPhepSuaSoTien:'',
    init: function () {
        var me = this;
        $("#tblThanhToan").delegate(".inputsotien", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
            me.show_TongTien("tblThanhToan");
        });
        $("[id$=chkSelectAll_ThanhToan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThanhToan" });
        });
        $("#btnThucHienThanhToan").click(function () {
            
            if (edu.util.getValById("drpNganHang") == "" || edu.util.getValById("drpNganHang") == undefined) {
                edu.system.alert("Vui lòng chọn ngân hàng để thanh toán");
                return;
            }

            var arrChecked_Id = edu.util.getArrCheckedIds("tblThanhToan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn khoản cần thanh toán");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thanh toán?");
            function getSoTien(dSoTien, dRecovery) {
                //var dSoTien = $("#lbThanhTien" + strId).html();
                dSoTien = dSoTien.replace(/ /g, "").replace(/,/g, "");
                dSoTien = parseFloat(dSoTien);
                return (typeof (dSoTien) == 'number') ? dSoTien : dRecovery;
            }
            $("#btnYes").click(function (e) {            
                me.strErr = "";
                var DonHangChiTietIds = "";
                var SoTiens = "";
                var NoiDungs = me.strMaSinhVien + "_" + edu.util.getValById("drpNganHang")+ "_"; 
                var strclientIP = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtThanhToan, "ID");
                    DonHangChiTietIds += arrChecked_Id[i] + "|";                   
                   // NoiDungs += dt[0].NOIDUNG + "^";  
                    SoTiens += getSoTien(edu.util.getValById("txtSoTien" + arrChecked_Id[i]),0) + "|";                                     
                    
                }
                
                if (arrChecked_Id.length > 0) {
                    DonHangChiTietIds = DonHangChiTietIds.substr(0, DonHangChiTietIds.length - 1);
                    SoTiens = SoTiens.substr(0, SoTiens.length - 1);                                     
                    NoiDungs += DonHangChiTietIds + "^";  
                    NoiDungs = NoiDungs.substr(0, NoiDungs.length - 1);
                }
                
                me.ThucHienThanhToan(DonHangChiTietIds, SoTiens, NoiDungs);
            });
        });
        me.page_load();


    },
   
    page_load: function () {
        var me = this;
        edu.system.page_load(); 
        me.getList_CauHinhThanhToan();
        me.getList_drpNganHang();
        
    },
    ThucHienThanhToan: function (DonHangChiTietIds, SoTiens, NoiDungs) {
        
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'CTT_ThongTinKetNoi/KetNoiVNPAY',
            'versionAPI': "v1.0",
            'DonHangChiTietIds': DonHangChiTietIds,
            'SoTiens': SoTiens,
            'NoiDungs': NoiDungs,
            'vnp_TmnCode': edu.util.getValById("drpNganHang") ,
            'MaDonHang_Gui_NganHang': me.MaDonHang_Gui_NganHang,
            'CreatedDate': me.strCreatedDate,

            
        };
        

        edu.system.makeRequest({
            success: function (data) { 
                if (data.Success) {
                   
                    window.location.replace(data.Data); 
                   
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
   
    getList_tblThanhToan: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'CTT_HocPhi/VanTin',
            'versionAPI': "v1.0",
            'ServiceId': "VNPAY_ONLINE", 
            'MaNganHang': "VNPAY",
            'MaSinhVien': edu.system.userId,
            'ChuKy': "",
        };
        
        

        edu.system.makeRequest({
            success: function (data) {                 
                if (data.ResponeCode == "00") {
                    me.dtThanhToan = data.NoiDungThanhToan_ChiTiet;
                    edu.util.viewHTMLById("lblHoTen", data.SinhVien.HoVaTen);
                    edu.util.viewHTMLById("lblMaSinhVien", data.SinhVien.MaSinhVien);
                    edu.util.viewHTMLById("lblNgaySinh", data.SinhVien.NgaySinh);
                    edu.util.viewHTMLById("lblLopQuanLy", data.SinhVien.Lop);
                    edu.util.viewHTMLById("lblNganh", data.SinhVien.Nganh);
                    edu.util.viewHTMLById("lblKhoa", data.SinhVien.KhoaDaoTao);
                    me.MaDonHang_Gui_NganHang = data.NoiDungThanhToan_TongHop.MaDonHang_Gui_NganHang;
                    me.strCreatedDate = data.NoiDungThanhToan_TongHop.Ngaytaodonhang;
                    me.strMaSinhVien = data.SinhVien.MaSinhVien;
                    me.genTable_tblThanhToan(data.NoiDungThanhToan_ChiTiet);
                    
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
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_tblThanhToan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThanhToan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        strHTML = '<input type="text" disabled id="txtSoTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"  />';
                        
                        if (me.strKhongChoPhepSuaSoTien =="0")
                            strHTML = '<input type="text"  id="txtSoTien' + aData.ID + '" name="' + edu.util.formatCurrency(aData.SOTIEN) + '" value="' + edu.util.formatCurrency(aData.SOTIEN) + '" class="inputsotien" style="width: 150px"  />';
                        return strHTML;
                    }
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm); 
        edu.system.insertSumAfterTable("tblThanhToan", [2]);
        $("#tblThanhToan" + " tfoot tr td:eq(2)").attr("style", "text-align: right; font-size: 20px; padding-right: 20px");


        /*III. Callback*/
    },
    show_TongTien: function (strTableId) {
        //Tìm tất cả checkbox đang check trong bảng loại bỏ phần dư thừa rồi cộng lại để hiện tổng trên cùng cạnh sinh viên
        setTimeout(function () {
            var sum = edu.system.countFloat(strTableId,2);                     
            edu.system.insertSumAfterTable(strTableId, [2]);
        }, 100);
    },
    getList_drpNganHang: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'VNPAY.NGANHANG',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpNganHang(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpNganHang: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "THONGTIN1",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpNganHang"],
            type: "",
            title: "Chọn ngân hàng"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CauHinhThanhToan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'CM_DanhMucDuLieu/LayDanhSach',
            'versionAPI': 'v1.0',
            'strMaBangDanhMuc': 'VNPAY.CAUHINHTHANHTOAN',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.strKhongChoPhepSuaSoTien = "1"; 
                    
                    if (data.Data.length > 0) {
                        var dt = edu.util.objGetDataInData("KHONGCHOPHEPSUASOTIEN", data.Data, "MA");
                        if (dt.length > 0)
                            me.strKhongChoPhepSuaSoTien = dt[0].THONGTIN1;
                    }
                    me.getList_tblThanhToan();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
}

