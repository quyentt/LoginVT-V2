/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function NhapDiem() { };
NhapDiem.prototype = {
    dtDSDiem: [],
    dtCotThongTinDiem: [],
    dtCotNguoiHoc: [],
    dtNguoiHoc: [],
    arrHeadDiem_Id: [],
    dtXacNhan: [],
    strDSDiem_Id: '',
    strLoaiXacNhan: '',
    strDanhSach_Id : '',
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_Hoc();
        me.getList_ThoiGian();
        me.getList_HocPhan();
        me.getList_LopQuanLy();
        me.getList_LoaiDanhSach();
        //edu.system.loadToCombo_DanhMucDuLieu("DIEM.LOAIDANHSACH", "dropSearch_LoaiDanhSach");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.NHAPDIEM.SAPXEP", "dropSearch_LoaiSapXep");
        $(window).resize(function () { me.actionTable_NguoiHoc(); });

        $('#dropSearch_LoaiDanhSach').on('select2:select', function () {
            me.getList_ThoiGian();
            me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.getList_Hoc();
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_LopQuanLy();
            me.getList_HocPhan();
            me.getList_Hoc();
        });
        $('#dropSearch_LopQuanLy').on('select2:select', function () {
            me.getList_HocPhan();
            me.getList_Hoc();
        });
        $('#dropSearch_HocPhan').on('select2:select', function () {
            me.getList_Hoc();
        });
        $('#dropSearch_LoaiSapXep').on('select2:select', function () {
            me.getList_ThongTinHienThiCot(me.strDanhSach_Id);
        });
        /*------------------------------------------
        --Discription: Load Select
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSearch").click(function () {
            me.getList_Hoc();
        });
        $("#btnBaoCao").click(function () {
            edu.system.report("BangDiemEdit", "", function (addKeyValue) {
                addKeyValue("strChucNang_Id", edu.system.strChucNang_Id);
                addKeyValue("strUngDung_Id", edu.system.appId);
                addKeyValue("strNguoiThucHien_Id", edu.system.userId);
                addKeyValue("strTuKhoa", edu.util.getValById('txtSearch_TuKhoa'));
                addKeyValue("strDiem_DanhSachHoc_Id", me.strDanhSach_Id);
                addKeyValue("strNguoiDung_Id", edu.system.userId);
            });
        });
        $("#btnCall_Import_Table").click(function () {
            $("#btnNotifyModal").remove();
            $('#myModal_Upload').modal('show');
            $("#notify_import").html('');
        });
        $("#btnBaoCao_GiaoDien").click(function () {
            edu.system.reportAllTable_User("tblNhapDiem");
        });
        $("#btnCall_Import_Table_GiaoDien").click(function () {
            edu.system.showReportAndImportTable_User(true);
        });
        edu.system.uploadImport(["txtFile_Table"], me.import_Table);
        $("#tblDSDiem").delegate('.btnChonDanhSach', 'click', function () {
            var strDanhSach_Id = this.id;
            var obj = edu.util.objGetDataInData(strDanhSach_Id, me.dtDSDiem, "ID")[0];
            $("#lblHocPhan").html(obj.DAOTAO_HOCPHAN_MA + " - " + obj.DAOTAO_HOCPHAN_TEN);
            me.strDSDiem_Id = strDanhSach_Id;
            me.toggle_detail(strDanhSach_Id);
        });
        $("#tblNhapDiem").delegate("input", "focus", function (e) {
            if ($("#clone").length > 0) {
                if (($(this).offset().top - $("#clone").offset().top) < 100) {
                    $(window).scrollTop($(this).offset().top - 100)
                };
            }
            
            e.stopImmediatePropagation();
            var strMyId = this.id;
            var strColId = this.id.substring(38);
            this.parentNode.parentNode.classList.add("tr-bg-diem");
            $("#tblNhapDiem input[id!='']").each(function () {
                if (this.id.substring(38) == strColId) this.parentNode.classList.add("tr-bg-diem");
            });
            $("#tblNhapDiem th[id!='']").each(function () {
                //console.log(this.parentNode);
                if (this.id == strColId) this.classList.add("tr-bg-diem");
            });
            $("#clone th[id!='']").each(function () {
                //console.log(this.parentNode);
                if (this.id == strColId) this.classList.add("tr-bg-diem");
            });
        });
        $("#tblNhapDiem").delegate("input", "blur", function (e) {
            $("#tblNhapDiem .tr-bg-diem").each(function () {
                this.classList.remove("tr-bg-diem");
            });
            $("#clone .tr-bg-diem").each(function () {
                this.classList.remove("tr-bg-diem");
            });
        });
        //$("#tblNhapDiem").delegate("td", "click", function () {
        //    $("#tblNhapDiem .tr-bg-diem").each(function () {
        //        this.classList.remove("tr-bg-diem");
        //    });
        //    $("#clone .tr-bg-diem").each(function () {
        //        this.classList.remove("tr-bg-diem");
        //    });
        //});
        $(".btnSaveDSDiem").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn lưu điểm không?");
            $("#btnYes").click(function (e) {
                $("#btnYes").hide();
                var strTable_Id = "tblNhapDiem";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find("input");
                var arrSave = [];
                for (var i = 0; i < arrElement.length; i++) {
                    var temp = $(arrElement[i]).attr("name");
                    if (temp == undefined) temp = ""; 
                    if (arrElement[i].value != temp) {
                        arrSave.push(arrElement[i]);
                    }
                }
                if (arrSave.length == 0) {
                    $("#myModalAlert #alert_content").html("Chưa có điểm mới nào cần lưu");
                    return;
                }
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                edu.system.genHTML_Progress("alertprogessbar", arrSave.length);
                for (var i = 0; i < arrSave.length; i++) {
                    me.save_Diem(arrSave[i]);
                }
            });
        });
        $(".btnTinhDiem").click(function () {
            edu.system.confirm("Bạn có chắc chắn muốn tính lại điểm không?");
            $("#btnYes").click(function (e) {
                $("#myModalAlert #alert_content").html("Hệ thống đang kiểm tra tính xác thực dữ liệu. Vui lòng đợi! <br/> <div id='alertprogessbar'></div>");
                $("#btnYes").hide();
                var strTable_Id = "tblNhapDiem";
                var arrElement = $("#" + strTable_Id).find("tbody").find("tr");
                edu.system.genHTML_Progress("alertprogessbar", arrElement.length);
                for (var i = 0; i < arrElement.length; i++) {
                    me.tinh_Diem(arrElement[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: Load Select
        -------------------------------------------*/
        $("#tblHienThi").delegate('.btnCanLe', 'click', function () {
            var point = this;
            var parent = point.parentNode;
            $(point.parentNode).find(".btn-primary").each(function () {
                this.classList.remove("btn-primary");
            });
            this.classList.add("btn-primary");
        });
        $("#tblHienThi").delegate('.btnChuDam', 'click', function () {
            var classPoint = this.classList;
            if (classPoint.contains("btn-primary")) {
                classPoint.remove("btn-primary");
                classPoint.add("btn-default");
            } else {
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
        });
        $("#tblHienThi").delegate('.btnHienThiNoiDung', 'click', function () {
            var x = $(this).find('i')[0].classList;
            if (x.contains("color-active")) {
                x.remove("color-active");
                x.remove("fa-toggle-on");
                x.add("fa-toggle-off");
                $(this).attr("name", "0");
            } else {
                x.add("color-active");
                x.add("fa-toggle-on");
                x.remove("fa-toggle-off");
                $(this).attr("name", "1");
            }
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnLuuEditHienThi").click(function () {
            var x = $("#tblHienThi tbody")[0].rows;
            for (var i = 0; i < x.length; i++) {
                me.save_CauHinhHienThiCot(x[i]);
            }
        });
        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_CauHinhHienThiCot(id, "");
        });
        $("#tblHienThi").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHienThi tr[id='" + strRowId + "']").remove();
        });
        $("#tblHienThi").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_CauHinhHienThiCot(strId);
            });
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $(".btnXacNhan").click(function () {
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            me.getList_XacNhanSanPham(me.strDSDiem_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_NHAP');
        });

        $(".btnCongBo").click(function () {
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Công bố");
            me.strLoaiXacNhan = "XACNHAN_CONGBODIEM";
            me.getList_XacNhanSanPham(me.strDSDiem_Id, "tblModal_XacNhan", null, 'XACNHAN_CONGBODIEM');
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            me.save_XacNhanSanPham(me.strDSDiem_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
        });

        edu.system.getList_MauImport("zonebtnBaoCao_Diem", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
                'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
                'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),//,'B7EEDF237D98403294EF4C8A6628F9C0',
                'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),//'930C20DE21494475943AA79803CBA2EA',
                'strTrangThai_Id': edu.util.getValById('dropAAAA'),
                'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
                'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
                'strNguoiDung_Id': edu.system.userId,//'6E83EC35FE5D46138562A0D3E39A1047',
                'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                //'pageIndex': edu.system.pageIndex_default,
                //'pageSize': edu.system.pageSize_default,
                'strDiem_DanhSachHoc_Id': me.strDanhSach_Id, 
                'strQLSV_NguoiHoc_Id': "",
                'strDiem_DanhSach_NguoiHoc_Id': "",
                'strKyHieuCotDuLieu': "",
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });

        $("#btnNhapDiemDanhSach").click(function () {
            var confirm = 'Bạn có chắc chắn muốn nhập điểm mặc định cho danh sách?';
            confirm += '<div class="clear"></div>';
            confirm += '<table>';
            confirm += '<tbody>';
            confirm += '<tr>';
            confirm += '<td>Điểm mặc định:</td>';
            confirm += '<td>  <input id="txtDiemMacDinh" class="form-control" /> </td>';
            confirm += '</tr>';
            confirm += '</tbody>';
            confirm += '</table>';
            confirm += '<div class="clear"></div>';
            confirm += '<div class="clear"></div>';
            edu.system.confirm(confirm, "q");
            $("#btnYes").click(function (e) {
                $("#myModalAlert").modal("hide");
                var strDiemMacDinh = $("#txtDiemMacDinh").val();
                me.save_NhapDiemMacDinh(strDiemMacDinh, "");
            });
        });

        $("#btnNhapDiemMacDinh").click(function () {
            var confirm = 'Bạn có chắc chắn muốn nhập điểm mặc định cho danh sách?';
            confirm += '<div class="clear"></div>';
            confirm += '<table>';
            confirm += '<tbody>';
            confirm += '<tr>';
            confirm += '<td>Điểm mặc định:</td>';
            confirm += '<td>  <input id="txtDiemMacDinh" class="form-control" /> </td>';
            confirm += '</tr>';
            confirm += '</tbody>';
            confirm += '</table>';
            confirm += '<div class="clear"></div>';
            confirm += '<div class="clear"></div>';
            edu.system.confirm(confirm, "q");
            $("#btnYes").click(function (e) {
                $("#myModalAlert").modal("hide");
                var strDiemMacDinh = $("#txtDiemMacDinh").val();
                me.save_NhapDiemMacDinh(strDiemMacDinh, me.strDSDiem_Id);
            });
        });
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_nhapdiem");
    },
    toggle_detail: function (strDanhSach_Id) {
        var me = this;
        me.strDanhSach_Id = strDanhSach_Id;
        edu.util.toggle_overide("zone-bus", "zone_input_nhapdiem");
        //console.log($("body.skin-blue.sidebar-collapse").length);
        if ($("body.skin-blue.sidebar-collapse").length == 0) {
            $("nav .sidebar-toggle").trigger("click");
        }
        $(window).scrollTop(150);
        //var ilength = window.innerHeight - 60;
        //$("#table-container").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
        me.getList_ThongTinHienThiCot(strDanhSach_Id);
    },
    toggle_edithienthi: function (strDanhSach_Id) {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zone_edithienthi");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_Hoc: function (strDeTai_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_Hoc/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),//,'B7EEDF237D98403294EF4C8A6628F9C0',
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),//'930C20DE21494475943AA79803CBA2EA',
            'strTrangThai_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strNguoiDung_Id': edu.system.userId,//'6E83EC35FE5D46138562A0D3E39A1047',
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDSDiem = dtReRult;
                    me.genTable_Hoc(dtReRult, data.Pager);
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
    genTable_Hoc: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblNhapDiem_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblDSDiem",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NhapDiem.getList_Hoc()",
                iDataRow: iPager
            },
            colPos: {
                center: [0,6,7,9, 8]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIDANHSACH_TEN"
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOLUONG) + "(" + edu.util.returnEmpty(aData.TYLENHAPDIEM) + "%)";
                    }
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="file' + aData.ID + '"></div>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-primary btnChonDanhSach" data-dismiss="modal" id="' + aData.ID + '">Chọn</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data != null && data.length == 1) {
            me.toggle_detail(data[0].ID);
        }
        var arrFile = [];
        data.forEach(e => {
            arrFile.push("file" + e.ID);
        });
        edu.system.uploadFiles(arrFile, "", (a, b) => {
            console.log(a);
            console.log(b);
            edu.system.saveFiles(a, a.substr(4), "NS_Files");
        });
        data.forEach(e => {
            edu.system.viewFiles("file" + e.ID, e.ID, "NS_Files");
        });
        //me.toggle_detail(data[0].ID);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThongTinHienThiCot: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongThuc/LayChiTiet',
            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strNguoiThucHien_Id': edu.system.userId,//'6E83EC35FE5D46138562A0D3E39A1047',
            'strDaoTao_HocPhan_Id': '',//'5AB8E8BD198842D2BE3FC2721DEAF7CF',
            'strDiem_DanhSachHoc_Id': strDanhSach_Id,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genHTML_ThongTinHienThiCot(dtReRult, data.Pager, data.Id);
                    me.getList_NguoiHoc(strDanhSach_Id);
                    //me.genTable_HienThi(dtReRult.Table1);
                    //me.toggle_edithienthi();
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
    genHTML_ThongTinHienThiCot: function (data, iPager, strCongThuc) {
        var me = this;
        var dtThongTinDiem = data.rsDSCotThongTinDiem;
        me.dtCotThongTinDiem = data.rsDSCotThongTinDiem;
        var dtNguoiHoc = data.rsDSCotThongTinNguoiHoc;
        me.dtCotNguoiHoc = data.rsDSCotThongTinNguoiHoc;
        var row = '';
        row += '<tr>';
        for (var i = 0; i < dtNguoiHoc.length; i++) {
            row += '<th>' + dtNguoiHoc[i].TENCOT + '</th>';
        }
        row += '</tr>';
        //row += '<tr>';
        //for (var i = 0; i < dtThongTinDiem.length; i++) {
        //    row += '<th id="' + dtThongTinDiem[i].MACOT + '" ' + me.getstyle(dtThongTinDiem[i], true) + '>' + dtThongTinDiem[i].TENCOT + '</th>';
        //}
        //row += '</tr>';
        if (dtThongTinDiem.length > 13) document.getElementById("divNhapDiem").style = "font-size: 11px !important";
        else document.getElementById("divNhapDiem").style = "";
        me.arrHeadDiem_Id = me.insertHeaderTable("tblNhapDiem", dtThongTinDiem, null, row);
    },
    insertHeaderTable: function (strTable_Id, obj, strQuanHeCha, strHead) {
        //Khởi tạo table
        $("#" + strTable_Id).html('<thead class="mauthangbo" style="font-weight: bold">' + strHead + '<tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr><tr></tr></thead><tbody></tbody>');

        var arrHeaderId = [];
        //Lấy toàn bộ phần tử gốc đầu tiền xong gọi đệ quy load header table theo công thức điểm
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].MACOT_CHA == strQuanHeCha) {
                recuseHeader(obj, obj[i], 0);
            }
        }
        //Add rowspan cho các thành phần không có phần từ con
        //rowspan = rowTheadOfTable - colspan
        var x = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
        for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < x[i].cells.length; j++) {
                var z = x[i].cells[j].colSpan;
                if (z == 1) {
                    var irowspan = (x.length - i);
                    if (irowspan > 1) x[i].cells[j].rowSpan = (x.length - i);
                }
            }
        }
        //Hàm đề quy insert các phần tử con ra thead (datatable của công thức, phần từ cha cần đệ quy, số thứ tự dòng của phần tử cha trong thead)
        //Nguyên tắc: rowspan phần tử cha = sum(rowspan phần tử con) -1;
        function recuseHeader(objAll, objRecuse, iBac) {
            var x = spliceData(objAll, objRecuse.MACOT);
            var iTong = x.length;
            for (var j = 0; j < x.length; j++) {
                var iSoLuong = spliceData(objAll, x[j].MACOT);
                if (iSoLuong.length > 0) {
                    var iDem = recuseHeader(objAll, x[j], iBac + 1);
                    iTong += iDem - 1;
                }
                else {
                    insertHeader(strTable_Id, x[j], iBac + 1, iSoLuong.length);
                }
            }
            insertHeader(strTable_Id, objRecuse, iBac, iTong);
            return iTong;
        }

        function insertHeader(strTable_Id, objHead, iThuTu, colspan) {
            //Kiểm tra số dòng nếu nhỏ hơn số thứ tự dòng iThuTu thì thêm 1 dòng
            //var lHeader = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows;
            //if (lHeader.length <= iThuTu) {
            //    $("#" + strTable_Id + " thead").append("<tr></tr>");
            //    setTimeout(function () {
            //        $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //    }, 1);
            //} else {
            //    $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.ID + "' colspan='" + colspan + "'>" + objHead.HOCPHAN + "</th>");
            //}
            $("#" + strTable_Id + " thead tr:eq(" + iThuTu + ")").append("<th class='td-center' id='" + objHead.MACOT + "' colspan='" + colspan + "'>" + objHead.TENCOT + "</th>");
            if (colspan == 0) {
                arrHeaderId.push(objHead);
                //$("#" + strTable_Id + "_Data thead tr:eq(0)").append("<th style='width: 60px'>" + objHead.HOCPHAN + "</th>");
            }
        }
        //Lấy số con của thằng cha trong datatable công thức
        function spliceData(objData, strQuanHeCha_Id) {
            var arr = [];
            var iLength = objData.length;
            for (var i = 0; i < iLength; i++) {
                if (objData[i].MACOT_CHA == strQuanHeCha_Id) {
                    arr.push(objData[i]);
                }
            }
            return arr;
        }
        return arrHeaderId;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_NguoiHoc: function (strDanhSach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_Hoc_NguoiHoc/LayDanhSach',
            'strDiem_DanhSachHoc_Id': strDanhSach_Id,
            'strTieuChiSapXep': edu.util.getValById('dropSearch_LoaiSapXep'),
            'strNguoiThucHien_Id': edu.system.userId,//"6E83EC35FE5D46138562A0D3E39A1047",
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiHoc = data.Data;
                    me.genTable_NguoiHoc(data.Data, data.Pager);
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
    genTable_NguoiHoc: function (data, iPager) {
        var me = this;
        var row = '';
        for (var i = 0; i < data.length; i++) {
            row += '<tr id="' + data[i].QLSV_NGUOIHOC_ID + '">';
            for (var j = 0; j < me.dtCotNguoiHoc.length; j++) {
                row += '<td ' + me.getstyle(me.dtCotNguoiHoc[j]) + '>' + edu.util.returnEmpty(data[i][me.dtCotNguoiHoc[j].MACOT]) + '</td>';
            }
            for (var j = 0; j < me.arrHeadDiem_Id.length; j++) {
                row += '<td id="' + data[i].QLSV_NGUOIHOC_ID + '_' + me.arrHeadDiem_Id[j].MACOT + '" ' + me.getstyle(me.arrHeadDiem_Id[j]) + '>';
                //if (me.arrHeadDiem_Id[j].CHIXEM != 1) row += '<input id="input' + data[i].ID + "_" + me.arrHeadDiem_Id[j].MACOT + '" style="width: 40px"/>';
                row += '</td>';
            }
            row += '</tr>';
        }
        $("#tblNhapDiem tbody").html(row);
        edu.system.genHTML_Progress("divprogessdiem", me.arrHeadDiem_Id.length);
        for (var j = 0; j < me.arrHeadDiem_Id.length; j++) {
            me.getList_Diem(data, me.arrHeadDiem_Id[j].MACOT, me.arrHeadDiem_Id[j].CHIXEM);
        }
        /*III. Callback*/
    },
    actionTable_NguoiHoc: function () {
        setTimeout(function () {
            var me = main_doc.NhapDiem;
            me.move_ThroughInTable("tblNhapDiem");
            function moveScroll() {
                var scroll = $(window).scrollTop();
                var anchor_top = $("#tblNhapDiem").offset().top;
                var anchor_bottom = $("#bottom_anchor").offset().top;
                if (scroll > anchor_top && scroll < anchor_bottom) {
                    clone_table = $("#clone");
                    if (clone_table.length == 0) {
                        clone_table = $("#tblNhapDiem").clone();
                        clone_table.attr('id', 'clone');
                        clone_table.css({
                            position: 'fixed',
                            'pointer-events': 'none',
                            top: 0
                        });
                        clone_table.width($("#tblNhapDiem").width());
                        $("#table-container").append(clone_table);
                        $("#clone").css({ visibility: 'hidden' });
                        $("#clone thead").css({ visibility: 'visible' });
                    }
                } else {
                    $("#clone").remove();
                }
            }
            $(window).scroll(moveScroll);
            $("#table-container").scroll(function () {
                var x = $("#clone");
                if (x.length > 0) {
                    x = x[0];
                    var anchor_left = $("#tblNhapDiem").offset().left;
                    $("#clone")[0].style.left = anchor_left + "px";
                }
            }); 
            //$("#table-container").append('<table id="tblNhapDiemclone" class="table table-hover table-bordered"><tbody></tbody></table>');
            //var x = $("#tblNhapDiem tbody");
            //for (var i = 0; i < x.length; i++) {
            //    for (var j = 0; j < 5; j++) {
            //        $("#")
            //    }
            //}
            //$("#tblNhapDiemclone").remove();
            //clone_table = $("#tblNhapDiem").clone();
            //clone_table.attr('id', 'tblNhapDiemclone');
            //clone_table.css({
            //    position: 'absolute',
            //    'pointer-events': 'none',
            //    top: 0
            //});
            //clone_table.width($("#tblNhapDiem").width());
            //$("#table-container").append(clone_table);
            //$("#tblNhapDiemclone").css({ visibility: 'hidden' });
            //$("#tblNhapDiemclone tbody").css({ visibility: 'visible' });
            //var x = $("#tblNhapDiemclone tbody")[0].rows;
            //for (var i = 0; i < x.length; i++) {
            //    for (var j = 7; j < x[i].cells.length; j++) {
            //        $(x[i].cells[j]).css({ visibility: 'hidden' });
            //    }
            //}
            //$("#tblNhapDiemclone tbody")[0].classList.add("mauthangcon");
           
            //var row = $("#tblNhapDiem tbody")[0].rows;
            //var rowNguoiHoc = $("#tblNhapDiemclone tbody")[0].rows;
            //for (var i = 0; i < row.length; i++) {
            //    var ilenghtDiem = row[i].clientHeight;
            //    var ilengthNguoiHoc = rowNguoiHoc[i].clientHeight;

            //    if (ilengthNguoiHoc < ilenghtDiem)
            //        $(rowNguoiHoc[i]).attr("height", row[i].clientHeight);
            //    else
            //        $(row[i]).attr("height", rowNguoiHoc[i].clientHeight);

            //    if (i < row.length - 1) {
            //        var iLengthTopDiem = $(row[i + 1]).offset().top;
            //        var iLengthTopNguoiHoc = $(rowNguoiHoc[i + 1]).offset().top;
            //        var iChenhLech = iLengthTopDiem - iLengthTopNguoiHoc;
            //        if (iChenhLech != 0) {
            //            if (iChenhLech > 0) {
            //                $(rowNguoiHoc[i]).attr("height", (rowNguoiHoc[i].clientHeight + iChenhLech));
            //            }
            //            else {
            //                $(row[i]).attr("height", (row[i].clientHeight - iChenhLech));
            //            }
            //        }
            //    }

            //}
            //var rowHead = $("#tblNhapDiem thead")[0].rows[0];
            //var rowHeadNguoiHoc = $("#tblNhapDiemclone thead")[0].rows[0];
            //var iSoCot = 7;
            //for (var i = 0; i < iSoCot; i++) {
            //    console.log(rowHead.cells[i].scrollWidth);
            //    rowHeadNguoiHoc.cells[i].scrollWidth = rowHead.cells[i].scrollWidth;
            //    rowHeadNguoiHoc.cells[i].style.width = rowHead.cells[i].scrollWidth + 1 + "px";
            //}
        }, 500);
        
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_NguoiHoc_Diem: function (rowNguoiHoc, strMaCot, dChiXem) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoNguoiHoc',
            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhan_Id': rowNguoiHoc.DAOTAO_HOCPHAN_ID,
            'strDiem_DanhSachHoc_Id': rowNguoiHoc.DIEM_DANHSACHHOC_ID,
            'strQLSV_NguoiHoc_Id': rowNguoiHoc.QLSV_NGUOIHOC_ID,
            'strDiem_DanhSach_NguoiHoc_Id': rowNguoiHoc.DIEM_DANHSACH_NGUOIHOC_ID,
            'strKyHieuCotDuLieu': strMaCot,
        };
        var strNguoiHoc_Id = rowNguoiHoc.QLSV_NGUOIHOC_ID;
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (dChiXem != 1) {
                        $("#" + strNguoiHoc_Id + "_" + strMaCot).html('<input id="input' + strNguoiHoc_Id + "_" + strMaCot + '" value="' + data.Id + '" name="' + data.Id + '" style="width: 40px"/>');
                    } else {
                        $("#" + strNguoiHoc_Id + "_" + strMaCot).html(data.Id);
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
                edu.system.start_Progress("divprogessdiem", me.actionTable_NguoiHoc);
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessdiem", me.actionTable_NguoiHoc);
            },
            type: 'POST',
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
    getList_Diem: function (dtNguoiHoc, strMaCot, dChiXem) {
        var me = this;
        //if (strMaCot != "DANHGIAHETHOCPHAN") return;
        //--Edit
        var obj_list = {
            'action': 'D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_HocPhan_Id': dtNguoiHoc[0].DAOTAO_HOCPHAN_ID,
            'strDiem_DanhSachHoc_Id': dtNguoiHoc[0].DIEM_DANHSACHHOC_ID,
            'strKyHieuCotDuLieu': strMaCot,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                   // if (strMaCot == "LANHOC") console.log(data.Data)
                    for (var i = 0; i < data.Data.length; i++) {
                       // if (strMaCot == "DANHGIAHETHOCPHAN") edu.system.alert(data.Data[i].QLSV_NGUOIHOC_ID + " : " + data.Data[i].GIATRICOTDULIEU);
                        var strNguoiHoc_Id = data.Data[i].QLSV_NGUOIHOC_ID;
                       // if (strNguoiHoc_Id == "A1C0DD8A83BA44439246135C0A3536D1" || strNguoiHoc_Id == "16498D9C68664FFC9693F78B4B4C0CC2") console.log(data.Data);
                        var dCellChiXem = data.Data[i].CHIXEM;
                        var dGiaTri = edu.util.returnEmpty(data.Data[i].GIATRICOTDULIEU);
                        //var x = $("#input" + strNguoiHoc_Id + "_" + strMaCot);
                        if (dCellChiXem == 1) {
                            $("#" + strNguoiHoc_Id + "_" + strMaCot).html(dGiaTri);

                        }
                        else {
                            $("#" + strNguoiHoc_Id + "_" + strMaCot).html('<input id="input' + strNguoiHoc_Id + "_" + strMaCot + '" value="' + dGiaTri + '" name="' + dGiaTri + '" style="width: 40px"/>');
                        }
                        //if (x.length > 0) {
                        //    //x.replaceWith(dGiaTri);
                        //    //if (dCellChiXem == 1) {
                        //    //    x.replaceWith(dGiaTri);
                        //    //}
                        //    //else {
                        //        if (dChiXem != 1) {
                        //            x.val(dGiaTri);
                        //            x.attr("name", dGiaTri);
                        //        }
                        //    //}
                        //}
                        //else {
                        //    $("#" + strNguoiHoc_Id + "_" + strMaCot).html(dGiaTri);
                        //    if (strMaCot == "DIEMSOHE4") console.log(dGiaTri)
                        //    if (dChiXem == 1) {
                        //        if (dCellChiXem == 0) {
                        //            $("#" + strNguoiHoc_Id + "_" + strMaCot).html('<input id="input' + strNguoiHoc_Id + "_" + strMaCot + '" value="' + dGiaTri + '" name="' + dGiaTri + '" style="width: 40px"/>');
                        //        }
                        //    }
                        //}
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                edu.system.start_Progress("divprogessdiem", me.actionTable_NguoiHoc);
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
                edu.system.start_Progress("divprogessdiem", me.actionTable_NguoiHoc);
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
    genTable_Hoc_Diem: function (data, iPager) {
        var me = this;
    },
    move_ThroughInTable: function (strTable_Id, strDoiTuongDiChuyyen) { // di chuyển giữa các inpnut trong bảng
        if (strDoiTuongDiChuyyen === "" || strDoiTuongDiChuyyen === undefined || strDoiTuongDiChuyyen === null) strDoiTuongDiChuyyen = "input, select, textarea";
        //Lấy toàn bộ địa chỉ các phần từ cần di chuyển (input, select,textarea)  lưu vào bảng nhớ
        var arrElement = $("#" + strTable_Id).find("tbody").find("tr").find("td").find(strDoiTuongDiChuyyen);
        //Lấy chiều dài bảng tương ứng với chiều dài dòng đầu tiên
        var iChieuDaiBang = $("#" + strTable_Id).find("tbody").find("tr:eq(0)").find(strDoiTuongDiChuyyen).length;
        //Khi table có click sẽ chỉ xác nhận với các key di chuyển đã quy định
        $("#" + strTable_Id + " tbody tr td " + strDoiTuongDiChuyyen).keydown(function (e) {
            //Tìm địa chỉ hiện tại của đối tượng trước khi di chuyển bằng cách kiểm tra địa chỉ có nó xem có trùng với thằng nào trong bảng nhớ trên
            var iVitri = IndexOf(arrElement, this);
            //Vị trí = -1 với trường hợp không tìm thấy địa chỉ hiện tại
            if (iVitri == -1) return;
            switch (parseInt(e.which, 10)) {
                case 39: //Sang phải bằng cách lây vị trí của nó cộng với 1
                    $(arrElement[iVitri + 1]).focus();
                    break;
                case 38: //Lên trên bằng cách lấy địa chỉ của nó bằng cách lấy dòng hiện tại(x) - 1(key: di chuyển lên trên) nhân chiều dài bảng và cộng với vị trí cột (y): "(x-1)*ly + y"
                    var idongthu = Math.floor(iVitri / iChieuDaiBang);
                    var icotthu = iVitri % iChieuDaiBang;
                    $(arrElement[((idongthu - 1) * iChieuDaiBang) + icotthu]).focus();
                    break;
                case 37: //Sang trái bằng cách lây vị trí của nó trừ đi 1
                    $(arrElement[iVitri - 1]).focus();
                    break;
                case 13:// nút enter
                case 40: //Xuống dưới bằng cách lấy địa chỉ của nó bằng cách lấy dòng hiện tại(x)  1(key: di chuyển xuống dưới) nhân chiều dài bảng và cộng với vị trí cột (y): "(x+1)*ly + y"
                    var idongthu = Math.floor(iVitri / iChieuDaiBang);
                    var icotthu = iVitri % iChieuDaiBang;
                    $(arrElement[((idongthu + 1) * iChieuDaiBang) + icotthu]).focus();
                    break;
            }
        });

        function IndexOf(arrX, eY) {
            for (var i = 0; i < arrX.length; i++) {
                if (eY == arrX[i]) return i;
            }
            return -1;
        }
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    save_Diem: function (point) {
        var me = this;
        var strNguoiHoc_Id = point.id.substr(5, 32);
        var strDiem = point.value;
        var strMaCot = point.id.substring(38);
        var aData = edu.util.objGetDataInData(strNguoiHoc_Id, me.dtNguoiHoc, "QLSV_NGUOIHOC_ID")[0];
        console.log(aData);
        //if (aData == undefined) return;
        var obj_save = {
            'action': 'D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan',

            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strUngDung_Id': edu.system.appId,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strDiem_DanhSach_NguoiHoc_Id': aData.ID,
            'strDiem_DanhSachHoc_Id': aData.DIEM_DANHSACHHOC_ID,
            'strQLSV_NguoiHoc_Id': strNguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': aData.CHUONGTRINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDiem_ThanhPhanDiem_Id': strMaCot,
            'strLanHoc': aData.LANHOC,
            'strLanThi': aData.LANTHI,
            'strDiem': strDiem,
            'strGhiChu': '',
            'strNguoiThucHien_Id': edu.system.userId,//'6E83EC35FE5D46138562A0D3E39A1047',
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                }
                else {
                    edu.system.alert(aData.HODEMNGUOIHOC + " " + aData.TENNGUOIHOC + "(" + strMaCot + ":" + strDiem + ") lỗi: " + data.Message);
                }
                
                edu.system.start_Progress("alertprogessbar", me.endLuuDiem);
            },
            error: function (er) {
                edu.system.alert(obj_save + " (er): " + JSON.stringify(er));
                edu.system.start_Progress("alertprogessbar", me.endLuuDiem);
            },
            type: 'POST',
            
            contentType: true,
            
            async: false,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    tinh_Diem: function (point) {
        var me = this;
        var strNguoiHoc_Id = point.id.substr(0, 32);
        var aData = edu.util.objGetDataInData(strNguoiHoc_Id, me.dtNguoiHoc, "QLSV_NGUOIHOC_ID")[0];
        //if (aData.MASONGUOIHOC != "DTC0851220024") return;
        //if (aData == undefined) return;
        var obj_save = {
            'action': 'D_Hoc_NguoiHoc_Diem/Tinh_Diem_NguoiHoc_ThanhPhan',

            'strChucNang_Id': edu.system.strChucNang_Id,//'8D42F005D1934295959197C5278F4BF9',
            'strUngDung_Id': edu.system.appId,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strDiem_DanhSach_NguoiHoc_Id': strNguoiHoc_Id,
            'strDiem_DanhSachHoc_Id': aData.DIEM_DANHSACHHOC_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.CHUONGTRINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDiem_ThanhPhanDiem_Id': "",
            'strLanHoc': aData.LANHOC,
            'strLanThi': aData.LANTHI,
            //'strDiem': strDiem,
            'strGhiChu': '',
            'strNguoiThucHien_Id': edu.system.userId//'6E83EC35FE5D46138562A0D3E39A1047',
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                
                edu.system.start_Progress("alertprogessbar", me.endLuuDiem);
            },
            error: function (er) {
                edu.system.alert(obj_save + " (er): " + JSON.stringify(er));
                edu.system.start_Progress("alertprogessbar", me.endLuuDiem);
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endLuuDiem: function () {
        var me = main_doc.NhapDiem;
        $("#myModalAlert #alert_content").html("Thực hiện thành công");
        me.toggle_detail(me.strDanhSach_Id);
    },
    getstyle: function (row, bcheckth) {
        var html = 'style="';
        if (edu.util.checkValue(row.DORONG) && row.DORONG != 0 && row.DORONG != '0') {
            html +='width: ' + row.DORONG + 'px;';
        }
        if (edu.util.checkValue(row.KICHTHUOCFONTCHU) && row.KICHTHUOCFONTCHU != 0 && row.KICHTHUOCFONTCHU != '0') {
            html += 'font-size: ' + row.KICHTHUOCFONTCHU + 'px !important;';
        }
        if (edu.util.checkValue(row.CANLE)) {
            html += row.CANLE + ';';
        }
        if (edu.util.checkValue(row.MAMAUHIENTHI)) {
            html +='color: #' + row.MAMAUHIENTHI + ';';
        }
        if (!bcheckth && edu.util.checkValue(row.CHUDAM)) {
            html += row.CHUDAM + ';';
        }
        html += '"';
        return html;
    },
    import_Table: function (a, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_Hoc_NguoiHoc_Diem_Import/Import',
            

            'strPath': strPath,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#notify_import").html("Đã import dữ liệu: " + data.Data);
                }
                else {
                    $("#notify_import").html("Lỗi: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_SVQT/LayDanhSach (er): " + JSON.stringify(er), "w");
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
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        edu.util.viewValById("dropSearch_ThoiGian", "");

        //--Edit
        var obj_list = {
            'action': 'D_ThoiGian/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_ThoiGian(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {},
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_ThoiGian: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_LoaiDanhSach: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'D_LoaiDanhSach/LayLoaiDanhSach',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_LoaiDanhSach(data.Data, data.Pager);
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
    genList_LoaiDanhSach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiDanhSach"],
            type: "",
            title: "Chọn loại danh sách"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_LopQuanLy: function () {
        var me = this;
        edu.util.viewValById("dropSearch_LopQuanLy", "");
        //--Edit
        var obj_list = {
            'action': 'D_LopQuanLy/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_LopQuanLy(data.Data, data.Pager);
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
    genList_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;
        edu.util.viewValById("dropSearch_HocPhan", "");

        //--Edit
        var obj_list = {
            'action': 'D_HocPhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_HocPhan(data.Data, data.Pager);
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
    genList_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
        main_doc.NhapDiem.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_XacNhan/XacNhan_DanhSachDiem',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.loadBtnXacNhan(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/

    save_NhapDiemMacDinh: function (strDiemCanNhapMacDinh, strDiem_DanhSachHoc_Id) {
        var me = this;
        //if (aData == undefined) return;
        var obj_save = {
            'action': 'D_Diem_MacDinh/Nhap_Diem_MacDinh_DanhSach',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.appId,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),//,'B7EEDF237D98403294EF4C8A6628F9C0',
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),//'930C20DE21494475943AA79803CBA2EA',
            'strTrangThai_Id': edu.util.getValById('dropAAAA'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropAAAA'),
            'strLoaiDanhSach_Id': edu.util.getValById('dropSearch_LoaiDanhSach'),
            'strNguoiDung_Id': edu.system.userId,//'6E83EC35FE5D46138562A0D3E39A1047',
            'strNguoiThucHien_Id': edu.system.userId,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),

            'strDiemCanNhapMacDinh': strDiemCanNhapMacDinh,
            'strDiem_DanhSachHoc_Id': strDiem_DanhSachHoc_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save + " (er): " + JSON.stringify(er));
            },
            type: 'POST',

            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}