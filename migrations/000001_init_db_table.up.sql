CREATE TABLE if not exists "users" (
  "id" serial PRIMARY KEY,
  "fullname" varchar(255),
  "email" varchar(255) UNIQUE,
  "password" varchar(255),
  "picture" text,
  "phone" varchar(50),
  "address" text,
  "role" varchar(50),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp,
  "lastlogin_at" timestamp
);

CREATE TABLE if not exists "categories" (
  "id" serial PRIMARY KEY,
  "categories_name" varchar(255),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE if not exists "products"  (
  "id" serial PRIMARY KEY,
  "name" varchar(255) unique,
  "description" text,
  "price" int,
  "is_flash_sale" boolean default false,
  "is_buy1get1" boolean default false,
  "is_birthday_package" boolean default false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE if not exists "product_categories" (
  "id" serial PRIMARY KEY,
  "product_id" int,
  "categories_id" int,
  foreign key ("product_id") references "products"("id"),
  foreign key ("categories_id") references "categories"("id")
);

CREATE TABLE if not exists "sizes"  (
  "id" serial PRIMARY KEY,
  "size_name" varchar(100),
  "additional_price" int default 0,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp
);



CREATE TABLE if not exists "product_sizes"  (
  "id" serial PRIMARY KEY,
  "product_id" int,
  "size_id" int,
  foreign key ("product_id") references "products"("id"),
  foreign key ("size_id") references "sizes"("id")
);

CREATE TABLE if not exists "variants"  (
  "id" serial PRIMARY KEY,
  "variant_name" varchar(100),
  "additional_price" int,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE if not exists "product_variants"  (
  "id" serial PRIMARY KEY,
  "product_id" int,
  "variant_id" int,
  foreign key ("product_id") references "products"("id"),
  foreign key ("variant_id") references "variants"("id")
);


CREATE TABLE IF NOT EXISTS "cart" (
  "id" serial PRIMARY KEY,
  "user_id" int,
  "product_id" int,
  "qty" int,
  "size_id" int,
  "variant_id" int,
  foreign key ("user_id") references "users"("id"),
  foreign key ("product_id") references "products"("id"),
  foreign key ("size_id") references "sizes"("id"),
  foreign key ("variant_id") references "variants"("id"),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp,
  UNIQUE (user_id, product_id, size_id, variant_id)
);

CREATE TABLE if not exists "images"  (
  "id" serial PRIMARY KEY,
  "image_path" text
);

CREATE TABLE if not exists "product_images"  (
  "id" serial PRIMARY KEY,
  "product_id" int,
  "image_id" int,
  foreign key ("product_id") references "products"("id"),
  foreign key ("image_id") references "images"("id")
);

CREATE TABLE if not exists "testimonials"  (
  "id" serial PRIMARY KEY,
  "name" varchar(255),
  "image" text,
  "author_title" varchar(255),
  "message" varchar(255),
  "rating" int,
  "created_at" timestamp DEFAULT now(),
   "product_id" int,
  foreign key ("product_id") references "products"("id")
);

CREATE TABLE if not exists "coupons"  (
  "id" serial PRIMARY KEY,
  "title" varchar(255),
  "description" text,
  "value" int,
  "created_at" timestamp DEFAULT now(),
  "image" text
);

CREATE TABLE if not exists "transactions"  (
  "id" serial PRIMARY KEY,
  "delivery_method" varchar(255) DEFAULT 'dine in',
  "full_name" varchar(255),
  "email" varchar(255),
  "address" varchar(255),
  "subtotal_price" int,
  "total_price" int,
  "delivery_fee" int,
  "tax" int,
  "coupon_id" int REFERENCES coupons(id),
  "transaction_code" uuid,
  "status" varchar(50) DEFAULT 'pending',
  "payment_method" varchar(255),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp,
  "deleted_at" timestamp
);

CREATE TABLE if not exists "transaction_products" (
  "id" serial PRIMARY KEY,
  "product_id" int,
  "transaction_id" int,
  "qty" int,
  "size" varchar(50),
  "variant" varchar(100),
  "price" int,
  foreign key ("product_id") references "products"("id"),
  foreign key ("transaction_id") references "transactions"("id"),
  "created_at" timestamp DEFAULT now()
);