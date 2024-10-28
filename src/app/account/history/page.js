'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import Link from 'next/link';
import Image from 'next/image';
import { UilSearch, UilCalender, UilCommentAltLines,UilArrowRight,UilArrowLeft     } from '@iconscout/react-unicons'
import Menu from '../menu'
import { Card, Typography } from "@material-tailwind/react";
import { API_URL } from '@/constants';


    

export default function History() {
    const { t, i18n } = useTranslation();

    const changeLanguage = async (event) => {
        const lng=event.currentTarget.textContent
        await i18n.changeLanguage(lng);
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem("langId",lng)
        }
        const fetchedData = await fetchData();
        setData(fetchedData);

    };
    let lang_id='EN';
    const fetchData=async () => {
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
            let response=await fetch(`${API_URL}/api/profile/get-myorders?${params.toString()}`,{
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
const TABLE_HEAD = [t('Sold Date'), t('Quantity'), t('Total'), ""];
    const [data, setData] = useState({ 
        user: [], 
        userAddress: [], 
        userOrders: []
        });

    useEffect(() => {
        async function fetchDataAsync() {
            try{
                const fetchedData = await fetchData();
                setData(fetchedData);
                await i18n.changeLanguage(lang_id);
            }
            catch(error){
                console.log(error)
            }
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
    const userOrders=data.userOrders;
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
                                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('My Orders')}</a>
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
                            <div className='account-history-wrapper'>
                                <div className="w-full">
                                <Card className="h-full w-full">
                                    <table className="w-full min-w-max table-auto text-left">
                                        <thead>
                                        <tr>
                                            {TABLE_HEAD.map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                                >
                                                {head}
                                                </Typography>
                                            </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {userOrders.map( order=> {
                                            return(
                                                <tr key={order.id} className="even:bg-blue-gray-50/50">
                                                    <td className="p-4">
                                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {order.soldDate.split('T')[0]}
                                                        </Typography>
                                                    </td>
                                                    <td className="p-4">
                                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {order.quantity}
                                                        </Typography>
                                                    </td>
                                                    <td className="p-4">
                                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {order.total.toFixed(2)}₼
                                                        </Typography>
                                                    </td>
                                                    <td className="p-4">
                                                        <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                                                            <Link href={`history/${order.id}`}>{t('Details')}</Link>
                                                        
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            )
                                            
                                        })}
                                        </tbody>
                                    </table>
                                    </Card>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>

    )
}

