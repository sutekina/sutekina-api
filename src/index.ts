import { application } from "../config.json";
import SutekinaApi from "./classes/SutekinaApi";

const app = new SutekinaApi(application.port, application.name);

