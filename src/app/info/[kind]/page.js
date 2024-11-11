"use client";

import { API_URL } from "@/constants";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const InfoPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const { t, i18n } = useTranslation();
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
        return resJson.output;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changeLanguage = async (event) => {
    const lng = event.currentTarget.textContent;
    await i18n.changeLanguage(lng);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("langId", lng);
    }
    const fetchedData = await getPageData();
    setPageContent(fetchedData);
  };

  useEffect(() => {
    // Get all elements with the class name 'lang_btn'
    const langBtns = document.getElementsByClassName("lang_btn");

    // Add click event listener to each button
    for (let i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener("click", changeLanguage);
    }

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      for (let i = 0; i < langBtns.length; i++) {
        langBtns[i].removeEventListener("click", changeLanguage);
      }
    };
  }, []);

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await getPageData();
      setPageContent(fetchedData);
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, [lang_id]);

  return (
    <div className="flex justify-center items-center py-8">
      <div dangerouslySetInnerHTML={{ __html: pageContent }} />
    </div>
  );
};

export default InfoPage;
