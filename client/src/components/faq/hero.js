'use client'
import FaqIcon from "@/assets/icons/faqHero.svg";
import IconSearch from "@/assets/icons/icon_search.svg";
import RightArrow from "@/assets/icons/rightArrow.svg";
import { Faqcommandlist, Faqs } from "@/dummy-data";
import useCheckIsMobileView from "@/hook/useCheckIsMobileView";
import Image from "next/image";
import React, { createRef, useEffect, useState } from "react";
import NoFaqFound from "./no-faq-found";

export const FaqsRef = createRef(null);
export const FaqsDisplayNameRef = createRef(null);

/**
 * FaqHero is a React component that renders a FAQ hero section with a search functionality.
 * It allows users to search and filter through a list of FAQs, highlighting matching terms.
 * 
 * State Variables:
 * - openItems: Array of open FAQ item IDs.
 * - searchTerm: The current search term input by the user.
 * - filteredFaqs: The filtered list of FAQs based on the search term.
 * - isInitialSetValue: Boolean flag to track the initial setup.
 * 
 * Effects:
 * - Adjusts open items and scrolls to specific sections based on URL fragments.
 * - Updates the list of filtered FAQs as the search term changes.
 * 
 * Handlers:
 * - handleSearch: Updates the search term state based on user input.
 * - toggleItem: Toggles the open state of a FAQ item.
 * 
 * Utility Functions:
 * - stripHtmlTags: Removes HTML tags from text.
 * - getHighlightedText: Highlights search terms in text and replaces specific phrases with hyperlinks.
 * - renderBulletsPoints, renderParagraph, renderMultiHeading, renderListwithSubContent: Render different FAQ content types.
 */

