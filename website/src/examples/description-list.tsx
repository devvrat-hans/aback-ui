import {
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
} from "@/components/ui/description-list";

export function DescriptionListExample() {
  return (
    <div className="grid w-full gap-6 md:grid-cols-2">
      <DescriptionList aria-label="Order summary">
        <DescriptionListItem>
          <DescriptionListTerm>Team plan, 5 seats</DescriptionListTerm>
          <DescriptionListDetails>$145.00</DescriptionListDetails>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListTerm>Annual discount</DescriptionListTerm>
          <DescriptionListDetails tone="success">-$29.00</DescriptionListDetails>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListTerm>Tax</DescriptionListTerm>
          <DescriptionListDetails>$0.00</DescriptionListDetails>
        </DescriptionListItem>
        <DescriptionListItem emphasis>
          <DescriptionListTerm>Total due today</DescriptionListTerm>
          <DescriptionListDetails>$116.00</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>

      <DescriptionList aria-label="Response headers">
        {[
          ["content-type", "text/html; charset=utf-8"],
          ["cache-control", "public, max-age=300"],
          ["x-frame-options", "DENY"],
          ["strict-transport-security", "max-age=63072000"],
        ].map(([key, value]) => (
          <DescriptionListItem key={key}>
            <DescriptionListTerm mono>{key}</DescriptionListTerm>
            <DescriptionListDetails className="font-mono text-xs">{value}</DescriptionListDetails>
          </DescriptionListItem>
        ))}
      </DescriptionList>
    </div>
  );
}
