import { Child, m } from "@mufw/maya";

export const Disclaimer = m.Div({
  children: m.For({
    subject: [
      `Currently, active development is happening on this framework. And a stable version has not
      been released yet. This framework should not and cannot be used for production apps. However, for the demonstration
      purpose a few small apps has been or will be released.`,
      `The purpose of this tutorial is to only share the working and usage details of the
      Maya Web Framework. So that, if one is interested in exploring new technological developments,
      they get to know yet another approach to solving current problems/limitations in the web development field.`,
    ],
    map: (para) => m.P(para),
  }),
});
