export const Faqs = [
  {
    id: 1,
    title: "What is MessageMoment?",
    desc: "MessageMoment is a discreet chat service that enables known parties to communicate with each other through a unique chat link.",
  },
  {
    id: 2,
    title: "How do I use MessageMoment?",
    desc: "To use MessageMoment, simply open the chat link in your default or favorite browser. No account registration is necessary. The user will enter the chat session and gain visibility of the conversation only once they have entered their Display Name and token password (if applicable).",
  },
  {
    id: 3,
    title: "What is meant by “Secure”?",
    desc: "You can choose to make a chat session secure. This means that you will not only share the auto-generated unique chat link, but you will also share the auto-generated token password assigned for that chat session.",
  },
  {
    id: 4,
    title: "How do I share the chat details with others?",
    desc: "You can choose to use any other communications service to share and socialize the chat link with another party. This could be SMS, Email, a messaging service etc. We have provided you with a copy function allowing you to easily copy the unique chat link as well as the token password (if applicable).",
  },

  {
    id: 5,
    title: "Can I use MessageMoment on my mobile device?",
    desc: "Yes, MessageMoment has a mobile responsive design, so you can use the chat link on your mobile device through your default or favorite browser. There is no need for a native app.",
  },
  {
    id: 9,
    title: "Is there a limit to the number of users in a chat?",
    desc: "Yes, there is currently a limit of 10 users that can participate in a chat session.",
  },
  // RULES
  {
    id: 25,
    title: "What are the rules for creating a Display Name?",
    desc: "",
    top_desc: "Your Display Name must:",
    points: [
      "Have a <strong>minimum length of 2 characters</strong>.",
      "Not exceed <strong>15 characters</strong> to prevent UI issues.",
      "Start with a letter (A-Z, a-z), number (0-9), or the @ symbol.",
      "Only include special characters like _, -, ., and ~ within the name (but not consecutively, e.g., -- or .. is not allowed).",
      "Not contain spaces.",
      "Not start or end with special characters, except for @ at the start.",
      "Not consist only of special characters (e.g., :/;; is not allowed — it must contain at least <strong>one letter or number</strong>).",
      "Not contain offensive or reserved words like admin, mod, or system.",
      "Not have been previously used by anyone in that same chat session.",
    ],
    heading1: "<strong>Example Valid Display Names:</strong>",
    headingPoints1: ["@JohnDoe", "Jane_Doe", "CoolUser123"],
    heading2: "<strong>Example Invalid Display Names:</strong>",
    headingPoints2: [
      ":/;; (Contains only special characters)",
      "@@SuperUser (Repeated special characters)",
      "-user (Starts with -)",
      "user- (Ends with -)",
    ],
    type: "multiple-headings",
  },
  {
    id: 26,
    title: "What happens if I type prohibited characters or words?",
    desc: "",
    top_desc: "We’ve made it easier for you to follow the rules by:",
    paragraphSub: [
      {
        title: "Preventing prohibited input in real-time:",
        content: [
          "If you try typing consecutive prohibited characters (e.g., @@ or __), only the first will appear, and the rest will not be entered.",
          "If you type a special character like @ at the start, it will work, but typing another @ later will not be allowed.",
        ],
      },
      {
        title:
          "The button will only light up once your input sequence is valid and follows all the rules.",
        content: [],
      },
    ],
    type: "list-sub-content",
  },
  {
    id: 27,
    title: "Why does my Display Name keep getting rejected?",
    desc: "",
    top_desc: "If your Display Name is rejected:",
    points: [
      "It might not meet the length requirement (2–15 characters).",
      "It could contain consecutive prohibited characters or end with one.",
      "It may contain a reserved or inappropriate word.",
      "It may have already been used in that same session, by another user or yourself.",
    ],
    type: "bullets",
  },
  {
    id: 28,
    title: "How do I fix a rejected Display Name?",
    desc: "Review your Display Name and ensure it meets all required Display Name rules.",
  },
  {
    id: 29,
    title: "Why can't I see certain buttons when entering my Display Name?",
    desc: `The "Send" button will only light up once your input sequence is valid and follows all the Display Name rules.`,
  },

  //
  {
    id: 7,
    title: "Can I change my Display Name after it has been set?",
    desc: `No, once you set your Display Name, you cannot change it unless you leave the chat session and return, allowing you to set a new one. Once you leave the chat session, your previous Display Name cannot be used in that chat session by any new or returning users. MessageMoment is typically used for chat conversations between known parties and so expectations should be set amongst the party of users when sharing the chat link with them, as to what to expect. Further, you can choose to validate who you are speaking with through your own screening questions once you arrive at the chat, if you feel compelled to.`,
  },
  {
    id: 50,
    title: "Can I leave and return with the same Display Name?",
    desc: `Display Names are typically not reusable within the same chat session once you've left. However, if you wish to rejoin using the same Display Name, you must do so using the exact same method as before - for example, the same browser on the same device.`,
  },
  {
    id: 30,
    title:
      "What are the rules for the Security Code when choosing the Secure method?",
    desc: `If you choose the Secure method for your chat session, a <strong>4-digit numeric Security Code</strong> is automatically generated for you and included in the chat URL. The code will always be exactly <strong>4 digits long</strong> and consist only of numeric characters (0–9). This code is used to ensure only authorized users can access the chat.`,
  },
  {
    id: 31,
    title:
      "How does the Wallet authentication work for generating a chat link?",
    desc: "",
    type: "bullets",
    points: [
      "<strong>Select the Wallet Option:</strong> Choose the <strong>Wallet</strong> method when generating your chat link.",
      "<strong>Authenticate with Phantom Wallet:</strong> You will be redirected to Phantom Wallet for authentication. You’ll need to connect your Phantom Wallet and approve the connection.",
      "<strong>Enter the Chat:</strong> After authentication, you’ll automatically be granted access to the chat via the unique chat link. You will then be prompted to enter your <strong>Display Name</strong> to proceed.",
      "<strong>Security:</strong> Only users with a valid Phantom Wallet connection can enter the chat, ensuring a secure and trusted environment.",
    ],
    top_desc:
      "When you choose the <strong>Wallet</strong> option to generate a chat link, you’ll be prompted to authenticate using Phantom Wallet!. This authentication ensures that only <strong>Phantom Wallet-authenticated users</strong> can access the chat. Here's how it works:",
  },

  {
    id: 8,
    title: "How long will my chat data be available for?",
    desc: `Chat data will be available for as long as the chat link remains active however this is subject to the Message Expiry time which will determine the length of time in which each user’s entered message will appear until it is no longer visible to anyone in the chat session. The Message Expiry time is set once by one user and applies to all users. Once it is set, it will appear inactive (grayed out) for all users indicating it has been set and what it has been set to. It cannot be changed for the remainder of chat session. It is the responsibility of the users to capture or save any information they want to retain, as the platform is provided on an "as is" and "as available" basis. Whilst not essential, for additional peace of mind, consider launching your browser in its private mode. This way, your visit to our site will not be recorded in your browser history.`,
  },

  {
    id: 10,
    title:
      "What if I or someone else accidently sets the wrong Message Expiry time?",
    desc: "Once the Message Expiry time is set, it cannot be changed. In order to reset it, a new chat session needs to be established and the old chat link/session will be disregarded. By default, the Message Expiry time is set to 10 seconds however it can range from 3 second up to 5 minutes. Anyone that arrives at the chat session can choose to set it (first).",
  },
  {
    id: 52,
    title:"Can the chat session be locked?",
    desc: "Yes, locking the chat session will prevent new users from joining. Any user can lock the chat session at any time using the /lock command. However, only the user who locked it, can unlock it. If they leave the session, the chat will automatically unlock, allowing another user to lock it again.",
  },
  //======== project Mode =======
  {
    id: 15,
    title: "What is Project Mode?",
    desc: "Project Mode is a special feature in MessageMoment designed for collaborative, long-term discussions. It introduces persistent messaging, advanced tools like ChatGPT integration, and the ability to download transcripts.",
  },
  {
    id: 16,
    title: "How do I enable or disable Project Mode?",
    type: "bullets",
    points: [
      "To enable Project Mode, type /project on.",
      "To disable Project Mode, type /project off.",
    ],
    desc: "",
  },
  {
    id: 17,
    desc: "",
    title: "What happens when I enable Project Mode?",
    top_desc:
      "When you type /project on, you’ll be warned that enabling Project Mode will clear all previous chat data and apply new settings. You’ll need to confirm this action by typing y (yes) or cancel it with n (no). If confirmed:",
    points: [
      "The chat starts fresh with Project Mode enabled.",
      "All previous messages are permanently deleted.",
    ],
    type: "bullets",
  },
  {
    id: 18,
    title: "Can I disable Project Mode after enabling it?",
    desc: "Yes, you can disable Project Mode by typing /project off. However, this will not restore the cleared chat data from before Project Mode was enabled. Project Mode can be enabled or disabled multiple times during a single chat session, by any user.",
  },
  {
    id: 19,
    title: "What are the key features of Project Mode?",
    desc: "",
    points: [],
    top_desc: "",
    footer_desc: "",
    paragraph: [
      {
        title: "Persistent Messaging",
        content:
          "No message expiry time. Messages remain visible throughout the session.",
      },
      {
        title: "ChatGPT Integration",
        content:
          "Use /mm to ask ChatGPT questions or get assistance with your project directly within the chat.",
      },
      {
        title: "Downloadable Transcripts",
        content:
          "Use /download to save the chat history as a .txt file for future reference.",
      },
    ],
    type: "paragraph",
  },
  {
    id: 20,
    title: "What should I keep in mind before enabling Project Mode?",
    points: [
      "Enabling Project Mode will immediately clear all existing messages in the chat.",
      "While in Project Mode, you can use the /clear command to permanently delete all messages generated during that mode.",
      "Make sure all users are aware that these changes will occur before enabling Project Mode.",
    ],
    desc: "",
    type: "bullets",
  },
  {
    id: 21,
    title: "Is Project Mode suitable for all types of chats?",
    top_desc: "Project Mode is ideal for:",
    desc: "",
    points: [
      "Collaborative work.",
      "Long-term discussions requiring persistent messages.",
    ],
    type: "bullets",
    footer_desc:
      "While it can be used for other purposes, its features are tailored to group projects and teamwork.",
  },
  {
    id: 22,
    title: "Can I still use the regular chat features in Project Mode?",
    desc: "Yes, all standard MessageMoment chat features remain available in Project Mode, but with additional tools and persistent messaging.",
  },
  {
    id: 23,
    title: "What happens if I disable Project Mode?",
    desc: "Disabling Project Mode (/project off) ends its enhanced features but does not restore any previously cleared messages. Messages generated while it was active will remain visible unless you use the /clear command before exiting. Alternatively, re-enabling Project Mode will clear all chat history - both from normal mode and previous Project Mode sessions.",
  },

  {
    id: 11,
    title: "Is my data safe with MessageMoment?",
    desc: "MessageMoment takes the privacy of its users seriously and has implemented appropriate security measures to protect user data. However, users are responsible for ensuring that they do not share any sensitive or personal information through the chat service.",
  },
  {
    id: 12,
    title: "Can I use MessageMoment for commercial purposes?",
    desc: "MessageMoment is intended for personal use only and typically by known parties. Any commercial use is strictly prohibited.",
  },
  {
    id: 13,
    title: "Can I use MessageMoment to harm or abuse others?",
    desc: "No, the use of MessageMoment for any harmful or abusive purposes is strictly prohibited. Users must abide by the Terms of Use and utilize the chat service in a responsible and respectful manner. It is not allowed to use the platform for any illegal or unauthorized purpose, violate any laws in your jurisdiction, infringe upon the rights of others, including but not limited to, the right to privacy and intellectual property rights, or use the platform in any manner that could damage, disable, overburden, or impair the platform.",
  },
  {
    id: 14,
    title: "Can my access to MessageMoment be terminated?",
    desc: "MessageMoment reserves the right to terminate or restrict your use of the platform at any time, with or without notice, for any or no reason, and without liability to you.",
  },

  {
    id: 24,
    title:
      "Who can I contact if I have any questions, concerns or feedback about MessageMoment?",
    desc: `You can Contact Us to get in touch.`,
  },
];

