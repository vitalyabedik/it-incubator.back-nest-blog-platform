CREATE TABLE public.posts
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    "shortDescription" text NOT NULL,
    content text NOT NULL,
    "blogId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "deletedAt" timestamp with time zone DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY ("blogId")
        REFERENCES public.blogs (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.posts
    OWNER to "postgres";


CREATE TABLE public.post_likes
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    "userId" uuid NOT NULL,
    "postId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    status like_status_type NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uniq_post_likes UNIQUE ("userId", "postId"),
    FOREIGN KEY ("postId")
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public.post_likes
    OWNER to "postgres";