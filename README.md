      <div className='flex'>
                            {/* First Column */}
                            <div className='first-column'>
                                <div className='row'><h5>{t('Action')}</h5></div>
                                <div className='row'><h6>{t('Product name')}</h6></div>
                                <div className='row'><h6>{t('Product image')}</h6></div>
                                <div className='row'><h6>{t('Product about')}</h6></div>
                                <div className='row'><h6>{t('Product description')}</h6></div>
                                {/* <div className='row'><h6>{t('Availability')}</h6></div> */}
                            </div>
                            {
                                compareProducts.map(product=>{
                                    let stock_text="";
                                    if(product.productStock>0){
                                        stock_text=`${t('Available In stock')}`  
                                    }
                                    else{
                                        stock_text=`${t('Unavailable In stock')}` 
                                    }
                                    const regex = /<p[^>]*>.*?<\/p>/g;

                                    const array = [];
                                    
                                    let match;
                                    while ((match = regex.exec(product.productDescription)) !== null) {
                                      array.push(match[0].trim());
                                    }
                                    
                                    return(
                                        <div className='product-column' >
                                            <div className='row'> <span className='remove-compare-item-span hover-red-bg' onClick={removeCompare} id={product.productId}><UilMultiply size="12" color="#ffffff" /></span> </div>
                                            <div className='row'> {product.productName} </div>
                                            <div className='row'>
                                                <div className='flex flex-col'>
                                                    <img src={product.productImage} width={150} height={150} className='blog-swiper-item-img object-cover mx-auto' alt='Product'></img>
                                                    {/* <Image src={PImg1} width={150} height={150} className='blog-swiper-item-img object-cover mx-auto' alt='Blog'/> */}
                                                    <h5 className='text-red-600 font-semibold my-3'>On Sale <span className='font-medium ml-1'>{product.productPrice.toFixed(2)}₼</span></h5>
                                                    <Link href={"/details/" + product.productId} key={product.id} passHref={true} className='hover-red'>{t('View product')}</Link>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <p>{product.productAbout}</p>
                                            </div>
                                            <div className='row' style={{textAlign:"start"}}>
                                              {
                                               array.map((x,i)=>(
                                                <div key={i} className='prod-desc'style={{borderBottom:"1px solid #ebebeb"}} dangerouslySetInnerHTML={{ __html: x }}  />
                                               ))
                                              }
                                            </div>
                                            
                                            {/* <div className='row'>
                                                <h6>{stock_text}</h6>
                                            </div> */}
                                        </div>
                                      
                                    )
                                })

                            }
                            
                        </div>