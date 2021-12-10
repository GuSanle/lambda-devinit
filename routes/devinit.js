var express = require("express");
var router = express.Router();
const kintoneApi = require("../libs/kintoneApi");
const settings = [
  "https://dev-center-store.oss-cn-shanghai.aliyuncs.com/devinit-code/kintone_dc_app.js",
  "https://dev-center-store.oss-cn-shanghai.aliyuncs.com/devinit-code/kintone_dc_commons.js",
];

router.post("/devinit", async (req, res, next) => {
  const setting = {
    jsFiles: [
      {
        jsType: "DESKTOP",
        fileKeys: settings,
      },
    ],
    jsScope: "ALL",
  };
  const { Url, Userid, Userpw } = req.body.record;
  const kintoneInfo = {
    domain: Url.value,
    username: Userid.value,
    password: Userpw.value,
  };

  let kintoneObj = new kintoneApi(kintoneInfo);
  const portalSetting = await kintoneObj.getPortalCustomSetting();
  let logMsg = {
    tag: "kintone setting",
    dateTime: new Date(),
    level: "normal",
    domain: kintoneInfo.domain,
    info: "",
  };

  const { executable, configurable, scripts } = portalSetting.data.result;
  if (scripts.length === 0) {
    try {
      await kintoneObj.updatePortalCustomSetting(setting);
      logMsg.level = "ok";
      logMsg.info = "设置成功";
      console.log(JSON.stringify(logMsg));
      res.send("ok");
    } catch {
      logMsg.level = "error";
      logMsg.info = "设置失败";
      console.log(JSON.stringify(logMsg));
      res.send("failed");
    }
  } else {
    logMsg.info = "已经存在设置";
    console.log(JSON.stringify(logMsg));
    res.send("pass");
  }
});

module.exports = router;
