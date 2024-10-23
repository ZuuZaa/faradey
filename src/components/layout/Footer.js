"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n";
import Link from "next/link";
import Image from "next/image";
import Pcard from "../../../public/images/footer/Payment2.png";
import FColImg1 from "../../../public/images/footer/app-store.webp";
import FColImg2 from "../../../public/images/footer/google-play.webp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faMagnifyingGlass as faSearch,
  faBars,
  faShoppingBag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (event) => {
    const lng = event.currentTarget.textContent;
    //console.log(lng)
    await i18n.changeLanguage(lng);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("langId", lng);
    }
    const fetchedData = await fetchData();
    setData(fetchedData);
  };
  let lang_id = "EN";
  async function fetchData() {
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem("langId") != null) {
        lang_id = localStorage.getItem("langId");
      }
    }
    const params = new URLSearchParams();
    params.append("LanguageID", lang_id);
    const response = await fetch(
      `http://89.40.2.200:3461/api/layout/get-footer?${params.toString()}`
    );
    const data = await response.json();
    return data.output;
  }
  const [data, setData] = useState({
    settings: [],
    socialMedia: [],
  });

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setData(fetchedData);
      await i18n.changeLanguage(lang_id);
    }

    fetchDataAsync();
  }, []);
  const settings = data.settings;
  // useEffect(() => {
  //     // Get all elements with the class name 'lang_btn'
  //     const langBtns = document.getElementsByClassName('lang_btn');

  //     // Add click event listener to each button
  //     for (let i = 0; i < langBtns.length; i++) {
  //       langBtns[i].addEventListener('click', changeLanguage);
  //     }

  //     // Cleanup function to remove event listeners when the component unmounts
  //     return () => {
  //       for (let i = 0; i < langBtns.length; i++) {
  //         langBtns[i].removeEventListener('click', changeLanguage);
  //       }
  //     };
  //   }, []);
  return (
    <footer className="mt-10">
      <section className="top-footer pt-70 pb-30">
        <div className="frd-container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
            <div className="footer-col mb-5 sm:mb-7 lg:mb-10">
              <h5 className="footer-col-title text-base font-semibold mb-5">
                {t("Contact")}
              </h5>
              <ul className="footer-col-ul">
                {settings?.length > 0 && (
                  <>
                    <li className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        color="#222"
                        className="text-s"
                      />
                      <span>{settings?.[0]?.address} </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faPhone}
                        color="#222"
                        className="text-lg"
                      />
                      <span>{settings?.[0]?.phone}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        color="#222"
                        className="text-lg"
                      />
                      <span>{settings?.[0]?.email}</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="footer-col mb-5 sm:mb-7 lg:mb-10">
              <h5 className="footer-col-title text-base font-semibold mb-5">
                {t("Support")}
              </h5>
              <ul className="footer-col-ul">
                <li>
                  <Link href="/about">{t("About")}</Link>
                </li>
                <li>
                  <Link href="/contact">{t("Contact")}</Link>
                </li>
                <li>
                  <Link href="/faq">{t("FAQ")}</Link>
                </li>
                <li>
                  <Link href="/blogs">{t("Blogs")}</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col mb-5 sm:mb-7 lg:mb-10">
              <h5 className="footer-col-title text-base font-semibold mb-5">
                {t("Our Products")}
              </h5>
              <ul className="footer-col-ul">
                <li>
                  <Link href="/products/3">{t("Trending Products")}</Link>
                </li>
                <li>
                  <Link href="/products/2">{t("Best Seller Products")}</Link>
                </li>
                <li>
                  <Link href="/products/4">{t("New Products")}</Link>
                </li>
                <li>
                  <Link href="/products/1">{t("Featured Products")}</Link>
                </li>
              </ul>
            </div>
            <div className="footer-col mb-5 sm:mb-7 lg:mb-10">
              <h5 className="footer-col-title text-base font-semibold mb-5">
                {t("Information")}
              </h5>
              <ul className="footer-col-ul">
                <li>
                  <Link href="#" target="_blank">
                    {t("Privacy&Policy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" target="_blank">
                    {t("Refund Policy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" target="_blank">
                    {t("Delivery Information")}
                  </Link>
                </li>
                <li>
                  <Link href="#" target="_blank">
                    {t("Terms&Conditions")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="bottom-footer">
        <div className="frd-container mx-auto py-4">
          <div className="flex items-center flex-col justify-center lg:flex-row lg:justify-between">
            <div className="footer-copyright mb-5 text-center lg:text-left lg:mb-0">
              <p>
                Copyright © Faradey | Built by{" "}
                <Link href="https://logix.store">Logix</Link>.
              </p>
            </div>
            {/* <div className="footer-cards flex gap-3">
                        <Image src={Pcard} width={300} height={200} alt="Picture of the author"/>
                    </div> */}
          </div>
        </div>
      </section>
    </footer>
  );
}
