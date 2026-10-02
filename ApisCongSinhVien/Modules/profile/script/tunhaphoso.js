/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TuNhapHoSo() { };
TuNhapHoSo.prototype = {
    strSinhVien_Id: '',
    strTuNhapHoSo_Id: '',
    dtTuNhapHoSo: [],
    dtTemp: [],
    aDataSinhVien: {},
    bcheck: false,

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_KeHoach();
        me.getDetail_SinhVien();
        $(".btnSave_TuNhapHoSo").click(function () {
            //if (!edu.util.getValById('uploadPicture_SV')) {
            //    edu.system.alert("Bạn hãy upload ảnh cá nhân");
            //    return;
            //}
            var bcheckBatBuoc = false;
            me.save_Anh();
            var dtBatBuoc = me.dtTuNhapHoSo.filter(e => e.BATBUOC == 1);
            var arrBatBuoc = [];
            dtBatBuoc.forEach(e => {
                var strGiaTriCheck = $("#m" + e.ID).val();
                if (strGiaTriCheck == "") {
                    bcheckBatBuoc = true;
                    e["THONGBAO"] = "bắt buộc";
                    arrBatBuoc.push(e);
                    //edu.system.alert("Hãy nhập: <span style='color: red'>" + e.TEN + "</span>");
                } else {
                    if (e.DODAI && strGiaTriCheck.toString().length != e.DODAI) {
                        bcheckBatBuoc = true;
                        e["THONGBAO"] = "sai độ dài (" + e.DODAI +")";
                        arrBatBuoc.push(e);

                    }
                    switch (e.KIEUDULIEU) {
                        case "NUMBER": {
                            if (isNaN(strGiaTriCheck)) {
                                bcheckBatBuoc = true;
                                e["THONGBAO"] = "sai kiểu số";
                                arrBatBuoc.push(e);
                            }
                        }; break;
                        case "DATE": {
                            if (!isValidDateFormat(strGiaTriCheck)) {
                                bcheckBatBuoc = true;
                                e["THONGBAO"] = "sai định dạng ngày(dd/mm/yyyy)";
                                arrBatBuoc.push(e);
                            }
                        }; break;
                    }
                }
                
            });
            if (bcheckBatBuoc) {
                $("#tblThongBaoRangBuoc").remove();
                edu.system.alert('<table id="tblThongBaoRangBuoc"><tbody></tbody></table>');
                arrBatBuoc.forEach(e => {
                    $("#tblThongBaoRangBuoc tbody").append("<tr><td>Trường thông tin " + edu.util.returnEmpty(e.THONGBAO) + ": </td><td style='text-align: left'><span style='color: red'>" + e.TEN + "</span></td></tr>");
                })

                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", me.dtTemp.length);
            for (var i = 0; i < me.dtTemp.length; i++) {
                me.save_TuNhapHoSo(me.dtTemp[i]);
            }
        });

        function isValidDateFormat(str) {
            // dd/mm/yyyy (01-31 / 01-12 / 4 số năm)
            const regex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
            return regex.test(str);
        }

        //$("#btnSearch").click(function () {
        //    me.getList_TuNhapHoSo();
        //});
        //$("#txtSearch_TuKhoa").keypress(function (e) {
        //    if (e.which === 13) {
        //        e.preventDefault();
        //        me.getList_TuNhapHoSo();
        //    }
        //});
        //$("#dropSearch_KeHoach").on("select2:select", function () {
        //    me.getList_TuNhapHoSo();
        //    var temp = $("#dropSearch_KeHoach option:selected").attr("name");
        //    if (temp == "0" || temp == 0) {
        //        me.bcheck = true;
        //        $(".hssv").hide();
        //    }
        //});
        $('#dropSearch_KeHoach').on('change', function () {
            if (!edu.util.getValById('dropSearch_KeHoach')) return;
            me.getList_TuNhapHoSo();
            var temp = $("#dropSearch_KeHoach option:selected").attr("name");
            if (temp == "0" || temp == 0) {
                me.bcheck = true;
                $(".hssv").hide();
            }
        });
        //$('##dropSearch_KeHoach').on('change', function () {
        //    alert(this.value);
        //});
        ////edu.extend.genDropTinhThanh("dropSearch_KeHoach1", "dropSearch_KeHoach2", "dropSearch_KeHoach3", "", "", "");
        //$("#zoneTab").delegate('.tabhoatdong', 'click', function (e) {
        //    var strTab = this.id;
        //    var data = [];
        //    if (strTab && strTab != "undefined")
        //        data = me.dtTuNhapHoSo.filter(e => e.TAB_THONGTIN_ID == strTab);
        //    else data = me.dtTuNhapHoSo;
        //    console.log(data);
        //    me.genTable_TuNhapHoSo(data);
        //});
        edu.system.uploadAvatar(['uploadPicture_SV'], "", function () {
            me.save_Anh();
        });

        // Bấm nút camera => chuyển tiếp click sang img mà widget UploadAvatar đã bind handler
        $(document).off('click.tnhsAvatarBtn').on('click.tnhsAvatarBtn', '.page-tunhaphoso .upload-avata', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $img = $('#srcuploadPicture_SV');
            if ($img.length === 0) $img = $('.page-tunhaphoso .avata-img img').first();
            if ($img.length) $img.trigger('click');
        });


        $("#zoneTab").delegate('.tab-item', 'click', function (e) {
            var tabId = $(this).attr("name");
            $(".swiper-slide-thumb-active").removeClass("swiper-slide-thumb-active");
            this.classList.add("swiper-slide-thumb-active");
            var strTab = this.id;
            var data = [];
            if (strTab && strTab != "undefined")
                data = me.dtTuNhapHoSo.filter(e => e.TAB_THONGTIN_ID == strTab);
            else data = me.dtTuNhapHoSo;
            me.dtTemp = data;
            me.genTable_TuNhapHoSo(data);
        });


        edu.system.getList_MauImport("zonebtnBaoCao_TNHS", function (addKeyValue) {
            var obj_save = {
                'strQLSV_NguoiHoc_TTTS_Id': edu.system.userId,
                'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_KeHoach_MH/DSA4BRIKJAkuICIpDykgMQkuEi4P',
            'func': 'pkg_hososinhvien_kehoach.LayDSKeHoachNhapHoSo',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
                    if (dtResult.length > 0 && dtResult[0].XACNHANTHONGTIN == 0) $("#lblXacNhanTuTruong").html(""); else $("#lblXacNhanTuTruong").html("Xác nhận từ trường");
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MOTA",
                code: "XACNHANTHONGTIN",
                //selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_KeHoach", data[0].ID);
            //me.getList_KetQuaHocTap();
            //me.getList_TichLuyTheoKhoi();
        }
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TuNhapHoSo: function (aData) {
        var me = this;
        var obj_notify = {};
        var strTruongThongTin_GiaTri = aData.TRUONGTHONGTIN_GIATRI;
        var strThongTinXacMinh = aData.THONGTINXACMINH;
        if (me.bcheck) strTruongThongTin_GiaTri = $("#m" + aData.ID).val();
        else strThongTinXacMinh = $("#m" + aData.ID).val();
        if (aData.KIEUDULIEU.toUpperCase() == "FILE") {
            edu.system.saveFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files");
        }

        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_MH/FSkkLB4QDRIXHgokCS4gIikeBTQNKCQ0',
            'func': 'pkg_hososinhvien_kehoach.Them_QLSV_KeHoach_DuLieu',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTruongThongTin_Id': aData.ID,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'strThongTinXacMinh': strThongTinXacMinh,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");

                    //edu.system.saveFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
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
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Anh: function () {
        var me = this;
        var strAnhRaw = edu.util.getValById('uploadPicture_SV');
        if (!strAnhRaw) return;
        var strAnhVal = edu.system.getImage('uploadPicture_SV', me.strSinhVien_Id);
        edu.util.viewValById('uploadPicture_SV', strAnhVal);
        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/EjQgHhANEhceDyY0LigJLiIecAPP',
            'func': 'pkg_hosohocvien.Sua_QLSV_NguoiHoc_1',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strAnh': strAnhVal,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Đã lưu ảnh đại diện");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    getList_TuNhapHoSo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_MH/DSA4BRIJLhIuAikuESkkMRIXDykgMQPP',
            'func': 'pkg_hososinhvien_kehoach.LayDSHoSoChoPhepSVNhap',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTuNhapHoSo = dtReRult;
                    me.getList_DM_HoatDong();
                    //me.genTable_TuNhapHoSo(dtReRult, data.Pager);
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_TuNhapHoSo: function (data, iPager) {
        var me = this;
        $("#lblTuNhapHoSo_Tong").html(iPager);

        if (!data || data.length === 0) {
            $("#tblTuNhapHoSo").html(
                '<div class="tnhs-empty">' +
                '<span class="empty-ic"><i class="fal fa-clipboard-list"></i></span>' +
                '<h4>Nhóm này chưa có thông tin cần nhập</h4>' +
                '<p>Vui lòng chọn nhóm khác ở phía trên.</p>' +
                '</div>'
            );
            return;
        }

        // Gom du lieu theo THUOCNHOM (normalize Unicode + whitespace de tranh tach nhom vo ly)
        function normalizeGroup(v) {
            if (v == null) return '';
            var s = v.toString();
            if (s.normalize) s = s.normalize('NFC');
            return s.replace(/\s+/g, ' ').trim().toUpperCase();
        }
        var groups = [];
        var groupMap = {};
        data.forEach(function (aData) {
            var key = normalizeGroup(aData.THUOCNHOM);
            var displayName = (aData.THUOCNHOM && aData.THUOCNHOM.toString().trim()) || '';
            if (!key) {
                key = 'THONG_TIN_CHUNG';
                displayName = 'THÔNG TIN CHUNG';
            }
            if (!groupMap[key]) {
                groupMap[key] = { name: displayName, items: [] };
                groups.push(groupMap[key]);
            }
            groupMap[key].items.push(aData);
        });

        var html = '';
        var iconMap = {
            'CCCD': 'fal fa-id-card',
            'THÔNG TIN CƯ TRÚ (TRA TRÊN VNIED)': 'fal fa-house-user',
            'THÔNG TIN CƯ TRÚ (TRA TRÊN VNEID)': 'fal fa-house-user',
            'BỐ': 'fal fa-user-tie',
            'MẸ': 'fal fa-user-tie',
            'THÔNG TIN CHUNG': 'fal fa-user'
        };
        var globalRow = 0;
        groups.forEach(function (g) {
            var iconCls = iconMap[g.name.toUpperCase()] || 'fal fa-folder-open';
            html += '<div class="tnhs-card">';
            html += '<div class="tnhs-card-header">';
            html += '<span class="tnhs-card-title"><i class="' + iconCls + '"></i>' + edu.util.returnEmpty(g.name) + '</span>';
            html += '<span class="tnhs-card-count">' + g.items.length + ' trường</span>';
            html += '</div>';
            html += '<div class="tnhs-card-body">';
            g.items.forEach(function (aData) {
                var nRow = globalRow++;
                html += '<div class="tnhs-row">';
                html += '<div class="tnhs-row-label">' + edu.util.returnEmpty(aData.TEN);
                html += aData.BATBUOC == 1 ? '<span class="tnhs-req">*</span>' : '';
                html += '</div>';
                html += '<div class="tnhs-row-input">';
                html += '<div class="form-item form-add-info">';
                html += '<div class="input-group">';
                html += aData.TENANH ? '<i class="' + aData.TENANH + ' color-dask-blue"></i>' : '';
                html += geninput(nRow, aData);
                html += '</div>';
                html += '</div>';
                html += '</div>';
                if (aData.KETQUAXACNHAN_TEN) {
                    html += '<div class="tnhs-row-verify">' + edu.util.returnEmpty(aData.KETQUAXACNHAN_TEN) + '</div>';
                }
                html += '</div>';
            });
            html += '</div></div>';
        });
        $("#tblTuNhapHoSo").html(html);



        function geninput(nRow, aData) {
            if (aData.KIEUDULIEU) {
                var strLoai = 'input';
                var strDuocSua = (aData.DUOCSUA === 0 ? 'readonly="readonly"' : '');
                var strDoDai = (aData.DORONG) ? 'height: ' + aData.DORONG + 'px' : '';
                if (aData.DORONG) strLoai = "textarea";
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "TEXT": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' />';
                    case "NUMBER": return '<' + strLoai + ' id="m' + aData.ID + '"  class="form-control input-number" value="' + me.getGiaTri(aData) + '" style="' + strDoDai + '" ' + strDuocSua + ' />';
                    case "DATE": return '<input id="m' + aData.ID + '"  class="form-control input-datepicker" value="' + me.getGiaTri(aData) + '" ' + strDuocSua + ' />';
                    case "TINH":
                    case "HUYEN":
                    case "XA":
                    case "LIST":
                        return '<select id="m' + aData.ID + '" class="form-select select-opt"></select>';
                    case "FILE": return '<div id="m' + aData.ID + '"></div>';
                    //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
                }
            }
        }
        
        var arrFile = [];

        data.forEach(aData => {
            if (aData.KIEUDULIEU) {
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "LIST": {
                        if (aData.MABANGDANHMUC) {
                            $("#m" + aData.ID).select2();
                            edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "", "", dtDanhMuc => {
                                if (aData.THONGTIN5 || aData.THONGTIN3) {
                                    me['dt' + aData.ID] = dtDanhMuc;
                                    dtDanhMuc = dtDanhMuc.filter(e => e.QUANHECHA_ID == null);
                                }
                                var obj = {
                                    data: dtDanhMuc,
                                    renderInfor: {
                                        id: "ID",
                                        parentId: "",
                                        name: "TEN",
                                        default_val: me.getGiaTri(aData)
                                    },
                                    renderPlace: ["m" + aData.ID],
                                };
                                edu.system.loadToCombo_data(obj);
                            });

                            if (aData.THONGTIN5) {
                                if ($("#m" + aData.THONGTIN5).length > 0) {
                                    $("#m" + aData.THONGTIN5).select2();
                                    $('#m' + aData.ID).on('change', function () {
                                        var strCha_Id = $("#m" + aData.ID).val();
                                        //console.log(strCha_Id)
                                        if (strCha_Id == "") {
                                            var dtReRult = me['dt' + aData.ID];
                                            
                                        } else {
                                            var dtReRult = me['dt' + aData.ID];
                                            if (dtReRult && dtReRult.length > 0)
                                                dtReRult = dtReRult.filter(e => e.QUANHECHA_ID === strCha_Id);
                                        }
                                        var aDataCon = data.find(e => e.ID == aData.THONGTIN5);
                                        var obj = {
                                            data: dtReRult,
                                            renderInfor: {
                                                id: "ID",
                                                parentId: "",
                                                name: "TEN",
                                                code: "MA",
                                                default_val: me.getGiaTri(aDataCon)
                                            },
                                            renderPlace: ["m" + aData.THONGTIN5],
                                            type: "",
                                            title: "Chọn " + edu.util.returnEmpty(aDataCon.TEN)
                                        };
                                        edu.system.loadToCombo_data(obj);
                                    });
                                }
                            }
                        }

                    }; break;
                    case "FILE": {
                        edu.system.uploadFiles(["m" + aData.ID]);
                        //edu.system.viewFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files");
                        break;
                    }
                    case "TINH": {
                        var objHuyen = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "HUYEN"));
                        var objXa = data.find(e => (e.NHOM === aData.NHOM && e.KIEUDULIEU === "XA"));

                        var strTinh_Id = "m" + aData.ID;
                        var strHuyen_Id = "m";
                        if (objHuyen) strHuyen_Id = strHuyen_Id + objHuyen.ID;
                        var strXa_Id = "m";
                        if (objXa) strXa_Id = strXa_Id + objXa.ID;
                        $("#" + strTinh_Id).select2();
                        $("#" + strHuyen_Id).select2();
                        $("#" + strXa_Id).select2();
                        var strTinh = me.getGiaTri(aData);
                        var strHuyen = me.getGiaTri(objHuyen);
                        var strXa = me.getGiaTri(objXa);

                        edu.extend.genDropTinhThanh(strTinh_Id, strHuyen_Id, strXa_Id, strTinh, strHuyen, strXa);
                        if (aData.THONGTIN3) {
                            //var objHoSo = data.find(e => e.MABANGDANHMUC === aData.THONGTIN3);
                            //console.log('#m' + aData.ID);
                            $('#m' + aData.ID).on('change', function () {
                                var strCha_Id = $("#m" + aData.ID).val();
                                //console.log(strCha_Id)
                                if (strCha_Id == "") {
                                    var dtReRult = me['dt' + aData.THONGTIN3];
                                } else {
                                    var dtReRult = me['dt' + aData.THONGTIN3].filter(e => e.QUANHECHA_ID === strCha_Id);
                                }
                                var obj = {
                                    data: dtReRult,
                                    renderInfor: {
                                        id: "ID",
                                        parentId: "",
                                        name: "TEN",
                                        code: "MA",
                                    },
                                    renderPlace: ["m" + aData.THONGTIN3],
                                    type: "",
                                    //title: "Chọn " + edu.util.returnEmpty(aData.TENHIENTHITOHOP)
                                };
                                edu.system.loadToCombo_data(obj);
                            });
                        }
                    }; break;
                }
            }
        });

        //edu.system.uploadFiles(arrFile);
        setTimeout(function () {
            data.forEach(aData => {
                if (aData.KIEUDULIEU) {

                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "LIST": {
                            $("#m" + aData.ID).val(me.getGiaTri(aData)).trigger("change");
                        }; break;
                        case "FILE": edu.system.viewFiles("m" + aData.ID, me.strSinhVien_Id + aData.ID, "SV_Files"); break;
                    }
                }
                //edu.system.viewFiles("txtFileDinhKem" + aData.ID, aData.ID, "SV_Files");
            });
        }, 1000);
        edu.system.pickerdate();
        edu.system.pickerNumber();
        //me.actionRowSpanForACol(jsonForm.strTable_Id, 1);
        /*III. Callback*/
    },
    actionRowSpanForACol: function (strTableId, icol) {
        if (document.getElementById(strTableId) == undefined) {
            edu.system.alert("Không tồn tại: <b>" + strTableId + "</b>");
            return;
        }
        x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
        var tempCellobj = x[0].cells[icol];
        for (var i = 1; i < x.length; i++) {
            if (!tempCellobj.innerHTML || x[i].cells[icol].innerHTML != tempCellobj.innerHTML) {
                tempCellobj = x[i].cells[icol];
            } else {
                tempCellobj.rowSpan++;
                x[i].deleteCell(icol);
            }
        }
    },

    getDetail_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'SV_Custom/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP',
            'func': 'pkg_hosohocvien.LayThongTinChiTietHoSo',
            'iM': edu.system.iM,
            'strId': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (data.Data.length > 0) {
                        me.viewForm_SinhVien(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
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
    viewForm_SinhVien: function (aData) {
        $("#lblHoTen").html(edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN));
        $("#lblNgaySinh").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_NGAYSINH));
        $("#lblCMT").html(edu.util.returnEmpty(aData.CMTND_SO));
        $("#lblMaSinhVien").html(edu.util.returnEmpty(aData.MASO));
        $("#lblNganhHoc").html(edu.util.returnEmpty(aData.NGANH));
        $("#lblLopQuanly").html(edu.util.returnEmpty(aData.LOP));
        $("#lblMaNganh").html(edu.util.returnEmpty(aData.MANGANH));

        var strAnh = edu.system.getRootPathImg(aData.ANHCANHANTUUP);
        edu.util.viewValById("uploadPicture_SV", aData.ANHCANHANTUUP);////
        $("#srcuploadPicture_SV").attr("src", strAnh);////
    },
    getGiaTri: function (aData) {
        var me = this;
        if (!aData) return;
        if (me.bcheck) return edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI);
        return edu.util.returnEmpty(aData.THONGTINXACMINH);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_DM_HoatDong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_KeHoach_MH/DSA4BRIVICMVKS4vJhUoLw8mNC4oCS4i',
            'func': 'pkg_hososinhvien_kehoach.LayDSTabThongTinNguoiHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTab_DM_HoatDong(dtReRult);
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

    genTab_DM_HoatDong: function (data) {
        var me = this;
        var html = '';

        // Chỉ giữ những tab có ít nhất 1 field khai báo trong dtTuNhapHoSo
        var dtHoSo = me.dtTuNhapHoSo || [];
        var dataCoData = (data || []).filter(function (tab) {
            return dtHoSo.some(function (f) { return f.TAB_THONGTIN_ID == tab.ID; });
        });

        dataCoData.forEach((aData, nRow) => {
            html += '<div class="tab-item swiper-slide tabtinhtrang" id="' + aData.ID + '" name="tabtinhtrang">';
            html += '<a href="#">';
            html += '<i class="' + aData.TAB_THONGTIN_TENANH + '"></i>';
            html += '<p>' + aData.TAB_THONGTIN_TEN + '</p>';
            html += '</a>';
            html += '</div>';
        });
        $("#zoneTab").html(html);

        if (dataCoData.length > 0) {
            // Auto-click tab đầu tiên CÒN LẠI sau khi lọc
            $("#zoneTab [id=" + dataCoData[0].ID + "]").trigger("click");
        } else {
            // Không tab nào có field → xoá bảng + empty state
            me.dtTemp = [];
            $("#tblTuNhapHoSo").html(
                '<div class="tnhs-empty">' +
                '<span class="empty-ic"><i class="fal fa-inbox"></i></span>' +
                '<h4>Kế hoạch này chưa có nhóm thông tin nào để nhập</h4>' +
                '<p>Vui lòng chọn kế hoạch khác hoặc liên hệ nhà trường.</p>' +
                '</div>'
            );
        }
    },
}
