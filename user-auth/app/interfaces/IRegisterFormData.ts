import IFormData from "./IFormData";

export default interface IRegisterFormData extends IFormData {
    username: string;
    passwordHash: string;
    email: string;
}