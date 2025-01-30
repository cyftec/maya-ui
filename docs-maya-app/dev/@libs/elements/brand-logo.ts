import { dstring } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";

type BrandLogoProps = {
  logoSrc: string;
  logoHref: string;
  logoSize?: number;
  labelComponent?: Child;
};

export const BrandLogo = component<BrandLogoProps>(
  ({ logoSrc, logoHref, logoSize, labelComponent }) => {
    const size = dstring`${() => logoSize?.value || 32}`;
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
          condition: labelComponent,
          isTruthy: labelComponent as Child,
        }),
      ],
    });
  }
);
