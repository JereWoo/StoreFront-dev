import { createFileRoute, useParams } from "@tanstack/react-router";
import { useProductByIdQuery } from "@/generated/hooks";
import { Loader } from "@mantine/core";
import { Button } from "@/components/ui/9ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/9ui/carousel";

export const Route = createFileRoute("/_layout/listing/$id")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { id } = useParams({ from: Route.id });
  const { data, isLoading, error } = useProductByIdQuery({ id });

  if (isLoading) return <Loader />;
  if (error) return <p className="text-red-600">Error loading product</p>;

  const product = data?.product;
  if (!product) return <p>Product not found</p>;

  const images = product.assets?.length
    ? product.assets
    : product.featuredAsset
      ? [product.featuredAsset]
      : [];

  return (
    <div className="container mx-auto py-8 grid gap-8 md:grid-cols-2">
      {/* Image carousel */}
      <div>
        <Carousel className="w-full max-w-lg mx-auto">
          <CarouselContent>
            {images.map((img) => (
              <CarouselItem key={img.id}>
                <img
                  src={img.preview}
                  alt={product.name}
                  className="h-96 w-full object-contain rounded bg-gray-50"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Product info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-500 text-sm">Slug: {product.slug}</p>
        <p className="text-xl font-semibold text-emerald-700">
          ${Math.floor(Math.random() * 100) + 20 /* placeholder price */}
        </p>
        <p className="text-gray-700">
          {product.description || "No description available."}
        </p>

        <div className="flex gap-3 mt-4">
          <Button>Add to Cart</Button>
          <Button variant="outline">Message Seller</Button>
        </div>
      </div>
    </div>
  );
}
