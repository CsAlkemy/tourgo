import {Controller, Get, Post, Req, Res} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";

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

    @Get("/admin-login")
    @Post("/admin-login")
    async login(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {email, password} = req.body;
            let user = await this.mongo.UserService.findOne({
                email: email,
                password: password
            });
            if (user) {
                if (user.flag === true) {
                    if (user.designation === "doctor") {
						return res.redirect("/doctor");
                    }
                }
            } else {
                this.config.render = "";
                await this.render(req, res);
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
            let {name, email, password, designation} = req.body;
            let user = new User();
            user.name = name;
            user.email = email;
            user.password = password;
            user.designation = designation;
            user.flag = false;
            let data = new this.mongo.UserService(user);
            await data.save();
			let notification: Notification = {
				message: "You have successfully registered",
				type: NotificationType.SUCCESS,
				title: "Sign-up success"
			};
			this.config.notification.push(notification);
			return res.redirect("/login");
        } else {
            this.config.render = "apply";
            await this.render(req, res);
        }
    }
}