"use client";
import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  UilTrashAlt,
  UilTable,
  UilHeart,
  UilComparison,
  UilStar,
  UilInfo,
} from "@iconscout/react-unicons";
import {
  UisStar,
  UisAngleLeft,
  UisAngleRight,
} from "@iconscout/react-unicons-solid";
import { UisListUl } from "@iconscout/react-unicons-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { faScaleUnbalanced } from "@fortawesome/free-solid-svg-icons";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { API_URL } from "@/constants";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export default function Products() {
  const { t, i18n } = useTranslation();

  const pathname = useParams();
  const id = pathname.id;

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

  async function fetchData() {
    const params = new URLSearchParams();
    params.append("TypeId", id);
    params.append("SessionId", session_id);
    params.append("LanguageID", lang_id);

    const response = await fetch(
      `${API_URL}/api/products/get-index?${params.toString()}`,
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
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const [data, setData] = useState({
    products: [],
    pageName: [],
    attributeNames: [],
    attributeValues: [],
    pageCount: [],
    typeId: [],
  });

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await fetchData();
      setData(fetchedData);
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, [lang_id]);

  const products = data.products;
  const attributeNames = data.attributeNames;
  const attributeValues = data.attributeValues;
  const pageName = data.pageName;
  const typeId = data.typeId;

  let addFavorite = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let status;
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    try {
      const res = await fetch(
        `${API_URL}/api/favorites/add-favorite`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: prodid,
          }),
        }
      );
      const resJson = await res.json();
      //if (res.status === 200) {
      status = resJson.status;
      if (status === 401) {
        try {
          let token = "";
          let refreshToken = "";
          if (typeof localStorage !== "undefined") {
            token = localStorage.getItem("jwtToken");
            refreshToken = localStorage.getItem("refreshToken");
          }
          let response = await fetch(
            `${API_URL}/api/account/refresh-token?userRefreshToken=${refreshToken}`,
            {
              method: "POST",
              dataType: "json",
              headers: {
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + token,
              },
            }
          );
          const resp = await response.json();
          if (resp.status !== 400) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("refreshToken", resp.output.refreshToken);
              localStorage.setItem("jwtToken", resp.output.token);
            }
            await addFavorite();
          } else {
            window.location.href = "/login";
          }
        } catch {
          console.log("error");
        }
      } else {
        var fav_icons = document.querySelectorAll(".fav_icon_reg");
        for (let i = 0; i < fav_icons.length; i++) {
          if (fav_icons[i].getAttribute("id") == prodid) {
            fav_icons[i].style.display = "none";
            fav_icons[i].nextSibling.style.display = "block";
          }
        }
      }
      //}
      //else
      //{
      //console.log("Some error occured");
      //}
    } catch (err) {
      console.log(err);
    }
  };

  let removeFavorite = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let status;
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    //e.preventDefault();
    try {
      const res = await fetch(
        `${API_URL}/api/favorites/remove-favorite`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            Id: prodid,
          }),
        }
      );
      const resJson = await res.json();
      //if (res.status === 200) {

      status = resJson.status;

      if (status === 401) {
        try {
          let token = "";
          let refreshToken = "";
          if (typeof localStorage !== "undefined") {
            token = localStorage.getItem("jwtToken");
            refreshToken = localStorage.getItem("refreshToken");
          }
          let response = await fetch(
            `${API_URL}/api/account/refresh-token?userRefreshToken=${refreshToken}`,
            {
              method: "POST",
              dataType: "json",
              headers: {
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: "Bearer " + token,
              },
            }
          );
          const resp = await response.json();
          if (resp.status !== 400) {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("refreshToken", resp.output.refreshToken);
              localStorage.setItem("jwtToken", resp.output.token);
            }

            await removeFavorite();
          } else {
            window.location.href = "/login";
            //go to login page
            //alert(1)
          }
        } catch {
          console.log("error");
        }
      } else {
        var fav_icons = document.querySelectorAll(".fav_icon_solid");
        for (let i = 0; i < fav_icons.length; i++) {
          if (fav_icons[i].getAttribute("id") == prodid) {
            fav_icons[i].style.display = "none";
            fav_icons[i].previousSibling.style.display = "block";
          }
        }
        //setMessage("Added");
      }
      //}
      //else
      //{
      // console.log("Some error occured");
      //}
    } catch (err) {
      console.log(err);
    }
  };

  let addCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    const quantity = event.currentTarget.previousSibling.value;
    try {
      const res = await fetch(`${API_URL}/api/cart/add-to-cart`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity: quantity,
          SessionId: session_id,
        }),
      });

      if (res.status === 200) {
        const resJson = await res.json();
        if (resJson.output.kind == "Failure") {
          Swal.fire({
            title: "Stock error!",
            text: resJson.output.message,
            icon: "error",
            showConfirmButton: false,
            timer: 4000,
          });
        } else {
          const cart_id = resJson.output.cart[0].id;
          var add_cart_btns = document.querySelectorAll(".add_cart_btn");
          for (let i = 0; i < add_cart_btns.length; i++) {
            if (add_cart_btns[i].getAttribute("id") == prodid) {
              add_cart_btns[i].parentElement.innerHTML =
                '<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
                quantity +
                '" id="' +
                prodid +
                '" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="' +
                cart_id +
                '"><button class="rounded-full font-bold inline-block text-base plus_button" id="' +
                prodid +
                '"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="' +
                prodid +
                '"><span>-</span></button></div>';
              add_cart_btns[i].remove();
            }
          }
          var plus_btns = document.querySelectorAll(".plus_button");
          for (let i = 0; i < plus_btns.length; i++) {
            plus_btns[i].addEventListener("click", plusCart);
          }
          var minus_btns = document.querySelectorAll(".minus_button");
          for (let i = 0; i < minus_btns.length; i++) {
            minus_btns[i].addEventListener("click", minusCart);
          }
          var cart_quants = document.querySelectorAll(".cart_quant_update");
          for (let i = 0; i < cart_quants.length; i++) {
            cart_quants[i].addEventListener("keyup", updateInput);
          }
          document.getElementById("cart_drop").style.display = "block";
          var cart_dropdown = document.getElementById("cart_dropdown");
          var append_cart = ``;
          var cart = resJson.output.cart;
          for (let i = 0; i < cart.length; i++) {
            append_cart += `<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" class='cover' alt="${
              cart[i].productName
            }"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 class='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[
                  i
                ].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
              cart[i].id
            } tabindex=${cart[i].productId}><span>x</span></div>
              
            </div>
        </div>`;
          }
          cart_dropdown.innerHTML = append_cart;
          document.getElementById("cart_subtotal").innerText =
            resJson.output.total.toFixed(2) + "₼";
          document.getElementById("cart_quantity").innerText =
            resJson.output.totalQuantity;
          document.getElementById("cart_quantity").style.display = "flex";
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let removeCart = async (event) => {
    let cartid = event.currentTarget.getAttribute("id");
    let prodid = event.currentTarget.getAttribute("tabindex");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch(
        `${API_URL}/api/cart/remove-from-cart`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            CartId: cartid,
            SessionId: session_id,
          }),
        }
      );
      const resJson = await res.json();

      if (res.status === 200) {
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            min_plus_btns[i].parentElement.innerHTML =
              '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
              prodid +
              '" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>';
          }
        }
        var add_btns = document.querySelectorAll(".add_cart_btn");
        for (let i = 0; i < add_btns.length; i++) {
          add_btns[i].addEventListener("click", addCart);
        }
        var cart_dropdown = document.getElementById("cart_dropdown");
        var append_cart = ``;
        var cart = resJson.output.cart;
        if (cart.length == 0) {
          document.getElementById("cart_drop").style.display = "none";
          document.getElementById("cart_quantity").style.display = "none";
        } else {
          for (let i = 0; i < cart.length; i++) {
            append_cart += `<div class='cartdropdown-item flex gap-3'>
              <div class='img relative'>
                <img src=${
                  cart[i].productImage
                } width="82" height="82" class='cover' alt="${
              cart[i].productName
            }"></img>
                <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                  cart[i].quantity
                }x</span>
              </div>
              <div class='content'> 
                  <Link href='/product/${
                    cart[i].productId
                  }'><h5 class='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                  <h6 class='text-sm text-rose-600 font-semibold'>${cart[
                    i
                  ].price.toFixed(2)}₼</h6>
              </div>
              <div class='remove-cart-item'>
              <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
                cart[i].id
              } tabindex=${cart[i].productId}><span>x</span></div>
              </div>
          </div>`;
          }
          cart_dropdown.innerHTML = append_cart;
          document.getElementById("cart_subtotal").innerText =
            resJson.output.total.toFixed(2) + "₼";
          document.getElementById("cart_quantity").innerText =
            resJson.output.totalQuantity;
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let plusCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let cartid = event.currentTarget.parentElement.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let quantity = event.currentTarget.parentElement.previousSibling.value;
    quantity++;
    try {
      const res = await fetch(`${API_URL}/api/cart/update-cart`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity: quantity,
          SessionId: session_id,
        }),
      });
      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.output.kind == "Failure") {
          Swal.fire({
            title: "Stock error!",
            text: resJson.output.message,
            icon: "error",
            showConfirmButton: false,
            timer: 4000,
          });
        } else {
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].previousSibling.value = quantity;
            }
          }
          var cart_dropdown = document.getElementById("cart_dropdown");
          var append_cart = ``;
          var cart = resJson.output.cart;
          for (let i = 0; i < cart.length; i++) {
            append_cart += `<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" class='cover' alt="${
              cart[i].productName
            }"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 class='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[
                  i
                ].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
              cart[i].id
            } tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`;
          }
          cart_dropdown.innerHTML = append_cart;
          document.getElementById("cart_subtotal").innerText =
            resJson.output.total.toFixed(2) + "₼";
          document.getElementById("cart_quantity").innerText =
            resJson.output.totalQuantity;
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let minusCart = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let cartid = event.currentTarget.parentElement.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let quantity = event.currentTarget.parentElement.previousSibling.value;
    quantity--;
    if (quantity > 0) {
      try {
        const res = await fetch(
          `${API_URL}/api/cart/update-cart`,
          {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              ProductId: prodid,
              Quantity: quantity,
              SessionId: session_id,
            }),
          }
        );
        const resJson = await res.json();

        if (res.status === 200) {
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].previousSibling.value = quantity;
            }
          }
          var cart_dropdown = document.getElementById("cart_dropdown");
          var append_cart = ``;
          var cart = resJson.output.cart;
          for (let i = 0; i < cart.length; i++) {
            append_cart += `<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" class='cover' alt="${
              cart[i].productName
            }"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 class='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[
                  i
                ].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
              cart[i].id
            } tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`;
          }
          cart_dropdown.innerHTML = append_cart;
          document.getElementById("cart_subtotal").innerText =
            resJson.output.total.toFixed(2) + "₼";
          document.getElementById("cart_quantity").innerText =
            resJson.output.totalQuantity;
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await fetch(
          `${API_URL}/api/cart/remove-from-cart`,
          {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
              CartId: cartid,
              SessionId: session_id,
            }),
          }
        );
        const resJson = await res.json();

        if (res.status === 200) {
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].parentElement.innerHTML =
                '<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
                prodid +
                '" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>';
            }
          }
          var add_btns = document.querySelectorAll(".add_cart_btn");
          for (let i = 0; i < add_btns.length; i++) {
            add_btns[i].addEventListener("click", addCart);
          }
          var cart = resJson.output.cart;
          if (cart.length == 0) {
            document.getElementById("cart_drop").style.display = "none";
            document.getElementById("cart_quantity").style.display = "none";
          } else {
            var cart_dropdown = document.getElementById("cart_dropdown");
            var append_cart = ``;
            var cart = resJson.output.cart;
            for (let i = 0; i < cart.length; i++) {
              append_cart += `<div class='cartdropdown-item flex gap-3'>
              <div class='img relative'>
                <img src=${
                  cart[i].productImage
                } width="82" height="82" class='cover' alt="${
                cart[i].productName
              }"></img>
                <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                  cart[i].quantity
                }x</span>
              </div>
              <div class='content'> 
                  <Link href='/product/${
                    cart[i].productId
                  }'><h5 class='hover-red text-sm mb-1'>${
                cart[i].productName
              }</h5></Link>
                  <h6 class='text-sm text-rose-600 font-semibold'>${cart[
                    i
                  ].price.toFixed(2)}₼</h6>
              </div>
              <div class='remove-cart-item'>
              <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
                cart[i].id
              } tabindex=${cart[i].productId}><span>x</span></div>
              </div>
          </div>`;
            }
            cart_dropdown.innerHTML = append_cart;
            document.getElementById("cart_subtotal").innerText =
              resJson.output.total.toFixed(2) + "₼";
            document.getElementById("cart_quantity").innerText =
              resJson.output.totalQuantity;
            let remove_carts = document.getElementsByClassName("remove-cart");
            for (let i = 0; i < remove_carts.length; i++) {
              remove_carts[i].addEventListener("click", removeCart);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  let updateInput = (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let quantity = event.currentTarget.value;
    let cartid = event.currentTarget.nextSibling.getAttribute("id");
    event.currentTarget.parentElement.innerHTML =
      '<input class="cart_quant" type="number" min="1" max="10000" value="' +
      quantity +
      '" id="' +
      prodid +
      '"  /><button type="button" class="rounded-full font-bold inline-block text-base update_button" id="' +
      cartid +
      '"><span>' +
      t("Update") +
      "</span></button>";
    var update_btns = document.querySelectorAll(".update_button");
    for (let i = 0; i < update_btns.length; i++) {
      update_btns[i].addEventListener("click", updateCart);
    }
  };

  let updateCart = async (event) => {
    let prodid = event.currentTarget.previousSibling.getAttribute("id");
    let quantity = event.currentTarget.previousSibling.value;
    let cartid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    let update_button = event.currentTarget;
    try {
      const res = await fetch(`${API_URL}/api/cart/update-cart`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity: quantity,
          SessionId: session_id,
        }),
      });
      const resJson = await res.json();

      if (res.status === 200) {
        if (resJson.output.kind == "Failure") {
          Swal.fire({
            title: "Stock error!",
            text: resJson.output.message,
            icon: "error",
            showConfirmButton: false,
            timer: 4000,
          });
        } else {
          update_button.parentElement.innerHTML =
            '<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
            quantity +
            '" id="' +
            prodid +
            '" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="' +
            cartid +
            '"><button class="rounded-full font-bold inline-block text-base plus_button" id="' +
            prodid +
            '"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="' +
            prodid +
            '"><span>-</span></button></div>';
          var plus_btns = document.querySelectorAll(".plus_button");
          for (let i = 0; i < plus_btns.length; i++) {
            plus_btns[i].addEventListener("click", plusCart);
          }
          var minus_btns = document.querySelectorAll(".minus_button");
          for (let i = 0; i < minus_btns.length; i++) {
            minus_btns[i].addEventListener("click", minusCart);
          }
          var cart_quants = document.querySelectorAll(".cart_quant_update");
          for (let i = 0; i < cart_quants.length; i++) {
            cart_quants[i].addEventListener("keyup", updateInput);
          }
          var cart_dropdown = document.getElementById("cart_dropdown");
          var append_cart = ``;
          var cart = resJson.output.cart;
          for (let i = 0; i < cart.length; i++) {
            append_cart += `<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" class='cover' alt="${
              cart[i].productName
            }"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 class='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[
                  i
                ].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${
              cart[i].id
            } tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`;
          }
          cart_dropdown.innerHTML = append_cart;
          document.getElementById("cart_subtotal").innerText =
            resJson.output.total.toFixed(2) + "₼";
          document.getElementById("cart_quantity").innerText =
            resJson.output.totalQuantity;
          let remove_carts = document.getElementsByClassName("remove-cart");
          for (let i = 0; i < remove_carts.length; i++) {
            remove_carts[i].addEventListener("click", removeCart);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let addCompare = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch(
        `${API_URL}/api/compare/add-compare`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: prodid,
            SessionId: session_id,
            LanguageID: lang_id,
          }),
        }
      );
      const resJson = await res.json();

      if (resJson.output.message) {
        Swal.fire(resJson.output.message);
      }
      if (res.status === 200) {
        var comp_icons = document.querySelectorAll(".comp_icon_reg");
        for (let i = 0; i < comp_icons.length; i++) {
          if (comp_icons[i].getAttribute("id") == prodid) {
            comp_icons[i].style.display = "none";
            comp_icons[i].nextSibling.style.display = "block";
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  let removeCompare = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let token = "";
    let session_id = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
      session_id = localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch(
        `${API_URL}/api/compare/remove-compare`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            ProductId: prodid,
            SessionId: session_id,
          }),
        }
      );

      if (res.status === 200) {
        const resJson = await res.json();
        var comp_icons = document.querySelectorAll(".comp_icon_solid");
        for (let i = 0; i < comp_icons.length; i++) {
          if (comp_icons[i].getAttribute("id") == prodid) {
            comp_icons[i].style.display = "none";
            comp_icons[i].previousSibling.style.display = "block";
          }
        }
        //console.log("success add compare")
      }
    } catch (err) {
      console.log(err);
    }
  };
  let productSorting = async (event) => {
    let sorting = event.currentTarget.value;
    const token = localStorage.getItem("jwtToken");
    const session_id = localStorage.getItem("sessionId");

    try {
      const res = await fetch(`${API_URL}/api/products/sorting`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          TypeId: typeId,
          SessionId: session_id,
          Atributes: [],
          Sorting: sorting,
        }),
      });
      const resJson = await res.json();
      setData(resJson.output);
    } catch (err) {
      console.log(err);
    }
  };

  const [myArray, setMyArray] = useState([]);
  var newArray = [...myArray];
  let addFilter = (e) => {
    let val = e.currentTarget.value;
    let index = newArray.indexOf(val);
    if (index == -1) {
      newArray.push(val);
      setMyArray(newArray);
    } else {
      newArray.splice(index, 1);
      setMyArray(newArray);
    }
  };

  let productFiltering = async () => {
    const token = localStorage.getItem("jwtToken");
    const session_id = localStorage.getItem("sessionId");
    const min_price = parseFloat(document.getElementById("min_price").value);
    const max_price = parseFloat(document.getElementById("max_price").value);
    try {
      const res = await fetch(`${API_URL}/api/products/filtering`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          TypeId: typeId,
          AttrArrays: newArray,
          SessionId: session_id,
          MinPrice: min_price,
          MaxPrice: max_price,
        }),
      });
      const resJson = await res.json();
      setData(resJson.output);
      //products=resJson.output.products
      //console.log(resJson)
    } catch (err) {
      console.log(err);
    }
  };

  // Pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(24); // Adjust as needed
  // const [activePage, setActivePage] = useState(1); // Track active page

  // // Function to filter and paginate data
  // const getFilteredAndPaginatedData = () => {
  //     const indexOfLastItem = currentPage * itemsPerPage;
  //     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //     const filteredData =products.flatMap(item => item);
  //     // .filter((button) => button.name.toLowerCase().includes(filter.toLowerCase()));

  //     // Pagination logic with ellipses
  //     const paginateWithDots = (currentPage, totalPages, adjacentPages) => {
  //         const pages = [];
  //         let ellipsesShown = false;

  //         // Left ellipses
  //         if (currentPage > (adjacentPages + 1)) {
  //             pages.push(1);
  //             if (currentPage > (adjacentPages + 2)) {
  //                 pages.push('...');
  //             }
  //             ellipsesShown = true;
  //         }

  //         // Pages within range
  //         for (let page = Math.max(1, currentPage - adjacentPages); page <= Math.min(totalPages, currentPage + adjacentPages); page++) {
  //             pages.push(page);
  //         }

  //         // Right ellipses
  //         if (currentPage < (totalPages - adjacentPages)) {
  //             if (!ellipsesShown) {
  //                 pages.push('...');
  //             }
  //             if (currentPage < (totalPages - adjacentPages - 1)) {
  //                 pages.push(totalPages);
  //             }
  //         }

  //         return pages;
  //     };

  //     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  //     const paginatedPages = paginateWithDots(currentPage, totalPages, 2); // Adjust adjacent pages as needed

  //     const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  //     return { currentItems, paginatedPages };
  // };

  // const { currentItems, paginatedPages } = getFilteredAndPaginatedData();

  // const goToNextPage = () => {
  //    setCurrentPage(currentPage + 1);
  //    setActivePage(currentPage + 1);
  //    window.scrollTo(0, 0)
  // };
  // const goToPreviousPage = () => {
  //    setCurrentPage(currentPage - 1);
  //    setActivePage(currentPage - 1);
  //    window.scrollTo(0, 0)
  // };
  // const goToPage = (pageNumber) => {
  //    setCurrentPage(pageNumber);
  //    setActivePage(pageNumber);
  //    window.scrollTo(0, 0)
  // };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper py-8">
        <div className="custom-container mx-auto">
          <div className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-medium"
                >
                  {" "}
                  {t("Home")}{" "}
                </a>
              </li>

              <li>
                <div className="flex items-center">
                  <a href="#" className="ms-1 text-sm font-medium md:ms-2">
                    {pageName}
                  </a>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <section className="category-main-section mt-5 pt-16">
        <div className="frd-container mx-auto">
          <div className="category-page-grid block lg:flex">
            <div className="category-filters w-full lg:w-1/4 px-4 lg:pr-8">
              {/* Clear All */}
              {/* <button className='cf-clear-all-btn hover-red-bg flex justify-center gap-2 w-full font-bold text-base'><UilTrashAlt size='22' color='#333'/> CLEAR ALL</button> */}

              {/* Availability */}
              {attributeNames.map((attrname) => {
                return (
                  <Accordion
                    open={open === attrname.id}
                    className="mt-6 p-4"
                    icon={<Icon id={attrname.id} open={open} />}
                  >
                    <AccordionHeader
                      onClick={() => handleOpen(attrname.id)}
                      className="font-medium"
                    >
                      {attrname.attrName}
                    </AccordionHeader>
                    <AccordionBody>
                      {/* <div className='flex justify-between mb-4'>
                                     <span className='cf-selected-span'>0 selected</span>
                                     <span className='border-dotted border-b border-b-stone-600 cursor-pointer hover-red'>Reset</span>
                                  </div> */}
                      <div className="category-filters-boxes">
                        {attributeValues
                          .filter((v) => v.nameId == attrname.id)
                          .map((value) => {
                            return (
                              <div className="flex items-center gap-1">
                                <label
                                  class="relative flex items-center p-2 rounded-full cursor-pointer"
                                  htmlFor="blue"
                                >
                                  <input
                                    type="checkbox"
                                    class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                    id="blue"
                                    onChange={addFilter}
                                    value={value.valueId}
                                  />
                                  <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-3.5 w-3.5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      stroke="currentColor"
                                      stroke-width="1"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                      ></path>
                                    </svg>
                                  </span>
                                </label>
                                <label for="blue">{value.valueName}</label>
                              </div>
                            );
                          })}
                      </div>
                    </AccordionBody>
                  </Accordion>
                );
              })}

              {/* Price */}
              <Accordion
                open={open === 4}
                className="mt-6 p-4"
                icon={<Icon id={4} open={open} />}
              >
                <AccordionHeader
                  onClick={() => handleOpen(4)}
                  className="font-medium"
                >
                  {t("Price Slider")}
                </AccordionHeader>
                <AccordionBody>
                  <div className="flex justify-between mb-4">
                    <span className="cf-selected-span">{t("selected")}</span>
                    <span className="border-dotted border-b border-b-stone-600 cursor-pointer hover-red">
                      {t("Reset")}
                    </span>
                  </div>
                  <div className="category-filters-boxes-price flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      min="0"
                      id="min_price"
                    />
                    -
                    <input type="number" placeholder="0" id="max_price" />
                  </div>
                </AccordionBody>
              </Accordion>
              <button
                className="cf-clear-all-btn hover-red-bg flex justify-center gap-2 w-full font-bold text-base mt-6"
                onClick={productFiltering}
              >
                {" "}
                {t("APPLY")}
              </button>
            </div>
            <div className="category-products w-full lg:w-3/4 px-4">
              <div className="cp-top-wrap p-4 mt-7 lg:mt-0 flex justify-between items-center mb-8">
                {/*  */}
                <div className="flex items-center gap-2">
                  <UilTable size="23" className="active" />
                  <UisListUl size="25" />
                </div>

                {/*  */}
                <div>
                  <p className="m-0 text-sm">
                    {t("Showing")} {products.length} {t("results")}
                  </p>
                </div>

                {/*  */}
                <div className="flex items-center gap-3">
                  <h5 className="text-sm font-semibold">{t("Sort By")}: </h5>
                  <select
                    className="outline-none text-sm"
                    onChange={productSorting}
                  >
                    <option value="" selected hidden disabled>
                      {t("Choose")}
                    </option>
                    <option value="Name ASC">{t("Alfabetically A-Z")}</option>
                    <option value="Name DESC">{t("Alfabetically Z-A")}</option>
                    <option value="Price ASC">{t("Price low to high")}</option>
                    <option value="Price Desc">{t("Price high to low")}</option>
                    <option value="Latest">{t("Latest")}</option>
                  </select>
                </div>
              </div>

              <div className="cp-main-products">
                {data?.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {data?.products.map((product) => {
                      const items = [];
                      for (let i = 1; i <= 5; i++) {
                        if (product.starCount >= i) {
                          items.push(<UisStar size="18" color="#ffc400" />);
                        } else {
                          items.push(<UilStar size="18" color="#ffc400" />);
                        }
                      }
                      const images = [];
                      images.push(
                        <Image
                          src={product.mainImage}
                          width="300"
                          height="400"
                          class="latest-product-swiper-item-img object-cover w-full h-full"
                          alt={product.name}
                        />
                      );
                      if (product.secondImage == null) {
                        images.push(
                          <Image
                            src={product.mainImage}
                            width="300"
                            height="400"
                            class="latest-product-swiper-item-img object-cover w-full h-full"
                            alt={product.name}
                          />
                        );
                      } else {
                        images.push(
                          <Image
                            src={product.secondImage}
                            width="300"
                            height="400"
                            class="latest-product-swiper-item-img object-cover w-full h-full"
                            alt={product.name}
                          />
                        );
                      }

                      const fav_icon = [];
                      if (product.favorite == 0) {
                        fav_icon.push(
                          <div className="wishlist-icon flex items-center justify-center hover-red-bg">
                            <FontAwesomeIcon
                              className="fav_icon_reg"
                              icon={regularHeart}
                              style={{ fontSize: 22 }}
                              color="#ffffff"
                              onClick={addFavorite}
                              id={product.id}
                            />
                            <FontAwesomeIcon
                              style={{ display: "none", fontSize: 22 }}
                              className="fav_icon_solid"
                              icon={solidHeart}
                              color="#ffffff"
                              onClick={removeFavorite}
                              id={product.id}
                            />
                          </div>
                        );
                      } else {
                        fav_icon.push(
                          <div className="wishlist-icon flex items-center justify-center hover-red-bg">
                            <FontAwesomeIcon
                              style={{ display: "none", fontSize: 22 }}
                              className="fav_icon_reg"
                              icon={regularHeart}
                              color="#ffffff"
                              onClick={addFavorite}
                              id={product.id}
                            />
                            <FontAwesomeIcon
                              className="fav_icon_solid"
                              icon={solidHeart}
                              style={{ fontSize: 22 }}
                              color="#ffffff"
                              onClick={removeFavorite}
                              id={product.id}
                            />
                          </div>
                        );
                      }
                      const add_cart_div = [];
                      if (product.quantity > 0) {
                        add_cart_div.push(
                          <div className="add-to-cart-wrap pm flex items-center justify-center gap-2">
                            <input
                              class="cart_quant cart_quant_update"
                              type="number"
                              min="1"
                              max="10000"
                              defaultValue={product.quantity}
                              onKeyUp={updateInput}
                              id={product.id}
                            />
                            <div
                              className="flex gap-2 pm-wrap minus_plus_btn"
                              id={product.cartId}
                            >
                              <button
                                type="button"
                                className="rounded-full font-bold inline-block text-base plus_button"
                                onClick={plusCart}
                                id={product.id}
                              >
                                <span>+</span>
                              </button>
                              <button
                                type="button"
                                className="rounded-full font-bold inline-block text-base minus_button"
                                onClick={minusCart}
                                id={product.id}
                              >
                                <span>-</span>
                              </button>
                            </div>
                          </div>
                        );
                      } else {
                        add_cart_div.push(
                          <div className="add-to-cart-wrap flex items-center justify-center gap-2">
                            <input
                              class="cart_quant"
                              type="number"
                              min="1"
                              max="10000"
                              defaultValue="1"
                            />
                            <button
                              type="button"
                              onClick={addCart}
                              id={product.id}
                              className="rounded-full font-bold inline-block text-base add_cart_btn"
                            >
                              {t("Add")}
                            </button>
                          </div>
                        );
                      }
                      const compare_div = [];
                      if (product.compared == 0) {
                        compare_div.push(
                          <div className="compare-icon flex items-center justify-center hover-red-bg">
                            <FontAwesomeIcon
                              className="comp_icon_reg"
                              icon={faScaleUnbalanced}
                              style={{ fontSize: 22 }}
                              color="#ffffff"
                              onClick={addCompare}
                              id={product.id}
                            />
                            <FontAwesomeIcon
                              style={{ display: "none", fontSize: 22 }}
                              className="comp_icon_solid"
                              icon={faScaleBalanced}
                              color="#ffffff"
                              onClick={removeCompare}
                              id={product.id}
                            />
                          </div>
                        );
                      } else {
                        compare_div.push(
                          <div className="compare-icon flex items-center justify-center hover-red-bg">
                            <FontAwesomeIcon
                              style={{ display: "none", fontSize: 22 }}
                              className="comp_icon_reg"
                              icon={faScaleUnbalanced}
                              color="#ffffff"
                              onClick={addCompare}
                              id={product.id}
                            />
                            <FontAwesomeIcon
                              className="comp_icon_solid"
                              icon={faScaleBalanced}
                              style={{ fontSize: 22 }}
                              color="#ffffff"
                              onClick={removeCompare}
                              id={product.id}
                            />
                          </div>
                        );
                      }

                      return (
                        <div className="zoom-img category-product-item mb-5 pb-5 relative">
                          <div className="category-product-item-img-wrap w-full overflow-hidden relative aspect-square">
                            <Link href={`/product/${product.id}`} className="">
                              {images}
                            </Link>
                            <div className="hover-item-wrap flex items-center justify-center gap-3">
                              {fav_icon}
                              {compare_div}
                            </div>
                          </div>
                          <div className="category-product-item-content pt-5 mt-1 px-3">
                            <div className="rating flex gap-1 justify-center">
                              {items}
                            </div>
                            <div className="name text-center my-2">
                              <Link
                                href={`/product/${product.id}`}
                                className="hover-red text-lg"
                              >
                                {product.name}
                              </Link>
                            </div>
                            <div className="price flex justify-center items-center gap-2">
                              <span className="inline-block text-lg font-bold ls-5">
                                {product.price.toFixed(2)}₼
                              </span>
                              {/* <del className='inline-block text-sm'>$119.00</del> */}
                            </div>
                            <div className="add-to-cart">{add_cart_div}</div>
                          </div>

                          {product.about != null ? (
                            <div className="info-icon absolute ">
                              <div className="info-icon-circle flex items-center justify-center hover-red-bg">
                                <UilInfo size="30" color="#ffffff" />
                              </div>
                              <div className="info-icon-box">
                                <div className="info-icon-box-table">
                                  <div className="sp-table-head">
                                    {product.about.substring(0, 300)}...
                                  </div>
                                </div>
                              </div>
                                        
                            </div>
                          ) : (
                            <div className="info-icon absolute ">
                              <div className="info-icon-circle flex items-center justify-center hover-red-bg">
                                <UilInfo size="30" color="#ffffff" />
                              </div>
                                        
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>{t("There is no product!")}</div>
                )}
              </div>
              {/* <div className="pagination-wrapper">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                  <UisAngleLeft size="18" color="#ffc400" />
                </button>
                {paginatedPages.map((page, index) => (
                  <span key={index}>
                    {page === "..." ? (
                      <span>...</span>
                    ) : (
                      <button
                        onClick={() => goToPage(page)}
                        className={activePage === page ? "active_pag_btn" : ""}
                      >
                        {page}
                      </button>
                    )}
                  </span>
                ))}
                <button
                  onClick={goToNextPage}
                  disabled={
                    currentPage === Math.ceil(products.length / itemsPerPage)
                  }
                >
                  <UisAngleRight size="18" color="#ffc400" />
                </button>
                        {" "}
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
