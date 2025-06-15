import React from "react";

function NoFaqFound({value}) {
  return (
      <div className="no-faq-found">
        <h4>No results found</h4>
        <p className="small">
          We couldn’t find a match for “{value}”. Please try another
          keyword.
        </p>
      </div>
  );
}

export default NoFaqFound;
