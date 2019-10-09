import {Email, Enum, Property, PropertyType, Status} from "@tsed/common";
import {Indexed, Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";


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

	@PropertyType(Boolean)
	flag: boolean;


}