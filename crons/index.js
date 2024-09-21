import cron from "node-cron";
import dbBackup from "../src/common/config/dbBackup";

cron.schedule("0 0 * * *", async () => {
  console.log("run cron job for everyday");
  dbBackup();
});
