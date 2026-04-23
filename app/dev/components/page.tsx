import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ComponentsPreviewPage() {
  return (
    <main className="container mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">MetaCheck</h1>
        <p className="text-muted-foreground">UI components preview</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>All variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button loading>Loading</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="https://example.com" />
          <Input placeholder="With error state" error />
          <Input placeholder="Disabled" disabled />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Missing</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Present</Badge>
          <Badge variant="warning">Warning</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spinners</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="google">
            <TabsList>
              <TabsTrigger value="google">Google</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="twitter">Twitter</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            </TabsList>
            <TabsContent value="google">Google preview placeholder</TabsContent>
            <TabsContent value="facebook">Facebook preview placeholder</TabsContent>
            <TabsContent value="twitter">Twitter preview placeholder</TabsContent>
            <TabsContent value="linkedin">LinkedIn preview placeholder</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
