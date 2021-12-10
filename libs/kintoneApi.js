const axios = require("axios");

class kintoneApi {
  constructor(kintoneInfo) {
    this.preUrl = kintoneInfo.domain;
    if (kintoneInfo.hasOwnProperty("apiToken")) {
      this.apiToken = kintoneInfo.apiToken;
    } else {
      let auth = Buffer.from(kintoneInfo.username + ":" + kintoneInfo.password);
      this.authbase64 = auth.toString("base64");
    }
  }

  setRequestInfo(url, params, type) {
    let headers;
    if (this.apiToken) {
      headers = {
        "X-Cybozu-API-Token": this.apiToken,
      };
    } else {
      headers = {
        "X-Cybozu-Authorization": this.authbase64,
      };
    }
    let options = {
      method: type,
      baseURL: this.preUrl,
      url: url,
      headers: headers,
    };
    if (type == "GET") {
      options.params = params;
    } else {
      options.data = params;
      options.headers["Content-Type"] = "application/json";
    }
    return options;
  }

  getPortalCustomSetting() {
    const url = "/k/api/js/getSystemSetting.json";
    return axios(this.setRequestInfo(url, {}, "POST"));
  }

  updatePortalCustomSetting(params) {
    const url = "/k/api/js/updateSystemSetting.json";
    return axios(this.setRequestInfo(url, params, "POST"));
  }
}
module.exports = kintoneApi;
