CREATE TABLE public.blogs
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text NOT NULL,
    "websiteUrl" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone DEFAULT NULL,
    "isMembership" boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.blogs
    OWNER to "postgres";