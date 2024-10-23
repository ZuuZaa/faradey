import {React, useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'
import Link from 'next/link';
import { useRouter,usePathname, useSearchParams  } from 'next/navigation';
import { UilUser, UilHistory , UilApps, UilShield   } from '@iconscout/react-unicons'
export default function Menu() {
  const { t, i18n } = useTranslation();
    const router = useRouter();
    const pathname = usePathname()
    //const searchParams = useSearchParams()
    useEffect(() => {
  
      //console.log(searchParams);
  
    })
    const links = [
      { title: t('Profile'), path: '/account/profile', icon: 'UilUser' },
      { title: t('My Orders'), path: '/account/history', icon: 'UilHistory' },
      { title: t('My Projects'), path: '/account/projects', icon: 'UilApps' },
      { title: t('Properties'), path: '/account/properties', icon: 'UilApps' },
      { title: t('Security'), path: '/account/security', icon: 'UilShield' }
    ]
  return (
    <div>
        <ul>
            {links.map((link) => (
              <li className={pathname === link.path.replace("..","") ? 'hover-red active ' : 'hover-red'}>
                <Link href={link.path}>
                  {/* <UilApps size='20'/> */}
                  {link.title}
                </Link>
              </li>
            ))}
        </ul>
    </div>
    // <div>
    //     <ul>
    //         <li className={activeLink === 'home' ? 'active' : 'hover-red'}><Link href='/account/profile' onClick={() => handleLinkClick('home')}><UilUser size='20'/>Profile</Link></li>
    //         <li className={activeLink === 'projects' ? 'active' : 'hover-red'}><Link href='/account/projects' onClick={() => handleLinkClick('projects')}><UilApps size='20'/>Projects</Link></li>
    //         <li className={activeLink === 'orders' ? 'active' : 'hover-red'}><Link href='/account/history' onClick={() => handleLinkClick('orders')}><UilHistory  size='20'/>Orders</Link></li>
    //         <li className={activeLink === 'props' ? 'active' : 'hover-red'}><Link href='/account/properties' onClick={() => handleLinkClick('props')}><UilHistory  size='20'/>Properties</Link></li>
    //         <li className={activeLink === 'security' ? 'active' : 'hover-red'}><Link href='/account/security' onClick={() => handleLinkClick('security')}><UilShield size='20'/>Security</Link></li>
    //     </ul>
    // </div>
  )
}
