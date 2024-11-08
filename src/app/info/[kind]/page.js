"use client";

import { API_URL } from "@/constants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const InfoPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const { i18n } = useTranslation();
  const params = useParams();
  let lang_id = "EN";
  if (
    typeof localStorage !== "undefined" &&
    localStorage.getItem("langId") != null
  ) {
    lang_id = localStorage.getItem("langId");
  }

  const getPageData = async (event) => {
    try {
      const res = await fetch(`${API_URL}/api/home/get-information`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          LanguageID: lang_id,
          Kind: params.kind,
        }),
      });

      if (res.status === 200) {
        const resJson = await res.json();

        console.log("data", resJson.output);
        return resJson.output;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await getPageData();
      setPageContent(fetchedData);
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, []);

  return (
    <div className="flex justify-center items-center py-8">
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    </div>
  );
};

export default InfoPage;
