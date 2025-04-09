import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CURRENT_USER_KEY } from "../../utils/constants";
import { JwtPayloadType } from "../../utils/types";

export const CurrentUser = createParamDecorator(
  (data , context : ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload : JwtPayloadType = request[CURRENT_USER_KEY];
    return payload;
  }
)