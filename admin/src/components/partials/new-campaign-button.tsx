import React from "react";

import { Button } from "../ui/button";

const NewCampaignButton = () => {
  return (
    <Button className="sm:w-[183px] w-full h-[45px] rounded-[6px] button-box-shadow bg-secondary-theme hover:bg-secondary-theme-hover text-theme-heading-color font-inter flex-center text-[14px] leading-[18px]">
      + New Campaign
    </Button>
  );
};

export default NewCampaignButton;