export const FaqsBoldTxt = {
  25: ["minimum length of 2 characters", "15 characters"],
};

export const messageType = {
  DEFAULT: "DEFAULT",
  GREETING: "GREETING",
  ADVERTISEMENT: "Advertisement", // ADS, MESSAGE_MOMENT SAME DESIGN
  JOINED: "JOINED",
  MESSAGE_MOMENT: "MESSAGE_MOMENT",
  MM_NOTIFICATION: "MM_NOTIFICATION", //MM_NOTIFICATION, MM_ERROR_MSG HAS SAME DESIGN JUST COLOR DIFFERENCE
  MM_ERROR_MSG: "MM_ERROR_MSG",
  MM_ALERT: "MM_ALERT",
  SECURITY_CODE: "SECURITY_CODE",
  ASK_TO_SET_EXPIRYTIME: "ASK_TO_SET_EXPIRYTIME",
  EXPIRY_TIME_HAS_SET: "EXPIRY_TIME_HAS_SET",
  PROJECT_MODE: "PROJECT_MODE",
  PROJECT_MODE_ENTRY: "PROJECT_MODE_ENTRY",
  ATTACHMENT_MESSAGE: "ATTACHMENT_MESSAGE",
  CHATGPT_INPUT: "CHATGPT_INPUT",
  CHATGPT_RESPONSE: "CHATGPT_RESPONSE",
  MM_NOTIFICATION_REMOVE_USER: "MM_NOTIFICATION_REMOVE_USER",
  PHANTOM_WALLET: "PHANTOM_WALLET",
};

