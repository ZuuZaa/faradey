'use client'

import {React, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import $ from 'jquery'; // Import jQuery
import Link from 'next/link'
import Image from 'next/image'
import { UilHeart, UilSearch, UilShoppingBag, UilComparison, UilBars } from '@iconscout/react-unicons'
import Logo from '../../../public/images/logo/logo.png'
import UserImg from '../../../public/images/user.png'
import FlagEng from '../../../public/images/lang/uk.png'
import FlagAz from '../../../public/images/lang/aze.png'
import FlagRu from '../../../public/images/lang/rus.png'
import Cartdropdown from './Cartdropdown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass as faSearch, faBars, faShoppingBag,faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import MobileHeader from './MobileHeader';
import { flatMap } from '../../../public/fonts/fontawesome-free-6.5.1-web/js/v4-shims';
import {faScaleBalanced } from '@fortawesome/free-solid-svg-icons'
<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
export default function Header () {
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

    let token="";
let session_id="";
if (typeof localStorage !== 'undefined') {
    
    token = localStorage.getItem("jwtToken");
    session_id=localStorage.getItem("sessionId");

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    if(session_id==null || session_id==""){
        let value = uuidv4();
        if(typeof localStorage !== 'undefined') {
            localStorage.setItem("sessionId",value)
        }
        
    }
}
let lang_id='EN';
async function getHeader(){
    if(localStorage.getItem("langId")!=null){
        lang_id=localStorage.getItem("langId");
      }
    // const token = localStorage.getItem("jwtToken");
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
    console.log(data);
    return data.output;
  }

    const [isScrolled, setIsScrolled] = useState(false);
    const [show, setShow] = useState(false);
    // const[show,setShow] = useState(true)
    
    // Function to handle the scroll event
    const handleScroll = () => {
        const position = window.pageYOffset;
        let a =  false;
        setIsScrolled(position > 0);
    };

    // Adding the scroll event listener
    useEffect(() => {
        
        window.addEventListener('scroll', handleScroll);

        // Cleaning up the event listener
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    // Navigation Responsive  - Other 
    useEffect(() => {
        if (window.innerWidth > 1000) {
          function calcWidth() {
            var navwidth = 0;
            var otherwidth = $('header nav  ul.header-nav-ul .other').outerWidth(true);
            $('header nav  ul.header-nav-ul > li:not(.other)').each(function () {
              navwidth += $(this).outerWidth(true);
            });
    
            var availablespace = $('header nav').width() - otherwidth;
    
            if (navwidth > availablespace) {
              var lastItem = $('header nav  ul.header-nav-ul > li:not(.other)').last();
              lastItem.attr('data-width', lastItem.outerWidth(true));
              lastItem.prependTo($('header nav  ul.header-nav-ul .other ul'));
              calcWidth();
            } else {
              var firstOtherElement = $('header nav  ul.header-nav-ul li.other li').first();
              if (navwidth + firstOtherElement.data('width') < availablespace) {
                firstOtherElement.insertBefore($('header nav  ul.header-nav-ul .other'));
              }
            }
    
            if ($('.other li').length > 0) {
              $('.other').css('display', 'inline-block');
            } else {
              $('.other').css('display', 'none');
            }
          }
    
          // Call calcWidth initially and on resize/load
          $(window).on('resize load', function () {
            calcWidth();
          });
          $(document).ready(function () {
            calcWidth();
          });
        }
      }, []);


    let path="";
    if (typeof window !== 'undefined') {
        path=window.location.pathname
    }
    
    if(path.includes("login")==false && typeof localStorage !== 'undefined'){
        localStorage.setItem("pagePath",path)
    }

    

    const [data, setData] = useState({ 
                            header:[],
                            isLogin:[]
  });

  const [data1, setData1] = useState({ 
                            settings:[],
                            mainCategories:[],
                            categories:[],
                            subCategories:[],
                            languages:[]
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
    const languages=data1.languages;
   


    let logout= async (event) => {
        // const token = localStorage.getItem("jwtToken");
        
        const response = await fetch("http://89.40.2.200:3461/api/account/logout", {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + token
              },});
              if(response.status==200 && typeof localStorage !== 'undefined'){
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("refreshToken");
                if (typeof window !== 'undefined') {
                    window.location.href="/login"
                }
                
              }
      }
    
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
      
    //   const changeLanguage = async (lng) => {
    //     await i18n.changeLanguage(lng);
    //     if(typeof localStorage !== 'undefined') {
    //         localStorage.setItem("langId",lng)
    //     }

    //};
  
  return (
    <>
       {show && <MobileHeader/>}

       {/* Close Mobile Header Icon */}
       <div className ={ `${show ?"close-mobile-offcanvas flex items-center justify-center active" : "close-mobile-offcanvas flex items-center justify-center"} ` } onClick ={()=>setShow(false)}>
                    <FontAwesomeIcon icon={faTimes} color="#fff" className='mx-auto w-14 text-4xl'/>
        </div>

        <header className={isScrolled ? 'header-section-2 scrolled':'header-section-2'}>
            <div className='frd-container mx-auto'>
                <div className='header-section-1 hidden lg:block'>
                    <div className='frd-container mx-auto'>
                        <div className='flex justify-between py-2 items-center'>
                            <div className='header-sec1-left'>
                                {
                                    settings.map(set=>{
                                        return(
                                            <ul className='flex'>
                                                <li>{set.phone}</li> 
                                                <li>{set.email}</li> 
                                            </ul>
                                        )
                                    })
                                }
                                
                            </div>
                            
                            {/* <div className='header-sec1-middle'>
                                <span>Tell a friend about Drou & get 20% off *</span>
                            </div> */}
                            <div className='header-sec1-right flex gap-3 items-center'>
                            <div className='header-lang'>
                                <li className='relative'>
                                {/* <Image src={FlagEng} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/> */}
                                   <span className='flex items-center gap-2'>{t('Language')}</span>
                                    <ul className='header-lang-dropdown absolute top-full left-0 bg-white py-5 px-4'>
                                    <li className='flex items-center gap-2 mb-3 lang_btn'><Image src={FlagEng} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>EN</li>
                                    <li className='flex items-center gap-2 mb-3 lang_btn'><Image src={FlagAz} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>AZ</li>
                                    <li className='flex items-center gap-2 mb-3 lang_btn'><Image src={FlagRu} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>RU</li>
                                        {/* {
                                            languages.map(lang=>{
                                                return(
                                                    // onClick={ () => changeLanguage(lang.name)}
                                                    //<Image src={FlagEng} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>
                                                    
                                                )
                                            })
                                        } */}
                                        {/* <li  onClick={ () => changeLanguage('en')} className='flex items-center gap-2 mb-3'><Image src={FlagEng} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>Eng</li>
                                        <li onClick={ () => changeLanguage('az')}  className='flex items-center gap-2 mb-3'><Image src={FlagAz} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>Az</li>
                                        <li  onClick={ () => changeLanguage('ru')} className='flex items-center gap-2 mb-3'><Image src={FlagRu} width={20} height={20} className='header-lang-flag rounded-full ml-2' alt="Language"/>Ru</li> */}
                                    </ul>
                                </li>
                            </div>
                                {islogin==0?(<ul className='flex'>

                                    <li>
                                    {/* <Link href='/login/'>{t('login')}</Link> */}
                                    <Link href="/login">{t('Login/Signup')}</Link>
                                    </li>
                                </ul>):(<ul className='flex'>
                                <li className='header-user-list flex items-center gap-1 relative cursor-pointer'>
                                    {t('My Account')}
                                    <Image src={UserImg} width={30} height={30} className='header-user-img rounded-full ml-2' alt="User Img"/>
                                    <ul className='header-user-dropdown absolute top-full right-0 bg-white py-5 px-4' >
                                        <Link href='/account/profile'>{t('Profile')}</Link>
                                        <Link href='/account/history'>{t('My Orders')}</Link>
                                        <Link href='/account/projects'>{t('My Projects')}</Link>
                                        <Link href='#' onClick={logout}>{t('Log Out')}</Link>
                                    </ul>
                                </li>
                            </ul>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className={isScrolled ? 'frd-container mx-auto' : 'frd-container mx-auto'}>
                        <div className='flex justify-between items-center py-2'>
                            <div className='logo'>
                            <Link className='nav-link' href={'/'}>
                                <Image src={Logo} width={180} className='header-logo' alt="Faradey"/>
                            </Link>  
                                    
                            </div>
                            <div className='search-input-wrap relative flex items-center justify-center rounded overflow-hidden w-3/5 p-1 invisible lg:visible'>
                                <input type='text' className='h-10 py-1 px-3 outline-none'  placeholder='Search...' onKeyDown={searchEnter}/>
                                <button type='button' className='w-7' onClick={searchClick}>
                                    <FontAwesomeIcon icon={faSearch} color='#222' className='text-lg' />
                                </button>
                            </div>
                           
                            <div className='extra flex gap-5 md:gap-6 items-center'>
                                
                                
                                <Link href={'/wishlist'}><UilHeart size="28" color="#333333"/> </Link>
                                {
                                    totalQuantity>0?(
                                    <div className='relative'>
                                        <UilShoppingBag size="28" color="#333333"/>
                                        
                                        <div className='absolute cart-item-count inline-flex items-center justify-center rounded-full text-white text-xs font-semibold' id="cart_quantity">{totalQuantity}</div>
                                        <Cartdropdown />
                                    </div>
                                ):(<div className='relative'>
                                    <UilShoppingBag size="28" color="#333333"/>
                                    <div style={{display:"none"}} className='absolute cart-item-count inline-flex items-center justify-center rounded-full text-white text-xs font-semibold' id="cart_quantity">{totalQuantity}</div>
                                    <Cartdropdown />
                                </div>)
                                }
                                
                                {/* <UilBars size="28" color="#333333"/>  */}
                                <Link href={'/compare'}><FontAwesomeIcon className='comp_icon_reg' icon={faScaleBalanced} style={{fontSize:22}}  color="#333333" /></Link>

                                <div className ={ `${show ?"relative header-extra-mobile-menu-btn active flex items-center justify-center" : "relative header-extra-mobile-menu-btn flex items-center justify-center"} ` } onClick ={()=>setShow(true)}>
                                        <FontAwesomeIcon icon={faBars} color='#333' className='text-3xl' />
                          </div>
                </div>
                        </div>
                        <nav >
                <div className='nav hidden lg:block '>
                    <ul className='header-nav-ul justify-center flex items-center mb-0 pl-0'>
                        <li className='nav-item'>
                            <Link className='nav-link' href={`/`}>{t('Home')}</Link>
                            
                        </li>
                        <li className='nav-item dropdown'>
                            <Link className='nav-link' href={'/categories'}>{t('Categories')}</Link>
                            <div className='nav-dropdown nav-dropdown-categories'>
                                <div className='nav-dropdown-2'>
                                    <ul className='nav-dropdown-ul'>
                                    {
                                        mainCategories.filter(main=>main.folder==1).map(main=>{
                                            return(
                                                <li className='nav-dropdown-item hasdropdown'>
                                                    <Link href={"/category/" + main.id} className='nav-dropdown-link'>{main.name}</Link>
                                                    <div className='nav-dropdown-2-1'>
                                                        <ul className='nav-dropdown-ul'>
                                                            {
                                                                categories.filter(cat=>cat.mainId==main.id&&cat.folder==1).map(cat=>{
                                                                    return(
                                                                    <li className='nav-dropdown-item hasdropdown'  >
                                                                        <Link href={"/category/" + cat.id} className='nav-dropdown-link'>{cat.name}</Link>
                                                                        <div className='nav-dropdown-2-1'>
                                                                                <div className=''>
                                                                                    <ul className='nav-dropdown-ul'>
                                                                                        {
                                                                                            subCategories.filter(sub=>sub.mainId==cat.id).map(sub=>{
                                                                                                return(
                                                                                                    <li className='nav-dropdown-item'>
                                                                                                        <Link href={"/category/" + sub.id} className='nav-dropdown-link'>{sub.name}</Link>
                                                                                                    </li>

                                                                                                )
                                                                                                

                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                        </div>
                                                                    </li>
                                                                    )
                                                                    

                                                                })
                                                                
                                                            }
                                                            {
                                                                categories.filter(cat=>cat.mainId==main.id&&cat.folder==0).map(cat=>{
                                                                    return(
                                                                        <li className='nav-dropdown-item'>
                                                                            <Link href={"/category/" + cat.id} className='nav-dropdown-link'>{cat.name}</Link>
                                                                        </li>
                                                                    )

                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                        {
                                            mainCategories.filter(main=>main.folder==0).map(main=>{
                                                return(
                                                    <li className='nav-dropdown-item'>
                                                        <Link href={"/category/" + main.id} className='nav-dropdown-link'>{main.name} </Link>
                                                    </li>

                                                )
                                                

                                            })
                                        }
                                        
                                    </ul>
                                </div>
                            </div>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' href={'/solutions'}>{t('Solutions')}</Link>                 
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' href={'/about'}>{t('About')}</Link>                              
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' href={'/faq'}>{t('FAQ')} </Link>                 
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' href={'/contact'}>{t('Contact')}</Link>                              
                        </li>
                        {/* Other */}
                        <li className='nav-item hidden other dropdown'>
                            <Link className='nav-link' href='javascript:void(0)'>{t('Other')} </Link>
                            <div className='nav-dropdown'>
                                <div class="nav-dropdown-2">
                                    <ul class="nav-dropdown-ul">
                                        
                                    </ul>
                                </div>
                            </div>                      
                        </li>

                    </ul>
                </div>
            </nav>
                    </div>
                </div>
                 {/* Navigation */}
                 
            </div>
        </header>
    </>
    
  )
}

