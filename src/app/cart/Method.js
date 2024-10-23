'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'

const Method = ({ isOpen, onClose, children, isLogin }) => {
    
    if (!isOpen) return null;
     const [paymentType, setPaymentType] = useState("");
    
    const [checkboxes, setCheckboxes] = useState({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false
      });
      const handleCheckboxClick = (checkboxName) => {
        // Create a new object to update checkboxes state
        const updatedCheckboxes = {};
        // Uncheck all checkboxes except the clicked one
        Object.keys(checkboxes).forEach((name) => {
          updatedCheckboxes[name] = name === checkboxName;
        });
        // Update checkboxes state
        setCheckboxes(updatedCheckboxes);
        setPaymentType(checkboxName)
      };
      let submitClick=async (event)=>{
        console.log(isLogin)
        if(paymentType=="checkbox1" || paymentType=="checkbox2"){
            window.location.href="/checkout"
        }
        else{
            
            if(isLogin==0){
                window.location.href="/login"
            }
            else{
                //satisi bitir
                window.location.href="/success"
            }
        }
      }
      const { t, i18n } = useTranslation();
      
        const changeLanguage = async (lng) => {
        await i18n.changeLanguage(lng);
        };
    return (
        
        <div className='method-modal-wrapper'>
            <div className='account-lr-wrap mx-auto p-8 text-center'>
                    <h4 className='account-page-title'>{t('Method')}</h4>
                    <p className='mb-8'>{t('Please choose payment type for your order')}.</p>
                    <form className="w-full">
                        <div className='flex justify-between md:justify-start gap-2'>
                            
                            <div className='method-flex flex items-center mb-4'>
                                <label className='text-sm'>{t('Cash')}</label>
                                <input className='payment_type' value='1' type='checkbox' name='method-chkb' checked={checkboxes.checkbox1} onChange={() => handleCheckboxClick('checkbox1')}/>
                            </div>
                            <div className='method-flex flex items-center mb-4'>
                                <label className='text-sm'>{t('Card')}</label>
                                <input className='payment_type' value='2' type='checkbox' name='method-chkb' checked={checkboxes.checkbox2} onChange={() => handleCheckboxClick('checkbox2')}/>
                            </div>
                            <div className='method-flex flex items-center mb-4'>
                                <label className='text-sm'>{t('Transfer')}</label>
                                <input className='payment_type' value='3' type='checkbox' name='method-chkb' checked={checkboxes.checkbox3} onChange={() => handleCheckboxClick('checkbox3')}/>
                            </div>

                        </div>
                        <div class='mt-5 flex gap-3 justify-center'>
                            <button type="button" class="account-page-btn link-design1 inline-block border-none font-bold" onClick={submitClick}>{t('Submit')}</button>
                            <span class="account-page-btn link-design1 inline-block border-none font-bold cursor-pointer" onClick={onClose}>{t('Cancel')}</span>
                        </div>
                    </form>
            </div>
        </div>
    );
};

export default Method;