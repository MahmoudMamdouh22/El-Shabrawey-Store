ALTER TABLE "Product" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'other';
ALTER TABLE "Product" ADD COLUMN "model" TEXT;
ALTER TABLE "Product" ADD COLUMN "condition" TEXT NOT NULL DEFAULT 'new';
ALTER TABLE "Product" ADD COLUMN "specifications" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Product" ADD COLUMN "warranty" TEXT;
ALTER TABLE "Product" ADD COLUMN "delivery" TEXT;
ALTER TABLE "Product" ADD COLUMN "isDemo" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Product_active_category_idx" ON "Product"("active", "category");
