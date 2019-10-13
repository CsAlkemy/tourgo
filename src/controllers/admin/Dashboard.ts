import {BodyParams, Controller, Get, Post, Req, Res, Session, Status} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {User} from "../../models/User";
import {Mongo} from "../../services/Mongo";


@Controller("/")
export class Dashboard extends BaseController {
	constructor( private  mongo: Mongo){
	super (mongo);
	this.config.view="admin/";
	}


	@Get("/dashboard")
	async test(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {
		this.config.render=("index");
		await this.render(req,res)
	}
}
