export const UpdateSessionParticipantsService = async (
  session: any,
  participant: any
) => {
  session.participants.push({
    userId: participant.userId,
    username: participant.username,
    assignedColor: participant.assignedColor,
    joinedAt: new Date(),
  });

  session.participantCount += 1;
  await session.save();
};