export const renderRemoveUserText = (name) => {
  return `You are about to remove ${name} from this chat session. Are you sure you want to proceed? Type 'y' for Yes, 'n' for No.`;
};
export const DEFAULT_MESSAGES = {
  GREETING:
    "Welcome to MessageMoment.com, where your message only lasts a moment!",
  ADVERTISEMENT:
    "Big Sale on at Flight Centre! Don’t miss out. Visit www.flightcentre.com now and book your trip!",
  SECURITY_CODE:
    "This chat session is protected using a Security Code. ...> Please enter the Security Code you received with your chat link:",
  MESSAGE_MOMENT:
    "> Please enter your Display Name to proceed: ---  By proceeding, you agree that you are solely responsible for your actions and any content that you post or share during the chat session. MessageMoment does not assume any liability for the content posted by users or for any damages that may result from using this service.",
  ASK_TO_SET_EXPIRYTIME:
    "> Please enter the Message Expiration Time (in seconds) between 3 and 300. This can only be set once for all users, by any user, at any time. If this value is is not defined, the default will be 30 seconds. ... * Set it with the command /timer [seconds] *",
  PROJECT_MODE_ENTRY:
    "Should you wish to exit Project Mode at any point, please use the /project off command. If you would like to save a transcript of your chat, you can do so by using the /download command. To interact with ChatGPT, use the /mm command.",
  PROJECT_MODE:
    "You are about to enter Project Mode. Are you sure you want to proceed? Type 'y' for Yes, 'n' for No  ---. By proceeding, you are confirming your understanding and agreement to these conditions:1. The Message Expiry Time will be paused, meaning no messages will be auto-deleted.2. From this point forward, all chat messages can be saved.3. To safeguard previous conversations, all existing chat will be cleared upon activation of Project Mode.4. You and all fellow participants agree to these conditions.",
};

