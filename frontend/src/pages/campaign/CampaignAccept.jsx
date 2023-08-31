import React from 'react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {GET, PUT} from "../../components/Aaxios";
import { IoIosArrowBack } from "react-icons/Io";


const CampaignAccept= () => {
  const [acceptList, setAcceptList] = useState([]);

  useEffect(() => {
    GET(`/api/campaign/list?acceptYn=N`)
    .then((res) => {
      setAcceptList(res.data);
    })
    .catch((err) => {
      console.log(err);
    })
  }, [acceptList?.acceptYn])

  /* 승인 버튼 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        recycleNo: no,
        acceptYn: "Y",
        status: selected,
        discountRate: selected == "S" ? 10 : selected == "G" ? 20 : selected == "N" ? 30 : 50,
        salePrice: price - (price * (selected == "S" ? 10 : selected == "G" ? 20 : selected == "N" ? 30 : 50)/100)
    }
    PUT((`/api/campaign/accept/${no}`), data)
    .then((res) => {
        alert("승인 완료되었습니다.")
    })
    .catch((err) => {
    })
  }
  
  if(handleSubmit){
    if(acceptList == null){
      navigate("/campaign");
    }
  }

  const [price, setPrice] = useState('');

  const [selected, setSelected] = useState('');
  const onChangeSelected = (e) => {
		setSelected(e.target.value);
	};

const [no, setNo] = useState('');
const navigate = useNavigate();

//뒤로가기 버튼
const onClick = () => {
  navigate(-1);
}





  return (
    <main id="pageContainer" className="campaign">
      <div id="pageContents">
        <form className="modalArea" onSubmit={handleSubmit}>
        <div className="campaignModal">
        <div className="acceptList">
          <div className="resultBox">
            <div className='backBtn'>
              <button type='button' onClick={onClick}><IoIosArrowBack /></button>
            </div>
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td>no</td>
                  <td>책 제목</td>
                  <td>정가</td>
                  <td>상태</td>
                  <td>승인여부</td>
                </tr>
              </thead>
              {acceptList && acceptList.map((list) => {
              return (
                <tbody key={list?.recycleNo}>
                  <tr>
                    <td><label htmlFor={no}><input type='checkbox' id={list?.recycleNo} name={list?.recycleNo} value={no} onChange={(e) => setNo(e.target.name)}/></label></td>
                    <td><label value={list?.recycleNo} htmlFor={list?.recycleNo}>{list?.recycleNo}</label></td>
                    <td className='imgBox'><label htmlFor={list?.recycleNo}><img src={list?.bookImgUrl} />{list?.bookName} </label></td>
                    <td><input type='checkbox' id={list?.bookPrice} name={price} value={price} onClick={(no) => setPrice(no.target.id)} required/><label htmlFor={list?.bookPrice}>{list?.bookPrice}</label></td>
                    <td>
                        <select onChange={onChangeSelected} defaultValue={selected} name={list?.recycleNo}>
                          <option>-- 상태 --</option>
                          <option value="S" >최상</option>
                          <option value="G" >상</option>
                          <option value="N" >중</option>
                          <option value="B" >하</option>
                        </select>
                        {/* <button type='button' value="S" onClick={() => setStatus("S")}>최상</button>
                        <button type='button' value="G" onClick={() => setStatus("G")}>상</button>
                        <button type='button' value="N" onClick={() => setStatus("N")}>중</button>
                        <button type='button' value="B" onClick={() => setStatus("B")}>하</button> */}
                    </td>
                    <td><button type='submit'>승인</button></td>
                  </tr>
                </tbody>
              )}) }
                
            </table>
            
          </div>
        </div>
      </div>
      </form>
    </div>
    </main>
  )
}

export default CampaignAccept