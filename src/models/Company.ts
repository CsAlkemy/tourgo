import {Default, Email, Enum, Property, PropertyType, Status} from "@tsed/common";
import {Indexed, Model, ObjectID, Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {UserType} from "../config/Config";
import {FileProperty} from "../schema/FileProperty";
import {User} from "./User";


@Model({
	collection: "company",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class Company {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@Property()
	owner: string;

	@Property()
	phone: string;

	@Property()
	address: string;

	@Property()
	PropertyType: string;

	@Property()
	Area: string;

	@Property()
	country: string;

	@Property()
	password: string;

	@Indexed(true)
	@Email()
	email: string;

	@PropertyType(FileProperty)
	logo: FileProperty;

	@Enum(UserType)
	userType : UserType;

	@PropertyType(Boolean)
	isAdmin: boolean;

	@Indexed(true)
	@Ref(User)
	@PropertyType(Types.ObjectId)
	addedBy: Ref<User>;

	@PropertyType(Object)
	updateHistory: object;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;






}