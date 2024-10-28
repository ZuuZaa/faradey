import {React, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next';
import '../../i18n'





const MobileMenu = ({ items }) => {
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

  // State to keep track of which submenu is open. Using null to indicate that no submenu is open.
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (index) => {
    // If the submenu is already open, close it, otherwise open the clicked one
    if (openSubmenu === index) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(index);
    }
  };

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
    <div className="mobile-offcanvas-menu-list py-5">
      <ul className="menu-list">
        {mainCategories.filter(main=>main.folder==1).map((item, index) => (
          <li key={index} className="has-subcategory">
            <div className='flex justify-between items-center'>
              <a href={"/category/" + item.id}>{item.name}</a>
              <button className="toggle-submenu" onClick={() => toggleSubmenu(index)}>
                {openSubmenu === index ? '-' : '+'}
              </button>
            </div>
            <div>
              {openSubmenu === index && (
                <ul className="submenu">
                  {categories.filter(cat=>cat.mainId==item.id).map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a href={"/category/" + subItem.id}>{subItem.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
        {mainCategories.filter(main=>main.folder==0).map((item, index) => (
          <li key={index} className="has-subcategory">
            <div className='flex justify-between items-center'>
              <a href={"/category/" + item.id}>{item.name}</a>
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Usage example:
export default MobileMenu