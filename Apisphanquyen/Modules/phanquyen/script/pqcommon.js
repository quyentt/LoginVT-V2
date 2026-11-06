/*----------------------------------------------
--Tiện ích dùng chung cho các màn của module Phân quyền dữ liệu.
--Nạp TRƯỚC script của từng màn:
--    <script src="modules/phanquyen/script/pqcommon.js?v=..."></script>
--Hàm backend: PKG_CORE_QUANTRI_04.* (endpoint CMS_QuanTri04_MH/<mã>, mã = base64(XOR(tên method,'A')))
----------------------------------------------*/
var PQ = {
    // Hàm dùng chéo giữa các màn (danh mục cho ô chọn)
    API: {
        LOAIDOITUONG_LAYDS: { action: 'CMS_QuanTri04_MH/JSweLS4gKCUuKDU0Li8mHg0gOAUS', func: 'PKG_CORE_QUANTRI_04.dm_loaidoituong_LayDS' },
        QUANHE_LAYDS: { action: 'CMS_QuanTri04_MH/JSweMDQgLykkHjEpIC8iIDEeDSA4BRIP', func: 'PKG_CORE_QUANTRI_04.dm_quanhe_phancap_LayDS' },
        // Danh mục chức năng / ứng dụng của hệ thống (hàm chuẩn của module quản lý chức năng ở ApisCMS)
        CHUCNANG_LAYDS: { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikCKTQiDyAvJgPP', func: 'pkg_chung_quanlynguoidung.LayDanhSachChucNang' },
        UNGDUNG_LAYDS: { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikULyYFNC8m', func: 'pkg_chung_quanlynguoidung.LayDanhSachUngDung' },
        VAITRO_LAYDS: { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikXICgVMy4P', func: 'pkg_chung_quanlynguoidung.LayDanhSachVaiTro' },
        NGUOIDUNG_LAYDS: { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung' }
    },

    // Gọi 1 hàm BE đã mã hoá (func + iM): makeRequest tự mã hoá request, giải mã data.Data, bật/tắt overlay
    call: function (api, params, fnOk, fnErr) {
        var op = PQ.reqParams(api, params);
        op.success = function (data) { fnOk(data); };
        op.error = function (er) { if (fnErr) fnErr(er); };
        edu.system.makeRequest(op, false, false, false, null);
    },

    // Tham số của edu.system.makeRequest cho 1 hàm BE đã mã hoá. Dùng chung cho PQ.call và form tiến trình chuẩn
    // (edu.process: request() trả đúng cấu trúc này) để mọi chỗ gửi giống hệt nhau, kể cả bản vá strChucNang_Id bên dưới.
    reqParams: function (api, params) {
        var obj = $.extend({ 'action': api.action, 'func': api.func, 'iM': edu.system.iM }, params);
        // makeRequest (Corei/systemroot.js:563) tự thêm vào CUỐI payload strChucNang_Id = chức năng ĐANG LÀM VIỆC (màn hình hiện tại)
        // nếu payload chưa có. BE (Json.NET) khớp tên KHÔNG phân biệt hoa/thường, khóa sau đè khóa trước →
        // strChucNang_Id đè lên strchucnang_id (chức năng người dùng CHỌN trong danh sách) → BE lưu/tra/xóa nhầm theo chức năng
        // đang làm việc (ca 06/11/2026: chọn QLDN.NQHHT nhưng lưu ra PQ.UQCN). Gán trước cùng giá trị để makeRequest không ghi đè.
        if (obj.strchucnang_id !== undefined && obj.strchucnang_id !== null && String(obj.strchucnang_id) !== '' && !obj.strChucNang_Id) {
            obj.strChucNang_Id = obj.strchucnang_id;
        }
        return { type: "POST", action: obj.action, contentType: true, data: obj, fakedb: [] };
    },

    // Các bảng danh sách đang vẽ: id bảng → jsonForm (aaData + aoColumns). Mọi màn vẽ bảng bằng PQ.veBang (thay cho gọi thẳng
    // edu.system.loadToTable_data) để nút "Xuất Excel" dùng ĐÚNG cột và dữ liệu đang hiển thị, không khai báo cột 2 lần.
    bang: {},
    veBang: function (jsonForm) {
        PQ.bang[jsonForm.strTable_Id] = jsonForm;
        edu.system.loadToTable_data(jsonForm);
    },

    // Gắn nút "Xuất Excel" CHUẨN của hệ thống (edu.exporter.attachTable, Corei/exportexcel.js) cho 1 bảng danh sách: hỏi trước khi xuất,
    // file có tiêu đề + dòng điều kiện + dòng tổng + ngày xuất. Cột xuất = cột của bảng (tiêu đề lấy từ <th>), bỏ cột thao tác (Sửa/Xóa/Xem).
    //   cfg: table (id bảng), title, fileName,
    //        rows()      (tùy chọn) toàn bộ dòng cần xuất — mặc định đúng các dòng bảng đang vẽ; màn nào CẮT số dòng vẽ (closure, hiệu lực,
    //                    nhật ký) phải khai để xuất ĐỦ, không chỉ phần đang hiện
    //        subTitles() (tùy chọn) các dòng điều kiện, VD ["Từ khóa: ..."]; filters [[{label,id}]] = các ô chọn trên màn hình
    //        colOptions  (tùy chọn) ghi đè cột theo chỉ số trong aoColumns (0 = cột đầu sau STT), VD { 2: { render: function (row) {...} } }
    // Máy khách chưa có exportexcel.js thì không gắn nút (trang vẫn chạy bình thường).
    attachExport: function (cfg) {
        if (!(window.edu && edu.exporter && typeof edu.exporter.attachTable === 'function' && typeof edu.exporter.columnsFromTable === 'function')) return;
        var omit = cfg.omit || ['Sửa', 'Xóa', 'Xem'];
        var o = {
            table: cfg.table, before: '.scroll-table-x:has(#' + cfg.table + ')', block: true,
            fileName: cfg.fileName, title: cfg.title, subTitles: cfg.subTitles, filters: cfg.filters,
            // Dữ liệu đã nạp sẵn trong trình duyệt (kết quả LayDS gần nhất) nên không gọi lại máy chủ
            fetchAll: function () {
                var f = PQ.bang[cfg.table];
                return Promise.resolve((typeof cfg.rows === 'function' ? cfg.rows() : (f && f.aaData)) || []);
            }
        };
        // Cột lấy lúc bấm nút (bảng có thể vừa được vẽ lại)
        Object.defineProperty(o, 'columns', {
            enumerable: true,
            get: function () {
                var f = PQ.bang[cfg.table];
                if (!f) return [];
                return $.grep(edu.exporter.columnsFromTable(cfg.table, f.aoColumns, cfg.colOptions), function (d) { return $.inArray(d.header, omit) < 0; });
            }
        });
        edu.exporter.attachTable(o);
    },

    // Chạy 1 lệnh BE cho cả hệ thống (job tạo/đồng bộ dữ liệu) bằng FORM TIẾN TRÌNH CHUẨN của hệ thống (edu.process.runJob,
    // Corei/processrun.js): Bước 1 xác nhận, RUN, kết quả + thời gian + ghi chú, xuất Excel kết quả (qua edu.exporter) — không tự viết lẻ.
    //   cfg: title, what (dòng nội dung xử lý), api (PQ.API-kiểu {action, func}), params (đối tượng hoặc hàm), okMessage,
    //        notes (mảng lưu ý ở Bước 1), fileName, subTitles, refresh (hàm: chạy khi đóng form nếu thành công), onSuccess
    // Máy khách chưa có edu.process (chưa copy Corei/processrun.js + indexi.aspx mới) → dự phòng: hộp xác nhận + 1 lời gọi như bản cũ.
    chayJob: function (cfg) {
        var params = function () { return typeof cfg.params === 'function' ? cfg.params() : (cfg.params || {}); };
        if (window.edu && edu.process && typeof edu.process.runJob === 'function') {
            edu.process.runJob({
                title: cfg.title, what: cfg.what || cfg.title, unit: cfg.unit,
                request: function () { return PQ.reqParams(cfg.api, params()); },
                okMessage: cfg.okMessage, notes: cfg.notes, fileName: cfg.fileName, subTitles: cfg.subTitles,
                refresh: cfg.refresh, onSuccess: cfg.onSuccess
            });
            return;
        }
        edu.system.confirm("<b>" + PQ.esc(cfg.title) + "</b>?" + $.map(cfg.notes || [], function (n) { return "<br/>" + PQ.esc(n); }).join(''), "q");
        $("#btnYes").off("click.pqjob").on("click.pqjob", function () {
            // Hộp xác nhận của hệ thống xóa sạch nội dung khi bấm Có → không để màn trống/đứng đờ trong lúc job chạy
            $("#alert_content").html('<p class="text-center"><i class="fa fa-spinner fa-spin"></i> Đang thực hiện, vui lòng chờ...</p>');
            PQ.call(cfg.api, params(), function (data) {
                if (data.Success) {
                    edu.system.afterComfirm({ title: "", content: cfg.okMessage || "Đã thực hiện", code: "" });
                    if (typeof cfg.onSuccess === 'function') cfg.onSuccess();
                    if (typeof cfg.refresh === 'function') cfg.refresh();
                } else {
                    edu.system.afterComfirm({ title: "", content: data.Message || "Không thành công.", code: "w" });
                }
            }, function (er) {
                edu.system.afterComfirm({ title: "", content: PQ.msgLoi(er), code: "w" });
            });
        });
    },

    // Thông báo lỗi từ response lỗi HTTP (BE trả Message trong body kể cả khi 500)
    msgLoi: function (er) {
        var m = er && er.responseJSON && er.responseJSON.Message;
        if (m) return m;
        return (er && er.statusText) ? er.statusText : "Không kết nối được máy chủ";
    },

    // Đọc 1 cột của dòng dữ liệu (chịu được tên cột viết hoa/thường); null → ''
    g: function (row, key) {
        if (!row) return '';
        var v = row[key];
        if (v === undefined) v = row[key.toLowerCase()];
        return (v === null || v === undefined) ? '' : v;
    },

    // Chống chèn HTML khi ghép chuỗi vào innerHTML
    esc: function (s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    // Cờ 0/1 của Oracle (có thể về dạng số, chuỗi hoặc boolean)
    isTrue: function (v) {
        return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
    },

    // Chọn giá trị cho ô chọn; nếu giá trị chưa có trong danh sách (vd danh mục đã bị xóa) thì thêm tạm
    // để không làm mất giá trị khi người dùng bấm Lưu.
    setDrop: function (id, val) {
        if (val !== '' && $("#" + id + " option").filter(function () { return this.value === String(val); }).length === 0) {
            $("#" + id).append($('<option>').val(val).text(val));
        }
        edu.util.viewValById(id, val);
    },

    // Báo thành công SAU KHI modal đã đóng hẳn — không chồng 2 modal (BS3 sẽ kẹt khóa cuộn trang)
    alertSauKhiDongModal: function (strModalId, strNoiDung) {
        $("#" + strModalId).one("hidden.bs.modal", function () {
            edu.system.alert(strNoiDung);
        });
        $("#" + strModalId).modal("hide");
    },

    // Kết quả ghi (Them/Sua/Xoa) của BE có ghi thành công hay không.
    // Đo thật 06/11/2026: dm_loaidoituong_Them trả {Success:false, Message:"lop", Data:null, Id:null} và dm_quanhe_phancap_Them
    // trả Message="qh_sv" nhưng bản ghi ĐÃ vào DB (BE đưa khóa vừa ghi vào Message nên cờ Success sai).
    // Coi là THÀNH CÔNG khi:
    //   (1) Success=true; hoặc
    //   (2) Message (cắt khoảng trắng, không phân biệt hoa/thường) trùng đúng 1 giá trị chuỗi đã gửi lên (arrKhoa: mảng khóa,
    //       hoặc cả đối tượng params — chỉ xét giá trị chuỗi dài >= 2, bỏ cờ số 0/1); hoặc
    //   (3) Message chỉ là 1 ID 32 ký tự hex (định dạng ID do BE tự sinh của hệ thống) — SUY ĐOÁN cho hàm BE tự sinh ID (K2/K3/điều kiện),
    //       chưa có log thật; câu lỗi thật không bao giờ là 1 chuỗi hex trần.
    // Câu lỗi thật (kể cả khi có chứa khóa) và Message rỗng vẫn là lỗi. Có console.warn mỗi lần rơi vào (2)/(3) để dễ lần ra.
    // CẦN BÁO BE: trả Success=true và đưa khóa/ID vào trường Id; khi BE sửa xong thì hàm này vẫn đúng, không cần gỡ.
    ghiOk: function (data, arrKhoa) {
        if (!data) return false;
        if (data.Success) return true;
        var m = $.trim(String(data.Message === null || data.Message === undefined ? '' : data.Message)).toLowerCase();
        if (!m) return false;
        var dsKhoa = $.isArray(arrKhoa) ? arrKhoa : $.map(arrKhoa || {}, function (v) { return v; });
        for (var i = 0; i < dsKhoa.length; i++) {
            if (typeof dsKhoa[i] === 'number') continue;
            var k = $.trim(String(dsKhoa[i] === null || dsKhoa[i] === undefined ? '' : dsKhoa[i])).toLowerCase();
            if (k.length >= 2 && m === k) {
                if (window.console) console.warn('[pq] BE trả Success=false nhưng Message = giá trị vừa gửi ("' + data.Message + '") → coi là đã ghi thành công.', data);
                return true;
            }
        }
        if (/^[0-9a-f]{32}$/.test(m)) {
            if (window.console) console.warn('[pq] BE trả Success=false nhưng Message là 1 ID 32 hex ("' + data.Message + '") → coi là đã ghi thành công.', data);
            return true;
        }
        return false;
    },

    // Danh mục loại đối tượng (dm_loaidoituong_LayDS) → [{MA, TEN}]; lỗi thì trả [] (màn vẫn chạy, chỉ hiện mã)
    loadLoaiDoiTuong: function (fnDone) {
        PQ.call(PQ.API.LOAIDOITUONG_LAYDS, { 'strtukhoa': '' }, function (data) {
            var dt = (data.Success && data.Data) ? data.Data : [];
            if (dt.length > 0 && PQ.g(dt[0], 'MA') === '' && window.console) {
                console.warn('[pq] dm_loaidoituong_LayDS không có cột MA — các cột nhận được:', Object.keys(dt[0]));
            }
            fnDone($.map(dt, function (r) { return { MA: PQ.g(r, 'MA'), TEN: PQ.g(r, 'TEN') }; }));
        }, function () {
            if (window.console) console.warn('[pq] Không nạp được danh mục loại đối tượng.');
            fnDone([]);
        });
    },

    // Chạy song song nhiều bước nạp danh mục; mỗi bước là function(fnXong) gọi fnXong(kết quả).
    // Khi tất cả xong gọi fnDone([kết quả bước 1, kết quả bước 2, ...]) đúng thứ tự khai báo.
    whenAll: function (arrFn, fnDone) {
        var n = arrFn.length, kq = new Array(n), dem = 0;
        $.each(arrFn, function (i, fn) {
            fn(function (res) {
                kq[i] = res;
                dem++;
                if (dem === n) fnDone(kq);
            });
        });
    },

    // Mảng → bảng tra { khóa: giá trị }
    mapOf: function (dt, strKey, strVal) {
        var m = {};
        $.each(dt, function (i, r) { m[r[strKey]] = r[strVal]; });
        return m;
    },
    has: function (obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    // Danh mục quan hệ phân cấp (dm_quanhe_phancap_LayDS) → [{ID, LOAI_CON_MA, LOAI_CHA_MA}]; lỗi thì []
    loadQuanHe: function (fnDone) {
        PQ.call(PQ.API.QUANHE_LAYDS, { 'strtukhoa': '' }, function (data) {
            var dt = (data.Success && data.Data) ? data.Data : [];
            if (dt.length > 0 && PQ.g(dt[0], 'ID') === '' && window.console) {
                console.warn('[pq] dm_quanhe_phancap_LayDS không có cột ID — các cột nhận được:', Object.keys(dt[0]));
            }
            fnDone($.map(dt, function (r) {
                return { ID: PQ.g(r, 'ID'), LOAI_CON_MA: PQ.g(r, 'LOAI_CON_MA'), LOAI_CHA_MA: PQ.g(r, 'LOAI_CHA_MA') };
            }));
        }, function () {
            if (window.console) console.warn('[pq] Không nạp được danh mục quan hệ phân cấp.');
            fnDone([]);
        });
    },
    // Nhãn thuần chữ của 1 quan hệ: "qh_sv_lop — Sinh viên → Lớp" (mapLoai: mã loại → tên)
    nhanQuanHe: function (qh, mapLoai) {
        var ten = function (ma) { return (mapLoai && PQ.has(mapLoai, ma) && mapLoai[ma]) ? mapLoai[ma] : ma; };
        if (!qh) return '';
        if (!qh.LOAI_CON_MA && !qh.LOAI_CHA_MA) return qh.ID;
        return qh.ID + ' — ' + ten(qh.LOAI_CON_MA) + ' → ' + ten(qh.LOAI_CHA_MA);
    },

    // Tìm người dùng (tài khoản) theo từ khóa — KHÔNG nạp cả danh sách vì có thể hàng nghìn tài khoản.
    // Hàm chuẩn của module người dùng ở ApisCMS (tìm phía máy chủ theo tên / tài khoản / email).
    // fnDone(items, strLoi): items = [{ID, TEN, TAIKHOAN, EMAIL, LABEL}] (tối đa iToiDa); lỗi thì items = [] và strLoi có chữ.
    timNguoiDung: function (strTuKhoa, iToiDa, fnDone) {
        PQ.call(PQ.API.NGUOIDUNG_LAYDS, {
            'strTuKhoa': strTuKhoa, 'pageIndex': 1, 'pageSize': iToiDa, 'dTrangThai': 1,
            'strChung_DonVi_Id': '', 'strVaiTro_Id': '', 'strPhanLoaiDoiTuong': '', 'strCapXuLy_Id': '', 'strTinhThanh_Id': ''
        }, function (data) {
            if (!data.Success) { fnDone([], data.Message || 'Không tìm được người dùng.'); return; }
            var dt = data.Data || [];
            if (dt.length > 0 && PQ.g(dt[0], 'ID') === '' && window.console) {
                console.warn('[pq] LayDanhSachNguoiDung không có cột ID — các cột nhận được:', Object.keys(dt[0]));
            }
            fnDone($.map(dt, function (r) {
                var ten = PQ.g(r, 'TENDAYDU'), tk = PQ.g(r, 'TAIKHOAN'), id = PQ.g(r, 'ID');
                return { ID: id, TEN: ten, TAIKHOAN: tk, EMAIL: PQ.g(r, 'EMAIL'), LABEL: PQ.nhanNguoiDung(ten, tk, id) };
            }), '');
        }, function (er) {
            fnDone([], PQ.msgLoi(er));
        });
    },
    // Nhãn người dùng: "Tên (tài khoản)"; thiếu cái nào dùng cái còn lại; không có gì thì dùng ID
    nhanNguoiDung: function (strTen, strTaiKhoan, strId) {
        if (strTen) return strTen + (strTaiKhoan ? ' (' + strTaiKhoan + ')' : '');
        return strTaiKhoan || strId || '';
    },
    // Lấy tên/tài khoản người dùng NẾU response của hàm phân quyền có kèm (tên cột chưa chốt nên thử vài tên thường gặp).
    // Trả {ID, TEN, TK, CO}; CO=false nghĩa là response chỉ có ID — màn hình phải hiện ID và báo cần bổ sung cột.
    nguoiDungCuaDong: function (row, strIdKey) {
        var first = function (arrKey) {
            for (var i = 0; i < arrKey.length; i++) {
                var v = PQ.g(row, arrKey[i]);
                if (v !== '') return v;
            }
            return '';
        };
        var ten = first(['TENDAYDU', 'NGUOIDUNG_TEN', 'TENNGUOIDUNG', 'HOTEN']);
        var tk = first(['TAIKHOAN', 'NGUOIDUNG_TAIKHOAN', 'MASO', 'NGUOIDUNG_MA']);
        return { ID: PQ.g(row, strIdKey), TEN: ten, TK: tk, CO: (ten !== '' || tk !== '') };
    },

    // Ngày: backend có thể trả 'dd/MM/yyyy[ hh:mm:ss]', ISO 'yyyy-MM-dd[Thh:mm:ss]' hoặc '/Date(ms)/'. → Date (0h giờ máy) hoặc null.
    // Ô nhập của hệ thống dùng 'dd/mm/yyyy' (class input-datepicker + edu.util.dateValid).
    parseNgay: function (v) {
        if (v === null || v === undefined || v === '') return null;
        var s = String(v), m;
        var mk = function (y, mo, d) {
            var dt = new Date(+y, +mo - 1, +d);
            return (dt.getFullYear() === +y && dt.getMonth() === +mo - 1 && dt.getDate() === +d) ? dt : null;
        };
        if ((m = /^\/Date\((-?\d+)/.exec(s))) {
            var d0 = new Date(parseInt(m[1], 10));
            return new Date(d0.getFullYear(), d0.getMonth(), d0.getDate());
        }
        if ((m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s))) return mk(m[1], m[2], m[3]);
        if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s))) return mk(m[3], m[2], m[1]);
        return null;
    },
    // Ngày hiển thị 'dd/mm/yyyy'; không đọc được thì trả nguyên chuỗi gốc (không làm mất dữ liệu), rỗng thì ''
    dmy: function (v) {
        var dt = PQ.parseNgay(v);
        if (!dt) return (v === null || v === undefined) ? '' : String(v);
        var p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(dt.getDate()) + '/' + p(dt.getMonth() + 1) + '/' + dt.getFullYear();
    },
    homNay: function () {
        var n = new Date();
        return new Date(n.getFullYear(), n.getMonth(), n.getDate());
    },
    // Date → 'dd/mm/yyyy'
    dmyDate: function (dt) {
        var p = function (n) { return (n < 10 ? '0' : '') + n; };
        return p(dt.getDate()) + '/' + p(dt.getMonth() + 1) + '/' + dt.getFullYear();
    },
    // Ngày + GIỜ: 'dd/MM/yyyy[ hh:mm[:ss]]', ISO 'yyyy-MM-dd[Thh:mm[:ss]]' hoặc '/Date(ms)/' → Date (có giờ) hoặc null
    parseNgayGio: function (v) {
        if (v === null || v === undefined || v === '') return null;
        var s = String(v), m;
        var mk = function (y, mo, d, h, mi, se) {
            var dt = new Date(+y, +mo - 1, +d, +(h || 0), +(mi || 0), +(se || 0));
            return (dt.getFullYear() === +y && dt.getMonth() === +mo - 1 && dt.getDate() === +d) ? dt : null;
        };
        if ((m = /^\/Date\((-?\d+)/.exec(s))) return new Date(parseInt(m[1], 10));
        if ((m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(s))) return mk(m[1], m[2], m[3], m[4], m[5], m[6]);
        if ((m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(s))) return mk(m[3], m[2], m[1], m[4], m[5], m[6]);
        return null;
    },
    // 'dd/mm/yyyy hh:mm:ss'; không đọc được thì trả nguyên chuỗi gốc, rỗng thì ''
    dmyHms: function (v) {
        var dt = PQ.parseNgayGio(v);
        if (!dt) return (v === null || v === undefined) ? '' : String(v);
        var p = function (n) { return (n < 10 ? '0' : '') + n; };
        return PQ.dmyDate(dt) + ' ' + p(dt.getHours()) + ':' + p(dt.getMinutes()) + ':' + p(dt.getSeconds());
    },

    hetHan: function (den) {
        var d = PQ.parseNgay(den);
        return !!d && d.getTime() < PQ.homNay().getTime();
    },
    // Ô "Khoảng ngày": "dd/mm/yyyy → dd/mm/yyyy" | "từ ..." | "đến ..." | "Không giới hạn"; đã quá hạn thì mờ + "(hết hạn)"
    khoangNgayHtml: function (tu, den) {
        var t = PQ.dmy(tu), d = PQ.dmy(den), s;
        if (!t && !d) s = 'Không giới hạn';
        else if (t && d) s = PQ.esc(t) + ' <i class="fa fa-long-arrow-right"></i> ' + PQ.esc(d);
        else if (t) s = 'từ ' + PQ.esc(t);
        else s = 'đến ' + PQ.esc(d);
        return PQ.hetHan(den) ? '<span class="pq-sub">' + s + ' (hết hạn)</span>' : s;
    },

    // Ô bảng "Chức năng": "Ứng dụng › Tên (mã)"; không có trong danh mục thì hiện ID thô (mapChucNang: ID → {TEN, MA, UD})
    chucNangHtml: function (mapChucNang, strId) {
        if (!PQ.has(mapChucNang, strId)) return '<span class="pq-mono">' + PQ.esc(strId) + '</span>';
        var c = mapChucNang[strId];
        return (c.UD ? '<span class="pq-sub">' + PQ.esc(c.UD) + ' › </span>' : '')
            + PQ.esc(c.TEN)
            + (c.MA ? ' <span class="pq-mono pq-sub">(' + PQ.esc(c.MA) + ')</span>' : '');
    },
    // Ô bảng "Người dùng": "Tên (tài khoản)" nếu response có kèm; không thì hiện ID + báo console (1 lần mỗi màn hình)
    _daCanhBaoTenND: {},
    nguoiDungHtml: function (row, strIdKey, strManHinh) {
        var o = PQ.nguoiDungCuaDong(row, strIdKey);
        if (!o.CO) {
            if (!PQ._daCanhBaoTenND[strManHinh] && window.console) {
                PQ._daCanhBaoTenND[strManHinh] = true;
                console.warn('[' + strManHinh + '] Response chỉ có ' + strIdKey + ', không kèm tên/tài khoản người dùng — bảng đang hiện ID. Cần bổ sung cột tên/tài khoản vào hàm LayDS. Các cột nhận được:', Object.keys(row));
            }
            return '<span class="pq-mono">' + PQ.esc(o.ID) + '</span>';
        }
        return (o.TEN ? PQ.esc(o.TEN) : '')
            + (o.TK ? (o.TEN ? ' <span class="pq-mono pq-sub">(' + PQ.esc(o.TK) + ')</span>' : '<span class="pq-mono">' + PQ.esc(o.TK) + '</span>') : '');
    },

    /*------------------------------------------
    --Chọn ĐỐI TƯỢNG từ bảng danh sách (thay cho việc gõ "Mã đối tượng" là chuỗi ID mà người dùng không thể biết)
    -------------------------------------------*/
    // Nguồn danh sách theo MÃ LOẠI đối tượng (dm_loaidoituong.MA, không phân biệt hoa/thường). Dùng đúng các hàm CHUẨN của hệ thống
    // (edu.system.getList_*, Corei/systemroot.js): nạp 1 lần cho mỗi loại, tìm + phân trang ngay trên trình duyệt như các ô chọn khác.
    // Mỗi hàm gọi done(mảng dòng có ID, MA, TEN). Loại chưa khai ở đây (chưa có hàm chuẩn) → không hiện bảng, người dùng nhập mã tay như cũ.
    NGUON_DOITUONG: {
        CSDT: function (done) { edu.system.getList_CoSoDaoTao({ strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, done); },
        CTDT: function (done) { edu.system.getList_ChuongTrinhDaoTao({ strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, done); },
        DAOTAO_HEDAOTAO: function (done) { edu.system.getList_HeDaoTao({ strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, done); },
        DAOTAO_KHOADAOTAO: function (done) { edu.system.getList_KhoaDaoTao({ strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, done); },
        DAOTAO_LOPQUANLY: function (done) { edu.system.getList_LopQuanLy({ strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, done); },
        DONVI: function (done) { edu.system.getList_CoCauToChuc({ strCCTC_Loai_Id: '', strCCTC_Cha_Id: '', iTrangThai: 1 }, done); }
    },
    // Mỗi hàm chuẩn của hệ thống đặt tên cột mã/tên khác nhau (MA/TEN, MAKHOA/TENKHOA, MACHUONGTRINH/TENCHUONGTRINH, TENHEDAOTAO, TENLOP...)
    // nên không đọc cứng MA/TEN: lấy theo thứ tự cột đúng chuẩn → cột bắt đầu bằng MA/TEN → cột kết thúc bằng _MA/_TEN (bỏ cột *ID).
    // Không có mã thì chỉ có tên; không có tên thì dùng mã/ID. Trả { ID, MA, TEN }.
    cotDanhMuc: function (r) {
        var keys = [], k, i, j;
        for (k in r) if (Object.prototype.hasOwnProperty.call(r, k)) keys.push(k);
        var val = function (key) { var v = r[key]; return (v === null || v === undefined) ? '' : String(v); };
        var tim = function (arrExact, arrRe) {
            for (i = 0; i < arrExact.length; i++) {
                for (j = 0; j < keys.length; j++) if (keys[j].toUpperCase() === arrExact[i] && val(keys[j]) !== '') return val(keys[j]);
            }
            for (i = 0; i < arrRe.length; i++) {
                for (j = 0; j < keys.length; j++) {
                    var K = keys[j].toUpperCase();
                    if (arrRe[i].test(K) && !/ID$/.test(K) && val(keys[j]) !== '') return val(keys[j]);
                }
            }
            return '';
        };
        var id = tim(['ID'], []), ma = tim(['MA'], [/^MA[A-Z0-9_]*$/, /_MA$/]), ten = tim(['TEN'], [/^TEN[A-Z0-9_]*$/, /_TEN$/]);
        return { ID: id, MA: ma, TEN: ten || ma || id };
    },
    cacheDoiTuong: {},   // mã loại (hoa) → danh sách đã chuẩn hóa, giữ trong phiên làm việc (nút "tải lại" để nạp mới)
    nguonDoiTuong: function (strMaLoai) {
        var k = String(strMaLoai === null || strMaLoai === undefined ? '' : strMaLoai).toUpperCase();
        return Object.prototype.hasOwnProperty.call(PQ.NGUON_DOITUONG, k) ? PQ.NGUON_DOITUONG[k] : null;
    },
    // Chữ thường, bỏ dấu — để tìm "lop" ra "Lớp", "dao tao" ra "Đào tạo"
    boDau: function (s) {
        s = String(s === null || s === undefined ? '' : s).toLowerCase();
        try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { }
        return s.replace(/đ/g, 'd');
    },
    _cssPick: function () {
        if ($('#pqPickCss').length) return;
        $('head').append('<style id="pqPickCss">' + [
            '.pq-pick{margin-top:8px;border:1px solid #dfe6f1;border-radius:10px;background:#fff;overflow:hidden}',
            '.pq-pick .pq-pick-head{display:flex;align-items:center;gap:10px;padding:8px 10px;background:#f8fafc;border-bottom:1px solid #edf1f7}',
            '.pq-pick .pq-pick-search{position:relative;flex:1 1 auto;min-width:0}',
            'html body .pq-pick .pq-pick-search input.form-control{height:34px !important}',
            '.pq-pick .pq-pick-count{font-size:12px;color:#64748b;white-space:nowrap}',
            '.pq-pick .pq-pick-reload{cursor:pointer;color:#475569;padding:4px 6px}.pq-pick .pq-pick-reload:hover{color:#223771}',
            '.pq-pick .pq-pick-tbl{width:100%;margin:0;border-collapse:collapse}',
            '.pq-pick .pq-pick-tbl>thead>tr>th{padding:7px 10px;background:#f3f6fc;border-bottom:1px solid #dfe6f1;font-size:11.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:#334155;text-align:left}',
            '.pq-pick .pq-pick-tbl>tbody>tr>td{padding:7px 10px;border-top:1px solid #edf1f7;font-size:13px;color:#0f172a;vertical-align:middle;text-align:left}',
            '.pq-pick .pq-pick-tbl>tbody>tr.pq-pick-r{cursor:pointer}',
            '.pq-pick .pq-pick-tbl>tbody>tr.pq-pick-r:hover>td{background:#f1f5fb}',
            '.pq-pick .pq-pick-tbl>tbody>tr.pq-pick-on>td{background:#e7efff;font-weight:600}',
            '.pq-pick .pq-pick-tbl td.pq-pick-act{text-align:right;white-space:nowrap}',
            '.pq-pick .pq-pick-do{display:inline-block;padding:3px 12px;border:1px solid #223771;border-radius:6px;font-size:12px;font-weight:700;color:#223771;cursor:pointer}',
            '.pq-pick .pq-pick-r:hover .pq-pick-do{background:#223771;color:#fff}',
            '.pq-pick .pq-pick-tbl td.pq-pick-empty{padding:18px 10px;text-align:center;color:#64748b}',
            '.pq-pick .pq-pick-foot{display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:6px 10px;border-top:1px solid #edf1f7;background:#fcfdff;font-size:12.5px;color:#475569}',
            '.pq-pick .pq-pg{display:inline-block;min-width:28px;padding:3px 8px;border:1px solid #dfe6f1;border-radius:6px;background:#fff;color:#223771;text-align:center;cursor:pointer;user-select:none}',
            '.pq-pick .pq-pg:hover{background:#eef3ff}.pq-pick .pq-pg.off{opacity:.4;pointer-events:none}',
            '.pq-pick-sel{margin-top:8px;padding:7px 12px;border:1px solid #abefc6;border-radius:8px;background:#ecfdf3;color:#067647;font-size:13px}',
            '.pq-pick-sel .pq-pick-again{margin-left:10px;color:#223771;font-weight:600;cursor:pointer}',
            '.pq-pick-note{margin-top:6px;font-size:12px;color:#b45309}'
        ].join('') + '</style>');
    },
    // Bảng chọn đối tượng đặt ngay dưới ô "Mã đối tượng": chọn LOẠI đối tượng → hiện bảng (ô tìm theo mã/tên + phân trang) → bấm dòng
    // để điền giá trị khóa (ID) vào ô. Đổi loại thì xóa mã cũ (mã của loại khác không còn đúng). Vẫn nhập tay được.
    //   cfg: drop (id ô chọn loại), txt (id ô mã đối tượng), pageSize (mặc định 8)
    // Trả về { dong() — đưa về trạng thái trống khi mở form mới, dongBo() — gọi sau khi form Sửa đã điền loại + mã bằng code:
    //          thu gọn bảng, chỉ hiện dòng "Đã chọn: tên (mã)" }
    pickerDoiTuong: function (cfg) {
        PQ._cssPick();
        var $drop = $('#' + cfg.drop), $txt = $('#' + cfg.txt), SZ = cfg.pageSize || 8;
        var st = { loai: '', rows: [], list: [], byId: {}, page: 1, token: 0, open: false, timer: null };
        var $sel = $('<div class="pq-pick-sel" style="display:none"></div>');
        var $note = $('<div class="pq-pick-note" style="display:none"><i class="fa fa-info-circle"></i> Loại này chưa có danh sách để chọn — nhập mã (giá trị khóa) của đối tượng vào ô trên.</div>');
        var $panel = $('<div class="pq-pick" style="display:none">'
            + '<div class="pq-pick-head"><div class="pq-pick-search">'
            + '<input type="text" class="form-control pq-pick-q" placeholder="Tìm theo mã hoặc tên..." autocomplete="off" /></div>'
            + '<span class="pq-pick-count"></span><a class="pq-pick-reload" title="Tải lại danh sách"><i class="fa fa-refresh"></i></a></div>'
            + '<div class="pq-pick-box"><table class="pq-pick-tbl"><thead><tr><th style="width:30%">Mã</th><th>Tên</th><th style="width:80px"></th></tr></thead><tbody></tbody></table></div>'
            + '<div class="pq-pick-foot"><a class="pq-pg" data-p="first" title="Trang đầu"><i class="fa fa-angle-double-left"></i></a>'
            + '<a class="pq-pg" data-p="prev" title="Trang trước"><i class="fa fa-angle-left"></i></a><span class="pq-pick-pg"></span>'
            + '<a class="pq-pg" data-p="next" title="Trang sau"><i class="fa fa-angle-right"></i></a>'
            + '<a class="pq-pg" data-p="last" title="Trang cuối"><i class="fa fa-angle-double-right"></i></a></div></div>');
        $txt.after($note); $txt.after($panel); $txt.after($sel);   // thứ tự: ô nhập, dòng "đã chọn", bảng, ghi chú

        var so = function (n) { return Number(n).toLocaleString('vi-VN'); };
        var chuan = function (dt) {
            return $.map(dt || [], function (r) {
                var o = PQ.cotDanhMuc(r);
                o.s = PQ.boDau(o.MA + ' ' + o.TEN);
                return [o];
            });
        };
        var tomTat = function () {
            var id = $.trim($txt.val());
            var r = (id !== '' && Object.prototype.hasOwnProperty.call(st.byId, id)) ? st.byId[id] : null;
            if (!r) { $sel.hide().empty(); return; }
            $sel.html('<i class="fa fa-check-circle"></i> Đã chọn: <b>' + PQ.esc(r.TEN) + '</b> <span class="pq-mono">' + PQ.esc(r.MA)
                + '</span> <a class="pq-pick-again">Chọn lại</a>').show();
        };
        var ve = function () {
            var tong = st.list.length, soTrang = Math.max(1, Math.ceil(tong / SZ)), cur = $.trim($txt.val()), h = '', i;
            if (st.page > soTrang) st.page = soTrang;
            if (st.page < 1) st.page = 1;
            for (i = (st.page - 1) * SZ; i < Math.min(tong, st.page * SZ); i++) {
                var r = st.list[i];
                h += '<tr class="pq-pick-r' + (cur !== '' && r.ID === cur ? ' pq-pick-on' : '') + '" data-id="' + PQ.esc(r.ID) + '"><td>' + (r.MA !== '' ? '<span class="pq-mono">' + PQ.esc(r.MA) + '</span>' : '<span class="pq-sub">—</span>') + '</td><td>' + PQ.esc(r.TEN) + '</td><td class="pq-pick-act"><a class="pq-pick-do">Chọn</a></td></tr>';
            }
            if (!h) h = '<tr><td colspan="3" class="pq-pick-empty">' + (st.rows.length ? 'Không tìm thấy đối tượng phù hợp.' : 'Loại này chưa có đối tượng nào.') + '</td></tr>';
            $panel.find('tbody').html(h);
            $panel.find('.pq-pick-count').text(tong === st.rows.length ? so(tong) + ' đối tượng' : so(tong) + ' / ' + so(st.rows.length) + ' đối tượng');
            $panel.find('.pq-pick-pg').text('Trang ' + so(st.page) + ' / ' + so(soTrang));
            $panel.find('[data-p="first"],[data-p="prev"]').toggleClass('off', st.page <= 1);
            $panel.find('[data-p="next"],[data-p="last"]').toggleClass('off', st.page >= soTrang);
        };
        var loc = function () {
            var q = PQ.boDau($.trim($panel.find('.pq-pick-q').val()));
            st.list = q === '' ? st.rows : $.grep(st.rows, function (r) { return r.s.indexOf(q) >= 0; });
            st.page = 1;
        };
        var dat = function (rows) {
            st.rows = rows;
            st.byId = {};
            $.each(rows, function (i, r) { st.byId[r.ID] = r; });
            loc();
            ve();
            tomTat();
            $panel.toggle(st.open);
        };
        var bao = function (strLoi) {
            st.rows = []; st.list = []; st.byId = {};
            $panel.find('tbody').html('<tr><td colspan="3" class="pq-pick-empty">' + PQ.esc(strLoi) + '</td></tr>');
            $panel.find('.pq-pick-count').text(''); $panel.find('.pq-pick-pg').text('');
            $panel.toggle(st.open);
        };
        var nap = function (bEp) {
            var key = st.loai.toUpperCase(), src = PQ.nguonDoiTuong(st.loai), tok = ++st.token;
            st.rows = []; st.list = []; st.byId = {};
            $panel.find('.pq-pick-q').val('');
            if (!bEp && PQ.cacheDoiTuong[key]) { dat(PQ.cacheDoiTuong[key]); return; }
            $panel.find('tbody').html('<tr><td colspan="3" class="pq-pick-empty"><i class="fa fa-spinner fa-spin"></i> Đang tải danh sách...</td></tr>');
            $panel.find('.pq-pick-count').text(''); $panel.find('.pq-pick-pg').text('');
            $panel.toggle(st.open);
            clearTimeout(st.timer);
            // Hàm chuẩn của hệ thống tự báo lỗi (edu.system.alert) và KHÔNG gọi lại done → có hạn chờ để bảng không quay mãi
            st.timer = setTimeout(function () { if (tok === st.token) bao('Không tải được danh sách — kiểm tra kết nối hoặc nhập mã tay ở ô trên.'); }, 60000);
            try {
                src(function (dt) {
                    if (tok !== st.token) return;   // đã đổi sang loại khác
                    clearTimeout(st.timer);
                    if (window.console && dt && dt.length > 0) {
                        var f0 = PQ.cotDanhMuc(dt[0]);
                        if (f0.ID === '' || f0.TEN === '' || f0.TEN === f0.ID) console.warn('[pq] Danh sách đối tượng "' + st.loai + '": không nhận ra cột ID/tên — các cột nhận được:', Object.keys(dt[0]));
                    }
                    PQ.cacheDoiTuong[key] = chuan(dt);
                    dat(PQ.cacheDoiTuong[key]);
                });
            } catch (e) { clearTimeout(st.timer); bao('Không tải được danh sách: ' + e.message); }
        };
        var chon = function (id) {
            $txt.val(id).trigger('change');
            st.open = false;
            $panel.hide();
            tomTat();
        };

        // select2 4.0.3 gắn khóa cuộn (scroll.select2) lên các khung cha; chọn loại làm bảng hiện ra/nội dung đổi độ cao nên lúc đóng không gỡ
        // được khóa → modal "kéo xuống không được". Gỡ ngay khi đóng danh sách (xem reference-select2-scroll-lock).
        $drop.closest('.modal').off('select2:close.pqpick').on('select2:close.pqpick', 'select', function () {
            $(this).parents().off('scroll.select2');
        });
        $drop.on('change.pqpick', function () {
            var ma = $.trim($drop.val());
            if (ma === st.loai) return;   // select2 có thể bắn change nhiều lần
            st.loai = ma;
            st.token++;
            $txt.val('');                 // mã của loại cũ không thuộc loại mới
            $sel.hide().empty();
            st.open = true;
            if (ma === '') { $panel.hide(); $note.hide(); return; }
            if (!PQ.nguonDoiTuong(ma)) { $panel.hide(); $note.show(); return; }
            $note.hide();
            nap(false);
        });
        $txt.on('input.pqpick change.pqpick', function () { tomTat(); if (st.open && $panel.is(':visible')) ve(); });
        var tre = null;
        $panel.on('input keyup', '.pq-pick-q', function () {
            clearTimeout(tre);
            tre = setTimeout(function () { loc(); ve(); }, 120);
        });
        $panel.on('click', '.pq-pick-r', function () { chon($(this).attr('data-id')); });
        $panel.on('click', '.pq-pick-reload', function () { if (st.loai !== '') nap(true); });
        $panel.on('click', '.pq-pg', function () {
            var soTrang = Math.max(1, Math.ceil(st.list.length / SZ)), k = $(this).attr('data-p');
            if (k === 'first') st.page = 1;
            else if (k === 'prev') st.page = Math.max(1, st.page - 1);
            else if (k === 'next') st.page = Math.min(soTrang, st.page + 1);
            else st.page = soTrang;
            ve();
        });
        $sel.on('click', '.pq-pick-again', function () {
            st.open = true;
            $panel.show();
            ve();
            $panel.find('.pq-pick-q').trigger('focus');
        });

        return {
            dong: function () {
                st.loai = ''; st.token++; st.open = false; st.rows = []; st.list = []; st.byId = {};
                clearTimeout(st.timer);
                $panel.hide(); $note.hide(); $sel.hide().empty(); $panel.find('.pq-pick-q').val('');
            },
            dongBo: function () {
                st.open = false;
                $panel.hide();
                tomTat();
                var ma = $.trim($drop.val());
                if (ma !== '' && !PQ.nguonDoiTuong(ma)) $note.show();
            }
        };
    },

    // Ô chọn người dùng trong modal: gõ từ khóa + Tìm (hoặc Enter) → đổ kết quả vào ô chọn.
    // cfg: {txt, btn, drop, hint, max (mặc định 50), notify (id vùng thông báo của modal, nếu không phải #notify)}
    // Trả về {reset(), datNguoi(id, nhan), layId(), tim()}.
    pickerNguoiDung: function (cfg) {
        var iToiDa = cfg.max || 50;
        var strHintMacDinh = 'Nhập ít nhất 2 ký tự để tìm; kết quả tối đa ' + iToiDa + ' người — thu hẹp từ khóa nếu chưa thấy.';
        var datHint = function (s) { $('#' + cfg.hint).text(s); };
        var canhBao = function (s) {
            var o = { type: 'w', content: s };
            if (cfg.notify) o.prePos = '#' + cfg.notify;
            edu.system.alertOnModal(o);
        };
        var self = {
            // Ô chọn chỉ giữ dòng tiêu đề + (nếu có) người đang chọn
            datNguoi: function (strId, strNhan) {
                var $d = $('#' + cfg.drop);
                $d.html('<option value="">-- Chọn người dùng --</option>');
                if (strId) $d.append($('<option>').val(strId).text(strNhan || strId));
                edu.util.viewValById(cfg.drop, strId || '');
            },
            reset: function () {
                edu.util.viewValById(cfg.txt, '');
                self.datNguoi('', '');
                datHint(strHintMacDinh);
            },
            layId: function () {
                return edu.util.getValById(cfg.drop);
            },
            tim: function () {
                var strTuKhoa = $.trim(edu.util.getValById(cfg.txt));
                if (strTuKhoa.length < 2) {
                    canhBao('Nhập ít nhất 2 ký tự để tìm người dùng.');
                    return;
                }
                var strDangChon = self.layId();
                var strNhanDangChon = $('#' + cfg.drop + ' option:selected').text();
                PQ.timNguoiDung(strTuKhoa, iToiDa, function (items, strLoi) {
                    if (strLoi) {
                        canhBao(strLoi);
                        return;
                    }
                    var ds = $.map(items, function (r) { return { ID: r.ID, TEN: r.LABEL }; });
                    // Người đang chọn (nếu không nằm trong kết quả mới) vẫn được giữ lại ở đầu danh sách
                    if (strDangChon && !$.grep(ds, function (r) { return r.ID === strDangChon; }).length) {
                        ds.unshift({ ID: strDangChon, TEN: strNhanDangChon });
                    }
                    PQ.loadCombo([cfg.drop], ds, '-- Chọn người dùng (' + items.length + ' kết quả) --');
                    if (strDangChon) edu.util.viewValById(cfg.drop, strDangChon);
                    else if (items.length === 1) edu.util.viewValById(cfg.drop, items[0].ID);
                    if (items.length === 0) datHint('Không tìm thấy người dùng nào khớp "' + strTuKhoa + '".');
                    else if (items.length >= iToiDa) datHint('Hiển thị ' + items.length + ' người đầu tiên — có thể còn thêm, hãy thu hẹp từ khóa.');
                    else datHint('Tìm thấy ' + items.length + ' người dùng.');
                });
            }
        };
        $('#' + cfg.btn).click(function () { self.tim(); });
        // Enter bị chặn toàn cục ở sự kiện keypress (systemroot.js) nên bắt ở keyup
        $('#' + cfg.txt).on('keyup', function (e) { if (e.which === 13) self.tim(); });
        return self;
    },

    // Danh mục vai trò hệ thống (hàm chuẩn của module vai trò ở ApisCMS) → [{MA, TEN}] (MA = MAVAITRO, TEN = TENVAITRO); lỗi thì []
    loadVaiTro: function (fnDone) {
        PQ.call(PQ.API.VAITRO_LAYDS, {
            'strLoaiVaiTro_Id': '', 'strTuKhoa': '', 'pageIndex': 1, 'pageSize': 5000,
            'dTrangThai': 1, 'strChung_VaiTro_Cha_Id': ''
        }, function (data) {
            var dt = (data.Success && data.Data) ? data.Data : [];
            if (!data.Success && window.console) console.warn('[pq] LayDanhSachVaiTro:', data.Message);
            if (dt.length > 0 && PQ.g(dt[0], 'MAVAITRO') === '' && window.console) {
                console.warn('[pq] LayDanhSachVaiTro không có cột MAVAITRO — các cột nhận được:', Object.keys(dt[0]));
            }
            fnDone($.map(dt, function (r) { return { MA: PQ.g(r, 'MAVAITRO'), TEN: PQ.g(r, 'TENVAITRO') }; }));
        }, function () {
            if (window.console) console.warn('[pq] Không nạp được danh mục vai trò.');
            fnDone([]);
        });
    },

    // Danh mục chức năng của TOÀN HỆ THỐNG (mọi ứng dụng) kèm tên ứng dụng để phân biệt chức năng trùng tên.
    // → [{ID, TEN, MA, UD, LABEL}] đã sắp theo ứng dụng rồi tên; lỗi thì [].
    // LABEL = "Ứng dụng › Tên chức năng (mã)".
    loadChucNang: function (fnDone) {
        var dtCn = null, mapUd = null;
        function xong() {
            if (dtCn === null || mapUd === null) return;
            var items = $.map(dtCn, function (r) {
                var ten = PQ.g(r, 'TENCHUCNANG'), ma = PQ.g(r, 'MACHUCNANG');
                var idUd = PQ.g(r, 'CHUNG_UNGDUNG_ID');
                var ud = (idUd !== '' && PQ.has(mapUd, idUd)) ? mapUd[idUd] : '';
                return {
                    ID: PQ.g(r, 'ID'), TEN: ten, MA: ma, UD: ud,
                    LABEL: (ud ? ud + ' › ' : '') + ten + (ma ? ' (' + ma + ')' : '')
                };
            });
            items.sort(function (a, b) {
                return (a.UD + '\u0000' + a.TEN).localeCompare(b.UD + '\u0000' + b.TEN, 'vi');
            });
            fnDone(items);
        }
        PQ.call(PQ.API.CHUCNANG_LAYDS, {
            'strTuKhoa': '', 'strChung_UngDung_Id': '', 'strCHUCNANGCHA_Id': '',
            'pageIndex': 1, 'pageSize': 5000, 'strNGUONTRUYCAP_Id': '', 'dTrangThai': 1
        }, function (data) {
            dtCn = (data.Success && data.Data) ? data.Data : [];
            if (!data.Success && window.console) console.warn('[pq] LayDanhSachChucNang:', data.Message);
            if (dtCn.length > 0 && PQ.g(dtCn[0], 'ID') === '' && window.console) {
                console.warn('[pq] LayDanhSachChucNang không có cột ID — các cột nhận được:', Object.keys(dtCn[0]));
            }
            xong();
        }, function () {
            if (window.console) console.warn('[pq] Không nạp được danh mục chức năng.');
            dtCn = [];
            xong();
        });
        PQ.call(PQ.API.UNGDUNG_LAYDS, {
            'strTuKhoa': '', 'pageIndex': 1, 'pageSize': 1000, 'dTrangThai': 1
        }, function (data) {
            var dt = (data.Success && data.Data) ? data.Data : [];
            mapUd = {};
            $.each(dt, function (i, r) { mapUd[PQ.g(r, 'ID')] = PQ.g(r, 'TENUNGDUNG'); });
            xong();
        }, function () {
            mapUd = {};   // thiếu tên ứng dụng thì nhãn chỉ không có tiền tố, không chặn màn hình
            xong();
        });
    },

    // Đổ danh mục [{ID, TEN}] vào các ô chọn: value = ID, hiển thị = TEN (đã tự escape)
    loadCombo: function (arrId, items, strTitle) {
        edu.system.loadToCombo_data({
            data: items,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "ID",
                mRender: function (j, r) { return PQ.esc(r.TEN); }
            },
            renderPlace: arrId,
            title: strTitle
        });
    },

    // Đổ danh mục {MA, TEN} vào các ô chọn, hiển thị "TEN (MA)" theo chuẩn dự án
    loadCombo_MaTen: function (arrId, dt, strTitle) {
        edu.system.loadToCombo_data({
            data: dt,
            renderInfor: {
                id: "MA",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (j, r) {
                    return r.TEN ? PQ.esc(r.TEN) + " (" + PQ.esc(r.MA) + ")" : PQ.esc(r.MA);
                }
            },
            renderPlace: arrId,
            title: strTitle
        });
    }
};
