import { forwardRef, type ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { Avatar } from "../../atoms/Avatar/index.js";
import { Time } from "../../atoms/Time/index.js";
import styles from "./Byline.module.css";

export interface BylineProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  avatar?: string;
  initials?: string;
  name: string;
  role?: string;
  publishedAt?: string | Date;
  readTime?: string;
}

export const Byline = forwardRef<HTMLDivElement, BylineProps>(function Byline(
  { avatar, initials, name, role, publishedAt, readTime, className, ...rest },
  ref,
) {
  const hasTrailing = Boolean(publishedAt ?? readTime);
  const avatarProps = avatar
    ? { mode: "image" as const, src: avatar, alt: "" }
    : initials
      ? { mode: "initials" as const, initials }
      : { mode: "empty" as const };
  return (
    <div ref={ref} className={clsx(styles.root, className)} {...rest}>
      <Avatar size="md" shape="circle" {...avatarProps} />
      <span className={styles.textCol}>
        <strong className={styles.name}>{name}</strong>
        {role ? <span className={styles.role}>{role}</span> : null}
      </span>
      {hasTrailing ? (
        <>
          <span className={styles.dot} aria-hidden="true">
            ·
          </span>
          {publishedAt ? (
            <Time dateTime={publishedAt} format="absolute" className={styles.time} />
          ) : null}
          {publishedAt && readTime ? (
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
          ) : null}
          {readTime ? <span className={styles.readTime}>{readTime}</span> : null}
        </>
      ) : null}
    </div>
  );
});

Byline.displayName = "Byline";
