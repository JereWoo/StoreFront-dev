import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/9ui/card";
import { Textarea } from "@/components/ui/9ui/textarea";
import { Button } from "@/components/ui/9ui/button";
import { Checkbox } from "@/components/ui/9ui/checkbox";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/9ui/tabs";
import { FloatingInput } from "@/components/ui/forms/FloatingInput"; // your floating helper
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export const Route = createFileRoute("/_layout/sell/create-listing")({
  component: CreateListingPage,
});

function CreateListingPage() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Complete your listing</h1>

      {/* Photos & Video */}
      <Card>
        <CardHeader>
          <CardTitle>Photos &amp; Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can add up to 24 photos and 1 video.
          </p>
          <Dropzone
            onDrop={(accepted) => setFiles(accepted)}
            onReject={(files) => console.log("Rejected files", files)}
            accept={IMAGE_MIME_TYPE}
            maxSize={5 * 1024 ** 2}
          >
            <div className="text-center p-6 border-2 border-dashed rounded-md">
              <p className="font-medium">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground">
                or click to select from your computer
              </p>
            </div>
          </Dropzone>
          <div className="grid grid-cols-4 gap-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="border rounded-md p-2 text-xs text-center truncate"
              >
                {f.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Title & Category */}
      <Card>
        <CardHeader>
          <CardTitle>Title &amp; Category</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <FloatingInput id="title" label="Item title" maxLength={80} />
          <FloatingInput id="category" label="Category" />
        </CardContent>
      </Card>

      {/* Item specifics */}
      <Card>
        <CardHeader>
          <CardTitle>Item specifics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <FloatingInput id="isbn" label="ISBN" />
          <FloatingInput id="author" label="Author" />
          <FloatingInput id="publisher" label="Publisher" />
          <FloatingInput id="binding" label="Binding" />
          <FloatingInput id="language" label="Language" />
          <FloatingInput id="edition" label="Edition / Special Attributes" />
        </CardContent>
      </Card>

      {/* Condition & Description */}
      <Card>
        <CardHeader>
          <CardTitle>Condition &amp; Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FloatingInput id="condition" label="Condition" />
          <Textarea placeholder="Condition description (max 1000 chars)" />
          <Textarea placeholder="Item description" />
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="buyitnow">
            <TabsList>
              <TabsTrigger value="buyitnow">Buy It Now</TabsTrigger>
              <TabsTrigger value="auction">Auction (future)</TabsTrigger>
            </TabsList>
            <TabsContent value="buyitnow" className="space-y-4">
              <FloatingInput
                id="price"
                label="Item price"
                type="number"
                min="1"
              />
              <FloatingInput
                id="quantity"
                label="Quantity"
                type="number"
                defaultValue="1"
              />
              <div className="flex items-center space-x-2">
                <Checkbox id="allowOffers" />
                <label htmlFor="allowOffers">Allow offers</label>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-4">
          <FloatingInput id="weight" label="Weight (lbs)" type="number" />
          <FloatingInput id="length" label="Length (in)" type="number" />
          <FloatingInput id="width" label="Width (in)" type="number" />
          <FloatingInput id="height" label="Height (in)" type="number" />
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FloatingInput id="location" label="Item location (ZIP)" />
          <div className="flex items-center space-x-2">
            <Checkbox id="returns" />
            <label htmlFor="returns">Accept returns</label>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button>List Item</Button>
        <Button variant="outline">Save for later</Button>
        <Button variant="ghost">Preview</Button>
      </div>
    </div>
  );
}
