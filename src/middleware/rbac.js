import { constants } from "node:http2";

export default function authorize(role) {
    return (req, res, next) => {
        if (res.locals.role !== role) {
            return res.status(constants.HTTP_STATUS_FORBIDDEN).json({
                success: false,
                message:
                    "Access denied: you do not have permission to access this resource",
            });
        }
       next();
    };
}
