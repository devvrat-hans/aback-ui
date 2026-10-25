import { ShareButtons } from "@/components/ui/share-buttons";

const url = "https://abackui.com/docs/components/share-buttons";

export function ShareButtonsExample() {
  return (
    <div className="flex flex-col gap-6">
      <ShareButtons url={url} title="Share Buttons in Aback UI" networks={["x", "linkedin", "facebook", "whatsapp", "email"]} />
      <ShareButtons url={url} title="Share Buttons in Aback UI" networks={["x", "linkedin"]} showLabels nativeShare />
    </div>
  );
}
