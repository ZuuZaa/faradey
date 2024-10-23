'use client'
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import Link from 'next/link';
import { UilCheck, UilInfo, UilMap, UilEnvelope } from '@iconscout/react-unicons'
import Image from 'next/image';

import Tick from '../../../public/images/tick.png';


export default function Success() {
  const { t, i18n } = useTranslation();
  const changeLanguage = async (event) => {
    const lng=event.currentTarget.textContent
    //console.log(lng)
    await i18n.changeLanguage(lng);
    if(typeof localStorage !== 'undefined') {
        localStorage.setItem("langId",lng)
    }
    const fetchedData = await mainFunc();
    setData(fetchedData);

};

    let lang_id='EN';
    const mainFunc=async () => {
    let status;
    let fav_data=[];

    const fetchData = async () => {
        if (typeof localStorage !== 'undefined') {
            if(localStorage.getItem("langId")!=null){
              lang_id=localStorage.getItem("langId");
            }
            
        }
        const params = new URLSearchParams();
        params.append('LanguageID',lang_id);
        let token="";
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem("jwtToken");
        }
        let response=await fetch(`http://89.40.2.200:3461/api/checkout/get-success?${params.toString()}`,{
            method: 'GET',
            dataType: 'json',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + token
            },
        }
        )
         const resp = await response.json();
         status=resp.status
         console.log(status)
         fav_data=resp.output
         //return resp.output;
    }

    await fetchData()

    if (status === 401) {
        try {
            let token="";
            let refreshToken="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
                refreshToken=localStorage.getItem("refreshToken");
            }
            console.log(token)
            console.log(refreshToken)
            let response=await fetch(`http://89.40.2.200:3461/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
                method: 'POST',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                },
            })
            console.log(response)
            const resp = await response.json();
            
            if(resp.status !== 400) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem("refreshToken", resp.output.refreshToken);
                    localStorage.setItem("jwtToken", resp.output.token);
                }
                

                await fetchData();
            } else {
                
                if (typeof window !== 'undefined') {
                    window.location.href="/login"
                  }
                //go to login page
                //alert(1)
            }
        } 
        catch {
            console.log("error")
        }
    }
    else{
        return fav_data
    }
    
}
const [data, setData] = useState({ 
    sale: [],
    cart: []
        }); 
    useEffect(() => {
        async function fetchDataAsync() {
        const fetchedData = await mainFunc();
        setData(fetchedData);
        await i18n.changeLanguage(lang_id);
        document.getElementById("cart_drop").style.display="none"
        document.getElementById("cart_quantity").style.display="none"
    }
        fetchDataAsync();
    }, []);

    const cart=data.cart;

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
    <main>

        {/* Breadcrumb */}
        <div className='breadcrumb-wrapper py-8'>
          <div className='custom-container mx-auto'>
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium"> {t('Home')} </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2 flex items-center">{t('Success')}</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Success  Section */}
        <section className='login-register-main-section mt-5'>
          <div className='custom-container mx-auto'>
            <div className='account-lr-wrap mx-auto p-8 text-center'>
                <Image src={Tick} width={200} height={200} className='success-page-icon object-cover w-full h-full' alt='Product'/>
                <h4 className='account-page-title'>{t('Order Completed!')}</h4>
                <p className='mb-8'>{t('Thanks for your order! We received your order request, we will be in touch shortly.')}</p>
            </div>
          </div> 
        </section>

    </main>
  )
}

