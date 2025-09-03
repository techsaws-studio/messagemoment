import { messageContainerRef } from "@/components/chat/messagesBox";

class ScrollManager {
  constructor() {
    this.userScrolled = false;
    this.scrollPauseTimeout = null;
    this.autoScrollThreshold = 100;
    this.lastScrollTop = 0;

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

      this.scrollPauseTimeout = setTimeout(() => {
        if (isNearBottom) this.userScrolled = false;
      }, 3000);
    }

    if (isNearBottom && this.userScrolled) {
      this.userScrolled = false;
      clearTimeout(this.scrollPauseTimeout);
    }

    this.lastScrollTop = scrollTop;
  }

  handleVisibilityChange() {
    if (!document.hidden) {
      this.scrollToBottom(true);
    }
  }

  scrollToBottom(force = false) {
    const container = messageContainerRef.current;
    if (!container) return;

    if (!force && this.userScrolled) {
      console.log("Skipping auto-scroll - user is reading older messages");
      return;
    }

    const behavior = document.hidden ? "auto" : "smooth";

    container.scrollTo({
      top: container.scrollHeight - container.clientHeight,
      behavior,
    });
  }

  forceScrollToBottom() {
    this.userScrolled = false;
    clearTimeout(this.scrollPauseTimeout);
    this.scrollToBottom(true);
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
