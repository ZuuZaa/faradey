'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import { useParams  } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {  UilStar, UilInfo, UilComparison,  UilFacebookF, UilWhatsapp, UilTwitter, UilHeart     } from '@iconscout/react-unicons'
import { UisStar } from '@iconscout/react-unicons-solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import {faScaleBalanced } from '@fortawesome/free-solid-svg-icons'
import {faScaleUnbalanced } from '@fortawesome/free-solid-svg-icons'
import Swal  from 'sweetalert2';

import ProductImg1 from '../../../../public/images/products/1.webp';
import ProductImg2 from '../../../../public/images/products/2.webp';

import Pcard from '../../../../public/images/footer/Payment2.png';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation, HashNavigation } from 'swiper/modules';

import { Tabs, Tab } from '../Tabs';
import Gallery from '../Gallery'
import CounterInput from '../CounterInput';



export default function ProductDetail() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (event) => {
    const lng=event.currentTarget.textContent
    await i18n.changeLanguage(lng);
    if(typeof localStorage !== 'undefined') {
        localStorage.setItem("langId",lng)
    }
    const fetchedData = await fetchData();
    setData(fetchedData);
    const fetchedData1 = await fetchData1();
    document.getElementById("prod_desc").innerHTML=fetchedData1;

};
let lang_id='EN';
async function getHeader(){
  let token="";
  let session_id="";
  if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem("jwtToken");
      session_id=localStorage.getItem("sessionId");
      if(localStorage.getItem("langId")!=null){
        lang_id=localStorage.getItem("langId");
      }
  }
  const params = new URLSearchParams();
  params.append('SessionId', session_id);
  params.append('LanguageID',lang_id);
  const response = await fetch(`http://89.40.2.200:3461/api/layout/get-header?${params.toString()}`,{
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': 'Bearer ' + token
      }
  });
  const data = await response.json();
  return data.output;
}
  const pathname = useParams ();
  const id  = pathname.id;
  
  async function fetchData(){
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
    }
    const params = new URLSearchParams();
    params.append('Id',id)
    params.append('SessionId', session_id);
    params.append('LanguageID',lang_id);
    
      const response=await fetch(`http://89.40.2.200:3461/api/details/get-index?${params.toString()}`,{
        method: "GET",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
    });
      const data=await response.json();
      return data.output;
    
    
  }

  async function fetchData1(){
    let token="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
    }
    const params = new URLSearchParams();
    params.append('Id',id)
    params.append('LanguageID',lang_id);
      const response=await fetch(`http://89.40.2.200:3461/api/details/get-desc?${params.toString()}`,{
        method: "GET",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
  });
      const data=await response.json();
      return data.output;
    
    
  }
  
    const [data, setData] = useState({ 
                                products: [], 
                                productAttributes: [], 
                                groups:[],
                                reviews: [], 
                                myReviews: [], 
                                category:[],
                                similarProducts:[],
                                accessories:[],
                                userType:[]
  });

  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productName, setProductName] = useState("");
  
  useEffect(() => {
    async function fetchDataAsync() {
    const fetchedData = await fetchData();
      setData(fetchedData);
      setCategoryName(fetchedData.category[0].categoryTree)
      setCategoryId(fetchedData.category[0].id)
      setProductName(fetchedData.products[0].name)
      const fetchedData1 = await fetchData1();
      document.getElementById("prod_desc").innerHTML=fetchedData1;
      await i18n.changeLanguage(lang_id);
    }
    fetchDataAsync();
  }, []);

 const products=data.products;
 const similarProducts=data.similarProducts;
 const reviews=data.reviews
 const attributes=data.productAttributes
 const groups=data.groups
 const accessories=data.accessories
 const userType=data.userType


//  useEffect(() => {
//     async function fetchDataAsync() {
    
