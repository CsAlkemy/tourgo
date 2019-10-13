import {Email, Enum, Property, PropertyType, Status} from "@tsed/common";
import {Indexed, Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {UserType} from "../config/Config";


@Model({
	collection: "user",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class User {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	company: string;

	@Property()
	firstName: string;

	@Property()
	lastName: string;

	@Property()
	password: string;

	@Indexed(true)
	@Email()
	email: string;

	@Enum(UserType)
	userType : UserType;

	@PropertyType(Boolean)
	isAdmin: boolean;





}