import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/utils/enum";

// Roles Method Decorator
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);