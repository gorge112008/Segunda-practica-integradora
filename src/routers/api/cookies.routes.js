import AppRouter from "../router.js";
import cookiesController from "../../controllers/cookiesController.js";

export default class CookiesRouter extends AppRouter {
  constructor() {
    super();
    this.init();
  }
  init() {
    /*****************************************************************GET*************************************************************/
    this.getData("/getUserCookie", ["PUBLIC"], cookiesController.getUserCookie);
    this.getData("/getTokenCookie", ["PUBLIC"], cookiesController.getTokenCookie);
    this.getData("/getSessionCookie", ["PUBLIC"], cookiesController.getSessionCookie);

    /*****************************************************************POST*************************************************************/
    this.postData("/setUserCookie", ["USER"], cookiesController.setUserCookie);

    /*****************************************************************DELETE*************************************************************/
    this.deleteData("/delCookie", ["USER"], cookiesController.delCookie);
  }
}
