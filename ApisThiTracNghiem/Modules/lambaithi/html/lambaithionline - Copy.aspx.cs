using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Web;
using System.Web.Security;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using Apis.CommonV1.Base;
using Apis.CommonV1.Base.Cryptor;
using Apis.HeThong.BO.Base;
using Apis.HeThong.Entity.Base;
using Apis.Login.BO.Base;
using Apis.Login.Entity.Base;
using Apis.ThiTracNghiem.BO.Base;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Apis.NewLogin.ApisThiTracNghiem.Modules.lambaithi.html
{
    public partial class lambaithionline : System.Web.UI.Page
    {
        public string fullname = "";
        public string language_id = "";
        public string user_id = "";
        public string tokenjwt = "";
        public string app_id = "";
        public string avatar = "";
        public string report = "";
        public static string strThiSinh_Id = "";
        public static string strThiSinh_Id_URL = "";
        public static string strStudentExamroom_Id = "";
        public static string strExamRoomInfo_Id = "";
        public string lblXYZCLRVN = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    Response.Redirect("../../../../logout.aspx");
                }
                else
                {

                    fullname = (HttpContext.Current.User as CustomPrincipal).Fullname;
                    language_id = (HttpContext.Current.User as CustomPrincipal).Language_Id;
                    user_id = (HttpContext.Current.User as CustomPrincipal).User_Id;
                    tokenjwt = (HttpContext.Current.User as CustomPrincipal).Token;
                    avatar = (HttpContext.Current.User as CustomPrincipal).Avatar;
                    avatar = avatar.Replace("\\", "/");
                    strThiSinh_Id = user_id;
                    //user_id = XOR.encrypt(user_id);
                    string strMoTa = "strThiSinh_Id " + strThiSinh_Id;
                    makeLogs("ELAMBAITHI", user_id, "ELAMBAITHI", strMoTa);
                    //if (!Page.IsPostBack)
                    //{
                    strThiSinh_Id = (HttpContext.Current.User as CustomPrincipal).User_Id;
                    if (Request.QueryString["strExamRoomInfo_Id"] != null || Request.QueryString["strThiSinh_Id"] != null)
                    {
                        strExamRoomInfo_Id = Request.QueryString["strExamRoomInfo_Id"].ToString();
                        strStudentExamroom_Id = Request.QueryString["strStudentExamroom_Id"].ToString();
                        strThiSinh_Id_URL = Request.QueryString["strThiSinh_Id"].ToString();
                    }
                    if (strThiSinh_Id_URL != strThiSinh_Id)
                        Response.Redirect("../../../../logout.aspx");
                    string strMacAddress = Apis.CommonV1.Base.Utility.GetMACAddress();
                    string strIpAddress = Apis.CommonV1.Base.Utility.GetIpAddress();
                    string userip = Request.UserHostAddress;
                    string strComputerName = Apis.CommonV1.Base.Utility.GetIpAddress() + " : " + strMacAddress;
                    if (Request.UserHostAddress != null)
                    {
                        Int64 macinfo = new Int64();
                        string macSrc = macinfo.ToString("X");
                        if (macSrc == "0")
                        {
                            if (userip == "127.0.0.1")
                            {
                                strIpAddress = "Localhost!";
                            }
                            else
                            {
                                strIpAddress = userip;
                            }
                        }
                    }

                    string strErr = TTN_HamDungChungBO.Them_StudentAudit(strExamRoomInfo_Id, strThiSinh_Id, strMacAddress, strIpAddress, strComputerName);

                    //}
                }

                var objUser = new
                {
                    rootPath = AppSetting.GetString("RootPath"),
                    rootPathUpload = AppSetting.GetString("RootPathUpload"),
                    //rootPathReport = report,
                    //appId = app_id,
                    //avatar = avatar,
                    userId = user_id,
                    tokenJWT = tokenjwt
                };
                lblXYZCLRVN = XOR.encrypt(JsonConvert.SerializeObject(objUser), "AzzS");
                //myTextBox.Value = XOR.encrypt(JsonConvert.SerializeObject(objUser), "AzzS");


            }
            catch (Exception ex)
            {
                Logger.WriteLog("lambaithi.aspx:" + ex.Message);

                Response.Redirect("../../../../logout.aspx");

            }
        }
        private void makeLogs(string strHoatDong, string strUserId, string strChucNang_Id, string strMoTa)
        {
            try
            {

                var obj = new LuuCacThongTinHoatDongEntity();
                obj.strNguoiDung_Id = strUserId;
                obj.strHoatDong = strHoatDong;
                obj.strDiaChiMayTramTruyCap = Request.UserHostAddress;
                obj.strTrinhDuyetSuDungTruyCap = WebUser.GetPost("userbrower", string.Empty);
                obj.strTenThietBi = WebUser.GetPost("userdevice", string.Empty);
                obj.strTaiKhoanDangNhap = fullname;
                obj.strMoTa = strMoTa + " : " + Apis.CommonV1.Base.Utility.GetIpAddress();
                obj.strChucNang_Id = "LAMBAITHI";
                obj.strUngDung_Id = "THITRACNGHIEM";
                var strId = "";
                LuuCacThongTinHoatDongBo.LuuCacThongTinHoatDong(obj, ref strId);
            }
            catch (Exception ex)
            {

            }
        }
    }
}