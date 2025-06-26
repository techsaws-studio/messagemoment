import Footer from "@/components/footer";
import Header from "@/components/header";
import Converse from "@/components/home/converse";
import Hero from "@/components/home/hero";
import Message from "@/components/home/message";
import Sliders from "@/components/home/slider";
import Working from "@/components/home/working";
import LinkNotification from "@/components/notification/link-notification";

export default function Home() {
  return (
    <>
      <LinkNotification />
      <Header />
      <Hero />
      <Converse />
      <Working />
      <Message />
      <Sliders />
      <Footer />
    </>
  );
}
