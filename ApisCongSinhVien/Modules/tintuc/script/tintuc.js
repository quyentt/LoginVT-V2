function TinTuc() { };
TinTuc.prototype = {
    strDaoTao_CoCauToChuc_Id: '',
    dtTinTuc: [],
    dtTinTucDaLuu: [],
    strTinTuc_Id: '',
    init: function () {
        var me = this;
        //try {
        //    function encrypted(input, strkey) {
        //        if (!strkey) {
        //            var date = new Date(Date.now());
        //            strkey = "" + date.getFullYear() + (date.getMonth() + 1);
        //        }
        //        var key = Array.from(strkey);
        //        var output = [];
        //        for (var i = 0; i < input.length; i++) {
        //            var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
        //            output.push(String.fromCharCode(charCode));
        //        }
        //        return btoa(output.join(""));
        //    }
        //    function decrypted(input, strkey) {
        //        input = atob(input);
        //        if (!strkey) {
        //            var date = new Date(Date.now());
        //            strkey = "" + date.getFullYear() + (date.getMonth() + 1);
        //        }
        //        var key = Array.from(strkey);;
        //        var output = [];

        //        for (var i = 0; i < input.length; i++) {
        //            var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
        //            output.push(String.fromCharCode(charCode));
        //        }
        //        return output.join("");
        //    }


        //    var encrypted1 = encrypted("vanhieptn95@gmail.com");
        //    console.log("Encrypted:" + encrypted1);

        //    var decrypted1 = decrypted('c11CV01LRHJyA25AWlVXX1VfaE5XUm51SVtDHGVMU15 TW1aWWZGWFF VVxQV10cdWl7Hx0=');
        //    console.log("Decrypted:" + decrypted1);
        //} catch(ex) {

        //}
        //return;
        

        me.getList_NguonTin();
        me.getList_TinTuc();
        me.getList_DanhDau();
        
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $(".btnSearch, .btnSearchIcon").click(function () {
            $("#zonetintuc").html("");
            me.getList_TinTuc();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        edu.system.pickerdate("input-datepicker");
        $("#zonetintuc").delegate('.bantin', 'click', function () {
            //var strLink = $(this).attr("href");
            //if (strLink) window.open(strLink);
            me.toggle_form_input();
            var strId = this.id;
            me.strTinTuc_Id = strId;
            me.getList_TinTuc_ChiTiet(strId);
            me.save_DaXem(strId);
        });
        $("#zonetintuc").delegate('.news-group-more', 'click', function (e) {
            e.preventDefault();
            var $group = $(this).closest('.news-group');
            var expanded = $group.data('expanded') === true;
            $group.data('expanded', !expanded);
            $group.find('.news-group-item.is-hidden').toggleClass('d-none', expanded);
            var hiddenCount = $(this).data('hidden');
            $(this).text(expanded ? 'Xem thêm (' + hiddenCount + ')' : 'Thu gọn');
        });
        $("#tindanhdau").delegate('.bantin', 'click', function () {
            //var strLink = $(this).attr("href");
            //if (strLink) window.open(strLink);
            me.toggle_form_input();
            var strId = this.id;
            me.strTinTuc_Id = strId;
            me.getList_TinTuc_ChiTiet(strId);
            me.save_DaXem(strId);
        });
        $("#zoneDonVi").delegate('.nav-new-item', 'click', function (e) {
            e.preventDefault();
            $("#zoneDonVi .nav-new-item").removeClass("active");
            $(this).addClass("active");
            me.strDaoTao_CoCauToChuc_Id = this.id || '';
            me.getList_TinTuc();
        });

        $("#btnLuuDanhDau").click(function () {
            me.save_DanhDau();
        });

        $("#btntindaluu").click(function () {
            //me.delete_DanhDau();
        });
        $("#btnGuiTin").click(function () {
            me.save_TinNhan();
        });

        var dateSearchTimer = null;
        var kwSearchTimer = null;
        $("#txtSearch_TuKhoa").on("input", function () {
            clearTimeout(kwSearchTimer);
            kwSearchTimer = setTimeout(function () {
                me.filter_TinTuc_ClientSide();
            }, 250);
        });
        $("#txtSearch_TuNgay, #txtSearch_DenNgay").on("input", function () {
            clearTimeout(dateSearchTimer);
            dateSearchTimer = setTimeout(function () {
                me.getList_TinTuc();
            }, 400);
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.filter_TinTuc_ClientSide();
            }
        });
        $("#txtNoiDungTinNhan").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.save_TinNhan();
            }
        });
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zonetintuc");
        $("#zoneFilter").show();
        if ($("#tindanhdau").children().length > 0) {
            $("#zonetindadanhdau").show();
            $("#zoneMainNews").removeClass("col-lg-12").addClass("col-lg-9");
        } else {
            $("#zoneMainNews").removeClass("col-lg-9").addClass("col-lg-12");
        }
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "newsdetail");
        $("#zoneFilter").hide();
        $("#zonetindadanhdau").hide();
        $("#zoneMainNews").removeClass("col-lg-9").addClass("col-lg-12");
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/

    getList_NguonTin: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4BRIFLi8XKAI0LyYCIDEPJjQuLwPP',
            'func': 'pkg_tintuc.LayDSDonViCungCapNguon',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_NguonTin(dtReRult, data.Pager);
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
    genTable_NguonTin: function (data, iPager) {
        data.forEach(e => {
            $("#zoneDonVi").append('<a href="#" class="nav-new-item" id="' + e.ID +'">' + edu.util.returnEmpty(e.TEN) +'</a>');
        });
    },
    getList_TinTuc: function () {
        var me = this;
        console.log(main_doc.DashBoard);
        if (main_doc && main_doc.DashBoard && main_doc.DashBoard.objTinTuc) {
            var objTinTuc = main_doc.DashBoard.objTinTuc;
            me.strTinTuc_Id = objTinTuc.ID;
            me.getList_TinTuc_ChiTiet(objTinTuc.ID);
            me.save_DaXem(me.strTinTuc_Id);
            me.toggle_form_input();
            main_doc.DashBoard = {};
        } else {
            if ($("#newsdetail").is(":visible")) {
                me.toggle_notify();
            }
        }
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4PJjQuKAU0LyYP',
            'func': 'pkg_tintuc.LayDSTinTuc_BangTin_NguoiDung',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strChuyenMuc_Id': '',
            'strChung_UngDung_Id': edu.system.appId,
            'dTinQuanTrong': -1,
            'strDaoTao_CoCauToChuc_Id': me.strDaoTao_CoCauToChuc_Id,
            'dHieuLuc': 1,
            'pageIndex': 1,
            'pageSize': 50,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var hasAlias = typeof edu.system.change_alias === 'function';
                    dtReRult.forEach(function (e) {
                        var tieude = (e.TIEUDE || '').toLowerCase();
                        var donvi = (e.DAOTAO_COCAUTOCHUC_TEN || '').toLowerCase();
                        e._tieude_lc = tieude;
                        e._donvi_lc = donvi;
                        e._tieude_alias = hasAlias ? edu.system.change_alias(tieude) : tieude;
                        e._donvi_alias = hasAlias ? edu.system.change_alias(donvi) : donvi;
                    });
                    me.dtTinTuc = dtReRult;
                    me.filter_TinTuc_ClientSide();
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

    getList_TinTuc_ChiTiet: function (strTinTuc_BangTin_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4FSgvFTQiHgMgLyYVKC8eAikoFSgkNQPP',
            'func': 'pkg_tintuc.LayTinTuc_BangTin_ChiTiet',
            'iM': edu.system.iM,
            'strTinTuc_BangTin_Id': strTinTuc_BangTin_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var objTinTuc = Array.isArray(data.Data) ? data.Data[0] : data.Data;
                    if (objTinTuc) {
                        me.viewForm_TinTuc(objTinTuc);
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

    filter_TinTuc_ClientSide: function () {
        var me = this;
        var strTuKhoa = (edu.util.getValById('txtSearch_TuKhoa') || '').trim().toLowerCase();
        if (!strTuKhoa) {
            me.genTable_TinTuc(me.dtTinTuc);
            return;
        }
        var hasAlias = typeof edu.system.change_alias === 'function';
        var strKhoaKhongDau = hasAlias ? edu.system.change_alias(strTuKhoa) : strTuKhoa;
        var filtered = me.dtTinTuc.filter(function (e) {
            return (e._tieude_lc && e._tieude_lc.indexOf(strTuKhoa) !== -1)
                || (e._donvi_lc && e._donvi_lc.indexOf(strTuKhoa) !== -1)
                || (e._tieude_alias && e._tieude_alias.indexOf(strKhoaKhongDau) !== -1)
                || (e._donvi_alias && e._donvi_alias.indexOf(strKhoaKhongDau) !== -1);
        });
        me.genTable_TinTuc(filtered);
    },

    classify_TinTuc: function (item) {
        var hasAlias = typeof edu.system.change_alias === 'function';
        // Uu tien 1: CHUYENMUC (ghep MA + TEN de bat ca ma tat va ten day du)
        var cmRaw = ((item.CHUYENMUC_MA || '') + ' ' + (item.CHUYENMUC_TEN || '')).trim();
        if (cmRaw) {
            var cm = hasAlias ? edu.system.change_alias(cmRaw.toLowerCase()) : cmRaw.toLowerCase();
            if (/hdsv|hoat dong sinh vien|hoat dong sv/.test(cm)) return 'hoatdongsv';
            if (/tdt|tin dao tao|dao tao|khao thi/.test(cm)) return 'daotao';
            if (/ttnt|nha truong|thong bao chung/.test(cm)) return 'nhatruong';
            return 'nhatruong';
        }
        // Fallback: doan theo ten don vi dang tin (tin chua gan chuyen muc)
        var donvi = item._donvi_alias || (item.DAOTAO_COCAUTOCHUC_TEN || '').toLowerCase();
        if (/cthssv|cong tac (hoc sinh )?sinh vien|doan thanh nien|hoi sinh vien|sinh vien/.test(donvi)) return 'hoatdongsv';
        if (/dao tao|khao thi/.test(donvi)) return 'daotao';
        return 'nhatruong';
    },
    genHtml_NewsGroup: function (ten, items, preview) {
        var html = '<div class="news-group">';
        html += '<div class="news-group-header">';
        html += '<span class="news-group-title">' + ten + '</span>';
        var hiddenCount = items.length - preview;
        if (hiddenCount > 0) {
            html += '<a href="#" class="news-group-more" data-hidden="' + hiddenCount + '">Xem thêm (' + hiddenCount + ')</a>';
        }
        html += '</div>';
        html += '<div class="news-group-body">';
        if (!items.length) {
            html += '<div class="news-group-empty">';
            html += '<i class="fal fa-inbox"></i>';
            html += '<span>Chưa có tin nào</span>';
            html += '</div>';
        } else {
            items.forEach(function (e, idx) {
                var hiddenCls = idx >= preview ? ' is-hidden d-none' : '';
                var strNgay = (e.NGAYBATDAU || '').toString().trim();
                html += '<div class="news-group-item bantin' + hiddenCls + '" id="' + e.ID + '">';
                html += '<div class="news-group-item-icon"><i class="fas fa-thumbtack"></i></div>';
                html += '<div class="news-group-item-content">';
                html += '<div class="news-group-item-title">' + edu.util.returnEmpty(e.TIEUDE) + '</div>';
                if (strNgay) {
                    html += '<div class="news-group-item-meta">';
                    html += '<span><i class="fal fa-calendar-alt"></i>' + strNgay + '</span>';
                    html += '</div>';
                }
                html += '</div>';
                html += '</div>';
            });
        }
        html += '</div></div>';
        return html;
    },
    genTable_TinTuc: function (data) {
        var me = this;
        $("#zonetintuc").html('');
        if (!data || data.length === 0) {
            $("#zonetintuc").html(me.genHtml_EmptyState("Hiện tại chưa có tin tức nào", "fal fa-newspaper"));
            return;
        }

        var groups = { nhatruong: [], daotao: [], hoatdongsv: [] };
        data.forEach(function (e) {
            var cat = me.classify_TinTuc(e);
            groups[cat].push(e);
        });

        var PREVIEW_MAIN = 15;
        var PREVIEW_SIDE = 6;

        var html = '<div class="tintuc-grid">';
        html += '<div class="tintuc-main">';
        html += me.genHtml_NewsGroup('Tin đào tạo', groups.daotao, PREVIEW_MAIN);
        html += '</div>';
        html += '<div class="tintuc-side">';
        html += me.genHtml_NewsGroup('Tin nhà trường', groups.nhatruong, PREVIEW_SIDE);
        html += me.genHtml_NewsGroup('Hoạt động sinh viên', groups.hoatdongsv, PREVIEW_SIDE);
        html += '</div>';
        html += '</div>';
        $("#zonetintuc").append(html);
    },
    viewForm_TinTuc: function (data) {
        var me = this;
        //view data --Edit
        var strNoiDung = data.NOIDUNG + '<div class="author mb-4">' + edu.util.returnEmpty(data.NGUOITAO_TENDAYDU) + '</div>';
        edu.util.viewHTMLById("newstitle", data.TIEUDE);
        edu.util.viewHTMLById("newscoso", data.DAOTAO_COCAUTOCHUC_TEN);
        edu.util.viewHTMLById("newsngay", data.NGAYBATDAU);
        edu.util.viewHTMLById("newscontent", strNoiDung);

        me.checkDaLuu();
        me.getList_TinNhan();

        edu.system.viewFiles("txtFileDinhKem", data.ID, "SV_Files");
    },
    
    save_TinTuc: function (strTinTuc_BangTin_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/FSkkLB4VKC8VNCIeAyAvJhUoLx4NNC41GSQs',
            'func': 'pkg_tintuc.Them_TinTuc_BangTin_LuotXem',
            'iM': edu.system.iM,
            'strTinTuc_BangTin_Id': strTinTuc_BangTin_Id,
            'strDiaChiMayTram': edu.util.getValById('txtAAAA'),
            'strTrinhDuyetSuDungTruyCap': edu.util.getValById('txtAAAA'),
            'strTenThietBi': edu.util.getValById('txtAAAA'),
            'strThoiGianMayTram': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
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

    save_DaXem: function (strTinTuc_BangTin_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/FSkkLB4VKC8VNCIeAyAvJhUoLx4NNC41GSQs',
            'func': 'pkg_tintuc.Them_TinTuc_BangTin_LuotXem',
            'iM': edu.system.iM,
            'strTinTuc_BangTin_Id': strTinTuc_BangTin_Id,
            'strDiaChiMayTram': edu.util.getValById('txtAAAA'),
            'strTrinhDuyetSuDungTruyCap': edu.util.getValById('txtAAAA'),
            'strTenThietBi': edu.util.getValById('txtAAAA'),
            'strThoiGianMayTram': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

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
    save_DanhDau: function (strTinTuc_BangTin_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/FSkkLB4VKC8VNCIeAyAvJhUoLx4NNDQVMzQP',
            'func': 'pkg_tintuc.Them_TinTuc_BangTin_LuuTru',
            'iM': edu.system.iM,
            'strTinTuc_BangTin_Id': me.strTinTuc_Id,
            'strNguoiDung_Id': edu.system.userId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Lưu thành công");
                    me.getList_DanhDau();
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

    getList_DanhDau: function () {
        var me = this;
        
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4NNDQVMzQP',
            'func': 'pkg_tintuc.LayDSTinTuc_BangTin_LuuTru',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTinTuc_BangTin_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDung_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 200,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTinTucDaLuu = dtReRult;
                    me.genTable_DanhDau(dtReRult, data.Pager);
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

    genHtml_EmptyState: function (message, icon) {
        var iconClass = icon || "fal fa-inbox";
        return ''
            + '<div class="col-12" style="text-align:center; padding:36px 16px;">'
            + '<div style="display:inline-block; padding:18px 28px; background:#fafbff; border:1px dashed #d9deeb; border-radius:14px; color:#7a8499;">'
            + '<i class="' + iconClass + '" style="font-size:42px; color:#b8c0d4; display:block; margin-bottom:8px;"></i>'
            + '<div style="font-size:14px;">' + message + '</div>'
            + '</div>'
            + '</div>';
    },
    genTable_DanhDau: function (data) {
        var me = this;
        var html = '';
        $("#tindanhdau").html('');
        if (data.length > 0) {
            $("#zonetindadanhdau").show();
            $("#zoneMainNews").removeClass("col-lg-12").addClass("col-lg-9");
        } else {
            $("#zonetindadanhdau").hide();
            $("#zoneMainNews").removeClass("col-lg-9").addClass("col-lg-12");
        }
        me.checkDaLuu();
        data.forEach(e => {
            //var strLink = edu.system.apiUrlTemp + '/congsinhvien/Pages/thread.aspx?id=' + e.ID + '&name=' + edu.system.change_alias(e.TIEUDE);

            html += '<div class="col-12 col-md-6 col-lg-12 bantin" id="' + e.TINTUC_BANGTIN_ID +'" style="cursor: pointer">';
            html += '<div class="news-item">';
            html += '<a href="#" class="image-z image">';
            html += '<img src="' + edu.system.getRootPathImg(e.DUONGDANANHHIENTHI) + '" alt="">';
            html += '</a>';
            html += '<div class="news-item-right">';
            html += '<a>';
            html += edu.util.returnEmpty(e.TIEUDE);
            html += '</a>';
            html += '<div class="meta">';
            html += '<a class="cate-link" href=""><i class="fas fa-caret-right me-1"></i><span>' + edu.util.returnEmpty(e.DAOTAO_COCAUTOCHUC_TEN) + '</span></a>';
            html += '<p class="mb-0 ms4"><i class="fal fa-calendar-alt me-1"></i><span>' + edu.util.returnEmpty(e.NGAYBATDAU) + '</span></p>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        $("#tindanhdau").append(html);
    },
    checkDaLuu: function () {
        var me = this;
        if (me.strTinTuc_Id) {
            var objCheckDaLuu = me.dtTinTucDaLuu.find(e => e.ID == me.strTinTuc_Id);
            if (objCheckDaLuu) {
                $("#btntindaluu").show();
                $("#btnLuuDanhDau").hide();
            } else {
                $("#btntindaluu").hide();
                $("#btnLuuDanhDau").show();
            }
        }
    },
    
    save_TinNhan: function () {
        var me = this;
        var obj_notify = {};
        if ($("#txtNoiDungTinNhan").val() == "") return;
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/FSkkLB4VKC8VNCIeAyAvJhUoLx4DKC8pDTQgLwPP',
            'func': 'pkg_tintuc.Them_TinTuc_BangTin_BinhLuan',
            'iM': edu.system.iM,
            'strTinTuc_BangTin_Id': me.strTinTuc_Id,
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNoiDung': edu.util.getValById('txtNoiDungTinNhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_TinNhan();
                    $("#txtNoiDungTinNhan").val("");
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

    getList_TinNhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_TinTuc_MH/DSA4BRIVKC8VNCIeAyAvJhUoLx4DKC8pDTQgLwPP',
            'func': 'pkg_tintuc.LayDSTinTuc_BangTin_BinhLuan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTinTuc_BangTin_Id': me.strTinTuc_Id,
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 200,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_BinhLuan(dtReRult, data.Pager);
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

    genTable_BinhLuan: function (data) {
        var me = this;
        var html = '';
        $("#lblTongBinhLuan").html('Bình luận (' + data.length + ')');
        $("#commented").html('');
        data.forEach(e => {
            //var strLink = edu.system.apiUrlTemp + '/congsinhvien/Pages/thread.aspx?id=' + e.ID + '&name=' + edu.system.change_alias(e.TIEUDE);

            html += '<div class="comment-item">';
            html += '<img src="assets/images/avata.png">';
            html += '<div class="right">';
            html += '<p>';
            html += '<b>' + edu.util.returnEmpty(e.NGUOIDUNG_TENDAYDU) +'</b> ' + edu.util.returnEmpty(e.NOIDUNG);
            html += '</p>';
            html += '<div class="meta">';
            html += '<p class="mb-0 ms4"><i class="fal fa-calendar-alt me-1"></i><span>' + edu.util.returnEmpty(e.NGAYTAO) +'</span></p>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        $("#commented").append(html);
    },
}