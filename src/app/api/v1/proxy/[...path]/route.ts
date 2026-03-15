import { NextRequest, NextResponse } from "next/server";

async function handleRequest(request: NextRequest, path: string[], method: string) {
  try {
    const authorization = request.headers.get("authorization");
    const url = `${process.env.API_URL}/${path.join("/")}`;
    const headers: Record<string, string> = {};

    if (authorization) {
      headers["Authorization"] = authorization;
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (contentType) {
      headers["Content-Type"] = contentType;
    }
    const options: RequestInit = { method, headers };

    if (method !== "GET" && method !== "HEAD") {
      if (contentType.includes("multipart/form-data")) {
        options.body = await request.arrayBuffer();
        headers["Content-Type"] = contentType;
      } else {
        const body = await request.text();
        if (body) options.body = body;
      }
    }

    const searchParams = request.nextUrl.searchParams.toString();
    const urlWithParams = searchParams ? `${url}?${searchParams}` : url;

    const response = await fetch(urlWithParams, options);
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error({ error });
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Proxy request failed",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params.path, "GET");
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params.path, "POST");
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params.path, "PATCH");
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params.path, "PUT");
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  return handleRequest(request, params.path, "DELETE");
}
