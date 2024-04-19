export interface navigationType {
  navigate: {
    screen: string;
    params: {};
  };
}

export interface InlineError {
  message: string;
  type: string;
}

export interface paginationType {
  current_page: number;
  links: paginationTypeLinks[];
  first_page_url: string;
  from: number;
  last_page: string;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: string;
  to: number;
  total: number;
}

export interface paginationTypeLinks {
  url: string;
  label: string;
  active: true;
}

export interface uploadedOrderType {
  uri: string;
  base64: string;
}
