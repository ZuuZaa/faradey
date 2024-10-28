'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from './MobileMenu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import FlagEng from '../../../public/images/lang/uk.png'
import FlagAz from '../../../public/images/lang/aze.png'
import FlagRu from '../../../public/images/lang/rus.png'
import { API_URL } from '@/constants';

    

export default function MobileHeader() {
    const { t, i18n } = useTranslation();
    const changeLanguage = async (event) => {
        const lng=event.currentTarget.textContent
        console.log(lng)
        await i18n.changeLanguage(lng);
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem("langId",lng)
        }
        const fetchedData = await getHeader();
        setData(fetchedData);
        setData1(fetchedData.header)
    
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
    // const token = localStorage.getItem("jwtToken");
    const params = new URLSearchParams();
    params.append('SessionId', session_id);
    params.append('LanguageID',lang_id);
    const response = await fetch(
      `${API_URL}/api/layout/get-header?${params.toString()}`,
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
    useEffect(() => {
            const mobilemenuitempluslist = document.querySelectorAll(`.mobile-offcanvas-menu-list-plus`);
            const mobilemenuitem_ul_list = document.querySelectorAll(`.mobile-offcanvas-menu-list li.has-subcategory ul`);
            const mobilemenuitem_plus_list = document.querySelectorAll(`.mobile-offcanvas-menu-list-plus`);
            for (let i = 0; i < mobilemenuitempluslist.length; i++) {
                mobilemenuitempluslist[i].addEventListener("click",function(){
                        
                    var mhnav_ul=this.parentElement.nextElementSibling.querySelector("ul");
                    
                    for (let h = 0; h < mobilemenuitem_ul_list.length; h++) {
                        mobilemenuitem_ul_list[h].classList.remove('active');
                    }

                    for (let j = 0; j < mobilemenuitem_plus_list.length; j++) {
                        mobilemenuitem_plus_list[j].classList.remove('active');
                    }

                        if (this.classList.contains("active")) {
                        this.classList.remove("active");
                        }
                        else{
                        this.classList.add("active");
                        }

                        if (mhnav_ul.classList.contains("active")) {
                        mhnav_ul.classList.remove("active");
                        }
                        else{
                        mhnav_ul.classList.add("active");
                        }


                })
                }
        }); 
        
    const [data, setData] = useState({ 
                        header:[],
                        isLogin:[]
    });

    const [data1, setData1] = useState({ 
                                settings:[],
                                mainCategories:[],
                                categories:[],
                                subCategories:[]
    });


    useEffect(() => {
        async function fetchDataAsync() {
        const fetchedData = await getHeader();
        setData(fetchedData);
        setData1(fetchedData.header)
        await i18n.changeLanguage(lang_id);
        }
        fetchDataAsync();
    }, []);
    
    
    const totalQuantity=data.header.totalQuantity
    const islogin=data.isLogin;
    const settings=data1.settings
    const mainCategories=data1.mainCategories; 
    const categories=data1.categories;
    const subCategories=data1.subCategories;

    let searchClick=async(event)=>{
        const searchWord=event.currentTarget.previousSibling.value;
        if (typeof window !== 'undefined') {
            window.location.href="/search?search="+searchWord
        }
        
      }
      let searchEnter=async(event)=>{
        if (event.key === 'Enter') {
            const searchWord=event.currentTarget.value;
            if (typeof window !== 'undefined') {
                window.location.href="/search?search="+searchWord
            }
            
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
        <div className = "mobile-offcanvas active ">
            <div className="mobile-offcanvas-layer" onClick ={()=>setShow(false)}></div>
            <div className="mobile-offcanvas-menu">
                {/* <h5 className='text-sm text-neutral-100 mb-5'>Tell a friend about Drou & get 20% off*</h5> */}
                
                <div className='flex items-center rounded-full overflow-hidden bg-white'>
                    <input className="appearance-none block w-full text-gray-800 text-base outline-none border-none  py-3 px-4  leading-tight" 
                            id="" type="text" placeholder="Search..."  onKeyDown={searchEnter} />
                            <FontAwesomeIcon icon={faTimes} color="#cecece" className='text-3xl mx-auto w-14' onClick={searchClick}/>
                </div>
                <MobileMenu/>
                {/* <div className='mobile-offcanvas-menu-list py-5'>
                    <ul className='' >
                        <li className='has-subcategory'>
                            <div className='flex justify-between items-center'>
                            <Link href=''>Category 1</Link> 
                            <span className='mobile-offcanvas-menu-list-plus'><FontAwesomeIcon icon={faPlus} color="#cecece" className='mx-auto w-14 text-xl'/></span> 
                            </div>
                            <div>
                                <ul className=''>
                                    <li><Link href=''>SubCategory 1</Link></li>
                                    <li><Link href=''>SubCategory 2</Link></li>
                                    <li><Link href=''>SubCategory 3</Link></li>
                                    <li><Link href=''>SubCategory 4</Link></li>
                                    <li><Link href=''>SubCategory 5</Link></li>
                                    <li><Link href=''>SubCategory 6</Link></li>
                                </ul>
                            </div>
                        </li>
                        <li ><Link href=''>Category 9</Link> </li>
                    </ul>
                </div> */}

                <div className='mobile-offcanvas-menu-info py-5'>
                    {islogin==0?(
                        <div className='flex gap-3'>
                        <Link href='/login'><h4>{t('Login/Signup')}</h4></Link>
                    </div>
                        ):(<div className='flex gap-3'>
                        <Link href='/account/profile'><h4>{t('My Account')}</h4></Link>
                    </div>)}

                    {
                        settings.map(set=>{
                            return(
                                
                                <div>
                                    <Link href=''><h4>{set.phone}</h4></Link>
                                    <Link href=''><h4>{set.email}</h4></Link>
                                </div>
                            )
                        })
                    }
                    

                </div>
                <div className='mobile-offcanvas-menu-socials py-5 flex gap-3'>
                    <Link href=''><FontAwesomeIcon icon={faFacebook} color="#333" className='mx-auto w-14 text-sm'/></Link>
                    <Link href=''><FontAwesomeIcon icon={faInstagram} color="#333" className='mx-auto w-14 text-sm'/></Link>
                    <Link href=''><FontAwesomeIcon icon={faGoogle} color="#333" className='mx-auto w-14 text-sm'/></Link>
                    <Link href=''><FontAwesomeIcon icon={faLinkedin} color="#333" className='mx-auto w-14 text-sm'/></Link>
                </div>
                {/* <div className='mobile-offcanvas-menu-lang py-5 flex gap-3 justify-between'>
                    <button onClick={ () => changeLanguage('en')} className='flex items-center gap-2 mb-3'><Image src={FlagEng} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>Eng</button>
                    <button onClick={ () => changeLanguage('az')} className='flex items-center gap-2 mb-3'><Image src={FlagAz} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>Az</button>
                    <button onClick={ () => changeLanguage('ru')} className='flex items-center gap-2 mb-3'><Image src={FlagRu} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>Ru</button>
                </div> */}
            </div>
        </div>
    )
}
