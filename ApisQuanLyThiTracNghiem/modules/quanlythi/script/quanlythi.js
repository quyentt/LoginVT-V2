function QuanLyThi() { };
QuanLyThi.prototype = {
    dtPhongThi: [],
    dtChiTietPhongThi: [],
    dtPhongThiImport: [],
    dtDeThiThuCong: [],
    dtHocPhan:[],
    strStudentExamRoomId: '',
    strThiSinhId: '',
     
    strExamStructId: '',
    strExamRoomInfoId: '',
    strMatKhauChoPhongThi: '',
    strDepartOrganId: '',
    strWritenExamId: '',
    strWritenExamId_CacPhongThi:'',
    strKieuTaoDe: '',
    strDeThiThuCongId: '', 
    strStudentExamRoomIds: '',
    strExamRoomInfoIds_CacPhongThi: '',
    strTongThoiGianCauTrucDe:'',
    
    init: function () {
        var me = this;        
        me.page_load();

        var abc = location.pathname.split('/');
        $("#lblMaXacNhan").html(me.randomString(5, ""));
        LayDS_ThiSinhGianLan();
        function LayDS_ThiSinhGianLan() {
            me.LayDS_ThiSinhGianLan();
            setTimeout(function () {
                LayDS_ThiSinhGianLan();
            }, 30000);
        }
        
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#btn_NhapMaXacNhan").click(function () {
            var selectedValue = $("#drpBaoCao_Main").find('option:selected').val();
            if ($("#lblMaXacNhan").html() != edu.util.getValById("txtMaXacNhan"))
                edu.system.alert("Sai mã xác nhận");
            else {
                me.report(selectedValue);
            }
        });
        
        $(".btnClose_PhongThiImport_SinhVien").click(function () {
            me.toggle_batdau_ImportPhongThi_SinhVien();
        });
        $("#btnThucHienTacVu").click(function () {
            if (edu.util.getValById("drpTacVu") == "")
            {
                edu.system.alert("Bạn chưa chọn tác vụ cần thực hiện");
                return;
            }
            if (edu.util.getValById("drpTacVu") == "IMPORTPHONGTHI")
            {
                me.rewrite_PhongThi();
                if (edu.util.getValById('drpDotThi') == "") {
                    edu.system.alert("Chưa chọn đợt thi");
                    return;
                }
                if (edu.util.getValById('drpDonVi') == "") {
                    edu.system.alert("Chưa chọn đơn vị");
                    return;
                }
                me.getList_PhongThi();
                edu.util.viewHTMLById("lblDonVi", $("#drpDonVi  option:selected").html());
                edu.util.viewHTMLById("lblDotThi", $("#drpDotThi option:selected").html());
                me.toggle_edit_ImportPhongThi();
            }
            if (edu.util.getValById("drpTacVu") == "XOAPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.delete_PhongThi(arrChecked_Id[i]);
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "THEMPHONGTHI") {
                me.rewrite_PhongThi();
                if (edu.util.getValById('drpDotThi') == "") {
                    edu.system.alert("Chưa chọn đợt thi");
                    return;
                }
                if (edu.util.getValById('drpDotThi') == "") {
                    edu.system.alert("Chưa chọn đơn vị");
                    return;
                }
                edu.util.viewHTMLById("lblDonVi", $("#drpDonVi  option:selected").html());
                edu.util.viewHTMLById("lblDotThi", $("#drpDotThi option:selected").html());
                me.toggle_edit_PhongThi();
            }
            if (edu.util.getValById("drpTacVu") == "MOPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần mở?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn mở phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i],"MOPHONGTHI");
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "DONGPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần đóng?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn đóng phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "DONGPHONGTHI");
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "ANPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần ẩn?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn ẩn phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "ANPHONGTHI");
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "HIENPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần hiển thị?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn hiển thị phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.ThaoTacPhongThi_PhongThi(arrChecked_Id[i], "HIENPHONGTHI");
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "KHOITAODETHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần khởi tạo đề?");
                    return;
                }
                if (edu.util.getValById("drpDonVi") == "") {
                    edu.system.alert("Vui lòng chọn đơn vị cần khởi tạo đề?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn khởi tạo đề cho các phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert').modal('hide');
                    var strExamRoomInfoIds = "";
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        strExamRoomInfoIds += arrChecked_Id[i] + ",";
                    }
                    strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                    me.strExamRoomInfoIds_CacPhongThi = strExamRoomInfoIds;
                        me.getList_drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi();
                        me.getList_drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi();
                        

                        me.getList_drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi();
                        me.getList_drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi();
                                    
                    setTimeout(function () {
                        me.toggle_edit_KhoiTaoDeChoCacPhongThi();
                    }, 500);      
                    
                    
                    //me.ThaoTacPhongThi_KhoiTaoDeThi(strExamRoomInfoIds); 
                }); 
            }
            if (edu.util.getValById("drpTacVu") == "BAOCAOTHEODANHSACH") {
                
                edu.util.toggle_overide("zone-bus", "zoneBaoCaoLocTheoDuLieu");
            }
            if (edu.util.getValById("drpTacVu") == "TINHDIEMCAUHOI") {
                arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần thực hiện?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn thực hiện?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.ThucHienTinhDiemCauHoi_PhongThi(arrChecked_Id[i]);
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "TINHVACONGNHANDIEM") {
                arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn đối tượng cần thực hiện?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn thực hiện?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.TINHVACONGNHANDIEM_PhongThi(arrChecked_Id[i]);
                    }
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi();
            }
        });   
        $(".btnSearch_PhongThi").click(function () {
            me.getList_PhongThi();
        });
        $("#btnSearch_ImportPhongThi").click(function () {
            me.getList_ImportPhongThi();
        });
        
        $("#btnSave_ThiSinh").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtStudentCode", "THONGTIN1": "EM" },
                { "MA": "txtLastName", "THONGTIN1": "EM" },
                { "MA": "txtFirtName", "THONGTIN1": "EM" },                 
                { "MA": "txtSoBaoDanh", "THONGTIN1": "EM" },
                { "MA": "txtBirthDate", "THONGTIN1": "EM" }
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            me.save_ThiSinh(me.strThiSinhId);
        });
        $("#btnAdd_ThiSinh").click(function () {
            me.rewrite_ThiSinh();
            if (me.strExamRoomInfoId == "") {
                edu.system.alert("Chưa chọn phòng thi");
                return;
            }
            me.toggle_edit_ThiSinh();
        });
        $("#btnAdd_TaoDeThi").click(function () {            
            if (me.strExamRoomInfoId == "") {
                edu.system.alert("Chưa chọn phòng thi");
                return;
            }
             
            me.toggle_edit_TaoDeThi();
        }); 
        $("#btnAdd_TaoDeTuDeThiThuCong").click(function () {
            if (me.strExamRoomInfoId == "") {
                edu.system.alert("Chưa chọn phòng thi");
                return;
            }
            
            if (edu.util.getValById("drpExamstructPart")=="") {
                edu.system.alert("Chưa chọn phần thi");
                return;
            }
            edu.util.viewHTMLById("lblPhanThi_TaoDeTuDeThiThuCong", $("#drpExamstructPart  option:selected").html());
            me.toggle_edit_TaoDeTuDeThiThuCong();
        }); 

        $("#btnAdd_TinhHuongThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChiTietPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            } 
            me.strStudentExamRoomIds = "";
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.strStudentExamRoomIds += arrChecked_Id[i] + ",";                 
            }
            
            me.strStudentExamRoomIds = me.strStudentExamRoomIds.substr(0, me.strStudentExamRoomIds.length - 1);
            me.get_tblThiSinh_TinhHuongThi();
            me.toggle_edit_TinhHuongThi();
           
        }); 
     
        $("#btn_Refresh").click(function () {
            me.getList_ChiTietPhongThi('0');
        }); 
        $("#btn_XemKetQuaDiem").click(function () {
            me.getList_ChiTietPhongThi('1');
        }); 
        $("#btn_XemKetQuaDiem_DangTest").click(function () {
            me.getList_ChiTietPhongThi_dangTest('1');
        }); 
         
        $("#btnAdd_KetThucLamBai").click(function () {            
            if (me.strStudentExamRoomIds  == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }  
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.XulyTinhHuongThi('KETTHUCLAMBAI', '');
            });

            
        }); 
        $("#btnAdd_ViphamQuyCheThi").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
              
                if (edu.util.getValById("drpViPhamQuyChe") != '' && edu.util.getValById("drpViPhamQuyChe") !='3442B9AD42EC44DF85D8A2322067B2EE')
                    me.XulyTinhHuongThi('KETTHUCLAMBAI', '');
                if (edu.util.getValById("drpViPhamQuyChe") == '')
                    me.XulyTinhHuongThi('THISINHTIEPTUCLAMBAI', '');
                me.Save_ViPhamQuyCheThi();
            });

            

        }); 
        $("#btnAdd_LamLaiBaiTuDau").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.XulyTinhHuongThi('KHOITAOLAITHOIGIANLAMBAI', '');
            });

            

        }); 
        $("#btn_DoiMay").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.Save_DoiMay();
            });



        }); 
        $("#btnAdd_KhoiTaoLaiDe").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            var strExamstructPartIds = "";

            if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == '')
                strExamstructPartIds = edu.extend.getCheckedCheckBoxByClassName('chkExamStruct').toString();
            else {
                var x = document.getElementsByClassName('chkExamStruct');
                var arrChecked = [];
                for (var i = 0; i < x.length; i++) {
                    arrChecked.push(x[i].id);
                }
                strExamstructPartIds = arrChecked.toString();
            }

            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.KhoiTaoLaiDeChoThiSinh();
            });

            

        }); 
        $("#btnAdd_TamDung").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.XulyTinhHuongThi('TAMDUNGTHI', '');
            });
            

        }); 
        $("#btnAdd_TiepTucLamBai").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.XulyTinhHuongThi('THISINHTIEPTUCLAMBAI', '');
            });
            

        }); 
        $("#btnAdd_CongThemThoiGianLamBai").click(function () {
            if (me.strStudentExamRoomIds == 0) {
                edu.system.alert("Chưa chọn đối tượng?");
                return;
            }
            if (edu.util.getValById("txtCongThemThoiGianLamBai") == "")
            {
                edu.system.alert("Chưa nhập số phút?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.XulyTinhHuongThi('CONGTHEMTHOIGIANLAMBAI', edu.util.getValById("txtCongThemThoiGianLamBai"));
            });
            

        }); 
        $("#tblChiTietPhongThi").delegate(".btnChiTietThiSinh", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.rewrite_ThiSinh();
            me.toggle_edit_ThiSinh();
            me.viewEdit_ThiSinh(dt[0]);

        });
        $("#tblChiTietPhongThi").delegate(".XemDiaChiIP", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.rewrite_DiaChiIP_ThiSinh();
            me.toggle_edit_DiaChiIP_ThiSinh();
            me.viewEdit_DiaChiIP_ThiSinh(dt[0]);
            me.getList_DiaChiIP_ThiSinh(strId);

        });
        
        $("#btnSave_PhongThi").click(function () {
            
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtPhongThi", "THONGTIN1": "EM" },
                { "MA": "txtMonThi", "THONGTIN1": "EM" },
                { "MA": "txtNgayThi", "THONGTIN1": "EM" },
                { "MA": "txtTotalTime", "THONGTIN1": "EM" },
                { "MA": "drpTrangThaiPhongThi_Edit", "THONGTIN1": "EM" },
                { "MA": "drpStatus_Edit", "THONGTIN1": "EM" },
                { "MA": "drpCachTinhDiem", "THONGTIN1": "EM" },
                
            ];
           
            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            } 
            me.save_PhongThi();
        });       
        $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;              
            $('#tblChiTietPhongThi tbody').html('');
            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;
            me.strTongThoiGianCauTrucDe = edu.util.returnEmpty(dt[0].TONGTHOIGIAN);
            
            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi('0');
            me.genThongTinDeThiDaTao();
            me.getList_drpGroupQuestion_GenDeTuDeThiCoSan();
            me.getList_drpGroupQuestion_TaoDeTuDeThiThuCong();
            me.getList_drpExamStruct_GenDeTuDeThiCoSan();

            me.getList_drpGroupQuestion_GenDeTheoCauTrucDeThi();
            me.getList_drpExamStruct_GenDeTheoCauTrucDeThi();
            
            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);
                   
        });
        $("#tblPhongThi").delegate(".btnViewPhongThi", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.rewrite_PhongThi();
            me.toggle_edit_PhongThi();
            me.viewEdit_PhongThi(dt[0]); 

        });

        $("#btnAdd_PhongThi").click(function () {
            me.rewrite_PhongThi();
            if (edu.util.getValById('drpDotThi') == "") {
                edu.system.alert("Chưa chọn đợt thi");
                return;
            }
            if (edu.util.getValById('drpDotThi') == "") {
                edu.system.alert("Chưa chọn đơn vị");
                return;
            }
            edu.util.viewHTMLById("lblDonVi", $("#drpDonVi  option:selected").html());
            edu.util.viewHTMLById("lblDotThi", $("#drpDotThi option:selected").html()); 
            me.toggle_edit_PhongThi();
        });

        $("#btnImport_PhongThi").click(function () {
            me.rewrite_PhongThi();
            if (edu.util.getValById('drpDotThi') == "") {
                edu.system.alert("Chưa chọn đợt thi");
                return;
            }
            if (edu.util.getValById('drpDonVi') == "") {
                edu.system.alert("Chưa chọn đơn vị");
                return;
            }
            me.getList_PhongThi();
            edu.util.viewHTMLById("lblDonVi", $("#drpDonVi  option:selected").html());
            edu.util.viewHTMLById("lblDotThi", $("#drpDotThi option:selected").html());
            me.toggle_edit_ImportPhongThi();
        });
        
        $("#tblImportPhongThi").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            //var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
             
            me.toggle_edit_ImportPhongThi_SinhVien();
            me.getList_PhongThiImport_ThiSinhDaImport(strId);
            me.getList_PhongThiImport_ThiSinhChuaImport(strId);
            //me.viewEdit_PhongThi(dt[0]); 
        });
        $("#btnDelete_PhongThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhongThi(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_PhongThi();
            }, 2000);
        }); 
        $("#btnDelete_ThiSinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChiTietPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strId = arrChecked_Id[i];
                    var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
                    me.delete_ThiSinh(dt[0].EXAMROOMINFOID, dt[0].USERID);
                }
            });
            setTimeout(function () {
                me.getList_ChiTietPhongThi('1');
            }, 2000);
        }); 
        $("#btnAdd_CongNhanDiem").click(function () {
            if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == "")
            if (edu.util.getValById('drpExamstructPart') == "") {
                edu.system.alert("Bạn chưa chọn phần thi");
                return;
            } 
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < me.dtChiTietPhongThi.length; i++) {
                    //nếu cấu trúc có tổng thời gian thì lấy theo STUDENTEXAMROOM và ngược lại lấy theo STUDENTEXAMROOMPART
                    var strStudentExamRoomPartId = me.dtChiTietPhongThi[i].STUDENTEXAMROOMPARTID;                  
                    if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) != '')
                        strStudentExamRoomPartId = me.dtChiTietPhongThi[i].ID;

                    var strMark = edu.util.getValById("txtDiemDuocCongNhan" + strStudentExamRoomPartId);   
                    var strGhiChu = edu.util.getValById("txtGhiChu" + strStudentExamRoomPartId);
                   
                    if (edu.util.returnEmpty(me.dtChiTietPhongThi[i].MARK) != strMark)
                        me.save_CongNhanDiem(strStudentExamRoomPartId, strMark, strGhiChu);
                }
                setTimeout(function () {
                    me.getList_ChiTietPhongThi('1');
                    //me.Update_PhongThi_MucPheDuyet(me.strExamRoomInfoId, 'GVCOITHICONGNHAN');
                }, 2000);
            });
           
        }); 
        $("#btnAdd_ChuyenDuLieuDiem").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChiTietPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Bạn chưa chọn thí sinh");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strId = arrChecked_Id[i];
                    var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
                    me.ChuyenDuLieuDiem_ThiSinh(dt[0].EXAMROOMINFOID, dt[0].USERID);
                }
            });

        }); 
        
        $("[id$=chkSelectAll_PhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi" });
        });
        //$("[id$=chkSelectAll_ChoPhepXemDiem]").on("click", function () {
        //    me.checkedCol_BgRow( "tblPhongThi" );
        //});
        //$("[id$=chkSelectAll_ChoPhepXemKetQua]").on("click", function () {
        //    me.checkedCol_BgRow( "tblPhongThi" );
        //});
        me.checkedCol_BgRow("tblImportPhongThi");
         

        $("[id$=chkSelectAll_ChiTietPhongThi]").on("click", function () {
            me.checkedCol_BgRow("tblChiTietPhongThi");
        });
        
        $("#btnFileMau").click(function (e) {
            e.preventDefault();
            me.report("TEMPLATE_DANHSACHTHISINH");
        });    
        $(".btnCloseSubDetail").click(function () {

            me.toggle_edit_chitiet();
        });
        $("#btnCall_Import_DMIP").click(function () {

            if (me.strExamRoomInfoId == "") {
                edu.system.alert("Bạn chưa chọn phòng thi");
                return;
            }
            me.popup_import();
        });
        $("#btnImport_DMIP").click(function () {
            me.import_DMIP();
        });        

        edu.system.uploadImport(["txtFile_DMIP"]);
        $("#tblChiTietPhongThi").delegate('.btnChiTietBaiThi', 'click', function (e) {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.strThiSinhId = dt[0].USERID;  
            me.strStudentExamRoomId = strId;
            e.stopImmediatePropagation();  
            $("#zoneChiTiet").hide();
            $("#zoneKetQuaThi").slideDown();
            me.gen_KetQuaThi();
            
            //$(".zone-bus").hide();
            //edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThu.changeWidthPrint);
        });
        $("#btnClose_KetQuaThi").click(function (e) {
            e.stopImmediatePropagation();
            me.closeKetQuaThi();
        });
        //#region tab_GenDeTuDeThiCoSan
        $("#drpGroupQuestion_GenDeTuDeThiCoSan").on("select2:select", function () {
            me.strWritenExamId = '';
            me.getList_drpExamStruct_GenDeTuDeThiCoSan();
        });
        $("#drpExamStruct_GenDeTuDeThiCoSan").on("select2:select", function () {            
            me.strWritenExamId = '';
            me.getList_GenDeTuDeThiCoSan();
        });
        $("#drpExamstructPart").on("select2:select", function () {            
            me.getList_ChiTietPhongThi("1");
        });
        $("#drpHocKy").on("select2:select", function () {
            me.getList_drpDotThi();
        });
        $("#drpDotThi").on("select2:select", function () {
            me.getList_drpHocPhan_TheoDotThi();
        });
        $("#drpNamHoc").on("select2:select", function () {
            me.getList_drpHocKy();
        });
        $(document).delegate('.optradio', 'click', function () {
            
            me.strWritenExamId = $(this).attr('id');    
            me.strKieuTaoDe ='GenDeTuDeThiCoSan';
        });
        $(document).delegate('.optradioDeThiThuCong', 'click', function () {
             
            me.strDeThiThuCongId = $(this).attr('id');
           
        });

        $("#btnSave_GenDeTuDeThiCoSan").click(function () {
            if (me.strWritenExamId == '') {
                edu.system.alert("Bạn chưa chọn đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDeTuDeThiCoSan();
                
            });
            
        });
        $("#btnTaiFile_Main").click(function () {
            var selectedValue = $("#drpBaoCao_Main").find('option:selected').val();
            me.report(selectedValue);
        });
        $("#btnAdd_MatKhauPhanThi").click(function () { 
            
            $("#zoneMatKhauDeThi input").each(function (e) {
                me.CapNhatMatKhauPhanThi(me.strExamRoomInfoId, this.id.substr(3, this.id.length - 1), this.value);
            });

            
        });
        //#endregion
        $("#drpGroupQuestion_TaoDeTuDeThiThuCong").on("select2:select", function () {
            me.getList_GenDeTuDeThiThuCong();


        });
        $("#btnSave_GenDeTuDeThiThuCong").click(function () {
            if (me.strDeThiThuCongId == '') {
                edu.system.alert("Bạn chưa chọn đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDeTuDeThiThuCong();

            });

        });
        $("#btnSave_GenDeThiSinhTuDeThiThuCong").click(function () {
            if (me.strDeThiThuCongId == '') {
                edu.system.alert("Bạn chưa chọn đề để tạo?");
                return;
            }            

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDeThiSinhTuDeThiThuCong();

            });

        });
        $("#btnSave_ThucHienGenLayNDeTuDeThiThuCong").click(function () {
            if (me.strDeThiThuCongId == '') {
                edu.system.alert("Bạn chưa chọn đề để tạo?");
                return;
            }
            if (edu.util.getValById("txtSoDeThiNgauNhienLayRa") == '') {
                edu.system.alert("Bạn chưa nhập số đề lấy ra?");
                return;
            }
            var dt = edu.util.objGetDataInData(me.strDeThiThuCongId, me.dtDeThiThuCong, "ID");
            if (parseInt(dt[0].SODETAO) < parseInt(edu.util.getValById("txtSoDeThiNgauNhienLayRa"))) {
                edu.system.alert("Số đề lấy ra lớn hơn đề đã tạo?");
                return;
            }
           

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenLayNDeTuDeThiThuCong();

            });

        });
        //#region tab_GenDeTuDeThiCoSan
        $("#drpGroupQuestion_GenDeTheoCauTrucDeThi").on("select2:select", function () {
            me.getList_drpExamStruct_GenDeTheoCauTrucDeThi();
            
            
        });
        $("#drpExamStruct_GenDeTheoCauTrucDeThi").on("select2:select", function () {            
            me.getList_GenDeTheoCauTrucDeThi();
            
        });
        $("#btnSave_GenDeTheoCauTrucDeThi_NgauNhien").click(function () {
            if (edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi') == '') {
                edu.system.alert("Bạn chưa chọn cấu trúc đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDe_NgauNhien();
            });

        });
        $("#btnSave_GenDeTheoCauTrucDeThi_CungDe").click(function () {
            if (edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi') == '') {
                edu.system.alert("Bạn chưa chọn cấu trúc đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDe_CungDe();
            });

        });
        $("#drpHocPhan").on("select2:select", function () {
            
            var strId = $("#drpHocPhan").val(); 
            var dt = edu.util.objGetDataInData(strId, me.dtHocPhan, "ID");
            
            $("#txtCourseName").val(dt[0].TEN); 
            $("#txtCourseCode").val(dt[0].MA);
            $("#txtCourseCredit").val(dt[0].HOCTRINH); 
             
        });
        //#endregion
        $("#btnIn_DeThiCuaThiSinh").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnTaiFile").click(function () {
            var selectedValue = $("#drpBaoCao").find('option:selected').val();
            me.report($("#drpBaoCao").val());
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {
                        
            me.getList_dropSearch_LoaiDiem();
            me.getList_dropSearch_HinhThuc();
            me.getList_dropSearch_DotThi();
            me.getList_dropSearch_MonThi();
        });
        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
             
            me.getList_dropSearch_HinhThuc();
            me.getList_dropSearch_DotThi();
            me.getList_dropSearch_MonThi();
        });
        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
             
            me.getList_dropSearch_DotThi();
            me.getList_dropSearch_MonThi();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {             
            me.getList_dropSearch_MonThi();
        });
        $("#btnAdd_ImportPhongThi").click(function () {
          
            var arrChecked_Id = edu.util.getArrCheckedIds("tblImportPhongThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Bạn chưa chọn phòng thi");
                return;
            }
            var strLoi = "";
            var strId = "";
            var strMatKhauChoPhongThi = "";
            var strCachTinhDiem = "THEOSOY";
            var ChoPhepXemDiem = "";
            var ChoPhepXemKetQuaTraLoi = ""; 

             
           
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strId = arrChecked_Id[i];
                strMatKhauChoPhongThi = edu.util.getValById("txtMatKhauPhongThi" + arrChecked_Id[i]);
                ChoPhepXemKetQuaTraLoi = 0;
                if ($("#checkChoPhepXemKetQua" + arrChecked_Id[i]).is(":checked"))
                    ChoPhepXemKetQuaTraLoi = "1";  
                ChoPhepXemDiem = 0;
                if ($("#checkChoPhepXemDiem" + arrChecked_Id[i]).is(":checked"))
                    ChoPhepXemDiem = "1";  
                if ($("#checkTheoSoCau" + arrChecked_Id[i]).is(":checked"))
                    strCachTinhDiem = "THEOSOCAU";
             
                me.DongBoDuLieuPhongThi(strId, strMatKhauChoPhongThi, strCachTinhDiem, ChoPhepXemDiem, ChoPhepXemKetQuaTraLoi) ;
            }
        });
        $("#drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi").on("select2:select", function () {
            me.strWritenExamId_CacPhongThi = '';
            
            me.getList_drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi();
        });
        $("#drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi").on("select2:select", function () {
            me.strWritenExamId_CacPhongThi = '';
            me.getList_GenDeTuDeThiCoSan_CacPhongThi();
        });
        $("#drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi").on("select2:select", function () {
            me.getList_drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi();


        });
        $("#drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi").on("select2:select", function () {
            me.getList_GenDeTheoCauTrucDeThi_CacPhongThi();

        });
        $(document).delegate('.optradio_CacPhongThi', 'click', function () {

            me.strWritenExamId_CacPhongThi = $(this).attr('id');
            me.strKieuTaoDe = 'GenDeTuDeThiCoSan';
        });
        $("#btnSave_GenDeTuDeThiCoSan_CacPhongThi").click(function () {
            if (me.strWritenExamId_CacPhongThi == '') {
                edu.system.alert("Bạn chưa chọn đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDeTuDeThiCoSan_CacPhongThi();

            });

        });
        $("#btnSave_GenDeTheoCauTrucDeThi_NgauNhien_CacPhongThi").click(function () {
            if (edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi') == '') {
                edu.system.alert("Bạn chưa chọn cấu trúc đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDe_NgauNhien_CacPhongThi();
            });

        });
        $("#btnSave_GenDeTheoCauTrucDeThi_CungDe_CacPhongThi").click(function () {
            if (edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi') == '') {
                edu.system.alert("Bạn chưa chọn cấu trúc đề để tạo?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn tạo đề?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.ThucHienGenDe_CungDe_CacPhongThi();
            });

        });
        $("#btnBaoCaoLocTheoDuLieu").click(function () {
            var selectedValue ="BAOCAOLOCTHEODULIEU";
            me.report(selectedValue);
        });
        $("#btnShowAdd_CanBoCoiThi").click(function () { 
            edu.util.toggle_overide("zone-bus", "zoneCanBoCoiThi");

        });
        $("#btnShowAdd_CanBoChamThi").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneCanBoChamThi");

        });
        $(".btnClose_CBCT").click(function () {
            edu.util.toggle_overide("zone-bus", "zonePhongThi");
        });
        $("#btnSearch_CanBoCoiThi").click(function () {
            me.getList_SearchCanBoCoiThi();
        });
        $("#btnAdd_CanBoCoiThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTimKiemCanBoCoiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thêm?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Them_CanBoCoiThi(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_CanBoCoiThi();
                }, 1000);
            });

            
        });
        $("#btnDelete_CBCT").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoCoiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_CanBoCoiThi(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_CanBoCoiThi();
                }, 1000);
            });
            
        }); 
        $("#btnDelete_ChamThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoChamThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_CanBoChamThi(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_CanBoChamThi();
                }, 1000);
            });
            
        }); 
        $("#btnSearch_CanBoChamThi").click(function () {
            me.getList_SearchCanBoChamThi();
        });
        $("#btnAdd_CanBoChamThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTimKiemCanBoChamThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thêm?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Them_CanBoChamThi(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_CanBoChamThi();
                }, 1000);
            });


        });
        edu.system.getList_MauImport("zonebtnBaoCao", function (addKeyValue) {
            var strExamRoomInfoIds = "";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strExamRoomInfoIds += arrChecked_Id[i] + ";";
            }
            strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);

            var obj_list = {
                'ExamRoomInfo_Id': me.strExamRoomInfoId,
                'strExamRoomInfoIds': strExamRoomInfoIds,
                'ExamstructPartId': edu.util.getValById('drpExamstructPart'),
                'BAOCAOLOCTHEODULIEU': edu.util.getValById("txtBaoCaoLocTheoDuLieu"),                 
                 
                 
                'strNguoiDangNhap_Id': edu.system.userId,
                'strChucNang_Id': edu.system.strChucNang_Id,
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
    },
    page_load: function () {        
        var me = this;
        edu.system.page_load();
        me.getList_drpDonVi();
        me.getList_drpNamHoc();
        me.getList_drpHocKy();
        me.getList_drpDotThi();
        me.get_drpViPhamQuyChe();
        me.getList_drpHocPhan();
        me.getList_dropSearch_ThoiGian();
        me.getList_dropSearch_LoaiDiem();
        me.getList_dropSearch_HinhThuc();
        me.getList_dropSearch_DotThi();
        me.getList_dropSearch_MonThi();
     

    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit_chitiet: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneChiTiet");
    },  
   
    toggle_edit_ThiSinh: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneThiSinh");
    }, 
    toggle_edit_DiaChiIP_ThiSinh: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneDiaChiIP_ThiSinh");
    }, 
    toggle_edit_TaoDeThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneTaoDeThi");
    },
    toggle_edit_TinhHuongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneTinhHuongThi");
    },
    
    
    rewrite_ThiSinh: function () {
        var me = this;     
        me.strThiSinhId = "#";
        edu.util.viewValById("txtStudentCode", "");
        edu.util.viewValById("txtLastName", "");
        edu.util.viewValById("txtFirtName", "");
        edu.util.viewValById("txtClassName", "");
        edu.util.viewValById("txtSoBaoDanh", "");
        edu.util.viewValById("txtBirthDate", ""); 
    },
    viewEdit_ThiSinh: function (dt) {
        var me = this;
        me.strThiSinhId = dt.USERID;        
        edu.util.viewValById("txtStudentCode", dt.STUDENTCODE);
        edu.util.viewValById("txtLastName", dt.HODEM);
        edu.util.viewValById("txtFirtName", dt.TEN);
        edu.util.viewValById("txtClassName", dt.CLASSNAMEIMPORT);
        edu.util.viewValById("txtSoBaoDanh", dt.SOBAODANHIMPORT);
        edu.util.viewValById("txtBirthDate", dt.BIRTHDATE_USER);
    },

    rewrite_DiaChiIP_ThiSinh: function () {
        var me = this;
        me.strThiSinhId = "#";

        $("#lblStudentCode").html('');
        $("#lblHoTen").html(''); 
        $("#lblClassName").html('');
        $("#lblSoBaoDanh").html('');
        $("#lblBirthDate").html('');  
    },
    viewEdit_DiaChiIP_ThiSinh: function (dt) {
        var me = this;
        me.strThiSinhId = dt.USERID;
         
        $("#lblStudentCode").html(dt.STUDENTCODE);
        $("#lblHoTen").html(dt.HODEM + ' ' + dt.TEN); 
        $("#lblClassName").html(dt.CLASSNAMEIMPORT);
        $("#lblSoBaoDanh").html(dt.SOBAODANHIMPORT);
        $("#lblBirthDate").html(dt.BIRTHDATE_USER);  
    },

    viewEdit_PhongThi: function (dt) {
        var me = this;
        me.strExamRoomInfoId = dt.ID;
        
        edu.util.viewHTMLById("lblDonVi", dt.TENDONVI);
        edu.util.viewHTMLById("lblDotThi", dt.TENDOTTHI);        
        edu.util.viewValById("txtRoomName", dt.ROOMNAME);
        edu.util.viewValById("txtCourseName", dt.COURSENAME);
        edu.util.viewValById("txtCourseCode", dt.COURSECODE);   
        edu.util.viewValById("txtCourseCredit", dt.COURSECREDIT);         
        edu.util.viewValById("txtCodeDST", dt.CODEDST);         
        edu.util.viewValById("txtRoomTitle", dt.ROOMTITLE);   
        edu.util.viewValById("txtRoomHelp", dt.ROOMHELP);   
        edu.util.viewValById("txtTeacher1", dt.TEACHER1);   
        edu.util.viewValById("txtTeacher2", dt.TEACHER2);   
        edu.util.viewValById("txtExamDate", dt.EXAMDATE);   
        edu.util.viewValById("txtTotalTime", dt.TOTALTIME);   
        edu.util.viewValById("txtSoDiemLe", dt.SODIEMLE);   
        edu.util.viewValById("txtThangDiem", dt.THANGDIEM);
        me.getList_CanBoCoiThi();
        me.getList_CanBoChamThi();
        edu.util.viewValById("txtMatKhauChoPhongThi", dt.MATKHAUCHOPHONGTHI);   
         if (dt.CHOPHEPXEMDIEM == "1")
             $("#chkChoPhepXemDiem").prop("checked", true);
        else
             $("#chkChoPhepXemDiem").prop("checked", false); 

        if (dt.CHOPHEPXEMKETQUATRALOI == "1")
            $("#chkChoPhepXemKetQuaTraLoi").prop("checked", true);
        else
            $("#chkChoPhepXemKetQuaTraLoi").prop("checked", false); 
         
        $("#drpTrangThaiPhongThi_Edit").val(dt.OPENSTATUS).change();   
        $("#drpStatus_Edit").val(dt.STATUS).change();
        $("#drpHocPhan").val(dt.HOCPHANID).change();
      
         
        
        $("#drpCachTinhDiem").val(dt.CACHTINHDIEM).change();  
    },
    toggle_edit_PhongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonePhongThi");
    },  
    toggle_edit_ImportPhongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImportPhongThi");
    },
    toggle_edit_ImportPhongThi_SinhVien: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImportPhongThi_SinhVien");
    },  
    toggle_batdau_ImportPhongThi_SinhVien: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImportPhongThi");
    },
    rewrite_PhongThi: function () {
        var me = this;
        me.strExamRoomInfoId = '';
        edu.util.viewHTMLById("lblDonVi", "");
        edu.util.viewHTMLById("lblDotThi", "");
        edu.util.viewValById("txtRoomName", "");
        edu.util.viewValById("txtCourseName", "");
        edu.util.viewValById("txtCourseCredit", "");
        edu.util.viewValById("txtCourseCode", "");   
        edu.util.viewValById("txtCodeDST", "");
        edu.util.viewValById("txtRoomTitle", "");
        edu.util.viewValById("txtRoomHelp", "");
        edu.util.viewValById("txtTeacher1", "");
        edu.util.viewValById("txtTeacher2", "");
        edu.util.viewValById("txtExamDate", "");
        edu.util.viewValById("txtTotalTime", "");
        edu.util.viewValById("txtSoDiemLe", "");
        edu.util.viewValById("txtThangDiem", "");
        edu.util.viewValById("txtMatKhauChoPhongThi", "");
        $("#chkChoPhepXemDiem").prop("checked", true);
        $("#chkChoPhepXemKetQuaTraLoi").prop("checked", false);
        //$("#chkChoPhepXemDiem").attr("checked", true);
        //$("#chkChoPhepXemKetQuaTraLoi").attr("checked",false);
        $("#drpTrangThaiPhongThi_Edit").val("").change();
        $("#drpStatus_Edit").val("").change();
        
        
        $("#drpCachTinhDiem").val("").change();

    },

    getList_ChiTietPhongThi: function (strCoTinhLaiDiem) {
        var me = this;

        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");
      
        edu.util.viewHTMLById("lblDonVi_ChiTiet", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_ChiTiet", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_ChiTiet", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_ChiTiet", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_ChiTiet", dt[0].EXAMDATE);


        edu.util.viewHTMLById("lblDonVi_TaoDeThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeThi", dt[0].EXAMDATE);

        edu.util.viewHTMLById("lblDonVi_TaoDeTuDeThiThuCong", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeTuDeThiThuCong", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeTuDeThiThuCong", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeTuDeThiThuCong", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeTuDeThiThuCong", dt[0].EXAMDATE);



        edu.util.viewHTMLById("lblDonVi_TinhHuongThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TinhHuongThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TinhHuongThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TinhHuongThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TinhHuongThi", dt[0].EXAMDATE);


        me.strMatKhauChoPhongThi = dt[0].MATKHAUCHOPHONGTHI;
     
       
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",            
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiTao_Id': edu.system.userId,
            'strCoTinhLaiDiem': strCoTinhLaiDiem,
            'strExamStructPartId': edu.util.getValById('drpExamstructPart'),
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        }; 
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.dtChiTietPhongThi = data.Data.ChiTietPhongThi;
                   
                    me.dtStudentFiles = data.Data.StudentFiles;
                    me.genTable_ChiTietPhongThi(strCoTinhLaiDiem, me.dtChiTietPhongThi, data.Pager);
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
    genTable_ChiTietPhongThi: function (strCoTinhLaiDiem, data, iPager) {
        var me = this;
        var iSoThiSinhDuThi = 0;
        var iSoThiSinhKhongDat = 0;
        var iSoThiSinhDat = 0;
        var ranChar = me.randomString(3, "");


        $("#tblChiTietPhongThi tbody").html("");
        $("#tblChiTietPhongThi tfoot").html('<tr role="row" style="text-align:center; font-weight: bold; color:#007acc"><td style="text-align:center; font-weight: bold;" colspan="6">Tổng số: ' + iSoThiSinhDuThi + '</td><td style="text-align:center; font-weight: bold;" colspan="3">Số Đạt: ' + iSoThiSinhDat + '</td><td style="text-align:center; font-weight: bold;" colspan="4">Số Không Đạt: ' + iSoThiSinhKhongDat + '</td></tr>');
       
        var jsonForm = {
            strTable_Id: "tblChiTietPhongThi",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_ChiTietPhongThi('" + strCoTinhLaiDiem+"')",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
                right:[6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                    
                        var html = '<span><img src="' + edu.system.rootPath + '/Upload/Avatar/avata-user.png" class= "table-img" id="sl_hinhanh' + aData.STUDENTCODE + '" /></span>';
                        
                        return '<a>' + html + '</br>' + aData.STUDENTCODE  +'</a>'; 
                    }
                     
                  
                },
                {
                    "mRender": function (nRow, aData) {
                        var strReturn = '<span><a class="btn btn-default btnChiTietThiSinh" id="' + aData.ID + '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i>' + aData.FULLNAME + '</a></span>';
                        if (aData.COTRONGLICHTHI == "0")
                            strReturn = '<span><a class="btn btn-default btnChiTietThiSinh" id="' + aData.ID + '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i><span style="color:red">' + aData.FULLNAME + '</span></a></span>';
                        if (aData.GIANLAN == '1')
                            strReturn += "</br> <p class='cssGianLan XemDiaChiIP' id='" + aData.ID+"'>Gian lận</p>";
                        return strReturn;
                    }
                     
                },
                {
                    "mDataProp": "BIRTHDATE_USER"
                },
                {
                    "mDataProp": "SOBAODANHIMPORT"
                },
                {
                    "mDataProp": "DETHITHU"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        var timeMinute = aData.TIMERCOUNTDOWN;                      
                        if (parseInt(timeMinute) < 0 || aData.FINISHED == "1")                      
                            strHTML = (aData.DIEMTINH == "" || aData.DIEMTINH == null) ? "" : aData.DIEMTINH;
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        var timeMinute = aData.TIMERCOUNTDOWN;
                        var strDiem = "";
                        //console.log(aData.MARK);
                        //if (aData.USERID == '4CB1D96B1D804A29AB35095986A282F5') {
                        //    debugger;
                        //}
                        var strTextMarkId = aData.STUDENTEXAMROOMPARTID;                       

                        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) != '')
                            strTextMarkId = aData.ID;
                        if (edu.util.returnEmpty(aData.MARK) == "") {
                            if (parseInt(timeMinute) < 0 || aData.FINISHED == "1") {
                                strDiem =''+ edu.util.returnEmpty(aData.MARK) == "" ? edu.util.returnEmpty(aData.DIEMTINH) : edu.util.returnEmpty(aData.MARK);
                                strHTML = '<input type ="text" id="txtDiemDuocCongNhan' + strTextMarkId + '" value ="' + strDiem + '" class="form-control" />';
                            }
                            else {
                                strHTML = '<input type ="text" id="txtDiemDuocCongNhan' + strTextMarkId + '" class="form-control" />';
                            }
                        }
                        else {
                            strHTML = '<input type ="text" id="txtDiemDuocCongNhan' + strTextMarkId + '" value ="' + aData.MARK + '" class="form-control" />';
                        }  
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                       
                        var strHTML = ""; 
                        var idTimer = "timer" + aData.ID.toString()+ ranChar;
                        var timeMinute = aData.TIMERCOUNTDOWN;
                       
                        if (parseFloat(aData.THOIGIANCONLAI) > 0)  
                        {
                            if (timeMinute != "" && timeMinute != null && timeMinute != "0") {
                                if (parseInt(timeMinute) > 0 && aData.FINISHED == "0")  
                                    strHTML += "<span style='text-align:center' id='" + idTimer + "'></span>"; 
                               
                                else  
                                    strHTML += "<span style='text-align:center'>--:--</span>"; 
                            }
                        }
                        else if  (parseInt(timeMinute) <= 0)
                            strHTML = "<span style='color: Violet' >Kết thúc</span>"; 
                        if (aData.TIMESTARTDOEXAM_TEXT == null || aData.TIMESTARTDOEXAM_TEXT == '')
                            strHTML = "<span style='color: Green' >Chưa thi</span>";                        
                        if (aData.FINISHED == "1")
                            strHTML = "<span style='color: red' >Thi xong</span>";   
                        
                        if (aData.FINISHED != "1" && aData.STATUS == "TAMDUNGTHI" )
                            strHTML = "<span style='color: red' >Tạm dừng thi</span>";   
                        
                       
                        if (timeMinute != "" && timeMinute != null && timeMinute != "0" && parseInt(timeMinute) > 0 && aData.FINISHED == "0") {
                            $("#" + idTimer).html("");
                            me.countdown(aData.TIMERSHOW, idTimer);
                        }
                        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == '')
                        if (edu.util.getValById("drpExamstructPart") == "")
                            strHTML = "";
                        return strHTML; 
                    }
                },
                {
                    "mDataProp": "TIMEHHMISSSTARTDOEXAM"
                },
                {
                    "mDataProp": "DIACHIIPMAYDADANGNHAP"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        if (edu.util.returnEmpty(aData.TENVIPHAMQUYCHETHI) != "")
                            strHTML = "<span style='color:red;'>" + aData.TENVIPHAMQUYCHETHI + "</span>";
                        strHTML += '<input type ="text" id="txtGhiChu' + aData.STUDENTEXAMROOMPARTID + '" value ="' + edu.util.returnEmpty(aData.GHICHU) + '" class="form-control" />';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nRow, aData) { 
                        var dt = edu.util.objGetDataInData(aData.STUDENTEXAMROOMPARTID, me.dtStudentFiles, "DULIEU_ID");
                        var rootPathUploadFile = edu.system.rootPathUpload;
                        var strReturn = "";
                        if (dt.length > 0) {
                            for (var idl = 0; idl < dt.length; idl++)
                                strReturn += '<a id="' + dt[idl].ID + '" href="' + rootPathUploadFile + '/' + dt[idl].DUONGDAN + '">' + dt[idl].TENHIENTHI + '</a>';
                             
                        }

                        strReturn += '<span><a class="btn btn-default btnChiTietBaiThi" id="' + aData.ID + '" title="Chi tiết bài thi"><i class="fa fa-eye color-active"></i>Chi tiết bài thi</a></span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" style="display:none" class="checkStudentExamRoomPartID" id="checkStudentExamRoomPartID' + aData.STUDENTEXAMROOMPARTID + '" value="' + aData.STUDENTEXAMROOMPARTID+'"/>'+
                        '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_drpDonVi: function () {
        var me = this;
        
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_DonViByUserId',            
            'strUserId': edu.system.userId,
            
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDonVi(data.Data);
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
    genList_drpDonVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpDotThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DoThiByHocKy',
            'strStatus': '1',
            'strHocKy': edu.util.getValById("drpHocKy"),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDotThi(data.Data);
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
    genList_drpDotThi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotThi"],
            type: "",
            title: "Đợt thi"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getList_PhongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ThongTinPhongThi',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi'),
            'strDotThi_Id': edu.util.getValById('drpDotThi'),
            'strTrangThaiPhongThi': edu.util.getValById('drpTrangThaiPhongThi'),
            'strStatus': edu.util.getValById('drpStatus'),
            'strHocPhanId': edu.util.getValById('drpHocPhan_DotThi'),             
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;

                    me.genTable_PhongThi(data.Data, data.Pager);
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
    genTable_PhongThi: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_PhongThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.OPENSTATUS == "0" ? "Đóng" : "Mở";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.STATUS == "0" ? "Ẩn" : "Hiện";
                    }
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewPhongThi" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i> Sửa</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_CanBoCoiThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_NhanSuCoiThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId, 
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.genTable_CanBoCoiThi(data.Data, data.Pager);
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
    genTable_CanBoCoiThi: function (data, iPager) {
        var me = this;
        $("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCanBoCoiThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_CanBoCoiThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, ],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "TENDONVI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    save_PhongThi: function () {
        var me = this;
        if (me.strExamRoomInfoId == "") {
            if (edu.util.getValById('drpDotThi') == "")
                edu.util.alert("Chưa chọn đợt thi");
            if (edu.util.getValById('drpDotThi') == "")
                edu.util.alert("Chưa chọn đơn vị");
        }
        
        var ChoPhepXemDiem = $("#chkChoPhepXemDiem").is(":checked") == true ? "1" : "0";
         var ChoPhepXemKetQuaTraLoi = $("#chkChoPhepXemKetQuaTraLoi").is(":checked") == true ? "1" : "0";
        var obj_save = {
            'action': 'QLTTN_QuanLyThi/Them_PhongThi',
            'versionAPI': 'v1.0',
            'strId': "",
            'strRoomName': edu.util.getValById('txtRoomName'),        
            'strCourseName': edu.util.getValById('txtCourseName'),
            'strRoomTitle': edu.util.getValById('txtRoomTitle'),
            'strRoomHelp': edu.util.getValById('txtRoomHelp'),
            'strTeacher1': edu.util.getValById('txtTeacher1'),
            'strTeacher2': edu.util.getValById('txtTeacher2'),
            'strExamDate': edu.util.getValById('txtExamDate'),
            'strTotalTime': edu.util.getValById('txtTotalTime'),
            'strExamScheduleId': edu.util.getValById('drpDotThi'),
            'strDepartOrganId': edu.util.getValById('drpDonVi'),
            'ChoPhepXemDiem': ChoPhepXemDiem,
            'ChoPhepXemKetQuaTraLoi': ChoPhepXemKetQuaTraLoi,
            'strSoDiemLe': edu.util.getValById('txtSoDiemLe'),
            'strThangDiem': edu.util.getValById('txtThangDiem'),
            'strMatKhauChoPhongThi': edu.util.getValById('txtMatKhauChoPhongThi'),
            'strCourseCode': edu.util.getValById('txtCourseCode'),
            'strCourseCredit': edu.util.getValById('txtCourseCredit'),
            'strCodeDST': edu.util.getValById('txtCodeDST'),
            'strOpenstatus': edu.util.getValById('drpTrangThaiPhongThi_Edit'),
            'strStatus': edu.util.getValById('drpStatus_Edit'), 
            'strCachTinhDiem': edu.util.getValById('drpCachTinhDiem'),             
            'strHocPhanId': edu.util.getValById('drpHocPhan'),             
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strExamRoomInfoId != "") {
            obj_save.action = 'QLTTN_QuanLyThi/Sua_PhongThi';
            obj_save.strId = me.strExamRoomInfoId;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strExamRoomInfoId = data.ID;
                    me.getList_PhongThi();
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_PhongThi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Xoa_PhongThi',
            'versionAPI': 'v1.0',
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
    ThaoTacPhongThi_PhongThi: function (strIds,strThaoTacPhongThi) { 
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoIds': strIds,
            'strThaoTacPhongThi': strThaoTacPhongThi,
            'strNguoiThucHien_Id': edu.system.userId


        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
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
    ThaoTacPhongThi_KhoiTaoDeThi: function (strIds) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThaoTacPhongThi_PhongThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': strIds,            
            'strNguoiThucHien_Id': edu.system.userId


        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
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
    report: function (strLoaiBaoCao) {

        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        
        //if (strLoaiBaoCao != "TEMPLATE_DANHSACHTHISINH") {
        //    if (edu.util.getValById("drpExamstructPart") == "") {
        //        edu.system.alert("Bạn chưa chọn phần thi");
        //        return;
        //    }
        //}
          if (strLoaiBaoCao == "") { 
                edu.system.alert("Bạn chưa chọn mẫu báo cáo");
                return; 
        }
        
        if (strLoaiBaoCao == "BAOCAODIEM_NHIEUPHONG_CACPHANTHI") {
            $('#zoneMaXacNhan').modal('show');
            if ($("#lblMaXacNhan").html() != edu.util.getValById("txtMaXacNhan"))
                return;
            else {
                $("#lblMaXacNhan").html(me.randomString(5, ""));
                $('#zoneMaXacNhan').modal('hide');
            }
        }
        
        addKeyValue("BAOCAOLOCTHEODULIEU", edu.util.getValById("txtBaoCaoLocTheoDuLieu"));
        addKeyValue("ExamRoomInfo_Id", me.strExamRoomInfoId);
        addKeyValue("ExamstructPartId", edu.util.getValById("drpExamstructPart")); 
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        addKeyValue("tokenJWT", edu.system.tokenJWT);

        var strExamRoomInfoIds = "";
        var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
        for (var i = 0; i < arrChecked_Id.length; i++) {
            strExamRoomInfoIds += arrChecked_Id[i] + ";";
        }
        strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);

        addKeyValue("strExamRoomInfoIds", strExamRoomInfoIds);
        


        var obj_save = {
            'strTuKhoa': arrTuKhoa.toString(),
            'strDuLieu': arrDuLieu.toString(),
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
                        location.href = url_report;
                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
    import_DMIP: function (a, strPath) {
        var me = this;
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/Import_StudentExamRoom',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId, 
            'strMatKhauChoPhongThi': me.strMatKhauChoPhongThi,
            'NguoiThucHien_Id': edu.system.userId,
            'strPath': $("#txtFile_DMIP").val()
        };
        //
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtErr = data.Data.Table1;
                    var dtThanhCong = data.Data.Table2;
                    $("#notify_import").html("Đã import dữ liệu: " + data.Message);
                    me.getList_ChiTietPhongThi('1');
                    edu.system.viewFiles("txtFile_DMIP", "");
                    
                    me.toggle_import();
                  //  console.log(dtThanhCong);
                    if (dtErr.length > 0) {
                        
                        me.genTable_Import_View(dtErr, "tblImport_ThatBai");
                        me.genTable_Import_View(dtThanhCong, "tblImport_ThanhCong");
                    }
                    else
                        me.genTable_Import_View(dtThanhCong, "tblImport_ThanhCong");

                   
                    //if (me.dtErr.length > 0)
                    //  me.report("DANHSACHCAUHOIIMPORTLOI");
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                edu.system.endLoading();

            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("QLTTN_QuanLyThi/ImportNganHangCauHoi_Temp(er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    popup_import: function () {
        $("#btnNotifyModal").remove();
        $('#myModal_Upload').modal('show');
        $("#notify_import").html('');
    },
    genTable_Import_View: function (data, strTable) {
        if (data == undefined || data.length == 0) {
            $("#" + strTable + "_Tong").html("");                   
            $("#" + strTable + " tbody").html("");
        }
        else {
            $("#" + strTable + "_Tong").html(data.length);
            var row = "";
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(x) + '</td>';
            }
            row += '</tr>';
            for (var i = 0; i < data.length; i++) {
                row += '<tr>';
                for (var x in data[0]) {
                    row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
                }
                row += '</tr>';
            }
            $("#" + strTable + " tbody").html(row);
        }
        
    },  
    toggle_import: function () {
        $("#myModal_Upload").modal("hide");
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImport");



    },

    save_ThiSinh: function (ThiSinhId) {
        var me = this;
        if (me.strExamRoomInfoId == "") { 
                edu.util.alert("Chưa chọn phòng thi");
        }
        
        
        var obj_save = {
            'action': 'QLTTN_QuanLyThi/ThemMoiCapNhat_StudentExamRoom',
            'versionAPI': 'v1.0',
            'strId': ThiSinhId,
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strStudentCode': edu.util.getValById("txtStudentCode"),
            'strLastName': edu.util.getValById("txtLastName"),
            'strFirtName': edu.util.getValById("txtFirtName"),
            'strClassName': edu.util.getValById("txtClassName"),
            'strSoBaoDanh': edu.util.getValById("txtSoBaoDanh"),
            'strBirthDate': edu.util.getValById("txtBirthDate"),            
            'strDatMatKhauChoPhongThi': me.strMatKhauChoPhongThi,
            'strThi_DanhsachSinhVien_Id':"",
            'strNguoiThucHien_Id': edu.system.userId
        };
        
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.getList_ChiTietPhongThi('1');
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThiSinh: function (ExamRoomInfoId, ThiSinhId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Xoa_ThiSinhKhoiPhongThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': ExamRoomInfoId,
            'strUserId': ThiSinhId,
            'strNguoiThucHien_Id': edu.system.userId
        };
       
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    
                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
    save_CongNhanDiem: function (strStudentExamRoomPartId, strMark, strGhiChu) {
        var me = this;
        //--Edit 
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Sua_CongNhanDiem',
            'versionAPI': 'v1.0',
            'strId': strStudentExamRoomPartId,
            'strMark': strMark,
            'strGhiChu': strGhiChu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) != '')
            obj_delete = {
                'action': 'QLTTN_QuanLyThi/Sua_CongNhanDiem_ALL',
                'versionAPI': 'v1.0',
                'strId': strStudentExamRoomPartId,
                'strMark': strMark,
                'strGhiChu': strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId
            };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
    closeKetQuaThi: function () {
        var me = this;        
        $("#zoneChiTiet").show();
        $("#zoneKetQuaThi").slideUp();
    },
    gen_KetQuaThi: function () {
        var me = this;
        
        var obj_list = {
            'action': 'TTN_ThiSinh/gen_KetQuaThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strStudentExamRoomId': me.strStudentExamRoomId,
            'strThiSinhId': me.strThiSinhId,
            'strUserId': edu.system.userId,

        }; 
         
        $("#ThongTinBaiThi").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinBaiThi").html(data.Data); 
                    //MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ThongTinBaiThi']);
                    MathJax.typesetPromise([document.getElementById('ThongTinBaiThi')]);
                }
                else {
                    edu.system.alert(data.Message);
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
    //#region tab_GenDeTuDeThiCoSan
    getList_drpGroupQuestion_GenDeTuDeThiCoSan: function () {
        var me = this;
        
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': me.strDepartOrganId,
            'strStatus': '1',
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {                    
                    me.gen_drpGroupQuestion_GenDeTuDeThiCoSan(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestion_GenDeTuDeThiCoSan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAMECODE",
                code: "GROUPQUESTIONNAMECODE",
                order: "unorder"
            },
            renderPlace: ["drpGroupQuestion_GenDeTuDeThiCoSan"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpGroupQuestion_TaoDeTuDeThiThuCong: function () {
        var me = this;

        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': me.strDepartOrganId,
            'strStatus': '1',
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpGroupQuestion_TaoDeTuDeThiThuCong(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestion_TaoDeTuDeThiThuCong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAME",
                code: "GROUPQUESTIONNAME",
                order: "unorder"
            },
            renderPlace: ["drpGroupQuestion_TaoDeTuDeThiThuCong"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpExamStruct_GenDeTuDeThiCoSan: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_ExamStruct',
            'versionAPI': 'v1.0',
            'strDepartorganId': me.strDepartOrganId,
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestion_GenDeTuDeThiCoSan'),
            'strStatus': "1",
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 100000000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpExamStruct_GenDeTuDeThiCoSan(data.Data);
                    me.getList_GenDeTuDeThiCoSan();


                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpExamStruct_GenDeTuDeThiCoSan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "NAME",
                order: "unorder"
            },
            renderPlace: ["drpExamStruct_GenDeTuDeThiCoSan"],
            title: "Chọn cấu trúc đề"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_GenDeTuDeThiCoSan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_WritenExam',
            'versionAPI': 'v1.0',
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTuDeThiCoSan'),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_GenDeTuDeThiCoSan(data.Data);
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
    genTable_GenDeTuDeThiCoSan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGenDeTuDeThiCoSan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"
                    
                },
                {
                    "mDataProp": "SODETAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="radio" id="' + aData.ID + '" class="optradio" name="optradio' + aData.ID+'" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    ThucHienGenDeTuDeThiCoSan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDeTuDeThiCoSan',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTuDeThiCoSan'),
            'strWritenExamId': me.strWritenExamId,
            'strNguoiTaoId': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genThongTinDeThiDaTao();
                    
                    edu.system.alert("Thực hiện khởi tạo đề thành công");
                }
                else {
                    var thongbaoloi = data.Message;
                    if (data.Data.length > 0) {
                        var strTenPhongThiLoi = "";
                        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");
                        if (dt.length > 0) {
                            strTenPhongThiLoi += dt[0].ROOMNAME + "<br />";
                            thongbaoloi = thongbaoloi.replace(me.strExamRoomInfoId, dt[0].ROOMNAME);
                        }
                        strTenPhongThiLoi = "<span style ='color:red'>" + strTenPhongThiLoi + " </span>";
                    }
                    edu.system.alert("Lỗi khởi tạo phòng thi <br />" + strTenPhongThiLoi + "<br /> " + thongbaoloi);
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
    CapNhatMatKhauPhanThi: function (strExamRoomInfoId, strExamStructPartId, strMatKhauPhanThi ) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/CapNhatMatKhauPhanThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': strExamRoomInfoId,
            'strExamStructId': strExamStructPartId,
            'strMatKhauPhanThi': strMatKhauPhanThi,
            

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    edu.system.alert("Cập nhật thành công");
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
    //#endregion
    //#region tab_GenDeTuDeThiCoSan
    getList_drpGroupQuestion_GenDeTheoCauTrucDeThi: function () {
        var me = this;

        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': me.strDepartOrganId,
            'strStatus': '1',
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpGroupQuestion_GenDeTheoCauTrucDeThi(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestion_GenDeTheoCauTrucDeThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAMECODE",
                code: "GROUPQUESTIONNAMECODE",
                order: "unorder"
            },
            renderPlace: ["drpGroupQuestion_GenDeTheoCauTrucDeThi"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpExamStruct_GenDeTheoCauTrucDeThi: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_ExamStruct',
            'versionAPI': 'v1.0',
            'strDepartorganId': me.strDepartOrganId,
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestion_GenDeTheoCauTrucDeThi'),
            'strStatus': "1",
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 100000000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpExamStruct_GenDeTheoCauTrucDeThi(data.Data);
                    me.getList_GenDeTheoCauTrucDeThi();

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpExamStruct_GenDeTheoCauTrucDeThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "NAME",
                order: "unorder"
            },
            renderPlace: ["drpExamStruct_GenDeTheoCauTrucDeThi"],
            title: "Chọn cấu trúc đề"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_GenDeTheoCauTrucDeThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauTrucDeThi',
            'versionAPI': 'v1.0',
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi'),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_GenDeTheoCauTrucDeThi(data.Data);
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
    genTable_GenDeTheoCauTrucDeThi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGenDeTheoCauTrucDeThi",
            aaData: data,
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "GROUPQUESTIONDETAILNAME"
                },
                {

                    "mRender": function (nRow, aData) {
                        var strReturn = aData.GROUPQUESTIONDETAILNAME;
                        if (edu.util.returnEmpty(aData.TEN_CHONMOTTRONGCACNHOM) != '')
                            strReturn = 'Chọn <span style="color:red">' + aData.SONHOMCON + '</span> trong nhóm:</br> <span style="color:blue">' + aData.TEN_CHONMOTTRONGCACNHOM + '</span>';

                        return strReturn;
                    }
                },
                {
                    "mDataProp": "LEVELQUESTIONNAME"
                },
                {
                    "mDataProp": "SOCAUTRONGNGANHANGCAUHOI"
                },
                {
                    "mDataProp": "NUMBERQUESTION"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    ThucHienGenDe_NgauNhien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDe_NgauNhien',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi'),
            'strNguoiTaoId': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {                     
                    me.genThongTinDeThiDaTao();
                                                     
                    edu.system.alert("Thực hiện khởi tạo đề thành công");
                }
                else {
                    var thongbaoloi = data.Message;
                    if (data.Data.length > 0) {
                        var strTenPhongThiLoi = "";
                        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");
                        if (dt.length > 0) {
                            strTenPhongThiLoi += dt[0].ROOMNAME + "<br />";
                            thongbaoloi = thongbaoloi.replace(me.strExamRoomInfoId, dt[0].ROOMNAME);
                        }
                        strTenPhongThiLoi = "<span style ='color:red'>" + strTenPhongThiLoi + " </span>";
                    }
                    edu.system.alert("Lỗi khởi tạo phòng thi <br />" + strTenPhongThiLoi + "<br /> " + thongbaoloi);
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
    genThongTinDeThiDaTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId, 

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    var dt =  data.Data[0];                 
                    edu.util.viewHTMLById("lblKieuTaoDe_TaoDeThi", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_TaoDeThi", dt.EXAMSTRUCTNAME);                    
                    edu.util.viewHTMLById("lblTongSoCau_TaoDeThi", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_TaoDeThi", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_TaoDeThi", dt.WRITETENEXAMNAME);

                    edu.util.viewHTMLById("lblKieuTaoDe_TaoDeTuDeThiThuCong", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_TaoDeTuDeThiThuCong", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_TaoDeTuDeThiThuCong", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_TaoDeTuDeThiThuCong", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_TaoDeTuDeThiThuCong", dt.WRITETENEXAMNAME);

                    edu.util.viewHTMLById("lblKieuTaoDe_ChiTiet", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_ChiTiet", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_ChiTiet", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_ChiTiet", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_ChiTiet", dt.WRITETENEXAMNAME);

                    edu.util.viewHTMLById("lblKieuTaoDe_TinhHuongThi", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_TinhHuongThi", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_TinhHuongThi", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_TinhHuongThi", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_TinhHuongThi", dt.WRITETENEXAMNAME);
                    me.strExamStructId = dt.EXAMSTRUCTID;


                    
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
    ThucHienGenDe_CungDe: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDe_CungDe',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi'),
            'strNguoiTaoId': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genThongTinDeThiDaTao();                    
                    edu.system.alert("Thực hiện khởi tạo đề thành công");
                }
                else {
                    var thongbaoloi = data.Message;
                    if (data.Data.length > 0) {
                        var strTenPhongThiLoi = "";
                        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");
                        if (dt.length > 0) {
                            strTenPhongThiLoi += dt[0].ROOMNAME + "<br />";
                            thongbaoloi = thongbaoloi.replace(me.strExamRoomInfoId, dt[0].ROOMNAME);
                        }
                        strTenPhongThiLoi = "<span style ='color:red'>" + strTenPhongThiLoi + " </span>";
                    }
                    edu.system.alert("Lỗi khởi tạo phòng thi <br />" + strTenPhongThiLoi + "<br /> " + thongbaoloi);;  
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
    get_tblThiSinh_TinhHuongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ThiSinh_TinhHuongThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strStudentExamRoomIds': me.strStudentExamRoomIds,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_tblThiSinh_TinhHuongThi(data.Data);
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
    gen_tblThiSinh_TinhHuongThi: function (data) {
        var me = this; 
        

        var jsonForm = {
            strTable_Id: "tblThiSinh_TinhHuongThi",
            aaData: data,
            sort: true,           
            colPos: {
                center: [0, 1, 3, 4, 5,7,8],
            },
            aoColumns: [
                {
                    "mDataProp": "STUDENTCODE"
                },
                {
                    "mDataProp": "FULLNAME"
                },
                {
                    "mDataProp": "BIRTHDATE_USER"
                },
                {
                    "mDataProp": "SOBAODANHIMPORT"
                },
                {
                    "mDataProp": "MARK"
                },
                {
                    "mDataProp": "TRANGTHAILAMBAICACPHANTHI"
                },
                {
                    "mDataProp": "TIMEHHMISSSTARTDOEXAM"
                },
                {
                    "mDataProp": "TENMAYDADANGNHAP"
                }

            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    XulyTinhHuongThi: function (strKhoiTaoNote, strAddTime) {
        var me = this;
        var strExamstructPartIds = "";
        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == '')
            strExamstructPartIds = edu.extend.getCheckedCheckBoxByClassName('chkExamStruct').toString();
        else {
            var x = document.getElementsByClassName('chkExamStruct');
            var arrChecked = [];
            for (var i = 0; i < x.length; i++) {
                arrChecked.push(x[i].id);
            }
            strExamstructPartIds = arrChecked.toString();
        }
        if (strExamstructPartIds == "") {
            edu.system.alert("Bạn chưa chọn phần thi");
            return;
        }
        if (strKhoiTaoNote != "CONGTHEMTHOIGIANLAMBAI")
            strAddTime = "";
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/XulyTinhHuongThi',
            'versionAPI': 'v1.0',
            'strStudentExamRoomIds': me.strStudentExamRoomIds,
            'strKhoiTaoNote': strKhoiTaoNote,
            'strAddTime': strAddTime,
            'strExamstructPartIds': strExamstructPartIds,
            'strNguoiThucHienId': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.get_tblThiSinh_TinhHuongThi();
                    me.getList_ChiTietPhongThi('1');
                    edu.system.alert("Thực hiện thành công");
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
    Save_DoiMay: function () {
        var me = this;
         
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/Save_DoiMay',
            'versionAPI': 'v1.0',
            'strStudentExamRoomIds': me.strStudentExamRoomIds, 
            'strNguoiThucHienId': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {                   
                    
                    edu.system.alert("Thực hiện thành công");
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
    Save_ViPhamQuyCheThi: function () {
        var me = this;
        var strExamstructPartIds = "";
        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == '')
            strExamstructPartIds = edu.extend.getCheckedCheckBoxByClassName('chkExamStruct').toString();
        else {
            var x = document.getElementsByClassName('chkExamStruct');
            var arrChecked = [];
            for (var i = 0; i < x.length; i++) {
                arrChecked.push(x[i].id);
            }
            strExamstructPartIds = arrChecked.toString();
        }
       
        if (strExamstructPartIds == "") {
            edu.system.alert("Bạn chưa chọn phần thi");
            return;
        }


        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/Save_ViPhamQuyCheThi',
            'versionAPI': 'v1.0',
            'strStudentExamRoomIds': me.strStudentExamRoomIds, 
            'strExamstructPartIds': strExamstructPartIds,
            'strViPhamQuyCheThiId': edu.util.getValById("drpViPhamQuyChe"),
            'strNguoiThucHienId': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.get_tblThiSinh_TinhHuongThi();
                    me.getList_ChiTietPhongThi('1');
                    edu.system.alert("Thực hiện thành công");
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
    
    KhoiTaoLaiDeChoThiSinh: function () {
        var me = this;
        
        var strExamstructPartIds = edu.extend.getCheckedCheckBoxByClassName('chkExamStruct').toString();
        if (strExamstructPartIds == "") {
            edu.system.alert("Bạn chưa chọn phần thi");
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/KhoiTaoLaiDeChoThiSinh',
            'versionAPI': 'v1.0',            
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strStudentExamRoomIds': me.strStudentExamRoomIds,
            'strExamstructPartIds': strExamstructPartIds,
            'strNguoiThucHienId': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.get_tblThiSinh_TinhHuongThi();
                    me.getList_ChiTietPhongThi('1');
                    edu.system.alert("Thực hiện thành công");
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
    TamDungLamBai: function () {
        var me = this;
        //--Edit
        var strExamstructPartIds = edu.extend.getCheckedCheckBoxByClassName('chkExamStruct');
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/KhoiTaoLaiDeChoThiSinh',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strStudentExamRoomIds': me.strStudentExamRoomIds,
            'strExamstructPartIds': strExamstructPartIds,
            'strNguoiThucHienId': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.get_tblThiSinh_TinhHuongThi();
                    me.getList_ChiTietPhongThi('1');
                    edu.system.alert("Thực hiện thành công");
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
    //#endregion

    LayDS_MatKhauPhanThi: function () {
        var me = this;
        var dt = null;
        var obj_list = {
            'action': 'TTN_ThiSinh/LayDS_MatKhauPhanThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    dt = data.Data;                    
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                    
                }
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            async: false,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

        return dt;
    },
    getList_KieuLamBai: function () {
        var me = this;       

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamStructId': me.strExamStructId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 1000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                   
                    var dtMatKhauPhanThi;
                    var dataExamPart = data.Data.filter(e => e.PARENTID === null);                     
                    dtMatKhauPhanThi = me.LayDS_MatKhauPhanThi();
                    
                    if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == '') {
                        me.genList_KieuLamBai(dataExamPart, dtMatKhauPhanThi);
                        me.genList_drpExamstructPart(dataExamPart);
                    }
                    else {
                        me.genList_KieuLamBai(dataExamPart, dtMatKhauPhanThi);
                        var dtKieuLamBaiNull = {
                            id: "",
                            parentId: "",
                            name: "",
                            code: "",
                            avatar: ""

                        };
                        me.genList_drpExamstructPart(dtKieuLamBaiNull);
                    }
                    
                    
                    

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    genList_KieuLamBai: function (dataKieuLamBai, dtMatKhauPhanThi) {
        var me = this;
        var row = '';
        var rowMatKhauDeThi = '';
        $("#zoneKieuLamBai").html('');
        $("#zoneMatKhauDeThi").html('');

        for (var i = 0; i < dataKieuLamBai.length; i++) {
            row += '<div class="col-lg-4 checkbox-inline user-check-print; pull-left">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + dataKieuLamBai[i].ID + '" class="chkExamStruct" title="' + dataKieuLamBai[i].KIEULAMBAITHI + '" />';
            row += '<span><p>' + dataKieuLamBai[i].TITLE + '</p></span>';
            row += '</div>';
            var dt = edu.util.objGetDataInData(dataKieuLamBai[i].ID, dtMatKhauPhanThi, "EXAMSTRUCTPARTID");
            var strMK = "";
            if (dt.length > 0)
                strMK = edu.util.returnEmpty(dt[0].MATKHAUPHANTHI);

            rowMatKhauDeThi += '<div class="row">';
            rowMatKhauDeThi += '<span style="float:left;"><p> Mật khẩu phần ' + dataKieuLamBai[i].TITLE;
            rowMatKhauDeThi += '<input class="form-control" style="width:100px; float: right;" type="text" id="txt' + dataKieuLamBai[i].ID + '"  title="' + dataKieuLamBai[i].KIEULAMBAITHI + '" value="' + strMK + '"/>';
            rowMatKhauDeThi += '</p></span>' + '</div>';

        }

        $("#zoneKieuLamBai").html(row);
        $("#zoneMatKhauDeThi").html(rowMatKhauDeThi);



    },

    genList_drpExamstructPart: function (data) {
       
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TITLE",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpExamstructPart"],
            type: "",
            title: "Chọn phần thi"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    toggle_edit_TaoDeTuDeThiThuCong: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneTaoDeTuDeThiThuCong");
    },

    getList_GenDeTuDeThiThuCong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_DeThiThuCong',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestion_TaoDeTuDeThiThuCong'),
            'strStatus': '1',
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 100000000, 

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDeThiThuCong = data.Data;
                    me.genTable_GenDeTuDeThiThuCong(data.Data);
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
    genTable_GenDeTuDeThiThuCong: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGenDeTuDeThiThuCong",
            aaData: data,
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"

                },
                {
                    "mDataProp": "SODETAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="radio" id="' + aData.ID + '" class="optradioDeThiThuCong" name="optradioDeThiThuCong' + aData.EXAMSTRUCTID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    ThucHienGenDeTuDeThiThuCong: function (str) {
        var me = this;
        
        if (edu.util.getValById("drpExamstructPart") == "") {
            edu.system.alert("Bạn chưa chọn phần thi");
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDeTuDeThiThuCong',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strExamstructPartId': edu.util.getValById("drpExamstructPart"),
            'strDeThiThuCongId': me.strDeThiThuCongId, 
            'strNguoiThucHien_Id': edu.system.userId,
            
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genThongTinDeThiDaTao();

                    edu.system.alert("Thực hiện khởi tạo đề thành công");
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
    ThucHienGenDeThiSinhTuDeThiThuCong: function () {
        var me = this;
        var arrChecked_Id = edu.util.getArrCheckedIds("tblChiTietPhongThi", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng?");
            return;
        } 
        var strStudentExamRoom_Ids = "";
        for (var i = 0; i < arrChecked_Id.length; i++) {
            strStudentExamRoom_Ids += arrChecked_Id[i] + ",";
        }

        strStudentExamRoom_Ids = strStudentExamRoom_Ids.substr(0, strStudentExamRoom_Ids.length - 1);
         
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDeThiSinhTuDeThiThuCong',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strExamstructPartId': edu.util.getValById("drpExamstructPart"),
            'strDeThiThuCongId': me.strDeThiThuCongId,
            'strStudentExamRoom_Ids': strStudentExamRoom_Ids,
            'strNguoiThucHien_Id': edu.system.userId,
            

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genThongTinDeThiDaTao();

                    edu.system.alert("Thực hiện khởi tạo đề thành công");
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

    get_drpViPhamQuyChe: function () {
        var me = this;

        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyTHI/LayDS_ViPhamQuyChe',
            'versionAPI': 'v1.0', 

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpViPhamQuyChe(data.Data); 
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpViPhamQuyChe: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "CODE",
                order: "unorder"
            },
            renderPlace: ["drpViPhamQuyChe"],
            title: "Chọn"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_drpHocPhan: function () {
        var me = this;
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_HocPhan', 

            'strTuKhoa': '',
            'strDaoTao_MonHoc_Id': '',
            'strThuocBoMon_Id': '',
            'strThuocTinhHocPhan_Id': '',
            'strNguoiThucHien_Id': "",
            
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
                    me.dtHocPhan = data.Data;
                    for (var i = 0; i < data.Data.length; i++) {
                        data.Data[i].THONGTINTENMAHOCTRINHBOMON = data.Data[i].TEN + "_" + data.Data[i].MA + "_" + data.Data[i].HOCTRINH + "_" + data.Data[i].THUOCBOMON_TEN; 
                    }
                   me.genTable_HocPhan(dtResult, iPager);
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
    genTable_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THONGTINTENMAHOCTRINHBOMON",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocPhan"],
            type: "",
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    ThucHienGenLayNDeTuDeThiThuCong: function (str) {
        var me = this;

        if (edu.util.getValById("drpExamstructPart") == "") {
            edu.system.alert("Bạn chưa chọn phần thi");
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenLayNDeTuDeThiThuCong',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strExamstructPartId': edu.util.getValById("drpExamstructPart"),
            'strDeThiThuCongId': me.strDeThiThuCongId,
            'strSoDeLayRa': edu.util.getValById("txtSoDeThiNgauNhienLayRa"),
            'strNguoiThucHien_Id': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genThongTinDeThiDaTao();

                    edu.system.alert("Thực hiện khởi tạo đề thành công");
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
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("ThongTinBaiThi");
        edu.util.printHTML('ThongTinBaiThi'); 
      //  me.closePhieu();
    },
    countdown: function (timeCountdown, container) {
        var me = this;
        var t = timeCountdown;
        //console.log("timeCountdown: ", t);
        var current_seconds = Math.floor((t / 1000) % 60); //t.seconds;
        var seconds;

        if (current_seconds != 0)
            seconds = current_seconds + 1;
        else
            seconds = 60;
        var mins = Math.floor((t / 1000 / 60) % 60); //t.minutes;
        var hours = Math.floor((t / 1000 / (60 * 60)) % 60);

        var strColour = "orange";
        if (mins <= 3 && hours == 0 && seconds % 2 == 0)
            strColour = "red";
        //console.log("hours: ", hours + " mins: ", mins + " seconds: " + seconds);
        //clearInterval(tick());
        function tick() {

            if ($("#" + container) != null) {
                seconds--;
                //console.log("mins: ", mins + " seconds: " + seconds);
                $("#" + container).html("<span style='text-align:center; color: " + strColour + "'>" + (hours > 0 ? hours.toString() + ":" : "") + (mins < 10 ? "0" : "") + mins.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString() + "</span>");
                //var  = "<span style='text-align:center; color: " + strColour + "'>" + mins.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString() + "</span>";

                if (seconds > 0) {
                    setTimeout(tick, 1000);
                }
                else {
                    //console.log("mins1: ", mins);
                    if (t > 60000) {//mins > 1 || (mins == 1 && hours > 0)
                        var newCountdown = hours * 3600000 + (mins - 1) * 60000;
                        //console.log("newCountdown: ", newCountdown);
                        setTimeout(function () { me.countdown(newCountdown, container); }, 1000);
                    }
                    else if (mins == 1) {
                        setTimeout(function () { me.countdown(60000 - 0.01, container); }, 1000);
                    }
                }
            }
        }
        tick();
    },
    getList_dropSearch_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        }; 
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data; 
                    me.genList_dropSearch_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayLoaiDiem',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_LoaiDiem(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_LoaiDiem: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_HinhThuc: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHinhThucThi',
            'type': 'GET',
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_HinhThuc(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_HinhThuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_DotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDanhSach_DotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_DotThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_DotThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_dropSearch_MonThi: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_Chung/LayHocPhan',
            'type': 'GET',
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_MonThi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_MonThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn môn thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_ImportPhongThi: function () {
        var me = this;
        //--Edit
         
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DSThiTheoDotThi',
            'type': 'GET',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strLoaiDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            
            'strNguoiThucHien_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhongThiImport = dtReRult;
                    
                    me.genTable_ImportPhongThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ImportPhongThi: function (data, iPager) {
        var me = this;
        $("#lblTuiBai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblImportPhongThi",

            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_ImportPhongThi()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,1,2,3,4,5,6,7,8,9,10],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.MADANHSACHTHI) + '</a></span>';
                    }
                },
                {
                    
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.NGAYTHI) + '</a></span>';
                    }
                },
                {
                    
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.THI_CATHI_TEN) + '</a></span>';
                    }
                },
                {
                     
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.TKB_PHONGTHI_TEN) + '</a></span>';
                    }
                },
                {
                    
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.SOLUONGTHISINHDUDIEUKIENDUTHI) + '</a></span>';
                    }
                },
                {

                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.SOLUONGTSDAIMPORT) + '</a></span>';
                    }
                }
                ,
                 {
                     
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtMatKhauPhongThi' + aData.ID + '"  class="form-control" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox"   id="checkTheoSoCau' + aData.ID + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox"   id="checkChoPhepXemDiem' + aData.ID + '"/>';
                    }
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox"   id="checkChoPhepXemKetQua' + aData.ID + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    checkedCol_BgRow: function (strTable_Id) {//Check toàn bộ input theo cột dựa theo input trên thead
        var me = this;
        //alert(1);
    //Truyền vào id bảng hàm sẽ tạo sự kiện khi check input trên tiêu để bảng (th:input) sẽ lấy thự tự cột và check all toàn bộ input trong cột đó trong bảng
        $("#" + strTable_Id + " th").delegate("input", "click", function () {
            
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
    DongBoDuLieuPhongThi: function (strId, strMatKhauChoPhongThi, strCachTinhDiem, ChoPhepXemDiem, ChoPhepXemKetQuaTraLoi) {
        var me = this;

        var obj_save = {
            'action': 'QLTTN_QuanLyThi/DongBoDuLieuPhongThi',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strMatKhauChoPhongThi': strMatKhauChoPhongThi,
            'strCachTinhDiem': strCachTinhDiem,
            'ChoPhepXemDiem': ChoPhepXemDiem,
            'ChoPhepXemKetQuaTraLoi': ChoPhepXemKetQuaTraLoi, 
            'strExamScheduleId': edu.util.getValById('drpDotThi'),
            'strDepartOrganId': edu.util.getValById('drpDonVi'),
            'strGroupQuestionId': me.strGroupQuestionId,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhongThiImport_ThiSinhDaImport: function (strId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThiTSDaImport',
            'versionAPI': 'v1.0',
            'strPhongThiId': strId,             
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_PhongThiImport_ThiSinhDaImport(data.Data, data.Pager, strId);
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
    genTable_PhongThiImport_ThiSinhDaImport: function (data, iPager, strId) {
        var me = this;
        $("#lblPhongThiImport_ThiSinhDaImport_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThiImport_ThiSinhDaImport",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_PhongThiImport_ThiSinhDaImport('" + strId+"')",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4,5,6],
            },
            aoColumns: [
                {
                    "mDataProp": "MATHISINH"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "CLASSNAME"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                {
                    "mRender": function (nRow, aData) {
                        var vReturn = "Đã thi";
                        if (aData.DATHI == "0")
                            vReturn = "Chưa thi";
                            return vReturn;
                    }

                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_PhongThiImport_ThiSinhChuaImport: function (strId) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThiTSChuaImport',
            'versionAPI': 'v1.0',
            'strPhongThiId': strId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_PhongThiImport_ThiSinhChuaImport(data.Data, data.Pager, strId);
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
    genTable_PhongThiImport_ThiSinhChuaImport: function (data, iPager, strId) {
        var me = this;
        $("#lblPhongThiImport_ThiSinhChuaImport_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThiImport_ThiSinhChuaImport",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_PhongThiImport_ThiSinhChuaImport('" + strId+"')",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "MATHISINH"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "CLASSNAME"
                },
                {
                    "mDataProp": "SOBAODANH"
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    randomString: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWYabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    getList_drpHocKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_HocKyBySchoolYear',
            'strStatus': '1',
            'strSchoolYear': $("#drpNamHoc :selected").val(),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genList_drpHocKy(data.Data);
                    me.getList_drpDotThi();
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
    genList_drpHocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "SEMESTER",
                parentId: "",
                name: "SEMESTER",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpHocKy"],
            type: "",
            title: "Học kỳ"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    toggle_edit_KhoiTaoDeChoCacPhongThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneKhoiTaoDeChoCacPhongThi");
    },  

    getList_drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi: function () {
        var me = this;

        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strStatus': '1',
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.gen_drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAMECODE",
                code: "GROUPQUESTIONNAMECODE",
                order: "unorder"
            },
            renderPlace: ["drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_ExamStruct',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestion_GenDeTuDeThiCoSan_CacPhongThi'),
            'strStatus': "1",
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 100000000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi(data.Data);
                    me.getList_GenDeTuDeThiCoSan_CacPhongThi();


                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "NAME",
                order: "unorder"
            },
            renderPlace: ["drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi"],
            title: "Chọn cấu trúc đề"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi: function () {
        var me = this;

        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_GroupQuestion',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strStatus': '1',
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 10000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "GROUPQUESTIONNAMECODE",
                code: "GROUPQUESTIONNAMECODE",
                order: "unorder"
            },
            renderPlace: ["drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi"],
            title: "Chọn nhóm"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi: function () {
        var me = this;
        //--Edit 
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_ExamStruct',
            'versionAPI': 'v1.0',
            'strDepartorganId': edu.util.getValById('drpDonVi'),
            'strGroupQuestionId': edu.util.getValById('drpGroupQuestion_GenDeTheoCauTrucDeThi_CacPhongThi'),
            'strStatus': "1",
            'strTuKhoa': '',
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 100000000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi(data.Data);
                    me.getList_GenDeTheoCauTrucDeThi_CacPhongThi();

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
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
    gen_drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                name: "NAME",
                code: "NAME",
                order: "unorder"
            },
            renderPlace: ["drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi"],
            title: "Chọn cấu trúc đề"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_GenDeTheoCauTrucDeThi_CacPhongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_CauTrucDeThi',
            'versionAPI': 'v1.0',
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi'),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_GenDeTheoCauTrucDeThi_CacPhongThi(data.Data);
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
    genTable_GenDeTheoCauTrucDeThi_CacPhongThi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGenDeTheoCauTrucDeThi_CacPhongThi",
            aaData: data,
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "GROUPQUESTIONDETAILNAME"
                },
                { 
                    "mRender": function (nRow, aData) {
                        var strReturn = aData.GROUPQUESTIONDETAILNAME;
                        if (edu.util.returnEmpty(aData.TEN_CHONMOTTRONGCACNHOM) != '')
                            strReturn = 'Chọn <span style="color:red">' + aData.SONHOMCON + '</span> trong nhóm:</br> <span style="color:blue">' + aData.TEN_CHONMOTTRONGCACNHOM + '</span>';

                        return strReturn;
                    }
                },
                {
                    "mDataProp": "LEVELQUESTIONNAME"
                },
                {
                    "mDataProp": "SOCAUTRONGNGANHANGCAUHOI"
                },
                {
                    "mDataProp": "NUMBERQUESTION"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_GenDeTuDeThiCoSan_CacPhongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyBoDe/LayDS_WritenExam',
            'versionAPI': 'v1.0',
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi'),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_GenDeTuDeThiCoSan_CacPhongThi(data.Data);
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
    genTable_GenDeTuDeThiCoSan_CacPhongThi: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblGenDeTuDeThiCoSan_CacPhongThi",
            aaData: data,
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"

                },
                {
                    "mDataProp": "SODETAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="radio" id="' + aData.ID + '" class="optradio_CacPhongThi" name="optradio_CacPhongThi' + aData.ID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    ThucHienGenDeTuDeThiCoSan_CacPhongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDeTuDeThiCoSan_CacPhongThi',
            'versionAPI': 'v1.0',
            'strIds': me.strExamRoomInfoIds_CacPhongThi,
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTuDeThiCoSan_CacPhongThi'),
            'strWritenExamId': me.strWritenExamId_CacPhongThi,
            'strNguoiThucHien_Id': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                   // me.genThongTinDeThiDaTao();

                    edu.system.alert("Thực hiện khởi tạo đề thành công");
                }
                else {
                    var thongbaoloi = data.Message;
                    if (data.Data.length > 0) {
                        var strPhongThiLoiId = data.Data.split(',');
                        var strTenPhongThiLoi = "";
                        for (var i = 0; i < strPhongThiLoiId.length; i++) {
                            var dt = edu.util.objGetDataInData(strPhongThiLoiId[i], me.dtPhongThi, "ID");
                            if (dt.length > 0) {
                                strTenPhongThiLoi += dt[0].ROOMNAME + "<br />";
                                thongbaoloi = thongbaoloi.replace(strPhongThiLoiId[i], dt[0].ROOMNAME);
                            }
                        }
                        strTenPhongThiLoi = "<span style ='color:red'>" + strTenPhongThiLoi + " </span>";
                    }
                    edu.system.alert("Lỗi khởi tạo phòng thi <br />" + strTenPhongThiLoi + "<br /> " + thongbaoloi); 
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
    ThucHienGenDe_NgauNhien_CacPhongThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDe_NgauNhien_CacPhongThi',
            'versionAPI': 'v1.0',
            'strIds': me.strExamRoomInfoIds_CacPhongThi,
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi'),
            'strNguoiThucHien_Id': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.genThongTinDeThiDaTao();

                    edu.system.alert("Thực hiện khởi tạo đề thành công");
                }
                else {
                    var thongbaoloi = data.Message;
                    if (data.Data.length > 0) {
                        var strTenPhongThiLoi = "";
                        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");
                        if (dt.length > 0) {
                            strTenPhongThiLoi += dt[0].ROOMNAME + "<br />";
                            thongbaoloi = thongbaoloi.replace(me.strExamRoomInfoId, dt[0].ROOMNAME);
                        }
                        strTenPhongThiLoi = "<span style ='color:red'>" + strTenPhongThiLoi + " </span>";
                    }
                    edu.system.alert("Lỗi khởi tạo phòng thi <br />" + strTenPhongThiLoi + "<br /> " + thongbaoloi);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    ThucHienGenDe_CungDe_CacPhongThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/ThucHienGenDe_CungDe_CacPhongThi',
            'versionAPI': 'v1.0',
            'strIds': me.strExamRoomInfoIds_CacPhongThi,
            'strExamStructId': edu.util.getValById('drpExamStruct_GenDeTheoCauTrucDeThi_CacPhongThi'),
            'strNguoiThucHien_Id': edu.system.userId

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                 
                    edu.system.alert("Thực hiện khởi tạo đề thành công");
                }
                else {
                    var thongbaoloi = data.Message;
                    if (data.Data.length > 0) {
                        var strPhongThiLoiId = data.Data.split(',');
                        var strTenPhongThiLoi = "";
                        for (var i = 0; i < strPhongThiLoiId.length; i++) {
                            var dt = edu.util.objGetDataInData(strPhongThiLoiId[i], me.dtPhongThi, "ID");
                            if (dt.length > 0) {
                                strTenPhongThiLoi += dt[0].ROOMNAME + "<br />";
                                thongbaoloi = thongbaoloi.replace(strPhongThiLoiId[i], dt[0].ROOMNAME);
                            }
                        }
                        strTenPhongThiLoi = "<span style ='color:red'>" + strTenPhongThiLoi + " </span>";
                    }
                    edu.system.alert("Lỗi khởi tạo phòng thi <br />" + strTenPhongThiLoi + "<br /> " + thongbaoloi); 
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
    Update_PhongThi_MucPheDuyet: function (strIds, strMucPheDuyet) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/Update_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strMucPheDuyet': strMucPheDuyet,
            'strNguoiThucHien_Id': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    // me.genThongTinDeThiDaTao();
                    edu.system.alert("Thực hiện chuyển thành công");
                }
                else {

                    edu.system.alert(data.Message);
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
    getList_drpNamHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_NamHoc',
            'strStatus': '1',

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data);
                    me.genList_drpNamHoc(data.Data);
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
    genList_drpNamHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "SCHOOLYEAR",
                parentId: "",
                name: "SCHOOLYEAR",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpNamHoc"],
            type: "",
            title: "Năm học"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getList_drpHocPhan_TheoDotThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_HocPhan_TheoDotThi',
            'strDotThiId': edu.util.getValById("drpDotThi"),
            'strNamHoc': edu.util.getValById("drpNamHoc"),
            'strHocKy': edu.util.getValById("drpHocKy"),

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.genList_drpHocPhan_TheoDotThi(data.Data.Table);
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
    genList_drpHocPhan_TheoDotThi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: ""
            },
            renderPlace: ["drpHocPhan_DotThi"],
            type: "",
            title: "Học phần"
        };
        edu.system.loadToCombo_data(obj);
    }, 

    getList_DiaChiIP_ThiSinh: function (strId) {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DiaChiIP_ThiSinh',
            'versionAPI': 'v1.0',
            'strStudentExamRoom_Id': strId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_DiaChiIP_ThiSinh(data.Data, data.Pager, strId);
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
    genTable_DiaChiIP_ThiSinh: function (data, iPager, strId) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tbl_DiaChiIP_ThiSinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_DiaChiIP_ThiSinh('" + strId + "')",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 1, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "IPADDRESS"
                },
                {
                    "mDataProp": "COMPUTERNAME"
                },
                {
                    "mDataProp": "DATELOGIN"
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    LayDS_ThiSinhGianLan: function () {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ThiSinhGianLan',
            'versionAPI': 'v1.0',
            'strExamRoomInfo_Id': me.strExamRoomInfoId,
            'strNguoiDung_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.length; i++) {
                        var dt = edu.util.objGetDataInData(data.Data[i].STUDENTEXAMROOMID, me.dtChiTietPhongThi, "ID");
                        if (dt.length > 0) {

                            var strReturn = '<span><a class="btn btn-default btnChiTietThiSinh" id="' + dt[0].ID + '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i>' + dt[0].FULLNAME + '</a></span>';
                            if (dt[0].COTRONGLICHTHI == "0")
                                strReturn = '<span><a class="btn btn-default btnChiTietThiSinh" id="' + dt[0].ID + '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i><span style="color:red">' + dt[0].FULLNAME + '</span></a></span>';
                            if (data.Data[i].GIANLAN == '1')
                                strReturn += "</br> <p class='cssGianLan XemDiaChiIP' id='" + dt[0].ID + "'>Gian lận</p>";
                            var x = $("#tblChiTietPhongThi tbody tr[id=" + data.Data[i].STUDENTEXAMROOMID + "] td:eq(2)");
                            x.html('');
                            x.append(strReturn);
                        }

                    }
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
    ChuyenDuLieuDiem_ThiSinh: function (ExamRoomInfoId, ThiSinhId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/ChuyenDuLieuDiem_ThiSinh',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': ExamRoomInfoId,
            'strUserId': ThiSinhId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.strUngDung_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    }, 
    getList_SearchCanBoCoiThi: function () {
        var me = this;
        
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/getList_SearchCanBoCoiThi',
            'versionAPI': 'v1.0', 
            'strTuKhoa': edu.util.getValById('txtSearch_CanBoCoiThi'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genTable_SearchCanBoCoiThi(data.Data, data.Pager);
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
    Them_CanBoCoiThi: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Them_CanBoCoiThi',
            'versionAPI': 'v1.0',
            'strNhanSuId': strId,
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    }, 
    genTable_SearchCanBoCoiThi: function (data, iPager) {
        var me = this; 
        var jsonForm = {
            strTable_Id: "tblTimKiemCanBoCoiThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_SearchCanBoCoiThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "TENDONVI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    Xoa_CanBoCoiThi: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Xoa_CanBoCoiThi',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
    getList_CanBoChamThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_NhanSuChamThi',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_CanBoChamThi(data.Data, data.Pager);
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
    genTable_CanBoChamThi: function (data, iPager) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblCanBoChamThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_CanBoChamThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0,],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "TENDONVI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    getList_SearchCanBoChamThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/getList_SearchCanBoChamThi',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_CanBoChamThi'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_SearchCanBoChamThi(data.Data, data.Pager);
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
    genTable_SearchCanBoChamThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTimKiemCanBoChamThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.QuanLyThi.getList_SearchCanBoChamThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 1],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "TENDONVI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    Them_CanBoChamThi: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Them_CanBoChamThi',
            'versionAPI': 'v1.0',
            'strNhanSuId': strId,
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    }, 
    Xoa_CanBoChamThi: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Xoa_CanBoChamThi',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
    ThucHienTinhDiemCauHoi_PhongThi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/ThucHienTinhDiemCauHoi_PhongThi',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },  
    getList_ChiTietPhongThi_dangTest: function (strCoTinhLaiDiem) {
        var me = this;

        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");

        edu.util.viewHTMLById("lblDonVi_ChiTiet", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_ChiTiet", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_ChiTiet", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_ChiTiet", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_ChiTiet", dt[0].EXAMDATE);


        edu.util.viewHTMLById("lblDonVi_TaoDeThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeThi", dt[0].EXAMDATE);

        edu.util.viewHTMLById("lblDonVi_TaoDeTuDeThiThuCong", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeTuDeThiThuCong", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeTuDeThiThuCong", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeTuDeThiThuCong", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeTuDeThiThuCong", dt[0].EXAMDATE);



        edu.util.viewHTMLById("lblDonVi_TinhHuongThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TinhHuongThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TinhHuongThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TinhHuongThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TinhHuongThi", dt[0].EXAMDATE);


        me.strMatKhauChoPhongThi = dt[0].MATKHAUCHOPHONGTHI;


        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua_dangtest',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiTao_Id': edu.system.userId,
            'strCoTinhLaiDiem': strCoTinhLaiDiem,
            'strExamStructPartId': edu.util.getValById('drpExamstructPart'),
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.dtChiTietPhongThi = data.Data.ChiTietPhongThi;

                    me.dtStudentFiles = data.Data.StudentFiles;
                    me.genTable_ChiTietPhongThi(strCoTinhLaiDiem, me.dtChiTietPhongThi, data.Pager);
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
}