export const USER_HANDERLS = [
  "#704F2C",
  "#EB5757",
  "#F2994A",
  "#EDC447",
  "#219653",
  "#6FCF97",
  "#56CCF2",
  "#F368E0",
  "#9B42EE",
  "#BB6BD9",
];

export const commandlist = [
  "/leave",
  "/lock",
  "/timer",
  "/transfer",
  "/project on",
  "/remove",
];
export const Faqcommandlist = [
  "/leave",
  "/lock",
  "/timer",
  "/transfer",
  "/project on",
  "/project off",
  "/download",
  "/mm",
  "/remove",
  "/clear",
];

export const reason_options = [
  {
    title: "Inappropiate Content",
    desc: "This file contains offensive, explicit, or inappropriate material that violates community guidelines or Terms of Use.",
  },
  {
    title: "Copyright Violation",
    desc: "The file appears to infringe upon copyright or intellectual property rights, such as unauthorized distribution of copyrighted material.",
  },
  {
    title: "Malicious Software",
    desc: "The file seems to contain viruses, malware, or other harmful software that could compromise users' devices or data.",
  },
  {
    title: "Privacy Concerns",
    desc: "The file includes personal or sensitive information without consent, potentially violating privacy and data protection regulations.",
  },
  {
    title: "Spam or Unwanted Content",
    desc: "The file is spam, unsolicited advertising, or irrelevant content that disrupts the user experience.",
  },
  {
    title: "Harassment or Bullying",
    desc: "The file is being used to harass, bully, or target individuals, creating an unsafe or hostile environment.",
  },
];

