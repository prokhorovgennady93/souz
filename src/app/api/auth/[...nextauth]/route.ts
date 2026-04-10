import { handlers } from "../../../../../auth";

export const GET = (req: any) => {
  console.log("[AUTH ROUTE] GET", req.nextUrl.pathname);
  return handlers.GET(req);
};

export const POST = (req: any) => {
  console.log("[AUTH ROUTE] POST", req.nextUrl.pathname);
  return handlers.POST(req);
};
