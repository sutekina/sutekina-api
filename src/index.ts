import { application } from "../config.json";
import SutekinaApi from "./classes/SutekinaApi";
import Handler from "./util/handler/Handler";
import request from "./util/middleware/request";
import banchoRoute from "./routes/v1";
import sutekinaRoute from "./routes/v2";

new SutekinaApi(application.port, application.name).ping();

const app = SutekinaApi.getApp();

try {
    app.use(request);
    app.get("/", (req, res, next) => res.status(200).json({"message":`${application.name} // ${application.version}`, "code":200}));
    app.use("/v1", banchoRoute);
    app.use("/v2", sutekinaRoute);
} catch(err) {
    err.level = err.level || "error";
    app.use((req, res, next) => next(err));
}

app.use((req, res, next) => next({message: "Not found", level:"debug", code:404}));

app.use(new Handler().Error);