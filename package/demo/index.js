import { tsv } from "../src/";
const UserSch = tsv.defineSchema("User", {
    name: "string",
    age: "number"
});
console.log("Demonstrating with User schema: ");
console.log(UserSch);
console.log("Demo #1: This input should be VALID");
console.log(UserSch.validate({
    name: "Vedansh",
    age: 12
}));
console.log("Demo #2: This input should NOT be valid");
console.log(UserSch.validate({
    "name": "Vedansh",
    "age": "12"
}));