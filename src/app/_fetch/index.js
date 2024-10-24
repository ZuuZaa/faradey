import { API_URL } from "@/constants";

export async function getMainData() {
  let token = "";
  let session_id = "";
  let lang_id = "EN";

  if (typeof localStorage !== "undefined") {
    token = localStorage.getItem("jwtToken");
    session_id = localStorage.getItem("sessionId");
    if (localStorage.getItem("langId") != null) {
      lang_id = localStorage.getItem("langId");
    }
  }
  
  const params = new URLSearchParams();
  params.append("SessionId", session_id);
  params.append("LanguageID", lang_id);

  const response = await fetch(
    `${API_URL}/api/home/get-index?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "Bearer " + token,
      },
    }
  );

  const data = await response.json();
  return data.output;
}
