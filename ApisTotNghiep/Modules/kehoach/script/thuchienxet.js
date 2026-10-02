/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function ThucHienXet() { };
ThucHienXet.prototype = {
    dtThucHienXet: [],
    strThucHienXet_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    objHangDoi: {},
    strHeadDat: '',
    strHeadKhongDat: '',
    dtDat_ChiTiet: {},
    dtKhongDat_ChiTiet: {},
    strTN_KeHoachView_Id: '',
    strTNKeHoach_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_ThoiGianDaoTao();
        me.getList_ThucHienXet();
        me.getList_PhanLoai();
        me.strHeadDat = $("#tblDat thead").html();
        me.strHeadKhongDat = $("#tblKhongDat thead").html();

        $("#btnSearch").click(function (e) {
            me.getList_ThucHienXet();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ThucHienXet();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnThucHienCongNhan").click(function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng xét?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xét không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXet"></div>');
                edu.system.genHTML_Progress("zoneprocessXet", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_ThucHienXet(arrChecked_Id[i]);
                }
            });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThucHienXet" });
        });
        $("#btnXoaThucHienXet").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) { 
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessXet"></div>');
                edu.system.genHTML_Progress("zoneprocessXet", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThucHienXet(arrChecked_Id[i]);
                }
            });
        });
        edu.system.getList_MauImport("zonebtnTHX", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
            var arrCheckedDat_Id = edu.util.getArrCheckedIds("tblDat", "checkX");
            var obj_list = {
                'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
                'strKhoaHoc_Id': edu.util.getValById('dropSearch_KhoaHoc'),
                'strTN_KeHoach_Id': arrChecked_Id.toString(),
                'strQLSV_NguoiHoc_Id': arrCheckedDat_Id.toString()
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });
        //$("#tblThucHienXet").delegate('.btnEdit', 'click', function (e) {
        //    var strId = this.id;
        //    me.toggle_edit()
        //    strId = edu.util.cutPrefixId(/edit/g, strId);
        //    edu.util.setOne_BgRow(strId, "tblThucHienXet");
        //    if (edu.util.checkValue(strId)) {
        //        var data = edu.util.objGetDataInData(strId, me.dtThucHienXet, "ID")[0];
        //        me.viewEdit_ThucHienXet(data);
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
       
       // $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
       //     var id = this.id;
       //     var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
       //     me.addHTMLinto_SinhVien(strNhanSu_Id);
       // });
       // $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
       //     var id = this.id;
       //     var strcheck = $(this).attr("name");
       //     var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
       //     if (!edu.util.checkValue(strcheck)) {
       //         me.removeHTMLoff_SinhVien(strNhanSu_Id);
       //     }
       //     else {
       //         edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
       //         $("#btnYes").click(function (e) {
       //             me.delete_SinhVien(strNhanSu_Id);
       //         });
       //     }
       // });

       // $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
       //     me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
       //     if (me.arrKhoa.length > 0) {
       //         var strApDungChoKhoa = "";
       //         var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
       //             strApDungChoKhoa += ", " + $(this).text();
       //         });
       //         $("#ApDungChoKhoa").html("Áp dụng tất cả sinh viên trong những khóa: " + strApDungChoKhoa);
       //         edu.system.alert("Áp dụng tất cả sinh viên trong những khóa: " + strApDungChoKhoa);
       //         $("#modal_sinhvien").modal("hide");
       //     }
       // });
       // $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
       //     me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
       //     if (me.arrChuongTrinh.length > 0) {
       //         var strApDungChoChuongTrinh = "";
       //         var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
       //             strApDungChoChuongTrinh += ", " + $(this).text();
       //         });
       //         $("#ApDungChoChuongTrinh").html("Áp dụng tất cả sinh viên trong những chương trình: " + strApDungChoChuongTrinh);
       //         edu.system.alert("Áp dụng tất cả sinh viên trong những chương trình: " + strApDungChoChuongTrinh);
       //         $("#modal_sinhvien").modal("hide");
       //     }
       // });
       // $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
       //     me.arrLop = $("#dropSearchModal_Lop_SV").val();
       //     if (me.arrLop.length > 0) {
       //         var strApDungChoLop = "";
       //         var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
       //             strApDungChoLop += ", " + $(this).text();
       //         });
       //         $("#ApDungChoLop").html("Áp dụng tất cả sinh viên trong những lớp: " + strApDungChoLop);
       //         edu.system.alert("Áp dụng tất cả sinh viên trong những lớp: " + strApDungChoLop);
       //         $("#modal_sinhvien").modal("hide");
       //     }
       // });
       // /*------------------------------------------
       //--Discription: [2] Action NhanSu
       //--Order: 
       //-------------------------------------------*/
       // $(".btnSearchDTSV_GiangVien").click(function () {
       //     edu.extend.genModal_NhanSu();
       //     edu.extend.getList_NhanSu("SEARCH");
       // });
       // $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
       //     var id = this.id;
       //     var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
       //     me.genHTML_NhanSu(strNhanSu_Id);
       // });
       // $("#tblInput_DTSV_GiangVien").delegate('.btnDeletePoiter', 'click', function () {
       //     var id = this.id;
       //     var strcheck = $(this).attr("name");
       //     var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
       //     if (!edu.util.checkValue(strcheck)) {
       //         me.removeHTML_NhanSu(strNhanSu_Id);
       //     }
       //     else {
       //         edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
       //         $("#btnYes").click(function (e) {
       //             me.delete_GiangVien_HD(strNhanSu_Id);
       //         });
       //     }
       // });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtThucHienXet_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblThucHienXet").delegate('.btnDSDoiTuong', 'click', function (e) {
            $('#myModal').modal('show');
            me.strTN_KeHoachView_Id = this.id;
            me["strTN_KeHoach_Id"] = this.id;
            me.getList_QuanSoTheoLop(this.id);
        });
        $("#tblThucHienXet").delegate('.btnDSDat', 'click', function (e) {
            $('#myModalDat').modal('show');
            me.strTN_KeHoachView_Id = this.id;
            me["strTN_KeHoach_Id"] = this.id;
            me.getList_Dat_ChiTiet(this.id);
        });
        $("#tblThucHienXet").delegate('.btnDSDaCongNhan', 'click', function (e) {
            $('#myModalDaCongNhan').modal('show');
            me.strTN_KeHoachView_Id = this.id;
            me["strTN_KeHoach_Id"] = this.id;
            me.getList_DaCongNhan_ChiTiet(this.id);
        });
        $("#tblThucHienXet").delegate('.btnDSKhongDat', 'click', function (e) {
            $('#myModalKhongDat').modal('show');
            $("#tblHocPhan").hide();
            me.strTN_KeHoachView_Id = this.id;
            me["strTN_KeHoach_Id"] = this.id;
            me.getList_KhongDat_ChiTiet(this.id);
        });
        $("#tblThucHienXet").delegate('.btnDSHoanXet', 'click', function (e) {
            $('#myModalHoanXet').modal('show');
            me.strTN_KeHoachView_Id = this.id;
            me.getList_HoanXet(this.id);
        });
        $("#tblKhongDat").delegate('.btnDSHocPhan', 'click', function (e) {
            $('#myModalKhongDat').modal('show');
            me.strTN_KeHoachView_Id = this.id;
            me.getList_KhongDat_HocPhan(this.id);
        });
        me.objHangDoi = {
            strLoaiNhiemVu: "XET_TN",
            strName: "ThucHienXet",
            callback: me.endHangDoi
        };
        edu.system.createHangDoi(me.objHangDoi);
        $("#btnTaoHangDoi").off('click').on('click', function () {
            edu.system.confirm("Bạn có chắc chắn <span class='italic color-warning'>Thực hiện xét</span> không?");
            $("#btnYes").off('click').one('click', function (e) {
                me.TaoHangDoi();
            });

        });

        $("[id$=chkSelectAll_QuanSoLop]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblQuanSoLop" });
        });

        $("#btnThuHienXet").click(function () {
            var SoLuong = $("#tblQuanSoLop tbody tr input");
            var arrThem = [];
            var arrXoa = [];
            SoLuong.each(function () {
                var icheck = $(this).is(":checked") ? 1 : 0;
                var icheckName = $(this).attr("name") == undefined || $(this).attr("name") == "undefined";
                var strNguoiHoc_Id = this.id.replace('checkX', '');
                if (icheck == 1 && icheckName) {
                    arrThem.push(strNguoiHoc_Id)
                }
                if (icheck == 0 && !icheck) {
                    arrXoa.push(strNguoiHoc_Id)
                }
            });
            edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXet"></div>');
                edu.system.genHTML_Progress("zoneprocessXet", (arrThem.length));
                //arrXoa.forEach(e => me.save_ThucHienXetTungSV(strNguoiHoc_Id, 0.0))
                arrThem.forEach(e => me.save_ThucHienXetTungSV(e, 1.0))
            });

        });

        $("#btnSearch_DSChuaXet").click(function () {
            me.getList_ChuaXet();
        });
        //$("#txtTimSV").on("keyup", function () {
        //    var value = edu.system.change_alias($(this).val().toLowerCase());
        //    $("#tblQuanSoLop tbody tr").filter(function () {
        //        $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
        //    }).css("color", "red");
        //});

        $("#tblThucHienXet").delegate('.chkKeHoach', 'click', function (e) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
            me.strTNKeHoach_Id = arrChecked_Id.toString();
            me.getList_KhoaHoc(arrChecked_Id.toString());
        });
        $("#btnSearch_SV").click(function (e) {
            me.getList_QuanSoTheoLop(me.strTN_KeHoachView_Id);
        });
        $("#txtSearch_SV").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuanSoTheoLop(me.strTN_KeHoachView_Id);
            }
        });
        $("#btnSearch_SV_Dat").click(function (e) {
            me.getList_Dat(me.strTN_KeHoachView_Id);
        });
        $("#txtSearch_SV_Dat").keypress(function (e) {
            if (e.which === 13) {
                me.getList_Dat(me.strTN_KeHoachView_Id);
            }
        });
        $("#btnSearch_SV_KhongDat").click(function (e) {
            me.getList_KhongDat(me.strTN_KeHoachView_Id);
        });
        $("#txtSearch_SV_KhongDat").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KhongDat(me.strTN_KeHoachView_Id);
            }
        });
        $('#dropSearch_KhoaHoc').on('select2:select', function () {
            me.getList_LopQuanLy();
        });
        // FIX 2026-08-26: Click nut copy nho canh MSSV → copy mã sinh viên vao clipboard
        $("#tblQuanSoLop, #tblDat, #tblKhongDat, #tblDaCongNhan, #tblHoanXet").delegate('.btnCopyMSSV', 'click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var maso = $(this).data('mssv') || '';
            if (!maso) return;
            var $btn = $(this);
            var $ic = $btn.find('i');
            var oldClass = $ic.attr('class');
            var doneOK = function () {
                $ic.attr('class', 'fa fa-check');
                $btn.css({ 'background': '#dcfce7', 'border-color': '#22c55e', 'color': '#166534' });
                setTimeout(function () {
                    $ic.attr('class', oldClass);
                    $btn.css({ 'background': 'transparent', 'border-color': '#cbd5e1', 'color': '#475569' });
                }, 1200);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(maso).then(doneOK, function () {
                    // Fallback textarea method
                    var ta = document.createElement('textarea');
                    ta.value = maso; document.body.appendChild(ta);
                    ta.select(); document.execCommand('copy');
                    document.body.removeChild(ta);
                    doneOK();
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = maso; document.body.appendChild(ta);
                ta.select(); document.execCommand('copy');
                document.body.removeChild(ta);
                doneOK();
            }
        });

        // Click mã SV → mở modal chỉ nhúng trang "Theo dõi kết quả học tập" (không dùng thủ vai full cổng SV vì bảo mật). Pattern giống ApisCongCanBo/Modules/lichgiang/script/lichgiang.js
        $("#tblQuanSoLop, #tblDat, #tblKhongDat, #tblDaCongNhan, #tblHoanXet").delegate('.btnView_HocTap', 'click', function (e) {
            var strMSSV = $(this).data('mssv') || $(this).find('u').text();
            if (!strMSSV) { edu.system.alert("Không lấy được mã số sinh viên."); return; }
            $('#lblHTSinhVien').text('Xem sinh viên: ' + strMSSV);
            $('#modalHTSinhVien').modal('show');
            me["strSinhVien_Id"] = this.id;
            window._embeddedSinhVien_Id = this.id;
            // Dùng lại diemhoc.html của cổng SV (đầy đủ tab). Có warning ORA-24338 từ 1 API phụ nhưng bảng điểm/quyết định/văn bằng/... vẫn hiển thị được.
            edu.system.loadPage($("#zoneHTSinhVien"), '/modules/hoctap/html/diemhoc.html', null, null, 'ApisCongSinhVien');

            // Cách rút gọn (trang tự tạo trong ApisTotNghiep chỉ hiển thị Bảng điểm) — giữ comment để mở lại khi backend cho quyền:
            // edu.system.loadPage($("#zoneHTSinhVien"), '/modules/hoctap/html/xemdiem_sv.html', null, null, 'ApisTotNghiep');
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strThucHienXet_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_ThucHienXet();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThucHienXet: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtThucHienXet = dtReRult;
                    me.genTable_ThucHienXet(dtReRult, data.Pager);
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

    save_ThucHienXetTungSV: function (strTN_KeHoach_PhamVi_Id, dThucHienXet) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/ThietLap_Xet_TN_KeHoach_PhamVi',
            'type': 'POST',
            'strTN_KeHoach_PhamVi_Id': strTN_KeHoach_PhamVi_Id,
            'dThucHienXet': dThucHienXet,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThucHienXet_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");

                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_ThucHienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXet", function () {
                    me.getList_QuanSoTheoLop(me.strTN_KeHoachView_Id)
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ThucHienXet: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KetQua_CongNhan/ThemMoi',

            'strId':"",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThucHienXet_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("XLHV_ThucHienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXet", function () {
                    me.getList_ThucHienXet();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThucHienXet: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KetQua_CongNhan/Xoa',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            complete: function () {
                edu.system.start_Progress("zoneprocessXet", function () {
                    me.getList_ThucHienXet();
                });
            },
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Lop: function (strTN_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViLop',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_ThucHienXet();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThucHienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strTN_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViCT',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_ThucHienXet();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThucHienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strTN_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViKhoa',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_ThucHienXet();
            },
            error: function (er) {
                edu.system.alert("XLHV_ThucHienXet/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ThucHienXet: function (data, iPager) {
        var me = this;
        $("#lblThucHienXet_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThucHienXet",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_ThucHienXet()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 10, 11, 12],
            },
            aoColumns: [
                //{
                //    "mDataProp": "TN_KEHOACH_MA"
                //},
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default" id="DSPhanCong' + aData.ID + '" title="Chi tiết"></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết - ' + edu.util.returnEmpty(aData.TONGSOXET) + '</a></span>';
                    }
                },
                {
                    "mDataProp": "DIEUKIENXET"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDat" id="' + aData.ID + '" title="Chi tiết">Chi tiết - ' + edu.util.returnEmpty(aData.TONGSODAT ) + '</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSKhongDat" id="' + aData.ID + '" title="Chi tiết">Chi tiết - ' + edu.util.returnEmpty(aData.TONGSOKHONGDAT ) + '</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDaCongNhan" id="' + aData.ID + '" title="Chi tiết">Chi tiết - ' + edu.util.returnEmpty(aData.TONGSODACONGNHANCHINHTHUC) + '</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSHoanXet" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
                ,
                {
                    "mData": "KETQUACHINHTHUC",
                    "mRender": function (nRow, aData) {
                        return (aData.KETQUACHINHTHUC  == 1) ? "Chính thức": "";
                    }
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOICUOI_TAIKHOAN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="chkKeHoach" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            me.getList_PhanCong(data[i].ID);
        }
    },
    viewEdit_ThucHienXet: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropKetQua", data.KETQUACHINHTHUC);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        me.strThucHienXet_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_ThanhVien();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_PhanCong: function (strTN_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhanSu = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strNhanSu += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strNhanSu != "") strNhanSu = strNhanSu.substring(1);
                    $("#DSPhanCong").html(strNhanSu);
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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDoiTuong = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strDoiTuong += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strDoiTuong != "") strDoiTuong = strDoiTuong.substring(1);
                    $("#DSDoiTuong").html(strDoiTuong);
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
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strThucHienXet_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult);
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_ThucHienXet_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/ThemMoi',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strQLSV_ThucHienXet_Id,
            'strQLSV_NguoiHoc_Id': strNhanSu_Id,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_CHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TN_KeHoach_PhamVi/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    me.getList_SinhVien();
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_MASO + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].QLSV_NGUOIHOC_HODEM + " " + data[i].QLSV_NGUOIHOC_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].DAOTAO_LOPQUANLY_TEN + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_CHUONGTRINH_TEN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_KHOADAOTAO_TEN) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.ThucHienXet;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.QLSV_NGUOIHOC_ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.ThucHienXet;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    getList_PhanLoai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach/LayDSPhanLoaiXetTheoND1',
            'strNguoiDung_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_PhanLoai(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
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
            renderPlace: ["dropSearch_Lop"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.ThucHienXet;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThucHienXet_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.ThucHienXet.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_PhanLoai: function (data) {
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
            renderPlace: ["dropSearch_PhanLoai"],
            type: "",
            title: "Chọn phân loại",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strRowID, strThucHienXet_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_NhanSu/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strThucHienXet_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TN_KeHoach_NhanSu/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTN_KeHoach_Id': me.strThucHienXet_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
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
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach_NhanSu/Xoa',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "' name='" + data[i].NHANSU_HOSOCANBO_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHANSU_HOSOCANBO_MASO) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(data[i].NHANSU_HOSOCANBO_TEN) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        edu.system.pickerdate();
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID");
        //3. create html
        var html = "";
        var strRowID = edu.util.uuid().substr(2);
        html += "<tr id='" + strRowID + "' name='" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strRowID + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html); edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_QuanSoTheoLop: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_SV'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager, strTN_KeHoach_Id);
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
    genTable_QuanSoTheoLop: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_QuanSoTheoLop('" + strTN_KeHoach_Id + "')",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var maso = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                        return '<span class="mssv-cell" style="display:inline-flex;align-items:center;gap:4px;">'
                            + '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '" data-mssv="' + maso + '"><u>' + maso + '</u></div>'
                            + '<a class="btn btn-default btnCopyMSSV" data-mssv="' + maso + '" title="Copy mã số" style="padding:4px 7px;line-height:1;min-height:auto;background:transparent;border:1px solid #cbd5e1;color:#475569;cursor:pointer;"><i class="far fa-copy"></i></a>'
                            + '</span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }, {
                    "mRender": function (nRow, aData) {
                        var strcheck = aData.THUCHIENXET ? 'checked="checked" name="1"' : "";
                        return '<input type="checkbox" id="checkX' + aData.ID + '" ' + strcheck + '/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_ChuaXet: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach_PhamVi_ChuaXet',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strTN_KeHoachView_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ChuaXet([], data.Pager);
                    me.genTable_ChuaXet(dtReRult, data.Pager);
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
    genTable_ChuaXet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            //bPaginate: {
            //    strFuntionName: "main_doc.ThucHienXet.getList_ChuaXet('" + strTN_KeHoach_Id + "')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var maso = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                        return '<span class="mssv-cell" style="display:inline-flex;align-items:center;gap:4px;">'
                            + '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '" data-mssv="' + maso + '"><u>' + maso + '</u></div>'
                            + '<a class="btn btn-default btnCopyMSSV" data-mssv="' + maso + '" title="Copy mã số" style="padding:4px 7px;line-height:1;min-height:auto;background:transparent;border:1px solid #cbd5e1;color:#475569;cursor:pointer;"><i class="far fa-copy"></i></a>'
                            + '</span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }, {
                    "mRender": function (nRow, aData) {
                        var strcheck = aData.THUCHIENXET ? 'checked="checked" name="1"' : "";
                        return '<input type="checkbox" id="checkX' + aData.ID + '" ' + strcheck + '/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_Dat_ChiTiet: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua/LayChiTiet',
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDat_ChiTiet = data.Data;
                    me.getList_Dat(strTN_KeHoach_Id);
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
    getList_Dat: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_SV_Dat'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_Dat(dtReRult, data.Pager, strTN_KeHoach_Id);
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
    genTable_Dat: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        $("#tblDat thead").html(me.strHeadDat);
        for (var j = 0; j < me.dtDat_ChiTiet.rsCot.length; j++) {
            $("#tblDat thead tr:eq(0)").append('<th class="td-center">' + me.dtDat_ChiTiet.rsCot[j].TEN + '</th>');
        }
        $("#tblDat thead tr:eq(0)").append('<th class="td-center"></th>');
        var jsonForm = {
            strTable_Id: "tblDat",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_Dat('" + strTN_KeHoach_Id + "')",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var maso = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                        return '<span class="mssv-cell" style="display:inline-flex;align-items:center;gap:4px;">'
                            + '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '" data-mssv="' + maso + '"><u>' + maso + '</u></div>'
                            + '<a class="btn btn-default btnCopyMSSV" data-mssv="' + maso + '" title="Copy mã số" style="padding:4px 7px;line-height:1;min-height:auto;background:transparent;border:1px solid #cbd5e1;color:#475569;cursor:pointer;"><i class="far fa-copy"></i></a>'
                            + '</span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_THAYDOI_TEN"
                }
            ]
        };
        for (var j = 0; j < me.dtDat_ChiTiet.rsCot.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="zone_' + aData.ID + '_' + main_doc.ThucHienXet.dtDat_ChiTiet.rsCot[iThuTu].ID + '" ></span>';
                    }
                }
            );
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < me.dtDat_ChiTiet.rsDuLieu.length; i++) {
            var aData = me.dtDat_ChiTiet.rsDuLieu[i];
            try {
                $("#zone_" + aData.TN_KETQUA_ID + "_" + aData.ID).html(edu.util.returnEmpty(aData.GIATRI));

            } catch{

            }
        }
        /*III. Callback*/
    },

    getList_KhongDat_ChiTiet: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua_Loi/LayChiTiet',
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtKhongDat_ChiTiet = data.Data;
                    me.getList_KhongDat(strTN_KeHoach_Id);
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
    getList_KhongDat: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KetQua_Loi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_SV_KhongDat'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KhongDat(dtReRult, data.Pager, strTN_KeHoach_Id);
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
    genTable_KhongDat: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        me["dtKhongDat"] = data;
        $("#tblKhongDat thead").html(me.strHeadKhongDat);
        for (var j = 0; j < me.dtKhongDat_ChiTiet.rsCot.length; j++) {
            $("#tblKhongDat thead tr:eq(0)").append('<th class="td-center">' + me.dtKhongDat_ChiTiet.rsCot[j].TEN + '</th>');
        }
        var jsonForm = {
            strTable_Id: "tblKhongDat",

            bPaginate: {
                strFuntionName: "main_doc.ThucHienXet.getList_KhongDat('" + strTN_KeHoach_Id + "')",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var maso = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                        return '<span class="mssv-cell" style="display:inline-flex;align-items:center;gap:4px;">'
                            + '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '" data-mssv="' + maso + '"><u>' + maso + '</u></div>'
                            + '<a class="btn btn-default btnCopyMSSV" data-mssv="' + maso + '" title="Copy mã số" style="padding:4px 7px;line-height:1;min-height:auto;background:transparent;border:1px solid #cbd5e1;color:#475569;cursor:pointer;"><i class="far fa-copy"></i></a>'
                            + '</span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSHocPhan" id="' + aData.QLSV_NGUOIHOC_ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
            ]
        };
        for (var j = 0; j < me.dtKhongDat_ChiTiet.rsCot.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<span id="zone_' + aData.ID + '_' + main_doc.ThucHienXet.dtKhongDat_ChiTiet.rsCot[iThuTu].ID + '" ></span>';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < me.dtKhongDat_ChiTiet.rsDuLieu.length; i++) {
            var aData = me.dtKhongDat_ChiTiet.rsDuLieu[i];
            $("#zone_" + aData.TN_KETQUA_ID + "_" + aData.ID).html(edu.util.returnEmpty(aData.GIATRI));
        }
        /*III. Callback*/
    },


    getList_KhongDat_HocPhan: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var html = "";
        var aData = edu.util.objGetOneDataInData(strQLSV_NguoiHoc_Id, me.dtKhongDat, "QLSV_NGUOIHOC_ID");
        if (aData.length != 0) {
            html = "Chi tiết học phần không đạt " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HOTEN) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
        }
        $("#nameHocPhan").html(html);
        $("#tblHocPhan").show();
        //--Edit
        var obj_list = {
            'action': 'TN_KetQuaHocPhan/LayDanhSach',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strTN_KeHoach_Id': aData.TN_KEHOACH_ID,
            'strPhanLoai_Id': aData.PHANLOAI_ID,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KhongDat_HocPhan(dtReRult, data.Pager);
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
    genTable_KhongDat_HocPhan: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            
            aaData: data.filter(aData => (aData.DANHGIA_TEN != "DAT" && aData.DANHGIA_TEN != "ĐẠT")),
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mData": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN);
                    }
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN",
                    //"mRender": function (nRow, aData) {
                    //    if (aData.DANHGIA_TEN == "DAT" || aData.DANHGIA_TEN == "ĐẠT") return ""
                    //    return edu.util.returnEmpty(aData.DANHGIA_TEN);
                    //}
                },
                {
                    "mDataProp": "MOTA"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_HoanXet: function (strTN_KeHoach_Id) {
        var me = this;
        var html = "";
        
        //--Edit
        var obj_list = {
            'action': 'TN_DangKy/LayDSTN_KeHoach_DangKy',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HoanXet(dtReRult, data.Pager);
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
    genTable_HoanXet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblHoanXet",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var maso = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                        return '<span class="mssv-cell" style="display:inline-flex;align-items:center;gap:4px;">'
                            + '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '" data-mssv="' + maso + '"><u>' + maso + '</u></div>'
                            + '<a class="btn btn-default btnCopyMSSV" data-mssv="' + maso + '" title="Copy mã số" style="padding:4px 7px;line-height:1;min-height:auto;background:transparent;border:1px solid #cbd5e1;color:#475569;cursor:pointer;"><i class="far fa-copy"></i></a>'
                            + '</span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "TINHTRANG_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 23/08/2018
    --Discription: generating HangDoi db
    ----------------------------------------------*/
    TaoHangDoi: function () {
        var me = this;
        var obj_notify = {};
        var arrChecked_Id = edu.util.getArrCheckedIds("tblThucHienXet", "checkX");
        if (arrChecked_Id.length == 0) {
            edu.system.alert("Vui lòng chọn đối tượng?");
            return;
        }
        //--Edit
        var obj_list = {
            'action': 'TN_HangDoi/TaoHangDoi_TN_TuDong',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': arrChecked_Id.toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!",
                        code: "",
                    }
                    edu.system.afterComfirm(obj);
                    edu.system.createHangDoi(me.objHangDoi);
                }
                else {
                    var obj = {
                        content: "QLTC_HangDoi.TaoHangDoi_TinhHocPhi_TuDong: " + data.Message,
                        code: "w",
                    }
                    edu.system.afterComfirm(obj);
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                var obj = {
                    content: "QLTC_HangDoi.TaoHangDoi_TinhHocPhi_TuDong (er): " + JSON.stringify(er),
                    code: "w",
                }
                edu.system.afterComfirm(obj);
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endHangDoi: function () {
        var me = main_doc.ThucHienXet;
    },


    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaHoc: function (strTN_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSKhoaHocTheoKeHoach',
            'type': 'GET',
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
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
                    me.genCombo_KhoaHoc(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KhoaHoc"],
            title: "Chọn khóa học"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_LopQuanLy: function (strTN_KeHoach_Id) {
        var me = this;

        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRINLjEQNCAvDTgVKSQuCiQJLiAiKQPP',
            'func': 'pkg_totnghiep_thongtin.LayDSLopQuanLyTheoKeHoach',
            'iM': edu.system.iM,
            'strTN_KeHoach_Id': me.strTNKeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropSearch_KhoaHoc'),
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
                    me.genCombo_LopQuanLy(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_DaCongNhan_ChiTiet: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8P',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_KetQua_CongNhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strTN_KeHoach_Id': me.strTN_KeHoachView_Id,
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_LopQuanLy_Id': edu.system.getValById('dropAAAA'),
            'strNguoiDung_Id': edu.system.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtDaCongNhan_ChiTiet"] = data.Data;
                    me.genTable_DaCongNhan(data.Data);
                }
                else {
                    edu.system.alert( data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTable_DaCongNhan: function (data, iPager) {
        var me = this;
        //$("#tblDaCongNhan thead").html(me.strHeadDat);
        //for (var j = 0; j < me.dtDat_ChiTiet.rsCot.length; j++) {
        //    $("#tblDaCongNhan thead tr:eq(0)").append('<th class="td-center">' + me.dtDat_ChiTiet.rsCot[j].TEN + '</th>');
        //}
        //$("#tblDaCongNhan thead tr:eq(0)").append('<th class="td-center"></th>');
        var jsonForm = {
            strTable_Id: "tblDaCongNhan",

            //bPaginate: {
            //    strFuntionName: "main_doc.ThucHienXet.getList_DaCongNhan()",
            //    iDataRow: iPager,
            //    bFilter: true
            //},
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var maso = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO);
                        return '<span class="mssv-cell" style="display:inline-flex;align-items:center;gap:4px;">'
                            + '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '" data-mssv="' + maso + '"><u>' + maso + '</u></div>'
                            + '<a class="btn btn-default btnCopyMSSV" data-mssv="' + maso + '" title="Copy mã số" style="padding:4px 7px;line-height:1;min-height:auto;background:transparent;border:1px solid #cbd5e1;color:#475569;cursor:pointer;"><i class="far fa-copy"></i></a>'
                            + '</span>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_THAYDOI_TEN"
                }
            ]
        };
        //for (var j = 0; j < me.dtDat_ChiTiet.rsCot.length; j++) {
        //    jsonForm.aoColumns.push(
        //        {
        //            "mRender": function (nRow, aData) {
        //                var iThuTu = edu.system.icolumn++;
        //                return '<span id="zone_' + aData.ID + '_' + main_doc.ThucHienXet.dtDat_ChiTiet.rsCot[iThuTu].ID + '" ></span>';
        //            }
        //        }
        //    );
        //}
        //jsonForm.aoColumns.push(
        //    {
        //        "mRender": function (nRow, aData) {
        //            return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
        //        }
        //    }
        //);
        edu.system.loadToTable_data(jsonForm);
        //for (var i = 0; i < me.dtDat_ChiTiet.rsDuLieu.length; i++) {
        //    var aData = me.dtDat_ChiTiet.rsDuLieu[i];
        //    $("#zone_" + aData.TN_KETQUA_ID + "_" + aData.ID).html(edu.util.returnEmpty(aData.GIATRI));
        //}
        /*III. Callback*/
    },
}