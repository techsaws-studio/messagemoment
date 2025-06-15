import TimerChangeModel from "models/timer-change-model.js";
import MessageModel from "../models/message-model.js";
import SessionModel from "../models/session-model.js";

export const FetchSessionMessagesService = async (
  sessionId: string,
  limit = 50,
  skipExpired = false
): Promise<any[]> => {
  try {
    const session = await SessionModel.findOne(
      { sessionId },
      {
        isProjectModeOn: 1,
        projectModeEnabledAt: 1,
        projectModeDisabledAt: 1,
        messageClearHistory: 1,
      }
    );

    if (!session) {
      console.error(`Session not found for sessionId: ${sessionId}`);
      return [];
    }

    let latestClearTimestamp = 0;
    if (session.messageClearHistory && session.messageClearHistory.length > 0) {
      latestClearTimestamp = Math.max(
        ...session.messageClearHistory.map((clear) => clear.clearedAt)
      );
    }

    if (session.projectModeEnabledAt) {
      latestClearTimestamp = Math.max(
        latestClearTimestamp,
        session.projectModeEnabledAt
      );
    }

    const query: any = { sessionId };

    if (latestClearTimestamp > 0) {
      query.timestamp = { $gt: latestClearTimestamp };
    }

    query.$or = [
      { isPermanent: true },

      ...(session.projectModeEnabledAt
        ? [
            {
              $and: [
                { timestamp: { $gte: session.projectModeEnabledAt } },
                ...(session.projectModeDisabledAt
                  ? [{ timestamp: { $lt: session.projectModeDisabledAt } }]
                  : []),
                ...(latestClearTimestamp > 0
                  ? [{ timestamp: { $gt: latestClearTimestamp } }]
                  : []),
              ],
            },
          ]
        : []),

      ...(session.projectModeDisabledAt && !session.isProjectModeOn
        ? [
            {
              $and: [
                { timestamp: { $gte: session.projectModeDisabledAt } },
                ...(skipExpired
                  ? [{ displayExpiresAt: { $gt: new Date() } }]
                  : []),
                ...(latestClearTimestamp > 0
                  ? [{ timestamp: { $gt: latestClearTimestamp } }]
                  : []),
              ],
            },
          ]
        : []),

      ...(!session.projectModeEnabledAt && !session.isProjectModeOn
        ? [
            ...(skipExpired
              ? [{ displayExpiresAt: { $gt: new Date() } }]
              : [{ displayExpiresAt: null }]),
          ]
        : []),
    ];

    if (latestClearTimestamp > 0) {
      query.$or.push({
        $and: [
          { timestamp: { $lt: latestClearTimestamp } },
          { isSystemMessage: true },
        ],
      });
    }

    console.log(`Query for fetching messages:`, JSON.stringify(query, null, 2));

    const messages = await MessageModel.find(query)
      .sort({ timestamp: 1 })
      .limit(limit)
      .lean();

    if (messages.length === 0) {
      return [];
    }

    const timerChanges = await TimerChangeModel.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    const messagesWithTimerInfo = messages.map((message) => {
      let messageTimerValue = session.sessionTimer;

      if (timerChanges.length > 0) {
        const applicableChanges = timerChanges.filter(
          (change) => change.timestamp < message.timestamp
        );

        if (applicableChanges.length > 0) {
          const lastChange = applicableChanges[applicableChanges.length - 1];
          messageTimerValue = lastChange.newTimerValue;
        } else {
          messageTimerValue =
            timerChanges.length > 0
              ? timerChanges[0].previousTimerValue
              : session.sessionTimer;
        }
      }

      return {
        ...message,
        timerValue: messageTimerValue,
      };
    });

    console.info(
      `Fetched ${messagesWithTimerInfo.length} messages for session ${sessionId} with individual timer values assigned`
    );

    return messagesWithTimerInfo;
  } catch (error) {
    console.error(`Error fetching messages for session ${sessionId}:`, error);
    return [];
  }
};
