'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import { UilPhone, UilInfo, UilMap, UilEnvelope } from '@iconscout/react-unicons'
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import VerificationModal from './verification';
import Swal  from 'sweetalert2';

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
 
  
export default function Register() {
  const [isModalOpen, setModalOpen] = useState(false);

  // const [open, setOpen] = useState(0);
  // const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [password,setPassword]=useState("");
  const [message, setMessage] = useState("");

  const buttonRef = useRef(null)
  
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://89.40.2.200:3461/api/account/register", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8'
      },
        body: JSON.stringify({
          FirstName:firstname,
          LastName:lastname,
          Email: email,
          Password: password,
          Phone:phone,
          CompanyName:company,
          Position:position

        }),
      });
      const resJson = await res.json();
      console.log(resJson);
      if (res.status === 200) {
        
        if(resJson.status===400){
          setMessage(resJson.statusText);
        }
        else{
          Swal.fire({
            title: 'Thanks for registration!',
            text: 'We will contact with you soon.',
            icon: 'success',
            showConfirmButton: false,
            timer: 4000
          });
          //setMessage(t('Thanks for register. We will contact with you soonly!'));
          window.location.href="/login"
          // if (buttonRef.current) {
          //   buttonRef.current.click();
          // }
          
        }
        
      } else {
        setMessage(res.statusText);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const { t, i18n } = useTranslation();
      
      const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
    };
  
  return (
    <main>

        {/* Breadcrumb */}
        <div className='breadcrumb-wrapper py-8'>
          <div className='custom-container mx-auto'>
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                <li className="inline-flex items-center">
                  <a href="/" className="inline-flex items-center text-sm font-medium"> {t('Home')}</a>
                </li>
                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">{t('Register')}</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>
        
        {/* Register  Section */}
        <section className='login-register-main-section mt-5'>
          <div className='custom-container mx-auto'>
            <div className='account-lr-wrap mx-auto p-8 text-center'>
                <h4 className='account-page-title'>{t('Register')}</h4>
                <p className='mb-8'>{t('Please register by filling out the form below')}</p>
                <form className="w-full" onSubmit={handleSubmit}>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('First Name')}</label>
                    <input className='' type='text' placeholder={t('First Name')} value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('Last Name')}</label>
                    <input className='' type='text' placeholder={t('Last Name')} value={lastname} onChange={(e) => setLastname(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('Email')}</label>
                    <input className='' type='email' placeholder={t('Email')} value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('Phone')}</label>
                    <input className='' type='text' placeholder={t('Phone')} value={phone} onChange={(e) => setPhone(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('Company')}</label>
                    <input className='' type='text' placeholder={t('Company')} value={company} onChange={(e) => setCompany(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('Position')}</label>
                    <input className='' type='text' placeholder={t('Position')} value={position} onChange={(e) => setPosition(e.target.value)}/>
                  </div>
                  <div className='account-form-flex mb-4'>
                    <label className='text-sm'>{t('Password')}</label>
                    <input className='' type='password' placeholder={t('Password')} value={password} onChange={(e) => setPassword(e.target.value)}/>
                  </div>
                  <div class='mt-5'>
                    <button class="account-page-btn link-design1 inline-block border-none font-bold">{t('Register')}</button>
                  </div>     
                  <div className="message">{message ? <p className='text-green-500'>{message}</p> : null}</div>
                </form>
                {/* <span className='hover-red cursor-pointer text-sm mt-5'>Return to Store</span> */}
            </div>
          </div> 
        </section>

  {/* Verification Modal */}
      <button ref={buttonRef} className='verification-modal-btn'  onClick={() => setModalOpen(true)}></button>
      <VerificationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}  email={email}>
      </VerificationModal>

    </main>
  )
}

