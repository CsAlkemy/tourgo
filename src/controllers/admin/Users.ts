import {Controller, Get, Req, Res, Session, UseBefore} from "@tsed/common";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";

@Controller("/")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class Dashboard extends BaseController {
	constructor( private  mongo: Mongo){
		super (mongo);
		this.config.view="admin";
	}



	@Get("/addCompany")
	async addEmployee(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {
		this.config.render=("addCompany");
		await this.render(req,res)
	}
	@Get("/employee")
	async EmployeeList(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {
		this.config.render=("employee");
		await this.render(req,res)
	}
}
