import {IMiddleware, Middleware, Req, Res, Session} from "@tsed/common";
import {$SESSION, Data} from "../config/SessionData";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {UserType} from "../config/Config";

var session: Data = null;

@Middleware()
export class SESSION implements IMiddleware {
	private static mongoose: Mongo;

	constructor(private mongo: Mongo) {
		SESSION.mongoose = mongo;
	}

	use(@Req() req: Req) {
		if (req.session.user) {
			session = req.session.user;
		}
		return session;
	}


	public static async get(): Promise<$SESSION> {
		if (session) {

			let user: User = await this.mongoose.UserService.findById(session.user).exec();
			return {
				data: session,
				user: user,
			};
		}
		return new $SESSION();
	}
}


@Middleware()
export class ifLoggedIn implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isAdmin) {
				return res.redirect("/admin/dashboard");
			} else {
				return res.redirect("/partner/dashboard");
			}
		}
	}
}

@Middleware()
export class ifNotLoggedIn implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (!user) {
			return res.redirect("/login");
		}
	}
}


//* Use in user controller

@Middleware()
export class ifNotUser implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isAdmin) {
				req.session.noSystemAccess = true;
				return res.redirect("/login");
			}
		} else {
			req.session.oldRequest = req.originalUrl;
			req.session.notLoggedIn = true;
			return res.redirect("/apply");
		}
	}
}


// * Use in system controller

@Middleware()
export class ifNotSystem implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (!user.isAdmin) {
				req.session.noUserAccess = true;
				return res.redirect("/partner/dashboard");
			}
		} else {
			req.session.oldRequest = req.originalUrl;
			req.session.notLoggedIn = true;
			return res.redirect("/login");
		}
	}
}