import { tmpl } from "@cyftec/maya/signal";
import { component, m } from "@cyftec/maya";

type GithubLinkProps = {
  classNames?: string;
  url: string;
  size?: number;
};

export const GithubLink = component<GithubLinkProps>(
  ({ classNames, url, size }) =>
    m.A({
      class: classNames,
      target: "_blank",
      href: url || "https://github.com",
      children: [
        m.Img({
          class: "ba b--none br-100",
          src: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          height: tmpl`${() => size?.value || 32}`,
          width: tmpl`${() => size?.value || 32}`,
        }),
      ],
    }),
);
