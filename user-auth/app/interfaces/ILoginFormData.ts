import IFormData from "./IFormData";

export default interface ILoginFormData extends IFormData {
    username: string;
    passwordHash: string;
}