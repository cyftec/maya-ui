import { m } from "@mufw/maya";
import { ViewFrame } from "./@libs/elements";
import { Page } from "./@libs/components/Page";

export default Page({
  title: "Maya UI Framework",
  app: ViewFrame({
    children: m.H2("home page"),
  }),
});
