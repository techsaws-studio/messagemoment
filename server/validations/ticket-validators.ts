import { TicketValidationResultInterface } from "interfaces/validations-interface.js";
import { TicketTopicEnum } from "../enums/ticket-enum.js";

export const ValidateTicketData = (
  data: any
): TicketValidationResultInterface => {
  const errors: string[] = [];

  if (
    !data.firstName ||
    typeof data.firstName !== "string" ||
    data.firstName.trim().length === 0
  ) {
    errors.push("First name is required");
  }

  if (
    !data.lastName ||
    typeof data.lastName !== "string" ||
    data.lastName.trim().length === 0
  ) {
    errors.push("Last name is required");
  }

  if (
    !data.emailAddress ||
    typeof data.emailAddress !== "string" ||
    data.emailAddress.trim().length === 0
  ) {
    errors.push("Email address is required");
  }

  if (!data.topic || typeof data.topic !== "string") {
    errors.push("Topic is required");
  }

  if (
    !data.query ||
    typeof data.query !== "string" ||
    data.query.trim().length === 0
  ) {
    errors.push("Query is required");
  }

  // Field length validations
  if (data.firstName && data.firstName.trim().length > 50) {
    errors.push("First name cannot exceed 50 characters");
  }

  if (data.lastName && data.lastName.trim().length > 50) {
    errors.push("Last name cannot exceed 50 characters");
  }

  if (data.query && data.query.trim().length > 1500) {
    errors.push("Query cannot exceed 1500 characters");
  }

  // Email format validation
  if (data.emailAddress) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.emailAddress.trim())) {
      errors.push("Please provide a valid email address");
    }
  }

  // Topic enum validation
  if (data.topic && !Object.values(TicketTopicEnum).includes(data.topic)) {
    errors.push("Invalid topic selected");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const SanitizeTicketData = (data: any) => {
  return {
    firstName: data.firstName?.trim() || "",
    lastName: data.lastName?.trim() || "",
    emailAddress: data.emailAddress?.toLowerCase().trim() || "",
    topic: data.topic || "",
    query: data.query?.trim() || "",
  };
};
