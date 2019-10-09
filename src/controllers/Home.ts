import {Controller, Get, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";

const bcrypt = require("bcrypt");

@Controller("/")
export class Home extends BaseController {
    constructor(private mongo: Mongo) {
        super(mongo);
        this.config.view = "home";
    }

    @Get("/")
    async index(@Res() res: Res, @Req() req: Req) {
        this.config.render = "index";
        await this.render(req, res);
    }
    @Get("/")
    @Get("/admin-login")
    @Post("/admin-login")
    async login(@Res() res: Res, @Req() req: Req, @Session("user") session:any) {
        if (req.method == 'POST') {
            let {email, password} = req.body;
            let User:User = await this.mongo.UserService.findOne({
                email: email,
            });

            if(User){
                if(await bcrypt.compareSync(password, User.password)){
                    session=User;

                    this.config.render="index";
                    await this.render(req,res);
                    console.log(session);
                }else {
                    this.config.render="apply";
                    await this.render(req,res);

                }
            } else{
                console.log("not user");
            }

        } else {
            this.config.render = "login";
            await this.render(req, res);
        }
    }

    @Get("/admin-apply")
    @Post("/admin-apply")
    async apply(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {company,firstName, lastName, email, password} = req.body;
            let user = new User();
            user.company = company;
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = bcrypt.hashSync(password, 12);
            user.flag = false;
            let data = new this.mongo.UserService(user);
            await data.save();
			let notification: Notification = {
				message: "You have successfully registered",
				type: NotificationType.SUCCESS,
				title: "Sign-up success"
			};
			this.config.notification.push(notification);
			return res.redirect("/admin-login");
        } else {
            this.config.render = "apply";
            await this.render(req, res);
        }
    }
}