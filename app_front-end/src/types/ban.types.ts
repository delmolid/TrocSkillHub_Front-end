export type BanCommuneSuggestion = {
  code: string;
  city: string;
  postalCode: string;
  label: string;
};

export type BanSearchResponse = {
  features?: BanFeature[];
};

export type BanFeature = {
  properties?: BanFeatureProperties;
};

export type BanFeatureProperties = {
  label?: string;
  name?: string;
  city?: string;
  postcode?: string;
  citycode?: string;
  context?: string;
};
