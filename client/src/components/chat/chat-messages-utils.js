import { messageType } from "@/dummy-data";

export const getMessageClass = (type) => {
  switch (type) {
    case messageType.ATTACHMENT_MESSAGE:
      return "msg-attachment";
    case messageType.PROJECT_MODE:
    case messageType.PROJECT_MODE_ENTRY:
    case messageType.ASK_TO_SET_EXPIRYTIME:
    case messageType.SECURITY_CODE:
    case messageType.PHANTOM_WALLET:
      return "msg-security-code";
    case messageType.EXPIRY_TIME_HAS_SET:
      return "expirty-time-set";
    case messageType.MM_ALERT:
      return "msg-success";
    case messageType.MM_ERROR_MSG:
      return "msg-error";
    case messageType.DEFAULT:
    case messageType.AI_RESEARCH_COMPANION_INPUT:
      return "msg-default";
    case messageType.MM_NOTIFICATION:
    case messageType.AI_RESEARCH_COMPANION_RESPONSE:
    case messageType.MM_NOTIFICATION_REMOVE_USER:
      return "msg-noti";
    case messageType.ADVERTISEMENT:
      return "msg-ads";
    case messageType.MESSAGE_MOMENT:
      return "mm-alert";
    default:
      return "msg-greeting";
  }
};

// ========= Validation  ===========

import { Filter } from "bad-words";
const IsOffensive = new Filter();
const reservedWords = [
  "admin",
  "mod",
  "system",
  "messagemoment",
  "messag_emoment",
  "MessageMoment.com",
  "Messagemoment",
  "Advertisement",
]; // List of reserved words

export const validateDisplayName = (name) => {
  // Mandatory Rules
  const minLength = 2;
  const maxLength = 15;

  // Regex Components
  const startsWithValid = /^@?[A-Za-z0-9](?!.*[@_.~\-]{2})[A-Za-z0-9@_.~\-]*$/; // Starts with @, letter, or number  --tested
  const containsValidChars = /^[A-Za-z0-9@_.~\-]*$/; // Allowed characters
  const noConsecutiveSymbols = /^(?!.*[_.~\-]{2}).*$/; // No consecutive symbols
  const noLeadingOrTrailingSymbols = /^(?![_\-~.]|.*[_\-~.]$).*$/; // No leading/trailing special chars
  const hasAlphanumeric = /[A-Za-z0-9]/; // Must have at least one alphanumeric character

  // Check Length
  if (name.length < minLength)
    return `Name must be at least ${minLength} characters.`;
  if (name.length > maxLength)
    return `Name cannot exceed ${maxLength} characters.`;

  // Validate Starting Characters
  if (!startsWithValid.test(name))
    return "Name must start with @, a letter, or a number.";

  // Validate Allowed Characters
  if (!containsValidChars.test(name))
    return "Name contains invalid characters.";

  // Validate No Consecutive Symbols
  if (!noConsecutiveSymbols.test(name))
    return "Name cannot have consecutive symbols.";

  // Validate No Leading/Trailing Symbols
  if (!noLeadingOrTrailingSymbols.test(name))
    return "Name cannot start or end with special symbols.";

  // Validate Contains Alphanumeric
  if (!hasAlphanumeric.test(name))
    return "Name must contain at least one letter or number.";

  // Prohibited Patterns
  if (reservedWords.includes(name.toLowerCase())) return "Name is reserved.";
  if (IsOffensive.isProfane(name))
    return "Name contains inappropriate language.";
  return "All Good!";
};
