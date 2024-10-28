'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import Image from 'next/image';
import Swal  from 'sweetalert2';
// Icon
import { UilTimes  } from '@iconscout/react-unicons'
import { API_URL } from '@/constants';



  export default function Cartdropdown(){
    const { t, i18n } = useTranslation();

    const changeLanguage = async (event) => {
      const lng=event.currentTarget.textContent
      //console.log(lng)
      await i18n.changeLanguage(lng);
      if(typeof localStorage !== 'undefined') {
          localStorage.setItem("langId",lng)
      }
      const fetchedData = await fetchData();
      setData(fetchedData);

  };
    let lang_id='EN';
    let token="";
    let session_id="";
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem("jwtToken");
        session_id=localStorage.getItem("sessionId");
        
    }
  
  
    async function fetchData(){
      if (typeof localStorage !== 'undefined') {
        if(localStorage.getItem("langId")!=null){
          lang_id=localStorage.getItem("langId");
        }
      }
      const params = new URLSearchParams();
      params.append('SessionId', session_id);
      params.append('LanguageID',lang_id);
        const response=await fetch(`${API_URL}/api/cart/get-index?${params.toString()}`,{
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
                                    cart: [], 
                                    subtotal: [],
                                    total:[],
                                    totalQuantity:[]
                                    });
    
    useEffect(() => {
        
      async function fetchDataAsync() {
        
        const fetchedData = await fetchData();
            setData(fetchedData);
            await i18n.changeLanguage(lang_id);
        }
  
      fetchDataAsync();
    }, []);
      
    const carts = data.cart; 
    const subtotal=data.subtotal;
    const total=data.total;

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
          const res = await fetch(`${API_URL}/api/cart/add-to-cart`, {
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
                 
                 add_cart_btns[i].parentElement.innerHTML='<input class="cart_quant cart_quant_update" type="number" value="'+quantity+'" id="'+prodid+'" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="'+cart_id+'"><button class="rounded-full font-bold inline-block text-base plus_button" id="'+prodid+'"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="'+prodid+'"><span>-</span></button></div>'
                 //add_cart_btns[i].remove();
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

    let removeCart= async (event) => {
      let cartid=event.currentTarget.getAttribute('id');
      let prodid=event.currentTarget.getAttribute('tabindex');
      console.log("prod id"+prodid)
      let token="";
      let session_id="";
      if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem("jwtToken");
          session_id=localStorage.getItem("sessionId");
      }
        try {
          const res = await fetch(`${API_URL}/api/cart/remove-from-cart`, {
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
          
            
            if (res.status === 200) {
              const resJson = await res.json();
            console.log(resJson)
            //console.log(min_plus_btns)
            var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
            for (let i = 0; i < min_plus_btns.length; i++) 
            {
              if(min_plus_btns[i].getAttribute('id')==cartid){
                min_plus_btns[i].parentElement.innerHTML='<input class="cart_quant" type="number" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>'
                
                //min_plus_btns[i].remove();
                }
  
            }
            //console.log(document.querySelectorAll(".add_cart_btn"))
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
      console.log(quantity)
      try {
        const res = await fetch(`${API_URL}/api/cart/update-cart`, {
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
      console.log(quantity)
      if(quantity>0)
      {
        try {
          const res = await fetch(`${API_URL}/api/cart/update-cart`, {
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
              
            console.log("success minus cart")
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
          const res = await fetch(`${API_URL}/api/cart/remove-from-cart`, {
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
              
            console.log("success remove cart")
            var min_plus_btns=document.querySelectorAll(".minus_plus_btn")
            for (let i = 0; i < min_plus_btns.length; i++) 
            {
              if(min_plus_btns[i].getAttribute('id')==cartid){
                 
                min_plus_btns[i].parentElement.innerHTML='<input class="cart_quant" type="number" value="1"/><button type="button" id="'+prodid+'" class="rounded-full font-bold inline-block text-base add_cart_btn">Add</button></div>'
                
                //min_plus_btns[i].remove();
                }
  
            }
            //console.log(document.querySelectorAll(".add_cart_btn"))
            var add_btns=document.querySelectorAll(".add_cart_btn")
            for(let i = 0; i < add_btns.length; i++){
              add_btns[i].addEventListener('click',addCart)
            }
            var cart=resJson.output.cart
            console.log(cart.length)
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
                  <div width="20" class='text-primary hover-red cursor-pointer remove-cart' id=${cart[i].id} tabindex=${cart[i].productId} ><span>x</span></div>
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
      event.currentTarget.parentElement.innerHTML='<input class="cart_quant" type="number" value="'+quantity+'" id="'+prodid+'"  /><button type="button" class="rounded-full font-bold inline-block text-base update_button" id="'+cartid+'"><span>'+t('Update')+'</span></button>'
      var update_btns=document.querySelectorAll(".update_button")
      for(let i = 0; i < update_btns.length; i++){
        update_btns[i].addEventListener('click',updateCart)
      }
  
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
        const res = await fetch(`${API_URL}/api/cart/update-cart`, {
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
              update_button.parentElement.innerHTML='<input class="cart_quant cart_quant_update" type="number" value="'+quantity+'" id="'+prodid+'" /><div class="flex gap-2 pm-wrap minus_plus_btn" id="'+cartid+'"><button class="rounded-full font-bold inline-block text-base plus_button" id="'+prodid+'"><span>+</span></button><button class="rounded-full font-bold inline-block text-base minus_button" id="'+prodid+'"><span>-</span></button></div>'
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
  return (
    carts.length>0?(<div className='Cartdropdown absolute bg-white' id="cart_drop">
    <div>

      <div className='cartdropdown-products' id="cart_dropdown">
        {
          carts.map(cart=>{
            return(
              <div className='cartdropdown-item flex gap-3'>
                <div className='img relative'>
                  <img src={cart.productImage} width={82} height={82} className='cover' alt={cart.productName} ></img>
                  <span className='flex justify-center items-center absolute top-0 left-0 p-1 bg-red-500 rounded-2xl text-xs text-white font-semibold'>{cart.quantity}x</span>
                </div>
                <div className='content'> 
                    <Link href='/product/${cart[i].productId}'><h5 className='hover-red text-sm mb-1'>{cart.productName}</h5></Link>
                    <h6 className='text-sm text-rose-600 font-semibold'> {cart.price.toFixed(2)}₼</h6>
                </div>
                <div className='remove-cart-item'>
                <div width="20" class='text-primary hover-red cursor-pointer remove-cart' onClick={removeCart} id={cart.id} tabindex={cart.productId}><span>x</span></div>
                  {/* <UilTimes width={20} className='text-primary hover-red cursor-pointer' onClick={removeCart} id={cart.id} tabindex={cart.productId}/> */}
                </div>
              </div>
            )
          })
        }


      </div>
      
      <div className='cartdropdown-total flex justify-between items-center py-5 mb-5'>
        <h5 className='text-lg inline-block'>{t('TOTAL')} :</h5>
        <span className='text-rose-600 text-lg font-semibold inline-block' id="cart_subtotal"> {total} ₼</span>

      </div>

      <div className='cartdropdown-btns grid grid-cols-2 gap-3 py-5'>
          <Link href='/cart' className="py-3 link-design2 text-sm font-medium inline-flex rounded-full gap-1 justify-center">{t('View cart')}</Link>
          <Link href='/checkout' className="py-3 link-design2 text-sm font-medium inline-flex rounded-full gap-1 justify-center">{t('Checkout')}</Link>
      </div>

    </div>
  </div>):(<div className='Cartdropdown absolute bg-white' id="cart_drop" style={{display:"none"}}>
      <div>

        <div className='cartdropdown-products' id="cart_dropdown">
          


        </div>
        
        <div className='cartdropdown-total flex justify-between items-center py-5 mb-5'>
          <h5 className='text-lg inline-block'>{t('TOTAL')}  :</h5>
          <span className='text-rose-600 text-lg font-semibold inline-block' id="cart_subtotal"> {total} ₼</span>

        </div>

        <div className='cartdropdown-btns grid grid-cols-2 gap-3 py-5'>
            <Link href='/cart' className="py-3 link-design2 text-sm font-medium inline-flex rounded-full gap-1 justify-center">{t('View cart')}</Link>
            <Link href='/checkout' className="py-3 link-design2 text-sm font-medium inline-flex rounded-full gap-1 justify-center">{t('Checkout')}</Link>
        </div>

      </div>
    </div>)
    
  )
}


