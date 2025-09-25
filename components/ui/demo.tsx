import { Star, BadgeInfo, MessageSquare } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

export function NavBarDemo() {
  const navItems = [
    { name: "Features", url: "#features", icon: Star },
    { name: "Pricing", url: "#pricing", icon: BadgeInfo },
    { name: "Testimonials", url: "#testimonials", icon: MessageSquare },
    { name: "FAQ", url: "#faq", icon: BadgeInfo },
  ];

  return <NavBar items={navItems} />;
}
