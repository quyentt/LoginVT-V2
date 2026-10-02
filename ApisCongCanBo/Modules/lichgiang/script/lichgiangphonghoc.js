/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LichGiang() { };
LichGiang.prototype = {
    strThongTin_Id: '',
    dtThongTin: [],
    iNgayBatDau: 0,
    strGiangVien_Id: '',
    arrDay: [],
    dtLichHoc: [],
    strLichHoc_Id: '',
    dtKieuChuyenCan: [],
    dtSinhVien: [],
    strNgayBatDau: '',
    strNgayKetThuc: '',
    dtGiangVienThayDoi: [],
    strDoiLich_Id: '',
    strLoaiXacNhan: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system 
        -------------------------------------------*/
        me.strGiangVien_Id = edu.system.userId;
        //me.getList_ThongTin();
        var date = new Date();
        var nMonth = date.getMonth() + 1;
        var nYear = date.getFullYear();

        $("#nam").attr("title", nYear);
        $("#nam").html(nYear);

        $("#thang").attr("title", nMonth);
        $("#thang").html("Tháng " + nMonth);
        me.genHtml_Month(0);

        $(".days").delegate(".poiter", "click", function () {
            $(".days .active").removeClass("active");
            $("#datebody").html("");
            this.classList.add("active");
            var strNgayBatDau = $(this).attr('batdau');
            var strNgayKetThuc = $(this).attr('ketthuc');
            var strNgayDangChon = $(this).attr('title');
            me.strNgayBatDau = strNgayBatDau;
            me.strNgayKetThuc = strNgayKetThuc;
            me.getList_TuanHienTai(strNgayBatDau, strNgayKetThuc, strNgayDangChon);
            var strClass = $(this).attr('name');
            strClass = $("." + strClass);
            var html = '';
            html += '<div class="date">';
            html += '<i class="fal fa-clock day color-66"></i>';
            html += '<p class="m-0 text">GMT+7</p>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[0]).attr('title') + '</div>';
            html += '<div class="text">Mon</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[1]).attr('title') + '</div>';
            html += '<div class="text">Tue</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[2]).attr('title') + '</div>';
            html += '<div class="text">Wed</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[3]).attr('title') + '</div>';
            html += '<div class="text">Thu</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[4]).attr('title') + '</div>';
            html += '<div class="text">Fri</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[5]).attr('title') + '</div>';
            html += '<div class="text">Sat</div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="day-of-week">';
            html += '<div class="day">' + $(strClass[6]).attr('title') + '</div>';
            html += '<div class="text">Sun</div>';
            html += '</div>';
            html += '</div>';

            $("#date-header").html(html);
            me.arrDay = [];
            for (var i = 0; i < strClass.length; i++) {
                if (i > 6) break;
                me.arrDay.push($(strClass[i]).attr('title').replace(/\//g, ''));
            }
        });
        $(".month").delegate(".prev", "click", function () {
            me.genHtml_Month(-1);
        });
        $(".month").delegate(".next", "click", function () {
            me.genHtml_Month(1);
        });

        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });
        $("#tblThongTin").delegate(".btnXacNhan", "click", function () {
            var strId = this.id;
            edu.system.confirm("Bạn có đồng ý xác nhận thời điểm vào lớp không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(strId);
            });
        });

        $("#datebody").delegate(".btnLichHoc", "click", function () {
            var strId = this.id;
            me.strLichHoc_Id = strId;
            var objLich = me.dtLichHoc.find(e => e.ID === strId);
            if (!objLich || !objLich.TENLOPHOCPHAN) return;
            $("#my_calendar").modal("show");
            $("#lblLopHocPhan").html('<b>Lớp: ' + objLich.TENLOPHOCPHAN + '</b>');
            $("#lblHocPhan").html('<b>Học phần: ' + objLich.TENHOCPHAN + '</b> <span class="color-66">&ensp; - &ensp; Thời gian ' + me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(objLich.TIETBATDAU) + '-' + edu.util.returnEmpty(objLich.TIETKETTHUC) + ')</span><span class="color-66 fs-14"> (Phòng học: ' + objLich.TENPHONGHOC + ')</span>');
            me.getList_SinhVien(strId);
            me.getDetail_SiSo(strId);
        });
        $("#datebody").delegate(".btnKhoiTaoDoiLich", "click", function (event) {
            event.stopImmediatePropagation();
            var strId = this.id;
            me.strLichHoc_Id = strId;
            $("#modalDoiLich").modal("show");
            var objLich = me.dtLichHoc.find(e => e.ID === strId);
            //$("#lblLopHocPhan").html('<b>Lớp: ' + objLich.TENLOPHOCPHAN + '</b> <span class="color-66 fs-14"> (Phòng học: ' + objLich.TENPHONGHOC + ')</span>');
            //$("#lblHocPhan").html('<b>Học phần: ' + objLich.TENHOCPHAN + '</b> <span class="color-66">&ensp; - &ensp; ' + me.returnTwo(objLich.GIOBATDAU) + ':' + me.returnTwo(objLich.PHUTBATDAU) + ' - ' + me.returnTwo(objLich.GIOKETTHUC) + ':' + me.returnTwo(objLich.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(objLich.TIETBATDAU) + '-' + edu.util.returnEmpty(objLich.TIETKETTHUC) + ')</span>');
            me.getList_KhoiTaoDoiLich(objLich);
        });
        $("#datebody").delegate('.task-1', 'mouseenter', function (e) {
            e.stopImmediatePropagation();
            var point = this;
            //console.log(point.clientHeight)
            //console.log(point.scrollHeight)
            let element = $(point).find(".task-description")[0];
            //console.log($(point).find(".task-description")[0].clientHeight)
            //console.log($(point).find(".task-description")[0].scrollHeight)
            if (element.scrollHeight <= element.clientHeight) return;
            var row = $(point).parent().html().replace('class="task-header"', '');
            row = row.substring(0, row.indexOf('<div class="eval"'))
            $(point).popover({
                container: 'body',
                content: row,
                trigger: 'hover',
                html: true,
                placement: 'right',
            });
            $(point).popover('show');
            //me.popover_HSDoiTuong(id, point);
        });

        $("#btnGuiYeuCau").click(function () {
            me.save_DoiLich();
        });
        $("#btnKiemTraTrungLich").click(function () {
            me.save_KiemTraTrungLich();
        });

        edu.system.loadToCombo_DanhMucDuLieu("QLSV.KIEUCHUYENCAN", "", "", data => {
            me.dtKieuChuyenCan = data;
            var row = '';
            data.forEach(e => {
                row += '<th class="td-center" style="width: 94px">' + e.TEN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + e.ID + '" style="margin-left: -39px" /></th>';
            });

            $("#tblNhapChuyenCan thead tr:eq(0)").append(row);
        });
        edu.system.loadToCombo_DanhMucDuLieu("TKB.LICHGIANG.XACNHANDOILICH", "dropPhetDuyet_TrangThai");
        $("#tblNhapChuyenCan").delegate(".chkSelectAll", "click", function (e) {

            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".checkNgay" + strClass).each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });

        $("#tblNhapChuyenCan").delegate(".checkChuyenCan", "click", function (e) {
            var point = this;
            var checked_status = this.checked;
            if (checked_status) {
                var strid = this.id;
                var arrId = strid.split("_");
                var strSV_Id = arrId[0].substring(9);
                $(".checkSV" + strSV_Id).each(function () {
                    if (point.id == this.id) return;
                    $(this).attr('checked', false);
                    $(this).prop('checked', false);
                });
            }
        });
        $("#tblNhapChuyenCan").delegate(".inputChuyenCan", "blur", function (e) {
            var point = this;
            var strid = this.id;
            var strSV_Id = strid.substring(6);
            var ele = $("#chkSelect" + strSV_Id);
            var checked_status = false;
            if (point.val() != "") {
                checked_status = true;
            }
            $(ele).attr('checked', checked_status);
            $(ele).prop('checked', checked_status);
        });
        $("#tblNhapChuyenCan").delegate(".btnView_HocTap", "click", function (e) {
            var point = this;
            $("#modalHTSinhVien").modal('show');
            me["strSinhVien_Id"] = this.id;
            edu.system.loadPage($("#zoneHTSinhVien"), '/modules/hoctap/html/diemhoc.html', null, null, 'ApisCongSinhVien');
        });

        $("#btnSaveTuKhoa").click(function () {
            me.save_TuGhiNhan();
        });

        $("#btnDiemDanh").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblNhapChuyenCan .checkChuyenCan");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    } else {
                        var inputcheck = $("#" + x[i].id.replace("chkSelect", "input_"));
                        if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    }
                }
                else {
                    if ($(x[i]).attr("name") != undefined) {
                        arrXoa.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                //edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " và hủy " + arrXoa.length + "?");
                //$("#btnYes").click(function (e) {

                //});
                console.log((arrThem.length + arrXoa.length));
                edu.system.alert('<div id="divprogessdata"></div>');
                edu.system.genHTML_Progress("divprogessdata", (arrThem.length + arrXoa.length));
                for (var i = 0; i < arrXoa.length; i++) {
                    me.delete_NhapChuyenCan(arrXoa[i]);
                }
                setTimeout(function () {
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_NhapChuyenCan(arrThem[i]);
                    }
                }, 400);


            }
            else {
                //edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnDiemDanhTuDong").click(function () {
            me.save_DiemDanhTuDong();
        });
        $("#btnDeleteDoiLich").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_DoiLich(me.strDoiLich_Id);
            });
        });
        $("#btnPheDuyet").click(function () {
            $("#modalPheDuyet").modal("show");
            //edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            //$("#btnYes").click(function (e) {
            //    me.save_PhetDuyet(me.strDoiLich_Id);
            //});
        });
        $("#btnLuuPheDuyet").click(function () {
            edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            $("#btnYes").click(function (e) {
                me.save_PhetDuyet(me.strDoiLich_Id);
            });
        });

        edu.system.getList_MauImport("zonebtnBaoCao_LichGiang", function (addKeyValue) {
            var obj_list = {
                'strNhanSu_HoSoCanBo_Id': main_doc.LichGiang.strGiangVien_Id,
                'strNgayBatDau': main_doc.LichGiang.strNgayBatDau,
                'strNgayKetThuc': main_doc.LichGiang.strNgayKetThuc,
                'strHocKy_Id': edu.util.getValById("dropSearch_HocKy"),
            };
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
        });

        me.getList_DoiLich();
        $("#tblDoiLich").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            me.strDoiLich_Id = strId;
            me.getDetail_DoiLich(strId);
        });

        $("#btnSearch_PhongHoc").click(function () {
            //me.getList_TimCanBo();
            $(".days .active").trigger("click");
        });
        $("#txtTuKhoa_CanBo").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TimCanBo();
            }
        });

        $("#btnCongBo").click(function () {
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Công bố");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMDANH";
            var strLopHocPhan_Id = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id).IDLOPHOCPHAN;

            me.getList_XacNhanSanPham(strLopHocPhan_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
            me.getList_XacNhan(strLopHocPhan_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMDANH');
        });

        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var strLopHocPhan_Id = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id).IDLOPHOCPHAN;
            me.save_XacNhanSanPham(strLopHocPhan_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
        });

        $('#dropSearch_LoaiSapXep').on('select2:select', function () {
            me.getList_SinhVien();
        });
        me.getList_HocKy();
        me.getList_PhongHoc();

        $('#dropSearch_PhongHoc').on('select2:select', function () {
            $(".days .active").trigger("click");
        });

        $("#btnShow_DangKySDPhong").click(function () {
            me.openForm_DangKySDPhong();
        });
        $("#btnDangKy_GuiYeuCau").click(function () {
            me.save_DangKySDPhong();
        });
        $("#btnDangKy_KiemTraTrungLich").click(function () {
            me.save_KiemTraTrungLich_DangKy();
        });

        $("#modalDuyetDangKy").on("show.bs.modal", function () {
            me.openForm_DuyetDangKy();
        });
        $("#modalDuyetDangKy").on("shown.bs.modal", function () {
            $(document).off("focusin.modal");
        });
        $(document).on("select2:open", function (e) {
            var $modal = $(e.target).closest(".modal");
            if ($modal.length) {
                setTimeout(function () {
                    var input = document.querySelector(".select2-container--open .select2-search__field");
                    if (input) input.focus();
                }, 0);
            }
        });
        $(".duyet-month").delegate(".prev", "click", function () {
            me.genHtml_Month_Duyet(-1);
        });
        $(".duyet-month").delegate(".next", "click", function () {
            me.genHtml_Month_Duyet(1);
        });
        $(".duyet-days").delegate(".poiter", "click", function () {
            $(".duyet-days .active").removeClass("active");
            this.classList.add("active");
            var strNgay = $(this).attr("title");
            $("#lblDuyet_NgayDaChon").html("Ngày: " + strNgay);
            me.strDuyet_NgayDangChon = strNgay;
            me.getList_DangKyTheoNgay(strNgay);
        });
        $("#dropDuyet_PhongHoc").on("select2:select change", function () {
            me.markDays_HasData_Duyet();
            if (me.strDuyet_NgayDangChon) {
                me.getList_DangKyTheoNgay(me.strDuyet_NgayDangChon);
            }
        });
        $("#btnDuyetDangKy").click(function () {
            var arr = [];
            $("#tblDuyetDangKy tbody .chkRow_DuyetDangKy:checked").each(function () {
                var id = $(this).attr("data-id");
                if (id) arr.push(id);
            });
            if (arr.length == 0) {
                edu.system.alert("Vui lòng chọn ít nhất 1 dòng để duyệt", "w");
                return;
            }
            me.arrSanPham_DuyetDangKy_Ids = arr;
            me.strSanPham_DuyetDangKy_Id = arr[0];
            me.openForm_XacNhanDuyet(arr[0]);
        });
        $("#chkSelectAll_DuyetDangKy").click(function () {
            var checked = this.checked;
            $("#tblDuyetDangKy tbody .chkRow_DuyetDangKy").each(function () {
                $(this).prop("checked", checked);
            });
        });
        $("#zoneTrangThaiXacNhan").delegate(".btnTrangThaiXacNhan", "click", function () {
            var strTinhTrang_Id = this.id.replace("btnTT_", "");
            var arr = me.arrSanPham_DuyetDangKy_Ids || [me.strSanPham_DuyetDangKy_Id];
            me._duyetRemaining = arr.length;
            me._duyetOkCount = 0;
            me._duyetFailMsg = "";
            arr.forEach(function (id) {
                me.save_DuyetDangKy(id, strTinhTrang_Id);
            });
        });

        $("#modalKetQuaCaNhan").on("show.bs.modal", function () {
            me.getList_KetQuaCaNhan();
        });
    },
    openForm_DangKySDPhong: function () {
        var me = this;
        var strPhongHoc_Id = edu.util.getValById('dropSearch_PhongHoc');
        me.genCombo_DangKy_PhongHoc(strPhongHoc_Id);
        edu.util.viewValById("txtDangKy_Ngay", edu.util.dateToday());
        edu.util.viewValById("txtDangKy_GioBatDau", "");
        edu.util.viewValById("txtDangKy_PhutBatDau", "");
        edu.util.viewValById("txtDangKy_GioKetThuc", "");
        edu.util.viewValById("txtDangKy_PhutKetThuc", "");
        edu.util.viewValById("txtDangKy_MucDich", "");
    },
    genCombo_DangKy_PhongHoc: function (default_val) {
        var me = this;
        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP',
            'func': 'pkg_congthongtincanbo.LayDSPhongHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            default_val: default_val || "",
                        },
                        renderPlace: ["dropDangKy_PhongHoc"],
                        title: "Chọn phòng học"
                    };
                    edu.system.loadToCombo_data(obj);
                    if (default_val) {
                        var $sel = $("#dropDangKy_PhongHoc");
                        $sel.val(default_val);
                        if ($sel.data("select2")) {
                            $sel.trigger("change.select2");
                        } else {
                            $sel.trigger("change");
                        }
                    }
                } else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_DangKySDPhong: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUqHhEpLi8mHhUmHggvMgPP',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_Dk_Phong_Tg_Ins',
            'iM': edu.system.iM,
            'strTkb_Phong_Id': edu.util.getValById('dropDangKy_PhongHoc'),
            'strNgaySuDung': edu.util.getValById('txtDangKy_Ngay'),
            'strGioBatDau': edu.util.getValById('txtDangKy_GioBatDau'),
            'strPhutBatDau': edu.util.getValById('txtDangKy_PhutBatDau'),
            'strGioKetThuc': edu.util.getValById('txtDangKy_GioKetThuc'),
            'strPhutKetThuc': edu.util.getValById('txtDangKy_PhutKetThuc'),
            'strMucDichSuDung': edu.util.getValById('txtDangKy_MucDich'),
            'strNguonDuLieuTKB_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Gửi yêu cầu thành công (ID: " + data.Id + ")", "s");
                    $("#modalDangKySDPhong").modal("hide");
                } else {
                    edu.system.alert(data.Message || "Có lỗi xảy ra", "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_KiemTraTrungLich_DangKy: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUqHhEpLi8mHhUmHgIpJCIq',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_Dk_Phong_Tg_Check',
            'iM': edu.system.iM,
            'strTkb_Phong_Id': edu.util.getValById('dropDangKy_PhongHoc'),
            'strNgaySuDung': edu.util.getValById('txtDangKy_Ngay'),
            'strGioBatDau': edu.util.getValById('txtDangKy_GioBatDau'),
            'strPhutBatDau': edu.util.getValById('txtDangKy_PhutBatDau'),
            'strGioKetThuc': edu.util.getValById('txtDangKy_GioKetThuc'),
            'strPhutKetThuc': edu.util.getValById('txtDangKy_PhutKetThuc'),
            'strMucDichSuDung': edu.util.getValById('txtDangKy_MucDich'),
            'strNguonDuLieuTKB_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Dữ liệu kiểm tra hợp lệ");
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TuanHienTai: function (strNgayBatDau, strNgayKetThuc, strNgayDangChon) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4DSgiKREpLi8mCS4i',
            'func': 'pkg_congthongtincanbo.LayLichPhongHoc',
            'iM': edu.system.iM,
            'strIdPhongHoc': edu.system.getValById('dropSearch_PhongHoc'),
            'strNgayBatDau': strNgayBatDau,
            'strNgayKetThuc': strNgayKetThuc,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //if (dtReRult.length > 0) {
                    //    var aData = dtReRult[0];
                    //    $("#lblNgayHienTai").html("Thứ " + edu.util.returnEmpty(aData.THU) + ", ngày " + edu.util.returnEmpty(aData.NGAY));
                    //}
                    me.dtLichHoc = dtReRult;
                    me.genTable_ThongTin(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_SinhVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);

        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayDSDangKyHoc_2',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
            'strTieuChiSapXep': edu.util.getValById('dropSearch_LoaiSapXep'),
            'strReport_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtSinhVien = dtReRult;
                    me.genTable_SinhVien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        if (data.length > 0) {
            $("#txtTuKhoaDiemDanh").val(data[0].MATLENHGIANGVIEN);
        } else
            $("#txtTuKhoaDiemDanh").val("");


        var jsonForm = {
            strTable_Id: "tblNhapChuyenCan",

            aaData: data,
            colPos: {
                center: [0, 8, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "SOBUOIVANG"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_MASO",
                    "mRender": function (nRow, aData) {
                        return '<div class="btn btn-default min-w-auto btnView_HocTap" id="' + aData.QLSV_NGUOIHOC_ID + '"><u>' + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + '</u></div>';
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "IPDIEMDANHNGUOIHOC"
                },
                {
                    "mDataProp": "MATLENHNGUOIHOC",
                }
            ]
        };
        for (var i = 0; i < me.dtKieuChuyenCan.length; i++) {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<input type="checkbox" class="checkChuyenCan checkSV' + aData.QLSV_NGUOIHOC_ID + ' checkNgay' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '" id="chkSelect' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '"  />'
                        + '<input style="width: calc(100% - 40px); float: right" class="inputChuyenCan" id="input_' + aData.QLSV_NGUOIHOC_ID + '_' + main_doc.LichGiang.dtKieuChuyenCan[iThuTu].ID + '" />';
                }
            });
            jsonForm.colPos.center.push(jsonForm.aoColumns.length);
        }

        edu.system.loadToTable_data(jsonForm);
        //edu.system.genHTML_Progress("divprogessquanso", data.rs.length * data.rsNgay.length);
        me.getData_NhapChuyenCan();
    },
    getData_NhapChuyenCan: function (jsonSV, strNgay_ID, strNgay) {
        var me = this;
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        //--Edit
        var obj_list = {
            'action': 'CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan',
            'type': 'GET',
            'strKieuChuyenCan_Id': edu.util.getValById('dropAAAA'),
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    for (var i = 0; i < dtReRult.length; i++) {
                        if (dtReRult[i].GIATRI == 1) {
                            var check = $("#chkSelect" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            check.attr('checked', true);
                            check.prop('checked', true);
                            check.attr('name', dtReRult[i].GIATRI);
                            var inputCheck = $("#input_" + dtReRult[i].QLSV_NGUOIHOC_ID + "_" + dtReRult[i].KIEUCHUYENCAN_ID);
                            if (dtReRult[i].SOLUONG != 0) {
                                inputCheck.val(dtReRult[i].SOLUONG);
                                inputCheck.attr("name", dtReRult[i].SOLUONG);
                            }
                        }
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

                //edu.system.start_Progress("divprogessquanso", me.endGetData);
            },
            error: function (er) {

                //edu.system.alert(JSON.stringify(er), "w");
                //edu.system.start_Progress("divprogessquanso", me.endGetData);
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
        var me = this;
        var iGioMin = 24;
        var iGioMax = 0;
        $(".btnLichHoc").remove();
        data.forEach(e => {
            if (e.GIOBATDAU < iGioMin) iGioMin = e.GIOBATDAU;
            if (e.GIOKETTHUC > iGioMax) iGioMax = e.GIOKETTHUC;
        });
        var html = '<div class="date">';
        for (var i = iGioMin; i < iGioMax + 2; i++) {
            html += '<div class="hour-row">' + i + ':00</div>';
        }
        html += '</div>';
        for (var j = 0; j < me.arrDay.length; j++) {
            html += '<div class="day-of-week" id="row' + me.arrDay[j] + '">';
            for (var i = iGioMin; i < iGioMax + 2; i++) {
                html += '<div class="hour-row" id="h' + me.arrDay[j] + i + '"></div>';
            }
            html += '</div>';
        }
        $("#datebody").html(html);
        var arrMau = ["#223771", "#d49f3a", "#ec4c00", "#5a7adb", "#3c5398"];
        var arrLopHocPhanMau = [];
        data.forEach(e => {
            if (!arrLopHocPhanMau.find(ele => ele.ID == e.IDLOPHOCPHAN)) {
                arrLopHocPhanMau.push({
                    ID: e.IDLOPHOCPHAN,
                    MAU: arrMau[arrLopHocPhanMau.length % arrMau.length]
                })
            }
        });
        data.forEach((e, nRow) => {
            var strMauNen = "";
            try {
                strMauNen = arrLopHocPhanMau.find(ele => ele.ID == e.IDLOPHOCPHAN).MAU;
            } catch{

            }
            var html = '';
            var iTop = e.GIOKETTHUC * 60 + e.PHUTKETTHUC - e.GIOBATDAU * 60 - e.PHUTBATDAU;

            html += '<div class="task task-1 btnLichHoc" id="' + e.ID + '" style="top:' + e.PHUTBATDAU + 'px; height: ' + iTop + 'px; background-color: ' + strMauNen + '; cursor: pointer">';
            html += '<div class="task-header">';
            html += '<div class="text">';
            html += '<div class="title">' + e.TENHOCPHAN + '</div>';
            html += '<div class="task-date">' + me.returnTwo(e.GIOBATDAU) + ':' + me.returnTwo(e.PHUTBATDAU) + ' - ' + me.returnTwo(e.GIOKETTHUC) + ':' + me.returnTwo(e.PHUTKETTHUC) + ' (Tiết ' + edu.util.returnEmpty(e.TIETBATDAU) + '-' + edu.util.returnEmpty(e.TIETKETTHUC) + ')</div>';
            html += '</div>';
            //html += '<a class="student-num btnKhoiTaoDoiLich" style="color: #d93625;" title="Yêu cầu đổi lịch" id="' + e.ID + '">';
            //html += '<i class="fas fa-calendar-alt"></i>';
            //html += '</a>';
            //html += '<div class="title">' + e.TENHOCPHAN + '</div>';
            //html += '<div class="task-date">' + e.TIETBATDAU + ' - ' + e.TIETKETTHUC + '</div>';
            //html += '</div>';
            html += '</div>';
            html += '<div class="task-description">';
            html += e.THONGTINGIANGVIEN;
            html += '<div class="eval eval-gv" id="listIcon' + e.ID + '"><div class="eval-gv-list"></div></div>';
            html += '</div>';
            html += '</div>';
            $("#datebody #h" + e.NGAYHOC.replace(/\//g, '') + e.GIOBATDAU).append(html);
        });

        if (data.length > 0) {
            var arrNgay = data[0].DSNGAYCOLICH.split(',');
            console.log(arrNgay);
            arrNgay.forEach(e => {
                var point = $(".days li[ngay='" + e + "']");
                if (point.length > 0) {
                    point = point[0];
                    point.classList.add("actionclde");
                }
            });
        }
        data.forEach(e => {
            me.getList_CamXuc(e.ID, e.IDLICHHOC);
        })
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

        var iDayOfMonth = getDay(nMonth, nYear);

        var strDay = edu.util.dateToday();
        var iDay = parseInt(strDay.substr(0, strDay.indexOf("/")));

        var iThu = new Date(nYear, nMonth - 1, 1).getDay();
        if (iThu == 0) iThu = 7;
        var iPadStart = iThu - 1;

        var iPreMonth = nMonth - 1, iPreYear = nYear;
        if (iPreMonth == 0) { iPreMonth = 12; iPreYear--; }
        var iDayOfPreMonth = getDay(iPreMonth, iPreYear);

        var iNextMonth = nMonth + 1, iNextYear = nYear;
        if (iNextMonth == 13) { iNextMonth = 1; iNextYear++; }

        var date = new Date();
        var bIsCurrentMonth = (date.getMonth() + 1 == nMonth && date.getFullYear() == nYear);
        var iToday = bIsCurrentMonth ? date.getDate() : -1;
        if (!bIsCurrentMonth) iDay = 1;

        var iTotalCells = Math.ceil((iPadStart + iDayOfMonth) / 7) * 7;
        var html = "";
        var uuid = edu.util.uuid();
        var strNgayBatDau = '';
        var strNgayKetThuc = '';

        function cellInfo(c) {
            if (c < iPadStart) {
                return { day: iDayOfPreMonth - (iPadStart - 1 - c), m: iPreMonth, y: iPreYear, isCur: false };
            } else if (c < iPadStart + iDayOfMonth) {
                return { day: c - iPadStart + 1, m: nMonth, y: nYear, isCur: true };
            } else {
                return { day: c - iPadStart - iDayOfMonth + 1, m: iNextMonth, y: iNextYear, isCur: false };
            }
        }

        for (var c = 0; c < iTotalCells; c++) {
            if (c % 7 == 0) {
                uuid = edu.util.uuid();
                var s = cellInfo(c);
                var e = cellInfo(c + 6);
                strNgayBatDau = getSMonth(s.day, s.m, s.y);
                strNgayKetThuc = getSMonth(e.day, e.m, e.y);
            }
            var info = cellInfo(c);
            if (!info.isCur) {
                html += '<li class="day-of-other-month ' + uuid + '" title="' + getSMonth(info.day, info.m, info.y) + '">' + info.day + '</li>';
            } else {
                var strClass = (info.day == iDay) ? 'active' : '';
                if (info.day == iToday) strClass += ' today';
                html += '<li class="poiter ' + strClass + ' ' + uuid + '" ngay="' + info.day + '"  title="' + getSMonth(info.day, info.m, info.y) + '" name="' + uuid + '" batdau="' + strNgayBatDau + '" ketthuc="' + strNgayKetThuc + '"><span>' + info.day + '</span></li>';
            }
        }
        $(".days").html(html);
        setTimeout(function () {
            $(".days .active").trigger("click");
        }, 1000);

        function getDay(nMonth, nYear) {
            var iDayOfMonth = 31;
            switch (nMonth) {
                case 2: {
                    iDayOfMonth = 28;
                    if (nYear % 4 == 0) iDayOfMonth = 29;
                } break;
                case 4:
                case 6:
                case 9:
                case 11: iDayOfMonth = 30; break;
            }
            return iDayOfMonth;
        }
        function getSMonth(iDay, nMonth, Year) {
            if (nMonth == 0) {
                nMonth = 12;
                Year--;
            }
            if (nMonth == 13) {
                nMonth = 1;
                Year++;
            }
            return returnTwo(iDay) + '/' + returnTwo(nMonth) + '/' + Year;
        }

        function returnTwo(iDay) {
            iDay = "" + iDay;
            if (iDay.length == 1) return "0" + iDay;
            else return iDay;
        }
    },
    returnTwo: function (iDay) {
        iDay = "" + iDay;
        if (iDay.length == 1) return "0" + iDay;
        else return iDay;
    },

    save_NhapChuyenCan: function (point) {
        var me = this;
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "QLSV_NGUOIHOC_ID");
        var strNgay = $(point).attr("title");
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        //--Edit
        var obj_save = {
            'action': 'CC_NguoiHoc_ChuyenCan/ThemMoi',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSach_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.endSetData();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapChuyenCan: function (point) {
        var me = this;
        //--Edit
        var today = new Date();
        var obj = {};
        var strid = point.id;
        var arrId = strid.split("_");
        var strSV_Id = arrId[0].substring(9);
        var objSV = edu.util.objGetOneDataInData(strSV_Id, me.dtSinhVien, "QLSV_NGUOIHOC_ID");
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var obj_delete = {
            'action': 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2',
            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': objSV.QLSV_NGUOIHOC_ID,
            'strDaoTao_LopQuanLy_Id': "",
            'strDaoTao_ChuongTrinh_Id': objSV.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_TrangThaiNguoiHoc_Id': objSV.QLSV_TRANGTHAINGUOIHOC_ID,
            'strDiem_DanhSachHoc_Id': objSV.DANGKY_LOPHOCPHAN_ID,
            'strKieuChuyenCan_Id': arrId[1],
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dSoLuong': $("#" + point.id.replace("chkSelect", "input_")).val(),
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }

                //edu.system.start_Progress("divprogessdata", me.endSetData);
            },
            error: function (er) {
                var obj = {
                    content: ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

                //edu.system.start_Progress("divprogessdata", me.endGetData);
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("divprogessdata", function () {
                    me.endSetData();
                });
            },
            contentType: true,
            //async: false,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        main_doc.LichGiang.getDetail_SiSo();
        main_doc.LichGiang.getList_SinhVien();
    },


    save_TuGhiNhan: function (strId) {
        var me = this;
        var obj_notify = {};
        var today = new Date();
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var obj_save = {
            'action': 'CC_GiangVien_TuGhiNhan/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strDiem_DanhSach_Id': objLich.IDLOPHOCPHAN,
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': 0,
            'strNoiDungTuGhiNhan': edu.util.getValById('txtTuKhoaDiemDanh'),
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
    save_DiemDanhTuDong: function (strId) {
        var me = this;
        var obj_notify = {};
        var today = new Date();
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var obj_save = {
            'action': 'CC_GiangVien_TuGhiNhan/ThucHienDiemDanhTuDong',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgayGhiNhan': objLich.NGAYHOC,
            'dGio': objLich.GIOBATDAU,
            'dPhut': objLich.PHUTBATDAU,
            'dGiay': 0,
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    me.getDetail_SiSo();
                    me.getList_SinhVien();
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DoiLich: function () {
        var me = this;
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var arrGiangVien_Id = [];
        var arrGiangVienThayDoi_Id = [];
        me.dtGiangVienThayDoi.forEach((e, nRow) => {
            arrGiangVien_Id.push(e.ID);
            arrGiangVienThayDoi_Id.push($("#dropGiangVien" + e.ID).val());
        });
        //--Edit
        var obj_save = {
            'action': 'KHCT_LichGiang_DoiLich/GuiYeuCauDoiLich',
            'type': 'POST',

            'strIdLichHoc': objLich.IDLICHHOC,
            'strIdHocPhan': objLich.IDHOCPHAN,
            'strIdPhongHoc': objLich.IDPHONGHOC,
            'strIdLopHocPhan': objLich.IDLOPHOCPHAN,
            'strNgayHoc': objLich.NGAYHOC,
            'strThu': objLich.THUHOC,
            'strTietBatDau': objLich.TIETBATDAU,
            'strTietKetThuc': objLich.TIETKETTHUC,
            'strGioBatDau': objLich.GIOBATDAU,
            'strPhutBatDau': objLich.PHUTBATDAU,
            'strGioKetThuc': objLich.GIOKETTHUC,
            'strPhutKetThuc': objLich.PHUTKETTHUC,
            'strIdHinhThucXep': objLich.IDHINHTHUCXEP,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtNoiDungDoiLich'),
            'strIdPhongHoc_ThayDoi': edu.util.getValById('dropPhongHoc_DoiSang'),
            'strNgayHoc_ThayDoi': edu.util.getValById('txtNgayHoc_DoiSang'),
            'strThu_ThayDoi': edu.util.getValById('txtAAAA'),
            'strTietBatDau_ThayDoi': edu.util.getValById('txtTietBatDau_DoiSang'),
            'strTietKetThuc_ThayDoi': edu.util.getValById('txtTietKetThuc_DoiSang'),
            'strGioBatDau_ThayDoi': edu.util.getValById('txtAAAA'),
            'strPhutBatDau_ThayDoi': edu.util.getValById('txtAAAA'),
            'strGioKetThuc_ThayDoi': edu.util.getValById('txtAAAA'),
            'strPhutKetThuc_ThayDoi': edu.util.getValById('txtAAAA'),
            'strGiangVien_Ids': arrGiangVien_Id.toString(),
            'strGiangVien_ThayDoi_Ids': arrGiangVienThayDoi_Id.toString(),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Gửi yêu cầu thành công");
                    me.getList_DoiLich();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    getList_DoiLich: function (strDanhSach_Id) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSLichGiang_Doi_ThongTinCaNhan',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (document.getElementById("btnPheDuyet").style.display != "none") {
            obj_list = {
                'action': 'KHCT_LichGiang_DoiLich/LayDSLichGiang_Doi_PhamVi',
                'type': 'GET',
                'strTuKhoa': edu.util.getValById('txtAAAA'),
                'strNguoiThucHien_Id': edu.system.userId,
                'pageIndex': 1,
                'pageSize': 100000,
            };
        }
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DoiLich(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_DoiLich: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayTTLichGiang_Doi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': strId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.viewForm_DoiLich_View(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_PhetDuyet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LichGiang_DoiLich/Them_TKB_XacNhanDoiLich',
            'type': 'POST',
            'strSanPham_Id': me.strDoiLich_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtAAAA'),
            'strTinhTrang_Id': edu.util.getValById('dropPhetDuyet_TrangThai'),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Phê duyệt thành công");
                    me.getList_DoiLich();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    delete_DoiLich: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_LichGiang_DoiLich/Xoa_LichGiang_Doi_ThongTin',

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
                me.getList_DoiLich()
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
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DoiLich: function (data, iPager) {
        var me = this;
        var html = "";
        data.forEach((e, nRow) => {
            html += '<a class="class-change-calendar-item fs-14 btnEdit" id="' + e.ID + '" style="cursor: pointer">';
            html += '<p><b>Lớp: ' + edu.util.returnEmpty(e.LOPHOCPHAN_TEN) + '</b></p>';
            html += '<p>Trạng thái: ' + edu.util.returnEmpty(e.KETQUAXULY) + '</p></a>';
        });
        $("#tblDoiLich").html(html);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_KhoiTaoDoiLich: function (objLich) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/KhoiTaoThongTinYeuCauDoiLich',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strIdLichHoc': objLich.IDLICHHOC,
            'strIdHocPhan': objLich.IDHOCPHAN,
            'strIdPhongHoc': objLich.IDPHONGHOC,
            'strIdLopHocPhan': objLich.IDLOPHOCPHAN,
            'strNgayHoc': objLich.NGAYHOC,
            'strThu': objLich.THUHOC,
            'strTietBatDau': objLich.TIETBATDAU,
            'strTietKetThuc': objLich.TIETKETTHUC,
            'strGioBatDau': objLich.GIOBATDAU,
            'strPhutBatDau': objLich.PHUTBATDAU,
            'strGioKetThuc': objLich.GIOKETTHUC,
            'strPhutKetThuc': objLich.PHUTKETTHUC,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.viewForm_DoiLich(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    viewForm_DoiLich: function (data, iPager) {
        var me = this;
        me.dtGiangVienThayDoi = data.rsGiangVien;
        var aData = data.rsThongTinChung[0];

        edu.util.viewValById("txtNoiDungDoiLich", aData.NOIDUNG);
        edu.util.viewValById("txtTenLopHocPhan", aData.LOPHOCPHAN_TEN);
        edu.util.viewValById("txtNgayHoc", aData.NGAYHOC);
        edu.util.viewValById("txtNgayHoc_DoiSang", aData.NGAYHOC_THAYDOI);
        edu.util.viewValById("txtTietBatDau", aData.TIETBATDAU);
        edu.util.viewValById("txtTietBatDau_DoiSang", aData.TIETBATDAU_THAYDOI);
        edu.util.viewValById("txtTietKetThuc", aData.TIETKETTHUC);
        edu.util.viewValById("txtTietKetThuc_DoiSang", aData.TIETKETTHUC_THAYDOI);
        edu.util.viewValById("txtPhongHoc", aData.PHONGHOC_TEN);
        me.genComBo_PhongHoc("dropPhongHoc_DoiSang", aData.IDPHONGHOC_THAYDOI, data.rsDanhMucPhong);
        var html = "";
        data.rsGiangVien.forEach((e, nRow) => {
            html += '<div class="form-item on-row form-add-info">';
            html += '<label for="">Giảng viên</label>';
            html += '<div class="input-group">';
            html += '<input type="text" class="form-control" value="' + e.HODEM + ' ' + e.TEN + ' - ' + e.MASO + '" disabled>';
            html += '<i class="fal fa-user-crown"></i>';
            html += '</div>';
            html += '<div class="right">';
            html += '<div class="arrow">';
            html += '<span>Đổi sang</span>';
            html += '</div>';
            html += '<label for="">Giảng viên</label>';
            html += '<div class="input-group">';
            html += '<select class="form-select select-opt" id="dropGiangVien' + e.ID + '">';
            html += '</select>';
            html += '<i class="fal fa-user-crown"></i>';
            html += '<i class="fal fa-angle-down"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        $("#tblDoiGiangVien").html(html);
        data.rsGiangVien.forEach((e, nRow) => {
            me.genComBo_GiangVien("dropGiangVien" + e.ID, e.ID, data.rsDanhMucGiangVien);
        });
    },
    viewForm_DoiLich_View: function (data, iPager) {
        var me = this;
        if (data.length > 0) {
            var aData = data[0];
            edu.util.viewValById("txtNoiDungDoiLich_View", aData.NOIDUNG);
            edu.util.viewValById("txtTenLopHocPhan_View", aData.LOPHOCPHAN_TEN);
            edu.util.viewValById("txtNgayHoc_View", aData.NGAYHOC);
            edu.util.viewValById("txtNgayHoc_DoiSang_View", aData.NGAYHOC_THAYDOI);
            edu.util.viewValById("txtTietBatDau_View", aData.TIETBATDAU);
            edu.util.viewValById("txtTietBatDau_DoiSang_View", aData.TIETBATDAU_THAYDOI);
            edu.util.viewValById("txtTietKetThuc_View", aData.TIETKETTHUC);
            edu.util.viewValById("txtTietKetThuc_DoiSang_View", aData.TIETKETTHUC_THAYDOI);
            edu.util.viewValById("txtPhongHoc_View", aData.PHONGHOC_TEN);
            edu.util.viewValById("txtPhongHoc_DoiSang_View", aData.PHONGHOC_THAYDOI_TEN);
            var html = "";
            data.forEach((e, nRow) => {
                html += '<div class="form-item on-row form-add-info">';
                html += '<label for="">Giảng viên</label>';
                html += '<div class="input-group">';
                html += '<input type="text" class="form-control" value="' + edu.util.returnEmpty(e.GIANGVIEN_HOVATEN) + '" disabled>';
                html += '<i class="fal fa-user-crown"></i>';
                html += '</div>';
                html += '<div class="right">';
                html += '<div class="arrow">';
                html += '<span>Đổi sang</span>';
                html += '</div>';
                html += '<label for="">Giảng viên</label>';
                html += '<div class="input-group">';
                html += '<input type="text" class="form-control" value="' + edu.util.returnEmpty(e.GIANGVIEN_THAYDOI_HOVATEN) + '" disabled>';
                html += '</select>';
                html += '<i class="fal fa-user-crown"></i>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            });
            $("#tblDoiGiangVien_View").html(html);
            $("#modalXemLich").modal("show");
        }

    },

    genComBo_PhongHoc: function (strTinhTrang_Id, default_val, data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENPHONGHOC",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn phòng học"
        };
        edu.system.loadToCombo_data(obj);
        //$("#" + strTinhTrang_Id).select2();
    },
    genComBo_GiangVien: function (strTinhTrang_Id, default_val, data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MASO);
                },
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).searchBox({
            elementWidth: ''
        });
    },

    getDetail_SiSo: function (strId) {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);

        var obj_list = {
            'action': 'CC_GiangVien_TuGhiNhan/LayChiTiet',
            'type': 'GET',
            'strNgayGhiNhan': objLich.NGAYHOC,
            'strGio': objLich.GIOBATDAU,
            'strPhut': objLich.PHUTBATDAU,
            'strGiay': edu.util.getValById('txtAAAA'),
            'strDaoTao_LopHocPhan_Id': objLich.IDLOPHOCPHAN,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var aData = {};
                    var html = "";
                    if (dtReRult.length > 0) {
                        aData = dtReRult[0];
                        html += '<b class="flex-shrink-0">Sĩ số: ' + edu.util.returnEmpty(aData.TONGSOSV) + '</b>';
                    }
                    dtReRult.forEach(e => {
                        html += '<span>' + edu.util.returnEmpty(e.TEN) + ': ' + edu.util.returnEmpty(e.SOLUONG) + '</span>';
                    });
                    $("#zoneSiSoSV").html(html);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
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

    getList_TimCanBo: function (strId) {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4DSgiKREpLi8mCS4i',
            'func': 'pkg_congthongtincanbo.LayLichPhongHoc',
            'iM': edu.system.iM,
            'strIdPhongHoc': edu.system.getValById('btnSearch_PhongHoc'),
            'strNgayBatDau': edu.system.getValById('txtAAAA'),
            'strNgayKetThuc': edu.system.getValById('txtAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var aData = {};
                    if (dtReRult.length > 0) {
                        aData = dtReRult[0];
                        me.action_NguoiDung(aData);
                    }
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    action_NguoiDung: function (aData) {
        var me = this;
        $(".actionclde").removeClass("actionclde");
        me.strGiangVien_Id = aData.ID;
        $("#lblCanBoTimKiem").html(edu.util.returnEmpty(aData.MALOPHOCPHAN) + " - " + edu.util.returnEmpty(aData.TENLOPHOCPHAN));
        $(".days .active").trigger("click");
        //me.getList_DoiLich();
    },

    save_KiemTraTrungLich: function () {
        var me = this;
        //--Edit
        var objLich = me.dtLichHoc.find(e => e.ID === me.strLichHoc_Id);
        var arrGiangVien_Id = [];
        var arrGiangVienThayDoi_Id = [];
        me.dtGiangVienThayDoi.forEach((e, nRow) => {
            arrGiangVien_Id.push(e.ID);
            arrGiangVienThayDoi_Id.push($("#dropGiangVien" + e.ID).val());
        });
        //--Edit
        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/KiemTraLichCanDoi',
            'type': 'GET',

            'strIdLichHoc': objLich.IDLICHHOC,
            'strIdHocPhan': objLich.IDHOCPHAN,
            'strIdPhongHoc': objLich.IDPHONGHOC,
            'strIdLopHocPhan': objLich.IDLOPHOCPHAN,
            'strNgayHoc': objLich.NGAYHOC,
            'strThu': objLich.THUHOC,
            'strTietBatDau': objLich.TIETBATDAU,
            'strTietKetThuc': objLich.TIETKETTHUC,
            'strGioBatDau': objLich.GIOBATDAU,
            'strPhutBatDau': objLich.PHUTBATDAU,
            'strGioKetThuc': objLich.GIOKETTHUC,
            'strPhutKetThuc': objLich.PHUTKETTHUC,
            'strIdHinhThucXep': objLich.IDHINHTHUCXEP,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtNoiDungDoiLich'),
            'strIdPhongHoc_ThayDoi': edu.util.getValById('dropPhongHoc_DoiSang'),
            'strNgayHoc_ThayDoi': edu.util.getValById('txtNgayHoc_DoiSang'),
            'strThu_ThayDoi': edu.util.getValById('txtAAAA'),
            'strTietBatDau_ThayDoi': edu.util.getValById('txtTietBatDau_DoiSang'),
            'strTietKetThuc_ThayDoi': edu.util.getValById('txtTietKetThuc_DoiSang'),
            'strGioBatDau_ThayDoi': edu.util.getValById('txtAAAA'),
            'strPhutBatDau_ThayDoi': edu.util.getValById('txtAAAA'),
            'strGioKetThuc_ThayDoi': edu.util.getValById('txtAAAA'),
            'strPhutKetThuc_ThayDoi': edu.util.getValById('txtAAAA'),
            'strGiangVien_Ids': arrGiangVien_Id.toString(),
            'strGiangVien_ThayDoi_Ids': arrGiangVienThayDoi_Id.toString(),
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Phê duyệt thành công");
                    //me.getList_DoiLich();
                    var dtResult = data.Data;
                    if (dtResult.length > 0) {
                        if (dtResult[0].HOPLE) edu.system.alert("Dữ liệu kiểm tra hợp lệ");
                        else edu.system.alert(edu.system.returnEmpty(dtResult[0].THONGTINLOI));
                    } else {
                        edu.system.alert("Không trả về dữ liệu");
                    }
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

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropLoaiXacNhan"],
            type: "",
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/FSkkLB4FKCQsHhkgIg8pIC8P',
            'func': 'pkg_diem_chung.Them_Diem_XacNhan',
            'iM': edu.system.iM,

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,

            'strNguoiXacNhan_Id': edu.system.userId,
            'strDuLieuXacNhan': strSanPham_Id,
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
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P',
            'func': 'pkg_diem_chung.LayDSHanhDongXacNhan',
            'iM': edu.system.iM,
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
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIFKCQsHhkgIg8pIC8P',
            'func': 'pkg_diem_chung.LayDSDiem_XacNhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },

            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
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
                //{
                //    "mDataProp": "NOIDUNG"
                //},
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/

    getList_HocKy: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'NS_ThongTinCanBo/LayHocKyTheoLichCaNhan',
            'type': 'GET',
            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocKy(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_HocKy"],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/

    getList_PhongHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP',
            'func': 'pkg_congthongtincanbo.LayDSPhongHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;

                    me.genCombo_PhongHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genCombo_PhongHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                //mRender: function (nRow, aData) {
                //    return edu.util.returnEmpty(aData.MALOPHOCPHAN) + " - " + edu.util.returnEmpty(aData.TENLOPHOCPHAN)
                //}
            },
            renderPlace: ["dropSearch_PhongHoc"],
            title: "Chọn phòng học"
        };
        edu.system.loadToCombo_data(obj);
        $("#tbllichphonghoc tbody").html
        //$("#dropSearch_HocPhan").select2();
    },


    getList_CamXuc: function (strId, strDiem_DanhSachHoc_Id) {
        var me = this;
        //--Edit
        var aData = me.dtLichHoc.find(e => e.ID == strId);

        var obj_save = {
            'action': 'SV_CamXuc_MH/DSA4FRUCICwZNCIVLi8mCS4x',
            'func': 'pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDiem_DanhSachHoc_Id': aData.IDLOPHOCPHAN,
            'strNgayGhiNhan': aData.NGAYHOC,
            'dGio': aData.GIOBATDAU,
            'dPhut': aData.PHUTBATDAU,
            'dGiay': 0,
            'strNguoiThucHien_Id': me.strGiangVien_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var html = '';
                    dtReRult.forEach(aData => {
                        html += '<div class="item" >';
                        html += '<img src="assets/images/eval-emoji/' + aData.DG_CHUCNANG_CHUDE_CHITIET_ANH + '" alt="">';
                        if (aData.SOLUONG)
                            html += '<span style="color: black">' + edu.util.returnEmpty(aData.SOLUONG) + '</span>';
                        html += '</div>';
                    })
                    $("#listIcon" + strId).html(html);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    openForm_DuyetDangKy: function () {
        var me = this;
        me.strDuyet_NgayDangChon = "";
        $("#lblDuyet_NgayDaChon").html("");
        $("#tblDuyetDangKy tbody").html("");
        me.genCombo_Duyet_PhongHoc(function () {
            me.genHtml_Month_Duyet(0);
        });
    },
    genCombo_Duyet_PhongHoc: function (callback) {
        var obj_save = {
            'action': 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP',
            'func': 'pkg_congthongtincanbo.LayDSPhongHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var arr = [{ ID: "", TEN: "Tất cả phòng" }].concat(data.Data || []);
                    edu.system.loadToCombo_data({
                        data: arr,
                        renderInfor: { id: "ID", parentId: "", name: "TEN" },
                        renderPlace: ["dropDuyet_PhongHoc"],
                        title: "Chọn phòng học"
                    });
                    if (typeof callback === "function") callback();
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    genHtml_Month_Duyet: function (cal) {
        var me = this;
        var date = new Date();
        var nMonth, nYear;
        if ($("#duyet_thang").attr("title")) {
            nMonth = parseInt($("#duyet_thang").attr("title"));
            nYear = parseInt($("#duyet_nam").attr("title"));
        } else {
            nMonth = date.getMonth() + 1;
            nYear = date.getFullYear();
        }
        nMonth += cal;
        if (nMonth == 0) { nMonth = 12; nYear--; }
        if (nMonth == 13) { nMonth = 1; nYear++; }
        $("#duyet_thang").attr("title", nMonth).html("Tháng " + nMonth);
        $("#duyet_nam").attr("title", nYear).html(nYear);

        function getDay(m, y) {
            var d = 31;
            if (m == 2) d = (y % 4 == 0) ? 29 : 28;
            else if (m == 4 || m == 6 || m == 9 || m == 11) d = 30;
            return d;
        }
        function pad(n) { n = "" + n; return n.length == 1 ? "0" + n : n; }
        function sDate(d, m, y) {
            if (m == 0) { m = 12; y--; }
            if (m == 13) { m = 1; y++; }
            return pad(d) + "/" + pad(m) + "/" + y;
        }

        var iDayOfMonth = getDay(nMonth, nYear);
        var iThu = new Date(nYear, nMonth - 1, 1).getDay();
        if (iThu == 0) iThu = 7;
        var iPadStart = iThu - 1;

        var iPreMonth = nMonth - 1, iPreYear = nYear;
        if (iPreMonth == 0) { iPreMonth = 12; iPreYear--; }
        var iDayOfPreMonth = getDay(iPreMonth, iPreYear);

        var iNextMonth = nMonth + 1, iNextYear = nYear;
        if (iNextMonth == 13) { iNextMonth = 1; iNextYear++; }

        var bIsCurrentMonth = (date.getMonth() + 1 == nMonth && date.getFullYear() == nYear);
        var iDay = bIsCurrentMonth ? date.getDate() : 1;
        var iToday = bIsCurrentMonth ? date.getDate() : -1;

        var iTotalCells = Math.ceil((iPadStart + iDayOfMonth) / 7) * 7;
        var html = "";

        for (var c = 0; c < iTotalCells; c++) {
            if (c < iPadStart) {
                var d = iDayOfPreMonth - (iPadStart - 1 - c);
                html += '<li class="day-of-other-month" title="' + sDate(d, iPreMonth, iPreYear) + '">' + d + '</li>';
            } else if (c < iPadStart + iDayOfMonth) {
                var d = c - iPadStart + 1;
                var cls = (d == iDay) ? "active" : "";
                if (d == iToday) cls += " today";
                html += '<li class="poiter ' + cls + '" ngay="' + d + '" title="' + sDate(d, nMonth, nYear) + '"><span>' + d + '</span></li>';
            } else {
                var d = c - iPadStart - iDayOfMonth + 1;
                html += '<li class="day-of-other-month" title="' + sDate(d, iNextMonth, iNextYear) + '">' + d + '</li>';
            }
        }
        $(".duyet-days").html(html);

        var strNgayMacDinh = (date.getMonth() + 1 == nMonth && date.getFullYear() == nYear)
            ? sDate(date.getDate(), nMonth, nYear)
            : sDate(1, nMonth, nYear);
        me.strDuyet_NgayDangChon = strNgayMacDinh;
        $("#lblDuyet_NgayDaChon").html("Ngày: " + strNgayMacDinh);
        me.markDays_HasData_Duyet(function () {
            me.getList_DangKyTheoNgay(strNgayMacDinh);
        });
    },
    _getStrNgayDauThang_Duyet: function () {
        var nMonth = parseInt($("#duyet_thang").attr("title"));
        var nYear = parseInt($("#duyet_nam").attr("title"));
        var pad = function (n) { n = "" + n; return n.length == 1 ? "0" + n : n; };
        return "01/" + pad(nMonth) + "/" + nYear;
    },
    markDays_HasData_Duyet: function (callback) {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUgLyYKOB4RKS4vJh4GJDUeDSgyNQPP',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DangKy_Phong_Get_List',
            'iM': edu.system.iM,
            'strNguoiDangKy_Id': '',
            'strNgaySuDung': '',
            'strTkb_Phong_Id': edu.util.getValById('dropDuyet_PhongHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data || [];
                    console.log("[markDays_HasData_Duyet] total rows:", dtResult.length);
                    $(".duyet-days li").removeClass("actionclde");
                    var daysSet = {};
                    dtResult.forEach(function (e) {
                        var ngay = e.NGAYSUDUNG || e.NGAYSUDUNG_HIENTHI || e.NGAY;
                        if (ngay) daysSet[String(ngay).trim()] = true;
                    });
                    Object.keys(daysSet).forEach(function (ngay) {
                        var li = $(".duyet-days li[title='" + ngay + "']");
                        if (li.length === 0) {
                            var d = parseInt(ngay, 10);
                            if (!isNaN(d)) li = $(".duyet-days li.poiter[ngay='" + d + "']");
                        }
                        if (li.length > 0) li.addClass("actionclde");
                    });
                    if (typeof callback === "function") callback();
                } else {
                    console.warn("[markDays_HasData_Duyet] failed:", data.Message);
                    if (typeof callback === "function") callback();
                }
            },
            error: function (er) {
                console.warn("[markDays_HasData_Duyet] error:", er);
                if (typeof callback === "function") callback();
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_NgayCoDangKy: function (strNgay, callback) {
        var me = this;
        if (!strNgay) strNgay = me._getStrNgayDauThang_Duyet() || me.strDuyet_NgayDangChon;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUqHhEeFSYeBiQ1Hg8mIDgeEiUeEjUz',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_Dk_P_Tg_Get_Ngay_Sd_Str',
            'iM': edu.system.iM,
            'strNgay': strNgay,
            'strTKB_DangKy_Phong_Id': edu.util.getValById('dropDuyet_PhongHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("[Pr_Tkb_Dk_P_Tg_Get_Ngay_Sd_Str] data:", data.Data);
                    var dtResult = data.Data || [];
                    $(".duyet-days li").removeClass("actionclde");
                    var arrNgay = [];
                    if (dtResult.length > 0 && dtResult[0].DANHSACHNGAY) {
                        arrNgay = String(dtResult[0].DANHSACHNGAY).split(',');
                    } else {
                        dtResult.forEach(function (e) {
                            if (e.NGAY) arrNgay.push(e.NGAY);
                            else if (e.NGAYSUDUNG) arrNgay.push(e.NGAYSUDUNG);
                        });
                    }
                    arrNgay.forEach(function (ngay) {
                        ngay = String(ngay).trim();
                        if (!ngay) return;
                        var li = $(".duyet-days li[title='" + ngay + "']");
                        if (li.length == 0) {
                            var d = parseInt(ngay, 10);
                            if (!isNaN(d)) li = $(".duyet-days li.poiter[ngay='" + d + "']");
                        }
                        if (li.length > 0) li.addClass("actionclde");
                    });
                    if (typeof callback === "function") callback();
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_DangKyTheoNgay: function (strNgay) {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUgLyYKOB4RKS4vJh4GJDUeDSgyNQPP',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DangKy_Phong_Get_List',
            'iM': edu.system.iM,
            'strNguoiDangKy_Id': edu.util.getValById('dropAAAA'),
            'strNgaySuDung': strNgay,
            'strTkb_Phong_Id': edu.util.getValById('dropDuyet_PhongHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("[Pr_Tkb_DangKy_Phong_Get_List] data:", data.Data);
                    me.genTable_DangKyMuonPhong(data.Data || []);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    genTable_DangKyMuonPhong: function (data) {
        var me = this;
        console.log("[DangKyMuonPhong] data:", data);
        if (data && data.length > 0) {
            console.log("[DangKyMuonPhong] available fields:", Object.keys(data[0]));
        }
        var html = "";
        if (!data || data.length == 0) {
            html = '<tr><td colspan="10" class="text-center text-muted py-3">Không có dữ liệu</td></tr>';
            $("#tblDuyetDangKy tbody").html(html);
            $("#chkSelectAll_DuyetDangKy").prop("checked", false);
            return;
        }
        function pick(e) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (e[k] !== undefined && e[k] !== null && e[k] !== "") return e[k];
            }
            return "";
        }
        data.forEach(function (e, i) {
            var nguoiDK = pick(e,
                'NGUOIDANGKY', 'NGUOIDANGKY_HIENTHI', 'NGUOIDANGKY_HOVATEN',
                'NGUOIDANGKY_TENDAYDU', 'NGUOIDANGKY_TEN', 'HOVATEN_NGUOIDANGKY',
                'NGUOITAO_HIENTHI', 'NGUOITAO_HOVATEN', 'NGUOITAO_TEN',
                'HOVATEN', 'HOTEN');
            var thoiGianTH = pick(e,
                'THOIGIANTHUCHIEN', 'NGAYTAO_DD_MM_YYYY_HHMMSS', 'NGAYTAO_HIENTHI',
                'THOIGIAN_TAO', 'NGAYTAO', 'THOIGIAN');
            var phongTen = pick(e,
                'PHONGDANGKY', 'PHONGDANGKY_TEN', 'TKB_PHONG_TEN', 'TKBPHONG_TEN',
                'PHONG_TEN', 'TENPHONG', 'TENPHONGHOC', 'PHONGHOC_TEN');
            var ngaySD = pick(e, 'NGAYSUDUNG', 'NGAYSUDUNG_HIENTHI', 'NGAYSD', 'NGAY');
            var gioPhutBD = pick(e, 'GIOPHUTBATDAU', 'GIOPHUT_BATDAU');
            var gioPhutKT = pick(e, 'GIOPHUTKETTHUC', 'GIOPHUT_KETTHUC');
            var gioBD = pick(e, 'GIOBATDAU', 'GIOBD', 'GIO_BATDAU');
            var phutBD = pick(e, 'PHUTBATDAU', 'PHUTBD', 'PHUT_BATDAU');
            var gioKT = pick(e, 'GIOKETTHUC', 'GIOKT', 'GIO_KETTHUC');
            var phutKT = pick(e, 'PHUTKETTHUC', 'PHUTKT', 'PHUT_KETTHUC');
            var mucDich = pick(e, 'MUCDICHSUDUNG', 'MUCDICH', 'NOIDUNG', 'GHICHU');
            var tinhTrang = pick(e,
                'TINHTRANG_DUYET_TEN', 'TINHTRANGDUYET_TEN', 'TRANGTHAIDUYET_TEN',
                'TINHTRANG_TEN', 'TRANGTHAI_TEN', 'KETQUAXULY',
                'TINHTRANG', 'TRANGTHAI');
            var rowId = pick(e,
                'TKB_DANGKY_PHONG_THOIGIAN_ID',
                'TKB_DK_PHONG_THOIGIAN_ID',
                'TKB_DK_P_TG_ID',
                'TKB_DANGKY_PHONG_ID',
                'TKB_DK_PHONG_ID',
                'ID');
            if (!rowId) {
                var keys = Object.keys(e);
                for (var k = 0; k < keys.length; k++) {
                    var up = keys[k].toUpperCase();
                    if (up === "ID" && e[keys[k]]) { rowId = e[keys[k]]; break; }
                }
                if (!rowId) {
                    for (var k = 0; k < keys.length; k++) {
                        var up = keys[k].toUpperCase();
                        if (up.indexOf("_ID") === up.length - 3 && up !== "NGUOIDANGKY_ID" && up !== "NGUOITAO_ID" && up !== "TKB_PHONG_ID" && up !== "NGUONDULIEUTKB_ID" && e[keys[k]]) {
                            rowId = e[keys[k]]; break;
                        }
                    }
                }
            }
            var hasRealId = !!rowId;
            if (!hasRealId) {
                rowId = "FAKE_" + pick(e, 'STT') + "_" + pick(e, 'NGAYSUDUNG') + "_" + pick(e, 'GIOPHUTBATDAU');
                console.warn("[DangKyMuonPhong] row missing real ID. keys:", keys, "| fake key:", rowId);
            } else {
                console.log("[DangKyMuonPhong] row ID detected:", rowId);
            }

            var strGioBD = gioPhutBD !== ""
                ? gioPhutBD
                : ((gioBD !== "" || phutBD !== "") ? (me.returnTwo(gioBD) + ':' + me.returnTwo(phutBD)) : '');
            var strGioKT = gioPhutKT !== ""
                ? gioPhutKT
                : ((gioKT !== "" || phutKT !== "") ? (me.returnTwo(gioKT) + ':' + me.returnTwo(phutKT)) : '');

            html += '<tr>';
            html += '<th class="text-center" scope="row">' + (i + 1) + '</th>';
            html += '<td class="text-left">' + edu.util.returnEmpty(nguoiDK) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(thoiGianTH) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(phongTen) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(ngaySD) + '</td>';
            html += '<td class="text-center">' + strGioBD + '</td>';
            html += '<td class="text-center">' + strGioKT + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(mucDich) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(tinhTrang) + '</td>';
            html += '<td class="text-center"><input type="checkbox" class="chkRow_DuyetDangKy" data-id="' + edu.util.returnEmpty(rowId) + '" data-hasrealid="' + (hasRealId ? "1" : "0") + '" /></td>';
            html += '</tr>';
        });
        $("#tblDuyetDangKy tbody").html(html);
        $("#chkSelectAll_DuyetDangKy").prop("checked", false);
    },

    getList_KetQuaCaNhan: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUgLyYKOB4RKS4vJh4GJDUeDSgyNQPP',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DangKy_Phong_Get_List',
            'iM': edu.system.iM,
            'strNguoiDangKy_Id': edu.system.userId,
            'strNgaySuDung': edu.util.getValById('txtAAAA'),
            'strTkb_Phong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("[Pr_Tkb_DangKy_Phong_Get_List] data:", data.Data);
                    me.genTable_KetQuaCaNhan(data.Data || []);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    genTable_KetQuaCaNhan: function (data) {
        var me = this;
        if (data && data.length > 0) {
            console.log("[KetQuaCaNhan] available fields:", Object.keys(data[0]));
        }
        var html = "";
        if (!data || data.length == 0) {
            $("#tblKetQuaCaNhan tbody").html('<tr><td colspan="10" class="text-center text-muted py-3">Không có dữ liệu</td></tr>');
            return;
        }
        function pick(e) {
            for (var i = 1; i < arguments.length; i++) {
                var k = arguments[i];
                if (e[k] !== undefined && e[k] !== null && e[k] !== "") return e[k];
            }
            return "";
        }
        data.forEach(function (e, i) {
            var nguoiDK = pick(e,
                'NGUOIDANGKY_FULLNAME', 'NGUOIDANGKY', 'NGUOIDANGKY_HIENTHI',
                'NGUOIDANGKY_HOVATEN', 'NGUOIDANGKY_TENDAYDU', 'NGUOIDANGKY_NAME',
                'NGUOIDANGKY_TEN', 'NGUOITAO_HIENTHI', 'NGUOITAO_HOVATEN',
                'NGUOITHUCHIEN_HIENTHI', 'HOVATEN', 'HOTEN');
            var thoiGianTH = pick(e,
                'THOIGIANTHUCHIEN', 'NGAYTAO_DD_MM_YYYY_HHMMSS', 'NGAYTAO_HIENTHI',
                'NGAYTAO', 'THOIGIAN');
            var phongTen = pick(e,
                'PHONGDANGKY', 'PHONGDANGKY_TEN', 'TKB_PHONG_TEN', 'TKBPHONG_TEN',
                'PHONG_TEN', 'TENPHONG', 'TENPHONGHOC', 'PHONGHOC_TEN');
            var ngaySD = pick(e, 'NGAYSUDUNG', 'NGAYSUDUNG_HIENTHI', 'NGAYSD', 'NGAY');
            var gioPhutBD = pick(e, 'GIOPHUTBATDAU', 'GIOPHUT_BATDAU');
            var gioPhutKT = pick(e, 'GIOPHUTKETTHUC', 'GIOPHUT_KETTHUC');
            var gioBD = pick(e, 'GIOBATDAU', 'GIOBD');
            var phutBD = pick(e, 'PHUTBATDAU', 'PHUTBD');
            var gioKT = pick(e, 'GIOKETTHUC', 'GIOKT');
            var phutKT = pick(e, 'PHUTKETTHUC', 'PHUTKT');
            var mucDich = pick(e, 'MUCDICHSUDUNG', 'MUCDICH', 'MOTA', 'NOIDUNG', 'GHICHU');
            var tinhTrang = pick(e,
                'TINHTRANG_DUYET_TEN', 'TINHTRANGDUYET_TEN', 'TRANGTHAIDUYET_TEN',
                'TINHTRANG_TEN', 'TRANGTHAI_TEN', 'KETQUAXULY',
                'TINHTRANG', 'TRANGTHAI');
            var rowId = pick(e,
                'TKB_DANGKY_PHONG_THOIGIAN_ID', 'TKB_DK_PHONG_THOIGIAN_ID',
                'TKB_DANGKY_PHONG_ID', 'TKB_DK_PHONG_ID',
                'TKB_DK_P_TG_ID', 'TKB_DANGKY_PHONG_TG_ID', 'ID');
            if (!rowId) {
                console.warn("[KetQuaCaNhan] row missing ID, available keys:", Object.keys(e));
            }

            var strGioBD = gioPhutBD !== ""
                ? gioPhutBD
                : ((gioBD !== "" || phutBD !== "") ? (me.returnTwo(gioBD) + ':' + me.returnTwo(phutBD)) : '');
            var strGioKT = gioPhutKT !== ""
                ? gioPhutKT
                : ((gioKT !== "" || phutKT !== "") ? (me.returnTwo(gioKT) + ':' + me.returnTwo(phutKT)) : '');

            html += '<tr>';
            html += '<th class="text-center" scope="row">' + (i + 1) + '</th>';
            html += '<td class="text-left">' + edu.util.returnEmpty(nguoiDK) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(thoiGianTH) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(phongTen) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(ngaySD) + '</td>';
            html += '<td class="text-center">' + strGioBD + '</td>';
            html += '<td class="text-center">' + strGioKT + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(mucDich) + '</td>';
            html += '<td class="text-left">' + edu.util.returnEmpty(tinhTrang) + '</td>';
            html += '<td class="text-center">';
            html += '<a class="btn btn-sm btn-outline-danger btnDelete_KetQuaCaNhan" data-id="' + edu.util.returnEmpty(rowId) + '"><i class="fal fa-trash-alt"></i></a>';
            html += '</td>';
            html += '</tr>';
        });
        $("#tblKetQuaCaNhan tbody").html(html);
    },

    openForm_XacNhanDuyet: function (strSanPham_Id) {
        var me = this;
        $("#modalXacNhanDuyet").modal("show");
        edu.util.viewValById("txtDuyet_NoiDung", "");
        me.getList_TrangThaiXacNhan();
        me.getList_LichSuDuyet(strSanPham_Id);
    },
    getList_TrangThaiXacNhan: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUKHhUVHgYkNR4DOB4UMiQz',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DK_TT_Get_By_User',
            'iM': edu.system.iM,
            'strNguoiDung_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log("[Pr_Tkb_DK_TT_Get_By_User] data:", data.Data);
                    var dtResult = data.Data || [];
                    if (dtResult.length > 0) {
                        console.log("[TrangThaiXacNhan] available fields:", Object.keys(dtResult[0]));
                    }
                    function pick(e) {
                        for (var i = 1; i < arguments.length; i++) {
                            var k = arguments[i];
                            if (e[k] !== undefined && e[k] !== null && e[k] !== "") return e[k];
                        }
                        return "";
                    }
                    var html = "";
                    var arrMauNen = ["bg-yellow", "bg-green", "bg-cyan", "bg-pink", "bg-orange"];
                    dtResult.forEach(function (e, i) {
                        var cls = arrMauNen[i % arrMauNen.length];
                        var id = pick(e, 'ID', 'TINHTRANG_ID', 'TRANGTHAI_ID');
                        var ten = pick(e, 'TEN', 'TINHTRANG_TEN', 'TRANGTHAI_TEN', 'TINHTRANG_DUYET_TEN');
                        html += '<div class="aps-diemdanh-tudong d-flex align-items-center summary-atten atten-mid mb-5 btnTrangThaiXacNhan ' + cls + '" id="btnTT_' + id + '" style="cursor: pointer;">';
                        html += '<b class="me-auto flex-shrink-0 text-uppercase">' + edu.util.returnEmpty(ten) + '</b>';
                        html += '</div>';
                    });
                    if (dtResult.length == 0) {
                        html = '<div class="text-muted text-center py-3">Không có trạng thái xác nhận nào</div>';
                    }
                    $("#zoneTrangThaiXacNhan").html(html);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) { edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_LichSuDuyet: function (strSanPham_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/DSA4BRIVCgMeBSAvJgo4HgU0OCQ1',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.LayDSTKB_DangKy_Duyet',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strSanPham_Id': strSanPham_Id,
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_LichSuDuyet(data.Data);
                } else {
                    edu.system.alert(data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    genTable_LichSuDuyet: function (data) {
        var jsonForm = {
            strTable_Id: "tblLichSuDuyet",
            aaData: data,
            colPos: { center: [0] },
            aoColumns: [
                { "mDataProp": "TINHTRANG_TEN" },
                { "mDataProp": "NGUOIXACNHAN_HIENTHI" },
                { "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS" },
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    save_DuyetDangKy: function (strSanPham_Id, strTinhTrang_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_MuonPhong_MH/ETMeFSojHgUgLyYKOB4FNDgkNR4ILzIkMzUP',
            'func': 'PKG_CORE_DANGKY_MUONPHONG.Pr_Tkb_DangKy_Duyet_Insert',
            'iM': edu.system.iM,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': edu.util.getValById('txtDuyet_NoiDung'),
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.util.getValById('dropAAAA'),
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': edu.util.getValById('txtAAAA'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me._duyetOkCount = (me._duyetOkCount || 0) + 1;
                } else {
                    me._duyetFailMsg = (me._duyetFailMsg ? me._duyetFailMsg + "\n" : "") + (data.Message || "Lỗi");
                }
                me._onDuyetDone(strSanPham_Id);
            },
            error: function (er) {
                me._duyetFailMsg = (me._duyetFailMsg ? me._duyetFailMsg + "\n" : "") + JSON.stringify(er);
                me._onDuyetDone(strSanPham_Id);
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    _onDuyetDone: function (strSanPham_Id) {
        var me = this;
        me._duyetRemaining = (me._duyetRemaining || 1) - 1;
        if (me._duyetRemaining > 0) return;
        if (me._duyetOkCount > 0 && !me._duyetFailMsg) {
            edu.system.alert("Duyệt thành công " + me._duyetOkCount + " bản ghi", "s");
        } else if (me._duyetOkCount > 0 && me._duyetFailMsg) {
            edu.system.alert("Duyệt thành công " + me._duyetOkCount + " / thất bại:\n" + me._duyetFailMsg, "w");
        } else {
            edu.system.alert(me._duyetFailMsg || "Duyệt thất bại", "w");
        }
        me.getList_LichSuDuyet(strSanPham_Id);
        if (me.strDuyet_NgayDangChon) me.getList_DangKyTheoNgay(me.strDuyet_NgayDangChon);
    },
}