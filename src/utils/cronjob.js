import cron from "node-cron";
import { subDays, startOfDay, endOfDay } from "date-fns";
import ConnectionRequest from "../models/connectionRequest.js";
import * as sendEmail from "./sendEmail.js";

cron.schedule("14 18 * * *", async () => {
  // console.log(new Date().toISOString());

  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd },
    }).populate("fromUserId toUserId");

    const sentEmails = new Set();

    for (const request of pendingRequests) {
      const toUser = request.toUserId;

      if (sentEmails.has(toUser.email)) continue;
      sentEmails.add(toUser.email);

      try {
        const emailRes = await sendEmail.run({
          type: "reminder",
          toAddress: toUser.email,
          recipientName: toUser.firstName,
        });
        console.log("Reminder sent to ", toUser.email, emailRes);
      } catch (error) {
        console.error("Error sending reminder to ", toUser.email, error);
      }
    }
  } catch (error) {
    console.error("Error in cron job: ", error);
  }
});
