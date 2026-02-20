/**
 * Augments JSX.IntrinsicAttributes so TypeScript recognises `key` as a
 * valid prop on every JSX element, including custom components.
 *
 * Without @types/react installed, TypeScript has no built-in definition for
 * the special React `key` prop, causing TS2322 errors when it appears on
 * component JSX (e.g. <ActivityTableRow key={...} />).  This declaration
 * bridges that gap without requiring the full React type package.
 */
declare namespace JSX {
  interface IntrinsicAttributes {
    key?: string | number | bigint | boolean | null | undefined
  }
}
