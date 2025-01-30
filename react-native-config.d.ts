declare module "react-native-config" {
  export interface NativeConfig {
    API_URL: string;
    CLIENT_SECRET: string;
    CLIENT_ID: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
