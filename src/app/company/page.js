'use client'
import React from 'react'

export default function Terms() {
  return (
    <main>

        {/* Breadcrumb */}
        <div className='breadcrumb-wrapper py-8'>
          <div className='custom-container mx-auto'>
            <div className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">

                <li className="inline-flex items-center">
                  <a href="#" className="inline-flex items-center text-sm font-medium"> Home </a>
                </li>

                <li>
                  <div className="flex items-center">
                    <a href="#" className="ms-1 text-sm font-medium md:ms-2">Terms & Conditions</a>
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </div>

        <section className='company-main-section mt-5 pt-16 pb-16'>
          <div className='custom-container mx-auto'>
            <h1 className='text-left text-2xl md:text-4xl font-bold mb-7'>Terms & Conditions</h1>
            <div>
              <p className='text-lg'>
                  Welcome to Website Name! <br/>
                  These terms and conditions outline the rules and regulations for the use of Company Name's Website, located at Website.com.
                  <br/><br/>
                  By accessing this website we assume you accept these terms and conditions. Do not continue to use Website Name if you do not agree to take all of the terms and conditions stated on this page.
                  <br/><br/>
                  The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person log on this website and compliant to the Company's terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same
              </p>

              <h5 className='text-xl font-semibold mt-7'>Cookies</h5>
              <p className='text-lg'>
                We employ the use of cookies. By accessing Website Name, you agreed to use cookies in agreement with the Company Name's Privacy Policy.
                <br/><br/>
                Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
              </p>

              <h5 className='text-xl font-semibold mt-7'>License</h5>
              <p className='text-lg'>
                Unless otherwise stated, Company Name and/or its licensors own the intellectual property rights for all material on Website Name. All intellectual property rights are reserved. You may access this from Website Name for your own personal use subjected to restrictions set in these terms and conditions.
               </p>

            </div>
          </div>
        </section>
    </main>
  )
}

