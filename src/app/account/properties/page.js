'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import Link from 'next/link';
import Image from 'next/image';
import { UilEdit } from '@iconscout/react-unicons'
import Menu from '../menu'

import { Card, Typography } from "@material-tailwind/react";
import { API_URL } from '@/constants';



export default function Project() {
    const { t, i18n } = useTranslation();

    const changeLanguage = async (event) => {
        const lng=event.currentTarget.textContent
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
            let token="";
            if (typeof localStorage !== 'undefined') {
                token = localStorage.getItem("jwtToken");
                if(localStorage.getItem("langId")!=null){
                    lang_id=localStorage.getItem("langId");
                  }
            }
            const params = new URLSearchParams();
            params.append('LanguageID',lang_id);
            let response=await fetch(`${API_URL}/api/projects/get-project-settings?${params.toString()}`,{
                method: 'GET',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + token
                },
            }
            )
            console.log(response)
             const resp = await response.json();
             status=resp.status
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
                let response=await fetch(`${API_URL}/api/account/refresh-token?userRefreshToken=${refreshToken}`,{
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
    const [data, setData] = useState(0); 
    useEffect(() => {
        async function fetchDataAsync() {
        const fetchedData = await mainFunc();
        setData(fetchedData);
        await i18n.changeLanguage(lang_id);
    }
        fetchDataAsync();
    }, []);

      //console.log(data)

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

      const [settings, setSettings] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault()
        // e.preventDefault();
        let token="";
        if (typeof localStorage !== 'undefined') {
            token = localStorage.getItem("jwtToken");
        }
        try {
          const res = await fetch(`${API_URL}/api/projects/set-project-settings`, {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              settings:settings
            }),
          });
          const resJson = await res.json();
          console.log(resJson)
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
                                <a href="/account" className="inline-flex items-center text-sm font-medium"> {t('My Account')} </a>
                            </li>

                            <li>
                                <div className="flex items-center">
                                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('Properties')}</a>
                                </div>
                            </li>
                            
                        </ol>
                    </div>
                </div>
            </div>
            
            {/* Account Section */}
            <section className='account-page-main-section my-20 py-3'>
                <div className='custom-container mx-auto'>
                    <div className='flex'>
                       
                        <div className='account-page-menu w-2/5'>
                            <h5 className='title relative mb-5 text-lg'>{t('My Account')}</h5>
                            <Menu />
                        </div>
                        
                        <div className='account-page-main w-3/5'>
                            <div className='account-projects-wrapper'>
                                <div className=''>
                                    <div className='account-properties-wrap'>
                                        <div className='title  border-b-2 mb-5'>
                                            <h2 className='text-lg leading-10'>{t('Presentation Settings')}</h2>
                                        </div>
                                        <div className='account-properties-wrapper'>
                                            <form className="w-full" onSubmit={handleSubmit}>
                                                <p className='mb-5'>{t('On this page, select the type of price indicator: retail only or retail + wholesale.')}</p>
                                            
                                            {
                                                data==0?(<select className='border border-gray-200 px-3 py-2 outline-none mb-2' onChange={(e) => setSettings(e.target.value)}>
                                                <option value="0" selected>{t('Retail')}</option>
                                                <option value="1">{t('Retail + Wholesale')}</option>
                                                </select>):(<select className='border border-gray-200 px-3 py-2 outline-none mb-2' onChange={(e) => setSettings(e.target.value)}>
                                                <option value="0">{t('Retail')}</option>
                                                <option value="1" selected>{t('Retail + Wholesale')}</option>
                                                </select>)
                                            }
                                                
                                            <button type="submit" className='py-2 px-5 rounded-sm link-design1 ml-3'>{t('Submit')}</button>
                                            </form>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>

    )
}

