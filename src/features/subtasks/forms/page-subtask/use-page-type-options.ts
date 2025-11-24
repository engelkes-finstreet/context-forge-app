export enum PageType {
  INQUIRY = "inquiry",
  PORTAL = "portal",
}

type PageTypeOption = {
  label: string;
  value: PageType;
};

export function usePageTypeOptions(): [PageTypeOption, PageTypeOption] {
  return [
    { label: "Inquiry", value: PageType.INQUIRY },
    { label: "Portal", value: PageType.PORTAL },
  ];
}
