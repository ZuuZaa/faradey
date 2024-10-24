"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../i18n";
//import { useRouter } from 'next/router';
import {
  UilArrowRight,
  UilCalender,
  UilStar,
  UilInfo,
  UilComparison,
} from "@iconscout/react-unicons";
import { UisStar } from "@iconscout/react-unicons-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { faScaleUnbalanced } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import {
  Autoplay,
  Pagination,
  Navigation,
  HashNavigation,
} from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getMainData } from "../_fetch";

const MainPage = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({});
  const lang_id = localStorage.getItem("langId") || "EN";

  useEffect(() => {
    async function fetchDataAsync() {
      const fetchedData = await getMainData();
      setData(fetchedData);
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, [lang_id]);

  let addFavorite = async (event) => {
    let prodid = event.currentTarget.getAttribute("id");
    let status;
    let token = "";
    if (typeof localStorage !== "undefined") {
      token = localStorage.getItem("jwtToken");
    }
    try {
      const res = await fetch(
        "http://89.40.2.200:3461/api/favorites/add-favorite",
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
            `http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,
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
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } catch {
          console.log("error");
        }
      } else {
        //console.log("success favorite")
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
        "http://89.40.2.200:3461/api/favorites/remove-favorite",
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
            `http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,
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
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }

            //go to login page
            //alert(1)
          }
        } catch {
          console.log("error");
        }
      } else {
        //console.log("success remove from favorite")
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

  //change fav icon
  // const [isClicked, setIsClicked] = useState(false);

  // const handleClick = () => {
  //   setIsClicked(!isClicked);
  // };
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
      const res = await fetch("http://89.40.2.200:3461/api/cart/add-to-cart", {
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

      //console.log(cart_id)

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
          //console.log("success add to cart")
          var add_cart_btns = document.querySelectorAll(".add_cart_btn");
          for (let i = 0; i < add_cart_btns.length; i++) {
            if (add_cart_btns[i].getAttribute("id") == prodid) {
              add_cart_btns[i].parentElement.innerHTML =
                '<input className="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
                quantity +
                '" id="' +
                prodid +
                '" /><div className="flex gap-2 pm-wrap minus_plus_btn" id="' +
                cart_id +
                '"><button className="rounded-full font-bold inline-block text-base plus_button" id="' +
                prodid +
                '"><span>+</span></button><button className="rounded-full font-bold inline-block text-base minus_button" id="' +
                prodid +
                '"><span>-</span></button></div>';
              //add_cart_btns[i].remove();
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
            append_cart += `<div className='cartdropdown-item flex gap-3'>
            <div className='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" className='cover' alt="${
              cart[i].productName
            }"></img>
              <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div className='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 className='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                <h6 className='text-sm text-rose-600 font-semibold'>${cart[
                  i
                ].price.toFixed(2)}₼</h6>
            </div>
            <div className='remove-cart-item'>
            <div width="20" className='text-primary hover-red cursor-pointer remove-cart' id=${
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
        "http://89.40.2.200:3461/api/cart/remove-from-cart",
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

      if (res.status === 200) {
        const resJson = await res.json();
        console.log(resJson);
        //console.log("success remove cart")
        var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
        console.log(min_plus_btns);
        for (let i = 0; i < min_plus_btns.length; i++) {
          if (min_plus_btns[i].getAttribute("id") == cartid) {
            let parentElement = min_plus_btns[i].parentElement;

            // Clear only the specific content that needs to be updated
            while (parentElement.firstChild) {
              parentElement.removeChild(parentElement.firstChild); // Clean out the old children
            }

            // Create the new input element
            let newInput = document.createElement("input");
            newInput.className = "cart_quant";
            newInput.type = "number";
            newInput.min = "1";
            newInput.max = "10000";
            newInput.value = "1";

            // Create the new button element
            let newButton = document.createElement("button");
            newButton.type = "button";
            newButton.id = prodid;
            newButton.className =
              "rounded-full font-bold inline-block text-base add_cart_btn";
            newButton.innerText = "Add";

            // Append the new elements to the parent
            parentElement.appendChild(newInput);
            parentElement.appendChild(newButton);

            // Add event listener for the new button
            newButton.addEventListener("click", addCart);
          }
        }
        //console.log(document.querySelectorAll(".add_cart_btn"))
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
            append_cart += `<div className='cartdropdown-item flex gap-3'>
              <div className='img relative'>
                <img src=${
                  cart[i].productImage
                } width="82" height="82" className='cover' alt="${
              cart[i].productName
            }"></img>
                <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                  cart[i].quantity
                }x</span>
              </div>
              <div className='content'> 
                  <Link href='/product/${
                    cart[i].productId
                  }'><h5 className='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                  <h6 className='text-sm text-rose-600 font-semibold'>${cart[
                    i
                  ].price.toFixed(2)}₼</h6>
              </div>
              <div className='remove-cart-item'>
              <div width="20" className='text-primary hover-red cursor-pointer remove-cart' id=${
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
    //console.log(quantity)
    try {
      const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
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
            append_cart += `<div className='cartdropdown-item flex gap-3'>
                <div className='img relative'>
                  <img src=${
                    cart[i].productImage
                  } width="82" height="82" className='cover' alt="${
              cart[i].productName
            }"></img>
                  <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                    cart[i].quantity
                  }x</span>
                </div>
                <div className='content'> 
                    <Link href='/product/${
                      cart[i].productId
                    }'><h5 className='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                    <h6 className='text-sm text-rose-600 font-semibold'>${cart[
                      i
                    ].price.toFixed(2)}₼</h6>
                </div>
                <div className='remove-cart-item'>
                <div width="20" className='text-primary hover-red cursor-pointer remove-cart' id=${
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
        //console.log("success plus cart")
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
    //console.log(quantity)
    if (quantity > 0) {
      try {
        const res = await fetch(
          "http://89.40.2.200:3461/api/cart/update-cart",
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

        if (res.status === 200) {
          const resJson = await res.json();
          //console.log("success minus cart")
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
            append_cart += `<div className='cartdropdown-item flex gap-3'>
            <div className='img relative'>
              <img src=${
                cart[i].productImage
              } width="82" height="82" className='cover' alt="${
              cart[i].productName
            }"></img>
              <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                cart[i].quantity
              }x</span>
            </div>
            <div className='content'> 
                <Link href='/product/${
                  cart[i].productId
                }'><h5 className='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                <h6 className='text-sm text-rose-600 font-semibold'>${cart[
                  i
                ].price.toFixed(2)}₼</h6>
            </div>
            <div className='remove-cart-item'>
            <div width="20" className='text-primary hover-red cursor-pointer remove-cart' id=${
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
          "http://89.40.2.200:3461/api/cart/remove-from-cart",
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

        if (res.status === 200) {
          const resJson = await res.json();
          //console.log("success remove cart")
          var min_plus_btns = document.querySelectorAll(".minus_plus_btn");
          for (let i = 0; i < min_plus_btns.length; i++) {
            if (min_plus_btns[i].getAttribute("id") == cartid) {
              min_plus_btns[i].parentElement.innerHTML =
                '<input className="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="' +
                prodid +
                '" className="rounded-full font-bold inline-block text-base add_cart_btn">' +
                t("Add") +
                "</button></div>";

              //min_plus_btns[i].remove();
            }
          }
          //console.log(document.querySelectorAll(".add_cart_btn"))
          var add_btns = document.querySelectorAll(".add_cart_btn");
          for (let i = 0; i < add_btns.length; i++) {
            add_btns[i].addEventListener("click", addCart);
          }
          var cart = resJson.output.cart;
          //console.log(cart.length)
          if (cart.length == 0) {
            document.getElementById("cart_drop").style.display = "none";
            document.getElementById("cart_quantity").style.display = "none";
          } else {
            var cart_dropdown = document.getElementById("cart_dropdown");
            var append_cart = ``;
            var cart = resJson.output.cart;
            for (let i = 0; i < cart.length; i++) {
              append_cart += `<div className='cartdropdown-item flex gap-3'>
              <div className='img relative'>
                <img src=${
                  cart[i].productImage
                } width="82" height="82" className='cover' alt="${
                cart[i].productName
              }"></img>
                <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                  cart[i].quantity
                }x</span>
              </div>
              <div className='content'> 
                  <Link href='/product/${
                    cart[i].productId
                  }'><h5 className='hover-red text-sm mb-1'>${
                cart[i].productName
              }</h5></Link>
                  <h6 className='text-sm text-rose-600 font-semibold'>${cart[
                    i
                  ].price.toFixed(2)}₼</h6>
              </div>
              <div className='remove-cart-item'>
              <div width="20" className='text-primary hover-red cursor-pointer remove-cart' id=${
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
      '<input className="cart_quant" type="number" min="1" max="10000" value="' +
      quantity +
      '" id="' +
      prodid +
      '"  /><button type="button" className="rounded-full font-bold inline-block text-base update_button" id="' +
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
      const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
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
          update_button.parentElement.innerHTML =
            '<input className="cart_quant cart_quant_update" type="number" min="1" max="10000" value="' +
            quantity +
            '" id="' +
            prodid +
            '" /><div className="flex gap-2 pm-wrap minus_plus_btn" id="' +
            cartid +
            '"><button className="rounded-full font-bold inline-block text-base plus_button" id="' +
            prodid +
            '"><span>+</span></button><button className="rounded-full font-bold inline-block text-base minus_button" id="' +
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
            append_cart += `<div className='cartdropdown-item flex gap-3'>
                <div className='img relative'>
                  <img src=${
                    cart[i].productImage
                  } width="82" height="82" className='cover' alt="${
              cart[i].productName
            }"></img>
                  <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${
                    cart[i].quantity
                  }x</span>
                </div>
                <div className='content'> 
                    <Link href='/product/${
                      cart[i].productId
                    }'><h5 className='hover-red text-sm mb-1'>${
              cart[i].productName
            }</h5></Link>
                    <h6 className='text-sm text-rose-600 font-semibold'>${cart[
                      i
                    ].price.toFixed(2)}₼</h6>
                </div>
                <div className='remove-cart-item'>
                <div width="20" className='text-primary hover-red cursor-pointer remove-cart' id=${
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
        //console.log("success plus cart")
        //console.log(update_button)
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
        "http://89.40.2.200:3461/api/compare/add-compare",
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
        "http://89.40.2.200:3461/api/compare/remove-compare",
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

  return (
    <div className="flex flex-col items-center justify-between">
      {/* Slider Section */}
      {data?.bannerImages?.length > 0 && (
        <section className="slider-section pb-14">
          <Swiper
            pagination={{ dynamicBullets: true, clickable: true }}
            // loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {data?.bannerImages?.map((banner) => {
              return (
                <SwiperSlide key={banner.id}>
                  <div className="slider-img">
                    <Image
                      src={banner.image}
                      width={1200}
                      height={780}
                      className="object-cover mb-3 w-full"
                      alt="Slider Image"
                      priority
                    />
                  </div>
                  <div className="content">
                    <div className="frd-container mx-auto h-100">
                      <div>
                        <h4 className="text-xs md:text-2xl mb-1 md:mb-5">
                          {banner.title1}
                        </h4>
                        <h1 className="text-lg md:text-4xl md:mb-6 font-semibold">
                          {banner.title2}
                        </h1>
                        <p className="text-xs md:text-sm lg:text-lg">
                          {banner.description}
                        </p>
                        <Link
                          href={"/category/" + banner.categoryId}
                          className="link-design1 font-bold inline-flex rounded-full gap-1"
                        >
                          {t("Shop Now")}{" "}
                          <UilArrowRight size="24" color="#ffffff" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}

      {/* Trending Categories */}
      {data?.categoryImages?.length > 0 && (
        <section className="trending-section">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>{t("Trending Categories")}</h2>
              </div>
            </div>
          </div>
          <div className="frd-container mx-auto">
            <Swiper
              breakpoints={{
                300: { slidesPerView: 2 },
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
              }}
              spaceBetween={20}
              // loop={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              hashNavigation={{ watchState: true }}
              navigation={true}
              modules={[Navigation, HashNavigation]}
            >
              {/* onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}> */}

              {data?.categoryImages?.map((catimg) => {
                return (
                  <SwiperSlide
                    className="zoom-img categories-swiper-item text-center"
                    key={catimg.id}
                  >
                    <Link
                      href={"/category/" + catimg.id}
                      key={catimg.id}
                      passHref={true}
                      className=""
                    >
                      <div className="category-swiper-item-img-wrap w-full overflow-hidden">
                        {/* <Image src={CategoryImg1} width={300} height={400} className='blog-swiper-item-img object-cover w-full h-full mb-3' alt='Category'/> */}
                        <Image
                          src={catimg.image}
                          width={300}
                          height={400}
                          className="blog-swiper-item-img object-cover mb-3"
                          alt={catimg.name}
                        />
                      </div>
                      <h5 className="hover-red text-lg">{catimg.name}</h5>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* Banner Section */}
      {data?.offers?.length > 0 && (
        <section className="banner-section pb-10">
          <div className="frd-container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
              {data?.offers?.map((offer) => {
                return (
                  <div
                    className="banner1-wrapper relative zoom-img"
                    key={offer.id}
                  >
                    <div className="banner2-image banner-image">
                      <Image
                        src={offer.image}
                        className="infosecicon mx-auto"
                        alt="Icon"
                      />
                      {/* <Image src={Banner1Bck1} className='infosecicon mx-auto' alt="Icon"/> */}
                    </div>
                    <div className="banner2-content banner-content mb-8 md:mb-0 relative md:absolute">
                      <span>{offer.title}</span>
                      <h2>{offer.description}</h2>
                      <Link
                        href="/categories"
                        className=" link-design1 font-bold inline-block rounded-full"
                      >
                        Shop Now salam
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {data?.trendingProducts?.length > 0 && (
        <section className="latest-products-section pb-6">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>{t("Trending Products")}</h2>
              </div>
              <Link
                href="products/3"
                className="section-title-link flex items-center"
              >
                {t("View all")} <UilArrowRight size="24" color="#e4573d" />
              </Link>
            </div>
          </div>
          <div className="frd-container mx-auto">
            <Swiper
              breakpoints={{
                300: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 5 },
              }}
              spaceBetween={20}
              // loop={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              hashNavigation={{ watchState: true }}
              navigation={true}
              modules={[Navigation, HashNavigation]}
            >
              {/* onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}> */}
              {data?.trendingProducts?.map((product) => {
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
                    width={300}
                    height={400}
                    className="latest-product-swiper-item-img object-cover w-full h-full"
                    alt={product.name}
                  />
                );
                if (product.secondImage == null) {
                  images.push(
                    <Image
                      src={product.mainImage}
                      width={300}
                      height={400}
                      className="latest-product-swiper-item-img object-cover w-full h-full"
                      alt={product.name}
                    />
                  );
                } else {
                  images.push(
                    <Image
                      src={product.secondImage}
                      width={300}
                      height={400}
                      className="latest-product-swiper-item-img object-cover w-full h-full"
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
                        className="cart_quant cart_quant_update"
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
                        className="cart_quant"
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
                  <SwiperSlide
                    className="zoom-img latest-product-swiper-item mb-12 pb-5 relative"
                    key={product.id}
                  >
                    <div className="latest-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square">
                      <Link
                        href={`product/${product.id}`}
                        key={product.id}
                        passHref={true}
                        className=""
                      >
                        {images}
                        {/* <Image src={ProductImg1} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                        {/* <Image src={ProductImg2} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                      </Link>
                      <div className="hover-item-wrap flex items-center justify-center gap-3">
                        {fav_icon}
                        {compare_div}
                      </div>
                    </div>
                    <div className="latest-product-swiper-item-content pt-5 mt-1 px-3">
                      <div className="rating flex gap-1 justify-center">
                        {items}
                      </div>
                      <div className="name text-center my-2">
                        {/* substring(0,40)... */}
                        <Link
                          href={`product/${product.id}`}
                          key={product.id}
                          passHref={true}
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
                    {product.new == 1 ? (
                      <div className="new-product-icon absolute flex items-center justify-center">
                        {t("New")}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* Partners */}
      {data?.brands?.length > 0 && (
        <section className="partners-section mt-5 mb-16">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>{t("Partners")}</h2>
              </div>
            </div>
          </div>
          <div className="frd-container mx-auto">
            <Swiper
              breakpoints={{
                300: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 5 },
              }}
              spaceBetween={20}
              // loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              hashNavigation={{ watchState: true }}
              navigation={true}
              modules={[Navigation, HashNavigation, Autoplay]}
              // onSlideChange={() => console.log('slide change')}
              //  onSwiper={(swiper) => console.log(swiper)}
            >
              {data?.brands?.map((brand) => {
                return (
                  <SwiperSlide
                    className="zoom-img partners-swiper-item mb-12 p-5 relative"
                    key={brand.id}
                  >
                    <Image
                      src={brand.image}
                      width={300}
                      height={200}
                      className="partners-swiper-item-img object-contain"
                      alt="Product"
                    />
                    {/* <Image src={Partner1} width={300} height={200} className='partners-swiper-item-img object-contain w-full h-full' alt='Product'/> */}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
                
        </section>
      )}

      {/* Discount */}
      {/* <section className='discount-section py-20 relative mb-16'>
            <div className='discount-section-bg absolute'>
                  <Image src={DiscountBg} className='infosecicon mx-auto' alt="Discount Background"/>
            </div>
            <div className='frd-container mx-auto relative'>
                <div className='grid'>
                    <div className='grid-item'>
                      <div className='discount-section-content text-center'>
                        <h5>Hurry Up !</h5>
                        <h1 className='text-center'>Up To 25% Discount </h1>
                        <h1>Check it Out</h1>
                        <div className='discount-countdown my-11 flex justify-center'>
                            <div className='discount-countdown-single'>
                                <h4>22</h4>
                                <h5>days</h5>
                            </div>
                            <div className='discount-countdown-single'>
                                <h4>06</h4>
                                <h5>HRS</h5>
                            </div>
                            <div className='discount-countdown-single'>
                                <h4>30</h4>
                                <h5>mins</h5>
                            </div>
                            <div className='discount-countdown-single'>
                                <h4>15</h4>
                                <h5>secs</h5>
                            </div>
                        </div>
                        <Link href='/categories' className='discount-section-link hover-red'>Shop Now</Link>
                      </div>
                    </div>
                    <div className='grid-item'></div>
                </div>
            </div>
        </section> */}

      {/* Best Seller Products */}

      {data?.bestSellProducts?.length > 0 && (
        <section className="popular-products-section">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>{t("Best Seller Products")}</h2>
              </div>
              <Link
                href="products/2"
                passHref={true}
                className="section-title-link flex items-center"
              >
                {t("View all")} <UilArrowRight size="24" color="#e4573d" />
              </Link>
            </div>
          </div>
          <div className="frd-container mx-auto">
            <Swiper
              breakpoints={{
                300: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
                992: { slidesPerView: 5 },
              }}
              spaceBetween={20}
              // loop={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              hashNavigation={{ watchState: true }}
              navigation={true}
              modules={[Navigation, HashNavigation]}
            >
              {/* onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}> */}
              {data?.bestSellProducts?.map((product) => {
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
                    width={300}
                    height={400}
                    className="latest-product-swiper-item-img object-cover"
                    alt={product.name}
                  />
                );
                if (product.secondImage == null) {
                  images.push(
                    <Image
                      src={product.mainImage}
                      width={300}
                      height={400}
                      className="latest-product-swiper-item-img object-cover"
                      alt={product.name}
                    />
                  );
                } else {
                  images.push(
                    <Image
                      src={product.secondImage}
                      width={300}
                      height={400}
                      className="latest-product-swiper-item-img object-cover"
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
                        size="20"
                        color="#ffffff"
                        onClick={addFavorite}
                        id={product.id}
                      />
                      <FontAwesomeIcon
                        style={{ display: "none" }}
                        className="fav_icon_solid"
                        icon={solidHeart}
                        size="20"
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
                        style={{ display: "none" }}
                        className="fav_icon_reg"
                        icon={regularHeart}
                        size="20"
                        color="#ffffff"
                        onClick={addFavorite}
                        id={product.id}
                      />
                      <FontAwesomeIcon
                        className="fav_icon_solid"
                        icon={solidHeart}
                        size="20"
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
                        className="cart_quant cart_quant_update"
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
                        className="cart_quant"
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
                  <SwiperSlide
                    className="zoom-img latest-product-swiper-item mb-12 pb-5 relative"
                    key={product.id}
                  >
                    <div className="latest-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square">
                      <Link
                        href={`product/${product.id}`}
                        key={product.id}
                        passHref={true}
                        className=""
                      >
                        {images}
                        {/* <Image src={ProductImg1} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                        {/* <Image src={ProductImg2} width={300} height={400} className='latest-product-swiper-item-img object-cover w-full h-full' alt='Product'/> */}
                      </Link>
                      <div className="hover-item-wrap flex items-center justify-center gap-3">
                        {fav_icon}
                        {compare_div}
                      </div>
                    </div>
                    <div className="latest-product-swiper-item-content pt-5 mt-1 px-3">
                      <div className="rating flex gap-1 justify-center">
                        {items}
                      </div>
                      <div className="name text-center my-2">
                        {/* .substring(0,40)... */}
                        <Link
                          href={`product/${product.id}`}
                          key={product.id}
                          passHref={true}
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
                    {product.new == 1 ? (
                      <div className="new-product-icon absolute flex items-center justify-center">
                        {t("New")}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* Blog & Events */}

      {data?.blogs?.length > 0 && (
        <section className="blog-events-section mt-5 mb-16">
          <div className="frd-container mx-auto mb-10">
            <div className="flex justify-between items-center">
              <div className="section-title ">
                <h2>{t("Blogs")}</h2>
              </div>
              <Link
                href="/blogs"
                className="section-title-link flex items-center"
              >
                {t("View all")} <UilArrowRight size="24" color="#e4573d" />
              </Link>
            </div>
          </div>
          <div className="blogs-container frd-container mx-auto">
            <Swiper
              breakpoints={{
                300: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
              spaceBetween={30}
              // loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              hashNavigation={{
                watchState: true,
              }}
              navigation={true}
              modules={[Navigation, HashNavigation]}
              //onSlideChange={() => console.log('slide change')}
              //onSwiper={(swiper) => console.log(swiper)}
            >
              {data?.blogs?.map((blog) => {
                return (
                  <SwiperSlide
                    className="zoom-img blog-swiper-item"
                    key={blog.id}
                  >
                    <Link
                      href={`blogs/${blog.id}`}
                      key={blog.id}
                      passHref={true}
                      className=""
                    >
                      <div className="blog-swiper-item-img-wrap w-full overflow-hidden">
                        <Image
                          src={blog.image}
                          width="300"
                          height="400"
                          className="blog-swiper-item-img object-cover h-full w-full"
                          alt={blog.title}
                        />
                      </div>
                    </Link>
                    <div className="blog-swiper-item-content pt-5">
                      <div className="blog-created-date flex items-center gap-2">
                        <UilCalender size="18" color="#444" />
                        <span className="text-sm">
                          {blog.addDate.split("T")[0]}
                        </span>
                      </div>
                      <Link
                        href={`blogs/${blog.id}`}
                        key={blog.id}
                        passHref={true}
                        className="name mt-2 text-xl tracking-normal hover-red block"
                      >
                        {blog.title}
                      </Link>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* Banner 2 Section */}
      {/* <section className='banner2-section mb-16'>
            <div className='frd-container mx-auto'>
              <div className='banner2-wrapper relative zoom-img'>
                  <div className='banner2-image banner-image'>
                    <Image src={Banner2Bck} className='infosecicon mx-auto' alt="Icon"/>
                  </div>
                  <div className='banner2-content banner-content mb-8 md:mb-0 relative md:absolute'>
                    <span>BIG DISCOUNT</span>
                    <h2>Google Pixel Smart Phone</h2>
                    <h3 className='font-bold'>$350.00</h3>
                    <Link href='/categories' className="link-design1 font-bold inline-block rounded-full">Shop Now</Link>
                  </div>
              </div>
            </div>
        </section> */}

      {/* Info Section */}
      {data?.features?.length > 0 && (
        <section className="info-section">
          <div className="frd-container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {data?.features?.map((feature) => {
                return (
                  <div
                    className="grid-info-sec-col mb-3 sm:mb-4 lg:mb-0"
                    key={feature.id}
                  >
                    <div className="grid-info-box text-center">
                      <div className="flex justify-center">
                        <Image
                          src={feature.icon}
                          alt={feature.title}
                          width={50}
                          height={70}
                        />
                      </div>
                      <h5>{feature.title}</h5>
                      <p className="ls-5">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MainPage;
