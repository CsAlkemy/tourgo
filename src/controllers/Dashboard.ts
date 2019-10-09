import {BodyParams, Controller, Get, Post, Req, Res, Session, Status} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {User} from "../models/User";


@Controller("/")
export class Dashboard extends BaseController{


	@Get("/test")
	async test (@Session('user') user: any){
	}


}