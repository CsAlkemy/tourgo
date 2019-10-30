import {BodyParams, Controller, Get, Post, Req, Res, Session, Status, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotEmployee, ifNotLoggedIn, } from "../../middlewares/SessionCheck";


@Controller("/")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotEmployee)
export class Dashboard extends BaseController {
	constructor( private  mongo: Mongo){
		super (mongo);
		this.config.view="employee/";
	}


	@Get("/dashboard")
	async test(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {
		this.config.render=("index");
		await this.render(req,res)
	}
}