function FaqHero() {
  const [openItems, setOpenItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(Faqs);
  const { isMobileView } = useCheckIsMobileView();
  const [isInitialSetValue, setIsInitialSetValue] = useState(true);

  useEffect(() => {
    setIsInitialSetValue(false);
    if (window.location.href.includes("/faqs#project_mode")) {
      setOpenItems([15]);
      const yOffset = isMobileView ? -84 : -84;
      const yPosition =
        FaqsRef?.current?.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
    if (window.location.href.includes("/faqs#display_name")) {
      setOpenItems([25]);
      const yOffset = isMobileView ? -84 : -84;
      const yPosition =
        FaqsDisplayNameRef?.current?.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  }, [isMobileView]);

  const stripHtmlTags = (text) => {
    // Remove all HTML tags
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };


// * Filters the FAQs based on the search term.
// * Checks if the search term is empty.
// * If empty, updates the filtered FAQs state with the original FAQs list and resets the open items state.
// * If not empty, converts the search term to lowercase for case-insensitive matching.
// * Removes HTML tags from FAQ descriptions, headings, and points.
// * Checks if the search term matches the FAQ description, top description, headings, points, footer description, paragraphs, and paragraph subtitles.
// * Filters the FAQs based on the search term matches.
// * Updates the filtered FAQs state with the filtered list.
// * Updates the open items state with the IDs of the filtered FAQs.

  useEffect(() => {
    if(!isInitialSetValue) {
      if (searchTerm === "") {
        setFilteredFaqs(Faqs);
        setOpenItems([]);
      } else {
        const searchTermLower = searchTerm.toLowerCase();
  
        const filtered = Faqs.filter((item) => {
          // Apply the stripHtmlTags function to remove <strong> tags and other HTML
          const desc = item?.desc ? stripHtmlTags(item.desc).toLowerCase() : "";
          const matchesTitle=item?.title ? stripHtmlTags(item?.title).toLowerCase() : "";
          const matchesTitleSearch = matchesTitle.includes(searchTermLower);
          const topDesc = item?.top_desc
            ? stripHtmlTags(item.top_desc).toLowerCase()
            : "";
          const heading1 = item?.heading1
            ? stripHtmlTags(item.heading1).toLowerCase()
            : "";
          const heading2 = item?.heading2
            ? stripHtmlTags(item.heading2).toLowerCase()
            : "";
  
          const matchesDesc = desc.includes(searchTermLower);
          const matchesTopDesc = topDesc.includes(searchTermLower);
          const matchesHeading1 = heading1.includes(searchTermLower);
          const matchesHeading2 = heading2.includes(searchTermLower);
          
          // Check for matches in the points array after removing HTML tags
          const matchesPoints = item?.points?.some((point) =>
            stripHtmlTags(point).toLowerCase().includes(searchTermLower)
          );
  
          const footerDesc = item?.footer_desc
            ? stripHtmlTags(item.footer_desc).toLowerCase()
            : "";
          const matchesFooterDesc = footerDesc.includes(searchTermLower);
  
          const matchesParagraph =
            item?.paragraph &&
            item?.paragraph?.some(
              (para) =>
                stripHtmlTags(para.title)
                  ?.toLowerCase()
                  .includes(searchTermLower) ||
                (para.content &&
                  stripHtmlTags(para.content)
                    ?.toLowerCase()
                    .includes(searchTermLower))
            );
  
          const matchesParagraphSub =
            item?.paragraphSub &&
            item?.paragraphSub?.some(
              (para) =>
                stripHtmlTags(para.title)
                  ?.toLowerCase()
                  .includes(searchTermLower) ||
                para.content?.some((content) =>
                  stripHtmlTags(content)?.toLowerCase().includes(searchTermLower)
                )
            );
  
          const matchesHeadingPoints1 = item?.headingPoints1?.some((point) =>
            stripHtmlTags(point).toLowerCase().includes(searchTermLower)
          );
          const matchesHeadingPoints2 = item?.headingPoints2?.some((point) =>
            stripHtmlTags(point).toLowerCase().includes(searchTermLower)
          );
  
          return (
            matchesDesc ||
            matchesTitleSearch ||
            matchesTopDesc ||
            matchesPoints ||
            matchesFooterDesc ||
            matchesParagraph ||
            matchesHeading1 ||
            matchesHeading2 ||
            matchesHeadingPoints1 ||
            matchesHeadingPoints2 ||
            matchesParagraphSub
          );
        });
        setFilteredFaqs(filtered);
        setOpenItems(filtered.map((item) => item.id));
      }
    }
  }, [searchTerm]);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Replaces specific text in a given string with a hyperlink or a highlighted span.
   * @param {string} text The text to be modified.
   * @param {string} highlight The text to be highlighted. If not set, no highlighting is done.
   * @returns {JSX.Element} A JSX element with the modified text.
   */

  const getHighlightedText = (text, highlight) => {
    const escapeRegex = (string) =>
      string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Check for "Contact Us" and replace it with a hyperlink
    if (!highlight && text.toLowerCase().includes("contact us")) {
      const contactUsPattern = /Contact Us/gi;

      text = text.replace(
        contactUsPattern,
        '<span style="color: blue;" class="faq-contact"> <a href="/contact-us">Contact Us</a></span>'
      );
    }

    // Check for "@Phantom Wallet" and replace it with a hyperlink, hiding the "@" during search
    if (!highlight && text.toLowerCase().includes("phantom wallet!")) {
      const phantomWalletPattern = /Phantom Wallet!/gi;

      text = text.replace(
        phantomWalletPattern,
        '<span style="color: blue;" class="faq-phantom-wallet"> <a href="https://phantom.app/" target="_blank">Phantom Wallet</a></span>'
      );
    }

    const commandPattern = new RegExp(
      `(${Faqcommandlist.map((cmd) => escapeRegex(cmd)).join("|")})`,
      "gi"
    );

    text = text.replace(commandPattern, (match) => `<strong>${match}</strong>`);

    if (highlight) {
      const escapedHighlight = escapeRegex(highlight); // Escape special characters in highlight
      const highlightPattern = new RegExp(
        `(?<!</?)(${escapedHighlight})(?![^<>]*>)`,
        "gi"
      );
      text = text.replace(
        highlightPattern,
        (match) => `<span class="highlighted">${match}</span>`
      );
    }

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  const toggleItem = (id) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(id)
        ? prevOpenItems.filter((itemId) => itemId !== id)
        : [...prevOpenItems, id]
    );
  };

/**
 * Renders a set of bulleted points, with top and bottom descriptions
 * and support for highlighting search terms.
 * @param {object} item The FAQ item containing the points.
 * @returns {JSX.Element} A JSX element with the rendered points.
 */
  const renderBulletsPoints = (item) => {
    return (
      <>
        {item?.top_desc && (
          <p
            className="small"
            style={{
              paddingBottom: "15px",
            }}
          >
            {" "}
            {getHighlightedText(item?.top_desc, searchTerm, item.id)}
          </p>
        )}
        <ul className="custom-list-faq">
          {item?.points.length > 0 &&
            item?.points.map((point, index) => (
              <li key={`renderBulletsPoints-point-${index.toString() + `${new Date().getMilliseconds()}`}`}>
                {getHighlightedText(point, searchTerm, item.id)}
              </li>
            ))}
        </ul>
        {item?.footer_desc && (
          <p className="small">
            {" "}
            {getHighlightedText(item?.footer_desc, searchTerm, item.id)}
          </p>
        )}
      </>
    );
  };
/**
 * Renders a list of paragraphs, with top and bottom descriptions
 * and support for highlighting search terms.
 * @param {object} item The FAQ item containing the paragraphs.
 * @returns {JSX.Element} A JSX element with the rendered paragraphs.
 */
  const renderParagraph = (item) => {
    return (
      <>
        <ul className="custom-list-faq">
          {item?.paragraph.length > 0 &&
            item?.paragraph.map((val, index) => (
              < React.Fragment key={`renderParagraph-${index.toString() + `${new Date().getMilliseconds()}`}`}>
                <li>
                  {getHighlightedText(val?.title, searchTerm, item.id)}
                </li>
                <p className="small" id="paragraph_style">
                  {getHighlightedText(val?.content, searchTerm, item.id)}
                </p>
              </React.Fragment>
            ))}
        </ul>
      </>
    );
  };
/**
 * Renders a multi-heading structure for an FAQ item with optional top description.
 * Each heading is followed by a list of points, and supports highlighting search terms.
 * 
 * @param {object} item - The FAQ item containing headings and points.
 * @returns {JSX.Element} A JSX element with rendered headings and points.
 */

  const renderMultiHeading = (item) => {
    return (
      <>
        {item?.top_desc && (
          <p
            className="small"
            style={{
              paddingBottom: "15px",
            }}
          >
            {" "}
            {getHighlightedText(item?.top_desc, searchTerm, item.id)}
          </p>
        )}
        <ul className="custom-list-faq">
          {item?.points.length > 0 &&
            item?.points.map((point, index) => (
              <li key={`renderMultiHeading-point-${index.toString() + `${new Date().getMilliseconds()}`}`}>
                {getHighlightedText(point, searchTerm, item.id)}
              </li>
            ))}
        </ul>
        <h6 style={{ padding: "15px 0px" }}>
          {" "}
          {getHighlightedText(item?.heading1, searchTerm, item.id)}
        </h6>
        <ul className="custom-list-faq">
          {item?.headingPoints1.length > 0 &&
            item?.headingPoints1.map((point, index) => (
              <li key={`renderMultiHeading-1point-${index.toString() + `${new Date().getMilliseconds()}`}`}>
                {getHighlightedText(point, searchTerm, item.id)}
              </li>
            ))}
        </ul>
        <h6 style={{ padding: "15px 0px" }}>
          {" "}
          {getHighlightedText(item?.heading2, searchTerm, item.id)}
        </h6>
        <ul className="custom-list-faq">
          {item?.headingPoints2.length > 0 &&
            item?.headingPoints2.map((point, index) => (
              <li key={`renderMultiHeading-2-${index.toString() + `${new Date().getMilliseconds()}`}`}>
                {getHighlightedText(point, searchTerm, item.id)}
              </li>
            ))}
        </ul>
      </>
    );
  };
/**
 * Renders a FAQ list item with sub-content.
 *
 * @param {Object} item - The current FAQ item.
 * @returns {ReactElement} A React element representing the rendered list item.
 */
  const renderListwithSubContent = (item) => {
    return (
      <>
        {item?.top_desc && (
          <p
            className="small"
            style={{
              paddingBottom: "15px",
            }}
          >
            {" "}
            {getHighlightedText(item?.top_desc, searchTerm, item.id)}
          </p>
        )}

        <ul className="custom-list-faq">
          {item?.paragraphSub.length > 0 &&
            item?.paragraphSub.map((point, index) => (
              <li key={`renderListwithSubContent-point-${index +`${new Date().getMilliseconds()}`}`}>
                {getHighlightedText(point?.title, searchTerm, item.id)}
                {point?.content &&
                  point?.content.length > 0 &&
                  point?.content.map((val, i) => (
                    <ul key={`sub-list-${i.toString() + new Date().getUTCSeconds()}`}>
                      {" "}
                      <li key={`sub-list-${i.toString() + new Date().getUTCSeconds()}`} style={{ margin: "10px 0px" }}>
                        {getHighlightedText(val, searchTerm, item.id)}
                      </li>
                    </ul>
                  ))}
              </li>
            ))}
        </ul>
      </>
    );
  };

  return (
    <>
      <div className="faq-wrapper">
        <Image src={FaqIcon} className="faq-icon" alt="faq-icon"/>
        <h3>How can we help you?</h3>
        <div className="faq-search">
          <input
            placeholder="Type keywords to find answers"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Image src={IconSearch} className="search-icon" alt="IconSearch"/>
        </div>
        <p>
          You can also browse the topics below to find what you are looking for:
        </p>
      </div>
      {/* faq section */}
      <div
        className="faq-question-section"
        style={{
          marginBottom: filteredFaqs.length > 0 ? 126 : 0,
        }}
      >
        <div className="qna-section">
          {filteredFaqs.length == 0 ? (
            <>
              <h3>Frequently Asked Questions</h3>
              <NoFaqFound value={searchTerm} />
              <hr className="hr" />
            </>
          ) : (
            <>
              <h3 className="faq-title">Frequently Asked Questions</h3>
              <h4>General</h4>
              <div className="accordion">
                {filteredFaqs.map((item, index) => (
                  <div
                    key={`faq-${item?.id}`}
                    ref={
                      item?.id === 15
                        ? FaqsRef
                        : item.id == 25
                        ? FaqsDisplayNameRef
                        : undefined
                    }
                    className="accordion-item"
                  >
                    <div
                      className="accordion-button"
                      onClick={() => toggleItem(item.id)}
                    >
                      <Image
                        src={RightArrow}
                        alt="right-arrow"
                        className={`custom-collapse-icon ${
                          openItems.includes(item.id) ? "active" : ""
                        }`}
                      />
                      <div className={`title`}>
                        <h6
                          className={`${
                            openItems.includes(item.id) ? "title-selecte" : ""
                          }`}
                        >
                          {getHighlightedText(item.title, searchTerm, item.id)}
                        </h6>
                      </div>
                    </div>
                    <div
                      className={`accordion-content ${
                        openItems.includes(item.id) ? "open" : ""
                      }`}
                    >
                      {item?.type == "bullets" ? (
                        <>{renderBulletsPoints(item)}</>
                      ) : item?.type == "paragraph" ? (
                        <>{renderParagraph(item)}</>
                      ) : item.type == "multiple-headings" ? (
                        renderMultiHeading(item)
                      ) : item.type == "list-sub-content" ? (
                        renderListwithSubContent(item)
                      ) : (
                        <>
                          <p className="small">
                            {getHighlightedText(item.desc, searchTerm, item.id)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default FaqHero;
