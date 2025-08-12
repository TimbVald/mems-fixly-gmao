import { createAccessControl } from "better-auth/plugins/access";
 
const statement = {
    project: ["create", "share", "update", "delete"],
} as const;
 
const ac = createAccessControl(statement);
 
const PERSONNEL = ac.newRole({ 
    project: ["create"], 
}); 
 
const TECHNICIEN = ac.newRole({ 
    project: ["create", "update"], 
}); 
 
const ADMIN = ac.newRole({ 
    project: ["create", "update", "delete"], 
}); 

export {ac, PERSONNEL, TECHNICIEN, ADMIN, statement}