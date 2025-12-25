import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // LiveKit 이중 렌더링 이슈 방지
  reactCompiler: true,
  output: "standalone", // 핵심: 빌드 결과물을 최소화하여 standalone 폴더에 생성
};

export default nextConfig;
