import React, { Fragment } from "react";

import Header from "@/components/header";
import Hero from "@/components/about/hero";
import Team from "@/components/about/team";
import UserPrivacy from "@/components/about/user-privacy";
import SolutionSearch from "@/components/about/solution-search";
import Service from "@/components/about/service";
import Footer from "@/components/footer";

export default function About() {
  return (
    <Fragment>
      <Header />
      <Hero />
      <Team />
      <UserPrivacy />
      <SolutionSearch />
      <Service />
      <Footer />
    </Fragment>
  );
}