//     }
//     fetchDataAsync();
//   }, []);

  const [dataHeader, setDataHeader] = useState({ 
          header:[],
          isLogin:[]
        });
  useEffect(() => {
    async function fetchDataAsync() {
    const fetchedData = await getHeader();
    setDataHeader(fetchedData);
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    // Get all elements with the class name 'lang_btn'
    const langBtns = document.getElementsByClassName('lang_btn');

    // Add click event listener to each button
    for (let i = 0; i < langBtns.length; i++) {
      langBtns[i].addEventListener('click', changeLanguage);
    }

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      for (let i = 0; i < langBtns.length; i++) {
        langBtns[i].removeEventListener('click', changeLanguage);
      }
    };
  }, []);

  const isLogin=dataHeader.isLogin;
  let addFavorite = async (event) => {
    let prodid=event.currentTarget.getAttribute('id');
    let status;
    let token="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
    }
    try {
      const res = await fetch("http://89.40.2.200:3461/api/favorites/add-favorite", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          Id: prodid
        }),
      });
      const resJson = await res.json();
      //if (res.status === 200) {
        status=resJson.status
        if (status === 401) {
          try {
            let token="";
            let refreshToken="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
                refreshToken=localStorage.getItem("refreshToken");
            }
              let response=await fetch(`http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                      'Accept': 'application/json, text/plain',
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Authorization': 'Bearer ' + token
                  },
              })
              const resp = await response.json();
              if(resp.status !== 400) 
              {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem("refreshToken", resp.output.refreshToken);
                  localStorage.setItem("jwtToken", resp.output.token);
                }
                  
                  await addFavorite();
              } 
              else 
              {
                window.location.href="/login"
                
              }
          } 
          catch {
              console.log("error")
          }
        }
        else{
          var fav_icons=document.querySelectorAll(".fav_icon_reg")
          for (let i = 0; i < fav_icons.length; i++) {
            if(fav_icons[i].getAttribute('id')==prodid){
               fav_icons[i].style.display='none'
               fav_icons[i].nextSibling.style.display='block'
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
  let addFavoriteDetails = async (event) => {
    let fav_div=event.currentTarget;
    let prodid=event.currentTarget.getAttribute('id');
    let status;
    let token="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
    }
    try {
      const res = await fetch("http://89.40.2.200:3461/api/favorites/add-favorite", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          Id: prodid
        }),
      });
      const resJson = await res.json();
      //if (res.status === 200) {
        status=resJson.status
        if (status === 401) {
          try {
            let token="";
            let refreshToken="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
                refreshToken=localStorage.getItem("refreshToken");
            }
              let response=await fetch(`http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                      'Accept': 'application/json, text/plain',
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Authorization': 'Bearer ' + token
                  },
              })
              const resp = await response.json();
              if(resp.status !== 400) 
              {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem("refreshToken", resp.output.refreshToken);
                  localStorage.setItem("jwtToken", resp.output.token);
                }
                  
                  await addFavorite();
              } 
              else 
              {
                window.location.href="/login"
                
              }
          } 
          catch {
              console.log("error")
          }
        }
        else{
          // var fav_icons=document.querySelectorAll(".fav_icon_reg")
          // for (let i = 0; i < fav_icons.length; i++) {
          //   if(fav_icons[i].getAttribute('id')==prodid){
          //      fav_icons[i].style.display='none'
          //      fav_icons[i].nextSibling.style.display='block'
          //   }
          // }
          fav_div.style.display='none'
          fav_div.nextSibling.style.display='block'
          
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
    let prodid=event.currentTarget.getAttribute('id');
    let status;
    let token="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
    }
    //e.preventDefault();
    try {
      const res = await fetch("http://89.40.2.200:3461/api/favorites/remove-favorite", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          Id: prodid
        }),
      });
      const resJson = await res.json();
      //if (res.status === 200) {
        
        status=resJson.status
        
        if (status === 401) {
          try {
            let token="";
            let refreshToken="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
                refreshToken=localStorage.getItem("refreshToken");
            }
              let response=await fetch(`http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                      'Accept': 'application/json, text/plain',
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Authorization': 'Bearer ' + token
                  },
              })
              const resp = await response.json();
              if(resp.status !== 400) {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem("refreshToken", resp.output.refreshToken);
                  localStorage.setItem("jwtToken", resp.output.token);
                }
                  
  
                  await removeFavorite();
              } else {
                  window.location.href="/login"
                  //go to login page
                  //alert(1)
              }
          } 
          catch {
              console.log("error")
          }
      }
      else{
        var fav_icons=document.querySelectorAll(".fav_icon_solid")
          for (let i = 0; i < fav_icons.length; i++) {
            if(fav_icons[i].getAttribute('id')==prodid){
               fav_icons[i].style.display='none'
               fav_icons[i].previousSibling.style.display='block'
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
  let removeFavoriteDetails = async (event) => {
    let fav_div=event.currentTarget;
    let prodid=event.currentTarget.getAttribute('id');
    let status;
    let token="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
    }
    //e.preventDefault();
    try {
      const res = await fetch("http://89.40.2.200:3461/api/favorites/remove-favorite", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          Id: prodid
        }),
      });
      const resJson = await res.json();
      //if (res.status === 200) {
        
        status=resJson.status
        
        if (status === 401) {
          try {
            let token="";
            let refreshToken="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
                refreshToken=localStorage.getItem("refreshToken");
            }
              let response=await fetch(`http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                  method: 'POST',
                  dataType: 'json',
                  headers: {
                      'Accept': 'application/json, text/plain',
                      'Content-Type': 'application/json;charset=UTF-8',
                      'Authorization': 'Bearer ' + token
                  },
              })
              const resp = await response.json();
              if(resp.status !== 400) {
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem("refreshToken", resp.output.refreshToken);
                  localStorage.setItem("jwtToken", resp.output.token);
                }
                  
  
                  await removeFavorite();
              } else {
                  window.location.href="/login"
                  //go to login page
                  //alert(1)
              }
          } 
          catch {
              console.log("error")
          }
      }
      else{
        // var fav_icons=document.querySelectorAll(".fav_icon_solid")
        //   for (let i = 0; i < fav_icons.length; i++) {
        //     if(fav_icons[i].getAttribute('id')==prodid){
        //        fav_icons[i].style.display='none'
        //        fav_icons[i].previousSibling.style.display='block'
        //     }
        //   }
          fav_div.style.display='none'
          fav_div.previousSibling.style.display='block'
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
  let addCart= async (event) => {
    let prodid=event.currentTarget.getAttribute('id');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    const quantity=event.currentTarget.previousSibling.value;
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/add-to-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            ProductId: prodid,
            Quantity:quantity,
            SessionId:session_id
  
          }),
        });
          if (res.status === 200) {
            const resJson = await res.json();
            if(resJson.output.kind=="Failure"){
              Swal.fire({
                title: 'Stock error!',
                text: resJson.output.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 4000
              });
            }
            else{
              const cart_id=resJson.output.cart[0].id
              var add_cart_btns=document.querySelectorAll(".add_cart_btn")
          for (let i = 0; i < add_cart_btns.length; i++) 
          {
            if(add_cart_btns[i].getAttribute('id')==prodid){
               
               add_cart_btns[i].parentElement.innerHTML='<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="'+quantity+'" id="'+prodid+'" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="'+cart_id+'"><button class="rounded-full font-bold inline-block text-base plus_button" id="'+prodid+'"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="'+prodid+'"><span>-</span></button></div>'
               add_cart_btns[i].remove();
              }

          }
          var plus_btns=document.querySelectorAll(".plus_button")
          for (let i = 0; i < plus_btns.length; i++) 
          {
            plus_btns[i].addEventListener('click',plusCart)
          }
          var minus_btns=document.querySelectorAll(".minus_button")
          for (let i = 0; i < minus_btns.length; i++) 
          {
            minus_btns[i].addEventListener('click',minusCart)
          }
          var cart_quants=document.querySelectorAll(".cart_quant_update")
          for (let i = 0; i < cart_quants.length; i++) 
          {
            cart_quants[i].addEventListener('keyup',updateInput)
          }
          document.getElementById("cart_drop").style.display="block"
          var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
              
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          document.getElementById("cart_quantity").style.display="flex"
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }

            }
            
          
        }
      } catch (err) {
        console.log(err);
      }
  }
  let addCartDetails= async (event) => {
    let cart_div=event.currentTarget;
    let prodid=event.currentTarget.getAttribute('id');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    const quantity=event.currentTarget.previousSibling.value;
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/add-to-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            ProductId: prodid,
            Quantity:quantity,
            SessionId:session_id
  
          }),
        });
        
        
          
          if (res.status === 200) {
            const resJson = await res.json();
            if(resJson.output.kind=="Failure"){
              Swal.fire({
                title: 'Stock error!',
                text: resJson.output.message,
                icon: 'error',
                showConfirmButton: false,
                timer: 4000
              });
            }
            else{
              const cart_id=resJson.output.cart[0].id
              cart_div.parentElement.innerHTML='<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="'+quantity+'" id="'+prodid+'" name="cart_quant_update" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="'+cart_id+'"><button class="rounded-full font-bold inline-block text-base plus_button" id="'+prodid+'" name="plus_button"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="'+prodid+'" name="minus_button"><span>-</span></button></div>'
          cart_div.remove();

          var plus_btns=document.getElementsByName("plus_button")
          plus_btns[0].addEventListener('click',plusCartDetails)

          var minus_btns=document.getElementsByName("minus_button")
          minus_btns[0].addEventListener('click',minusCartDetails)

          var cart_quants=document.getElementsByName("cart_quant_update")
          cart_quants[0].addEventListener('keyup',updateInputDetails)
          // for (let i = 0; i < plus_btns.length; i++) 
          // {
          //   plus_btns[i].addEventListener('click',plusCartDetails)
          // }
          // var minus_btns=cart_div.parentElement.querySelectorAll(".minus_button")
          // for (let i = 0; i < minus_btns.length; i++) 
          // {
          //   minus_btns[i].addEventListener('click',minusCartDetails)
          // }
          // var cart_quants=cart_div.parentElement.querySelectorAll(".cart_quant_update")
          // for (let i = 0; i < cart_quants.length; i++) 
          // {
          //   cart_quants[i].addEventListener('keyup',updateInputDetails)
          // }
          document.getElementById("cart_drop").style.display="block"
          var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
              
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          document.getElementById("cart_quantity").style.display="flex"
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }

            }
            
          
        }
      } catch (err) {
        console.log(err);
      }
  }
  let removeCart= async (event) => {
    let cartid=event.currentTarget.getAttribute('id');
    let prodid=event.currentTarget.getAttribute('tabindex');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/remove-from-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            CartId: cartid,
            SessionId:session_id
  
          }),
        });
        const resJson = await res.json();
          
          if (res.status === 200) {
            
          var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
          for (let i = 0; i < min_plus_btns.length; i++) 
          {
            if(min_plus_btns[i].getAttribute('id')==cartid){
               
              min_plus_btns[i].parentElement.innerHTML='<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>'
              
              //min_plus_btns[i].remove();
              }

          }
          var add_btns=document.querySelectorAll(".add_cart_btn")
          for(let i = 0; i < add_btns.length; i++){
            add_btns[i].addEventListener('click',addCart)
          }
          var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          if(cart.length==0)
          {
            document.getElementById("cart_drop").style.display="none"
            document.getElementById("cart_quantity").style.display="none"
          }
          else{
            for (let i = 0; i < cart.length; i++) 
            {
              append_cart+=`<div class='cartdropdown-item flex gap-3'>
              <div class='img relative'>
                <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
                <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
              </div>
              <div class='content'> 
                  <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                  <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
              </div>
              <div class='remove-cart-item'>
              <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
              </div>
          </div>`
            }
            cart_dropdown.innerHTML=append_cart
            document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
            document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
            let remove_carts=document.getElementsByClassName("remove-cart")
            for (let i = 0; i < remove_carts.length; i++) 
            {
              remove_carts[i].addEventListener('click',removeCart)
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
  }
  let plusCart= async (event) => {
    let prodid=event.currentTarget.getAttribute('id');
    let cartid=event.currentTarget.parentElement.getAttribute('id');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    let quantity=event.currentTarget.parentElement.previousSibling.value;
    quantity++;
    try {
      const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity:quantity,
          SessionId:session_id

        }),
      });
      const resJson = await res.json();
        
        if (res.status === 200) {
          if(resJson.output.kind=="Failure"){
            Swal.fire({
              title: 'Stock error!',
              text: resJson.output.message,
              icon: 'error',
              showConfirmButton: false,
              timer: 4000
            });
          }
          else{
            var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
        for (let i = 0; i < min_plus_btns.length; i++) 
        {
          if(min_plus_btns[i].getAttribute('id')==cartid)
          {
            min_plus_btns[i].previousSibling.value=quantity;
          }
        }
        var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }

          }
          
        
        
      }
    } catch (err) {
      console.log(err);
    }
  }
  let plusCartDetails= async (event) => {
    let prodid=event.currentTarget.getAttribute('id');
    let cartid=event.currentTarget.parentElement.getAttribute('id');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    let quantity=event.currentTarget.parentElement.previousSibling.value;
    quantity++;
    try {
      const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity:quantity,
          SessionId:session_id

        }),
      });
      const resJson = await res.json();
        
        if (res.status === 200) {
          if(resJson.output.kind=="Failure"){
            Swal.fire({
              title: 'Stock error!',
              text: resJson.output.message,
              icon: 'error',
              showConfirmButton: false,
              timer: 4000
            });
          }
          else{
            var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
        for (let i = 0; i < min_plus_btns.length; i++) 
        {
          if(min_plus_btns[i].getAttribute('id')==cartid)
          {
            min_plus_btns[i].previousSibling.value=quantity;
          }
        }
        var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }
          
          let wholesale=document.getElementById("wholesale_prc_m").value
          document.getElementById("wholesale_prc").innerText=(quantity*wholesale).toFixed(2)+"₼"
          let diller=document.getElementById("diller_prc_m").value
          document.getElementById("diller_prc").innerText=(quantity*diller).toFixed(2)+"₼"
          let special=document.getElementById("special_prc_m").value
          document.getElementById("special_prc").innerText=(quantity*special).toFixed(2)+"₼"
          //let main=document.getElementById("main_prc").innerText.split('₼')[0]
          //document.getElementById("main_prc").innerText=quantity*main+"₼"

          }
          
        
        
      }
    } catch (err) {
      console.log(err);
    }
  }
  let minusCart= async (event) => {
    let prodid=event.currentTarget.getAttribute('id');
    let cartid=event.currentTarget.parentElement.getAttribute('id');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    let quantity=event.currentTarget.parentElement.previousSibling.value;
    quantity--;
    if(quantity>0)
    {
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            ProductId: prodid,
            Quantity:quantity,
            SessionId:session_id
  
          }),
        });
        const resJson = await res.json();
          
          if (res.status === 200) {
            
          var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
          for (let i = 0; i < min_plus_btns.length; i++) 
          {
            if(min_plus_btns[i].getAttribute('id')==cartid)
            {
              min_plus_btns[i].previousSibling.value=quantity;
            }
          }
          var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }
          
          
        }
      } catch (err) {
        console.log(err);
      }
    }
    else{
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/remove-from-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            CartId: cartid,
            SessionId:session_id
  
          }),
        });
        const resJson = await res.json();
          
          if (res.status === 200) {
            
          var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
          for (let i = 0; i < min_plus_btns.length; i++) 
          {
            if(min_plus_btns[i].getAttribute('id')==cartid){
               
              min_plus_btns[i].parentElement.innerHTML='<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>'
              
              //min_plus_btns[i].remove();
              }

          }
          var add_btns=document.querySelectorAll(".add_cart_btn")
          for(let i = 0; i < add_btns.length; i++){
            add_btns[i].addEventListener('click',addCart)
          }
          var cart=resJson.output.cart
          if(cart.length==0)
          {
            document.getElementById("cart_drop").style.display="none"
            document.getElementById("cart_quantity").style.display="none"
          }
          else{
            var cart_dropdown=document.getElementById("cart_dropdown")
            var append_cart=``;
            var cart=resJson.output.cart
            for (let i = 0; i < cart.length; i++) 
            {
              append_cart+=`<div class='cartdropdown-item flex gap-3'>
              <div class='img relative'>
                <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
                <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
              </div>
              <div class='content'> 
                  <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                  <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
              </div>
              <div class='remove-cart-item'>
              <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
              </div>
          </div>`
            }
            cart_dropdown.innerHTML=append_cart
            document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
            document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
            let remove_carts=document.getElementsByClassName("remove-cart")
            for (let i = 0; i < remove_carts.length; i++) 
            {
              remove_carts[i].addEventListener('click',removeCart)
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let minusCartDetails= async (event) => {
    let minus_btn=event.currentTarget
    let prodid=event.currentTarget.getAttribute('id');
    let cartid=event.currentTarget.parentElement.getAttribute('id');
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    let quantity=event.currentTarget.parentElement.previousSibling.value;
    quantity--;
    if(quantity>0)
    {
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            ProductId: prodid,
            Quantity:quantity,
            SessionId:session_id
  
          }),
        });
        const resJson = await res.json();
          
          if (res.status === 200) {
            
          var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
          for (let i = 0; i < min_plus_btns.length; i++) 
          {
            if(min_plus_btns[i].getAttribute('id')==cartid)
            {
              min_plus_btns[i].previousSibling.value=quantity;
            }
          }
          var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }
          let wholesale=document.getElementById("wholesale_prc_m").value
          document.getElementById("wholesale_prc").innerText=(quantity*wholesale).toFixed(2)+"₼"
          let diller=document.getElementById("diller_prc_m").value
          document.getElementById("diller_prc").innerText=(quantity*diller).toFixed(2)+"₼"
          let special=document.getElementById("special_prc_").value
          document.getElementById("special_prc").innerText=(quantity*special).toFixed(2)+"₼"
          // let main=document.getElementById("main_prc").innerText.split('₼')[0]
          // document.getElementById("main_prc").innerText=(quantity*main).toFixed(2)+"₼"
        }
      } catch (err) {
        console.log(err);
      }
    }
    else{
      try {
        const res = await fetch("http://89.40.2.200:3461/api/cart/remove-from-cart", {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            CartId: cartid,
            SessionId:session_id
  
          }),
        });
        const resJson = await res.json();
          
          if (res.status === 200) {
            
          // var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
          // for (let i = 0; i < min_plus_btns.length; i++) 
          // {
          //   if(min_plus_btns[i].getAttribute('id')==cartid){
               
          //     min_plus_btns[i].parentElement.innerHTML='<input class="cart_quant" type="number" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>'
              
          //     //min_plus_btns[i].remove();
          //     }

          // }
          minus_btn.parentElement.parentElement.innerHTML='<input class="cart_quant" type="number" min="1" max="10000" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn" name="add_cart_btn">Add</button></div>'
          
          var add_btns=document.getElementsByName("add_cart_btn")
          //for(let i = 0; i < add_btns.length; i++){
            add_btns[0].addEventListener('click',addCartDetails)
          //}
          var cart=resJson.output.cart
          
          if(cart.length==0)
          {
            document.getElementById("cart_drop").style.display="none"
            document.getElementById("cart_quantity").style.display="none"
          }
          else{
            var cart_dropdown=document.getElementById("cart_dropdown")
            var append_cart=``;
            var cart=resJson.output.cart
            for (let i = 0; i < cart.length; i++) 
            {
              append_cart+=`<div class='cartdropdown-item flex gap-3'>
              <div class='img relative'>
                <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
                <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
              </div>
              <div class='content'> 
                  <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                  <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
              </div>
              <div class='remove-cart-item'>
              <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
              </div>
          </div>`
            }
            cart_dropdown.innerHTML=append_cart
            document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
            document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
            let remove_carts=document.getElementsByClassName("remove-cart")
            for (let i = 0; i < remove_carts.length; i++) 
            {
              remove_carts[i].addEventListener('click',removeCart)
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  let updateInput= (event) => {
    let prodid=event.currentTarget.getAttribute('id')
    let quantity=event.currentTarget.value;
    let cartid=event.currentTarget.nextSibling.getAttribute('id')
    event.currentTarget.parentElement.innerHTML='<input class="cart_quant" type="number" min="1" max="10000" value="'+quantity+'" id="'+prodid+'"  /><button type="button" class="rounded-full font-bold inline-block text-base update_button" id="'+cartid+'"><span>'+t('Update')+'</span></button>'
    var update_btns=document.querySelectorAll(".update_button")
    for(let i = 0; i < update_btns.length; i++){
      update_btns[i].addEventListener('click',updateCart)
    }

  }
  let updateInputDetails= (event) => {
    let prodid=event.currentTarget.getAttribute('id')
    let quantity=event.currentTarget.value;
    let cartid=event.currentTarget.nextSibling.getAttribute('id')
    event.currentTarget.parentElement.innerHTML='<input class="cart_quant" type="number" min="1" max="10000" value="'+quantity+'" id="'+prodid+'"  /><button type="button" class="rounded-full font-bold inline-block text-base update_button" name="update_button" id="'+cartid+'"><span>'+t('Update')+'</span></button>'
    var update_btns=document.getElementsByName("update_button")
    //for(let i = 0; i < update_btns.length; i++){
      update_btns[0].addEventListener('click',updateCartDetails)
    //}

  }
  let updateCart= async (event) => {
    let prodid=event.currentTarget.previousSibling.getAttribute('id')
    let quantity=event.currentTarget.previousSibling.value;
    let cartid=event.currentTarget.getAttribute('id')
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    let update_button=event.currentTarget;
    try {
      const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity:quantity,
          SessionId:session_id

        }),
      });
      const resJson = await res.json();
        
        if (res.status === 200) {
          if(resJson.output.kind=="Failure"){
            Swal.fire({
              title: 'Stock error!',
              text: resJson.output.message,
              icon: 'error',
              showConfirmButton: false,
              timer: 4000
            });
          }
          else{
            update_button.parentElement.innerHTML='<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="'+quantity+'" id="'+prodid+'" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="'+cartid+'"><button class="rounded-full font-bold inline-block text-base plus_button" id="'+prodid+'"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="'+prodid+'"><span>-</span></button></div>'
        var plus_btns=document.querySelectorAll(".plus_button")
        for (let i = 0; i < plus_btns.length; i++) 
        {
          plus_btns[i].addEventListener('click',plusCart)
        }
        var minus_btns=document.querySelectorAll(".minus_button")
        for (let i = 0; i < minus_btns.length; i++) 
        {
          minus_btns[i].addEventListener('click',minusCart)
        }
        var cart_quants=document.querySelectorAll(".cart_quant_update")
          for (let i = 0; i < cart_quants.length; i++) 
          {
            cart_quants[i].addEventListener('keyup',updateInput)
          }
          var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }

          }
      }
    } catch (err) {
      console.log(err);
    }
  }

  let updateCartDetails= async (event) => {
    let prodid=event.currentTarget.previousSibling.getAttribute('id')
    let quantity=event.currentTarget.previousSibling.value;
    let cartid=event.currentTarget.getAttribute('id')
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    let update_button=event.currentTarget;
    try {
      const res = await fetch("http://89.40.2.200:3461/api/cart/update-cart", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ProductId: prodid,
          Quantity:quantity,
          SessionId:session_id

        }),
      });
      
        
        if (res.status === 200) {
          const resJson = await res.json();
          if(resJson.output.kind=="Failure"){
            Swal.fire({
              title: 'Stock error!',
              text: resJson.output.message,
              icon: 'error',
              showConfirmButton: false,
              timer: 4000
            });
          }
          else{
            update_button.parentElement.innerHTML='<input class="cart_quant cart_quant_update" type="number" min="1" max="10000" value="'+quantity+'" id="'+prodid+'" name="cart_quant_update" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="'+cartid+'"><button class="rounded-full font-bold inline-block text-base plus_button" id="'+prodid+'" name="plus_button"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="'+prodid+'" name="minus_button"><span>-</span></button></div>'
        var plus_btns=document.getElementsByName("plus_button")
        //for (let i = 0; i < plus_btns.length; i++) 
        //{
          plus_btns[0].addEventListener('click',plusCartDetails)
        //}
        var minus_btns=document.getElementsByName("minus_button")
        //for (let i = 0; i < minus_btns.length; i++) 
        //{
          minus_btns[0].addEventListener('click',minusCartDetails)
        //}
        var cart_quants=document.getElementsByName("cart_quant_update")
        //for (let i = 0; i < cart_quants.length; i++) 
        //{
          cart_quants[0].addEventListener('keyup',updateInputDetails)
        //}
        var cart_dropdown=document.getElementById("cart_dropdown")
          var append_cart=``;
          var cart=resJson.output.cart
          for (let i = 0; i < cart.length; i++) 
          {
            append_cart+=`<div class='cartdropdown-item flex gap-3'>
            <div class='img relative'>
              <img src=${cart[i].productImage} width="82" height="82" class='cover' alt="${cart[i].productName}"></img>
              <span class='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>${cart[i].quantity}x</span>
            </div>
            <div class='content'> 
                <Link href='/product/${cart[i].productId}'><h5 class='hover-red text-sm mb-1'>${cart[i].productName}</h5></Link>
                <h6 class='text-sm text-rose-600 font-semibold'>${cart[i].price.toFixed(2)}₼</h6>
            </div>
            <div class='remove-cart-item'>
            <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId}><span>x</span></div>
            </div>
        </div>`
          }
          cart_dropdown.innerHTML=append_cart
          document.getElementById("cart_subtotal").innerText=resJson.output.total.toFixed(2)+"₼"
          document.getElementById("cart_quantity").innerText=resJson.output.totalQuantity
          let remove_carts=document.getElementsByClassName("remove-cart")
          for (let i = 0; i < remove_carts.length; i++) 
          {
            remove_carts[i].addEventListener('click',removeCart)
          }

          }
          
        
        
      }
    } catch (err) {
      console.log(err);
    }
  }
  let addCompare=async (event) => {
    let prodid=event.currentTarget.getAttribute('id')
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch("http://89.40.2.200:3461/api/compare/add-compare", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ProductId: prodid,
          SessionId:session_id,
          LanguageID:lang_id
  
        }),
      });
      const resJson = await res.json();
        
      if (resJson.output.message) {
        Swal.fire(resJson.output.message);
      }
        if (res.status === 200) {
        
          var comp_icons=document.querySelectorAll(".comp_icon_reg")
            for (let i = 0; i < comp_icons.length; i++) {
              if(comp_icons[i].getAttribute('id')==prodid){
                comp_icons[i].style.display='none'
                comp_icons[i].nextSibling.style.display='block'
              }
            }
          
        
      }
    } catch (err) {
      console.log(err);
    }
  }
  let removeCompare=async(event)=>{
    let prodid=event.currentTarget.getAttribute('id')
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
    }
    try {
      const res = await fetch("http://89.40.2.200:3461/api/compare/remove-compare", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ProductId: prodid,
          SessionId:session_id

        }),
      });
      
        
        if (res.status === 200) {
          const resJson = await res.json();
          var comp_icons=document.querySelectorAll(".comp_icon_solid")
          for (let i = 0; i < comp_icons.length; i++) {
            if(comp_icons[i].getAttribute('id')==prodid){
              comp_icons[i].style.display='none'
              comp_icons[i].previousSibling.style.display='block'
            }
          }
        //console.log("success add compare")
        
      }
    } catch (err) {
      console.log(err);
    }
  }

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [star, setRating]=useState(1)
  const [message, setMessage] = useState("");

  let submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://89.40.2.200:3461/api/details/add-review", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
          ProductId: id,
          Star: star,
          Title:title,
          Summary: text
        }),
      });
      const resJson = await res.json();
      if (res.status === 200) {
        setTitle("");
        setText("");
        setRating(1);
        setMessage(t('Review created successfully'));
      } else {
        setMessage(t('Some error occured'));
      }
    } catch (err) {
      console.log(err);
    }
  };
  
    return (
    
        <main>

            {/* Breadcrumb */}
            <div className='breadcrumb-wrapper py-8'>
                <div className='custom-container mx-auto'>
                    <div className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                        <li className="inline-flex items-center">
                          <a href="/" className="inline-flex items-center text-sm font-medium"> {t('Home')} </a>
                        </li>
                        <li className="inline-flex items-center">
                          <a href={"/category/" + categoryId} className="inline-flex items-center text-sm font-medium"> {categoryName} </a>
                        </li>
                        <li>
                        <div className="flex items-center">
                            <a href="#" className="ms-1 text-sm font-medium md:ms-2"> {productName} </a>
                        </div>
                        </li>
                    </ol>
                    </div>
                </div>
            </div>
            {/* Product Detail Section */}
            <section className='product-main-section my-20 py-3'>
                {/* Product Detail - Tabs Section */}
                {products.map(product=>{
                    const items = [];

                    for(let i = 1; i <= 5; i++)
                    {
                      if(product.starCount >= i){
                         items.push(<UisStar size="18" color="#ffc400" />)
                      }
                      else {
                         items.push(<UilStar size="18" color="#ffc400" />)
                      }
                    }
                    const fav_icon=[];
                      if(product.favorite==0)
                      {
                        fav_icon.push(<div className='addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md' ><FontAwesomeIcon className='fav_icon_reg' icon={regularHeart} style={{fontSize:22}}  color="#ffffff" onClick={addFavoriteDetails} id={product.id}  /><FontAwesomeIcon style={{display:'none',fontSize:22}} className='fav_icon_solid' icon={solidHeart} color="#ffffff" onClick={removeFavoriteDetails} id={product.id} /></div>)
                      }
                      else{
                        fav_icon.push(<div className='addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md' ><FontAwesomeIcon style={{display:'none',fontSize:22}} className='fav_icon_reg' icon={regularHeart}  color="#ffffff" onClick={addFavoriteDetails} id={product.id} /><FontAwesomeIcon className='fav_icon_solid' icon={solidHeart} style={{fontSize:22}} color="#ffffff" onClick={removeFavoriteDetails} id={product.id} /></div>)
                      }
                      const add_cart_div=[];
                      if(product.quantity>0)
                      {
                        add_cart_div.push(<div className='add-to-cart-wrap pm flex items-center justify-center gap-2'><input class="cart_quant cart_quant_update" type="number" min="1" max="10000" defaultValue={product.quantity} onKeyUp={updateInputDetails} id={product.id}  /><div className='flex gap-2 pm-wrap minus_plus_btn' id={product.cartId}><button type="button" className='rounded-full font-bold inline-block text-base plus_button' onClick={plusCartDetails} id={product.id}><span>+</span></button><button type="button" className='rounded-full font-bold inline-block text-base minus_button' onClick={minusCartDetails} id={product.id}><span>-</span></button></div></div>)

                      }
                      else{
                        add_cart_div.push(<div className='add-to-cart-wrap flex items-center justify-center gap-2'><input class="cart_quant" type="number" min="1" max="10000" defaultValue="1"/><button type='button' onClick={addCartDetails} id={product.id} className='rounded-full font-bold inline-block text-base add_cart_btn'>{t('Add')}</button></div>)
                      }
                      const compare_div=[];
                      if(product.compared==0){
                        compare_div.push(<div className='addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md'><FontAwesomeIcon className='comp_icon_reg' icon={faScaleUnbalanced} style={{fontSize:22}}  color="#ffffff" onClick={addCompare} id={product.id} /><FontAwesomeIcon style={{display:'none',fontSize:22}} className='comp_icon_solid' icon={faScaleBalanced} color="#ffffff" onClick={removeCompare} id={product.id} /></div>)

                      }
                      else{
                        compare_div.push(<div className='addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md'><FontAwesomeIcon style={{display:'none',fontSize:22}} className='comp_icon_reg' icon={faScaleUnbalanced}  color="#ffffff" onClick={addCompare} id={product.id} /><FontAwesomeIcon className='comp_icon_solid' icon={faScaleBalanced} style={{fontSize:22}} color="#ffffff" onClick={removeCompare} id={product.id} /></div>)
                      }
                      let price_div=[];
                      if(userType==1){
                        price_div.push(<div className='product-detail-price-box'><h5>{t('Wholesale Price')}</h5><h3 className='product-price text-red-500 text-2xl font-semibold' id="wholesale_prc">{product.wholeSalePrice.toFixed(2)}₼</h3> </div>)
                      }
                      else if(userType==2){
                        price_div.push(<div className='product-detail-price-box'><h5>{t('Diller Price')}</h5><h3 className='product-price text-red-500 text-2xl font-semibold' id="diller_prc">{product.dillerPrice.toFixed(2)}₼</h3> </div>)
                        price_div.push(<div className='product-detail-price-box'><h5>{t('Wholesale Price')}</h5><h3 className='product-price text-red-500 text-2xl font-semibold' id="wholesale_prc">{product.wholeSalePrice.toFixed(2)}₼</h3> </div>)
                        
                      }
                      else if(userType==3){
                        price_div.push(<div className='product-detail-price-box'><h5>{t('Special Price')}</h5><h3 className='product-price text-red-500 text-2xl font-semibold' id="special_prc">{product.specialPrice.toFixed(2)}₼</h3> </div>)
                        price_div.push(<div className='product-detail-price-box'><h5>{t('Diller Price')}</h5><h3 className='product-price text-red-500 text-2xl font-semibold' id="diller_prc">{product.dillerPrice.toFixed(2)}₼</h3> </div>)
                        price_div.push(<div className='product-detail-price-box'><h5>{t('Wholesale Price')}</h5><h3 className='product-price text-red-500 text-2xl font-semibold' id="wholesale_prc">{product.wholeSalePrice.toFixed(2)}₼</h3> </div>)
                        
                      }
                      const limit_div=[];
                      if(product.stock<=0){
                        limit_div.push(<h2 className='product-availability text-base mb-6 text-red-500'>{t('Not available')}</h2>)
                      }
                      else if(product.stock<=product.minLimit){
                        limit_div.push(<h2 className='product-availability text-base mb-6 text-red-500'>{t('Limited number')}</h2>)
                      }
                    return(
                    <section className='custom-products-section pb-6'>
                        <div className='frd-container mx-auto mb-10'>
                            <div className='grid grid-cols-1 lg:grid-cols-2'>
                                <div className='product-detail-gallery px-4 mb-16'>
                                    <Gallery prod_id={product.id}></Gallery>
                                </div>
                                <div className='product-detail-info px-4'>
                                    <h3 className='product-name text-4xl mb-3'>{product.name}</h3>
                                    
                                    <div className='product-thin-st w-full rounded-lg relative bg-slate-100 '>
                                        <span className='w-1/4 bg-slate-700 absolute inset-0 rounded-lg' ></span>
                                    </div>
                                    <p className='product-paragraph text-md text-gray-600 mt-6 mb-6'>{product.about}</p>
                                    <div id='prod_desc' className='mb-6'></div>
                                    {
                                      product.dahuaLink!=null?(<div className='product-cards mb-6 flex gap-3'>
                                      <Link className='text-sm text-red-600 mb-3' href={product.dahuaLink} target='blank'>{t('You can find Datasheet of product by clicking here')}</Link>
                                      
                                  </div>):(<div></div>)
                                    }
                                    
                                    <div className='product-price-wrap flex gap-5 py-4 mt-6 mb-6 items-center'>
                                        <h3 className='product-price text-red-500 text-2xl font-semibold' id="main_prc">{product.price.toFixed(2)}₼</h3>
                                        {/* <del className='text-sm text-slate-500'>$ 140.00</del>
                                        <span className='discount-span text-xs rounded-3xl py-2 px-5 bg-gray-800 text-white'> -15% </span> */}
                                    </div>
                                    {
                                      userType>0?(<div className='product-price-wrap grid grid-cols-2 md:grid-cols-4 gap-3 py-4 mt-6 mb-6 items-center'>
                                      {price_div}
                                    </div>):(<div></div>)
                                    }
                                    
                                    <input type="hidden" id='wholesale_prc_m' value={product.wholeSalePrice.toFixed(2)}></input>
                                    <input type="hidden" id='diller_prc_m' value={product.dillerPrice.toFixed(2)}></input>
                                    <input type="hidden" id='special_prc_m' value={product.specialPrice.toFixed(2)}></input>
                                    <h4 className='product-sku text-base mb-12 text-stone-800 flex items-center gap-9'>{t('Code')}: {product.code} 
                                            <div className='rating flex justify-center items-center '>
                                                {items}
                                                <span className='text-sm ml-1 text-slate-700'>{reviews.length} {t('review')}</span>
                                            </div>
                                    </h4>
                                    {
                                      userType>0&&product.stock>0?(<h4 className='product-availability text-base mb-6 text-stone-800'>{t('Availability')}: <span className='text-green-600 '>{product.stock} {t('in stock')}</span></h4>):(<h4></h4>)
                                    }
                                    {limit_div}

                                    <div className='product-add-wrap flex items-center gap-4'>
                                      <div className='add-to-cart' style={{margin:"0"}}>
                                        {add_cart_div}
                                      </div>
                                        {/* <CounterInput initialValue={5} min={0} max={10} /> */}
                                        {/* <button className='addtocart-btn link-design1-cancel hover-red-bg py-2 px-4  md:px-12 lg:px-16 rounded-md'>Add to Cart</button> */}
                                        
                                        {fav_icon}
                                        {compare_div}
                                        {/* <button className='addtowishlist-btn link-design1-cancel hover-red-bg py-2 px-3 rounded-md'><UilHeart size="20" color="#ffffff" /></button> */}
                                    </div>
                                    {/* <div className='product-cards mt-6'>
                                        <p className='text-sm text-gray-600 mb-3'>{t('Guaranteed safe checkout')}</p>
                                        <div className='flex'>
                                          <Image src={Pcard} width={200} height={200} alt="Picture of the author"/>
                                        </div>
                                    </div> */}
                                    
                                </div>
                            </div>
                        </div>
                    </section>
                    )
                })}
                
                {/* Product Detail - Tabs Section */}
                <section className='custom-products-section pb-6'>
                    <div className='frd-container mx-auto mb-10'>
                    <Tabs>
                      
                      <Tab label={t('SPECIFICATIONS')}>
                              <div className='py-4'>
                                  <div className='py-2 specification-table'>
                                  {
                                  groups.map(group=>{
                                    return(
                                      <div className='section-title '>
                                        <div className='sp-table-head'>
                                          {group}
                                        </div>
                                        <div className='sp-table-body'>
                                        {
                                          attributes.filter(a=>a.attributeGroup==group).map(attr=>{
                                            const attr_values = attr.attributeValue.split('\\n');
                                            return(
                                              <div className='flex justify-between'>
                                                <h4>{attr.attributeName}</h4>
                                                <h4>
                                                {
                                                  
                                                  attr_values.map(val=>{
                                                    return(
                                                      val.split("\r\n").map(place => <p> {place} </p>) 

                                                    )
                                                  })
                                                }

                                                </h4>
                                                {/* <h4>{attr_values[0]}</h4> */}
                                                
                                                
                                            </div>
                                            )
                                          })
                                        }
                                      </div>
                                        
                                        
                                    </div>
                                    )
                                  })
                                }
                                      
                                  </div>
                                  
                              </div>
                      </Tab>
                      <Tab label={t('ACCESSORIES')}>
                              <div className='accessories-products-grid grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
                                {
                                  accessories.map(product=>{
                                    const items = [];

                                      for(let i = 1; i <= 5; i++)
                                      {
                                        if(product.starCount >= i){
                                          items.push(<UisStar size="18" color="#ffc400" />)
                                        }
                                        else {
                                          items.push(<UilStar size="18" color="#ffc400" />)
                                        }
                                      }
                                      const images=[];
                                      images.push(<img src={product.mainImage} width="300" height="400" class="latest-product-swiper-item-img object-cover w-full h-full" alt={product.name}></img>)
                                      if(product.secondImage==null)
                                      {
                                        images.push(<img src={product.mainImage} width="300" height="400" class="latest-product-swiper-item-img object-cover w-full h-full" alt={product.name}></img>)

                                      }
                                      else{
                                        images.push(<img src={product.secondImage} width="300" height="400" class="latest-product-swiper-item-img object-cover w-full h-full" alt={product.name}></img>)

                                      }
                                    return(
                                    <div className='zoom-img custom-product-swiper-item mb-12 pb-5 relative'>
                                          <div className='custom-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square'>
                                          <Link href={`/product/${product.id}`} className=''>
                                              {images}
                                          </Link>
                                          {/* <div className='hover-item-wrap flex items-center justify-center gap-3'>
                                              <div className='wishlist-icon flex items-center justify-center hover-red-bg'>
                                                  <UilHeart size="20" color="#ffffff" />
                                              </div>
                                              <div className='compare-icon flex items-center justify-center hover-red-bg'>
                                                  <UilComparison size="20" color="#ffffff" />
                                              </div>
                                          </div> */}
                                          </div>
                                      <div className='custom-product-swiper-item-content pt-5 mt-1 px-3'>
                                              <div className='rating flex gap-1 justify-center'>
                                                {items}
                                              </div>
                                              <div className='name text-center my-2'>
                                                <Link href={`/product/${product.id}`}  key={product.id} passHref={true} className='hover-red text-lg'>{product.name}</Link>
                                              </div>
                                              <div className='price flex justify-center items-center gap-2'>
                                                <span className='inline-block text-lg font-bold ls-5'>{product.price.toFixed(2)}₼</span>
                                              {/* <del className='inline-block text-sm'>$119.00</del> */}
                                              </div>
                                              {/* <div className='add-to-cart'>
                                              <div className='add-to-cart-wrap flex items-center justify-center gap-2'>
                                                  <input className="" type="number"/>
                                                  <button className='rounded-full font-bold inline-block text-base'>Add</button>
                                              </div>
                                              </div> */}
                                      </div>
                                      
                                      {
                                        product.about!=null?(<div className='info-icon absolute '>
                                        <div className='info-icon-circle flex items-center justify-center hover-red-bg'>
                                          <UilInfo size="30" color="#ffffff" />
                                        </div>
                                        <div className='info-icon-box'>
                                          <div className='info-icon-box-table'>
                                              <div className='sp-table-head'>
                                                {product.about.substring(0,300)}...
                                              </div>
                                          </div>
                                        </div>
                                  </div>):(<div className='info-icon absolute '>
                                          <div className='info-icon-circle flex items-center justify-center hover-red-bg'>
                                            <UilInfo size="30" color="#ffffff" />
                                          </div>
                                    </div>)
                                      }
                                  </div>
                                    )

                                  })
                                }
                                  
                              </div>
                      </Tab>
                      <Tab label={t('REVIEWS')}>
                              <div className="py-4">
                                  <div className='product-detail-review-wrap py-6 px-2 md:p-6 pd-review-border'>
                                      {/* Review Top */}
                                      {reviews.length>0?(<div className='product-detail-review-top'>
                                          <h5 className='text-lg text-gray-700 font-semibold mb-3'>{t('CUSTOMER REVIEWS')}</h5>   
                                          {products.map(product=>{
                                              const items = [];

                                              for(let i = 1; i <= 5; i++)
                                              {
                                                if(product.starCount >= i){
                                                  items.push(<UisStar size="18" color="#ffc400" />)
                                                }
                                                else {
                                                  items.push(<UilStar size="18" color="#ffc400" />)
                                                }
                                              }
                                              return(<div className='flex justify-between items-center flex-col md:flex-row gap-6'>
                                              <div className='rating flex justify-center items-center gap-2'>
                                                  {items}
                                                  <span className='text-sm ml-1 text-slate-700'>{t('Based on')} {reviews.length} {t('review')}</span>
                                              </div>
                                              {
                                                isLogin==1?(<div style={{cursor:"pointer"}}>
                                                <span className='hover-red text-sm' onClick={toggleVisibility}>{t('Write a review')}</span>
                                            </div>):(<div style={{cursor:"pointer"}}>
                                                  <Link href="/login" className='hover-red text-sm'>{t('Please login for write a review')}</Link>
                                              </div>)
                                              }
                                              
                                          </div>)
                                              
                                            })
                                            }                                 
                                          
                                      </div>):(<div className='product-detail-review-top'>
                                          <h5 className='text-lg text-gray-700 font-semibold mb-3'>{t('CUSTOMER REVIEWS')}</h5>   
                                          
                                              
                                              <div className='flex justify-between items-center flex-col md:flex-row gap-6'>
                                              <div className='rating flex justify-center items-center gap-2'>
                                                  <UilStar size="18" color="#ffc400"></UilStar>
                                                  <UilStar size="18" color="#ffc400"></UilStar>
                                                  <UilStar size="18" color="#ffc400"></UilStar>
                                                  <UilStar size="18" color="#ffc400"></UilStar>
                                                  <UilStar size="18" color="#ffc400"></UilStar>
                                                  <span className='text-sm ml-1 text-slate-700'>{t('No reviews yet')}</span>
                                              </div>
                                              {
                                                isLogin==1?(<div style={{cursor:"pointer"}}>
                                                <span className='hover-red text-sm' onClick={toggleVisibility}>{t('Write a review')}</span>
                                            </div>):(<div style={{cursor:"pointer"}}>
                                                  <Link href="/login" className='hover-red text-sm'>{t('Please login for write a review')}</Link>
                                              </div>)
                                              }
                                          </div>
                                              
                                                                            
                                          
                                      </div>)}
                                      

                                      {isVisible && (
                                        <div className='product-detail-review-from'>
                                          <form className='py-4' onSubmit={submitReview}>
                                              <h6>{t('Write a review')}</h6>

                                              <label className='text-sm text-slate-500 mt-4 block mb-1'>{t('Rating')}</label>
                                              <div className='rating flex justify-start items-center gap-2'>
                                                <fieldset class="ratingg">

                                                  <input type="radio" id="star5" name="rating" value="5" onClick={(e)=>setRating(e.target.value)} />
                                                  <label class="full" for="star5"></label>

                                                  <input type="radio" id="star4" name="rating" value="4" onClick={(e)=>setRating(e.target.value)} />
                                                  <label class="full" for="star4"></label>

                                                  <input type="radio" id="star3" name="rating" value="3" onClick={(e)=>setRating(e.target.value)} />
                                                  <label class="full" for="star3"></label>

                                                  <input type="radio" id="star2" name="rating" value="2" onClick={(e)=>setRating(e.target.value)} />
                                                  <label class="full" for="star2"></label>

                                                  <input type="radio" id="star1" name="rating" value="1" onClick={(e)=>setRating(e.target.value)} />
                                                  <label class="full" for="star1"></label>

                                              </fieldset>
                                                  {/* <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" />
                                                  <UilStar size="19" color="#ffc400" /> */}
                                              </div>

                                              <label className='text-sm text-slate-500 mt-4 block mb-1'>{t('Review Title')}</label>
                                              <input className="appearance-none block w-full  border rounded-sm py-3 px-4  leading-tight" 
                                                  type="text" 
                                                  placeholder={t('Review Title')} onChange={(e) => setTitle(e.target.value)} />

                                              <label className='text-sm text-slate-500 mt-4 block mb-1'>{t('Body of Review')}</label>
                                              <textarea className="appearance-none block w-full  border rounded-sm py-3 px-4  leading-tight" 
                                                  type="text" 
                                                  placeholder={t('Body of Review')} onChange={(e) => setText(e.target.value)} />
                                              <div className='flex justify-end'>
                                                  <button type="submit" className='link-design1-cancel hover-red-bg py-4 px-8  md:px-12 lg:px-16 rounded-3xl my-3 text-base'>{t('Submit Review')}</button>
                                              </div>
                                              <div className="message">{message ? <p>{message}</p> : null}</div>
                                          </form>
                                      </div>
                                      )}
                                      
                                      {/* Review 1 */}
                                      {
                                        reviews.map(review=>{
                                          const items = [];

                                            for(let i = 1; i <= 5; i++)
                                            {
                                              if(review.star >= i){
                                                items.push(<UisStar size="19" color="#ffc400" />)
                                              }
                                              else {
                                                items.push(<UilStar size="19" color="#ffc400" />)
                                              }
                                            }
                                          return(
                                            <div className='product-detail-reviews py-6 mt-6'>
                                              <div className='rating flex justify-start items-center gap-2 mb-6'>
                                                  {items}
                                              </div>
                                              <h6 className='text-sm mb-2'>{review.title}</h6>
                                              <h6 className='pdr-date text-sm'>
                                                  <span className='text-slate-700 mr-1 font-semibold'>{review.reviewerName}</span>
                                                  
                                                  <span className='text-slate-700 ml-1 font-semibold'>{review.reviewerDate.split('T')[0]}</span>
                                              </h6>
                                              <p className='mt-4 text-sm'>{review.summary}</p>
                                          </div>

                                          )
                                        })
                                      }
                                      
                                  </div>    
                              </div>
                      </Tab>
                    </Tabs>
                    </div>
                </section>
                 {/* Related Products */}
                <section className='related-products-section pb-6' >
                    <div className='frd-container mx-auto mb-10'>
                        <div className='flex justify-center items-center'>
                            <div className='section-title '>
                                <h2>{t('Similar Products')}</h2>
                            </div>
                        </div>
                    </div>
                    <div className='frd-container mx-auto'>
                        <Swiper 
                        breakpoints={{ 300: {slidesPerView: 1,}, 768: {slidesPerView: 3,}, 992: {slidesPerView: 5,}}} 
                        spaceBetween={20} loop={true} autoplay={{ delay: 2500, disableOnInteraction: false, }} 
                        hashNavigation={{ watchState: true, }} 
                        navigation={true} 
                        modules={[ Navigation, HashNavigation]} 
                        onSlideChange={() => console.log('slide change')} onSwiper={(swiper) => console.log(swiper)}>
                            
                            {
                                similarProducts.map(product=>{
                                    const items = [];
                                    for(let i = 1; i <= 5; i++)
                                    {
                                        if(product.starCount >= i){
                                        items.push(<UisStar size="18" color="#ffc400" />)
                                        }
                                        else {
                                        items.push(<UilStar size="18" color="#ffc400" />)
                                        }
                                    }

                                    const images=[];
                                    images.push(<img src={product.mainImage} width="300" height="400" class="latest-product-swiper-item-img object-cover w-full h-full" alt={product.name}></img>)
                                    if(product.secondImage==null)
                                    {
                                        images.push(<img src={product.mainImage} width="300" height="400" class="latest-product-swiper-item-img object-cover w-full h-full" alt={product.name}></img>)

                                    }
                                    else{
                                        images.push(<img src={product.secondImage} width="300" height="400" class="latest-product-swiper-item-img object-cover w-full h-full" alt={product.name}></img>)

                                    }
                                    const fav_icon=[];
                                    if(product.favorite==0)
                                    {
                                        fav_icon.push(<div className='wishlist-icon flex items-center justify-center hover-red-bg' ><FontAwesomeIcon className='fav_icon_reg' icon={regularHeart} style={{fontSize:22}}  color="#ffffff" onClick={addFavorite} id={product.id} /><FontAwesomeIcon style={{display:'none',fontSize:22}} className='fav_icon_solid' icon={solidHeart} color="#ffffff" onClick={removeFavorite} id={product.id} /></div>)
                                    }
                                    else{
                                        fav_icon.push(<div className='wishlist-icon flex items-center justify-center hover-red-bg' ><FontAwesomeIcon style={{display:'none',fontSize:22}} className='fav_icon_reg' icon={regularHeart}  color="#ffffff" onClick={addFavorite} id={product.id} /><FontAwesomeIcon className='fav_icon_solid' icon={solidHeart} style={{fontSize:22}} color="#ffffff" onClick={removeFavorite} id={product.id} /></div>)
                                    }
                                    const add_cart_div=[];
                                    if(product.quantity>0)
                                    {
                                        add_cart_div.push(<div className='add-to-cart-wrap pm flex items-center justify-center gap-2'><input class="cart_quant cart_quant_update" type="number" min="1" max="10000" defaultValue={product.quantity} onKeyUp={updateInput} id={product.id} /><div className='flex gap-2 pm-wrap minus_plus_btn' id={product.cartId}><button type="button" className='rounded-full font-bold inline-block text-base plus_button' onClick={plusCart} id={product.id}><span>+</span></button><button type="button" className='rounded-full font-bold inline-block text-base minus_button' onClick={minusCart} id={product.id}><span>-</span></button></div></div>)

                                    }
                                    else{
                                        add_cart_div.push(<div className='add-to-cart-wrap flex items-center justify-center gap-2'><input class="cart_quant" type="number" min="1" max="10000" defaultValue="1"/><button type='button' onClick={addCart} id={product.id} className='rounded-full font-bold inline-block text-base add_cart_btn'>{t('Add')}</button></div>)
                                    }
                                    const compare_div=[];
                                    if(product.compared==0){
                                      compare_div.push(<div className='compare-icon flex items-center justify-center hover-red-bg' ><FontAwesomeIcon className='comp_icon_reg' icon={faScaleUnbalanced} style={{fontSize:22}}  color="#ffffff" onClick={addCompare} id={product.id} /><FontAwesomeIcon style={{display:'none',fontSize:22}} className='comp_icon_solid' icon={faScaleBalanced} color="#ffffff" onClick={removeCompare} id={product.id} /></div>)

                                    }
                                    else{
                                      compare_div.push(<div className='compare-icon flex items-center justify-center hover-red-bg'><FontAwesomeIcon style={{display:'none',fontSize:22}} className='comp_icon_reg' icon={faScaleUnbalanced}  color="#ffffff" onClick={addCompare} id={product.id} /><FontAwesomeIcon className='comp_icon_solid' icon={faScaleBalanced} style={{fontSize:22}} color="#ffffff" onClick={removeCompare} id={product.id} /></div>)
                                    }
                                    return(
                                        <SwiperSlide className='zoom-img prod-detail-related-product-swiper-item mb-12 pb-5 relative'>
                                        <div className='prod-detail-related-product-swiper-item-img-wrap w-full overflow-hidden relative aspect-square'>
                                        <Link href={"/product/" + product.id} key={product.id} passHref={true} className=''>
                                            {images}
                                        </Link>
                                        <div className='hover-item-wrap flex items-center justify-center gap-3'>
                                            {fav_icon}
                                            {compare_div}
                                        </div>
                                        </div>
                                    <div className='prod-detail-related-product-swiper-item-content pt-5 mt-1 px-3'>
                                            <div className='rating flex gap-1 justify-center'>
                                                {items}
                                            </div>
                                            <div className='name text-center my-2'>
                                            <Link href={"/product/" + product.id} key={product.id} passHref={true} className='hover-red text-lg'>{product.name}</Link>
                                            </div>
                                            <div className='price flex justify-center items-center gap-2'>
                                                <span className='inline-block text-lg font-bold ls-5'>{product.price.toFixed(2)}₼</span>
                                            {/* <del className='inline-block text-sm'>$119.00</del> */}
                                            </div>
                                            <div className='add-to-cart'>
                                                {add_cart_div}
                                            </div>
                                    </div>
                                    {
                                      product.about!=null?(<div className='info-icon absolute '>
                                      <div className='info-icon-circle flex items-center justify-center hover-red-bg'>
                                        <UilInfo size="30" color="#ffffff" />
                                      </div>
                                      <div className='info-icon-box'>
                                      <div className='info-icon-box-table'>
                                          <div className='sp-table-head'>
                                            {product.about.substring(0,300)}...
                                          </div>
                                      </div>
                                      </div>
                                </div>):(<div className='info-icon absolute '>
                                        <div className='info-icon-circle flex items-center justify-center hover-red-bg'>
                                          <UilInfo size="30" color="#ffffff" />
                                        </div>
                                  </div>)
                                    }
                                </SwiperSlide>
                                    )
                                })
                            }
                        
                        </Swiper>
                    </div>
                </section>
            </section>
        </main>
    )
}

