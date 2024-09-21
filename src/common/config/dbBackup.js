// const backupCommand =
//   '"C:\\Program Files\\MongoDB\\Tools\\100\\bin\\mongodump" --db project-template --out "C:\\Users\\iRoid\\Desktop\\test3"';
import { exec } from "child_process";
import "dotenv/config";
import moment from "moment";

const backupCommand = `mongodump --uri=${
  process.env.DB_CONNECTION
} --out="C:/my-projects-database-backup/${moment().format(
  "YYYY-MM-DD"
)}-harage-refurbished-ecommerce"`;

const dbBackup = () => { 
  try {
    console.log("in");
    if (process.env.IS_DB_BACKUP === "true") {
      console.log("In DB Backup");
      exec(backupCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Backup failed:", error);
          return;
        }
        console.log("Backup completed successfully");
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default dbBackup;
