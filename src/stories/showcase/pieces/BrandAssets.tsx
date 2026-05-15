import avatarIsotypeSrc from "../../../../brand/avatar-isotype.png";
import avatarLockupSrc from "../../../../brand/avatar-lockup.png";
import bannerSrc from "../../../../brand/banner.png";
import isotypeSrc from "../../../../brand/isotype.png";
import lockupStackedPngSrc from "../../../../brand/lockup-stacked.png";
import lockupStackedSvgSrc from "../../../../brand/lockup-stacked.svg";
import styles from "../Showcase.module.css";

interface Asset {
  src: string;
  subpath: string;
  caption: string;
  /** Light surface backdrop for transparent rasters / vectors. */
  needsBackdrop: boolean;
}

const ASSETS: Asset[] = [
  {
    src: lockupStackedSvgSrc,
    subpath: "brand/lockup-stacked.svg",
    caption: "Stacked lockup. Vector source.",
    needsBackdrop: true,
  },
  {
    src: lockupStackedPngSrc,
    subpath: "brand/lockup-stacked.png",
    caption: "Stacked lockup. Transparent raster.",
    needsBackdrop: true,
  },
  {
    src: isotypeSrc,
    subpath: "brand/isotype.png",
    caption: "Isotype only. Transparent raster.",
    needsBackdrop: true,
  },
  {
    src: bannerSrc,
    subpath: "brand/banner.png",
    caption: "Wide wordtype banner — social headers, repo banners.",
    needsBackdrop: false,
  },
  {
    src: avatarLockupSrc,
    subpath: "brand/avatar-lockup.png",
    caption: "Stacked lockup on grey square — profile slots.",
    needsBackdrop: false,
  },
  {
    src: avatarIsotypeSrc,
    subpath: "brand/avatar-isotype.png",
    caption: "Isotype on grey square — profile slots.",
    needsBackdrop: false,
  },
];

/**
 * Brand assets that ship under `@poukai-inc/ui/brand/*`. Renders each as a
 * preview card with its subpath and one-line use-case caption.
 */
export function BrandAssets() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
        gap: "var(--space-6)",
      }}
    >
      {ASSETS.map((a) => (
        <div key={a.subpath} className={styles.spec}>
          <div
            style={{
              background: a.needsBackdrop ? "var(--surface)" : undefined,
              borderRadius: "var(--radius-2)",
              padding: "var(--space-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "11rem",
            }}
          >
            <img
              src={a.src}
              alt=""
              style={{ maxWidth: "100%", maxHeight: "9rem", objectFit: "contain" }}
            />
          </div>
          <code
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--fs-micro)",
              color: "var(--fg)",
            }}
          >
            {a.subpath}
          </code>
          <p className="meta" style={{ margin: 0 }}>
            {a.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
