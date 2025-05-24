import { get } from "@/http/request";

interface UserInfo {
  id: number;
  name: string;
}
export function getUserInfo(id: number) {
  return get<UserInfo>(
    "/user/info",
    {
      id,
    },
    {}
  );
}
