function SeaGate_BackEnd(strdata, strDalLink, strpackage, strTacGia, strobj) {
    var isoluongrefcur = 0;
    cutcomment();
    var strPackage = "";
    var ivitripackage = strdata.indexOf("create or replace package ");
    if (ivitripackage > -1 && ivitripackage < 10) {
        ivitripackage += 26;
        if (strdata.includes("create or replace package body")) ivitripackage += 5;
        ivitriketthuc = strdata.indexOf(" ", ivitripackage);
        strPackage = strdata.substring(ivitripackage, ivitriketthuc);
    }
    if (strdata.includes("procedure")) strdata = strdata.substring(strdata.indexOf("procedure") + 9);
    var ivitrihambatdau = strdata.indexOf("(");
    var ivitrihamketthuc = strdata.indexOf(")");
    var ivitridulieubatdau = strdata.indexOf("open rs for");

    var strFunctionName = strdata.substring(0, ivitrihambatdau).replace(/\n/g, "").replace(/ /g, "");

    //Xử lý danh sách biến cần
    var arrThamSo = strdata.substring(ivitrihambatdau + 1, ivitrihamketthuc).replace(/\n/g, '').split(",");
    if (arrThamSo.length < 1) {
        return null;
    }
    for (var i = 0; i < arrThamSo.length; i++) {
        arrThamSo[i] = getTypeSup(arrThamSo[i]);
    }
    //arrThamSo = sort(arrThamSo);

    //////Xử lý danh sách dữ liệu ra
    //var strData = strdata.substring(ivitridulieubatdau + 1);
    //strData = strData.substring(strData.indexOf("select") + 6);
    //var strdatatest = strData.toLowerCase();
    //strData = strData.substring(0, getViTriDuLieu(strdatatest));
    //var arrData = strData.split(',');
    ////Lấy các phần tử cần thiết trong dữ liệu ra
    //for (var i = 0; i < arrData.length; i++) {
    //    var strresult = cutdata(arrData[i]);
    //    if (strresult != false) arrData[i] = strresult;
    //    if (strresult.length == 0) {
    //        arrData.splice(i, 1);
    //        i--;
    //    }
    //}
    ////Loại bỏ các phần tử sai lệch
    //for (var i = 0; i < arrData.length; i++) {
    //    if (arrData[i].includes("\n") || arrData[i].includes('/')) {
    //        arrData.splice(i, 1);
    //        i--;
    //    }
    //}
    ////Loại bỏ các phẩn tử giống nhau
    //for (var i = 0; i < arrData.length - 1; i++) {
    //    var temp = arrData[i];
    //    for (var j = i + 1; j < arrData.length; j++)
    //        if (arrData[j] == temp) {
    //            arrData.splice(j, 1);
    //        }
    //}

    //var strHam = "";
    //var strClass = "";
    //var strArrVal = "";
    //var strCommentVal = "";

    //var arrDal = [];
    //var arrDb = [];
    //for (var i = 0; i < arrThamSo.length; i++) {
    //    arrDb.push(getStrDb(arrThamSo[i]));
    //}

    //if (isoluongrefcur == 0) strHam = creatHam_Them_Sua_Xoa();
    //else {
    //    if (isoluongrefcur == 1) {
    //        strHam = creatHam_LayThongTin();
    //        strClass = creatClass();
    //    }
    //    else {
    //        if (isoluongrefcur > 1) strHam = creatHam_NhieuBang();
    //    }
    //}

    var seagate = {
        //zoneA: strHam,
        //zoneB: strClass,
        //arrDb: arrDb,
        //arrDal: arrDal,
        //strArrVal: strArrVal,
        strPackage: strPackage,
        strFunctionName: strFunctionName,
        arrThamSo: arrThamSo
        //arrout: arrData,
        //isoluongrefcur: isoluongrefcur,
        //strCommentVal: strCommentVal
    };
    return seagate;

    function creatHam_LayThongTin() {
        var row = "";
        row += '\t\t/// <summary>\n';
        row += '\t\t/// ' + strpackage + '.' + strFunctionName + '\n';
        row += '\t\t/// <summary>\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            var strcheck = getType(arrThamSo[i]);
            if (strcheck != false)
                row += '\t\t/// <param name="' + strcheck.replace(/string /g, '').replace(/int /g, '').replace(/double /g, '').replace(/ref /g, '').replace(/ /g, '') + '"></param>\n';
        }
        row += '\t\t/// <returns></returns>\n';
        strCommentVal = row;
        var typeofreturn = "string";
        row += '\t\tpublic static string ' + strFunctionName + "(" + getarrValGET() + ")\n ";
        row += '\t\t{\n';

        row += '\t\t\tOraDB db = new OraDB(OraDBConnection.GetConnectionString(OraDBConnection.Connection.OraMainDb));\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            row += '\t\t\tdb.AddParameter(' + getTypeSup(arrThamSo[i]) + ');\n';
        }
        row += '\t\t\ttry\n';
        row += '\t\t\t{\n';
        row += '\t\t\t\tdb.Open();\n';
        row += '\t\t\t\tDataSet ds = db.ExecuteDataSet(CommandType.StoredProcedure, "' + strpackage + '.' + strFunctionName + '");\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            var strCheck = arrThamSo[i].toLowerCase();
            var temp = checkPaOut(arrThamSo[i]);
            if (temp != false) {
                console.log(strCheck);
                if (strCheck.includes("varchar")) row += '\t\t\t\t' + temp + ' = db.idbParameter[' + i + '].Value.ToString();\n';
                else {
                    if (strCheck.includes("number")) row += '\t\t\t\t' + temp + ' = int.Parse(db.idbParameter[' + i + '].Value.ToString());\n';
                }

            }
        }
        row += '\t\t\t\tvar table = ds.Tables[0];\n';
        row += '\t\t\t\tvar jsonData = JsonConvert.SerializeObject(table, Formatting.Indented);\n';
        row += '\t\t\t\tdb.Close();\n';
        row += '\t\t\t\tdb.Dispose();\n';
        row += '\t\t\t\treturn jsonData;\n';
        row += '\t\t\t}\n';
        row += '\t\t\tcatch (Exception ex)\n';
        row += '\t\t\t{\n';
        row += '\t\t\t\tdb.Close();\n';
        row += '\t\t\t\tdb.Dispose();\n';
        row += '\t\t\t\ttry\n';
        row += '\t\t\t\t{\n';
        row += '\t\t\t\t\tLogger.WriteLog(Logger.LogType.Error, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");\n';
        row += '\t\t\t\t\tLogDal.AccessDB(null, null, ex.Message, null, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");\n';
        row += '\t\t\t\t}\n';
        row += '\t\t\t\tcatch{Logger.WriteLog(Logger.LogType.Error, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");}\n';
        row += '\t\t\t\treturn null;\n';
        row += '\t\t\t}\n';
        row += '\t\t}\n';
        return row;
    }

    function creatHam_NhieuBang() {
        var row = "";
        row += '\t\t/// <summary>\n';
        row += '\t\t/// ' + strpackage + '.' + strFunctionName + '\n';
        row += '\t\t/// <summary>\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            var strcheck = getType(arrThamSo[i]);
            if (strcheck != false)
                row += '\t\t/// <param name="' + strcheck.replace(/string /g, '').replace(/int /g, '').replace(/double /g, '').replace(/ref /g, '').replace(/ /g, '') + '"></param>\n';
        }
        row += '\t\t/// <returns></returns>\n';
        strCommentVal = row;
        var typeofreturn = "string";
        row += '\t\tpublic static string ' + strFunctionName + "(" + getarrValGET() + ")\n ";
        row += '\t\t{\n';

        row += '\t\t\tOraDB db = new OraDB(OraDBConnection.GetConnectionString(OraDBConnection.Connection.OraMainDb));\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            row += '\t\t\tdb.AddParameter(' + getTypeSup(arrThamSo[i]) + ');\n';
        }

        row += '\t\t\ttry\n';
        row += '\t\t\t{\n';
        row += '\t\t\t\tdb.Open();\n';
        row += '\t\t\t\tDataSet ds = db.ExecuteDataSet(CommandType.StoredProcedure, "' + strpackage + '.' + strFunctionName + '");\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            var strCheck = arrThamSo[i].toLowerCase();
            var temp = checkPaOut(arrThamSo[i]);
            if (temp != false) {
                console.log(strCheck);
                if (strCheck.includes("varchar")) row += '\t\t\t\t' + temp + ' = db.idbParameter[' + i + '].Value.ToString();\n';
                else {
                    if (strCheck.includes("number")) row += '\t\t\t\tint.Parse(' + temp + ' = db.idbParameter[' + i + '].Value.ToString());\n';
                }

            }
        }
        row += '\t\t\t\tdb.Close();\n';
        row += '\t\t\t\tdb.Dispose();\n';
        row += '\t\t\t\treturn ds;\n';
        row += '\t\t\t}\n';
        row += '\t\t\tcatch (Exception ex)\n';
        row += '\t\t\t{\n';
        row += '\t\t\t\tdb.Close();\n';
        row += '\t\t\t\tdb.Dispose();\n';
        row += '\t\t\t\ttry\n';
        row += '\t\t\t\t{\n';
        row += '\t\t\t\t\tLogger.WriteLog(Logger.LogType.Error, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");\n';
        row += '\t\t\t\t\tLogDal.AccessDB(null, null, ex.Message, null, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");\n';
        row += '\t\t\t\t}\n';
        row += '\t\t\t\tcatch{Logger.WriteLog(Logger.LogType.Error, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");}\n';
        row += '\t\t\t\treturn null;\n';
        row += '\t\t\t}\n';
        row += '\t\t}\n';
        return row;
    }

    function creatHam_Them_Sua_Xoa() {
        var row = "";
        row += '\t\t/// <summary>\n';
        row += '\t\t/// ' + strpackage + '.' + strFunctionName + '\n';
        row += '\t\t/// <summary>\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            var strcheck = getType(arrThamSo[i]);
            if (strcheck != false)
                row += '\t\t/// <param name="' + strcheck.replace(/string /g, '').replace(/int /g, '').replace(/double /g, '').replace(/ref /g, '').replace(/ /g, '') + '"></param>\n';
        }
        row += '\t\t/// <returns></returns>\n';
        strCommentVal = row;
        var typeofreturn = "string";
        for (var i = 0; i < arrThamSo.length; i++) {
            var temp = getType(arrThamSo[i]);
            if (temp != false) {
                arrDal.push(temp);
            }
        }
        row += '\t\tpublic static string ' + strFunctionName + '(' + strobj + 'Entity obj' + getarrValSET() + ')\n ';
        row += '\t\t{\n';

        row += '\t\t\tOraDB db = new OraDB(OraDBConnection.GetConnectionString(OraDBConnection.Connection.OraMainDb));\n';
        var arrtemp = arrThamSo;
        for (var i = 0; i < arrtemp.length; i++) {
            row += '\t\t\tdb.AddParameter(' + getTypeSetSup(arrtemp[i]) + ');\n';
        }

        row += '\t\t\ttry\n';
        row += '\t\t\t{\n';
        row += '\t\t\t\tdb.Open();\n';
        row += '\t\t\t\tdb.ExecuteNonQuery(CommandType.StoredProcedure, "' + strpackage + '.' + strFunctionName + '");\n';
        row += '\t\t\t\tdb.Close();\n';
        row += '\t\t\t\tdb.Dispose();\n';
        for (var i = 0; i < arrThamSo.length; i++) {
            var strCheck = arrThamSo[i].toLowerCase();
            var temp = checkPaOut(arrThamSo[i]);
            if (temp != false) {
                console.log(strCheck);
                if (strCheck.includes("varchar")) row += '\t\t\t\t' + temp + ' = db.idbParameter[' + i + '].Value.ToString();\n';
                else {
                    if (strCheck.includes("number")) row += '\t\t\t\tint.Parse(' + temp + ' = db.idbParameter[' + i + '].Value.ToString());\n';
                }

            }
        }
        row += '\t\t\t\treturn db.idbParameter[0].Value.ToString();\n';
        row += '\t\t\t}\n';
        row += '\t\t\tcatch (Exception ex)\n';
        row += '\t\t\t{\n';
        row += '\t\t\t\tdb.Close();\n';
        row += '\t\t\t\tdb.Dispose();\n';
        row += '\t\t\t\ttry\n';
        row += '\t\t\t\t{\n';
        row += '\t\t\t\t\tLogger.WriteLog(Logger.LogType.Error, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");\n';
        row += '\t\t\t\t\tLogDal.AccessDB(null, null, ex.Message, null, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");\n';
        row += '\t\t\t\t}\n';
        row += '\t\t\t\tcatch{Logger.WriteLog(Logger.LogType.Error, "' + strDalLink + '.DAL/' + strobj + 'Dal/' + strFunctionName + '");}\n';
        row += '\t\t\t\treturn null;\n';
        row += '\t\t\t}\n';
        row += '\t\t}\n';
        return row;
    }

    function creatClass() {
        var row = "";
        row += '\t\tclass out' + strFunctionName + '\n';
        row += '\t\t{\n';
        for (var i = 0; i < arrData.length; i++) {
            var strname = arrData[i].toUpperCase();
            row += '\t\t\tstring ' + strname + ' = "' + strname + '";\n';
        }
        row += '\t\t}\n';
        return row;
    }

    function getType(strVal) {
        var strpre = "";
        if (strVal.includes(" refcur")) return false;
        if (strVal.includes("ParamTuKhoa ")) return 'string strTuKhoa';
        if (strVal.includes("PageNumber ")) return 'int pageIndex';
        if (strVal.includes("ItemPerPage ")) return 'int pageSize';
        if (strVal.includes("ParamTrangThai ") && strVal.includes(" number")) return 'int iTrangThai';
        if (strVal.includes("ParamThuTu") && strVal.includes(" number")) return 'int iThuTu';
        if (strVal.includes("ParamTinhTrang ") && strVal.includes(" number")) return 'int iTinhTrang';
        if (strVal.includes("TotalPage ")) return false;
        if (strVal.includes("TotalItem ")) return 'ref int totalRow';
        if (strVal.includes("ParamErr") && isoluongrefcur == 0) return false;

        if (strVal.includes(" out ") || strVal.includes(" OUT ")) strpre = "ref ";
        if (strVal.includes("Param")) {
            if (strVal.includes(" number") || strVal.includes(" NUMBER")) {
                strVal = strVal.substring(strVal.indexOf("Param") + 5);
                strVal = strVal.substring(0, strVal.indexOf(" "));
                strVal = 'double d' + strVal;
            }
            else {
                strVal = strVal.substring(strVal.indexOf("Param") + 5);
                strVal = strVal.substring(0, strVal.indexOf(" "));
                strVal = 'string str' + strVal;
            }
            return strpre + strVal;
        }
        return false;
    }

    function getTypeSup(strVal) {
        //1. paramdb
        //2. paramexcel
        //3. dulieumacdinh
        //4. kieu chu(0), kieu so(1)
        //5. In(0), Out(1), InOut(10)
        if (strVal.includes("ParamErr ")) return 'ParamErr, , , 0, 1';
        if (strVal.includes("ParamTuKhoa ")) return 'ParamTuKhoa, TuKhoa, ,0, 0';
        if (strVal.includes("PageNumber ")) return 'PageNumber, Index, 1, 1, 10';
        if (strVal.includes("ItemPerPage ")) return 'ItemPerPage, pageSize, 100000, 1, 0';
        if (strVal.includes("ParamTrangThai ") && strVal.includes(" number")) return 'ParamTrangThai, iTrangThai, 1, 1, 0';
        if (strVal.includes("ParamThuTu ") && strVal.includes(" number")) return 'ParamThuTu, iThuTu, 1, 1, 0';
        if (strVal.includes("ParamTinhTrang ") && strVal.includes(" number")) return 'ParamTinhTrang, iTinhTrang, 1, 1, 0';
        if (strVal.includes("TotalPage ")) return 'TotalPage, , 0, 1, 10';
        if (strVal.includes("TotalItem ")) return 'TotalItem, , 0, 1, 10';

        if (strVal.includes("Param")) {
            var strlast = ", 0";
            if (strVal.includes(" out ") || strVal.includes(" OUT ")) {
                strlast = ", 1";
            }
            if (strVal.includes(" number") || strVal.includes(" NUMBER")) {
                strVal = strVal.substring(strVal.indexOf("Param") + 5);
                strVal = strVal.substring(0, strVal.indexOf(" "));
                return 'Param' + strVal + ', d' + strVal + ', , 1' + strlast;
            }
            else {
                strVal = strVal.substring(strVal.indexOf("Param") + 5);
                strVal = strVal.substring(0, strVal.indexOf(" "));
                return 'Param' + strVal + ', ' + strVal + ', , 0' + strlast;
            }
        }

        if (strVal.includes(" refcur")) {
            return strVal.substring(strVal.indexOf("rs"), strVal.indexOf(" ", strVal.indexOf("rs") + 2)) + ', , , 10, 1';
        }
        return "";
    }

    function getTypeSetSup(strVal) {

        if (strVal.includes("ParamErr ")) return '"ParamErr", null, OracleType.VarChar, 1000, ParameterDirection.Output';
        if (strVal.includes("ParamTuKhoa ")) return '"ParamTuKhoa", obj.strTuKhoa, OracleType.VarChar, 100';
        if (strVal.includes("PageNumber ")) return '"PageNumber", obj.pageIndex, OracleType.Number, 100, ParameterDirection.InputOutput';
        if (strVal.includes("ItemPerPage ")) return '"ItemPerPage", obj.pageSize, OracleType.Number, 100, ParameterDirection.Input';
        if (strVal.includes("ParamTrangThai ") && strVal.includes(" number")) return '"ParamTrangThai", obj.iTrangThai, OracleType.Number, 100, ParameterDirection.Input';
        if (strVal.includes("ParamThuTu ") && strVal.includes(" number")) return '"ParamThuTu", obj.iThuTu, OracleType.Number, 100, ParameterDirection.Input';
        if (strVal.includes("ParamTinhTrang ") && strVal.includes(" number")) return '"ParamTinhTrang", obj.iTinhTrang, OracleType.Number, 100, ParameterDirection.Input';
        if (strVal.includes("TotalPage ")) return '"TotalPage", 0, OracleType.Number, 100, ParameterDirection.InputOutput';
        if (strVal.includes("TotalItem ")) return '"TotalItem", obj.totalRow, OracleType.Number, 100, ParameterDirection.InputOutput';

        if (strVal.includes("Param")) {
            var strlast = "";
            if (strVal.includes(" out ")) {
                strlast = ", ParameterDirection.Output";
            }
            if (strVal.includes(" number") || strVal.includes(" NUMBER")) {
                strVal = strVal.substring(strVal.indexOf("Param") + 5);
                strVal = strVal.substring(0, strVal.indexOf(" "));
                return '"Param' + strVal + '", obj.d' + strVal + ', OracleType.Number, 100' + strlast;
            }
            else {
                strVal = strVal.substring(strVal.indexOf("Param") + 5);
                strVal = strVal.substring(0, strVal.indexOf(" "));
                return '"Param' + strVal + '", obj.str' + strVal + ', OracleType.VarChar, 4000' + strlast;
            }
        }

        if (strVal.includes(" refcur")) {
            return '"' + strVal.substring(strVal.indexOf("rs"), strVal.indexOf(" ", strVal.indexOf("rs") + 2)) + '", OracleType.Cursor, ParameterDirection.Output';
        }
        return "";
    }

    function getStrDb(strVal) {
        if (strVal.includes("PageNumber ")) return 'PageNumber IN OUT NUMBER';
        if (strVal.includes("ItemPerPage ")) return 'ItemPerPage IN NUMBER';
        if (strVal.includes("TotalPage ")) return 'TotalPage IN OUT NUMBER';
        if (strVal.includes("TotalItem ")) return 'TotalItem IN OUT NUMBER';

        if (strVal.includes("Param")) {
            strVal = strVal.substring(strVal.indexOf("Param"));
            return strVal;
        }

        if (strVal.includes(" refcur")) {
            return strVal.substring(strVal.indexOf("rs"));
        }
        return "";
    }

    function sort(arr) {
        var arrb = [];
        var arrtemp = []

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].includes(" refcur")) isoluongrefcur++;
        }

        if (isoluongrefcur == 0) {
            var arrbegin = ["ParamTuKhoa ", "ParamId", "ParamErr "];
            var arrexcept = [" refcur", , "TotalPage ", "TotalItem ", "ItemPerPage ", "PageNumber ", " out "];
        } else {
            var arrbegin = ["ParamTuKhoa "];
            var arrexcept = [" refcur", "ParamErr ", "TotalPage ", "TotalItem ", "ItemPerPage ", "PageNumber ", " out "];
        }

        for (var i = 0; i < arrbegin.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].includes("" + arrbegin[i])) {
                    arrb.unshift(arr[j]);
                    arr.splice(j, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < arrexcept.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].includes("" + arrexcept[i])) {
                    arrtemp.unshift(arr[j]);
                    arr.splice(j, 1);
                    break;
                }
            }
        }
        return arrb.concat(arr.concat(arrtemp));
    }

    function getViTriDuLieu(strData_Get) {
        if (strData_Get.length == 0) return -1;
        var vitribatdau = strData_Get.indexOf("select");
        var vitriketthuc = strData_Get.indexOf("from");
        if (vitribatdau > vitriketthuc || vitribatdau == -1) return vitriketthuc;
        else {
            var temp = strData_Get.substring(vitriketthuc + 4);
            return vitriketthuc + 4 + getViTriDuLieu(temp);
        }
    }

    function cutdata(datacut) {
        if (datacut.includes("--")) {
            datacut = datacut.substring(0, datacut.indexOf("--"));
        }
        if (datacut.includes(",")) {
            datacut = datacut.substring(0, datacut.indexOf(","));
        }
        if (datacut.includes("as ")) {
            var strtemp = datacut.substring(datacut.lastIndexOf("as ") + 2);
            strtemp = strtemp.replace(/ /g, "");
            var strcheck = strtemp.toLowerCase();
            if (strcheck.includes(" varchar2") || strcheck.includes(" number") || strcheck.includes("--number") || strcheck.includes("--varchar2")) return false;
            return strtemp;
        }
        else {
            if (datacut.includes(".")) {
                var strtemp = datacut.substring(datacut.lastIndexOf(".") + 1);
                strtemp = strtemp.replace(/ /g, "");
                return strtemp;
            }
        }
        return datacut;
    }

    function cutcomment() {
        while (strdata.includes('--')) {
            var ivitricomment = strdata.indexOf('--');
            var ivitriendcomment = strdata.indexOf('\n', ivitricomment);
            if (ivitriendcomment < ivitricomment) return;
            var strcomment = strdata.substring(ivitricomment, ivitriendcomment);
            strdata = strdata.replace(strcomment, "");
        }
    }

    function checkPaOut(strTemp) {
        strTemp = getType(strTemp);
        if (!strTemp) return false;
        if (strTemp.includes("ref")) {
            return strTemp.substring(strTemp.lastIndexOf(" ") + 1);
        }
        return false;
    }

    function getarrValGET() {
        var row = "";
        for (var i = 0; i < arrThamSo.length; i++) {
            var temp = getType(arrThamSo[i]);
            if (temp != false) {
                row += temp + ", ";
                arrDal.push(temp);
            }
        }
        row = row.substring(0, row.lastIndexOf(","));
        strArrVal = row;
        return row;
    }

    function getarrValSET() {
        var row = "";
        for (var i = 0; i < arrThamSo.length; i++) {
            var temp = checkPaOut(arrThamSo[i]);
            if (temp != false) {
                row += ", " + getType(arrThamSo[i]);
            }
        }
        strArrVal = row;
        return row;
    }
}

