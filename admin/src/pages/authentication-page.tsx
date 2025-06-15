import React from "react";
import Image from "next/image";

import AuthForm from "@/components/roots/authentication/auth-form";

import Logo from "../../public/logo-white.svg";

const AuthenticationPage = () => {
  return (
    <main className="h-screen w-screen bg-primary-theme py-4 overflow-hidden">
      <Image
        src={Logo}
        alt="MessageMoment"
        className="sm:w-[297px] w-[247px] sm:h-[146px] h-[96px] mx-auto"
        priority
      />

      <div className="w-full sm:h-[calc(100vh-246px)] h-[calc(100vh-96px)] flex-center">
        <AuthForm />
      </div>
    </main>
  );
};

export default AuthenticationPage;
