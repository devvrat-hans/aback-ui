import { Button } from "@/components/ui/button";
import { Container, Grid, Group, Stack } from "@/components/ui/layout";

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 items-center justify-center border border-dashed border-primary-300 bg-brand-wash text-xs font-medium text-link dark:border-primary-700">
      {children}
    </div>
  );
}

export function LayoutExample() {
  return (
    <Container size="md" className="border border-border px-0 md:px-0">
      <Stack gap="lg" className="p-4">
        <Group justify="between">
          <span className="text-sm font-semibold">Group · justify between</span>
          <Group gap="xs">
            <Button size="sm" variant="outline">
              Cancel
            </Button>
            <Button size="sm">Save</Button>
          </Group>
        </Group>
        <Grid columns={3}>
          <Box>Grid 1</Box>
          <Box>Grid 2</Box>
          <Box>Grid 3</Box>
        </Grid>
        <Stack gap="xs">
          <Box>Stack · xs</Box>
          <Box>Stack · xs</Box>
        </Stack>
      </Stack>
    </Container>
  );
}
