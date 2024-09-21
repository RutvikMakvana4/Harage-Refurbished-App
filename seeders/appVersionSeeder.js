import AppVersion from "../model/appVersion";
import { ROLE } from "../src/common/constants/constants"

const data = [
    {
        minVersion: "1.0.0",
        latestVersion: "1.0.0",
        appLink: "",
        platform: "Android",
        role: ROLE.CUSTOMER
    },
    {
        minVersion: "1.0.0",
        latestVersion: "1.0.0",
        appLink: "",
        platform: "iOS",
        role: ROLE.CUSTOMER
    },
    {
        minVersion: "1.0.0",
        latestVersion: "1.0.0",
        appLink: "",
        platform: "Android",
        role: ROLE.SUPERADMIN
    },
    {
        minVersion: "1.0.0",
        latestVersion: "1.0.0",
        appLink: "",
        platform: "iOS",
        role: ROLE.SUPERADMIN
    },
]


// App version (Force update)

async function appVersionSeeder() {
    const version = await AppVersion.estimatedDocumentCount();

    if (!version) {
        await AppVersion.create(data);
        console.log("App version seeded");
    }
}


appVersionSeeder()