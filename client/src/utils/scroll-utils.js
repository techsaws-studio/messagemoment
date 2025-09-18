import { messageContainerRef } from "@/components/chat/messagesBox";

class ScrollManager {
  constructor() {
    this.userScrolled = false;
    this.scrollPauseTimeout = null;
    this.autoScrollThreshold = 100;
    this.lastScrollTop = 0;

    this.unreadMessageCount = 0;
    this.onNewMessageCallback = null;
    this.onScrollStateChangeCallback = null;
    this.hasUnreadMessages = false;

    this.handleUserScroll = this.handleUserScroll.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  init() {
    const container = messageContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", this.handleUserScroll);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    this.observer = new MutationObserver(() => {
      this.scrollToBottom();
    });

    this.observer.observe(container, { childList: true, subtree: false });
  }

  handleUserScroll() {
    const container = messageContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom =
      scrollHeight - scrollTop - clientHeight <= this.autoScrollThreshold;

    if (scrollTop < this.lastScrollTop - 10) {
      this.userScrolled = true;
      clearTimeout(this.scrollPauseTimeout);

      if (this.onScrollStateChangeCallback) {
        this.onScrollStateChangeCallback(true);
      }

      this.scrollPauseTimeout = setTimeout(() => {
        if (isNearBottom) {
          this.userScrolled = false;
          this.resetUnreadMessages();
        }
      }, 3000);
    }

    if (isNearBottom && this.userScrolled) {
      this.userScrolled = false;
      this.resetUnreadMessages();
      clearTimeout(this.scrollPauseTimeout);
    }

    this.lastScrollTop = scrollTop;
  }

  setCallbacks(onNewMessage, onScrollStateChange) {
    this.onNewMessageCallback = onNewMessage;
    this.onScrollStateChangeCallback = onScrollStateChange;
  }

  incrementUnreadMessages() {
    if (this.userScrolled) {
      this.unreadMessageCount++;
      this.hasUnreadMessages = true;
      if (this.onNewMessageCallback) {
        this.onNewMessageCallback(this.unreadMessageCount);
      }
    }
  }

  resetUnreadMessages() {
    if (this.hasUnreadMessages || this.unreadMessageCount > 0) {
      this.unreadMessageCount = 0;
      this.hasUnreadMessages = false;
      if (this.onNewMessageCallback) {
        this.onNewMessageCallback(0);
      }
      if (this.onScrollStateChangeCallback) {
        this.onScrollStateChangeCallback(false);
      }
    }
  }

  checkForMessageDisappearance() {
    if (this.hasUnreadMessages) {
      const container = messageContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom =
        scrollHeight - scrollTop - clientHeight <= this.autoScrollThreshold;

      if (isNearBottom && this.hasUnreadMessages) {
        this.resetUnreadMessages();
      }
    }
  }

  handleVisibilityChange() {
    if (!document.hidden) {
      this.scrollToBottom(true, "auto");
    }
  }

  scrollToBottom(force = false, behaviorOverride = null) {
    const container = messageContainerRef.current;
    if (!container) return;

    if (!force && this.userScrolled) {
      console.log("Skipping auto-scroll - user is reading older messages");
      return;
    }

    let behavior = behaviorOverride;
    if (!behavior) {
      if (document.hidden) {
        behavior = "auto";
      } else if (force) {
        behavior = "smooth";
      } else {
        behavior = "auto";
      }
    }

    if (behavior === "smooth" && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      const startScrollTop = container.scrollTop;
      const targetScrollTop = container.scrollHeight - container.clientHeight;
      const distance = targetScrollTop - startScrollTop;
      const duration = 300;
      let startTime = null;

      const animateScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easing = 1 - Math.pow(1 - progress, 3);
        container.scrollTop = startScrollTop + distance * easing;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo({
        top: container.scrollHeight - container.clientHeight,
        behavior,
      });
    }
  }

  forceResetTooltip() {
    this.resetUnreadMessages();
  }

  forceScrollToBottom() {
    this.userScrolled = false;
    this.resetUnreadMessages();
    clearTimeout(this.scrollPauseTimeout);

    const container = messageContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight - container.clientHeight,
      behavior: "smooth",
    });
  }

  destroy() {
    const container = messageContainerRef.current;
    if (container) {
      container.removeEventListener("scroll", this.handleUserScroll);
    }
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
    if (this.observer) this.observer.disconnect();
    clearTimeout(this.scrollPauseTimeout);
  }
}

export const scrollManager = new ScrollManager();

export const scrollToBottom = () => scrollManager.scrollToBottom();
export const forceScrollToBottom = () => scrollManager.forceScrollToBottom();
