"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Logo from "../../public/logo-white.svg";

const AdminWelcomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="h-screen w-screen bg-primary-theme flex-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        <Image
          src={Logo}
          alt="MessageMoment"
          className="lg:w-[50%] lg:h-[50%] md:w-[70%] md:h-[70%] w-[80%] h-[80%]"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-0 left-0 right-0 top-0 bg-primary-theme"
      />
    </main>
  );
};

export default AdminWelcomePage;