import ai from "@/assets/icons/chat/files-icons/ai.svg";
import avi from "@/assets/icons/chat/files-icons/avi.svg";
import css from "@/assets/icons/chat/files-icons/css.svg";
import doc from "@/assets/icons/chat/files-icons/doc.svg";
import gif from "@/assets/icons/chat/files-icons/gif.svg";
import html from "@/assets/icons/chat/files-icons/html.svg";
import jpg from "@/assets/icons/chat/files-icons/jpg.svg";
import js from "@/assets/icons/chat/files-icons/js.svg";
import mov from "@/assets/icons/chat/files-icons/mov.svg";
import mp3 from "@/assets/icons/chat/files-icons/mp3.svg";
import music from "@/assets/icons/chat/files-icons/music.svg";
import php from "@/assets/icons/chat/files-icons/php.svg";
import png from "@/assets/icons/chat/files-icons/png.svg";
import ppt from "@/assets/icons/chat/files-icons/ppt.svg";
import psd from "@/assets/icons/chat/files-icons/psd.svg";
import rar from "@/assets/icons/chat/files-icons/rar.svg";
import svg from "@/assets/icons/chat/files-icons/svg.svg";
import tiff from "@/assets/icons/chat/files-icons/tiff.svg";
import txt from "@/assets/icons/chat/files-icons/txt.svg";
import video from "@/assets/icons/chat/files-icons/video.svg";
import xls from "@/assets/icons/chat/files-icons/xls.svg";
import zip from "@/assets/icons/chat/files-icons/zip.svg";

import videoIcon from "@/assets/icons/chat/files-icons/video.svg";
import musicIcon from "@/assets/icons/chat/files-icons/music.svg";
import imgIcon from "@/assets/icons/chat/files-icons/img.png";
import plainIcon from "@/assets/icons/chat/files-icons/plain.png";

export const UploadFileTypeIcons = [
  { type: "ai", img: ai },
  { type: "avi", img: avi },
  { type: "css", img: css },
  { type: "doc", img: doc },
  { type: "docx", img: doc },
  { type: "gif", img: gif },
  { type: "html", img: html },
  { type: "jpg", img: jpg },
  { type: "jpeg", img: jpg },
  { type: "js", img: js },
  { type: "mov", img: mov },
  { type: "mp3", img: mp3 },
  { type: "music", img: music },
  { type: "php", img: php },
  { type: "png", img: png },
  { type: "ppt", img: ppt },
  { type: "psd", img: psd },
  { type: "rar", img: rar },
  { type: "svg", img: svg },
  { type: "tiff", img: tiff },
  { type: "txt", img: txt },
  { type: "video", img: video },
  { type: "xls", img: xls },
  { type: "zip", img: zip },
];

