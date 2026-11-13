ALTER TABLE "Product" ADD COLUMN "sku" TEXT;
ALTER TABLE "Product" ADD COLUMN "stockQuantity" INTEGER;

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_active_stockQuantity_idx" ON "Product"("active", "stockQuantity");
