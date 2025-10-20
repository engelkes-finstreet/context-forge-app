// MCP Server Types for Context Forge

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType: string;
}

export interface MCPListResourcesResponse {
  resources: MCPResource[];
}

export interface MCPReadResourceRequest {
  uri: string;
}

export interface MCPReadResourceResponse {
  contents: {
    uri: string;
    mimeType: string;
    text: string;
  }[];
}

export interface MCPUpdateResourceRequest {
  uri: string;
  text: string;
}

export interface MCPUpdateResourceResponse {
  success: boolean;
  message?: string;
}

export interface MCPErrorResponse {
  error: string;
  details?: string;
}
