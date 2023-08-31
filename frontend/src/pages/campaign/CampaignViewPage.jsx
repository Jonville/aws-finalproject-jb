import React, { useEffect, useContext, useState} from 'react';
import { useNavigate, useParams, Link} from "react-router-dom";
import {GET, POST} from "../../components/Aaxios";
import {Context} from "../../components/store/Context";
import { IoIosArrowBack } from "react-icons/Io";
import { RiInformationLine } from 'react-icons/Ri'


import '../../styles/base/sub.css'
import '../../styles/base/campaignStyle.css'

const CampaignViewPage = () => {
  const props = useContext(Context);
	const userInfo = props.userInfo;

  const navigate = useNavigate(); 
  const backBtn = () => { navigate("/campaign"); };

  const [detail, setDetail] = useState('');
  const { no } = useParams();

  useEffect(() => {
    GET(`/api/campaign/${no}`)
      .then((res) => {
        setDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])


  return (
      <main id="pageContainer" className="campaign view">
      {detail &&
        <>        
        <div id="pageVisual">
        <section className="top">
         <a href='#' onClick={backBtn}><IoIosArrowBack /></a>
         <div className='imgBox'>
           <img src={detail.bookImgUrl}/>
           <div className='imgContent'>
             <b className='title'>{detail.bookName}</b>
             <span className='author'>{detail.bookAuthor}</span> 
             {
              userInfo == null && 
              <div className='caption'><RiInformationLine/><b>구매는 회원만 가능합니다.</b></div>
             } 
             {
              userInfo?.authority == "A" ? null :
              detail?.saleYn == "Y" ? 
              <div className='buyBtn sale'> 판매완료 </div> :
               userInfo == null ? "" :
                <div className='buyBtn'>
                <Link to={`/order`} state={{recycleNo : detail.recycleNo}} className='buy'>구매하기</Link>
                </div> 
             }     
           </div>
         </div>
        </section>
       </div>
      
       <div id="pageContents">
         <section className='detailSection'>
           <div className='detail basic'>
             <div className='head'><b>기본정보</b></div>
             <div className='content'>
               <ul>
                 <li>출판</li>
                 <li>정가</li>
                 <li>할인율</li>
                 <li>판매가</li>
                 <li>상태</li>
               </ul>
               <ul>
                 <li>{detail.publisher}</li>
                 <li>{detail.bookPrice.toLocaleString()}원</li>
                 <li>{detail.discountRate}%</li>
                 <li>{(
                   detail.bookPrice -
                   (detail.bookPrice * detail.discountRate) / 100
                 ).toLocaleString()}원</li>
                 <li className={detail.status == "S" ? 'status gradeS' : detail.status == "G" ? "status gradeG" : detail.status == "N" ? "status gradeN" : "status gradeB"}>{detail.status == "S" ? "최상" : detail.status == "G" ? "상" : detail.status == "N" ? "중" : "하"}</li>
               </ul>
             </div>
           </div>
           <div className='detail book'>
             <div className='head'><b>책소개</b></div>
             <pre className='content'>{detail.bookDetail}</pre>
           </div>
           <div className='detail author'>
             <div className='head'><b>작가소개</b></div>
             <div className='content'>
              <div className='authorInfo'>
                <b>{detail.bookAuthor}</b>
                <small>지음</small>
              </div>
              <pre className='des_book_authorDt'>{detail.authorDetail}</pre>
             </div>
             
           </div>
         </section>
       </div>
       </>
      }
      
    </main>
    
  )
}

export default CampaignViewPage