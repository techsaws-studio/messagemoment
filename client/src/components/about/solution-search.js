import React from "react";
import solutionTeamImg from "@/assets/images/solutionTeamImg.svg";
import Image from "next/image";
function SolutionSearch() {
  return (
    <div className="solution-search container">
      <div className="column2">
        <h2>The solution you've been searching for</h2>
        <p className="small">
          Our mission is to provide a reliable and trustworthy platform for
          discreet conversations between known parties. Whether you're looking
          to keep a conversation private or just need a secure space to
          communicate, MessageMoment is the solution you've been searching for.
        </p>
      </div>

      <Image src={solutionTeamImg} />
    </div>
  );
}

export default SolutionSearch;
