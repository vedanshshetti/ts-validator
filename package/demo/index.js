// Quick Note: You can run this demo script using "tsx", just run "npm i -g tsx", then "tsx package/demo/index.js"

import { tsv } from "@typescript-utils/schema-validator";

const UserSch = tsv.defineSchema("User", {
    name: "string",
    age: "number"
}, "english");
console.log("Demonstrating with User schema: ");
console.log(UserSch);
console.log("Demo #1: This input should be VALID");
console.log(UserSch.validate({
    name: "Vedansh",
    age: 12
}));
console.log("Demo #2: This input should NOT be valid, with english error message");
console.log(UserSch.validate({
    "name": "Vedansh",
    "age": "12"
}));