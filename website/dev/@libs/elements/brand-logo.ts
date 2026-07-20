import { tmpl } from "@cyftec/maya/signal";
import { Child, component, m } from "@cyftec/maya/core";

type BrandLogoProps = {
  logoSrc: string;
  logoHref: string;
  logoSize?: number;
  labelComponent?: Child;
};

export const BrandLogo = component<BrandLogoProps>(
  ({ logoSrc, logoHref, logoSize, labelComponent }) => {
    const size = tmpl`${() => logoSize?.value || 32}`;

    return m.A({
      class: "space-mono link black flex items-center justify-start",
      href: logoHref,
      children: [
        m.Img({
          src: logoSrc,
          height: size,
          width: size,
        }),
        m.If({
          subject: labelComponent,
          isTruthy: () => labelComponent as Child,
        }),
      ],
    });
  },
);
