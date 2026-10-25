import { Button } from "@/components/ui/button";
import { Step, Steps } from "@/components/ui/steps";

export function StepsExample() {
  return (
    <div className="flex w-full flex-col gap-10">
      <Steps aria-label="Workspace setup" className="max-w-md">
        <Step
          status="complete"
          title="Create your workspace"
          description="Name it and choose a data region."
        />
        <Step
          status="current"
          title="Invite your team"
          description="Members get an email with a sign-in link."
        >
          <div className="mt-2">
            <Button size="sm">Send invites</Button>
          </div>
        </Step>
        <Step title="Connect a domain" description="Point a CNAME record at your workspace." />
      </Steps>

      <Steps orientation="horizontal" aria-label="How it works">
        <Step status="complete" title="Submit" description="Add your product in three minutes." />
        <Step status="current" title="Launch" description="Go live on launch day." />
        <Step title="Get found" description="Your page keeps bringing visitors." />
      </Steps>
    </div>
  );
}
