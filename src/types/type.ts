export type item = {
  url: string;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type User = {
    id: string;
    handle: string;
    lastImage: string;
    lastImageId: string;
};
  
export type ImageData = {
    url: string;
};