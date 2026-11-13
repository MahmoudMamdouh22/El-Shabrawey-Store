ALTER TABLE "Product" ADD COLUMN "brand" TEXT;
CREATE INDEX "Product_active_brand_idx" ON "Product"("active", "brand");
