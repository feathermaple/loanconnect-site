type GTMEvent = Record<string, unknown>;

type GTMWindow = Window & {
  dataLayer?: GTMEvent[];
};

export function pushEvent(event: GTMEvent) {
  if (typeof window === "undefined") return;

  const gtmWindow = window as GTMWindow;
  gtmWindow.dataLayer = gtmWindow.dataLayer || [];
  gtmWindow.dataLayer.push(event);
}