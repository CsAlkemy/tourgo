import {Controller, Get, Post, Req, Res, Session, Use, UseAfter, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";
import {Data} from "../config/SessionData";
import {UserType} from "../config/Config";
import {ifLoggedIn, ifNotLoggedIn, ifNotSystem, ifNotUser} from "../middlewares/SessionCheck";

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
	@Get("/login")
	@Post("/login")
	@UseBefore(ifLoggedIn)
	async login(@Res() res: Res, @Req() req: Req, @Session("user") session: any) {
		if (req.method == 'POST') {
			let {email, password} = req.body;
			let User: User = await this.mongo.UserService.findOne({
				email: email,
			});

			if (User) {
				if (bcrypt.compareSync(password, User.password)) {
					let data = new Data();
					data.userType = User.userType;
					data.user = User;
					data.isAdmin = User.isAdmin;
					req.session.user = data;
					let user = await this.mongo.UserService.findById(User._id);
					data.ip = req.connection.remoteAddress;
					await user.save();
					let notification: Notification = {
						message: "Login as" + User.firstName + ' ' + User.lastName + "  @" + Date() + "  from" + req.connection.remoteAddress,
						type: NotificationType.SUCCESS,
						title: "login success!"
					};
					this.config.notification.push(notification);
					if (req.session.oldRequest) {
						let url = req.session.oldRequest;
						delete req.session.oldRequest;
						return res.redirect(url);

					}
					if (User.userType === UserType.ADMIN) {
						return res.redirect("/admin/dashboard");
					} else {
						return res.redirect("/partner/dashboard");
					}
				} else {
					let notification: Notification = {
						message: "Username and password does not match!",
						type: NotificationType.WARNING,
						title: "Login Failed!"
					};
					this.config.notification.push(notification);
					return res.redirect("/login");
				}

			} else {
				let notification: Notification = {
					message: "Username does not registered!",
					type: NotificationType.WARNING,
					title: "Login Failed!"
				};
				this.config.notification.push(notification);
				return res.redirect("/login");
			}

		} else {
			this.config.render = ("login");
			await this.render(req, res);
		}
	}


	@Get("/logout")
	@UseBefore(ifNotLoggedIn)
	logout(@Req() req: Req, @Res() res: Res) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err);
			}
		});
		let notification: Notification = {
			message: "You have successfully sign out",
			type: NotificationType.SUCCESS,
			title: "Logout Success!"
		};
		this.config.notification = new Array<Notification>();
		this.config.notification.push(notification);
		return res.redirect('/login');
	}

	@Get("/admin-apply")
	@Post("/admin-apply")
	@UseBefore(ifLoggedIn)
	async apply(@Res() res: Res, @Req() req: Req) {
		if (req.method == 'POST') {
			let {company, firstName, lastName, email, password} = req.body;
			let user = new User();
			user.company = company;
			user.firstName = firstName;
			user.isAdmin = false;
			user.lastName = lastName;
			user.email = email;
			user.password = bcrypt.hashSync(password, 12);
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
