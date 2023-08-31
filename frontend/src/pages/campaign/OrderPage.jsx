import React from 'react'
import { useEffect, useContext, useState } from 'react'
import {GET, requestPay, PUT} from "../../components/Aaxios";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MdArrowRight } from 'react-icons/Md'
import { RiInformationLine } from 'react-icons/Ri'
import {Context} from "../../components/store/Context";


const OrderPage = () => {
    const props = useContext(Context);
	const userInfo = props.userInfo;

    const [detail, setDetail] = useState('');
    const [ detailData, setDetailData ] = useState("");
    const lc = useLocation();
    const loca = useLocation();
    const recycleNo = lc.state.recycleNo;
    const no = loca.state.no;
    const orderCnt = loca.state.orderCnt;


    useEffect(() => {
        GET(`/api/goods/${no}`)
        .then((response) => {
            console.log(response.data);
            setDetailData(response.data);
        })
        .catch((err) => {
        console.log(err + " 서버요청 에러 ");
        return;
        });
    }, [])

    useEffect(() => {
        GET(`/api/campaign/${recycleNo}`)
        .then((res) => {
            console.log(res.data);
            setDetail(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
      }, [])


      /** 결제 */
    const payBtn = () => {
    const data = {
      name: detail? detail.bookName : detailData.goods.name,
      price: detail? detail.salePrice : (detailData?.goods.price * orderCnt),
      pd_type : detail? "R" : "G",
      pd_no : detail? detail.recycleNo : detailData.goods.no,
      pd_cnt : detail? 1 : orderCnt,
      userInfo: userInfo
    }
    requestPay(data);
  }
  const navigate = useNavigate();

  
 

  return (
    <main id='pageContainer' className='order'>
        <div id='pageVisual'>
            <section>
                <div className='orderContent'>
                   <table>
                    <caption>주문/결제</caption>
                    <thead>
                        <tr>
                            <td></td>
                            <td>상품</td>
                            <td>상품 금액</td>
                            <td>수량</td>
                            <td>총 결제금액</td>
                        </tr>
                    </thead>
                { recycleNo &&
                    detail !== null ?
                    <tbody>
                        <tr>
                            <td><img src={detail?.bookImgUrl} /></td>
                            <td className='bookDetail'>{detail?.bookName}</td>
                            <td>{detail?.salePrice}원</td>
                            <td>1개</td>
                            <td>{detail?.salePrice}원</td>
                        </tr> 
                    </tbody>
                    : null
                }
                { detailData &&
                    no !== null &&
                    <tbody>
                     <tr>
                         <td><img src={detailData[0].images.imgPath} alt={detailData[0].images.no}/></td>
                         <td className='bookDetail'>{detailData[0].goods.name}</td>
                         <td>{detailData[0].goods.price.toLocaleString()}원</td>
                         <td>{orderCnt}개</td>
                         <td>{(detailData[0].goods.price*orderCnt).toLocaleString()}원</td>
                     </tr> 
                    </tbody>
                }
                  </table>
                   <div className='buyinfoArea'>
                    <div className="infoBox">
                        <div className='name'>
                            <span className='infotitle'>주문자 성명</span>
                            <div>{userInfo?.name}</div>
                        </div>
                        <div className='call'>
                            <span className='infotitle'>연락처</span>
                            <div>{userInfo?.phone}</div>
                        </div>
                        <div className='payment'>
                            <span className='infotitle'>결제방법</span>
                            <div>카드</div>
                        </div>
                        <div className='email'>
                            <span className='infotitle'>이메일</span>
                            <div>{userInfo?.email}</div>
                        </div>
                    </div>
                    <div className='location'>
                    <label className='infotitle'>배송지 주소</label>
                    <div className='zip'>
                        <input type='text' defaultValue={userInfo?.zipCode} placeholder={userInfo?.zipCode} readOnly/>
                    </div>
                        <input type='text' placeholder={userInfo?.address} defaultValue={userInfo?.address} readOnly/>
                        <input type='text' placeholder={userInfo?.address_detail}  id="locationDetail" defaultValue={userInfo?.address_detail} readOnly/>
                        <div className="caption"><RiInformationLine/> <b>배송지 변경</b>은 <Link to={`/member/info`}><u>‘마이페이지</u><MdArrowRight/><u>내 정보’</u></Link>에서 변경해 주세요.</div>
                    </div>
                    </div>
                    <div className='buybtnBox'>
                        <button type='button' onClick={payBtn}>구매하기</button>
                    </div>
                </div>
            </section>
        </div>
    </main>
    
  )
}

export default OrderPage