/*----------------------------------------------
--Author: nxduong
--Phone: 0983029603
--Description:
--Date of created: 13/09/2016
--Updated by: nnthuong & tvhiep
--Date of updated: 06/06/2018
----------------------------------------------*/
// [AUTO-THU-VAI][early] Nếu tab mới mở để thủ vai SV mà URL còn hash cũ (do browser clone khi window.open) → replace URL sạch ngay, không cho bất cứ flow nào đọc hash cũ. Chạy sớm nhất khi script load.
(function () {
    try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('pendingThuVaiSV') && window.location.hash) {
            console.log('[AUTO-THU-VAI][early] có pending + hash =', window.location.hash, '→ location.replace URL sạch');
            window.location.replace(window.location.pathname + window.location.search);
        }
    } catch (ex) { console.error('[AUTO-THU-VAI][early] err', ex); }
})();
function systemroot() { }
systemroot.prototype = {
    userId: null,
    langId: null,
    rootPath: '',
    rootPathUpload: '',
    rootPathReport: '',
    folderAvatar: '',
    folderDoc: '',
    appId: '',
    clientIP: '',
    browsername: '',
    appCode: '',
    apiUrl: null,
    apiUrlTemp: null,
    ctPlacehoder: '',
    pageIndex_default: 1,
    pageSize_default: 10,
    button_adress: null,
    urllocal: '',
    combonode: '',
    treenode: '',
    icolumn: 0,
    arrId: [],
    arrMulFileUp: [],
    node_submenu: '',
    arrMenu_HasChild: [],
    dataCache: [],
    strChucNang_Id: '',
    dtChucNang: [],
    pathChucNang: '',
    // Cổng Help: {functionId} = ID chức năng; v=1 = giao diện cũ (bản _v2 gửi v=2). Để rỗng = không hiện nút "?"
    strHelpUrl: 'https://con98.api-apis.com/help-master/mo?ma={functionId}&v=1',
    tokenJWT: '',
    flag_alert: false,
    iSoLuong: 0,
    iGioiHanLuong: 10,
    flag_luong: false,
    arrtask: [],
    objLog: {},
    objApi: {},
    arrcheckcontent: [],
    arrStt: [],
    strhost: '',
    viMessageMap: {
        "du lieu khong hop le": "Dữ liệu không hợp lệ",
        "du lieu khong ton tai": "Dữ liệu không tồn tại",
        "thanh cong": "Thành công",
        "luu thanh cong": "Lưu thành công",
        "xoa thanh cong": "Xóa thành công",
        "loi he thong": "Lỗi hệ thống",
        "loi khi luu du lieu": "Lỗi khi lưu dữ liệu",
        "loi khi xoa du lieu": "Lỗi khi xóa dữ liệu",
        "khong co quyen": "Không có quyền",
        "khong co quyen truy cap": "Không có quyền truy cập",
        "khong co du lieu": "Không có dữ liệu",
        "khong tim thay du lieu": "Không tìm thấy dữ liệu",
        "vui long chon doi tuong": "Vui lòng chọn đối tượng",
        "vui long chon doi tuong?": "Vui lòng chọn đối tượng?",
        "vui long chon du lieu": "Vui lòng chọn dữ liệu",
        "ban co chac chan luu du lieu khong?": "Bạn có chắc chắn lưu dữ liệu không?",
        "ban co chac chan xoa du lieu khong?": "Bạn có chắc chắn xóa dữ liệu không?",
        "ban chua dang nhap": "Bạn chưa đăng nhập",
        "phien lam viec da het han": "Phiên làm việc đã hết hạn"
    },
    strlogouturl:'',
    iNewLogin: '1',
    //Chỗ biến này chỉ dùng cho load bảng động
    strTempValue: 0,//Thay đổi dữ liệu sẽ lưu xuống db: trên giao diện nhập từng ô input trong bảng: onfocus sẽ gán temp, outfocus sẽ check với strTemp để lưu
    iLuuDon: 0,//Chia trường hợp lưu từng ô một hoặc có nút cập nhật trên cùng sẽ lưu toàn bộ nội dung bên trong bảng
    socket: null,

    // ─── [THU-VAI-PERSIST] Giữ phiên thủ vai qua reload F5 ───────────────────
    // Trạng thái thủ vai (userId + currentThuVai) mặc định chỉ nằm trong RAM →
    // reload mất. 3 hàm dưới persist vào sessionStorage (per-tab, đóng tab tự mất).
    //   _saveThuVaiSession()   — gọi sau khi vào vai (chonNguoiDung + _autoThuVaiSV)
    //   _restoreThuVaiSession() — gọi đầu startApp, restore trước checkChucNang
    //   _thoatThuVai()         — click nút X trên card sidebar-thuvai-info
    _saveThuVaiSession: function () {
        var me = this;
        if (!me.currentThuVai || !me.userId) return;
        try {
            sessionStorage.setItem('thuvai', JSON.stringify({
                userIdGoc: me.strNguoiThucVai_Id || me.userId,
                userIdVai: me.userId,
                info: me.currentThuVai
            }));
            console.log('[thuvai] saved to sessionStorage:', me.currentThuVai);
        } catch (ex) { console.warn('[thuvai] save fail', ex); }
    },
    // F5 khi đang thủ vai → KHÔNG restore nữa (restore giữ được thẻ tên nhưng userId
    // bị ghi đè lại về cán bộ → API báo "Ma sinh vien khong ton tai"). Thay vào đó thoát
    // vai: xoá phiên thủ vai + chức năng đang mở + hash URL (initHashDeepLink trong
    // index.aspx đọc hash sẽ tự setUngDung lại) → về màn hình chọn vai trò.
    _restoreThuVaiSession: function () {
        var me = this;
        try {
            if (!sessionStorage.getItem('thuvai')) return;
            sessionStorage.removeItem('thuvai');
            sessionStorage.removeItem('strChucNang');
            sessionStorage.removeItem('strChucNang_Id');
            me.appId = null;
            me.strNguoiThucVai_Id = undefined;
            me.currentThuVai = null;
            if (window.location.hash && window.history && window.history.replaceState) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
            console.log('[thuvai] F5 khi đang thủ vai → thoát vai, về màn hình chính');
        } catch (ex) { console.warn('[thuvai] reset fail', ex); }
        //try {
        //    var str = sessionStorage.getItem('thuvai');
        //    if (!str) return;
        //    var tv = JSON.parse(str);
        //    if (tv && tv.userIdVai && tv.info) {
        //        me.strNguoiThucVai_Id = tv.userIdGoc;
        //        me.userId = tv.userIdVai;
        //        me.currentThuVai = tv.info;
        //        console.log('[thuvai] restored from sessionStorage:', tv);
        //    }
        //} catch (ex) { console.warn('[thuvai] restore fail', ex); }
    },
    _thoatThuVai: function () {
        try {
            sessionStorage.removeItem('thuvai');
            sessionStorage.removeItem('strChucNang');
            sessionStorage.removeItem('strChucNang_Id');
        } catch (ex) {}
        // Bỏ hash để initHashDeepLink không tự vào lại cổng SV
        window.location.replace(window.location.pathname + window.location.search);
    },

    startApp: function () {
        var me = this;
        me._restoreThuVaiSession();
        me.objApi = Init_API();
        me.ctPlacehoder = constant.setting.initsystem.content_placehoder;
        me.pageIndex = constant.setting.initsystem.page_index;
        me.pageSize = constant.setting.initsystem.page_size;
        window.addEventListener('offline', function (e) { me.alert(edu.constant.getting("LABLE", "OFFLINE")); });
        window.addEventListener('online', function (e) { me.alert(edu.constant.getting("LABLE", "ONLINE")); });
        $("#txtSearch_Fun").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#menu_vertical .treeview").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        //search html for Apps(modules) 
        $("#txtSearch_App").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblApp tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        //get dtcache
        if (typeof Storage !== "undefined") {
            me.dataCache = me.getCache_LocalStore("dataCache");
        }
        $(document).delegate(".btnEdit", "click", function () {
            $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
            $(".btnOpenDelete").show();
            $(".zoneOpenNew").hide();
        });
        $(document).delegate(".btnAdd", "click", function () {
            $(".myModalLabel").html('<i class="fa fa-plus"></i> Thêm mới - ');
            $(".btnOpenDelete").hide();
            $(".zoneOpenNew").show();
        });
        $(document).delegate('input', 'keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
            }
        });
        $(document).delegate('button', 'click', function (e) {
            e.preventDefault();
        });
        $(document).delegate('.btn', 'click', function (e) {
            var x = $(this);
            if (x.attr("data-toggle") == "dropdown") return;
            var point = this;
            this.classList.add("btn-lg");
            var obj = {
                id: point.id,
                name: x.attr("name"),
                title: x.attr("title"),
                class: point.classList.toString(),
                tenhienthi: point.innerHTML.trim()
            };
            x.attr("data-loading-text", "<i class='fa fa-spinner fa-spin '></i>");
            x.button('loading');
            setTimeout(function () { x.button('reset'); point.classList.remove("btn-lg") }, 1000);
            me.makeLog("BUTTON", JSON.stringify(obj));
        });
        $(document).delegate('#btnYes', 'click', function (e) {
            me.makeLog("CONFIRM", $("#lblConfirmContent").html());
        });
        $(document).keydown(function (event) {
            if (event.ctrlKey) {
                switch (event.which) {
                    case 81: me.showReportAndImportTable(); break;
                    case 71: me.showReportAndImportTable_User(); break;
                    case 89: me.showAllId(); break;
                }
            }
        });

        $(document.body).on('hide.bs.modal,hidden.bs.modal', function () {
            $('body').css('padding-right', '0');
            $('body')[0].style.paddingRight = "0px !important";
        });
        //async Upload
        
        //if (typeof (UploadFile) != "function") {
        //    $(me.ctPlacehoder).append('<script src="' + me.rootPathUpload + '/Core/uploadfile.js?v=1.0.0.12"></script>');
        //    $(me.ctPlacehoder).append('<script src="' + me.rootPathUpload + '/Core/uploadavatar.js?v=1.0.0.11"></script>');
        //}
        
        //setTimeout(function () {
        //    if (AXYZCLRVN != undefined) {
        //        me.save_KiemTraThongBao();
        //        if (me.objApi["urlKhaoSat"]) me.save_KiemTraTaiKhoan();
        //    }
        //}, 1000);

        //async Node Chat async
        if (me.objApi.urlNode) {
            me.nodeChat(me.objApi.urlNode);
        }

        $(document).delegate('.chkSystemSelectAll', 'click', function (e) {
            var point = this.parentNode.parentNode.parentNode.parentNode;
            if (point.nodeName == "TABLE") {
                edu.util.checkedAll_BgRow(this, { table_id: point.id });
            }
        });
        $("#main-content-wrapper").delegate('.ungdung', 'click', function (e) {
            var strId = this.id;
            var objUngDung = me.dtUngDung.find(e => e.ID === strId);
            me.currentThuVai = null;
            if (objUngDung.CHOPHEPTHUVAI == 1) {
                me["strNguoiThucVai_Id"] = edu.system.userId;
                var strTenVaiTro = objUngDung.TENVAITRO || objUngDung.TENUNGDUNG || 'người dùng';
                var strHtmlForm = ''
                    + '<div style="text-align:left">'
                    + '  <div class="mb-2 fw-bold" style="font-size:14px;color:#1e3a8a"><i class="fa fa-user-graduate fa-solid"></i>&nbsp;&nbsp;Nhập thông tin định danh (' + strTenVaiTro + ')</div>'
                    + '  <div class="input-group mb-2" style="box-shadow:0 1px 3px rgba(0,0,0,.08);border-radius:6px">'
                    + '    <span class="input-group-text bg-light" style="padding-left:12px;padding-right:12px">'
                    + '      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><circle cx="9" cy="12" r="2.5"></circle><line x1="14" y1="10" x2="19" y2="10"></line><line x1="14" y1="14" x2="17" y2="14"></line></svg>'
                    + '    </span>'
                    + '    <input id="txtIDSinhVienCanVo" class="form-control" placeholder="Nhập ID / MSSV / Họ tên / Email..." autocomplete="off" />'
                    + '    <button class="btn btn-primary" id="btnTruyCapIDSinhVien" type="button" style="display:inline-flex;align-items:center;gap:8px;white-space:nowrap">'
                    + '      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
                    + '      <span>Tìm kiếm</span>'
                    + '    </button>'
                    + '  </div>'
                    + '  <div id="divGoiY"></div>'
                    + '</div>'
                    + '<div id="divKQTimSinhVien" style="margin-top:12px;text-align:left"></div>';
                edu.system.alert(strHtmlForm);
                $("#myModalAlert .modal-dialog").addClass("modal-lg");

                var hideGoiY = function () { $("#divGoiY").html(''); };
                var renderGoiYDropdown = function (items) {
                    if (!items.length) return hideGoiY();
                    var html = '<div style="background:#fff;border:1px solid #dee2e6;border-radius:6px;max-height:260px;overflow-y:auto;margin-bottom:8px">';
                    items.forEach(function (r, i) {
                        var ten = r.FULLNAME || r.ten || '';
                        var ma = r.NAME || r.ma || '';
                        var email = r.EMAIL || r.email || '';
                        html += ''
                            + '<div class="goiy-item" data-idx="' + i + '" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid #f1f3f5">'
                            + '  <div style="font-weight:600;color:#1e3a8a;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + ten + '</div>'
                            + '  <div style="font-size:11px;color:#6c757d"><span style="font-family:monospace">' + ma + '</span>' + (email ? ' • ' + email : '') + '</div>'
                            + '</div>';
                    });
                    html += '</div>';
                    $("#divGoiY").html(html);
                    $(".goiy-item").hover(
                        function () { $(this).css('background', '#eff6ff'); },
                        function () { $(this).css('background', '#fff'); }
                    );
                    $(".goiy-item").click(function () {
                        var idx = parseInt($(this).data('idx'), 10);
                        chonNguoiDung(items[idx]);
                    });
                };

                var chonNguoiDung = function (record) {
                    edu.system.userId = record.ID || record.Id || record.id;
                    edu.system.currentThuVai = {
                        ten: record.FULLNAME || record.HOTEN || record.HoTen || record.ten || '',
                        ma: record.NAME || record.MSSV || record.MA || record.ma || '',
                        email: record.EMAIL || record.Email || record.email || '',
                        tenVaiTro: strTenVaiTro
                    };
                    edu.system._saveThuVaiSession();
                    $("#myModalAlert").modal("hide");
                    me.setUngDung(objUngDung);
                };

                var timerGoiY = null;
                var goiYSuggest = function (keyword) {
                    var obj_save = {
                        'action': 'CMS_QuanTri02_MH/CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP',
                        'func': 'PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh',
                        'iM': edu.system.iM,
                        'strThongTinDinhDanh': keyword,
                        'strNguoiThucHien_Id': edu.system.userId,
                        'strVaiTroDangNhap_Id': objUngDung.ID,
                        'strChucNangHeThong_Id': objUngDung.ID,
                        'strHanhDong_Code': '',
                    };
                    me.makeRequest({
                        success: function (data) {
                            if ($("#txtIDSinhVienCanVo").val().trim() !== keyword) return;
                            if (!data.Success) return hideGoiY();
                            var rs = [];
                            if (data.Data && data.Data.rs) rs = data.Data.rs;
                            else if (Array.isArray(data.Data)) rs = data.Data;
                            renderGoiYDropdown(rs);
                        },
                        error: function () { hideGoiY(); },
                        type: 'POST',
                        action: obj_save.action,
                        contentType: true,
                        data: obj_save,
                        fakedb: []
                    }, false, false, false, null);
                };

                $("#txtIDSinhVienCanVo").on('input', function () {
                    clearTimeout(timerGoiY);
                    var v = $(this).val().trim();
                    if (v.length < 2) { hideGoiY(); return; }
                    timerGoiY = setTimeout(function () { goiYSuggest(v); }, 350);
                });
                $("#txtIDSinhVienCanVo").on('focus', function () {
                    var v = $(this).val().trim();
                    if (v.length >= 2) goiYSuggest(v);
                });
                $("#txtIDSinhVienCanVo").on('blur', function () {
                    setTimeout(hideGoiY, 200);
                });
                $("#divGoiY").on('mousedown', function (e) { e.preventDefault(); });
                var renderBangKetQua = function (rs, title, offset, footerHtml) {
                    var html = ''
                        + '<div class="alert alert-info py-2 px-3 mb-2" style="font-size:13px;border-left:3px solid #0d6efd">'
                        + '  <i class="fa fa-info-circle fa-solid"></i>&nbsp;&nbsp;' + title
                        + '</div>'
                        + '<div style="max-height:380px;overflow-y:auto;border:1px solid #dee2e6;border-radius:6px">'
                        + '<table class="table table-hover table-striped align-middle mb-0" style="font-size:13px">'
                        + '  <thead class="table-light" style="position:sticky;top:0;z-index:1">'
                        + '    <tr>'
                        + '      <th style="width:42px;text-align:center">#</th>'
                        + '      <th>Họ tên</th>'
                        + '      <th style="width:130px">Mã</th>'
                        + '      <th>Email</th>'
                        + '    </tr>'
                        + '  </thead><tbody>';
                    rs.forEach(function (r, i) {
                        var ten = r.FULLNAME || r.HOTEN || r.HoTen || '';
                        var ma = r.NAME || r.MSSV || r.MA || '';
                        var email = r.EMAIL || r.Email || '';
                        html += ''
                            + '<tr class="rowNguoiDungChon" data-idx="' + i + '" style="cursor:pointer">'
                            + '  <td style="text-align:center;color:#6c757d">' + (offset + i + 1) + '</td>'
                            + '  <td><i class="fa fa-user-circle fa-solid text-primary"></i>&nbsp;&nbsp;<b>' + ten + '</b></td>'
                            + '  <td><span class="badge bg-secondary" style="font-family:monospace">' + ma + '</span></td>'
                            + '  <td class="text-muted">' + email + '</td>'
                            + '</tr>';
                    });
                    html += '</tbody></table></div>';
                    if (footerHtml) html += footerHtml;
                    $("#divKQTimSinhVien").html(html);
                    $(".rowNguoiDungChon").click(function () {
                        var idx = parseInt($(this).data('idx'), 10);
                        chonNguoiDung(rs[idx]);
                    });
                };
                var showError = function (msg) {
                    $("#divKQTimSinhVien").html('<div class="alert alert-warning py-2 px-3 mb-0" style="font-size:13px"><i class="fa fa-exclamation-triangle fa-solid"></i>&nbsp;&nbsp;' + msg + '</div>');
                };
                $("#btnTruyCapIDSinhVien").click(function () {
                    var strThongTinDinhDanh = $("#txtIDSinhVienCanVo").val();
                    if (!strThongTinDinhDanh) {
                        showError('Vui lòng nhập thông tin định danh!');
                        return;
                    }
                    var obj_save = {
                        'action': 'CMS_QuanTri02_MH/CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP',
                        'func': 'PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh',
                        'iM': edu.system.iM,
                        'strThongTinDinhDanh': strThongTinDinhDanh,
                        'strNguoiThucHien_Id': edu.system.userId,
                        'strVaiTroDangNhap_Id': objUngDung.ID,
                        'strChucNangHeThong_Id': objUngDung.ID,
                        'strHanhDong_Code': '',
                    };
                    me.makeRequest({
                        success: function (data) {
                            if (!data.Success) {
                                showError(data.Message || 'Có lỗi xảy ra!');
                                return;
                            }
                            var rs = [];
                            if (data.Data && data.Data.rs) rs = data.Data.rs;
                            else if (Array.isArray(data.Data)) rs = data.Data;
                            if (!rs || rs.length == 0) {
                                showError('Không tìm thấy ' + strTenVaiTro + ' phù hợp!');
                                return;
                            }
                            if (rs.length == 1) {
                                chonNguoiDung(rs[0]);
                                return;
                            }
                            renderBangKetQua(rs, 'Tìm thấy <b>' + rs.length + '</b> kết quả — click vào 1 dòng để chọn', 0, '');
                        },
                        error: function (er) {
                            showError(JSON.stringify(er));
                        },
                        type: 'POST',
                        action: obj_save.action,
                        contentType: true,
                        data: obj_save,
                        fakedb: []
                    }, false, false, false, null);
                });
                return;
            } else {
                me["strNguoiThucVai_Id"] = undefined;
            }
            me.setUngDung(objUngDung);
            
        });

        $("#main-content-wrapper").delegate('.chucnang', 'click', function (e) {
            var strId = this.id;
            me.triggerChucNang_Id(strId);
        });

        $(document).delegate(".refeshlogo", "click", function () {
            me.appId = "";
            sessionStorage.removeItem('strChucNang');
            sessionStorage.removeItem('strChucNang_Id');
            location.reload();
        });
        $(document).delegate(".refeshtrangchu", "click", function () {
            //me.appId = "";
            //localStorage.removeItem('strChucNang');
            sessionStorage.removeItem('strChucNang_Id');
            location.reload();
        });
        

        $(document).delegate(".sidebar-menu-item", "click", function () {
            try {
                var pointcheck = $(".sidebar-menu")[0]
                var x = checkScrollBar(pointcheck, 'vertical');
                if (x) {
                    var point = $(this).find('div a:last-child')[0];
                    if (point && point.offsetTop > window.innerHeight) {
                        setTimeout(function () {
                            pointcheck.scrollTop = point.offsetTop - pointcheck.offsetTop;
                        }, 200)

                    }
                }
            } catch {

            }
            
            
        });
        function checkScrollBar(element, dir) {
            dir = (dir === 'vertical') ?
                'scrollTop' : 'scrollLeft';

            var res = !!element[dir];

            if (!res) {
                element[dir] = 1;
                res = !!element[dir];
                element[dir] = 0;
            }
            return res;
        }
        
        setTimeout(function () {
            if (me.strhost.indexOf("https") == 0) {
                me["isActive"] = true;
                window.onblur = function () {
                    me["isActive"] = false;
                };
                window.onfocus = function () {
                    me["isActive"] = true;
                    me.versionMainJS();
                    // me.versionPageJS();
                };
                checkChangeversionJS();
                function checkChangeversionJS() {
                    setTimeout(function () {
                        me.versionMainJS();
                        // checkChangeversionJS();
                    }, 300000)
                }
            }
        }, 1000);
        
        


        

        var x = jQuery.ajax({
            type: "GET",
            dataType: "jsonp",
            url: "https://jsonip.com",
            global: false,
            success: function (response, b, c, d) {
                me.clientIP = response.ip;
            },
            error: function (response, b, c, d, e) {
                me.clientIP = response.ip;
            }
        });

        var strModal = '';
        strModal += '<div class="modal-content">';
        strModal += '<div class="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:10px 20px; background:#f8f9fa; border-bottom:1px solid #dee2e6;">';
        strModal += '<div class="finance-user-info in-modal" style="display:flex; align-items:center; gap:15px; margin:0; flex:1;">';
        strModal += '<p style="margin:0; font-size:16px; font-weight:600; color:#212529;"><i class="fa fa-file-pdf-o" style="color:#dc3545; margin-right:6px;"></i>Báo cáo</p>';
        strModal += '<a class="btn btn-primary btn-sm" id="btnDownloadFileBaoCao" title="" href="javascript:void(0)" style="display:inline-flex; align-items:center; gap:6px;"><i class="fa fa-cloud-download"></i> Tải file</a>';
        strModal += '</div>';
        strModal += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
        strModal += '</div>';
        strModal += '<div class="modal-body" id="modal_body" style="padding:0;"></div>';
        strModal += '<div class="modal-footer">';
        strModal += '<button type="button" class="btn btn-default" data-bs-dismiss="modal"><i class="fa fa-times-circle-o"></i> <span class="lang" key="">Đóng</span></button>';
        strModal += '</div>';
        strModal += '</div>';
        $(me.ctPlacehoder).after('<div id="modalBaoCao"  class="modal fade finance-modal my-calendar confirm_scores" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog" style="width: ' + (window.screen.width - 60) + 'px;max-width: ' + (window.screen.width - 60) + 'px">' + strModal + '</div></div>');
    },
    setSessionUser: function () {
        
        
    },
    page_load: function () {
        var me = this;
        // Force dropdownParent = body de popup select2 khong bi clip boi container cha
        // co overflow/stacking context. Fix bug dropdown bi an sau row ke tiep trong form.
        $(".select-opt").select2({ dropdownParent: $(document.body) });
        //$(".select-opt-img").select2({
        //    templateResult: me.formatState
        //});
        ////$(document).delegate('.input-datepicker', 'blur', function () {
        ////    var point = this;
        ////    var strdate = point.value;
        ////    if (!edu.util.dateValid(point.value)) {
        ////        point.value = "";
        ////        point.placeholder = "dd/mm/yyyy";
        ////    }
        ////});
        //edu.util.resetchkSelect();
        //me.getList_HangDoi({}, "", "", "");
        //me.getList_NgonNgu();
        //reset all alert
        $("#alert").html('');
        $(".modal-backdrop").remove();
        /*Start Cấu hình curency*/
        //$('[data-ax5formatter]').ax5formatter();
        $(document).delegate('input', 'keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
            }
        });
        me.pickerdate();

        
        
    },
    /*
     *************************************************************************
     ********* orde: [1] *****************************************************
     ********* name: KHOI HAM XU LY CHUNG ************************************
     ********* disc: *********************************************************
     *************************************************************************
    */
    makeRequest: function (params, inc_user, inc_code, inc_lang, container, urlService, block) {
        var op = params;
        var me = this;
        //1. checking...
        var onSuccess = function () { };
        if (op.hasOwnProperty('success')) {
            if (typeof op.success === 'function') {
                onSuccess = op.success;
            }
        }
        //2. checking...
        var onError = function () { };
        if (op.hasOwnProperty('error')) {
            if (typeof op.error === 'function') {
                onError = op.error;
            }
        }
        if (block != true) {
            if (me.iSoLuong > me.iGioiHanLuong || me.flag_luong == true) {
                if (me.arrtask.indexOf(params) !== 0) me.arrtask.push(params);
                if (me.flag_luong == false) me.fixThreading();
                return;
            }
        }
        var dataPost = op.data;
        var strtokenJWT = 'Bearer ' + me.tokenJWT;
        //7. check API version
        var strKeySwitch = op.action.substring(0, op.action.indexOf("_"));
        var strUrl = me.apiUrlTemp + me.objApi[strKeySwitch] + '/' + op.action;
        if (me.objApi[strKeySwitch].indexOf("http") === 0) {
            strUrl = me.objApi[strKeySwitch] + '/' + op.action;
            //strtokenJWT = undefined;
        }
        me.iSoLuong++;
        if (me.iSoLuong == 1) document.getElementById('overlay').style.display = "";
        if (!dataPost.strChucNang_Id) dataPost["strChucNang_Id"] = edu.system.strChucNang_Id;
        if (!dataPost.strNguoiThucHien_Id) dataPost["strNguoiThucHien_Id"] = edu.system.userId;
        if (!dataPost.strVaiTroDangNhap_Id) dataPost["strVaiTroDangNhap_Id"] = edu.system.appId;
        if (!dataPost.strChucNangHeThong_Id) dataPost["strChucNangHeThong_Id"] = edu.system.strChucNang_Id;
        dataPost["strNguoiThucVai_Id"] = edu.system.strNguoiThucVai_Id;
        //AzzMH
        let dtShow = dataPost;
        if (dataPost.iM) {
            op.type = "POST";
            dataPost = { 'A': AE(JSON.stringify(dataPost), op.action.substring(op.action.indexOf("/") + 1)) }; 
        }
        var objRequet = {
            type: op.type,
            crossDomain: true,
            url: strUrl,
            data: dataPost,
            cache: false,
            dataType: constant.setting.method.DATA_TYPE,
            contentType: op.contentType2,
            success: function (d, s, x) {
                me.iSoLuong--;
                if (me.iSoLuong == 0) {
                    //document.getElementById('overlay').style.display = "none";
                    $("#overlay").hide();
                    //if (me["CheckDangNhap"]) { 
                    //    alert("Tài khoản đã đăng nhập ở nơi khác hoặc phiên đăng nhập đã hết hạn. Hãy đăng nhập lại!");
                    //    location.href = me.strlogouturl;
                    //}
                }
                var result = d;
                if (result) {
                    try {
                        if (result.Data && result.Data.B) {
                            let dtA = AD(result.Data.B, op.data.iM);
                            result.Data = JSON.parse(dtA);
                            onSuccess(result);
                        } else {
                            onSuccess(result);
                        }
                        // Log mọi request/response — TẮT theo yêu cầu 11/09/2026.
                        // Bật lại: bỏ comment 3 dòng dưới (điều kiện gốc giữ nguyên,
                        // gồm localStorage "iShk" = "true" và IP 14.232.210.131).
                        if ((me["iShk"] || me.clientIP == "14.232.210.131") && dtShow.iM) {
                            dtShow["data"] = result;
                            console.log(dtShow)
                        }
                    } catch (ex) {
                        onSuccess(result);
                    }
                }
            },
            error: function (x, t, m) {
                me.iSoLuong--;
                if (x.status === 401) {
                    me["CheckDangNhap"] = true;
                }
                if (me.iSoLuong == 0) {
                    //document.getElementById('overlay').style.display = "none";
                    $("#overlay").hide();
                    if (me["CheckDangNhap"]) { 
                        alert("Tài khoản đã đăng nhập ở nơi khác hoặc phiên đăng nhập đã hết hạn. Hãy đăng nhập lại!");
                        
                        location.href = me.strlogouturl
                    }
                }

                onError(x);
            },
            complete: function (x, t, m) {


                if (op.hasOwnProperty('complete')) {
                    if (typeof op.complete == 'function') {
                        op.complete(x, t);
                    }
                }
            },
            async: op.async,
            timeout: op.timeout !== undefined ? op.timeout : 3000000
        }
        if (me.tokenJWT) objRequet["headers"] = { 'Authorization': strtokenJWT };
        $.ajax(objRequet);
        //if (op.type === "POST") me.makeLog("POST", JSON.stringify(dataPost));
    },
    makeLog: function (strHanhDong, strMoTa) {
        var me = this;
        //if (strHanhDong != "LOGSYS") return;
        //return;
        //switch (strHanhDong) {
        //    case "VAOCHUCNANG": {
        //        if (me.socket) {
        //            me.socket.emit("client-vao-chucnang", { strChucNang_Id: me.strChucNang_Id, strDuongDanFile: strMoTa });
        //        }
        //    }; break;
        //}
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: me.objApi.urlNode + "/LuuCacThongTinHoatDong",
            dataType: constant.setting.method.DATA_TYPE,
            contentType: 'application/json',
            data: JSON.stringify({
                'strDonVi': me.objApi.DonVi,
                'strChucNang_Id': me.strChucNang_Id,
                'strUngDung_Id': me.appId,
                'strNguoiDung_Id': me.userId,
                'strHoatDong': strHanhDong,
                'strDiaChiMayTramTruyCap': me.clientIP,//me.objLog.myip,
                'strTrinhDuyetSuDungTruyCap': me.browsername,//me.objLog.brower,
                'strTaiKhoanDangNhap': '',
                'strThoiGianMayTram': '',
                'strTenThietBi': navigator.userAgent,
                'strMoTa': strMoTa,
            }),
            cache: false,
        });
    },
    fixThreading: function () {
        var me = this;
        rnBlock();
        me.flag_luong = true;

        function rnBlock() {
            while (me.arrtask.length > 0) {
                if (me.iSoLuong < me.iGioiHanLuong) {
                    var dtTemp = me.arrtask.shift();
                    me.makeRequest(dtTemp, false, false, null, null, "", true);
                }
                else {
                    setTimeout(function () {
                        rnBlock();
                    }, 200);
                    return;
                }
            }
            me.flag_luong = false;
        }
    },
    /*
    -- author:
    -- discription: loading global
    -- date: 
    */
    beginLoading: function () {
        //document.getElementById('overlay').style.display = "";
    },
    endLoading: function () {
        //document.getElementById('overlay').style.display = "none";
    },
    beginLoadings: function () {
        document.getElementById('overlay').style.display = "";
    },
    endLoadings: function () {
        document.getElementById('overlay').style.display = "none";
    },
    /*
    -- author:
    -- discription:  Hiển thị loadding khi click button
    -- date: 
    */
    buttonLoading: function (iTimeOut) {
        var me = this;
        if (iTimeOut == undefined) iTimeOut = 10000;
        $('.btnwaitsucces').on('click', function () {
            var x = $(this);
            if (me.button_adress) {
                me.button_adress.button('reset');
            }
            me.button_adress = x;
            this.classList.add("btn-lg");
            x.attr("data-loading-text", "<i class='fa fa-spinner fa-spin '></i> Đang gửi");
            x.button('loading');
            setTimeout(function () { me.button_adress.button('reset'); }, iTimeOut);
        });
    },
    buttonEndLoading: function () {
        if (this.button_adress) this.button_adress.button('reset');
    },
    /*
    -- author: 
    -- discription: load html page
    -- date: 
    */
    initMain: function (strDisplayedPath, strRootPath, strChucNang_Id) {
        var me = this;
        console.log('[AUTO-THU-VAI][initMain] call — strDisplayedPath =', strDisplayedPath, '| strRootPath =', strRootPath, '| strChucNang_Id =', strChucNang_Id, '| pending =', localStorage.getItem('pendingThuVaiSV'));
        console.trace('[AUTO-THU-VAI][initMain] stack');
        if (!strChucNang_Id) {
            var temp = me.dtChucNang.find(e => e.DUONGDANFILE == strRootPath);
            if (temp) strChucNang_Id = temp.ID;
            else strChucNang_Id = "";
        }
        if (strRootPath && strRootPath.indexOf('http') == 0) {
            window.open(strRootPath, "_blank");
        }
        me.strChucNang_Id = strChucNang_Id;
        var objChucNang = me.dtChucNang.find(e => e.ID === strChucNang_Id);
        if (objChucNang) {
            me.appCode = objChucNang.MAUNGDUNG
            me.rootPathReport = objChucNang.TENFILEDINHKEM;
            sessionStorage.setItem("strChucNang_Id", objChucNang.ID);
            let strTenAnh = objChucNang.TENANH? objChucNang.TENANH.trim() : "";
            // [SPA-MIGRATE] Whitelist module da rewrite HTML theo SPA-native style
            // (dung .card, .myTab, .input-label-left, assets/css-new/styles.css).
            // Duong dan trong list -> bo qua redirect sang indexi.aspx, load inline vao
            // #main-content-wrapper cua index.aspx. Khi migrate xong 1 module, add path
            // vao day. Long-term: update TENANH trong DB tu "fa fa-x" sang "fa-light fa-x"
            // de tu dong trigger SPA khong can whitelist.
            var arrSpaWhitelist = [
                '/nhapchuyencan/html/nhaptheolop.html',
                '/lichgiang/html/lichgiangnhieuphonghoc.html'
            ];
            var isWhitelisted = arrSpaWhitelist.some(function (p) {
                return strRootPath && strRootPath.toLowerCase().indexOf(p.toLowerCase()) >= 0;
            });
            if (isWhitelisted) {
                console.log('[SPA-MIGRATE] load in SPA shell:', strRootPath);
            } else if ((objChucNang.DUONGDANFILE && strTenAnh && strTenAnh.indexOf('fa ') == 0)) {
                location.href = "./indexi.aspx"
            }
            $("#sidebar-menu .active").removeClass('active');
            if (objChucNang.CHUCNANGCHA_ID) {
                document.getElementById("chucnang" + strChucNang_Id).classList.add("active");
                document.getElementById("chucnang" + objChucNang.CHUCNANGCHA_ID).parentNode.classList.add("active");
            }
            else {
                document.getElementById("chucnang" + strChucNang_Id).parentNode.classList.add("active");
            }
        }
        $(window).scrollTop(1);
        me.pageIndex_default = 1;
        me.pageSize_default = 10;
        var m = "";
        //if (strRootPath == undefined || strRootPath == null) {
        //    strRootPath = localStorage.strRootPath;
        //}
        if (strDisplayedPath == undefined || strDisplayedPath == null) {
            var hash = window.location.hash, hashArr = hash.split('/'), params = [];

            if (hashArr.length > 1) {
                for (var i = 0; i < hashArr.length; i++) {
                    params.push(hashArr[i]);
                }
            }
            if (params != undefined && params != "") {
                m = params[0];
            }
            else {
                m = "#" + window.location.hash.substr(1);
            }
        }
        else {
            m = strDisplayedPath;
        }
        var path = m;
        location.href = path;
        //if (typeof (Storage) !== "undefined") {
        //    if (strRootPath != undefined || strRootPath != null) {
        //        try {
        //            localStorage.setItem("strRootPath", strRootPath);

        //        } catch(ex) {
        //            localStorage.clear();
        //        }
        //    }
        //}
        me.loadFunctionPath(strRootPath);
        
    },
    checkPermissionByUser: function (userName, strDisplayedPath, strRootPath) {
        var me = this;
        // bỏ
        //me.makeRequest({
        //    success: function (data) {
        //        if (data.Success) {
        //            me.init(FunctionUrl);
        //        }
        //        else {
        //            $(me.ctPlacehoder).html("");
        //            $(me.ctPlacehoder).html("<div class='IMSNotesWrapper'>Bạn không có quyền truy cập chức năng này!</div>");
        //        }
        //    },
        //    error: function (er) {
        //        $(me.ctPlacehoder).html("");
        //        $(me.ctPlacehoder).html("<div class='IMSNotesWrapper'>Bạn không có quyền truy cập chức năng này!</div>");
        //    },
        //    action: 'NguoiDung/checkPermissionByUser',
        //    data: {
        //        'userName': userName,
        //        'functionPath': strDisplayedPath
        //    },
        //    fakedb: [
        //    ]
        //}, false, false, false, null);
    },
    loadFunctionPath: function (strRootPath) {
        var me = this;
        var main_place = me.ctPlacehoder;
        var urlPage = strRootPath;
        //do
        $(main_place).html("");
        me["strTypeCheckFile"] = "";
        if (main_place == null || main_place == "" || main_place == undefined) {
            main_place = constant.setting.initsystem.content_placehoder;
        }
        if (urlPage != null && urlPage != "") {
            //$(main_place).fadeOut('slow').load(strRootPath).fadeIn('slow', );
            me.loadPage($(main_place), strRootPath, function () {
                //check existance path
                if ($(main_place).children("div").length <= 0) {
                    return false;
                }
            }, null, me.appCode);
            // $(main_place).fadeOut('slow').load(strRootPath).fadeIn('slow', function () {
            //     //check existance path
            //     if ($(main_place).children("div").length <= 0) {
            //         return false;
            //     }
            // });

        }
        else {
            $(main_place).html("<div class='IMSNotesWrapper'>Chức năng chưa được kích hoạt!</div>");
        }


    },

    /*--------------------------------------
    -- author: tvhiep
    -- discription: Sửa lại hàm load $(main_place).load(strRootPath)
    -- date:  13/11/2018
    -- Mục đích: chống cache bằng cách cộng thêm version cho file .html và file .js
    */
    loadPage: function (self, url, params, callback, appCode) {
        var me = this;
        //if (!appCode) appCode = me.appCode;
        var selector, type, response,
            off = url.indexOf(" ");

        me["urlPage"] = url;
        EditUrlHtml();
        if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
        }

        // If it's a function
        if (jQuery.isFunction(params)) {

            // We assume that it's the callback
            callback = params;
            params = undefined;

            // Otherwise, build a param string
        } else if (params && typeof params === "object") {
            type = "POST";
        }

        // If we have elements to modify, make the request
        if (self.length > 0) {
            jQuery.ajax({
                url: url,

                // If "type" variable is undefined, then "GET" method will be used.
                // Make value of this field explicit since
                // user can override it through ajaxSetup method
                type: type || "GET",
                dataType: "html",
                data: params
            }).done(function (responseText) {
                me["urlPageLength"] = responseText.length;
                responseText = EditUrlJS(responseText);
                // Save response for use in complete callback
                response = arguments;
                self.html(responseText);
                me.page_load();
                if (me.strChucNang_Id != "") me.genPath_ChucNang();
                if (!me["isPageCheckRun"]) { checkChangeHtml(); me["isPageCheckRun"] = true; }
                // If the request succeeds, this function gets "data", "status", "jqXHR"
                // but they are ignored because response was set above.
                // If it fails, this function gets "jqXHR", "status", "error"
            }).always(callback && function (jqXHR, status) {
                self.each(function () {
                    callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
                });
            });
        }
        //Cộng thêm version cho file html
        function EditUrlHtml() {
            url = me.rootPath + "/" + appCode + url;
            var newVersion = "v=" + randomInt(4) + "." + randomInt(4) + "." + randomInt(4) + "." + randomInt(4);
            if (url.indexOf('?') != -1) {
                url += "&" + newVersion
            }
            else {
                url += "?" + newVersion;
            }
        }

        function EditUrlJS(strData) {
            var newVersion = "?v=" + randomInt(4) + "." + randomInt(4) + "." + randomInt(4) + "." + randomInt(4);
            var iStart = 0;
            while (1) {
                var ivitri = strData.indexOf("<script", iStart);
                if (ivitri == -1) break;
                iStart = ivitri + 5;
                var strSrc = strData.substring(iStart, strData.indexOf(">", iStart));
                if (strSrc.indexOf('src="') != -1) {
                    strSrc = strSrc.substring(strSrc.indexOf('src="') + 5);
                    var ivitrijs = strSrc.indexOf(".js") + 3;
                    var strVersion = strSrc.substring(ivitrijs, strSrc.indexOf('"', ivitrijs));
                    if (strVersion == "" || strVersion == undefined) {
                        var strNewSrc = appCode + "/" + strSrc.substring(0, ivitrijs) + '"';
                    }
                    else {
                        var strNewSrc = appCode + "/" + strSrc.replace(strVersion, newVersion);
                    }
                    strData = strData.replace(strSrc, strNewSrc);
                }
                else {
                    continue;
                }
            }
            return strData;
        }

        function randomInt(len, charSet) {
            charSet = charSet || '0123456789';
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }

        function checkChangeHtml() {
            setTimeout(function () {
                me.versionPageJS();
                checkChangeHtml();
            }, 300000)
        }
    },
    /*--------------------------------------
    -- author: tvhiep
    -- discription: Xủ lý upload nhiều filea
    -- date:  13/10/2018
    */
    uploadFiles: function (arrZoneId, strFolderExtend, callback) {
        //in html: <div id="uploadFile_PN"></div>
        //in html: <div id="zoneHienThiFIle"></div>
        //in js: edu.system.uploadImage(["uploadFile_PN"], "");
        //edu.system.uploadImage(["uploadFile_PN:zoneHienThiFIle"], "");
        //Nếu có dấu : tức là sẽ có tùy chọn zone hiển thị riêng không sử dụng mặc định nữa
        //callback sẽ gồm 2 tham số: strId == arrZoneId[i], danh sách tên file trả về. Mỗi khi thêm hoặc xóa file đều gọi callback
        //Danh sách tên file trả về mặc định lưu ở textarea id="txtFiles" + arrZoneId[i]
        //in html: <div id="uploadPicture_PN"></div>
        //in js: edu.system.singleFileUp(["uploadPicture_PN"], "");
        //if (typeof (UploadFile) != "function") {
        //    //var newVersion = "v=" + randomInt(4) + ".0.0.1";
        //    $(me.ctPlacehoder).append('<script src="' + me.rootPathUpload + '/Core/uploadfile.js"></script>');
        //    setTimeout(function () {
        //        me.uploadFiles(arrZoneId, strFolderExtend, callback);
        //    }, 100);
        //    return;
        //}
        var me = this;
        UploadFile(arrZoneId, me.appCode, me.folderDoc, strFolderExtend, callback);
        //function randomInt(len, charSet) {
        //    charSet = charSet || '0123456789';
        //    var randomString = '';
        //    for (var i = 0; i < len; i++) {
        //        var randomPoz = Math.floor(Math.random() * charSet.length);
        //        randomString += charSet.substring(randomPoz, randomPoz + 1);
        //    }
        //    return randomString;
        //}
    },
    uploadAvatar: function (arrZoneId, strFolderExtend, callback, iWidth, iHeight) {
        var me = this;
        //if (typeof (UploadAvatar) != "function") {

        //    //var newVersion = "v=" + randomInt(4) + ".0.0.1";
        //    $(me.ctPlacehoder).append('<script src="' + me.rootPathUpload + '/Core/uploadavatar.js"></script>');
        //    setTimeout(function () {
        //        me.uploadAvatar(arrZoneId, strFolderExtend, callback, iWidth, iHeight);
        //    }, 100);
        //    return;
        //}
        if (!edu.util.checkValue(iWidth)) iWidth = 336;
        if (!edu.util.checkValue(iHeight)) iHeight = 448;
        UploadAvatar(arrZoneId, me.appCode, me.folderAvatar, strFolderExtend, callback, iWidth, iHeight);
        //function randomInt(len, charSet) {
        //    charSet = charSet || '0123456789';
        //    var randomString = '';
        //    for (var i = 0; i < len; i++) {
        //        var randomPoz = Math.floor(Math.random() * charSet.length);
        //        randomString += charSet.substring(randomPoz, randomPoz + 1);
        //    }
        //    return randomString;
        //}
    },
    uploadImport: function (arrZoneId, callback) {
        //in html: <div id="uploadFile_PN"></div>
        //in html: <div id="zoneHienThiFIle"></div>
        //in js: edu.system.uploadImage(["uploadFile_PN"], "");
        //edu.system.uploadImage(["uploadFile_PN:zoneHienThiFIle"], "");
        //Nếu có dấu : tức là sẽ có tùy chọn zone hiển thị riêng không sử dụng mặc định nữa
        //callback sẽ gồm 2 tham số: strId == arrZoneId[i], danh sách tên file trả về. Mỗi khi thêm hoặc xóa file đều gọi callback
        //Danh sách tên file trả về mặc định lưu ở textarea id="" + arrZoneId[i]
        //in html: <div id="uploadPicture_PN"></div>
        //in js: edu.system.singleFileUp(["uploadPicture_PN"], "");
        var me = this;
        var strModule_Name = "";
        var strFolderExtend = "";
        var strLinkUpload = "";
        var strOutFolderPath = "Upload/File/";
        if (!edu.util.checkValue(strFolderExtend)) {
            strFolderExtend = "";
        }
        if (!edu.util.checkValue(arrZoneId)) {
            return false;
        }
        //Kiểm tra id file có tồn tại không
        for (var i = 0; i < arrZoneId.length; i++) {
            var temp = arrZoneId[i];
            //Nếu file chứa dấu : kiểm tra xem có tồn tại id đó không
            if (temp.indexOf(":") != -1) {
                if (document.getElementById(temp.substring(0, temp.indexOf(":"))) == undefined) {
                    continue;
                }
            }
            else {
                if (document.getElementById(temp) == undefined) {
                    continue;
                }
            }
        }
        var arrMulFileUp = [];// Mảng 2 chiều [["newFileName1", "FileName2"],["newFileName1", "FileName2"]]
        var loadFileSuccess = 0; //Lưu tình trạng tải file: 0 có thể gửi, 1 đang tải file đính kèm lên server, 2 đã hoàn thành tải file lên server
        //Thêm thư viện
        //var row = "";
        //row += '<link href="' + strLinkUpload + 'Core/jquery-ui.structure.min.css" rel="stylesheet" />';
        //row += '<link href="' + strLinkUpload + 'Core/jquery-ui.theme.min.css" rel="stylesheet" />';
        //$(me.ctPlacehoder).append(row);
        uploadFile(arrZoneId);

        function uploadFile(arrFile) {
            for (var i = 0; i < arrFile.length; i++) {
                var elementId = arrFile[i];
                var strZoneFileDinhKem = "";
                //Nếu file chứa dấu : tức là có zone upload riêng
                if (elementId.indexOf(":") != -1) {
                    strZoneFileDinhKem = elementId.substring(elementId.indexOf(":") + 1);
                    elementId = elementId.substring(0, elementId.indexOf(":"));
                }
                else {
                    strZoneFileDinhKem = "zoneFileDinhKem" + elementId;
                }
                var row = "";
                row += '<input id="divupload' + elementId + '" type="image" src="' + me.rootPathUpload + '/Core/images/file_add.png" value="Upload" />';
                //row += '<input id="uploader' + elementId + '" type="file" style="display: none">';
                row += '<textarea id="' + elementId + '" style="display: none"></textarea>';
                row += '<div class="clear"></div>';
                row += '<div id="zoneFileDinhKem' + elementId + '"></div>';
                row += '<div class="clear"></div>';
                row += ' <div id="progress-bar' + elementId + '" style="position: relative; display: none">';
                row += '<span id="progressbar-label' + elementId + '" style="position: absolute; left: 0%; top: 20%;">Please Wait...</span>';
                row += '</div>';
                $("#" + elementId).replaceWith("<div id='zoneFileUp" + elementId + "'>" + row + "</div>");
                //Sự kiện khi nhấn 

                var strUuid = edu.util.uuid();
                $("#divupload" + elementId).click(function (e) {
                    e.preventDefault();
                    me.viewFiles(elementId, "");
                    $("#uploader" + strUuid).remove();
                    strUuid = edu.util.uuid();
                    $("#zoneFileUp" + elementId).append('<input id="uploader' + strUuid + '" type="file" style="display: none">');
                    document.getElementById("uploader" + strUuid).addEventListener("change", function () {
                        upLoadFiles(elementId, strZoneFileDinhKem, strUuid);
                    });
                    $("#uploader" + strUuid).trigger("click");
                });

                //document.getElementById("uploader" + elementId).addEventListener("change", function () {
                //    upLoadFiles(elementId, strZoneFileDinhKem);
                //});

                //Sự kiến xóa file khi click vào nút xóa tại mỗi ô file upload
                $(document).delegate(".btnDeleteFileUp" + elementId, "click", function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    var point = this;
                    var pointNode = point.parentNode;
                    $(pointNode).remove();
                });
            }
        }

        function upLoadFiles(elementId, strZoneUp, strUuid) {
            //Cập nhật trạng thái đang up file
            loadFileSuccess = 1;
            var uploadedFiles = $('#uploader' + strUuid)[0].files;
            //Chứa danh sách tên file cho lần upload hiện tại trên giao diện
            var arrFileName = [];
            //Lấy lại danh sách file bao gồm file lưu dưới db và tên file hiển thị
            arrMulFileUp = getDSFile(elementId);
            //Chỉnh sửa lại arrMulFileUp
            //Số file select trên giao diện
            if (uploadedFiles.length > 0) {
                var formData = new FormData();
                //Kiểm tra sự trùng lặp file khi upload
                for (var i = 0; i < uploadedFiles.length; i++) {
                    var icheck = true;
                    for (var j = 0; j < arrMulFileUp.length; j++) {
                        //Kiểm tra dự vào file name
                        if (uploadedFiles[i].name == arrMulFileUp[j][1]) icheck = false;
                    }
                    if (icheck) {
                        //Kiểm tra đuôi file
                        var strFileName = uploadedFiles[i].name;
                        var vitri = strFileName.lastIndexOf(".");
                        var strExtensionFile = strFileName.substring(vitri + 1);
                        var strCheck = checkFileImport(strExtensionFile);
                        if (strCheck == "") {
                            me.alert("File <b>" + strFileName + "</b> không hợp lệ!", 'w');
                            return;
                        }
                        formData.append(strFileName, uploadedFiles[i]);
                        arrFileName.push(strFileName);
                    }
                }
            }
            else {
                me.alert("Bạn chưa chọn file nào!", 'w');
                return;
            }
            //Kiểm tra nếu không có new file thoát ra
            if (arrFileName.length <= 0) {
                me.alert("Không có file nào mới!", 'w');
                return;
            }

            var progressbarLabel = $('#progressbar-label' + elementId);
            var progressbarDiv = $('#progress-bar' + elementId);
            $.ajax
                ({
                    url: me.rootPath + "/Handler/up_fileImport.ashx?outFolderPath=" + strOutFolderPath,
                    method: 'POST',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (response) {
                        //

                        //Cập nhật trạng thái load thành công
                        loadFileSuccess = 2;
                        //Thông báo lỗi khi response trả về có chứa "Loi System"
                        if (response.indexOf('Loi System') != -1) {
                            me.alert(response, 'w');
                            return;
                        }
                        progressbarLabel.text('Tải lên server thành công!', 'w');
                        if (arrFileName.length > 1) {
                            var arrfile = response.split(",");
                            if (arrfile.length != arrFileName.length) {
                                me.alert("File đính kèm không hợp lệ. Vui lòng thử lại", "w");
                                return;
                            }
                            for (var i = 0; i < arrfile.length; i++) {
                                arrMulFileUp.push([arrfile[i], arrFileName[i]]);
                            }
                        }
                        else {
                            if (arrFileName.length > 0) arrMulFileUp = [[response, arrFileName[0]]];
                        }
                        //Hiển thị lại danh sách
                        viewFileDinhKem(elementId, strZoneUp);
                        progressbarDiv.fadeOut(2000);
                    },
                    error: function (err) {
                        loadFileSuccess = 2;
                        me.alert(err.statusText);
                    }
                });
            progressbarLabel.text('Vui lòng chờ đợi...');
            progressbarDiv.progressbar({
                value: false
            }).fadeIn(1000);
        }

        function viewFileDinhKem(elementId, strZoneUp) {
            $("#" + strZoneUp).html("");
            var row = '';
            var strColor = "";
            var strFileStyle = "";
            var strFileStyleNew = "";
            for (var i = 0; i < arrMulFileUp.length; i++) {
                //Hiện thị hình ảnh đuôi mở rộng
                var strFileName = arrMulFileUp[i][1];
                var strFileNameInStorage = arrMulFileUp[i][0];
                vitri = strFileNameInStorage.lastIndexOf(".");
                var strExtensionFile = strFileNameInStorage.substr(vitri + 1, strFileNameInStorage.length);

                strColor = "black";
                strFileStyle = "fa fa-file";
                strFileStyleNew = "fa fa-file";

                switch (strExtensionFile.trim()) {
                    case "jpg":
                    case "png":
                    case "jpeg":
                    case "gif":
                        strFileStyle = "fa fa-file-image-o";
                        strFileStyleNew = "fal fa-file-image";
                        strColor = "pink";
                        break;
                    case "doc":
                    case "docx":
                        strFileStyle = "fa fa-file-word-o";
                        strFileStyleNew = "fal fa-file-word";
                        strColor = "blue";
                        break;
                    case "xls":
                    case "xlsx":
                        strFileStyle = "fa fa-file-excel-o";
                        strFileStyleNew = "fal fa-file-excel";
                        strColor = "green";
                        break;
                    case "pdf":
                        strFileStyle = "fa fa-file-pdf-o";
                        strFileStyleNew = "fal fa-file-pdf";
                        strColor = "red";
                        break;
                    case "rar":
                        strFileStyle = "fa fa-file-archive-o";
                        strFileStyleNew = "fa fa-file-archive";
                        strColor = "purple";
                        break;
                }
                if (strExtensionFile === "jpg" || strExtensionFile === "png" || strExtensionFile === "png" || strExtensionFile === "png") {
                    pictureUp = me.rootPathUpload + "/" + strFileNameInStorage;
                    row += '<div class="file-upload" style="cursor: pointer">';
                    row += '<img class="upload-img" name="' + strFileNameInStorage + '" src="' + pictureUp + '"/>';
                }
                else {
                    row += '<div class="file-upload file-data"  style="cursor: pointer">';
                    row += '<a class="file-w-e upload-file"  name="' + strFileNameInStorage + '"><i class="' + strFileStyleNew + '"></i>';
                    row += '<span class="upload-file"  name="' + strFileNameInStorage + '">' + strFileName + '</span></a>';
                }
                row += '<a class="btn btn-default btn-delete-file btnDeleteFileUp' + elementId + '" name="' + elementId + '" title="' + strFileNameInStorage + '" filename="' + strFileName + '" href="#"><i class="fa-regular fa-xmark"></i></a>';
                row += '</div>';


                
            }
            $("#" + strZoneUp).append(row);
            outThongTinDinhKem(elementId);
        }

        function outThongTinDinhKem(elementId) {
            var row = "";
            var x = document.getElementsByClassName("btnDeleteFileUp" + elementId);
            for (var i = 0; i < x.length; i++) row += x[i].title + ",";
            row = row.substring(0, row.length - 1);
            row = row.replace(/\\/g, '\\\\');//Khac ban chinh
            $("#" + elementId).val(row);
            if (typeof (callback) == 'function') {
                callback(elementId, row, loadFileSuccess);
            }
        }

        function getDSFile(elementId) {
            var arrTemp = [];
            var x = document.getElementsByClassName("btnDeleteFileUp" + elementId);
            for (var i = 0; i < x.length; i++) {
                var point = x[i];
                arrTemp.push([$(point).attr("title"), $(point).attr("filename")]);
            }
            return arrTemp;
        }

        function checkFileImport(extention) {
            extention = extention.toLowerCase();
            //Kiểm tra những file được phép đi xuống
            //Dưới file server cũng check lại như vậy
            var check = "";
            var strTypeOfFile = "";
            check += ".xls.xlsx.doc.docx";//".csv.doc.docx.djvu.odp.ods.odt.pps.ppsx.ppt.pptx.pdf.ps.eps.rtf.txt.wks.wps.xls.xlsx.xps.svg";// định dạng text
            if (check.indexOf('.' + extention) != -1) strTypeOfFile = "text";
            //else {
            //    check = ".7z.zip.rar.jar.tar.tar.gz.cab";// định dạng file nén
            //    if (check.includes('.' + extention)) strTypeOfFile = "file";
            //    else {
            //        check = ".bmp.exr.gif.ico.jp2.jpeg.pbm.pcx.pgm.png.ppm.psd.tiff.tga.jpg";// định dạng ảnh
            //        if (check.includes('.' + extention)) strTypeOfFile = "picture";
            //        //else {
            //        //    check = ".3gp.avi.flv.m4v.mkv.mov.mp4.mpeg.ogv.wmv.webm";// định dạng video
            //        //    if (check.includes('.' + extention)) strTypeOfFile = "video";
            //        //    else {
            //        //        check = ".aac.ac3.aiff.amr.ape.au.flac.m4a.mka.mp3.mpc.ogg.ra.wav.wma";// định dạng audio
            //        //        if (check.includes('.' + extention)) strTypeOfFile = "audio";
            //        //        else {
            //        //            check = ".chm.epub.fb2.lit.lrf.mobi.pdb.rb.tcr";// định dạng sách
            //        //            if (check.includes('.' + extention)) strTypeOfFile = "book";
            //        //        }
            //        //    }
            //        //}
            //    }
            //}
            return strTypeOfFile;
        }
    },
    viewFiles: function (strZoneId, strDuLieu_Id, strApi, callback) {
        var me = this;
        ////Load file nếu chưa tồn tại
        //if (typeof (UploadFile) != "function") {
        //    setTimeout(function () {
        //        getList_File();
        //    }, 500);
        //}
        //else {
        //    getList_File();
        //}
        //Xóa trắng vùng hiển thị nếu nhập sai dữ liệu
        if (!edu.util.checkValue(strDuLieu_Id)) {
            viewFile(strZoneId, "");
            return;
        }
        if (strApi == undefined) {
            return;
        }
        getList_File();
        //
        $(document).delegate(".btnDelUploadedFile", "click", function (e) {
            if (strApi == undefined) return;
            e.stopImmediatePropagation();
            var strId = $(this).attr("name");
            var strFileName = $(this).attr("title");
            me.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                delete_File(strId, strFileName);
            });
        });

        function getList_File() {

            var obj_detail = {
                'action': strApi + '/LayDanhSach',

                'strDuLieu_Id': strDuLieu_Id
            };
            //
            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var json = data.Data;
                        if (json != null) {
                            viewFile(strZoneId, json, callback);
                        }
                    }
                    
                },
                error: function (er) {  },
                type: "GET",
                action: obj_detail.action,
                
                contentType: true,
                
                data: obj_detail,
                fakedb: []
            }, false, false, false, null);
        }
        function delete_File(strIds, strFileNames) {
            //--Edit
            var obj_delete = {
                'action': strApi + '/Xoa',
                
                'strIds': strIds,
                'strNguoiThucHien_Id': me.userId
            };
            //default
            
            me.makeRequest({
                success: function (data) {
                    deleteFiles(strFileNames);
                },
                error: function (er) {
                    me.alert(JSON.stringify(er));
                },
                type: "POST",
                action: obj_delete.action,
                
                contentType: true,
                
                data: obj_delete,
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    getRootPathImg: function (ImageName, imageType, isLocal) {
        //old_name getImageUrl ===> getRootPathImg
        var me = this;
        var urlRootUpload = me.rootPathUpload;
        var strDefault = "/Core/images/no-avatar.png";
        var strFileNotFound = "/Core/images/no-avatarfound.png";
        
        if (!edu.util.checkValue(ImageName)) {
            return urlRootUpload + strDefault;
        }
        else {
            //update vanhiep
            //Kiểm tra sự tồn tại của file
            var strUrl = "";
            //var x = $.ajax({
            //    url: edu.system.rootPathUpload + '/Handler/checkFileAvailable.ashx?strFileName=' + ImageName,
            //    method: 'post',
            //    async: false,
            //    success: function (data) {
            //        if (data == "404" || data == 404) {
            //            strUrl = urlRootUpload + strFileNotFound;
            //        } else {
            //            strUrl = urlRootUpload + "/" + ImageName;
            //        }
            //    }
            //});
            return urlRootUpload + "/" + ImageName;;
            //sử dụng trực tiếp không cần switch nữa
            //switch (imageType) {
            //    case constant.setting.EnumImageType.ACCOUNT:
            //        return urlRootUpload + "/" + me.appCode + "/" + me.folderAvatar + "/" + ImageName;
            //    case constant.setting.EnumImageType.DOCUMENT:
            //        return urlRootUpload + "/" + me.appCode + "/" + me.folderDoc + "/" + ImageName;
            //    default:
            //        return urlRootUpload + "/" + me.appCode + "/" + me.folderAvatar + "/" + "no-avatar.png";
            //}
        }
    },
    saveFiles: function (strZone, strDuLieu_Id, strApi, callback) {
        var me = this;
        //Kiểm tra tồn tại của id đầu vào
        if (document.getElementById(strZone) == undefined) {
            return;
        }
        //Kiểm tra xem đã truyền tên Controller chưa, nếu chưa sẽ lấy từ ...
        if (!edu.util.checkValue(strApi)) {
            var strNewApi = $("#" + strZone).attr(name);
            if (strNewApi != undefined) {
                strApi = strNewApi;
            }
        }
        //Lấy toàn bộ file chưa lưu (chưa có dữ liệu trong trường id)
        var item = $(".btnDeleteFileUp" + strZone + "[name ='']");
        if (item.length == 0) return;
        //Thực hiện lưu những file trong zone mà chưa lưu
        for (var i = 0; i < item.length; i++) {
            let strTenHienThi = $(item[i]).attr("filename");
            let strFileMinhChung = me.copyFile($(item[i]).attr("title"), strDuLieu_Id);
            var obj_save = {
                'action': strApi + '/ThemMoi',
               
                'strDuLieu_Id': strDuLieu_Id,
                'strTenHienThi': strTenHienThi,
                'strThongTinMinhChung': '',
                'strFileMinhChung': strFileMinhChung,
                'strNguoiThucHien_Id': me.userId,
                'keyVals': [{ 'strKey': strFileMinhChung, 'strVal': strTenHienThi}]
            };

            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                    }
                    else {
                        me.alert("Lỗi: " + data.Message, "w");
                    }
                    
                },
                error: function (er) {  },
                type: "POST",
                action: obj_save.action,
                
                contentType: true,
                
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }

    },
    getImage: function (strZoneUpload_Id, strId) {
        var me = this;
        var sourceFile = edu.util.getValById(strZoneUpload_Id);
        if (sourceFile.includes("unsave_")) {
            return me.copyFile(sourceFile, strId);
        }
        return sourceFile;
    },
    copyFile: function (sourceFile, strId) {
        var me = this;
        var result = "";
        var x = $.ajax({
            url: me.rootPathUpload + '/Handler/copyfile.ashx?sourceFile=' + sourceFile + '&strId=' + strId + "&userId=" + edu.system.userId,
            method: 'post',
            async: false,
            success: function (data) {
                if (data.indexOf("Sys_error") != 0) {
                    result = data;
                }
                else {
                    result = sourceFile;
                }
            }
        });
        return result;
    },
    /*--------------------------------------
    -- author: 
    -- discription: date server
    -- date:  
    */

    /*
     *************************************************************************
     ********* orde: [2] *****************************************************
     ********* name: KHOI HAM BIND DU LIEU ***********************************
     ********* disc: *********************************************************
     *************************************************************************
    */
    /*
    -- author:
    -- discription:  Xữ lý phân trang
                    1. Hàm render html số trang tùy chọn và thông tin dữ liệu hiển thị
                    2. Hàm setup thông tin phân trang và xữ lý sự kiện next page (strFuntionName: Tên khai báo hàm trong file js,
                    strTable_Id: Id bảng dữ liệu, iDataRow: Tổng số dữ liệu)
                    Cách gọi như sau:
                    1. Tại hàm init gọi hàm pagInfoRender để render html
                    2. Tại hàm load dữ liệu sau khi trả về kết quả json thì gọi hàm pagButtonRender
    -- date: 
    */
    pagInfoRender_specialedition: function (strClassName) {
        var me = this;
        if (!edu.util.checkValue(strClassName))
            strClassName = "tbl-pagination";

        var x = document.getElementsByClassName(strClassName);
        for (var i = 0; i < x.length; i++) {
            var strTable_Id = x[i].id;
            var strPageSize_Id = "change" + strTable_Id;
            $("#" + strTable_Id).parent().before('<div class="clear"></div>');
            var class_pull_left = '';
            class_pull_left += '<div class="pull-left col-lg-6" id="' + strPageSize_Id + '" style="padding-left:0px; font-style:itali"></div>';
            $("#" + strTable_Id).before(class_pull_left);

            var strFilter_Id = strTable_Id + '_filter';
            var class_pull_right = '';
            class_pull_right += '<div id="' + strFilter_Id + '" class="col-lg-6 pull-right"></div>';
            $("#" + strTable_Id).before(class_pull_right);

            var row_change = "";
            row_change += '<div class="aps-hienthi" style="padding-left:0 !important; margin-top:10px; float:left; font-style:italic">';
            row_change += '<label>Hiển thị</label>';
            row_change += '</div>';
            row_change += '<div class="aps-hienthi-input" style="width: 70px; padding-left:3px !important; float:left">';
            row_change += '<select id="dropPageSize' + strPageSize_Id + '" class="select-opt">';
            row_change += '<option value="10"> 10 </option>';
            row_change += '<option value="15"> 15 </option>';
            row_change += '<option value="25"> 25 </option>';
            row_change += '<option value="50"> 50 </option>';
            row_change += '<option value="100000"> Tất cả </option>';
            row_change += '</select>';
            row_change += '</div>';
            row_change += '<div class="aps-dulieu" style="padding-left:3px !important; margin-top:10px; float:left; font-style:italic">';
            row_change += '<label>dữ liệu</label>';
            row_change += '</div>';
            $("#" + strPageSize_Id).html(row_change);
            $(".select-opt").select2();


            var row_pagesize_top = '';
            row_pagesize_top += '<div class="pull-right">';
            row_pagesize_top += '<div class="light-pagination' + strTable_Id + '" style="float:right"></div>';
            row_pagesize_top += '</div>';
            $("#" + strFilter_Id).html(row_pagesize_top);

            var row_info = '';
            row_info += '<div style="width:100%; float:right; margin-top: 10px">';
            row_info += '<div id="tbldata_info' + strTable_Id + '" style="width: 40%; float:left"></div>';
            row_info += '<input type="hidden" id="hr_total_rows' + strTable_Id + '" value="0" />';
            row_info += '<div id="light-pagination' + strTable_Id + '" class="light-pagination' + strTable_Id + '" style="float:right; width: 60%"></div>';
            row_info += '</div>';
            $("#" + strTable_Id).after(row_info);

            row_inputhiden = '';
            row_inputhiden += '<input type="hidden" value="10" id="' + strTable_Id + '_DataRow" />';
            $("#" + strTable_Id).after(row_inputhiden);
            me.getLocalStorage(strTable_Id);
        }
    },
    pagInfoRender: function (strTable_Id) {
        $(".zone-pag-header" + strTable_Id).replaceWith('');
        $(".zone-pag-footer" + strTable_Id).replaceWith('');
        var zonePagHeader = '<div class="title-is-paging zone-pag-header' + strTable_Id + '">';
        zonePagHeader += '<div class="clear"></div>';
        //html change top left
        //zonePagHeader += '<div class="pull-left col-lg-6 change-' + strTable_Id + '" id="change' + strTable_Id + '" style="padding-left:0px; font-style:itali">';
        //zonePagHeader += '<div style="padding-left:0 !important; margin-top:6px; float:left; font-style:italic">';
        //zonePagHeader += '<label>Hiển thị</label>';
        //zonePagHeader += '</div>';
        //zonePagHeader += '<div class="aps-hienthi-input" style="width: 70px; padding-left:3px !important; float:left">';
        //zonePagHeader += '<select id="dropPageSizechange' + strTable_Id + '" class="select-opt">';
        //zonePagHeader += '<option value="10"> 10 </option>';
        //zonePagHeader += '<option value="15"> 15 </option>';
        //zonePagHeader += '<option value="25"> 25 </option>';
        //zonePagHeader += '<option value="50"> 50 </option>';
        //zonePagHeader += '<option value="100000"> Tất cả </option>';
        //zonePagHeader += '</select>';
        //zonePagHeader += '</div>';
        //zonePagHeader += '<div style="padding-left:3px !important; margin-top:6px; float:left; font-style:italic">';
        //zonePagHeader += '<label>dữ liệu</label>';
        //zonePagHeader += '</div>';
        //zonePagHeader += '</div>';
        zonePagHeader += '<div class="gv-paging-group" style="margin-left: unset">';
        zonePagHeader += '<span class="pe-3 fs-14">Hiển thị</span>';
        zonePagHeader += '<div class="form-item d-flex  form-add-info">';
        zonePagHeader += '<div class="input-group no-icon">';
        zonePagHeader += '<i class="fal fa-angle-down"></i>';
        zonePagHeader += '<select class="form-select" aria-label="Default select example" id="dropPageSizechange' + strTable_Id + '">';
        zonePagHeader += '<option value="10"> 10 </option>';
        zonePagHeader += '<option value="15"> 15 </option>';
        zonePagHeader += '<option value="25"> 25 </option>';
        zonePagHeader += '<option value="50"> 50 </option>';
        zonePagHeader += '<option value="100000"> Tất cả </option>';
        zonePagHeader += '</select>';
        zonePagHeader += '</div>';
        zonePagHeader += '</div>';
        zonePagHeader += '<span class="ms-3 me-5 fs-14">dữ liệu</span>';
        zonePagHeader += '</div>';
        //End left

        //html button to change the page top right
        //zonePagHeader += '<div class="filter-' + strTable_Id + ' col-lg-6 pull-right">';
        //zonePagHeader += '<div class="pull-right">';
        //zonePagHeader += '<div class="light-pagination' + strTable_Id + '" style="float:right"></div>';
        //zonePagHeader += '</div>';

        zonePagHeader += '<div class="gv-paging-group">';
        zonePagHeader += '<div class="gv-paging light-pagination' + strTable_Id + ' filter-' + strTable_Id + '">';
        zonePagHeader += '</div>';
        zonePagHeader += '</div>';
        //End top right
        zonePagHeader += '</div>';
        $("#" + strTable_Id).before(zonePagHeader);
        //$("#dropPageSizechange" + strTable_Id).select2();
        //End zone page header

        var zonePagFooter = '';
        //zonePagFooter += '<div class="zone-pag-footer' + strTable_Id + '" style="width:100%; float:right; margin-top: 10px">';
        //zonePagFooter += '<div class="info-' + strTable_Id + '" style="width: 40%; float:left"></div>';
        //zonePagFooter += '<div id="light-pagination' + strTable_Id + '" class="light-pagination' + strTable_Id + '" style="float:right; width: 60%"></div>';
        //zonePagFooter += '</div>';
        zonePagFooter += '<div class="col-12 zone-pag-footer' + strTable_Id + '" style="margin-top: 5px">';
        zonePagFooter += '<div class="gv-paging-group justify-content-end">';
        zonePagFooter += '<div class="gv-paging info-pag info-' + strTable_Id + '">';
        zonePagFooter += '</div>';
        zonePagFooter += '<div class="gv-paging light-pagination' + strTable_Id + '" id="light-pagination' + strTable_Id + '">';
        zonePagFooter += '</div>';
        zonePagFooter += '</div>';
        zonePagFooter += '</div>';
        $("#" + strTable_Id).after(zonePagFooter);
    },
    pagButtonRender: function (strFuntionName, strTable_Id, iDataRow, obj) {
        var me = this;
        //option
        var pageIndex = me.pageIndex_default;
        var pageSize = me.pageSize_default;
        if (obj != null && obj != undefined) {
            if (obj.bChange == false && obj.bChange != undefined) $(".change-" + strTable_Id).replaceWith('');
            if (obj.bInfo == false && obj.bInfo != undefined) $(".info-" + strTable_Id).replaceWith('');
            if (obj.bLeft == false) $(".filter-" + strTable_Id).replaceWith('');
            if (edu.util.checkValue(obj.pageSize)) pageSize = obj.pageSize;
        }


        var first_item = 1;
        if (pageIndex != 1) {
            first_item = (pageSize * pageIndex) - pageSize + 1;
        }
        if (pageSize == 1000000) {
            first_item = 1;
        }
        var items_in = "";
        if (parseInt(iDataRow) < parseInt(pageSize)) {
            items_in = iDataRow.toString();
        }
        else {
            items_in = (pageSize * pageIndex).toString();
        }
        if (parseInt(iDataRow) < parseInt(items_in)) {
            items_in = iDataRow.toString();
        }
        $(".info-" + strTable_Id).html('<span class="italic">' + first_item + ' đến ' + items_in + ' trong ' + iDataRow + ' dữ liệu<span>');
        me.pagInit(strFuntionName, strTable_Id, pageSize, iDataRow);
    },
    pagInit: function (strFuntionName, strTable_Id, pageSize_default, totalRows) {
        var me = this;
        $('.light-pagination' + strTable_Id).pagination({
            items: totalRows,
            itemsOnPage: pageSize_default,
            currentPage: me.pageIndex_default,
            cssStyle: 'compact-theme',
            onPageClick: function (pageNumber, event) {
                event.preventDefault();
                me.pageIndex_default = pageNumber;
                eval(strFuntionName);
            }
        });
        $('#dropPageSizechange' + strTable_Id).on('change', function (e) {
            e.stopImmediatePropagation();
            me.pageIndex_default = 1;
            if ($("#dropPageSizechange" + strTable_Id).val() == me.pageSize_default) return;
            me.pageSize_default = $("#dropPageSizechange" + strTable_Id).val();
            me.setLocalStorage(strTable_Id);
            if (me.pageSize_default == "-1" || me.pageSize_default == -1) {
                me.pageSize_default = 1000000;
            }
            eval(strFuntionName);
            return false;
        });
    },
    insertFilterToTable: function (strTable_Id, strFuntionName) {
        var me = this;
        var row_filter = '';

        row_filter += '<div class="input-group pull-right">';
        row_filter += '<input id="' + strTable_Id + '_input" type="text" name="q" class="form-control" style="width: 300px; float: right; padding-left: 10px; height: 40px; margin-bottom: 10px" placeholder="Tìm theo từ khóa">';
        //row_filter += '<span class="input-group-btn">';
        //row_filter += '<a type="submit" name="search" id="' + strTable_Id + '_search_btn" class="btn btn-flat" style="margin-left: -36px; z-index:4; height: 26px"><i class="fa fa-search"></i></a>';
        //row_filter += '</span>';
        row_filter += '</div>';
        $('.filter-' + strTable_Id).removeClass('light-pagination' + strTable_Id)
        $('.filter-' + strTable_Id).html(row_filter);
        $("#" + strTable_Id + "_input").on("keyup", function () {
            var value = edu.system.change_alias($(this).val().toLowerCase());
            $("#" + strTable_Id + " tbody tr").filter(function () {
                $(this).toggle(edu.system.change_alias($(this).text().toLowerCase()).indexOf(value) > -1)
            }).css("color", "red");
        });

        //$("#" + strTable_Id + "_input").keypress(function (e) {
        //    e.stopImmediatePropagation();
        //    if (e.which == 13) {
        //        me.pageIndex_default = 1;
        //        eval(strFuntionName);
        //    }
        //});
        //$("#" + strTable_Id + "_search_btn").click(function (e) {
        //    e.stopImmediatePropagation();
        //    me.pageIndex_default = 1;
        //    eval(strFuntionName);
        //});
    },
    insertChangLenghtToTable: function (arraySetMenuChange, strTable_Id) {
        var i;
        var getList = "";
        for (i = 0; i < arraySetMenuChange[0].length; i++) {
            getList += "<option value='" + arraySetMenuChange[0][i] + "'>" + arraySetMenuChange[1][i] + "</option>";
        }
        var tbCombo = $('[id$=dropPageSizechange' + strTable_Id + ']');
        tbCombo.html('');
        tbCombo.html(getList);
        tbCombo.val(arraySetMenuChange[0][0]).trigger("change");
    },
    setLocalStorage: function (strTable_Id) {
        if (this.urllocal == '') {
            var x = window.location.href;
            var vitribatdau = x.lastIndexOf("#");
            this.urllocal = x.substring(vitribatdau + 1);
        }

        var url = this.urllocal + strTable_Id;
        localStorage.setItem(url, $("#dropPageSizechange" + strTable_Id).val());
    },
    getLocalStorage: function (strTable_Id) {
        if (this.urllocal == '') {
            var x = window.location.href;
            var vitribatdau = x.lastIndexOf("#");
            this.urllocal = x.substring(vitribatdau + 1);
        }

        var url = this.urllocal + strTable_Id;
        try {
            var strVar = eval("localStorage." + url);
            if (strVar != "" && strVar != null && strVar != undefined) {
                this.pageSize_default = parseInt(strVar);
                $('#dropPageSizechange' + strTable_Id).val(strVar).trigger("change");
            }
        }
        catch (ex) {
            return;
        }
    },
    /*
    -- author: tvhiep
    -- discription: Render data into <Table> and pagination
    -- date: 02/06/2018
   */
    loadToTable_data: function (obj) {
        var me = this;
        var strTableId = obj.strTable_Id;
        var jsonData = obj.aaData;
        if ($("#" + strTableId + " tbody").length === 0) {
            return;
        }
        mainTable();
        //
        function renumberStt() {
            try {
                var rows = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].cells && rows[i].cells.length > 0) {
                        rows[i].cells[0].innerHTML = (i + 1);
                    }
                }
            } catch (e) {
                return;
            }
        }
        function mainTable() {
            $("#" + strTableId + " tbody").html("");
            if (edu.util.checkValue(jsonData)) {
                if (jsonData.length > 0) {
                    addPagination();
                    fillTable();
                    sortAndOrder();
                    renumberStt();
                    changeStyle();
                    posColumn();
                    addClassName();
                    hidden_Order();
                    hidden_Header();
                }
                else {
                    dataIsNull();
                    return;
                }
            }
            else {
                dataIsNull();
            }
        }
        function dataIsNull() {
            var html_Table = "";
            html_Table = '';//'<tr><td colspan ="' + (obj.aoColumns.length + 1) + '" class="td-center"><span class="lang" key="">Không tìm thấy dữ liệu!</span></td></tr>';
            $("#" + strTableId + " tbody").html(html_Table);
            $(".light-pagination" + strTableId).remove();
            $(".info-" + strTableId).remove();
            $(".change-" + strTableId).html('');
        }
        function fillTable() {
            var html_table = "";
            var html_row = "";
            var col_name = '';
            var td_value = '';
            var col_func = '';
            var record_id = '';
            var stt = 0;
            var bcheck_orowid = false;
            if (edu.util.checkValue(obj.orowid)) {
                if (edu.util.checkValue(obj.orowid.id)) {
                    bcheck_orowid = true;
                }
                if (edu.util.checkValue(obj.orowid.prefixId)) {
                    record_id = obj.orowid.prefixId;
                }
            }
            for (var i = 0; i < jsonData.length; i++) {
                me.icolumn = 0;
                stt++;
                html_row = "";
                var newId = "";
                bcheck_orowid ? newId = record_id + jsonData[i][obj.orowid.id] : newId = record_id + jsonData[i].ID;
                //process
                html_row += "<tr id='" + newId + "'>";
                html_row += '<td>' + stt + '</td>';
                for (var j = 0; j < obj.aoColumns.length; j++) {
                    col_name = obj.aoColumns[j].mDataProp;
                    html_row += '<td>';
                    switch (edu.util.checkValue(col_name)) {
                        case true:
                            td_value = jsonData[i][col_name];
                            html_row += edu.util.checkEmpty(td_value);
                            break;
                        case false:
                            col_func = obj.aoColumns[j].mRender;
                            if (edu.util.checkValue(col_func)) {
                                html_row += col_func(i, jsonData[i]);
                            }
                            break;
                    }
                    html_row += "</td>";
                }
                html_row += "</tr>";
                html_table += html_row;
            }
            $("#" + strTableId).append(html_table);
            //me.common_setup_page();//select situation -->nnthuong comment
        }
        function addPagination() {
            if (obj.bPaginate != undefined && obj.bPaginate != false) {
                if (!edu.util.checkValue(obj.bPaginate.iDataRow) || obj.bPaginate.iDataRow == 0) obj.bPaginate.iDataRow = jsonData.length;
                if (jsonData.length > 9 && !edu.util.checkValue($("#light-pagination" + strTableId).html())) {
                    me.pagInfoRender(strTableId);
                    if (obj.bPaginate.bFilter == true) me.insertFilterToTable(strTableId, obj.bPaginate.strFuntionName);
                    if (obj.bPaginate.lengthMenu != undefined && obj.bPaginate.lengthMenu != false) {
                        me.insertChangLenghtToTable(obj.bPaginate.lengthMenu, strTableId);
                    }
                    if (obj.bPaginate.saveChange == true) {
                        me.getLocalStorage(strTableId);
                        if (obj.bPaginate.saveChange == true) eval(obj.bPaginate.strFuntionName);
                    }
                }
                if (obj.bPaginate.strFuntionName != undefined) me.pagButtonRender(obj.bPaginate.strFuntionName, strTableId, obj.bPaginate.iDataRow, obj.bPaginate);
                var x = $("#dropPageSizechange" + strTableId + " option[value=" + me.pageSize_default + "]");
                if (x.length > 0) $("#dropPageSizechange" + strTableId).val(me.pageSize_default).trigger('change');
            }
        }
        function sortAndOrder() {
            if (obj.sort != undefined && obj.sort != false) {
                if (obj.order != undefined) {
                    sortTable(strTableId).sortTable($("#" + strTableId), obj.order[0][0], obj.order[0][1]);
                } else {
                    sortTable(strTableId);
                }
            }
            else {
                if (obj.order != undefined) {
                    sortTable().sortTable($("#" + strTableId), obj.order[0][0], obj.order[0][1]);
                }
            }
        }
        function changeStyle() {
            if (obj.addClass != undefined) {
                for (var i = 0; i < obj.addClass.length; i++)
                    addClassToColumn(strTableId, obj.addClass[i][0], obj.addClass[i][1]);
            }
        }
        function posColumn() {
            if (obj.colPos != undefined) {
                if (obj.colPos.fix != undefined) {
                    for (var i = 0; i < obj.colPos.fix.length; i++) {
                        addClassToColumn(strTableId, obj.colPos.fix[i], "td-fix");
                    }
                } if (obj.colPos.center != undefined) {
                    for (var i = 0; i < obj.colPos.center.length; i++) {
                        changeStyleTd(strTableId, obj.colPos.center, "text-align: center");
                    }
                } if (obj.colPos.right != undefined) {
                    for (var i = 0; i < obj.colPos.right.length; i++) {
                        changeStyleTd(strTableId, obj.colPos.right, "text-align: right");
                    }
                } if (obj.colPos.left != undefined) {
                    for (var i = 0; i < obj.colPos.left.length; i++) {
                        changeStyleTd(strTableId, obj.colPos.left, "text-align: left");
                    }
                }
            }
        }
        function changeStyleTd(strTableId, listTd, style) {
            if (listTd.length == 0) return null;
            x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
            for (var i = 0; i < listTd.length; i++) {
                for (var j = 0; j < x.length; j++) {
                    if (x[j].cells[listTd[i]])x[j].cells[listTd[i]].style = style;
                }
            }
        }
        function addClassToColumn(strTableId, iColumn, strClassName) {
            if (iColumn == undefined) return null;
            x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
            for (var j = 0; j < x.length; j++) {
                x[j].cells[iColumn].className += strClassName;
            }
        }
        function sortTable(strTableId) {
            var myTable = "#" + strTableId;
            var myTableBody = myTable + " tbody";
            var myTableRows = myTableBody + " tr";
            var myTableColumn = myTable + " th";
            var arrTableColumn = [];

            //Starting table state
            function initTable() {
                $(myTableColumn).each(function () {
                    if (this.innerHTML.indexOf("Sửa") === -1 && this.innerHTML.indexOf("input") === -1) arrTableColumn.push(this);
                });

                $(arrTableColumn).addClass("sorting");
                $(arrTableColumn).addClass("poiter");

            }

            //Table starting state
            initTable();

            //Table sorting function
            function sortTable(table, column, order) {
                var asc = order === 'asc';
                var tbody = table.find('tbody');
                //Sort the table using a custom sorting function by switching 
                //the rows order, then append them to the table body
                tbody.find('tr').sort(function (a, b) {
                    var aa = $('td:eq(' + column + ')', a).text();
                    var bb = $('td:eq(' + column + ')', b).text();
                    if (!isNaN(aa)) {
                        x = parseFloat(aa);
                        y = parseFloat(bb);
                        if (asc) {
                            if (x > y)
                                return 1;
                            else
                                return -1;
                        }
                        else {
                            if (x > y)
                                return -1;
                            else
                                return 1;
                        }
                    }
                    else {
                        if (asc) {
                            return aa.localeCompare(bb);
                        } else {
                            return bb.localeCompare(aa);
                        }
                    }
                }).appendTo(tbody);

                // Re-number STT to match displayed order
                renumberStt();

            }
            //Heading click
            $(arrTableColumn).click(function () {
                //Remove the sort classes for all the column, but not the first
                $(arrTableColumn).not($(this)).removeClass("sorted-asc sorted-desc");

                //Set or change the sort direction
                if ($(this).hasClass("sorted-asc") || $(this).hasClass("sorted-desc")) {
                    $(this).toggleClass("sorted-asc sorted-desc");
                } else {
                    $(this).addClass("sorted-asc");
                }

                //Sort the table using the current sorting order
                sortTable($(myTable),
                    $(this).index(),
                    $(this).hasClass("sorted-asc") ? "asc" : "desc");

            });
            return {
                sortTable: sortTable
            };
        }
        function addClassName() {
            if (edu.util.checkValue(obj.arrClassName)) {
                var arrClassName = obj.arrClassName;
                var x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
                for (var i = 0; i < x.length; i++) {
                    for (var j = 0; j < arrClassName.length; j++) {
                        x[i].classList.add(arrClassName[j]);
                    }

                }
            }
        }
        function hidden_Order() {
            if (obj.bHiddenOrder == true) {
                var x = document.getElementById(strTableId).getElementsByTagName('tbody')[0].rows;
                for (var i = 0; i < x.length; i++) {
                    x[i].cells[0].style.display = 'none';
                }
            }
        }
        function hidden_Header() {
            if (edu.util.checkValue(obj.bHiddenHeader)) {
                if (obj.bHiddenHeader) {
                    $(".zone-pag-header" + strTableId).hide();
                }
            }
        }
    },
    /*
    -- author: tvhiep
    -- discription: Render pagination to any <div>
    -- date: 02/06/2018
   */
    loadPagination: function (strzoneId, strFuntionName, iDataRow, obj) {
        var me = this;
        //Dữ liệu null
        if (edu.util.checkValue(iDataRow) && iDataRow > 0) {
            //Trước đó chưa hiển thị phân trang thì sẽ hiển thị phân trang
            if (document.getElementsByClassName("zone-pag-footer" + strzoneId).length === 0) {
                me.pagInfoRender(strzoneId);
                ////Tùy chọn Cập nhật lại PageSizechange
                $("#dropPageSizechange" + strzoneId).val(me.pageSize_default).trigger('change');
                //Tạo dải phân cách giữa 2 thằng sau sẽ xóa
                $(".zone-pag-clear" + strzoneId).replaceWith('');
                $("#" + strzoneId).before('<div class="zone-pag-clear' + strzoneId + '" style="clear: both;"></div>');
            }
            me.pagButtonRender(strFuntionName, strzoneId, iDataRow, obj);
        } else {
            $(".zone-pag-footer" + strzoneId).replaceWith('');
            $(".change-" + strzoneId).html('');
            $("#" + strzoneId).html("Không tìm thấy dữ liệu");
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Select2_combo>
    -- date: 02/06/2018
   */
    loadToCombo_data: function (obj) {
        var me = this;
        var render_places = obj.renderPlace;
        var render = obj.renderInfor;
        var data = obj.data;
        //
        var dropToGen = "";
        var getList = "";
        var style = "";
        var stt = 0;
        var default_val = "";
        //
        var id = "";
        var parent_id = "";
        var name = "";
        var code = "";
        var type = "";
        var avatar = "";
        for (var i = 0; i < render_places.length; i++) {
            getList = "";
            type = "";
            avatar = "";
            stt = 0;
            //determine where to generate.. [how many places to gen?]
            if (edu.util.checkId(render_places[i].trim())) {
                dropToGen = "#" + render_places[i].trim();
                $(dropToGen).html("");
            }
            //determine data to generate
            if (data != undefined && data.length > 0) {
                if (edu.util.checkValue(render)) {//..[user]
                    id = render.id;
                    parent_id = edu.util.returnEmpty(render.parentId);
                    name = render.name;
                    code = render.code;
                    type = obj.type;
                    avatar = edu.util.returnEmpty(render.avatar);
                }
                else {//..[default]
                    id = 'ID';
                    parent_id = 'QUANHECHA_ID';
                    name = 'TEN';
                    code = 'MA';
                    type = obj.type;
                }
                comboRender();
            }
            else {
                getList += "<option value=''>-- Không tìm thấy dữ liệu! --</option>";
            }
            bindData();
            if (!default_val) onCache(render_places[i], $(dropToGen));

        }
        //processing function
        function comboRender() {
            getList += checkTitle();//check title
            //Lấy phần tử đầu tiên
            if (render != undefined) {
                default_val = render.default_val;
                if (default_val == 1) {
                    if (data.length > 0) {
                        default_val = data[0][render.id];
                    }
                }
            }
            for (var j = 0; j < data.length; j++) {
                //old code, i changed on 13/12/2018 into code behind
                //if (!edu.util.checkValue(data[j][parent_id])) {
                //    switch (type) {
                //        case 'order':
                //            stt++;
                //            style = stt + ".";
                //            extraRender(j);
                //            break;
                //        case 'unorder':
                //            style = "-";
                //            extraRender(j);
                //            break;
                //        default:
                //            style = "";
                //            extraRender(j);
                //    }
                //}
                if (data[j].THONGTIN8 === "CHON") {
                    default_val = data[j][id];
                    $(dropToGen).attr("resetto", data[j][id]);
                }
                switch (type) {
                    case 'order':
                        stt++;
                        style = stt + ".";
                        extraRender(j);
                        break;
                    case 'unorder':
                        style = "-";
                        extraRender(j);
                        break;
                    default:
                        style = "";
                        extraRender(j);
                }
            }
        }
        function checkTitle() {
            var title = '';
            if (edu.util.checkValue(obj.title)) {
                title += "<option value=''>" + obj.title + "</option>";
            }
            else {
                if (edu.util.checkValue(data[0].CHUNG_TENDANHMUC_TEN)) {
                    title += "<option value=''>Chọn " + data[0].CHUNG_TENDANHMUC_TEN.toLowerCase() + "</option>";
                }
            }
            if ($(dropToGen).attr("multiple") != undefined) {
                title += "<option value='SELECTALL'> Chọn tất cả</option>";
            }
            return title;
        }
        function extraRender(j) {
            if (render == undefined) {
                getList += "<option id='" + data[j][avatar] + "' value='" + data[j][id] + "' name='" + data[j][code] + "'>" + style + " " + data[j][name] + "</option>";
            }
            else {
                if (render.Render == undefined) {
                    var strName = "";
                    if (render != undefined && render.mRender != undefined) {
                        strName = render.mRender(j, data[j]);
                    } else {
                        strName = data[j][name];
                    }
                    getList += "<option id='" + data[j][avatar] + "' value='" + data[j][id] + "' name='" + data[j][code] + "'>" + style + " " + strName + "</option>";
                } else {
                    if (render.Render != undefined) {
                        getList += render.Render(j, data[j]);
                    }
                }
            }


            if (data.length > 1) {
                me.combonode = "";
                if (render != undefined && render.selectFirst == true) {
                    default_val = data[0][id];
                }
                    
                if (edu.util.checkValue(parent_id)) {
                    getList += me.recursive_combo(obj, data[j][id], style);
                }
            }
            else {
                if (render != undefined && render.selectOne == true)
                    default_val = data[j][id];
                if (render != undefined && render.selectFirst == true) {
                    default_val = data[0][id];
                }
            }
        }
        function bindData() {

            $(dropToGen).html(getList);//fill data

            if ($(dropToGen).attr("multiple") !== undefined) {
                $(dropToGen).val("").trigger("change");
                $(dropToGen).on('select2:select', function (e) {
                    var dropId ="#"+ this.id 
                    var x = $(this).val();
                    if (x.length == 2) {
                        if (x[0] == "") {
                            $(this).val(x[1]).trigger("change");
                        }
                    }
                    if (x.includes("SELECTALL")) {
                        e.stopImmediatePropagation();
                        var arr = [];
                        var arrID = $(dropId + " option");
                        for (var k = 0; k < arrID.length; k++) {
                            var temVal = arrID[k].value;
                            if (temVal !== "" && temVal !== "SELECTALL") arr.push(temVal);
                        }
                        $(dropId).val(arr).trigger("change").trigger({ type: 'select2:select' });
                        
                    }
                });
            }

            if (default_val) {
                $(dropToGen).val(default_val).trigger("change").trigger({ type: 'select2:select' });
            }
        }
        function onCache(strId, dropToGen) {
            var strDropBox_Id = "";
            if (me.onCache !== "2") strDropBox_Id = edu.system.strChucNang_Id + strId;

            if (me.onCache) {
                if (me.onCache.indexOf("#") !== -1) {
                    if (me.onCache.indexOf(strId) !== -1) {
                        var tempSave = localStorage.getItem(strDropBox_Id);
                        if (tempSave) {
                            if (data.find(e => e.ID === tempSave)) {
                                dropToGen.val(tempSave);
                                if (strId.indexOf("dr") === 0) {
                                    dropToGen.trigger("change");
                                    dropToGen.trigger({ type: 'select2:select' });
                                }
                            }
                        }
                        if (strId.indexOf("dr") === 0) {
                            dropToGen.on("select2:select", function () {
                                localStorage.setItem(strDropBox_Id, this.value);
                            });
                        }
                    }
                } else {
                    var tempSave = localStorage.getItem(strDropBox_Id);
                    if (tempSave) {
                        if (data.find(e => e.ID === tempSave)) {
                            dropToGen.val(tempSave).trigger("change");
                            dropToGen.trigger({ type: 'select2:select' });
                        } 
                    }
                    dropToGen.on("select2:select", function () {
                        localStorage.setItem(strDropBox_Id, this.value);
                    });
                }

            }
        }
    },
    recursive_combo: function (obj, parentid, parentStyle) {
        var me = this;
        var data = obj.data;
        //
        var id = '';
        var parent_id = '';
        var name = '';
        var code = '';
        var type = '';
        var avatar = "";
        var style;
        var stt;
        if (data.length > 0) {
            var render = obj.renderInfor;
            if (edu.util.checkValue(render)) {//determine data to generate..[user]
                id = render.id;
                parent_id = render.parentId;
                name = render.name;
                code = render.code;
                type = obj.type;
                avatar = edu.util.returnEmpty(render.avatar);
            }
            else {//determine data to generate..[default]
                id = 'ID';
                parent_id = 'QUANHECHA_ID';
                name = 'TEN';
                code = 'MA';
                type = obj.type;
            }
            comboRender();
        }
        return me.combonode;
        //processing function
        function comboRender() {
            stt = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][parent_id] == parentid) {
                    switch (type) {
                        case 'order':
                            stt++;
                            style = parentStyle + stt + ".";
                            extraRender(i);
                            break;
                        case 'unorder':
                            style = parentStyle + "--";
                            extraRender(i);
                            break;
                        default:
                            style = parentStyle + "--";
                            extraRender(i);
                    }
                }
            }
        };
        function extraRender(i) {
            me.combonode += "<option id='" + data[i][avatar] + "' value='" + data[i][id] + "'>" + style + " " + data[i][name] + "</option>";
            me.recursive_combo(obj, data[i][id], style);
        };
    },
    loadToCombo_detail: function (dropToGen, activeId) {
        var checkId = edu.util.checkId(dropToGen);
        if (checkId) {
            var dropToGen_Id = "#" + dropToGen;
            $(dropToGen_Id).val(activeId).trigger("change");//active data
        }
    },
    localStorageDrop: function (strId) {
        $('#' + strId).on('select2:select', function (e) {
            localStorage.setItem(edu.system.strChucNang_Id + strId, edu.util.getValById(strId));
        });
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Radio>
    -- date: 10/01/2019
    */
    loadToCheckBox_data: function (obj) {
        //usage:
        //var obj = {
        //    renderPlace: "zone",
        //    data: [],
        //    prefix: "toanha_",
        //    name:"TEN",
        //    id: "ID"
        //};
        //edu.system.loadToCheckBox_data(obj);

        var me = this;
        var render  = obj.renderPlace;
        var data    = obj.data;
        var prefix  = obj.prefix;
        var name = obj.name;
        var id = obj.id;

        var place = "#" + render;
        var html = '';
        $(place).html(html);
        for (var i = 0; i < data.length; i++) {
            html += '<div class="checkbox">';
            html += '<label>';
            html += '<input type="checkbox" id="' + prefix + data[i][id]+ '"> ' + data[i][name];
            html += '</label>';
            html += '</div>';
        }
        $(place).html(html);
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Radio>
    -- date: 24/11/2018
    */
    loadToRadio_data: function (obj) {
        var me = this;
        var render_places = obj.renderPlace;
        var name = obj.name;
        var data = obj.data;
        var title = obj.title;

        var place = "#" + render_places;
        var html = '';
        $(place).html(html);
        if (edu.util.checkValue(title)) {
            html += '<span class="italic">' + title + ": </span>";
        }
        for (var i = 0; i < data.length; i++) {
            html += '<div class="radio">';
            html += '<label>';
            html += '<input type="radio" id="' + name + data[i].ID + '" name="' + name + '" class="' + name + '" value="' + data[i].ID + '"/>';
            html += ' ' + data[i].TEN + " ";
            html += '</label>';
            html += '</div >';
        }
        $(place).html(html);
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Treejs>
    -- date: 02/06/2018
    */
    loadToTreejs_data: function (obj) {
        var me = this;
        var data = obj.data;
        var render = obj.renderInfor;
        var render_places = obj.renderPlaces;
        var iStringSplit = obj.splitString;

        if (iStringSplit == undefined) iStringSplit = 30;
        if (render == undefined) render = {
            id: "ID",
            parentId: "CHUCNANGCHA_ID",
            name: "TENCHUCNANG",
            code: ""
        };

        var id = render.id;
        var parent_id = render.parentId;
        var name = render.name;

        var place = "";
        for (var p = 0; p < render_places.length; p++) {
            var node = "";
            node += '<ul>';
            if (edu.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
                $(place).jstree('destroy');
            }
            if (data.length > 0) {
                node += userRender(data, null);
            }
            else {
                node += '<li>Không tìm thấy dữ liệu!</li>';
            }
            node += '</ul>';
            $(place).append(node);
            configTreejs();
        }
        //processing functions
        function userRender(obj, parentId) {
            var row = "";
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][parent_id] == parentId) {
                    if (render.Render == undefined) {
                        var strName = "";
                        if (render != undefined && render.mRender != undefined) {
                            strName = render.mRender(i, obj[i]);
                        } else {
                            strName = obj[i][name];
                        }
                        row += '<li class="btnEvent jstree-open" id="' + obj[i][id] + '" title="' + obj[i][name] + '">' + edu.util.splitString(strName, iStringSplit);
                    } else {
                        if (render.Render != undefined) {
                            row += render.Render(i, obj[i]);
                        }
                    }
                    row += '<ul>';
                    row += userRender(obj, obj[i][id]);
                    row += '</ul>';
                    row += '</li>';
                }
            }
            return row;
        }

        function configTreejs() {
            //1. check
            if (edu.util.checkValue(obj.check)) {
                var arr_checked = obj.arrChecked;
                //1. config to allow check in treejs
                $(place).jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"]
                });
                //2.the way to refresh treejs --> when update something new
                $(place).one("refresh.jstree", function (e, data) {
                    if (edu.util.checkValue(arr_checked)) {
                        for (var i = 0; i < arr_checked.length; i++) {
                            data.instance.select_node(arr_checked[i]);
                        }
                    }
                }).jstree(true).refresh();
            }
            //2. style user
            else {
                if (edu.util.checkValue(obj.style)) {//user style-user
                    $(place).jstree({
                        "types": {
                            "default": {
                                "icon": obj.style
                            }
                        },
                        "plugins": ["types"]
                    });
                }
                else {
                    $(place).jstree();//default user
                }
                $(place).jstree(true).refresh();
            }
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <List>Render data into <List>
    -- date: 02/06/2018
    */
    loadToList_data: function (obj) {
        var me = this;
        var data = obj.data;
        var renderInfor = obj.renderInfor;
        var id = renderInfor.id;
        var name = renderInfor.name;
        var amount = renderInfor.amount;
        var render_places = obj.renderPlaces;
        var place = "";
        var list_html = '';

        for (var p = 0; p < render_places.length; p++) {
            list_html = '';
            if (edu.util.checkId(render_places[p])) {//determine where to generate.. [how many places to gen?]
                place = "#" + render_places[p];
                $(place).html("");
            }
            for (var i = 0; i < data.length; i++) {
                list_html += '<li class="list-group-item">' + (i + 1) + ". " + data[i][name] + '<span class="badge">' + (i + 1) + '</span></li>';
            }
            $(place).append(list_html);
        }
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <Tab>
    -- date: 02/06/2018
    */
    loadToTab_data: function (obj) {
        var me = this;
        var data = obj.data;
        var renderInfor = obj.renderInfor;
        var id = renderInfor.id;
        var name = renderInfor.name;
        var renderPlace = obj.renderPlace;

        var tabhead_html = '';
        var tab_index = 0;
        var active_id = '';
        var active = "";
        if (edu.util.checkId(renderPlace)) {
            var tabhead_id = '#' + renderPlace;
            $(tabhead_id).html("");
        }
        for (var i = 0; i < data.length; i++) {
            tab_index = (i + 1);
            if (i == 0) {
                active = 'active';
                active_id = data[i][id];
            } else {
                active = '';
            }
            tabhead_html += '<li class="' + active + '"><a href="#tab' + tab_index + '" data-toggle="tab" aria-expanded="false" id="' + data[i][id] + '">' + data[i][name] + '</a></li>';
        }

        $(tabhead_id).append(tabhead_html);
        return active_id;
    },
    switchTab: function (openTab_id) {
        var x = $('a[href="#' + openTab_id + '"]')[0].parentElement.parentElement;
        var arrli = x.getElementsByTagName('li');
        var arrId = [];
        for (var i = 0; i < arrli.length; i++) {
            arrId.push($(arrli[i].getElementsByTagName('a')[0]).attr('href').replace(/#/g, ""));
        }

        for (var i = 0; i < arrli.length; i++) {
            arrli[i].classList.remove("active");
        }

        for (var i = 0; i < arrId.length; i++) {
            document.getElementById(arrId[i]).classList.remove("active");
        }

        $('a[href="#' + openTab_id + '"]')[0].parentElement.classList.add("active");
        document.getElementById(openTab_id).classList.add("active");
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render data into <popover>
    -- date: 02/06/2018
    */
    loadToPopover_data: function (obj) {
        //Usage
        //var objParam = {
        //    obj: obj,
        //    title: "",
        //    content: function(){ do html and then return html},
        //    event: 'hover',
        //    place: 'right',
        //}
        //edu.system.loadToPopover_data(objParam);

        $(obj.obj).popover({
            title: obj.title,
            content: obj.content,
            trigger: obj.event,
            html: true,
            placement: obj.place,
        });
        $(obj.obj).popover('show');
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render progressBar
    -- date: 02/06/2018
    */
    getProgressBar: function (obj) {
        //--date    : 30/05/2018
        //--Object  : obj{title, items, renderPlace}
        var me = this;
        var html = '';
        var render_place = '';
        var tile = '';
        var items = '';
        var objNotify = {};
        //1. check renderPlace
        if (edu.util.checkValue(obj.renderPlace)) {
            render_place = obj.renderPlace;
        }
        else {
            objNotify = {
                content: "Not found place to gen html - wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        if (!edu.util.checkId(render_place)) {
            objNotify = {
                content: "Not found place to gen html- wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        //2. check title
        if (edu.util.checkValue(obj.title)) {
            tile = obj.title;
        }
        else {
            tile = "Tổng số lượng";
        }
        //3. check title
        if (edu.util.checkValue(obj.items)) {
            items = obj.items;
        }
        else {
            items = 'Chưa xác định!';
        }
        //4. gen html
        html += '<div class="box-body" style="padding: 1px 3px">';
        html += '<div class="box-body" style="padding-left:0px; padding-right:0px;">';
        html += '<div class="clearfix">';
        html += '<span class="pull-left">' + tile + ': <span id="items_' + render_place + '">' + items + '</span></span>';
        html += '<small id="percent_lable_' + render_place + '" class="pull-right" style="font-weight:bold; font-size:15px">0%</small>';
        html += '</div>';
        html += '<div class="progress progress-sm active" style="margin-bottom:0px;">';
        html += '<div id="percent_' + render_place + '" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        $("#" + render_place).html(html);
        //remove effect
        var $percent = "#percent_" + render_place;
        me.removeEffectProgressBar($percent);
    },
    updateProgressBar: function (obj) {
        //--date    : 30/05/2018
        //--Render  : percent_lable_, percent_, 
        //--Object  : obj{items, completed, renderPlace}
        var me = this;
        var render_place = '';
        var items = 0;
        var completed = 0;
        //1. check renderPlace
        if (edu.util.checkValue(obj.renderPlace)) {
            render_place = obj.renderPlace;
        }
        else {
            objNotify = {
                content: "Not found place to gen html - wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        if (!edu.util.checkId(render_place)) {
            objNotify = {
                content: "Not found place to gen html- wrong id name!",
                type: "w"
            }
            me.alertOnModal(objNotify);
            return false;
        }
        if (edu.util.checkValue(obj.items)) {
            items = obj.items;
        }
        else {
            objNotify = {
                content: "Not indentify param_items!",
                type: "w"
            }
            me.alertOnModal(objNotify);
        }
        if (edu.util.checkValue(obj.completed)) {
            completed = obj.completed;
        }
        else {
            objNotify = {
                content: "Not indentify param_completed!",
                type: "w"
            }
            me.alertOnModal(objNotify);
        }
        //2. get id - process
        var $percent_lable = "#percent_lable_" + render_place;
        var $percent = "#percent_" + render_place;
        var iPercent = ((completed / items) * 100).toFixed(2);
        //3. update percent
        $($percent_lable).html(iPercent + "%");
        $($percent).css("width", iPercent + "%");
        if (completed == items) {
            objNotify = {
                content: "Tiến trình chạy thành công!",
                type: "i"
            }
            me.alertOnModal(objNotify);
            $("#" + render_place).html('');
        }
        me.addEffectProgressBar($percent);
    },
    addEffectProgressBar: function ($percent) {
        $($percent).addClass("progress-bar-striped");
    },
    removeEffectProgressBar: function ($percent) {
        $($percent).removeClass("progress-bar-striped");
    },
    /*--------------------------------------
    Discri: Cache data (chrome - 4.0, ie - 8.0, firefox - 3.5, opera - 11.5)
    Author: nnthuong
    DateOf: 05/06/2018 
    */
    getCache_LocalStore: function (name, key) {
        //name  : name of the param localstorage, 
        //key   : value to compare and get data from db or cache? if key is null --> get all
        //obj   : {key: {}, data: [{}]}
        var obj;
        if (typeof Storage !== "undefined") {
            if (edu.util.checkValue(localStorage.getItem(name))) {
                var dtCached = JSON.parse(localStorage.getItem(name));
                if (edu.util.checkValue(key)) {//return by key
                    var strKey = '';
                    var dtData = '';
                    for (var i = 0; i < dtCached.length; i++) {
                        strKey = dtCached[i].key;
                        dtData = dtCached[i].data;
                        if (strKey == key) {
                            obj = dtData;
                        }
                    }
                }
                else {//return all
                    obj = dtCached;
                }
            }
            else {//cache not initial
                obj = [];
            }
        }
        else {// cache not support
            obj = [];
            alert("Bạn nên nâng cấp trình duyệt để được hỗ trợ tốt hơn!");
        }
        return obj;
    },
    setCache_LocalStore: function (name, dtCache) {
        if (typeof Storage !== "undefined") {
            //0. value is a arr obj: example --> [{key: "", data: [{"ID":"", "":""},{"ID":""}]}, {key: "", data: [{}, {}]}]
            //1. check name befor create a new name of param
            //2. update for the same key
            //3. create a new name of param
            localStorage.setItem(name, JSON.stringify(dtCache));
        }
        else {
            alert("Bạn nên nâng cấp trình duyệt để được hỗ trợ tốt hơn!");
        }
    },
    delCache_LocalStore: function (name) {
        localStorage.removeItem(name);
    },
    /*--------------------------------------
    -- author: nnthuong
    -- discription: Render chartjs
    -- date: 02/06/2018
    */
    barChart: function (obj) {
        //Usage
        //var datasets = [
        //    {
        //        label: "Tổng",
        //        data: me.data_NhanSuTong,
        //        backgroundColor: '#eeff56'
        //    },
        //    {
        //        label: 'Tăng',
        //        data: me.data_NhanSuTang,
        //        backgroundColor: '#36a2eb'
        //    }
        //];
        //var labels = me.arr_month;
        //var objChart = {
        //    placement: "barChart",
        //    data: datasets,
        //    labels: labels,
        //    title: "BIỂU ĐỒ THỐNG KÊ TÀI CHÍNH THEO KHÓA "
        //}
        //edu.system.barChart(objChart);

        var ctx = document.getElementById(obj.placement).getContext('2d');
        var config = {
            type: 'bar',
            data: {
                datasets: obj.data,
                labels: obj.labels
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: obj.title
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                if (parseInt(value) >= 1000) {
                                    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                } else {
                                    return '$' + value;
                                }
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        },
                    },
                }
            }
        };
        //create a new chart in the intefacce
        var myChart = new Chart(ctx, config);
    },
    lineChart: function (obj) {
        //Usage
        //var datasets = [
        //    {
        //        label: "Tieu de",
        //        data: me.data_SameAge
        //    }
        //];
        //var labels = me.data_UniqAge;
        //var obj = {
        //    placement: "areaChart_Tuoi",
        //    data: datasets,
        //    labels: labels,
        //    titletooltip: labels,
        //    title: "THỐNG KÊ THEO ĐỘ TUỔI"
        //}
        //edu.system.lineChart(obj);


        var ctx = document.getElementById(obj.placement).getContext('2d');
        var config = {
            type: 'line',
            data: {
                newTitleTooltips: obj.titletooltip,
                labels: obj.labels,
                datasets: obj.data
            },
            options: {
                responsive: true,
                legend: {
                    display: true,
                    position: 'top',
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: obj.title
                },
                tooltips: {
                    mode: 'point',
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var newtitle_tooltip = "";
                            tooltipItems.forEach(function (tooltipItem) {
                                newtitle_tooltip = data.newTitleTooltips[tooltipItem.index];
                            });
                            return newtitle_tooltip;
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };
        var myLineChart = new Chart(ctx, config);
    },
    doughnutChart: function (obj) {
        //-------------
        //- CHART -
        //-------------
        //var datasets = [
        //    {
        //        data: [me.iGioiTinhNam, me.iGioiTinhNu],
        //        backgroundColor: ['#eeff56', '#36a2eb']
        //    }
        //];
        //var objChart = {
        //    placement: "pieChart_GioiTinh",
        //    data: datasets,
        //    title: "THỐNG KÊ TỶ LỆ GIỚI TÍNH",
        //    labels: ["Nam", "Nữ"],
        //    type: "pie" //pie or dougnut
        //}
        //edu.system.doughnutChart(objChart);

        if (!edu.util.checkValue(obj.labels)) {
            obj.labels = [];
        }
        if (!edu.util.checkValue(obj.type)) {
            obj.type = "doughnut"
        }

        var ctx = document.getElementById(obj.placement).getContext('2d');
        var config = {
            type: obj.type,
            data: {
                datasets: obj.data,
                labels: obj.labels
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: obj.title
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };
        var myPieChart = new Chart(ctx, config);
    },
    /*
     **************************************************************************
     ********* orde: [3] ******************************************************
     ********* name: KHOI HAM TRUY VAN DU LIEU DB *****************************
     ********* disc: **********************************************************
     **************************************************************************
     */
    /*----------------------------------------------
    --Author: nnthuong
    --Date of created: 22/05/2018
    --Discription: [1] HangDoi from db (1 HangDoi <==> 1 Task)
    ----------------------------------------------*/
    getList_HangDoi: function (obj, resolve, reject, callback) {
        var me = this;
        var strLoaiNhiemVu_Id = obj.strLoaiNhiemVu;
        var strNguoiThucHien_Id = me.userId;
        var strTuKhoa = "";
        var pageIndex = 1;
        var pageSize = 1000;

        me.beginLoading();
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                        else {
                            me.taskControl(dtResult);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve(dtResult);
                        }
                        else if (typeof callback === "function") {
                            callback(dtResult);
                        }
                        else {
                            me.taskControl(dtResult);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert("CMS_HangDoiTuTao.LayDanhSachHangDoi: " + data.Message, "w");
                }
                me.endLoading();
            },
            error: function (er) {
                me.endLoading();
                me.alert("CMS_HangDoiTuTao.LayDanhSachHangDoi (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strLoaiNhiemVu_Id': strLoaiNhiemVu_Id,
                'strNguoiThucHien_Id': strNguoiThucHien_Id,
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_HangDoi: function (obj, resolve, reject, callback) {
        var me = this;
        var strId = obj.strHangDoi_Id;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var objRespond = {
                        id: "",
                        iTongDuLieuDaHoanThanh: 0,
                        iTongDuLieuCanThucHien: 0,
                    };
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        //create objRespond
                        objRespond.id = obj.strHangDoi_Id;
                        objRespond.iTongDuLieuDaHoanThanh = dtResult[0].TONGDULIEUDAHOANTHANH;
                        objRespond.iTongDuLieuCanThucHien = dtResult[0].TONGDULIEUCANTHUCHIEN;
                        //
                        if (typeof resolve === "function") {
                            resolve(objRespond);
                            //me.updateStatus_Task(obj);
                            //me.getList_XuLyNhiemVu(strHangDoi_Id);
                        }
                        else if (typeof callback === "function") {
                            callback(objRespond, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve(objRespond);
                        }
                        else if (typeof callback === "function") {
                            callback(objRespond);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert("CMS_HangDoiTuTao.LayChiTietHangDoi: " + data.Message, "w");
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CMS_HangDoiTuTao.LayChiTietHangDoi (er): " + JSON.stringify(er), "w");
                reject();
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/LayChiTiet',
            
            contentType: true,
            
            data: {
                'strId': strId
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_XuLyNhiemVu: function (obj, resolve) {
        var me = this;
        var iTinhTrang = 0;
        var strHangDoi_Id = obj.strHangDoi_Id;
        var strNguoiThucHien_Id = me.userId;
        var strTuKhoa = obj.strTuKhoa;
        var pageIndex = obj.pageIndex;
        var pageSize = obj.pageSize;

        me.makeRequest({
            success: function (data) {
                if (typeof resolve == "function") {
                    resolve(data, obj.strHangDoi_Id);
                }
            },
            error: function (er) {
                resolve(data, obj.strHangDoi_Id, JSON.stringify(er));
            },
            type: 'GET',
            action: 'CMS_HangDoiTuTao/LayDSXuLyNhiemVu_HangDoi',
            
            contentType: true,
            
            data: {
                'dTinhTrang': iTinhTrang,
                'strHangDoi_Id': strHangDoi_Id,
                'strNguoiThucHien_Id': strNguoiThucHien_Id,
                'strTuKhoa': strTuKhoa,
                'pageIndex': pageIndex,
                'pageSize': pageSize
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_XuLyNhiemVu: function (obj, resolve, reject, callback) {
        var me = this;
        //data, strHangHoi_Id
        var strNguoiThucHien_Id = me.userId;
        var strNhiemVu_Id = obj.strNhiemVu_Id;
        //for(obj.data){
        me.makeRequest({
            success: function (data) {
                if (typeof resolve == "function") {
                    resolve(data, obj.strHangDoi_Id);
                }
            },
            error: function (er) {
                resolve(data, obj.strHangDoi_Id, JSON.stringify(er));
            },
            type: 'POST',
            action: 'CMS_HangDoiTuTao/XuLyNhiemVu_HangDoi',
            
            contentType: true,
            
            data: {
                'strNguoiThucHien_Id': strNguoiThucHien_Id,
                'strId': strNhiemVu_Id
            },
            fakedb: [
            ]
        }, false, false, false, null);
        //}
    },
    createHangDoi: function (objHangDoi) {
        var me = edu.system;
        $("#tblTaskBar_" + objHangDoi.strName).delegate('.btnStart', 'click', function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            var strHangDoi_Id = strId.replace(/start_hangdoi/g, "");
            if (edu.util.checkValue(strHangDoi_Id)) {
                me.excuteHangDoi(objHangDoi, strHangDoi_Id);
            }
        });
        $("#tblTaskBar_" + objHangDoi.strName).delegate('.btnCancle', 'click', function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strHangDoi_Id = strId.replace(/cancle_hangdoi/g, "");
            
            //me.enableButton_Start(strHangDoi_Id);
        });
        getList_HangDoi();
        function getList_HangDoi() {
            var strLoaiNhiemVu_Id = objHangDoi.strLoaiNhiemVu;
            var strNguoiThucHien_Id = me.userId;
            var strTuKhoa = "";
            var pageIndex = 1;
            var pageSize = 1000;

            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        genHTML_HangDoi(data.Data, data.Pager);
                        genHistory_HangDoi(data.Data, data.Pager);
                    }
                    else {
                        me.alert("CMS_HangDoiTuTao.LayDanhSachHangDoi: " + data.Message, "w");
                    }
                },
                error: function (er) {
                    me.alert("CMS_HangDoiTuTao.LayDanhSachHangDoi (er): " + JSON.stringify(er), "w");
                },
                type: 'GET',
                action: 'CMS_HangDoiTuTao/LayDanhSach',
                
                contentType: true,
                
                data: {
                    'strLoaiNhiemVu_Id': strLoaiNhiemVu_Id,
                    'strNguoiThucHien_Id': strNguoiThucHien_Id,
                    'strTuKhoa': strTuKhoa,
                    'pageIndex': pageIndex,
                    'pageSize': pageSize
                },
                fakedb: [

                ]
            }, false, false, false, null);
        }
        function genHTML_HangDoi(data, iPager) {
            var obj = {};
            var html = "";
            var place = "#tblTaskBar_" + objHangDoi.strName + " tbody";
            var strHangDoi_Id = "";
            var iTongDuLieu = 0;
            var iTongDuLieu_HoanThanh = 0;
            var count_HangDoi = 0;
            $(place).html("");

            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    strHangDoi_Id = data[i].ID;
                    iTongDuLieu = edu.util.returnZero(data[i].TONGDULIEUCANTHUCHIEN);
                    iTongDuLieu_HoanThanh = edu.util.returnZero(data[i].TONGDULIEUDAHOANTHANH);

                    if (iTongDuLieu != iTongDuLieu_HoanThanh) {
                        //1. gen form contain taskbar
                        var iper = Math.round((((iTongDuLieu_HoanThanh / iTongDuLieu) * 100)), 0);
                        html = "";
                        html += '<tr id="thanhtientrinh_' + objHangDoi.strName + strHangDoi_Id + '" style="margin-bottom: 5px">';
                        html += '<td style="width: 200px">- Thanh tiến trình ' + edu.util.returnEmpty(data[i].TEN) + '</td>';
                        html += '<td class="td-right">';
                        html += '<div id="probar_' + objHangDoi.strName + strHangDoi_Id + '">';
                        html += '</div>';
                        html += '</td>';
                        html += '<td style="width: 100px">';
                        html += '<div id="action_' + objHangDoi.strName + '" class="pull-right">';
                        html += '<a class="btn btn-primary btnStart" id="start_hangdoi' + strHangDoi_Id + '"><i class="fa fa-play"></i> Bắt đầu</a>';
                        html += '</div></td>';
                        html += '</tr>';
                        $(place).append(html);
                        me.genHTML_Progress('probar_' + objHangDoi.strName + strHangDoi_Id, iTongDuLieu);
                        $("#probar_" + objHangDoi.strName + strHangDoi_Id + " #percentInDS").attr("style", "width:" + iper + "%");
                        if (iTongDuLieu_HoanThanh !== 0) {
                            $("#probar_" + objHangDoi.strName + strHangDoi_Id + " #zonepercentInDS").attr("title", iTongDuLieu_HoanThanh);
                            $("#probar_" + objHangDoi.strName + strHangDoi_Id + " #zoneShowLog").html("" + iTongDuLieu_HoanThanh + "/" + iTongDuLieu + " (" + iper + "%)");
                        }
                    }
                    else {
                        count_HangDoi++;
                    }
                }
                //.check exitance HangDoi
                if (count_HangDoi == data.length) {
                    $(place).append("<tr><td colspan='2' class='color-warning italic'>Không có tiến trình nào cần xử lý!</td></tr>");
                }
            }
        }

        function genHistory_HangDoi(data, iPager) {
            var strTable_Id = "tblHistory_" + objHangDoi.strName;
            var html = '';
            html += '<tr>';
            html += '<th class="td-center td-fixed">#</th>';
            html += '<th>Người thực hiện</th>';
            html += '<th>Ngày thực hiện</th>';
            html += '<th class="td-center">Tổng thực hiện</th>';
            html += '<th class="td-center">Tổng hoàn thành</th>';
            html += '</tr>';
            $("#" + strTable_Id + " thead").html(html);
            var jsonForm = {
                strTable_Id: strTable_Id,
                aaData: data,
                sort: true,
                colPos: {
                    left: [1, 2],
                    center: [0, 3, 4],
                    fix: [0]
                },
                aoColumns: [
                    {
                        "mDataProp": "NGUOITHUCHIEN_TENDAYDU"
                    }
                    , {
                        "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                    }
                    , {
                        "mDataProp": "TONGDULIEUCANTHUCHIEN"
                    }
                    , {
                        "mDataProp": "TONGDULIEUDAHOANTHANH"
                    }
                    , {
                        "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                    }
                ]
            };
            me.loadToTable_data(jsonForm);
        }
    },
    excuteHangDoi: function (objHangDoi, strHangDoi_Id) {
        var me = edu.system;
        var iThanhCong = 0;
        var iThatBai = 0;
        var iTongDuLieu = 0;

        getList_XuLyNhiemVu();
        function getList_XuLyNhiemVu() {
            var iTinhTrang = 0;
            var strNguoiThucHien_Id = me.userId;
            var strTuKhoa = "";
            var pageIndex = 1;
            var pageSize = 1000000;

            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        iTongDuLieu = data.Data.length;
                        for (var i = 0; i < iTongDuLieu; i++) {
                            save_XuLyNhiemVu(data.Data[i].ID, i);
                        }
                    }
                    else {
                        me.alert('CMS_HangDoiTuTao/LayDanhSachXuLyNhiemVu: ' + data.Message, "w");
                    }
                },
                error: function (er) {
                    me.alert('CMS_HangDoiTuTao/LayDanhSachXuLyNhiemVu: ' + JSON.stringify(er), "w");
                },
                type: 'GET',
                action: 'CMS_HangDoiTuTao/LayDSXuLyNhiemVu_HangDoi',
                
                contentType: true,
                
                data: {
                    'dTinhTrang': iTinhTrang,
                    'strHangDoi_Id': strHangDoi_Id,
                    'strNguoiThucHien_Id': strNguoiThucHien_Id,
                    'strTuKhoa': strTuKhoa,
                    'pageIndex': pageIndex,
                    'pageSize': pageSize,
                },
                fakedb: [

                ]
            }, false, false, false, null);
        }
        function save_XuLyNhiemVu(strNhiemVu_Id, iTongDuLieu_HoanThanh) {
            var strNguoiThucHien_Id = me.userId;
            //for(obj.data){
            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        iThanhCong++;
                    }
                    else {
                        iThatBai++;
                    }
                },
                error: function (er) {
                    me.alert('CMS_HangDoiTuTao/XuLyNhiemVu_HangDoi: ' + JSON.stringify(er), "w");
                },
                type: 'POST',
                action: 'CMS_HangDoiTuTao/XuLyNhiemVu_HangDoi',
                complete: function () {
                    edu.system.start_Progress("probar_" + objHangDoi.strName + strHangDoi_Id, function () {
                        if (typeof objHangDoi.callback == "function") objHangDoi.callback();
                        me.alert('Tổng dữ liệu: ' + iTongDuLieu + '.</br> Tiến trình đã xử lý: <span style="color: blue">' + iThanhCong + '</span>', "s");
                        if (iThatBai) {
                            me.confirm('Bạn có muốn chạy lại không');
                            $("#btnYes").click(function (e) {
                                iThanhCong = 0;
                                iThatBai = 0;
                                iTongDuLieu = 0;
                                getList_XuLyNhiemVu();
                            });
                        } else {
                            $("#thanhtientrinh_" + objHangDoi.strName + strHangDoi_Id).remove();
                        }
                    });
                },
                contentType: true,
                
                data: {
                    'strNguoiThucHien_Id': strNguoiThucHien_Id,
                    'strId': strNhiemVu_Id
                },
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    /*
    -- author: nnthuong
    -- discription: [ThoiGianDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_ThoiGianDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strNam_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_ThoiGianDaoTao(obj, resolve, reject, callback);

        var strDAOTAO_Nam_Id = edu.util.returnEmpty(obj.strNam_Id);
        var strNguoiThucHien_Id = edu.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);

        $("#dropSearch_ThoiGian").val("").trigger("change");
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
            'iM': edu.system.iM,
            'strDAOTAO_Nam_Id': strDAOTAO_Nam_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.beginLoading();
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.endLoading();
                    me.alert(": " + data.Message, "w");
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("(er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [HeDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_HeDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strHinhThucDaoTao_Id: "",
        //    strBacDaoTao_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_HeDaoTao(obj, resolve, reject, callback);

        var strDAOTAO_HinhThucDaoTao_Id = edu.util.returnEmpty(obj.strHinhThucDaoTao_Id);
        var strDaoTao_BacDaoTao_Id = edu.util.returnEmpty(obj.strBacDaoTao_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);


        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4P',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao',
            'iM': edu.system.iM,
            'strDAOTAO_HinhThucDaoTao_Id': strDAOTAO_HinhThucDaoTao_Id,
            'strDaoTao_BacDaoTao_Id': strDaoTao_BacDaoTao_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert(": " + data.Message, "w");
                    me.endLoading();
                    return false;
                }
            },
            error: function (er) {
                me.alert("(er): " + JSON.stringify(er), "w");
                me.endLoading();
                return false;
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [KhoaDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_KhoaDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strHeDaoTao_Id: "",
        //    strCoSoDaoTao_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_KhoaDaoTao(obj, resolve, reject, callback);

        $("#dropSearch_KhoaDaoTao").val("").trigger("change");
        var strDAOTAO_HeDaoTao_Id = edu.util.returnEmpty(obj.strHeDaoTao_Id);
        var strDaoTao_CoSoDaoTao_Id = edu.util.returnEmpty(obj.strCoSoDaoTao_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);

        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCikuIAUgLhUgLgPP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao',
            'iM': edu.system.iM,
            'strDAOTAO_HeDaoTao_Id': strDAOTAO_HeDaoTao_Id,
            'strDaoTao_CoSoDaoTao_Id': strDaoTao_CoSoDaoTao_Id,
            'strNguoiThucHien_Id': "",
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert(data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [ChuongTrinhDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_ChuongTrinhDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strKhoaDaoTao_Id: "",
        //    strN_CN_LOP_Id: "",
        //    strKhoaQuanLy_Id: "",
        //    strToChucCT_Cha_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 10000,
        //};
        //edu.system.getList_ChuongTrinhDaoTao(obj, resolve, reject, callback);
        //---------------------------------------------------------------------
        $("#dropSearch_ChuongTrinh").val("").trigger("change");
        $("#dropSearch_ChuongTrinhDaoTao").val("").trigger("change");
        var strDaoTao_HeDaoTao_Id = edu.util.returnEmpty(obj.strDaoTao_HeDaoTao_Id);
        var strDAOTAO_KhoaDaoTao_Id = edu.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strDaoTao_N_CN_LOP_Id = edu.util.returnEmpty(obj.strN_CN_LOP_Id);
        var strDaoTao_KhoaQuanLy_Id = edu.util.returnEmpty(obj.strKhoaQuanLy_Id);
        var strDaoTao_ToChucCT_Cha_Id = edu.util.returnEmpty(obj.strToChucCT_Cha_Id);
        var strNguoiThucHien_Id = edu.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);

        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eFS4CKTQiAhUP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT',
            'iM': edu.system.iM,
            'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strDAOTAO_KhoaDaoTao_Id,
            'strDaoTao_N_CN_Id': strDaoTao_N_CN_LOP_Id,
            'strDaoTao_KhoaQuanLy_Id': strDaoTao_KhoaQuanLy_Id,
            'strDaoTao_ToChucCT_Cha_Id': strDaoTao_ToChucCT_Cha_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_ChuongTrinhDaoTao.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_ChuongTrinhDaoTao.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [NganhDaoTao] Get data from db 
    -- date: 30/07/2018
    */
    getList_NganhDaoTao: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [CoSoDaoTao] Get data from db 
    -- date: 14/08/2018
    */
    getList_CoSoDaoTao: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_CoSoDaoTao(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strNguoiThucHien_Id = edu.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);

        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_CoSoDaoTao.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_CoSoDaoTao.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_LopQuanLy: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCoSoDaoTao_Id: "",
        //    strKhoaDaoTao_Id: "",
        //    strNganh_Id: "",
        //    strLoaiLop_Id: "",
        //    strToChucCT_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_LopQuanLy(obj, resolve, reject, callback);
        //---------------------------------------------------------------------
        $("#dropSearch_Lop").val("").trigger("change");
        $("#dropSearch_LopQuanLy").val("").trigger("change");
        var strDaoTao_HeDaoTao_Id = edu.util.returnEmpty(obj.strDaoTao_HeDaoTao_Id);
        var strDaoTao_CoSoDaoTao_Id = edu.util.returnEmpty(obj.strCoSoDaoTao_Id);
        var strDaoTao_KhoaDaoTao_Id = edu.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strDaoTao_Nganh_Id = edu.util.returnEmpty(obj.strNganh_Id);
        var strDaoTao_LoaiLop_Id = edu.util.returnEmpty(obj.strLoaiLop_Id);
        var strDaoTao_ToChucCT_Id = edu.util.returnEmpty(obj.strToChucCT_Id);
        var strNguoiThucHien_Id = edu.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);

        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
            'iM': edu.system.iM,
            'strDaoTao_CoSoDaoTao_Id': strDaoTao_CoSoDaoTao_Id,
            'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strDaoTao_Nganh_Id': strDaoTao_Nganh_Id,
            'strDaoTao_LoaiLop_Id': strDaoTao_LoaiLop_Id,
            'strDaoTao_ToChucCT_Id': strDaoTao_ToChucCT_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_LopQuanLy.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_LopQuanLy.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_NamNhapHoc: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //};
        //edu.system.getList_LopHocPhan(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eDyAsCS4i',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_NamHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': me.userId
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert(obj_save.action + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: 
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_KhoaQuanLy: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //};
        //edu.system.getList_LopHocPhan(obj, resolve, reject, callback);
        //---------------------------------------------------------------------


        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKKS4gEDQgLw04',
            'func': 'pkg_kehoach_thongtin.LayDSKhoaQuanLy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': me.userId
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert(obj_save.action + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_LopHocPhan: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCoSoDaoTao_Id: "",
        //    strKhoaDaoTao_Id:"",
        //    strThoiGianDaoTao_Id:"",
        //    strHocPhan_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_LopHocPhan(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strCoSoDaoTao_Id = edu.util.returnEmpty(obj.strCoSoDaoTao_Id);
        var strKhoaDaoTao_Id = edu.util.returnEmpty(obj.strKhoaDaoTao_Id);
        var strThoiGianDaoTao_Id = edu.util.returnEmpty(obj.strThoiGianDaoTao_Id);
        var strHocPhan_Id = edu.util.returnEmpty(obj.strHocPhan_Id);
        var strNguoiThucHien_Id = edu.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);
        $("#dropSearch_Lop").val("").trigger("change");
        $("#dropSearch_LopHocPhan").val("").trigger("change");
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLx4NLjEP',
            'func': 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan_Lop',
            'iM': edu.system.iM,
            'strDaoTao_CoSoDaoTao_Id': strCoSoDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strKhoaDaoTao_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGianDaoTao_Id,
            'strDaoTao_HocPhan_Id': strHocPhan_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_HocPhan.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_HocPhan.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [LopQuanLy] Get data from db 
    -- date: 30/07/2018
    */
    getList_HocPhan: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strChuongTrinh_Id: "",
        //    strNguoiThucHien_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //};
        //edu.system.getList_HocPhan(obj, resolve, reject, callback);
        //---------------------------------------------------------------------

        var strChuongTrinh_Id = edu.util.returnEmpty(obj.strChuongTrinh_Id);
        var strNguoiThucHien_Id = edu.util.returnEmpty(obj.strNguoiThucHien_Id);
        var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        var pageIndex = edu.util.returnZero(obj.pageIndex);
        var pageSize = edu.util.returnZero(obj.pageSize);

        $("#dropSearch_HocPhan").val("").trigger("change");
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIKEh4JLiIRKSAvHgIpNC4vJhUzKC8p',
            'func': 'pkg_kehoach_thongtin.LayDSKS_HocPhan_ChuongTrinh',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': strChuongTrinh_Id,
            'strNguoiThucHien_Id': strNguoiThucHien_Id,
            'strTuKhoa': strTuKhoa,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([]);
                        }
                    }
                }
                else {
                    me.alert("CM_HocPhan.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.endLoading();
                me.alert("CM_HocPhan.LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [CoCauToChuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_CoCauToChuc: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCCTC_Loai_Id: "",
        //    strCCTC_Cha_Id:"",
        //    iTrangThai:1
        //};
        //edu.system.getList_CoCauToChuc(obj, resolve, reject, callback);

        var strCCTC_Loai_Id = obj.strCCTC_Loai_Id;
        var strCCTC_Cha_Id = obj.strCCTC_Cha_Id;
        var iTrangThai = obj.iTrangThai;

        var obj_save = {
            'action': 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P',
            'func': 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
            'iM': edu.system.iM,
            'dTrangThai': iTrangThai,
            'strLoaiCoCauToChuc_Id': strCCTC_Loai_Id,
            'strCoCauToChucCha_Id': strCCTC_Cha_Id,
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_CoCauToChuc.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_CoCauToChuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DanhMuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_DanhMucDulieu: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strMaBangDanhMuc: "",
        //    strTenCotSapXep:"",
        //    iTrangThai:1
        //};
        //edu.system.getList_DanhMucDulieu(obj, resolve, reject, callback);

        var strMaBangDanhMuc = obj.strMaBangDanhMuc;
        var strTenCotSapXep = obj.strTenCotSapXep;
        var iTrangThai = obj.iTrangThai;

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_DuLieuDanhMuc.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DuLieuDanhMuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': strMaBangDanhMuc,
                'strTieuChiSapXep': strTenCotSapXep,
                'dTrangThai': iTrangThai
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DanhMuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_DMDL_Cap1: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strMaBangDanhMuc: "",
        //    strTenCotSapXep:""
        //};
        //edu.system.getList_DMDL_Cap1(obj, resolve, reject, callback);

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_DuLieuDanhMuc.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DuLieuDanhMuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': obj.strMaBangDanhMuc,
                'strTieuChiSapXep': obj.strTenCotSapXep
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [DanhMuc] Get data from db 
    -- date: 30/07/2018
    */
    getList_DMDL_TheoCha: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strCha_Id: "",
        //    strTuKhoa:"",
        //    strDanhMucTenBang_Id:"",
        //    strTenCotSapXep:"",
        //    pageIndex:1,
        //    pageSize:10000
        //};
        //edu.system.getList_DMDL_TheoCha(obj, resolve, reject, callback);
        var obj_save = {
            'action': 'CMS_DanhMuc_MH/DSA4BSAvKRIgIikFNA0oJDQFIC8pDDQi',
            'func': 'pkg_chung_danhmuc.LayDanhSachDuLieuDanhMuc',
            'iM': edu.system.iM,
            'strQUANHECHA_Id': obj.strCha_Id,
            'strTuKhoa': obj.strTuKhoa,
            'strCHUNG_TENDANHMUC_Id': obj.strDanhMucTenBang_Id,
            'strTieuChiSapXep': obj.strTenCotSapXep,
            'pageIndex': obj.pageIndex,
            'pageSize': obj.pageSize,
            'dTrangThai': 1,
        };

        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve === "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback === "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve === "function") {
                            resolve([]);
                        }
                        else if (typeof callback === "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    me.alert("CM_DuLieuDanhMuc.LayDanhSach: " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DuLieuDanhMuc.LayDanhSach (er): " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: false,
            //
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
    -- author: nnthuong
    -- discription: [HocVien] Get data from db 
    -- date: 30/07/2018
    */
    getList_HocVien: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [NghienCuuSinh] Get data from db 
    -- date: 30/07/2018
    */
    getList_NghienCuuSinh: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [NhaKhoaHoc] Get data from db 
    -- date: 30/07/2018
    */
    getList_NhaKhoaHoc: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [NhanSu] Get data from db 
    -- date: 30/07/2018
    */
    getList_NhanSu: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 100000,
        //    strCoCauToChuc_Id: "",
        //    strNguoiThucHien_Id:""
        //};
        //edu.system.getList_NhanSu(obj, resolve, reject, callback);

        //var strTuKhoa = obj.strTuKhoa;
        //var pageIndex = obj.pageIndex;
        //var pageSize = obj.pageSize;
        //var strCoCauToChuc_Id = obj.strCoCauToChuc_Id;
        //var strNguoiThucHien_Id = obj.strNguoiThucHien_Id;
        //var dLaCanBoNgoaiTruong = obj.dLaCanBoNgoaiTruong;
        //var strTinhTrangNhanSu_Id = obj.strTinhTrangNhanSu_Id;

        var obj_save = {
            'action': 'NS_HoSo_V2_MH/DSA4BRIPKSAvEjQeCS4SLh43cwPP',
            'func': 'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2',
            'iM': edu.system.iM,
            'strTuKhoa': obj.strTuKhoa,
            'strDaoTao_CoCauToChuc_Id': obj.strCoCauToChuc_Id,
            'dLaCanBoNgoaiTruong': obj.dLaCanBoNgoaiTruong,
            'strTinhTrangNhanSu_Id': obj.strTinhTrangNhanSu_Id,
            'strChucVu_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': obj.pageIndex,
            'pageSize': obj.pageSize,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve == "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback == "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve == "function") {
                            resolve([]);
                        }
                        else if (typeof callback == "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    /*
    -- author: nnthuong
    -- discription: [Notify] Get data from db 
    -- date: 30/07/2018
    */
    getList_Notify: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [Queue] Get data from db 
    -- date: 30/07/2018
    */
    getList_Queue: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [SinhVien] Get data from db 
    -- date: 30/07/2018
    */
    getList_SinhVien: function (obj, resolve, reject, callback) {
        var me = this;
        //--------------------------Usage------------------------------------
        //var obj = {
        //    strHeDaoTao_Id: "",
        //    strKhoaDaoTao_Id: "",
        //    strChuongTrinh_Id: "",
        //    strLopQuanLy_Id: "",
        //    strTuKhoa: "",
        //    pageIndex: 1,
        //    pageSize: 1000000
        //};
        //edu.system.getList_SinhVien(obj, resolve, reject, callback);

        //var strHeDaoTao_Id = edu.util.returnEmpty(obj.strHeDaoTao_Id);
        //var strKhoaDaoTao_Id = edu.util.returnEmpty(obj.strKhoaDaoTao_Id);
        //var strChuongTrinh_Id = edu.util.returnEmpty(obj.strChuongTrinh_Id);
        //var strLopQuanLy_Id = edu.util.returnEmpty(obj.strLopQuanLy_Id);
        //var strTuKhoa = edu.util.returnEmpty(obj.strTuKhoa);
        //var pageIndex = edu.util.returnZero(obj.pageIndex);
        //var pageSize = edu.util.returnZero(obj.pageSize);

        var obj_save = {
            'action': 'SV_HoSoHocVien_MH/DSA4BSAvKRIgIikJLhIu',
            'func': 'pkg_hosohocvien.LayDanhSachHoSo',
            'iM': edu.system.iM,
            'strTuKhoa': obj.strTuKhoa,
            'strHeDaoTao_Id': obj.strHeDaoTao_Id,
            'strKhoaDaoTao_Id': obj.strKhoaDaoTao_Id,
            'strChuongTrinh_Id': obj.strChuongTrinh_Id,
            'strLopQuanLy_Id': obj.strLopQuanLy_Id,
            'strQLSV_TrangThaiNguoiHoc_Id': '',
            'dLocTheoDuLieuImport': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        if (typeof resolve == "function") {
                            resolve(data.Data);
                        }
                        else if (typeof callback == "function") {
                            callback(data.Data, data.Pager);
                        }
                    }
                    else {
                        if (typeof resolve == "function") {
                            resolve([]);
                        }
                        else if (typeof callback == "function") {
                            callback([], 0);
                        }
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    /*
    -- author: nnthuong
    -- discription: [VaiTro] Get data from db 
    -- date: 30/07/2018
    */
    getList_VaiTro: function () {

    },
    /*
    -- author: nnthuong
    -- discription: [UNGDUNG] Get data from db 
    -- date: 02/06/2018
    */
    getListByUser_UngDung: function () {
        var me = this;
        var strNgonNgu_Id = me.langId;
        var strNguoiDung_Id = me.userId;
        
    },
    /*
    -- author: nnthuong
    -- discription: [CHUCNANG] Get data from db 
    -- date: 02/06/2018
    */
    checkChucNang: function () {
        var me = this;
        // [AUTO-THU-VAI] Tab mới mở để thủ vai SV: xoá sessionStorage kế thừa + xoá URL hash cũ để không có flow phụ nào đọc và mount chức năng cũ.
        console.log('[AUTO-THU-VAI][checkChucNang] start — pending =', localStorage.getItem('pendingThuVaiSV'), '| hash =', window.location.hash);
        try {
            if (localStorage.getItem('pendingThuVaiSV')) {
                console.log('[AUTO-THU-VAI][checkChucNang] có pending → clear sessionStorage + URL hash');
                sessionStorage.removeItem('strChucNang');
                sessionStorage.removeItem('strChucNang_Id');
                me.appId = null; me.appCode = null; me.rootPathReport = null;
                if (window.location.hash && window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }
            }
        } catch (ex) { console.error('[AUTO-THU-VAI][checkChucNang] clear err', ex); }
        if (!me.appId) {
            var strChucNang = sessionStorage.getItem("strChucNang");
            if (strChucNang) {
                var objChucNang = JSON.parse(strChucNang);
                me.appId = objChucNang.appId;
                me.appCode = objChucNang.appCode;
                me.rootPathReport = objChucNang.rootPathReport;
                me.getlistByUser_ChucNang();
                
            }
            var obj_save = {
                'action': 'CMS_QuanTri01_MH/DSA4BRIXICgVMy4PJjQuKAU0LyYP',
                'func': 'PKG_CORE_QUANTRI_01.LayDSVaiTroNguoiDung',
                'iM': edu.system.iM,
                'strChucNang_Id': '',
                'strNguoiThucHien_Id': edu.system.userId,
            };
            //default
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        data = data.Data;
                        me["dtUngDung"] = data;
                        console.log('[AUTO-THU-VAI][dtUngDung] loaded', (data || []).length, 'app(s)');
                        // [AUTO-THU-VAI] Nếu có yêu cầu thủ vai SV đang chờ (từ click SV bên cổng cán bộ) → xử lý và dừng render dashboard bình thường
                        try {
                            var strPending = localStorage.getItem('pendingThuVaiSV');
                            console.log('[AUTO-THU-VAI][dtUngDung] pendingThuVaiSV =', strPending);
                            if (strPending) {
                                var pending = JSON.parse(strPending);
                                localStorage.removeItem('pendingThuVaiSV');
                                if (pending && pending.strMSSV) {
                                    console.log('[AUTO-THU-VAI][dtUngDung] → gọi _autoThuVaiSV, pending =', pending);
                                    me._autoThuVaiSV(pending);
                                    return;
                                }
                            }
                        } catch (ex) { console.error('[AUTO-THU-VAI][dtUngDung] parse err', ex); }
                        var html = '';
                        var arrMau = ["#26465e", "#7aacf3", "#d36f51", "#0232b9", "#a12529", "#71b636", "#f94341", "#f6c531"];
                        data.forEach((e, index) => {
                            let strIconAnh = e.TENANH ? e.TENANH : 'fa-light fa-users-gear';
                            //html += '<div class="dashboad-item ungdung" id="' + e.ID + '">';
                            //html += '<a href="#" class="dashboad-item-box " style="border-color:' + arrMau[index % 8] + '">';
                            //html += '<div class="icon"><i class="' + strIconAnh +'"></i></div>';
                            //html += '<div class="dashboad-title ">';
                            //html += e.TENVAITRO;
                            //html += '</div>';
                            //html += '</a>';
                            //html += '</div>';
                            html += '<div class="item pointer ungdung" id="' + e.ID + '" style="cursor: pointer"><a class="action-box feature-box pointer" data-position="0" data-bg="7">';
                            html += '<div class="icon">';
                            html += '<i class="fa-light fa-chalkboard-user"></i>';
                            html += '</div>';
                            html += '<div class="feature-name">' + e.TENVAITRO + '</div>';
                            html += '</a></div>';
                        });
                        if (html) $("#zonedashbroad").html(html);
                        if (data.length === 1) {
                            me.setUngDung(data[0]);
                        }
                    }
                    else {
                        edu.system.alert(obj_save.action + " (er): " + data.Message);
                    }
                },
                error: function (er) {
                    //edu.system.alertOnModal(obj_notify);
                },
                type: "POST",
                action: obj_save.action,

                contentType: true,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        } else {
            return true;
        }
        
    },
    // [AUTO-THU-VAI] Tự động thủ vai 1 SV theo MSSV rồi mở chức năng chỉ định.
    // Được gọi khi user click 1 SV từ cổng cán bộ (module xét TN, học bổng, học vụ, ...).
    // Input: pending = { strMSSV, strHashChucNang } — hash chức năng dạng (chucNang_Id + appId).toLowerCase()
    _autoThuVaiSV: function (pending) {
        var me = this;
        console.log('[AUTO-THU-VAI][_autoThuVaiSV] start, dtUngDung =', me.dtUngDung);
        var objSV = (me.dtUngDung || []).find(function (e) { return e.CHOPHEPTHUVAI == 1; });
        console.log('[AUTO-THU-VAI][_autoThuVaiSV] objSV (CHOPHEPTHUVAI=1) =', objSV);
        if (!objSV) {
            console.warn('[AUTO-THU-VAI][_autoThuVaiSV] KHÔNG có ứng dụng nào CHOPHEPTHUVAI=1');
            edu.system.alert("Không tìm thấy ứng dụng cho phép thủ vai sinh viên.");
            return;
        }
        me["strNguoiThucVai_Id"] = edu.system.userId;
        var strTenVaiTro = objSV.TENVAITRO || objSV.TENUNGDUNG || 'sinh viên';
        var obj_save = {
            'action': 'CMS_QuanTri02_MH/CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP',
            'func': 'PKG_CORE_QUANTRI_02.KiemTraThongTinDinhDanh',
            'iM': edu.system.iM,
            'strThongTinDinhDanh': pending.strMSSV,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': objSV.ID,
            'strChucNangHeThong_Id': objSV.ID,
            'strHanhDong_Code': ''
        };
        console.log('[AUTO-THU-VAI][_autoThuVaiSV] call KiemTraThongTinDinhDanh, MSSV =', pending.strMSSV);
        me.makeRequest({
            success: function (data) {
                console.log('[AUTO-THU-VAI][KiemTraThongTinDinhDanh] response', data);
                if (!data.Success) { edu.system.alert(data.Message || 'Không tìm được sinh viên.'); return; }
                var rs = [];
                if (data.Data && data.Data.rs) rs = data.Data.rs;
                else if (Array.isArray(data.Data)) rs = data.Data;
                console.log('[AUTO-THU-VAI][KiemTraThongTinDinhDanh] rs.length =', rs.length, rs);
                if (!rs.length) { edu.system.alert('Không tìm thấy sinh viên có MSSV: ' + pending.strMSSV); return; }
                var record = rs[0];
                edu.system.userId = record.ID || record.Id || record.id;
                edu.system.currentThuVai = {
                    ten: record.FULLNAME || record.HOTEN || record.HoTen || record.ten || '',
                    ma: record.NAME || record.MSSV || record.MA || record.ma || '',
                    email: record.EMAIL || record.Email || record.email || '',
                    tenVaiTro: strTenVaiTro
                };
                edu.system._saveThuVaiSession();
                console.log('[AUTO-THU-VAI][_autoThuVaiSV] set userId =', edu.system.userId, '| currentThuVai =', edu.system.currentThuVai);
                // Nếu có yêu cầu mở chức năng cụ thể → set trước vào sessionStorage để setUngDung → menu load xong sẽ tự trigger (systemroot.js:6276-6277)
                if (pending.strHashChucNang) {
                    var strHash = String(pending.strHashChucNang).toLowerCase();
                    var strAppIdLower = String(objSV.ID || '').toLowerCase();
                    var strChucNang_IdLower = strHash;
                    if (strAppIdLower && strHash.indexOf(strAppIdLower) === 0) {
                        strChucNang_IdLower = strHash.substring(strAppIdLower.length);
                    } else if (strAppIdLower && strHash.length > strAppIdLower.length && strHash.substring(strHash.length - strAppIdLower.length) === strAppIdLower) {
                        strChucNang_IdLower = strHash.substring(0, strHash.length - strAppIdLower.length);
                    }
                    me._pendingChucNang_IdLower = strChucNang_IdLower;
                    console.log('[AUTO-THU-VAI][_autoThuVaiSV] _pendingChucNang_IdLower =', strChucNang_IdLower, '(strip appId', strAppIdLower, 'khỏi', strHash + ')');
                }
                console.log('[AUTO-THU-VAI][_autoThuVaiSV] → setUngDung objSV');
                me.setUngDung(objSV);
            },
            error: function (er) { console.error('[AUTO-THU-VAI][KiemTraThongTinDinhDanh] err', er); edu.system.alert('Lỗi thủ vai: ' + JSON.stringify(er)); },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    setUngDung: function (objUngDung) {
        var me = this;
        var objChucNang = {
            appId: objUngDung.ID,
            appCode: objUngDung.MAUNGDUNG,
            rootPathReport: objUngDung.TENFILEDINHKEM
        };
        me.appId = objChucNang.appId;
        me.appCode = objChucNang.appCode;
        me.rootPathReport = objUngDung.TENFILEDINHKEM;
        me.getlistByUser_ChucNang();
        sessionStorage.setItem("strChucNang", JSON.stringify(objChucNang));
        try {

            setTimeout(function () {
                //console.log($("#sidebar-menu").is(":visible"));
                //console.log($("body .main-wrap").length)
                //console.log($("body .sidebar-toggle").length)
                //console.log(!$("body .main-wrap").first().hasClass("sidebar-toggle"))
                if (window.innerWidth < 1281) {
                    //console.log(1234444444);
                    $(".top-nav .sidebar-bars").trigger("click");

                }
            }, 500)


        } catch {

        }
    },
    getlistByUser_ChucNang: function () {
        var me = this;
        if (!me.checkChucNang()) return;
        var obj_save = {
            'action': 'CMS_QuanTri01_MH/DSA4BRICKTQiDyAvJg8mNC4oBTQvJgPP',
            'func': 'PKG_CORE_QUANTRI_01.LayDSChucNangNguoiDung',
            'iM': edu.system.iM,
            'strChucNang_Id': '',
            'strVaiTro_Id': me.appId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    if (dtResult.length == 0) {
                        me.appId = "";
                        sessionStorage.removeItem('strChucNang');
                        sessionStorage.removeItem('strChucNang_Id');
                        //if (!me.checkChucNang()) return;
                        //location.reload();
                    } else {

                        me.dtChucNang = dtResult.rs;
                        me.genHTML_MenuVertical(dtResult.rs);
                        //me.getList_ChucNangTheoPhanLoai();
                        //me.save_KiemTraThongBao();
                        //if (me.objApi["urlKhaoSat"]) me.save_KiemTraTaiKhoan();
                    }
                }
                else {
                    me.alert("CM_ChucNang/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                me.alert("CM_ChucNang/LayDanhSach: " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ChucNangTheoPhanLoai: function () {
        var me = this;

        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung_MH/DSA4BRICKTQiDyAvJhUpJC4RKSAvDS4gKAPP',
            'func': 'pkg_chung_quanlynguoidung.LayDSChucNangTheoPhanLoai',
            'iM': edu.system.iM,
            'strNguoiDung_Id': me.userId,
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    data = data.Data;
                    var html = '';
                    var arrMau = ["#26465e", "#7aacf3", "#d36f51", "#0232b9", "#a12529", "#71b636", "#f94341", "#f6c531"];
                    data.forEach((e, index) => {
                        var strHref = e.CHUCNANG_DUONGDANFILE && e.CHUCNANG_DUONGDANFILE.indexOf("http") == 0 ? 'href="' + e.CHUCNANG_DUONGDANFILE + '" target="_blank"' : 'href="#" ';
                        html += '<div class="dashboad-item chucnang" id="' + e.CHUCNANG_ID + '">';
                        html += '<a ' + strHref + ' class="dashboad-item-box " style="border-color:' + arrMau[index % 8] + '">';
                        html += '<img src="' + e.CHUCNANG_TENANH + '" alt="' + e.CHUCNANG_TENANH + '">';
                        html += '<div class="dashboad-title ">';
                        html += e.CHUCNANG_TEN;
                        html += '</div>';
                        html += '</a>';
                        html += '</div>';
                    });
                    $("#zonedashbroad").html(html);
                }
                else {
                    $("#zonedashbroad").html("");
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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
    /*
    -- author: nnthuong
    -- discription: [NGONNGU] Get data from db 
    -- date: 02/06/2018
    */
    getList_NgonNgu: function () {
        var me = this;
        
    },
    /*
    -- author: nnthuong
    -- discription: [DANHMUC] Get data from db and load to COMBO
    -- date: 02/06/2018
    */
    loadToCombo_DanhMucDuLieu: function (strCode, zone_id, type, callback, title, strTenCotSapXep, default_val) {
        //--------------------------Usage------------------------------------
        //edu.system.loadToCombo_DanhMucDuLieu(strCode, zone_id, type);
        if (strTenCotSapXep == undefined) strTenCotSapXep = "";
        var me = this;
        if (!edu.util.checkValue(type)) {
            type = "";
        }
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (edu.util.checkValue(jsonResult)) {
                        //zone_id 
                        var zoneId = zone_id.split(",");
                        //call
                        var obj = {
                            data: jsonResult,
                            renderPlace: zoneId,
                            type: type,
                            title: title,
                            default_val: default_val
                        };
                        me.loadToCombo_data(obj);
                    }
                    if (typeof callback === "function") {
                        callback(jsonResult);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTieuChiSapXep': strTenCotSapXep,
                'dTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    loadToList_DanhMucDuLieu: function (strCode, zone_id, type, callback, title, strTenCotSapXep) {
        //--------------------------Usage------------------------------------
        //edu.system.loadToCombo_DanhMucDuLieu(strCode, zone_id, type);
        if (strTenCotSapXep == undefined) strTenCotSapXep = "";
        var me = this;
        //if (!edu.util.checkValue(type)) {
        //    type = "12";
        //}
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (edu.util.checkValue(jsonResult)) {
                        //zone_id 
                        var row = '';
                        //call
                        if (typeof callback === "function") {
                            callback(jsonResult);
                            return;
                        }
                        if (type == undefined) {
                            type = jsonResult.length;
                        }
                        if (typeof (type) == 'object' && type.length == jsonResult.length) {
                            for (var i = 0; i < jsonResult.length; i++) {
                                row += '<div class="col-sm-' + type[i] + '"><a class="btn btn-white btnSelectInList" id="' + jsonResult[i].ID + '" href="#" >' + jsonResult[i].TEN + ' </a></div>';
                            }
                            $("#" + zone_id).html(row);
                            return;
                        }
                        for (var i = 0; i < jsonResult.length; i++) {
                            row += '<div class="col-sm-' + type + '"><a class="btn btn-white btnSelectInList" id="' + jsonResult[i].ID + '" href="#" >' + jsonResult[i].TEN + ' </a></div>';
                        }
                        $("#" + zone_id).html(row);
                    }
                    me.endLoading();
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTieuChiSapXep': strTenCotSapXep,
                'dTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    loadToRadio_DMDL: function (strCode, zone_id, type, callback, title, strTenCotSapXep) {
        //--------------------------Usage------------------------------------
        //edu.system.loadToCombo_DanhMucDuLieu(strCode, zone_id, type);
        if (strTenCotSapXep == undefined) strTenCotSapXep = "";
        var me = this;
        //if (!edu.util.checkValue(type)) {
        //    type = "12";
        //}
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (edu.util.checkValue(jsonResult)) {
                        //zone_id 
                        var row = '';
                        //call
                        if (typeof callback === "function") {
                            callback(jsonResult);
                            return;
                        }
                        if (type == undefined) {
                            type = 12/(jsonResult.length);
                        }
                        if (typeof (type) == 'object' && type.length == jsonResult.length) {
                            for (var i = 0; i < jsonResult.length; i++) {
                                row += '<div class="col-sm-' + type[i] + '"><input id="' + jsonResult[i].ID + '" type="radio" name="' + jsonResult[i].CHUNG_TENDANHMUC_MA + '" value="' + jsonResult[i].MA + '"><label for="' + jsonResult[i].ID + '"> ' + jsonResult[i].TEN + '</label></div>';
                            }
                            $("#" + zone_id).html(row);
                            return;
                        }
                        for (var i = 0; i < jsonResult.length; i++) {
                            row += '<div class="col-sm-' + type + '"><input id="' + jsonResult[i].ID + '" type="radio" name="' + jsonResult[i].CHUNG_TENDANHMUC_MA + '" value="' + jsonResult[i].MA + '"><label for="' + jsonResult[i].ID + '"> ' + jsonResult[i].TEN + '</label></div>';
                        }
                        $("#" + zone_id).html(row);
                    }
                    me.endLoading();
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTieuChiSapXep': strTenCotSapXep,
                'dTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    loadToCheckBox_DMDL: function (strCode, zone_id, type, callback, title, strTenCotSapXep) {
        //--------------------------Usage------------------------------------
        //edu.system.loadToCombo_DanhMucDuLieu(strCode, zone_id, type);
        if (strTenCotSapXep == undefined) strTenCotSapXep = "";
        var me = this;
        //if (!edu.util.checkValue(type)) {
        //    type = "12";
        //}
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (edu.util.checkValue(jsonResult)) {
                        //zone_id 
                        var row = '';
                        //call
                        if (typeof callback === "function") {
                            callback(jsonResult);
                            return;
                        }
                        if (type == undefined) {
                            type = 12 / (jsonResult.length);
                        }
                        if (typeof (type) == 'object' && type.length == jsonResult.length) {
                            for (var i = 0; i < jsonResult.length; i++) {
                                row += '<div class="col-sm-' + type[i] + '"><input id="' + jsonResult[i].ID + '" type="checkbox" name="' + jsonResult[i].CHUNG_TENDANHMUC_MA + '" value="' + jsonResult[i].MA + '"><label for="' + jsonResult[i].ID + '"> ' + jsonResult[i].TEN + '</label></div>';
                            }
                            $("#" + zone_id).html(row);
                            return;
                        }
                        for (var i = 0; i < jsonResult.length; i++) {
                            row += '<div class="col-sm-' + type + '"><input id="' + jsonResult[i].ID + '" type="checkbox" name="' + jsonResult[i].CHUNG_TENDANHMUC_MA + '" value="' + jsonResult[i].MA + '"><label for="' + jsonResult[i].ID + '"> ' + jsonResult[i].TEN + '</label></div>';
                        }
                        $("#" + zone_id).html(row);
                    }
                    me.endLoading();
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTieuChiSapXep': strTenCotSapXep,
                'dTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DMDL_Cap1: function (strCode, zone_id, type) {
        //--------------------------Usage------------------------------------
        //edu.system.genCombo_DMDL_Cap1(strCode, zone_id, type);
        var me = this;
        if (!edu.util.checkValue(type)) {
            type = "";
        }
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (edu.util.checkValue(jsonResult)) {
                        //zone_id 
                        var zoneId = zone_id.split(",");
                        //call
                        var obj = {
                            data: jsonResult,
                            renderPlace: zoneId,
                            type: type
                        };
                        me.loadToCombo_data(obj);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': strCode,
                'strTieuChiSapXep': ""
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DMDL_TheoCha: function (strCode, strCha_Id, zone_id, type) {
        //--------------------------Usage------------------------------------
        //edu.system.genCombo_DMDL_TheoCha(strCode, strCha_Id, zone_id, type);
        var me = this;
        if (!edu.util.checkValue(type)) {
            type = "";
        }
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var jsonResult = data.Data;
                    if (edu.util.checkValue(jsonResult)) {
                        //zone_id 
                        var zoneId = zone_id.split(",");
                        //call
                        var obj = {
                            data: jsonResult,
                            renderPlace: zoneId,
                            type: type
                        };
                        me.loadToCombo_data(obj);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + strCode + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strCha_Id': strCha_Id,
                'strTuKhoa': "",
                'strDanhMucTenBang_Id': strCode,
                'strTieuChiSapXep': "",
                'pageIndex': 1,
                'pageSize': 100000,
                'iTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    setItemDefault_DanhMuc: function (strMaBangDanhMuc, zone_id, strMaDuLieu) {
        var me = this;
        
    },
    getList_DLDM_Cache: function (strDanhMuc_Ma) {
        var me = this;
        var strMaBangDanhMuc = strDanhMuc_Ma;
        if (!edu.util.objEqualVal(me.dataCache, "key", strDanhMuc_Ma)) {//still not cache yet
            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var dtResult = [];
                        var obj = {};
                        if (edu.util.checkValue(data.Data)) {
                            dtResult = data.Data;
                            obj = {
                                key: strDanhMuc_Ma,
                                data: dtResult
                            };
                            //1. push current data
                            me.dataCache.push(obj);
                            //2. cache
                            me.setCache_LocalStore("dataCache", me.dataCache);
                        }
                    }
                    
                },
                error: function (er) {
                    me.endLoading();
                },
                type: 'GET',
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                
                contentType: true,
                async: false,
                //authen: false,
                data: {
                    'strMaBangDanhMuc': strMaBangDanhMuc,
                    'strTieuChiSapXep': "",
                    'dTrangThai': 1
                },
                fakedb: [

                ]
            }, false, false, false, null);
        }
        
    },
    /*
    -- author: nnthuong
    -- discription: [DANHMUC] Get data from db and load to RADIO
    -- date: 24/11/2018
    */
    loadToRadio_DanhMucDuLieu: function (obj) {
        var me = this;
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var dtResult = $.parseJSON(mystring);
                    if (edu.util.checkValue(dtResult)) {
                        //load to radio
                        var objParam = {
                            data: dtResult,
                            renderPlace: obj.renderPlace,
                            name: obj.nameRadio,
                            title: obj.title
                        }
                        me.loadToRadio_data(objParam);
                    }
                }
                else {
                    me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + obj.code + ": " + data.Message, "w");
                    me.endLoading();
                }
            },
            error: function (er) {
                me.alert("CM_DanhMucDuLieu/LayDanhSach (er)-" + obj.code + ": " + JSON.stringify(er), "w");
                me.endLoading();
            },
            type: 'GET',
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            
            contentType: true,
            //authen: false,
            data: {
                'strMaBangDanhMuc': obj.code,
                'strTieuChiSapXep': "",
                'dTrangThai': 1
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*
     **************************************************************************
     ********* orde: [4]*******************************************************
     ********* name: GEN HTML *************************************************
     ********* disc: **********************************************************
     **************************************************************************
     */
    /*
    -- author: nnthuong
    -- discription: modal
    -- date: 02/06/2018
    */
    updateModal: function (obj, objHTML) {
        var selected_id = obj.id;
        objHTML.tl_update = '<i class="fa fa-pencil color-active"></i> Cập nhật dữ liệu';
        if (selected_id == "" || selected_id == null || selected_id == undefined) {
            selected_id = "";
            return selected_id;
        }
        else {
            $("#myModalLabel").html(objHTML.tl_update);
            var btn_Id = "#" + objHTML.btn_save_id;
            $(btn_Id).html('<i class="fa fa-ellipsis-h"></i> Cập nhật');
            return selected_id;
        }
    },
    copyModal: function (objHTML) {
        objHTML.tl_copy = "<i class='fa fa-clipboard color-active'></i> Sao chép dữ liệu";
        var btn_Id = "#" + objHTML.btn_save_id;
        $("#myModalLabel").html(objHTML.tl_copy);
        $(btn_Id).html('<i class="fa fa-clipboard"></i> ' + objHTML.btn_save_tl);
    },
    createModal: function (objHTML) {
        objHTML.tl_addnew = "<i class='fa fa-pencil color-active'></i> Thêm mới dữ liệu";
        var btn_Id = "#" + objHTML.btn_save_id;
        $("#myModalLabel").html(objHTML.tl_addnew);
        $(btn_Id).html('<i class="fa fa-pencil"></i> ' + objHTML.btn_save_tl);
    },
    /*
    -- author: nnthuong
    -- discription: Notify, Alert, Confirm
    -- date: 02/06/2018
    */
    alert: function (content, code) {
        var me = this;
        var alert = "";
        var title = "";
        if (content === null || content === undefined) return;
        if (typeof content === "string") {
            var _viKey = content.trim().toLowerCase();
            if (me.viMessageMap && me.viMessageMap[_viKey]) content = me.viMessageMap[_viKey];
        }
        main();
        function main() {
            switch (code) {
                case "w":
                    title = '<i class="fa fa-exclamation-triangle fa-notify fa-warning"> ' + edu.constant.getting("LABLE", "CODE_W") + '</i>';
                    genBox_Alert();
                    break;
                case "h":
                    title = '<i class="fa fa-question-circle fa-notify fa-help"> ' + edu.constant.getting("LABLE", "CODE_H") + '</i>';
                    genBox_Alert();
                    break;
                default:
                    title = '<i class="fa fa-info-circle fa-default"> ' + edu.constant.getting("LABLE", "CODE_I") + '</i>';
                    genBox_Alert();
                    break;
            }
        }
        function genBox_Alert() {
            if (!me.flag_alert) {
               

                alert += '<div class="modal fade modal-alert" id="myModalAlert">';
                alert += '<div class="modal-dialog modal-dialog-centered">';
                alert += '<div class="modal-content">';
                alert += '<div class="modal-header">';
                alert += '<h5 class="modal-title">' + title + '</h5>';
                alert += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                alert += '</div>';
                alert += '<div class="modal-body text-center" id="alert_content">';
                alert += '</div>';
                alert += '<div class="modal-footer">';
                confirm += '<button type="button" class="btn btn-primary" id="btnYes" style="display: none"><i class="fas fa-check-circle"></i> Yes</button>';
                alert += '<button type="button" class="btn btn-default" data-bs-dismiss="modal"><i class="fa fa-times" aria-hidden="true"> Đóng</i></button>';
                alert += '</div>';
                alert += '</div>';
                alert += '</div>';
                alert += '</div>';

                $("#alert").html(alert);
                $('#alert>#myModalAlert').modal('show');
                genContent_Alert();
                me.flag_alert = true;

                $("#btnYes").hide();
                var myModalEl = document.getElementById('myModalAlert')
                if (myModalEl) {
                    myModalEl.addEventListener('hidden.bs.modal', function (event) {
                        $("#myModalAlert").remove();
                        me.flag_alert = false;
                        me.arrcheckcontent = [];
                        me.arrStt = [];
                        // do something...
                    })
                }

            }
            else {
                genContent_Alert();
            }
        }
        function genContent_Alert() {
            var strhtmlcontent = change_alias(content);
            var iThuTu = me.arrcheckcontent.indexOf(strhtmlcontent);
            if (iThuTu == -1) {
                var hasHtmlTag = /<\s*\/?\s*[a-z][a-z0-9]*[\s>\/]/i.test(String(content));
                var $p = hasHtmlTag ? $('<p>').html(content) : $('<p>').text(content);
                $p.append(' ').append($('<span>').attr('id', strhtmlcontent));
                $('#myModalAlert #alert_content').append($p);
                me.arrcheckcontent.push(strhtmlcontent);
                me.arrStt.push(1);
            } else {
                var iSoLuong = me.arrStt[iThuTu] + 1;
                me.arrStt[iThuTu] = iSoLuong;
                $("#" + strhtmlcontent).html("(" + iSoLuong + ")");
            }
        };
        function change_alias(alias) {
            var str = alias;
            str = str.toLowerCase();
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");
            str = str.replace(/ + /g, "");
            str = str.replace(/ /g, "");
            return str;
        }
    },
    confirm: function (content, code) {
        var me = this;
        //$(".wrapper>#alert").html('');
        var confirm = "";
        var title = "";
        switch (code) {
            case "w":
                title = '<i class="fa fa-exclamation-triangle fa-notify fa-warning"> ' + edu.constant.getting("LABLE", "CODE_W") + '</i>';
                break;
            case "h":
                title = '<i class="fa fa-question-circle fa-help"> ' + edu.constant.getting("LABLE", "CODE_H") + '</i>';
                break;
            case "q":
                title = '<i class="fa fa-question-circle fa-default"> ' + edu.constant.getting("LABLE", "CODE_Q") + '</i>';
                break;
            default:
                title = '<i class="fa fa-info-circle fa-default"> ' + edu.constant.getting("LABLE", "CODE_I") + '</i>';
                break;
        }
        genBox_Alert();
        function genBox_Alert() {
            if (!me.flag_alert) {

                confirm += '<div class="modal fade modal-delete-file" id="myModalAlert" tabindex="-1" aria-labelledby="myModalAlert" aria-hidden="true">';
                confirm += '<div class="modal-dialog modal-dialog-centered">';
                confirm += '<div class="modal-content">';
                confirm += '<div class="modal-header">';
                confirm += '<h5 class="modal-title">' + title + '</h5>';
                confirm += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
                confirm += '</div>';
                confirm += '<div class="modal-body text-center" id="alert_content">';
                confirm += '</div>';
                confirm += '<div class="modal-footer">';
                confirm += '<button type="button" class="btn btn-primary" id="btnYes"><i class="fas fa-check-circle"></i> Yes</button>';
                confirm += '<button type="button" class="btn btn-default" data-bs-dismiss="modal"><i class="fa fa-times" aria-hidden="true"> </i> Đóng</button>';
                confirm += '</div>';
                confirm += '</div>';
                confirm += '</div>';
                confirm += '</div>';
                $("#alert").html(confirm);
                $('#alert>#myModalAlert').modal('show');
                me.flag_alert = true;
                var myModalEl = document.getElementById('myModalAlert');
                if (myModalEl) {
                    myModalEl.addEventListener('hidden.bs.modal', function (event) {
                        $("#myModalAlert").remove();
                        me.flag_alert = false;
                        me.arrcheckcontent = [];
                        me.arrStt = [];
                        // do something...
                    })
                }
                $("#btnYes").click(function (e) {
                    $("#btnYes").hide();
                    if ($("#alert_content").html().indexOf('<input') == -1) $("#alert_content").html("");
                });
            }
            if (document.getElementById("btnYes") == undefined) $("#myModalAlert .modal-footer").prepend('<button type="button" class="btn btn-primary" id="btnYes"><i class="fa fa-check-circle"></i> ' + edu.constant.getting("BUTTON", "YES") + '</button>');
            $('#myModalAlert #alert_content').append('<p>' + content + '</p>');
            $("#btnYes").show();

        }
    },
    afterComfirm: function (objHTML) {
        var me = this;
        me.alert(objHTML.content, objHTML.code);
    },
    alertOnModal: function (obj) {
        var me = this;

        $("#btnNotifyModal").remove();
        //select type
        switch (obj.type) {
            case "s":
                obj.type = "alert-success";
                break;
            case "i":
                obj.type = "alert-info";
                break;
            case "w":
                obj.type = "alert-warning";
                break;
            default:
                obj.type = "";
        }
        //title default
        if (obj.title == "" || obj.title == undefined || obj.title == null) {
            obj.title = "Thông báo";
        }
        //notifyZone default
        if (obj.prePos == "" || obj.prePos == undefined || obj.prePos == null) {
            obj.prePos = "#notify";
        }
        var pointPos = $(obj.prePos);
        pointPos.show();
        if (pointPos.is(":hidden") || pointPos.length == 0) {
            var x = $(".modal-content");
            for (var i = 0; i < x.length; i++) {
                var check = x.find("#notify");
                if (check.length > 0 && check.is(":visible")) pointPos = check;
                break;
            }
            if (pointPos.is(":hidden") || pointPos.length == 0) {
                me.alert(obj.content, obj.type);
                return;
            }
        }
        //gen html
        var html = "<div id='btnNotifyModal' class='alert " + obj.type + " alert-dismissible' style='text-align:center;'>" +
            "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
            "<strong><span style='font-size:16px;'>" + obj.title + ": " + obj.content + "</span></strong>" +
            "</div>";
        pointPos.append(html);
        pointPos.slideDown("slow");
        setTimeout(function () {
            pointPos.append("");
            pointPos.slideUp("slow");
        }, 2500);
        /*colorCode: - 'alert-danger' - 'alert-dismissible' - 'alert-info' - 'alert-link' - 'alert-success'- 'alert-warning' */
    },
    alertTimer: function (obj) {
        var me = this;
        var html = "";
        var title = "";
        var content = "";
        var time = "";
        //check exist
        if (edu.util.checkValue(obj.title)) {
            title = obj.title;
        }
        else {
            title = edu.constant.getting("LABLE", "CODE_I");
        }
        if (edu.util.checkValue(obj.content)) {
            content = obj.content;
        }
        else {
            title = edu.constant.getting("NOTIFY", "PROCESS_S");
        }
        if (edu.util.checkValue(obj.time)) {//check exist
            if (edu.util.intValid(obj.time)) {//check interger type
                time = obj.time;
            }
            else {
                time = 2000;
            }
        }
        else {
            time = 2000;
        }
        //
        $(".alert_timer").html(html);
        html += '<li class="header">';
        html += '<span>' + title + ': </span>';
        html += '<span id="">' + content + '</span>';
        html += '</li>';

        $(".alert_timer").append(html);
        $(".alert_timer").fadeIn(500);
        setTimeout(function () {
            $(".alert_timer").fadeOut(1000);
        }, time);
    },
    notifyLocal: function (obj) {
        var me = this;

        var title = obj.title;
        var renderPlace = obj.renderPlace;
        var type = obj.type;
        var autoClose = obj.autoClose;
        var content_html_befor = "";
        var class_event_befor = "";
        //-----------------------------
        main();
        //-----------------------------
        function main() {
            //[0] call funtion tem
            check_param_input();
            color_warning();
            //[1] get content befor show notity (value same all)
            content_html_befor = $("#" + renderPlace).html();
            class_event_befor = $("#" + renderPlace).attr("class");
            //[2] show notify and remove class_event
            $("#" + renderPlace).html('<span class="' + type + ' notify">' + title + ' <a class="btn btn-default btn-circle btnClose" id="closeZone_' + renderPlace + '"><i class="fa fa-times-circle"></i></a></span>');
            $("#" + renderPlace).removeClass(class_event_befor);
            //[3] return back content befor and class_event and remove notity
            if (autoClose) {
                setTimeout(function () {
                    recover(renderPlace);
                }, 1200);
            }
            else {
                $("#" + renderPlace).delegate(".btnClose", "click", function () {
                    var closeZone_id = this.id;
                    closeZone_id = edu.util.cutPrefixId(/closeZone_/g, closeZone_id);
                    recover(closeZone_id);
                });
            }
        }
        function check_param_input() {
            //[1] check param input
            if (!edu.util.checkValue(title)) {
                title = "";
            }
            if (!edu.util.checkId(renderPlace)) {
                return false;
            }
            if (!edu.util.checkValue(autoClose)) {
                autoClose = false;
            }
            if (!edu.util.checkValue(type)) {
                type = "";
            }
        }
        function color_warning() {
            //[2] color_warning
            switch (type) {
                case "s":
                    //success
                    type = "badge bg-green";
                    break;
                case "w":
                    //warning
                    type = "badge bg-yellow";
                    break;
                case "d":
                    //danger
                    type = "badge bg-red";
                    break;
                default:
                    //info
                    type = "";
            }
        }
        function recover(closeZone) {
            $("#" + closeZone).html(content_html_befor);
            $("#" + closeZone).addClass(class_event_befor);
            $("#" + closeZone + ">.notify").remove('');
        }
    },
    /*
    -- author: 
    -- discription: datePicker
    -- date: 02/06/2018
    */
    pickerdate: function (strClassName) {
        var me = this;
        try {
            if (strClassName == undefined || strClassName == null || strClassName == "")
                strClassName = "input-datepicker";
            var x = document.getElementsByClassName(strClassName);
            //$("." + strClassName).datepicker({ dateFormat: 'dd/mm/yy' });
            for (var i = 0; i < x.length; i++) {
                var cleave = new Cleave(x[i], {
                    date: true,
                    datePattern: ['d', 'm', 'Y']
                });
            }
        } catch{

        }
        
    },
    lunarCalendar: function (place) {
        var me = this;
        var place = "." + place;
        $(place).append('<IFRAME src="' + me.rootPath + '/App_Themes/Plugins/amlich-js/currentmonth.html" style="width:100%; height: 250px" name="CurentMonth" scrolling="no" frameborder=0></IFRAME>');
    },
    pickerNumber: function (strClassName, thousand) {
        if (!strClassName) strClassName = "input-number";
        var x = document.getElementsByClassName(strClassName);
        for (var i = 0; i < x.length; i++) {
            new Cleave(x[i], {
                numeral: true,
                numeralThousandsGroupStyle: thousand
            })
            
        }
    },
    /*
    -- author: nnthuong
    -- discription: date to combo
    -- date: 11/10/2018
    */
    dateYearToCombo: function (year, dropName, title, activeOption) {
        //year: display the starting year, ex 1930, 1990... until this year
        var me = this;
        var dropControl = "";
        if (activeOption === undefined) activeOption = edu.util.thisYear();
        //only one dropName
        if (dropName.indexOf(",") == -1) {
            dropControl = "#" + dropName;
            $(dropControl).html("");
            if (title == "" || title == null || title == undefined) {
                title = "-- Chọn dữ liệu --";
            }
            else {
                title = "-- " + title + " --";
            }
            $(dropControl).append($('<option value=""></option>').html(title));
            for (i = new Date().getFullYear() + 5; i > year; i--) {
                $(dropControl).append($('<option />').val(i).html(i));
            }
            //plugin select2 need these code below more.
            $(".chosen-select").select();
            $(dropControl).val(activeOption).trigger("change");
        }
        //dropNames
        else {
            dropControl = dropName.split(",");
            for (var i = 0; i < dropControl.length; i++) {
                dropControl[i] = "#" + dropControl[i];
                $(dropControl[i]).html("");
                if (title == "" || title == null || title == undefined) {
                    title = "-- Chọn dữ liệu --";
                }
                else {
                    title = "-- " + title + " --";
                }
                $(dropControl[i]).append($('<option value=""></option>').html(title));
                for (j = new Date().getFullYear(); j > year; j--) {
                    $(dropControl[i]).append($('<option />').val(j).html(j));
                }
                //plugin select2 need these code below more.
                $(".chosen-select").select();
                $(dropControl[i]).val(activeOption).trigger("change");
            }
        }

    },
    dateMonthToCombo: function (dropName, title) {
        //month: display the month
        var me = this;
        var dropControl = "";
        var d = new Date();
        var activeOption = "" + (d.getMonth() + 1);
        var month_text = 0;
        var month_val = 0;
        if (dropName.indexOf(",") == -1) {  //only one dropName
            dropControl = "#" + dropName;
            $(dropControl).html("");
            if (title == "" || title == null || title == undefined) {
                title = "-- Chọn dữ liệu --";
            }
            else {
                title = "-- " + title + " --";
            }
            $(dropControl).append($('<option value=""></option>').html(title));
            for (i = 0; i < 12; i++) {
                month_text = edu.util.addZeroToDate(i + 1);
                month_val = i + 1;
                $(dropControl).append($('<option />').val(month_val).html(month_text));
            }
            //plugin select2 need these code below more.
            $(".chosen-select").select();
            $(dropControl).val(activeOption).trigger("change");
        }
        else {                              //arr dropName seprate by ','
            dropControl = dropName.split(",");
            for (var i = 0; i < dropControl.length; i++) {
                dropControl[i] = "#" + dropControl[i];
                $(dropControl[i]).html("");
                if (title == "" || title == null || title == undefined) {
                    title = "-- Chọn dữ liệu --";
                }
                else {
                    title = "-- " + title + " --";
                }
                $(dropControl[i]).append($('<option value=""></option>').html(title));
                for (j = 0; j < 12; j++) {
                    month = edu.util.addZeroToDate(j + 1);
                    $(dropControl[i]).append($('<option />').val(month).html(month));
                }
                //plugin select2 need these code below more.
                $(".chosen-select").select();
                $(dropControl[i]).val(activeOption).trigger("change");
            }
        };
    },
    daysOfWeekToCombo: function (dropName, title) {
        //day: display the days of the week
        var me = this;
        var dropControl = "";
        //var activeOption = edu.util.thisDay();
        if (dropName.indexOf(",") == -1) {  //only one dropName
            dropControl = "#" + dropName;
            $(dropControl).html("");
            if (title == "" || title == null || title == undefined) {
                title = "-- Chọn dữ liệu --";
            }
            else {
                title = "-- " + title + " --";
            }
            $(dropControl).append($('<option value=""></option>').html(title));
            for (i = 2; i < 9; i++) {
                if (i < 8) {
                    $(dropControl).append($('<option />').val(i).html("T" + i));
                }
                else {
                    $(dropControl).append($('<option />').val(i).html("CN"));
                }
            }
            //plugin select2 need these code below more.
            $(".chosen-select").select();
            //$(dropControl).val(activeOption).trigger("change");
        }
        else {                              //arr dropName seprate by ','
            dropControl = dropName.split(",");
            for (var i = 0; i < dropControl.length; i++) {
                dropControl[i] = "#" + dropControl[i];
                $(dropControl[i]).html("");
                if (title == "" || title == null || title == undefined) {
                    title = "-- Chọn dữ liệu --";
                }
                else {
                    title = "-- " + title + " --";
                }
                $(dropControl[i]).append($('<option value=""></option>').html(title));
                for (j = 2; j < 9; j++) {
                    if (j < 8) {
                        $(dropControl[i]).append($('<option />').val(j).html("T" + j));
                    }
                    else {
                        $(dropControl).append($('<option />').val(i).html("CN"));
                    }
                }
                //plugin select2 need these code below more.
                $(".chosen-select").select();
                //$(dropControl[i]).val(activeOption).trigger("change");
            }
        };
    },
    /*
    -- author: nnthuong
    -- discription: Plugin Editor
    -- date: 02/06/2018
    */
    LoadEditor: function (editorName) {
        var me = this;
        if (typeof (CKEDITOR) != "undefined") {
            var configCK = {
                customConfig: '',
                height: '320px',
                width: '100%',
                language: 'vi',
                entities: false,
                fullPage: false,
                toolbarCanCollapse: false,
                resize_enabled: false,
                startupOutlineBlocks: true,
                colorButton_enableMore: false,
                toolbar:
                [
                    { name: 'document', items: ['Source'] },
                    { name: 'tools', items: ['Maximize'] },
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'TextColor', 'BGColor', 'Link', 'Unlink'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'Iframe', 'Preview'] },
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                ],
                filebrowserImageUploadUrl: me.rootPath + '/Editor/Upload.ashx',
                filebrowserBrowseUrl: me.rootPath + '/Editor/ckfinder/ckfinder.html'
            };
            var editor = CKEDITOR.replace(editorName, configCK);
            CKEDITOR.on('instanceReady', function (e) {
                CKFinder.setupCKEditor(editor, me.rootPath + '/Editor/ckfinder/');
            });
        }
    },
    LoadEditor_Basic: function (editorName) {
        var me = this;
        if (typeof (CKEDITOR) != "undefined") {
            var configCK = {
                customConfig: '',
                height: '320px',
                width: '100%',
                language: 'vi',
                entities: false,
                fullPage: false,
                toolbarCanCollapse: false,
                resize_enabled: false,
                startupOutlineBlocks: true,
                colorButton_enableMore: false,
                toolbar:
                [
                    { name: 'document', items: ['Source'] },
                    { name: 'tools', items: ['Maximize'] },
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'TextColor', 'BGColor'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
                    { name: 'insert', items: ['HorizontalRule', 'SpecialChar'] },
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                ],
                filebrowserImageUploadUrl: me.rootPath + '/App_Themes/Plugins/Upload.ashx',
                filebrowserBrowseUrl: me.rootPath + '/App_Themes/Plugins/ckfinder/ckfinder.html'
            };
            var editor = CKEDITOR.replace(editorName, configCK);
            CKEDITOR.on('instanceReady', function (e) {
                CKFinder.setupCKEditor(editor, me.rootPath + '/App_Themes/Plugins/ckfinder/');
            });
        }
    },
    /*
     -- author: nnthuong
     -- discription: Plugin Select 2 - for loading image into combo
     -- date: 02/06/2018
     */
    formatState: function (state) {
        if (!state.id) { return state.text; }
        var $state = $(
        '<span><img src="' + state.element.id + '" class="drop-img" /> ' + state.text + '</span>'
        );
        return $state;
    },
    /*
     -- author: nnthuong
     -- discription: HangDoi gen html taskbar/content
     -- date: 02/06/2018
     */
    taskControl: function (data) {
        var me = this;
        //1. initial params
        var $renderPlace = '#sysTask_Content';
        $($renderPlace).html("");
        var numberTask = 0;
        var html = '';
        var obj = {
            id: '',
            ten: '',
            iTongDuLieuDaHoanThanh: '',
            iTongDuLieuCanThucHien: '',
        }
        //2. main func
        for (var i = 0; i < data.length; i++) {
            html = '';
            obj = {};
            //create obj
            obj.id = data[i].ID;
            obj.ten = data[i].TEN;
            obj.iTongDuLieuDaHoanThanh = data[i].TONGDULIEUDAHOANTHANH;
            obj.iTongDuLieuCanThucHien = data[i].TONGDULIEUCANTHUCHIEN;
            //exclude finished ones
            if (obj.iTongDuLieuDaHoanThanh != obj.iTongDuLieuCanThucHien) {
                numberTask++;
                //1. gender khung task
                html = me.genHTML_TaskContent(obj);
                $($renderPlace).append(html);
                //2. update status
                me.updateStatus_Task(obj);
            }
        }
        $("#sysTask_Notify").html(numberTask);
    },
    genHTML_TaskContent: function (obj) {
        var $btnStart = 'btnStart_Queue';
        var $btn_bg = 'btn-primary';
        var html = '';
        html += '<div class="box-body" style="padding: 1px 3px">';
        html += '<div class="box" style="margin-bottom:0px; border-radius:0px;">';
        html += '<div class="box-body" style="padding-left:0px; padding-right:0px;">';
        html += '<div class="clearfix">';
        html += '<span class="pull-left">' + obj.ten + ' (<span id="task_items' + obj.id + '">' + obj.iTongDuLieuCanThucHien + '</span>)</span>';
        html += '<small id="task_lblpercent' + obj.id + '" class="pull-right" style="font-weight:bold; font-size:15px">0%</small>';
        html += '</div>';
        html += '<div class="progress progress-sm active" style="margin-bottom:0px;">';
        html += '<div id="task_percent' + obj.id + '" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%">';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    },
    updateStatus_Task: function (obj) {
        //get id
        var $task_lblpercent = "#task_lblpercent" + obj.id;
        var $task_percent = "#task_percent" + obj.id;
        //process
        var iPercent = ((obj.iTongDuLieuDaHoanThanh / obj.iTongDuLieuCanThucHien) * 100).toFixed(2);

        //update percent
        $($task_lblpercent).html(iPercent + "%");
        $($task_percent).css("width", iPercent + "%");
        if (obj.iTongDuLieuDaHoanThanh == obj.iTongDuLieuCanThucHien) {
            me.alert("Thông báo", "Tiến trình chạy thành công, tổng dữ liệu xử lý là " + obj.iTongDuLieuDaHoanThanh);
            me.getList_HangDoi();
        }
    },
    addEffect_Task: function ($task_percent) {
        $($task_percent).addClass("progress-bar-striped");
    },
    removeEffect_Task: function ($task_percent) {
        $($task_percent).removeClass("progress-bar-striped");
    },
    enableBtnStop_Queue: function (id) {
        //1. add class btnStart
        //2. add class btn-primary
        //3. remove class btn-default
        var $btnStart = "#start_queue_" + id;
        var $btnStop = "#stop_queue_" + id;

        $($btnStart).removeClass("btn-primary btnStart_Queue");
        $($btnStart).addClass("btn-default");

        $($btnStop).removeClass("btn-default");
        $($btnStop).addClass("btn-primary btnStop_Queue");

    },
    enableBtnStart_Queue: function (id) {
        //1. add class btnStart
        //2. add class btn-primary
        //3. remove class btn-default
        var $btnStart = "#start_queue_" + id;
        var $btnStop = "#stop_queue_" + id;

        $($btnStop).removeClass("btn-primary btnStop_Queue");
        $($btnStop).addClass("btn-default");

        $($btnStart).removeClass("btn-default");
        $($btnStart).addClass("btn-primary btnStart_Queue");
    },
    /*
     -- author: nnthuong
     -- discription: Menu VERTICAL
     -- date: 27/088/2018
     */
    genHTML_MenuVertical: function (data) {
        var me = this;
        var strDuongDanHienThi = "";
        var strDuongDanFile = "";
        var node = '';
        me.arrMenu_HasChild = [];

        $("#menu_vertical").html("");

        node += '<div class="sidebar-menu-item sidebar-menu-home">'
              + '  <a class="sidebar-menu-header" href="javascript:void(0)" '
              + '     onclick="$(\'.refeshlogo\').first().trigger(\'click\');return false;">'
              + '    <i class="fa-light fa-house-window item-icon"></i>'
              + '    <span>Trang chủ</span>'
              + '  </a>'
              + '</div>';

        for (var j = 0; j < data.length; j++) {
            if (data[j].CHUCNANGCHA_ID == null || data[j].CHUCNANGCHA_ID == "") {//get parents
                strDuongDanHienThi = "#" + (data[j].ID + me.appId).toLowerCase();
                strDuongDanFile = data[j].DUONGDANFILE;
                var arrChild = data.filter(e => e.CHUCNANGCHA_ID === data[j].ID);

                node += '<div class="sidebar-menu-item">';
                node += '<a class="sidebar-menu-header collapsed" id="chucnang' + data[j].ID + '"';
                if (data[j].DUONGDANHIENTHI == "#dashboard") node += ' style="display:none"';
                node += strDuongDanFile ? ' onclick="edu.system.initMain(' + "\'" + strDuongDanHienThi + "\'" + ',' + "\'" + strDuongDanFile + "\'" + ',' + "\'" + data[j].ID + "\'" + ')" href="' + strDuongDanHienThi + '"' : ' href="#" ';
                node += arrChild.length ? 'data-bs-toggle="collapse" data-bs-target="#collapse' + data[j].ID + '">' : '>';
                node += '<i class="' + data[j].TENANH + ' item-icon"></i>';
                node += '<span>' + data[j].TENCHUCNANG + '</span>';
                node += arrChild.length ? '<i class="fal fa-chevron-right item-arrow-icon"></i><i class="fal fa-chevron-down item-arrow-icon down"></i>' : '';
                node += '</a>';
                if (arrChild.length) {
                    node += '<div class="sidebar-menu-sub collapse" id="collapse' + data[j].ID + '" data-bs-parent="#sidebar-menu">';
                    arrChild.forEach(e => {
                        node += '<a id="chucnang' + e.ID + '" onclick="edu.system.initMain(' + "\'" + strDuongDanHienThi + "\'" + ',' + "\'" + e.DUONGDANFILE + "\'" + ',' + "\'" + e.ID + "\'" + ')" href="' + strDuongDanHienThi + '">' + e.TENCHUCNANG + '</a>';
                    })
                    node += '</div>';
                }
                node += '</div>';
            }
        }
        //1. Append to left_content_tree
        $("#sidebar-menu").html(node);
        if (me.currentThuVai && me.currentThuVai.ten) {
            var tv = me.currentThuVai;
            var strLabel = tv.tenVaiTro ? ('Đang xem — ' + tv.tenVaiTro) : 'Đang xem';
            var tvInfo = ''
                + '<div class="sidebar-thuvai-info" style="position:relative;padding:10px 28px 10px 12px;background:#eff6ff;border-radius:6px;margin:8px;border-left:3px solid #0d6efd">'
                + '  <button type="button" class="btnThoatThuVai" title="Thoát vai" style="position:absolute;top:4px;right:4px;width:22px;height:22px;border:0;background:transparent;color:#6c757d;font-size:18px;line-height:1;cursor:pointer;padding:0;border-radius:4px" onclick="edu.system._thoatThuVai();return false;">×</button>'
                + '  <div style="font-size:10px;color:#6c757d;text-transform:uppercase;font-weight:600;letter-spacing:.3px">' + strLabel + '</div>'
                + '  <div style="font-weight:700;color:#1e3a8a;font-size:13px;margin-top:3px;line-height:1.25;word-break:break-word">' + tv.ten + '</div>'
                + (tv.ma ? '  <div style="font-family:monospace;color:#6c757d;font-size:12px;margin-top:2px">' + tv.ma + '</div>' : '')
                + '</div>';
            $("#sidebar-menu").prepend(tvInfo);
        }
        var strChucNang_Id = (me.strChucNang_Id) ? me.strChucNang_Id : sessionStorage.getItem("strChucNang_Id");
        // [AUTO-THU-VAI] Nếu có hash chức năng đang chờ (đến từ luồng thủ vai SV tự động) → tìm và mount trực tiếp bằng initMain (tránh $.trigger("click") không gọi được inline onclick).
        if (me._pendingChucNang_IdLower) {
            var strTargetLower = me._pendingChucNang_IdLower;
            me._pendingChucNang_IdLower = null;
            var arrChucNang = me.dtChucNang || [];
            console.log('[AUTO-THU-VAI][menu-render] target chucNang_Id (lower) =', strTargetLower, '| dtChucNang.length =', arrChucNang.length);
            var cnMatch = arrChucNang.find(function (cn) { return cn.ID && String(cn.ID).toLowerCase() === strTargetLower; });
            console.log('[AUTO-THU-VAI][menu-render] cnMatch =', cnMatch);
            if (cnMatch) {
                // Nếu hash trỏ tới parent group (DUONGDANFILE = null) → tự tìm child đầu tiên có DUONGDANFILE để mount
                if (!cnMatch.DUONGDANFILE) {
                    var arrChild = arrChucNang.filter(function (cn) { return cn.CHUCNANGCHA_ID === cnMatch.ID && cn.DUONGDANFILE; });
                    arrChild.sort(function (a, b) { return (parseInt(a.THUTU, 10) || 0) - (parseInt(b.THUTU, 10) || 0); });
                    console.log('[AUTO-THU-VAI][menu-render] hash trỏ tới parent "' + cnMatch.TENCHUCNANG + '", có', arrChild.length, 'child. Dùng child đầu:', arrChild[0]);
                    if (arrChild.length) cnMatch = arrChild[0];
                }
                strChucNang_Id = cnMatch.ID;
                // Expand parent nếu chức năng con
                if (cnMatch.CHUCNANGCHA_ID) {
                    var elCha = document.getElementById("chucnang" + cnMatch.CHUCNANGCHA_ID);
                    var elCollapse = document.getElementById("collapse" + cnMatch.CHUCNANGCHA_ID);
                    if (elCha) elCha.classList.remove("collapsed");
                    if (elCollapse) elCollapse.classList.add("show");
                }
                // Gọi initMain trực tiếp thay vì trigger click (inline onclick không được jQuery trigger)
                var strDuongDanHienThi = "#" + (cnMatch.ID + me.appId).toLowerCase();
                console.log('[AUTO-THU-VAI][menu-render] initMain(', strDuongDanHienThi, ',', cnMatch.DUONGDANFILE, ',', cnMatch.ID, ')');
                if (cnMatch.DUONGDANFILE) {
                    edu.system.initMain(strDuongDanHienThi, cnMatch.DUONGDANFILE, cnMatch.ID);
                    return;
                }
            }
        }
        console.log('[AUTO-THU-VAI][menu-render] triggerChucNang_Id ->', strChucNang_Id);
        me.triggerChucNang_Id(strChucNang_Id);
        if (!sessionStorage.getItem("strChucNang_Id") && window.innerWidth < 769) {
            console.log("1234");
            $(".menu-icon-mobi").trigger("click");
        }
        //2. mark the parent has child
        //3. reset
        node = "";
    },
    triggerChucNang_Id: function (strChucNang_Id) {
        var me = this;

        if (strChucNang_Id != "" || strChucNang_Id != undefined) {
            var objChucNang = me.dtChucNang.find(e => e.ID === strChucNang_Id);
            if (objChucNang) {
                $("#chucnang" + strChucNang_Id).trigger("click");
                if (objChucNang.CHUCNANGCHA_ID != null && objChucNang.CHUCNANGCHA_ID != "") {
                    //document.getElementById("chucnang" + strChucNang_Id).classList.add("active");
                    var pointChucNang = document.getElementById("chucnang" + objChucNang.CHUCNANGCHA_ID);
                    //pointChucNang.parentNode.classList.add("active");
                    pointChucNang.classList.remove("collapsed");
                    document.getElementById("collapse" + objChucNang.CHUCNANGCHA_ID).classList.add("show");
                }
                return;
                //else {
                //    document.getElementById("chucnang" + strChucNang_Id).parentNode.classList.add("active");
                //}
            }
        }
        var objTrangChu = me.dtChucNang.find(e => e.DUONGDANHIENTHI == "#dashboard");
        if (objTrangChu) $("#chucnang" + objTrangChu.ID).trigger("click");
    },
    triggerChucNang_MaHienThi: function (strChucNang_Ma) {
        var me = this;
        var objChucNang = me.dtChucNang.find(e => e.DUONGDANHIENTHI == strChucNang_Ma);
        if (objChucNang) $("#chucnang" + objChucNang.ID).trigger("click");
    },
    genPath_ChucNang: function () {
        var me = edu.system;
        var data = edu.util.objGetDataInData(me.strChucNang_Id, me.dtChucNang, "ID");
        me.pathChucNang = '';
        me.pathChucNang += getNameChucNang(data[0]);
        if (data[0].DUONGDANHUONGDANSUDUNG && data[0].DUONGDANHUONGDANSUDUNG.indexOf("$") != -1) {
            eval(data[0].DUONGDANHUONGDANSUDUNG);
        }
        //if (edu.util.checkValue(data[0].DUONGDANHUONGDANSUDUNG)) {
        //    me.pathChucNang += '<a id="btnHuongDanSuDung" name= "' + data[0].DUONGDANHUONGDANSUDUNG + '" style="float:right; cursor: pointer" data-toggle="popover" data-placement="left" title="' + data[0].DUONGDANHUONGDANSUDUNG + '" data-content="intro.user"><i class="fa fa-youtube-play" style="color:red"> Hướng dẫn sử dụng</i></a>';
        //}
        //else {
        //    me.pathChucNang += '<a style="float:right; cursor: pointer" data-toggle="popover" data-placement="left" title="Help" data-content="intro.user"><i class="fa fa-question-circle fa-customer"></i></a>';
        //}
        if (me.strHelpUrl) {
            me.pathChucNang += '<a id="btnCongHelp" href="' + me.strHelpUrl.replace('{functionId}', encodeURIComponent(data[0].ID)) + '" target="_blank" rel="noopener" title="Hướng dẫn sử dụng" style="margin-left: 10px"><i class="fal fa-question-circle" style="font-size: 16px !important"></i></a>';
        }

        $(".content-tab .link").html(me.pathChucNang);
        $("#btnHuongDanSuDung").click(function () {
            var url = this.name;
            var win = window.open(url, '_blank');
            win.focus();
        });
        var strThongTinKhongHienThi = data[0].THONGTINKHONGHIENTHI;
        if (edu.util.checkValue(strThongTinKhongHienThi)) me.hiddenElement(strThongTinKhongHienThi);

        me["onCache"] = data[0].LUUTHONGTINTHEONGUOIDUNG;
        //
        if (typeof ReplicaWithDom === "function") {
            var objReplace = ReplicaWithDom();
            if (objReplace.All !== undefined) {
                for (var xR in objReplace.All) {
                    $(xR).html(objReplace.All[xR]);
                }
            }
        }

        me.makeLog("VAOCHUCNANG", data[0].DUONGDANFILE);
        function getNameChucNang(json) {
            var row = json.CHUCNANGCHA_ID ? '<i class="fal fa-angle-right"></i>' : '';
            row += '<a href="#">' + json.TENCHUCNANG + '</a>';
            if (json.CHUCNANGCHA_ID != null && json.CHUCNANGCHA_ID != "") {
                return getNameChucNang(edu.util.objGetOneDataInData(json.CHUCNANGCHA_ID, me.dtChucNang, "ID")) + row;
            }
            return row;
        }
    },
    hiddenElement: function (strHidden) {
        //strHidden = '{"me":"","father":"","parent":"", "readonly": "","readonlyselect2": ""}';
        var objHidden = JSON.parse(strHidden);
        hiddenMe();
        hiddenParent();
        hiddenFather();
        readonly();
        readonlyselect2();


        function hiddenMe() {
            var strValue = objHidden.me;
            if (strValue != undefined && strValue != "") {
                var arrValue = [strValue];
                if (strValue.includes(",")) {
                    arrValue = strValue.split(",");
                }
                for (var i = 0; i < arrValue.length; i++) {
                    $(arrValue[i]).hide();
                }
            }
        }

        function hiddenFather() {
            var strValue = objHidden.father;
            if (strValue != undefined && strValue != "") {
                var arrValue = [strValue];
                if (strValue.includes(",")) {
                    arrValue = strValue.split(",");
                }
                for (var i = 0; i < arrValue.length; i++) {
                    $(arrValue[i]).parent().hide();
                }
            }
        }

        function hiddenParent() {
            var strValue = objHidden.parent;
            if (strValue != undefined && strValue != "") {
                var arrValue = [strValue];
                if (strValue.includes(",")) {
                    arrValue = strValue.split(",");
                }
                for (var i = 0; i < arrValue.length; i++) {
                    var x = $(arrValue[i]).parent();
                    x.hide();
                    x.prev().hide();
                }
            }
        }

        function readonly() {
            var strValue = objHidden.readonly;
            if (strValue != undefined && strValue != "") {
                $(strValue).attr("readonly", "readonly");
            }
        }

        function readonlyselect2() {
            var strValue = objHidden.readonlyselect2;
            if (strValue != undefined) {
                $(strValue).select2("enable", false);
            }
        }
    },
    genHTML_Progress: function (strDiv_Id, iToTal) {
        if (strDiv_Id == "" || strDiv_Id == undefined) {
            edu.system.alert('<div id="zoneprogessXXX"></div>');
            strDiv_Id = "zoneprogessXXX";
        }
        var row = '';
        row += '<div class="progress" id="zonepercentInDS" name="' + iToTal + '" title="0">';
        row += '<div id="percentInDS" class="progress-bar progress-bar-success progress-bar-striped" role="progressbar"';
        row += 'aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:0%">';
        row += '</div>';
        row += '<div id="zoneShowLog">0/' + iToTal +' (0%)</div>';
        row += '</div>';
        $("#" + strDiv_Id).html(row);
    },
    start_Progress: function (strDiv_Id, callback) {
        if (strDiv_Id == "" || strDiv_Id == undefined) {
            strDiv_Id = "zoneprogessXXX";
        }
        var x = $("#" + strDiv_Id + " #zonepercentInDS");
        var iDem = parseInt(x.attr("title")) + 1;
        x.attr("title", iDem);
        var iTotal = x.attr("name");
        if (iDem == iTotal) {
            setTimeout(function () {
                $("#" + strDiv_Id + " #zonepercentInDS").remove();
                if ($("#myModalAlert #alert_content").text().length === 1) $("#myModalAlert").modal("hide");
            }, 500);
            if (jQuery.type(callback) == "function") {
                callback();
            }
        }
        else {
            var iper = Math.round((((iDem / iTotal) * 100)), 0);
            $("#" + strDiv_Id + " #percentInDS").attr("style", "width:" + iper + "%");
            $("#" + strDiv_Id + " #zoneShowLog").html("" + iDem + "/" + iTotal + " (" + iper + "%)");
        }
    },
    /*------------------------------------------
   --Discription: [4] GenHTML mẫu import
   --ULR:  Modules
   -------------------------------------------*/
    getList_MauImport: function (strZoneButton, callback) {
        var me = this;
        
        $("#" + strZoneButton).delegate(".btnBaoCao_LHD", "click", function (e) {
            e.preventDefault();
            me.report($(this).attr("name"), $(this).attr("duongdan"), callback);
        });
        $("#" + strZoneButton).delegate(".btnReportAllTable", "click", function (e) {
            e.preventDefault();
            var strLoaiBaoCao = $(this).attr("name");
            var strTable_Id = strLoaiBaoCao.substring(15);
            me.reportAllTable(strTable_Id, strLoaiBaoCao, $(this).attr("duongdan"), callback);
        });
        $("#" + strZoneButton).delegate(".btnReportAllInput", "click", function (e) {
            e.preventDefault();
            var strLoaiBaoCao = $(this).attr("name");
            var strTable_Id = strLoaiBaoCao.substring(15);
            me.reportAllTable_Input(strTable_Id);
        });
        $("#" + strZoneButton + "_Import").delegate(".btnImportAllInput", "click", function (e) {
            e.preventDefault();
            me.showReportAndImportTable();
        });
        $("#" + strZoneButton + "_Import").delegate(".btnImportWithProce", "click", function (e) {
            e.preventDefault();
            edu.system.showImportChung($(this).attr("title"), $(this).attr("name"));
        });
        //
        $("#" + strZoneButton).click(function (e) {
            e.preventDefault();
            var check = $("#" + strZoneButton + " ul li a");
            if (check.length === 1) {
                if (check.attr("class") == "btnBaoCao_LHD") {
                    me.report(check.attr("name"), check.attr("duongdan"), callback);
                    return;
                }
                if (check.attr("class") == "btnReportAllTable") {
                    var strLoaiBaoCao = check.attr("name");
                    var strTable_Id = strLoaiBaoCao.substring(15);
                    me.reportAllTable(strTable_Id, strLoaiBaoCao, check.attr("duongdan"), callback);
                    return;
                }
                if (check.attr("class") == "btnReportAllInput") {
                    var strLoaiBaoCao = check.attr("name");
                    var strTable_Id = strLoaiBaoCao.substring(15);
                    me.reportAllTable_Input(strTable_Id);
                    return;
                }
                if (check.attr("class") == "btnImportAllInput") {
                    me.showReportAndImportTable();
                    return;
                }
                if (check.attr("class") == "btnImportWithProce") {
                    edu.system.showImportChung(check.attr("title"), check.attr("name"));
                    return;
                }
            }
        });
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyen_MH/DSA4BRIeESkgLxA0OCQvHgwgNAgsMS4zNQPP',
            'func': 'pkg_phanquyen_dulieu.LayDS_PhanQuyen_MauImport',
            'iM': edu.system.iM,
            'strTuKhoa': '',
            'strNguoiTao_Id': '',
            'strUngDung_Id': me.appId,
            'strChucNang_Id': me.strChucNang_Id,
            'strNguoiDung_Id': me.userId,
            'strMauImport_Id': '',
            'pageIndex': 1,
            'pageSize': 100000,
        };


        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtMauBaoCao"] = data.Data;
                    me.cbGenCombo_MauImport(data.Data, strZoneButton);
                }
                else {
                    me.alert(obj_save.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                me.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MauImport: function (data, strZoneButton) {
        var me = this;
        var strPoint = $("#" + strZoneButton);
        var pointImport = $("#" + strZoneButton + "_Import");

        var html = "";
        var htmlimport = "";
        for (var i = 0; i < data.length; i++) {
            var strCheck = "";
            if (data[i].MAUIMPORT_MA.length > 14) {
                strCheck = data[i].MAUIMPORT_MA.substring(0, 14).toUpperCase();
            }
            switch (strCheck) {
                case "REPORTALLTABLE": html += '<li><a class="dropdown-item btnReportAllTable" name="' + data[i].MAUIMPORT_MA + '" duongdan="' + edu.util.returnEmpty(data[i].MAUIMPORT_DUONGDAN) + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + ' - <i class="fa fa-eye" style="color:red"></i> </a></li>';
                    break;
                case "REPORTALLINPUT": html += '<li><a class="dropdown-item btnReportAllInput" name="' + data[i].MAUIMPORT_MA + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + ' - <i class="fa fa-eye" style="color:red"></i> </a></li>';
                    break;
                case "IMPORTALLINPUT": htmlimport += '<li><a class="dropdown-item btnImportAllInput" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + ' - <i class="fa fa-cloud-upload" style="color:red"></i> </a></li>';
                    break;
                case "IMPORTWITHPROC": htmlimport += '<li><a class="dropdown-item btnImportWithProce" name="' + data[i].MAUIMPORT_MA + '" title="' + data[i].MAUIMPORT_TENFILEMAU + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + '</a></li>';
                    break;
                default: html += '<li><a class="dropdown-item btnBaoCao_LHD" name="' + data[i].MAUIMPORT_MA + '" duongdan="' + edu.util.returnEmpty(data[i].MAUIMPORT_DUONGDAN) + '" href="#"> ' + (i + 1) + '. ' + data[i].MAUIMPORT_TENFILEMAU + ' </a></li>';
            }

        }


        if (html != "") {
            var row = '';
            row += '<button class="btn btn-outline-success min-w-auto dropdown-toggle" id="zonebtnBaoCao_' + strZoneButton +'" data-bs-toggle="dropdown" aria-expanded="false">';
            row += '<i class="fas fa-file-chart-line me-2"></i> Báo cáo';
            row += '</button>';
            row += '<ul class="dropdown-menu" aria-labelledby="zonebtnBaoCao_' + strZoneButton +'">';
            row += html;
            row += '</ul>';
            strPoint.html(row);
            strPoint.show();
        }
        else {
            if (strPoint.html() == "") {
                strPoint.hide();
            }
        };

        if (htmlimport != "") {
            var rowimport = '';
            rowimport += '<button  class="btn btn-outline-success min-w-auto dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" id="zonebtnImport_' + strZoneButton +'" >';
            rowimport += '<i class="fa fa-cloud-upload"></i> Import <span class="caret"></span>';
            rowimport += '</button>';
            rowimport += '<ul class="dropdown-menu" style="width: unset !important" aria-labelledby="zonebtnImport_' + strZoneButton +'">';
            rowimport += htmlimport;
            rowimport += '</ul>';
            pointImport.html(rowimport);
            pointImport.show();
        }
        else {
            if (pointImport.html() == "") {
                pointImport.hide();
            }
        };
    },
    reportDanhMuc: function (aData, strEmail, strMaDanhMuc) {
        //strEmail = 'vanhieptn95@gmail.com';
        //var strMaDanhMuc = "NH.GNH";
        edu.system.loadToCombo_DanhMucDuLieu(strMaDanhMuc, "", "", dtDanhMuc => {
            if (dtDanhMuc.length === 0) return;
            edu.system.report("DANHMUC_DON", "", function (addKeyValue) {
                var aDM = dtDanhMuc[0];
                addKeyValue("strMaDanhMuc", strMaDanhMuc);
                addKeyValue("strFileName", aDM.THONGTIN5 && aDM.THONGTIN5.indexOf('aData.') !== -1 ? eval(aDM.THONGTIN5) : aDM.THONGTIN5);
                addKeyValue("strEmail", strEmail);
                addKeyValue("strTieuDe", aDM.THONGTIN3 && aDM.THONGTIN3.indexOf('aData.') !== -1 ? eval(aDM.THONGTIN3) : aDM.THONGTIN3);
                addKeyValue("strNoiDung", aDM.THONGTIN4 && aDM.THONGTIN4.indexOf('aData.') !== -1 ? eval(aDM.THONGTIN4) : aDM.THONGTIN4);
                dtDanhMuc.forEach(e => {
                    addKeyValue(e.MA, e.TEN && e.TEN.indexOf('aData.') !== -1 ? eval(e.TEN) : aData[e.TEN]);
                });
            });
        }, "", "HESO1");
    },
    report: function (strLoaiBaoCao, strDuongDan, callback, strTable_Id) {
        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];
        //
        addKeyValue("strTable_Id", strTable_Id);
        addKeyValue("strLoaiBaoCao", strLoaiBaoCao);
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiThucHien_Id", me.userId);
        var checkBaoCao = me.dtMauBaoCao.find(e => e.MAUIMPORT_MA == strLoaiBaoCao);
        if (checkBaoCao.XEMFILE) addKeyValue("saveFile", checkBaoCao.XEMFILE);

        if (jQuery.type(callback) == "function") {
            var check = callback(addKeyValue);
            if (check == false) return;
        }
        //không sửa ở đây

        var obj_save = {
            'arrTuKhoa': arrTuKhoa,
            'arrDuLieu': arrDuLieu,
            'strNguoiThucHien_Id': me.userId
        };
        //return;
        me.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        me.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                        var url_report = me.rootPathReport + "?id=" + strBaoCao_Id;
                        if (edu.util.checkValue(strDuongDan) && strDuongDan != "undefined") {
                            url_report = strDuongDan + "?id=" + strBaoCao_Id;
                            if (strDuongDan.indexOf("http") == -1) url_report = me.strhost + url_report;
                        }
                        if (checkBaoCao && checkBaoCao.XEMFILE) {
                            getList_BaoCao(url_report);
                        } else {
                            location.href = url_report
                        };
                        //var win = window.open(url_report, '_blank');
                        //if (win != undefined)
                        //    win.focus();
                        //else edu.system.alert("Vui lòng cho phép mở tab mới trên trình duyệt và thử lại!");
                    }
                }
                else {
                    me.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',

            contentType: true,
            contentType2: "application/json",
            data: JSON.stringify(obj_save),
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }

        function getList_BaoCao(strUrl, strToken) {
            $("#overlay").show();
            //--Edit
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: strUrl,
                success: function (d, s, x) {
                    if (d.Success) {
                        var strFileUrl = me.strhost + d.Data;
                        $("#btnDownloadFileBaoCao").attr("href", strFileUrl);
                        var iframe = document.createElement("iframe");
                        iframe.width = (window.screen.width - 100) + "px";
                        iframe.height = (window.screen.height - 300) + "px";
                        iframe.style.border = "0";
                        iframe.onload = function () {
                            $("#overlay").hide();
                            $("#modalBaoCao").modal("show");
                        };
                        iframe.onerror = function () {
                            $("#overlay").hide();
                            $("#modalBaoCao").modal("show");
                        };
                        $("#modalBaoCao #modal_body").html("");
                        $("#modalBaoCao #modal_body")[0].appendChild(iframe);
                        iframe.src = strFileUrl;
                    } else {
                        $("#overlay").hide();
                        edu.system.alert(d.Message);
                    }
                },
                error: function (x, t, m) {
                    $("#overlay").hide();
                    edu.system.alert(x);
                },
                data: {
                },
                cache: false,
            });
        }
    },

    reportAllTable: function (strTable_Id, strLoaiBaoCao, strDuongDan, callback) {
        var me = this;
        var uuid = edu.util.uuid();
        var arrTemp = [];
        //remove select
        var arrSelect = $("#" + strTable_Id + " select");
        for (var i = 0; i < arrSelect.length; i++) {
            var strTempValue = "";
            if ($(arrSelect[i]).val() != "") {
                strTempValue = $(arrSelect[i]).find("option:selected").text();
            }
            $(arrSelect[i]).replaceWith(strTempValue);
        }
        //remove input
        var arrInput = $("#" + strTable_Id + " input");
        for (var i = 0; i < arrInput.length; i++) {
            $(arrInput[i]).replaceWith($(arrInput[i]).val());
        }
        var i = 0;
        //var totalRow = $("#" + strTable_Id + " thead").length + $("#" + strTable_Id + " tbody").length + $("#" + strTable_Id + " tfoot").length;
        
        //edu.system.alert('<div id="zonereportalltable"></div>');
        //if (document.getElementById("zonereportalltable") === null || document.getElementById("zonereportalltable") === undefined) {
        //    edu.system.alert('<div id="zonereportalltable"></div>');
        //}
        i += addValueV2("#" + strTable_Id + " thead", "HEAD", i, 0);
        i += addValueV2("#" + strTable_Id + " tbody", "BODY", i, 0);
        i += addValueV2("#" + strTable_Id + " tfoot", "HEAD", i, 0);
        $("#" + strTable_Id + " .tdhidden").remove();
        //edu.system.genHTML_Progress("zonereportalltable", 1);
        save(arrTemp);

        function addValueV2(strZone, strType, iBatDauDong, iBatDauCot) {

            if ($(strZone).length === 0) return 0;
            var head = $(strZone)[0].rows;
            for (var i = 0; i < head.length; i++) {
                if ($(head[i]).html() == "") break;
            }
            var lhang = i;
            var iRowMinus = head.length - i;
            for (i = 0; i < lhang; i++) {
                var lCot = head[i].cells.length;
                for (var j = 0; j < lCot; j++) {
                    if (head[i].cells[j].rowSpan > 1) {
                        for (var k = 1; k < head[i].cells[j].rowSpan - iRowMinus; k++) {
                            if (j == 0) {
                                $(head[i + k]).prepend('<td class="tdhidden" style="display:none"></td>');

                            }
                            else {
                                if (head[i + k].cells[j - 1] == undefined) {
                                    $(head[i + k]).append('<td class="tdhidden" style="display:none"></td>');
                                } else {

                                    $(head[i + k].cells[j - 1]).after('<td class="tdhidden" style="display:none"></td>');
                                }
                            }
                        }

                        //head[i].cells[j].rowSpan = 1;
                    }
                    if (head[i].cells[j].colSpan > 1) {
                        for (var k = 1; k < head[i].cells[j].colSpan; k++) {
                            $(head[i].cells[j]).after('<td class="tdhidden" style="display:none"></td>');
                            lCot++;
                        }
                        //head[i].cells[j].colSpan = 1;
                    }
                }
            }
            for (var i = 0; i < lhang; i++) {
                for (var j = 0; j < head[i].cells.length; j++) {
                    var cell = head[i].cells[j];
                    if (cell.style.display != "none") {
                        var cellrowspan = cell.rowSpan;
                        if (cellrowspan > 1) cellrowspan = cellrowspan - iRowMinus;
                        arrTemp.push({
                            strTable_Id: uuid,
                            strTable: strTable_Id,
                            iRow: i + iBatDauDong,
                            iCol: j + iBatDauCot,
                            iRowSpan: cellrowspan,
                            iColSpan: cell.colSpan,
                            strData_Cell: $(cell).text(),
                            strData_Align: strType
                        });
                    }
                }
            }
            return i;
        }
        function addValue(strZone, strType, iBatDauDong, iBatDauCot) {
            if ($(strZone).length === 0) return 0;
            var head = $(strZone)[0].rows;
            var arrTangSen = [];
            for (i = 0; i < head.length; i++) {
                var iTangSen = 0;//Vị trí lệch cột, sẽ được cộng dồn 
                var iThuTuTangSen = 0;
                for (var j = 0; j < head[i].cells.length; j++) {
                    var cell = head[i].cells[j];
                    if (i == 0) {//Tạo 1 mảng tương ứng với cột của bảng trong đó phần tử tương ứng với số rowspan
                        arrTangSen.push(cell.rowSpan - 1);//Thêm 1 phần tử vào mảng check tăng xích
                        for (var k = 1; k < cell.colSpan; k++) {//Đối với col span sẽ thêm cộng dồn
                            arrTangSen.push(0);
                        }
                    } else {
                        //So sánh với mảng tăng xích, bằng vòng lặp while đến khi xích hết trùng
                        //iThuTuTangSen tăng lần lượt đến khi hết các cột và reset khi bắt đầu dòng mới
                        if (j > iThuTuTangSen) iThuTuTangSen = j;
                        while (iThuTuTangSen < arrTangSen.length && iThuTuTangSen >= 0) {
                            if (arrTangSen[iThuTuTangSen] > 0) {
                                arrTangSen[iThuTuTangSen] = arrTangSen[iThuTuTangSen] - 1;
                                iTangSen++;
                            } else {
                                if (cell.rowSpan > 1) {
                                    arrTangSen[iThuTuTangSen] = arrTangSen[iThuTuTangSen] + cell.rowSpan - 1;
                                }
                                iThuTuTangSen++;
                                break;
                            }

                            iThuTuTangSen++;
                        }
                    }
                    arrTemp.push({
                        strTable_Id: uuid,
                        strTable: strTable_Id,
                        iRow: i + iBatDauDong,
                        iCol: j + iTangSen + iBatDauCot,
                        iRowSpan: cell.rowSpan,
                        iColSpan: cell.colSpan,
                        strData_Cell: $(cell).text(),
                        strData_Align: strType
                    });
                    iTangSen += cell.colSpan - 1;

                }
            }
            return i;
        }

        function report() {
            if (edu.util.checkValue(strDuongDan)) {
                me.report(strLoaiBaoCao, strDuongDan, callback, uuid);
            } else {
                var url_report = edu.system.strhost + "/reportcms/Modules/Common/BaoCao.aspx?id=" + uuid + "&table=" + strTable_Id;
                location.href = url_report;
            }
        }

        function save(obj) {
            edu.system.makeRequest({

                type: "POST",
                action: 'SYS_Report/AllTable_Element',

                contentType2: 'application/json',
                complete: function () {
                    report();
                },
                data: JSON.stringify(obj),
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    reportAllTable_Input: function (strTable_Id) {
        var me = this;
        var uuid = edu.util.uuid();
        var arrTemp = [];
        //if (document.getElementById("zonereportalltable") === null || document.getElementById("zonereportalltable") === undefined) {
        //    edu.system.alert('<div id="zonereportalltable"></div>');
        //}
        var i = 0;
        i += addValueV2("#" + strTable_Id + " thead", "HEAD", i, 0);
        i += addValueV2("#" + strTable_Id + " tbody", "BODY", i, 0);
        i += addValueV2("#" + strTable_Id + " tfoot", "HEAD", i, 0);
        $("#" + strTable_Id + " .tdhidden").remove();
        //edu.system.genHTML_Progress("zonereportalltable", arrTemp.length);
        save(arrTemp);

        function addValueV2(strZone, strType, iBatDauDong, iBatDauCot) {

            if ($(strZone).length === 0) return 0;
            var head = $(strZone)[0].rows;
            for (var i = 0; i < head.length; i++) {
                if ($(head[i]).html() == "") break;
            }
            var lhang = i;
            var iRowMinus = head.length - i;
            for (i = 0; i < lhang; i++) {
                var lCot = head[i].cells.length;
                for (var j = 0; j < lCot; j++) {
                    if (head[i].cells[j].rowSpan > 1) {
                        for (var k = 1; k < head[i].cells[j].rowSpan - iRowMinus; k++) {
                            if (j == 0) {
                                $(head[i + k]).prepend('<td class="tdhidden" style="display:none"></td>');

                            }
                            else {
                                if (head[i + k].cells[j - 1] == undefined) {
                                    $(head[i + k]).append('<td class="tdhidden" style="display:none"></td>');
                                } else {

                                    $(head[i + k].cells[j - 1]).after('<td class="tdhidden" style="display:none"></td>');
                                }
                            }
                        }

                        //head[i].cells[j].rowSpan = 1;
                    }
                    if (head[i].cells[j].colSpan > 1) {
                        for (var k = 1; k < head[i].cells[j].colSpan; k++) {
                            $(head[i].cells[j]).after('<td class="tdhidden" style="display:none"></td>');
                            lCot++;
                        }
                        //head[i].cells[j].colSpan = 1;
                    }
                }
            }
            for (var i = 0; i < lhang; i++) {
                for (var j = 0; j < head[i].cells.length; j++) {
                    var cell = head[i].cells[j];
                    if (cell.style.display != "none") {
                        var point = cell;
                        var strValue = "";
                        var strTempId = "";
                        var arrSelect = $(point).find("select");
                        var arrInput = $(point).find("input");
                        for (var k = 0; k < arrSelect.length; k++) {
                            var strTempValue = "";
                            if ($(arrSelect[k]).val() != "") {
                                strTempValue = $(arrSelect[k]).find("option:selected").text();
                            }
                            strValue += ";" + strTempValue;
                            strTempId += ";" + arrSelect[k].id + "#select";
                        }
                        for (var k = 0; k < arrInput.length; k++) {
                            strValue += ";" + $(arrInput[k]).val();
                            strTempId += ";" + arrInput[k].id + "#input";
                        }
                        if (strValue != "") strValue = strValue.substring(1);
                        else strValue = $(cell).text();
                        if (strTempId != "") strTempId = strTempId.substring(1);

                        var cellrowspan = cell.rowSpan;
                        if (cellrowspan > 1) cellrowspan = cellrowspan - iRowMinus;
                        arrTemp.push({
                            strTable_Id: uuid,
                            strTable: strTable_Id,
                            iRow: i + iBatDauDong,
                            iCol: j + iBatDauCot,
                            iRowSpan: cellrowspan,
                            iColSpan: cell.colSpan,
                            strData_Cell: strValue,
                            strData_TempId: strTempId,
                            strData_Align: strType
                        });
                    }
                }
            }
            return i;
        }
        function addValue(strZone, strType, iBatDauDong, iBatDauCot) {
            if ($(strZone).length === 0) return 0;
            var head = $(strZone)[0].rows;
            var arrTangSen = [];
            for (i = 0; i < head.length; i++) {
                var iTangSen = 0;//Vị trí lệch cột, sẽ được cộng dồn 
                var iThuTuTangSen = 0;
                for (var j = 0; j < head[i].cells.length; j++) {
                    var cell = head[i].cells[j];
                    if (i == 0) {//Tạo 1 mảng tương ứng với cột của bảng trong đó phần tử tương ứng với số rowspan
                        arrTangSen.push(cell.rowSpan - 1);//Thêm 1 phần tử vào mảng check tăng xích
                        for (var k = 1; k < cell.colSpan; k++) {//Đối với col span sẽ thêm cộng dồn
                            arrTangSen.push(0);
                        }
                    } else {
                        //So sánh với mảng tăng xích, bằng vòng lặp while đến khi xích hết trùng
                        //iThuTuTangSen tăng lần lượt đến khi hết các cột và reset khi bắt đầu dòng mới
                        if (j > iThuTuTangSen) iThuTuTangSen = j;
                        while (iThuTuTangSen < arrTangSen.length && iThuTuTangSen >= 0) {
                            if (arrTangSen[iThuTuTangSen] > 0) {
                                arrTangSen[iThuTuTangSen] = arrTangSen[iThuTuTangSen] - 1;
                                iTangSen++;
                            } else {
                                if (cell.rowSpan > 1) {
                                    arrTangSen[iThuTuTangSen] = arrTangSen[iThuTuTangSen] + cell.rowSpan - 1;
                                }
                                iThuTuTangSen++;
                                break;
                            }

                            iThuTuTangSen++;
                        }
                    }
                    var point = cell;
                    var strValue = "";
                    var strTempId = "";
                    var arrSelect = $(point).find("select");
                    var arrInput = $(point).find("input");
                    for (var k = 0; k < arrSelect.length; k++) {
                        var strTempValue = "";
                        if ($(arrSelect[k]).val() != "") {
                            strTempValue = $(arrSelect[k]).find("option:selected").text();
                        }
                        strValue += ";" + strTempValue;
                        strTempId += ";" + arrSelect[k].id + "#select";
                    }
                    for (var k = 0; k < arrInput.length; k++) {
                        strValue += ";" + $(arrInput[k]).val();
                        strTempId += ";" + arrInput[k].id + "#input";
                    }
                    if (strValue != "") strValue = strValue.substring(1);
                    else strValue = $(cell).text();
                    if (strTempId != "") strTempId = strTempId.substring(1);

                    arrTemp.push({
                        strTable_Id: uuid,
                        strTable: strTable_Id,
                        iRow: i + iBatDauDong,
                        iCol: j + iTangSen + iBatDauCot,
                        iRowSpan: cell.rowSpan,
                        iColSpan: cell.colSpan,
                        strData_Cell: strValue,
                        strData_TempId: strTempId,
                        strData_Align: strType
                    });
                    iTangSen += cell.colSpan - 1;

                }
            }
            return i;
        }

        function report() {
            var colreport = "";
            if ($("#" + strTable_Id).attr("colreport")) colreport = $("#" + strTable_Id).attr("colreport");
            var url_report = edu.system.strhost + "/reportcms/Modules/Common/BaoCao.aspx?id=" + uuid + "&type=input&table=" + strTable_Id + "&colreport=" + colreport;
            location.href = url_report;
        }

        function save(obj) {
            edu.system.makeRequest({

                type: "POST",
                action: 'SYS_Report/AllTable_Element',

                contentType2: 'application/json',
                complete: function () {
                    //edu.system.start_Progress("zonereportalltable", report);
                    report();
                },
                data: JSON.stringify(obj),
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    importAllTable_Input: function (a, strPath) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Import/Import_AllTable',

            'strPath': strPath,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var coltable = data.Data.coltable;
                    if (coltable != null && coltable != -1) {
                        var dtResult = data.Data.lKeyValue;
                        var strTable_Id = data.Data.strTable_Id;
                        var rows = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows;
                        for (var i = 0; i < rows.length; i++) {
                            var strCheck = rows[i].cells[coltable].innerText;
                            var dtTemp = dtResult.filter(e => e.strTemp === strCheck);
                            Xeload(dtTemp, rows[i].id);
                        }
                    } else {
                        Xeload(data.Data.lKeyValue)
                    }

                }
                else {
                    edu.system.alert(data.Message);
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

        function Xeload(arrData, strRow_Id) {
            for (var i = 0; i < arrData.length; i++) {
                var aData = arrData[i];
                var strKeyId = aData.strKey;
                var arrTemp = strKeyId.split('#');
                var strPoint_Id = arrTemp[0];
                if (strRow_Id) {
                    var pointNode = $("#" + strPoint_Id)[0];
                    while (pointNode != null && pointNode.nodeName != "TR") {
                        pointNode = pointNode.parentNode;
                    }
                    strPoint_Id = strPoint_Id.replace(pointNode.id, strRow_Id);
                }
                if (arrTemp[1] == "input") {
                    $("#" + strPoint_Id).val(aData.strValue);
                } else {
                    var x = $("#" + strPoint_Id);
                    x.find("option").each(function () {
                        if ($(this).text() == aData.strValue) {
                            x.val(this.value).trigger("change");
                        }
                    });
                }
            }
        }
    },
    reportAllTable_User: function (strTable_Id) {
        var me = this;
        var uuid = edu.util.uuid();
        var type = "";
        var arrTemp = [];

        var i = 0;
        i += addValueV2("#" + strTable_Id + " thead", "HEAD", i, 0);
        i += addValueV2("#" + strTable_Id + " tbody", "BODY", i, 0);
        i += addValueV2("#" + strTable_Id + " tfoot", "HEAD", i, 0);
        $("#" + strTable_Id + " .tdhidden").remove();

        if (document.getElementById("zonereportalltable") === null || document.getElementById("zonereportalltable") === undefined) {
            edu.system.alert('<div id="zonereportalltable"></div>');
        }
        var iCount = 0;
        for (var i = 0; i < arrTemp.length; i += 500) {
            iCount++;
        }
        edu.system.genHTML_Progress("zonereportalltable", iCount);

        for (var i = 0; i < arrTemp.length; i += 500) {
            save(arrTemp.slice(i, i + 500));
        }

        function addValueV2(strZone, strType, iBatDauDong, iBatDauCot) {
            if ($(strZone).length === 0) return 0;
            var head = $(strZone)[0].rows;
            for (var i = 0; i < head.length; i++) {
                if ($(head[i]).html() == "") break;
            }
            var lhang = i;
            var iRowMinus = head.length - i;
            for (i = 0; i < lhang; i++) {
                var lCot = head[i].cells.length;
                for (var j = 0; j < lCot; j++) {
                    if (head[i].cells[j].rowSpan > 1) {
                        for (var k = 1; k < head[i].cells[j].rowSpan - iRowMinus; k++) {
                            if (j == 0) {
                                $(head[i + k]).prepend('<td class="tdhidden" style="display:none"></td>');

                            }
                            else {
                                if (head[i + k].cells[j - 1] == undefined) {
                                    $(head[i + k]).append('<td class="tdhidden" style="display:none"></td>');
                                } else {

                                    $(head[i + k].cells[j - 1]).after('<td class="tdhidden" style="display:none"></td>');
                                }
                            }
                        }

                        //head[i].cells[j].rowSpan = 1;
                    }
                    if (head[i].cells[j].colSpan > 1) {
                        for (var k = 1; k < head[i].cells[j].colSpan; k++) {
                            $(head[i].cells[j]).after('<td class="tdhidden" style="display:none"></td>');
                            lCot++;
                        }
                        //head[i].cells[j].colSpan = 1;
                    }
                }
            }
            for (var i = 0; i < lhang; i++) {
                for (var j = 0; j < head[i].cells.length; j++) {
                    var cell = head[i].cells[j];
                    if (cell.style.display != "none") {
                        var point = cell;
                        var strValue = "";
                        var strTempId = "";
                        var arrSelect = $(point).find("select");
                        var arrInput = $(point).find("input,textarea");
                        for (var k = 0; k < arrSelect.length; k++) {
                            var strTempValue = "";
                            if ($(arrSelect[k]).val() != "") {
                                strTempValue = $(arrSelect[k]).find("option:selected").text();
                            }
                            strValue += ";" + strTempValue;
                            strTempId += ";" + arrSelect[k].id + "#select";
                        }
                        for (var k = 0; k < arrInput.length; k++) {
                            if ($(arrInput[k]).attr("type") == "checkbox") continue;
                            strValue += ";" + $(arrInput[k]).val();
                            strTempId += ";" + arrInput[k].id + "#input";
                        }
                        if (strValue != "") strValue = strValue.substring(1);
                        else strValue = $(cell).text();
                        if (strTempId != "") {
                            strTempId = strTempId.substring(1);
                            type = "input";
                        }
                        var cellrowspan = cell.rowSpan;
                        if (cellrowspan > 1) cellrowspan = cellrowspan - iRowMinus;
                        arrTemp.push({
                            strTable_Id: uuid,
                            iRow: i + iBatDauDong,
                            iCol: j + iBatDauCot,
                            iRowSpan: cellrowspan,
                            iColSpan: cell.colSpan,
                            strData_Cell: strValue,
                            strData_TempId: strTempId,
                            strData_Align: strType
                        });
                    }
                }
            }
            return i;
        }

        function report() {
            var colreport = "";
            if ($("#" + strTable_Id).attr("colreport")) colreport = $("#" + strTable_Id).attr("colreport");
            var url_report = edu.system.strhost + "/reportcms/Modules/Common/BaoCao.aspx?id=" + uuid + "&type=" + type + "&table=" + strTable_Id + "&colreport=" + colreport;
            console.log(url_report)
            location.href = url_report;
        }

        function save(obj) {
            edu.system.makeRequest({

                type: "POST",
                action: 'SYS_Report/AllTable_Element',

                contentType2: 'application/json',
                complete: function () {
                    edu.system.start_Progress("zonereportalltable", function () {
                        report();
                    });
                },
                data: JSON.stringify(obj),
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    showReportAndImportTable: function () {
        var me = this;
        var option = "";
        $("#main-content-wrapper table:visible").each(function () {
            if (this.id != "") {
                option += '<option value="' + this.id + '" name="view">' + this.id + ' - View</option>';
                option += '<option value="' + this.id + '" name="input">' + this.id + ' - Input</option>';
            }
        });
        if (option == "") {
            edu.system.alert("Bạn cần hiện thị dữ liệu trước khi thao tác!");
            return;
        }
        var row = '';
        row += '<div class="col-sm-12">';
        row += '<div class="col-sm-4">- Download: </div><div class="col-sm-8"><select class="select-opt" id="downloadAllTable"><option value=""> Select table </option>' + option + '</select></div>';
        row += '<div class="col-sm-4">- Upload: </div><div class="col-sm-8"><div id="importAllTable"></div></div>';
        row += '<div class="col-sm-12"><i>Chú ý: Cần hiển thị bảng trước khi xuất và import</i></div>';
        row += '</div><div class="clear"></div>';
        edu.system.alert(row, 'w');
        $("#downloadAllTable").select2();
        $("#downloadAllTable").on("select2:select", function () {
            if ($("#downloadAllTable option:selected").attr("name") == "input") {
                me.reportAllTable_Input($("#downloadAllTable").val());
            } else {
                me.reportAllTable($("#downloadAllTable").val());
            }
        });
        edu.system.uploadImport(["importAllTable"], me.importAllTable_Input);
    },
    showReportAndImportTable_User: function (bUpload) {
        var me = this;
        var option = "";
        var strTable_Id = "";
        var iSoLuong = 0;
        $("#main-content-wrapper table:visible").each(function () {
            if (this.id != "") {
                iSoLuong++;
                strTable_Id = this.id;
                option += '<option value="' + this.id + '">' + this.id + '</option>';
            }
        });
        if (iSoLuong == 0) {
            edu.system.alert("Bạn cần hiện thị dữ liệu trước khi thao tác!");
            return;
        }
        var row = '';
        row += '<div class="col-sm-12">';
        if (bUpload === undefined) {
            row += '<div class="col-sm-4">- Xuất kết quả: </div><div class="col-sm-8">';
            if (iSoLuong > 1) {
                row += '<select class="select-opt" id="downloadAllTable_User"><option value=""> Select table </option>' + option + '</select>';
            } else {
                row += '<a class="btn btn-primary" id="btnDownloadAllTable" title="' + strTable_Id + '" href="javascript:void(0)" style="cursor:pointer;"><i class="fa fa-cloud-download"></i> Tải file</a>';
            }
            row += '</div>';
        }
        row += '<div id="zoneImportAllInput"><div class="col-sm-4" style="float: left" >- Thực hiện import: </div><div class="col-sm-8"><div id="importAllTable"></div></div></div>';
        row += '</div><div class="clear"></div>';
        //row += '<a><span class="poiter" title="Kéo xuống"><i class="fa fa-angle-double-down"></i> Tùy chỉnh</span></a>';
        //row += '<div><div class="clear"></div>';
        edu.system.alert(row);
        $("#downloadAllTable_User").select2();
        $("#downloadAllTable_User").on("select2:select", function () {
            me.reportAllTable_User($("#downloadAllTable_User").val());
        });
        $("#btnDownloadAllTable").click(function (e) {
            // Ngăn href="#" (legacy) làm SPA điều hướng về root
            if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
            me.reportAllTable_User(this.title);
        });
        edu.system.uploadImport(["importAllTable"], me.importAllTable_Input);
    },
    showImportChung: function (strTenHienThi, strMaDanhMuc) {
        var me = this;
        if (strTenHienThi === undefined) strTenHienThi = "";
        var sCallback = $("a[name='" + strMaDanhMuc + "']").attr("callback");

        var body = '';
        body += '<div class="row g-3 align-items-center">';
        body += '<div class="col-sm-3 fw-semibold">- Upload ' + strTenHienThi + ':</div>';
        body += '<div class="col-sm-9"><div id="zoneImportChung"></div></div>';
        if (strMaDanhMuc != undefined && strMaDanhMuc != "") {
            var url_report = edu.system.strhost + "/reportcms/Modules/Common/MauImport.aspx?Ma=" + strMaDanhMuc;
            body += '<div class="col-sm-3 fw-semibold">- Mẫu ' + strTenHienThi + ':</div>';
            body += '<div class="col-sm-9"><a id="btnHSLL_Import" href="' + url_report + '"><i class="fa-solid fa-file-import"></i></a></div>';
        }
        body += '</div>';
        // Panel tiến trình import (2026-09-17): bản này import tự chạy ngay sau khi upload xong,
        // trước đó không có phản hồi nào nên người dùng tưởng máy treo rồi bất chợt thấy bảng lỗi.
        body += '<div id="zoneImportProgress" style="display:none;margin:12px 0;padding:14px 16px;border:1px solid #dbe4f3;border-radius:8px;background:#f8fbff">';
        body += '<div style="display:flex;align-items:center;margin-bottom:10px">';
        body += '<i class="fa fa-spinner fa-spin" style="color:#2563eb;font-size:16px;margin-right:10px"></i>';
        body += '<b id="lblImportProgress" style="color:#1e40af">Đang import...</b>';
        body += '</div>';
        body += '<div class="progress" style="height:18px;margin:0;background:#e8eefb;border-radius:9px;overflow:hidden">';
        body += '<div class="progress-bar progress-bar-striped progress-bar-animated" id="barImportProgress" role="progressbar" style="width:100%;background-color:#2563eb"></div>';
        body += '</div>';
        body += '<div style="margin-top:8px;font-size:12.5px;color:#64748b">Máy chủ đang xử lý toàn bộ file. Vui lòng không đóng cửa sổ này.</div>';
        body += '<div id="lblImportNote" style="margin-top:6px;font-size:12.5px;color:#b45309"></div>';
        body += '</div>';
        // Banner inline thay cho edu.system.alert: alert chồng lên modal import đang mở, tắt alert
        // là gỡ luôn trạng thái modal-open làm modal import tự đóng theo.
        body += '<div id="zoneImportMsg" style="display:none;margin:10px 0;padding:11px 14px;border-radius:6px;font-size:13.5px"></div>';
        body += '<div id="zoneImportChung_Result" class="mt-3"></div>';

        var modal = '';
        modal += '<div class="modal fade modal-alert" id="myModalImportChung" tabindex="-1" aria-hidden="true">';
        modal += '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" style="max-width: 95vw;">';
        modal += '<div class="modal-content">';
        modal += '<div class="modal-header">';
        modal += '<h5 class="modal-title"><i class="fa fa-cloud-upload me-2"></i>Import ' + strTenHienThi + '</h5>';
        modal += '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
        modal += '</div>';
        modal += '<div class="modal-body" id="myModalImportChung_Body">' + body + '</div>';
        modal += '<div class="modal-footer">';
        modal += '<button type="button" class="btn btn-default" data-bs-dismiss="modal"><i class="fa fa-times"></i> Đóng</button>';
        modal += '</div>';
        modal += '</div></div></div>';

        $("#myModalImportChung").remove();
        $("body").append(modal);
        var modalEl = document.getElementById('myModalImportChung');
        var bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
        modalEl.addEventListener('hidden.bs.modal', function () {
            $("#myModalImportChung").remove();
        });

        edu.system.uploadImport(["zoneImportChung"], GetDuLieuDanhMuc);

        // Biến điều khiển tiến trình + giới hạn retry (2026-09-17)
        var _iImportRetry = 0;
        var _timerImport = null;
        var _bImportRunning = false;

        function _showImportMsg(strNoiDung) {
            $("#zoneImportMsg")
                .attr("style", "display:block;margin:10px 0;padding:11px 14px;border-radius:6px;font-size:13.5px;background:#fef2f2;border:1px solid #fecaca;color:#991b1b")
                .html('<i class="fa-solid fa-triangle-exclamation" style="margin-right:8px"></i>' + strNoiDung);
        }

        function _hideImportMsg() {
            $("#zoneImportMsg").hide().html("");
        }

        function _startImportProgress() {
            var dStart = new Date().getTime();
            _bImportRunning = true;
            $("#lblImportNote").html("");
            $("#zoneImportChung_Result").html("");
            $("#zoneImportProgress").show();
            var fnTick = function () {
                var iGiay = Math.floor((new Date().getTime() - dStart) / 1000);
                var strPhut = ("0" + Math.floor(iGiay / 60)).slice(-2);
                var strGiay = ("0" + (iGiay % 60)).slice(-2);
                $("#lblImportProgress").html("Đang import — đã chạy " + strPhut + ":" + strGiay);
            };
            fnTick();
            if (_timerImport) clearInterval(_timerImport);
            _timerImport = setInterval(fnTick, 1000);
        }

        function _stopImportProgress() {
            _bImportRunning = false;
            if (_timerImport) { clearInterval(_timerImport); _timerImport = null; }
            $("#lblImportNote").html("");
            $("#zoneImportProgress").hide();
        }

        function GetDuLieuDanhMuc(a, strPath) {
            if (_bImportRunning) return;
            // Callback của uploadImport chạy cả khi người dùng GỠ file (strPath rỗng) — khi đó
            // chỉ dọn màn hình, không import và cũng không báo lỗi — 2026-09-17
            if (strPath === undefined || strPath === null || strPath === "") {
                _hideImportMsg();
                $("#zoneImportChung_Result").html("");
                return;
            }
            _hideImportMsg();
            _iImportRetry = 0;
            _startImportProgress();
            var obj_list = {
                'action': 'SYS_Import/SImport',
                'strPath': strPath,
                'strApp_Id': edu.system.appId,
                'strMaDanhMuc': strMaDanhMuc,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strNguoiThucHien_Id': edu.system.userId,
                'lKeyVal': []
            };
            if (strMaDanhMuc === undefined || strMaDanhMuc === "") {
                // Thiếu return ở đây khiến import bị gọi 2 lần (một lần tại đây, một lần trong
                // success của request lấy danh mục bên dưới) — 2026-09-17
                ImportData(obj_list);
                return;
            }
            me.makeRequest({
                success: function (data) {
                    // lKeyVal khai báo ngoài if: nếu request danh mục trả Success=false thì trước đây
                    // obj_list.lKeyVal = undefined — 2026-09-17
                    var lKeyVal = [];
                    if (data.Success) {
                        for (var i = 0; i < data.Data.length; i++) {
                            if (edu.util.checkValue(data.Data[i].THONGTIN5)) {
                                //obj_list[data.Data[i].MA] = eval(data.Data[i].THONGTIN5);
                                lKeyVal.push({ strKey: data.Data[i].MA, strVal: eval(data.Data[i].THONGTIN5) });
                            }
                        }
                    }
                    obj_list.lKeyVal = lKeyVal;
                    ImportData(obj_list);

                },
                error: function (er) {
                    // Không tắt tiến trình ở đây thì thanh quay mãi khi bước lấy danh mục lỗi — 2026-09-17
                    _stopImportProgress();
                    _showImportMsg("Không lấy được cấu hình danh mục import. Vui lòng thử lại.");
                },
                type: 'GET',
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                contentType: true,
                data: {
                    'strMaBangDanhMuc': strMaDanhMuc,
                    'strTieuChiSapXep': "",
                    'dTrangThai': 995
                },
                fakedb: [

                ]
            }, false, false, false, null);
        }

        function ImportData(obj_list) {

            //

            edu.system.makeRequest({
                success: function (data) {
                    _stopImportProgress();
                    if (data.Success) {
                        data = data.Data;
                        $("#myModalImportChung .tableError").remove();
                        if (data.length > 0) {
                            var iThanhCong = 0;
                            var iThatBai = 0;
                            var row = '';
                            row += '<table class="table table-hover table-bordered tableError w-100">';
                            row += '<thead><tr><th colspan="2">Thành công <span class="italic color-active">' + (function () { var ok = 0; for (var k = 0; k < data.length; k++) { if (!edu.util.checkValue(data[k].VALUE)) ok++; } return ok; })() + '</span>; Thất bại: <span class="italic color-warning">' + (function () { var f = 0; for (var k = 0; k < data.length; k++) { if (edu.util.checkValue(data[k].VALUE)) f++; } return f; })() + '</span></th></tr>';
                            row += '<tr><th style="width:40%">Dữ liệu</th><th>Lỗi</th></tr></thead>';
                            row += '<tbody>';
                            for (var i = 0; i < data.length; i++) {
                                if (edu.util.checkValue(data[i].VALUE)) {
                                    iThatBai++;
                                    row += '<tr>';
                                    row += '<td>' + edu.util.returnEmpty(data[i].KEY) + '</td>';
                                    row += '<td>' + edu.util.returnEmpty(data[i].VALUE) + '</td>';
                                    row += '</tr>';
                                } else {
                                    iThanhCong++;
                                }
                            }
                            row += '</tbody>';
                            row += '</table>';
                            if ($("#myModalImportChung").length) {
                                $("#zoneImportChung_Result").html(row);
                            } else {
                                edu.system.alert(row);
                            }
                        }
                        if (sCallback != undefined && sCallback != "undefined" && sCallback != "") {
                            eval(sCallback);
                        }
                    }
                    else {
                        // Trước đây Success=false là im lặng hoàn toàn — 2026-09-17
                        _showImportMsg("Import không thực hiện được: " + edu.util.returnEmpty(data.Message));
                    }
                },
                error: function (er) {
                    // Trước đây đổ thẳng JSON.stringify(er) ra alert: người dùng không đọc được gì.
                    // Nay thử lại tối đa 2 lần rồi báo bằng banner inline — 2026-09-17
                    _iImportRetry++;
                    if (_iImportRetry <= 2) {
                        $("#lblImportNote").html('<i class="fa-solid fa-rotate-right" style="margin-right:6px"></i>Kết nối lỗi, đang thử lại lần ' + _iImportRetry + "/2...");
                        setTimeout(function () {
                            ImportData(obj_list);
                        }, 1000);
                        return;
                    }
                    _stopImportProgress();
                    _showImportMsg("Import thất bại: không gọi được máy chủ sau 3 lần thử. Vui lòng kiểm tra lại file rồi thực hiện lại.");
                },
                type: 'POST',
                action: obj_list.action,

                contentType: true,

                data: obj_list,
                fakedb: [

                ]
            }, false, false, false, null);
        }

    },

    change_alias: function (alias) {
        var str = alias;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        return str;
    },
    collageInTable: function (obj) {
        var me = this;
        var strTable_Id = obj.strTable_Id
        var iBatDau = obj.iBatDau;//Cột bắt đầu thực hiện collage
        var iKetThuc = obj.iKetThuc;//Cột kết thúc thực hiện collage
        var arrStr = obj.arrStr;//Mảng các cột sẽ được cộng dồn dữ liệu khi collage
        var arrFloat = obj.arrFloat;//Mảng số thực sẽ được tính tổng khi collage
        var iInputCheck = obj.iInputCheck;//Vị trí ô check box nếu có

        var row = $("#" + strTable_Id + ' tbody')[0].rows;
        for (var i = 0; i < row.length; i++) {
            row[i].id = "";
        }
        checkData(row, iBatDau);

        function checkData(rows, iSet) {
            if (iSet > iKetThuc) return;//Kết thúc đề quy khi vị trí xét = vị trí kết thúc
            var temp = rows[0];//Lấy dòng đầu tiên đem so sánh với các dòng tiếp theo nếu trùng nhau thì sẽ thực hiện collage. Khác nhau sẽ thúc khối dữ liệu này sang khối khác
            var arrResult = [];
            var bLanDau = true;//Để không thực hiện collage khi chỉ có 1 loại dữ liệu
            for (var i = 1; i < rows.length; i++) {
                var strTempHTML = temp.cells[iSet].innerHTML;
                if (rows[i].cells[iSet].innerHTML === strTempHTML) {
                    if (strTempHTML === "" || rows[i].id.length === 32) continue;
                    arrResult.push(rows[i]);
                }
                else {
                    if (arrResult.length > 0) {
                        addValue(arrResult, temp, iSet);
                        bLanDau = false;
                    }
                    temp = rows[i];
                    arrResult = [];
                }
            }

            if (arrResult.length > 0 && !bLanDau) {
                addValue(arrResult, temp, iSet);
            }
            else {//
                if (arrResult.length > 0 && bLanDau) {
                    checkData(rows, iSet + 1);
                }
            }
        }

        function addValue(arrResult, temp, iSet) {
            //temp rows đầu tiên của tất cả row đang xét
            //arrResult là mảng rows tiếp theo của tất cả row đang xét
            if (temp.id.length === 32) return;//Thoát khi nó là thằng đã đc sinh ra từ collage
            if (iSet > iKetThuc) return;
            var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';
            for (var i = 0; i < 32; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            //
            var strParentClassName = $(temp).attr("class");
            if (edu.util.checkValue(strParentClassName)) {
                $(temp).before('<tr style="font-weight: bold; display: none" id="' + randomString + '" class="' + strParentClassName + '">' + temp.innerHTML + '</tr>');
            }
            else {
                $(temp).before('<tr style="font-weight: bold;" id="' + randomString + '">' + temp.innerHTML + '</tr>');
            }
            //
            var pointHienThi = document.getElementById(randomString);
            //Hiện thị string
            for (i = 0; i < arrStr.length; i++) {
                var ivitriSelect = arrStr[i];
                var strHienThi = temp.cells[ivitriSelect].innerHTML;
                for (var j = 0; j < arrResult.length; j++) {
                    var strTempCheck = arrResult[j].cells[ivitriSelect].innerHTML;
                    if (strHienThi.includes(strTempCheck)) continue;
                    strHienThi += ', ' + strTempCheck;
                }
                pointHienThi.cells[ivitriSelect].innerHTML = strHienThi;
            }

            arrResult.unshift(temp);
            //Hiện thị số
            for (i = 0; i < arrFloat.length; i++) {
                var ivitriSelect = arrFloat[i];
                var dHienThi = 0.0;
                dHienThi = parseFloat(dHienThi);
                for (var i = 0; i < arrResult.length; i++) {
                    var xxx = (arrResult[i].cells[ivitriSelect].innerHTML).replace(/ /g, "").replace(/,/g, "");
                    dHienThi += parseFloat(xxx);
                }
                dHienThi = edu.util.formatCurrency(dHienThi);
                pointHienThi.cells[ivitriSelect].innerHTML = dHienThi;
            }
            //
            if (edu.util.checkValue(iInputCheck)) {
                pointHienThi.cells[iInputCheck].innerHTML = '<input type="checkbox" name="input' + randomString + '" class="inputParent" />';
            }

            //Add class cho từng tr và input tại cell cuối
            for (i = 0; i < arrResult.length; i++) {
                arrResult[i].cells[iSet].innerHTML = "";
                arrResult[i].style.display = 'none';
                $(arrResult[i]).attr("class", "");
                arrResult[i].classList.add(randomString);
            }
            //Add action đóng mở 
            pointHienThi.cells[iSet].innerHTML = '<i class="fa fa-plus collapeParent" name="' + randomString + '" style="cursor: pointer;"></i> ' + pointHienThi.cells[iSet].innerHTML;
            //
            checkData(arrResult, iSet + 1);
        }

        function collageAll(point) {
            point.classList.remove('fa-minus');
            point.classList.add('fa-plus');

            var id = $(point).attr("name");
            $('#' + strTable_Id + ' tbody tr.' + id).each(function () {
                this.style.display = 'none';
                var id = this.id;
                //Xử lý những thằng con
                if (id.length === 32) {
                    var x = $('#' + strTable_Id + ' tbody')[0].getElementsByClassName("collapeParent");
                    for (var i = 0; i < x.length; i++) {
                        var pointChild = x[i];
                        if ($(pointChild).hasClass('fa-minus') && $(pointChild).attr('name') === id) {
                            collageAll(pointChild);
                        }
                    }
                }
            });
        }

        $(document).delegate(".collapeParent", "click", function (e) {
            e.stopImmediatePropagation();
            var point = $(this);
            var id = point.attr('name');
            if (point.hasClass('fa-plus')) {
                this.classList.remove('fa-plus');
                this.classList.add('fa-minus');
                $('#' + strTable_Id + ' tbody tr.' + id).each(function () {
                    this.style.display = '';
                });
            } else {
                collageAll(this);
            }
        });

        if (edu.util.checkValue(iInputCheck)) {
            $(document).delegate(".inputParent", "click", function (e) {
                var id = this.name.replace(/input/g, '');
                var checked_status = $(this).is(':checked');
                checkuncheckAll(id, checked_status);
            });

            function checkuncheckAll(id, checked_status) {
                $('#' + strTable_Id + ' tbody tr.' + id + ' input').each(function () {
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                    if (checked_status) {
                        this.parentNode.parentNode.classList.add('tr-bg');
                    }
                    else {
                        this.parentNode.parentNode.classList.remove('tr-bg');
                    }
                    var id = this.name.replace(/input/g, '');
                    if (id.length == 32 && $(this).hasClass('inputParent')) {
                        checkuncheckAll(id, checked_status);
                    }
                });
            }
        }
    },
    //Core phục vụ lưu động
    beingSpin: function (id, iTime) {
        //id là id vị trí của biến cần hiển thị cái quay quay
        //iTime là thời gian quay không có mặc định sẽ là 2s
        if (!edu.util.checkValue(iTime)) iTime = 2000;
        $("#" + id).parent().append('<i id="extend_spin_id' + id + '" style="color:#007acc" class="fa fa-refresh fa-spin"></i>');
        document.getElementById(id).style.display = "none";

        setTimeout(function () {
            //Khi kết thúc thời gian iTime sẽ xóa hoàn toàn ô xoay xoay
            $("#extend_spin_id" + id).replaceWith('');
            document.getElementById(id).style = "text-align:center";
        }, iTime);
    },
    checkData: function (icheckData, value) {
        //Nếu icheckData bằng null sẽ bỏ qua
        var bcheck = true;
        switch (icheckData) {
            case 1: bcheck = edu.util.floatValid(value); break;
        }
        return bcheck;
    },
    initLuuDon: function (strPointId, strBtnCapNhatId, callback_Load) {
        var me = this;
        //strPointId là selected là lựa chọn chế độ lưu đơn và cập nhật(1: bật lưu đơn, 0: tắt lưu đơn);
        //Tắt nút cập nhật khi chuyển sang chế chộ lưu đơn (Nút cập nhật chỉ phục vụ cho lưu tổng thể)
        //callback ở đây là hàm load lại getList dữ liệu, hoặc có thể sẽ là load lại trang
        if (me.iLuuDon === 1) document.getElementById(strPointId).style.display = "none";
        //Cập nhật lại chế độ lưu khi mới gọi gàm
        $("#" + strPointId).val(me.iLuuDon).trigger("change");
        //Mỗi khi có sự thay đổi select chế độ ẩn hoặc mở nút Cập nhật, cập nhật trạng thái lưu đơn, gọi callback
        $('#' + strPointId).on('select2:select', function () {
            var checkLuuDon = $('#' + strPointId).val();
            if (checkLuuDon === 1) document.getElementById(strBtnCapNhatId).style.display = "none";
            else {
                document.getElementById(strBtnCapNhatId).style.display = "";
            }
            me.iLuuDon = checkLuuDon;
            if (callback_Load !== undefined) callback_Load();
        });
    },
    //Bộ phục vụ load bảng động input
    get_TempValue_FromHtml: function (adress) {//Sử dụng để kiểm tra lưu thay đổi giá trị trong ô nhập
        //adress là địa chỉ của ô hiện tại tương đương với this
        this.strTempValue = $(adress).val();
    },
    checkChangeLuuDonToSave: function (strPointId, callBack_Save, icheckData) {
        var me = this;
        //strPointId là id đối tượng con trỏ đang chỉ vào trên bảng
        //callBack ở đây sẽ là hàm lưu khi 
        //Kiểm tra xem có đúng chế độ lưu đơn không thì đi tiếp
        //Lấy giá trị của nó kiểm tra xem có giống với nó trước đó không
        //
        if (me.iLuuDon === 0) return;
        var value = $("#" + strPointId).val();
        if (me.strTempValue === value) return;
        else {
            //Kiểm tra loại dữ liệu xem có thỏa mãn không. Nếu không thỏa mãn thoát luôn
            if (!me.checkData(icheckData, value)) {
                $("#" + strPointId).val(me.strTempValue);
                return;
            }
            me.beingSpin(strPointId);
            //Đây là hàm lưu nhé
            callBack_Save(strPointId);
        }
    },
    checkChangeToSave: function (zone_id, eventClick_Id, callBack_Save, icheckData) {
        var me = this;
        //zone_id thường là id của table
        //eventClick_Id là nút cập nhật chỉ dành cho chế độ lưu nhiều
        //callBack_Save gọi lại hàm lưu sau khi đã kiểm duyệt các đối tượng đã thỏa mãn
        //icheckData là loại check dữ liệu
        //Đưa toàn bộ giá trị của mảng hiện tại vào bảng tạm
        //Khi có sự kiện nút cập nhật sẽ lấy toàn bộ giá trị của bảng biến tạm, kiểm tra có khác so với, rồi lưu luôn
        //Dựng toàn bộ địa chỉ đối tượng cần kiểm tra vào bảng tạm
        var arrElement = $("#" + zone_id).find("input, select, textarea");
        var arrVal = [];
        for (var i = 0; i < arrElement.length; i++) {
            arrVal.push($("#" + arrElement[i].id).val());
        }
        //Mỗi khi ấn nút cập nhật sẽ:
        //1.Kiểm tra xem dữ liệu có thay đổi không
        //2. Kiểm tra loại dữ liệu
        //3. Gọi hàm lưu và thông báo những thông tin đó ra ngoài
        $("#" + eventClick_Id).click(function (e) {
            e.stopImmediatePropagation();
            var icount = 0;
            var arrID = [];
            for (var i = 0; i < arrElement.length; i++) {
                var temp = $("#" + arrElement[i].id).val();
                if (temp !== arrVal[i]) {
                    if (!me.checkData(icheckData, temp)) {
                        $("#" + arrElement[i].id).val(arrVal[i]);
                        continue;
                    }
                    arrVal[i] = temp;
                    icount++;
                    me.beingSpin(arrElement[i].id);
                    callBack_Save(arrElement[i].id);
                }
            }
            if (icount > 0) {
                me.alert("Có " + icount + " liệu đã được gửi đi. Hãy kiểm tra lại!", "pow");
            }
            else me.alert("Không có dữ liệu nào được thay đổi", "pow");
        });
    },

    //Bộ phục vụ load bảng động checkbox
    checkChangeToSave_CheckBox: function (zone_id, eventClick_Id, callBack, icheckData) {
        var me = this;
        //zone_id là id của table cần lấy dữ liệu
        //Tương tự như lưu đơn dành cho đa dữ liệu
        var arrElement = $("#" + zone_id).find("input");
        var arrVal = [];
        for (var i = 0; i < arrElement.length; i++) {
            arrVal.push($("#" + arrElement[i].id).is(':checked'));
        }
        var arrValCheck = arrVal;
        $("#" + eventClick_Id).click(function (e) {
            e.stopImmediatePropagation();
            var icount = 0;
            for (var i = 0; i < arrElement.length; i++) {
                var temp = $("#" + arrElement[i].id).is(':checked');
                //Kiểm tra id lớn hơn 63 do sợ đó là input thừa
                if (arrElement[i].id.length > 63) {
                    if (temp !== arrValCheck[i]) {
                        if (!me.checkData(icheckData)) {
                            if ($("#" + arrElement[i].id).is(':checked')) {
                                document.getElementById(arrElement[i].id).checked = false;
                            }
                            else {
                                document.getElementById(arrElement[i].id).checked = true;
                            }
                            continue;
                        }
                        arrVal[i] = temp;
                        icount++;
                        me.beingSpin(arrElement[i].id);
                        callBack(arrElement[i].id);
                    }
                }
            }
            var strThongBao = "";
            if (icount > 0) {
                strThongBao += "Đã có " + icount + " dữ liệu thay đổi. Hãy kiểm tra lại";
                me.alert(strThongBao, "pow");
            }
            else me.alert("Không có dữ liệu nào được thay đổi", "pow");
        });
    },
    checkChangeLuuDonToSave_CheckBox: function (zone_id, callBack, icheckData) {
        var me = this;
        //zone_id là id của table
        $(document).delegate('#' + zone_id + ' input[type="checkbox"]', "click", function () {
            //Kiểm tra xem có đúng chế độ lưu đơn không thì đi tiếp
            //Lấy giá trị của nó kiểm tra xem có giống với nó trước đó không
            //
            if (me.iLuuDon === 0) return;
            var id = this.id;
            me.beingSpin(id);
            //Đây là hàm lưu nhé
            callBack(id);
        });
    },

    insertSumAfterTable: function (strTable_Id, arrId) {
        var me = this;
        //arrId là mảng chỉ số cột [1, 4, 6] cần tỉnh tổng hiện cuối bảng
        //Quét toàn các cột arrId xong gọi gàm tính tổng
        x = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
        if (x[0] == undefined) return;
        var tfoot = "<tr style='font-weight: bold'><td>Tổng</td>";
        var iLCell = x[0].cells.length;

        if (arrId === undefined) {
            for (var i = 1; i < iLCell; i++) {
                var sum = me.countFloat(strTable_Id, i);
                if (sum !== 0.0) tfoot += "<td>" + sum + "</td>";
                else tfoot += "<td></td>";
            }
        }
        else {
            for (var i = 1; i < iLCell; i++) {
                var sum = 0.0;
                for (var j = 0; j < arrId.length; j++) {
                    if (arrId[j] == i) {
                        sum = me.countFloat(strTable_Id, i);
                        break;
                    }
                }
                if (sum !== 0.0) tfoot += "<td>" + sum + "</td>";
                else tfoot += "<td></td>";
            }
        }
        tfoot += "</tr>";
        $("#" + strTable_Id + " tfoot").html(tfoot);
    },
    countFloat: function (strTable_Id, icol, iinput, icolHeSo) {
        var me = this;
        //iinput là số cột nếu không check sẽ không tính
        x = document.getElementById(strTable_Id).getElementsByTagName('tbody')[0].rows;
        if (x[0] == undefined) return;
        if (x[0].cells.length == 1) return;
        //Tính tổng được cho cả cell có chứa input hoặc bất kỳ thẻ gì dạng lấy html
        var sum = 0.0;
        for (var j = 0; j < x.length; j++) {
            //Cột không chính xác chuyển sang cột khác
            //Lấy giá trị của cell. Nếu cell có chứa thẻ đặc biệt thì lấy dữ liệu chính xác bên trong nó
            //Nếu vị trí check không được check sẽ bỏ qua
            if (iinput !== undefined) {
                var binput = x[j].cells[iinput].getElementsByTagName('input')[0].checked;
                if (binput === false) continue;
            }
            if (x[j].cells[icol] === undefined) continue;
            var val = (x[j].cells[icol].innerHTML);
            //Dữ liệu chỉ dành cho iput
            if (val.indexOf('<input') != -1) {
                if (val.includes('checkbox')) break;
                val = x[j].cells[icol].getElementsByTagName('input')[0].value;
            }
            else {
                //Xử lý dành cho các thẻ lấy dạng html
                var ibatdau = val.indexOf('>');
                if (ibatdau !== -1) {
                    var iketthuc = val.indexOf('<', ibatdau);
                    val = val.substring(ibatdau + 1, iketthuc);
                }
            }
            var iHeSo = 1;
            if (icolHeSo != undefined) {
                if (x[j].cells[icolHeSo] === undefined) continue;
                var valHeSo = (x[j].cells[icolHeSo].innerHTML);
                //Dữ liệu chỉ dành cho iput
                if (valHeSo.indexOf('<input') != -1) {
                    if (valHeSo.includes('checkbox')) break;
                    valHeSo = x[j].cells[icolHeSo].getElementsByTagName('input')[0].value;
                }
                else {
                    //Xử lý dành cho các thẻ lấy dạng html
                    var ibatdau = valHeSo.indexOf('>');
                    if (ibatdau !== -1) {
                        var iketthuc = valHeSo.indexOf('<', ibatdau);
                        valHeSo = valHeSo.substring(ibatdau + 1, iketthuc);
                    }
                }
                if (valHeSo === "") val = 1;
                var iHeSo = parseFloat(valHeSo);
            }
            val = val.replace(/ /g, "").replace(/,/g, "");
            if (val === "") val = 0;
            var dHeSo = parseFloat(val);
            if (edu.util.floatValid(dHeSo)) {
                sum += iHeSo * dHeSo;
            }
        }
        sum = Math.floor(sum * 100) / 100;
        sum = me.convertFloat(sum);
        return sum;
    },
    convertFloat: function (sum) {
        //Check dữ liệu xem có đúng là kiểu float không
        if (!edu.util.checkValue(sum) || sum === 0) {
            return '0';
        }
        sum = "" + sum;
        sum = sum.replace(/,/g, '');
        var strextend = "";
        if (sum.indexOf('.') !== -1) {
            strextend = sum.substring(sum.indexOf('.'));
            sum = sum.substr(0, sum.indexOf('.'));
        }
        sum = edu.util.formatCurrency(sum) + strextend;
        return sum;
    },
    checkSoTienInput: function (point, bQuaSoTien) {
        var fCheck = $(point).attr('name');
        fCheck = edu.util.formatCurrency(fCheck);
        //Lấy giá trị ô input dựa theo thằng cha
        var pointChinhSua = point;
        var x = pointChinhSua.value;
        if (x[x.length - 1] == "." || x[x.length - 1] == ",") return false;
        x = x.replace(/,/g, '');
        if (x != '' && !edu.util.floatValid(x)) {
            pointChinhSua.value = fCheck;
            return false;
        }
        //Khi rút tiền sẽ không cho rút quá
        if (bQuaSoTien) {
            x = parseFloat(x);
            var strSoTienGoc = fCheck.replace(/,/g, '');
            strSoTienGoc = parseFloat(strSoTienGoc);
            if (x > strSoTienGoc) {
                pointChinhSua.value = fCheck;
                return false;
            }
        }
        //Hiển thị lại giá trị sau khi sửa
        pointChinhSua.value = edu.util.formatCurrency(pointChinhSua.value.replace(/,/g, ''));
        return true;
    },

    actionRowSpanForACol: function (strTableId, icol) {
        x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
        var tempCellobj = x[0].cells[icol];
        for (var i = 1; i < x.length; i++) {
            if (tempCellobj == "" || x[i].cells[icol].innerHTML !== tempCellobj.innerHTML) {
                tempCellobj = x[i].cells[icol];
            } else {
                tempCellobj.rowSpan++;
                x[i].deleteCell(icol);
            }
        }
    },
    //Chưa làm 
    sortTable_Master: function (strTableId) {
        //Lưu toàn bộ row ra ngoài
        //Multi sort - hoàn thiện - viết lại
        //Lưu ý: phá huỷ để tái thiết lập

        //Dựng clone: Lấy toàn bộ row lưu vào bảng tạm
        //Sort dữ liệu trong bảng rồi append ngược lại

        //x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
        //for (var i = 0; i < x.length; i++) {

        //}
        sortTable(strTableId, 1);

        function sortTable(table, column) {
            var asc = true;
            //var node = document.getElementById("myList2").lastChild;
            //document.getElementById("myList1").appendChild(node);
            //
            var tbody = document.getElementById(table).getElementsByTagName('tbody')[0].rows[0];
            document.getElementById('tbldata_BLCS_LoaiKhoan').getElementsByTagName('tbody')[0].appendChild(tbody.cloneNode(true));
            //$("#" + table + " tbody").html('');

            //Sort the table using a custom sorting function by switching 
            //the rows order, then append them to the table body
            //table.sort(function (a, b) {
            //    //var aa = a.cells[column].innerHTML;
            //    //var bb = b.cells[column].innerHTML;
            //    //
            //    var aa = $('td:eq(' + column + ')', a).text();
            //    var bb = $('td:eq(' + column + ')', b).text();
            //    if (asc) {
            //        return aa.localeCompare(bb);
            //    } else {
            //        return bb.localeCompare(aa);
            //    }
            //}).appendTo(tbody);

            //table.find('tr').sort(function (a, b) {
            //    var aa = $('td:eq(' + column + ')', a).text();
            //    var bb = $('td:eq(' + column + ')', b).text();
            //    if (!asc) {
            //        return aa.localeCompare(bb);
            //    } else {
            //        return bb.localeCompare(aa);
            //    }
            //}).appendTo(table);
        }
    },

    //edu.systemextend.actionRowSpan("tbldata_BLCS_LoaiKhoan", [1, [0, [4, [5, 6]], 7, 8, 9]]); || [1, 7, 8, 9]]
    actionRowSpan: function (strTableId, arrCol) {
        //1. Lấy toàn bộ rows tưởng tượng nó có thể chia thành nhiều khối với mỗi khối là các rows hoặc row (không xử lý row đơn)
        //2. Nếu chỉ là rowspan bình thưởng chuyển sang hàm rowspan đơn giản
        //3. row phức tạp theo hình thức đệ quy cha con được cấu trúc như trên sẽ được xử dụng theo các bước
        //3.1 truyền khối rows đó vào có truyển mảng con cẩn xử lý (function rowACol có arrChild là 1 phần mảng đầu vào. 1, [0, [4, 5, 6] Mảng con là [4, 5, 6], mảng con có thể đệ quy là 1 mảng lớn
        //3.2 duyệt từ đầu đến cuối khối xem có phần tử giống nhau thì đẩy sang 1 mảng delete (nếu xóa ngay sẽ không thao tác được tiếp vì số rows và cols trong khối rows đó đã thay đổi)
        //3.3 chuyển tiếp xử lý đến từng phẩn tử con trong mảng đầu vào nếu là mảng lớn thì có truyền arrChild trong rowACol
        //3.4 Xử lý theo tuần tự từ đầu mảng đến cuối mảng không lắt léo
        //3.5 Xóa và rowspan các phần tử đã vào danh sách đen trong quá trình xử lý
        x = document.getElementById(strTableId).getElementsByTagName("tbody")[0].rows;
        var bcheck = true;
        //Kiểm tra xem arr có phải là row span đơn giản không
        for (var i = 0; i < arrCol.length; i++) {
            if (typeof (arrCol[i]) !== 'number') {
                bcheck = false;
                break;
            }
        }
        if (bcheck) {//Chuyển sang row span đơn giản
            rowSpanSimple(x, arrCol);
            return;
        }
        //
        var arrCellsDelete = [];
        //Bắt đầu tiểm điểm chung giữa các cells
        rowACol(x, arrCol[0], 0, arrCol[1]);
        //Sau khi tìm xong các cells cần xóa bắt đầu xóa lần lượt
        deleteCells();
        //Check phần tử trùng nhau
        function rowACol(rows, icol, iBatDau, arrChild) {
            //Rows là 1 khối dòng 
            //icol là cột đem so sánh
            //iBatDau là số dòng bắt đầu
            //arrChild mảng con cần so sánh nếu có
            //Đây là đệ quy nhé. Nếu row thấp tự hủy luôn
            if (rows === undefined || rows === null || rows.length < 2) return;
            if (typeof (icol) !== 'number') return;
            var iKetThuc = 0;//Đây là số dòng trong mảng giống nhau
            var tempCellobj = rows[0].cells[icol].innerHTML;//Bắt đầu lấy phần tử đầu tiên đem so sánh
            for (var i = 1; i < rows.length; i++) {//Nếu khác nhau thực hiện chuyển tiếp và thực hiện 
                if (tempCellobj == "" || rows[i].cells[icol].innerHTML !== tempCellobj) {
                    tempCellobj = rows[i].cells[icol].innerHTML;
                    nextRowSpan(icol, iBatDau, iKetThuc, arrChild);
                    //reset
                    iBatDau = i;
                    iKetThuc = 0;
                } else {//Nếu giống nhau số dòng giống nhau tăng thêm 1. Nếu đến cuối mảng vẫn giống nhau chuyển sang bên kia
                    iKetThuc++;
                    if (i === rows.length - 1) nextRowSpan(icol, iBatDau, iKetThuc, arrChild);
                }
            }
        }
        //Thực hiện chuyển tiếp nếu có arrChild
        function nextRowSpan(icol, iBatDau, iKetThuc, arrChild) {
            if (iKetThuc === 0) return; //Thoát ra khi có lỗi không có row nào
            arrCellsDelete.push([icol, iBatDau, iKetThuc]);// Đẩy bộ 3 số để row span số cột, dòng bắt đầu, dòng kết thúc
            var arr = arrChild;//
            if (arr === undefined || arr.length < 2) return;//arrChild không tồn tại
            var rows = [x[iBatDau]];// bắt đầy đầy các dòng vào row
            for (i = 0; i < iKetThuc; i++) {
                rows.push(x[iBatDau + i + 1]);
            }
            for (i = 0; i < arr.length; i++) {
                if (typeof (arr[i]) === 'number') {
                    rowACol(rows, arr[i], iBatDau, undefined);//Rowspan với không mảng con đệ quy
                }
                else {
                    if (typeof (arr[i]) === 'object') {
                        rowACol(rows, arr[i][0], iBatDau, arr[i][1]);//Rowspan với mảng con đệ quy
                    }
                }
            }
        }

        function deleteCells() {
            //Sort cells in theo thứ tự giảm dần để tránh sự sai sót khi xóa dữ liệu
            for (var i = 0; i < arrCellsDelete.length - 1; i++) {
                for (var j = i + 1; j < arrCellsDelete.length; j++) {
                    if (arrCellsDelete[j][0] < arrCellsDelete[i][0]) {
                        var arrTempSwitch = arrCellsDelete[j];
                        arrCellsDelete[j] = arrCellsDelete[i];
                        arrCellsDelete[i] = arrTempSwitch;
                    }
                }
            }
            //Thực hiện rowspan và xóa cells thừa. Đi 
            for (var i = arrCellsDelete.length - 1; i >= 0; i--) {
                var iCot = arrCellsDelete[i][0];
                var iBatDau = arrCellsDelete[i][1];
                var iKetThuc = arrCellsDelete[i][2];
                var tempCellobj = x[iBatDau].cells[iCot];
                for (var j = 0; j < iKetThuc; j++) {
                    tempCellobj.rowSpan++;
                    x[iBatDau + j + 1].deleteCell(iCot);
                }
            }
        }

        function rowSpanSimple(rows, arrCol) {
            //Sắp xếp theo thứ tự giảm dần mảng arrCol để xóa không có lỗi
            for (var i = 0; i < arrCol.length - 1; i++) {
                for (var j = i + 1; j < arrCol.length; j++) {
                    if (arrCol[j] > arrCol[i]) {
                        var itemArrSwitch = arrCol[i];
                        arrCol[i] = arrCol[j];
                        arrCol[j] = itemArrSwitch;
                    }
                }
            }
            //
            for (var i = 0; i < arrCol.length; i++) {
                var icol = arrCol[i];
                var tempCellobj = rows[0].cells[icol];//Lấy giữ liệu thằng đầu dòng đem so sánh.
                for (var j = 1; j < rows.length; j++) {//Nếu trùng thằng nào ++ rowspan và xóa luôn
                    if (rows[j].cells[icol].innerHTML !== tempCellobj.innerHTML) {
                        tempCellobj = rows[j].cells[icol];
                    } else {
                        tempCellobj.rowSpan++;
                        rows[j].deleteCell(icol);
                    }
                }
            }
        }
    },

    actionColSpan: function (strTableId, arrRow) {//Xóa các cột trùng nhau trong 1 row.
        x = document.getElementById(strTableId).rows;
        for (var k = 1; k < arrRow.length; k++) {
            var i = arrRow[k];
            if (typeof (i) !== 'number') continue;
            var tempCellobj = x[i].cells[0];//Lấy giá trị đầu tiền đem so sánh với các thông tin tiếp theo. Nếu khác nhau thực hiện cộng colspan và xóa cell đó
            for (var j = 1; j < x[i].cells.length; j++) {
                if (x[i].cells[j].innerHTML !== tempCellobj.innerHTML) {
                    tempCellobj = x[i].cells[j];
                } else {
                    tempCellobj.colSpan++;
                    x[i].deleteCell(j);
                    j--;
                }
            }
        }
    },
    switchLoaiKhac: function (dropA, txtB, bshow) {
        setTimeout(function () {
            if ($("#" + dropA).is(":visible")) {
                edu.system.hiddenElement('{"parent":"#' + txtB + '"}');
            }
        }, 1000);

        $("#" + dropA).on("select2:select", function () {
            var check = $("#" + dropA + " option:selected").attr("name");
            if (check == "ZLOAIKHAC") {
                var x = $("#" + txtB).parent();
                x.show();
                x.prev().show();
                if (bshow) x.after('<div class="clear showclear"></div>');
            }
            else {
                var x = $("#" + txtB).parent();
                x.hide();
                x.prev().hide();
                if (bshow) $(".showclear").remove();
            }
        });
    },

    /*------------------------------------------
    --Discription: [3] AcessDB DanhMucDuLieu -->VaiTro
    --ULR:  Modules
    -------------------------------------------*/
    getList_RangBuoc: function (strTableDB, strId) {
        var me = this;
        $(".dashedred").each(function () {
            this.classList.remove("dashedred");
        });
        $(".comment_lydo").remove();
        //--Edit
        var obj_save = {
            'action': 'CMS_RangBuoc_Cot_MH/DSA4FRUTIC8mAzQuIgIuNQPP',
            'func': 'pkg_chung_rangbuoc_cot.LayTTRangBuocCot',
            'iM': edu.system.iM,
            'strTenBangChinh': strTableDB,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDuLieu_Id': strId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    for (var i = 0; i < dtResult.length; i++) {
                        var check = document.getElementById(dtResult[i].KYHIEUCOT);
                        if (edu.util.checkValue(dtResult[i].LYDO)) $(check.parentNode).append('<p class="comment_lydo" style="color: orange;font-style: italic">' + dtResult[i].LYDO + '</p>');
                        if (dtResult[i].KYHIEUCOT.indexOf("drop") == 0) check = check.parentNode;
                        if (check != undefined) {
                            check.classList.add("dashedred");
                        }
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
    autoWithDiv: function (divA, divB) {
        var iHeightA = $("#" + divA).height();
        var iHeightB = $("#" + divB).height();
        if (iHeightA > iHeightB) {
            $("#" + divB).attr("style", "height: " + (iHeightA + 20) + "px");
        } else {
            $("#" + divA).attr("style", "height: " + (iHeightB + 20) + "px");
        }
    },
    nodeChat: function (urlNode) {
        var me = this;
        me["arrUsersChat"] = [];
        // Node chat
        //$("#zoneAllMessage").show();
        try {
            if (typeof io !== "undefined") {
                me["chatRoom"] = {};

                $("#zoneUserChat").delegate('.userChat', 'click', function (e) {
                    var userChat = $(this).attr("userId");
                    var userName = $(this).attr("userName");
                    var userAvatar = $(this).attr("userAvatar");
                    selectUser(userChat, userName, userAvatar);
                });
                if (me.appCode && me.appCode.toUpperCase() == "APISCMS") $("#zoneAllMessage").parent().show();
                var socket = io(urlNode);
                var objUser = {
                    UserName: $("#lblHoTenNguoiDangNhap").html(),
                    UserID: me.userId,
                    UserMa: '',
                    UserServer: me.objApi.DonVi,
                    UserModule: me.appCode,
                    strChucNang_Id: me.strChucNang_Id,
                    UserAvatar: $("#lblAvatar").attr("src")
                };
                me.socket = socket;
                me["arrUsersChat"] = [objUser];
                
                socket.on('connect', () => {
                    socket.emit("client-send-User", objUser);
                });
                socket.on("invite-room", function (obj) {
                    socket.emit("join-room", { roomId: obj.roomId, pairId: obj.UserID });
                    var userCheck = me["arrUsersChat"].find(user => user.UserID === obj.UserID);
                    if (userCheck === undefined || userCheck.length == 0) {
                        me["arrUsersChat"].push({
                            UserName: obj.UserName,
                            UserID: obj.UserID,
                            UserMa: obj.UserMa,
                            UserServer: me.objApi.DonVi,
                            UserAvatar: obj.UserAvatar
                        });
                    }
                });

                socket.on("user-send-message", function (data) {
                    genMessage(data);
                });

                socket.on("toi-dang-go-chu", function (data) {
                    $("#userDangNhan" + data.roomId).html(data.UserName + " đang nhắn");
                });

                socket.on("toi-ngung-go-chu", function (data) {
                    $("#userDangNhan" + data.roomId).html('');
                });

                socket.on("location-reload", function (data) {
                    document.location.reload(true);
                });

                $(document).delegate('.btnSendMessage', 'click', function (e) {
                    var roomId = this.title;
                    if ($("#txtMessage" + roomId).val() == "") return;
                    socket.emit("user-send-message", { data: $("#txtMessage" + roomId).val(), roomId: roomId });
                    $("#txtMessage" + roomId).val("");
                });
                $(document).delegate('.txtSendMessage', 'keypress', function (e) {
                    if (e.which === 13) {
                        var roomId = this.title;
                        if ($("#txtMessage" + roomId).val() == "") return;
                        socket.emit("user-send-message", { data: $("#txtMessage" + roomId).val(), roomId: roomId });
                        $("#txtMessage" + roomId).val("");
                    }
                });
                $(document).delegate('.txtSendMessage', 'focusin', function (e) {
                    socket.emit("toi-dang-go-chu", this.title);
                });
                $(document).delegate('.txtSendMessage', 'focusout', function (e) {
                    socket.emit("toi-ngung-go-chu", this.title);
                });
                $("#tblUserOnline").delegate('.userChat', 'click', function (e) {
                    var userChat = this.id;
                    var userName = $(this).find("td:eq(2)").text();
                    var userAvatar = $(this).find(".table-img").attr("src");
                    selectUser(userChat, userName, userAvatar);
                });
                $("#txtUserOnline_TuKhoa").on("keyup", function () {
                    var value = $(this).val().toLowerCase();
                    $("#tblUserOnline tbody tr").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                    }).css("color", "red");
                });
                $("#btnReload").click(function () {
                    var arrChecked_Id = edu.util.getArrCheckedIds("tblUserOnline", "checkX");
                    if (arrChecked_Id.length == 0) {
                        edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                        return;
                    }
                    socket.emit("admin-send-reload", { arrCheck: arrChecked_Id });
                });
                $("#chkSelectAll_Online").on("click", function () {
                    edu.util.checkedAll_BgRow(this, { table_id: "tblUserOnline" });
                });
                //
                $("#tblUserBanBe").delegate('.userChat', 'click', function (e) {
                    var userChat = this.id;
                    var userName = $(this).find("td:eq(2)").text();
                    var userAvatar = $(this).find(".table-img").attr("src");
                    selectUser(userChat, userName, userAvatar);
                });
                $("#txtUserBanBe_TuKhoa").on("keyup", function () {
                    var value = $(this).val().toLowerCase();
                    $("#tblUserBanBe tbody tr").filter(function () {
                        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                    }).css("color", "red");
                });
                //
                $("#tblUserKhac").delegate('.userChat', 'click', function (e) {
                    var userChat = this.id;
                    var userName = $(this).find("td:eq(2)").text();
                    var userAvatar = $(this).find(".table-img").attr("src");
                    selectUser(userChat, userName, userAvatar);
                });

                $("#btnUserKhac_Search").click(function () {
                    me.getUserKhacChat();
                });

                //getAllUser();
                $("#btnAddUserChat").click(function () {
                    getUserOnline();
                    getAllUser();
                    $("#myModalRoomChat").modal("show");
                    me.getUserKhacChat();
                });

                $("#zoneAllMessage").click(function () {
                    getUserChat();
                });

            }
            else {
                setTimeout(function () { if (me["idemNode"]++ < 10) me.nodeChat(urlNode); }, 1000);
            }
        } catch (Ex) {
        }

        function getUserOnline() {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: urlNode + "/user",
                success: function (data, s, x) {
                    var html = '';
                    var idem = 1;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].UserID == me.userId) continue;
                        html += '<tr id="' + data[i].UserID + '" class="poiter userChat">';
                        html += '<td style="text-align: center">' + idem++ + '</td>';
                        html += '<td><img class="table-img" src="' + data[i].UserAvatar + '"></td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].UserName) + '</td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].UserServer) + '</td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].UserModule) + '</td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].strDuongDanFile) + '</td>';
                        html += '<td style="text-align: center"><input type="checkbox" id="checkX' + data[i].socketID + '"/></td>';
                        html += '</tr>';
                    }
                    $("#tblUserOnline tbody").html(html);

                },
                error: function (x, t, m) {
                },
                cache: false
            });
        }

        function getAllUser() {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: urlNode + "/alluser",
                success: function (data, s, x) {
                    var html = '';
                    var idem = 1;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].userID == me.userId) continue;
                        html += '<tr id="' + data[i].userID + '" class="poiter userChat">';
                        html += '<td style="text-align: center">' + idem++ + '</td>';
                        html += '<td><img class="table-img" src="' + data[i].userAvatar + '"></td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].userName) + '</td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].userModule) + '</td>';
                        html += '<td>' + edu.util.returnEmpty(data[i].userServer) + '</td>';
                        html += '<td>' + convertTimeChat(data[i].dateAccess) + '</td>';
                        html += '<td style="text-align: center"><input type="checkbox" id="chkSelectAll_Chat" /></td>';
                        html += '</tr>';
                    }
                    $("#tblUserBanBe tbody").html(html);
                },
                error: function (x, t, m) {
                },
                cache: false
            });
        }

        function getUserChat() {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: urlNode + "/userchat",
                success: function (data, s, x) {
                    var rUserChat = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].chat == null) continue;
                        var you = "";
                        if (data[i].chat.userId === me.userId) you = "You: ";
                        rUserChat += '<li class="userChat poiter" roomId="' + data[i].room.roomId + '" userId="' + data[i].user.userID + '" userName="' + data[i].user.userName + '" userAvatar="' + data[i].user.userAvatar + '">';
                        rUserChat += '<a>';
                        rUserChat += '<div class="pull-left">';
                        rUserChat += '<img src="' + data[i].user.userAvatar + '" class="img-circle" alt="' + data[i].user.userName + '">';
                        rUserChat += '</div>';
                        rUserChat += '<h4>';
                        rUserChat += data[i].user.userName;
                        rUserChat += '<small><i class="fa fa-clock-o"></i> ' + convertTimeChat(data[i].chat.date) + '</small>';
                        rUserChat += '</h4>';
                        rUserChat += '<p>' + you + data[i].chat.data + '</p>';
                        rUserChat += '</a>';
                        rUserChat += '</li>';
                    }
                    $("#zoneUserChat").html(rUserChat);
                },
                error: function (x, t, m) {
                },
                data: {
                    'userId': me.userId
                },
                cache: false
            });
        }
        function convertTimeChat(date) {
            if (date === null || date === undefined || date === "") return "";
            x = Date.now() - date;
            x = x / 1000;
            if (x < 60) return "Now";
            x = x / 60;
            if (x < 60) return Math.floor(x) + " mins ago";
            x = x / 60;
            if (x < 60) return Math.floor(x) + " hours ago";
            x = x / 24;
            return Math.floor(x) + " days ago";
        }

        function getRoom(userChat, userName) {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: urlNode + "/roomid",
                success: function (data, s, x) {
                    var room = edu.util.uuid();
                    if (data.Data.length > 0) {
                        room = data.Data[0].roomId;
                    }

                    if ($("#zoneChat #" + room).length == 0) {
                        genHtmlChat(room, userName);
                        socket.emit("get-invite-room", { roomId: room, UserID: userChat });
                        socket.emit("join-room", { roomId: room, pairId: userChat });
                        getDataRoom(room, userChat);
                    }
                },
                error: function (x, t, m) {
                },
                data: {
                    'userId': me.userId,
                    'pairId': userChat
                },
                cache: false
            });
        }

        function getDataRoom(room, userId) {
            $.ajax({
                type: "GET",
                crossDomain: true,
                url: urlNode + "/RoomChat",
                success: function (data, s, x) {
                    if (data.Data.length > 0) {
                        for (var i = 0; i < data.Data.length; i++) {
                            var userCheck = me["arrUsersChat"].find(user => user.UserID === data.Data[i].userId);
                            genMessage({
                                roomId: room,
                                UserName: userCheck.UserName,
                                UserAvatar: userCheck.UserAvatar,
                                UserMa: userCheck.UserMa,
                                UserID: data.Data[i].userId,
                                date: data.Data[i].date,
                                dulieu: data.Data[i].data
                            });
                        }
                    }
                },
                error: function (x, t, m) {
                },
                data: {
                    'roomId': room,
                    'limit': 50000,
                    'skip': 0
                },
                cache: false
            });
        }

        function genHtmlChat(room, userName) {
            var rChat = "";

            rChat += '<div class="chat-box-item"  id="' + room + '">';
            rChat += '<div class="chat-box-header">';

            rChat += '<img src="assets/images-demo/user-avata.jpg" alt="">';

            rChat += '<div class="name">' + userName + '</div>';
            rChat += '<span class="bt-right"> <i class="fal fa-times"></i></span>';
            rChat += '</div>';
            rChat += '<div class="chat-box-content chat-scroll">';
                        
            rChat += '</div>';
            rChat += '<div class="box-footer">';
            rChat += '<div id="userDangNhan' + room + '"></div>';
            rChat += '<div>';
            rChat += '<div class="input-typing">';
            rChat += '<input type="text" placeholder="Nhập tin nhắn" id="txtMessage' + room + '" title="' + room + '" class="txtSendMessage">';
            //rChat += '<span class="input-typing-icon" title="Icon cảm xúc"><i class="fal fa-smile"></i></span>';
            rChat += '<span class="input-typing-icon" title="Đính kèm file, hình ảnh"><i';
            rChat += 'class="fal fa-image-polaroid"></i></span>';
            rChat += '<svg height="28px" width="28px" viewBox="0 0 35 40" title="Nhấn Enter để gửi" class="btnSendMessage" title="' + room + '">';
            rChat += '<g fill="none" fill-rule="evenodd">';
            rChat += '<g>';
            rChat += '<path d="M31.1059281,19.4468693 L10.3449666,29.8224462 C8.94594087,30.5217547 7.49043432,29.0215929 8.17420251,27.6529892 C8.17420251,27.6529892 10.7473302,22.456697 11.4550902,21.0955966 C12.1628503,19.7344961 12.9730756,19.4988922 20.4970248,18.5264632 C20.7754304,18.4904474 21.0033531,18.2803547 21.0033531,17.9997309 C21.0033531,17.7196073 20.7754304,17.5095146 20.4970248,17.4734988 C12.9730756,16.5010698 12.1628503,16.2654659 11.4550902,14.9043654 C10.7473302,13.5437652 8.17420251,8.34697281 8.17420251,8.34697281 C7.49043432,6.9788693 8.94594087,5.47820732 10.3449666,6.1775158 L31.1059281,16.553593 C32.298024,17.1488555 32.298024,18.8511065 31.1059281,19.4468693" fill="#0099ff"></path>';
            rChat += '</g>';
            rChat += '</g>';
            rChat += '</svg>';
            rChat += '</div>';
            rChat += '</div>';

            $("#zoneChat").append(rChat);
            me.chatRoom[room] = { user: null, time: 0, id: null };
        }

        function genMessage(data) {
            var rMess = "";
            if ($("#zoneChat #" + data.roomId).length == 0) {
                genHtmlChat(data.roomId, data.UserName);
                getDataRoom(data.roomId);
            }
            if (me.chatRoom[data.roomId].UserID === data.UserID && (data.date - me.chatRoom[data.roomId].time < 180000)) {
                rMess = '<div class="mes-content"><p>' + data.dulieu + '</p></div>';
                $("#zoneChat #" + data.roomId).append(rMess);
                $("#zoneChat #" + data.roomId + " #" + me.chatRoom[data.roomId].id).append(rMess);
                me.chatRoom[data.roomId].time = data.date;
            } else {
                var uuid = edu.util.uuid();
                var classPosition = data.UserID == me.userId ? "my-mes" : "our-mes";

                rMess += '<div class="mes-row ' + classPosition + '">';
                rMess += data.UserID != me.userId ? '<img class="avatar" src="' + data.UserAvatar + '" alt="' + edu.util.returnEmpty(data.UserMa) + '">' : '';
                rMess += '<div class="mes-cont-group" id="'+ uuid +'">';
                rMess += '<div class="mes-content">';
                rMess += '<p>' + data.dulieu +'</p>';
                rMess += '</div>';
                rMess += '</div>';
                rMess += data.UserID == me.userId ? '<img class="avatar" src="' + data.UserAvatar + '" alt="' + edu.util.returnEmpty(data.UserMa) + '">' : '';
                rMess += '<div class="name-date">';
                rMess += data.UserName + ' - ' + data.date;
                rMess += '</div>';
                rMess += '</div>';
                $("#zoneChat #" + data.roomId + " .chat-box-content").append(rMess);
                me.chatRoom[data.roomId] = { UserID: data.UserID, time: data.date, id: uuid };
            }
           
            var objDiv = $("#zoneChat #" + data.roomId + " .chat-box-content")[0];
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        function selectUser(userChat, userName, userAvatar) {
            var userCheck = me["arrUsersChat"].find(user => user.UserID === userChat);
            if (userCheck === undefined || userCheck.length == 0) {
                me["arrUsersChat"].push({
                    UserName: userName,
                    UserID: userChat,
                    UserMa: getUserMa(userName),
                    UserServer: '',
                    UserAvatar: userAvatar
                });
            }
            getRoom(userChat, userName);
        }

        function getUserMa(userName) {
            userName = userName.trim();
            var arrName = [userName];
            if (userName.indexOf(" ") != -1) {
                arrName = userName.split(" ");
            }
            var strMa = "";
            for (var i = 0; i < arrName.length; i++) {
                strMa += arrName[i][0].toUpperCase();
            }
            return strMa
        }
    },
    getUserKhacChat: function () {
        var me = this;
        var strApi_DonVi = edu.util.getValById("dropSearch_DonViChat");
        if (strApi_DonVi == undefined || strApi_DonVi == "" || strApi_DonVi == "TRONGTRUONG") strApi_DonVi = me.apiUrlTemp + me.objApi["CMS"];
        $.ajax({
            type: "GET",
            crossDomain: true,
            headers: { 'Authorization': me.tokenJWT },
            url: strApi_DonVi + "/CMS_NguoiDung/LayDanhSach",
            data: {
                'strTuKhoa': edu.util.getValById("txtUserKhac_TuKhoa"),
                'pageIndex': edu.system.pageIndex_default,
                'pageSize': edu.system.pageSize_default,
                'iTrangThai': 1,
                'strChung_DonVi_Id': "",
                'strVaiTro_Id': "",
                'strPhanLoaiDoiTuong': edu.util.getValById("dropSearch_PhanLoaiSuDung"),
                'strCapXuLy_Id': "",
                'strTinhThanh_Id': ""
            },
            success: function (data, s, x) {
                var jsonForm = {
                    strTable_Id: "tblUserKhac",
                    aaData: data.Data,
                    bPaginate: {
                        strFuntionName: "edu.system.getUserKhacChat()",
                        iDataRow: data.Pager
                    },
                    colPos: {
                        center: [0, 1, 5],
                        //right: [5]
                    },
                    arrClassName: ["userChat"],
                    aoColumns: [
                        {
                            "mRender": function (nRow, aData) {
                                var strAnh = edu.system.getRootPathImg(aData.HINHDAIDIEN);
                                var html = '<img src="' + strAnh + '" class= "table-img" />';
                                return html;
                            }
                        },
                        {
                            "mDataProp": "TENDAYDU"
                        },
                        {
                            "mDataProp": "TAIKHOAN"
                        },
                        {
                            "mDataProp": "EMAIL"
                        }
                        , {
                            "mRender": function (nRow, aData) {
                                return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                            }
                        }
                    ]
                };
                edu.system.loadToTable_data(jsonForm);
            },
            error: function (x, t, m) {
            },
            cache: false
        });
    },
    showAllId: function () {
        var arrId = [];
        //var x = $(".form-control");
        $(".form-control").each((index, point) => { if (point.id) arrId.push("#" + point.id); });
        $(".select-opt").each((index, point) => { if (point.id) arrId.push("#" + point.id); });
        edu.system.alert(arrId.toString());
    },

    save_KiemTraTaiKhoan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_KS_KeHoach_MH/CigkLBUzIAkuIC8VKSAvKQPP',
            'func': 'khaosat_kehoach.KiemTraHoanThanh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDoiTuongId': edu.system.userId,
            'strMaChucNang': "LOGIN",
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data === 0 || data.Data === "0") {
                        me.ChuyenChucNang();
                    }
                }
                
            },
            error: function (er) {
            },
            type: 'POST',
            
            contentType: true,
            complete: function () {
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_KiemTraThongBao: function () {
        var me = this;
        $("body").append('<div class="noti-fix-screen" id="zoneThongBao"></div>');
        $(document).delegate(".action-close", "click", function () {
            var strThongBao_Id = this.id;
            DongThongBao(strThongBao_Id);
        });
        //--Edit
        var obj_save = {
            'action': 'SV_TinBao_MH/CigkLBUzIBUoLwMgLgPP',
            'func': 'pkg_tinbao_nguoihoc.KiemTraTinBao',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    let htmlTB = '';
                    data.Data.forEach(aData => {
                        htmlTB += '<div class="noti-fix-item">';
                        htmlTB += '<div class="noti-fix-icon">';
                        htmlTB += '<img src="assets/images/notification-bell.png">';
                        htmlTB += '</div>';
                        htmlTB += '<div class="noti-fix-content">';
                        htmlTB += '<div class="noti-fix-action action-close" id="' + aData.ID + '">';
                        htmlTB += '<i class="fal fa-times" title="Đóng thông báo"></i>';
                        htmlTB += '</div>';
                        htmlTB += '<img src="assets/images/notification-bell.png">';
                        htmlTB += '<div class="">';
                        htmlTB += '<p class="fw-bolder fs-20 text-uppercase mb-0">' + edu.util.returnEmpty(aData.TIEUDETHONGTIN) + '</p>';
                        htmlTB += '<p class="mb-0">';
                        htmlTB += edu.util.returnEmpty(aData.NOIDUNGTHONGTIN);
                        htmlTB += '</p>';
                        htmlTB += '</div>';

                        htmlTB += '</div>';
                        htmlTB += '</div>';
                    })
                    $("#zoneThongBao").html(htmlTB);
                    //if (data.Data === 0 || data.Data === "0") {
                    //    me.ChuyenChucNang();
                    //}
                }

            },
            error: function (er) {
                console.log(JSON.stringify(er))
            },
            type: 'POST',

            contentType: true,
            complete: function () {
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function DongThongBao(strThongBao_Id) {
            var obj_save = {
                'action': 'SV_TinBao_MH/FSAvJhIuDSAvBSAZJCwP',
                'func': 'pkg_tinbao_nguoihoc.TangSoLanDaXem',
                'iM': edu.system.iM,
                'strIdTinBao': strThongBao_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        //let htmlTB = '';
                        //data.Data.forEach(aData => {
                        //    htmlTB += '<div class="noti-fix-item">';
                        //    htmlTB += '<div class="noti-fix-icon">';
                        //    htmlTB += '<img src="assets/images/notification-bell.png">';
                        //    htmlTB += '</div>';
                        //    htmlTB += '<div class="noti-fix-content">';
                        //    htmlTB += '<div class="noti-fix-action action-close" id="' + aData.ID + '">';
                        //    htmlTB += '<i class="fal fa-times" title="Đóng thông báo"></i>';
                        //    htmlTB += '</div>';
                        //    htmlTB += '<img src="assets/images/notification-bell.png">';
                        //    htmlTB += '<div class="">';
                        //    htmlTB += '<p class="fw-bolder fs-20 text-uppercase mb-0">' + edu.util.returnEmpty(aData.TIEUDETHONGTIN) + '</p>';
                        //    htmlTB += '<p class="mb-0">';
                        //    htmlTB += edu.util.returnEmpty(aData.NOIDUNGTHONGTIN);
                        //    htmlTB += '</p>';
                        //    htmlTB += '</div>';

                        //    htmlTB += '</div>';
                        //    htmlTB += '</div>';
                        //})
                        //$("#zoneThongBao").html(htmlTB);
                        //if (data.Data === 0 || data.Data === "0") {
                        //    me.ChuyenChucNang();
                        //}
                    }

                },
                error: function (er) {
                },
                type: 'POST',

                contentType: true,
                complete: function () {
                },
                action: obj_save.action,
                data: obj_save,
                fakedb: [
                ]
            }, false, false, false, null);
        }
    },
    ChuyenChucNang: function () {
        var me = this;
        //--Edit
        var urlKhaoSat = me.objApi["urlKhaoSat"];
        if (urlKhaoSat.indexOf("http") === -1) {
            urlKhaoSat = me.strhost + urlKhaoSat;
        }
        alert("Bạn cần hoàn thành các phiếu khảo sát sau.");
        location.href = urlKhaoSat + "?lang=&strNguoiThucHien_Id=" + me.userId;
        
    },

    getList_CauHinhTuKhoa: function (strLoaiCauHinh, callback) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_Chung_MH/DSA4BRICIDQJKC8p',
            'func': 'pkg_chung.LayDSCauHinh',
            'iM': edu.system.iM,
            'strLoaiCauHinh': strLoaiCauHinh,
            'strDinhDanh': edu.util.getValById('txtAAAA'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtCauHinhTuKhoa"] = dtReRult;
                    callback(dtReRult)
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
    getBrowser: function () {

        var ua = navigator.userAgent, browser;

        // helper functions to deal with common regex
        function getFirstMatch(regex) {
            var match = ua.match(regex);
            return (match && match.length > 1 && match[1]) || '';
        }

        function getSecondMatch(regex) {
            var match = ua.match(regex);
            return (match && match.length > 1 && match[2]) || '';
        }

        // start detecting
        if (/opera|opr/i.test(ua)) {
            browser = {
                name: 'Opera',
                type: 'opera',
                version: getFirstMatch(/version\/(\d+(\.\d+)?)/i) || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
            }
        } else if (/msie|trident/i.test(ua)) {
            browser = {
                name: 'Internet Explorer',
                type: 'msie',
                version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
            }
        } else if (/chrome.+? edge/i.test(ua)) {
            browser = {
                name: 'Microsft Edge',
                type: 'msedge',
                version: getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
            }
        } else if (/chrome|crios|crmo/i.test(ua)) {
            browser = {
                name: 'Google Chrome',
                type: 'chrome',
                version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
            }
        } else if (/firefox/i.test(ua)) {
            browser = {
                name: 'Firefox',
                type: 'firefox',
                version: getFirstMatch(/(?:firefox)[ \/](\d+(\.\d+)?)/i)
            }
        } else if (!(/like android/i.test(ua)) && /android/i.test(ua)) {
            browser = {
                name: 'Android',
                type: 'android',
                version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
            }
        } else if (/safari/i.test(ua)) {
            browser = {
                name: 'Safari',
                type: 'safari',
                version: getFirstMatch(/version\/(\d+(\.\d+)?)/i)
            }
        } else {
            browser = {
                name: getFirstMatch(/^(.*)\/(.*) /),
                version: getSecondMatch(/^(.*)\/(.*) /)
            }
            browser.type = browser.name.toLowerCase().replace(/\s/g, '');
        }
        return browser;
    },
    btoa: function (r, e) { if (r = atob(r), !e) { var o = new Date(Date.now()); e = "" + o.getFullYear() + (o.getMonth() + 1) }; for (var t = Array.from(e), a = [], n = 0; n < r.length; n++) { var h = r.charCodeAt(n) ^ t[n % t.length].charCodeAt(0); a.push(String.fromCharCode(h)) } return a.join("") },
    atob: function (r, e) { if (!e) { var t = new Date(Date.now()); e = "" + t.getFullYear() + (t.getMonth() + 1) } for (var a = Array.from(e), n = [], o = 0; o < r.length; o++) { var h = r.charCodeAt(o) ^ a[o % a.length].charCodeAt(0); n.push(String.fromCharCode(h)) } return btoa(n.join("")) },

    versionPageJS: function () {
        var me = this;
        if (!me.isActive || !me.urlPage) return;
        jQuery.ajax({
            url: me.rootPath + "/" + me.appCode + me.urlPage + "?v=" + me.randomInt(4),

            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: "GET",
            dataType: "html",
            //data: params
        }).done(function (responseText) {
            if (responseText.length != me.urlPageLength) {
                me.loadPage($(me.ctPlacehoder), me.urlPage, null, null, me.appCode);
            }
        })
    },
    versionMainJS: function () {
        var me = this;
        if (!me.isActive) return;
        jQuery.ajax({
            url: "Config.js?v=" + me.randomInt(4),
            type: "GET",
            dataType: "html",
        }).done(function (responseText) {
            if (me["versionJS"] && responseText.length != me.versionJS) {
                location.reload();
            } else {
                me["versionJS"] = responseText.length;
            }
        })
    },
    randomInt: function (len, charSet) {
        charSet = charSet || '0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    
    getList_DataImport: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SYS_Import/getDataFormFileImport',
            'versionAPI': 'v1.0',

            'strPath': edu.util.getValById("importToCheck")
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var arrSheet = [data.Id];
                    if (edu.util.checkValue(data.Id)) {
                        if (data.Id.includes("$")) {
                            arrSheet = data.Id.split("$");
                        }
                    }
                    else { return; }
                    me.dtImport = data.Data;
                    var html = "";
                    for (var i = 0; i < arrSheet.length; i++) {
                        html += "<option value='Table" + (i + 1) + "'>" + arrSheet[i] + "</option>";
                    }
                    $("#dropSearch_BangA").html(html);
                    me.genTable_Import_View(me.dtImport["Table1"], "tblBangA")
                    //me.dtPhaiNop = data.Data["Table1"];
                    //me.genTable_Import(data.Data["Table1"], "tblImport");//Table1 tương ứng với vị trí đầu mảng
                    //edu.system.switchTab("tab_2");
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                edu.system.endLoading();
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
    genTable_Import_View: function (data, strTable) {
        var me = this;
        var row = "";
        row += '<thead>';
        row += '<tr>';
        for (var x in data[0]) {
            row += '<th>' + edu.util.returnEmpty(x) + '</td>';
        }
        row += '</thead>';
        row += '<tbody>';
        row += '</tr>';
        for (var i = 0; i < data.length; i++) {
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
            }
            row += '</tr>';
        }
        row += '</tbody>';
        $("#" + strTable).html(row);
        me.showCot(strTable, "dropSearch_CotA")
    },
    showBaoCao: function () {
        var me = this;

        var option = "";
        $("#main-content-wrapper table:visible").each(function () {
            if (this.id != "") {
                option += '<option value="' + this.id + '">' + this.id + '</option>';
            }
        });
        var row = '';
        row += '<div class="row"><div class="col-sm-2" >- Thực hiện import: </div><div class="col-sm-2"><div id="importToCheck"></div></div></div>';

        row += '<div class="clear">Bảng import</div>';
        row += '<div class="area-search">';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_BangA" class="select-opt"></select></div>';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_CotA" class="select-opt"></select></div>';
        row += '<div class="col-sm-3 item-search"><input id="txtCotA" class="form-control" placeholder="Thứ tự Cột" /></div>';
        row += '</div>';
        row += '<div class="clear">Bảng cần check theo mã</div>';
        row += '<div class="area-search">';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_BangB" class="select-opt">' + option + '</select></div>';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_CotB" class="select-opt"></select></div>';
        row += '<div class="col-sm-3 item-search"><input id="txtCotB" class="form-control" placeholder="Thứ tự Cột" /></div>';
        row += '</div>';
        row += '<div class="clear"></div>';
        row += '<div class="zone-content">';
        row += '<div class="box-header with-border">';
        row += '<h3 class="box-title"><i class="fa fa-list-alt"></i> Danh sách</h3>';
        row += '<div class="pull-right"><a class="btn btn-primary" id="btnThucHienCheck" href="#"><i class="fa fa-plus"></i> Thực hiện so sánh và check</a></div>';
        row += '</div>';
        row += '<div class="clear"></div>';
        row += '<div class="row row-align">';
        row += '<table id="tblBangA" class="table table-hover table-bordered">';
        row += '<tbody></tbody>';
        row += '</table>';
        row += '</div>';
        row += '</div>';
        $("#modalBaoCao #modal_body").html(row);
        $("#modalBaoCao").modal("show");
        edu.system.uploadImport(["importToCheck"], me.getList_DataImport);
        $('#dropSearch_BangA').on('change', function () {
            me.genTable_Import_View(me.dtImport[$("#dropSearch_BangA").val()], "tblBangA")
        });
        me.showCot($("#dropSearch_BangB").val(), "dropSearch_CotB");
        $('#dropSearch_BangB').on('change', function () {
            me.showCot($("#dropSearch_BangB").val(), "dropSearch_CotB");
        });
        $("#btnThucHienCheck").click(function () {
            let iCotA = $("#dropSearch_CotA").val()
            let iCotB = $("#dropSearch_CotB").val()
            console.log(iCotB)
            let strBangB = $("#dropSearch_BangB").val()
            $("#tblBangA tbody tr td:eq(" + iCotA + ")").each(function () {
                let tempGT = this.innerText;
                console.log(tempGT)
                $("#" + strBangB + " tbody tr").each(function () {
                    console.log($(this).find("td"))
                    let tempGH = $(this).find("td:eq(" + iCotB + ")").text();
                    console.log(tempGH)
                    if (tempGH && tempGH.indexOf(tempGT) != -1) {
                        console.log("OK" + tempGH)
                        let pGH = $(this).find("input[type=checkbox]");
                        $(pGH).attr('checked', true);
                        $(pGH).prop('checked', true);
                        return;
                    }
                })
            })

        });
    },
    showCot: function (strTable_Id, strDrop_Id) {
        var temp = "";
        let iThu = 0;
        $("#" + strTable_Id + " thead tr:eq(0) th").each(function () {
            temp += '<option value="' + iThu + '">' + this.innerText + '</option>';
            iThu++;
        });
        $("#" + strDrop_Id).html(temp);
    },
    getValById: function (id) {
        var me = this;
        var result = "";
        var idName = "#" + id;
        result = $(idName).val();
        if (!result) result = undefined;
        if (id.indexOf("drop") == 0 && $(idName).attr("multiple")) {
            result = result.toString().replace("SELECTALL,", "");
            if (result.indexOf(",") == 0) {
                result = result.substr(1);
            }
        }
        return result;
    },
    
}