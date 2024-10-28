'use client'
import React, { useState ,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import Link from 'next/link';
import { UilPhone, UilInfo, UilMap, UilEnvelope } from '@iconscout/react-unicons'
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { API_URL } from '@/constants';

function Icon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  }
  
export default function Contact() {
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
    
  async function fetchData(){
    if (typeof localStorage !== 'undefined') {
      if(localStorage.getItem("langId")!=null){
        lang_id=localStorage.getItem("langId");
      }
      
  }
    const params = new URLSearchParams();
    params.append('LanguageID',lang_id);
    const response = await fetch(
      `${API_URL}/api/about/get-index?${params.toString()}`
    );
    const data = await response.json();
    return data.output;
  }
  const [open, setOpen] = React.useState(0);
 
  const handleOpen = (value) => setOpen(open === value ? 0 : value);
  const [data, setData] = useState({ 
    faq: [], 
    settings: []
  });


  useEffect(() => {

  async function fetchDataAsync() {

    const fetchedData = await fetchData();
      setData(fetchedData);
      await i18n.changeLanguage(lang_id);
    }

    fetchDataAsync();
    }, []);
  const faq=data.faq;
  const settings=data.settings;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(`${API_URL}/api/about/add-message`, {
            method: "POST",
            headers: {
              'Accept': 'application/json, text/plain',
              'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
              Name: name,
              Email: email,
              Subject: subject,
              Message:text
            }),
          });
          const resJson = await res.json();
          if (res.status === 200) {
            setName("");
            setEmail("");
            setSubject("");
            setText("");
            setMessage(t('Message sent successfully'));
          } else {
            setMessage(t('Some error occured'));
          }
        } catch (err) {
          console.log(err);
        }
      };
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
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('FAQ')} </a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* FAQ  Section */}
        <section className='faq-main-section mt-5 pt-16'>
          <div className='custom-container mx-auto'>
            <div className=''>
              <h1 className='text-center md:text-left text-xl md:text-4xl font-bold mb-3'>{t('Frequently Asked Questions')}</h1>
              <p className='text-center md:text-left '>{t('People love our products and our customers too. We believe it!')}</p>
            </div>

            <div className='collapse-wrapper mt-10'>
              {
                faq.map(quest=>{
                  return(
                      <Accordion key={quest.id} open={open === 1} icon={<Icon id={quest.id} open={open} />}>
                        <AccordionHeader onClick={() => handleOpen(1)}>
                        {quest.question}
                        </AccordionHeader>
                        <AccordionBody>
                        {quest.answer}
                        </AccordionBody>
                      </Accordion>
                  )
                })
              }
                
            </div>
            
            {/* Ask us anything here */}
            <div className='askanything-wrapper pt-20 pb-16'>
                <div className='grid items-center gap-5'>
                    <div className='form p-16'>
                        <form className="w-full" onSubmit={handleSubmit}>

                <h1 className='text-center text-2xl md:text-4xl font-semibold ls-5 mb-12'>{t('Ask us anything here')}</h1>
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full md:w-1/2 px-3">
                    
                        <input className="appearance-none block w-full  border rounded-full py-3 px-4  leading-tight" 
                            id="grid-first-name" 
                            type="text" value={name}
                            placeholder={t('Fullname')} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="w-full md:w-1/2 px-3">
                        
                        <input className="appearance-none block w-full border rounded-full py-3 px-4 leading-tight" 
                            id="grid-last-name" 
                            type="email" value={email}
                            placeholder={t('Email')} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                </div>
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full px-3">
                        
                        <input className="appearance-none block w-full border rounded-full py-3 px-4 leading-tight" 
                            id="grid-last-name" 
                            type="text" value={subject}
                            placeholder={t('Subject')} onChange={(e) => setSubject(e.target.value)} />
                    </div>

                </div>
                
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full px-3">
                        
                        <textarea name="postContent" value={text}
                            className='appearance-none block w-full border rounded py-3 px-4 leading-tight' 
                            placeholder={t('Message')} onChange={(e) => setText(e.target.value)}/>

                    </div>

                </div>

                <div className=''>
                    <button type="submit" className='inline-block border-none font-bold'>{t('Send message')}</button>
                </div>
                <div className="message">{message ? <p>{message}</p> : null}</div>
            </form> 
                    </div>
                    {
                      settings.map(set=>{
                        return(
                        <div className='info pl-10'>
                           <div className='info-item flex gap-3 mb-14'>
                                <div className='icon'>
                                    <UilPhone  size="45" color="#e52e06" />
                                </div>
                                <div className='content'>
                                    <h6>{t('Call for help now!')}</h6>
                                    <Link href='' className='inline-block text-3xl md:text-5xl font-bold hover-red'>{set.phone}</Link>
                                </div>
                           </div>         
                           <div className='info-item flex gap-3 mb-14'>
                                <div className='icon'>
                                    <UilEnvelope size="45" color="#e52e06" />
                                </div>
                                <div className='content'>
                                    <h6>{t('Say hello')}</h6>
                                    <Link href='' className='hover-red text-2xl md:text-4xl'>{set.email}</Link>
                                </div>
                           </div>         
                           <div className='info-item flex gap-3'>
                                <div className='icon'>
                                    <UilMap  size="45" color="#e52e06" />
                                </div>
                                <div className='content'>
                                    <h6>{t('Address')}</h6>
                                    <p className=''>{set.address}</p>
                                </div>
                           </div>         
                        </div>
                        )
                      })
                    }
                    
                </div>
            </div>
          </div> 
        </section>

    </main>
  )
}

