import { createFileRoute, useParams } from "@tanstack/react-router";
import { useProductByIdQuery } from "@/generated/hooks";
import { Loader } from "@mantine/core";
import { useState } from "react";

import { AspectRatio } from "@/components/ui/9ui/aspect-ratio";
import { BuyNowButton } from "@/components/ui/composites/BuyNowButton";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/9ui/carousel";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/9ui/tabs";
import { Button } from "@/components/ui/9ui/button";
import { Card } from "@/components/ui/9ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_layout/listing/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = useParams({ from: Route.id });
  const { data, isLoading, error } = useProductByIdQuery({ id });

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">Error loading product</p>;

  const product = data?.product;
  if (!product) return <p>Product not found</p>;

  const images = product.assets?.length
    ? product.assets
    : product.featuredAsset
      ? [product.featuredAsset]
      : [];

  // Hook into carousel events
  api?.on("select", () => {
    setSelectedIndex(api?.selectedScrollSnap() ?? 0);
  });

  return (
    <div className="container mx-auto py-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
      {/* Left: Image gallery */}
      <div>
        <Carousel setApi={setApi}>
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.id}>
                <AspectRatio
                  ratio={4 / 3}
                  className="bg-background rounded-lg border"
                >
                  <img
                    src={img.preview}
                    alt={product.name}
                    fill
                    className="rounded-lg object-contain"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Thumbnails */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={img.id}
              className="relative h-16 w-16 shrink-0"
              onClick={() => api?.scrollTo(index)}
            >
              <img
                src={img.preview}
                alt={product.name}
                fill
                className={cn(
                  "rounded-md object-cover opacity-60 transition-opacity duration-200 hover:opacity-100",
                  selectedIndex === index &&
                    "opacity-100 ring-2 ring-emerald-500",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product details */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl font-semibold text-emerald-700">
          ${Math.floor(Math.random() * 100) + 20 /* placeholder price */}
        </p>

        <div className="flex gap-3">
          <BuyNowButton
            productId={product.id}
            variantId={product.variants[0].id}
          />
          <Button variant="outline">Message Seller</Button>
        </div>

        {/* Seller Info Card */}
        <Card className="p-4 mt-4">
          <h2 className="font-semibold text-lg mb-2">Seller Information</h2>
          <p className="text-sm">Book Dealer Co.</p>
          <p className="text-sm text-gray-500">Ships from USA</p>
          <Button size="sm" variant="ghost" className="mt-2">
            View Seller Profile
          </Button>
        </Card>
      </div>

      {/* Bottom: Tabs for details */}
      <div className="lg:col-span-2 mt-8">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="seller">Seller</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <p>{product.description || "No description available."}</p>
          </TabsContent>

          <TabsContent value="shipping" className="mt-4">
            <p>Ships within 2–5 business days. Free returns within 30 days.</p>
          </TabsContent>

          <TabsContent value="seller" className="mt-4">
            <p>Book Dealer Co. has been selling rare books since 1995.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