export const fileCategories2 = {
  image: ["png", "jpg", "gif", "tiff", "svg"],
  video: ["mp4", "mov", "avi"],
  document: [
    "pdf",
    "doc",
    "ppt",
    "xls",
    "txt",
    "rar",
    "zip",
    "php",
    "html",
    "css",
    "js",
  ],
  music: ["mp3", "wav", "flac", "aac", "ogg", "m4a"],
};

export const fileCategories = {
  image: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "tif",
    "webp",
    "ico",
    "heif",
    "heic",
    "svg",
  ],
  video: [
    "mp4",
    "avi",
    "mkv",
    "mov",
    "wmv",
    "flv",
    "webm",
    "mpeg",
    "mpg",
    "3gp",
  ],
  document: [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "rtf",
    "csv",
    "html",
    "htm",
    "odt",
    "epub",
    "md",
    "xml",
    "json",
    "ini",
    "log",
    "rar",
    "zip",
    "php",
    "html",
    "css",
    "js",
  ],
  music: ["mp3", "wav", "flac", "aac", "ogg", "wma", "m4a", "opus"],
};

export const getUploadIconType = (type) => {
  if (fileCategories.image.includes(type)) return imgIcon;
  if (fileCategories.video.includes(type)) return videoIcon;
  if (fileCategories.music.includes(type)) return musicIcon;
  return plainIcon;
};

export const checkIsConnected = async () => {
  if (window.solana) {
    window.solana?.disconnect();
  }
};
export const isPhantomExist = () => {
  let isWalletExist = false;
  if (window.solana && window.solana.isPhantom) {
    try {
      isWalletExist = true;
    } catch (error) {
      console.log("Error connecting to Phantom wallet:", error);
    }
  } else {
    console.error("Phantom wallet is not installed");
  }
  return isWalletExist;
};

export const connectToPhantom = async () => {
  let publicKey = false;
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      publicKey = response.publicKey.toString();
    } catch (error) {
      console.log("Error connecting to Phantom wallet:", error);
    }
  } else {
    console.error("Phantom wallet is not installed");
  }
  return publicKey;
};

// ============== NEW PHANTOM INTEGRATION =================//
import nacl from "tweetnacl";
import bs58 from "bs58";

export const decryptPayload = (data, nonce, sharedSecret) => {
  if (!sharedSecret) throw new Error("Missing shared secret");

  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
};

export const encryptPayload = (payload, sharedSecret) => {
  if (!sharedSecret) throw new Error("Missing shared secret");

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret
  );

  return { nonce: bs58.encode(nonce), payload: bs58.encode(encryptedPayload) };
};

const DAPP_KEYPAIR = nacl.box.keyPair();
let sharedSecret;
let session;

export const connectPhantomDeeplinking = () => {
  const appUrl = window.location.href;
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(DAPP_KEYPAIR.publicKey),
    cluster: "mainnet-beta",
    app_url: appUrl,
    redirect_link: appUrl,
  });
  window.location.href = `https://phantom.app/ul/v1/connect?${params}`;
};

export const handleConnectCallback = (url) => {
  const parsedUrl = new URL(url);
  const params = parsedUrl.searchParams;
  let connectData = null;
  let isSuccess = false;
  console.log("publick key====", params.get("phantom_encryption_public_key"));
  if (params.get("errorCode")) {
    throw new Error(`Error: ${params.get("errorMessage")}`);
  }
  if (params.get("phantom_encryption_public_key")) {
    sharedSecret = nacl.box.before(
      bs58.decode(params.get("phantom_encryption_public_key")),
      DAPP_KEYPAIR.secretKey
    );
    connectData = decryptPayload(
      params.get("data"),
      params.get("nonce"),
      sharedSecret
    );
    session = connectData.session;
    isSuccess = true;
  }
  return connectData;
};

