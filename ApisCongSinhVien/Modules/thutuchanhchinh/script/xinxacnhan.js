/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function GiayTo() { }
GiayTo.prototype = {
    strNguoiHoc_Id: '',
    strHoatDong_Id: '',
    dtChoXacNhan: [],
    dtDaXuLy: [],
    dtGiayTo: [],
    dtTuNhapHoSo: [],
    strGiayTo_Id: '',
    strMotCua_NguoiHoc_YeuCau_Id: '',
    dtDanhGia: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#btnBatDau").click(function () {
            $("#zonebatdau").slideUp(500);
            $("#zonecacloai").slideDown(500);
        });
       
        me.strNguoiHoc_Id = edu.system.userId;
        me.getList_PhanLoai();
        me.getList_DM_HoatDong();
        me.getList_GiayTo();
        me.getList_ChoXacNhan();
        //me.getList_DM_HoatDong();
        //me.getList_ChoXacNhan();
        //me.getList_GiayTo();
        //edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.DIEMMOCKIEMTRA", "dropSearch_MocKiemTra,dropTinhTrang");
        edu.system.loadToCombo_DanhMucDuLieu("MOTCUA_DANHGIA_CHATLUONG", "", "", function (data) {
            me.dtDanhGia = data;
        });

        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#chkSelectAll_ChoXacNhan").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChoXacNhan" });
        });
        $("#chkSelectAll_ConLai").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblGiayTo" });
        });

        $("#zoneTab").delegate('.tabhoatdong', 'click', function (e) {
            var strId = this.id;
            me.strHoatDong_Id = strId;
            me.getList_TinhTrang(strId);
        });
        $("#tblChoXacNhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_ChoXacNhan(strId);
                $("#zoneTuNhapNhap").show();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tabtinhtrang").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            $("#modalGiayTo").modal("show");   
            if (edu.util.checkValue(strId)) { 
                $("#zoneTuNhapNhap").hide();
                $("#zoneketqua").show();
                me.viewForm_DaXuLy(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $(".btnSave_DanhMucChung").click(function () {
            //for (var i = 0; i < me.dtGiayTo.length; i++) {
            //    me.save_GiayTo(me.dtGiayTo[i].ID);
            //}
            me.save_GiayTo(me.strGiayTo_Id);
            
        });
        $("#btnDeleteChoXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChoXacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChoXacNhan(arrChecked_Id[i]);
                }
            });
        });
        $("#tblGiayTo").delegate('.checkgiayto', 'change', function (e) {
            var strId = this.id.replace('checkX', '');
            me.strGiayTo_Id = strId;
            if (this.checked) {
                //me.save_TaoFile(strFile);
                me.getList_TuNhapHoSo();
            }
            //else {
            //    $("#tblTuNhapHoSo tr[class='" + strId + "']").html("");
            //}
        });

        $("#tabtinhtrang").delegate(".chonsao", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id;
            var strGiayTo = $(this).attr("name");
            var strDanhMuc = $(this).attr("title");
            iDanhGia = parseInt(strId);
            for (var i = 1; i <= iDanhGia; i++) {
                $("#zonechonsao" + strDanhMuc +" #" + i).removeClass("far fa-star").addClass("fas fa-star");
            }
            for (var i = iDanhGia + 1; i <= 5; i++) {
                $("#zonechonsao" + strDanhMuc +" #" + i ).removeClass("fas fa-star").addClass("far fa-star");
            }

            var obj = me.dtDanhGia.find(e => e.MA === strId);
            if (obj) {
                me.save_DanhGia(strGiayTo, obj.ID);
            }
            $("#rate" + strDanhMuc).html(edu.util.returnEmpty(strId) + " trên 5");
        });
        //$(".checkgiayto").change(function () {
        //    var strId = this.id.replace('checkX', '');
        //    console.log(strId+ "22222");
        //    if (this.checked) {
        //        me.getList_TuNhapHoSo(strId);
        //    } else {
        //        $("#tblTuNhapHoSo tr[class='" + strId +"']").html("");
        //    }
        //});
        //edu.system.uploadFiles(["txtFileDinhKem"]);
        $("#tabgiayto").delegate('.giayto', 'click', function (e) {
            me.strGiayTo_Id = this.id;
            $("#lblGiayTo").html($(this).attr("title"))
            me.getList_TuNhapHoSo();
            edu.util.viewValById("txtNhanXet", "");
            edu.util.viewHTMLById("txtNhanXet", "");
            $("#modalGiayTo").modal("show");
        });

        $("#zoneTab").delegate('.tab-item', 'click', function (e) {
            var tabId = $(this).attr("name");
            $(".swiper-slide-thumb-active").removeClass("swiper-slide-thumb-active");
            this.classList.add("swiper-slide-thumb-active");
            $("#swiperGiayTo .swiper-slide").slideUp();
            $("#" + tabId).slideDown();
        });
        $("#choxuly").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            $("#modalGiayTo").modal("show");
            $("#zoneTuNhapNhap").show();
            if (edu.util.checkValue(strId)) {
                me.viewForm_ChoXacNhan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#choxuly").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation();
            var strId = this.id;
            console.log(1111);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_ChoXacNhan(strId);
            });
        });

        $('#dropSearch_PhanLoai').on('select2:select', function (e) {
            me.getList_DM_HoatDong();
            me.getList_GiayTo();
            me.getList_ChoXacNhan();
        });
        $("#main-content-wrapper").delegate(".btnSendTinNhan", "click", function (e) {
            var strId = this.id;
            me.save_TinNhan(strId);
        });
        $("#main-content-wrapper").delegate(".txtSendTinNhan", "keydown", function (e) {
            console.log(e.which)
            if (e.which === 13) {
                e.preventDefault();

                var strId = this.id.replace(/txtSendTinNhan/g, '');
                me.save_TinNhan(strId);
            }
        });

        $("#main-content-wrapper").delegate(".btnDeleteTin", "click", function (e) {

            var strId = this.id;
            var strCha_Id = $(this).attr("name");
            me.delete_TinNhan(strId, strCha_Id);
        });
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_ChoXacNhan();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strMotCua_NguoiHoc_YeuCau_Id = "";
        edu.util.viewValById("txtYKien", "");
        edu.util.viewValById("txtNhanXet", "");
        edu.util.viewHTMLById("txtNhanXet", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_GiayTo: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin_MH/FSkkLB4MLjUCNCAeDyY0LigJLiIeGCQ0AiA0',
            'func': 'pkg_hanhchinhmotcua_thongtin.Them_MotCua_NguoiHoc_YeuCau',
            'iM': edu.system.iM,
            'strId': me.strMotCua_NguoiHoc_YeuCau_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'dSoLuong': edu.util.getValById('txtSoLuong' + strId),
            'strMoTa': edu.util.getValById('txtGhiChu' + strId),
            'strNhanXet': edu.util.getValById('txtNhanXet'),
            'strDanhGiaChatLuong_Id': edu.util.getValById('dropAAAA'),
            'strSoDienThoaiNguoiNhan': edu.util.getValById('txtDienThoai'),
            'strDiaChiNguoiNhan': edu.util.getValById('txtDiaChi'),
            'strEmailNguoiNhan': edu.util.getValById('txtEmail'),
            'strMotCua_DanhMuc_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_MotCua_ThongTin_MH/EjQgHgwuNQI0IB4PJjQuKAkuIh4YJDQCIDQP';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#modalGiayTo").modal("hide");
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alert("Thêm mới thành công!");
                        me.strMotCua_NguoiHoc_YeuCau_Id = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                    var x = $("#tblTuNhapHoSo .form-add-info");
                    if (x.length) {
                        edu.system.alert('<div id="zoneprocessXXXX"></div>');
                        edu.system.genHTML_Progress("zoneprocessXXXX", x.length);
                        for (var i = 0; i < x.length; i++) {
                            me.save_TuNhapHoSo(x[i].id);
                        }
                    }
                    me.getList_ChoXacNhan();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    me.getList_GiayTo();
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GiayTo: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin_MH/DSA4BRIMLjUCNCAeBSAvKQw0IgPP',
            'func': 'pkg_hanhchinhmotcua_thongtin.LayDSMotCua_DanhMuc',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGiayTo = dtReRult;
                    me.genTable_GiayTo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert( JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_GiayTo: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin_MH/GS4gHgwuNQI0IB4FIC8pDDQi',
            'func': 'pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_DanhMuc',
            'iM': edu.system.iM,
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_GiayTo();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChoXacNhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin_MH/DSA4BRIYJDQCIDQCKTQgGTQNOAPP',
            'func': 'pkg_hanhchinhmotcua_thongtin.LayDSYeuCauChuaXuLy',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChoXacNhan = dtReRult;
                    me.genTable_ChoXacNhan(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert( JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_TinhTrang: function (strTinhTrangXuLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin_MH/DSA4BRIYJDQCIDQVKSQuFSgvKRUzIC8mGTQNOAPP',
            'func': 'pkg_hanhchinhmotcua_thongtin.LayDSYeuCauTheoTinhTrangXuLy',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strTinhTrangXuLy_Id': strTinhTrangXuLy_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDaXuLy = dtReRult;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTable_TinhTrang(dtReRult, strTinhTrangXuLy_Id);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert( " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TinhTrang: function (data, strTinhTrangXuLy_Id) {
        var me = this;
        //$("#lblGiayTo_Tong").html(iPager);
        var html = '';
        $("#span" + strTinhTrangXuLy_Id).html(data.length);
        data.forEach((aData, nRow) => {
            var arrMau = ["#26465e", "#7aacf3", "#d36f51", "#0232b9", "#a12529", "#71b636", "#f94341", "#f6c531"];
            html += '<div class="dashboad-item" >';
            html += '<div class="dashboad-item-box " style="cursor: pointer;" href="javascript:void(0)" id="' + aData.ID + '">';
            html += '<div class="letters-item-title is-loan justify-content-between" style="background: ' + arrMau[nRow % 8] + '">';
            html += '<div class="title-loan" title="' + aData.MOTCUA_DANHMUC_TEN + '">' + aData.MOTCUA_DANHMUC_TEN + '</div>';
            //html += '<div class="edit-delete">';
            //html += '<a href="#" title="Xóa thông tin" class="btnDelete"  id="' + aData.ID + '"><i class="fal fa-trash"></i></a>';
            //html += '</div>';
            html += '</div>';
            if (aData.SOTIEN) {
                html += '<div class="letters-item-content" style="padding-top: 15px"><i class="fal fa-sack-dollar"></i>';
                html += '<span>Số tiền:</span> ' + edu.util.formatCurrency(aData.SOTIEN) + ' vnđ';
                html += '</div>';
            }
            html += '<div class="letters-item-content">';
            html += '<i class="fal fa-calendar-alt"></i>';
            html += '<span>Thời gian:</span> ' + edu.util.returnEmpty(aData.NGAYXULY_DD_MM_YYYY_HHMMSS);
            html += '</div>';
            
            html += '<div class="letters-item-content d-flex short-desc">';
            html += '<i class="fal fa-edit" style="margin-top: 3px"></i>';
            html += '<div class="content-short-desc">';
            html += '<span>Mô tả:</span> ' + edu.util.returnEmpty(aData.NHANXET);
            html += '</div>';
            html += '</div>';
            html += '<div class="n-post-comment n-post-commnet-st2"  id="tblTinNhan' + aData.ID + '">';
            html += '</div>';
            html += '<div id="zonechonsao' + aData.ID + '" class="rate">';
            html += chonsao(nRow, aData);
            html += '<span id="rate' + aData.ID + '"></span>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
        });
        $("#tabtinhtrang .dashboad").html(html);
        data.forEach(e => {
            $("#rate" + e.ID).html(edu.util.returnEmpty(e.DANHGIACHATLUONG_MA) + " trên 5");
            me.getList_TinNhan(e.ID);
        });

        function chonsao(nRow, aData) {
            var iDanhGia = aData.DANHGIACHATLUONG_MA;
            if (iDanhGia) iDanhGia = parseInt(iDanhGia);
            else {
                iDanhGia = 0;
            }
            var strKetQua = "";
            for (var i = 1; i <= iDanhGia; i++) {
                strKetQua += '<i class="fas fa-star chonsao" id="' + i + '" title="' + aData.ID + '" name="' + aData.MOTCUA_NGUOIHOC_YEUCAU_ID + '" style="color: orange"></i>';
            }
            for (var i = iDanhGia + 1; i <= 5; i++) {
                strKetQua += '<i class="far fa-star chonsao" id="' + i + '" title="' + aData.ID + '" name="' + aData.MOTCUA_NGUOIHOC_YEUCAU_ID + '" style="color: orange"></i>';
            }
            return strKetQua;
        }
        /*III. Callback*/
    },
    genTable_ChoXacNhan: function (data, iPager) {
        var me = this;
        var html = '';
        console.log($("#lblTongChoXacNhan2"))
        console.log(data.length)
        setTimeout(function () {

            $("#lblTongChoXacNhan2").html(data.length);
        }, 1000)
        data.forEach((aData, nRow) => {
            var arrMau = ["#26465e", "#7aacf3", "#d36f51", "#0232b9", "#a12529", "#71b636", "#f94341", "#f6c531"];
            html += '<div class="dashboad-item">';
            html += '<div class="dashboad-item-box ">';
            html += '<div class="letters-item-title is-loan justify-content-between btnEdit" style="cursor: pointer;" href="javascript:void(0)" id="' + aData.ID +'" style="background: ' + arrMau[nRow % 8] +'">';
            html += '<div class="title-loan" title="' + aData.MOTCUA_DANHMUC_TEN + '">' + aData.MOTCUA_DANHMUC_TEN + '</div>';
            html += '<div class="edit-delete">';
            html += '<a href="#" title="Xóa thông tin" class="btnDelete"  id="' + aData.ID +'"><i class="fal fa-trash"></i></a>';
            html += '</div>';
            html += '</div>';
            if (aData.SOTIEN) {
                html += '<div class="letters-item-content" style="padding-top: 15px"><i class="fal fa-sack-dollar"></i>';
                html += '<span>Số tiền:</span> ' + edu.util.formatCurrency(aData.SOTIEN) + ' vnđ';
                html += '</div>';
            }
            html += '<div class="letters-item-content">';
            html += '<i class="fal fa-calendar-alt"></i>';
            html += '<span>Thời gian:</span> ' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY);
            html += '</div>';
            html += '<div class="letters-item-content d-flex short-desc">';
            html += '<i class="fal fa-edit" style="margin-top: 3px"></i>';
            html += '<div class="content-short-desc">';
            html += '<span>Mô tả:</span> ' + edu.util.returnEmpty(aData.NHANXET);
            html += '</div>';
            html += '</div>';

            html += '<div class="n-post-comment n-post-commnet-st2"  id="tblTinNhan' + aData.ID + '">';
            html += '</div>';

            html += '</div>';
            html += '</div>';
        });
        $("#choxuly .dashboad").html(html);
        data.forEach(e => {
            me.getList_TinNhan(e.ID);
        });
    },
    genTable_GiayTo: function (data, iPager) {
        var html = '';
        data.forEach((aData, nRow) => {
            var arrMau = ["#26465e", "#7aacf3", "#d36f51", "#0232b9", "#a12529", "#71b636", "#f94341", "#f6c531"];
            html += '<div class="dashboad-item giayto btnAdd" id="' + aData.ID + '" title="' + aData.TEN + '">';
            html += '<a href="#" class="dashboad-item-box" style="border-color:' + arrMau[nRow % 8] + '">';
            html += '<div class="image">';
            html += '<img src="' + edu.util.returnEmpty(aData.MOTCUA_DANHMUC_TENANH ) + '" alt="' + aData.MA + '">';
            html += '</div>';
            html += '<div class="dashboad-title ">';
            html += aData.TEN;
            html += '</div>';
            html += '</a>';
            html += '</div>';
        });
        html += '<p class="dashboad-attention">Các bạn chọn các dịch vụ của hệ thống 1 cửa sinh viên</p>';
        $("#tabgiayto").html(html);
    },
    viewForm_ChoXacNhan: function (strId) {
        var me = this;
        //call popup --Edit
        try {
            var data = edu.util.objGetDataInData(strId, me.dtChoXacNhan, "ID")[0];
            //view data --Edit
            edu.util.viewValById("txtDienThoai", data.SODIENTHOAINGUOINHAN);
            edu.util.viewValById("txtEmail", data.EMAILNGUOINHAN);
            edu.util.viewValById("txtDiaChi", data.DIACHINGUOINHAN);
            edu.util.viewValById("txtYKien", data.NHANXET);
            edu.util.viewValById("txtNhanXet", data.NHANXET);
            edu.util.viewHTMLById("txtNhanXet", data.NHANXET);
            me.strMotCua_NguoiHoc_YeuCau_Id = data.ID;
            me.strGiayTo_Id = data.MOTCUA_DANHMUC_ID;
            $("#lblGiayTo").html(data.MOTCUA_DANHMUC_TEN);
        } catch{

        }
        me.getList_TuNhapHoSo();
    },
    viewForm_DaXuLy: function (strId) {
        var me = this;
        //call popup --Edit
        try {
            var data = edu.util.objGetDataInData(strId, me.dtDaXuLy, "ID")[0];
            //view data --Edit
            edu.util.viewValById("txtDienThoai", data.SODIENTHOAINGUOINHAN);
            edu.util.viewValById("txtEmail", data.EMAILNGUOINHAN);
            edu.util.viewValById("txtDiaChi", data.DIACHINGUOINHAN);
            edu.util.viewValById("txtYKien", data.NHANXET);
            edu.util.viewValById("txtNhanXet", data.NHANXET);
            edu.util.viewHTMLById("txtNhanXet", data.NHANXET);
            me.strMotCua_NguoiHoc_YeuCau_Id = data.ID;
            me.strGiayTo_Id = data.MOTCUA_DANHMUC_ID;
            $("#lblGiayTo").html(data.MOTCUA_DANHMUC_TEN);
        } catch{

        }
        me.getList_TuNhapHoSo();
    },

    getList_DM_HoatDong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRIVKC8pFTMgLyYZNA04',
            'func': 'pkg_dvmc_chung.LayDSTinhTrangXuLy',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtDMHoatDong = dtReRult;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTab_DM_HoatDong(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_DM_HoatDong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropHoatDong"],
            type: "",
            title: "Chọn hoạt động"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTab_DM_HoatDong: function (data) {
        var me = this;
        var html = '';
        html += '<div class="tab-item swiper-slide item-setting swiper-slide-thumb-active" name="newxacnhan">';
        html += '<a href="#">';
        html += '<i class="fal fa-cogs"></i>';
        html += '<p>Các<br> Dịch vụ</p>';
        html += '</a>';
        html += '</div>';
        html += '<div class="tab-item swiper-slide" name="choxuly">';
        html += '<a href="#">';
        html += '<i class="fal fa-alarm-clock"></i><span id="lblTongChoXacNhan2"></span>';
        html += '<p>Thông tin đã gửi</p>';
        html += '</a>';
        html += '</div>';
        data.forEach((aData, nRow) => {
            html += '<div class="tab-item swiper-slide tabhoatdong" id="' + aData.ID + '" name="tabtinhtrang">';
            html += '<a href="#">';
            var strClass = aData.TENANH;
            if (!strClass) strClass = 'fal fa-cogs';
            html += '<i class="' + strClass + '"></i><span id="span' + aData.ID + '">?</span>';
            html += '<p>' + aData.TEN + '</p>';
            html += '</a>';
            html += '</div>';
        });
        $("#zoneTab").html(html);
        data.forEach(e => me.getList_TinhTrang(e.ID));
        //var swiper = new Swiper(".service-slider", {
        //    spaceBetween: 0,
        //    slidesPerView: "auto",
        //    freeMode: false,
        //    watchSlidesProgress: false,
        //    // simulateTouch: false
        //});
    },
    delete_ChoXacNhan: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_ThongTin_MH/GS4gHgwuNQI0IB4PJjQuKAkuIh4YJDQCIDQP',
            'func': 'pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_NguoiHoc_YeuCau',
            'iM': edu.system.iM,

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_ChoXacNhan();
            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChoXacNhan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TuNhapHoSo: function (strId) {
        var me = this;

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin_MH/FSkkLB4MLjUCNCAeBSAvKQw0Ih4FNA0oJDQP',
            'func': 'pkg_hanhchinhmotcua_thongtin.Them_MotCua_DanhMuc_DuLieu',
            'iM': edu.system.iM,
            'type': 'POST',
            'strId': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strTruongThongTin_Id': strId.substring(0,32),
            'strTruongThongTin_GiaTri': $("#m" + strId).val(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strMotCua_DanhMuc_Id': strId.substr(32),
            'strMotCua_NguoiHoc_YeuCau_Id': me.strMotCua_NguoiHoc_YeuCau_Id,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'SV_MotCua_ThongTin_MH/EjQgHgwuNQI0IB4FIC8pDDQiHgU0DSgkNAPP';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TuNhapHoSo();
                    //me.getList_ChoXacNhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TuNhapHoSo: function () {
        var me = this;
        var strMotCua_DanhMuc_Id = me.strGiayTo_Id;
        var objGiayTo = me.dtGiayTo.find(e => e.ID === strMotCua_DanhMuc_Id);
        if (objGiayTo && objGiayTo.HIENTHICHONHAPNHANXET == 1) $("#tblNhanXet").show(); else $("#tblNhanXet").hide();
        //--Edit
        var obj_save = {
            'action': 'SV_HCMC_Chung_MH/DSA4BRIFIC8pDDQiDC4TLi8m',
            'func': 'pkg_hanhchinhmotcua_chung.LayDSDanhMucMoRong',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strMotCua_DanhMuc_Id': strMotCua_DanhMuc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDuongDanFile': objGiayTo.DUONGDANFILE,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTuNhapHoSo = dtReRult;
                    me.genTable_TuNhapHoSo(dtReRult, data.Pager, strMotCua_DanhMuc_Id);
                    if (data.Id) {
                        $("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Id + '" width="600px" height="600px"></iframe>');
                    }
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_TuNhapHoSo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc_DuLieu/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TuNhapHoSo();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TuNhapHoSo: function (data, iPager, strMotCua_DanhMuc_Id) {
        var me = this;
        $("#tblTuNhapHoSo").html("");
        var html = '';
        data.forEach(aData => {
            html += '<div class="form-item d-flex mb-15 form-add-info ' + strMotCua_DanhMuc_Id + '" id="' + aData.ID + strMotCua_DanhMuc_Id +'">';
            html += '<label class="form-label">' + edu.util.returnEmpty(aData.TEN) + '</label>';
            html += '<div class="input-group">';
            html += aData.TENANH ? '<i class="' + aData.TENANH + ' color-dask-blue"></i>' : '';
            html += '<input class="form-control" id="m' + aData.ID + strMotCua_DanhMuc_Id + '" value="' + edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI) + '">';
            html += '</div>';
            html += '</div>';
        });
        $("#tblTuNhapHoSo").html(html);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TaoFile: function (strMota) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_File/TaoFile',
            'type': 'POST',
            'strMota': strMota,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Message + '" width="800px" height="600px"></iframe>');
                    //edu.system.alert("Cập nhật thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_TuNhapHoSo();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DanhGia: function (strId, strDanhGiaChatLuong_Id) {
        var me = this;

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_HCMC_ThongTin_MH/BSAvKQYoIB4MLjUCNCAeDyY0LigJLiIeGCQ0AiA0',
            'func': 'pkg_hanhchinhmotcua_thongtin.DanhGia_MotCua_NguoiHoc_YeuCau',
            'iM': edu.system.iM,
            'strId': strId,
            'strDanhGiaChatLuong_Id': strDanhGiaChatLuong_Id,
            'strNhanXet': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_TuNhapHoSo();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_PhanLoai: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HCMC_Chung_MH/DSA4BRIMLjUCNCAeBSAvKQw0Ih4RKSAvDS4gKAPP',
            'func': 'pkg_hanhchinhmotcua_chung.LayDSMotCua_DanhMuc_PhanLoai',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtDMHoatDong = dtReRult;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTab_PhanLoai(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTab_PhanLoai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                //selectFirst: true,
            },
            renderPlace: ["dropSearch_PhanLoai"],
            type: "",
            title: "Chọn phân loại"
        };
        edu.system.loadToCombo_data(obj);

    },


    getList_TinNhan: function (strMotCua_NH_YC_XuLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_HCMC_ThongTin_MH/DSA4BRIMLjUCNCAeDwkeGAIeGQ0eESkgLwkuKAPP',
            'func': 'pkg_hanhchinhmotcua_thongtin.LayDSMotCua_NH_YC_XL_PhanHoi',
            'iM': edu.system.iM,
            'strMotCua_NH_YC_XuLy_Id': strMotCua_NH_YC_XuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTab_TinNhan(dtReRult, strMotCua_NH_YC_XuLy_Id);
                }
                else {
                    edu.system.alert( " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTab_TinNhan: function (data, strMotCua_NH_YC_XuLy_Id) {
        var html = '';
        var strFirstUser = "";
        if (data.length) {
            strFirstUser = data[0].NGUOITAO_ID;
        }
        data.forEach(aData => {
            var strClass = aData.NGUOITAO_ID == strFirstUser ? "sv-comment" : "gv-comment";
            html += '<div class="item ' + strClass +'">';
            html += '<div class="info">';
            html += '<div class="avatar">';
            html += '<img src="' + edu.system.getRootPathImg(aData.ANHDAIDIEN) + '" alt="">';
            html += '</div>';
            html += '<div class="meta">';
            html += '<div class="name">' + edu.util.returnEmpty(aData.NGUOITAO_TAIKHOAN) + '</div>';
            html += '<div class="position">' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</div>';
            html += '</div>';
            html += '<div class="action">';
            html += '<button class="btn-sm btn btnDeleteTin" id="' + aData.ID + '" name="' + strMotCua_NH_YC_XuLy_Id +'" title="Xóa"><i class="fal fa-trash-alt color-red"></i></button>';
            html += '</div>';
            html += '</div>';
            html += '<div class="comment-content">';
            html += '<p>';
            html += edu.util.returnEmpty(aData.NOIDUNG);
            html += '</p>';
            html += '<div class="date-time">';
            html += '<i class="fal fa-calendar-alt"></i>';
            html += '<span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '</span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        })
        html += '<div class="chat-form">';
        html += '<input type="text" class="txtSendTinNhan" id="txtSendTinNhan' + strMotCua_NH_YC_XuLy_Id + '" placeholder="Nhập thông tin">';
        html += '<button class="btnSendTinNhan" id="' + strMotCua_NH_YC_XuLy_Id + '"><i class="fas fa-paper-plane color-dask-blue"></i></button>';
        html += '</div>';
        console.log(html)
        $("#tblTinNhan" + strMotCua_NH_YC_XuLy_Id).html(html);
    },
    save_TinNhan: function (strId) {
        var me = this;

        var strTinNhan = $("#txtSendTinNhan" + strId).val();
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_HCMC_ThongTin_MH/FSkkLB4MLjUCNCAeDwkeGAIeGQ0eESkgLwkuKAPP',
            'func': 'pkg_hanhchinhmotcua_thongtin.Them_MotCua_NH_YC_XL_PhanHoi',
            'iM': edu.system.iM,
            'strMotCua_NH_YC_XuLy_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNoiDung': strTinNhan,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //$("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Message + '" width="800px" height="600px"></iframe>');
                    //edu.system.alert("Cập nhật thành công");
                    me.getList_TinNhan(strId);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_TuNhapHoSo();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_TinNhan: function (strId, strPhanHoi_Id) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_HCMC_ThongTin_MH/GS4gHgwuNQI0IB4PCR4YAh4ZDR4RKSAvCS4o',
            'func': 'pkg_hanhchinhmotcua_thongtin.Xoa_MotCua_NH_YC_XL_PhanHoi',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_TinNhan(strPhanHoi_Id)
            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_GiayTo();
                //});
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}