function SeaGate_CommentSQL(strdata) {
    var isoluongrefcur = 0;
    //
    strdata = cutbugdata(strdata);
    var strOldData = strdata;
    strdatacheck = strdata.toLowerCase();
    var strPackage = "";
    var ivitripackage = strdatacheck.indexOf("create or replace package ");
    if (ivitripackage > -1 && ivitripackage < 10) {
        ivitripackage += 26;
        if (strdatacheck.includes("create or replace package body")) ivitripackage += 5;
        ivitriketthuc = strdatacheck.indexOf(" ", ivitripackage);
        strPackage = strdatacheck.substring(ivitripackage, ivitriketthuc);
    }
    while (strdata.includes("procedure")) {
        //Cut từ đầu đến sau procedure
        if (strdata.includes("procedure")) strdata = strdata.substring(strdata.indexOf("procedure") + 9);

        var iViTriBegin = strdata.indexOf("begin", ivitrihambatdau);
        var strTempReplace = "";
        strTempReplace = strdata.substring(0, iViTriBegin + 5);
        console.log(strTempReplace);
        var strNewData = cutcomment(strTempReplace);
        if (strNewData == undefined) console.log(strTempReplace);
        var ivitrihambatdau = strNewData.indexOf("(");
        var ivitrihamketthuc = strNewData.indexOf(")");
        var strFunctionBegin = strNewData.substring(0, ivitrihambatdau);
        var strFunctionName = strFunctionBegin.replace(/\n/g, "").replace(/ /g, "");

        //Xử lý danh sách biến cần
        var arrThamSo = strNewData.substring(ivitrihambatdau + 1, ivitrihamketthuc);
        arrThamSo = cutcomment(arrThamSo);
        arrThamSo = arrThamSo.split(",");

        // if (arrThamSo.length <3) {
        //     return null;
        // }
        arrThamSo = sort(arrThamSo);
        arrThamSo = selectIn(arrThamSo);
        var newString = "";
        newString += '\n\t\tvdate_bot varchar2(100) := pkg_chung.ChuyenDuLieuNgayThang(sysdate);';
        newString += '\n\tbegin'
        for (var i = 0; i < arrThamSo.length; i++) {
            if (arrThamSo.includes("--")) continue;
            if (arrThamSo.includes(".")) continue;
            newString += "\n\t\tinsert into bot values('" + strPackage + "','" + strFunctionName + "', vdate_bot, '" + arrThamSo[i] + "', " + arrThamSo[i] + ");";
        }
        newString = strdata.substring(0, iViTriBegin) + newString;
        strOldData = strOldData.replace(strTempReplace, newString);
    }
    while (strdata.includes("PROCEDURE")) {
        //Cut từ đầu đến sau procedure
        if (strdata.includes("PROCEDURE")) strdata = strdata.substring(strdata.indexOf("PROCEDURE") + 9);

        var iViTriBegin = strdata.indexOf("BEGIN", ivitrihambatdau);
        var strTempReplace = "";
        strTempReplace = strdata.substring(0, iViTriBegin + 5);
        console.log(strTempReplace);
        var strNewData = cutcomment(strTempReplace);
        if (strNewData == undefined) console.log(strTempReplace);
        var ivitrihambatdau = strNewData.indexOf("(");
        var ivitrihamketthuc = strNewData.indexOf(")");
        var strFunctionBegin = strNewData.substring(0, ivitrihambatdau);
        var strFunctionName = strFunctionBegin.replace(/\n/g, "").replace(/ /g, "");

        //Xử lý danh sách biến cần
        var arrThamSo = strNewData.substring(ivitrihambatdau + 1, ivitrihamketthuc);
        arrThamSo = cutcomment(arrThamSo);
        arrThamSo = arrThamSo.split(",");

        // if (arrThamSo.length <3) {
        //     return null;
        // }
        arrThamSo = sort(arrThamSo);
        arrThamSo = selectIn(arrThamSo);
        var newString = "";
        newString += '\n\t\tvdate_bot varchar2(100) := pkg_chung.ChuyenDuLieuNgayThang(sysdate);';
        newString += '\n\tbegin'
        for (var i = 0; i < arrThamSo.length; i++) {
            if (arrThamSo.includes("--")) continue;
            if (arrThamSo.includes(".")) continue;
            newString += "\n\t\tinsert into bot values('" + strPackage + "','" + strFunctionName + "', vdate_bot, '" + arrThamSo[i] + "', " + arrThamSo[i] + ");";
        }
        newString = strdata.substring(0, iViTriBegin) + newString;
        strOldData = strOldData.replace(strTempReplace, newString);
    }
    return strOldData;

    function selectIn(arrThamSo) {
        var newArr = [];
        //Loại bỏ phần tử không chứa in
        for (var i = 0; i < arrThamSo.length; i++) {
            if (arrThamSo[i].includes(" out ") || arrThamSo[i].includes(" OUT ")) {
                if (arrThamSo[i].indexOf(" IN ") == -1 && arrThamSo[i].indexOf(" in ") == -1) {
                    continue;
                }
            }

            var strTemp = arrThamSo[i];
            strTemp = strTemp.trim();
            while (strTemp[0] == " ") {
                strTemp = strTemp.substring(1);
            }
            strTemp = strTemp.substring(0, strTemp.indexOf(" "));
            newArr.push(strTemp);
        }
        return newArr;
    }

    function sort(arr) {
        var arrbegin = ["ParamTuKhoa ", "ParamErr "];
        var arrb = [];
        var arrexcept = [" refcur", "ParamId ", "TotalPage ", "TotalItem ", "ItemPerPage ", "PageNumber ", "ParamTrangThai "];
        var arrtemp = [];

        for (var i = 0; i < arr.length; i++) {
            if (arr[i].includes(" refcur")) isoluongrefcur++;
        }

        for (var i = 0; i < arrbegin.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].includes("" + arrbegin[i])) {
                    arrb.unshift(arr[j]);
                    arr.splice(j, 1);
                    break;
                }
            }
        }
        for (var i = 0; i < arrexcept.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].includes("" + arrexcept[i])) {
                    arrtemp.unshift(arr[j]);
                    arr.splice(j, 1);
                    break;
                }
            }
        }
        return arrb.concat(arr.concat(arrtemp));
    }

    function cutcomment(strdata) {
        while (strdata.includes('/*')) {
            var ivitricomment = strdata.indexOf('/*');
            var ivitriendcomment = strdata.indexOf('*/', ivitricomment) + 2;
            if (ivitriendcomment < ivitricomment) break;
            var strcomment = strdata.substring(ivitricomment, ivitriendcomment);
            strdata = strdata.replace(strcomment, "");
        }
        while (strdata.includes('--')) {
            var ivitricomment = strdata.indexOf('--');
            var ivitriendcomment = strdata.indexOf('\n', ivitricomment);
            if (ivitriendcomment < ivitricomment) break;
            var strcomment = strdata.substring(ivitricomment, ivitriendcomment);
            strdata = strdata.replace(strcomment, "");
        }
        return strdata;
    }

    
}

function cutbugdata(strdata) {
    while (strdata.includes("insert into bot values")) {
        var iBatDau = strdata.indexOf("insert into bot values");
        var iKetThuc = strdata.indexOf("\n", iBatDau + 2) + 1;
        var strtemp = strdata.substring(iBatDau, iKetThuc);
        strdata = strdata.replace(strtemp, '');
    }
    while (strdata.includes("vdate_bot varchar2(100)")) {
        var iBatDau = strdata.indexOf("vdate_bot varchar2(100)");
        var iKetThuc = strdata.indexOf("\n", iBatDau + 2) + 1;
        var strtemp = strdata.substring(iBatDau, iKetThuc);
        strdata = strdata.replace(strtemp, '');
    }
    return strdata;
}