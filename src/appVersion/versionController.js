import AppVersion from "../../model/appVersion";
import { NotFoundException } from "../common/exceptions/errorException";



class AppVersionController {

    /**
     * Force update (both app)
     * @param {*} req 
     * @param {*} res 
     */
    static async checkUpdate(req, res) {
        const { platform, version, role } = req.body;

        const appVersion = await AppVersion.findOne({
            platform: platform,
            role: role,
        });

        if (!appVersion) {
            throw new NotFoundException("Invalid platform");
        }
        let message = {
            message: "Your app is up to date.",
            status: 0,
            appLink: appVersion.appLink,
        };
        if (version < appVersion.minVersion) {
            message = {
                message:
                    "Your app is outdated, please update to the latest version of the app.",
                status: 1,
                appLink: appVersion.appLink,
            };
        } else if (
            version >= appVersion.minVersion &&
            version < appVersion.latestVersion
        ) {
            message = {
                message:
                    "You are not using the latest version of the app, please update to the latest version of the app.",
                status: 2,
                appLink: appVersion.appLink,
            };
        }
        return res.send(message);
    }
}


export default AppVersionController;