export const disconnectPhantom = () => {
  const payload = { session };
  const { nonce, payload: encryptedPayload } = encryptPayload(
    payload,
    sharedSecret
  );
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(DAPP_KEYPAIR.publicKey),
    nonce,
    redirect_link: "https://6f08-103-170-179-209.ngrok-free.app/onDisconnect",
    payload: encryptedPayload,
  });

  window.location.href = `https://phantom.app/ul/v1/disconnect?${params}`;
};

import ClipboardJS from "clipboard";
import { messageContainerRef } from "./components/chat/messagesBox";
import { SessionTypeEnum } from "./enums/session-type-enum";
export const handleCopyText = async (url, secureCode, urlType) => {
  return new Promise((resolve, reject) => {
    try {
      let isSuccess = false;
      const textToCopy =
        urlType === SessionTypeEnum.SECURE && url
          ? `${url}\n\nSecurity Code: ${secureCode}`
          : url;
      if (textToCopy) {
        const tempButton = document.createElement("button");
        tempButton.setAttribute("data-clipboard-text", textToCopy);
        const clipboard = new ClipboardJS(tempButton);

        clipboard.on("success", () => {
          console.log("Text copied to clipboard successfully!");
          isSuccess = true;
          clipboard.destroy();
          tempButton.remove();
          resolve(isSuccess);
        });

        clipboard.on("error", () => {
          console.error("Failed to copy text.");
          isSuccess = false;
          clipboard.destroy();
          tempButton.remove();
          reject(isSuccess);
        });

        tempButton.click();
      } else {
        reject(false);
      }
    } catch (error) {
      console.error(error);
      reject(false);
    }
  });
};

export const options = [
  "General Query",
  "Support",
  "Feedback / Suggestions",
  "Data Privacy Concerns",
  "Legal Query",
  "Advertising / Sponsorship Inquiries",
  "Press Inquiries",
  "Other Query",
];

export const users = [
  "Laura",
  "Richard",
  "Michael",
  "Joannah",
  "Nina",
  "Theresa",
  "Aron",
  "Catalina",
  "Robert",
  "Nicolas",
];

export const ShareLink = (type, sessionData, url) => {
  const shareText = encodeURIComponent(
    `Join me for a chat on MessageMoment – ${url}${
      sessionData.type == SessionTypeEnum.SECURE
        ? `\n\nSecurity Code: ${sessionData?.secureCode}`
        : ""
    }`
  );
  const shareTextMail = encodeURIComponent(
    `Join me here – ${url}/${
      sessionData.type == SessionTypeEnum.SECURE
        ? `\n\nSecurity Code: ${sessionData?.secureCode}`
        : ""
    }`
  );

  const shareTelegramURL = encodeURIComponent(`${url}`.trim());
  const shareTelegramText = encodeURIComponent(
    `Join me for a chat on MessageMoment.${
      sessionData.type == SessionTypeEnum.SECURE
        ? `\n\nSecurity Code: ${sessionData?.secureCode}`
        : ""
    }`
  );

  if (type == "whatsapp") {
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
  } else if (type == "telegram") {
    window.open(
      `https://t.me/share/url?url=${shareTelegramURL}&text=${shareTelegramText}`,
      "_blank"
    );
  } else if (type == "message") {
    window.open(`sms:?&body=${shareText}`, "_blank");
  } else if (type == "messenger") {
    window.open(
      `https://www.facebook.com/dialog/send?app_id=YOUR_FACEBOOK_APP_ID&link=https://message-moment-app.vercel.app/&redirect_uri=https://message-moment-app.vercel.app/`,
      "_blank"
    );
  } else if (type == "mail") {
    window.open(
      `mailto:?subject=Join me for a chat on MessageMoment&body=${shareTextMail}`,
      "_blank"
    );
  } else if (type == "instagram") {
    window.open(`https://www.instagram.com/`, "_blank");
  }
  return null;
};


 export const scrollToBottom = () => {
    if (messageContainerRef.current) {
      setTimeout(() => {
        messageContainerRef.current?.scrollTo({
          top: messageContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 20);
    }
  };