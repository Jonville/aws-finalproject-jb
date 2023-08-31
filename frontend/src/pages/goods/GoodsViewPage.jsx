import React, { useEffect, useState , useContext , useRef } from 'react'
import axios from "axios";
import { useParams, useNavigate , Link } from "react-router-dom"
import { IoIosHeartEmpty, IoIosHeart, IoIosArrowBack } from "react-icons/Io"
import { Context } from "../../components/store/Context"

import SideBar from '../../components/layout/SideBar'

import '../../styles/base/sub.css'
import '../../styles/base/goodsStyle.css'

const GoodsViewPage =  () => {
  // useInfo
  const props = useContext(Context);
  const userInfo = props.userInfo;


  // data
  const { no } = useParams();
  const [ detailData, setDetailData ] = useState("");
  const fetchDetailData = () => {
    axios
      .get(`/api/goods/${no}`)
      .then(res => setDetailData(res.data))
      .catch(err => console.log(err));
  };
  useEffect(() => fetchDetailData(), [no]);

  console.log(detailData);

  // count
  const [orderCnt, setOrderCnt] = useState('1');
  const [totalPrice, setTotalPrice] = useState('');
  const selectCnt = (e) => {
    const value = Number(e.target.value);
    if (Number.isNaN(value)) return;
    if (value === 0) return;
    if (value > detailData[0].goods.inventory) return;
    setOrderCnt(value);
    setTotalPrice(value * detailData[0].goods.price);
  } 

  const orderChk = (e) => {
    if (selectCnt === 0 || selectCnt > detailData[0].goods.inventory) e.preventDefault();
  }


  
  // navigate
  const navigate = useNavigate(); 
  const backBtn = () => { navigate(-1);};
  const handleEditButtonClick = () => navigate(`/goods/${no}/edit`);



  return (
    <main id="pageContainer" className="goods typeView">
      {detailData && <>
        <div id="pageVisual">
          <div className="visualInner">
            <Link className="backBtn" onClick={backBtn}><IoIosArrowBack /></Link>
            <div className="imgBox">
              <img id="goodsThumb" src={detailData[0].images.imgPath} alt={detailData[0].goods.name}/>
              <div className="imgContent">
                <h3 className="goodsName">{detailData[0].goods.name}</h3>
                <p className="goodsPrice">{(detailData[0].goods.price).toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </div>
        

          <div id="pageContents">
            <section className="detailSection typeOption">
              <h4 className="head">상품선택</h4>
                <div className="content">
                  <label className="cnt">
                    <strong>수량</strong>
                    <input type="number" defaultValue={orderCnt} min="1" max={detailData[0].goods.inventory} onChange={selectCnt} /> 개
                  </label>
                  <label className="price">
                    <strong>총 금액</strong>
                    <span className="number">{(orderCnt * detailData[0].goods.price).toLocaleString()} 원</span>
                  </label>
                  {userInfo?.authority == null && userInfo?.authority == undefined ? (
                    <Link className='goSignin' to={`/auth/signip`} type="button" > <span> 로그인 후 주문 가능합니다! </span> </Link>
                  ) : (
                    <Link className="orderBtn" to={`/order`} state={{no : detailData[0].goods.no , orderCnt : orderCnt}} onClick={orderChk}>구매하기</Link>
                  )}
                  
                  {userInfo?.authority == "A" && (
                    <button className="updateBtn" onClick={handleEditButtonClick}> 정보 수정 </button>
                  )}
                </div>
            </section>
            <section className="detailSection typeDetails">
              <h4 className="head">상세정보</h4>
              <div className="content">
                <pre>
                  <p>{detailData[0].goods.content}</p>
                  {Array.from({length: Math.ceil(detailData.length)}).map((_, index) => (
                    <img className="goodsDetailImg"
                      src={detailData[index].images.imgPath}
                      key={index} />
                  ))}
                </pre>
              </div>
            </section>
          </div>
        </>
      }

      <SideBar/>
    </main>
    )
  
}

export default GoodsViewPage