export type AccentColor = 'accent' | 'sage';

/** A service the funeral home offers, rendered as a card in the Services grid. */
export interface ServiceItem {
  readonly id: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
}

/** A navigation entry linking to an on-page section anchor. */
export interface NavLink {
  readonly id: string;
  readonly href: string;
  readonly labelKey: string;
}
