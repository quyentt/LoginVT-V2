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
    public partial class lambaithi_temp : System.Web.UI.Page
    {
        public string fullname = "";
        public string language_id = "";
        public string user_id = "";
        public string tokenjwt = "";
        public string app_id = "";
        public string avatar = "";
        public string report = "";
        public   string strThiSinh_Id = "";
        public   string strStudentExamroom_Id = "";
        public   string strExamRoomInfo_Id = "";
        public string lblXYZCLRVN = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!HttpContext.Current.User.Identity.IsAuthenticated)
                {
                    //if (string.IsNullOrEmpty(AppSetting.GetString("USER"))) Response.Redirect("login.aspx");
                    //else
                    //{
                    //    user_id = AppSetting.GetString("USER");
                    //    tokenjwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjQwMzhFNkZEMEZGQTREMzM5RkE5OTFFNzQwMzQ4RjAxOzIyNTQ0YjNmNGFjMDQzOGU4YTYwZTM2MWQyMjgxM2VmOzIwMjIwODA0MjExODU2IiwibmJmIjoxNjU5NjIyNzM2LCJleHAiOjE2NjIzMDExMzYsImlhdCI6MTY1OTYyMjczNiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QifQ.zxyFJbDWv9syAsz_FZCBaipOErgOuKfaowcUN797BXU";
                    //}

                    //Session["strExamRoomInfo_Id"] = null;
                    //Session["strStudentExamroom_Id"] = null;
                    Response.Redirect("../../../../logout.aspx");
                }
                else
                {
                    //if (Session["user_id"] == null)
                    //    Session["user_id"] = (HttpContext.Current.User as CustomPrincipal).User_Id;

                    fullname = (HttpContext.Current.User as CustomPrincipal).Fullname;

                    language_id = (HttpContext.Current.User as CustomPrincipal).Language_Id;
                    user_id = (HttpContext.Current.User as CustomPrincipal).User_Id;
                    tokenjwt = (HttpContext.Current.User as CustomPrincipal).Token;
                    avatar = (HttpContext.Current.User as CustomPrincipal).Avatar;
                    avatar = avatar.Replace("\\", "/");
                    //if (Session["user_id"].ToString() != user_id)
                    //    Response.Redirect("login.aspx");

                }
                strThiSinh_Id = user_id;
                //user_id = XOR.encrypt(user_id);
                string strMoTa = "strThiSinh_Id "+ strThiSinh_Id;
                makeLogs("ELAMBAITHI", user_id, "ELAMBAITHI", strMoTa);
              
                if (!Page.IsPostBack)
                {
                      
                    if (Request.QueryString["strExamRoomInfo_Id"] != null || Request.QueryString["strThiSinh_Id"] != null)
                    {
                        strExamRoomInfo_Id = Request.QueryString["strExamRoomInfo_Id"].ToString();
                        strThiSinh_Id = (HttpContext.Current.User as CustomPrincipal).User_Id;
                        strStudentExamroom_Id = Request.QueryString["strStudentExamroom_Id"].ToString();
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

                    }
                    else
                    {
                        Response.Redirect("../../../../logout.aspx");
                    }



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