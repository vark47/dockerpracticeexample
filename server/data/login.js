

exports.loginText = function (site, lang) {
    // Set language to en and site to cis if no settings exist for the requested resource
    lang = defaultText.find(x => x.lang == lang) ? lang : 'en';
    site = siteText.find(x => x.site == site) ? site : 'cis';
    return Object.assign({}, defaultText.find(x=>x.lang==lang), siteText.find(x=>x.lang==lang && x.site == site))

}

var defaultText = [
    {
        "lang": "en",
        "title": "CIS",
        "subtitle": "The Personal Learning Plan is a tool that can help you set goals and make plans.",
        "login_heading": "Login to CIS",
        "login_info_text": "Use your CIS username and password to login.",
        "forgot_uname_link": "Forgot your username or password?",
        "login_btn_text": "Login",
        "logout_success_msg": "Successfully logged out",
        "login_sessexpire_msg": "Your session has expired",
        "psw_rec_heading": "Password Recovery",
        "psw_rec_inp_info_text": "To reset your password, enter your username below.",
        "psw_rec_submit": "Submit",
        "psw_rec_frgt_btn": "Forgot Username",
        "psw_rec_help_text": "If you need help, please see your site administrator or contact technical support.",
        "user_rec_heading": "Username Recovery",
        "user_rec_inp_info_text": "If you entered your e-mail address when you created your account, you can have your username e-mailed to that address.",
        "user_rec_btn": "E-mail Username",
        "user_rec_inp_help_text": "If you need help or have questions, please see your teacher, counselor or advisor to get a temporary password. The temporary passwords are set in your school's MCIS site administration database.",
        "login_footer_image": "https://images.intocareers.org/clever/CIS.svg",
        "login_footer_title": "Career Information System",
        "login_footer_subtitle": "1971-2016 University of Oregon. All rights reserved. Created by intoCareers, a unit of the University of Oregon."
    },
    {
        "lang": "bi",
        "title": "个人学习计划",
        "subtitle": "个人学习计划是一个可以帮助您设定目标和制定计划的工具。",
        "login_heading": "登录PLP",
        "login_info_text": "使用您的CIS用户名和密码进行登录。",
        "forgot_uname_link": "忘记用户名或密码？",
        "login_btn_text": "登录",
        "logout_success_msg": "成功注销",
        "login_sessexpire_msg": "您的会话已过期",
        "psw_rec_heading": "找回密码",
        "psw_rec_inp_info_text": "要重置密码，请在下面输入您的用户名。",
        "psw_rec_submit": "提交",
        "psw_rec_frgt_btn": "忘了用户名了吗",
        "psw_rec_help_text": "如果您需要帮助，请访问您的网站管理员或联系技术支持",
        "user_rec_heading": "用户名恢复",
        "user_rec_inp_info_text": "如果您在创建帐户时输入了电子邮件地址，可以将用户名通过电子邮件发送到该地址。",
        "user_rec_btn": "电子邮件用户名",
        "user_rec_inp_help_text": "如果您需要帮助或有疑问，请与您的老师，顾问或顾问联系以获取临时密码。临时密码在学校的MCIS网站管理数据库中设置",
        "login_footer_image": "https://images.intocareers.org/clever/CIS.svg",
        "login_footer_title": "明尼苏达职业信息系统",
        "login_footer_subtitle": "1971-2016俄勒冈大学。版权所有。由职业生涯创建，俄勒冈大学的一个单位。"
    },
    {
        "lang": "es",
        "title": "个人学习计划",
        "subtitle": "个人学习计划是一个可以帮助您设定目标和制定计划的工具。",
        "login_heading": "登录PLP",
        "login_info_text": "使用您的MCIS用户名和密码进行登录。",
        "forgot_uname_link": "忘记用户名或密码？",
        "login_btn_text": "登录",
        "logout_success_msg": "成功注销",
        "login_sessexpire_msg": "您的会话已过期",
        "psw_rec_heading": "找回密码",
        "psw_rec_inp_info_text": "要重置密码，请在下面输入您的用户名。",
        "psw_rec_submit": "提交",
        "psw_rec_frgt_btn": "忘了用户名了吗",
        "psw_rec_help_text": "如果您需要帮助，请访问您的网站管理员或联系技术支持",
        "user_rec_heading": "用户名恢复",
        "user_rec_inp_info_text": "如果您在创建帐户时输入了电子邮件地址，可以将用户名通过电子邮件发送到该地址。",
        "user_rec_btn": "电子邮件用户名",
        "user_rec_inp_help_text": "如果您需要帮助或有疑问，请与您的老师，顾问或顾问联系以获取临时密码。临时密码在学校的MCIS网站管理数据库中设置",
        "login_footer_image": "https://images.intocareers.org/clever/CIS.svg",
        "login_footer_title": "明尼苏达职业信息系统",
        "login_footer_subtitle": "1971-2016俄勒冈大学。版权所有。由职业生涯创建，俄勒冈大学的一个单位。"
    }
];




var siteText = [
    {
        "lang": "en",
        "site": "mncis",
        "login_heading": "Login to MCIS",
        "login_info_text": "Use your MCIS username and password to login.",
        "login_footer_image": "https://images.intocareers.org/clever/MNCIS.svg",
        "login_footer_title": "Minnesota Career Information System",
    },
    {
        "lang": "es",
        "site": "mncis",
        "login_heading": "Login a MCIS",
        "login_info_text": "Utilice su nombre de usuario y contraseña de MCIS para iniciar sesión.",
        "login_footer_image": "https://images.intocareers.org/clever/MNCIS.svg",
        "login_footer_title": "Minnesota Career Information System",
    },
    {
        "lang": "bi",
        "site": "mncis",
        "login_footer_image": "https://images.intocareers.org/clever/MNCIS.svg",
        "login_footer_title": "Minnesota Career Information System",
    },
    {
        "lang": "en",
        "site": "sinocis",
        "login_heading": "Login to SinoCIS",
        "login_info_text": "Use your SinoCIS username and password to login.",
        "login_footer_title": "SINO Career Information System",
    },
    {
        "lang": "bi",
        "site": "sinocis",
        "login_info_text": "使用您的SinoCIS用户名和密码进行登录。",
        "login_footer_title": "SINO Career Information System",
    },
    {
        "lang": "es",
        "site": "sinocis",
        "login_heading": "Login a MCIS",
        "login_info_text": "Utilice su nombre de usuario y contraseña de MCIS para iniciar sesión.",
        "login_footer_title": "SINO Career Information System",
    }
];